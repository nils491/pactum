/**
 * js/session_live.js
 * TACTUS Schlafzimmer Live-Regie, Nicht-Lineare State-Machine & Vagus-Erdung (V3.0 Haute-Horlogerie)
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien nach Master-Roadbook:
 * - 100 % UTF-8 Integrität: Echte deutsche Umlaute (ä, ö, ü, ß) im gesamten Modul
 * - Haute-Horlogerie Palette: Reines OLED-Schwarz, Graphit, Champagner-Gold, Malachit, Cognac & Bordeaux
 * - Zwei-Wege-Sessionstruktur: 4-Phasen-Drehbuch vs. Freies Spiel & Somatischer Flow (aufwärts zählende Stoppuhr)
 * - Schlafzimmer-Senior-UX: 56–72px Blind-Touch Targets, 0,2s Glanceability, Teleprompter-Befehle
 * - Audio-Regie & Musik-Energielevel Shift: Calm (55Hz Drone) <-> Driving (Tantrischer Puls), Live-Mute & Ducking
 * - Session-Resilienz: Lückenlose Pufferung in sessionStorage gegen versehentlichen Reload
 * - Ungekürzte Sub-Notizen mit klickbaren Fragebogen-Deeplinks (#view=survey&item=X) in Phase 2
 * - WakeLock (Display wachhalten) & MediaSession API für Sperrbildschirm-Regie
 * - RACK-Safeword ROT mit automatischer Kapitel-00 Notfall-Intervention (Item 904)
 * - Ad-hoc Zucht-Einschub mit kinetischer DoF-Prüfung (Klopfen statt Sprechen bei Knebelung)
 * - Animierte 4-7-8 Vagus-Atemführung mit taktiler Haptik, Kadenz-Wahl & Ducking
 * - Reverse Aftercare & materialscharfe Toy-Desinfektion aus dem Ausrüstungsschrank
 */

