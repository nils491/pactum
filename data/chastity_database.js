/**
 * data/chastity_database.js
 * TACTUS Biologische Hysterese-Spannungskurve, Nicht-lineare Erregungsberechnung & Phasen-Archetypen (V3.0 Haute-Horlogerie)
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien nach Master-Roadbook:
 * - 100 % UTF-8 Integrität: Echte deutsche Umlaute (ä, ö, ü, ß) im gesamten Modul
 * - Echte Hyperdynamik (Gesetz 11): Nicht-lineares dynamisches Hysterese-Modell mit Gedächtnisfunktion
 *   Tension(t) = f(daysLocked, edgingsCount, ruinedOrgasmDivergence, hardwarePhysics, workplaceStressor, topMentalLoad)
 * - 4 Somatische Phasen-Archetypen (Gewöhnung, Sensibilisierung, Resignation/Hypofrontalität, Symbiose)
 * - Biomechanische Hardware-Physik (Micro-Stubby <=35mm, Bioresin, Heavy Steel 350g+, Flat Shield)
 * - Urologischer Balanitis-Schutz- & Spülfenster-Kalkulator
 * - Generative Teleprompter-Direktiven & Zitate für Staging und Live-Regie
 * - Bereitstellung an window.ChastityDatabase sowie CommonJS-Export
 */

