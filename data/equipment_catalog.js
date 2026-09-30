/**
 * data/equipment_catalog.js
 * TACTUS Somatischer Hardware-, Affordanz- & Reizvektoren-Katalog (V3.0 Hyper-Dynamisch)
 * Offizielle Web-Praesenz: tactus.digital
 * 
 * Standards & Garantien:
 * - Semantisches Tag- & Zonen-Matching (tags <-> equipmentTags aus questions_part1/part2)
 * - Partner-Zuweisung & Passform-Profile (assignedToPartner: 'A'|'B'|'mutual' & fitProfile)
 * - Somatische DoF- und Affordanz-Profile (blocksFaculties, enablesFaculties, restraintLayer)
 * - RACK-Materialerkennung & Desinfektions-Protokolle fuer die Reverse Aftercare
 * - Dynamische Custom-Toy Registrierung & Persistenz (tactus_custom_equipment)
 * - 100 % frei von infantilen System-Emojis in Datenstrukturen
 * - Keine window.alert() / window.confirm() Aufrufe unter keinen Umstaenden
 */

(function(window) {
  'use strict';

  const STORAGE_CUSTOM_EQUIPMENT = 'tactus_custom_equipment';
  const STORAGE_CUSTOM_EQUIPMENT_LEGACY = 'kompass_custom_equipment';

  const DYNAMIC_BASE_CATALOG = [
    // --- BONDAGE & SEILE (LAYER 0 - 2) ---
    {
      id: 'toy_jute_rope_6mm',
      name: 'Shibari Juteseil (6mm weich geoelt)',
      category: 'bondage',
      somaticZone: 'full_body',
      restraintLayer: 1,
      materials: ['jute', 'natural_oil'],
      tags: ['rope', 'shibari', 'bondage'],
      assignedToPartner: 'mutual',
      fitProfile: {
        sizeGrade: 'universal',
        isAdjustable: true,
        lengthMeters: 8,
        diameterMm: 6
      },
      affordanceProfile: {
        restraintLayer: 1,
        blocksFaculties: {
          manual_manipulation: true,
          locomotion_standing: false
        },
        enablesFaculties: {
          suspension_partial: true
        },
        safetyProtocol: {
          requiresShears: true,
          disinfectionMethod: 'dry_brushing_and_airing',
          maxContinuousMinutes: 45
        },
        somaticEffect: 'Gleichmaessiger Dehnungsdruck ueber Faszienketten; wohlige Waerme.'
      }
    },
    {
      id: 'toy_leather_cuffs_wrists',
      name: 'Gepolsterte Leder-Handgelenksmanschetten',
      category: 'bondage',
      somaticZone: 'limbs_wrists_hands',
      restraintLayer: 0,
      materials: ['leather', 'shearling', 'steel'],
      tags: ['cuffs', 'leather_gear', 'bondage'],
      assignedToPartner: 'mutual',
      fitProfile: {
        sizeGrade: 'universal',
        isAdjustable: true,
        minCm: 14,
        maxCm: 23
      },
      affordanceProfile: {
        restraintLayer: 0,
        blocksFaculties: {
          manual_manipulation: true
        },
        safetyProtocol: {
          requiresShears: false,
          disinfectionMethod: 'antiseptic_leather_spray',
          maxContinuousMinutes: 120
        },
        somaticEffect: 'Breite Druckverteilung zur Schonung des Nervus radialis.'
      }
    },
    {
      id: 'toy_leather_cuffs_ankles',
      name: 'Gepolsterte Leder-Fussgelenksmanschetten',
      category: 'bondage',
      somaticZone: 'limbs_ankles_feet',
      restraintLayer: 0,
      materials: ['leather', 'shearling', 'steel'],
      tags: ['cuffs', 'leather_gear', 'bondage'],
      assignedToPartner: 'mutual',
      fitProfile: {
        sizeGrade: 'universal',
        isAdjustable: true,
        minCm: 18,
        maxCm: 30
      },
      affordanceProfile: {
        restraintLayer: 0,
        blocksFaculties: {
          locomotion_standing: true
        },
        safetyProtocol: {
          requiresShears: false,
          disinfectionMethod: 'antiseptic_leather_spray',
          maxContinuousMinutes: 120
        },
        somaticEffect: 'Sichere Arretierung der Beine ohne Abschnuerungen.'
      }
    },
    {
      id: 'toy_leather_collar_narrow',
      name: 'Enges Glattleder-Halsband mit O-Ring',
      category: 'bondage',
      somaticZone: 'neck_cervical',
      restraintLayer: 0,
      materials: ['leather', 'steel'],
      tags: ['collar', 'leather_gear'],
      assignedToPartner: 'B',
      fitProfile: {
        sizeGrade: 'S',
        circumferenceCm: 34,
        isAdjustable: true,
        minCm: 31,
        maxCm: 36
      },
      affordanceProfile: {
        restraintLayer: 0,
        blocksFaculties: {},
        enablesFaculties: {
          leash_attachment: true
        },
        safetyProtocol: {
          requiresShears: false,
          disinfectionMethod: 'antiseptic_leather_spray',
          maxContinuousMinutes: 180
        },
        somaticEffect: 'Physischer Fuehrungsanker an der Halswirbelsaeule; Demutsfokus.'
      }
    },
    {
      id: 'toy_spreader_bar_rigid',
      name: 'Teleskop-Spreizstange mit Schnellverschluessen',
      category: 'bondage',
      somaticZone: 'limbs_ankles_feet',
      restraintLayer: 1,
      materials: ['steel', 'aluminium'],
      tags: ['spreader_bar', 'bondage'],
      assignedToPartner: 'mutual',
      fitProfile: {
        sizeGrade: 'universal',
        isAdjustable: true,
        minCm: 50,
        maxCm: 85
      },
      affordanceProfile: {
        restraintLayer: 1,
        blocksFaculties: {
          locomotion_standing: true,
          pelvic_thrust_active: true
        },
        safetyProtocol: {
          requiresShears: false,
          disinfectionMethod: 'isopropanol_wipe',
          maxContinuousMinutes: 30
        },
        somaticEffect: 'Erzwungene Beizung und Weitung des Beckens; absolute Exposition.'
      }
    },

    // --- IMPACT & ZUCHT ---
    {
      id: 'toy_leather_flogger',
      name: 'Schwerer Rindleder-Flogger (40 Fransen)',
      category: 'impact',
      somaticZone: 'gluteal_pelvis',
      restraintLayer: null,
      materials: ['leather'],
      tags: ['flogger', 'leather_paddle', 'impact'],
      assignedToPartner: 'mutual',
      fitProfile: {
        sizeGrade: 'universal',
        isAdjustable: false,
        weightGrams: 420
      },
      affordanceProfile: {
        blocksFaculties: {},
        safetyProtocol: {
          requiresShears: false,
          disinfectionMethod: 'antiseptic_leather_spray',
          maxContinuousMinutes: 40
        },
        somaticEffect: 'Flaechige, dumpfe Hitzewellen; tiefe kutane Durchblutung (Hyperaemie).'
      }
    },
    {
      id: 'toy_leather_paddle_wide',
      name: 'Breites Sattelleder-Paddle (doppelt gelegt)',
      category: 'impact',
      somaticZone: 'gluteal_pelvis',
      restraintLayer: null,
      materials: ['leather'],
      tags: ['paddle', 'leather_paddle', 'impact'],
      assignedToPartner: 'mutual',
      fitProfile: {
        sizeGrade: 'universal',
        isAdjustable: false,
        weightGrams: 280
      },
      affordanceProfile: {
        blocksFaculties: {},
        safetyProtocol: {
          requiresShears: false,
          disinfectionMethod: 'antiseptic_leather_spray',
          maxContinuousMinutes: 20
        },
        somaticEffect: 'Tiefer, trockener Schmerzreiz mit hoher akustischer Resonanz.'
      }
    },
    {
      id: 'toy_riding_crop_slender',
      name: 'Schlanke Dressur-Reitgerte (Crop mit Lederklatsche)',
      category: 'impact',
      somaticZone: 'thighs_inner',
      restraintLayer: null,
      materials: ['fibreglass', 'leather'],
      tags: ['crop', 'impact'],
      assignedToPartner: 'mutual',
      fitProfile: {
        sizeGrade: 'universal',
        isAdjustable: false,
        lengthCm: 65
      },
      affordanceProfile: {
        blocksFaculties: {},
        safetyProtocol: {
          requiresShears: false,
          disinfectionMethod: 'antiseptic_leather_spray',
          maxContinuousMinutes: 15
        },
        somaticEffect: 'Praeziser, stechender Reiz auf Schenkelinnenseiten und Waden.'
      }
    },
    {
      id: 'toy_heavy_leather_belt',
      name: 'Schwerer Sattelleder-Guertel',
      category: 'impact',
      somaticZone: 'gluteal_pelvis',
      restraintLayer: null,
      materials: ['leather', 'brass'],
      tags: ['leather_belt', 'impact'],
      assignedToPartner: 'mutual',
      fitProfile: {
        sizeGrade: 'universal',
        isAdjustable: true,
        widthMm: 40
      },
      affordanceProfile: {
        blocksFaculties: {},
        safetyProtocol: {
          requiresShears: false,
          disinfectionMethod: 'antiseptic_leather_spray',
          maxContinuousMinutes: 20
        },
        somaticEffect: 'Klassischer rhythmischer Hitzereiz bei Vorbeuge.'
      }
    },

    // --- SENSORIK & KNEBEL ---
    {
      id: 'toy_blindfold_silk',
      name: 'Lichtdichte Seiden-Augenbinde mit Gummizug',
      category: 'sensory',
      somaticZone: 'head_eyes',
      restraintLayer: 0,
      materials: ['silk', 'foam'],
      tags: ['blindfold', 'sensory'],
      assignedToPartner: 'mutual',
      fitProfile: {
        sizeGrade: 'universal',
        isAdjustable: true
      },
      affordanceProfile: {
        restraintLayer: 0,
        blocksFaculties: {
          visual_perception: true
        },
        safetyProtocol: {
          requiresShears: false,
          disinfectionMethod: 'mild_soap_handwash',
          maxContinuousMinutes: 90
        },
        somaticEffect: 'Vollstaendiger Sichtentzug; verstaerkt taktile Wahrnehmung und Gehoer.'
      }
    },
    {
      id: 'toy_leather_hood_padded',
      name: 'Gepolsterte Glattleder-Kopfhaube mit Schnuerung',
      category: 'sensory',
      somaticZone: 'head_face',
      restraintLayer: 1,
      materials: ['leather', 'steel'],
      tags: ['mask', 'hood', 'leather_gear'],
      assignedToPartner: 'B',
      fitProfile: {
        sizeGrade: 'M',
        circumferenceCm: 56,
        isAdjustable: true,
        minCm: 54,
        maxCm: 58
      },
      affordanceProfile: {
        restraintLayer: 1,
        blocksFaculties: {
          visual_perception: true
        },
        safetyProtocol: {
          requiresShears: true,
          disinfectionMethod: 'antiseptic_leather_spray',
          maxContinuousMinutes: 45
        },
        somaticEffect: 'Akustische und visuelle Isolation; tiefe Selbstaufgabe im Raum.'
      }
    },
    {
      id: 'toy_ring_gag_steel',
      name: 'Offener Metall-Ringknebel (45mm Innendurchmesser)',
      category: 'sensory',
      somaticZone: 'head_mouth',
      restraintLayer: 0,
      materials: ['steel', 'leather'],
      tags: ['gag', 'ring_gag'],
      assignedToPartner: 'mutual',
      fitProfile: {
        sizeGrade: 'M',
        circumferenceCm: 4.5,
        isAdjustable: true
      },
      affordanceProfile: {
        restraintLayer: 0,
        blocksFaculties: {
          speech_articulation: true
        },
        enablesFaculties: {
          oral_access_passive: true,
          tongue_mobility_external: true
        },
        safetyProtocol: {
          requiresShears: false,
          disinfectionMethod: 'boiling_or_isopropanol',
          maxContinuousMinutes: 35
        },
        somaticEffect: 'Erzwingt geoeffnete Mundhaltung bei erhaltener Zungenbeweglichkeit.'
      }
    },
    {
      id: 'toy_silicone_ball_gag',
      name: 'Silikon-Ballknebel (42mm Kugel mit Atemloechern)',
      category: 'sensory',
      somaticZone: 'head_mouth',
      restraintLayer: 0,
      materials: ['silicone', 'leather'],
      tags: ['gag', 'ball_gag'],
      assignedToPartner: 'mutual',
      fitProfile: {
        sizeGrade: 'M',
        circumferenceCm: 4.2,
        isAdjustable: true
      },
      affordanceProfile: {
        restraintLayer: 0,
        blocksFaculties: {
          speech_articulation: true,
          tongue_mobility_external: true
        },
        safetyProtocol: {
          requiresShears: false,
          disinfectionMethod: 'boiling_or_isopropanol',
          maxContinuousMinutes: 30
        },
        somaticEffect: 'Vollstaendige Sprachblockade und Speichelanregung; Hilflosigkeit.'
      }
    },

    // --- KEUSCHHEIT & CBT ---
    {
      id: 'toy_chastity_cherrykeeper',
      name: 'Cherrykeeper Micro Stub (<= 35mm)',
      category: 'chastity',
      somaticZone: 'genital_penis',
      restraintLayer: 0,
      materials: ['nylon_sls', 'brass_lock'],
      tags: ['chastity_cage', 'penis_cherrykeeper'],
      anatomyGuard: 'penis',
      assignedToPartner: 'B',
      fitProfile: {
        sizeGrade: 'S',
        ringDiameterMm: 44,
        cageLengthMm: 35,
        isAdjustable: false
      },
      affordanceProfile: {
        restraintLayer: 0,
        blocksFaculties: {
          penile_shaft_access: true,
          erection_expansion: true
        },
        safetyProtocol: {
          requiresShears: false,
          disinfectionMethod: 'isopropanol_soak',
          maxContinuousMinutes: 10080 // bis zu 7 Tage mit Spuelungen
        },
        somaticEffect: 'Permanenter mechanischer Eirektionsstopp; anatomische Ruhe.'
      }
    },
    {
      id: 'toy_chastity_cobra',
      name: 'Kink3D Cobra (SLS-Nylon Belueftet)',
      category: 'chastity',
      somaticZone: 'genital_penis',
      restraintLayer: 0,
      materials: ['nylon_sls'],
      tags: ['chastity_cage', 'penis_cobra'],
      anatomyGuard: 'penis',
      assignedToPartner: 'B',
      fitProfile: {
        sizeGrade: 'M',
        ringDiameterMm: 46,
        cageLengthMm: 55,
        isAdjustable: false
      },
      affordanceProfile: {
        restraintLayer: 0,
        blocksFaculties: {
          penile_shaft_access: true,
          erection_expansion: true
        },
        safetyProtocol: {
          requiresShears: false,
          disinfectionMethod: 'isopropanol_soak',
          maxContinuousMinutes: 10080
        },
        somaticEffect: 'Leichtes, atmungsaktives Tragegefuehl fuer den Alltag.'
      }
    },
    {
      id: 'toy_security_seals',
      name: 'Nummerierte Sicherheits-Einwegplomben (10x)',
      category: 'chastity',
      somaticZone: 'genital_penis',
      restraintLayer: 0,
      materials: ['polypropylene'],
      tags: ['security_seals', 'lock'],
      assignedToPartner: 'mutual',
      fitProfile: {
        sizeGrade: 'universal',
        isAdjustable: false
      },
      affordanceProfile: {
        blocksFaculties: {},
        safetyProtocol: {
          disinfectionMethod: 'single_use_sterile'
        },
        somaticEffect: 'Visuelle und psychologische Unversehrtheitsgarantie fuer den Top.'
      }
    },
    {
      id: 'toy_cbt_alligator_clamps',
      name: 'Krokodilklemmen mit Raendelschraube & Silikonhuelle',
      category: 'cbt',
      somaticZone: 'chest_nipples',
      restraintLayer: null,
      materials: ['steel', 'silicone'],
      tags: ['clamps', 'cbt'],
      assignedToPartner: 'mutual',
      fitProfile: {
        sizeGrade: 'universal',
        isAdjustable: true
      },
      affordanceProfile: {
        blocksFaculties: {},
        safetyProtocol: {
          requiresShears: false,
          disinfectionMethod: 'isopropanol_wipe',
          maxContinuousMinutes: 20
        },
        somaticEffect: 'Fokussierter Druck- und Zugreiz auf erogene Rezeptorzonen.'
      }
    },
    {
      id: 'toy_wartenberg_wheel',
      name: 'Wartenberg-Nadelrad (Sensorisches Prickelrad)',
      category: 'sensory',
      somaticZone: 'back_flanks',
      restraintLayer: null,
      materials: ['steel'],
      tags: ['wartenberg_wheel', 'sensory'],
      assignedToPartner: 'mutual',
      fitProfile: {
        sizeGrade: 'universal',
        isAdjustable: false
      },
      affordanceProfile: {
        blocksFaculties: {},
        safetyProtocol: {
          requiresShears: false,
          disinfectionMethod: 'isopropanol_immersion',
          maxContinuousMinutes: 30
        },
        somaticEffect: 'Intensives metallisches Prickeln ohne Schaedigung der Epidermis.'
      }
    },

    // --- PFLEGE, HYGIENE & RACK-NOTFALL ---
    {
      id: 'toy_irrigation_syringe',
      name: 'Urologische 50ml-Spuelspritze mit Knopfkanuele',
      category: 'care',
      somaticZone: 'genital_penis',
      restraintLayer: null,
      materials: ['polypropylene', 'medical_steel'],
      tags: ['irrigation_syringe', 'care'],
      assignedToPartner: 'mutual',
      fitProfile: {
        sizeGrade: 'universal',
        isAdjustable: false,
        volumeMl: 50
      },
      affordanceProfile: {
        blocksFaculties: {},
        safetyProtocol: {
          disinfectionMethod: 'boiling_water_rinse'
        },
        somaticEffect: 'Vollstaendige Entfernung von Urinresiduenz; Mazerationsschutz.'
      }
    },
    {
      id: 'toy_emt_shears',
      name: 'EMT-Sicherheits-Verbandschere (RACK Notfall)',
      category: 'care',
      somaticZone: 'full_body',
      restraintLayer: null,
      materials: ['hardened_steel', 'polymer'],
      tags: ['emt_shears', 'care'],
      assignedToPartner: 'mutual',
      fitProfile: {
        sizeGrade: 'universal',
        isAdjustable: false
      },
      affordanceProfile: {
        blocksFaculties: {},
        safetyProtocol: {
          disinfectionMethod: 'isopropanol_wipe'
        },
        somaticEffect: 'Garantierte Trennung aller Seilverbindungen in unter 5 Sekunden.'
      }
    },
    {
      id: 'toy_weighted_blanket_8kg',
      name: 'Schwere 8kg-Therapie-Gewichtsdecke',
      category: 'care',
      somaticZone: 'full_body',
      restraintLayer: null,
      materials: ['cotton', 'glass_beads'],
      tags: ['weighted_blanket', 'care'],
      assignedToPartner: 'mutual',
      fitProfile: {
        sizeGrade: 'universal',
        weightKg: 8
      },
      affordanceProfile: {
        blocksFaculties: {},
        safetyProtocol: {
          disinfectionMethod: 'uv_airing_and_washable_cover'
        },
        somaticEffect: 'Propriozeptiver Tiefendruck; stoppt Kaeltezittern und beruhigt das ZNS.'
      }
    }
  ];

  function loadCustomEquipment() {
    try {
      const raw = localStorage.getItem(STORAGE_CUSTOM_EQUIPMENT) || 
                  localStorage.getItem(STORAGE_CUSTOM_EQUIPMENT_LEGACY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (e) {
      console.warn('[TACTUS Catalog] Fehler beim Laden von custom_equipment:', e);
    }
    return [];
  }

  function saveCustomEquipment(list) {
    try {
      const serialized = JSON.stringify(list);
      localStorage.setItem(STORAGE_CUSTOM_EQUIPMENT, serialized);
      localStorage.setItem(STORAGE_CUSTOM_EQUIPMENT_LEGACY, serialized);
    } catch (e) {
      console.warn('[TACTUS Catalog] Fehler beim Sichern von custom_equipment:', e);
    }

    if (window.CloudSync && typeof window.CloudSync.trigger === 'function') {
      window.CloudSync.trigger();
    }
  }

  function getAllCatalogItems() {
    const customList = loadCustomEquipment();
    const seen = new Set();
    const combined = [];

    // 1. Basiskatalog
    DYNAMIC_BASE_CATALOG.forEach(item => {
      if (item && item.id && !seen.has(item.id)) {
        seen.add(item.id);
        combined.push(Object.assign({}, item));
      }
    });

    // 2. Eigene Anschaffungen
    customList.forEach(item => {
      if (item && item.id && !seen.has(item.id)) {
        seen.add(item.id);
        combined.push(Object.assign({}, item, { isCustom: true }));
      }
    });

    return combined;
  }

  function getItemById(id) {
    if (!id) return null;
    const all = getAllCatalogItems();
    return all.find(item => item.id === id) || null;
  }

  function registerCustomItem(itemData) {
    if (!itemData || !itemData.name) {
      throw new Error('Name fuer das Ausruestungsstueck erforderlich.');
    }

    const customList = loadCustomEquipment();
    const cleanId = itemData.id || `custom_toy_${Date.now()}`;
    const autoTags = Array.isArray(itemData.tags) ? itemData.tags.slice() : [];

    // Automatische semantische Tags ableiten
    if (itemData.category && !autoTags.includes(itemData.category)) {
      autoTags.push(itemData.category);
    }
    const nameLower = itemData.name.toLowerCase();
    if (nameLower.includes('knebel') || nameLower.includes('gag')) {
      if (!autoTags.includes('gag')) autoTags.push('gag');
    }
    if (nameLower.includes('halsband') || nameLower.includes('collar')) {
      if (!autoTags.includes('collar')) autoTags.push('collar');
    }
    if (nameLower.includes('kaefig') || nameLower.includes('cage')) {
      if (!autoTags.includes('chastity_cage')) autoTags.push('chastity_cage');
    }
    if (nameLower.includes('seil') || nameLower.includes('rope')) {
      if (!autoTags.includes('rope')) autoTags.push('rope');
    }
    if (nameLower.includes('maske') || nameLower.includes('haube')) {
      if (!autoTags.includes('mask')) autoTags.push('mask');
    }

    const newItem = {
      id: cleanId,
      name: itemData.name.trim(),
      category: itemData.category || 'sensory',
      somaticZone: itemData.somaticZone || 'full_body',
      restraintLayer: itemData.restraintLayer !== undefined ? itemData.restraintLayer : 0,
      materials: Array.isArray(itemData.materials) ? itemData.materials : ['synthetic'],
      tags: autoTags,
      assignedToPartner: itemData.assignedToPartner || 'mutual',
      fitProfile: itemData.fitProfile || { sizeGrade: 'universal', isAdjustable: true },
      affordanceProfile: itemData.affordanceProfile || {
        blocksFaculties: {},
        safetyProtocol: {
          disinfectionMethod: 'isopropanol_wipe'
        }
      },
      isCustom: true,
      createdAt: Date.now()
    };

    const existingIdx = customList.findIndex(c => c.id === cleanId);
    if (existingIdx !== -1) {
      customList[existingIdx] = newItem;
    } else {
      customList.push(newItem);
    }

    saveCustomEquipment(customList);
    return newItem;
  }

  /**
   * Filtert Ausruestung nach Passform fuer den aktuellen Traeger/Bottom.
   * Wenn ein Halsband Lisa ('A') gehoert, darf Nils ('B') es nicht tragen muessen.
   */
  function filterByPartnerFit(items, recipientPartnerRole) {
    if (!Array.isArray(items)) return [];
    if (!recipientPartnerRole) return items.slice();

    return items.filter(item => {
      const assigned = item.assignedToPartner;
      if (!assigned || assigned === 'mutual') return true;
      return assigned === recipientPartnerRole;
    });
  }

  /**
   * Prueft, ob ein Gegenstand zu einer Liste von semantischen Tags aus dem Fragebogen passt.
   */
  function matchesEquipmentTags(item, queryTags) {
    if (!item || !Array.isArray(queryTags) || queryTags.length === 0) return true;
    const itemTags = Array.isArray(item.tags) ? item.tags : [];
    const itemCategory = item.category ? [item.category] : [];
    const pool = new Set([...itemTags, ...itemCategory]);

    for (let i = 0; i < queryTags.length; i++) {
      if (pool.has(queryTags[i])) return true;
    }
    return false;
  }

  function getDisinfectionProtocols(itemIds) {
    if (!Array.isArray(itemIds) || itemIds.length === 0) return [];
    const all = getAllCatalogItems();
    const protocols = [];

    const METHOD_TRANSLATIONS = {
      isopropanol_wipe: 'Mit 70% Isopropanol-Tuechern abreiben und trocknen lassen',
      isopropanol_soak: 'Vollstaendig fuer 10 Minuten in 70% Isopropanol einlegen',
      isopropanol_immersion: 'Kurz in Isopropanol tauchen und an der Luft trocknen',
      boiling_or_isopropanol: 'In kochendem Wasser abkochen (5 Min.) oder mit Isopropanol desinfizieren',
      boiling_water_rinse: 'Mit heissem Wasser durchspuelen und trocken lagern',
      antiseptic_leather_spray: 'Mit speziellem antiseptischen Leder-Hygienebalsam duenn einreiben',
      dry_brushing_and_airing: 'Mit fester Buerste trocken ausbuersten und an der Luft auslueften',
      mild_soap_handwash: 'Handwaesche mit milder, pH-neutraler Seife und flach trocknen',
      uv_airing_and_washable_cover: 'Bezug waschen; Inlett lueften und aufschuetteln',
      single_use_sterile: 'Einweg-Gegenstand: Nach Oeffnung fachgerecht entsorgen'
    };

    itemIds.forEach(id => {
      const item = all.find(it => it.id === id);
      if (item && item.affordanceProfile && item.affordanceProfile.safetyProtocol) {
        const protoKey = item.affordanceProfile.safetyProtocol.disinfectionMethod || 'isopropanol_wipe';
        protocols.push({
          itemId: item.id,
          name: item.name,
          methodKey: protoKey,
          method: METHOD_TRANSLATIONS[protoKey] || 'Mit feuchtem Desinfektionstuch gruendlich reinigen',
          materials: item.materials || []
        });
      }
    });

    return protocols;
  }

  const api = {
    getAll: getAllCatalogItems,
    getById: getItemById,
    getByCategory: (category) => getAllCatalogItems().filter(it => it.category === category),
    getByTag: (tag) => getAllCatalogItems().filter(it => (it.tags || []).includes(tag)),
    matchesTags: matchesEquipmentTags,
    filterByPartnerFit: filterByPartnerFit,
    getDisinfectionProtocols: getDisinfectionProtocols,
    registerCustomItem: registerCustomItem,
    getBaseCatalog: () => DYNAMIC_BASE_CATALOG.slice()
  };

  window.EquipmentCatalog = api;
  // Abwaertskompatibler Alias
  window.equipmentCatalog = api.getAll();

})(window);
