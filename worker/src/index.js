/**
 * worker/src/index.js
 * TACTUS Cloudflare Worker · tactus.digital
 *
 * Aufgaben:
 * 1. Statische App ausliefern (dist/ über env.ASSETS)
 * 2. Sync-Briefkasten (/api/relay/*): Pro Paar ein Durable Object, das nur
 *    verschlüsselte Pakete zwischenlagert, per WebSocket an das Partnergerät
 *    pusht und nach Abholung löscht. Der Server kann keinen Inhalt lesen.
 * 3. KI-Fallback (/api/ai/*): Leitet Gemini-Anfragen mit dem Betreiber-Key
 *    weiter – nur mit gültiger Lizenz und innerhalb eines Tageskontingents.
 *    Anfragen werden nicht gespeichert.
 * 4. Lizenzen (/api/license/*, /api/admin/*) in D1.
 */

import { DurableObject } from 'cloudflare:workers';

const ROOM_ID_RE = /^[a-f0-9]{64}$/;
const DEVICE_ID_RE = /^[A-Za-z0-9_-]{8,64}$/;
const MAX_PACKET_BYTES = 1_500_000;
const MAX_PACKETS_PER_ROOM = 2000;
const PACKET_TTL_MS = 30 * 24 * 3600 * 1000;
const ROOM_IDLE_DELETE_MS = 120 * 24 * 3600 * 1000;

const AI_MODELS = {
  'gemini-flash-latest': 'text',
  'gemini-3.8-flash': 'text',
  'gemini-3.5-flash-lite': 'text',
  'gemini-3.8-flash-tts': 'tts',
  'gemini-2.5-flash-preview-tts': 'tts'
};

// ---------------------------------------------------------------------------
// Hilfsfunktionen
// ---------------------------------------------------------------------------

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extraHeaders }
  });
}

async function sha256Hex(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function normalizeLicenseKey(key) {
  return String(key || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function generateLicenseKey() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  const chars = [...bytes].map(b => alphabet[b % alphabet.length]).join('');
  return `TACT-${chars.slice(0, 4)}-${chars.slice(4, 8)}-${chars.slice(8, 12)}-${chars.slice(12, 16)}`;
}

function timingSafeEqual(a, b) {
  const ea = new TextEncoder().encode(String(a));
  const eb = new TextEncoder().encode(String(b));
  if (ea.length !== eb.length) return false;
  let diff = 0;
  for (let i = 0; i < ea.length; i++) diff |= ea[i] ^ eb[i];
  return diff === 0;
}

// Kurzzeit-Cache pro Isolate, damit nicht jeder Sync-Push eine D1-Abfrage kostet
const licenseCache = new Map();

async function checkLicense(env, rawKey) {
  const key = normalizeLicenseKey(rawKey);
  if (key.length < 16) return { valid: false, reason: 'missing' };

  const cached = licenseCache.get(key);
  if (cached && cached.until > Date.now()) return cached.result;

  const hash = await sha256Hex(key);
  const row = await env.DB.prepare('SELECT plan, status, expires_at FROM licenses WHERE key_hash = ?').bind(hash).first();

  let result;
  if (!row) result = { valid: false, reason: 'unknown' };
  else if (row.status !== 'active') result = { valid: false, reason: row.status };
  else if (row.expires_at && row.expires_at < Date.now()) result = { valid: false, reason: 'expired', expiresAt: row.expires_at };
  else result = { valid: true, plan: row.plan, expiresAt: row.expires_at, hash };

  licenseCache.set(key, { until: Date.now() + 10 * 60 * 1000, result });
  return result;
}

function licenseFromRequest(request, url) {
  return request.headers.get('X-Tactus-License') || url.searchParams.get('license') || '';
}

// ---------------------------------------------------------------------------
// Routen
// ---------------------------------------------------------------------------

async function handleRelay(request, env, url) {
  // /api/relay/<roomId>/<action>
  const parts = url.pathname.split('/').filter(Boolean);
  const roomId = parts[2];
  const action = parts[3];
  if (!ROOM_ID_RE.test(roomId || '')) return json({ error: 'invalid_room' }, 400);

  const lic = await checkLicense(env, licenseFromRequest(request, url));
  if (!lic.valid) return json({ error: 'license_invalid', reason: lic.reason }, 402);

  const stub = env.ROOMS.get(env.ROOMS.idFromName(roomId));
  const inner = new URL(request.url);
  inner.pathname = `/${action || ''}`;
  return stub.fetch(new Request(inner.toString(), request));
}

async function handleAi(request, env, url) {
  if (request.method !== 'POST') return json({ error: 'method' }, 405);
  if (!env.GEMINI_API_KEY) return json({ error: 'fallback_disabled' }, 503);

  const model = url.pathname.split('/').filter(Boolean)[2] || '';
  const kind = AI_MODELS[model];
  if (!kind) return json({ error: 'model_not_allowed', allowed: Object.keys(AI_MODELS) }, 400);

  const lic = await checkLicense(env, licenseFromRequest(request, url));
  if (!lic.valid) return json({ error: 'license_invalid', reason: lic.reason }, 402);

  const limit = parseInt(kind === 'tts' ? env.AI_DAILY_TTS : env.AI_DAILY_TEXT, 10) || 100;
  const day = new Date().toISOString().slice(0, 10);
  const usage = await env.DB.prepare(
    `INSERT INTO ai_usage (license_hash, day, kind, count) VALUES (?, ?, ?, 1)
     ON CONFLICT (license_hash, day, kind) DO UPDATE SET count = count + 1
     RETURNING count`
  ).bind(lic.hash, day, kind).first();
  if (usage && usage.count > limit) {
    return json({ error: 'quota_exceeded', limit, kind }, 429);
  }

  const body = await request.text();
  if (body.length > 200_000) return json({ error: 'too_large' }, 413);

  const upstream = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY },
    body
  });

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Tactus-Quota-Remaining': String(Math.max(0, limit - (usage ? usage.count : 0)))
    }
  });
}

