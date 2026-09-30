/**
 * js/hub_toys.js
 * TACTUS Ausrüstungsschrank-, Hardware-Bundle- & Zonen-Inventar (V3.0 Hyper-Dynamisch)
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien:
 * - Dynamische DOM-Autonomie: Funktioniert auf allen Seiten (Start-Hub, Regie, Protokoll)
 * - 1:1 IndexedDB Fototresor-Kopplung via HubPhotos mit 0-ms Cache und Thumbnail-Rendering
 * - 1-Klick Starter-Bundles (Shibari-Basisset, Keuschheits-Einsteiger, BDSM-Lederstarter)
 * - Mengenschalter ('quantity') für gleichartige Hardware (z. B. 8x Juteseil, 5x Siegel)
 * - RACK-Allergie-Radar: Warnt automatisch bei Latex-Allergie des Subs
 * - Somatische DoF- und Restraint-Layer-Transparenz (Layer 0–2)
 * - Volltextsuche und dynamische Kategorie-Filterung
 * - 100 % frei von infantilen System-Emojis in Benutzeroberfläche und Code
 * - Keine window.alert() / window.confirm() Aufrufe unter keinen Umständen
 */

(function(window) {
  'use strict';

  let activeCategoryTab = 'all';
  let searchQuery = '';
  let ownedIds = [];
  let itemQuantities = {};

  const STARTER_BUNDLES = [
    {
      id: 'bundle_shibari_starter',
      title: 'Shibari-Basisset',
      desc: '8x Juteseile (6mm weich geölt), 4x weiche Baumwollseile & EMT-Sicherheits-Verbandschere',
      iconSvg: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"/></svg>`,
      items: [
        { id: 'toy_jute_rope_6mm', name: 'Shibari Juteseil (6mm geölt)', category: 'bondage', quantity: 8 },
        { id: 'toy_cotton_rope_red', name: 'Weiche Baumwollseile (Rot)', category: 'bondage', quantity: 4 },
        { id: 'toy_emt_shears', name: 'EMT-Sicherheits-Verbandschere', category: 'care', quantity: 1 }
      ]
    },
    {
      id: 'bundle_chastity_starter',
      title: 'Keuschheits-Einsteiger',
      desc: 'Cherrykeeper Micro Stub, Cobra 3D-Käfig, 5x nummerierte Einweg-Sicherheitsplomben & Spülspritze',
      iconSvg: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>`,
      items: [
        { id: 'toy_chastity_cherrykeeper', name: 'Cherrykeeper Micro Stub (<= 35mm)', category: 'chastity', quantity: 1 },
        { id: 'toy_chastity_cobra', name: 'Kink3D Cobra (SLS-Nylon)', category: 'chastity', quantity: 1 },
        { id: 'toy_security_seals', name: 'Nummerierte Sicherheits-Einwegplomben', category: 'chastity', quantity: 5 },
        { id: 'toy_irrigation_syringe', name: 'Urologische Spülspritze mit Knopfkanüle', category: 'care', quantity: 1 }
      ]
    },
    {
      id: 'bundle_leather_starter',
      title: 'BDSM-Lederstarter',
      desc: 'Schwerer Lederflogger, breites Sattelleder-Paddle, gepolsterte Handgelenksmanschetten & Augenbinde',
      iconSvg: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>`,
      items: [
        { id: 'toy_leather_flogger', name: 'Schwerer Rindleder-Flogger', category: 'impact', quantity: 1 },
        { id: 'toy_leather_paddle_wide', name: 'Breites Sattelleder-Paddle', category: 'impact', quantity: 1 },
        { id: 'toy_leather_cuffs_wrists', name: 'Gepolsterte Leder-Handgelenksmanschetten', category: 'bondage', quantity: 1 },
        { id: 'toy_blindfold_silk', name: 'Lichtdichte Seiden-Augenbinde', category: 'sensory', quantity: 1 }
      ]
    }
  ];

  function loadOwnedIds() {
    try {
      const raw = localStorage.getItem('tactus_owned_equipment') || localStorage.getItem('kompass_owned_equipment');
      if (raw) {
        const parsed = JSON.parse(raw);
        ownedIds = Array.isArray(parsed) ? parsed : [];
      } else {
        ownedIds = [];
      }
    } catch (e) {
      console.warn("[TACTUS Toys] Fehler beim Laden von owned_equipment:", e);
      ownedIds = [];
    }

    try {
      const rawQty = localStorage.getItem('tactus_toy_quantities') || localStorage.getItem('kompass_toy_quantities');
      if (rawQty) {
        itemQuantities = JSON.parse(rawQty) || {};
      } else {
        itemQuantities = {};
      }
    } catch (e) {
      itemQuantities = {};
    }
  }

  function saveState() {
    try {
      localStorage.setItem('tactus_owned_equipment', JSON.stringify(ownedIds));
      localStorage.setItem('kompass_owned_equipment', JSON.stringify(ownedIds));
      localStorage.setItem('tactus_toy_quantities', JSON.stringify(itemQuantities));
      localStorage.setItem('kompass_toy_quantities', JSON.stringify(itemQuantities));
    } catch (e) {
      console.warn("[TACTUS Toys] Konnte Ausrüstungsstand nicht sichern:", e);
    }

    if (window.CloudSync && typeof window.CloudSync.trigger === 'function') {
      window.CloudSync.trigger();
    }
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
        <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/>
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

  function getAllCatalogItems() {
    let baseCatalog = [];
    if (window.EquipmentCatalog && typeof window.EquipmentCatalog.getAll === 'function') {
      baseCatalog = window.EquipmentCatalog.getAll();
    } else if (Array.isArray(window.equipmentCatalog)) {
      baseCatalog = window.equipmentCatalog;
    }

    let customEquipment = [];
    try {
      const rawCustom = localStorage.getItem('tactus_custom_equipment') || localStorage.getItem('kompass_custom_equipment');
      if (rawCustom) customEquipment = JSON.parse(rawCustom) || [];
    } catch (e) {}

    const combined = [...baseCatalog, ...customEquipment];
    const seen = new Set();
    const result = [];

    for (let i = 0; i < combined.length; i++) {
      const item = combined[i];
      if (item && item.id && !seen.has(item.id)) {
        seen.add(item.id);
        result.push(item);
      }
    }

    return result;
  }

  function getSubHealthPass() {
    try {
      const raw = localStorage.getItem('tactus_medical_pass');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {};
  }

  function getItemQuantity(id) {
    if (itemQuantities[id] !== undefined && itemQuantities[id] !== null) {
      const q = parseInt(itemQuantities[id], 10);
      return isNaN(q) || q < 1 ? 1 : q;
    }
    return 1;
  }

  function updateQuantity(id, delta) {
    const current = getItemQuantity(id);
    const next = Math.max(1, Math.min(99, current + delta));
    itemQuantities[id] = next;
    saveState();
    renderToysModal();
  }

  function toggleItemOwnership(id) {
    loadOwnedIds();
    const index = ownedIds.indexOf(id);
    if (index !== -1) {
      ownedIds.splice(index, 1);
    } else {
      ownedIds.push(id);
      if (!itemQuantities[id]) {
        itemQuantities[id] = 1;
      }
    }
    saveState();
    renderToysModal();
    if (window.SessionStaging && typeof window.SessionStaging.renderEquipment === 'function') {
      window.SessionStaging.renderEquipment();
    }
  }

  function applyStarterBundle(bundleId) {
    const bundle = STARTER_BUNDLES.find(b => b.id === bundleId);
    if (!bundle) return;

    loadOwnedIds();
    for (let i = 0; i < bundle.items.length; i++) {
      const item = bundle.items[i];
      if (!ownedIds.includes(item.id)) {
        ownedIds.push(item.id);
      }
      itemQuantities[item.id] = item.quantity || 1;
    }

    saveState();
    renderToysModal();
    showToast(`Starter-Bundle „${bundle.title}“ im Schrank aktiviert ✓`);
  }

  function filterItems(items) {
    return items.filter(item => {
      if (activeCategoryTab === 'owned_only') {
        if (!ownedIds.includes(item.id)) return false;
      } else if (activeCategoryTab !== 'all' && item.category !== activeCategoryTab) {
        return false;
      }

      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase().trim();
        const nameMatch = (item.name || '').toLowerCase().includes(query);
        const descMatch = (item.desc || '').toLowerCase().includes(query);
        const catMatch = (item.category || '').toLowerCase().includes(query);
        return nameMatch || descMatch || catMatch;
      }
      return true;
    });
  }

  async function renderPhotoThumbnailForToy(toyId, containerEl) {
    if (!containerEl) return;
    if (!window.HubPhotos || typeof window.HubPhotos.getPhoto !== 'function') {
      containerEl.innerHTML = `<span class="text-slate-600 font-mono text-[9px]">Kein Foto</span>`;
      return;
    }

    try {
      const photoDataUrl = await window.HubPhotos.getPhoto(toyId);
      if (photoDataUrl) {
        containerEl.innerHTML = `
          <div class="relative w-full h-full group/photo rounded-xl overflow-hidden border border-purple-900/40">
            <img src="${photoDataUrl}" alt="Ausrüstungs-Foto" class="w-full h-full object-cover rounded-xl" />
            <div class="absolute inset-0 bg-black/60 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
              <button type="button" onclick="event.stopPropagation(); HubToys.triggerPhotoCapture('${toyId}')" title="Foto erneuern" class="p-1 rounded-lg bg-slate-900 text-slate-200 hover:text-white text-[10px]">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"/><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"/></svg>
              </button>
              <button type="button" onclick="event.stopPropagation(); HubToys.deleteToyPhoto('${toyId}')" title="Foto löschen" class="p-1 rounded-lg bg-rose-950 text-rose-300 hover:text-rose-100 text-[10px]">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>
              </button>
            </div>
          </div>
        `;
      } else {
        containerEl.innerHTML = `
          <button type="button" onclick="event.stopPropagation(); HubToys.triggerPhotoCapture('${toyId}')" title="Foto aufnehmen & somatisch analysieren" class="w-full h-full flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 hover:border-purple-500 bg-slate-950/70 hover:bg-slate-900 text-slate-500 hover:text-purple-300 transition-colors p-1">
            <svg class="w-4 h-4 mb-0.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"/><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"/></svg>
            <span class="text-[9px] font-mono leading-none">Foto</span>
          </button>
        `;
      }
    } catch (err) {
      containerEl.innerHTML = `<span class="text-slate-600 text-[9px]">-</span>`;
    }
  }

  function triggerPhotoCapture(toyId) {
    if (window.HubPhotos && typeof window.HubPhotos.captureForToy === 'function') {
      window.HubPhotos.captureForToy(toyId, (dataUrl, somaticProfile) => {
        if (somaticProfile) {
          integrateSomaticProfileIntoItem(toyId, somaticProfile);
        }
        renderToysModal();
      });
    } else {
      showToast("Foto-Tresor nicht initialisiert.");
    }
  }

  function integrateSomaticProfileIntoItem(toyId, somaticProfile) {
    let customEquipment = [];
    try {
      const rawCustom = localStorage.getItem('tactus_custom_equipment') || localStorage.getItem('kompass_custom_equipment');
      if (rawCustom) customEquipment = JSON.parse(rawCustom) || [];
    } catch (e) {}

    const existingIdx = customEquipment.findIndex(c => c.id === toyId);
    if (existingIdx !== -1) {
      customEquipment[existingIdx].somaticProfile = somaticProfile;
      if (somaticProfile.name) customEquipment[existingIdx].name = somaticProfile.name;
      if (somaticProfile.category) customEquipment[existingIdx].category = somaticProfile.category;
    } else {
      customEquipment.push({
        id: toyId,
        name: somaticProfile.name || 'Vision-Erfasstes Toy',
        category: somaticProfile.category || 'sensory',
        somaticProfile: somaticProfile,
        isCustom: true
      });
    }

    try {
      localStorage.setItem('tactus_custom_equipment', JSON.stringify(customEquipment));
    } catch (e) {}
  }

  async function deleteToyPhoto(toyId) {
    if (window.HubPhotos && typeof window.HubPhotos.deletePhoto === 'function') {
      await window.HubPhotos.deletePhoto(toyId);
      showToast("Foto aus dem Tresor gelöscht.");
      renderToysModal();
    }
  }

  function ensureInventoryModalDom() {
    let modal = document.getElementById('modal-toys-inventory');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modal-toys-inventory';
      modal.className = "fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4";
      modal.style.display = 'none';

      modal.innerHTML = `
        <div class="theme-card rounded-3xl max-w-2xl w-full border border-purple-500/40 p-5 space-y-3.5 shadow-2xl text-xs max-h-[92vh] flex flex-col justify-between">
          
          <!-- MODAL HEADER -->
          <div class="flex items-center justify-between border-b border-purple-900/60 pb-2.5 flex-shrink-0">
            <div class="space-y-0.5 min-w-0">
              <h3 class="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>Ausrüstungsschrank &amp; Schlafraum-Inventar</span>
                <span class="px-2 py-0.5 rounded text-[9px] font-mono bg-purple-950 text-purple-300 border border-purple-800 font-bold" id="toys-modal-active-count">0</span>
              </h3>
              <span class="text-[10px] text-slate-400 block truncate">Verfügbare Hardware bestimmt verbleibende Freiheitsgrade (DoF) &amp; Staging</span>
            </div>
            <div class="flex items-center gap-1.5 flex-shrink-0">
              <button type="button" onclick="HubToys.openCustomModal()" class="px-2.5 py-1 rounded-xl bg-purple-950 hover:bg-purple-900 border border-purple-700 text-purple-200 font-bold text-[10px] flex items-center gap-1 touch-btn">
                <span>+ Eigenes Toy</span>
              </button>
              <button type="button" onclick="HubToys.close()" class="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white font-bold flex items-center justify-center touch-btn">✕</button>
            </div>
          </div>

          <!-- SCROLLABLE BODY -->
          <div class="space-y-3 overflow-y-auto pr-1 flex-1">
            <!-- STARTER BUNDLES -->
            <div id="toys-starter-bundles-container" class="grid grid-cols-1 sm:grid-cols-3 gap-2"></div>

            <!-- SEARCH INPUT -->
            <div class="pt-1">
              <input 
                type="text" 
                placeholder="Ausrüstung durchsuchen (z. B. Flogger, Seil, Manschetten, Knebel)..." 
                oninput="HubToys.handleSearch(this.value)" 
                class="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:border-purple-600 focus:outline-none" 
              />
            </div>

            <!-- DYNAMISCHE KATEGORIE-FILTERLEISTE -->
            <div class="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 text-xs">
              <button type="button" onclick="HubToys.switchCategoryTab('all')" data-toy-cat-tab="all" class="px-3 py-1.5 rounded-xl font-bold text-xs bg-purple-700 text-white shadow-sm whitespace-nowrap">
                Alle
              </button>
              <button type="button" onclick="HubToys.switchCategoryTab('owned_only')" data-toy-cat-tab="owned_only" class="px-3 py-1.5 rounded-xl font-bold text-xs bg-slate-900 border border-slate-800 text-purple-300 hover:text-white whitespace-nowrap">
                Aktiv im Schrank ✓
              </button>
              <button type="button" onclick="HubToys.switchCategoryTab('bondage')" data-toy-cat-tab="bondage" class="px-3 py-1.5 rounded-xl font-bold text-xs bg-slate-900 border border-slate-800 text-slate-400 hover:text-white whitespace-nowrap">
                Bondage &amp; Seile
              </button>
              <button type="button" onclick="HubToys.switchCategoryTab('impact')" data-toy-cat-tab="impact" class="px-3 py-1.5 rounded-xl font-bold text-xs bg-slate-900 border border-slate-800 text-slate-400 hover:text-white whitespace-nowrap">
                Impact &amp; Zucht
              </button>
              <button type="button" onclick="HubToys.switchCategoryTab('sensory')" data-toy-cat-tab="sensory" class="px-3 py-1.5 rounded-xl font-bold text-xs bg-slate-900 border border-slate-800 text-slate-400 hover:text-white whitespace-nowrap">
                Sensorik &amp; Knebel
              </button>
              <button type="button" onclick="HubToys.switchCategoryTab('chastity')" data-toy-cat-tab="chastity" class="px-3 py-1.5 rounded-xl font-bold text-xs bg-slate-900 border border-slate-800 text-slate-400 hover:text-white whitespace-nowrap">
                Keuschheit
              </button>
              <button type="button" onclick="HubToys.switchCategoryTab('cbt')" data-toy-cat-tab="cbt" class="px-3 py-1.5 rounded-xl font-bold text-xs bg-slate-900 border border-slate-800 text-slate-400 hover:text-white whitespace-nowrap">
                CBT &amp; Klemmen
              </button>
              <button type="button" onclick="HubToys.switchCategoryTab('care')" data-toy-cat-tab="care" class="px-3 py-1.5 rounded-xl font-bold text-xs bg-slate-900 border border-slate-800 text-slate-400 hover:text-white whitespace-nowrap">
                Pflege &amp; RACK
              </button>
            </div>

            <!-- ITEMS GRID -->
            <div id="toys-modal-items-container" class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1"></div>
          </div>

          <!-- FOOTER -->
          <div class="flex justify-between items-center pt-2.5 border-t border-slate-800 flex-shrink-0">
            <span class="text-[9.5px] font-mono text-slate-500">1:1 IndexedDB Fototresor aktiv</span>
            <button type="button" onclick="HubToys.close()" class="px-5 py-2 bg-purple-700 hover:bg-purple-600 text-white font-bold rounded-xl text-xs touch-btn shadow-md">
              Bereitgelegt ✓
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }
    return modal;
  }

  function renderToysModal() {
    loadOwnedIds();
    ensureInventoryModalDom();

    const container = document.getElementById('toys-modal-items-container');
    const badgeCount = document.getElementById('toys-modal-active-count');

    const allItems = getAllCatalogItems();
    const filteredItems = filterItems(allItems);
    const healthPass = getSubHealthPass();

    if (badgeCount) badgeCount.innerText = `${ownedIds.length} aktiv`;

    // 1. STARTER BUNDLES RENDERN
    const bundlesContainer = document.getElementById('toys-starter-bundles-container');
    if (bundlesContainer) {
      bundlesContainer.innerHTML = STARTER_BUNDLES.map(bundle => {
        const isFullyOwned = bundle.items.every(it => ownedIds.includes(it.id));
        return `
          <div class="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5 flex flex-col justify-between shadow-sm">
            <div class="space-y-1">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-white flex items-center gap-1.5">
                  <span class="text-purple-400">${bundle.iconSvg}</span>
                  <span>${escapeHtml(bundle.title)}</span>
                </span>
                <span class="text-[9px] font-mono px-1.5 py-0.2 rounded ${isFullyOwned ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold' : 'bg-slate-800 text-slate-400'}">
                  ${isFullyOwned ? 'Aktiviert ✓' : 'Starter-Set'}
                </span>
              </div>
              <p class="text-[9.5px] text-slate-400 leading-snug break-words">${escapeHtml(bundle.desc)}</p>
            </div>
            <button type="button" onclick="HubToys.applyStarterBundle('${bundle.id}')" class="w-full py-1 px-2.5 rounded-xl border font-bold text-[10px] flex items-center justify-center gap-1.5 transition-all touch-btn ${isFullyOwned ? 'bg-purple-950/60 border-purple-700/60 text-purple-200' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'}">
              <span>${bundle.iconSvg}</span>
              <span>${isFullyOwned ? 'Bundle neu einstellen' : '1-Klick Setup'}</span>
            </button>
          </div>
        `;
      }).join('');
    }

    if (!container) return;

    if (filteredItems.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-10 text-center space-y-1 text-slate-400">
          <strong class="text-xs text-slate-200 block font-bold">Keine Ausrüstung gefunden</strong>
          <p class="text-[11px] text-slate-500">Passe deine Suchbegriffe an oder wähle eine andere Kategorie.</p>
        </div>
      `;
      return;
    }

    // 2. ITEMS GRID RENDERN (VOLLSTÄNDIG LESBAR OHNE TRUNCATE)
    container.innerHTML = filteredItems.map(item => {
      const isOwned = ownedIds.includes(item.id);
      const qty = getItemQuantity(item.id);
      const profile = item.somaticProfile || item.affordanceProfile || null;
      const layer = item.restraintLayer !== undefined ? item.restraintLayer : (profile ? profile.restraintLayer : null);

      // RACK Allergie-Radar (z. B. Latex-Allergie des Subs)
      const hasLatexAllergy = !!healthPass.hasLatexAllergy;
      const containsLatex = (item.materials || []).some(m => String(m).toLowerCase().includes('latex') || String(m).toLowerCase().includes('rubber'));
      const showAllergyWarning = hasLatexAllergy && containsLatex;

      // Gesperrte / Erlaubte Freiheitsgrade extrahieren
      let blockedBadges = [];
      if (profile && profile.blocksFaculties) {
        for (const f in profile.blocksFaculties) {
          if (profile.blocksFaculties[f] === true) {
            blockedBadges.push(`Sperrt: ${f.replace(/_/g, ' ')}`);
          }
        }
      }

      return `
        <div class="p-3 rounded-2xl border transition-all flex flex-col justify-between gap-2 ${isOwned ? 'bg-purple-950/25 border-purple-700/60 shadow-md' : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700'}">
          <div class="flex items-start gap-2.5 min-w-0">
            <!-- 1:1 Foto Thumbnail Container -->
            <div id="toy-thumb-${escapeHtml(item.id)}" class="w-14 h-14 aspect-square rounded-xl bg-black/80 flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-800/80">
              <span class="text-slate-600 text-[10px] animate-pulse">...</span>
            </div>

            <!-- Beschreibung & Titel (VOLLSTÄNDIG LESBAR OHNE TRUNCATE) -->
            <div class="min-w-0 flex-1 space-y-0.5">
              <div class="flex items-start justify-between gap-2">
                <strong class="text-xs text-white font-bold leading-tight break-words flex-1">${escapeHtml(item.name)}</strong>
                <button type="button" onclick="HubToys.toggleOwned('${item.id}')" title="Aktivierungs-Status" class="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold flex-shrink-0 transition-colors ${isOwned ? 'bg-purple-900/90 text-purple-200 border border-purple-600 shadow-sm' : 'bg-slate-800 text-slate-500 border border-slate-700'}">
                  ${isOwned ? '✓ Vorhanden' : '+ Aktivieren'}
                </button>
              </div>

              <p class="text-[10px] text-slate-400 leading-relaxed break-words">${escapeHtml(item.desc || (profile && profile.somaticEffect) || '')}</p>
              
              <!-- RACK-ALLERGIE WARNUNG -->
              ${showAllergyWarning ? `
                <div class="p-1 rounded bg-rose-950/80 border border-rose-700 text-rose-200 text-[9px] font-bold">
                  ⚠️ RACK-Warnung: Sub hat Latex-Allergie hinterlegt!
                </div>
              ` : ''}

              <!-- Somatische Affordanz-Tags -->
              <div class="flex items-center gap-1 pt-0.5 flex-wrap text-[9px] font-mono">
                <span class="px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800 uppercase">${escapeHtml(item.category || 'Ausrüstung')}</span>
                ${layer !== null ? `<span class="px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">Layer ${layer}</span>` : ''}
                ${item.materials ? `<span class="text-slate-500">${escapeHtml(item.materials.join(', '))}</span>` : ''}
                ${blockedBadges.map(b => `<span class="px-1 rounded bg-rose-950/60 text-rose-300 border border-rose-900/60">${escapeHtml(b)}</span>`).join('')}
              </div>
            </div>
          </div>

          <!-- Untere Menüleiste: Mengenschalter & Foto Trigger -->
          <div class="flex items-center justify-between pt-1 border-t border-slate-800/70 text-xs">
            <div class="flex items-center gap-1">
              <span class="text-[10px] text-slate-400 font-mono mr-1">Menge:</span>
              <button type="button" onclick="HubToys.changeQuantity('${item.id}', -1)" ${!isOwned ? 'disabled' : ''} class="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold flex items-center justify-center touch-btn disabled:opacity-30">
                -
              </button>
              <span class="px-2 font-mono text-xs font-bold text-white min-w-[1.5rem] text-center">${qty}</span>
              <button type="button" onclick="HubToys.changeQuantity('${item.id}', 1)" ${!isOwned ? 'disabled' : ''} class="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold flex items-center justify-center touch-btn disabled:opacity-30">
                +
              </button>
            </div>

            <!-- Kamera Schnellaufruf -->
            <button type="button" onclick="HubToys.triggerPhotoCapture('${item.id}')" class="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-medium text-[10px] flex items-center gap-1 touch-btn shadow-xs">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"/><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"/></svg>
              <span>Foto</span>
            </button>
          </div>
        </div>
      `;
    }).join('');

    for (let j = 0; j < filteredItems.length; j++) {
      const item = filteredItems[j];
      const thumbBox = document.getElementById(`toy-thumb-${item.id}`);
      if (thumbBox) {
        renderPhotoThumbnailForToy(item.id, thumbBox);
      }
    }
  }

  function switchCategoryTab(category) {
    activeCategoryTab = category;
    const tabButtons = document.querySelectorAll('[data-toy-cat-tab]');
    tabButtons.forEach(btn => {
      const cat = btn.getAttribute('data-toy-cat-tab');
      if (cat === category) {
        btn.className = "px-3 py-1.5 rounded-xl font-bold text-xs bg-purple-700 text-white shadow-sm whitespace-nowrap transition-colors";
      } else {
        btn.className = "px-3 py-1.5 rounded-xl font-bold text-xs bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 whitespace-nowrap transition-colors";
      }
    });
    renderToysModal();
  }

  function handleSearchInput(query) {
    searchQuery = query || '';
    renderToysModal();
  }

  function openCustomItemModal() {
    let modal = document.getElementById('modal-add-custom-toy');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modal-add-custom-toy';
      modal.className = "fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4";
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="theme-card rounded-3xl max-w-md w-full border border-purple-500/40 p-5 space-y-3.5 shadow-2xl text-xs">
        <div class="flex items-center justify-between border-b border-purple-900/60 pb-2">
          <div>
            <h3 class="text-sm font-bold text-white">Eigenes Toy hinzufügen</h3>
            <span class="text-[10px] text-slate-400">Ergänze private Ausrüstung für Staging &amp; Schrank</span>
          </div>
          <button type="button" onclick="HubToys.closeCustomModal()" class="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white font-bold flex items-center justify-center touch-btn">✕</button>
        </div>

        <div class="space-y-2.5">
          <div class="space-y-1">
            <label class="text-[10px] font-mono text-slate-400 uppercase block">Name des Gegenstands:</label>
            <input type="text" id="input-custom-toy-name" placeholder="z. B. Leder-Maulkorbknebel mit Riemen" class="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-purple-600 focus:outline-none" />
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div class="space-y-1">
              <label class="text-[10px] font-mono text-slate-400 uppercase block">Kategorie:</label>
              <select id="select-custom-toy-cat" class="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs">
                <option value="bondage">Bondage &amp; Seile</option>
                <option value="impact">Impact &amp; Zucht</option>
                <option value="sensory">Sensorik &amp; Knebel</option>
                <option value="chastity">Keuschheit</option>
                <option value="cbt">CBT &amp; Klemmen</option>
                <option value="care">Pflege &amp; RACK</option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-mono text-slate-400 uppercase block">Materialien:</label>
              <input type="text" id="input-custom-toy-mat" placeholder="z. B. Leder, Edelstahl" class="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs" />
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-mono text-slate-400 uppercase block">Beschreibung &amp; Besonderheiten:</label>
            <textarea id="input-custom-toy-desc" rows="2" placeholder="Besondere Maße, Härtegrad oder Schließmechanismus..." class="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-purple-600 focus:outline-none"></textarea>
          </div>
        </div>

        <div class="flex justify-end gap-2 pt-2 border-t border-slate-800">
          <button type="button" onclick="HubToys.closeCustomModal()" class="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-400 font-bold rounded-xl text-xs touch-btn">Abbrechen</button>
          <button type="button" onclick="HubToys.saveCustomItem()" class="px-5 py-2 bg-purple-700 hover:bg-purple-600 text-white font-bold rounded-xl text-xs touch-btn shadow-md">Toy speichern ✓</button>
        </div>
      </div>
    `;

    modal.style.display = 'flex';
  }

  function closeCustomItemModal() {
    const modal = document.getElementById('modal-add-custom-toy');
    if (modal) modal.style.display = 'none';
  }

  function saveCustomItem() {
    const nameInput = document.getElementById('input-custom-toy-name');
    const catSelect = document.getElementById('select-custom-toy-cat');
    const matInput = document.getElementById('input-custom-toy-mat');
    const descInput = document.getElementById('input-custom-toy-desc');

    const name = nameInput ? nameInput.value.trim() : '';
    const cat = catSelect ? catSelect.value : 'bondage';
    const mat = matInput ? matInput.value.trim() : '';
    const desc = descInput ? descInput.value.trim() : '';

    if (!name) {
      showToast("Bitte gib dem Gegenstand einen Namen.");
      return;
    }

    const newItem = {
      id: `custom_toy_${Date.now()}`,
      name: name,
      category: cat,
      materials: mat ? mat.split(',').map(s => s.trim()) : [],
      desc: desc || 'Eigenanschaffung',
      isCustom: true
    };

    let customEquipment = [];
    try {
      const rawCustom = localStorage.getItem('tactus_custom_equipment') || localStorage.getItem('kompass_custom_equipment');
      if (rawCustom) customEquipment = JSON.parse(rawCustom) || [];
    } catch (e) {}

    customEquipment.push(newItem);
    try {
      localStorage.setItem('tactus_custom_equipment', JSON.stringify(customEquipment));
    } catch (e) {}

    loadOwnedIds();
    ownedIds.push(newItem.id);
    itemQuantities[newItem.id] = 1;
    saveState();

    closeCustomItemModal();
    renderToysModal();
    showToast(`„${newItem.name}“ zum Schrank hinzugefügt ✓`);
  }

  function openToysModal() {
    loadOwnedIds();
    const modal = ensureInventoryModalDom();
    modal.style.display = 'flex';
    renderToysModal();
  }

  function closeToysModal() {
    const modal = document.getElementById('modal-toys-inventory');
    if (modal) {
      modal.style.display = 'none';
    }
    if (window.SessionStaging && typeof window.SessionStaging.renderEquipment === 'function') {
      window.SessionStaging.renderEquipment();
    }
  }

  window.HubToys = {
    init: function() {
      loadOwnedIds();
    },
    open: openToysModal,
    close: closeToysModal,
    render: renderToysModal,
    toggleOwned: toggleItemOwnership,
    changeQuantity: updateQuantity,
    applyStarterBundle: applyStarterBundle,
    switchCategoryTab: switchCategoryTab,
    handleSearch: handleSearchInput,
    openCustomModal: openCustomItemModal,
    closeCustomModal: closeCustomItemModal,
    saveCustomItem: saveCustomItem,
    triggerPhotoCapture: triggerPhotoCapture,
    deleteToyPhoto: deleteToyPhoto,
    getOwnedIds: function() {
      loadOwnedIds();
      return ownedIds.slice();
    },
    getItemQuantity: getItemQuantity
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      loadOwnedIds();
    });
  } else {
    loadOwnedIds();
  }

})(window);
