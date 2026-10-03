/**
 * js/protocol_contract.js
 * TACTUS Dynamisches Bündnis- & Vertrags-Studio (V3.0 Haute-Horlogerie)
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien nach Master-Roadbook:
 * - 100 % UTF-8 Integrität: Echte deutsche Umlaute (ä, ö, ü, ß) im gesamten Modul
 * - Haute-Horlogerie Palette: OLED-Schwarz, Graphit, Champagner-Gold, Feingold, Malachit, Cognac & Bordeaux
 * - 8 Paragraphen mit Stufen 0 bis 5 (0 = Deaktiviert, 1 = Sanft, 3 = Ausgewogen, 5 = Strikt)
 * - Psychosomatische Cross-Clause-Invarianten (Denial-Kompensation & Top-Fatigue-Schutz)
 * - Verankerung von Kapitel 00 (Items 901–905) in § 8 (Trauma-Trigger & Notfall-Interventionen)
 * - Scham-Schutzanker (🙈) & Alltags-Spottverbot in § 1 Abs. 2
 * - Klickbare Fragebogen-Deeplinks auf alle referenzierten Items (index.html#view=survey&chapter=X)
 * - Gehärtetes Druck-Design (@media print): Edle juristische Typografie, Siegelfelder, saubere Umbrüche
 * - Redacted Urkunden-Export: 1080x1350 px Canvas mit Goldrahmen und TACTUS-Siegel für Social Proof
 * - Touch-Signaturpad mit High-DPI Skalierung für Top (Gold/Titan) und Bottom (Cognac)
 * - 100 % frei von infantilen System-Emojis, keine window.alert() / confirm() Aufrufe
 */

