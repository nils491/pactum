/**
 * data/equipment_catalog.js
 * TACTUS Somatischer Hardware-, Affordanz- & Reizvektoren-Katalog (V3.0 Hyper-Dynamisch)
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien:
 * - Physikalische Reiz-Vektoren (Kompression, Fülle, Schwingung, Tiefenschlag, Kälte/Hitze)
 * - Restraint-Stacking-Layer:
 *   • Layer 0: Permanente Identitäts- & Eigentums-Anker (z. B. Dauermanschetten)
 *   • Layer 1: Positional Restraint (Lagefesselung, Spreizung)
 *   • Layer 2: Rigid / Environmental (Pranger, Bettpfosten-Fixierung)
 * - Zonen-Affordanzen & DoF-Blockaden (Sprache, Zungenfreiheit, Hände, Penisschaft)
 * - Diskrete Desinfektions- & Rüst-Protokolle für das Reverse Aftercare
 * - 100 % frei von infantilen System-Emojis in Datenstrukturen
 * - Keine window.alert() / window.confirm() Aufrufe unter keinen Umständen
 */

(function(window) {
  'use strict';

  const DYNAMIC_EQUIPMENT_CATALOG = [
    // -------------------------------------------------------------------------
    // KATEGORIE 1: BONDAGE & ARRETIERUNG
    // -------------------------------------------------------------------------
    {
      id: "toy_jute_rope_6mm",
      name: "Shibari Juteseil (6mm geölt)",
      category: "bondage",
      restraintLayer: 1,
      materials: ["jute_natural", "mineral_oil"],
      stimulusVector: {
        type: "cutaneous_traction_and_suspension",
        intensityRange: [1, 5],
        surfaceContact: "linear_friction"
      },
      somaticProfile: {
        wornByZone: "limbs_wrists_hands",
        targetActor: "bottom",
        blocksFaculties: {
          manual_manipulation: true,
          locomotion_standing: 0.5
        },
        enabledFaculties: {
          impact_receptive: true
        },
        compatibleTargetZones: [
          { zone: "limbs_wrists_hands", somaticEffect: "joint_arretation", safeDurationMinutes: 45 },
          { zone: "chest_nipples", somaticEffect: "chest_harness_expansion", safeDurationMinutes: 60 },
          { zone: "limbs_ankles_feet", somaticEffect: "pedal_suspension", safeDurationMinutes: 30 }
        ]
      },
      safetyProtocol: {
        requiresShears: true,
        disinfectionMethod: "air_drying_and_dry_brushing",
        maxContinuousMinutes: 60
      }
    },
    {
      id: "toy_leather_cuffs_wrists",
      name: "Schwere Leder-Handgelenksmanschetten mit D-Ring",
      category: "bondage",
      restraintLayer: 0, // Layer 0: Kann dauerhaft getragen werden ohne Bewegung zu sperren
      materials: ["leather_cowhide", "steel_stainless"],
      stimulusVector: {
        type: "somatosensory_anchor_weight",
        intensityRange: [1, 3],
        surfaceContact: "circumferential_gentle"
      },
      somaticProfile: {
        wornByZone: "limbs_wrists_hands",
        targetActor: "bottom",
        blocksFaculties: {
          manual_manipulation: false // Frei, solange nicht verkoppelt
        },
        enabledFaculties: {
          coupling_anchor_ready: true
        },
        compatibleTargetZones: [
          { zone: "limbs_wrists_hands", somaticEffect: "psychological_anchoring", safeDurationMinutes: 480 }
        ]
      },
      safetyProtocol: {
        requiresShears: false,
        disinfectionMethod: "antiseptic_leather_care_spray",
        maxContinuousMinutes: 720
      }
    },
    {
      id: "toy_spreader_bar_rigid",
      name: "Teleskop-Spreizstange aus Edelstahl",
      category: "bondage",
      restraintLayer: 1,
      materials: ["steel_stainless", "leather"],
      stimulusVector: {
        type: "skeletal_abduction_rigid",
        intensityRange: [3, 5],
        surfaceContact: "bilateral_anchor"
      },
      somaticProfile: {
        wornByZone: "limbs_ankles_feet",
        targetActor: "bottom",
        blocksFaculties: {
          locomotion_standing: true,
          pelvic_thrust_active: 0.7
        },
        enabledFaculties: {
          pelvic_exposure_maximal: true,
          impact_receptive: true
        },
        compatibleTargetZones: [
          { zone: "limbs_ankles_feet", somaticEffect: "enforced_genital_exposure", safeDurationMinutes: 60 }
        ]
      },
      safetyProtocol: {
        requiresShears: false,
        disinfectionMethod: "isopropanol_wipe_down",
        maxContinuousMinutes: 60
      }
    },
    {
      id: "toy_wooden_pillory",
      name: "Hals-Hand-Pranger aus Hartholz",
      category: "bondage",
      restraintLayer: 2, // Layer 2: Starre mechanische Umweltkopplung
      materials: ["wood_oak", "steel_brass"],
      stimulusVector: {
        type: "cervical_and_brachial_lock",
        intensityRange: [4, 5],
        surfaceContact: "rigid_compression"
      },
      somaticProfile: {
        wornByZone: "neck_cervical",
        targetActor: "bottom",
        blocksFaculties: {
          manual_manipulation: true,
          locomotion_standing: 0.3
        },
        enabledFaculties: {
          impact_receptive: true,
          oral_service_receptive: true
        },
        compatibleTargetZones: [
          { zone: "neck_cervical", somaticEffect: "absolute_head_and_wrist_lock", safeDurationMinutes: 45 }
        ]
      },
      safetyProtocol: {
        requiresShears: false,
        disinfectionMethod: "wood_antiseptic_cleaner",
        maxContinuousMinutes: 45
      }
    },

    // -------------------------------------------------------------------------
    // KATEGORIE 2: IMPACT & ZUCHTWERKZEUGE
    // -------------------------------------------------------------------------
    {
      id: "toy_leather_flogger",
      name: "Schwerer Rindleder-Flogger (40 Fransen)",
      category: "impact",
      restraintLayer: 0,
      materials: ["leather_cowhide"],
      stimulusVector: {
        type: "diffuse_kinetic_thud",
        intensityRange: [2, 5],
        surfaceContact: "broad_surface_impact"
      },
      somaticProfile: {
        wornByZone: "gluteal_pelvis",
        targetActor: "top",
        blocksFaculties: {},
        enabledFaculties: {
          endorphin_release_activation: true
        },
        compatibleTargetZones: [
          { zone: "gluteal_pelvis", somaticEffect: "deep_muscular_hyperemia", safeDurationMinutes: 30 },
          { zone: "back_flanks", somaticEffect: "diffuse_cutaneous_heat", safeDurationMinutes: 20 },
          { zone: "thighs_inner", somaticEffect: "stinging_sensitisation", safeDurationMinutes: 10 }
        ]
      },
      safetyProtocol: {
        requiresShears: false,
        disinfectionMethod: "antiseptic_leather_wipe_and_air_dry",
        maxContinuousMinutes: 30
      }
    },
    {
      id: "toy_leather_paddle_wide",
      name: "Breites Sattelleder-Paddle",
      category: "impact",
      restraintLayer: 0,
      materials: ["leather_saddle", "wood_core"],
      stimulusVector: {
        type: "flat_resonant_thud",
        intensityRange: [3, 5],
        surfaceContact: "planar_solid"
      },
      somaticProfile: {
        wornByZone: "gluteal_pelvis",
        targetActor: "top",
        blocksFaculties: {},
        enabledFaculties: {
          deep_tissue_stimulation: true
        },
        compatibleTargetZones: [
          { zone: "gluteal_pelvis", somaticEffect: "intense_erythema_and_pacing", safeDurationMinutes: 20 }
        ]
      },
      safetyProtocol: {
        requiresShears: false,
        disinfectionMethod: "leather_balsam_and_disinfection",
        maxContinuousMinutes: 20
      }
    },
    {
      id: "toy_riding_crop_slender",
      name: "Schlanke Dressur-Reitgerte mit Lederklatsche",
      category: "impact",
      restraintLayer: 0,
      materials: ["fiberglass", "leather"],
      stimulusVector: {
        type: "focal_sharp_sting",
        intensityRange: [2, 5],
        surfaceContact: "linear_focal"
      },
      somaticProfile: {
        wornByZone: "thighs_inner",
        targetActor: "top",
        blocksFaculties: {},
        enabledFaculties: {
          acute_neurological_firing: true
        },
        compatibleTargetZones: [
          { zone: "thighs_inner", somaticEffect: "high_density_nociception", safeDurationMinutes: 15 },
          { zone: "gluteal_pelvis", somaticEffect: "sharp_surface_marking", safeDurationMinutes: 15 }
        ]
      },
      safetyProtocol: {
        requiresShears: false,
        disinfectionMethod: "isopropanol_wipe_down",
        maxContinuousMinutes: 15
      }
    },

    // -------------------------------------------------------------------------
    // KATEGORIE 3: SENSORIK, KNEBEL & ATEMWEGE
    // -------------------------------------------------------------------------
    {
      id: "toy_blindfold_silk",
      name: "Lichtdichte Seiden-Augenbinde",
      category: "sensory",
      restraintLayer: 0,
      materials: ["silk_padded"],
      stimulusVector: {
        type: "complete_visual_deprivation",
        intensityRange: [1, 3],
        surfaceContact: "orbital_gentle"
      },
      somaticProfile: {
        wornByZone: "head_eyes",
        targetActor: "bottom",
        blocksFaculties: {
          visual_perception: true
        },
        enabledFaculties: {
          tactile_hyperesthesia: true
        },
        compatibleTargetZones: [
          { zone: "head_eyes", somaticEffect: "auditory_and_tactile_amplification", safeDurationMinutes: 180 }
        ]
      },
      safetyProtocol: {
        requiresShears: false,
        disinfectionMethod: "delicate_textile_handwash",
        maxContinuousMinutes: 180
      }
    },
    {
      id: "toy_ring_gag_metal",
      name: "Offener Edelstahl-Ringknebel (45mm Öffnung)",
      category: "sensory",
      restraintLayer: 1,
      materials: ["steel_stainless", "leather"],
      stimulusVector: {
        type: "jaw_dilation_open",
        intensityRange: [2, 4],
        surfaceContact: "labial_perimeter"
      },
      somaticProfile: {
        wornByZone: "head_mouth",
        targetActor: "bottom",
        blocksFaculties: {
          speech_articulation: true,
          tongue_mobility_external: false // Zunge bleibt frei für Oralservice!
        },
        enabledFaculties: {
          tongue_service: true,
          oral_inspection_open: true
        },
        compatibleTargetZones: [
          { zone: "head_mouth", somaticEffect: "articulation_block_with_tongue_freedom", safeDurationMinutes: 45 }
        ]
      },
      safetyProtocol: {
        requiresShears: false,
        disinfectionMethod: "boiling_water_or_isopropanol_for_metal",
        maxContinuousMinutes: 45
      }
    },
    {
      id: "toy_gag_dildo_external",
      name: "Leder-Knebel mit montiertem Außenphallus (15cm)",
      category: "sensory",
      restraintLayer: 1,
      materials: ["leather", "silicone_medical"],
      stimulusVector: {
        type: "oral_anchored_active_phallus",
        intensityRange: [3, 5],
        surfaceContact: "dual_pharyngeal_and_external"
      },
      somaticProfile: {
        wornByZone: "head_mouth",
        targetActor: "bottom",
        blocksFaculties: {
          speech_articulation: true,
          tongue_mobility_external: true
        },
        enabledFaculties: {
          penetration_active: {
            capable: true,
            targetZones: ["genital_vulva_clitoris", "rectum_prostate", "head_mouth"]
          }
        },
        compatibleTargetZones: [
          { zone: "head_mouth", somaticEffect: "submissive_phallic_mounting", safeDurationMinutes: 30 }
        ]
      },
      safetyProtocol: {
        requiresShears: false,
        disinfectionMethod: "ph_neutral_soap_for_silicone_leather_spray_for_straps",
        maxContinuousMinutes: 30
      }
    },
    {
      id: "toy_ball_gag_silicone",
      name: "Geschlossener Silikon-Ballknebel (45mm)",
      category: "sensory",
      restraintLayer: 1,
      materials: ["silicone_medical", "leather"],
      stimulusVector: {
        type: "intraoral_volume_displacement",
        intensityRange: [2, 4],
        surfaceContact: "tongue_depression"
      },
      somaticProfile: {
        wornByZone: "head_mouth",
        targetActor: "bottom",
        blocksFaculties: {
          speech_articulation: true,
          tongue_mobility_external: true
        },
        enabledFaculties: {
          muffled_vocalization_only: true
        },
        compatibleTargetZones: [
          { zone: "head_mouth", somaticEffect: "complete_verbal_silencing", safeDurationMinutes: 40 }
        ]
      },
      safetyProtocol: {
        requiresShears: false,
        disinfectionMethod: "warm_soapy_water_silicone_safe",
        maxContinuousMinutes: 40
      }
    },

    // -------------------------------------------------------------------------
    // KATEGORIE 4: CBT, KLEMMEN & ZONEN-SHIFTING
    // -------------------------------------------------------------------------
    {
      id: "toy_alligator_clamps",
      name: "Krokodilklemmen mit Rändelschraube & Verbindungskette",
      category: "cbt",
      restraintLayer: 0,
      materials: ["steel_nickel_free", "rubber_tips"],
      stimulusVector: {
        type: "mechanical_ischemic_pinch",
        intensityRange: [2, 5],
        surfaceContact: "focal_point_compression"
      },
      somaticProfile: {
        wornByZone: "chest_nipples",
        targetActor: "bottom",
        blocksFaculties: {},
        enabledFaculties: {
          intense_cutaneous_hyperesthesia: true
        },
        // Hyper-Dynamisches Zonen-Shifting:
        compatibleTargetZones: [
          { zone: "chest_nipples", somaticEffect: "focal_erogenous_nociception", safeDurationMinutes: 25 },
          { zone: "genital_scrotum", anatomyGuard: "penis", somaticEffect: "scrotal_traction_sensitisation", safeDurationMinutes: 15 },
          { zone: "genital_labia", anatomyGuard: "vulva", somaticEffect: "labial_tumescence_compression", safeDurationMinutes: 20 },
          { zone: "thighs_inner", somaticEffect: "punitive_adductor_sting", safeDurationMinutes: 10 }
        ]
      },
      safetyProtocol: {
        requiresShears: false,
        disinfectionMethod: "isopropanol_immersion",
        maxContinuousMinutes: 25
      }
    },
    {
      id: "toy_wartenberg_wheel",
      name: "Wartenberg-Nadelrad aus Edelstahl",
      category: "sensory",
      restraintLayer: 0,
      materials: ["steel_stainless"],
      stimulusVector: {
        type: "superficial_punctate_rolling",
        intensityRange: [1, 3],
        surfaceContact: "rolling_multi_point"
      },
      somaticProfile: {
        wornByZone: "back_flanks",
        targetActor: "top",
        blocksFaculties: {},
        enabledFaculties: {
          parasympathetic_hair_follicle_stimulation: true
        },
        compatibleTargetZones: [
          { zone: "back_flanks", somaticEffect: "shiver_induction_cutaneous", safeDurationMinutes: 20 },
          { zone: "gluteal_pelvis", somaticEffect: "sensory_contrast_priming", safeDurationMinutes: 15 },
          { zone: "chest_nipples", somaticEffect: "micro_nerve_excitation", safeDurationMinutes: 10 }
        ]
      },
      safetyProtocol: {
        requiresShears: false,
        disinfectionMethod: "isopropanol_wipe_down",
        maxContinuousMinutes: 20
      }
    },

    // -------------------------------------------------------------------------
    // KATEGORIE 5: KEUSCHHEIT, PFLEGE & RACK-SICHERHEIT
    // -------------------------------------------------------------------------
    {
      id: "toy_chastity_cherrykeeper",
      name: "Cherrykeeper Micro Stub (<= 35mm)",
      category: "chastity",
      restraintLayer: 0,
      materials: ["polyamide_pa12", "bioresin"],
      stimulusVector: {
        type: "penile_axial_compression_rigid",
        intensityRange: [3, 5],
        surfaceContact: "total_glandular_enclosure"
      },
      somaticProfile: {
        wornByZone: "genital_penis",
        targetActor: "bottom",
        compatibility: "penis_only",
        blocksFaculties: {
          penile_shaft_access: true
        },
        enabledFaculties: {
          long_term_submissive_anchoring: true
        },
        compatibleTargetZones: [
          { zone: "genital_penis", somaticEffect: "continuous_tumescence_prevention", safeDurationMinutes: 1440 }
        ]
      },
      safetyProtocol: {
        requiresShears: false,
        disinfectionMethod: "daily_saline_irrigation_and_mild_soap",
        maxContinuousMinutes: 1440
      }
    },
    {
      id: "toy_irrigation_syringe",
      name: "Urologische Spülspritze mit Knopfkanüle (50ml)",
      category: "care",
      restraintLayer: 0,
      materials: ["polypropylene_medical", "steel_blunt"],
      stimulusVector: {
        type: "hydrodynamic_lavage",
        intensityRange: [1, 2],
        surfaceContact: "liquid_flush"
      },
      somaticProfile: {
        wornByZone: "genital_penis",
        targetActor: "bottom",
        blocksFaculties: {},
        enabledFaculties: {
          balanitis_prevention_guaranteed: true
        },
        compatibleTargetZones: [
          { zone: "genital_penis", somaticEffect: "subpreputial_smegma_and_urine_wash", safeDurationMinutes: 10 }
        ]
      },
      safetyProtocol: {
        requiresShears: false,
        disinfectionMethod: "thermal_disinfection_or_hot_water_flush",
        maxContinuousMinutes: 10
      }
    },
    {
      id: "toy_weighted_blanket_8kg",
      name: "Therapeutische 8kg-Gewichtsdecke",
      category: "care",
      restraintLayer: 0,
      materials: ["cotton_heavy", "glass_micro_beads"],
      stimulusVector: {
        type: "deep_proprioceptive_pressure",
        intensityRange: [1, 2],
        surfaceContact: "full_body_planar"
      },
      somaticProfile: {
        wornByZone: "back_flanks",
        targetActor: "mutual",
        blocksFaculties: {
          locomotion_standing: 0.8
        },
        enabledFaculties: {
          vagus_nerve_downregulation: true,
          hypothermia_prevention: true
        },
        compatibleTargetZones: [
          { zone: "back_flanks", somaticEffect: "post_session_subdrop_containment", safeDurationMinutes: 120 }
        ]
      },
      safetyProtocol: {
        requiresShears: false,
        disinfectionMethod: "washable_duvet_cover_60deg",
        maxContinuousMinutes: 180
      }
    },
    {
      id: "toy_emt_shears",
      name: "EMT-Sicherheits-Verbandschere mit abgerundeter Spitze",
      category: "care",
      restraintLayer: 0,
      materials: ["steel_surgical", "polymer"],
      stimulusVector: {
        type: "rapid_emergency_release_cutting",
        intensityRange: [1, 1],
        surfaceContact: "blunt_tip_skin_safe"
      },
      somaticProfile: {
        wornByZone: "limbs_wrists_hands",
        targetActor: "top",
        blocksFaculties: {},
        enabledFaculties: {
          instant_bondage_emergency_severing: true
        },
        compatibleTargetZones: [
          { zone: "limbs_wrists_hands", somaticEffect: "immediate_neurovascular_relief", safeDurationMinutes: 1 }
        ]
      },
      safetyProtocol: {
        requiresShears: false,
        disinfectionMethod: "isopropanol_wipe_down",
        maxContinuousMinutes: 1
      }
    }
  ];

  const EquipmentCatalogEngine = {
    items: DYNAMIC_EQUIPMENT_CATALOG,

    getAll: function() {
      let custom = [];
      try {
        const raw = localStorage.getItem('tactus_custom_equipment') || localStorage.getItem('kompass_custom_equipment');
        if (raw) custom = JSON.parse(raw) || [];
      } catch (e) {}
      return [...this.items, ...custom];
    },

    findItem: function(id) {
      if (!id) return null;
      return this.getAll().find(item => item.id === id) || null;
    },

    filterByZone: function(bodyZoneId, recipientAnatomy = 'penis') {
      return this.getAll().filter(item => {
        const profile = item.somaticProfile;
        if (!profile) return false;
        if (item.compatibility === "penis_only" && recipientAnatomy !== "penis") return false;
        if (item.compatibility === "vulva_only" && recipientAnatomy !== "vulva") return false;

        const zones = profile.compatibleTargetZones || [];
        return zones.some(z => z.zone === bodyZoneId);
      });
    },

    filterByStimulusType: function(stimulusType) {
      return this.getAll().filter(item => {
        return item.stimulusVector && item.stimulusVector.type.includes(stimulusType);
      });
    },

    getDisinfectionProtocols: function(itemIds = []) {
      const all = this.getAll();
      const protocols = [];
      itemIds.forEach(id => {
        const found = all.find(it => it.id === id);
        if (found && found.safetyProtocol) {
          protocols.push({
            itemId: found.id,
            name: found.name,
            method: found.safetyProtocol.disinfectionMethod,
            requiresShears: found.safetyProtocol.requiresShears
          });
        }
      });
      return protocols;
    },

    registerCustomItem: function(customItem) {
      if (!customItem || !customItem.id || !customItem.name) return false;
      let existing = [];
      try {
        const raw = localStorage.getItem('tactus_custom_equipment');
        if (raw) existing = JSON.parse(raw) || [];
      } catch (e) {}

      existing = existing.filter(c => c.id !== customItem.id);
      existing.push(customItem);
      localStorage.setItem('tactus_custom_equipment', JSON.stringify(existing));
      return true;
    }
  };

  window.EquipmentCatalog = EquipmentCatalogEngine;
  // Abwärtskompatibler Alias
  window.equipmentCatalog = EquipmentCatalogEngine.getAll();

})(window);
