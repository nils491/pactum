/**
 * js/hub_context.js
 * TACTUS 7-Vektoren Kontext-Synthese & Dynamisches Briefing (V3.0 Hyper-Dynamisch)
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien:
 * - Verdichtung des 7-Vektoren Zustandsraums:
 *   Psi = <Psychometrie, Somatik, Historie, Energie/Temperament, Biologie/RACK, Top-Agenda, Hardware/DoF>
 * - Vollständige Integration des Medizinischen RACK-Gesundheitspasses & Kapitel 00 (Items 901–905)
 * - Berücksichtigung spezifischer Ängste (Enge, Dunkelheit, Starre, Degradierung, Überraschung) & Freitext-Notizen
 * - Episodisches Gedächtnis der letzten Sessions (Kältezittern, Überreizung, Subspace-Tags)
 * - Deterministische Constraint-Propagation (Ausschluss physikalischer Widersprüche via ToyCombinatorics)
 * - Strikte Sprach- und Tonfall-Doktrin: Anti-Schwulst, kein Groschenroman-Kitsch, keine System-Emojis
 * - Keine window.alert() / window.confirm() Aufrufe unter keinen Umständen
 */

(function(window) {
  'use strict';

  const TACTUS_LANGUAGE_DOKTRIN = `
SPRACH- UND TONFALL-LEITPLANKEN (STRIKT EINHALTEN):
1. KEIN GROSCHENROMAN-KITSCH & KEINE SCHWULST:
   Verwende NIEMALS Worte wie 'feierlich', 'andächtig', 'hoheitsvoll', 'Gemächt', 'Odem', 'lüstern', 'Gnadengesuch' oder 'sakral'.
2. SOUVERÄNE, ERWACHSENE DIREKTHEIT:
   Sprich so, wie ein souveräner, echter Mensch im Halbdunkel eines Schlafzimmers spricht:
   Präzise, ungeschminkt, erwachsen und direkt auf den Punkt ('Schwelle', 'Plateau', 'Wegsperren', 'Schlüsselgewalt', 'Zucht').
3. WÖRTLICHE BEFEHLE IN ANFÜHRUNGSZEICHEN:
   Formuliere wörtliche Zitate so, dass eine echte Partnerin sie ohne Zögern oder Scham laut im Raum aussprechen kann.
4. TOP-FIRST DOKTRIN & ANTI-TFTB:
   Schütze die führende Person vor 'Top Fatigue' (unbezahltem Mental Load). Führen ist ein Privileg der Freude, kein Verwaltungsjob.
   Der Bottom diktiert nicht verdeckt die Regie ('Topping from the Bottom' ist ausgeschlossen).
5. REVERSE AFTERCARE & HYGIENE:
   Nach intensiven Phasen versorgt der Bottom den Top (Getränke reichen, Massage). Verwendete Ausrüstung wird sofort desinfiziert.
`;

  const STORAGE_KEYS = {
    answers: 'kompass_answers',
    names: 'kompass_names',
    assignedRole: 'kompass_assigned_role',
    keyholderRole: 'kompass_keyholder_role',
    cagedRole: 'kompass_caged_role',
    medicalPass: 'tactus_medical_pass',
    sessionLogs: 'tactus_session_logs',
    sessionLogsLegacy: 'kompass_session_logs',
    workplace: 'tactus_bottom_workplace',
    workplaceLegacy: 'kompass_bottom_workplace',
    topMentalLoad: 'tactus_top_mental_load',
    contractState: 'tactus_contract_state',
    contractStateLegacy: 'kompass_contract_state',
    ownedEquipment: 'tactus_owned_equipment',
    ownedEquipmentLegacy: 'kompass_owned_equipment',
    customEquipment: 'tactus_custom_equipment',
    customEquipmentLegacy: 'kompass_custom_equipment',
    toyQuantities: 'tactus_toy_quantities',
    toyQuantitiesLegacy: 'kompass_toy_quantities'
  };

  function safeJsonParse(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      console.warn(`[TACTUS Context] Fehler beim Parsen von ${key}:`, e);
      return fallback;
    }
  }

  function getNames() {
    const defaultNames = { A: 'Partner 1', B: 'Partner 2' };
    const parsed = safeJsonParse(STORAGE_KEYS.names, null);
    if (!parsed) return defaultNames;
    return {
      A: parsed.A && parsed.A.trim().length > 0 ? parsed.A.trim() : 'Partner 1',
      B: parsed.B && parsed.B.trim().length > 0 ? parsed.B.trim() : 'Partner 2'
    };
  }

  function getRoles() {
    const isPaired = localStorage.getItem('kompass_is_paired') === 'true';
    const myRole = localStorage.getItem(STORAGE_KEYS.assignedRole) || 'A';
    const keyholder = localStorage.getItem(STORAGE_KEYS.keyholderRole) || 'A';
    const caged = localStorage.getItem(STORAGE_KEYS.cagedRole) || (keyholder === 'A' ? 'B' : 'A');

    return {
      isPaired: isPaired,
      myRole: myRole,
      topRole: keyholder,
      bottomRole: caged,
      isCurrentUserTop: myRole === keyholder
    };
  }

  function extractPsychometricVector(topRole, bottomRole) {
    const allAnswers = safeJsonParse(STORAGE_KEYS.answers, {}) || {};
    const ansTop = allAnswers[topRole] || {};
    const ansBottom = allAnswers[bottomRole] || {};

    const doubleFives = [];
    const highSynergies = [];
    const bottomTaboos = [];
    const topTaboos = [];
    const bottomShameItems = [];
    const partnerNotes = [];

    const chapters = (window.surveyChaptersPart1 || []).concat(window.surveyChaptersPart2 || window.surveyChapters || []);
    const itemMap = new Map();

    for (let c = 0; c < chapters.length; c++) {
      const ch = chapters[c];
      const items = ch.items || [];
      for (let i = 0; i < items.length; i++) {
        itemMap.set(items[i].id, { title: items[i].title, desc: items[i].desc, chapter: ch.title, type: items[i].type || 'scale' });
      }
    }

    // 1. Numerische Skalen-Items (1..180) & Partner-Notizen
    for (const key in ansTop) {
      if (!ansTop.hasOwnProperty(key)) continue;

      if (key.startsWith('it_') && key.endsWith('_r1')) {
        const itemId = parseInt(key.replace('it_', '').replace('_r1', ''), 10);
        const topLeadScore = ansTop[key];
        const bottomReceiveScore = ansBottom[`it_${itemId}_r2`];
        const isShame = ansBottom[`shame_${itemId}`] === true;
        const itemInfo = itemMap.get(itemId) || { title: `Item #${itemId}`, chapter: 'Allgemein' };

        const noteTop = (ansTop[`note_${itemId}`] || '').trim();
        const noteBottom = (ansBottom[`note_${itemId}`] || '').trim();

        if (noteTop || noteBottom) {
          partnerNotes.push({
            itemId: itemId,
            title: itemInfo.title,
            chapter: itemInfo.chapter,
            noteTop: noteTop,
            noteBottom: noteBottom
          });
        }

        if (topLeadScore === 5 && bottomReceiveScore === 5) {
          doubleFives.push({ id: itemId, title: itemInfo.title, chapter: itemInfo.chapter });
        } else if (topLeadScore >= 4 && bottomReceiveScore >= 4) {
          highSynergies.push({ id: itemId, title: itemInfo.title, chapter: itemInfo.chapter });
        }

        if (bottomReceiveScore === 1) {
          bottomTaboos.push({ id: itemId, title: itemInfo.title, reason: 'Tabu Bottom (r2 = 1)' });
        }
        if (topLeadScore === 1) {
          topTaboos.push({ id: itemId, title: itemInfo.title, reason: 'Tabu Top (r1 = 1)' });
        }
        if (isShame && bottomReceiveScore >= 3) {
          bottomShameItems.push({ id: itemId, title: itemInfo.title, bottomScore: bottomReceiveScore });
        }
      }
    }

    // 2. Schutzkapitel 00: Psychosomatische Sicherheit & Traumagrenzen (Items 901..905)
    const chapter00 = {
      priorTrauma: ansBottom['choice_901'] || ansTop['choice_901'] || 'none',
      triggers: ansBottom['choice_902'] || ansTop['choice_902'] || 'none',
      overloadReaction: ansBottom['choice_903'] || ansTop['choice_903'] || 'freeze',
      desiredEmergencyIntervention: ansBottom['choice_904'] || 'hug',
      shameEtiquette: ansBottom['choice_905'] || 'strict_ban'
    };

    const INTERVENTION_TRANSLATIONS = {
      hug: "Feste, stumme Umarmung & Halten (Gewichtsdecken-Effekt)",
      distance: "Körperliche Berührung sofort einstellen & dem Sub Raum geben",
      grounding: "Licht anmachen, zudecken & ruhige 4-7-8 Vagus-Atmung anleiten",
      water_tea: "Schluck warmes Wasser oder gezuckerten Tee reichen, keine Fragen stellen",
      voice: "Mit leiser, ruhiger Stimme sprechen: 'Du bist vollkommen sicher bei mir.'"
    };

    chapter00.interventionDirective = INTERVENTION_TRANSLATIONS[chapter00.desiredEmergencyIntervention] || INTERVENTION_TRANSLATIONS.hug;

    return {
      doubleFives: doubleFives,
      highSynergies: highSynergies.slice(0, 10),
      bottomTaboos: bottomTaboos,
      topTaboos: topTaboos,
      bottomShameTopics: bottomShameItems,
      partnerNotes: partnerNotes,
      chapter00Safeguards: chapter00
    };
  }

  function extractSomaticVector() {
    let daysLocked = 1;
    let isLocked = false;
    let hardwareId = 'penis_cherrykeeper';
    let lockedSinceTimestamp = null;
    let lastEdgeHoursAgo = 999;
    let hadRecentRuinedOrgasm = false;

    const protocolCore = window.ProtocolCore || window.LedgerApp;
    if (protocolCore && typeof protocolCore.getState === 'function') {
      const state = protocolCore.getState();
      if (state) {
        isLocked = !!state.isLocked;
        hardwareId = state.hardware || 'penis_cherrykeeper';
        lockedSinceTimestamp = state.lockedSince;
        if (isLocked && lockedSinceTimestamp) {
          const diffMs = Math.max(0, Date.now() - lockedSinceTimestamp);
          daysLocked = Math.max(1, Math.floor(diffMs / (24 * 3600 * 1000)) + 1);
        }
      }
    }

    // Ratio-Historie prüfen bezüglich Ruined Orgasm
    const ratioModule = window.ProtocolRatio || window.HubRatio;
    if (ratioModule && typeof ratioModule.getHistory === 'function') {
      const history = ratioModule.getHistory();
      if (Array.isArray(history) && history.length > 0) {
        const lastSubClimax = history.find(h => h.beneficiary === 'sub');
        if (lastSubClimax) {
          const hoursAgo = (Date.now() - lastSubClimax.timestamp) / (3600 * 1000);
          if (hoursAgo < 48 && lastSubClimax.type === 'ruined') {
            hadRecentRuinedOrgasm = true;
          }
          if (hoursAgo < 48 && (lastSubClimax.type === 'denial' || lastSubClimax.type === 'ruined')) {
            lastEdgeHoursAgo = Math.round(hoursAgo);
          }
        }
      }
    }

    let tensionData = {
      effectiveTensionIndex: daysLocked,
      archetype: { id: 'adaptation', name: 'Gewöhnung', directiveObjective: 'Gewebeschutz & Führung' },
      pelvicSensitivityScore: 5
    };

    if (window.ChastityDatabase && typeof window.ChastityDatabase.calculateDynamicTension === 'function') {
      tensionData = window.ChastityDatabase.calculateDynamicTension({
        daysLocked: daysLocked,
        lastEdgeHoursAgo: lastEdgeHoursAgo,
        hadRecentRuinedOrgasm: hadRecentRuinedOrgasm
      });
    }

    let hardwareProfile = null;
    if (window.ChastityDatabase && typeof window.ChastityDatabase.getHardwareProfile === 'function') {
      hardwareProfile = window.ChastityDatabase.getHardwareProfile(hardwareId);
    }

    return {
      isLocked: isLocked,
      daysLocked: daysLocked,
      lockedSince: lockedSinceTimestamp,
      hardwareId: hardwareId,
      hardwareProfile: hardwareProfile,
      tension: tensionData
    };
  }

  function extractEpisodicMemoryVector() {
    const rawLogs = safeJsonParse(STORAGE_KEYS.sessionLogs, null) || safeJsonParse(STORAGE_KEYS.sessionLogsLegacy, []);
    const validLogs = Array.isArray(rawLogs) ? rawLogs : [];

    // Letzte 3 Sessions analysieren
    const recentSessions = validLogs.slice(-3).reverse().map(session => {
      const subFeedback = session.feedbackSub || session.subFeedback || {};
      const topFeedback = session.feedbackTop || session.topFeedback || {};

      return {
        timestamp: session.timestamp || Date.now(),
        intensity: session.intensity || session.depth || 5,
        tonality: session.tonality || 'sovereign_warm',
        subSomatosensoryTags: subFeedback.tags || [],
        topExperienceTags: topFeedback.tags || [],
        subReflectionNote: subFeedback.note || subFeedback.text || '',
        topReflectionNote: topFeedback.note || topFeedback.text || '',
        requiredEmergencyPause: session.safewordTriggered === true || session.brokenGlass === true
      };
    });

    // Risikofaktoren aus letzter Session ableiten
    const lastSession = recentSessions[0] || null;
    const risksIdentified = [];

    if (lastSession) {
      const tags = lastSession.subSomatosensoryTags;
      if (tags.includes('Kältezittern') || tags.includes('subdrop_vulnerable')) {
        risksIdentified.push('post_session_hypothermia_risk (Gewichtsdecke & warme Getränke zwingend)');
      }
      if (tags.includes('Leicht überreizt') || tags.includes('sensory_overload')) {
        risksIdentified.push('sensory_hyperesthesia (Heutige Schmerzreize dämpfen, Fokus auf Ruhe & Halt)');
      }
      if (lastSession.requiredEmergencyPause) {
        risksIdentified.push('recent_safeword_event (Behutsames Herantasten, gründliches verbales Check-in)');
      }
    }

    return {
      recentSessionsCount: validLogs.length,
      recentSessions: recentSessions,
      lastSession: lastSession,
      activeSomaticRisks: risksIdentified
    };
  }

  function extractEnergyAndWorkplaceVector() {
    const workplaceId = localStorage.getItem(STORAGE_KEYS.workplace) || localStorage.getItem(STORAGE_KEYS.workplaceLegacy) || 'desk_office';
    const topLoad = localStorage.getItem(STORAGE_KEYS.topMentalLoad) || 'balanced';

    let workplaceProfile = null;
    if (window.ChastityDatabase && typeof window.ChastityDatabase.getWorkplaceProfile === 'function') {
      workplaceProfile = window.ChastityDatabase.getWorkplaceProfile(workplaceId);
    }

    return {
      workplaceId: workplaceId,
      workplaceProfile: workplaceProfile,
      topMentalLoad: topLoad, // 'exhausted' | 'balanced' | 'strict'
      isTopExhausted: topLoad === 'exhausted'
    };
  }

  function extractBiologicalHealthVector() {
    const defaultPass = {
      hasDiabetes: false,
      hasAsthma: false,
      hasNeuropathy: false,
      hasBloodThinners: false,
      hasHypermobility: false,
      hasLatexAllergy: false,
      hasPanicAirway: false,
      hasFearDarkness: false,
      hasFearRestraint: false,
      hasFearDegradation: false,
      hasFearSurprise: false,
      customTriggers: '',
      emergencyNotes: ''
    };

    const pass = Object.assign({}, defaultPass, safeJsonParse(STORAGE_KEYS.medicalPass, {}));
    const activeConstraints = [];

    // 1. Physisch-biologische Constraints
    if (pass.hasDiabetes) {
      activeConstraints.push({
        type: 'diabetes_hypoglycemia_guard',
        directive: 'Traubenzucker/Glukose am Bett bereithalten. Fesselungsdauer max. 20 Minuten wegen Wundheilung & Nervensensibilität.'
      });
    }
    if (pass.hasNeuropathy) {
      activeConstraints.push({
        type: 'neuropathy_pressure_guard',
        directive: 'Verminderte Schmerzwahrnehmung an Extremitäten. Regelmäßige Prüfung von Puls & Durchblutung an Fingern/Zehen!'
      });
    }
    if (pass.hasAsthma) {
      activeConstraints.push({
        type: 'asthma_airway_guard',
        directive: 'Keine dichten Knebel oder Atemwegsbehinderungen. Notfall-Inhalator in Reichweite deponieren.'
      });
    }
    if (pass.hasBloodThinners) {
      activeConstraints.push({
        type: 'coagulation_impact_guard',
        directive: 'Erhöhte Hämatomgefahr. Ausschluss harter Schlagwerkzeuge (Paddle, Cane, Gerten); nur sanfte manuelle Reize.'
      });
    }
    if (pass.hasLatexAllergy) {
      activeConstraints.push({
        type: 'latex_barrier_guard',
        directive: 'Strikter Ausschluss von Naturlatex; ausschließlich medizinisches Silikon, Leder oder Textil verwenden.'
      });
    }
    if (pass.hasHypermobility) {
      activeConstraints.push({
        type: 'joint_overextension_guard',
        directive: 'Gelenküberbeweglichkeit beachten: Keine extremen Hebelwirkungen oder Überdehnungen der Schultern/Ellenbogen bei Fesselung.'
      });
    }

    // 2. Psychosomatische Traumagrenzen & spezifische Flashback-Schranken
    if (pass.hasPanicAirway) {
      activeConstraints.push({
        type: 'panic_airway_constraint',
        directive: 'Strikter Ausschluss dichter Knebel, Mund-/Nasenbedeckung oder Thoraxkompression (Atemwegs-Panik).'
      });
    }
    if (pass.hasFearDarkness) {
      activeConstraints.push({
        type: 'fear_darkness_constraint',
        directive: 'Keine unangekündigte Augenbinde; Raumbeleuchtung mindestens gedimmt halten (Orientierungsverlust-Trigger).'
      });
    }
    if (pass.hasFearRestraint) {
      activeConstraints.push({
        type: 'fear_restraint_constraint',
        directive: 'Keine starre 4-Punkt-Fixierung ohne spürbare Restbeweglichkeit (Hilflosigkeits-Panik).'
      });
    }
    if (pass.hasFearDegradation) {
      activeConstraints.push({
        type: 'fear_degradation_constraint',
        directive: 'Kein herabwürdigender Dirty Talk oder Schimpfwörter; ausschließlich ruhige, souveräne Führung.'
      });
    }
    if (pass.hasFearSurprise) {
      activeConstraints.push({
        type: 'fear_surprise_constraint',
        directive: 'Berührungen nur nach vorheriger verbaler oder Blick-Ankündigung (Schreck-Trigger von hinten).'
      });
    }
    if (pass.customTriggers && pass.customTriggers.trim().length > 0) {
      activeConstraints.push({
        type: 'custom_trauma_triggers',
        directive: `Individuelle Traumagrenzen: „${pass.customTriggers.trim()}“`
      });
    }

    return {
      medicalPass: pass,
      activeHealthGuards: activeConstraints,
      emergencyInstructions: pass.customTriggers || pass.emergencyNotes || 'Keine speziellen Notfallnotizen hinterlegt.'
    };
  }

  function extractTopAgendaVector() {
    let ratioProgress = { topCount: 0, subCount: 0, target: 6, isTargetMet: false, remainingInCycle: 6 };
    const ratioModule = window.ProtocolRatio || window.HubRatio;
    if (ratioModule && typeof ratioModule.getProgress === 'function') {
      ratioProgress = ratioModule.getProgress();
    }

    return {
      ratio: ratioProgress,
      topOrgasmsTotal: ratioProgress.topCount,
      subOrgasmsTotal: ratioProgress.subCount,
      targetRatio: ratioProgress.target,
      isSubReleasePermissible: ratioProgress.isTargetMet,
      mandatoryTopCentering: ratioProgress.topCount === 0 || !ratioProgress.isTargetMet
    };
  }

  function extractHardwareAndDoFVector(recipientAnatomy = 'penis', isLocked = false) {
    let allCatalog = [];
    if (window.EquipmentCatalog && typeof window.EquipmentCatalog.getAll === 'function') {
      allCatalog = window.EquipmentCatalog.getAll();
    }
    const customEquipment = safeJsonParse(STORAGE_KEYS.customEquipment, null) || safeJsonParse(STORAGE_KEYS.customEquipmentLegacy, []);
    const ownedIds = safeJsonParse(STORAGE_KEYS.ownedEquipment, null) || safeJsonParse(STORAGE_KEYS.ownedEquipmentLegacy, []);
    const quantities = safeJsonParse(STORAGE_KEYS.toyQuantities, null) || safeJsonParse(STORAGE_KEYS.toyQuantitiesLegacy, {});

    const availableItems = [];
    const combined = [...allCatalog, ...(Array.isArray(customEquipment) ? customEquipment : [])];

    for (let i = 0; i < combined.length; i++) {
      const it = combined[i];
      if (it && it.id && Array.isArray(ownedIds) && ownedIds.includes(it.id)) {
        availableItems.push(Object.assign({}, it, {
          activeQuantity: quantities[it.id] || 1
        }));
      }
    }

    let dofAnalysis = {
      dof: {
        speech_articulation: 1.0,
        tongue_mobility_external: 1.0,
        nasal_breathing: 1.0,
        manual_manipulation: 1.0,
        locomotion_standing: 1.0,
        visual_perception: 1.0,
        pelvic_thrust_active: 1.0,
        penile_shaft_access: 1.0
      },
      isFullyUnrestricted: true
    };

    if (window.ToyCombinatorics && typeof window.ToyCombinatorics.calculateDegreesOfFreedom === 'function') {
      dofAnalysis = window.ToyCombinatorics.calculateDegreesOfFreedom(availableItems);
    }

    let feasibleItems = availableItems;
    if (window.ToyCombinatorics && typeof window.ToyCombinatorics.filterFeasibleEquipment === 'function') {
      feasibleItems = window.ToyCombinatorics.filterFeasibleEquipment(availableItems, recipientAnatomy, isLocked);
    }

    return {
      ownedItemsCount: availableItems.length,
      availableItems: availableItems,
      feasibleItems: feasibleItems,
      remainingDegreesOfFreedom: dofAnalysis.dof,
      restraintStackSummary: dofAnalysis.stack || {}
    };
  }

  function buildUnifiedContextState(customOverrides = {}) {
    const roles = getRoles();
    const names = getNames();

    const topName = names[roles.topRole] || 'Top';
    const bottomName = names[roles.bottomRole] || 'Bottom';

    const v1_psychometry = extractPsychometricVector(roles.topRole, roles.bottomRole);
    const v2_somatic = extractSomaticVector();
    const v3_history = extractEpisodicMemoryVector();
    const v4_energy = extractEnergyAndWorkplaceVector();
    const v5_biology = extractBiologicalHealthVector();
    const v6_agenda = extractTopAgendaVector();
    const v7_hardware = extractHardwareAndDoFVector('penis', v2_somatic.isLocked);

    const unifiedState = {
      metadata: {
        generatedAt: Date.now(),
        topName: topName,
        bottomName: bottomName,
        roles: roles
      },
      v1_psychometry: v1_psychometry,
      v2_somatic: v2_somatic,
      v3_history: v3_history,
      v4_energy: v4_energy,
      v5_biology: v5_biology,
      v6_agenda: v6_agenda,
      v7_hardware: v7_hardware,
      languageDoctrine: TACTUS_LANGUAGE_DOKTRIN
    };

    return Object.assign(unifiedState, customOverrides);
  }

  function createBedroomScriptPrompt({ tonality = 'sovereign_warm', intensityLevel = 6, focusMotif = 'oral_service' }) {
    const ctx = buildUnifiedContextState();
    const topName = ctx.metadata.topName;
    const bottomName = ctx.metadata.bottomName;

    const isLocked = ctx.v2_somatic.isLocked;
    const healthGuards = ctx.v5_biology.activeHealthGuards.map(g => `- ${g.directive}`).join('\n');
    const doubleFivesList = ctx.v1_psychometry.doubleFives.map(d => d.title).slice(0, 6).join(', ');
    const bottomTaboosList = ctx.v1_psychometry.bottomTaboos.map(t => t.title).join(', ');
    const equipmentList = ctx.v7_hardware.feasibleItems.map(it => it.name).slice(0, 12).join(', ');

    const c00 = ctx.v1_psychometry.chapter00Safeguards;
    const relevantNotes = ctx.v1_psychometry.partnerNotes.slice(0, 4).map(n => `- Thema „${n.title}“: [${topName}]: „${n.noteTop || '-'}“ | [${bottomName}]: „${n.noteBottom || '-'}“`).join('\n');

    return `
Du bist der somatische Schlafzimmer-Live-Regisseur des Beziehungs-Betriebssystems TACTUS (tactus.digital).
Erstelle für ${topName} (Top) eine präzise, 4-phasige Live-Regie zur Führung von ${bottomName} (Bottom).

${TACTUS_LANGUAGE_DOKTRIN}

SOMATISCHER KONTEXT DER SESSION:
- Führende Person (Top): ${topName} | Empfangende Person (Bottom): ${bottomName}
- Gewählte Haltung/Tonalität: ${tonality} (z.B. sovereign_warm, sovereign_cool, raw_primal, playful)
- Ziel-Intensitätsstufe: ${intensityLevel} von 10
- Hauptmotiv des Tops: ${focusMotif}
- Verschluss-Status: ${isLocked ? `AKTIV VERRIEGELT (Tag ${ctx.v2_somatic.daysLocked} im ${ctx.v2_somatic.hardwareId}). Schaftkontakt physisch unmöglich!` : 'Unverschlossen / Frei'}
- Orgasmus-Ökonomie: ${ctx.v6_agenda.topOrgasmsTotal} Top-Höhepunkte : ${ctx.v6_agenda.subOrgasmsTotal} Bottom-Freigaben (Ziel ${ctx.v6_agenda.targetRatio}:1). ${ctx.v6_agenda.mandatoryTopCentering ? 'Fokus liegt heute ZWINGEND auf der Entladung des Tops!' : 'Bottom-Freigabe rechnerisch möglich.'}

BIOLOGISCHE & PSYCHOSOMATISCHE SCHUTZSCHRANKEN (RACK & KAPITEL 00):
${healthGuards.length > 0 ? healthGuards : '- Keine chronischen Einschränkungen gemeldet.'}
- Gewünschte Sofort-Intervention bei Überforderung/Trigger (${bottomName}): ${c00.interventionDirective}

TABUS (STRIKT AUSGESCHLOSSEN):
${bottomTaboosList.length > 0 ? bottomTaboosList : '- Keine harten Tabus gemeldet.'}

HINTERLEGTE PARTNER-BEDINGUNGEN & NOTIZEN (BEFOLGEN):
${relevantNotes.length > 0 ? relevantNotes : '- Keine speziellen Notizen vermerkt.'}

PSYCHOMETRISCHE DOPPEL-5ER SYNERGIEN (VORZUZIEHEN):
${doubleFivesList.length > 0 ? doubleFivesList : 'Cunnilingus, Kniestand-Appell, Spanking mit Leder'}

VERFÜGBARE AUSRÜSTUNG IM SCHRANK:
${equipmentList.length > 0 ? equipmentList : 'Hände, Bettkante, Decken, Kissen'}

STRUKTUR DER 4 PHASEN:
Phase 1: Transition & Machtaufbau (Körperliche Erdung, Entkleidung, Etablierung der Hierarchie)
Phase 2: Somatischer Reizaufbau (Ausarbeitung des Hauptmotivs unter Berücksichtigung von DoF und Sperren)
Phase 3: Katharsis & Lust des Tops (Fokus auf Erregung von ${topName}; Bottom dient rückhaltlos)
Phase 4: Reverse Aftercare & Toy-Desinfektion (Bottom versorgt Top mit Decken/Tee/Massage; dezentquittierte Desinfektion der genutzten Ausrüstung)

Antworte als wohlgeformtes, valides JSON ohne Markdown-Fences:
{
  "sessionTitle": "Prägnanter Titel der Session",
  "tonality": "${tonality}",
  "phases": [
    {
      "phaseIndex": 1,
      "title": "Titel Phase 1",
      "instruction": "Genaue Haltungsanweisung für ${bottomName}",
      "topDialogueQuote": "Wörtlicher Befehl von ${topName} in Anführungszeichen",
      "somaticZone": "head_mouth | gluteal_pelvis | chest_nipples | etc.",
      "estimatedMinutes": 10
    }
  ],
  "reverseAftercareInstructions": {
    "subServiceForTop": "Konkrete Entlastungsmassage oder Tee-Gabe durch ${bottomName}",
    "vagusRegulation": "4-7-8 Atemrhythmus und Gewichtsdecke gegen Kältezittern",
    "equipmentDisinfection": "Diskrete Reinigung genutzter Toys (z. B. Isopropanol für Metall, pH-Seife für Silikon)"
  }
}
`;
  }

  function createDailyCoachDirectivePrompt() {
    const ctx = buildUnifiedContextState();
    const topName = ctx.metadata.topName;
    const bottomName = ctx.metadata.bottomName;
    const c00 = ctx.v1_psychometry.chapter00Safeguards;

    return `
Du bist der Führungsassistent und D/s-Coach für ${topName} (Top) im Beziehungs-Betriebssystem TACTUS.
Erstelle für den heutigen Tag eine kurze, alltagstaugliche Führungs-Empfehlung zur Begleitung von ${bottomName}.

${TACTUS_LANGUAGE_DOKTRIN}

KONTEXT:
- Keuschheitsstatus: ${ctx.v2_somatic.isLocked ? `Tag ${ctx.v2_somatic.daysLocked} im Verschluss (${ctx.v2_somatic.tension.archetype.name})` : 'Frei / Unverschlossen'}
- Alltags- und Berufskontext von ${bottomName}: ${ctx.v4_energy.workplaceProfile ? ctx.v4_energy.workplaceProfile.label : 'Büro / Alltag'}
- Mental Load von ${topName}: ${ctx.v4_energy.topMentalLoad} (${ctx.v4_energy.isTopExhausted ? 'ERSCHÖPFT ──► Teasing ZWINGEND in Entlastungsdienst für den Top umwandeln!' : 'Ausgeglichen / Führend'})
- Psychosomatische Notfall-Achtsamkeit: ${c00.interventionDirective}
- Letzte Session: ${ctx.v3_history.lastSession ? `Vor ${Math.round((Date.now() - ctx.v3_history.lastSession.timestamp)/(3600*1000))}h (Tags: ${ctx.v3_history.lastSession.subSomatosensoryTags.join(', ')})` : 'Keine kürzliche Session'}

Erstelle 3 kurze, prägnante Impulse:
1. Morgen-Impuls (z. B. Kniestand vor dem Gehen, Blickkontakt, Duftanker)
2. Alltags-Teaser (abgestimmt auf den Beruf von ${bottomName})
3. Feierabend-Dienst (Haushaltsentlastung & Dienst am Top)

Antworte direkt in 4 bis maximal 6 klaren, souveränen Sätzen.
`;
  }

  window.HubContext = {
    getUnifiedState: buildUnifiedContextState,
    createBedroomScriptPrompt: createBedroomScriptPrompt,
    createDailyCoachDirectivePrompt: createDailyCoachDirectivePrompt,
    getLanguageDoctrine: () => TACTUS_LANGUAGE_DOKTRIN,
    getNames: getNames,
    getRoles: getRoles
  };

})(window);
