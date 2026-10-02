/**
 * js/hub_toys.js
 * TACTUS Der Intelligente Ausrüstungsschrank, Hardware-Atelier & 3-Stufen-Bundle-Wizard (V3.0 Haute-Horlogerie)
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien nach Master-Roadbook:
 * - 100 % UTF-8 Integrität: Echte deutsche Umlaute (ä, ö, ü, ß) im gesamten Modul
 * - Haute-Horlogerie Palette: OLED-Schwarz (#000000), Graphit (#090d14), Champagner-Gold (#c5a880),
 *   Feingold (#d4af37), Imperial Malachit (#142b24/#2e5746), Cognac (#8a5232/#b3734a) und Bordeaux (#991b1b)
 * - Interaktiver 3-Stufen Bundle-Wizard: Manuelle Auswahl des Paares kombiniert mit KI- und DoF-Vorschlägen
 * - Vollautomatische Generierung von Community Wisdom (Top- vs. Bottom-Perspektive) direkt beim Anlegen
 * - 0–5 Sterne-Rating und persönliche Reiz-Definition getrennt für Top und Bottom pro realem Werkzeug
 * - Visual Toy-Inspector mit übersichtlichem 3-Reiter-Cockpit (Hardware/RACK, Community Wisdom, Paar-Reiz & Rating)
 * - Mengenskalierung ($N$ Stück / quantity) & Passform-Zuordnung (both / A / B)
 * - RACK-Allergie-Radar (Automatischer Abgleich mit dem Gesundheitspass des Partners)
 * - Materialscharfe Desinfektionsprotokolle für die Reverse Aftercare
 * - Multimodale 1:1 Foto-Kamera Erfassung via HubPhotos
 * - Sichere modale Lösch-Rückfrage (Kein window.confirm)
 */

