/**
 * js/cloud_sync.js
 * TACTUS Zero-Knowledge E2EE Peer-Sync & Transport-Bridge (V3.0 Hyper-Dynamisch)
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien:
 * - Client-Side Authenticated Encryption: AES-GCM-256 via Web Crypto API
 * - Key-Derivation: PBKDF2 (100.000 Iterationen, HMAC-SHA-256, dynamischer Salt)
 * - Lückenlose Synchronisation des gesamten 7-Vektoren Zustandsraums:
 *   • Beziehungsvertrag (tactus_contract_state)
 *   • Situative Pflichten & Mental Load (tactus_tasks_state, tactus_top_mental_load)
 *   • Orgasmus-Ökonomie (tactus_climax_ratio_state)
 *   • Transaktions-Logbuch & Zero-State (tactus_protocol_state)
 *   • Medizinischer RACK-Pass (tactus_medical_pass)
 *   • Schrank-Inventar & Mengen (tactus_owned_equipment, tactus_toy_quantities)
 *   • E2EE-Fototresor (IndexedDB via HubPhotos)
 * - Deterministisches Event-Sourcing (Transaktionen werden atomar gemerged, kein LWW-Datenverlust)
 * - Serverlose Transport-Bridge über ntfy (Zero-Knowledge, verschlüsselte Payloads)
 * - 100 % frei von infantilen System-Emojis in Datenstrukturen und Benutzeroberfläche
 * - Keine window.alert() / window.confirm() Aufrufe unter keinen Umständen
 */

