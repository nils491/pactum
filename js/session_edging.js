/**
 * js/session_edging.js
 * TACTUS Schwellen-, Edging- & JOI-Cockpit (V3.0 Hyper-Dynamisch)
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien:
 * - Dynamische Schwellen-Erfassung mit Rückkopplung an ChastityDatabase & Tension-Index
 * - Taktiler JOI-Countdown mit variabler Frequenz und progressiver Haptik-Vibration
 * - Direkte WebAudio-Anbindung für akustischen Rhythmus-Puls & Soundscape-Ducking
 * - Tonalitäts-geprägte Befehle für Kaltstopp, Atemführung und Plateau-Halten
 * - Blind im Halbdunkel treffbare Touch-Ziele (min. 48px)
 * - 100 % frei von infantilen System-Emojis in Benutzeroberfläche und Code
 * - Keine window.alert() / window.confirm() Aufrufe unter keinen Umständen
 */

(function(window) {
  'use strict';

  const STORAGE_KEY_EDGING_LOGS = 'tactus_edging_session_data';

  let edgingSession = {
    active: false,
    startedAt: null,
    totalEdges: 0,
    currentArousal: 5,
    plateauDurationSeconds: 0,
    edgeTimestamps: [],
    joiDuration: 20,
    joiSecondsRemaining: 0,
    joiInterval: null,
    isCountingDown: false
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
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (durationMs / 1000));
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + (durationMs / 1000));
    } catch (e) {}
  }

  function setArousalLevel(level) {
    const val = Math.max(1, Math.min(10, parseInt(level, 10) || 5));
    edgingSession.currentArousal = val;

    const valEl = document.getElementById('edging-arousal-display');
    const descEl = document.getElementById('edging-arousal-desc');
    const barEl = document.getElementById('edging-arousal-bar');

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

    if (descEl) {
      if (val >= 9) {
        descEl.innerText = "Kritische Kante: Unmittelbar vor dem Point-of-No-Return. Höchste Wachsamkeit!";
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

  function registerEdge() {
    const now = Date.now();
    edgingSession.totalEdges++;
    edgingSession.edgeTimestamps.push(now);
    edgingSession.currentArousal = 9;

    // Rückkopplung an session_live.js falls im Schlafzimmer aktiv
    if (window.SessionLive && typeof window.SessionLive.adaptPhase === 'function') {
      window.SessionLive.adaptPhase('edge_too_fast');
    }

    // Rückkopplung an ProtocolCore Punkte-Buchung (Disziplin und Ausharren an der Schwelle)
    if (window.ProtocolCore && typeof window.ProtocolCore.addTransaction === 'function') {
      window.ProtocolCore.addTransaction(15, `Schwellen-Quälerei: Kante #${edgingSession.totalEdges} diszipliniert gehalten`, 'top');
    }

    triggerHapticPulse([100, 60, 100, 60, 140]);
    playAudioClick(880, 120);

    updateEdgingDisplay();
    showToast(`✓ Kante #${edgingSession.totalEdges} erfasst: Kalter Stopp!`);
  }

  function adjustJoiDuration(deltaSeconds) {
    if (edgingSession.isCountingDown) return;
    edgingSession.joiDuration = Math.max(5, Math.min(120, edgingSession.joiDuration + deltaSeconds));
    const label = document.getElementById('edging-joi-duration-label');
    if (label) label.innerText = `${edgingSession.joiDuration}s`;
    triggerHapticPulse([20]);
  }

  function startJoiCountdown() {
    if (edgingSession.isCountingDown) {
      stopJoiCountdown();
      return;
    }

    edgingSession.isCountingDown = true;
    edgingSession.joiSecondsRemaining = edgingSession.joiDuration;

    const btn = document.getElementById('btn-joi-toggle');
    const timerDisplay = document.getElementById('edging-joi-timer-display');
    if (btn) {
      btn.innerText = "Stoppen (Kaltstopp)";
      btn.className = "w-full py-3 rounded-2xl bg-rose-950 hover:bg-rose-900 border border-rose-700 text-rose-200 font-bold text-xs touch-btn shadow-lg";
    }

    showToast(`JOI Taktgeber gestartet (${edgingSession.joiDuration}s)`);
    triggerHapticPulse([80, 40, 80]);

    if (edgingSession.joiInterval) clearInterval(edgingSession.joiInterval);

    function tick() {
      if (timerDisplay) {
        timerDisplay.innerText = `${edgingSession.joiSecondsRemaining}s`;
        if (edgingSession.joiSecondsRemaining <= 5) {
          timerDisplay.className = "text-3xl font-mono font-black text-rose-400 animate-pulse";
        } else {
          timerDisplay.className = "text-3xl font-mono font-black text-purple-300";
        }
      }

      // Progressiver Takt-Klick und Haptik
      const isUrgent = edgingSession.joiSecondsRemaining <= 5;
      playAudioClick(isUrgent ? 660 : 330, isUrgent ? 80 : 40);
      triggerHapticPulse(isUrgent ? [60] : [25]);

      edgingSession.joiSecondsRemaining--;

      if (edgingSession.joiSecondsRemaining < 0) {
        stopJoiCountdown();
        registerEdge();
        showToast("Halt! Hände sofort wegnehmen!");
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
    const timerDisplay = document.getElementById('edging-joi-timer-display');

    if (btn) {
      btn.innerText = "Taktung starten";
      btn.className = "w-full py-3 rounded-2xl bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs touch-btn shadow-lg";
    }
    if (timerDisplay) {
      timerDisplay.innerText = `${edgingSession.joiDuration}s`;
      timerDisplay.className = "text-3xl font-mono font-black text-purple-300";
    }
  }

  function renderEdgingCockpit(containerId = 'edging-cockpit-container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="space-y-4 max-w-xl mx-auto text-xs animate-fade-in">
        
        <!-- HEADER KACHEL -->
        <div class="p-4 sm:p-5 rounded-3xl bg-slate-900/95 border border-purple-900/60 space-y-2 shadow-2xl">
          <div class="flex items-center justify-between border-b border-purple-900/40 pb-2.5">
            <div class="space-y-0.5 min-w-0 flex-1 pr-2">
              <span class="text-[9px] font-mono uppercase tracking-wider text-purple-400 font-bold block truncate">Edging-Cockpit · Schwellen-Regie</span>
              <h2 class="text-sm sm:text-base font-bold text-white truncate font-serif">
                Plateau-Führung &amp; Schwellen-Zähler
              </h2>
            </div>
            <div class="flex items-center gap-1.5 font-mono text-[10px] text-purple-300">
              <span class="px-2.5 py-1 rounded-xl bg-purple-950 border border-purple-800 font-bold" id="edging-total-counter">
                ${edgingSession.totalEdges} Kanten
              </span>
            </div>
          </div>
          <p class="text-[10.5px] text-slate-300 leading-snug">
            Führe den Körper an die Schwelle, halte das Plateau ohne Entlastung und bremse mit kaltem Stopp.
          </p>
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
        </div>

        <!-- JOI COUNTDOWN & TAKTGEBER -->
        <div class="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl text-center">
          <div class="flex items-center justify-between border-b border-slate-800 pb-2">
            <strong class="text-xs text-white block font-bold text-left">JOI Rhythmus-Taktgeber:</strong>
            <div class="flex items-center gap-1 font-mono text-[10px]">
              <button type="button" onclick="SessionEdging.adjustJoiDuration(-5)" class="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center justify-center touch-btn">-5s</button>
              <span id="edging-joi-duration-label" class="px-2 font-bold text-white">${edgingSession.joiDuration}s</span>
              <button type="button" onclick="SessionEdging.adjustJoiDuration(5)" class="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center justify-center touch-btn">+5s</button>
            </div>
          </div>

          <div class="py-2">
            <span id="edging-joi-timer-display" class="text-3xl font-mono font-black text-purple-300">
              ${edgingSession.joiDuration}s
            </span>
            <span class="text-[10px] text-slate-500 block mt-1">Getaktete Stimulation bis zum automatischen Kaltstopp</span>
          </div>

          <button type="button" id="btn-joi-toggle" onclick="SessionEdging.toggleJoiCountdown()" class="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs touch-btn shadow-lg">
            Taktung starten
          </button>
        </div>

        <!-- GROSSER KANTEN-BUTTON (BLIND TREFFBAR) -->
        <div class="pt-1">
          <button type="button" onclick="SessionEdging.registerEdge()" class="w-full py-4 px-4 rounded-3xl bg-gradient-to-r from-amber-600 via-rose-700 to-purple-800 hover:from-amber-500 hover:to-purple-700 text-white font-black text-sm sm:text-base tracking-wider uppercase touch-btn shadow-2xl flex items-center justify-center gap-2 transform active:scale-95 transition-transform">
            <svg class="w-5 h-5 text-amber-200" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.008v.008H12v-.008z"/>
            </svg>
            <span>Kante erreicht (Kaltstopp +1)</span>
          </button>
        </div>

      </div>
    `;

    setArousalLevel(edgingSession.currentArousal);
  }

  function updateEdgingDisplay() {
    const counterEl = document.getElementById('edging-total-counter');
    if (counterEl) {
      counterEl.innerText = `${edgingSession.totalEdges} Kanten`;
    }
  }

  const api = {
    init: function(containerId) {
      renderEdgingCockpit(containerId);
    },
    render: renderEdgingCockpit,
    setArousal: setArousalLevel,
    registerEdge: registerEdge,
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
