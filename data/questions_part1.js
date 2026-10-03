/**
 * data/questions_part1.js
 * TACTUS Psychometrischer Konsens-Katalog · Teil 1 (Kapitel 1 bis 10 · Items 1 bis 160)
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien nach Master-Roadbook & Governance-Verfassung:
 * - 100 % UTF-8 Integrität: Echte deutsche Umlaute (ä, ö, ü, ß) im gesamten Modul
 * - Gesunder Menschenverstand & Reiz-Klarheit: Keine absurden Metaphern
 * - Dreiklang pro Item: Was es ist, Was daran anmacht (Top/Bottom Psychologie) & griffige Labels
 * - Kinetische & somatische Metadaten (somaticZone, equipmentTags, restraintLayer) für DoF & Staging
 * - Globale Bereitstellung an window.surveyChaptersPart1 sowie CommonJS-Export
 */

(function(window) {
  'use strict';

  const surveyChaptersPart1 = [
    {
      id: 1,
      slug: 'chapter_01_body_zones',
      title: 'Kapitel 1: Körperbild, Schamgrenzen & Berührungszonen',
      desc: 'Das somatische Fundament: Zonen der Geborgenheit, Schamgrenzen, Lichtbedürfnis und taktile Toleranzen.',
      items: [
        {
          id: 1,
          type: 'scale',
          title: 'Kopfhaut & Haare kraulen',
          desc: 'Was es ist: Sanftes Durchfahren mit den Fingern oder andächtiges Kraulen der Kopfhaut.\nWas daran anmacht: Für den Top das Gefühl zärtlicher Fürsorge und Beruhigung. Für den Bottom sofortige Entlastung des Nervensystems und tiefes Loslassen.',
          r1Label: 'Partner im Haar kraulen & beruhigen',
          r2Label: 'Im Haar gekrault werden & fallenlassen',
          somaticZone: 'head_neck',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 2,
          type: 'scale',
          title: 'Nackenzone & Schlüsselbeine küssen',
          desc: 'Was es ist: Zärtliche Küsse und behutsames Berühren an Kehle, Nacken und Schlüsselbein.\nWas daran anmacht: Gänsehaut-Impulse über feine Nervenbahnen; der Hals ist die empfindlichste Zone menschlicher Schutzlosigkeit.',
          r1Label: 'Nacken küssen & liebkosen',
          r2Label: 'Nackenküsse empfangen & erschauern',
          somaticZone: 'head_neck',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 3,
          type: 'scale',
          title: 'Brüste, Brustwarzen & Dekolleté stimulieren',
          desc: 'Was es ist: Liebevolles Streicheln, Zupfen, Saugen oder Kitzeln an Brust und Brustwarzen beider Partner.\nWas daran anmacht: Direkte Ausschüttung von Oxytocin; Steigerung der sexuellen Erregung und des Nähegefühls.',
          r1Label: 'Brüste & Nippel liebkosen',
          r2Label: 'Berührung an Brüsten genießen',
          somaticZone: 'chest_nipples',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 4,
          type: 'scale',
          title: 'Bauch- & Taillenzone sanft berühren',
          desc: 'Was es ist: Sanftes Berühren des Bauches und der Flanken.\nWas daran anmacht: Für viele eine Zone größter Geborgenheit, für andere schambelastet; achtsames Herantasten schenkt tiefes Vertrauen.',
          r1Label: 'Bauch zärtlich streicheln',
          r2Label: 'Am Bauch berührt werden',
          somaticZone: 'torso_flanks',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 5,
          type: 'scale',
          title: 'Rücken & Wirbelsäulen-Linie ausstreichen',
          desc: 'Was es ist: Fingerspitzen-Streichen oder Massagen entlang der Wirbelsäule vom Steißbein bis zum Nacken.\nWas daran anmacht: Stimuliert das zentrale Nervensystem, baut Stress ab und erdet den gesamten Körper.',
          r1Label: 'Rücken liebkosen & massieren',
          r2Label: 'Rückenmassagen empfangen',
          somaticZone: 'back_flanks',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 6,
          type: 'scale',
          title: 'Gesäß & Oberschenkel-Innenseiten streicheln',
          desc: 'Was es ist: Flächiges Streicheln, Kneten oder warmes Berühren der Schenkel und des Pos vor der Intimzone.\nWas daran anmacht: Baut erotische Vorfreude auf, ohne direkt in die Genitalzone zu greifen.',
          r1Label: 'Gesäß & Schenkel liebkosen',
          r2Label: 'Berührung empfangen',
          somaticZone: 'gluteal_pelvis',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 7,
          type: 'scale',
          title: 'Füße, Fußsohlen & Zehen verwöhnen',
          desc: 'Was es ist: Massieren der Fußsohlen, Fußküsse oder Einbeziehen der Füße in Verwöhnrituale.\nWas daran anmacht: Löst tiefe vegetative Entspannung aus und schenkt dem Bottom das Gefühl vollständiger Wertschätzung.',
          r1Label: 'Füße des Partners verwöhnen',
          r2Label: 'Füße verwöhnen lassen',
          somaticZone: 'limbs_ankles_feet',
          equipmentTags: ['oil'],
          restraintLayer: 0
        },
        {
          id: 8,
          type: 'choice',
          title: 'Umgang mit Schamzonen & Körperkomplexen',
          desc: 'Akzeptanz und achtsamer Schutz sensibler Zonen; kein ungefragtes Entblößen von Problemzonen.',
          question: 'Wie wünschst du dir den Umgang mit deinen Scham- & Problemzonen?',
          somaticZone: 'psyche_mind',
          options: [
            { val: 'praise', label: 'Liebevolles Lob & Bestärkung erwünscht' },
            { val: 'cover', label: 'Bestimmte Zonen bitte zunächst bedeckt lassen' },
            { val: 'open', label: 'Völlig unbefangen & frei von Scham' },
            { val: 'tabu', label: 'Bestimmte Stellen sind für Berührungen tabu' }
          ]
        },
        {
          id: 9,
          type: 'choice',
          title: 'Beleuchtung im Schlafzimmer',
          desc: 'Wie viel Licht ist dir beim Intimsein am liebsten?',
          question: 'Welches Licht bevorzugst du im Raum?',
          somaticZone: 'head_eyes',
          options: [
            { val: 'dark', label: 'Vollständige Dunkelheit gibt mir die größte Sicherheit' },
            { val: 'dim', label: 'Sanftes, gedimmtes Licht oder Kerzenschein' },
            { val: 'bright', label: 'Helles Licht – ich möchte alles genau sehen' }
          ]
        },
        {
          id: 10,
          type: 'scale',
          title: 'Spielerisches Kitzeln an empfindlichen Stellen',
          desc: 'Was es ist: Kitzeln an Bauch, Rippen oder Fußsohlen als Auflockerung.\nWas daran anmacht: Löst Verkrampfungen, bringt Lachen ins Spiel und testet spielerisch die Wehrlosigkeit.',
          r1Label: 'Den Partner spielerisch kitzeln',
          r2Label: 'Gekitzelt werden & lachen',
          somaticZone: 'torso_flanks',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 11,
          type: 'scale',
          title: 'Kratzen mit den Fingernägeln (Scratching)',
          desc: 'Was es ist: Sanftes bis leichtes Ziehen der Nägel über Rücken, Schultern oder Gesäß ohne Verletzung.\nWas daran anmacht: Prickelnder Schmerz-Lust-Übergang; hinterlässt wohlige Hitze auf der Haut.',
          r1Label: 'Mit den Nägeln über die Haut streichen',
          r2Label: 'Das leichte Kratzen auf der Haut spüren',
          somaticZone: 'torso_skin',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 12,
          type: 'scale',
          title: 'Sanftes Beißen & Knabbern (Love Bites)',
          desc: 'Was es ist: Zärtliches Knabbern an Ohrläppchen, Lippen, Nacken oder Schultern.\nWas daran anmacht: Archaische Besitznahme und sensorischer Kontrast zwischen zarten Lippen und festen Zähnen.',
          r1Label: 'Zärtlich knabbern & zubeißen',
          r2Label: 'Knabbern & kleine Bisse empfangen',
          somaticZone: 'head_neck',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 13,
          type: 'choice',
          title: 'Körperbehaarung & Rasurvorlieben',
          desc: 'Deine persönliche Haltung zu Intim- und Körperbehaarung.',
          question: 'Welche Vorliebe hast du bei der Körperbehaarung?',
          somaticZone: 'torso_skin',
          options: [
            { val: 'smooth', label: 'Vollständig glattrasiert bevorzugt' },
            { val: 'trimmed', label: 'Gepflegt getrimmt reicht völlig aus' },
            { val: 'natural', label: 'Ganz natürlich belassen gefällt mir am besten' }
          ]
        }
      ]
    },

    {
      id: 2,
      slug: 'chapter_02_romance_kisses',
      title: 'Kapitel 2: Romantik, Küsse & emotionale Hingabe',
      desc: 'Liebevolle Verbundenheit: Der Herzschlag der Beziehung, Entschleunigung und seelische Nähe.',
      items: [
        {
          id: 14,
          type: 'scale',
          title: 'Intimer Augenkontakt (Soul Gazing)',
          desc: 'Was es ist: Ununterbrochenes, tiefes In-die-Augen-Schauen beim Streicheln oder Sex.\nWas daran anmacht: Lässt alle Fassaden fallen; schafft vollkommenes seelisches Ausgeliefertsein ohne Worte.',
          r1Label: 'Augenkontakt aktiv halten',
          r2Label: 'Blickkontakt erwidern & festhalten',
          somaticZone: 'head_eyes',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 15,
          type: 'scale',
          title: 'Sanftes Streicheln über die Wangen',
          desc: 'Was es ist: Behutsames Führen der Fingerspitzen über Wangen, Schläfen und Kieferpartie.\nWas daran anmacht: Drückt bedingungslose Zärtlichkeit und Beschützerinstinkt aus.',
          r1Label: 'Über die Wangen streichen',
          r2Label: 'Die Berührung im Gesicht genießen',
          somaticZone: 'head_face',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 16,
          type: 'scale',
          title: 'Stirn-an-Stirn ruhen & gemeinsam atmen',
          desc: 'Was es ist: Die Stirn an die des Partners legen, Augen schließen und den gemeinsamen Atem spüren.\nWas daran anmacht: Synchronisiert die Herzfrequenz und holt beide Partner aus dem Alltagsstress ins Hier und Jetzt.',
          r1Label: 'Die Stirn anlegen & Nähe schenken',
          r2Label: 'Stirn an Stirn loslassen',
          somaticZone: 'head_face',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 17,
          type: 'scale',
          title: 'Händchenhalten beim Liebesspiel',
          desc: 'Was es ist: Die Finger fest ineinander verschränken, während man sich intim liebt.\nWas daran anmacht: Gibt dem Bottom physischen Halt und verankert die emotionale Verbundenheit auch bei intensiver Lust.',
          r1Label: 'Die Hand des Partners fest greifen',
          r2Label: 'Die Hand halten & Halt spüren',
          somaticZone: 'limbs_hands_wrists',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 18,
          type: 'scale',
          title: 'Zärtlicher Dirty Talk & Flüstern ins Ohr',
          desc: 'Was es ist: Leises Zuhauchen von Kosenamen, Sehnsüchten oder erregenden Worten direkt an der Ohrmuschel.\nWas daran anmacht: Die feine Vibration der Stimme am Ohr löst sofortige vegetative Erregung aus.',
          r1Label: 'Ins Ohr flüstern',
          r2Label: 'Der Stimme im Ohr lauschen',
          somaticZone: 'head_ears',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 19,
          type: 'scale',
          title: 'Küsse auf geschlossene Augenlider',
          desc: 'Was es ist: Federleichte Küsse auf die Lider des ruhenden Partners.\nWas daran anmacht: Reine Andacht und Geborgenheit; schenkt das Gefühl, vollkommen behütet zu sein.',
          r1Label: 'Die Lider küssen',
          r2Label: 'Die Küsse auf den Augen empfangen',
          somaticZone: 'head_eyes',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 20,
          type: 'scale',
          title: 'Liebesgeständnisse mitten im Rausch',
          desc: 'Was es ist: Worte tiefer Zuneigung genau im intensivsten Moment der Erregung aussprechen.\nWas daran anmacht: Verbindet körperliche Ekstase mit maximaler seelischer Wahrhaftigkeit.',
          r1Label: 'Liebesworte im Moment sagen',
          r2Label: 'Die Worte hören & aufnehmen',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 21,
          type: 'scale',
          title: 'Umarmer-Sex (Belly-to-Belly)',
          desc: 'Was es ist: Sehr eng umschlungenes Lieben, bei dem Bauch an Bauch liegt und kaum Raum dazwischen bleibt.\nWas daran anmacht: Maximaler Hautkontakt und Wärme; der Herzschlag des anderen ist direkt spürbar.',
          r1Label: 'Den Partner ganz nah an sich ziehen',
          r2Label: 'Eng umschlungen lieben',
          somaticZone: 'full_body',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 22,
          type: 'scale',
          title: 'Gegenseitiges Füttern mit Leckereien',
          desc: 'Was es ist: Früchte oder Schokolade mit den Fingern reichen und genüsslich ablecken.\nWas daran anmacht: Verspielte Sinnesfreude und das Abgeben der Kontrolle über das eigene Essen.',
          r1Label: 'Den Partner füttern',
          r2Label: 'Sich füttern lassen',
          somaticZone: 'head_mouth',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 23,
          type: 'choice',
          title: 'Hintergrundmusik im Schlafzimmer',
          desc: 'Atmosphärische Playlists, sanfte Bässe oder ruhige Klänge beim Liebesspiel.',
          question: 'Welche Klangkulisse magst du am liebsten?',
          somaticZone: 'head_ears',
          options: [
            { val: 'music', label: 'Sanfte Erotik- oder Chillout-Playlists' },
            { val: 'silence', label: 'Reine Stille – ich will nur unseren Atem hören' },
            { val: 'sounds', label: 'Naturgeräusche (z. B. Regen oder Meeresrauschen)' }
          ]
        },
        {
          id: 24,
          type: 'scale',
          title: 'Nasenstubsen (Eskimo-Kuss)',
          desc: 'Was es ist: Verspieltes Reiben der Nasenspitzen aneinander zur Auflockerung zwischendurch.\nWas daran anmacht: Bringt Leichtigkeit und Lächeln in intime Momente.',
          r1Label: 'Die Nase sanft reiben',
          r2Label: 'Den Stupser erwidern',
          somaticZone: 'head_face',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 25,
          type: 'scale',
          title: 'Handkuss als Begrüßungsritual',
          desc: 'Was es ist: Die Hand des Partners zum Mund führen und andächtig auf den Handrücken küssen.\nWas daran anmacht: Formale Ehrerbietung und Respekt als erotisches Vorspiel.',
          r1Label: 'Die Hand küssen',
          r2Label: 'Die Hand küssen lassen',
          somaticZone: 'limbs_hands_wrists',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 26,
          type: 'scale',
          title: 'Kuss auf die Schulter von hinten',
          desc: 'Was es ist: Von hinten an den Partner herantreten und sanft die Schulterpartie küssen.\nWas daran anmacht: Überraschende Zärtlichkeit im Alltagstrubel; signalisiert Begehren ohne Druck.',
          r1Label: 'Von hinten die Schulter küssen',
          r2Label: 'Den Schulterkuss spüren',
          somaticZone: 'head_neck',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 27,
          type: 'scale',
          title: 'Gemeinsames Anschauen im Spiegel',
          desc: 'Was es ist: Nebeneinander vor dem Spiegel stehen, sich berühren und den Blick über das Spiegelbild austauschen.\nWas daran anmacht: Das eigene Begehrtwerden mit den Augen des Partners sehen; visueller Verstärker.',
          r1Label: 'Den Blick im Spiegel suchen',
          r2Label: 'Sich gemeinsam im Spiegel betrachten',
          somaticZone: 'head_eyes',
          equipmentTags: [],
          restraintLayer: 0
        }
      ]
    },

    {
      id: 3,
      slug: 'chapter_03_tantra_foreplay',
      title: 'Kapitel 3: Tantra & Sinnliches Vorspiel',
      desc: 'Achtsame Entschleunigung: Die Kunst, Erregung ohne Eile und ohne Orgasmusdruck aufzubauen.',
      items: [
        {
          id: 28,
          type: 'scale',
          title: 'Sinnlicher Lippentanz & Zungenküsse',
          desc: 'Was es ist: Sehr langes, zartes Küssen ohne Hast, bei dem sich Lippen und Zungenspitzen umkreisen.\nWas daran anmacht: Verlangsamt das Zeitempfinden; der Mund wird zum primären Lustzentrum.',
          r1Label: 'Küsse aktiv führen',
          r2Label: 'Hingebungsvoll küssen lassen',
          somaticZone: 'head_mouth',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 29,
          type: 'scale',
          title: 'Feder- & Seidentuch-Berührungen',
          desc: 'Was es ist: Mit weichen Seidentüchern oder echten Straußenfedern schwerelos über nackte Haut streichen.\nWas daran anmacht: Taktiler Schwellenreiz; kitzelt die feinsten Haarfollikel-Nerven ohne Druck.',
          r1Label: 'Das Tuch oder die Feder führen',
          r2Label: 'Die federleichte Berührung spüren',
          somaticZone: 'torso_skin',
          equipmentTags: ['feather', 'silk'],
          restraintLayer: 0
        },
        {
          id: 30,
          type: 'scale',
          title: 'Warmes Aroma-Massageöl auf der Haut',
          desc: 'Was es ist: Erwärmtes Mandel- oder Jojobaöl mit ruhigen, flächigen Händen langsam einmassieren.\nWas daran anmacht: Löst Muskelpanzer, hüllt in Duft und macht jede Berührung seidig gleitend.',
          r1Label: 'Den Partner mit warmem Öl massieren',
          r2Label: 'Die warme Ölmassage genießen',
          somaticZone: 'full_body',
          equipmentTags: ['oil'],
          restraintLayer: 0
        },
        {
          id: 31,
          type: 'scale',
          title: 'Gemeinsame Atem-Synchronisation',
          desc: 'Was es ist: Brust an Brust liegen und bewusst im selben Takt ein- und ausatmen.\nWas daran anmacht: Aktiviert das kardiovaskuläre Mitschwingen; lässt Grenzen zwischen zwei Körpern verschwimmen.',
          r1Label: 'Den Atemrhythmus vorgeben',
          r2Label: 'Den Takt aufnehmen & mitschwingen',
          somaticZone: 'torso_flanks',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 32,
          type: 'scale',
          title: 'Zonenfokussiertes Streicheln (Genitalien tabu)',
          desc: 'Was es ist: Den gesamten Körper eine halbe Stunde intensiv liebkosen, während Intimzonen strikt unberührt bleiben.\nWas daran anmacht: Staut die sexuelle Energie im gesamten Nervensystem, statt sie vorschnell zu entladen.',
          r1Label: 'Den Körper berühren & Intimzone meiden',
          r2Label: 'Die Spannung aushalten & genießen',
          somaticZone: 'torso_skin',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 33,
          type: 'scale',
          title: 'Warmer Atem auf feuchter Haut',
          desc: 'Was es ist: Ganz nah an Schläfen, Nacken oder Oberschenkeln sanft warm ausatmen.\nWas daran anmacht: Erzeugt plötzliche Gänsehautschauer durch Temperatur- und Luftzugreize.',
          r1Label: 'Warmen Atem über die Haut hauchen',
          r2Label: 'Den warmen Hauch spüren',
          somaticZone: 'head_neck',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 34,
          type: 'scale',
          title: 'Yoni- & Lingam-Massage (Achtsamkeit)',
          desc: 'Was es ist: Hochgradig achtsame, absichtsfreie Berührung des Intimbereichs ohne das Ziel eines schnellen Orgasmus.\nWas daran anmacht: Befreit von Zielgerichtetheit; lässt den Genitalbereich als heilige Zone reiner Empfindung erleben.',
          r1Label: 'Die achtsame Intimmassage geben',
          r2Label: 'Absichtsfrei empfangen & loslassen',
          somaticZone: 'genital_core',
          equipmentTags: ['oil'],
          restraintLayer: 0
        },
        {
          id: 35,
          type: 'scale',
          title: 'Langes Zeitlupen-Entkleiden',
          desc: 'Was es ist: Jedes Kleidungsstück mit Bedacht, Pausen und vielen Küssen ganz langsam ablegen.\nWas daran anmacht: Zelebriert die Enthüllung jedes einzelnen Zentimeters Haut als feierlichen Akt.',
          r1Label: 'Den Partner langsam ausziehen',
          r2Label: 'Sich Schicht für Schicht entkleiden lassen',
          somaticZone: 'full_body',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 36,
          type: 'choice',
          title: 'Aromatherapie & Duftkerzen im Raum',
          desc: 'Sandelholz, Lavendel oder Vanille als fester Bestandteil des Schlafzimmer-Ambientes.',
          question: 'Welche Düfte magst du im Schlafzimmer?',
          somaticZone: 'head_face',
          options: [
            { val: 'woody', label: 'Warme Hölzer (Sandelholz, Zedernholz)' },
            { val: 'sweet', label: 'Süße Düfte (Vanille, Mandel, Honig)' },
            { val: 'fresh', label: 'Frische Kräuter (Lavendel, Minze, Zitrus)' },
            { val: 'none', label: 'Lieber vollkommen geruchsneutral' }
          ]
        },
        {
          id: 37,
          type: 'scale',
          title: 'Ganztages-Vorspiel über Kurznachrichten',
          desc: 'Was es ist: Über den Tag verteilt kleine Hinweise, Vorfreude oder Fotos senden, die auf den Abend einstimmen.\nWas daran anmacht: Baut die erotische Spannung schon Stunden vor der eigentlichen Begegnung im Kopf auf.',
          r1Label: 'Die neckenden Nachrichten schreiben',
          r2Label: 'Die Nachrichten empfangen & Vorfreude spüren',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 38,
          type: 'scale',
          title: 'Kuscheln vor dem Sex ohne Leistungsdruck',
          desc: 'Was es ist: Gemeinsam mindestens 20 Minuten unter der Decke liegen, ohne dass sofort Sex folgen muss.\nWas daran anmacht: Schafft seelische Sicherheit und nimmt jede Erwartungshaltung aus der Begegnung.',
          r1Label: 'Den Partner im Arm halten',
          r2Label: 'Eingekuschelt zur Ruhe kommen',
          somaticZone: 'full_body',
          equipmentTags: ['blanket'],
          restraintLayer: 0
        },
        {
          id: 39,
          type: 'scale',
          title: 'Streichungen mit den Handrücken',
          desc: 'Was es ist: Mit den kühlen Handrücken sanft über Wangen, Hals und Arme gleiten.\nWas daran anmacht: Feiner Temperatur- und Druckkontrast zur warmen Handinnenfläche.',
          r1Label: 'Den Handrücken führen',
          r2Label: 'Das kühle Streichen genießen',
          somaticZone: 'torso_skin',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 40,
          type: 'scale',
          title: 'Sanfte Becken-Kreisungen',
          desc: 'Was es ist: Beim engen Liegen die Hüften ganz langsam und kreisend aneinander reiben.\nWas daran anmacht: Sanfte Stimulation der Schwellkörper ohne direkte Penetration; weckt tiefes Verlangen.',
          r1Label: 'Die Kreisbewegung anleiten',
          r2Label: 'Die Reibung des Beckens spüren',
          somaticZone: 'pelvis_core',
          equipmentTags: [],
          restraintLayer: 0
        }
      ]
    },

    {
      id: 4,
      slug: 'chapter_04_positions_dynamics',
      title: 'Kapitel 4: Stellungen & anatomische Dynamiken',
      desc: 'Körperhaltungen im Bett: Nähe, Tiefe, Blickkontakt und der Wechsel von Führung und Empfangen.',
      items: [
        {
          id: 41,
          type: 'scale',
          title: 'Missionar mit intensivem Blickkontakt',
          desc: 'Was es ist: Die klassische Haltung von oben, bei der man sich ganz nah ist und sich tief in die Augen schaut.\nWas daran anmacht: Körperliche Schwere und Blickkontakt verbinden sich zu maximaler Intimität.',
          r1Label: 'Oben liegen & Blickkontakt halten',
          r2Label: 'Unten liegen & den Partner empfangen',
          somaticZone: 'pelvis_core',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 42,
          type: 'scale',
          title: 'Löffelchen-Stellung (Geborgen von hinten)',
          desc: 'Was es ist: Seitlich umschlungen liegen; der aktive Part dringt von hinten ein, während die Hände den Körper erkunden.\nWas daran anmacht: Geborgenheit und Entspannung; ideal für lange, langsame Sessions.',
          r1Label: 'Von hinten umschlingen & lieben',
          r2Label: 'Im Löffelchen geborgen empfangen',
          somaticZone: 'pelvis_core',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 43,
          type: 'scale',
          title: 'Reiterstellung (Tempo selbst bestimmen)',
          desc: 'Was es ist: Oben auf dem Partner sitzen und Rhythmus sowie Tiefe frei steuern.\nWas daran anmacht: Für den oben Sitzenden volle Kontrolle über den Winkel; für den Liegenden der Blick auf den reitenden Körper.',
          r1Label: 'Unten liegen & den Anblick genießen',
          r2Label: 'Oben reiten & den Rhythmus bestimmen',
          somaticZone: 'pelvis_core',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 44,
          type: 'scale',
          title: 'Doggy Style (Fordernd von hinten)',
          desc: 'Was es ist: Auf allen Vieren; der Partner greift die Hüften und stößt im gewünschten Takt zu.\nWas daran anmacht: Instinktive, tiefe Vereinigung; die Hände des Tops haben freien Zugriff auf Gesäß und Rücken.',
          r1Label: 'Die Hüften greifen & von hinten führen',
          r2Label: 'Auf allen Vieren den Partner aufnehmen',
          somaticZone: 'gluteal_pelvis',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 45,
          type: 'scale',
          title: 'Lotos-Sitz (Herz an Herz umschlungen)',
          desc: 'Was es ist: Aufrecht im Schoß des Partners sitzen, Beine um die Hüften geschlungen, ganz nah aneinander.\nWas daran anmacht: Tiefste Verschmelzung; Arme und Lippen sind frei für Umarmungen und Küsse.',
          r1Label: 'Im Schneidersitz halten & führen',
          r2Label: 'Im Schoß sitzen & eng umarmen',
          somaticZone: 'pelvis_core',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 46,
          type: 'scale',
          title: 'Prone Bone (Flach auf dem Bauch)',
          desc: 'Was es ist: Flach auf dem Bauch mit geschlossenen Beinen liegen, während der Partner von hinten aufsteigt.\nWas daran anmacht: Enge Stimulation und vollkommene Hingabe; der Bottom spürt das gesamte Gewicht des Partners.',
          r1Label: 'Flach von hinten auflegen & eindringen',
          r2Label: 'Auf dem Bauch liegen & die Enge spüren',
          somaticZone: 'gluteal_pelvis',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 47,
          type: 'scale',
          title: 'Beine auf den Schultern ablegen',
          desc: 'Was es ist: Die Beine des empfangenden Partners auf die Schultern legen für maximale Tiefe.\nWas daran anmacht: Weite Öffnung des Beckens und freier Blickkontakt auf die Schwellkörper.',
          r1Label: 'Die Beine auflegen & tief lieben',
          r2Label: 'Die Beine ablegen & ganz öffnen',
          somaticZone: 'limbs_legs',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 48,
          type: 'scale',
          title: 'Kanten-Sex am Bettrand',
          desc: 'Was es ist: Der empfangende Part liegt am Bettrand, der Partner steht oder kniet davor.\nWas daran anmacht: Bequeme Höhe für den Stehenden und kraftvolle Führungsdynamik.',
          r1Label: 'Vor dem Bett stehen & führen',
          r2Label: 'Am Bettrand liegen & empfangen',
          somaticZone: 'pelvis_core',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 49,
          type: 'scale',
          title: 'Stehend an der Zimmerwand',
          desc: 'Was es ist: Den Partner an die Wand drücken, ein Bein anheben und fordernd im Stehen lieben.\nWas daran anmacht: Spontane Leidenschaft und das Ausnutzen physischer Kraft.',
          r1Label: 'An die Wand heben & im Stehen lieben',
          r2Label: 'An die Wand gelehnt genießen',
          somaticZone: 'full_body',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 50,
          type: 'choice',
          title: 'Stellungswechsel mitten im Akt',
          desc: 'Wie oft magst du Stellungswechsel während eines Mals?',
          question: 'Wie oft wechselt ihr gerne die Position?',
          somaticZone: 'pelvis_core',
          options: [
            { val: 'few', label: 'Lieber 1 bis 2 Positionen ganz tief auskosten' },
            { val: 'many', label: 'Vielfalt! Mehrmals wechseln für unterschiedliche Reize' },
            { val: 'spontaneous', label: 'Völlig spontan nach Lust und Laune' }
          ]
        },
        {
          id: 51,
          type: 'scale',
          title: 'Spiegel-Sex (Sich beim Sex zuschauen)',
          desc: 'Was es ist: Sich direkt vor einem großen Wandspiegel lieben und den Anblick der Körper beobachten.\nWas daran anmacht: Visuelle Bestätigung; man wird gleichzeitig Handelnder und Zuschauer der eigenen Lust.',
          r1Label: 'Den Blick in den Spiegel lenken',
          r2Label: 'Den gemeinsamen Anblick im Spiegel genießen',
          somaticZone: 'head_eyes',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 52,
          type: 'scale',
          title: 'Abruptes Wechseln von langsam zu fordernd',
          desc: 'Was es ist: Mitten im sanften Streicheln plötzlich das Tempo anziehen und fordernd zustoßen.\nWas daran anmacht: Der Überraschungseffekt jagt Adrenalin durch den Körper und bricht jede Routine.',
          r1Label: 'Das Tempo überraschend anziehen',
          r2Label: 'Den plötzlichen Rhythmuswechsel empfangen',
          somaticZone: 'pelvis_core',
          equipmentTags: [],
          restraintLayer: 0
        }
      ]
    },

    {
      id: 5,
      slug: 'chapter_05_spontaneity_places',
      title: 'Kapitel 5: Spontaneität, Orte & Clothed Sex',
      desc: 'Das Brechen der Routine: Sex in Kleidung, schnelle Nummern und besondere Orte in den eigenen vier Wänden.',
      items: [
        {
          id: 53,
          type: 'scale',
          title: 'Schneller Quickie vor dem Verlassen der Wohnung',
          desc: 'Was es ist: Noch in Jacke und Schuhen im Flur fordernd übereinander herfallen.\nWas daran anmacht: Zeitdruck und die pure Dringlichkeit des Verlangens ohne langes Ausziehen.',
          r1Label: 'Den schnellen Quickie im Flur einfordern',
          r2Label: 'Im Flur gepackt & verführt werden',
          somaticZone: 'pelvis_core',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 54,
          type: 'scale',
          title: 'Clothed Sex (Unterwäsche nur zur Seite schieben)',
          desc: 'Was es ist: Kleidung anbehalten, Höschen oder Slip nur beiseiteschieben und direkt eindringen.\nWas daran anmacht: Das Verruchte, halb bekleidet zu sein; Reizüberflutung durch engen Stoff.',
          r1Label: 'Die Unterwäsche zur Seite schieben & zugreifen',
          r2Label: 'Bekleidet bleiben & Berührung geschehen lassen',
          somaticZone: 'genital_core',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 55,
          type: 'scale',
          title: 'Kücheninsel oder Esstisch erobern',
          desc: 'Was es ist: Den Partner auf die Tischkante heben, Teller beiseiteschieben und lieben.\nWas daran anmacht: Umfunktionieren von Alltagsmöbeln zu Schauplätzen ungehemmter Lust.',
          r1Label: 'Auf die Tischplatte heben & führen',
          r2Label: 'Auf dem Tisch sitzen & empfangen',
          somaticZone: 'pelvis_core',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 56,
          type: 'scale',
          title: 'Liebesspiel unter der warmen Dusche',
          desc: 'Was es ist: Unter dem prasselnden Wasserstrahl eng umschlungen stehen und sich einseifen.\nWas daran anmacht: Warmes Wasser auf nackter Haut, glitschige Reibung und das Rauschen des Wassers.',
          r1Label: 'Unter der Dusche packen & einseifen',
          r2Label: 'Im warmen Wasser empfangen',
          somaticZone: 'full_body',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 57,
          type: 'scale',
          title: 'Sex im geparkten Auto an einsamer Stelle',
          desc: 'Was es ist: Spät abends mit dem Auto ins Grüne fahren und auf den Sitzen lieben.\nWas daran anmacht: Enge des Raumes und der Kitzel eines abgelegenen Orts im Halbdunkel.',
          r1Label: 'Die Sitze umklappen & im Auto lieben',
          r2Label: 'Auf dem Autositz verführt werden',
          somaticZone: 'pelvis_core',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 58,
          type: 'scale',
          title: 'Heimliche Berührungen bei Besuch im Nebenzimmer',
          desc: 'Was es ist: Wenn Gäste in der Küche sitzen, im Flur kurz die Hand unter das Kleid oder in die Hose schieben.\nWas daran anmacht: Das Risiko, leise sein zu müssen; geteilte Komplizenschaft vor anderen.',
          r1Label: 'Heimlich zugreifen & still sein gebieten',
          r2Label: 'Die verbotene Hand spüren & stillhalten',
          somaticZone: 'genital_core',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 59,
          type: 'scale',
          title: 'Spontanes Wecken mitten in der Nacht',
          desc: 'Was es ist: Um 3 Uhr morgens aufwachen und sich im Halbschlaf schlaftrunken lieben.\nWas daran anmacht: Enthemmung durch Schläfrigkeit; keine Alltagsgedanken im Kopf.',
          r1Label: 'Den Partner nachts wachküssen',
          r2Label: 'Mitten in der Nacht geweckt werden',
          somaticZone: 'full_body',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 60,
          type: 'scale',
          title: 'Auf dem dicken Teppich vor dem Kamin / Sofa',
          desc: 'Was es ist: Nicht ins Bett gehen, sondern sich mit Kissen direkt auf den Wohnzimmerboden legen.\nWas daran anmacht: Unkonventionell und erdig; durchbricht das klassische Schlafzimmer-Muster.',
          r1Label: 'Auf den Boden ziehen & lieben',
          r2Label: 'Auf dem Teppich empfangen',
          somaticZone: 'full_body',
          equipmentTags: ['blanket'],
          restraintLayer: 0
        },
        {
          id: 61,
          type: 'scale',
          title: 'Spontane Berührung beim gemeinsamen Kochen',
          desc: 'Was es ist: Beim Gemüseschneiden von hinten herantreten, eng andrücken und Hände wandern lassen.\nWas daran anmacht: Durchdringt die Alltagsroutine mit erotischer Anziehungskraft.',
          r1Label: 'Beim Kochen von hinten andrücken',
          r2Label: 'Am Herd stehen & die Hände empfangen',
          somaticZone: 'torso_flanks',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 62,
          type: 'choice',
          title: 'Wie wichtig ist dir Spontaneität im Alltag?',
          desc: 'Brauchst du feste Vorbereitung oder liebst du den spontanen Funken?',
          question: 'Welche Art von Sex passt besser zu deinem Alltag?',
          somaticZone: 'psyche_mind',
          options: [
            { val: 'spontaneous', label: 'Spontane Impulse und schnelle Nummern halten uns frisch' },
            { val: 'planned', label: 'Lieber geplante Abende mit viel Ruhe und ohne Hektik' },
            { val: 'both', label: 'Eine gute Mischung aus beidem' }
          ]
        }
      ]
    },

    {
      id: 6,
      slug: 'chapter_06_oral_pleasure',
      title: 'Kapitel 6: Oralverkehr & Rachenspiele',
      desc: 'Hingebungsvolle Lust mit Mund und Zunge: Cunnilingus, Fellatio, Ausdauer und tiefe Aufnahme.',
      items: [
        {
          id: 63,
          type: 'scale',
          title: 'Hingebungsvoller Cunnilingus (Langes Lecken)',
          desc: 'Was es ist: Die Vulva und Klitoris mit viel Ruhe, Zungenspitze und Lippen ohne jede Eile verwöhnen.\nWas daran anmacht: Für den Gebenden der direkte Geschmack und das Spüren der Erregung; für die Frau das vollkommene Aufgehen im Rhythmus.',
          r1Label: 'Die Partnerin ausgiebig mit der Zunge verwöhnen',
          r2Label: 'Cunnilingus genießen & fallenlassen',
          somaticZone: 'genital_vulva_clitoris',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 64,
          type: 'scale',
          title: 'Fellatio mit voller Aufmerksamkeit (Blowjob)',
          desc: 'Was es ist: Den Penis mit Lippen, Zunge und Speichel verwöhnen und jeden Zentimeter liebkosen.\nWas daran anmacht: Ausdauernde Hingabe; das Spiel mit Wärme und Feuchtigkeit.',
          r1Label: 'Dem Mann einen hingebungsvollen Blowjob schenken',
          r2Label: 'Oral verwöhnt werden & genießen',
          somaticZone: 'genital_penile',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 65,
          type: 'scale',
          title: '69er-Stellung (Gleichzeitig oral lieben)',
          desc: 'Was es ist: Gegengleich liegen und sich zur selben Zeit gegenseitig mit Mund und Zunge verwöhnen.\nWas daran anmacht: Gleichzeitiges Geben und Empfangen; sensorische Reizüberflutung.',
          r1Label: 'Die 69er-Haltung aktiv führen',
          r2Label: 'In der 69er-Haltung gleichzeitig empfangen',
          somaticZone: 'genital_core',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 66,
          type: 'scale',
          title: 'Hoden sanft in den Mund nehmen',
          desc: 'Was es ist: Die Hoden des Mannes behutsam mit warmen Lippen umschließen und saugen.\nWas daran anmacht: Reizung einer hochsensiblen Zone, die bei vielen Männern tiefe Erregung weckt.',
          r1Label: 'Die Hoden in den Mund nehmen',
          r2Label: 'Die warmen Lippen an den Hoden spüren',
          somaticZone: 'genital_testicles',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 67,
          type: 'scale',
          title: 'Dildo-Blastraining für den Mann',
          desc: 'Was es ist: Gemeinsam mit einem Toy die Rachenmuskulatur dehnen und den Schluckreflex abbauen.\nWas daran anmacht: Überwindung körperlicher Schwellen und Erweiterung der oralen Aufnahmefähigkeit.',
          r1Label: 'Das Blastraining geduldig anleiten',
          r2Label: 'Mit dem Toy den Rachen entspannen üben',
          somaticZone: 'head_mouth',
          equipmentTags: ['dildo'],
          restraintLayer: 0
        },
        {
          id: 68,
          type: 'scale',
          title: 'Deepthroat (Tiefe Rachenaufnahme)',
          desc: 'Was es ist: Den Penis ganz tief bis in den Rachen gleiten lassen und die feste Enge spüren.\nWas daran anmacht: Für den Mann die warme, feste Umklammerung des Rachens; für den Nehmenden der Triumph über den eigenen Würgereflex.',
          r1Label: 'Tief in den Rachen gleiten',
          r2Label: 'Den Penis ganz tief aufnehmen',
          somaticZone: 'head_mouth',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 69,
          type: 'scale',
          title: 'Face-Fucking (Aktives Führen des Beckens)',
          desc: 'Was es ist: Der führende Part hält den Kopf des Partners und bestimmt Rhythmus und Tiefe der Stöße im Mund.\nWas daran anmacht: Pure dominante Besitznahme; der Mund wird vollständig zur erotischen Öffnung.',
          r1Label: 'Den Kopf halten & im Mund führen',
          r2Label: 'Den Kopf halten lassen & aufnehmen',
          somaticZone: 'head_mouth',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 70,
          type: 'scale',
          title: 'Speichel als warmes Gleitmittel nutzen',
          desc: 'Was es ist: Reichlich warmen Speichel beim Oralverkehr über Schaft, Eichel oder Vulva fließen lassen.\nWas daran anmacht: Feucht, warm und animalisch; verstärkt das akustische Schmatzen der Lust.',
          r1Label: 'Mit viel Speichel benetzen & lieben',
          r2Label: 'Den nassen Speichelfluss genießen',
          somaticZone: 'genital_core',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 71,
          type: 'scale',
          title: 'Oralverkehr bis zum Höhepunkt (Orgasmus im Mund)',
          desc: 'Was es ist: Den Partner ohne Unterbrechung mit dem Mund zum Orgasmus bringen.\nWas daran anmacht: Den vollen Höhepunkt des Partners unmittelbar mit Lippen und Zunge schmecken und spüren.',
          r1Label: 'Den Partner mit den Lippen zum Orgasmus führen',
          r2Label: 'Im Mund des Partners zum Orgasmus kommen',
          somaticZone: 'head_mouth',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 72,
          type: 'scale',
          title: 'Samen schlucken nach dem Blowjob',
          desc: 'Was es ist: Das Ejakulat nach dem Höhepunkt des Mannes direkt im Mund empfangen und schlucken.\nWas daran anmacht: Ultimatives Bekenntnis zur Intimität und das rückhaltlose Annehmen der Essenz des Mannes.',
          r1Label: 'Im Mund ejakulieren dürfen',
          r2Label: 'Das Sperma im Mund aufnehmen & schlucken',
          somaticZone: 'head_mouth',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 73,
          type: 'scale',
          title: 'Ejakulation auf Gesicht oder Brust (Facial)',
          desc: 'Was es ist: Den Höhepunkt des Mannes auf den Lippen, Wangen oder dem Dekolleté platzieren.\nWas daran anmacht: Visuelle Markierung und das heiße Gefühl des Ejakulats auf der nackten Haut.',
          r1Label: 'Auf Gesicht oder Brust kommen',
          r2Label: 'Das Ejakulat auf der Haut empfangen',
          somaticZone: 'head_face',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 74,
          type: 'scale',
          title: 'Augenkontakt beim Blowjob halten',
          desc: 'Was es ist: Beim Oralverkehr ununterbrochen nach oben schauen und dem Partner in die Augen blicken.\nWas daran anmacht: Verbindet die körperliche Dienstbarkeit mit stolzem, selbstbewusstem Blickkontakt.',
          r1Label: 'Den Blick von oben erwidern',
          r2Label: 'Von unten tief in die Augen schauen',
          somaticZone: 'head_eyes',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 75,
          type: 'choice',
          title: 'Deine Haltung zu Sperma im Mund',
          desc: 'Wie stehst du persönlich zum Geschmack und Schlucken von Ejakulat?',
          question: 'Wie gehst du am liebsten mit dem Samenerguss um?',
          somaticZone: 'head_mouth',
          options: [
            { val: 'swallow', label: 'Ich schlucke das Ejakulat gerne & vollkommen selbstverständlich' },
            { val: 'skin', label: 'Lieber auf Bauch, Brust oder im Taschentuch' },
            { val: 'spit', label: 'Im Mund empfangen ja, aber danach ausspülen' },
            { val: 'none', label: 'Sperma im Mund mag ich überhaupt nicht' }
          ]
        }
      ]
    },

    {
      id: 7,
      slug: 'chapter_07_orgasm_control_edging',
      title: 'Kapitel 7: Orgasmussteuerung, Edging & Tease/Denial',
      desc: 'Das Spiel mit der Geduld: Den Höhepunkt hinauszögern, Reize entziehen und die Lust auf die Spitze treiben.',
      items: [
        {
          id: 76,
          type: 'scale',
          title: 'Start-Stop-Technik (Edging an der Kante)',
          desc: 'Was es ist: Heranführen an die Schwelle des Orgasmus, abruptes Stoppen aller Berührung und wieder von vorne beginnen.\nWas daran anmacht: Maximiert die dopaminerge Vorfreude; jeder neue Anlauf fühlt sich noch intensiver an.',
          r1Label: 'Den Partner an die Kante führen & stoppen',
          r2Label: 'An der Kante anhalten & abkühlen müssen',
          somaticZone: 'genital_core',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 77,
          type: 'scale',
          title: 'Multiples Edging vor der Freigabe',
          desc: 'Was es ist: Mindestens drei- bis fünfmal kurz vor den Höhepunkt gebracht werden, bevor der Orgasmus erlaubt wird.\nWas daran anmacht: Verlangt Beherrschung und Hingabe; der erlösende Orgasmus wird unvergleichlich wuchtiger.',
          r1Label: 'Den Partner mehrfach edgen & zappeln lassen',
          r2Label: 'Mehrmals kurz vor dem Höhepunkt gestoppt werden',
          somaticZone: 'genital_core',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 78,
          type: 'scale',
          title: 'Ruinierter Orgasmus (Ruined Orgasm)',
          desc: 'Was es ist: Im exakten Moment des Beginns der Ejakulation jede Berührung stoppen – Muskeln zucken, aber die Lust verpufft.\nWas daran anmacht: Für den Top die absolute Macht über die Lust; für den Bottom die Verwirrung zwischen Ejakulation und Frustration.',
          r1Label: 'Den Höhepunkt gezielt ruinieren & zusehen',
          r2Label: 'Den ruinierten Orgasmus hinnehmen müssen',
          somaticZone: 'genital_penile',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 79,
          type: 'scale',
          title: 'Orgasmus-Verbot für mehrere Tage',
          desc: 'Was es ist: Eine feste Vereinbarung: Der Partner darf sich für 3, 5 oder 7 Tage weder selbst noch durch Sex erleichtern.\nWas daran anmacht: Die sexuelle Spannung baut sich über Tage auf; der Partner wird aufmerksam, folgsam und anhänglich.',
          r1Label: 'Das Orgasmus-Verbot fest verhängen',
          r2Label: 'Das Verbot geduldig einhalten & Sehnsucht spüren',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 80,
          type: 'scale',
          title: 'Verbot der Selbstbefriedigung (Solo-Verbot)',
          desc: 'Was es ist: Keine Hand an sich selbst legen; jede sexuelle Entladung findet ausschließlich durch den Partner statt.\nWas daran anmacht: Der Top wird zum alleinigen Torwächter der sexuellen Befriedigung.',
          r1Label: 'Die alleinige Kontrolle über die Lust beanspruchen',
          r2Label: 'Die Hände von sich selbst weglassen',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 81,
          type: 'scale',
          title: 'Erlaubnis erbitten vor dem Kommen',
          desc: 'Was es ist: Wenn der Höhepunkt naht, innehalten und laut fragen: „Darf ich kommen?“ – und auf das Nicken warten.\nWas daran anmacht: Unterwirft den stärksten körperlichen Reflex dem Willen des partnerschaftlichen Führers.',
          r1Label: 'Die Erlaubnis einfordern & erteilen',
          r2Label: 'Artig um Erlaubnis bitten',
          somaticZone: 'head_mouth',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 82,
          type: 'scale',
          title: 'Weiterstreicheln nach dem Orgasmus (Überreizung)',
          desc: 'Was es ist: Direkt nach dem Höhepunkt weitermachen; die überempfindliche Eichel oder Klitoris weiter berühren.\nWas daran anmacht: Grenzerfahrung zwischen Kitzeln, Schmerz und extremer Nachbeben-Sensibilität.',
          r1Label: 'Nach dem Höhepunkt weitermachen',
          r2Label: 'Die intensive Überempfindlichkeit ertragen',
          somaticZone: 'genital_core',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 83,
          type: 'scale',
          title: 'Orgasmus auf Zählkommando (Countdown)',
          desc: 'Was es ist: Der Partner zählt langsam von 5 rückwärts: Bei „Eins“ muss der Höhepunkt erreicht sein, sonst Stopp.\nWas daran anmacht: Fokussierter Leistungs- und Gehorsamsdruck auf den Punkt.',
          r1Label: 'Den Countdown laut & fordernd zählen',
          r2Label: 'Auf den Zähltakt hin zum Orgasmus kommen',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 84,
          type: 'scale',
          title: 'Langsame Plateaus statt schneller Entladung',
          desc: 'Was es ist: Über eine Stunde auf mittlerer Erregungsstufe verweilen, ohne jemals an die Kante zu stoßen.\nWas daran anmacht: Schulen von Ausdauer und tiefem Körpergefühl statt schnellem Orgasmus-Konsum.',
          r1Label: 'Das Plateau ruhig & gleichmäßig steuern',
          r2Label: 'Auf dem Plateau verweilen & genießen',
          somaticZone: 'pelvis_core',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 85,
          type: 'scale',
          title: 'Einen Orgasmus verweigern (Denial nach Session)',
          desc: 'Was es ist: Nach einer langen Session den Partner heiß machen, aber am Ende ohne Erleichterung ins Bett schicken.\nWas daran anmacht: Das prickelnde Gefühl, unvollendet schlafen zu gehen; die Vorfreude brennt die ganze Nacht weiter.',
          r1Label: 'Die Erlösung für heute ganz verweigern',
          r2Label: 'Ungelöst ins Bett gehen & Sehnsucht mitnehmen',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 86,
          type: 'scale',
          title: 'Funk-Vibrator beim Kochen oder Fernsehen tragen',
          desc: 'Was es ist: Ein kleines Toy tragen, dessen Fernbedienung der Partner in der Hand hält und unberechenbar steuert.\nWas daran anmacht: Machtausübung im beiläufigen Alltag; der Bottom weiß nie, wann der nächste Impuls kommt.',
          r1Label: 'Die Fernbedienung beiläufig bedienen',
          r2Label: 'Das Toy tragen & auf die Knöpfe warten',
          somaticZone: 'genital_core',
          equipmentTags: ['vibrator'],
          restraintLayer: 1
        },
        {
          id: 87,
          type: 'scale',
          title: 'Gezieltes Weitermachen bei Tränen der Erregung',
          desc: 'Was es ist: Wenn durch das lange Aufschieben Tränen der Überforderung fließen, liebevoll und sanft weiterteasen.\nWas daran anmacht: Tiefe seelische Katharsis; die Grenzen des Egos brechen im Lustrausch auf.',
          r1Label: 'Die Tränen sehen & behutsam weiterführen',
          r2Label: 'Die Gefühle laufen lassen & weitergeführt werden',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 88,
          type: 'scale',
          title: 'Befehl zum Stillhalten beim Orgasmus',
          desc: 'Was es ist: Im Moment des Höhepunkts vollkommen reglos daliegen müssen; kein Strampeln erlaubt.\nWas daran anmacht: Volle Beherrschung über unwillkürliche Muskelzuckungen; Disziplin bis zur letzten Sekunde.',
          r1Label: 'Das Stillhalten beim Höhepunkt anordnen',
          r2Label: 'Reglos daliegen, während der Körper bebt',
          somaticZone: 'full_body',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 89,
          type: 'scale',
          title: 'Hand auf den Mund beim Höhepunkt',
          desc: 'Was es ist: Dem Partner die flache Hand fest auf den Mund legen, sodass der Schrei gedämpft wird.\nWas daran anmacht: Physische Kontrolle über die Stimme; das Stöhnen wird in die Handfläche gepresst.',
          r1Label: 'Die Hand auf den Mund legen & dämpfen',
          r2Label: 'In die Handfläche stöhnen müssen',
          somaticZone: 'head_mouth',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 90,
          type: 'scale',
          title: 'Multipler Orgasmus für die Frau einfordern',
          desc: 'Was es ist: Die Partnerin nach dem ersten Höhepunkt nicht ruhen lassen, sondern direkt zum zweiten und dritten führen.\nWas daran anmacht: Vollkommene Ausreizung der weiblichen Lustkapazität ohne Pause.',
          r1Label: 'Geduldig bis zum nächsten Orgasmus leiten',
          r2Label: 'Mehrere Höhepunkte hintereinander empfangen',
          somaticZone: 'genital_vulva_clitoris',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 91,
          type: 'scale',
          title: 'Prostata-Orgasmus ohne Penis-Berührung',
          desc: 'Was es ist: Den Mann allein durch innere Massage der Prostata zum Höhepunkt bringen, ohne den Penis anzufassen.\nWas daran anmacht: Vollkommen andere, tiefere Orgasmus-Qualität, die den Mann in tiefe Demut versetzt.',
          r1Label: 'Den reinen Prostata-Höhepunkt steuern',
          r2Label: 'Den tiefen Orgasmus von innen erleben',
          somaticZone: 'anal_perineum',
          equipmentTags: ['prostate_massager'],
          restraintLayer: 1
        },
        {
          id: 92,
          type: 'scale',
          title: 'Aufschreiben der Tage ohne Orgasmus (Tagebuch)',
          desc: 'Was es ist: In einem kleinen Kalender festhalten, wann der letzte Orgasmus war und wie lange gewartet wurde.\nWas daran anmacht: Sichtbare Dokumentation von Disziplin und Enthaltsamkeit.',
          r1Label: 'Das Lust-Tagebuch prüfen & führen',
          r2Label: 'Die Tage zählen & im Heft festhalten',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 93,
          type: 'choice',
          title: 'Umgang mit versehentlichen Höhepunkten',
          desc: 'Was passiert, wenn jemand trotz Stopp-Kommando versehentlich doch gekommen ist?',
          question: 'Wie geht ihr mit einem versehentlichen Ausrutscher um?',
          somaticZone: 'psyche_mind',
          options: [
            { val: 'hug', label: 'Lachen, in den Arm nehmen – absolut kein Vorwurf' },
            { val: 'chores', label: 'Eine kleine spielerische Strafe (z. B. Fußmassage für den Partner)' },
            { val: 'longer_denial', label: 'Die Wartezeit bis zum nächsten Mal verlängert sich' }
          ]
        },
        {
          id: 94,
          type: 'scale',
          title: 'Einen Orgasmus durch Belohnung verdienen',
          desc: 'Was es ist: Der Höhepunkt wird erst gewährt, wenn eine vereinbarte Aufgabe oder Pflicht erledigt wurde.\nWas daran anmacht: Verknüpft alltägliche Pflichterfüllung direkt mit der höchsten sexuellen Belohnung.',
          r1Label: 'Die Belohnung an eine Aufgabe knüpfen',
          r2Label: 'Sich die Erlösung fleißig verdienen',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 95,
          type: 'scale',
          title: 'Sehr langsamer Aufbau über zwei Stunden',
          desc: 'Was es ist: Sich zwei Stunden Zeit nehmen, um die Erregung Stufe für Stufe zu heben.\nWas daran anmacht: Königsklasse der Geduld; hebt die Sensibilität auf ein Maximum.',
          r1Label: 'Die zwei Stunden mit Ruhe dirigieren',
          r2Label: 'Zwei Stunden lang die Spannung aufbauen lassen',
          somaticZone: 'pelvis_core',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 96,
          type: 'scale',
          title: 'Nippel-Stimulation beim Orgasmus',
          desc: 'Was es ist: Genau im Moment des Kommens die Brustwarzen fest zwischen den Fingern zwirbeln oder ziehen.\nWas daran anmacht: Doppelter sensorischer Reiz, der den Orgasmus explosionsartig verstärkt.',
          r1Label: 'Im Höhepunkt fest an den Nippeln drehen',
          r2Label: 'Den doppelten Reiz an Nippeln & Genital spüren',
          somaticZone: 'chest_nipples',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 97,
          type: 'scale',
          title: 'Becken festhalten gegen ungeduldiges Stoßen',
          desc: 'Was es ist: Beide Hände fest auf die Hüften des Partners pressen, damit er sich nicht ungeduldig selbst befriedigt.\nWas daran anmacht: Körperliche Arretierung des Beckens; der Top erzwingt das Auskosten der Spannung.',
          r1Label: 'Die Hüfte festhalten & Ruhe fordern',
          r2Label: 'Fixiert daliegen & nicht zucken dürfen',
          somaticZone: 'gluteal_pelvis',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 98,
          type: 'scale',
          title: 'Sensuelles Tease & Denial mit Lippen',
          desc: 'Was es ist: Zärtliches Streicheln mit den Lippen über das Genital, aber immer einen Millimeter vor der Berührung abdrehen.\nWas daran anmacht: Reine taktile Folter im positiven Sinn; der Partner bettelt um den Kontakt.',
          r1Label: 'Ganz nah herangehen & wieder abdrehen',
          r2Label: 'Die Lippen am Körper spüren & fast verrückt werden',
          somaticZone: 'genital_core',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 99,
          type: 'scale',
          title: 'Orgasmus im Stehen an der Wand',
          desc: 'Was es ist: Den Partner an die Wand gedrückt mit den Fingern zum Zittern bringen, bis die Knie weich werden.\nWas daran anmacht: Das Nachgeben der Beinmuskeln; der Partner muss vom Top gestützt werden.',
          r1Label: 'Den Partner an der Wand zum Kommen bringen',
          r2Label: 'An der Wand stehen & weiche Knie bekommen',
          somaticZone: 'limbs_legs',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 100,
          type: 'scale',
          title: 'Kuss auf die Lippen genau beim Kommen',
          desc: 'Was es ist: Im Moment des Samenergusses oder Höhepunkts tief und innig küssen.\nWas daran anmacht: Teilt den Atem und das Beben des anderen im intimsten Sekundenbruchteil.',
          r1Label: 'Den Kuss im Orgasmus fordern & trinken',
          r2Label: 'Im Kuss vergehen & loslassen',
          somaticZone: 'head_mouth',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 101,
          type: 'scale',
          title: 'Kopf nach hinten neigen beim Orgasmus',
          desc: 'Was es ist: Die Haare sanft greifen und den Hals beim Höhepunkt strecken, um die Kehle freizugeben.\nWas daran anmacht: Erhöht die Verwundbarkeit und öffnet den Brustkorb für befreites Ausatmen.',
          r1Label: 'Den Kopf sanft nach hinten führen',
          r2Label: 'Den Hals freilegen & den Reiz spüren',
          somaticZone: 'head_neck',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 102,
          type: 'scale',
          title: 'Leises Stöhnen auf Befehl einstellen',
          desc: 'Was es ist: Mitten im schönsten Stöhnen sagen: „Ganz leise sein“ – und lauschen, wie der Partner den Atem anhält.\nWas daran anmacht: Akustischer Gehorsam unter höchster sexueller Erregung.',
          r1Label: 'Die Stille befehlen & lauschen',
          r2Label: 'Sofort verstummen & lautlos genießen',
          somaticZone: 'head_mouth',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 103,
          type: 'scale',
          title: 'Countdown-Orgasmus (Freigabe exakt bei Eins)',
          desc: 'Was es ist: Von 10 rückwärts zählen; der Partner darf sich erst bei der Zahl Eins vollkommen fallenlassen.\nWas daran anmacht: Exakte Synchronisation von Wille und körperlichem Reflex.',
          r1Label: 'Den Takt vorgeben & bei Eins erlösen',
          r2Label: 'Die Sekunden zählen & bei Eins explodieren',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 104,
          type: 'scale',
          title: 'Einen Orgasmus im Traum versprechen',
          desc: 'Was es ist: Vor dem Einschlafen ins Ohr flüstern: „Morgen früh darfst du kommen“ – und die Nacht mit Vorfreude füllen.\nWas daran anmacht: Pflanzt die Erwartung in das Unterbewusstsein für die ganze Nacht.',
          r1Label: 'Das Versprechen für den Morgen geben',
          r2Label: 'Mit der süßen Verheißung einschlafen',
          somaticZone: 'head_ears',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 105,
          type: 'choice',
          title: 'Welche Art von Orgasmus-Steuerung reizt dich am meisten?',
          desc: 'Deine persönliche Haltung zu Teasing und Hinauszögern.',
          question: 'Was macht dich beim Hinauszögern am heißesten?',
          somaticZone: 'psyche_mind',
          options: [
            { val: 'multiple_edging', label: 'Mehrfaches Edging kurz vor der Kante' },
            { val: 'denial', label: 'Mehrtägiges Verbot mit süßer Sehnsucht' },
            { val: 'command', label: 'Countdown & Erlaubnis erbitten müssen' },
            { val: 'none', label: 'Ich mag schnelles, unkompliziertes Kommen ohne Hinauszögern' }
          ]
        }
      ]
    },

    {
      id: 8,
      slug: 'chapter_08_chastity_lifestyle',
      title: 'Kapitel 8: Keuschhaltung & Lust-Erhaltung (Chastity)',
      desc: 'Freiwillige Abgabe der Schlüsselgewalt: Käfige, Zeittresore, Hygiene-Rituale und die süße Sehnsucht.',
      items: [
        {
          id: 106,
          type: 'scale',
          title: 'Den richtigen Keuschheitskäfig finden',
          desc: 'Was es ist: Passgenauer Edelstahl- oder Silikonkäfig, der bequem sitzt und im Alltag nicht drückt.\nWas daran anmacht: Die anatomische Passgenauigkeit ermöglicht langes, sicheres Tragen ohne Schmerzen.',
          r1Label: 'Den passenden Käfig aussuchen & anpassen',
          r2Label: 'Den Käfig probieren & passend sitzen haben',
          somaticZone: 'genital_penile',
          equipmentTags: ['chastity_cage'],
          restraintLayer: 1
        },
        {
          id: 107,
          type: 'scale',
          title: 'Schlüsselverwaltung am Körper der Partnerin',
          desc: 'Was es ist: Den kleinen Schlüssel an einer Halskette oder am Knöchelband immer bei sich tragen.\nWas daran anmacht: Sichtbares Zeichen ihrer alleinigen Verfügungsgewalt im Alltag.',
          r1Label: 'Den Schlüssel stolz am Körper tragen',
          r2Label: 'Wissen, dass sie den Schlüssel Tag & Nacht hat',
          somaticZone: 'psyche_mind',
          equipmentTags: ['lock'],
          restraintLayer: 0
        },
        {
          id: 108,
          type: 'scale',
          title: 'Verwahrung im Zeittresor (Kitchen Safe)',
          desc: 'Was es ist: Der Schlüssel liegt in einer Box mit Zeitschloss, die sich erst nach 24, 48 oder 72 Stunden öffnet.\nWas daran anmacht: Auch die Partnerin kann nicht spontan nachgeben; die Technik garantiert die Wartezeit.',
          r1Label: 'Die Zeit am Tresor einstellen & verriegeln',
          r2Label: 'Auf das Ticken des Zeitschlosses vertrauen',
          somaticZone: 'psyche_mind',
          equipmentTags: ['safe'],
          restraintLayer: 0
        },
        {
          id: 109,
          type: 'scale',
          title: 'Tägliche Hygiene unter Aufsicht',
          desc: 'Was es ist: Einmal am Tag wird der Käfig zum Duschen kurz geöffnet; der Partner wird gewaschen und direkt wieder verschlossen.\nWas daran anmacht: Körperliche Pflege wird zum vertrauensvollen Ritual unter strenger Aufsicht.',
          r1Label: 'Den Käfig öffnen, waschen & sofort verriegeln',
          r2Label: 'Dankbar sauber gemacht & wieder verschlossen werden',
          somaticZone: 'genital_penile',
          equipmentTags: ['syringe'],
          restraintLayer: 0
        },
        {
          id: 110,
          type: 'scale',
          title: 'Keuschheits-Regeln für das Wochenende',
          desc: 'Was es ist: Von Freitagabend bis Montagmorgen bleibt der Käfig ununterbrochen verschlossen.\nWas daran anmacht: Die freie Zeit gemeinsam verbringen, während die Männlichkeit gebannt bleibt.',
          r1Label: 'Das Wochenende unter Verschluss anordnen',
          r2Label: 'Das ganze Wochenende eingesperrt verbringen',
          somaticZone: 'genital_penile',
          equipmentTags: ['chastity_cage'],
          restraintLayer: 1
        },
        {
          id: 111,
          type: 'scale',
          title: 'Spontanes Klopfen an den Käfig im Alltag',
          desc: 'Was es ist: Beim Vorbeigehen in der Wohnung kurz mit den Fingerknöcheln gegen das Metall tippen.\nWas daran anmacht: Stumme, beiläufige Erinnerung daran, wer das Sagen hat.',
          r1Label: 'Kurz gegen den Käfig klopfen & lächeln',
          r2Label: 'Das metallische Klopfen spüren & erröten',
          somaticZone: 'genital_penile',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 112,
          type: 'scale',
          title: 'Käfig tragen im Beruf & Alltag',
          desc: 'Was es ist: Den Käfig ganz normal unter Jeans oder Anzug bei der Arbeit tragen.\nWas daran anmacht: Das geheime Doppelleben: Außen seriöser Angestellter, darunter verschlossener Sub.',
          r1Label: 'Wissen, dass er im Büro eingesperrt ist',
          r2Label: 'Im Büro eingesperrt herumlaufen',
          somaticZone: 'genital_penile',
          equipmentTags: ['chastity_cage'],
          restraintLayer: 1
        },
        {
          id: 113,
          type: 'scale',
          title: 'Kleine Erektionen im Käfig spüren',
          desc: 'Was es ist: Das Engegefühl spüren, wenn der Körper morgens gegen die Gitterstäbe drückt.\nWas daran anmacht: Die biologische Erinnerung an die eigene Begrenzung; Ausdehnung ist unmöglich.',
          r1Label: 'Sehen, wie der Käfig prall ausgefüllt wird',
          r2Label: 'Die süße Enge spüren & nicht wachsen können',
          somaticZone: 'genital_penile',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 114,
          type: 'scale',
          title: 'Schlüssel-Worship auf Knien',
          desc: 'Was es ist: Vor dem Öffnen den Schlüssel auf Knien andächtig küssen und um das Aufschließen bitten.\nWas daran anmacht: Ehrerbietung vor dem Gegenstand, der die eigene Freiheit hütet.',
          r1Label: 'Den Schlüssel zum Küssen hinhalten',
          r2Label: 'Auf Knien den Schlüssel küssen & bitten',
          somaticZone: 'head_mouth',
          equipmentTags: ['lock'],
          restraintLayer: 0
        },
        {
          id: 115,
          type: 'scale',
          title: 'Keuschheitsgürtel / Käfig tragen (Dauerverschluss)',
          desc: 'Was es ist: Abschließen des Genitals in einen festen Edelstahl- oder Silikonkäfig zur vollkommenen Orgasmusabgabe.\nWas daran anmacht: Befreit den Mann vom Zwang des ständigen Ejakulationsdrucks; kanalisiert Energie in Dienstbereitschaft.',
          r1Label: 'Schlüssel verwalten & Käfig prüfen',
          r2Label: 'Im Käfig eingeschlossen sein',
          somaticZone: 'genital_penile',
          equipmentTags: ['chastity_cage'],
          restraintLayer: 1
        },
        {
          id: 116,
          type: 'scale',
          title: 'Siegelband oder Minischloss mit Nummer',
          desc: 'Was es ist: Ein nummeriertes Einweg-Siegel am Verschlussring zur Manipulationskontrolle.\nWas daran anmacht: Lückenlose Überprüfbarkeit; Betrug ist unmöglich.',
          r1Label: 'Das Siegel anbringen & Nummer notieren',
          r2Label: 'Das intakte Siegel morgens vorzeigen',
          somaticZone: 'genital_penile',
          equipmentTags: ['seals'],
          restraintLayer: 1
        },
        {
          id: 117,
          type: 'scale',
          title: 'Teasing des Keuschlings durch das Gitter',
          desc: 'Was es ist: Gezieltes Erregen und Necken durch die Gitterstäbe des Käfigs.\nWas daran anmacht: Gierige Lust erzeugen, die sich im Metall staut und nicht entladen kann.',
          r1Label: 'Im Käfig heiß machen & necken',
          r2Label: 'Im Käfig gequält & erregt werden',
          somaticZone: 'genital_penile',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 118,
          type: 'scale',
          title: 'Vibrator an die Gitterstäbe halten',
          desc: 'Was es ist: Ein vibrierendes Toy von außen an den Käfig drücken; die Vibration überträgt sich durch das Material.\nWas daran anmacht: Elektrisierendes Kribbeln am gesamten Glied ohne Schaftberührung.',
          r1Label: 'Den Vibrator an das Metall halten',
          r2Label: 'Das Kribbeln durch die Gitterstäbe spüren',
          somaticZone: 'genital_penile',
          equipmentTags: ['vibrator'],
          restraintLayer: 0
        },
        {
          id: 119,
          type: 'scale',
          title: 'Diskreter Schlüssel-Anhänger als Kette',
          desc: 'Was es ist: Den zierlichen Messingschlüssel als unauffälligen Schmuckanhänger im Alltag um den Hals tragen.\nWas daran anmacht: Ein edles Geheimnis auf dem Dekolleté, das für Außenstehende wie normaler Schmuck wirkt.',
          r1Label: 'Den Schlüssel als Schmuckstück tragen',
          r2Label: 'Ihren Halsschmuck sehen & Bescheid wissen',
          somaticZone: 'torso_skin',
          equipmentTags: ['lock'],
          restraintLayer: 0
        },
        {
          id: 120,
          type: 'scale',
          title: 'Lange Keuschheitsphase (Über zwei Wochen)',
          desc: 'Was es ist: Mehrere Wochen am Stück keusch bleiben; der Körper stellt sich ganz auf die Führung ein.\nWas daran anmacht: Echter neurobiologischer Subspace: Die Gedanken kreisen nicht mehr um Sex, sondern um die Herrin.',
          r1Label: 'Die mehrwöchige Phase anordnen & begleiten',
          r2Label: 'Wochenlang keusch leben & Ruhe finden',
          somaticZone: 'psyche_mind',
          equipmentTags: ['chastity_cage'],
          restraintLayer: 1
        },
        {
          id: 121,
          type: 'scale',
          title: 'Spontane Erleichterung ohne Öffnen (Ruiniert im Käfig)',
          desc: 'Was es ist: Den Partner durch den Käfig zum Höhepunkt bringen, ohne dass das Metall abgenommen wird.\nWas daran anmacht: Muskelzucken im Käfig; danach muss das Toy gereinigt werden.',
          r1Label: 'Den Orgasmus durch das Gitter erzwingen',
          r2Label: 'Im Käfig zum Höhepunkt kommen & reinigen',
          somaticZone: 'genital_penile',
          equipmentTags: [],
          restraintLayer: 1
        },
        {
          id: 122,
          type: 'scale',
          title: 'Käfigwechsel zwischen Edelstahl und Nylon',
          desc: 'Was es ist: Je nach Anlass (Sport, Reise, Nacht) zwischen leichtem Resin und schwerem Metall wechseln.\nWas daran anmacht: Anpassung der Disziplin an den Alltag; jedes Material fühlt sich anders an.',
          r1Label: 'Das passende Modell für den Tag bestimmen',
          r2Label: 'Das gewählte Modell anlegen lassen',
          somaticZone: 'genital_penile',
          equipmentTags: ['chastity_cage'],
          restraintLayer: 1
        },
        {
          id: 123,
          type: 'scale',
          title: 'Nackt vor ihr stehen mit verschlossenem Käfig',
          desc: 'Was es ist: Abends im Schlafzimmer nackt vor der Partnerin stehen und sich mustern lassen.\nWas daran anmacht: Volle Entblößung bei gleichzeitiger Versiegelung der eigenen Männlichkeit.',
          r1Label: 'Den verschlossenen Partner mustern',
          r2Label: 'Nackt mit Käfig daliegen oder stehen',
          somaticZone: 'full_body',
          equipmentTags: ['chastity_cage'],
          restraintLayer: 1
        },
        {
          id: 124,
          type: 'scale',
          title: 'Keuschheit als Liebesgeschenk verstehen',
          desc: 'Was es ist: Die Schlüsselabgabe nicht als Strafe, sondern als Vertrauensbeweis und Hingabe erleben.\nWas daran anmacht: Wandelt Enthaltsamkeit in ein zutiefst verbindendes partnerschaftliches Bündnis um.',
          r1Label: 'Die Hingabe als wertvolles Geschenk annehmen',
          r2Label: 'Die eigene Lust gerne in ihre Hände legen',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 125,
          type: 'scale',
          title: 'Schlüssel an einem geheimen Ort verstecken',
          desc: 'Was es ist: Der Schlüssel liegt in der Wohnung versteckt; nur die Partnerin weiß, wo er ist.\nWas daran anmacht: Das Bewusstsein, dass der Schlüssel nah und doch unerreichbar ist.',
          r1Label: 'Das Versteck aussuchen & geheim halten',
          r2Label: 'Wissen, dass man den Schlüssel nie fände',
          somaticZone: 'psyche_mind',
          equipmentTags: ['lock'],
          restraintLayer: 0
        },
        {
          id: 126,
          type: 'scale',
          title: 'Öffnen als festliche Zeremonie mit Musik',
          desc: 'Was es ist: Das Aufschließen nach langer Zeit mit Kerzen, Badewanne und feierlicher Vorfreude zelebrieren.\nWas daran anmacht: Macht das Ende der Fastenzeit zu einem unvergesslichen Höhepunkt der Liebe.',
          r1Label: 'Das Aufschließen feierlich inszenieren',
          r2Label: 'Auf Knien die Erlösung empfangen',
          somaticZone: 'genital_penile',
          equipmentTags: ['lock'],
          restraintLayer: 0
        },
        {
          id: 127,
          type: 'scale',
          title: 'Nach dem Aufschließen direkt wieder absperren',
          desc: 'Was es ist: Kurz herauslassen, prüfen, ein paar Minuten streicheln und direkt wieder verriegeln.\nWas daran anmacht: Ein Hauch von Freiheit, der sofort wieder unter die feste Führung gestellt wird.',
          r1Label: 'Kurz herauslassen & wieder einsperren',
          r2Label: 'Die kurze Freiheit spüren & zurück ins Schloss',
          somaticZone: 'genital_penile',
          equipmentTags: ['chastity_cage'],
          restraintLayer: 1
        },
        {
          id: 128,
          type: 'scale',
          title: 'Spontane Schloss-Inspektion im Alltag',
          desc: 'Was es ist: Unterwegs auf einer Party oder beim Spaziergang kurz unter den Stoff greifen und prüfen, ob das Schloss sitzt.\nWas daran anmacht: Geheime Besitzanzeige unter den Augen ahnungsloser Dritter.',
          r1Label: 'Schloss unterwegs kontrollieren',
          r2Label: 'Unterwegs geprüft werden',
          somaticZone: 'genital_penile',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 129,
          type: 'scale',
          title: 'Sicherheit: Der Notfallschlüssel im Umschlag',
          desc: 'Was es ist: Ein Ersatzschlüssel liegt versiegelt im Schrank für echte medizinische Notfälle.\nWas daran anmacht: Gewährleistet das RACK-Prinzip; schützt vor Panik durch feste Notfall-Option.',
          r1Label: 'Den Notfallumschlag sicher verwahren',
          r2Label: 'Wissen, dass im echten Notfall Hilfe da ist',
          somaticZone: 'psyche_mind',
          equipmentTags: ['safe'],
          restraintLayer: 0
        },
        {
          id: 130,
          type: 'choice',
          title: 'Wie lange Keuschheit kannst du dir vorstellen?',
          desc: 'Deine persönliche zeitliche Wohlfühlgrenze bei Keuschhaltung.',
          question: 'Welcher Zeitraum fühlt sich für dich reizvoll an?',
          somaticZone: 'psyche_mind',
          options: [
            { val: 'weekend', label: 'Nur für ein langes Wochenende (2 bis 3 Tage)' },
            { val: 'week', label: 'Ein bis zwei Wochen am Stück' },
            { val: 'longterm', label: 'Langzeit-Keuschheit (Mehrere Wochen bis Monate)' },
            { val: 'none', label: 'Käfige oder Keuschheit interessieren mich gar nicht' }
          ]
        }
      ]
    },

    {
      id: 9,
      slug: 'chapter_09_female_lingerie',
      title: 'Kapitel 9: Garderobe & Lingerie (Frau)',
      desc: 'Feine Stoffe, Spitze und Seide: Die visuelle Verführung durch edle Reizwäsche und Haltungskorsetts.',
      items: [
        {
          id: 131,
          type: 'scale',
          title: 'Feine Spitzen-Dessous & Bodys',
          desc: 'Was es ist: Hochwertige schwarze oder weinrote Spitze, die die weiblichen Kurven betont.\nWas daran anmacht: Die Frau fühlt sich begehrt und unwiderstehlich; für den Partner ein Fest für die Augen.',
          r1Label: 'Die Spitzenwäsche am Körper bewundern',
          r2Label: 'Spitzenwäsche tragen & sich begehrt fühlen',
          somaticZone: 'torso_skin',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 132,
          type: 'scale',
          title: 'Halterlose Strümpfe mit Naht (Stay-Ups)',
          desc: 'Was es ist: Feine Strümpfe mit sichtbarer Rücken-Naht und breitem Spitzenband am Oberschenkel.\nWas daran anmacht: Klassische Erotik; streckt die Beine optisch und fühlt sich seidig glatt an.',
          r1Label: 'Über die seidenen Beine streichen',
          r2Label: 'Die feinen Strümpfe tragen',
          somaticZone: 'limbs_legs',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 133,
          type: 'scale',
          title: 'Klassischer Strapsgürtel mit Metall-Clips',
          desc: 'Was es ist: Ein Strumpfgürtel mit vier oder sechs verstellbaren Riemchen, der die Strümpfe straff hält.\nWas daran anmacht: Das Geräusch und Spannen der Riemen; purer Vintage-Luxus.',
          r1Label: 'Die Riemchen an den Strümpfen einhaken',
          r2Label: 'Den Strapsgürtel an der Taille spüren',
          somaticZone: 'gluteal_pelvis',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 134,
          type: 'scale',
          title: 'Ouvert-Höschen (Unten offen)',
          desc: 'Was es ist: Spitzenunterwäsche mit offener Schamzone, die beim Sex komplett anbehalten werden kann.\nWas daran anmacht: Direkter Zugang zur Lust, ohne den Zauber der Kleidung abzustreifen.',
          r1Label: 'Direkt durch den Stoff zugreifen',
          r2Label: 'Das Ouvert-Höschen tragen & bereit sein',
          somaticZone: 'genital_core',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 135,
          type: 'scale',
          title: 'High Heels & Stilettos im Bett',
          desc: 'Was es ist: Hohe Absätze im Bett anbehalten, die Beine anwinkeln und die Haltung formen.\nWas daran anmacht: Verändert die Körperstatik, betont die Waden und erzeugt ein starkes Dominanzgefühl.',
          r1Label: 'Die Beine mit den Absätzen führen',
          r2Label: 'High Heels im Bett tragen & posieren',
          somaticZone: 'limbs_ankles_feet',
          equipmentTags: ['boots'],
          restraintLayer: 0
        },
        {
          id: 136,
          type: 'scale',
          title: 'Hauchdünnes Seiden-Negligé',
          desc: 'Was es ist: Fließende Maulbeerseide, die sanft über die Kurven gleitet und leicht durchscheinend ist.\nWas daran anmacht: Schwereloser Stoff auf der Haut; verhüllt und offenbart zugleich.',
          r1Label: 'Über den fließenden Seidenstoff streicheln',
          r2Label: 'Im Seidenhemdchen verführt werden',
          somaticZone: 'torso_skin',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 137,
          type: 'scale',
          title: 'Leder- oder Satin-Harness über der Wäsche',
          desc: 'Was es ist: Feine Riemchen, die Brust und Dekolleté geometrisch einrahmen.\nWas daran anmacht: Moderner Fetisch-Look; betont die Oberkörperkonturen mit scharfen Linien.',
          r1Label: 'Das Harness anpassen & bewundern',
          r2Label: 'Die Riemchen am Oberkörper tragen',
          somaticZone: 'chest_nipples',
          equipmentTags: ['harness'],
          restraintLayer: 0
        },
        {
          id: 138,
          type: 'scale',
          title: 'Echtschnür-Korsett mit Stahlstäben',
          desc: 'Was es ist: Ein festes Taillenkorsett, das mit Kordeln eng geschnürt wird und eine aufrechte Haltung erzwingt.\nWas daran anmacht: Feste somatische Kompression der Taille; zwingt zu stolzer, aufrechter Haltung.',
          r1Label: 'Das Korsett fest am Rücken schnüren',
          r2Label: 'Geschnürt werden & die feste Haltung spüren',
          somaticZone: 'torso_flanks',
          equipmentTags: ['corset'],
          restraintLayer: 1
        },
        {
          id: 139,
          type: 'scale',
          title: 'Feinstrumpfhose zerschneiden beim Sex',
          desc: 'Was es ist: Mit einer Schere behutsam den Schritt der Strumpfhose öffnen, während sie getragen wird.\nWas daran anmacht: Tabubruch des bewussten Zerstörens; kalte Scherenspitze trifft warmen Stoff.',
          r1Label: 'Den Stoff mit der Schere vorsichtig öffnen',
          r2Label: 'Stillhalten, während der Stoff geschnitten wird',
          somaticZone: 'genital_core',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 140,
          type: 'scale',
          title: 'Gemeinsames Einkaufen von Reizwäsche',
          desc: 'Was es ist: Zusammen ein Wäschegeschäft besuchen und gemeinsam Stücke für den Abend auswählen.\nWas daran anmacht: Geteilte Vorfreude in der Öffentlichkeit; der Einkauf wird zum Vorspiel.',
          r1Label: 'Die Wäsche mit aussuchen & bezahlen',
          r2Label: 'Anprobieren & vor dem Spiegel präsentieren',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 141,
          type: 'scale',
          title: 'Garderoben-Diktat durch den Partner',
          desc: 'Was es ist: Der Partner wählt morgens aus, welche Unterwäsche heute getragen wird.\nWas daran anmacht: Das Bewusstsein, den ganzen Tag den Willen des anderen auf der Haut zu tragen.',
          r1Label: 'Die Wäsche für den Tag herauslegen',
          r2Label: 'Die gewählte Wäsche tragen & daran denken',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 142,
          type: 'scale',
          title: 'Nass-Optik & Wet-Look Wäsche',
          desc: 'Was es ist: Glänzende, schwarze Stoffe, die wie nass auf der Haut wirken und die Form scharf zeichnen.\nWas daran anmacht: Kühler Glanz und futuristische Ästhetik.',
          r1Label: 'Die glänzende Wet-Look-Optik mustern',
          r2Label: 'Im Wet-Look-Body verführen',
          somaticZone: 'torso_skin',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 143,
          type: 'scale',
          title: 'Morgenmantel aus reiner Seide',
          desc: 'Was es ist: Ein weiter Kimono oder Seidenmantel, der nur mit einem Gürtel locker gebunden ist.\nWas daran anmacht: Das fließende Gleiten des Stoffs und der schnelle Zugriff mit einem Handgriff.',
          r1Label: 'Den Gürtel des Mantels langsam lösen',
          r2Label: 'Den Mantel fallen lassen & nackt sein',
          somaticZone: 'full_body',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 144,
          type: 'scale',
          title: 'Rote Sohlen & Luxus-Schuhe',
          desc: 'Was es ist: Elegante Designer-Pumps, die im Schlafzimmer feierlich getragen werden.\nWas daran anmacht: Das Klacken der Absätze auf dem Parkett als erotischer Auftakt.',
          r1Label: 'Die Schuhe bewundern & ausziehen',
          r2Label: 'Die Schuhe andächtig tragen',
          somaticZone: 'limbs_ankles_feet',
          equipmentTags: ['boots'],
          restraintLayer: 0
        },
        {
          id: 145,
          type: 'choice',
          title: 'Welcher Wäsche-Stil gefällt dir an ihr am besten?',
          desc: 'Deine persönliche Lieblings-Richtung bei Damen-Dessous.',
          question: 'Welche Art von Lingerie findest du am reizvollsten?',
          somaticZone: 'torso_skin',
          options: [
            { val: 'lace', label: 'Edle, romantische Spitze & Seide' },
            { val: 'straps', label: 'Feste Strapsen, Ouvert-Slips & High Heels' },
            { val: 'corset', label: 'Streng geschnürtes Echtschnür-Korsett' },
            { val: 'leather_wet', label: 'Schwarzes Leder, Wet-Look & Riemchen-Harness' }
          ]
        }
      ]
    },

    {
      id: 10,
      slug: 'chapter_10_male_fetish',
      title: 'Kapitel 10: Fetischbekleidung & Rollen-Accessoires (Mann)',
      desc: 'Maskuline Akzente: Sportliche Jockstraps, feine Maßanzüge, Lederjeans und formale Dienstkleidung.',
      items: [
        {
          id: 146,
          type: 'scale',
          title: 'Sportlicher Jockstrap (Po frei)',
          desc: 'Was es ist: Sport-Jockstrap mit breitem Bund, der das Gemächt stützt und das Gesäß komplett freigibt.\nWas daran anmacht: Betont die männlichen Gesäßmuskeln und bietet freien Zugriff für Berührungen oder Spanking.',
          r1Label: 'Den Mann im Jockstrap bewundern & Po greifen',
          r2Label: 'Den Jockstrap tragen & Po präsentieren',
          somaticZone: 'gluteal_pelvis',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 147,
          type: 'scale',
          title: 'Leder-Brustgeschirr (Chest Harness)',
          desc: 'Was es ist: Schwarze Lederriemen über Schultern und Brustkorb, die den Oberkörper markant betonen.\nWas daran anmacht: Hebt Brust- und Schultermuskulatur hervor; bietet feste Haltegriffe für den Partner.',
          r1Label: 'Das Geschirr am Mann anpassen & greifen',
          r2Label: 'Das Ledergeschirr auf nackter Haut tragen',
          somaticZone: 'chest_nipples',
          equipmentTags: ['harness'],
          restraintLayer: 0
        },
        {
          id: 148,
          type: 'scale',
          title: 'Eleganter Maßanzug mit Krawatte',
          desc: 'Was es ist: Dunkler Anzug, weißes Hemd und Krawatte beim Vorspiel.\nWas daran anmacht: Gesellschaftliches Machtsymbol; stilvolle Dominanz eines Mannes mit Haltung.',
          r1Label: 'Den Mann im Anzug verführen',
          r2Label: 'Im Maßanzug auftreten & dominieren',
          somaticZone: 'full_body',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 149,
          type: 'scale',
          title: 'Nackt mit Krawatte oder Fliege servieren',
          desc: 'Was es ist: Der Mann serviert Getränke vollkommen nackt, trägt dabei aber förmlich Kragen und Krawatte.\nWas daran anmacht: Das humorvoll-erotische Gefälle zwischen formaler Etikette und nackter Schamlosigkeit.',
          r1Label: 'Sich vom nackten Mann mit Krawatte bedienen lassen',
          r2Label: 'Nackt mit Krawatte das Tablett tragen',
          somaticZone: 'full_body',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 150,
          type: 'scale',
          title: 'Breite Leder-Armmanschetten am Handgelenk',
          desc: 'Was es ist: Schwere Lederarmbänder mit Schnallen, die die Handgelenke markant einrahmen.\nWas daran anmacht: Maskulin und kraftvoll; verleiht den Händen optische Schwere.',
          r1Label: 'Die Armmanschetten am Mann bewundern',
          r2Label: 'Die schweren Manschetten an den Armen spüren',
          somaticZone: 'limbs_hands_wrists',
          equipmentTags: ['cuffs'],
          restraintLayer: 0
        },
        {
          id: 151,
          type: 'scale',
          title: 'Enges Leder- oder Silikon-Hodenband',
          desc: 'Was es ist: Ein Riemen, der die Hoden sanft nach unten zieht und das Glied optisch hervorhebt.\nWas daran anmacht: Hält die Hoden prall nach unten und verstärkt das Gefühl sexueller Reife.',
          r1Label: 'Das Band um die Hoden legen',
          r2Label: 'Das Hodenband tragen & die Schwere spüren',
          somaticZone: 'genital_testicles',
          equipmentTags: ['ball_stretcher'],
          restraintLayer: 1
        },
        {
          id: 152,
          type: 'scale',
          title: 'Schwere Biker-Lederjeans ohne Unterwäsche',
          desc: 'Was es ist: Echte, schwere Lederhose auf nackter Haut, die beim Gehen knarzt.\nWas daran anmacht: Derber Lederduft und die Reibung des kühlen Glattleders direkt am Genital.',
          r1Label: 'Über das feste Leder der Hose streichen',
          r2Label: 'Die Lederhose nackt darunter tragen',
          somaticZone: 'gluteal_pelvis',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 153,
          type: 'scale',
          title: 'CFNM (Clothed Female, Naked Male)',
          desc: 'Was es ist: Die Frau bleibt vollständig, elegant bekleidet, während der Mann nackt dient oder gehorcht.\nWas daran anmacht: Das sichtbare Machtgefälle: Sie geschützt und unnahbar, er vollkommen verwundbar.',
          r1Label: 'Voll bekleidet den nackten Mann führen',
          r2Label: 'Als nackter Mann vor der bekleideten Frau stehen',
          somaticZone: 'full_body',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 154,
          type: 'scale',
          title: 'Maskuline Posing Pouch / Tanga',
          desc: 'Was es ist: Knapper Mikrofaser-String, der den Blick direkt auf die Konturen lenkt.\nWas daran anmacht: Betont das maskuline Gemächt ohne Kompromisse.',
          r1Label: 'Den Mann im knappen String mustern',
          r2Label: 'Den String selbstbewusst vorführen',
          somaticZone: 'genital_penile',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 155,
          type: 'scale',
          title: 'Schwere Edelstahl-Kette um den Hals',
          desc: 'Was es ist: Eine dicke Gliederkette aus poliertem Edelstahl, die kühl auf der Männerbrust liegt.\nWas daran anmacht: Spürbares Gewicht und kühles Metall; symbolisiert unerschütterliche Bindung.',
          r1Label: 'An der Kette sanft heranziehen',
          r2Label: 'Die schwere Metallkette am Hals tragen',
          somaticZone: 'head_neck',
          equipmentTags: ['chain'],
          restraintLayer: 0
        },
        {
          id: 156,
          type: 'scale',
          title: 'Krawatte als provisorische Augenbinde nutzen',
          desc: 'Was es ist: Die Seidenkrawatte des Mannes abnehmen und ihm oder ihr damit die Augen verbinden.\nWas daran anmacht: Spontane Erotik mit Alltagskleidung; Seide liegt weich auf den Augen.',
          r1Label: 'Die Krawatte als Bindung nutzen',
          r2Label: 'Mit der Seidenkrawatte verbunden werden',
          somaticZone: 'head_eyes',
          equipmentTags: ['blindfold'],
          restraintLayer: 1
        },
        {
          id: 157,
          type: 'scale',
          title: 'Hochgerollte Hemdsärmel & Armbanduhr',
          desc: 'Was es ist: Die Ärmel bis zum Ellbogen gekrempelt, markante Uhr am Handgelenk.\nWas daran anmacht: Klassisch-attraktiver Look der Tatkraft und maskulinen Ruhe.',
          r1Label: 'Die Unterarme des Mannes ansehen & greifen',
          r2Label: 'Den maskulinen Look bewusst tragen',
          somaticZone: 'limbs_hands_wrists',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 158,
          type: 'scale',
          title: 'Vollständige Körperrasur beim Mann',
          desc: 'Was es ist: Brust, Achseln und Intimbereich vollkommen haarlos für maximalen Hautkontakt.\nWas daran anmacht: Jede Berührung wird ungedämpft übertragen; der Körper wirkt skulptural.',
          r1Label: 'Über die glatte, rasierte Männerhaut streichen',
          r2Label: 'Sich für die Partnerin glattrasieren',
          somaticZone: 'torso_skin',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 159,
          type: 'scale',
          title: 'Lederstiefel zum nackten Körper',
          desc: 'Was es ist: Der Mann trägt nur schwere Stiefel und ist ansonsten vollständig nackt.\nWas daran anmacht: Der Kontrast zwischen derben Sohlen und verletzlicher, nackter Haut.',
          r1Label: 'Den nackten Mann in Stiefeln mustern',
          r2Label: 'Nackt in Stiefeln im Raum stehen',
          somaticZone: 'limbs_ankles_feet',
          equipmentTags: ['boots'],
          restraintLayer: 0
        },
        {
          id: 160,
          type: 'choice',
          title: 'Welcher Stil gefällt dir am Mann am besten?',
          desc: 'Deine persönliche Vorliebe für maskuline Erotikbekleidung.',
          question: 'In welchem Outfit findest du den Mann am anziehendsten?',
          somaticZone: 'full_body',
          options: [
            { val: 'suit', label: 'Eleganter Maßanzug mit Krawatte (Gentleman / Boss)' },
            { val: 'sporty', label: 'Sportlicher Jockstrap & durchtrainierter Körper' },
            { val: 'leather', label: 'Biker-Lederjeans, Harness & schwere Stiefel' },
            { val: 'cfnm', label: 'Vollkommen nackt dienend (während sie bekleidet ist)' }
          ]
        }
      ]
    }
  ];

  window.surveyChaptersPart1 = surveyChaptersPart1;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = surveyChaptersPart1;
  }

})(typeof window !== 'undefined' ? window : this);
