/**
 * js/session_edging.js
 * TACTUS Schwellen-, Plateau- & JOI-Cockpit (V3.0 Haute-Horlogerie)
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien nach Master-Roadbook:
 * - 100 % UTF-8 Integrität: Echte deutsche Umlaute (ä, ö, ü, ß) im gesamten Modul
 * - Haute-Horlogerie Palette: Reines OLED-Schwarz, Graphit, Champagner-Gold, Malachit, Cognac & Bordeaux
 * - Schlafzimmer-Senior-UX: 75% Viewport Circular Countdown, 72px Glanzziffer, 0,2s Glanceability
 * - Blind-Touch Kaltstopp: Großflächige 72px Schlagfläche im unteren Bereich mit Haptik-Schockimpuls
 * - Dynamische JOI-Taktung (Jerk Off Instruction): Anspruchsvolle, erwachsene Ansagen über lange Zeiträume
 * - Audio-Ziffern-Synchronität: Sprach-Countdown bei 10s & synchron die letzten 5 Sekunden ('5','4','3','2','1','Halt!')
 * - WebAudio-Metronom: Taktende Klicks (330Hz -> 660Hz -> 880Hz)
 * - Plateau-Haltezeit-Tracker: Exakte Erfassung der Sekunden im Erregungszenit (Arousal >= 8) mit Punkte-Buchung
 * - Keuschheits- & Hardware-Awareness: Automatische Adaption auf Käfiggitter-Vibration & P-Spot bei Verschluss
 * - Sub-Noten-Transparenz: Klickbare Deeplinks zu Item #36 (Denial) & Item #38 (Ruined Orgasm)
 * - 100 % frei von infantilen System-Emojis, keine window.alert() / confirm() Aufrufe
 */

