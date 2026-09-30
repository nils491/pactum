/**
 * js/protocol_tasks.js
 * TACTUS Aufgaben-, Pflichten- & Hyperdynamische Zucht-Engine (V3.0 Hyper-Dynamisch)
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien:
 * - Klickbare Fragebogen-Deeplinks für jedes Zucht- und Disziplinaritem
 * - Schrank- und Inventarprüfung gegen tactus_owned_equipment & EquipmentCatalog
 * - Ungekürzte Einblendung der persönlichen Sub-Notizen (note_${id})
 * - Hyperdynamischer SomaticPostureSynthesizer mit Re-Roll Button direkt im Modal
 * - Begründetes Abweisen von Aufgaben mit Feedback-Übertragung in den Paar-Stream
 * - Top-First Mental Load Umschaltung (exhausted, balanced, strict)
 * - RACK-Schutzampel: Note 1 Veto-Blockade, Note 2 Sanfte Grenze, Note 3 Brücke, Note 4/5 Freigabe
 * - 100 % frei von infantilen System-Emojis in Datenstrukturen und UI
 * - Keine window.alert() / window.confirm() Aufrufe unter keinen Umständen
 */

(function(window) {
  'use strict';

  const STORAGE_KEY_TASKS = 'tactus_tasks_state';
  const STORAGE_KEY_TOP_LOAD = 'tactus_top_mental_load';
  const STORAGE_KEY_LEGACY = 'pactum_tasks_state';

  // Kernkatalog der Zucht- und Sühnepraktiken mit Fragebogen-Item-Referenzen
  const SOMATIC_PRACTICE_REFERENCES = [
    {
      id: "prac_hand_spanking",
      title: "Spanking mit der flachen Hand",
      itemId: 56, // Kap. 11
      category: "manual_impact",
      equipmentTag: null, // Immer verfügbar (Hand)
      defaultHits: 15,
      defaultPenalty: 20,
      zone: "gluteal_pelvis",
      basePostureType: "prone_or_standing"
    },
    {
      id: "prac_otk_spanking",
      title: "Züchtigung über das Knie gelegt (OTK)",
      itemId: 57, // Kap. 11
      category: "manual_impact",
      equipmentTag: null, // Immer verfügbar (Schoß)
      defaultHits: 20,
      defaultPenalty: 25,
      zone: "gluteal_pelvis",
      basePostureType: "otk_lap"
    },
    {
      id: "prac_leather_flogger",
      title: "Schwerer Lederflogger (Fransenpeitsche)",
      itemId: 61, // Kap. 12
      category: "tool_impact",
      equipmentTag: "flogger",
      defaultHits: 25,
      defaultPenalty: 30,
      zone: "gluteal_pelvis",
      basePostureType: "standing_or_kneeling"
    },
    {
      id: "prac_leather_paddle",
      title: "Breites Sattelleder-Paddle",
      itemId: 62, // Kap. 12
      category: "tool_impact",
      equipmentTag: "paddle",
      defaultHits: 10,
      defaultPenalty: 35,
      zone: "gluteal_pelvis",
      basePostureType: "prone_elevated"
    },
    {
      id: "prac_leather_belt",
      title: "Schwerer Ledergürtel (doppelt gelegt)",
      itemId: 63, // Kap. 12
      category: "tool_impact",
      equipmentTag: "leather_belt",
      defaultHits: 10,
      defaultPenalty: 40,
      zone: "gluteal_pelvis",
      basePostureType: "standing_bend"
    },
    {
      id: "prac_riding_crop",
      title: "Schlanke Reitgerte (Crop)",
      itemId: 64, // Kap. 12
      category: "tool_impact",
      equipmentTag: "crop",
      defaultHits: 8,
      defaultPenalty: 30,
      zone: "thighs_inner",
      basePostureType: "supine_or_standing_spread"
    },
    {
      id: "prac_cane_punishment",
      title: "Rohrstock (Cane) / Intensive Zucht",
      itemId: 65, // Kap. 12
      category: "heavy_discipline",
      equipmentTag: "cane",
      defaultHits: 5,
      defaultPenalty: 60,
      zone: "gluteal_pelvis",
      basePostureType: "strict_forward_bend"
    },
    {
      id: "prac_kneeling_penance",
      title: "Körperliche Ehrerbietung & Kniestand-Appell",
      itemId: 49, // Kap. 9
      category: "posture_penance",
      equipmentTag: null,
      defaultHits: 15, // Steht für 15 Minuten
      defaultPenalty: 25,
      zone: "limbs_ankles_feet",
      basePostureType: "kneeling_nadu"
    },
    {
      id: "prac_ice_shock",
      title: "Eiswürfel-Sensibilisierung & Kälteschock",
      itemId: 68, // Kap. 13
      category: "thermal_shock",
      equipmentTag: "ice",
      defaultHits: 10, // Steht für 10 Schmelz-Minuten
      defaultPenalty: 20,
      zone: "perineum_pelvic_floor",
      basePostureType: "supine_spread"
    },
    {
      id: "prac_chores_service",
      title: "Straf-Aufgaben im Haushalt / Zusatzdienst",
      itemId: 90, // Kap. 17
      category: "household_penance",
      equipmentTag: null,
      defaultHits: 45, // Steht für 45 Minuten
      defaultPenalty: 30,
      zone: "full_body",
      basePostureType: "dynamic_chores"
    }
  ];

  const PROCEDURAL_DUTY_TEMPLATES = {
    exhausted: [
      {
        title: "Stiller Empfang & Entlastungsdienst",
        category: "relief_service",
        interval: "daily",
        dueTime: "19:00",
        points: 35,
        desc: "Schuhe an der Wohnungstür abnehmen, warmen Tee oder Wasser reichen; danach 20 Minuten schweigende Fuß- oder Nackenmassage im Halbdunkel ohne jede Gegenforderung oder Konversation."
      },
      {
        title: "Haushalt vor Eintreffen des Tops bereinigen",
        category: "household",
        interval: "daily",
        dueTime: "18:30",
        points: 25,
        desc: "Küche makellos hinterlassen, Müll leeren, Kleidung wegräumen. Der Top darf beim Betreten der Wohnung auf keinerlei offenen Mental Load stoßen."
      },
      {
        title: "Wortloses Rückzugs-Geleit",
        category: "relief_service",
        interval: "daily",
        dueTime: "22:00",
        points: 20,
        desc: "Bett aufdecken, Wasserflasche bereitstellen, Vorhänge schließen. Rückzug auf die eigene Seite ohne Anforderung an Nähe oder Gespräch."
      }
    ],
    balanced: [
      {
        title: "Morgenappell im Kniestand (30s)",
        category: "micro_ds",
        interval: "daily",
        dueTime: "07:30",
        points: 20,
        desc: "30 Sekunden aufrechter Kniestand mit ruhigem Blickkontakt vor der ersten Alltagsinteraktion als körperlicher Anker der Hierarchie."
      },
      {
        title: "Duftanker & Haltungspflege",
        category: "micro_ds",
        interval: "daily",
        dueTime: "08:00",
        points: 15,
        desc: "Auflegen des vom Top ausgewählten Parfüms und bewusste Atemzentrierung vor Verlassen der Wohnung."
      },
      {
        title: "Wochenend-Frühstücksdienst auf Knien",
        category: "service",
        interval: "weekly",
        dayOfWeek: 6,
        dueTime: "09:30",
        points: 30,
        desc: "Kaffee und Frühstück für den Top servieren; dabei aufrechte Haltung und Danken für die Mahlzeit."
      }
    ],
    strict: [
      {
        title: "Intimrasur & Körperpflege-Appell",
        category: "discipline",
        interval: "weekly",
        dayOfWeek: 5,
        dueTime: "18:00",
        points: 30,
        desc: "Vollständige Glattrasur des Genitalbereichs und Vorzeigen zur Inspektion vor dem Wochenende. Keine Stoppeln geduldet."
      },
      {
        title: "Abendlicher Rapport im Kniestand",
        category: "discipline",
        interval: "daily",
        dueTime: "21:30",
        points: 25,
        desc: "Vor der Bettruhe 5 Minuten stummes Verharren auf den Fersen vor dem Top zur Rechenschaft über den heutigen Gehorsam."
      },
      {
        title: "Käfig-Inspektion & Hautspülung vorzeigen",
        category: "discipline",
        interval: "daily",
        dueTime: "20:00",
        points: 20,
        desc: "Urologische Spülung durchführen und dem Top das reizfreie Hautbild am Verschluss zur Bestätigung vorzeigen."
      }
    ]
  };

  let tasksState = {
    tasks: [],
    filterTab: 'all',
    topMentalLoad: 'balanced',
    lastSynthesizedAt: null,
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
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
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

  function loadTasksState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_TASKS) || localStorage.getItem(STORAGE_KEY_LEGACY);
      const savedLoad = localStorage.getItem(STORAGE_KEY_TOP_LOAD);

      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          tasksState = {
            tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
            filterTab: parsed.filterTab || 'all',
            topMentalLoad: savedLoad || parsed.topMentalLoad || 'balanced',
            lastSynthesizedAt: parsed.lastSynthesizedAt || null,
            updatedAt: parsed.updatedAt || Date.now()
          };

          if (tasksState.tasks.length === 0) {
            synthesizeProceduralTasks(tasksState.topMentalLoad, true);
          } else {
            checkAllDueDates();
          }
          return;
        }
      }
    } catch (e) {
      console.warn("[TACTUS Tasks] Fehler beim Laden des States:", e);
    }

    tasksState = {
      tasks: [],
      filterTab: 'all',
      topMentalLoad: 'balanced',
      lastSynthesizedAt: null,
      updatedAt: Date.now()
    };
    synthesizeProceduralTasks('balanced', true);
  }

  function saveTasksState(skipSync) {
    try {
      tasksState.updatedAt = Date.now();
      const serialized = JSON.stringify(tasksState);
      localStorage.setItem(STORAGE_KEY_TASKS, serialized);
      localStorage.setItem(STORAGE_KEY_LEGACY, serialized);
      localStorage.setItem(STORAGE_KEY_TOP_LOAD, tasksState.topMentalLoad);
    } catch (e) {
      console.warn("[TACTUS Tasks] Konnte State nicht sichern:", e);
    }

    if (!skipSync && window.CloudSync && typeof window.CloudSync.trigger === 'function') {
      window.CloudSync.trigger();
    }
  }

  function isUserTop() {
    if (window.ProtocolCore && typeof window.ProtocolCore.isTop === 'function') {
      return window.ProtocolCore.isTop();
    }
    const isPaired = localStorage.getItem('kompass_is_paired') === 'true';
    if (!isPaired) return true;
    const myRole = localStorage.getItem('kompass_assigned_role') || 'A';
    const kh = localStorage.getItem('kompass_keyholder_role') || 'A';
    return myRole === kh;
  }

  function getBottomRole() {
    const kh = localStorage.getItem('kompass_keyholder_role') || 'A';
    return (kh === 'A') ? 'B' : 'A';
  }

  function synthesizeProceduralTasks(mentalLoad = 'balanced', forceReset = false) {
    const pool = PROCEDURAL_DUTY_TEMPLATES[mentalLoad] || PROCEDURAL_DUTY_TEMPLATES.balanced;
    const now = Date.now();

    let workplaceStressor = 'desk_office';
    if (window.HubContext && typeof window.HubContext.getUnifiedState === 'function') {
      const ctx = window.HubContext.getUnifiedState();
      if (ctx && ctx.v4_energy) workplaceStressor = ctx.v4_energy.workplaceId;
    } else {
      workplaceStressor = localStorage.getItem('kompass_bottom_workplace') || 'desk_office';
    }

    const generated = pool.map((tmpl, idx) => ({
      id: `task_${mentalLoad}_${idx}_${now}`,
      title: tmpl.title,
      category: tmpl.category,
      interval: tmpl.interval,
      dueTime: tmpl.dueTime,
      dayOfWeek: tmpl.dayOfWeek !== undefined ? tmpl.dayOfWeek : null,
      points: tmpl.points,
      desc: tmpl.desc,
      status: 'pending',
      lastSubmittedAt: null,
      lastApprovedAt: null,
      createdAt: now
    }));

    if (workplaceStressor === 'craft_physical') {
      generated.push({
        id: `task_craft_wash_${now}`,
        title: "Urologische Feierabend-Spülung nach Baustelle",
        category: "discipline",
        interval: "daily",
        dueTime: "18:00",
        points: 20,
        desc: "Sofortige Reinigung der Eichelkammer mit Kochsalzlösung zur Vorbeugung von Balanitis nach staubiger und schweißtreibender Arbeit."
      });
    } else if (workplaceStressor === 'desk_office') {
      generated.push({
        id: `task_desk_kegel_${now}`,
        title: "3x 20 Beckenboden-Kontraktionen am Schreibtisch",
        category: "micro_ds",
        interval: "daily",
        dueTime: "14:00",
        points: 15,
        desc: "Diskrete Anspannung des Beckenbodens gegen das verriegelte Gitter zur Vermeidung venöser Stauung beim Dauersitzen."
      });
    }

    if (forceReset) {
      tasksState.tasks = generated;
    } else {
      const inReview = tasksState.tasks.filter(t => t.status === 'submitted');
      tasksState.tasks = [...inReview, ...generated];
    }

    tasksState.topMentalLoad = mentalLoad;
    tasksState.lastSynthesizedAt = now;
    saveTasksState();
    checkAllDueDates();
  }

  function checkAllDueDates() {
    const now = new Date();
    const currentHours = now.getHours();
    const currentMins = now.getMinutes();
    const currentTimeStr = `${String(currentHours).padStart(2, '0')}:${String(currentMins).padStart(2, '0')}`;
    const currentDayOfWeek = now.getDay();
    let hasChanged = false;

    tasksState.tasks.forEach(task => {
      if (task.status === 'submitted') return;

      if (task.interval === 'daily' && task.lastApprovedAt) {
        const lastApp = new Date(task.lastApprovedAt);
        const isSameDay = lastApp.getDate() === now.getDate() &&
                          lastApp.getMonth() === now.getMonth() &&
                          lastApp.getFullYear() === now.getFullYear();
        if (!isSameDay) {
          task.status = 'pending';
          hasChanged = true;
        }
      }

      if (task.interval === 'weekly' && task.lastApprovedAt) {
        const diffMs = now.getTime() - task.lastApprovedAt;
        if (diffMs > 5 * 24 * 3600 * 1000) {
          task.status = 'pending';
          hasChanged = true;
        }
      }

      if (task.status === 'pending') {
        if (task.interval === 'daily') {
          task.isDueNow = (currentTimeStr >= (task.dueTime || '20:00'));
        } else if (task.interval === 'weekly') {
          const targetDay = task.dayOfWeek !== null ? task.dayOfWeek : 0;
          task.isDueNow = (currentDayOfWeek === targetDay && currentTimeStr >= (task.dueTime || '20:00'));
        } else {
          task.isDueNow = true;
        }
      } else {
        task.isDueNow = false;
      }
    });

    if (hasChanged) {
      saveTasksState(true);
    }
  }

  function isPracticeToolAvailable(equipmentTag) {
    if (!equipmentTag) return { available: true, label: "Manuell verfügbar" };

    let ownedIds = [];
    try {
      const raw = localStorage.getItem('tactus_owned_equipment') || localStorage.getItem('kompass_owned_equipment');
      if (raw) ownedIds = JSON.parse(raw) || [];
    } catch (e) {}

    let catalog = [];
    if (window.EquipmentCatalog && typeof window.EquipmentCatalog.getAll === 'function') {
      catalog = window.EquipmentCatalog.getAll();
    }

    const matchingToy = catalog.find(item => 
      ownedIds.includes(item.id) && (item.tags || []).includes(equipmentTag)
    );

    if (matchingToy) {
      return { available: true, label: `Im Schrank vorhanden (${matchingToy.name})` };
    }
    return { available: false, label: "Nicht im Schrank hinterlegt" };
  }

  function getSubPracticeInterpretation(itemId) {
    let answers = {};
    try {
      const raw = localStorage.getItem('kompass_answers');
      if (raw) answers = JSON.parse(raw) || {};
    } catch (e) {}

    const bottomRole = getBottomRole();
    const subAnswers = answers[bottomRole] || {};

    const rawScore = subAnswers[`it_${itemId}_r2`]; // r2 = Empfangen / Hingeben
    const note = subAnswers[`note_${itemId}`] || '';
    const isShame = subAnswers[`shame_${itemId}`] === true;

    const scaleLabels = ["Entfällt", "Tabu / Veto", "Eher nicht", "Neutral", "Gern", "Must-Have"];
    const score = (typeof rawScore === 'number') ? rawScore : 0;

    let tier = 'open';
    let badgeClass = 'bg-slate-900 text-slate-400 border-slate-700';
    let badgeText = 'Noch nicht bewertet';
    let isVeto = false;
    let interpretation = 'Noch kein Eintrag im Fragebogen vorhanden.';

    if (score === 1) {
      tier = 'taboo';
      badgeClass = 'bg-rose-950 text-rose-300 border-rose-800 font-bold';
      badgeText = 'Tabu / Veto (Note 1)';
      isVeto = true;
      interpretation = 'Unantastbares Veto des Subs. Zucht mit dieser Praxis ist als Grenzübertritt untersagt (RACK-Schutz).';
    } else if (score === 2) {
      tier = 'soft_boundary';
      badgeClass = 'bg-amber-950 text-amber-300 border-amber-800 font-bold';
      badgeText = 'Sanfte Grenze (Note 2)';
      interpretation = 'Der Sub empfindet hier Unbehagen. Nur gedrosselt, mit Ankündigung und maximal 5 leichten Treffern anwenden.';
    } else if (score === 3) {
      tier = 'neutral';
      badgeClass = 'bg-indigo-950 text-indigo-300 border-indigo-800 font-bold';
      badgeText = 'Offen / Erkundung (Note 3)';
      interpretation = 'Ausprobieren gestattet. Aufmerksam auf nonverbale Signale und Atemführung achten.';
    } else if (score >= 4) {
      tier = 'preferred';
      badgeClass = 'bg-purple-950 text-purple-200 border-purple-700 font-bold';
      badgeText = `${scaleLabels[score]} (${score}/5)`;
      interpretation = 'Einvernehmlich gewünscht. Ideales Werkzeug zur disziplinarischen Erdung.';
    }

    return {
      score: score,
      tier: tier,
      label: scaleLabels[score] || 'Offen',
      badgeClass: badgeClass,
      badgeText: badgeText,
      isVeto: isVeto,
      note: note.trim(),
      isShame: isShame,
      interpretation: interpretation
    };
  }

  const SomaticPostureSynthesizer = {
    kineticAxes: {
      horizontal_lying: [
        { base: "Flache Bauchlage im freien Raum auf dem Teppich", support: "Bodenkontakt", pelvis: "Becken flach, Fersen lückenlos zusammengepresst" },
        { base: "Bauchlage quer über die Bettkante", support: "Hüfte aufliegend", pelvis: "Becken durch Kissen leicht überhöht, Beine hängen angewinkelt herab" },
        { base: "Flache Rückenlage (Supine) im freien Raum", support: "Rücken auf Matratze", pelvis: "Beine maximal gespreizt, Knie angewinkelt und nach außen gekippt" },
        { base: "Bauchlage über der Schreibtischplatte", support: "Oberkörper aufliegend", pelvis: "Becken überhängend, Zehenspitzen halten leichten Bodenkontakt" }
      ],
      vertical_standing: [
        { base: "Freier Stand mitten im Zimmer ohne Möbelkontakt", support: "Reines Gleichgewicht", pelvis: "Becken leicht gekippt, Knie durchgedrückt, absolute Bewegungslosigkeit" },
        { base: "90-Grad-Standvorbeuge an der Türzarge", support: "Stirn am Holz gelehnt", pelvis: "Gesäß maximal nach hinten herausgestellt, Fersen fest am Boden" },
        { base: "Wand-Stütze im 45-Grad-Winkel", support: "Hände oder Stirn an Wand", pelvis: "Beine weit gegrätscht, Wadenmuskulatur unter kontinuierlicher Dehnung" },
        { base: "Standvorbeuge mit Händen an den eigenen Fesseln", support: "Autonomer Griff", pelvis: "Maximale vertikale Dehnung der Oberschenkelrückseite" }
      ],
      ground_kneeling: [
        { base: "Aufrechter Kniestand (High Kneeling) vor dem Top", support: "Knie auf harter Unterlage", pelvis: "Hüfte vollständig nach vorne durchgedrückt, kein Absacken auf die Fersen" },
        { base: "Klassischer Fersensitz (Gorean Nadu)", support: "Gesäß auf den Fersen", pelvis: "Oberschenkel gespreizt, aufrechter Oberkörper, Schultern zurückgezogen" },
        { base: "Tiefe Hocke (Frog Posture)", support: "Auf den Ballen balancierend", pelvis: "Knie maximal geöffnet, Fersen berühren sich in der Luft" },
        { base: "Vierfüßlerstand mit gesenkter Stirn", support: "Knie und Stirn am Boden", pelvis: "Hohlkreuz (starke Lordose), Becken als höchster Punkt im Raum exponiert" }
      ],
      lap_otk: [
        { base: "Klassische Bauchlage quer über den Oberschenkeln des Tops", support: "Schoß des sitzenden Tops", pelvis: "Beine zwischen den Knien des Tops eingeklemmt, Hände ruhen am Boden" }
      ]
    },

    limbDirectives: {
      arms_free: [
        "Hände im Nacken fest verschränkt, Ellenbogen maximal nach hinten gezogen.",
        "Arme kerzengerade nach oben gestreckt, Handflächen nach innen gerichtet.",
        "Hände flach auf den eigenen Waden fixiert.",
        "Arme seitlich wie ein Kreuz ausgestreckt, Handflächen zum Boden.",
        "Hände hinter dem Rücken auf den Lendenwirbeln aufliegend ohne Verhakung."
      ],
      arms_bound: [
        "Gebundene Handgelenke ruhen bewegungslos auf den Lendenwirbeln.",
        "Fixierte Arme bleiben passiv und ohne Gegenwehr hängen.",
        "Stirn dient als primärer Balance-Anker, keine Entlastungsbewegung der Schultern."
      ]
    },

    cognitiveAxes: {
      gorean_demut: [
        "Blick unverrückbar auf die Dielen vor den Knien des Tops gerichtet; jedes Aufsehen unterbricht die Zählung.",
        "Starrer Blickkontakt in die Augen des Tops ohne Blinzeln oder Ausweichen.",
        "Blick in den großen Spiegel: Der Sub muss die eigene Demutshaltung ununterbrochen selbst beobachten.",
        "Augen geschlossen: Vollständige Konzentration auf den heranfliegenden Reiz."
      ],
      speech_substitutions: {
        vocal: "Lautes, klares Mitzählen jedes Treffers unmittelbar nach dem Aufschlag.",
        gagged: "Nonverbales Quittieren: Deutliches Klopfen mit den Fingerknöcheln auf das Holz bei jedem Treffer (Sprache blockiert).",
        reverent: "Jeder Treffer wird mit 'Danke für Schlag Nummer X, dass du mich züchtigst' quittiert."
      }
    },

    synthesize: async function(practiceId, customPreferences = {}) {
      const practice = SOMATIC_PRACTICE_REFERENCES.find(p => p.id === practiceId) || SOMATIC_PRACTICE_REFERENCES[0];
      
      let ctx = null;
      if (window.HubContext && typeof window.HubContext.getUnifiedState === 'function') {
        ctx = window.HubContext.getUnifiedState();
      }

      const topName = ctx ? ctx.metadata.topName : 'Top';
      const bottomName = ctx ? ctx.metadata.bottomName : 'Bottom';
      const topMentalLoad = ctx ? ctx.v4_energy.topMentalLoad : (localStorage.getItem(STORAGE_KEY_TOP_LOAD) || 'balanced');
      const isLocked = ctx ? ctx.v2_somatic.isLocked : false;
      const daysLocked = ctx ? ctx.v2_somatic.daysLocked : 1;
      const healthGuards = ctx ? ctx.v5_biology.activeHealthGuards : [];
      const dof = ctx ? ctx.v7_hardware.remainingDegreesOfFreedom : { speech_articulation: 1.0, manual_manipulation: 1.0 };
      const subPrefs = getSubPracticeInterpretation(practice.itemId);

      if (window.AIAdapter && typeof window.AIAdapter.generateText === 'function') {
        try {
          const aiPrompt = `
Erstelle eine prägnante, anatomisch und kinetisch anspruchsvolle Haltungs- und Raumdirektive für die Zuchtmaßnahme „${practice.title}“ (${practice.defaultHits} Einheiten).

KONTEXT DES PAARES & DER SESSION:
- Top: ${topName} (Mental Load: ${topMentalLoad})
- Bottom: ${bottomName} (Keuschheit: ${isLocked ? `Tag ${daysLocked} im Käfig` : 'Frei'})
- Sub-Präferenz: Note ${subPrefs.score}/5 („${subPrefs.label}“)${subPrefs.note ? `, Persönliche Notiz: „${subPrefs.note}“` : ''}
- DoF-Einschränkungen: ${dof.speech_articulation <= 0.05 ? 'Mund blockiert/Geknebelt (Kein lautes Zählen möglich!)' : 'Sprache frei'}, ${dof.manual_manipulation <= 0.05 ? 'Hände fixiert/arretiert' : 'Hände frei'}
- Biologische RACK-Schranken: ${healthGuards.map(g => g.directive).join('; ') || 'Keine'}

ANFORDERUNGEN:
- Wähle eine kinetisch interessante Lage (z.B. freies Stehen im Raum, tiefe Bauchlage/Kissen, Wandstütze, Gorean Nadu oder Fersensitz).
- Wenn der Top 'exhausted' ist: Der Top muss sich körperlich nicht anstrengen (Bottom hält die schwere Haltung am Boden).
- Berücksichtige eventuell geblockte Sprache (Klopfen statt Zählen).
- Antworte in exakt 2 prägnanten Sätzen, direkt formuliert als klare Handlungsanweisung ohne Floskeln.
`;
          const aiResponse = await window.AIAdapter.generateText({
            systemPrompt: "Du bist der somatische Kinetik- und Haltungsexperte für TACTUS.",
            userPrompt: aiPrompt,
            temperature: 0.7
          });

          if (aiResponse && aiResponse.trim().length > 20) {
            return aiResponse.trim().replace(/^["„']|["“']$/g, '');
          }
        } catch (err) {
          console.debug("[TACTUS Posture] KI-Synthese fehlgeschlagen, nutze kinetischen Kombinator:", err);
        }
      }

      return this.synthesizeProcedural(practice, dof, topMentalLoad, healthGuards, subPrefs);
    },

    synthesizeProcedural: function(practice, dof, topMentalLoad, healthGuards, subPrefs) {
      const isHandsBound = (dof && dof.manual_manipulation <= 0.05);
      const isMouthGagged = (dof && dof.speech_articulation <= 0.05);

      let posturePool = [];
      if (practice.basePostureType === "otk_lap") {
        posturePool = this.kineticAxes.lap_otk;
      } else if (practice.basePostureType === "prone_elevated" || practice.basePostureType === "prone_or_standing") {
        posturePool = [...this.kineticAxes.horizontal_lying, ...this.kineticAxes.ground_kneeling];
      } else if (practice.basePostureType === "standing_bend" || practice.basePostureType === "strict_forward_bend") {
        posturePool = this.kineticAxes.vertical_standing;
      } else if (practice.basePostureType === "kneeling_nadu") {
        posturePool = this.kineticAxes.ground_kneeling;
      } else {
        posturePool = [...this.kineticAxes.horizontal_lying, ...this.kineticAxes.vertical_standing, ...this.kineticAxes.ground_kneeling];
      }

      const baseObj = posturePool[Math.floor(Math.random() * posturePool.length)];
      const armPool = isHandsBound ? this.limbDirectives.arms_bound : this.limbDirectives.arms_free;
      const armDirective = armPool[Math.floor(Math.random() * armPool.length)];

      const demutPool = this.cognitiveAxes.gorean_demut;
      const demutDirective = demutPool[Math.floor(Math.random() * demutPool.length)];

      const speechDirective = isMouthGagged 
        ? this.cognitiveAxes.speech_substitutions.gagged 
        : (topMentalLoad === 'strict' ? this.cognitiveAxes.speech_substitutions.reverent : this.cognitiveAxes.speech_substitutions.vocal);

      return `${baseObj.base}. ${baseObj.pelvis}. ${armDirective} ${demutDirective} ${speechDirective}`;
    }
  };

  function renderDisciplineCatalog() {
    const container = document.getElementById('discipline-punishments-container');
    if (!container) return;

    const isTop = isUserTop();
    const bottomRole = getBottomRole();

    let names = { A: 'Partner 1', B: 'Partner 2' };
    if (window.HubContext && typeof window.HubContext.getNames === 'function') {
      names = window.HubContext.getNames();
    }
    const subName = names[bottomRole] || 'Bottom';

    container.innerHTML = SOMATIC_PRACTICE_REFERENCES.map(item => {
      const interp = getSubPracticeInterpretation(item.itemId);
      const inventory = isPracticeToolAvailable(item.equipmentTag);

      return `
        <div class="p-3.5 sm:p-4 rounded-2xl border transition-all space-y-2.5 ${interp.isVeto ? 'bg-rose-950/20 border-rose-900/60 opacity-80' : (interp.score >= 4 ? 'bg-purple-950/20 border-purple-900/60 shadow-sm' : 'bg-slate-900/70 border-slate-800')}">
          <div class="flex flex-wrap items-start justify-between gap-2">
            <div class="space-y-0.5 min-w-0 flex-1">
              <div class="flex items-center gap-2 flex-wrap">
                <strong class="text-xs text-white font-bold block">${escapeHtml(item.title)}</strong>
                <span class="px-2 py-0.5 rounded text-[9.5px] font-mono border ${interp.badgeClass}">
                  ${interp.badgeText}
                </span>
                ${interp.isShame ? '<span class="px-1.5 py-0.2 rounded text-[8.5px] font-mono bg-pink-950 text-pink-300 border border-pink-800 font-bold">Scham-Schutzanker</span>' : ''}
              </div>
              <div class="flex items-center gap-2 text-[9.5px] font-mono text-slate-500 pt-0.5">
                <a href="index.html#view=survey&item=${item.itemId}" target="_blank" class="text-purple-400 hover:text-purple-300 underline flex items-center gap-0.5" title="Zur Frage im Fragebogen springen">
                  <span>Fragebogen Item #${item.itemId}</span>
                  <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>
                </a>
                <span>·</span>
                <span>Zone: ${escapeHtml(item.zone)}</span>
                <span>·</span>
                <span class="${inventory.available ? 'text-emerald-400' : 'text-slate-500'} font-bold">${escapeHtml(inventory.label)}</span>
              </div>
            </div>

            <div class="flex items-center gap-2 flex-shrink-0">
              <span class="font-mono text-xs font-bold text-rose-300">-${item.defaultPenalty} P</span>
              ${isTop ? `
                <button type="button" ${interp.isVeto ? 'disabled' : ''} onclick="ProtocolTasks.openDisciplineModal('${item.id}')" class="px-3 py-1.5 rounded-xl font-bold text-xs touch-btn shadow-sm transition-all ${interp.isVeto ? 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed' : 'bg-rose-950 hover:bg-rose-900 border border-rose-700 text-rose-200'}">
                  ${interp.isVeto ? 'Veto (Gesperrt)' : 'Zucht anordnen ↗'}
                </button>
              ` : `
                <span class="text-[10px] text-slate-500 font-mono italic">Top-Regie</span>
              `}
            </div>
          </div>

          <!-- Interpretierte Sub-Transparenz & Notizen -->
          <div class="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1 text-[10.5px]">
            <p class="text-slate-300 leading-snug">${escapeHtml(interp.interpretation)}</p>
            ${interp.note ? `
              <div class="pt-1 border-t border-slate-800/60 flex items-start gap-1.5 text-purple-300 italic font-sans">
                <span class="font-bold font-mono not-italic text-[9.5px] text-purple-400 flex-shrink-0">[Notiz von ${escapeHtml(subName)}]:</span>
                <span class="break-words">„${escapeHtml(interp.note)}“</span>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  async function openDisciplineModal(practiceId) {
    if (!isUserTop()) {
      showToast("Nur der Top kann Zuchtmaßnahmen anordnen.");
      return;
    }

    const item = SOMATIC_PRACTICE_REFERENCES.find(p => p.id === practiceId);
    if (!item) return;

    const interp = getSubPracticeInterpretation(item.itemId);
    if (interp.isVeto) {
      showToast("Veto-Schutz: Diese Praxis ist vom Sub als Tabu hinterlegt!");
      return;
    }

    const modal = document.getElementById('modal-execute-discipline');
    if (!modal) return;

    const titleEl = document.getElementById('modal-discipline-title');
    const countInput = document.getElementById('input-discipline-count');
    const dirArea = document.getElementById('input-discipline-directive');
    const penInput = document.getElementById('input-discipline-penalty');
    const idInput = document.getElementById('input-discipline-item-id');
    const noteBox = document.getElementById('modal-discipline-subnote-box');

    if (titleEl) titleEl.innerText = `Zucht anordnen: ${item.title}`;
    if (countInput) countInput.value = item.defaultHits;
    if (penInput) penInput.value = item.defaultPenalty;
    if (idInput) idInput.value = item.id;

    if (noteBox) {
      noteBox.innerHTML = `
        <div class="flex items-center justify-between text-[10px] font-mono">
          <span class="text-slate-400">Sub-Bewertung:</span>
          <div class="flex items-center gap-1.5">
            <a href="index.html#view=survey&item=${item.itemId}" target="_blank" class="text-purple-400 hover:text-purple-300 underline" title="Fragebogen-Item ansehen">Item #${item.itemId} ↗</a>
            <span class="${interp.badgeClass} px-2 py-0.5 rounded">${interp.badgeText}</span>
          </div>
        </div>
        <p class="text-[10.5px] text-slate-300 leading-snug pt-0.5">${escapeHtml(interp.interpretation)}</p>
        ${interp.note ? `<p class="text-[10px] text-purple-300 italic pt-1 border-t border-slate-800">[Notiz des Subs]: „${escapeHtml(interp.note)}“</p>` : ''}
      `;
    }

    if (dirArea) {
      dirArea.value = "Kalkuliere somatische Haltungsdirektive...";
      const posture = await SomaticPostureSynthesizer.synthesize(item.id);
      dirArea.value = posture;
    }

    let reGenBtn = document.getElementById('btn-regenerate-posture');
    if (!reGenBtn && dirArea && dirArea.parentElement) {
      const btnWrapper = document.createElement('div');
      btnWrapper.className = "flex justify-end pt-1";
      btnWrapper.innerHTML = `
        <button type="button" id="btn-regenerate-posture" onclick="ProtocolTasks.regeneratePosture()" class="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-purple-300 font-mono text-[10px] font-bold flex items-center gap-1 touch-btn">
          <svg class="w-3 h-3 text-purple-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/></svg>
          <span>Haltung neu auswürfeln</span>
        </button>
      `;
      dirArea.parentElement.appendChild(btnWrapper);
    }

    modal.style.display = 'flex';
  }

  async function regeneratePosture() {
    const idInput = document.getElementById('input-discipline-item-id');
    const dirArea = document.getElementById('input-discipline-directive');
    if (!idInput || !dirArea) return;

    dirArea.value = "Generiere alternative Haltung...";
    const newPosture = await SomaticPostureSynthesizer.synthesize(idInput.value);
    dirArea.value = newPosture;
    showToast("Neue somatische Haltungsdirektive generiert ✓");
  }

  function confirmExecuteDiscipline() {
    if (!isUserTop()) return;

    const idInput = document.getElementById('input-discipline-item-id');
    const countInput = document.getElementById('input-discipline-count');
    const dirArea = document.getElementById('input-discipline-directive');
    const penInput = document.getElementById('input-discipline-penalty');

    const practiceId = idInput ? idInput.value : '';
    const hits = countInput ? parseInt(countInput.value, 10) || 10 : 10;
    const directive = dirArea ? dirArea.value.trim() : '';
    const penalty = penInput ? parseInt(penInput.value, 10) || 20 : 20;

    const item = SOMATIC_PRACTICE_REFERENCES.find(p => p.id === practiceId);
    const title = item ? item.title : 'Zuchtmaßnahme';

    if (window.ProtocolCore && typeof window.ProtocolCore.addTransaction === 'function') {
      window.ProtocolCore.addTransaction(-penalty, `Zucht vollzogen: ${title} (${hits} Einheiten)`, 'top');
    }

    if (window.ChatApp && typeof window.ChatApp.postSystemEvent === 'function') {
      window.ChatApp.postSystemEvent(`Zucht angeordnet: ${title} (${hits} Einheiten, -${penalty} P). Haltung: „${directive}“.`);
    }

    const modal = document.getElementById('modal-execute-discipline');
    if (modal) modal.style.display = 'none';

    showToast(`✓ Zuchtmaßnahme „${title}“ vollzogen & gebucht (-${penalty} P)`);
  }

  function openRejectModal(taskId) {
    if (!isUserTop()) return;
    const modal = document.getElementById('modal-reject-task');
    if (!modal) return;

    const idInput = document.getElementById('input-reject-task-id');
    const reasonInput = document.getElementById('input-reject-task-reason');
    if (idInput) idInput.value = taskId;
    if (reasonInput) reasonInput.value = '';

    modal.style.display = 'flex';
  }

  function confirmRejectWithReason() {
    if (!isUserTop()) return;
    const idInput = document.getElementById('input-reject-task-id');
    const reasonInput = document.getElementById('input-reject-task-reason');

    const taskId = idInput ? idInput.value : '';
    const reason = reasonInput ? reasonInput.value.trim() : '';

    loadTasksState();
    const task = tasksState.tasks.find(t => t.id === taskId);
    if (!task) return;

    task.status = 'pending';
    task.lastSubmittedAt = null;

    saveTasksState();
    renderTasksDashboard();

    const formattedReason = reason ? ` Grund: ${reason}` : ' Bitte gründlich nachbessern.';
    showToast(`Pflicht abgewiesen.${formattedReason}`);

    if (window.ChatApp && typeof window.ChatApp.postSystemEvent === 'function') {
      window.ChatApp.postSystemEvent(`Pflicht abgewiesen: „${task.title}“ wurde vom Top nicht anerkannt.${formattedReason}`);
    }

    const modal = document.getElementById('modal-reject-task');
    if (modal) modal.style.display = 'none';
  }

  function submitTaskByBottom(taskId, note = '') {
    loadTasksState();
    const task = tasksState.tasks.find(t => t.id === taskId);
    if (!task) return;

    if (task.status === 'submitted') {
      showToast("Pflicht wurde bereits zur Prüfung eingereicht.");
      return;
    }

    task.status = 'submitted';
    task.lastSubmittedAt = Date.now();
    task.submissionNote = String(note || '').trim();

    saveTasksState();
    renderTasksDashboard();

    showToast(`✓ „${task.title}“ eingereicht. Freigabe durch den Top ausstehend.`);

    if (window.ChatApp && typeof window.ChatApp.postSystemEvent === 'function') {
      const noteSuffix = task.submissionNote ? ` („${task.submissionNote}“)` : '';
      window.ChatApp.postSystemEvent(`Pflicht zur Prüfung eingereicht: ${task.title}${noteSuffix}. Freigabe durch den Top ausstehend.`, task.id);
    }
  }

  function approveTaskByTop(taskId) {
    if (!isUserTop()) {
      showToast("Nur der Top kann eingereichte Pflichten quittieren.");
      return;
    }

    loadTasksState();
    const task = tasksState.tasks.find(t => t.id === taskId);
    if (!task) return;

    task.status = 'approved';
    task.lastApprovedAt = Date.now();
    task.isDueNow = false;

    if (window.ProtocolCore && typeof window.ProtocolCore.addTransaction === 'function') {
      window.ProtocolCore.addTransaction(task.points || 20, `Pflicht erfüllt: ${task.title}`, 'top');
    }

    saveTasksState();
    renderTasksDashboard();

    showToast(`✓ Pflicht bestätigt: +${task.points} Tribut-Punkte verbucht`);

    if (window.ChatApp && typeof window.ChatApp.postSystemEvent === 'function') {
      window.ChatApp.postSystemEvent(`Pflicht quittiert: „${task.title}“ vom Top anerkannt (+${task.points} P).`);
    }
  }

  function getFilteredTasks() {
    checkAllDueDates();
    const tab = tasksState.filterTab;

    return tasksState.tasks.filter(t => {
      if (tab === 'due') return t.isDueNow && t.status === 'pending';
      if (tab === 'submitted') return t.status === 'submitted';
      if (tab === 'relief') return t.category === 'relief_service' || t.category === 'household';
      if (tab === 'micro_ds') return t.category === 'micro_ds' || t.category === 'discipline';
      return true;
    });
  }

  function setFilterTab(tabName) {
    tasksState.filterTab = tabName;
    renderTasksDashboard();
  }

  function setTopMentalLoad(loadState) {
    if (!isUserTop()) {
      showToast("Nur der Top schaltet den Führungszustand.");
      return;
    }
    loadTasksState();
    tasksState.topMentalLoad = loadState;
    saveTasksState();
    synthesizeProceduralTasks(loadState, false);
    renderTasksDashboard();

    const labelMap = {
      exhausted: "Erschöpft / Kopf voll (Pflichten auf Entlastung umgestellt)",
      balanced: "Ausgeglichen / Führend (Ausgewogene D/s-Routinen)",
      strict: "Lust auf Strenge (Fokus auf Disziplin & Inspektion)"
    };

    showToast(`✓ Zustand: ${labelMap[loadState] || loadState}`);

    if (window.ChatApp && typeof window.ChatApp.postSystemEvent === 'function') {
      window.ChatApp.postSystemEvent(`Führungszustand des Tops aktualisiert: ${labelMap[loadState] || loadState}. Pflichtenplan angepasst.`);
    }
  }

  function renderTasksDashboard() {
    const container = document.getElementById('tasks-manager-container');
    if (!container) return;

    loadTasksState();
    const isTop = isUserTop();
    const filtered = getFilteredTasks();
    const pendingCount = tasksState.tasks.filter(t => t.status === 'pending' && t.isDueNow).length;
    const submittedCount = tasksState.tasks.filter(t => t.status === 'submitted').length;
    const load = tasksState.topMentalLoad || 'balanced';

    container.innerHTML = `
      <div class="space-y-4">
        <!-- TOP-ENTLASTUNGS-TRIGGER: ZUSTANDS-KONTROLLE -->
        <div class="p-3.5 rounded-2xl bg-slate-900/90 border border-purple-900/40 space-y-2 shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold block">Führungszustand des Tops:</span>
            ${isTop ? `
              <button type="button" onclick="ProtocolTasks.generateAIAssisted()" class="px-2 py-0.5 rounded-lg bg-purple-950 hover:bg-purple-900 border border-purple-700 text-purple-200 font-mono text-[9.5px] font-bold flex items-center gap-1 touch-btn">
                <svg class="w-3 h-3 text-purple-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>
                <span>Neu kalibrieren</span>
              </button>
            ` : `
              <span class="text-[9.5px] font-mono text-slate-500">Top-geführt</span>
            `}
          </div>

          <div class="grid grid-cols-3 gap-1.5 text-xs">
            <button type="button" ${!isTop ? 'disabled' : ''} onclick="ProtocolTasks.setMentalLoad('exhausted')" class="p-2 rounded-xl border text-left transition-all touch-btn ${load === 'exhausted' ? 'bg-amber-950/70 border-amber-600 text-amber-200 shadow-sm' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'}">
              <strong class="text-[11px] block font-bold leading-tight">Erschöpft</strong>
              <span class="text-[9px] text-slate-400 block mt-0.5 leading-snug">Stiller Dienst & Entlastung</span>
            </button>
            <button type="button" ${!isTop ? 'disabled' : ''} onclick="ProtocolTasks.setMentalLoad('balanced')" class="p-2 rounded-xl border text-left transition-all touch-btn ${load === 'balanced' ? 'bg-purple-950/70 border-purple-600 text-purple-200 shadow-sm' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'}">
              <strong class="text-[11px] block font-bold leading-tight">Ausgeglichen</strong>
              <span class="text-[9px] text-slate-400 block mt-0.5 leading-snug">Haltung & D/s-Ordnung</span>
            </button>
            <button type="button" ${!isTop ? 'disabled' : ''} onclick="ProtocolTasks.setMentalLoad('strict')" class="p-2 rounded-xl border text-left transition-all touch-btn ${load === 'strict' ? 'bg-indigo-950/70 border-indigo-600 text-indigo-200 shadow-sm' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'}">
              <strong class="text-[11px] block font-bold leading-tight">Streng</strong>
              <span class="text-[9px] text-slate-400 block mt-0.5 leading-snug">Inspektion & Disziplin</span>
            </button>
          </div>
        </div>

        <!-- Filter Tabs -->
        <div class="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar pb-1 border-b border-slate-800 text-xs">
          <div class="flex items-center gap-1.5 flex-1 min-w-0">
            <button type="button" onclick="ProtocolTasks.setTab('all')" class="px-3 py-1.5 rounded-xl font-bold transition-all ${tasksState.filterTab === 'all' ? 'bg-purple-700 text-white shadow-sm' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'}">
              Alle (${tasksState.tasks.length})
            </button>
            <button type="button" onclick="ProtocolTasks.setTab('submitted')" class="px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${tasksState.filterTab === 'submitted' ? 'bg-amber-700 text-white shadow-sm' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'}">
              <span>Prüfung</span>
              ${submittedCount > 0 ? `<span class="px-1.5 py-0.2 rounded-full text-[9px] bg-amber-400 text-black font-black">${submittedCount}</span>` : ''}
            </button>
            <button type="button" onclick="ProtocolTasks.setTab('due')" class="px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${tasksState.filterTab === 'due' ? 'bg-rose-800 text-white shadow-sm' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'}">
              <span>Fällig</span>
              ${pendingCount > 0 ? `<span class="px-1.5 py-0.2 rounded-full text-[9px] bg-rose-400 text-black font-black">${pendingCount}</span>` : ''}
            </button>
            <button type="button" onclick="ProtocolTasks.setTab('relief')" class="px-3 py-1.5 rounded-xl font-bold transition-all ${tasksState.filterTab === 'relief' ? 'bg-purple-900 border border-purple-600 text-purple-200' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'}">
              Entlastung
            </button>
            <button type="button" onclick="ProtocolTasks.setTab('micro_ds')" class="px-3 py-1.5 rounded-xl font-bold transition-all ${tasksState.filterTab === 'micro_ds' ? 'bg-indigo-900 border border-indigo-600 text-indigo-200' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'}">
              Geste & Disziplin
            </button>
          </div>
          ${isTop ? `
            <button type="button" onclick="ProtocolTasks.openCreateModal()" class="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1 touch-btn flex-shrink-0">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
              <span>+ Pflicht</span>
            </button>
          ` : ''}
        </div>

        <!-- Task Cards List -->
        <div class="space-y-2.5">
          ${filtered.length === 0 ? `
            <div class="py-8 text-center text-slate-500 text-xs">
              Keine Pflichten in dieser Kategorie vorhanden.
            </div>
          ` : filtered.map(task => {
            const isSubmitted = task.status === 'submitted';
            const isApproved = task.status === 'approved';
            const isDue = task.isDueNow && task.status === 'pending';
            const isRelief = task.category === 'relief_service' || task.category === 'household';

            return `
              <div class="p-3.5 sm:p-4 rounded-2xl border transition-all space-y-2 ${isSubmitted ? 'bg-amber-950/20 border-amber-700/60 shadow-md' : (isDue ? 'bg-rose-950/20 border-rose-800/80 shadow-sm' : 'bg-slate-900/60 border-slate-800/80')}">
                <div class="flex items-start justify-between gap-2">
                  <div class="space-y-0.5 min-w-0 flex-1">
                    <div class="flex items-center gap-2">
                      <strong class="text-xs text-white block truncate font-bold">${escapeHtml(task.title)}</strong>
                      <span class="px-2 py-0.5 rounded text-[9.5px] font-mono font-bold ${isSubmitted ? 'bg-amber-950 text-amber-300 border border-amber-800' : (isApproved ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : (isDue ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-slate-800 text-slate-400'))}">
                        ${isSubmitted ? 'In Prüfung' : (isApproved ? 'Anerkannt ✓' : (isDue ? 'Fällig' : 'Offen'))}
                      </span>
                    </div>
                    <p class="text-[10.5px] text-slate-400 leading-snug break-words">${escapeHtml(task.desc)}</p>
                    ${task.submissionNote ? `
                      <p class="text-[10px] text-amber-300 italic pt-1 border-t border-slate-800/60">
                        [Vollzugsnotiz]: „${escapeHtml(task.submissionNote)}“
                      </p>
                    ` : ''}
                  </div>
                  <span class="font-mono text-xs font-black text-amber-300 flex-shrink-0">+${task.points} P</span>
                </div>

                <div class="flex items-center justify-between pt-1 border-t border-slate-800/80 text-xs">
                  <div class="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                    <span>${task.interval === 'daily' ? `Täglich bis ${task.dueTime || '20:00'}` : (task.interval === 'weekly' ? `Wöchentlich um ${task.dueTime || '20:00'}` : 'Einmalig')}</span>
                    ${isRelief ? '<span class="text-amber-400 font-bold">· Entlastungsdienst</span>' : '<span class="text-purple-400 font-bold">· Micro-D/s</span>'}
                  </div>

                  <div class="flex items-center gap-1.5">
                    ${!isTop && task.status === 'pending' ? `
                      <button type="button" onclick="ProtocolTasks.openSubmitModal('${task.id}')" class="px-3 py-1.5 rounded-xl bg-purple-900/90 hover:bg-purple-800 border border-purple-700 text-white font-bold text-xs flex items-center gap-1 touch-btn shadow-sm">
                        <span>Erledigt melden ↗</span>
                      </button>
                    ` : ''}

                    ${isTop && isSubmitted ? `
                      <button type="button" onclick="ProtocolTasks.approve('${task.id}')" class="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs touch-btn shadow-sm">
                        Anerkennen (+${task.points})
                      </button>
                      <button type="button" onclick="ProtocolTasks.openRejectModal('${task.id}')" class="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-200 border border-slate-700 font-bold text-xs touch-btn">
                        Abweisen...
                      </button>
                    ` : ''}

                    ${isTop && !isSubmitted ? `
                      <button type="button" onclick="ProtocolTasks.deleteTask('${task.id}')" title="Pflicht löschen" class="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 touch-btn">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>
                      </button>
                    ` : ''}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    renderDisciplineCatalog();
  }

  function openCreateModal() {
    let modal = document.getElementById('modal-create-task');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modal-create-task';
      modal.className = "fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4";
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-2xl text-xs">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 class="text-sm font-bold text-white">Neue Pflicht anordnen</h3>
            <span class="text-[10px] text-slate-400">Intervall, Uhrzeit und Tribut festlegen</span>
          </div>
          <button type="button" onclick="document.getElementById('modal-create-task').style.display='none'" class="p-1.5 text-slate-400 hover:text-white">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="space-y-3">
          <div>
            <label class="text-[10.5px] font-mono text-slate-400 uppercase block mb-1">Titel der Pflicht:</label>
            <input type="text" id="input-task-title" placeholder="z. B. Schuhe putzen & auf Knien servieren" class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-purple-600 focus:outline-none" />
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="text-[10.5px] font-mono text-slate-400 uppercase block mb-1">Kategorie:</label>
              <select id="select-task-cat" class="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs">
                <option value="relief_service">Stiller Dienst am Top</option>
                <option value="household">Haushalt & Ordnung</option>
                <option value="micro_ds">Micro-D/s & Geste</option>
                <option value="discipline">Disziplin & Körper</option>
              </select>
            </div>
            <div>
              <label class="text-[10.5px] font-mono text-slate-400 uppercase block mb-1">Tribut-Punkte:</label>
              <input type="number" id="input-task-points" value="20" min="5" max="200" class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="text-[10.5px] font-mono text-slate-400 uppercase block mb-1">Intervall:</label>
              <select id="select-task-interval" class="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs">
                <option value="daily">Täglich</option>
                <option value="weekly">Wöchentlich</option>
                <option value="once">Einmalig</option>
              </select>
            </div>
            <div>
              <label class="text-[10.5px] font-mono text-slate-400 uppercase block mb-1">Fällig bis (Uhrzeit):</label>
              <input type="time" id="input-task-duetime" value="20:00" class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono" />
            </div>
          </div>

          <div>
            <label class="text-[10.5px] font-mono text-slate-400 uppercase block mb-1">Genaue Ausführungs-Anweisung:</label>
            <textarea id="input-task-desc" rows="2" placeholder="Haltung, Rhythmus und genaue Bedingungen..." class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-purple-600 focus:outline-none"></textarea>
          </div>
        </div>

        <div class="pt-2 border-t border-slate-800 flex justify-end gap-2">
          <button type="button" onclick="document.getElementById('modal-create-task').style.display='none'" class="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs touch-btn">Abbrechen</button>
          <button type="button" onclick="ProtocolTasks.saveNewTask()" class="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs touch-btn shadow-md">Pflicht anordnen ✓</button>
        </div>
      </div>
    `;

    modal.style.display = 'flex';
  }

  function saveNewTask() {
    const titleInput = document.getElementById('input-task-title');
    const catSelect = document.getElementById('select-task-cat');
    const ptsInput = document.getElementById('input-task-points');
    const intSelect = document.getElementById('select-task-interval');
    const dueInput = document.getElementById('input-task-duetime');
    const descInput = document.getElementById('input-task-desc');

    const title = titleInput ? titleInput.value.trim() : '';
    if (!title) {
      showToast("Bitte gib der Pflicht einen Titel.");
      return;
    }

    const newTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: title,
      category: catSelect ? catSelect.value : 'household',
      points: ptsInput ? parseInt(ptsInput.value, 10) || 20 : 20,
      interval: intSelect ? intSelect.value : 'daily',
      dueTime: dueInput ? dueInput.value : '20:00',
      dayOfWeek: 0,
      desc: descInput ? descInput.value.trim() : '',
      status: 'pending',
      lastSubmittedAt: null,
      lastApprovedAt: null,
      createdAt: Date.now()
    };

    loadTasksState();
    tasksState.tasks.unshift(newTask);
    saveTasksState();

    const modal = document.getElementById('modal-create-task');
    if (modal) modal.style.display = 'none';

    renderTasksDashboard();
    showToast(`✓ Pflicht „${newTask.title}“ angeordnet`);
  }

  function deleteTask(taskId) {
    if (!isUserTop()) return;
    loadTasksState();
    tasksState.tasks = tasksState.tasks.filter(t => t.id !== taskId);
    saveTasksState();
    renderTasksDashboard();
    showToast("Pflicht entfernt.");
  }

  function openSubmitModal(taskId) {
    let modal = document.getElementById('modal-submit-task');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modal-submit-task';
      modal.className = "fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4";
      document.body.appendChild(modal);
    }

    loadTasksState();
    const task = tasksState.tasks.find(t => t.id === taskId);
    if (!task) return;

    modal.innerHTML = `
      <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-2xl text-xs">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 class="text-sm font-bold text-white">Pflicht als erledigt melden</h3>
            <span class="text-[10px] text-slate-400">Reiche deinen Vollzug zur Prüfung beim Top ein</span>
          </div>
          <button type="button" onclick="document.getElementById('modal-submit-task').style.display='none'" class="p-1.5 text-slate-400 hover:text-white">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <strong class="text-xs text-white block">${escapeHtml(task.title)}</strong>
          <p class="text-[10.5px] text-slate-400">${escapeHtml(task.desc)}</p>
        </div>

        <div class="space-y-1.5">
          <label class="text-[10.5px] font-mono text-slate-400 uppercase block">Notiz an den Top (optional):</label>
          <input type="text" id="input-submit-task-note" placeholder="z. B. Gründlich geputzt / Pünktlich vollzogen..." class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-purple-600 focus:outline-none" />
        </div>

        <div class="pt-2 border-t border-slate-800 flex justify-end gap-2">
          <button type="button" onclick="document.getElementById('modal-submit-task').style.display='none'" class="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs touch-btn">Abbrechen</button>
          <button type="button" onclick="ProtocolTasks.confirmSubmit('${task.id}')" class="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs touch-btn shadow-md">Zur Prüfung einreichen ↗</button>
        </div>
      </div>
    `;

    modal.style.display = 'flex';
  }

  function confirmSubmit(taskId) {
    const noteInput = document.getElementById('input-submit-task-note');
    const note = noteInput ? noteInput.value : '';
    submitTaskByBottom(taskId, note);

    const modal = document.getElementById('modal-submit-task');
    if (modal) modal.style.display = 'none';
  }

  const api = {
    init: function() {
      loadTasksState();
      renderTasksDashboard();
    },
    render: renderTasksDashboard,
    renderDiscipline: renderDisciplineCatalog,
    setTab: setFilterTab,
    setMentalLoad: setTopMentalLoad,
    synthesizeProcedural: synthesizeProceduralTasks,
    submit: submitTaskByBottom,
    openSubmitModal: openSubmitModal,
    confirmSubmit: confirmSubmit,
    approve: approveTaskByTop,
    reject: function(id) { openRejectModal(id); },
    openRejectModal: openRejectModal,
    confirmRejectWithReason: confirmRejectWithReason,
    openDisciplineModal: openDisciplineModal,
    regeneratePosture: regeneratePosture,
    confirmExecuteDiscipline: confirmExecuteDiscipline,
    openCreateModal: openCreateModal,
    saveNewTask: saveNewTask,
    deleteTask: deleteTask,
    checkDueDates: checkAllDueDates,
    getTasks: function() { loadTasksState(); return tasksState.tasks.slice(); },
    getMentalLoad: function() { loadTasksState(); return tasksState.topMentalLoad; }
  };

  window.ProtocolTasks = api;
  window.HubTasks = api;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      loadTasksState();
      renderTasksDashboard();
    });
  } else {
    loadTasksState();
  }

})(window);
