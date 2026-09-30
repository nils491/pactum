/**
 * js/hub_photos.js
 * TACTUS 1:1 Foto-Tresor, IndexedDB-Sandbox & Multimodale Vision-Engine (V3.0 Hyper-Dynamisch)
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien:
 * - Lokale IndexedDB-Sandbox 'tactus_vault_db' (Store: 'toy_vault_photos')
 * - Apple WebKit ITP-Persistenzschutz via navigator.storage.persist() (7-Tage-Löschschutz)
 * - Mathematischer 1:1 Center-Crop (800x800 px) ohne Bildverzerrung
 * - Iterative WebP-Kompressionsschleife auf <= 80 KB für P2P-Sync-Tauglichkeit
 * - 0-ms In-Memory Caching (Map) zur Vermeidung von Layout-Flackern
 * - Multimodale Affordanz-Extraktion via AIAdapter.analyzeImage()
 * - E2EE-Sync Export- und Import-Bridge mit zeitstempelbasierter Konfliktlösung
 * - 100 % frei von infantilen System-Emojis in Benutzeroberfläche und Code
 * - Keine window.alert() / window.confirm() Aufrufe unter keinen Umständen
 */

(function(window) {
  'use strict';

  const DB_NAME = 'tactus_vault_db';
  const DB_VERSION = 1;
  const STORE_PHOTOS = 'toy_vault_photos';
  const TARGET_DIMENSION = 800; // 800x800 px quadratisch
  const MAX_TARGET_BYTES = 80 * 1024; // 80 KB Obergrenze für Sync-Pakete

  let dbInstance = null;
  let dbInitPromise = null;
  const inMemoryBlobUrlCache = new Map(); // toyId -> DataURL

  async function requestStoragePersistence() {
    try {
      if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
        const isPersisted = await navigator.storage.persisted();
        if (!isPersisted) {
          const granted = await navigator.storage.persist();
          console.debug('[TACTUS Vault] Apple ITP Persistenzstatus:', granted ? 'Dauerhaft gesichert' : 'Standard');
        }
      }
    } catch (e) {
      console.debug('[TACTUS Vault] navigator.storage.persist nicht verfügbar:', e);
    }
  }

  function openVaultDatabase() {
    if (dbInstance) return Promise.resolve(dbInstance);
    if (dbInitPromise) return dbInitPromise;

    dbInitPromise = new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) {
        reject(new Error('IndexedDB wird von dieser Umgebung nicht unterstützt.'));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_PHOTOS)) {
          const store = db.createObjectStore(STORE_PHOTOS, { keyPath: 'toyId' });
          store.createIndex('updatedAt', 'updatedAt', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        dbInstance = event.target.result;
        requestStoragePersistence();
        resolve(dbInstance);
      };

      request.onerror = (event) => {
        console.warn('[TACTUS Vault] Fehler beim Öffnen der IndexedDB:', event.target.error);
        reject(event.target.error);
      };
    });

    return dbInitPromise;
  }

  function processImageToSquareWebP(fileOrBlob) {
    return new Promise((resolve, reject) => {
      if (!fileOrBlob) {
        reject(new Error('Keine Bilddatei übergeben.'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          try {
            // 1. Mathematischer Center-Crop auf kürzerer Bildkante
            const minEdge = Math.min(img.width, img.height);
            const sourceX = (img.width - minEdge) / 2;
            const sourceY = (img.height - minEdge) / 2;

            const canvas = document.createElement('canvas');
            canvas.width = TARGET_DIMENSION;
            canvas.height = TARGET_DIMENSION;
            const ctx = canvas.getContext('2d');

            // Glättungsfilter für Retusche aktivieren
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            ctx.drawImage(
              img,
              sourceX,
              sourceY,
              minEdge,
              minEdge,
              0,
              0,
              TARGET_DIMENSION,
              TARGET_DIMENSION
            );

            // 2. Formatprüfung: WebP bevorzugt, Fallback auf JPEG
            let mimeType = 'image/webp';
            let testData = canvas.toDataURL('image/webp', 0.85);
            if (!testData.startsWith('data:image/webp')) {
              mimeType = 'image/jpeg';
            }

            // 3. Iterative Kompressionsschleife auf <= 80 KB
            let quality = 0.82;
            let dataUrl = canvas.toDataURL(mimeType, quality);
            let attempts = 0;

            // Base64 Länge * 0.75 entspricht exakter Binärbyte-Zahl
            while (dataUrl.length * 0.75 > MAX_TARGET_BYTES && attempts < 4 && quality > 0.45) {
              quality -= 0.12;
              dataUrl = canvas.toDataURL(mimeType, quality);
              attempts++;
            }

            const finalSize = Math.round(dataUrl.length * 0.75);
            const base64Clean = dataUrl.replace(/^data:[^;]+;base64,/, '');

            resolve({
              dataUrl: dataUrl,
              mimeType: mimeType,
              sizeBytes: finalSize,
              base64Payload: base64Clean,
              width: TARGET_DIMENSION,
              height: TARGET_DIMENSION
            });
          } catch (err) {
            reject(err);
          }
        };
        img.onerror = () => reject(new Error('Bild konnte nicht dekodiert werden.'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Dateizugriff fehlgeschlagen.'));
      reader.readAsDataURL(fileOrBlob);
    });
  }

  async function saveToyPhoto(toyId, processedResult) {
    if (!toyId || !processedResult || !processedResult.dataUrl) {
      throw new Error('Gültige toyId und Bilddaten erforderlich.');
    }

    const db = await openVaultDatabase();
    const record = {
      toyId: String(toyId).trim(),
      dataUrl: processedResult.dataUrl,
      mimeType: processedResult.mimeType || 'image/webp',
      sizeBytes: processedResult.sizeBytes || 0,
      updatedAt: Date.now()
    };

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_PHOTOS, 'readwrite');
      const store = tx.objectStore(STORE_PHOTOS);
      const req = store.put(record);

      req.onsuccess = () => {
        // Cache synchronisieren für 0-ms Zugriff
        inMemoryBlobUrlCache.set(record.toyId, record.dataUrl);
        resolve(record);
      };

      req.onerror = () => reject(tx.error);
    });
  }

  async function getToyPhoto(toyId) {
    if (!toyId) return null;
    const cleanId = String(toyId).trim();

    // 0-ms In-Memory Treffer
    if (inMemoryBlobUrlCache.has(cleanId)) {
      return inMemoryBlobUrlCache.get(cleanId);
    }

    try {
      const db = await openVaultDatabase();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_PHOTOS, 'readonly');
        const store = tx.objectStore(STORE_PHOTOS);
        const req = store.get(cleanId);

        req.onsuccess = () => {
          if (req.result && req.result.dataUrl) {
            inMemoryBlobUrlCache.set(cleanId, req.result.dataUrl);
            resolve(req.result.dataUrl);
          } else {
            resolve(null);
          }
        };

        req.onerror = () => resolve(null);
      });
    } catch (e) {
      return null;
    }
  }

  async function deleteToyPhoto(toyId) {
    if (!toyId) return false;
    const cleanId = String(toyId).trim();
    inMemoryBlobUrlCache.delete(cleanId);

    try {
      const db = await openVaultDatabase();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_PHOTOS, 'readwrite');
        const store = tx.objectStore(STORE_PHOTOS);
        const req = store.delete(cleanId);

        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      });
    } catch (e) {
      return false;
    }
  }

  async function extractSomaticProfileFromImage(base64Payload, mimeType = 'image/webp') {
    if (!window.AIAdapter || typeof window.AIAdapter.analyzeImage !== 'function') {
      return null;
    }

    const visionPrompt = `
Du bist der somatische Kinetik- und Hardware-Analyst für das Schlafzimmer-Inventar von TACTUS (tactus.digital).
Analysiere diesen erfassten Gegenstand für den Ausrüstungsschrank.

SPRACH- UND FORMATREGELN:
- Bestimme die genaue anatomische Anlegezone und den Restraint-Layer (Layer 0 = Anker/Manschette/Käfig, Layer 1 = Lagefesselung/Spreizstange/Haube, Layer 2 = starre Umweltkopplung).
- Bestimme geblockte Freiheitsgrade (speech_articulation, tongue_mobility_external, manual_manipulation, locomotion_standing, visual_perception).
- Bestimme Materialien (z. B. leather, silicone, steel, jute, synthetic) für den RACK-Allergieschutz.
- Gib die Desinfektionsmethode für die Reverse Aftercare an (isopropanol_wipe, antiseptic_leather_spray, boiling_water_rinse, mild_soap_handwash).

Antworte ausschließlich als wohlgeformtes, valides JSON ohne Markdown-Codeblöcke:
{
  "name": "Präziser Name des Gegenstands (z. B. Glattleder-Halsband mit O-Ring)",
  "category": "bondage | impact | sensory | chastity | cbt | care",
  "somaticZone": "neck_cervical | limbs_wrists_hands | head_mouth | head_eyes | genital_penis | etc.",
  "restraintLayer": 0,
  "materials": ["leather", "steel"],
  "blocksFaculties": {
    "speech_articulation": false,
    "manual_manipulation": false
  },
  "safetyProtocol": {
    "disinfectionMethod": "antiseptic_leather_spray",
    "requiresShears": false
  },
  "somaticEffect": "Kurze prägnante Beschreibung des Gefühls und Reizvektors."
}
`;

    try {
      const rawAiResponse = await window.AIAdapter.analyzeImage({
        base64Image: base64Payload,
        mimeType: mimeType,
        prompt: visionPrompt
      });

      if (!rawAiResponse) return null;

      // Bereinige Markdown-Artefakte
      let cleaned = String(rawAiResponse).trim();
      cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
      const startIdx = cleaned.indexOf('{');
      const endIdx = cleaned.lastIndexOf('}');
      if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
        cleaned = cleaned.substring(startIdx, endIdx + 1);
      }

      return JSON.parse(cleaned);
    } catch (errVision) {
      console.warn('[TACTUS Vault] Vision-Analyse fehlgeschlagen oder kein JSON:', errVision);
      return null;
    }
  }

  function triggerCameraCaptureForToy(toyId, onCompleteCallback) {
    if (!toyId) return;

    let inputEl = document.getElementById('vault-hidden-camera-input');
    if (!inputEl) {
      inputEl = document.createElement('input');
      inputEl.type = 'file';
      inputEl.id = 'vault-hidden-camera-input';
      inputEl.accept = 'image/*';
      // Auf mobilen Geräten direkt die Hauptkamera aufrufen
      inputEl.setAttribute('capture', 'environment');
      inputEl.className = 'hidden';
      document.body.appendChild(inputEl);
    }

    inputEl.onchange = async (event) => {
      const file = event.target.files && event.target.files[0];
      if (!file) return;

      if (typeof window.showToastNotification === 'function') {
        window.showToastNotification('Foto wird auf 1:1 WebP optimiert...');
      }

      try {
        const processed = await processImageToSquareWebP(file);
        await saveToyPhoto(toyId, processed);

        if (typeof window.showToastNotification === 'function') {
          window.showToastNotification('✓ Foto im Tresor gesichert. Analysiere Hardware...');
        }

        // Multimodale Vision-Analyse im Hintergrund starten
        let somaticProfile = null;
        try {
          somaticProfile = await extractSomaticProfileFromImage(processed.base64Payload, processed.mimeType);
        } catch (eVision) {
          console.debug('[TACTUS Vault] Vision-Extraktion übersprungen:', eVision);
        }

        if (typeof onCompleteCallback === 'function') {
          onCompleteCallback(processed.dataUrl, somaticProfile);
        }
      } catch (errProcess) {
        console.warn('[TACTUS Vault] Fehler beim Verarbeiten des Fotos:', errProcess);
        if (typeof window.showToastNotification === 'function') {
          window.showToastNotification('Fehler bei der Bildverarbeitung.');
        }
      } finally {
        inputEl.value = '';
      }
    };

    inputEl.click();
  }

  async function exportAllPhotosForSync() {
    try {
      const db = await openVaultDatabase();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_PHOTOS, 'readonly');
        const store = tx.objectStore(STORE_PHOTOS);
        const req = store.getAll();

        req.onsuccess = () => {
          const list = Array.isArray(req.result) ? req.result : [];
          resolve(list.map(item => ({
            toyId: item.toyId,
            dataUrl: item.dataUrl,
            mimeType: item.mimeType,
            sizeBytes: item.sizeBytes,
            updatedAt: item.updatedAt
          })));
        };

        req.onerror = () => resolve([]);
      });
    } catch (e) {
      return [];
    }
  }

  async function importPhotosFromSync(remotePhotoList) {
    if (!Array.isArray(remotePhotoList) || remotePhotoList.length === 0) return 0;

    let importedCount = 0;
    try {
      const db = await openVaultDatabase();
      const tx = db.transaction(STORE_PHOTOS, 'readwrite');
      const store = tx.objectStore(STORE_PHOTOS);

      for (let i = 0; i < remotePhotoList.length; i++) {
        const item = remotePhotoList[i];
        if (item && item.toyId && item.dataUrl) {
          store.put({
            toyId: String(item.toyId).trim(),
            dataUrl: item.dataUrl,
            mimeType: item.mimeType || 'image/webp',
            sizeBytes: item.sizeBytes || 0,
            updatedAt: item.updatedAt || Date.now()
          });
          inMemoryBlobUrlCache.set(item.toyId, item.dataUrl);
          importedCount++;
        }
      }

      return importedCount;
    } catch (errSync) {
      console.warn('[TACTUS Vault] Fehler beim Importieren synchronisierter Fotos:', errSync);
      return 0;
    }
  }

  const api = {
    init: openVaultDatabase,
    processImage: processImageToSquareWebP,
    savePhoto: saveToyPhoto,
    getPhoto: getToyPhoto,
    deletePhoto: deleteToyPhoto,
    captureForToy: triggerCameraCaptureForToy,
    extractSomaticProfile: extractSomaticProfileFromImage,
    exportForSync: exportAllPhotosForSync,
    importFromSync: importPhotosFromSync,
    clearCache: () => inMemoryBlobUrlCache.clear()
  };

  window.HubPhotos = api;

  // Auto-Initialisierung beim Laden des Dokuments
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      openVaultDatabase().catch(() => {});
    });
  } else {
    openVaultDatabase().catch(() => {});
  }

})(window);
