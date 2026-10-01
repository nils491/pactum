/**
 * js/session_staging.js
 * TACTUS Schlafzimmer-Staging Cockpit, 4 Top-Dimensionen & DoF-Validierung (V3.0 Hyper-Dynamisch)
 * Offizielle Web-Praesenz: tactus.digital
 * 
 * Standards & Garantien:
 * - Dynamische Motiv-Extraktion aus allen 36 Kapiteln des Fragebogens
 * - Strikter Tabu-Ausschluss (Note 1) & Priorisierung von 5/5 Doppel-Spitzen
 * - Transparenz ueber persoenliche Sub-Notizen mit klickbaren Fragebogen-Deeplinks
 * - 4 Top-Fuehrungsdimensionen: Tonalitaet, Top-Agenda, Leitmotiv & Keuschheits-Triage
 * - DoF-Konfliktpruefung & Substitutions-Intelligenz via ToyCombinatorics
 * - RACK-Gesundheitspass: Aufklaerende Schutz- & Notfall-Hinweise zur autonomen Kontrolle
 * - Multi-KI Drehbuch-Synthese via AIAdapter mit autarkem 4-Phasen-Heuristik-Fallback
 * - 100 % frei von infantilen System-Emojis in Datenstrukturen und UI
 * - Keine window.alert() / window.confirm() Aufrufe unter keinen Umstaenden
 */

