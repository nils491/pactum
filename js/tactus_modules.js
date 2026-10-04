/**
 * js/tactus_modules.js
 * TACTUS Funktionsmodule: Einsteiger sehen zuerst nur die Grundfunktionen (Fragebogen, Analyse,
 * Paar-Stream, Guide, Schlafzimmer-Regie). Zusatzmodule werden nach dem 25-Fragen-Starter anhand
 * der Antworten vorgeschlagen (mit KI-Begründung, wenn verfügbar) und lassen sich jederzeit unter
 * Einstellungen → „Funktionen & Module“ ein- und ausschalten. Die Auswahl gilt für das Paar (Sync).
 *
 * Seiten markieren modulabhängige Bereiche mit data-module="<key>".
 * Öffentliche API (window.TactusModules): isOn, open, apply, maybeSuggest, list
 */
(function(window) {
  'use strict';

  const KEY = 'tactus_modules';
  const MODULES = [
    { key: 'chastity', label: 'Keuschhaltung', desc: 'Verschluss, Tragedauer, Hygiene-Pause und Notfall-Öffnung' },
    { key: 'duties', label: 'Pflichten & Zucht', desc: 'Aufgaben, Punktekonto, Belohnungen und Schicksalswürfel' },
    { key: 'contract', label: 'Beziehungsvertrag', desc: 'Eure Regeln schriftlich festhalten und gemeinsam unterzeichnen' },
    { key: 'ratio', label: 'Orgasmus-Kontrolle', desc: 'Höhepunkte zählen, Quote und Freigaben' },
    { key: 'coach', label: 'Führungs-Coach', desc: 'Tagesimpulse und Hinweise für den führenden Partner' }
  ];
  const PROTOCOL_KEYS = MODULES.map(m => m.key);

  const esc = (t) => String(t == null ? '' : t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const json = (k, fb) => { try { const v = JSON.parse(localStorage.getItem(k) || 'null'); return v == null ? fb : v; } catch (e) { return fb; } };

  // Wer das Protokoll schon nutzt, verliert durch das Update nichts: dann ist alles eingeblendet
  function detectExistingUse() {
    const p = json('tactus_protocol_state', null) || json('kompass_protocol_state', null);
    const c = json('tactus_contract_state', null);
    const r = json('tactus_climax_ratio_state', null) || json('kompass_climax_ratio_state', null);
    return Boolean((p && (p.isLocked || (Array.isArray(p.transactions) && p.transactions.length))) ||
      (c && c.status === 'active') || (r && Array.isArray(r.history) && r.history.length));
  }

  function getState() {
    let st = json(KEY, null);
    if (!st || typeof st !== 'object' || !st.enabled) {
      const all = detectExistingUse();
      st = { enabled: {}, suggestedAt: all ? Date.now() : null, updatedAt: 0 };
      PROTOCOL_KEYS.forEach(k => { st.enabled[k] = all; });
      if (all) save(st, true);
    }
    return st;
  }

  function save(st, silent) {
    st.updatedAt = Date.now();
    localStorage.setItem(KEY, JSON.stringify(st));
    if (!silent && window.CloudSync && typeof window.CloudSync.trigger === 'function') window.CloudSync.trigger();
    apply();
  }

  const isOn = (key) => getState().enabled[key] === true;

  function ensureStyle() {
    if (document.getElementById('tx-modules-style')) return;
    const style = document.createElement('style');
    style.id = 'tx-modules-style';
    style.textContent = '.tx-module-off{display:none!important}';
    document.head.appendChild(style);
  }

  // Bereiche ein-/ausblenden
  function apply() {
    ensureStyle();
    const st = getState();
    document.querySelectorAll('[data-module]').forEach(el => {
      const keys = el.getAttribute('data-module').split(/\s+/);
      el.classList.toggle('tx-module-off', !keys.some(k => st.enabled[k] === true));
    });
    const anyProtocol = PROTOCOL_KEYS.some(k => st.enabled[k]);
    document.querySelectorAll('[data-modules-empty]').forEach(el => { el.style.display = anyProtocol ? 'none' : ''; });
    // Aktiver Protokoll-Reiter ausgeblendet? Dann zurück zur Übersicht
    const activeView = document.querySelector('[id^="view-ledger-"]:not([style*="display: none"]).tx-module-off');
    if (activeView && window.ProtocolCore && typeof window.ProtocolCore.switchTab === 'function') window.ProtocolCore.switchTab('dashboard');
    injectEntry();
  }

  // Dialog im TACTUS-Design mit Schaltern
  function open(preset, intro) {
    const st = getState();
    const checked = preset || st.enabled;
    const prev = document.getElementById('tx-modules-dialog');
    if (prev) prev.remove();
    const wrap = document.createElement('div');
    wrap.id = 'tx-modules-dialog';
    wrap.className = 'fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4';
    wrap.style.zIndex = '2000';
    wrap.innerHTML = `
      <div class="bg-[#090d14] rounded-3xl max-w-md w-full border border-[#c5a880]/70 p-5 space-y-4 shadow-2xl font-sans max-h-[92dvh] overflow-y-auto" role="dialog" aria-modal="true">
        <div>
          <span class="text-[9.5px] font-mono uppercase tracking-wider text-[#c5a880] font-bold block">Funktionen &amp; Module</span>
          <h3 class="text-base font-serif text-white font-bold mt-0.5">${intro ? 'Unser Vorschlag für euch' : 'Was soll TACTUS euch zeigen?'}</h3>
        </div>
        <p class="text-[12.5px] text-[#cbd5e1] leading-relaxed">${intro || 'Fragebogen, Paar-Analyse, Paar-Stream, Guide und Schlafzimmer-Regie sind immer da. Diese Zusatzmodule könnt ihr nach Bedarf einblenden; die Auswahl gilt für euch beide.'}</p>
        <div class="space-y-2">
          ${MODULES.map(m => `
            <label class="flex items-start gap-3 p-3 rounded-2xl bg-[#000000] border border-[#2a364f] cursor-pointer">
              <input type="checkbox" data-key="${m.key}" ${checked[m.key] ? 'checked' : ''} class="mt-0.5 w-5 h-5 accent-[#c5a880] shrink-0">
              <span class="min-w-0"><strong class="text-[13px] text-white block">${esc(m.label)}</strong>
                <span class="text-[11px] text-[#94a3b8] block leading-snug">${esc(m.desc)}</span>
                ${preset && preset.__reasons && preset.__reasons[m.key] ? `<span class="text-[11px] text-[#c5a880] block leading-snug mt-0.5">${esc(preset.__reasons[m.key])}</span>` : ''}</span>
            </label>`).join('')}
        </div>
        <div class="grid gap-2 font-mono">
          <button type="button" data-act="save" class="w-full py-2.5 rounded-xl font-bold text-xs touch-btn bg-[#c5a880] hover:bg-[#dfcaa9] text-black">${intro ? 'So übernehmen' : 'Speichern'}</button>
          <button type="button" data-act="all" class="w-full py-2.5 rounded-xl font-bold text-xs touch-btn bg-[#000000] border border-[#c5a880] text-[#c5a880]">Alles einblenden</button>
          <button type="button" data-act="close" class="w-full py-2.5 rounded-xl font-bold text-xs touch-btn bg-[#000000] border border-[#2a364f] text-[#94a3b8]">${intro ? 'Später entscheiden' : 'Abbrechen'}</button>
        </div>
      </div>`;
    document.body.appendChild(wrap);
    const finish = (enabled) => {
      const st2 = getState();
      const before = PROTOCOL_KEYS.filter(k => st2.enabled[k]);
      st2.enabled = enabled;
      st2.suggestedAt = st2.suggestedAt || Date.now();
      save(st2);
      wrap.remove();
      const after = PROTOCOL_KEYS.filter(k => enabled[k]);
      if (before.join() !== after.join() && window.TactusChat && typeof window.TactusChat.post === 'function') {
        const labels = MODULES.filter(m => enabled[m.key]).map(m => m.label);
        window.TactusChat.post(`⚙️ Module angepasst: ${labels.length ? labels.join(', ') : 'nur Grundfunktionen'}.`);
      }
      if (typeof window.showToastNotification === 'function') window.showToastNotification('✓ Module gespeichert');
    };
    wrap.addEventListener('click', (ev) => {
      const btn = ev.target.closest('button[data-act]');
      if (!btn) { if (ev.target === wrap) wrap.remove(); return; }
      if (btn.dataset.act === 'close') {
        if (intro) { const st3 = getState(); st3.snoozedUntil = Date.now() + 24 * 3600 * 1000; save(st3, true); }
        wrap.remove();
        return;
      }
      const enabled = {};
      wrap.querySelectorAll('input[data-key]').forEach(i => { enabled[i.dataset.key] = btn.dataset.act === 'all' ? true : i.checked; });
      finish(enabled);
    });
  }

  // Vorschlag aus den Antworten beider Partner (Skala 0–5, höchster Wert über beide Rollen)
  function buildSuggestion() {
    const answers = json('kompass_answers', {}) || {};
    const score = (id) => {
      let best = -1;
      ['A', 'B'].forEach(p => ['r1', 'r2'].forEach(r => {
        const v = answers[p] && answers[p][`it_${id}_${r}`];
        if (typeof v === 'number' && v > best) best = v;
      }));
      return best;
    };
    const s = { chastity: score(115), rules: score(360), serve: score(348), voice: score(336), permit: score(81), edge: score(76) };
    const on = {}, why = {};
    on.chastity = s.chastity >= 4; if (on.chastity) why.chastity = 'Keuschhaltung habt ihr hoch bewertet.';
    on.duties = Math.max(s.rules, s.serve) >= 4 || (s.rules >= 3 && s.serve >= 3);
    if (on.duties) why.duties = 'Hausregeln und Dienen sprechen euch an.';
    on.contract = s.rules >= 4 || (on.duties && s.voice >= 4);
    if (on.contract) why.contract = 'Feste Regeln sind euch wichtig – ein Vertrag macht sie verbindlich.';
    on.ratio = Math.max(s.permit, s.edge) >= 4;
    if (on.ratio) why.ratio = 'Edging bzw. um Erlaubnis bitten reizt euch.';
    on.coach = on.duties || on.chastity;
    if (on.coach) why.coach = 'Hilft dem führenden Partner, Pflichten und Verschluss im Blick zu behalten.';
    return { on, why, scores: s };
  }

  async function aiRationale(sug) {
    try {
      const consent = json('tactus_ai_consent', null);
      if (!consent || consent.granted !== true || !window.AIAdapter || !window.AIAdapter.isGeminiAvailable()) return null;
      const chosen = MODULES.filter(m => sug.on[m.key]).map(m => m.label);
      const prompt = `Ein Paar hat den Einstiegsfragebogen einer BDSM-Paar-App beantwortet (Skala 0–5, höchster Wert beider Partner): ` +
        `Keuschhaltung ${sug.scores.chastity}, Hausregeln ${sug.scores.rules}, Dienen/Knien ${sug.scores.serve}, Anweisungsstimme ${sug.scores.voice}, ` +
        `um Erlaubnis bitten ${sug.scores.permit}, Edging ${sug.scores.edge}. Vorgeschlagene Zusatzmodule: ${chosen.length ? chosen.join(', ') : 'keine'}. ` +
        `Schreibe 2 kurze, warme Sätze auf Deutsch (Anrede „ihr“), warum dieser Vorschlag zu ihnen passt und dass sie jederzeit mehr einblenden können. Keine Aufzählung, keine expliziten Details.`;
      const text = await Promise.race([
        window.AIAdapter.generateText({ userPrompt: prompt, temperature: 0.6, maxTokens: 400, provider: 'gemini' }),
        new Promise(r => setTimeout(() => r(null), 9000))
      ]);
      return text ? String(text).trim().slice(0, 500) : null;
    } catch (e) { return null; }
  }

  // Nach dem Starter einmalig vorschlagen (später erneut, wenn „Später entscheiden“)
  let suggesting = false;
  async function maybeSuggest(starterDone, starterTotal) {
    const st = getState();
    if (suggesting || st.suggestedAt || (st.snoozedUntil && Date.now() < st.snoozedUntil)) return;
    if (!starterTotal || starterDone < starterTotal) return;
    suggesting = true;
    const sug = buildSuggestion();
    const chosen = MODULES.filter(m => sug.on[m.key]).map(m => m.label);
    const ruleText = chosen.length
      ? `Glückwunsch, euer Starter ist komplett! Nach euren Antworten passen diese Module zu euch: ${chosen.join(', ')}. Ihr könnt die Auswahl anpassen und später jederzeit mehr einblenden.`
      : 'Glückwunsch, euer Starter ist komplett! Für euch reichen erst einmal die Grundfunktionen. Weitere Module könnt ihr jederzeit unter Einstellungen einblenden.';
    const text = (await aiRationale(sug)) || ruleText;
    suggesting = false;
    open(Object.assign({}, sug.on, { __reasons: sug.why }), esc(text));
  }

  // Eintrag im Einstellungsfenster jeder Seite
  function injectEntry() {
    const modal = document.getElementById('modal-account-settings');
    if (!modal || modal.querySelector('.tx-modules-entry')) return;
    const panel = modal.firstElementChild;
    if (!panel) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tx-entry tx-modules-entry';
    btn.innerHTML = '<span><span class="tx-kicker" style="display:block">Einblenden</span><b style="font-size:14px">Funktionen &amp; Module</b></span><span style="color:#c5a880">›</span>';
    btn.addEventListener('click', () => { modal.style.display = 'none'; open(); });
    const anchor = panel.querySelector('.tx-entry');
    if (anchor && anchor.nextSibling) panel.insertBefore(btn, anchor.nextSibling);
    else if (panel.firstElementChild && panel.firstElementChild.nextSibling) panel.insertBefore(btn, panel.firstElementChild.nextSibling);
    else panel.appendChild(btn);
  }

  window.TactusModules = { isOn, open, apply, maybeSuggest, list: () => MODULES.slice(), buildSuggestion };
  window.addEventListener('tactus:modules-changed', apply);

  const start = () => { apply(); setTimeout(injectEntry, 1500); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})(window);
