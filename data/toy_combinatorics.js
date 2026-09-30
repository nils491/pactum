/**
 * data/toy_combinatorics.js
 * TACTUS Somatische Topologie-, DoF- & Kombinatorik-Engine (V3.0 Hyper-Dynamisch)
 * Offizielle Web-Praesenz: tactus.digital
 * 
 * Standards & Garantien:
 * - 10-Achsen Freiheitsgrad-Matrix (DoF in [0.0, 1.0]) mit multiplikativem Daempfungsmodell
 * - 3-Schichten Restraint-Stacking (Layer 0: Basismanschetten, Layer 1: Lagefesselung, Layer 2: Umweltkopplung)
 * - Partner-Passform-Validierung (assignedToPartner & fitProfile Abgleich)
 * - Semantische Konfliktpruefung voellig unabhaengig von starren Toy-IDs (funktioniert fuer alle KI-Toys)
 * - Dynamische Substitutions-Direktiven (z. B. Klopfsignale bei Knebelung, P-Spot bei Keuschheit)
 * - Anatomisches Zonen-Shifting fuer Reizwerkzeuge unter Beachtung des anatomyGuard
 * - 100 % frei von infantilen System-Emojis in Datenstrukturen
 * - Keine window.alert() / window.confirm() Aufrufe unter keinen Umstaenden
 */