(function(window) {
  'use strict';

  const STORAGE_KEY_OWNED = 'tactus_owned_equipment';
  const STORAGE_KEY_OWNED_LEGACY = 'kompass_owned_equipment';
  const STORAGE_KEY_QUANTITIES = 'tactus_toy_quantities';
  const STORAGE_KEY_ASSIGNMENTS = 'tactus_toy_assignments';
  const STORAGE_KEY_CUSTOM = 'tactus_custom_equipment';
  const STORAGE_KEY_RATINGS = 'tactus_toy_ratings';       // { [toyId]: { top: 0..5, sub: 0..5 } }
  const STORAGE_KEY_APPEAL = 'tactus_toy_appeal';         // { [toyId]: { top: "...", sub: "..." } }
  const STORAGE_KEY_COMMUNITY = 'tactus_toy_community';   // { [toyId]: { top: "...", sub: "...", generatedAt } }
  const STORAGE_KEY_SAVED_BUNDLES = 'tactus_saved_bundles';
  const STORAGE_KEY_MEDICAL_PASS = 'tactus_medical_pass';
  const STORAGE_KEY_ACTIVE_BUNDLE = 'tactus_staging_bundle';

  let closetState = {
    ownedIds: [],
    quantities: {},
    assignments: {},
    customToys: [],
    ratings: {},
    appealNotes: {},
    communityWisdom: {},
    savedBundles: [],
    activeCategoryFilter: 'all',
    activeInspectorToyId: null,
    activeInspectorTab: 'specs', // 'specs' | 'wisdom' | 'couple'
    isInspectorOpen: false,
    isWizardOpen: false
  };

  let wizardState = {
    step: 1,
    step1ToyId: null,
    step2ToyId: null,
    step3ToyId: null,
    bundleTitle: '',
    selectedCategory: 'all',
    rationale: ''
  };

  const PRESEEDED_WISDOM_FALLBACKS = {
    bondage: {
      top: "Ruhige, tragende Kontrolle über die motorische Handlungsfähigkeit des Partners. Schafft einen klaren Fokus im Raum.",
      sub: "Das Abgeben aller Verantwortung entlastet das vegetative Nervensystem. Fester Tiefendruck erdet und stoppt das Grübeln."
    },
    impact: {
      top: "Akustische Resonanz, satter Kontakt und die sichtbare Haltungsdisziplin des Partners schenken erotische Entschlossenheit.",
      sub: "Flächige Hitzewellen schütten körpereigene Endorphine aus und holen die Wahrnehmung vollständig in den gegenwärtigen Moment."
    },
    chastity: {
      top: "Ausschließliche Verfügungsgewalt über die Lust. Die ungeteilte Aufmerksamkeit und Hingabe des Partners richtet sich voll auf die Führung.",
      sub: "Befreiung vom ständigen Ejakulationsdruck. Die sexuelle Energie kanalisiert sich in tiefe Ehrerbietung und freudigen Dienst."
    },
    sensory: {
      top: "Gezielte Führung der sensorischen Sinneskanäle. Der Partner reagiert hochsensibel auf die leiseste Berührung.",
      sub: "Der Wegfall des Sehsinns intensiviert Geräusche, Atem und Hautkontakte zu einem tranceartigen Rauscherlebnis."
    },
    care: {
      top: "Schenkt das warme Gefühl von Verantwortung und Schutz nach intensiver Anspannung.",
      sub: "Körperliche Geborgenheit, Wärme und das sichere Gefühl, nach der Grenzerfahrung behutsam aufgefangen zu werden."
    }
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

  function loadClosetState() {
    try {
      const rawOwned = localStorage.getItem(STORAGE_KEY_OWNED) || localStorage.getItem(STORAGE_KEY_OWNED_LEGACY);
      closetState.ownedIds = rawOwned ? (JSON.parse(rawOwned) || []) : [];

      const rawQty = localStorage.getItem(STORAGE_KEY_QUANTITIES);
      closetState.quantities = rawQty ? (JSON.parse(rawQty) || {}) : {};

      const rawAssign = localStorage.getItem(STORAGE_KEY_ASSIGNMENTS);
      closetState.assignments = rawAssign ? (JSON.parse(rawAssign) || {}) : {};

      const rawCustom = localStorage.getItem(STORAGE_KEY_CUSTOM);
      closetState.customToys = rawCustom ? (JSON.parse(rawCustom) || []) : [];

      const rawRatings = localStorage.getItem(STORAGE_KEY_RATINGS);
      closetState.ratings = rawRatings ? (JSON.parse(rawRatings) || {}) : {};

      const rawAppeal = localStorage.getItem(STORAGE_KEY_APPEAL);
      closetState.appealNotes = rawAppeal ? (JSON.parse(rawAppeal) || {}) : {};

      const rawComm = localStorage.getItem(STORAGE_KEY_COMMUNITY);
      closetState.communityWisdom = rawComm ? (JSON.parse(rawComm) || {}) : {};

      const rawBundles = localStorage.getItem(STORAGE_KEY_SAVED_BUNDLES);
      closetState.savedBundles = rawBundles ? (JSON.parse(rawBundles) || []) : [];
    } catch (e) {
      console.warn("[TACTUS Closet] Fehler beim Laden des States:", e);
    }
  }

  function saveClosetState() {
    try {
      localStorage.setItem(STORAGE_KEY_OWNED, JSON.stringify(closetState.ownedIds));
      localStorage.setItem(STORAGE_KEY_OWNED_LEGACY, JSON.stringify(closetState.ownedIds));
      localStorage.setItem(STORAGE_KEY_QUANTITIES, JSON.stringify(closetState.quantities));
      localStorage.setItem(STORAGE_KEY_ASSIGNMENTS, JSON.stringify(closetState.assignments));
      localStorage.setItem(STORAGE_KEY_CUSTOM, JSON.stringify(closetState.customToys));
      localStorage.setItem(STORAGE_KEY_RATINGS, JSON.stringify(closetState.ratings));
      localStorage.setItem(STORAGE_KEY_APPEAL, JSON.stringify(closetState.appealNotes));
      localStorage.setItem(STORAGE_KEY_COMMUNITY, JSON.stringify(closetState.communityWisdom));
      localStorage.setItem(STORAGE_KEY_SAVED_BUNDLES, JSON.stringify(closetState.savedBundles));
    } catch (e) {
      console.warn("[TACTUS Closet] Konnte State nicht sichern:", e);
    }

    if (window.CloudSync && typeof window.CloudSync.trigger === 'function') {
      window.CloudSync.trigger();
    }
  }

  function getPairContext() {
    let names = { A: 'Partner 1', B: 'Partner 2' };
    let topRole = 'A';
    let bottomRole = 'B';

    if (window.HubContext && typeof window.HubContext.getRoles === 'function') {
      const r = window.HubContext.getRoles();
      topRole = r.topRole;
      bottomRole = r.bottomRole;
      names = window.HubContext.getNames();
    }

    let medicalPass = {};
    try {
      const rawPass = localStorage.getItem(STORAGE_KEY_MEDICAL_PASS);
      if (rawPass) medicalPass = JSON.parse(rawPass) || {};
    } catch (e) {}

    return {
      topName: names[topRole] || 'Top',
      bottomName: names[bottomRole] || 'Bottom',
      topRole,
      bottomRole,
      hasLatexAllergy: !!medicalPass.hasLatexAllergy
    };
  }

  function getAllCatalogToys() {
    let standard = [];
    if (window.EquipmentCatalog && typeof window.EquipmentCatalog.getAll === 'function') {
      standard = window.EquipmentCatalog.getAll();
    }
    return standard.concat(closetState.customToys);
  }

  function getToyById(toyId) {
    const all = getAllCatalogToys();
    return all.find(t => t.id === toyId) || null;
  }

  function getToyRatingData(toyId) {
    const pair = getPairContext();
    const r = closetState.ratings[toyId] || {};
    const topScore = (typeof r.top === 'number') ? r.top : 0;
    const subScore = (typeof r.sub === 'number') ? r.sub : 0;

    let avg = 0;
    let count = 0;
    if (topScore > 0) { avg += topScore; count++; }
    if (subScore > 0) { avg += subScore; count++; }
    const finalAvg = count > 0 ? (avg / count).toFixed(1) : null;

    return {
      topScore,
      subScore,
      average: finalAvg,
      topName: pair.topName,
      bottomName: pair.bottomName
    };
  }

  function ensureModalsInDom() {
    let inspectorEl = document.getElementById('modal-toy-inspector');
    if (!inspectorEl) {
      inspectorEl = document.createElement('div');
      inspectorEl.id = 'modal-toy-inspector';
      inspectorEl.className = "fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none";
      inspectorEl.style.display = 'none';
      document.body.appendChild(inspectorEl);
    }

    let wizardEl = document.getElementById('modal-bundle-wizard');
    if (!wizardEl) {
      wizardEl = document.createElement('div');
      wizardEl.id = 'modal-bundle-wizard';
      wizardEl.className = "fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none";
      wizardEl.style.display = 'none';
      document.body.appendChild(wizardEl);
    }

    let customEl = document.getElementById('modal-add-custom-toy');
    if (!customEl) {
      customEl = document.createElement('div');
      customEl.id = 'modal-add-custom-toy';
      customEl.className = "fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none";
      customEl.style.display = 'none';
      document.body.appendChild(customEl);
    }
  }

  function renderClosetView(containerId = 'hub-toys-closet-container') {
    loadClosetState();
    ensureModalsInDom();

    const container = document.getElementById(containerId);
    if (!container) return;

    const pair = getPairContext();
    const allToys = getAllCatalogToys();
    const ownedToys = allToys.filter(t => closetState.ownedIds.includes(t.id));

    const categories = [
      { id: 'all', label: 'Alle' },
      { id: 'bondage', label: 'Fesselung' },
      { id: 'impact', label: 'Zucht & Schlag' },
      { id: 'chastity', label: 'Keuschheit' },
      { id: 'sensory', label: 'Sensorik' },
      { id: 'care', label: 'Nachsorge' }
    ];

    const filteredToys = (closetState.activeCategoryFilter === 'all')
      ? ownedToys
      : ownedToys.filter(t => t.category === closetState.activeCategoryFilter);

    container.innerHTML = `
      <div class="space-y-4 font-sans text-xs">
        
        <!-- HEADER KACHEL MIT BUNDLE WIZARD BUTTON -->
        <div class="p-4 sm:p-5 rounded-3xl bg-[#090d14] border border-[#1e2638] shadow-2xl space-y-3">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-[#1e2638]/70 pb-3">
            <div class="space-y-0.5 min-w-0 flex-1">
              <span class="px-2.5 py-0.5 rounded-full text-[9.5px] font-mono font-bold uppercase tracking-wider bg-[#000000] text-[#c5a880] border border-[#c5a880]/40 inline-block">
                Hardware-Atelier &amp; Inventar
              </span>
              <h2 class="text-base sm:text-xl font-serif text-[#f8fafc] font-normal mt-0.5 truncate">
                Der Intelligente Ausrüstungsschrank
              </h2>
            </div>
            
            <div class="flex items-center gap-1.5 flex-wrap font-mono">
              <button type="button" onclick="HubToys.openBundleWizard()" class="px-3.5 py-2 rounded-xl bg-[#c5a880] hover:bg-[#dfcaa9] text-black font-bold text-xs touch-btn shadow-md flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-black" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>
                <span>✨ Bundle-Wizard (3 Steps)</span>
              </button>
              <button type="button" onclick="HubToys.openAddCustomModal()" class="px-3 py-2 rounded-xl bg-[#000000] hover:bg-[#101622] border border-[#1e2638] text-[#c5a880] font-bold text-xs touch-btn">
                + Neues Toy
              </button>
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-between text-[11px] text-[#94a3b8] gap-2">
            <p class="leading-relaxed flex-1 min-w-[200px]">
              Verwaltet reale Ausrüstung, Stückzahlen, Passformen, individuelle Paar-Reize und materialscharfe Desinfektionsprotokolle.
            </p>
            <div class="flex items-center gap-3 font-mono text-[10.5px]">
              <span class="text-[#c5a880] font-bold">${ownedToys.length} Gegenstände im Schrank</span>
              ${closetState.savedBundles.length > 0 ? `<span class="text-[#d4af37] font-bold">· ${closetState.savedBundles.length} Bundles</span>` : ''}
            </div>
          </div>

          <!-- ALLERGIE-RADAR STATUS -->
          ${pair.hasLatexAllergy ? `
            <div class="p-2.5 rounded-2xl bg-[#450a0a]/30 border border-[#991b1b] flex items-center justify-between text-[10.5px]">
              <div class="flex items-center gap-2 text-white">
                <span class="w-2 h-2 rounded-full bg-[#991b1b] animate-ping"></span>
                <strong>RACK-Allergie-Radar: Latex-Allergie von ${escapeHtml(pair.bottomName)} aktiv!</strong>
              </div>
              <span class="text-[9.5px] font-mono text-[#b3734a]">Latex-Artikel werden markiert</span>
            </div>
          ` : ''}
        </div>

        <!-- GESPEICHERTE EIGENE BUNDLES -->
        ${closetState.savedBundles.length > 0 ? `
          <div class="p-4 rounded-3xl bg-[#090d14] border border-[#c5a880]/40 space-y-2.5 shadow-md">
            <div class="flex items-center justify-between border-b border-[#1e2638] pb-1.5">
              <span class="text-[10px] font-mono uppercase tracking-wider text-[#c5a880] font-bold">Eure gespeicherten Session-Bundles:</span>
              <span class="text-[9px] font-mono text-[#94a3b8]">${closetState.savedBundles.length} vorkonfiguriert</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              ${closetState.savedBundles.map((b, idx) => `
                <div class="p-2.5 rounded-2xl bg-[#000000] border border-[#1e2638] flex flex-col justify-between space-y-2">
                  <div>
                    <strong class="text-xs text-white block truncate">${escapeHtml(b.title)}</strong>
                    <span class="text-[9.5px] text-[#94a3b8] font-mono block">${(b.toyIds || []).length} Gegenstände</span>
                  </div>
                  <div class="flex items-center justify-between pt-1 border-t border-[#1e2638]">
                    <button type="button" onclick="HubToys.applyBundleToStaging('${encodeURIComponent(JSON.stringify(b.toyIds))}')" class="text-[10px] font-mono text-[#c5a880] hover:underline font-bold">
                      Ins Staging ↗
                    </button>
                    <button type="button" onclick="HubToys.deleteBundle(${idx})" class="text-[9px] font-mono text-[#991b1b] hover:underline">
                      Löschen
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- FILTER-LEISTE DER KATEGORIEN -->
        <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 border-b border-[#1e2638] font-mono text-xs">
          ${categories.map(c => `
            <button type="button" onclick="HubToys.setCategoryFilter('${c.id}')" class="px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all touch-btn ${closetState.activeCategoryFilter === c.id ? 'bg-[#000000] border border-[#c5a880] text-[#c5a880] shadow-sm' : 'bg-[#090d14] border border-[#1e2638] text-[#94a3b8] hover:text-[#f8fafc]'}">
              ${escapeHtml(c.label)}
            </button>
          `).join('')}
        </div>

        <!-- TOY CARDS GRID -->
        ${filteredToys.length === 0 ? `
          <div class="p-8 rounded-3xl bg-[#090d14] border border-[#1e2638] text-center space-y-2 text-[#94a3b8] font-mono">
            <p>Keine Gegenstände in dieser Kategorie im Schrank hinterlegt.</p>
            <button type="button" onclick="HubToys.openAddCustomModal()" class="px-4 py-2 rounded-xl bg-[#000000] border border-[#c5a880]/60 text-[#c5a880] font-bold text-xs touch-btn">
              + Ersten Gegenstand erfassen
            </button>
          </div>
        ` : `
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            ${filteredToys.map(toy => {
              const qty = closetState.quantities[toy.id] || 1;
              const assign = closetState.assignments[toy.id] || 'both';
              const rData = getToyRatingData(toy.id);
              const isLatex = (toy.materials || []).includes('latex');
              const hasAllergyConflict = isLatex && pair.hasLatexAllergy;

              let assignLabel = "Beide (Unisex)";
              if (assign === 'A') assignLabel = `Nur ${escapeHtml(pair.topName)}`;
              else if (assign === 'B') assignLabel = `Nur ${escapeHtml(pair.bottomName)}`;

              return `
                <div class="p-4 rounded-3xl bg-[#090d14] border transition-all space-y-3 flex flex-col justify-between shadow-md ${hasAllergyConflict ? 'border-[#991b1b] bg-[#450a0a]/10' : 'border-[#1e2638] hover:border-[#c5a880]/50'}">
                  
                  <div class="space-y-2.5">
                    <!-- OBEN: MENGE, PASSFORM & RATING -->
                    <div class="flex items-center justify-between gap-1.5 font-mono text-[10px]">
                      <div class="flex items-center gap-1.5 flex-wrap">
                        <span class="px-2 py-0.5 rounded-lg bg-[#000000] text-[#c5a880] border border-[#c5a880]/30 font-bold">
                          ${qty} Stück
                        </span>
                        <span class="text-[#94a3b8]">${escapeHtml(assignLabel)}</span>
                      </div>
                      ${rData.average ? `
                        <span class="px-1.5 py-0.5 rounded bg-[#000000] text-[#d4af37] border border-[#d4af37]/40 font-bold flex items-center gap-0.5">
                          <span>★</span>
                          <span>${rData.average}</span>
                        </span>
                      ` : `
                        <span class="text-[9px] text-[#94a3b8]/60 font-mono">Unbewertet</span>
                      `}
                    </div>

                    <!-- FOTO / ICON PLATZHALTER -->
                    <div onclick="HubToys.openToyInspector('${toy.id}')" class="h-28 w-full rounded-2xl bg-[#000000] border border-[#1e2638] relative overflow-hidden flex items-center justify-center cursor-pointer group touch-btn">
                      <div id="toy-thumb-${toy.id}" class="w-full h-full flex items-center justify-center">
                        <svg class="w-10 h-10 text-[#c5a880]/40 group-hover:text-[#c5a880] transition-colors" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/></svg>
                      </div>
                      <span class="absolute bottom-1.5 right-2 text-[9px] font-mono text-[#94a3b8]/70 bg-black/80 px-1.5 py-0.5 rounded">
                        Inspector ↗
                      </span>
                    </div>

                    <!-- TITEL & ALLERGIE-WARNUNG -->
                    <div>
                      <strong onclick="HubToys.openToyInspector('${toy.id}')" class="text-xs text-[#f8fafc] font-bold block cursor-pointer hover:text-[#c5a880] transition-colors leading-tight">
                        ${escapeHtml(toy.name)}
                      </strong>
                      <p class="text-[10px] text-[#94a3b8] leading-snug mt-1 line-clamp-2">
                        ${escapeHtml(toy.somaticEffect || toy.desc || 'Ausrüstungsgegenstand')}
                      </p>
                    </div>

                    ${hasAllergyConflict ? `
                      <div class="p-1.5 rounded-xl bg-[#450a0a] border border-[#991b1b] text-white text-[9.5px] font-mono font-bold text-center">
                        ⚠️ Enthält Latex (Allergie-Gefahr!)
                      </div>
                    ` : ''}
                  </div>

                  <!-- UNTEN: SCHNELLAUSWAHL & INSPECTOR BUTTON -->
                  <div class="pt-2 border-t border-[#1e2638] flex items-center justify-between gap-1 font-mono text-[10px]">
                    <span class="text-[#94a3b8] truncate">Zone: ${escapeHtml(toy.somaticZone || 'Körper')}</span>
                    <button type="button" onclick="HubToys.openToyInspector('${toy.id}')" class="px-2.5 py-1 rounded-xl bg-[#000000] hover:bg-[#101622] border border-[#c5a880]/50 text-[#c5a880] font-bold touch-btn">
                      Details
                    </button>
                  </div>

                </div>
              `;
            }).join('')}
          </div>
        `}

      </div>
    `;

    filteredToys.forEach(t => {
      loadThumbPhoto(t.id);
    });
  }

  async function loadThumbPhoto(toyId) {
    if (!window.HubPhotos || typeof window.HubPhotos.getPhoto !== 'function') return;
    try {
      const dataUrl = await window.HubPhotos.getPhoto(toyId);
      const container = document.getElementById(`toy-thumb-${toyId}`);
      if (container && dataUrl) {
        container.innerHTML = `<img src="${dataUrl}" alt="Foto" class="w-full h-full object-cover rounded-2xl" />`;
      }
    } catch (e) {}
  }

  function openToyInspector(toyId) {
    loadClosetState();
    ensureModalsInDom();

    const toy = getToyById(toyId);
    if (!toy) return;

    closetState.activeInspectorToyId = toyId;
    closetState.isInspectorOpen = true;

    renderToyInspectorContent();

    const modal = document.getElementById('modal-toy-inspector');
    if (modal) modal.style.display = 'flex';
  }

  function closeToyInspector() {
    closetState.isInspectorOpen = false;
    closetState.activeInspectorToyId = null;
    const modal = document.getElementById('modal-toy-inspector');
    if (modal) modal.style.display = 'none';
    renderClosetView();
  }

  function setInspectorTab(tabId) {
    closetState.activeInspectorTab = tabId;
    renderToyInspectorContent();
  }

  function renderToyInspectorContent() {
    const modal = document.getElementById('modal-toy-inspector');
    if (!modal || !closetState.activeInspectorToyId) return;

    const toyId = closetState.activeInspectorToyId;
    const toy = getToyById(toyId);
    if (!toy) return;

    const pair = getPairContext();
    const qty = closetState.quantities[toyId] || 1;
    const assign = closetState.assignments[toyId] || 'both';
    const rData = getToyRatingData(toyId);
    const activeTab = closetState.activeInspectorTab || 'specs';
    const appeal = closetState.appealNotes[toyId] || {};
    const wisdom = closetState.communityWisdom[toyId] || (toy.communityWisdom || PRESEEDED_WISDOM_FALLBACKS[toy.category] || PRESEEDED_WISDOM_FALLBACKS.bondage);
    const isLatex = (toy.materials || []).includes('latex');

    modal.innerHTML = `
      <div class="bg-[#090d14] rounded-3xl max-w-xl w-full border border-[#c5a880]/60 p-5 space-y-4 shadow-2xl text-xs text-[#f8fafc] font-sans max-h-[92vh] overflow-y-auto">
        
        <!-- HEADER MIT TITEL & CLOSE -->
        <div class="flex items-center justify-between border-b border-[#1e2638] pb-3 gap-2">
          <div class="space-y-0.5 min-w-0 flex-1">
            <span class="text-[9.5px] font-mono uppercase tracking-wider text-[#c5a880] font-bold block">
              Visual Toy-Inspector &amp; Hardware-Profil
            </span>
            <h3 class="text-sm sm:text-base font-serif text-white font-bold truncate">
              ${escapeHtml(toy.name)}
            </h3>
          </div>
          <button type="button" onclick="HubToys.closeToyInspector()" class="w-8 h-8 rounded-xl bg-[#000000] border border-[#1e2638] text-[#94a3b8] hover:text-white flex items-center justify-center touch-btn">✕</button>
        </div>

        <!-- 3-REITER NAVIGATION IM INSPECTOR -->
        <div class="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-[#000000] border border-[#1e2638] font-mono text-[10px]">
          <button type="button" onclick="HubToys.setInspectorTab('specs')" class="py-2 rounded-xl font-bold transition-all touch-btn ${activeTab === 'specs' ? 'bg-[#090d14] text-[#c5a880] border border-[#c5a880]/40 shadow-sm' : 'text-[#94a3b8] hover:text-white'}">
            1. Hardware &amp; RACK
          </button>
          <button type="button" onclick="HubToys.setInspectorTab('wisdom')" class="py-2 rounded-xl font-bold transition-all touch-btn ${activeTab === 'wisdom' ? 'bg-[#090d14] text-[#c5a880] border border-[#c5a880]/40 shadow-sm' : 'text-[#94a3b8] hover:text-white'}">
            2. Community Wisdom
          </button>
          <button type="button" onclick="HubToys.setInspectorTab('couple')" class="py-2 rounded-xl font-bold transition-all touch-btn ${activeTab === 'couple' ? 'bg-[#090d14] text-[#c5a880] border border-[#c5a880]/40 shadow-sm' : 'text-[#94a3b8] hover:text-white'}">
            3. Unser Reiz (Rating)
          </button>
        </div>

        <!-- REITER 1: HARDWARE & RACK SPEZIFIKATION -->
        ${activeTab === 'specs' ? `
          <div class="space-y-3.5 animate-fade-in">
            <!-- FOTO BEREICH MIT KAMERA-BUTTON -->
            <div class="h-44 w-full rounded-2xl bg-[#000000] border border-[#1e2638] relative overflow-hidden flex items-center justify-center">
              <div id="inspector-main-photo" class="w-full h-full flex items-center justify-center">
                <svg class="w-12 h-12 text-[#c5a880]/30" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 6v12a2.25 2.25 0 002.25 2.25zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/></svg>
              </div>
              <button type="button" onclick="HubToys.triggerPhotoCapture('${toyId}')" class="absolute bottom-2.5 right-2.5 px-3 py-1.5 rounded-xl bg-black/80 hover:bg-black border border-[#c5a880]/60 text-[#c5a880] font-mono text-[10px] font-bold touch-btn flex items-center gap-1.5 shadow-md">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"/><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"/></svg>
                <span>Foto erfassen (Vision)</span>
              </button>
            </div>

            <!-- EINSTELLUNGEN: MENGE, PASSFORM, LAGERORT -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
              <div class="p-3 rounded-2xl bg-[#000000] border border-[#1e2638] space-y-1">
                <label class="text-[9.5px] uppercase text-[#94a3b8] block font-bold">Vorhandene Stückzahl:</label>
                <div class="flex items-center gap-2">
                  <button type="button" onclick="HubToys.adjustQuantity('${toyId}', -1)" class="w-8 h-8 rounded-xl bg-[#090d14] border border-[#1e2638] text-white font-bold flex items-center justify-center touch-btn">-</button>
                  <span class="text-sm font-bold text-[#c5a880] w-8 text-center">${qty}</span>
                  <button type="button" onclick="HubToys.adjustQuantity('${toyId}', 1)" class="w-8 h-8 rounded-xl bg-[#090d14] border border-[#1e2638] text-white font-bold flex items-center justify-center touch-btn">+</button>
                </div>
              </div>

              <div class="p-3 rounded-2xl bg-[#000000] border border-[#1e2638] space-y-1">
                <label class="text-[9.5px] uppercase text-[#94a3b8] block font-bold">Passform &amp; Zuordnung:</label>
                <select onchange="HubToys.setAssignment('${toyId}', this.value)" class="w-full text-xs p-1.5 bg-[#090d14] border border-[#1e2638] rounded-xl text-white">
                  <option value="both" ${assign === 'both' ? 'selected' : ''}>Beide (Unisex)</option>
                  <option value="A" ${assign === 'A' ? 'selected' : ''}>Passt nur ${escapeHtml(pair.topName)}</option>
                  <option value="B" ${assign === 'B' ? 'selected' : ''}>Passt nur ${escapeHtml(pair.bottomName)}</option>
                </select>
              </div>
            </div>

            <!-- KINETISCHE SPEZIFIKATIONEN -->
            <div class="p-3.5 rounded-2xl bg-[#000000] border border-[#1e2638] space-y-2 text-[11px]">
              <div class="grid grid-cols-2 gap-2 font-mono text-[10px]">
                <div><span class="text-[#94a3b8]">Anatomische Zone:</span> <strong class="text-white block">${escapeHtml(toy.somaticZone || 'Körper')}</strong></div>
                <div><span class="text-[#94a3b8]">Restraint-Layer:</span> <strong class="text-[#c5a880] block">Layer ${toy.restraintLayer !== undefined ? toy.restraintLayer : 0}</strong></div>
              </div>
              <div class="pt-1 border-t border-[#1e2638] font-mono text-[10px]">
                <span class="text-[#94a3b8]">Materialien:</span> <strong class="text-[#f8fafc]">${escapeHtml((toy.materials || ['Leder/Metall']).join(', '))}</strong>
              </div>
              ${isLatex ? `<p class="text-[10px] text-[#b3734a] font-mono">⚠️ Enthält Naturkautschuk/Latex (Allergietest beachten).</p>` : ''}
            </div>

            <!-- REVERSE AFTERCARE DESINFEKTION -->
            <div class="p-3 rounded-2xl bg-[#142b24]/40 border border-[#2e5746] space-y-1">
              <span class="text-[9.5px] font-mono uppercase tracking-wider text-[#2e5746] font-bold block">
                RACK-Desinfektionsprotokoll (Reverse Aftercare):
              </span>
              <p class="text-[10.5px] text-[#f8fafc]">
                ${escapeHtml((toy.safetyProtocol && toy.safetyProtocol.disinfectionMethod) ? toy.safetyProtocol.disinfectionMethod.replace(/_/g, ' ') : 'Antiseptisches Pflegespray oder milde Seife')}
              </p>
            </div>
          </div>
        ` : ''}

        <!-- REITER 2: COMMUNITY WISDOM (DIREKT BEIM ANLEGEN BEREIT) -->
        ${activeTab === 'wisdom' ? `
          <div class="space-y-3.5 animate-fade-in">
            <div class="flex items-center justify-between border-b border-[#1e2638] pb-2">
              <span class="text-[10px] font-mono text-[#94a3b8]">Erotische Psychologie &amp; Community Wisdom:</span>
              <button type="button" onclick="HubToys.generateAiWisdom('${toyId}', false)" class="px-2.5 py-1 rounded-xl bg-[#c5a880] hover:bg-[#dfcaa9] text-black font-mono text-[9.5px] font-bold touch-btn">
                ✨ Neu recherchieren
              </button>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div class="p-3.5 rounded-2xl bg-[#000000] border border-[#c5a880]/40 space-y-1.5">
                <strong class="text-[#c5a880] text-xs font-mono font-bold block">
                  Top-Perspektive (Warum es anmacht):
                </strong>
                <p class="text-[11px] text-[#f8fafc] leading-relaxed">
                  ${escapeHtml(wisdom.top || 'Verlässliche Dominanz, akustische Resonanz und sichtbare Haltungsdisziplin des Partners.')}
                </p>
              </div>

              <div class="p-3.5 rounded-2xl bg-[#000000] border border-[#8a5232] space-y-1.5">
                <strong class="text-[#b3734a] text-xs font-mono font-bold block">
                  Bottom-Perspektive (Warum es anmacht):
                </strong>
                <p class="text-[11px] text-[#f8fafc] leading-relaxed">
                  ${escapeHtml(wisdom.sub || 'Körperliche Begrenzung, Abschalten des Alltags-Grübelns und tiefe somatische Hingabe.')}
                </p>
              </div>
            </div>

            <p class="text-[10px] text-[#94a3b8] italic text-center">
              Recherchiert aus somatischen BDSM-Fallstudien &amp; Community-Erfahrungen.
            </p>
          </div>
        ` : ''}

        <!-- REITER 3: UNSER PAAR-REIZ & 0-5 STERNE RATING -->
        ${activeTab === 'couple' ? `
          <div class="space-y-3.5 animate-fade-in">
            <p class="text-[10.5px] text-[#94a3b8] leading-snug">
              Zusätzlich zum allgemeinen Fragebogen: Bewertet hier <em>dieses konkrete physische Werkzeug</em> und haltet euren ganz persönlichen Reiz daran fest.
            </p>

            <!-- PARTNER 1 (TOP) BEWERTUNG -->
            <div class="p-3.5 rounded-2xl bg-[#000000] border border-[#c5a880]/50 space-y-2">
              <div class="flex items-center justify-between">
                <strong class="text-xs text-[#c5a880] font-mono font-bold">
                  [${escapeHtml(pair.topName)} · Top]:
                </strong>
                <!-- 0-5 STERNE -->
                <div class="flex items-center gap-1 text-sm cursor-pointer select-none">
                  ${[1, 2, 3, 4, 5].map(star => `
                    <span onclick="HubToys.setRating('${toyId}', 'top', ${star})" class="transition-transform hover:scale-125 ${rData.topScore >= star ? 'text-[#d4af37]' : 'text-[#1e2638]'}">★</span>
                  `).join('')}
                  <span class="text-[10px] font-mono text-[#94a3b8] ml-1">(${rData.topScore}/5)</span>
                </div>
              </div>
              <textarea id="input-appeal-top-${toyId}" rows="2" placeholder="Was macht dich an diesem spezifischen Werkzeug besonders an? (z. B. Haptik, Schwere, Ton...)" class="w-full p-2.5 rounded-xl bg-[#090d14] border border-[#1e2638] text-white text-[11px] focus:border-[#c5a880] focus:outline-none leading-relaxed">${escapeHtml(appeal.top || '')}</textarea>
            </div>

            <!-- PARTNER 2 (BOTTOM) BEWERTUNG -->
            <div class="p-3.5 rounded-2xl bg-[#000000] border border-[#8a5232] space-y-2">
              <div class="flex items-center justify-between">
                <strong class="text-xs text-[#b3734a] font-mono font-bold">
                  [${escapeHtml(pair.bottomName)} · Bottom]:
                </strong>
                <!-- 0-5 STERNE -->
                <div class="flex items-center gap-1 text-sm cursor-pointer select-none">
                  ${[1, 2, 3, 4, 5].map(star => `
                    <span onclick="HubToys.setRating('${toyId}', 'sub', ${star})" class="transition-transform hover:scale-125 ${rData.subScore >= star ? 'text-[#b3734a]' : 'text-[#1e2638]'}">★</span>
                  `).join('')}
                  <span class="text-[10px] font-mono text-[#94a3b8] ml-1">(${rData.subScore}/5)</span>
                </div>
              </div>
              <textarea id="input-appeal-sub-${toyId}" rows="2" placeholder="Was empfindest du, wenn dieses Tool an dir eingesetzt wird? (z. B. Hitzewelle, Hilflosigkeit...)" class="w-full p-2.5 rounded-xl bg-[#090d14] border border-[#1e2638] text-white text-[11px] focus:border-[#b3734a] focus:outline-none leading-relaxed">${escapeHtml(appeal.sub || '')}</textarea>
            </div>

            <div class="flex justify-end">
              <button type="button" onclick="HubToys.saveCoupleAppeal('${toyId}')" class="px-4 py-2 rounded-xl bg-[#c5a880] hover:bg-[#dfcaa9] text-black font-bold font-mono text-xs touch-btn shadow-md">
                Paar-Reiz &amp; Notizen speichern ✓
              </button>
            </div>
          </div>
        ` : ''}

        <!-- FOOTER MIT LÖSCH-OPTION -->
        <div class="pt-2 border-t border-[#1e2638] flex items-center justify-between font-mono text-[10px]">
          <button type="button" onclick="HubToys.confirmDeleteToy('${toyId}')" class="text-[#991b1b] hover:underline">
            Aus Schrank entfernen
          </button>
          <button type="button" onclick="HubToys.closeToyInspector()" class="px-4 py-1.5 rounded-xl bg-[#000000] border border-[#1e2638] text-white font-bold touch-btn">
            Schließen
          </button>
        </div>

      </div>
    `;

    if (activeTab === 'specs') {
      loadInspectorPhoto(toyId);
    }
  }

  async function loadInspectorPhoto(toyId) {
    if (!window.HubPhotos || typeof window.HubPhotos.getPhoto !== 'function') return;
    try {
      const dataUrl = await window.HubPhotos.getPhoto(toyId);
      const photoBox = document.getElementById('inspector-main-photo');
      if (photoBox && dataUrl) {
        photoBox.innerHTML = `<img src="${dataUrl}" alt="Ausrüstung" class="w-full h-full object-cover" />`;
      }
    } catch (e) {}
  }

  function triggerPhotoCapture(toyId) {
    if (!window.HubPhotos || typeof window.HubPhotos.captureForToy !== 'function') {
      showToast("Foto-Modul nicht verfügbar.");
      return;
    }

    window.HubPhotos.captureForToy(toyId, (dataUrl, visionProfile) => {
      loadClosetState();
      const photoBox = document.getElementById('inspector-main-photo');
      if (photoBox && dataUrl) {
        photoBox.innerHTML = `<img src="${dataUrl}" alt="Ausrüstung" class="w-full h-full object-cover" />`;
      }

      if (visionProfile && visionProfile.name) {
        showToast(`✓ KI-Vision erkannt: ${visionProfile.name}`);
        const custom = closetState.customToys.find(c => c.id === toyId);
        if (custom) {
          custom.somaticZone = visionProfile.somaticZone || custom.somaticZone;
          custom.materials = visionProfile.materials || custom.materials;
          saveClosetState();
        }
      }
      renderClosetView();
    });
  }

  function setRating(toyId, roleKey, stars) {
    loadClosetState();
    if (!closetState.ratings[toyId]) closetState.ratings[toyId] = { top: 0, sub: 0 };
    closetState.ratings[toyId][roleKey] = stars;
    saveClosetState();
    renderToyInspectorContent();
    showToast(`✓ Bewertung: ${stars} Sterne gesetzt`);
  }

  function saveCoupleAppeal(toyId) {
    loadClosetState();
    const topInput = document.getElementById(`input-appeal-top-${toyId}`);
    const subInput = document.getElementById(`input-appeal-sub-${toyId}`);

    if (!closetState.appealNotes[toyId]) closetState.appealNotes[toyId] = { top: '', sub: '' };
    if (topInput) closetState.appealNotes[toyId].top = topInput.value.trim();
    if (subInput) closetState.appealNotes[toyId].sub = subInput.value.trim();

    saveClosetState();
    showToast("✓ Paar-Reiz & Notizen gesichert");
  }

  async function generateAiWisdom(toyId, silent = false) {
    const toy = getToyById(toyId);
    if (!toy) return null;

    if (!silent) showToast("Recherchiere erotische Psychologie via KI...");

    let result = null;
    if (window.AIAdapter && typeof window.AIAdapter.generateText === 'function') {
      const prompt = `
Erstelle für den BDSM- und Erotik-Ausrüstungsgegenstand „${toy.name}“ (Kategorie: ${toy.category}, Zone: ${toy.somaticZone || 'Körper'}, Material: ${(toy.materials || []).join(', ')}) eine prägnante Darstellung der erotischen Psychologie:
1. Top-Perspektive: Warum macht das Führen/Handhaben dieses Werkzeugs an?
2. Bottom-Perspektive: Warum macht das Empfangen/Spüren dieses Reizes an?

Formuliere erwachsen, direkt, unkitschig und somatisch fundiert.
Antworte ausschließlich im JSON-Format:
{
  "top": "1-2 Sätze zur Psychologie des Tops",
  "sub": "1-2 Sätze zur Psychologie des Bottoms"
}
`;
      try {
        const aiRes = await window.AIAdapter.generateText({
          systemPrompt: "Du bist der somatische BDSM- und Hardware-Psychologe für TACTUS.",
          userPrompt: prompt,
          temperature: 0.7,
          returnJson: true
        });
        if (aiRes && aiRes.top && aiRes.sub) {
          result = { top: aiRes.top, sub: aiRes.sub, generatedAt: Date.now() };
        }
      } catch (e) {}
    }

    if (!result) {
      const fallback = PRESEEDED_WISDOM_FALLBACKS[toy.category] || PRESEEDED_WISDOM_FALLBACKS.bondage;
      result = {
        top: fallback.top,
        sub: fallback.sub,
        generatedAt: Date.now()
      };
    }

    loadClosetState();
    closetState.communityWisdom[toyId] = result;
    saveClosetState();

    if (!silent) {
      renderToyInspectorContent();
      showToast("✓ Community Wisdom aktualisiert");
    }
    return result;
  }

  function adjustQuantity(toyId, delta) {
    loadClosetState();
    const current = closetState.quantities[toyId] || 1;
    const newQty = Math.max(1, Math.min(20, current + delta));
    closetState.quantities[toyId] = newQty;
    saveClosetState();
    renderToyInspectorContent();
  }

  function setAssignment(toyId, value) {
    loadClosetState();
    closetState.assignments[toyId] = value;
    saveClosetState();
    showToast("✓ Passform-Zuordnung aktualisiert");
  }

  function confirmDeleteToy(toyId) {
    const toy = getToyById(toyId);
    if (!toy) return;

    let confirmModal = document.getElementById('modal-confirm-delete-toy');
    if (!confirmModal) {
      confirmModal = document.createElement('div');
      confirmModal.id = 'modal-confirm-delete-toy';
      confirmModal.className = "fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 select-none";
      document.body.appendChild(confirmModal);
    }

    confirmModal.innerHTML = `
      <div class="bg-[#090d14] rounded-3xl max-w-sm w-full border border-[#991b1b] p-5 space-y-3 text-xs text-[#f8fafc] font-sans">
        <h4 class="font-bold text-white text-sm font-serif">Gegenstand entfernen?</h4>
        <p class="text-[11px] text-[#94a3b8] leading-snug">
          Möchtest du „${escapeHtml(toy.name)}“ wirklich aus eurem Ausrüstungsschrank entfernen?
        </p>
        <div class="flex justify-end gap-2 pt-2 border-t border-[#1e2638] font-mono">
          <button type="button" onclick="document.getElementById('modal-confirm-delete-toy').style.display='none'" class="px-3.5 py-1.5 rounded-xl bg-[#000000] border border-[#1e2638] text-[#94a3b8] font-bold touch-btn">Abbrechen</button>
          <button type="button" onclick="HubToys.executeDeleteToy('${toyId}')" class="px-4 py-1.5 rounded-xl bg-[#991b1b] hover:bg-red-700 text-white font-bold touch-btn">Entfernen</button>
        </div>
      </div>
    `;
    confirmModal.style.display = 'flex';
  }

  function executeDeleteToy(toyId) {
    loadClosetState();
    closetState.ownedIds = closetState.ownedIds.filter(id => id !== toyId);
    closetState.customToys = closetState.customToys.filter(t => t.id !== toyId);
    delete closetState.quantities[toyId];
    delete closetState.assignments[toyId];
    delete closetState.ratings[toyId];
    delete closetState.appealNotes[toyId];
    saveClosetState();

    const confirmModal = document.getElementById('modal-confirm-delete-toy');
    if (confirmModal) confirmModal.style.display = 'none';

    closeToyInspector();
    showToast("Gegenstand aus dem Schrank entfernt.");
  }

  function openAddCustomModal() {
    ensureModalsInDom();
    const modal = document.getElementById('modal-add-custom-toy');
    if (!modal) return;

    modal.innerHTML = `
      <div class="bg-[#090d14] rounded-3xl max-w-md w-full border border-[#c5a880]/60 p-5 space-y-4 shadow-2xl text-xs text-[#f8fafc] font-sans">
        <div class="flex items-center justify-between border-b border-[#1e2638] pb-2">
          <div>
            <span class="text-[9.5px] font-mono uppercase text-[#c5a880] font-bold block">Hardware-Erfassung</span>
            <h3 class="text-sm font-bold text-white font-serif">Neuen Gegenstand erfassen</h3>
          </div>
          <button type="button" onclick="document.getElementById('modal-add-custom-toy').style.display='none'" class="w-8 h-8 rounded-xl bg-[#000000] border border-[#1e2638] text-[#94a3b8] hover:text-white flex items-center justify-center touch-btn">✕</button>
        </div>

        <p class="text-[10.5px] text-[#94a3b8] leading-snug">
          Die erotische Psychologie (Community Wisdom) wird beim Anlegen automatisch im Hintergrund für euch recherchiert.
        </p>

        <div class="space-y-3 font-mono">
          <div>
            <label class="text-[10px] text-[#94a3b8] uppercase block mb-1">Bezeichnung des Gegenstands:</label>
            <input type="text" id="custom-toy-name" placeholder="z. B. Glattleder-Korsett Noir mit Schnürung" class="w-full text-xs p-2.5 bg-[#000000] border border-[#1e2638] rounded-xl text-white font-sans focus:border-[#c5a880] focus:outline-none" />
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="text-[10px] text-[#94a3b8] uppercase block mb-1">Kategorie:</label>
              <select id="custom-toy-cat" class="w-full text-xs p-2 bg-[#000000] border border-[#1e2638] rounded-xl text-white">
                <option value="bondage">Fesselung &amp; Seil</option>
                <option value="impact">Zucht &amp; Schlag</option>
                <option value="chastity">Keuschheit</option>
                <option value="sensory">Sensorik</option>
                <option value="care">Nachsorge &amp; Vagus</option>
              </select>
            </div>
            <div>
              <label class="text-[10px] text-[#94a3b8] uppercase block mb-1">Stückzahl:</label>
              <input type="number" id="custom-toy-qty" value="1" min="1" max="20" class="w-full text-xs p-2 bg-[#000000] border border-[#1e2638] rounded-xl text-white" />
            </div>
          </div>

          <div>
            <label class="text-[10px] text-[#94a3b8] uppercase block mb-1">Anatomische Wirkzone:</label>
            <input type="text" id="custom-toy-zone" placeholder="z. B. Becken / Taille / Gesäß" class="w-full text-xs p-2.5 bg-[#000000] border border-[#1e2638] rounded-xl text-white font-sans focus:border-[#c5a880] focus:outline-none" />
          </div>
        </div>

        <div class="pt-2 border-t border-[#1e2638] flex justify-end gap-2 font-mono">
          <button type="button" onclick="document.getElementById('modal-add-custom-toy').style.display='none'" class="px-4 py-2 bg-[#000000] border border-[#1e2638] text-[#94a3b8] font-bold rounded-xl text-xs touch-btn">Abbrechen</button>
          <button type="button" onclick="HubToys.saveCustomToy()" class="px-5 py-2 bg-[#c5a880] hover:bg-[#dfcaa9] text-black font-bold rounded-xl text-xs touch-btn shadow-md">Im Schrank ablegen ✓</button>
        </div>
      </div>
    `;

    modal.style.display = 'flex';
  }

  function saveCustomToy() {
    const nameEl = document.getElementById('custom-toy-name');
    const catEl = document.getElementById('custom-toy-cat');
    const qtyEl = document.getElementById('custom-toy-qty');
    const zoneEl = document.getElementById('custom-toy-zone');

    const name = nameEl ? nameEl.value.trim() : '';
    if (!name) {
      showToast("Bitte gib dem Gegenstand einen Namen.");
      return;
    }

    const toyId = `custom_${Date.now()}`;
    const newToy = {
      id: toyId,
      name: name,
      category: catEl ? catEl.value : 'bondage',
      somaticZone: zoneEl ? zoneEl.value.trim() || 'Körper' : 'Körper',
      restraintLayer: 1,
      materials: ['Leder'],
      somaticEffect: 'Individuell erfasste Ausrüstung.'
    };

    loadClosetState();
    closetState.customToys.push(newToy);
    closetState.ownedIds.push(toyId);
    closetState.quantities[toyId] = qtyEl ? (parseInt(qtyEl.value, 10) || 1) : 1;
    saveClosetState();

    // Sofortige automatische Synthese der Community Wisdom im Hintergrund
    generateAiWisdom(toyId, true);

    const modal = document.getElementById('modal-add-custom-toy');
    if (modal) modal.style.display = 'none';

    renderClosetView();
    showToast(`✓ „${name}“ zum Schrank hinzugefügt & Weisheit generiert`);
  }

  function openBundleWizard() {
    ensureModalsInDom();
    loadClosetState();

    const ownedToys = getAllCatalogToys().filter(t => closetState.ownedIds.includes(t.id));
    if (ownedToys.length === 0) {
      showToast("Keine Gegenstände im Schrank vorhanden. Lege zuerst Ausrüstung an.");
      return;
    }

    wizardState = {
      step: 1,
      step1ToyId: null,
      step2ToyId: null,
      step3ToyId: null,
      bundleTitle: '',
      selectedCategory: 'all',
      rationale: ''
    };

    renderWizardStep();
    const modal = document.getElementById('modal-bundle-wizard');
    if (modal) modal.style.display = 'flex';
  }

  function closeBundleWizard() {
    const modal = document.getElementById('modal-bundle-wizard');
    if (modal) modal.style.display = 'none';
  }

  function setWizardCategory(catId) {
    wizardState.selectedCategory = catId;
    renderWizardStep();
  }

  function setWizardToy(stepNumber, toyId) {
    if (stepNumber === 1) wizardState.step1ToyId = toyId;
    else if (stepNumber === 2) wizardState.step2ToyId = toyId;
    else if (stepNumber === 3) wizardState.step3ToyId = toyId;
    renderWizardStep();
  }

  function nextWizardStep() {
    if (wizardState.step === 1 && !wizardState.step1ToyId) {
      showToast("Bitte wähle zuerst ein Basis-Werkzeug aus.");
      return;
    }
    if (wizardState.step === 2 && !wizardState.step2ToyId) {
      showToast("Bitte wähle ein Ergänzungs-Werkzeug aus (oder gehe zu Schritt 3).");
      return;
    }
    wizardState.step = Math.min(3, wizardState.step + 1);
    wizardState.selectedCategory = 'all';
    renderWizardStep();
  }

  function prevWizardStep() {
    wizardState.step = Math.max(1, wizardState.step - 1);
    wizardState.selectedCategory = 'all';
    renderWizardStep();
  }

  function renderWizardStep() {
    const modal = document.getElementById('modal-bundle-wizard');
    if (!modal) return;

    const ownedToys = getAllCatalogToys().filter(t => closetState.ownedIds.includes(t.id));
    const step = wizardState.step;

    const categories = [
      { id: 'all', label: 'Alle' },
      { id: 'bondage', label: 'Fesselung' },
      { id: 'impact', label: 'Zucht' },
      { id: 'chastity', label: 'Keuschheit' },
      { id: 'sensory', label: 'Sensorik' },
      { id: 'care', label: 'Nachsorge' }
    ];

    const currentSelectedId = (step === 1) ? wizardState.step1ToyId : ((step === 2) ? wizardState.step2ToyId : wizardState.step3ToyId);

    // Filter der Gegenstände nach gewählter Kategorie
    let displayToys = (wizardState.selectedCategory === 'all')
      ? ownedToys
      : ownedToys.filter(t => t.category === wizardState.selectedCategory);

    // Kinetische DoF-Empfehlung in Schritt 2 & 3
    let recommendedIds = [];
    if (step === 2 && wizardState.step1ToyId) {
      const anchorToy = getToyById(wizardState.step1ToyId);
      if (anchorToy) {
        if (anchorToy.category === 'bondage') recommendedIds = ownedToys.filter(t => t.category === 'impact' || t.category === 'sensory').map(t => t.id);
        else if (anchorToy.category === 'chastity') recommendedIds = ownedToys.filter(t => t.category === 'sensory' || t.category === 'bondage').map(t => t.id);
        else if (anchorToy.category === 'impact') recommendedIds = ownedToys.filter(t => t.category === 'care' || t.category === 'bondage').map(t => t.id);
      }
    }

    modal.innerHTML = `
      <div class="bg-[#090d14] rounded-3xl max-w-xl w-full border border-[#c5a880]/60 p-5 sm:p-6 space-y-4 shadow-2xl text-xs text-[#f8fafc] font-sans max-h-[92vh] overflow-y-auto">
        
        <!-- HEADER MIT SCHRITT-INDIKATOR -->
        <div class="flex items-center justify-between border-b border-[#1e2638] pb-3">
          <div>
            <span class="text-[9.5px] font-mono uppercase tracking-wider text-[#c5a880] font-bold block">
              Interaktiver Bundle-Konfigurator · Schritt ${step} von 3
            </span>
            <h3 class="text-sm sm:text-base font-serif text-white font-bold">
              ${step === 1 ? '1. Basis-Werkzeug (Der Anker)' : (step === 2 ? '2. Ergänzung &amp; Kinetische Harmonie' : '3. Akzent, Name &amp; RACK-Abschluss')}
            </h3>
          </div>
          <button type="button" onclick="HubToys.closeBundleWizard()" class="w-8 h-8 rounded-xl bg-[#000000] border border-[#1e2638] text-[#94a3b8] hover:text-white flex items-center justify-center touch-btn">✕</button>
        </div>

        <!-- SCHRITT-BALKEN -->
        <div class="grid grid-cols-3 gap-1.5 font-mono text-[10px]">
          <div class="p-1.5 rounded-xl border text-center ${step >= 1 ? 'bg-[#000000] border-[#c5a880] text-[#c5a880] font-bold' : 'bg-[#090d14] border-[#1e2638] text-[#94a3b8]'}">1. Basis</div>
          <div class="p-1.5 rounded-xl border text-center ${step >= 2 ? 'bg-[#000000] border-[#c5a880] text-[#c5a880] font-bold' : 'bg-[#090d14] border-[#1e2638] text-[#94a3b8]'}">2. Ergänzung</div>
          <div class="p-1.5 rounded-xl border text-center ${step === 3 ? 'bg-[#000000] border-[#c5a880] text-[#c5a880] font-bold' : 'bg-[#090d14] border-[#1e2638] text-[#94a3b8]'}">3. Abschluss</div>
        </div>

        ${step <= 2 ? `
          <!-- KATEGORIE-FILTER FÜR SCHRITT 1 & 2 -->
          <div class="space-y-1.5">
            <span class="text-[10px] font-mono text-[#94a3b8] block">Kategorie filtern:</span>
            <div class="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 font-mono text-[10.5px]">
              ${categories.map(c => `
                <button type="button" onclick="HubToys.setWizardCategory('${c.id}')" class="px-2.5 py-1 rounded-xl whitespace-nowrap transition-all touch-btn ${wizardState.selectedCategory === c.id ? 'bg-[#c5a880] text-black font-bold' : 'bg-[#000000] border border-[#1e2638] text-[#94a3b8] hover:text-white'}">
                  ${escapeHtml(c.label)}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- KI-EMPFEHLUNGS-HINWEIS IN SCHRITT 2 -->
          ${step === 2 && recommendedIds.length > 0 ? `
            <div class="p-2.5 rounded-2xl bg-[#000000] border border-[#c5a880]/40 flex items-center justify-between text-[10px]">
              <span class="text-[#c5a880] font-mono font-bold">✨ KI-Empfehlung: Harmonisiert kinetisch mit Schritt 1</span>
              <span class="text-[#94a3b8] font-mono">${recommendedIds.length} Vorschläge</span>
            </div>
          ` : ''}

          <!-- TOYS LISTE ZUR AUSWAHL -->
          <div class="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            ${displayToys.map(t => {
              const isSelected = currentSelectedId === t.id;
              const isRecommended = recommendedIds.includes(t.id);
              const rData = getToyRatingData(t.id);

              return `
                <div onclick="HubToys.setWizardToy(${step}, '${t.id}')" class="p-3 rounded-2xl border transition-all cursor-pointer touch-btn flex items-center justify-between gap-2 ${isSelected ? 'bg-[#000000] border-[#c5a880] shadow-md' : (isRecommended ? 'bg-[#000000] border-[#c5a880]/30 hover:border-[#c5a880]' : 'bg-[#000000] border-[#1e2638] hover:border-slate-700')}">
                  <div class="space-y-0.5 min-w-0 flex-1">
                    <div class="flex items-center gap-1.5 flex-wrap">
                      <strong class="text-xs text-white block">${escapeHtml(t.name)}</strong>
                      ${isRecommended ? '<span class="px-1.5 py-0.2 rounded text-[8.5px] font-mono bg-[#142b24] text-[#2e5746] border border-[#2e5746] font-bold">Empfohlen ✨</span>' : ''}
                      ${rData.average ? `<span class="text-[9px] font-mono text-[#d4af37]">★ ${rData.average}</span>` : ''}
                    </div>
                    <span class="text-[10px] text-[#94a3b8] block">Zone: ${escapeHtml(t.somaticZone || 'Körper')} · Layer ${t.restraintLayer || 0}</span>
                  </div>
                  <span class="text-xs font-mono font-bold ${isSelected ? 'text-[#c5a880]' : 'text-[#1e2638]'}">${isSelected ? '✓' : '○'}</span>
                </div>
              `;
            }).join('')}
          </div>
        ` : `
          <!-- SCHRITT 3: REZENSION, NAMEN & ABSCHLUSS -->
          <div class="space-y-3 animate-fade-in">
            <div class="space-y-1">
              <label class="text-[10px] font-mono uppercase text-[#94a3b8] block">Name für dieses Bundle:</label>
              <div class="flex items-center gap-2">
                <input type="text" id="wizard-bundle-title" value="${escapeHtml(wizardState.bundleTitle || 'Unser Session-Set')}" placeholder="z. B. Das Ritual der stummen Disziplin" class="w-full text-xs p-2.5 bg-[#000000] border border-[#1e2638] rounded-xl text-white font-sans focus:border-[#c5a880] focus:outline-none" />
                <button type="button" onclick="HubToys.suggestBundleTitle()" class="px-3 py-2 rounded-xl bg-[#000000] border border-[#c5a880]/50 text-[#c5a880] font-mono text-[10px] font-bold whitespace-nowrap touch-btn">
                  ✨ KI-Name
                </button>
              </div>
            </div>

            <div class="p-3 rounded-2xl bg-[#000000] border border-[#1e2638] space-y-2">
              <span class="text-[10px] font-mono uppercase text-[#c5a880] font-bold block">Ausgewählte Ausrüstung:</span>
              <div class="space-y-1">
                ${[wizardState.step1ToyId, wizardState.step2ToyId, wizardState.step3ToyId].filter(Boolean).map((id, idx) => {
                  const t = getToyById(id);
                  return t ? `
                    <div class="flex items-center justify-between text-[11px] p-1.5 rounded-xl bg-[#090d14] border border-[#1e2638]">
                      <span><strong class="text-[#c5a880] font-mono">${idx + 1}.</strong> ${escapeHtml(t.name)}</span>
                      <span class="text-[9.5px] font-mono text-[#94a3b8]">Zone: ${escapeHtml(t.somaticZone || 'Körper')}</span>
                    </div>
                  ` : '';
                }).join('')}
              </div>
            </div>

            <div class="p-3 rounded-2xl bg-[#142b24]/30 border border-[#2e5746] text-[10px] text-[#f8fafc] space-y-1">
              <strong class="text-[#2e5746] block font-bold font-mono">RACK-Sicherheitscheck:</strong>
              <p>Stelle vor dem Betreten des Schlafzimmers die Safeword-Ampel und die Verbandschere in Reichweite des Nachttischs bereit.</p>
            </div>
          </div>
        `}

        <!-- NAVIGATION & VOLLAUTOMATIK-TRIGGER -->
        <div class="pt-3 border-t border-[#1e2638] flex items-center justify-between font-mono text-xs">
          ${step > 1 ? `
            <button type="button" onclick="HubToys.prevWizardStep()" class="px-3 py-1.5 rounded-xl bg-[#000000] border border-[#1e2638] text-[#94a3b8] hover:text-white touch-btn">
              ← Zurück
            </button>
          ` : `
            <button type="button" onclick="HubToys.synthesizeFullAiBundle()" class="text-[#c5a880] hover:underline text-[10px]">
              ✨ Vollautomatisch zusammenstellen
            </button>
          `}

          <div class="flex items-center gap-2">
            ${step < 3 ? `
              <button type="button" onclick="HubToys.nextWizardStep()" class="px-4 py-2 rounded-xl bg-[#c5a880] hover:bg-[#dfcaa9] text-black font-bold touch-btn shadow-md">
                Weiter →
              </button>
            ` : `
              <button type="button" onclick="HubToys.saveWizardBundle()" class="px-5 py-2 rounded-xl bg-[#c5a880] hover:bg-[#dfcaa9] text-black font-bold touch-btn shadow-md">
                Bundle sichern &amp; ins Staging ↗
              </button>
            `}
          </div>
        </div>

      </div>
    `;
  }

  async function suggestBundleTitle() {
    const toys = [wizardState.step1ToyId, wizardState.step2ToyId, wizardState.step3ToyId].filter(Boolean).map(getToyById).filter(Boolean);
    if (toys.length === 0) return;

    let title = "Das Ritual der stummen Disziplin";
    if (window.AIAdapter && typeof window.AIAdapter.generateText === 'function') {
      try {
        const prompt = `Erstelle einen anspruchsvollen, erotischen und erwachsenen Namen (3-5 Worte) für ein BDSM-Session-Bundle bestehend aus: ${toys.map(t => t.name).join(', ')}. Kein Kitsch, keine Anführungszeichen.`;
        const res = await window.AIAdapter.generateText({
          systemPrompt: "Du bist der somatische Benennungs-Experte für TACTUS.",
          userPrompt: prompt,
          temperature: 0.7
        });
        if (res && res.trim().length > 3) title = res.trim().replace(/^["„']|["“']$/g, '');
      } catch (e) {}
    }

    wizardState.bundleTitle = title;
    const titleInput = document.getElementById('wizard-bundle-title');
    if (titleInput) titleInput.value = title;
    showToast("✓ Titel vorgeschlagen");
  }

  function saveWizardBundle() {
    const titleInput = document.getElementById('wizard-bundle-title');
    const title = titleInput ? (titleInput.value.trim() || 'Unser Session-Set') : 'Unser Session-Set';
    const toyIds = [wizardState.step1ToyId, wizardState.step2ToyId, wizardState.step3ToyId].filter(Boolean);

    if (toyIds.length === 0) {
      showToast("Mindestens ein Gegenstand muss gewählt sein.");
      return;
    }

    loadClosetState();
    const newBundle = {
      id: `bundle_${Date.now()}`,
      title: title,
      toyIds: toyIds,
      createdAt: Date.now()
    };

    closetState.savedBundles.unshift(newBundle);
    saveClosetState();

    applyBundleToStaging(encodeURIComponent(JSON.stringify(toyIds)));
    closeBundleWizard();
    renderClosetView();
    showToast(`✓ Bundle „${title}“ gesichert &amp; vorgemerkt!`);
  }

  function deleteBundle(index) {
    loadClosetState();
    if (closetState.savedBundles[index]) {
      closetState.savedBundles.splice(index, 1);
      saveClosetState();
      renderClosetView();
      showToast("Bundle entfernt.");
    }
  }

  async function synthesizeFullAiBundle() {
    const ownedToys = getAllCatalogToys().filter(t => closetState.ownedIds.includes(t.id));
    if (ownedToys.length === 0) return;

    showToast("Synthetisiere passgenaues Set via KI...");
    let picks = ownedToys.slice(0, 3).map(t => t.id);
    let title = "Das Ritual der Hingabe";

    if (window.AIAdapter && typeof window.AIAdapter.generateText === 'function') {
      try {
        const inventoryList = ownedToys.map(t => `- ID: ${t.id} | Name: ${t.name} | Kat: ${t.category}`).join('\n');
        const prompt = `
Wähle aus diesem realen Schrank-Inventar 2 bis 3 harmonierende Gegenstände für ein stimmiges Session-Set:
${inventoryList}

Antworte ausschließlich im JSON-Format:
{
  "bundleTitle": "Anspruchsvoller Titel",
  "selectedToyIds": ["id1", "id2"]
}
`;
        const res = await window.AIAdapter.generateText({
          systemPrompt: "Du bist der somatische Ausrüstungs-Stratege für TACTUS.",
          userPrompt: prompt,
          temperature: 0.65,
          returnJson: true
        });
        if (res && Array.isArray(res.selectedToyIds) && res.selectedToyIds.length > 0) {
          picks = res.selectedToyIds.filter(id => ownedToys.some(t => t.id === id));
          if (res.bundleTitle) title = res.bundleTitle;
        }
      } catch (e) {}
    }

    wizardState.step1ToyId = picks[0] || null;
    wizardState.step2ToyId = picks[1] || null;
    wizardState.step3ToyId = picks[2] || null;
    wizardState.bundleTitle = title;
    wizardState.step = 3;
    renderWizardStep();
    showToast("✓ Set erfolgreich synthetisiert");
  }

  function applyBundleToStaging(encodedIds) {
    try {
      const toyIds = JSON.parse(decodeURIComponent(encodedIds));
      localStorage.setItem(STORAGE_KEY_ACTIVE_BUNDLE, JSON.stringify(toyIds));

      if (window.SessionStaging && typeof window.SessionStaging.getConfig === 'function') {
        const cfg = window.SessionStaging.getConfig();
        cfg.selectedEquipmentIds = toyIds;
      }

      showToast("✓ Bundle als Session-Set für Schlafzimmer vorgemerkt!");
    } catch (e) {
      showToast("Fehler bei der Bundle-Übernahme.");
    }
  }

  const api = {
    init: function(containerId) {
      loadClosetState();
      renderClosetView(containerId);
    },
    render: function() {
      loadClosetState();
      renderClosetView();
    },
    open: function() {
      loadClosetState();
      renderClosetView();
      const modal = document.getElementById('hub-toys-modal');
      if (modal) modal.style.display = 'flex';
    },
    setCategoryFilter: function(catId) {
      closetState.activeCategoryFilter = catId;
      renderClosetView();
    },
    openToyInspector: openToyInspector,
    closeToyInspector: closeToyInspector,
    setInspectorTab: setInspectorTab,
    triggerPhotoCapture: triggerPhotoCapture,
    setRating: setRating,
    saveCoupleAppeal: saveCoupleAppeal,
    generateAiWisdom: generateAiWisdom,
    adjustQuantity: adjustQuantity,
    setAssignment: setAssignment,
    confirmDeleteToy: confirmDeleteToy,
    executeDeleteToy: executeDeleteToy,
    openAddCustomModal: openAddCustomModal,
    saveCustomToy: saveCustomToy,
    openBundleWizard: openBundleWizard,
    closeBundleWizard: closeBundleWizard,
    setWizardCategory: setWizardCategory,
    setWizardToy: setWizardToy,
    nextWizardStep: nextWizardStep,
    prevWizardStep: prevWizardStep,
    suggestBundleTitle: suggestBundleTitle,
    saveWizardBundle: saveWizardBundle,
    deleteBundle: deleteBundle,
    synthesizeFullAiBundle: synthesizeFullAiBundle,
    applyBundleToStaging: applyBundleToStaging,
    getAllOwned: () => {
      loadClosetState();
      const all = getAllCatalogToys();
      return all.filter(t => closetState.ownedIds.includes(t.id));
    }
  };

  window.HubToys = api;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      api.init();
    });
  } else {
    api.init();
  }

})(window);
