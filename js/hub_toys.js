/**
 * js/hub_toys.js
 * TACTUS Ausrüstungsschrank, Hardware-Atelier & Evolvierter Toy-Kit Wizard (V3.0 Haute-Horlogerie)
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien nach Master-Roadbook:
 * - 100 % UTF-8 Integrität: Echte deutsche Umlaute (ä, ö, ü, ß) im gesamten Modul
 * - Haute-Horlogerie Palette: OLED-Tiefschwarz, Graphit, Champagner-Gold, Malachit, Cognac & Bordeaux
 * - Punkt #9 (Evolvierter Toy-Kit Wizard):
 *     • Dynamische Slot-Anzahl: Wählbar 3 bis 6 Toys pro Session-Set
 *     • Duale Navigation: Weiterschaltung per [Weiter →]/[← Zurück] UND direkt über anklickbare Schritt-Tabs
 *     • Psychometrische Live-KI-Vorschläge: Priorisiert Toys passend zu euren 505 Fragebogen-Antworten
 *     • Ausschluss anatomischer Redundanzen: Verhindert DoF-Kollisionen (z. B. niemals zwei Knebel oder zwei Käfige)
 * - Umfassende Inventar-Verwaltung: Besitztümer, individuelle Ringgrößen/Notizen & Latex-Allergie-Radar
 * - Direkte Staging-Kopplung: 1-Klick Übergabe an tactus_staging_bundle & session.html
 * - Keine window.alert() / confirm() Aufrufe, sichere Toasts
 */

