/**
 * data/equipment_catalog.js
 * TACTUS Somatischer Hardware-, Affordanz- & Reizvektor-Katalog (V3.0 Hyper-Dynamisch)
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien:
 * - Jedes Item ist ein somatischer Transformator: Reizvektor (V_Reiz), Zonen-Kopplung und DoF-Restriktionen
 * - Multimodales Affordanz-Modell: Definiert Zonenbelegung, gesperrte und freigeschaltete Fähigkeiten
 * - Restraint-Stacking-Architektur: Layer 0 (Permanent/Basis), Layer 1 (Positional), Layer 2 (Rigid/Environment)
 * - Rüst- & Desinfektionsprotokoll für jedes Item (Reverse Aftercare & RACK-Sicherheit)
 * - 100 % kompatibel mit der mathematischen DoF-Validierungsengine
 * - 100 % frei von trivialen Emojis in Datenstrukturen
 */

(function(window) {
  'use strict';

  const equipmentCatalog = [
    // =========================================================================
    // KATEGORIE: BONDAGE, ARRETIERUNG & RESTRAINTS (STACKING-FÄHIG)
    // =========================================================================
    {
      id: "toy_jute_rope_6mm",
      name: "Shibari Juteseil (6mm geölt)",
      category: "bondage",
      restraintLayer: 1, // Layer 1: Positional & Harness
      stimulusVector: {
        primaryType: "surface_tension_friction",
        intensityRange: [1, 5],
        sensoryContact: "fibrous_warm"
      },
      affordances: {
        occupiesZones: ["chest_torso", "limbs_arms", "limbs_legs"],
        blocksFaculties: {
          manual_manipulation: "conditional_when_wrists_tied",
          locomotion_stride: "conditional_when_legs_tied"
        },
        enablesFaculties: {
          posture_suspension_support: true,
          chest_expansion_sensitisation: true
        }
      },
      compatibleTargetZones: [
        { zone: "chest_torso", effect: "deep_tactile_containment", maxSafeMinutes: 90 },
        { zone: "limbs_wrists", effect: "motion_restriction", maxSafeMinutes: 45 },
        { zone: "thighs_pelvis", effect: "spread_vulnerability", maxSafeMinutes: 60 }
      ],
      stackingCompatibility: {
        canLayerOver: ["toy_leather_cuffs_wrists", "toy_leather_cuffs_ankles"],
        canConnectTo: ["bedpost", "spreader_bar", "suspension_point"]
      },
      careAndDisinfection: {
        method: "dry_wipe_and_oil",
        agent: "camellia_or_jojoba_oil",
        requiresImmediateDisinfection: false,
        protocol: "Nach Nutzung entlüften, auskämmen, trocken lagern; alle 6 Monate sparsam ölen."
      }
    },
    {
      id: "toy_cotton_rope",
      name: "Weiche Baumwollseile",
      category: "bondage",
      restraintLayer: 1,
      stimulusVector: {
        primaryType: "soft_surface_friction",
        intensityRange: [1, 3],
        sensoryContact: "smooth_warm"
      },
      affordances: {
        occupiesZones: ["limbs_wrists", "limbs_ankles", "neck_collar_light"],
        blocksFaculties: {
          manual_manipulation: "conditional_when_wrists_tied"
        },
        enablesFaculties: {
          gentle_limb_restraint: true
        }
      },
      compatibleTargetZones: [
        { zone: "limbs_wrists", effect: "soft_holding", maxSafeMinutes: 60 },
        { zone: "limbs_ankles", effect: "limb_separation", maxSafeMinutes: 60 }
      ],
      stackingCompatibility: {
        canLayerOver: [],
        canConnectTo: ["bedpost"]
      },
      careAndDisinfection: {
        method: "washable",
        agent: "mild_detergent_40c",
        requiresImmediateDisinfection: false,
        protocol: "Im Wäschesäckchen im Schonwaschgang waschbar; lufttrocknen lassen."
      }
    },
    {
      id: "toy_leather_cuffs_wrists",
      name: "Gepolsterte Leder-Handgelenksmanschetten",
      category: "bondage",
      restraintLayer: 0, // Layer 0: Permanente Identitäts- & Kopplungsbasis
      stimulusVector: {
        primaryType: "circumferential_compression",
        intensityRange: [1, 4],
        sensoryContact: "leather_lined_heavy"
      },
      affordances: {
        occupiesZones: ["limbs_wrists"],
        blocksFaculties: {
          manual_manipulation: false // Frei, solange nicht an Layer 1/2 arretiert
        },
        enablesFaculties: {
          d_ring_anchor_point: true,
          lead_leash_attachment: true
        }
      },
      compatibleTargetZones: [
        { zone: "limbs_wrists", effect: "wrist_encasement", maxSafeMinutes: 240 }
      ],
      stackingCompatibility: {
        canLayerUnder: ["toy_jute_rope_6mm", "toy_spreader_bar"],
        canConnectTo: ["toy_spreader_bar", "bedpost", "collar_d_ring"]
      },
      careAndDisinfection: {
        method: "leather_disinfection_wipe",
        agent: "alcohol_free_antiseptic_and_balm",
        requiresImmediateDisinfection: true,
        protocol: "Innenseite mit alkoholfreiem Tuch desinfizieren; Lederaußenseite trocken nachpolieren."
      }
    },
    {
      id: "toy_leather_cuffs_ankles",
      name: "Gepolsterte Leder-Fußgelenksmanschetten",
      category: "bondage",
      restraintLayer: 0,
      stimulusVector: {
        primaryType: "circumferential_compression",
        intensityRange: [1, 4],
        sensoryContact: "leather_lined_heavy"
      },
      affordances: {
        occupiesZones: ["limbs_ankles"],
        blocksFaculties: {
          locomotion_stride: false // Frei, solange nicht arretiert
        },
        enablesFaculties: {
          d_ring_anchor_point: true,
          spreader_bar_coupling: true
        }
      },
      compatibleTargetZones: [
        { zone: "limbs_ankles", effect: "ankle_anchoring", maxSafeMinutes: 240 }
      ],
      stackingCompatibility: {
        canLayerUnder: ["toy_spreader_bar", "toy_jute_rope_6mm"],
        canConnectTo: ["toy_spreader_bar", "bedpost"]
      },
      careAndDisinfection: {
        method: "leather_disinfection_wipe",
        agent: "alcohol_free_antiseptic_and_balm",
        requiresImmediateDisinfection: true,
        protocol: "Innenpolsterung antiseptisch abwischen; Schnallen auf Gängigkeit prüfen."
      }
    },
    {
      id: "toy_spreader_bar",
      name: "Verstellbare Spreizstange (Spreader Bar)",
      category: "bondage",
      restraintLayer: 1, // Layer 1: Haltungs-Begrenzung
      stimulusVector: {
        primaryType: "rigid_skeletal_abduction",
        intensityRange: [2, 5],
        sensoryContact: "rigid_metal_or_carbon"
      },
      affordances: {
        occupiesZones: ["limbs_ankles"],
        blocksFaculties: {
          locomotion_stride: true,
          thigh_adduction_closing: true // Oberschenkelschluss vollständig blockiert
        },
        enablesFaculties: {
          pelvic_exposure_constant: true,
          vulnerable_examination_posture: true
        }
      },
      compatibleTargetZones: [
        { zone: "limbs_ankles", effect: "forced_abduction", maxSafeMinutes: 45 }
      ],
      stackingCompatibility: {
        canLayerOver: ["toy_leather_cuffs_ankles"],
        canConnectTo: ["bedpost"]
      },
      careAndDisinfection: {
        method: "surface_spray_wipe",
        agent: "isopropanol_70",
        requiresImmediateDisinfection: true,
        protocol: "Metallstange und Karabiner mit Isopropanol desinfizieren; Gelenke trocken abwischen."
      }
    },
    {
      id: "toy_emt_shears",
      name: "EMT-Sicherheits-Verbandschere",
      category: "bondage",
      restraintLayer: 0,
      stimulusVector: {
        primaryType: "none_safety_tool",
        intensityRange: [0, 0],
        sensoryContact: "surgical_steel"
      },
      affordances: {
        occupiesZones: [],
        blocksFaculties: {},
        enablesFaculties: {
          rapid_rope_severing_rack: true // Not-Aus bei Fesselkompression
        }
      },
      compatibleTargetZones: [],
      stackingCompatibility: {
        canLayerOver: [],
        canConnectTo: []
      },
      careAndDisinfection: {
        method: "wipe",
        agent: "isopropanol_70",
        requiresImmediateDisinfection: false,
        protocol: "Muss bei jeder Fesselung in Griffweite der Spielleitung platziert sein!"
      }
    },

    // =========================================================================
    // KATEGORIE: IMPACT, ZUCHT & SCHLAGWERKZEUGE
    // =========================================================================
    {
      id: "toy_leather_flogger_heavy",
      name: "Schwerer Rindleder-Flogger",
      category: "impact",
      restraintLayer: 0,
      stimulusVector: {
        primaryType: "thuddy_diffuse_impact",
        intensityRange: [2, 5],
        sensoryContact: "multiple_broad_falls",
        penetrationDepth: "muscle_deep",
        endorphinReleasePotential: "very_high"
      },
      affordances: {
        occupiesZones: [],
        blocksFaculties: {},
        enablesFaculties: {
          diffuse_hyperemia: true,
          subspace_induction: true
        }
      },
      compatibleTargetZones: [
        { zone: "gluteal_fleshy", effect: "deep_thudding_heat", maxStrikesPerSession: 120 },
        { zone: "back_latissimus", effect: "broad_circulation_rush", maxStrikesPerSession: 40 },
        { zone: "thighs_back", effect: "muscle_toning", maxStrikesPerSession: 40 }
      ],
      stackingCompatibility: { canLayerOver: [], canConnectTo: [] },
      careAndDisinfection: {
        method: "aerate_and_comb",
        agent: "leather_cleaner_minimal",
        requiresImmediateDisinfection: false,
        protocol: "Fransen nach Session ausschlagen und trocken lüften; nicht feucht lagern."
      }
    },
    {
      id: "toy_leather_paddle_wide",
      name: "Breites Sattelleder-Paddle",
      category: "impact",
      restraintLayer: 0,
      stimulusVector: {
        primaryType: "planar_solid_impact",
        intensityRange: [2, 5],
        sensoryContact: "broad_dense_leather",
        penetrationDepth: "surface_and_fascia",
        endorphinReleasePotential: "high"
      },
      affordances: {
        occupiesZones: [],
        blocksFaculties: {},
        enablesFaculties: {
          acoustic_echo_crack: true,
          focal_vascular_flare: true
        }
      },
      compatibleTargetZones: [
        { zone: "gluteal_fleshy", effect: "flat_searing_heat", maxStrikesPerSession: 60 }
      ],
      stackingCompatibility: { canLayerOver: [], canConnectTo: [] },
      careAndDisinfection: {
        method: "wipe",
        agent: "antiseptic_leather_wipe",
        requiresImmediateDisinfection: true,
        protocol: "Trefferfläche nach Hautkontakt desinfizierend abwischen."
      }
    },
    {
      id: "toy_leather_belt",
      name: "Klassischer Ledergürtel",
      category: "impact",
      restraintLayer: 0,
      stimulusVector: {
        primaryType: "linear_sharp_impact",
        intensityRange: [2, 4],
        sensoryContact: "leather_edge_focused",
        penetrationDepth: "surface_dermal",
        endorphinReleasePotential: "medium_high"
      },
      affordances: {
        occupiesZones: [],
        blocksFaculties: {},
        enablesFaculties: {
          authoritative_discipline_snap: true
        }
      },
      compatibleTargetZones: [
        { zone: "gluteal_fleshy", effect: "sharp_dermal_discipline", maxStrikesPerSession: 40 }
      ],
      stackingCompatibility: { canLayerOver: [], canConnectTo: [] },
      careAndDisinfection: {
        method: "dry_wipe",
        agent: "microfiber",
        requiresImmediateDisinfection: false,
        protocol: "Metallschließe vor jedem Hieb fest in der Führungshand sichern!"
      }
    },
    {
      id: "toy_riding_crop",
      name: "Schlanke Reitgerte (Crop)",
      category: "impact",
      restraintLayer: 0,
      stimulusVector: {
        primaryType: "focal_stinging_impact",
        intensityRange: [2, 5],
        sensoryContact: "narrow_leather_keeper",
        penetrationDepth: "superficial_nociceptive",
        endorphinReleasePotential: "high"
      },
      affordances: {
        occupiesZones: [],
        blocksFaculties: {},
        enablesFaculties: {
          precision_point_targeting: true
        }
      },
      compatibleTargetZones: [
        { zone: "thighs_inner", effect: "intense_stinging_anticipation", maxStrikesPerSession: 15 },
        { zone: "gluteal_subfold", effect: "sharp_punitive_sting", maxStrikesPerSession: 30 }
      ],
      stackingCompatibility: { canLayerOver: [], canConnectTo: [] },
      careAndDisinfection: {
        method: "wipe",
        agent: "isopropanol_wipe",
        requiresImmediateDisinfection: true,
        protocol: "Klatsche mit alkoholischem Tuch säubern; Schaft auf Risse prüfen."
      }
    },
    {
      id: "toy_wooden_paddle",
      name: "Hartholz-Paddle",
      category: "impact",
      restraintLayer: 0,
      stimulusVector: {
        primaryType: "rigid_unyielding_impact",
        intensityRange: [3, 5],
        sensoryContact: "varnished_hardwood",
        penetrationDepth: "deep_bone_adjacent_muscle",
        endorphinReleasePotential: "maximum"
      },
      affordances: {
        occupiesZones: [],
        blocksFaculties: {},
        enablesFaculties: {
          severe_discipline_endurance: true
        }
      },
      compatibleTargetZones: [
        { zone: "gluteal_fleshy", effect: "uncompromising_muscle_impact", maxStrikesPerSession: 25 }
      ],
      stackingCompatibility: { canLayerOver: [], canConnectTo: [] },
      careAndDisinfection: {
        method: "wood_disinfection",
        agent: "ph_neutral_disinfectant",
        requiresImmediateDisinfection: true,
        protocol: "Trefferfläche desinfizierend abwischen; vor Nässe schützen."
      }
    },

    // =========================================================================
    // KATEGORIE: SENSORIK, MUND-HARDWARE & KNEBEL (HYPER-DYNAMISCH)
    // =========================================================================
    {
      id: "toy_blindfold_silk",
      name: "Lichtdichte Seiden-Augenbinde",
      category: "sensory",
      restraintLayer: 0,
      stimulusVector: {
        primaryType: "visual_deprivation",
        intensityRange: [1, 3],
        sensoryContact: "smooth_silk_cushioned"
      },
      affordances: {
        occupiesZones: ["head_eyes"],
        blocksFaculties: {
          visual_perception: true // Sicht zu 100 % blockiert
        },
        enablesFaculties: {
          auditory_somatosensory_hyperacuity: true // Gehör- und Berührungsfokus verdoppelt
        }
      },
      compatibleTargetZones: [
        { zone: "head_eyes", effect: "total_darkness_surrender", maxSafeMinutes: 180 }
      ],
      stackingCompatibility: { canLayerOver: [], canConnectTo: [] },
      careAndDisinfection: {
        method: "handwash_silk",
        agent: "silk_detergent",
        requiresImmediateDisinfection: false,
        protocol: "Regelmäßige Handwäsche bei 30 °C; lichtdicht lagern."
      }
    },
    {
      id: "toy_sensory_wheel",
      name: "Wartenberg-Nadelrad",
      category: "sensory",
      restraintLayer: 0,
      stimulusVector: {
        primaryType: "micro_punctate_dermal_prickle",
        intensityRange: [1, 4],
        sensoryContact: "revolving_steel_spikes",
        penetrationDepth: "stratum_corneum_non_bleeding"
      },
      affordances: {
        occupiesZones: [],
        blocksFaculties: {},
        enablesFaculties: {
          dermatomal_nerve_excitation: true
        }
      },
      compatibleTargetZones: [
        { zone: "torso_ribs", effect: "electric_prickle_trail", maxSafeMinutes: 20 },
        { zone: "thighs_inner", effect: "exquisite_nerve_tension", maxSafeMinutes: 15 },
        { zone: "spine_dorsal", effect: "meridian_spine_tingle", maxSafeMinutes: 25 }
      ],
      stackingCompatibility: { canLayerOver: [], canConnectTo: [] },
      careAndDisinfection: {
        method: "immersion_or_spray",
        agent: "isopropanol_70",
        requiresImmediateDisinfection: true,
        protocol: "Nadelrädchen vor und nach JEDEM Einsatz mit Isopropanol desinfizieren."
      }
    },
    {
      id: "toy_bdsm_wax_candle",
      name: "Niedrigtemperatur-Tropfwachs (Sojabasis)",
      category: "sensory",
      restraintLayer: 0,
      stimulusVector: {
        primaryType: "focal_thermal_pulse",
        intensityRange: [2, 4],
        sensoryContact: "molten_wax_48c_to_52c",
        penetrationDepth: "superficial_epidermal"
      },
      affordances: {
        occupiesZones: [],
        blocksFaculties: {},
        enablesFaculties: {
          thermal_nociception_without_blistering: true
        }
      },
      compatibleTargetZones: [
        { zone: "chest_torso", effect: "thermal_shock_wave", maxSafeMinutes: 30 },
        { zone: "thighs_front", effect: "hot_wax_crust_retention", maxSafeMinutes: 30 }
      ],
      stackingCompatibility: { canLayerOver: [], canConnectTo: [] },
      careAndDisinfection: {
        method: "peel_and_dispose",
        agent: "oil_wipe_for_skin",
        requiresImmediateDisinfection: false,
        protocol: "Erkaltetes Wachs nach Session rückstandsfrei abziehen; Haut einölen."
      }
    },
    {
      id: "toy_ball_gag_silicone",
      name: "Silikon-Ballknebel mit Lederriemen",
      category: "sensory",
      restraintLayer: 0,
      stimulusVector: {
        primaryType: "oral_cavity_obstruction",
        intensityRange: [2, 5],
        sensoryContact: "dense_medical_silicone"
      },
      affordances: {
        occupiesZones: ["head_mouth", "jaw_temporomandibular"],
        blocksFaculties: {
          speech_articulation: true,         // Deutliche Sprache unmöglich -> Klopfsignal
          oral_licking_service: true,        // Zunge im Mund gefangen -> kein Cunnilingus
          tongue_mobility_external: true,
          active_penetration: false
        },
        enablesFaculties: {
          salivation_flow_surrender: true,
          muffled_vocalization_only: true
        }
      },
      compatibleTargetZones: [
        { zone: "head_mouth", effect: "vocal_arrest_and_submission", maxSafeMinutes: 45 }
      ],
      stackingCompatibility: {
        canLayerOver: [],
        canConnectTo: ["collar_d_ring", "pillow_restraint"]
      },
      careAndDisinfection: {
        method: "soapy_wash_and_disinfection",
        agent: "medical_toy_disinfectant",
        requiresImmediateDisinfection: true,
        protocol: "Silikonball nach Gebrauch heiß abseifen und mit Toy-Cleaner desinfizieren; Lederriemen trocken nachpolieren."
      }
    },
    {
      id: "toy_ring_gag_metal",
      name: "Offener Metall-Ringknebel (Ring Gag)",
      category: "sensory",
      restraintLayer: 0,
      stimulusVector: {
        primaryType: "forced_jaw_abduction_open",
        intensityRange: [2, 4],
        sensoryContact: "polished_steel_ring"
      },
      affordances: {
        occupiesZones: ["head_mouth", "jaw_temporomandibular"],
        blocksFaculties: {
          speech_articulation: true,         // Worte undeutlich (nur Vokale)
          jaw_closure: true,                 // Zubeißen unmöglich
          oral_licking_service: false,       // ZUNGE FREI! Cunnilingus/Oralservice möglich!
          tongue_mobility_external: false,
          active_penetration: false
        },
        enablesFaculties: {
          receptive_oral_access: true,
          unrestricted_tongue_service: true, // Erlaubt Ausführung von Oralservice
          drool_drainage_unobstructed: true
        }
      },
      compatibleTargetZones: [
        { zone: "head_mouth", effect: "open_oral_service_mandate", maxSafeMinutes: 30 }
      ],
      stackingCompatibility: { canLayerOver: [], canConnectTo: ["collar_d_ring"] },
      careAndDisinfection: {
        method: "spray_and_wipe",
        agent: "isopropanol_70",
        requiresImmediateDisinfection: true,
        protocol: "Metallring vollständig mit Isopropanol desinfizieren und trocknen."
      }
    },
    {
      id: "toy_gag_dildo_external",
      name: "Dildo-Knebel mit Außenphallus",
      category: "sensory",
      restraintLayer: 0,
      stimulusVector: {
        primaryType: "oral_anchored_phallic_extension",
        intensityRange: [3, 5],
        sensoryContact: "silicone_phallus_rigid_mount"
      },
      affordances: {
        occupiesZones: ["head_mouth", "jaw_temporomandibular"],
        blocksFaculties: {
          speech_articulation: true,
          tongue_mobility_external: true,
          oral_licking_service: true
        },
        enablesFaculties: {
          active_penetration: true,          // SCHALTET AKTIVE PENETRATION DURCH DEN BOTTOM FREI!
          penetration_target_zones: ["vaginal", "anal", "oral_of_partner"],
          head_driven_thrust_motion: true
        }
      },
      compatibleTargetZones: [
        { zone: "head_mouth", effect: "phallic_mouth_harnessing", maxSafeMinutes: 25 }
      ],
      stackingCompatibility: { canLayerOver: [], canConnectTo: [] },
      careAndDisinfection: {
        method: "double_disinfection",
        agent: "antibacterial_silicone_cleaner",
        requiresImmediateDisinfection: true,
        protocol: "Sowohl Mundstück als auch Außenphallus sofort nach Session intensiv abwaschen und desinfizieren!"
      }
    },

    // =========================================================================
    // KATEGORIE: KEUSCHHEIT, KÄFIGE & SCHLÖSSER (PHYSICAL INTEGRATION)
    // =========================================================================
    {
      id: "toy_chastity_cobra",
      name: "Kink3D Cobra (SLS-Nylon)",
      category: "chastity",
      restraintLayer: 0,
      stimulusVector: {
        primaryType: "circumferential_tumescence_barrier",
        intensityRange: [2, 5],
        sensoryContact: "laser_sintered_pa12"
      },
      affordances: {
        occupiesZones: ["genital_penis_shaft", "genital_glans", "genital_scrotum_base"],
        blocksFaculties: {
          penile_erection: true,
          manual_masturbation: true,
          coital_penetration_by_bottom: true
        },
        enablesFaculties: {
          urological_voiding_standing: true, // Urinieren durch Waben möglich
          external_cage_vibration: true,
          longterm_wear_compliance: true
        }
      },
      compatibleTargetZones: [
        { zone: "genital_penis", effect: "continuous_erection_prevention", maxSafeDays: 90 }
      ],
      stackingCompatibility: {
        canLayerUnder: ["toy_clothing_corset", "toy_clothing_leather_collar"],
        canConnectTo: ["toy_chastity_seals_numbered"]
      },
      careAndDisinfection: {
        method: "daily_saline_flush",
        agent: "sterile_saline_or_ph_neutral_soap",
        requiresImmediateDisinfection: false,
        protocol: "Tägliche urologische Spülung der Kammer mit stumpfer Spritze gegen Mazeration."
      }
    },
    {
      id: "toy_chastity_cherrykeeper",
      name: "Cherrykeeper Micro Stub (<= 35mm)",
      category: "chastity",
      restraintLayer: 0,
      stimulusVector: {
        primaryType: "extreme_axial_shaft_compression",
        intensityRange: [3, 5],
        sensoryContact: "compact_pa12_or_resin"
      },
      affordances: {
        occupiesZones: ["genital_penis_shaft", "genital_glans", "genital_scrotum_base"],
        blocksFaculties: {
          penile_erection: true,
          manual_masturbation: true,
          coital_penetration_by_bottom: true,
          shaft_retraction_motion: true
        },
        enablesFaculties: {
          absolute_zero_tumescence_guarantee: true,
          stealth_suit_discretion: true
        }
      },
      compatibleTargetZones: [
        { zone: "genital_penis", effect: "maximal_inversion_compression", maxSafeDays: 60 }
      ],
      stackingCompatibility: {
        canLayerUnder: [],
        canConnectTo: ["toy_chastity_seals_numbered"]
      },
      careAndDisinfection: {
        method: "mandatory_daily_syringe_flush",
        agent: "warm_water_and_antiseptic_rinse",
        requiresImmediateDisinfection: false,
        protocol: "Zwingende tägliche Spülung des engen Eichelspalts zur Balanitis-Vermeidung."
      }
    },
    {
      id: "toy_chastity_jailbird",
      name: "Mature Metal Jailbird (Edelstahl 316L)",
      category: "chastity",
      restraintLayer: 0,
      stimulusVector: {
        primaryType: "gravitational_rigid_containment",
        intensityRange: [2, 5],
        sensoryContact: "heavy_cold_surgical_steel",
        weightGrams: 195
      },
      affordances: {
        occupiesZones: ["genital_penis_shaft", "genital_glans", "genital_scrotum_base"],
        blocksFaculties: {
          penile_erection: true,
          manual_masturbation: true,
          coital_penetration_by_bottom: true
        },
        enablesFaculties: {
          thermal_ambient_adaptation: true,
          weight_sensitisation_drop: true
        }
      },
      compatibleTargetZones: [
        { zone: "genital_penis", effect: "heavy_metallic_containment", maxSafeDays: 30 }
      ],
      stackingCompatibility: {
        canLayerUnder: [],
        canConnectTo: ["toy_chastity_seals_numbered", "padlock"]
      },
      careAndDisinfection: {
        method: "autoclave_or_alcohol_bath",
        agent: "isopropanol_70",
        requiresImmediateDisinfection: true,
        protocol: "Vollständig desinfektionsmittelbeständig; Gewinde regelmäßig fetten."
      }
    },
    {
      id: "toy_chastity_belt_female",
      name: "Weiblicher Keuschheitsgürtel (Shield)",
      category: "chastity",
      restraintLayer: 0,
      stimulusVector: {
        primaryType: "pelvic_shield_barrier",
        intensityRange: [2, 5],
        sensoryContact: "curved_steel_silicone_edge"
      },
      affordances: {
        occupiesZones: ["genital_vulva_clitoris", "genital_labia", "pelvis_waist"],
        blocksFaculties: {
          clitoral_self_stimulation: true,
          vaginal_insertion_unauthorized: true
        },
        enablesFaculties: {
          ritual_keyholder_authority: true
        }
      },
      compatibleTargetZones: [
        { zone: "genital_vulva", effect: "clitoral_access_denial", maxSafeDays: 14 }
      ],
      stackingCompatibility: { canLayerUnder: [], canConnectTo: ["padlock"] },
      careAndDisinfection: {
        method: "silicone_edge_sanitation",
        agent: "antibacterial_cleanser",
        requiresImmediateDisinfection: true,
        protocol: "Silikonkanten täglich trocken wischen; Hautfalten auf Rötung prüfen."
      }
    },
    {
      id: "toy_chastity_seals_numbered",
      name: "Nummerierte Sicherheits-Einwegplomben",
      category: "chastity",
      restraintLayer: 0,
      stimulusVector: {
        primaryType: "tamper_evident_psychological_seal",
        intensityRange: [1, 2],
        sensoryContact: "plastic_serial_coded"
      },
      affordances: {
        occupiesZones: ["cage_locking_pin"],
        blocksFaculties: {
          stealth_removal_without_trace: true
        },
        enablesFaculties: {
          verification_photo_check: true
        }
      },
      compatibleTargetZones: [],
      stackingCompatibility: { canLayerOver: [], canConnectTo: [] },
      careAndDisinfection: {
        method: "disposable",
        agent: "none",
        requiresImmediateDisinfection: false,
        protocol: "Vor dem Durchtrennen Seriennummer im Protokoll abgleichen."
      }
    },

    // =========================================================================
    // KATEGORIE: CBT, GENITALE REIZE & ELEKTRO/VIBRATION
    // =========================================================================
    {
      id: "toy_ball_stretcher_silicone",
      name: "Silikon-Hodenstretcher (Ball Stretcher)",
      category: "cbt",
      restraintLayer: 0,
      stimulusVector: {
        primaryType: "gravitational_downward_traction",
        intensityRange: [2, 4],
        sensoryContact: "weighted_stretching_silicone"
      },
      affordances: {
        occupiesZones: ["genital_scrotum_neck"],
        blocksFaculties: {
          cremasteric_testicular_retraction: true
        },
        enablesFaculties: {
          isolated_testicular_vulnerability: true
        }
      },
      compatibleTargetZones: [
        { zone: "genital_scrotum", effect: "constant_downward_pull", maxSafeMinutes: 180 }
      ],
      stackingCompatibility: {
        canLayerUnder: ["toy_chastity_cobra", "toy_chastity_jailbird"],
        canConnectTo: []
      },
      careAndDisinfection: {
        method: "soapy_water_wash",
        agent: "mild_soap",
        requiresImmediateDisinfection: true,
        protocol: "Handwarm reinigen; bei Kältegefühl im Hoden sofort entfernen."
      }
    },
    {
      id: "toy_nipple_clamps_alligator",
      name: "Krokodil-Brustwarzenklammern mit Kette",
      category: "cbt",
      restraintLayer: 0,
      stimulusVector: {
        primaryType: "focal_screw_adjusted_pinch_compression",
        intensityRange: [2, 5],
        sensoryContact: "rubber_coated_steel_teeth"
      },
      affordances: {
        occupiesZones: ["chest_nipples", "genital_scrotum_skin", "genital_labia"],
        blocksFaculties: {},
        enablesFaculties: {
          traction_chain_linking: true // Kette kann an Halsband oder Gewichte gekoppelt werden
        }
      },
      compatibleTargetZones: [
        { zone: "chest_nipples", effect: "intense_ischemic_firing", maxSafeMinutes: 30 },
        { zone: "genital_scrotum_skin", effect: "testicular_traction_sting", maxSafeMinutes: 20 },
        { zone: "genital_labia", effect: "vulvar_pinch_engorgement", maxSafeMinutes: 20 },
        { zone: "thighs_inner", effect: "inner_thigh_pinch_warning", maxSafeMinutes: 15 }
      ],
      stackingCompatibility: {
        canConnectTo: ["toy_clothing_leather_collar", "wrist_cuffs"]
      },
      careAndDisinfection: {
        method: "wipe",
        agent: "isopropanol_wipe",
        requiresImmediateDisinfection: true,
        protocol: "Gummikappen nach Gebrauch mit Alkoholtuch abwischen; Stellschraube säubern."
      }
    },
    {
      id: "toy_wand_vibrator",
      name: "Kabelgebundener Magic Wand",
      category: "cbt",
      restraintLayer: 0,
      stimulusVector: {
        primaryType: "deep_amplitude_mechanical_vibration",
        intensityRange: [2, 5],
        sensoryContact: "broad_soft_silicone_sphere"
      },
      affordances: {
        occupiesZones: [],
        blocksFaculties: {},
        enablesFaculties: {
          transcutaneous_cage_stimulation: true, // Übertragung durch das Gitter
          clitoral_plateau_rush: true,
          frenzied_edge_induction: true
        }
      },
      compatibleTargetZones: [
        { zone: "genital_clitoris", effect: "rapid_orgasmic_plateau", maxSafeMinutes: 20 },
        { zone: "genital_penis_caged", effect: "intractable_frustration_teasing", maxSafeMinutes: 15 },
        { zone: "perineum", effect: "pelvic_floor_resonator", maxSafeMinutes: 20 }
      ],
      stackingCompatibility: { canLayerOver: [], canConnectTo: [] },
      careAndDisinfection: {
        method: "wipe_silicone_head",
        agent: "toy_disinfection_foam",
        requiresImmediateDisinfection: true,
        protocol: "Silikonkopf nach jedem Einsatz desinfizieren; Gerät niemals ins Wasser tauchen."
      }
    },

    // =========================================================================
    // KATEGORIE: ANALEROTIK, PROSTATA & PEGGING
    // =========================================================================
    {
      id: "toy_anal_plug_jeweled",
      name: "Schmuck-Analplug mit Kristallbasis",
      category: "anal",
      restraintLayer: 0,
      stimulusVector: {
        primaryType: "radial_sphincter_dilation_fullness",
        intensityRange: [1, 4],
        sensoryContact: "mirror_polished_metal_or_silicone"
      },
      affordances: {
        occupiesZones: ["anorectal_canal"],
        blocksFaculties: {
          anal_evacuation: true
        },
        enablesFaculties: {
          constant_internal_fullness: true,
          visual_jeweled_presentation: true
        }
      },
      compatibleTargetZones: [
        { zone: "anorectal_canal", effect: "constant_anchored_stretching", maxSafeMinutes: 120 }
      ],
      stackingCompatibility: { canLayerOver: [], canConnectTo: [] },
      careAndDisinfection: {
        method: "intensive_wash_and_disinfection",
        agent: "antibacterial_soap_and_spray",
        requiresImmediateDisinfection: true,
        protocol: "Sofort nach Entnahme mit reichlich Seife und warmem Wasser säubern, danach vollständig desinfizieren!"
      }
    },
    {
      id: "toy_prostate_massager",
      name: "Ergonomischer Prostata-Stimulator (P-Spot)",
      category: "anal",
      restraintLayer: 0,
      stimulusVector: {
        primaryType: "focal_anterior_rectal_pressure",
        intensityRange: [2, 5],
        sensoryContact: "anatomical_curved_silicone"
      },
      affordances: {
        occupiesZones: ["anorectal_canal", "prostate_anterior_wall"],
        blocksFaculties: {},
        enablesFaculties: {
          nonejaculatory_prostate_climax: true, // Schaltet Orgasmus ohne Ejakulation im Käfig frei
          pelvic_deep_orgasmic_pulse: true
        }
      },
      compatibleTargetZones: [
        { zone: "anorectal_prostate", effect: "deep_visceral_ecstasy", maxSafeMinutes: 45 }
      ],
      stackingCompatibility: { canLayerOver: [], canConnectTo: [] },
      careAndDisinfection: {
        method: "intensive_wash_and_disinfection",
        agent: "medical_toy_cleaner",
        requiresImmediateDisinfection: true,
        protocol: "Gründliche Reinigung mit antibakterieller Seife und warmem Wasser; trocken lagern."
      }
    },
    {
      id: "toy_strap_on_harness",
      name: "Strap-On Harness mit Dildo-Adapter (Pegging)",
      category: "anal",
      restraintLayer: 1,
      stimulusVector: {
        primaryType: "active_penetrative_tool",
        intensityRange: [2, 5],
        sensoryContact: "rigid_waist_harnessed_shaft"
      },
      affordances: {
        occupiesZones: ["pelvis_waist", "pelvis_groin"],
        blocksFaculties: {},
        enablesFaculties: {
          female_dominant_penetration: true, // Herrin dringt aktiv in Partner ein
          variable_depth_thrusting: true
        }
      },
      compatibleTargetZones: [
        { zone: "anorectal_canal", effect: "dominant_receptive_submission", maxSafeMinutes: 60 },
        { zone: "vaginal_canal", effect: "penetrative_intimacy", maxSafeMinutes: 60 }
      ],
      stackingCompatibility: { canLayerOver: [], canConnectTo: [] },
      careAndDisinfection: {
        method: "separate_harness_and_dildo",
        agent: "dildo_disinfectant_and_strap_wipe",
        requiresImmediateDisinfection: true,
        protocol: "Dildo-Aufsatz separat intensiv reinigen und desinfizieren; Textilriemen des Geschirrs lüften."
      }
    },

    // =========================================================================
    // KATEGORIE: PFLEGE, HYGIENE, REVERSE AFTERCARE & RACK-WERKZEUGE
    // =========================================================================
    {
      id: "toy_irrigation_syringe",
      name: "Urologische Spülspritze (Balanitis-Schutz)",
      category: "care",
      restraintLayer: 0,
      stimulusVector: {
        primaryType: "fluid_hydrodynamic_flush",
        intensityRange: [1, 2],
        sensoryContact: "blunt_cannula_saline"
      },
      affordances: {
        occupiesZones: [],
        blocksFaculties: {},
        enablesFaculties: {
          in_situ_chastity_cleansing: true // Spült Käfig ohne Entriegelung
        }
      },
      compatibleTargetZones: [
        { zone: "genital_glans_caged", effect: "maceration_prevention", maxSafeMinutes: 10 }
      ],
      stackingCompatibility: { canLayerOver: [], canConnectTo: [] },
      careAndDisinfection: {
        method: "saline_flush",
        agent: "boiled_water_or_sterile_saline",
        requiresImmediateDisinfection: true,
        protocol: "Nach jedem Spülgang mit abgekochtem Wasser durchspülen und trocken verwahren."
      }
    },
    {
      id: "toy_weighted_blanket",
      name: "Schwere Therapiedecke (Gewichtsdecke)",
      category: "care",
      restraintLayer: 1,
      stimulusVector: {
        primaryType: "diffuse_deep_touch_pressure_dtp",
        intensityRange: [1, 3],
        sensoryContact: "uniform_8kg_quilted_glass_beads"
      },
      affordances: {
        occupiesZones: ["full_body_dorsal_or_ventral"],
        blocksFaculties: {
          rapid_locomotion: true // Sanfte Erdschwere
        },
        enablesFaculties: {
          parasympathetic_vagus_activation: true, // Beruhigt Kältezittern und Subdrop
          proprioceptive_grounding: true
        }
      },
      compatibleTargetZones: [
        { zone: "full_body", effect: "vagus_nerve_stabilisation", maxSafeMinutes: 120 }
      ],
      stackingCompatibility: { canLayerOver: [], canConnectTo: [] },
      careAndDisinfection: {
        method: "cover_wash",
        agent: "standard_laundry",
        requiresImmediateDisinfection: false,
        protocol: "Nach intensiven Schweiß-Sessions den Bezug waschen; Decke regelmäßig lüften."
      }
    },
    {
      id: "toy_massage_oil_neutral",
      name: "Naturreines Jojoba- & Mandel-Massageöl",
      category: "care",
      restraintLayer: 0,
      stimulusVector: {
        primaryType: "friction_reducing_thermal_emollient",
        intensityRange: [1, 2],
        sensoryContact: "warming_viscous_oil"
      },
      affordances: {
        occupiesZones: [],
        blocksFaculties: {},
        enablesFaculties: {
          reverse_aftercare_muscle_release: true, // Bottom massiert den Top
          fascia_soothing: true
        }
      },
      compatibleTargetZones: [
        { zone: "shoulders_neck", effect: "top_mental_load_relief", maxSafeMinutes: 45 },
        { zone: "feet_plantar", effect: "reflexology_grounding", maxSafeMinutes: 30 }
      ],
      stackingCompatibility: { canLayerOver: [], canConnectTo: [] },
      careAndDisinfection: {
        method: "wipe_bottle",
        agent: "dry_cloth",
        requiresImmediateDisinfection: false,
        protocol: "Flasche trocken abwischen; nicht zusammen mit Latexprodukten verwenden (Latexfraß)!"
      }
    },

    // =========================================================================
    // KATEGORIE: FETISCH-GARDEROBE & INSIGNIEN (SOMATISCHE IDENTITÄT)
    // =========================================================================
    {
      id: "toy_clothing_leather_collar",
      name: "Breites Lederkollar mit Führleine",
      category: "clothing",
      restraintLayer: 0, // Basis-Insignie
      stimulusVector: {
        primaryType: "cervical_circumferential_enclosure",
        intensityRange: [1, 3],
        sensoryContact: "lined_saddle_leather_with_dring"
      },
      affordances: {
        occupiesZones: ["neck_cervical"],
        blocksFaculties: {},
        enablesFaculties: {
          directional_lead_guidance: true,
          nipple_chain_attachment_bridge: true // Krokodilklemmen können hier eingehängt werden
        }
      },
      compatibleTargetZones: [
        { zone: "neck_cervical", effect: "ownership_grounding", maxSafeMinutes: 480 }
      ],
      stackingCompatibility: {
        canConnectTo: ["toy_nipple_clamps_alligator", "wrist_cuffs"]
      },
      careAndDisinfection: {
        method: "leather_wipe",
        agent: "antiseptic_leather_care",
        requiresImmediateDisinfection: true,
        protocol: "Innenseite nach dem Tragen desinfizierend abwischen; D-Ring auf Stabilität prüfen."
      }
    },
    {
      id: "toy_clothing_heels",
      name: "Leder-Plateau-Stiefel / High Heels",
      category: "clothing",
      restraintLayer: 0,
      stimulusVector: {
        primaryType: "postural_elevation_and_acoustic_click",
        intensityRange: [1, 3],
        sensoryContact: "patent_leather_high_stilt"
      },
      affordances: {
        occupiesZones: ["top_feet"],
        blocksFaculties: {},
        enablesFaculties: {
          stature_elevation_dominance: true,
          foot_worship_devotion_target: true
        }
      },
      compatibleTargetZones: [
        { zone: "head_eyes_looking_up", effect: "visual_hierarchy_anchoring", maxSafeMinutes: 120 }
      ],
      stackingCompatibility: { canLayerOver: [], canConnectTo: [] },
      careAndDisinfection: {
        method: "leather_polish",
        agent: "leather_wax",
        requiresImmediateDisinfection: false,
        protocol: "Absätze und Leder nach Session sauber polieren."
      }
    },
    {
      id: "toy_clothing_corset",
      name: "Stahlverstärktes Schnürkorsett",
      category: "clothing",
      restraintLayer: 0,
      stimulusVector: {
        primaryType: "torso_visceral_circumferential_compression",
        intensityRange: [2, 4],
        sensoryContact: "steel_boned_heavy_satin"
      },
      affordances: {
        occupiesZones: ["torso_lumbar_waist"],
        blocksFaculties: {
          torso_flexion_slouching: true // Krümmung der Wirbelsäule blockiert -> aufrechte Haltung erzwungen
        },
        enablesFaculties: {
          diaphragmatic_breath_focus: true,
          aesthetic_rigidity_posture: true
        }
      },
      compatibleTargetZones: [
        { zone: "torso_waist", effect: "uncompromising_upright_posture", maxSafeMinutes: 240 }
      ],
      stackingCompatibility: { canLayerOver: [], canConnectTo: [] },
      careAndDisinfection: {
        method: "airing_out",
        agent: "dry_clean_only",
        requiresImmediateDisinfection: false,
        protocol: "Nach dem Tragen vollständig trocken lüften; Schnürschnüre auf Abrieb prüfen."
      }
    }
  ];

  window.equipmentCatalog = equipmentCatalog;

})(window);
