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

  function getToyPhotos() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_TOY_PHOTOS);
      if (raw) return JSON.parse(raw) || {};
    } catch (e) {}
    return {};
  }

  function getPhotoForToy(toyId) {
    const photos = getToyPhotos();
    return photos[toyId] || null;
  }

  function savePhotoForToy(toyId, dataUrl) {
    const photos = getToyPhotos();
    photos[toyId] = dataUrl;
    try {
      localStorage.setItem(STORAGE_KEY_TOY_PHOTOS, JSON.stringify(photos));
    } catch (e) {
      console.warn("[TACTUS HubToys] Lokaler Fotospeicher voll, versuche IndexedDB:", e);
    }
    // Falls HubPhotos vorhanden ist, dort ebenfalls registrieren
    if (window.HubPhotos && typeof window.HubPhotos.savePhoto === 'function') {
      try { window.HubPhotos.savePhoto(`toy_${toyId}`, dataUrl); } catch (e) {}
    }
  }

  function removePhotoForToy(toyId) {
    const photos = getToyPhotos();
    delete photos[toyId];
    try {
      localStorage.setItem(STORAGE_KEY_TOY_PHOTOS, JSON.stringify(photos));
    } catch (e) {}
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
  }

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
                <div class="p-3 rounded-2xl border transition-all flex flex-col justify-between ${isSelectedForThisSlot ? 'bg-[#000000] border-[#c5a880] shadow-md' : (isBlocked ? 'opacity-40 border-[#450a0a] bg-[#000000]' : 'bg-[#000000] border-[#2a364f] hover:border-slate-600')}">
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

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      savePhotoForToy(toyId, dataUrl);
      showToast("✓ Foto der Ausrüstung gesichert!");
      openToyInspector(toyId);
      updateInventoryGridOnly();
    };
    reader.readAsDataURL(file);
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

  function openCreateCustomToyModal() {
    const modal = document.getElementById('hub-toys-create-modal');
    if (!modal) return;

    modal.innerHTML = `
      <div class="bg-[#090d14] rounded-3xl max-w-lg w-full border border-[#c5a880]/70 p-5 space-y-4 shadow-2xl text-xs text-[#f8fafc] font-sans max-h-[92dvh] overflow-y-auto pb-[max(env(safe-area-inset-bottom),16px)]">
        
        <div class="flex items-center justify-between border-b border-[#2a364f] pb-3">
          <div>
            <span class="text-[9.5px] font-mono uppercase tracking-wider text-[#c5a880] font-bold block">Hardware-Atelier</span>
            <h3 class="text-sm sm:text-base font-serif text-white font-bold mt-0.5">+ Eigenes Ausrüstungsstück anlegen</h3>
          </div>
          <button type="button" onclick="document.getElementById('hub-toys-create-modal').style.display='none'" class="w-8 h-8 rounded-xl bg-[#000000] border border-[#2a364f] text-[#94a3b8] hover:text-white flex items-center justify-center touch-btn">✕</button>
        </div>

        <p class="text-[11px] text-[#94a3b8] leading-relaxed">
          Füge reale Peitschen, Seile, Käfige oder Spezial-Equipment eures Paares hinzu. Das Toy fließt sofort in eure Inventarverwaltung und den Wizard ein.
        </p>

        <div class="space-y-3 font-mono">
          <div>
            <label class="text-[10px] text-[#c5a880] uppercase block mb-1 font-bold">Bezeichnung / Name des Toys:</label>
            <input type="text" id="custom-toy-input-name" placeholder="z. B. Dickes Hanfseil 8mm, Rotes Samt-Paddle..." class="w-full p-2.5 bg-[#000000] border border-[#2a364f] rounded-xl text-white text-xs font-sans focus:border-[#c5a880] focus:outline-none" />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label class="text-[10px] text-[#94a3b8] uppercase block mb-1 font-bold">Kategorie:</label>
              <select id="custom-toy-select-category" class="w-full text-xs p-2.5 bg-[#000000] border border-[#2a364f] rounded-xl text-white focus:border-[#c5a880]">
                <option value="bondage">Bondage &amp; Seile</option>
                <option value="impact">Impact &amp; Zucht</option>
                <option value="chastity">Keuschheit &amp; Genital</option>
                <option value="sensory">Sinnesentzug &amp; Masken</option>
                <option value="furniture">Möbel &amp; Arretierung</option>
                <option value="care">Pflege &amp; Aftercare</option>
              </select>
            </div>

            <div>
              <label class="text-[10px] text-[#94a3b8] uppercase block mb-1 font-bold">Somatische Zone:</label>
              <select id="custom-toy-select-zone" class="w-full text-xs p-2.5 bg-[#000000] border border-[#2a364f] rounded-xl text-white focus:border-[#c5a880]">
                <option value="full_body">Ganzkörper (full_body)</option>
                <option value="gluteal_pelvis">Gesäß &amp; Becken (gluteal_pelvis)</option>
                <option value="genital_penile">Penis / Schaft (genital_penile)</option>
                <option value="genital_testicles">Hoden (genital_testicles)</option>
                <option value="genital_vulva_clitoris">Vulva &amp; Klitoris</option>
                <option value="anal_perineum">Anal &amp; Damm (anal_perineum)</option>
                <option value="head_mouth">Mund (Knebel)</option>
                <option value="head_eyes">Augen (Augenbinde)</option>
                <option value="limbs_hands_wrists">Handgelenke &amp; Hände</option>
                <option value="limbs_legs">Beine &amp; Knöchel</option>
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

          <!-- DIREKTE FOTO-AUFNAHME BEIM ERSTELLEN -->
          <div class="p-3 rounded-xl bg-[#000000] border border-[#2a364f] space-y-2">
            <span class="text-[10px] text-[#c5a880] uppercase block font-bold">Foto der Ausrüstung anfügen (optional):</span>
            <input type="file" id="custom-toy-file-photo" accept="image/*" class="w-full text-[10px] text-[#94a3b8] file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-mono file:bg-[#090d14] file:text-[#c5a880]" />
          </div>
        </div>

        <div class="pt-2 border-t border-[#2a364f] flex justify-end gap-2 font-mono">
          <button type="button" onclick="document.getElementById('hub-toys-create-modal').style.display='none'" class="px-4 py-2.5 bg-[#000000] border border-[#2a364f] text-[#94a3b8] font-bold rounded-xl text-xs touch-btn">Abbrechen</button>
          <button type="button" onclick="HubToys.submitCreateCustomToy()" class="px-5 py-2.5 bg-[#c5a880] hover:bg-[#dfcaa9] text-black font-bold rounded-xl text-xs touch-btn shadow-md">Toy anlegen ✓</button>
        </div>
      </div>
    `;

    modal.style.display = 'flex';
  }

  function submitCreateCustomToy() {
    const nameInput = document.getElementById('custom-toy-input-name');
    const catSelect = document.getElementById('custom-toy-select-category');
    const zoneSelect = document.getElementById('custom-toy-select-zone');
    const matInput = document.getElementById('custom-toy-input-materials');
    const effInput = document.getElementById('custom-toy-input-effect');
    const latexChk = document.getElementById('custom-toy-chk-latex');
    const fileInput = document.getElementById('custom-toy-file-photo');

    const name = nameInput ? nameInput.value.trim() : '';
    if (!name) {
      showToast("Bitte gib dem Toy eine Bezeichnung.");
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

    // Foto verarbeiten falls ausgewählt
    const file = fileInput && fileInput.files && fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        savePhotoForToy(toyId, e.target.result);
        finalizeToyCreation(name);
      };
      reader.readAsDataURL(file);
    } else {
      finalizeToyCreation(name);
    }
  }

  function finalizeToyCreation(toyName) {
    const modal = document.getElementById('hub-toys-create-modal');
    if (modal) modal.style.display = 'none';

    showToast(`✓ „${toyName}“ erfolgreich angelegt!`);
    renderClosetView();
    updateHeaderCounters();
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

  function finalizeAndStageBundle() {
    const validIds = wizardState.selectedToyIds.filter(Boolean);
    if (validIds.length === 0) {
      showToast("Bitte weise mindestens einem Slot ein Werkzeug zu.");
      return;
    }

    const bundleName = prompt("Name für dieses Session-Set eingeben:", `Set ${new Date().toLocaleDateString('de-DE')}`);
    if (!bundleName) return;

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
      ['all', 'custom', 'bondage', 'impact', 'chastity', 'sensory', 'furniture', 'care'].forEach(cid => {
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