async function handleLicenseCheck(request, env) {
  if (request.method !== 'POST') return json({ error: 'method' }, 405);
  const { key } = await request.json().catch(() => ({}));
  const lic = await checkLicense(env, key);
  return json({
    valid: lic.valid,
    reason: lic.reason || null,
    plan: lic.plan || null,
    expiresAt: lic.expiresAt || null,
    aiFallback: Boolean(env.GEMINI_API_KEY)
  });
}

async function handleAdmin(request, env, url) {
  const auth = request.headers.get('Authorization') || '';
  if (!env.ADMIN_TOKEN || !timingSafeEqual(auth, `Bearer ${env.ADMIN_TOKEN}`)) {
    return json({ error: 'unauthorized' }, 401);
  }

  // POST /api/admin/licenses  { plan: 'monthly'|'yearly'|'lifetime', months?: n, note?: '' }
  if (url.pathname === '/api/admin/licenses' && request.method === 'POST') {
    const input = await request.json().catch(() => ({}));
    const plan = ['monthly', 'yearly', 'lifetime'].includes(input.plan) ? input.plan : 'monthly';
    const months = Number.isFinite(input.months) ? input.months : (plan === 'yearly' ? 12 : 1);
    const expiresAt = plan === 'lifetime' ? null : Date.now() + months * 31 * 24 * 3600 * 1000;
    const key = generateLicenseKey();
    await env.DB.prepare(
      'INSERT INTO licenses (key_hash, key_hint, plan, status, expires_at, created_at, note) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(await sha256Hex(normalizeLicenseKey(key)), key.slice(-4), plan, 'active', expiresAt, Date.now(), String(input.note || '')).run();
    return json({ key, plan, expiresAt });
  }

  // GET /api/admin/licenses
  if (url.pathname === '/api/admin/licenses' && request.method === 'GET') {
    const { results } = await env.DB.prepare(
      'SELECT key_hint, plan, status, expires_at, created_at, note FROM licenses ORDER BY created_at DESC LIMIT 500'
    ).all();
    return json({ licenses: results });
  }

  // POST /api/admin/licenses/update  { key, status?: 'active'|'revoked', extendMonths?: n }
  if (url.pathname === '/api/admin/licenses/update' && request.method === 'POST') {
    const input = await request.json().catch(() => ({}));
    const hash = await sha256Hex(normalizeLicenseKey(input.key));
    const row = await env.DB.prepare('SELECT expires_at FROM licenses WHERE key_hash = ?').bind(hash).first();
    if (!row) return json({ error: 'not_found' }, 404);
    if (input.status) {
      await env.DB.prepare('UPDATE licenses SET status = ? WHERE key_hash = ?').bind(String(input.status), hash).run();
    }
    if (Number.isFinite(input.extendMonths) && input.extendMonths > 0) {
      const base = Math.max(row.expires_at || Date.now(), Date.now());
      await env.DB.prepare('UPDATE licenses SET expires_at = ? WHERE key_hash = ?')
        .bind(base + input.extendMonths * 31 * 24 * 3600 * 1000, hash).run();
    }
    licenseCache.clear();
    return json({ ok: true });
  }

  return json({ error: 'not_found' }, 404);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    try {
      if (url.pathname.startsWith('/api/relay/')) return await handleRelay(request, env, url);
      if (url.pathname.startsWith('/api/ai/')) return await handleAi(request, env, url);
      if (url.pathname === '/api/license/check') return await handleLicenseCheck(request, env);
      if (url.pathname.startsWith('/api/admin/')) return await handleAdmin(request, env, url);
      if (url.pathname.startsWith('/api/')) return json({ error: 'not_found' }, 404);
      return env.ASSETS.fetch(request);
    } catch (err) {
      console.error('worker_error', err && err.stack ? err.stack : err);
      return json({ error: 'internal' }, 500);
    }
  }
};