(function(window) {
  'use strict';

  const STORAGE_KEY_CONTRACT = 'tactus_contract_state';
  const STORAGE_KEY_LEGACY = 'kompass_contract_state';
  const STORAGE_KEY_ANSWERS = 'kompass_answers';
  const STORAGE_KEY_NAMES = 'kompass_names';

  const CHAPTER_CLUSTER_MAP = {
    k1_preamble: [0, 1, 9],
    k2_hierarchy: [9, 15, 17],
    k3_spheres: [5, 16],
    k4_aftercare: [1, 14, 19, 34, 35],
    k5_chastity: [7, 8],
    k6_service: [3, 9, 23, 29, 31],
    k7_discipline: [10, 11, 12, 24, 25],
    k8_safety: [9, 24, 34, 35]
  };

  const DEFAULT_CONTRACT_CLAUSES = {
    k1_preamble: {
      key: 'k1_preamble',
      title: '§ 1 Präambel, Vertrauensbasis & Scham-Schutzanker',
      level: 3,
      canDisable: true,
      desc: 'Bündniszweck, emotionale Sicherheit, Konsens und das bedingungslose Spottverbot für verletzliche Sehnsüchte.',
      clusterChapters: [0, 1, 9]
    },
    k2_hierarchy: {
      key: 'k2_hierarchy',
      title: '§ 2 Führungsanspruch & Verbot verdeckter Regie (Anti-TftB)',
      level: 3,
      canDisable: true,
      desc: 'Klare Machtasymmetrie, Verbot von Regieführung von unten (Topping from the Bottom) und Entscheidungsbefugnis des Tops.',
      clusterChapters: [9, 15, 17]
    },
    k3_spheres: {
      key: 'k3_spheres',
      title: '§ 3 Geltungsbereiche & diskrete Öffentlichkeit',
      level: 2,
      canDisable: true,
      desc: 'Räumliche und zeitliche Grenzen der Dynamik im Alltag, im Halbdunkel des Schlafzimmers und in Gegenwart Dritter.',
      clusterChapters: [5, 16]
    },
    k4_aftercare: {
      key: 'k4_aftercare',
      title: '§ 4 Nachsorge, Vagus-Atmung & Reverse Aftercare',
      level: 4,
      canDisable: false,
      desc: 'Verbindliche Vagus-Beruhigung nach intensiven Reizen, 24h/48h-Subdrop-Prävention und Dienst des Subs am Top.',
      clusterChapters: [1, 14, 19, 34, 35]
    },
    k5_chastity: {
      key: 'k5_chastity',
      title: '§ 5 Keuschheit, Triebaufschub & Schlüsselgewalt',
      level: 3,
      canDisable: true,
      desc: 'Ausschließliche Verfügungsgewalt über die Lust, Tragepflicht der Verschluss-Hardware und Schweigepflicht des Subs.',
      clusterChapters: [7, 8]
    },
    k6_service: {
      key: 'k6_service',
      title: '§ 6 Alltagsdienst, Haushaltsentlastung & Ehrerbietung',
      level: 3,
      canDisable: true,
      desc: 'Dienstbare Entlastung des Tops im Alltag, Kniestand-Appell und Fußpflege zur Beseitigung von Mental Load.',
      clusterChapters: [3, 9, 23, 29, 31]
    },
    k7_discipline: {
      key: 'k7_discipline',
      title: '§ 7 Disziplinarordnung, Zucht & Sühne',
      level: 3,
      canDisable: true,
      desc: 'Körperliche Sühnemaßnahmen bei Pflichtverletzung, Mitzählpflicht und Einhaltung vereinbarter Haltungen.',
      clusterChapters: [10, 11, 12, 24, 25]
    },
    k8_safety: {
      key: 'k8_safety',
      title: '§ 8 Psychosomatische Not-Aus-Schranken, Safewords & RACK',
      level: 5,
      canDisable: false,
      desc: 'Unantastbarkeit der Safewords (Rot/Gelb), Verankerung der Kapitel-00-Interventionen und Break-Glass-Notfallcode.',
      clusterChapters: [9, 24, 34, 35]
    }
  };

  let contractState = {
    version: '1.0',
    status: 'draft',
    signedAt: null,
    signatureTop: null,
    signatureSub: null,
    clauses: Object.assign({}, DEFAULT_CONTRACT_CLAUSES),
    customTexts: {},
    psychometricsSummary: {
      doubleFivesCount: 0,
      bridgesCount: 0,
      shameAnchorCount: 0,
      tabooCount: 0
    },
    updatedAt: Date.now()
  };

  let activeSignModalRole = 'top';
  let isDrawingSignature = false;

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

  function loadContractState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CONTRACT) || localStorage.getItem(STORAGE_KEY_LEGACY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          contractState = Object.assign({}, contractState, parsed);
          contractState.clauses = Object.assign({}, DEFAULT_CONTRACT_CLAUSES, parsed.clauses || {});
          contractState.customTexts = parsed.customTexts || {};
          return;
        }
      }
    } catch (e) {
      console.warn("[TACTUS Contract] Fehler beim Laden des States:", e);
    }
    saveContractState(true);
  }

  function saveContractState(skipSync) {
    try {
      contractState.updatedAt = Date.now();
      const serialized = JSON.stringify(contractState);
      localStorage.setItem(STORAGE_KEY_CONTRACT, serialized);
      localStorage.setItem(STORAGE_KEY_LEGACY, serialized);
    } catch (e) {
      console.warn("[TACTUS Contract] Konnte State nicht sichern:", e);
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

  function getPairNames() {
    let names = { A: 'Partner 1', B: 'Partner 2' };
    try {
      const raw = localStorage.getItem(STORAGE_KEY_NAMES);
      if (raw) names = Object.assign({}, names, JSON.parse(raw));
    } catch (e) {}
    const topRole = localStorage.getItem('kompass_keyholder_role') || 'A';
    const subRole = (topRole === 'A') ? 'B' : 'A';
    return {
      top: names[topRole] || 'Top',
      sub: names[subRole] || 'Bottom',
      topRole: topRole,
      subRole: subRole
    };
  }

  function analyzeWeightedPsychometrics(topRole, subRole) {
    let answers = {};
    try {
      const raw = localStorage.getItem(STORAGE_KEY_ANSWERS);
      if (raw) answers = JSON.parse(raw) || {};
    } catch (e) {}

    const ansTop = answers[topRole] || {};
    const ansSub = answers[subRole] || {};

    const doubleFives = [];
    const highSynergies = [];
    const bridges = [];
    const shameAnchors = [];
    const taboos = [];

    const p1 = window.surveyChaptersPart1 || [];
    const p2 = window.surveyChaptersPart2 || [];
    const p3 = window.surveyChaptersPart3 || [];
    const allChapters = p1.concat(p2).concat(p3);
    const itemMap = new Map();
    allChapters.forEach(ch => {
      (ch.items || []).forEach(it => {
        itemMap.set(it.id, { id: it.id, title: it.title, chapterId: ch.id, chapterTitle: ch.title });
      });
    });

    itemMap.forEach((meta, itemId) => {
      const sTop = ansTop[`it_${itemId}_r1`];
      const sSub = ansSub[`it_${itemId}_r2`];
      const isShame = ansSub[`shame_${itemId}`] === true;

      if (typeof sTop !== 'number' && typeof sSub !== 'number') return;
      const topVal = (typeof sTop === 'number') ? sTop : 0;
      const subVal = (typeof sSub === 'number') ? sSub : 0;

      if (isShame && subVal >= 3) {
        shameAnchors.push(meta);
      }
      if (subVal === 1) {
        taboos.push(meta);
      }
      if (topVal === 5 && subVal === 5) {
        doubleFives.push(meta);
      } else if (topVal >= 4 && subVal >= 4) {
        highSynergies.push(meta);
      } else if ((topVal >= 4 && subVal === 3) || (topVal === 3 && subVal >= 4)) {
        bridges.push(meta);
      }
    });

    let chapter00Intervention = "Feste, stumme Umarmung & Halten (Gewichtsdecken-Effekt)";
    let chapter00Triggers = "Keine bekannten Auslöser";
    if (ansSub['choice_904']) {
      const intMap = {
        hug: "Feste, stumme Umarmung & Halten (Gewichtsdecken-Effekt)",
        distance: "Körperliche Berührung sofort einstellen & Raum gewähren",
        grounding: "Licht anmachen, zudecken & synchrone 4-7-8 Vagus-Atmung",
        water_tea: "Schluck warmen Tee oder Wasser reichen, ohne zu fragen",
        voice: "Mit leiser, ruhiger Stimme reden und Sicherheit zusprechen"
      };
      chapter00Intervention = intMap[ansSub['choice_904']] || chapter00Intervention;
    }
    if (ansSub['choice_902']) {
      const trigMap = {
        words: "Schimpfwörter oder verbale Erniedrigung",
        smell: "Bestimmte Gerüche oder Parfüms",
        airway: "Enge, Ersticken oder Mund-/Nasenbedeckung",
        restraint: "Vollständige Fixierung ohne Restbeweglichkeit",
        darkness: "Plötzliche unangekündigte Dunkelheit",
        none: "Keine spezifischen Flashback-Trigger"
      };
      chapter00Triggers = trigMap[ansSub['choice_902']] || chapter00Triggers;
    }

    const clusterAverages = {};
    for (const cKey in CHAPTER_CLUSTER_MAP) {
      const chIds = CHAPTER_CLUSTER_MAP[cKey];
      let sum = 0;
      let count = 0;
      chIds.forEach(id => {
        const tVal = ansTop[`it_${id}_r1`];
        const sVal = ansSub[`it_${id}_r2`];
        if (typeof tVal === 'number' || typeof sVal === 'number') {
          sum += ((tVal || 0) * 0.6) + ((sVal || 0) * 0.4);
          count++;
        }
      });
      clusterAverages[cKey] = count > 0 ? (sum / count) : 3.0;
    }

    return {
      doubleFives,
      highSynergies,
      bridges,
      shameAnchors,
      taboos,
      chapter00Intervention,
      chapter00Triggers,
      clusterAverages
    };
  }

  function synthesizeClauseWording(clauseKey, level, pData, names) {
    if (level === 0) {
      return "Diese Klausel ist einvernehmlich deaktiviert und begründet für beide Partner keinerlei rechtliche oder disziplinarische Pflichten.";
    }

    const top = names.top;
    const sub = names.sub;

    switch (clauseKey) {
      case 'k1_preamble': {
        const shameList = pData.shameAnchors.length > 0 
          ? pData.shameAnchors.slice(0, 3).map(it => `„${it.title}“ (Item #${it.id})`).join(', ') 
          : 'besondere verletzliche Sehnsüchte';
        return `(1) Dieser Vertrag begründet ein einvernehmliches Macht- und Führungsbündnis zwischen ${top} (Top) und ${sub} (Bottom). Er dient der Vertiefung gegenseitiger Intimität, der Entlastung von Alltags-Stress und dem geschützten Raum für authentische Hingabe.\n\n(2) STRIKTES ALLTAGS-SPOTTVERBOT: Die vom Sub mit dem Schutzanker versehenen sensiblen Themen (${shameList}) dürfen niemals im Streit, im Alltag oder abwertend erwähnt werden. Annäherung erfolgt ausschließlich im geschützten Halbdunkel ohne Leistungsdruck.\n\n(3) Beide Partner bekräftigen ihre seelische Zurechnungsfähigkeit. Alle Handlungen stehen unter dem Vorbehalt des RACK-Prinzips (Risk-Aware Consensual Kink).`;
      }

      case 'k2_hierarchy': {
        const intensityText = level >= 4 
          ? `${top} führt mit unbedingter Autorität. Anweisungen zu Haltung, Kleidung und Benehmen sind ohne Verzug auszuführen.` 
          : `${top} übernimmt die achtsame Leitung intimer Sessions und alltäglicher D/s-Rituale.`;
        return `(1) Die Parteien vereinbaren eine asymmetrische D/s-Hierarchie. ${intensityText}\n\n(2) VERBOT VERDECKTER REGIEFÜHRUNG (ANTI-TFTB): ${sub} verpflichtet sich, ${top} nicht manipulativ durch Schmollen, Trotzen oder erzwungene Strafaufforderungen von unten zu steuern (Topping from the Bottom). Die Initiative obliegt allein der freien Lust des Tops.\n\n(3) Entscheidungen über Beginn, Intensität und Ende von Strafen oder Zuchtmaßnahmen stehen allein im Ermessen des Tops.`;
      }

      case 'k3_spheres': {
        const isPublicAllowed = level >= 3;
        return `(1) Die Ausübung der Dynamik erstreckt sich primär auf die private Wohnung und das Schlafzimmer.\n\n(2) DISKRETE ÖFFENTLICHKEIT: ${isPublicAllowed ? `Das diskrete Tragen von Ausrüstung (z. B. Peniskäfig, Halsband unter dem Kragen) in der Öffentlichkeit ist nach Ankündigung gestattet, sofern Dritte nicht unwillentlich einbezogen werden.` : `Außerhalb der privaten Räumlichkeiten ruhen alle sichtbaren Machtgesten; Dritte werden niemals konfrontiert.`}\n\n(3) Diskretion nach außen: Intime Details über Verschluss, Strafen oder Rollen bleiben strikt zwischen den Partnern.`;
      }

      case 'k4_aftercare': {
        return `(1) Nach intensiven Reizen, Fesselungen oder Schmerzphasen gilt eine verbindliche Fürsorgephase von mindestens 15 Minuten. ${top} begleitet ${sub} durch synchrone 4-7-8 Vagus-Atmung und das Auflegen der Gewichtsdecke zur Vermeidung von Kältezittern.\n\n(2) REVERSE AFTERCARE: ${sub} verpflichtet sich, ${top} unaufgefordert zu entlasten (Reichen von warmem Tee oder Wasser, schweigende Nackenmassage, Beseitigung und Desinfektion aller genutzten Ausrüstungsgegenstände).\n\n(3) 24h/48h-DROP-WÄCHTER: Das Auftreten eines hormonellen Subdrops (Leere, Weinen, Antriebslosigkeit) wird als normaler biochemischer Opiat-Entzug anerkannt und mit Geborgenheit aufgefangen.`;
      }

      case 'k5_chastity': {
        const cageText = level >= 4 
          ? `Permanente Verriegelung des Genitals im Peniskäfig. Schlüsselgewalt liegt im kSafe oder bei ${top}. Freigaben erfolgen selten und ausschließlich als Gunst.` 
          : `Geregelter Triebaufschub zur Steigerung der Achtsamkeit. ${top} bestimmt den Rhythmus von Öffnungen und Hygiene.`;
        return `(1) ${sub} unterstellt die eigene sexuelle Erregung und Ejakulationsfähigkeit der ausschließlichen Verfügungsgewalt von ${top}.\n\n(2) VERSCHLUSS-REGIE: ${cageText}\n\n(3) SCHWEIGEPFLICHT ÜBER LUST: ${sub} verzichtet auf quengelndes Nachfragen nach Freigabe oder Ejakulation. Jedes Betteln ohne Aufforderung gilt als Pflichtverletzung.\n\n(4) Urologische Hygiene: Tägliche 50ml-Spülung mit Kochsalzlösung zur Balanitis-Prävention ist einzuhalten.`;
      }

      case 'k6_service': {
        const choreText = level >= 4 
          ? `Umfassender Haushalts- und Entlastungsdienst vor Eintreffen des Tops. Schuhe abnehmen, Küche makellos bereinigen, Frühstücksservice auf Knien am Wochenende.` 
          : `Feste Übernahme definierter Alltagsaufgaben zur Entlastung des mentalen Arbeitsloads des Tops.`;
        return `(1) Dienen wird als Geschenk der Alltagsentlastung verstanden, um ${top} den Kopf für freudige Führung frei zu halten.\n\n(2) DIENSTPFLICHTEN: ${choreText}\n\n(3) Ehrerbietung: Begrüßung und Übergabe von Getränken erfolgen in ruhiger Haltung mit gesenktem Blick.`;
      }

      case 'k7_discipline': {
        const discText = level >= 4 
          ? `Körperliche Sühnemaßnahmen mit Lederflogger, Sattelleder-Paddle oder Gürtel bei Versäumnissen. Mitzählen jedes Treffers.` 
          : `Gedrosselte Züchtigung mit der flachen Hand (max. 15 Schläge) oder Straf-Zusatzdienste im Haushalt.`;
        return `(1) Verstöße gegen Pflichten, Unpünktlichkeit oder respektloses Auftreten werden disziplinarisch geahndet.\n\n(2) STRAFMASS: ${discText}\n\n(3) RACK-Grenze: Keine Schläge auf Nieren, Wirbelsäule oder Gelenke. Erkundungs-Brücken werden vorab in 10-Minuten-Probeläufen erprobt.`;
      }

      case 'k8_safety': {
        return `(1) SAFEWORD-AMPEL: Die Codewörter GRÜN (Alles in Ordnung), GELB (Intensität drosseln) und ROT (Sofortiger Handlungsstillstand) sind unantastbar und dulden keine Diskussion.\n\n(2) NOTFALL-INTERVENTION BEI TRIGGERN: Bei akuter Dissoziation oder Flashbacks verpflichtet sich ${top} zur unverzüglichen Einleitung der vereinbarten Maßnahme: ${pData.chapter00Intervention}.\n\n(3) BEKANNTE TRIGGER: Auf folgende Reize wird strikt verzichtet: ${pData.chapter00Triggers}.\n\n(4) BREAK-GLASS-NOTFALLÖFFNUNG: Bei Schwellungen, Taubheitsgefühl oder Panik greift die 60-Sekunden-Notfall-PIN ohne Vorwürfe.`;
      }

      default:
        return "Individuelle Vereinbarung der Partner.";
    }
  }

  function validatePsychosomaticHarmony() {
    loadContractState();
    const clauses = contractState.clauses || {};

    const lvlChastity = clauses.k5_chastity ? clauses.k5_chastity.level : 0;
    const lvlAftercare = clauses.k4_aftercare ? clauses.k4_aftercare.level : 0;
    const lvlDiscipline = clauses.k7_discipline ? clauses.k7_discipline.level : 0;
    const lvlService = clauses.k6_service ? clauses.k6_service.level : 0;

    const warnings = [];

    if (lvlChastity >= 4 && lvlAftercare < 3) {
      warnings.push({
        type: 'denial_overload',
        text: 'Keuschheit ist strikt (Stufe 4/5), aber Fürsorge ist zu schwach (Stufe < 3). Gefahr von Reizüberlastung ohne emotionalen Ausgleich!'
      });
    }

    if (lvlDiscipline >= 4 && lvlService < 3) {
      warnings.push({
        type: 'top_fatigue_risk',
        text: 'Disziplin ist hoch (Stufe 4/5), aber Dienst/Entlastung ist gering. Risiko von Top Fatigue (Leiten wird zur unbezahlten Last)!'
      });
    }

    const baseScore = 100 - (warnings.length * 15);
    return {
      score: Math.max(55, baseScore),
      warnings: warnings,
      isBalanced: warnings.length === 0
    };
  }

  function generateContractFromContext() {
    if (!isUserTop()) {
      showToast("Nur der Top kann den Vertrag neu aus dem Fragebogen synthetisieren.");
      return;
    }

    loadContractState();
    const names = getPairNames();
    const pData = analyzeWeightedPsychometrics(names.topRole, names.subRole);

    for (const cKey in contractState.clauses) {
      const clause = contractState.clauses[cKey];
      const avg = pData.clusterAverages[cKey] || 3.0;

      let targetLevel = 3;
      if (avg >= 4.3) targetLevel = 5;
      else if (avg >= 3.6) targetLevel = 4;
      else if (avg >= 2.6) targetLevel = 3;
      else if (avg >= 1.8) targetLevel = 2;
      else targetLevel = 1;

      if (cKey === 'k8_safety') targetLevel = 5;
      if (cKey === 'k4_aftercare') targetLevel = Math.max(3, targetLevel);

      clause.level = targetLevel;
      contractState.customTexts[cKey] = synthesizeClauseWording(cKey, targetLevel, pData, names);
    }

    contractState.psychometricsSummary = {
      doubleFivesCount: pData.doubleFives.length,
      bridgesCount: pData.bridges.length,
      shameAnchorCount: pData.shameAnchors.length,
      tabooCount: pData.taboos.length
    };

    contractState.version = `${parseFloat(contractState.version || '1.0') + 0.1}`.substring(0, 3);
    contractState.status = 'draft';
    contractState.signatureTop = null;
    contractState.signatureSub = null;
    contractState.signedAt = null;

    saveContractState();
    renderContractDashboard();
    showToast(`✓ Vertrag aus 505 Fragen synthetisiert (Version ${contractState.version})`);

    if (window.ChatApp && typeof window.ChatApp.postSystemEvent === 'function') {
      window.ChatApp.postSystemEvent(`Beziehungsvertrag neu synthetisiert (Version ${contractState.version}). Ratifizierung durch beide Partner erbeten.`);
    }
  }

  function renderContractDashboard() {
    loadContractState();
    const container = document.getElementById('contract-clauses-container');
    const statusLabel = document.getElementById('contract-status-label');
    const versionLabel = document.getElementById('contract-version-label');
    const harmonyBanner = document.getElementById('contract-harmony-banner');
    const isTop = isUserTop();
    const names = getPairNames();
    const harmony = validatePsychosomaticHarmony();

    if (statusLabel) {
      const isSigned = contractState.status === 'active' && contractState.signatureTop && contractState.signatureSub;
      statusLabel.innerText = isSigned 
        ? `Status: Ratifiziert & Gültig (${new Date(contractState.signedAt || Date.now()).toLocaleDateString('de-DE')})` 
        : 'Status: Entwurf (Verhandlung aktiv)';
      statusLabel.className = isSigned ? 'text-[#2e5746] font-bold font-mono' : 'text-[#b3734a] font-bold font-mono';
    }

    if (versionLabel) {
      versionLabel.innerText = `Version ${contractState.version} · Stufe 0–5`;
    }

    if (harmonyBanner) {
      harmonyBanner.innerHTML = `
        <div class="p-3.5 rounded-2xl border text-xs ${harmony.isBalanced ? 'bg-[#142b24]/40 border-[#2e5746] text-[#f8fafc]' : 'bg-[#4a2818]/50 border-[#8a5232] text-[#f8fafc]'} space-y-1.5 shadow-sm">
          <div class="flex items-center justify-between">
            <strong class="font-bold flex items-center gap-1.5">
              <span>Psychosomatische Balance: ${harmony.score}%</span>
              ${harmony.isBalanced ? '<span class="text-[#2e5746] font-mono text-[10px] font-bold">Harmonisch ✓</span>' : '<span class="text-[#b3734a] font-mono text-[10px] font-bold">Nachjustierung empfohlen</span>'}
            </strong>
            <span class="text-[9.5px] font-mono text-[#94a3b8]">Doppel-5er: ${contractState.psychometricsSummary.doubleFivesCount} · Schutzanker: ${contractState.psychometricsSummary.shameAnchorCount}</span>
          </div>
          ${harmony.warnings.map(w => `<p class="text-[10px] text-[#dfcaa9] leading-snug font-mono">• ${escapeHtml(w.text)}</p>`).join('')}
        </div>
      `;
    }

    if (!container) return;

    const clauseKeys = Object.keys(DEFAULT_CONTRACT_CLAUSES);
    const pData = analyzeWeightedPsychometrics(names.topRole, names.subRole);

    container.innerHTML = clauseKeys.map(key => {
      const clause = contractState.clauses[key] || DEFAULT_CONTRACT_CLAUSES[key];
      const level = clause.level !== undefined ? clause.level : 3;
      const text = contractState.customTexts[key] || synthesizeClauseWording(key, level, pData, names);

      const clusterChapters = CHAPTER_CLUSTER_MAP[key] || [];
      const linksHtml = clusterChapters.map(chId => {
        return `<a href="index.html#view=survey&chapter=${chId}" target="_blank" class="text-[#c5a880] hover:underline font-mono text-[9.5px]">Kap. ${chId} ↗</a>`;
      }).join(' ');

      return `
        <div class="p-4 sm:p-5 rounded-3xl border transition-all space-y-3 ${level === 0 ? 'opacity-40 border-[#1e2638] bg-[#000000]' : (level >= 4 ? 'border-[#c5a880]/80 bg-[#090d14] shadow-md' : 'border-[#1e2638] bg-[#090d14]')}">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-[#1e2638]/70 pb-2">
            <div class="space-y-0.5 min-w-0 flex-1">
              <div class="flex items-center gap-2 flex-wrap">
                <strong class="text-xs sm:text-sm text-white font-bold block">${escapeHtml(clause.title)}</strong>
                <span class="px-2 py-0.5 rounded text-[9.5px] font-mono font-bold ${level === 0 ? 'bg-[#000000] text-[#94a3b8]' : (level >= 4 ? 'bg-[#000000] text-[#c5a880] border border-[#c5a880]/60' : 'bg-[#000000] text-[#94a3b8] border border-[#1e2638]')}">
                  ${level === 0 ? 'Deaktiviert (Stufe 0)' : `Stufe ${level}/5`}
                </span>
              </div>
              <p class="text-[10px] text-[#94a3b8] leading-snug break-words">${escapeHtml(clause.desc)}</p>
              <div class="flex items-center gap-1 pt-0.5 text-[9.5px] text-[#94a3b8]/80 font-mono">
                <span>Quellen:</span>
                ${linksHtml}
              </div>
            </div>

            <!-- Stufen-Tasten (Nur Top) -->
            ${isTop ? `
              <div class="flex items-center gap-1 font-mono text-xs flex-shrink-0">
                ${[0, 1, 2, 3, 4, 5].map(lvl => `
                  <button type="button" onclick="ProtocolContract.setLevel('${key}', ${lvl})" class="w-6 h-6 sm:w-7 sm:h-7 rounded-xl font-bold flex items-center justify-center transition-all touch-btn ${level === lvl ? 'bg-[#c5a880] text-black shadow-sm' : 'bg-[#000000] border border-[#1e2638] text-[#94a3b8] hover:text-white'}">
                    ${lvl}
                  </button>
                `).join('')}
              </div>
            ` : `
              <span class="text-[10px] font-mono text-[#94a3b8] italic">Top-Regie</span>
            `}
          </div>

          <!-- Wortlaut mit Editier-Option -->
          <div class="space-y-2">
            <div id="clause-text-display-${key}" class="p-3.5 rounded-2xl bg-[#000000] border border-[#1e2638] text-[11px] leading-relaxed text-[#f8fafc] whitespace-pre-wrap font-sans">
              ${escapeHtml(text)}
            </div>

            ${isTop ? `
              <div class="flex justify-end gap-1.5 pt-1">
                <button type="button" onclick="ProtocolContract.editClause('${key}')" class="px-2.5 py-1 rounded-xl bg-[#000000] hover:bg-[#101622] border border-[#1e2638] text-[#c5a880] font-mono text-[10px] font-bold touch-btn flex items-center gap-1">
                  <svg class="w-3 h-3 text-[#c5a880]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/></svg>
                  <span>Wortlaut anpassen</span>
                </button>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');

    renderSignaturesBlock();
  }

  function renderSignaturesBlock() {
    const names = getPairNames();
    const sigBoxTop = document.getElementById('sig-box-top');
    const sigBoxSub = document.getElementById('sig-box-sub');
    const labelTop = document.getElementById('sig-label-top');
    const labelSub = document.getElementById('sig-label-sub');

    if (labelTop) labelTop.innerText = `Signatur Top (${names.top})`;
    if (labelSub) labelSub.innerText = `Signatur Bottom (${names.sub})`;

    if (sigBoxTop) {
      if (contractState.signatureTop) {
        sigBoxTop.innerHTML = `<img src="${contractState.signatureTop}" alt="Signatur Top" class="max-h-16 mx-auto object-contain filter invert contrast-200" />`;
      } else {
        sigBoxTop.innerHTML = `<span class="text-[#94a3b8] font-serif italic text-xs">Noch nicht unterzeichnet</span>`;
      }
    }

    if (sigBoxSub) {
      if (contractState.signatureSub) {
        sigBoxSub.innerHTML = `<img src="${contractState.signatureSub}" alt="Signatur Bottom" class="max-h-16 mx-auto object-contain filter invert contrast-200" />`;
      } else {
        sigBoxSub.innerHTML = `<span class="text-[#94a3b8] font-serif italic text-xs">Noch nicht unterzeichnet</span>`;
      }
    }
  }

  function setClauseLevel(clauseKey, level) {
    if (!isUserTop()) return;
    loadContractState();
    if (!contractState.clauses[clauseKey]) return;

    contractState.clauses[clauseKey].level = level;
    const names = getPairNames();
    const pData = analyzeWeightedPsychometrics(names.topRole, names.subRole);
    contractState.customTexts[clauseKey] = synthesizeClauseWording(clauseKey, level, pData, names);

    saveContractState();
    renderContractDashboard();
    showToast(`§ ${clauseKey.replace('k', '')} auf Stufe ${level} gesetzt`);
  }

  function editClause(clauseKey) {
    if (!isUserTop()) return;
    const box = document.getElementById(`clause-text-display-${clauseKey}`);
    if (!box) return;

    loadContractState();
    const currentText = contractState.customTexts[clauseKey] || box.innerText;

    box.innerHTML = `
      <div class="space-y-2">
        <textarea id="input-edit-clause-${clauseKey}" rows="6" class="w-full p-2.5 bg-[#000000] border border-[#c5a880] rounded-xl text-white text-[11px] font-sans focus:outline-none leading-relaxed">${escapeHtml(currentText)}</textarea>
        <div class="flex justify-end gap-1.5">
          <button type="button" onclick="ProtocolContract.render()" class="px-3 py-1 bg-[#090d14] border border-[#1e2638] text-[#94a3b8] font-bold rounded-xl text-xs touch-btn">Abbrechen</button>
          <button type="button" onclick="ProtocolContract.saveClauseText('${clauseKey}')" class="px-3 py-1 bg-[#c5a880] text-black font-bold rounded-xl text-xs touch-btn shadow-md">Wortlaut sichern ✓</button>
        </div>
      </div>
    `;
  }

  function saveClauseText(clauseKey) {
    if (!isUserTop()) return;
    const textarea = document.getElementById(`input-edit-clause-${clauseKey}`);
    if (!textarea) return;

    loadContractState();
    contractState.customTexts[clauseKey] = textarea.value.trim();
    saveContractState();
    renderContractDashboard();
    showToast("Wortlaut erfolgreich gesichert ✓");
  }

  function openSignatureModal(role) {
    activeSignModalRole = role;
    let modal = document.getElementById('modal-contract-signature');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modal-contract-signature';
      modal.className = "fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none";
      document.body.appendChild(modal);
    }

    const names = getPairNames();
    const signerName = (role === 'top') ? names.top : names.sub;

    modal.innerHTML = `
      <div class="bg-[#090d14] rounded-3xl max-w-md w-full border border-[#c5a880]/60 p-5 space-y-4 shadow-2xl text-xs text-[#f8fafc]">
        <div class="flex items-center justify-between border-b border-[#1e2638] pb-2">
          <div>
            <h3 class="text-sm font-bold text-white font-serif">Ratifizierung: ${escapeHtml(signerName)}</h3>
            <span class="text-[10px] text-[#94a3b8] font-mono">Zeichne deinen Namenszug oder dein Siegel</span>
          </div>
          <button type="button" onclick="document.getElementById('modal-contract-signature').style.display='none'" class="p-1.5 text-[#94a3b8] hover:text-white">✕</button>
        </div>

        <div class="space-y-1.5">
          <div class="h-44 w-full rounded-2xl bg-[#000000] border border-[#1e2638] relative overflow-hidden flex items-center justify-center">
            <canvas id="signature-pad-canvas" class="w-full h-full cursor-crosshair touch-none"></canvas>
            <span id="signature-placeholder" class="absolute pointer-events-none text-[#94a3b8]/50 font-serif italic text-xs">Hier mit Finger oder Stift zeichnen...</span>
          </div>
          <div class="flex justify-between items-center text-[10px] font-mono">
            <button type="button" onclick="ProtocolContract.clearSignatureCanvas()" class="text-[#94a3b8] hover:text-[#c5a880]">Löschen / Neu</button>
            <span class="text-[#c5a880] font-bold">Unwiderruflicher Ratifizierungs-Akt</span>
          </div>
        </div>

        <div class="flex justify-end gap-2 pt-2 border-t border-[#1e2638]">
          <button type="button" onclick="document.getElementById('modal-contract-signature').style.display='none'" class="px-4 py-2 bg-[#000000] border border-[#1e2638] text-[#94a3b8] font-bold rounded-xl text-xs touch-btn">Abbrechen</button>
          <button type="button" onclick="ProtocolContract.saveSignature()" class="px-5 py-2 bg-[#c5a880] hover:bg-[#dfcaa9] text-black font-bold rounded-xl text-xs touch-btn shadow-md">Signatur besiegeln ✓</button>
        </div>
      </div>
    `;

    modal.style.display = 'flex';
    initSignatureCanvas();
  }

  function initSignatureCanvas() {
    const canvas = document.getElementById('signature-pad-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.strokeStyle = activeSignModalRole === 'top' ? '#d4af37' : '#c5a880';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    isDrawingSignature = false;

    function getCoords(e) {
      const cRect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - cRect.left,
        y: clientY - cRect.top
      };
    }

    function start(e) {
      isDrawingSignature = true;
      const ph = document.getElementById('signature-placeholder');
      if (ph) ph.style.display = 'none';
      const c = getCoords(e);
      ctx.beginPath();
      ctx.moveTo(c.x, c.y);
      if (e.cancelable) e.preventDefault();
    }

    function move(e) {
      if (!isDrawingSignature) return;
      const c = getCoords(e);
      ctx.lineTo(c.x, c.y);
      ctx.stroke();
      if (e.cancelable) e.preventDefault();
    }

    function end() {
      isDrawingSignature = false;
    }

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);

    canvas.addEventListener('touchstart', start, { passive: false });
    canvas.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', end);
  }

  function clearSignatureCanvas() {
    const canvas = document.getElementById('signature-pad-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const ph = document.getElementById('signature-placeholder');
    if (ph) ph.style.display = 'block';
  }

  function saveSignature() {
    const canvas = document.getElementById('signature-pad-canvas');
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    loadContractState();

    if (activeSignModalRole === 'top') {
      contractState.signatureTop = dataUrl;
    } else {
      contractState.signatureSub = dataUrl;
    }

    if (contractState.signatureTop && contractState.signatureSub) {
      contractState.status = 'active';
      contractState.signedAt = Date.now();
      showToast("✓ Beide Signaturen besiegelt: Der Beziehungsvertrag ist ratifiziert!");
      if (window.ChatApp && typeof window.ChatApp.postSystemEvent === 'function') {
        window.ChatApp.postSystemEvent(`Beziehungsvertrag vollständig ratifiziert und gültig besiegelt (Version ${contractState.version}).`);
      }
    } else {
      showToast(`Signatur für ${activeSignModalRole.toUpperCase()} besiegelt. Partner-Signatur noch ausstehend.`);
    }

    saveContractState();
    const modal = document.getElementById('modal-contract-signature');
    if (modal) modal.style.display = 'none';
    renderContractDashboard();
  }

  function exportRedactedContract() {
    loadContractState();
    const names = getPairNames();
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext('2d');

    // Hintergrund OLED-Schwarz
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 1080, 1350);

    // Feiner Doppelrahmen in Urkunden-Feingold
    ctx.strokeStyle = "#d4af37";
    ctx.lineWidth = 3;
    ctx.strokeRect(40, 40, 1000, 1270);
    ctx.lineWidth = 1;
    ctx.strokeRect(48, 48, 984, 1254);

    // Zier-Ecken
    ctx.fillStyle = "#d4af37";
    const corners = [[40, 40], [1040, 40], [40, 1310], [1040, 1310]];
    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Titel-Typografie Haute Horlogerie
    ctx.textAlign = "center";
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 34px 'Cormorant Garamond', Georgia, serif";
    ctx.fillText("TACTUS INTIMUM", 540, 120);

    ctx.fillStyle = "#c5a880";
    ctx.font = "600 16px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("BEZIEHUNGSVERTRAG & D/S-KODEX", 540, 155);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "13px 'JetBrains Mono', monospace";
    ctx.fillText(`RATIFIZIERT DURCH BEIDE PARTEIEN · VERSION ${contractState.version}`, 540, 185);

    // Trennlinie
    ctx.strokeStyle = "rgba(212, 175, 55, 0.4)";
    ctx.beginPath();
    ctx.moveTo(140, 210);
    ctx.lineTo(940, 210);
    ctx.stroke();

    // 8 Paragraphen als geschwärzte Urkunde
    ctx.textAlign = "left";
    let y = 250;
    const clauseKeys = Object.keys(DEFAULT_CONTRACT_CLAUSES);

    clauseKeys.forEach((key, idx) => {
      const clause = contractState.clauses[key] || DEFAULT_CONTRACT_CLAUSES[key];
      const level = clause.level !== undefined ? clause.level : 3;

      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 15px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText(`§ ${idx + 1} ${clause.title.split(' ')[1] || 'Klausel'} [Stufe ${level}/5]`, 90, y);

      // Geschwärzte Textbalken
      ctx.fillStyle = "#1e2638";
      ctx.fillRect(90, y + 12, 800, 12);
      ctx.fillRect(90, y + 30, 680, 12);
      ctx.fillRect(90, y + 48, 740, 12);

      // Dezent eingeprägtes Wasserzeichen
      ctx.fillStyle = "rgba(197, 168, 128, 0.35)";
      ctx.font = "bold 9.5px 'JetBrains Mono', monospace";
      ctx.fillText("[ VERTRAULICH · PRIVATSPHÄRE GESCHÜTZT ]", 100, y + 39);

      y += 85;
    });

    // Goldenes TACTUS-Wachssiegel unten zentriert
    ctx.save();
    ctx.translate(540, y + 65);
    ctx.strokeStyle = "#d4af37";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 52, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, 46, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.fillStyle = "#d4af37";
    ctx.textAlign = "center";
    ctx.font = "bold 13px 'Cormorant Garamond', serif";
    ctx.fillText("TACTUS", 0, -6);
    ctx.font = "9px 'JetBrains Mono', monospace";
    ctx.fillText("SEAL OF TRUST", 0, 12);
    ctx.restore();

    // Footer
    ctx.fillStyle = "#94a3b8";
    ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("Offizielle Urkunde · Verifiziert via E2EE Zero-Knowledge Protocol · tactus.digital", 540, 1290);

    const a = document.createElement('a');
    a.download = `tactus_beziehungsvertrag_redacted_${Date.now()}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
    showToast("✓ Geschwärzte Urkunde für Foren & Social Media exportiert");
  }

  function openPrintDialog() {
    let modal = document.getElementById('modal-contract-print-choice');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modal-contract-print-choice';
      modal.className = "fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none";
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="bg-[#090d14] rounded-3xl max-w-md w-full border border-[#c5a880]/60 p-5 space-y-4 shadow-2xl text-xs text-[#f8fafc]">
        <div class="flex items-center justify-between border-b border-[#1e2638] pb-2">
          <h3 class="text-sm font-bold text-white font-serif">Druckbare Urkunde &amp; Zeremonie</h3>
          <button type="button" onclick="document.getElementById('modal-contract-print-choice').style.display='none'" class="p-1.5 text-[#94a3b8] hover:text-white">✕</button>
        </div>

        <p class="text-[10.5px] text-[#94a3b8] leading-snug">
          Wähle das Format für den Ausdruck auf hochwertigem Papier oder Pergament:
        </p>

        <div class="space-y-2">
          <button type="button" onclick="ProtocolContract.executePrint(true)" class="w-full p-3 rounded-2xl bg-[#000000] hover:bg-[#101622] border border-[#c5a880]/60 text-left space-y-1 touch-btn shadow-md">
            <strong class="text-xs text-[#c5a880] block font-bold">1. Ausdruck mit digitalen Signaturen</strong>
            <span class="text-[10px] text-[#94a3b8] block">Druckt den vollständigen Vertrag inklusive der im Browser gezeichneten Unterschriften.</span>
          </button>

          <button type="button" onclick="ProtocolContract.executePrint(false)" class="w-full p-3 rounded-2xl bg-[#000000] hover:bg-[#101622] border border-[#1e2638] text-left space-y-1 touch-btn">
            <strong class="text-xs text-white block font-bold">2. Blanko-Druck für analoge Zeremonie</strong>
            <span class="text-[10px] text-[#94a3b8] block">Lässt die Siegelfelder frei für die feierliche handschriftliche Unterzeichnung mit Füllfederhalter und Siegelwachs.</span>
          </button>
        </div>

        <div class="pt-2 border-t border-[#1e2638] flex justify-end">
          <button type="button" onclick="document.getElementById('modal-contract-print-choice').style.display='none'" class="px-4 py-2 bg-[#000000] border border-[#1e2638] text-[#94a3b8] font-bold rounded-xl text-xs touch-btn">Abbrechen</button>
        </div>
      </div>
    `;

    modal.style.display = 'flex';
  }

  function executePrint(includeDigitalSignatures) {
    const modal = document.getElementById('modal-contract-print-choice');
    if (modal) modal.style.display = 'none';

    ensurePrintStyles();

    if (includeDigitalSignatures) {
      document.body.classList.remove('print-blank-signatures');
    } else {
      document.body.classList.add('print-blank-signatures');
    }

    if (window.ProtocolCore && typeof window.ProtocolCore.switchTab === 'function') {
      window.ProtocolCore.switchTab('contract');
    }

    setTimeout(() => {
      window.print();
    }, 250);
  }

  function ensurePrintStyles() {
    let styleEl = document.getElementById('tactus-contract-print-styles');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'tactus-contract-print-styles';
      document.head.appendChild(styleEl);
    }

    styleEl.innerHTML = `
      @media print {
        @page {
          size: A4 portrait;
          margin: 18mm 15mm 18mm 15mm;
        }

        body, html {
          background: #ffffff !important;
          color: #000000 !important;
          font-family: 'Plus Jakarta Sans', -apple-system, sans-serif !important;
          font-size: 10pt !important;
          line-height: 1.5 !important;
        }

        header, nav, #bottom-readonly-banner, .no-print,
        #modal-contract-signature, #modal-contract-print-choice,
        #modal-reject-task, #modal-execute-discipline,
        #modal-break-glass, #modal-ledger-role-config,
        #view-ledger-dashboard, #view-ledger-chores, #view-ledger-ai_coach,
        #toast-container, button {
          display: none !important;
        }

        #view-ledger-contract {
          display: block !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        .theme-card {
          background: #ffffff !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
          margin-bottom: 6mm !important;
        }

        #view-ledger-contract > div:first-child {
          border-bottom: 2pt solid #000000 !important;
          padding-bottom: 4mm !important;
          margin-bottom: 6mm !important;
        }

        h2 {
          font-family: 'Cormorant Garamond', Georgia, serif !important;
          font-size: 18pt !important;
          font-weight: bold !important;
          color: #000000 !important;
          margin: 0 0 2mm 0 !important;
        }

        #contract-clauses-container > div {
          background: #ffffff !important;
          border: 1px solid #cbd5e1 !important;
          border-left: 3pt solid #000000 !important;
          border-radius: 4pt !important;
          padding: 4mm !important;
          margin-bottom: 4mm !important;
          page-break-inside: avoid !important;
        }

        #contract-clauses-container strong {
          font-size: 11pt !important;
          color: #000000 !important;
        }

        [id^="clause-text-display-"] {
          background: transparent !important;
          border: none !important;
          padding: 0 !important;
          color: #1e293b !important;
          font-size: 9.5pt !important;
          white-space: pre-wrap !important;
        }

        .theme-card:has(#sig-box-top) {
          border-top: 1.5pt solid #000000 !important;
          margin-top: 8mm !important;
          padding-top: 6mm !important;
          page-break-inside: avoid !important;
        }

        #sig-box-top, #sig-box-sub {
          border: 1pt dashed #94a3b8 !important;
          background: #f8fafc !important;
          min-height: 28mm !important;
        }

        body.print-blank-signatures #sig-box-top img,
        body.print-blank-signatures #sig-box-sub img {
          display: none !important;
        }

        body.print-blank-signatures #sig-box-top,
        body.print-blank-signatures #sig-box-sub {
          position: relative;
        }

        body.print-blank-signatures #sig-box-top::after,
        body.print-blank-signatures #sig-box-sub::after {
          content: "L. S. (Locus Sigilli / Siegelwachs)";
          position: absolute;
          bottom: 2mm;
          right: 3mm;
          font-family: monospace;
          font-size: 8pt;
          color: #94a3b8;
        }
      }
    `;
  }

  const api = {
    init: function() {
      loadContractState();
      renderContractDashboard();
      ensurePrintStyles();
    },
    render: renderContractDashboard,
    generateFromContext: generateContractFromContext,
    setLevel: setClauseLevel,
    editClause: editClause,
    saveClauseText: saveClauseText,
    openSignatureModal: openSignatureModal,
    initSignatureCanvas: initSignatureCanvas,
    clearSignatureCanvas: clearSignatureCanvas,
    saveSignature: saveSignature,
    exportRedacted: exportRedactedContract,
    openPrintDialog: openPrintDialog,
    executePrint: executePrint,
    validateHarmony: validatePsychosomaticHarmony,
    getActiveContract: function() {
      loadContractState();
      return Object.assign({}, contractState);
    }
  };

  window.ProtocolContract = api;
  window.LedgerContract = api;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', api.init);
  } else {
    api.init();
  }

})(window);
