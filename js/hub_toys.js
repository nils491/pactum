/**
 * js/hub_toys.js
 * TACTUS Ausrüstungsschrank, Hardware-Atelier, Custom-Toy-Creator & Foto-Tresor (V3.0 Haute-Horlogerie)
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien nach Master-Roadbook:
 * - 100 % UTF-8 Integrität: Echte deutsche Umlaute (ä, ö, ü, ß) im gesamten Modul
 * - Haute-Horlogerie Palette: OLED-Tiefschwarz, Graphit, Champagner-Gold, Malachit, Cognac & Bordeaux
 * - Punkt #23 Vollständig Implementiert:
 *     • Echte Foto-Funktion für Ausrüstung (Kamera-Aufnahme via capture="environment" oder Upload)
 *     • Dedizierter Custom-Toy-Creator (+ Eigenes Toy anlegen): Name, Kategorie, Zone, RACK-Latex, Foto & Notiz
 *     • Eigene Toys fließen transparent in Inventar, Suche, Kategorien und den Toy-Kit Wizard ein
 *     • Visuelle Foto-Thumbnails in Karten und hochauflösende Ansicht im Toy-Inspector
 * - Punkt #21 Behoben: Stabiler Echtzeit-Filter ohne Fokusverlust (#inventory-cards-grid)
 * - Punkt #22 Behoben: Kategorieller Filter & Chained KI-Kombinatorik im 3–6 Toy-Kit Wizard
 * - Kinetische DoF-Konfliktprüfung & RACK-Latex-Radar
 * - Keine window.alert() / confirm() Aufrufe, sichere Toasts
 */

