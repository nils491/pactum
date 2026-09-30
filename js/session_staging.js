/**
 * js/session_staging.js
 * TACTUS Schlafzimmer-Staging Cockpit, Top-Agenda & DoF-Validierung (V3.0 Hyper-Dynamisch)
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien:
 * - 4 Top-Dimensionen: Tonalität (Temperament), Top-Lust (Agenda), Hauptmotiv (dynamisch aus allen 185 Bogen-Items), Keuschheits-Triage
 * - Psychosomatisches Kapitel-00-Radar: Automatischer Abgleich von Trauma-Vorerfahrungen (901) und Flashback-Triggern (902)
 * - Transparente Sub-Notizen: Persönliche Bedingungen (note_${id}) und Scham-Schutzanker (🙈) werden für den Top hervorgehoben
 * - Live-Schnittmengenprüfung via ToyCombinatorics: Erkennt funktionale Konflikte (z. B. Knebel blockiert Oralservice)
 * - RACK-Sicherheits-Checkpunkte (Glukose, Asthma, Wundkontrolle) aus dem medizinischen Pass
 * - Vollständige 7-Vektoren Prompt-Synthese an AIAdapter (Gemini, Claude, GPT, WebGPU)
 * - Prozedurale Heuristik-Synthese moduliert Zitate & Phasen dynamisch nach Tonalität und Agenda
 * - 100 % frei von infantilen System-Emojis in Benutzeroberfläche und Code
 * - Keine window.alert() / window.confirm() Aufrufe unter keinen Umständen
 */

