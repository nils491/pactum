/**
 * js/protocol_contract.js
 * TACTUS Dynamisches Bündnis- & Vertrags-Studio (V3.0 Hyper-Dynamisch)
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien:
 * - 100 % OPTIONALES MODUL: Keuschheit, Zucht oder der gesamte Vertrag können
 *   vollständig deaktiviert werden (Stufe 0 = Klausel entfällt restlos)
 * - Gewichtete Psychometrie-Synthese:
 *   • Doppel-Spitzen (5/5): Voll integriert (Gewicht 1.0)
 *   • Hohe Synergien (5/4 & 4/5): Fester Bestandteil (Gewicht 0.85)
 *   • Erkundungs-Brücken (5/3 & 4/3): Einfließen als behutsame Probe-Klauseln (Gewicht 0.65)
 *   • Verletzliche Sehnsüchte (Scham-Marker 🙈 bei Score >= 3): Schutzraum-Klauseln mit Spottverbot
 *   • Tabu-Vetos (Score 1) & Sanfte Grenzen (Score 2): Automatische Sperren & Drosselung
 * - Psychosomatische Cross-Clause Resonanz:
 *   • Denial-Kompensation (Keuschheit >= 4 erzwingt Fürsorge >= 3 & Berührungsanker)
 *   • Top-Fatigue Schutz (Disziplin >= 4 erzwingt Haushaltsdienst zur Entlastung)
 * - Anti-TftB Doktrin (§ 2 Abs. 3 Regieverbot, § 3 Abs. 4 Schweigepflicht über Lust)
 * - Dualer Ratifizierungs-Export: Touch-Signatur im Browser ODER Blanko-Zeremonie
 *   für Füllfederhalter und Siegelwachs auf Büttenpapier (@media print)
 * - 1-Klick Redacted Contract Canvas Export (1080x1350) für diskreten Social Proof
 * - 100 % frei von infantilen System-Emojis in Buttons und Datenstrukturen
 * - Keine window.alert() / window.confirm() Aufrufe unter keinen Umständen
 */

