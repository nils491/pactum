/**
 * data/chastity_database.js
 * TACTUS Somatische Spannungs-, Ergonomie- & Alltags-Engine (V3.0 Hyper-Dynamisch)
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien:
 * - Dynamischer Spannungs-Vektor (Tension Index) mit biologischer Hysterese statt starrer Kalendertage
 * - Parametrisierte Alltags-Stressoren (Ergonomie, Reibung, Schweiß, Diskretion, Hygiene-Intervalle)
 * - Kombinatorischer Teasing-Synthesizer: Modaliät x Intensitäts-Stufe x Top-Mental-Load
 * - Material-physikalische Profile (PA12 SLS, Bioresin, Edelstahl 316L, Polycarbonat)
 * - 100 % frei von trivialen Emojis in Datenstrukturen
 * - Authentische Szene-Terminologie ohne Schwulst und Kitsch
 */

(function(window) {
  'use strict';

  const TENSION_ARCHETYPES = {
    adaptation: {
      id: "adaptation",
      name: "Phase 1: Gewöhnung & Antizipation",
      baseDaysRange: [1, 3],
      hormonalVector: {
        dopamineBase: "high_novelty",
        freeTestosteroneDelta: 0.1,
        pelvicFloorTonus: "variable_reactive"
      },
      somaticRisks: ["skin_pressure_ring", "initial_nocturnal_edema"],
      directiveObjective: "Gewebeschutz, Etablierung des urologischen Spülrituals und Festigung der Führungs-Hierarchie.",
      topFocus: "Wachsame Prüfung auf Druckstellen, kurze visuelle Kontrollen, Bestätigung der Führung."
    },
    climbing: {
      id: "climbing",
      name: "Phase 2: Erregungsanstieg & Nervosität (Kritische Schwelle)",
      baseDaysRange: [4, 7],
      hormonalVector: {
        dopamineBase: "fluctuating_craving",
        freeTestosteroneDelta: 1.0, // Peak um Tag 7
        pelvicFloorTonus: "hyper_sensitive"
      },
      somaticRisks: ["frustration_restlessness", "involuntary_tumescence_pain"],
      directiveObjective: "Kanalisierung von Unruhe in Alltagsdienst zur Entlastung des Tops; Vermeidung von Verwahrlosung durch Reizimpulse.",
      topFocus: "Auffangen von Frust durch gezielte Berührungsanker oder Cunnilingus-Bedienung ohne Freigabe des Bottoms."
    },
    deep_subspace: {
      id: "deep_subspace",
      name: "Phase 3: Tiefe Unterordnung & Fokus",
      baseDaysRange: [8, 21],
      hormonalVector: {
        dopamineBase: "stable_attunement",
        freeTestosteroneDelta: 0.4, // Rezeptor-Downregulation / Stabilisierung
        pelvicFloorTonus: "calm_conditioned"
      },
      somaticRisks: ["subtle_subdrop_vulnerability", "habituation_neglect"],
      directiveObjective: "Verankerung stabiler Dienstrituale, Vertiefung emotionaler Resonanz und Auskosten ungeteilter Hingabe.",
      topFocus: "Erhöhung der Orgasmus-Ratio zugunsten des Tops, Verknüpfung von Verschluss mit sensorischem Entzug oder Zucht."
    },
    permanent_zenith: {
      id: "permanent_zenith",
      name: "Phase 4: Kontinuierliche Hingabe (Langzeit-Zenit)",
      baseDaysRange: [22, 9999],
      hormonalVector: {
        dopamineBase: "enduring_devotion",
        freeTestosteroneDelta: 0.2,
        pelvicFloorTonus: "decoupled_orgasm_independent"
      },
      somaticRisks: ["chronic_maceration_risk", "hardware_fatigue"],
      directiveObjective: "Vollständige Entkopplung der Bindung vom Samenerguss; das Schloss wird als integrales Körperelement erlebt.",
      topFocus: "Gewissenhafter Hautschutz, Freigaben primär über Prostata oder Ruined Orgasm, partnerschaftliche Reflexion auf Augenhöhe."
    }
  };

  const WORKPLACE_STRESS_FACTORS = {
    desk_office: {
      id: "desk_office",
      label: "Büro, Bildschirmarbeit & Homeoffice",
      ergonomics: {
        primaryPosture: "sedentary",
        pelvicCompressionRisk: "high", // Dauerdruck Stuhlrand auf Skrotum/Schambein
        frictionRisk: "low",
        thermalHeatBuildup: "medium_high"
      },
      discretionLevel: "high_professional",
      hygieneWindowHours: 4,
      teasingAffordanceVectors: ["pelvic_kegel_command", "discrete_photo_check", "key_presence_reminder"]
    },
    craft_physical: {
      id: "craft_physical",
      label: "Handwerk, Montage & Baustelle",
      ergonomics: {
        primaryPosture: "locomotion_heavy",
        pelvicCompressionRisk: "medium",
        frictionRisk: "very_high", // Raue Arbeitskleidung, Schweiß, Bücken
        thermalHeatBuildup: "very_high"
      },
      discretionLevel: "medium",
      hygieneWindowHours: 6,
      teasingAffordanceVectors: ["morning_lock_inspection", "post_shift_irrigation_mandate", "fatigue_grounding"]
    },
    medical_service: {
      id: "medical_service",
      label: "Pflege, Medizin, Labor & Gastronomie",
      ergonomics: {
        primaryPosture: "standing_walking",
        pelvicCompressionRisk: "low",
        frictionRisk: "high", // 8–12h Innenschenkel-Reibung
        thermalHeatBuildup: "medium"
      },
      discretionLevel: "maximum_clinical",
      hygieneWindowHours: 5,
      teasingAffordanceVectors: ["pre_shift_kneeling_focus", "relief_permission_protocol", "foot_service_for_top"]
    },
    driver_field: {
      id: "driver_field",
      label: "Fahrer, Außendienst, Bahn & Pendler",
      ergonomics: {
        primaryPosture: "vibrational_sedentary",
        pelvicCompressionRisk: "high", // Sicherheitsgurt-Druck, Erschütterungen
        frictionRisk: "low",
        thermalHeatBuildup: "high"
      },
      discretionLevel: "variable_customer_facing",
      hygieneWindowHours: 4,
      teasingAffordanceVectors: ["traffic_light_awareness_ping", "departure_arrival_protocol", "voice_anchor"]
    },
    shift_variable: {
      id: "shift_variable",
      label: "Schichtdienst & Wechselnder Biorhythmus",
      ergonomics: {
        primaryPosture: "circadian_disrupted",
        pelvicCompressionRisk: "medium",
        frictionRisk: "medium",
        thermalHeatBuildup: "medium"
      },
      discretionLevel: "medium",
      hygieneWindowHours: 4,
      teasingAffordanceVectors: ["circadian_independent_irrigation", "corridor_greeting_ritual", "bedside_anchor_note"]
    }
  };

  const TEASING_MODALITIES = {
    acoustic: {
      id: "acoustic",
      label: "Akustische Konditionierung",
      sensoryChannel: "auditory",
      levels: {
        1: { title: "Kurzes Schlüsselklimpern", action: "3-sekündiges helles Metallklirren als Audio-Notiz oder im Flur.", energyCost: 1 },
        3: { title: "Geflüsterter Schloss-Befehl", action: "Ruhige Sprachnachricht mit Erinnerung, wer den Schlüssel verwahrt.", energyCost: 2 },
        5: { title: "Akustischer Schwellen-Countdown", action: "Live-Audiospur mit getaktetem Atem- und Berührungsverbot.", energyCost: 3 }
      }
    },
    visual: {
      id: "visual",
      label: "Visuelle Präsenz & Distanz",
      sensoryChannel: "visual",
      levels: {
        1: { title: "Schlüssel-Präsenz am Körper des Tops", action: "Top trägt den Schlüssel an Kette oder Ring sichtbar im Raum.", energyCost: 1 },
        3: { title: "Reizwäsche mit Berührungsverbot", action: "Top trägt feine Garderobe, untersagt aber jede Annäherung.", energyCost: 2 },
        5: { title: "Spiegel-Inspektion im Halbdunkel", action: "Bottom muss das verriegelte Gitter im Spiegel betrachten.", energyCost: 3 }
      }
    },
    tactile_mechanical: {
      id: "tactile_mechanical",
      label: "Taktile Schwingung & Kanten-Quälerei",
      sensoryChannel: "somatosensory_vibrational",
      levels: {
        2: { title: "Vibration auf das Käfiggitter", action: "Aufsetzen eines Vibrators auf den Zylinder für 60s ohne Entlastung.", energyCost: 2 },
        4: { title: "Tease & Relock (Kalter Stopp)", action: "Kurzes Abnehmen, Führen an die Schwelle, sofortiger Verschluss.", energyCost: 4 },
        5: { title: "Prostata-Schwellenreizung im Verschluss", action: "Tiefe P-Spot Stimulation bei vollständig versiegeltem Genital.", energyCost: 4 }
      }
    },
    mental_service: {
      id: "mental_service",
      label: "Dienstauftrag zur Top-Entlastung",
      sensoryChannel: "cognitive_submissive",
      levels: {
        1: { title: "Spontane Erfrischung reichen", action: "Befehl, dem Top unaufgefordert ein Glas Wasser oder Tee zu bringen.", energyCost: 1 },
        3: { title: "Haushalts-Entlastung bei Triebdruck", action: "Umwandlung von sexueller Unruhe in 30 Min. gründliche Küchenreinigung.", energyCost: 1 },
        5: { title: "Stiller Fuß- & Massagedienst", action: "25 Min. intensive Entlastungsmassage für den Top ohne Gegenleistung.", energyCost: 2 }
      }
    },
    somatosensory_temperature: {
      id: "somatosensory_temperature",
      label: "Temperatur- & Kontraktionsreize",
      sensoryChannel: "thermal_nociceptive",
      levels: {
        2: { title: "Kältestreichung am Damm", action: "Gezielter Eiswürfel über Skrotum und Dammnaht bei verriegeltem Gitter.", energyCost: 2 },
        4: { title: "Wechselwarme Kompresse", action: "Heiß-Kalt-Reizung des Beckenbodens zur vegetativen Tonisierung.", energyCost: 3 }
      }
    }
  };

  const HARDWARE_PROFILES = {
    penis_cobra: {
      id: "penis_cobra",
      name: "Kink3D Cobra (SLS-Nylon)",
      material: "Polyamid 12 (PA12 Laser-Sinterung)",
      thermalConductivity: "low",
      weightGrams: 28,
      ventilationCoefficient: 0.95, // Offenes Wabenmuster
      macerationRiskIndex: "minimal",
      ringErgonomics: "dual_arc_contour",
      suitability: "24/7 Langzeittragen, Sport, intensive Bewegung",
      hygieneRequirements: "Tägliche Spülung mit Wasser oder Kochsalz; alkoholfreie Desinfektion."
    },
    penis_viper: {
      id: "penis_viper",
      name: "Kink3D Viper (Kompakt)",
      material: "Polyamid 12 (PA12)",
      thermalConductivity: "low",
      weightGrams: 24,
      ventilationCoefficient: 0.88,
      macerationRiskIndex: "minimal",
      ringErgonomics: "compact_sport",
      suitability: "Sportliche Träger, kompakte Anatomie, minimaler Überstand",
      hygieneRequirements: "Regelmäßige Kontrolle der Dammansatz-Nähte."
    },
    penis_cherrykeeper: {
      id: "penis_cherrykeeper",
      name: "Cherrykeeper Micro Stub (<= 35mm)",
      material: "3D-Resin / SLS-Nylon",
      thermalConductivity: "low",
      weightGrams: 22,
      ventilationCoefficient: 0.78,
      macerationRiskIndex: "medium", // Enges Spaltmaß verlangt strikte Spülung
      ringErgonomics: "modular_custom_fit",
      suitability: "Maximale Schaftkompression, Grower-Anatomie, absolute Erektionsvermeidung",
      hygieneRequirements: "Zwingende tägliche urologische Spülung mit stumpfer Spritze."
    },
    penis_holytrainer: {
      id: "penis_holytrainer",
      name: "HolyTrainer V6 (Bioresin)",
      material: "Medizinisches Bioresin",
      thermalConductivity: "body_adaptive", // Wird bei 36°C seidig warm
      weightGrams: 35,
      ventilationCoefficient: 0.82,
      macerationRiskIndex: "low",
      ringErgonomics: "anatomical_stealth",
      suitability: "Hautschonendes Tragegefühl, elegante Ästhetik",
      hygieneRequirements: "Handwarm reinigen; kein kochendes Wasser verwenden."
    },
    penis_jailbird: {
      id: "penis_jailbird",
      name: "Mature Metal Jailbird (Edelstahl 316L)",
      material: "Chirurgischer Edelstahl 316L",
      thermalConductivity: "high", // Passt sich Raumtemperatur an, kühl/spürbar
      weightGrams: 195,
      ventilationCoefficient: 0.98, // Maximale Belüftung durch Gitterstäbe
      macerationRiskIndex: "minimal",
      ringErgonomics: "rigid_high_pressure",
      suitability: "Liebhaber von spürbarem Gewicht, maximale Formstabilität",
      hygieneRequirements: "Vollständig desinfektionsmittelbeständig und sterilisierbar."
    },
    penis_flat: {
      id: "penis_flat",
      name: "Flat Shield (Nun-Cage)",
      material: "Polycarbonat oder PA12",
      thermalConductivity: "medium",
      weightGrams: 30,
      ventilationCoefficient: 0.60,
      macerationRiskIndex: "high",
      ringErgonomics: "extreme_flattening",
      suitability: "0 mm Silhouette unter Anzughosen, zeitlich begrenzte Disziplin",
      hygieneRequirements: "Druckstellen am Damm täglich prüfen; Tragezeit zeitlich begrenzen."
    },
    female_belt: {
      id: "female_belt",
      name: "Weiblicher Keuschheitsgürtel (Shield)",
      material: "Edelstahl mit Silikon-Kantenschutz",
      thermalConductivity: "variable",
      weightGrams: 380,
      ventilationCoefficient: 0.80,
      macerationRiskIndex: "medium",
      ringErgonomics: "pelvic_waist_locking",
      suitability: "Verhinderung klitoraler Selbststimulation, rituelle Führung",
      hygieneRequirements: "Silikoneinfassungen täglich säubern und vollständig trocknen."
    }
  };

  const DynamicChastityEngine = {
    tensionArchetypes: TENSION_ARCHETYPES,
    workplaceStressors: WORKPLACE_STRESS_FACTORS,
    teasingModalities: TEASING_MODALITIES,
    hardwareProfiles: HARDWARE_PROFILES,

    /**
     * Berechnet den dynamischen Spannungs-Vektor unter Berücksichtigung von Hysterese-Events.
     * @param {Object} params
     * @param {number} params.daysLocked - Roh-Tage im Verschluss
     * @param {number} [params.lastEdgeHoursAgo] - Stunden seit letzter Schwellenreizung
     * @param {boolean} [params.hadRecentRuinedOrgasm] - Letzter Höhepunkt war 'ruined' (setzt Dopamin teils zurück)
     * @param {number} [params.topLustRatio] - Aktuelles Verhältnis N_Top : N_Sub
     * @returns {Object} Dynamischer Spannungszustand
     */
    calculateDynamicTension: function({ daysLocked = 1, lastEdgeHoursAgo = 999, hadRecentRuinedOrgasm = false, topLustRatio = 1 }) {
      const rawDays = Math.max(1, parseInt(daysLocked, 10) || 1);
      
      // Biologische Hysterese-Modulation:
      // Ein Ruined Orgasm dämpft akuten Testosterondruck, erhält aber mentale Unterordnung
      let effectiveTensionIndex = rawDays;
      if (hadRecentRuinedOrgasm) {
        effectiveTensionIndex = Math.max(2, rawDays * 0.7);
      }
      if (lastEdgeHoursAgo < 24) {
        // Frische Schwellenreizung erhöht die Nervensensibilität um 30 %
        effectiveTensionIndex += 1.5;
      }

      let activeArchetype = TENSION_ARCHETYPES.adaptation;
      if (effectiveTensionIndex >= 22) {
        activeArchetype = TENSION_ARCHETYPES.permanent_zenith;
      } else if (effectiveTensionIndex >= 8) {
        activeArchetype = TENSION_ARCHETYPES.deep_subspace;
      } else if (effectiveTensionIndex >= 4) {
        activeArchetype = TENSION_ARCHETYPES.climbing;
      }

      return {
        effectiveTensionIndex: parseFloat(effectiveTensionIndex.toFixed(1)),
        archetype: activeArchetype,
        rawDaysLocked: rawDays,
        isClimbingPeak: effectiveTensionIndex >= 4 && effectiveTensionIndex <= 8,
        pelvicSensitivityScore: Math.min(10, Math.round(effectiveTensionIndex * 0.45 + (lastEdgeHoursAgo < 36 ? 3 : 1)))
      };
    },

    /**
     * Erzeugt dynamische Teasing-Aktionen passend zu Top-Energie, Arbeitsplatz und Spannungsphase.
     * @param {Object} context
     * @param {string} context.workplaceId - ID des Arbeitsplatzes
     * @param {string} [context.topMentalLoad] - 'exhausted' | 'balanced' | 'dominant_strict'
     * @param {number} [context.effectiveTensionIndex] - Berechneter Tension-Wert
     * @returns {Array<Object>} Situativ kuratierte Teasing-Impulse
     */
    synthesizeTeasingDirectives: function({ workplaceId = 'desk_office', topMentalLoad = 'balanced', effectiveTensionIndex = 4 }) {
      const stressProfile = WORKPLACE_STRESS_FACTORS[workplaceId] || WORKPLACE_STRESS_FACTORS.desk_office;
      const suggestions = [];

      // 1. Top-Fatigue Guard: Wenn der Top erschöpft ist, wandelt das System Teasing in DIENST um
      if (topMentalLoad === 'exhausted') {
        suggestions.push({
          modality: 'mental_service',
          intensityLevel: 3,
          title: "Stiller Entlastungsdienst statt sexueller Forderung",
          action: "Bottom übernimmt sofort Küche und Hausschuhe; anschließende 20 Min. abgedunkelte Fußmassage für den Top ohne Gespräch.",
          rationale: "Schützt den Top vor Mental Load und kanalisiert die Unruhe des Bottoms in produktive Fürsorge."
        });
        suggestions.push({
          modality: 'acoustic',
          intensityLevel: 1,
          title: "Diskretes Schlüsselklimpern als Ruhe-Signal",
          action: "Kurzes Klirren des Vorhängeschlosses vor Beginn der Massage als Bestätigung der Führung.",
          rationale: "Reaktiviert den vegetativen Anker ohne Handlungsaufwand für den Top."
        });
        return suggestions;
      }

      // 2. Arbeitsplatz-spezifischer Alltags-Teaser
      if (stressProfile.id === 'desk_office') {
        suggestions.push({
          modality: 'tactile_mechanical',
          intensityLevel: 2,
          title: "Beckenboden-Kompression im Sitzen",
          action: "Befehl zur diskreten Durchführung von 25 Kegel-Kontraktionen während der Arbeitszeit gegen das feste Gitter.",
          rationale: "Aktiviert die Schwellkörper-Wahrnehmung bei Dauerdruck des Schreibtischstuhls."
        });
      } else if (stressProfile.id === 'craft_physical') {
        suggestions.push({
          modality: 'mental_service',
          intensityLevel: 2,
          title: "Pflicht zur urologischen Feierabend-Spülung",
          action: "Direkt nach Rückkehr: Gründliche Kochsalzspülung der Eichelkammer und schriftliche Bestätigung reizfreier Haut an den Top.",
          rationale: "Schützt vor Balanitis nach körperlicher Arbeit und Schweißbildung."
        });
      } else if (stressProfile.id === 'driver_field') {
        suggestions.push({
          modality: 'acoustic',
          intensityLevel: 2,
          title: "Ampel-Fokus-Signal",
          action: "Kurze Sprachnachricht des Tops vor Fahrtantritt: Bewusstes Spüren der Berührung an roten Signalen.",
          rationale: "Verbindet Reisezeit mit mentaler Präsenz der Schlüsselgewalt."
        });
      }

      // 3. Phasen-spezifische Intensivierung
      if (effectiveTensionIndex >= 8) {
        suggestions.push({
          modality: 'tactile_mechanical',
          intensityLevel: 4,
          title: "Tease & Relock (Schwellen-Quälerei)",
          action: "Käfig abnehmen, Heranführen an das Erregungsplateau, kalter Abbruch vor der Ejakulation und sofortiges Wiederverriegeln.",
          rationale: "Brennt das Bewusstsein der Führung tief in das Nervensystem ein (Tiefe Unterordnung)."
        });
      } else {
        suggestions.push({
          modality: 'visual',
          intensityLevel: 2,
          title: "Körperliche Präsenz mit Berührungsverbot",
          action: "Top exponiert die eigene Garderobe im Raum, untersagt dem Bottom jedoch jede Annäherung.",
          rationale: "Erhöht den visuellen Triebdruck bei gleichzeitig unerbittlicher Handlungsbegrenzung."
        });
      }

      return suggestions;
    },

    /**
     * Abwärtskompatible Hilfsmethode zur Ermittlung der Basisphase anhand von Tagen.
     */
    getPhaseByDays: function(days) {
      return this.calculateDynamicTension({ daysLocked: days }).archetype;
    },

    /**
     * Liefert Teasing-Methoden nach Kategorie oder komplett.
     */
    getTeasingMethods: function(category) {
      if (!category || category === 'all') {
        return Object.values(TEASING_MODALITIES);
      }
      return TEASING_MODALITIES[category] ? [TEASING_MODALITIES[category]] : [];
    },

    /**
     * Liefert das Belastungsprofil eines Arbeitsplatzes.
     */
    getWorkplaceProfile: function(workplaceId) {
      return WORKPLACE_STRESS_FACTORS[workplaceId] || WORKPLACE_STRESS_FACTORS.desk_office;
    },

    /**
     * Liefert die Material- und Hygienespezifikation eines Käfigs.
     */
    getHardwareProfile: function(hardwareId) {
      return HARDWARE_PROFILES[hardwareId] || HARDWARE_PROFILES.penis_cherrykeeper;
    }
  };

  window.ChastityDatabase = DynamicChastityEngine;

})(window);
