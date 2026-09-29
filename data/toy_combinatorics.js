/**
 * data/toy_combinatorics.js
 * PACTUM Topologische Verträglichkeitsprüfung & Anatomie-Validierung (Release 3.0 Core)
 * 
 * Standards & Garantien:
 * - Deterministische Ausschluss-Logik gegen anatomische und physikalische Widersprüche
 * - Strikte anatomische Zuordnung (penis_only, vulva_only, universal)
 * - Inkompatibilitäts-Prüfung für Schlafzimmer-Staging und Drehbuch-Generierung
 * - 100 % frei von trivialen Emojis in Logik- und Datenfeldern
 * - Sprache: Authentische Szene-Terminologie ohne Schwulst und Kitsch
 */

(function(window) {
  'use strict';

  const ANATOMICAL_MAPPING = {
    penis_only: [
      "toy_chastity_cobra",
      "toy_chastity_viper",
      "toy_chastity_cherrykeeper",
      "toy_chastity_holytrainer",
      "toy_chastity_jailbird",
      "toy_chastity_nun_cage",
      "toy_ball_stretcher_silicone",
      "toy_prostate_massager",
      "toy_irrigation_syringe"
    ],
    vulva_only: [
      "toy_chastity_belt_female"
    ],
    universal: [
      "toy_jute_rope_6mm",
      "toy_cotton_rope",
      "toy_leather_cuffs_wrists",
      "toy_leather_cuffs_ankles",
      "toy_spreader_bar",
      "toy_emt_shears",
      "toy_leather_flogger_heavy",
      "toy_leather_paddle_wide",
      "toy_leather_belt",
      "toy_riding_crop",
      "toy_wooden_paddle",
      "toy_blindfold_silk",
      "toy_sensory_wheel",
      "toy_bdsm_wax_candle",
      "toy_feather_tickler",
      "toy_ball_gag_silicone",
      "toy_chastity_seals_numbered",
      "toy_nipple_clamps_alligator",
      "toy_wand_vibrator",
      "toy_anal_plug_jeweled",
      "toy_strap_on_harness",
      "toy_weighted_blanket",
      "toy_massage_oil_neutral",
      "toy_clothing_leather_collar",
      "toy_clothing_heels",
      "toy_clothing_corset",
      "toy_clothing_lingerie_sissy"
    ]
  };

  const INCOMPATIBILITY_RULES = [
    {
      id: "rule_self_inflicted_wrist_bondage",
      name: "Selbstvollzug bei fixierten Händen",
      condition: function(context) {
        const isSelfSpank = context.actionType === "self_inflicted" || context.execution === "self";
        const hasWristBondage = context.bondage === "wrists_behind_back" ||
                                context.bondage === "wrists_to_bedpost" ||
                                context.bondage === "elbow_straps";
        return isSelfSpank && hasWristBondage;
      },
      severity: "block",
      conflictMessage: "Physikalischer Widerspruch: Selbstzüchtigung erfordert freie Hände und schließt fixierte Handgelenke aus.",
      suggestedResolution: "Entfesselung der Hände oder Übernahme der Zucht durch den Top."
    },
    {
      id: "rule_locked_penile_stroking",
      name: "Direkte Schaftstimulation bei verriegeltem Käfig",
      condition: function(context) {
        const isLocked = context.isLocked === true || context.cageActive === true;
        const targetZone = context.targetZone || "";
        const isPenileShaftAction = targetZone === "penis_shaft" || context.action === "manual_stroking" || context.action === "penis_stroker";
        return isLocked && isPenileShaftAction;
      },
      severity: "block",
      conflictMessage: "Hardware-Konflikt: Direkte Schaftstimulation ist bei verriegeltem Käfig physisch unmöglich.",
      suggestedResolution: "Nutzung von Vibration auf das Käfiggitter, Prostata-Stimulation oder temporäres Tease-and-Relock-Ritual."
    },
    {
      id: "rule_gag_vocal_counting",
      name: "Lautes Mitzählen oder Sprechen bei Knebelung",
      condition: function(context) {
        const isGagged = context.gagActive === true || context.sensory === "gag" || context.sensoryToy === "toy_ball_gag_silicone";
        const requiresSpeech = context.vocalRule === "count_aloud" || context.vocalRule === "verbal_begging" || context.vocalRule === "thank_aloud";
        return isGagged && requiresSpeech;
      },
      severity: "block",
      conflictMessage: "Akustischer Widerspruch: Knebelung verhindert deutliche Artikulation und lautes Mitzählen.",
      suggestedResolution: "Nonverbale Klopfsignale, Handzeichen oder Zählen mit den Fingern vereinbaren."
    },
    {
      id: "rule_suspension_shears_requirement",
      name: "Fesselung ohne griffbereite Notfallschere",
      condition: function(context) {
        const isExtensiveBondage = context.bondageLevel === "suspension" || context.bondageLevel === "tight_fixation";
        const hasShears = context.availableToys && context.availableToys.includes("toy_emt_shears");
        return isExtensiveBondage && !hasShears;
      },
      severity: "warning",
      conflictMessage: "RACK-Sicherheitshinweis: Bei intensiven Fesselungen muss eine Notfallschere in Griffweite liegen.",
      suggestedResolution: "Bereitstellen einer abgerundeten EMT-Schere vor Beginn der Session."
    },
    {
      id: "rule_spreader_bar_standing",
      name: "Spreizstange im aufrechten Stand ohne Fixierung",
      condition: function(context) {
        const hasSpreader = context.bondage === "spreader_bar" || context.equipment === "toy_spreader_bar";
        const isStanding = context.posture === "standing_free";
        return hasSpreader && isStanding;
      },
      severity: "warning",
      conflictMessage: "Stabilitäts-Risiko: Eine starre Knöchel-Spreizstange im freien Stand birgt Sturzgefahr.",
      suggestedResolution: "Liegende Position, 90-Grad-Vorbeuge über die Bettkante oder Festhalten an stabilen Möbeln."
    }
  ];

  const ToyCombinatorics = {
    anatomicalMapping: ANATOMICAL_MAPPING,
    incompatibilityRules: INCOMPATIBILITY_RULES,

    /**
     * Prüft, ob ein Spielzeug oder Ausrüstungsgegenstand mit der Anatomie des Empfangenden vereinbar ist.
     * @param {string} toyId 
     * @param {string} recipientAnatomy 'penis' | 'vulva'
     * @returns {boolean}
     */
    isAnatomicallyCompatible: function(toyId, recipientAnatomy) {
      if (!toyId) return false;
      const anatomy = recipientAnatomy === "vulva" ? "vulva" : "penis";

      if (ANATOMICAL_MAPPING.universal.includes(toyId)) {
        return true;
      }

      if (anatomy === "penis") {
        return ANATOMICAL_MAPPING.penis_only.includes(toyId);
      }

      if (anatomy === "vulva") {
        return ANATOMICAL_MAPPING.vulva_only.includes(toyId);
      }

      return false;
    },

    /**
     * Filtert eine Liste vorhandener Spielzeuge anhand der Anatomie und des aktuellen Verschlussstatus.
     * @param {Array<string>} toyIds 
     * @param {string} recipientAnatomy 'penis' | 'vulva'
     * @param {boolean} isLocked 
     * @returns {Array<string>}
     */
    filterUsableEquipment: function(toyIds, recipientAnatomy, isLocked) {
      if (!Array.isArray(toyIds)) return [];
      const self = this;

      return toyIds.filter(function(id) {
        if (!self.isAnatomicallyCompatible(id, recipientAnatomy)) {
          return false;
        }

        // Bei aktivem Verschluss können reine Dehnungs-/Kompressionstoys für den Schaft nicht eingesetzt werden
        if (isLocked && id === "toy_ball_stretcher_silicone") {
          return false;
        }

        return true;
      });
    },

    /**
     * Validiert einen Session- oder Drehbuch-Kontext gegen alle hinterlegten Ausschlussregeln.
     * @param {Object} context 
     * @returns {Object} { isValid: boolean, blocks: Array, warnings: Array }
     */
    validateContext: function(context) {
      const ctx = context || {};
      const blocks = [];
      const warnings = [];

      for (let i = 0; i < INCOMPATIBILITY_RULES.length; i++) {
        const rule = INCOMPATIBILITY_RULES[i];
        try {
          if (rule.condition(ctx)) {
            if (rule.severity === "block") {
              blocks.push({
                ruleId: rule.id,
                name: rule.name,
                message: rule.conflictMessage,
                resolution: rule.suggestedResolution
              });
            } else {
              warnings.push({
                ruleId: rule.id,
                name: rule.name,
                message: rule.conflictMessage,
                resolution: rule.suggestedResolution
              });
            }
          }
        } catch (err) {
          console.warn("[ToyCombinatorics] Fehler bei Regelauswertung:", rule.id, err);
        }
      }

      return {
        isValid: blocks.length === 0,
        blocks: blocks,
        warnings: warnings
      };
    },

    /**
     * Schlägt sichere Alternativen für gesperrte Kombinationen vor.
     * @param {string} conflictType 
     * @returns {Array<string>}
     */
    getSafeAlternatives: function(conflictType) {
      if (conflictType === "self_spank_blocked") {
        return [
          "Handschläge direkt durch den Top",
          "Kniestand-Haltung mit Mitzählen ohne Handfesselung",
          "Zucht mit Lederpaddle bei arretierter Vorbeuge"
        ];
      }
      if (conflictType === "locked_stroking_blocked") {
        return [
          "Vibration von außen auf den Zylinder",
          "Prostata-Stimulation ohne Genitalberührung",
          "Kältereiz mit Eiswürfel über Damm und Beckenknochen"
        ];
      }
      if (conflictType === "gag_speech_blocked") {
        return [
          "Nonverbales Mitzählen durch Klopfen auf den Oberschenkel",
          "Blickkontakt im Halbdunkel ohne Lautäußerung",
          "Fallenlassen eines Gegenstandes als Signal"
        ];
      }
      return [];
    }
  };

  window.ToyCombinatorics = ToyCombinatorics;

})(window);