(function(window) {
  'use strict';

  const STORAGE_KEY_OWNED = 'tactus_owned_equipment';
  const STORAGE_KEY_OWNED_LEGACY = 'kompass_owned_equipment';
  const STORAGE_KEY_CUSTOM_NOTES = 'tactus_toy_custom_notes';
  const STORAGE_KEY_SAVED_BUNDLES = 'tactus_saved_bundles';
  const STORAGE_KEY_STAGING_BUNDLE = 'tactus_staging_bundle';
  const STORAGE_KEY_MEDICAL_PASS = 'tactus_medical_pass';
  const STORAGE_KEY_ANSWERS = 'kompass_answers';

  let currentMainTab = 'inventory'; // 'inventory' | 'wizard' | 'bundles'
  let activeCategoryFilter = 'all';
  let activeSearchQuery = '';
  let activeInspectorToyId = null;

  // Wizard State (Punkt #9)
  let wizardState = {
    targetSlotCount: 4, // 3, 4, 5, 6 Slots
    currentStepIndex: 0,
    selectedToyIds: [],
    customBundleName: 'Session-Set',
    suggestedToyIds: []
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
    renderClosetView();
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

  function computePsychometricToySuggestions() {
    let topRole = 'A';
    let bottomRole = 'B';
    if (window.HubContext && typeof window.HubContext.getRoles === 'function') {
      const r = window.HubContext.getRoles();
      topRole = r.topRole;
      bottomRole = r.bottomRole;
    }

    let answers = {};
    try {
      const raw = localStorage.getItem(STORAGE_KEY_ANSWERS);
      if (raw) answers = JSON.parse(raw) || {};
    } catch (e) {}

    const ansTop = answers[topRole] || {};
    const ansBottom = answers[bottomRole] || {};

    let catalog = [];
    if (window.EquipmentCatalog && typeof window.EquipmentCatalog.getAll === 'function') {
      catalog = window.EquipmentCatalog.getAll();
    }

    const scoredToys = catalog.map(toy => {
      let matchScore = 0;
      let matchedReason = 'Vielseitige Basisausstattung';

      // 1. Bondage / Shibari Präferenz (Kapitel 10 & 13)
      if (toy.category === 'bondage') {
        const sRopeTop = ansTop['it_52_r1'] || 0;
        const sRopeSub = ansBottom['it_52_r2'] || 0;
        const sCuffsTop = ansTop['it_51_r1'] || 0;
        const sCuffsSub = ansBottom['it_51_r2'] || 0;

        if (sRopeTop >= 4 && sRopeSub >= 4) {
          matchScore += 8;
          matchedReason = 'Hohe Synergie bei Shibari & Seilen (Kap. 10)';
        } else if (sCuffsTop >= 4 && sCuffsSub >= 4) {
          matchScore += 6;
          matchedReason = 'Hohe Resonanz auf feste Fesseln';
        }
      }

      // 2. Impact / Spanking Präferenz (Kapitel 11, 16)
      if (toy.category === 'impact') {
        const sPaddleTop = ansTop['it_62_r1'] || 0;
        const sPaddleSub = ansBottom['it_62_r2'] || 0;
        const sFloggerTop = ansTop['it_61_r1'] || 0;
        const sFloggerSub = ansBottom['it_61_r2'] || 0;

        if (sPaddleTop >= 4 && sPaddleSub >= 4) {
          matchScore += 9;
          matchedReason = '5/5 Spitzenpräferenz für Paddles & Zucht (Kap. 16)';
        } else if (sFloggerTop >= 4 && sFloggerSub >= 4) {
          matchScore += 7;
          matchedReason = 'Hohe Resonanz auf sanfte Flogger-Hiebe';
        }
      }

      // 3. Keuschheit (Kapitel 7, 8)
      if (toy.category === 'chastity') {
        const sCageTop = ansTop['it_41_r1'] || 0;
        const sCageSub = ansBottom['it_41_r2'] || 0;
        if (sCageTop >= 4 && sCageSub >= 3) {
          matchScore += 10;
          matchedReason = 'Schlüsselgewalt & Keuschheit befürwortet (Kap. 8)';
        }
      }

      // 4. Sensorik / Augenbinde (Kapitel 13, 15)
      if (toy.category === 'sensory') {
        const sBlindTop = ansTop['it_66_r1'] || 0;
        const sBlindSub = ansBottom['it_66_r2'] || 0;
        const sWaxTop = ansTop['it_67_r1'] || 0;
        const sWaxSub = ansBottom['it_67_r2'] || 0;

        if (sBlindTop >= 4 && sBlindSub >= 4) {
          matchScore += 8;
          matchedReason = 'Doppel-Spitze bei Sinnesentzug & Blindfold';
        } else if (sWaxTop >= 4 && sWaxSub >= 4) {
          matchScore += 7;
          matchedReason = 'Hohe Resonanz auf Temperatur- & Wachsreize';
        }
      }

      // 5. Care / Nachsorge (Kapitel 18)
      if (toy.category === 'care') {
        matchScore += 5;
        matchedReason = 'Empfohlene Vagus-Erdung & Aftercare';
      }

      return {
        toyId: toy.id,
        score: matchScore,
        reason: matchedReason
      };
    });

    scoredToys.sort((a, b) => b.score - a.score);
    return scoredToys;
  }

  function checkBundleRedundancy(selectedIds, candidateToyId) {
    let catalog = [];
    if (window.EquipmentCatalog && typeof window.EquipmentCatalog.getAll === 'function') {
      catalog = window.EquipmentCatalog.getAll();
    }

    const candidateToy = catalog.find(t => t.id === candidateToyId);
    if (!candidateToy) return { hasConflict: false };

    // 1. Latex-Allergie prüfen
    let pass = {};
    try {
      const rawPass = localStorage.getItem(STORAGE_KEY_MEDICAL_PASS);
      if (rawPass) pass = JSON.parse(rawPass) || {};
    } catch (e) {}

    if (pass.hasLatexAllergy && candidateToy.isLatex) {
      return {
        hasConflict: true,
        reason: 'RACK-Konflikt: Dein Partner hat eine Latex-Allergie hinterlegt!'
      };
    }

    // 2. Anatomische Redundanzen prüfen
    const selectedToys = catalog.filter(t => selectedIds.includes(t.id));

    // Keine zwei verschiedenen Knebel gleichzeitig
    const candidateIsGag = candidateToy.tags.includes('gag') || candidateToy.somaticZone === 'head_mouth';
    if (candidateIsGag) {
      const existingGag = selectedToys.find(t => t.tags.includes('gag') || t.somaticZone === 'head_mouth');
      if (existingGag && existingGag.id !== candidateToy.id) {
        return {
          hasConflict: true,
          reason: `Anatomischer Konflikt: Mund ist bereits durch „${existingGag.name}“ belegt!`
        };
      }
    }

    // Keine zwei verschiedenen Peniskäfige gleichzeitig
    const candidateIsCage = candidateToy.tags.includes('chastity_cage') || candidateToy.category === 'chastity';
    if (candidateIsCage && candidateToy.somaticZone === 'genital_penile') {
      const existingCage = selectedToys.find(t => (t.tags.includes('chastity_cage') || t.category === 'chastity') && t.somaticZone === 'genital_penile');
      if (existingCage && existingCage.id !== candidateToy.id) {
        return {
          hasConflict: true,
          reason: `Anatomischer Konflikt: Penis ist bereits durch „${existingCage.name}“ verriegelt!`
        };
      }
    }

    // Keine zwei Augenbinden / Vollmasken gleichzeitig
    const candidateIsBlindfold = candidateToy.tags.includes('blindfold') || candidateToy.somaticZone === 'head_eyes';
    if (candidateIsBlindfold) {
      const existingBlind = selectedToys.find(t => t.tags.includes('blindfold') || t.somaticZone === 'head_eyes');
      if (existingBlind && existingBlind.id !== candidateToy.id) {
        return {
          hasConflict: true,
          reason: `Visueller Konflikt: Augen sind bereits durch „${existingBlind.name}“ verdeckt!`
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

  function renderClosetView() {
    const containerId = window._hubToysContainerId || 'hub-toys-closet-container';
    const container = document.getElementById(containerId);
    if (!container) return;

    const owned = getOwnedToyIds();
    const savedBundles = getSavedBundles();

    let pass = {};
    try {
      const rawPass = localStorage.getItem(STORAGE_KEY_MEDICAL_PASS);
      if (rawPass) pass = JSON.parse(rawPass) || {};
    } catch (e) {}

    container.innerHTML = `
      <div class="space-y-4 font-sans text-xs">
        
        <!-- HEADER KACHEL MIT SCHRANK-TELEMETRIE & LATEX-RADAR -->
        <div class="p-3.5 sm:p-4 rounded-2xl bg-[#000000] border border-[#2a364f] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div class="space-y-0.5">
            <span class="text-[9.5px] font-mono uppercase tracking-wider text-[#c5a880] font-bold block">
              Hardware-Inventar &amp; Session-Sets
            </span>
            <div class="flex items-center gap-2">
              <strong class="text-xs sm:text-sm text-white font-serif">${owned.length} Gegenstände im Paar-Besitz</strong>
              <span class="text-[#94a3b8]">·</span>
              <span class="text-[10px] font-mono text-[#d4af37] font-bold">${savedBundles.length} gespeicherte Sets</span>
            </div>
          </div>

          <!-- LATEX ALLERGIE STATUS RADAR -->
          <div class="flex items-center gap-2">
            ${pass.hasLatexAllergy ? `
              <span class="px-2.5 py-1 rounded-xl bg-[#450a0a] border border-[#991b1b] text-white font-mono text-[9.5px] font-bold flex items-center gap-1.5 animate-pulse">
                <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.008v.008H12v-.008z"/></svg>
                <span>Latex-Radar aktiv: Kautschuk gesperrt</span>
              </span>
            ` : `
              <span class="px-2.5 py-1 rounded-xl bg-[#142b24] border border-[#2e5746] text-[#2e5746] font-mono text-[9.5px] font-bold flex items-center gap-1">
                <span>Latex-Radar: Keine Allergie bekannt ✓</span>
              </span>
            `}
          </div>
        </div>

        <!-- 3 HAUPT-TABS DES ATELIERS (SHRINK-0 GESCHÜTZT) -->
        <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 border-b border-[#2a364f] font-mono text-xs w-full">
          <button type="button" onclick="HubToys.switchMainTab('inventory')" class="px-3.5 py-2 rounded-xl font-bold transition-all touch-btn whitespace-nowrap shrink-0 flex-shrink-0 ${currentMainTab === 'inventory' ? 'bg-[#000000] border border-[#c5a880] text-[#c5a880] shadow-sm' : 'bg-[#090d14] border border-[#2a364f] text-[#94a3b8] hover:text-white'}">
            1. Schrank-Inventar (${owned.length})
          </button>
          <button type="button" onclick="HubToys.switchMainTab('wizard')" class="px-3.5 py-2 rounded-xl font-bold transition-all touch-btn whitespace-nowrap shrink-0 flex-shrink-0 flex items-center gap-1.5 ${currentMainTab === 'wizard' ? 'bg-[#000000] border border-[#c5a880] text-[#c5a880] shadow-sm' : 'bg-[#090d14] border border-[#2a364f] text-[#d4af37] hover:text-white'}">
            <span>✨ 2. Toy-Kit Wizard (3–6 Toys)</span>
          </button>
          <button type="button" onclick="HubToys.switchMainTab('bundles')" class="px-3.5 py-2 rounded-xl font-bold transition-all touch-btn whitespace-nowrap shrink-0 flex-shrink-0 ${currentMainTab === 'bundles' ? 'bg-[#000000] border border-[#c5a880] text-[#c5a880] shadow-sm' : 'bg-[#090d14] border border-[#2a364f] text-[#94a3b8] hover:text-white'}">
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
  }

  function renderInventoryTabHtml() {
    let catalog = [];
    if (window.EquipmentCatalog && typeof window.EquipmentCatalog.getAll === 'function') {
      catalog = window.EquipmentCatalog.getAll();
    }

    const owned = getOwnedToyIds();
    const categories = [
      { id: 'all', label: 'Alle' },
      { id: 'bondage', label: 'Bondage & Seile' },
      { id: 'impact', label: 'Impact & Zucht' },
      { id: 'chastity', label: 'Keuschheit' },
      { id: 'sensory', label: 'Sinnesentzug' },
      { id: 'furniture', label: 'Möbel & Arretierung' },
      { id: 'care', label: 'Pflege & Aftercare' }
    ];

    let filtered = (activeCategoryFilter === 'all')
      ? catalog
      : catalog.filter(t => t.category === activeCategoryFilter);

    if (activeSearchQuery.trim().length > 0) {
      const q = activeSearchQuery.toLowerCase().trim();
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(q) || 
        t.somaticEffect.toLowerCase().includes(q) ||
        (t.materials || []).some(m => m.toLowerCase().includes(q))
      );
    }

    return `
      <div class="space-y-3">
        <!-- FILTER & SUCHE LEISTE -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 font-mono text-[10.5px]">
            ${categories.map(cat => `
              <button type="button" onclick="HubToys.setCategoryFilter('${cat.id}')" class="px-2.5 py-1.5 rounded-xl font-bold whitespace-nowrap shrink-0 flex-shrink-0 transition-all touch-btn ${activeCategoryFilter === cat.id ? 'bg-[#000000] border border-[#c5a880] text-[#c5a880]' : 'bg-[#090d14] border border-[#2a364f] text-[#94a3b8] hover:text-white'}">
                ${escapeHtml(cat.label)}
              </button>
            `).join('')}
          </div>

          <div class="relative sm:w-56 font-mono text-xs">
            <input 
              type="text" 
              value="${escapeHtml(activeSearchQuery)}" 
              oninput="HubToys.setSearchQuery(this.value)" 
              placeholder="Toy oder Material suchen..." 
              class="w-full px-3 py-1.5 bg-[#000000] border border-[#2a364f] rounded-xl text-white text-[11px] placeholder:text-[#94a3b8]/40 focus:border-[#c5a880] focus:outline-none" 
            />
          </div>
        </div>

        <!-- LISTE DER AUSRÜSTUNGS-KARTEN -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          ${filtered.map(toy => {
            const isOwned = owned.includes(toy.id);
            return `
              <div class="p-3.5 rounded-2xl bg-[#090d14] border transition-all space-y-2 flex flex-col justify-between ${isOwned ? 'border-[#c5a880]/60 bg-[#000000]' : 'border-[#2a364f]'}">
                <div class="space-y-1">
                  <div class="flex items-start justify-between gap-2">
                    <div class="min-w-0 flex-1">
                      <span class="text-[9px] font-mono uppercase tracking-wider text-[#c5a880] font-bold block">
                        ${escapeHtml(toy.category)} · Zone: ${escapeHtml(toy.somaticZone)}
                      </span>
                      <strong class="text-xs text-white block font-bold leading-tight break-words">
                        ${escapeHtml(toy.name)}
                      </strong>
                    </div>

                    ${toy.isLatex ? `
                      <span class="px-1.5 py-0.5 rounded text-[8.5px] font-mono bg-[#450a0a] text-white border border-[#991b1b] font-bold flex-shrink-0">
                        Latex
                      </span>
                    ` : ''}
                  </div>

                  <p class="text-[10px] text-[#94a3b8] leading-snug line-clamp-2">
                    ${escapeHtml(toy.somaticEffect)}
                  </p>
                </div>

                <div class="pt-2 border-t border-[#2a364f]/70 flex items-center justify-between font-mono text-[10px]">
                  <button type="button" onclick="HubToys.inspectToy('${toy.id}')" class="text-[#94a3b8] hover:text-[#c5a880] hover:underline flex items-center gap-1 font-bold">
                    <span>Details &amp; RACK-Pflege</span>
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>
                  </button>

                  <button type="button" onclick="HubToys.toggleOwned('${toy.id}')" class="px-2.5 py-1 rounded-xl font-bold transition-all touch-btn ${isOwned ? 'bg-[#142b24] border border-[#2e5746] text-[#2e5746]' : 'bg-[#000000] border border-[#2a364f] text-[#94a3b8] hover:text-white'}">
                    ${isOwned ? 'Im Besitz ✓' : '+ Besitze ich'}
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  function renderWizardTabHtml() {
    let catalog = [];
    if (window.EquipmentCatalog && typeof window.EquipmentCatalog.getAll === 'function') {
      catalog = window.EquipmentCatalog.getAll();
    }

    const owned = getOwnedToyIds();
    const suggestions = computePsychometricToySuggestions();
    const totalSlots = wizardState.targetSlotCount;
    const currentStep = wizardState.currentStepIndex;
    const selectedIds = wizardState.selectedToyIds;

    // Slot-Labels nach somatischen Dimensionen
    const slotLabels = [
      '1. Basis & Fesselung',
      '2. Reiz & Zucht',
      '3. Sinnesfokus / Blindfold',
      '4. Lust & Keuschheit',
      '5. Spezial-Equipment',
      '6. Vagus & Aftercare'
    ];

    const currentSlotTitle = slotLabels[currentStep] || `Slot ${currentStep + 1}`;

    return `
      <div class="space-y-4 font-sans">
        
        <!-- WIZARD KOPFZEILE MIT DYNAMISCHER SLOT-WAHL (3 BIS 6 SLOTS) -->
        <div class="p-4 rounded-2xl bg-[#000000] border border-[#d4af37]/60 space-y-3 shadow-xl">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2a364f] pb-2.5">
            <div>
              <strong class="text-xs sm:text-sm text-white font-serif block">
                Session-Kit Konfigurator (3 bis 6 Ausrüstungs-Slots)
              </strong>
              <p class="text-[10px] text-[#94a3b8]">
                Stellt das ideale Ausrüstungs-Set zusammen – anatomisch redundant-frei und auf eure 505 Fragen kalibriert.
              </p>
            </div>

            <!-- SLOT-ANZAHL WÄHLEN (3, 4, 5, 6) -->
            <div class="flex items-center gap-1 font-mono text-[10px] self-start sm:self-auto">
              <span class="text-[#94a3b8] mr-1">Umfang:</span>
              ${[3, 4, 5, 6].map(count => `
                <button type="button" onclick="HubToys.setWizardSlotCount(${count})" class="w-7 h-7 rounded-xl font-bold flex items-center justify-center transition-all touch-btn ${totalSlots === count ? 'bg-[#d4af37] text-black shadow-md' : 'bg-[#090d14] border border-[#2a364f] text-[#94a3b8] hover:text-white'}">
                  ${count}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- SCHRITT-TABS MIT DIREKT-WEITERSCHALTUNG (PUNKT #9) -->
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

        <!-- AKTIVER SCHRITT: AUSWAHL FÜR DIESEN SLOT -->
        <div class="p-4 rounded-2xl bg-[#090d14] border border-[#2a364f] space-y-3 shadow-md">
          <div class="flex items-center justify-between border-b border-[#2a364f]/70 pb-2">
            <div>
              <strong class="text-xs text-white block font-bold">Auswahl für ${escapeHtml(currentSlotTitle)}:</strong>
              <span class="text-[10px] text-[#94a3b8]">Tippe auf ein Werkzeug, um es diesem Slot zuzuweisen</span>
            </div>
            <span class="text-[9.5px] font-mono text-[#c5a880] font-bold">
              Schritt ${currentStep + 1} von ${totalSlots}
            </span>
          </div>

          <!-- EMPFEHLUNGSLISTE FÜR DIESEN SLOT -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            ${catalog.map(toy => {
              const isSelectedForThisSlot = selectedIds[currentStep] === toy.id;
              const isSelectedInOtherSlot = selectedIds.includes(toy.id) && !isSelectedForThisSlot;
              const redundancyCheck = checkBundleRedundancy(selectedIds.filter((_, i) => i !== currentStep), toy.id);
              const isBlocked = redundancyCheck.hasConflict;

              const sugg = suggestions.find(s => s.toyId === toy.id);
              const isHighSugg = sugg && sugg.score >= 7;

              return `
                <div class="p-3 rounded-2xl border transition-all flex flex-col justify-between ${isSelectedForThisSlot ? 'bg-[#000000] border-[#c5a880] shadow-md' : (isBlocked ? 'opacity-40 border-[#450a0a] bg-[#000000]' : 'bg-[#000000] border-[#2a364f] hover:border-slate-600')}">
                  <div class="space-y-1">
                    <div class="flex items-start justify-between gap-1.5">
                      <strong class="text-xs text-white block font-bold leading-tight break-words">
                        ${escapeHtml(toy.name)}
                      </strong>
                      ${isHighSugg ? `
                        <span class="px-1.5 py-0.2 rounded text-[8.5px] font-mono bg-[#142b24] text-[#2e5746] border border-[#2e5746] font-bold flex-shrink-0">
                          ★ Resonanz
                        </span>
                      ` : ''}
                    </div>

                    <p class="text-[10px] text-[#94a3b8] leading-snug line-clamp-2">
                      ${escapeHtml(toy.somaticEffect)}
                    </p>

                    ${sugg && isHighSugg ? `
                      <span class="text-[9px] font-mono text-[#c5a880] block">
                        Psychometrie: ${escapeHtml(sugg.reason)}
                      </span>
                    ` : ''}

                    ${isBlocked ? `
                      <span class="text-[9px] font-mono text-[#ef4444] block">
                        ⚠️ ${escapeHtml(redundancyCheck.reason)}
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

        <!-- WIZARD STEUERUNGSLEISTE (DUALE NAVIGATION MIT WEITER-BUTTON) -->
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

          <!-- BUNDLE FERTIGSTELLEN & SPEICHERN -->
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
    let catalog = [];
    if (window.EquipmentCatalog && typeof window.EquipmentCatalog.getAll === 'function') {
      catalog = window.EquipmentCatalog.getAll();
    }

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

              <!-- TOY-PILLS -->
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
    activeInspectorToyId = toyId;
    let catalog = [];
    if (window.EquipmentCatalog && typeof window.EquipmentCatalog.getAll === 'function') {
      catalog = window.EquipmentCatalog.getAll();
    }
    const toy = catalog.find(t => t.id === toyId);
    if (!toy) return;

    const modal = document.getElementById('hub-toys-inspector-modal');
    if (!modal) return;

    const owned = getOwnedToyIds();
    const isOwned = owned.includes(toy.id);
    const customNotes = getToyCustomNotes();
    const currentNote = customNotes[toy.id] || '';

    modal.innerHTML = `
      <div class="bg-[#090d14] rounded-3xl max-w-lg w-full border border-[#c5a880]/60 p-5 space-y-4 shadow-2xl text-xs text-[#f8fafc] font-sans max-h-[90dvh] overflow-y-auto pb-[max(env(safe-area-inset-bottom),16px)]">
        
        <div class="flex items-center justify-between border-b border-[#2a364f] pb-3">
          <div class="space-y-0.5">
            <span class="text-[9.5px] font-mono uppercase tracking-wider text-[#c5a880] font-bold block">
              ${escapeHtml(toy.category)} · Zone: ${escapeHtml(toy.somaticZone)}
            </span>
            <h3 class="text-sm sm:text-base font-serif text-white font-bold">${escapeHtml(toy.name)}</h3>
          </div>
          <button type="button" onclick="document.getElementById('hub-toys-inspector-modal').style.display='none'" class="w-8 h-8 rounded-xl bg-[#000000] border border-[#2a364f] text-[#94a3b8] hover:text-white flex items-center justify-center touch-btn">✕</button>
        </div>

        <p class="text-[11px] text-[#f8fafc] leading-relaxed">
          ${escapeHtml(toy.somaticEffect)}
        </p>

        <!-- MATERIAL & RACK-SICHERHEIT -->
        <div class="p-3.5 rounded-2xl bg-[#000000] border border-[#2a364f] space-y-2 text-[10.5px]">
          <strong class="text-white block font-bold font-mono">RACK-Hygiene- &amp; Pflegeprotokoll:</strong>
          <p class="text-[#94a3b8] leading-snug">
            ${escapeHtml(toy.safetyProtocol?.aftercareInstruction || 'Nach der Session gründlich desinfizieren und trocken lagern.')}
          </p>
          <span class="text-[9.5px] font-mono text-[#c5a880] block">
            Materialien: ${(toy.materials || []).join(', ')}
          </span>
        </div>

        <!-- EIGENE NOTIZ ZUM TOY -->
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
          <button type="button" onclick="HubToys.toggleOwned('${toy.id}'); HubToys.inspectToy('${toy.id}');" class="px-3.5 py-2 rounded-xl font-bold transition-all touch-btn ${isOwned ? 'bg-[#142b24] border border-[#2e5746] text-[#2e5746]' : 'bg-[#000000] border border-[#2a364f] text-[#94a3b8]'}">
            ${isOwned ? 'Im Schrank-Inventar ✓' : '+ In Inventar aufnehmen'}
          </button>

          <button type="button" onclick="HubToys.saveInspectorNote('${toy.id}')" class="px-4 py-2 bg-[#c5a880] hover:bg-[#dfcaa9] text-black font-bold rounded-xl text-xs touch-btn shadow-md">
            Notiz sichern ✓
          </button>
        </div>
      </div>
    `;

    modal.style.display = 'flex';
  }

  function assignToyToSlot(slotIndex, toyId) {
    const redundancyCheck = checkBundleRedundancy(wizardState.selectedToyIds.filter((_, i) => i !== slotIndex), toyId);
    if (redundancyCheck.hasConflict) {
      showToast(redundancyCheck.reason);
      return;
    }

    wizardState.selectedToyIds[slotIndex] = toyId;
    showToast("Werkzeug dem Slot zugewiesen ✓");

    // Wenn noch Slots offen sind, automatisch zum nächsten Slot weiterschalten
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

    // Staging-Übergabe an session.html
    try {
      localStorage.setItem(STORAGE_KEY_STAGING_BUNDLE, JSON.stringify(validIds));
    } catch (e) {}

    showToast(`✓ Set „${bundleObj.name}“ gesichert & für Session übernommen!`);

    // Schrank-Modal schließen falls geöffnet
    const modal = document.getElementById('hub-toys-modal');
    if (modal) modal.style.display = 'none';

    // Weiterleitung zu session.html
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
      renderClosetView();
    },
    setSearchQuery: function(val) {
      activeSearchQuery = val;
      renderClosetView();
    },
    toggleOwned: toggleToyOwned,
    getOwned: getOwnedToyIds,
    inspectToy: openToyInspector,
    saveInspectorNote: function(toyId) {
      const input = document.getElementById('inspector-input-note');
      if (input) saveToyCustomNote(toyId, input.value);
      const modal = document.getElementById('hub-toys-inspector-modal');
      if (modal) modal.style.display = 'none';
      showToast("Notiz gesichert ✓");
      renderClosetView();
    },
    // Wizard API (Punkt #9)
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
    assignToyToSlot: assignToyToSlot,
    removeToyFromSlot: removeToyFromSlot,
    finalizeAndStageBundle: finalizeAndStageBundle,
    stageExistingBundle: stageExistingBundle,
    deleteBundle: deleteSavedBundle
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
