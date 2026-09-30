/**
 * data/chastity_database.js
 * TACTUS Keuschheits-, Spannungs- & Berufsdatenbank
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien:
 * - 4 Phasen der psychologischen Erregungs- und Hormondynamik (Entry, Climbing, Deep Subspace, Permanent)
 * - 5 differenzierte Alltags- und Berufsprofile des Bottoms (Büro, Handwerk, Pflege, Außendienst, Schichtdienst)
 * - Strukturierter Katalog erprobter Teasing-Methoden gegen Gewöhnung und Frustration
 * - Hardware-Profile führender Keuschheitssysteme (Nylon, Bioresin, Edelstahl, Silikon)
 * - 100 % frei von trivialen Emojis in Datenfeldern
 * - Sprache: Authentische Szene-Terminologie ohne Schwulst und Kitsch
 */

(function(window) {
  'use strict';

  const tensionPhases = {
    phase_entry: {
      id: "phase_entry",
      minDays: 1,
      maxDays: 3,
      title: "Phase 1: Gewöhnung & Antizipation",
      subtitle: "Die ersten 72 Stunden im Verschluss",
      desc: "Das Nervensystem registriert die ständige physische Begrenzung. Ungewohnter Druck bei unwillkürlichen Schwellkörper-Regungen.",
      hormonalState: "Hohe basale Dopamin-Ausschüttung durch die Neuheit der Situation. Noch kein physiologischer Testosteron-Rückstau.",
      focus: "Prüfung auf Druckstellen am Basisring. Etablierung des morgendlichen Spülrituals und kurze visuelle Kontrollen.",
      recommendedActions: [
        "Kontrolle des Basisrings auf Druckstellen nach den ersten 24 Stunden.",
        "Kurzer Blickkontakt vor dem Verlassen der Wohnung zur Bestätigung der Führung.",
        "Feste Einhaltung des täglichen urologischen Spülprotokolls mit Kochsalz."
      ]
    },
    phase_climbing: {
      id: "phase_climbing",
      minDays: 4,
      maxDays: 7,
      title: "Phase 2: Erregungsanstieg & Nervosität",
      subtitle: "Tag 4 bis Tag 7 (Kritische Schwelle)",
      desc: "Der gewohnte Entladungsrhythmus ist unterbrochen. Die Gedanken kreisen verstärkt um das Schloss; Reizbarkeit oder körperliche Unruhe können auftreten.",
      hormonalState: "Peak des freien Testosteronspiegels um Tag 7. Hohe Sensibilität aller Nervenbahnen im Beckenboden.",
      focus: "Auffangen von Frustration durch gezielte Berührungsanker. Kurze Schwellen-Quälerei oder feste Aufgaben zur Entlastung des Tops.",
      recommendedActions: [
        "Kurze akustische oder visuelle Reize setzen, um die Spannung positiv zu kanalisieren.",
        "Übernahme von Haushaltsaufgaben durch den Bottom zur Ableitung körperlicher Unruhe.",
        "Ausgiebige Cunnilingus-Bedienung des Tops ohne Freigabe des Bottoms."
      ]
    },
    phase_deep_subspace: {
      id: "phase_deep_subspace",
      minDays: 8,
      maxDays: 21,
      title: "Phase 3: Tiefe Unterordnung & Fokus",
      subtitle: "Woche 2 bis Woche 3",
      desc: "Die akute körperliche Nervosität weicht einer anhaltenden mentalen Ruhe. Der Bottom nimmt die Schlüsselgewalt als feste Realität an.",
      hormonalState: "Stabilisierung der Androgenrezeptoren. Gesteigerte Aufmerksamkeit für Gestik, Stimme und Wünsche des Tops.",
      focus: "Vertiefung der Alltags-Hierarchie. Etablierung fester Pflichten, Massagedienste und Belohnung durch emotionale Nähe.",
      recommendedActions: [
        "Verbindung von Keuschheit mit sensorischem Entzug oder Zucht mit dem Lederflogger.",
        "Erhöhung der Orgasmus-Ratio zugunsten des Tops.",
        "Tease & Relock Sessions: Schwellenreizung mit anschließender sicherer Wiederverriegelung."
      ]
    },
    phase_permanent: {
      id: "phase_permanent",
      minDays: 22,
      maxDays: 999,
      title: "Phase 4: Kontinuierliche Hingabe (Zenit)",
      subtitle: "Ab Tag 22 (Langzeit-Keuschheit)",
      desc: "Vollständige Entkopplung der partnerschaftlichen Bindung vom Samenerguss. Das Schloss wird als natürlicher Körperbestandteil erlebt.",
      hormonalState: "Verlagerung der Libido auf ganzkörperliche sensorische Reize und das Wohlbefinden des führenden Partners.",
      focus: "Wachsamer Gewebeschutz, sorgfältige Intimhygiene und Auskosten tiefer emotionaler Resonanz.",
      recommendedActions: [
        "Monatliche gründliche Inspektion von Haut, Dammnähten und Verschlussmechanik.",
        "Gelegentliche Freigaben primär über Prostata-Stimulation oder als Ruined Orgasm.",
        "Reflexionsgespräch auf Augenhöhe zur Überprüfung des seelischen Wohlbefindens."
      ]
    }
  };

  const workplaces = {
    desk_office: {
      id: "desk_office",
      label: "Büro / Homeoffice",
      shortDesc: "Langes Sitzen am Schreibtisch, Bildschirmarbeit, Meetings",
      cageRisks: "Dauerdruck auf Schambein und Hodenansatz durch den Stuhlrand. Wärmestau bei engen Hosen.",
      recommendedHardware: ["toy_chastity_cobra", "toy_chastity_cherrykeeper", "toy_chastity_nun_cage"],
      teasingOpportunities: [
        "Diskreter Foto-Appell aus der Büro-Toilette zur Mittagszeit.",
        "Befehl für 20 Beckenboden-Kontraktionen (Kegel) während einer Videokonferenz.",
        "Kurze Textnachricht mit Erwähnung des Schlüssels in der Handtasche des Tops."
      ]
    },
    craft_physical: {
      id: "craft_physical",
      label: "Handwerk & Körperliche Arbeit",
      shortDesc: "Bücken, Heben, Treppensteigen, Montage, Baustelle",
      cageRisks: "Reibung durch raue Arbeitskleidung, Schweißbildung, Stoßgefahr am Zylinder bei schwerem Heben.",
      recommendedHardware: ["toy_chastity_cobra", "toy_chastity_viper"],
      teasingOpportunities: [
        "Morgendliche Prüfung des festen Sitzes vor dem Anziehen der Arbeitskleidung.",
        "Pflicht zur sofortigen gründlichen Reinigung und Spülung direkt nach Feierabend.",
        "Erinnerung an das Schloss bei körperlicher Erschöpfung am Nachmittag."
      ]
    },
    medical_service: {
      id: "medical_service",
      label: "Pflege, Medizin & Gastronomie",
      shortDesc: "8 bis 12 Stunden Stehen und Gehen, Schutzkleidung, Hektik",
      cageRisks: "Reibung an den Innenschenkeln bei langen Fußwegen. Verzögerte Toilettengänge belasten die Blase.",
      recommendedHardware: ["toy_chastity_cherrykeeper", "toy_chastity_cobra"],
      teasingOpportunities: [
        "Morgendlicher Kniestand-Appell als Ruhepol vor einer anstrengenden Schicht.",
        "Verbot von Erleichterung ohne vorherige Freigabe-Notiz an den Top.",
        "Fuß- und Wadenmassage für den Top nach Rückkehr aus der Schicht."
      ]
    },
    driver_field: {
      id: "driver_field",
      label: "Fahrer, Außendienst & Pendler",
      shortDesc: "Stundenlanges Verharren im Autositz, Vibrationen, Kundenkontakt",
      cageRisks: "Konstanter Druck durch den Sicherheitsgurt auf das Becken. Eingeschränkte Bewegung.",
      recommendedHardware: ["toy_chastity_cherrykeeper", "toy_chastity_nun_cage"],
      teasingOpportunities: [
        "Befehl zum bewussten Spüren der Käfigberührung an jeder roten Ampel.",
        "Kurze Sprachnachricht des Tops vor Fahrtantritt mit klaren Verhaltensregeln.",
        "Meldepflicht nach Ankunft am jeweiligen Zielort mit Bestätigung des Verschlusses."
      ]
    },
    shift_variable: {
      id: "shift_variable",
      label: "Schichtdienst & Unregelmäßige Arbeitszeiten",
      shortDesc: "Wechselnde Tag- und Nachtschichten, verschobener Biorhythmus",
      cageRisks: "Unregelmäßige Pflegezeiten, Schlafmangel verstärkt Nervosität und Reizbarkeit.",
      recommendedHardware: ["toy_chastity_cobra", "toy_chastity_holytrainer"],
      teasingOpportunities: [
        "Feste Verankerung des Spülprotokolls unabhängig von der Tageszeit vor dem Schlafen.",
        "Begrüßungsritual beim Zusammentreffen beider Partner im Flur.",
        "Diskrete Notiz des Tops auf dem Nachttisch für das Erwachen des Bottoms."
      ]
    }
  };

  const teasingMethods = [
    {
      id: "tease_audio_key_rattle",
      category: "acoustic",
      title: "Schlüsselklimpern als Konditionierungsanker",
      desc: "Das helle, metallische Klirren des Vorhängeschloss-Schlüssels im Raum oder als 3-sekündige Sprachnachricht.",
      effect: "Löst sofortigen Dopaminschub und vegetative Schwellkörper-Reaktion gegen das feste Gitter aus."
    },
    {
      id: "tease_visual_panties",
      category: "visual",
      title: "Visuelle Präsenz der Spitzenwäsche",
      desc: "Der Top trägt aufreizende Garderobe im privaten Raum, verbietet jedoch jede Berührung oder Annäherung.",
      effect: "Erhöht den visuellen Triebdruck bei gleichzeitig unerbittlicher Handlungsbegrenzung."
    },
    {
      id: "tease_tactile_wand_cage",
      category: "tactile",
      title: "Vibration auf das Käfiggitter",
      desc: "Aufsetzen eines leistungsstarken Vibrators direkt auf den Zylinder oder den Basisring für 60 bis 90 Sekunden.",
      effect: "Erzeugt intensive Tiefenvibration im Schwellkörper ohne Möglichkeit zur Dehnung oder Ausbreitung."
    },
    {
      id: "tease_tactile_edge_relock",
      category: "tactile",
      title: "Tease & Relock (Schwellen-Quälerei)",
      desc: "Kurzzeitiges Abnehmen des Käfigs; Heranführen an das Plateau der Erregung; kalter Stopp vor der Ejakulation und sofortiges Wiederverriegeln.",
      effect: "Maximiert die Schwellensensibilität und brennt das Bewusstsein der Führung tief in das Nervensystem ein."
    },
    {
      id: "tease_mental_task_command",
      category: "mental",
      title: "Dienstauftrag bei steigender Erregung",
      desc: "Zuweisung einer anspruchsvollen oder körperlichen Aufgabe (z. B. Küche tiefenreinigen, Schuhe polieren) exakt im Moment starker Lust.",
      effect: "Wandelt angestaute sexuelle Frustration in produktiven Dienst zur Entlastung des führenden Partners um."
    },
    {
      id: "tease_somatosensory_ice",
      category: "sensory",
      title: "Kälteschock auf den Hodenansatz",
      desc: "Gezieltes Streichen mit einem Eiswürfel über Damm, Hoden und Beckenknochen bei verriegeltem Gitter.",
      effect: "Reflektorische Muskelanspannung des Musculus cremaster; verstärkt das Füllegefühl im Käfig."
    }
  ];

  const hardwareProfiles = {
    penis_cobra: {
      id: "penis_cobra",
      name: "Kink3D Cobra (SLS-Nylon)",
      material: "Polyamid 12 (PA12 SLS-Laser-Sinterung)",
      ventilation: "Exzellent (offenes Wabenmuster)",
      weightGrams: 28,
      hygieneRating: "Sehr hoch",
      suitability: "24/7 Langzeittragen, Sport, Beruf mit viel Bewegung",
      cleaningProtocol: "Spülung mit lauwarmem Wasser und milder Seife; alkoholfreie Desinfektion."
    },
    penis_viper: {
      id: "penis_viper",
      name: "Kink3D Viper (Kompakt)",
      material: "Polyamid 12 (PA12)",
      ventilation: "Sehr gut",
      weightGrams: 24,
      hygieneRating: "Sehr hoch",
      suitability: "Sportliche Träger, kompakte Anatomie, minimaler Überstand",
      cleaningProtocol: "Tägliche Spülung mit stumpfer Spritze."
    },
    penis_cherrykeeper: {
      id: "penis_cherrykeeper",
      name: "Cherrykeeper Micro Stub (<= 35mm)",
      material: "3D-Druck Resin / SLS-Nylon",
      ventilation: "Gut",
      weightGrams: 22,
      hygieneRating: "Hoch",
      suitability: "Maximale Schaftkompression, Erektionsvermeidung, Grower-Anatomie",
      cleaningProtocol: "Besonders sorgfältige Spülung der Eichelkammer wegen geringem Spaltmaß."
    },
    penis_holytrainer: {
      id: "penis_holytrainer",
      name: "HolyTrainer V6 (Bioresin)",
      material: "Medizinisches Bioresin",
      ventilation: "Gut",
      weightGrams: 35,
      hygieneRating: "Hoch",
      suitability: "Anschmiegsames Tragegefühl bei Körperwärme, elegante Ästhetik",
      cleaningProtocol: "Kein kochendes Wasser verwenden; handwarm reinigen."
    },
    penis_jailbird: {
      id: "penis_jailbird",
      name: "Mature Metal Jailbird (Edelstahl)",
      material: "Chirurgischer Edelstahl 316L",
      ventilation: "Maximal (Gitterstangen)",
      weightGrams: 195,
      hygieneRating: "Maximal",
      suitability: "Liebhaber von spürbarem Gewicht, absolute Formstabilität",
      cleaningProtocol: "Vollständig sterilisierbar und desinfektionsmittelbeständig."
    },
    penis_flat: {
      id: "penis_flat",
      name: "Flat Shield (Flachkäfig / Nun-Cage)",
      material: "Polycarbonat oder Nylon",
      ventilation: "Mittel",
      weightGrams: 30,
      hygieneRating: "Mittel",
      suitability: "Flache Silhouette unter Kleidung, zeitlich begrenzte Disziplin",
      cleaningProtocol: "Regelmäßige Druckstellenkontrolle am Dammansatz zwingend erforderlich."
    },
    female_belt: {
      id: "female_belt",
      name: "Weiblicher Keuschheitsgürtel (Shield)",
      material: "Edelstahl mit Silikon-Kantenschutz",
      ventilation: "Anatomisch belüftet",
      weightGrams: 380,
      hygieneRating: "Hoch",
      suitability: "Verhinderung klitoraler Selbststimulation, rituelle Führung",
      cleaningProtocol: "Silikoneinfassungen täglich abnehmen, säubern und trocknen."
    }
  };

  const ChastityDatabase = {
    tensionPhases: tensionPhases,
    workplaces: workplaces,
    teasingMethods: teasingMethods,
    hardwareProfiles: hardwareProfiles,

    /**
     * Ermittelt die aktuelle Spannungsphase anhand der Tragedauer in Tagen.
     * @param {number|string} days
     * @returns {Object}
     */
    getPhaseByDays: function(days) {
      const d = Math.max(1, parseInt(days, 10) || 1);
      if (d >= 22) return tensionPhases.phase_permanent;
      if (d >= 8) return tensionPhases.phase_deep_subspace;
      if (d >= 4) return tensionPhases.phase_climbing;
      return tensionPhases.phase_entry;
    },

    /**
     * Liefert Teasing-Empfehlungen gefiltert nach Kategorie oder Phase.
     * @param {string} [category]
     * @returns {Array}
     */
    getTeasingMethods: function(category) {
      if (!category || category === 'all') {
        return teasingMethods;
      }
      return teasingMethods.filter(function(m) {
        return m.category === category;
      });
    },

    /**
     * Liefert das Profil eines Arbeitsplatzes.
     * @param {string} workplaceId
     * @returns {Object|null}
     */
    getWorkplaceProfile: function(workplaceId) {
      return workplaces[workplaceId] || workplaces.desk_office;
    }
  };

  window.ChastityDatabase = ChastityDatabase;

})(window);