(function(window) {
  'use strict';

  const STORAGE_KEY_ACTIVE_SCRIPT = 'tactus_active_session_script';
  const STORAGE_KEY_LIVE_METRICS = 'tactus_live_session_metrics';
  const STORAGE_KEY_SESSION_LOGS = 'tactus_session_logs';
  const STORAGE_KEY_LEGACY_LOGS = 'kompass_session_logs';
  const STORAGE_KEY_DROP_GUARD = 'tactus_active_drop_guard';

  let activeScript = null;
  let currentPhaseIndex = 0;
  let phaseTimerInterval = null;
  let phaseSecondsRemaining = 0;
  let flowSecondsElapsed = 0;
  let isPaused = false;
  let wakeLockSentinel = null;
  let isDimmed = false;
  let isVoiceMuted = false;
  let currentAudioEnergy = 'calm'; // 'calm' | 'driving'

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
    el.className = "bg-[#090d14] text-[#f8fafc] font-mono text-xs px-4 py-2.5 rounded-2xl shadow-2xl border border-[#c5a880]/40 transition-all pointer-events-auto transform translate-y-2 opacity-0 flex items-center gap-2.5 backdrop-blur-md z-50";
    el.innerHTML = `
      <span class="w-2 h-2 rounded-full bg-[#c5a880] flex-shrink-0 animate-pulse"></span>
      <span>${escapeHtml(message)}</span>
    `;
    container.appendChild(el);

    setTimeout(() => el.classList.remove('translate-y-2', 'opacity-0'), 10);
    setTimeout(() => {
      el.classList.add('opacity-0');
      setTimeout(() => el.remove(), 300);
    }, 2800);
  }

  function triggerHaptic(pattern) {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {}
    }
  }

  function playWebAudioTick(frequency = 440, durationMs = 60) {
    if (window.SessionAudio && typeof window.SessionAudio.playPercussionClick === 'function') {
      window.SessionAudio.playPercussionClick(frequency, durationMs);
      return;
    }
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!window._tactusAudioCtx) {
        window._tactusAudioCtx = new AudioCtx();
      }
      const ctx = window._tactusAudioCtx;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (durationMs / 1000));
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + (durationMs / 1000));
    } catch (e) {}
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
      const isFlow = activeScript?.sessionMode === 'flow';
      const phase = getActivePhase();
      navigator.mediaSession.metadata = new MediaMetadata({
        title: isFlow ? (activeScript?.sessionTitle || 'Freies Spiel (Flow)') : (phase ? phase.title : 'TACTUS Live-Regie'),
        artist: 'TACTUS OS · Halbdunkel-Führung',
        album: isFlow ? 'Somatischer Flow' : `Phase ${currentPhaseIndex + 1} von ${activeScript?.phases?.length || 4}`
      });

      navigator.mediaSession.setActionHandler('play', () => {
        if (isPaused) toggleTimerPause();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        if (!isPaused) toggleTimerPause();
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        if (!isFlow) nextPhase();
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        if (!isFlow) previousPhase();
      });
    } catch (e) {
      console.debug("[TACTUS Live] MediaSession Setup ignoriert:", e);
    }
  }

  function toggleScreenDimmer() {
    isDimmed = !isDimmed;
    let overlay = document.getElementById('nightstand-dimmer-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'nightstand-dimmer-overlay';
      overlay.className = 'fixed inset-0 bg-black/85 z-50 pointer-events-none transition-opacity duration-500 opacity-0';
      document.body.appendChild(overlay);
    }
    overlay.style.opacity = isDimmed ? '1' : '0';
    showToast(isDimmed ? "Nachttisch-Dimmer aktiv (OLED-Halbdunkel)" : "Dimmer deaktiviert");
  }

  function toggleLiveVoiceMute() {
    isVoiceMuted = !isVoiceMuted;
    const btn = document.getElementById('btn-live-voice-mute');
    if (btn) {
      btn.innerText = isVoiceMuted ? 'Stumm' : 'Sprache an';
      btn.className = isVoiceMuted 
        ? 'px-2.5 py-1.5 rounded-xl bg-[#000000] border border-[#8a5232] text-[#b3734a] font-mono text-[10px] font-bold touch-pad'
        : 'px-2.5 py-1.5 rounded-xl bg-[#090d14] border border-[#c5a880]/60 text-[#c5a880] font-mono text-[10px] font-bold touch-pad';
    }
    if (window.SessionVoice && typeof window.SessionVoice.setMuted === 'function') {
      window.SessionVoice.setMuted(isVoiceMuted);
    }
    showToast(isVoiceMuted ? "Sprachbegleitung stummgeschaltet" : "Sprachbegleitung aktiv");
  }

  function setAudioEnergyLevel(level) {
    currentAudioEnergy = level;
    const badge = document.getElementById('live-audio-energy-badge');
    const btnCalm = document.getElementById('btn-live-audio-calm');
    const btnDriving = document.getElementById('btn-live-audio-driving');

    if (level === 'calm') {
      if (badge) {
        badge.innerText = 'CALM (55Hz)';
        badge.className = 'px-1.5 py-0.5 rounded text-[9px] bg-[#090d14] border border-[#c5a880]/40 text-[#c5a880] font-semibold';
      }
      if (btnCalm) btnCalm.className = 'px-2.5 py-1 rounded-xl text-[10px] font-mono font-medium bg-[#c5a880] text-black font-bold transition';
      if (btnDriving) btnDriving.className = 'px-2.5 py-1 rounded-xl text-[10px] font-mono font-medium bg-[#090d14] border border-[#1e2638] text-[#94a3b8] hover:text-[#f8fafc] transition';
    } else {
      if (badge) {
        badge.innerText = 'DRIVING (Puls)';
        badge.className = 'px-1.5 py-0.5 rounded text-[9px] bg-[#450a0a] border border-[#991b1b] text-[#f8fafc] font-bold';
      }
      if (btnDriving) btnDriving.className = 'px-2.5 py-1 rounded-xl text-[10px] font-mono font-medium bg-[#991b1b] text-white font-bold transition';
      if (btnCalm) btnCalm.className = 'px-2.5 py-1 rounded-xl text-[10px] font-mono font-medium bg-[#090d14] border border-[#1e2638] text-[#94a3b8] hover:text-[#f8fafc] transition';
    }

    if (window.SessionAudio && typeof window.SessionAudio.setEnergyLevel === 'function') {
      window.SessionAudio.setEnergyLevel(level);
    } else if (window.SessionAudio && typeof window.SessionAudio.playDrone === 'function') {
      window.SessionAudio.playDrone(level === 'calm' ? 'dark_drone' : 'tantric_pulse');
    }
    showToast(`Musik-Energielevel moduliert: ${level.toUpperCase()}`);
    triggerHaptic([30]);
  }

  function loadActiveScript() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY_ACTIVE_SCRIPT);
      if (raw) {
        activeScript = JSON.parse(raw);
      }
      const rawMetrics = sessionStorage.getItem(STORAGE_KEY_LIVE_METRICS);
      if (rawMetrics) {
        const parsed = JSON.parse(rawMetrics);
        if (parsed && typeof parsed === 'object') {
          sessionMetrics = Object.assign({}, sessionMetrics, parsed);
          if (parsed.currentPhaseIndex !== undefined) {
            currentPhaseIndex = parsed.currentPhaseIndex;
          }
          if (parsed.flowSecondsElapsed !== undefined) {
            flowSecondsElapsed = parsed.flowSecondsElapsed;
          }
        }
      }
    } catch (e) {
      console.warn("[TACTUS Live] Fehler beim Laden des Skripts:", e);
    }

    if (!activeScript || (!Array.isArray(activeScript.phases) && activeScript.sessionMode !== 'flow')) {
      activeScript = {
        sessionTitle: "Souveräne Führung & Erdung",
        sessionMode: "scripted",
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
            instruction: "Bottom reicht Wasser/Tee, deckt den Top zu, massiert ermüdete Muskeln und desinfiziert genutzte Ausrüstung.",
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

  function persistLiveMetrics() {
    try {
      const payload = Object.assign({}, sessionMetrics, { 
        currentPhaseIndex, 
        flowSecondsElapsed 
      });
      sessionStorage.setItem(STORAGE_KEY_LIVE_METRICS, JSON.stringify(payload));
    } catch (e) {}
  }

  function getActivePhase() {
    if (!activeScript || !Array.isArray(activeScript.phases)) return null;
    return activeScript.phases[currentPhaseIndex] || null;
  }

  function startWithScript(scriptObject) {
    if (scriptObject) {
      activeScript = scriptObject;
      try {
        sessionStorage.setItem(STORAGE_KEY_ACTIVE_SCRIPT, JSON.stringify(scriptObject));
      } catch (e) {}
    } else {
      loadActiveScript();
    }

    currentPhaseIndex = 0;
    flowSecondsElapsed = 0;
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

    persistLiveMetrics();
    requestWakeLock();
    renderLiveCockpit();
    startTimerEngine();
    setupMediaSession();
  }

  function startTimerEngine() {
    if (phaseTimerInterval) clearInterval(phaseTimerInterval);
    const isFlow = activeScript?.sessionMode === 'flow';

    if (isFlow) {
      isPaused = false;
      updateTimerDisplay();
      phaseTimerInterval = setInterval(() => {
        if (!isPaused) {
          flowSecondsElapsed++;
          updateTimerDisplay();
          if (flowSecondsElapsed % 5 === 0) persistLiveMetrics();
        }
      }, 1000);
    } else {
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

      if (phase && phase.topDialogueQuote && !isVoiceMuted && window.SessionVoice && typeof window.SessionVoice.speak === 'function') {
        const tonality = activeScript?.tonality || 'sovereign_warm';
        window.SessionVoice.speak(phase.topDialogueQuote, { tonality: tonality, phase: currentPhaseIndex + 1 });
      }
    }
  }

  function updateTimerDisplay() {
    const timerEl = document.getElementById('live-phase-timer-text');
    if (!timerEl) return;
    const isFlow = activeScript?.sessionMode === 'flow';

    if (isFlow) {
      const m = Math.floor(flowSecondsElapsed / 60);
      const s = flowSecondsElapsed % 60;
      timerEl.innerText = `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
    } else {
      const m = Math.floor(phaseSecondsRemaining / 60);
      const s = phaseSecondsRemaining % 60;
      timerEl.innerText = `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
    }
  }

  function toggleTimerPause() {
    isPaused = !isPaused;
    const btn = document.getElementById('btn-live-toggle-pause');
    if (btn) {
      btn.innerText = isPaused ? "FORTSETZEN" : "PAUSIEREN";
      btn.className = isPaused 
        ? "px-3 py-1.5 rounded-xl bg-[#c5a880] text-black font-bold font-mono text-[11px] touch-pad" 
        : "px-3 py-1.5 rounded-xl bg-[#090d14] border border-[#1e2638] text-[#94a3b8] hover:text-[#f8fafc] font-bold font-mono text-[11px] touch-pad";
    }
    showToast(isPaused ? "Timer pausiert" : "Timer läuft weiter");
    triggerHaptic([30]);
    playWebAudioTick(isPaused ? 330 : 660, 40);
  }

  function adjustTimer(deltaMinutes) {
    if (activeScript?.sessionMode === 'flow') {
      flowSecondsElapsed = Math.max(0, flowSecondsElapsed + (deltaMinutes * 60));
    } else {
      phaseSecondsRemaining = Math.max(0, phaseSecondsRemaining + (deltaMinutes * 60));
    }
    updateTimerDisplay();
    showToast(`${deltaMinutes > 0 ? '+' : ''}${deltaMinutes} Min. angepasst`);
    triggerHaptic([30]);
    playWebAudioTick(550, 40);
  }

  function adaptCurrentPhase(triggerType) {
    const isFlow = activeScript?.sessionMode === 'flow';
    const phase = getActivePhase();
    if (!phase && !isFlow) return;

    const tonality = activeScript?.tonality || 'sovereign_warm';

    const adaptationEvent = {
      timestamp: Date.now(),
      phaseIndex: isFlow ? 1 : currentPhaseIndex + 1,
      trigger: triggerType,
      tonality: tonality
    };
    sessionMetrics.realtimeAdaptations.push(adaptationEvent);
    persistLiveMetrics();

    let newInstruction = phase ? phase.instruction : "";
    let newQuote = phase ? phase.topDialogueQuote : "";

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
        newInstruction = `DROSSELUNG: Intensität um 50 % reduzieren. Langsame, kühle Streichungen. Keine lauten Reize.`;
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

    if (phase) {
      phase.instruction = newInstruction;
      phase.topDialogueQuote = newQuote;
    }

    if (!isVoiceMuted && window.SessionVoice && typeof window.SessionVoice.speak === 'function') {
      window.SessionVoice.speak(newQuote, { tonality: tonality, phase: isFlow ? 1 : currentPhaseIndex + 1 });
    }

    renderLiveCockpit();
    showToast(`Dynamisch adaptiert (${triggerType.replace(/_/g, ' ')}) ✓`);
    triggerHaptic([80, 40, 80]);
    playWebAudioTick(triggerType === 'edge_too_fast' ? 880 : 440, 90);
  }

  async function injectMicroDisciplineBranch() {
    const phase = getActivePhase();
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
    persistLiveMetrics();

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

    const quote = `„Position einnehmen. 10 Schläge zur Besinnung. Keine Bewegung im Raum.“`;

    if (phase) {
      phase.instruction = `AD-HOC ZUCHT-EINSCHUB: 10 Schläge mit der flachen Hand oder dem Ledergürtel. Haltung: ${synthesizedPosture} ${countDirective}`;
      phase.topDialogueQuote = quote;
    }

    if (!isVoiceMuted && window.SessionVoice && typeof window.SessionVoice.speak === 'function') {
      const tonality = activeScript?.tonality || 'sovereign_warm';
      window.SessionVoice.speak(quote, { tonality: tonality, phase: currentPhaseIndex + 1 });
    }

    renderLiveCockpit();
    showToast("Ad-Hoc Zuchtmaßnahme dynamisch eingesteuert ✓");
    triggerHaptic([60, 40, 100]);
    playWebAudioTick(660, 100);
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
    persistLiveMetrics();

    if (color === 'red') {
      if (phaseTimerInterval) clearInterval(phaseTimerInterval);
      isPaused = true;
      releaseWakeLock();

      const emergency = getSubEmergencyIntervention();
      const container = document.getElementById('live-session-container');
      if (container) {
        container.innerHTML = `
          <div class="max-w-xl mx-auto p-5 sm:p-6 rounded-3xl bg-[#090d14] border-2 border-[#991b1b] space-y-4 text-xs text-[#f8fafc] shadow-2xl animate-fade-in">
            <div class="flex items-center gap-3 border-b border-[#991b1b]/60 pb-3">
              <div class="w-10 h-10 rounded-2xl bg-[#450a0a] border border-[#991b1b] flex items-center justify-center font-black text-lg text-white">
                ✕
              </div>
              <div>
                <h2 class="text-base font-bold text-white uppercase tracking-wider font-serif">Safeword ROT aktiviert</h2>
                <span class="text-[#94a3b8] text-[10.5px]">Sofortiger Handlungsstillstand &amp; RACK-Deeskalation</span>
              </div>
            </div>

            <!-- KAPITEL 00 INTERVENTION DES SUBS -->
            <div class="p-4 rounded-2xl bg-[#000000] border border-[#2e5746] space-y-2">
              <span class="text-[9.5px] font-mono uppercase tracking-wider text-[#2e5746] font-bold block">
                Gewünschte Notfall-Intervention des Subs (Kapitel 00 · § 8 Vertrag):
              </span>
              <strong class="text-xs text-white block font-bold">${escapeHtml(emergency.desired.title)}</strong>
              <p class="text-[11px] text-[#f8fafc] leading-snug font-medium">${escapeHtml(emergency.desired.action)}</p>
            </div>

            ${emergency.customTriggers ? `
              <div class="p-3 rounded-2xl bg-[#000000] border border-[#8a5232]/50 text-[10.5px] text-[#f8fafc] space-y-1">
                <span class="font-mono text-[#b3734a] font-bold text-[9px] block">Hinterlegte Traumagrenzen &amp; Trigger:</span>
                <p class="italic">„${escapeHtml(emergency.customTriggers)}“</p>
              </div>
            ` : ''}

            <div class="p-3.5 rounded-2xl bg-[#000000] border border-[#1e2638] space-y-1.5 leading-relaxed text-[10.5px]">
              <strong class="text-[#c5a880] block font-bold">Verbindliche RACK-Sicherheitsregeln:</strong>
              <p>1. Alle aktiven Handlungen sofort einstellen. Hände und Reize vom Körper nehmen.</p>
              <p>2. Enge Fesselungen oder Knebel vorsichtig und ohne Hektik lösen.</p>
              <p>3. Keine Vorwürfe, keine Debatte. Erst den Puls stabilisieren.</p>
            </div>

            <div class="pt-2 flex justify-between gap-2">
              <button type="button" onclick="SessionLive.renderVagusBreathingModal()" class="px-4 py-2.5 rounded-xl bg-[#142b24] border border-[#2e5746] hover:bg-[#2e5746] text-white font-bold text-xs touch-pad shadow-md">
                4-7-8 Vagus-Erdung öffnen
              </button>
              <button type="button" onclick="SessionLive.openReverseAftercareModal()" class="px-4 py-2.5 rounded-xl bg-[#000000] hover:bg-[#090d14] border border-[#1e2638] text-[#94a3b8] font-bold text-xs touch-pad">
                Direkt zur Nachsorge
              </button>
            </div>
          </div>
        `;
      }
      showToast("Safeword ROT: Sofortiger Handlungsstillstand.");
      triggerHaptic([150, 100, 150, 100, 300]);
      playWebAudioTick(880, 200);
    } else if (color === 'yellow') {
      adaptCurrentPhase('overstimulated');
      showToast("Safeword GELB: Intensität wird gedrosselt.");
      triggerHaptic([60, 40, 60]);
    } else {
      showToast("Safeword GRÜN: Zustand stabil.");
      triggerHaptic([30]);
    }
  }

  function nextPhase() {
    if (!activeScript || !activeScript.phases) return;
    if (currentPhaseIndex < activeScript.phases.length - 1) {
      currentPhaseIndex++;
      persistLiveMetrics();
      renderLiveCockpit();
      startTimerEngine();
      setupMediaSession();
      showToast(`Phase ${currentPhaseIndex + 1} gestartet`);
      triggerHaptic([50]);
      playWebAudioTick(660, 50);
    } else {
      openReverseAftercareModal();
    }
  }

  function previousPhase() {
    if (currentPhaseIndex > 0) {
      currentPhaseIndex--;
      persistLiveMetrics();
      renderLiveCockpit();
      startTimerEngine();
      setupMediaSession();
      showToast(`Zurück zu Phase ${currentPhaseIndex + 1}`);
      triggerHaptic([40]);
      playWebAudioTick(440, 40);
    }
  }

  function recordTopClimaxDirectly() {
    sessionMetrics.topOrgasmsRecorded++;
    persistLiveMetrics();
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
    triggerHaptic([60, 40, 100]);
    playWebAudioTick(770, 80);
  }

  function recordSubClimaxTriage(typeKey) {
    sessionMetrics.subClimaxType = typeKey;
    sessionMetrics.subClimaxRecorded = true;
    persistLiveMetrics();

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
    triggerHaptic([50]);
  }

  function renderLiveCockpit() {
    const container = document.getElementById('live-session-container');
    if (!container) return;

    loadActiveScript();
    const isFlow = activeScript?.sessionMode === 'flow';
    const phases = activeScript?.phases || [];
    const currentPhase = isFlow ? null : (phases[currentPhaseIndex] || phases[0]);
    const totalPhases = phases.length;

    let subNote = '';
    let motifItemId = null;
    if (window.SessionStaging && typeof window.SessionStaging.getConfig === 'function') {
      const cfg = window.SessionStaging.getConfig();
      if (cfg && cfg.motifId) {
        motifItemId = cfg.motifId.replace('motif_', '');
      }
    }
    try {
      const rawAns = localStorage.getItem('kompass_answers');
      if (rawAns && motifItemId) {
        const answers = JSON.parse(rawAns);
        const cagedRole = localStorage.getItem('kompass_caged_role') || 'B';
        const subAns = answers[cagedRole] || {};
        subNote = (subAns[`note_${motifItemId}`] || '').trim();
      }
    } catch (e) {}

    container.innerHTML = `
      <div class="space-y-4 max-w-2xl mx-auto text-xs animate-fade-in font-sans">
        
        <!-- HEADER DER LIVE-SESSION (HAUTE HORLOGERIE & STATUS) -->
        <div class="p-4 sm:p-5 rounded-3xl bg-[#090d14] border border-[#1e2638] space-y-3 shadow-2xl">
          <div class="flex items-center justify-between border-b border-[#1e2638]/60 pb-3 gap-2">
            <div class="space-y-0.5 min-w-0 flex-1 pr-2">
              <span class="text-[9.5px] font-mono uppercase tracking-wider text-[#c5a880] font-bold block truncate">
                ${isFlow ? 'Freies Spiel &amp; Somatischer Flow' : 'Schlafzimmer-Regie · Top-First'}
              </span>
              <h2 class="text-base sm:text-lg font-serif text-[#f8fafc] font-normal truncate">
                ${escapeHtml(activeScript.sessionTitle || 'TACTUS Live-Regie')}
              </h2>
            </div>
            
            <!-- QUICK CONTROLS: DIMMER, VOICE MUTE, VAGUS -->
            <div class="flex items-center gap-1.5 flex-shrink-0">
              <button type="button" id="btn-live-voice-mute" onclick="SessionLive.toggleVoiceMute()" title="Sprachbegleitung stummschalten" class="px-2.5 py-1.5 rounded-xl ${isVoiceMuted ? 'bg-[#000000] border border-[#8a5232] text-[#b3734a]' : 'bg-[#090d14] border border-[#c5a880]/60 text-[#c5a880]'} font-mono text-[10px] font-bold touch-pad">
                ${isVoiceMuted ? 'Stumm' : 'Sprache an'}
              </button>
              <button type="button" onclick="SessionLive.toggleDimmer()" title="Nachttisch-Dimmer (85% OLED)" class="w-8 h-8 rounded-xl bg-[#000000] border border-[#1e2638] text-[#94a3b8] hover:text-[#c5a880] flex items-center justify-center touch-pad">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/></svg>
              </button>
              <button type="button" onclick="SessionLive.renderVagusBreathingModal()" title="4-7-8 Vagus-Atmung" class="px-2.5 py-1.5 rounded-xl bg-[#142b24] border border-[#2e5746] text-[#2e5746] hover:text-[#f8fafc] font-mono text-[10px] font-bold touch-pad">
                4-7-8
              </button>
            </div>
          </div>

          <!-- AUDIO-REGIE & MUSIK-ENERGIELEVEL SHIFT -->
          <div class="p-3 rounded-2xl bg-[#000000] border border-[#1e2638] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
            <div class="flex items-center gap-2">
              <span class="text-[#94a3b8] flex items-center gap-1">
                <svg class="w-3.5 h-3.5 text-[#c5a880]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z"/></svg>
                <span>Soundscape:</span>
              </span>
              <span id="live-audio-energy-badge" class="px-1.5 py-0.5 rounded text-[9px] bg-[#090d14] border border-[#c5a880]/40 text-[#c5a880] font-semibold">
                ${currentAudioEnergy === 'calm' ? 'CALM (55Hz)' : 'DRIVING (Puls)'}
              </span>
            </div>

            <div class="flex items-center gap-1.5">
              <button type="button" id="btn-live-audio-calm" onclick="SessionLive.setAudioEnergy('calm')" class="px-2.5 py-1 rounded-xl text-[10px] font-mono font-medium ${currentAudioEnergy === 'calm' ? 'bg-[#c5a880] text-black font-bold' : 'bg-[#090d14] border border-[#1e2638] text-[#94a3b8] hover:text-[#f8fafc]'} transition touch-pad">
                Calm
              </button>
              <button type="button" id="btn-live-audio-driving" onclick="SessionLive.setAudioEnergy('driving')" class="px-2.5 py-1 rounded-xl text-[10px] font-mono font-medium ${currentAudioEnergy === 'driving' ? 'bg-[#991b1b] text-white font-bold' : 'bg-[#090d14] border border-[#1e2638] text-[#94a3b8] hover:text-[#f8fafc]'} transition touch-pad">
                Driving
              </button>
              ${activeScript.spotifyPlaylistUrl ? `
                <a href="${escapeHtml(activeScript.spotifyPlaylistUrl)}" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1 rounded-xl bg-[#000000] border border-[#2e5746] text-[#2e5746] hover:text-white font-mono text-[10px] flex items-center gap-1 touch-pad">
                  <span>Spotify ↗</span>
                </a>
              ` : ''}
            </div>
          </div>

          <!-- PHASEN-FORTSCHRITT & TELEMETRIE COUNTER -->
          <div class="flex items-center justify-between text-[10px] font-mono text-[#94a3b8] pt-1">
            <span>${isFlow ? 'Freier somatischer Flow (Stoppuhr)' : `Phase ${currentPhaseIndex + 1} von ${totalPhases}`}</span>
            <div class="flex items-center gap-1.5 font-bold">
              <span id="live-top-climax-counter" class="text-[#c5a880]">${sessionMetrics.topOrgasmsRecorded} Top</span>
              <span>·</span>
              <span id="live-sub-edge-counter" class="text-[#b3734a]">${sessionMetrics.edgesCounted} Kanten</span>
              <span>·</span>
              <span class="text-[#f8fafc]">${sessionMetrics.subClimaxRecorded ? sessionMetrics.subClimaxType.toUpperCase() : 'DENIAL'}</span>
            </div>
          </div>
        </div>

        <!-- HAUPT-BÜHNE: TIMER & TELEPROMPTER DIRECTIVE -->
        <div class="p-5 sm:p-6 rounded-3xl bg-[#090d14] border border-[#1e2638] space-y-4 shadow-xl">
          
          <div class="flex items-center justify-between border-b border-[#1e2638]/60 pb-2">
            <strong class="text-sm font-serif text-[#f8fafc] block tracking-wide">
              ${isFlow ? 'Freies Spiel: Führen nach Körpergefühl' : escapeHtml(currentPhase?.title || 'Phase')}
            </strong>
            <span class="px-2 py-0.5 rounded text-[9.5px] font-mono bg-[#000000] text-[#c5a880] border border-[#c5a880]/30 font-bold">
              ${isFlow ? 'Stoppuhr aktiv' : `Zone: ${escapeHtml(currentPhase?.somaticZone || 'Körper')}`}
            </span>
          </div>

          <!-- GROSSZÜGIGE TIMER ANZEIGE (0,2s GLANCEABILITY AUS 2M DISTANZ) -->
          <div class="text-center py-2 bg-[#000000] rounded-2xl border border-[#1e2638]/60">
            <span id="live-phase-timer-text" class="text-5xl sm:text-6xl font-mono font-bold text-[#f8fafc] tracking-tight block">
              ${isFlow ? '00:00' : '10:00'}
            </span>
            <span class="text-[9.5px] font-mono uppercase tracking-widest text-[#c5a880] block mt-1">
              ${isFlow ? 'Verstrichene Zeit' : 'Restzeit der Phase'}
            </span>
          </div>

          <!-- HANDLUNGSANWEISUNG -->
          <div class="text-xs sm:text-sm text-[#f8fafc] leading-relaxed bg-[#000000]/60 p-4 rounded-2xl border border-[#1e2638]/60">
            ${isFlow ? `Offener somatischer Flow ohne starres Phasen-Korsett. Führe nach Intuition und Körperfeedback des Partners. Zucht, Schwellen und Vagus-Atmung können jederzeit ad hoc eingesteuert werden.` : escapeHtml(currentPhase?.instruction || '')}
          </div>

          <!-- SUB-NOTIZ AUS DEM FRAGEBOGEN MIT KLICKBAREM DEEPLINK -->
          ${subNote ? `
            <div class="p-3 rounded-2xl bg-[#4a2818]/25 border border-[#8a5232]/50 text-[11px] text-[#f8fafc] space-y-1">
              <div class="flex items-center justify-between font-mono text-[9.5px]">
                <span class="text-[#b3734a] font-bold">[Sub-Notiz zu diesem Motiv]:</span>
                ${motifItemId ? `<a href="index.html#view=survey&item=${escapeHtml(motifItemId)}" target="_blank" class="text-[#c5a880] hover:underline font-mono text-[9px]">Fragebogen Item #${escapeHtml(motifItemId)} ↗</a>` : ''}
              </div>
              <p class="italic text-slate-200">„${escapeHtml(subNote)}“</p>
            </div>
          ` : ''}

          <!-- TELEPROMPTER: WÖRTLICHER BEFEHL DES TOPS (2M GLANCEABILITY) -->
          ${(currentPhase?.topDialogueQuote || isFlow) ? `
            <div class="p-4 rounded-2xl bg-[#000000] border border-[#c5a880]/30 space-y-1">
              <span class="text-[9px] font-mono uppercase tracking-widest text-[#c5a880] font-bold block">Wörtliche Führung (Teleprompter):</span>
              <blockquote class="font-serif text-lg sm:text-xl text-[#f8fafc] italic leading-snug pt-0.5">
                ${isFlow ? `„Heute gibt es keinen Plan außer meiner Führung. Lass dich ganz fallen.“` : escapeHtml(currentPhase.topDialogueQuote)}
              </blockquote>
            </div>
          ` : ''}

          <!-- TIMER STEUERUNG -->
          <div class="flex items-center justify-between pt-2 border-t border-[#1e2638]/60 text-xs">
            <button type="button" id="btn-live-toggle-pause" onclick="SessionLive.togglePause()" class="px-3.5 py-1.5 rounded-xl bg-[#000000] border border-[#1e2638] text-[#94a3b8] hover:text-[#f8fafc] font-bold font-mono text-[11px] touch-pad">
              PAUSIEREN
            </button>
            
            <div class="flex items-center gap-1 font-mono text-[10px]">
              <button type="button" onclick="SessionLive.adjustTimer(-1)" class="w-8 h-8 rounded-xl bg-[#000000] border border-[#1e2638] text-[#94a3b8] hover:text-[#f8fafc] font-bold flex items-center justify-center touch-pad">-1m</button>
              <button type="button" onclick="SessionLive.adjustTimer(2)" class="w-8 h-8 rounded-xl bg-[#000000] border border-[#1e2638] text-[#94a3b8] hover:text-[#f8fafc] font-bold flex items-center justify-center touch-pad">+2m</button>
            </div>
          </div>
        </div>

        <!-- BLIND-TOUCH AKTIONEN: KALTSTOPP, DÄMPFEN & STEIGERN (MINDESTENS 56–72px HOCH) -->
        <div class="p-4 rounded-3xl bg-[#090d14] border border-[#1e2638] space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-[9.5px] font-mono uppercase tracking-wider text-[#94a3b8] font-bold block">Live-Adaption (Blind-Touch):</span>
            <button type="button" onclick="SessionLive.injectMicroDiscipline()" class="px-2.5 py-1 rounded-xl bg-[#4a2818]/40 border border-[#8a5232] text-[#b3734a] font-mono text-[9px] font-bold touch-pad">
              + Zucht-Einschub
            </button>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <!-- KALTSTOPP PAD (72px Trefferhöhe) -->
            <button type="button" onclick="SessionLive.adaptPhase('edge_too_fast')" class="min-h-[64px] sm:min-h-[72px] p-3 rounded-2xl bg-[#991b1b] hover:bg-red-700 text-white font-mono font-bold text-xs flex flex-col justify-center items-start border border-[#991b1b]/80 shadow-lg touch-pad red-glow">
              <span class="text-sm font-bold tracking-wide">KALTSTOPP</span>
              <span class="text-[9px] text-white/80 font-normal mt-0.5">Schwelle erreicht · Halt!</span>
            </button>

            <!-- DÄMPFEN PAD -->
            <button type="button" onclick="SessionLive.adaptPhase('overstimulated')" class="min-h-[64px] sm:min-h-[72px] p-3 rounded-2xl bg-[#000000] hover:bg-[#090d14] border border-[#1e2638] text-[#94a3b8] hover:text-[#f8fafc] font-mono font-bold text-xs flex flex-col justify-center items-start touch-pad">
              <span class="text-sm font-bold text-[#f8fafc]">DÄMPFEN</span>
              <span class="text-[9px] text-[#94a3b8] font-normal mt-0.5">Nervensystem schonen</span>
            </button>

            <!-- STEIGERN PAD -->
            <button type="button" onclick="SessionLive.adaptPhase('intensify')" class="min-h-[64px] sm:min-h-[72px] p-3 rounded-2xl bg-[#090d14] hover:bg-[#101622] border border-[#c5a880]/60 text-[#c5a880] font-mono font-bold text-xs flex flex-col justify-center items-start touch-pad">
              <span class="text-sm font-bold text-[#c5a880]">STEIGERN</span>
              <span class="text-[9px] text-[#c5a880]/80 font-normal mt-0.5">Härte &amp; Rhythmus fordern</span>
            </button>
          </div>
        </div>

        <!-- TOP-LUST BUCHUNG & SUB-CLIMAX TRIAGE -->
        <div class="p-4 rounded-3xl bg-[#090d14] border border-[#1e2638] space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-mono text-[#c5a880] font-bold">Lust des Tops:</span>
            <button type="button" onclick="SessionLive.recordTopClimax()" class="px-3.5 py-2 rounded-xl bg-[#c5a880] hover:bg-[#dfcaa9] text-black font-bold text-xs font-mono touch-pad shadow-md flex items-center gap-1.5">
              <span>Top-Höhepunkt buchen (+1)</span>
            </button>
          </div>

          <!-- SUB-CLIMAX TRIAGE BUTTONS IN DER KATHARSIS ODER IM FLOW -->
          ${(currentPhaseIndex >= 2 || isFlow) ? `
            <div class="pt-2 border-t border-[#1e2638]/60 space-y-1.5">
              <span class="text-[9.5px] font-mono text-[#94a3b8] font-bold block">Ausgang Bottom (Triage):</span>
              <div class="grid grid-cols-4 gap-1.5 text-[10px] font-mono">
                <button type="button" onclick="SessionLive.triageSub('denial')" class="p-2 rounded-xl border text-center transition-all touch-pad ${sessionMetrics.subClimaxType === 'denial' ? 'bg-[#000000] border-[#c5a880] text-[#c5a880] font-bold' : 'bg-[#000000] border-[#1e2638] text-[#94a3b8]'}">
                  Denial
                </button>
                <button type="button" onclick="SessionLive.triageSub('ruined')" class="p-2 rounded-xl border text-center transition-all touch-pad ${sessionMetrics.subClimaxType === 'ruined' ? 'bg-[#450a0a] border-[#991b1b] text-white font-bold' : 'bg-[#000000] border-[#1e2638] text-[#94a3b8]'}">
                  Ruined
                </button>
                <button type="button" onclick="SessionLive.triageSub('prostate')" class="p-2 rounded-xl border text-center transition-all touch-pad ${sessionMetrics.subClimaxType === 'prostate' ? 'bg-[#101622] border-[#c5a880] text-[#c5a880] font-bold' : 'bg-[#000000] border-[#1e2638] text-[#94a3b8]'}">
                  Prostata
                </button>
                <button type="button" onclick="SessionLive.triageSub('full')" class="p-2 rounded-xl border text-center transition-all touch-pad ${sessionMetrics.subClimaxType === 'full' ? 'bg-[#142b24] border-[#2e5746] text-[#2e5746] font-bold' : 'bg-[#000000] border-[#1e2638] text-[#94a3b8]'}">
                  Freigabe
                </button>
              </div>
            </div>
          ` : ''}

          <!-- NAVIGATION ZWISCHEN PHASEN BZW. ABSCHLUSS -->
          <div class="flex items-center justify-between pt-2 border-t border-[#1e2638]/60">
            ${isFlow ? `
              <span class="text-[10px] font-mono text-[#94a3b8]">Freies Spiel aktiv</span>
              <button type="button" onclick="SessionLive.openReverseAftercareModal()" class="px-4 py-2 rounded-xl bg-[#c5a880] text-black font-bold text-xs font-mono touch-pad shadow-md">
                Session abschließen &amp; Aftercare →
              </button>
            ` : `
              <button type="button" onclick="SessionLive.prevPhase()" ${currentPhaseIndex === 0 ? 'disabled' : ''} class="px-3.5 py-2 rounded-xl bg-[#000000] border border-[#1e2638] text-[#94a3b8] hover:text-[#f8fafc] font-bold text-xs font-mono touch-pad disabled:opacity-30">
                ← Zurück
              </button>
              <button type="button" onclick="SessionLive.nextPhase()" class="px-4 py-2 rounded-xl bg-[#c5a880] text-black font-bold text-xs font-mono touch-pad shadow-md">
                ${currentPhaseIndex === totalPhases - 1 ? 'Zur Nachsorge (Aftercare) →' : 'Nächste Phase →'}
              </button>
            `}
          </div>
        </div>

        <!-- SAFEWORD-AMPEL MIT MALACHIT & BORDEAUX -->
        <div class="p-3 rounded-2xl bg-[#000000] border border-[#1e2638] flex items-center justify-between text-xs">
          <span class="text-[10px] font-mono text-[#94a3b8] uppercase font-bold">Safeword-Ampel:</span>
          <div class="flex items-center gap-1.5 font-mono">
            <button type="button" onclick="SessionLive.safeword('green')" class="px-3 py-1.5 rounded-xl bg-[#142b24] border border-[#2e5746] text-[#2e5746] font-bold text-[10px] touch-pad">Grün</button>
            <button type="button" onclick="SessionLive.safeword('yellow')" class="px-3 py-1.5 rounded-xl bg-[#4a2818] border border-[#8a5232] text-[#b3734a] font-bold text-[10px] touch-pad">Gelb</button>
            <button type="button" onclick="SessionLive.safeword('red')" class="px-3.5 py-1.5 rounded-xl bg-[#991b1b] border border-red-700 text-white font-black text-[10px] touch-pad red-glow">ROT (Stopp)</button>
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
      <div class="w-full max-w-sm bg-[#090d14] border border-[#2e5746] rounded-3xl p-5 sm:p-6 text-center space-y-4 shadow-2xl text-xs text-[#f8fafc] relative overflow-hidden backdrop-blur-md">
        <!-- AMBIENT GLOW EFFECT -->
        <div id="vagus-ambient-halo" class="absolute -inset-10 bg-[#142b24]/20 rounded-full blur-3xl pointer-events-none transition-all duration-1000 opacity-40"></div>

        <!-- HEADER -->
        <div class="flex items-center justify-between border-b border-[#1e2638] pb-2 relative z-10">
          <div class="text-left space-y-0.5">
            <span class="text-[9px] font-mono uppercase tracking-wider text-[#2e5746] font-bold block">Somatische Neuro-Regulation</span>
            <h3 class="text-sm sm:text-base font-serif text-[#f8fafc]" id="vagus-pattern-title">${escapeHtml(currentPattern.name)}</h3>
          </div>
          <button type="button" onclick="SessionLive.closeVagusBreathingModal()" class="w-8 h-8 rounded-xl bg-[#000000] hover:bg-[#101622] text-[#94a3b8] hover:text-white flex items-center justify-center touch-pad">✕</button>
        </div>

        <!-- KADENZ-AUSWAHL -->
        <div class="grid grid-cols-3 gap-1.5 relative z-10 text-[10px] font-mono">
          <button type="button" onclick="SessionLive.selectBreathingPattern('4_7_8')" class="p-2 rounded-xl border font-bold transition-all touch-pad ${activeBreathingPatternId === '4_7_8' ? 'bg-[#142b24] border-[#2e5746] text-[#f8fafc] shadow-sm' : 'bg-[#000000] border-[#1e2638] text-[#94a3b8]'}">
            4-7-8 Vagus
          </button>
          <button type="button" onclick="SessionLive.selectBreathingPattern('box_4')" class="p-2 rounded-xl border font-bold transition-all touch-pad ${activeBreathingPatternId === 'box_4' ? 'bg-[#142b24] border-[#2e5746] text-[#f8fafc] shadow-sm' : 'bg-[#000000] border-[#1e2638] text-[#94a3b8]'}">
            4-4-4-4 Box
          </button>
          <button type="button" onclick="SessionLive.selectBreathingPattern('coherence_5')" class="p-2 rounded-xl border font-bold transition-all touch-pad ${activeBreathingPatternId === 'coherence_5' ? 'bg-[#142b24] border-[#2e5746] text-[#f8fafc] shadow-sm' : 'bg-[#000000] border-[#1e2638] text-[#94a3b8]'}">
            5-5 HRV
          </button>
        </div>

        <!-- CIRCULAR SVG BREATHING STAGE -->
        <div class="py-4 flex flex-col items-center justify-center relative z-10">
          <div class="relative w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center">
            
            <!-- SVG CIRCULAR PROGRESS TRACK -->
            <svg class="w-full h-full transform -rotate-90 pointer-events-none" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="70" stroke="#101622" stroke-width="4" fill="none" />
              <circle id="vagus-svg-arc" cx="80" cy="80" r="70" stroke="#2e5746" stroke-width="5" fill="none" stroke-linecap="round" class="transition-all" style="stroke-dasharray: 439.8; stroke-dashoffset: 439.8;" />
            </svg>

            <!-- PULSING INNER SOMATIC CORE -->
            <div id="vagus-breath-core" class="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-[#2e5746] bg-[#000000] shadow-2xl flex flex-col items-center justify-center text-center transform scale-75 transition-all">
              <span id="vagus-breath-label" class="font-bold text-xs tracking-wider text-[#2e5746] uppercase font-mono">Bereit</span>
              <span id="vagus-breath-seconds" class="font-mono text-3xl sm:text-4xl font-bold text-[#f8fafc] mt-0.5 leading-none">4</span>
            </div>
          </div>

          <!-- CYCLE TRACKER & PHASE DIRECTIVE -->
          <div class="mt-3 space-y-1">
            <span id="vagus-cycle-badge" class="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#142b24] text-[#2e5746] border border-[#2e5746] inline-block">
              Zyklus 1 von ${TARGET_CYCLES_COUNT}
            </span>
            <p id="vagus-instruction-text" class="text-[11px] text-[#94a3b8] font-medium leading-snug px-4 min-h-[2rem] flex items-center justify-center">
              ${escapeHtml(currentPattern.desc)}
            </p>
          </div>
        </div>

        <!-- CONTROLS & HAPTIC NOTICE -->
        <div class="pt-2 border-t border-[#1e2638] relative z-10 flex flex-col gap-2">
          <button type="button" id="btn-vagus-toggle" onclick="SessionLive.toggleBreathingCycle()" class="w-full py-3 rounded-2xl bg-[#c5a880] hover:bg-[#dfcaa9] text-black font-bold font-mono text-xs sm:text-sm touch-pad shadow-xl flex items-center justify-center gap-2">
            <span>Atemführung starten</span>
          </button>
          <span class="text-[9.5px] font-mono text-[#94a3b8]/70">Taktile Haptik aktiv: Schließe die Augen im Halbdunkel</span>
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
      btn.className = "w-full py-3 rounded-2xl bg-[#991b1b] text-white font-bold font-mono text-xs sm:text-sm touch-pad shadow-lg";
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

    const CIRCUMFERENCE = 439.8;

    if (window.SessionAudio && typeof window.SessionAudio.duck === 'function') {
      window.SessionAudio.duck(0.4);
    }

    function applyPhaseTransitions(stepObj) {
      if (!core || !label || !desc || !halo) return;

      label.innerText = stepObj.label;
      desc.innerText = stepObj.text;

      if (stepObj.action === 'inhale') triggerHaptic([40, 50, 40]);
      else if (stepObj.action === 'hold' || stepObj.action === 'empty_hold') triggerHaptic([30]);
      else if (stepObj.action === 'exhale') triggerHaptic([70]);

      if (stepObj.action === 'inhale') {
        core.style.transition = `transform ${stepObj.duration}s cubic-bezier(0.25, 1, 0.5, 1), border-color 1s ease`;
        core.style.transform = "scale(1.35)";
        core.style.borderColor = "#c5a880";
        halo.style.opacity = "0.6";
        halo.style.backgroundColor = "rgba(197, 168, 128, 0.15)";
        if (arc) arc.setAttribute('stroke', '#c5a880');
      } else if (stepObj.action === 'hold') {
        core.style.transition = `transform 1s ease, border-color 1s ease`;
        core.style.transform = "scale(1.35)";
        core.style.borderColor = "#d4af37";
        halo.style.opacity = "0.5";
        halo.style.backgroundColor = "rgba(212, 175, 55, 0.15)";
        if (arc) arc.setAttribute('stroke', '#d4af37');
      } else if (stepObj.action === 'exhale') {
        core.style.transition = `transform ${stepObj.duration}s cubic-bezier(0.4, 0, 0.2, 1), border-color 1s ease`;
        core.style.transform = "scale(0.75)";
        core.style.borderColor = "#2e5746";
        halo.style.opacity = "0.3";
        halo.style.backgroundColor = "rgba(46, 87, 70, 0.2)";
        if (arc) arc.setAttribute('stroke', '#2e5746');
      } else if (stepObj.action === 'empty_hold') {
        core.style.transition = `transform 1s ease, border-color 1s ease`;
        core.style.transform = "scale(0.75)";
        core.style.borderColor = "#1e2638";
        halo.style.opacity = "0.1";
        if (arc) arc.setAttribute('stroke', '#1e2638');
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
      core.style.borderColor = "#2e5746";
    }
    if (arc) {
      arc.setAttribute('stroke', '#2e5746');
      arc.style.strokeDashoffset = "0";
    }

    const btn = document.getElementById('btn-vagus-toggle');
    if (btn) {
      btn.innerText = "Erneut durchführen";
      btn.className = "w-full py-3 rounded-2xl bg-[#c5a880] text-black font-bold font-mono text-xs sm:text-sm touch-pad shadow-md";
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
      <div class="w-full max-w-lg bg-[#090d14] border border-[#c5a880]/60 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl text-xs text-[#f8fafc] my-auto">
        <div class="flex items-center justify-between border-b border-[#1e2638] pb-3">
          <div>
            <span class="text-[9.5px] font-mono uppercase tracking-wider text-[#c5a880] font-bold block">Phase 4: Abschluss</span>
            <h3 class="text-sm sm:text-base font-serif text-[#f8fafc]">Reverse Aftercare &amp; Rüst-Pflege</h3>
          </div>
          <button type="button" onclick="document.getElementById('modal-reverse-aftercare').style.display='none'" class="p-1.5 text-[#94a3b8] hover:text-white">✕</button>
        </div>

        <!-- 1. DIENST AM TOP -->
        <div class="p-3.5 rounded-2xl bg-[#000000] border border-[#c5a880]/30 space-y-1.5">
          <strong class="text-[#c5a880] block font-bold text-xs">1. Dienst des Bottoms am Top:</strong>
          <p class="text-[10.5px] text-[#f8fafc] leading-snug">${escapeHtml(aftercare.subServiceForTop)}</p>
        </div>

        <!-- 2. VAGUS-ERDUNG & GEWICHTSDECKE -->
        <div class="p-3.5 rounded-2xl bg-[#000000] border border-[#2e5746] space-y-1.5">
          <strong class="text-[#2e5746] block font-bold text-xs">2. Nervensystem &amp; Kälteschutz:</strong>
          <p class="text-[10.5px] text-[#f8fafc] leading-snug">${escapeHtml(aftercare.vagusRegulation)}</p>
        </div>

        <!-- 3. TOY-DESINFEKTION AUS DEM SCHRANK -->
        <div class="p-3.5 rounded-2xl bg-[#000000] border border-[#1e2638] space-y-2">
          <div class="flex items-center justify-between">
            <strong class="text-[#f8fafc] block font-bold text-xs">3. Diskrete Toy-Desinfektion:</strong>
            <span class="text-[9.5px] font-mono text-[#c5a880] font-bold">${protocols.length} Gegenstände</span>
          </div>
          ${protocols.length === 0 ? `
            <p class="text-[10px] text-[#94a3b8] italic">Keine Spezialreinigung für genutzte Gegenstände erforderlich.</p>
          ` : `
            <div class="space-y-1.5 pt-1">
              ${protocols.map(p => `
                <div class="p-2 rounded-xl bg-[#090d14] border border-[#1e2638] flex items-center justify-between text-[10.5px]">
                  <span class="text-white font-medium">${escapeHtml(p.name)}</span>
                  <span class="text-[9.5px] font-mono text-[#c5a880] font-bold">${escapeHtml(p.method.replace(/_/g, ' '))}</span>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- ABSCHLUSS & 24H/48H DROP-WÄCHTER -->
        <div class="pt-2 border-t border-[#1e2638] flex justify-between items-center gap-2">
          <span class="text-[9.5px] font-mono text-[#94a3b8]">24h/48h Drop-Wächter wird aktiviert</span>
          <button type="button" onclick="SessionLive.finalizeAndSaveSession()" class="px-5 py-2.5 rounded-xl bg-[#c5a880] hover:bg-[#dfcaa9] text-black font-bold font-mono text-xs touch-pad shadow-md">
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
      sessionMode: activeScript?.sessionMode || "scripted",
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

      sessionStorage.removeItem(STORAGE_KEY_LIVE_METRICS);
    } catch (e) {
      console.warn("[TACTUS Live] Konnte Session-Log nicht sichern:", e);
    }

    if (window.CloudSync && typeof window.CloudSync.trigger === 'function') {
      window.CloudSync.trigger();
    }

    if (window.ChatApp && typeof window.ChatApp.postSystemEvent === 'function') {
      window.ChatApp.postSystemEvent(`Session beendet: „${sessionRecord.title}“ (${sessionRecord.durationMinutes} Min., ${sessionRecord.topOrgasms} Top-Höhepunkte, Bottom: ${sessionRecord.subClimaxType.toUpperCase()}). 24h/48h Drop-Wächter scharfgestellt.`);
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
    toggleVoiceMute: toggleLiveVoiceMute,
    setAudioEnergy: setAudioEnergyLevel,
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
