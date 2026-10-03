/**
 * js/protocol_tasks.js
 * TACTUS Aufgaben-, Pflichten- & Hyperdynamische Zucht-Engine (V3.0 Haute-Horlogerie)
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien nach Master-Roadbook:
 * - 100 % UTF-8 Integrität: Echte deutsche Umlaute (ä, ö, ü, ß) im gesamten Modul
 * - Haute-Horlogerie Palette: OLED-Schwarz, Graphit, Champagner-Gold, Malachit, Cognac & Bordeaux
 * - Echte Hyperdynamik: Situativer Kombinatorik-Generator statt starrer Vorlagen
 * - Kinetischer SomaticPostureSynthesizer mit DoF-Prüfung & Re-Roll Button
 * - RACK-Schutzampel: Note 1 (Veto gesperrt), Note 2 (Sanfte Grenze), Note 3 (Brücke), Note 4/5 (Freigabe)
 * - Begründetes Abweisen von Aufgaben mit Feedback-Übertragung in den Paar-Stream
 * - Schrankprüfung gegen EquipmentCatalog und tactus_owned_equipment
 * - Vollständig ungekürzte Partner-Notizen mit klickbaren Fragebogen-Deeplinks (#view=survey&item=X)
 * - 100 % frei von infantilen System-Emojis, keine window.alert() / confirm() Aufrufe
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
      equipmentTag: null,
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
      equipmentTag: null,
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
      defaultHits: 15,
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
      defaultHits: 10,
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
      defaultHits: 45,
      defaultPenalty: 30,
      zone: "full_body",
      basePostureType: "dynamic_chores"
    }
  ];

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
    el.className = "bg-[#090d14] text-[#f8fafc] font-mono text-xs px-4 py-2.5 rounded-2xl shadow-2xl border border-[#c5a880]/40 transition-all pointer-events-auto transform translate-y-2 opacity-0 flex items-center gap-2.5 backdrop-blur-md z-50";
    el.innerHTML = `
      <span class="w-2 h-2 rounded-full bg-[#c5a880] flex-shrink-0 animate-pulse"></span>
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

  // Hyperdynamische Kombinatorik-Bausteine (Keine statischen Listen mehr)
  const TASK_COMBINATORIAL_POOLS = {
    // 1. Entlastungsdienste bei Top-Erschöpfung (Mental-Load Beseitigung)
    relief_exhausted: [
      {
        title: "Stiller Empfang & Entlastung an der Wohnungstür",
        category: "relief_service",
        times: ["18:30", "18:45", "19:00"],
        points: 30,
        postures: [
          "Im aufrechten Kniestand mit gesenktem Blick vor der Wohnungstür verharren.",
          "Im ruhigen Fersensitz mit bereitgestellten Hausschuhen auf der Schwelle warten."
        ],
        actions: [
          "Schuhe und Mantel schweigend abnehmen, ein Glas lauwarmes Wasser oder Tee reichen, kein Redebedarf.",
          "Taschen abnehmen, Jacke aufhängen und für vollkommene Ruhe im Flur sorgen ohne jede Frage."
        ]
      },
      {
        title: "Küche vor Eintreffen des Tops makellos bereinigen",
        category: "household",
        times: ["18:00", "18:15", "18:30"],
        points: 25,
        postures: [
          "Unaufgefordert vor dem Betreten der Wohnung durch den Top vollziehen.",
          "Zügige und geräuschlose Durchführung, damit kein Mental Load sichtbar bleibt."
        ],
        actions: [
          "Geschirrspüler komplett ausräumen, alle Oberflächen spiegelblank abwischen und Müll entsorgen.",
          "Kaffeemaschine auffüllen, frisches Wasser bereitstellen und Spüle trocken polieren."
        ]
      },
      {
        title: "Dienstbare Massage der beanspruchten Nackenpartie",
        category: "relief_service",
        times: ["20:45", "21:00", "21:15"],
        points: 35,
        postures: [
          "Im Kniestand hinter dem Sessel des Tops im Halbdunkel.",
          "Auf einem Kissen sitzend zu Füßen des Tops, ohne Blickkontakt einzufordern."
        ],
        actions: [
          "20 Minuten feste Knetung von Trapezius und Schulterblättern mit warmem Lavendelöl ohne Worte.",
          "Schweigendes Lösen der Muskelverspannungen ohne jede Gegenforderung an Nähe oder Intimität."
        ]
      },
      {
        title: "Fußbad & Fußbalsam-Dienst zur Erdung des Tops",
        category: "relief_service",
        times: ["20:15", "20:30", "20:45"],
        points: 30,
        postures: [
          "Auf Knien vor dem Sofa mit gesenktem Blick.",
          "Im Fersensitz mit bereitgelegtem Handtuch auf den Knien."
        ],
        actions: [
          "Warmes Fußbad vorbereiten, Füße des Tops vorsichtig abtrocknen und mit pflegendem Balsam einreiben.",
          "Sanfte Akupressur der Fußreflexzonen zur Beruhigung des vegetativen Nervensystems des Tops."
        ]
      },
      {
        title: "Schlafraum-Konditionierung & Deckenbereitung",
        category: "household",
        times: ["21:30", "21:45", "22:00"],
        points: 20,
        postures: [
          "Diskrete Vorbereitung 30 Minuten vor dem Schlafengehen.",
          "Vollkommene Ruhe im Schlaftrakt sicherstellen."
        ],
        actions: [
          "Schlafzimmer gründlich lüften, Kissen aufschütteln, Decke bereitlegen und Wasserglas am Bett auffüllen.",
          "Licht auf 15% dimmen, störende Geräte entfernen und die Deckenkante exakt umschlagen."
        ]
      }
    ],

    // 2. Disziplin- & Haltungsprüfungen bei Top-Strenge
    discipline_strict: [
      {
        title: "Morgenprüfung der Haltung im Kniestand",
        category: "discipline",
        times: ["07:15", "07:30", "07:45"],
        points: 25,
        postures: [
          "Aufrechter Kniestand vor den Knien des Tops mit durchgestreckter Hüfte.",
          "Fersensitz auf harter Unterlage mit hinter dem Rücken verschränkten Händen."
        ],
        actions: [
          "60 Sekunden starrer Blickkontakt ohne Blinzeln und klares Bekenntnis zum heutigen Gehorsam.",
          "Vorzeigen des tadellosen Sitzes des Verschlusses und Meldung der gestrigen Pflichterfüllung."
        ]
      },
      {
        title: "Grooming & lückenlose Intimrasur-Inspektion",
        category: "discipline",
        times: ["19:00", "19:30", "20:00"],
        points: 30,
        postures: [
          "Vor dem Spiegel im Badezimmer unter hellem Licht vor dem Top.",
          "Rückenlage auf dem Bett mit angewinkelten und gespreizten Beinen."
        ],
        actions: [
          "Vollkommene Glattrasur von Schambereich, Damm und Hodenansatz vorzeigen. Keine Stoppeln geduldet.",
          "Prüfung der Hautpflege mit antiseptischem Balsam und Vorzeigen der sauberen Rasierschnitt-Freiheit."
        ]
      },
      {
        title: "Abendlicher Rapport im Fersensitz (15 Minuten)",
        category: "discipline",
        times: ["21:15", "21:30", "21:45"],
        points: 25,
        postures: [
          "Klassischer Fersensitz (Gorean Nadu) vor dem Bett des Tops.",
          "Bewegungsloses Verharren auf den Fersen mit Händen flach auf den Oberschenkeln."
        ],
        actions: [
          "Stummer Rapport über alle erledigten Aufgaben des Tages; jedes Murren unterbricht die Zeit.",
          "Rechenschaft über Gedanken und Gehorsam des Tages ablegen; Quittierung durch den Top abwarten."
        ]
      },
      {
        title: "Standvorbeuge zur Haltungsdisziplin (10 Minuten)",
        category: "discipline",
        times: ["20:00", "20:15", "20:30"],
        points: 25,
        postures: [
          "90-Grad-Standvorbeuge an der Türzarge mit Stirn am Holz.",
          "Vorbeuge über die Schreibtischkante mit Händen flach auf der Platte."
        ],
        actions: [
          "Absolutes Stillstehen ohne Gewichtsverlagerung. Der Top kontrolliert die gleichmäßige Atmung.",
          "Gesäß exponiert halten zur Vorbereitung auf abendliche Sühnemaßnahmen."
        ]
      }
    ],

    // 3. Ausgewogene D/s-Routinen bei Balance
    balanced_micro: [
      {
        title: "Morgenappell im Kniestand (45 Sekunden)",
        category: "micro_ds",
        times: ["07:30", "07:45", "08:00"],
        points: 20,
        postures: [
          "Aufrechter Kniestand vor dem Verlassen des Schlafzimmers.",
          "Ruhiger Blickkontakt auf Augenhöhe des sitzenden Tops."
        ],
        actions: [
          "45 Sekunden bewusste Atemzentrierung und Dank für die Leitung des kommenden Tages.",
          "Stummer Kopfstreich des Tops als Entlassung in den Alltag."
        ]
      },
      {
        title: "Duftanker & Haltungspflege vor dem Gehen",
        category: "micro_ds",
        times: ["08:00", "08:15", "08:30"],
        points: 15,
        postures: [
          "Aufrecht stehend an der Wohnungstür mit dargebotenen Handgelenken.",
          "Im leichten Bückling zur Entgegennahme des Duftankers."
        ],
        actions: [
          "Ein Hauch des Parfüms des Tops auf das Handgelenk als ständiger Begleiter während der Arbeit.",
          "Tiefes Einatmen des Dufts und Festigung des inneren Fokus auf den Partner."
        ]
      },
      {
        title: "Wochenend-Frühstücksservice auf Knien",
        category: "service",
        times: ["09:00", "09:30", "10:00"],
        points: 30,
        postures: [
          "Servieren auf den Knien am Bett oder Esstisch.",
          "Tablett mit beiden Händen ruhig darreichen mit gesenktem Blick."
        ],
        actions: [
          "Kaffee, Tee und Frühstück frisch anrichten und schweigend servieren.",
          "Warten, bis der Top die erste Kostprobe genommen und Wohlwollen signalisiert hat."
        ]
      },
      {
        title: "Abendliche Fuß- und Wadenentlastung",
        category: "service",
        times: ["20:30", "21:00", "21:30"],
        points: 25,
        postures: [
          "Zu Füßen des Tops auf einem weichen Kissen sitzend.",
          "Im Fersensitz vor dem Sofa."
        ],
        actions: [
          "15 Minuten achtsame Massage der Fußgewölbe zur Vertiefung der Nähe nach dem Alltag.",
          "Sanftes Ausstreichen der Waden mit duftendem Pflegeöl."
        ]
      }
    ],

    // 4. Berufs- und Ergonomie-Adaptionen
    workplace_adaptations: {
      desk_office: [
        {
          title: "3x 20 Beckenboden-Kontraktionen am Schreibtisch",
          category: "micro_ds",
          dueTime: "14:00",
          points: 15,
          desc: "Diskretes Anspannen des Beckenbodens gegen den Verschluss zur Vermeidung venöser Stauung beim Dauersitzen."
        },
        {
          title: "Ergonomische Hüftstreckung & Schambein-Entlastung",
          category: "micro_ds",
          dueTime: "16:00",
          points: 15,
          desc: "5 Minuten aufrechtes Stehen im Homeoffice mit Durchdrücken des Beckens zur Entlastung des Schambeinbogens."
        }
      ],
      craft_physical: [
        {
          title: "Urologische Feierabend-Spülung nach Baustelle",
          category: "discipline",
          dueTime: "17:45",
          points: 20,
          desc: "Sofortige Reinigung der Eichelkammer mit 50ml Kochsalzlösung zur Vorbeugung von Balanitis nach Staub- und Schweißarbeit."
        },
        {
          title: "Damm-Inspektion & Follikulitis-Schutzbalsam",
          category: "discipline",
          dueTime: "18:15",
          points: 15,
          desc: "Auftragen von Zinksalbe auf beanspruchte Reibestellen an den Hodenrändern nach körperlicher Belastung."
        }
      ],
      medical_service: [
        {
          title: "Umfassender Fußdienst nach langem Stehen",
          category: "relief_service",
          dueTime: "20:30",
          points: 25,
          desc: "Einmassieren von pflegendem Balsam in die beanspruchten Füße des Tops nach der anstrengenden Schicht."
        },
        {
          title: "Entlastungshochlagerung der Beine vor dem Appell",
          category: "micro_ds",
          dueTime: "19:30",
          points: 15,
          desc: "10 Minuten Beine an der Wand hochlagern zur venösen Entstauung, bevor der Abenddienst angetreten wird."
        }
      ],
      driver_field: [
        {
          title: "Ampel-Fokus & Haltungsanker im Verkehr",
          category: "micro_ds",
          dueTime: "17:00",
          points: 15,
          desc: "An jeder roten Ampel: Hände fest am Lenkrad lassen, aufrecht hinsetzen, ausatmen und an die Führung des Tops denken."
        }
      ],
      shift_variable: [
        {
          title: "Tagesschlaf-Verdunkelung & Vagus-Beruhigung",
          category: "relief_service",
          dueTime: "08:30",
          points: 20,
          desc: "Schlafzimmer vor dem Tagesschlaf vollkommen verdunkeln; 4-7-8 Vagus-Atmung zur Biorhythmus-Stabilisierung."
        }
      ]
    }
  };

  function synthesizeProceduralTasks(mentalLoad = 'balanced', forceReset = false) {
    const now = Date.now();

    // 1. Kontext extrahieren
    let workplaceStressor = 'desk_office';
    let daysLocked = 1;
    let isLocked = false;

    if (window.HubContext && typeof window.HubContext.getUnifiedState === 'function') {
      const ctx = window.HubContext.getUnifiedState();
      if (ctx && ctx.v4_energy) workplaceStressor = ctx.v4_energy.workplaceId;
      if (ctx && ctx.v2_somatic) {
        isLocked = ctx.v2_somatic.isLocked;
        daysLocked = ctx.v2_somatic.daysLocked;
      }
    } else {
      workplaceStressor = localStorage.getItem('kompass_bottom_workplace') || 'desk_office';
      if (window.ProtocolCore && typeof window.ProtocolCore.getState === 'function') {
        const p = window.ProtocolCore.getState();
        isLocked = !!p.isLocked;
      }
    }

    // 2. Kombinatorischer Aufgaben-Pool wählen
    let candidatePool = [];
    if (mentalLoad === 'exhausted') {
      candidatePool = TASK_COMBINATORIAL_POOLS.relief_exhausted;
    } else if (mentalLoad === 'strict') {
      candidatePool = TASK_COMBINATORIAL_POOLS.discipline_strict;
    } else {
      candidatePool = TASK_COMBINATORIAL_POOLS.balanced_micro;
    }

    // Aus dem Pool zufällig 3 unterschiedliche Bausteine mischen
    const shuffled = [...candidatePool].sort(() => 0.5 - Math.random());
    const selectedBlueprints = shuffled.slice(0, 3);

    const dynamicTasks = [];

    selectedBlueprints.forEach((bp, index) => {
      const randomTime = bp.times[Math.floor(Math.random() * bp.times.length)];
      const randomPosture = bp.postures[Math.floor(Math.random() * bp.postures.length)];
      const randomAction = bp.actions[Math.floor(Math.random() * bp.actions.length)];

      dynamicTasks.push({
        id: `task_${mentalLoad}_${index}_${now}`,
        title: bp.title,
        category: bp.category,
        interval: "daily",
        dueTime: randomTime,
        points: bp.points,
        desc: `${randomPosture} ${randomAction}`,
        status: "pending",
        lastSubmittedAt: null,
        lastApprovedAt: null,
        createdAt: now
      });
    });

    // 3. Ergonomie- & Arbeitsplatz-Adaption einsteuern
    const workplaceList = TASK_COMBINATORIAL_POOLS.workplace_adaptations[workplaceStressor] || TASK_COMBINATORIAL_POOLS.workplace_adaptations.desk_office;
    if (workplaceList && workplaceList.length > 0) {
      const chosenWorkplaceTask = workplaceList[Math.floor(Math.random() * workplaceList.length)];
      dynamicTasks.push({
        id: `task_wp_${workplaceStressor}_${now}`,
        title: chosenWorkplaceTask.title,
        category: chosenWorkplaceTask.category,
        interval: "daily",
        dueTime: chosenWorkplaceTask.dueTime,
        points: chosenWorkplaceTask.points,
        desc: isLocked ? `${chosenWorkplaceTask.desc} Tag ${daysLocked} im Verschluss fordert Achtsamkeit.` : chosenWorkplaceTask.desc,
        status: "pending",
        lastSubmittedAt: null,
        lastApprovedAt: null,
        createdAt: now
      });
    }

    if (forceReset) {
      tasksState.tasks = dynamicTasks;
    } else {
      // In Prüfung befindliche Aufgaben erhalten
      const inReview = tasksState.tasks.filter(t => t.status === 'submitted');
      tasksState.tasks = [...inReview, ...dynamicTasks];
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
    let badgeClass = 'bg-[#090d14] text-[#94a3b8] border-[#1e2638]';
    let badgeText = 'Noch nicht bewertet';
    let isVeto = false;
    let interpretation = 'Noch kein Eintrag im Fragebogen vorhanden.';

    if (score === 1) {
      tier = 'taboo';
      badgeClass = 'bg-[#450a0a] text-[#f8fafc] border-[#991b1b] font-bold';
      badgeText = 'Tabu / Veto (Note 1)';
      isVeto = true;
      interpretation = 'Unantastbares Veto des Subs. Zucht mit dieser Praxis ist als Grenzübertritt untersagt (RACK-Schutz).';
    } else if (score === 2) {
      tier = 'soft_boundary';
      badgeClass = 'bg-[#4a2818] text-[#b3734a] border-[#8a5232] font-bold';
      badgeText = 'Sanfte Grenze (Note 2)';
      interpretation = 'Der Sub empfindet hier Unbehagen. Nur gedrosselt, mit Ankündigung und maximal 5 leichten Treffern anwenden.';
    } else if (score === 3) {
      tier = 'neutral';
      badgeClass = 'bg-[#101622] text-[#c5a880] border-[#c5a880]/40 font-bold';
      badgeText = 'Offen / Erkundung (Note 3)';
      interpretation = 'Ausprobieren gestattet. Aufmerksam auf nonverbale Signale und Atemführung achten.';
    } else if (score >= 4) {
      tier = 'preferred';
      badgeClass = 'bg-[#142b24] text-[#2e5746] border-[#2e5746] font-bold';
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
      demut: [
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

    synthesize: async function(practiceId) {
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
Erstelle eine prägnante, anatomisch und kinetisch anspruchsvolle Haltungsdirektive für die Zuchtmaßnahme „${practice.title}“ (${practice.defaultHits} Einheiten).

KONTEXT DES PAARES & DER SESSION:
- Top: ${topName} (Mental Load: ${topMentalLoad})
- Bottom: ${bottomName} (Keuschheit: ${isLocked ? `Tag ${daysLocked} im Käfig` : 'Frei'})
- Sub-Präferenz: Note ${subPrefs.score}/5 („${subPrefs.label}“)${subPrefs.note ? `, Notiz: „${subPrefs.note}“` : ''}
- DoF: ${dof.speech_articulation <= 0.05 ? 'Mund geknebelt (Klopfen statt Zählen!)' : 'Sprache frei'}, ${dof.manual_manipulation <= 0.05 ? 'Hände fixiert/arretiert' : 'Hände frei'}
- Schutzschranken: ${healthGuards.map(g => g.directive).join('; ') || 'Keine'}

ANFORDERUNGEN:
- Kinetisch stimmige Lage (Bauchlage/Kissen, Wandstütze, Kniestand oder Fersensitz).
- Berücksichtige geblockte Sprache (Klopfen statt Zählen).
- Antworte in exakt 2 prägnanten Sätzen, direkt formuliert als klare Handlungsanweisung ohne Floskeln.
`;
          const aiResponse = await window.AIAdapter.generateText({
            safety: true,
            systemPrompt: "Du bist der somatische Kinetik- und Haltungsexperte für TACTUS.",
            userPrompt: aiPrompt,
            temperature: 0.7
          });

          if (aiResponse && aiResponse.trim().length > 20) {
            return aiResponse.trim().replace(/^["„']|["“']$/g, '');
          }
        } catch (err) {
          console.debug("[TACTUS Posture] KI-Synthese fehlgeschlagen, nutze Kombinator:", err);
        }
      }

      return this.synthesizeProcedural(practice, dof, topMentalLoad, healthGuards, subPrefs);
    },

    synthesizeProcedural: function(practice, dof, topMentalLoad) {
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

      const demutPool = this.cognitiveAxes.demut;
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
        <div class="p-3.5 sm:p-4 rounded-2xl border transition-all space-y-2.5 ${interp.isVeto ? 'bg-[#000000] border-[#991b1b] opacity-80' : (interp.score >= 4 ? 'bg-[#000000] border-[#c5a880]/60 shadow-sm' : 'bg-[#090d14] border-[#1e2638]')}">
          <div class="flex flex-wrap items-start justify-between gap-2">
            <div class="space-y-0.5 min-w-0 flex-1">
              <div class="flex items-center gap-2 flex-wrap">
                <strong class="text-xs text-[#f8fafc] font-bold block">${escapeHtml(item.title)}</strong>
                <span class="px-2 py-0.5 rounded text-[9.5px] font-mono border ${interp.badgeClass}">
                  ${interp.badgeText}
                </span>
                ${interp.isShame ? '<span class="px-1.5 py-0.2 rounded text-[8.5px] font-mono bg-[#4a2818] text-[#b3734a] border border-[#8a5232] font-bold">Scham-Schutzanker</span>' : ''}
              </div>
              <div class="flex items-center gap-2 text-[9.5px] font-mono text-[#94a3b8] pt-0.5">
                <a href="index.html#view=survey&item=${item.itemId}" target="_blank" class="text-[#c5a880] hover:underline flex items-center gap-0.5" title="Zur Frage im Fragebogen springen">
                  <span>Fragebogen Item #${item.itemId}</span>
                  <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>
                </a>
                <span>·</span>
                <span>Zone: ${escapeHtml(item.zone)}</span>
                <span>·</span>
                <span class="${inventory.available ? 'text-[#2e5746]' : 'text-[#94a3b8]'} font-bold">${escapeHtml(inventory.label)}</span>
              </div>
            </div>

            <div class="flex items-center gap-2 flex-shrink-0">
              <span class="font-mono text-xs font-bold text-[#b3734a]">-${item.defaultPenalty} P</span>
              ${isTop ? `
                <button type="button" ${interp.isVeto ? 'disabled' : ''} onclick="ProtocolTasks.openDisciplineModal('${item.id}')" class="px-3 py-1.5 rounded-xl font-bold text-xs touch-btn shadow-sm transition-all ${interp.isVeto ? 'bg-[#090d14] border border-[#1e2638] text-[#94a3b8]/40 cursor-not-allowed' : 'bg-[#991b1b] hover:bg-red-700 text-white border border-[#991b1b]'}">
                  ${interp.isVeto ? 'Veto (Gesperrt)' : 'Zucht anordnen ↗'}
                </button>
              ` : `
                <span class="text-[10px] text-[#94a3b8] font-mono italic">Top-Regie</span>
              `}
            </div>
          </div>

          <!-- Interpretierte Sub-Transparenz & Notizen -->
          <div class="p-2.5 rounded-xl bg-[#000000] border border-[#1e2638] space-y-1 text-[10.5px]">
            <p class="text-[#94a3b8] leading-snug">${escapeHtml(interp.interpretation)}</p>
            ${interp.note ? `
              <div class="pt-1 border-t border-[#1e2638] flex items-start gap-1.5 text-[#b3734a] italic font-sans">
                <span class="font-bold font-mono not-italic text-[9.5px] text-[#c5a880] flex-shrink-0">[Notiz von ${escapeHtml(subName)}]:</span>
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
          <span class="text-[#94a3b8]">Sub-Bewertung:</span>
          <div class="flex items-center gap-1.5">
            <a href="index.html#view=survey&item=${item.itemId}" target="_blank" class="text-[#c5a880] hover:underline font-bold" title="Fragebogen-Item ansehen">Item #${item.itemId} ↗</a>
            <span class="${interp.badgeClass} px-2 py-0.5 rounded">${interp.badgeText}</span>
          </div>
        </div>
        <p class="text-[10.5px] text-[#f8fafc] leading-snug pt-0.5">${escapeHtml(interp.interpretation)}</p>
        ${interp.note ? `<p class="text-[10px] text-[#b3734a] italic pt-1 border-t border-[#1e2638]">[Notiz des Subs]: „${escapeHtml(interp.note)}“</p>` : ''}
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
        <button type="button" id="btn-regenerate-posture" onclick="ProtocolTasks.regeneratePosture()" class="px-2.5 py-1 rounded-xl bg-[#000000] hover:bg-[#101622] border border-[#c5a880]/60 text-[#c5a880] font-mono text-[10px] font-bold flex items-center gap-1 touch-btn">
          <svg class="w-3 h-3 text-[#c5a880]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/></svg>
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

    if (window.TactusChat) {
      window.TactusChat.post(`Zucht angeordnet: ${title} (${hits} Einheiten, -${penalty} P). Haltung: „${directive}“.`);
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

    if (window.TactusChat) {
      window.TactusChat.post(`Pflicht abgewiesen: „${task.title}“ wurde vom Top nicht anerkannt.${formattedReason}`);
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

    if (window.TactusChat) {
      const noteSuffix = task.submissionNote ? ` („${task.submissionNote}“)` : '';
      window.TactusChat.post(`Pflicht zur Prüfung eingereicht: ${task.title}${noteSuffix}. Freigabe durch den Top ausstehend.`, task.id);
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

    if (window.TactusChat) {
      window.TactusChat.post(`Pflicht quittiert: „${task.title}“ vom Top anerkannt (+${task.points} P).`);
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

    if (window.TactusChat) {
      window.TactusChat.post(`Führungszustand des Tops aktualisiert: ${labelMap[loadState] || loadState}. Pflichtenplan angepasst.`);
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
        <div class="p-3.5 rounded-2xl bg-[#090d14] border border-[#1e2638] space-y-2 shadow-sm">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-mono uppercase tracking-wider text-[#c5a880] font-bold block">Führungszustand des Tops:</span>
            ${isTop ? `
              <button type="button" onclick="ProtocolTasks.synthesizeProcedural('${load}', false); ProtocolTasks.render();" class="px-2.5 py-1 rounded-xl bg-[#000000] hover:bg-[#101622] border border-[#c5a880]/60 text-[#c5a880] font-mono text-[9.5px] font-bold flex items-center gap-1 touch-btn">
                <svg class="w-3 h-3 text-[#c5a880]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/></svg>
                <span>Neu auswürfeln</span>
              </button>
            ` : `
              <span class="text-[9.5px] font-mono text-[#94a3b8]">Top-geführt</span>
            `}
          </div>

          <div class="grid grid-cols-3 gap-1.5 text-xs font-mono">
            <button type="button" ${!isTop ? 'disabled' : ''} onclick="ProtocolTasks.setMentalLoad('exhausted')" class="p-2.5 rounded-xl border text-left transition-all touch-btn ${load === 'exhausted' ? 'bg-[#4a2818] border-[#8a5232] text-[#f8fafc] shadow-sm font-bold' : 'bg-[#000000] border-[#1e2638] text-[#94a3b8] hover:text-[#f8fafc]'}">
              <strong class="text-[11px] block leading-tight">Erschöpft</strong>
              <span class="text-[9px] text-[#dfcaa9] block mt-0.5 leading-snug">Stiller Dienst &amp; Entlastung</span>
            </button>
            <button type="button" ${!isTop ? 'disabled' : ''} onclick="ProtocolTasks.setMentalLoad('balanced')" class="p-2.5 rounded-xl border text-left transition-all touch-btn ${load === 'balanced' ? 'bg-[#000000] border-[#c5a880] text-[#c5a880] shadow-sm font-bold' : 'bg-[#000000] border-[#1e2638] text-[#94a3b8] hover:text-[#f8fafc]'}">
              <strong class="text-[11px] block leading-tight">Ausgeglichen</strong>
              <span class="text-[9px] text-[#94a3b8] block mt-0.5 leading-snug">Haltung &amp; D/s-Ordnung</span>
            </button>
            <button type="button" ${!isTop ? 'disabled' : ''} onclick="ProtocolTasks.setMentalLoad('strict')" class="p-2.5 rounded-xl border text-left transition-all touch-btn ${load === 'strict' ? 'bg-[#450a0a] border-[#991b1b] text-[#f8fafc] shadow-sm font-bold' : 'bg-[#000000] border-[#1e2638] text-[#94a3b8] hover:text-[#f8fafc]'}">
              <strong class="text-[11px] block leading-tight">Streng</strong>
              <span class="text-[9px] text-[#f8fafc]/70 block mt-0.5 leading-snug">Inspektion &amp; Disziplin</span>
            </button>
          </div>
        </div>

        <!-- Filter Tabs -->
        <div class="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar pb-1 border-b border-[#1e2638] text-xs font-mono">
          <div class="flex items-center gap-1.5 flex-1 min-w-0">
            <button type="button" onclick="ProtocolTasks.setTab('all')" class="px-3 py-1.5 rounded-xl font-bold transition-all ${tasksState.filterTab === 'all' ? 'bg-[#000000] border border-[#c5a880] text-[#c5a880] shadow-sm' : 'bg-[#090d14] border border-[#1e2638] text-[#94a3b8] hover:text-[#f8fafc]'}">
              Alle (${tasksState.tasks.length})
            </button>
            <button type="button" onclick="ProtocolTasks.setTab('submitted')" class="px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${tasksState.filterTab === 'submitted' ? 'bg-[#4a2818] border border-[#8a5232] text-[#f8fafc] shadow-sm' : 'bg-[#090d14] border border-[#1e2638] text-[#b3734a] hover:text-[#f8fafc]'}">
              <span>Prüfung</span>
              ${submittedCount > 0 ? `<span class="px-1.5 py-0.2 rounded-full text-[9px] bg-[#d4af37] text-black font-black">${submittedCount}</span>` : ''}
            </button>
            <button type="button" onclick="ProtocolTasks.setTab('due')" class="px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${tasksState.filterTab === 'due' ? 'bg-[#450a0a] border border-[#991b1b] text-[#f8fafc] shadow-sm' : 'bg-[#090d14] border border-[#1e2638] text-[#991b1b] hover:text-[#f8fafc]'}">
              <span>Fällig</span>
              ${pendingCount > 0 ? `<span class="px-1.5 py-0.2 rounded-full text-[9px] bg-[#991b1b] text-white font-black">${pendingCount}</span>` : ''}
            </button>
            <button type="button" onclick="ProtocolTasks.setTab('relief')" class="px-3 py-1.5 rounded-xl font-bold transition-all ${tasksState.filterTab === 'relief' ? 'bg-[#000000] border border-[#c5a880] text-[#c5a880]' : 'bg-[#090d14] border border-[#1e2638] text-[#94a3b8] hover:text-[#f8fafc]'}">
              Entlastung
            </button>
            <button type="button" onclick="ProtocolTasks.setTab('micro_ds')" class="px-3 py-1.5 rounded-xl font-bold transition-all ${tasksState.filterTab === 'micro_ds' ? 'bg-[#000000] border border-[#b3734a] text-[#b3734a]' : 'bg-[#090d14] border border-[#1e2638] text-[#94a3b8] hover:text-[#f8fafc]'}">
              Geste &amp; Disziplin
            </button>
          </div>
          ${isTop ? `
            <button type="button" onclick="ProtocolTasks.openCreateModal()" class="px-2.5 py-1.5 rounded-xl bg-[#090d14] hover:bg-[#101622] border border-[#1e2638] text-[#c5a880] font-bold text-xs flex items-center gap-1 touch-btn flex-shrink-0">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
              <span>+ Pflicht</span>
            </button>
          ` : ''}
        </div>

        <!-- Task Cards List -->
        <div class="space-y-2.5">
          ${filtered.length === 0 ? `
            <div class="py-8 text-center text-[#94a3b8] text-xs font-mono">
              Keine Pflichten in dieser Kategorie vorhanden.
            </div>
          ` : filtered.map(task => {
            const isSubmitted = task.status === 'submitted';
            const isApproved = task.status === 'approved';
            const isDue = task.isDueNow && task.status === 'pending';
            const isRelief = task.category === 'relief_service' || task.category === 'household';

            return `
              <div class="p-3.5 sm:p-4 rounded-2xl border transition-all space-y-2 ${isSubmitted ? 'bg-[#4a2818]/25 border-[#8a5232] shadow-md' : (isDue ? 'bg-[#450a0a]/20 border-[#991b1b] shadow-sm' : 'bg-[#090d14] border-[#1e2638]')}">
                <div class="flex items-start justify-between gap-2">
                  <div class="space-y-0.5 min-w-0 flex-1">
                    <div class="flex items-center gap-2">
                      <strong class="text-xs text-[#f8fafc] block truncate font-bold">${escapeHtml(task.title)}</strong>
                      <span class="px-2 py-0.5 rounded text-[9.5px] font-mono font-bold ${isSubmitted ? 'bg-[#4a2818] text-[#b3734a] border border-[#8a5232]' : (isApproved ? 'bg-[#142b24] text-[#2e5746] border border-[#2e5746]' : (isDue ? 'bg-[#450a0a] text-[#f8fafc] border border-[#991b1b]' : 'bg-[#000000] text-[#94a3b8] border border-[#1e2638]'))}">
                        ${isSubmitted ? 'In Prüfung' : (isApproved ? 'Anerkannt ✓' : (isDue ? 'Fällig' : 'Offen'))}
                      </span>
                    </div>
                    <p class="text-[10.5px] text-[#94a3b8] leading-snug break-words">${escapeHtml(task.desc)}</p>
                    ${task.submissionNote ? `
                      <p class="text-[10px] text-[#dfcaa9] italic pt-1 border-t border-[#1e2638]">
                        [Vollzugsnotiz]: „${escapeHtml(task.submissionNote)}“
                      </p>
                    ` : ''}
                  </div>
                  <span class="font-mono text-xs font-bold text-[#c5a880] flex-shrink-0">+${task.points} P</span>
                </div>

                <div class="flex items-center justify-between pt-1 border-t border-[#1e2638] text-xs">
                  <div class="flex items-center gap-2 text-[10px] text-[#94a3b8] font-mono">
                    <span>${task.interval === 'daily' ? `Täglich bis ${task.dueTime || '20:00'}` : (task.interval === 'weekly' ? `Wöchentlich um ${task.dueTime || '20:00'}` : 'Einmalig')}</span>
                    ${isRelief ? '<span class="text-[#c5a880] font-bold">· Entlastungsdienst</span>' : '<span class="text-[#b3734a] font-bold">· Micro-D/s</span>'}
                  </div>

                  <div class="flex items-center gap-1.5 font-mono text-[10px]">
                    ${!isTop && task.status === 'pending' ? `
                      <button type="button" onclick="ProtocolTasks.openSubmitModal('${task.id}')" class="px-3 py-1.5 rounded-xl bg-[#c5a880] hover:bg-[#dfcaa9] text-black font-bold flex items-center gap-1 touch-btn shadow-sm">
                        <span>Erledigt melden ↗</span>
                      </button>
                    ` : ''}

                    ${isTop && isSubmitted ? `
                      <button type="button" onclick="ProtocolTasks.approve('${task.id}')" class="px-3 py-1.5 rounded-xl bg-[#142b24] hover:bg-[#2e5746] text-[#f8fafc] border border-[#2e5746] font-bold touch-btn shadow-sm">
                        Anerkennen (+${task.points})
                      </button>
                      <button type="button" onclick="ProtocolTasks.openRejectModal('${task.id}')" class="px-2.5 py-1.5 rounded-xl bg-[#000000] hover:bg-[#450a0a] text-[#94a3b8] hover:text-[#f8fafc] border border-[#1e2638] font-bold touch-btn">
                        Abweisen...
                      </button>
                    ` : ''}

                    ${isTop && !isSubmitted ? `
                      <button type="button" onclick="ProtocolTasks.deleteTask('${task.id}')" title="Pflicht löschen" class="p-1.5 rounded-lg text-[#94a3b8] hover:text-[#991b1b] touch-btn">
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
      modal.className = "fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4";
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="w-full max-w-md bg-[#090d14] border border-[#1e2638] rounded-3xl p-5 space-y-4 shadow-2xl text-xs text-[#f8fafc] font-sans">
        <div class="flex items-center justify-between border-b border-[#1e2638] pb-3">
          <div>
            <h3 class="text-sm font-bold text-white font-serif">Neue Pflicht anordnen</h3>
            <span class="text-[10px] text-[#94a3b8] font-mono">Intervall, Uhrzeit und Tribut festlegen</span>
          </div>
          <button type="button" onclick="document.getElementById('modal-create-task').style.display='none'" class="p-1.5 text-[#94a3b8] hover:text-white">
            ✕
          </button>
        </div>

        <div class="space-y-3">
          <div>
            <label class="text-[10px] font-mono text-[#94a3b8] uppercase block mb-1">Titel der Pflicht:</label>
            <input type="text" id="input-task-title" placeholder="z. B. Schuhe putzen &amp; auf Knien servieren" class="w-full px-3 py-2 rounded-xl bg-[#000000] border border-[#1e2638] text-white text-xs focus:border-[#c5a880] focus:outline-none" />
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="text-[10px] font-mono text-[#94a3b8] uppercase block mb-1">Kategorie:</label>
              <select id="select-task-cat" class="w-full px-2.5 py-2 rounded-xl bg-[#000000] border border-[#1e2638] text-white text-xs">
                <option value="relief_service">Stiller Dienst am Top</option>
                <option value="household">Haushalt &amp; Ordnung</option>
                <option value="micro_ds">Micro-D/s &amp; Geste</option>
                <option value="discipline">Disziplin &amp; Körper</option>
              </select>
            </div>
            <div>
              <label class="text-[10px] font-mono text-[#94a3b8] uppercase block mb-1">Tribut-Punkte:</label>
              <input type="number" id="input-task-points" value="20" min="5" max="200" class="w-full px-3 py-2 rounded-xl bg-[#000000] border border-[#1e2638] text-white text-xs font-mono" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="text-[10px] font-mono text-[#94a3b8] uppercase block mb-1">Intervall:</label>
              <select id="select-task-interval" class="w-full px-2.5 py-2 rounded-xl bg-[#000000] border border-[#1e2638] text-white text-xs">
                <option value="daily">Täglich</option>
                <option value="weekly">Wöchentlich</option>
                <option value="once">Einmalig</option>
              </select>
            </div>
            <div>
              <label class="text-[10px] font-mono text-[#94a3b8] uppercase block mb-1">Fällig bis (Uhrzeit):</label>
              <input type="time" id="input-task-duetime" value="20:00" class="w-full px-3 py-2 rounded-xl bg-[#000000] border border-[#1e2638] text-white text-xs font-mono" />
            </div>
          </div>

          <div>
            <label class="text-[10px] font-mono text-[#94a3b8] uppercase block mb-1">Genaue Ausführungs-Anweisung:</label>
            <textarea id="input-task-desc" rows="2" placeholder="Haltung, Rhythmus und genaue Bedingungen..." class="w-full px-3 py-2 rounded-xl bg-[#000000] border border-[#1e2638] text-white text-xs focus:border-[#c5a880] focus:outline-none"></textarea>
          </div>
        </div>

        <div class="pt-2 border-t border-[#1e2638] flex justify-end gap-2 font-mono">
          <button type="button" onclick="document.getElementById('modal-create-task').style.display='none'" class="px-3.5 py-2 rounded-xl bg-[#000000] border border-[#1e2638] text-[#94a3b8] font-bold text-xs touch-btn">Abbrechen</button>
          <button type="button" onclick="ProtocolTasks.saveNewTask()" class="px-4 py-2 rounded-xl bg-[#c5a880] hover:bg-[#dfcaa9] text-black font-bold text-xs touch-btn shadow-md">Pflicht anordnen ✓</button>
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
      modal.className = "fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4";
      document.body.appendChild(modal);
    }

    loadTasksState();
    const task = tasksState.tasks.find(t => t.id === taskId);
    if (!task) return;

    modal.innerHTML = `
      <div class="w-full max-w-md bg-[#090d14] border border-[#1e2638] rounded-3xl p-5 space-y-4 shadow-2xl text-xs text-[#f8fafc] font-sans">
        <div class="flex items-center justify-between border-b border-[#1e2638] pb-3">
          <div>
            <h3 class="text-sm font-bold text-white font-serif">Pflicht als erledigt melden</h3>
            <span class="text-[10px] text-[#94a3b8] font-mono">Reiche deinen Vollzug zur Prüfung beim Top ein</span>
          </div>
          <button type="button" onclick="document.getElementById('modal-submit-task').style.display='none'" class="p-1.5 text-[#94a3b8] hover:text-white">✕</button>
        </div>

        <div class="p-3 rounded-2xl bg-[#000000] border border-[#1e2638] space-y-1">
          <strong class="text-xs text-white block">${escapeHtml(task.title)}</strong>
          <p class="text-[10.5px] text-[#94a3b8]">${escapeHtml(task.desc)}</p>
        </div>

        <div class="space-y-1.5">
          <label class="text-[10px] font-mono text-[#94a3b8] uppercase block">Notiz an den Top (optional):</label>
          <input type="text" id="input-submit-task-note" placeholder="z. B. Gründlich geputzt / Pünktlich vollzogen..." class="w-full px-3 py-2 rounded-xl bg-[#000000] border border-[#1e2638] text-white text-xs focus:border-[#c5a880] focus:outline-none" />
        </div>

        <div class="pt-2 border-t border-[#1e2638] flex justify-end gap-2 font-mono">
          <button type="button" onclick="document.getElementById('modal-submit-task').style.display='none'" class="px-3.5 py-2 rounded-xl bg-[#000000] border border-[#1e2638] text-[#94a3b8] font-bold text-xs touch-btn">Abbrechen</button>
          <button type="button" onclick="ProtocolTasks.confirmSubmit('${task.id}')" class="px-4 py-2 rounded-xl bg-[#c5a880] hover:bg-[#dfcaa9] text-black font-bold text-xs touch-btn shadow-md">Zur Prüfung einreichen ↗</button>
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