(function(window) {
  'use strict';

  const STORAGE_KEY_EDGING_LOGS = 'tactus_edging_session_data';
  const SVG_RADIUS = 86;
  const SVG_CIRCUMFERENCE = 2 * Math.PI * SVG_RADIUS; // ~540.35 px

  let edgingState = {
    active: false,
    startedAt: null,
    totalThresholds: 0,
    currentArousal: 5,
    plateauDurationSeconds: 0,
    plateauTimerInterval: null,
    thresholdTimestamps: [],
    joiDuration: 25,
    joiSecondsRemaining: 25,
    joiInterval: null,
    isCountingDown: false,
    isAudioReady: true,
    lastDirective: "",
    currentPacingTechnique: "slow_strokes"
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
      } catch (e) {
        console.debug("[TACTUS Edging] Haptik nicht verfügbar:", e);
      }
    }
  }

  function playWebAudioTick(frequency = 440, durationMs = 50) {
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

  function loadPersistedState() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY_EDGING_LOGS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          edgingState = Object.assign({}, edgingState, parsed);
        }
      }
    } catch (e) {
      console.warn("[TACTUS Edging] Fehler beim Laden des Zustands:", e);
    }

    if (window.SessionLive && typeof window.SessionLive.getMetrics === 'function') {
      const liveMetrics = window.SessionLive.getMetrics();
      if (liveMetrics && typeof liveMetrics.edgesCounted === 'number' && liveMetrics.edgesCounted > edgingState.totalThresholds) {
        edgingState.totalThresholds = liveMetrics.edgesCounted;
      }
    }
  }

  function persistState() {
    try {
      const payload = {
        totalThresholds: edgingState.totalThresholds,
        currentArousal: edgingState.currentArousal,
        plateauDurationSeconds: edgingState.plateauDurationSeconds,
        joiDuration: edgingState.joiDuration,
        lastDirective: edgingState.lastDirective,
        currentPacingTechnique: edgingState.currentPacingTechnique,
        thresholdTimestamps: edgingState.thresholdTimestamps.slice(-50)
      };
      sessionStorage.setItem(STORAGE_KEY_EDGING_LOGS, JSON.stringify(payload));
    } catch (e) {}
  }

  function isBottomLocked() {
    if (window.ProtocolCore && typeof window.ProtocolCore.getState === 'function') {
      const state = window.ProtocolCore.getState();
      return !!state.isLocked;
    }
    return false;
  }

  function getSubSurveyPreferences() {
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
    const scaleLabels = ["Entfällt", "Tabu / Veto", "Eher nicht", "Neutral", "Gern", "Must-Have"];

    const denialScore = subAns['it_36_r2'];
    const ruinedScore = subAns['it_38_r2'];
    const denialNote = (subAns['note_36'] || '').trim();
    const ruinedNote = (subAns['note_38'] || '').trim();

    return {
      denial: {
        itemId: 36,
        score: denialScore !== undefined ? denialScore : null,
        label: denialScore !== undefined ? scaleLabels[denialScore] : 'Offen',
        note: denialNote
      },
      ruined: {
        itemId: 38,
        score: ruinedScore !== undefined ? ruinedScore : null,
        label: ruinedScore !== undefined ? scaleLabels[ruinedScore] : 'Offen',
        note: ruinedNote
      }
    };
  }

  const JOI_PACING_TECHNIQUES = {
    slow_strokes: {
      id: "slow_strokes",
      label: "Langsame Streichungen",
      instruction: "Umschließe den Schaft mit Daumen und Zeigefinger. Ganz langsame, quälende Aufwärtsbewegungen. Zwei Sekunden pro Streichung.",
      lockedInstruction: "Lege zwei Finger flach auf das Gitter des Käfigs. Erzeuge minimalen, kreisenden Druck direkt über der Eichelfurche."
    },
    shaft_tightening: {
      id: "shaft_tightening",
      label: "Spannungsgriff an der Basis",
      instruction: "Fester Ringgriff an der Schaftbasis. Drücke das Blut in die Schwellkörper, ohne die Hände auf und ab zu bewegen. Halte diesen Druck.",
      lockedInstruction: "Spanne den Beckenboden maximal an. Presse das Genital von innen gegen die Ringbegrenzung. Ruhig weiteratmen."
    },
    glans_focus: {
      id: "glans_focus",
      label: "Fokus auf das Frenulum",
      instruction: "Nur die Fingerspitzen leicht anfeuchten. Sanftes, kreisendes Reiben ausschließlich am Bändchen. Kein voller Griff.",
      lockedInstruction: "Setze den Vibrator auf niedrigster Stufe punktuell an das untere Fenster des Käfigs. Nicht bewegen."
    },
    rhythmic_speedup: {
      id: "rhythmic_speedup",
      label: "Rhythmische Taktsteigerung",
      instruction: "Fester Griff. Erhöhe das Tempo synchron mit dem Zähltakt. Bei der Zahl 5 frierst du augenblicklich ein.",
      lockedInstruction: "Vibrator auf maximale Schwingung bringen. Intensiver Dauerkontakt am Gitter bis zum Zählstopp."
    }
  };

  function setArousalLevel(level) {
    const val = Math.max(1, Math.min(10, parseInt(level, 10) || 5));
    edgingState.currentArousal = val;

    const valEl = document.getElementById('edging-arousal-display');
    const descEl = document.getElementById('edging-arousal-desc');
    const barEl = document.getElementById('edging-arousal-bar');
    const plateauBox = document.getElementById('edging-plateau-box');
    const locked = isBottomLocked();

    if (valEl) valEl.innerText = `${val} / 10`;

    if (barEl) {
      barEl.style.width = `${val * 10}%`;
      if (val >= 9) {
        barEl.className = "h-full rounded-full transition-all duration-300 bg-[#991b1b] red-glow animate-pulse";
      } else if (val >= 7) {
        barEl.className = "h-full rounded-full transition-all duration-300 bg-[#c5a880] gold-glow";
      } else {
        barEl.className = "h-full rounded-full transition-all duration-300 bg-[#2e5746]";
      }
    }

    if (val >= 8) {
      startPlateauTracker();
      if (plateauBox) plateauBox.classList.remove('hidden');
    } else {
      pausePlateauTracker();
    }

    if (descEl) {
      if (val >= 9) {
        descEl.innerText = locked
          ? "Kritische Schwelle: Maximaler Beckenbodendruck am Käfiggitter. Reiz sofort unterbrechen!"
          : "Kritische Schwelle: Unmittelbar vor dem Point-of-No-Return. Höchste Wachsamkeit!";
        descEl.className = "text-[11px] text-[#f8fafc] font-bold leading-snug";
      } else if (val >= 7) {
        descEl.innerText = locked
          ? "Hochexplosives Plateau: Puls rast, Atembeschleunigung, P-Spot und Käfig voll unter Spannung."
          : "Hochexplosives Plateau: Puls rast, Atembeschleunigung, starker Schwellkörperdruck.";
        descEl.className = "text-[11px] text-[#c5a880] font-medium leading-snug";
      } else if (val >= 4) {
        descEl.innerText = "Stabile Erregung: Gekonnter Reizaufbau ohne unkontrollierte Spitzen.";
        descEl.className = "text-[11px] text-[#94a3b8] leading-snug";
      } else {
        descEl.innerText = "Ruhezustand bis sanfte Vorbereitung: Das vegetative Nervensystem ist zentriert.";
        descEl.className = "text-[11px] text-[#94a3b8]/70 leading-snug";
      }
    }

    persistState();
    triggerHaptic(val >= 9 ? [60, 40, 60] : [25]);
  }

  function startPlateauTracker() {
    if (edgingState.plateauTimerInterval) return;
    edgingState.plateauTimerInterval = setInterval(() => {
      edgingState.plateauDurationSeconds++;
      const disp = document.getElementById('edging-plateau-seconds');
      if (disp) {
        const m = Math.floor(edgingState.plateauDurationSeconds / 60);
        const s = edgingState.plateauDurationSeconds % 60;
        disp.innerText = `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
      }
    }, 1000);
  }

  function pausePlateauTracker() {
    if (edgingState.plateauTimerInterval) {
      clearInterval(edgingState.plateauTimerInterval);
      edgingState.plateauTimerInterval = null;
    }
  }

  function registerThreshold() {
    if (edgingState.isCountingDown) {
      stopJoiCountdown();
    }

    const now = Date.now();
    edgingState.totalThresholds++;
    edgingState.thresholdTimestamps.push(now);
    edgingState.currentArousal = 9;

    let tonality = 'sovereign_warm';
    if (window.SessionStaging && typeof window.SessionStaging.getConfig === 'function') {
      const cfg = window.SessionStaging.getConfig();
      if (cfg && cfg.tonality) tonality = cfg.tonality;
    }

    const locked = isBottomLocked();
    let directive = "Halt! Hände weg. Ausatmen und stillhalten.";

    if (locked) {
      if (tonality === 'sovereign_cool') {
        directive = "Kalter Stopp! Vibration sofort wegnehmen. Stillstehen vor mir. Kein Millimeter Bewegung im Käfig.";
      } else if (tonality === 'raw_primal') {
        directive = "Stopp! Hände weg vom Gitter. Du bleibst genau so verriegelt liegen und spürst den Druck.";
      } else if (tonality === 'playful') {
        directive = "Fast zu nah am Käfiggitter gezuckt? Reiz sofort entziehen und tief durchatmen.";
      } else {
        directive = "Kalter Stopp. Reiz vom Käfig nehmen. Atme tief in den Bauch und beruhige deinen Puls.";
      }
    } else {
      if (tonality === 'sovereign_cool') {
        directive = "Kalter Stopp. Hände sofort wegnehmen, Blick nach unten senken. Du rührst dich nicht.";
      } else if (tonality === 'raw_primal') {
        directive = "Stopp! Bleib genau so liegen. Wag es nicht, dich ohne meine Erlaubnis zu bewegen.";
      } else if (tonality === 'playful') {
        directive = "Zu gierig geworden? Reiz sofort entziehen und tief durchatmen. Ich bestimme das Ende.";
      } else {
        directive = "Kalter Stopp. Hände ruhig vom Körper nehmen. Tief in den Bauch atmen und die Hitze aushalten.";
      }
    }

    edgingState.lastDirective = directive;

    if (window.SessionVoice && typeof window.SessionVoice.speak === 'function') {
      window.SessionVoice.speak(directive, { tonality: tonality, phase: 2, arousal: 9 });
    }

    if (window.SessionLive && typeof window.SessionLive.adaptPhase === 'function') {
      window.SessionLive.adaptPhase('edge_too_fast');
    }

    if (window.ProtocolCore && typeof window.ProtocolCore.addTransaction === 'function') {
      window.ProtocolCore.addTransaction(15, `Schwellen-Führung: Schwelle #${edgingState.totalThresholds} diszipliniert gehalten`, 'top');
    }

    triggerHaptic([100, 60, 100, 60, 140]);
    playWebAudioTick(880, 120);

    persistState();
    updateEdgingDisplay();
    showToast(`✓ Kaltstopp registriert! Schwelle #${edgingState.totalThresholds} verbucht`);
  }

  function adjustJoiDuration(deltaSeconds) {
    if (edgingState.isCountingDown) return;
    edgingState.joiDuration = Math.max(5, Math.min(180, edgingState.joiDuration + deltaSeconds));
    edgingState.joiSecondsRemaining = edgingState.joiDuration;
    updateCountdownSvgArc(edgingState.joiDuration, edgingState.joiDuration);
    persistState();
    triggerHaptic([20]);
    playWebAudioTick(550, 40);
  }

  function updateCountdownSvgArc(secondsLeft, totalDuration) {
    const arc = document.getElementById('edging-countdown-arc');
    const timerText = document.getElementById('edging-joi-timer-text');
    const core = document.getElementById('edging-countdown-core');

    if (timerText) {
      timerText.innerText = `${secondsLeft < 10 ? '0' + secondsLeft : secondsLeft}`;
    }

    if (arc) {
      const fraction = Math.max(0, Math.min(1, secondsLeft / totalDuration));
      const offset = SVG_CIRCUMFERENCE * (1 - fraction);
      arc.style.strokeDashoffset = offset.toFixed(1);

      if (secondsLeft <= 5) {
        arc.setAttribute('stroke', '#991b1b');
      } else if (secondsLeft <= 10) {
        arc.setAttribute('stroke', '#b3734a');
      } else {
        arc.setAttribute('stroke', '#c5a880');
      }
    }

    if (core) {
      if (secondsLeft <= 5) {
        core.style.borderColor = "#991b1b";
      } else if (secondsLeft <= 10) {
        core.style.borderColor = "#b3734a";
      } else {
        core.style.borderColor = "#c5a880";
      }
    }
  }

  function toggleJoiCountdown() {
    if (edgingState.isCountingDown) {
      stopJoiCountdown();
    } else {
      startJoiCountdown();
    }
  }

  function startJoiCountdown() {
    stopJoiCountdown();
    edgingState.isCountingDown = true;
    edgingState.joiSecondsRemaining = edgingState.joiDuration;

    const btn = document.getElementById('btn-joi-toggle');
    if (btn) {
      btn.innerText = "PAUSIEREN";
      btn.className = "flex-1 py-3 rounded-2xl bg-[#000000] border border-[#c5a880] text-[#c5a880] font-bold font-mono text-xs touch-pad transition shadow-sm";
    }

    showToast(`JOI Taktung gestartet (${edgingState.joiDuration}s)`);
    triggerHaptic([60, 40, 60]);

    if (window.SessionAudio && typeof window.SessionAudio.duck === 'function') {
      window.SessionAudio.duck(0.5);
    }

    function tick() {
      const s = edgingState.joiSecondsRemaining;
      updateCountdownSvgArc(s, edgingState.joiDuration);

      const isUrgent = s <= 5;
      playWebAudioTick(isUrgent ? (s === 1 ? 880 : 660) : 330, isUrgent ? 70 : 40);
      triggerHaptic(isUrgent ? [50] : [20]);

      if (window.SessionVoice && typeof window.SessionVoice.speak === 'function') {
        if (s <= 5 && s > 0) {
          window.SessionVoice.speak(String(s), { tonality: 'sovereign_cool', phase: 2 });
        } else if (s === 10) {
          window.SessionVoice.speak("Noch zehn Sekunden", { tonality: 'sovereign_cool', phase: 2 });
        }
      }

      edgingState.joiSecondsRemaining--;

      if (s <= 0) {
        stopJoiCountdown();
        registerThreshold();
      }
    }

    tick();
    edgingState.joiInterval = setInterval(tick, 1000);
  }

  function stopJoiCountdown() {
    if (edgingState.joiInterval) {
      clearInterval(edgingState.joiInterval);
      edgingState.joiInterval = null;
    }
    edgingState.isCountingDown = false;

    const btn = document.getElementById('btn-joi-toggle');
    if (btn) {
      btn.innerText = "TAKTUNG STARTEN";
      btn.className = "flex-1 py-3 rounded-2xl bg-[#c5a880] hover:bg-[#dfcaa9] text-black font-bold font-mono text-xs touch-pad transition shadow-md";
    }

    if (window.SessionAudio && typeof window.SessionAudio.unduck === 'function') {
      window.SessionAudio.unduck(1.0);
    }

    updateCountdownSvgArc(edgingState.joiDuration, edgingState.joiDuration);
  }

  function selectPacingTechnique(techId) {
    if (!JOI_PACING_TECHNIQUES[techId]) return;
    edgingState.currentPacingTechnique = techId;
    persistState();

    const tech = JOI_PACING_TECHNIQUES[techId];
    const locked = isBottomLocked();
    const instructionText = locked ? tech.lockedInstruction : tech.instruction;

    const textEl = document.getElementById('edging-technique-instruction');
    if (textEl) {
      textEl.innerText = instructionText;
    }

    const techButtons = document.querySelectorAll('[data-edging-tech]');
    techButtons.forEach(btn => {
      const bId = btn.getAttribute('data-edging-tech');
      if (bId === techId) {
        btn.className = "p-2.5 rounded-xl border text-left font-bold text-xs bg-[#000000] border-[#c5a880] text-[#c5a880] shadow-sm touch-pad transition";
      } else {
        btn.className = "p-2.5 rounded-xl border text-left font-bold text-xs bg-[#090d14] border-[#1e2638] text-[#94a3b8] hover:text-[#f8fafc] touch-pad transition";
      }
    });

    showToast(`Technik gewechselt: ${tech.label}`);
    triggerHaptic([30]);
  }

  function renderEdgingCockpit(containerId = 'edging-cockpit-container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    loadPersistedState();
    const subPrefs = getSubSurveyPreferences();
    const locked = isBottomLocked();
    const currentTech = JOI_PACING_TECHNIQUES[edgingState.currentPacingTechnique] || JOI_PACING_TECHNIQUES.slow_strokes;
    const currentTechInstruction = locked ? currentTech.lockedInstruction : currentTech.instruction;

    container.innerHTML = `
      <div class="space-y-4 max-w-2xl mx-auto text-xs animate-fade-in font-sans">
        
        <!-- HEADER DER SCHWELLEN-BÜHNE (HAUTE HORLOGERIE & STATUS) -->
        <div class="p-4 sm:p-5 rounded-3xl bg-[#090d14] border border-[#1e2638] space-y-3 shadow-2xl">
          <div class="flex items-center justify-between border-b border-[#1e2638]/60 pb-3 gap-2">
            <div class="space-y-0.5 min-w-0 flex-1 pr-2">
              <span class="text-[9.5px] font-mono uppercase tracking-wider text-[#c5a880] font-bold block truncate">
                ${locked ? 'Keuschheits-Regie · Plateau am Käfig' : 'Schwellen- &amp; Plateau-Regie'}
              </span>
              <h2 class="text-base sm:text-lg font-serif text-[#f8fafc] font-normal truncate">
                ${locked ? 'Schwellkörperdruck &amp; P-Spot Führung' : 'Gezielte Schwellen-Quälerei (Edging)'}
              </h2>
            </div>
            
            <div class="flex items-center gap-1.5 flex-shrink-0">
              <span class="px-2.5 py-1 rounded-xl bg-[#000000] border border-[#c5a880]/40 text-[#c5a880] font-mono text-[10px] font-bold" id="edging-total-counter">
                ${edgingState.totalThresholds} Kanten
              </span>
            </div>
          </div>

          <p class="text-[11px] text-[#94a3b8] leading-relaxed">
            ${locked 
              ? 'Führe den Druck am Käfiggitter kontrolliert an die Grenze, halte das Plateau ohne Ejakulation und friere Reize vor dem Point-of-No-Return augenblicklich ein.' 
              : 'Führe den Körper an die Schwelle, dehne das Plateau ohne Entlastung und bremse mit blindem Kaltstopp vor der Entladung.'}
          </p>

          <!-- SUB-NOTEN AUS DEM FRAGEBOGEN MIT KLICKBAREN DEEPLINKS -->
          <div class="pt-2 border-t border-[#1e2638]/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono">
            <!-- ITEM 36: ORGASMUSVERWEIGERUNG (DENIAL) -->
            <div class="p-3 rounded-2xl bg-[#000000] border border-[#8a5232]/40 space-y-1">
              <div class="flex items-center justify-between">
                <span class="text-[#b3734a] font-bold">Verweigerung (Denial):</span>
                <a href="index.html#view=survey&item=36" target="_blank" class="text-[#c5a880] hover:underline font-bold text-[9px]">Item #36 ↗</a>
              </div>
              <div class="flex items-center justify-between text-[9.5px]">
                <span class="text-[#94a3b8]">Sub-Resonanz:</span>
                <span class="text-[#f8fafc] font-bold">${escapeHtml(subPrefs.denial.label)}</span>
              </div>
              ${subPrefs.denial.note ? `
                <div class="pt-1 border-t border-[#1e2638] text-[9.5px] text-slate-200 italic space-y-0.5">
                  <span class="not-italic text-[#b3734a] font-bold block">[Sub-Notiz]:</span>
                  <p class="leading-snug">„${escapeHtml(subPrefs.denial.note)}“</p>
                </div>
              ` : ''}
            </div>

            <!-- ITEM 38: RUINED ORGASM -->
            <div class="p-3 rounded-2xl bg-[#000000] border border-[#8a5232]/40 space-y-1">
              <div class="flex items-center justify-between">
                <span class="text-[#b3734a] font-bold">Ruined Orgasm:</span>
                <a href="index.html#view=survey&item=38" target="_blank" class="text-[#c5a880] hover:underline font-bold text-[9px]">Item #38 ↗</a>
              </div>
              <div class="flex items-center justify-between text-[9.5px]">
                <span class="text-[#94a3b8]">Sub-Resonanz:</span>
                <span class="text-[#f8fafc] font-bold">${escapeHtml(subPrefs.ruined.label)}</span>
              </div>
              ${subPrefs.ruined.note ? `
                <div class="pt-1 border-t border-[#1e2638] text-[9.5px] text-slate-200 italic space-y-0.5">
                  <span class="not-italic text-[#b3734a] font-bold block">[Sub-Notiz]:</span>
                  <p class="leading-snug">„${escapeHtml(subPrefs.ruined.note)}“</p>
                </div>
              ` : ''}
            </div>
          </div>
        </div>

        <!-- 75% CIRCULAR COUNTDOWN ARC & GLANCEABILITY STAGE (0,2s AUS 2M DISTANZ) -->
        <div class="p-5 sm:p-6 rounded-3xl bg-[#090d14] border border-[#1e2638] space-y-4 shadow-xl text-center">
          
          <div class="flex items-center justify-between border-b border-[#1e2638]/60 pb-2">
            <div class="text-left space-y-0.5">
              <strong class="text-xs text-[#f8fafc] block font-bold tracking-wide">JOI Countdown &amp; Taktgeber</strong>
              <span class="text-[9.5px] text-[#94a3b8] font-mono block">Sprachgeführter Countdown bis zum Kaltstopp</span>
            </div>
            
            <div class="flex items-center gap-1 font-mono text-[10px]">
              <button type="button" onclick="SessionEdging.adjustDuration(-5)" class="w-8 h-8 rounded-xl bg-[#000000] border border-[#1e2638] text-[#94a3b8] hover:text-[#f8fafc] font-bold flex items-center justify-center touch-pad">-5s</button>
              <button type="button" onclick="SessionEdging.adjustDuration(5)" class="w-8 h-8 rounded-xl bg-[#000000] border border-[#1e2638] text-[#94a3b8] hover:text-[#f8fafc] font-bold flex items-center justify-center touch-pad">+5s</button>
            </div>
          </div>

          <!-- GROSSZÜGIGER 75% CIRCULAR PROGRESS ARC -->
          <div class="py-4 flex flex-col items-center justify-center">
            <div class="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
              
              <svg class="w-full h-full transform -rotate-90 pointer-events-none" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="${SVG_RADIUS}" stroke="#101622" stroke-width="6" fill="none" />
                <circle 
                  id="edging-countdown-arc" 
                  cx="100" 
                  cy="100" 
                  r="${SVG_RADIUS}" 
                  stroke="#c5a880" 
                  stroke-width="7" 
                  stroke-linecap="round" 
                  fill="none" 
                  style="stroke-dasharray: ${SVG_CIRCUMFERENCE}; stroke-dashoffset: 0;" 
                  class="transition-all duration-300"
                />
              </svg>
              
              <!-- 72px GLANZZIFFER FÜR DEN NACHTTISCH -->
              <div id="edging-countdown-core" class="absolute w-44 h-44 sm:w-48 sm:h-48 rounded-full border border-[#c5a880]/30 bg-[#000000] shadow-2xl flex flex-col items-center justify-center transition-all duration-300">
                <span id="edging-joi-timer-text" class="font-mono text-6xl sm:text-7xl font-bold text-[#f8fafc] tracking-tighter leading-none">
                  ${edgingState.joiDuration < 10 ? '0' + edgingState.joiDuration : edgingState.joiDuration}
                </span>
                <span class="text-[10px] font-mono uppercase tracking-widest text-[#c5a880] font-bold mt-1">SEKUNDEN</span>
              </div>
            </div>
          </div>

          <!-- COUNTDOWN CONTROLS -->
          <div class="flex items-center gap-2 pt-1 border-t border-[#1e2638]/60 max-w-sm mx-auto">
            <button type="button" id="btn-joi-toggle" onclick="SessionEdging.toggleCountdown()" class="flex-1 py-3 rounded-2xl bg-[#c5a880] hover:bg-[#dfcaa9] text-black font-bold font-mono text-xs touch-pad transition shadow-md">
              TAKTUNG STARTEN
            </button>
          </div>
        </div>

        <!-- TELEPROMPTER DIRECTIVE & JOI-TECHNIKEN -->
        <div class="p-4 sm:p-5 rounded-3xl bg-[#090d14] border border-[#1e2638] space-y-3 shadow-xl">
          <div class="flex items-center justify-between border-b border-[#1e2638]/60 pb-2">
            <strong class="text-xs text-[#f8fafc] block font-bold">JOI-Reiztechnik (Teleprompter):</strong>
            <span class="text-[9.5px] font-mono text-[#c5a880] font-bold">Synchron mit Zählung</span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5 font-mono text-[10px]">
            ${Object.values(JOI_PACING_TECHNIQUES).map(tech => `
              <button 
                type="button" 
                data-edging-tech="${tech.id}"
                onclick="SessionEdging.selectTechnique('${tech.id}')"
                class="p-2.5 rounded-xl border text-left font-bold text-xs transition touch-pad ${edgingState.currentPacingTechnique === tech.id ? 'bg-[#000000] border-[#c5a880] text-[#c5a880] shadow-sm' : 'bg-[#090d14] border-[#1e2638] text-[#94a3b8] hover:text-[#f8fafc]'}"
              >
                ${escapeHtml(tech.label)}
              </button>
            `).join('')}
          </div>

          <div class="p-3.5 rounded-2xl bg-[#000000] border border-[#c5a880]/30 space-y-1">
            <span class="text-[9px] font-mono uppercase tracking-widest text-[#c5a880] font-bold block">Wörtliche Führung des Tops:</span>
            <blockquote id="edging-technique-instruction" class="font-serif text-base sm:text-lg text-[#f8fafc] italic leading-snug pt-0.5">
              ${escapeHtml(currentTechInstruction)}
            </blockquote>
          </div>
        </div>

        <!-- AROUSAL SLIDER & PLATEAU TRACKING -->
        <div class="p-4 sm:p-5 rounded-3xl bg-[#090d14] border border-[#1e2638] space-y-3 shadow-xl">
          <div class="flex items-center justify-between">
            <strong class="text-xs text-[#f8fafc] block font-bold">Erregungs-Pegel (Arousal):</strong>
            <span class="text-sm font-mono font-bold text-[#c5a880]" id="edging-arousal-display">${edgingState.currentArousal} / 10</span>
          </div>

          <div class="w-full h-3 bg-[#000000] rounded-full overflow-hidden border border-[#1e2638] p-0.5">
            <div id="edging-arousal-bar" class="h-full rounded-full transition-all duration-300 bg-[#c5a880] gold-glow" style="width: ${edgingState.currentArousal * 10}%;"></div>
          </div>

          <input 
            type="range" 
            min="1" 
            max="10" 
            value="${edgingState.currentArousal}" 
            oninput="SessionEdging.setArousal(this.value)" 
            class="w-full h-2 bg-[#000000] rounded-lg appearance-none cursor-pointer accent-[#c5a880]" 
          />

          <div class="p-3 rounded-2xl bg-[#000000] border border-[#1e2638]">
            <p id="edging-arousal-desc" class="text-[11px] text-[#c5a880] leading-snug">
              Stabile Erregung: Gekonnter Reizaufbau ohne unkontrollierte Spitzen.
            </p>
          </div>

          <!-- PLATEAU-DAUER TRACKER MIT MALACHIT-PULS -->
          <div id="edging-plateau-box" class="${edgingState.currentArousal >= 8 ? '' : 'hidden'} p-3.5 rounded-2xl bg-[#000000] border border-[#2e5746] flex items-center justify-between shadow-inner">
            <div class="space-y-0.5">
              <strong class="text-xs text-[#f8fafc] block font-bold flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-[#2e5746] animate-pulse"></span>
                <span>Plateau-Haltezeit (Zenit):</span>
              </strong>
              <span class="text-[10px] text-[#94a3b8] font-mono">Dauer unter maximalem Schwellkörperdruck (+15 P)</span>
            </div>
            <span id="edging-plateau-seconds" class="font-mono text-base font-bold text-[#f8fafc]">
              ${Math.floor(edgingState.plateauDurationSeconds / 60)}m ${edgingState.plateauDurationSeconds % 60}s
            </span>
          </div>
        </div>

        <!-- BLIND-TOUCH KALTSTOPP BUTTON (MINDESTENS 72px HOCH) -->
        <div class="pt-1">
          <button 
            type="button" 
            onclick="SessionEdging.registerThreshold()" 
            class="w-full min-h-[72px] sm:min-h-[80px] p-4 rounded-3xl bg-[#991b1b] hover:bg-red-700 text-white font-mono font-bold tracking-widest uppercase text-sm sm:text-base flex items-center justify-center gap-3 transition touch-pad red-glow border border-[#991b1b]/80 shadow-2xl"
          >
            <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.008v.008H12v-.008z"/>
            </svg>
            <span>KALTSTOPP (BLIND-TOUCH)</span>
          </button>
        </div>

      </div>
    `;

    setArousalLevel(edgingState.currentArousal);
  }

  function updateEdgingDisplay() {
    const counterEl = document.getElementById('edging-total-counter');
    if (counterEl) {
      counterEl.innerText = `${edgingState.totalThresholds} Kanten`;
    }
  }

  const api = {
    init: function(containerId) {
      renderEdgingCockpit(containerId);
    },
    render: renderEdgingCockpit,
    setArousal: setArousalLevel,
    registerThreshold: registerThreshold,
    registerEdge: registerThreshold,
    adjustDuration: adjustJoiDuration,
    toggleCountdown: toggleJoiCountdown,
    selectTechnique: selectPacingTechnique,
    getSessionMetrics: function() {
      return Object.assign({}, edgingState);
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