(function(window) {
  'use strict';

  const STORAGE_KEY_OWNED = 'tactus_owned_equipment';
  const STORAGE_KEY_OWNED_LEGACY = 'kompass_owned_equipment';
  const STORAGE_KEY_CUSTOM_NOTES = 'tactus_toy_custom_notes';
  const STORAGE_KEY_CUSTOM_TOYS = 'tactus_custom_equipment';
  const STORAGE_KEY_TOY_PHOTOS = 'tactus_toy_photos';
  const STORAGE_KEY_SAVED_BUNDLES = 'tactus_saved_bundles';
  const STORAGE_KEY_STAGING_BUNDLE = 'tactus_staging_bundle';
  const STORAGE_KEY_MEDICAL_PASS = 'tactus_medical_pass';
  const STORAGE_KEY_ANSWERS = 'kompass_answers';

  let currentMainTab = 'inventory'; // 'inventory' | 'wizard' | 'bundles'
  let activeCategoryFilter = 'all';
  let activeSearchQuery = '';

  // Wizard interner Filter
  let wizardCategoryFilter = 'recommended';
  let wizardSearchQuery = '';

  // Wizard State (3 bis 6 Slots)
  let wizardState = {
    targetSlotCount: 4,
    currentStepIndex: 0,
    selectedToyIds: [],
    customBundleName: 'Session-Set'
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

  function getCustomToys() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_TOYS);
      if (raw) return JSON.parse(raw) || [];
    } catch (e) {}
    return [];
  }

  function saveCustomToysToStorage(toys) {
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOM_TOYS, JSON.stringify(toys));
    } catch (e) {}
    if (window.CloudSync && typeof window.CloudSync.trigger === 'function') {
      window.CloudSync.trigger();
    }
  }

  // Fotos liegen verkleinert (800 px, max. ca. 80 KB) im Foto-Tresor von HubPhotos (IndexedDB)
  // und werden mit dem Partnergerät abgeglichen. Ältere Versionen haben sie in voller Größe im
  // localStorage abgelegt; die werden beim Start einmalig übernommen.
  function getLegacyPhotos() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_TOY_PHOTOS);
      if (raw) return JSON.parse(raw) || {};
    } catch (e) {}
    return {};
  }

  function getPhotoForToy(toyId) {
    const vault = window.HubPhotos;
    const cached = vault && typeof vault.getCached === 'function' ? vault.getCached(toyId) : null;
    return cached || getLegacyPhotos()[toyId] || null;
  }

  function dataUrlToBlob(dataUrl) {
    const [head, data] = String(dataUrl).split(',');
    const mime = (head.match(/data:([^;]+)/) || [])[1] || 'image/jpeg';
    const bin = atob(data || '');
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new Blob([bytes], { type: mime });
  }

  // Bild verkleinern; liefert { dataUrl, base64Payload, mimeType, sizeBytes }
  function processPhoto(fileOrDataUrl) {
    const blob = typeof fileOrDataUrl === 'string' ? dataUrlToBlob(fileOrDataUrl) : fileOrDataUrl;
    return window.HubPhotos.processImage(blob);
  }

  async function savePhotoForToy(toyId, photo) {
    const processed = photo && photo.dataUrl && photo.base64Payload ? photo : await processPhoto(photo);
    await window.HubPhotos.savePhoto(toyId, processed);
    if (window.CloudSync && typeof window.CloudSync.trigger === 'function') window.CloudSync.trigger();
    return processed;
  }

  function removePhotoForToy(toyId) {
    if (window.HubPhotos && typeof window.HubPhotos.deletePhoto === 'function') window.HubPhotos.deletePhoto(toyId);
    const legacy = getLegacyPhotos();
    if (legacy[toyId]) {
      delete legacy[toyId];
      try { localStorage.setItem(STORAGE_KEY_TOY_PHOTOS, JSON.stringify(legacy)); } catch (e) {}
    }
  }

  let photosReady = null;
  function loadPhotos() {
    if (photosReady) return photosReady;
    if (!window.HubPhotos || typeof window.HubPhotos.loadAll !== 'function') return Promise.resolve();
    photosReady = window.HubPhotos.loadAll().then(async () => {
      const legacy = getLegacyPhotos();
      const ids = Object.keys(legacy);
      for (const id of ids) {
        try { await savePhotoForToy(id, legacy[id]); delete legacy[id]; } catch (e) {}
      }
      if (ids.length) {
        try {
          if (Object.keys(legacy).length) localStorage.setItem(STORAGE_KEY_TOY_PHOTOS, JSON.stringify(legacy));
          else localStorage.removeItem(STORAGE_KEY_TOY_PHOTOS);
        } catch (e) {}
      }
    }).catch(() => {});
    return photosReady;
  }

  function getAllToysCombined() {
    let standardCatalog = [];
    if (window.EquipmentCatalog && typeof window.EquipmentCatalog.getAll === 'function') {
      standardCatalog = window.EquipmentCatalog.getAll();
    }
    const customToys = getCustomToys();
    return standardCatalog.concat(customToys);
  }

  function findToyById(toyId) {
    const all = getAllToysCombined();
    return all.find(t => t.id === toyId) || null;
  }

  function getOwnedToyIds() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_OWNED) || localStorage.getItem(STORAGE_KEY_OWNED_LEGACY);
      if (raw) return JSON.parse(raw) || [];
    } catch (e) {}
    return [];
  }

  function saveOwnedToyIds(ids) {
    try {
      localStorage.setItem(STORAGE_KEY_OWNED, JSON.stringify(ids));
      localStorage.setItem(STORAGE_KEY_OWNED_LEGACY, JSON.stringify(ids));
    } catch (e) {}
    if (window.CloudSync && typeof window.CloudSync.trigger === 'function') {
      window.CloudSync.trigger();
    }
  }

  function toggleToyOwned(toyId) {
    const owned = getOwnedToyIds();
    const idx = owned.indexOf(toyId);
    if (idx !== -1) {
      owned.splice(idx, 1);
      saveOwnedToyIds(owned);
      showToast("Aus dem Schrank-Inventar entfernt");
    } else {
      owned.push(toyId);
      saveOwnedToyIds(owned);
      showToast("Im Schrank-Inventar hinterlegt ✓");
    }
    updateInventoryGridOnly();
    updateHeaderCounters();
  }

  function getToyCustomNotes() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_NOTES);
      if (raw) return JSON.parse(raw) || {};
    } catch (e) {}
    return {};
  }

  function saveToyCustomNote(toyId, text) {
    const notes = getToyCustomNotes();
    notes[toyId] = text.trim();
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOM_NOTES, JSON.stringify(notes));
    } catch (e) {}
  }

  function getSavedBundles() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SAVED_BUNDLES);
      if (raw) return JSON.parse(raw) || [];
    } catch (e) {}
    return [];
  }

  function saveBundleToStorage(bundleObj) {
    const bundles = getSavedBundles();
    bundles.unshift(bundleObj);
    try {
      localStorage.setItem(STORAGE_KEY_SAVED_BUNDLES, JSON.stringify(bundles));
    } catch (e) {}
    if (window.CloudSync && typeof window.CloudSync.trigger === 'function') {
      window.CloudSync.trigger();
    }
  }

  function deleteSavedBundle(index) {
    const bundles = getSavedBundles();
    bundles.splice(index, 1);
    try {
      localStorage.setItem(STORAGE_KEY_SAVED_BUNDLES, JSON.stringify(bundles));
    } catch (e) {}
    showToast("Session-Set gelöscht");
    renderClosetView();
  }

  function computeChainedCompanionSuggestions(currentSlotIndex, selectedIds) {
    const catalog = getAllToysCombined();

    const previousSelectedToys = selectedIds
      .filter((id, idx) => idx < currentSlotIndex && Boolean(id))
      .map(id => catalog.find(t => t.id === id))
      .filter(Boolean);

    let answers = {};
    try {
      const raw = localStorage.getItem(STORAGE_KEY_ANSWERS);
      if (raw) answers = JSON.parse(raw) || {};
    } catch (e) {}

    const myRole = localStorage.getItem('kompass_assigned_role') || 'A';
    const pAns = answers[myRole] || {};

    const scored = catalog.map(toy => {
      let score = 0;
      let reasons = [];

      // 1. Physischer Konfliktausschluss
      const redCheck = checkBundleRedundancy(selectedIds.filter((_, i) => i !== currentSlotIndex), toy.id);
      if (redCheck.hasConflict) {
        return { toy, score: -100, reason: redCheck.reason, isBlocked: true };
      }

      // 2. Chained Synergien basierend auf vorherigen Slots
      if (previousSelectedToys.length > 0) {
        const hasBondage = previousSelectedToys.some(t => t.category === 'bondage');
        const hasImpact = previousSelectedToys.some(t => t.category === 'impact');
        const hasChastity = previousSelectedToys.some(t => t.category === 'chastity');
        const hasSensory = previousSelectedToys.some(t => t.category === 'sensory');

        if (hasBondage && toy.category === 'sensory') {
          score += 15;
          reasons.push("Harmoniert perfekt mit Fesselung: Sinnesentzug intensiviert das Gehaltensein");
        }
        if (hasBondage && toy.category === 'impact') {
          score += 12;
          reasons.push("Fixierter Körper erlaubt präzise, kontrollierte Trefferwinkel");
        }
        if (hasChastity && (toy.id === 'ball_stretcher_steel' || (toy.tags && toy.tags.includes('ball_stretcher')))) {
          score += 18;
          reasons.push("Betont den verriegelten Schritt: Zieht Hoden nach unten und steigert die Hysterese");
        }
        if (hasChastity && toy.category === 'care' && toy.somaticZone === 'anal_perineum') {
          score += 14;
          reasons.push("Reizverlagerung: Während der Schaft ruht, wird die Lust auf den P-Spot gelenkt");
        }
        if (hasImpact && toy.id === 'gravity_blanket_7kg') {
          score += 16;
          reasons.push("Verbindliche RACK-Nachsorge: Gewichtsdecke stoppt Kältezittern nach der Zucht");
        }
        if (hasImpact && toy.id === 'massage_oil_lavender') {
          score += 13;
          reasons.push("Reines Balsamieren: Lindert Hauthitze und schließt mit Versöhnung ab");
        }
      } else {
        if (toy.category === 'bondage') {
          score += 10;
          reasons.push("Ideales Session-Fundament für Führung und Körperbegrenzung");
        }
        if (toy.id === 'leather_collar_padded') {
          score += 12;
          reasons.push("Sichtbares Symbol der Zugehörigkeit als Einstieg in die Session");
        }
      }

      // 3. Eigene Toys erhalten Prioritäts-Bonus, da sie physisch griffbereit sind
      if (toy.isCustom) {
        score += 6;
        reasons.push("Euer persönliches Ausrüstungsstück im Atelier");
      }

      // 4. Psychometrische Resonanz
      if (toy.category === 'impact' && (pAns['it_62_r1'] >= 4 || pAns['it_62_r2'] >= 4)) {
        score += 8;
        reasons.push("Hohe persönliche Resonanz auf Paddles & Zucht (Kapitel 16)");
      }
      if (toy.category === 'bondage' && (pAns['it_52_r1'] >= 4 || pAns['it_52_r2'] >= 4)) {
        score += 8;
        reasons.push("Hohe persönliche Resonanz auf Shibari-Seile (Kapitel 10)");
      }

      return {
        toy,
        score,
        reason: reasons[0] || "Vielseitiges Werkzeug für deine Session",
        isBlocked: false
      };
    });

    return scored.sort((a, b) => b.score - a.score);
  }

  function checkBundleRedundancy(selectedIds, candidateToyId) {
    const catalog = getAllToysCombined();
    const candidateToy = catalog.find(t => t.id === candidateToyId);
    if (!candidateToy) return { hasConflict: false };

    let pass = {};
    try {
      const rawPass = localStorage.getItem(STORAGE_KEY_MEDICAL_PASS);
      if (rawPass) pass = JSON.parse(rawPass) || {};
    } catch (e) {}

    if (pass.hasLatexAllergy && candidateToy.isLatex) {
      return {
        hasConflict: true,
        reason: 'RACK-Konflikt: Latex-Allergie hinterlegt!'
      };
    }

    const selectedToys = catalog.filter(t => selectedIds.includes(t.id));

    // Keine zwei Knebel
    const candidateIsGag = (candidateToy.tags || []).includes('gag') || candidateToy.somaticZone === 'head_mouth';
    if (candidateIsGag) {
      const existingGag = selectedToys.find(t => (t.tags || []).includes('gag') || t.somaticZone === 'head_mouth');
      if (existingGag && existingGag.id !== candidateToy.id) {
        return {
          hasConflict: true,
          reason: `Mund ist bereits durch „${existingGag.name}“ belegt!`
        };
      }
    }

    // Keine zwei Peniskäfige
    const candidateIsCage = (candidateToy.tags || []).includes('chastity_cage') || candidateToy.category === 'chastity';
    if (candidateIsCage && candidateToy.somaticZone === 'genital_penile') {
      const existingCage = selectedToys.find(t => ((t.tags || []).includes('chastity_cage') || t.category === 'chastity') && t.somaticZone === 'genital_penile');
      if (existingCage && existingCage.id !== candidateToy.id) {
        return {
          hasConflict: true,
          reason: `Penis ist bereits durch „${existingCage.name}“ verriegelt!`
        };
      }
    }

    // Keine zwei Augenbinden
    const candidateIsBlindfold = (candidateToy.tags || []).includes('blindfold') || candidateToy.somaticZone === 'head_eyes';
    if (candidateIsBlindfold) {
      const existingBlind = selectedToys.find(t => (t.tags || []).includes('blindfold') || t.somaticZone === 'head_eyes');
      if (existingBlind && existingBlind.id !== candidateToy.id) {
        return {
          hasConflict: true,
          reason: `Augen sind bereits durch „${existingBlind.name}“ verdeckt!`
        };
      }
    }

    return { hasConflict: false };
  }

  function openClosetModal() {
    let modal = document.getElementById('hub-toys-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'hub-toys-modal';
      modal.className = "fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none";
      modal.innerHTML = `
        <div class="bg-[#090d14] rounded-3xl max-w-4xl w-full border border-[#c5a880]/60 p-4 sm:p-6 space-y-4 shadow-2xl text-xs text-[#f8fafc] font-sans max-h-[92dvh] overflow-y-auto pb-[max(env(safe-area-inset-bottom),16px)]">
          <div class="flex items-center justify-between border-b border-[#2a364f] pb-3">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-[#c5a880]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/></svg>
              <h3 class="text-sm sm:text-base font-serif font-bold text-white">TACTUS Ausrüstungsschrank &amp; Hardware-Atelier</h3>
            </div>
            <button type="button" onclick="document.getElementById('hub-toys-modal').style.display='none'" class="w-9 h-9 rounded-xl bg-[#000000] border border-[#2a364f] text-[#94a3b8] hover:text-white flex items-center justify-center touch-btn">✕</button>
          </div>
          <div id="hub-toys-closet-container" class="w-full"></div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    modal.style.display = 'flex';
    initClosetView('hub-toys-closet-container');
  }

  function initClosetView(containerId = 'hub-toys-closet-container') {
    window._hubToysContainerId = containerId;
    renderClosetView();
    loadPhotos().then(() => updateInventoryGridOnly());
  }

  window.addEventListener('tactus:photos-updated', () => updateInventoryGridOnly());

  function updateHeaderCounters() {
    const owned = getOwnedToyIds();
    const bundles = getSavedBundles();
    const customToys = getCustomToys();

    const countEl = document.getElementById('closet-header-stats');
    if (countEl) {
      countEl.innerHTML = `
        <strong class="text-xs sm:text-sm text-white font-serif">${owned.length} im Besitz (${customToys.length} Eigene)</strong>
        <span class="text-[#94a3b8]">·</span>
        <span class="text-[10px] font-mono text-[#d4af37] font-bold">${bundles.length} gespeicherte Sets</span>
      `;
    }

    const tabInvBtn = document.getElementById('closet-tab-btn-inventory');
    if (tabInvBtn) tabInvBtn.innerText = `1. Schrank-Inventar (${owned.length})`;

    const tabBunBtn = document.getElementById('closet-tab-btn-bundles');
    if (tabBunBtn) tabBunBtn.innerText = `3. Gespeicherte Sets (${bundles.length})`;
  }

  function renderClosetView() {
    const containerId = window._hubToysContainerId || 'hub-toys-closet-container';
    const container = document.getElementById(containerId);
    if (!container) return;

    const owned = getOwnedToyIds();
    const savedBundles = getSavedBundles();
    const customToys = getCustomToys();

    let pass = {};
    try {
      const rawPass = localStorage.getItem(STORAGE_KEY_MEDICAL_PASS);
      if (rawPass) pass = JSON.parse(rawPass) || {};
    } catch (e) {}

    container.innerHTML = `
      <div class="space-y-4 font-sans text-xs">
        
        <!-- HEADER KACHEL MIT SCHRANK-TELEMETRIE & BUTTON EIGENES TOY -->
        <div class="p-3.5 sm:p-4 rounded-2xl bg-[#000000] border border-[#2a364f] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div class="space-y-0.5">
            <span class="text-[9.5px] font-mono uppercase tracking-wider text-[#c5a880] font-bold block">
              Hardware-Inventar &amp; Foto-Atelier
            </span>
            <div class="flex items-center gap-2" id="closet-header-stats">
              <strong class="text-xs sm:text-sm text-white font-serif">${owned.length} im Besitz (${customToys.length} Eigene)</strong>
              <span class="text-[#94a3b8]">·</span>
              <span class="text-[10px] font-mono text-[#d4af37] font-bold">${savedBundles.length} gespeicherte Sets</span>
            </div>
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            ${pass.hasLatexAllergy ? `
              <span class="px-2.5 py-1 rounded-xl bg-[#450a0a] border border-[#991b1b] text-white font-mono text-[9.5px] font-bold flex items-center gap-1.5 animate-pulse">
                <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.008v.008H12v-.008z"/></svg>
                <span>Latex-Veto aktiv</span>
              </span>
            ` : ''}

            <!-- BUTTON: EIGENES TOY ANLEGEN (PUNKT #23) -->
            <button type="button" onclick="HubToys.openCreateCustomToyModal()" class="px-3.5 py-2 rounded-xl bg-[#c5a880] hover:bg-[#dfcaa9] text-black font-mono font-bold text-xs touch-btn shadow-md flex items-center gap-1.5">
              <span>+ Eigenes Toy anlegen</span>
            </button>
          </div>
        </div>

        <!-- 3 HAUPT-TABS DES ATELIERS -->
        <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 border-b border-[#2a364f] font-mono text-xs w-full">
          <button type="button" id="closet-tab-btn-inventory" onclick="HubToys.switchMainTab('inventory')" class="px-3.5 py-2 rounded-xl font-bold transition-all touch-btn whitespace-nowrap shrink-0 flex-shrink-0 ${currentMainTab === 'inventory' ? 'bg-[#000000] border border-[#c5a880] text-[#c5a880] shadow-sm' : 'bg-[#090d14] border border-[#2a364f] text-[#94a3b8] hover:text-white'}">
            1. Schrank-Inventar (${owned.length})
          </button>
          <button type="button" onclick="HubToys.switchMainTab('wizard')" class="px-3.5 py-2 rounded-xl font-bold transition-all touch-btn whitespace-nowrap shrink-0 flex-shrink-0 flex items-center gap-1.5 ${currentMainTab === 'wizard' ? 'bg-[#000000] border border-[#c5a880] text-[#c5a880] shadow-sm' : 'bg-[#090d14] border border-[#2a364f] text-[#d4af37] hover:text-white'}">
            <span>✨ 2. Toy-Kit Wizard (3–6 Toys)</span>
          </button>
          <button type="button" id="closet-tab-btn-bundles" onclick="HubToys.switchMainTab('bundles')" class="px-3.5 py-2 rounded-xl font-bold transition-all touch-btn whitespace-nowrap shrink-0 flex-shrink-0 ${currentMainTab === 'bundles' ? 'bg-[#000000] border border-[#c5a880] text-[#c5a880] shadow-sm' : 'bg-[#090d14] border border-[#2a364f] text-[#94a3b8] hover:text-white'}">
            3. Gespeicherte Sets (${savedBundles.length})
          </button>
        </div>

        <!-- TAB-INHALTE -->
        <div id="hub-toys-tab-content" class="animate-fade-in">
          ${currentMainTab === 'inventory' ? renderInventoryTabHtml() : ''}
          ${currentMainTab === 'wizard' ? renderWizardTabHtml() : ''}
          ${currentMainTab === 'bundles' ? renderBundlesTabHtml() : ''}
        </div>

      </div>
    `;

    attachInspectorModal();
    attachCustomToyModal();
  }

  function renderInventoryTabHtml() {
    const categories = [
      { id: 'all', label: 'Alle' },
      { id: 'custom', label: '★ Eigene Toys' },
      { id: 'bondage', label: 'Bondage' },
      { id: 'impact', label: 'Impact' },
      { id: 'stimulation', label: 'Lust-Toys' },
      { id: 'chastity', label: 'Keuschheit' },
      { id: 'sensory', label: 'Sinnesentzug' },
      { id: 'furniture', label: 'Möbel' },
      { id: 'care', label: 'Care' }
    ];

    return `
      <div class="space-y-3">
        <!-- FILTER & SUCHE LEISTE -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 font-mono text-[10.5px]">
            ${categories.map(cat => `
              <button 
                type="button" 
                id="cat-filter-btn-${cat.id}"
                onclick="HubToys.setCategoryFilter('${cat.id}')" 
                class="px-2.5 py-1.5 rounded-xl font-bold whitespace-nowrap shrink-0 flex-shrink-0 transition-all touch-btn ${activeCategoryFilter === cat.id ? 'bg-[#000000] border border-[#c5a880] text-[#c5a880]' : 'bg-[#090d14] border border-[#2a364f] text-[#94a3b8] hover:text-white'}"
              >
                ${escapeHtml(cat.label)}
              </button>
            `).join('')}
          </div>

          <div class="relative sm:w-64 font-mono text-xs">
            <input 
              type="text" 
              id="inventory-search-input"
              value="${escapeHtml(activeSearchQuery)}" 
              oninput="HubToys.handleSearchInput(this.value)" 
              placeholder="Toy oder Material suchen..." 
              class="w-full px-3 py-2 bg-[#000000] border border-[#2a364f] rounded-xl text-white text-[11px] placeholder:text-[#94a3b8]/40 focus:border-[#c5a880] focus:outline-none" 
            />
            ${activeSearchQuery ? `
              <button type="button" onclick="HubToys.clearSearch()" class="absolute right-2.5 top-2 text-[#94a3b8] hover:text-white text-xs">✕</button>
            ` : ''}
          </div>
        </div>

        <!-- LISTE DER KARTEN (DOPPEL-SPALTIG) -->
        <div id="inventory-cards-grid" class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          ${renderInventoryGridCardsHtml()}
        </div>
      </div>
    `;
  }

  function getFilteredInventoryToys() {
    const all = getAllToysCombined();

    let filtered = all;
    if (activeCategoryFilter === 'custom') {
      filtered = all.filter(t => t.isCustom === true);
    } else if (activeCategoryFilter !== 'all') {
      filtered = all.filter(t => t.category === activeCategoryFilter);
    }

    if (activeSearchQuery.trim().length > 0) {
      const q = activeSearchQuery.toLowerCase().trim();
      filtered = filtered.filter(t => 
        (t.name && t.name.toLowerCase().includes(q)) || 
        (t.somaticEffect && t.somaticEffect.toLowerCase().includes(q)) ||
        (t.somaticZone && t.somaticZone.toLowerCase().includes(q)) ||
        (t.materials || []).some(m => m.toLowerCase().includes(q))
      );
    }

    return filtered;
  }

  function renderInventoryGridCardsHtml() {
    const filtered = getFilteredInventoryToys();
    const owned = getOwnedToyIds();

    if (filtered.length === 0) {
      return `
        <div class="col-span-full p-8 rounded-2xl bg-[#000000] border border-[#2a364f] text-center text-[#94a3b8] font-mono text-xs space-y-1">
          <span>Keine Werkzeuge entsprechen dem Suchkriterium „${escapeHtml(activeSearchQuery)}“.</span>
          <button type="button" onclick="HubToys.clearSearch()" class="text-[#c5a880] block underline mx-auto pt-1 font-bold">Suche zurücksetzen</button>
        </div>
      `;
    }

    return filtered.map(toy => {
      const isOwned = owned.includes(toy.id);
      const photoUrl = getPhotoForToy(toy.id);

      return `
        <div class="p-3.5 rounded-2xl bg-[#090d14] border transition-all space-y-2 flex flex-col justify-between ${isOwned ? 'border-[#c5a880]/60 bg-[#000000]' : 'border-[#2a364f]'}">
          <div class="space-y-1.5">
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span class="text-[9px] font-mono uppercase tracking-wider text-[#c5a880] font-bold">
                    ${escapeHtml(toy.category)} · Zone: ${escapeHtml(toy.somaticZone)}
                  </span>
                  ${toy.isCustom ? `
                    <span class="px-1.5 py-0.2 rounded text-[8.5px] font-mono bg-[#4a2818] text-[#f8fafc] border border-[#8a5232] font-bold">
                      Eigenes Stück ★
                    </span>
                  ` : ''}
                </div>
                <strong class="text-xs text-white block font-bold leading-tight break-words mt-0.5">
                  ${escapeHtml(toy.name)}
                </strong>
              </div>

              ${toy.isLatex ? `
                <span class="px-1.5 py-0.5 rounded text-[8.5px] font-mono bg-[#450a0a] text-white border border-[#991b1b] font-bold flex-shrink-0">
                  Latex
                </span>
              ` : ''}
            </div>

            <!-- FOTO THUMBNAIL FALLS VORHANDEN -->
            ${photoUrl ? `
              <div class="w-full h-28 rounded-xl overflow-hidden border border-[#2a364f] bg-[#000000] cursor-pointer" onclick="HubToys.inspectToy('${toy.id}')">
                <img src="${photoUrl}" alt="${escapeHtml(toy.name)}" class="w-full h-full object-cover" />
              </div>
            ` : ''}

            <p class="text-[10px] text-[#94a3b8] leading-snug line-clamp-2">
              ${escapeHtml(toy.somaticEffect)}
            </p>
          </div>

          <div class="pt-2 border-t border-[#2a364f]/70 flex items-center justify-between font-mono text-[10px]">
            <button type="button" onclick="HubToys.inspectToy('${toy.id}')" class="text-[#94a3b8] hover:text-[#c5a880] hover:underline flex items-center gap-1 font-bold">
              <span>Details &amp; Foto</span>
              <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>
            </button>

            <button type="button" onclick="HubToys.toggleOwned('${toy.id}')" class="px-2.5 py-1 rounded-xl font-bold transition-all touch-btn ${isOwned ? 'bg-[#142b24] border border-[#2e5746] text-[#2e5746]' : 'bg-[#000000] border border-[#2a364f] text-[#94a3b8] hover:text-white'}">
              ${isOwned ? 'Im Besitz ✓' : '+ Besitze ich'}
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  function updateInventoryGridOnly() {
    const grid = document.getElementById('inventory-cards-grid');
    if (grid) {
      grid.innerHTML = renderInventoryGridCardsHtml();
    }
  }

  function renderWizardTabHtml() {
    const catalog = getAllToysCombined();
    const totalSlots = wizardState.targetSlotCount;
    const currentStep = wizardState.currentStepIndex;
    const selectedIds = wizardState.selectedToyIds;

    const slotLabels = [
      '1. Basis & Fesselung',
      '2. Reiz & Zucht',
      '3. Sinnesfokus / Blindfold',
      '4. Lust & Keuschheit',
      '5. Spezial-Equipment',
      '6. Vagus & Aftercare'
    ];

    const currentSlotTitle = slotLabels[currentStep] || `Slot ${currentStep + 1}`;
    const scoredList = computeChainedCompanionSuggestions(currentStep, selectedIds);
    const topRecommendation = scoredList.find(s => !s.isBlocked && s.score > 0);

    const wizardCategories = [
      { id: 'recommended', label: '★ KI-Empfohlen' },
      { id: 'all', label: 'Alle Toys' },
      { id: 'bondage', label: 'Bondage' },
      { id: 'impact', label: 'Impact' },
      { id: 'stimulation', label: 'Lust-Toys' },
      { id: 'chastity', label: 'Keuschheit' },
      { id: 'sensory', label: 'Sinnesentzug' },
      { id: 'care', label: 'Aftercare' }
    ];

    let displayList = scoredList;
    if (wizardCategoryFilter === 'recommended') {
      displayList = scoredList.filter(s => s.score >= 8 && !s.isBlocked);
      if (displayList.length === 0) displayList = scoredList.slice(0, 6);
    } else if (wizardCategoryFilter !== 'all') {
      displayList = scoredList.filter(s => s.toy.category === wizardCategoryFilter);
    }

    if (wizardSearchQuery.trim().length > 0) {
      const q = wizardSearchQuery.toLowerCase().trim();
      displayList = displayList.filter(s => 
        s.toy.name.toLowerCase().includes(q) || 
        s.toy.somaticEffect.toLowerCase().includes(q)
      );
    }

    return `
      <div class="space-y-4 font-sans">
        
        <!-- WIZARD KOPFZEILE -->
        <div class="p-4 rounded-2xl bg-[#000000] border border-[#d4af37]/60 space-y-3 shadow-xl">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2a364f] pb-2.5">
            <div>
              <strong class="text-xs sm:text-sm text-white font-serif block">
                Session-Kit Konfigurator (3 bis 6 Ausrüstungs-Slots)
              </strong>
              <p class="text-[10px] text-[#94a3b8]">
                Stellt das ideale Ausrüstungs-Set zusammen – anatomisch redundant-frei und mit Chained-KI-Folgebegleitung.
              </p>
            </div>

            <!-- SLOT-ANZAHL WÄHLEN -->
            <div class="flex items-center gap-1 font-mono text-[10px] self-start sm:self-auto">
              <span class="text-[#94a3b8] mr-1">Umfang:</span>
              ${[3, 4, 5, 6].map(count => `
                <button type="button" onclick="HubToys.setWizardSlotCount(${count})" class="w-7 h-7 rounded-xl font-bold flex items-center justify-center transition-all touch-btn ${totalSlots === count ? 'bg-[#d4af37] text-black shadow-md' : 'bg-[#090d14] border border-[#2a364f] text-[#94a3b8] hover:text-white'}">
                  ${count}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- SCHRITT-TABS -->
          <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 font-mono text-[10.5px]">
            ${Array.from({ length: totalSlots }).map((_, idx) => {
              const isCurrent = idx === currentStep;
              const isFilled = !!selectedIds[idx];
              const filledToy = isFilled ? catalog.find(t => t.id === selectedIds[idx]) : null;

              return `
                <button 
                  type="button" 
                  onclick="HubToys.goToWizardStep(${idx})" 
                  class="px-3 py-1.5 rounded-xl border text-left transition-all touch-btn whitespace-nowrap shrink-0 flex-shrink-0 flex items-center gap-1.5 ${isCurrent ? 'bg-[#000000] border-[#c5a880] text-[#c5a880] font-bold shadow-sm' : (isFilled ? 'bg-[#090d14] border-[#2e5746] text-[#2e5746]' : 'bg-[#090d14] border-[#2a364f] text-[#94a3b8] hover:text-white')}"
                >
                  <span class="w-1.5 h-1.5 rounded-full ${isCurrent ? 'bg-[#c5a880] animate-pulse' : (isFilled ? 'bg-[#2e5746]' : 'bg-[#2a364f]')}"></span>
                  <span>${escapeHtml(slotLabels[idx] || `Slot ${idx + 1}`)}</span>
                  ${filledToy ? `<span class="text-[9px] text-[#f8fafc] font-normal truncate max-w-[80px]">(${escapeHtml(filledToy.name)})</span>` : ''}
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- CHAINED KI-KINETIK-EMPFEHLUNG -->
        ${topRecommendation ? `
          <div class="p-3.5 rounded-2xl bg-[#000000] border border-[#2e5746] space-y-1.5 shadow-md">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-mono text-[#2e5746] font-bold uppercase flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-[#2e5746] animate-pulse"></span>
                <span>TACTUS Kinetik-Empfehlung für ${escapeHtml(currentSlotTitle)}:</span>
              </span>
              <button type="button" onclick="HubToys.assignToyToSlot(${currentStep}, '${topRecommendation.toy.id}')" class="px-2.5 py-1 rounded-xl bg-[#142b24] border border-[#2e5746] text-white font-mono text-[9.5px] font-bold touch-btn hover:bg-[#2e5746]">
                Direkt übernehmen ✓
              </button>
            </div>
            <strong class="text-xs text-white block font-bold">${escapeHtml(topRecommendation.toy.name)}</strong>
            <p class="text-[10.5px] text-[#94a3b8] leading-snug">${escapeHtml(topRecommendation.reason)}</p>
          </div>
        ` : ''}

        <!-- WIZARD AUSWAHLBEREICH -->
        <div class="p-4 rounded-2xl bg-[#090d14] border border-[#2a364f] space-y-3 shadow-md">
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 border-b border-[#2a364f]/70 pb-2.5">
            <div>
              <strong class="text-xs text-white block font-bold">Auswahl für ${escapeHtml(currentSlotTitle)}:</strong>
              <span class="text-[10px] text-[#94a3b8]">Wähle ein Werkzeug oder nutze die Kategoriereiter</span>
            </div>

            <div class="relative sm:w-48 font-mono text-[11px]">
              <input 
                type="text" 
                value="${escapeHtml(wizardSearchQuery)}" 
                oninput="HubToys.handleWizardSearchInput(this.value)" 
                placeholder="In diesem Slot suchen..." 
                class="w-full px-2.5 py-1.5 bg-[#000000] border border-[#2a364f] rounded-xl text-white text-[10.5px] placeholder:text-[#94a3b8]/40 focus:border-[#c5a880] focus:outline-none" 
              />
            </div>
          </div>

          <!-- KATEGORIE-FILTER-PILLS IM WIZARD -->
          <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 font-mono text-[10px]">
            ${wizardCategories.map(cat => `
              <button 
                type="button" 
                onclick="HubToys.setWizardCategoryFilter('${cat.id}')" 
                class="px-2.5 py-1 rounded-xl font-bold whitespace-nowrap shrink-0 flex-shrink-0 transition-all touch-btn ${wizardCategoryFilter === cat.id ? 'bg-[#000000] border border-[#c5a880] text-[#c5a880]' : 'bg-[#090d14] border border-[#2a364f] text-[#94a3b8] hover:text-white'}"
              >
                ${escapeHtml(cat.label)}
              </button>
            `).join('')}
          </div>

          <!-- LISTE DER KANDIDATEN -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            ${displayList.map(item => {
              const toy = item.toy;
              const isSelectedForThisSlot = selectedIds[currentStep] === toy.id;
              const isBlocked = item.isBlocked;
              const isHighSugg = item.score >= 10;
              const photoUrl = getPhotoForToy(toy.id);

              return `
                <div class="p-3 rounded-2xl border transition-all flex flex-col justify-between ${isSelectedForThisSlot ? 'bg-[#000000] border-[#c5a880] shadow-md' : (isBlocked ? 'opacity-40 border-[#450a0a] bg-[#000000]' : 'bg-[#000000] border-[#2a364f] hover:border-[#475569]')}">
                  <div class="space-y-1">
                    <div class="flex items-start justify-between gap-1.5">
                      <strong class="text-xs text-white block font-bold leading-tight break-words">
                        ${escapeHtml(toy.name)}
                      </strong>
                      ${isHighSugg ? `
                        <span class="px-1.5 py-0.2 rounded text-[8.5px] font-mono bg-[#142b24] text-[#2e5746] border border-[#2e5746] font-bold flex-shrink-0">
                          ★ Hohe Synergie
                        </span>
                      ` : ''}
                    </div>

                    ${photoUrl ? `
                      <div class="w-full h-20 rounded-lg overflow-hidden border border-[#2a364f] my-1">
                        <img src="${photoUrl}" alt="${escapeHtml(toy.name)}" class="w-full h-full object-cover" />
                      </div>
                    ` : ''}

                    <p class="text-[10px] text-[#94a3b8] leading-snug line-clamp-2">
                      ${escapeHtml(toy.somaticEffect)}
                    </p>

                    ${item.reason && item.score > 0 ? `
                      <span class="text-[9px] font-mono text-[#c5a880] block">
                        Kinetik: ${escapeHtml(item.reason)}
                      </span>
                    ` : ''}

                    ${isBlocked ? `
                      <span class="text-[9px] font-mono text-[#ef4444] block">
                        ⚠️ ${escapeHtml(item.reason)}
                      </span>
                    ` : ''}
                  </div>

                  <div class="pt-2 border-t border-[#2a364f]/60 flex items-center justify-between font-mono text-[10px]">
                    <span class="text-[#94a3b8]">${escapeHtml(toy.category)}</span>
                    
                    ${isBlocked ? `
                      <span class="text-[#94a3b8] italic">Blockiert</span>
                    ` : (isSelectedForThisSlot ? `
                      <button type="button" onclick="HubToys.removeToyFromSlot(${currentStep})" class="px-2.5 py-1 rounded-xl bg-[#4a2818] border border-[#8a5232] text-[#f8fafc] font-bold touch-btn">
                        Entfernen ✕
                      </button>
                    ` : `
                      <button type="button" onclick="HubToys.assignToyToSlot(${currentStep}, '${toy.id}')" class="px-2.5 py-1 rounded-xl bg-[#090d14] border border-[#2a364f] text-[#c5a880] hover:border-[#c5a880] font-bold touch-btn">
                        Zuweisen +
                      </button>
                    `)}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- STEUERUNGSLEISTE -->
        <div class="p-4 rounded-2xl bg-[#000000] border border-[#2a364f] flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <button 
              type="button" 
              onclick="HubToys.prevWizardStep()" 
              ${currentStep === 0 ? 'disabled class="opacity-30 cursor-not-allowed px-3.5 py-2 rounded-xl bg-[#090d14] border border-[#2a364f] text-[#94a3b8]"' : 'class="px-3.5 py-2 rounded-xl bg-[#090d14] border border-[#2a364f] text-white hover:border-[#c5a880] touch-btn"'}
            >
              ← Vorheriger Slot
            </button>

            ${currentStep < totalSlots - 1 ? `
              <button type="button" onclick="HubToys.nextWizardStep()" class="px-4 py-2 rounded-xl bg-[#c5a880] hover:bg-[#dfcaa9] text-black font-bold touch-btn shadow-md">
                Nächster Slot →
              </button>
            ` : ''}
          </div>

          <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button type="button" onclick="HubToys.finalizeAndStageBundle()" class="px-4 py-2 rounded-xl bg-[#d4af37] hover:bg-[#dfcaa9] text-black font-bold touch-btn shadow-md whitespace-nowrap flex items-center gap-1.5">
              <span>Set für Session übernehmen ↗</span>
            </button>
          </div>
        </div>

      </div>
    `;
  }

  function renderBundlesTabHtml() {
    const bundles = getSavedBundles();
    const catalog = getAllToysCombined();

    if (bundles.length === 0) {
      return `
        <div class="p-8 rounded-3xl bg-[#000000] border border-[#2a364f] text-center space-y-2 font-mono text-xs">
          <span class="text-[#94a3b8] block">Noch keine Session-Sets gespeichert.</span>
          <button type="button" onclick="HubToys.switchMainTab('wizard')" class="text-[#c5a880] underline font-bold">
            Jetzt mit dem Toy-Kit Wizard ein Set erstellen ↗
          </button>
        </div>
      `;
    }

    return `
      <div class="space-y-3 font-sans">
        ${bundles.map((b, idx) => {
          const toyList = (b.toyIds || []).map(id => catalog.find(t => t.id === id)).filter(Boolean);

          return `
            <div class="p-4 rounded-2xl bg-[#090d14] border border-[#2a364f] hover:border-[#c5a880]/50 transition-all space-y-2.5 shadow-md">
              <div class="flex items-center justify-between border-b border-[#2a364f]/70 pb-2">
                <div>
                  <strong class="text-xs sm:text-sm text-white font-serif block">${escapeHtml(b.name)}</strong>
                  <span class="text-[9.5px] font-mono text-[#94a3b8]">
                    ${new Date(b.createdAt).toLocaleDateString('de-DE')} · ${toyList.length} Gegenstände
                  </span>
                </div>

                <div class="flex items-center gap-1.5 font-mono text-[10px]">
                  <button type="button" onclick="HubToys.stageExistingBundle(${idx})" class="px-3 py-1.5 rounded-xl bg-[#c5a880] text-black font-bold touch-btn shadow-sm">
                    In Session laden ↗
                  </button>
                  <button type="button" onclick="HubToys.deleteBundle(${idx})" class="p-1.5 rounded-xl bg-[#000000] border border-[#2a364f] text-[#991b1b] hover:text-white" title="Löschen">
                    ✕
                  </button>
                </div>
              </div>

              <div class="flex flex-wrap gap-1.5 pt-1">
                ${toyList.map(t => `
                  <span class="px-2.5 py-1 rounded-xl bg-[#000000] border border-[#2a364f] text-white font-mono text-[10px]">
                    ${escapeHtml(t.name)}
                  </span>
                `).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  function attachInspectorModal() {
    let modal = document.getElementById('hub-toys-inspector-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'hub-toys-inspector-modal';
      modal.className = "fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none";
      modal.style.display = 'none';
      document.body.appendChild(modal);
    }
  }

  function openToyInspector(toyId) {
    const toy = findToyById(toyId);
    if (!toy) return;

    const modal = document.getElementById('hub-toys-inspector-modal');
    if (!modal) return;

    const owned = getOwnedToyIds();
    const isOwned = owned.includes(toy.id);
    const customNotes = getToyCustomNotes();
    const currentNote = customNotes[toy.id] || '';
    const photoUrl = getPhotoForToy(toy.id);

    modal.innerHTML = `
      <div class="bg-[#090d14] rounded-3xl max-w-lg w-full border border-[#c5a880]/60 p-5 space-y-4 shadow-2xl text-xs text-[#f8fafc] font-sans max-h-[90dvh] overflow-y-auto pb-[max(env(safe-area-inset-bottom),16px)]">
        
        <div class="flex items-center justify-between border-b border-[#2a364f] pb-3">
          <div class="space-y-0.5">
            <div class="flex items-center gap-1.5">
              <span class="text-[9.5px] font-mono uppercase tracking-wider text-[#c5a880] font-bold block">
                ${escapeHtml(toy.category)} · Zone: ${escapeHtml(toy.somaticZone)}
              </span>
              ${toy.isCustom ? `
                <span class="px-1.5 py-0.2 rounded text-[8.5px] font-mono bg-[#4a2818] text-[#f8fafc] border border-[#8a5232] font-bold">
                  Eigenes Stück
                </span>
              ` : ''}
            </div>
            <h3 class="text-sm sm:text-base font-serif text-white font-bold">${escapeHtml(toy.name)}</h3>
          </div>
          <button type="button" onclick="document.getElementById('hub-toys-inspector-modal').style.display='none'" class="w-8 h-8 rounded-xl bg-[#000000] border border-[#2a364f] text-[#94a3b8] hover:text-white flex items-center justify-center touch-btn">✕</button>
        </div>

        <!-- FOTO BEREICH MIT AUFNAHME- UND LÖSCHMÖGLICHKEIT (PUNKT #23) -->
        <div class="p-3.5 rounded-2xl bg-[#000000] border border-[#2a364f] space-y-2.5">
          <div class="flex items-center justify-between">
            <strong class="text-white block font-bold font-mono text-[10px] uppercase">Reales Ausrüstungs-Foto (1:1 Tresor):</strong>
            ${photoUrl ? `
              <button type="button" onclick="HubToys.deletePhoto('${toy.id}')" class="text-[#991b1b] hover:underline font-mono text-[9.5px]">
                Foto löschen ✕
              </button>
            ` : ''}
          </div>

          ${photoUrl ? `
            <div class="w-full h-44 rounded-xl overflow-hidden border border-[#2a364f] bg-[#090d14]">
              <img src="${photoUrl}" alt="${escapeHtml(toy.name)}" class="w-full h-full object-cover" />
            </div>
          ` : `
            <div class="h-28 rounded-xl border border-dashed border-[#2a364f] bg-[#090d14] flex flex-col items-center justify-center text-center p-3 space-y-1 font-mono text-[10px] text-[#94a3b8]">
              <svg class="w-6 h-6 text-[#94a3b8]/60" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"/><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"/></svg>
              <span>Noch kein Foto dieses Werkzeugs hinterlegt</span>
            </div>
          `}

          <div class="flex items-center gap-2 font-mono text-[10px]">
            <label class="flex-1 py-2 px-3 rounded-xl bg-[#090d14] hover:bg-[#101622] border border-[#2a364f] text-[#c5a880] text-center cursor-pointer touch-btn flex items-center justify-center gap-1.5 font-bold">
              <span>📷 Foto aufnehmen</span>
              <input type="file" accept="image/*" capture="environment" onchange="HubToys.handlePhotoInput('${toy.id}', this)" class="hidden" />
            </label>
            <label class="flex-1 py-2 px-3 rounded-xl bg-[#090d14] hover:bg-[#101622] border border-[#2a364f] text-[#94a3b8] text-center cursor-pointer touch-btn flex items-center justify-center gap-1.5 font-bold">
              <span>Galerie wählen</span>
              <input type="file" accept="image/*" onchange="HubToys.handlePhotoInput('${toy.id}', this)" class="hidden" />
            </label>
          </div>
        </div>

        <p class="text-[11px] text-[#f8fafc] leading-relaxed">
          ${escapeHtml(toy.somaticEffect)}
        </p>

        <!-- RACK HYGIENE PROTOKOLL -->
        <div class="p-3.5 rounded-2xl bg-[#000000] border border-[#2a364f] space-y-2 text-[10.5px]">
          <strong class="text-white block font-bold font-mono">RACK-Hygiene- &amp; Pflegeprotokoll:</strong>
          <p class="text-[#94a3b8] leading-snug">
            ${escapeHtml(toy.safetyProtocol?.aftercareInstruction || 'Nach der Session gründlich desinfizieren und trocken lagern.')}
          </p>
          <span class="text-[9.5px] font-mono text-[#c5a880] block">
            Materialien: ${(toy.materials || []).join(', ')}
          </span>
        </div>

        <!-- EIGENE NOTIZ -->
        <div class="space-y-1.5 font-mono">
          <label class="text-[10px] text-[#94a3b8] uppercase block font-bold">Eigene Notiz (z. B. Ringgröße, Schlossnummer):</label>
          <input 
            type="text" 
            id="inspector-input-note" 
            value="${escapeHtml(currentNote)}" 
            placeholder="z. B. Ringgröße 45mm, im Schlafzimmerschrank oben..." 
            class="w-full p-2.5 bg-[#000000] border border-[#2a364f] rounded-xl text-white text-xs font-sans focus:border-[#c5a880] focus:outline-none" 
          />
        </div>

        <div class="pt-2 border-t border-[#2a364f] flex items-center justify-between font-mono">
          <div class="flex items-center gap-2">
            <button type="button" onclick="HubToys.toggleOwned('${toy.id}'); HubToys.inspectToy('${toy.id}');" class="px-3.5 py-2 rounded-xl font-bold transition-all touch-btn ${isOwned ? 'bg-[#142b24] border border-[#2e5746] text-[#2e5746]' : 'bg-[#000000] border border-[#2a364f] text-[#94a3b8]'}">
              ${isOwned ? 'Im Besitz ✓' : '+ In Besitz'}
            </button>
            ${toy.isCustom ? `
              <button type="button" onclick="HubToys.deleteCustomToy('${toy.id}')" class="px-2.5 py-2 rounded-xl bg-[#450a0a] border border-[#991b1b] text-white font-bold touch-btn">
                Toy löschen
              </button>
            ` : ''}
          </div>

          <button type="button" onclick="HubToys.saveInspectorNote('${toy.id}')" class="px-4 py-2 bg-[#c5a880] hover:bg-[#dfcaa9] text-black font-bold rounded-xl text-xs touch-btn shadow-md">
            Notiz sichern ✓
          </button>
        </div>
      </div>
    `;

    modal.style.display = 'flex';
  }

  function handlePhotoInput(toyId, inputEl) {
    const file = inputEl.files && inputEl.files[0];
    if (!file) return;

    savePhotoForToy(toyId, file).then(() => {
      showToast("✓ Foto der Ausrüstung gesichert!");
      openToyInspector(toyId);
      updateInventoryGridOnly();
    }).catch(() => showToast("Das Foto konnte nicht verarbeitet werden."));
  }

  function deletePhoto(toyId) {
    removePhotoForToy(toyId);
    showToast("Foto entfernt.");
    openToyInspector(toyId);
    updateInventoryGridOnly();
  }

  function attachCustomToyModal() {
    let modal = document.getElementById('hub-toys-create-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'hub-toys-create-modal';
      modal.className = "fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none";
      modal.style.display = 'none';
      document.body.appendChild(modal);
    }
  }

  // --- Toy per Foto anlegen: KI füllt die Felder vor, mehrere Fotos nacheinander -------------
  const TOY_CATEGORIES = [
    ['bondage', 'Bondage & Seile'],
    ['impact', 'Impact & Zucht'],
    ['stimulation', 'Lust-Toys & Vibration'],
    ['chastity', 'Keuschheit & Genital'],
    ['sensory', 'Sinnesentzug & Masken'],
    ['furniture', 'Möbel & Arretierung'],
    ['care', 'Pflege & Aftercare']
  ];
  const TOY_ZONES = [
    ['full_body', 'Ganzkörper'],
    ['head_neck', 'Hals & Nacken'],
    ['head_mouth', 'Mund (Knebel)'],
    ['head_eyes', 'Augen (Augenbinde)'],
    ['chest_nipples', 'Brust & Brustwarzen'],
    ['torso_skin', 'Haut & Oberkörper'],
    ['gluteal_pelvis', 'Gesäß & Becken'],
    ['genital_penile', 'Penis / Schaft'],
    ['genital_testicles', 'Hoden'],
    ['genital_vulva_clitoris', 'Vulva & Klitoris'],
    ['anal_perineum', 'Anal & Damm'],
    ['limbs_hands_wrists', 'Handgelenke & Hände'],
    ['limbs_legs', 'Beine & Knöchel']
  ];
  const VISION_MODELS = ['gemini-flash-latest', 'gemini-3.8-flash', 'gemini-3.5-flash-lite'];

  // Warteschlange der ausgewählten Fotos: [{ file, ready: Promise<{ processed, analysis }> }]
  let createQueue = [];
  let createIndex = 0;
  let createCurrent = null; // { processed, analysis } des angezeigten Fotos

  function buildVisionPrompt() {
    return [
      'Du hilfst einem erwachsenen Paar, seine eigene Erotik- und BDSM-Ausrüstung in einer privaten Inventar-App zu erfassen.',
      'Auf dem Foto ist ein einzelnes Ausrüstungsstück (z. B. Seil, Fessel, Halsband, Paddle, Peitsche, Vibrator, Dildo, Plug, Käfig, Knebel, Augenbinde, Klemmen, Möbel, Pflegeprodukt).',
      'Bestimme es so genau wie möglich und antworte ausschließlich mit diesem JSON-Objekt:',
      '{',
      '  "isEquipment": true,',
      '  "name": "kurzer deutscher Name mit Farbe/Material, z. B. Schwarzes Leder-Paddle mit Nieten",',
      '  "category": "' + TOY_CATEGORIES.map(c => c[0]).join(' | ') + '",',
      '  "somaticZone": "' + TOY_ZONES.map(z => z[0]).join(' | ') + '",',
      '  "materials": ["deutsche Materialnamen, z. B. Leder, Silikon, Edelstahl, Jute, Nylon"],',
      '  "isLatex": false,',
      '  "somaticEffect": "1–2 Sätze auf Deutsch: wie es sich anfühlt bzw. wirkt und wofür es typischerweise genutzt wird"',
      '}',
      'Regeln: category und somaticZone müssen exakt einer der genannten Werte sein. "stimulation" für Vibratoren, Dildos, Plugs, Masturbatoren und Massagestäbe.',
      'isLatex nur true, wenn das Material sichtbar Naturkautschuk/Latex ist. Wenn kein solcher Gegenstand zu sehen ist: {"isEquipment": false}.'
    ].join('\n');
  }

  function cleanAnalysis(raw) {
    if (!raw || typeof raw !== 'object') return null;
    if (raw.isEquipment === false) return { isEquipment: false };
    const pick = (val, list, fallback) => list.some(e => e[0] === val) ? val : fallback;
    const text = (val, max) => String(val == null ? '' : val).replace(/\s+/g, ' ').trim().slice(0, max);
    const materials = (Array.isArray(raw.materials) ? raw.materials : String(raw.materials || '').split(','))
      .map(m => text(m, 30)).filter(Boolean).slice(0, 6);
    return {
      isEquipment: true,
      name: text(raw.name, 80),
      category: pick(raw.category, TOY_CATEGORIES, ''),
      somaticZone: pick(raw.somaticZone, TOY_ZONES, ''),
      materials,
      isLatex: raw.isLatex === true,
      somaticEffect: text(raw.somaticEffect, 400)
    };
  }

  async function analyzeToyPhoto(processed) {
    const ai = window.AIAdapter;
    if (!ai || typeof ai.isGeminiAvailable !== 'function' || !ai.isGeminiAvailable()) return { ok: false, reason: 'no_ai' };
    for (const model of VISION_MODELS) {
      try {
        const res = await ai.geminiFetch(model, {
          contents: [{ role: 'user', parts: [
            { text: buildVisionPrompt() },
            { inlineData: { mimeType: processed.mimeType || 'image/webp', data: processed.base64Payload } }
          ] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 4096, responseMimeType: 'application/json' }
        });
        if (res.status === 403) return { ok: false, reason: 'no_consent' };
        if (res.status === 429) return { ok: false, reason: 'quota' };
        if (res.status === 401) return { ok: false, reason: 'no_ai' };
        if (!res.ok) continue;
        const body = await res.json();
        const parts = body.candidates && body.candidates[0] && body.candidates[0].content && body.candidates[0].content.parts || [];
        const data = cleanAnalysis(ai.extractJson(parts.map(p => p.text || '').join('')));
        if (data) return { ok: true, data };
      } catch (e) {}
    }
    return { ok: false, reason: 'ai_failed' };
  }

  function prepareQueueItem(i) {
    const item = createQueue[i];
    if (!item || item.ready) return;
    item.ready = processPhoto(item.file)
      .then(processed => analyzeToyPhoto(processed).then(analysis => ({ processed, analysis })))
      .catch(() => ({ processed: null, analysis: { ok: false, reason: 'image' } }));
  }

  function setCreateStatus(text, tone) {
    const el = document.getElementById('custom-toy-ai-status');
    if (!el) return;
    el.textContent = text || '';
    el.style.color = tone === 'ok' ? '#4ade80' : tone === 'err' ? '#f87171' : '#94a3b8';
  }

  function setCreateField(id, value) {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.type === 'checkbox') el.checked = Boolean(value);
    else el.value = value || '';
  }

  function resetCreateForm() {
    setCreateField('custom-toy-input-name', '');
    setCreateField('custom-toy-select-category', 'bondage');
    setCreateField('custom-toy-select-zone', 'full_body');
    setCreateField('custom-toy-input-materials', '');
    setCreateField('custom-toy-input-effect', '');
    setCreateField('custom-toy-chk-latex', false);
    const img = document.getElementById('custom-toy-preview');
    if (img) { img.removeAttribute('src'); img.parentElement.style.display = 'none'; }
  }

  function updateCreateButtons() {
    const rest = createQueue.length - createIndex - 1;
    const counter = document.getElementById('custom-toy-queue-counter');
    if (counter) counter.textContent = createQueue.length > 1 ? `Foto ${createIndex + 1} von ${createQueue.length}` : '';
    const next = document.getElementById('custom-toy-btn-next');
    if (next) next.textContent = rest > 0 ? `Anlegen & nächstes (${rest}) →` : 'Anlegen & nächstes Foto 📷';
    const skip = document.getElementById('custom-toy-btn-skip');
    if (skip) skip.style.display = rest > 0 ? '' : 'none';
  }

  async function showQueueItem(i) {
    createIndex = i;
    createCurrent = null;
    resetCreateForm();
    updateCreateButtons();
    prepareQueueItem(i);
    prepareQueueItem(i + 1); // nächstes Foto schon im Hintergrund erkennen
    setCreateStatus('Foto wird vorbereitet und von der KI erkannt …');
    const result = await createQueue[i].ready;
    if (createIndex !== i || !document.getElementById('custom-toy-input-name')) return;
    createCurrent = result;
    if (result.processed) {
      const img = document.getElementById('custom-toy-preview');
      if (img) { img.src = result.processed.dataUrl; img.parentElement.style.display = ''; }
    }
    const a = result.analysis;
    if (a.ok && a.data.isEquipment) {
      const d = a.data;
      setCreateField('custom-toy-input-name', d.name);
      if (d.category) setCreateField('custom-toy-select-category', d.category);
      if (d.somaticZone) setCreateField('custom-toy-select-zone', d.somaticZone);
      setCreateField('custom-toy-input-materials', d.materials.join(', '));
      setCreateField('custom-toy-input-effect', d.somaticEffect);
      setCreateField('custom-toy-chk-latex', d.isLatex);
      setCreateStatus('✓ Von der KI ausgefüllt – kurz prüfen und anlegen.', 'ok');
      return;
    }
    const reasons = {
      no_ai: 'Ohne KI-Zugang: bitte die Felder selbst ausfüllen. Das Foto wird trotzdem gespeichert.',
      no_consent: 'KI-Übermittlung nicht freigegeben: bitte die Felder selbst ausfüllen.',
      quota: 'Das KI-Tageskontingent ist aufgebraucht: bitte die Felder selbst ausfüllen.',
      image: 'Dieses Bild konnte nicht gelesen werden.',
      ai_failed: 'Die KI konnte das Foto nicht auswerten: bitte die Felder selbst ausfüllen.'
    };
    if (a.ok) setCreateStatus('Auf dem Foto wurde kein Ausrüstungsstück erkannt. Bitte selbst ausfüllen oder überspringen.', 'err');
    else setCreateStatus(reasons[a.reason] || reasons.ai_failed, 'err');
  }

  function startPhotoQueue(fileList) {
    const files = Array.from(fileList || []).filter(f => f && (!f.type || f.type.startsWith('image/'))).slice(0, 50);
    if (!files.length) return;
    createQueue = files.map(file => ({ file, ready: null }));
    showQueueItem(0);
  }

  function openCreateCustomToyModal() {
    const modal = document.getElementById('hub-toys-create-modal');
    if (!modal) return;
    createQueue = [];
    createIndex = 0;
    createCurrent = null;

    const options = (list) => list.map(([v, l]) => `<option value="${v}">${escapeHtml(l)}</option>`).join('');

    modal.innerHTML = `
      <div class="bg-[#090d14] rounded-3xl max-w-lg w-full border border-[#c5a880]/70 p-5 space-y-4 shadow-2xl text-xs text-[#f8fafc] font-sans max-h-[92dvh] overflow-y-auto pb-[max(env(safe-area-inset-bottom),16px)]">
        
        <div class="flex items-center justify-between border-b border-[#2a364f] pb-3">
          <div>
            <span class="text-[9.5px] font-mono uppercase tracking-wider text-[#c5a880] font-bold block">Hardware-Atelier</span>
            <h3 class="text-sm sm:text-base font-serif text-white font-bold mt-0.5">+ Eigenes Ausrüstungsstück anlegen</h3>
          </div>
          <button type="button" onclick="HubToys.closeCreateModal()" class="w-8 h-8 rounded-xl bg-[#000000] border border-[#2a364f] text-[#94a3b8] hover:text-white flex items-center justify-center touch-btn">✕</button>
        </div>

        <!-- FOTO ZUERST: DIE KI FÜLLT DIE FELDER AUS -->
        <div class="p-3 rounded-2xl bg-[#000000] border border-[#c5a880]/50 space-y-2.5">
          <p class="text-[11px] text-[#94a3b8] leading-relaxed">Fotografiere das Toy – die KI erkennt es und füllt alle Felder aus. Mit mehreren Fotos aus der Galerie legst du viele Toys nacheinander an.</p>
          <div class="grid grid-cols-2 gap-2 font-mono">
            <label class="px-3 py-2.5 rounded-xl bg-[#c5a880] text-black font-bold text-xs text-center cursor-pointer touch-btn">📷 Foto aufnehmen
              <input type="file" id="custom-toy-file-camera" accept="image/*" capture="environment" class="hidden" onchange="HubToys.handleCreatePhotos(this)" />
            </label>
            <label class="px-3 py-2.5 rounded-xl bg-[#090d14] border border-[#c5a880] text-[#c5a880] font-bold text-xs text-center cursor-pointer touch-btn">🖼 Mehrere Fotos
              <input type="file" id="custom-toy-file-photo" accept="image/*" multiple class="hidden" onchange="HubToys.handleCreatePhotos(this)" />
            </label>
          </div>
          <div class="flex items-center gap-3" style="display:none">
            <img id="custom-toy-preview" alt="Foto des Toys" class="w-20 h-20 rounded-xl object-cover border border-[#2a364f] shrink-0" />
            <span id="custom-toy-queue-counter" class="text-[10px] font-mono text-[#c5a880] font-bold"></span>
          </div>
          <p id="custom-toy-ai-status" class="text-[11px] leading-relaxed min-h-[1em]" role="status"></p>
        </div>

        <div class="space-y-3 font-mono">
          <div>
            <label class="text-[10px] text-[#c5a880] uppercase block mb-1 font-bold">Bezeichnung / Name des Toys:</label>
            <input type="text" id="custom-toy-input-name" placeholder="z. B. Dickes Hanfseil 8mm, Rotes Samt-Paddle..." class="w-full p-2.5 bg-[#000000] border border-[#2a364f] rounded-xl text-white text-xs font-sans focus:border-[#c5a880] focus:outline-none" />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label class="text-[10px] text-[#94a3b8] uppercase block mb-1 font-bold">Kategorie:</label>
              <select id="custom-toy-select-category" class="w-full text-xs p-2.5 bg-[#000000] border border-[#2a364f] rounded-xl text-white focus:border-[#c5a880]">
                ${options(TOY_CATEGORIES)}
              </select>
            </div>

            <div>
              <label class="text-[10px] text-[#94a3b8] uppercase block mb-1 font-bold">Somatische Zone:</label>
              <select id="custom-toy-select-zone" class="w-full text-xs p-2.5 bg-[#000000] border border-[#2a364f] rounded-xl text-white focus:border-[#c5a880]">
                ${options(TOY_ZONES)}
              </select>
            </div>
          </div>

          <div>
            <label class="text-[10px] text-[#94a3b8] uppercase block mb-1 font-bold">Materialien (kommagetrennt):</label>
            <input type="text" id="custom-toy-input-materials" placeholder="z. B. Leder, Edelstahl, Hanf, Silikon..." class="w-full p-2.5 bg-[#000000] border border-[#2a364f] rounded-xl text-white text-xs font-sans focus:border-[#c5a880] focus:outline-none" />
          </div>

          <div>
            <label class="text-[10px] text-[#94a3b8] uppercase block mb-1 font-bold">Wirkung / Haptische Beschreibung:</label>
            <textarea id="custom-toy-input-effect" rows="2" placeholder="z. B. Liegt sehr schwer in der Hand, dumpfer Schlagklang..." class="w-full p-2.5 bg-[#000000] border border-[#2a364f] rounded-xl text-white text-xs font-sans focus:border-[#c5a880] focus:outline-none"></textarea>
          </div>

          <!-- RACK LATEX RADAR CHECKBOX -->
          <label class="p-3 rounded-xl bg-[#000000] border border-[#2a364f] flex items-center justify-between cursor-pointer">
            <span class="text-white text-xs">Enthält Naturkautschuk (Latex):</span>
            <input type="checkbox" id="custom-toy-chk-latex" class="accent-[#991b1b] rounded" />
          </label>
        </div>

        <div class="pt-2 border-t border-[#2a364f] flex flex-wrap justify-end gap-2 font-mono">
          <button type="button" id="custom-toy-btn-skip" onclick="HubToys.skipCreatePhoto()" style="display:none" class="px-4 py-2.5 bg-[#000000] border border-[#2a364f] text-[#94a3b8] font-bold rounded-xl text-xs touch-btn">Überspringen</button>
          <button type="button" id="custom-toy-btn-next" onclick="HubToys.submitCreateCustomToy('next')" class="px-4 py-2.5 bg-[#000000] border border-[#c5a880] text-[#c5a880] font-bold rounded-xl text-xs touch-btn">Anlegen & nächstes Foto 📷</button>
          <button type="button" onclick="HubToys.submitCreateCustomToy('done')" class="px-5 py-2.5 bg-[#c5a880] hover:bg-[#dfcaa9] text-black font-bold rounded-xl text-xs touch-btn shadow-md">Anlegen ✓</button>
        </div>
      </div>
    `;

    modal.style.display = 'flex';
  }

  function closeCreateModal() {
    createQueue = [];
    createCurrent = null;
    const modal = document.getElementById('hub-toys-create-modal');
    if (modal) modal.style.display = 'none';
  }

  function skipCreatePhoto() {
    if (createIndex + 1 < createQueue.length) showQueueItem(createIndex + 1);
  }

  // mode: 'done' = anlegen und schließen, 'next' = anlegen und nächstes Foto
  function submitCreateCustomToy(mode) {
    const nameInput = document.getElementById('custom-toy-input-name');
    const catSelect = document.getElementById('custom-toy-select-category');
    const zoneSelect = document.getElementById('custom-toy-select-zone');
    const matInput = document.getElementById('custom-toy-input-materials');
    const effInput = document.getElementById('custom-toy-input-effect');
    const latexChk = document.getElementById('custom-toy-chk-latex');

    const name = nameInput ? nameInput.value.trim() : '';
    if (!name) {
      showToast(createQueue.length && !createCurrent ? "Die KI ist noch nicht fertig – einen Moment." : "Bitte gib dem Toy eine Bezeichnung.");
      return;
    }

    const toyId = `custom_${Date.now()}`;
    const category = catSelect ? catSelect.value : 'bondage';
    const somaticZone = zoneSelect ? zoneSelect.value : 'full_body';
    const materials = (matInput && matInput.value.trim()) 
      ? matInput.value.split(',').map(m => m.trim()).filter(Boolean) 
      : ['unbekannt'];
    const somaticEffect = (effInput && effInput.value.trim()) 
      ? effInput.value.trim() 
      : 'Individuelles Ausrüstungsstück des Paares.';
    const isLatex = latexChk ? latexChk.checked : false;

    // DoF Profil ableiten
    const dofImpact = {};
    if (somaticZone === 'head_mouth') dofImpact.speech_articulation = 0.0;
    if (somaticZone === 'head_eyes') dofImpact.visual_perception = 0.0;
    if (somaticZone === 'genital_penile') dofImpact.penile_shaft_access = 0.0;
    if (somaticZone === 'limbs_hands_wrists') dofImpact.manual_manipulation = 0.1;

    const newToy = {
      id: toyId,
      name: name,
      category: category,
      tags: [category, 'custom'],
      somaticZone: somaticZone,
      restraintLayer: (category === 'furniture' || somaticZone.includes('hands')) ? 1 : 0,
      materials: materials,
      isLatex: isLatex,
      isCustom: true,
      somaticEffect: somaticEffect,
      dofImpact: dofImpact,
      safetyProtocol: {
        inspectionCheck: 'Vor jeder Session auf sauberen Zustand und feste Nähte/Verschlüsse prüfen.',
        disinfectionMethod: 'isopropanol_wipe',
        aftercareInstruction: 'Nach der Session sorgfältig reinigen, desinfizieren und trocken lagern.'
      }
    };

    const customs = getCustomToys();
    customs.push(newToy);
    saveCustomToysToStorage(customs);

    // Automatisch als "Im Besitz" markieren
    const owned = getOwnedToyIds();
    if (!owned.includes(toyId)) {
      owned.push(toyId);
      saveOwnedToyIds(owned);
    }

    const photo = createCurrent && createCurrent.processed;
    if (photo) savePhotoForToy(toyId, photo).then(() => updateInventoryGridOnly()).catch(() => {});

    showToast(`✓ „${name}“ angelegt!`);
    renderClosetView();
    updateHeaderCounters();

    if (mode === 'next' && createIndex + 1 < createQueue.length) {
      showQueueItem(createIndex + 1);
    } else if (mode === 'next') {
      // Kamera direkt wieder öffnen (muss im selben Tipp passieren, sonst blockiert das Handy)
      createQueue = [];
      createCurrent = null;
      resetCreateForm();
      updateCreateButtons();
      setCreateStatus('');
      const cam = document.getElementById('custom-toy-file-camera');
      if (cam) { cam.value = ''; cam.click(); }
    } else {
      closeCreateModal();
    }
  }

  function deleteCustomToy(toyId) {
    let customs = getCustomToys();
    customs = customs.filter(t => t.id !== toyId);
    saveCustomToysToStorage(customs);

    // Aus Owned entfernen
    let owned = getOwnedToyIds();
    owned = owned.filter(id => id !== toyId);
    saveOwnedToyIds(owned);

    removePhotoForToy(toyId);

    const modal = document.getElementById('hub-toys-inspector-modal');
    if (modal) modal.style.display = 'none';

    showToast("Ausrüstungsstück gelöscht.");
    renderClosetView();
    updateHeaderCounters();
  }

  function assignToyToSlot(slotIndex, toyId) {
    const redundancyCheck = checkBundleRedundancy(wizardState.selectedToyIds.filter((_, i) => i !== slotIndex), toyId);
    if (redundancyCheck.hasConflict) {
      showToast(redundancyCheck.reason);
      return;
    }

    wizardState.selectedToyIds[slotIndex] = toyId;
    showToast("Werkzeug dem Slot zugewiesen ✓");

    if (slotIndex < wizardState.targetSlotCount - 1 && !wizardState.selectedToyIds[slotIndex + 1]) {
      wizardState.currentStepIndex = slotIndex + 1;
    }

    renderClosetView();
  }

  function removeToyFromSlot(slotIndex) {
    wizardState.selectedToyIds.splice(slotIndex, 1);
    renderClosetView();
  }

  // Eingabefenster im TACTUS-Design (statt window.prompt); liefert den Text oder null
  function askText({ kicker = '', title = '', value = '', placeholder = '', confirmLabel = 'Speichern ✓' }) {
    return new Promise(resolve => {
      const wrap = document.createElement('div');
      wrap.className = 'fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4';
      wrap.style.zIndex = '2000';
      wrap.innerHTML = `
        <div class="bg-[#090d14] rounded-3xl max-w-sm w-full border border-[#c5a880]/70 p-5 space-y-4 shadow-2xl font-sans" role="dialog" aria-modal="true">
          <div>
            ${kicker ? `<span class="text-[9.5px] font-mono uppercase tracking-wider text-[#c5a880] font-bold block">${escapeHtml(kicker)}</span>` : ''}
            <h3 class="text-base font-serif text-white font-bold mt-0.5">${escapeHtml(title)}</h3>
          </div>
          <input type="text" maxlength="60" value="${escapeHtml(value)}" placeholder="${escapeHtml(placeholder)}" class="w-full p-3 bg-[#000000] border border-[#2a364f] rounded-xl text-white text-base focus:border-[#c5a880] focus:outline-none" />
          <div class="flex justify-end gap-2 font-mono">
            <button type="button" data-act="cancel" class="px-4 py-2.5 bg-[#000000] border border-[#2a364f] text-[#94a3b8] font-bold rounded-xl text-xs touch-btn">Abbrechen</button>
            <button type="button" data-act="ok" class="px-5 py-2.5 bg-[#c5a880] hover:bg-[#dfcaa9] text-black font-bold rounded-xl text-xs touch-btn shadow-md">${escapeHtml(confirmLabel)}</button>
          </div>
        </div>`;
      document.body.appendChild(wrap);
      const input = wrap.querySelector('input');
      const close = (result) => { wrap.remove(); resolve(result); };
      const submit = () => {
        const text = input.value.trim();
        if (!text) { input.focus(); input.style.borderColor = '#f87171'; return; }
        close(text);
      };
      wrap.querySelector('[data-act="ok"]').addEventListener('click', submit);
      wrap.querySelector('[data-act="cancel"]').addEventListener('click', () => close(null));
      wrap.addEventListener('click', (ev) => { if (ev.target === wrap) close(null); });
      input.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') { ev.preventDefault(); submit(); }
        if (ev.key === 'Escape') close(null);
      });
      setTimeout(() => { input.focus(); input.select(); }, 30);
    });
  }

  function finalizeAndStageBundle() {
    const validIds = wizardState.selectedToyIds.filter(Boolean);
    if (validIds.length === 0) {
      showToast("Bitte weise mindestens einem Slot ein Werkzeug zu.");
      return;
    }

    askText({
      kicker: 'Toy-Kit Wizard',
      title: 'Wie soll dieses Set heißen?',
      value: `Set ${new Date().toLocaleDateString('de-DE')}`,
      placeholder: 'z. B. Freitagabend, Seil & Feder …',
      confirmLabel: 'Set speichern ✓'
    }).then(name => { if (name) saveAndStageBundle(name, validIds); });
  }

  function saveAndStageBundle(bundleName, validIds) {
    const bundleObj = {
      id: `bundle_${Date.now()}`,
      name: bundleName.trim(),
      toyIds: validIds,
      createdAt: Date.now()
    };

    saveBundleToStorage(bundleObj);

    try {
      localStorage.setItem(STORAGE_KEY_STAGING_BUNDLE, JSON.stringify(validIds));
    } catch (e) {}

    showToast(`✓ Set „${bundleObj.name}“ gesichert & für Session übernommen!`);

    const modal = document.getElementById('hub-toys-modal');
    if (modal) modal.style.display = 'none';

    if (window.location.pathname.includes('session.html')) {
      if (window.SessionStaging && typeof window.SessionStaging.renderEquipment === 'function') {
        window.SessionStaging.renderEquipment();
      }
    } else {
      setTimeout(() => {
        window.location.href = 'session.html#view=staging';
      }, 350);
    }
  }

  function stageExistingBundle(index) {
    const bundles = getSavedBundles();
    const b = bundles[index];
    if (!b || !Array.isArray(b.toyIds)) return;

    try {
      localStorage.setItem(STORAGE_KEY_STAGING_BUNDLE, JSON.stringify(b.toyIds));
    } catch (e) {}

    showToast(`✓ Set „${b.name}“ für Schlafzimmer-Session übernommen!`);

    const modal = document.getElementById('hub-toys-modal');
    if (modal) modal.style.display = 'none';

    setTimeout(() => {
      window.location.href = 'session.html#view=staging';
    }, 300);
  }

  const api = {
    init: initClosetView,
    open: openClosetModal,
    render: renderClosetView,
    switchMainTab: function(tabKey) {
      currentMainTab = tabKey;
      renderClosetView();
    },
    setCategoryFilter: function(catId) {
      activeCategoryFilter = catId;
      ['all', 'custom', 'bondage', 'impact', 'stimulation', 'chastity', 'sensory', 'furniture', 'care'].forEach(cid => {
        const btn = document.getElementById(`cat-filter-btn-${cid}`);
        if (btn) {
          btn.className = (cid === catId)
            ? "px-2.5 py-1.5 rounded-xl font-bold whitespace-nowrap shrink-0 flex-shrink-0 transition-all touch-btn bg-[#000000] border border-[#c5a880] text-[#c5a880]"
            : "px-2.5 py-1.5 rounded-xl font-bold whitespace-nowrap shrink-0 flex-shrink-0 transition-all touch-btn bg-[#090d14] border border-[#2a364f] text-[#94a3b8] hover:text-white";
        }
      });
      updateInventoryGridOnly();
    },
    handleSearchInput: function(val) {
      activeSearchQuery = val;
      updateInventoryGridOnly();
    },
    clearSearch: function() {
      activeSearchQuery = '';
      const input = document.getElementById('inventory-search-input');
      if (input) {
        input.value = '';
        input.focus();
      }
      updateInventoryGridOnly();
    },
    toggleOwned: toggleToyOwned,
    getOwned: getOwnedToyIds,
    inspectToy: openToyInspector,
    handlePhotoInput: handlePhotoInput,
    deletePhoto: deletePhoto,
    openCreateCustomToyModal: openCreateCustomToyModal,
    submitCreateCustomToy: submitCreateCustomToy,
    deleteCustomToy: deleteCustomToy,
    saveInspectorNote: function(toyId) {
      const input = document.getElementById('inspector-input-note');
      if (input) saveToyCustomNote(toyId, input.value);
      const modal = document.getElementById('hub-toys-inspector-modal');
      if (modal) modal.style.display = 'none';
      showToast("Notiz gesichert ✓");
      updateInventoryGridOnly();
    },
    setWizardSlotCount: function(count) {
      wizardState.targetSlotCount = Math.max(3, Math.min(6, parseInt(count, 10) || 4));
      if (wizardState.currentStepIndex >= wizardState.targetSlotCount) {
        wizardState.currentStepIndex = wizardState.targetSlotCount - 1;
      }
      renderClosetView();
    },
    goToWizardStep: function(stepIndex) {
      wizardState.currentStepIndex = stepIndex;
      renderClosetView();
    },
    nextWizardStep: function() {
      if (wizardState.currentStepIndex < wizardState.targetSlotCount - 1) {
        wizardState.currentStepIndex++;
        renderClosetView();
      }
    },
    prevWizardStep: function() {
      if (wizardState.currentStepIndex > 0) {
        wizardState.currentStepIndex--;
        renderClosetView();
      }
    },
    setWizardCategoryFilter: function(catId) {
      wizardCategoryFilter = catId;
      renderClosetView();
    },
    handleWizardSearchInput: function(val) {
      wizardSearchQuery = val;
      renderClosetView();
    },
    handleCreatePhotos: function(inputEl) { startPhotoQueue(inputEl.files); inputEl.value = ''; },
    skipCreatePhoto: skipCreatePhoto,
    closeCreateModal: closeCreateModal,
    assignToyToSlot: assignToyToSlot,
    removeToyFromSlot: removeToyFromSlot,
    finalizeAndStageBundle: finalizeAndStageBundle,
    stageExistingBundle: stageExistingBundle,
    deleteBundle: deleteSavedBundle,
    getAllToys: getAllToysCombined
  };

  window.HubToys = api;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const container = document.getElementById('hub-toys-closet-container');
      if (container) api.init('hub-toys-closet-container');
    });
  } else {
    const container = document.getElementById('hub-toys-closet-container');
    if (container) api.init('hub-toys-closet-container');
  }

})(typeof window !== 'undefined' ? window : this);
