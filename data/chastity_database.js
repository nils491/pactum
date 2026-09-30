/**
 * data/chastity_database.js
 * TACTUS Somatische Spannungs-, Ergonomie- & Alltags-Engine (V3.0 Hyper-Dynamisch)
 * Offizielle Web-Praesenz: tactus.digital
 * 
 * Standards & Garantien:
 * - Biologische Hysterese-Spannungsberechnung (Tage, Schwellenkontakt, Ruined Orgasm)
 * - 4 Somatische Phasen-Archetypen (Gewoehnung, Peak, Tiefe Hingabe, Zenit)
 * - Anti-Top-Fatigue Doktrin im Teasing-Synthesizer (Pivoting zu Entlastungsdienst)
 * - 5 Biomechanische Arbeitsplatz- & Alltagsprofile (Buerositz, Bau, Pflege, Fahrt, Schicht)
 * - Detaillierte physikalische Hardware-Profile (Materialien, Mazeration, Belueftung)
 * - 100 % frei von infantilen System-Emojis in Datenstrukturen und Code
 * - Keine window.alert() / window.confirm() Aufrufe unter keinen Umstaenden
 */

(function(window) {
  'use strict';

  // 4 Fundamentale somatische Phasen-Archetypen
  const SOMATIC_ARCHETYPES = [
    {
      id: "adaptation",
      phaseIndex: 1,
      name: "Phase 1: Gewoehnung & Antizipation (Tag 1–3)",
      dayRange: [1, 3],
      primaryFocus: "Hautschutz, anatomische Ruhe & Gewoehnung an die mechanische Grenze",
      pelvicTone: "Leicht gespannt; unbewusste Schwellungsversuche in der REM-Schlafphase",
      directiveObjective: "Etablierung der urologischen Spuelroutine und beruhigende Handauflegung",
      somaticGuidance: "Der Koerper gewoehnt sich an das Fremdmaterial. Nachts treten unwillkuerliche Erektionen auf, die durch den Kaefig sanft begrenzt werden. Keine zusaetzlichen Schmerzreize setzen; der Fokus liegt auf Mazerationsschutz."
    },
    {
      id: "testosterone_peak",
      phaseIndex: 2,
      name: "Phase 2: Testosteron-Peak & Reizbarkeit (Tag 4–7)",
      dayRange: [4, 7],
      primaryFocus: "Kanalisierung von hormoneller Unruhe und Ueberdruss in Gehorsam und Haushaltsdienst",
      pelvicTone: "Hochexplosiv; gesteigerte Erregbarkeit bei geringsten taktilen Beruehrungen",
      directiveObjective: "Strikte Ablehnung von Verhandlungen; Umwandlung von Nervositaet in koerperliche Pflichten",
      somaticGuidance: "Gemaess Canivet et al. (2025) erreicht das freie Testosteron um Tag 5–7 ein voruebergehendes Maximum. Der Sub neigt zu subtiler Rebellion, Schmollen oder TftB-Versuchen. Disziplinierung und schwere Pflichten erden das Nervensystem."
    },
    {
      id: "deep_surrender",
      phaseIndex: 3,
      name: "Phase 3: Tiefe Unterordnung & Fokus (Tag 8–21)",
      dayRange: [8, 21],
      primaryFocus: "Neuronale Akzeptanz der Schranke; vollstaendige Verlagerung der Lust auf die Zufriedenheit des Tops",
      pelvicTone: "Tief entspannt mit blitzartiger Erregbarkeit auf wörtliche Befehle des Tops",
      directiveObjective: "Hingabedienste, P-Spot Erkundung, zarte Zuechtigung und feste Hierarchie",
      somaticGuidance: "Die ständige Beschaeftigung mit der eigenen Ejakulation weicht einer tiefen Gelassenheit. Der Sub empfindet Erleichterung ueber die abgegebene Verantwortung. Schwellen-Quälerei (Edging) fuehrt hier zu tiefem Subspace."
    },
    {
      id: "zenith_equilibrium",
      phaseIndex: 4,
      name: "Phase 4: Kontinuierlicher Zenit & Demut (Tag 22+)",
      dayRange: [22, 999],
      primaryFocus: "Der Verschluss wird zur koerperlichen Selbstverstaendlichkeit und festen Beziehungsbasis",
      pelvicTone: "Vollstaendige somatische Desensibilisierung des Schafts; maximale Vagus-Resonanz",
      directiveObjective: "Langfristige Treuebekenntnisse, exklusive Fuehrung der Herrin und absolute Ruhe",
      somaticGuidance: "Der Kaefig wird nicht mehr als Einschraenkung, sondern als Schutzhuelle und Demutsanker wahrgenommen. Die Ejakulationsgier ist voellig entkoppelt; Orgasmen erfolgen nur noch als seltene Gunst oder Ruined Orgasm auf Befehl."
    }
  ];

  // 5 Biomechanische Alltags- und Arbeitsplatzprofile
  const WORKPLACE_PROFILES = {
    desk_office: {
      id: "desk_office",
      label: "Büro / Homeoffice (Dauersitzen & Bildschirmarbeit)",
      primaryPosture: "Sitzen auf Bürostuhl mit 90-Grad-Hüftwinkel",
      frictionRisk: "Dauerdruck auf Schambein und Hodenansatz; venöse Stauung im Beckenboden",
      hygieneWindowHours: 12,
      recommendedRelief: "Diskrete Beckenboden-Kontraktionen (Kegel-Befehle) alle 2 Stunden",
      allotmentDirectives: {
        morning: "Vor Verlassen der Wohnung: 30 Sekunden aufrechter Kniestand mit ruhigem Blickkontakt vor den Knien der Herrin.",
        workday: "3x 20 diskrete Beckenboden-Kontraktionen waehrend Meetings oder Schreibtischarbeit zur Entlastung des Schambeinbogens.",
        evening: "Schuhe der Partnerin an der Tuer abnehmen; 15 Minuten schweigende Fussmassage auf Knien."
      }
    },
    craft_physical: {
      id: "craft_physical",
      label: "Handwerk / Baustelle (Körperliche Belastung & Schwitzen)",
      primaryPosture: "Bücken, Heben, Treppensteigen, Knien auf harten Böden",
      frictionRisk: "Starker Schweiß, Staub und Reibung; erhöhtes Risiko für Mazeration und Follikulitis",
      hygieneWindowHours: 6,
      recommendedRelief: "Kochsalzspülung sofort nach Feierabend; Tragen atmungsaktiver SLS-Nylon-Käfige",
      allotmentDirectives: {
        morning: "Prüfung des festen Verschlusses; Schutzbalsam auf Damm und Oberschenkelinnenseiten auftragen.",
        workday: "Konsequenter Fokus auf die Arbeit. Jede körperliche Anstrengung als Zeichen der Dienstbereitschaft empfinden.",
        evening: "Sofortige urologische Spülung der Vorhautkammer unter der Dusche; Vorzeigen des sauberen Hautbilds."
      }
    },
    medical_service: {
      id: "medical_service",
      label: "Pflege / Gastronomie / Einzelhandel (Dauerhaftes Stehen & Gehen)",
      primaryPosture: "8–12 Stunden aufrechtes Stehen und zügiges Gehen in engen Kasacks/Schuhen",
      frictionRisk: "Scheuern des Basisrings an den Hodenkanten; Ermüdung der Lendenwirbelsäule",
      hygieneWindowHours: 8,
      recommendedRelief: "Glatt gepolsterte Ringe; Entlastungshochlagerung der Beine nach Schichtende",
      allotmentDirectives: {
        morning: "Kühler Dammguss vor Dienstantritt zur Beruhigung des Schwellkörpergewebes.",
        workday: "Jeder Schritt erinnert an die Grenze; keine hastigen Klogänge; striktes Einhalten der Haltung.",
        evening: "Vollständige Haushaltsentlastung der Herrin: Kochen, Tischdecken und Aufräumen ohne jede Gegenforderung."
      }
    },
    driver_field: {
      id: "driver_field",
      label: "Fahrer / Außendienst / Pendler (Autositz & Vibration)",
      primaryPosture: "Längeres Sitzen im Fahrzeugsitz mit Vibration und Beckenerschütterung",
      frictionRisk: "Reibung durch Sicherheitsgurt und Schaltsitz; Hitzeentwicklung im Lendenbereich",
      hygieneWindowHours: 10,
      recommendedRelief: "Leichte Silikon- oder PA12-Käfige; regelmäßige Streckpausen an Raststätten",
      allotmentDirectives: {
        morning: "Duftanker der Herrin im Auto anbringen; Konzentrationsfokus auf defensive, ruhige Fahrweise.",
        workday: "An jeder roten Ampel: Hände fest am Lenkrad lassen, aufrecht hinsetzen und tief ausatmen.",
        evening: "Einkäufe und schwere Taschen ins Haus tragen; Abendbrot auf Knien anrichten."
      }
    },
    shift_variable: {
      id: "shift_variable",
      label: "Schichtdienst / Wechselschicht (Verschobener Biorhythmus)",
      primaryPosture: "Unregelmäßige Tag-Nacht-Rhythmen, gestörte REM-Schlafphasen",
      frictionRisk: "Verschobene Testosteron-Peaks; erhöhte Cortisolausschüttung bei Schlafmangel",
      hygieneWindowHours: 8,
      recommendedRelief: "Flexible Spülzeiten angepasst an Schlafblöcke; Gewichtsdecke zur Schlafberuhigung",
      allotmentDirectives: {
        morning: "Schlafzimmer abdunkeln, Gewichtsdecke auflegen, 4-7-8 Vagus-Atmung vor dem Tagesschlaf.",
        workday: "Stille Konzentration in der Nachtschicht; Gedankenanker an die schlafende Partnerin daheim.",
        evening: "Kaffee ans Bett bringen, wenn der Top aufwacht; diskreter Statusrapport im Kniestand."
      }
    }
  };

  // Physikalische Hardware-Profile gängiger Verschlussmodelle
  const HARDWARE_PROFILES = {
    penis_cherrykeeper: {
      id: "penis_cherrykeeper",
      name: "Cherrykeeper Micro Stub (<= 35mm)",
      manufacturer: "Cherrykeeper",
      materials: ["nylon_sls", "brass"],
      weightGrams: 28,
      ventilationRating: 0.85,
      macerationRiskFactor: 0.25,
      isAntiErectionAbsolute: true,
      ergonomicProfile: "Ultra-kompakt; drückt die Eichel vollständig zurück; ideal für Bürositz und Alltag.",
      recommendedDisinfection: "isopropanol_soak"
    },
    penis_cobra: {
      id: "penis_cobra",
      name: "Kink3D Cobra (SLS-Nylon PA12)",
      manufacturer: "Kink3D",
      materials: ["nylon_sls"],
      weightGrams: 34,
      ventilationRating: 0.95,
      macerationRiskFactor: 0.18,
      isAntiErectionAbsolute: true,
      ergonomicProfile: "Hervorragende Belüftung durch Gitterstruktur; leichtes Tragegefühl; sehr gut für Sport/Bau.",
      recommendedDisinfection: "boiling_or_isopropanol"
    },
    penis_viper: {
      id: "penis_viper",
      name: "Kink3D Viper (Kompakt)",
      manufacturer: "Kink3D",
      materials: ["nylon_sls"],
      weightGrams: 32,
      ventilationRating: 0.90,
      macerationRiskFactor: 0.20,
      isAntiErectionAbsolute: true,
      ergonomicProfile: "Kurzer Käfig mit geschwungenem Führungsbogen; minimiert Druck auf den Damm.",
      recommendedDisinfection: "boiling_or_isopropanol"
    },
    penis_holytrainer: {
      id: "penis_holytrainer",
      name: "HolyTrainer V6 (Bioresin / Bio-Harz)",
      manufacturer: "HolyTrainer",
      materials: ["bioresin", "medical_silicone"],
      weightGrams: 48,
      ventilationRating: 0.65,
      macerationRiskFactor: 0.45,
      isAntiErectionAbsolute: true,
      ergonomicProfile: "Sehr glatte, hautschonende Oberfläche; benötigt konsequente tägliche Spülungen.",
      recommendedDisinfection: "mild_soap_handwash"
    },
    penis_jailbird: {
      id: "penis_jailbird",
      name: "Mature Metal Jailbird (Edelstahl 316L)",
      manufacturer: "Mature Metal",
      materials: ["medical_steel"],
      weightGrams: 195,
      ventilationRating: 0.70,
      macerationRiskFactor: 0.35,
      isAntiErectionAbsolute: true,
      ergonomicProfile: "Schweres, kaltes Metallgewicht; spürbare physische Präsenz bei jedem Schritt.",
      recommendedDisinfection: "isopropanol_immersion"
    },
    penis_flat: {
      id: "penis_flat",
      name: "Flat Shield / Nun-Cage (Flachverschluss)",
      manufacturer: "Anatomical Custom",
      materials: ["polycarbonate", "steel"],
      weightGrams: 42,
      ventilationRating: 0.60,
      macerationRiskFactor: 0.40,
      isAntiErectionAbsolute: true,
      ergonomicProfile: "Erzwingt flache Ausrichtung an der Bauchwand; unsichtbar unter Anzügen.",
      recommendedDisinfection: "isopropanol_wipe"
    },
    female_belt: {
      id: "female_belt",
      name: "Weiblicher Keuschheitsgürtel (Shield Belt)",
      manufacturer: "Steel & Leather Craft",
      materials: ["medical_steel", "leather"],
      weightGrams: 620,
      ventilationRating: 0.50,
      macerationRiskFactor: 0.55,
      isAntiErectionAbsolute: false,
      ergonomicProfile: "Vollständige klitorale Barriere mit pelviner Arretierung; verlangt polsternde Einlagen.",
      recommendedDisinfection: "antiseptic_leather_spray"
    }
  };

  /**
   * Berechnet die biologische Hysterese-Spannung:
   * Berücksichtigt Tage im Verschluss, Zeit seit letztem Schwellenkontakt (Edging)
   * und vorübergehende Dämpfung durch Ruined Orgasm.
   */
  function calculateDynamicTension({ daysLocked = 1, lastEdgeHoursAgo = 999, hadRecentRuinedOrgasm = false }) {
    const rawDays = Math.max(1, parseInt(daysLocked, 10) || 1);

    // Hysterese-Korrektur: Ruined Orgasm senkt akute Ejakulationsnot, erhält aber Unterordnung
    let effectiveTensionIndex = rawDays;
    if (hadRecentRuinedOrgasm) {
      effectiveTensionIndex = Math.max(2, rawDays * 0.7);
    }

    // Frisches Edging (<24h) erhöht die pelvine Reizbarkeit spürbar
    if (lastEdgeHoursAgo < 24) {
      effectiveTensionIndex += 1.8;
    } else if (lastEdgeHoursAgo < 48) {
      effectiveTensionIndex += 0.9;
    }

    // Archetyp-Bestimmung anhand der berechneten Tage
    let matchedArchetype = SOMATIC_ARCHETYPES[0];
    for (let i = 0; i < SOMATIC_ARCHETYPES.length; i++) {
      const arch = SOMATIC_ARCHETYPES[i];
      if (rawDays >= arch.dayRange[0] && rawDays <= arch.dayRange[1]) {
        matchedArchetype = arch;
        break;
      }
    }

    // Pelvine Sensitivitäts-Skala (1 bis 10)
    let pelvicSensitivityScore = 3;
    if (rawDays >= 1 && rawDays <= 3) pelvicSensitivityScore = 4;
    else if (rawDays >= 4 && rawDays <= 7) pelvicSensitivityScore = 8;
    else if (rawDays >= 8 && rawDays <= 14) pelvicSensitivityScore = 9;
    else if (rawDays >= 15 && rawDays <= 21) pelvicSensitivityScore = 10;
    else pelvicSensitivityScore = 8; // Einpendeln in Langzeit-Gelassenheit

    if (lastEdgeHoursAgo < 12) pelvicSensitivityScore = Math.min(10, pelvicSensitivityScore + 1);

    return {
      rawDays: rawDays,
      effectiveTensionIndex: parseFloat(effectiveTensionIndex.toFixed(1)),
      archetype: matchedArchetype,
      pelvicSensitivityScore: pelvicSensitivityScore,
      requiresMacerationCheck: rawDays >= 3,
      isHighTensionPeak: rawDays >= 4 && rawDays <= 7,
      hadRecentRuinedOrgasm: hadRecentRuinedOrgasm,
      lastEdgeHoursAgo: lastEdgeHoursAgo
    };
  }

  /**
   * Generiert situative Führungs- und Teasing-Direktiven für den Top.
   * STRIKTE TOP-FIRST DOKTRIN: Ist der Top 'exhausted', wird jede erotische
   * Anforderung zwingend in stillen Entlastungsdienst durch den Sub umgewandelt!
   */
  function synthesizeTeasingDirectives(context = {}) {
    const topLoad = context.topMentalLoad || 'balanced';
    const workplaceKey = context.workplaceId || 'desk_office';
    const daysLocked = context.daysLocked || 1;
    const tension = calculateDynamicTension({ daysLocked });
    const profile = WORKPLACE_PROFILES[workplaceKey] || WORKPLACE_PROFILES.desk_office;

    // 1. TOP IST ERSCHÖPFT: STRIKTE ALLTAGS-ENTLASTUNG (ANTI-TOP-FATIGUE)
    if (topLoad === 'exhausted') {
      return {
        strategy: "relief_and_rest",
        title: "Stiller Entlastungsdienst (Top-Fatigue Schutz)",
        tone: "sovereign_quiet",
        guidance: "Kein erotisches Chat-Teasing heute. Führen ist ein Privileg der Freude, kein zweiter Verwaltungsjob. Der Sub hat den Feierabend vorzubereiten und den Raum ruhig zu halten.",
        directives: [
          {
            timing: "Morgen",
            action: "Stummer 30-Sekunden Kniestand vor dem Verlassen der Wohnung. Blick auf die Dielen gerichtet. Kein Redebedarf."
          },
          {
            timing: "Tagsüber",
            action: `Konzentration auf den Beruf (${profile.label}). Vor Feierabend 10 Minuten Stille einlegen und Einkäufe erledigen.`
          },
          {
            timing: "Feierabend",
            action: "Küche makellos bereinigen, Schuhe an der Wohnungstür abnehmen, warmes Wasser oder Tee servieren und 20 Minuten schweigende Fußmassage anbieten."
          }
        ]
      };
    }

    // 2. TOP IST STRENG: INSPEKTION & DISZIPLIN
    if (topLoad === 'strict') {
      return {
        strategy: "strict_discipline",
        title: `Strikte Führung & Disziplin (${tension.archetype.name.split(':')[0]})`,
        tone: "sovereign_cool",
        guidance: "Fordernde Ausrichtung. Jedes Zögern oder Schmollen wird mit Aufgaben geahndet. Die Ejakulationsschranke bleibt kompromisslos verriegelt.",
        directives: [
          {
            timing: "Morgen",
            action: "Appell im aufrechten Kniestand. Vorzeigen des tadellosen Sitzes des Verschlusses. Trockener, ruhiger Blickkontakt."
          },
          {
            timing: "Tagsüber",
            action: `Striktes Durchführen der Berufsübung: ${profile.allotmentDirectives.workday}`
          },
          {
            timing: "Feierabend",
            action: "Urologische Spülung vorzeigen. Danach 10 Schläge mit der flachen Hand auf das Gesäß zur Besinnung über den Gehorsam des Tages."
          }
        ]
      };
    }

    // 3. TOP IST AUSGEGLICHEN: HARMONISCHE D/S-BALANCE
    return {
      strategy: "balanced_guidance",
      title: `Souveräne Begleitung (${tension.archetype.name.split(':')[0]})`,
      tone: "sovereign_warm",
      guidance: "Ausgewogener Rhythmus zwischen klarer Führung, Alltagsentlastung und spürbarer Verbundenheit im Halbdunkel.",
      directives: [
        {
          timing: "Morgen",
          action: profile.allotmentDirectives.morning
        },
        {
          timing: "Tagsüber",
          action: profile.allotmentDirectives.workday
        },
        {
          timing: "Feierabend",
          action: profile.allotmentDirectives.evening
        }
      ]
    };
  }

  const api = {
    calculateDynamicTension: calculateDynamicTension,
    synthesizeTeasingDirectives: synthesizeTeasingDirectives,
    getWorkplaceProfile: (key) => WORKPLACE_PROFILES[key] || WORKPLACE_PROFILES.desk_office,
    getAllWorkplaceProfiles: () => Object.values(WORKPLACE_PROFILES),
    getHardwareProfile: (id) => HARDWARE_PROFILES[id] || HARDWARE_PROFILES.penis_cherrykeeper,
    getAllHardwareProfiles: () => Object.values(HARDWARE_PROFILES),
    getArchetypes: () => SOMATIC_ARCHETYPES.slice(),
    getArchetypeByDay: (day) => {
      const d = parseInt(day, 10) || 1;
      return SOMATIC_ARCHETYPES.find(a => d >= a.dayRange[0] && d <= a.dayRange[1]) || SOMATIC_ARCHETYPES[0];
    }
  };

  window.ChastityDatabase = api;

})(window);
