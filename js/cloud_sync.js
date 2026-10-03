/**
 * js/cloud_sync.js
 * TACTUS Zero-Knowledge Paar-Sync (V4 · Delta-Briefkasten über Cloudflare)
 * Offizielle Web-Präsenz: tactus.digital
 *
 * Prinzip:
 * - Beide Geräte teilen einen geheimen Kopplungscode. Daraus werden lokal
 *   abgeleitet: (1) eine Raum-ID (SHA-256, für den Server) und (2) der
 *   AES-GCM-256-Schlüssel (PBKDF2, verlässt nie das Gerät).
 * - Gesendet werden nur Änderungen (Delta) seit dem letzten erfolgreichen
 *   Senden – pro Fragebogen-Item, pro Chat-Nachricht, pro Transaktion usw.
 *   Pakete werden vor der Verschlüsselung mit gzip komprimiert.
 * - Der Cloudflare-Briefkasten (/api/relay) hält Pakete nur, bis das
 *   Partnergerät sie abgeholt hat, und löscht sie dann. Er kann nichts lesen.
 * - Live-Zustellung per WebSocket, solange die App sichtbar ist; beim
 *   Öffnen werden verpasste Pakete nachgeladen.
 * - Fotos werden einzeln und nur bei Änderung übertragen.
 *
 * Öffentliche API (window.CloudSync): init, trigger, forcePush, configure,
 * createPairing, joinPairing, disconnect, getConfig, gatherState
 */

