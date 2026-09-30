/**
 * data/questions_part1.js
 * TACTUS Erotik- & Somatik-Fragebogen (Teil 1: Kapitel 00 bis 17)
 * Offizielle Präsenz: tactus.digital
 * 
 * Standards & Garantien:
 * - Chronologisch geordnet von Kapitel 00 bis Kapitel 17
 * - Prolog-Schutzkapitel 00 (Items 901–905) für psychosomatische Sicherheit, Trauma & Trigger
 * - Lückenlose Primärschlüssel-IDs 1 bis 90 für absolute Abwärtskompatibilität
 * - Hyperdynamische somatische Metadaten:
 *   • somaticZone: Präzise anatomische Primärzone für den SomaticPostureSynthesizer
 *   • equipmentTags: Kopplung an den Ausrüstungsschrank und DoF-Konfliktprüfung
 *   • anatomyGuard: Schutz vor anatomisch unpassenden Zuweisungen
 * - Asymmetrische Rollen-Differenzierung: r1 (Führen/Bestimmen) vs. r2 (Empfangen/Hingeben)
 * - 100 % frei von infantilen System-Emojis in Datenstrukturen
 * - Keine window.alert() / window.confirm() Aufrufe unter keinen Umständen
 */

(function(window) {
  'use strict';

  const chaptersPart1 = [
    {
      id: "00",
      title: "Kapitel 00: Psychosomatische Sicherheit, Trauma & Trigger",
      desc: "Schutzraum-Präambel: Frühere Belastungen, körperliche Flashback-Trigger und Sofort-Interventionen.",
      isProtectionChapter: true,
      items: [
        {
          id: 901,
          title: "Sexuelle & emotionale Vorerfahrungen",
          desc: "Ehrliche Selbsteinschätzung früherer Belastungen, Grenzüberschreitungen oder Übergriffe.",
          type: "choice",
          somaticZone: "nervous_system",
          equipmentTags: [],
          question: "Gibt es frühere belastende Erfahrungen, die dich heute noch berühren können?",
          options: [
            { val: "none", label: "Keine belastenden Vorerfahrungen vorhanden" },
            { val: "boundary", label: "Frühere unschöne Grenzüberschreitungen oder Enttäuschungen" },
            { val: "trauma", label: "Früheres sexuelles oder emotionales Trauma / Übergriff" },
            { val: "private", label: "Möchte ich vorerst für mich behalten" }
          ]
        },
        {
          id: 902,
          title: "Körperliche & seelische Flashback-Trigger",
          desc: "Spezifische Sinnesreize, die Panik, Erstarrung oder Abwehr auslösen können.",
          type: "choice",
          somaticZone: "nervous_system",
          equipmentTags: [],
          question: "Welche Reize erfordern absolute Vorsicht oder sind strikt zu vermeiden?",
          options: [
            { val: "words", label: "Bestimmte Schimpfwörter oder verbale Erniedrigung" },
            { val: "smell", label: "Bestimmte Gerüche, Düfte oder Parfüms" },
            { val: "airway", label: "Enge, Ersticken oder Mund-/Nasenbedeckung" },
            { val: "restraint", label: "Vollständige Fixierung ohne Bewegungsmöglichkeit" },
            { val: "darkness", label: "Plötzliche, unangekündigte Dunkelheit" },
            { val: "none", label: "Keine bekannten Flashback-Trigger" }
          ]
        },
        {
          id: 903,
          title: "Reaktion bei Überforderung / Dissoziation",
          desc: "Wie dein vegetatives Nervensystem reagiert, wenn eine Situation kippt.",
          type: "choice",
          somaticZone: "nervous_system",
          equipmentTags: [],
          question: "Wie äußert sich bei dir ein Zustand akuter emotionaler Überforderung?",
          options: [
            { val: "freeze", label: "Erstarren / Einfrieren (körperlich bewegungslos, innerlich abwesend)" },
            { val: "tears", label: "Weinkrämpfe / Tränenstrom ohne Schmerzursache" },
            { val: "flight", label: "Fluchtreflex / Drang, den Raum sofort zu verlassen" },
            { val: "panic", label: "Panik / Herzrasen / flache Atemnot" },
            { val: "silence", label: "Verstummen / Völlige Unfähigkeit zu sprechen" }
          ]
        },
        {
          id: 904,
          title: "Gewünschte Intervention des Partners bei Trigger",
          desc: "Welche konkrete Soforthandlung des Partners dir verlässlich hilft wieder zu landen.",
          type: "choice",
          somaticZone: "nervous_system",
          equipmentTags: ["weighted_blanket"],
          question: "Was soll dein Partner unverzüglich tun, wenn du getriggert wirst?",
          options: [
            { val: "hug", label: "Feste, stumme Umarmung & Halten (Gewichtsdecken-Effekt)" },
            { val: "distance", label: "Körperliche Berührung sofort einstellen & etwas Raum geben" },
            { val: "grounding", label: "Licht anmachen, zudecken & ruhige Vagus-Atmung anleiten" },
            { val: "water_tea", label: "Schluck warmen Tee oder Wasser reichen, ohne zu fragen" },
            { val: "voice", label: "Mit leiser, ruhiger Stimme reden und Sicherheit zusprechen" }
          ]
        },
        {
          id: 905,
          title: "Umgang mit Scham & Schutzraum",
          desc: "Vereinbarter Verhaltenskodex bei verletzlichen, schambesetzten Wünschen.",
          type: "choice",
          somaticZone: "nervous_system",
          equipmentTags: [],
          question: "Welchen Rahmen benötigst du bei verletzlichen Fantasien (Schutzanker)?",
          options: [
            { val: "strict_ban", label: "Absolutes Alltags-Spottverbot (niemals im Streit oder Alltag erwähnen)" },
            { val: "gentle_pace", label: "Behutsames Herantasten im Halbdunkel ohne Erfolgsdruck" },
            { val: "affirmation", label: "Ausdrückliche verbale Bestätigung durch den Partner ('Du bist sicher')" },
            { val: "patience", label: "Zeit lassen: Erst nach mehrmaligem Reden vorsichtig ausprobieren" }
          ]
        }
      ]
    },

    {
      id: 0,
      title: "Kapitel 0: Anatomie & Körperliche Grundlagen",
      desc: "Grundlegende Ausrichtung, anatomische Passung und körperliche Zonen.",
      items: [
        { id: 1, title: "Anatomische Orientierung", desc: "Offenheit für das Zusammenspiel der jeweiligen körperlichen Voraussetzungen.", type: "scale", somaticZone: "full_body", equipmentTags: [] },
        { id: 2, title: "Berührungen der erogenen Zonen", desc: "Sensible Streichungen und Erkundung sensibler Hautpartien.", type: "scale", somaticZone: "full_body", equipmentTags: [] },
        { id: 3, title: "Brust- & Brustwarzen-Stimulation", desc: "Sanftes bis intensives Einbeziehen der Brustwarzen durch Hände, Mund oder Zupfen.", type: "scale", somaticZone: "chest_nipples", equipmentTags: ["clamps"] },
        { id: 4, title: "Hals-, Nacken- & Ohren-Küsse", desc: "Fokussierte Küsse und sanftes Knabbern an Nacken, Hals und Ohrläppchen.", type: "scale", somaticZone: "neck_cervical", equipmentTags: [] },
        { id: 5, title: "Massage mit warmem Öl", desc: "Ganzkörper-Entspannung mit duftenden Ölen vor der eigentlichen Intimität.", type: "scale", somaticZone: "back_flanks", equipmentTags: ["massage_oil"] }
      ]
    },

    {
      id: 1,
      title: "Kapitel 1: Romantik, Zärtlichkeit & emotionale Hingabe",
      desc: "Die gefühlvolle Basis, Augenkontakt und getragene Intimität.",
      items: [
        { id: 6, title: "Langer, ununterbrochener Augenkontakt", desc: "Tiefes gegenseitiges Fixieren während der Intimität ohne Wegsehen.", type: "scale", somaticZone: "head_eyes", equipmentTags: [] },
        { id: 7, title: "Intensives, ausgiebiges Küssen", desc: "Tiefe Zungenküsse, die im Mittelpunkt der Begegnung stehen.", type: "scale", somaticZone: "head_mouth", equipmentTags: [] },
        { id: 8, title: "Langsame, entschleunigte Vereinigung", desc: "Besonders behutsame, synchrone Bewegung mit Fokus auf Nähe.", type: "scale", somaticZone: "genital_pelvis", equipmentTags: [] },
        { id: 9, title: "Zärtliches Festhalten & Einkuscheln", desc: "Festes Umschlungenhalten während und nach dem Liebesakt.", type: "scale", somaticZone: "full_body", equipmentTags: ["weighted_blanket"] },
        { id: 10, title: "Liebeserklärungen während der Ekstase", desc: "Worte tiefer Zuneigung und Verbundenheit im Moment höchster Erregung.", type: "scale", somaticZone: "head_ears", equipmentTags: [] }
      ]
    },

    {
      id: 2,
      title: "Kapitel 2: Vorspiel, Küsse & taktile Schwellen",
      desc: "Die Kunst des Heranführens, Hinauszögerns und Reizens.",
      items: [
        { id: 11, title: "Ausgedehntes Vorspiel (> 30 Minuten)", desc: "Langes Hinauszögern des eigentlichen Akts zur Steigerung der Vorfreude.", type: "scale", somaticZone: "full_body", equipmentTags: [] },
        { id: 12, title: "Berührungsverbot für den Partner", desc: "Einer darf nur daliegen und genießen, ohne selbst die Hände zu benutzen.", type: "scale", somaticZone: "limbs_wrists_hands", equipmentTags: ["cuffs"] },
        { id: 13, title: "Feder- & Seidentuch-Streichungen", desc: "Ultra-sanfte Reize über die gesamte Körperoberfläche.", type: "scale", somaticZone: "cutaneous_skin", equipmentTags: ["silk_scarf", "feather"] },
        { id: 14, title: "Sanftes Beißen & Saugen (Lovebites)", desc: "Leichte Zahnabdrücke an Hals, Schultern oder Oberschenkeln.", type: "scale", somaticZone: "neck_cervical", equipmentTags: [] },
        { id: 15, title: "Flüstern intimer Kosenamen", desc: "Geheime Worte leise ins Ohr geraunt.", type: "scale", somaticZone: "head_ears", equipmentTags: [] }
      ]
    },

    {
      id: 3,
      title: "Kapitel 3: Orale Hingabe & Cunnilingus / Fellatio",
      desc: "Mundwerk, Hingabe und orale Kunstgriffe.",
      items: [
        { id: 16, title: "Ausgiebiger Cunnilingus (Lecken der Vulva)", desc: "Fokussiertes und langes Verwöhnen der Klitoris und Schamlippen mit der Zunge.", type: "scale", somaticZone: "genital_vulva_clitoris", equipmentTags: [], anatomyGuard: "vulva" },
        { id: 17, title: "Fellatio (Blasen des Penis)", desc: "Ausdauerndes Verwöhnen des Schafts und der Eichel mit Mund und Lippen.", type: "scale", somaticZone: "genital_penis", equipmentTags: [], anatomyGuard: "penis" },
        { id: 18, title: "Deepthroating / Tiefe orale Aufnahme", desc: "Weites Aufnehmen des Penis bis in den Rachen.", type: "scale", somaticZone: "head_mouth", equipmentTags: [], anatomyGuard: "penis" },
        { id: 19, title: "Orgasmus im Mund / Schlucken", desc: "Höhepunkt direkt in den Mund des Partners mit Erlaubnis/Wunsch zu schlucken.", type: "scale", somaticZone: "head_mouth", equipmentTags: [] },
        { id: 20, title: "Orale Bedienung auf Knien", desc: "Oralservice geleistet im Kniestand vor dem sitzenden oder stehenden Partner.", type: "scale", somaticZone: "head_mouth", equipmentTags: [] }
      ]
    },

    {
      id: 4,
      title: "Kapitel 4: Stellungen & anatomische Dynamiken",
      desc: "Positionen, Rhythmus, Winkel und Ausdauer.",
      items: [
        { id: 21, title: "Reiterstellung / Weibliche Führung oben", desc: "Die Partnerin bestimmt Takt, Tiefe und Winkel auf dem Partner.", type: "scale", somaticZone: "gluteal_pelvis", equipmentTags: [] },
        { id: 22, title: "Doggy-Style / Von hinten genommen werden", desc: "Instinktive, tiefe Vereinigung von hinten auf allen Vieren.", type: "scale", somaticZone: "gluteal_pelvis", equipmentTags: [] },
        { id: 23, title: "Stehend an der Wand / Aufgehoben", desc: "Kraftvoller Vollzug im Stehen mit Anlehnen an Wand oder Möbel.", type: "scale", somaticZone: "full_body", equipmentTags: [] },
        { id: 24, title: "Lotus-Sitz / Eng umschlungen im Sitzen", desc: "Sitzen auf dem Schoß des Partners mit maximalem Hautkontakt.", type: "scale", somaticZone: "full_body", equipmentTags: [] },
        { id: 25, title: "Beine auf den Schultern des Partners", desc: "Weite Dehnung und tiefer Eintritt durch Hochlegen der Beine.", type: "scale", somaticZone: "limbs_ankles_feet", equipmentTags: [] }
      ]
    },

    {
      id: 5,
      title: "Kapitel 5: Sexuelle Frequenz & Spontaneität",
      desc: "Tageszeiten, Impulse und Überraschungsmomente.",
      items: [
        { id: 26, title: "Morgensex direkt beim Aufwachen", desc: "Noch schlaftrunken und warm vor dem ersten Kaffee.", type: "scale", somaticZone: "full_body", equipmentTags: [] },
        { id: 27, title: "Spontaner Quickie zwischendurch", desc: "Kurz, intensiv und ohne langes Ausziehen im Alltagstrubel.", type: "scale", somaticZone: "full_body", equipmentTags: [] },
        { id: 28, title: "Nächtliches Wecken durch Berührungen", desc: "Aus dem Schlaf heraus durch Küsse und Streicheln erweckt werden.", type: "scale", somaticZone: "full_body", equipmentTags: [] },
        { id: 29, title: "Lange geplante Date-Night Sessions", desc: "Verabredete Stunden mit Kerzen, Vorbereitung und ungestörter Zeit.", type: "scale", somaticZone: "full_body", equipmentTags: [] },
        { id: 30, title: "Sex an ungewöhnlichen Orten im Haus", desc: "Kücheninsel, Dusche, Sofa, Schreibtisch oder Treppe.", type: "scale", somaticZone: "full_body", equipmentTags: [] }
      ]
    },

    {
      id: 6,
      title: "Kapitel 6: Dirty Talk & Verbale Erotik",
      desc: "Worte, Befehle, Keuchen und das Brechen sprachlicher Schranken.",
      items: [
        { id: 31, title: "Beschreiben, was man gleich tun wird", desc: "Gedankliche Vorwegnahme in klaren, deutlichen Worten.", type: "scale", somaticZone: "head_ears", equipmentTags: [] },
        { id: 32, title: "Deutliche, ungeschminkte Vokabeln", desc: "Verwendung direkter, unverblümter Wörter für Körperteile und Akte.", type: "scale", somaticZone: "head_ears", equipmentTags: [] },
        { id: 33, title: "Flüstern von Fantasien im Alltag", desc: "Heimliche Andeutungen am Esstisch oder unter Freunden ins Ohr geraunt.", type: "scale", somaticZone: "head_ears", equipmentTags: [] },
        { id: 34, title: "Verbale Anweisungen & Befehle", desc: "Klare Kommandos: 'Zieh dich aus', 'Knie dich hin', 'Sieh mich an'.", type: "scale", somaticZone: "head_ears", equipmentTags: [] },
        { id: 35, title: "Stöhnen, Schluchzen und hörbares Atmen", desc: "Hemmungslose akustische Lautäußerungen während der Vereinigung.", type: "scale", somaticZone: "head_mouth", equipmentTags: [] }
      ]
    },

    {
      id: 7,
      title: "Kapitel 7: Keuschheit, Orgasmuskontrolle & Triebaufschub",
      desc: "Die Verlagerung der Macht über die Lust in die Hand des Partners.",
      items: [
        { id: 36, title: "Orgasmusverweigerung (Denial)", desc: "Heranführen an den Höhepunkt mit anschließendem kaltem Stopp.", type: "scale", somaticZone: "genital_pelvis", equipmentTags: ["chastity_cage"] },
        { id: 37, title: "Orgasmus auf Erlaubnis (Orgasm Control)", desc: "Nur dann kommen dürfen, wenn der führende Partner den Befehl erteilt.", type: "scale", somaticZone: "genital_pelvis", equipmentTags: [] },
        { id: 38, title: "Ruined Orgasm (Verdorbener Höhepunkt)", desc: "Abbruch der Stimulation exakt am Point of no Return; Muskelzucken ohne Genuss.", type: "scale", somaticZone: "genital_pelvis", equipmentTags: [] },
        { id: 39, title: "Tage- oder wochenlanger Triebaufschub", desc: "Kontrollierte Enthaltsamkeit zur Steigerung der Hingabe und Konzentration.", type: "scale", somaticZone: "genital_pelvis", equipmentTags: ["chastity_cage"] },
        { id: 40, title: "Betteln um Freigabe (Begging)", desc: "Auf den Knien um Erlaubnis zur Ejakulation bitten müssen.", type: "scale", somaticZone: "limbs_ankles_feet", equipmentTags: [] }
      ]
    },

    {
      id: 8,
      title: "Kapitel 8: Keuschheits-Hardware, Schlösser & Schrank",
      desc: "Physische Arretierung des Genitals und Schlüsselgewalt.",
      items: [
        { id: 41, title: "Tragen eines Peniskäfigs (Chastity Cage)", desc: "Physischer Verschluss aus Kunststoff, Nylon oder Edelstahl.", type: "scale", somaticZone: "genital_penis", equipmentTags: ["chastity_cage"], anatomyGuard: "penis" },
        { id: 42, title: "Schlüsselgewalt beim Partner (Keyholder)", desc: "Der Partner verwahrt den Schlüssel im Tresor, an einer Kette oder unterwegs.", type: "scale", somaticZone: "genital_penis", equipmentTags: ["ksafe", "lock"] },
        { id: 43, title: "Sicherheits-Einwegplomben mit Nummern", desc: "Versiegelung mit nummerierten Plomben zur Manipulationskontrolle.", type: "scale", somaticZone: "genital_penis", equipmentTags: ["security_seals"] },
        { id: 44, title: "Keuschheits-Hygiene & Spülprotokoll", desc: "Tägliches Reinigen des Verschlusses mit Spritze und Pflege.", type: "scale", somaticZone: "genital_penis", equipmentTags: ["irrigation_syringe"] },
        { id: 45, title: "Weiblicher Keuschheitsgürtel (Chastity Belt)", desc: "Mechanischer Schildverschluss gegen klitorale Selbststimulation.", type: "scale", somaticZone: "genital_vulva_clitoris", equipmentTags: ["chastity_belt"], anatomyGuard: "vulva" }
      ]
    },

    {
      id: 9,
      title: "Kapitel 9: BDSM-Basics: Rollen, Führung & Hierarchie",
      desc: "Das bewusste Gefälle zwischen Dominanz und Hingabe.",
      items: [
        { id: 46, title: "Feste Rollenaufteilung (Top / Bottom)", desc: "Klare Definition, wer heute leitet und wer sich vollkommen anvertraut.", type: "scale", somaticZone: "full_body", equipmentTags: [] },
        { id: 47, title: "Rollenwechsel (Switching)", desc: "Die Fähigkeit und Lust, an verschiedenen Tagen die Seiten zu tauschen.", type: "scale", somaticZone: "full_body", equipmentTags: [] },
        { id: 48, title: "Verwendung von Titeln (Herrin / Meister / Sir)", desc: "Respektvolle Anrede im privaten Schutzraum oder während Sessions.", type: "scale", somaticZone: "head_ears", equipmentTags: [] },
        { id: 49, title: "Körperliche Ehrerbietung (Kniestand / Blick senken)", desc: "Ritualisierte Haltungen als Zeichen innerer Ruhe und Unterordnung.", type: "scale", somaticZone: "limbs_ankles_feet", equipmentTags: [] },
        { id: 50, title: "Klare Grenzen & Safeword-Ampel", desc: "Unbedingte Einhaltung von Grün, Gelb und Rot ohne jede Diskussion.", type: "scale", somaticZone: "nervous_system", equipmentTags: [] }
      ]
    },

    {
      id: 10,
      title: "Kapitel 10: Fesselung, Shibari & körperliche Arretierung",
      desc: "Seile, Manschetten, Hilflosigkeit und das Loslassen der Kontrolle.",
      items: [
        { id: 51, title: "Fixierung der Handgelenke (Cuffs / Tuch)", desc: "Weiche Leder- oder Stoffmanschetten vor dem Körper oder hinter dem Rücken.", type: "scale", somaticZone: "limbs_wrists_hands", equipmentTags: ["cuffs"] },
        { id: 52, title: "Japanische Seilkunst (Shibari / Kinbaku)", desc: "Ästhetische Seilmuster aus Jute oder Hanf am Oberkörper (Takate Kote).", type: "scale", somaticZone: "chest_nipples", equipmentTags: ["rope", "emt_shears"] },
        { id: 53, title: "Fixierung am Bettpfosten / Möbelstück", desc: "Vollständige Bewegungsunfähigkeit auf dem Rücken oder Bauch.", type: "scale", somaticZone: "limbs_wrists_hands", equipmentTags: ["cuffs", "rope"] },
        { id: 54, title: "Spreizstange für die Beine", desc: "Feste Arretierung der Knöchel mit erzwungener Offenheit des Beckens.", type: "scale", somaticZone: "limbs_ankles_feet", equipmentTags: ["spreader_bar"] },
        { id: 55, title: "Aufhängung / Suspension (Teil- oder Vollschwebe)", desc: "Freies Schweben im Seil unter professioneller Gewichtsentlastung.", type: "scale", somaticZone: "full_body", equipmentTags: ["suspension_gear", "rope", "emt_shears"] }
      ]
    },

    {
      id: 11,
      title: "Kapitel 11: Spanking & Gesäßzüchtigung",
      desc: "Der rhythmische Schmerzreiz auf das Gesäß und die Endorphinausschüttung.",
      items: [
        { id: 56, title: "Spanking mit der flachen Hand", desc: "Warme, klatschende Treffer zur Durchblutung und Erdung.", type: "scale", somaticZone: "gluteal_pelvis", equipmentTags: [] },
        { id: 57, title: "Züchtigung über das Knie gelegt (OTK)", desc: "Klassische Haltung über dem Schoß des sitzenden Partners.", type: "scale", somaticZone: "gluteal_pelvis", equipmentTags: [] },
        { id: 58, title: "Mitzählen jedes einzelnen Treffers", desc: "Pflicht des Bottoms, jeden Schlag laut und deutlich mitzuzählen.", type: "scale", somaticZone: "head_mouth", equipmentTags: [] },
        { id: 59, title: "Vorbeuge über die Bettkante mit Händen flach", desc: "Strikte 90-Grad-Haltung während der Versohlung.", type: "scale", somaticZone: "gluteal_pelvis", equipmentTags: [] },
        { id: 60, title: "Beruhigendes Handauflegen nach dem Spanking", desc: "Feste, warme Handfläche auf dem erhitzten Gesäß zur Vagus-Beruhigung.", type: "scale", somaticZone: "gluteal_pelvis", equipmentTags: [] }
      ]
    },

    {
      id: 12,
      title: "Kapitel 12: Impact Play: Flogger, Paddle & schwere Werkzeuge",
      desc: "Die differenzierte Klaviatur der Schlagwerkzeuge.",
      items: [
        { id: 61, title: "Schwerer Lederflogger (Fransenpeitsche)", desc: "Dumpfe, wohlige Hitzewellen über Rücken, Schenkel und Gesäß.", type: "scale", somaticZone: "gluteal_pelvis", equipmentTags: ["flogger"] },
        { id: 62, title: "Breites Leder- oder Holz-Paddle", desc: "Satter, tiefer Schmerzreiz mit breiter Trefferfläche.", type: "scale", somaticZone: "gluteal_pelvis", equipmentTags: ["paddle"] },
        { id: 63, title: "Ledergürtel (einfach oder doppelt gelegt)", desc: "Das schwere Geräusch des Leders und gezielte, scharfe Treffer.", type: "scale", somaticZone: "gluteal_pelvis", equipmentTags: ["leather_belt"] },
        { id: 64, title: "Schlanke Reitgerte (Crop)", desc: "Punktgenauer, stechender Reiz auf Schenkelinnenseiten oder Waden.", type: "scale", somaticZone: "thighs_inner", equipmentTags: ["crop"] },
        { id: 65, title: "Rohrstock (Cane) / Intensive Zucht", desc: "Härtester Schmerzreiz mit dünnen Stöcken (nur für Fortgeschrittene).", type: "scale", somaticZone: "gluteal_pelvis", equipmentTags: ["cane"] }
      ]
    },

    {
      id: 13,
      title: "Kapitel 13: Sensorischer Entzug & Temperatur-Reize",
      desc: "Augenbinden, Wachs, Kälte und akustische Isolation.",
      items: [
        { id: 66, title: "Lichtdichte Augenbinde (Blindfold)", desc: "Vollständiger Sichtentzug; Verstärkung aller Tast- und Hörreize.", type: "scale", somaticZone: "head_eyes", equipmentTags: ["blindfold"] },
        { id: 67, title: "Tropfendes Niedrigtemperatur-Wachs", desc: "Warmes BDSM-Sojawachs auf Brust, Bauch oder Schenkel.", type: "scale", somaticZone: "chest_nipples", equipmentTags: ["bdsm_wax"] },
        { id: 68, title: "Eiswürfel-Streichungen & Kälteschock", desc: "Gezielte Streichungen mit Eis über erhitzte Hautpartien.", type: "scale", somaticZone: "cutaneous_skin", equipmentTags: ["ice"] },
        { id: 69, title: "Wartenberg-Rad (Sensorisches Nadelrad)", desc: "Metallisches Prickeln über empfindliche Nervenbahnen ohne Läsion.", type: "scale", somaticZone: "back_flanks", equipmentTags: ["wartenberg_wheel"] },
        { id: 70, title: "Kopfhörer mit weißem Rauschen / Soundscapes", desc: "Akustische Isolation zur Abschirmung von der Außenwelt.", type: "scale", somaticZone: "head_ears", equipmentTags: ["headphones"] }
      ]
    },

    {
      id: 14,
      title: "Kapitel 14: Kitzeln, Zarte Quälerei & Hilflosigkeit",
      desc: "Unwiderstehliche Reizüberflutung bei fixiertem Körper.",
      items: [
        { id: 71, title: "Gefesseltes Kitzeln (Tickling)", desc: "Kitzeln an Füßen, Rippen oder Achseln bei fixierten Gliedmaßen.", type: "scale", somaticZone: "limbs_ankles_feet", equipmentTags: ["cuffs", "feather"] },
        { id: 72, title: "Verwehren von Lachen / Strikte Beherrschung", desc: "Die Pflicht, trotz intensiven Kitzelns die Miene neutral zu halten.", type: "scale", somaticZone: "head_face", equipmentTags: [] },
        { id: 73, title: "Gefieder- & Pinsel-Streichungen", desc: "Weiche Pinsel über hochsensiblen Schwellkörpern.", type: "scale", somaticZone: "cutaneous_skin", equipmentTags: ["feather", "brush"] },
        { id: 74, title: "Druckpunkt-Kitzeln an den Fußsohlen", desc: "Fokussierte Stimulation der Fußreflexzonen im Halbdunkel.", type: "scale", somaticZone: "limbs_ankles_feet", equipmentTags: [] },
        { id: 75, title: "Erlösende Umarmung nach der Quälerei", desc: "Sanftes Auffangen des erschöpften Partners im Aftercare.", type: "scale", somaticZone: "full_body", equipmentTags: ["weighted_blanket"] }
      ]
    },

    {
      id: 15,
      title: "Kapitel 15: Nacktheit, Scham & Entblößung im Raum",
      desc: "Das Fallenlassen aller Schutzhüllen vor dem Blick des Partners.",
      items: [
        { id: 76, title: "Nackt sein müssen, während der Partner angezogen ist", desc: "Spürbare Asymmetrie durch Kleidungshierarchie.", type: "scale", somaticZone: "full_body", equipmentTags: [] },
        { id: 77, title: "Inspektion des Körpers im hellen Licht", desc: "Wortlose, genaue Begutachtung von Haltung, Haut und Pflege.", type: "scale", somaticZone: "full_body", equipmentTags: [] },
        { id: 78, title: "Zurschaustellung vor dem großen Spiegel", desc: "Den eigenen Körper und die Unterordnung im Spiegel betrachten müssen.", type: "scale", somaticZone: "head_eyes", equipmentTags: ["mirror"] },
        { id: 79, title: "Scham-Überwindung bei verletzlichen Fantasien", desc: "Offenes Ansprechen geheimer Sehnsüchte ohne Furcht vor Verurteilung.", type: "scale", somaticZone: "nervous_system", equipmentTags: [] },
        { id: 80, title: "Körperpflege-Befehle (Intimrasur auf Anweisung)", desc: "Der Top bestimmt Glätte und Pflegezustand des Intimbereichs.", type: "scale", somaticZone: "genital_pelvis", equipmentTags: ["razor"] }
      ]
    },

    {
      id: 16,
      title: "Kapitel 16: Diskrete Öffentlichkeit, Nervenkitzel & Exhibitionismus",
      desc: "Der geheime Reiz des Verborgenen in Sichtweite Dritter.",
      items: [
        { id: 81, title: "Diskretes Tragen von Toys im Restaurant / Alltag", desc: "Peniskäfig, Analplug oder ferngesteuerter Vibrator unter normaler Kleidung.", type: "scale", somaticZone: "genital_pelvis", equipmentTags: ["chastity_cage", "butt_plug", "remote_toy"] },
        { id: 82, title: "Heimliche Berührungen an öffentlichen Orten", desc: "Eine Hand unter dem Tisch im Restaurant oder im Kino.", type: "scale", somaticZone: "thighs_inner", equipmentTags: [] },
        { id: 83, title: "Spaziergang im Halbdunkel ohne Unterwäsche", desc: "Der kühle Wind auf der nackten Haut unter Mantel oder Kleid.", type: "scale", somaticZone: "gluteal_pelvis", equipmentTags: [] },
        { id: 84, title: "Geheime Codewörter in Gegenwart Dritter", desc: "Worte, die für Außenstehende normal klingen, aber Befehle übertragen.", type: "scale", somaticZone: "head_ears", equipmentTags: [] },
        { id: 85, title: "Flüchtiger Blickkontakt mit Besitz-Gesten", desc: "Ein fester Griff in den Nacken oder an die Hand vor Bekannten.", type: "scale", somaticZone: "neck_cervical", equipmentTags: [] }
      ]
    },

    {
      id: 17,
      title: "Kapitel 17: Rollenspiele, Szenarien & Maskeraden",
      desc: "Das Schlüpfen in archetypische Macht- und Verführungsfiguren.",
      items: [
        { id: 86, title: "Fremde an der Hotelbar (Strangers-Roleplay)", desc: "So tun, als würde man sich zum ersten Mal im Leben begegnen.", type: "scale", somaticZone: "full_body", equipmentTags: [] },
        { id: 87, title: "Autorität & Untergebener (Chef/Sekretär, Arzt/Patient)", desc: "Klassische hierarchische Konstellationen im geschützten Raum.", type: "scale", somaticZone: "full_body", equipmentTags: [] },
        { id: 88, title: "Verführung der unschuldigen Person", desc: "Behutsames Heranführen an das Verbotene mit gespieltem Zögern.", type: "scale", somaticZone: "full_body", equipmentTags: [] },
        { id: 89, title: "Masken & Verhüllung des Gesichts", desc: "Leder- oder Spitzenmasken, die die Mimik und Identität dämpfen.", type: "scale", somaticZone: "head_face", equipmentTags: ["mask"] },
        { id: 90, title: "Hausdiener / Zofe im privaten Heim", desc: "Formales Servieren und Bedienen in vereinbarter Kleidung.", type: "scale", somaticZone: "full_body", equipmentTags: ["chores_gear"] }
      ]
    }
  ];

  window.surveyChaptersPart1 = chaptersPart1;

  // Idempotente Zusammenführung zur Vermeidung doppelter Kapitel bei Reloads
  const existingChapters = Array.isArray(window.surveyChapters) ? window.surveyChapters : [];
  const part1Map = new Map();

  // Erst bestehende Kapitel aufnehmen
  existingChapters.forEach(ch => {
    if (ch && ch.id !== undefined) part1Map.set(String(ch.id), ch);
  });

  // Teil 1 sauber einsetzen / überschreiben
  chaptersPart1.forEach(ch => {
    part1Map.set(String(ch.id), ch);
  });

  window.surveyChapters = Array.from(part1Map.values());

})(window);
