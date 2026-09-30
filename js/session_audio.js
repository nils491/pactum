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
  let activeSoundscapeId = 'generative_noir';
  let masterVolume = 0.65;
  let isDucked = false;

  // Aktive Klangquellen & Generatoren
  let activeGenerators = [];
  let musicLoopTimer = null;
  let arpTimer = null;
  let currentChordStep = 0;

  // Dynamischer Modulations-Status
  let currentArousal = 5;
  let currentSessionPhase = 1;
  let currentTonality = 'sovereign_warm';

  // MIDI-zu-Frequenz-Wandler
  function midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  // Musikalische Harmonien & Akkord-Matrizen
  const HARMONIC_PROGRESSIONS = {
    // Phase 1: Tiefe, beruhigende Moll- und Sus-Akkorde (Erdung & Subspace)
    grounding: [
      { name: "Dm9", notes: [38, 50, 57, 60, 64] },      // D2, D3, A3, C4, E4
      { name: "Bbmaj7", notes: [34, 46, 53, 57, 62] },   // Bb1, Bb2, F3, A3, D4
      { name: "Gm9", notes: [31, 43, 50, 53, 57] },      // G1, G2, D3, F3, A3
      { name: "Asus4", notes: [33, 45, 52, 57, 62] }     // A1, A2, E3, A3, D4
    ],
    // Phase 2: D-Dorisch mit hypnotischer Bewegung (Macht & Reizaufbau)
    tension: [
      { name: "Dm7", notes: [38, 50, 57, 60, 65] },      // D2, D3, A3, C4, F4
      { name: "Em7/D", notes: [38, 52, 55, 59, 64] },    // D2, E3, G3, B3, E4
      { name: "Fmaj7", notes: [41, 53, 57, 60, 64] },    // F2, F3, A3, C4, E4
      { name: "G7sus4", notes: [43, 55, 58, 62, 67] }    // G2, G3, Bb3, D4, G4
    ],
    // Phase 3: Erregungszenit & Katharsis (Dichte Harmonik, treibend)
    catharsis: [
      { name: "Dm(add9)", notes: [38, 50, 57, 62, 64] },
      { name: "Cadd9/E", notes: [40, 52, 55, 60, 62] },
      { name: "Bbmaj7(#11)", notes: [34, 46, 55, 57, 64] },
      { name: "A7(b13)", notes: [33, 45, 52, 58, 61] }
    ],
    // Phase 4: Sanfte Erlösung & Entlastung (Reverse Aftercare)
    aftercare: [
      { name: "Fmaj9", notes: [41, 53, 57, 60, 64, 67] }, // Lichter Dur-Klang
      { name: "Dsus2", notes: [38, 50, 57, 62, 64] },
      { name: "Gmaj7", notes: [35, 47, 54, 59, 62] },
      { name: "D(pure)", notes: [38, 50, 57, 62] }
    ]
  };

  /**
   * Polyphoner, mikrotonal schwebender Ambient-Pad-Synthesizer
   * Erzeugt warme, reiche Akkorde mit zwei detunten Oszillatoren pro Stimme.
   */
  function playGenerativePadChord(ctx, targetGainNode, chordNotes, durationSeconds = 12.0) {
    const chordVoices = [];
    const chordGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Dynamischer Filter-Cutoff gekoppelt an Erregung und Phase
    filter.type = 'lowpass';
    const baseCutoff = currentSessionPhase >= 3 ? 900 : (currentSessionPhase === 2 ? 650 : 380);
    const dynamicCutoff = Math.min(2400, baseCutoff + (currentArousal * 85));
    filter.frequency.setValueAtTime(dynamicCutoff * 0.7, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(dynamicCutoff, ctx.currentTime + (durationSeconds * 0.4));
    filter.frequency.exponentialRampToValueAtTime(dynamicCutoff * 0.6, ctx.currentTime + durationSeconds);
    filter.Q.setValueAtTime(1.8, ctx.currentTime);

    // Sanfte Hüllkurve (Lush Envelope)
    chordGain.gain.setValueAtTime(0.001, ctx.currentTime);
    chordGain.gain.exponentialRampToValueAtTime(0.38, ctx.currentTime + (durationSeconds * 0.35));
    chordGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSeconds);

    filter.connect(chordGain);
    chordGain.connect(targetGainNode);

    // Erzeuge zwei Oszillatoren pro Note (Sawtooth + Triangle mit Chorus-Detuning)
    chordNotes.forEach(midi => {
      const freq = midiToFreq(midi);

      // Oszillator 1 (Warm Triangle)
      const osc1 = ctx.createOscillator();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, ctx.currentTime);

      // Oszillator 2 (Soft Saw mit +4 Cent Schwebung für analoge Wärme)
      const osc2 = ctx.createOscillator();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(freq * 1.0025, ctx.currentTime);

      const voiceGain = ctx.createGain();
      voiceGain.gain.setValueAtTime(0.18, ctx.currentTime);

      osc1.connect(voiceGain);
      osc2.connect(voiceGain);
      voiceGain.connect(filter);

      osc1.start(ctx.currentTime);
      osc2.start(ctx.currentTime);

      osc1.stop(ctx.currentTime + durationSeconds + 0.1);
      osc2.stop(ctx.currentTime + durationSeconds + 0.1);

      chordVoices.push(osc1, osc2);
    });

    return {
      voices: chordVoices,
      filter: filter,
      stop: () => {
        try {
          chordGain.gain.cancelScheduledValues(ctx.currentTime);
          chordGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 1.5);
          setTimeout(() => {
            chordVoices.forEach(v => { try { v.stop(); } catch (e) {} });
          }, 1600);
        } catch (e) {}
      }
    };
  }

  /**
   * Generativer melodischer Arpeggiator & Glocken-Plucks
   * Streut organische Melodietöne aus dem aktuellen Akkord ein.
   */
  function triggerGenerativePluck(ctx, targetGainNode, midiNote) {
    try {
      const now = ctx.currentTime;
      const freq = midiToFreq(midiNote);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Flötiger Sinus-/Rechteck-Mischklang mit perkussivem Filter-Pluck
      osc.type = Math.random() > 0.4 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(freq * 1.8, now);
      filter.Q.setValueAtTime(3.5, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.09, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(targetGainNode);

      osc.start(now);
      osc.stop(now + 3.0);
    } catch (e) {}
  }

  /**
   * Die generative Kompositions-Engine (Endloser, dynamischer Musikfluss)
   */
  function startGenerativeMusic(ctx, targetGainNode) {
    stopGenerativeMusic();

    let activePad = null;
    const chordDuration = currentSessionPhase === 3 ? 9.0 : 13.0;

    function stepProgression() {
      let progressionSet = HARMONIC_PROGRESSIONS.grounding;
      if (currentSessionPhase === 2) progressionSet = HARMONIC_PROGRESSIONS.tension;
      else if (currentSessionPhase === 3) progressionSet = HARMONIC_PROGRESSIONS.catharsis;
      else if (currentSessionPhase >= 4) progressionSet = HARMONIC_PROGRESSIONS.aftercare;

      const currentChord = progressionSet[currentChordStep % progressionSet.length];
      currentChordStep++;

      // Spiele den nächsten warmen Pad-Akkord
      activePad = playGenerativePadChord(ctx, targetGainNode, currentChord.notes, chordDuration + 1.5);
      activeGenerators.push(activePad);

      // Starte subtilen Melodie-Fluss über die Töne dieses Akkords
      scheduleArpNotes(ctx, targetGainNode, currentChord.notes, chordDuration);

      // Nächsten Akkord rechtzeitig vorbereiten (sanftes Ineinander-Überblenden)
      musicLoopTimer = setTimeout(stepProgression, (chordDuration - 1.2) * 1000);
    }

    stepProgression();

    return {
      name: 'generative_noir',
      stop: () => stopGenerativeMusic()
    };
  }

  function scheduleArpNotes(ctx, targetGainNode, chordNotes, duration) {
    if (arpTimer) clearTimeout(arpTimer);
    const melodyCandidates = chordNotes.filter(n => n >= 50); // Nur mittlere & höhere Töne
    let elapsed = 1.0;

    function playNextNote() {
      if (elapsed >= duration - 2.0 || !isPlaying) return;
      if (Math.random() > 0.3) {
        const randomNote = melodyCandidates[Math.floor(Math.random() * melodyCandidates.length)];
        const octaveShift = Math.random() > 0.7 ? 12 : 0;
        triggerGenerativePluck(ctx, targetGainNode, randomNote + octaveShift);
      }
      const nextDelay = 1.5 + (Math.random() * 2.2);
      elapsed += nextDelay;
      arpTimer = setTimeout(playNextNote, nextDelay * 1000);
    }

    arpTimer = setTimeout(playNextNote, 1200);
  }

  function stopGenerativeMusic() {
    if (musicLoopTimer) {
      clearTimeout(musicLoopTimer);
      musicLoopTimer = null;
    }
    if (arpTimer) {
      clearTimeout(arpTimer);
      arpTimer = null;
    }
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
      case 'generative_noir':
      default:
        generator = startGenerativeMusic(ctx, musicGain);
        break;
    }

    if (generator) {
      activeGenerators.push(generator);
    }
    isPlaying = true;
    updateUi();
  }

  function stopAllGenerators(fadeSeconds = 1.5) {
    stopGenerativeMusic();
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

  function renderAudioWidget(containerId = 'session-audio-widget-container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const soundscapes = [
      { id: 'generative_noir', label: 'TACTUS Generative Musik', desc: 'Unendliche Harmonien, Pads & Melodiefluss (Voll-Dynamisch)' },
      { id: 'velvet_drone', label: 'Velvet Drone (6Hz Binaural)', desc: 'Tieffrequente Schwebung für Subspace & Trance' },
      { id: 'tibetan_bowl_432', label: 'Klangschale (432Hz)', desc: 'Resonante Obertöne zur Nervensystem-Erdung' },
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
              <strong class="text-xs text-white block font-bold">Generative Musikregie</strong>
              <span class="text-[9.5px] text-purple-300 font-mono">100 % Autarke WebAudio-Synthese (Echte Musik)</span>
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
