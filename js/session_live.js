/**
 * js/session_live.js
 * TACTUS Schlafzimmer-Live-Regie, RACK-Ampel Zustandstracking & Session-Logbuch Engine (V3.0 Haute-Horlogerie)
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien nach Master-Roadbook:
 * - 100 % UTF-8 Integrität: Echte deutsche Umlaute (ä, ö, ü, ß) im gesamten Modul
 * - Haute-Horlogerie Palette: OLED-Tiefschwarz, Graphit, Champagner-Gold, Malachit, Cognac, Bordeaux
 * - 4-Phasen State Machine (Transition, Reizaufbau, Top-Lust, Reverse Aftercare) & Somatischer Flow-Modus
 * - 72px Blind-Touch Bedienelemente für 0,2s Glanceability aus 2m Distanz im Halbdunkel
 * - RACK-Ampel Taster für vegetatives Zustandstracking (Grün, Bernstein-Gelb, Karmesin-Rot)
 * - 1-Tap 85% OLED-Nachttisch-Dimmer (Tiefschwarz-Overlay)
 * - 4-7-8 Vagus-Atemkreis zur Kreislaufberuhigung und Kältezittern-Prävention
 * - Audio- & Sprachintegration: 60% Ducking, Beat-Drop bei Kaltstopp, Soundscape-Drones
 * - TACTUS Session-Logbuch: Post-Session Finalize-Modal mit Metriken & Feedback
 * - 1-Klick Feedback-Event im Paar-Stream (chat.html) zur nahtlosen Nachbesprechung
 * - 100 % frei von infantilen System-Emojis, keine window.alert() / confirm() Aufrufe
 */

