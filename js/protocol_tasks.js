/**
 * js/protocol_tasks.js
 * TACTUS Kontextuelle Service- & Micro-D/s-Engine (V3.0 Hyper-Dynamisch)
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien:
 * - Dynamische Pflichten-Generierung: Pflicht = f(Top-Mental-Load, Bottom-Arbeitsplatz, Keuschheitsphase, Tageszeit)
 * - Top-Entlastungs-Trigger: Umschaltung zwischen 'exhausted', 'balanced' und 'strict'
 *   wandelt Pflichten sofort in stillen Dienst zur Entlastung des Tops um
 * - Generative Micro-D/s Synthese via AIAdapter (Gemini, Claude, GPT) oder prozeduraler Heuristik
 * - Anti-TftB Workflow: Bottom meldet Vollzug ('submitted'); Punkte werden
 *   AUSSCHLIESSLICH nach Prüfung und Bestätigung durch den Top verbucht
 * - Automatische Verknüpfung mit ProtocolCore.addTransaction() und CloudSync
 * - 100 % frei von infantilen System-Emojis in Buttons und Datenstrukturen
 * - Keine window.alert() / window.confirm() Aufrufe unter keinen Umständen
 */

(function(window) {
  'use strict';

  const STORAGE_KEY_TASKS = 'tactus_tasks_state';
  const STORAGE_KEY_TOP_LOAD = 'tactus_top_mental_load';
  const STORAGE_KEY_LEGACY = 'pactum_tasks_state';

  // Prozedurale Pflichten-Bibliothek für situative Heuristik-Generierung
  const PROCEDURAL_DUTY_TEMPLATES = {
    // 1. Entlastungspflichten bei Erschöpfung des Tops (Mental Load Schutz)
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

    // 2. Ausgewogene Gesten bei stabiler, führender Energie
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
        dayOfWeek: 6, // Samstag
        dueTime: "09:30",
        points: 30,
        desc: "Kaffee und Frühstück für den Top servieren; dabei aufrechte Haltung und Danken für die Mahlzeit."
      }
    ],

    // 3. Strikte Inspektions- und Disziplinar-Pflichten
    strict: [
      {
        title: "Intimrasur & Körperpflege-Appell",
        category: "discipline",
        interval: "weekly",
        dayOfWeek: 5, // Freitag
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
    topMentalLoad: 'balanced', // 'exhausted' | 'balanced' | 'strict'
    lastSynthesizedAt: null,
    updatedAt: Date.now()
  };

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

  function synthesizeProceduralTasks(mentalLoad = 'balanced', forceReset = false) {
    const pool = PROCEDURAL_DUTY_TEMPLATES[mentalLoad] || PROCEDURAL_DUTY_TEMPLATES.balanced;
    const now = Date.now();

    // Arbeitsplatz-Profil des Bottoms berücksichtigen
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

    // Arbeitsplatz-spezifische Pflicht ergänzen
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
      // Nur bestehende Pflichten belassen, die aktuell 'submitted' sind, Rest durch neue Situation ersetzen
      const inReview = tasksState.tasks.filter(t => t.status === 'submitted');
      tasksState.tasks = [...inReview, ...generated];
    }

    tasksState.topMentalLoad = mentalLoad;
    tasksState.lastSynthesizedAt = now;
    saveTasksState();
    checkAllDueDates();
  }

  async function generateAIAssistedDailyDuties() {
    if (!isUserTop()) {
      showToast("Nur der Top kann situative Pflichten generieren.");
      return;
    }

    if (!window.AIAdapter || typeof window.AIAdapter.generateText !== 'function') {
      synthesizeProceduralTasks(tasksState.topMentalLoad, false);
      renderTasksDashboard();
      showToast("Situative Pflichten prozedural aktualisiert ✓");
      return;
    }

    showToast("Generiere situative Pflichten abgestimmt auf deinen Zustand...");

    let topName = 'Top';
    let bottomName = 'Bottom';
    let tensionDesc = 'Tag 4 im Verschluss';
    let workplace = 'Büro / Homeoffice';

    if (window.HubContext && typeof window.HubContext.getUnifiedState === 'function') {
      const ctx = window.HubContext.getUnifiedState();
      topName = ctx.metadata.topName;
      bottomName = ctx.metadata.bottomName;
      tensionDesc = `Tag ${ctx.v2_somatic.daysLocked} im Verschluss (${ctx.v2_somatic.tension.archetype.name})`;
      if (ctx.v4_energy.workplaceProfile) workplace = ctx.v4_energy.workplaceProfile.label;
    }

    const prompt = `
Erstelle 3 maßgeschneiderte, alltagstaugliche Pflichten für ${bottomName} (Bottom), die heute von ${topName} (Top) angeordnet werden.

KONTEXT:
- Mental Load des Tops: ${tasksState.topMentalLoad} (${tasksState.topMentalLoad === 'exhausted' ? 'ERSCHÖPFT ──► Pflichten MÜSSEN den Top im Haushalt entlasten oder stillen Pflegedienst leisten!' : 'Führend & Ausgeglichen'})
- Keuschheit: ${tensionDesc}
- Beruf des Bottoms: ${workplace}

LEITLINIEN:
- Kein Kitsch, keine Schwulst ('andächtig', 'feierlich' strikt verboten).
- Fokus auf echte Entlastung des Tops (Anti-TftB).

Antworte als valides JSON-Array ohne Fences:
[
  {
    "title": "Prägnanter Titel",
    "category": "relief_service | micro_ds | household | discipline",
    "interval": "daily | weekly | once",
    "dueTime": "20:00",
    "points": 25,
    "desc": "Konkrete, präzise Handlungsanweisung für ${bottomName}."
  }
]
`;

    try {
      const generated = await window.AIAdapter.generateText({
        systemPrompt: "Du bist der somatische Alltagsregisseur für TACTUS.",
        userPrompt: prompt,
        temperature: 0.6,
        returnJson: true
      });

      if (Array.isArray(generated) && generated.length > 0) {
        const now = Date.now();
        const formatted = generated.map((t, i) => ({
          id: `task_ai_${now}_${i}`,
          title: t.title || 'Situative Pflicht',
          category: t.category || 'household',
          interval: t.interval || 'daily',
          dueTime: t.dueTime || '20:00',
          dayOfWeek: 0,
          points: parseInt(t.points, 10) || 20,
          desc: t.desc || '',
          status: 'pending',
          lastSubmittedAt: null,
          lastApprovedAt: null,
          createdAt: now
        }));

        const inReview = tasksState.tasks.filter(t => t.status === 'submitted');
        tasksState.tasks = [...inReview, ...formatted];
        tasksState.lastSynthesizedAt = now;
        saveTasksState();
        renderTasksDashboard();
        showToast("✓ Neue situative Pflichten durch KI kalibriert!");
        return;
      }
    } catch (err) {
      console.warn("[TACTUS Tasks] KI-Pflichtengenerierung fehlgeschlagen, nutze Heuristik:", err);
    }

    // Heuristik-Fallback
    synthesizeProceduralTasks(tasksState.topMentalLoad, false);
    renderTasksDashboard();
    showToast("Situative Pflichten prozedural aktualisiert ✓");
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

  function checkAllDueDates() {
    const now = new Date();
    const currentHours = now.getHours();
    const currentMins = now.getMinutes();
    const currentTimeStr = `${String(currentHours).padStart(2, '0')}:${String(currentMins).padStart(2, '0')}`;
    const currentDayOfWeek = now.getDay();
    let hasChanged = false;

    tasksState.tasks.forEach(task => {
      if (task.status === 'submitted') return; // Wartet auf Freigabe durch den Top

      // Reset täglicher Aufgaben am Folgetag
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

      // Reset wöchentlicher Aufgaben bei neuem Wochenzyklus
      if (task.interval === 'weekly' && task.lastApprovedAt) {
        const diffMs = now.getTime() - task.lastApprovedAt;
        if (diffMs > 5 * 24 * 3600 * 1000) {
          task.status = 'pending';
          hasChanged = true;
        }
      }

      // Fälligkeits-Erkennung
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
      window.ChatApp.postSystemEvent(`Pflicht zur Prüfung eingereicht: ${task.title}${noteSuffix}. Freigabe durch den Top ausstehend.`);
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

    // Punkte im Transaktions-Logbuch gutschreiben
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

  function rejectTaskByTop(taskId, rejectionReason = '') {
    if (!isUserTop()) {
      showToast("Nur der Top kann Pflichten ablehnen.");
      return;
    }

    loadTasksState();
    const task = tasksState.tasks.find(t => t.id === taskId);
    if (!task) return;

    task.status = 'pending';
    task.lastSubmittedAt = null;

    saveTasksState();
    renderTasksDashboard();

    const reason = rejectionReason ? ` Grund: ${rejectionReason}` : ' Bitte gründlich nachbessern.';
    showToast(`Pflicht abgewiesen.${reason}`);

    if (window.ChatApp && typeof window.ChatApp.postSystemEvent === 'function') {
      window.ChatApp.postSystemEvent(`Pflicht abgewiesen: „${task.title}“ wurde vom Top nicht anerkannt.${reason}`);
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
            <div class="flex items-center gap-1.5">
              <span class="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold block">Führungszustand des Tops:</span>
            </div>
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
                    <p class="text-[10.5px] text-slate-400 leading-snug line-clamp-2">${escapeHtml(task.desc)}</p>
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
                      <button type="button" onclick="ProtocolTasks.reject('${task.id}')" class="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-200 border border-slate-700 font-bold text-xs touch-btn">
                        Abweisen
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
    setTab: setFilterTab,
    setMentalLoad: setTopMentalLoad,
    generateAIAssisted: generateAIAssistedDailyDuties,
    synthesizeProcedural: synthesizeProceduralTasks,
    submit: submitTaskByBottom,
    openSubmitModal: openSubmitModal,
    confirmSubmit: confirmSubmit,
    approve: approveTaskByTop,
    reject: rejectTaskByTop,
    openCreateModal: openCreateModal,
    saveNewTask: saveNewTask,
    deleteTask: deleteTask,
    checkDueDates: checkAllDueDates,
    getTasks: function() { loadTasksState(); return tasksState.tasks.slice(); },
    getMentalLoad: function() { loadTasksState(); return tasksState.topMentalLoad; }
  };

  window.ProtocolTasks = api;
  // Abwärtskompatibler Alias für bestehende Templates
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
