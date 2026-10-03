/**
 * js/tactus_learning.js
 * TACTUS Lernende Edge-Kurve
 *
 * Während der Session werden Zeitpunkte erfasst (Erregungsregler, Edges,
 * Countdowns, Ziel, Safewords). Beim Abschluss wird daraus eine kompakte
 * Zusammenfassung, die im Session-Logbuch landet (und so mit dem Partner
 * synchronisiert wird). Aus allen Sessions entsteht ein Modell eurer Kurve:
 * wann die erste Edge typischerweise kommt, wie lang die Abstände sind, wie
 * viel Erholung es braucht. Daraus folgen Empfehlungen für Abkühlphase,
 * Countdown-Länge und Anzahl der Edges sowie ein Hinweis im Cockpit.
 *
 * Öffentliche API (window.TactusLearning): start, recordArousal, recordEdge,
 * recordCountdown, recordGoal, recordSafeword, finish, getModel,
 * getRecommendations, describeModel, renderCurveCard
 */

(function(window) {
  'use strict';

  const LIVE_KEY = 'tactus_live_telemetry';
  const LIVE_MAX_AGE_MS = 6 * 3600 * 1000;
  const MIN_SESSIONS = 2;
  const COUNTDOWN_PRESETS = [5, 10, 20, 30];

  let live = null;
  let cardTimer = null;

  function read(key, fallback) {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch (e) { return fallback; }
  }
  function save() {
    try { localStorage.setItem(LIVE_KEY, JSON.stringify(live)); } catch (e) {}
  }
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function median(list) {
    if (!list.length) return null;
    const s = list.slice().sort((a, b) => a - b);
    const m = Math.floor(s.length / 2);
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
  }
  function fmt(sec) {
    if (sec == null) return '–';
    const s = Math.round(sec);
    if (s < 90) return `${s} s`;
    return `${Math.round(s / 6) / 10} Min`.replace('.', ',');
  }

  // --- Erfassung während der Session -----------------------------------------

  function start(meta) {
    live = { v: 1, startedAt: Date.now(), arousal: [], edges: [], countdowns: [], goals: [], safewords: [], meta: meta || {} };
    save();
  }

  function ensure() {
    if (!live) live = read(LIVE_KEY, null);
    if (!live || !live.startedAt || Date.now() - live.startedAt > LIVE_MAX_AGE_MS) start();
  }

  function offset() { return Date.now() - live.startedAt; }

  function recordArousal(level) {
    ensure();
    const l = parseInt(level, 10);
    if (!Number.isFinite(l)) return;
    const last = live.arousal[live.arousal.length - 1];
    if (last && last.l === l) return;
    live.arousal.push({ t: offset(), l });
    if (live.arousal.length > 400) live.arousal.shift();
    save();
  }

  function recordEdge() { ensure(); live.edges.push(offset()); save(); renderCurveCard(); }
  function recordCountdown(duration, goal) { ensure(); live.countdowns.push({ t: offset(), d: duration, g: goal }); save(); }
  function recordGoal(goal) { ensure(); live.goals.push({ t: offset(), g: goal }); save(); }
  function recordSafeword(color) { ensure(); live.safewords.push({ t: offset(), c: color }); save(); }

  function summarize(data) {
    if (!data || !data.startedAt) return null;
    const firstStim = (data.arousal.find(a => a.l >= 3) || { t: 0 }).t;
    const edges = data.edges.slice().sort((a, b) => a - b);
    const intervals = edges.slice(1).map((e, i) => (e - edges[i]) / 1000);
    // Erholung: Zeit von einer Edge bis der Regler wieder auf 7 oder höher steht
    const recoveries = edges.map((e, i) => {
      const next = edges[i + 1] || Infinity;
      const rise = data.arousal.find(a => a.t > e + 3000 && a.t < next && a.l >= 7);
      return rise ? (rise.t - e) / 1000 : null;
    }).filter(v => v != null);
    return {
      v: 1,
      durationMin: Math.round((Date.now() - data.startedAt) / 60000),
      edges: edges.length,
      timeToFirstEdgeSec: edges.length ? Math.max(0, (edges[0] - firstStim) / 1000) : null,
      medianIntervalSec: median(intervals),
      medianRecoverySec: median(recoveries),
      peakArousal: data.arousal.reduce((m, a) => Math.max(m, a.l), 0),
      countdownSec: data.countdowns.length ? data.countdowns[data.countdowns.length - 1].d : null,
      goal: data.goals.length ? data.goals[data.goals.length - 1].g : null,
      yellow: data.safewords.filter(s => s.c === 'yellow').length,
      red: data.safewords.filter(s => s.c === 'red').length
    };
  }

  // Schließt die Erfassung ab und liefert die Zusammenfassung fürs Logbuch
  function finish() {
    if (!live) live = read(LIVE_KEY, null);
    const summary = summarize(live);
    live = null;
    try { localStorage.removeItem(LIVE_KEY); } catch (e) {}
    return summary;
  }

  // --- Modell über alle Sessions ---------------------------------------------

  function getModel() {
    const log = read('tactus_session_logbook', null) || read('kompass_session_diary', []) || [];
    const sessions = log.filter(s => s && s.telemetry && s.telemetry.v === 1)
      .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0))
      .slice(-12);
    if (!sessions.length) return { n: 0 };

    // Exponentiell gewichteter Mittelwert: neuere Sessions zählen mehr
    const ema = (key) => {
      let value = null;
      sessions.forEach(s => {
        const x = s.telemetry[key];
        if (typeof x !== 'number' || !Number.isFinite(x)) return;
        value = value == null ? x : value * 0.65 + x * 0.35;
      });
      return value;
    };
    const recentCountdowns = sessions.slice(-5).map(s => s.telemetry.countdownSec).filter(Boolean);
    const freq = {};
    recentCountdowns.forEach(c => { freq[c] = (freq[c] || 0) + 1; });
    const favoriteCountdown = Object.keys(freq).sort((a, b) => freq[b] - freq[a])[0];

    return {
      n: sessions.length,
      timeToFirstEdgeSec: ema('timeToFirstEdgeSec'),
      intervalSec: ema('medianIntervalSec'),
      recoverySec: ema('medianRecoverySec'),
      edgesPerSession: ema('edges'),
      countdownSec: favoriteCountdown ? parseInt(favoriteCountdown, 10) : null,
      yellowPerSession: sessions.reduce((sum, s) => sum + (s.telemetry.yellow || 0), 0) / sessions.length,
      redRecent: sessions.slice(-2).some(s => (s.telemetry.red || 0) > 0)
    };
  }

  function getRecommendations(model) {
    const m = model || getModel();
    const ready = m.n >= MIN_SESSIONS;
    let cooldownSec = 45;
    if (ready && m.recoverySec) cooldownSec = clamp(Math.round(m.recoverySec * 0.8 / 5) * 5, 30, 120);
    if (ready && m.yellowPerSession >= 1) cooldownSec = clamp(cooldownSec + 15, 30, 120);
    let countdownSec = 20;
    if (ready && m.countdownSec) {
      countdownSec = COUNTDOWN_PRESETS.reduce((best, p) => Math.abs(p - m.countdownSec) < Math.abs(best - m.countdownSec) ? p : best, 20);
    }
    return {
      ready,
      sessionsNeeded: Math.max(0, MIN_SESSIONS - m.n),
      cooldownSec,
      countdownSec,
      targetEdges: ready && m.edgesPerSession ? Math.max(1, Math.round(m.edgesPerSession)) : null,
      expectedIntervalSec: ready ? (m.intervalSec || null) : null,
      expectedFirstEdgeSec: ready ? (m.timeToFirstEdgeSec || null) : null
    };
  }

  // Für das Drehbuch: eure Kurve in Worten
  function describeModel() {
    const m = getModel();
    if (m.n < MIN_SESSIONS) return '';
    const r = getRecommendations(m);
    const head = `Eure gelernte Edge-Kurve (aus ${m.n} Sessions): `;
    const parts = [];
    if (m.timeToFirstEdgeSec) parts.push(`erste Edge typischerweise nach ${fmt(m.timeToFirstEdgeSec)}`);
    if (m.intervalSec) parts.push(`danach etwa alle ${fmt(m.intervalSec)}`);
    if (m.edgesPerSession) parts.push(`meist ${Math.round(m.edgesPerSession)} Edges pro Abend`);
    if (m.recoverySec) parts.push(`Erholung nach einer Edge ca. ${fmt(m.recoverySec)}`);
    if (m.redRecent) parts.push('zuletzt wurde per Rot abgebrochen – behutsamer Aufbau');
    return head + parts.join(', ') + `. Plane die Edging-Phase für etwa ${r.targetEdges || 3} Edges.`;
  }

  // --- Karte im Edging-Cockpit -----------------------------------------------------

  function renderCurveCard() {
    const host = document.getElementById('edging-cockpit-panel') || document.getElementById('edging-cockpit-container');
    if (!host) return;
    let card = document.getElementById('tactus-curve-card');
    if (!card) {
      card = document.createElement('div');
      card.id = 'tactus-curve-card';
      card.style.cssText = 'margin:10px 0;padding:12px 14px;border-radius:16px;border:1px solid #2a364f;background:#000;font-size:12px;line-height:1.5;color:#cbd5e1';
      host.insertBefore(card, host.firstChild);
    }
    const m = getModel();
    const r = getRecommendations(m);
    if (!r.ready) {
      card.innerHTML = `<b style="color:#c5a880;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.1em">EURE KURVE</b><br>Lernt mit: noch ${r.sessionsNeeded} Session${r.sessionsNeeded === 1 ? '' : 's'} mit Erregungsregler und „Edge erreicht“, dann passt sich die Regie an euch an.`;
      return;
    }
    let status = '';
    const lastEdge = live && live.edges.length ? live.startedAt + live.edges[live.edges.length - 1] : null;
    if (lastEdge && r.expectedIntervalSec) {
      const since = (Date.now() - lastEdge) / 1000;
      const ratio = since / r.expectedIntervalSec;
      status = ratio >= 0.8
        ? '<br><b style="color:#eab308">Edge-Zone: Nach eurer Kurve ist die nächste Edge nah – langsamer werden.</b>'
        : `<br>Nächste Edge nach eurer Kurve in etwa ${fmt(Math.max(0, r.expectedIntervalSec - since))}.`;
    } else if (live && !live.edges.length && r.expectedFirstEdgeSec) {
      const since = (Date.now() - live.startedAt) / 1000;
      status = `<br>Erste Edge kommt bei euch meist nach ${fmt(r.expectedFirstEdgeSec)}${since > r.expectedFirstEdgeSec * 0.8 ? ' – <b style="color:#eab308">jetzt aufmerksam sein</b>' : ''}.`;
    }
    card.innerHTML = `<b style="color:#c5a880;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.1em">EURE KURVE · ${m.n} SESSIONS</b><br>` +
      `Abkühlen ${r.cooldownSec} s · Countdown ${r.countdownSec} s${r.targetEdges ? ` · Ziel heute ca. ${r.targetEdges} Edges` : ''}${status}`;
  }

  function startCardTicker() {
    if (cardTimer) return;
    cardTimer = setInterval(() => {
      if (document.visibilityState === 'visible') renderCurveCard();
    }, 10000);
  }

  window.TactusLearning = {
    start,
    recordArousal,
    recordEdge,
    recordCountdown,
    recordGoal,
    recordSafeword,
    finish,
    summarize: () => summarize(live || read(LIVE_KEY, null)),
    getModel,
    getRecommendations,
    describeModel,
    renderCurveCard,
    startCardTicker
  };

})(window);
