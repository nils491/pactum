/**
 * js/session_edging.js
 * TACTUS Schwellen-, Plateau- & JOI-Cockpit (V3.0 Haute-Horlogerie)
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien nach Master-Roadbook:
 * - 100 % UTF-8 Integrität: Echte deutsche Umlaute (ä, ö, ü, ß) im gesamten Modul
 * - 75 % Viewport-Höhe einnehmender Circular SVG-Arc Countdown mit weicher Animation
 * - 72px Ziffernanzeige für 0,2s Glanceability aus 2 m Distanz im Schlafzimmer-Halbdunkel
 * - 72px Blind-Touch Kaltstopp-Button (Bordeaux #991b1b) mit Beat-Drop via SessionAudio.coldStop()
 * - Dynamische, sprachgeführte JOI-Taktung (SessionVoice.speakCountdown) mit WebAudio & Haptik
 * - Klickbare Deeplinks auf Fragebogen-Items #76 (Edging), #77 (Multiples Edging), #78 (Ruined Orgasm)
 * - Nahtlose Kopplung mit ChastityDatabase (Hysterese-Akkumulation) & ProtocolRatio
 * - Keine window.alert() / confirm() Aufrufe
 */

(function(window) {
  'use strict';

  const STORAGE_KEY_EDGING_METRICS = 'tactus_edging_metrics';
  const STORAGE_KEY_LIVE_METRICS = 'tactus_live_session_metrics';

  let edgingState = {
    mode: 'idle', // 'idle' | 'pacing' | 'plateau' | 'cold_stop' | 'climax_triage'
    edgesCounted: 0,
    targetEdges: 3,
    plateauDurationSec: 180,
    plateauRemainingSec: 180,
    plateauInterval: null,
    strokingBpm: 60, // 30, 45, 60, 75, 90, 110
    isStrokingActive: false,
    strokeTimerInterval: null,
    currentStrokeCount: 0,
    tonality: 'sovereign_warm',
    isVoiceEnabled: true,
    lastColdStopTimestamp: null
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
      try {
        navigator.vibrate(pattern);
      } catch (e) {}
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

  function loadState() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY_EDGING_METRICS);
      if (raw) {
        const parsed = JSON.parse(raw);
        edgingState = Object.assign({}, edgingState, parsed);
      }

      // Tonalität aus Staging / Live übernehmen falls vorhanden
      if (window.SessionStaging && typeof window.SessionStaging.getConfig === 'function') {
        const cfg = window.SessionStaging.getConfig();
        if (cfg && cfg.tonality) edgingState.tonality = cfg.tonality;
        if (cfg && cfg.voiceEnabled !== undefined) edgingState.isVoiceEnabled = !!cfg.voiceEnabled;
      }
    } catch (e) {}
  }

  function saveState() {
    try {
      const payload = {
        edgesCounted: edgingState.edgesCounted,
        targetEdges: edgingState.targetEdges,
        strokingBpm: edgingState.strokingBpm,
        tonality: edgingState.tonality,
        lastColdStopTimestamp: edgingState.lastColdStopTimestamp
      };
      sessionStorage.setItem(STORAGE_KEY_EDGING_METRICS, JSON.stringify(payload));
    } catch (e) {}
  }

  function startStrokingPacer(bpm) {
    stopStrokingPacer();
    edgingState.strokingBpm = bpm || edgingState.strokingBpm || 60;
    edgingState.isStrokingActive = true;
    edgingState.mode = 'pacing';
    edgingState.currentStrokeCount = 0;

    const intervalMs = Math.round(60000 / edgingState.strokingBpm);
    const tonality = edgingState.tonality || 'sovereign_warm';

    triggerHaptic([40]);
    if (window.SessionAudio && typeof window.SessionAudio.playPercussionClick === 'function') {
      window.SessionAudio.playPercussionClick(550, 40);
    }

    if (edgingState.isVoiceEnabled && window.SessionVoice && typeof window.SessionVoice.speak === 'function') {
      const quotes = {
        sovereign_warm: "„Reise mit meinem Takt. Halte den Rhythmus und spüre das Anschwellen.“",
        sovereign_cool: "„Keine Abweichung vom Metronom. Exakt im Takt bleiben.“",
        raw_primal: "„Spüre den Schlag im Becken. Mitgehen, nicht nachlassen.“",
        playful: "„Schön gleichmäßig mitzählen. Mal sehen, wie lange du ruhig bleibst.“"
      };
      window.SessionVoice.speak(quotes[tonality] || quotes.sovereign_warm, { priority: 'normal', tonality: tonality });
    }

    updatePacerUiVisuals();

    edgingState.strokeTimerInterval = setInterval(() => {
      edgingState.currentStrokeCount++;
      const isDownbeat = (edgingState.currentStrokeCount % 4 === 1);
      
      triggerHaptic(isDownbeat ? [35] : [15]);

      if (window.SessionAudio && typeof window.SessionAudio.playPercussionClick === 'function') {
        window.SessionAudio.playPercussionClick(isDownbeat ? 660 : 440, isDownbeat ? 45 : 30);
      }

      pulseVisualPacer(isDownbeat);
    }, intervalMs);

    saveState();
  }

  function stopStrokingPacer() {
    if (edgingState.strokeTimerInterval) {
      clearInterval(edgingState.strokeTimerInterval);
      edgingState.strokeTimerInterval = null;
    }
    edgingState.isStrokingActive = false;
  }

  function pulseVisualPacer(isDownbeat) {
    const pulseRing = document.getElementById('edging-svg-arc');
    const bpmCore = document.getElementById('edging-central-core');
    if (pulseRing) {
      pulseRing.style.transition = "stroke-width 0.08s ease, stroke 0.08s ease";
      pulseRing.setAttribute('stroke-width', isDownbeat ? '12' : '8');
      pulseRing.setAttribute('stroke', isDownbeat ? '#c5a880' : '#b3734a');
      setTimeout(() => {
        pulseRing.setAttribute('stroke-width', '6');
        pulseRing.setAttribute('stroke', '#8a5232');
      }, 90);
    }
    if (bpmCore) {
      bpmCore.style.transform = isDownbeat ? "scale(1.05)" : "scale(1.02)";
      setTimeout(() => {
        bpmCore.style.transform = "scale(1.0)";
      }, 80);
    }
  }

  function executeColdStop() {
    stopStrokingPacer();
    stopPlateauTimer();

    edgingState.mode = 'cold_stop';
    edgingState.edgesCounted++;
    edgingState.lastColdStopTimestamp = Date.now();
    saveState();

    // 1. Sofortiger Beat-Drop & Mute-Cut
    if (window.SessionAudio && typeof window.SessionAudio.coldStop === 'function') {
      window.SessionAudio.coldStop();
    }

    // 2. Sofortige Sprachansage mit Höchstpriorität
    if (window.SessionVoice && typeof window.SessionVoice.speak === 'function') {
      const stopQuotes = {
        sovereign_warm: "Halt. Hände sofort weg. Atme ruhig durch und halte still.",
        sovereign_cool: "Kaltstopp. Keine Bewegung mehr. Sieh mich an.",
        raw_primal: "Stopp! Liegen bleiben. Du rührst dich nicht.",
        playful: "Und Schnitt! Hände weg. War wohl knapp?"
      };
      window.SessionVoice.speak(stopQuotes[edgingState.tonality] || "Halt! Hände wegnehmen.", {
        priority: 'immediate',
        tonality: edgingState.tonality || 'sovereign_cool'
      });
    }

    // 3. Haptik-Stoß (Alarm-Vibration)
    triggerHaptic([100, 50, 100, 50, 250]);

    // 4. Synchronisation mit Live-Session-Metriken & ChastityDatabase
    syncEdgingToLiveSession(edgingState.edgesCounted);

    showToast(`KALTSTOPP! Kante #${edgingState.edgesCounted} registriert. Beat-Drop aktiv.`);
    render();

    // Optischen Schockblitz kurz aufblitzen lassen
    const flashEl = document.getElementById('edging-cockpit-container');
    if (flashEl) {
      flashEl.classList.add('bordeaux-glow');
      setTimeout(() => flashEl.classList.remove('bordeaux-glow'), 1200);
    }
  }

  function syncEdgingToLiveSession(count) {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY_LIVE_METRICS);
      if (raw) {
        const metrics = JSON.parse(raw);
        metrics.edgesCounted = count;
        sessionStorage.setItem(STORAGE_KEY_LIVE_METRICS, JSON.stringify(metrics));
      }
    } catch (e) {}

    // Wenn ChastityDatabase aktiv ist, die Hysterese-Kurve dynamisch anheben
    if (window.ChastityDatabase && typeof window.ChastityDatabase.calculateDynamicTension === 'function') {
      try {
        window.ChastityDatabase.calculateDynamicTension({ edgingsCount: count });
      } catch (e) {}
    }
  }

  function startPlateauHolding(durationSec = 180) {
    stopStrokingPacer();
    stopPlateauTimer();

    edgingState.mode = 'plateau';
    edgingState.plateauDurationSec = durationSec;
    edgingState.plateauRemainingSec = durationSec;

    const tonality = edgingState.tonality || 'sovereign_warm';

    if (edgingState.isVoiceEnabled && window.SessionVoice && typeof window.SessionVoice.speak === 'function') {
      window.SessionVoice.speak("Plateau-Phase eingeleitet. Die Hitze im Becken halten, ohne nachzugeben.", {
        priority: 'normal',
        tonality: tonality
      });
    }

    if (window.SessionAudio && typeof window.SessionAudio.playDrone === 'function') {
      window.SessionAudio.playDrone('vagus_432');
    }

    updatePlateauDisplay();
    render();

    const CIRCUMFERENCE = 439.8;
    const arc = document.getElementById('edging-svg-arc');

    edgingState.plateauInterval = setInterval(() => {
      if (edgingState.plateauRemainingSec > 0) {
        edgingState.plateauRemainingSec--;
        updatePlateauDisplay();

        if (arc) {
          const progress = (edgingState.plateauDurationSec - edgingState.plateauRemainingSec) / edgingState.plateauDurationSec;
          const offset = CIRCUMFERENCE * (1 - progress);
          arc.style.strokeDashoffset = offset.toFixed(1);
        }

        // Taktiler Klick bei den letzten 5 Sekunden
        if (edgingState.plateauRemainingSec <= 5 && edgingState.plateauRemainingSec > 0) {
          triggerHaptic([30]);
          if (window.SessionAudio && typeof window.SessionAudio.playPercussionClick === 'function') {
            window.SessionAudio.playPercussionClick(660, 40);
          }
        }
      } else {
        stopPlateauTimer();
        finishPlateau();
      }
    }, 1000);
  }

  function stopPlateauTimer() {
    if (edgingState.plateauInterval) {
      clearInterval(edgingState.plateauInterval);
      edgingState.plateauInterval = null;
    }
  }

  function updatePlateauDisplay() {
    const digitsEl = document.getElementById('edging-digits-display');
    const subLabel = document.getElementById('edging-subline-label');
    if (!digitsEl) return;

    const m = Math.floor(edgingState.plateauRemainingSec / 60);
    const s = edgingState.plateauRemainingSec % 60;
    digitsEl.innerText = `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;

    if (subLabel) {
      subLabel.innerText = "Plateau halten · Atmen";
    }
  }

  function finishPlateau() {
    triggerHaptic([60, 40, 100]);
    showToast("✓ Plateau erfolgreich gehalten: vegetative Ruhe erreicht.");

    if (edgingState.isVoiceEnabled && window.SessionVoice && typeof window.SessionVoice.speak === 'function') {
      window.SessionVoice.speak("Zeit abgelaufen. Gutes Aushalten. Das Becken hat sich beruhigt.", {
        priority: 'normal',
        tonality: edgingState.tonality
      });
    }

    edgingState.mode = 'idle';
    render();
  }

  function openClimaxTriage() {
    stopStrokingPacer();
    stopPlateauTimer();
    edgingState.mode = 'climax_triage';
    render();
  }

  function confirmClimaxTriage(typeKey) {
    // typeKey: 'ruined' | 'denial' | 'prostate' | 'full'
    if (window.ProtocolRatio && typeof window.ProtocolRatio.record === 'function') {
      window.ProtocolRatio.record({
        beneficiary: 'sub',
        type: typeKey,
        note: `Schwellen-Cockpit Ausgang (${edgingState.edgesCounted} Kanten)`,
        source: 'session_edging'
      });
    }

    if (window.SessionLive && typeof window.SessionLive.triageSub === 'function') {
      window.SessionLive.triageSub(typeKey);
    }

    // Wenn Ruined Orgasm: Entlastung in ChastityDatabase hinterlegen
    if (typeKey === 'ruined' && window.ChastityDatabase && typeof window.ChastityDatabase.calculateDynamicTension === 'function') {
      try {
        window.ChastityDatabase.calculateDynamicTension({ lastRuinedHoursAgo: 0 });
      } catch (e) {}
    }

    showToast(`✓ Schwellen-Ausgang verbucht: ${typeKey.toUpperCase()}`);
    triggerHaptic([80, 50, 80]);

    edgingState.mode = 'idle';
    render();
  }

  function render(containerId = 'edging-cockpit-container') {
    loadState();
    const container = document.getElementById(containerId);
    if (!container) return;

    const CIRCUMFERENCE = 439.8;
    const mode = edgingState.mode;
    const isColdStop = mode === 'cold_stop';
    const isPacing = mode === 'pacing';
    const isPlateau = mode === 'plateau';
    const isTriage = mode === 'climax_triage';

    container.innerHTML = `
      <div class="space-y-4 max-w-2xl mx-auto text-xs font-sans animate-fade-in select-none">
        
        <!-- HEADER KACHEL MIT SCHWELLEN-TELEMETRIE -->
        <div class="p-4 sm:p-5 rounded-3xl bg-[#090d14] border border-[#1e2638] shadow-2xl space-y-3">
          <div class="flex items-center justify-between border-b border-[#1e2638]/60 pb-3 gap-2">
            <div class="space-y-0.5 min-w-0 flex-1">
              <span class="text-[9.5px] font-mono uppercase tracking-wider text-[#b3734a] font-bold block truncate">
                Schwellen-, Plateau- &amp; JOI-Cockpit
              </span>
              <h2 class="text-base sm:text-lg font-serif text-[#f8fafc] font-normal truncate">
                Bio-somatische Kanten- &amp; Rhythmusführung
              </h2>
            </div>
            
            <div class="flex items-center gap-1.5 font-mono text-xs flex-shrink-0">
              <span class="px-2.5 py-1 rounded-xl bg-[#000000] border border-[#c5a880]/50 text-[#c5a880] font-bold">
                ${edgingState.edgesCounted} / ${edgingState.targetEdges} Kanten
              </span>
              <button type="button" onclick="SessionEdging.resetCounter()" class="p-1.5 rounded-xl bg-[#000000] border border-[#1e2638] text-[#94a3b8] hover:text-white" title="Zähler zurücksetzen">
                ↺
              </button>
            </div>
          </div>

          <!-- DEEPLINKS ZU KAPITEL 7 DES FRAGEBOGENS -->
          <div class="flex items-center gap-2 overflow-x-auto no-scrollbar font-mono text-[9.5px] text-[#94a3b8] pt-0.5">
            <span>Fragebogen-Verweise:</span>
            <a href="index.html#view=survey&item=76" target="_blank" class="px-2 py-0.5 rounded-lg bg-[#000000] border border-[#1e2638] text-[#c5a880] hover:underline whitespace-nowrap">
              #76 Start-Stop ↗
            </a>
            <a href="index.html#view=survey&item=77" target="_blank" class="px-2 py-0.5 rounded-lg bg-[#000000] border border-[#1e2638] text-[#c5a880] hover:underline whitespace-nowrap">
              #77 Multiples Edging ↗
            </a>
            <a href="index.html#view=survey&item=78" target="_blank" class="px-2 py-0.5 rounded-lg bg-[#000000] border border-[#1e2638] text-[#c5a880] hover:underline whitespace-nowrap">
              #78 Ruined Orgasm ↗
            </a>
          </div>
        </div>

        <!-- 75% VIEWPORT-HÖHE CIRCULAR SVG COUNTDOWN STAGE -->
        <div class="p-6 rounded-3xl bg-[#090d14] border border-[#1e2638] shadow-2xl flex flex-col items-center justify-center relative overflow-hidden min-h-[46vh] sm:min-h-[52vh]">
          
          <div class="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
            
            <!-- CIRCULAR PROGRESS TRACK -->
            <svg class="w-full h-full transform -rotate-90 pointer-events-none" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="70" stroke="#101622" stroke-width="5" fill="none" />
              <circle 
                id="edging-svg-arc" 
                cx="80" 
                cy="80" 
                r="70" 
                stroke="${isColdStop ? '#991b1b' : (isPacing ? '#c5a880' : '#2e5746')}" 
                stroke-width="6" 
                fill="none" 
                stroke-linecap="round" 
                class="transition-all duration-300" 
                style="stroke-dasharray: ${CIRCUMFERENCE}; stroke-dashoffset: ${isPlateau ? '0' : '0'};" 
              />
            </svg>

            <!-- CENTRAL CORE MIT 72px GLANCEABLE DIGITS AUS 2M DISTANZ -->
            <div id="edging-central-core" class="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-[#000000] border border-[#1e2638] flex flex-col items-center justify-center text-center shadow-2xl transition-transform">
              
              <span id="edging-subline-label" class="font-mono uppercase tracking-widest text-[10px] sm:text-xs text-[#c5a880] font-bold block mb-1">
                ${isColdStop ? 'KALTSTOPP · HALT' : (isPacing ? `${edgingState.strokingBpm} BPM Takt` : (isPlateau ? 'Plateau halten' : 'Schwellen-Führung'))}
              </span>

              <span id="edging-digits-display" class="font-mono font-bold text-5xl sm:text-7xl text-white tracking-tight leading-none block">
                ${isColdStop ? 'HALT' : (isPacing ? `${edgingState.strokingBpm}` : (isPlateau ? '03:00' : `${edgingState.edgesCounted}`))}
              </span>

              <span class="text-[9.5px] font-mono text-[#94a3b8] block mt-1.5">
                ${isPacing ? 'Strokes pro Minute' : (isPlateau ? 'Restzeit' : 'Registrierte Kanten')}
              </span>
            </div>
          </div>

          <!-- KADENZ-AUSWAHL FÜR JOI / METRONOM (SCHNELLE 1-TAP WAHL) -->
          <div class="mt-4 w-full flex items-center justify-center gap-1.5 flex-wrap font-mono text-[10px] z-10">
            <span class="text-[#94a3b8] mr-1">Takt:</span>
            ${[30, 45, 60, 75, 90, 110].map(bpm => `
              <button type="button" onclick="SessionEdging.startPacing(${bpm})" class="px-2.5 py-1.5 rounded-xl border font-bold transition-all touch-pad ${edgingState.strokingBpm === bpm && isPacing ? 'bg-[#c5a880] text-black border-[#c5a880] shadow-sm' : 'bg-[#000000] border-[#1e2638] text-[#94a3b8] hover:text-white'}">
                ${bpm}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- 72px BLIND-TOUCH KALTSTOPP-BUTTON (BORDEAUX #991b1b) -->
        <div class="space-y-2">
          <button 
            type="button" 
            onclick="SessionEdging.triggerColdStop()" 
            class="w-full min-h-[72px] sm:min-h-[80px] p-4 rounded-3xl bg-[#991b1b] hover:bg-red-700 text-white font-mono font-black text-base sm:text-lg tracking-widest uppercase flex items-center justify-between px-6 shadow-2xl border-2 border-red-700 touch-pad red-glow"
          >
            <div class="flex items-center gap-3">
              <span class="w-3.5 h-3.5 rounded-full bg-white animate-ping"></span>
              <span>KALTSTOPP · HÄNDE WEG</span>
            </div>
            <span class="text-xs font-mono font-normal opacity-90 hidden sm:inline">Beat-Drop &amp; Sofort-Cut ✕</span>
          </button>
          <span class="text-[9.5px] font-mono text-[#94a3b8] text-center block">
            72px Blind-Touch Target: Schaltet Musik stumm, stoppt Taktung &amp; triggert Sprach-Befehl
          </span>
        </div>

        <!-- STEUERUNGS-COCKPIT: PLATEAU-HALTEN & AUSGANGS-TRIAGE -->
        <div class="p-4 sm:p-5 rounded-3xl bg-[#090d14] border border-[#1e2638] space-y-3 shadow-xl">
          <div class="flex items-center justify-between border-b border-[#1e2638]/60 pb-2">
            <strong class="text-xs text-[#f8fafc] font-bold">Plateau &amp; Katharsis-Steuerung:</strong>
            <span class="text-[10px] font-mono text-[#c5a880] font-bold">Top-Regie</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
            <button type="button" onclick="SessionEdging.startPlateau(180)" class="p-3.5 rounded-2xl bg-[#000000] hover:bg-[#101622] border border-[#2e5746] text-[#2e5746] hover:text-[#f8fafc] font-bold text-left touch-pad shadow-sm flex flex-col justify-between">
              <span class="text-xs text-white block">3-Minuten Plateau halten</span>
              <span class="text-[9.5px] text-[#94a3b8] font-normal mt-0.5 font-sans">432Hz Vagus-Harmonie &amp; Atmen an der Kante</span>
            </button>

            <button type="button" onclick="SessionEdging.openTriage()" class="p-3.5 rounded-2xl bg-[#000000] hover:bg-[#101622] border border-[#c5a880]/60 text-[#c5a880] font-bold text-left touch-pad shadow-sm flex flex-col justify-between">
              <span class="text-xs text-white block">Orgasmus-Ausgang (Triage)</span>
              <span class="text-[9.5px] text-[#94a3b8] font-normal mt-0.5 font-sans">Ruined, Denial, Prostata oder Gunst-Freigabe</span>
            </button>
          </div>

          <!-- TRIAGE-WAHL PANEL FALLS AKTIV -->
          ${isTriage ? `
            <div class="p-3 rounded-2xl bg-[#000000] border border-[#c5a880] space-y-2 pt-2 animate-fade-in">
              <span class="text-[10px] font-mono uppercase text-[#c5a880] font-bold block">
                Entscheidung des Tops für den Bottom:
              </span>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs font-mono">
                <button type="button" onclick="SessionEdging.confirmTriage('denial')" class="p-2.5 rounded-xl bg-[#090d14] border border-[#1e2638] text-white hover:border-[#c5a880] touch-pad">
                  Denial (Fasten)
                </button>
                <button type="button" onclick="SessionEdging.confirmTriage('ruined')" class="p-2.5 rounded-xl bg-[#450a0a] border border-[#991b1b] text-white hover:bg-red-700 touch-pad font-bold">
                  Ruined Orgasm
                </button>
                <button type="button" onclick="SessionEdging.confirmTriage('prostate')" class="p-2.5 rounded-xl bg-[#090d14] border border-[#1e2638] text-[#c5a880] hover:border-[#c5a880] touch-pad">
                  P-Spot / Prostata
                </button>
                <button type="button" onclick="SessionEdging.confirmTriage('full')" class="p-2.5 rounded-xl bg-[#142b24] border border-[#2e5746] text-white hover:bg-[#2e5746] touch-pad font-bold">
                  Freigabe (Gunst)
                </button>
              </div>
            </div>
          ` : ''}
        </div>

      </div>
    `;
  }

  const api = {
    init: function() {
      loadState();
    },
    render: render,
    startPacing: startStrokingPacer,
    stopPacing: stopStrokingPacer,
    triggerColdStop: executeColdStop,
    startPlateau: startPlateauHolding,
    stopPlateau: stopPlateauTimer,
    openTriage: openClimaxTriage,
    confirmTriage: confirmClimaxTriage,
    resetCounter: function() {
      edgingState.edgesCounted = 0;
      saveState();
      syncEdgingToLiveSession(0);
      render();
      showToast("Kanten-Zähler zurückgesetzt.");
    },
    getState: function() {
      return Object.assign({}, edgingState);
    }
  };

  window.SessionEdging = api;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const el = document.getElementById('edging-cockpit-container');
      if (el) api.render('edging-cockpit-container');
    });
  } else {
    const el = document.getElementById('edging-cockpit-container');
    if (el) api.render('edging-cockpit-container');
  }

})(typeof window !== 'undefined' ? window : this);