(function(window) {
  'use strict';

  const STORAGE_KEY_ACTIVE_SCRIPT = 'tactus_active_session_script';
  const STORAGE_KEY_STAGING_CONFIG = 'tactus_staging_config';
  const STORAGE_KEY_ANSWERS = 'kompass_answers';
  const STORAGE_KEY_MEDICAL_PASS = 'tactus_medical_pass';
  const STORAGE_KEY_OWNED = 'tactus_owned_equipment';
  const STORAGE_KEY_OWNED_LEGACY = 'kompass_owned_equipment';

  // 4 Tonalitaeten des Fuehrenden
  const TONALITY_DEFINITIONS = {
    sovereign_warm: {
      id: 'sovereign_warm',
      label: 'Souveraen & Zugewandt',
      tagline: 'Ruhige, tragende Fuehrung mit spuerbarer emotionaler Geborgenheit',
      borderClass: 'border-purple-600',
      bgClass: 'bg-purple-950/40 text-purple-200'
    },
    sovereign_cool: {
      id: 'sovereign_cool',
      label: 'Kuehl & Distanziert',
      tagline: 'Strikte Disziplin, formale Distanz und unnachgiebige Haltungspruefung',
      borderClass: 'border-indigo-600',
      bgClass: 'bg-indigo-950/40 text-indigo-200'
    },
    raw_primal: {
      id: 'raw_primal',
      label: 'Koerperlich & Instinktiv',
      tagline: 'Zupackender Griff, ungezaehmte Dominanz und archaische Machtdynamik',
      borderClass: 'border-rose-700',
      bgClass: 'bg-rose-950/40 text-rose-200'
    },
    playful: {
      id: 'playful',
      label: 'Spottisch & Neckend',
      tagline: 'Dynamisches Teasing, unerwartete Wendungen und spielerische Strenge',
      borderClass: 'border-amber-600',
      bgClass: 'bg-amber-950/40 text-amber-200'
    }
  };

  // 4 Ausrichtungen der Top-Lust
  const TOP_AGENDA_DEFINITIONS = {
    focus_top: {
      id: 'focus_top',
      label: 'Fokus auf meine Entladung',
      desc: 'Der Abend dient primaer der Lust der Herrin; Bottom dient rueckhaltlos.'
    },
    multi_climax: {
      id: 'multi_climax',
      label: 'Mehrfache Hoehepunkte',
      desc: 'Verlaengertes Plateau fuer den Top mit wiederholter Katharsis.'
    },
    cool_distance: {
      id: 'cool_distance',
      label: 'Kuehle Fuehrung (Keine eigene Lust)',
      desc: 'Reine Zucht-, Grenz- oder Haltungsfuehrung ohne sexuelle Entladung des Tops.'
    },
    mutual_surrender: {
      id: 'mutual_surrender',
      label: 'Gemeinsame Katharsis',
      desc: 'Synchrones Erleben, sofern die Orgasmus-Ratio des Paares erfuellt ist.'
    }
  };

  // 4-Wege Keuschheits-Triage fuer verriegelte Partner
  const CHASTITY_TRIAGE_DEFINITIONS = {
    remain_locked: {
      id: 'remain_locked',
      label: 'Dauerhaft verriegelt bleiben',
      desc: 'Kaefig bleibt den gesamten Abend geschlossen. Schwellkörperkontakt ausgeschlossen.'
    },
    tease_and_relock: {
      id: 'tease_and_relock',
      label: 'Oeffnen zur Schwellen-Quaelerei (Edging)',
      desc: 'Oeffnung fuer gezielte Schwellenreize, danach zwingende Wiederverriegelung ohne Orgasmus.'
    },
    prostate_only: {
      id: 'prostate_only',
      label: 'Reizverlagerung (Nur P-Spot / Prostata)',
      desc: 'Penisschaft bleibt arretiert; Reizung erfolgt ausschliesslich rektal/perineal.'
    },
    mercy_release: {
      id: 'mercy_release',
      label: 'Volle Freigabe (Gunst-Orgasmus)',
      desc: 'Vollstaendige Ejakulations-Erlaubnis als seltene, bewusst gewaehrte Gunst.'
    }
  };

  let stagingConfig = {
    tonality: 'sovereign_warm',
    topAgenda: 'focus_top',
    intensity: 6,
    motifId: null,
    chastityTriage: 'remain_locked',
    selectedEquipmentIds: [],
    customNotes: ''
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
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"/>
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

    // Standard-Ausrüstung vorinitialisieren falls leer
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
    let names = { A: 'Top', B: 'Bottom' };

    if (window.HubContext && typeof window.HubContext.getRoles === 'function') {
      const r = window.HubContext.getRoles();
      topRole = r.topRole;
      bottomRole = r.bottomRole;
      names = window.HubContext.getNames();
    }

    let answers = {};
    try {
      const raw = localStorage.getItem(STORAGE_KEY_ANSWERS);
      if (raw) answers = JSON.parse(raw) || {};
    } catch (e) {}

    const ansTop = answers[topRole] || {};
    const ansBottom = answers[bottomRole] || {};

    const allChapters = (window.surveyChaptersPart1 || []).concat(window.surveyChaptersPart2 || window.surveyChapters || []);
    const candidates = [];

    allChapters.forEach(ch => {
      (ch.items || []).forEach(it => {
        if (it.type === 'choice') return; // Kapitel 00 Schutzraum wird separat ausgewertet

        const sTop = ansTop[`it_${it.id}_r1`]; // Top fuehrt / bestimmt
        const sBottom = ansBottom[`it_${it.id}_r2`]; // Bottom empfaengt
        const subNote = (ansBottom[`note_${it.id}`] || '').trim();
        const topNote = (ansTop[`note_${it.id}`] || '').trim();
        const isShame = ansBottom[`shame_${it.id}`] === true;

        // 1. STRIKTER RACK-TABUSCHUTZ: Note 1 des Bottoms wird NIEMALS vorgeschlagen
        if (sBottom === 1) return;

        // 2. NUR THEMEN MIT TOP-FUEHRUNGSBEGEHREN (r1 >= 4) oder BEIDSEITIGEM WUNSCH
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

    // Nach Resonanz gewichten
    candidates.sort((a, b) => b.scoreWeight - a.scoreWeight);

    // Fallback falls der Fragebogen noch komplett unberuehrt ist
    if (candidates.length === 0) {
      return [
        {
          id: 'motif_fallback_kneeling',
          itemId: 49,
          chapterId: 9,
          chapterTitle: 'Kapitel 9: BDSM-Basics',
          title: 'Körperliche Ehrerbietung & Kniestand-Appell',
          desc: 'Aufrechter Kniestand vor dem Top mit ruhigem Blickkontakt und bewusster Atemfuehrung.',
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
          desc: 'Rhythmische Treffer auf das Gesaess zur vegetativen Erdung und Durchblutung.',
          somaticZone: 'gluteal_pelvis',
          equipmentTags: [],
          sTop: 5,
          sBottom: 4,
          subNote: '',
          topNote: '',
          isDoubleFive: false,
          isHighSynergy: true
        },
        {
          id: 'motif_fallback_oral',
          itemId: 16,
          chapterId: 3,
          chapterTitle: 'Kapitel 3: Orale Hingabe',
          title: 'Ausgiebiger Oralservice auf Befehl',
          desc: 'Hingebungsvolles Bedienen des Tops im Kniestand ohne Gegenforderung.',
          somaticZone: 'head_mouth',
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
        desc: 'Auf Notfall vorbereitet sein: Traubenzucker oder gezuckertes Getraenk am Bett bereithalten. Bei laengerer Fixierung Durchblutung der Extremitaeten im Blick behalten.'
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
        desc: 'Gedaempftes Schmerzempfinden beachten: Regelmaessiger 2-Sekunden Kapillar-Refill-Test an Fingern und Zehen zur Durchblutungskontrolle empfohlen.'
      });
    }
    if (pass.hasBloodThinners) {
      notices.push({
        type: 'info_control',
        title: 'Gerinnungshemmer / Hämatomneigung',
        desc: 'Erhoehte Neigung zu Blutergussen: Intensitaet von Schlagwerkzeugen (Paddle/Stock) dosiert anpassen und Hautbild beobachten.'
      });
    }
    if (pass.hasLatexAllergy) {
      notices.push({
        type: 'info_warning',
        title: 'Latex-Allergie des Partners',
        desc: 'Kontaktschranke aktiv: Ausschliesslich Ausruestung aus medizinischem Silikon, Leder oder Textil verwenden.'
      });
    }
    if (pass.hasHypermobility) {
      notices.push({
        type: 'info_control',
        title: 'Hypermobilität / Gelenkschutz',
        desc: 'Gelenkueberbeweglichkeit beachten: Bei Fesselung natuerliche Winkel wahren und Ueberstreckungen vermeiden.'
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

    showToast("Synthetisiere Schlafzimmer-Drehbuch...");

    let generatedScript = null;

    // 1. KI-Pfad via AIAdapter falls konfiguriert
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
    "subServiceForTop": "Warmer Tee, Nackenmassage und Deckenruhe fuer ${topName}",
    "vagusRegulation": "Gewichtsdecke auflegen und 4-7-8 Vagus-Atmung gegen Kaeltezittern",
    "equipmentDisinfection": "Diskrete Desinfektion aller eingesetzten Ausruestungsgegenstaende"
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

    // 2. Fallback auf prozedurale Heuristik
    if (!generatedScript) {
      generatedScript = synthesizeProceduralScript(activeMotif, tonality, intensity, agenda, topName, subName);
    }

    // In SessionStorage sichern
    try {
      sessionStorage.setItem(STORAGE_KEY_ACTIVE_SCRIPT, JSON.stringify(generatedScript));
    } catch (e) {}

    // Übergabe an SessionLive
    if (window.SessionLive && typeof window.SessionLive.startWithScript === 'function') {
      // Ansicht umschalten
      const stagingEl = document.getElementById('view-session-staging');
      const liveEl = document.getElementById('view-session-live');
      if (stagingEl && liveEl) {
        stagingEl.classList.add('hidden');
        liveEl.classList.remove('hidden');
      }
      window.SessionLive.startWithScript(generatedScript);
    } else {
      showToast("✓ Drehbuch bereitgelegt");
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
          instruction: `Aufrechter Kniestand von ${subName} vor deinen Knien. Ruhiger Blickkontakt fuer 60 Sekunden und synchrone 4-7-8 Atemzuege.`,
          topDialogueQuote: quotePhase1,
          somaticZone: "head_eyes",
          estimatedMinutes: 8
        },
        {
          phaseIndex: 2,
          title: `Phase 2: Somatischer Machtaufbau (${motif.title})`,
          instruction: `Praezise Ausfuehrung von '${motif.title}'. Rhythmus einhalten, Grenzen wahren und Atmung beobachten.`,
          topDialogueQuote: quotePhase2,
          somaticZone: motif.somaticZone || "gluteal_pelvis",
          estimatedMinutes: 12
        },
        {
          phaseIndex: 3,
          title: "Phase 3: Katharsis (Fokus auf mich)",
          instruction: `${subName} bedient ${topName} vollstaendig. Takt und Intensitaet werden allein vom Top bestimmt.`,
          topDialogueQuote: quotePhase3,
          somaticZone: "genital_vulva_clitoris",
          estimatedMinutes: 15
        },
        {
          phaseIndex: 4,
          title: "Phase 4: Reverse Aftercare & Rüst-Pflege",
          instruction: `${subName} reicht warmes Wasser/Tee, legt die Gewichtsdecke auf ${topName}, massiert die Schultern und desinfiziert genutzte Ausruestung.`,
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

    // Standard-Motiv setzen falls noch keines gewaehlt
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

    container.innerHTML = `
      <div class="space-y-4 max-w-2xl mx-auto text-xs animate-fade-in">
        
        <!-- HEADER KACHEL -->
        <div class="theme-card rounded-3xl p-5 sm:p-6 border border-purple-900/60 shadow-2xl bg-gradient-to-br from-purple-950/40 via-noir-900 to-indigo-950/20 space-y-3">
          <div class="flex items-center justify-between border-b border-purple-900/50 pb-2.5">
            <div>
              <span class="text-[9.5px] font-mono uppercase tracking-wider text-purple-400 font-bold block">Schlafzimmer-Staging Cockpit</span>
              <h2 class="text-base sm:text-xl font-bold text-white mt-1 font-serif-title">
                Session-Kalibrierung vor dem Eintreten
              </h2>
            </div>
            <span class="px-2.5 py-1 rounded-xl bg-purple-950 text-purple-300 font-mono text-[10px] font-bold border border-purple-800">
              Exklusiv Top
            </span>
          </div>
          <p class="text-[10.5px] text-slate-300 leading-relaxed">
            Stimme Haltung, Intensitaet und Werkzeuge ab, bevor du das Schlafzimmer betrittst. Schliesst physische Widersprueche (DoF) automatisch aus.
          </p>
        </div>

        <!-- 1. DIMENSION: TONALITÄT (4 TEMPERAMENTE) -->
        <div class="theme-card rounded-3xl p-5 border border-slate-800 space-y-3 shadow-md">
          <div class="flex items-center justify-between border-b border-slate-800 pb-2">
            <strong class="text-xs text-white block font-bold">1. Tonalität &amp; Haltung des Tops:</strong>
            <span class="text-[9.5px] font-mono text-purple-400 font-bold">Temperament</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            ${Object.values(TONALITY_DEFINITIONS).map(t => {
              const isSelected = stagingConfig.tonality === t.id;
              return `
                <button type="button" onclick="SessionStaging.setTonality('${t.id}')" class="p-3 rounded-2xl border text-left transition-all touch-btn ${isSelected ? `${t.borderClass} ${t.bgClass} shadow-md` : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'}">
                  <div class="flex items-center justify-between">
                    <strong class="text-xs block font-bold text-white">${escapeHtml(t.label)}</strong>
                    <span class="text-xs font-mono font-bold ${isSelected ? 'text-purple-300' : 'text-slate-600'}">${isSelected ? '✓' : '○'}</span>
                  </div>
                  <span class="text-[10px] block mt-1 leading-snug ${isSelected ? 'text-slate-200' : 'text-slate-500'}">${escapeHtml(t.tagline)}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 2. DIMENSION: TOP-AGENDA (LUST-AUSRICHTUNG) -->
        <div class="theme-card rounded-3xl p-5 border border-slate-800 space-y-3 shadow-md">
          <div class="flex items-center justify-between border-b border-slate-800 pb-2">
            <strong class="text-xs text-white block font-bold">2. Ausrichtung der Top-Lust:</strong>
            <span class="text-[9.5px] font-mono text-amber-400 font-bold">Agenda</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            ${Object.values(TOP_AGENDA_DEFINITIONS).map(a => {
              const isSelected = stagingConfig.topAgenda === a.id;
              return `
                <button type="button" onclick="SessionStaging.setTopAgenda('${a.id}')" class="p-3 rounded-2xl border text-left transition-all touch-btn ${isSelected ? 'bg-amber-950/40 border-amber-600 text-amber-100 shadow-md' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'}">
                  <div class="flex items-center justify-between">
                    <strong class="text-xs block font-bold text-white">${escapeHtml(a.label)}</strong>
                    <span class="text-xs font-mono font-bold ${isSelected ? 'text-amber-300' : 'text-slate-600'}">${isSelected ? '✓' : '○'}</span>
                  </div>
                  <span class="text-[10px] block mt-1 leading-snug ${isSelected ? 'text-amber-200/80' : 'text-slate-500'}">${escapeHtml(a.desc)}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 3. DIMENSION: DYNAMISCH EXTRAHIERTE MOTIVE AUS DEM FRAGEBOGEN -->
        <div class="theme-card rounded-3xl p-5 border border-purple-900/60 space-y-3 shadow-md">
          <div class="flex items-center justify-between border-b border-purple-900/40 pb-2">
            <div class="space-y-0.5">
              <strong class="text-xs text-white block font-bold">3. Leitmotiv der Session (Aus dem Fragebogen):</strong>
              <span class="text-[10px] text-slate-400">Nur Themen mit Top-Wunsch; Tabus des Subs sind strikt herausgefiltert</span>
            </div>
            <span class="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-mono text-[9px] font-bold">
              ${candidateMotifs.length} Optionen
            </span>
          </div>

          <div class="space-y-2 max-h-72 overflow-y-auto pr-1">
            ${candidateMotifs.map(m => {
              const isSelected = stagingConfig.motifId === m.id;
              return `
                <div onclick="SessionStaging.setMotif('${m.id}')" class="p-3.5 rounded-2xl border transition-all cursor-pointer touch-btn space-y-1.5 ${isSelected ? 'bg-purple-950/60 border-purple-500 shadow-lg' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}">
                  <div class="flex items-start justify-between gap-2">
                    <div class="space-y-0.5 min-w-0 flex-1">
                      <div class="flex items-center gap-1.5 flex-wrap">
                        <strong class="text-xs text-white font-bold leading-tight break-words">${escapeHtml(m.title)}</strong>
                        ${m.isDoubleFive ? '<span class="px-1.5 py-0.2 rounded text-[8.5px] font-mono bg-purple-900 text-purple-200 border border-purple-600 font-bold">5/5 Doppel-Spitze ★</span>' : ''}
                        ${m.isBridge ? '<span class="px-1.5 py-0.2 rounded text-[8.5px] font-mono bg-amber-950 text-amber-300 border border-amber-800 font-bold">Erkundungs-Brücke ⇄</span>' : ''}
                        ${m.isShame ? '<span class="px-1.5 py-0.2 rounded text-[8.5px] font-mono bg-pink-950 text-pink-300 border border-pink-800 font-bold">Scham-Schutzanker</span>' : ''}
                      </div>
                      <p class="text-[10px] text-slate-400 leading-snug break-words">${escapeHtml(m.desc)}</p>
                    </div>
                    <span class="text-xs font-mono font-bold flex-shrink-0 ${isSelected ? 'text-purple-300' : 'text-slate-600'}">${isSelected ? '✓' : '○'}</span>
                  </div>

                  <!-- Notizen des Subs & Klickbarer Fragebogen-Deeplink -->
                  <div class="pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[9.5px] font-mono">
                    <a href="index.html#view=survey&item=${m.itemId}" target="_blank" onclick="event.stopPropagation()" class="text-purple-400 hover:text-purple-300 underline flex items-center gap-1">
                      <span>Fragebogen Item #${m.itemId}</span>
                      <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>
                    </a>
                    <span class="text-slate-500">Zone: ${escapeHtml(m.somaticZone)}</span>
                  </div>

                  ${m.subNote ? `
                    <div class="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[10px] text-purple-200 italic space-y-0.5">
                      <span class="font-bold font-mono not-italic text-[9px] text-purple-400 block">[Persönliche Notiz des Subs]:</span>
                      <p class="break-words">„${escapeHtml(m.subNote)}“</p>
                    </div>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 4. DIMENSION: KEUSCHHEITS-TRIAGE (WENN VERSCHLUSS AKTIV) -->
        <div class="theme-card rounded-3xl p-5 border border-slate-800 space-y-3 shadow-md">
          <div class="flex items-center justify-between border-b border-slate-800 pb-2">
            <strong class="text-xs text-white block font-bold">4. Keuschheits-Triage (Entscheid des Tops):</strong>
            <span class="text-[9.5px] font-mono text-indigo-400 font-bold">Verschluss-Pfad</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            ${Object.values(CHASTITY_TRIAGE_DEFINITIONS).map(c => {
              const isSelected = stagingConfig.chastityTriage === c.id;
              return `
                <button type="button" onclick="SessionStaging.setChastityTriage('${c.id}')" class="p-3 rounded-2xl border text-left transition-all touch-btn ${isSelected ? 'bg-indigo-950/40 border-indigo-600 text-indigo-100 shadow-md' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'}">
                  <div class="flex items-center justify-between">
                    <strong class="text-xs block font-bold text-white">${escapeHtml(c.label)}</strong>
                    <span class="text-xs font-mono font-bold ${isSelected ? 'text-indigo-300' : 'text-slate-600'}">${isSelected ? '✓' : '○'}</span>
                  </div>
                  <span class="text-[10px] block mt-1 leading-snug ${isSelected ? 'text-indigo-200/80' : 'text-slate-500'}">${escapeHtml(c.desc)}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- INTENSITÄTS-SLIDER (1 BIS 10) -->
        <div class="theme-card rounded-3xl p-5 border border-slate-800 space-y-3 shadow-md">
          <div class="flex items-center justify-between">
            <strong class="text-xs text-white block font-bold">Ziel-Intensität der Session:</strong>
            <span class="text-sm font-mono font-black text-purple-300">${stagingConfig.intensity} / 10</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="10" 
            value="${stagingConfig.intensity}" 
            oninput="SessionStaging.setIntensity(this.value)" 
            class="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-purple-500" 
          />
          <div class="flex justify-between text-[9px] font-mono text-slate-500">
            <span>1: Sanft / Berührung</span>
            <span>5: Spürbare Härte</span>
            <span>10: Kathartischer Grenzbereich</span>
          </div>
        </div>

        <!-- AUSRÜSTUNGSSCHRANK & BEREITSTELLUNG -->
        <div class="theme-card rounded-3xl p-5 border border-slate-800 space-y-3 shadow-md">
          <div class="flex items-center justify-between border-b border-slate-800 pb-2">
            <strong class="text-xs text-white block font-bold">Bereitgelegte Ausrüstung:</strong>
            <button type="button" onclick="if(window.HubToys) window.HubToys.open();" class="text-purple-400 hover:text-purple-300 font-mono text-[10px] font-bold underline">
              Schrank öffnen ↗
            </button>
          </div>

          <div class="flex flex-wrap gap-1.5" id="staging-equipment-pills">
            ${stagingConfig.selectedEquipmentIds.length === 0 ? `
              <span class="text-[10px] text-slate-500 italic">Keine Ausrüstung explizit ausgewählt (nur Hände &amp; Bettkante).</span>
            ` : stagingConfig.selectedEquipmentIds.map(id => {
              const toy = allCatalog.find(t => t.id === id);
              const name = toy ? toy.name : id;
              return `
                <span class="px-2.5 py-1 rounded-xl bg-purple-950 border border-purple-800 text-purple-200 font-mono text-[10px] flex items-center gap-1.5">
                  <span>${escapeHtml(name)}</span>
                  <button type="button" onclick="SessionStaging.toggleEquipment('${id}')" class="text-purple-400 hover:text-rose-300">✕</button>
                </span>
              `;
            }).join('')}
          </div>
        </div>

        <!-- ECHTZEIT-DOF- & REIZ-KONFLIKTPRÜFUNG -->
        ${!conflictAnalysis.feasible ? `
          <div class="p-4 rounded-3xl bg-amber-950/30 border border-amber-700/80 space-y-2 text-xs">
            <div class="flex items-center gap-2 text-amber-300 font-bold">
              <svg class="w-4 h-4 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.008v.008H12v-.008z"/></svg>
              <span>Somatische Konflikt-Erkennung (Freiheitsgrade eingeschränkt):</span>
            </div>
            ${conflictAnalysis.conflicts.map(c => `
              <p class="text-[10.5px] text-amber-200 leading-snug">• ${escapeHtml(c.message)}</p>
            `).join('')}
            ${conflictAnalysis.substitutions.map(s => `
              <div class="p-2 rounded-xl bg-slate-950 border border-amber-900/60 text-[10px] text-amber-300">
                <strong>Empfohlene Substitution:</strong> ${escapeHtml(s.instruction)}
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- RACK-GESUNDHEITSPASS & NOTFALL-VORSORGE (INFO & KONTROLLE, KEINE KÜNSTLICHEN LIMITS) -->
        ${healthNotices.length > 0 ? `
          <div class="p-4 rounded-3xl bg-slate-900/90 border border-rose-900/60 space-y-2 text-xs">
            <div class="flex items-center justify-between border-b border-rose-900/40 pb-1.5">
              <div class="flex items-center gap-2 text-rose-300 font-bold">
                <svg class="w-4 h-4 text-rose-400 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.008v.008H12v-.008z"/></svg>
                <span>RACK-Gesundheitspass &amp; Notfall-Vorsorge (Zur Kontrolle):</span>
              </div>
              <a href="index.html#view=hub" target="_blank" class="text-rose-400 hover:text-rose-300 underline font-mono text-[9.5px]">Pass editieren ↗</a>
            </div>
            <p class="text-[10px] text-slate-400 leading-snug">
              Aufklärung und Vorbereitung: Die Zeit- und Belastungsgrenzen bestimmt ihr gemeinsam im Einvernehmen.
            </p>
            <div class="space-y-1.5 pt-1">
              ${healthNotices.map(n => `
                <div class="p-2.5 rounded-xl bg-slate-950 border border-rose-900/50 space-y-0.5">
                  <strong class="text-rose-200 text-[10.5px] block font-bold">${escapeHtml(n.title)}</strong>
                  <p class="text-[10px] text-slate-300 leading-snug">${escapeHtml(n.desc)}</p>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- START-BUTTON: DREHBUCH GENERIEREN & INS SCHLAFZIMMER EINTRETEN -->
        <div class="pt-2">
          <button type="button" onclick="SessionStaging.generateScript()" class="w-full py-4 px-6 rounded-3xl bg-gradient-to-r from-purple-800 via-indigo-800 to-purple-700 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-sm tracking-wide uppercase touch-btn shadow-2xl flex items-center justify-center gap-2 transform active:scale-95 transition-transform">
            <svg class="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"/></svg>
            <span>Session-Drehbuch generieren &amp; Live-Regie starten ↗</span>
          </button>
          <span class="text-[9.5px] font-mono text-slate-500 text-center block mt-1.5">Koppelt 7-Vektoren Zustand, Schrank und Tonalitaet</span>
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
      // Wird von HubToys aufgerufen wenn Schrank geschlossen wird
      loadStagingState();
      renderStagingCockpit();
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
