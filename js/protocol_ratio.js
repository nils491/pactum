/**
 * js/protocol_ratio.js
 * TACTUS Orgasmus-Ökonomie & Lust-Regie Engine (V3.0 Hyper-Dynamisch)
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien:
 * - Dynamische Führung der Orgasmus-Ratio: N_Top : N_Sub mit konfigurierbaren Zielwerten (2:1 bis 15:1)
 * - 4 physiologisch differenzierte Climax-Typen:
 *   • 'full' (Vollwertige Freigabe mit freier Entladung)
 *   • 'ruined' (Ruined Orgasm: Point-of-No-Return Abbruch)
 *   • 'prostate' (Anal/Prostata ohne penile Schaftreizung)
 *   • 'denial' (Lustverweigerung: Plateau mit Kaltstopp)
 * - Anti-TftB Doktrin: Rechnerische Zielerfüllung begründet keinen Rechtsanspruch des Bottoms (§ 3 Abs. 4)
 * - Verknüpfung mit protocol_core.js (Event-Sourcing Transaktionen) und CloudSync
 * - 100 % frei von infantilen System-Emojis in Buttons und Datenstrukturen
 * - Keine window.alert() / window.confirm() Aufrufe unter keinen Umständen
 */

(function(window) {
  'use strict';

  const STORAGE_KEY_RATIO = 'tactus_climax_ratio_state';
  const STORAGE_KEY_LEGACY = 'kompass_climax_ratio_state';

  const CLIMAX_TYPES = {
    full: {
      id: 'full',
      label: 'Vollwertige Freigabe',
      shortLabel: 'Vollwertig',
      desc: 'Erlaubter, vollständiger Orgasmus mit freier Ejakulation bzw. Entladung.',
      badgeClass: 'bg-[#142b24] text-[#4ade80] border-[#2e5746]'
    },
    ruined: {
      id: 'ruined',
      label: 'Ruined Orgasm',
      shortLabel: 'Ruined',
      desc: 'Am Point of no Return schlagartig abgebrochene Reizung (Muskelkontraktion ohne Entlastungsgenuss).',
      badgeClass: 'bg-[#450a0a] text-[#f87171] border-[#991b1b]'
    },
    prostate: {
      id: 'prostate',
      label: 'Anal / Prostata',
      shortLabel: 'Prostata',
      desc: 'Orgasmus rein über Beckenboden und Prostata ohne direkte Berührung der penilen Vorderseite.',
      badgeClass: 'bg-[#000000] text-[#c5a880] border-[#c5a880]'
    },
    denial: {
      id: 'denial',
      label: 'Lustverweigerung (Denial)',
      shortLabel: 'Denial',
      desc: 'Heranführen an das Erregungsplateau mit anschließendem Kaltstopp und sofortigem Wegsperren.',
      badgeClass: 'bg-[#090d14] text-[#cbd5e1] border-[#2a364f]'
    }
  };

  const DEFAULT_RATIO_PRESETS = [
    { target: 2, label: 'Milde Führung (2:1)', desc: 'Behutsamer Einstieg & Genuss-D/s' },
    { target: 4, label: 'Klassische D/s (4:1)', desc: 'Fokus auf Antizipation & Hingabe' },
    { target: 6, label: 'Klassische FLR (6:1)', desc: 'Standard der Orgasmus-Ökonomie' },
    { target: 8, label: 'Strikte Disziplin (8:1)', desc: 'Wochenlange Enthaltsamkeit des Bottoms' },
    { target: 15, label: 'Langzeit-Keuschheit (15:1)', desc: 'Monats-Zyklen & extreme Trieb-Abtretung' }
  ];

  let ratioState = {
    targetRatio: 6,
    topClimaxCount: 0,
    subClimaxCount: 0,
    history: [],
    updatedAt: Date.now()
  };

  function loadRatioState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_RATIO) || localStorage.getItem(STORAGE_KEY_LEGACY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          ratioState = {
            targetRatio: typeof parsed.targetRatio === 'number' ? parsed.targetRatio : 6,
            topClimaxCount: typeof parsed.topClimaxCount === 'number' ? Math.max(0, parsed.topClimaxCount) : 0,
            subClimaxCount: typeof parsed.subClimaxCount === 'number' ? Math.max(0, parsed.subClimaxCount) : 0,
            history: Array.isArray(parsed.history) ? parsed.history : [],
            updatedAt: parsed.updatedAt || Date.now()
          };
          return;
        }
      }
    } catch (e) {
      console.warn("[TACTUS Ratio] Fehler beim Laden des States:", e);
    }

    ratioState = {
      targetRatio: 6,
      topClimaxCount: 0,
      subClimaxCount: 0,
      history: [],
      updatedAt: Date.now()
    };
  }

  function saveRatioState(skipSync) {
    try {
      ratioState.updatedAt = Date.now();
      const serialized = JSON.stringify(ratioState);
      localStorage.setItem(STORAGE_KEY_RATIO, serialized);
      localStorage.setItem(STORAGE_KEY_LEGACY, serialized);
    } catch (e) {
      console.warn("[TACTUS Ratio] Konnte State nicht sichern:", e);
    }

    if (!skipSync && window.CloudSync && typeof window.CloudSync.trigger === 'function') {
      window.CloudSync.trigger();
    }
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

  function isUserTop() {
    if (window.ProtocolCore && typeof window.ProtocolCore.isTop === 'function') {
      return window.ProtocolCore.isTop();
    }
    const myRole = localStorage.getItem('kompass_assigned_role') || 'A';
    const khRole = localStorage.getItem('kompass_keyholder_role') || 'A';
    return myRole === khRole;
  }

  function calculateRatioProgress() {
    loadRatioState();
    const target = Math.max(1, ratioState.targetRatio);
    const topCount = ratioState.topClimaxCount;
    const subCount = ratioState.subClimaxCount;

    const currentInCycle = topCount - (subCount * target);
    const progressInCycle = Math.max(0, currentInCycle);
    const percentage = Math.min(100, Math.round((progressInCycle / target) * 100));
    const isTargetMet = progressInCycle >= target;

    return {
      topCount: topCount,
      subCount: subCount,
      target: target,
      currentInCycle: progressInCycle,
      percentage: percentage,
      isTargetMet: isTargetMet,
      remainingInCycle: Math.max(0, target - progressInCycle)
    };
  }

  function setTargetRatio(targetNumber) {
    if (!isUserTop()) {
      showToast("Nur der Top kann die Ziel-Ratio kalibrieren.");
      return;
    }
    loadRatioState();
    const num = parseInt(targetNumber, 10);
    if (!isNaN(num) && num >= 1 && num <= 50) {
      ratioState.targetRatio = num;
      saveRatioState();
      renderRatioDashboardWidgets();
      showToast(`Ziel-Ratio auf ${num} : 1 festgelegt`);
    }
  }

  function recordClimax({ beneficiary = 'top', type = 'full', note = '', source = 'manual' }) {
    loadRatioState();

    const isTopBeneficiary = (beneficiary === 'top');
    const verifiedType = CLIMAX_TYPES[type] ? type : 'full';
    const timestamp = Date.now();

    const entry = {
      id: `clx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      beneficiary: isTopBeneficiary ? 'top' : 'sub',
      type: verifiedType,
      note: String(note || '').trim(),
      source: source,
      timestamp: timestamp
    };

    if (isTopBeneficiary) {
      ratioState.topClimaxCount++;
    } else {
      ratioState.subClimaxCount++;
    }

    ratioState.history.unshift(entry);
    if (ratioState.history.length > 150) {
      ratioState.history = ratioState.history.slice(0, 150);
    }

    saveRatioState();
    renderRatioDashboardWidgets();

    const roleName = isTopBeneficiary ? 'Top' : 'Bottom';
    const typeLabel = CLIMAX_TYPES[verifiedType].label;

    // Optional ins Transaktions-Logbuch des Protokolls einbuchen
    if (window.ProtocolCore && typeof window.ProtocolCore.addTransaction === 'function') {
      const delta = isTopBeneficiary ? 15 : -30;
      const reason = `Höhepunkt verbucht: ${roleName} (${typeLabel})`;
      window.ProtocolCore.addTransaction(delta, reason, isTopBeneficiary ? 'top' : 'bottom');
    }

    showToast(`✓ Höhepunkt für ${roleName} verbucht: ${typeLabel}`);

    if (window.TactusChat) {
      window.TactusChat.post(`Orgasmus-Ökonomie: Höhepunkt für ${roleName} (${typeLabel}) verbucht. Neuer Stand: ${ratioState.topClimaxCount} Top : ${ratioState.subClimaxCount} Bottom.`);
    }

    return entry;
  }

  function renderRatioDashboardWidgets() {
    const container = document.getElementById('ledger-ratio-widget-container');
    if (!container) return;

    loadRatioState();
    const isTop = isUserTop();
    const calc = calculateRatioProgress();

    container.innerHTML = `
      <div class="p-4 sm:p-5 rounded-3xl bg-[#090d14]/90 border border-[#2a364f] space-y-4 shadow-xl">
        <div class="flex items-center justify-between border-b border-[#2a364f] pb-3">
          <div class="space-y-0.5">
            <span class="text-[9.5px] font-mono uppercase tracking-wider text-[#c5a880] font-bold block">Orgasmus-Ökonomie</span>
            <h3 class="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
              <span>Top-Verhältnis:</span>
              <span class="font-mono text-[#c5a880] text-sm sm:text-base">${calc.topCount} : ${calc.subCount}</span>
              <span class="text-[10px] text-[#94a3b8] font-mono font-normal">(Ziel: ${calc.target} : 1)</span>
            </h3>
          </div>
          <div class="flex items-center gap-1.5">
            ${isTop ? `
              <button type="button" onclick="ProtocolRatio.openConfigModal()" title="Ziel-Verhältnis anpassen" class="p-2 rounded-xl bg-[#101622] hover:bg-[#1e2638] border border-[#2a364f] text-[#cbd5e1] hover:text-white touch-btn shadow-xs">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"/></svg>
              </button>
              <button type="button" onclick="ProtocolRatio.openLogClimaxModal('top')" class="px-3 py-1.5 rounded-xl bg-[#090d14]/90 hover:bg-[#4a2818] border border-[#c5a880] text-white font-bold text-xs flex items-center gap-1.5 touch-btn shadow-sm">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
                <span>Top +1</span>
              </button>
            ` : `
              <span class="px-2 py-1 rounded-xl bg-[#000000] border border-[#2a364f] text-[10px] font-mono text-[#94a3b8] font-bold">Top-geführt</span>
            `}
          </div>
        </div>

        <!-- Fortschrittsbalken zum aktuellen Zyklus -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between text-xs">
            <span class="text-[#94a3b8] font-medium text-[11px]">Zyklus-Quote: ${calc.currentInCycle} von ${calc.target} Top-Höhepunkten</span>
            <span class="font-mono text-xs font-bold ${calc.isTargetMet ? 'text-[#4ade80]' : 'text-[#c5a880]'}">${calc.percentage}%</span>
          </div>
          <div class="w-full h-2.5 bg-[#000000] rounded-full overflow-hidden border border-[#2a364f] p-0.5">
            <div class="h-full rounded-full transition-all duration-500 ${calc.isTargetMet ? 'bg-gradient-to-r from-[#2e5746] to-[#4ade80]' : 'bg-gradient-to-r from-[#8a5232] to-[#c5a880]'}" style="width: ${Math.max(4, calc.percentage)}%;"></div>
          </div>
        </div>

        <!-- Status-Hinweis mit Anti-TftB Schutzklausel -->
        <div class="p-3 rounded-2xl border text-[11px] leading-relaxed flex items-start gap-2.5 ${calc.isTargetMet ? 'bg-[#142b24]/30 border-[#2e5746]/60 text-[#86efac]' : 'bg-[#000000]/60 border-[#2a364f]/80 text-[#94a3b8]'}">
          <div class="mt-0.5 flex-shrink-0 text-[#c5a880]">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/></svg>
          </div>
          <div class="space-y-0.5">
            ${calc.isTargetMet 
              ? `<strong>Zielquote erfüllt:</strong> Der Top darf nach freiem Ermessen über eine Freigabe für den Bottom entscheiden (kein einklagbarer Rechtsanspruch des Bottoms, § 3 Abs. 4).`
              : `Noch <strong>${calc.remainingInCycle} Höhepunkte für den Top</strong> bis zur rechnerischen Freigabe-Option.`}
          </div>
        </div>

        <!-- Schnellerfassung für Bottom-Höhepunkt -->
        <div class="flex items-center justify-between pt-1 text-xs">
          <span class="text-[10.5px] text-[#94a3b8] font-mono">Bottom-Freigabe erfassen:</span>
          ${isTop ? `
            <button type="button" onclick="ProtocolRatio.openLogClimaxModal('sub')" class="px-2.5 py-1 rounded-xl bg-[#101622] hover:bg-[#1e2638] border border-[#2a364f] text-[#cbd5e1] hover:text-white font-medium text-[11px] flex items-center gap-1 touch-btn">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
              <span>Bottom-Freigabe buchen</span>
            </button>
          ` : `
            <span class="text-[10px] text-[#64748b] font-mono italic">Freigabe-Erfassung obliegt dem Top</span>
          `}
        </div>
      </div>
    `;
  }

  function openConfigModal() {
    if (!isUserTop()) return;
    loadRatioState();
    let modal = document.getElementById('modal-ratio-config');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modal-ratio-config';
      modal.className = "fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4";
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="w-full max-w-md bg-[#090d14] border border-[#2a364f] rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl text-xs">
        <div class="flex items-center justify-between border-b border-[#2a364f] pb-3">
          <div class="space-y-0.5">
            <h3 class="text-sm font-bold text-white">Ziel-Ratio konfigurieren</h3>
            <span class="text-[10px] text-[#94a3b8]">Verhältnis der Höhepunkte: N_Top zu 1 Bottom-Freigabe</span>
          </div>
          <button type="button" onclick="document.getElementById('modal-ratio-config').style.display='none'" class="p-1.5 rounded-lg text-[#94a3b8] hover:text-white">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="space-y-2">
          ${DEFAULT_RATIO_PRESETS.map(preset => `
            <button type="button" onclick="ProtocolRatio.selectPreset(${preset.target})" class="w-full p-3 rounded-2xl border text-left transition-all touch-btn flex items-center justify-between ${ratioState.targetRatio === preset.target ? 'bg-[#000000]/60 border-[#c5a880] text-white shadow-sm' : 'bg-[#000000] border-[#2a364f] text-[#cbd5e1] hover:border-[#2a364f]'}">
              <div class="space-y-0.5">
                <strong class="text-xs text-white block">${escapeHtml(preset.label)}</strong>
                <span class="text-[10px] text-[#94a3b8]">${escapeHtml(preset.desc)}</span>
              </div>
              <span class="text-xs font-mono font-bold ${ratioState.targetRatio === preset.target ? 'text-[#c5a880]' : 'text-[#64748b]'}">
                ${ratioState.targetRatio === preset.target ? '✓' : '○'}
              </span>
            </button>
          `).join('')}
        </div>

        <div class="pt-2 border-t border-[#2a364f] flex justify-end">
          <button type="button" onclick="document.getElementById('modal-ratio-config').style.display='none'" class="px-4 py-2 rounded-xl bg-[#101622] hover:bg-[#1e2638] text-white font-bold text-xs touch-btn">
            Schließen
          </button>
        </div>
      </div>
    `;

    modal.style.display = 'flex';
  }

  function openLogClimaxModal(role = 'top') {
    let modal = document.getElementById('modal-log-climax');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modal-log-climax';
      modal.className = "fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4";
      document.body.appendChild(modal);
    }

    const isTop = (role === 'top');

    modal.innerHTML = `
      <div class="w-full max-w-md bg-[#090d14] border border-[#2a364f] rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl text-xs">
        <div class="flex items-center justify-between border-b border-[#2a364f] pb-3">
          <div class="space-y-0.5">
            <h3 class="text-sm font-bold text-white">Höhepunkt erfassen (${isTop ? 'Top' : 'Bottom'})</h3>
            <span class="text-[10px] text-[#94a3b8]">Wähle Typisierung und Kontext</span>
          </div>
          <button type="button" onclick="document.getElementById('modal-log-climax').style.display='none'" class="p-1.5 rounded-lg text-[#94a3b8] hover:text-white">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="space-y-2">
          <label class="text-[10.5px] font-mono text-[#94a3b8] uppercase tracking-wider block">Typ des Höhepunkts:</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            ${Object.values(CLIMAX_TYPES).map(t => `
              <button type="button" id="btn-clx-type-${t.id}" onclick="ProtocolRatio.selectModalType('${t.id}')" class="p-2.5 rounded-xl border text-left transition-all ${t.id === 'full' ? 'bg-[#000000]/60 border-[#c5a880] text-white shadow-sm' : 'bg-[#000000] border-[#2a364f] text-[#cbd5e1] hover:border-[#2a364f]'}">
                <strong class="text-xs block text-white">${escapeHtml(t.shortLabel)}</strong>
                <span class="text-[9.5px] text-[#94a3b8] leading-tight block mt-0.5">${escapeHtml(t.desc)}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="text-[10.5px] font-mono text-[#94a3b8] uppercase tracking-wider block">Notiz (optional):</label>
          <input type="text" id="input-clx-note" placeholder="z. B. Nach Cunnilingus-Dienst / Schwellen-Quälerei..." class="w-full px-3 py-2 rounded-xl bg-[#000000] border border-[#2a364f] text-[#f8fafc] text-xs focus:border-[#c5a880] focus:outline-none" />
        </div>

        <input type="hidden" id="input-clx-selected-type" value="full" />
        <input type="hidden" id="input-clx-selected-role" value="${isTop ? 'top' : 'sub'}" />

        <div class="pt-2 border-t border-[#2a364f] flex justify-end gap-2">
          <button type="button" onclick="document.getElementById('modal-log-climax').style.display='none'" class="px-3.5 py-2 rounded-xl bg-[#101622] text-[#cbd5e1] font-bold text-xs touch-btn">
            Abbrechen
          </button>
          <button type="button" onclick="ProtocolRatio.submitModalClimax()" class="px-4 py-2 rounded-xl bg-[#c5a880] hover:bg-[#dfcaa9] text-black font-bold text-xs touch-btn shadow-md">
            Höhepunkt buchen ✓
          </button>
        </div>
      </div>
    `;

    modal.style.display = 'flex';
  }

  function selectModalType(typeId) {
    const input = document.getElementById('input-clx-selected-type');
    if (input) input.value = typeId;

    Object.keys(CLIMAX_TYPES).forEach(id => {
      const btn = document.getElementById(`btn-clx-type-${id}`);
      if (btn) {
        if (id === typeId) {
          btn.className = "p-2.5 rounded-xl border text-left transition-all bg-[#000000]/60 border-[#c5a880] text-white shadow-sm";
        } else {
          btn.className = "p-2.5 rounded-xl border text-left transition-all bg-[#000000] border-[#2a364f] text-[#cbd5e1] hover:border-[#2a364f]";
        }
      }
    });
  }

  function submitModalClimax() {
    const typeInput = document.getElementById('input-clx-selected-type');
    const roleInput = document.getElementById('input-clx-selected-role');
    const noteInput = document.getElementById('input-clx-note');

    const type = typeInput ? typeInput.value : 'full';
    const role = roleInput ? roleInput.value : 'top';
    const note = noteInput ? noteInput.value : '';

    recordClimax({ beneficiary: role, type: type, note: note, source: 'dashboard' });

    const modal = document.getElementById('modal-log-climax');
    if (modal) modal.style.display = 'none';
  }

  function selectPreset(targetNumber) {
    setTargetRatio(targetNumber);
    const modal = document.getElementById('modal-ratio-config');
    if (modal) modal.style.display = 'none';
  }

  const api = {
    init: function() {
      loadRatioState();
      renderRatioDashboardWidgets();
    },
    record: recordClimax,
    setTarget: setTargetRatio,
    getProgress: calculateRatioProgress,
    render: renderRatioDashboardWidgets,
    openConfigModal: openConfigModal,
    openLogClimaxModal: openLogClimaxModal,
    selectModalType: selectModalType,
    submitModalClimax: submitModalClimax,
    selectPreset: selectPreset,
    getTypes: function() { return CLIMAX_TYPES; },
    getHistory: function() { loadRatioState(); return ratioState.history.slice(); }
  };

  window.ProtocolRatio = api;
  // Abwärtskompatibler Alias für bestehende Templates
  window.HubRatio = api;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      loadRatioState();
      renderRatioDashboardWidgets();
    });
  } else {
    loadRatioState();
  }

})(window);
