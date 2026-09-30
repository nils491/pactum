/**
 * js/session_audio.js
 * TACTUS Autarke WebAudio-Synthese & Klangregie (V3.0 Hyper-Dynamisch)
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien:
 * - 100 % autarke Synthese im Browser (keine externen MP3s / Zero-Knowledge Offline)
 * - 4 prozedurale Klangräume:
 *   • 'velvet_drone' (Binaurale Schwebung 6Hz für Subspace & Trance)
 *   • 'tibetan_bowl_432' (Modale FM-Synthese 432Hz mit Nachhall-Resonanz)
 *   • 'night_breeze' (Gefiltertes Pink Noise mit LFO-Druckwellen)
 *   • 'heartbeat_dark' (Sub-Bass Pulsator mit variabler BPM-Kopplung)
 * - Dynamische Anpassung an Erregungspegel (Arousal 1..10) und Session-Phasen
 * - Automatisches Audio-Ducking bei Sprache (TTS) oder JOI-Taktklicks (-14 dB)
 * - 100 % frei von infantilen System-Emojis in Benutzeroberfläche und Code
 * - Keine window.alert() / window.confirm() Aufrufe unter keinen Umständen
 */

(function(window) {
  'use strict';

  let audioCtx = null;
  let masterGain = null;
  let musicGain = null;
  let sfxGain = null;

  let isPlaying = false;
  let activeSoundscapeId = 'velvet_drone';
  let masterVolume = 0.65;
  let isDucked = false;

  // Aktive Klangquellen & Generatoren
  let activeGenerators = [];
  let heartbeatTimer = null;
  let heartbeatBpm = 62;

  // Dynamischer Modulations-Status
  let currentArousal = 5;
  let currentSessionPhase = 1;
  let currentTonality = 'sovereign_warm';

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        console.warn("[TACTUS Audio] WebAudio API von diesem Browser nicht unterstützt.");
        return null;
      }
      audioCtx = new AudioContextClass();

      // Master Gain
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(masterVolume, audioCtx.currentTime);

      // Musik Bus
      musicGain = audioCtx.createGain();
      musicGain.gain.setValueAtTime(0.7, audioCtx.currentTime);

      // SFX / Takt Bus
      sfxGain = audioCtx.createGain();
      sfxGain.gain.setValueAtTime(0.85, audioCtx.currentTime);

      // Routing
      musicGain.connect(masterGain);
      sfxGain.connect(masterGain);
      masterGain.connect(audioCtx.destination);
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    return audioCtx;
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
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.757 3.63 8.25 4.51 8.25H6.75z"/>
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

  /**
   * Generiert eine tiefe, warme Samt-Drone mit binauraler Schwebung (Theta 6 Hz)
   * zur Aktivierung des Parasympathikus und Eintauchen in den Subspace.
   */
  function startVelvetDrone(ctx, targetGainNode) {
    const baseFreq = currentTonality === 'sovereign_cool' ? 108 : (currentTonality === 'raw_primal' ? 54 : 72);
    const thetaBeat = 6.0; // 6 Hz Frequenzdifferenz für Trance

    // Linker Kanal
    const oscL = ctx.createOscillator();
    oscL.type = 'sine';
    oscL.frequency.setValueAtTime(baseFreq, ctx.currentTime);

    // Rechter Kanal (Offset um Theta-Frequenz)
    const oscR = ctx.createOscillator();
    oscR.type = 'sine';
    oscR.frequency.setValueAtTime(baseFreq + thetaBeat, ctx.currentTime);

    // Sub-Bass Unterton
    const subOsc = ctx.createOscillator();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(baseFreq / 2, ctx.currentTime);

    // Filter mit Arousal-Kopplung
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    const cutoff = Math.min(1800, 200 + (currentArousal * 90));
    filter.frequency.setValueAtTime(cutoff, ctx.currentTime);
    filter.Q.setValueAtTime(2.5, ctx.currentTime);

    // Gain Envelopes
    const padGain = ctx.createGain();
    padGain.gain.setValueAtTime(0.001, ctx.currentTime);
    padGain.gain.exponentialRampToValueAtTime(0.45, ctx.currentTime + 3.0);

    // Panner
    const pannerL = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    const pannerR = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    if (pannerL) pannerL.pan.setValueAtTime(-0.85, ctx.currentTime);
    if (pannerR) pannerR.pan.setValueAtTime(0.85, ctx.currentTime);

    // Routing
    if (pannerL && pannerR) {
      oscL.connect(pannerL);
      pannerL.connect(filter);
      oscR.connect(pannerR);
      pannerR.connect(filter);
    } else {
      oscL.connect(filter);
      oscR.connect(filter);
    }
    subOsc.connect(filter);

    filter.connect(padGain);
    padGain.connect(targetGainNode);

    oscL.start();
    oscR.start();
    subOsc.start();

    return {
      name: 'velvet_drone',
      filterNode: filter,
      stop: (fadeSeconds = 2.0) => {
        try {
          padGain.gain.setValueAtTime(padGain.gain.value, ctx.currentTime);
          padGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + fadeSeconds);
          setTimeout(() => {
            try {
              oscL.stop();
              oscR.stop();
              subOsc.stop();
            } catch (e) {}
          }, fadeSeconds * 1000 + 100);
        } catch (e) {}
      }
    };
  }

  /**
   * Modale Resonanz-Synthese einer tibetischen Klangschale (Grundfrequenz 432 Hz).
   * Erzeugt obertonreiche Schwebungen mit langsam ausklingender Nachhall-Dämpfung.
   */
  function startTibetanBowl432(ctx, targetGainNode) {
    const fundamental = 432;
    const partials = [
      { ratio: 1.0, gain: 0.45 },
      { ratio: 2.76, gain: 0.28 },
      { ratio: 5.40, gain: 0.12 },
      { ratio: 8.92, gain: 0.05 }
    ];

    const bowlGain = ctx.createGain();
    bowlGain.gain.setValueAtTime(0.001, ctx.currentTime);
    bowlGain.gain.exponentialRampToValueAtTime(0.5, ctx.currentTime + 2.5);

    const oscillators = [];

    partials.forEach(p => {
      const osc = ctx.createOscillator();
      const pGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(fundamental * p.ratio, ctx.currentTime);

      // Sanfte LFO-Amplituden-Modulation für lebendigen Schwebungseffekt
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.25 + (Math.random() * 0.2), ctx.currentTime);
      lfoGain.gain.setValueAtTime(p.gain * 0.15, ctx.currentTime);

      lfo.connect(lfoGain.gain);
      pGain.gain.setValueAtTime(p.gain, ctx.currentTime);

      osc.connect(pGain);
      pGain.connect(bowlGain);

      osc.start();
      lfo.start();
      oscillators.push(osc, lfo);
    });

    bowlGain.connect(targetGainNode);

    return {
      name: 'tibetan_bowl_432',
      stop: (fadeSeconds = 3.0) => {
        try {
          bowlGain.gain.setValueAtTime(bowlGain.gain.value, ctx.currentTime);
          bowlGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + fadeSeconds);
          setTimeout(() => {
            oscillators.forEach(o => {
              try { o.stop(); } catch (e) {}
            });
          }, fadeSeconds * 1000 + 100);
        } catch (e) {}
      }
    };
  }

  /**
   * Generiert eine gefilterte Wind- und Atem-Klanglandschaft über moduliertes Pink Noise.
   */
  function startNightBreeze(ctx, targetGainNode) {
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    // Paul Kellet Pink Noise Algorithmus
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11; // Pegelkorrektur
      b6 = white * 0.115926;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Tiefpassfilter mit Atem-Wellen
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, ctx.currentTime);
    filter.Q.setValueAtTime(1.8, ctx.currentTime);

    // LFO für wellenförmige Windstöße
    const windLfo = ctx.createOscillator();
    const windLfoGain = ctx.createGain();
    windLfo.frequency.setValueAtTime(0.12, ctx.currentTime); // ~8 Sekunden Atemzyklus
    windLfoGain.gain.setValueAtTime(180, ctx.currentTime);

    windLfo.connect(filter.frequency);

    const breezeGain = ctx.createGain();
    breezeGain.gain.setValueAtTime(0.001, ctx.currentTime);
    breezeGain.gain.exponentialRampToValueAtTime(0.38, ctx.currentTime + 2.5);

    whiteNoise.connect(filter);
    filter.connect(breezeGain);
    breezeGain.connect(targetGainNode);

    whiteNoise.start();
    windLfo.start();

    return {
      name: 'night_breeze',
      stop: (fadeSeconds = 2.0) => {
        try {
          breezeGain.gain.setValueAtTime(breezeGain.gain.value, ctx.currentTime);
          breezeGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + fadeSeconds);
          setTimeout(() => {
            try {
              whiteNoise.stop();
              windLfo.stop();
            } catch (e) {}
          }, fadeSeconds * 1000 + 100);
        } catch (e) {}
      }
    };
  }

  /**
   * Erzeugt einen gedämpften, sub-aurikulären Herzschlag-Puls.
   * BPM skaliert dynamisch mit der Erregungsstufe (Arousal 1..10).
   */
  function triggerHeartbeatSingle(ctx, targetGainNode, frequency = 58, intensity = 0.5) {
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(120, now);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, now);
      osc.frequency.exponentialRampToValueAtTime(34, now + 0.16);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(intensity * 0.45, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(targetGainNode);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {}
  }

  function startHeartbeatLoop(ctx, targetGainNode) {
    if (heartbeatTimer) clearInterval(heartbeatTimer);

    function scheduleBeats() {
      // Berechnung BPM: Basis 58 + Arousal-Zuschlag
      heartbeatBpm = Math.max(50, Math.min(130, 56 + (currentArousal * 6)));
      const intervalMs = (60 / heartbeatBpm) * 1000;

      // Lub-Dub: Doppelschlag
      triggerHeartbeatSingle(ctx, targetGainNode, 64, 0.45);
      setTimeout(() => {
        triggerHeartbeatSingle(ctx, targetGainNode, 52, 0.32);
      }, 140);

      heartbeatTimer = setTimeout(scheduleBeats, intervalMs);
    }

    scheduleBeats();

    return {
      name: 'heartbeat_dark',
      stop: () => {
        if (heartbeatTimer) {
          clearTimeout(heartbeatTimer);
          heartbeatTimer = null;
        }
      }
    };
  }

  /**
   * Senkt die Hintergrund-Soundscape sanft um 14 dB ab, wenn Regieanweisungen
   * gesprochen werden oder Taktklicks im Erregungszenit ertönen.
   */
  function duckMusic(duckDurationSeconds = 3.5, duckLevel = 0.18) {
    if (!musicGain || !audioCtx) return;
    const now = audioCtx.currentTime;

    try {
      isDucked = true;
      musicGain.gain.cancelScheduledValues(now);
      musicGain.gain.setValueAtTime(musicGain.gain.value, now);
      musicGain.gain.linearRampToValueAtTime(duckLevel, now + 0.25);

      setTimeout(() => {
        unduckMusic();
      }, duckDurationSeconds * 1000);
    } catch (e) {}
  }

  function unduckMusic(restoreTimeSeconds = 1.2) {
    if (!musicGain || !audioCtx || !isDucked) return;
    const now = audioCtx.currentTime;
    try {
      musicGain.gain.cancelScheduledValues(now);
      musicGain.gain.setValueAtTime(musicGain.gain.value, now);
      musicGain.gain.linearRampToValueAtTime(0.7, now + restoreTimeSeconds);
      isDucked = false;
    } catch (e) {}
  }

  /**
   * Taktiler Percussion-Klick für den JOI-Taktgeber und Schwellen-Timer.
   */
  function playPercussionClick(frequency = 440, durationMs = 60, customGain = 0.35) {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(frequency, now);

      gain.gain.setValueAtTime(customGain, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (durationMs / 1000));

      osc.connect(gain);
      gain.connect(sfxGain || ctx.destination);

      osc.start(now);
      osc.stop(now + (durationMs / 1000) + 0.02);
    } catch (e) {}
  }

  function setSoundscape(soundscapeId) {
    activeSoundscapeId = soundscapeId || 'velvet_drone';
    if (isPlaying) {
      stopAllGenerators(1.0);
      startCurrentSoundscape();
    }
    updateUi();
  }

  function startCurrentSoundscape() {
    const ctx = getAudioContext();
    if (!ctx) return;

    stopAllGenerators(0.6);

    let generator = null;
    switch (activeSoundscapeId) {
      case 'tibetan_bowl_432':
        generator = startTibetanBowl432(ctx, musicGain);
        break;
      case 'night_breeze':
        generator = startNightBreeze(ctx, musicGain);
        break;
      case 'heartbeat_dark':
        generator = startHeartbeatLoop(ctx, musicGain);
        break;
      case 'velvet_drone':
      default:
        generator = startVelvetDrone(ctx, musicGain);
        break;
    }

    if (generator) {
      activeGenerators.push(generator);
    }
    isPlaying = true;
    updateUi();
  }

  function stopAllGenerators(fadeSeconds = 1.5) {
    activeGenerators.forEach(g => {
      if (g && typeof g.stop === 'function') {
        g.stop(fadeSeconds);
      }
    });
    activeGenerators = [];
    if (heartbeatTimer) {
      clearTimeout(heartbeatTimer);
      heartbeatTimer = null;
    }
  }

  function togglePlay() {
    if (isPlaying) {
      stopAllGenerators(1.5);
      isPlaying = false;
      showToast("Soundscape pausiert");
    } else {
      startCurrentSoundscape();
      showToast("Soundscape aktiv");
    }
    updateUi();
  }

  function setMasterVolume(val) {
    masterVolume = Math.max(0.0, Math.min(1.0, parseFloat(val) || 0.65));
    if (masterGain && audioCtx) {
      masterGain.gain.setValueAtTime(masterVolume, audioCtx.currentTime);
    }
    const label = document.getElementById('session-audio-vol-label');
    if (label) label.innerText = `${Math.round(masterVolume * 100)}%`;
  }

  /**
   * Dynamische Kopplung: Reagiert auf Erregungsänderungen aus session_edging.js
   */
  function setArousalModulation(arousalLevel) {
    currentArousal = Math.max(1, Math.min(10, parseInt(arousalLevel, 10) || 5));

    // Moduliere Filter der aktiven Drone
    if (audioCtx) {
      activeGenerators.forEach(g => {
        if (g.filterNode) {
          const targetCutoff = Math.min(1800, 200 + (currentArousal * 90));
          g.filterNode.frequency.linearRampToValueAtTime(targetCutoff, audioCtx.currentTime + 0.8);
        }
      });
    }
  }

  /**
   * Dynamische Kopplung: Reagiert auf Phasenwechsel aus session_live.js
   */
  function setSessionPhase(phaseIndex, tonality = 'sovereign_warm') {
    currentSessionPhase = phaseIndex;
    currentTonality = tonality;

    // Automatische Raum-Empfehlung passend zur Dramaturgie
    if (phaseIndex === 1) {
      // Transition & Erdung: Velvet Drone mit 6Hz Binaural-Beat
      setSoundscape('velvet_drone');
    } else if (phaseIndex === 2) {
      // Reizaufbau & Macht: Nachtbrise oder Drone
      if (activeSoundscapeId !== 'velvet_drone' && activeSoundscapeId !== 'night_breeze') {
        setSoundscape('night_breeze');
      }
    } else if (phaseIndex === 3) {
      // Katharsis: Herzschlag-Puls
      setSoundscape('heartbeat_dark');
    } else if (phaseIndex >= 4) {
      // Aftercare: 432 Hz Tibetische Klangschale
      setSoundscape('tibetan_bowl_432');
    }
  }

  function renderAudioWidget(containerId = 'session-audio-widget-container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const soundscapes = [
      { id: 'velvet_drone', label: 'Velvet Drone (6Hz Binaural)', desc: 'Tieffrequente Schwebung für Subspace & Trance' },
      { id: 'tibetan_bowl_432', label: 'Klangschale (432Hz)', desc: 'Resonante Obertöne zur Nervensystem-Erdung' },
      { id: 'night_breeze', label: 'Nachtbrise (Pink Noise)', desc: 'Wellenförmiges Rauschen zur Reizabschirmung' },
      { id: 'heartbeat_dark', label: 'Herzschlag (Pulsator)', desc: 'Sub-Bass Herzschlag, gekoppelt an Erregung' }
    ];

    container.innerHTML = `
      <div class="p-4 rounded-3xl bg-slate-900 border border-purple-900/60 space-y-3 text-xs shadow-xl">
        <div class="flex items-center justify-between border-b border-purple-900/40 pb-2">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-xl bg-purple-950 border border-purple-800 text-purple-300 flex items-center justify-center">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.757 3.63 8.25 4.51 8.25H6.75z"/>
              </svg>
            </div>
            <div>
              <strong class="text-xs text-white block font-bold">Klangregie &amp; Raum-Synthese</strong>
              <span class="text-[9.5px] text-purple-300 font-mono">100 % Autarke WebAudio-Synthese</span>
            </div>
          </div>
          <button type="button" id="btn-audio-toggle" onclick="SessionAudio.togglePlay()" class="px-3 py-1.5 rounded-xl font-bold text-xs touch-btn transition-colors ${isPlaying ? 'bg-purple-700 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:text-white'}">
            ${isPlaying ? 'Stopp' : 'Starten'}
          </button>
        </div>

        <!-- SOUNDSCAPE AUSWAHL -->
        <div class="grid grid-cols-2 gap-1.5 pt-1">
          ${soundscapes.map(s => {
            const isSelected = activeSoundscapeId === s.id;
            return `
              <button type="button" onclick="SessionAudio.setSoundscape('${s.id}')" class="p-2.5 rounded-2xl border text-left transition-all touch-btn ${isSelected ? 'bg-purple-950/70 border-purple-600 text-white shadow-sm' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'}">
                <strong class="text-[11px] block font-bold truncate leading-tight">${escapeHtml(s.label)}</strong>
                <span class="text-[9px] text-slate-400 block mt-0.5 leading-snug line-clamp-1">${escapeHtml(s.desc)}</span>
              </button>
            `;
          }).join('')}
        </div>

        <!-- LAUTSTÄRKE SLIDER -->
        <div class="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
          <span class="text-[10px] font-mono text-slate-400 uppercase">Lautstärke:</span>
          <input type="range" min="0" max="1" step="0.05" value="${masterVolume}" oninput="SessionAudio.setVolume(this.value)" class="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-purple-500" />
          <span id="session-audio-vol-label" class="font-mono text-[10px] text-purple-300 font-bold min-w-[2.2rem] text-right">${Math.round(masterVolume * 100)}%</span>
        </div>
      </div>
    `;
  }

  function updateUi() {
    const btn = document.getElementById('btn-audio-toggle');
    if (btn) {
      btn.innerText = isPlaying ? "Stopp" : "Starten";
      btn.className = `px-3 py-1.5 rounded-xl font-bold text-xs touch-btn transition-colors ${isPlaying ? 'bg-purple-700 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:text-white'}`;
    }
    const container = document.getElementById('session-audio-widget-container');
    if (container && container.children.length > 0) {
      renderAudioWidget();
    }
  }

  const api = {
    init: function(containerId) {
      renderAudioWidget(containerId);
    },
    render: renderAudioWidget,
    togglePlay: togglePlay,
    play: startCurrentSoundscape,
    stop: () => { stopAllGenerators(1.5); isPlaying = false; updateUi(); },
    setSoundscape: setSoundscape,
    setVolume: setMasterVolume,
    duck: duckMusic,
    unduck: unduckMusic,
    playPercussionClick: playPercussionClick,
    setArousalModulation: setArousalModulation,
    setSessionPhase: setSessionPhase,
    getContext: getAudioContext,
    isPlaying: () => isPlaying
  };

  window.SessionAudio = api;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const container = document.getElementById('session-audio-widget-container');
      if (container) api.init();
    });
  } else {
    const container = document.getElementById('session-audio-widget-container');
    if (container) api.init();
  }

})(window);