(function(window) {
  'use strict';

  // 10 Fundamentale somatische Faehigkeits- und Freiheitsgrad-Achsen
  const DEFAULT_DEGREES_OF_FREEDOM = {
    speech_articulation: 1.0,      // Verbale Artikulation & Sprechen
    tongue_mobility_external: 1.0, // Zungenbeweglichkeit nach aussen (Lecken)
    nasal_breathing: 1.0,          // Unbehinderte Nasenatmung
    manual_manipulation: 1.0,      // Finger- & Handeinsatz (Greifen, Abstuetzen)
    locomotion_standing: 1.0,      // Aufrechtes Stehen & Gehen
    visual_perception: 1.0,        // Visuelle Wahrnehmung (Sehen)
    pelvic_thrust_active: 1.0,     // Aktives Gegenstossen des Beckens
    penile_shaft_access: 1.0,      // Direkter Beruehrungszugang zum Penisschaft
    clitoral_access: 1.0,          // Direkter Beruehrungszugang zur Klitoris
    anal_access: 1.0               // Rektaler Zugang (Penetration / Plugs)
  };

  /**
   * Anatomische Zonen-Hierarchie fuer kreatives Reiz-Shifting.
   * Gibt an, auf welche Ausweichzonen ein Reizvektor verlagert werden kann.
   */
  const ANATOMICAL_ZONE_TOPOLOGY = {
    chest_nipples: ['chest_nipples', 'thighs_inner', 'back_flanks', 'cutaneous_skin'],
    gluteal_pelvis: ['gluteal_pelvis', 'thighs_inner', 'back_flanks', 'cutaneous_skin'],
    thighs_inner: ['thighs_inner', 'gluteal_pelvis', 'limbs_ankles_feet', 'cutaneous_skin'],
    back_flanks: ['back_flanks', 'gluteal_pelvis', 'thighs_inner', 'cutaneous_skin'],
    genital_penis: ['genital_penis', 'perineum_pelvic_floor', 'rectum_prostate'],
    genital_scrotum: ['genital_scrotum', 'perineum_pelvic_floor', 'thighs_inner'],
    genital_vulva_clitoris: ['genital_vulva_clitoris', 'perineum_pelvic_floor', 'thighs_inner'],
    rectum_prostate: ['rectum_prostate', 'perineum_pelvic_floor'],
    limbs_ankles_feet: ['limbs_ankles_feet', 'thighs_inner', 'cutaneous_skin'],
    limbs_wrists_hands: ['limbs_wrists_hands', 'cutaneous_skin'],
    head_face: ['head_face', 'neck_cervical', 'cutaneous_skin'],
    head_mouth: ['head_mouth', 'neck_cervical'],
    head_eyes: ['head_eyes', 'head_face'],
    neck_cervical: ['neck_cervical', 'head_face', 'back_flanks'],
    full_body: ['full_body', 'cutaneous_skin', 'gluteal_pelvis', 'back_flanks']
  };

  /**
   * Berechnet den aktuellen Freiheitsgrad-Zustand (DoF in [0.0, 1.0])
   * aus einer Liste aktiver Ausruestungsgegenstaende.
   * Verwendet das multiplikative Daempfungsmodell:
   * DoF = Produkt(1 - Blockadegrad_i)
   */
  function calculateDegreesOfFreedom(activeItems, recipientPartnerRole = null) {
    const dofState = Object.assign({}, DEFAULT_DEGREES_OF_FREEDOM);
    const layerStack = { layer0: [], layer1: [], layer2: [] };
    const blockedDetails = {};

    if (!Array.isArray(activeItems) || activeItems.length === 0) {
      return {
        dof: dofState,
        stack: layerStack,
        isFullyUnrestricted: true,
        blockedDetails: blockedDetails
      };
    }

    // 1. Partner-Passform Vorfilterung:
    // Gegenstaende, die dem aktuellen Traeger nicht passen, ueben keine Restriktion aus
    let applicableItems = activeItems;
    if (recipientPartnerRole && window.EquipmentCatalog && typeof window.EquipmentCatalog.filterByPartnerFit === 'function') {
      applicableItems = window.EquipmentCatalog.filterByPartnerFit(activeItems, recipientPartnerRole);
    }

    applicableItems.forEach(item => {
      if (!item) return;

      const profile = item.affordanceProfile || item.somaticProfile || {};
      const layer = item.restraintLayer !== undefined ? item.restraintLayer : (profile.restraintLayer !== undefined ? profile.restraintLayer : null);

      if (layer === 0) layerStack.layer0.push(item);
      else if (layer === 1) layerStack.layer1.push(item);
      else if (layer === 2) layerStack.layer2.push(item);

      // Multiplikative DoF-Daempfung
      const blocks = profile.blocksFaculties || {};
      for (const facultyKey in blocks) {
        if (!blocks.hasOwnProperty(facultyKey)) continue;
        if (dofState[facultyKey] === undefined) continue;

        const isBlocked = blocks[facultyKey];
        const attenuationFactor = (isBlocked === true) ? 1.0 : (typeof isBlocked === 'number' ? Math.max(0.0, Math.min(1.0, isBlocked)) : 0.0);

        dofState[facultyKey] = Math.max(0.0, dofState[facultyKey] * (1.0 - attenuationFactor));

        if (attenuationFactor > 0.5) {
          if (!blockedDetails[facultyKey]) blockedDetails[facultyKey] = [];
          blockedDetails[facultyKey].push(item.name || item.id);
        }
      }

      // Spezielle anatomische Sperren ueber Tags
      const tags = item.tags || [];
      if (tags.includes('chastity_cage')) {
        dofState.penile_shaft_access = 0.0;
        if (!blockedDetails.penile_shaft_access) blockedDetails.penile_shaft_access = [];
        blockedDetails.penile_shaft_access.push(item.name || 'Peniskaefig');
      }
      if (tags.includes('chastity_belt')) {
        dofState.clitoral_access = 0.0;
        if (!blockedDetails.clitoral_access) blockedDetails.clitoral_access = [];
        blockedDetails.clitoral_access.push(item.name || 'Keuschheitsguertel');
      }
      if (tags.includes('spreader_bar')) {
        dofState.pelvic_thrust_active = 0.0;
        dofState.locomotion_standing = 0.0;
        dofState.anal_access = 1.0; // Spreizstange exponiert das Perineum und das Rektum
      }
      if (tags.includes('ball_gag') || tags.includes('muzzle_gag')) {
        dofState.speech_articulation = 0.0;
        dofState.tongue_mobility_external = 0.0;
      }
      if (tags.includes('ring_gag')) {
        dofState.speech_articulation = 0.0;
        dofState.tongue_mobility_external = 1.0; // Ringknebel erhaelt Zungenbedienung
      }
      if (tags.includes('blindfold') || tags.includes('hood')) {
        dofState.visual_perception = 0.0;
      }
    });

    const isFullyUnrestricted = Object.values(dofState).every(v => v >= 0.95);

    return {
      dof: dofState,
      stack: layerStack,
      isFullyUnrestricted: isFullyUnrestricted,
      blockedDetails: blockedDetails
    };
  }

  /**
   * Prueft, ob eine geplante somatische Aktion oder ein Motiv
   * physikalisch und anatomisch machbar ist oder ob ein Konflikt vorliegt.
   * Gibt bei Konflikten konkrete Substitutions-Direktiven zurueck.
   */
  function validateActionFeasibility(actionDescriptor, activeItems, recipientPartnerRole = null) {
    if (!actionDescriptor) {
      return { feasible: true, conflicts: [], substitutions: [] };
    }

    const dofResult = calculateDegreesOfFreedom(activeItems, recipientPartnerRole);
    const dof = dofResult.dof;
    const conflicts = [];
    const substitutions = [];

    const reqFaculties = actionDescriptor.requiresFaculties || [];
    const forbiddenFaculties = actionDescriptor.forbiddenFaculties || [];
    const actionTags = actionDescriptor.tags || [];

    // 1. Pruefung der benoetigten Faehigkeiten
    reqFaculties.forEach(fac => {
      if (dof[fac] !== undefined && dof[fac] <= 0.05) {
        conflicts.push({
          type: 'faculty_blocked',
          faculty: fac,
          message: `Faehigkeit '${fac.replace(/_/g, ' ')}' ist durch angelegte Ausruestung gesperrt.`
        });
      }
    });

    // 2. Spezifische somatische Konflikte & Substitutions-Intelligenz
    // A. Mitzählen / Sprache bei Knebelung
    if (actionDescriptor.requiresSpeech || actionTags.includes('count_hits_vocal')) {
      if (dof.speech_articulation <= 0.05) {
        conflicts.push({
          type: 'speech_articulation_conflict',
          message: 'Lautes Mitzählen ist durch Knebelung unmoeglich.'
        });
        substitutions.push({
          type: 'substitute_knocking_directive',
          instruction: 'Bottom quittiert jeden Treffer durch deutliches rhythmisches Klopfen mit der Handflaeche auf die Bettkante.'
        });
      }
    }

    // B. Oralservice / Lecken bei geschlossener Mundbarriere
    if (actionDescriptor.requiresTongue || actionTags.includes('oral_service') || actionTags.includes('cunnilingus')) {
      if (dof.tongue_mobility_external <= 0.05) {
        conflicts.push({
          type: 'tongue_mobility_conflict',
          message: 'Orale Bedienung ist durch geschlossenen Knebel physisch blockiert.'
        });
        substitutions.push({
          type: 'switch_to_ring_gag',
          instruction: 'Tausche den geschlossenen Knebel gegen einen offenen Ringknebel (45mm), um freie Zungenfuehrung zu erlauben.'
        });
      }
    }

    // C. Schwellen-Quälerei am Schaft bei verriegeltem Kaefig
    if (actionDescriptor.requiresShaftContact || actionTags.includes('penile_edging')) {
      if (dof.penile_shaft_access <= 0.05) {
        conflicts.push({
          type: 'chastity_shaft_block',
          message: 'Penisschaft ist verriegelt – direkte Schwellen-Reizung am Schaft unmoeglich.'
        });
        substitutions.push({
          type: 'prostate_or_vibrator_substitution',
          instruction: 'Reizverlagerung: Nutze P-Spot/Prostata-Massage von hinten oder halte den Vibrator von aussen auf das Kaefiggitter.'
        });
      }
    }

    // D. Fesselung & RACK-Notfall-Schere
    const hasRope = activeItems.some(it => (it.tags || []).includes('rope'));
    const hasShears = activeItems.some(it => (it.tags || []).includes('emt_shears'));
    if (hasRope && !hasShears) {
      conflicts.push({
        type: 'rack_safety_missing_shears',
        message: 'RACK-Sicherheitsregel: Seile im Einsatz, aber EMT-Sicherheits-Verbandschere liegt nicht am Bett bereit!'
      });
      substitutions.push({
        type: 'place_emt_shears_ready',
        instruction: 'Lege die EMT-Sicherheits-Verbandschere vor dem ersten Knoten sichtbar auf den Nachttisch.'
      });
    }

    // E. 4-Punkt Fixierung & Hilflosigkeits-Panik (Kapitel 00 RACK-Schranke)
    const hasLimbsBound = dof.manual_manipulation <= 0.05 && dof.locomotion_standing <= 0.05;
    if (hasLimbsBound && actionDescriptor.hasFearRestraint) {
      conflicts.push({
        type: 'rack_trauma_restraint_breach',
        message: 'Psychosomatische Schranke: Vollstaendige Arretierung loest beim Sub Hilflosigkeits-Panik aus.'
      });
      substitutions.push({
        type: 'soften_to_open_cuffs',
        instruction: 'Fixiere nur die Handgelenke vor dem Koerper oder belasse spuerbare Restbeweglichkeit.'
      });
    }

    return {
      feasible: conflicts.length === 0,
      conflicts: conflicts,
      substitutions: substitutions,
      dofSummary: dof
    };
  }

  /**
   * Ermittelt alternative, anatomisch plausible Zonen fuer ein Werkzeug
   * (Kreatives Zonen-Shifting unter Beruecksichtigung des anatomyGuard).
   */
  function getCompatibleZonesForItem(item, recipientAnatomy = 'penis') {
    if (!item) return ['full_body'];

    const primaryZone = item.somaticZone || 'full_body';
    const rawAlternatives = ANATOMICAL_ZONE_TOPOLOGY[primaryZone] || [primaryZone];

    return rawAlternatives.filter(zone => {
      // Anatomie-Schutz
      if (zone === 'genital_penis' || zone === 'genital_scrotum' || zone === 'rectum_prostate') {
        if (recipientAnatomy === 'vulva' && zone !== 'rectum_prostate') return false;
      }
      if (zone === 'genital_vulva_clitoris') {
        if (recipientAnatomy === 'penis') return false;
      }
      return true;
    });
  }

  /**
   * Filtert eine Ausruestungsliste nach Verwendbarkeit fuer die gegebene
   * Anatomie und den Verschluss-Status.
   */
  function filterFeasibleEquipment(items, recipientAnatomy = 'penis', isLocked = false) {
    if (!Array.isArray(items)) return [];

    return items.filter(item => {
      if (!item) return false;

      // 1. Anatomie-Filter
      const guard = item.anatomyGuard;
      if (guard === 'penis' && recipientAnatomy !== 'penis') return false;
      if (guard === 'vulva' && recipientAnatomy !== 'vulva') return false;
      if (guard === 'prostate' && recipientAnatomy !== 'penis') return false;

      // 2. Verschluss-Filter
      const tags = item.tags || [];
      if (isLocked) {
        // Bei verriegeltem Kaefig schliessen wir Schaft-Toys aus, lassen aber Plugs und Impact zu
        if (tags.includes('penis_fleshlight') || tags.includes('penis_masturbator')) return false;
      }

      return true;
    });
  }

  const api = {
    calculateDegreesOfFreedom: calculateDegreesOfFreedom,
    validateActionFeasibility: validateActionFeasibility,
    getCompatibleZonesForItem: getCompatibleZonesForItem,
    filterFeasibleEquipment: filterFeasibleEquipment,
    getDefaultDegreesOfFreedom: () => Object.assign({}, DEFAULT_DEGREES_OF_FREEDOM)
  };

  window.ToyCombinatorics = api;

})(window);
