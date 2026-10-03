/**
 * js/session_audio.js
 * TACTUS WebAudio Soundscape-Engine, Hyperdynamische Musik-Matrix & Spotify Premium Connector (V3.0 Haute-Horlogerie)
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien nach Master-Roadbook:
 * - 100 % UTF-8 Integrität: Echte deutsche Umlaute (ä, ö, ü, ß) im gesamten Modul
 * - Haute-Horlogerie Audio-Physiologie: 55Hz Subspace Drone, 432Hz Vagus-Harmonie, Tantrischer Puls
 * - Echte Hyperdynamik: 4 kuratierte Musik-Klangwelten passend zu den 4 Top-Temperamenten:
 *     1. sovereign_warm: Melodic Downtempo / 432Hz Ambient
 *     2. sovereign_cool: Dark Ambient / Hypnotic Minimal Noir
 *     3. raw_primal: Dark Shamanic Tribal & Heavy Bass Pulse
 *     4. playful: Trip-Hop Noir / Sultry Beats
 * - Spotify Premium Integration (Paid Account): Werbefreies Streaming via Web Playback SDK & Connect
 * - Automatisches 60 % Audio-Ducking bei Sprachbefehlen (SessionVoice)
 * - Beat-Drop / Mute-Cut bei Kaltstopp (Reizabbruch)
 * - Taktiler Metronom- & Percussion-Clicker für Countdowns und Schwellentaktung
 * - Krisensicherer Multi-Stem WebAudio Synthesizer (100 % offline im Browser)
 * - Keine window.alert() / confirm() Aufrufe
 */

