/**
 * data/toy_combinatorics.js
 * TACTUS Somatische Topologie-, DoF- & Kombinatorik-Engine (V3.0 Hyper-Dynamisch)
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien:
 * - Mathematisches Freiheitsgrad-Kalkül (Degrees of Freedom / DoF in [0.0, 1.0])
 * - 3-Schichten Restraint-Stacking (Layer 0 Permanent, Layer 1 Positional, Layer 2 Rigid)
 * - Algebraische Schnittmengen-Validierung: Action Feasible <=> RequiredFaculties ∩ BlockedFaculties == Ø
 * - Dynamisches Zonen-Shifting & Affordanz-Matrix (z. B. Klemmen an Brust, Skrotum oder Labien)
 * - Automatische Konflikt-Auflösung & Substitutions-Vorschläge (z. B. Klopfsignale bei Knebelung)
 * - 100 % frei von trivialen Emojis in Logik- und Datenstrukturen
 * - Authentische Szene-Terminologie ohne Schwulst und Kitsch
 */

(function(window) {
  'use strict';

  // Standard-Körperzonen des menschlichen Körpers in der Somatik-Topologie
  const BODY_ZONES = {
    head_eyes: { id: "head_eyes", label: "Augen & Sichtfeld", sensoryFaculty: "vision" },
    head_ears: { id: "head_ears", label: "Ohren & Gehör", sensoryFaculty: "hearing" },
    head_mouth: { id: "head_mouth", label: "Mundraum & Kiefer", sensoryFaculty: "speech_articulation" },
    neck_cervical: { id: "neck_cervical", label: "Hals & Nacken", sensoryFaculty: "postural_head" },
    chest_nipples: { id: "chest_nipples", label: "Brust & Brustwarzen", sensoryFaculty: "erogenous_cutaneous" },
    back_flanks: { id: "back_flanks", label: "Rücken & Flanken", sensoryFaculty: "cutaneous_impact" },
    gluteal_pelvis: { id: "gluteal_pelvis", label: "Glutealzone & Gesäß", sensoryFaculty: "deep_muscular_impact" },
    perineum_pelvic_floor: { id: "perineum_pelvic_floor", label: "Damm & Beckenboden", sensoryFaculty: "visceral_erogenous" },
    genital_penis: { id: "genital_penis", label: "Penisschaft & Eichel", anatomy: "penis", sensoryFaculty: "primary_genital" },
    genital_scrotum: { id: "genital_scrotum", label: "Skrotum & Hodenansatz", anatomy: "penis", sensoryFaculty: "primary_genital_tension" },
    genital_vulva_clitoris: { id: "genital_vulva_clitoris", label: "Vulva & Klitoris", anatomy: "vulva", sensoryFaculty: "primary_genital" },
    genital_labia: { id: "genital_labia", label: "Schamlippen (Majora/Minora)", anatomy: "vulva", sensoryFaculty: "primary_genital_traction" },
    rectum_prostate: { id: "rectum_prostate", label: "Rektum & Prostata / Tiefe", sensoryFaculty: "prostate_pelvic_depth" },
    limbs_wrists_hands: { id: "limbs_wrists_hands", label: "Handgelenke & Finger", motorFaculty: "manual_manipulation" },
    limbs_ankles_feet: { id: "limbs_ankles_feet", label: "Knöchel & Fußsohlen", motorFaculty: "locomotion_standing" },
    thighs_inner: { id: "thighs_inner", label: "Oberschenkel-Innenseiten", sensoryFaculty: "high_density_nociception" }
  };

  const FACULTIES = {
    speech_articulation: { id: "speech_articulation", label: "Artikulierte Sprache & Rufen", baseCapacity: 1.0 },
    tongue_mobility_external: { id: "tongue_mobility_external", label: "Zungenführung außerhalb des Mundes", baseCapacity: 1.0 },
    nasal_breathing: { id: "nasal_breathing", label: "Nasale Atmung (Vital)", baseCapacity: 1.0, isVital: true },
    manual_manipulation: { id: "manual_manipulation", label: "Handeinsatz & Greifen", baseCapacity: 1.0 },
    locomotion_standing: { id: "locomotion_standing", label: "Freies Stehen & Fortbewegung", baseCapacity: 1.0 },
    visual_perception: { id: "visual_perception", label: "Optische Orientierung & Sicht", baseCapacity: 1.0 },
    pelvic_thrust_active: { id: "pelvic_thrust_active", label: "Aktive Beckenbewegung & Stoßen", baseCapacity: 1.0 },
    penile_shaft_access: { id: "penile_shaft_access", label: "Direkter physischer Schaftkontakt", baseCapacity: 1.0 }
  };

  const SomaticTopologyEngine = {
    bodyZones: BODY_ZONES,
    faculties: FACULTIES,

    /**
     * Berechnet die verbliebenen Freiheitsgrade (Degrees of Freedom) für alle motorischen und sensorischen Fähigkeiten.
     * Nutzt das multiplikative Dämpfungsmodell: DoF = Produkt(1 - Blockadegrad_i)
     * @param {Array<Object>} activeEquipmentList - Liste der aktuell angelegten Ausrüstungsgegenstände
     * @returns {Object} Berechnete DoF-Werte pro Fähigkeit [0.0 bis 1.0] und Restraint-Stack-Analyse
     */
    calculateDegreesOfFreedom: function(activeEquipmentList = []) {
      const dofState = {
        speech_articulation: 1.0,
        tongue_mobility_external: 1.0,
        nasal_breathing: 1.0,
        manual_manipulation: 1.0,
        locomotion_standing: 1.0,
        visual_perception: 1.0,
        pelvic_thrust_active: 1.0,
        penile_shaft_access: 1.0
      };

      const stackSummary = {
        layer0_anchors: [],
        layer1_positional: [],
        layer2_rigid: []
      };

      if (!Array.isArray(activeEquipmentList) || activeEquipmentList.length === 0) {
        return { dof: dofState, stack: stackSummary, isFullyUnrestricted: true };
      }

      for (let i = 0; i < activeEquipmentList.length; i++) {
        const item = activeEquipmentList[i];
        if (!item) continue;

        // Schicht-Zuordnung für Restraint-Stacking
        const layer = item.restraintLayer !== undefined ? item.restraintLayer : 1;
        if (layer === 0) stackSummary.layer0_anchors.push(item.name || item.id);
        else if (layer === 1) stackSummary.layer1_positional.push(item.name || item.id);
        else if (layer >= 2) stackSummary.layer2_rigid.push(item.name || item.id);

        const profile = item.somaticProfile || item.affordanceProfile || null;
        if (!profile) continue;

        // Blockierte Fähigkeiten dämpfen
        const blocked = profile.blocksFaculties || profile.blockedFaculties || {};
        for (const facultyKey in blocked) {
          if (blocked.hasOwnProperty(facultyKey) && dofState.hasOwnProperty(facultyKey)) {
            const isBlocked = blocked[facultyKey];
            if (isBlocked === true) {
              dofState[facultyKey] = 0.0;
            } else if (typeof isBlocked === 'number') {
              dofState[facultyKey] = Math.max(0.0, dofState[facultyKey] * (1.0 - Math.min(1.0, isBlocked)));
            }
          }
        }
      }

      // Runden auf 2 Dezimalstellen
      for (const k in dofState) {
        if (dofState.hasOwnProperty(k)) {
          dofState[k] = parseFloat(dofState[k].toFixed(2));
        }
      }

      return {
        dof: dofState,
        stack: stackSummary,
        isFullyUnrestricted: Object.values(dofState).every(v => v === 1.0)
      };
    },

    /**
     * Führt eine algebraische Schnittmengenprüfung durch:
     * Gültig(Handlung) <=> (Benötigte Fähigkeiten ∩ Blockierte Fähigkeiten == Ø)
     *                      UND (Erforderliche Hardware-Ermöglicher vorhanden)
     *                      UND (Anatomische Kompatibilität gewahrt)
     * @param {Object} params
     * @param {Object} params.action - Zu validierende Handlungsanweisung
     * @param {Array<Object>} params.activeEquipment - Aktuell angelegte Ausrüstung
     * @param {string} [params.recipientAnatomy] - 'penis' | 'vulva'
     * @param {boolean} [params.isLocked] - Wahr, wenn Keuschheitsverschluss verriegelt ist
     * @returns {Object} Validierungs-Ergebnis mit Blöcken, Warnungen und konkreten Alternativen
     */
    validateActionFeasibility: function({ action = {}, activeEquipment = [], recipientAnatomy = 'penis', isLocked = false }) {
      const blocks = [];
      const warnings = [];
      const dofResult = this.calculateDegreesOfFreedom(activeEquipment);
      const dof = dofResult.dof;

      const requiredFaculties = action.requiredFaculties || [];
      const forbiddenWhenBlocked = action.forbiddenWhenBlocked || [];
      const targetZone = action.targetZone || "";
      const executionActor = action.executionActor || "top"; // 'self' | 'top' | 'mutual'

      // 1. Prüfung biologischer Freiheitsgrade (DoF)
      for (let f = 0; f < requiredFaculties.length; f++) {
        const faculty = requiredFaculties[f];
        if (dof.hasOwnProperty(faculty) && dof[faculty] <= 0.05) {
          const conflict = this.resolveFacultyConflict(faculty, action, activeEquipment);
          blocks.push({
            type: "faculty_blocked",
            faculty: faculty,
            message: conflict.message,
            suggestedAlternative: conflict.suggestedAlternative
          });
        }
      }

      // 2. Selbstvollzug bei blockierten Händen
      if (executionActor === "self" && dof.manual_manipulation < 0.5) {
        blocks.push({
          type: "self_execution_impossible",
          message: "Physikalischer Widerspruch: Selbstvollzug der Handlung erfordert freie Hände, die aktuell arretiert sind.",
          suggestedAlternative: "Übernahme der Ausführung unmittelbar durch den Top oder temporäre Entfesselung der Handgelenke."
        });
      }

      // 3. Anatomischer Schutz und Keuschheits-Barriere
      if (recipientAnatomy === "penis" && isLocked) {
        if (targetZone === "genital_penis" || action.requiresDirectPenileContact === true) {
          blocks.push({
            type: "cage_barrier_conflict",
            message: "Hardware-Konflikt: Direkte Schaftberührung ist durch den verriegelten Käfig physisch ausgeschlossen.",
            suggestedAlternative: "Vibration von außen auf das Gitter, Damm-Kältereiz oder anale P-Spot-Stimulation nutzen."
          });
        }
      }

      // 4. Prüfung von Spezial-Hardware-Ermöglichern (Enablers)
      if (action.requiresActivePenetrationGag === true) {
        const hasDildoGag = activeEquipment.some(item => {
          const prof = item.somaticProfile || item.affordanceProfile;
          return prof && prof.enabledFaculties && prof.enabledFaculties.penetration_active && prof.enabledFaculties.penetration_active.capable === true;
        });

        if (!hasDildoGag) {
          blocks.push({
            type: "missing_hardware_enabler",
            message: "Hardware-Fehlt: Diese orale Penetration erfordert einen Dildo-Knebel mit montiertem Außenphallus.",
            suggestedAlternative: "Rüste einen Dildo-Knebel aus oder wechsle zu oralem Zungenservice mit offenem Ringknebel."
          });
        }
      }

      // 5. Oralservice bei geschlossenem Knebel
      if (action.requiresTongueService === true && dof.tongue_mobility_external <= 0.05) {
        blocks.push({
          type: "tongue_blocked_by_gag",
          message: "Funktions-Konflikt: Oralservice (Cunnilingus/Rimming) erfordert freie Zungenbeweglichkeit, die durch den geschlossenen Knebel blockiert ist.",
          suggestedAlternative: "Knebel abnehmen oder auf einen offenen Ringknebel wechseln, der Zungenfreiheit gewährt."
        });
      }

      // 6. RACK-Sicherheits-Check: Seilfesselung ohne Notfallschere
      const hasTightBondage = activeEquipment.some(item => (item.category === "bondage" && item.restraintLayer >= 1));
      const hasEmtShears = activeEquipment.some(item => item.id === "toy_emt_shears" || item.entityId === "toy_emt_shears");
      if (hasTightBondage && !hasEmtShears) {
        warnings.push({
          type: "rack_safety_missing_shears",
          message: "RACK-Sicherheitshinweis: Bei aktiven Seil- oder Lagefesselungen muss eine Notfallschere griffbereit am Bett liegen.",
          suggestedAlternative: "Bereitstellen der EMT-Sicherheits-Verbandschere vor Beginn der Phase."
        });
      }

      return {
        isValid: blocks.length === 0,
        blocks: blocks,
        warnings: warnings,
        remainingDoF: dof,
        activeStack: dofResult.stack
      };
    },

    /**
     * Ermittelt dynamisch alle anatomisch und physikalisch kompatiblen Körperzonen für einen Gegenstand.
     * Ermöglicht kreatives Zonen-Shifting (z. B. Krokodilklemmen an Brust, Skrotum, Labien oder Schenkeln).
     * @param {Object|string} itemOrId - Ausrüstungs-Objekt oder ID
     * @param {string} recipientAnatomy - 'penis' | 'vulva'
     * @returns {Array<Object>} Liste erreichbarer Zielzonen mit somatischem Wirkprofil
     */
    getCompatibleZonesForItem: function(itemOrId, recipientAnatomy = 'penis') {
      let item = itemOrId;
      if (typeof itemOrId === 'string' && window.EquipmentCatalog) {
        item = window.EquipmentCatalog.findItem(itemOrId);
      }
      if (!item) return [];

      const profile = item.somaticProfile || item.affordanceProfile;
      if (!profile || !Array.isArray(profile.compatibleTargetZones)) {
        // Fallback-Zonen basierend auf Kategorie
        return this.getDefaultZonesForCategory(item.category, recipientAnatomy);
      }

      const isVulva = recipientAnatomy === "vulva";
      return profile.compatibleTargetZones.filter(zoneEntry => {
        if (zoneEntry.anatomyGuard === "vulva" && !isVulva) return false;
        if (zoneEntry.anatomyGuard === "penis" && isVulva) return false;
        return true;
      });
    },

    /**
     * Liefert Standardzonen für Gegenstände ohne explizites Affordanz-Profil.
     */
    getDefaultZonesForCategory: function(category, recipientAnatomy) {
      const isVulva = recipientAnatomy === "vulva";
      switch (category) {
        case "impact":
          return [
            { zone: "gluteal_pelvis", somaticEffect: "deep_muscular_impact" },
            { zone: "thighs_inner", somaticEffect: "cutaneous_hyperemia" },
            { zone: "back_flanks", somaticEffect: "diffuse_nociception" }
          ];
        case "sensory":
          return [
            { zone: "chest_nipples", somaticEffect: "focal_tactile_firing" },
            { zone: "back_flanks", somaticEffect: "broad_parasympathetic_soothing" },
            { zone: isVulva ? "genital_labia" : "genital_scrotum", somaticEffect: "high_intensity_erogenous" }
          ];
        case "cbt":
          return isVulva 
            ? [{ zone: "genital_labia", somaticEffect: "vulvar_compression" }]
            : [{ zone: "genital_scrotum", somaticEffect: "testicular_traction" }];
        default:
          return [{ zone: "gluteal_pelvis", somaticEffect: "general_somatic" }];
      }
    },

    /**
     * Löst funktionale Konflikte deterministisch auf und generiert sichere Alternativen.
     */
    resolveFacultyConflict: function(blockedFaculty, action, activeEquipment) {
      if (blockedFaculty === "speech_articulation") {
        return {
          message: `Deutliche Sprache und lautes Mitzählen sind durch die aktive Mund-Hardware blockiert.`,
          suggestedAlternative: "Akustisches Mitzählen durch nonverbale Klopfsignale auf den Oberschenkel oder Mitzählen mit den Fingern ersetzen."
        };
      }
      if (blockedFaculty === "tongue_mobility_external") {
        return {
          message: `Zungenservice ist durch den aktuellen geschlossenen Knebel blockiert.`,
          suggestedAlternative: "Auf einen offenen Ringknebel wechseln oder den Knebel für die Oralservice-Phase temporär lösen."
        };
      }
      if (blockedFaculty === "manual_manipulation") {
        return {
          message: `Handeinsatz ist durch aktive Fesselungen oder Pranger arretiert.`,
          suggestedAlternative: "Handlung direkt durch den Top ausführen lassen oder die Hände vor dem Vollzug freigeben."
        };
      }
      if (blockedFaculty === "locomotion_standing") {
        return {
          message: `Freies Stehen ist durch Knöchel-Arretierung oder Spreizstange eingeschränkt.`,
          suggestedAlternative: "In eine stabile Liegeposition oder aufrechte 90-Grad-Vorbeuge über die Bettkante wechseln."
        };
      }
      if (blockedFaculty === "penile_shaft_access") {
        return {
          message: `Der Schaft ist durch den Keuschheitskäfig versiegelt.`,
          suggestedAlternative: "Wand-Vibration von außen auf das Gitter ansetzen oder Prostata-Stimulation ohne Genitalzugriff wählen."
        };
      }

      return {
        message: `Die geforderte Fähigkeit '${blockedFaculty}' ist durch aktive Ausrüstung blockiert.`,
        suggestedAlternative: "Blockierende Ausrüstung vor dieser Phase temporär ablegen."
      };
    },

    /**
     * Filtert Ausrüstung nach anatomischer Eignung und Käfig-Verschlussstatus.
     * @param {Array<Object>} items - Array von Ausrüstungs-Objekten
     * @param {string} recipientAnatomy - 'penis' | 'vulva'
     * @param {boolean} isLocked - Käfig aktiv verriegelt
     * @returns {Array<Object>} Verifizierte, nutzbare Ausrüstung
     */
    filterFeasibleEquipment: function(items = [], recipientAnatomy = 'penis', isLocked = false) {
      if (!Array.isArray(items)) return [];
      const self = this;

      return items.filter(item => {
        if (!item) return false;
        const profile = item.somaticProfile || item.affordanceProfile || {};
        const compat = item.compatibility || profile.targetAnatomy || "universal";

        // Anatomie-Check
        if (recipientAnatomy === "penis" && compat === "vulva_only") return false;
        if (recipientAnatomy === "vulva" && compat === "penis_only") return false;

        // Wenn verriegelt: Hodenbänder und direkte Schafttoys ausschließen
        if (isLocked && item.id === "toy_ball_stretcher_silicone") return false;

        return true;
      });
    }
  };

  window.ToyCombinatorics = SomaticTopologyEngine;
  window.SomaticTopologyEngine = SomaticTopologyEngine;

})(window);
