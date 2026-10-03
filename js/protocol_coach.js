/**
 * js/protocol_coach.js
 * TACTUS Top-Führungsassistent, D/s-Coach & Generative Vektor-Grammatik (V3.0 Haute-Horlogerie)
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien nach Master-Roadbook:
 * - 100 % UTF-8 Integrität: Echte deutsche Umlaute (ä, ö, ü, ß) im gesamten Modul
 * - Haute-Horlogerie Palette: OLED-Schwarz, Graphit, Champagner-Gold, Malachit, Cognac & Bordeaux
 * - Interaktive Tages-Kalibrierung für den Top (Fokus, Zeitbudget, Stresslevel 1–10)
 * - Echte Hyperdynamik via Generative Vektor-Grammatik: Keine starren Einzeiler-Teaser!
 *   Synthese: Zeitanker + Berufs-Trigger + Anatomischer Fokus + D/s-Geste + Quittierungs-Modus
 * - 5 Biomechanische Alltags- und Arbeitsplatzprofile mit urologischen Spülfenstern
 * - Dreiteilige situative Tages-Impulse (Morgen-Anker, Alltags-Teaser, Feierabend-Dienst)
 * - Multi-KI Anbindung via AIAdapter mit resilientem Offline-Vektorgenerator
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
  const STORAGE_KEY_CALIBRATION = 'tactus_coach_calibration';

  let coachCalibration = {
    focus: 'balanced',      // 'relief' | 'balanced' | 'strict' | 'playful'
    timeBudget: 'compact',  // 'micro' | 'compact' | 'extended'
    topStress: 5,           // 1 bis 10
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
      triggers: [
        "vor dem zweiten Video-Call",
        "in der Bildschirmpause am Vormittag",
        "beim Wechsel an den Stehschreibtisch",
        "während der Mittagspause",
        "vor dem Versenden der letzten Tagesberichte"
      ],
      biomechanics: [
        "3x 20 rhythmische Beckenboden-Kontraktionen gegen den Ring",
        "90 Sekunden aufrechtes Stehen an der Wand mit voller Hüftstreckung",
        "diskrete Entlastung des Schambeinbogens durch Zurücklehnen und Bauchatmung",
        "Bewusstes Verweilen in vollkommener Sitzruhe ohne unruhiges Wippen der Beine"
      ]
    },
    craft_physical: {
      id: 'craft_physical',
      label: 'Handwerk / Baustelle',
      fullTitle: 'Handwerk / Baustelle (Körperliche Belastung & Schwitzen)',
      posture: 'Bücken, Heben, Treppensteigen, Knien auf harten Böden',
      frictionRisk: 'Starker Schweiß, Staub und Reibung; erhöhtes Mazerationsrisiko',
      spuelFenster: 'Alle 6 Stunden dringend empfohlen',
      triggers: [
        "direkt nach dem Umkleiden auf der Baustelle",
        "während der Frühstücksrast im Werkstattwagen",
        "beim Tragen schwerer Materiallasten",
        "sofort beim Eintreffen daheim vor dem Betreten des Wohnraums",
        "unter der Feierabend-Dusche"
      ],
      biomechanics: [
        "Urologische 50ml-Kochsalzspülung der Eichelkammer zur Beseitigung von Schweißstaub",
        "Auftragen von dünnem Zinksalben-Schutzfilm auf gereizte Reibestellen am Damm",
        "Achtsame Kontrolle des Sitzes der Arretierung nach schwerem Heben",
        "Körperliche Erdung: 10 tiefe Atemzüge vor dem Werkzeugkasten mit Fokus auf die Führung"
      ]
    },
    medical_service: {
      id: 'medical_service',
      label: 'Pflege / Gastronomie',
      fullTitle: 'Pflege / Gastronomie / Einzelhandel (Dauerhaftes Stehen & Gehen)',
      posture: '8–12 Stunden aufrechtes Stehen und zügiges Gehen in engen Kasacks/Schuhen',
      frictionRisk: 'Reibung an den Schenkelinnenseiten; Ermüdung der Lendenwirbelsäule',
      spuelFenster: 'Alle 8 Stunden',
      triggers: [
        "während der kurzen Schichtübergabe",
        "im Treppenhaus zwischen den Stationen",
        "beim kurzen Sitzen im Pausenraum",
        "direkt nach Schichtende vor dem Nachhauseweg",
        "beim Ausziehen der Arbeitsschuhe an der Wohnungstür"
      ],
      biomechanics: [
        "5 Minuten Beine an der Wand hochlagern zur venösen Entstauung der Waden",
        "Entlastungs-Kniestand mit sanfter Dehnung der vorderen Oberschenkelmuskulatur",
        "Achtsames Wahrnehmen jedes Schrittes als Bekenntnis zum Gehorsam",
        "Vorbereitung der eigenen Hände für den abendlichen Fußdienst am Top"
      ]
    },
    driver_field: {
      id: 'driver_field',
      label: 'Fahrer / Außendienst',
      fullTitle: 'Fahrer / Außendienst / Pendler (Autositz & Vibration)',
      posture: 'Längeres Sitzen im Fahrzeugsitz mit Vibration und Beckenerschütterung',
      frictionRisk: 'Reibung durch Sicherheitsgurt und Schaltsitz; Hitzeentwicklung im Lendenbereich',
      spuelFenster: 'Alle 10 Stunden',
      triggers: [
        "an jeder längeren roten Ampel",
        "beim Halt an der Raststätte oder Tankstelle",
        "vor dem Einsteigen nach dem Kundentermin",
        "beim Rangieren in die heimische Einfahrt",
        "beim Lösen des Sicherheitsgurts"
      ],
      biomechanics: [
        "Hände fest auf 9 und 3 Uhr am Lenkrad fixieren, aufrecht hinsetzen und tief in den Bauch ausatmen",
        "Lendenwirbel-Aufrichtung und Beckenkippung gegen die Rückenlehne",
        "Stumme Besinnung auf das Duftanker-Parfüm der Herrin im Fahrzeug",
        "Wortloses Tragen aller Taschen und Einkäufe ins Haus im Laufschritt"
      ]
    },
    shift_variable: {
      id: 'shift_variable',
      label: 'Schichtdienst',
      fullTitle: 'Schichtdienst / Wechselschicht (Verschobener Biorhythmus)',
      posture: 'Unregelmäßige Tag-Nacht-Rhythmen, gestörte REM-Schlafphasen',
      frictionRisk: 'Verschobene Testosteron-Peaks; erhöhte Cortisolausschüttung bei Schlafmangel',
      spuelFenster: 'Spülzeiten flexibel an Schlafblöcke anpassen',
      triggers: [
        "vor dem Abdunkeln des Schlafraums am Vormittag",
        "beim Aufwachen im Halbdunkel",
        "zur Mitte der Nachtschicht gegen das Leistungstief",
        "beim Zubereiten des ersten Heißgetränks",
        "vor dem Verlassen des Hauses zur unüblichen Stunde"
      ],
      biomechanics: [
        "Auflegen der Gewichtsdecke und 4-7-8 Vagus-Atmung zur Biorhythmus-Stabilisierung",
        "Urologische Spülung exakt vor der längsten zusammenhängenden Schlafphase",
        "Bereitstellen frischen Wassers und diskretes Lüften des Schlaftrakts für den Top",
        "Stiller Rapport im Fersensitz ohne Licht und ohne gesprochene Worte"
      ]
    }
  };

  function loadCoachState() {
    try {
      const rawCal = localStorage.getItem(STORAGE_KEY_CALIBRATION);
      if (rawCal) {
        const parsed = JSON.parse(rawCal);
        if (parsed && typeof parsed === 'object') {
          coachCalibration = Object.assign({}, coachCalibration, parsed);
        }
      }
      const savedLoad = localStorage.getItem(STORAGE_KEY_TOP_LOAD);
      if (savedLoad) {
        coachCalibration.focus = savedLoad;
      }
    } catch (e) {
      console.debug("[TACTUS Coach] State-Load:", e);
    }
  }

  function saveCoachState() {
    try {
      coachCalibration.updatedAt = Date.now();
      localStorage.setItem(STORAGE_KEY_CALIBRATION, JSON.stringify(coachCalibration));
      localStorage.setItem(STORAGE_KEY_TOP_LOAD, coachCalibration.focus);
    } catch (e) {}

    if (window.CloudSync && typeof window.CloudSync.trigger === 'function') {
      window.CloudSync.trigger();
    }
  }

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
    if (hint) hint.innerText = `${profile.frictionRisk} (Spülfenster: ${profile.spuelFenster})`;
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

    return {
      isLocked,
      daysLocked,
      hardwareName,
      tensionData,
      calibration: coachCalibration
    };
  }

  const GenerativeVectorGrammar = {
    morningAnchors: {
      relief: [
        "Vor dem Verlassen der Wohnung: 45 Sekunden im ruhigen Fersensitz mit gesenktem Blick auf den Dielen verharren. Kein Wort, kein Redebedarf. Ein stummer Kopfstreich genügt als Entlassung.",
        "Stummes Reichen des morgendlichen Heißgetränks auf den Knien am Bettrand. Blick bleibt am Holz ausgerichtet, bis du die Tasse entgegengenommen hast.",
        "Lautloses Bereitlegen der Kleidung und Öffnen der Fenster im Schlaftrakt, bevor du die Augen aufschlägst."
      ],
      strict: [
        "Morgenappell im aufrechten Kniestand vor deinen Knien: Exakt 60 Sekunden starrer Blickkontakt ohne Blinzeln. Vorzeigen des tadellosen Sitzes der Arretierung.",
        "Standvorbeuge an der Türzarge mit Stirn am Holz für 3 Minuten: Meldung der gestrigen Pflichterfüllung mit fester, klarer Stimme.",
        "Körperliche Inspektion bei vollem Licht im Bad: Glattrasur und makelloses Hautbild vorzeigen. Jede Stoppel wird gerügt."
      ],
      balanced: [
        "Gemeinsamer Duftanker vor der Haustür: Ein Hauch deines Parfüms auf das Handgelenk des Bottoms als ständiger Konzentrationsbegleiter für den Alltag.",
        "45 Sekunden bewusste synchrone Bauchatmung im Stehen Hand in Hand, bevor sich die Wege für den Tag trennen.",
        "Ein stummes Kniebeugen an der Schwelle mit dargebotenen Handflächen zur Bestätigung der heutigen Führung."
      ],
      playful: [
        "Kurzer neckender Kniestand mit erzwungenem Lächeln: 30 Sekunden stillhalten, während du ihm durch die Haare wuschelst und den Tag freigibst.",
        "Versteckter Zettel in der Jackentasche mit einer kleinen, neckenden Gehorsamsaufgabe für den Nachmittag.",
        "Ein spöttischer Blick auf die Verschluss-Stelle vor dem Anziehen: 'Mal sehen, wie brav du heute bleibst.'"
      ]
    },

    eveningServices: {
      relief: [
        "Bevor du die Wohnung betrittst, ist die Küche spiegelblank gereinigt. Der Bottom nimmt dir an der Tür schweigend Mantel und Schuhe ab, reicht ein Glas lauwarmes Wasser und bietet eine 20-minütige Nacken- oder Fußmassage im Halbdunkel ohne Worte an.",
        "Schlafraum-Konditionierung 30 Minuten vor deiner Bettruhe: Stoßlüften, Kissen aufschütteln, Decke umschlagen und vollkommene Stille im Haus sicherstellen.",
        "Fußbad-Dienst im Kniestand vor dem Sofa: Warmes Wasser vorbereiten, Füße behutsam abtrocknen und mit nährendem Balsam einreiben, ohne jede Gegenforderung."
      ],
      strict: [
        "Feierabend-Rapport im Fersensitz: Lückenloser Bericht über alle erledigten Aufgaben des Tages. Danach 10 Schläge mit der flachen Hand auf das Gesäß zur Besinnung über den heutigen Gehorsam.",
        "Standvorbeuge über die Schreibtischkante für 10 Minuten ohne Gewichtsverlagerung. Der Bottom hält still, während du den Tag Revue passieren lässt.",
        "Vollständige urologische Feierabend-Spülung unter der Dusche durchführen und das reizfreie Hautbild im Kniestand vorzeigen."
      ],
      balanced: [
        "Stiller Empfang an der Wohnungstür. Der Bottom nimmt dir den mentalen Ballast des Tages ab, serviert das Abendessen in ruhiger, dienender Haltung und lauscht deinen Gedanken.",
        "15 Minuten achtsame Waden- und Fußmassage zur Erdung nach dem Arbeitstag, vertieft durch eine ruhige Tasse Tee.",
        "Gemeinsames Rekapitulieren des heutigen Tagesfokus und Planung der Aufgaben für den kommenden Morgen."
      ],
      playful: [
        "Neckender Empfang: Der Bottom muss erraten, wie zufrieden du heute mit ihm warst – für jede falsche Antwort gibt es einen leichten Klaps auf die Kehrseite.",
        "Verwöhnprogramm auf Knien mit spielerischen Schwellen-Reizen, die du nach Belieben abbrichst oder belohnst.",
        "Kleines Quiz über deine heutigen Wünsche: Erst wenn alles erraten ist, darf er sich setzen."
      ]
    },

    synthesizeOffline: function(somatic, workplace, names) {
      const top = names.top || 'Top';
      const sub = names.sub || 'Bottom';
      const focus = somatic.calibration.focus || 'balanced';
      const budget = somatic.calibration.timeBudget || 'compact';
      const stress = somatic.calibration.topStress || 5;
      const days = somatic.daysLocked;
      const isLocked = somatic.isLocked;

      // 1. Morgen-Impuls aus Vektor wählen
      const morningPool = this.morningAnchors[focus] || this.morningAnchors.balanced;
      const morningText = morningPool[Math.floor(Math.random() * morningPool.length)];

      // 2. Alltags-Teaser generativ aus Vektor-Grammatik zusammensetzen
      const triggers = workplace.triggers || ["während der Pause"];
      const mechanics = workplace.biomechanics || ["Achtsame Körperhaltung"];
      const trigger = triggers[Math.floor(Math.random() * triggers.length)];
      const mechanic = mechanics[Math.floor(Math.random() * mechanics.length)];

      let dayContext = isLocked 
        ? `Tag ${days} im Verschluss fordert Achtsamkeit: Schwellkörperdruck bewusst wahrnehmen, ohne zu hadern.` 
        : `Aufrechte, gespannte Körperhaltung einhalten.`;

      let feedbackDirective = "Danach ein stummer Bestätigungs-Ping im Chat. Keine Ausreden.";
      if (focus === 'relief') {
        feedbackDirective = "Kein Chat-Bedarf tagsüber. Halte den Kopf frei und konzentriere dich voll auf deinen Feierabenddienst.";
      } else if (focus === 'strict') {
        feedbackDirective = "Jedes Zögern wird als Pflichtverletzung nach § 7 Beziehungsvertrag gewertet.";
      }

      let teaserText = `${trigger.charAt(0).toUpperCase() + trigger.slice(1)}: ${mechanic}. ${dayContext} ${feedbackDirective}`;

      // 3. Feierabend-Dienst aus Vektor wählen
      const eveningPool = this.eveningServices[focus] || this.eveningServices.balanced;
      const eveningText = eveningPool[Math.floor(Math.random() * eveningPool.length)];

      // Zeitbudget-Korrektur
      let budgetNotice = "";
      if (budget === 'micro') {
        budgetNotice = " (Kompaktfassung: Zeitbudget unter 5 Minuten)";
      } else if (budget === 'extended') {
        budgetNotice = " (Ausführliches Abendritual mit Raum für Vertiefung)";
      }

      return `
<strong class="text-[#c5a880] block font-bold mb-1">1. Morgen-Impuls (${escapeHtml(focus.toUpperCase())}):</strong>
${morningText}<br><br>
<strong class="text-[#c5a880] block font-bold mb-1">2. Alltags-Teaser (${escapeHtml(workplace.label)}):</strong>
${teaserText}<br><br>
<strong class="text-[#c5a880] block font-bold mb-1">3. Feierabend-Dienst (Mental-Load Schutz)${budgetNotice}:</strong>
${eveningText}
      `.trim();
    }
  };

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
        <span class="text-xs text-[#c5a880] font-mono block">Synthetisiere generative Tages-Regie...</span>
        <span class="text-[10px] text-[#94a3b8] block">Koppelt Stresslevel, Zeitbudget, Tragetage und Arbeitsplatz-Kontext</span>
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
Erstelle für ${names.top} (Top) eine situative, hyperdynamische Führungs-Empfehlung zur Begleitung von ${names.sub} (Bottom).

KONTEXT DES PAARES HEUTE:
- Führender Partner: ${names.top} (Führungs-Fokus: ${somatic.calibration.focus.toUpperCase()}, Stresslevel: ${somatic.calibration.topStress}/10, Zeitbudget: ${somatic.calibration.timeBudget.toUpperCase()})
- Keuschheitsstatus: ${somatic.isLocked ? `Tag ${somatic.daysLocked} verriegelt im ${somatic.hardwareName} (${somatic.tensionData.archetype.name})` : 'Unverschlossen / Frei'}
- Beruf & Alltags-Kontext des Bottoms: ${workplace.fullTitle}
- Biomechanisches Risiko: ${workplace.frictionRisk}
- Urologisches Spülfenster: ${workplace.spuelFenster}

WICHTIGE LEITPLANKEN (ECHTE HYPERDYNAMIK):
- Wenn der Top 'RELIEF' (oder Stress >= 7) gewählt hat: Verbiete fordernde Erotik! Wandle den Tag zwingend in stillen Entlastungsdienst durch den Sub um (Mental-Load Beseitigung, Fußmassage, Schuhe abnehmen, Küche reinigen).
- Wenn der Top 'STRICT' gewählt hat: Fokus auf Haltungsprüfung, Kniestand und disziplinierte Sühne.
- Wenn der Top 'BALANCED' gewählt hat: Harmonische Balance aus Führung, Alltagsentlastung und Nähe.
- Wenn der Top 'PLAYFUL' gewählt hat: Spielerischer Trotz, neckendes Teasing und humorvolle Strenge.
- Formuliere exakt 3 nummerierte Absätze: 1. Morgen-Impuls, 2. Alltags-Teaser (${workplace.label}), 3. Feierabend-Dienst.
- Direkt, erwachsen, souverän, frei von Kitsch oder Groschenroman-Floskeln. Antworte in wohlgeformtem HTML mit <strong> und <br>-Tags.
`;

        const aiResponse = await window.AIAdapter.generateText({
          safety: true,
          systemPrompt: systemPrompt,
          userPrompt: userPrompt,
          temperature: 0.7
        });

        if (aiResponse && aiResponse.trim().length > 60) {
          generatedHtml = aiResponse.trim();
        }
      } catch (errAi) {
        console.debug("[TACTUS Coach] KI-Synthese fehlgeschlagen, nutze Vektor-Grammatik:", errAi);
      }
    }

    // 2. Fallback auf generative Vektor-Grammatik
    if (!generatedHtml) {
      generatedHtml = GenerativeVectorGrammar.synthesizeOffline(somatic, workplace, names);
    }

    try {
      localStorage.setItem(STORAGE_KEY_LAST_DIRECTIVE, JSON.stringify({
        html: generatedHtml,
        timestamp: Date.now(),
        workplaceId: workplace.id,
        focus: somatic.calibration.focus,
        stress: somatic.calibration.topStress
      }));
    } catch (e) {}

    contentBox.innerHTML = `
      <div class="space-y-2.5 text-[11px] text-[#f8fafc] leading-relaxed font-sans">
        ${generatedHtml}
        <div class="pt-2.5 border-t border-[#1e2638] flex items-center justify-between text-[9.5px] font-mono text-[#94a3b8]">
          <span>Fokus: ${escapeHtml(somatic.calibration.focus)} · Stress: ${somatic.calibration.topStress}/10 · Zeit: ${escapeHtml(somatic.calibration.timeBudget)}</span>
          <span>Berechnet um ${new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    `;

    showToast("✓ Situative Tages-Regie berechnet");
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
                <span>Kontext: ${escapeHtml(parsed.workplaceId || '')} · Gespeichert</span>
                <span>${new Date(parsed.timestamp).toLocaleDateString('de-DE')}</span>
              </div>
            </div>
          `;
        }
      }
    } catch (e) {}
  }

  function renderCalibrationPanel() {
    const container = document.getElementById('coach-calibration-container');
    if (!container) return;

    const isTop = isUserTop();
    const cal = coachCalibration;

    container.innerHTML = `
      <div class="p-4 rounded-3xl bg-[#090d14] border border-[#1e2638] space-y-3.5 shadow-md">
        <div class="flex items-center justify-between border-b border-[#1e2638]/70 pb-2">
          <div class="space-y-0.5">
            <strong class="text-xs text-white block font-bold">Tages-Kalibrierung für den Top:</strong>
            <span class="text-[10px] text-[#94a3b8]">Steuert die situative Vektor-Synthese nach deiner realen Verfassung</span>
          </div>
          <span class="text-[9.5px] font-mono text-[#c5a880] font-bold">Interaktiv</span>
        </div>

        <!-- 1. FÜHRUNGS-FOKUS BUTTONS -->
        <div class="space-y-1.5">
          <label class="text-[10px] font-mono uppercase text-[#94a3b8] block">Führungs-Fokus heute:</label>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs font-mono">
            <button type="button" ${!isTop ? 'disabled' : ''} onclick="ProtocolCoach.setCalibrationFocus('relief')" class="p-2 rounded-xl border text-left transition-all touch-btn ${cal.focus === 'relief' ? 'bg-[#000000] border-[#c5a880] text-[#c5a880] font-bold shadow-sm' : 'bg-[#000000] border-[#1e2638] text-[#94a3b8] hover:text-white'}">
              <strong class="text-[11px] block leading-tight">Entlastung</strong>
              <span class="text-[8.5px] text-[#dfcaa9] block mt-0.5 leading-snug">Mental-Load Schutz</span>
            </button>
            <button type="button" ${!isTop ? 'disabled' : ''} onclick="ProtocolCoach.setCalibrationFocus('balanced')" class="p-2 rounded-xl border text-left transition-all touch-btn ${cal.focus === 'balanced' ? 'bg-[#000000] border-[#c5a880] text-[#c5a880] font-bold shadow-sm' : 'bg-[#000000] border-[#1e2638] text-[#94a3b8] hover:text-white'}">
              <strong class="text-[11px] block leading-tight">Ausgewogen</strong>
              <span class="text-[8.5px] text-[#94a3b8] block mt-0.5 leading-snug">Nähe &amp; Ordnung</span>
            </button>
            <button type="button" ${!isTop ? 'disabled' : ''} onclick="ProtocolCoach.setCalibrationFocus('strict')" class="p-2 rounded-xl border text-left transition-all touch-btn ${cal.focus === 'strict' ? 'bg-[#450a0a] border-[#991b1b] text-white font-bold shadow-sm' : 'bg-[#000000] border-[#1e2638] text-[#94a3b8] hover:text-white'}">
              <strong class="text-[11px] block leading-tight">Strenge</strong>
              <span class="text-[8.5px] text-white/70 block mt-0.5 leading-snug">Zucht &amp; Haltung</span>
            </button>
            <button type="button" ${!isTop ? 'disabled' : ''} onclick="ProtocolCoach.setCalibrationFocus('playful')" class="p-2 rounded-xl border text-left transition-all touch-btn ${cal.focus === 'playful' ? 'bg-[#4a2818] border-[#8a5232] text-[#f8fafc] font-bold shadow-sm' : 'bg-[#000000] border-[#1e2638] text-[#94a3b8] hover:text-white'}">
              <strong class="text-[11px] block leading-tight">Neckend</strong>
              <span class="text-[8.5px] text-[#b3734a] block mt-0.5 leading-snug">Trotz &amp; Spiel</span>
            </button>
          </div>
        </div>

        <!-- 2. ZEITBUDGET & STRESSLEVEL -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div class="space-y-1.5">
            <label class="text-[10px] font-mono uppercase text-[#94a3b8] block">Dein Zeitbudget heute:</label>
            <div class="grid grid-cols-3 gap-1 text-[10px] font-mono">
              <button type="button" ${!isTop ? 'disabled' : ''} onclick="ProtocolCoach.setTimeBudget('micro')" class="p-1.5 rounded-xl border text-center transition-all touch-btn ${cal.timeBudget === 'micro' ? 'bg-[#000000] border-[#c5a880] text-[#c5a880] font-bold' : 'bg-[#000000] border-[#1e2638] text-[#94a3b8]'}">
                &lt; 5 Min
              </button>
              <button type="button" ${!isTop ? 'disabled' : ''} onclick="ProtocolCoach.setTimeBudget('compact')" class="p-1.5 rounded-xl border text-center transition-all touch-btn ${cal.timeBudget === 'compact' ? 'bg-[#000000] border-[#c5a880] text-[#c5a880] font-bold' : 'bg-[#000000] border-[#1e2638] text-[#94a3b8]'}">
                15 Min
              </button>
              <button type="button" ${!isTop ? 'disabled' : ''} onclick="ProtocolCoach.setTimeBudget('extended')" class="p-1.5 rounded-xl border text-center transition-all touch-btn ${cal.timeBudget === 'extended' ? 'bg-[#000000] border-[#c5a880] text-[#c5a880] font-bold' : 'bg-[#000000] border-[#1e2638] text-[#94a3b8]'}">
                Abend-Session
              </button>
            </div>
          </div>

          <div class="space-y-1.5">
            <div class="flex items-center justify-between text-[10px] font-mono">
              <span class="text-[#94a3b8] uppercase">Dein Stresslevel heute:</span>
              <span class="text-[#c5a880] font-bold" id="coach-stress-display">${cal.topStress} / 10</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value="${cal.topStress}" 
              ${!isTop ? 'disabled' : ''}
              oninput="ProtocolCoach.setTopStress(this.value)"
              class="w-full h-1.5 bg-[#000000] rounded-lg appearance-none cursor-pointer accent-[#c5a880]"
            />
            <div class="flex justify-between text-[8.5px] font-mono text-[#94a3b8]">
              <span>1: Entspannt</span>
              <span>5: Normal</span>
              <span>10: Voll überlastet</span>
            </div>
          </div>
        </div>

        <div class="pt-2 border-t border-[#1e2638] flex justify-end">
          <button type="button" ${!isTop ? 'disabled' : ''} onclick="ProtocolCoach.generateDailyDirective()" class="px-4 py-2 rounded-xl bg-[#c5a880] hover:bg-[#dfcaa9] text-black font-bold font-mono text-xs touch-btn shadow-md flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5 text-black" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/></svg>
            <span>Tages-Empfehlung berechnen</span>
          </button>
        </div>
      </div>
    `;
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
          actionHtml: `<a href="protocol.html#tab=dashboard" class="px-2.5 py-1 rounded-xl bg-[#000000] text-[#c5a880] border border-[#c5a880]/50 font-mono text-[9.5px] font-bold touch-btn">Ratio einsehen ↗</a>`
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
          actionHtml: `<a href="protocol.html#tab=contract" class="px-2.5 py-1 rounded-xl bg-[#000000] text-[#d4af37] border border-[#d4af37]/60 font-mono text-[9.5px] font-bold touch-btn">Ratifizieren ↗</a>`
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
      <div class="p-3.5 rounded-2xl border transition-all space-y-2 ${f.severity === 'high' ? 'bg-[#450a0a]/30 border-[#991b1b]' : (f.severity === 'medium' ? 'bg-[#4a2818]/30 border-[#8a5232]' : 'bg-[#000000] border-[#1e2638]')}">
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
      loadCoachState();
      updateWorkplaceUI();
      renderCalibrationPanel();
      loadCachedDirective();
      renderFrictionAnalytics();
    },
    render: function() {
      loadCoachState();
      updateWorkplaceUI();
      renderCalibrationPanel();
      renderFrictionAnalytics();
    },
    setWorkplace: setWorkplaceProfile,
    getWorkplace: getActiveWorkplaceProfile,
    setCalibrationFocus: function(focusKey) {
      coachCalibration.focus = focusKey;
      saveCoachState();
      renderCalibrationPanel();
      showToast(`✓ Führungs-Fokus: ${focusKey.toUpperCase()}`);
    },
    setTimeBudget: function(budgetKey) {
      coachCalibration.timeBudget = budgetKey;
      saveCoachState();
      renderCalibrationPanel();
      showToast(`✓ Zeitbudget: ${budgetKey.toUpperCase()}`);
    },
    setTopStress: function(val) {
      coachCalibration.topStress = parseInt(val, 10) || 5;
      saveCoachState();
      const disp = document.getElementById('coach-stress-display');
      if (disp) disp.innerText = `${coachCalibration.topStress} / 10`;
    },
    generateDailyDirective: generateDailyDirective,
    renderFriction: renderFrictionAnalytics,
    getCalibration: () => Object.assign({}, coachCalibration)
  };

  window.ProtocolCoach = api;
  window.LedgerCoach = api;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', api.init);
  } else {
    api.init();
  }

})(window);
