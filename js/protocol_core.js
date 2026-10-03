/**
 * js/protocol_core.js
 * TACTUS Protokoll Core, Transaktions-Logbuch & Hygiene-Engine (V3.0 Hyper-Dynamisch)
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien:
 * - Deterministisches Event-Sourcing: Saldo = Summe aller Transaktionen (kein Last-Write-Wins Datenverlust)
 * - Zero-State: Kontostand startet bei 0 P; Verschluss erst nach physischer Erstverriegelung
 * - Anti-TftB Doktrin: Belohnungen sind Wünsche (Freigabe exklusiv Top); Schicksalsentscheid exklusiv Top
 * - Urologische Mikro-Hygiene: Balanitis-Schutz mit täglicher Spülungsquittierung
 * - Break-Glass Notfall-Öffnung: 60s Deeskalation, Fotopflicht & Vertragspausierung zur Schlichtung
 * - Noir-Luxury Vektor-Ikonografie (1.5px monochrome SVGs, keine System-Emojis in Buttons)
 * - Keine window.alert() / window.confirm() Aufrufe unter keinen Umständen
 */

(function(window) {
  'use strict';

  const STORAGE_KEY_STATE = 'tactus_protocol_state';
  const STORAGE_KEY_LEGACY = 'kompass_ledger_state';

  const HARDWARE_LABELS = {
    penis_cobra: 'Kink3D Cobra (SLS-Nylon)',
    penis_viper: 'Kink3D Viper (Kompakt)',
    penis_cherrykeeper: 'Cherrykeeper Micro Stub (<= 35mm)',
    penis_holytrainer: 'HolyTrainer V6 (Bioresin)',
    penis_jailbird: 'Mature Metal Jailbird (Edelstahl)',
    penis_cb6000: 'CB-6000 Polycarbonat',
    penis_flat: 'Flat Shield (Nun-Cage)',
    female_belt: 'Weiblicher Keuschheitsgürtel (Shield)',
    unlocked: 'Kein Verschluss'
  };

  const DEFAULT_INITIAL_STATE = {
    keyholder: 'A',
    cagedPartner: 'B',
    hardware: 'penis_cherrykeeper',
    keyStorage: 'kSafe (Tresor)',
    emergencyPin: '9482',
    isLocked: false,
    lockedSince: null,
    transactions: [],
    lastDiceRoll: 0,
    hygieneConfig: {
      mode: 'points',
      ratePts: 15,
      ratePhys: '2 Schläge auf das Gesäß'
    },
    microHygieneLastDone: null,
    emergencyUnlockedAt: null,
    activeChallenge: null,
    rewards: [
      { id: 'rew_shower_15', title: '15 Min. Pflege- & Duschpause', cost: 60, desc: 'Käfig abnehmen zur gründlichen Intimrasur & Wundversorgung.' },
      { id: 'rew_snuggle_night', title: 'Nächtliche Berührungsfreiheit', cost: 120, desc: 'Schlafen in enger Umarmung ohne Berührungsverbot der Haut.' },
      { id: 'rew_tease_relock', title: 'Tease & Relock Session', cost: 240, desc: 'Kurze Freilassung zur Schwellen-Quälerei durch den Top.' },
      { id: 'rew_climax_option', title: 'Antrag auf Orgasmus-Prüfung', cost: 500, desc: 'Reiner Wunsch an den Top (Typ und Ausführung nach freiem Ermessen des Tops).' }
    ],
    updatedAt: Date.now()
  };

  let protocolState = null;
  const HYGIENE_MINUTES = 15;
  let hygieneTicker = null;
  let hygieneAudio = null;
  let hygieneAlarmShownFor = 0;
  let hygieneWarnedFor = 0;
  let breakGlassInterval = null;
  let breakGlassSecondsLeft = 60;

  function loadProtocolState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_STATE) || localStorage.getItem(STORAGE_KEY_LEGACY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          protocolState = Object.assign({}, DEFAULT_INITIAL_STATE, parsed);
          if (!Array.isArray(protocolState.transactions)) {
            protocolState.transactions = [];
          }
          applyGlobalRoles();
          return;
        }
      }
    } catch (e) {
      console.warn("[TACTUS Protocol] Fehler beim Laden des States:", e);
    }
    protocolState = JSON.parse(JSON.stringify(DEFAULT_INITIAL_STATE));
    applyGlobalRoles();
  }

  // Wer führt, steht in den Einstellungen (bzw. im Rollen-Knopf oben); das Protokoll übernimmt das
  function applyGlobalRoles() {
    const kh = localStorage.getItem('kompass_keyholder_role');
    if (kh === 'A' || kh === 'B') {
      protocolState.keyholder = kh;
      protocolState.cagedPartner = kh === 'A' ? 'B' : 'A';
    }
  }

  function saveProtocolState(skipSync) {
    if (!protocolState) return;
    try {
      protocolState.updatedAt = Date.now();
      const serialized = JSON.stringify(protocolState);
      localStorage.setItem(STORAGE_KEY_STATE, serialized);
      localStorage.setItem(STORAGE_KEY_LEGACY, serialized);
    } catch (e) {
      console.warn("[TACTUS Protocol] Konnte State nicht sichern:", e);
    }

    if (!skipSync && window.CloudSync && typeof window.CloudSync.trigger === 'function') {
      window.CloudSync.trigger();
    }
  }

  function calculateTotalBalance() {
    if (!protocolState || !Array.isArray(protocolState.transactions)) return 0;
    return protocolState.transactions.reduce((sum, tx) => sum + (Number(tx.delta) || 0), 0);
  }

  // Systemmeldung in den Paar-Stream schreiben: verschlüsselt wie eine normale Chat-Nachricht und
  // per Sync auch auf dem Partnergerät sichtbar (funktioniert von jeder Seite aus)
  async function postChatEvent(text) {
    try {
      const enc = new TextEncoder();
      const pass = 'tactus_default_salt_2026';
      const material = await crypto.subtle.importKey('raw', enc.encode(pass), { name: 'PBKDF2' }, false, ['deriveKey']);
      const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: enc.encode('tactus_salt_v3'), iterations: 100000, hash: 'SHA-256' },
        material, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const cipher = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(String(text))));
      const b64 = (u8) => { let out = ''; u8.forEach(b => { out += String.fromCharCode(b); }); return btoa(out); };
      let msgs = [];
      try { msgs = JSON.parse(localStorage.getItem('tactus_stream_messages') || '[]') || []; } catch (e) {}
      msgs.push({
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        senderRole: localStorage.getItem('kompass_assigned_role') || 'A',
        time: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
        type: 'system',
        payload: { c: b64(cipher), i: b64(iv) },
        timestamp: Date.now()
      });
      localStorage.setItem('tactus_stream_messages', JSON.stringify(msgs.slice(-250)));
      if (window.ChatApp && typeof window.ChatApp.renderMessages === 'function') window.ChatApp.renderMessages();
      if (window.CloudSync && typeof window.CloudSync.trigger === 'function') window.CloudSync.trigger();
    } catch (e) {
      console.warn('[TACTUS Protocol] Chat-Meldung fehlgeschlagen:', e);
    }
  }
  window.TactusChat = { post: postChatEvent };

  // Nach einem Rollentausch (hier oder per Sync) Protokoll und Vertrag neu darstellen
  window.addEventListener('tactus:roles-changed', () => {
    if (!document.getElementById('view-ledger-dashboard')) return;
    try {
      renderDashboard();
      if (window.ProtocolContract && typeof window.ProtocolContract.render === 'function') window.ProtocolContract.render();
    } catch (e) {}
  });

  // Bucht auf den aktuell geladenen Stand. Nicht neu laden: sonst gingen Änderungen verloren,
  // die die aufrufende Funktion kurz zuvor gemacht hat (z. B. das Verriegeln).
  function appendTransaction(delta, reason, authorRole = 'top') {
    if (!protocolState) loadProtocolState();
    const tx = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      authorRole: authorRole,
      delta: parseInt(delta, 10) || 0,
      reason: String(reason || 'Protokoll-Buchung').trim()
    };
    protocolState.transactions.unshift(tx);
    if (protocolState.transactions.length > 400) {
      protocolState.transactions = protocolState.transactions.slice(0, 400);
    }
    saveProtocolState();
    renderDashboard();
    return tx;
  }

  function getMyRole() {
    const isPaired = localStorage.getItem('kompass_is_paired') === 'true';
    if (!isPaired) return 'A';
    return localStorage.getItem('kompass_assigned_role') || 'A';
  }

  function isUserTop() {
    loadProtocolState();
    const myRole = getMyRole();
    return myRole === (protocolState.keyholder || 'A');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function showToast(message) {
    if (typeof window.showToastNotification === 'function') {
      window.showToastNotification(message);
      return;
    }
    const container = document.getElementById('toast-container');
    if (!container) return;

    const el = document.createElement('div');
    el.className = "bg-noir-900 text-[#f8fafc] font-medium text-xs px-4 py-2.5 rounded-xl shadow-2xl border border-[#2a364f] transition-all pointer-events-auto transform translate-y-2 opacity-0 flex items-center gap-2.5 backdrop-blur-md";
    el.innerHTML = `
      <svg class="w-4 h-4 text-[#c5a880] flex-shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <span>${escapeHtml(message)}</span>
    `;
    container.appendChild(el);

    setTimeout(() => el.classList.remove('translate-y-2', 'opacity-0'), 10);
    setTimeout(() => {
      el.classList.add('opacity-0');
      setTimeout(() => el.remove(), 300);
    }, 2800);
  }

  function renderDashboard() {
    loadProtocolState();
    renderDice();
    renderHygiene();
    const hwSelect = document.getElementById('select-hardware-type');
    if (hwSelect && hwSelect.value !== protocolState.hardware && hwSelect.querySelector(`option[value="${protocolState.hardware}"]`)) hwSelect.value = protocolState.hardware;
    const isTop = isUserTop();
    const totalPoints = calculateTotalBalance();

    let names = { A: 'Partner 1', B: 'Partner 2' };
    if (window.HubContext && typeof window.HubContext.getNames === 'function') {
      names = window.HubContext.getNames();
    } else {
      try {
        const rawNames = localStorage.getItem('kompass_names');
        if (rawNames) names = Object.assign({}, names, JSON.parse(rawNames));
      } catch (e) {}
    }

    const topName = names[protocolState.keyholder] || 'Top';
    const subName = names[protocolState.cagedPartner] || 'Bottom';

    const headerRoles = document.getElementById('ledger-header-roles');
    if (headerRoles) {
      headerRoles.innerText = `Top: ${topName} · Bottom: ${subName}`;
    }

    const headerBal = document.getElementById('header-balance-display');
    const headerBalMob = document.getElementById('header-balance-mobile');
    const dashBal = document.getElementById('dash-balance-points');
    const balFormatted = `${totalPoints >= 0 ? '+' : ''}${totalPoints} P`;

    if (headerBal) headerBal.innerText = balFormatted;
    if (headerBalMob) headerBalMob.innerText = balFormatted;
    if (dashBal) dashBal.innerText = balFormatted;

    // Tragedauer-Berechnung
    const wearEl = document.getElementById('dash-wear-duration');
    if (wearEl) {
      if (protocolState.isLocked && protocolState.lockedSince) {
        const diffMs = Math.max(0, Date.now() - protocolState.lockedSince);
        const days = Math.floor(diffMs / (24 * 3600 * 1000));
        const hours = Math.floor((diffMs % (24 * 3600 * 1000)) / (3600 * 1000));
        const mins = Math.floor((diffMs % (3600 * 1000)) / (60 * 1000));
        wearEl.innerText = `${days}T ${hours}h ${mins}m`;
      } else {
        wearEl.innerText = "Nicht verriegelt (0T)";
      }
    }

    const devTitle = document.getElementById('dash-device-title');
    const btnLock = document.getElementById('btn-toggle-lock');
    const lockBadge = document.getElementById('ledger-lock-status-badge');
    const currentHwLabel = HARDWARE_LABELS[protocolState.hardware] || 'Keuschheits-Hardware';

    if (devTitle) {
      devTitle.innerText = protocolState.isLocked 
        ? `Verschluss aktiv: ${currentHwLabel}` 
        : `Frei / Unverschlossen (${currentHwLabel})`;
    }

    if (btnLock) {
      btnLock.innerHTML = protocolState.isLocked 
        ? `<svg class="w-3.5 h-3.5 inline mr-1" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg><span>Verriegelt</span>`
        : `<svg class="w-3.5 h-3.5 inline mr-1" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 00-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg><span>Verriegeln</span>`;
      btnLock.className = protocolState.isLocked 
        ? "px-3.5 py-1.5 rounded-xl bg-[#000000] hover:bg-[#090d14] border border-[#c5a880] text-[#dfcaa9] font-bold text-xs touch-btn"
        : "px-3.5 py-1.5 rounded-xl bg-[#090d14] hover:bg-[#101622] border border-[#2a364f] text-[#cbd5e1] font-bold text-xs touch-btn";
    }

    if (lockBadge) {
      lockBadge.innerText = protocolState.isLocked ? "VERRIEGELT" : "OFFEN";
      lockBadge.className = protocolState.isLocked 
        ? "px-1.5 py-0.5 rounded text-[8.5px] font-mono font-bold bg-[#000000] text-[#c5a880] border border-[#c5a880] uppercase flex-shrink-0"
        : "px-1.5 py-0.5 rounded text-[8.5px] font-mono font-bold bg-[#090d14] text-[#94a3b8] border border-[#2a364f] uppercase flex-shrink-0";
    }

    const keyLocEl = document.getElementById('dash-key-location');
    if (keyLocEl) keyLocEl.innerText = protocolState.keyStorage || 'kSafe';

    const ruleDesc = document.getElementById('hygiene-rule-desc');
    if (ruleDesc) {
      ruleDesc.innerText = (protocolState.hygieneConfig.mode === 'points')
        ? `-${protocolState.hygieneConfig.ratePts} P / Min`
        : `${protocolState.hygieneConfig.ratePhys} / Min`;
    }

    // Rollen-Sichtbarkeit
    const banner = document.getElementById('bottom-readonly-banner');
    if (banner) {
      if (isTop) banner.classList.add('hidden');
      else banner.classList.remove('hidden');
    }

    // Top-Only Schutzkontrollen
    ['btn-toggle-lock', 'btn-open-role-cfg', 'btn-cfg-hygiene', 'btn-roll-dice'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.disabled = !isTop;
        if (!isTop) {
          btn.classList.add('opacity-40', 'cursor-not-allowed');
        } else {
          btn.classList.remove('opacity-40', 'cursor-not-allowed');
        }
      }
    });

    renderMicroHygieneWidget();
    renderTransactionsHistory();
  }

  function renderMicroHygieneWidget() {
    const container = document.getElementById('urological-hygiene-container');
    if (!container) return;

    loadProtocolState();
    const lastDone = protocolState.microHygieneLastDone;
    const isToday = lastDone && (new Date(lastDone).toDateString() === new Date().toDateString());

    container.innerHTML = `
      <div class="p-4 rounded-3xl bg-[#090d14]/90 border border-[#2e5746]/50 space-y-2.5 shadow-md">
        <div class="flex items-center justify-between border-b border-[#2a364f] pb-2">
          <div class="flex items-center gap-2">
            <div class="text-[#4ade80]">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/></svg>
            </div>
            <div>
              <strong class="text-xs text-white block">Urologische Mikro-Hygiene</strong>
              <span class="text-[10px] text-[#94a3b8]">Balanitis-Prävention ohne Käfigabnahme</span>
            </div>
          </div>
          <span class="px-2 py-0.5 rounded text-[9.5px] font-mono font-bold ${isToday ? 'bg-[#142b24] text-[#4ade80] border border-[#2e5746]' : 'bg-[#450a0a] text-[#f87171] border border-[#991b1b]'}">
            ${isToday ? 'Heute erledigt ✓' : 'Fällig ⚠️'}
          </span>
        </div>
        <p class="text-[10.5px] text-[#cbd5e1] leading-snug">
          Tägliche Kochsalz- oder Wasserspülung der Eichelkammer mit stumpfer Spülspritze und trockenes Abtupfen. Schützt das Gewebe vor Mazeration durch Urinreste.
        </p>
        <div class="flex items-center justify-between pt-1">
          <span class="text-[10px] text-[#94a3b8] font-mono">
            ${lastDone ? `Zuletzt: ${new Date(lastDone).toLocaleDateString('de-DE')} um ${new Date(lastDone).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}` : 'Bisher noch nicht quittiert'}
          </span>
          ${!isToday ? `
            <button type="button" onclick="ProtocolCore.confirmMicroHygiene()" class="px-3 py-1.5 rounded-xl bg-[#2e5746] hover:bg-[#3d6e59] text-white font-bold text-xs touch-btn shadow-sm">
              Spülung quittieren ✓
            </button>
          ` : `
            <span class="text-[10.5px] text-[#4ade80] font-mono font-bold">Haut reizfrei & trocken</span>
          `}
        </div>
      </div>
    `;
  }

  function confirmMicroHygiene() {
    loadProtocolState();
    protocolState.microHygieneLastDone = Date.now();
    saveProtocolState();
    appendTransaction(10, 'Urologische Mikro-Spülung quittiert (Balanitis-Schutz)', getMyRole());
    showToast("✓ Mikro-Hygiene quittiert: Haut trocken und sauber (+10 P)");

    if (window.TactusChat) {
      window.TactusChat.post("💧 Tägliche urologische Mikro-Spülung quittiert. Hautbild reizfrei.");
    }
  }

  function openBreakGlassModal() {
    loadProtocolState();
    let modal = document.getElementById('modal-break-glass-protocol');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modal-break-glass-protocol';
      modal.className = "fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4";
      document.body.appendChild(modal);
    }

    breakGlassSecondsLeft = 60;
    if (breakGlassInterval) clearInterval(breakGlassInterval);

    modal.innerHTML = `
      <div class="w-full max-w-md bg-[#090d14] border border-[#991b1b]/80 rounded-3xl p-5 space-y-4 shadow-2xl text-xs text-[#f8fafc]">
        <div class="flex items-center justify-between border-b border-[#991b1b]/60 pb-3">
          <div class="flex items-center gap-2">
            <div class="text-[#f87171]">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>
            </div>
            <div>
              <h3 class="text-sm font-bold text-white">Notfall-Öffnung (Break-Glass)</h3>
              <span class="text-[10px] text-[#f87171] font-mono">RACK-Sicherheitsprotokoll</span>
            </div>
          </div>
          <button type="button" onclick="ProtocolCore.cancelBreakGlass()" class="p-1.5 text-[#94a3b8] hover:text-white">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="p-3.5 rounded-2xl bg-[#450a0a]/30 border border-[#991b1b]/60 space-y-2 text-[11px] leading-relaxed">
          <strong class="text-[#fca5a5] block font-bold">Wichtige Prüfung vor dem Öffnen:</strong>
          <p>Dieses Protokoll dient der Abwendung echter medizinischer Notfälle (Harnverhalt, akute Durchblutungsstörung, plötzliche extreme Schwellung oder Unfall des Tops).</p>
          <p class="text-[#cbd5e1] font-medium">Besteht akuter Schmerz oder Schwellung? Hast du versucht, deinen führenden Partner telefonisch zu kontaktieren?</p>
        </div>

        <div class="space-y-1.5 text-center py-2">
          <span class="text-[10px] font-mono text-[#94a3b8] uppercase tracking-wider block">Deeskalations-Countdown:</span>
          <span id="break-glass-timer-display" class="font-mono text-3xl font-black text-[#f87171]">60s</span>
          <span class="text-[10px] text-[#94a3b8] block">Notschlüssel-Code wird nach Ablauf sichtbar</span>
        </div>

        <div id="break-glass-code-section" class="hidden p-3.5 rounded-2xl bg-[#000000] border border-[#991b1b] text-center space-y-2">
          <span class="text-[10px] font-mono text-[#94a3b8] uppercase">Hinterlegter Notschlüssel-Code / Safe-PIN:</span>
          <div class="font-mono text-2xl font-black text-white tracking-widest bg-[#090d14] py-2 rounded-xl border border-[#2a364f]">
            ${escapeHtml(protocolState.emergencyPin || '9482')}
          </div>
          <div class="space-y-2 pt-2 text-left">
            <label class="text-[10px] font-mono text-[#94a3b8] uppercase block">Grund des Notfall-Abbruchs (Pflicht):</label>
            <input type="text" id="input-break-glass-reason" placeholder="z. B. Starke Rötung am Basisring / Schwellung..." class="w-full px-3 py-2 rounded-xl bg-[#090d14] border border-[#2a364f] text-white text-xs focus:outline-none" />
          </div>
        </div>

        <div class="pt-2 border-t border-[#2a364f] flex justify-between gap-2">
          <button type="button" onclick="ProtocolCore.cancelBreakGlass()" class="px-4 py-2 rounded-xl bg-[#101622] text-[#cbd5e1] font-bold text-xs touch-btn">
            Abbrechen (Sicherheit gewahrt)
          </button>
          <button type="button" id="btn-confirm-break-glass" disabled onclick="ProtocolCore.executeBreakGlass()" class="px-4 py-2 rounded-xl bg-[#991b1b] hover:bg-[#b91c1c] disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold text-xs touch-btn shadow-md">
            Notfall-Öffnung bestätigen
          </button>
        </div>
      </div>
    `;

    modal.style.display = 'flex';

    breakGlassInterval = setInterval(() => {
      breakGlassSecondsLeft--;
      const disp = document.getElementById('break-glass-timer-display');
      if (disp) disp.innerText = `${breakGlassSecondsLeft}s`;

      if (breakGlassSecondsLeft <= 0) {
        clearInterval(breakGlassInterval);
        const codeSec = document.getElementById('break-glass-code-section');
        const confirmBtn = document.getElementById('btn-confirm-break-glass');
        if (disp) disp.innerText = "NOTFALL-CODE FREI";
        if (codeSec) codeSec.classList.remove('hidden');
        if (confirmBtn) confirmBtn.disabled = false;
      }
    }, 1000);
  }

  function cancelBreakGlass() {
    if (breakGlassInterval) clearInterval(breakGlassInterval);
    const modal = document.getElementById('modal-break-glass-protocol');
    if (modal) modal.style.display = 'none';
  }

  function executeBreakGlass() {
    const reasonInput = document.getElementById('input-break-glass-reason');
    const reason = reasonInput ? reasonInput.value.trim() : '';

    if (!reason) {
      showToast("Bitte dokumentiere kurz den Grund des Notfalls.");
      return;
    }

    loadProtocolState();
    protocolState.isLocked = false;
    protocolState.emergencyUnlockedAt = Date.now();
    saveProtocolState();

    appendTransaction(0, `NOTFALL-ÖFFNUNG (RACK): ${reason}`, getMyRole());
    cancelBreakGlass();
    renderDashboard();

    showToast("Notfall-Öffnung vollzogen. Bitte sprecht danach in Ruhe darüber.");

    if (window.TactusChat) {
      window.TactusChat.post(`NOTFALL-ÖFFNUNG: Der Verschluss wurde aus medizinischen/dringenden Gründen geöffnet (${reason}).`);
    }
  }

  function renderChoresAndRewards() {
    loadProtocolState();
    const isTop = isUserTop();
    const totalPoints = calculateTotalBalance();

    const rewContainer = document.getElementById('rewards-list-container');
    if (rewContainer) {
      rewContainer.innerHTML = protocolState.rewards.map(r => {
        const canAfford = totalPoints >= r.cost;
        return `
          <div class="p-3.5 rounded-2xl bg-[#090d14]/90 border border-[#2a364f] space-y-2 flex flex-col justify-between">
            <div class="space-y-1">
              <div class="flex items-center justify-between">
                <strong class="text-xs text-white block truncate">${escapeHtml(r.title)}</strong>
                <span class="text-[10px] font-mono font-black text-[#d4af37]">${r.cost} P</span>
              </div>
              <p class="text-[10.5px] text-[#94a3b8] leading-snug">${escapeHtml(r.desc)}</p>
            </div>
            <div class="pt-1">
              ${isTop ? `
                <button type="button" onclick="ProtocolCore.grantRewardDirectly('${r.id}')" class="w-full py-1.5 rounded-xl bg-[#090d14]/80 hover:bg-[#4a2818] border border-[#c5a880] text-white font-bold text-xs touch-btn">
                  Als Top gewähren
                </button>
              ` : `
                <button type="button" onclick="ProtocolCore.petitionReward('${r.id}')" ${!canAfford ? 'disabled' : ''} class="w-full py-1.5 rounded-xl font-bold text-xs touch-btn transition-all ${canAfford ? 'bg-[#4a2818]/80 hover:bg-[#8a5232] border border-[#8a5232] text-[#f8fafc] shadow-sm' : 'bg-[#000000] border border-[#2a364f] text-[#64748b] cursor-not-allowed'}">
                  ${canAfford ? 'Wunsch einreichen ↗' : `Zu wenig Punkte (${r.cost} P)`}
                </button>
              `}
            </div>
          </div>
        `;
      }).join('');
    }
  }

  function petitionReward(rewardId) {
    loadProtocolState();
    const totalPoints = calculateTotalBalance();
    const rew = protocolState.rewards.find(r => r.id === rewardId);
    if (!rew) return;

    if (totalPoints < rew.cost) {
      showToast("Nicht genügend Tribut-Punkte vorhanden.");
      return;
    }

    showToast(`✓ Wunsch nach „${rew.title}“ an den Top übermittelt.`);

    if (window.TactusChat) {
      window.TactusChat.post(`Wunsch des Bottoms: Antrag auf „${rew.title}“ (${rew.cost} P). Freigabe obliegt dem Ermessen des Tops.`);
    }
  }

  function grantRewardDirectly(rewardId) {
    if (!isUserTop()) return;
    loadProtocolState();
    const rew = protocolState.rewards.find(r => r.id === rewardId);
    if (!rew) return;

    appendTransaction(-rew.cost, `Belohnung gewährt: ${rew.title}`, 'top');
    renderChoresAndRewards();
    showToast(`✓ Belohnung „${rew.title}“ gewährt (-${rew.cost} P)`);

    if (window.TactusChat) {
      window.TactusChat.post(`Belohnung gewährt: „${rew.title}“ vom Top bewilligt (-${rew.cost} P).`);
    }
  }

  function renderTransactionsHistory() {
    const container = document.getElementById('ledger-transactions-list');
    if (!container) return;

    loadProtocolState();
    const txs = protocolState.transactions || [];

    if (txs.length === 0) {
      container.innerHTML = `
        <div class="py-6 text-center text-[#94a3b8] text-xs">
          Noch keine Punkte im Protokoll verbucht.
        </div>
      `;
      return;
    }

    container.innerHTML = txs.slice(0, 10).map(t => {
      const isPos = t.delta > 0;
      const isZero = t.delta === 0;
      const dStr = new Date(t.timestamp).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

      return `
        <div class="p-2.5 rounded-xl bg-[#090d14]/60 border border-[#2a364f]/80 flex items-center justify-between text-xs">
          <div class="space-y-0.5 min-w-0 flex-1">
            <span class="text-white block truncate font-medium">${escapeHtml(t.reason)}</span>
            <span class="text-[9.5px] text-[#94a3b8] font-mono">${dStr} Uhr · ${t.authorRole === 'top' ? 'Top' : 'Bottom'}</span>
          </div>
          <span class="font-mono text-xs font-bold flex-shrink-0 ${isZero ? 'text-[#94a3b8]' : (isPos ? 'text-[#d4af37]' : 'text-[#f87171]')}">
            ${isZero ? '±0' : (isPos ? `+${t.delta}` : t.delta)} P
          </span>
        </div>
      `;
    }).join('');
  }

  // --- Hygiene-Pause: Start, Countdown, Alarm, Quittung, Verstöße ---------------------------
  // Alles hängt am gespeicherten Startzeitpunkt (protocolState.hygiene) und wird mit dem
  // Partnergerät abgeglichen: Countdown und Überziehung laufen auch nach Neuladen weiter, und
  // der Top sieht live, wenn überzogen wird.

  function hygieneStatus() {
    const h = protocolState.hygiene;
    if (!h || !h.startedAt || h.endedAt) return null;
    const endsAt = h.startedAt + (h.minutes || HYGIENE_MINUTES) * 60000;
    const now = Date.now();
    return { h, endsAt, remainingMs: endsAt - now, overdueMin: Math.max(0, Math.ceil((now - endsAt) / 60000)) };
  }

  function beep(times, freq) {
    try {
      const ctx = hygieneAudio || new (window.AudioContext || window.webkitAudioContext)();
      hygieneAudio = ctx;
      if (ctx.state === 'suspended') ctx.resume();
      for (let i = 0; i < times; i++) {
        const osc = ctx.createOscillator(), gain = ctx.createGain();
        osc.frequency.value = freq || 880;
        osc.connect(gain); gain.connect(ctx.destination);
        const t = ctx.currentTime + i * 0.45;
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.4, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
        osc.start(t); osc.stop(t + 0.32);
      }
    } catch (e) {}
    try { if (navigator.vibrate) navigator.vibrate([400, 200, 400, 200, 400]); } catch (e) {}
  }

  function startHygieneTimer() {
    loadProtocolState();
    if (!protocolState.isLocked) { showToast("Es ist kein Verschluss aktiv."); return; }
    if (hygieneStatus()) { showToast("Die Hygiene-Pause läuft bereits."); return; }
    // Ton jetzt freischalten (Browser erlauben Audio nur nach einem Tipp)
    try { hygieneAudio = hygieneAudio || new (window.AudioContext || window.webkitAudioContext)(); hygieneAudio.resume(); } catch (e) {}
    const startedAt = Date.now();
    protocolState.hygiene = { startedAt, minutes: HYGIENE_MINUTES, endedAt: null, startedBy: getMyRole(), overdueNotified: false };
    saveProtocolState();
    renderHygiene();
    const until = new Date(startedAt + HYGIENE_MINUTES * 60000).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    showToast(`Hygiene-Pause gestartet: bis ${until} Uhr wieder verschließen.`);
    if (window.TactusChat) window.TactusChat.post(`💧 Hygiene-Pause gestartet (${HYGIENE_MINUTES} Min.). Bis ${until} Uhr muss wieder verschlossen sein.`);
  }

  function confirmRelocked() {
    loadProtocolState();
    const st = hygieneStatus();
    if (!st) return;
    const now = Date.now();
    const usedMin = Math.max(1, Math.round((now - st.h.startedAt) / 60000));
    const overdueMin = Math.max(0, Math.ceil((now - st.endsAt) / 60000));
    protocolState.hygiene = Object.assign({}, st.h, { endedAt: now, overdueMin });
    if (overdueMin > 0) {
      protocolState.violations = (protocolState.violations || []).concat([{
        id: `vio_${now}`, type: 'hygiene_overdue', minutes: overdueMin, at: now, status: 'open'
      }]).slice(-50);
    }
    saveProtocolState();
    closeHygieneAlarm();
    renderDashboard();
    if (overdueMin > 0) {
      showToast(`Wieder verschlossen – ${overdueMin} Min. überzogen. Der Top entscheidet über die Strafe.`);
      if (window.TactusChat) window.TactusChat.post(`⚠️ Hygiene-Pause um ${overdueMin} Min. überzogen (nach ${usedMin} Min. wieder verschlossen). Strafe im Protokoll festlegen.`);
    } else {
      showToast("✓ Wieder verschlossen – rechtzeitig.");
      if (window.TactusChat) window.TactusChat.post(`🔒 Hygiene-Pause beendet: nach ${usedMin} Min. wieder verschlossen.`);
    }
  }

  function showHygieneAlarm() {
    if (document.getElementById('hygiene-alarm-overlay')) return;
    const el = document.createElement('div');
    el.id = 'hygiene-alarm-overlay';
    el.className = 'fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center p-4';
    el.style.zIndex = '2000';
    el.innerHTML = `
      <div class="bg-[#090d14] rounded-3xl max-w-sm w-full border-2 border-[#991b1b] p-6 space-y-4 text-center shadow-2xl" role="alertdialog">
        <div class="text-4xl">⏰</div>
        <h3 class="text-lg font-serif font-bold text-white">Die Hygiene-Pause ist vorbei</h3>
        <p class="text-[12.5px] text-[#cbd5e1] leading-relaxed">Bitte jetzt wieder verschließen und hier bestätigen. Jede weitere Minute wird dem Top gemeldet.</p>
        <button type="button" onclick="ProtocolCore.confirmRelocked()" class="w-full py-3 bg-[#c5a880] hover:bg-[#dfcaa9] text-black font-bold rounded-xl text-sm touch-btn">🔒 Wieder verschlossen</button>
        <button type="button" onclick="document.getElementById('hygiene-alarm-overlay').remove()" class="w-full py-2.5 bg-[#000000] border border-[#2a364f] text-[#94a3b8] font-bold rounded-xl text-xs touch-btn">Später bestätigen</button>
      </div>`;
    document.body.appendChild(el);
  }

  function closeHygieneAlarm() {
    const el = document.getElementById('hygiene-alarm-overlay');
    if (el) el.remove();
  }

  function settleViolation(id, action) {
    if (!isUserTop()) { showToast("Über Strafen entscheidet der Top."); return; }
    loadProtocolState();
    const v = (protocolState.violations || []).find(x => x.id === id && x.status === 'open');
    if (!v) return;
    const cfg = protocolState.hygieneConfig || {};
    let text = '';
    if (action === 'points') {
      const pts = (parseInt(cfg.ratePts, 10) || 15) * v.minutes;
      appendTransaction(-pts, `Hygiene-Pause um ${v.minutes} Min. überzogen`, 'top');
      text = `Strafe: −${pts} Punkte`;
    } else if (action === 'physical') {
      text = `Zuchtmaßnahme: ${cfg.ratePhys || '2 Schläge auf das Gesäß'} pro Minute (× ${v.minutes})`;
      appendTransaction(0, `Hygiene-Pause um ${v.minutes} Min. überzogen – ${text}`, 'top');
    } else {
      text = 'Verziehen';
    }
    loadProtocolState();
    const target = (protocolState.violations || []).find(x => x.id === id);
    if (target) { target.status = action === 'pardon' ? 'pardoned' : 'punished'; target.resolution = text; target.resolvedAt = Date.now(); }
    saveProtocolState();
    renderDashboard();
    showToast(text);
    if (window.TactusChat) window.TactusChat.post(`⚖️ Entscheidung zur überzogenen Hygiene-Pause (${v.minutes} Min.): ${text}.`);
  }

  function renderHygiene() {
    if (!protocolState) loadProtocolState();
    const box = document.getElementById('hygiene-status');
    const btn = document.getElementById('btn-hygiene-timer');
    const st = hygieneStatus();
    if (btn) {
      btn.disabled = !protocolState.isLocked || Boolean(st);
      btn.style.opacity = btn.disabled ? '0.5' : '';
      btn.title = !protocolState.isLocked ? 'Nur während eines aktiven Verschlusses.' : st ? 'Die Pause läuft bereits.' : '';
    }
    if (box) {
      if (!st) {
        box.style.display = 'none';
      } else {
        const overdue = st.remainingMs <= 0;
        const sec = Math.max(0, Math.ceil(st.remainingMs / 1000));
        const mm = String(Math.floor(sec / 60)).padStart(2, '0'), ss = String(sec % 60).padStart(2, '0');
        box.style.display = '';
        box.className = `p-3.5 rounded-2xl bg-[#000000] border ${overdue ? 'border-[#991b1b]' : 'border-[#2e5746]'} flex flex-wrap items-center justify-between gap-2 font-mono text-xs`;
        box.innerHTML = `
          <div>
            <span class="text-[10px] uppercase text-[#94a3b8] block">💧 Hygiene-Pause</span>
            <strong class="text-lg ${overdue ? 'text-[#f87171] animate-pulse' : 'text-white'}">${overdue ? `+${st.overdueMin} Min. überzogen` : `${mm}:${ss}`}</strong>
          </div>
          <button type="button" onclick="ProtocolCore.confirmRelocked()" class="px-4 py-2 rounded-xl font-bold touch-btn ${overdue ? 'bg-[#991b1b] text-white' : 'bg-[#c5a880] text-black'}">🔒 Wieder verschlossen</button>`;
      }
    }

    if (st) {
      const key = st.h.startedAt;
      // Kurz vor Ablauf warnen, bei Ablauf Alarm (auf dem Gerät, auf dem die App gerade offen ist)
      if (st.remainingMs <= 120000 && st.remainingMs > 0 && hygieneWarnedFor !== key) { hygieneWarnedFor = key; beep(2, 660); showToast('Noch 2 Minuten Hygiene-Pause.'); }
      if (st.remainingMs <= 0 && hygieneAlarmShownFor !== key) {
        hygieneAlarmShownFor = key;
        if (!isUserTop()) { beep(5, 880); showHygieneAlarm(); }
        if (!st.h.overdueNotified) {
          protocolState.hygiene.overdueNotified = true;
          saveProtocolState();
          if (window.TactusChat) window.TactusChat.post('⏰ Die Hygiene-Pause ist abgelaufen – noch nicht wieder verschlossen.');
        }
      }
      if (!hygieneTicker) hygieneTicker = setInterval(() => { loadProtocolState(); renderHygiene(); }, 1000);
    } else if (hygieneTicker) {
      clearInterval(hygieneTicker);
      hygieneTicker = null;
    }

    // Offene Verstöße: der Top entscheidet, der Bottom sieht den Stand
    const panel = document.getElementById('violations-panel');
    if (panel) {
      const open = (protocolState.violations || []).filter(v => v.status === 'open');
      if (!open.length) { panel.style.display = 'none'; panel.innerHTML = ''; }
      else {
        const top = isUserTop();
        const cfg = protocolState.hygieneConfig || {};
        panel.style.display = '';
        panel.innerHTML = open.map(v => `
          <div class="p-3.5 rounded-2xl bg-[#450a0a]/40 border border-[#991b1b] space-y-2 font-mono text-xs">
            <div class="flex items-center justify-between gap-2">
              <strong class="text-white">Hygiene-Pause um ${v.minutes} Min. überzogen</strong>
              <span class="text-[10px] text-[#94a3b8]">${new Date(v.at).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            ${top ? `<div class="flex flex-wrap gap-2">
              <button type="button" onclick="ProtocolCore.settleViolation('${v.id}', 'points')" class="px-3 py-2 rounded-xl bg-[#991b1b] text-white font-bold touch-btn">−${(parseInt(cfg.ratePts, 10) || 15) * v.minutes} Punkte</button>
              <button type="button" onclick="ProtocolCore.settleViolation('${v.id}', 'physical')" class="px-3 py-2 rounded-xl bg-[#4a2818] border border-[#8a5232] text-white font-bold touch-btn">Zuchtmaßnahme</button>
              <button type="button" onclick="ProtocolCore.settleViolation('${v.id}', 'pardon')" class="px-3 py-2 rounded-xl bg-[#000000] border border-[#2a364f] text-[#94a3b8] font-bold touch-btn">Verzeihen</button>
            </div>` : '<p class="text-[11px] text-[#cbd5e1] font-sans">Der Top entscheidet über die Strafe.</p>'}
          </div>`).join('');
      }
    }
  }

  // Ergebnis des letzten Wurfs und Wartezeit bis zum nächsten anzeigen (bleibt nach dem Neuladen stehen)
  function renderDice() {
    const timer = document.getElementById('dice-cooldown-timer');
    const card = document.getElementById('dice-result-card');
    const btn = document.getElementById('btn-roll-dice');
    const last = protocolState.lastDiceRoll || 0;
    const remainingMs = last ? last + 24 * 3600 * 1000 - Date.now() : 0;
    const waiting = remainingMs > 0;
    if (timer) {
      const h = Math.floor(remainingMs / 3600000), m = Math.ceil((remainingMs % 3600000) / 60000);
      timer.innerText = waiting ? `Nächster Wurf in ${h > 0 ? h + ' Std. ' : ''}${m} Min.` : 'Bereit';
    }
    if (btn) {
      btn.disabled = waiting || !isUserTop();
      btn.style.opacity = btn.disabled ? '0.5' : '';
      btn.title = !isUserTop() ? 'Nur der Top würfelt.' : waiting ? 'Erst nach Ablauf der 24 Stunden wieder möglich.' : '';
    }
    const res = protocolState.lastDiceResult;
    if (card) {
      if (res && res.eye && Date.now() - res.at < 48 * 3600 * 1000) {
        card.style.display = '';
        card.innerHTML = `<div class="flex items-center justify-between"><strong class="text-[#c5a880]">🎲 Auge ${res.eye}</strong>` +
          `<span class="text-[10px] text-[#94a3b8]">${new Date(res.at).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })} Uhr</span></div>` +
          `<p class="text-[11px] text-[#f8fafc] font-sans leading-relaxed">${String(res.text).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))}</p>`;
      } else {
        card.style.display = 'none';
      }
    }
  }

  function changeHardware(value) {
    if (!HARDWARE_LABELS[value]) return;
    loadProtocolState();
    protocolState.hardware = value;
    saveProtocolState();
    renderDashboard();
    showToast(`Hardware gespeichert: ${HARDWARE_LABELS[value]}`);
  }

  function rollDiceOfFate() {
    if (!isUserTop()) {
      showToast("Nur der Top führt den Schicksals-Entscheid.");
      return;
    }

    loadProtocolState();
    const now = Date.now();
    const cooldownMs = 24 * 3600 * 1000;

    if (protocolState.lastDiceRoll && (now - protocolState.lastDiceRoll) < cooldownMs) {
      const remainingHours = Math.round((cooldownMs - (now - protocolState.lastDiceRoll)) / (3600 * 1000));
      showToast(`Entscheid gesperrt: Nächster Wurf erst in ${remainingHours} Stunden.`);
      return;
    }

    const eye = Math.floor(Math.random() * 6) + 1;
    protocolState.lastDiceRoll = now;

    let eventMsg = "";
    if (eye === 1) {
      eventMsg = "Schicksalswurf: Auge 1. Verlängerung des Verschlusses um 24 Stunden.";
    } else if (eye === 2) {
      eventMsg = "Schicksalswurf: Auge 2. Zuchtmaßnahme: 15 Schläge mit Mitzählen am Abend.";
    } else if (eye === 3 || eye === 4) {
      eventMsg = `Schicksalswurf: Auge ${eye}. Neutraler Verlauf – keine Auswirkung.`;
    } else if (eye === 5) {
      eventMsg = "Schicksalswurf: Auge 5. Gunst: +35 Bonuspunkte aufs Tribut-Konto.";
      appendTransaction(35, 'Schicksalswurf: Auge 5 (Gunst-Bonus)', 'top');
    } else if (eye === 6) {
      eventMsg = "Schicksalswurf: Auge 6. Der Glücksfall: Sofortige 15m Duschpause bewilligt.";
    }

    protocolState.lastDiceResult = { eye, text: eventMsg.replace(/^Schicksalswurf: Auge \d\.\s*/, ''), at: now };
    saveProtocolState();
    renderDashboard();
    showToast(eventMsg);

    if (window.TactusChat) {
      window.TactusChat.post(eventMsg);
    }
  }

  function switchTab(tabId) {
    ['dashboard', 'chores', 'contract', 'ai_coach'].forEach(t => {
      const view = document.getElementById(`view-ledger-${t}`);
      const btn = document.getElementById(`tab-btn-${t}`);
      if (view) {
        // Die Reiter sind im HTML per style="display: none" versteckt – beides setzen
        view.classList.toggle('hidden', t !== tabId);
        view.style.display = t === tabId ? '' : 'none';
      }
      if (btn) {
        if (t === tabId) {
          btn.className = "px-3.5 py-2 rounded-xl font-bold bg-[#000000] border border-[#c5a880] text-[#c5a880] touch-btn shadow-sm whitespace-nowrap shrink-0 flex-shrink-0" + (t === 'ai_coach' ? ' flex items-center gap-1' : '');
        } else {
          btn.className = "px-3.5 py-2 rounded-xl font-bold bg-[#090d14] border border-[#2a364f] text-[#94a3b8] hover:text-[#f8fafc] touch-btn whitespace-nowrap shrink-0 flex-shrink-0" + (t === 'ai_coach' ? ' flex items-center gap-1' : '');
        }
      }
    });

    if (tabId === 'chores') {
      renderChoresAndRewards();
      if (window.ProtocolTasks && typeof window.ProtocolTasks.render === 'function') {
        window.ProtocolTasks.render();
      }
    } else if (tabId === 'contract' && window.ProtocolContract && typeof window.ProtocolContract.renderContract === 'function') {
      window.ProtocolContract.renderContract();
    } else if (tabId === 'dashboard') {
      renderDashboard();
      if (window.ProtocolRatio && typeof window.ProtocolRatio.render === 'function') {
        window.ProtocolRatio.render();
      }
    }
  }

  function toggleLockState() {
    if (!isUserTop()) {
      showToast("Nur der Top kann das Schloss schalten.");
      return;
    }
    loadProtocolState();
    protocolState.isLocked = !protocolState.isLocked;
    if (!protocolState.isLocked && protocolState.hygiene && !protocolState.hygiene.endedAt) protocolState.hygiene.endedAt = Date.now();
    if (protocolState.isLocked) {
      protocolState.lockedSince = Date.now();
      appendTransaction(25, 'Verschluss verriegelt', 'top');
    } else {
      appendTransaction(0, 'Schloss vom Top geöffnet', 'top');
    }

    saveProtocolState();
    renderDashboard();

    const msg = protocolState.isLocked ? "Verschluss aktiv verriegelt." : "Schloss geöffnet.";
    showToast(msg);

    if (window.TactusChat) {
      window.TactusChat.post(msg);
    }
  }

  const api = {
    init: function() {
      loadProtocolState();
      renderDashboard();
      renderChoresAndRewards();
    },
    render: renderDashboard,
    switchTab: switchTab,
    toggleLockState: toggleLockState,
    startHygieneTimer: startHygieneTimer,
    confirmMicroHygiene: confirmMicroHygiene,
    openBreakGlass: openBreakGlassModal,
    cancelBreakGlass: cancelBreakGlass,
    executeBreakGlass: executeBreakGlass,
    rollDiceOfFate: rollDiceOfFate,
    rollFateDice: rollDiceOfFate,
    changeHardware: changeHardware,
    confirmRelocked: confirmRelocked,
    settleViolation: settleViolation,
    petitionReward: petitionReward,
    grantRewardDirectly: grantRewardDirectly,
    addTransaction: function(delta, reason, authorRole) { loadProtocolState(); return appendTransaction(delta, reason, authorRole); },
    getBalance: calculateTotalBalance,
    getState: function() { loadProtocolState(); return protocolState; },
    saveState: saveProtocolState,
    isTop: isUserTop
  };

  window.ProtocolCore = api;
  // Abwärtskompatibler Alias für bestehende Templates
  window.LedgerApp = api;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      loadProtocolState();
      renderDashboard();
    });
  } else {
    loadProtocolState();
  }

})(window);