(function(window) {
  'use strict';

  const STORAGE_KEY_AUDIO_MUTED = 'tactus_audio_muted';
  const STORAGE_KEY_MASTER_VOL = 'tactus_audio_volume';
  const STORAGE_KEY_ACTIVE_PRESET = 'tactus_audio_preset';
  const STORAGE_KEY_SPOTIFY_TOKEN = 'tactus_spotify_premium_token';
  const STORAGE_KEY_SPOTIFY_CUSTOM_PLAYLIST = 'tactus_spotify_custom_playlist';

  // Kuratierte Spotify-Playlists für die 4 Tonalitäten (Werbefrei für Premium-Nutzer)
  const TONALITY_PLAYLISTS = {
    sovereign_warm: {
      id: 'sovereign_warm',
      title: 'Souverän & Zugewandt (Melodic Downtempo & 432Hz)',
      spotifyUri: 'spotify:playlist:37i9dQZF1DXdLEN7aqioXM',
      webUrl: 'https://open.spotify.com/playlist/37i9dQZF1DXdLEN7aqioXM',
      artists: 'Tycho, Bonobo, Kiasmos, Olafur Arnalds',
      tempoBpm: 65,
      synthProfile: 'vagus_432'
    },
    sovereign_cool: {
      id: 'sovereign_cool',
      title: 'Kühl & Distanziert (Dark Ambient & Minimal Noir)',
      spotifyUri: 'spotify:playlist:37i9dQZF1DX6xOPeSOGone',
      webUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX6xOPeSOGone',
      artists: 'Haxan Cloak, Bohren & der Club of Gore, Ben Frost',
      tempoBpm: 55,
      synthProfile: 'dark_drone'
    },
    raw_primal: {
      id: 'raw_primal',
      title: 'Körperlich & Instinktiv (Shamanic Tribal & Heavy Pulse)',
      spotifyUri: 'spotify:playlist:37i9dQZF1DWZqd5JICZI0u',
      webUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWZqd5JICZI0u',
      artists: 'Heilung, Danheim, Wardruna, Tiefbässe',
      tempoBpm: 72,
      synthProfile: 'tantric_pulse'
    },
    playful: {
      id: 'playful',
      title: 'Spöttisch & Neckend (Trip-Hop Noir & Sultry Beats)',
      spotifyUri: 'spotify:playlist:37i9dQZF1DXbSI9G72v6wA',
      webUrl: 'https://open.spotify.com/playlist/37i9dQZF1DXbSI9G72v6wA',
      artists: 'Massive Attack, Portishead, Two Feet',
      tempoBpm: 80,
      synthProfile: 'tantric_pulse'
    }
  };

  let audioEngineState = {
    ctx: null,
    masterGain: null,
    droneGain: null,
    duckGain: null,
    filterNode: null,
    activeNodes: [],
    activePreset: 'dark_drone',
    activeTonality: 'sovereign_warm',
    isPlaying: false,
    isDucked: false,
    isMuted: false,
    masterVolume: 0.75,
    energyLevel: 'calm', // 'calm' | 'driving'
    spotifyToken: null,
    spotifyPlayer: null,
    spotifyDeviceId: null,
    isSpotifyConnected: false,
    currentSpotifyPlaylist: null
  };

  function loadSettings() {
    try {
      audioEngineState.isMuted = localStorage.getItem(STORAGE_KEY_AUDIO_MUTED) === 'true';
      const savedVol = localStorage.getItem(STORAGE_KEY_MASTER_VOL);
      if (savedVol !== null) {
        audioEngineState.masterVolume = Math.max(0.0, Math.min(1.0, parseFloat(savedVol) || 0.75));
      }
      audioEngineState.activePreset = localStorage.getItem(STORAGE_KEY_ACTIVE_PRESET) || 'dark_drone';
      audioEngineState.spotifyToken = localStorage.getItem(STORAGE_KEY_SPOTIFY_TOKEN) || null;
      audioEngineState.currentSpotifyPlaylist = localStorage.getItem(STORAGE_KEY_SPOTIFY_CUSTOM_PLAYLIST) || null;
    } catch (e) {
      console.debug("[TACTUS Audio] Fehler beim Laden der Einstellungen:", e);
    }
  }

  function saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEY_AUDIO_MUTED, audioEngineState.isMuted ? 'true' : 'false');
      localStorage.setItem(STORAGE_KEY_MASTER_VOL, audioEngineState.masterVolume.toString());
      localStorage.setItem(STORAGE_KEY_ACTIVE_PRESET, audioEngineState.activePreset);
      if (audioEngineState.spotifyToken) {
        localStorage.setItem(STORAGE_KEY_SPOTIFY_TOKEN, audioEngineState.spotifyToken);
      } else {
        localStorage.removeItem(STORAGE_KEY_SPOTIFY_TOKEN);
      }
      if (audioEngineState.currentSpotifyPlaylist) {
        localStorage.setItem(STORAGE_KEY_SPOTIFY_CUSTOM_PLAYLIST, audioEngineState.currentSpotifyPlaylist);
      }
    } catch (e) {}
  }

  function ensureAudioContext() {
    if (typeof window === 'undefined') return false;

    if (!audioEngineState.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return false;

      audioEngineState.ctx = new AudioCtx();

      // Master Gain Node
      audioEngineState.masterGain = audioEngineState.ctx.createGain();
      audioEngineState.masterGain.gain.setValueAtTime(
        audioEngineState.isMuted ? 0.0 : audioEngineState.masterVolume, 
        audioEngineState.ctx.currentTime
      );

      // Ducking Gain Node (für weiches Absenken während Sprachausgabe)
      audioEngineState.duckGain = audioEngineState.ctx.createGain();
      audioEngineState.duckGain.gain.setValueAtTime(1.0, audioEngineState.ctx.currentTime);

      // Synthesizer Gain Node
      audioEngineState.droneGain = audioEngineState.ctx.createGain();
      audioEngineState.droneGain.gain.setValueAtTime(0.0, audioEngineState.ctx.currentTime);

      // Warmes Resonanzfilter (Lowpass mit leichter Betonung)
      audioEngineState.filterNode = audioEngineState.ctx.createBiquadFilter();
      audioEngineState.filterNode.type = 'lowpass';
      audioEngineState.filterNode.frequency.setValueAtTime(450, audioEngineState.ctx.currentTime);
      audioEngineState.filterNode.Q.setValueAtTime(2.0, audioEngineState.ctx.currentTime);

      // Graph verknüpfen: Synth -> DroneGain -> DuckGain -> Filter -> Master -> Destination
      audioEngineState.droneGain.connect(audioEngineState.duckGain);
      audioEngineState.duckGain.connect(audioEngineState.filterNode);
      audioEngineState.filterNode.connect(audioEngineState.masterGain);
      audioEngineState.masterGain.connect(audioEngineState.ctx.destination);
    }

    if (audioEngineState.ctx.state === 'suspended') {
      audioEngineState.ctx.resume();
    }

    return true;
  }

  function stopActiveNodes(fadeDuration = 0.8) {
    if (!audioEngineState.ctx || !audioEngineState.droneGain) return;

    try {
      const now = audioEngineState.ctx.currentTime;
      audioEngineState.droneGain.gain.cancelScheduledValues(now);
      audioEngineState.droneGain.gain.setValueAtTime(audioEngineState.droneGain.gain.value, now);
      audioEngineState.droneGain.gain.linearRampToValueAtTime(0.0001, now + fadeDuration);

      setTimeout(() => {
        audioEngineState.activeNodes.forEach(node => {
          try {
            if (typeof node.stop === 'function') node.stop();
            node.disconnect();
          } catch (e) {}
        });
        audioEngineState.activeNodes = [];
      }, (fadeDuration * 1000) + 50);
    } catch (e) {}
  }

  function build55HzSubspaceDrone(ctx) {
    const nodes = [];
    const now = ctx.currentTime;

    // Basis-Oszillator (55 Hz tiefes A)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(55, now);

    // Binaurale Schwebung (+4 Hz Theta-Welle für Trance-Induktion)
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(59, now);

    // Sub-Bass Obertongenerator (Dreiecks-Welle 110 Hz für Wärme)
    const osc3 = ctx.createOscillator();
    osc3.type = 'triangle';
    osc3.frequency.setValueAtTime(110, now);

    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(0.25, now);
    osc3.connect(subGain);

    // LFO für sanftes Atmen der Klanglandschaft (0.08 Hz)
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.08, now);

    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(120, now); // Moduliert das Filter um +/- 120 Hz
    lfo.connect(lfoGain);
    lfoGain.connect(audioEngineState.filterNode.frequency);

    osc1.connect(audioEngineState.droneGain);
    osc2.connect(audioEngineState.droneGain);
    subGain.connect(audioEngineState.droneGain);

    osc1.start(now);
    osc2.start(now);
    osc3.start(now);
    lfo.start(now);

    nodes.push(osc1, osc2, osc3, lfo, subGain, lfoGain);
    return nodes;
  }

  function build432HzVagusHarmony(ctx) {
    const nodes = [];
    const now = ctx.currentTime;

    // 432 Hz Grundschwingung (A4)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(432, now);

    // Harmonische Quinte (288 Hz D4)
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(288, now);

    // Tiefes Vagus-Fundament (108 Hz)
    const subOsc = ctx.createOscillator();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(108, now);

    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(0.4, now);
    subOsc.connect(subGain);

    // Zartes analoges Pink-Noise-Rauschen als Atem-Simulation
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2) * 0.06;
    }

    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = noiseBuffer;
    noiseNode.loop = true;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(600, now);
    noiseFilter.Q.setValueAtTime(1.5, now);

    noiseNode.connect(noiseFilter);
    noiseFilter.connect(audioEngineState.droneGain);

    osc1.connect(audioEngineState.droneGain);
    osc2.connect(audioEngineState.droneGain);
    subGain.connect(audioEngineState.droneGain);

    osc1.start(now);
    osc2.start(now);
    subOsc.start(now);
    noiseNode.start(now);

    nodes.push(osc1, osc2, subOsc, noiseNode, subGain, noiseFilter);
    return nodes;
  }

  function buildTantricPulse(ctx) {
    const nodes = [];
    const now = ctx.currentTime;

    // Sub-Bass (65 Hz Grundton)
    const bassOsc = ctx.createOscillator();
    bassOsc.type = 'sine';
    bassOsc.frequency.setValueAtTime(65, now);

    // Rhythmischer Puls-Verstärker (64 BPM Ruhepuls)
    const pulseGain = ctx.createGain();
    pulseGain.gain.setValueAtTime(0.2, now);

    // Pulsierender LFO
    const pulseLfo = ctx.createOscillator();
    pulseLfo.type = 'sine';
    pulseLfo.frequency.setValueAtTime(64 / 60, now); // ~1.06 Hz = 64 BPM

    const lfoDepth = ctx.createGain();
    lfoDepth.gain.setValueAtTime(0.45, now);
    pulseLfo.connect(lfoDepth);
    lfoDepth.connect(pulseGain.gain);

    bassOsc.connect(pulseGain);
    pulseGain.connect(audioEngineState.droneGain);

    bassOsc.start(now);
    pulseLfo.start(now);

    nodes.push(bassOsc, pulseGain, pulseLfo, lfoDepth);
    return nodes;
  }

  function playDrone(presetId = 'dark_drone') {
    if (!ensureAudioContext()) return;
    loadSettings();

    stopActiveNodes(0.5);
    audioEngineState.activePreset = presetId;
    saveSettings();

    if (presetId === 'silence') {
      audioEngineState.isPlaying = false;
      return;
    }

    setTimeout(() => {
      if (!audioEngineState.ctx) return;
      const now = audioEngineState.ctx.currentTime;

      // Filter-Frequenz je nach Preset einstellen
      if (presetId === 'vagus_432') {
        audioEngineState.filterNode.frequency.setValueAtTime(650, now);
        audioEngineState.activeNodes = build432HzVagusHarmony(audioEngineState.ctx);
      } else if (presetId === 'tantric_pulse') {
        audioEngineState.filterNode.frequency.setValueAtTime(500, now);
        audioEngineState.activeNodes = buildTantricPulse(audioEngineState.ctx);
      } else {
        // dark_drone default
        audioEngineState.filterNode.frequency.setValueAtTime(400, now);
        audioEngineState.activeNodes = build55HzSubspaceDrone(audioEngineState.ctx);
      }

      // Weiches Aufblenden (Fade-In über 1.2 Sekunden)
      audioEngineState.droneGain.gain.cancelScheduledValues(now);
      audioEngineState.droneGain.gain.setValueAtTime(0.0001, now);
      audioEngineState.droneGain.gain.linearRampToValueAtTime(0.7, now + 1.2);
      audioEngineState.isPlaying = true;
    }, 100);
  }

  function duck(targetFraction = 0.40, rampSec = 0.25) {
    if (!audioEngineState.ctx || !audioEngineState.duckGain) return;
    try {
      const now = audioEngineState.ctx.currentTime;
      audioEngineState.duckGain.gain.cancelScheduledValues(now);
      audioEngineState.duckGain.gain.setValueAtTime(audioEngineState.duckGain.gain.value, now);
      audioEngineState.duckGain.gain.linearRampToValueAtTime(targetFraction, now + rampSec);
      audioEngineState.isDucked = true;

      // Falls Spotify Web Playback aktiv ist, Lautstärke ebenfalls absenken
      if (audioEngineState.spotifyPlayer && typeof audioEngineState.spotifyPlayer.setVolume === 'function') {
        audioEngineState.spotifyPlayer.setVolume(targetFraction * audioEngineState.masterVolume);
      }
    } catch (e) {}
  }

  function unduck(rampSec = 1.0) {
    if (!audioEngineState.ctx || !audioEngineState.duckGain) return;
    try {
      const now = audioEngineState.ctx.currentTime;
      audioEngineState.duckGain.gain.cancelScheduledValues(now);
      audioEngineState.duckGain.gain.setValueAtTime(audioEngineState.duckGain.gain.value, now);
      audioEngineState.duckGain.gain.linearRampToValueAtTime(1.0, now + rampSec);
      audioEngineState.isDucked = false;

      // Spotify Lautstärke wiederherstellen
      if (audioEngineState.spotifyPlayer && typeof audioEngineState.spotifyPlayer.setVolume === 'function') {
        audioEngineState.spotifyPlayer.setVolume(audioEngineState.masterVolume);
      }
    } catch (e) {}
  }

  function executeColdStopBeatDrop() {
    if (!audioEngineState.ctx) return;
    try {
      const now = audioEngineState.ctx.currentTime;
      if (audioEngineState.droneGain) {
        audioEngineState.droneGain.gain.cancelScheduledValues(now);
        audioEngineState.droneGain.gain.setValueAtTime(audioEngineState.droneGain.gain.value, now);
        audioEngineState.droneGain.gain.linearRampToValueAtTime(0.0001, now + 0.08); // 80ms Stop-Cut
      }

      // Filter dramatisch nach unten ziehen
      if (audioEngineState.filterNode) {
        audioEngineState.filterNode.frequency.cancelScheduledValues(now);
        audioEngineState.filterNode.frequency.linearRampToValueAtTime(80, now + 0.1);
      }

      // Spotify sofort pausieren
      if (audioEngineState.spotifyPlayer && typeof audioEngineState.spotifyPlayer.pause === 'function') {
        audioEngineState.spotifyPlayer.pause();
      }
    } catch (e) {}
  }

  function playPercussionClick(freq = 440, durationMs = 40) {
    if (!ensureAudioContext()) return;
    try {
      const ctx = audioEngineState.ctx;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const clickGain = ctx.createGain();

      osc.type = freq > 500 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);

      clickGain.gain.setValueAtTime(0.18, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + (durationMs / 1000));

      osc.connect(clickGain);
      clickGain.connect(audioEngineState.masterGain);

      osc.start(now);
      osc.stop(now + (durationMs / 1000) + 0.01);
    } catch (e) {}
  }

  function setEnergyLevel(level = 'calm') {
    audioEngineState.energyLevel = level;
    if (!audioEngineState.ctx || !audioEngineState.filterNode) return;

    try {
      const now = audioEngineState.ctx.currentTime;
      audioEngineState.filterNode.frequency.cancelScheduledValues(now);
      audioEngineState.filterNode.frequency.setValueAtTime(audioEngineState.filterNode.frequency.value, now);

      if (level === 'driving') {
        // Höhere Obertöne & mehr Druck im Raum
        audioEngineState.filterNode.frequency.linearRampToValueAtTime(950, now + 1.5);
      } else {
        // Sanfter Sub-Bass & Beruhigung
        audioEngineState.filterNode.frequency.linearRampToValueAtTime(380, now + 1.5);
      }
    } catch (e) {}
  }

  function setMasterVolume(volFraction) {
    const clamped = Math.max(0.0, Math.min(1.0, parseFloat(volFraction) || 0.75));
    audioEngineState.masterVolume = clamped;
    saveSettings();

    if (audioEngineState.ctx && audioEngineState.masterGain && !audioEngineState.isMuted) {
      const now = audioEngineState.ctx.currentTime;
      audioEngineState.masterGain.gain.cancelScheduledValues(now);
      audioEngineState.masterGain.gain.linearRampToValueAtTime(clamped, now + 0.1);
    }

    if (audioEngineState.spotifyPlayer && typeof audioEngineState.spotifyPlayer.setVolume === 'function') {
      audioEngineState.spotifyPlayer.setVolume(clamped);
    }
  }

  function setMuted(muted) {
    audioEngineState.isMuted = !!muted;
    saveSettings();

    if (audioEngineState.ctx && audioEngineState.masterGain) {
      const now = audioEngineState.ctx.currentTime;
      audioEngineState.masterGain.gain.cancelScheduledValues(now);
      audioEngineState.masterGain.gain.linearRampToValueAtTime(
        audioEngineState.isMuted ? 0.0 : audioEngineState.masterVolume, 
        now + 0.1
      );
    }

    if (audioEngineState.isMuted && audioEngineState.spotifyPlayer && typeof audioEngineState.spotifyPlayer.pause === 'function') {
      audioEngineState.spotifyPlayer.pause();
    }
  }

  function setSpotifyPremiumToken(token) {
    audioEngineState.spotifyToken = token ? token.trim() : null;
    saveSettings();
    if (audioEngineState.spotifyToken) {
      initSpotifyWebPlaybackSDK();
    }
  }

  function initSpotifyWebPlaybackSDK() {
    if (!audioEngineState.spotifyToken || typeof window === 'undefined') return;

    // Spotify SDK Script dynamisch laden falls noch nicht da
    if (!document.getElementById('spotify-player-sdk-script')) {
      const script = document.createElement('script');
      script.id = 'spotify-player-sdk-script';
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;
      document.body.appendChild(script);
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'TACTUS Schlafzimmer-Regie (OLED)',
        getOAuthToken: cb => { cb(audioEngineState.spotifyToken); },
        volume: audioEngineState.masterVolume
      });

      player.addListener('ready', ({ device_id }) => {
        console.debug("[TACTUS Spotify] Playback SDK Bereit. Device ID:", device_id);
        audioEngineState.spotifyDeviceId = device_id;
        audioEngineState.isSpotifyConnected = true;
        audioEngineState.spotifyPlayer = player;
      });

      player.addListener('not_ready', ({ device_id }) => {
        console.debug("[TACTUS Spotify] Device getrennt:", device_id);
        audioEngineState.isSpotifyConnected = false;
      });

      player.addListener('initialization_error', ({ message }) => {
        console.warn("[TACTUS Spotify] Init Fehler:", message);
      });

      player.addListener('authentication_error', ({ message }) => {
        console.warn("[TACTUS Spotify] Auth Fehler (Token abgelaufen?):", message);
        audioEngineState.isSpotifyConnected = false;
      });

      player.connect();
    };
  }

  function playTonalityMusic(tonalityKey = 'sovereign_warm') {
    const profile = TONALITY_PLAYLISTS[tonalityKey] || TONALITY_PLAYLISTS.sovereign_warm;
    audioEngineState.activeTonality = tonalityKey;

    // 1. Wenn Spotify Web Playback SDK verbunden ist: Direkt abspielen
    if (audioEngineState.isSpotifyConnected && audioEngineState.spotifyDeviceId) {
      const uriToPlay = audioEngineState.currentSpotifyPlaylist || profile.spotifyUri;
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${audioEngineState.spotifyDeviceId}`, {
        method: 'PUT',
        body: JSON.stringify({ context_uri: uriToPlay }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${audioEngineState.spotifyToken}`
        }
      }).catch(err => {
        console.debug("[TACTUS Spotify] API Playback Fallback:", err);
      });
    }

    // 2. Parallele prozedurale Soundscape aktivieren für lückenlose Raumfüllung
    playDrone(profile.synthProfile);
  }

  const api = {
    init: function() {
      loadSettings();
      if (audioEngineState.spotifyToken) {
        initSpotifyWebPlaybackSDK();
      }
    },
    playDrone: playDrone,
    stopDrone: stopActiveNodes,
    duck: duck,
    unduck: unduck,
    coldStop: executeColdStopBeatDrop,
    playPercussionClick: playPercussionClick,
    setEnergyLevel: setEnergyLevel,
    setMasterVolume: setMasterVolume,
    getMasterVolume: () => audioEngineState.masterVolume,
    setMuted: setMuted,
    isMuted: () => audioEngineState.isMuted,
    toggleMute: () => { setMuted(!audioEngineState.isMuted); },
    setSpotifyToken: setSpotifyPremiumToken,
    getSpotifyToken: () => audioEngineState.spotifyToken,
    isSpotifyActive: () => audioEngineState.isSpotifyConnected,
    playTonalityMusic: playTonalityMusic,
    tonalityPlaylists: TONALITY_PLAYLISTS,
    getAudioState: () => Object.assign({}, audioEngineState)
  };

  window.SessionAudio = api;

  // AudioContext beim ersten Touch entsperren (iOS / Chrome Autoplay Fix)
  if (typeof window !== 'undefined') {
    const unlockAudio = () => {
      ensureAudioContext();
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
    window.addEventListener('click', unlockAudio, { passive: true });
    window.addEventListener('touchstart', unlockAudio, { passive: true });
  }

})(typeof window !== 'undefined' ? window : this);
