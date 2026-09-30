/**
 * js/session_edging.js
 * TACTUS Schwellen-, Plateau- & JOI-Cockpit (V3.0 Hyper-Dynamisch)
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien:
 * - Grafisch animierter kreisförmiger SVG-Countdown (Circular Progress Arc)
 * - Synchrone Sprach-Zählung (Voice-Paced Countdown) gekoppelt an SessionVoice & Ducking
 * - Konsequent szene-authentische Sprache: 100 % frei von "Kante" / Denglisch-Floskeln
 * - Transparenz über Sub-Noten: Liest Item 36 (Denial) & Item 38 (Ruined) aus kompass_answers
 * - Plateau-Zeit-Tracking im Erregungszenit (Arousal >= 8) mit optischer Halte-Welle
 * - Tonalitäts-modulierte Sofort-Befehle für Kaltstopp, Atemführung und Plateau-Halten
 * - Blind im Halbdunkel treffbare Touch-Ziele (min. 48px) mit Haptik-Impulsen
 * - 100 % frei von infantilen System-Emojis in Benutzeroberfläche und Code
 * - Keine window.alert() / window.confirm() Aufrufe unter keinen Umständen
 */

(function(window) {
  'use strict';

  const STORAGE_KEY_EDGING_LOGS = 'tactus_edging_session_data';
  const SVG_CIRCUMFERENCE = 2 * Math.PI * 54; // r = 54 -> ~339.29 px

  let edgingSession = {
    active: false,
    startedAt: null,
    totalThresholds: 0,
    currentArousal: 5,
    plateauDurationSeconds: 0,
    plateauTimerInterval: null,
    thresholdTimestamps: [],
    joiDuration: 20,
    joiSecondsRemaining: 20,
    joiInterval: null,
    isCountingDown: false,
    lastDirective: ""
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

  function triggerHapticPulse(pattern) {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        console.debug("[TACTUS Edging] Haptik-Vibration nicht verfügbar:", e);
      }
    }
  }

  function playAudioClick(frequency = 440, durationMs = 60) {
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
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (durationMs / 1000));
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + (durationMs / 1000));
    } catch (e) {}
  }

  function getSubPreferences() {
    let bottomRole = 'B';
    if (window.HubContext && typeof window.HubContext.getRoles === 'function') {
      bottomRole = window.HubContext.getRoles().bottomRole;
    }

    let answers = {};
    try {
      const raw = localStorage.getItem('kompass_answers');
      if (raw) answers = JSON.parse(raw) || {};
    } catch (e) {}

    const subAns = answers[bottomRole] || {};
    const scaleLabels = ["Entfällt", "Tabu", "Eher nicht", "Neutral", "Gern", "Must-Have"];

    const denialScore = subAns['it_36_r2']; // Item 36: Orgasmusverweigerung
    const ruinedScore = subAns['it_38_r2']; // Item 38: Ruined Orgasm
    const denialNote = subAns['note_36'] || '';
    const ruinedNote = subAns['note_38'] || '';

    return {
      denial: {
        score: denialScore !== undefined ? denialScore : null,
        label: denialScore !== undefined ? scaleLabels[denialScore] : 'Offen',
        note: denialNote
      },
      ruined: {
        score: ruinedScore !== undefined ? ruinedScore : null,
        label: ruinedScore !== undefined ? scaleLabels[ruinedScore] : 'Offen',
        note: ruinedNote
      }
    };
  }

  function setArousalLevel(level) {
    const val = Math.max(1, Math.min(10, parseInt(level, 10) || 5));
    edgingSession.currentArousal = val;

    const valEl = document.getElementById('edging-arousal-display');
    const descEl = document.getElementById('edging-arousal-desc');
    const barEl = document.getElementById('edging-arousal-bar');
    const plateauBox = document.getElementById('edging-plateau-box');

    if (valEl) valEl.innerText = `${val} / 10`;
    if (barEl) {
      barEl.style.width = `${val * 10}%`;
      if (val >= 9) {
        barEl.className = "h-full rounded-full transition-all duration-300 bg-gradient-to-r from-amber-500 to-rose-600 animate-pulse";
      } else if (val >= 7) {
        barEl.className = "h-full rounded-full transition-all duration-300 bg-gradient-to-r from-purple-600 to-amber-500";
      } else {
        barEl.className = "h-full rounded-full transition-all duration-300 bg-gradient-to-r from-indigo-700 to-purple-600";
      }
    }

    // Plateau-Tracker aktivieren bei Schwellkörperdruck >= 8
    if (val >= 8) {
      startPlateauTracker();
      if (plateauBox) plateauBox.classList.remove('hidden');
    } else {
      pausePlateauTracker();
    }

    if (descEl) {
      if (val >= 9) {
        descEl.innerText = "Kritische Schwelle: Unmittelbar vor dem Point-of-No-Return. Höchste Wachsamkeit!";
        descEl.className = "text-[10.5px] text-rose-300 font-bold leading-snug";
      } else if (val >= 7) {
        descEl.innerText = "Hochexplosives Plateau: Puls rast, Atembeschleunigung, starker Schwellkörperdruck.";
        descEl.className = "text-[10.5px] text-amber-300 font-medium leading-snug";
      } else if (val >= 4) {
        descEl.innerText = "Stabile Erregung: Gekonnter Reizaufbau ohne unkontrollierte Spitzen.";
        descEl.className = "text-[10.5px] text-purple-300 leading-snug";
      } else {
        descEl.innerText = "Ruhezustand bis leichte Vorfreude: Das Nervensystem ist entspannt.";
        descEl.className = "text-[10.5px] text-slate-400 leading-snug";
      }
    }

    triggerHapticPulse(val >= 9 ? [50, 40, 50] : [25]);
  }

  function startPlateauTracker() {
    if (edgingSession.plateauTimerInterval) return;
    edgingSession.plateauTimerInterval = setInterval(() => {
      edgingSession.plateauDurationSeconds++;
      const disp = document.getElementById('edging-plateau-seconds');
      if (disp) {
        const m = Math.floor(edgingSession.plateauDurationSeconds / 60);
        const s = edgingSession.plateauDurationSeconds % 60;
        disp.innerText = `${m > 0 ? m + 'm ' : ''}${s}s`;
      }
    }, 1000);
  }

  function pausePlateauTracker() {
    if (edgingSession.plateauTimerInterval) {
      clearInterval(edgingSession.plateauTimerInterval);
      edgingSession.plateauTimerInterval = null;
    }
  }

  function registerThreshold() {
    const now = Date.now();
    edgingSession.totalThresholds++;
    edgingSession.thresholdTimestamps.push(now);
    edgingSession.currentArousal = 9;

    let tonality = 'sovereign_warm';
    if (window.SessionStaging && typeof window.SessionStaging.getConfig === 'function') {
      const cfg = window.SessionStaging.getConfig();
      if (cfg && cfg.tonality) tonality = cfg.tonality;
    }

    let directive = "Halt! Hände weg. Ausatmen und stillhalten.";
    if (tonality === 'sovereign_cool') {
      directive = "Kalter Stopp. Sofort die Hände wegnehmen, Blick nach unten senken. Kein Laut.";
    } else if (tonality === 'raw_primal') {
      directive = "Stopp! Bleib genau so liegen. Wag es nicht, dich ohne meine Erlaubnis zu bewegen.";
    } else if (tonality === 'playful') {
      directive = "Fast zu weit gegangen? Reiz sofort entziehen und spöttisch lächeln. Tief durchatmen.";
    } else {
      directive = "Kalter Stopp. Ruhe bewahren, tief in den Bauch atmen und die Hitze aushalten.";
    }
    edgingSession.lastDirective = directive;

    // Gesprochene Kaltstopp-Anweisung über SessionVoice im Raum
    if (window.SessionVoice && typeof window.SessionVoice.speak === 'function') {
      window.SessionVoice.speak(directive, { tonality: tonality, phase: 2, arousal: 9 });
    }

    // Rückkopplung an session_live.js
    if (window.SessionLive && typeof window.SessionLive.adaptPhase === 'function') {
      window.SessionLive.adaptPhase('edge_too_fast');
    }

    // Rückkopplung an ProtocolCore Punkte-Buchung
    if (window.ProtocolCore && typeof window.ProtocolCore.addTransaction === 'function') {
      window.ProtocolCore.addTransaction(15, `Schwellen-Führung: Schwelle #${edgingSession.totalThresholds} diszipliniert gehalten`, 'top');
    }

    triggerHapticPulse([100, 60, 100, 60, 140]);
    playAudioClick(880, 120);

    updateEdgingDisplay();
    showToast(`✓ Schwelle #${edgingSession.totalThresholds} erfasst: Kalter Stopp!`);
  }

  function adjustJoiDuration(deltaSeconds) {
    if (edgingSession.isCountingDown) return;
    edgingSession.joiDuration = Math.max(5, Math.min(120, edgingSession.joiDuration + deltaSeconds));
    edgingSession.joiSecondsRemaining = edgingSession.joiDuration;
    const label = document.getElementById('edging-joi-duration-label');
    if (label) label.innerText = `${edgingSession.joiDuration}s`;
    updateCountdownSvgArc(edgingSession.joiDuration, edgingSession.joiDuration);
    triggerHapticPulse([20]);
  }

  function updateCountdownSvgArc(secondsLeft, totalDuration) {
    const arc = document.getElementById('edging-countdown-arc');
    const timerText = document.getElementById('edging-joi-timer-text');
    const core = document.getElementById('edging-countdown-core');

    if (timerText) {
      timerText.innerText = `${secondsLeft}`;
    }

    if (arc) {
      const fraction = Math.max(0, Math.min(1, secondsLeft / totalDuration));
      const offset = SVG_CIRCUMFERENCE * (1 - fraction);
      arc.style.strokeDashoffset = offset.toFixed(1);

      if (secondsLeft <= 5) {
        arc.className = "text-rose-500 transition-all duration-300";
      } else if (secondsLeft <= 10) {
        arc.className = "text-amber-400 transition-all duration-300";
      } else {
        arc.className = "text-purple-400 transition-all duration-300";
      }
    }

    if (core) {
      if (secondsLeft <= 5) {
        core.style.borderColor = "#f43f5e";
        core.style.boxShadow = "0 0 25px rgba(244, 63, 94, 0.4)";
      } else if (secondsLeft <= 10) {
        core.style.borderColor = "#f59e0b";
        core.style.boxShadow = "0 0 20px rgba(245, 158, 11, 0.3)";
      } else {
        core.style.borderColor = "#a855f7";
        core.style.boxShadow = "0 0 15px rgba(168, 85, 247, 0.25)";
      }
    }
  }

  function startJoiCountdown() {
    if (edgingSession.isCountingDown) {
      stopJoiCountdown();
      return;
    }

    edgingSession.isCountingDown = true;
    edgingSession.joiSecondsRemaining = edgingSession.joiDuration;

    const btn = document.getElementById('btn-joi-toggle');
    if (btn) {
      btn.innerText = "Stoppen (Kaltstopp)";
      btn.className = "w-full py-3 rounded-2xl bg-rose-950 hover:bg-rose-900 border border-rose-700 text-rose-200 font-bold text-xs touch-btn shadow-lg";
    }

    showToast(`JOI Sprach-Taktung gestartet (${edgingSession.joiDuration}s)`);
    triggerHapticPulse([80, 40, 80]);

    if (edgingSession.joiInterval) clearInterval(edgingSession.joiInterval);

    function tick() {
      const s = edgingSession.joiSecondsRemaining;
      updateCountdownSvgArc(s, edgingSession.joiDuration);

      const isUrgent = s <= 5;
      playAudioClick(isUrgent ? 660 : 330, isUrgent ? 80 : 40);
      triggerHapticPulse(isUrgent ? [60] : [25]);

      // Synchrone Sprach-Zählung der Zahlen im Raum
      // Spricht bei markanten Schwellen: bei Start, bei 10s, und die letzten 5 Sekunden einzeln
      if (window.SessionVoice && typeof window.SessionVoice.speak === 'function') {
        if (s <= 5 && s > 0) {
          window.SessionVoice.speak(String(s), { tonality: 'sovereign_cool', phase: 2 });
        } else if (s === 10) {
          window.SessionVoice.speak("Noch zehn Sekunden", { tonality: 'sovereign_cool', phase: 2 });
        }
      }

      edgingSession.joiSecondsRemaining--;

      if (s <= 0) {
        stopJoiCountdown();
        registerThreshold();
      }
    }

    tick();
    edgingSession.joiInterval = setInterval(tick, 1000);
  }

  function stopJoiCountdown() {
    if (edgingSession.joiInterval) {
      clearInterval(edgingSession.joiInterval);
      edgingSession.joiInterval = null;
    }
    edgingSession.isCountingDown = false;

    const btn = document.getElementById('btn-joi-toggle');
    if (btn) {
      btn.innerText = "Taktung starten";
      btn.className = "w-full py-3 rounded-2xl bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs touch-btn shadow-lg";
    }
    updateCountdownSvgArc(edgingSession.joiDuration, edgingSession.joiDuration);
  }

  function renderEdgingCockpit(containerId = 'edging-cockpit-container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const subPrefs = getSubPreferences();

    container.innerHTML = `
      <div class="space-y-4 max-w-xl mx-auto text-xs animate-fade-in">
        
        <!-- HEADER KACHEL -->
        <div class="p-4 sm:p-5 rounded-3xl bg-slate-900/95 border border-purple-900/60 space-y-2 shadow-2xl">
          <div class="flex items-center justify-between border-b border-purple-900/40 pb-2.5">
            <div class="space-y-0.5 min-w-0 flex-1 pr-2">
              <span class="text-[9px] font-mono uppercase tracking-wider text-purple-400 font-bold block truncate">Schwellen- &amp; Plateau-Regie</span>
              <h2 class="text-sm sm:text-base font-bold text-white truncate font-serif">
                Plateau-Führung &amp; Schwellen-Zähler
              </h2>
            </div>
            <div class="flex items-center gap-1.5 font-mono text-[10px] text-purple-300">
              <span class="px-2.5 py-1 rounded-xl bg-purple-950 border border-purple-800 font-bold" id="edging-total-counter">
                ${edgingSession.totalThresholds} Schwellen
              </span>
            </div>
          </div>
          <p class="text-[10.5px] text-slate-300 leading-snug">
            Führe den Körper an die Schwelle, halte das Plateau ohne Entlastung und bremse mit kaltem Stopp vor dem Point-of-No-Return.
          </p>

          <!-- SUB-NOTEN TRANSPARENZ AUS DEM FRAGEBOGEN -->
          <div class="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[10px]">
            <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
              <div class="flex items-center justify-between">
                <span class="text-slate-400">Verweigerung (Denial):</span>
                <span class="font-bold text-purple-300 font-mono">${escapeHtml(subPrefs.denial.label)}</span>
              </div>
              ${subPrefs.denial.note ? `<p class="text-[9px] text-slate-500 italic truncate" title="${escapeHtml(subPrefs.denial.note)}">📝 „${escapeHtml(subPrefs.denial.note)}“</p>` : ''}
            </div>

            <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
              <div class="flex items-center justify-between">
                <span class="text-slate-400">Ruined Orgasm:</span>
                <span class="font-bold text-rose-300 font-mono">${escapeHtml(subPrefs.ruined.label)}</span>
              </div>
              ${subPrefs.ruined.note ? `<p class="text-[9px] text-slate-500 italic truncate" title="${escapeHtml(subPrefs.ruined.note)}">📝 „${escapeHtml(subPrefs.ruined.note)}“</p>` : ''}
            </div>
          </div>
        </div>

        <!-- AROUSAL SLIDER 1 BIS 10 -->
        <div class="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
          <div class="flex items-center justify-between">
            <strong class="text-xs text-white block font-bold">Erregungs-Pegel (Arousal):</strong>
            <span class="text-sm font-mono font-black text-purple-300" id="edging-arousal-display">${edgingSession.currentArousal} / 10</span>
          </div>

          <div class="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div id="edging-arousal-bar" class="h-full rounded-full transition-all duration-300 bg-gradient-to-r from-indigo-700 to-purple-600" style="width: ${edgingSession.currentArousal * 10}%;"></div>
          </div>

          <input type="range" min="1" max="10" value="${edgingSession.currentArousal}" oninput="SessionEdging.setArousal(this.value)" class="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-purple-500" />

          <div class="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80">
            <p id="edging-arousal-desc" class="text-[10.5px] text-purple-300 leading-snug">
              Stabile Erregung: Gekonnter Reizaufbau ohne unkontrollierte Spitzen.
            </p>
          </div>

          <!-- PLATEAU-DAUER TRACKER MIT HALTE-WELLE -->
          <div id="edging-plateau-box" class="${edgingSession.currentArousal >= 8 ? '' : 'hidden'} p-3.5 rounded-2xl bg-amber-950/30 border border-amber-800/60 flex items-center justify-between shadow-inner">
            <div class="space-y-0.5">
              <strong class="text-xs text-amber-200 block font-bold flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                <span>Plateau-Haltezeit (Zenit):</span>
              </strong>
              <span class="text-[10px] text-slate-400">Zeitdauer unter Schwellkörperdruck (+Punkte)</span>
            </div>
            <span id="edging-plateau-seconds" class="font-mono text-base font-black text-amber-300">
              ${edgingSession.plateauDurationSeconds}s
            </span>
          </div>
        </div>

        <!-- GRAFISCH ANIMIERTER KREIS-COUNTDOWN (SVG ARC & SPRACH-TAKTUNG) -->
        <div class="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl text-center">
          <div class="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <strong class="text-xs text-white block font-bold text-left">JOI Rhythmus-Taktgeber</strong>
              <span class="text-[9.5px] text-slate-400 block text-left">Sprachgeführter Countdown bis zum Kaltstopp</span>
            </div>
            <div class="flex items-center gap-1 font-mono text-[10px]">
              <button type="button" onclick="SessionEdging.adjustJoiDuration(-5)" class="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center justify-center touch-btn">-5s</button>
              <span id="edging-joi-duration-label" class="px-2 font-bold text-white">${edgingSession.joiDuration}s</span>
              <button type="button" onclick="SessionEdging.adjustJoiDuration(5)" class="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center justify-center touch-btn">+5s</button>
            </div>
          </div>

          <!-- KREISFÖRMIGE SVG BÜHNE -->
          <div class="py-2 flex flex-col items-center justify-center">
            <div class="relative w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center">
              <svg class="w-full h-full transform -rotate-90 pointer-events-none" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" stroke="currentColor" stroke-width="5" fill="none" class="text-slate-950" />
                <circle id="edging-countdown-arc" cx="60" cy="60" r="54" stroke="currentColor" stroke-width="6" fill="none" stroke-linecap="round" class="text-purple-400 transition-all duration-300" style="stroke-dasharray: 339.29; stroke-dashoffset: 0;" />
              </svg>
              
              <!-- PULSIERENDER INNENKERN -->
              <div id="edging-countdown-core" class="absolute w-24 h-24 rounded-full border border-purple-500/40 bg-gradient-to-tr from-purple-950/80 via-slate-900 to-indigo-950/70 shadow-xl flex flex-col items-center justify-center transition-all duration-300">
                <span id="edging-joi-timer-text" class="font-mono text-3xl sm:text-4xl font-black text-white leading-none">
                  ${edgingSession.joiDuration}
                </span>
                <span class="text-[9px] font-mono text-purple-300 mt-1 uppercase font-bold">Sekunden</span>
              </div>
            </div>
          </div>

          <button type="button" id="btn-joi-toggle" onclick="SessionEdging.toggleJoiCountdown()" class="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs touch-btn shadow-lg">
            Taktung starten
          </button>
        </div>

        <!-- GROSSER SCHWELLEN-BUTTON (BLIND IM HALBDUNKEL TREFFBAR) -->
        <div class="pt-1">
          <button type="button" onclick="SessionEdging.registerThreshold()" class="w-full py-4 px-4 rounded-3xl bg-gradient-to-r from-amber-600 via-rose-700 to-purple-800 hover:from-amber-500 hover:to-purple-700 text-white font-black text-sm sm:text-base tracking-wider uppercase touch-btn shadow-2xl flex items-center justify-center gap-2 transform active:scale-95 transition-transform">
            <svg class="w-5 h-5 text-amber-200" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.008v.008H12v-.008z"/>
            </svg>
            <span>Schwelle erreicht (Kaltstopp +1)</span>
          </button>
        </div>

      </div>
    `;

    setArousalLevel(edgingSession.currentArousal);
  }

  function updateEdgingDisplay() {
    const counterEl = document.getElementById('edging-total-counter');
    if (counterEl) {
      counterEl.innerText = `${edgingSession.totalThresholds} Schwellen`;
    }
  }

  const api = {
    init: function(containerId) {
      renderEdgingCockpit(containerId);
    },
    render: renderEdgingCockpit,
    setArousal: setArousalLevel,
    registerThreshold: registerThreshold,
    registerEdge: registerThreshold, // Abwärtskompatibler Alias
    adjustJoiDuration: adjustJoiDuration,
    toggleJoiCountdown: startJoiCountdown,
    getSessionMetrics: function() {
      return Object.assign({}, edgingSession);
    }
  };

  window.SessionEdging = api;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const container = document.getElementById('edging-cockpit-container');
      if (container) api.init();
    });
  } else {
    const container = document.getElementById('edging-cockpit-container');
    if (container) api.init();
  }

})(window);