(function(window) {
  'use strict';

  const STORAGE_KEY_CONTRACT = 'tactus_contract_state';
  const STORAGE_KEY_LEGACY = 'kompass_contract_state';

  // Zuordnung der 36 Fragebogen-Kapitel zu den 8 Vertrags-Dimensionen für gewichtete Cluster-Berechnung
  const CHAPTER_CLUSTER_MAP = {
    k1_preamble: [0, 1, 9],               // Anatomie, Romantik/Konsens, BDSM-Basics
    k2_hierarchy: [9, 15, 17],            // BDSM-Basics, Scham/Nacktheit, Rollenspiele
    k3_spheres: [5, 16],                  // Sexuelle Frequenz/Alltag, Diskrete Öffentlichkeit
    k4_aftercare: [1, 14, 19, 34, 35],    // Romantik, Kitzeln/Schutz, Caregiver, Vagus, Drop-Prävention
    k5_chastity: [7, 8],                  // Keuschheit/Orgasmuskontrolle, Hardware/Schlösser
    k6_service: [3, 9, 23, 29, 31],       // Orale Hingabe, Rollen, Fuß-Service, Feminisierung, Finanzieller Dienst
    k7_discipline: [10, 11, 12, 24, 25],  // Fesselung, Spanking, Impact Tools, Knebel/Atem, CBT
    k8_safewords: [9, 24, 34, 35]         // BDSM-Basics (SSC/RACK), Atemgrenzen, Vagus, Nachsorge
  };

  const DUKTUS_TONALITIES = {
    sovereign_warm: {
      id: 'sovereign_warm',
      label: 'Souverän & Warm (Standard)',
      desc: 'Klare, erwachsene Führung, emotionale Verlässlichkeit und tiefe Geborgenheit',
      badgeClass: 'bg-purple-950 text-purple-200 border-purple-700'
    },
    sovereign_cool: {
      id: 'sovereign_cool',
      label: 'Kühl & Unerbittlich',
      desc: 'Wenig Worte, messerscharfe Distanz, unnachgiebige Disziplin',
      badgeClass: 'bg-indigo-950 text-indigo-200 border-indigo-700'
    },
    raw_primal: {
      id: 'raw_primal',
      label: 'Rau & Primal',
      desc: 'Körperlich, instinktiv, direkt auf den Punkt, ungeschliffen',
      badgeClass: 'bg-rose-950 text-rose-200 border-rose-700'
    },
    playful: {
      id: 'playful',
      label: 'Verspielt & Spöttisch',
      desc: 'Sinnliches Teasing, erotische Herausforderung und subtiler Schalk',
      badgeClass: 'bg-amber-950 text-amber-200 border-amber-700'
    }
  };

  const CONTRACT_DIMENSIONS = [
    {
      key: 'k1_preamble',
      num: '§ 1',
      title: 'Präambel & Einvernehmlichkeit (Konsens)',
      canDisable: false,
      levels: {
        1: "Beide Partner treten aus freien Stücken in dieses Abkommen ein. Das Spiel mit Führung und Hingabe dient der Vertiefung gegenseitiger Nähe. Alle Handlungen folgen dem Prinzip unbedingter Absprache.",
        3: "Beide Partner treten vollkommen freiwillig und im Vollbesitz ihrer geistigen Kräfte in dieses Abkommen ein. Das bewusste Spiel mit Macht, Disziplin und Hingabe folgt ausnahmslos den ethischen Prinzipien von Safe, Sane & Consensual (SSC) sowie RACK. Echte Bosheit, Alltagszorn oder Gefährdung der körperlichen Unversehrtheit sind ausgeschlossen.",
        5: "Beide Partner weihen ihr Zusammensein einem unumstößlichen Bündnis. Der Bottom übergibt die Regie über Lust, Körper und Zeit im Rahmen unverletzlicher ethischer Grenzen ungeteilt an den Top. Das Bündnis ist ein geschützter Raum bedingungslosen Vertrauens."
      }
    },
    {
      key: 'k2_hierarchy',
      num: '§ 2',
      title: 'Rollen, Titel & Verbot der verdeckten Regie',
      canDisable: true,
      levels: {
        0: "Titel und formelle Hierarchien sind nicht Gegenstand dieses Abkommens. Beide Partner begegnen sich mit ihren gewohnten Vornamen auf Augenhöhe.",
        1: "Die Führung obliegt im geschützten Raum dem Top. Im Alltag begegnen sich beide Partner mit gegenseitigem Respekt und gewohnten Namen.",
        3: "Abs. 1: Die Leitung der Dynamik obliegt ungeteilt dem Top. Der Bottom erkennt diese Führung mit aufrichtiger Hingabe an.\nAbs. 2: Im Alltag und nach außen gilt das Stealth-Prinzip: Absolute Diskretion vor Dritten.\nAbs. 3 (Verbot der verdeckten Regie): Das bewusste oder unbewusste Diktieren von Handlungen, Strafen oder Belohnungen durch den Bottom gilt als subtiler Ungehorsam. Die Regie liegt unteilbar beim Top.",
        5: "Abs. 1: Dem Top gebührt ungeteilte Autorität und ehrerbietige Anrede im privaten Raum. Der Bottom spricht nur nach Aufforderung.\nAbs. 2: Jede Form verdeckter Regieführung („Topping from the Bottom“) ist strikt untersagt. Jeder Verstoß zieht sofortige Disziplinierung nach sich."
      }
    },
    {
      key: 'k3_spheres',
      num: '§ 3',
      title: 'Sphärentrennung & Geltungsbereich',
      canDisable: false,
      levels: {
        1: "Dieser Kodex gilt ausschließlich bei geschlossener Schlafzimmertür während verabredeter Spielzeiten.",
        3: "Abs. 1: Die Bestimmungen dieses Bündnisses gelten im privaten häuslichen Raum sowie während vereinbarter Session-Zeiten.\nAbs. 2: Im Berufsleben, vor der Familie und im Freundeskreis sind beide Partner ein gleichberechtigtes Team auf Augenhöhe.",
        5: "Die Hierarchie durchdringt das gesamte private Zusammenleben. Diskrete Anker und Berührungsverbote begleiten das Paar auch außerhalb des Hauses, ohne für Dritte sichtbar zu sein."
      }
    },
    {
      key: 'k4_aftercare',
      num: '§ 4',
      title: 'Fürsorge, Nervensystem & Reverse Aftercare',
      canDisable: false,
      levels: {
        1: "Nach jeder intensiven Phase halten beide Partner mindestens 10 Minuten gemeinsame Ruhe und versorgen sich mit Wasser und Nähe.",
        3: "Abs. 1: Der Top garantiert nach jeder Session mindestens 15 Minuten ununterbrochene Aftercare: feste Umarmung, warme Decken und Vagus-Atmung zur Abwendung eines Subdrops.\nAbs. 2 (Reverse Aftercare & Top-Entlastung): Dem Bottom obliegt die Pflicht zur körperlichen Versorgung des Tops (Getränke reichen, Massage ermüdeter Muskeln, dezentquittierte Desinfektion und Aufräumen der Ausrüstung). Erst nach Erfüllung dieser Fürsorge darf der Bottom um eigene Ruhe bitten.",
        5: "Abs. 1: Der Top wacht mit höchster Achtsamkeit über die vegetativ-seelische Verfassung des Bottoms (Gewichtsdecken-Erdung gegen Kältezittern, Glukosegabe).\nAbs. 2: Nach jeder Session bedient der Bottom den Top hingebungsvoll (Fußmassage, Entlastung) und hält die Deckenruhe bis zur vollständigen Stabilisierung des Nervensystems ein."
      }
    },
    {
      key: 'k5_chastity',
      num: '§ 5',
      title: 'Orgasmus-Ökonomie, Keuschheit & Schweigepflicht',
      canDisable: true,
      levels: {
        0: "Keuschheit und Orgasmus-Beschränkungen sind nicht Gegenstand dieses Bündnisses. Die Intimität beider Partner bleibt frei und unreglementiert.",
        1: "Gelegentlicher Triebaufschub im Schlafzimmer dient der erotischen Vorfreude. Höhepunkte erfolgen im gegenseitigen Einvernehmen.",
        3: "Abs. 1: Das Genital des Bottoms unterliegt der Schlüsselgewalt des Tops. Jeder Orgasmus ist ein seltenes Privileg und bedarf vorheriger Erlaubnis.\nAbs. 2: Die Orgasmus-Ratio richtet sich nach der Lust des Tops. Erreichte Quoten begründen keinen Rechtsanspruch des Bottoms.\nAbs. 3: Unerlaubtes Berühren des Verschlusses gilt als schwerer Vertrauensbruch. Dusch- und Pflegepausen erfolgen nach Zeitprotokoll.\nAbs. 4 (Schweigepflicht über Verschluss & Lust): Dem Bottom ist jedes unaufgeforderte Thematisieren, Nachfragen oder Jammern bezüglich Freilassung, Schlüsseln oder Orgasmen untersagt. Ein Bitten um Erlaubnis ist nur gestattet, wenn der Top dies ausdrücklich befiehlt.",
        5: "Abs. 1: Dauerhafte Keuschheit im Verschluss. Der Bottom hat jeglichen Anspruch auf eigene Ejakulationen an den Top abgetreten.\nAbs. 2: Freigaben erfolgen extrem selten und nach freiem Ermessen der Herrin, vorzugsweise als Ruined Orgasm oder über Prostata.\nAbs. 3: Schweigepflicht über die eigene Lust ist absolut. Jedes Zuwiderhandeln verlängert die Tragedauer um mindestens 48 Stunden."
      }
    },
    {
      key: 'k6_service',
      num: '§ 6',
      title: 'Dienste, Haushalt & Entlastung des Tops',
      canDisable: true,
      levels: {
        0: "Häusliche Dienste und Alltagsaufgaben sind nicht Gegenstand dieses Vertrags und werden partnerschaftlich geteilt.",
        1: "Kleine Aufmerksamkeiten (Kaffeedienst, gelegentliche Massage) werden zur Freude des Partners gerne geleistet.",
        3: "Abs. 1: Der Bottom erfüllt die im Protokoll vereinbarten Tages- und Wochenpflichten sorgfältig, um den Top vom Mental Load des Haushalts zu befreien.\nAbs. 2: Beim Eintreffen des Tops zuhause erfolgt auf Wunsch der Begrüßungs-Kniestand oder die Übergabe der Hausschuhe.\nAbs. 3: Pflege des Intimbereichs (Rasur) und Körperhygiene werden lückenlos aufrechterhalten.",
        5: "Umfassende häusliche Dienstbarkeit: Der Bottom hält die Lebensräume des Tops makellos rein. Sämtliche Versorgungsdienste werden aufmerksam und ohne Aufforderung erbracht."
      }
    },
    {
      key: 'k7_discipline',
      num: '§ 7',
      title: 'Disziplin, Sühne & Sanktionen',
      canDisable: true,
      levels: {
        0: "Physische Zucht und formelle Bestrafungen sind nicht Gegenstand dieses Abkommens.",
        1: "Milde Rügen, sportliche Ausgleichsübungen oder eine zusätzliche Massage dienen dem Ausgleich kleiner Versehen.",
        3: "Abs. 1: Pflichtverletzungen und Unpünktlichkeit werden nach dem Strafenkatalog des Protokolls gesühnt (Punkteabzug oder Schläge mit dem Ledergürtel).\nAbs. 2: Zucht erfolgt mit ruhiger Hand und ohne Alltagszorn. Der Bottom zählt jeden Treffer laut mit.\nAbs. 3: Der Bottom darf um Verhandlung und Ablass durch Tributpunkte bitten; die Entscheidung obliegt allein dem Top.",
        5: "Formelle, unnachgiebige Disziplinierung: Regelverstöße werden unmittelbar durch festgelegte Zuchtakte (Paddle, Gürtel, Stock) gesühnt. Schlichtung erfolgt erst nach vollständigem Vollzug."
      }
    },
    {
      key: 'k8_safewords',
      num: '§ 8',
      title: 'Not-Aus, RACK-Sicherheit & Revision',
      canDisable: false,
      levels: {
        1: "Jederzeitiger formloser Abbruch einer Handlung durch klares Aussprechen des partnerschaftlichen Stoppworts.",
        3: "Abs. 1: Das dreistufige Safeword-System (Grün = Bestätigung, Gelb = Drosseln, Rot = Sofortiger Stillstand) sowie das Klopfsignal bei Knebelung beenden jede Handlung unverzüglich und ausnahmslos.\nAbs. 2: Das Notfall-Öffnungsprotokoll (Break-Glass) steht dem Bottom bei medizinischen Notfällen oder Taubheitsgefühlen jederzeit zu.\nAbs. 3: Dieser Vertrag gilt für 30 Tage und wird danach in einer gemeinsamen Revisions-Zeremonie auf Augenhöhe ausgewertet.",
        5: "Lückenloser Hochsicherheitsrahmen: Safewords und Break-Glass-Notfallrechte stehen über jeder Hierarchie. Biologische und medizinische Notwendigkeiten brechen jedes Protokoll. Ein monatliches Schlichtungsgespräch prüft das beiderseitige seelische Wohlbefinden."
      }
    }
  ];

  let contractState = null;
  let signingRole = 'top';
  let signaturePad = {
    canvas: null,
    ctx: null,
    drawing: false,
    hasSignature: false
  };

  function getDefaultContractState() {
    return {
      version: "1.0 Entwurf",
      status: "draft",
      duktus: 'sovereign_warm',
      chapters: CONTRACT_DIMENSIONS.map(dim => ({
        key: dim.key,
        num: dim.num,
        title: dim.title,
        canDisable: dim.canDisable,
        level: (dim.key === 'k5_chastity') ? 0 : 3,
        customText: null
      })),
      signatureTop: null,
      signatureSub: null,
      signedAt: null,
      healthGuardsApplied: [],
      psychometricInsights: null,
      updatedAt: Date.now()
    };
  }

  function loadContractState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CONTRACT) || localStorage.getItem(STORAGE_KEY_LEGACY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          contractState = parsed;
          if (!Array.isArray(contractState.chapters) || contractState.chapters.length === 0) {
            contractState.chapters = getDefaultContractState().chapters;
          }
          return;
        }
      }
    } catch (e) {
      console.warn("[TACTUS Contract] Fehler beim Laden des States:", e);
    }
    contractState = getDefaultContractState();
  }

  function saveContractState(skipSync) {
    if (!contractState) return;
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
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
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
    const myRole = localStorage.getItem('kompass_assigned_role') || 'A';
    const khRole = localStorage.getItem('kompass_keyholder_role') || 'A';
    return myRole === khRole;
  }

  function validatePsychosomaticHarmony() {
    loadContractState();
    const chMap = {};
    contractState.chapters.forEach(ch => { chMap[ch.key] = ch.level; });

    const warnings = [];

    // 1. Denial-Kompensation: Wenn Keuschheit hoch, MUSS Fürsorge & Schutz hoch sein
    if (chMap['k5_chastity'] >= 4 && chMap['k4_aftercare'] < 3) {
      warnings.push({
        severity: 'high',
        text: 'Hoher Triebaufschub (§ 5) ohne proportionale Fürsorge (§ 4) erzeugt Frust und Unruhe. Empfehlung: Hebe § 4 auf Stufe 3 oder höher.'
      });
    }

    // 2. Top-Fatigue Schutz: Wenn Disziplin hoch, MUSS Dienst & Entlastung hoch sein
    if (chMap['k7_discipline'] >= 4 && chMap['k6_service'] < 3) {
      warnings.push({
        severity: 'medium',
        text: 'Strenge Disziplin (§ 7) ohne Haushaltsentlastung (§ 6) führt zur Erschöpfung des Tops. Der Bottom sollte den Top im Alltag aktiv entlasten.'
      });
    }

    // 3. Stufe 0 Konsistenzprüfung
    const isChastityDisabled = chMap['k5_chastity'] === 0;

    return {
      score: Math.max(65, 100 - (warnings.length * 15)),
      warnings: warnings,
      isChastityDisabled: isChastityDisabled
    };
  }

  /**
   * Berechnet eine mehrstufig gewichtete psychometrische Resonanz-Matrix aus allen 36 Fragebogen-Kapiteln.
   * Berücksichtigt nicht nur Doppel-5er, sondern gewichtet:
   * - 5/5: Doppel-Spitzen (Gewicht 1.0)
   * - 5/4 & 4/5: Hohe Synergien (Gewicht 0.85)
   * - 5/3 & 4/3: Erkundungs-Brücken (Gewicht 0.65)
   * - Scham-Marker 🙈 bei Score >= 3: Verletzliche Sehnsüchte mit Spottverbot
   * - Score 1 (Tabu) & Score 2 (Sanfte Grenze): Drosselungs- und Veto-Schranken
   */
  function analyzeWeightedPsychometrics(topRole = 'A', bottomRole = 'B') {
    let rawAnswers = {};
    try {
      const stored = localStorage.getItem('kompass_answers');
      if (stored) rawAnswers = JSON.parse(stored);
    } catch (e) {}

    const ansTop = rawAnswers[topRole] || {};
    const ansBottom = rawAnswers[bottomRole] || {};

    const chapters = (window.surveyChaptersPart1 || []).concat(window.surveyChaptersPart2 || window.surveyChapters || []);
    const itemMap = new Map();
    chapters.forEach(ch => {
      (ch.items || []).forEach(it => {
        itemMap.set(it.id, { id: it.id, title: it.title, desc: it.desc, chapterId: ch.id, chapterTitle: ch.title });
      });
    });

    const doubleFives = [];
    const highSynergies = [];
    const explorationBridges = [];
    const bottomTaboos = [];
    const softBoundaries = [];
    const vulnerableShameItems = [];

    // Cluster-Akkumulatoren für die 8 Vertrags-Dimensionen
    const dimensionScores = {
      k1_preamble: { totalWeight: 0, sumScore: 0, itemsCount: 0 },
      k2_hierarchy: { totalWeight: 0, sumScore: 0, itemsCount: 0 },
      k3_spheres: { totalWeight: 0, sumScore: 0, itemsCount: 0 },
      k4_aftercare: { totalWeight: 0, sumScore: 0, itemsCount: 0 },
      k5_chastity: { totalWeight: 0, sumScore: 0, itemsCount: 0 },
      k6_service: { totalWeight: 0, sumScore: 0, itemsCount: 0 },
      k7_discipline: { totalWeight: 0, sumScore: 0, itemsCount: 0 },
      k8_safewords: { totalWeight: 0, sumScore: 0, itemsCount: 0 }
    };

    itemMap.forEach((meta, itemId) => {
      const sTop = ansTop[`it_${itemId}_r1`];      // Top führt aus / bestimmt
      const sBottom = ansBottom[`it_${itemId}_r2`]; // Bottom empfängt / gibt sich hin
      const isShame = ansBottom[`shame_${itemId}`] === true;

      if (typeof sTop !== 'number' || typeof sBottom !== 'number') return;
      if (sTop === 0 && sBottom === 0) return; // Beidseitig entfallen

      // 1. Tabu- und Grenz-Erkennung
      if (sBottom === 1) {
        bottomTaboos.push({ id: itemId, title: meta.title, reason: 'Tabu des Bottoms (Note 1)' });
      } else if (sBottom === 2) {
        softBoundaries.push({ id: itemId, title: meta.title, reason: 'Sanfte Grenze des Bottoms (Note 2)' });
      }

      // 2. Scham- und Schutzraum-Erkennung (🙈)
      if (isShame && sBottom >= 3) {
        vulnerableShameItems.push({
          id: itemId,
          title: meta.title,
          bottomScore: sBottom,
          topScore: sTop,
          chapterTitle: meta.chapterTitle
        });
      }

      // 3. Mehrstufige Resonanz-Klassifizierung
      let weight = 0;
      let resonanceType = null;

      if (sTop === 5 && sBottom === 5) {
        weight = 1.0;
        resonanceType = 'double_five';
        doubleFives.push({ id: itemId, title: meta.title, chapterTitle: meta.chapterTitle, score: '5/5' });
      } else if ((sTop === 5 && sBottom === 4) || (sTop === 4 && sBottom === 5)) {
        weight = 0.85;
        resonanceType = 'high_synergy';
        highSynergies.push({ id: itemId, title: meta.title, chapterTitle: meta.chapterTitle, score: `${sTop}/${sBottom}` });
      } else if ((sTop >= 4 && sBottom === 3) || (sTop === 3 && sBottom >= 4)) {
        weight = 0.65;
        resonanceType = 'bridge';
        explorationBridges.push({
          id: itemId,
          title: meta.title,
          chapterTitle: meta.chapterTitle,
          topLead: sTop >= 4,
          score: `${sTop}/${sBottom}`
        });
      }

      // 4. Zuordnung zu Vertrags-Dimensionen
      for (const [dimKey, clusterChIds] of Object.entries(CHAPTER_CLUSTER_MAP)) {
        if (clusterChIds.includes(meta.chapterId)) {
          const dimAcc = dimensionScores[dimKey];
          // Harmonischer Mittelwert zwischen Top-Wille und Bottom-Hingabe
          const combinedIntensity = (sTop * 0.6) + (sBottom * 0.4);
          dimAcc.sumScore += combinedIntensity;
          dimAcc.totalWeight += (sBottom === 1) ? 0 : 1; // Tabus drücken das Gewicht
          dimAcc.itemsCount++;
        }
      }
    });

    // Berechne empfohlene Stufen (0, 1, 3, 5) für jede Dimension
    const recommendedLevels = {};
    for (const [dimKey, acc] of Object.entries(dimensionScores)) {
      if (acc.itemsCount === 0 || acc.totalWeight === 0) {
        recommendedLevels[dimKey] = (dimKey === 'k5_chastity' || dimKey === 'k7_discipline') ? 0 : 3;
        continue;
      }
      const meanScore = acc.sumScore / acc.itemsCount;
      if (meanScore < 1.8) {
        recommendedLevels[dimKey] = 0; // Zu geringe Relevanz oder viele Tabus
      } else if (meanScore < 2.8) {
        recommendedLevels[dimKey] = 1; // Mild / Behutsam
      } else if (meanScore < 4.2) {
        recommendedLevels[dimKey] = 3; // Klassisch / D/s-Standard
      } else {
        recommendedLevels[dimKey] = 5; // Strikte Hingabe / Zenit
      }
    }

    return {
      doubleFives,
      highSynergies,
      explorationBridges,
      bottomTaboos,
      softBoundaries,
      vulnerableShameItems,
      recommendedLevels
    };
  }

  async function generateFromContext() {
    if (!isUserTop()) {
      showToast("Nur der Top kann den Vertrags-Entwurf kalibrieren.");
      return;
    }

    loadContractState();
    showToast("Synthetisiere Bündnis aus gewichteter Psychometrie, RACK-Pass & Somatik...");

    let ctx = null;
    if (window.HubContext && typeof window.HubContext.getUnifiedState === 'function') {
      ctx = window.HubContext.getUnifiedState();
    }

    const topRole = ctx ? ctx.metadata.roles.topRole : 'A';
    const bottomRole = ctx ? ctx.metadata.roles.bottomRole : 'B';
    const hasCage = ctx ? ctx.v2_somatic.isLocked : false;
    const healthGuards = (ctx && ctx.v5_biology) ? ctx.v5_biology.activeHealthGuards : [];

    // Gewichtete Psychometrie-Matrix berechnen
    const insights = analyzeWeightedPsychometrics(topRole, bottomRole);

    const newChapters = CONTRACT_DIMENSIONS.map(dim => {
      let lvl = insights.recommendedLevels[dim.key] !== undefined ? insights.recommendedLevels[dim.key] : 3;

      // Zusätzliche somatische Schutz-Bedingungen:
      if (dim.key === 'k5_chastity' && !hasCage && lvl > 0) {
        // Falls kein physischer Käfig vorhanden, Keuschheit maximal auf Stufe 1 (mentaler Triebaufschub) drosseln
        lvl = Math.min(1, lvl);
      }

      return {
        key: dim.key,
        num: dim.num,
        title: dim.title,
        canDisable: dim.canDisable,
        level: lvl,
        customText: null
      };
    });

    // Detaillierte Anhänge & Schutz-Klauseln synthetisieren
    const k8 = newChapters.find(c => c.key === 'k8_safewords');
    const k7 = newChapters.find(c => c.key === 'k7_discipline');
    const k1 = newChapters.find(c => c.key === 'k1_preamble');

    let safetyAddendum = "";

    // 1. Biologische RACK-Sicherheitsgrenzen
    if (healthGuards.length > 0) {
      safetyAddendum += "\n\nBiologische RACK-Sicherheitsgrenzen (Unantastbar):\n" +
        healthGuards.map(g => `• ${g.directive}`).join("\n");
    }

    // 2. Harte Tabu-Vetos (Note 1)
    if (insights.bottomTaboos.length > 0) {
      safetyAddendum += "\n\nUnantastbare Tabu-Schranken des Bottoms (Ausschluss):\n" +
        insights.bottomTaboos.slice(0, 6).map(t => `• ${t.title} (${t.reason})`).join("\n");
    }

    // 3. Sanfte Grenzen (Note 2)
    if (insights.softBoundaries.length > 0) {
      safetyAddendum += "\n\nSanfte Grenzen (Besondere Achtsamkeit & Drosselung):\n" +
        insights.softBoundaries.slice(0, 4).map(b => `• ${b.title}`).join("\n");
    }

    if (safetyAddendum.length > 0 && k8) {
      const baseText = CONTRACT_DIMENSIONS.find(d => d.key === 'k8_safewords').levels[k8.level || 3];
      k8.customText = baseText + safetyAddendum;
    }

    // 4. Geschützte verletzliche Sehnsüchte (Scham-Marker 🙈) in § 1 einweben
    if (insights.vulnerableShameItems.length > 0 && k1) {
      const shameAddendum = "\n\nBesonderer Schutzraum für sensible Sehnsüchte (§ 1 Abs. 2):\n" +
        "Beide Partner anerkennen, dass geteilte verletzliche Fantasien (" +
        insights.vulnerableShameItems.slice(0, 3).map(s => `„${s.title}“`).join(', ') +
        ") im Rahmen dieses Bündnisses unter absolutem Spottverbot stehen und nur in einer Atmosphäre bedingungsloser Geborgenheit erkundet werden dürfen.";
      const baseText1 = CONTRACT_DIMENSIONS.find(d => d.key === 'k1_preamble').levels[k1.level || 3];
      k1.customText = baseText1 + shameAddendum;
    }

    // 5. Erkundungs-Brücken (5/3 & 4/3 Matches) in § 7 (Disziplin) oder § 6 (Dienst) einweben
    if (insights.explorationBridges.length > 0 && k7 && k7.level > 0) {
      const bridgeItems = insights.explorationBridges.slice(0, 3).map(b => `• ${b.title} (Brücke: ${b.topLead ? 'Top leitet an' : 'Bottom wünscht behutsame Führung'})`).join("\n");
      const bridgeAddendum = "\n\nVereinbarte Erkundungs-Brücken (Protokollierte Probe-Phasen):\n" + bridgeItems;
      const baseText7 = CONTRACT_DIMENSIONS.find(d => d.key === 'k7_discipline').levels[k7.level || 3];
      k7.customText = baseText7 + bridgeAddendum;
    }

    contractState.chapters = newChapters;
    contractState.status = "draft";
    contractState.version = `1.0 Gewichteter Entwurf (${new Date().toLocaleDateString('de-DE')})`;
    contractState.signatureTop = null;
    contractState.signatureSub = null;
    contractState.healthGuardsApplied = healthGuards.map(g => g.type);
    contractState.psychometricInsights = {
      doubleFivesCount: insights.doubleFives.length,
      synergiesCount: insights.highSynergies.length,
      bridgesCount: insights.explorationBridges.length,
      shameCount: insights.vulnerableShameItems.length,
      taboosCount: insights.bottomTaboos.length
    };

    saveContractState();
    renderContractDashboard();
    showToast(`✓ Bündnis gewichtet generiert (${insights.doubleFives.length} Spitzen, ${insights.explorationBridges.length} Brücken)`);

    if (window.ChatApp && typeof window.ChatApp.postSystemEvent === 'function') {
      window.ChatApp.postSystemEvent(`Neuer Beziehungsvertrag gewichtet kalibriert (${insights.doubleFives.length} Doppel-5er, ${insights.explorationBridges.length} Brücken, ${insights.vulnerableShameItems.length} Scham-Schutzanker). Bereit zur Prüfung.`);
    }
  }

  function renderContractDashboard() {
    const container = document.getElementById('contract-clauses-container');
    if (!container) return;

    loadContractState();
    const isTop = isUserTop();
    const isDraft = (contractState.status === 'draft');
    const harmony = validatePsychosomaticHarmony();

    const statusLbl = document.getElementById('contract-status-label');
    const verLbl = document.getElementById('contract-version-label');

    if (statusLbl) {
      if (contractState.status === 'active') {
        statusLbl.innerText = "Status: Verbindlich besiegelt ✓";
        statusLbl.className = "text-emerald-400 font-bold font-mono text-xs";
      } else if (contractState.status === 'paused_break_glass') {
        statusLbl.innerText = "Status: Pausiert zur Schlichtung ⚠️ (Notfall-Öffnung)";
        statusLbl.className = "text-rose-400 font-bold font-mono text-xs";
      } else {
        statusLbl.innerText = "Status: Entwurf (Editierbar)";
        statusLbl.className = "text-amber-400 font-bold font-mono text-xs";
      }
    }
    if (verLbl) verLbl.innerText = contractState.version || "Version 1.0";

    // Psychosomatisches Harmonie- & Psychometrie-Banner
    const harmonyContainer = document.getElementById('contract-harmony-banner');
    if (harmonyContainer) {
      const insights = contractState.psychometricInsights;
      harmonyContainer.innerHTML = `
        <div class="p-3.5 rounded-2xl border transition-all text-xs space-y-2 ${harmony.warnings.length === 0 ? 'bg-emerald-950/20 border-emerald-800/60 text-emerald-200' : 'bg-amber-950/30 border-amber-800/80 text-amber-200'}">
          <div class="flex items-center justify-between">
            <span class="font-bold flex items-center gap-1.5">
              <span>${harmony.warnings.length === 0 ? '✓' : '⚠️'}</span>
              <span>Systemische Balance: ${harmony.score}% Harmonie</span>
            </span>
            <span class="text-[10px] font-mono text-slate-400">${harmony.warnings.length === 0 ? 'Ausbalanciert' : 'Resonanz-Warnung'}</span>
          </div>
          ${harmony.warnings.map(w => `<p class="text-[10.5px] leading-relaxed text-amber-300/90">• ${escapeHtml(w.text)}</p>`).join('')}

          ${insights ? `
            <div class="pt-1.5 border-t border-slate-800/60 flex items-center gap-3 text-[10px] font-mono text-slate-400 flex-wrap">
              <span class="text-purple-300">★ ${insights.doubleFivesCount} Doppel-Spitzen</span>
              <span class="text-indigo-300">⇄ ${insights.bridgesCount} Erkundungs-Brücken</span>
              <span class="text-pink-300">🛡️ ${insights.shameCount} Schutzanker (🙈)</span>
              <span class="text-rose-300">🚫 ${insights.taboosCount} Tabu-Vetos</span>
            </div>
          ` : ''}
        </div>
      `;
    }

    container.innerHTML = contractState.chapters.map(ch => {
      const dimDef = CONTRACT_DIMENSIONS.find(d => d.key === ch.key) || {};
      const isDisabled = (ch.level === 0);
      let activeText = ch.customText;

      if (!activeText) {
        if (isDisabled) {
          activeText = (dimDef.levels && dimDef.levels[0]) || 'Nicht Gegenstand dieses Bündnisses.';
        } else {
          const lKey = (ch.level >= 4) ? 5 : ((ch.level >= 2) ? 3 : 1);
          activeText = (dimDef.levels && dimDef.levels[lKey]) || '';
        }
      }

      return `
        <div class="rounded-3xl border transition-all p-4 sm:p-5 space-y-2.5 ${isDisabled ? 'bg-slate-950/40 border-slate-900 opacity-60' : 'bg-slate-900/90 border-slate-800 shadow-md'}" id="chapter-card-${ch.key}">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
            <div class="flex items-center gap-2 min-w-0">
              <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold ${isDisabled ? 'bg-slate-900 text-slate-500 border border-slate-800' : 'bg-amber-950 text-amber-300 border border-amber-800'}">${escapeHtml(ch.num)}</span>
              <strong class="text-xs text-white truncate font-bold">${escapeHtml(ch.title)}</strong>
            </div>

            ${isDraft && isTop ? `
              <!-- Härtegrad-Stufenregler 0 bis 5 -->
              <div class="flex items-center gap-1">
                ${ch.canDisable ? `
                  <button type="button" onclick="ProtocolContract.setLevel('${ch.key}', 0)" title="Klausel deaktivieren" class="px-2 py-1 rounded-lg text-[9.5px] font-mono font-bold transition-all ${ch.level === 0 ? 'bg-rose-950 text-rose-300 border border-rose-800 shadow-xs' : 'bg-slate-950 text-slate-500 border border-slate-800 hover:text-white'}">
                    0: Aus
                  </button>
                ` : ''}
                <button type="button" onclick="ProtocolContract.setLevel('${ch.key}', 1)" title="Mild" class="px-2 py-1 rounded-lg text-[9.5px] font-mono font-bold transition-all ${ch.level === 1 ? 'bg-purple-900 text-white border border-purple-600 shadow-xs' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'}">
                  1
                </button>
                <button type="button" onclick="ProtocolContract.setLevel('${ch.key}', 3)" title="Klassisch D/s" class="px-2 py-1 rounded-lg text-[9.5px] font-mono font-bold transition-all ${ch.level === 3 ? 'bg-purple-700 text-white border border-purple-500 shadow-xs' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'}">
                  3
                </button>
                <button type="button" onclick="ProtocolContract.setLevel('${ch.key}', 5)" title="Strikte Hingabe" class="px-2 py-1 rounded-lg text-[9.5px] font-mono font-bold transition-all ${ch.level === 5 ? 'bg-amber-700 text-white border border-amber-500 shadow-xs' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'}">
                  5
                </button>
                <button type="button" onclick="ProtocolContract.editClause('${ch.key}')" title="Wortlaut anpassen" class="p-1 rounded-lg text-slate-400 hover:text-white ml-1 touch-btn">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/></svg>
                </button>
              </div>
            ` : ''}
          </div>

          <div id="chapter-body-${ch.key}" class="text-[11px] leading-relaxed whitespace-pre-line ${isDisabled ? 'text-slate-500 italic' : 'text-slate-300'}">
            ${escapeHtml(activeText)}
          </div>
        </div>
      `;
    }).join('');

    renderSignatureBoxes();
  }

  function renderSignatureBoxes() {
    const boxTop = document.getElementById('sig-box-top');
    const boxSub = document.getElementById('sig-box-sub');

    if (boxTop) {
      if (contractState.signatureTop) {
        boxTop.innerHTML = `<img src="${contractState.signatureTop}" alt="Signatur Top" class="max-h-16 mx-auto object-contain" />`;
        boxTop.className = "h-20 rounded-2xl border border-purple-700 bg-purple-950/20 flex items-center justify-center p-2 shadow-inner";
      } else {
        boxTop.innerHTML = `<span class="text-slate-500 font-serif italic text-xs">Noch nicht unterzeichnet</span>`;
        boxTop.className = "h-20 rounded-2xl border border-dashed border-slate-700 flex items-center justify-center";
      }
    }

    if (boxSub) {
      if (contractState.signatureSub) {
        boxSub.innerHTML = `<img src="${contractState.signatureSub}" alt="Signatur Bottom" class="max-h-16 mx-auto object-contain" />`;
        boxSub.className = "h-20 rounded-2xl border border-indigo-700 bg-indigo-950/20 flex items-center justify-center p-2 shadow-inner";
      } else {
        boxSub.innerHTML = `<span class="text-slate-500 font-serif italic text-xs">Noch nicht unterzeichnet</span>`;
        boxSub.className = "h-20 rounded-2xl border border-dashed border-slate-700 flex items-center justify-center";
      }
    }
  }

  function setChapterLevel(chapterKey, levelNum) {
    if (!isUserTop()) return;
    loadContractState();
    const ch = contractState.chapters.find(c => c.key === chapterKey);
    if (!ch) return;

    ch.level = levelNum;
    ch.customText = null;
    saveContractState();
    renderContractDashboard();
    showToast(`${ch.num} auf Stufe ${levelNum} kalibriert ✓`);
  }

  function editClause(chapterKey) {
    loadContractState();
    const ch = contractState.chapters.find(c => c.key === chapterKey);
    if (!ch) return;

    const bodyEl = document.getElementById(`chapter-body-${chapterKey}`);
    if (!bodyEl) return;

    const dimDef = CONTRACT_DIMENSIONS.find(d => d.key === ch.key) || {};
    let currentText = ch.customText;
    if (!currentText) {
      const lKey = (ch.level === 0) ? 0 : ((ch.level >= 4) ? 5 : ((ch.level >= 2) ? 3 : 1));
      currentText = (dimDef.levels && dimDef.levels[lKey]) || '';
    }

    bodyEl.innerHTML = `
      <div class="space-y-2 pt-1">
        <textarea id="edit-textarea-${ch.key}" class="w-full text-xs p-2.5 bg-slate-950 border border-purple-600 rounded-xl text-white font-sans focus:outline-none" rows="4">${escapeHtml(currentText)}</textarea>
        <div class="flex justify-end gap-1.5">
          <button type="button" onclick="ProtocolContract.renderContract()" class="px-3 py-1.5 bg-slate-800 rounded-xl text-slate-300 font-bold text-xs touch-btn">Abbrechen</button>
          <button type="button" onclick="ProtocolContract.saveClauseText('${ch.key}')" class="px-3 py-1.5 bg-purple-700 hover:bg-purple-600 text-white font-bold rounded-xl text-xs touch-btn shadow-md">Wortlaut sichern ✓</button>
        </div>
      </div>
    `;
  }

  function saveClauseText(chapterKey) {
    loadContractState();
    const ch = contractState.chapters.find(c => c.key === chapterKey);
    const area = document.getElementById(`edit-textarea-${chapterKey}`);
    if (ch && area) {
      ch.customText = area.value.trim();
      saveContractState();
      renderContractDashboard();
      showToast(`${ch.num} Wortlaut gesichert ✓`);
    }
  }

  function openSignatureModal(role = 'top') {
    signingRole = role;
    let modal = document.getElementById('modal-contract-signature');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modal-contract-signature';
      modal.className = "fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4";
      document.body.appendChild(modal);
    }

    const isTopRole = (role === 'top');

    modal.innerHTML = `
      <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-2xl text-xs">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 class="text-sm font-bold text-white">${isTopRole ? 'Als Top ratifizieren' : 'Als Bottom ratifizieren'}</h3>
            <span class="text-[10px] text-slate-400">Zeichne mit dem Finger deine Signatur</span>
          </div>
          <button type="button" onclick="document.getElementById('modal-contract-signature').style.display='none'" class="p-1.5 text-slate-400 hover:text-white">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="w-full h-40 bg-slate-950 rounded-2xl border border-slate-700 relative overflow-hidden">
          <canvas id="signature-canvas" class="w-full h-full cursor-crosshair touch-none"></canvas>
        </div>

        <div class="flex justify-between items-center pt-2 border-t border-slate-800">
          <button type="button" onclick="ProtocolContract.clearSignatureCanvas()" class="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs touch-btn">
            Löschen
          </button>
          <button type="button" onclick="ProtocolContract.saveSignature()" class="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs touch-btn shadow-md">
            Signatur besiegeln ✓
          </button>
        </div>
      </div>
    `;

    modal.style.display = 'flex';
    setTimeout(initSignatureCanvas, 60);
  }

  function initSignatureCanvas() {
    const canvas = document.getElementById('signature-canvas');
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * (window.devicePixelRatio || 1);
    canvas.height = rect.height * (window.devicePixelRatio || 1);

    const ctx = canvas.getContext('2d');
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = (signingRole === 'top') ? '#c084fc' : '#818cf8';

    signaturePad.canvas = canvas;
    signaturePad.ctx = ctx;
    signaturePad.drawing = false;
    signaturePad.hasSignature = false;

    function getCoords(e) {
      const r = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return { x: clientX - r.left, y: clientY - r.top };
    }

    function startDraw(e) {
      e.preventDefault();
      signaturePad.drawing = true;
      signaturePad.hasSignature = true;
      const p = getCoords(e);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
    }

    function moveDraw(e) {
      if (!signaturePad.drawing) return;
      e.preventDefault();
      const p = getCoords(e);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }

    function endDraw(e) {
      if (!signaturePad.drawing) return;
      e.preventDefault();
      signaturePad.drawing = false;
    }

    canvas.onmousedown = startDraw;
    canvas.onmousemove = moveDraw;
    window.onmouseup = endDraw;

    canvas.ontouchstart = startDraw;
    canvas.ontouchmove = moveDraw;
    canvas.ontouchend = endDraw;
  }

  function clearSignatureCanvas() {
    if (!signaturePad.ctx || !signaturePad.canvas) return;
    signaturePad.ctx.clearRect(0, 0, signaturePad.canvas.width, signaturePad.canvas.height);
    signaturePad.hasSignature = false;
  }

  function saveSignature() {
    if (!signaturePad.hasSignature || !signaturePad.canvas) {
      showToast("Bitte zuerst mit dem Finger unterschreiben.");
      return;
    }

    const dataUrl = signaturePad.canvas.toDataURL('image/png');
    loadContractState();

    if (signingRole === 'top') {
      contractState.signatureTop = dataUrl;
    } else {
      contractState.signatureSub = dataUrl;
    }

    if (contractState.signatureTop && contractState.signatureSub) {
      contractState.status = "active";
      contractState.signedAt = Date.now();
      contractState.version = `1.0 Besiegelt (${new Date().toLocaleDateString('de-DE')})`;
      showToast("TACTUS Bündnis von beiden Partnern ratifiziert & besiegelt! ✓");

      if (window.ChatApp && typeof window.ChatApp.postSystemEvent === 'function') {
        window.ChatApp.postSystemEvent("Der Beziehungsvertrag wurde von beiden Partnern ratifiziert und besiegelt.");
      }
    } else {
      showToast("✓ Unterschrift gespeichert. Zweite Signatur steht noch aus.");
    }

    saveContractState();
    const modal = document.getElementById('modal-contract-signature');
    if (modal) modal.style.display = 'none';
    renderContractDashboard();
  }

  function exportRedactedContract() {
    loadContractState();
    const dateStr = contractState.signedAt ? new Date(contractState.signedAt).toLocaleDateString('de-DE') : new Date().toLocaleDateString('de-DE');

    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext('2d');

    // Tiefschwarzer OLED-Hintergrund
    ctx.fillStyle = '#05070c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Zarter Champagner-Goldrahmen
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.strokeRect(55, 55, canvas.width - 110, canvas.height - 110);

    // Titel
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Playfair Display", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('T A C T U S   I N T I M U M', canvas.width / 2, 130);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '19px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('VEREINBARTER KODEX DER BEZIEHUNGSDYNAMIK', canvas.width / 2, 175);

    ctx.fillStyle = '#d4af37';
    ctx.font = '17px monospace';
    ctx.fillText(`RATIFIZIERT AM ${dateStr} · STATUS: BESIEGELT`, canvas.width / 2, 215);

    // Geschwärzte Textbalken
    let y = 290;
    const activeChapters = contractState.chapters.filter(c => c.level > 0).slice(0, 7);

    activeChapters.forEach(ch => {
      ctx.textAlign = 'left';
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`${ch.num}  ${ch.title}`, 100, y);

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(100, y + 15, 880, 18);
      ctx.fillRect(100, y + 42, 750, 18);
      ctx.fillRect(100, y + 69, 820, 18);

      ctx.fillStyle = '#475569';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('[ VERTRAULICH · PRIVATSPHÄRE GESCHÜTZT ]', 560, y + 55);

      y += 120;
    });

    // Fußbereich mit Siegel
    ctx.fillStyle = '#d4af37';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, 1180, 50, 0, Math.PI * 2);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#d4af37';
    ctx.stroke();

    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 26px "Playfair Display", serif';
    ctx.textAlign = 'center';
    ctx.fillText('T', canvas.width / 2, 1189);

    ctx.fillStyle = '#64748b';
    ctx.font = '15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('TACTUS DIGITAL · ZERO-KNOWLEDGE ENCRYPTED PROTOCOL', canvas.width / 2, 1275);

    const link = document.createElement('a');
    link.download = `tactus_urkunde_geschwaerzt_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    showToast("✓ Geschwärzte Urkunde exportiert");
  }

  function openPrintDialog() {
    let modal = document.getElementById('modal-contract-print-choice');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modal-contract-print-choice';
      modal.className = "fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4";
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl text-xs">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div class="space-y-0.5">
            <h3 class="text-sm font-bold text-white">Urkunde drucken / PDF-Export</h3>
            <span class="text-[10px] text-slate-400">Wähle das gewünschte Format</span>
          </div>
          <button type="button" onclick="document.getElementById('modal-contract-print-choice').style.display='none'" class="p-1.5 text-slate-400 hover:text-white">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div class="space-y-2.5">
          <button type="button" onclick="ProtocolContract.executePrint(true)" class="w-full p-3.5 rounded-2xl border bg-slate-950 hover:bg-slate-900 border-slate-800 hover:border-purple-600 text-left transition-all space-y-1 touch-btn">
            <strong class="text-xs text-white block">Mit digitalen Touch-Signaturen drucken</strong>
            <span class="text-[10.5px] text-slate-400 block">Druckt das Dokument inklusive der auf dem Smartphone gezeichneten Unterschriften und Zeitstempel.</span>
          </button>

          <button type="button" onclick="ProtocolContract.executePrint(false)" class="w-full p-3.5 rounded-2xl border bg-slate-950 hover:bg-slate-900 border-slate-800 hover:border-amber-600 text-left transition-all space-y-1 touch-btn">
            <strong class="text-xs text-amber-300 block">Blanko für handschriftliche Ratifizierung (Zeremonie)</strong>
            <span class="text-[10.5px] text-slate-400 block">Lässt die Felder frei für Füllfederhalter und Wachssiegel auf Büttenpapier.</span>
          </button>
        </div>
      </div>
    `;

    modal.style.display = 'flex';
  }

  function executePrint(includeDigitalSignatures) {
    const modal = document.getElementById('modal-contract-print-choice');
    if (modal) modal.style.display = 'none';

    if (!includeDigitalSignatures) {
      document.body.classList.add('print-blank-signatures');
    } else {
      document.body.classList.remove('print-blank-signatures');
    }

    setTimeout(() => {
      window.print();
    }, 150);
  }

  const api = {
    init: function() {
      loadContractState();
      renderContractDashboard();
    },
    renderContract: renderContractDashboard,
    generateFromSurvey: generateFromContext,
    generateFromContext: generateFromContext,
    setLevel: setChapterLevel,
    editClause: editClause,
    saveClauseText: saveClauseText,
    openSignatureModal: openSignatureModal,
    clearSignatureCanvas: clearSignatureCanvas,
    saveSignature: saveSignature,
    exportRedacted: exportRedactedContract,
    openPrintDialog: openPrintDialog,
    executePrint: executePrint,
    validateHarmony: validatePsychosomaticHarmony,
    analyzeWeightedPsychometrics: analyzeWeightedPsychometrics,
    getActiveContract: function() { loadContractState(); return contractState; }
  };

  window.ProtocolContract = api;
  // Abwärtskompatibler Alias
  window.LedgerContract = api;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      loadContractState();
      renderContractDashboard();
    });
  } else {
    loadContractState();
  }

})(window);