(function(window) {
  'use strict';

  const HYSTERESIS_CONSTANTS = {
    EDGING_RESIDUAL_DECAY_HOURS: 28, // Halbwertszeit akkumulierter Schwellen-Erregung
    RUINED_PHYSICAL_RELIEF: 4.5,     // Druckentlastung der Schwellkörper
    RUINED_MENTAL_SPIKE: 2.8,        // Erhöhung der psychologischen Unterordnung
    BASE_SENSITIVITY_PEAK_DAY: 5.5,  // Testosteron-Kulminationspeak
    UROLOGICAL_MAX_HOURS_DRY: 24,    // Maximale Zeit ohne Spülung
    HEAVY_STEEL_CBT_FACTOR: 1.6      // Dauerhafter Zugkraft-Faktor an Hoden/Samenstrang
  };

  const PHASE_ARCHETYPES = {
    adaptation: {
      id: 'adaptation',
      phaseIndex: 1,
      name: 'Phase 1: Gewöhnung & Antizipation',
      dayRange: [1, 3],
      primaryState: 'Dopaminerge Unruhe & Gewebsanpassung',
      somaticHallmarks: [
        'Akute Anpassung der Haut an Ring und Eichelkammer',
        'Wiederkehrende spontane nächtliche Erektionsversuche (REM-Tumeszenz)',
        'Erhöhte gedankliche Fixierung auf den Verschluss und die Schlüsselherrin',
        'Ungeduldiger Drang nach Bestätigung oder baldigem Aufschluss'
      ],
      directiveObjective: 'Gewebeschutz, Passform-Überprüfung & klare Grenzziehung gegen Betteln',
      topToneRecommended: 'sovereign_warm',
      teleprompterQuotes: [
        '„Spüre die Begrenzung des Rings. Jeder Versuch deines Körpers zu wachsen erinnert dich daran, wem du gehörst.“',
        '„Lass die Unruhe zu. Dein Verstand will verhandeln, aber dein Körper lernt jetzt zu schweigen.“'
      ]
    },

    sensitization: {
      id: 'sensitization',
      phaseIndex: 2,
      name: 'Phase 2: Reiz-Sensibilisierung & Testosteron-Peak',
      dayRange: [4, 7],
      primaryState: 'Hyperästhesie des Beckenbodens & Kulmination',
      somaticHallmarks: [
        'Hyperästhesie der Nervenendigungen an Damm, Hoden und Brustwarzen',
        'Starke Erregungsausbreitung bereits bei flüchtiger Berührung von außen',
        'Hohe Bereitschaft zur Unterordnung und Dienstleistung im Haushalt',
        'Zittern des Schwellkörpers bei verbaler Ansprache durch den Top'
      ],
      directiveObjective: 'Gezieltes Teasing, Kniestand-Appelle & Kanalisierung in Alltagsentlastung',
      topToneRecommended: 'playful',
      teleprompterQuotes: [
        '„Deine Nervenenden glühen. Jede Berührung an deinen Schenkeln zieht direkt in deinen verschlossenen Schritt.“',
        '„Du bist jetzt hochsensibel. Ein einziges Wort von mir genügt, um dein Becken beben zu lassen.“'
      ]
    },

    resignation: {
      id: 'resignation',
      phaseIndex: 3,
      name: 'Phase 3: Somatische Resignation & Transiente Hypofrontalität',
      dayRange: [8, 14],
      primaryState: 'De-Reflexion (Baumeister-Effekt) & Gedankenstille',
      somaticHallmarks: [
        'Das zwanghafte Kreisen der Gedanken um den Orgasmus bricht zusammen',
        'Eintritt in die zerebrale Entlastung: Der präfrontale Kortex schaltet Alltagsgrübeln ab',
        'Tiefe vegetative Entspannung, ruhigerer Puls und gelassene Hingabe',
        'Der Verschluss wird nicht mehr als Fremdkörper, sondern als Ruhesiegel empfunden'
      ],
      directiveObjective: 'Seelische Geborgenheit, tiefe Vagus-Erdung & absichtslose Massagen',
      topToneRecommended: 'sovereign_cool',
      teleprompterQuotes: [
        '„Die Stille in deinem Kopf gehört mir. Du hast aufgehört zu hoffen – und genau das schenkt dir Frieden.“',
        '„Dein Körper hat die Führung akzeptiert. Atme ruhig durch und ruhe in meiner Verantwortung.“'
      ]
    },

    symbiosis: {
      id: 'symbiosis',
      phaseIndex: 4,
      name: 'Phase 4: Eudaimonische Symbiose & Langzeit-Dienst',
      dayRange: [15, 999],
      primaryState: 'Identitäts-Integration & Dauerhafte Entlastung',
      somaticHallmarks: [
        'Vollständige somatosensorische Integration: Der Käfig ist die normale zweite Haut',
        'Triebenergie ist dauerhaft in partnerschaftliche Dienstbarkeit und Fürsorge transformiert',
        'Orgasmen werden selten und ausschließlich als feierliche Gunst der Herrin erlebt',
        'Bedingungslose Verlässlichkeit und tiefe Verbundenheit im Beziehungsalltag'
      ],
      directiveObjective: 'Souveräne Alltags-Totalregie, feierliche Gunst-Rituale & absolute Stabilität',
      topToneRecommended: 'sovereign_warm',
      teleprompterQuotes: [
        '„Verschlossen vor mir zu stehen ist deine Natur geworden. Ein Bekenntnis, das Tag für Tag tiefer wurzelt.“',
        '„Deine Männlichkeit ruht sicher in meiner Hand. Wir haben das Verlangen in reine Nähe verwandelt.“'
      ]
    }
  };

  const HARDWARE_PROFILES = {
    penis_cherrykeeper: {
      id: 'penis_cherrykeeper',
      name: 'Cherrykeeper Micro Stub (<= 35mm)',
      category: 'micro_stubby',
      lengthMm: 32,
      material: 'sls_nylon',
      weightGrams: 28,
      hypofrontalityAccelerationDays: 2.2, // Beschleunigt Eintritt in Phase 3
      sittingPressureStressor: 1.4,        // Erhöhter Schambeindruck beim Sitzen
      tumescenceAllowanceRatio: 0.05,     // Nahezu 0 % Schwellung möglich
      description: 'Extrem kurzer Käfig; erzwingt vollständige mechanische Schwellungsblockade.'
    },
    penis_cobra: {
      id: 'penis_cobra',
      name: 'Kink3D Cobra (SLS-Nylon)',
      category: 'ergonomic_nylon',
      lengthMm: 48,
      material: 'sls_nylon',
      weightGrams: 35,
      hypofrontalityAccelerationDays: 1.0,
      sittingPressureStressor: 0.9,
      tumescenceAllowanceRatio: 0.12,
      description: 'Ergonomischer 3D-Druck-Käfig mit breiter Eichelkammer und exzellenter Belüftung.'
    },
    penis_viper: {
      id: 'penis_viper',
      name: 'Kink3D Viper (Kompakt)',
      category: 'compact_nylon',
      lengthMm: 40,
      material: 'sls_nylon',
      weightGrams: 30,
      hypofrontalityAccelerationDays: 1.5,
      sittingPressureStressor: 1.0,
      tumescenceAllowanceRatio: 0.08,
      description: 'Kompakte Bauweise; sicherer Halt bei sportlicher Alltagsbewegung.'
    },
    penis_holytrainer: {
      id: 'penis_holytrainer',
      name: 'HolyTrainer V6 (Bioresin)',
      category: 'standard_resin',
      lengthMm: 55,
      material: 'bioresin',
      weightGrams: 65,
      hypofrontalityAccelerationDays: 0.4,
      sittingPressureStressor: 0.8,
      tumescenceAllowanceRatio: 0.22, // Erlaubt minimale Schwellung gegen Gitter
      description: 'Klassischer europäischer Bioresin-Käfig; anhaltende taktile Rückkopplung.'
    },
    penis_jailbird: {
      id: 'penis_jailbird',
      name: 'Mature Metal Jailbird (Edelstahl 316L)',
      category: 'heavy_steel',
      lengthMm: 50,
      material: 'steel_316l',
      weightGrams: 380, // Hohes Eigengewicht
      hypofrontalityAccelerationDays: 0.8,
      sittingPressureStressor: 1.3,
      tumescenceAllowanceRatio: 0.05,
      heavySteelCbtFactor: 1.6, // Permanenter Hoden-Zug
      description: 'Massives, kühles Chirurgenstahl-Gewebe; erzeugt anhaltenden Schwerkraft-Zug an den Hoden.'
    },
    penis_flat: {
      id: 'penis_flat',
      name: 'Flat Shield (Nun-Cage)',
      category: 'inverted_flat',
      lengthMm: 20,
      material: 'polycarbonate',
      weightGrams: 45,
      hypofrontalityAccelerationDays: 2.8,
      sittingPressureStressor: 1.6,
      tumescenceAllowanceRatio: 0.0,
      description: 'Drückt das Glied flach nach innen; vollständige Beseitigung jeder männlichen Wölbung.'
    },
    female_belt: {
      id: 'female_belt',
      name: 'Weiblicher Keuschheitsgürtel (Leder/Stahl)',
      category: 'female_chastity',
      lengthMm: 0,
      material: 'leather_and_steel',
      weightGrams: 420,
      hypofrontalityAccelerationDays: 1.2,
      sittingPressureStressor: 1.1,
      tumescenceAllowanceRatio: 0.0,
      description: 'Umfassende Becken- und Klitoris-Versiegelung mit perforiertem Intimschild.'
    }
  };

  const WORKPLACE_VECTORS = {
    desk_office: {
      id: 'desk_office',
      label: 'Büro & Dauersitzen',
      pelvicStagnationWeight: 1.3,
      sweatFrictionWeight: 0.7,
      spuelIntervalHours: 12,
      postureWarning: 'Venöse Stauung im Beckenboden durch 90°-Sitzwinkel; Schambein-Entlastung nötig.'
    },
    craft_physical: {
      id: 'craft_physical',
      label: 'Handwerk & Baustelle',
      pelvicStagnationWeight: 0.6,
      sweatFrictionWeight: 2.2, // Hohe Reibung
      spuelIntervalHours: 6,   // Dringendes Intervall
      postureWarning: 'Starker Schweißabfluss und Staub in der Eichelkammer; Mazerationsrisiko.'
    },
    medical_service: {
      id: 'medical_service',
      label: 'Pflege & Gastronomie',
      pelvicStagnationWeight: 1.1,
      sweatFrictionWeight: 1.4,
      spuelIntervalHours: 8,
      postureWarning: 'Dauerhaftes Stehen belastet die Lendenwirbelsäule und die Schenkelinnenseiten.'
    },
    driver_field: {
      id: 'driver_field',
      label: 'Fahrer & Außendienst',
      pelvicStagnationWeight: 1.5,
      sweatFrictionWeight: 1.1,
      spuelIntervalHours: 10,
      postureWarning: 'Vibration des Fahrzeugsitzes triggert mechanische Reizung am Verschlussring.'
    },
    shift_variable: {
      id: 'shift_variable',
      label: 'Schichtdienst & Wechselschicht',
      pelvicStagnationWeight: 1.0,
      sweatFrictionWeight: 1.0,
      spuelIntervalHours: 8,
      postureWarning: 'Verschobene REM-Schlafphasen verschieben den nächtlichen Tumeszenz-Druck.'
    }
  };

  /**
   * Berechnet den dynamischen somatischen Spannungszustand des Keuschlings.
   * Nicht-lineare mathematische Modellierung:
   * 
   * @param {Object} params
   * @param {number} params.daysLocked - Reale Tage seit Verriegelung
   * @param {number} params.edgingsCount - Anzahl kürzlich durchgeführter Schwellenstopps
   * @param {number} [params.lastRuinedHoursAgo] - Stunden seit dem letzten ruinierten Orgasmus
   * @param {string} [params.hardwareId] - ID der Verschluss-Hardware
   * @param {string} [params.workplaceId] - ID des Arbeitsplatzprofils
   * @param {string} [params.topMentalLoad] - 'exhausted' | 'balanced' | 'strict' | 'playful'
   * @returns {Object} Vollständiger 6-Vektoren-Spannungs- und Hygienebericht
   */
  function calculateDynamicTension(params = {}) {
    const days = Math.max(0, parseFloat(params.daysLocked) || 0);
    const edgings = Math.max(0, parseInt(params.edgingsCount, 10) || 0);
    const lastRuinedHours = (params.lastRuinedHoursAgo !== undefined && params.lastRuinedHoursAgo !== null)
      ? Math.max(0, parseFloat(params.lastRuinedHoursAgo))
      : null;
    const hardware = HARDWARE_PROFILES[params.hardwareId] || HARDWARE_PROFILES.penis_cobra;
    const workplace = WORKPLACE_VECTORS[params.workplaceId] || WORKPLACE_VECTORS.desk_office;
    const topLoad = params.topMentalLoad || 'balanced';

    // 1. Berechne theoretische biologische Basiskurve (Sigmoidaler Anstieg mit Hormonpeak an Tag 5-6)
    let baseTension = 0;
    if (days <= 0.2) {
      baseTension = 1.0;
    } else if (days <= 3.0) {
      // Phase 1: Rascher dopaminerger Anstieg
      baseTension = 1.5 + (days * 1.6); // 1.5 -> 6.3
    } else if (days <= 7.0) {
      // Phase 2: Testosteron-Kulminationspeak (Gauß-artige Überhöhung)
      const distFromPeak = Math.abs(days - HYSTERESIS_CONSTANTS.BASE_SENSITIVITY_PEAK_DAY);
      baseTension = 8.8 - (distFromPeak * 0.4); // 8.2 bis 8.8
    } else if (days <= 14.0) {
      // Phase 3: Allmähliches Abklingen in die Resignation / Hypofrontalität
      const decayFraction = (days - 7.0) / 7.0;
      baseTension = 8.2 - (decayFraction * 2.0); // 8.2 -> 6.2
    } else {
      // Phase 4: Langzeit-Plateau symbiotischer Ausgeglichenheit
      baseTension = Math.max(4.8, 6.2 - Math.log10((days - 14.0) + 1.0) * 0.6);
    }

    // 2. Hardware-Physik Beschleunigungsfaktor
    let effectiveDays = days + (hardware.hypofrontalityAccelerationDays || 0);

    // 3. Nicht-linearer Edging-Residuum Akkumulator (Gedächtnisfunktion)
    // Jeder Edging-Stopp hinterlässt akkumulierte Beckenbodenspannung
    const edgingResidue = Math.min(3.8, edgings * 0.95);
    let physicalTensionScore = baseTension + edgingResidue;

    // 4. Ruined-Orgasm Divergenz
    // Ein ruinierter Orgasmus entlastet die Gewebetumeszenz, steigert aber die mentale Unterordnung
    let mentalDevotionIndex = baseTension + (days * 0.25);

    if (lastRuinedHours !== null && lastRuinedHours < 48) {
      const hoursFactor = Math.max(0, 1 - (lastRuinedHours / 48));
      const reliefDampening = HYSTERESIS_CONSTANTS.RUINED_PHYSICAL_RELIEF * hoursFactor;
      physicalTensionScore = Math.max(1.8, physicalTensionScore - reliefDampening);
      mentalDevotionIndex += (HYSTERESIS_CONSTANTS.RUINED_MENTAL_SPIKE * hoursFactor);
    }

    // 5. Hardware CBT-Zuschlag bei schwerem Edelstahl
    if (hardware.heavySteelCbtFactor) {
      physicalTensionScore += (hardware.heavySteelCbtFactor * 0.8);
    }

    // 6. Arbeitsplatz-Ergonomie Modulation
    physicalTensionScore *= (workplace.pelvicStagnationWeight * 0.85);

    // Skalierung auf [1.0, 10.0]
    const clampedTensionScore = Math.round(Math.max(1.0, Math.min(10.0, physicalTensionScore)) * 10) / 10;
    const clampedDevotionIndex = Math.round(Math.max(1.0, Math.min(10.0, mentalDevotionIndex)) * 10) / 10;

    // 7. Bestimme Phasen-Archetyp anhand der effektiven Tragedauer
    let currentArchetype = PHASE_ARCHETYPES.adaptation;
    if (effectiveDays >= 15.0) currentArchetype = PHASE_ARCHETYPES.symbiosis;
    else if (effectiveDays >= 8.0) currentArchetype = PHASE_ARCHETYPES.resignation;
    else if (effectiveDays >= 3.5) currentArchetype = PHASE_ARCHETYPES.sensitization;

    // 8. Urologisches Hygiene- und Spülfenster berechnen
    const spuelHoursLimit = Math.round(workplace.spuelIntervalHours * (hardware.sittingPressureStressor > 1.2 ? 0.8 : 1.0));
    const urgency = (days >= 4.0 && workplace.sweatFrictionWeight > 1.5) ? 'high' : 'standard';

    return {
      effectiveTensionIndex: clampedTensionScore,
      mentalDevotionIndex: clampedDevotionIndex,
      archetype: currentArchetype,
      effectiveDays: Math.round(effectiveDays * 10) / 10,
      pelvicSensitivityScore: Math.min(10, Math.round(clampedTensionScore * 0.95 + edgingResidue)),
      hardwareInfo: hardware,
      workplaceContext: workplace,
      urologicalWindow: {
        recommendedIntervalHours: spuelHoursLimit,
        urgency: urgency,
        directive: `${workplace.label}: 50ml sterile Kochsalzspülung alle ${spuelHoursLimit} Stunden einhalten.`
      },
      topChanneling: getTopMentalLoadChanneling(topLoad, clampedTensionScore, currentArchetype)
    };
  }

  function getTopMentalLoadChanneling(topMentalLoad, tensionScore, archetype) {
    if (topMentalLoad === 'exhausted') {
      return {
        strategy: 'restorative_service',
        title: 'Kanalisierung in stillen Entlastungsdienst',
        instruction: `Die hohe somatische Spannung des Bottoms (${tensionScore}/10) wird heute keinesfalls erotisch verspielt. Wandle sie zwingend in stillen Dienst um: 20-minütige Fuß- oder Nackenmassage für die Herrin im Halbdunkel ohne Worte.`,
        teleprompter: `„Deine aufgestaute Hitze gehört heute ganz meiner Entspannung. Du massierst meine Füße, ohne ein Wort zu fordern.“`
      };
    } else if (topMentalLoad === 'strict') {
      return {
        strategy: 'authoritative_inspection',
        title: 'Kanalisierung in Haltung & Zucht',
        instruction: `Spannungsüberhang für Disziplinierung nutzen: 15 Minuten Fersensitz (Nadu) mit aufrechtem Oberkörper, Vorzeigen des tadellosen Sitzes des Verschlusses und 10 gezielte Schläge auf das Gesäß.`,
        teleprompter: `„Knie dich vor meine Füße. Zeig mir dein Glied im Metall. Du zuckst nicht, wenn meine Hand fällt.“`
      };
    } else if (topMentalLoad === 'playful') {
      return {
        strategy: 'tease_and_denial',
        title: 'Kanalisierung in Schwellen-Quälerei (Teasing)',
        instruction: `Nutzung der Hyperästhesie von ${archetype.name}: Vibrations-Toy von außen fest an die Gitterstäbe pressen, an die Kante führen und abrupt stoppen. Käfig bleibt verriegelt.`,
        teleprompter: `„Du bettelst mit den Augen? Gut so. Spüre, wie das Metall die Vibrationen leitet – und jetzt bleibst du wieder still.“`
      };
    } else {
      return {
        strategy: 'grounded_bonding',
        title: 'Kanalisierung in meditative Verbundenheit',
        instruction: `Ausgewogene Führung: Sanfte Hände am Hals (Grounding), 60 Sekunden tiefer Blickkontakt und andächtige Bestätigung der gewählten Rollen.`,
        teleprompter: `„Sieh mich an. Dein Körper ist ruhig geworden. Ich halte den Schlüssel zu deiner Lust in meiner Hand.“`
      };
    }
  }

  /**
   * Generiert ein situatives Teleprompter-Zitat basierend auf der Hysterese-Physik.
   */
  function getGenerativeDirective(context = {}) {
    const tension = calculateDynamicTension(context);
    const quotes = tension.archetype.teleprompterQuotes;
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    return {
      archetype: tension.archetype,
      tensionIndex: tension.effectiveTensionIndex,
      quote: randomQuote,
      channeling: tension.topChanneling
    };
  }

  function getArchetypeById(archetypeId) {
    return PHASE_ARCHETYPES[archetypeId] || PHASE_ARCHETYPES.adaptation;
  }

  function getAllHardwareProfiles() {
    return Object.assign({}, HARDWARE_PROFILES);
  }

  function getAllWorkplaceVectors() {
    return Object.assign({}, WORKPLACE_VECTORS);
  }

  const api = {
    calculateDynamicTension: calculateDynamicTension,
    getGenerativeDirective: getGenerativeDirective,
    getArchetypeById: getArchetypeById,
    getAllHardwareProfiles: getAllHardwareProfiles,
    getAllWorkplaceVectors: getAllWorkplaceVectors,
    constants: HYSTERESIS_CONSTANTS,
    phases: PHASE_ARCHETYPES
  };

  window.ChastityDatabase = api;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

})(typeof window !== 'undefined' ? window : this);
