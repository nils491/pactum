/**
 * js/session_staging.js
 * TACTUS Schlafzimmer-Staging Cockpit, 4 Top-Dimensionen, Flow-Modus & DoF-Validierung (V3.0 Haute-Horlogerie)
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien nach Master-Roadbook:
 * - 100 % UTF-8 Integrität: Echte deutsche Umlaute (ä, ö, ü, ß) im gesamten Modul
 * - Haute-Horlogerie Palette: Reines OLED-Schwarz, Graphit, Champagner-Gold, Malachit, Cognac & Bordeaux
 * - Zwei-Wege-Strukturwahlschalter: 4-Phasen-Drehbuch vs. Freies Spiel & Somatischer Flow
 * - Sprachbegleitungs-Schalter: Voice-Assistance laut im Raum vs. stumm (rein optische Display-Regie)
 * - Soundscape- & Musik-Regie: WebAudio Drones (Subspace 55Hz, 432Hz Vagus, Puls) & Spotify-Kopplung
 * - Dynamische Motiv-Extraktion aus allen 36 Kapiteln des Fragebogens
 * - Strikter Tabu-Ausschluss (Note 1) & Priorisierung von 5/5 Doppel-Spitzen
 * - Transparenz über persönliche Sub-Notizen mit klickbaren Fragebogen-Deeplinks (#view=survey&item=X)
 * - 4 Top-Führungsdimensionen: Tonalität, Top-Agenda, Leitmotiv & Keuschheits-Triage
 * - DoF-Konfliktprüfung & Substitutions-Intelligenz via ToyCombinatorics
 * - RACK-Gesundheitspass: Aufklärende Schutz- & Notfall-Hinweise zur autonomen Kontrolle
 * - Multi-KI Drehbuch-Synthese via AIAdapter mit autarkem Heuristik-Fallback
 * - 100 % frei von infantilen System-Emojis, keine window.alert() / confirm() Aufrufe
 */

