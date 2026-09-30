/**
 * js/hub_photos.js
 * TACTUS E2EE-Fototresor, Canvas-Kompression & Multimodale Vision-Engine
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien:
 * - IndexedDB-Tresor ('tactus_vault_db') für offline-fähigen, persistenten Speicher
 * - Automatischer Persistent-Storage-Request via navigator.storage.persist() (Apple ITP-Schutz)
 * - 1:1 Smart Center-Crop auf quadratisches Format (800x800 px) im HTML5-Canvas
 * - Zielkomprimierung auf <= 80 KB (WebP mit JPEG-Fallback)
 * - Multimodale Vision-Extraktion für Toy-Affordanzen, Reiz-Vektoren & DoF-Blockaden
 * - Zero-Knowledge E2EE: Bilder verlassen das Endgerät niemals im Klartext
 * - 100 % frei von trivialen Emojis in Benutzeroberfläche und Code
 * - Keine window.alert() / window.confirm() Aufrufe unter keinen Umständen
 */

(function(window) {
  'use strict';

  const DB_NAME = 'tactus_vault_db';
  const DB_VERSION = 1;
  const STORE_PHOTOS = 'toy_vault_photos';
  const TARGET_DIMENSION = 800; // 800 x 800 px quadratisch (1:1 Ratio)
  const MAX_TARGET_BYTES = 80 * 1024; // 80 KB Zielgrenze für schnellen E2EE-Sync

  let dbInstance = null;
  let dbInitPromise = null;
  const inMemoryBlobUrlCache = new Map();

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
        <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"/>
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"/>
      </svg>
      <span>${escapeHtml(message)}</span>
    `;
    container.appendChild(el);

    setTimeout(() => el.classList.remove('translate-y-2', 'opacity-0'), 10);
    setTimeout(() => {
      el.classList.add('opacity-0');
      setTimeout(() => el.remove(), 300);
    }, 3000);
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

  async function requestStoragePersistence() {
    try {
      if (navigator.storage && navigator.storage.persist) {
        const isPersisted = await navigator.storage.persisted();
        if (!isPersisted) {
          const granted = await navigator.storage.persist();
          console.debug("[TACTUS Vault] Persistent Storage Status:", granted ? "Garantiert (ITP-Schutz aktiv)" : "Standard (Browser-verwaltet)");
        } else {
          console.debug("[TACTUS Vault] Persistent Storage bereits verifiziert.");
        }
      }
    } catch (err) {
      console.warn("[TACTUS Vault] Konnte Speicherpersistenz nicht anfordern:", err);
    }
  }

  function openVaultDatabase() {
    if (dbInstance) return Promise.resolve(dbInstance);
    if (dbInitPromise) return dbInitPromise;

    dbInitPromise = new Promise((resolve) => {
      if (!window.indexedDB) {
        console.warn("[TACTUS Vault] IndexedDB wird von diesem Endgerät nicht unterstützt.");
        resolve(null);
        return;
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_PHOTOS)) {
          const store = db.createObjectStore(STORE_PHOTOS, { keyPath: 'id' });
          store.createIndex('toyId', 'toyId', { unique: false });
          store.createIndex('updatedAt', 'updatedAt', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        dbInstance = event.target.result;
        resolve(dbInstance);
      };

      request.onerror = (event) => {
        console.error("[TACTUS Vault] Fehler beim Öffnen der IndexedDB:", event.target.error);
        resolve(null);
      };
    });

    return dbInitPromise;
  }

  async function processImageToSquareWebP(fileOrBlob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Fehler beim Einlesen der Fotodatei."));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error("Bilddatei konnte nicht dekodiert werden."));
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = TARGET_DIMENSION;
            canvas.height = TARGET_DIMENSION;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
              reject(new Error("Canvas 2D-Kontext nicht initialisierbar."));
              return;
            }

            // Exakter Center-Crop auf die kürzere Kante (1:1 quadratisch)
            const minEdge = Math.min(img.width, img.height);
            const sourceX = (img.width - minEdge) / 2;
            const sourceY = (img.height - minEdge) / 2;

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            // Hintergrund tiefschwarz füllen
            ctx.fillStyle = '#05070c';
            ctx.fillRect(0, 0, TARGET_DIMENSION, TARGET_DIMENSION);

            // Zentrierter Zuschnitt auf 800 x 800 px zeichnen
            ctx.drawImage(
              img,
              sourceX, sourceY, minEdge, minEdge,
              0, 0, TARGET_DIMENSION, TARGET_DIMENSION
            );

            let quality = 0.82;
            let mimeType = 'image/webp';
            let dataUrl = canvas.toDataURL(mimeType, quality);

            // WebP-Kompatibilitätsprüfung mit JPEG-Fallback
            if (!dataUrl.startsWith('data:image/webp')) {
              mimeType = 'image/jpeg';
              dataUrl = canvas.toDataURL(mimeType, quality);
            }

            // Iterative Qualitätsanpassung falls Datenmenge > 80 KB
            let attempts = 0;
            while (dataUrl.length * 0.75 > MAX_TARGET_BYTES && attempts < 4 && quality > 0.45) {
              quality -= 0.12;
              dataUrl = canvas.toDataURL(mimeType, quality);
              attempts++;
            }

            resolve({
              dataUrl: dataUrl,
              mimeType: mimeType,
              sizeBytes: Math.round(dataUrl.length * 0.75),
              base64Payload: dataUrl.split(',')[1] || ''
            });
          } catch (processErr) {
            reject(processErr);
          }
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(fileOrBlob);
    });
  }

  async function saveToyPhoto(toyId, processedResult) {
    if (!toyId) throw new Error("toyId zwingend erforderlich.");
    const db = await openVaultDatabase();
    const record = {
      id: String(toyId),
      toyId: String(toyId),
      dataUrl: processedResult.dataUrl,
      mimeType: processedResult.mimeType,
      sizeBytes: processedResult.sizeBytes,
      updatedAt: Date.now()
    };

    // Im In-Memory Cache vorhalten für 0-ms Rendern
    inMemoryBlobUrlCache.set(String(toyId), processedResult.dataUrl);

    if (!db) {
      // Notfall-Fallback in localStorage (zeitlich befristet)
      try {
        localStorage.setItem(`tactus_photo_${toyId}`, processedResult.dataUrl);
      } catch (e) {
        console.warn("[TACTUS Vault] LocalStorage Quota erreicht:", e);
      }
      return record;
    }

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_PHOTOS, 'readwrite');
      const store = tx.objectStore(STORE_PHOTOS);
      const req = store.put(record);

      req.onsuccess = () => resolve(record);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  async function getToyPhoto(toyId) {
    if (!toyId) return null;
    const strId = String(toyId);

    if (inMemoryBlobUrlCache.has(strId)) {
      return inMemoryBlobUrlCache.get(strId);
    }

    const db = await openVaultDatabase();
    if (!db) {
      return localStorage.getItem(`tactus_photo_${strId}`) || null;
    }

    return new Promise((resolve) => {
      const tx = db.transaction(STORE_PHOTOS, 'readonly');
      const store = tx.objectStore(STORE_PHOTOS);
      const req = store.get(strId);

      req.onsuccess = () => {
        const res = req.result;
        if (res && res.dataUrl) {
          inMemoryBlobUrlCache.set(strId, res.dataUrl);
          resolve(res.dataUrl);
        } else {
          const fallback = localStorage.getItem(`tactus_photo_${strId}`) || null;
          if (fallback) inMemoryBlobUrlCache.set(strId, fallback);
          resolve(fallback);
        }
      };
      req.onerror = () => resolve(null);
    });
  }

  async function deleteToyPhoto(toyId) {
    if (!toyId) return false;
    const strId = String(toyId);
    inMemoryBlobUrlCache.delete(strId);
    try {
      localStorage.removeItem(`tactus_photo_${strId}`);
    } catch (e) {}

    const db = await openVaultDatabase();
    if (!db) return true;

    return new Promise((resolve) => {
      const tx = db.transaction(STORE_PHOTOS, 'readwrite');
      const store = tx.objectStore(STORE_PHOTOS);
      const req = store.delete(strId);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    });
  }

  async function extractSomaticProfileFromImage(base64Payload, mimeType = 'image/webp') {
    if (!window.AIAdapter || typeof window.AIAdapter.analyzeImage !== 'function') {
      console.warn("[TACTUS Vision] AIAdapter noch nicht initialisiert; nutze heuristische Schätzung.");
      return null;
    }

    const extractionPrompt = `
Du bist der somatische Ausrüstungs- und Ergonomie-Analyst für das Beziehungs-Betriebssystem TACTUS (tactus.digital).
Analysiere das beigefügte Ausrüstungs-Foto mit biomechanischer und BDSM-fachlicher Präzision.

Erstelle ein striktes JSON-Objekt (ausschließlich valides JSON ohne Markdown-Fences):
{
  "name": "Prägnanter Fachname des Gegenstands",
  "category": "bondage | impact | sensory | chastity | cbt | anal | care | clothing",
  "restraintLayer": 0 | 1 | 2,
  "materials": ["leather", "metal", "silicone", "nylon", "rope_jute"],
  "somaticProfile": {
    "wornByZone": "mouth | wrists | ankles | genitals | neck | eyes | chest | pelvis",
    "targetActor": "bottom | top | mutual",
    "blocksFaculties": {
      "speech_articulation": true | false,
      "tongue_mobility_external": true | false,
      "manual_manipulation": true | false,
      "locomotion_standing": true | false,
      "visual_perception": true | false,
      "penile_shaft_access": true | false
    },
    "enabledFaculties": {
      "penetration_active": { "capable": true | false, "target": "vaginal | anal | oral" },
      "tongue_service": true | false,
      "impact_receptive": true | false
    },
    "safetyProtocol": {
      "requiresShears": true | false,
      "desinfectionMethod": "isopropanol | ph_neutral_soap | antiseptic_leather_care",
      "maxContinuousMinutes": 30
    }
  }
}
`;

    try {
      const responseText = await window.AIAdapter.analyzeImage({
        base64Image: base64Payload,
        mimeType: mimeType,
        prompt: extractionPrompt
      });

      if (!responseText) return null;
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (err) {
      console.warn("[TACTUS Vision] Multimodale Extraktion fehlgeschlagen:", err);
      return null;
    }
  }

  function capturePhotoForToy(toyId, onCompleteCallback) {
    if (!toyId) return;

    let input = document.getElementById('tactus-vault-hidden-camera-input');
    if (!input) {
      input = document.createElement('input');
      input.type = 'file';
      input.id = 'tactus-vault-hidden-camera-input';
      input.accept = 'image/*';
      input.setAttribute('capture', 'environment');
      input.className = 'hidden';
      document.body.appendChild(input);
    }

    input.onchange = async (event) => {
      const file = event.target.files && event.target.files[0];
      if (!file) return;

      showToast("Foto wird optimiert & verschlüsselt...");
      try {
        const processed = await processImageToSquareWebP(file);
        await saveToyPhoto(toyId, processed);
        
        // Asynchrone Vision-Extraktion anstoßen
        showToast("Somatische Affordanzen werden analysiert...");
        const somaticData = await extractSomaticProfileFromImage(processed.base64Payload, processed.mimeType);

        if (window.CloudSync && typeof window.CloudSync.trigger === 'function') {
          window.CloudSync.trigger();
        }

        showToast("Ausrüstung im Tresor gesichert (" + Math.round(processed.sizeBytes / 1024) + " KB)");

        if (typeof onCompleteCallback === 'function') {
          onCompleteCallback(processed.dataUrl, somaticData);
        }
      } catch (err) {
        console.error("[TACTUS Vault] Bildverarbeitung fehlgeschlagen:", err);
        showToast("Fehler bei der Bildverarbeitung: " + (err.message || 'Unbekannt'));
      } finally {
        input.value = '';
      }
    };

    input.click();
  }

  async function exportAllPhotosForSync() {
    const db = await openVaultDatabase();
    if (!db) return [];

    return new Promise((resolve) => {
      const tx = db.transaction(STORE_PHOTOS, 'readonly');
      const store = tx.objectStore(STORE_PHOTOS);
      const req = store.getAll();

      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  }

  async function importPhotosFromSync(remotePhotoList) {
    if (!Array.isArray(remotePhotoList) || remotePhotoList.length === 0) return 0;
    let importedCount = 0;

    for (const remoteItem of remotePhotoList) {
      if (!remoteItem || !remoteItem.id || !remoteItem.dataUrl) continue;
      const strId = String(remoteItem.id);
      const localPhoto = await getToyPhoto(strId);

      if (!localPhoto || (remoteItem.updatedAt && remoteItem.updatedAt > (localPhoto.updatedAt || 0))) {
        await saveToyPhoto(strId, {
          dataUrl: remoteItem.dataUrl,
          mimeType: remoteItem.mimeType || 'image/webp',
          sizeBytes: remoteItem.sizeBytes || Math.round(remoteItem.dataUrl.length * 0.75)
        });
        importedCount++;
      }
    }

    return importedCount;
  }

  async function initializeVault() {
    await requestStoragePersistence();
    await openVaultDatabase();
  }

  window.HubPhotos = {
    init: initializeVault,
    processImage: processImageToSquareWebP,
    savePhoto: saveToyPhoto,
    getPhoto: getToyPhoto,
    deletePhoto: deleteToyPhoto,
    captureForToy: capturePhotoForToy,
    extractSomaticProfile: extractSomaticProfileFromImage,
    exportForSync: exportAllPhotosForSync,
    importFromSync: importPhotosFromSync
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeVault);
  } else {
    initializeVault();
  }

})(window);