(function(window) {
  'use strict';

  const SYNC_STORAGE_KEYS = {
    code: 'tactus_sync_code',
    device: 'tactus_sync_device',
    lastSeq: 'tactus_sync_last_seq',
    snapshot: 'tactus_sync_snapshot',
    isPaired: 'kompass_is_paired',
    lastSyncTime: 'kompass_last_sync_time',
    assignedRole: 'kompass_assigned_role',
    legacyRoom: 'kompass_sync_room',
    legacyPassword: 'kompass_sync_password',
    license: 'tactus_license_key',
    apiBase: 'tactus_api_base'
  };

  const PROTOCOL_VERSION = 4;
  const PUSH_DEBOUNCE_MS = 1500;
  const MAX_PACKET_RAW_CHARS = 900000;

  let isReceivingUpdate = false;
  let debounceTimer = null;
  let pushInFlight = null;
  let pushAgain = false;
  let ws = null;
  let wsPingTimer = null;
  let wsRetryMs = 2000;
  let wsRetryTimer = null;
  let cachedKey = null;
  let cachedKeyCode = null;
  let receiveChain = Promise.resolve();
  const status = { connected: false, error: null, lastPush: null, lastReceive: null };

  // -------------------------------------------------------------------------
  // Grundbausteine
  // -------------------------------------------------------------------------

  function bytesToBase64(bytes) {
    let binary = '';
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
    }
    return window.btoa(binary);
  }

  function base64ToBytes(base64) {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  }

  function base64UrlEncode(text) {
    return bytesToBase64(new TextEncoder().encode(text)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function base64UrlDecode(text) {
    const b64 = text.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((text.length + 3) % 4);
    return new TextDecoder().decode(base64ToBytes(b64));
  }

  async function sha256Hex(text) {
    const buf = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // FNV-1a: schneller Änderungs-Fingerabdruck für die Delta-Erkennung
  function fingerprint(value) {
    const str = JSON.stringify(value === undefined ? null : value);
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return (h >>> 0).toString(36) + ':' + str.length.toString(36);
  }

  function randomToken(length) {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const bytes = window.crypto.getRandomValues(new Uint8Array(length));
    return Array.from(bytes).map(b => alphabet[b % alphabet.length]).join('');
  }

  function getDeviceId() {
    let id = localStorage.getItem(SYNC_STORAGE_KEYS.device);
    if (!id || !/^[A-Za-z0-9_-]{8,64}$/.test(id)) {
      id = 'dev_' + randomToken(16);
      localStorage.setItem(SYNC_STORAGE_KEYS.device, id);
    }
    return id;
  }

  function getSyncCode() {
    const code = (localStorage.getItem(SYNC_STORAGE_KEYS.code) || '').trim();
    if (code) return code;
    // Migration alter Raum/Passwort-Kopplungen
    const room = (localStorage.getItem(SYNC_STORAGE_KEYS.legacyRoom) || '').trim();
    const pass = (localStorage.getItem(SYNC_STORAGE_KEYS.legacyPassword) || '').trim();
    return room && pass ? `${room}|${pass}` : '';
  }

  function getLicenseKey() {
    return (localStorage.getItem(SYNC_STORAGE_KEYS.license) || '').trim();
  }

  function getApiBase() {
    return (localStorage.getItem(SYNC_STORAGE_KEYS.apiBase) || '').trim().replace(/\/$/, '');
  }

  function isTransportAvailable() {
    return window.location.protocol !== 'file:' && typeof window.fetch === 'function';
  }

  function setStatus(patch) {
    Object.assign(status, patch);
    try { window.dispatchEvent(new CustomEvent('tactus-sync-status', { detail: Object.assign({}, status) })); } catch (e) {}
  }

  async function getRoomId(code) {
    return sha256Hex('tactus-room-v4:' + code);
  }

  async function getCryptoKey(code) {
    if (cachedKey && cachedKeyCode === code) return cachedKey;
    const roomId = await getRoomId(code);
    const material = await window.crypto.subtle.importKey('raw', new TextEncoder().encode(code), { name: 'PBKDF2' }, false, ['deriveKey']);
    cachedKey = await window.crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: new TextEncoder().encode('tactus-sync-v4:' + roomId), iterations: 150000, hash: 'SHA-256' },
      material,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
    cachedKeyCode = code;
    return cachedKey;
  }

  async function compress(bytes) {
    if (typeof window.CompressionStream !== 'function') return { flag: 0, bytes };
    const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream('gzip'));
    return { flag: 1, bytes: new Uint8Array(await new Response(stream).arrayBuffer()) };
  }

  async function decompress(flag, bytes) {
    if (flag === 0) return bytes;
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }

  // Paketformat: base64( flag[1] | iv[12] | AES-GCM-Chiffrat )
  async function encryptPayload(obj, code) {
    const key = await getCryptoKey(code);
    const packed = await compress(new TextEncoder().encode(JSON.stringify(obj)));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const cipher = new Uint8Array(await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, packed.bytes));
    const out = new Uint8Array(1 + 12 + cipher.length);
    out[0] = packed.flag;
    out.set(iv, 1);
    out.set(cipher, 13);
    return bytesToBase64(out);
  }

  async function decryptPayload(base64, code) {
    try {
      const raw = base64ToBytes(base64);
      const key = await getCryptoKey(code);
      const plain = await window.crypto.subtle.decrypt({ name: 'AES-GCM', iv: raw.slice(1, 13) }, key, raw.slice(13));
      const bytes = await decompress(raw[0], new Uint8Array(plain));
      return JSON.parse(new TextDecoder().decode(bytes));
    } catch (err) {
      console.warn('[TACTUS Sync] Paket konnte nicht entschlüsselt werden:', err);
      return null;
    }
  }

  function safeJsonParse(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  async function gatherUnifiedLocalState() {
    const state = {
      version: '4.0',
      timestamp: Date.now(),
      senderRole: localStorage.getItem(SYNC_STORAGE_KEYS.assignedRole) || 'A',
      answers: safeJsonParse('kompass_answers', {}),
      names: safeJsonParse('kompass_names', { A: 'Partner 1', B: 'Partner 2' }),
      roles: {
        assignedRole: localStorage.getItem('kompass_assigned_role') || 'A',
        keyholder: localStorage.getItem('kompass_keyholder_role') || 'A',
        caged: localStorage.getItem('kompass_caged_role') || 'B'
      },
      protocolState: safeJsonParse('tactus_protocol_state', null) || safeJsonParse('kompass_protocol_state', null),
      tasksState: safeJsonParse('tactus_tasks_state', null) || safeJsonParse('pactum_tasks_state', null),
      topMentalLoad: localStorage.getItem('tactus_top_mental_load') || 'balanced',
      climaxRatio: safeJsonParse('tactus_climax_ratio_state', null) || safeJsonParse('kompass_climax_ratio_state', null),
      contractState: safeJsonParse('tactus_contract_state', null) || safeJsonParse('kompass_contract_state', null),
      medicalPass: safeJsonParse('tactus_medical_pass', null),
      ownedEquipment: safeJsonParse('tactus_owned_equipment', null) || safeJsonParse('kompass_owned_equipment', []),
      toyQuantities: safeJsonParse('tactus_toy_quantities', null) || safeJsonParse('kompass_toy_quantities', {}),
      customEquipment: safeJsonParse('tactus_custom_equipment', null) || safeJsonParse('kompass_custom_equipment', []),
      chatMessages: safeJsonParse('kompass_chat_messages', []),
      sessionLogbook: safeJsonParse('tactus_session_logbook', null) || safeJsonParse('kompass_session_diary', []),
      sharing: {
        A: localStorage.getItem('tactus_individual_shared_A'),
        B: localStorage.getItem('tactus_individual_shared_B')
      }
    };

    // Fotos werden separat und einzeln übertragen (siehe collectPhotoUnits)
    return state;
  }

  async function mergeInboundRemoteState(remote) {
    if (!remote || typeof remote !== 'object') return false;

    isReceivingUpdate = true;
    let changesMade = false;

    try {
      const myRole = localStorage.getItem(SYNC_STORAGE_KEYS.assignedRole) || 'A';

      // 1. Namen synchronisieren
      if (remote.names && typeof remote.names === 'object') {
        const localNames = safeJsonParse('kompass_names', { A: 'Partner 1', B: 'Partner 2' });
        // Platzhalter eines frisch gekoppelten Geräts dürfen echte Namen nie überschreiben
        const isPlaceholder = (v) => !v || /^(Partner\s*[12]|Top|Bottom)$/i.test(String(v).trim());
        const mergedNames = Object.assign({}, localNames);
        Object.keys(remote.names).forEach(k => {
          const rv = remote.names[k];
          if (!isPlaceholder(rv) || isPlaceholder(mergedNames[k])) mergedNames[k] = rv;
        });
        localStorage.setItem('kompass_names', JSON.stringify(mergedNames));
        changesMade = true;
      }

      // 2. Rollen & Hierarchie
      if (remote.roles && typeof remote.roles === 'object') {
        if (remote.roles.keyholder) localStorage.setItem('kompass_keyholder_role', remote.roles.keyholder);
        if (remote.roles.caged) localStorage.setItem('kompass_caged_role', remote.roles.caged);
        changesMade = true;
      }

      // 3. Fragebogen-Antworten feldweise zusammenführen (Kein Überschreiben fremder Rollen)
      if (remote.answers && typeof remote.answers === 'object') {
        const localAnswers = safeJsonParse('kompass_answers', {}) || {};
        for (const roleKey of ['A', 'B']) {
          // Eigene Antworten sind auf diesem Gerät maßgeblich und werden nie vom Partner überschrieben
          if (roleKey === myRole) continue;
          if (remote.answers[roleKey]) {
            if (!localAnswers[roleKey]) localAnswers[roleKey] = {};
            for (const itemKey in remote.answers[roleKey]) {
              if (remote.answers[roleKey].hasOwnProperty(itemKey)) {
                localAnswers[roleKey][itemKey] = remote.answers[roleKey][itemKey];
              }
            }
          }
        }
        localStorage.setItem('kompass_answers', JSON.stringify(localAnswers));
        changesMade = true;
      }

      // 3b. Freigabe-Status des Solo-Profils: Nur der Eigentümer (Sender) bestimmt über seinen Schlüssel
      if (remote.sharing && typeof remote.sharing === 'object' && remote.senderRole && remote.senderRole !== myRole) {
        const flag = remote.sharing[remote.senderRole];
        if (flag === 'true' || flag === 'false') {
          localStorage.setItem(`tactus_individual_shared_${remote.senderRole}`, flag);
          changesMade = true;
        }
      }

      // 4. Atomarer Event-Sourcing Merge des Protokoll-Logbuchs
      if (remote.protocolState && typeof remote.protocolState === 'object') {
        const localProtocol = safeJsonParse('tactus_protocol_state', null) || safeJsonParse('kompass_protocol_state', { transactions: [] });
        const localTxs = Array.isArray(localProtocol.transactions) ? localProtocol.transactions : [];
        const remoteTxs = Array.isArray(remote.protocolState.transactions) ? remote.protocolState.transactions : [];

        const txMap = new Map();
        localTxs.forEach(t => { if (t && t.id) txMap.set(t.id, t); });
        remoteTxs.forEach(t => { if (t && t.id) txMap.set(t.id, t); });

        const mergedTxs = Array.from(txMap.values()).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)).slice(0, 400);

        const mergedProtocol = Object.assign({}, localProtocol, remote.protocolState, {
          transactions: mergedTxs
        });

        // Berechne Saldo strikt aus den gemergten Transaktionen
        const recomputedBalance = mergedTxs.reduce((sum, tx) => sum + (Number(tx.delta) || 0), 0);
        mergedProtocol.balance = recomputedBalance;

        localStorage.setItem('tactus_protocol_state', JSON.stringify(mergedProtocol));
        localStorage.setItem('kompass_protocol_state', JSON.stringify(mergedProtocol));
        changesMade = true;
      }

      // 5. Aufgaben & Pflichten (tactus_tasks_state)
      if (remote.tasksState && typeof remote.tasksState === 'object') {
        const localTasksState = safeJsonParse('tactus_tasks_state', { tasks: [] });
        const localList = Array.isArray(localTasksState.tasks) ? localTasksState.tasks : [];
        const remoteList = Array.isArray(remote.tasksState.tasks) ? remote.tasksState.tasks : [];

        const taskMap = new Map();
        localList.forEach(t => { if (t && t.id) taskMap.set(t.id, t); });
        remoteList.forEach(t => {
          if (t && t.id) {
            const existing = taskMap.get(t.id);
            if (!existing || (t.lastSubmittedAt || t.createdAt || 0) >= (existing.lastSubmittedAt || existing.createdAt || 0)) {
              taskMap.set(t.id, t);
            }
          }
        });

        localTasksState.tasks = Array.from(taskMap.values());
        if (remote.topMentalLoad) {
          localTasksState.topMentalLoad = remote.topMentalLoad;
          localStorage.setItem('tactus_top_mental_load', remote.topMentalLoad);
        }

        localStorage.setItem('tactus_tasks_state', JSON.stringify(localTasksState));
        localStorage.setItem('pactum_tasks_state', JSON.stringify(localTasksState));
        changesMade = true;
      }

      // 6. Orgasmus-Ratio (tactus_climax_ratio_state)
      if (remote.climaxRatio && typeof remote.climaxRatio === 'object') {
        const localRatio = safeJsonParse('tactus_climax_ratio_state', { history: [] });
        const localHist = Array.isArray(localRatio.history) ? localRatio.history : [];
        const remoteHist = Array.isArray(remote.climaxRatio.history) ? remote.climaxRatio.history : [];

        const histMap = new Map();
        localHist.forEach(h => { if (h && h.id) histMap.set(h.id, h); });
        remoteHist.forEach(h => { if (h && h.id) histMap.set(h.id, h); });

        const mergedHist = Array.from(histMap.values()).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)).slice(0, 150);

        const mergedRatio = Object.assign({}, localRatio, remote.climaxRatio, {
          history: mergedHist
        });

        localStorage.setItem('tactus_climax_ratio_state', JSON.stringify(mergedRatio));
        localStorage.setItem('kompass_climax_ratio_state', JSON.stringify(mergedRatio));
        changesMade = true;
      }

      // 7. Beziehungsvertrag (tactus_contract_state)
      if (remote.contractState && typeof remote.contractState === 'object') {
        const localContract = safeJsonParse('tactus_contract_state', {});
        const remoteTime = remote.contractState.updatedAt || remote.contractState.signedAt || 0;
        const localTime = localContract.updatedAt || localContract.signedAt || 0;

        if (remoteTime >= localTime) {
          localStorage.setItem('tactus_contract_state', JSON.stringify(remote.contractState));
          localStorage.setItem('kompass_contract_state', JSON.stringify(remote.contractState));
          changesMade = true;
        }
      }

      // 8. RACK-Gesundheitspass & Traumagrenzen (tactus_medical_pass)
      if (remote.medicalPass && typeof remote.medicalPass === 'object') {
        const localPass = safeJsonParse('tactus_medical_pass', {});
        const mergedPass = Object.assign({}, localPass, remote.medicalPass);
        localStorage.setItem('tactus_medical_pass', JSON.stringify(mergedPass));
        changesMade = true;
      }

      // 9. Ausrüstungsschrank, Mengen & Custom-Toys
      if (Array.isArray(remote.ownedEquipment)) {
        localStorage.setItem('tactus_owned_equipment', JSON.stringify(remote.ownedEquipment));
        localStorage.setItem('kompass_owned_equipment', JSON.stringify(remote.ownedEquipment));
        changesMade = true;
      }
      if (remote.toyQuantities && typeof remote.toyQuantities === 'object') {
        localStorage.setItem('tactus_toy_quantities', JSON.stringify(remote.toyQuantities));
        localStorage.setItem('kompass_toy_quantities', JSON.stringify(remote.toyQuantities));
        changesMade = true;
      }
      if (Array.isArray(remote.customEquipment)) {
        const localCustom = safeJsonParse('tactus_custom_equipment', []);
        const customMap = new Map();
        localCustom.forEach(c => { if (c && c.id) customMap.set(c.id, c); });
        remote.customEquipment.forEach(c => { if (c && c.id) customMap.set(c.id, c); });
        const mergedCustom = Array.from(customMap.values());
        localStorage.setItem('tactus_custom_equipment', JSON.stringify(mergedCustom));
        localStorage.setItem('kompass_custom_equipment', JSON.stringify(mergedCustom));
        changesMade = true;
      }

      // 10. Chat-Stream Nachrichten
      if (Array.isArray(remote.chatMessages)) {
        const localMessages = safeJsonParse('kompass_chat_messages', []);
        const msgMap = new Map();
        localMessages.forEach(m => { if (m && m.id) msgMap.set(m.id, m); });
        remote.chatMessages.forEach(m => { if (m && m.id) msgMap.set(m.id, m); });
        const mergedMsgs = Array.from(msgMap.values()).sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0)).slice(-250);
        localStorage.setItem('kompass_chat_messages', JSON.stringify(mergedMsgs));
        changesMade = true;
      }

      // 10b. Session-Logbuch (neueste zuerst)
      if (Array.isArray(remote.sessionLogbook)) {
        const localLog = safeJsonParse('tactus_session_logbook', null) || safeJsonParse('kompass_session_diary', []);
        const logMap = new Map();
        (Array.isArray(localLog) ? localLog : []).forEach(s => { if (s && s.id) logMap.set(s.id, s); });
        remote.sessionLogbook.forEach(s => { if (s && s.id) logMap.set(s.id, s); });
        const mergedLog = Array.from(logMap.values()).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)).slice(0, 200);
        localStorage.setItem('tactus_session_logbook', JSON.stringify(mergedLog));
        localStorage.setItem('kompass_session_diary', JSON.stringify(mergedLog));
        changesMade = true;
      }

      // 11. Fototresor-Import (IndexedDB)
      if (Array.isArray(remote.vaultPhotos) && remote.vaultPhotos.length > 0) {
        if (window.HubPhotos && typeof window.HubPhotos.importFromSync === 'function') {
          try {
            await window.HubPhotos.importFromSync(remote.vaultPhotos);
          } catch (ePhotoImp) {
            console.warn('[TACTUS E2EE] Fehler beim Fototresor-Import:', ePhotoImp);
          }
        }
      }

      localStorage.setItem(SYNC_STORAGE_KEYS.lastSyncTime, Date.now().toString());

      // 12. Reaktive UI-Benachrichtigung offener Module
      notifyLocalModules();

    } finally {
      setTimeout(() => {
        isReceivingUpdate = false;
      }, 200);
    }

    return changesMade;
  }

  function notifyLocalModules() {
    try {
      if (window.HubDashboard && typeof window.HubDashboard.render === 'function') window.HubDashboard.render();
      if (window.SurveyRunner && typeof window.SurveyRunner.renderActiveView === 'function') window.SurveyRunner.renderActiveView();
      if (window.ProtocolCore && typeof window.ProtocolCore.render === 'function') window.ProtocolCore.render();
      if (window.ProtocolRatio && typeof window.ProtocolRatio.render === 'function') window.ProtocolRatio.render();
      if (window.ProtocolTasks && typeof window.ProtocolTasks.render === 'function') window.ProtocolTasks.render();
      if (window.ProtocolContract && typeof window.ProtocolContract.render === 'function') window.ProtocolContract.render();
      if (window.ProtocolCoach && typeof window.ProtocolCoach.render === 'function') window.ProtocolCoach.render();
      if (window.SessionStaging && typeof window.SessionStaging.render === 'function') window.SessionStaging.render();
      if (window.SessionLive && typeof window.SessionLive.renderCockpit === 'function') window.SessionLive.renderCockpit();
      if (window.ChatApp && typeof window.ChatApp.renderMessages === 'function') window.ChatApp.renderMessages();
      if (window.PairAnalysis && typeof window.PairAnalysis.init === 'function') window.PairAnalysis.init();
      if (window.HubToys && typeof window.HubToys.render === 'function') window.HubToys.render();
    } catch (e) {
      console.debug('[TACTUS E2EE] Fehler bei reaktiver UI-Benachrichtigung:', e);
    }
  }

  // -------------------------------------------------------------------------
  // Delta-Erkennung: Zustand in kleine, einzeln vergleichbare Einheiten zerlegen
  // -------------------------------------------------------------------------

  // Container mit Listen, deren Einträge eine id tragen und einzeln übertragen werden
  const ITEMIZED_CONTAINERS = {
    protocolState: 'transactions',
    tasksState: 'tasks',
    climaxRatio: 'history'
  };
  const ITEMIZED_ARRAYS = ['chatMessages', 'customEquipment', 'sessionLogbook'];
  const WHOLE_SECTIONS = ['names', 'roles', 'topMentalLoad', 'contractState', 'medicalPass', 'ownedEquipment', 'toyQuantities', 'sharing'];

  function stateToUnits(state) {
    const units = [];
    const push = (path, v) => units.push({ k: path.join('\u001f'), p: path, v });

    if (state.answers && typeof state.answers === 'object') {
      ['A', 'B'].forEach(role => {
        const list = state.answers[role];
        if (list && typeof list === 'object') {
          Object.keys(list).forEach(id => push(['answers', role, id], list[id]));
        }
      });
    }

    Object.keys(ITEMIZED_CONTAINERS).forEach(section => {
      const container = state[section];
      if (!container || typeof container !== 'object') return;
      const listKey = ITEMIZED_CONTAINERS[section];
      const meta = Object.assign({}, container);
      delete meta[listKey];
      push([section, '@'], meta);
      (Array.isArray(container[listKey]) ? container[listKey] : []).forEach(item => {
        if (item && item.id) push([section, listKey, String(item.id)], item);
      });
    });

    ITEMIZED_ARRAYS.forEach(section => {
      (Array.isArray(state[section]) ? state[section] : []).forEach(item => {
        if (item && item.id) push([section, String(item.id)], item);
      });
    });

    WHOLE_SECTIONS.forEach(section => {
      if (state[section] !== undefined && state[section] !== null) push([section], state[section]);
    });

    return units;
  }

  function unitsToState(units) {
    const state = {};
    units.forEach(({ p, v }) => {
      const [section] = p;
      if (section === 'answers') {
        state.answers = state.answers || {};
        state.answers[p[1]] = state.answers[p[1]] || {};
        state.answers[p[1]][p[2]] = v;
      } else if (ITEMIZED_CONTAINERS[section]) {
        state[section] = state[section] || {};
        if (p[1] === '@') Object.assign(state[section], v);
        else (state[section][p[1]] = state[section][p[1]] || []).push(v);
      } else if (ITEMIZED_ARRAYS.includes(section)) {
        (state[section] = state[section] || []).push(v);
      } else if (section === 'photo') {
        (state.vaultPhotos = state.vaultPhotos || []).push(v);
      } else {
        state[section] = v;
      }
    });
    return state;
  }

  async function collectPhotoUnits() {
    if (!window.HubPhotos || typeof window.HubPhotos.exportForSync !== 'function') return [];
    try {
      const photos = await window.HubPhotos.exportForSync();
      return (photos || []).filter(ph => ph && ph.toyId && ph.dataUrl).map(ph => ({
        k: 'photo\u001f' + ph.toyId,
        p: ['photo', String(ph.toyId)],
        v: ph,
        h: 'ph:' + (ph.updatedAt || 0) + ':' + (ph.sizeBytes || ph.dataUrl.length)
      }));
    } catch (e) {
      return [];
    }
  }

  function loadSnapshot() {
    return safeJsonParse(SYNC_STORAGE_KEYS.snapshot, {}) || {};
  }

  function saveSnapshot(snap) {
    try {
      localStorage.setItem(SYNC_STORAGE_KEYS.snapshot, JSON.stringify(snap));
    } catch (e) {
      console.warn('[TACTUS Sync] Snapshot konnte nicht gespeichert werden:', e);
    }
  }

  function unitHash(u) {
    return u.h || fingerprint(u.v);
  }

  // Einheiten gierig auf Pakete verteilen (Größenlimit des Briefkastens)
  function packUnits(units) {
    const packets = [];
    let current = [];
    let size = 0;
    units.forEach(u => {
      const len = JSON.stringify(u.v === undefined ? null : u.v).length + u.k.length + 16;
      if (len > MAX_PACKET_RAW_CHARS) {
        console.warn('[TACTUS Sync] Einheit zu groß, übersprungen:', u.k);
        return;
      }
      if (size + len > MAX_PACKET_RAW_CHARS && current.length) {
        packets.push(current);
        current = [];
        size = 0;
      }
      current.push(u);
      size += len;
    });
    if (current.length) packets.push(current);
    return packets;
  }

  // -------------------------------------------------------------------------
  // Transport
  // -------------------------------------------------------------------------

  async function relayUrl(action, params = {}) {
    const code = getSyncCode();
    const roomId = await getRoomId(code);
    const qs = new URLSearchParams(Object.assign({ device: getDeviceId() }, params));
    return `${getApiBase()}/api/relay/${roomId}/${action}?${qs.toString()}`;
  }

  function isConfigured() {
    return Boolean(getSyncCode()) && Boolean(getLicenseKey()) && isTransportAvailable();
  }

  async function sendPacket(payload) {
    const code = getSyncCode();
    const body = await encryptPayload(payload, code);
    const res = await fetch(await relayUrl('push'), {
      method: 'POST',
      headers: { 'X-Tactus-License': getLicenseKey(), 'Content-Type': 'text/plain' },
      body
    });
    if (res.status === 402) {
      setStatus({ error: 'license' });
      throw new Error('Lizenz ungültig oder abgelaufen');
    }
    if (!res.ok) throw new Error(`Briefkasten antwortet mit HTTP ${res.status}`);
    return res.json();
  }

  function basePayload(kind) {
    return {
      v: PROTOCOL_VERSION,
      kind,
      device: getDeviceId(),
      senderRole: localStorage.getItem(SYNC_STORAGE_KEYS.assignedRole) || 'A',
      ts: Date.now()
    };
  }

  async function pushChanges(options = {}) {
    if (!isConfigured()) return;
    if (isReceivingUpdate && !options.force) return;
    if (pushInFlight) {
      pushAgain = true;
      return pushInFlight;
    }

    pushInFlight = (async () => {
      try {
        const state = await gatherUnifiedLocalState();
        const units = stateToUnits(state).concat(await collectPhotoUnits());
        const snapshot = options.full ? {} : loadSnapshot();
        const changed = units.filter(u => snapshot[u.k] !== unitHash(u));
        if (!changed.length) return;

        const liveSnapshot = loadSnapshot();
        for (const group of packUnits(changed)) {
          const payload = Object.assign(basePayload('delta'), {
            units: group.map(u => ({ p: u.p, v: u.v }))
          });
          await sendPacket(payload);
          group.forEach(u => { liveSnapshot[u.k] = unitHash(u); });
          saveSnapshot(liveSnapshot);
        }

        localStorage.setItem(SYNC_STORAGE_KEYS.lastSyncTime, Date.now().toString());
        setStatus({ lastPush: Date.now(), error: null });
      } catch (err) {
        console.warn('[TACTUS Sync] Senden fehlgeschlagen:', err);
        if (status.error !== 'license') setStatus({ error: 'network' });
      } finally {
        pushInFlight = null;
        if (pushAgain) {
          pushAgain = false;
          triggerSyncDebounced();
        }
      }
    })();

    return pushInFlight;
  }

  function triggerSyncDebounced() {
    if (!isConfigured()) return;
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      pushChanges();
    }, PUSH_DEBOUNCE_MS);
  }

  async function flushPendingPush() {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
      await pushChanges();
    } else if (pushInFlight) {
      await pushInFlight;
    }
  }

  async function handleInboundPacket(seq, data) {
    const payload = await decryptPayload(data, getSyncCode());
    if (payload && payload.device !== getDeviceId()) {
      if (payload.kind === 'hello') {
        // Neues Partnergerät: kompletten Stand einmalig nachliefern
        setTimeout(() => pushChanges({ full: true, force: true }), 300);
      } else if (payload.kind === 'delta' && Array.isArray(payload.units)) {
        await flushPendingPush();
        const remoteState = unitsToState(payload.units);
        remoteState.senderRole = payload.senderRole;
        remoteState.timestamp = payload.ts;

        const changed = await mergeInboundRemoteState(remoteState);

        // Empfangene Abschnitte als "bekannt" markieren, damit nichts zurückgespiegelt wird
        const touched = new Set(payload.units.map(u => u.p[0]));
        const snapshot = loadSnapshot();
        stateToUnits(await gatherUnifiedLocalState()).forEach(u => {
          if (touched.has(u.p[0])) snapshot[u.k] = unitHash(u);
        });
        if (touched.has('photo')) {
          (await collectPhotoUnits()).forEach(u => { snapshot[u.k] = unitHash(u); });
        }
        saveSnapshot(snapshot);

        setStatus({ lastReceive: Date.now() });
        if (changed && typeof window.showToastNotification === 'function') {
          window.showToastNotification('Daten mit Partner synchronisiert');
        }
      }
    }
    const last = parseInt(localStorage.getItem(SYNC_STORAGE_KEYS.lastSeq) || '0', 10) || 0;
    if (seq > last) localStorage.setItem(SYNC_STORAGE_KEYS.lastSeq, String(seq));
  }

  function enqueueInbound(seq, data) {
    receiveChain = receiveChain.then(() => handleInboundPacket(seq, data)).catch(err => {
      console.warn('[TACTUS Sync] Eingehendes Paket übersprungen:', err);
    });
    return receiveChain;
  }

  async function pullMissed() {
    if (!isConfigured()) return;
    try {
      let more = true;
      let maxSeq = 0;
      while (more) {
        const since = localStorage.getItem(SYNC_STORAGE_KEYS.lastSeq) || '0';
        const res = await fetch(await relayUrl('pull', { since }), { headers: { 'X-Tactus-License': getLicenseKey() } });
        if (res.status === 402) { setStatus({ error: 'license' }); return; }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        for (const pkt of data.packets || []) {
          await enqueueInbound(pkt.seq, pkt.data);
          maxSeq = Math.max(maxSeq, pkt.seq);
        }
        more = Boolean(data.more) && (data.packets || []).length > 0;
      }
      if (maxSeq > 0) {
        await fetch(await relayUrl('ack'), {
          method: 'POST',
          headers: { 'X-Tactus-License': getLicenseKey(), 'Content-Type': 'application/json' },
          body: JSON.stringify({ seq: maxSeq })
        });
      }
    } catch (err) {
      console.warn('[TACTUS Sync] Nachladen fehlgeschlagen:', err);
      setStatus({ error: 'network' });
    }
  }

  function closeSocket() {
    if (wsPingTimer) { clearInterval(wsPingTimer); wsPingTimer = null; }
    if (wsRetryTimer) { clearTimeout(wsRetryTimer); wsRetryTimer = null; }
    if (ws) {
      ws.onclose = null;
      try { ws.close(); } catch (e) {}
      ws = null;
    }
    setStatus({ connected: false });
  }

  async function openSocket() {
    if (!isConfigured() || document.visibilityState === 'hidden' || typeof window.WebSocket !== 'function') return;
    if (ws && (ws.readyState === 0 || ws.readyState === 1)) return;

    const httpUrl = await relayUrl('ws', { license: getLicenseKey() });
    const absolute = new URL(httpUrl, window.location.href);
    absolute.protocol = absolute.protocol === 'https:' ? 'wss:' : 'ws:';

    const socket = new WebSocket(absolute.toString());
    ws = socket;

    socket.onopen = () => {
      wsRetryMs = 2000;
      setStatus({ connected: true, error: status.error === 'license' ? 'license' : null });
      wsPingTimer = setInterval(() => {
        try { socket.send('ping'); } catch (e) {}
      }, 45000);
    };

    socket.onmessage = (event) => {
      if (event.data === 'pong') return;
      let msg;
      try { msg = JSON.parse(event.data); } catch (e) { return; }
      if (msg && msg.t === 'pkt') {
        enqueueInbound(msg.seq, msg.data).then(() => {
          try { socket.send(JSON.stringify({ t: 'ack', seq: msg.seq })); } catch (e) {}
        });
      }
    };

    socket.onclose = () => {
      if (wsPingTimer) { clearInterval(wsPingTimer); wsPingTimer = null; }
      ws = null;
      setStatus({ connected: false });
      if (document.visibilityState !== 'hidden' && isConfigured()) {
        wsRetryTimer = setTimeout(() => { pullMissed().then(openSocket); }, wsRetryMs);
        wsRetryMs = Math.min(wsRetryMs * 2, 60000);
      }
    };
  }

  async function initializeSync() {
    if (!isConfigured()) {
      setStatus({ connected: false });
      return;
    }
    await pullMissed();
    await openSocket();
    triggerSyncDebounced();
  }

  // -------------------------------------------------------------------------
  // Kopplung
  // -------------------------------------------------------------------------

  function configureSyncCredentials({ code, room, password, role } = {}) {
    const finalCode = (code || (room && password ? `${String(room).trim()}|${String(password).trim()}` : '')).trim();
    if (finalCode.length < 12) return false;

    closeSocket();
    localStorage.setItem(SYNC_STORAGE_KEYS.code, finalCode);
    localStorage.removeItem(SYNC_STORAGE_KEYS.legacyRoom);
    localStorage.removeItem(SYNC_STORAGE_KEYS.legacyPassword);
    localStorage.removeItem(SYNC_STORAGE_KEYS.snapshot);
    localStorage.setItem(SYNC_STORAGE_KEYS.lastSeq, '0');
    if (role === 'A' || role === 'B') localStorage.setItem(SYNC_STORAGE_KEYS.assignedRole, role);
    localStorage.setItem(SYNC_STORAGE_KEYS.isPaired, 'true');

    (async () => {
      if (!isConfigured()) return;
      try { await sendPacket(basePayload('hello')); } catch (e) {}
      await pullMissed();
      await openSocket();
      await pushChanges({ full: true, force: true });
    })();
    return true;
  }

  // Erzeugt einen Kopplungstext für das Partnergerät (enthält Code, Lizenz und Rolle)
  function createPairing() {
    if (!getLicenseKey()) throw new Error('Bitte zuerst einen gültigen Lizenzschlüssel eintragen.');
    const code = randomToken(24);
    const myRole = localStorage.getItem(SYNC_STORAGE_KEYS.assignedRole) || 'A';
    configureSyncCredentials({ code, role: myRole });
    return 'TACTUS1-' + base64UrlEncode(JSON.stringify({ c: code, l: getLicenseKey(), r: myRole }));
  }

  function joinPairing(text) {
    const raw = String(text || '').trim();
    const match = raw.match(/TACTUS1-([A-Za-z0-9_-]+)/);
    if (!match) throw new Error('Das ist kein gültiger TACTUS-Kopplungscode.');
    let data;
    try { data = JSON.parse(base64UrlDecode(match[1])); } catch (e) { throw new Error('Kopplungscode beschädigt.'); }
    if (!data || !data.c) throw new Error('Kopplungscode unvollständig.');
    if (data.l && !getLicenseKey()) localStorage.setItem(SYNC_STORAGE_KEYS.license, data.l);
    const partnerRole = data.r === 'B' ? 'A' : 'B';
    configureSyncCredentials({ code: data.c, role: partnerRole });
    return { role: partnerRole };
  }

  function disconnectSync() {
    closeSocket();
    [SYNC_STORAGE_KEYS.code, SYNC_STORAGE_KEYS.legacyRoom, SYNC_STORAGE_KEYS.legacyPassword,
      SYNC_STORAGE_KEYS.snapshot, SYNC_STORAGE_KEYS.lastSeq].forEach(k => localStorage.removeItem(k));
    localStorage.setItem(SYNC_STORAGE_KEYS.isPaired, 'false');
    if (typeof window.showToastNotification === 'function') {
      window.showToastNotification('Partner-Sync getrennt.');
    }
  }

  function getSyncConfig() {
    return {
      active: isConfigured(),
      paired: Boolean(getSyncCode()),
      hasLicense: Boolean(getLicenseKey()),
      connected: status.connected,
      error: status.error,
      lastSyncTime: localStorage.getItem(SYNC_STORAGE_KEYS.lastSyncTime) || null
    };
  }

  const api = {
    init: initializeSync,
    trigger: triggerSyncDebounced,
    forcePush: () => pushChanges({ force: true }),
    pull: pullMissed,
    configure: configureSyncCredentials,
    createPairing,
    joinPairing,
    disconnect: disconnectSync,
    getConfig: getSyncConfig,
    getStatus: () => Object.assign({}, status),
    gatherState: gatherUnifiedLocalState,
    // Für Tests
    _internal: { stateToUnits, unitsToState, encryptPayload, decryptPayload, fingerprint }
  };

  window.CloudSync = api;

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      initializeSync();
    } else {
      flushPendingPush();
      closeSocket();
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSync);
  } else {
    initializeSync();
  }

})(window);
