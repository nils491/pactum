/**
 * js/cloud_sync.js
 * TACTUS Zero-Knowledge E2EE Peer-Sync & Transport-Bridge (V3.0 Hyper-Dynamisch)
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien:
 * - Authenticated Encryption via native Web Crypto API: AES-GCM-256
 * - Key-Derivation via PBKDF2 mit 100.000 Iterationen, SHA-256 & 16-Byte Krypto-Salt
 * - Frischer 12-Byte Initialisierungsvektor (IV) pro Übertragungs-Payload
 * - Lückenlose Synchronisation des gesamten 7-Vektoren Zustandsraums:
 *   • Psychometrie, Scham-Anker & Notizen (kompass_answers)
 *   • Rollen, Namen & D/s-Hierarchie (kompass_names, roles)
 *   • Transaktions-Logbuch & Saldo (tactus_protocol_state)
 *   • Pflichten, Zucht & Top-Mental-Load (tactus_tasks_state, tactus_top_mental_load)
 *   • Orgasmus-Ökonomie & Lust-Ratio (tactus_climax_ratio_state)
 *   • Beziehungsvertrag & Signaturen (tactus_contract_state)
 *   • RACK-Gesundheitspass & Trauma-Trigger (tactus_medical_pass)
 *   • Ausrüstungsschrank, Mengen & Custom-Toys (tactus_owned_equipment)
 *   • 1:1 Foto-Tresor Bridge (HubPhotos Export/Import)
 * - Atomarer Transaktions-Merge (Event-Sourcing Deduplizierung via tx.id gegen LWW)
 * - Serverlose, zustandslose Transport-Bridge über ntfy (EventSource / SSE)
 * - Echo-Unterdrückung, Reentrancy-Schutz & debouncter Push (450ms)
 * - 100 % frei von infantilen System-Emojis in Benutzeroberfläche und Code
 * - Keine window.alert() / window.confirm() Aufrufe unter keinen Umständen
 */

