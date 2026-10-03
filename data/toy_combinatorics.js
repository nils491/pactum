/**
 * data/toy_combinatorics.js
 * TACTUS Kinetische DoF-Matrix, Multiplikatives Dämpfungsmodell & Substitutions-Intelligenz (V3.0 Haute-Horlogerie)
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien nach Master-Roadbook:
 * - 100 % UTF-8 Integrität: Echte deutsche Umlaute (ä, ö, ü, ß) im gesamten Modul
 * - 10 somatische Freiheitsgrad-Achsen im Einheitsintervall [0.0, 1.0]
 * - Multiplikatives Dämpfungsmodell für kumulatives Ausrüstungs-Layering
 * - Automatische Machbarkeits- und Konfliktprüfung (validateActionFeasibility)
 * - Substitutions-Intelligenz: Automatische Umwandlung von blockierten Handlungen
 *   (z. B. Klopfen statt Mitzählen bei Knebelung; Stirnlage statt Handabstützung bei Monohandschuh)
 * - Bereitstellung an window.ToyCombinatorics sowie CommonJS-Export
 */

(function(window) {
  'use strict';

  // =========================================================================
  // 1. DIE 10 SOMATISCHEN FREIHEITSGRAD-ACHSEN (DoF)
  // =========================================================================
  const SOMATIC_AXES = {
    speech_articulation: {
      id: 'speech_articulation',
      label: 'Verbale Sprachartikulation',
      description: 'Fähigkeit zu verständlicher Lautbildung, lauter Zählung und gesprochenem Sprechen.',
      defaultValue: 1.0,
      minSafeThreshold: 0.0 // Kann vollständig blockiert sein (Knebel)
    },
    tongue_mobility_external: {
      id: 'tongue_mobility_external',
      label: 'Externe Zungenbeweglichkeit',
      description: 'Fähigkeit, mit der Zunge oral zu lecken oder Gegenstände zu erkunden.',
      defaultValue: 1.0,
      minSafeThreshold: 0.0
    },
    nasal_breathing: {
      id: 'nasal_breathing',
      label: 'Freie Nasenatmung',
      description: 'Ungehinderter Luftstrom durch die Nasenwege (RACK-Schutzachse).',
      defaultValue: 1.0,
      minSafeThreshold: 0.8 // RACK-Invariante: Darf NIEMALS gefährlich gedrosselt werden!
    },
    manual_manipulation: {
      id: 'manual_manipulation',
      label: 'Manuelle Handlungsfähigkeit',
      description: 'Fähigkeit der Hände zu greifen, sich abzustützen oder Gegenstände zu führen.',
      defaultValue: 1.0,
      minSafeThreshold: 0.0 // 0.0 bei Monohandschuh oder Fesseln am Rücken
    },
    locomotion_standing: {
      id: 'locomotion_standing',
      label: 'Aufrechtes Stehen & Gehen',
      description: 'Mobilität der Beine für aufrechten Stand, Schrittfolgen und freie Drehung.',
      defaultValue: 1.0,
      minSafeThreshold: 0.0
    },
    visual_perception: {
      id: 'visual_perception',
      label: 'Visuelle Wahrnehmung',
      description: 'Fähigkeit des Sehens, Erkennens von Gesten und Raumorientierung.',
      defaultValue: 1.0,
      minSafeThreshold: 0.0 // 0.0 bei blickdichten Masken oder Augenbinden
    },
    pelvic_thrust_active: {
      id: 'pelvic_thrust_active',
      label: 'Aktive Beckenmobilität',
      description: 'Möglichkeit des Beckens zu aktiven Ausweich-, Reit- oder Stoßbewegungen.',
      defaultValue: 1.0,
      minSafeThreshold: 0.0
    },
    penile_shaft_access: {
      id: 'penile_shaft_access',
      label: 'Zugänglichkeit des Penisschafts',
      description: 'Möglichkeit direkten manuellen Schwellkörper- und Hautkontakts am Glied.',
      defaultValue: 1.0,
      minSafeThreshold: 0.0 // 0.0 bei peniler Keuschheit (Cobra, Mature Metal)
    },
    clitoral_access: {
      id: 'clitoral_access',
      label: 'Zugänglichkeit der Klitoris',
      description: 'Möglichkeit direkter taktiler Reizung der Klitoris und Vulva.',
      defaultValue: 1.0,
      minSafeThreshold: 0.0
    },
    anal_access: {
      id: 'anal_access',
      label: 'Zugänglichkeit des Rektums',
      description: 'Freiheit des Analbereichs für Penetration, Plugs oder Tastung.',
      defaultValue: 1.0,
      minSafeThreshold: 0.0 // 0.0 wenn bereits ein fester Plug getragen wird
    }
  };

  // =========================================================================
  // 2. SUBSTITUTIONS-KATALOG (SUBSTITUTION INTELLIGENCE)
  // =========================================================================
  const SUBSTITUTION_RULES = {
    speech_blocked: {
      axis: 'speech_articulation',
      threshold: 0.05,
      conflictTitle: 'Sprachartikulation durch Knebelung gesperrt',
      conflictMessage: 'Das Motiv verlangt lautes Sprechen oder Mitzählen, der Partner trägt jedoch einen Knebel.',
      substitutions: [
        {
          id: 'subst_tap_knuckles',
          type: 'counting_alternative',
          title: 'Klopfen mit den Fingerknöcheln',
          instruction: 'Der Bottom quittiert jeden Schlag durch deutliches, rhythmisches Klopfen mit den Fingerknöcheln auf die Bettkante.',
          quoteAdaptation: '„Du zählst nicht mit Worten. Jeder Treffer wird mit einem klaren Klopfen auf das Holz quittiert.“'
        },
        {
          id: 'subst_nod_head',
          type: 'affirmation_alternative',
          title: 'Deutliches Kopfnicken / Augenschließen',
          instruction: 'Bestätigung von Befehlen erfolgt durch ein langsames, andächtiges Senken und Heben des Kopfes.',
          quoteAdaptation: '„Ein Nicken genügt mir als Antwort. Ich sehe deine Hingabe in deinen Augen.“'
        }
      ]
    },

    shaft_blocked: {
      axis: 'penile_shaft_access',
      threshold: 0.05,
      conflictTitle: 'Direkter Penisschaft-Zugriff durch Keuschheitskäfig gesperrt',
      conflictMessage: 'Die Handlung erfordert Schaftberührung oder Handjob, der Penis ist jedoch fest verriegelt.',
      substitutions: [
        {
          id: 'subst_grid_vibration',
          type: 'stimulation_alternative',
          title: 'Vibrations-Reizung von außen über die Gitterstäbe',
          instruction: 'Ein starkes Vibro-Toy wird fest an das Metall oder SLS-Nylon der Eichelkammer gepresst; der Reiz überträgt sich vollflächig.',
          quoteAdaptation: '„Dein Schaft bleibt unberührt. Spüre, wie das Metall die Vibrationen direkt an deine Nerven leitet.“'
        },
        {
          id: 'subst_prostate_redirection',
          type: 'stimulation_alternative',
          title: 'Reizverlagerung auf Prostata & Damm (P-Spot)',
          instruction: 'Der Schaft bleibt gesperrt; die sexuelle Stimulation wird vollständig auf die innere Prostata oder Damm-Akupressur verlagert.',
          quoteAdaptation: '„Vorne bleibst du verschlossen. Deine Lust holen wir uns heute ausschließlich von innen.“'
        }
      ]
    },

    hands_blocked: {
      axis: 'manual_manipulation',
      threshold: 0.05,
      conflictTitle: 'Manuelle Abstützung durch Armfesselung unmöglich',
      conflictMessage: 'Die Position verlangt Abstützen mit den Händen an Wand oder Möbeln, beide Arme sind jedoch arretiert.',
      substitutions: [
        {
          id: 'subst_forehead_lean',
          type: 'posture_alternative',
          title: 'Stirnlage als primärer Balance-Anker',
          instruction: 'Die Stirn wird fest an das Holz der Bettkante oder die Wand gelehnt; der Rumpf balanciert rein über Rumpfspannung und Füße.',
          quoteAdaptation: '„Lehne die Stirn fest an das Holz. Du brauchst keine Hände, um Haltung zu bewahren.“'
        },
        {
          id: 'subst_chest_cushion',
          type: 'posture_alternative',
          title: 'Unterlegkissen unter dem Brustkorb',
          instruction: 'Ein festes Kissen stützt den Brustkorb in Bauchlage ab, um Schulterüberdehnung bei rückwärtiger Fesselung zu verhindern.',
          quoteAdaptation: '„Lass dein Gewicht ruhig in das Kissen sinken. Die Hände bleiben reglos am Rücken.“'
        }
      ]
    },

    locomotion_blocked: {
      axis: 'locomotion_standing',
      threshold: 0.05,
      conflictTitle: 'Aufrechtes Stehen durch Beinarretierung gesperrt',
      conflictMessage: 'Die Handlung erfordert aufrechten Stand oder Gehen, die Beine sind jedoch gespreizt oder gefesselt.',
      substitutions: [
        {
          id: 'subst_kneeling_spread',
          type: 'posture_alternative',
          title: 'Geöffneter Fersensitz / Kniestand',
          instruction: 'Die Position wird vom Stand in einen stabilen Kniestand mit geöffneten Knien auf weicher Unterlage überführt.',
          quoteAdaptation: '„Du bleibst am Boden. Bleib auf deinen Knien und halte mir dein Becken dar.“'
        }
      ]
    },

    vision_blocked: {
      axis: 'visual_perception',
      threshold: 0.05,
      conflictTitle: 'Sichtkontrolle durch Augenbinde / Maske ausgeschaltet',
      conflictMessage: 'Die Handlung verlangt Augenkontakt (Soul Gazing) oder Spiegelbetrachtung, der Partner ist jedoch blind.',
      substitutions: [
        {
          id: 'subst_tactile_whisper',
          type: 'sensory_alternative',
          title: 'Auditive und taktile Berührungsführung',
          instruction: 'Blickkontakt wird durch warmes Flüstern direkt an die Ohrmuschel und eine Hand flach am Hals ersetzt.',
          quoteAdaptation: '„Du siehst mich nicht, aber du spürst meinen Atem an deiner Wange. Höre auf meine Stimme.“'
        }
      ]
    }
  };

  // =========================================================================
  // 3. MULTIPLIKATIVES DÄMPFUNGS-MODELL
  // =========================================================================
  /**
   * Berechnet den 10-dimensionalen Vektor der verbleibenden Freiheitsgrade
   * basierend auf den aktiven Ausrüstungsgegenständen.
   * 
   * Mathematisches Modell:
   * DoF_gesamt(Achse) = Produkt aller dofImpact(Toy_k, Achse)
   * 
   * @param {Array} activeToys - Array von Toy-Objekten oder Toy-IDs
   * @returns {Object} { dof: { [axisId]: number }, restrictedAxes: [], safetyWarnings: [] }
   */
  function calculateDegreesOfFreedom(activeToys) {
    const resolvedToys = resolveToyObjects(activeToys);
    
    // Initialisierung aller 10 Achsen mit 1.0 (vollkommen frei)
    const dofVector = {};
    for (const axisKey in SOMATIC_AXES) {
      dofVector[axisKey] = SOMATIC_AXES[axisKey].defaultValue;
    }

    const safetyWarnings = [];
    const restrictedAxes = [];

    // Multiplikative Dämpfung für jedes aktive Werkzeug
    resolvedToys.forEach(toy => {
      if (!toy || !toy.dofImpact || typeof toy.dofImpact !== 'object') return;

      for (const axis in toy.dofImpact) {
        if (dofVector[axis] !== undefined) {
          const factor = Math.max(0.0, Math.min(1.0, parseFloat(toy.dofImpact[axis]) || 0.0));
          dofVector[axis] = Math.round((dofVector[axis] * factor) * 1000) / 1000;
        }
      }
    });

    // Prüfung gegen Schwellenwerte und RACK-Schutz
    for (const axis in dofVector) {
      const currentVal = dofVector[axis];
      const axisMeta = SOMATIC_AXES[axis];

      if (currentVal < 0.95) {
        restrictedAxes.push({
          axis: axis,
          label: axisMeta ? axisMeta.label : axis,
          value: currentVal
        });
      }

      // RACK-Notfallwarnung wenn Nasenatmung gefährdet ist
      if (axis === 'nasal_breathing' && currentVal < (axisMeta.minSafeThreshold || 0.8)) {
        safetyWarnings.push({
          axis: axis,
          severity: 'critical',
          message: 'KRITISCHER RACK-SICHERHEITSALARM: Nasenatmung ist anatomisch gefährdet! Knebel oder Maske sofort lockern.'
        });
      }
    }

    return {
      dof: dofVector,
      restrictedAxes: restrictedAxes,
      safetyWarnings: safetyWarnings
    };
  }

  // =========================================================================
  // 4. MACHBARKEITS- UND KONFLIKTPRÜFUNG (VALIDATE ACTION FEASIBILITY)
  // =========================================================================
  /**
   * Prüft, ob ein geplantes Motiv oder eine Regie-Aktion mit den aktuell
   * angelegten Werkzeugen physisch ausführbar ist.
   * 
   * @param {Object} actionDescriptor - { title, somaticZone, tags, requiresSpeech, requiresShaftContact, ... }
   * @param {Array} activeToys - Array von Toy-Objekten oder Toy-IDs
   * @returns {Object} { feasible: boolean, conflicts: [], substitutions: [] }
   */
  function validateActionFeasibility(actionDescriptor, activeToys) {
    if (!actionDescriptor) {
      return { feasible: true, conflicts: [], substitutions: [] };
    }

    const dofResult = calculateDegreesOfFreedom(activeToys);
    const dof = dofResult.dof;
    const conflicts = [];
    const substitutions = [];

    const titleLower = (actionDescriptor.title || '').toLowerCase();
    const descLower = (actionDescriptor.desc || '').toLowerCase();
    const zone = actionDescriptor.somaticZone || '';
    const tags = actionDescriptor.tags || [];

    // 1. Prüfung Sprachblockade
    const requiresSpeech = actionDescriptor.requiresSpeech || 
                           titleLower.includes('zählen') || 
                           titleLower.includes('mitsprechen') || 
                           titleLower.includes('appell') || 
                           descLower.includes('laut mitzählen');

    if (requiresSpeech && dof.speech_articulation <= SUBSTITUTION_RULES.speech_blocked.threshold) {
      conflicts.push({
        ruleKey: 'speech_blocked',
        axis: 'speech_articulation',
        message: SUBSTITUTION_RULES.speech_blocked.conflictMessage
      });
      substitutions.push(...SUBSTITUTION_RULES.speech_blocked.substitutions);
    }

    // 2. Prüfung Penisschaft-Kontakt
    const requiresShaft = actionDescriptor.requiresShaftContact || 
                          titleLower.includes('edging') || 
                          titleLower.includes('handjob') || 
                          titleLower.includes('schaft') || 
                          (zone === 'genital_penile' && (titleLower.includes('streicheln') || titleLower.includes('reiben')));

    if (requiresShaft && dof.penile_shaft_access <= SUBSTITUTION_RULES.shaft_blocked.threshold) {
      conflicts.push({
        ruleKey: 'shaft_blocked',
        axis: 'penile_shaft_access',
        message: SUBSTITUTION_RULES.shaft_blocked.conflictMessage
      });
      substitutions.push(...SUBSTITUTION_RULES.shaft_blocked.substitutions);
    }

    // 3. Prüfung manuelle Handlungsfähigkeit (Abstützen)
    const requiresHands = actionDescriptor.requiresHands || 
                          titleLower.includes('abstützen') || 
                          titleLower.includes('an die wand stützen') || 
                          descLower.includes('hände an die wand');

    if (requiresHands && dof.manual_manipulation <= SUBSTITUTION_RULES.hands_blocked.threshold) {
      conflicts.push({
        ruleKey: 'hands_blocked',
        axis: 'manual_manipulation',
        message: SUBSTITUTION_RULES.hands_blocked.conflictMessage
      });
      substitutions.push(...SUBSTITUTION_RULES.hands_blocked.substitutions);
    }

    // 4. Prüfung Gehen & freier Stand
    const requiresStanding = actionDescriptor.requiresStanding || 
                             titleLower.includes('gehen') || 
                             titleLower.includes('schreiten') || 
                             titleLower.includes('parcours');

    if (requiresStanding && dof.locomotion_standing <= SUBSTITUTION_RULES.locomotion_blocked.threshold) {
      conflicts.push({
        ruleKey: 'locomotion_blocked',
        axis: 'locomotion_standing',
        message: SUBSTITUTION_RULES.locomotion_blocked.conflictMessage
      });
      substitutions.push(...SUBSTITUTION_RULES.locomotion_blocked.substitutions);
    }

    // 5. Prüfung Sichtkontakt
    const requiresVision = actionDescriptor.requiresVision || 
                           titleLower.includes('augenkontakt') || 
                           titleLower.includes('soul gazing') || 
                           titleLower.includes('spiegelbetrachtung');

    if (requiresVision && dof.visual_perception <= SUBSTITUTION_RULES.vision_blocked.threshold) {
      conflicts.push({
        ruleKey: 'vision_blocked',
        axis: 'visual_perception',
        message: SUBSTITUTION_RULES.vision_blocked.conflictMessage
      });
      substitutions.push(...SUBSTITUTION_RULES.vision_blocked.substitutions);
    }

    return {
      feasible: conflicts.length === 0,
      conflicts: conflicts,
      substitutions: substitutions,
      dofVector: dof,
      safetyWarnings: dofResult.safetyWarnings
    };
  }

  // =========================================================================
  // 5. HYPERDYNAMISCHE TEXT-SUBSTITUTION (SUBSTITUTE INSTRUCTION)
  // =========================================================================
  /**
   * Formuliert Regietexte und Zuchtanweisungen in Echtzeit so um, dass
   * physisch blockierte Handlungen durch kinetisch korrekte Alternativen
   * ersetzt werden.
   * 
   * @param {string} originalInstruction - Die ursprüngliche Regieanweisung
   * @param {Array} activeToys - Array der aktiven Werkzeuge
   * @returns {string} Die kinetisch korrigierte Anweisung
   */
  function substituteInstruction(originalInstruction, activeToys) {
    if (!originalInstruction || typeof originalInstruction !== 'string') return '';
    
    const dofResult = calculateDegreesOfFreedom(activeToys);
    const dof = dofResult.dof;
    let text = originalInstruction;

    // Mund geknebelt: Mitzählen durch Klopfen ersetzen
    if (dof.speech_articulation <= 0.05) {
      text = text.replace(/zählt laut mit/gi, 'quittiert jeden Schlag durch deutliches Klopfen auf die Bettkante (Mund geknebelt)');
      text = text.replace(/laut mitzählen/gi, 'durch Klopfen mit den Fingerknöcheln quittieren (Mund geknebelt)');
      text = text.replace(/antwortet mit 'Ja'/gi, 'quittiert durch andächtiges Kopfnicken (Mund geknebelt)');
      text = text.replace(/zählen/gi, 'durch Klopfsignale quittieren');
    }

    // Hände am Rücken geschnürt: Abstützen ersetzen
    if (dof.manual_manipulation <= 0.05) {
      text = text.replace(/stützt sich mit den Händen ab/gi, 'lehnt die Stirn am Holz der Bettkante an (Hände arretiert)');
      text = text.replace(/hände an der wand/gi, 'Stirn fest an die Wand gelehnt (Arme am Rücken geschnürt)');
      text = text.replace(/hält sich fest/gi, 'hält die Rumpfspannung ohne Abstützung');
    }

    // Schaft verriegelt: Direkten Kontakt ersetzen
    if (dof.penile_shaft_access <= 0.05) {
      text = text.replace(/streichelt den schaft/gi, 'drückt den Vibrator von außen an die Gitterstäbe (Käfig verriegelt)');
      text = text.replace(/penis mit der hand/gi, 'Reizung über Damm und Gitterstäbe (Käfig verriegelt)');
    }

    return text;
  }

  // =========================================================================
  // 6. HELPER & RESOLVER
  // =========================================================================
  function resolveToyObjects(toyList) {
    if (!Array.isArray(toyList)) return [];

    let catalog = [];
    if (window.EquipmentCatalog && typeof window.EquipmentCatalog.getAll === 'function') {
      catalog = window.EquipmentCatalog.getAll();
    }

    const resolved = [];
    toyList.forEach(item => {
      if (typeof item === 'object' && item !== null && item.dofImpact) {
        resolved.push(item);
      } else if (typeof item === 'string') {
        const found = catalog.find(c => c.id === item);
        if (found) resolved.push(found);
      }
    });

    return resolved;
  }

  function getRecommendedSubstitutions(conflictKey) {
    const rule = SUBSTITUTION_RULES[conflictKey];
    return rule ? rule.substitutions : [];
  }

  const api = {
    calculateDegreesOfFreedom: calculateDegreesOfFreedom,
    validateActionFeasibility: validateActionFeasibility,
    substituteInstruction: substituteInstruction,
    getRecommendedSubstitutions: getRecommendedSubstitutions,
    axes: SOMATIC_AXES,
    rules: SUBSTITUTION_RULES
  };

  window.ToyCombinatorics = api;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

})(typeof window !== 'undefined' ? window : this);