// ---------------------------------------------------------------------------
// Durable Object: Ein Briefkasten pro Paar
// ---------------------------------------------------------------------------

export class Room extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.sql = ctx.storage.sql;
    this.sql.exec(`CREATE TABLE IF NOT EXISTS packets (
      seq INTEGER PRIMARY KEY AUTOINCREMENT,
      sender TEXT NOT NULL,
      ts INTEGER NOT NULL,
      data TEXT NOT NULL
    )`);
    this.sql.exec(`CREATE TABLE IF NOT EXISTS devices (
      device TEXT PRIMARY KEY,
      acked INTEGER NOT NULL DEFAULT 0,
      seen INTEGER NOT NULL
    )`);
    // Ping/Pong ohne das Objekt aufzuwecken (spart Rechenzeit)
    ctx.setWebSocketAutoResponse(new WebSocketRequestResponsePair('ping', 'pong'));
  }

  touchDevice(device) {
    this.sql.exec(
      `INSERT INTO devices (device, acked, seen) VALUES (?, 0, ?)
       ON CONFLICT (device) DO UPDATE SET seen = excluded.seen`,
      device, Date.now()
    );
  }

  ack(device, seq) {
    if (!Number.isFinite(seq)) return;
    this.sql.exec('UPDATE devices SET acked = MAX(acked, ?) WHERE device = ?', seq, device);
    // Pakete, die dieses (empfangende) Gerät abgeholt hat, sofort löschen
    this.sql.exec('DELETE FROM packets WHERE seq <= ? AND sender != ?', seq, device);
  }

  async ensureAlarm() {
    const current = await this.ctx.storage.getAlarm();
    if (!current) await this.ctx.storage.setAlarm(Date.now() + 24 * 3600 * 1000);
  }

  async fetch(request) {
    const url = new URL(request.url);
    const action = url.pathname.replace(/^\//, '');
    const device = url.searchParams.get('device') || request.headers.get('X-Tactus-Device') || '';
    if (!DEVICE_ID_RE.test(device)) return json({ error: 'invalid_device' }, 400);

    this.touchDevice(device);
    await this.ensureAlarm();

    if (action === 'ws') {
      if (request.headers.get('Upgrade') !== 'websocket') return json({ error: 'expected_websocket' }, 426);
      const pair = new WebSocketPair();
      this.ctx.acceptWebSocket(pair[1], [device]);
      return new Response(null, { status: 101, webSocket: pair[0] });
    }

    if (action === 'push' && request.method === 'POST') {
      const data = await request.text();
      if (!data || data.length > MAX_PACKET_BYTES) return json({ error: 'invalid_size' }, 413);

      const row = this.sql.exec('INSERT INTO packets (sender, ts, data) VALUES (?, ?, ?) RETURNING seq', device, Date.now(), data).one();
      const seq = row.seq;

      // Speicherbremse: älteste Pakete verwerfen
      this.sql.exec(`DELETE FROM packets WHERE seq <= (SELECT seq FROM packets ORDER BY seq DESC LIMIT 1 OFFSET ?)`, MAX_PACKETS_PER_ROOM);

      const message = JSON.stringify({ t: 'pkt', seq, sender: device, data });
      for (const ws of this.ctx.getWebSockets()) {
        const tags = this.ctx.getTags(ws);
        if (tags.includes(device)) continue;
        try { ws.send(message); } catch (e) {}
      }
      return json({ seq });
    }

    if (action === 'pull') {
      const since = parseInt(url.searchParams.get('since') || '0', 10) || 0;
      const rows = this.sql.exec(
        'SELECT seq, sender, data FROM packets WHERE seq > ? AND sender != ? ORDER BY seq ASC LIMIT 40',
        since, device
      ).toArray();
      return json({ packets: rows, more: rows.length === 40 });
    }

    if (action === 'ack' && request.method === 'POST') {
      const { seq } = await request.json().catch(() => ({}));
      this.ack(device, Number(seq));
      return json({ ok: true });
    }

    return json({ error: 'not_found' }, 404);
  }

  async webSocketMessage(ws, message) {
    if (typeof message !== 'string') return;
    let msg;
    try { msg = JSON.parse(message); } catch (e) { return; }
    const device = this.ctx.getTags(ws)[0];
    if (msg && msg.t === 'ack' && device) this.ack(device, Number(msg.seq));
  }

  async webSocketClose(ws, code) {
    try { ws.close(code, 'bye'); } catch (e) {}
  }

  async alarm() {
    const now = Date.now();
    this.sql.exec('DELETE FROM packets WHERE ts < ?', now - PACKET_TTL_MS);
    const latest = this.sql.exec('SELECT MAX(seen) AS seen FROM devices').one();
    if (!latest.seen || latest.seen < now - ROOM_IDLE_DELETE_MS) {
      // Verwaister Raum: alles löschen
      await this.ctx.storage.deleteAll();
      return;
    }
    await this.ctx.storage.setAlarm(now + 24 * 3600 * 1000);
  }
}