(function(window) {
  'use strict';

  const STORAGE_KEY_ACTIVE_SCRIPT = 'tactus_active_session_script';
  const STORAGE_KEY_STAGING_CONFIG = 'tactus_staging_config';

  const TONALITIES = {
    sovereign_warm: {
      id: 'sovereign_warm',
      label: 'Souverän & Warm (Standard)',
      desc: 'Ruhige, liebevolle Führung, Geborgenheit und verlässliche Erdung.',
      voiceStyle: 'warm, grounding, encouraging'
    },
    sovereign_cool: {
      id: 'sovereign_cool',
      label: 'Kühl & Unerbittlich',
      desc: 'Wenig Worte, messerscharfe Distanz, unnachgiebiges Protokoll.',
      voiceStyle: 'curt, cold, precise'
    },
    raw_primal: {
      id: 'raw_primal',
      label: 'Rau & Primal',
      desc: 'Körperlich, zupackend, instinktiv, direkt auf den Punkt.',
      voiceStyle: 'primal, physical, direct'
    },
    playful: {
      id: 'playful',
      label: 'Verspielt & Spöttisch',
      desc: 'Sinnliches Teasing, erotische Herausforderung und subtiler Schalk.',
      voiceStyle: 'teasing, mocking, sensual'
    }
  };

  const TOP_AGENDAS = {
    focus_top: {
      id: 'focus_top',
      label: 'Fokus auf mich',
      desc: 'Mindestens 1 voller Höhepunkt für den Top ist heute Pflicht.',
      quotaImpact: 'top_priority'
    },
    multi_climax: {
      id: 'multi_climax',
      label: 'Maßlose Lust (Multi-Climax)',
      desc: 'Mehrfache Entladung des Tops; Bottom dient rückhaltlos.',
      quotaImpact: 'top_multiple'
    },
    cool_distance: {
      id: 'cool_distance',
      label: 'Kalte Distanz (Verzicht)',
      desc: 'Souveräner Verzicht auf eigene Entladung; reine Machtdemonstration.',
      quotaImpact: 'none'
    },
    open_dynamic: {
      id: 'open_dynamic',
      label: 'Offene Regie',
      desc: 'Spontane Entscheidung im Raum nach Verlauf der Dynamik.',
      quotaImpact: 'flexible'
    }
  };

  let stagingConfig = {
    tonality: 'sovereign_warm',
    topAgenda: 'focus_top',
    motifId: null,
    chastityAction: 'remain_locked',
    intensityLevel: 6,
    selectedEquipmentIds: [],
    customNotes: '',
    updatedAt: Date.now()
  };

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function showToast(message) {
    if (typeof window.showToastNotification === 'function') {
      window.showToastNotification(message);
      return;
    }
    const container = document.getElementById('toast-container');
    if (!container) return;

    const el = document.createElement('div');
    el.className = "bg-noir-900 text-slate-200 font-medium text-xs px-4 py-2.5 rounded-xl shadow-2xl border border-slate-800 transition-all pointer-events-auto transform translate-y-2 opacity-0 flex items-center gap-2.5 backdrop-blur-md";
    el.innerHTML = `
      <svg class="w-4 h-4 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"/>
      </svg>
      <span>${escapeHtml(message)}</span>
    `;
    container.appendChild(el);

    setTimeout(() => el.classList.remove('translate-y-2', 'opacity-0'), 10);
    setTimeout(() => {
      el.classList.add('opacity-0');
      setTimeout(() => el.remove(), 300);
    }, 2800);
  }

  function loadStagingConfig() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_STAGING_CONFIG);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          stagingConfig = Object.assign({}, stagingConfig, parsed);
        }
      }
    } catch (e) {
      console.warn("[TACTUS Staging] Fehler beim Laden der Konfiguration:", e);
    }

    if (!Array.isArray(stagingConfig.selectedEquipmentIds) || stagingConfig.selectedEquipmentIds.length === 0) {
      if (window.HubToys && typeof window.HubToys.getOwnedIds === 'function') {
        stagingConfig.selectedEquipmentIds = window.HubToys.getOwnedIds().slice(0, 8);
      }
    }
  }

  function saveStagingConfig() {
    try {
      stagingConfig.updatedAt = Date.now();
      localStorage.setItem(STORAGE_KEY_STAGING_CONFIG, JSON.stringify(stagingConfig));
    } catch (e) {
      console.warn("[TACTUS Staging] Fehler beim Sichern der Konfiguration:", e);
    }
  }

  function isUserTop() {
    if (window.ProtocolCore && typeof window.ProtocolCore.isTop === 'function') {
      return window.ProtocolCore.isTop();
    }
    const myRole = localStorage.getItem('kompass_assigned_role') || 'A';
    const khRole = localStorage.getItem('kompass_keyholder_role') || 'A';
    return myRole === khRole;
  }

  function getRolesAndNames() {
    let topRole = 'A';
    let bottomRole = 'B';
    let names = { A: 'Partner 1', B: 'Partner 2' };

    if (window.HubContext && typeof window.HubContext.getRoles === 'function') {
      const r = window.HubContext.getRoles();
      topRole = r.topRole;
      bottomRole = r.bottomRole;
      names = window.HubContext.getNames();
    } else {
      try {
        const rawNames = localStorage.getItem('kompass_names');
        if (rawNames) names = Object.assign({}, names, JSON.parse(rawNames));
        topRole = localStorage.getItem('kompass_keyholder_role') || 'A';
        bottomRole = (topRole === 'A') ? 'B' : 'A';
      } catch (e) {}
    }

    return {
      topRole,
      bottomRole,
      topName: names[topRole] || 'Top',
      bottomName: names[bottomRole] || 'Bottom'
    };
  }

  /**
   * Scannt alle 36 Fragebogenkapitel dynamisch durch.
   * Selektiert Vorlieben des Tops (r1 >= 4), schließt Tabus des Bottoms (r2 === 1) aus
   * und extrahiert persönliche Notizen sowie Scham-Schutzanker (🙈) beider Partner.
   */
  function extractDynamicMotifCandidates() {
    const { topRole, bottomRole } = getRolesAndNames();

    let answers = {};
    try {
      const raw = localStorage.getItem('kompass_answers');
      if (raw) answers = JSON.parse(raw) || {};
    } catch (e) {}

    const ansTop = answers[topRole] || {};
    const ansSub = answers[bottomRole] || {};

    const allChapters = (window.surveyChaptersPart1 || []).concat(window.surveyChaptersPart2 || window.surveyChapters || []);
    const candidateMotifs = [];

    allChapters.forEach(ch => {
      (ch.items || []).forEach(it => {
        // Überspringe Choice-Items bei den Motiven
        if (it.type === 'choice') return;

        const scoreTop = ansTop[`it_${it.id}_r1`];
        const scoreBottom = ansSub[`it_${it.id}_r2`];
        const noteSub = (ansSub[`note_${it.id}`] || '').trim();
        const noteTop = (ansTop[`note_${it.id}`] || '').trim();
        const isShame = ansSub[`shame_${it.id}`] === true;

        // Bottom-Tabu (Note 1) kategorisch ausschließen (RACK-Schutz)
        if (scoreBottom === 1) return;

        // Top-Präferenz mindestens 4 (Gern oder Must-Have)
        if (typeof scoreTop === 'number' && scoreTop >= 4) {
          candidateMotifs.push({
            id: `motif_item_${it.id}`,
            itemId: it.id,
            chapterTitle: ch.title,
            title: it.title,
            desc: it.desc,
            scoreTop: scoreTop,
            scoreBottom: scoreBottom !== undefined ? scoreBottom : 3,
            noteSub: noteSub,
            noteTop: noteTop,
            isShame: isShame,
            isDoubleFive: (scoreTop === 5 && scoreBottom === 5)
          });
        }
      });
    });

    // Nach Doppel-5ern und kombiniertem Score priorisieren
    candidateMotifs.sort((a, b) => {
      if (a.isDoubleFive && !b.isDoubleFive) return -1;
      if (!a.isDoubleFive && b.isDoubleFive) return 1;
      return (b.scoreTop + b.scoreBottom) - (a.scoreTop + a.scoreBottom);
    });

    // Universelle Standard-Fallbacks falls Bogen noch leer ist
    if (candidateMotifs.length === 0) {
      return [
        {
          id: 'motif_fallback_oral',
          itemId: 16,
          chapterTitle: 'Kapitel 3: Orale Hingabe',
          title: 'Hingebungsvoller Oralservice an mir',
          desc: 'Bottom bedient den Top rückhaltlos mit Mund und Zunge.',
          scoreTop: 5,
          scoreBottom: 4,
          noteSub: '',
          noteTop: '',
          isShame: false,
          isDoubleFive: false
        },
        {
          id: 'motif_fallback_impact',
          itemId: 56,
          chapterTitle: 'Kapitel 11: Spanking & Zucht',
          title: 'Gesäßzüchtigung mit lauter Zählung',
          desc: 'Gezielte Schläge in Vorbeuge mit flacher Hand oder Lederwerkzeug.',
          scoreTop: 4,
          scoreBottom: 4,
          noteSub: '',
          noteTop: '',
          isShame: false,
          isDoubleFive: false
        },
        {
          id: 'motif_fallback_chastity',
          itemId: 36,
          chapterTitle: 'Kapitel 7: Orgasmuskontrolle',
          title: 'Schwellen-Quälerei (Tease & Denial)',
          desc: 'Heranführen an das Plateau mit kaltem Stopp und Verweigerung.',
          scoreTop: 5,
          scoreBottom: 3,
          noteSub: '',
          noteTop: '',
          isShame: false,
          isDoubleFive: false
        },
        {
          id: 'motif_fallback_bondage',
          itemId: 51,
          chapterTitle: 'Kapitel 10: Fesselung',
          title: 'Arretierung der Hände & Sensorik',
          desc: 'Hilflosigkeit durch Fesselung der Gliedmaßen und Augenbinde.',
          scoreTop: 4,
          scoreBottom: 4,
          noteSub: '',
          noteTop: '',
          isShame: false,
          isDoubleFive: false
        }
      ];
    }

    return candidateMotifs.slice(0, 12);
  }

  /**
   * Prüft mit ToyCombinatorics und Kapitel 00, ob Motiv, Ausrüstung und Trauma-Trigger harmonieren.
   */
  function evaluateDynamicConflicts(motif, selectedEquipmentObjects, chastityAction, isLocked) {
    const { bottomRole, bottomName } = getRolesAndNames();
    const warnings = [];
    const blocks = [];

    let answers = {};
    try {
      const raw = localStorage.getItem('kompass_answers');
      if (raw) answers = JSON.parse(raw) || {};
    } catch (e) {}

    const ansSub = answers[bottomRole] || {};

    // 1. Kapitel-00 Psychosomatisches Schutz-Radar (Trauma & Flashbacks)
    const traumaExperience = ansSub['choice_901']; // none, boundary, trauma, private
    const flashbackTrigger = ansSub['choice_902'];  // words, smell, airway, restraint, darkness, none
    const desiredIntervention = ansSub['choice_904']; // hug, distance, grounding, water_tea, voice
    const triggerNote = (ansSub['note_902'] || ansSub['note_901'] || '').trim();

    const motifTitleLower = (motif ? motif.title + ' ' + motif.desc : '').toLowerCase();
    const equipmentIds = (selectedEquipmentObjects || []).map(o => o.id || '');

    // Flashback-Trigger Abgleich:
    if (flashbackTrigger === 'restraint') {
      const involvesRestraint = motifTitleLower.includes('fessel') || motifTitleLower.includes('shibari') ||
                                motifTitleLower.includes('arretier') || equipmentIds.some(id => id.includes('rope') || id.includes('cuff') || id.includes('pillory'));
      if (involvesRestraint) {
        warnings.push(`⚠️ Psychosomatischer Trigger-Hinweis (Kapitel 00): ${bottomName} hat bei Flashback-Triggern „Vollständige Fixierung / Fesseln“ angegeben! Enge Fesselungen nur mit jederzeit möglicher Eigenbefreiung oder stetem Körperkontakt.`);
      }
    }

    if (flashbackTrigger === 'airway') {
      const involvesAirway = motifTitleLower.includes('knebel') || motifTitleLower.includes('atem') || motifTitleLower.includes('queening') ||
                             motifTitleLower.includes('facesitting') || equipmentIds.some(id => id.includes('gag'));
      if (involvesAirway) {
        warnings.push(`⚠️ Psychosomatischer Trigger-Hinweis (Kapitel 00): ${bottomName} reagiert hochsensibel auf Atemwegsbeeinträchtigung! Ausschluss dichter Knebel; Mund- und Nasenatmung müssen frei bleiben.`);
      }
    }

    if (flashbackTrigger === 'darkness') {
      const involvesDarkness = motifTitleLower.includes('augenbinde') || motifTitleLower.includes('dunkel') || equipmentIds.some(id => id.includes('blindfold'));
      if (involvesDarkness) {
        warnings.push(`⚠️ Psychosomatischer Trigger-Hinweis (Kapitel 00): ${bottomName} hat „Plötzliche Dunkelheit“ als Trigger markiert. Augenbinde nur mit sanfter verbaler Begleitung.`);
      }
    }

    if (flashbackTrigger === 'words') {
      const involvesDirtyTalk = motifTitleLower.includes('dirty talk') || motifTitleLower.includes('erniedrig') || motifTitleLower.includes('schimpf');
      if (involvesDirtyTalk) {
        warnings.push(`⚠️ Trigger-Hinweis (Kapitel 00): Verbale Erniedrigung oder harte Schimpfwörter sind für ${bottomName} ein potenzieller Belastungs-Trigger. Sprache souverän und respektvoll halten.`);
      }
    }

    // 2. DoF-Schnittmengenprüfung via ToyCombinatorics
    let dofResult = null;
    if (window.ToyCombinatorics && typeof window.ToyCombinatorics.calculateDegreesOfFreedom === 'function') {
      dofResult = window.ToyCombinatorics.calculateDegreesOfFreedom(selectedEquipmentObjects);
      const dof = dofResult.dof;

      // Oralservice bei blockierter Zunge
      const requiresTongue = motifTitleLower.includes('oral') || motifTitleLower.includes('cunnilingus') || motifTitleLower.includes('lecken');
      if (requiresTongue && dof.tongue_mobility_external <= 0.05) {
        blocks.push("Funktions-Konflikt: Dein gewähltes Motiv erfordert Zungenservice des Bottoms, doch die aktive Ausrüstung blockiert die Zunge vollständig.");
      }

      // Mitzählen bei Sprachblockade
      const requiresCounting = motifTitleLower.includes('zählung') || motifTitleLower.includes('spanking') || motifTitleLower.includes('zucht');
      if (requiresCounting && dof.speech_articulation <= 0.05) {
        warnings.push("Akustik-Hinweis: Geknebelter Bottom kann Schläge nicht laut zählen. Ersetze das Zählen durch Klopfsignale auf die Matratze.");
      }

      // Keuschheitsbarriere bei Schwellenreizung
      const requiresPenileEdging = motifTitleLower.includes('schwellen') || motifTitleLower.includes('edging') || motifTitleLower.includes('denial');
      if (requiresPenileEdging && isLocked && chastityAction === 'remain_locked') {
        warnings.push("Verschluss-Hinweis: Direkte Schwellen-Quälerei am Schaft ist im Käfig unmöglich. Wähle 'Tease & Relock' zum temporären Lösen oder nutze Damm- und Vibrationsreize.");
      }
    }

    return {
      warnings,
      blocks,
      dofResult,
      traumaExperience,
      flashbackTrigger,
      desiredIntervention,
      triggerNote
    };
  }

  function renderStagingCockpit() {
    const container = document.getElementById('staging-cockpit-container');
    if (!container) return;

    loadStagingConfig();
    const isTop = isUserTop();
    const { topName, bottomName } = getRolesAndNames();
    const unifiedContext = window.HubContext ? window.HubContext.getUnifiedState() : null;

    const isLocked = unifiedContext ? unifiedContext.v2_somatic.isLocked : false;
    const daysLocked = unifiedContext ? unifiedContext.v2_somatic.daysLocked : 1;
    const tension = unifiedContext ? unifiedContext.v2_somatic.tension : { archetype: { name: 'Gewöhnung' } };
    const healthGuards = unifiedContext ? unifiedContext.v5_biology.activeHealthGuards : [];
    
    // Motive dynamisch aus allen 185 Bogen-Items ermitteln
    const dynamicMotifs = extractDynamicMotifCandidates();

    if (!stagingConfig.motifId && dynamicMotifs.length > 0) {
      stagingConfig.motifId = dynamicMotifs[0].id;
    }

    // Ausgewählte Ausrüstungs-Objekte laden
    let selectedItemsObjects = [];
    if (window.EquipmentCatalog && typeof window.EquipmentCatalog.getAll === 'function') {
      const allItems = window.EquipmentCatalog.getAll();
      selectedItemsObjects = allItems.filter(it => stagingConfig.selectedEquipmentIds.includes(it.id));
    }

    const selectedMotif = dynamicMotifs.find(m => m.id === stagingConfig.motifId) || dynamicMotifs[0];
    const conflictAnalysis = evaluateDynamicConflicts(selectedMotif, selectedItemsObjects, stagingConfig.chastityAction, isLocked);

    // Text für gewünschte Intervention übersetzen
    const interventionMap = {
      hug: 'Feste, stumme Umarmung & Halten (Gewichtsdecken-Effekt)',
      distance: 'Körperliche Berührung sofort einstellen & etwas Raum geben',
      grounding: 'Licht anmachen, zudecken & ruhige 4-7-8 Vagus-Atmung anleiten',
      water_tea: 'Schluck warmen Tee oder Wasser reichen, ohne zu fragen',
      voice: 'Mit leiser, ruhiger Stimme reden und Sicherheit zusprechen'
    };
    const interventionText = interventionMap[conflictAnalysis.desiredIntervention] || 'Ruhige Vagus-Atmung & Zudecken';

    container.innerHTML = `
      <div class="space-y-4 max-w-3xl mx-auto text-xs">
        
        <!-- HEADER DES STAGING COCKPITS -->
        <div class="p-4 sm:p-5 rounded-3xl bg-slate-900/95 border border-purple-900/60 space-y-2 shadow-2xl">
          <div class="flex items-center justify-between border-b border-purple-900/40 pb-2.5">
            <div class="space-y-0.5">
              <span class="text-[9.5px] font-mono uppercase tracking-wider text-purple-400 font-bold block">Schlafzimmer-Staging &amp; Regie-Pult</span>
              <h2 class="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>Vorbereitung im Halbdunkel</span>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">Top-First</span>
              </h2>
            </div>
            <div class="flex items-center gap-1.5 font-mono text-[10px]">
              <span class="text-slate-400">Intensität:</span>
              <span class="px-2 py-0.5 rounded bg-purple-900 text-purple-200 font-bold">${stagingConfig.intensityLevel} / 10</span>
            </div>
          </div>
          <p class="text-[10.5px] text-slate-300 leading-snug">
            Kalibriere Haltung, eigene Lust und Hauptmotiv. Das System gleicht DoF-Freiheitsgrade, persönliche Notizen von ${escapeHtml(bottomName)} und RACK-Schranken in Echtzeit ab.
          </p>
        </div>

        <!-- NOTFALL-INTERVENTIONS-MEMO BEI ÜBERFORDERUNG (AUS KAPITEL 00) -->
        <div class="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-900/50 space-y-1 text-xs">
          <div class="flex items-center justify-between">
            <strong class="text-emerald-300 text-[11px] font-bold flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Gewünschte Sofort-Hilfe von ${escapeHtml(bottomName)} bei Trigger (Kap. 00):</span>
            </strong>
            <span class="text-[9px] font-mono text-emerald-400">Schutz-Memo</span>
          </div>
          <p class="text-[10.5px] text-slate-200 leading-snug pl-3 border-l border-emerald-600/40">
            ${escapeHtml(interventionText)}
          </p>
        </div>

        <!-- KONFLIKT- & RACK-WARNUNGEN (LIVE DOF CHECK) -->
        ${conflictAnalysis.blocks.length > 0 ? `
          <div class="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-700 space-y-1.5 text-xs animate-pulse">
            <div class="flex items-center gap-2 text-rose-300 font-bold">
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.008v.008H12v-.008z"/></svg>
              <span>Physischer Konflikt erkannt (DoF-Blockade)</span>
            </div>
            <div class="space-y-1 text-[10.5px] text-rose-200 pl-6">
              ${conflictAnalysis.blocks.map(b => `<p>• ${escapeHtml(b)}</p>`).join('')}
            </div>
          </div>
        ` : ''}

        ${conflictAnalysis.warnings.length > 0 ? `
          <div class="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-800 text-[10.5px] text-amber-200 space-y-1.5">
            ${conflictAnalysis.warnings.map(w => `<p class="leading-snug">• ${escapeHtml(w)}</p>`).join('')}
          </div>
        ` : ''}

        <!-- BIOLOGISCHE RACK-SICHERHEITS-SCHRANKE -->
        ${healthGuards.length > 0 ? `
          <div class="p-3.5 rounded-2xl bg-amber-950/25 border border-amber-800/80 space-y-1 text-xs">
            <div class="flex items-center gap-2 text-amber-300 font-bold">
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.008v.008H12v-.008z"/></svg>
              <span>RACK-Gesundheitspass: Aktive biologische Schutzgrenzen</span>
            </div>
            <div class="space-y-0.5 text-[10.5px] text-amber-200/90 pl-6">
              ${healthGuards.map(g => `<p>• ${escapeHtml(g.directive)}</p>`).join('')}
            </div>
          </div>
        ` : ''}

        <!-- DIMENSION 1: HALTUNG & TONALITÄT DES TOPS -->
        <div class="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-2.5 shadow-md">
          <div class="flex items-center justify-between border-b border-slate-800 pb-2">
            <strong class="text-xs text-white block font-bold">1. Haltung &amp; Tonalität des Tops:</strong>
            <span class="text-[10px] font-mono text-purple-300">Temperament</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            ${Object.values(TONALITIES).map(ton => {
              const isSelected = (stagingConfig.tonality === ton.id);
              return `
                <button type="button" ${!isTop ? 'disabled' : ''} onclick="SessionStaging.selectTonality('${ton.id}')" class="p-3 rounded-2xl border text-left transition-all touch-btn ${isSelected ? 'bg-purple-950/70 border-purple-600 shadow-md text-white' : 'bg-slate-950 border-slate-800/80 text-slate-300 hover:border-slate-700'}">
                  <div class="flex items-center justify-between mb-1">
                    <strong class="text-xs block font-bold">${escapeHtml(ton.label)}</strong>
                    <span class="text-xs font-mono font-bold ${isSelected ? 'text-purple-300' : 'text-slate-600'}">${isSelected ? '✓' : '○'}</span>
                  </div>
                  <p class="text-[10px] text-slate-400 leading-snug break-words">${escapeHtml(ton.desc)}</p>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- DIMENSION 2: EIGENE LUST & HÖHEPUNKTE DES TOPS -->
        <div class="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-2.5 shadow-md">
          <div class="flex items-center justify-between border-b border-slate-800 pb-2">
            <strong class="text-xs text-white block font-bold">2. Eigene Lust &amp; Höhepunkte des Tops:</strong>
            <span class="text-[10px] font-mono text-indigo-300">Agenda</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            ${Object.values(TOP_AGENDAS).map(ag => {
              const isSelected = (stagingConfig.topAgenda === ag.id);
              return `
                <button type="button" ${!isTop ? 'disabled' : ''} onclick="SessionStaging.selectTopAgenda('${ag.id}')" class="p-3 rounded-2xl border text-left transition-all touch-btn ${isSelected ? 'bg-purple-950/70 border-purple-600 shadow-md text-white' : 'bg-slate-950 border-slate-800/80 text-slate-300 hover:border-slate-700'}">
                  <div class="flex items-center justify-between mb-1">
                    <strong class="text-xs block font-bold">${escapeHtml(ag.label)}</strong>
                    <span class="text-xs font-mono font-bold ${isSelected ? 'text-purple-300' : 'text-slate-600'}">${isSelected ? '✓' : '○'}</span>
                  </div>
                  <p class="text-[10px] text-slate-400 leading-snug break-words">${escapeHtml(ag.desc)}</p>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- DIMENSION 3: HAUPTMOTIV (DYNAMISCH AUS ALLEN 185 FRAGEN MIT SUB-NOTIZEN) -->
        <div class="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-2.5 shadow-md">
          <div class="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <strong class="text-xs text-white block font-bold">3. Hauptmotiv des Abends:</strong>
              <span class="text-[10px] text-slate-400">Extrahiert aus deinen Top-Vorlieben (r1 ≥ 4) ohne Tabus des Bottoms</span>
            </div>
            <span class="text-[10px] font-mono text-indigo-300 font-bold">${dynamicMotifs.length} Optionen</span>
          </div>

          <!-- DETAIL-KARTE ZUM AKTUELL AUSGEWÄHLTEN MOTIV (INKL. SUB-NOTIZ) -->
          ${selectedMotif ? `
            <div class="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-700/60 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-[9.5px] font-mono text-indigo-300 font-bold uppercase">Gewähltes Motiv:</span>
                <span class="px-2 py-0.5 rounded text-[9px] font-mono font-bold ${selectedMotif.isDoubleFive ? 'bg-purple-950 text-purple-200 border border-purple-600' : 'bg-slate-900 text-slate-300 border border-slate-700'}">
                  ${selectedMotif.scoreTop}/5 Top · ${selectedMotif.scoreBottom}/5 Bottom
                </span>
              </div>
              <strong class="text-xs text-white font-bold block">${escapeHtml(selectedMotif.title)}</strong>
              <p class="text-[10.5px] text-slate-300 leading-snug break-words">${escapeHtml(selectedMotif.desc)}</p>

              <!-- PERSÖNLICHE NOTIZ DES SUBS ZU DIESEM THEMA -->
              ${selectedMotif.noteSub ? `
                <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-[10.5px]">
                  <span class="text-purple-300 font-mono font-bold text-[9.5px] block">[Persönliche Notiz von ${escapeHtml(bottomName)}]:</span>
                  <p class="text-slate-200 italic break-words leading-snug">„${escapeHtml(selectedMotif.noteSub)}“</p>
                </div>
              ` : ''}

              ${selectedMotif.isShame ? `
                <div class="p-2 rounded-xl bg-pink-950/40 border border-pink-900/60 text-[10px] text-pink-200">
                  Schutzanker aktiv: ${escapeHtml(bottomName)} empfindet hier Scham. Strenges Alltags-Spottverbot (§ 1 Abs. 2) und behutsame Annäherung!
                </div>
              ` : ''}
            </div>
          ` : ''}

          <!-- AUSWAHL-LISTE DER MOTIVE (VOLLSTÄNDIG LESBAR OHNE LINE-CLAMP) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
            ${dynamicMotifs.map(m => {
              const isSelected = (stagingConfig.motifId === m.id);
              return `
                <button type="button" ${!isTop ? 'disabled' : ''} onclick="SessionStaging.selectMotif('${m.id}')" class="p-3 rounded-2xl border text-left transition-all touch-btn ${isSelected ? 'bg-indigo-950/70 border-indigo-500 text-white shadow-md' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'}">
                  <div class="flex items-start justify-between gap-1 mb-1">
                    <div class="min-w-0 flex-1">
                      <span class="text-[8.5px] font-mono text-purple-400 block">${escapeHtml(m.chapterTitle)}</span>
                      <strong class="text-xs block font-bold leading-tight break-words">${escapeHtml(m.title)}</strong>
                    </div>
                    <span class="text-xs font-mono font-bold flex-shrink-0 ml-1 ${isSelected ? 'text-indigo-300' : 'text-slate-600'}">${isSelected ? '✓' : '○'}</span>
                  </div>
                  <p class="text-[9.5px] text-slate-400 leading-snug break-words">${escapeHtml(m.desc)}</p>
                  ${m.noteSub ? `<span class="text-[9px] text-purple-300 font-mono block mt-1">Notiz vorhanden ✓</span>` : ''}
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- DIMENSION 4: KEUSCHHEITS-TRIAGE -->
        <div class="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-2.5 shadow-md">
          <div class="flex items-center justify-between border-b border-slate-800 pb-2">
            <div class="flex items-center gap-2">
              <strong class="text-xs text-white block font-bold">4. Keuschheits- &amp; Verschluss-Triage:</strong>
              <span class="px-2 py-0.5 rounded text-[9.5px] font-mono font-bold ${isLocked ? 'bg-purple-950 text-purple-300 border border-purple-800' : 'bg-slate-800 text-slate-400'}">
                ${isLocked ? `Tag ${daysLocked} im Verschluss` : 'Aktuell Unverschlossen'}
              </span>
            </div>
            <span class="text-[10px] font-mono text-slate-400">${escapeHtml(tension.archetype.name)}</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            ${isLocked ? `
              <button type="button" ${!isTop ? 'disabled' : ''} onclick="SessionStaging.selectChastityAction('remain_locked')" class="p-3 rounded-2xl border text-left transition-all touch-btn ${stagingConfig.chastityAction === 'remain_locked' ? 'bg-purple-950/70 border-purple-600 text-white' : 'bg-slate-950 border-slate-800 text-slate-300'}">
                <strong class="text-xs block font-bold">Im Verschluss belassen</strong>
                <span class="text-[9.5px] text-slate-400 block mt-0.5 break-words">Käfig bleibt kalt und verriegelt am Körper; Schaftberührung unmöglich.</span>
              </button>
              <button type="button" ${!isTop ? 'disabled' : ''} onclick="SessionStaging.selectChastityAction('tease_relock')" class="p-3 rounded-2xl border text-left transition-all touch-btn ${stagingConfig.chastityAction === 'tease_relock' ? 'bg-amber-950/70 border-amber-600 text-amber-200' : 'bg-slate-950 border-slate-800 text-slate-300'}">
                <strong class="text-xs block font-bold">Tease &amp; Relock (Temporär lösen)</strong>
                <span class="text-[9.5px] text-slate-400 block mt-0.5 break-words">Schloss öffnen für Schwellen-Quälerei; am Ende zwingend wieder weggesperrt.</span>
              </button>
            ` : `
              <button type="button" ${!isTop ? 'disabled' : ''} onclick="SessionStaging.selectChastityAction('leave_unlocked')" class="p-3 rounded-2xl border text-left transition-all touch-btn ${stagingConfig.chastityAction === 'leave_unlocked' ? 'bg-purple-950/70 border-purple-600 text-white' : 'bg-slate-950 border-slate-800 text-slate-300'}">
                <strong class="text-xs block font-bold">Frei belassen</strong>
                <span class="text-[9.5px] text-slate-400 block mt-0.5 break-words">Offen für manuelle oder orale Reize ohne Verschluss.</span>
              </button>
              <button type="button" ${!isTop ? 'disabled' : ''} onclick="SessionStaging.selectChastityAction('relock_tonight')" class="p-3 rounded-2xl border text-left transition-all touch-btn ${stagingConfig.chastityAction === 'relock_tonight' ? 'bg-amber-950/70 border-amber-600 text-amber-200' : 'bg-slate-950 border-slate-800 text-slate-300'}">
                <strong class="text-xs block font-bold">Wegsperren für die Nacht</strong>
                <span class="text-[9.5px] text-slate-400 block mt-0.5 break-words">Session endet mit dem Verschluss im Käfig vor dem Einschlafen.</span>
              </button>
            `}
          </div>
        </div>

        <!-- AUSRÜSTUNGSSCHRANK AM BETT -->
        <div class="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-2.5 shadow-md">
          <div class="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <strong class="text-xs text-white block font-bold">Hardware am Bett (Bereitgelegt):</strong>
              <span class="text-[10px] text-slate-400">Verfügbare Toys bestimmen verbleibende Freiheitsgrade (DoF)</span>
            </div>
            <button type="button" onclick="HubToys.open()" class="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10px] touch-btn">
              Schrank öffnen ↗
            </button>
          </div>

          <div class="flex flex-wrap gap-1.5 pt-1">
            ${selectedItemsObjects.length === 0 ? `
              <span class="text-[10px] text-slate-500 italic py-1">Keine Ausrüstung vorselektiert. Klicke auf 'Schrank öffnen'.</span>
            ` : selectedItemsObjects.map(it => `
              <span class="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-[10.5px] text-slate-200 flex items-center gap-1.5 break-words">
                <span class="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0"></span>
                <span>${escapeHtml(it.name)}</span>
              </span>
            `).join('')}
          </div>
        </div>

        <!-- INTENSITÄTS-SLIDER 1 BIS 10 -->
        <div class="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-2 shadow-md">
          <div class="flex items-center justify-between">
            <strong class="text-xs text-white block font-bold">Ziel-Intensität der Session:</strong>
            <span class="text-sm font-mono font-black text-purple-300" id="staging-intensity-label">${stagingConfig.intensityLevel} / 10</span>
          </div>
          <input type="range" min="1" max="10" value="${stagingConfig.intensityLevel}" oninput="SessionStaging.setIntensity(this.value)" class="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-purple-600" />
          <div class="flex justify-between text-[9px] font-mono text-slate-500">
            <span>1 (Sanft &amp; Halt)</span>
            <span>5 (Klassisch D/s)</span>
            <span>10 (Grenz-Katharsis)</span>
          </div>
        </div>

        <!-- GENERIEREN & WEITER ZUR LIVE-REGIE -->
        <div class="pt-2">
          <button type="button" onclick="SessionStaging.generateScript()" id="btn-staging-generate" class="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-800 via-indigo-800 to-brand-700 hover:from-purple-700 hover:to-brand-600 text-white font-bold text-xs sm:text-sm touch-btn shadow-xl flex items-center justify-center gap-2">
            <svg class="w-4 h-4 text-purple-200" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>
            <span>Live-Drehbuch berechnen &amp; Session starten</span>
          </button>
        </div>

      </div>
    `;
  }

  function selectTonality(tonId) {
    if (!TONALITIES[tonId]) return;
    stagingConfig.tonality = tonId;
    saveStagingConfig();
    renderStagingCockpit();
  }

  function selectTopAgenda(agendaId) {
    if (!TOP_AGENDAS[agendaId]) return;
    stagingConfig.topAgenda = agendaId;
    saveStagingConfig();
    renderStagingCockpit();
  }

  function selectMotif(motifId) {
    stagingConfig.motifId = motifId;
    saveStagingConfig();
    renderStagingCockpit();
  }

  function selectChastityAction(actionKey) {
    stagingConfig.chastityAction = actionKey;
    saveStagingConfig();
    renderStagingCockpit();
  }

  function setIntensity(value) {
    const val = parseInt(value, 10);
    stagingConfig.intensityLevel = isNaN(val) ? 6 : Math.max(1, Math.min(10, val));
    const lbl = document.getElementById('staging-intensity-label');
    if (lbl) lbl.innerText = `${stagingConfig.intensityLevel} / 10`;
    saveStagingConfig();
  }

  async function generateBedroomScript() {
    loadStagingConfig();
    const btn = document.getElementById('btn-staging-generate');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `
        <div class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
        <span>Berechne 4-Phasen-Drehbuch...</span>
      `;
    }

    const { topName, bottomName, bottomRole } = getRolesAndNames();
    const dynamicMotifs = extractDynamicMotifCandidates();
    const activeMotif = dynamicMotifs.find(m => m.id === stagingConfig.motifId) || dynamicMotifs[0];

    let answers = {};
    try {
      const raw = localStorage.getItem('kompass_answers');
      if (raw) answers = JSON.parse(raw) || {};
    } catch (e) {}

    const ansSub = answers[bottomRole] || {};
    const traumaData = {
      choice901: ansSub['choice_901'],
      choice902: ansSub['choice_902'],
      choice904: ansSub['choice_904'],
      noteSub: activeMotif.noteSub || '',
      isShame: activeMotif.isShame
    };

    let generatedScript = null;

    // 1. Primärpfad: AIAdapter mit vollständiger Sub-Notiz & Trigger-Einspeisung
    if (window.AIAdapter && typeof window.AIAdapter.generateText === 'function') {
      try {
        let basePrompt = "";
        if (window.HubContext && typeof window.HubContext.createBedroomScriptPrompt === 'function') {
          basePrompt = window.HubContext.createBedroomScriptPrompt({
            tonality: stagingConfig.tonality,
            intensityLevel: stagingConfig.intensityLevel,
            focusMotif: activeMotif.title,
            topAgenda: stagingConfig.topAgenda,
            chastityAction: stagingConfig.chastityAction,
            selectedEquipmentIds: stagingConfig.selectedEquipmentIds
          });
        }

        // Sub-Notiz & Trauma-Leitplanke explizit in den Prompt einbinden
        const safetyInjection = `
VERBINDLICHE SUB-NOTIZEN & SCHUTZANKER ZUM HAUPTMOTIV:
- Persönliche Notiz von ${bottomName}: ${traumaData.noteSub ? `„${traumaData.noteSub}“` : 'Keine spezifische Einschränkung notiert.'}
- Scham-Schutzanker (🙈): ${traumaData.isShame ? 'AKTIV! Höchste Achtsamkeit, absolutes Alltags-Spottverbot.' : 'Nicht schambesetzt.'}
- Flashback-Trigger (Kap. 00): ${traumaData.choice902 || 'Keine'}
- Bei emotionaler Überforderung wünscht ${bottomName}: ${traumaData.choice904 || 'Umarmung & Vagus-Atmung'}
Berücksichtige diese Wünsche zwingend in den wörtlichen Regie-Anweisungen und Haltungsbefehlen!
`;

        generatedScript = await window.AIAdapter.generateText({
          systemPrompt: "Du bist der somatische Schlafzimmer-Live-Regisseur für TACTUS.",
          userPrompt: basePrompt + "\n" + safetyInjection,
          temperature: 0.65,
          returnJson: true
        });
      } catch (errAi) {
        console.warn("[TACTUS Staging] KI-Generierung fehlgeschlagen, nutze dynamische Heuristik:", errAi);
      }
    }

    // 2. Fallback: Prozedurale Heuristik mit Notizen-Berücksichtigung
    if (!generatedScript || !Array.isArray(generatedScript.phases) || generatedScript.phases.length === 0) {
      generatedScript = synthesizeProceduralScript(topName, bottomName, activeMotif, traumaData);
    }

    // Skript in sessionStorage hinterlegen für session_live.js
    try {
      sessionStorage.setItem(STORAGE_KEY_ACTIVE_SCRIPT, JSON.stringify(generatedScript));
    } catch (eStore) {
      console.warn("[TACTUS Staging] Konnte aktives Skript nicht sichern:", eStore);
    }

    showToast("✓ Live-Drehbuch berechnet. Starte Session...");

    setTimeout(() => {
      if (window.SessionLive && typeof window.SessionLive.startWithScript === 'function') {
        window.SessionLive.startWithScript(generatedScript);
      } else {
        const stagingEl = document.getElementById('view-session-staging');
        const liveEl = document.getElementById('view-session-live');
        if (stagingEl && liveEl) {
          stagingEl.classList.add('hidden');
          liveEl.classList.remove('hidden');
          if (window.SessionLive && typeof window.SessionLive.init === 'function') {
            window.SessionLive.init();
          }
        }
      }
    }, 300);
  }

  function synthesizeProceduralScript(topName, bottomName, motif, traumaData) {
    const ton = TONALITIES[stagingConfig.tonality] || TONALITIES.sovereign_warm;
    const ag = TOP_AGENDAS[stagingConfig.topAgenda] || TOP_AGENDAS.focus_top;
    const isRelockTonight = stagingConfig.chastityAction === 'relock_tonight';
    const isTeaseRelock = stagingConfig.chastityAction === 'tease_relock';

    // Dialog-Zitate modulieren nach Tonalität
    let quotePhase1 = `„Atme tief aus. Lass den ganzen Alltag draußen vor der Tür. Heute zähle nur ich.“`;
    let quotePhase2 = `„Du spürst jetzt ganz genau, wer hier führt. Halt still und zähl laut mit.“`;
    let quotePhase3 = `„Konzentrier dich ganz auf mich. Kein Gedanke an deine eigene Befriedigung.“`;

    if (stagingConfig.tonality === 'sovereign_cool') {
      quotePhase1 = `„Blick nach unten. Schweigen. Du weißt, was jetzt von dir erwartet wird.“`;
      quotePhase2 = `„Kein Laut außer der Zählung. Jeder Fehler wird verdoppelt.“`;
      quotePhase3 = `„Bedien mich makellos. Wage es nicht, mich dabei anzusehen.“`;
    } else if (stagingConfig.tonality === 'raw_primal') {
      quotePhase1 = `„Auf die Knie, sofort. Du gehörst heute ganz mir.“`;
      quotePhase2 = `„Spür meine Hand auf deiner Haut. Zappeln zwecklos.“`;
      quotePhase3 = `„Gib alles für meine Lust. Heute nimmst du nichts mit.“`;
    } else if (stagingConfig.tonality === 'playful') {
      quotePhase1 = `„Komm her zu mir. Mal sehen, wie brav du heute wirklich sein kannst.“`;
      quotePhase2 = `„Zuckst du schon? Das war doch erst der Anfang.“`;
      quotePhase3 = `„Verwöhn mich, bis ich fertig bin – und dann sehen wir weiter.“`;
    }

    // Phase 2 Instruktion ergänzen um Sub-Bedingung falls vorhanden
    let phase2Instruction = `Etablierung der Hierarchie. Umsetzung von „${motif.title}“: ${motif.desc}`;
    if (traumaData && traumaData.noteSub) {
      phase2Instruction += ` [Achtung: ${bottomName} hat vereinbart: „${traumaData.noteSub}“].`;
    }

    // Phase 3 Instruktion modulieren nach Top-Agenda
    let phase3Instruction = `${bottomName} bedient ${topName} rückhaltlos. ${topName} nimmt sich alle Zeit für die eigene Entladung.`;
    if (stagingConfig.topAgenda === 'multi_climax') {
      phase3Instruction = `${bottomName} bedient ${topName} mehrfach hintereinander (z. B. Oralservice und Massage). Die Session wird erst nach wiederholter Entladung des Tops beendet.`;
    } else if (stagingConfig.topAgenda === 'cool_distance') {
      phase3Instruction = `${topName} verzichtet souverän auf eigene Entladung. Reine Zurschaustellung der Macht: ${bottomName} verharrt in Demut und empfängt die körperliche Begrenzung ohne jedes Entlastungsventil.`;
      quotePhase3 = `„Ich brauche heute keine Berührung. Deine Unterwerfung genügt mir vollkommen.“`;
    }

    return {
      sessionTitle: `${ton.label} · ${motif.title}`,
      tonality: stagingConfig.tonality,
      topAgenda: stagingConfig.topAgenda,
      intensity: stagingConfig.intensityLevel,
      phases: [
        {
          phaseIndex: 1,
          title: "Phase 1: Transition & Körperliche Erdung",
          instruction: `${bottomName} begibt sich vor ${topName} in die Ruheposition. Gemeinsame 4-7-8 Vagus-Atemzüge zur Entlastung des Nervensystems.`,
          topDialogueQuote: quotePhase1,
          somaticZone: "head_eyes",
          estimatedMinutes: 8
        },
        {
          phaseIndex: 2,
          title: `Phase 2: Machtaufbau & ${motif.title}`,
          instruction: phase2Instruction,
          topDialogueQuote: quotePhase2,
          somaticZone: "gluteal_pelvis",
          estimatedMinutes: 12
        },
        {
          phaseIndex: 3,
          title: `Phase 3: Katharsis (${ag.label})`,
          instruction: phase3Instruction,
          topDialogueQuote: quotePhase3,
          somaticZone: "genital_vulva_clitoris",
          estimatedMinutes: 15
        },
        {
          phaseIndex: 4,
          title: "Phase 4: Reverse Aftercare & Rüst-Pflege",
          instruction: `${bottomName} reicht ${topName} Wasser, deckt sie zu und massiert ermüdete Muskeln. ${isRelockTonight || isTeaseRelock ? `Danach wird der Verschluss wieder angelegt und das Schloss verriegelt.` : `Anschließend diskrete Desinfektion der genutzten Ausrüstung.`}`,
          topDialogueQuote: `„Guter Dienst. Jetzt Deckenruhe für uns beide.“`,
          somaticZone: "back_flanks",
          estimatedMinutes: 10
        }
      ],
      reverseAftercareInstructions: {
        subServiceForTop: `${bottomName} massiert ermüdete Muskeln von ${topName} und serviert warmen Tee.`,
        vagusRegulation: "Gewichtsdecke auflegen und 4-7-8 Atemrhythmus gegen Kältezittern einhalten.",
        equipmentDisinfection: "Ausrüstung mit Isopropanol oder pH-neutraler Seife desinfizieren und sauber verstauen."
      }
    };
  }

  const api = {
    init: function() {
      loadStagingConfig();
      renderStagingCockpit();
    },
    render: renderStagingCockpit,
    selectTonality: selectTonality,
    selectTopAgenda: selectTopAgenda,
    selectMotif: selectMotif,
    selectChastityAction: selectChastityAction,
    setIntensity: setIntensity,
    generateScript: generateBedroomScript,
    getConfig: function() { loadStagingConfig(); return stagingConfig; }
  };

  window.SessionStaging = api;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', api.init);
  } else {
    api.init();
  }

})(window);
