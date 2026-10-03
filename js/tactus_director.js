/**
 * js/tactus_director.js
 * TACTUS Regie-Engine: Sicherheit, Personalisierung und Session-Drehbuch
 *
 * A) Sicherheit als feste Programmlogik (nie als KI-Entscheidung):
 *    - Sicherheitsprofil aus Tabus (Fragebogen, Note 1), Gesundheitspass,
 *      Triggern (Schutzkapitel 00), eigenen Triggern und der letzten Session
 *    - Jeder KI-Vorschlag wird nach der Erzeugung deterministisch geprüft;
 *      Verstöße führen zu einem Neuversuch und sonst zum Verwerfen
 *    - Feste Inhalte (Standard-Drehbuch, Wizard-Optionen) werden ebenso gefiltert
 *    - Echte Namen gehen nie an die KI (Platzhalter {TOP}/{BOTTOM})
 *
 * B) Persönliches Session-Drehbuch:
 *    - Ein KI-Aufruf erzeugt Ablauf + alle Sprachzeilen für den Abend
 *    - Zeilen werden vorab als Audio erzeugt (SessionVoice.prefetch)
 *    - line(kind, fallback) liefert passende Zeilen live, ohne Wartezeit
 *
 * Öffentliche API (window.TactusDirector): getSafetyProfile, validate, isSafe,
 * filterSafe, buildConstraintBlock, generateJson, generateSessionScript,
 * getScript, clearScript, line, getSpokenLines, effectiveIntensity
 */

