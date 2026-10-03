/**
 * js/tactus_roles.js
 * TACTUS Rollenwechsel: Wer führt (Top), wer folgt (Bottom).
 *
 * - Gekoppelt: Ein Partner beantragt den Tausch, der andere muss auf seinem Gerät zustimmen.
 *   Erst dann wechselt die Führung auf beiden Geräten (Antrag wird per Sync übertragen).
 * - Ein Gerät (nicht gekoppelt): Beide sitzen davor, Tausch nach Bestätigung sofort.
 * - Gesperrt während eines aktiven Keuschheits-Verschlusses.
 * - Ein gültiger Beziehungsvertrag ruht, solange die Rollen gegenüber der Unterzeichnung
 *   getauscht sind, und gilt beim Zurücktauschen automatisch wieder (siehe protocol_contract.js).
 *
 * Öffentliche API (window.TactusRoles): requestSwitch, checkPending, getKeyholder, iLead
 */
(function(window) {
  'use strict';

  const KEY_REQUEST = 'tactus_role_handover';
  const REQUEST_TTL = 24 * 3600 * 1000;

  const esc = (t) => String(t == null ? '' : t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const myRole = () => localStorage.getItem('kompass_assigned_role') || 'A';
  const other = (r) => (r === 'A' ? 'B' : 'A');
  const getKeyholder = () => localStorage.getItem('kompass_keyholder_role') || 'A';
  const isPaired = () => localStorage.getItem('kompass_is_paired') === 'true';
  const iLead = () => getKeyholder() === myRole();

  function names() {
    let n = { A: 'Partner 1', B: 'Partner 2' };
    try { n = Object.assign(n, JSON.parse(localStorage.getItem('kompass_names') || '{}')); } catch (e) {}
    return n;
  }

  function toast(msg) {
    if (typeof window.showToastNotification === 'function') window.showToastNotification(msg);
  }

  function chat(text) {
    if (window.TactusChat && typeof window.TactusChat.post === 'function') window.TactusChat.post(text);
  }

  function isChastityLocked() {
    try {
      const raw = localStorage.getItem('tactus_protocol_state') || localStorage.getItem('kompass_protocol_state');
      return Boolean(raw && JSON.parse(raw).isLocked);
    } catch (e) { return false; }
  }

  function getRequest() {
    try {
      const r = JSON.parse(localStorage.getItem(KEY_REQUEST) || 'null');
      if (r && r.status === 'pending' && Date.now() - r.requestedAt > REQUEST_TTL) return Object.assign(r, { status: 'expired' });
      return r;
    } catch (e) { return null; }
  }

  function saveRequest(r) {
    r.updatedAt = Date.now();
    localStorage.setItem(KEY_REQUEST, JSON.stringify(r));
    if (window.CloudSync && typeof window.CloudSync.trigger === 'function') window.CloudSync.trigger();
  }

  function contractPaused() {
    try {
      const c = window.ProtocolContract && window.ProtocolContract.getActiveContract ? window.ProtocolContract.getActiveContract()
        : JSON.parse(localStorage.getItem('tactus_contract_state') || 'null');
      return Boolean(c && c.status === 'active' && c.keyholderAtSigning && c.keyholderAtSigning !== getKeyholder());
    } catch (e) { return false; }
  }

  function contractActive() {
    try {
      const c = JSON.parse(localStorage.getItem('tactus_contract_state') || 'null');
      return Boolean(c && c.status === 'active');
    } catch (e) { return false; }
  }

  // Führung wirklich umstellen (auf diesem Gerät; per Sync auch beim Partner)
  function applyKeyholder(newKeyholder) {
    const wasPaused = contractPaused();
    localStorage.setItem('kompass_keyholder_role', newKeyholder);
    localStorage.setItem('kompass_caged_role', other(newKeyholder));
    if (window.CloudSync && typeof window.CloudSync.trigger === 'function') window.CloudSync.trigger();
    window.dispatchEvent(new CustomEvent('tactus:roles-changed'));
    const n = names();
    let msg = `⇄ Rollentausch vollzogen: ${n[newKeyholder]} führt jetzt, ${n[other(newKeyholder)]} folgt.`;
    if (contractActive()) {
      const nowPaused = contractPaused();
      if (nowPaused && !wasPaused) msg += ' Der Beziehungsvertrag ruht, bis ihr zurücktauscht.';
      if (!nowPaused && wasPaused) msg += ' Der Beziehungsvertrag gilt wieder.';
    }
    chat(msg);
    return msg;
  }

  // Dialog im TACTUS-Design; buttons: [{ label, value, style: 'gold'|'quiet'|'danger' }]
  function dialog({ kicker, title, text, buttons }) {
    return new Promise(resolve => {
      const prev = document.getElementById('tactus-roles-dialog');
      if (prev) prev.remove();
      const wrap = document.createElement('div');
      wrap.id = 'tactus-roles-dialog';
      wrap.className = 'fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4';
      wrap.style.zIndex = '2000';
      const style = {
        gold: 'bg-[#c5a880] hover:bg-[#dfcaa9] text-black',
        quiet: 'bg-[#000000] border border-[#2a364f] text-[#94a3b8]',
        danger: 'bg-[#991b1b] text-white'
      };
      wrap.innerHTML = `
        <div class="bg-[#090d14] rounded-3xl max-w-sm w-full border border-[#c5a880]/70 p-5 space-y-4 shadow-2xl font-sans" role="dialog" aria-modal="true">
          <div>
            <span class="text-[9.5px] font-mono uppercase tracking-wider text-[#c5a880] font-bold block">${esc(kicker || 'Rollentausch')}</span>
            <h3 class="text-base font-serif text-white font-bold mt-0.5">${esc(title)}</h3>
          </div>
          <p class="text-[12.5px] text-[#cbd5e1] leading-relaxed">${text}</p>
          <div class="grid gap-2 font-mono">
            ${buttons.map((b, i) => `<button type="button" data-i="${i}" class="w-full py-2.5 rounded-xl font-bold text-xs touch-btn ${style[b.style || 'quiet']}">${esc(b.label)}</button>`).join('')}
          </div>
        </div>`;
      document.body.appendChild(wrap);
      wrap.addEventListener('click', (ev) => {
        const btn = ev.target.closest('button[data-i]');
        if (btn) { wrap.remove(); resolve(buttons[parseInt(btn.dataset.i, 10)].value); }
        else if (ev.target === wrap) { wrap.remove(); resolve(null); }
      });
    });
  }

  // Einstieg: Rollen-Knopf oben, Einstellungen, Handover im Paar-Stream.
  // target: gewünschter neuer Keyholder ('A'/'B'); ohne Angabe = tauschen.
  async function requestSwitch(target) {
    const n = names();
    const current = getKeyholder();
    const newKeyholder = target === 'A' || target === 'B' ? target : other(current);
    if (newKeyholder === current) return;

    if (isChastityLocked()) {
      toast('Während einer aktiven Verschlusszeit bleibt die Führung beim Keyholder.');
      return;
    }
    const contractNote = contractActive()
      ? '<br><br>Euer Beziehungsvertrag ruht, solange die Rollen getauscht sind, und gilt beim Zurücktauschen automatisch wieder.'
      : '';

    if (!isPaired()) {
      const ok = await dialog({
        title: `${n[newKeyholder]} soll führen?`,
        text: `Ihr nutzt TACTUS auf einem Gerät. Tauscht die Rollen nur, wenn ihr beide einverstanden seid: ${esc(n[newKeyholder])} führt dann, ${esc(n[other(newKeyholder)])} folgt.${contractNote}`,
        buttons: [{ label: 'Wir sind beide einverstanden – tauschen', value: true, style: 'gold' }, { label: 'Abbrechen', value: false }]
      });
      if (ok) toast(applyKeyholder(newKeyholder).replace(/^⇄ /, ''));
      return;
    }

    const pending = getRequest();
    if (pending && pending.status === 'pending') {
      if (pending.from === myRole()) {
        const cancel = await dialog({
          title: 'Antrag läuft bereits',
          text: `Du hast den Rollentausch beantragt. ${esc(n[other(myRole())])} muss auf dem eigenen Gerät zustimmen.`,
          buttons: [{ label: 'Antrag zurückziehen', value: true, style: 'danger' }, { label: 'Weiter warten', value: false }]
        });
        if (cancel) {
          saveRequest(Object.assign(pending, { status: 'cancelled', resolvedAt: Date.now() }));
          chat(`⇄ ${n[myRole()]} hat den Antrag auf Rollentausch zurückgezogen.`);
          toast('Antrag zurückgezogen.');
        }
      } else {
        checkPending();
      }
      return;
    }

    const ok = await dialog({
      title: 'Rollentausch beantragen?',
      text: `Künftig führt ${esc(n[newKeyholder])}, ${esc(n[other(newKeyholder)])} folgt. ${esc(n[other(myRole())])} muss auf dem eigenen Gerät zustimmen – erst dann wird getauscht.${contractNote}`,
      buttons: [{ label: 'Antrag stellen', value: true, style: 'gold' }, { label: 'Abbrechen', value: false }]
    });
    if (!ok) return;
    saveRequest({ id: `ho_${Date.now()}`, from: myRole(), newKeyholder, requestedAt: Date.now(), status: 'pending' });
    chat(`⇄ ${n[myRole()]} beantragt den Rollentausch: Künftig führt ${n[newKeyholder]}. Bitte auf dem eigenen Gerät zustimmen oder ablehnen.`);
    toast('Antrag gestellt – wartet auf Zustimmung.');
  }

  // Beim Partner: offenen Antrag anzeigen (beim Laden und nach jedem Abgleich)
  let showing = false;
  async function checkPending() {
    const r = getRequest();
    if (!r || r.status !== 'pending' || r.from === myRole() || showing) return;
    if (getKeyholder() === r.newKeyholder) {
      saveRequest(Object.assign(r, { status: 'accepted', resolvedAt: Date.now() }));
      return;
    }
    showing = true;
    const n = names();
    const contractNote = contractActive() ? '<br><br>Euer Beziehungsvertrag ruht dann, bis ihr zurücktauscht.' : '';
    const answer = await dialog({
      title: `${n[r.from]} möchte die Rollen tauschen`,
      text: `Künftig führt ${esc(n[r.newKeyholder])}, ${esc(n[other(r.newKeyholder)])} folgt.${contractNote}`,
      buttons: [{ label: 'Zustimmen', value: 'yes', style: 'gold' }, { label: 'Ablehnen', value: 'no', style: 'danger' }, { label: 'Später entscheiden', value: null }]
    });
    showing = false;
    if (!answer) return;
    const fresh = getRequest();
    if (!fresh || fresh.id !== r.id || fresh.status !== 'pending') { toast('Der Antrag ist nicht mehr offen.'); return; }
    if (answer === 'yes') {
      if (isChastityLocked()) { toast('Während einer aktiven Verschlusszeit kann die Führung nicht wechseln.'); return; }
      saveRequest(Object.assign(fresh, { status: 'accepted', resolvedAt: Date.now() }));
      toast(applyKeyholder(fresh.newKeyholder).replace(/^⇄ /, ''));
    } else {
      saveRequest(Object.assign(fresh, { status: 'declined', resolvedAt: Date.now() }));
      chat(`⇄ ${n[myRole()]} hat den Rollentausch abgelehnt. Die Führung bleibt bei ${n[getKeyholder()]}.`);
      toast('Rollentausch abgelehnt.');
    }
  }

  // Menüeintrag: wer gerade führt
  function renderSummaries() {
    const n = names(), kh = getKeyholder();
    document.querySelectorAll('[data-role-summary]').forEach(el => {
      el.textContent = `${n[kh]} führt · ${n[other(kh)]} folgt` + (isChastityLocked() ? ' · gesperrt, solange verschlossen' : '');
    });
  }
  window.addEventListener('tactus:roles-changed', renderSummaries);

  window.TactusRoles = { requestSwitch, checkPending, getKeyholder, iLead, getRequest, isContractPaused: contractPaused };

  const start = () => { renderSummaries(); setTimeout(checkPending, 1200); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})(window);