(function(window) {
  'use strict';

  const SYNC_STORAGE_KEYS = {
    room: 'kompass_sync_room',
    password: 'kompass_sync_password',
    server: 'kompass_sync_server',
    isPaired: 'kompass_is_paired',
    lastSyncTime: 'kompass_last_sync_time',
    assignedRole: 'kompass_assigned_role'
  };

  const DEFAULT_NTFY_SERVER = 'https://ntfy.sh';

  let eventSourceInstance = null;
  let syncDebounceTimer = null;
  let isReceivingUpdate = false;
  let lastPushedChecksum = null;

  function bytesToBase64(bytes) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  function base64ToBytes(base64) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  async function deriveKey(passphrase, saltBytes) {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      enc.encode(passphrase),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: saltBytes,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  async function encryptPayload(dataObject, passphrase) {
    const enc = new TextEncoder();
    const plainBytes = enc.encode(JSON.stringify(dataObject));

    // Frischer 16-Byte Krypto-Salt und 12-Byte GCM-IV
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const key = await deriveKey(passphrase, salt);

    const cipherBuffer = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      plainBytes
    );

    const cipherBytes = new Uint8Array(cipherBuffer);

    // Packe Salt (16B) | IV (12B) | Ciphertext
    const combined = new Uint8Array(salt.length + iv.length + cipherBytes.length);
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(cipherBytes, salt.length + iv.length);

    return bytesToBase64(combined);
  }

  async function decryptPayload(base64Payload, passphrase) {
    try {
      const combined = base64ToBytes(base64Payload);
      if (combined.length < 28) return null; // Mindestens 16B Salt + 12B IV

      const salt = combined.slice(0, 16);
      const iv = combined.slice(16, 28);
      const cipherBytes = combined.slice(28);

      const key = await deriveKey(passphrase, salt);

      const decryptedBuffer = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        cipherBytes
      );

      const dec = new TextDecoder();
      const jsonString = dec.decode(decryptedBuffer);
      return JSON.parse(jsonString);
    } catch (err) {
      console.warn('[TACTUS E2EE] Entschlüsselung fehlgeschlagen (Falsches Passwort oder Paket beschädigt):', err);
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
      version: '3.0',
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
      sharing: {
        A: localStorage.getItem('tactus_individual_shared_A'),
        B: localStorage.getItem('tactus_individual_shared_B')
      }
    };

    // Fotos aus dem verschlüsselten IndexedDB-Tresor exportieren
    if (window.HubPhotos && typeof window.HubPhotos.exportForSync === 'function') {
      try {
        state.vaultPhotos = await window.HubPhotos.exportForSync();
      } catch (ePhoto) {
        state.vaultPhotos = [];
      }
    } else {
      state.vaultPhotos = [];
    }

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
        const mergedNames = Object.assign({}, localNames, remote.names);
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

  async function pushLocalStateToRemote() {
    if (isReceivingUpdate) return;

    const room = (localStorage.getItem(SYNC_STORAGE_KEYS.room) || '').trim();
    const pass = (localStorage.getItem(SYNC_STORAGE_KEYS.password) || '').trim();
    const server = (localStorage.getItem(SYNC_STORAGE_KEYS.server) || DEFAULT_NTFY_SERVER).trim().replace(/\/$/, '');

    if (!room || !pass) return;

    try {
      const unifiedState = await gatherUnifiedLocalState();
      const serializedJson = JSON.stringify(unifiedState);

      // Duplikats-Schutz: Unveränderten Zustand nicht mehrfach versenden
      if (lastPushedChecksum === serializedJson) return;

      const encryptedBase64 = await encryptPayload(unifiedState, pass);

      const endpoint = `${server}/${encodeURIComponent(room)}`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Title': 'TACTUS Sync',
          'Priority': 'default',
          'Tags': 'key,shield'
        },
        body: encryptedBase64
      });

      if (res.ok) {
        lastPushedChecksum = serializedJson;
        localStorage.setItem(SYNC_STORAGE_KEYS.lastSyncTime, Date.now().toString());
        localStorage.setItem(SYNC_STORAGE_KEYS.isPaired, 'true');
      }
    } catch (errPush) {
      console.warn('[TACTUS E2EE] Fehler beim Senden des E2EE-Sync-Pakets:', errPush);
    }
  }

  function triggerSyncDebounced() {
    if (syncDebounceTimer) clearTimeout(syncDebounceTimer);
    syncDebounceTimer = setTimeout(() => {
      pushLocalStateToRemote();
    }, 450);
  }

  function initializeStreamListener() {
    if (eventSourceInstance) {
      eventSourceInstance.close();
      eventSourceInstance = null;
    }

    const room = (localStorage.getItem(SYNC_STORAGE_KEYS.room) || '').trim();
    const pass = (localStorage.getItem(SYNC_STORAGE_KEYS.password) || '').trim();
    const server = (localStorage.getItem(SYNC_STORAGE_KEYS.server) || DEFAULT_NTFY_SERVER).trim().replace(/\/$/, '');

    if (!room || !pass) return;

    try {
      const streamUrl = `${server}/${encodeURIComponent(room)}/sse`;
      eventSourceInstance = new EventSource(streamUrl);

      eventSourceInstance.onmessage = async (event) => {
        try {
          if (!event.data) return;
          const ntfyPacket = JSON.parse(event.data);

          // Nur reguläre Nachrichten mit Payload verarbeiten
          if (ntfyPacket.event !== 'message' || !ntfyPacket.message) return;

          const encryptedBase64 = ntfyPacket.message.trim();
          const decryptedState = await decryptPayload(encryptedBase64, pass);

          if (!decryptedState || typeof decryptedState !== 'object') return;

          // Echo-Unterdrückung: Eigene Nachrichten ignorieren
          const myRole = localStorage.getItem(SYNC_STORAGE_KEYS.assignedRole) || 'A';
          if (decryptedState.senderRole === myRole && Math.abs(Date.now() - (decryptedState.timestamp || 0)) < 3000) {
            return;
          }

          const hasChanged = await mergeInboundRemoteState(decryptedState);
          if (hasChanged && typeof window.showToastNotification === 'function') {
            window.showToastNotification('✓ Daten mit Partner synchronisiert');
          }
        } catch (errInbound) {
          console.debug('[TACTUS E2EE] Inbound-Paket übersprungen:', errInbound);
        }
      };

      eventSourceInstance.onerror = () => {
        // EventSource versucht automatisch eine Wiederverbindung
      };

      localStorage.setItem(SYNC_STORAGE_KEYS.isPaired, 'true');
    } catch (e) {
      console.warn('[TACTUS E2EE] EventSource konnte nicht initialisiert werden:', e);
    }
  }

  function configureSyncCredentials({ room, password, server, role }) {
    if (!room || !password) return false;

    localStorage.setItem(SYNC_STORAGE_KEYS.room, String(room).trim());
    localStorage.setItem(SYNC_STORAGE_KEYS.password, String(password).trim());
    if (server) localStorage.setItem(SYNC_STORAGE_KEYS.server, String(server).trim().replace(/\/$/, ''));
    if (role) localStorage.setItem(SYNC_STORAGE_KEYS.assignedRole, role);

    localStorage.setItem(SYNC_STORAGE_KEYS.isPaired, 'true');

    initializeStreamListener();
    triggerSyncDebounced();

    if (typeof window.showToastNotification === 'function') {
      window.showToastNotification('✓ E2EE-Kopplung aktiv: Verschlüsselt mit AES-GCM-256');
    }

    return true;
  }

  function disconnectSync() {
    if (eventSourceInstance) {
      eventSourceInstance.close();
      eventSourceInstance = null;
    }
    localStorage.removeItem(SYNC_STORAGE_KEYS.room);
    localStorage.removeItem(SYNC_STORAGE_KEYS.password);
    localStorage.setItem(SYNC_STORAGE_KEYS.isPaired, 'false');

    if (typeof window.showToastNotification === 'function') {
      window.showToastNotification('E2EE-Synchronisation getrennt.');
    }
  }

  function getSyncConfig() {
    return {
      active: localStorage.getItem(SYNC_STORAGE_KEYS.isPaired) === 'true',
      room: localStorage.getItem(SYNC_STORAGE_KEYS.room) || '',
      password: localStorage.getItem(SYNC_STORAGE_KEYS.password) || '',
      server: localStorage.getItem(SYNC_STORAGE_KEYS.server) || DEFAULT_NTFY_SERVER,
      lastSyncTime: localStorage.getItem(SYNC_STORAGE_KEYS.lastSyncTime) || null
    };
  }

  const api = {
    init: initializeStreamListener,
    trigger: triggerSyncDebounced,
    forcePush: pushLocalStateToRemote,
    configure: configureSyncCredentials,
    disconnect: disconnectSync,
    getConfig: getSyncConfig,
    encrypt: encryptPayload,
    decrypt: decryptPayload,
    gatherState: gatherUnifiedLocalState
  };

  window.CloudSync = api;

  // Auto-Initialisierung beim Laden
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeStreamListener);
  } else {
    initializeStreamListener();
  }

})(window);
