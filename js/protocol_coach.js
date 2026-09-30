/**
 * js/protocol_coach.js
 * TACTUS Top-Führungsassistent, Berufs-Kontext & D/s-Coach Engine (V3.0 Hyper-Dynamisch)
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien:
 * - 7-Vektoren Kontext-Speisung aus HubContext (Psychometrie, Somatik, Historie, Energie, Biologie, Agenda, Hardware)
 * - Dynamische Spannungs-Hysterese (ChastityDatabase) statt starrer Kalendertage
 * - Multi-KI-Integration via AIAdapter (Gemini, Claude, GPT, WebGPU) mit prozeduralem Fallback
 * - Top-First Doktrin: Schutz vor Top Fatigue, Fokus auf Alltagsentlastung und klare Führung
 * - Anti-TftB Doktrin (§ 2 Abs. 3 Regieverbot & § 3 Abs. 4 Schweigepflicht über Lust)
 * - 5 Arbeitsplatz-Profile des Bottoms mit biomechanischer Belastungs-Matrix
 * - Mehrdimensionale Reibungs- und Muster-Analytik
 * - 100 % frei von infantilen System-Emojis in Buttons und Datenstrukturen
 * - Keine window.alert() / window.confirm() Aufrufe unter keinen Umständen
 */

(function(window) {
  'use strict';

  const STORAGE_KEY_WORKPLACE = 'tactus_bottom_workplace';
  const STORAGE_KEY_WORKPLACE_LEGACY = 'kompass_bottom_workplace';
  const STORAGE_KEY_DIRECTIVE = 'tactus_last_coach_directive';
  const STORAGE_KEY_DIRECTIVE_LEGACY = 'kompass_last_coach_directive';

  let currentWorkplace = 'desk_office';
  let lastGeneratedDirective = null;

  function loadCoachState() {
    try {
      const savedWp = localStorage.getItem(STORAGE_KEY_WORKPLACE) || localStorage.getItem(STORAGE_KEY_WORKPLACE_LEGACY);
      if (savedWp) currentWorkplace = savedWp;

      const rawDir = localStorage.getItem(STORAGE_KEY_DIRECTIVE) || localStorage.getItem(STORAGE_KEY_DIRECTIVE_LEGACY);
      if (rawDir) {
        const parsed = JSON.parse(rawDir);
        if (parsed && typeof parsed === 'object') {
          lastGeneratedDirective = parsed;
        }
      }
    } catch (e) {
      console.warn("[TACTUS Coach] Fehler beim Laden des States:", e);
    }
  }

  function saveCoachState(skipSync) {
    try {
      localStorage.setItem(STORAGE_KEY_WORKPLACE, currentWorkplace);
      localStorage.setItem(STORAGE_KEY_WORKPLACE_LEGACY, currentWorkplace);

      if (lastGeneratedDirective) {
        const serialized = JSON.stringify(lastGeneratedDirective);
        localStorage.setItem(STORAGE_KEY_DIRECTIVE, serialized);
        localStorage.setItem(STORAGE_KEY_DIRECTIVE_LEGACY, serialized);
      }
    } catch (e) {
      console.warn("[TACTUS Coach] Fehler beim Sichern des States:", e);
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
    el.className = "bg-noir-900 text-slate-200 font-medium text-xs px-4 py-2.5 rounded-xl shadow-2xl border border-slate-800 transition-all pointer-events-auto transform translate-y-2 opacity-0 flex items-center gap-2.5 backdrop-blur-md";
    el.innerHTML = `
      <svg class="w-4 h-4 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
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

  function setWorkplace(profileId) {
    currentWorkplace = profileId || 'desk_office';
    saveCoachState();
    updateWorkplaceUI();
    showToast("Berufsprofil des Bottoms aktualisiert ✓");
  }

  function updateWorkplaceUI() {
    loadCoachState();
    let profile = null;

    if (window.ChastityDatabase && typeof window.ChastityDatabase.getWorkplaceProfile === 'function') {
      profile = window.ChastityDatabase.getWorkplaceProfile(currentWorkplace);
    }

    const sel = document.getElementById('coach-workplace-select');
    const lbl = document.getElementById('coach-workplace-label');
    const hint = document.getElementById('coach-workplace-hint');

    if (sel && sel.value !== currentWorkplace) sel.value = currentWorkplace;
    if (lbl && profile) lbl.innerText = profile.label;

    if (hint && profile) {
      const ergo = profile.ergonomics || {};
      hint.innerHTML = `
        <div class="space-y-1">
          <div class="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
            <span>Haltung: <strong>${escapeHtml(ergo.primaryPosture || 'variabel')}</strong></span>
            <span>·</span>
            <span>Reibung: <strong class="${ergo.frictionRisk === 'very_high' ? 'text-rose-400' : 'text-slate-300'}">${escapeHtml(ergo.frictionRisk || 'mittel')}</strong></span>
            <span>·</span>
            <span>Spülfenster: <strong>alle ${profile.hygieneWindowHours || 4}h</strong></span>
          </div>
          <span class="text-[10px] text-slate-400 block">
            <strong>Gelegenheiten für Alltags-Regie:</strong> ${(profile.teasingAffordanceVectors || []).map(v => v.replace(/_/g, ' ')).join(' · ')}
          </span>
        </div>
      `;
    }
  }

  function getDynamicSomaticState() {
    let daysLocked = 1;
    let isLocked = false;
    let hardwareId = 'penis_cherrykeeper';

    if (window.ProtocolCore && typeof window.ProtocolCore.getState === 'function') {
      const pState = window.ProtocolCore.getState();
      if (pState) {
        isLocked = !!pState.isLocked;
        hardwareId = pState.hardware || 'penis_cherrykeeper';
        if (isLocked && pState.lockedSince) {
          const diffMs = Math.max(0, Date.now() - pState.lockedSince);
          daysLocked = Math.max(1, Math.floor(diffMs / (24 * 3600 * 1000)) + 1);
        }
      }
    }

    let tensionData = {
      effectiveTensionIndex: daysLocked,
      archetype: { id: 'adaptation', name: 'Phase 1: Gewöhnung & Antizipation', directiveObjective: 'Gewebeschutz & Führungsaufbau', topFocus: 'Kurze Kontrollen, klare Führung.' },
      pelvicSensitivityScore: 5
    };

    if (window.ChastityDatabase && typeof window.ChastityDatabase.calculateDynamicTension === 'function') {
      tensionData = window.ChastityDatabase.calculateDynamicTension({ daysLocked });
    }

    return {
      isLocked,
      daysLocked,
      hardwareId,
      tension: tensionData
    };
  }

  async function generateDailyDirective() {
    loadCoachState();
    const container = document.getElementById('ai-coach-directive-content');
    if (!container) return;

    if (!isUserTop()) {
      showToast("Der Führungsassistent ist ausschließlich für den Top bestimmt.");
      return;
    }

    const somatic = getDynamicSomaticState();
    const days = somatic.daysLocked;
    const phaseInfo = somatic.tension.archetype;

    let workplaceProfile = { label: "Büro / Homeoffice", teasingAffordanceVectors: ["pelvic_kegel_command"] };
    if (window.ChastityDatabase && typeof window.ChastityDatabase.getWorkplaceProfile === 'function') {
      workplaceProfile = window.ChastityDatabase.getWorkplaceProfile(currentWorkplace);
    }

    let topName = 'Top';
    let bottomName = 'Bottom';
    let topMentalLoad = 'balanced';

    if (window.ProtocolTasks && typeof window.ProtocolTasks.getMentalLoad === 'function') {
      topMentalLoad = window.ProtocolTasks.getMentalLoad();
    } else {
      topMentalLoad = localStorage.getItem('tactus_top_mental_load') || 'balanced';
    }

    if (window.HubContext && typeof window.HubContext.getNames === 'function') {
      const names = window.HubContext.getNames();
      const roles = window.HubContext.getRoles();
      topName = names[roles.topRole] || 'Top';
      bottomName = names[roles.bottomRole] || 'Bottom';
    }

    container.innerHTML = `
      <div class="p-4 text-center space-y-2 animate-pulse">
        <div class="w-6 h-6 border-2 border-purple-500/20 border-t-purple-400 rounded-full animate-spin mx-auto"></div>
        <span class="text-xs text-purple-300 font-bold block">TACTUS kalkuliert die Tages-Empfehlung...</span>
        <span class="text-[10px] text-slate-400 block">Stimmt Führung auf Tag ${days}, Mental Load (${topMentalLoad}) und Entlastung ab.</span>
      </div>
    `;

    let generatedText = null;

    // 1. Primärpfad: AIAdapter (Multi-KI Gateway)
    if (window.AIAdapter && typeof window.AIAdapter.generateText === 'function') {
      const prompt = `
Du bist der erfahrene BDSM- und D/s-Führungsberater für ${topName} (Top/Keyholder) im Beziehungs-Betriebssystem TACTUS.
Erstelle für den heutigen Tag eine prägnante, souveräne und alltagstaugliche Regie-Empfehlung zur Führung von ${bottomName} (Bottom).

${window.HubContext && typeof window.HubContext.getLanguageDoctrine === 'function' ? window.HubContext.getLanguageDoctrine() : ''}

KONTEXT DER SITUATION:
- Führungszustand des Tops: ${topMentalLoad} (${topMentalLoad === 'exhausted' ? 'ERSCHÖPFT ──► Alle Aufgaben MÜSSEN den Top im Haushalt entlasten oder stillen Pflegedienst leisten!' : 'Führend & Ausgeglichen'})
- Keuschheit: ${somatic.isLocked ? `Tag ${days} im Verschluss (${phaseInfo.name})` : 'Frei / Unverschlossen'}
- Fokus der aktuellen Phase: ${phaseInfo.directiveObjective}
- Beruf & Belastung von ${bottomName}: ${workplaceProfile.label}

AUFTRAG:
Erstelle 3 kurze, prägnante Impulse:
1. Morgen-Impuls (z. B. 30s Kniestand-Blickkontakt vor dem Gehen, Duftanker)
2. Alltags-Teaser (abgestimmt auf den Beruf von ${bottomName})
3. Feierabend-Dienst (Haushaltsentlastung & Dienst am Top)

Antworte direkt in 4 bis maximal 5 souveränen, erwachsenen Sätzen ohne Kitsch.
`;

      try {
        generatedText = await window.AIAdapter.generateText({
          systemPrompt: "Du bist der somatische Führungs-Coach für TACTUS. Antworte erwachsen, direkt, ohne Kitsch.",
          userPrompt: prompt,
          temperature: 0.6
        });
      } catch (err) {
        console.warn("[TACTUS Coach] KI-Aufruf fehlgeschlagen, nutze prozedurale Heuristik:", err);
      }
    }

    // 2. Fallback: Prozedurale somatische Heuristik
    if (!generatedText || typeof generatedText !== 'string' || generatedText.trim().length < 20) {
      generatedText = synthesizeProceduralDirective(days, phaseInfo, workplaceProfile, topMentalLoad, topName, bottomName);
    }

    lastGeneratedDirective = {
      text: generatedText.trim(),
      generatedAt: Date.now(),
      day: days,
      topMentalLoad
    };

    saveCoachState();
    renderDirectiveHtml(lastGeneratedDirective.text, days, phaseInfo, topMentalLoad);
    showToast("Tages-Empfehlung berechnet ✓");
  }

  function synthesizeProceduralDirective(days, phase, workplace, topLoad, topName, bottomName) {
    if (topLoad === 'exhausted') {
      return `Tages-Plan für Tag ${days} im Verschluss (Fokus: Stille Entlastung des Tops):\n\n` +
        `• Morgen: Kein Redebedarf. Ein stummer Blickkontakt von 20 Sekunden im aufrechten Stand vor dem Gehen genügt zur Bestätigung der Führung.\n` +
        `• Alltag (${workplace.label}): Vollständige Konzentration auf den Beruf. Keine unnötigen Textnachrichten oder Bedürftigkeits-Pings an ${topName}.\n` +
        `• Feierabend: ${bottomName} übernimmt sofort unaufgefordert die Küche und das Bereitstellen der Hausschuhe. Danach 20 Minuten schweigende Fußmassage für ${topName} im abgedunkelten Raum ohne Gegenleistung.`;
    }

    if (topLoad === 'strict') {
      return `Tages-Plan für Tag ${days} (${phase.name} · Strikte Disziplin):\n\n` +
        `• Morgen: 60 Sekunden strammer Kniestand vor dem Spiegel. Vorzeigen der Körperhaltung und ruhiges Danken für die Führung.\n` +
        `• Alltag (${workplace.label}): Diskreter Appell: Durchführung von 3x 20 Beckenboden-Kontraktionen gegen das feste Gitter am Arbeitsplatz.\n` +
        `• Feierabend: Formelle Inspektion des Verschlusses und des reizfreien Hautbilds. Bei kleinsten Versäumnissen oder Unpünktlichkeit werden 15 Schläge mit dem Ledergürtel im Zählrhythmus angesetzt.`;
    }

    // Standard: Ausgeglichen
    return `Tages-Plan für Tag ${days} (${phase.name}):\n\n` +
      `• Morgen: 30 Sekunden Kniestand mit klarem Blickkontakt vor der ersten Alltagsinteraktion als körperlicher Anker.\n` +
      `• Alltag (${workplace.label}): Sende zur Mittagszeit eine kurze, unaufdringliche Erinnerung an die Schlüsselgewalt (z. B. 3 Sekunden Audio-Klimpern).\n` +
      `• Feierabend: ${phase.topFocus || 'Hingebungsvoller Dienst'}. ${bottomName} entlastet dich im Haushalt, bevor du über eine Belohnung oder eine Schwellen-Quälerei entscheidest.`;
  }

  function renderDirectiveHtml(text, days, phase, topLoad) {
    const container = document.getElementById('ai-coach-directive-content');
    if (!container) return;

    const loadBadgeMap = {
      exhausted: '<span class="px-2 py-0.5 rounded text-[9px] font-mono bg-amber-950 text-amber-300 border border-amber-800">Entlastungs-Modus</span>',
      balanced: '<span class="px-2 py-0.5 rounded text-[9px] font-mono bg-purple-950 text-purple-300 border border-purple-800">Ausgeglichen</span>',
      strict: '<span class="px-2 py-0.5 rounded text-[9px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800">Strikte Disziplin</span>'
    };

    container.innerHTML = `
      <div class="space-y-3 animate-fade-in">
        <div class="flex items-center justify-between text-[10px] text-purple-300 font-mono border-b border-indigo-900/40 pb-2 flex-wrap gap-2">
          <div class="flex items-center gap-2">
            <span>Tag ${days} im Verschluss</span>
            <span>·</span>
            <span>${escapeHtml(phase.name || 'Phase')}</span>
          </div>
          <div>${loadBadgeMap[topLoad] || ''}</div>
        </div>

        <div class="text-[11px] text-slate-200 leading-relaxed whitespace-pre-line bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
          ${escapeHtml(text)}
        </div>

        <div class="p-3 rounded-2xl bg-purple-950/30 border border-purple-900/50 text-[10.5px] text-purple-200 flex items-start gap-2.5">
          <div class="text-purple-400 flex-shrink-0 mt-0.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="space-y-0.5 leading-snug">
            <strong>Souveräne Führung:</strong>
            <span class="text-slate-300 block">Führen ist ein Privileg der Freude, kein Verwaltungsjob. Bei Überforderung des Tops wandelt das System Pflichten sofort in stillen Dienst um (§ 6 Abs. 1).</span>
          </div>
        </div>
      </div>
    `;
  }

  function renderFrictionAnalytics() {
    const container = document.getElementById('ai-coach-friction-list');
    if (!container) return;

    let contract = null;
    if (window.ProtocolContract && typeof window.ProtocolContract.getActiveContract === 'function') {
      contract = window.ProtocolContract.getActiveContract();
    }

    const isContractActive = contract && contract.status === 'active';
    let balance = 0;
    if (window.ProtocolCore && typeof window.ProtocolCore.getBalance === 'function') {
      balance = window.ProtocolCore.getBalance();
    }

    let tasks = [];
    if (window.ProtocolTasks && typeof window.ProtocolTasks.getTasks === 'function') {
      tasks = window.ProtocolTasks.getTasks();
    }
    const overdueTasks = tasks.filter(t => t.isDueNow && t.status === 'pending');
    const submittedTasks = tasks.filter(t => t.status === 'submitted');

    let ratioProgress = { topCount: 0, subCount: 0, target: 6, isTargetMet: false };
    if (window.ProtocolRatio && typeof window.ProtocolRatio.getProgress === 'function') {
      ratioProgress = window.ProtocolRatio.getProgress();
    }

    container.innerHTML = `
      <div class="space-y-2.5">
        <!-- Reibungs-Status 1: Pflichten & Prüfungen -->
        <div class="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5 text-xs">
          <div class="flex items-center justify-between">
            <strong class="text-white text-xs block font-bold">Pflichten-Dynamik &amp; Pünktlichkeit:</strong>
            <span class="text-[9.5px] font-mono font-bold px-2 py-0.5 rounded ${overdueTasks.length > 0 ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'}">
              ${overdueTasks.length > 0 ? `${overdueTasks.length} überfällig` : 'Im Plan ✓'}
            </span>
          </div>
          <p class="text-[10.5px] text-slate-300 leading-snug">
            ${overdueTasks.length > 0 
              ? `Überfällige Pflichten bieten Anlass für Zucht nach § 7 (z. B. Punkteabzug oder Kniestand-Appell).` 
              : `Alle Pflichten werden pünktlich eingereicht. ${submittedTasks.length > 0 ? `Es warten ${submittedTasks.length} Vollzugsmeldungen auf deine Prüfung.` : 'Aktuell keine offenen Prüfungen.'}`}
          </p>
        </div>

        <!-- Reibungs-Status 2: Orgasmus-Ökonomie -->
        <div class="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5 text-xs">
          <div class="flex items-center justify-between">
            <strong class="text-white text-xs block font-bold">Lust-Asymmetrie (§ 5 Orgasmus-Ratio):</strong>
            <span class="text-[9.5px] font-mono text-purple-300 font-bold">${ratioProgress.topCount} Top : ${ratioProgress.subCount} Bottom</span>
          </div>
          <p class="text-[10.5px] text-slate-300 leading-snug">
            ${ratioProgress.isTargetMet 
              ? `Die vereinbarte Quote (${ratioProgress.target}:1) ist rechnerisch erfüllt. Eine Freigabe für den Bottom ist möglich, begründet jedoch keinen Rechtsanspruch (§ 3 Abs. 4).`
              : `Fokus liegt auf der Entladung des Tops. Dem Bottom ist jedes Quengeln über Freilassung untersagt.`}
          </p>
        </div>

        <!-- Reibungs-Status 3: Vertragskodex -->
        <div class="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
          <div class="space-y-0.5">
            <strong class="text-white block text-xs font-bold">Beziehungsvertrag:</strong>
            <span class="text-[10px] text-slate-400 font-mono">
              ${isContractActive ? 'Verbindlich ratifiziert ✓ (§ 2 Abs. 3 Regieverbot aktiv)' : 'Entwurf (noch nicht besiegelt)'}
            </span>
          </div>
          <button type="button" onclick="ProtocolCore.switchTab('contract')" class="px-2.5 py-1.5 rounded-xl bg-purple-900/80 hover:bg-purple-800 text-purple-200 font-bold text-[10px] touch-btn flex items-center gap-1">
            <span>Kodex prüfen</span>
            <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
            </svg>
          </button>
        </div>
      </div>
    `;
  }

  function initCoach() {
    loadCoachState();
    updateWorkplaceUI();
    renderFrictionAnalytics();

    if (lastGeneratedDirective) {
      const somatic = getDynamicSomaticState();
      renderDirectiveHtml(
        lastGeneratedDirective.text, 
        lastGeneratedDirective.day || somatic.daysLocked, 
        somatic.tension.archetype, 
        lastGeneratedDirective.topMentalLoad || 'balanced'
      );
    }
  }

  const api = {
    init: initCoach,
    setWorkplace: setWorkplace,
    generateDailyDirective: generateDailyDirective,
    renderFrictionAnalytics: renderFrictionAnalytics,
    getWorkplace: function() { loadCoachState(); return currentWorkplace; },
    getLastDirective: function() { loadCoachState(); return lastGeneratedDirective; }
  };

  window.ProtocolCoach = api;
  // Abwärtskompatibler Alias
  window.LedgerCoach = api;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCoach);
  } else {
    initCoach();
  }

})(window);
