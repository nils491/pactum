/**
 * js/protocol_coach.js
 * TACTUS Top-Führungsassistent, D/s-Coach, Arbeitsplatz-Ergonomie & Reibungs-Analytik (V3.0 Haute-Horlogerie)
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien nach Master-Roadbook:
 * - 100 % UTF-8 Integrität: Echte deutsche Umlaute (ä, ö, ü, ß) im gesamten Modul
 * - Haute-Horlogerie Palette: OLED-Schwarz, Graphit, Champagner-Gold, Malachit, Cognac & Bordeaux
 * - Strikte Top-First Doktrin: Schutz vor Top Fatigue (Erschöpfung durch unbezahlten Mental Load)
 * - 5 Biomechanische Alltags- und Arbeitsplatzprofile für den Bottom
 * - Dreiteilige alltagstaugliche Tages-Impulse (Morgen, Arbeitstag, Feierabend)
 * - Multi-KI Anbindung via AIAdapter mit resilienter prozeduraler Offline-Heuristik
 * - Reibungs- & Verhaltensmuster-Analytik mit klickbaren Deeplinks (#view=chores, #tab=dashboard, #tab=contract)
 * - Anti-TftB Durchsetzung (§ 2 Abs. 2 & § 6 Beziehungsvertrag)
 * - 100 % frei von infantilen System-Emojis, keine window.alert() / confirm() Aufrufe
 */

