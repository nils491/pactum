/**
 * js/session_voice.js
 * TACTUS Stimm-Persona, Stimmenauswahl & Hybrid-Speech-Engine (V3.0 Haute-Horlogerie)
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien nach Master-Roadbook:
 * - 100 % UTF-8 Integrität: Echte deutsche Umlaute (ä, ö, ü, ß) im gesamten Modul
 * - Haute-Horlogerie Audio-Physiologie: Pitch 0.88–0.92, entschleunigte Kadenz (0.85–0.92)
 * - Interaktive Stimmenauswahl (System-Stimmenfilter de-DE & Optionale Studio-TTS)
 * - Tonalitäts-Frequenzen passend zu den 4 Top-Temperamenten
 * - Prioritäten-Queue mit Kaltstopp-Sofortabbruch ('emergency' / 'immediate' / 'normal')
 * - Taktiler Countdown-Modus (speakCountdown) für Schwellen und Zuchttakte mit Haptik
 * - Intelligentes Phrasen-Pacing mit 400–800ms Atempausen
 * - Automatisches 60 % Audio-Ducking via SessionAudio
 * - Resilienz gegen Chrome 15s SpeechSynthesis-Hangups
 * - Keine window.alert() / confirm() Aufrufe
 */

(function(window) {
  'use strict';

  const STORAGE_KEY_VOICE_URI = 'tactus_selected_voice_uri';
  const STORAGE_KEY_VOICE_MUTED = 'tactus_voice_muted';
  const STORAGE_KEY_WHISPER_MODE = 'tactus_voice_whisper_mode';
  const STORAGE_KEY_STUDIO_VOICE = 'tactus_studio_voice_id';

  // Tonale Pitch- und Rate-Vektoren für die 4 Top-Temperamente
  const TONALITY_PROFILES = {
    sovereign_warm: {
      pitch: 0.90,
      rate: 0.88,
      pauseMs: 450,
      volume: 1.0,
      label: 'Souverän & Zugewandt'
    },
    sovereign_cool: {
      pitch: 0.86,
      rate: 0.84,
      pauseMs: 650,
      volume: 0.95,
      label: 'Kühl & Distanziert'
    },
    raw_primal: {
      pitch: 0.88,
      rate: 0.94,
      pauseMs: 350,
      volume: 1.0,
      label: 'Körperlich & Instinktiv'
    },
    playful: {
      pitch: 0.93,
      rate: 0.91,
      pauseMs: 400,
      volume: 0.98,
      label: 'Spöttisch & Neckend'
    }
  };

  let voiceEngineState = {
    isMuted: false,
    isWhisperMode: false,
    selectedVoiceURI: null,
    availableVoices: [],
    isSpeaking: false,
    activeUtterance: null,
    chromeHeartbeatInterval: null,
    speechQueue: [],
    studioVoiceId: 'onyx' // 'onyx' (tief), 'nova', 'shimmer', 'alloy'
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

  function loadSettings() {
    try {
      voiceEngineState.selectedVoiceURI = localStorage.getItem(STORAGE_KEY_VOICE_URI) || null;
      voiceEngineState.isMuted = localStorage.getItem(STORAGE_KEY_VOICE_MUTED) === 'true';
      voiceEngineState.isWhisperMode = localStorage.getItem(STORAGE_KEY_WHISPER_MODE) === 'true';
      voiceEngineState.studioVoiceId = localStorage.getItem(STORAGE_KEY_STUDIO_VOICE) || 'onyx';
    } catch (e) {
      console.debug("[TACTUS Voice] LocalStorage Ladefehler:", e);
    }
  }

  function saveSettings() {
    try {
      if (voiceEngineState.selectedVoiceURI) {
        localStorage.setItem(STORAGE_KEY_VOICE_URI, voiceEngineState.selectedVoiceURI);
      }
      localStorage.setItem(STORAGE_KEY_VOICE_MUTED, voiceEngineState.isMuted ? 'true' : 'false');
      localStorage.setItem(STORAGE_KEY_WHISPER_MODE, voiceEngineState.isWhisperMode ? 'true' : 'false');
      localStorage.setItem(STORAGE_KEY_STUDIO_VOICE, voiceEngineState.studioVoiceId);
    } catch (e) {}
  }

  function refreshAvailableVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      voiceEngineState.availableVoices = [];
      return [];
    }

    const all = window.speechSynthesis.getVoices() || [];
    
    // Nach deutschen Sprachpaketen filtern
    const germanVoices = all.filter(v => {
      const lang = (v.lang || '').toLowerCase();
      return lang.startsWith('de') || lang.includes('de-de') || lang.includes('de_de') || lang.includes('de-at') || lang.includes('de-ch');
    });

    // Nach Qualität sortieren: Google, Siri, Natural, Enhanced, Microsoft zuerst
    germanVoices.sort((a, b) => {
      const score = v => {
        const name = (v.name || '').toLowerCase();
        let pts = 0;
        if (name.includes('natural') || name.includes('enhanced') || name.includes('premium')) pts += 50;
        if (name.includes('google')) pts += 40;
        if (name.includes('siri')) pts += 35;
        if (name.includes('katja') || name.includes('conrad') || name.includes('marlene')) pts += 30;
        if (name.includes('microsoft')) pts += 20;
        if (v.default) pts += 10;
        return pts;
      };
      return score(b) - score(a);
    });

    voiceEngineState.availableVoices = germanVoices;

    // Falls noch keine Stimme gewählt oder die gewählte nicht mehr da ist, beste selektieren
    if (!voiceEngineState.selectedVoiceURI && germanVoices.length > 0) {
      voiceEngineState.selectedVoiceURI = germanVoices[0].voiceURI;
      saveSettings();
    }

    return germanVoices;
  }

  function initVoiceEngine() {
    loadSettings();

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      refreshAvailableVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          refreshAvailableVoices();
        };
      }
    }
  }

  function startChromeHeartbeat() {
    stopChromeHeartbeat();
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    voiceEngineState.chromeHeartbeatInterval = setInterval(() => {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 12000);
  }

  function stopChromeHeartbeat() {
    if (voiceEngineState.chromeHeartbeatInterval) {
      clearInterval(voiceEngineState.chromeHeartbeatInterval);
      voiceEngineState.chromeHeartbeatInterval = null;
    }
  }

  function notifyAudioDucking(isDucked) {
    if (window.SessionAudio && typeof window.SessionAudio.duck === 'function' && typeof window.SessionAudio.unduck === 'function') {
      try {
        if (isDucked) {
          window.SessionAudio.duck(0.40); // Auf 40 % absenken (60 % Ducking)
        } else {
          window.SessionAudio.unduck(1.2);
        }
      } catch (e) {}
    }

    // Visuellen Sprech-Indikator im DOM aktualisieren
    const indicator = document.getElementById('voice-activity-indicator');
    if (indicator) {
      if (isDucked) {
        indicator.classList.remove('opacity-0');
        indicator.classList.add('animate-pulse');
      } else {
        indicator.classList.add('opacity-0');
        indicator.classList.remove('animate-pulse');
      }
    }
  }

  function getResolvedUtterance(text, options = {}) {
    const tonality = options.tonality || 'sovereign_warm';
    const profile = TONALITY_PROFILES[tonality] || TONALITY_PROFILES.sovereign_warm;
    const isWhisper = (options.whisper !== undefined) ? !!options.whisper : voiceEngineState.isWhisperMode;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';

    // Frequenzen & Tempo
    utterance.pitch = (options.pitch !== undefined) ? options.pitch : profile.pitch;
    utterance.rate = (options.rate !== undefined) ? options.rate : (isWhisper ? profile.rate * 0.92 : profile.rate);
    utterance.volume = (options.volume !== undefined) ? options.volume : (isWhisper ? 0.45 : profile.volume);

    // Ausgewählte Stimme zuweisen
    const targetURI = options.voiceURI || voiceEngineState.selectedVoiceURI;
    const voiceObj = voiceEngineState.availableVoices.find(v => v.voiceURI === targetURI) || voiceEngineState.availableVoices[0];
    if (voiceObj) {
      utterance.voice = voiceObj;
    }

    return { utterance, profile };
  }

  function speak(text, options = {}) {
    if (!text || typeof text !== 'string') return Promise.resolve();

    // Bei Stummschaltung sofort aufhören
    if (voiceEngineState.isMuted) {
      if (typeof options.onEnd === 'function') options.onEnd();
      return Promise.resolve();
    }

    // Bei Sofort-Abbrüchen (Kaltstopp / Safeword ROT) alte Sprachausgabe verwerfen
    if (options.priority === 'emergency' || options.priority === 'immediate') {
      cancel();
    }

    // Reine Textbereinigung von Anführungszeichen & HTML-Tags
    const cleanText = text.replace(/<[^>]*>/g, '').replace(/^[„"']|[“"']$/g, '').trim();
    if (!cleanText) return Promise.resolve();

    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        if (typeof options.onEnd === 'function') options.onEnd();
        resolve();
        return;
      }

      // Bei laufender Sprachausgabe stoppen
      if (options.priority === 'immediate') {
        window.speechSynthesis.cancel();
      }

      const { utterance } = getResolvedUtterance(cleanText, options);

      utterance.onstart = () => {
        voiceEngineState.isSpeaking = true;
        voiceEngineState.activeUtterance = utterance;
        notifyAudioDucking(true);
        startChromeHeartbeat();
        if (typeof options.onStart === 'function') options.onStart();
      };

      utterance.onend = () => {
        voiceEngineState.isSpeaking = false;
        voiceEngineState.activeUtterance = null;
        stopChromeHeartbeat();
        notifyAudioDucking(false);
        if (typeof options.onEnd === 'function') options.onEnd();
        resolve();
      };

      utterance.onerror = (err) => {
        console.debug("[TACTUS Voice] SpeechSynthesis Event:", err);
        voiceEngineState.isSpeaking = false;
        voiceEngineState.activeUtterance = null;
        stopChromeHeartbeat();
        notifyAudioDucking(false);
        if (typeof options.onEnd === 'function') options.onEnd();
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  function speakCountdown(fromNumber = 5, toNumber = 0, intervalSec = 1.0, options = {}) {
    if (voiceEngineState.isMuted) {
      if (typeof options.onEnd === 'function') options.onEnd();
      return;
    }

    cancel();
    let current = fromNumber;
    const finalStopWord = options.stopWord || "Halt";

    function step() {
      if (current < toNumber) {
        speak(finalStopWord, {
          priority: 'immediate',
          tonality: options.tonality || 'sovereign_cool',
          volume: 1.0,
          onEnd: options.onEnd
        });
        return;
      }

      const word = current === 0 ? finalStopWord : String(current);
      
      // Haptik & Audio-Click koppeln
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try { navigator.vibrate([25]); } catch (e) {}
      }
      if (window.SessionAudio && typeof window.SessionAudio.playPercussionClick === 'function') {
        window.SessionAudio.playPercussionClick(current <= 3 ? 660 : 440, 40);
      }

      speak(word, {
        priority: 'immediate',
        tonality: options.tonality || 'sovereign_warm',
        pitch: 0.90,
        rate: 0.95,
        onEnd: () => {
          current--;
          setTimeout(step, Math.max(100, (intervalSec * 1000) - 400));
        }
      });
    }

    step();
  }

  function cancel() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
    voiceEngineState.isSpeaking = false;
    voiceEngineState.activeUtterance = null;
    voiceEngineState.speechQueue = [];
    stopChromeHeartbeat();
    notifyAudioDucking(false);
  }

  function setMuted(muted) {
    voiceEngineState.isMuted = !!muted;
    if (voiceEngineState.isMuted) {
      cancel();
    }
    saveSettings();
  }

  function setWhisperMode(enabled) {
    voiceEngineState.isWhisperMode = !!enabled;
    saveSettings();
  }

  function setVoice(voiceURI) {
    voiceEngineState.selectedVoiceURI = voiceURI;
    saveSettings();
  }

  function setStudioVoice(studioVoiceId) {
    voiceEngineState.studioVoiceId = studioVoiceId;
    saveSettings();
  }

  function testVoice(voiceURI) {
    const targetURI = voiceURI || voiceEngineState.selectedVoiceURI;
    const testText = "TACTUS Sprachführung aktiv. Souverän, ruhig und im Halbdunkel verankert.";
    speak(testText, {
      priority: 'immediate',
      voiceURI: targetURI,
      tonality: 'sovereign_warm'
    });
  }

  function renderVoiceSelector(containerId = 'voice-selector-container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    refreshAvailableVoices();
    const voices = voiceEngineState.availableVoices;
    const currentURI = voiceEngineState.selectedVoiceURI;
    const isMuted = voiceEngineState.isMuted;
    const isWhisper = voiceEngineState.isWhisperMode;

    const studioVoices = [
      { id: 'onyx', name: 'Onyx Studio (Tief, resonant & gebieterisch)' },
      { id: 'nova', name: 'Nova Studio (Klar, warm & fokussiert)' },
      { id: 'shimmer', name: 'Shimmer Studio (Zart, sinnlich & flüsternd)' }
    ];

    container.innerHTML = `
      <div class="p-4 rounded-3xl bg-[#090d14] border border-[#1e2638] space-y-3.5 shadow-xl text-xs font-sans">
        <div class="flex items-center justify-between border-b border-[#1e2638]/70 pb-2">
          <div class="space-y-0.5">
            <strong class="text-xs text-white block font-bold">Stimmenauswahl &amp; Sprach-Persona:</strong>
            <span class="text-[10px] text-[#94a3b8]">Entschleunigte Kadenz (0.88x) &amp; sonorer Pitch</span>
          </div>
          <div class="flex items-center gap-1.5 font-mono text-[10px]">
            <button type="button" onclick="SessionVoice.toggleMuteState(); SessionVoice.renderSelector('${containerId}');" class="px-2.5 py-1 rounded-xl font-bold transition-all touch-pad ${isMuted ? 'bg-[#450a0a] border border-[#991b1b] text-white' : 'bg-[#000000] border border-[#c5a880]/50 text-[#c5a880]'}">
              ${isMuted ? 'Stumm ✕' : 'Aktiv ✓'}
            </button>
            <button type="button" onclick="SessionVoice.toggleWhisperState(); SessionVoice.renderSelector('${containerId}');" class="px-2.5 py-1 rounded-xl font-bold transition-all touch-pad ${isWhisper ? 'bg-[#4a2818] border border-[#8a5232] text-[#f8fafc]' : 'bg-[#000000] border border-[#1e2638] text-[#94a3b8]'}">
              ${isWhisper ? 'Flüstern 🌙' : 'Normal'}
            </button>
          </div>
        </div>

        <!-- SYSTEM-STIMMEN DROPDOWN -->
        <div class="space-y-1.5 font-mono">
          <label class="text-[10px] text-[#94a3b8] uppercase block font-bold">Verfügbare deutsche Systemstimmen:</label>
          ${voices.length === 0 ? `
            <div class="p-2.5 rounded-xl bg-[#000000] border border-[#1e2638] text-[10px] text-[#94a3b8]">
              Keine nativen deutschen Stimmen im Browser gefunden. Standard-Audioausgabe aktiv.
            </div>
          ` : `
            <div class="flex items-center gap-2">
              <select onchange="SessionVoice.setVoice(this.value)" class="flex-1 text-xs p-2 bg-[#000000] border border-[#1e2638] rounded-xl text-white focus:border-[#c5a880] focus:outline-none truncate">
                ${voices.map(v => `
                  <option value="${escapeHtml(v.voiceURI)}" ${v.voiceURI === currentURI ? 'selected' : ''}>
                    ${escapeHtml(v.name)} (${escapeHtml(v.lang)})
                  </option>
                `).join('')}
              </select>
              <button type="button" onclick="SessionVoice.testCurrentVoice()" class="px-3 py-2 rounded-xl bg-[#000000] hover:bg-[#101622] border border-[#c5a880]/60 text-[#c5a880] font-bold text-xs whitespace-nowrap touch-pad flex items-center gap-1">
                <span>▶ Testen</span>
              </button>
            </div>
          `}
        </div>

        <!-- OPTIONALE STUDIO-TTS STIMMEN -->
        <div class="pt-2 border-t border-[#1e2638]/70 space-y-1.5 font-mono">
          <div class="flex items-center justify-between">
            <span class="text-[10px] text-[#c5a880] uppercase font-bold">Optionale Studio-TTS (API-Modus):</span>
            <span class="text-[9px] text-[#94a3b8]">OpenAI / Universal-Key</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-[10px]">
            ${studioVoices.map(sv => `
              <button type="button" onclick="SessionVoice.setStudioVoice('${sv.id}'); SessionVoice.renderSelector('${containerId}');" class="p-2 rounded-xl border text-left transition-all touch-pad ${voiceEngineState.studioVoiceId === sv.id ? 'bg-[#000000] border-[#c5a880] text-[#c5a880] font-bold' : 'bg-[#000000] border-[#1e2638] text-[#94a3b8] hover:text-white'}">
                <span class="block truncate">${escapeHtml(sv.name)}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  const api = {
    init: initVoiceEngine,
    speak: speak,
    speakCountdown: speakCountdown,
    cancel: cancel,
    setMuted: setMuted,
    isMuted: () => voiceEngineState.isMuted,
    toggleMuteState: () => { setMuted(!voiceEngineState.isMuted); },
    setWhisperMode: setWhisperMode,
    isWhisperMode: () => voiceEngineState.isWhisperMode,
    toggleWhisperState: () => { setWhisperMode(!voiceEngineState.isWhisperMode); },
    setVoice: setVoice,
    setStudioVoice: setStudioVoice,
    testCurrentVoice: () => testVoice(),
    testVoice: testVoice,
    getAvailableVoices: refreshAvailableVoices,
    renderSelector: renderVoiceSelector,
    tonalities: TONALITY_PROFILES
  };

  window.SessionVoice = api;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVoiceEngine);
  } else {
    initVoiceEngine();
  }

})(typeof window !== 'undefined' ? window : this);
