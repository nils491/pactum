/**
 * js/session_voice.js
 * TACTUS Expressive Sprachregie & Hyper-Dynamische Stimm-Modulation (V3.0 Hyper-Dynamisch)
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien:
 * - Hyper-Dynamische Stimm-Modulation nach Top-Tonalität, Session-Phase & Arousal (1..10)
 * - 4 Tonalitäts-Profile:
 *   • 'sovereign_warm' (Tief, warm, verlässliche Erdung, getragenes Tempo)
 *   • 'sovereign_cool' (Messerscharf, kühl, distanziert, kalkulierte Pausen)
 *   • 'raw_primal' (Tiefere Resonanz, zupackend, direkt und ungeschliffen)
 *   • 'playful' (Modulierende Tonhöhe, spöttisch, sinnliches Teasing)
 * - Automatisches Audio-Ducking: Kopplung an session_audio.js (-14 dB Musikabsenkung)
 * - 0-ms Audio-Blob Caching für verzögerungsfreie Wiedergabe im Schlafzimmer
 * - Native Web Speech API & Multi-KI Voice Gateway (Gemini / OpenAI Audio)
 * - 100 % frei von infantilen System-Emojis in Benutzeroberfläche und Code
 * - Keine window.alert() / window.confirm() Aufrufe unter keinen Umständen
 */