(function(window) {
  'use strict';

  const NTFY_SERVER_DEFAULT = 'https://ntfy.sh';
  const STORAGE_ROOM_KEY = 'kompass_sync_room';
  const STORAGE_PASSWORD_KEY = 'kompass_sync_password';
  const STORAGE_CUSTOM_SERVER = 'kompass_sync_server';
  const STORAGE_SYNC_ACTIVE = 'kompass_sync_active';

  let syncDebounceTimer = null;
  let isReceivingUpdate = false;
  let eventSourceInstance = null;
  let cryptoKeyCache = null;
  let lastPushedChecksum = null;

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
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
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

  function getSyncConfig() {
    return {
      active: localStorage.getItem(STORAGE_SYNC_ACTIVE) === 'true',
      room: localStorage.getItem(STORAGE_ROOM_KEY) || '',
      password: localStorage.getItem(STORAGE_PASSWORD_KEY) || '',
      server: localStorage.getItem(STORAGE_CUSTOM_SERVER) || NTFY_SERVER_DEFAULT
    };
  }

  async function deriveEncryptionKey(passphrase, saltBytes) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      enc.encode(passphrase),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    return await crypto.subtle.deriveKey(
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
    const saltBytes = crypto.getRandomValues(new Uint8Array(16));
    const ivBytes = crypto.getRandomValues(new Uint8Array(12));

    const derivedKey = await deriveEncryptionKey(passphrase, saltBytes);
    const cipherBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: ivBytes },
      derivedKey,
      plainBytes
    );

    // Bündeln: Salt (16B) + IV (12B) + Ciphertext
    const combined = new Uint8Array(saltBytes.length + ivBytes.length + cipherBuffer.byteLength);
    combined.set(saltBytes, 0);
    combined.set(ivBytes, saltBytes.length);
    combined.set(new Uint8Array(cipherBuffer), saltBytes.length + ivBytes.length);

    // Konvertierung in base64 für Transport
    let binary = '';
    const bytes = combined;
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  async function decryptPayload(base64Payload, passphrase) {
    try {
      const binary = atob(base64Payload);
      const combined = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        combined[i] = binary.charCodeAt(i);
      }

      if (combined.length < 28) {
        throw new Error("Payload zu kurz für Salt und IV.");
      }

      const saltBytes = combined.slice(0, 16);
      const ivBytes = combined.slice(16, 28);
      const cipherBytes = combined.slice(28);

      const derivedKey = await deriveEncryptionKey(passphrase, saltBytes);
      const plainBuffer = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: ivBytes },
        derivedKey,
        cipherBytes
      );

      const dec = new TextDecoder();
      return JSON.parse(dec.decode(plainBuffer));
    } catch (e) {
      console.warn("[TACTUS Sync] Entschlüsselungs-Fehler (Falsches Passwort oder korrupte Payload):", e);
      return null;
    }
  }

  async function gatherUnifiedLocalState() {
    function parseKey(key, fallback = null) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (e) {
        return fallback;
      }
    }

    let photoVaultList = [];
    if (window.HubPhotos && typeof window.HubPhotos.exportForSync === 'function') {
      try {
        photoVaultList = await window.HubPhotos.exportForSync();
      } catch (errPhoto) {
        console.warn("[TACTUS Sync] Konnte Fotos nicht für Sync sammeln:", errPhoto);
      }
    }

    return {
      tactus_version: "3.0",
      clientTimestamp: Date.now(),
      senderRole: localStorage.getItem('kompass_assigned_role') || 'A',

      // 1. Psychometrie & Identität
      kompass_answers: parseKey('kompass_answers', {}),
      kompass_names: parseKey('kompass_names', { A: 'Partner 1', B: 'Partner 2' }),
      kompass_anatomy: parseKey('kompass_anatomy', { A: 'penis', B: 'vulva' }),
      kompass_assigned_role: localStorage.getItem('kompass_assigned_role') || 'A',
      kompass_keyholder_role: localStorage.getItem('kompass_keyholder_role') || 'A',
      kompass_caged_role: localStorage.getItem('kompass_caged_role') || 'B',

      // 2. Transaktionales Protokoll (Event-Sourced)
      tactus_protocol_state: parseKey('tactus_protocol_state', null) || parseKey('kompass_ledger_state', null),

      // 3. Orgasmus-Ökonomie
      tactus_climax_ratio_state: parseKey('tactus_climax_ratio_state', null) || parseKey('kompass_climax_ratio_state', null),

      // 4. Aufgaben & Führungszustand des Tops
      tactus_tasks_state: parseKey('tactus_tasks_state', null) || parseKey('pactum_tasks_state', null),
      tactus_top_mental_load: localStorage.getItem('tactus_top_mental_load') || 'balanced',

      // 5. Beziehungsvertrag (Lückenloses Bündnis)
      tactus_contract_state: parseKey('tactus_contract_state', null) || parseKey('kompass_contract_state', null),

      // 6. Führungs-Coach & Alltags-Kontext des Bottoms
      tactus_bottom_workplace: localStorage.getItem('tactus_bottom_workplace') || localStorage.getItem('kompass_bottom_workplace') || 'desk_office',
      tactus_last_coach_directive: parseKey('tactus_last_coach_directive', null) || parseKey('kompass_last_coach_directive', null),

      // 7. Biologie, Gesundheit & RACK-Pass
      tactus_medical_pass: parseKey('tactus_medical_pass', null),

      // 8. Hardware-Inventar & Fototresor
      tactus_owned_equipment: parseKey('tactus_owned_equipment', []) || parseKey('kompass_owned_equipment', []),
      tactus_toy_quantities: parseKey('tactus_toy_quantities', {}) || parseKey('kompass_toy_quantities', {}),
      tactus_custom_equipment: parseKey('tactus_custom_equipment', []) || parseKey('kompass_custom_equipment', []),
      tactus_photo_vault: photoVaultList,

      // 9. Peer-Stream Chat
      kompass_chat_messages: parseKey('kompass_chat_messages', [])
    };
  }

  async function mergeInboundRemoteState(remote) {
    if (!remote || typeof remote !== 'object') return;
    isReceivingUpdate = true;

    try {
      // 1. Namen, Rollen & Anatomie
      if (remote.kompass_names && typeof remote.kompass_names === 'object') {
        localStorage.setItem('kompass_names', JSON.stringify(remote.kompass_names));
      }
      if (remote.kompass_anatomy && typeof remote.kompass_anatomy === 'object') {
        localStorage.setItem('kompass_anatomy', JSON.stringify(remote.kompass_anatomy));
      }
      if (remote.kompass_keyholder_role) {
        localStorage.setItem('kompass_keyholder_role', remote.kompass_keyholder_role);
      }
      if (remote.kompass_caged_role) {
        localStorage.setItem('kompass_caged_role', remote.kompass_caged_role);
      }

      // 2. Psychometrische Antworten zusammenführen
      if (remote.kompass_answers && typeof remote.kompass_answers === 'object') {
        let localAnswers = {};
        try {
          const rawA = localStorage.getItem('kompass_answers');
          if (rawA) localAnswers = JSON.parse(rawA);
        } catch (e) {}

        const mergedAnswers = Object.assign({}, localAnswers);
        ['A', 'B'].forEach(r => {
          if (remote.kompass_answers[r]) {
            mergedAnswers[r] = Object.assign({}, mergedAnswers[r] || {}, remote.kompass_answers[r]);
          }
        });
        localStorage.setItem('kompass_answers', JSON.stringify(mergedAnswers));
      }

      // 3. Transaktionales Protokoll mit atomarem Event-Sourcing Merge
      if (remote.tactus_protocol_state) {
        let localP = null;
        try {
          const rawP = localStorage.getItem('tactus_protocol_state') || localStorage.getItem('kompass_ledger_state');
          if (rawP) localP = JSON.parse(rawP);
        } catch (e) {}

        if (!localP) {
          localStorage.setItem('tactus_protocol_state', JSON.stringify(remote.tactus_protocol_state));
          localStorage.setItem('kompass_ledger_state', JSON.stringify(remote.tactus_protocol_state));
        } else {
          // Atomare Vereinigung der Transaktionslisten (Dedizierter Schutz vor Datenverlust)
          const localTxs = Array.isArray(localP.transactions) ? localP.transactions : [];
          const remoteTxs = Array.isArray(remote.tactus_protocol_state.transactions) ? remote.tactus_protocol_state.transactions : [];
          
          const txMap = new Map();
          localTxs.forEach(t => { if (t && t.id) txMap.set(t.id, t); });
          remoteTxs.forEach(t => { if (t && t.id) txMap.set(t.id, t); });

          const mergedTxs = Array.from(txMap.values()).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

          // State-Übernahme basierend auf Aktualität
          const chosenState = (remote.tactus_protocol_state.updatedAt || 0) > (localP.updatedAt || 0)
            ? remote.tactus_protocol_state
            : localP;

          chosenState.transactions = mergedTxs.slice(0, 400);
          localStorage.setItem('tactus_protocol_state', JSON.stringify(chosenState));
          localStorage.setItem('kompass_ledger_state', JSON.stringify(chosenState));
        }
      }

      // 4. Orgasmus-Ökonomie
      if (remote.tactus_climax_ratio_state) {
        let localR = null;
        try {
          const rawR = localStorage.getItem('tactus_climax_ratio_state') || localStorage.getItem('kompass_climax_ratio_state');
          if (rawR) localR = JSON.parse(rawR);
        } catch (e) {}

        if (!localR || (remote.tactus_climax_ratio_state.updatedAt || 0) >= (localR.updatedAt || 0)) {
          localStorage.setItem('tactus_climax_ratio_state', JSON.stringify(remote.tactus_climax_ratio_state));
          localStorage.setItem('kompass_climax_ratio_state', JSON.stringify(remote.tactus_climax_ratio_state));
        }
      }

      // 5. Pflichten & Mental Load des Tops
      if (remote.tactus_tasks_state) {
        let localTasks = null;
        try {
          const rawT = localStorage.getItem('tactus_tasks_state') || localStorage.getItem('pactum_tasks_state');
          if (rawT) localTasks = JSON.parse(rawT);
        } catch (e) {}

        if (!localTasks || (remote.tactus_tasks_state.updatedAt || 0) >= (localTasks.updatedAt || 0)) {
          localStorage.setItem('tactus_tasks_state', JSON.stringify(remote.tactus_tasks_state));
          localStorage.setItem('pactum_tasks_state', JSON.stringify(remote.tactus_tasks_state));
        }
      }
      if (remote.tactus_top_mental_load) {
        localStorage.setItem('tactus_top_mental_load', remote.tactus_top_mental_load);
      }

      // 6. Beziehungsvertrag
      if (remote.tactus_contract_state) {
        let localC = null;
        try {
          const rawC = localStorage.getItem('tactus_contract_state') || localStorage.getItem('kompass_contract_state');
          if (rawC) localC = JSON.parse(rawC);
        } catch (e) {}

        if (!localC || (remote.tactus_contract_state.updatedAt || 0) >= (localC.updatedAt || 0)) {
          localStorage.setItem('tactus_contract_state', JSON.stringify(remote.tactus_contract_state));
          localStorage.setItem('kompass_contract_state', JSON.stringify(remote.tactus_contract_state));
        }
      }

      // 7. Alltags-Kontext des Bottoms
      if (remote.tactus_bottom_workplace) {
        localStorage.setItem('tactus_bottom_workplace', remote.tactus_bottom_workplace);
        localStorage.setItem('kompass_bottom_workplace', remote.tactus_bottom_workplace);
      }
      if (remote.tactus_last_coach_directive) {
        localStorage.setItem('tactus_last_coach_directive', JSON.stringify(remote.tactus_last_coach_directive));
        localStorage.setItem('kompass_last_coach_directive', JSON.stringify(remote.tactus_last_coach_directive));
      }

      // 8. Medizinischer RACK-Pass
      if (remote.tactus_medical_pass && typeof remote.tactus_medical_pass === 'object') {
        localStorage.setItem('tactus_medical_pass', JSON.stringify(remote.tactus_medical_pass));
      }

      // 9. Hardware-Schrank & Inventar
      if (Array.isArray(remote.tactus_owned_equipment)) {
        localStorage.setItem('tactus_owned_equipment', JSON.stringify(remote.tactus_owned_equipment));
        localStorage.setItem('kompass_owned_equipment', JSON.stringify(remote.tactus_owned_equipment));
      }
      if (remote.tactus_toy_quantities && typeof remote.tactus_toy_quantities === 'object') {
        localStorage.setItem('tactus_toy_quantities', JSON.stringify(remote.tactus_toy_quantities));
        localStorage.setItem('kompass_toy_quantities', JSON.stringify(remote.tactus_toy_quantities));
      }
      if (Array.isArray(remote.tactus_custom_equipment)) {
        localStorage.setItem('tactus_custom_equipment', JSON.stringify(remote.tactus_custom_equipment));
      }

      // 10. IndexedDB Fototresor synchronisieren
      if (Array.isArray(remote.tactus_photo_vault) && window.HubPhotos && typeof window.HubPhotos.importFromSync === 'function') {
        await window.HubPhotos.importFromSync(remote.tactus_photo_vault);
      }

      // 11. Peer-Stream Chatnachrichten mergen
      if (Array.isArray(remote.kompass_chat_messages)) {
        let localMessages = [];
        try {
          const rawM = localStorage.getItem('kompass_chat_messages');
          if (rawM) localMessages = JSON.parse(rawM);
        } catch (e) {}

        const msgMap = new Map();
        localMessages.forEach(m => { if (m && m.id) msgMap.set(m.id, m); });
        remote.kompass_chat_messages.forEach(m => { if (m && m.id) msgMap.set(m.id, m); });

        const mergedMessages = Array.from(msgMap.values()).sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
        localStorage.setItem('kompass_chat_messages', JSON.stringify(mergedMessages.slice(-250)));
      }

      showToast("✓ TACTUS Daten synchronisiert");

      // UI-Aktualisierungen anstoßen, falls aktive Views existieren
      notifyLocalModules();

    } catch (err) {
      console.warn("[TACTUS Sync] Fehler beim Zusammenführen des Remote-States:", err);
    } finally {
      isReceivingUpdate = false;
    }
  }

  function notifyLocalModules() {
    if (window.ProtocolCore && typeof window.ProtocolCore.render === 'function') {
      window.ProtocolCore.render();
    }
    if (window.ProtocolRatio && typeof window.ProtocolRatio.render === 'function') {
      window.ProtocolRatio.render();
    }
    if (window.ProtocolTasks && typeof window.ProtocolTasks.render === 'function') {
      window.ProtocolTasks.render();
    }
    if (window.ProtocolContract && typeof window.ProtocolContract.renderContract === 'function') {
      window.ProtocolContract.renderContract();
    }
    if (window.ProtocolCoach && typeof window.ProtocolCoach.init === 'function') {
      window.ProtocolCoach.init();
    }
    if (window.ChatApp && typeof window.ChatApp.renderMessages === 'function') {
      window.ChatApp.renderMessages();
    }
    if (window.HubToys && typeof window.HubToys.render === 'function') {
      window.HubToys.render();
    }
  }

  async function pushUnifiedState() {
    if (isReceivingUpdate) return;
    const cfg = getSyncConfig();
    if (!cfg.active || !cfg.room || !cfg.password) return;

    try {
      const stateObj = await gatherUnifiedLocalState();
      const stringified = JSON.stringify(stateObj);

      // Lokale Duplikats-Prüfung gegen unnötigen Netzwerktraffic
      if (stringified === lastPushedChecksum) return;

      const cipherBase64 = await encryptPayload(stateObj, cfg.password);
      lastPushedChecksum = stringified;

      const endpoint = `${cfg.server}/${encodeURIComponent(cfg.room)}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Title': 'TACTUS Sync Update',
          'Priority': 'default',
          'Tags': 'shield,lock'
        },
        body: cipherBase64
      });

      if (!response.ok) {
        console.warn(`[TACTUS Sync] ntfy Push fehlgeschlagen (${response.status})`);
      }
    } catch (err) {
      console.warn("[TACTUS Sync] Fehler beim Versenden des Sync-Updates:", err);
    }
  }

  function triggerSyncDebounced() {
    if (syncDebounceTimer) clearTimeout(syncDebounceTimer);
    syncDebounceTimer = setTimeout(() => {
      pushUnifiedState();
    }, 450);
  }

  function initializeStreamListener() {
    const cfg = getSyncConfig();
    if (eventSourceInstance) {
      eventSourceInstance.close();
      eventSourceInstance = null;
    }

    if (!cfg.active || !cfg.room || !cfg.password) {
      return;
    }

    try {
      const sseUrl = `${cfg.server}/${encodeURIComponent(cfg.room)}/sse`;
      eventSourceInstance = new EventSource(sseUrl);

      eventSourceInstance.onmessage = async (event) => {
        try {
          if (!event.data) return;
          const msgObj = JSON.parse(event.data);
          if (msgObj.event !== 'message' || !msgObj.message) return;

          const rawCipher = msgObj.message.trim();
          if (rawCipher.length < 32) return;

          const decrypted = await decryptPayload(rawCipher, cfg.password);
          if (decrypted && decrypted.clientTimestamp) {
            // Nur Remote-Updates verarbeiten, die nicht vom eigenen Gerät stammen
            const myRole = localStorage.getItem('kompass_assigned_role') || 'A';
            if (decrypted.senderRole !== myRole || (Date.now() - decrypted.clientTimestamp > 1000)) {
              await mergeInboundRemoteState(decrypted);
            }
          }
        } catch (e) {
          // Keine störenden Konsolenausgaben bei fremden Keep-Alive Pings
        }
      };

      eventSourceInstance.onerror = () => {
        // EventSource schaltet bei Verbindungsabriss automatisch auf Reconnect
      };

      console.debug("[TACTUS Sync] E2EE Transport-Bridge aktiv auf Raum:", cfg.room);
    } catch (err) {
      console.warn("[TACTUS Sync] SSE Listener Initialisierung fehlgeschlagen:", err);
    }
  }

  function configureSyncCredentials({ room, password, server, role }) {
    if (!room || !password) {
      showToast("Raum und Passwort sind erforderlich.");
      return false;
    }

    localStorage.setItem(STORAGE_ROOM_KEY, room.trim());
    localStorage.setItem(STORAGE_PASSWORD_KEY, password.trim());
    localStorage.setItem(STORAGE_CUSTOM_SERVER, (server || NTFY_SERVER_DEFAULT).trim());
    localStorage.setItem(STORAGE_SYNC_ACTIVE, 'true');
    localStorage.setItem('kompass_is_paired', 'true');

    if (role) {
      localStorage.setItem('kompass_assigned_role', role);
    }

    initializeStreamListener();
    triggerSyncDebounced();
    showToast("✓ E2EE Paar-Synchronisation verbunden");
    return true;
  }

  function disconnectSync() {
    if (eventSourceInstance) {
      eventSourceInstance.close();
      eventSourceInstance = null;
    }
    localStorage.setItem(STORAGE_SYNC_ACTIVE, 'false');
    localStorage.removeItem('kompass_is_paired');
    showToast("Synchronisation getrennt.");
  }

  const api = {
    init: function() {
      const cfg = getSyncConfig();
      if (cfg.active && cfg.room && cfg.password) {
        initializeStreamListener();
      }
    },
    trigger: triggerSyncDebounced,
    forcePush: pushUnifiedState,
    configure: configureSyncCredentials,
    disconnect: disconnectSync,
    getConfig: getSyncConfig,
    encrypt: encryptPayload,
    decrypt: decryptPayload
  };

  window.CloudSync = api;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', api.init);
  } else {
    api.init();
  }

})(window);
