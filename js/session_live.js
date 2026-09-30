/**
 * js/session_live.js
 * TACTUS Schlafzimmer Live-Regie, Nicht-Lineare State-Machine & Vagus-Erdung (V3.0 Hyper-Dynamisch)
 * Offizielle Web-Präsenz: tactus.digital
 */

(function(window) {
  'use strict';

  const STORAGE_KEY_ACTIVE_SCRIPT = 'tactus_active_session_script';
  const STORAGE_KEY_SESSION_LOGS = 'tactus_session_logs';
  const STORAGE_KEY_LEGACY_LOGS = 'kompass_session_logs';
  const STORAGE_KEY_DROP_GUARD = 'tactus_active_drop_guard';

  let activeScript = null;
  let currentPhaseIndex = 0;
  let phaseTimerInterval = null;
  let phaseSecondsRemaining = 0;
  let isPaused = false;
  let wakeLockSentinel = null;
  let isDimmed = false;

  let sessionMetrics = {
    startedAt: null,
    topOrgasmsRecorded: 0,
    subClimaxType: 'denial',
    subClimaxRecorded: false,
    edgesCounted: 0,
    activeSafewordTriggered: null,
    realtimeAdaptations: [],
    intermissionsCount: 0,
    usedEquipmentIds: []
  };

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
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"/>
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

  async function requestWakeLock() {
    try {
      if ('wakeLock' in navigator && !wakeLockSentinel) {
        wakeLockSentinel = await navigator.wakeLock.request('screen');
        wakeLockSentinel.addEventListener('release', () => {
          wakeLockSentinel = null;
        });
      }
    } catch (e) {
      console.debug("[TACTUS Live] WakeLock nicht verfügbar:", e);
    }
  }

  function releaseWakeLock() {
    if (wakeLockSentinel) {
      wakeLockSentinel.release();
      wakeLockSentinel = null;
    }
  }

  function setupMediaSession() {
    if (!('mediaSession' in navigator)) return;

    try {
      const phase = getActivePhase();
      navigator.mediaSession.metadata = new MediaMetadata({
        title: phase ? phase.title : 'TACTUS Live-Regie',
        artist: activeScript?.sessionTitle || 'Schlafzimmer-Session',
        album: `Phase ${currentPhaseIndex + 1} von ${activeScript?.phases?.length || 4}`
      });

      navigator.mediaSession.setActionHandler('play', () => {
        if (isPaused) toggleTimerPause();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        if (!isPaused) toggleTimerPause();
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        nextPhase();
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        previousPhase();
      });
    } catch (e) {
      console.debug("[TACTUS Live] MediaSession Setup ignoriert:", e);
    }
  }

  function toggleScreenDimmer() {
    isDimmed = !isDimmed;
    let overlay = document.getElementById('session-live-dimmer-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'session-live-dimmer-overlay';
      overlay.className = 'fixed inset-0 bg-black/85 z-40 pointer-events-none transition-opacity duration-500';
      document.body.appendChild(overlay);
    }
    overlay.style.opacity = isDimmed ? '1' : '0';
    showToast(isDimmed ? "Nachttisch-Dimmer aktiv (OLED-Halbdunkel)" : "Dimmer deaktiviert");
  }

  function loadActiveScript() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY_ACTIVE_SCRIPT);
      if (raw) {
        activeScript = JSON.parse(raw);
      }
    } catch (e) {
      console.warn("[TACTUS Live] Fehler beim Laden des Skripts:", e);
    }

    if (!activeScript || !Array.isArray(activeScript.phases) || activeScript.phases.length === 0) {
      activeScript = {
        sessionTitle: "Souveräne Führung & Erdung",
        tonality: "sovereign_warm",
        topAgenda: "focus_top",
        intensity: 6,
        phases: [
          {
            phaseIndex: 1,
            title: "Phase 1: Transition & Körperliche Erdung",
            instruction: "Aufrechter Kniestand vor dem Top. Ruhiger Blickkontakt und synchrone 4-7-8 Atemzüge.",
            topDialogueQuote: "„Atme tief aus. Lass den ganzen Alltag draußen vor der Tür. Heute zähle nur ich.“",
            somaticZone: "head_eyes",
            estimatedMinutes: 8
          },
          {
            phaseIndex: 2,
            title: "Phase 2: Machtaufbau & Begrenzung",
            instruction: "Etablierung der Hierarchie. Disziplinierte Ausführung der Haltung.",
            topDialogueQuote: "„Du spürst jetzt ganz genau, wer hier führt. Halt still.“",
            somaticZone: "gluteal_pelvis",
            estimatedMinutes: 12
          },
          {
            phaseIndex: 3,
            title: "Phase 3: Katharsis (Fokus auf mich)",
            instruction: "Bottom bedient den Top rückhaltlos. Top nimmt sich alle Zeit für die eigene Entladung.",
            topDialogueQuote: "„Konzentrier dich ganz auf mich. Kein Gedanke an deine eigene Befriedigung.“",
            somaticZone: "genital_vulva_clitoris",
            estimatedMinutes: 15
          },
          {
            phaseIndex: 4,
            title: "Phase 4: Reverse Aftercare & Rüst-Pflege",
            instruction: "Bottom reicht Wasser, deckt den Top zu, massiert ermüdete Muskeln und desinfiziert genutzte Ausrüstung.",
            topDialogueQuote: "„Guter Dienst. Jetzt Deckenruhe für uns beide.“",
            somaticZone: "back_flanks",
            estimatedMinutes: 10
          }
        ],
        reverseAftercareInstructions: {
          subServiceForTop: "Massage von Nacken und Schultern des Tops, Bereitstellen von warmem Tee.",
          vagusRegulation: "Gewichtsdecke auflegen und 4-7-8 Atemrhythmus gegen Kältezittern einhalten.",
          equipmentDisinfection: "Ausrüstung mit Isopropanol oder pH-neutraler Seife desinfizieren und geordnet verstauen."
        }
      };
    }
  }

  function getActivePhase() {
    if (!activeScript || !Array.isArray(activeScript.phases)) return null;
    return activeScript.phases[currentPhaseIndex] || null;
  }

  function startWithScript(scriptObject) {
    if (scriptObject && Array.isArray(scriptObject.phases)) {
      activeScript = scriptObject;
      try {
        sessionStorage.setItem(STORAGE_KEY_ACTIVE_SCRIPT, JSON.stringify(scriptObject));
      } catch (e) {}
    } else {
      loadActiveScript();
    }

    currentPhaseIndex = 0;
    sessionMetrics = {
      startedAt: Date.now(),
      topOrgasmsRecorded: 0,
      subClimaxType: 'denial',
      subClimaxRecorded: false,
      edgesCounted: 0,
      activeSafewordTriggered: null,
      realtimeAdaptations: [],
      intermissionsCount: 0,
      usedEquipmentIds: []
    };

    if (window.SessionStaging && typeof window.SessionStaging.getConfig === 'function') {
      const cfg = window.SessionStaging.getConfig();
      if (cfg && Array.isArray(cfg.selectedEquipmentIds)) {
        sessionMetrics.usedEquipmentIds = cfg.selectedEquipmentIds.slice();
      }
    }

    requestWakeLock();
    renderLiveCockpit();
    startPhaseTimer();
    setupMediaSession();
  }

  function startPhaseTimer() {
    if (phaseTimerInterval) clearInterval(phaseTimerInterval);
    const phase = getActivePhase();
    const minutes = phase ? (phase.estimatedMinutes || 10) : 10;
    phaseSecondsRemaining = minutes * 60;
    isPaused = false;

    updateTimerDisplay();

    phaseTimerInterval = setInterval(() => {
      if (!isPaused && phaseSecondsRemaining > 0) {
        phaseSecondsRemaining--;
        updateTimerDisplay();
      }
    }, 1000);

    // Auf Wunsch Top-Befehl über Audio-Synthese vorlesen
    if (phase && phase.topDialogueQuote && window.SessionVoice && typeof window.SessionVoice.speak === 'function') {
      const tonality = activeScript?.tonality || 'sovereign_warm';
      window.SessionVoice.speak(phase.topDialogueQuote, { tonality: tonality, phase: currentPhaseIndex + 1 });
    }
  }

  function updateTimerDisplay() {
    const timerEl = document.getElementById('live-phase-timer-text');
    if (!timerEl) return;
    const m = Math.floor(phaseSecondsRemaining / 60);
    const s = phaseSecondsRemaining % 60;
    timerEl.innerText = `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  }

  function toggleTimerPause() {
    isPaused = !isPaused;
    const btn = document.getElementById('btn-live-toggle-pause');
    if (btn) {
      btn.innerText = isPaused ? "Fortsetzen" : "Pausieren";
    }
    showToast(isPaused ? "Timer pausiert" : "Timer läuft weiter");
  }

  function adjustTimer(deltaMinutes) {
    phaseSecondsRemaining = Math.max(0, phaseSecondsRemaining + (deltaMinutes * 60));
    updateTimerDisplay();
    showToast(`${deltaMinutes > 0 ? '+' : ''}${deltaMinutes} Min. angepasst`);
  }

  function adaptCurrentPhase(triggerType) {
    const phase = getActivePhase();
    if (!phase) return;

    const tonality = activeScript?.tonality || 'sovereign_warm';

    const adaptationEvent = {
      timestamp: Date.now(),
      phaseIndex: currentPhaseIndex + 1,
      trigger: triggerType,
      tonality: tonality
    };
    sessionMetrics.realtimeAdaptations.push(adaptationEvent);

    let newInstruction = phase.instruction;
    let newQuote = phase.topDialogueQuote;

    if (triggerType === 'edge_too_fast') {
      sessionMetrics.edgesCounted++;
      adjustTimer(2);

      if (tonality === 'sovereign_cool') {
        newInstruction = `KALTER STOPP! Hände sofort wegnehmen. Reize vollständig einfrieren. 90 Sekunden starrer Blickkontakt. Du rührst dich nicht.`;
        newQuote = `„Wage es nicht. Kein Millimeter mehr. Atme runter und sieh mich an.“`;
      } else if (tonality === 'raw_primal') {
        newInstruction = `KALTSTOPP! Packe den Bottom fest im Nacken und drücke ihn auf die Matratze. Bewegungslos verharren, bis das Zucken aufhört.`;
        newQuote = `„Stopp! Liegen bleiben. Du nimmst dir heute gar nichts ohne mich.“`;
      } else if (tonality === 'playful') {
        newInstruction = `KALTSTOPP! Reiz sofort entziehen, spöttisch lächeln. 90 Sekunden Pause bei vollkommener körperlicher Hilflosigkeit.`;
        newQuote = `„Zu gierig? Das dachte ich mir. Zurücktreten und tief durchatmen.“`;
      } else {
        newInstruction = `KALTER STOPP: Hände ruhig vom Körper nehmen. 90 Sekunden gemeinsame tiefe Bauchatmung. Die Erregung muss vollständig absinken.`;
        newQuote = `„Stillstehen. Lass die Hitze durch deinen Körper fließen, ohne nachzugeben. Ich führe.“`;
      }
    } else if (triggerType === 'overstimulated') {
      if (tonality === 'sovereign_cool') {
        newInstruction = `DROSSELUNG: Intensität um 50 % reduzieren. Langsame, kalte Streichungen. Keine lauten Reize.`;
        newQuote = `„Ich nehme das Tempo raus. Konzentrier dich auf meinen Blick.“`;
      } else if (tonality === 'raw_primal') {
        newInstruction = `DROSSELUNG: Feste Handfläche auf den Brustkorb oder Rücken legen. Körpergewicht zur vegetativen Erdung nutzen.`;
        newQuote = `„Spür meine Hand. Tief ausatmen. Beruhige deinen Puls.“`;
      } else if (tonality === 'playful') {
        newInstruction = `DROSSELUNG: Neckendes Streicheln mit den Fingerspitzen, Schmerzreize pausieren.`;
        newQuote = `„Wir machen eine kurze Pause – damit du gleich wieder bereit bist.“`;
      } else {
        newInstruction = `DROSSELUNG: Sanfte Handauflegung über dem Kreuzbein zur Vagus-Beruhigung. Intensität halbieren.`;
        newQuote = `„Atme tief in den Bauch. Ich bin bei dir. Alles ist sicher.“`;
      }
    } else if (triggerType === 'intensify') {
      adjustTimer(3);

      if (tonality === 'sovereign_cool') {
        newInstruction = `INTENSIVIERUNG: Takt und Härte merklich anziehen. Keine Schonung. Absolute Disziplin einfordern.`;
        newQuote = `„Zähne zusammenbeißen. Du hältst das aus. Zeig mir deine Haltung.“`;
      } else if (tonality === 'raw_primal') {
        newInstruction = `INTENSIVIERUNG: Zupackender Griff. Rhythmus und Druck kompromisslos verstärken.`;
        newQuote = `„Jetzt gehört dein Körper ganz mir. Halt still.“`;
      } else if (tonality === 'playful') {
        newInstruction = `INTENSIVIERUNG: Erhöhung der Schlagkraft oder Schwellenfrequenz mit spöttischer Aufforderung zum Durchhalten.`;
        newQuote = `„Das war erst das Vorgeplänkel. Jetzt wird es interessant.“`;
      } else {
        newInstruction = `INTENSIVIERUNG: Kraftvollere Führung. Konsequente Ausführung des Hauptmotivs.`;
        newQuote = `„Vertrau mir vollkommen. Geh mit mir durch diese Intensität.“`;
      }
    }

    phase.instruction = newInstruction;
    phase.topDialogueQuote = newQuote;

    if (window.SessionVoice && typeof window.SessionVoice.speak === 'function') {
      window.SessionVoice.speak(newQuote, { tonality: tonality, phase: currentPhaseIndex + 1 });
    }

    renderLiveCockpit();
    showToast(`Dynamisch adaptiert (${triggerType.replace(/_/g, ' ')}) ✓`);

    if (navigator.vibrate) {
      navigator.vibrate([80, 40, 80]);
    }
  }

  async function injectMicroDisciplineBranch() {
    const phase = getActivePhase();
    if (!phase) return;

    let speechDoF = 1.0;
    let handsDoF = 1.0;

    if (window.ToyCombinatorics && typeof window.ToyCombinatorics.calculateDegreesOfFreedom === 'function') {
      let activeToys = [];
      if (window.EquipmentCatalog && typeof window.EquipmentCatalog.getAll === 'function') {
        activeToys = window.EquipmentCatalog.getAll().filter(it => sessionMetrics.usedEquipmentIds.includes(it.id));
      }
      const dofRes = window.ToyCombinatorics.calculateDegreesOfFreedom(activeToys);
      speechDoF = dofRes.dof.speech_articulation;
      handsDoF = dofRes.dof.manual_manipulation;
    }

    sessionMetrics.intermissionsCount++;
    adjustTimer(2);

    let synthesizedPosture = "Körper in aufrechter Kniestand-Haltung vor dem Top verharren lassen.";
    if (window.ProtocolTasks && typeof window.ProtocolTasks.regeneratePosture === 'function' && window.SomaticPostureSynthesizer) {
      try {
        synthesizedPosture = await window.SomaticPostureSynthesizer.synthesize('prac_leather_belt');
      } catch (e) {}
    } else {
      const isHandsBound = handsDoF <= 0.05;
      synthesizedPosture = isHandsBound
        ? "Stirnlage auf der Bettkante ohne Abstützung durch die Hände (Hände arretiert). Becken exponiert."
        : "Freier Stand im Raum im 90-Grad-Winkel, Hände fest im Nacken verschränkt.";
    }

    const isSpeechBlocked = speechDoF <= 0.05;
    const countDirective = isSpeechBlocked 
      ? "Bottom quittiert jeden Treffer durch deutliches Klopfen mit der Handfläche auf die Bettkante (Sprache blockiert)."
      : "Bottom zählt jeden Treffer laut, klar und ohne Zögern mit.";

    phase.instruction = `AD-HOC ZUCHT-EINSCHUB: 10 Schläge mit der flachen Hand oder dem Ledergürtel. Haltung: ${synthesizedPosture} ${countDirective}`;
    phase.topDialogueQuote = `„Position einnehmen. 10 Schläge zur Besinnung. Keine Bewegung im Raum.“`;

    if (window.SessionVoice && typeof window.SessionVoice.speak === 'function') {
      const tonality = activeScript?.tonality || 'sovereign_warm';
      window.SessionVoice.speak(phase.topDialogueQuote, { tonality: tonality, phase: currentPhaseIndex + 1 });
    }

    renderLiveCockpit();
    showToast("Ad-Hoc Zuchtmaßnahme dynamisch eingesteuert ✓");
  }

  function getSubEmergencyIntervention() {
    let chosenVal = 'hug';
    let customTriggers = '';

    try {
      const rawAns = localStorage.getItem('kompass_answers');
      if (rawAns) {
        const parsed = JSON.parse(rawAns);
        const cagedRole = localStorage.getItem('kompass_caged_role') || 'B';
        const subAns = parsed[cagedRole] || {};
        if (subAns['choice_904']) chosenVal = subAns['choice_904'];
      }
      const rawPass = localStorage.getItem('tactus_medical_pass');
      if (rawPass) {
        const pass = JSON.parse(rawPass);
        customTriggers = pass.customTriggers || pass.emergencyNotes || '';
      }
    } catch (e) {}

    const INTERVENTIONS_MAP = {
      hug: {
        title: "Feste, stumme Umarmung (Gewichtsdecken-Effekt)",
        action: "Feste, beruhigende Umarmung ohne Worte. Körper an den eigenen ziehen und ruhig halten, bis das Zittern aufhört."
      },
      distance: {
        title: "Körperliche Berührung sofort einstellen & Raum geben",
        action: "Hände sofort zurückziehen. Einen Schritt Abstand nehmen. Dem Sub Raum geben und ruhig im Blickfeld bleiben."
      },
      grounding: {
        title: "Licht anmachen, zudecken & 4-7-8 Vagus-Atmung",
        action: "Raumlicht sanft einschalten, schwere Decke überlegen und synchrone 4-7-8 Vagus-Atmung anleiten."
      },
      water_tea: {
        title: "Warmen Tee oder Wasser reichen",
        action: "Schluck warmes Wasser oder gezuckerten Tee reichen. Keine Fragen stellen."
      },
      voice: {
        title: "Mit leiser, ruhiger Stimme reden",
        action: "Mit tiefer, gleichmäßiger Stimme sprechen: 'Du bist vollkommen sicher bei mir. Alles ist gut.'"
      }
    };

    return {
      desired: INTERVENTIONS_MAP[chosenVal] || INTERVENTIONS_MAP.hug,
      customTriggers: customTriggers
    };
  }

  function triggerSafeword(color) {
    sessionMetrics.activeSafewordTriggered = color;

    if (color === 'red') {
      if (phaseTimerInterval) clearInterval(phaseTimerInterval);
      isPaused = true;
      releaseWakeLock();

      const emergency = getSubEmergencyIntervention();

      const container = document.getElementById('live-session-container');
      if (container) {
        container.innerHTML = `
          <div class="max-w-xl mx-auto p-5 sm:p-6 rounded-3xl bg-rose-950/80 border-2 border-rose-600 space-y-4 text-xs text-white shadow-2xl animate-fade-in">
            <div class="flex items-center gap-3 border-b border-rose-800 pb-3">
              <div class="w-10 h-10 rounded-2xl bg-rose-900 border border-rose-500 flex items-center justify-center font-black text-lg">
                ✕
              </div>
              <div>
                <h2 class="text-base font-bold text-white uppercase tracking-wider font-serif">Safeword ROT aktiviert</h2>
                <span class="text-rose-200 text-[10.5px]">Sofortiger Handlungsstillstand & Deeskalation</span>
              </div>
            </div>

            <!-- KAPITEL 00 INTERVENTION DES SUBS -->
            <div class="p-4 rounded-2xl bg-black/70 border border-rose-500 space-y-2">
              <span class="text-[9.5px] font-mono uppercase tracking-wider text-rose-400 font-bold block">
                Gewünschte Notfall-Intervention des Subs (Kapitel 00):
              </span>
              <strong class="text-xs text-white block font-bold">${escapeHtml(emergency.desired.title)}</strong>
              <p class="text-[11px] text-rose-100 leading-snug font-medium">${escapeHtml(emergency.desired.action)}</p>
            </div>

            ${emergency.customTriggers ? `
              <div class="p-3 rounded-2xl bg-slate-950/80 border border-rose-900/60 text-[10.5px] text-slate-300 space-y-1">
                <span class="font-mono text-rose-400 font-bold text-[9px] block">Hinterlegte Traumagrenzen & Trigger:</span>
                <p class="italic">„${escapeHtml(emergency.customTriggers)}“</p>
              </div>
            ` : ''}

            <div class="p-3.5 rounded-2xl bg-black/60 border border-rose-800 space-y-1.5 leading-relaxed text-[10.5px]">
              <strong class="text-rose-300 block font-bold">Allgemeine RACK-Sicherheitsregeln:</strong>
              <p>1. Alle aktiven Handlungen sofort einstellen. Hände und Reize vom Körper nehmen.</p>
              <p>2. Enge Fesselungen oder Knebel vorsichtig und ohne Hektik lösen.</p>
              <p>3. Keine Vorwürfe, keine Debatte. Erst den Puls stabilisieren.</p>
            </div>

            <div class="pt-2 flex justify-between gap-2">
              <button type="button" onclick="SessionLive.renderVagusBreathingModal()" class="px-4 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs touch-btn shadow-md">
                4-7-8 Vagus-Erdung öffnen
              </button>
              <button type="button" onclick="SessionLive.openReverseAftercareModal()" class="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs touch-btn">
                Direkt zur Nachsorge
              </button>
            </div>
          </div>
        `;
      }
      showToast("Safeword ROT: Sofortiger Handlungsstillstand.");
    } else if (color === 'yellow') {
      adaptCurrentPhase('overstimulated');
      showToast("Safeword GELB: Intensität wird gedrosselt.");
    } else {
      showToast("Safeword GRÜN: Zustand stabil.");
    }
  }

  function nextPhase() {
    if (!activeScript || !activeScript.phases) return;
    if (currentPhaseIndex < activeScript.phases.length - 1) {
      currentPhaseIndex++;
      renderLiveCockpit();
      startPhaseTimer();
      setupMediaSession();
      showToast(`Phase ${currentPhaseIndex + 1} gestartet`);
    } else {
      openReverseAftercareModal();
    }
  }

  function previousPhase() {
    if (currentPhaseIndex > 0) {
      currentPhaseIndex--;
      renderLiveCockpit();
      startPhaseTimer();
      setupMediaSession();
      showToast(`Zurück zu Phase ${currentPhaseIndex + 1}`);
    }
  }

  function recordTopClimaxDirectly() {
    sessionMetrics.topOrgasmsRecorded++;
    if (window.ProtocolRatio && typeof window.ProtocolRatio.record === 'function') {
      window.ProtocolRatio.record({
        beneficiary: 'top',
        type: 'full',
        note: `Schlafzimmer-Session: ${activeScript?.sessionTitle || 'Live-Regie'}`,
        source: 'session_live'
      });
    }
    const badge = document.getElementById('live-top-climax-counter');
    if (badge) badge.innerText = `${sessionMetrics.topOrgasmsRecorded} Top`;
    showToast(`✓ Höhepunkt für den Top gebucht (${sessionMetrics.topOrgasmsRecorded})`);
  }

  function recordSubClimaxTriage(typeKey) {
    sessionMetrics.subClimaxType = typeKey;
    sessionMetrics.subClimaxRecorded = true;

    if (window.ProtocolRatio && typeof window.ProtocolRatio.record === 'function') {
      window.ProtocolRatio.record({
        beneficiary: 'sub',
        type: typeKey,
        note: `Live-Session Ausgang: ${typeKey.toUpperCase()}`,
        source: 'session_live'
      });
    }

    renderLiveCockpit();
    showToast(`✓ Bottom-Ausgang protokolliert: ${typeKey.toUpperCase()}`);
  }

  function renderLiveCockpit() {
    const container = document.getElementById('live-session-container');
    if (!container) return;

    loadActiveScript();
    const phases = activeScript.phases || [];
    const currentPhase = phases[currentPhaseIndex] || phases[0];
    const totalPhases = phases.length;

    container.innerHTML = `
      <div class="space-y-4 max-w-2xl mx-auto text-xs animate-fade-in">
        
        <!-- HEADER DER LIVE-SESSION -->
        <div class="p-4 sm:p-5 rounded-3xl bg-slate-900/95 border border-purple-900/60 space-y-2 shadow-2xl">
          <div class="flex items-center justify-between border-b border-purple-900/40 pb-2.5">
            <div class="space-y-0.5 min-w-0 flex-1 pr-2">
              <span class="text-[9px] font-mono uppercase tracking-wider text-purple-400 font-bold block truncate">Live-Regie im Halbdunkel · Top-First</span>
              <h2 class="text-sm sm:text-base font-bold text-white truncate font-serif">
                ${escapeHtml(activeScript.sessionTitle || 'TACTUS Session')}
              </h2>
            </div>
            
            <div class="flex items-center gap-1.5 flex-shrink-0">
              <button type="button" onclick="SessionLive.toggleDimmer()" title="Nachttisch-Dimmer (OLED)" class="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white touch-btn">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/></svg>
              </button>
              <button type="button" onclick="SessionLive.renderVagusBreathingModal()" title="4-7-8 Vagus-Atmung" class="px-2.5 py-1.5 rounded-xl bg-purple-950 border border-purple-800 text-purple-300 font-mono text-[10px] font-bold touch-btn">
                4-7-8
              </button>
            </div>
          </div>

          <!-- PHASEN-FORTSCHRITT & COUNTER -->
          <div class="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
            <span>Phase ${currentPhaseIndex + 1} von ${totalPhases}</span>
            <div class="flex items-center gap-1 font-bold">
              <span id="live-top-climax-counter" class="text-purple-300">${sessionMetrics.topOrgasmsRecorded} Top</span>
              <span>·</span>
              <span id="live-sub-edge-counter" class="text-amber-300">${sessionMetrics.edgesCounted} Kanten</span>
              <span>·</span>
              <span class="text-indigo-300">${sessionMetrics.subClimaxRecorded ? sessionMetrics.subClimaxType.toUpperCase() : 'DENIAL'}</span>
            </div>
          </div>
        </div>

        <!-- AKTIVE PHASEN-KARTE -->
        <div class="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div class="flex items-center justify-between border-b border-slate-800 pb-2">
            <strong class="text-xs sm:text-sm font-bold text-white block">
              ${escapeHtml(currentPhase.title)}
            </strong>
            <span class="px-2 py-0.5 rounded text-[9.5px] font-mono bg-purple-950 text-purple-300 border border-purple-800 font-bold">
              Zone: ${escapeHtml(currentPhase.somaticZone || 'Körper')}
            </span>
          </div>

          <!-- HANDLUNGSANWEISUNG -->
          <div class="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
            ${escapeHtml(currentPhase.instruction)}
          </div>

          <!-- WÖRTLICHER BEFEHL DES TOPS -->
          ${currentPhase.topDialogueQuote ? `
            <div class="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-900/60 space-y-1">
              <span class="text-[9px] font-mono uppercase tracking-wider text-purple-400 font-bold block">Wörtlicher Befehl:</span>
              <blockquote class="text-xs italic text-purple-200 leading-snug font-serif">
                ${escapeHtml(currentPhase.topDialogueQuote)}
              </blockquote>
            </div>
          ` : ''}

          <!-- TIMER-ANZEIGE & BLINDE STEUERUNG -->
          <div class="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
            <div class="flex items-center gap-2">
              <span id="live-phase-timer-text" class="text-lg font-mono font-black text-purple-300">10:00</span>
              <button type="button" id="btn-live-toggle-pause" onclick="SessionLive.togglePause()" class="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold touch-btn">
                Pausieren
              </button>
            </div>
            
            <div class="flex items-center gap-1 font-mono text-[10px]">
              <button type="button" onclick="SessionLive.adjustTimer(-1)" class="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center justify-center touch-btn">-1m</button>
              <button type="button" onclick="SessionLive.adjustTimer(2)" class="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center justify-center touch-btn">+2m</button>
            </div>
          </div>
        </div>

        <!-- SCHNELLE DYNAMISCHE VERZWEIGUNGEN (TONALITÄTS-MODULIERT) -->
        <div class="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-[9.5px] font-mono uppercase tracking-wider text-slate-400 font-bold block">Live-Adaption (Sofort-Korrektur):</span>
            <button type="button" onclick="SessionLive.injectMicroDiscipline()" class="px-2 py-0.5 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 font-mono text-[9px] font-bold touch-btn">
              + Zucht-Einschub
            </button>
          </div>
          <div class="grid grid-cols-3 gap-1.5 text-xs">
            <button type="button" onclick="SessionLive.adaptPhase('edge_too_fast')" class="p-2 rounded-xl bg-amber-950/60 hover:bg-amber-900 border border-amber-800 text-amber-200 text-left touch-btn">
              <strong class="text-[10.5px] block font-bold">Kaltstopp</strong>
              <span class="text-[9px] text-amber-300/80 block mt-0.5">Schwelle zu nah</span>
            </button>
            <button type="button" onclick="SessionLive.adaptPhase('overstimulated')" class="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-left touch-btn">
              <strong class="text-[10.5px] block font-bold">Dämpfen</strong>
              <span class="text-[9px] text-slate-400 block mt-0.5">Nervensystem schonen</span>
            </button>
            <button type="button" onclick="SessionLive.adaptPhase('intensify')" class="p-2 rounded-xl bg-purple-950/60 hover:bg-purple-900 border border-purple-800 text-purple-200 text-left touch-btn">
              <strong class="text-[10.5px] block font-bold">Steigern</strong>
              <span class="text-[9px] text-purple-300/80 block mt-0.5">Fester & konsequenter</span>
            </button>
          </div>
        </div>

        <!-- TOP-LUST BUCHUNG & SUB-CLIMAX TRIAGE (PHASE 3 & 4) -->
        <div class="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-mono text-purple-300 font-bold">Höhepunkt Top:</span>
            <button type="button" onclick="SessionLive.recordTopClimax()" class="px-3 py-1.5 rounded-xl bg-purple-800 hover:bg-purple-700 text-white font-bold text-xs touch-btn shadow-md flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-purple-200" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
              <span>Top-Höhepunkt buchen (+1)</span>
            </button>
          </div>

          <!-- SUB-CLIMAX TRIAGE BUTTONS IN DER KATHARSIS -->
          ${currentPhaseIndex >= 2 ? `
            <div class="pt-2 border-t border-slate-800 space-y-1.5">
              <span class="text-[9.5px] font-mono text-indigo-300 font-bold block">Ausgang Bottom (Triage):</span>
              <div class="grid grid-cols-4 gap-1 text-[10px]">
                <button type="button" onclick="SessionLive.triageSub('denial')" class="p-1.5 rounded-lg border text-center transition-all ${sessionMetrics.subClimaxType === 'denial' ? 'bg-indigo-900 border-indigo-500 text-white font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'}">
                  Denial
                </button>
                <button type="button" onclick="SessionLive.triageSub('ruined')" class="p-1.5 rounded-lg border text-center transition-all ${sessionMetrics.subClimaxType === 'ruined' ? 'bg-rose-900 border-rose-500 text-white font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'}">
                  Ruined
                </button>
                <button type="button" onclick="SessionLive.triageSub('prostate')" class="p-1.5 rounded-lg border text-center transition-all ${sessionMetrics.subClimaxType === 'prostate' ? 'bg-purple-900 border-purple-500 text-white font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'}">
                  Prostata
                </button>
                <button type="button" onclick="SessionLive.triageSub('full')" class="p-1.5 rounded-lg border text-center transition-all ${sessionMetrics.subClimaxType === 'full' ? 'bg-emerald-900 border-emerald-500 text-white font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'}">
                  Freigabe
                </button>
              </div>
            </div>
          ` : ''}

          <div class="flex items-center justify-between pt-2 border-t border-slate-800">
            <button type="button" onclick="SessionLive.prevPhase()" ${currentPhaseIndex === 0 ? 'disabled' : ''} class="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold text-xs touch-btn disabled:opacity-30">
              ← Zurück
            </button>
            <button type="button" onclick="SessionLive.nextPhase()" class="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-800 to-indigo-800 text-white font-bold text-xs touch-btn shadow-md">
              ${currentPhaseIndex === totalPhases - 1 ? 'Zur Nachsorge (Aftercare) →' : 'Nächste Phase →'}
            </button>
          </div>
        </div>

        <!-- SAFEWORD-AMPEL (IMMER SICHER VERFÜGBAR) -->
        <div class="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
          <span class="text-[10px] font-mono text-slate-500 uppercase font-bold">Safeword-Ampel:</span>
          <div class="flex items-center gap-1.5">
            <button type="button" onclick="SessionLive.safeword('green')" class="px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 font-bold text-[10px] touch-btn">Grün</button>
            <button type="button" onclick="SessionLive.safeword('yellow')" class="px-2.5 py-1 rounded-lg bg-amber-950 border border-amber-800 text-amber-300 font-bold text-[10px] touch-btn">Gelb</button>
            <button type="button" onclick="SessionLive.safeword('red')" class="px-3 py-1 rounded-lg bg-rose-950 border border-rose-700 text-rose-200 font-black text-[10px] touch-btn">ROT (Stopp)</button>
          </div>
        </div>

      </div>
    `;
  }

  const VAGUS_BREATHING_PATTERNS = {
    '4_7_8': {
      id: '4_7_8',
      name: '4-7-8 Vagus-Relax',
      desc: 'Maximale Parasympathikus-Aktivierung, Kältezittern-Stopp & Drop-Schutz',
      steps: [
        { label: 'Einatmen', duration: 4, action: 'inhale', text: 'Langsam und tief durch die Nase einströmen lassen' },
        { label: 'Halten', duration: 7, action: 'hold', text: 'Luft anhalten, Brustkorb entspannt geöffnet lassen' },
        { label: 'Ausatmen', duration: 8, action: 'exhale', text: 'Gleichmäßig und vollständig durch den Mund entweichen lassen' }
      ]
    },
    'box_4': {
      id: 'box_4',
      name: '4-4-4-4 Box Breathing',
      desc: 'Autonome Zentrierung, Fokussierung & Puls-Stabilisierung',
      steps: [
        { label: 'Einatmen', duration: 4, action: 'inhale', text: 'Tief durch die Nase einatmen' },
        { label: 'Halten', duration: 4, action: 'hold', text: 'Spannung im Körper ruhig halten' },
        { label: 'Ausatmen', duration: 4, action: 'exhale', text: 'Ruhig und gleichmäßig ausatmen' },
        { label: 'Leere halten', duration: 4, action: 'empty_hold', text: 'In der Leere verharren und nachspüren' }
      ]
    },
    'coherence_5': {
      id: 'coherence_5',
      name: '5-5 Herz-Kohärenz',
      desc: '0,1 Hz HRV-Resonanz für synchrone Herz-Hirn-Schwingung',
      steps: [
        { label: 'Einatmen', duration: 5, action: 'inhale', text: 'Fließend und sanft 5s einatmen' },
        { label: 'Ausatmen', duration: 5, action: 'exhale', text: 'Sanft und lückenlos 5s ausströmen lassen' }
      ]
    }
  };

  let activeBreathingPatternId = '4_7_8';
  let breathingIntervalTimer = null;
  let isBreathingActive = false;
  let currentCycleNumber = 1;
  const TARGET_CYCLES_COUNT = 4;

  function renderVagusBreathingModal() {
    stopBreathingEngine();

    let modal = document.getElementById('modal-vagus-breathing');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modal-vagus-breathing';
      modal.className = "fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 select-none";
      document.body.appendChild(modal);
    }

    const currentPattern = VAGUS_BREATHING_PATTERNS[activeBreathingPatternId] || VAGUS_BREATHING_PATTERNS['4_7_8'];

    modal.innerHTML = `
      <div class="w-full max-w-sm bg-slate-900/95 border border-purple-900/80 rounded-3xl p-5 sm:p-6 text-center space-y-4 shadow-2xl text-xs text-white relative overflow-hidden backdrop-blur-md">
        <!-- AMBIENT GLOW EFFECT -->
        <div id="vagus-ambient-halo" class="absolute -inset-10 bg-purple-900/10 rounded-full blur-3xl pointer-events-none transition-all duration-1000 opacity-30"></div>

        <!-- HEADER -->
        <div class="flex items-center justify-between border-b border-purple-900/50 pb-2 relative z-10">
          <div class="text-left space-y-0.5">
            <span class="text-[9px] font-mono uppercase tracking-wider text-purple-400 font-bold block">Somatische Neuro-Regulation</span>
            <h3 class="text-sm sm:text-base font-bold text-white font-serif" id="vagus-pattern-title">${escapeHtml(currentPattern.name)}</h3>
          </div>
          <button type="button" onclick="SessionLive.closeVagusBreathingModal()" class="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center touch-btn">✕</button>
        </div>

        <!-- KADENZ-AUSWAHL -->
        <div class="grid grid-cols-3 gap-1 relative z-10 text-[10px]">
          <button type="button" onclick="SessionLive.selectBreathingPattern('4_7_8')" class="p-1.5 rounded-xl border font-bold transition-all ${activeBreathingPatternId === '4_7_8' ? 'bg-purple-950 border-purple-500 text-purple-200 shadow-sm' : 'bg-slate-950 border-slate-800 text-slate-400'}">
            4-7-8 Vagus
          </button>
          <button type="button" onclick="SessionLive.selectBreathingPattern('box_4')" class="p-1.5 rounded-xl border font-bold transition-all ${activeBreathingPatternId === 'box_4' ? 'bg-purple-950 border-purple-500 text-purple-200 shadow-sm' : 'bg-slate-950 border-slate-800 text-slate-400'}">
            4-4-4-4 Box
          </button>
          <button type="button" onclick="SessionLive.selectBreathingPattern('coherence_5')" class="p-1.5 rounded-xl border font-bold transition-all ${activeBreathingPatternId === 'coherence_5' ? 'bg-purple-950 border-purple-500 text-purple-200 shadow-sm' : 'bg-slate-950 border-slate-800 text-slate-400'}">
            5-5 HRV
          </button>
        </div>

        <!-- CIRCULAR SVG BREATHING STAGE -->
        <div class="py-4 flex flex-col items-center justify-center relative z-10">
          <div class="relative w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center">
            
            <!-- SVG CIRCULAR PROGRESS TRACK -->
            <svg class="w-full h-full transform -rotate-90 pointer-events-none" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="70" stroke="currentColor" stroke-width="4" fill="none" class="text-slate-800/80" />
              <circle id="vagus-svg-arc" cx="80" cy="80" r="70" stroke="currentColor" stroke-width="5" fill="none" stroke-linecap="round" class="text-purple-400 transition-all" style="stroke-dasharray: 439.8; stroke-dashoffset: 439.8;" />
            </svg>

            <!-- PULSING INNER SOMATIC CORE -->
            <div id="vagus-breath-core" class="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-purple-400/40 bg-gradient-to-tr from-purple-950/80 via-slate-900 to-indigo-950/70 shadow-2xl flex flex-col items-center justify-center text-center transform scale-75 transition-all">
              <span id="vagus-breath-label" class="font-bold text-xs sm:text-sm tracking-wider text-purple-200 uppercase font-mono">Bereit</span>
              <span id="vagus-breath-seconds" class="font-mono text-3xl sm:text-4xl font-black text-white mt-0.5 leading-none">4</span>
            </div>
          </div>

          <!-- CYCLE TRACKER & PHASE DIRECTIVE -->
          <div class="mt-3 space-y-1">
            <span id="vagus-cycle-badge" class="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-purple-950/80 text-purple-300 border border-purple-800 inline-block">
              Zyklus 1 von ${TARGET_CYCLES_COUNT}
            </span>
            <p id="vagus-instruction-text" class="text-[11px] text-slate-300 font-medium leading-snug px-4 min-h-[2rem] flex items-center justify-center">
              ${escapeHtml(currentPattern.desc)}
            </p>
          </div>
        </div>

        <!-- CONTROLS & HAPTIC NOTICE -->
        <div class="pt-2 border-t border-slate-800 relative z-10 flex flex-col gap-2">
          <button type="button" id="btn-vagus-toggle" onclick="SessionLive.toggleBreathingCycle()" class="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-800 via-indigo-800 to-purple-700 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm touch-btn shadow-xl flex items-center justify-center gap-2">
            <span>Atemführung starten</span>
          </button>
          <span class="text-[9.5px] font-mono text-slate-500">Taktile Haptik aktiv: Schließe die Augen im Halbdunkel</span>
        </div>
      </div>
    `;

    modal.style.display = 'flex';
  }

  function selectBreathingPattern(patternId) {
    if (!VAGUS_BREATHING_PATTERNS[patternId]) return;
    activeBreathingPatternId = patternId;
    renderVagusBreathingModal();
  }

  function toggleBreathingCycle() {
    if (isBreathingActive) {
      stopBreathingEngine();
      renderVagusBreathingModal();
    } else {
      startDynamicBreathingEngine();
    }
  }

  function startDynamicBreathingEngine() {
    stopBreathingEngine();
    isBreathingActive = true;
    currentCycleNumber = 1;

    const btn = document.getElementById('btn-vagus-toggle');
    if (btn) {
      btn.innerText = "Atemführung anhalten";
      btn.className = "w-full py-3 rounded-2xl bg-rose-950/90 hover:bg-rose-900 border border-rose-700 text-rose-200 font-bold text-xs sm:text-sm touch-btn shadow-lg";
    }

    const pattern = VAGUS_BREATHING_PATTERNS[activeBreathingPatternId] || VAGUS_BREATHING_PATTERNS['4_7_8'];
    const steps = pattern.steps;
    let currentStepIndex = 0;
    let stepSecondsLeft = steps[0].duration;

    const core = document.getElementById('vagus-breath-core');
    const label = document.getElementById('vagus-breath-label');
    const secEl = document.getElementById('vagus-breath-seconds');
    const arc = document.getElementById('vagus-svg-arc');
    const desc = document.getElementById('vagus-instruction-text');
    const cycleBadge = document.getElementById('vagus-cycle-badge');
    const halo = document.getElementById('vagus-ambient-halo');

    const CIRCUMFERENCE = 439.8; // 2 * PI * 70

    if (window.SessionAudio && typeof window.SessionAudio.duck === 'function') {
      window.SessionAudio.duck(0.4);
    }

    function applyPhaseTransitions(stepObj) {
      if (!core || !label || !desc || !halo) return;

      label.innerText = stepObj.label;
      desc.innerText = stepObj.text;

      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          if (stepObj.action === 'inhale') navigator.vibrate([40, 50, 40]);
          else if (stepObj.action === 'hold' || stepObj.action === 'empty_hold') navigator.vibrate([30]);
          else if (stepObj.action === 'exhale') navigator.vibrate([70]);
        } catch (e) {}
      }

      if (stepObj.action === 'inhale') {
        core.style.transition = `transform ${stepObj.duration}s cubic-bezier(0.25, 1, 0.5, 1), border-color 1s ease`;
        core.style.transform = "scale(1.38)";
        core.style.borderColor = "#c084fc";
        halo.style.opacity = "0.7";
        halo.style.backgroundColor = "rgba(168, 85, 247, 0.25)";
        if (arc) arc.className = "text-purple-400 transition-all";
      } else if (stepObj.action === 'hold') {
        core.style.transition = `transform 1s ease, border-color 1s ease`;
        core.style.transform = "scale(1.38)";
        core.style.borderColor = "#818cf8";
        halo.style.opacity = "0.5";
        halo.style.backgroundColor = "rgba(129, 140, 248, 0.25)";
        if (arc) arc.className = "text-indigo-400 transition-all";
      } else if (stepObj.action === 'exhale') {
        core.style.transition = `transform ${stepObj.duration}s cubic-bezier(0.4, 0, 0.2, 1), border-color 1s ease`;
        core.style.transform = "scale(0.72)";
        core.style.borderColor = "#38bdf8";
        halo.style.opacity = "0.2";
        halo.style.backgroundColor = "rgba(56, 189, 248, 0.15)";
        if (arc) arc.className = "text-sky-400 transition-all";
      } else if (stepObj.action === 'empty_hold') {
        core.style.transition = `transform 1s ease, border-color 1s ease`;
        core.style.transform = "scale(0.72)";
        core.style.borderColor = "#64748b";
        halo.style.opacity = "0.1";
        if (arc) arc.className = "text-slate-500 transition-all";
      }
    }

    applyPhaseTransitions(steps[0]);

    breathingIntervalTimer = setInterval(() => {
      const modal = document.getElementById('modal-vagus-breathing');
      if (!modal || modal.style.display === 'none') {
        stopBreathingEngine();
        return;
      }

      if (secEl) secEl.innerText = stepSecondsLeft;

      const activeStep = steps[currentStepIndex];
      const stepTotalDuration = activeStep.duration;
      const progressFraction = (stepTotalDuration - stepSecondsLeft) / stepTotalDuration;

      if (arc) {
        arc.style.transition = "stroke-dashoffset 0.95s linear";
        const offset = CIRCUMFERENCE * (1 - progressFraction);
        arc.style.strokeDashoffset = offset.toFixed(1);
      }

      stepSecondsLeft--;

      if (stepSecondsLeft < 0) {
        currentStepIndex++;

        if (currentStepIndex >= steps.length) {
          currentStepIndex = 0;
          currentCycleNumber++;

          if (cycleBadge) {
            cycleBadge.innerText = `Zyklus ${Math.min(currentCycleNumber, TARGET_CYCLES_COUNT)} von ${TARGET_CYCLES_COUNT}`;
          }

          if (currentCycleNumber > TARGET_CYCLES_COUNT) {
            finishBreathingSequence();
            return;
          }
        }

        const nextStep = steps[currentStepIndex];
        stepSecondsLeft = nextStep.duration;
        applyPhaseTransitions(nextStep);

        if (arc) {
          arc.style.transition = "none";
          arc.style.strokeDashoffset = CIRCUMFERENCE.toString();
        }
      }
    }, 1000);
  }

  function finishBreathingSequence() {
    stopBreathingEngine();
    showToast("✓ 4-7-8 Vagus-Erdung abgeschlossen: Parasympathikus stabilisiert.");

    const desc = document.getElementById('vagus-instruction-text');
    const label = document.getElementById('vagus-breath-label');
    const core = document.getElementById('vagus-breath-core');
    const arc = document.getElementById('vagus-svg-arc');

    if (label) label.innerText = "Zentriert";
    if (desc) desc.innerText = "Das vegetative Nervensystem ist stabilisiert. Herzschlag und Atmung sind synchronisiert.";
    if (core) {
      core.style.transform = "scale(1.0)";
      core.style.borderColor = "#34d399";
    }
    if (arc) {
      arc.className = "text-emerald-400";
      arc.style.strokeDashoffset = "0";
    }

    const btn = document.getElementById('btn-vagus-toggle');
    if (btn) {
      btn.innerText = "Erneut durchführen";
      btn.className = "w-full py-3 rounded-2xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs sm:text-sm touch-btn shadow-md";
    }
  }

  function stopBreathingEngine() {
    if (breathingIntervalTimer) {
      clearInterval(breathingIntervalTimer);
      breathingIntervalTimer = null;
    }
    isBreathingActive = false;

    if (window.SessionAudio && typeof window.SessionAudio.unduck === 'function') {
      window.SessionAudio.unduck(1.5);
    }
  }

  function closeVagusBreathingModal() {
    stopBreathingEngine();
    const modal = document.getElementById('modal-vagus-breathing');
    if (modal) modal.style.display = 'none';
  }

  function openReverseAftercareModal() {
    if (phaseTimerInterval) clearInterval(phaseTimerInterval);

    let modal = document.getElementById('modal-reverse-aftercare');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modal-reverse-aftercare';
      modal.className = "fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto";
      document.body.appendChild(modal);
    }

    let protocols = [];
    if (window.EquipmentCatalog && typeof window.EquipmentCatalog.getDisinfectionProtocols === 'function') {
      protocols = window.EquipmentCatalog.getDisinfectionProtocols(sessionMetrics.usedEquipmentIds);
    }

    const aftercare = activeScript?.reverseAftercareInstructions || {
      subServiceForTop: "Massage von Nacken und Schultern des Tops, Bereitstellen von warmem Tee.",
      vagusRegulation: "Gewichtsdecke auflegen und 4-7-8 Atemrhythmus gegen Kältezittern einhalten.",
      equipmentDisinfection: "Ausrüstung mit Isopropanol oder pH-neutraler Seife desinfizieren und geordnet verstauen."
    };

    modal.innerHTML = `
      <div class="w-full max-w-lg bg-slate-900 border border-purple-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl text-xs text-white my-auto">
        <div class="flex items-center justify-between border-b border-purple-900/60 pb-3">
          <div>
            <span class="text-[9.5px] font-mono uppercase tracking-wider text-purple-400 font-bold block">Phase 4: Abschluss</span>
            <h3 class="text-sm sm:text-base font-bold text-white font-serif">Reverse Aftercare &amp; Rüst-Pflege</h3>
          </div>
          <button type="button" onclick="document.getElementById('modal-reverse-aftercare').style.display='none'" class="p-1.5 text-slate-400 hover:text-white">✕</button>
        </div>

        <!-- 1. DIENST AM TOP -->
        <div class="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-800/60 space-y-1.5">
          <strong class="text-purple-300 block font-bold text-xs">1. Dienst des Bottoms am Top:</strong>
          <p class="text-[10.5px] text-slate-200 leading-snug">${escapeHtml(aftercare.subServiceForTop)}</p>
        </div>

        <!-- 2. VAGUS-ERDUNG & GEWICHTSDECKE -->
        <div class="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
          <strong class="text-white block font-bold text-xs">2. Nervensystem &amp; Kälteschutz:</strong>
          <p class="text-[10.5px] text-slate-300 leading-snug">${escapeHtml(aftercare.vagusRegulation)}</p>
        </div>

        <!-- 3. TOY-DESINFEKTION -->
        <div class="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div class="flex items-center justify-between">
            <strong class="text-white block font-bold text-xs">3. Diskrete Toy-Desinfektion:</strong>
            <span class="text-[9.5px] font-mono text-purple-300 font-bold">${protocols.length} Gegenstände</span>
          </div>
          ${protocols.length === 0 ? `
            <p class="text-[10px] text-slate-500 italic">Keine Spezialreinigung erforderlich.</p>
          ` : `
            <div class="space-y-1.5 pt-1">
              ${protocols.map(p => `
                <div class="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-[10.5px]">
                  <span class="text-white font-medium">${escapeHtml(p.name)}</span>
                  <span class="text-[9.5px] font-mono text-purple-300 font-bold">${escapeHtml(p.method.replace(/_/g, ' '))}</span>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- ABSCHLUSS & 24H/48H DROP-WÄCHTER -->
        <div class="pt-2 border-t border-slate-800 flex justify-between items-center gap-2">
          <span class="text-[9.5px] font-mono text-slate-400">24h/48h Drop-Wächter wird aktiviert</span>
          <button type="button" onclick="SessionLive.finalizeAndSaveSession()" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs touch-btn shadow-md">
            Session beenden &amp; protokollieren ✓
          </button>
        </div>
      </div>
    `;

    modal.style.display = 'flex';
  }

  function finalizeAndSaveSession() {
    releaseWakeLock();
    const durationMinutes = sessionMetrics.startedAt ? Math.max(1, Math.round((Date.now() - sessionMetrics.startedAt) / 60000)) : 20;

    const sessionRecord = {
      id: `ses_${Date.now()}`,
      timestamp: Date.now(),
      title: activeScript?.sessionTitle || "Live-Session",
      tonality: activeScript?.tonality || "sovereign_warm",
      durationMinutes: durationMinutes,
      topOrgasms: sessionMetrics.topOrgasmsRecorded,
      subClimaxType: sessionMetrics.subClimaxType,
      edgesCounted: sessionMetrics.edgesCounted,
      safewordTriggered: sessionMetrics.activeSafewordTriggered,
      adaptationsCount: sessionMetrics.realtimeAdaptations.length,
      intermissionsCount: sessionMetrics.intermissionsCount,
      dropGuardArmedAt: Date.now()
    };

    try {
      let existing = [];
      const raw = localStorage.getItem(STORAGE_KEY_SESSION_LOGS) || localStorage.getItem(STORAGE_KEY_LEGACY_LOGS);
      if (raw) existing = JSON.parse(raw) || [];
      existing.push(sessionRecord);
      localStorage.setItem(STORAGE_KEY_SESSION_LOGS, JSON.stringify(existing.slice(-50)));
      localStorage.setItem(STORAGE_KEY_LEGACY_LOGS, JSON.stringify(existing.slice(-50)));

      localStorage.setItem(STORAGE_KEY_DROP_GUARD, JSON.stringify({
        armedAt: Date.now(),
        intensity: activeScript?.intensity || 6,
        targetCheck24h: Date.now() + (24 * 3600 * 1000),
        targetCheck48h: Date.now() + (48 * 3600 * 1000)
      }));
    } catch (e) {
      console.warn("[TACTUS Live] Konnte Session-Log nicht sichern:", e);
    }

    if (window.CloudSync && typeof window.CloudSync.trigger === 'function') {
      window.CloudSync.trigger();
    }

    if (window.ChatApp && typeof window.ChatApp.postSystemEvent === 'function') {
      window.ChatApp.postSystemEvent(`Session beendet: „${sessionRecord.title}“ (${sessionRecord.durationMinutes} Min, ${sessionRecord.topOrgasms} Top-Höhepunkte, Bottom: ${sessionRecord.subClimaxType.toUpperCase()}). 24h/48h Drop-Wächter scharfgestellt.`);
    }

    const modal = document.getElementById('modal-reverse-aftercare');
    if (modal) modal.style.display = 'none';

    showToast("✓ Session abgeschlossen. 24h/48h Drop-Wächter aktiv.");

    setTimeout(() => {
      const stagingEl = document.getElementById('view-session-staging');
      const liveEl = document.getElementById('view-session-live');
      if (stagingEl && liveEl) {
        liveEl.classList.add('hidden');
        stagingEl.classList.remove('hidden');
        if (window.SessionStaging && typeof window.SessionStaging.render === 'function') {
          window.SessionStaging.render();
        }
      }
    }, 400);
  }

  const api = {
    init: function() {
      loadActiveScript();
    },
    startWithScript: startWithScript,
    renderCockpit: renderLiveCockpit,
    nextPhase: nextPhase,
    prevPhase: previousPhase,
    togglePause: toggleTimerPause,
    adjustTimer: adjustTimer,
    adaptPhase: adaptCurrentPhase,
    injectMicroDiscipline: injectMicroDisciplineBranch,
    triageSub: recordSubClimaxTriage,
    safeword: triggerSafeword,
    recordTopClimax: recordTopClimaxDirectly,
    toggleDimmer: toggleScreenDimmer,
    renderVagusBreathingModal: renderVagusBreathingModal,
    selectBreathingPattern: selectBreathingPattern,
    toggleBreathingCycle: toggleBreathingCycle,
    closeVagusBreathingModal: closeVagusBreathingModal,
    startBreathingCycle: startDynamicBreathingEngine,
    openReverseAftercareModal: openReverseAftercareModal,
    finalizeAndSaveSession: finalizeAndSaveSession,
    getMetrics: function() { return Object.assign({}, sessionMetrics); }
  };

  window.SessionLive = api;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', api.init);
  } else {
    api.init();
  }

})(window);
