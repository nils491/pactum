/**
 * js/tactus_feedback.js
 * TACTUS Rückmeldung nach der Session – getrennt, privat, in drei Fingertipps
 *
 * - Nach jeder Session (Logbuch, mit dem Partner synchronisiert) fragt die App
 *   jeden Partner auf seinem eigenen Gerät: Highlight, mehr davon, zu viel,
 *   Intensität, Befinden, optional eine Notiz.
 * - Privat (Standard): die Rückmeldung bleibt auf dem Gerät. Synchronisiert
 *   werden nur verdichtete Tendenzen ("Signale"), aus denen die Regie lernt.
 * - Geteilt: der Partner sieht die Rückmeldung; bei "leer" oder "aufgewühlt"
 *   bekommt er einen Hinweis zur Nachsorge.
 *
 * Öffentliche API (window.TactusFeedback): checkPending, openFor, getSignals,
 * describeForDirector, intensityAdjustment
 */

(function(window, document) {
  'use strict';

  const KEYS = {
    privateList: 'tactus_feedback_private',   // nur lokal
    shared: 'tactus_feedback_shared',          // synchronisiert (Einträge mit id)
    signals: 'tactus_feedback_signals',        // synchronisiert ({A: {...}, B: {...}})
    done: 'tactus_feedback_done',              // nur lokal: beantwortete Sessions
    seenShared: 'tactus_feedback_seen_shared', // nur lokal: gesehene Partner-Rückmeldungen
    snooze: 'tactus_feedback_snooze_until',
    promptNow: 'tactus_feedback_prompt_now'
  };
  const MAX_AGE_MS = 10 * 24 * 3600 * 1000;
  const GENERIC_OPTIONS = ['Edging & Edges', 'Countdown', 'Die Regiestimme', 'Nähe & Blickkontakt', 'Tempo & Pausen', 'Aftercare'];
  const INTENSITY = { too_soft: 'Zu sanft', right: 'Genau richtig', too_much: 'Zu viel' };
  const MOODS = { geborgen: 'Geborgen', ausgeglichen: 'Ausgeglichen', erschoepft: 'Erschöpft', aufgewuehlt: 'Aufgewühlt', leer: 'Leer / Drop' };

  // --- Speicher ----------------------------------------------------------------

  function read(key, fallback) {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch (e) { return fallback; }
  }
  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }
  function myRole() {
    return localStorage.getItem('kompass_assigned_role') || 'A';
  }
  function names() {
    return read('kompass_names', null) || { A: 'Partner 1', B: 'Partner 2' };
  }
  function escapeHtml(t) {
    return String(t == null ? '' : t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function logbook() {
    const log = read('tactus_session_logbook', null) || read('kompass_session_diary', []) || [];
    return Array.isArray(log) ? log : [];
  }
  function positionIn(entry, role) {
    const n = names()[role];
    if (entry && n && entry.top === n) return 'top';
    if (entry && n && entry.bottom === n) return 'bottom';
    return null;
  }
  function triggerSync() {
    if (window.CloudSync && typeof window.CloudSync.trigger === 'function') window.CloudSync.trigger();
  }

  // --- Signale: verdichtete Tendenzen pro Person (verblassen mit der Zeit) --------

  function getSignals() {
    const all = read(KEYS.signals, {}) || {};
    return { A: all.A || null, B: all.B || null };
  }

  function updateSignals(role, fb) {
    const all = read(KEYS.signals, {}) || {};
    const sig = all[role] || { v: 1, tags: {}, intensity: [], mood: [] };
    // Ältere Tendenzen verlieren langsam an Gewicht
    Object.keys(sig.tags).forEach(k => {
      const t = sig.tags[k];
      t.h = +(t.h * 0.85).toFixed(2); t.m = +(t.m * 0.85).toFixed(2); t.l = +(t.l * 0.85).toFixed(2);
      if (t.h + t.m + t.l < 0.3) delete sig.tags[k];
    });
    const bump = (label, field) => {
      const key = String(label).slice(0, 80);
      sig.tags[key] = sig.tags[key] || { h: 0, m: 0, l: 0 };
      sig.tags[key][field] += 1;
    };
    fb.highlight.forEach(l => bump(l, 'h'));
    fb.more.forEach(l => bump(l, 'm'));
    fb.less.forEach(l => bump(l, 'l'));
    if (fb.intensity) sig.intensity = sig.intensity.concat([{ v: fb.intensity, pos: fb.position }]).slice(-6);
    if (fb.mood) sig.mood = sig.mood.concat([fb.mood]).slice(-6);
    sig.updatedAt = Date.now();
    all[role] = sig;
    write(KEYS.signals, all);
  }

  // Für das Drehbuch: Tendenzen beider Partner, bezogen auf die heutigen Rollen
  function describeForDirector(roles) {
    const sig = getSignals();
    const lines = [];
    [['top', roles.topRole], ['bottom', roles.bottomRole]].forEach(([pos, role]) => {
      const s = sig[role];
      if (!s || !s.tags) return;
      const label = pos === 'top' ? '{TOP}' : '{BOTTOM}';
      const ranked = (field) => Object.keys(s.tags).filter(k => s.tags[k][field] >= 0.8)
        .sort((a, b) => s.tags[b][field] - s.tags[a][field]).slice(0, 5);
      const hi = ranked('h'), more = ranked('m'), less = ranked('l');
      const bits = [];
      if (hi.length) bits.push('Highlights: ' + hi.join(', '));
      if (more.length) bits.push('wünscht mehr: ' + more.join(', '));
      if (less.length) bits.push('war zu viel, nur sparsam einsetzen: ' + less.join(', '));
      const lastI = (s.intensity || []).filter(i => i.pos === pos).slice(-1)[0];
      if (lastI) bits.push(`Intensität zuletzt: ${INTENSITY[lastI.v] || lastI.v}`);
      const lastMood = (s.mood || []).slice(-1)[0];
      if (lastMood === 'leer' || lastMood === 'aufgewuehlt') bits.push(`fühlte sich danach ${MOODS[lastMood].toLowerCase()} – mehr Aftercare einplanen`);
      if (bits.length) lines.push(`Rückmeldungen von ${label}: ${bits.join('; ')}.`);
    });
    return lines.join('\n');
  }

  // Intensitätskorrektur aus den letzten Rückmeldungen des heutigen Bottoms
  function intensityAdjustment(bottomRole) {
    const s = getSignals()[bottomRole];
    const list = s && s.intensity ? s.intensity.filter(i => i.pos === 'bottom') : [];
    const last = list.slice(-1)[0];
    if (last && last.v === 'too_much') return -1;
    return 0;
  }

  // --- Offene Rückmeldungen ----------------------------------------------------------

  function pendingSessions() {
    const done = read(KEYS.done, []) || [];
    const role = myRole();
    return logbook().filter(e => e && e.id && e.timestamp && Date.now() - e.timestamp < MAX_AGE_MS &&
      !done.includes(e.id) && positionIn(e, role) !== null)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  function unseenPartnerShares() {
    const seen = read(KEYS.seenShared, []) || [];
    return (read(KEYS.shared, []) || []).filter(f => f && f.id && f.role !== myRole() && !seen.includes(f.id));
  }

  // --- Oberfläche (nutzt die Grundstile aus js/tactus_access.js) ---------------------

  function injectStyles() {
    if (document.getElementById('tx-feedback-style')) return;
    const st = document.createElement('style');
    st.id = 'tx-feedback-style';
    st.textContent = `
      .txf-chips { display: flex; flex-wrap: wrap; gap: 8px; margin: 6px 0 4px; }
      .txf-chip { min-height: 40px; padding: 8px 12px; border-radius: 999px; border: 1px solid #2a364f; background: #000; color: #cbd5e1;
        font: inherit; font-size: 13px; cursor: pointer; }
      .txf-chip[aria-pressed="true"] { border-color: #c5a880; color: #000; background: #c5a880; font-weight: 700; }
      .txf-chip.txf-less[aria-pressed="true"] { background: #b3734a; border-color: #b3734a; color: #fff; }
      .txf-rows { display: flex; flex-direction: column; gap: 6px; margin-top: 6px; }
      .txf-row-item { display: flex; align-items: center; gap: 6px; padding: 4px 0; border-bottom: 1px solid #1e2638; }
      .txf-label { flex: 1; min-width: 0; font-size: 13px; color: #e2e8f0; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
      .txf-mini { flex-shrink: 0; min-height: 44px; min-width: 44px; padding: 0 9px; border-radius: 12px; border: 1px solid #2a364f; background: #000;
        color: #94a3b8; font: inherit; font-size: 11px; font-weight: 700; cursor: pointer; }
      .txf-mini[aria-pressed="true"] { background: #c5a880; border-color: #c5a880; color: #000; }
      .txf-mini.txf-less[aria-pressed="true"] { background: #b3734a; border-color: #b3734a; color: #fff; }
      .txf-q { margin: 16px 0 2px; font-weight: 700; color: #f8fafc; font-size: 14px; }
      .txf-toast { position: fixed; left: 16px; right: 16px; bottom: max(env(safe-area-inset-bottom), 16px); z-index: 2147482000;
        max-width: 440px; margin: 0 auto; background: #090d14; border: 1px solid rgba(197,168,128,.6); border-radius: 18px;
        padding: 14px 16px; color: #e2e8f0; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; font-size: 14px;
        box-shadow: 0 16px 40px rgba(0,0,0,.6); }
      .txf-toast .txf-row { display: flex; gap: 8px; margin-top: 10px; }
      .txf-toast button { flex: 1; min-height: 44px; border-radius: 12px; border: 1px solid #2a364f; background: #000; color: #f8fafc; font: inherit; font-weight: 700; cursor: pointer; }
      .txf-toast button.txf-go { background: #c5a880; border-color: #c5a880; color: #000; }
    `;
    document.head.appendChild(st);
  }

  function chipGroup(id, options, cls) {
    return `<div class="txf-chips" data-group="${id}">${options.map(o =>
      `<button type="button" class="txf-chip ${cls || ''}" aria-pressed="false" data-value="${escapeHtml(o.value || o)}">${escapeHtml(o.label || o)}</button>`).join('')}</div>`;
  }

  function openFor(entry) {
    injectStyles();
    const role = myRole();
    const pos = positionIn(entry, role);
    const partnerName = pos === 'top' ? entry.bottom : entry.top;
    const date = new Date(entry.timestamp).toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });
    const steps = (entry.plan && Array.isArray(entry.plan.steps) ? entry.plan.steps : []).slice(0, 8);
    const covered = (word) => steps.some(st => st.toLowerCase().includes(word));
    const generic = GENERIC_OPTIONS.filter(g => !(g.startsWith('Edging') && covered('edg')) && !(g === 'Aftercare' && covered('aftercare')) &&
      !(g.startsWith('Nähe') && covered('blickkontakt')));
    const unique = Array.from(new Set(steps.concat(generic)));

    const el = document.createElement('div');
    el.className = 'tx-overlay tx-dim';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.innerHTML = `<div class="tx-card" style="position:relative">
      <button type="button" class="tx-close" aria-label="Später" data-close>✕</button>
      <div class="tx-kicker">Rückmeldung · ${escapeHtml(date)}</div>
      <h2 class="tx-title">Wie war euer Abend für dich?</h2>
      <p class="tx-small">Du warst ${pos === 'top' ? 'Top' : 'Bottom'}${entry.plan && entry.plan.title ? ` · „${escapeHtml(entry.plan.title)}“` : ''}. Dauert 30 Sekunden.</p>

      <div class="txf-q">Intensität</div>
      ${chipGroup('intensity', Object.keys(INTENSITY).map(k => ({ value: k, label: INTENSITY[k] })))}

      <div class="txf-q">Was war wie? <span class="tx-small" style="font-weight:400">Nur antippen, was dir auffällt.</span></div>
      <div class="txf-rows">${unique.map(o => `<div class="txf-row-item" data-value="${escapeHtml(o)}">
          <span class="txf-label">${escapeHtml(o)}</span>
          <button type="button" class="txf-mini" data-kind="h" aria-pressed="false" aria-label="Highlight">Highlight</button>
          <button type="button" class="txf-mini" data-kind="m" aria-pressed="false" aria-label="Mehr davon">Mehr</button>
          <button type="button" class="txf-mini txf-less" data-kind="l" aria-pressed="false" aria-label="Zu viel">Zu viel</button>
        </div>`).join('')}</div>

      <div class="txf-q">Wie geht es dir jetzt?</div>
      ${chipGroup('mood', Object.keys(MOODS).map(k => ({ value: k, label: MOODS[k] })))}

      <div class="txf-q">Notiz (optional)</div>
      <textarea class="tx-input" id="txf-note" maxlength="500" placeholder="Was du dir merken möchtest …" style="min-height:70px;font-family:inherit;font-size:15px"></textarea>

      <label class="tx-check"><input type="checkbox" id="txf-share">
        <span>Mit ${escapeHtml(partnerName || 'meinem Partner')} teilen. Ohne Haken bleibt die Rückmeldung privat; die Regie lernt nur die Tendenz daraus.</span></label>

      <button type="button" class="tx-btn tx-btn-gold" id="txf-save">Speichern</button>
      <p class="tx-msg" id="txf-msg"></p>
    </div>`;
    document.body.appendChild(el);

    const singles = ['intensity', 'mood'];
    el.addEventListener('click', (ev) => {
      if (ev.target.closest('[data-close]')) {
        write(KEYS.snooze, Date.now() + 12 * 3600 * 1000);
        el.remove();
        return;
      }
      const mini = ev.target.closest('.txf-mini');
      if (mini) {
        const row = mini.closest('.txf-row-item');
        const on = mini.getAttribute('aria-pressed') !== 'true';
        // "Mehr" und "Zu viel" schließen sich für dieselbe Sache aus; höchstens 3 Highlights
        if (on && mini.dataset.kind !== 'h') row.querySelectorAll('.txf-mini:not([data-kind="h"])').forEach(b => b.setAttribute('aria-pressed', 'false'));
        if (on && mini.dataset.kind === 'h' && el.querySelectorAll('.txf-mini[data-kind="h"][aria-pressed="true"]').length >= 3) return;
        mini.setAttribute('aria-pressed', on ? 'true' : 'false');
        return;
      }
      const chip = ev.target.closest('.txf-chip');
      if (!chip) return;
      const group = chip.parentElement.getAttribute('data-group');
      const pressed = chip.getAttribute('aria-pressed') === 'true';
      if (singles.includes(group)) chip.parentElement.querySelectorAll('.txf-chip').forEach(c => c.setAttribute('aria-pressed', 'false'));
      chip.setAttribute('aria-pressed', pressed ? 'false' : 'true');
    });

    el.querySelector('#txf-save').addEventListener('click', () => {
      const picked = (g) => Array.from(el.querySelectorAll(`[data-group="${g}"] [aria-pressed="true"]`)).map(c => c.dataset.value);
      const rowPicked = (kind) => Array.from(el.querySelectorAll(`.txf-mini[data-kind="${kind}"][aria-pressed="true"]`)).map(b => b.closest('.txf-row-item').dataset.value);
      const fb = {
        id: `fb_${entry.id}_${role}`,
        sessionId: entry.id,
        role,
        position: pos,
        ts: Date.now(),
        intensity: picked('intensity')[0] || null,
        highlight: rowPicked('h').slice(0, 3),
        more: rowPicked('m'),
        less: rowPicked('l'),
        mood: picked('mood')[0] || null,
        note: el.querySelector('#txf-note').value.trim().slice(0, 500),
        shared: el.querySelector('#txf-share').checked
      };
      if (!fb.intensity && !fb.highlight.length && !fb.more.length && !fb.less.length && !fb.mood) {
        const msg = el.querySelector('#txf-msg');
        msg.className = 'tx-msg tx-err';
        msg.textContent = 'Tippe mindestens eine Antwort an – oder schließe mit ✕ für später.';
        return;
      }
      write(KEYS.privateList, (read(KEYS.privateList, []) || []).concat([fb]).slice(-100));
      if (fb.shared) write(KEYS.shared, (read(KEYS.shared, []) || []).filter(f => f.id !== fb.id).concat([fb]).slice(-100));
      updateSignals(role, fb);
      write(KEYS.done, (read(KEYS.done, []) || []).concat([entry.id]).slice(-200));
      triggerSync();

      const needsCare = fb.mood === 'leer' || fb.mood === 'aufgewuehlt';
      el.querySelector('.tx-card').innerHTML = `
        <div class="tx-kicker">Danke</div>
        <h2 class="tx-title">${needsCare ? 'Pass gut auf dich auf' : 'Gespeichert'}</h2>
        ${needsCare ? `<p class="tx-text">Ein Tief nach intensiven Sessions („Drop“) ist normal und kann ein bis zwei Tage dauern. Was hilft: Wärme, etwas Süßes, Wasser, Nähe und Worte. Sag ${escapeHtml(partnerName || 'deinem Partner')}, was du jetzt brauchst.</p>
          <p class="tx-small">${fb.shared ? 'Da du die Rückmeldung teilst, bekommt dein Partner einen Hinweis zur Nachsorge.' : 'Deine Rückmeldung bleibt privat – nur du entscheidest, ob du darüber sprichst.'}</p>
          <a class="tx-btn" href="guide.html" style="margin-top:10px">Nachsorge-Ratgeber öffnen</a>`
        : `<p class="tx-text">${fb.shared ? 'Deine Rückmeldung ist mit deinem Partner geteilt.' : 'Deine Rückmeldung bleibt privat.'} Die nächste Session wird darauf abgestimmt.</p>`}
        <div style="height:10px"></div>
        <button type="button" class="tx-btn tx-btn-gold" data-close-final>Schließen</button>`;
      el.querySelector('[data-close-final]').addEventListener('click', () => { el.remove(); setTimeout(checkPending, 400); });
    });
  }

  function showToast(html, primaryLabel, onPrimary, onLater) {
    injectStyles();
    const old = document.querySelector('.txf-toast');
    if (old) old.remove();
    const t = document.createElement('div');
    t.className = 'txf-toast';
    t.setAttribute('role', 'status');
    t.innerHTML = `${html}<div class="txf-row"><button type="button" data-later>Später</button><button type="button" class="txf-go" data-go>${primaryLabel}</button></div>`;
    t.querySelector('[data-go]').addEventListener('click', () => { t.remove(); onPrimary(); });
    t.querySelector('[data-later]').addEventListener('click', () => { t.remove(); if (onLater) onLater(); });
    document.body.appendChild(t);
  }

  function showPartnerShare(fb) {
    const n = names();
    const partner = n[fb.role] || 'Dein Partner';
    const lines = [];
    if (fb.intensity) lines.push(`Intensität: ${INTENSITY[fb.intensity]}`);
    if (fb.highlight.length) lines.push(`Highlight: ${fb.highlight.join(', ')}`);
    if (fb.more.length) lines.push(`Mehr davon: ${fb.more.join(', ')}`);
    if (fb.less.length) lines.push(`Zu viel: ${fb.less.join(', ')}`);
    if (fb.mood) lines.push(`Befinden: ${MOODS[fb.mood]}`);
    const care = fb.mood === 'leer' || fb.mood === 'aufgewuehlt';
    const markSeen = () => write(KEYS.seenShared, (read(KEYS.seenShared, []) || []).concat([fb.id]).slice(-200));
    showToast(`<b>${escapeHtml(partner)} hat eine Rückmeldung geteilt</b>${care ? `<br><span style="color:#eab308">${escapeHtml(partner)} fühlt sich ${MOODS[fb.mood].toLowerCase()} – jetzt ist Zeit für Nähe und Nachsorge.</span>` : ''}
      <div class="tx-small" style="margin-top:6px">${lines.map(escapeHtml).join('<br>')}${fb.note ? `<br>„${escapeHtml(fb.note)}“` : ''}</div>`,
      'Gelesen', markSeen, null);
  }

  // Prüft auf offene Rückmeldungen und geteilte Rückmeldungen des Partners
  function checkPending() {
    if (window.TactusAccess && !window.TactusAccess.isUnlocked()) return;
    if (read('tactus_live_telemetry', null)) return; // während einer laufenden Session nicht stören
    if (document.querySelector('.tx-overlay')) return;

    const share = unseenPartnerShares()[0];
    if (share) { showPartnerShare(share); return; }

    const pending = pendingSessions();
    if (!pending.length) return;
    const forced = localStorage.getItem(KEYS.promptNow);
    const snoozed = (read(KEYS.snooze, 0) || 0) > Date.now();
    if (forced) {
      localStorage.removeItem(KEYS.promptNow);
      const entry = pending.find(e => e.id === forced);
      if (entry) { openFor(entry); return; }
    }
    if (snoozed) return;
    const entry = pending[0];
    const when = new Date(entry.timestamp).toLocaleDateString('de-DE', { weekday: 'long' });
    showToast(`<b>Wie war euer Abend (${escapeHtml(when)})?</b><div class="tx-small">30 Sekunden, privat. Die nächste Session wird darauf abgestimmt.</div>`,
      'Rückmeldung geben', () => openFor(entry), () => write(KEYS.snooze, Date.now() + 12 * 3600 * 1000));
  }

  window.TactusFeedback = {
    checkPending,
    openFor,
    getSignals,
    describeForDirector,
    intensityAdjustment,
    pendingSessions
  };

  const run = () => setTimeout(checkPending, 1200);
  window.addEventListener('tactus-unlocked', run);
  if (document.readyState !== 'loading') run(); else document.addEventListener('DOMContentLoaded', run);
  // Neue Rückmeldungen/Sessions vom Partner
  window.addEventListener('storage', (ev) => { if (ev.key === KEYS.shared || ev.key === 'tactus_session_logbook') run(); });

})(window, document);