(function(window) {
  'use strict';

  const STORAGE_KEY_WORKPLACE = 'tactus_bottom_workplace';
  const STORAGE_KEY_WORKPLACE_LEGACY = 'kompass_bottom_workplace';
  const STORAGE_KEY_LAST_DIRECTIVE = 'tactus_last_coach_directive';
  const STORAGE_KEY_TOP_LOAD = 'tactus_top_mental_load';

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

  const WORKPLACE_METADATA = {
    desk_office: {
      id: 'desk_office',
      label: 'Büro / Homeoffice',
      fullTitle: 'Büro / Homeoffice (Dauersitzen & Bildschirmarbeit)',
      posture: 'Sitzen auf Bürostuhl mit 90°-Hüftwinkel',
      frictionRisk: 'Dauerdruck auf Schambein und Hodenansatz; venöse Stauung im Beckenboden',
      spuelFenster: 'Mindestens alle 12 Stunden',
      hint: 'Dauerdruck auf Schambein und Hodenansatz im Sitzen. Teasing: Kegel-Befehle oder diskreter Foto-Appell.',
      defaultTeaser: '3x 20 Beckenboden-Kontraktionen (Kegel) während Meetings zur Entlastung des Schambeinbogens.'
    },
    craft_physical: {
      id: 'craft_physical',
      label: 'Handwerk / Baustelle',
      fullTitle: 'Handwerk / Baustelle (Körperliche Belastung & Schwitzen)',
      posture: 'Bücken, Heben, Treppensteigen, Knien auf harten Böden',
      frictionRisk: 'Starker Schweiß, Staub und Reibung; erhöhtes Mazerationsrisiko',
      spuelFenster: 'Alle 6 Stunden dringend empfohlen',
      hint: 'Staub- und Schweißbelastung. Priorität: Urologische Feierabend-Spülung (50ml Kochsalzlösung) sofort nach Schichtende!',
      defaultTeaser: 'Konzentrierter Gehorsam im Alltag. Feierabend-Spülung unter der Dusche sofort nach Heimkehr vorzeigen.'
    },
    medical_service: {
      id: 'medical_service',
      label: 'Pflege / Gastronomie',
      fullTitle: 'Pflege / Gastronomie / Einzelhandel (Dauerhaftes Stehen & Gehen)',
      posture: '8–12 Stunden aufrechtes Stehen und zügiges Gehen in engen Kasacks/Schuhen',
      frictionRisk: 'Reibung an den Schenkelinnenseiten; Ermüdung der Lendenwirbelsäule',
      spuelFenster: 'Alle 8 Stunden',
      hint: 'Hohe körperliche Bein-Ermüdung. Disziplin: Kniestand-Appell erst nach kurzer Kreislauf-Entlastung; abends Fußdienst am Top.',
      defaultTeaser: 'Jeder anstrengende Schritt erinnert an den Verschluss. Abends: Umfassende Fußmassage für den Top.'
    },
    driver_field: {
      id: 'driver_field',
      label: 'Fahrer / Außendienst',
      fullTitle: 'Fahrer / Außendienst / Pendler (Autositz & Vibration)',
      posture: 'Längeres Sitzen im Fahrzeugsitz mit Vibration und Beckenerschütterung',
      frictionRisk: 'Reibung durch Sicherheitsgurt und Schaltsitz; Hitzeentwicklung im Lendenbereich',
      spuelFenster: 'Alle 10 Stunden',
      hint: 'Vibration und passive Erregung im Autositz. Teasing: Konzentrationsanker an jeder roten Ampel.',
      defaultTeaser: 'An jeder roten Ampel: Hände fest am Lenkrad lassen, aufrecht hinsetzen und tief ausatmen.'
    },
    shift_variable: {
      id: 'shift_variable',
      label: 'Schichtdienst',
      fullTitle: 'Schichtdienst / Wechselschicht (Verschobener Biorhythmus)',
      posture: 'Unregelmäßige Tag-Nacht-Rhythmen, gestörte REM-Schlafphasen',
      frictionRisk: 'Verschobene Testosteron-Peaks; erhöhte Cortisolausschüttung bei Schlafmangel',
      spuelFenster: 'Spülzeiten flexibel an Schlafblöcke anpassen',
      hint: 'Verschobener Biorhythmus. Schlafzimmer vor Tagesschlaf verdunkeln; Gewichtsdecke zur Vagus-Stabilisierung nutzen.',
      defaultTeaser: 'Stille Konzentration in der Schicht. Kaffee ans Bett bringen, wenn der Top aufwacht.'
    }
  };

  function getActiveWorkplaceProfile() {
    const raw = localStorage.getItem(STORAGE_KEY_WORKPLACE) || localStorage.getItem(STORAGE_KEY_WORKPLACE_LEGACY) || 'desk_office';
    return WORKPLACE_METADATA[raw] || WORKPLACE_METADATA.desk_office;
  }

  function setWorkplaceProfile(workplaceId) {
    if (!WORKPLACE_METADATA[workplaceId]) return;
    localStorage.setItem(STORAGE_KEY_WORKPLACE, workplaceId);
    localStorage.setItem(STORAGE_KEY_WORKPLACE_LEGACY, workplaceId);

    if (window.CloudSync && typeof window.CloudSync.trigger === 'function') {
      window.CloudSync.trigger();
    }

    updateWorkplaceUI();
    showToast(`✓ Berufs-Kontext aktualisiert: ${WORKPLACE_METADATA[workplaceId].label}`);
  }

  function updateWorkplaceUI() {
    const profile = getActiveWorkplaceProfile();
    const select = document.getElementById('coach-workplace-select');
    const label = document.getElementById('coach-workplace-label');
    const hint = document.getElementById('coach-workplace-hint');

    if (select) select.value = profile.id;
    if (label) label.innerText = profile.label;
    if (hint) hint.innerText = `${profile.hint} (Spülung: ${profile.spuelFenster})`;
  }

  function getDynamicSomaticState() {
    let daysLocked = 1;
    let isLocked = false;
    let hardwareName = 'Keuschheitskäfig';

    if (window.ProtocolCore && typeof window.ProtocolCore.getState === 'function') {
      const state = window.ProtocolCore.getState();
      isLocked = !!state.isLocked;
      if (isLocked && state.lockedSince) {
        const diffMs = Math.max(0, Date.now() - state.lockedSince);
        daysLocked = Math.max(1, Math.floor(diffMs / (24 * 3600 * 1000)) + 1);
      }
      hardwareName = state.hardware || 'Cherrykeeper Micro Stub';
    }

    let tensionData = {
      effectiveTensionIndex: daysLocked,
      archetype: { id: 'adaptation', name: 'Phase 1: Gewöhnung & Antizipation', directiveObjective: 'Gewebeschutz & Führung' },
      pelvicSensitivityScore: 5
    };

    if (window.ChastityDatabase && typeof window.ChastityDatabase.calculateDynamicTension === 'function') {
      tensionData = window.ChastityDatabase.calculateDynamicTension({ daysLocked });
    }

    let topMentalLoad = 'balanced';
    if (window.ProtocolTasks && typeof window.ProtocolTasks.getMentalLoad === 'function') {
      topMentalLoad = window.ProtocolTasks.getMentalLoad();
    } else {
      topMentalLoad = localStorage.getItem(STORAGE_KEY_TOP_LOAD) || 'balanced';
    }

    return {
      isLocked,
      daysLocked,
      hardwareName,
      tensionData,
      topMentalLoad
    };
  }

  function synthesizeProceduralDirective(somatic, workplace, names) {
    const top = names.top || 'Top';
    const sub = names.sub || 'Bottom';
    const load = somatic.topMentalLoad;
    const days = somatic.daysLocked;
    const isLocked = somatic.isLocked;

    // 1. TOP IST ERSCHÖPFT: STRIKTER TOP-FATIGUE SCHUTZ
    if (load === 'exhausted') {
      return `
<strong class="text-[#c5a880] block font-bold mb-1">1. Morgen-Impuls (Vollkommene Stille):</strong>
${sub} verharrt vor dem Verlassen der Wohnung 30 Sekunden im aufrechten Kniestand mit gesenktem Blick vor deinen Knien. Kein Redebedarf, kein Frühstücks-Smalltalk. Ein stummer Kopfstreich genügt als Entlassung in den Tag.<br><br>
<strong class="text-[#c5a880] block font-bold mb-1">2. Alltags-Teaser (${escapeHtml(workplace.label)}):</strong>
Kein forderndes Erotik-Teasing heute. Führen ist ein Privileg der Freude, kein unbezahlter Verwaltungsjob. ${sub} konzentriert sich voll auf seine Arbeit und erledigt auf dem Heimweg unaufgefordert die Einkäufe.<br><br>
<strong class="text-[#c5a880] block font-bold mb-1">3. Feierabend-Dienst (Haushaltsentlastung &amp; Entlastung des Tops):</strong>
Bevor du die Wohnung betrittst, hat die Küche makellos bereinigt zu sein. ${sub} nimmt dir an der Tür schweigend Mantel und Schuhe ab, reicht ein Glas Wasser oder Tee und bietet eine 20-minütige Nacken- oder Fußmassage im Halbdunkel ohne jede Gegenforderung an.
      `.trim();
    }

    // 2. TOP IST STRENG: INSPEKTION & KÖRPERLICHE ZUCHT
    if (load === 'strict') {
      return `
<strong class="text-[#b3734a] block font-bold mb-1">1. Morgen-Appell (Haltungskontrolle):</strong>
Appell im Kniestand. ${isLocked ? `Vorzeigen des tadellosen Sitzes des ${escapeHtml(somatic.hardwareName)}. Trockener, ruhiger Blickkontakt für 60 Sekunden ohne Blinzeln.` : `Morgenprüfung der Haltung und klares Bekenntnis zum heutigen Gehorsam.`}<br><br>
<strong class="text-[#b3734a] block font-bold mb-1">2. Alltags-Teaser (${escapeHtml(workplace.label)}):</strong>
${escapeHtml(workplace.defaultTeaser)} Jedes Zögern oder Murren wird als Pflichtverletzung gewertet.<br><br>
<strong class="text-[#b3734a] block font-bold mb-1">3. Feierabend-Dienst (Inspektion &amp; Rapport):</strong>
${isLocked ? `Urologische 50ml-Kochsalzspülung unter der Dusche durchführen und das reizfreie Hautbild vorzeigen. ` : ``}Danach 10 Schläge mit der flachen Hand auf das Gesäß zur Besinnung über den Gehorsam des Tages, quittiert durch lautes Mitzählen.
      `.trim();
    }

    // 3. TOP IST AUSGEGLICHEN: SOUVERÄNE FÜHRUNG & HARMONISCHE NÄHE
    return `
<strong class="text-[#c5a880] block font-bold mb-1">1. Morgen-Impuls (Körperlicher Anker):</strong>
Gemeinsamer Duftanker vor dem Verlassen der Wohnung: Ein Hauch deines Parfüms auf das Handgelenk von ${sub} als ständiger Begleiter während des Arbeitstages.<br><br>
<strong class="text-[#c5a880] block font-bold mb-1">2. Alltags-Teaser (${escapeHtml(workplace.label)}):</strong>
${escapeHtml(workplace.defaultTeaser)} ${isLocked ? `Tag ${days} im Verschluss fordert Achtsamkeit: Schwellkörperdruck bewusst wahrnehmen, ohne zu hadern.` : `Aufrechte Haltung am Arbeitsplatz einhalten.`}<br><br>
<strong class="text-[#c5a880] block font-bold mb-1">3. Feierabend-Dienst (Dienstbare Entlastung):</strong>
Empfang an der Tür. ${sub} schenkt dir seine volle Aufmerksamkeit, nimmt dir den mentalen Ballast des Tages ab und serviert das Abendessen in ruhiger, dienender Haltung.
    `.trim();
  }

  async function generateDailyDirective() {
    if (!isUserTop()) {
      showToast("Der Führungsassistent ist ausschließlich für den Top bestimmt.");
      return;
    }

    const contentBox = document.getElementById('ai-coach-directive-content');
    if (!contentBox) return;

    contentBox.innerHTML = `
      <div class="py-5 text-center space-y-2 animate-pulse">
        <div class="w-6 h-6 border-2 border-[#c5a880]/30 border-t-[#c5a880] rounded-full animate-spin mx-auto"></div>
        <span class="text-xs text-[#c5a880] font-mono block">Berechne situative Tages-Empfehlung...</span>
        <span class="text-[10px] text-[#94a3b8] block">Koppelt Führungszustand, Tragetage und Arbeitsplatz-Kontext</span>
      </div>
    `;

    const somatic = getDynamicSomaticState();
    const workplace = getActiveWorkplaceProfile();
    let names = { top: 'Top', sub: 'Bottom' };

    if (window.HubContext && typeof window.HubContext.getNames === 'function') {
      const rawNames = window.HubContext.getNames();
      const roles = window.HubContext.getRoles();
      names.top = rawNames[roles.topRole] || 'Top';
      names.sub = rawNames[roles.bottomRole] || 'Bottom';
    }

    let generatedHtml = "";

    // 1. KI-Pfad via AIAdapter falls konfiguriert
    if (window.AIAdapter && typeof window.AIAdapter.generateText === 'function') {
      try {
        let systemPrompt = "Du bist der leitende Führungsassistent und D/s-Coach für den Top im Beziehungs-Betriebssystem TACTUS (tactus.digital).";
        if (window.HubContext && typeof window.HubContext.getLanguageDoctrine === 'function') {
          systemPrompt += "\n\n" + window.HubContext.getLanguageDoctrine();
        }

        const userPrompt = `
Erstelle für ${names.top} (Top) eine prägnante, alltagstaugliche Führungs-Empfehlung zur Begleitung von ${names.sub} (Bottom).

KONTEXT DES PAARES HEUTE:
- Führender Partner: ${names.top} (Führungszustand / Mental Load: ${somatic.topMentalLoad.toUpperCase()})
- Keuschheitsstatus: ${somatic.isLocked ? `Tag ${somatic.daysLocked} verriegelt im ${somatic.hardwareName} (${somatic.tensionData.archetype.name})` : 'Unverschlossen / Frei'}
- Beruf & Alltags-Kontext des Bottoms: ${workplace.fullTitle}
- Ergonomie-Risiko: ${workplace.frictionRisk}
- Urologisches Spülfenster: ${workplace.spuelFenster}

WICHTIGE LEITPLANKEN:
- Wenn der Top 'EXHAUSTED' ist: Verbiete fordernde Erotik! Wandle den Tag zwingend in stillen Entlastungsdienst durch den Sub um (Mental-Load Beseitigung, Fußmassage, Schuhe abnehmen).
- Wenn der Top 'STRICT' ist: Fokus auf Haltungsprüfung, Kniestand und disziplinierte Sühne.
- Wenn der Top 'BALANCED' ist: Harmonische Balance aus Führung, Alltagsentlastung und Nähe.
- Formuliere exakt 3 nummerierte Absätze: 1. Morgen-Impuls, 2. Alltags-Teaser (${workplace.label}), 3. Feierabend-Dienst.
- Direkt, erwachsen, souverän, frei von Kitsch. Antworte in wohlgeformtem HTML mit <strong> und <br>-Tags.
`;

        const aiResponse = await window.AIAdapter.generateText({
          systemPrompt: systemPrompt,
          userPrompt: userPrompt,
          temperature: 0.65
        });

        if (aiResponse && aiResponse.trim().length > 60) {
          generatedHtml = aiResponse.trim();
        }
      } catch (errAi) {
        console.debug("[TACTUS Coach] KI-Synthese fehlgeschlagen, nutze Heuristik:", errAi);
      }
    }

    // 2. Fallback auf prozedurale Heuristik
    if (!generatedHtml) {
      generatedHtml = synthesizeProceduralDirective(somatic, workplace, names);
    }

    try {
      localStorage.setItem(STORAGE_KEY_LAST_DIRECTIVE, JSON.stringify({
        html: generatedHtml,
        timestamp: Date.now(),
        workplaceId: workplace.id,
        mentalLoad: somatic.topMentalLoad
      }));
    } catch (e) {}

    contentBox.innerHTML = `
      <div class="space-y-2.5 text-[11px] text-[#f8fafc] leading-relaxed font-sans">
        ${generatedHtml}
        <div class="pt-2.5 border-t border-[#1e2638] flex items-center justify-between text-[9.5px] font-mono text-[#94a3b8]">
          <span>Kontext: ${escapeHtml(workplace.label)} · Load: ${escapeHtml(somatic.topMentalLoad)}</span>
          <span>Berechnet um ${new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    `;

    showToast("✓ Tages-Empfehlung für den Top berechnet");
  }

  function loadCachedDirective() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_LAST_DIRECTIVE);
      if (raw) {
        const parsed = JSON.parse(raw);
        const contentBox = document.getElementById('ai-coach-directive-content');
        if (contentBox && parsed.html) {
          contentBox.innerHTML = `
            <div class="space-y-2.5 text-[11px] text-[#f8fafc] leading-relaxed font-sans">
              ${parsed.html}
              <div class="pt-2.5 border-t border-[#1e2638] flex items-center justify-between text-[9.5px] font-mono text-[#94a3b8]">
                <span>Kontext: ${escapeHtml(parsed.workplaceId || '')}</span>
                <span>Gespeichert vom Vortag</span>
              </div>
            </div>
          `;
        }
      }
    } catch (e) {}
  }

  function renderFrictionAnalytics() {
    const container = document.getElementById('ai-coach-friction-list');
    if (!container) return;

    const frictionPoints = [];

    // 1. Überfällige Aufgaben aus ProtocolTasks prüfen
    if (window.ProtocolTasks && typeof window.ProtocolTasks.getTasks === 'function') {
      const allTasks = window.ProtocolTasks.getTasks();
      const overdueTasks = allTasks.filter(t => t.status === 'pending' && t.isDueNow);
      const submittedTasks = allTasks.filter(t => t.status === 'submitted');

      if (overdueTasks.length > 0) {
        frictionPoints.push({
          type: 'overdue_chores',
          severity: 'high',
          badge: `${overdueTasks.length} überfällige Pflichten`,
          title: "Säumigkeit im Alltag (Disziplinarischer Anlass)",
          desc: `${overdueTasks.length} vereinbarte Aufgaben sind fällig, wurden aber noch nicht vollzogen. Disziplinierung nach § 7 Beziehungsvertrag empfohlen.`,
          actionHtml: `<a href="protocol.html#view=chores" class="px-2.5 py-1 rounded-xl bg-[#450a0a] text-white border border-[#991b1b] font-mono text-[9.5px] font-bold touch-btn">Zucht anordnen ↗</a>`
        });
      }

      if (submittedTasks.length > 0) {
        frictionPoints.push({
          type: 'submitted_awaiting_approval',
          severity: 'medium',
          badge: `${submittedTasks.length} in Prüfung`,
          title: "Vollzugsmeldungen warten auf Quittierung",
          desc: `Der Bottom hat Pflichten eingereicht. Zeitnahes Quittieren erhält den motivationalen Führungsfluss.`,
          actionHtml: `<a href="protocol.html#view=chores" class="px-2.5 py-1 rounded-xl bg-[#4a2818] text-[#f8fafc] border border-[#8a5232] font-mono text-[9.5px] font-bold touch-btn">Prüfen ↗</a>`
        });
      }
    }

    // 2. Orgasmus-Ratio aus ProtocolRatio prüfen
    if (window.ProtocolRatio && typeof window.ProtocolRatio.getProgress === 'function') {
      const ratioProgress = window.ProtocolRatio.getProgress();
      if (!ratioProgress.isTargetMet) {
        frictionPoints.push({
          type: 'ratio_unmet',
          severity: 'neutral',
          badge: `Lust-Ratio ${ratioProgress.topCount}:${ratioProgress.subCount}`,
          title: "Top-Höhepunkte haben strikte Priorität",
          desc: `Die Zielquote (${ratioProgress.target}:1) ist noch nicht erreicht (${ratioProgress.remainingInCycle} Top-Höhepunkte verbleibend). Gemäß § 5 Abs. 3 gilt strikte Schweigepflicht des Subs über eigene Ejakulation.`,
          actionHtml: `<a href="protocol.html#tab=dashboard" class="px-2.5 py-1 rounded-xl bg-[#090d14] text-[#c5a880] border border-[#c5a880]/50 font-mono text-[9.5px] font-bold touch-btn">Ratio einsehen ↗</a>`
        });
      }
    }

    // 3. Vertrags-Ratifizierung prüfen
    if (window.ProtocolContract && typeof window.ProtocolContract.getActiveContract === 'function') {
      const contract = window.ProtocolContract.getActiveContract();
      if (contract.status === 'draft' || !contract.signatureTop || !contract.signatureSub) {
        frictionPoints.push({
          type: 'contract_draft',
          severity: 'medium',
          badge: "Vertrag: Entwurf",
          title: "Bündnisvertrag noch unratifiziert",
          desc: "Der Beziehungsvertrag wurde noch nicht von beiden Partnern besiegelt. Eine feierliche Unterzeichnung schafft verbindliche Klarheit.",
          actionHtml: `<a href="protocol.html#tab=contract" class="px-2.5 py-1 rounded-xl bg-[#090d14] text-[#d4af37] border border-[#d4af37]/60 font-mono text-[9.5px] font-bold touch-btn">Ratifizieren ↗</a>`
        });
      }
    }

    // 4. Default wenn harmonisch
    if (frictionPoints.length === 0) {
      container.innerHTML = `
        <div class="p-3.5 rounded-2xl bg-[#142b24]/40 border border-[#2e5746] space-y-1 text-xs shadow-sm">
          <strong class="text-[#2e5746] block font-bold flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-[#2e5746] animate-pulse"></span>
            <span>Keine offenen Reibungspunkte</span>
          </strong>
          <p class="text-[10.5px] text-[#f8fafc] leading-snug">
            Die Dynamik läuft synchron: Alle Pflichten sind geregelt, die Ratio wird eingehalten und es bestehen keine akuten Schieflagen.
          </p>
        </div>
      `;
      return;
    }

    container.innerHTML = frictionPoints.map(f => `
      <div class="p-3.5 rounded-2xl border transition-all space-y-2 ${f.severity === 'high' ? 'bg-[#450a0a]/30 border-[#991b1b]' : (f.severity === 'medium' ? 'bg-[#4a2818]/30 border-[#8a5232]' : 'bg-[#090d14] border-[#1e2638]')}">
        <div class="flex items-center justify-between gap-2">
          <span class="text-[9.5px] font-mono px-2 py-0.5 rounded font-bold ${f.severity === 'high' ? 'bg-[#450a0a] text-white border border-[#991b1b]' : (f.severity === 'medium' ? 'bg-[#4a2818] text-[#f8fafc] border border-[#8a5232]' : 'bg-[#000000] text-[#c5a880] border border-[#c5a880]/50')}">
            ${escapeHtml(f.badge)}
          </span>
          ${f.actionHtml}
        </div>
        <strong class="text-xs text-[#f8fafc] block font-bold leading-tight">${escapeHtml(f.title)}</strong>
        <p class="text-[10.5px] text-[#94a3b8] leading-snug break-words">${escapeHtml(f.desc)}</p>
      </div>
    `).join('');
  }

  const api = {
    init: function() {
      updateWorkplaceUI();
      loadCachedDirective();
      renderFrictionAnalytics();
    },
    render: function() {
      updateWorkplaceUI();
      renderFrictionAnalytics();
    },
    setWorkplace: setWorkplaceProfile,
    getWorkplace: getActiveWorkplaceProfile,
    generateDailyDirective: generateDailyDirective,
    renderFriction: renderFrictionAnalytics
  };

  window.ProtocolCoach = api;
  window.LedgerCoach = api; // Abwärtskompatibler Alias

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', api.init);
  } else {
    api.init();
  }

})(window);