(function(window) {
  'use strict';

  const STORAGE_KEY_ACTIVE_SCRIPT = 'tactus_active_session_script';
  const STORAGE_KEY_LIVE_METRICS = 'tactus_live_session_metrics';
  const STORAGE_KEY_LOGBOOK = 'tactus_session_logbook';
  const STORAGE_KEY_CHAT_MESSAGES = 'tactus_chat_messages_e2ee';

  let liveState = {
    isRunning: false,
    sessionMode: 'scripted', // 'scripted' | 'flow'
    currentPhaseIndex: 1,
    phaseStartTime: null,
    sessionStartTime: null,
    elapsedSecondsTotal: 0,
    elapsedSecondsPhase: 0,
    sessionTimerInterval: null,
    vagusTimerInterval: null,
    vagusPhase: 'idle', // 'inhale' (4s) | 'hold' (7s) | 'exhale' (8s)
    vagusSecondsLeft: 0,
    edgesCounted: 0,
    bottomStateTrafficLight: 'green', // 'green' | 'yellow' | 'red'
    isDimmed: false,
    scriptData: null,
    leadMotif: null,
    tonality: 'sovereign_warm',
    climaxTypeSub: 'pending', // 'pending' | 'denial' | 'ruined' | 'prostate' | 'full'
    lastStatusCheckSeconds: 0,
    checkInIntervalSeconds: 600, // Alle 10 Minuten Erinnerung an Status-Check
    isCheckInDue: false
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

  function triggerHaptic(pattern) {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(pattern); } catch (e) {}
    }
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

  function loadSessionData() {
    try {
      const rawScript = sessionStorage.getItem(STORAGE_KEY_ACTIVE_SCRIPT);
      if (rawScript) {
        liveState.scriptData = JSON.parse(rawScript);
        liveState.sessionMode = liveState.scriptData.sessionMode || 'scripted';
        liveState.tonality = liveState.scriptData.tonality || 'sovereign_warm';
        liveState.leadMotif = liveState.scriptData.leadMotif || null;
      }
    } catch (e) {
      console.warn("[TACTUS Live] Fehler beim Laden des Drehbuchs:", e);
    }

    try {
      const rawMetrics = sessionStorage.getItem(STORAGE_KEY_LIVE_METRICS);
      if (rawMetrics) {
        const metrics = JSON.parse(rawMetrics);
        if (metrics.startedAt && !metrics.finalizedAt) {
          liveState.isRunning = true;
          liveState.sessionStartTime = metrics.startedAt;
          liveState.currentPhaseIndex = metrics.currentPhaseIndex || 1;
          liveState.edgesCounted = metrics.edgesCounted || 0;
          liveState.bottomStateTrafficLight = metrics.trafficLight || 'green';
        }
      }
    } catch (e) {}

    // Kanten aus dem Edging-Cockpit synchronisieren falls vorhanden
    try {
      const rawEdging = sessionStorage.getItem('tactus_edging_metrics');
      if (rawEdging) {
        const parsed = JSON.parse(rawEdging);
        if (parsed.edgesCounted) liveState.edgesCounted = Math.max(liveState.edgesCounted, parsed.edgesCounted);
      }
    } catch (e) {}
  }

  function saveLiveMetrics() {
    try {
      const payload = {
        startedAt: liveState.sessionStartTime,
        currentPhaseIndex: liveState.currentPhaseIndex,
        elapsedSecondsTotal: liveState.elapsedSecondsTotal,
        edgesCounted: liveState.edgesCounted,
        trafficLight: liveState.bottomStateTrafficLight,
        climaxTypeSub: liveState.climaxTypeSub,
        sessionMode: liveState.sessionMode,
        finalizedAt: null
      };
      sessionStorage.setItem(STORAGE_KEY_LIVE_METRICS, JSON.stringify(payload));
    } catch (e) {}
  }

  function formatTime(totalSeconds) {
    const s = Math.max(0, Math.floor(totalSeconds));
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
  }

  function startTimers() {
    stopTimers();
    if (!liveState.sessionStartTime) {
      liveState.sessionStartTime = Date.now();
    }
    if (!liveState.phaseStartTime) {
      liveState.phaseStartTime = Date.now();
    }
    liveState.isRunning = true;

    liveState.sessionTimerInterval = setInterval(() => {
      const now = Date.now();
      liveState.elapsedSecondsTotal = Math.floor((now - liveState.sessionStartTime) / 1000);
      liveState.elapsedSecondsPhase = Math.floor((now - liveState.phaseStartTime) / 1000);

      // Periodische Prüfung für den vegetativen Status-Check beim Bottom
      checkPeriodicStatusInquiry();

      updateTimerDisplays();
      saveLiveMetrics();
    }, 1000);
  }

  function checkPeriodicStatusInquiry() {
    const elapsedSinceLastCheck = liveState.elapsedSecondsTotal - liveState.lastStatusCheckSeconds;
    if (elapsedSinceLastCheck >= liveState.checkInIntervalSeconds && !liveState.isCheckInDue) {
      liveState.isCheckInDue = true;
      triggerHaptic([40, 30, 40]);
      
      const isGagged = checkIfBottomIsGagged();
      if (window.SessionVoice && typeof window.SessionVoice.speak === 'function') {
        const promptText = isGagged 
          ? "Status-Check beim Bottom fällig. Handdruck-Signal oder Display-Ampel abfragen."
          : "Status-Check fällig. Ampel-Zustand beim Bottom abfragen.";
        window.SessionVoice.speak(promptText, { priority: 'normal', tonality: liveState.tonality });
      }

      showToast("RACK Status-Check fällig! Zustand beim Bottom einholen.");
      renderCockpit();
    }
  }

  function checkIfBottomIsGagged() {
    const script = liveState.scriptData;
    const motif = liveState.leadMotif || (script ? script.leadMotif : null);
    if (motif) {
      const titleLower = (motif.title || '').toLowerCase();
      const tags = motif.equipmentTags || [];
      if (tags.includes('gag') || motif.somaticZone === 'head_mouth' || titleLower.includes('knebel')) {
        return true;
      }
    }
    return false;
  }

  function acknowledgeStatusCheck(colorChosen = null) {
    liveState.lastStatusCheckSeconds = liveState.elapsedSecondsTotal;
    liveState.isCheckInDue = false;
    if (colorChosen) {
      setBottomTrafficLight(colorChosen);
    } else {
      renderCockpit();
    }
  }

  function stopTimers() {
    if (liveState.sessionTimerInterval) {
      clearInterval(liveState.sessionTimerInterval);
      liveState.sessionTimerInterval = null;
    }
  }

  function updateTimerDisplays() {
    const totalEl = document.getElementById('live-total-timer-digits');
    const phaseEl = document.getElementById('live-phase-timer-digits');
    const flowEl = document.getElementById('live-flow-timer-digits');

    const formattedTotal = formatTime(liveState.elapsedSecondsTotal);
    const formattedPhase = formatTime(liveState.elapsedSecondsPhase);

    if (totalEl) totalEl.innerText = formattedTotal;
    if (phaseEl) phaseEl.innerText = formattedPhase;
    if (flowEl) flowEl.innerText = formattedTotal;
  }

  function setBottomTrafficLight(color) {
    liveState.bottomStateTrafficLight = color;
    liveState.lastStatusCheckSeconds = liveState.elapsedSecondsTotal;
    liveState.isCheckInDue = false;
    saveLiveMetrics();

    const indicatorDot = document.getElementById('traffic-light-status-dot');
    const indicatorText = document.getElementById('traffic-light-status-text');

    if (color === 'green') {
      triggerHaptic([25]);
      if (window.SessionAudio && typeof window.SessionAudio.playPercussionClick === 'function') {
        window.SessionAudio.playPercussionClick(550, 30);
      }
      if (indicatorDot) indicatorDot.className = "w-3 h-3 rounded-full bg-[#15803d] animate-pulse";
      if (indicatorText) indicatorText.innerText = "Grün · Reiz im stabilen Bereich";
      showToast("RACK-Ampel: GRÜN (Vegetativ stabil)");
    } else if (color === 'yellow') {
      triggerHaptic([60, 40, 60]);
      if (window.SessionAudio && typeof window.SessionAudio.duck === 'function') {
        window.SessionAudio.duck(0.40, 0.2);
        setTimeout(() => window.SessionAudio.unduck(1.5), 3000);
      }
      if (window.SessionVoice && typeof window.SessionVoice.speak === 'function') {
        window.SessionVoice.speak("Gelb registriert. Intensität drosseln, Haltung lockern.", {
          priority: 'immediate',
          tonality: liveState.tonality
        });
      }
      if (indicatorDot) indicatorDot.className = "w-3 h-3 rounded-full bg-[#ca8a04] animate-ping";
      if (indicatorText) indicatorText.innerText = "Gelb · Grenzbereich naht (Drosseln)";
      showToast("RACK-Ampel: GELB (Grenzbereich naht / Intensität drosseln)");
    } else if (color === 'red') {
      triggerHaptic([100, 50, 100, 50, 300]);
      if (window.SessionAudio && typeof window.SessionAudio.coldStop === 'function') {
        window.SessionAudio.coldStop();
      }
      if (window.SessionVoice && typeof window.SessionVoice.speak === 'function') {
        window.SessionVoice.speak("Rot! Kaltstopp. Sofortiger Handlungsstillstand. Hände wegnehmen.", {
          priority: 'emergency',
          tonality: 'sovereign_cool'
        });
      }
      if (indicatorDot) indicatorDot.className = "w-3 h-3 rounded-full bg-[#dc2626] animate-ping";
      if (indicatorText) indicatorText.innerText = "ROT · KALTSTOPP / HANDLUNGSSTILLSTAND";
      showToast("RACK-Ampel: ROT (SOFORTIGER HANDLUNGSSTILLSTAND!)");

      // Wenn Rot: Dimmer abschalten, damit man voll handlungsfähig ist
      if (liveState.isDimmed) toggleDimmer();
    }

    renderCockpit();
  }

  function startVagusBreathing() {
    stopVagusBreathing();
    liveState.vagusPhase = 'inhale';
    liveState.vagusSecondsLeft = 4;

    if (window.SessionAudio && typeof window.SessionAudio.playDrone === 'function') {
      window.SessionAudio.playDrone('vagus_432');
    }

    if (window.SessionVoice && typeof window.SessionVoice.speak === 'function') {
      window.SessionVoice.speak("Vagus-Atmung beginnt. Vier Sekunden durch die Nase einatmen.", {
        priority: 'normal',
        tonality: liveState.tonality
      });
    }

    updateVagusDisplay();

    liveState.vagusTimerInterval = setInterval(() => {
      liveState.vagusSecondsLeft--;

      if (liveState.vagusSecondsLeft <= 0) {
        if (liveState.vagusPhase === 'inhale') {
          liveState.vagusPhase = 'hold';
          liveState.vagusSecondsLeft = 7;
          triggerHaptic([40]);
          if (window.SessionVoice && typeof window.SessionVoice.speak === 'function') {
            window.SessionVoice.speak("Sieben Sekunden Atem sanft anhalten.", { priority: 'normal', tonality: liveState.tonality });
          }
        } else if (liveState.vagusPhase === 'hold') {
          liveState.vagusPhase = 'exhale';
          liveState.vagusSecondsLeft = 8;
          triggerHaptic([25, 25]);
          if (window.SessionVoice && typeof window.SessionVoice.speak === 'function') {
            window.SessionVoice.speak("Acht Sekunden langsam durch den Mund ausatmen.", { priority: 'normal', tonality: liveState.tonality });
          }
        } else if (liveState.vagusPhase === 'exhale') {
          liveState.vagusPhase = 'inhale';
          liveState.vagusSecondsLeft = 4;
          triggerHaptic([35]);
          if (window.SessionVoice && typeof window.SessionVoice.speak === 'function') {
            window.SessionVoice.speak("Wieder vier Sekunden einatmen.", { priority: 'normal', tonality: liveState.tonality });
          }
        }
      }

      updateVagusDisplay();
    }, 1000);
  }

  function stopVagusBreathing() {
    if (liveState.vagusTimerInterval) {
      clearInterval(liveState.vagusTimerInterval);
      liveState.vagusTimerInterval = null;
    }
    liveState.vagusPhase = 'idle';
    liveState.vagusSecondsLeft = 0;
  }

  function updateVagusDisplay() {
    const textEl = document.getElementById('vagus-phase-title');
    const secEl = document.getElementById('vagus-seconds-display');
    const circleEl = document.getElementById('vagus-animated-circle');

    if (!secEl) return;
    secEl.innerText = liveState.vagusSecondsLeft > 0 ? `${liveState.vagusSecondsLeft}s` : 'Bereit';

    if (textEl) {
      if (liveState.vagusPhase === 'inhale') textEl.innerText = "Einatmen (4s Nase)";
      else if (liveState.vagusPhase === 'hold') textEl.innerText = "Halten (7s Stillstehen)";
      else if (liveState.vagusPhase === 'exhale') textEl.innerText = "Ausatmen (8s Mund)";
      else textEl.innerText = "4-7-8 Vagus-Erdung";
    }

    if (circleEl) {
      if (liveState.vagusPhase === 'inhale') {
        circleEl.style.transform = "scale(1.35)";
        circleEl.style.borderColor = "#2e5746";
      } else if (liveState.vagusPhase === 'hold') {
        circleEl.style.transform = "scale(1.35)";
        circleEl.style.borderColor = "#c5a880";
      } else if (liveState.vagusPhase === 'exhale') {
        circleEl.style.transform = "scale(1.0)";
        circleEl.style.borderColor = "#1e2638";
      } else {
        circleEl.style.transform = "scale(1.0)";
        circleEl.style.borderColor = "#2a364f";
      }
    }
  }

  function nextPhase() {
    if (!liveState.scriptData || !Array.isArray(liveState.scriptData.phases)) return;
    const maxPhase = liveState.scriptData.phases.length;

    if (liveState.currentPhaseIndex < maxPhase) {
      liveState.currentPhaseIndex++;
      liveState.phaseStartTime = Date.now();
      liveState.elapsedSecondsPhase = 0;

      const newPhase = liveState.scriptData.phases[liveState.currentPhaseIndex - 1];
      triggerHaptic([60, 40, 100]);
      showToast(`Wechsel zu ${newPhase.title}`);

      // Sprachbefehl der neuen Phase ankündigen
      if (window.SessionVoice && typeof window.SessionVoice.speak === 'function' && newPhase.topDialogueQuote) {
        window.SessionVoice.speak(newPhase.topDialogueQuote, {
          priority: 'normal',
          tonality: liveState.tonality
        });
      }

      // Bei Erreichen von Phase 4 (Reverse Aftercare): Vagus-Atmung anregen
      if (liveState.currentPhaseIndex === 4) {
        startVagusBreathing();
      }

      saveLiveMetrics();
      renderCockpit();
    } else {
      openFinalizeModal();
    }
  }

  function prevPhase() {
    if (liveState.currentPhaseIndex > 1) {
      liveState.currentPhaseIndex--;
      liveState.phaseStartTime = Date.now();
      liveState.elapsedSecondsPhase = 0;
      saveLiveMetrics();
      renderCockpit();
    }
  }

  function toggleDimmer() {
    let overlay = document.getElementById('session-live-dimmer-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'session-live-dimmer-overlay';
      overlay.className = 'fixed inset-0 bg-black/85 z-50 pointer-events-none transition-opacity duration-500 opacity-0';
      document.body.appendChild(overlay);
    }

    liveState.isDimmed = !liveState.isDimmed;
    overlay.style.opacity = liveState.isDimmed ? '1' : '0';
    showToast(liveState.isDimmed ? "Nachttisch-Dimmer aktiv (85% OLED-Halbdunkel)" : "Dimmer deaktiviert");
  }

  function triageSub(typeKey) {
    liveState.climaxTypeSub = typeKey;
    saveLiveMetrics();
    showToast(`Ausgang des Subs registriert: ${typeKey.toUpperCase()}`);
    renderCockpit();
  }

  function openFinalizeModal() {
    stopTimers();
    stopVagusBreathing();

    let modal = document.getElementById('modal-session-finalize');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modal-session-finalize';
      modal.className = "fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none";
      document.body.appendChild(modal);
    }

    const durationMins = Math.max(1, Math.round(liveState.elapsedSecondsTotal / 60));
    const motifTitle = liveState.leadMotif ? liveState.leadMotif.title : 'Schlafzimmer-Session';

    modal.innerHTML = `
      <div class="bg-[#090d14] rounded-3xl max-w-lg w-full border border-[#c5a880]/60 p-5 sm:p-6 space-y-4 shadow-2xl text-xs text-[#f8fafc] font-sans max-h-[90dvh] overflow-y-auto pb-[max(env(safe-area-inset-bottom),16px)]">
        
        <div class="flex items-center justify-between border-b border-[#2a364f] pb-3">
          <div>
            <span class="text-[9.5px] font-mono uppercase tracking-wider text-[#d4af37] font-bold block">Session-Abschluss &amp; Logbuch-Eintrag</span>
            <h3 class="text-base sm:text-lg font-serif text-white font-bold mt-0.5">${escapeHtml(motifTitle)}</h3>
          </div>
          <button type="button" onclick="SessionLive.closeFinalizeModal()" class="w-8 h-8 rounded-xl bg-[#000000] border border-[#2a364f] text-[#94a3b8] hover:text-white flex items-center justify-center touch-pad">✕</button>
        </div>

        <p class="text-[11px] text-[#94a3b8] leading-relaxed">
          Großartige Führung. Dokumentiere eure Session für das gemeinsame Logbuch und sende automatisch eine 1-Klick Feedback-Aufforderung in euren Paar-Stream.
        </p>

        <!-- KENNZAHLEN DER SESSION -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div class="p-3 rounded-2xl bg-[#000000] border border-[#2a364f] space-y-0.5">
            <span class="text-[9.5px] text-[#94a3b8] block">Dauer:</span>
            <strong class="text-sm font-bold text-white">${durationMins} Min.</strong>
          </div>
          <div class="p-3 rounded-2xl bg-[#000000] border border-[#2a364f] space-y-0.5">
            <span class="text-[9.5px] text-[#94a3b8] block">Edges (Plateaus):</span>
            <strong class="text-sm font-bold text-[#c5a880]">${liveState.edgesCounted}</strong>
          </div>
          <div class="p-3 rounded-2xl bg-[#000000] border border-[#2a364f] space-y-0.5">
            <span class="text-[9.5px] text-[#94a3b8] block">Tonalität:</span>
            <strong class="text-xs font-bold text-white truncate block mt-0.5">${escapeHtml(liveState.tonality)}</strong>
          </div>
          <div class="p-3 rounded-2xl bg-[#000000] border border-[#2a364f] space-y-0.5">
            <span class="text-[9.5px] text-[#94a3b8] block">Ausgang Sub:</span>
            <strong class="text-xs font-bold text-[#b3734a] truncate block mt-0.5">${escapeHtml(liveState.climaxTypeSub)}</strong>
          </div>
        </div>

        <!-- POST-SESSION FEEDBACK & REFLEXION -->
        <div class="space-y-2">
          <label class="text-[10px] font-mono uppercase text-[#c5a880] font-bold block">Post-somatisches Feedback / Notiz für euer Tagebuch:</label>
          <textarea id="finalize-input-feedback" rows="3" placeholder="Wie war die Verbindung? Was hat besonders berührt, wo gab es Zögern? (z. B. 'Sehr tiefer Kniestand, ruhiges Loslassen...')" class="w-full p-3 rounded-xl bg-[#000000] border border-[#2a364f] text-white text-xs font-sans placeholder:text-[#94a3b8]/40 focus:border-[#c5a880] focus:outline-none leading-relaxed"></textarea>
        </div>

        <div class="pt-2 border-t border-[#2a364f] flex justify-end gap-2 font-mono">
          <button type="button" onclick="SessionLive.closeFinalizeModal()" class="px-4 py-2.5 bg-[#000000] border border-[#2a364f] text-[#94a3b8] font-bold rounded-xl text-xs touch-pad">Zurück zur Regie</button>
          <button type="button" onclick="SessionLive.confirmFinalizeSession()" class="px-5 py-2.5 bg-[#c5a880] hover:bg-[#dfcaa9] text-black font-bold rounded-xl text-xs touch-pad shadow-md">
            Ins Logbuch speichern &amp; Stream benachrichtigen ↗
          </button>
        </div>
      </div>
    `;

    modal.style.display = 'flex';
  }

  function closeFinalizeModal() {
    const modal = document.getElementById('modal-session-finalize');
    if (modal) modal.style.display = 'none';
    if (liveState.isRunning) startTimers();
  }

  function confirmFinalizeSession() {
    const feedbackInput = document.getElementById('finalize-input-feedback');
    const feedbackText = feedbackInput ? feedbackInput.value.trim() : '';

    const durationMins = Math.max(1, Math.round(liveState.elapsedSecondsTotal / 60));
    const motifTitle = liveState.leadMotif ? liveState.leadMotif.title : 'Schlafzimmer-Session';

    // 1. Logbuch-Eintrag erstellen & speichern
    let logbook = [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY_LOGBOOK);
      if (raw) logbook = JSON.parse(raw);
    } catch (e) {}

    const newEntry = {
      id: `session_${Date.now()}`,
      timestamp: Date.now(),
      title: motifTitle,
      durationMinutes: durationMins,
      edgesCounted: liveState.edgesCounted,
      tonality: liveState.tonality,
      climaxType: liveState.climaxTypeSub,
      feedbackNote: feedbackText,
      trafficLightFinal: liveState.bottomStateTrafficLight
    };

    logbook.unshift(newEntry);
    try {
      localStorage.setItem(STORAGE_KEY_LOGBOOK, JSON.stringify(logbook));
    } catch (e) {}

    // 2. Im Paar-Stream (chat.html) den System-Event mit 1-Klick Feedback posten
    postSessionFeedbackToChat(newEntry);

    // 3. Metriken zurücksetzen
    liveState.isRunning = false;
    sessionStorage.removeItem(STORAGE_KEY_LIVE_METRICS);
    sessionStorage.removeItem('tactus_edging_metrics');

    const modal = document.getElementById('modal-session-finalize');
    if (modal) modal.style.display = 'none';

    showToast("✓ Session im Logbuch archiviert & Stream benachrichtigt!");

    // Automatisch auf das Logbuch in session.html umschalten
    if (window.SessionRuntime && typeof window.SessionRuntime.switchStage === 'function') {
      window.SessionRuntime.switchStage('logbook');
    }
  }

  function postSessionFeedbackToChat(sessionEntry) {
    try {
      let chatMsgs = [];
      const raw = localStorage.getItem(STORAGE_KEY_CHAT_MESSAGES);
      if (raw) chatMsgs = JSON.parse(raw);

      const noticeText = `SCHLAFZIMMER-SESSION ABGESCHLOSSEN: „${sessionEntry.title}“ (${sessionEntry.durationMinutes} Min. · ${sessionEntry.edgesCounted} Edges · Tonalität: ${sessionEntry.tonality}). Bitte um eure somatische Reflexion im Session-Logbuch.`;

      const newMsg = {
        id: `msg_session_${Date.now()}`,
        sender: 'system',
        text: noticeText,
        sessionRefId: sessionEntry.id,
        timestamp: Date.now()
      };

      chatMsgs.push(newMsg);
      localStorage.setItem(STORAGE_KEY_CHAT_MESSAGES, JSON.stringify(chatMsgs.slice(-100)));

      if (window.CloudSync && typeof window.CloudSync.trigger === 'function') {
        window.CloudSync.trigger();
      }
    } catch (e) {
      console.warn("[TACTUS Live] Konnte Chat-Meldung nicht absetzen:", e);
    }
  }

  function renderCockpit(containerId = 'live-session-container') {
    loadSessionData();
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!liveState.isRunning && liveState.scriptData) {
      startTimers();
    }

    const script = liveState.scriptData;
    const isFlow = liveState.sessionMode === 'flow' || !script;
    const currentPhase = (script && Array.isArray(script.phases)) 
      ? script.phases[liveState.currentPhaseIndex - 1] 
      : null;

    const totalPhases = (script && Array.isArray(script.phases)) ? script.phases.length : 1;
    const motifTitle = liveState.leadMotif ? liveState.leadMotif.title : (script ? script.sessionTitle : 'Freies Spiel (Somatischer Flow)');
    const light = liveState.bottomStateTrafficLight;
    const isGagged = checkIfBottomIsGagged();

    container.innerHTML = `
      <div class="space-y-4 max-w-2xl mx-auto text-xs font-sans animate-fade-in select-none">
        
        <!-- HEADER STATUS & REGIE-LEISTE -->
        <div class="p-4 sm:p-5 rounded-3xl bg-[#090d14] border border-[#2a364f] shadow-2xl space-y-3">
          <div class="flex items-center justify-between border-b border-[#2a364f]/70 pb-3 gap-2">
            <div class="space-y-0.5 min-w-0 flex-1">
              <span class="text-[9.5px] font-mono uppercase tracking-wider text-[#c5a880] font-bold block truncate">
                Operative Live-Regie im Halbdunkel
              </span>
              <h2 class="text-sm sm:text-base font-serif text-white font-bold truncate">
                ${escapeHtml(motifTitle)}
              </h2>
            </div>
            
            <div class="flex items-center gap-1.5 font-mono text-xs flex-shrink-0">
              <span class="px-2.5 py-1 rounded-xl bg-[#000000] border border-[#2a364f] text-[#c5a880] font-bold">
                ${isFlow ? 'Flow-Modus' : `Phase ${liveState.currentPhaseIndex} von ${totalPhases}`}
              </span>
              <button type="button" onclick="SessionLive.openFinalizeModal()" class="px-3 py-1 rounded-xl bg-[#450a0a] hover:bg-[#991b1b] border border-[#991b1b] text-white font-bold touch-pad shadow-sm" title="Session beenden & archivieren">
                Beenden ✕
              </button>
            </div>
          </div>

          <!-- 72px GLANCEABLE TIMER KACHEL (AUS 2M DISTANZ LESBAR) -->
          <div class="grid grid-cols-2 gap-2 text-center">
            <div class="p-4 rounded-2xl bg-[#000000] border border-[#2a364f] space-y-0.5">
              <span class="text-[9.5px] font-mono text-[#94a3b8] uppercase tracking-wider block">Session Gesamt:</span>
              <div id="live-total-timer-digits" class="text-4xl sm:text-5xl font-mono font-bold text-white tracking-tight leading-none pt-1">
                ${formatTime(liveState.elapsedSecondsTotal)}
              </div>
            </div>
            <div class="p-4 rounded-2xl bg-[#000000] border border-[#2a364f] space-y-0.5">
              <span class="text-[9.5px] font-mono text-[#c5a880] uppercase tracking-wider block">${isFlow ? 'Laufzeit' : `Phase ${liveState.currentPhaseIndex}:`}</span>
              <div id="live-phase-timer-digits" class="text-4xl sm:text-5xl font-mono font-bold text-[#c5a880] tracking-tight leading-none pt-1">
                ${formatTime(liveState.elapsedSecondsPhase)}
              </div>
            </div>
          </div>
        </div>

        <!-- PERIODISCHE STATUS-CHECK ERINNERUNG (RACK INTERVALL) -->
        ${liveState.isCheckInDue ? `
          <div class="p-4 rounded-3xl bg-[#4a2818]/60 border-2 border-[#b3734a] space-y-2 shadow-2xl animate-pulse">
            <div class="flex items-center justify-between border-b border-[#b3734a]/60 pb-1.5">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-[#d4af37] animate-ping"></span>
                <strong class="text-xs text-white font-bold">RACK-Check-in fällig (10-Minuten-Intervall)</strong>
              </div>
              <span class="text-[9.5px] font-mono text-[#d4af37] font-bold">Top-Pflicht</span>
            </div>
            <p class="text-[11px] text-[#f8fafc] leading-snug">
              ${isGagged ? `
                <strong>Mund des Bottoms geknebelt!</strong> Kein verbales Safeword möglich. Frage den Status nonverbal ab: 
                <span class="text-[#c5a880]">2x Handdruck = Grün</span> · <span class="text-[#ca8a04]">3x = Gelb</span> · <span class="text-[#dc2626]">Loslassen = Kaltstopp</span> (oder Bottom tippt auf den Bildschirm).
              ` : `
                Erfrage den aktuellen Zustand des Bottoms: Fühlt sich der Reiz stabil an oder naht die Belastungsgrenze?
              `}
            </p>
            <div class="pt-1 flex justify-end gap-2 font-mono text-[10px]">
              <button type="button" onclick="SessionLive.acknowledgeStatusCheck('green')" class="px-3 py-1.5 rounded-xl bg-[#15803d] text-white font-bold touch-pad">
                ✓ Grün bestätigt
              </button>
              <button type="button" onclick="SessionLive.acknowledgeStatusCheck('yellow')" class="px-3 py-1.5 rounded-xl bg-[#ca8a04] text-black font-bold touch-pad">
                ⚠ Gelb drosseln
              </button>
            </div>
          </div>
        ` : ''}

        <!-- RACK-AMPEL TASTER FÜR VEGETATIVES ZUSTANDSTRACKING -->
        <div class="p-4 sm:p-5 rounded-3xl bg-[#090d14] border border-[#2a364f] space-y-3 shadow-2xl">
          <div class="flex items-center justify-between border-b border-[#2a364f]/70 pb-2">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full ${light === 'green' ? 'bg-[#15803d]' : (light === 'yellow' ? 'bg-[#ca8a04]' : 'bg-[#dc2626]')} animate-pulse" id="traffic-light-status-dot"></span>
              <strong class="text-xs text-white block font-bold" id="traffic-light-status-text">
                ${light === 'green' ? 'Grün · Reiz im stabilen Bereich' : (light === 'yellow' ? 'Gelb · Grenzbereich naht (Drosseln)' : 'ROT · KALTSTOPP!')}
              </strong>
            </div>
            <span class="text-[9.5px] font-mono text-[#94a3b8]">Vegetative Ampel</span>
          </div>

          <div class="grid grid-cols-3 gap-2 text-center font-mono">
            <button 
              type="button" 
              onclick="SessionLive.setBottomTrafficLight('green')" 
              class="min-h-[56px] p-3 rounded-2xl border-2 flex flex-col items-center justify-center transition-all touch-pad ${light === 'green' ? 'bg-[#15803d] border-[#22c55e] text-white shadow-lg' : 'bg-[#000000] border-[#15803d]/40 text-[#22c55e] hover:border-[#22c55e]'}"
            >
              <strong class="text-xs sm:text-sm font-bold block">1. GRÜN</strong>
              <span class="text-[9px] opacity-80 block">Stabil / Weiter</span>
            </button>

            <button 
              type="button" 
              onclick="SessionLive.setBottomTrafficLight('yellow')" 
              class="min-h-[56px] p-3 rounded-2xl border-2 flex flex-col items-center justify-center transition-all touch-pad ${light === 'yellow' ? 'bg-[#ca8a04] border-[#eab308] text-black shadow-lg' : 'bg-[#000000] border-[#ca8a04]/40 text-[#eab308] hover:border-[#eab308]'}"
            >
              <strong class="text-xs sm:text-sm font-bold block">2. GELB</strong>
              <span class="text-[9px] opacity-90 block">Drosseln</span>
            </button>

            <button 
              type="button" 
              onclick="SessionLive.setBottomTrafficLight('red')" 
              class="min-h-[56px] p-3 rounded-2xl border-2 flex flex-col items-center justify-center transition-all touch-pad ${light === 'red' ? 'bg-[#dc2626] border-[#ef4444] text-white shadow-lg' : 'bg-[#000000] border-[#dc2626]/40 text-[#ef4444] hover:border-[#ef4444]'}"
            >
              <strong class="text-xs sm:text-sm font-bold block">3. ROT</strong>
              <span class="text-[9px] opacity-80 block">Kaltstopp!</span>
            </button>
          </div>
          <span class="text-[9.5px] font-mono text-[#94a3b8] text-center block">
            ${isGagged ? 'Mund geknebelt: 1-Tap auf Taster oder 2x/3x Handdruck' : '1-Fingertipp Rückmeldung des Bottoms im Halbdunkel (Haptik, Audio-Ducking &amp; Kaltstopp)'}
          </span>
        </div>

        <!-- PHASEN-INHALTE & ANWEISUNGEN -->
        ${!isFlow && currentPhase ? `
          <div class="p-4 sm:p-5 rounded-3xl bg-[#090d14] border border-[#2a364f] space-y-3 shadow-xl">
            <div class="flex items-center justify-between border-b border-[#2a364f]/70 pb-2">
              <strong class="text-xs sm:text-sm text-white font-serif font-bold block">
                ${escapeHtml(currentPhase.title)}
              </strong>
              <span class="text-[9.5px] font-mono text-[#c5a880]">Zone: ${escapeHtml(currentPhase.somaticZone || 'Körper')}</span>
            </div>

            <p class="text-[11px] text-[#f8fafc] leading-relaxed">
              ${escapeHtml(currentPhase.instruction)}
            </p>

            ${currentPhase.topDialogueQuote ? `
              <div class="p-3.5 rounded-2xl bg-[#000000] border border-[#c5a880]/50 text-xs text-[#c5a880] italic leading-relaxed">
                ${escapeHtml(currentPhase.topDialogueQuote)}
              </div>
            ` : ''}

            <!-- PHASEN STEUERUNG -->
            <div class="pt-2 flex items-center justify-between font-mono text-xs">
              <button type="button" onclick="SessionLive.prevPhase()" ${liveState.currentPhaseIndex === 1 ? 'disabled class="opacity-30 cursor-not-allowed px-3 py-2 rounded-xl bg-[#000000] text-[#94a3b8]"' : 'class="px-3 py-2 rounded-xl bg-[#000000] border border-[#2a364f] text-[#94a3b8] hover:text-white touch-pad"'}>
                ← Vorherige
              </button>
              <button type="button" onclick="SessionLive.nextPhase()" class="px-5 py-2.5 rounded-xl bg-[#c5a880] hover:bg-[#dfcaa9] text-black font-bold touch-pad shadow-md">
                ${liveState.currentPhaseIndex === totalPhases ? 'Session abschließen ✓' : 'Nächste Phase →'}
              </button>
            </div>
          </div>
        ` : `
          <!-- FLOW-MODUS BEDIENTABLEAU -->
          <div class="p-4 sm:p-5 rounded-3xl bg-[#090d14] border border-[#2a364f] space-y-3 shadow-xl">
            <strong class="text-xs sm:text-sm text-white font-serif font-bold block">
              Freies Spiel &amp; Somatischer Flow
            </strong>
            <p class="text-[11px] text-[#94a3b8] leading-relaxed">
              Kein starres Drehbuch. Du bestimmst Reiz, Kadenz und Dauer nach eigenem Rhythmus. Nutze das Schwellen-Cockpit für Kantenführung und das Vagus-Panel für die Landung.
            </p>
            <div class="pt-1 flex items-center justify-between font-mono text-xs">
              <button type="button" onclick="SessionRuntime.switchStage('edging')" class="px-4 py-2.5 rounded-xl bg-[#000000] border border-[#b3734a] text-[#b3734a] font-bold touch-pad">
                Schwellen-Cockpit ↗
              </button>
              <button type="button" onclick="SessionLive.openFinalizeModal()" class="px-5 py-2.5 rounded-xl bg-[#c5a880] hover:bg-[#dfcaa9] text-black font-bold touch-pad shadow-md">
                Session abschließen ✓
              </button>
            </div>
          </div>
        `}

        <!-- 4-7-8 VAGUS-ATMUNG & DECKENRUHE -->
        <div class="p-4 sm:p-5 rounded-3xl bg-[#090d14] border border-[#142b24] space-y-3 shadow-xl">
          <div class="flex items-center justify-between border-b border-[#2e5746]/50 pb-2">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-[#2e5746] animate-pulse"></span>
              <strong class="text-xs text-white font-bold" id="vagus-phase-title">
                4-7-8 Vagus-Erdung (Kreislaufstabilisierung)
              </strong>
            </div>
            <button type="button" onclick="SessionLive.startVagusBreathing()" class="px-3 py-1 rounded-xl bg-[#142b24] hover:bg-[#2e5746] text-white border border-[#2e5746] font-mono text-[10px] font-bold touch-pad">
              Atemtakt starten
            </button>
          </div>

          <div class="flex items-center justify-center py-2">
            <div id="vagus-animated-circle" class="w-28 h-28 rounded-full border-4 border-[#2a364f] flex flex-col items-center justify-center text-center transition-all duration-700">
              <span id="vagus-seconds-display" class="font-mono text-2xl font-bold text-white">Bereit</span>
              <span class="text-[8.5px] font-mono text-[#94a3b8] mt-0.5">Vagus-Puls</span>
            </div>
          </div>
          <span class="text-[9.5px] font-mono text-[#94a3b8] text-center block">
            4s Einatmen (Nase) ➔ 7s Halten ➔ 8s Ausatmen (Mund). Verhindert den Subdrop.
          </span>
        </div>

      </div>
    `;

    updateTimerDisplays();
  }

  const api = {
    init: function() {
      loadSessionData();
    },
    startWithScript: function(scriptObj) {
      liveState.scriptData = scriptObj;
      liveState.sessionMode = scriptObj.sessionMode || 'scripted';
      liveState.tonality = scriptObj.tonality || 'sovereign_warm';
      liveState.leadMotif = scriptObj.leadMotif || null;
      liveState.currentPhaseIndex = 1;
      liveState.elapsedSecondsTotal = 0;
      liveState.elapsedSecondsPhase = 0;
      liveState.sessionStartTime = Date.now();
      liveState.phaseStartTime = Date.now();
      liveState.edgesCounted = 0;
      liveState.bottomStateTrafficLight = 'green';
      liveState.climaxTypeSub = 'pending';
      liveState.lastStatusCheckSeconds = 0;
      liveState.isCheckInDue = false;

      sessionStorage.setItem(STORAGE_KEY_ACTIVE_SCRIPT, JSON.stringify(scriptObj));
      saveLiveMetrics();

      startTimers();
      renderCockpit();

      // Erste Phase ankündigen
      if (scriptObj.phases && scriptObj.phases[0] && scriptObj.phases[0].topDialogueQuote) {
        if (window.SessionVoice && typeof window.SessionVoice.speak === 'function') {
          window.SessionVoice.speak(scriptObj.phases[0].topDialogueQuote, {
            priority: 'normal',
            tonality: liveState.tonality
          });
        }
      }
    },
    renderCockpit: renderCockpit,
    nextPhase: nextPhase,
    prevPhase: prevPhase,
    toggleDimmer: toggleDimmer,
    setBottomTrafficLight: setBottomTrafficLight,
    acknowledgeStatusCheck: acknowledgeStatusCheck,
    startVagusBreathing: startVagusBreathing,
    stopVagusBreathing: stopVagusBreathing,
    triageSub: triageSub,
    openFinalizeModal: openFinalizeModal,
    closeFinalizeModal: closeFinalizeModal,
    confirmFinalizeSession: confirmFinalizeSession,
    getState: function() {
      return Object.assign({}, liveState);
    }
  };

  window.SessionLive = api;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const el = document.getElementById('live-session-container');
      if (el) api.renderCockpit();
    });
  } else {
    const el = document.getElementById('live-session-container');
    if (el) api.renderCockpit();
  }

})(typeof window !== 'undefined' ? window : this);