(function(window) {
  'use strict';

  const STORAGE_KEY_ACTIVE_SCRIPT = 'tactus_active_session_script';
  const STORAGE_KEY_STAGING_CONFIG = 'tactus_staging_config';
  const STORAGE_KEY_ANSWERS = 'kompass_answers';
  const STORAGE_KEY_MEDICAL_PASS = 'tactus_medical_pass';
  const STORAGE_KEY_OWNED = 'tactus_owned_equipment';
  const STORAGE_KEY_OWNED_LEGACY = 'kompass_owned_equipment';

  // Kuratierte Spotify-Schlafzimmer-Playlists
  const SPOTIFY_DEFAULT_PLAYLIST = 'https://open.spotify.com/playlist/37i9dQZF1DXdLEN7aqioXM';

  // 4 Tonalitäten des Führenden (Haute-Horlogerie Palette)
  const TONALITY_DEFINITIONS = {
    sovereign_warm: {
      id: 'sovereign_warm',
      label: 'Souverän & Zugewandt',
      tagline: 'Ruhige, tragende Führung mit spürbarer emotionaler Geborgenheit',
      borderClass: 'border-[#c5a880]',
      bgClass: 'bg-[#000000] text-[#f8fafc]'
    },
    sovereign_cool: {
      id: 'sovereign_cool',
      label: 'Kühl & Distanziert',
      tagline: 'Strikte Disziplin, formale Distanz und unnachgiebige Haltungsprüfung',
      borderClass: 'border-[#334155]',
      bgClass: 'bg-[#000000] text-[#f8fafc]'
    },
    raw_primal: {
      id: 'raw_primal',
      label: 'Körperlich & Instinktiv',
      tagline: 'Zupackender Griff, ungezähmte Dominanz und archaische Machtdynamik',
      borderClass: 'border-[#8a5232]',
      bgClass: 'bg-[#000000] text-[#f8fafc]'
    },
    playful: {
      id: 'playful',
      label: 'Spöttisch & Neckend',
      tagline: 'Dynamisches Teasing, unerwartete Wendungen und spielerische Strenge',
      borderClass: 'border-[#b3734a]',
      bgClass: 'bg-[#000000] text-[#f8fafc]'
    }
  };

  // 4 Ausrichtungen der Top-Lust
  const TOP_AGENDA_DEFINITIONS = {
    focus_top: {
      id: 'focus_top',
      label: 'Fokus auf meine Entladung',
      desc: 'Der Abend dient primär der Lust der Herrin; Bottom dient rückhaltlos.'
    },
    multi_climax: {
      id: 'multi_climax',
      label: 'Mehrfache Höhepunkte',
      desc: 'Verlängertes Plateau für den Top mit wiederholter Katharsis.'
    },
    cool_distance: {
      id: 'cool_distance',
      label: 'Kühle Führung (Keine eigene Lust)',
      desc: 'Reine Zucht-, Grenz- oder Haltungsführung ohne sexuelle Entladung des Tops.'
    },
    mutual_surrender: {
      id: 'mutual_surrender',
      label: 'Gemeinsame Katharsis',
      desc: 'Synchrones Erleben, sofern die Orgasmus-Ratio des Paares erfüllt ist.'
    }
  };

  // 4-Wege Keuschheits-Triage für verriegelte Partner
  const CHASTITY_TRIAGE_DEFINITIONS = {
    remain_locked: {
      id: 'remain_locked',
      label: 'Dauerhaft verriegelt bleiben',
      desc: 'Käfig bleibt den gesamten Abend geschlossen. Schwellkörperkontakt ausgeschlossen.'
    },
    tease_and_relock: {
      id: 'tease_and_relock',
      label: 'Öffnen zur Schwellen-Quälerei (Edging)',
      desc: 'Öffnung für gezielte Schwellenreize, danach zwingende Wiederverriegelung ohne Orgasmus.'
    },
    prostate_only: {
      id: 'prostate_only',
      label: 'Reizverlagerung (Nur P-Spot / Prostata)',
      desc: 'Penisschaft bleibt arretiert; Reizung erfolgt ausschließlich rektal/perineal.'
    },
    mercy_release: {
      id: 'mercy_release',
      label: 'Volle Freigabe (Gunst-Orgasmus)',
      desc: 'Vollständige Ejakulations-Erlaubnis als seltene, bewusst gewährte Gunst.'
    }
  };

  // Integrierte WebAudio Soundscape Drones
  const SOUNDSCAPE_PRESETS = {
    dark_drone: {
      id: 'dark_drone',
      label: 'Dark Subspace Drone',
      desc: 'Tiefe, trancefördernde Resonanzfrequenzen (55–110 Hz) für vollkommenes Loslassen'
    },
    vagus_432: {
      id: 'vagus_432',
      label: '432 Hz Vagus-Harmonie',
      desc: 'Sphärische Obertöne zur Aktivierung des Parasympathikus und Nervensystem-Beruhigung'
    },
    tantric_pulse: {
      id: 'tantric_pulse',
      label: 'Tantrischer Dominanz-Puls',
      desc: 'Rhythmisch pulsierender Bass-Schlag zur körperlichen Erdung und Taktung'
    },
    silence: {
      id: 'silence',
      label: 'Stille (Keine Soundscape)',
      desc: 'Nur Stimmen, Atemzüge und physische Hautreize im Schlafzimmer'
    }
  };

  let stagingConfig = {
    sessionMode: 'scripted', // 'scripted' | 'flow'
    tonality: 'sovereign_warm',
    topAgenda: 'focus_top',
    intensity: 6,
    motifId: null,
    chastityTriage: 'remain_locked',
    selectedEquipmentIds: [],
    customNotes: '',
    voiceEnabled: true,
    audioSoundscape: 'dark_drone',
    spotifyPlaylistUrl: SPOTIFY_DEFAULT_PLAYLIST
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

  function loadStagingState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_STAGING_CONFIG);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          stagingConfig = Object.assign({}, stagingConfig, parsed);
        }
      }
    } catch (e) {
      console.warn("[TACTUS Staging] Fehler beim Laden der Konfiguration:", e);
    }

    if (!Array.isArray(stagingConfig.selectedEquipmentIds) || stagingConfig.selectedEquipmentIds.length === 0) {
      try {
        const rawOwned = localStorage.getItem(STORAGE_KEY_OWNED) || localStorage.getItem(STORAGE_KEY_OWNED_LEGACY);
        if (rawOwned) {
          stagingConfig.selectedEquipmentIds = JSON.parse(rawOwned) || [];
        }
      } catch (e) {}
    }
  }

  function saveStagingState() {
    try {
      localStorage.setItem(STORAGE_KEY_STAGING_CONFIG, JSON.stringify(stagingConfig));
    } catch (e) {
      console.warn("[TACTUS Staging] Konnte Konfiguration nicht sichern:", e);
    }
  }

  function extractDynamicMotifCandidates() {
    let topRole = 'A';
    let bottomRole = 'B';

    if (window.HubContext && typeof window.HubContext.getRoles === 'function') {
      const r = window.HubContext.getRoles();
      topRole = r.topRole;
      bottomRole = r.bottomRole;
    }

    let answers = {};
    try {
      const raw = localStorage.getItem(STORAGE_KEY_ANSWERS);
      if (raw) answers = JSON.parse(raw) || {};
    } catch (e) {}

    const ansTop = answers[topRole] || {};
    const ansBottom = answers[bottomRole] || {};

    const p1 = window.surveyChaptersPart1 || [];
    const p2 = window.surveyChaptersPart2 || [];
    const p3 = window.surveyChaptersPart3 || [];
    const allChapters = p1.concat(p2).concat(p3);
    const candidates = [];

    allChapters.forEach(ch => {
      (ch.items || []).forEach(it => {
        if (it.type === 'choice') return;

        const sTop = ansTop[`it_${it.id}_r1`];
        const sBottom = ansBottom[`it_${it.id}_r2`];
        const subNote = (ansBottom[`note_${it.id}`] || '').trim();
        const topNote = (ansTop[`note_${it.id}`] || '').trim();
        const isShame = ansBottom[`shame_${it.id}`] === true;

        if (sBottom === 1) return; // Tabus strikt ausschließen

        const topWants = typeof sTop === 'number' && sTop >= 4;
        const isDoubleFive = sTop === 5 && sBottom === 5;
        const isHighSynergy = sTop >= 4 && sBottom >= 4;
        const isBridge = (sTop >= 4 && sBottom === 3) || (sTop === 3 && sBottom >= 4);

        if (topWants || isDoubleFive || isHighSynergy || isBridge) {
          let scoreWeight = (sTop || 0) * 0.6 + (sBottom || 0) * 0.4;
          if (isDoubleFive) scoreWeight += 2.0;

          candidates.push({
            id: `motif_${it.id}`,
            itemId: it.id,
            chapterId: ch.id,
            chapterTitle: ch.title,
            title: it.title,
            desc: it.desc,
            somaticZone: it.somaticZone || 'full_body',
            equipmentTags: it.equipmentTags || [],
            sTop: sTop !== undefined ? sTop : null,
            sBottom: sBottom !== undefined ? sBottom : null,
            subNote: subNote,
            topNote: topNote,
            isShame: isShame,
            isDoubleFive: isDoubleFive,
            isHighSynergy: isHighSynergy,
            isBridge: isBridge,
            scoreWeight: scoreWeight
          });
        }
      });
    });

    candidates.sort((a, b) => b.scoreWeight - a.scoreWeight);

    if (candidates.length === 0) {
      return [
        {
          id: 'motif_fallback_kneeling',
          itemId: 49,
          chapterId: 9,
          chapterTitle: 'Kapitel 9: BDSM-Basics',
          title: 'Körperliche Ehrerbietung & Kniestand-Appell',
          desc: 'Aufrechter Kniestand vor dem Top mit ruhigem Blickkontakt und bewusster Atemführung.',
          somaticZone: 'limbs_ankles_feet',
          equipmentTags: [],
          sTop: 5,
          sBottom: 4,
          subNote: '',
          topNote: '',
          isDoubleFive: false,
          isHighSynergy: true
        },
        {
          id: 'motif_fallback_spanking',
          itemId: 56,
          chapterId: 11,
          chapterTitle: 'Kapitel 11: Spanking',
          title: 'Spanking mit der flachen Hand',
          desc: 'Rhythmische Treffer auf das Gesäß zur vegetativen Erdung und Durchblutung.',
          somaticZone: 'gluteal_pelvis',
          equipmentTags: [],
          sTop: 5,
          sBottom: 4,
          subNote: '',
          topNote: '',
          isDoubleFive: false,
          isHighSynergy: true
        }
      ];
    }

    return candidates;
  }

  function evaluateDynamicConflicts(motif, selectedEquipmentIds) {
    if (!window.ToyCombinatorics || typeof window.ToyCombinatorics.validateActionFeasibility !== 'function') {
      return { feasible: true, conflicts: [], substitutions: [] };
    }

    let allCatalog = [];
    if (window.EquipmentCatalog && typeof window.EquipmentCatalog.getAll === 'function') {
      allCatalog = window.EquipmentCatalog.getAll();
    }

    const activeToys = allCatalog.filter(it => selectedEquipmentIds.includes(it.id));
    const actionDescriptor = {
      title: motif ? motif.title : 'Session',
      somaticZone: motif ? motif.somaticZone : 'full_body',
      requiresFaculties: [],
      tags: motif ? (motif.equipmentTags || []) : []
    };

    if (motif) {
      if (motif.somaticZone === 'head_mouth' || motif.equipmentTags.includes('gag')) {
        actionDescriptor.requiresTongue = true;
      }
      if (motif.title.toLowerCase().includes('zählen') || motif.title.toLowerCase().includes('appell')) {
        actionDescriptor.requiresSpeech = true;
      }
      if (motif.title.toLowerCase().includes('edging') || motif.title.toLowerCase().includes('penis')) {
        actionDescriptor.requiresShaftContact = true;
      }
    }

    return window.ToyCombinatorics.validateActionFeasibility(actionDescriptor, activeToys);
  }

  function getMedicalPassAwareness() {
    let pass = {};
    try {
      const raw = localStorage.getItem(STORAGE_KEY_MEDICAL_PASS);
      if (raw) pass = JSON.parse(raw);
    } catch (e) {}

    const notices = [];

    if (pass.hasDiabetes) {
      notices.push({
        type: 'info_control',
        title: 'Diabetes / Hypoglykämie-Vorsorge',
        desc: 'Auf Notfall vorbereitet sein: Traubenzucker oder gezuckertes Getränk am Bett bereithalten. Bei längerer Fixierung Durchblutung der Extremitäten im Blick behalten.'
      });
    }
    if (pass.hasAsthma) {
      notices.push({
        type: 'info_control',
        title: 'Asthma / Atemeinschränkung',
        desc: 'Notfall-Inhalator in Griffweite deponieren. Bei Atembegrenzungen oder Knebeln achtsam kontrollieren.'
      });
    }
    if (pass.hasNeuropathy) {
      notices.push({
        type: 'info_control',
        title: 'Neuropathie / Taubheitskontrolle',
        desc: 'Gedämpftes Schmerzempfinden beachten: Regelmäßiger 2-Sekunden Kapillar-Refill-Test an Fingern und Zehen zur Durchblutungskontrolle empfohlen.'
      });
    }
    if (pass.hasBloodThinners) {
      notices.push({
        type: 'info_control',
        title: 'Gerinnungshemmer / Hämatomneigung',
        desc: 'Erhöhte Neigung zu Blutergüssen: Intensität von Schlagwerkzeugen dosiert anpassen und Hautbild beobachten.'
      });
    }
    if (pass.hasLatexAllergy) {
      notices.push({
        type: 'info_warning',
        title: 'Latex-Allergie des Partners',
        desc: 'Kontaktschranke aktiv: Ausschließlich Ausrüstung aus medizinischem Silikon, Leder oder Textil verwenden.'
      });
    }
    if (pass.hasHypermobility) {
      notices.push({
        type: 'info_control',
        title: 'Hypermobilität / Gelenkschutz',
        desc: 'Gelenküberbeweglichkeit beachten: Bei Fesselung natürliche Winkel wahren und Überstreckungen vermeiden.'
      });
    }
    if (pass.customTriggers && pass.customTriggers.trim().length > 0) {
      notices.push({
        type: 'info_trauma',
        title: 'Hinterlegte Trigger & Grenzen des Partners',
        desc: `Persönliche Notiz: „${escapeHtml(pass.customTriggers.trim())}“`
      });
    }

    return notices;
  }

  async function generateBedroomScript() {
    loadStagingState();
    const candidateMotifs = extractDynamicMotifCandidates();
    const activeMotif = candidateMotifs.find(m => m.id === stagingConfig.motifId) || candidateMotifs[0];

    let names = { A: 'Top', B: 'Bottom' };
    let topRole = 'A';
    let bottomRole = 'B';

    if (window.HubContext && typeof window.HubContext.getRoles === 'function') {
      const r = window.HubContext.getRoles();
      topRole = r.topRole;
      bottomRole = r.bottomRole;
      names = window.HubContext.getNames();
    }

    const topName = names[topRole] || 'Top';
    const subName = names[bottomRole] || 'Bottom';
    const tonality = stagingConfig.tonality || 'sovereign_warm';
    const intensity = stagingConfig.intensity || 6;
    const agenda = stagingConfig.topAgenda || 'focus_top';
    const isFlowMode = stagingConfig.sessionMode === 'flow';

    showToast(isFlowMode ? "Initialisiere Somatischen Flow (Freies Spiel)..." : "Synthetisiere 4-Phasen Schlafzimmer-Drehbuch...");

    let generatedScript = null;

    if (isFlowMode) {
      generatedScript = {
        sessionTitle: `${activeMotif.title} (Freier Flow)`,
        sessionMode: 'flow',
        tonality: tonality,
        intensity: intensity,
        topAgenda: agenda,
        voiceEnabled: !!stagingConfig.voiceEnabled,
        audioSoundscape: stagingConfig.audioSoundscape || 'dark_drone',
        spotifyPlaylistUrl: stagingConfig.spotifyPlaylistUrl || SPOTIFY_DEFAULT_PLAYLIST,
        leadMotif: activeMotif,
        phases: [
          {
            phaseIndex: 1,
            title: `Freies Spiel: ${activeMotif.title}`,
            instruction: `Offener somatischer Flow ohne starren Phasen-Timer. Führe nach Intuition und Körperfeedback. Du bestimmst Tempo, Züchtigung und Schwellen.`,
            topDialogueQuote: `„Heute gibt es keinen Plan außer meiner Führung. Lass dich ganz fallen.“`,
            somaticZone: activeMotif.somaticZone || "full_body",
            estimatedMinutes: 60
          }
        ],
        reverseAftercareInstructions: {
          subServiceForTop: `Schweigende Nackenmassage und warmen Tee für ${topName}`,
          vagusRegulation: "Gewichtsdecke auflegen und 4-7-8 Vagus-Atmung zur Kreislaufstabilisierung",
          equipmentDisinfection: "Ausrüstung desinfizieren und diskret im Schrank verstauen"
        }
      };
    } else {
      if (window.AIAdapter && typeof window.AIAdapter.generateText === 'function') {
        try {
          let systemPrompt = "Du bist der somatische Schlafzimmer-Live-Regisseur des Beziehungs-Betriebssystems TACTUS (tactus.digital).";
          if (window.HubContext && typeof window.HubContext.getLanguageDoctrine === 'function') {
            systemPrompt += "\n\n" + window.HubContext.getLanguageDoctrine();
          }

          const userPrompt = `
Erstelle für ${topName} (Top) eine präzise, 4-phasige Live-Regie zur Führung von ${subName} (Bottom).

KONTEXT DER SESSION:
- Tonalität: ${tonality}
- Ziel-Intensität: ${intensity} von 10
- Hauptmotiv: ${activeMotif.title} (Zone: ${activeMotif.somaticZone})
- Ausrichtung der Top-Lust: ${TOP_AGENDA_DEFINITIONS[agenda]?.label || agenda}
- Keuschheits-Entscheid: ${CHASTITY_TRIAGE_DEFINITIONS[stagingConfig.chastityTriage]?.label || 'Standard'}
${activeMotif.subNote ? `- WICHTIGE NOTIZ DES SUBS ZU DIESEM MOTIV: „${activeMotif.subNote}“` : ''}

STRUKTUR DER 4 PHASEN:
Phase 1: Transition & Körperliche Erdung (Alltag abstreifen, Kniestand, Atemrhythmus)
Phase 2: Machtaufbau & Reizvektoren (Ausarbeitung des Motivs '${activeMotif.title}')
Phase 3: Katharsis & Lust des Tops (Fokus auf Erregung von ${topName}; Bottom dient)
Phase 4: Reverse Aftercare & Rüst-Pflege (Bottom versorgt Top; Vagus-Atmung & Toy-Desinfektion)

Antworte ausschließlich als wohlgeformtes, valides JSON ohne Markdown-Codeblöcke:
{
  "sessionTitle": "${activeMotif.title} (${TONALITY_DEFINITIONS[tonality]?.label || 'Souverän'})",
  "tonality": "${tonality}",
  "intensity": ${intensity},
  "topAgenda": "${agenda}",
  "phases": [
    {
      "phaseIndex": 1,
      "title": "Phase 1: Transition & Erdung",
      "instruction": "Haltungsanweisung für ${subName}",
      "topDialogueQuote": "Wörtlicher Befehl von ${topName} in Anführungszeichen",
      "somaticZone": "head_eyes",
      "estimatedMinutes": 8
    },
    {
      "phaseIndex": 2,
      "title": "Phase 2: Somatischer Machtaufbau",
      "instruction": "Ausführung von '${activeMotif.title}'",
      "topDialogueQuote": "Wörtlicher Befehl von ${topName}",
      "somaticZone": "${activeMotif.somaticZone}",
      "estimatedMinutes": 12
    },
    {
      "phaseIndex": 3,
      "title": "Phase 3: Katharsis (Fokus auf mich)",
      "instruction": "Bedienung der Herrin durch den Bottom",
      "topDialogueQuote": "Wörtlicher Befehl von ${topName}",
      "somaticZone": "genital_vulva_clitoris",
      "estimatedMinutes": 15
    },
    {
      "phaseIndex": 4,
      "title": "Phase 4: Reverse Aftercare & Rüst-Pflege",
      "instruction": "Versorgung des Tops, Deckenruhe und Reinigung",
      "topDialogueQuote": "Wörtlicher Befehl von ${topName}",
      "somaticZone": "back_flanks",
      "estimatedMinutes": 10
    }
  ],
  "reverseAftercareInstructions": {
    "subServiceForTop": "Warmer Tee, Nackenmassage und Deckenruhe für ${topName}",
    "vagusRegulation": "Gewichtsdecke auflegen und 4-7-8 Vagus-Atmung gegen Kältezittern",
    "equipmentDisinfection": "Diskrete Desinfektion aller eingesetzten Ausrüstungsgegenstände"
  }
}
`;

          const aiResponse = await window.AIAdapter.generateText({
            systemPrompt: systemPrompt,
            userPrompt: userPrompt,
            temperature: 0.65,
            returnJson: true
          });

          if (aiResponse && Array.isArray(aiResponse.phases) && aiResponse.phases.length >= 3) {
            generatedScript = aiResponse;
          }
        } catch (errAi) {
          console.debug("[TACTUS Staging] KI-Drehbuch fehlgeschlagen, nutze Heuristik:", errAi);
        }
      }

      if (!generatedScript) {
        generatedScript = synthesizeProceduralScript(activeMotif, tonality, intensity, agenda, topName, subName);
      }

      generatedScript.sessionMode = 'scripted';
      generatedScript.voiceEnabled = !!stagingConfig.voiceEnabled;
      generatedScript.audioSoundscape = stagingConfig.audioSoundscape || 'dark_drone';
      generatedScript.spotifyPlaylistUrl = stagingConfig.spotifyPlaylistUrl || SPOTIFY_DEFAULT_PLAYLIST;
    }

    try {
      sessionStorage.setItem(STORAGE_KEY_ACTIVE_SCRIPT, JSON.stringify(generatedScript));
    } catch (e) {}

    // Soundscape vorab starten falls aktiviert
    if (window.SessionAudio && typeof window.SessionAudio.playDrone === 'function') {
      if (stagingConfig.audioSoundscape && stagingConfig.audioSoundscape !== 'silence') {
        try {
          window.SessionAudio.playDrone(stagingConfig.audioSoundscape);
        } catch (eAudio) {}
      }
    }

    // Übergabe an SessionLive
    if (window.SessionLive && typeof window.SessionLive.startWithScript === 'function') {
      const stagingEl = document.getElementById('view-session-staging');
      const liveEl = document.getElementById('view-session-live');
      if (stagingEl && liveEl) {
        stagingEl.classList.add('hidden');
        liveEl.classList.remove('hidden');
      }
      window.SessionLive.startWithScript(generatedScript);
    } else {
      showToast("Drehbuch bereitgelegt");
    }
  }

  function synthesizeProceduralScript(motif, tonality, intensity, agenda, topName, subName) {
    let quotePhase1 = "„Atme tief aus. Lass den Alltag draußen vor der Tür. Heute zähle nur ich.“";
    let quotePhase2 = "„Du spürst jetzt ganz genau, wer hier führt. Halt still.“";
    let quotePhase3 = "„Konzentrier dich ganz auf meine Erregung. Kein Gedanke an deine eigene Befriedigung.“";
    let quotePhase4 = "„Guter Dienst. Jetzt Deckenruhe für uns beide.“";

    if (tonality === 'sovereign_cool') {
      quotePhase1 = "„Augen nach unten. Bewegungslos verharren, bis ich das Wort an dich richte.“";
      quotePhase2 = "„Zähne zusammenbeißen. Du hältst das aus. Zeig mir deine Haltung.“";
      quotePhase3 = "„Du existierst in diesem Moment nur, um meine Lust zu stillen.“";
      quotePhase4 = "„Räume schweigend auf, versorge meinen Nacken und zieh dich zurück.“";
    } else if (tonality === 'raw_primal') {
      quotePhase1 = "„Knie dich vor mich. Ich will deinen Atem auf meiner Haut spüren.“";
      quotePhase2 = "„Jetzt gehört dein Körper ganz mir. Wag es nicht nachzugeben.“";
      quotePhase3 = "„Gib mir alles. Heute nimmst du dir gar nichts.“";
      quotePhase4 = "„Komm her. Halt mich fest und wärme mich.“";
    } else if (tonality === 'playful') {
      quotePhase1 = "„Na, bereit für heute? Knie dich hin und zeig mir ein Lächeln.“";
      quotePhase2 = "„Das war erst das Vorgeplänkel. Jetzt wird es interessant.“";
      quotePhase3 = "„Verwöhn mich, solange ich es dir gestatte.“";
      quotePhase4 = "„Du warst brav. Jetzt darfst du dich um meine Füße kümmern.“";
    }

    return {
      sessionTitle: `${motif.title} (${TONALITY_DEFINITIONS[tonality]?.label || 'Souverän'})`,
      tonality: tonality,
      intensity: intensity,
      topAgenda: agenda,
      phases: [
        {
          phaseIndex: 1,
          title: "Phase 1: Transition & Körperliche Erdung",
          instruction: `Aufrechter Kniestand von ${subName} vor deinen Knien. Ruhiger Blickkontakt für 60 Sekunden und synchrone 4-7-8 Atemzüge.`,
          topDialogueQuote: quotePhase1,
          somaticZone: "head_eyes",
          estimatedMinutes: 8
        },
        {
          phaseIndex: 2,
          title: `Phase 2: Somatischer Machtaufbau (${motif.title})`,
          instruction: `Präzise Ausführung von '${motif.title}'. Rhythmus einhalten, Grenzen wahren und Atmung beobachten.`,
          topDialogueQuote: quotePhase2,
          somaticZone: motif.somaticZone || "gluteal_pelvis",
          estimatedMinutes: 12
        },
        {
          phaseIndex: 3,
          title: "Phase 3: Katharsis (Fokus auf mich)",
          instruction: `${subName} bedient ${topName} vollständig. Takt und Intensität werden allein vom Top bestimmt.`,
          topDialogueQuote: quotePhase3,
          somaticZone: "genital_vulva_clitoris",
          estimatedMinutes: 15
        },
        {
          phaseIndex: 4,
          title: "Phase 4: Reverse Aftercare & Rüst-Pflege",
          instruction: `${subName} reicht warmes Wasser/Tee, legt die Gewichtsdecke auf ${topName}, massiert die Schultern und desinfiziert genutzte Ausrüstung.`,
          topDialogueQuote: quotePhase4,
          somaticZone: "back_flanks",
          estimatedMinutes: 10
        }
      ],
      reverseAftercareInstructions: {
        subServiceForTop: `Schweigende Nackenmassage und Reichen von warmem Tee durch ${subName}`,
        vagusRegulation: "Gewichtsdecke auflegen und 4-7-8 Vagus-Atmung zur Kreislaufstabilisierung",
        equipmentDisinfection: "Ausrüstung mit Isopropanol oder Pflegespray desinfizieren und verstauen"
      }
    };
  }

  function renderStagingCockpit(containerId = 'staging-cockpit-container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    loadStagingState();
    const candidateMotifs = extractDynamicMotifCandidates();

    if (!stagingConfig.motifId && candidateMotifs.length > 0) {
      stagingConfig.motifId = candidateMotifs[0].id;
    }

    const activeMotif = candidateMotifs.find(m => m.id === stagingConfig.motifId) || candidateMotifs[0];
    const conflictAnalysis = evaluateDynamicConflicts(activeMotif, stagingConfig.selectedEquipmentIds);
    const healthNotices = getMedicalPassAwareness();

    let allCatalog = [];
    if (window.EquipmentCatalog && typeof window.EquipmentCatalog.getAll === 'function') {
      allCatalog = window.EquipmentCatalog.getAll();
    }

    const isScripted = stagingConfig.sessionMode !== 'flow';

    container.innerHTML = `
      <div class="space-y-4 max-w-2xl mx-auto text-xs animate-fade-in font-sans">
        
        <!-- HEADER KACHEL (HAUTE HORLOGERIE & STATUS) -->
        <div class="p-4 sm:p-5 rounded-3xl bg-[#090d14] border border-[#1e2638] shadow-2xl space-y-3">
          <div class="flex items-center justify-between border-b border-[#1e2638]/60 pb-3 gap-2">
            <div class="space-y-0.5 min-w-0 flex-1 pr-2">
              <span class="text-[9.5px] font-mono uppercase tracking-wider text-[#c5a880] font-bold block truncate">
                Schlafzimmer-Staging Cockpit
              </span>
              <h2 class="text-base sm:text-lg font-serif text-[#f8fafc] font-normal truncate">
                Session-Kalibrierung vor dem Eintreten
              </h2>
            </div>
            <span class="px-2.5 py-1 rounded-xl bg-[#000000] text-[#c5a880] font-mono text-[10px] font-bold border border-[#c5a880]/40 flex-shrink-0">
              Exklusiv Top
            </span>
          </div>
          <p class="text-[11px] text-[#94a3b8] leading-relaxed">
            Stimme Struktur, Musik, Haltung und Werkzeuge ab, bevor du das Schlafzimmer betrittst. Schließt physische Widersprüche (DoF) automatisch aus.
          </p>
        </div>

        <!-- 0. STRUKTUR-MODUS: 4-PHASEN-DREHBUCH VS. FREIES SPIEL (FLOW) -->
        <div class="p-4 sm:p-5 rounded-3xl bg-[#090d14] border border-[#1e2638] space-y-3 shadow-xl">
          <div class="flex items-center justify-between border-b border-[#1e2638]/60 pb-2">
            <div>
              <strong class="text-xs text-[#f8fafc] block font-bold">Ablauf &amp; Struktur der Session:</strong>
              <span class="text-[10px] text-[#94a3b8]">Wähle zwischen geführter Phasen-Taktung oder freiem Flow</span>
            </div>
            <span class="text-[9.5px] font-mono font-bold ${isScripted ? 'text-[#c5a880]' : 'text-[#b3734a]'}">
              ${isScripted ? 'Drehbuch aktiv' : 'Flow aktiv'}
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button type="button" onclick="SessionStaging.setSessionMode('scripted')" class="p-3.5 rounded-2xl border text-left transition-all touch-pad ${isScripted ? 'bg-[#000000] border-[#c5a880] text-[#f8fafc] shadow-md' : 'bg-[#090d14] border-[#1e2638] text-[#94a3b8] hover:text-[#f8fafc]'}">
              <div class="flex items-center justify-between">
                <strong class="text-xs block font-bold text-[#f8fafc]">1. 4-Phasen-Drehbuch</strong>
                <span class="text-xs font-mono font-bold ${isScripted ? 'text-[#c5a880]' : 'text-[#94a3b8]'}">${isScripted ? '✓' : '○'}</span>
              </div>
              <span class="text-[10px] block mt-1 leading-snug ${isScripted ? 'text-slate-200' : 'text-[#94a3b8]'}">
                Geführte Struktur: Transition (Erdung) ➔ Reizaufbau ➔ Katharsis (Top-Lust) ➔ Reverse Aftercare.
              </span>
            </button>

            <button type="button" onclick="SessionStaging.setSessionMode('flow')" class="p-3.5 rounded-2xl border text-left transition-all touch-pad ${!isScripted ? 'bg-[#000000] border-[#b3734a] text-[#f8fafc] shadow-md' : 'bg-[#090d14] border-[#1e2638] text-[#94a3b8] hover:text-[#f8fafc]'}">
              <div class="flex items-center justify-between">
                <strong class="text-xs block font-bold text-[#f8fafc]">2. Freies Spiel &amp; Flow</strong>
                <span class="text-xs font-mono font-bold ${!isScripted ? 'text-[#b3734a]' : 'text-[#94a3b8]'}">${!isScripted ? '✓' : '○'}</span>
              </div>
              <span class="text-[10px] block mt-1 leading-snug ${!isScripted ? 'text-[#dfcaa9]' : 'text-[#94a3b8]'}">
                Offener Begleiter ohne Zeitdruck: Aufwärts zählende Stoppuhr, freier Zuchteinschub, Schwellen &amp; Aftercare nach Gefühl.
              </span>
            </button>
          </div>
        </div>

        <!-- ATMOSPHÄRE, MUSIK & SPRACHBEGLEITUNG -->
        <div class="p-4 sm:p-5 rounded-3xl bg-[#090d14] border border-[#1e2638] space-y-3.5 shadow-xl">
          <div class="flex items-center justify-between border-b border-[#1e2638]/60 pb-2">
            <div>
              <strong class="text-xs text-[#f8fafc] block font-bold">Atmosphäre: Soundscapes, Spotify &amp; Sprache:</strong>
              <span class="text-[10px] text-[#94a3b8]">Akustische Führung im Schlafzimmer</span>
            </div>
            <span class="text-[9.5px] font-mono text-[#c5a880] font-bold">Audio-Regie</span>
          </div>

          <!-- SPRACHAUSGABE AN / AUS -->
          <div class="p-3 rounded-2xl bg-[#000000] border border-[#1e2638] flex items-center justify-between">
            <div class="space-y-0.5 pr-2">
              <strong class="text-xs text-[#f8fafc] block font-bold">Sprachausgabe im Raum (Voice-Guide):</strong>
              <span class="text-[10px] text-[#94a3b8] block leading-snug">
                Spricht Befehle, Zähltakte und Kaltstopps laut über den Lautsprecher aus.
              </span>
            </div>
            <button type="button" onclick="SessionStaging.toggleVoice()" class="px-3.5 py-1.5 rounded-xl font-bold font-mono text-xs touch-pad transition-colors ${stagingConfig.voiceEnabled ? 'bg-[#c5a880] text-black shadow-sm' : 'bg-[#090d14] border border-[#1e2638] text-[#94a3b8]'}">
              ${stagingConfig.voiceEnabled ? 'Laut aktiv ✓' : 'Stumm (Nur Display)'}
            </button>
          </div>

          <!-- SOUNDSCAPE PRESETS -->
          <div class="space-y-1.5">
            <span class="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8] font-bold block">Integrierte WebAudio-Soundscape (Drones):</span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              ${Object.values(SOUNDSCAPE_PRESETS).map(snd => {
                const isSelected = stagingConfig.audioSoundscape === snd.id;
                return `
                  <button type="button" onclick="SessionStaging.setSoundscape('${snd.id}')" class="p-2.5 rounded-xl border text-left transition-all touch-pad ${isSelected ? 'bg-[#000000] border-[#c5a880] text-[#f8fafc]' : 'bg-[#090d14] border-[#1e2638] text-[#94a3b8] hover:text-[#f8fafc]'}">
                    <div class="flex items-center justify-between">
                      <strong class="text-[11px] block font-bold text-[#f8fafc]">${escapeHtml(snd.label)}</strong>
                      <span class="text-xs font-mono font-bold ${isSelected ? 'text-[#c5a880]' : 'text-[#1e2638]'}">${isSelected ? '✓' : '○'}</span>
                    </div>
                    <span class="text-[9.5px] block mt-0.5 leading-snug ${isSelected ? 'text-slate-200' : 'text-[#94a3b8]'}">${escapeHtml(snd.desc)}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- SPOTIFY INTEGRATION -->
          <div class="p-3.5 rounded-2xl bg-[#000000] border border-[#1e2638] space-y-2">
            <div class="flex items-center justify-between">
              <strong class="text-xs text-[#f8fafc] block font-bold flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-[#2e5746] animate-pulse"></span>
                <span>Spotify Schlafzimmer-Kopplung:</span>
              </strong>
              <a href="${escapeHtml(stagingConfig.spotifyPlaylistUrl || SPOTIFY_DEFAULT_PLAYLIST)}" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1 rounded-xl bg-[#142b24] hover:bg-[#2e5746] border border-[#2e5746] text-[#f8fafc] font-mono text-[9.5px] font-bold flex items-center gap-1 touch-pad">
                <span>In Spotify öffnen ↗</span>
              </a>
            </div>
            <div class="space-y-1">
              <label class="text-[9.5px] font-mono text-[#94a3b8] uppercase block">Eigene Paar-Playlist URL (optional):</label>
              <input 
                type="text" 
                value="${escapeHtml(stagingConfig.spotifyPlaylistUrl || '')}" 
                placeholder="https://open.spotify.com/playlist/..." 
                oninput="SessionStaging.setSpotifyUrl(this.value)" 
                class="w-full px-3 py-1.5 rounded-xl bg-[#090d14] border border-[#1e2638] text-white text-xs font-mono placeholder:text-slate-600 focus:border-[#c5a880] focus:outline-none" 
              />
            </div>
          </div>
        </div>

        <!-- 1. DIMENSION: TONALITÄT (4 TEMPERAMENTE) -->
        <div class="p-4 sm:p-5 rounded-3xl bg-[#090d14] border border-[#1e2638] space-y-3 shadow-xl">
          <div class="flex items-center justify-between border-b border-[#1e2638]/60 pb-2">
            <strong class="text-xs text-[#f8fafc] block font-bold">1. Tonalität &amp; Haltung des Tops:</strong>
            <span class="text-[9.5px] font-mono text-[#c5a880] font-bold">Temperament</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            ${Object.values(TONALITY_DEFINITIONS).map(t => {
              const isSelected = stagingConfig.tonality === t.id;
              return `
                <button type="button" onclick="SessionStaging.setTonality('${t.id}')" class="p-3 rounded-2xl border text-left transition-all touch-pad ${isSelected ? `${t.borderClass} ${t.bgClass} shadow-md` : 'bg-[#090d14] border-[#1e2638] text-[#94a3b8] hover:text-[#f8fafc]'}">
                  <div class="flex items-center justify-between">
                    <strong class="text-xs block font-bold text-[#f8fafc]">${escapeHtml(t.label)}</strong>
                    <span class="text-xs font-mono font-bold ${isSelected ? 'text-[#c5a880]' : 'text-[#1e2638]'}">${isSelected ? '✓' : '○'}</span>
                  </div>
                  <span class="text-[10px] block mt-1 leading-snug ${isSelected ? 'text-slate-200' : 'text-[#94a3b8]'}">${escapeHtml(t.tagline)}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 2. DIMENSION: TOP-AGENDA (LUST-AUSRICHTUNG) -->
        <div class="p-4 sm:p-5 rounded-3xl bg-[#090d14] border border-[#1e2638] space-y-3 shadow-xl">
          <div class="flex items-center justify-between border-b border-[#1e2638]/60 pb-2">
            <strong class="text-xs text-[#f8fafc] block font-bold">2. Ausrichtung der Top-Lust:</strong>
            <span class="text-[9.5px] font-mono text-[#c5a880] font-bold">Agenda</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            ${Object.values(TOP_AGENDA_DEFINITIONS).map(a => {
              const isSelected = stagingConfig.topAgenda === a.id;
              return `
                <button type="button" onclick="SessionStaging.setTopAgenda('${a.id}')" class="p-3 rounded-2xl border text-left transition-all touch-pad ${isSelected ? 'bg-[#000000] border-[#c5a880] text-[#f8fafc] shadow-md' : 'bg-[#090d14] border-[#1e2638] text-[#94a3b8] hover:text-[#f8fafc]'}">
                  <div class="flex items-center justify-between">
                    <strong class="text-xs block font-bold text-[#f8fafc]">${escapeHtml(a.label)}</strong>
                    <span class="text-xs font-mono font-bold ${isSelected ? 'text-[#c5a880]' : 'text-[#1e2638]'}">${isSelected ? '✓' : '○'}</span>
                  </div>
                  <span class="text-[10px] block mt-1 leading-snug ${isSelected ? 'text-slate-200' : 'text-[#94a3b8]'}">${escapeHtml(a.desc)}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 3. DIMENSION: DYNAMISCH EXTRAHIERTE MOTIVE AUS DEM FRAGEBOGEN -->
        <div class="p-4 sm:p-5 rounded-3xl bg-[#090d14] border border-[#1e2638] space-y-3 shadow-xl">
          <div class="flex items-center justify-between border-b border-[#1e2638]/60 pb-2">
            <div class="space-y-0.5">
              <strong class="text-xs text-[#f8fafc] block font-bold">3. Leitmotiv der Session (Aus dem Fragebogen):</strong>
              <span class="text-[10px] text-[#94a3b8]">Nur Themen mit Top-Wunsch; Tabus des Subs sind strikt herausgefiltert</span>
            </div>
            <span class="px-2 py-0.5 rounded bg-[#000000] text-[#c5a880] border border-[#c5a880]/30 font-mono text-[9px] font-bold">
              ${candidateMotifs.length} Optionen
            </span>
          </div>

          <div class="space-y-2 max-h-72 overflow-y-auto pr-1">
            ${candidateMotifs.map(m => {
              const isSelected = stagingConfig.motifId === m.id;
              return `
                <div onclick="SessionStaging.setMotif('${m.id}')" class="p-3.5 rounded-2xl border transition-all cursor-pointer touch-pad space-y-1.5 ${isSelected ? 'bg-[#000000] border-[#c5a880] shadow-lg' : 'bg-[#090d14] border-[#1e2638] hover:border-slate-700'}">
                  <div class="flex items-start justify-between gap-2">
                    <div class="space-y-0.5 min-w-0 flex-1">
                      <div class="flex items-center gap-1.5 flex-wrap">
                        <strong class="text-xs text-[#f8fafc] font-bold leading-tight break-words">${escapeHtml(m.title)}</strong>
                        ${m.isDoubleFive ? '<span class="px-1.5 py-0.2 rounded text-[8.5px] font-mono bg-[#142b24] text-[#2e5746] border border-[#2e5746] font-bold">5/5 Doppel-Spitze ★</span>' : ''}
                        ${m.isBridge ? '<span class="px-1.5 py-0.2 rounded text-[8.5px] font-mono bg-[#000000] text-[#c5a880] border border-[#c5a880]/50 font-bold">Erkundungs-Brücke ⇄</span>' : ''}
                        ${m.isShame ? '<span class="px-1.5 py-0.2 rounded text-[8.5px] font-mono bg-[#4a2818] text-[#b3734a] border border-[#8a5232] font-bold">Scham-Schutzanker</span>' : ''}
                      </div>
                      <p class="text-[10px] text-[#94a3b8] leading-snug break-words">${escapeHtml(m.desc)}</p>
                    </div>
                    <span class="text-xs font-mono font-bold flex-shrink-0 ${isSelected ? 'text-[#c5a880]' : 'text-[#1e2638]'}">${isSelected ? '✓' : '○'}</span>
                  </div>

                  <!-- Notizen des Subs & Klickbarer Fragebogen-Deeplink -->
                  <div class="pt-1.5 border-t border-[#1e2638]/60 flex items-center justify-between text-[9.5px] font-mono">
                    <a href="index.html#view=survey&item=${m.itemId}" target="_blank" onclick="event.stopPropagation()" class="text-[#c5a880] hover:underline flex items-center gap-1 font-bold">
                      <span>Fragebogen Item #${m.itemId}</span>
                      <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>
                    </a>
                    <span class="text-[#94a3b8]">Zone: ${escapeHtml(m.somaticZone)}</span>
                  </div>

                  ${m.subNote ? `
                    <div class="p-2 rounded-xl bg-[#000000] border border-[#8a5232]/50 text-[10px] text-[#f8fafc] italic space-y-0.5">
                      <span class="font-bold font-mono not-italic text-[9px] text-[#b3734a] block">[Persönliche Notiz des Subs]:</span>
                      <p class="break-words">„${escapeHtml(m.subNote)}“</p>
                    </div>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 4. DIMENSION: KEUSCHHEITS-TRIAGE (WENN VERSCHLUSS AKTIV) -->
        <div class="p-4 sm:p-5 rounded-3xl bg-[#090d14] border border-[#1e2638] space-y-3 shadow-xl">
          <div class="flex items-center justify-between border-b border-[#1e2638]/60 pb-2">
            <strong class="text-xs text-[#f8fafc] block font-bold">4. Keuschheits-Triage (Entscheid des Tops):</strong>
            <span class="text-[9.5px] font-mono text-[#c5a880] font-bold">Verschluss-Pfad</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            ${Object.values(CHASTITY_TRIAGE_DEFINITIONS).map(c => {
              const isSelected = stagingConfig.chastityTriage === c.id;
              return `
                <button type="button" onclick="SessionStaging.setChastityTriage('${c.id}')" class="p-3 rounded-2xl border text-left transition-all touch-pad ${isSelected ? 'bg-[#000000] border-[#c5a880] text-[#f8fafc] shadow-md' : 'bg-[#090d14] border-[#1e2638] text-[#94a3b8] hover:text-[#f8fafc]'}">
                  <div class="flex items-center justify-between">
                    <strong class="text-xs block font-bold text-[#f8fafc]">${escapeHtml(c.label)}</strong>
                    <span class="text-xs font-mono font-bold ${isSelected ? 'text-[#c5a880]' : 'text-[#1e2638]'}">${isSelected ? '✓' : '○'}</span>
                  </div>
                  <span class="text-[10px] block mt-1 leading-snug ${isSelected ? 'text-slate-200' : 'text-[#94a3b8]'}">${escapeHtml(c.desc)}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- INTENSITÄTS-SLIDER (1 BIS 10) -->
        <div class="p-4 sm:p-5 rounded-3xl bg-[#090d14] border border-[#1e2638] space-y-3 shadow-xl">
          <div class="flex items-center justify-between">
            <strong class="text-xs text-[#f8fafc] block font-bold">Ziel-Intensität der Session:</strong>
            <span class="text-sm font-mono font-bold text-[#c5a880]">${stagingConfig.intensity} / 10</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="10" 
            value="${stagingConfig.intensity}" 
            oninput="SessionStaging.setIntensity(this.value)" 
            class="w-full h-2 bg-[#000000] rounded-lg appearance-none cursor-pointer accent-[#c5a880]" 
          />
          <div class="flex justify-between text-[9px] font-mono text-[#94a3b8]">
            <span>1: Sanft / Berührung</span>
            <span>5: Spürbare Härte</span>
            <span>10: Kathartischer Grenzbereich</span>
          </div>
        </div>

        <!-- AUSRÜSTUNGSSCHRANK & BEREITSTELLUNG -->
        <div class="p-4 sm:p-5 rounded-3xl bg-[#090d14] border border-[#1e2638] space-y-3 shadow-xl">
          <div class="flex items-center justify-between border-b border-[#1e2638]/60 pb-2">
            <strong class="text-xs text-[#f8fafc] block font-bold">Bereitgelegte Ausrüstung:</strong>
            <button type="button" onclick="if(window.HubToys) window.HubToys.open();" class="text-[#c5a880] hover:underline font-mono text-[10px] font-bold">
              Schrank öffnen ↗
            </button>
          </div>

          <div class="flex flex-wrap gap-1.5" id="staging-equipment-pills">
            ${stagingConfig.selectedEquipmentIds.length === 0 ? `
              <span class="text-[10px] text-[#94a3b8] italic">Keine Ausrüstung explizit ausgewählt (nur Hände &amp; Bettkante).</span>
            ` : stagingConfig.selectedEquipmentIds.map(id => {
              const toy = allCatalog.find(t => t.id === id);
              const name = toy ? toy.name : id;
              return `
                <span class="px-2.5 py-1 rounded-xl bg-[#000000] border border-[#c5a880]/40 text-[#c5a880] font-mono text-[10px] flex items-center gap-1.5">
                  <span>${escapeHtml(name)}</span>
                  <button type="button" onclick="SessionStaging.toggleEquipment('${id}')" class="text-[#94a3b8] hover:text-[#991b1b]">✕</button>
                </span>
              `;
            }).join('')}
          </div>
        </div>

        <!-- ECHTZEIT-DOF- & REIZ-KONFLIKTPRÜFUNG -->
        ${!conflictAnalysis.feasible ? `
          <div class="p-4 rounded-3xl bg-[#000000] border border-[#991b1b] space-y-2 text-xs">
            <div class="flex items-center gap-2 text-[#991b1b] font-bold">
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.008v.008H12v-.008z"/></svg>
              <span>Somatische Konflikt-Erkennung (Freiheitsgrade eingeschränkt):</span>
            </div>
            ${conflictAnalysis.conflicts.map(c => `
              <p class="text-[10.5px] text-[#f8fafc] leading-snug">• ${escapeHtml(c.message)}</p>
            `).join('')}
            ${conflictAnalysis.substitutions.map(s => `
              <div class="p-2 rounded-xl bg-[#090d14] border border-[#c5a880]/30 text-[10px] text-[#c5a880]">
                <strong>Empfohlene Substitution:</strong> ${escapeHtml(s.instruction)}
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- RACK-GESUNDHEITSPASS & NOTFALL-VORSORGE -->
        ${healthNotices.length > 0 ? `
          <div class="p-4 rounded-3xl bg-[#000000] border border-[#142b24] space-y-2 text-xs">
            <div class="flex items-center justify-between border-b border-[#2e5746]/60 pb-1.5">
              <div class="flex items-center gap-2 text-[#2e5746] font-bold">
                <span class="w-2 h-2 rounded-full bg-[#2e5746]"></span>
                <span>RACK-Gesundheitspass &amp; Notfall-Vorsorge (Zur Kontrolle):</span>
              </div>
              <a href="index.html#view=hub" target="_blank" class="text-[#c5a880] hover:underline font-mono text-[9.5px]">Pass editieren ↗</a>
            </div>
            <p class="text-[10px] text-[#94a3b8] leading-snug">
              Aufklärung und Vorbereitung: Die Zeit- und Belastungsgrenzen bestimmt ihr gemeinsam im Einvernehmen.
            </p>
            <div class="space-y-1.5 pt-1">
              ${healthNotices.map(n => `
                <div class="p-2.5 rounded-xl bg-[#090d14] border border-[#1e2638] space-y-0.5">
                  <strong class="text-[#f8fafc] text-[10.5px] block font-bold">${escapeHtml(n.title)}</strong>
                  <p class="text-[10px] text-[#94a3b8] leading-snug">${escapeHtml(n.desc)}</p>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- START-BUTTON: DREHBUCH GENERIEREN & INS SCHLAFZIMMER EINTRETEN -->
        <div class="pt-2">
          <button type="button" onclick="SessionStaging.generateScript()" class="w-full py-4 px-6 rounded-3xl bg-[#c5a880] hover:bg-[#dfcaa9] text-black font-mono font-bold text-sm tracking-widest uppercase touch-pad shadow-2xl flex items-center justify-center gap-2 transition">
            <svg class="w-4 h-4 text-black" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v18M5 8c3.5-3 10.5-3 14 0M7 16c2.5 2.5 7.5 2.5 10 0"/></svg>
            <span>${isScripted ? 'Drehbuch generieren &amp; Live-Regie starten ↗' : 'Freies Spiel starten (Somatischer Flow) ↗'}</span>
          </button>
          <span class="text-[9.5px] font-mono text-[#94a3b8] text-center block mt-1.5">
            ${isScripted ? 'Koppelt 4 Phasen, Tonalität, Audio-Drone und DoF-Hardware' : 'Startet aufwärts zählende Stoppuhr mit freier Schwellen- &amp; Zucht-Wahl'}
          </span>
        </div>

      </div>
    `;
  }

  const api = {
    init: function(containerId) {
      loadStagingState();
      renderStagingCockpit(containerId);
    },
    render: function() {
      renderStagingCockpit();
    },
    renderEquipment: function() {
      loadStagingState();
      renderStagingCockpit();
    },
    setSessionMode: function(mode) {
      stagingConfig.sessionMode = (mode === 'flow') ? 'flow' : 'scripted';
      saveStagingState();
      renderStagingCockpit();
    },
    toggleVoice: function() {
      stagingConfig.voiceEnabled = !stagingConfig.voiceEnabled;
      saveStagingState();
      renderStagingCockpit();
      showToast(stagingConfig.voiceEnabled ? "Sprachausgabe im Raum aktiviert ✓" : "Sprachausgabe stummgeschaltet");
    },
    setSoundscape: function(soundscapeId) {
      stagingConfig.audioSoundscape = soundscapeId;
      saveStagingState();
      renderStagingCockpit();
    },
    setSpotifyUrl: function(url) {
      stagingConfig.spotifyPlaylistUrl = (url || '').trim();
      saveStagingState();
    },
    setTonality: function(id) {
      stagingConfig.tonality = id;
      saveStagingState();
      renderStagingCockpit();
    },
    setTopAgenda: function(id) {
      stagingConfig.topAgenda = id;
      saveStagingState();
      renderStagingCockpit();
    },
    setIntensity: function(val) {
      stagingConfig.intensity = parseInt(val, 10) || 6;
      saveStagingState();
      renderStagingCockpit();
    },
    setMotif: function(id) {
      stagingConfig.motifId = id;
      saveStagingState();
      renderStagingCockpit();
    },
    setChastityTriage: function(id) {
      stagingConfig.chastityTriage = id;
      saveStagingState();
      renderStagingCockpit();
    },
    toggleEquipment: function(id) {
      loadStagingState();
      const idx = stagingConfig.selectedEquipmentIds.indexOf(id);
      if (idx !== -1) {
        stagingConfig.selectedEquipmentIds.splice(idx, 1);
      } else {
        stagingConfig.selectedEquipmentIds.push(id);
      }
      saveStagingState();
      renderStagingCockpit();
    },
    generateScript: generateBedroomScript,
    getConfig: function() {
      loadStagingState();
      return Object.assign({}, stagingConfig);
    }
  };

  window.SessionStaging = api;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const el = document.getElementById('staging-cockpit-container');
      if (el) api.init();
    });
  } else {
    const el = document.getElementById('staging-cockpit-container');
    if (el) api.init();
  }

})(window);
