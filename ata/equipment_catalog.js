/**
 * data/equipment_catalog.js
 * PACTUM Ausrüstungs-, Toy- und Hardware-Katalog (Release 3.0 Core)
 * 
 * Standards & Garantien:
 * - Strukturierte Kategorisierung: Bondage, Impact, Sensory, CBT, Anal, Hygiene/Care, Clothing, Chastity
 * - Eindeutige, unveränderliche IDs für Inventar-Matching und Staging
 * - Anatomische Zuordnung: 'universal', 'penis_only', 'vulva_only'
 * - Sicherheits- und Pflegehinweise für jedes Item (RACK-Standard)
 * - 100 % frei von trivialen Emojis in Datenfeldern
 */

(function(window) {
  'use strict';

  const equipmentCatalog = [
    // --- KATEGORIE: BONDAGE & FIXIERUNG ---
    {
      id: "toy_jute_rope_6mm",
      name: "Shibari Juteseil (6mm geölt)",
      category: "bondage",
      compatibility: "universal",
      desc: "Naturfaserseil mit optimalem Grip für Takate Kote, Brustgeschirre und Schenkelspreizung.",
      careNote: "Regelmäßig mit Kamelien- oder Jojobaöl pflegen; trocken lagern."
    },
    {
      id: "toy_cotton_rope",
      name: "Weiche Baumwollseile",
      category: "bondage",
      compatibility: "universal",
      desc: "Hautschonendes, glattes Seil für schnelle Fixierungen und empfindliche Hautzonen.",
      careNote: "Im Wäschenetz im Schonwaschgang waschbar."
    },
    {
      id: "toy_leather_cuffs_wrists",
      name: "Gepolsterte Leder-Handgelenksmanschetten",
      category: "bondage",
      compatibility: "universal",
      desc: "Breite Lederfesseln mit weichem Lammfell- oder Neoprenfutter und D-Ringen zur Arretierung.",
      careNote: "Lederbalsam zur Geschmeidigkeit nutzen; Feuchtigkeit vermeiden."
    },
    {
      id: "toy_leather_cuffs_ankles",
      name: "Gepolsterte Leder-Fußgelenksmanschetten",
      category: "bondage",
      compatibility: "universal",
      desc: "Stabile Fußfesseln für Bettpfosten-Fixierung oder Verbindung mit Spreizstange.",
      careNote: "Schnallen regelmäßig auf Gängigkeit prüfen."
    },
    {
      id: "toy_spreader_bar",
      name: "Verstellbare Spreizstange (Spreader Bar)",
      category: "bondage",
      compatibility: "universal",
      desc: "Metall- oder Carbonstange zur festen Arretierung der Beine in gespreizter Haltung.",
      careNote: "Gelenke und Karabiner regelmäßig säubern und ölen."
    },
    {
      id: "toy_emt_shears",
      name: "EMT-Sicherheits-Verbandschere",
      category: "bondage",
      compatibility: "universal",
      desc: "Abgerundete Notfallschere zum blitzschnellen Durchtrennen von Seilen ohne Hautverletzung.",
      careNote: "Muss bei jeder Fesselsession immer in Griffweite des Tops liegen!"
    },

    // --- KATEGORIE: IMPACT & SCHLAGWERKZEUGE ---
    {
      id: "toy_leather_flogger_heavy",
      name: "Schwerer Rindleder-Flogger",
      category: "impact",
      compatibility: "universal",
      desc: "Breite, schwere Fransen für dumpfe, wohlige Hitzewellen auf Rücken, Schenkel und Gesäß.",
      careNote: "Fransen nach Gebrauch lüften und auskämmen."
    },
    {
      id: "toy_leather_paddle_wide",
      name: "Breites Sattelleder-Paddle",
      category: "impact",
      compatibility: "universal",
      desc: "Satter, flächiger Schmerzreiz mit hoher Durchblutungswirkung bei geringem Hämatomrisiko.",
      careNote: "Trocken abwischen; nicht nass reinigen."
    },
    {
      id: "toy_leather_belt",
      name: "Klassischer Ledergürtel",
      category: "impact",
      compatibility: "universal",
      desc: "Einfach oder doppelt gelegt nutzbar; erzeugt charakteristischen Klang und scharfe Reizimpulse.",
      careNote: "Metallschließe vor dem Schlag immer fest in der Hand sichern!"
    },
    {
      id: "toy_riding_crop",
      name: "Schlanke Reitgerte (Crop)",
      category: "impact",
      compatibility: "universal",
      desc: "Punktgenauer, stechender Reiz für Schenkelinnenseiten, Waden oder Gesäßfalte.",
      careNote: "Spitze (Klatsche) regelmäßig auf Ausfransung kontrollieren."
    },
    {
      id: "toy_wooden_paddle",
      name: "Hartholz-Paddle",
      category: "impact",
      compatibility: "universal",
      desc: "Tiefenwirksamer Schmerzreiz für fortgeschrittene Zuchtakte ohne elastische Nachgiebigkeit.",
      careNote: "Nur auf fleischigen Partien (Gesäß) verwenden; Knochen strikt meiden!"
    },

    // --- KATEGORIE: SENSORIK, TEMPERATUR & ENTZUG ---
    {
      id: "toy_blindfold_silk",
      name: "Lichtdichte Seiden-Augenbinde",
      category: "sensory",
      compatibility: "universal",
      desc: "Vollständiger Sichtentzug mit weichem Sitz ohne Druck auf die Augäpfel.",
      careNote: "Handwäsche mit Seidenwaschmittel."
    },
    {
      id: "toy_sensory_wheel",
      name: "Wartenberg-Nadelrad",
      category: "sensory",
      compatibility: "universal",
      desc: "Medizinisches Sensorik-Rädchen für metallisches, scharfes Prickeln über Nervenbahnen.",
      careNote: "Vor und nach jedem Einsatz mit Isopropanol desinfizieren."
    },
    {
      id: "toy_bdsm_wax_candle",
      name: "Niedrigtemperatur-Tropfwachs (Sojabasis)",
      category: "sensory",
      compatibility: "universal",
      desc: "Schmilzt bei hautfreundlichen 48 bis 52 °C für sinnliche Heißreize ohne Brandblasen.",
      careNote: "Niemals gewöhnliche Paraffin-Haushaltskerzen verwenden (Verbrennungsgefahr)!"
    },
    {
      id: "toy_feather_tickler",
      name: "Pfauenfeder & Zartpinsel",
      category: "sensory",
      compatibility: "universal",
      desc: "Ultrafeine Reizführung über Schwellkörper, Lippen, Nacken und Bauchhaut.",
      careNote: "Staubgeschützt aufbewahren."
    },
    {
      id: "toy_ball_gag_silicone",
      name: "Silikon-Ballknebel mit Lederriemen",
      category: "sensory",
      compatibility: "universal",
      desc: "Ergonomischer Mundknebel mit belüftetem Kern; verhindert deutliche Sprache.",
      careNote: "Medizinisch reinigen; Riemenspannung darf Kiefergelenk nicht überdehnen."
    },

    // --- KATEGORIE: KEUSCHHEIT & SCHLÖSSER ---
    {
      id: "toy_chastity_cobra",
      name: "Kink3D Cobra (SLS-Nylon)",
      category: "chastity",
      compatibility: "penis_only",
      desc: "Atmungsaktiver PA12-Käfig mit Dual-Arc-Ring; ultraleicht und für Dauertragen erprobt.",
      careNote: "Tägliche Mikro-Spülung mit Kochsalz oder warmem Wasser durchführen."
    },
    {
      id: "toy_chastity_viper",
      name: "Kink3D Viper (Kompakt)",
      category: "chastity",
      compatibility: "penis_only",
      desc: "Kompakter Käfig für sportliche Träger mit minimalem Eichelüberstand.",
      careNote: "Druckstellen am Dammansatz täglich kontrollieren."
    },
    {
      id: "toy_chastity_cherrykeeper",
      name: "Cherrykeeper Micro Stub (<= 35mm)",
      category: "chastity",
      compatibility: "penis_only",
      desc: "Modulares Klemmsystem mit maximaler Schaftkompression zur sicheren Erektionsvermeidung.",
      careNote: "Passenden Ringdurchmesser wählen; kein Einklemmen von Skrotumhaut."
    },
    {
      id: "toy_chastity_holytrainer",
      name: "HolyTrainer V6 (Bioresin)",
      category: "chastity",
      compatibility: "penis_only",
      desc: "Passt sich bei 36 °C Körperwärme seidig der Anatomie an; integrierter Bolzenverschluss.",
      careNote: "Nicht kochend reinigen; mildes Spülmittel und handwarmes Wasser nutzen."
    },
    {
      id: "toy_chastity_jailbird",
      name: "Mature Metal Jailbird (Edelstahl)",
      category: "chastity",
      compatibility: "penis_only",
      desc: "Schwere Metallgitter-Konstruktion für kompromisslose Festigkeit und Hygiene.",
      careNote: "Regelmäßig auf Metallabrieb oder scharfe Kanten an Schraubgewinden prüfen."
    },
    {
      id: "toy_chastity_nun_cage",
      name: "Flat Shield (Flachkäfig / Nun-Cage)",
      category: "chastity",
      compatibility: "penis_only",
      desc: "Zylinderloser Flachschild, der das Glied eng an den Körper drückt; 0 mm Silhouette.",
      careNote: "Nur für begrenzte Tragezeiten nutzen; Hodenkompression beachten."
    },
    {
      id: "toy_chastity_belt_female",
      name: "Weiblicher Keuschheitsgürtel (Shield)",
      category: "chastity",
      compatibility: "vulva_only",
      desc: "Ergonomisch geformter Schildverschluss zur Verhinderung klitoraler Selbststimulation.",
      careNote: "Silikoneinfassungen täglich auf Hygiene und Hautirritation prüfen."
    },
    {
      id: "toy_chastity_seals_numbered",
      name: "Nummerierte Sicherheits-Einwegplomben",
      category: "chastity",
      compatibility: "universal",
      desc: "Manipulationssichere Kunststoffplomben mit fortlaufender Seriennummer zur Kontrolle.",
      careNote: "Vor dem Durchtrennen Seriennummer im Protokoll abgleichen."
    },

    // --- KATEGORIE: CBT & GENITALE REIZE ---
    {
      id: "toy_ball_stretcher_silicone",
      name: "Silikon-Hodenstretcher (Ball Stretcher)",
      category: "cbt",
      compatibility: "penis_only",
      desc: "Gewichteter Dehnring, der die Hoden sanft nach unten arretiert und Trennung erzeugt.",
      careNote: "Maximale Tragezeit 2 bis 3 Stunden; bei Kältegefühl sofort abnehmen."
    },
    {
      id: "toy_nipple_clamps_alligator",
      name: "Krokodil-Brustwarzenklammern mit Kette",
      category: "cbt",
      compatibility: "universal",
      desc: "Gummierte Klemmen mit verstellbarer Stellschraube für dosierten Druckschmerz.",
      careNote: "Druckkappen sauber halten; Tragedauer auf 20 bis 30 Minuten begrenzen."
    },
    {
      id: "toy_wand_vibrator",
      name: "Kabelgebundener Magic Wand",
      category: "cbt",
      compatibility: "universal",
      desc: "Leistungsstarke Tiefenvibration für Klitoriserregung oder Schwellenreize am Käfiggitter.",
      careNote: "Silikonkopf nach jedem Einsatz desinfizieren."
    },

    // --- KATEGORIE: ANALEROTIK & PROSTATA ---
    {
      id: "toy_anal_plug_jeweled",
      name: "Schmuck-Analplug mit Kristallbasis",
      category: "anal",
      compatibility: "universal",
      desc: "Metall- oder Silikonplug mit breiter Sicherheitsbasis für langanhaltendes Füllegefühl.",
      careNote: "Nur mit reichlich Gleitmittel auf Wasser- oder Silikonbasis verwenden!"
    },
    {
      id: "toy_prostate_massager",
      name: "Ergonomischer Prostata-Stimulator (P-Spot)",
      category: "anal",
      compatibility: "penis_only",
      desc: "Geschwungene Form zur gezielten Massage des P-Punkts für Ganzkörperorgasmen ohne Ejakulation.",
      careNote: "Gründliche Reinigung mit antibakterieller Seife und warmem Wasser."
    },
    {
      id: "toy_strap_on_harness",
      name: "Strap-On Harness mit Dildo-Adapter (Pegging)",
      category: "anal",
      compatibility: "universal",
      desc: "Verstellbares Schnallgeschirr für die führende Partnerin zur rezeptiven Penetration des Mannes.",
      careNote: "Riemen auf festen Sitz an den Hüftknochen anpassen."
    },

    // --- KATEGORIE: PFLEGE, HYGIENE & NACHSORGE ---
    {
      id: "toy_irrigation_syringe",
      name: "Urologische Spülspritze (Balanitis-Schutz)",
      category: "care",
      compatibility: "penis_only",
      desc: "Stumpfe 20ml-Spritze zur täglichen Kochsalzspülung der Eichelkammer im Käfig.",
      careNote: "Unverzichtbares medizinisches Pflegewerkzeug für jede 24/7-Keuschheit!"
    },
    {
      id: "toy_weighted_blanket",
      name: "Schwere Therapiedecke (Gewichtsdecke)",
      category: "care",
      compatibility: "universal",
      desc: "Tiefendruck-Stimulation (DTP) zur sofortigen Beruhigung des Nervensystems nach Sessions.",
      careNote: "Gleichmäßig über den ruhenden Körper legen; Vagus-Atmung unterstützen."
    },
    {
      id: "toy_massage_oil_neutral",
      name: "Naturreines Jojoba- & Mandel-Massageöl",
      category: "care",
      compatibility: "universal",
      desc: "Duftneutrales, wärmendes Gleitöl für Ganzkörper-Massagen und Vorbereitung.",
      careNote: "Nicht zusammen mit Latexprodukten verwenden!"
    },

    // --- KATEGORIE: FETISCH-GARDEROBE & ATTRIBUTEN ---
    {
      id: "toy_clothing_leather_collar",
      name: "Breites Lederkollar mit Führleine",
      category: "clothing",
      compatibility: "universal",
      desc: "Souveränes Besitz- und Führungszeichen für private Momente hinter verschlossener Tür.",
      careNote: "D-Ring auf Belastbarkeit prüfen; niemals ruckartig an der Leine reißen."
    },
    {
      id: "toy_clothing_heels",
      name: "Leder-Plateau-Stiefel / High Heels",
      category: "clothing",
      compatibility: "universal",
      desc: "Machtsymbol: Erhöhter Stand für den Top; Kuss- und Verehrungsobjekt für den Bottom.",
      careNote: "Leder und Absätze regelmäßig polieren."
    },
    {
      id: "toy_clothing_corset",
      name: "Stahlverstärktes Schnürkorsett",
      category: "clothing",
      compatibility: "universal",
      desc: "Aufrechte Körperhaltung, somatische Taillen-Kompression und ästhetische Strenge.",
      careNote: "Nur trocken lüften; Schnürbänder bei Verschleiß erneuern."
    },
    {
      id: "toy_clothing_lingerie_sissy",
      name: "Transparente Spitzenwäsche / Seidenhemdchen",
      category: "clothing",
      compatibility: "universal",
      desc: "Zurschaustellung, Schamüberwindung oder Feminisierung im privaten Raum.",
      careNote: "Feinwäsche im Schutznetz."
    }
  ];

  window.equipmentCatalog = equipmentCatalog;

})(window);