(function(window) {
  'use strict';

  const SCRIPT_KEY = 'tactus_session_script';
  const SCRIPT_MAX_AGE_MS = 18 * 3600 * 1000;
  const TEXT_MODELS = ['gemini-flash-latest', 'gemini-3.8-flash', 'gemini-3.5-flash-lite'];

  // --- Regelwerk ---------------------------------------------------------------

  // Grundsätzlich ausgeschlossen, unabhängig vom Profil
  const ALWAYS_FORBIDDEN = {
    id: 'breath',
    label: 'Atemkontrolle, Würgen oder Druck auf den Hals (grundsätzlich ausgeschlossen)',
    terms: ['würg', 'atemkontroll', 'atemreduktion', 'atemreduz', 'atemspiel', 'luft abdrück', 'luft abschnür',
      'strangul', 'hals zudrück', 'kehle zudrück', 'hand um den hals', 'hand am hals', 'hände um den hals', 'nase zuhalt',
      'nase zu halten', 'plastiktüte', 'breath play', 'breathplay', 'choking', 'choke']
  };

  const FLAG_RULES = {
    airway: { label: 'Atemwege immer frei (Asthma, Panik oder Trigger)', terms: ['knebel', 'gag', 'maske', 'haube', 'hood', 'mund zuhalt', 'hand auf den mund', 'hand über den mund', 'facesitting', 'face-sitting', 'auf dem gesicht sitz', 'auf ihrem gesicht', 'auf seinem gesicht', 'kissen auf das gesicht', 'frischhaltefolie', 'klebeband über'] },
    latex: { label: 'Latexallergie: kein Latex', terms: ['latex'] },
    impact: { label: 'Blutverdünner: keine Schlagwerkzeuge, Klemmen oder Nadeln', terms: ['paddel', 'paddle', 'rohrstock', 'cane', 'gerte', 'crop', 'peitsche', 'flogger', 'gürtel', 'nippelklemm', 'brustklemm', 'klemmen an', 'wäscheklammer', 'nadel', 'harte schläge'] },
    joints: { label: 'Gelenküberbeweglichkeit: keine Hebel- oder Überstreckhaltungen', terms: ['strappado', 'hogtie', 'ellenbogen zusammen', 'ellbogen zusammen', 'ellenbogen hinter', 'ellbogen hinter', 'arme hinter dem rücken hoch', 'suspension', 'hängebondage'] },
    neuropathy: { label: 'Neuropathie: keine Temperaturreize', terms: ['kerzenwachs', 'heißes wachs', 'heißem wachs', 'wachskerze', 'wachstropf', 'wachs auf', 'eiswürfel', 'eis auf'] },
    darkness: { label: 'Keine Dunkelheit oder verbundenen Augen', terms: ['augenbinde', 'augen verbinden', 'augen verbunden', 'blindfold', 'dunkelheit', 'licht aus', 'licht löschen', 'haube', 'maske'] },
    restraint: { label: 'Keine Fesselung oder Fixierung', terms: ['fessel', 'gefesselt', 'handschell', 'manschette', 'seil', 'bondage', 'fixierung', 'spreizstange', 'pranger', 'andreaskreuz', 'arretier', 'festbinden', 'festgebunden', 'anbinden', 'angebunden', 'kabelbinder'] },
    degradation: { label: 'Keine Erniedrigung oder Beschimpfung', terms: ['erniedrig', 'demütigen', 'demütigung', 'demütigend', 'beschimpf', 'schlampe', 'hure', 'nutte', 'wertlos', 'degradier', 'spuck', 'du bist nichts'] },
    surprise: { label: 'Keine Überraschungen: alles wird angekündigt', terms: ['überrasch', 'unangekündigt', 'ohne vorwarnung', 'ohne ankündigung'] }
  };

  // Ausrüstungs-Tags der Fragebogen-Items → deutsche Suchbegriffe
  const EQUIPMENT_TERMS = {
    gag: ['knebel', 'gag'], blindfold: ['augenbinde'], rope: ['seil'], cuffs: ['handschell', 'manschette'],
    clamps: ['nippelklemm', 'brustklemm', 'wäscheklammer'], paddle: ['paddel', 'paddle'], flogger: ['flogger', 'peitsche'], crop: ['gerte'],
    leather_belt: ['gürtel'], wax_candle: ['kerzenwachs', 'heißes wachs', 'wachskerze', 'wachstropf'], ice: ['eiswürfel'], chastity_cage: ['keuschheitskäfig', 'peniskäfig'],
    butt_plug: ['plug', 'analplug', 'analstöpsel'], strap_on: ['strap-on', 'umschnall'], collar: ['halsband'], leash: ['hundeleine', 'an die leine', 'an der leine'],
    spreader_bar: ['spreizstange'], mask: ['maske'], latex_hood: ['haube'], pillory: ['pranger'],
    st_andrews_cross: ['andreaskreuz'], diaper: ['windel'], pacifier: ['schnuller'], syringe: ['spritze'],
    cock_ring: ['penisring'], ball_stretcher: ['hodenstrecker'], prostate_massager: ['prostata'],
    spanking_bench: ['strafbock'], sling: ['liebesschaukel'], chain: ['ketten'], corset: ['korsett'],
    posture_collar: ['haltungskragen'], kneeling_bench: ['kniebank'], wedge_pillow: ['keilkissen']
  };

  // Fachbegriffe, über die Tabus auch ohne wörtlichen Titel erkannt werden
  const KINK_KEYWORDS = ['spank', 'fessel', 'shibari', 'seil', 'knebel', 'augenbinde', 'klemm', 'wachs', 'eiswürfel', 'peitsch',
    'flogger', 'paddel', 'gerte', 'rohrstock', 'keusch', 'käfig', 'plug', 'anal', 'strap-on', 'demütig', 'erniedrig', 'beschimpf',
    'ohrfeig', 'kratz', 'beiß', 'biss', 'kitzel', 'halsband', 'leine', 'windel', 'natursekt', 'spuck', 'öffentlich', 'exhibition',
    'voyeur', 'cuckold', 'rollenspiel', 'uniform', 'füße', 'fuß', 'zwang', 'ruined', 'melk', 'prostata', 'elektro', 'nadel',
    'messer', 'klinik', 'pet-play', 'ponyplay', 'puppy', 'schmerz', 'gesichtsbesamung', 'deepthroat', 'fisting', 'dildo', 'vibrator',
    'kerze', 'zeugen', 'fotos', 'video', 'filmen', 'dritte', 'dreier', 'fremde', 'nippel', 'hoden', 'brustwarze', 'atem'];

  // Wird ein Fachbegriff gesperrt, gelten auch seine Umschreibungen als gesperrt
  const KEYWORD_SYNONYMS = {
    spank: ['klaps', 'versohl', 'hiebe', 'treffer auf', 'schläge auf', 'schlägen auf', 'züchtigung'],
    knebel: ['gag'],
    kitzel: ['kitzle'],
    beiß: ['biss', 'zähne in'],
    ohrfeig: ['backpfeife', 'schlag ins gesicht']
  };

  const NEGATIONS = ['kein', 'keine', 'keinen', 'keiner', 'keinem', 'ohne', 'nicht', 'niemals', 'nie', 'statt', 'anstatt', 'verzicht', 'verzichte', 'verzichtet'];

  // --- Hilfsfunktionen ---------------------------------------------------------

  function read(key, fallback) {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch (e) { return fallback; }
  }

  function normalize(text) {
    return String(text || '').toLowerCase().normalize('NFC');
  }

  function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function collectStrings(value, out = []) {
    if (value == null) return out;
    if (typeof value === 'string') out.push(value);
    else if (Array.isArray(value)) value.forEach(v => collectStrings(v, out));
    else if (typeof value === 'object') Object.keys(value).forEach(k => collectStrings(value[k], out));
    return out;
  }

  function getRoles() {
    // Rollen des heutigen Abends (Staging) haben Vorrang vor der dauerhaften Einstellung
    if ((window.topPartner === 'A' || window.topPartner === 'B') && window.subPartner && window.subPartner !== window.topPartner) {
      return { topRole: window.topPartner, bottomRole: window.subPartner };
    }
    if (window.HubContext && typeof window.HubContext.getRoles === 'function') {
      const r = window.HubContext.getRoles();
      if (r && r.topRole && r.bottomRole) return r;
    }
    const top = localStorage.getItem('kompass_keyholder_role') || 'A';
    return { topRole: top, bottomRole: top === 'A' ? 'B' : 'A' };
  }

  function getNames() {
    const names = read('kompass_names', null) || window.names || { A: 'Partner 1', B: 'Partner 2' };
    const roles = getRoles();
    return { top: names[roles.topRole] || 'Top', bottom: names[roles.bottomRole] || 'Bottom' };
  }

  function getAnatomy() {
    const anatomy = read('kompass_anatomy', null) || window.anatomy || { A: 'penis', B: 'vulva' };
    return anatomy[getRoles().bottomRole] || 'vulva';
  }

  function allSurveyItems() {
    return [].concat(window.surveyChaptersPart1 || [], window.surveyChaptersPart2 || [], window.surveyChaptersPart3 || [])
      .flatMap(ch => ch.items || []);
  }

  // --- A) Sicherheitsprofil ------------------------------------------------------

  function getSafetyProfile() {
    const roles = getRoles();
    const answers = read('kompass_answers', {}) || {};
    const top = answers[roles.topRole] || {};
    const bottom = answers[roles.bottomRole] || {};
    const pass = read('tactus_medical_pass', {}) || {};
    const rules = [ALWAYS_FORBIDDEN];
    const flags = new Set();

    // Gesundheitspass
    if (pass.hasAsthma || pass.hasPanicAirway) flags.add('airway');
    if (pass.hasLatexAllergy) flags.add('latex');
    if (pass.hasBloodThinners) flags.add('impact');
    if (pass.hasHypermobility) flags.add('joints');
    if (pass.hasNeuropathy) flags.add('neuropathy');
    if (pass.hasFearDarkness) flags.add('darkness');
    if (pass.hasFearRestraint) flags.add('restraint');
    if (pass.hasFearDegradation) flags.add('degradation');
    if (pass.hasFearSurprise) flags.add('surprise');

    // Schutzkapitel 00: Flashback-Trigger (Antworten beider Partner, der Bottom zählt zuerst)
    const triggerMap = { words: 'degradation', airway: 'airway', restraint: 'restraint', darkness: 'darkness' };
    [bottom.choice_902, top.choice_902].forEach(t => { if (triggerMap[t]) flags.add(triggerMap[t]); });

    flags.forEach(f => rules.push(Object.assign({ id: f }, FLAG_RULES[f])));

    // Eigene Trigger aus dem Gesundheitspass
    const custom = String(pass.customTriggers || '').split(/[,;\n]/).map(s => s.trim()).filter(s => s.length >= 4);
    if (custom.length) rules.push({ id: 'custom', label: 'Eigene Trigger: ' + custom.join(', '), terms: custom.map(normalize) });

    // Tabus (Note 1): was der Top nicht tun und der Bottom nicht empfangen will
    const tabus = [];
    const items = allSurveyItems();
    // Ein Fachbegriff aus einem Tabu-Titel wird nur gesperrt, wenn kein positiv bewertetes Item ihn enthält
    // (wer die Vier-Punkt-Fesselung ablehnt, aber weiche Klettfesseln liebt, behält die Fesseln)
    const positiveTitles = items.filter(item => {
      const r1 = top[`it_${item.id}_r1`];
      const r2 = bottom[`it_${item.id}_r2`];
      return (typeof r1 === 'number' && r1 >= 3) || (typeof r2 === 'number' && r2 >= 3);
    }).map(item => normalize(item.title));
    items.forEach(item => {
      const topTabu = top[`it_${item.id}_r1`] === 1;
      const bottomTabu = bottom[`it_${item.id}_r2`] === 1;
      if (!topTabu && !bottomTabu) return;
      const terms = [normalize(item.title)];
      const paren = (item.title.match(/\(([^)]+)\)/) || [])[1];
      if (paren) paren.split(/[\/,]| und /).map(s => normalize(s.trim())).filter(s => s.length >= 5).forEach(t => terms.push(t));
      const tags = item.equipmentTags || [];
      if (tags.length === 1 && EQUIPMENT_TERMS[tags[0]]) EQUIPMENT_TERMS[tags[0]].forEach(t => terms.push(t));
      const titleNorm = normalize(item.title);
      KINK_KEYWORDS.forEach(k => {
        if (titleNorm.includes(k) && !positiveTitles.some(t => t.includes(k))) {
          terms.push(k);
          (KEYWORD_SYNONYMS[k] || []).forEach(syn => terms.push(syn));
        }
      });
      tabus.push({ id: item.id, title: item.title, who: bottomTabu ? 'bottom' : 'top' });
      rules.push({ id: 'tabu_' + item.id, label: `Tabu: ${item.title}`, terms });
    });

    // Anatomie: Hilfsmittel nur passend zum Körper des Bottoms
    const anatomy = getAnatomy();
    if (anatomy === 'penis') rules.push({ id: 'anatomy', label: 'Anatomie: keine Vulva-spezifischen Reize', terms: ['klitoris', 'womanizer', 'klitorissauger', 'vulva', 'schamlippen'] });
    if (anatomy === 'vulva') rules.push({ id: 'anatomy', label: 'Anatomie: keine Penis-spezifischen Reize', terms: ['peniskäfig', 'keuschheitskäfig', 'eichel', 'penissleeve', 'hodengewicht', 'hodenstrecker', 'penisring'] });

    // Letzte Session
    let recent = null;
    if (window.HubContext && typeof window.HubContext.getUnifiedState === 'function') {
      try { recent = window.HubContext.getUnifiedState().v3_history; } catch (e) {}
    }
    const last = recent && recent.lastSession;
    const lastSessionCaution = Boolean(last && (last.requiredEmergencyPause || (last.yellowSafewords || 0) >= 2));

    const directives = [];
    if (pass.hasDiabetes) directives.push('Diabetes: Traubenzucker bereithalten, Fixierungen kurz halten (max. 20 Minuten).');
    if (pass.hasNeuropathy) directives.push('Neuropathie: Durchblutung an Händen und Füßen regelmäßig prüfen.');
    if (pass.emergencyNotes) directives.push('Notfallhinweis: ' + String(pass.emergencyNotes).slice(0, 200));
    if (lastSessionCaution) directives.push('In der letzten Session wurde gebremst (Safeword). Heute behutsamer beginnen, mehr Check-ins, Intensität reduziert.');

    return { rules, tabus, flags: Array.from(flags), anatomy, directives, lastSessionCaution, recent };
  }

  // Prüft Text oder Objekt gegen alle Regeln. Verneinte Erwähnungen ("ohne Fesseln") gelten nicht.
  function validate(value, profile) {
    const p = profile || getSafetyProfile();
    const violations = [];
    const texts = collectStrings(value).map(normalize);
    for (const rule of p.rules) {
      for (const term of rule.terms) {
        if (!term) continue;
        const re = term.length <= 4
          ? new RegExp(`(^|[^a-zäöüß])${escapeRegex(term)}`, 'g')
          : new RegExp(escapeRegex(term), 'g');
        let hit = null;
        for (const text of texts) {
          let m;
          re.lastIndex = 0;
          while ((m = re.exec(text))) {
            const before = text.slice(Math.max(0, m.index - 40), m.index).split(/[^a-zäöüß]+/).filter(Boolean).slice(-3);
            if (!before.some(w => NEGATIONS.includes(w))) { hit = term; break; }
          }
          if (hit) break;
        }
        if (hit) { violations.push({ rule: rule.id, label: rule.label, term: hit }); break; }
      }
    }
    return { ok: violations.length === 0, violations };
  }

  function isSafe(value, profile) {
    return validate(value, profile).ok;
  }

  function filterSafe(list, profile) {
    const p = profile || getSafetyProfile();
    return (Array.isArray(list) ? list : []).filter(item => validate(item, p).ok);
  }

  function effectiveIntensity(requested, profile) {
    const p = profile || getSafetyProfile();
    const value = parseInt(requested, 10) || 5;
    return p.lastSessionCaution ? Math.min(value, 6) : value;
  }

  function buildConstraintBlock(profile) {
    const p = profile || getSafetyProfile();
    const lines = ['VERBINDLICHE SICHERHEITSGRENZEN (niemals verletzen, auch nicht andeutungsweise oder als Option):'];
    lines.push('- ' + ALWAYS_FORBIDDEN.label + '.');
    p.flags.forEach(f => lines.push(`- ${FLAG_RULES[f].label}.`));
    const bottomTabus = p.tabus.filter(t => t.who === 'bottom').map(t => t.title);
    const topTabus = p.tabus.filter(t => t.who === 'top').map(t => t.title);
    if (bottomTabus.length) lines.push('- Tabus von {BOTTOM} (nicht vorschlagen): ' + bottomTabus.slice(0, 80).join('; '));
    if (topTabus.length) lines.push('- Tabus von {TOP} (nicht vorschlagen): ' + topTabus.slice(0, 80).join('; '));
    const custom = p.rules.find(r => r.id === 'custom');
    if (custom) lines.push('- ' + custom.label);
    lines.push(`- Anatomie von {BOTTOM}: ${p.anatomy === 'penis' ? 'Penis' : 'Vulva'}. Hilfsmittel nur passend dazu.`);
    p.directives.forEach(d => lines.push('- ' + d));
    lines.push('- Die Safeword-Ampel (Grün/Gelb/Rot) gilt jederzeit; Rot beendet alles sofort.');
    return lines.join('\n');
  }

  // --- Pseudonymisierung -----------------------------------------------------------

  function pseudonymize(text) {
    const n = getNames();
    let out = String(text || '');
    [[n.top, '{TOP}'], [n.bottom, '{BOTTOM}']].forEach(([name, token]) => {
      if (name && name.length >= 2 && !/^(top|bottom)$/i.test(name)) {
        // auch Genitiv ("Lenas") wird ersetzt
        out = out.replace(new RegExp(`(^|[^\\p{L}])${escapeRegex(name)}(s?)(?=[^\\p{L}]|$)`, 'giu'), `$1${token}$2`);
      }
    });
    return out;
  }

  function restoreNames(value) {
    const n = getNames();
    const fix = (s) => s.replace(/\{\s*TOP\s*\}|\[TOP\]/g, n.top).replace(/\{\s*BOTTOM\s*\}|\[BOTTOM\]/g, n.bottom);
    if (typeof value === 'string') return fix(value);
    if (Array.isArray(value)) return value.map(restoreNames);
    if (value && typeof value === 'object') {
      const o = {};
      Object.keys(value).forEach(k => { o[k] = restoreNames(value[k]); });
      return o;
    }
    return value;
  }

  // --- KI-Aufruf mit Sicherheitsprüfung ----------------------------------------------

  function parseJsonLoose(raw) {
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) {}
    const m = String(raw).match(/[\[{][\s\S]*[\]}]/);
    if (m) { try { return JSON.parse(m[0]); } catch (e) {} }
    return null;
  }

  /**
   * Erzeugt JSON per KI. Der Prompt wird pseudonymisiert und um die
   * Sicherheitsgrenzen ergänzt; das Ergebnis wird geprüft (1 Neuversuch).
   * Liefert { ok, data, violations, reason }. data enthält wieder echte Namen.
   */
  async function generateJson({ prompt, temperature = 0.7, check, maxOutputTokens = 8192 }) {
    if (!window.AIAdapter || typeof window.AIAdapter.geminiFetch !== 'function' || !window.AIAdapter.isGeminiAvailable()) {
      return { ok: false, reason: 'no_ai' };
    }
    const profile = getSafetyProfile();
    const system = [
      'Du bist eine erfahrene, souveräne BDSM-Regisseurin für ein einvernehmlich handelndes, erwachsenes Paar.',
      'Nenne die Personen ausschließlich {TOP} und {BOTTOM} (genau so geschrieben).',
      'Schreibe direkt, erwachsen und ohne Kitsch. Verwende nur die Begriffe "Edge", "Edges" und "Edging", niemals "Kante" oder "Schwelle".',
      buildConstraintBlock(profile)
    ].join('\n');

    let userPrompt = pseudonymize(prompt);
    let lastViolations = [];

    for (let attempt = 0; attempt < 2; attempt++) {
      let data = null;
      for (const model of TEXT_MODELS) {
        try {
          const res = await window.AIAdapter.geminiFetch(model, {
            systemInstruction: { parts: [{ text: system }] },
            contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
            generationConfig: { temperature, maxOutputTokens, responseMimeType: 'application/json' }
          });
          if (res.status === 403) return { ok: false, reason: 'no_consent' };
          if (res.status === 429) return { ok: false, reason: 'quota' };
          if (!res.ok) continue;
          const body = await res.json();
          const text = (body.candidates && body.candidates[0] && body.candidates[0].content && body.candidates[0].content.parts || [])
            .map(p => p.text || '').join('');
          data = parseJsonLoose(text);
          if (data) break;
        } catch (e) {}
      }
      if (!data) return { ok: false, reason: 'ai_failed' };
      if (typeof check === 'function' && !check(data)) return { ok: false, reason: 'invalid_format' };

      const result = validate(data, profile);
      if (result.ok) return { ok: true, data: restoreNames(data) };

      lastViolations = result.violations;
      userPrompt = pseudonymize(prompt) + '\n\nWICHTIG: Dein letzter Entwurf verletzte diese Grenzen: ' +
        result.violations.map(v => `${v.label} (Begriff: "${v.term}")`).join('; ') +
        '. Erstelle einen komplett neuen Entwurf, der diese Dinge weder erwähnt noch andeutet.';
    }
    return { ok: false, reason: 'unsafe', violations: lastViolations };
  }

  // --- B) Session-Drehbuch ------------------------------------------------------------

  const LINE_KINDS = {
    intro: 2, arousal_low: 3, arousal_mid: 3, arousal_high: 3, edge_reached: 3,
    goal_release: 2, goal_ruined: 2, goal_denial: 2, yellow: 1, aftercare: 2
  };

  const TONALITY_TEXT = {
    gentle: 'sanft, warm und zärtlich führend',
    sovereign: 'souverän, ruhig und bestimmt',
    strict: 'streng, knapp und fordernd, aber nie verächtlich'
  };

  // Paarprofil für die heutige Rollenverteilung (Top führt = r1, Bottom empfängt = r2)
  function buildProfileSummary(profile) {
    const roles = getRoles();
    const answers = read('kompass_answers', {}) || {};
    const top = answers[roles.topRole] || {};
    const bottom = answers[roles.bottomRole] || {};
    const doubleFives = [], synergies = [], curiosity = [], shame = [];
    allSurveyItems().forEach(item => {
      const r1 = top[`it_${item.id}_r1`];
      const r2 = bottom[`it_${item.id}_r2`];
      if (typeof r1 !== 'number' || typeof r2 !== 'number') return;
      if (r1 === 5 && r2 === 5) doubleFives.push(item.title);
      else if (r1 >= 4 && r2 >= 4) synergies.push(item.title);
      else if (r1 >= 3 && r2 >= 3 && (r1 + r2) >= 7) curiosity.push(item.title);
      if (bottom[`shame_${item.id}`] === true && r2 >= 3) shame.push(item.title);
    });
    const pick = (list, n) => list.slice().sort(() => Math.random() - 0.5).slice(0, n).join('; ');
    const parts = [];
    if (doubleFives.length) parts.push('Gemeinsame Leidenschaften (beide 5/5): ' + pick(doubleFives, 14));
    if (synergies.length) parts.push('Starke Resonanzen (beide ≥ 4): ' + pick(synergies, 10));
    if (curiosity.length) parts.push('Neugier beider (behutsam als neuer Akzent möglich): ' + pick(curiosity, 5));
    if (shame.length) parts.push('Mit Scham besetzt, nur behutsam und nie abwertend: ' + pick(shame, 5));

    const history = (profile && profile.recent) || {};
    (history.recentSessions || []).slice(0, 2).forEach((s, i) => {
      const bits = [`Intensität ${s.intensity}`];
      if (s.edgeCount) bits.push(`${s.edgeCount} Edges`);
      if (s.subReflectionNote) bits.push(`Rückmeldung Bottom: "${String(s.subReflectionNote).slice(0, 160)}"`);
      if (s.topReflectionNote) bits.push(`Rückmeldung Top: "${String(s.topReflectionNote).slice(0, 160)}"`);
      if (s.requiredEmergencyPause) bits.push('Abbruch per Safeword Rot');
      parts.push(`${i === 0 ? 'Letzte' : 'Vorletzte'} Session: ${bits.join(', ')}`);
    });
    return parts.join('\n');
  }

  function scriptIsValid(d) {
    return d && Array.isArray(d.steps) && d.steps.length >= 4 && d.lines && typeof d.lines === 'object' &&
      d.steps.every(s => s && s.title && s.desc);
  }

  /**
   * opts: { intensity (1–10), energyTop (1–5), energySub (1–5), tonality ('gentle'|'sovereign'|'strict'),
   *         toyBriefing (Text), durationMin }
   */
  async function generateSessionScript(opts = {}) {
    const profile = getSafetyProfile();
    const intensity = effectiveIntensity(opts.intensity || 6, profile);
    const tonality = TONALITY_TEXT[opts.tonality] ? opts.tonality : 'sovereign';
    const counts = Object.keys(LINE_KINDS).map(k => `"${k}": [${LINE_KINDS[k]} Sätze]`).join(', ');

    const prompt = `Erstelle das persönliche Drehbuch für den heutigen Abend von {TOP} (führt) und {BOTTOM} (empfängt).

HEUTE:
- Intensität: ${intensity}/10${intensity !== (parseInt(opts.intensity, 10) || 6) ? ' (wegen der letzten Session bewusst gesenkt)' : ''}
- Energie: {TOP} ${opts.energyTop || 3}/5, {BOTTOM} ${opts.energySub || 3}/5
- Dauer: ca. ${opts.durationMin || 45} Minuten
- Tonlage der Regie: ${TONALITY_TEXT[tonality]}

VERFÜGBARE AUSRÜSTUNG (nur diese oder Hände, Bett, Kissen, Decke verwenden):
${opts.toyBriefing || 'Keine Toys – nur Hände, Stimme und Körper.'}

PROFIL DES PAARES:
${buildProfileSummary(profile) || 'Noch wenige Daten – vorsichtig, abwechslungsreich und mit klaren Check-ins führen.'}

AUFBAU: 8 Schritte in 4 Phasen (Ankommen, Machtaufbau, Edging, Urteil & Aftercare). Baue gezielt auf den gemeinsamen Leidenschaften auf. Jeder Abend soll sich anders anfühlen.

SPRACHZEILEN ("spoken" und "lines"): Werden von einer Regiestimme laut gesprochen. Sprich {BOTTOM} direkt mit "du" an, höchstens 16 Wörter pro Satz, natürlich sprechbar, keine Regieanweisungen in Klammern. Bedeutung der Zeilentypen:
intro = Begrüßung zum Start; arousal_low/mid/high = Führung bei niedriger/mittlerer/hoher Erregung; edge_reached = sofortiger Stopp an der Edge; goal_release = Orgasmus erlaubt; goal_ruined = ruinierter Orgasmus; goal_denial = Orgasmus verweigert; yellow = Reaktion auf Safeword Gelb (verlangsamen, nachfragen); aftercare = Nachsorge, warm und haltend.

Antworte ausschließlich als JSON in genau dieser Form:
{
  "title": "Kurzer Titel des Abends",
  "voiceStyle": "Ein Satz, wie die Stimme sprechen soll",
  "steps": [ { "phase": "Phase 1: …", "title": "…", "desc": "2 Sätze Szene", "top": "Anweisung für {TOP}", "sub": "Anweisung für {BOTTOM}", "spoken": "Ein gesprochener Satz zu diesem Schritt" } ],
  "lines": { ${counts} }
}`;

    const result = await generateJson({ prompt, temperature: 0.95, check: scriptIsValid });
    if (!result.ok) return result;

    const data = result.data;
    // Zeilen bereinigen und auf erwartete Mengen begrenzen
    const lines = {};
    Object.keys(LINE_KINDS).forEach(k => {
      lines[k] = (Array.isArray(data.lines[k]) ? data.lines[k] : []).map(s => String(s).trim()).filter(Boolean).slice(0, LINE_KINDS[k] + 1);
    });
    const script = {
      createdAt: Date.now(),
      params: { intensity, tonality, energyTop: opts.energyTop, energySub: opts.energySub, topRole: getRoles().topRole },
      title: String(data.title || 'Euer Abend'),
      voiceStyle: String(data.voiceStyle || TONALITY_TEXT[tonality]).slice(0, 200),
      steps: data.steps.slice(0, 10).map(s => ({
        phase: String(s.phase || ''), title: String(s.title || ''), desc: String(s.desc || ''),
        top: String(s.top || ''), sub: String(s.sub || ''), spoken: String(s.spoken || '')
      })),
      lines
    };
    try { localStorage.setItem(SCRIPT_KEY, JSON.stringify(script)); } catch (e) {}
    return { ok: true, script };
  }

  function getScript() {
    const s = read(SCRIPT_KEY, null);
    if (!s || !s.createdAt || Date.now() - s.createdAt > SCRIPT_MAX_AGE_MS) return null;
    if (s.params && s.params.topRole && s.params.topRole !== getRoles().topRole) return null;
    return s;
  }

  function clearScript() {
    try { localStorage.removeItem(SCRIPT_KEY); } catch (e) {}
  }

  const lastPicked = {};
  // Liefert eine Drehbuch-Zeile der Art kind; ohne Drehbuch den festen Fallback
  function line(kind, fallback) {
    const s = getScript();
    const pool = s && s.lines && Array.isArray(s.lines[kind]) ? s.lines[kind].filter(Boolean) : [];
    if (!pool.length) return fallback;
    let options = pool.filter(l => l !== lastPicked[kind]);
    if (!options.length) options = pool;
    const pick = options[Math.floor(Math.random() * options.length)];
    lastPicked[kind] = pick;
    return pick;
  }

  function getSpokenLines() {
    const s = getScript();
    if (!s) return [];
    const out = [];
    s.steps.forEach(st => { if (st.spoken) out.push(st.spoken); });
    Object.keys(s.lines || {}).forEach(k => (s.lines[k] || []).forEach(l => out.push(l)));
    return Array.from(new Set(out));
  }

  window.TactusDirector = {
    getSafetyProfile,
    validate,
    isSafe,
    filterSafe,
    effectiveIntensity,
    buildConstraintBlock,
    pseudonymize,
    restoreNames,
    generateJson,
    generateSessionScript,
    getScript,
    clearScript,
    line,
    getSpokenLines,
    TONALITY_TEXT
  };

})(window);
