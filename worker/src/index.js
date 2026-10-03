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
 * 4. Lizenzen und Testercodes (/api/license/*, /api/admin/*) in D1.
 * 5. Kündigungen nach § 312k BGB (/api/cancel) mit E-Mail-Bestätigung über Brevo.
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

// Tabellen legt der Worker selbst an (idempotent, einmal pro Isolate) –
// kein manueller Schritt in der D1-Konsole nötig. Entspricht worker/migrations/*.sql.
const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS licenses (key_hash TEXT PRIMARY KEY, key_hint TEXT NOT NULL, plan TEXT NOT NULL,
     status TEXT NOT NULL, expires_at INTEGER, created_at INTEGER NOT NULL, note TEXT, customer_ref TEXT)`,
  `CREATE TABLE IF NOT EXISTS ai_usage (license_hash TEXT NOT NULL, day TEXT NOT NULL, kind TEXT NOT NULL,
     count INTEGER NOT NULL, PRIMARY KEY (license_hash, day, kind))`,
  `CREATE TABLE IF NOT EXISTS invites (code_hash TEXT PRIMARY KEY, code_display TEXT NOT NULL, months INTEGER,
     max_uses INTEGER NOT NULL, uses INTEGER NOT NULL DEFAULT 0, expires_at INTEGER, active INTEGER NOT NULL DEFAULT 1,
     created_at INTEGER NOT NULL, note TEXT)`,
  `CREATE TABLE IF NOT EXISTS redeem_attempts (ip_hash TEXT NOT NULL, day TEXT NOT NULL, count INTEGER NOT NULL,
     PRIMARY KEY (ip_hash, day))`,
  `CREATE TABLE IF NOT EXISTS cancellations (id TEXT PRIMARY KEY, received_at INTEGER NOT NULL, name TEXT NOT NULL,
     email TEXT NOT NULL, contract_ref TEXT NOT NULL, kind TEXT NOT NULL, reason TEXT, effective TEXT NOT NULL,
     ends_at INTEGER, license_hash TEXT, mail_status TEXT, processed INTEGER NOT NULL DEFAULT 0)`,
  `CREATE TABLE IF NOT EXISTS cancel_attempts (key TEXT NOT NULL, day TEXT NOT NULL, count INTEGER NOT NULL,
     PRIMARY KEY (key, day))`
];
let schemaReady = null;

function ensureSchema(env) {
  if (!schemaReady) {
    schemaReady = env.DB.batch(SCHEMA.map(sql => env.DB.prepare(sql))).catch(err => {
      schemaReady = null; // beim nächsten Aufruf erneut versuchen
      throw err;
    });
  }
  return schemaReady;
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

async function createLicense(env, { plan, months, note }) {
  const expiresAt = months ? Date.now() + months * 31 * 24 * 3600 * 1000 : null;
  const key = generateLicenseKey();
  await env.DB.prepare(
    'INSERT INTO licenses (key_hash, key_hint, plan, status, expires_at, created_at, note) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(await sha256Hex(normalizeLicenseKey(key)), key.slice(-4), plan, 'active', expiresAt, Date.now(), String(note || '')).run();
  return { key, plan, expiresAt };
}

function normalizeInviteCode(code) {
  return String(code || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function generateInviteCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const chars = [...crypto.getRandomValues(new Uint8Array(8))].map(b => alphabet[b % alphabet.length]).join('');
  return `TEST-${chars.slice(0, 4)}-${chars.slice(4, 8)}`;
}

const MAX_FAILED_REDEEMS_PER_DAY = 20;

// POST /api/license/redeem { code } – Testercode einlösen, erzeugt eine eigene Testlizenz
async function handleRedeem(request, env) {
  if (request.method !== 'POST') return json({ error: 'method' }, 405);
  const { code } = await request.json().catch(() => ({}));
  const normalized = normalizeInviteCode(code);

  const day = new Date().toISOString().slice(0, 10);
  const ipHash = await sha256Hex('tactus-ip:' + (request.headers.get('CF-Connecting-IP') || 'local'));
  const attempts = await env.DB.prepare('SELECT count FROM redeem_attempts WHERE ip_hash = ? AND day = ?').bind(ipHash, day).first();
  if (attempts && attempts.count >= MAX_FAILED_REDEEMS_PER_DAY) return json({ error: 'too_many_attempts' }, 429);

  const fail = async (reason) => {
    await env.DB.prepare(
      `INSERT INTO redeem_attempts (ip_hash, day, count) VALUES (?, ?, 1)
       ON CONFLICT (ip_hash, day) DO UPDATE SET count = count + 1`
    ).bind(ipHash, day).run();
    return json({ error: reason }, 400);
  };

  if (normalized.length < 6) return fail('invalid_code');

  // Atomar: nur einlösen, solange der Code aktiv, gültig und nicht aufgebraucht ist
  const invite = await env.DB.prepare(
    `UPDATE invites SET uses = uses + 1
     WHERE code_hash = ? AND active = 1 AND uses < max_uses AND (expires_at IS NULL OR expires_at > ?)
     RETURNING code_display, months`
  ).bind(await sha256Hex(normalized), Date.now()).first();

  if (!invite) {
    const known = await env.DB.prepare('SELECT active, uses, max_uses, expires_at FROM invites WHERE code_hash = ?')
      .bind(await sha256Hex(normalized)).first();
    if (!known) return fail('invalid_code');
    if (!known.active) return fail('code_inactive');
    if (known.expires_at && known.expires_at <= Date.now()) return fail('code_expired');
    return fail('code_used_up');
  }

  const license = await createLicense(env, { plan: 'tester', months: invite.months, note: `Testercode ${invite.code_display}` });
  return json(license);
}

// ---------------------------------------------------------------------------
// Kündigung nach § 312k BGB ("Verträge hier kündigen")
// ---------------------------------------------------------------------------

const MAX_CANCELS_PER_IP_DAY = 5;
const MAX_CANCELS_PER_EMAIL_DAY = 3;

function berlinDateTime(ms) {
  const d = new Date(ms);
  return {
    date: d.toLocaleDateString('de-DE', { timeZone: 'Europe/Berlin', day: '2-digit', month: '2-digit', year: 'numeric' }),
    time: d.toLocaleTimeString('de-DE', { timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit', second: '2-digit' })
  };
}

// Versand über Brevo (EU). Ohne BREVO_API_KEY wird nur gespeichert und auf der Seite bestätigt.
async function sendMail(env, { to, toName, subject, text, replyTo }) {
  if (!env.BREVO_API_KEY) return 'not_configured';
  try {
    const res = await fetch(env.MAIL_API_URL || 'https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'api-key': env.BREVO_API_KEY },
      body: JSON.stringify({
        sender: { name: env.MAIL_FROM_NAME || 'TACTUS', email: env.MAIL_FROM_EMAIL || 'noreply@tactus.digital' },
        to: [{ email: to, name: toName || to }],
        replyTo: replyTo ? { email: replyTo } : undefined,
        subject,
        textContent: text
      })
    });
    return res.ok ? 'sent' : 'failed';
  } catch (e) {
    return 'failed';
  }
}

async function bumpAttempt(env, key, day) {
  const row = await env.DB.prepare(
    `INSERT INTO cancel_attempts (key, day, count) VALUES (?, ?, 1)
     ON CONFLICT (key, day) DO UPDATE SET count = count + 1 RETURNING count`
  ).bind(key, day).first();
  return row ? row.count : 1;
}

async function handleCancel(request, env) {
  if (request.method !== 'POST') return json({ error: 'method' }, 405);
  const input = await request.json().catch(() => ({}));
  const clean = (v, max) => String(v == null ? '' : v).replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max);

  const name = clean(input.name, 120);
  const email = clean(input.email, 160).toLowerCase();
  const contractRef = clean(input.contractRef, 120);
  const kind = input.kind === 'ausserordentlich' ? 'ausserordentlich' : 'ordentlich';
  const reason = clean(input.reason, 1000);
  const effective = /^\d{4}-\d{2}-\d{2}$/.test(input.effective || '') ? input.effective : 'naechstmoeglich';

  const errors = [];
  if (name.length < 2) errors.push('name');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.push('email');
  if (contractRef.length < 3) errors.push('contractRef');
  if (kind === 'ausserordentlich' && reason.length < 3) errors.push('reason');
  if (errors.length) return json({ error: 'invalid', fields: errors }, 400);

  // Missbrauchsbremse (u. a. gegen das Versenden von Mails an fremde Adressen)
  const day = new Date().toISOString().slice(0, 10);
  const ipKey = 'ip:' + await sha256Hex('tactus-ip:' + (request.headers.get('CF-Connecting-IP') || 'local'));
  const mailKey = 'mail:' + await sha256Hex('tactus-mail:' + email);
  if (await bumpAttempt(env, ipKey, day) > MAX_CANCELS_PER_IP_DAY || await bumpAttempt(env, mailKey, day) > MAX_CANCELS_PER_EMAIL_DAY) {
    return json({ error: 'too_many' }, 429);
  }

  // Ist der Vertrag eine TACTUS-Lizenz, kennen wir das Ende des bezahlten Zeitraums
  let endsAt = null, licenseHash = null;
  const keyNorm = normalizeLicenseKey(contractRef);
  if (/^TACT[A-Z0-9]{16}$/.test(keyNorm)) {
    licenseHash = await sha256Hex(keyNorm);
    const lic = await env.DB.prepare('SELECT expires_at FROM licenses WHERE key_hash = ?').bind(licenseHash).first();
    if (lic) endsAt = lic.expires_at || null;
    else licenseHash = null;
  }
  if (effective !== 'naechstmoeglich') {
    const wish = Date.parse(effective + 'T23:59:59+01:00');
    if (!endsAt || (Number.isFinite(wish) && wish > endsAt)) endsAt = Number.isFinite(wish) ? wish : endsAt;
  }

  const receivedAt = Date.now();
  const id = 'K-' + receivedAt.toString(36).toUpperCase() + '-' + [...crypto.getRandomValues(new Uint8Array(3))].map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  const recv = berlinDateTime(receivedAt);
  const endText = endsAt
    ? `zum ${berlinDateTime(endsAt).date}${kind === 'ausserordentlich' ? ' bzw. mit sofortiger Wirkung, sofern der außerordentliche Kündigungsgrund besteht' : ''}`
    : (kind === 'ausserordentlich' ? 'mit sofortiger Wirkung, sofern der außerordentliche Kündigungsgrund besteht, andernfalls zum nächstmöglichen Zeitpunkt' : 'zum nächstmöglichen Zeitpunkt (Ende des laufenden Abrechnungszeitraums)');

  const summary = [
    `Kündigungsnummer: ${id}`,
    `Eingang: ${recv.date}, ${recv.time} Uhr (deutsche Zeit)`,
    `Name: ${name}`,
    `E-Mail: ${email}`,
    `Vertrag: TACTUS-Abo (${contractRef})`,
    `Art der Kündigung: ${kind === 'ausserordentlich' ? 'außerordentlich' : 'ordentlich'}`,
    kind === 'ausserordentlich' ? `Grund: ${reason}` : null,
    `Gewünschter Zeitpunkt: ${effective === 'naechstmoeglich' ? 'nächstmöglicher Zeitpunkt' : effective.split('-').reverse().join('.')}`,
    `Der Vertrag endet ${endText}.`
  ].filter(Boolean).join('\n');

  const customerText = `Hallo ${name},\n\nwir bestätigen den Eingang deiner Kündigung.\n\n${summary}\n\nBis zum Vertragsende kannst du TACTUS weiter nutzen. Danach wird nichts mehr abgebucht.\n\nFragen? Antworte einfach auf diese E-Mail.\n\n${env.MAIL_FROM_NAME || 'TACTUS'} · tactus.digital\nPixberg Holding UG (haftungsbeschränkt), Grenzweg 5, 42555 Velbert`;
  const operatorText = `Neue Kündigung über tactus.digital/kuendigung\n\n${summary}\n\nBitte das Abo beim Zahlungsanbieter beenden und in der Admin-Seite als erledigt markieren.`;

  const mailStatus = await sendMail(env, { to: email, toName: name, subject: `Bestätigung deiner Kündigung (${id})`, text: customerText, replyTo: env.MAIL_OPERATOR });
  if (env.MAIL_OPERATOR) await sendMail(env, { to: env.MAIL_OPERATOR, subject: `Kündigung ${id} – ${name}`, text: operatorText, replyTo: email });

  await env.DB.prepare(
    `INSERT INTO cancellations (id, received_at, name, email, contract_ref, kind, reason, effective, ends_at, license_hash, mail_status, processed)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`
  ).bind(id, receivedAt, name, email, contractRef, kind, reason || null, effective, endsAt, licenseHash, mailStatus).run();

  return json({ id, receivedAt, received: recv, endsAt, endText, summary, mailStatus });
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
    const months = plan === 'lifetime' ? null : (Number.isFinite(input.months) ? input.months : (plan === 'yearly' ? 12 : 1));
    return json(await createLicense(env, { plan, months, note: input.note }));
  }

  // POST /api/admin/invites { code?, months?, maxUses?, validDays?, note? }
  if (url.pathname === '/api/admin/invites' && request.method === 'POST') {
    const input = await request.json().catch(() => ({}));
    const display = input.code ? String(input.code).trim().toUpperCase() : generateInviteCode();
    const normalized = normalizeInviteCode(display);
    if (normalized.length < 6) return json({ error: 'code_too_short' }, 400);
    const months = Number.isFinite(input.months) && input.months > 0 ? Math.floor(input.months) : null;
    const maxUses = Number.isFinite(input.maxUses) && input.maxUses > 0 ? Math.floor(input.maxUses) : 1;
    const expiresAt = Number.isFinite(input.validDays) && input.validDays > 0 ? Date.now() + input.validDays * 24 * 3600 * 1000 : null;
    try {
      await env.DB.prepare(
        'INSERT INTO invites (code_hash, code_display, months, max_uses, uses, expires_at, active, created_at, note) VALUES (?, ?, ?, ?, 0, ?, 1, ?, ?)'
      ).bind(await sha256Hex(normalized), display, months, maxUses, expiresAt, Date.now(), String(input.note || '')).run();
    } catch (e) {
      return json({ error: 'code_exists' }, 409);
    }
    return json({ code: display, months, maxUses, expiresAt });
  }

  // GET /api/admin/cancellations
  if (url.pathname === '/api/admin/cancellations' && request.method === 'GET') {
    const { results } = await env.DB.prepare(
      'SELECT id, received_at, name, email, contract_ref, kind, reason, effective, ends_at, mail_status, processed FROM cancellations ORDER BY received_at DESC LIMIT 500'
    ).all();
    return json({ cancellations: results });
  }

  // POST /api/admin/cancellations/update { id, processed }
  if (url.pathname === '/api/admin/cancellations/update' && request.method === 'POST') {
    const input = await request.json().catch(() => ({}));
    const res = await env.DB.prepare('UPDATE cancellations SET processed = ? WHERE id = ?').bind(input.processed ? 1 : 0, String(input.id || '')).run();
    if (!res.meta || !res.meta.changes) return json({ error: 'not_found' }, 404);
    return json({ ok: true });
  }

  // GET /api/admin/invites
  if (url.pathname === '/api/admin/invites' && request.method === 'GET') {
    const { results } = await env.DB.prepare(
      'SELECT code_display, months, max_uses, uses, expires_at, active, created_at, note FROM invites ORDER BY created_at DESC LIMIT 500'
    ).all();
    return json({ invites: results });
  }

  // POST /api/admin/invites/delete { code } – entfernt den Code; bereits eingelöste Testlizenzen bleiben bestehen
  if (url.pathname === '/api/admin/invites/delete' && request.method === 'POST') {
    const input = await request.json().catch(() => ({}));
    const res = await env.DB.prepare('DELETE FROM invites WHERE code_hash = ?')
      .bind(await sha256Hex(normalizeInviteCode(input.code))).run();
    if (!res.meta || !res.meta.changes) return json({ error: 'not_found' }, 404);
    return json({ ok: true });
  }

  // POST /api/admin/invites/update { code, active }
  if (url.pathname === '/api/admin/invites/update' && request.method === 'POST') {
    const input = await request.json().catch(() => ({}));
    const res = await env.DB.prepare('UPDATE invites SET active = ? WHERE code_hash = ?')
      .bind(input.active ? 1 : 0, await sha256Hex(normalizeInviteCode(input.code))).run();
    if (!res.meta || !res.meta.changes) return json({ error: 'not_found' }, 404);
    return json({ ok: true });
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
      if (url.pathname.startsWith('/api/')) await ensureSchema(env);
      if (url.pathname.startsWith('/api/relay/')) return await handleRelay(request, env, url);
      if (url.pathname.startsWith('/api/ai/')) return await handleAi(request, env, url);
      if (url.pathname === '/api/license/check') return await handleLicenseCheck(request, env);
      if (url.pathname === '/api/license/redeem') return await handleRedeem(request, env);
      if (url.pathname === '/api/cancel') return await handleCancel(request, env);
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
