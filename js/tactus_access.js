/**
 * js/tactus_access.js
 * TACTUS Zugang: Altersprüfung (18+), Abo-/Lizenzprüfung, Partner-Kopplung
 * und Einwilligung zur KI-Übermittlung (Art. 9 DSGVO).
 *
 * Wird synchron im <head> jeder App-Seite geladen. Sperrt die Oberfläche,
 * bis Alter bestätigt und eine gültige Lizenz vorhanden ist.
 * Rechtstexte (impressum, datenschutz, agb, jugendschutz) laden dieses Modul
 * bewusst nicht, damit sie jederzeit frei erreichbar sind.
 *
 * Öffentliche API (window.TactusAccess): openAccount, ensureAiConsent,
 * revokeAiConsent, getLicense, checkLicense, isUnlocked
 */

(function(window, document) {
  'use strict';

  // --- Betreiber-Konfiguration ----------------------------------------------
  const CONFIG = {
    priceMonthly: '4,99 €',
    priceYearly: '49,99 €',
    // Links zum Checkout des Zahlungsanbieters (nach Einrichtung eintragen)
    checkoutMonthly: '',
    checkoutYearly: '',
    supportEmail: 'kontakt@tactus.digital',
    offlineGraceDays: 14,
    recheckHours: 24
  };

  const KEYS = {
    age: 'tactus_age_verification',
    license: 'tactus_license_key',
    licenseState: 'tactus_license_state',
    aiConsent: 'tactus_ai_consent',
    apiBase: 'tactus_api_base'
  };

  const LEGAL_LINKS = `
    <a href="impressum.html">Impressum</a>
    <a href="datenschutz.html">Datenschutz</a>
    <a href="agb.html">AGB</a>
    <a href="jugendschutz.html">Jugendschutz</a>
    <a href="kuendigung.html">Verträge hier kündigen</a>`;

  let unlocked = false;

  // --- Sperre vor dem ersten Rendern ------------------------------------------
  const lockStyle = document.createElement('style');
  lockStyle.textContent = `
    html.tactus-locked body > *:not(.tx-overlay) { visibility: hidden !important; }
    html.tactus-locked body { overflow: hidden !important; }
    .tx-overlay { position: fixed; inset: 0; z-index: 2147483000; background: #000; color: #f8fafc;
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; overflow-y: auto;
      padding: max(env(safe-area-inset-top), 20px) 16px max(env(safe-area-inset-bottom), 20px);
      display: flex; align-items: flex-start; justify-content: center; -webkit-font-smoothing: antialiased; }
    .tx-overlay.tx-dim { background: rgba(0,0,0,.94); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
    .tx-card { width: 100%; max-width: 440px; margin: auto 0; background: #090d14; border: 1px solid rgba(197,168,128,.45);
      border-radius: 24px; padding: 22px 20px; box-shadow: 0 24px 60px rgba(0,0,0,.6); font-size: 14px; line-height: 1.55; }
    .tx-kicker { font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 10px; letter-spacing: .14em;
      text-transform: uppercase; color: #c5a880; font-weight: 700; }
    .tx-title { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 27px; font-weight: 700; color: #fff; margin: 4px 0 10px; line-height: 1.15; }
    .tx-sub { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 19px; font-weight: 700; color: #fff; margin: 18px 0 6px; }
    .tx-text { color: #cbd5e1; margin: 0 0 12px; }
    .tx-small { color: #94a3b8; font-size: 12px; }
    .tx-row { display: flex; gap: 8px; }
    .tx-input { width: 100%; box-sizing: border-box; min-height: 46px; padding: 10px 12px; background: #000; color: #fff;
      border: 1px solid #2a364f; border-radius: 14px; font-size: 16px; font-family: inherit; }
    .tx-input:focus { outline: none; border-color: #c5a880; }
    textarea.tx-input { min-height: 84px; font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 12px; resize: vertical; word-break: break-all; }
    .tx-btn { display: inline-flex; align-items: center; justify-content: center; min-height: 46px; padding: 10px 16px; border-radius: 14px;
      border: 1px solid #2a364f; background: #000; color: #f8fafc; font-weight: 700; font-size: 14px; cursor: pointer; text-decoration: none;
      font-family: inherit; width: 100%; box-sizing: border-box; }
    .tx-btn:disabled { opacity: .45; cursor: not-allowed; }
    .tx-btn-gold { background: #c5a880; border-color: #c5a880; color: #000; }
    .tx-btn-quiet { border-color: transparent; color: #94a3b8; font-weight: 600; }
    .tx-check { display: flex; gap: 10px; align-items: flex-start; margin: 12px 0; color: #e2e8f0; cursor: pointer; }
    .tx-check input { width: 22px; height: 22px; flex-shrink: 0; accent-color: #c5a880; margin-top: 1px; }
    .tx-plans { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 12px 0; }
    .tx-plan { border: 1px solid #2a364f; border-radius: 16px; padding: 12px; background: #000; text-align: left; color: #fff; cursor: pointer;
      font-family: inherit; text-decoration: none; display: block; }
    .tx-plan b { display: block; font-size: 20px; font-family: 'Cormorant Garamond', Georgia, serif; }
    .tx-plan span { font-size: 11px; color: #94a3b8; }
    .tx-plan.tx-best { border-color: #c5a880; }
    .tx-msg { min-height: 18px; font-size: 12px; margin: 8px 0 0; font-family: 'JetBrains Mono', ui-monospace, monospace; }
    .tx-msg.tx-err { color: #f87171; } .tx-msg.tx-ok { color: #4ade80; }
    .tx-sep { border: 0; border-top: 1px solid #1e2638; margin: 18px 0; }
    .tx-legal { display: flex; flex-wrap: wrap; gap: 6px 14px; justify-content: center; margin-top: 18px; font-size: 12px; }
    .tx-legal a { color: #94a3b8; text-decoration: underline; text-underline-offset: 3px; }
    .tx-badge { display: inline-block; padding: 3px 9px; border-radius: 999px; font-size: 11px; font-weight: 700; border: 1px solid #2a364f; }
    .tx-badge.tx-on { color: #4ade80; border-color: #2e5746; } .tx-badge.tx-off { color: #f87171; border-color: #991b1b; }
    .tx-age18 { display: inline-flex; align-items: center; justify-content: center; width: 46px; height: 46px; border-radius: 50%;
      border: 2px solid #c5a880; color: #c5a880; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 15px; margin-bottom: 10px; }
    .tx-close { position: absolute; top: 14px; right: 14px; width: 44px; height: 44px; border-radius: 12px; border: 1px solid #2a364f;
      background: #000; color: #94a3b8; font-size: 18px; cursor: pointer; }
    .tx-entry { margin: 0 0 12px; padding: 14px; border-radius: 16px; border: 1px solid rgba(197,168,128,.5); background: #000;
      display: flex; align-items: center; justify-content: space-between; gap: 10px; cursor: pointer; width: 100%; color: #fff; font-family: inherit; text-align: left; }
  `;
  document.head.appendChild(lockStyle);
  document.documentElement.classList.add('tactus-locked');

  // --- Hilfsfunktionen ----------------------------------------------------------
  function read(key, fallback) {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch (e) { return fallback; }
  }
  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }
  function apiBase() {
    return (localStorage.getItem(KEYS.apiBase) || '').trim().replace(/\/$/, '');
  }
  function getLicense() {
    return (localStorage.getItem(KEYS.license) || '').trim();
  }
  function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function formatDate(ms) {
    try { return new Date(ms).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }); } catch (e) { return ''; }
  }

  function overlay(html, { dim = false, closable = false, onClose = null } = {}) {
    const el = document.createElement('div');
    el.className = 'tx-overlay' + (dim ? ' tx-dim' : '');
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.innerHTML = `<div class="tx-card" style="position:relative">${closable ? '<button type="button" class="tx-close" aria-label="Schließen" data-tx-close>✕</button>' : ''}${html}</div>`;
    const mount = () => document.body.appendChild(el);
    if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount, { once: true });
    if (closable) {
      el.addEventListener('click', (ev) => {
        if (ev.target.closest('[data-tx-close]')) { el.remove(); if (onClose) onClose(); }
      });
    }
    return el;
  }

  function unlock() {
    unlocked = true;
    document.documentElement.classList.remove('tactus-locked');
    try { window.dispatchEvent(new CustomEvent('tactus-unlocked')); } catch (e) {}
  }

  // --- 1. Altersprüfung -------------------------------------------------------
  function isAgeVerified() {
    const rec = read(KEYS.age, null);
    return Boolean(rec && rec.adult === true && rec.v === 1);
  }

  function isAgeBlocked() {
    const rec = read(KEYS.age, null);
    return Boolean(rec && rec.adult === false && rec.ts > Date.now() - 24 * 3600 * 1000);
  }

  function showAgeGate() {
    return new Promise(resolve => {
      const el = overlay(`
        <div class="tx-age18" aria-hidden="true">18+</div>
        <div class="tx-kicker">Nur für Erwachsene</div>
        <h1 class="tx-title">TACTUS ist ein Angebot für volljährige Paare</h1>
        <p class="tx-text">Die App enthält explizite Inhalte zu Sexualität und BDSM. Der Zugang ist nur Personen ab 18 Jahren gestattet.</p>
        <label class="tx-small" for="tx-dob">Dein Geburtsdatum</label>
        <input id="tx-dob" class="tx-input" type="date" max="${new Date().toISOString().slice(0, 10)}" autocomplete="bday">
        <label class="tx-check"><input type="checkbox" id="tx-adult-confirm">
          <span>Ich bin mindestens 18 Jahre alt, möchte diese Inhalte sehen und sorge dafür, dass Minderjährige auf meinem Gerät keinen Zugriff erhalten.</span></label>
        <button type="button" class="tx-btn tx-btn-gold" id="tx-age-ok">Bestätigen und fortfahren</button>
        <p class="tx-msg tx-err" id="tx-age-msg"></p>
        <a class="tx-btn tx-btn-quiet" href="https://www.google.com" rel="noopener">Ich bin unter 18 – verlassen</a>
        <div class="tx-legal">${LEGAL_LINKS}</div>`);

      // Nach einer Eingabe unter 18 bleibt der Zugang auf diesem Gerät 24 Stunden gesperrt
      const blockAgeGate = () => {
        el.querySelector('#tx-age-ok').disabled = true;
        el.querySelector('#tx-dob').disabled = true;
        el.querySelector('#tx-age-msg').textContent = 'Der Zugang ist erst ab 18 Jahren möglich.';
      };
      if (isAgeBlocked()) blockAgeGate();

      el.querySelector('#tx-age-ok').addEventListener('click', () => {
        const value = el.querySelector('#tx-dob').value;
        const msg = el.querySelector('#tx-age-msg');
        if (!value) { msg.textContent = 'Bitte gib dein Geburtsdatum ein.'; return; }
        const dob = new Date(value + 'T00:00:00');
        const now = new Date();
        let age = now.getFullYear() - dob.getFullYear();
        if (now.getMonth() < dob.getMonth() || (now.getMonth() === dob.getMonth() && now.getDate() < dob.getDate())) age--;
        if (!(age >= 18 && age < 120)) {
          write(KEYS.age, { adult: false, v: 1, ts: Date.now() });
          blockAgeGate();
          return;
        }
        if (!el.querySelector('#tx-adult-confirm').checked) { msg.textContent = 'Bitte bestätige die Erklärung.'; return; }
        // Es wird nur das Ergebnis gespeichert, nicht das Geburtsdatum
        write(KEYS.age, { adult: true, v: 1, ts: Date.now(), method: 'self_declaration_dob' });
        el.remove();
        resolve();
      });
    });
  }

  // --- 2. Lizenz / Abo ----------------------------------------------------------
  async function checkLicense(force = false) {
    const key = getLicense();
    const state = read(KEYS.licenseState, null);
    if (!key) return { valid: false, reason: 'missing' };

    const fresh = state && state.key === key && state.checkedAt > Date.now() - CONFIG.recheckHours * 3600 * 1000;
    if (!force && fresh && state.valid) return state;

    try {
      const res = await fetch(`${apiBase()}/api/license/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key })
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      const next = { key, valid: Boolean(data.valid), reason: data.reason || null, plan: data.plan || null,
        expiresAt: data.expiresAt || null, aiFallback: Boolean(data.aiFallback), checkedAt: Date.now() };
      write(KEYS.licenseState, next);
      return next;
    } catch (err) {
      // Offline-Kulanz: zuletzt gültige Lizenz bleibt eine Weile nutzbar
      const graceOk = state && state.key === key && state.valid &&
        state.checkedAt > Date.now() - CONFIG.offlineGraceDays * 24 * 3600 * 1000 &&
        (!state.expiresAt || state.expiresAt > Date.now());
      if (graceOk) return Object.assign({}, state, { offline: true });
      return { valid: false, reason: 'offline' };
    }
  }

  function reasonText(reason) {
    return ({
      missing: '',
      unknown: 'Dieser Lizenzschlüssel ist uns nicht bekannt.',
      expired: 'Dein Abo ist abgelaufen. Bitte verlängere es.',
      revoked: 'Diese Lizenz wurde deaktiviert.',
      cancelled: 'Dieses Abo wurde gekündigt und ist abgelaufen.',
      offline: 'Keine Verbindung zum TACTUS-Server. Bitte prüfe deine Internetverbindung.'
    })[reason] || '';
  }

  function planButtons() {
    const plan = (url, price, label, hint, best) => url
      ? `<a class="tx-plan${best ? ' tx-best' : ''}" href="${escapeHtml(url)}" target="_blank" rel="noopener"><b>${price}</b>${label}<br><span>${hint}</span></a>`
      : `<div class="tx-plan${best ? ' tx-best' : ''}"><b>${price}</b>${label}<br><span>${hint}</span></div>`;
    const any = CONFIG.checkoutMonthly || CONFIG.checkoutYearly;
    return `<div class="tx-plans">
        ${plan(CONFIG.checkoutMonthly, CONFIG.priceMonthly, 'pro Monat', 'monatlich kündbar', false)}
        ${plan(CONFIG.checkoutYearly, CONFIG.priceYearly, 'pro Jahr', '2 Monate geschenkt', true)}
      </div>
      <p class="tx-small">Ein Abo gilt für ein Paar (zwei Geräte).${any ? '' : ` Der Online-Kauf startet in Kürze – bis dahin erhältst du deinen Schlüssel unter <a href="mailto:${CONFIG.supportEmail}" style="color:#c5a880">${CONFIG.supportEmail}</a>.`}</p>`;
  }

  async function redeemInviteCode(code) {
    try {
      const res = await fetch(`${apiBase()}/api/license/redeem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.key) {
        localStorage.setItem(KEYS.license, data.key);
        return { ok: true, key: data.key };
      }
      const messages = {
        invalid_code: 'Dieser Code ist ungültig.',
        code_inactive: 'Dieser Code wurde deaktiviert.',
        code_expired: 'Dieser Code ist abgelaufen.',
        code_used_up: 'Dieser Code wurde bereits so oft eingelöst wie erlaubt.',
        too_many_attempts: 'Zu viele Fehlversuche. Bitte versuche es morgen erneut.'
      };
      return { ok: false, message: messages[data.error] || 'Einlösen fehlgeschlagen.' };
    } catch (e) {
      return { ok: false, message: reasonText('offline') };
    }
  }

  function showPaywall(reason) {
    return new Promise(resolve => {
      const el = overlay(`
        <div class="tx-kicker">TACTUS · Abo</div>
        <h1 class="tx-title">Willkommen bei TACTUS</h1>
        <p class="tx-text">Euer verschlüsseltes Paar-Cockpit: Konsens-Fragebogen, Paar-Analyse, Partner-Sync, Protokoll und Session-Regie.</p>
        ${planButtons()}
        <hr class="tx-sep">
        <div class="tx-sub">Lizenzschlüssel oder Testercode</div>
        <input id="tx-lic" class="tx-input" placeholder="TACT-… oder Testercode" autocapitalize="characters" autocomplete="off" spellcheck="false" value="${escapeHtml(getLicense())}">
        <div style="height:8px"></div>
        <button type="button" class="tx-btn tx-btn-gold" id="tx-lic-ok">Freischalten</button>
        <p class="tx-msg tx-err" id="tx-lic-msg">${escapeHtml(reasonText(reason))}</p>
        <hr class="tx-sep">
        <div class="tx-sub">Dein Partner nutzt TACTUS schon?</div>
        <p class="tx-small">Füge hier den Kopplungscode von seinem bzw. ihrem Gerät ein. Das Abo wird dabei mit übernommen.</p>
        <textarea id="tx-pair" class="tx-input" placeholder="TACTUS1-…" autocomplete="off" spellcheck="false"></textarea>
        <div style="height:8px"></div>
        <button type="button" class="tx-btn" id="tx-pair-ok">Mit Partner koppeln</button>
        <p class="tx-msg tx-err" id="tx-pair-msg"></p>
        <div class="tx-legal">${LEGAL_LINKS}</div>`);

      const tryUnlock = async (msgEl, btn) => {
        btn.disabled = true;
        msgEl.className = 'tx-msg';
        msgEl.textContent = 'Prüfe …';
        const result = await checkLicense(true);
        btn.disabled = false;
        if (result.valid) {
          el.remove();
          resolve(result);
          return true;
        }
        msgEl.className = 'tx-msg tx-err';
        msgEl.textContent = reasonText(result.reason) || 'Freischaltung fehlgeschlagen.';
        return false;
      };

      const unlockWithCode = async (raw, msg, btn) => {
        const input = raw.trim().toUpperCase();
        const compact = input.replace(/[^A-Z0-9]/g, '');
        if (compact.length < 6) { msg.textContent = 'Bitte gib deinen Schlüssel oder Code vollständig ein.'; return; }

        // Lizenzschlüssel: TACT + 16 Zeichen. Alles andere wird als Testercode eingelöst.
        if (/^TACT[A-Z0-9]{16}$/.test(compact)) {
          localStorage.setItem(KEYS.license, input);
          await tryUnlock(msg, btn);
          return;
        }
        btn.disabled = true;
        msg.className = 'tx-msg';
        msg.textContent = 'Löse Testercode ein …';
        const redeemed = await redeemInviteCode(input);
        btn.disabled = false;
        if (!redeemed.ok) {
          msg.className = 'tx-msg tx-err';
          msg.textContent = redeemed.message;
          return;
        }
        el.querySelector('#tx-lic').value = redeemed.key;
        await tryUnlock(msg, btn);
      };

      el.querySelector('#tx-lic-ok').addEventListener('click', (ev) =>
        unlockWithCode(el.querySelector('#tx-lic').value, el.querySelector('#tx-lic-msg'), ev.currentTarget));

      el.querySelector('#tx-pair-ok').addEventListener('click', async (ev) => {
        const msg = el.querySelector('#tx-pair-msg');
        const value = el.querySelector('#tx-pair').value.trim();
        // Testercode oder Lizenzschlüssel versehentlich hier eingefügt: trotzdem einlösen
        if (value && !/^TACTUS1-/i.test(value) && value.replace(/[^A-Za-z0-9]/g, '').length <= 40) {
          await unlockWithCode(value, msg, ev.currentTarget);
          return;
        }
        try {
          if (!window.CloudSync || typeof window.CloudSync.joinPairing !== 'function') throw new Error('Sync-Modul nicht geladen.');
          window.CloudSync.joinPairing(el.querySelector('#tx-pair').value);
          const ok = await tryUnlock(msg, ev.currentTarget);
          if (ok && typeof window.showToastNotification === 'function') window.showToastNotification('Mit Partner gekoppelt – Daten werden abgeglichen.');
        } catch (err) {
          msg.className = 'tx-msg tx-err';
          msg.textContent = err.message;
        }
      });
    });
  }

  // --- 3. Einwilligung zur KI-Übermittlung (Art. 9 Abs. 2 lit. a DSGVO) --------
  function hasAiConsent() {
    const rec = read(KEYS.aiConsent, null);
    return Boolean(rec && rec.granted === true && rec.v === 1);
  }

  let pendingConsent = null;
  function ensureAiConsent(mode) {
    if (hasAiConsent()) return Promise.resolve(true);
    if (pendingConsent) return pendingConsent;
    pendingConsent = new Promise(resolve => {
      const via = mode === 'fallback'
        ? 'über den TACTUS-Server (Cloudflare, ohne Speicherung) an Google'
        : 'mit eurem eigenen API-Schlüssel direkt an Google';
      const el = overlay(`
        <div class="tx-kicker">Einwilligung · KI-Funktionen</div>
        <h2 class="tx-title">Daten an die KI übermitteln?</h2>
        <p class="tx-text">Für KI-Vorschläge, Dossiers und die Regie-Stimme werden die dafür nötigen Angaben ${via} (Gemini API) übermittelt – zum Beispiel Vornamen, Rollen, Vorlieben, Grenzen und Toys.</p>
        <p class="tx-text">Das sind <b>Angaben zu eurem Sexualleben</b> und damit besonders geschützte Daten. Google kann die Daten in den USA verarbeiten. Ohne Einwilligung funktioniert TACTUS weiter – nur ohne KI.</p>
        <label class="tx-check"><input type="checkbox" id="tx-ai-ok-check">
          <span>Ich willige ein, dass diese Daten zu diesem Zweck übermittelt werden, und habe mich vergewissert, dass mein Partner ebenfalls einverstanden ist. Ich kann die Einwilligung jederzeit in den Einstellungen widerrufen.</span></label>
        <button type="button" class="tx-btn tx-btn-gold" id="tx-ai-yes" disabled>Einwilligen</button>
        <div style="height:8px"></div>
        <button type="button" class="tx-btn tx-btn-quiet" id="tx-ai-no">Ohne KI weiter</button>
        <div class="tx-legal"><a href="datenschutz.html#ki" target="_blank" rel="noopener">Details in der Datenschutzerklärung</a></div>`, { dim: true });
      const check = el.querySelector('#tx-ai-ok-check');
      const yes = el.querySelector('#tx-ai-yes');
      check.addEventListener('change', () => { yes.disabled = !check.checked; });
      const done = (granted) => {
        if (granted) write(KEYS.aiConsent, { granted: true, v: 1, ts: Date.now(), mode });
        el.remove();
        pendingConsent = null;
        resolve(granted);
      };
      yes.addEventListener('click', () => done(true));
      el.querySelector('#tx-ai-no').addEventListener('click', () => done(false));
    });
    return pendingConsent;
  }

  function revokeAiConsent() {
    try { localStorage.removeItem(KEYS.aiConsent); } catch (e) {}
  }

  // --- 4. Konto-Fenster: Abo, Partner-Kopplung, KI, Rechtliches -----------------
  async function openAccount() {
    const lic = await checkLicense(false);
    const sync = window.CloudSync && window.CloudSync.getConfig ? window.CloudSync.getConfig() : { paired: false };
    const route = window.AIAdapter && window.AIAdapter.getGeminiRoute ? window.AIAdapter.getGeminiRoute().mode : 'none';
    const planName = { monthly: 'Monatsabo', yearly: 'Jahresabo', lifetime: 'Unbegrenzt', tester: 'Testzugang' }[lic.plan] || '–';
    const lastSync = sync.lastSyncTime ? new Date(parseInt(sync.lastSyncTime, 10)).toLocaleString('de-DE') : 'noch nie';

    const el = overlay(`
      <div class="tx-kicker">Konto</div>
      <h2 class="tx-title">Abo &amp; Partner</h2>

      <div class="tx-sub">Abo</div>
      <p class="tx-text">${lic.valid ? '<span class="tx-badge tx-on">aktiv</span>' : '<span class="tx-badge tx-off">inaktiv</span>'}
        &nbsp;${planName}${lic.expiresAt ? ' · läuft bis ' + formatDate(lic.expiresAt) : ''}${lic.offline ? ' · offline geprüft' : ''}</p>
      <p class="tx-small">Schlüssel: <span style="font-family:'JetBrains Mono',monospace">${getLicense() ? '••••-' + escapeHtml(getLicense().slice(-4)) : '–'}</span></p>
      ${lic.valid ? '<p class="tx-small"><a href="kuendigung.html" style="color:#c5a880">Abo kündigen (Verträge hier kündigen)</a></p>' : planButtons()}

      <hr class="tx-sep">
      <div class="tx-sub">Partner-Kopplung</div>
      <p class="tx-text">${sync.paired
        ? `<span class="tx-badge ${sync.connected ? 'tx-on' : ''}">${sync.connected ? 'verbunden' : 'gekoppelt'}</span>&nbsp; Letzter Abgleich: ${escapeHtml(lastSync)}`
        : 'Noch nicht gekoppelt. Erzeuge einen Code und schicke ihn deinem Partner, oder füge seinen Code ein.'}</p>
      <p class="tx-small">Eure Daten werden auf dem Gerät verschlüsselt. Der Server sieht nur unlesbare Pakete und löscht sie, sobald das Partnergerät sie abgeholt hat.</p>
      <div style="height:8px"></div>
      <button type="button" class="tx-btn tx-btn-gold" id="tx-pair-create"${lic.valid ? '' : ' disabled'}>${sync.paired ? 'Neuen Kopplungscode erzeugen' : 'Kopplungscode erzeugen'}</button>
      <div id="tx-pair-out" style="display:none;margin-top:10px">
        <textarea class="tx-input" id="tx-pair-text" readonly></textarea>
        <div style="height:8px"></div>
        <div class="tx-row"><button type="button" class="tx-btn" id="tx-pair-copy">Kopieren</button><button type="button" class="tx-btn" id="tx-pair-share">Teilen</button></div>
        <p class="tx-small">Nur über einen sicheren Weg teilen (z. B. persönlich oder Signal). Wer diesen Code hat, kann eure Daten lesen.</p>
      </div>
      <div style="height:10px"></div>
      <textarea id="tx-pair-in" class="tx-input" placeholder="Kopplungscode des Partners einfügen (TACTUS1-…)"></textarea>
      <div style="height:8px"></div>
      <button type="button" class="tx-btn" id="tx-pair-join">Code übernehmen</button>
      ${sync.paired ? '<div style="height:8px"></div><button type="button" class="tx-btn tx-btn-quiet" id="tx-pair-off">Kopplung auf diesem Gerät trennen</button>' : ''}
      <p class="tx-msg" id="tx-pair-msg2"></p>

      <hr class="tx-sep">
      <div class="tx-sub">KI-Funktionen</div>
      <p class="tx-text">${route === 'own' ? 'Ihr nutzt euren eigenen Gemini-Schlüssel.' : route === 'fallback' ? 'Ihr nutzt die TACTUS-KI (im Abo enthalten, mit Tageskontingent).' : 'Nicht verfügbar – eigenen Schlüssel eintragen oder Abo aktivieren.'}
        Einwilligung: ${hasAiConsent() ? '<span class="tx-badge tx-on">erteilt</span>' : '<span class="tx-badge">nicht erteilt</span>'}</p>
      ${hasAiConsent() ? '<button type="button" class="tx-btn" id="tx-ai-revoke">Einwilligung widerrufen</button>' : ''}

      <hr class="tx-sep">
      <button type="button" class="tx-btn tx-btn-quiet" id="tx-lic-change">Anderen Lizenzschlüssel oder Testercode eingeben</button>
      <div class="tx-legal">${LEGAL_LINKS}</div>`, { dim: true, closable: true });

    const msg = el.querySelector('#tx-pair-msg2');
    const say = (text, ok) => { msg.className = 'tx-msg ' + (ok ? 'tx-ok' : 'tx-err'); msg.textContent = text; };

    el.querySelector('#tx-pair-create').addEventListener('click', () => {
      try {
        const code = window.CloudSync.createPairing();
        el.querySelector('#tx-pair-out').style.display = 'block';
        el.querySelector('#tx-pair-text').value = code;
        say('Code erzeugt. Dein Partner fügt ihn auf seinem Gerät ein.', true);
      } catch (err) { say(err.message, false); }
    });
    el.querySelector('#tx-pair-copy') && el.querySelector('#tx-pair-copy').addEventListener('click', async () => {
      const text = el.querySelector('#tx-pair-text').value;
      try { await navigator.clipboard.writeText(text); say('Kopiert.', true); }
      catch (e) { el.querySelector('#tx-pair-text').select(); say('Bitte manuell kopieren.', false); }
    });
    el.querySelector('#tx-pair-share') && el.querySelector('#tx-pair-share').addEventListener('click', async () => {
      const text = el.querySelector('#tx-pair-text').value;
      if (navigator.share) { try { await navigator.share({ text }); } catch (e) {} }
      else say('Teilen wird von diesem Browser nicht unterstützt – bitte kopieren.', false);
    });
    el.querySelector('#tx-pair-join').addEventListener('click', () => {
      try {
        const res = window.CloudSync.joinPairing(el.querySelector('#tx-pair-in').value);
        say(`Gekoppelt. Dieses Gerät ist jetzt Partner ${res.role}. Daten werden abgeglichen.`, true);
      } catch (err) { say(err.message, false); }
    });
    const off = el.querySelector('#tx-pair-off');
    if (off) off.addEventListener('click', () => { window.CloudSync.disconnect(); el.remove(); });
    const revoke = el.querySelector('#tx-ai-revoke');
    if (revoke) revoke.addEventListener('click', () => { revokeAiConsent(); el.remove(); openAccount(); });
    el.querySelector('#tx-lic-change').addEventListener('click', () => { el.remove(); showPaywall('missing').then(() => {}); });
  }

  // Einstieg im bestehenden Einstellungsfenster jeder Seite
  function injectAccountEntry() {
    const modal = document.getElementById('modal-account-settings');
    if (!modal || modal.querySelector('.tx-entry')) return;
    const panel = modal.firstElementChild;
    if (!panel) return;
    const header = panel.firstElementChild;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tx-entry';
    btn.innerHTML = `<span><span class="tx-kicker" style="display:block">Konto</span><b style="font-size:14px">Abo, Partner-Kopplung &amp; KI</b></span><span style="color:#c5a880">›</span>`;
    btn.addEventListener('click', () => { modal.style.display = 'none'; openAccount(); });
    if (header && header.nextSibling) panel.insertBefore(btn, header.nextSibling); else panel.appendChild(btn);
  }

  // --- Ablauf beim Laden ----------------------------------------------------------
  async function run() {
    if (!isAgeVerified()) await showAgeGate();
    let lic = await checkLicense(false);
    if (!lic.valid) lic = await showPaywall(lic.reason);
    unlock();
    injectAccountEntry();
    if (window.CloudSync && typeof window.CloudSync.init === 'function') window.CloudSync.init();
  }

  window.TactusAccess = {
    openAccount,
    ensureAiConsent,
    revokeAiConsent,
    hasAiConsent,
    getLicense,
    checkLicense,
    isUnlocked: () => unlocked,
    config: CONFIG
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once: true });
  else run();

})(window, document);