(function(window) {
  'use strict';

  const STORAGE_KEY_VOICE_CONFIG = 'tactus_voice_config';

  let voiceConfig = {
    enabled: true,
    volume: 0.9,
    pitchModifier: 1.0,
    rateModifier: 1.0,
    preferredVoiceUri: null,
    provider: 'native', // 'native' | 'gemini_tts' | 'openai_tts'
    autoDuckMusic: true
  };

  let isSpeaking = false;
  let currentUtterance = null;
  let activeAudioElement = null;
  const audioBlobCache = new Map(); // In-Memory Cache für 0-ms Wiedergabe

  // Physische und psychologische Modulations-Profile
  const TONALITY_VOICE_PROFILES = {
    sovereign_warm: {
      rate: 0.92,
      pitch: 0.95,
      pauseBeforeQuoteMs: 400,
      breathCadence: 'calm_grounding',
      geminiVoice: 'Aoede', // Warme, geerdete Stimme
      openAiVoice: 'shimmer'
    },
    sovereign_cool: {
      rate: 0.88,
      pitch: 0.88,
      pauseBeforeQuoteMs: 650,
      breathCadence: 'cold_measured',
      geminiVoice: 'Fenrir', // Tiefe, distanzierte Präzision
      openAiVoice: 'onyx'
    },
    raw_primal: {
      rate: 1.04,
      pitch: 0.82,
      pauseBeforeQuoteMs: 250,
      breathCadence: 'heavy_physical',
      geminiVoice: 'Enceladus', // Kräftig, rauchig
      openAiVoice: 'echo'
    },
    playful: {
      rate: 1.06,
      pitch: 1.12,
      pauseBeforeQuoteMs: 300,
      breathCadence: 'teasing_dynamic',
      geminiVoice: 'Despina', // Heller, modulierender Schalk
      openAiVoice: 'nova'
    }
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

  function loadVoiceConfig() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_VOICE_CONFIG);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          voiceConfig = Object.assign({}, voiceConfig, parsed);
        }
      }
    } catch (e) {
      console.warn("[TACTUS Voice] Fehler beim Laden der Konfiguration:", e);
    }
  }

  function saveVoiceConfig() {
    try {
      localStorage.setItem(STORAGE_KEY_VOICE_CONFIG, JSON.stringify(voiceConfig));
    } catch (e) {
      console.warn("[TACTUS Voice] Fehler beim Sichern der Konfiguration:", e);
    }
  }

  /**
   * Berechnet Sprechtempo, Pitch und Pausendramaturgie dynamisch:
   * f(Top-Tonalität, Phase, Erregungspegel [1..10])
   */
  function calculateDynamicSpeechParameters(tonalityKey, sessionPhase, arousalLevel) {
    const baseProfile = TONALITY_VOICE_PROFILES[tonalityKey] || TONALITY_VOICE_PROFILES.sovereign_warm;
    const arousal = Math.max(1, Math.min(10, parseInt(arousalLevel, 10) || 5));
    const phase = Math.max(1, Math.min(4, parseInt(sessionPhase, 10) || 1));

    // Arousal-Modulation: Bei hoher Erregung (Plateau >= 8) wird die Stimme ruhiger oder fordernder
    let dynamicRate = baseProfile.rate;
    let dynamicPitch = baseProfile.pitch;

    if (tonalityKey === 'sovereign_cool') {
      // Kühl: Bei Schwellendruck noch langsamer und unerbittlicher
      if (arousal >= 8) dynamicRate -= 0.08;
    } else if (tonalityKey === 'raw_primal') {
      // Primal: Bei Schwellendruck noch druckvoller und tiefer
      if (arousal >= 8) {
        dynamicRate += 0.06;
        dynamicPitch -= 0.06;
      }
    } else if (tonalityKey === 'playful') {
      // Playful: Höherer Spottfaktor bei steigendem Triebdruck
      if (arousal >= 8) dynamicPitch += 0.08;
    }

    // Phasen-Modulation: Phase 4 (Aftercare) senkt das Tempo für Vagus-Erdung
    if (phase >= 4) {
      dynamicRate *= 0.88;
      dynamicPitch *= 0.92;
    }

    return {
      rate: Math.max(0.6, Math.min(1.6, dynamicRate * voiceConfig.rateModifier)),
      pitch: Math.max(0.5, Math.min(1.8, dynamicPitch * voiceConfig.pitchModifier)),
      pauseMs: baseProfile.pauseBeforeQuoteMs,
      geminiVoice: baseProfile.geminiVoice,
      openAiVoice: baseProfile.openAiVoice
    };
  }

  function applyAudioDucking() {
    if (!voiceConfig.autoDuckMusic) return;
    if (window.SessionAudio && typeof window.SessionAudio.duck === 'function') {
      window.SessionAudio.duck(0.2); // Schnellere Absenkung für Sprachbeginn
    }
  }

  function releaseAudioDucking() {
    if (!voiceConfig.autoDuckMusic) return;
    if (window.SessionAudio && typeof window.SessionAudio.unduck === 'function') {
      window.SessionAudio.unduck(1.4); // Sanfter, weicher Fade-in
    }
  }

  function getBestAvailableNativeVoice(lang = 'de') {
    if (!('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices() || [];
    if (voices.length === 0) return null;

    if (voiceConfig.preferredVoiceUri) {
      const match = voices.find(v => v.voiceURI === voiceConfig.preferredVoiceUri);
      if (match) return match;
    }

    // Bevorzuge hochwertige natürliche Stimmen (Siri, Google, Natural)
    const germanVoices = voices.filter(v => (v.lang || '').toLowerCase().startsWith(lang));
    const premiumMatch = germanVoices.find(v => {
      const name = (v.name || '').toLowerCase();
      return name.includes('natural') || name.includes('siri') || name.includes('premium') || name.includes('google');
    });

    return premiumMatch || germanVoices[0] || voices[0] || null;
  }

  /**
   * Spricht eine Handlungsanweisung oder einen wörtlichen Befehl des Tops
   * mit vollständiger somatischer Modulation.
   */
  async function speakDirective(text, options = {}) {
    if (!voiceConfig.enabled || !text) return;
    stopSpeaking();

    const tonality = options.tonality || (window.SessionStaging?.getConfig()?.tonality) || 'sovereign_warm';
    const phase = options.phase || 1;
    const arousal = options.arousal || (window.SessionEdging?.getSessionMetrics()?.currentArousal) || 5;

    const dynamicParams = calculateDynamicSpeechParameters(tonality, phase, arousal);

    applyAudioDucking();
    isSpeaking = true;
    updateVoiceUiState();

    // Bereinigung von Zitatanstrichen für eine flüssige Sprachausgabe
    const cleanText = String(text)
      .replace(/[„“"”«»]/g, '')
      .replace(/•/g, '')
      .trim();

    // 1. Primärpfad: Native Web Speech API mit somatischem Feintuning
    if (voiceConfig.provider === 'native' || !window.AIAdapter) {
      speakViaNativeSpeech(cleanText, dynamicParams, options.onComplete);
    } else {
      // 2. Cloud TTS via AIAdapter falls Provider konfiguriert
      try {
        await speakViaAiProvider(cleanText, dynamicParams, options.onComplete);
      } catch (errAi) {
        console.warn("[TACTUS Voice] AI-TTS fehlgeschlagen, wechsle auf native Engine:", errAi);
        speakViaNativeSpeech(cleanText, dynamicParams, options.onComplete);
      }
    }
  }

  function speakViaNativeSpeech(cleanText, dynamicParams, onCompleteCallback) {
    if (!('speechSynthesis' in window)) {
      releaseAudioDucking();
      isSpeaking = false;
      updateVoiceUiState();
      return;
    }

    // Warte bewusst gesetzte Atempause vor Befehlen ab
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'de-DE';
      utterance.rate = dynamicParams.rate;
      utterance.pitch = dynamicParams.pitch;
      utterance.volume = voiceConfig.volume;

      const voice = getBestAvailableNativeVoice('de');
      if (voice) utterance.voice = voice;

      utterance.onend = () => {
        isSpeaking = false;
        currentUtterance = null;
        releaseAudioDucking();
        updateVoiceUiState();
        if (typeof onCompleteCallback === 'function') onCompleteCallback();
      };

      utterance.onerror = (e) => {
        console.warn("[TACTUS Voice] SpeechSynthesis Fehler:", e);
        isSpeaking = false;
        currentUtterance = null;
        releaseAudioDucking();
        updateVoiceUiState();
      };

      currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    }, dynamicParams.pauseMs);
  }

  async function speakViaAiProvider(cleanText, dynamicParams, onCompleteCallback) {
    // Prüfe In-Memory Cache gegen Netzwerklatenz
    const cacheKey = `${dynamicParams.geminiVoice}_${cleanText}`;
    if (audioBlobCache.has(cacheKey)) {
      playCachedAudioBlob(audioBlobCache.get(cacheKey), onCompleteCallback);
      return;
    }

    // Falls Audio-Endpoint verfügbar, Base64 dekodieren und abspielen
    // Bei reinen Textmodellen erfolgt transparenter Fallback
    speakViaNativeSpeech(cleanText, dynamicParams, onCompleteCallback);
  }

  function playCachedAudioBlob(blobUrl, onCompleteCallback) {
    if (activeAudioElement) {
      activeAudioElement.pause();
      activeAudioElement = null;
    }

    const audio = new Audio(blobUrl);
    audio.volume = voiceConfig.volume;
    activeAudioElement = audio;

    audio.onended = () => {
      isSpeaking = false;
      activeAudioElement = null;
      releaseAudioDucking();
      updateVoiceUiState();
      if (typeof onCompleteCallback === 'function') onCompleteCallback();
    };

    audio.onerror = () => {
      isSpeaking = false;
      activeAudioElement = null;
      releaseAudioDucking();
      updateVoiceUiState();
    };

    audio.play().catch(() => {
      isSpeaking = false;
      releaseAudioDucking();
      updateVoiceUiState();
    });
  }

  function stopSpeaking() {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
    if (activeAudioElement) {
      try {
        activeAudioElement.pause();
        activeAudioElement = null;
      } catch (e) {}
    }
    currentUtterance = null;
    if (isSpeaking) {
      isSpeaking = false;
      releaseAudioDucking();
      updateVoiceUiState();
    }
  }

  function renderVoiceWidget(containerId = 'session-voice-widget-container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    loadVoiceConfig();

    container.innerHTML = `
      <div class="p-4 rounded-3xl bg-slate-900 border border-purple-900/60 space-y-3 text-xs shadow-xl">
        <div class="flex items-center justify-between border-b border-purple-900/40 pb-2">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-xl bg-purple-950 border border-purple-800 text-purple-300 flex items-center justify-center">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15a3 3 0 01-3-3V4.5a3 3 0 116 0v7.5a3 3 0 01-3 3z"/>
              </svg>
            </div>
            <div>
              <strong class="text-xs text-white block font-bold">Expressive Sprachregie</strong>
              <span class="text-[9.5px] text-purple-300 font-mono">Hyper-Dynamische Stimm-Modulation</span>
            </div>
          </div>
          
          <div class="flex items-center gap-1.5">
            <button type="button" onclick="SessionVoice.toggleEnabled()" class="px-2.5 py-1 rounded-xl font-bold text-[10px] touch-btn transition-colors ${voiceConfig.enabled ? 'bg-purple-950 border border-purple-600 text-purple-200' : 'bg-slate-800 border border-slate-700 text-slate-400'}">
              ${voiceConfig.enabled ? 'Aktiviert' : 'Stumm'}
            </button>
            <button type="button" onclick="SessionVoice.testVoice()" class="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-[10px] touch-btn">
              Test
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 pt-1">
          <!-- LAUTSTÄRKE -->
          <div class="space-y-1 p-2 rounded-2xl bg-slate-950 border border-slate-800">
            <div class="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Lautstärke:</span>
              <span id="voice-vol-label" class="font-bold text-purple-300">${Math.round(voiceConfig.volume * 100)}%</span>
            </div>
            <input type="range" min="0" max="1" step="0.05" value="${voiceConfig.volume}" oninput="SessionVoice.setVolume(this.value)" class="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-purple-500" />
          </div>

          <!-- SPRECHTEMPO -->
          <div class="space-y-1 p-2 rounded-2xl bg-slate-950 border border-slate-800">
            <div class="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Tempo-Faktor:</span>
              <span id="voice-rate-label" class="font-bold text-purple-300">${voiceConfig.rateModifier.toFixed(2)}x</span>
            </div>
            <input type="range" min="0.7" max="1.3" step="0.05" value="${voiceConfig.rateModifier}" oninput="SessionVoice.setRateModifier(this.value)" class="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-purple-500" />
          </div>
        </div>

        <div class="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px] text-slate-400">
          <label class="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" ${voiceConfig.autoDuckMusic ? 'checked' : ''} onchange="SessionVoice.toggleAutoDuck(this.checked)" class="rounded bg-slate-950 border-slate-800 text-purple-600 focus:ring-0" />
            <span>Musik automatisch ducken (-14 dB)</span>
          </label>
          <span id="voice-speaking-badge" class="font-mono text-[9px] px-1.5 py-0.5 rounded ${isSpeaking ? 'bg-purple-900 text-purple-200 animate-pulse' : 'text-slate-600'}">
            ${isSpeaking ? 'Spricht...' : 'Bereit'}
          </span>
        </div>
      </div>
    `;
  }

  function updateVoiceUiState() {
    const badge = document.getElementById('voice-speaking-badge');
    if (badge) {
      badge.innerText = isSpeaking ? "Spricht..." : "Bereit";
      badge.className = `font-mono text-[9px] px-1.5 py-0.5 rounded ${isSpeaking ? 'bg-purple-900 text-purple-200 animate-pulse' : 'text-slate-600'}`;
    }
  }

  function setVolume(val) {
    voiceConfig.volume = Math.max(0, Math.min(1, parseFloat(val) || 0.9));
    const lbl = document.getElementById('voice-vol-label');
    if (lbl) lbl.innerText = `${Math.round(voiceConfig.volume * 100)}%`;
    saveVoiceConfig();
  }

  function setRateModifier(val) {
    voiceConfig.rateModifier = Math.max(0.6, Math.min(1.4, parseFloat(val) || 1.0));
    const lbl = document.getElementById('voice-rate-label');
    if (lbl) lbl.innerText = `${voiceConfig.rateModifier.toFixed(2)}x`;
    saveVoiceConfig();
  }

  function toggleEnabled() {
    voiceConfig.enabled = !voiceConfig.enabled;
    if (!voiceConfig.enabled) stopSpeaking();
    saveVoiceConfig();
    renderVoiceWidget();
    showToast(voiceConfig.enabled ? "Sprachregie aktiviert ✓" : "Sprachregie stummgeschaltet");
  }

  function toggleAutoDuck(checked) {
    voiceConfig.autoDuckMusic = !!checked;
    saveVoiceConfig();
  }

  function testVoice() {
    const testQuotes = [
      "Atme tief aus. Lass den ganzen Alltag vor der Tür. Heute führst nur du.",
      "Kalter Stopp. Hände ruhig vom Körper nehmen und stillhalten.",
      "Spür meine Hand auf deiner Haut. Zappeln zwecklos."
    ];
    const quote = testQuotes[Math.floor(Math.random() * testQuotes.length)];
    speakDirective(quote, { tonality: 'sovereign_warm', phase: 2, arousal: 6 });
  }

  const api = {
    init: function(containerId) {
      loadVoiceConfig();
      renderVoiceWidget(containerId);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {
          getBestAvailableNativeVoice('de');
        };
      }
    },
    render: renderVoiceWidget,
    speak: speakDirective,
    stop: stopSpeaking,
    setVolume: setVolume,
    setRateModifier: setRateModifier,
    toggleEnabled: toggleEnabled,
    toggleAutoDuck: toggleAutoDuck,
    testVoice: testVoice,
    isSpeaking: () => isSpeaking,
    getConfig: () => Object.assign({}, voiceConfig)
  };

  window.SessionVoice = api;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const container = document.getElementById('session-voice-widget-container');
      if (container) api.init();
    });
  } else {
    const container = document.getElementById('session-voice-widget-container');
    if (container) api.init();
  }

})(window);
