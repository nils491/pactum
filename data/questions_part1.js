/**
 * data/questions_part1.js
 * TACTUS Psychometrischer Konsens-Katalog · Teil 1 (Kapitel 00 bis 17)
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien nach Master-Roadbook:
 * - 100 % UTF-8 Integrität: Echte deutsche Umlaute (ä, ö, ü, ß) im gesamten Modul
 * - Exakte Primärschlüssel-Invarianz: Items 1 bis 90 linear sowie Schutzkapitel 00 (Items 901–905)
 * - Typisierung: 'choice' für Schutzkapitel 00, 'scale' (Likert 0–5) für alle weiteren Items
 * - Kinetische & somatische Metadaten (somaticZone, equipmentTags, restraintLayer) für DoF & Staging
 * - Globale Bereitstellung an window.surveyChaptersPart1 sowie CommonJS-Export
 */

(function(window) {
  'use strict';

  const surveyChaptersPart1 = [
    {
      id: 0,
      slug: 'chapter_00_safety',
      title: 'Kapitel 00: Psychosomatische Sicherheit, Trauma & Trigger',
      desc: 'Prolog zur Abklärung seelischer Schutzräume, Flashback-Auslöser und verbindlicher Soforthilfen bei Überforderung.',
      items: [
        {
          id: 901,
          type: 'choice',
          title: 'Sexuelle & emotionale Vorerfahrungen',
          desc: 'Ehrliche Selbsteinschätzung früherer Belastungen, Grenzüberschreitungen oder Übergriffe.',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          options: [
            { val: 'unburdened', label: 'Keine nennenswerten Belastungen oder Traumata vorhanden' },
            { val: 'mild_boundaries', label: 'Vereinzelte Grenzüberschreitungen, die Achtsamkeit verlangen' },
            { val: 'significant_trauma', label: 'Prägende Traumata vorhanden; erfordert feste Sicherheitsleitplanken' },
            { val: 'prefers_private', label: 'Möchte ich vorerst nur für mich behalten und behutsam dosieren' }
          ]
        },
        {
          id: 902,
          type: 'choice',
          title: 'Körperliche & seelische Flashback-Trigger',
          desc: 'Spezifische Sinnesreize, die Panik, Erstarrung oder Abwehr auslösen können.',
          somaticZone: 'nervous_system',
          equipmentTags: [],
          options: [
            { val: 'none', label: 'Keine spezifischen Flashback-Trigger bekannt' },
            { val: 'airway', label: 'Enge am Hals, Atembegrenzung oder Bedeckung von Mund/Nase' },
            { val: 'restraint', label: 'Vollständige Fixierung ohne spürbare Restbeweglichkeit' },
            { val: 'words', label: 'Bestimmte Schimpfwörter oder erniedrigende Tonlagen' },
            { val: 'darkness', label: 'Plötzliche, unangekündigte vollkommene Dunkelheit' },
            { val: 'smell', label: 'Bestimmte Gerüche (Alkohol, kaltes Metall, bestimmte Parfüms)' }
          ]
        },
        {
          id: 903,
          type: 'choice',
          title: 'Reaktion bei Überforderung / Dissoziation',
          desc: 'Wie dein vegetatives Nervensystem reagiert, wenn eine Situation emotional kippt.',
          somaticZone: 'vegetative_system',
          equipmentTags: [],
          options: [
            { val: 'freeze', label: 'Freeze: Körperliches Erstarren, Verstummen und Nicht-mehr-Sprechen-Können' },
            { val: 'weeping', label: 'Weinen / Weinkrämpfe und emotionales Absacken' },
            { val: 'fight_flight', label: 'Fluchtreflex / Drang, sich sofort loszureißen' },
            { val: 'dissociation', label: 'Wegdriften / Gefühl, den eigenen Körper von außen zu beobachten' }
          ]
        },
        {
          id: 904,
          type: 'choice',
          title: 'Gewünschte Intervention des Partners bei Trigger',
          desc: 'Welche konkrete Soforthandlung des Partners dir verlässlich hilft, wieder im Hier und Jetzt zu landen.',
          somaticZone: 'vagus_soothing',
          equipmentTags: ['blanket'],
          options: [
            { val: 'hug', label: 'Feste, stumme Umarmung & Halten (Gewichtsdecken-Effekt)' },
            { val: 'distance', label: 'Körperliche Berührung sofort einstellen & Raum gewähren' },
            { val: 'grounding', label: 'Licht anmachen, zudecken & synchrone 4-7-8 Vagus-Atmung' },
            { val: 'water_tea', label: 'Schluck warmen Tee oder Wasser reichen, ohne Fragen zu stellen' },
            { val: 'voice', label: 'Mit tiefer, leiser Stimme sprechen und Sicherheit zusprechen' }
          ]
        },
        {
          id: 905,
          type: 'choice',
          title: 'Umgang mit Scham & Schutzraum',
          desc: 'Vereinbarter Verhaltenskodex bei verletzlichen, schambesetzten Wünschen.',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          options: [
            { val: 'absolute_ban_mockery', label: 'Absolutes Spottverbot im Alltag (§ 1 Abs. 2 Beziehungsvertrag)' },
            { val: 'darkness_only', label: 'Erkundung nur im Halbdunkel ohne grelles Licht' },
            { val: 'slow_verbal_check', label: 'Vorab mündlich ankündigen und Bestätigung einholen' },
            { val: 'aftercare_reassurance', label: 'Ausdrückliche verbale Bestätigung in der Nachsorge' }
          ]
        }
      ]
    },

    {
      id: 1,
      slug: 'chapter_0_anatomy',
      title: 'Kapitel 0: Anatomie & Körperliche Grundlagen',
      desc: 'Grundlegende anatomische Orientierung, taktile Einstimmung und Erkundung sensibler Hautzonen.',
      items: [
        { id: 1, type: 'scale', title: 'Anatomische Orientierung', desc: 'Offenheit für das Zusammenspiel der jeweiligen körperlichen Voraussetzungen.', somaticZone: 'full_body', equipmentTags: [], restraintLayer: 0 },
        { id: 2, type: 'scale', title: 'Berührungen der erogenen Zonen', desc: 'Sensible Streichungen und Erkundung sensibler Hautpartien.', somaticZone: 'torso_skin', equipmentTags: [], restraintLayer: 0 },
        { id: 3, type: 'scale', title: 'Brust- & Brustwarzen-Stimulation', desc: 'Sanftes bis intensives Einbeziehen der Brustwarzen durch Hände, Mund oder Zupfen.', somaticZone: 'chest_nipples', equipmentTags: ['clamps'], restraintLayer: 0 },
        { id: 4, type: 'scale', title: 'Hals-, Nacken- & Ohren-Küsse', desc: 'Fokussierte Küsse und sanftes Knabbern an Nacken, Hals und Ohrläppchen.', somaticZone: 'head_neck', equipmentTags: [], restraintLayer: 0 },
        { id: 5, type: 'scale', title: 'Massage mit warmem Öl', desc: 'Ganzkörper-Entspannung mit duftenden Ölen vor der eigentlichen Intimität.', somaticZone: 'full_body', equipmentTags: ['oil'], restraintLayer: 0 }
      ]
    },

    {
      id: 2,
      slug: 'chapter_1_romance',
      title: 'Kapitel 1: Romantik, Zärtlichkeit & emotionale Hingabe',
      desc: 'Blickkontakt, Nähe, Liebesbekundungen und die emotionale Tiefe der Zweisamkeit.',
      items: [
        { id: 6, type: 'scale', title: 'Langer, ununterbrochener Augenkontakt', desc: 'Tiefes gegenseitiges Fixieren während der Intimität ohne Wegsehen.', somaticZone: 'head_eyes', equipmentTags: [], restraintLayer: 0 },
        { id: 7, type: 'scale', title: 'Intensives, ausgiebiges Küssen', desc: 'Tiefe Zungenküsse, die im Mittelpunkt der Begegnung stehen.', somaticZone: 'head_mouth', equipmentTags: [], restraintLayer: 0 },
        { id: 8, type: 'scale', title: 'Langsame, entschleunigte Vereinigung', desc: 'Besonders behutsame, synchrone Bewegung mit Fokus auf Nähe.', somaticZone: 'pelvis_core', equipmentTags: [], restraintLayer: 0 },
        { id: 9, type: 'scale', title: 'Zärtliches Festhalten & Einkuscheln', desc: 'Festes Umschlungenhalten während und nach dem Liebesakt.', somaticZone: 'full_body', equipmentTags: ['blanket'], restraintLayer: 0 },
        { id: 10, type: 'scale', title: 'Liebeserklärungen während der Ekstase', desc: 'Worte tiefer Zuneigung und Verbundenheit im Moment höchster Erregung.', somaticZone: 'psyche_mind', equipmentTags: [], restraintLayer: 0 }
      ]
    },

    {
      id: 3,
      slug: 'chapter_2_foreplay',
      title: 'Kapitel 2: Vorspiel, Küsse & taktile Schwellen',
      desc: 'Taktiles Herantasten, Berührungsverbote, sensorische Reize und zarte Bissspuren.',
      items: [
        { id: 11, type: 'scale', title: 'Ausgedehntes Vorspiel (> 30 Minuten)', desc: 'Langes Hinauszögern des eigentlichen Akts zur Steigerung der Vorfreude.', somaticZone: 'full_body', equipmentTags: [], restraintLayer: 0 },
        { id: 12, type: 'scale', title: 'Berührungsverbot für den Partner', desc: 'Einer darf nur daliegen und genießen, ohne selbst die Hände zu benutzen.', somaticZone: 'limbs_hands_wrists', equipmentTags: [], restraintLayer: 0 },
        { id: 13, type: 'scale', title: 'Feder- & Seidentuch-Streichungen', desc: 'Ultra-sanfte Reize über die gesamte Körperoberfläche.', somaticZone: 'torso_skin', equipmentTags: ['feather', 'silk'], restraintLayer: 0 },
        { id: 14, type: 'scale', title: 'Sanftes Beißen & Saugen (Lovebites)', desc: 'Leichte Zahnabdrücke an Hals, Schultern oder Oberschenkeln.', somaticZone: 'head_neck', equipmentTags: [], restraintLayer: 0 },
        { id: 15, type: 'scale', title: 'Flüstern intimer Kosenamen', desc: 'Geheime Worte leise ins Ohr geraunt.', somaticZone: 'head_ears', equipmentTags: [], restraintLayer: 0 }
      ]
    },

    {
      id: 4,
      slug: 'chapter_3_oral',
      title: 'Kapitel 3: Orale Hingabe & Cunnilingus / Fellatio',
      desc: 'Orale Verwöhnpraktiken, Ausdauer, Hingabe auf Knien und tiefe Aufnahme.',
      items: [
        { id: 16, type: 'scale', title: 'Ausgiebiger Cunnilingus (Lecken der Vulva)', desc: 'Fokussiertes und langes Verwöhnen der Klitoris und Schamlippen mit der Zunge.', somaticZone: 'genital_vulva_clitoris', equipmentTags: [], restraintLayer: 0 },
        { id: 17, type: 'scale', title: 'Fellatio (Blasen des Penis)', desc: 'Ausdauerndes Verwöhnen des Schafts und der Eichel mit Mund und Lippen.', somaticZone: 'genital_penile', equipmentTags: [], restraintLayer: 0 },
        { id: 18, type: 'scale', title: 'Deepthroating / Tiefe orale Aufnahme', desc: 'Weites Aufnehmen des Penis bis in den Rachen.', somaticZone: 'head_mouth', equipmentTags: [], restraintLayer: 0 },
        { id: 19, type: 'scale', title: 'Orgasmus im Mund / Schlucken', desc: 'Höhepunkt direkt in den Mund des Partners mit Erlaubnis/Wunsch zu schlucken.', somaticZone: 'head_mouth', equipmentTags: [], restraintLayer: 0 },
        { id: 20, type: 'scale', title: 'Orale Bedienung auf Knien', desc: 'Oralservice geleistet im Kniestand vor dem sitzenden oder stehenden Partner.', somaticZone: 'limbs_knees', equipmentTags: [], restraintLayer: 0 }
      ]
    },

    {
      id: 5,
      slug: 'chapter_4_positions',
      title: 'Kapitel 4: Stellungen & anatomische Dynamiken',
      desc: 'Körperwinkel, Führung von oben, Hingabe von hinten und akrobatischer Halt.',
      items: [
        { id: 21, type: 'scale', title: 'Reiterstellung / Weibliche Führung oben', desc: 'Die Partnerin bestimmt Takt, Tiefe und Winkel auf dem Partner.', somaticZone: 'pelvis_core', equipmentTags: [], restraintLayer: 0 },
        { id: 22, type: 'scale', title: 'Doggy-Style / Von hinten genommen werden', desc: 'Instinktive, tiefe Vereinigung von hinten auf allen Vieren.', somaticZone: 'pelvis_core', equipmentTags: [], restraintLayer: 0 },
        { id: 23, type: 'scale', title: 'Stehend an der Wand / Aufgehoben', desc: 'Kraftvoller Vollzug im Stehen mit Anlehnen an Wand oder Möbel.', somaticZone: 'full_body', equipmentTags: [], restraintLayer: 0 },
        { id: 24, type: 'scale', title: 'Lotus-Sitz / Eng umschlungen im Sitzen', desc: 'Sitzen auf dem Schoß des Partners mit maximalem Hautkontakt.', somaticZone: 'pelvis_core', equipmentTags: [], restraintLayer: 0 },
        { id: 25, type: 'scale', title: 'Beine auf den Schultern des Partners', desc: 'Weite Dehnung und tiefer Eintritt durch Hochlegen der Beine.', somaticZone: 'limbs_legs', equipmentTags: [], restraintLayer: 0 }
      ]
    },

    {
      id: 6,
      slug: 'chapter_5_frequency',
      title: 'Kapitel 5: Sexuelle Frequenz & Spontaneität',
      desc: 'Tageszeiten, Spontaneität versus Verabredung und unkonventionelle Orte im Wohnraum.',
      items: [
        { id: 26, type: 'scale', title: 'Morgensex direkt beim Aufwachen', desc: 'Noch schlaftrunken und warm vor dem ersten Kaffee.', somaticZone: 'full_body', equipmentTags: [], restraintLayer: 0 },
        { id: 27, type: 'scale', title: 'Spontaner Quickie zwischendurch', desc: 'Kurz, intensiv und ohne langes Ausziehen im Alltagstrubel.', somaticZone: 'pelvis_core', equipmentTags: [], restraintLayer: 0 },
        { id: 28, type: 'scale', title: 'Nächtliches Wecken durch Berührungen', desc: 'Aus dem Schlaf heraus durch Küsse und Streicheln erweckt werden.', somaticZone: 'full_body', equipmentTags: [], restraintLayer: 0 },
        { id: 29, type: 'scale', title: 'Lange geplante Date-Night Sessions', desc: 'Verabredete Stunden mit Kerzen, Vorbereitung und ungestörter Zeit.', somaticZone: 'full_body', equipmentTags: [], restraintLayer: 0 },
        { id: 30, type: 'scale', title: 'Sex an ungewöhnlichen Orten im Haus', desc: 'Kücheninsel, Dusche, Sofa, Schreibtisch oder Treppe.', somaticZone: 'full_body', equipmentTags: [], restraintLayer: 0 }
      ]
    },

    {
      id: 7,
      slug: 'chapter_6_dirty_talk',
      title: 'Kapitel 6: Dirty Talk & Verbale Erotik',
      desc: 'Wortwahl, Kommandos, Fantasie-Flüstern und ungehemmte Lautäußerungen.',
      items: [
        { id: 31, type: 'scale', title: 'Beschreiben, was man gleich tun wird', desc: 'Gedankliche Vorwegnahme in klaren, deutlichen Worten.', somaticZone: 'psyche_mind', equipmentTags: [], restraintLayer: 0 },
        { id: 32, type: 'scale', title: 'Deutliche, ungeschminkte Vokabeln', desc: 'Verwendung direkter, unverblümter Wörter für Körperteile und Akte.', somaticZone: 'psyche_mind', equipmentTags: [], restraintLayer: 0 },
        { id: 33, type: 'scale', title: 'Flüstern von Fantasien im Alltag', desc: 'Heimliche Andeutungen am Esstisch oder unter Freunden ins Ohr geraunt.', somaticZone: 'head_ears', equipmentTags: [], restraintLayer: 0 },
        { id: 34, type: 'scale', title: 'Verbale Anweisungen & Befehle', desc: 'Klare Kommandos: „Zieh dich aus“, „Knie dich hin“, „Sieh mich an“.', somaticZone: 'psyche_mind', equipmentTags: [], restraintLayer: 0 },
        { id: 35, type: 'scale', title: 'Stöhnen, Schluchzen und hörbares Atmen', desc: 'Hemmungslose akustische Lautäußerungen während der Vereinigung.', somaticZone: 'head_mouth', equipmentTags: [], restraintLayer: 0 }
      ]
    },

    {
      id: 8,
      slug: 'chapter_7_chastity_control',
      title: 'Kapitel 7: Keuschheit, Orgasmuskontrolle & Triebaufschub',
      desc: 'Orgasmusverweigerung (Denial), verdorbene Höhepunkte (Ruined Orgasm) und Betteln auf Knien.',
      items: [
        { id: 36, type: 'scale', title: 'Orgasmusverweigerung (Denial)', desc: 'Heranführen an den Höhepunkt mit anschließendem kaltem Stopp.', somaticZone: 'genital_penile', equipmentTags: ['timer'], restraintLayer: 0 },
        { id: 37, type: 'scale', title: 'Orgasmus auf Erlaubnis (Orgasm Control)', desc: 'Nur dann kommen dürfen, wenn der führende Partner den Befehl erteilt.', somaticZone: 'genital_penile', equipmentTags: [], restraintLayer: 0 },
        { id: 38, type: 'scale', title: 'Ruined Orgasm (Verdorbener Höhepunkt)', desc: 'Abbruch der Stimulation exakt am Point of no Return; Muskelzucken ohne Genuss.', somaticZone: 'genital_penile', equipmentTags: [], restraintLayer: 0 },
        { id: 39, type: 'scale', title: 'Tage- oder wochenlanger Triebaufschub', desc: 'Kontrollierte Enthaltsamkeit zur Steigerung der Hingabe und Konzentration.', somaticZone: 'psyche_mind', equipmentTags: [], restraintLayer: 0 },
        { id: 40, type: 'scale', title: 'Betteln um Freigabe (Begging)', desc: 'Auf den Knien um Erlaubnis zur Ejakulation bitten müssen.', somaticZone: 'limbs_knees', equipmentTags: [], restraintLayer: 0 }
      ]
    },

    {
      id: 9,
      slug: 'chapter_8_chastity_hardware',
      title: 'Kapitel 8: Keuschheits-Hardware, Schlösser & Schrank',
      desc: 'Peniskäfige, Plomben, Tresore, urologische Hygiene und weibliche Keuschheitsgürtel.',
      items: [
        { id: 41, type: 'scale', title: 'Tragen eines Peniskäfigs (Chastity Cage)', desc: 'Physischer Verschluss aus Kunststoff, Nylon oder Edelstahl.', somaticZone: 'genital_penile', equipmentTags: ['chastity_cage'], restraintLayer: 1 },
        { id: 42, type: 'scale', title: 'Schlüsselgewalt beim Partner (Keyholder)', desc: 'Der Partner verwahrt den Schlüssel im Tresor, an einer Kette oder unterwegs.', somaticZone: 'psyche_mind', equipmentTags: ['safe', 'lock'], restraintLayer: 0 },
        { id: 43, type: 'scale', title: 'Sicherheits-Einwegplomben mit Nummern', desc: 'Versiegelung mit nummerierten Plomben zur Manipulationskontrolle.', somaticZone: 'genital_penile', equipmentTags: ['seals'], restraintLayer: 1 },
        { id: 44, type: 'scale', title: 'Keuschheits-Hygiene & Spülprotokoll', desc: 'Tägliches Reinigen des Verschlusses mit Spritze und antiseptischer Pflege.', somaticZone: 'genital_penile', equipmentTags: ['syringe'], restraintLayer: 0 },
        { id: 45, type: 'scale', title: 'Weiblicher Keuschheitsgürtel (Chastity Belt)', desc: 'Mechanischer Schildverschluss gegen klitorale Selbststimulation.', somaticZone: 'genital_vulva_clitoris', equipmentTags: ['chastity_belt'], restraintLayer: 1 }
      ]
    },

    {
      id: 10,
      slug: 'chapter_9_bdsm_basics',
      title: 'Kapitel 9: BDSM-Basics: Rollen, Führung & Hierarchie',
      desc: 'Machtasymmetrie, Switching, rituelle Haltungen, Titel und die Unantastbarkeit der Safeword-Ampel.',
      items: [
        { id: 46, type: 'scale', title: 'Feste Rollenaufteilung (Top / Bottom)', desc: 'Klare Definition, wer heute leitet und wer sich vollkommen anvertraut.', somaticZone: 'psyche_mind', equipmentTags: [], restraintLayer: 0 },
        { id: 47, type: 'scale', title: 'Rollenwechsel (Switching)', desc: 'Die Fähigkeit und Lust, an verschiedenen Tagen die Seiten zu tauschen.', somaticZone: 'psyche_mind', equipmentTags: [], restraintLayer: 0 },
        { id: 48, type: 'scale', title: 'Verwendung von Titeln (Herrin / Meister / Sir)', desc: 'Respektvolle Anrede im privaten Schutzraum oder während Sessions.', somaticZone: 'head_mouth', equipmentTags: [], restraintLayer: 0 },
        { id: 49, type: 'scale', title: 'Körperliche Ehrerbietung (Kniestand / Blick senken)', desc: 'Ritualisierte Haltungen als Zeichen innerer Ruhe und Unterordnung.', somaticZone: 'limbs_knees', equipmentTags: [], restraintLayer: 0 },
        { id: 50, type: 'scale', title: 'Klare Grenzen & Safeword-Ampel', desc: 'Unbedingte Einhaltung von Grün, Gelb und Rot ohne jede Diskussion.', somaticZone: 'psyche_mind', equipmentTags: [], restraintLayer: 0 }
      ]
    },

    {
      id: 11,
      slug: 'chapter_10_bondage',
      title: 'Kapitel 10: Fesselung, Shibari & körperliche Arretierung',
      desc: 'Manschetten, japanische Seilkunst, Arretierung an Möbeln, Spreizstangen und Suspension.',
      items: [
        { id: 51, type: 'scale', title: 'Fixierung der Handgelenke (Cuffs / Tuch)', desc: 'Weiche Leder- oder Stoffmanschetten vor dem Körper oder hinter dem Rücken.', somaticZone: 'limbs_hands_wrists', equipmentTags: ['cuffs'], restraintLayer: 1 },
        { id: 52, type: 'scale', title: 'Japanische Seilkunst (Shibari / Kinbaku)', desc: 'Ästhetische Seilmuster aus Jute oder Hanf am Oberkörper (Takate Kote).', somaticZone: 'torso_upper', equipmentTags: ['rope'], restraintLayer: 1 },
        { id: 53, type: 'scale', title: 'Fixierung am Bettpfosten / Möbelstück', desc: 'Vollständige Bewegungsunfähigkeit auf dem Rücken oder Bauch.', somaticZone: 'full_body', equipmentTags: ['cuffs', 'bed_straps'], restraintLayer: 2 },
        { id: 54, type: 'scale', title: 'Spreizstange für die Beine', desc: 'Feste Arretierung der Knöchel mit erzwungener Offenheit des Beckens.', somaticZone: 'limbs_ankles_feet', equipmentTags: ['spreader_bar'], restraintLayer: 2 },
        { id: 55, type: 'scale', title: 'Aufhängung / Suspension (Teil- oder Vollschwebe)', desc: 'Freies Schweben im Seil unter professioneller Gewichtsentlastung.', somaticZone: 'full_body', equipmentTags: ['rope', 'suspension_ring'], restraintLayer: 2 }
      ]
    },

    {
      id: 12,
      slug: 'chapter_11_spanking',
      title: 'Kapitel 11: Spanking & Gesäßzüchtigung',
      desc: 'Schläge mit der flachen Hand, OTK-Position, Mitzählen und lindernde Handauflegung.',
      items: [
        { id: 56, type: 'scale', title: 'Spanking mit der flachen Hand', desc: 'Warme, klatschende Treffer zur Durchblutung und somatischen Erdung.', somaticZone: 'gluteal_pelvis', equipmentTags: [], restraintLayer: 0 },
        { id: 57, type: 'scale', title: 'Züchtigung über das Knie gelegt (OTK)', desc: 'Klassische Haltung über dem Schoß des sitzenden Partners.', somaticZone: 'gluteal_pelvis', equipmentTags: [], restraintLayer: 0 },
        { id: 58, type: 'scale', title: 'Mitzählen jedes einzelnen Treffers', desc: 'Pflicht des Bottoms, jeden Schlag laut und deutlich mitzuzählen.', somaticZone: 'head_mouth', equipmentTags: [], restraintLayer: 0 },
        { id: 59, type: 'scale', title: 'Vorbeuge über die Bettkante mit Händen flach', desc: 'Strikte 90-Grad-Haltung während der Versohlung.', somaticZone: 'gluteal_pelvis', equipmentTags: [], restraintLayer: 0 },
        { id: 60, type: 'scale', title: 'Beruhigendes Handauflegen nach dem Spanking', desc: 'Feste, warme Handfläche auf dem erhitzten Gesäß zur Vagus-Beruhigung.', somaticZone: 'gluteal_pelvis', equipmentTags: [], restraintLayer: 0 }
      ]
    },

    {
      id: 13,
      slug: 'chapter_12_impact_tools',
      title: 'Kapitel 12: Impact Play: Flogger, Paddle & schwere Werkzeuge',
      desc: 'Lederflogger, Sattelleder-Paddles, Gürtel, Reitgerten und Rohrstöcke.',
      items: [
        { id: 61, type: 'scale', title: 'Schwerer Lederflogger (Fransenpeitsche)', desc: 'Dumpfe, wohlige Hitzewellen über Rücken, Schenkel und Gesäß.', somaticZone: 'gluteal_pelvis', equipmentTags: ['flogger'], restraintLayer: 0 },
        { id: 62, type: 'scale', title: 'Breites Leder- oder Holz-Paddle', desc: 'Satter, tiefer Schmerzreiz mit breiter Trefferfläche.', somaticZone: 'gluteal_pelvis', equipmentTags: ['paddle'], restraintLayer: 0 },
        { id: 63, type: 'scale', title: 'Ledergürtel (einfach oder doppelt gelegt)', desc: 'Das schwere Geräusch des Leders und gezielte, scharfe Treffer.', somaticZone: 'gluteal_pelvis', equipmentTags: ['leather_belt'], restraintLayer: 0 },
        { id: 64, type: 'scale', title: 'Schlanke Reitgerte (Crop)', desc: 'Punktgenauer, stechender Reiz auf Schenkelinnenseiten oder Waden.', somaticZone: 'thighs_inner', equipmentTags: ['crop'], restraintLayer: 0 },
        { id: 65, type: 'scale', title: 'Rohrstock (Cane) / Intensive Zucht', desc: 'Härtester Schmerzreiz mit dünnen Stöcken (nur für Fortgeschrittene).', somaticZone: 'gluteal_pelvis', equipmentTags: ['cane'], restraintLayer: 0 }
      ]
    },

    {
      id: 14,
      slug: 'chapter_13_sensory_temperature',
      title: 'Kapitel 13: Sensorischer Entzug & Temperatur-Reize',
      desc: 'Augenbinden, Sojawachs, Kälteschock mit Eis, Wartenberg-Rad und akustische Abschirmung.',
      items: [
        { id: 66, type: 'scale', title: 'Lichtdichte Augenbinde (Blindfold)', desc: 'Vollständiger Sichtentzug; Verstärkung aller Tast- und Hörreize.', somaticZone: 'head_eyes', equipmentTags: ['blindfold'], restraintLayer: 1 },
        { id: 67, type: 'scale', title: 'Tropfendes Niedrigtemperatur-Wachs', desc: 'Warmes BDSM-Sojawachs auf Brust, Bauch oder Schenkel.', somaticZone: 'torso_skin', equipmentTags: ['wax_candle'], restraintLayer: 0 },
        { id: 68, type: 'scale', title: 'Eiswürfel-Streichungen & Kälteschock', desc: 'Gezielte Streichungen mit Eis über erhitzte Hautpartien.', somaticZone: 'perineum_pelvic_floor', equipmentTags: ['ice'], restraintLayer: 0 },
        { id: 69, type: 'scale', title: 'Wartenberg-Rad (Sensorisches Nadelrad)', desc: 'Metallisches Prickeln über empfindliche Nervenbahnen ohne Läsion.', somaticZone: 'torso_skin', equipmentTags: ['wartenberg_wheel'], restraintLayer: 0 },
        { id: 70, type: 'scale', title: 'Kopfhörer mit weißem Rauschen / Soundscapes', desc: 'Akustische Isolation zur Abschirmung von der Außenwelt.', somaticZone: 'head_ears', equipmentTags: ['headphones'], restraintLayer: 1 }
      ]
    },

    {
      id: 15,
      slug: 'chapter_14_tickling',
      title: 'Kapitel 14: Kitzeln, Zarte Quälerei & Hilflosigkeit',
      desc: 'Gefesseltes Kitzeln, Lachen-Verbot, Federpinsel und erlösende Nachsorge.',
      items: [
        { id: 71, type: 'scale', title: 'Gefesseltes Kitzeln (Tickling)', desc: 'Kitzeln an Füßen, Rippen oder Achseln bei fixierten Gliedmaßen.', somaticZone: 'torso_flanks', equipmentTags: ['cuffs'], restraintLayer: 1 },
        { id: 72, type: 'scale', title: 'Verwehren von Lachen / Strikte Beherrschung', desc: 'Die Pflicht, trotz intensiven Kitzelns die Miene neutral zu halten.', somaticZone: 'head_face', equipmentTags: [], restraintLayer: 0 },
        { id: 73, type: 'scale', title: 'Gefieder- & Pinsel-Streichungen', desc: 'Weiche Pinsel über hochsensiblen Schwellkörpern.', somaticZone: 'genital_core', equipmentTags: ['feather_brush'], restraintLayer: 0 },
        { id: 74, type: 'scale', title: 'Druckpunkt-Kitzeln an den Fußsohlen', desc: 'Fokussierte Stimulation der Fußreflexzonen im Halbdunkel.', somaticZone: 'limbs_ankles_feet', equipmentTags: [], restraintLayer: 0 },
        { id: 75, type: 'scale', title: 'Erlösende Umarmung nach der Quälerei', desc: 'Sanftes Auffangen des erschöpften Partners im Aftercare.', somaticZone: 'full_body', equipmentTags: [], restraintLayer: 0 }
      ]
    },

    {
      id: 16,
      slug: 'chapter_15_nudity_shame',
      title: 'Kapitel 15: Nacktheit, Scham & Entblößung im Raum',
      desc: 'Asymmetrische Kleidung, Körperinspektionen, Spiegel-Konfrontation und Intimrasur-Befehle.',
      items: [
        { id: 76, type: 'scale', title: 'Nackt sein müssen, während der Partner angezogen ist', desc: 'Spürbare Asymmetrie durch Kleidungshierarchie im Raum.', somaticZone: 'psyche_mind', equipmentTags: [], restraintLayer: 0 },
        { id: 77, type: 'scale', title: 'Inspektion des Körpers im hellen Licht', desc: 'Wortlose, genaue Begutachtung von Haltung, Haut und Pflege.', somaticZone: 'full_body', equipmentTags: [], restraintLayer: 0 },
        { id: 78, type: 'scale', title: 'Zurschaustellung vor dem großen Spiegel', desc: 'Den eigenen Körper und die Unterordnung im Spiegel betrachten müssen.', somaticZone: 'head_eyes', equipmentTags: [], restraintLayer: 0 },
        { id: 79, type: 'scale', title: 'Scham-Überwindung bei verletzlichen Fantasien', desc: 'Offenes Ansprechen geheimer Sehnsüchte ohne Furcht vor Verurteilung.', somaticZone: 'psyche_mind', equipmentTags: [], restraintLayer: 0 },
        { id: 80, type: 'scale', title: 'Körperpflege-Befehle (Intimrasur auf Anweisung)', desc: 'Der Top bestimmt Glätte und Pflegezustand des Intimbereichs.', somaticZone: 'genital_core', equipmentTags: ['razor'], restraintLayer: 0 }
      ]
    },

    {
      id: 17,
      slug: 'chapter_16_discreet_public',
      title: 'Kapitel 16: Diskrete Öffentlichkeit, Nervenkitzel & Exhibitionismus',
      desc: 'Toys unter Kleidung, heimliche Berührungen, Codewörter und unbemerkte Besitzgesten.',
      items: [
        { id: 81, type: 'scale', title: 'Diskretes Tragen von Toys im Restaurant / Alltag', desc: 'Peniskäfig, Analplug oder ferngesteuerter Vibrator unter normaler Kleidung.', somaticZone: 'genital_pelvis', equipmentTags: ['chastity_cage', 'plug'], restraintLayer: 1 },
        { id: 82, type: 'scale', title: 'Heimliche Berührungen an öffentlichen Orten', desc: 'Eine Hand unter dem Tisch im Restaurant oder im Kino.', somaticZone: 'genital_pelvis', equipmentTags: [], restraintLayer: 0 },
        { id: 83, type: 'scale', title: 'Spaziergang im Halbdunkel ohne Unterwäsche', desc: 'Der kühle Wind auf der nackten Haut unter Mantel oder Kleid.', somaticZone: 'torso_skin', equipmentTags: [], restraintLayer: 0 },
        { id: 84, type: 'scale', title: 'Geheime Codewörter in Gegenwart Dritter', desc: 'Worte, die für Außenstehende normal klingen, aber Befehle übertragen.', somaticZone: 'psyche_mind', equipmentTags: [], restraintLayer: 0 },
        { id: 85, type: 'scale', title: 'Flüchtiger Blickkontakt mit Besitz-Gesten', desc: 'Ein fester Griff in den Nacken oder an die Hand vor Bekannten.', somaticZone: 'head_neck', equipmentTags: [], restraintLayer: 0 }
      ]
    },

    {
      id: 18,
      slug: 'chapter_17_roleplay_scenarios',
      title: 'Kapitel 17: Rollenspiele, Szenarien & Maskeraden',
      desc: 'Hotelbar-Fremde, hierarchische Konstellationen, Masken und häuslicher Zofendienst.',
      items: [
        { id: 86, type: 'scale', title: 'Fremde an der Hotelbar (Strangers-Roleplay)', desc: 'So tun, als würde man sich zum ersten Mal im Leben begegnen.', somaticZone: 'psyche_mind', equipmentTags: [], restraintLayer: 0 },
        { id: 87, type: 'scale', title: 'Autorität & Untergebener (Chef/Sekretär, Arzt/Patient)', desc: 'Klassische hierarchische Konstellationen im geschützten Raum.', somaticZone: 'psyche_mind', equipmentTags: [], restraintLayer: 0 },
        { id: 88, type: 'scale', title: 'Verführung der unschuldigen Person', desc: 'Behutsames Heranführen an das Verbotene mit gespieltem Zögern.', somaticZone: 'psyche_mind', equipmentTags: [], restraintLayer: 0 },
        { id: 89, type: 'scale', title: 'Masken & Verhüllung des Gesichts', desc: 'Leder- oder Spitzenmasken, die die Mimik und Identität dämpfen.', somaticZone: 'head_face', equipmentTags: ['mask'], restraintLayer: 1 },
        { id: 90, type: 'scale', title: 'Hausdiener / Zofe im privaten Heim', desc: 'Formales Servieren und Bedienen in vereinbarter Kleidung.', somaticZone: 'full_body', equipmentTags: ['uniform'], restraintLayer: 0 }
      ]
    }
  ];

  window.surveyChaptersPart1 = surveyChaptersPart1;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = surveyChaptersPart1;
  }

})(typeof window !== 'undefined' ? window : this);
