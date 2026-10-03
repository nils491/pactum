/**
 * data/questions_part2.js
 * TACTUS Psychometrischer Konsens-Katalog · Teil 2 (Kapitel 11 bis 19 · Items 161 bis 325)
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien nach Master-Roadbook & Governance-Verfassung:
 * - 100 % UTF-8 Integrität: Echte deutsche Umlaute (ä, ö, ü, ß) im gesamten Modul
 * - Gesunder Menschenverstand & Reiz-Klarheit: Beseitigung absurder Metaphern (z. B. "armlos")
 * - Dreiklang pro Item: Was es ist, Was daran anmacht (Top/Bottom Psychologie) & griffige Labels
 * - Kinetische & somatische Metadaten (somaticZone, equipmentTags, restraintLayer) für DoF & Staging
 * - Globale Bereitstellung an window.surveyChaptersPart2 sowie CommonJS-Export
 */

(function(window) {
  'use strict';

  const surveyChaptersPart2 = [
    {
      id: 11,
      slug: 'chapter_11_leather_rubber_latex',
      title: 'Kapitel 11: Leder, Lack, Latex & Gummi',
      desc: 'Glanz, Duft und die zweite Haut: Faszinierende Materialien, die eng anliegen und die Sinne schärfen.',
      items: [
        {
          id: 161,
          type: 'scale',
          title: 'Enge schwarze Lack-Leggings',
          desc: 'Was es ist: Hochglänzende Leggings, die bei jeder Bewegung das Licht reflektieren und eng anliegen.\nWas daran anmacht: Zeichnet jede Kontur scharf nach; visuelle Verführung und glatte, kühle Haptik bei Berührung.',
          r1Label: 'Über den glatten Lackstoff streichen',
          r2Label: 'Die glänzende Lackhose tragen & Blicke spüren',
          somaticZone: 'limbs_legs',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 162,
          type: 'scale',
          title: 'Echter Rindsleder-Duft im Raum',
          desc: 'Was es ist: Der unverwechselbare, herbe Duft von geöltem Echtleder bei Jacken, Fesseln oder Hosen.\nWas daran anmacht: Urwüchsiger Geruchsanker; signalisiert dem Gehirn sofort Dominanz, Hochwertigkeit und Ernsthaftigkeit.',
          r1Label: 'Den Lederduft am Partner einatmen',
          r2Label: 'In Leder gehüllt sein & den Duft verströmen',
          somaticZone: 'torso_skin',
          equipmentTags: ['leather_gear'],
          restraintLayer: 0
        },
        {
          id: 163,
          type: 'scale',
          title: 'Latex-Catsuit als zweite Haut',
          desc: 'Was es ist: Ein maßgeschneiderter Ganzkörperanzug aus Naturkautschuk, der luftdicht und eng den Körper umschließt.\nWas daran anmacht: Fester Tiefendruck auf die gesamte Körperoberfläche; schaltet Außenreize ab und konzentriert die Wahrnehmung auf die eigene Haut.',
          r1Label: 'Den Latex-Catsuit am Partner bewundern & greifen',
          r2Label: 'Im engen Catsuit stecken & die Kompression spüren',
          somaticZone: 'full_body',
          equipmentTags: ['latex_catsuit'],
          restraintLayer: 1
        },
        {
          id: 164,
          type: 'scale',
          title: 'Lange Latex-Handschuhe bis zum Ellbogen',
          desc: 'Was es ist: Glänzende Gummihandschuhe, mit denen der Körper kühl und glatt abgetastet wird.\nWas daran anmacht: Nimmt die menschliche Handwärme und ersetzt sie durch klinisch-glatte Reize; intensiviert jede Berührung.',
          r1Label: 'Mit den Latexhandschuhen sanft abtasten',
          r2Label: 'Das kühle Gummi der Handschuhe auf der Haut spüren',
          somaticZone: 'limbs_hands_wrists',
          equipmentTags: ['latex_gloves'],
          restraintLayer: 0
        },
        {
          id: 165,
          type: 'scale',
          title: 'Latex mit Silikonöl auf Hochglanz polieren',
          desc: 'Was es ist: Das gemeinsame Einreiben des Anzugs mit speziellem Polieröl für maximalen Spiegeleffekt.\nWas daran anmacht: Sinnliches Ritual der Vorbereitung; Hände gleiten schwerelos über die Kurven des Partners.',
          r1Label: 'Den Partner mit Polituröl glänzend einreiben',
          r2Label: 'Eingerieben werden & spiegelglatt dastehen',
          somaticZone: 'full_body',
          equipmentTags: ['silicone_oil'],
          restraintLayer: 0
        },
        {
          id: 166,
          type: 'scale',
          title: 'Overknee-Stiefel aus glänzendem Lack',
          desc: 'Was es ist: Sehr hohe Stiefel, die über das Knie bis zur Mitte des Oberschenkels reichen.\nWas daran anmacht: Streckt die Beine, erzwingt eine aufrechte Haltung und symbolisiert unnahbare Eleganz.',
          r1Label: 'Die langen Lackbeine liebkosen & führen',
          r2Label: 'Die Overknee-Stiefel tragen & Haltung zeigen',
          somaticZone: 'limbs_legs',
          equipmentTags: ['boots'],
          restraintLayer: 0
        },
        {
          id: 167,
          type: 'scale',
          title: 'Latex-Haube mit Zopföffnung (Hood)',
          desc: 'Was es ist: Eine enge Kautschukmaske, die den Kopf umschließt, aber Mund und Augen frei lässt.\nWas daran anmacht: Sensorische Entlastung der Kopfhaut; rahmt das Gesicht ein und dämpft Umgebungsgeräusche.',
          r1Label: 'Die Latexhaube am Partner anpassen & führen',
          r2Label: 'In der Haube stecken & Geräusche gedämpft hören',
          somaticZone: 'head_face',
          equipmentTags: ['latex_hood'],
          restraintLayer: 1
        },
        {
          id: 168,
          type: 'scale',
          title: 'Schwere Lederjacke auf nackter Haut',
          desc: 'Was es ist: Eine schwere Motorrad- oder Fliegerlederjacke direkt auf unbedeckter Haut tragen.\nWas daran anmacht: Temperaturkontrast: Das kühle Glattleder wärmt sich langsam an der Körperwärme auf.',
          r1Label: 'Die Hand unter das schwere Leder schieben',
          r2Label: 'Die schwere Jacke auf nackter Haut spüren',
          somaticZone: 'torso_skin',
          equipmentTags: ['leather_jacket'],
          restraintLayer: 0
        },
        {
          id: 169,
          type: 'scale',
          title: 'Neopren-Wäsche (Glatt & wärmespeichernd)',
          desc: 'Was es ist: Elastisches Taucher-Neopren, das fest anliegt und Körperwärme intensiv speichert.\nWas daran anmacht: Weiche, dämpfende Haptik; vermittelt das Gefühl eines schützenden Panzers.',
          r1Label: 'Über das samtige Neopren streichen',
          r2Label: 'Im warmen Neopren schwitzen & geborgen sein',
          somaticZone: 'torso_skin',
          equipmentTags: ['neoprene_suit'],
          restraintLayer: 0
        },
        {
          id: 170,
          type: 'scale',
          title: 'Enganliegende Lederkleidung im Bett',
          desc: 'Was es ist: In Lederhose oder Leder-Top ins Bett gehen und sich aneinander schmiegen.\nWas daran anmacht: Das Knarzen des Materials bei jeder Drehung; bricht die gewohnte Weichheit des Schlafzimmers.',
          r1Label: 'Das knarzende Leder im Bett umarmen',
          r2Label: 'In Leder gehüllt im Bett liegen & Reibung spüren',
          somaticZone: 'full_body',
          equipmentTags: ['leather_gear'],
          restraintLayer: 0
        },
        {
          id: 171,
          type: 'scale',
          title: 'Latex-Strümpfe mit Strumpfhaltern',
          desc: 'Was es ist: Nahtlose Gummistrümpfe, die mit festen Haltern an einem Bund straff fixiert sind.\nWas daran anmacht: Glatter Spiegeleffekt an den Beinen; quietschendes Gleiten bei Oberschenkelberührung.',
          r1Label: 'Die glänzenden Gummibeine streicheln',
          r2Label: 'Die straff sitzenden Latexstrümpfe tragen',
          somaticZone: 'limbs_legs',
          equipmentTags: ['latex_stockings'],
          restraintLayer: 0
        },
        {
          id: 172,
          type: 'scale',
          title: 'Gummi-Geruch als Erregungs-Trigger',
          desc: 'Was es ist: Der süßlich-herbe Eigengeruch von frischem oder gepflegtem Naturkautschuk im Raum.\nWas daran anmacht: Konditionierter Sinnesreiz; schaltet das Gehirn augenblicklich in den erotischen Modus.',
          r1Label: 'Den Gummigeruch genießen & Erregung spüren',
          r2Label: 'Wissen, wie der Duft wirkt & mich fallenlassen',
          somaticZone: 'head_face',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 173,
          type: 'scale',
          title: 'Duschen im vollständigen Latex-Outfit',
          desc: 'Was es ist: Gemeinsam im Kautschukanzug unter die Dusche steigen; das warme Wasser perlt vom Gummi ab.\nWas daran anmacht: Schärft den Kontrast zwischen nasser Außenseite und trocken-warmem Körperinneren.',
          r1Label: 'Das Wasser über den Gummikörper perlen lassen',
          r2Label: 'Im Anzug unter dem heißen Strahl stehen',
          somaticZone: 'full_body',
          equipmentTags: ['latex_catsuit'],
          restraintLayer: 1
        },
        {
          id: 174,
          type: 'scale',
          title: 'Materialkontraste: Seide auf Glattleder',
          desc: 'Was es ist: Ein zartes Seidentuch über feste Lederhosen oder ein geschnürtes Korsett gleiten lassen.\nWas daran anmacht: Maximaler sensorischer Kontrast zwischen zarter Zartheit und robuster Härte.',
          r1Label: 'Den Stoffkontrast gezielt über den Körper führen',
          r2Label: 'Die unterschiedlichen Schichten auf der Haut wahrnehmen',
          somaticZone: 'torso_skin',
          equipmentTags: ['silk', 'leather_gear'],
          restraintLayer: 0
        },
        {
          id: 175,
          type: 'scale',
          title: 'Latex-Slip mit aufblasbarem Kissen',
          desc: 'Was es ist: Ein Höschen mit kleiner Handpumpe, das den Schrittbereich sanft und dosiert ausfüllt.\nWas daran anmacht: Mechanischer, stetig wachsender Druck auf die Schwellkörper ohne direkte Handberührung.',
          r1Label: 'Die Pumpe bedienen & den Druck dosieren',
          r2Label: 'Den wachsenden Druck im Schritt aushalten',
          somaticZone: 'genital_core',
          equipmentTags: ['inflatable_gear'],
          restraintLayer: 1
        },
        {
          id: 176,
          type: 'scale',
          title: 'Knisternde Vinyl- & PVC-Röcke',
          desc: 'Was es ist: Kurze Röcke aus gefärbtem oder transparentem PVC, die bei jedem Schritt rascheln.\nWas daran anmacht: Akustischer Reiz; das hörbare Knistern kündigt jede kleinste Bewegung im Raum an.',
          r1Label: 'Das Rascheln des Rocks hören & druntergreifen',
          r2Label: 'Im PVC-Rock herumlaufen & gehört werden',
          somaticZone: 'gluteal_pelvis',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 177,
          type: 'scale',
          title: 'Leder-Korsage mit Metallschnallen',
          desc: 'Was es ist: Festes Rindsleder um die Taille, mit Schnallen verschlossen statt mit Kordeln geschnürt.\nWas daran anmacht: Unnachgiebige Kompression; zwingt zu gerader Haltung und stützt den Oberkörper.',
          r1Label: 'Die Schnallen schließen & festziehen',
          r2Label: 'In der Lederkorsage aufrecht verharren',
          somaticZone: 'torso_flanks',
          equipmentTags: ['corset'],
          restraintLayer: 1
        },
        {
          id: 178,
          type: 'scale',
          title: 'Gummibandagen um Arme oder Beine wickeln',
          desc: 'Was es ist: Reine elastische Latexbänder fest um Beine oder Oberkörper wickeln wie ein dichter Wickel.\nWas daran anmacht: Kompressions-Geborgenheit; regt die Tiefensensibilität (Propriozeption) an.',
          r1Label: 'Mit dem Gummiband präzise & straff wickeln',
          r2Label: 'In der Gummibandage eingewickelt daliegen',
          somaticZone: 'limbs_legs',
          equipmentTags: ['latex_straps'],
          restraintLayer: 1
        },
        {
          id: 179,
          type: 'scale',
          title: 'Latex-Handschuhe beim Oralverkehr',
          desc: 'Was es ist: Mit glatten Gummifingern den Intimbereich spreizen und liebkosen, während der Mund verwöhnt.\nWas daran anmacht: Feucht-glitschige Reibung und klinische Distanz kombiniert mit intimer Hingabe.',
          r1Label: 'Mit den Handschuhen streicheln & oral verwöhnen',
          r2Label: 'Das glatte Gummi an den Intimzonen spüren',
          somaticZone: 'genital_core',
          equipmentTags: ['latex_gloves'],
          restraintLayer: 0
        },
        {
          id: 180,
          type: 'choice',
          title: 'Präferenz für Glanz- & Fetisch-Materialien',
          desc: 'Deine persönliche Haltung zu Lack, Leder und Latex im Schlafzimmer.',
          question: 'Welches dieser Materialien findest du am anziehendsten?',
          somaticZone: 'torso_skin',
          options: [
            { val: 'leather', label: 'Echtes Rindsleder (Der Duft, die Schwere & Griffigkeit)' },
            { val: 'latex', label: 'Glänzendes Latex (Die glatte zweite Haut & Enge)' },
            { val: 'patent', label: 'Hochglänzender Lack (Leggings, Overknees, Pumps)' },
            { val: 'none', label: 'Ich bevorzuge reine Naturstoffe wie Seide und Baumwolle' }
          ]
        }
      ]
    },

    {
      id: 12,
      slug: 'chapter_12_body_fetishes_tactility',
      title: 'Kapitel 12: Körperfetische, Haare, Füße & Taktilität',
      desc: 'Hingabe an spezifische Körperpartien: Haare bürsten, Fußpflege, Hand-Worship und der Duft reiner Haut.',
      items: [
        {
          id: 181,
          type: 'scale',
          title: 'Haare bürsten mit Naturborsten',
          desc: 'Was es ist: Den ruhenden Partner vor sich setzen und die Haare langsam mit langen Strichen bürsten.\nWas daran anmacht: Beruhigt das vegetative Nervensystem; rhythmische Fürsorge ohne sexuelle Forderung.',
          r1Label: 'Geduldig & liebevoll die Haare bürsten',
          r2Label: 'Die Bürste auf der Kopfhaut spüren & abschalten',
          somaticZone: 'head_neck',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 182,
          type: 'scale',
          title: 'Bartpflege & Kraulen beim Mann',
          desc: 'Was es ist: Mit den Fingern durch den Bart fahren, Bartöl einmassieren und die Kieferpartie halten.\nWas daran anmacht: Feine Stimulation der Haarfollikel; ehrt die maskuline Gesichtspartie.',
          r1Label: 'Den Bart kraulen & pflegen',
          r2Label: 'Die Hände im Bart genießen',
          somaticZone: 'head_face',
          equipmentTags: ['oil'],
          restraintLayer: 0
        },
        {
          id: 183,
          type: 'scale',
          title: 'Haare flechten & Zöpfe binden',
          desc: 'Was es ist: Dem Partner die Haare kunstvoll flechten oder vor einer Session straff nach hinten binden.\nWas daran anmacht: Legt Nacken und Halslinie frei; ritualisiertes Vorbereiten auf die Führung.',
          r1Label: 'Die Haare binden & den Nacken freilegen',
          r2Label: 'Sich die Haare binden lassen & bereit sein',
          somaticZone: 'head_neck',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 184,
          type: 'scale',
          title: 'Ausführliche Fußmassage mit Balsam',
          desc: 'Was es ist: Nach einem langen Tag die Füße des Partners mit den Daumen kneten, Fersen lockern und wärmen.\nWas daran anmacht: Löst tiefe vegetative Entspannung aus und schenkt dem Partner absolute Wertschätzung.',
          r1Label: 'Die Füße des Partners kräftig massieren',
          r2Label: 'Die Fußmassage empfangen & durchatmen',
          somaticZone: 'limbs_ankles_feet',
          equipmentTags: ['oil'],
          restraintLayer: 0
        },
        {
          id: 185,
          type: 'scale',
          title: 'Zehen liebkosen & küssen (Foot Worship)',
          desc: 'Was es ist: Jeden einzelnen Zeh mit Lippen und Zungenspitze andächtig küssen und umkreisen.\nWas daran anmacht: Reine somatische Demut; der Körper des Partners wird bis in die Peripherie verehrt.',
          r1Label: 'Die Zehen des Partners andächtig küssen',
          r2Label: 'Die Lippen & Zunge an den Zehen spüren',
          somaticZone: 'limbs_ankles_feet',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 186,
          type: 'scale',
          title: 'Fuß auf die Brust des Partners legen',
          desc: 'Was es ist: Den nackten Fuß auf Brust oder Schulter des liegenden Partners betten.\nWas daran anmacht: Das physische Spüren des Gewichts als sichtbares Zeichen von Akzeptanz und Führung.',
          r1Label: 'Den Fuß auflegen & spüren lassen',
          r2Label: 'Das Gewicht des Fußes auf der Brust tragen',
          somaticZone: 'chest_nipples',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 187,
          type: 'scale',
          title: 'Lackierte Fußnägel bewundern & küssen',
          desc: 'Was es ist: Frisch rot oder schwarz lackierte Nägel betrachten, streicheln und mit den Lippen berühren.\nWas daran anmacht: Ästhetischer Glanzreiz; zelebriert feminine oder gepflegte Akzente.',
          r1Label: 'Die lackierten Nägel mustern & liebkosen',
          r2Label: 'Die lackierten Füße präsentieren',
          somaticZone: 'limbs_ankles_feet',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 188,
          type: 'scale',
          title: 'Hand-Worship (Jeden Finger einzeln küssen)',
          desc: 'Was es ist: Die Hand des Partners nehmen, die Fingerkuppen einzeln umkreisen und andächtig liebkosen.\nWas daran anmacht: Zärtliche Ehrerbietung für die Hände, die im Alltag und im Spiel führen oder dienen.',
          r1Label: 'Die Finger einzeln küssen & liebkosen',
          r2Label: 'Die Zärtlichkeit an den Fingern genießen',
          somaticZone: 'limbs_hands_wrists',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 189,
          type: 'scale',
          title: 'Sanftes Kitzeln der Fußsohlen mit Federn',
          desc: 'Was es ist: Die Füße fixieren und mit einer weichen Feder federleicht über die Sohlen streichen.\nWas daran anmacht: Zarte sensorische Quälerei; erzeugt Kribbeln ohne Schmerzreiz.',
          r1Label: 'Mit der Feder über die Fußsohlen streichen',
          r2Label: 'Das Kribbeln an den Sohlen aushalten',
          somaticZone: 'limbs_ankles_feet',
          equipmentTags: ['feather'],
          restraintLayer: 0
        },
        {
          id: 190,
          type: 'scale',
          title: 'Natürlicher Körpergeruch & Schweißduft',
          desc: 'Was es ist: Den echten Duft von Nacken, Hals oder Achseln nach Sport oder Alltag gern einatmen.\nWas daran anmacht: Pheromon-Bindung; signalisiert Nähe und archaische Anziehung ohne Parfüm-Barriere.',
          r1Label: 'Den natürlichen Körperduft tief einatmen',
          r2Label: 'Sich unbesorgt beschnuppern & küssen lassen',
          somaticZone: 'head_neck',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 191,
          type: 'scale',
          title: 'Narben & Dehnungsstreifen liebkosen',
          desc: 'Was es ist: Frühere Narben oder Spuren des Lebens andächtig mit den Lippen nachfahren und annehmen.\nWas daran anmacht: Tiefste seelische Heilung; befreit den Partner von Scham über vermeintliche Makel.',
          r1Label: 'Die Narben des Partners küssen & wertschätzen',
          r2Label: 'Die Zärtlichkeit an den eigenen Narben spüren',
          somaticZone: 'torso_skin',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 192,
          type: 'scale',
          title: 'Körperbutter von Kopf bis Fuß einmassieren',
          desc: 'Was es ist: Reichhaltige Sheabutter mit beiden Händen auf Armen, Beinen und Po verteilen, bis alles glänzt.\nWas daran anmacht: Absichtslose Fürsorge; verwandelt den Körper in eine seidig glatte Skulptur.',
          r1Label: 'Den Partner andächtig einbalsamieren',
          r2Label: 'Seidig gepflegt daliegen & entspannen',
          somaticZone: 'full_body',
          equipmentTags: ['oil'],
          restraintLayer: 0
        },
        {
          id: 193,
          type: 'scale',
          title: 'Lange Fingernägel auf der Haut spüren',
          desc: 'Was es ist: Gepflegte Nägel langsam und ohne Verletzung über Rücken oder Brustkorb ziehen.\nWas daran anmacht: Prickelnder Schwellenreiz zwischen zarter Berührung und feinem Schmerz.',
          r1Label: 'Mit den Nägeln Reizlinien über die Haut ziehen',
          r2Label: 'Die feinen Kratzlinien auf der Haut spüren',
          somaticZone: 'torso_skin',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 194,
          type: 'scale',
          title: 'Auf die Knie gehen & Schuhe putzen',
          desc: 'Was es ist: Dem Partner auf Knien die Schuhe oder Stiefel säubern und auf Hochglanz polieren.\nWas daran anmacht: Praktische Dienerschaft; symbolisiert Demut im beiläufigen Alltag.',
          r1Label: 'Sich die Schuhe auf Knien putzen lassen',
          r2Label: 'Die Schuhe andächtig säubern & polieren',
          somaticZone: 'limbs_ankles_feet',
          equipmentTags: ['boots'],
          restraintLayer: 0
        },
        {
          id: 195,
          type: 'scale',
          title: 'Ohrmuscheln ablecken & anknabbern',
          desc: 'Was es ist: Die Zungenspitze ganz sanft in die Ohrmuschel führen und sanft am Ohrläppchen saugen.\nWas daran anmacht: Feine Nervenreizung direkt am Hörnerv; erzeugt unwillkürliche Gänsehaut-Schauer.',
          r1Label: 'Die Ohren sanft mit der Zunge liebkosen',
          r2Label: 'Das intensive Kribbeln am Ohr genießen',
          somaticZone: 'head_ears',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 196,
          type: 'scale',
          title: 'Augenbrauen streicheln zum Einschlafen',
          desc: 'Was es ist: Mit der Fingerkuppe ganz gleichmäßig über den Brauenbogen streichen, bis die Lider schwer werden.\nWas daran anmacht: Vegetative Beruhigung; baut Stress ab und signalisiert vollkommene Sicherheit.',
          r1Label: 'Sanft über die Augenbrauen streichen',
          r2Label: 'Unter den Fingerstrichen friedlich wegdösen',
          somaticZone: 'head_face',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 197,
          type: 'choice',
          title: 'Bevorzugte Körperpartie für Zuwendung',
          desc: 'Welche Körperzone abseits der primären Geschlechtsorgane spricht dich am stärksten an?',
          question: 'Welche Körperpartie fasziniert dich besonders?',
          somaticZone: 'full_body',
          options: [
            { val: 'feet', label: 'Füße, Zehen & Sohlen (Massage, Küsse, Foot Worship)' },
            { val: 'hair', label: 'Haare & Kopfhaut (Bürsten, Kraulen, Flechten)' },
            { val: 'hands', label: 'Hände & Handgelenke (Hand-Worship, zarte Finger)' },
            { val: 'neck_back', label: 'Nacken, Schultern & Wirbelsäule' }
          ]
        }
      ]
    },

    {
      id: 13,
      slug: 'chapter_13_collars_ropes_shibari',
      title: 'Kapitel 13: Leinen, Halsbänder & Shibari-Seilkunst',
      desc: 'Das Symbol der Zugehörigkeit und die Ästhetik des Bindens: Weiches Leder, Naturseile und gezielte Arretierung.',
      items: [
        {
          id: 198,
          type: 'scale',
          title: 'Lederhalsband mit D-Ring & Leine',
          desc: 'Was es ist: Ein gepolstertes Lederhalsband als Zeichen der Bindung; Führung an der Lederleine im Raum.\nWas daran anmacht: Für den Top die physische Führung der Blick- und Gehrichtung. Für den Bottom die erlösende Gewissheit, geführt zu werden.',
          r1Label: 'Das Halsband anlegen & die Leine führen',
          r2Label: 'Das Halsband tragen & an der Leine folgen',
          somaticZone: 'head_neck',
          equipmentTags: ['collar', 'leash'],
          restraintLayer: 0
        },
        {
          id: 199,
          type: 'scale',
          title: 'Diskretes Tageshalsband (Day-Collar)',
          desc: 'Was es ist: Ein zierliches Lederband oder ein geschlossener Silberring als Kette im Alltag.\nWas daran anmacht: Ein unauffälliges Bündnis-Symbol auf der Haut, das Außenstehende für normalen Schmuck halten.',
          r1Label: 'Den Anhänger feierlich anlegen & schenken',
          r2Label: 'Den Schmuck im Alltag tragen & Bescheid wissen',
          somaticZone: 'head_neck',
          equipmentTags: ['collar'],
          restraintLayer: 0
        },
        {
          id: 200,
          type: 'scale',
          title: 'Führung an der kurzen Leine auf Knien',
          desc: 'Was es ist: Den Partner an der kurzen Lederleine behutsam neben sich auf Knien durch den Raum leiten.\nWas daran anmacht: Körperliche Asymmetrie; der Führende bestimmt Tempo und Haltepunkte.',
          r1Label: 'Die Leine ruhig & bestimmt führen',
          r2Label: 'Auf Knien an der Leine folgen',
          somaticZone: 'limbs_knees',
          equipmentTags: ['collar', 'leash'],
          restraintLayer: 0
        },
        {
          id: 201,
          type: 'scale',
          title: 'Halsband mit weicher Fellfütterung',
          desc: 'Was es ist: Ein breites Lederhalsband, das innen mit weichem Lammfell gefüttert ist.\nWas daran anmacht: Schließt Scheuern aus; vereint feste Begrenzung mit höchstem Tragekomfort.',
          r1Label: 'Das gepolsterte Halsband verschließen',
          r2Label: 'Die weiche Fellpolsterung am Hals spüren',
          somaticZone: 'head_neck',
          equipmentTags: ['collar'],
          restraintLayer: 0
        },
        {
          id: 202,
          type: 'scale',
          title: 'Leine am eigenen Gürtel befestigen',
          desc: 'Was es ist: Die Leine des Partners am eigenen Gürtel einklinken; er folgt bei jedem Schritt im Haus.\nWas daran anmacht: Freihändige Führung; stumme Verbundenheit bei alltäglichen Wegen.',
          r1Label: 'Die Leine am Gürtel tragen & führen',
          r2Label: 'Mit der Leine verbunden folgen',
          somaticZone: 'head_neck',
          equipmentTags: ['collar', 'leash'],
          restraintLayer: 0
        },
        {
          id: 203,
          type: 'scale',
          title: 'Handgelenke vor dem Körper fixieren',
          desc: 'Was es ist: Die Hände vorne mit weichen Klett- oder Ledermanschetten zusammenbinden.\nWas daran anmacht: Leichte Einschränkung; man bleibt mobil, kann sich aber nicht mehr frei bewegen.',
          r1Label: 'Die Handgelenke vorne sanft fixieren',
          r2Label: 'Die Hände vorne gebunden daliegen haben',
          somaticZone: 'limbs_hands_wrists',
          equipmentTags: ['cuffs'],
          restraintLayer: 1
        },
        {
          id: 204,
          type: 'scale',
          title: 'Hände fest hinter dem Rücken fixieren',
          desc: 'Was es ist: Die Arme hinter den Rücken führen und die Manschetten schließen; öffnet den Brustkorb.\nWas daran anmacht: Vollständige motorische Hilflosigkeit der Hände; kein Abstützen bei Berührung möglich.',
          r1Label: 'Die Arme hinter dem Rücken schließen',
          r2Label: 'Mit Händen am Rücken verharren & empfangen',
          somaticZone: 'limbs_hands_wrists',
          equipmentTags: ['cuffs'],
          restraintLayer: 1
        },
        {
          id: 205,
          type: 'scale',
          title: 'Knöchel aneinander fesseln (Hobble)',
          desc: 'Was es ist: Die Füße zusammenbinden, sodass nur noch kleine, trippelnde Schritte möglich sind.\nWas daran anmacht: Begrenzt den Aktionsradius; der Partner kann nicht weglaufen.',
          r1Label: 'Die Knöchel zusammenbinden & führen',
          r2Label: 'Mit gebundenen Füßen vorsichtig gehen',
          somaticZone: 'limbs_ankles_feet',
          equipmentTags: ['cuffs'],
          restraintLayer: 1
        },
        {
          id: 206,
          type: 'scale',
          title: 'Vier-Punkt-Fesselung am Bettrahmen',
          desc: 'Was es ist: Beide Handgelenke und Knöchel mit gepolsterten Bändern an den vier Bettecken fixieren.\nWas daran anmacht: Maximale Ausbreitung und Öffnung des Körpers; volle Hingabe ohne Fluchtmöglichkeit.',
          r1Label: 'Die vier Punkte am Bettrahmen arretieren',
          r2Label: 'Auf dem Bett ausgebreitet & sicher liegen',
          somaticZone: 'full_body',
          equipmentTags: ['cuffs', 'bed_straps'],
          restraintLayer: 2
        },
        {
          id: 207,
          type: 'scale',
          title: 'Weiche Klettfesseln für den Einstieg',
          desc: 'Was es ist: Textilmanschetten ohne Schloss, die sich mit einem schnellen Ruck sofort lösen lassen.\nWas daran anmacht: Schwellenangst-freier Einstieg; schenkt Anfängern die Gewissheit rascher Befreiung.',
          r1Label: 'Die Klettfesseln anbringen & lösen',
          r2Label: 'Die Sicherheit der Klettfesseln genießen',
          somaticZone: 'limbs_hands_wrists',
          equipmentTags: ['cuffs'],
          restraintLayer: 1
        },
        {
          id: 208,
          type: 'scale',
          title: 'Echte Jute- oder Hanfseile (Shibari)',
          desc: 'Was es ist: Geölte Naturfaserseile, die griffig auf der Haut sitzen und nach Bienenwachs duften.\nWas daran anmacht: Fester Reibungswiderstand auf der Haut; das Geräusch des straffenden Seils erzeugt Vorfreude.',
          r1Label: 'Mit den geölten Juteseilen kunstvoll binden',
          r2Label: 'Das griffige Naturseil auf der Haut spüren',
          somaticZone: 'torso_skin',
          equipmentTags: ['rope'],
          restraintLayer: 1
        },
        {
          id: 209,
          type: 'scale',
          title: 'Leder-Monohandschuh (Beide Arme eng am Rücken)',
          desc: 'Was es ist: Eine feste Schnürhülle aus Glattleder, die beide Arme eng hinter dem Rücken arretiert.\nWas daran anmacht: Für den Top die absolute Kontrolle über die Handlungsfähigkeit des Partners. Für den Bottom das erlösende Gefühl, sich nicht mehr wehren oder abstützen zu können.',
          r1Label: 'Die Arme in der Lederhülle fixieren',
          r2Label: 'Mit eng am Rücken geschnürten Armen verharren',
          somaticZone: 'limbs_hands_wrists',
          equipmentTags: ['cuffs'],
          restraintLayer: 2
        },
        {
          id: 210,
          type: 'scale',
          title: 'Oberkörper-Geschirr knüpfen (Chest Harness)',
          desc: 'Was es ist: Seile kunstvoll über Brust, Schultern und Flanken weben, die das Dekolleté betonen.\nWas daran anmacht: Ästhetische Verschönerung des Körpers; bietet dem Top feste Haltegriffe beim Lieben.',
          r1Label: 'Das Seilgeschirr am Oberkörper knüpfen',
          r2Label: 'Das straffe Seilgeflecht am Körper tragen',
          somaticZone: 'chest_nipples',
          equipmentTags: ['rope'],
          restraintLayer: 1
        },
        {
          id: 211,
          type: 'scale',
          title: 'Takate Kote (Traditionelle Armbox)',
          desc: 'Was es ist: Klassische japanische Bindung der Oberarme hinter dem Rücken mit Seilführung über die Brust.\nWas daran anmacht: Fester Tiefendruck auf Schulterblätter und Brustkorb; leitet tief in den Subspace.',
          r1Label: 'Das Takate Kote ruhig & sicher binden',
          r2Label: 'Im Takate Kote verharren & in Trance gleiten',
          somaticZone: 'limbs_hands_wrists',
          equipmentTags: ['rope'],
          restraintLayer: 2
        },
        {
          id: 212,
          type: 'scale',
          title: 'Knie-Ellbogen-Fesselung (Frogtie)',
          desc: 'Was es ist: In Bauchlage werden die angewinkelten Knöchel an die Handgelenke gebunden; kompakte Frosch-Pose.\nWas daran anmacht: Vollkommene Bewegungsstarre des Rumpfes; das Becken liegt unbeweglich exponiert.',
          r1Label: 'Den Partner im Frogtie binden & führen',
          r2Label: 'Kompakt gebunden daliegen & stillhalten',
          somaticZone: 'gluteal_pelvis',
          equipmentTags: ['rope'],
          restraintLayer: 2
        },
        {
          id: 213,
          type: 'scale',
          title: 'Aufhängung am Deckenhaken (Suspension)',
          desc: 'Was es ist: Den Körper mit geprüften Seilen, Ringen und Karabinern teilweise oder ganz in die Luft heben.\nWas daran anmacht: Schwerelosigkeit; das gesamte Körpergewicht wird vom Seil getragen (Königsklasse).',
          r1Label: 'Die Aufhängung sicher aufbauen & leiten',
          r2Label: 'Schwerelos in den Seilen schweben',
          somaticZone: 'full_body',
          equipmentTags: ['rope'],
          restraintLayer: 2
        },
        {
          id: 214,
          type: 'scale',
          title: 'Bodenfesselung auf weichen Matten (Floorwork)',
          desc: 'Was es ist: Gefesselt flach am Boden liegen; alle Drehungen und Berührungen finden im Liegen statt.\nWas daran anmacht: Maximale Erdung; der Körper kann nirgendwo herunterfallen.',
          r1Label: 'Den Partner am Boden binden & liebkosen',
          r2Label: 'Flach am Boden im Seil ruhen',
          somaticZone: 'full_body',
          equipmentTags: ['rope'],
          restraintLayer: 1
        },
        {
          id: 215,
          type: 'scale',
          title: 'Seildruck an Akupressurpunkten',
          desc: 'Was es ist: Knoten gezielt so setzen, dass sie dosierten Druck auf Rücken- und Schultermuskeln ausüben.\nWas daran anmacht: Schmerztherapeutischer Effekt; regt die Durchblutung an und löst Muskelverspannungen.',
          r1Label: 'Die Knoten gezielt auf Druckpunkte setzen',
          r2Label: 'Die wohltuende Tiefenwirkung im Gewebe spüren',
          somaticZone: 'back_flanks',
          equipmentTags: ['rope'],
          restraintLayer: 1
        },
        {
          id: 216,
          type: 'scale',
          title: 'Blickführung über ein Hals-Seil',
          desc: 'Was es ist: Ein dünnes Führungsseil vom Halsband zur Hand des Tops führen, um Blickrichtung sanft zu lenken.\nWas daran anmacht: Feinstoffliche Führung; kleinste Fingerbewegungen übertragen Impulse an den Kopf.',
          r1Label: 'Den Kopf mit feinem Seilzug dirigieren',
          r2Label: 'Dem leichten Zug am Hals bereitwillig folgen',
          somaticZone: 'head_neck',
          equipmentTags: ['rope', 'collar'],
          restraintLayer: 0
        },
        {
          id: 217,
          type: 'scale',
          title: 'Shibari-Session mit Auskling-Trance',
          desc: 'Was es ist: Ausführliches Binden mit Seilen über eine Stunde mit anschließender langer Ruhezeit im Seil.\nWas daran anmacht: Lässt Raum für den vollen Endorphin-Rausch; das Zeitempfinden löst sich auf.',
          r1Label: 'Als Rigger ruhig binden & die Trance bewachen',
          r2Label: 'Im Seil verharren & den Subspace voll auskosten',
          somaticZone: 'full_body',
          equipmentTags: ['rope'],
          restraintLayer: 2
        },
        {
          id: 218,
          type: 'scale',
          title: 'Sicherheits-Cutter liegt immer griffbereit',
          desc: 'Was es ist: Ein stumpf geschützter Kappschneider liegt bei jeder Session offen auf dem Nachttisch.\nWas daran anmacht: Gewährleistet das RACK-Prinzip; schützt vor Panik durch feste Notfall-Option.',
          r1Label: 'Den Sicherheits-Cutter vorab bereitlegen',
          r2Label: 'Wissen, dass man im Notfall in zwei Sekunden frei ist',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 219,
          type: 'scale',
          title: 'Regelmäßiger Durchblutungs- & Pulscheck',
          desc: 'Was es ist: Alle 10 Minuten Daumen und Fingerkuppen drücken: Farbe muss sofort zurückkehren.\nWas daran anmacht: Beweist dem Bottom die ununterbrochene Achtsamkeit und Verantwortung des Tops.',
          r1Label: 'Die Hände geduldig prüfen & fühlen',
          r2Label: 'Die Hände kontrollieren lassen & Geborgenheit spüren',
          somaticZone: 'limbs_hands_wrists',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 220,
          type: 'scale',
          title: 'Körperliches Loslassen im Seil (Subspace)',
          desc: 'Was es ist: Die Muskeln erschlaffen lassen, Augen schließen und das vollkommene Gehaltensein spüren.\nWas daran anmacht: Neurobiologische Entlastung des präfrontalen Kortex; Grübeln stoppt vollständig.',
          r1Label: 'Den Partner im Seil halten & wiegen',
          r2Label: 'Alle Kontrolle an das Seil abgeben & schweben',
          somaticZone: 'psyche_mind',
          equipmentTags: ['rope'],
          restraintLayer: 1
        },
        {
          id: 221,
          type: 'scale',
          title: 'Gemeinsames Aufwickeln der Seile danach',
          desc: 'Was es ist: Nach dem Lösen die Seile zusammen andächtig aufschießen und den Abend ruhig beenden.\nWas daran anmacht: Friedvolles Erdungsritual; holt beide Partner sanft in den Alltag zurück.',
          r1Label: 'Die Seile ordentlich aufwickeln & versorgen',
          r2Label: 'Beim Aufwickeln zusehen & Tee trinken',
          somaticZone: 'psyche_mind',
          equipmentTags: ['rope'],
          restraintLayer: 0
        },
        {
          id: 222,
          type: 'scale',
          title: 'Seilmuster fotografieren für den Tresor',
          desc: 'Was es ist: Die kunstvollen Knoten und roten Linien auf der Haut mit einem Foto im 1:1 Tresor festhalten.\nWas daran anmacht: Schafft bleibende visuelle Trophäen und dokumentiert die geteilte Ästhetik.',
          r1Label: 'Das Seilmuster kunstvoll fotografieren',
          r2Label: 'Im Seil für das Foto posieren',
          somaticZone: 'head_eyes',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 223,
          type: 'choice',
          title: 'Bevorzugtes Fesselungs-Material',
          desc: 'Deine persönliche Vorliebe bei Bindungen und Arretierungen.',
          question: 'Welches Material findest du an Händen & Körper am schönsten?',
          somaticZone: 'torso_skin',
          options: [
            { val: 'shibari', label: 'Natürliche Juteseile & Shibari-Muster (Ästhetik & Trance)' },
            { val: 'leather', label: 'Weiche Lederfesseln mit Schnallen & Klett' },
            { val: 'chain', label: 'Kühle Metallhandschellen & schwere Ketten' },
            { val: 'none', label: 'Ich mag es überhaupt nicht, festgebunden zu sein' }
          ]
        }
      ]
    },

    {
      id: 14,
      slug: 'chapter_14_bdsm_furniture_restraints',
      title: 'Kapitel 14: BDSM-Möbel & Arretierungen',
      desc: 'Stabile Vorrichtungen: Pranger, Andreaskreuz, Kniebänke, Liebesschaukeln und Bettarretierungen.',
      items: [
        {
          id: 224,
          type: 'scale',
          title: 'Hand-Hals-Pranger (Pillory)',
          desc: 'Was es ist: Kopf und Hände in einen gepolsterten Holz- oder Lederpranger legen; aufrechte, unbewegliche Haltung.\nWas daran anmacht: Sichtbare Präsentation; der Körper ist vornübergebeugt arretiert, während der Top freien Zugang hat.',
          r1Label: 'Den Pranger schließen & Partner vorführen',
          r2Label: 'Im Pranger verharren & stillhalten',
          somaticZone: 'head_neck',
          equipmentTags: ['pillory'],
          restraintLayer: 2
        },
        {
          id: 225,
          type: 'scale',
          title: 'Gepolsterte Kniebank für langes Knien',
          desc: 'Was es ist: Eine weich gepolsterte Bank, auf der man ohne Knieschmerzen lange vor dem Partner knien kann.\nWas daran anmacht: Ermöglicht andächtige Demutshaltungen über 20–30 Minuten ohne Schmerzen an den Kniescheiben.',
          r1Label: 'Den Partner auf die Kniebank bitten',
          r2Label: 'Bequem gepolstert knien & warten',
          somaticZone: 'limbs_knees',
          equipmentTags: ['kneeling_bench'],
          restraintLayer: 0
        },
        {
          id: 226,
          type: 'scale',
          title: 'Wandösen mit Schnappkarabinern',
          desc: 'Was es ist: Feste Ringschrauben in der Wand, an denen Fesseln oder Ketten mit einem Klick befestigt werden.\nWas daran anmacht: Fester Anker im Raum; verwandelt das normale Zimmer in ein echtes Bündnis-Atelier.',
          r1Label: 'Die Karabiner an der Wand einklinken',
          r2Label: 'An der Wand fixiert verharren',
          somaticZone: 'full_body',
          equipmentTags: ['cuffs'],
          restraintLayer: 2
        },
        {
          id: 227,
          type: 'scale',
          title: 'Spanking-Bock (Vorbeuge-Bank)',
          desc: 'Was es ist: Eine gepolsterte Bank, über die man sich nach vorne beugt; das Becken liegt erhöht und frei.\nWas daran anmacht: Perfekte ergonomische Haltung für den Top; das Gesäß des Bottoms ist ideal exponiert.',
          r1Label: 'Den Partner über den Bock legen & führen',
          r2Label: 'Über der Bank gebeugt daliegen & empfangen',
          somaticZone: 'gluteal_pelvis',
          equipmentTags: ['spanking_bench'],
          restraintLayer: 0
        },
        {
          id: 228,
          type: 'scale',
          title: 'Andreaskreuz an der Wand',
          desc: 'Was es ist: Ein X-förmiges Holzkreuz, an dem Hände und Füße weit geöffnet arretiert werden.\nWas daran anmacht: Monumentale Fixierung; der Körper kann keiner Berührung und keinem Blick ausweichen.',
          r1Label: 'Am Kreuz fixieren & mustern',
          r2Label: 'Ausgebreitet am Kreuz stehen & stillhalten',
          somaticZone: 'full_body',
          equipmentTags: ['st_andrews_cross'],
          restraintLayer: 2
        },
        {
          id: 229,
          type: 'scale',
          title: 'Starre Spreizstange an den Knöcheln',
          desc: 'Was es ist: Eine feste Metall- oder Lederstange, die die Beine im 60–90°-Winkel offen hält.\nWas daran anmacht: Verhindert jedes Zusammenpressen der Oberschenkel; erzwingt ständige Offenheit.',
          r1Label: 'Die Spreizstange anbringen & Zugang sichern',
          r2Label: 'Mit geöffneten Beinen arretiert verharren',
          somaticZone: 'limbs_legs',
          equipmentTags: ['spreader_bar'],
          restraintLayer: 2
        },
        {
          id: 230,
          type: 'scale',
          title: 'BDSM-Liebesschaukel an der Decke (Sling)',
          desc: 'Was es ist: Eine breite Lederschaukel, in die man sich rücklings legt; der Körper schwebt in der Luft.\nWas daran anmacht: Schwerelosigkeit entlastet alle Gelenke; ermöglicht mühelose Tiefe beim Lieben.',
          r1Label: 'Den Partner in die Schaukel betten & lieben',
          r2Label: 'Schwerelos in der Schaukel empfangen',
          somaticZone: 'pelvis_core',
          equipmentTags: ['sling'],
          restraintLayer: 1
        },
        {
          id: 231,
          type: 'scale',
          title: 'Gitterbox / Käfig im Raum',
          desc: 'Was es ist: Ein stilvoller Metallkäfig mit Decken, in den man sich zurückziehen oder eingesperrt werden kann.\nWas daran anmacht: Räumliche Begrenzung; fungiert als Höhle des Rückzugs oder sichtbarer Kerker.',
          r1Label: 'Die Gittertür schließen & Schlüssel behalten',
          r2Label: 'Im Käfig zur Ruhe kommen & warten',
          somaticZone: 'full_body',
          equipmentTags: ['cage'],
          restraintLayer: 2
        },
        {
          id: 232,
          type: 'scale',
          title: 'Stuhl-Fixierung mit festen Riemen',
          desc: 'Was es ist: Auf einem Holzstuhl sitzen, Arme an die Lehnen und Knöchel an die Stuhlbeine geschnallt.\nWas daran anmacht: Aufrechte, wehrlose Haltung; ideal für Verhör-Rollenspiele oder Zwangszuschauen.',
          r1Label: 'Am Stuhl festschnallen & dirigieren',
          r2Label: 'Auf dem Stuhl fixiert zusehen & aushalten',
          somaticZone: 'full_body',
          equipmentTags: ['cuffs'],
          restraintLayer: 2
        },
        {
          id: 233,
          type: 'scale',
          title: 'Ergonomisches Keilkissen fürs Becken (Sex-Wedge)',
          desc: 'Was es ist: Ein festes Schaumstoffkissen, das das Becken um 30 Grad anhebt.\nWas daran anmacht: Optimiert den anatomischen Eintrittswinkel und schont die Lendenwirbelsäule.',
          r1Label: 'Das Kissen unterlegen & tief führen',
          r2Label: 'Erhöht liegen & entspannt empfangen',
          somaticZone: 'pelvis_core',
          equipmentTags: ['wedge_pillow'],
          restraintLayer: 0
        },
        {
          id: 234,
          type: 'scale',
          title: 'Bett-Gurt-System unter der Matratze',
          desc: 'Was es ist: Gurte, die unter der Matratze verlaufen und Schlaufen an allen vier Ecken bereithalten.\nWas daran anmacht: Diskrete Fixierung im normalen Bett ohne sichtbare Haken an der Wand.',
          r1Label: 'Die Fesseln an den Gurten festklicken',
          r2Label: 'Am Bett fixiert daliegen',
          somaticZone: 'full_body',
          equipmentTags: ['bed_straps'],
          restraintLayer: 2
        },
        {
          id: 235,
          type: 'scale',
          title: 'Stabile Griffe am Kopfteil des Betts',
          desc: 'Was es ist: Feste Holz- oder Metallgriffe am Bettrahmen, an denen sich der Partner festhalten kann.\nWas daran anmacht: Gibt dem Bottom physischen Halt bei kraftvollen Stößen von hinten.',
          r1Label: 'Befehlen, sich an den Griffen festzuhalten',
          r2Label: 'Die Griffe fest umklammern & nachgeben',
          somaticZone: 'limbs_hands_wrists',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 236,
          type: 'scale',
          title: 'Sorgfältige Kantenpolsterung vor der Session',
          desc: 'Was es ist: Feste Regel: Niemals Druckstellen durch harte Holzkanten – Kissen und Tücher sind Pflicht.\nWas daran anmacht: Schmerz entsteht ausschließlich gezielt, niemals durch schlampige Lagerung.',
          r1Label: 'Kissen und Handtücher sorgsam unterlegen',
          r2Label: 'Bequem und schmerzfrei gebettet sein',
          somaticZone: 'full_body',
          equipmentTags: ['blanket'],
          restraintLayer: 0
        },
        {
          id: 237,
          type: 'scale',
          title: 'Verstellbare Höhen bei Liegeböcken',
          desc: 'Was es ist: Die Liegehöhe exakt anpassen, damit beide Partner ergonomisch agieren können.\nWas daran anmacht: Schont den Rücken des Tops und ermöglicht präzise Schlagwinkel.',
          r1Label: 'Die Höhe für den perfekten Schlagwinkel einstellen',
          r2Label: 'Auf passender Höhe ruhig liegen',
          somaticZone: 'gluteal_pelvis',
          equipmentTags: ['spanking_bench'],
          restraintLayer: 0
        },
        {
          id: 238,
          type: 'scale',
          title: 'Aufrechte Haltung am Türrahmen',
          desc: 'Was es ist: Die Hände mit Riemen oben am Türrahmen befestigen; aufrecht stehen und empfangen.\nWas daran anmacht: Der Raum wird zur Bühne; der Körper steht kerzengerade und unbeweglich im Durchgang.',
          r1Label: 'Am Türrahmen fixieren & herantreten',
          r2Label: 'Im Durchgang stehend verharren',
          somaticZone: 'full_body',
          equipmentTags: ['cuffs'],
          restraintLayer: 2
        },
        {
          id: 239,
          type: 'scale',
          title: 'Gemeinsames Prüfen aller Halterungen vorab',
          desc: 'Was es ist: Vor der Session alle Schrauben, Haken und Seilanker auf festen Sitz testen.\nWas daran anmacht: Schafft unerschütterliche seelische Sicherheit: Das Equipment hält bombenfest.',
          r1Label: 'Die Stabilität aufmerksam testen',
          r2Label: 'Wissen, dass alles sicher hält',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 240,
          type: 'choice',
          title: 'Bevorzugtes BDSM-Möbelstück',
          desc: 'Welche stabile Vorrichtung im Raum reizt dich am meisten?',
          question: 'Welches Möbelstück findest du am interessantesten?',
          somaticZone: 'full_body',
          options: [
            { val: 'pillory', label: 'Hand-Hals-Pranger (Feste Präsentation im Raum)' },
            { val: 'bench', label: 'Bequeme Spanking-Bank mit Beckenerhöhung' },
            { val: 'sling', label: 'Liebesschaukel an der Decke (Schwerelose Leichtigkeit)' },
            { val: 'none', label: 'Ein normales Bett mit Gurten reicht mir völlig aus' }
          ]
        }
      ]
    },

    {
      id: 15,
      slug: 'chapter_15_masks_blindfolds_sensory_deprivation',
      title: 'Kapitel 15: Masken, Augenbinden & Sinnesentzug',
      desc: 'Ausschalten visueller oder auditiver Reize: Augenbinden, Kopfhörer, Knebel und sensorische Stille.',
      items: [
        {
          id: 241,
          type: 'scale',
          title: 'Blickdichte Leder-Augenbinde (Blindfold)',
          desc: 'Was es ist: Lichtdichtes Verbinden der Augen; jede Berührung und jedes Geräusch wird überraschend erlebt.\nWas daran anmacht: Nimmt die visuelle Vorwarnung; steigert die Hautsensibilität um ein Vielfaches.',
          r1Label: 'Die Augenbinde anlegen & Reize setzen',
          r2Label: 'Blind vertrauen & Berührungen empfangen',
          somaticZone: 'head_eyes',
          equipmentTags: ['blindfold'],
          restraintLayer: 1
        },
        {
          id: 242,
          type: 'scale',
          title: 'Weicher Seidenschal über den Augen',
          desc: 'Was es ist: Ein federleichtes Tuch sanft um den Kopf binden; dunkel, aber schwerelos auf den Lidern.\nWas daran anmacht: Sanfter Einstieg in den Sehentzug ohne starren Riemendruck.',
          r1Label: 'Den Seidenschal sanft knoten',
          r2Label: 'Unter der weichen Seide abtauchen',
          somaticZone: 'head_eyes',
          equipmentTags: ['silk'],
          restraintLayer: 1
        },
        {
          id: 243,
          type: 'scale',
          title: 'Konturierte Schaumstoff-Schlafmaske',
          desc: 'Was es ist: Eine bequeme 3D-Schlafbrille, die keinen Druck auf die Augäpfel ausübt, aber vollkommen abdunkelt.\nWas daran anmacht: Man kann die Augen im Dunkeln öffnen, sieht aber absolut nichts.',
          r1Label: 'Die Maske aufsetzen & Dunkelheit schaffen',
          r2Label: 'In völliger Dunkelheit lauschen',
          somaticZone: 'head_eyes',
          equipmentTags: ['blindfold'],
          restraintLayer: 1
        },
        {
          id: 244,
          type: 'scale',
          title: 'Vollmaske ohne Gesichtsöffnung (Zenith Hood)',
          desc: 'Was es ist: Eine geschlossene Haube ohne Öffnungen für Augen oder Mund; nur Atemlöcher an der Nase.\nWas daran anmacht: Radikaler Sinnesentzug; der Träger existiert nur noch im eigenen Atemrhythmus.',
          r1Label: 'Die Haube anlegen & Reize dosieren',
          r2Label: 'In der Haube stecken & abtauchen',
          somaticZone: 'head_face',
          equipmentTags: ['mask'],
          restraintLayer: 2
        },
        {
          id: 245,
          type: 'scale',
          title: 'Silikon-Ballknebel mit Atemlöchern (Ball Gag)',
          desc: 'Was es ist: Ein weicher Silikonball zwischen den Zähnen, der mit Riemen am Hinterkopf festgeschnallt wird.\nWas daran anmacht: Verhindert artikuliertes Sprechen; Stöhnen wird zu dumpfen Lauten.',
          r1Label: 'Den Ballknebel anlegen & festschnallen',
          r2Label: 'Den Knebel tragen & nur stöhnen können',
          somaticZone: 'head_mouth',
          equipmentTags: ['gag'],
          restraintLayer: 1
        },
        {
          id: 246,
          type: 'scale',
          title: 'Offener Ringknebel (Ring Gag)',
          desc: 'Was es ist: Ein Metall- oder Gummiring, der den Mund weit geöffnet arretiert.\nWas daran anmacht: Freier Blick auf Zunge und Zähne; ermöglicht Oralservice oder Spuckespiele bei geöffnetem Mund.',
          r1Label: 'Den Ringknebel einsetzen & Mund mustern',
          r2Label: 'Mit geöffnetem Mund arretiert sein',
          somaticZone: 'head_mouth',
          equipmentTags: ['gag'],
          restraintLayer: 1
        },
        {
          id: 247,
          type: 'scale',
          title: 'Weicher Tuchknebel zwischen den Zähnen',
          desc: 'Was es ist: Ein sauberes Stoff- oder Seidentuch fest zwischen die Zähne binden und am Nacken knoten.\nWas daran anmacht: Angenehm nachgiebig im Kiefer; dämpft Laute sanft ohne Härte.',
          r1Label: 'Das Tuch sanft zwischen die Zähne binden',
          r2Label: 'In das weiche Tuch beißen & schweigen',
          somaticZone: 'head_mouth',
          equipmentTags: ['silk'],
          restraintLayer: 1
        },
        {
          id: 248,
          type: 'scale',
          title: 'Speichelfaden-Pflege beim Knebeltragen',
          desc: 'Was es ist: Ein Tuch unterlegen und den Speichel behutsam abtupfen, der beim Tragen unwillkürlich fließt.\nWas daran anmacht: Liebevolle Fürsorge inmitten der Erniedrigung des Knebels.',
          r1Label: 'Aufmerksam den Speichel abtupfen & streicheln',
          r2Label: 'Wissen, dass man achtsam gepflegt wird',
          somaticZone: 'head_mouth',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 249,
          type: 'scale',
          title: 'Schweigegebot nach Abnahme des Knebels',
          desc: 'Was es ist: Nach dem Öffnen des Knebels noch 5 Minuten reglos schweigen, bevor gesprochen werden darf.\nWas daran anmacht: Dehnt die Disziplin aus; der Kiefer entspannt sich in vollkommener Ruhe.',
          r1Label: 'Die Stille nach dem Knebeln einfordern',
          r2Label: 'Stumm den Kiefer entspannen & lauschen',
          somaticZone: 'head_mouth',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 250,
          type: 'scale',
          title: 'Kopfmassage bei verbundenen Augen',
          desc: 'Was es ist: Nichts sehen können, während warme Hände langsam die Kopfhaut und Schläfen kneten.\nWas daran anmacht: Fokussiert die Wahrnehmung ganz auf die Fingerkuppen; löst sofortige Trance aus.',
          r1Label: 'Den blinden Partner am Kopf massieren',
          r2Label: 'Blind die warmen Hände am Kopf genießen',
          somaticZone: 'head_neck',
          equipmentTags: ['blindfold'],
          restraintLayer: 1
        },
        {
          id: 251,
          type: 'scale',
          title: 'Unerwartete Berührungsorte im Dunkeln',
          desc: 'Was es ist: Der Partner sieht nichts; plötzlich berührt ein warmer Finger die Kniekehle oder den Nacken.\nWas daran anmacht: Das permanente, süße Erschauern vor dem nächsten taktilen Impuls.',
          r1Label: 'Unerwartete Reizpunkte sanft setzen',
          r2Label: 'Erschauern, wo die nächste Hand landet',
          somaticZone: 'torso_skin',
          equipmentTags: ['blindfold'],
          restraintLayer: 1
        },
        {
          id: 252,
          type: 'scale',
          title: 'Geschmacks-Rätsel mit verbundenen Augen',
          desc: 'Was es ist: Honig, Zitrone, Schokolade oder Eis blind mit der Zunge kosten und erraten müssen.\nWas daran anmacht: Schärft den Geschmackssinn; der Mund wird zum zentralen Erkundungsorgan.',
          r1Label: 'Leckereien blind anreichen & prüfen',
          r2Label: 'Mit geschlossenen Augen kosten & erraten',
          somaticZone: 'head_mouth',
          equipmentTags: ['blindfold'],
          restraintLayer: 1
        },
        {
          id: 253,
          type: 'scale',
          title: 'Geruchs-Rätsel im Dunkeln',
          desc: 'Was es ist: Den blinden Partner an Leder, Parfüm, Kaffee oder Wachs riechen lassen.\nWas daran anmacht: Aktiviert das olfaktorische Gedächtnis; Gerüche lösen sofort Emotionen aus.',
          r1Label: 'Düfte vor die Nase halten & fragen',
          r2Label: 'Mit verbundenen Augen riechen & erraten',
          somaticZone: 'head_face',
          equipmentTags: ['blindfold'],
          restraintLayer: 1
        },
        {
          id: 254,
          type: 'scale',
          title: 'Eiswürfel blind auf die Haut setzen',
          desc: 'Was es ist: Ohne Vorwarnung einen schmelzenden Eiswürfel an Bauchnabel oder Schenkel halten.\nWas daran anmacht: Der Kälteschock trifft das unvorbereitete Nervensystem mit maximaler Wucht.',
          r1Label: 'Das Eis überraschend auf die Haut legen',
          r2Label: 'Den plötzlichen Kältekick blind empfangen',
          somaticZone: 'torso_skin',
          equipmentTags: ['ice', 'blindfold'],
          restraintLayer: 1
        },
        {
          id: 255,
          type: 'scale',
          title: 'Warmer Föhnwind auf nackter Haut',
          desc: 'Was es ist: Den blinden Partner mit warmer Föhnluft an Bauch, Nacken und Rücken liebkosen.\nWas daran anmacht: Sanfter Luftzugreiz ohne physische Berührung; erzeugt flächige Gänsehaut.',
          r1Label: 'Den warmen Föhnwind über die Haut führen',
          r2Label: 'Den warmen Luftstrom blind genießen',
          somaticZone: 'torso_skin',
          equipmentTags: ['blindfold'],
          restraintLayer: 1
        },
        {
          id: 256,
          type: 'scale',
          title: 'Flüstern von allen Seiten im Raum',
          desc: 'Was es ist: Um den blinden Partner herumgehen und abwechselnd ins linke und rechte Ohr hauchen.\nWas daran anmacht: Räumliche Desorientierung; die Stimme scheint überall im Zimmer zu schweben.',
          r1Label: 'Um den Partner herumgehen & flüstern',
          r2Label: 'Lauschen, von welcher Seite die Stimme kommt',
          somaticZone: 'head_ears',
          equipmentTags: ['blindfold'],
          restraintLayer: 1
        },
        {
          id: 257,
          type: 'scale',
          title: 'Noise-Cancelling-Kopfhörer (Schallisolierung)',
          desc: 'Was es ist: Vollständiges Ausblenden aller Umgebungsgeräusche durch Kopfhörer; absolute innere Stille.\nWas daran anmacht: Kapselt den Partner hermetisch von der Außenwelt ab; das eigene Herzklopfen wird laut.',
          r1Label: 'Die Kopfhörer aufsetzen & Stille steuern',
          r2Label: 'Akustisch isoliert sein & nach innen horchen',
          somaticZone: 'head_ears',
          equipmentTags: ['headphones'],
          restraintLayer: 1
        },
        {
          id: 258,
          type: 'scale',
          title: 'Binaurale Beats & Hypnose-Frequenzen',
          desc: 'Was es ist: Ruhige Alpha- oder Theta-Wellen auf die Kopfhörer legen, die das Gehirn entspannen.\nWas daran anmacht: Beschleunigt das Abgleiten in den Subspace durch synchrone Klangwellen.',
          r1Label: 'Die Klangfrequenzen starten & begleiten',
          r2Label: 'Mit den Tönen tief in Trance versinken',
          somaticZone: 'head_ears',
          equipmentTags: ['headphones'],
          restraintLayer: 1
        },
        {
          id: 259,
          type: 'scale',
          title: 'Handdrück-Sicherheitssignal bei Knebel',
          desc: 'Was es ist: 2x Drücken = Alles gut; Hand lässt los = Sofortiger Handlungsstopp (RACK-Standard).\nWas daran anmacht: Nonverbale Rettungsleine; garantiert Sicherheit auch ohne gesprochene Worte.',
          r1Label: 'Ständig die Hand des Partners halten & fühlen',
          r2Label: 'Mit dem Handdruck das Sicherheitssignal geben',
          somaticZone: 'limbs_hands_wrists',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 260,
          type: 'scale',
          title: 'Totaler Sinnesentzug (Blind, taub & fixiert)',
          desc: 'Was es ist: Kombination aus Augenbinde, Kopfhörern und fixierten Händen für vollkommene Passivität.\nWas daran anmacht: Schaltet alle Kontrollmechanismen ab; der Körper wird zu einer reinen Empfindungsfläche.',
          r1Label: 'Alle Sinne ausschalten & Reize dosieren',
          r2Label: 'Vollkommen ausgeliefert in die Stille abtauchen',
          somaticZone: 'full_body',
          equipmentTags: ['blindfold', 'headphones', 'cuffs'],
          restraintLayer: 2
        },
        {
          id: 261,
          type: 'choice',
          title: 'Bevorzugte Form des Sinnesentzugs',
          desc: 'Welche Art von sensorischer Reduktion schaltet deinen Kopf am besten ab?',
          question: 'Welche Form von Sinnesentzug gefällt dir am besten?',
          somaticZone: 'head_face',
          options: [
            { val: 'blindfold', label: 'Nur eine bequeme Leder- oder Seiden-Augenbinde' },
            { val: 'headphones', label: 'Kopfhörer mit Stille oder Trance-Klängen' },
            { val: 'total', label: 'Totaler Sinnesentzug (Blind, taub & gefesselt)' },
            { val: 'none', label: 'Ich möchte immer genau sehen und hören, was geschieht' }
          ]
        }
      ]
    },

    {
      id: 16,
      slug: 'chapter_16_impact_play_spanking',
      title: 'Kapitel 16: Impact Play: Spanking, Flogger & Paddle',
      desc: 'Dosierter Schmerzreiz als emotionales Ventil, Wärmeerzeugung und Katharsis: Hände, Paddles und Flogger.',
      items: [
        {
          id: 262,
          type: 'scale',
          title: 'Warmes Handspanking auf das nackte Gesäß',
          desc: 'Was es ist: Rhythmische Schläge mit der flachen Hand zur sanften Erwärmung des Gewebes.\nWas daran anmacht: Direkte Körper-zu-Körper Resonanz; regt die Durchblutung an und baut emotionale Spannung ab.',
          r1Label: 'Handspanking dosiert & rhythmisch anwenden',
          r2Label: 'Die klatschenden Schläge mit der Hand empfangen',
          somaticZone: 'gluteal_pelvis',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 263,
          type: 'scale',
          title: 'Spanking über die Knie gelegt (Over the Knee)',
          desc: 'Was es ist: Quer über den Oberschenkeln des sitzenden Partners liegen; Beine am Boden oder eingeklemmt.\nWas daran anmacht: Klassische Zuchthaltung; vereint Demut mit dem schützenden Schoß des Führenden.',
          r1Label: 'Den Partner über die Knie legen & halten',
          r2Label: 'Über den Knien liegen & versohlt werden',
          somaticZone: 'gluteal_pelvis',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 264,
          type: 'scale',
          title: 'Breites Leder-Paddle (Flächig & dumpf)',
          desc: 'Was es ist: Ein schweres Sattelleder-Paddle für dumpfe, großflächige Reizübertragung ohne Spitzen.\nWas daran anmacht: Satter, tiefer Klang; erzeugt wohlige Hitze tief im Muskelgewebe ohne Hautrisse.',
          r1Label: 'Das Paddle mit ruhiger Wucht führen',
          r2Label: 'Die dumpfen Hiebe mit dem Paddle empfangen',
          somaticZone: 'gluteal_pelvis',
          equipmentTags: ['paddle'],
          restraintLayer: 0
        },
        {
          id: 265,
          type: 'scale',
          title: 'Wildleder-Flogger (Viele sanfte Riemen)',
          desc: 'Was es ist: Ein Flogger mit 30 bis 50 weichen Lederriemen, der flächig auf den Po prasselt.\nWas daran anmacht: Wie ein warmer, schwerer Schauer; breitet die Schmerz-Hitze gleichmäßig über das Gesäß aus.',
          r1Label: 'Den Flogger rhythmisch schwingen',
          r2Label: 'Das Prasseln der Riemen auf der Haut spüren',
          somaticZone: 'gluteal_pelvis',
          equipmentTags: ['flogger'],
          restraintLayer: 0
        },
        {
          id: 266,
          type: 'scale',
          title: 'Langsames Steigern der Schlagintensität',
          desc: 'Was es ist: Sehr sanft beginnen und die Kraft über 15 Minuten stufenweise anziehen (Einfliegen).\nWas daran anmacht: Gibt den Endorphinen Zeit zur Ausschüttung; der Schmerz schlägt spürbar in wohlige Glut um.',
          r1Label: 'Die Intensität behutsam Stufe für Stufe heben',
          r2Label: 'Spüren, wie die Haut warm wird & sich öffnet',
          somaticZone: 'gluteal_pelvis',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 267,
          type: 'scale',
          title: 'Mitzählen der Schläge durch den Bottom',
          desc: 'Was es ist: Nach jedem Hieb laut mitzählen: „Eins, danke Herrin/Sir“, „Zwei, danke...“.\nWas daran anmacht: Geistige Disziplin unter Reiz; der Bottom muss konzentriert bleiben und seine Stimme nutzen.',
          r1Label: 'Auf das laute, fehlerfreie Mitzählen achten',
          r2Label: 'Die Hiebe laut und andächtig mitzählen',
          somaticZone: 'head_mouth',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 268,
          type: 'scale',
          title: 'Flache Hand auf den heißen Po legen (Kühlen)',
          desc: 'Was es ist: Nach harten Hieben die kühle Handfläche ruhig auf die glühende Rötung pressen.\nWas daran anmacht: Erlösender Kühleffekt; beruhigt die Nervenbahnen und spendet Trost.',
          r1Label: 'Die Hand ruhig zur Beruhigung auflegen',
          r2Label: 'Die lindernde Kühle auf dem Feuer genießen',
          somaticZone: 'gluteal_pelvis',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 269,
          type: 'scale',
          title: 'Schläge auf die Oberschenkel-Außenseiten',
          desc: 'Was es ist: Dosierte Hiebe auf die feste Muskulatur der Oberschenkel abseits des Gesäßes.\nWas daran anmacht: Verteilt den Hitzereiz; die Beine fangen an zu kribbeln und entspannen sich.',
          r1Label: 'Die Schenkel mit Schlägen erwärmen',
          r2Label: 'Die Schläge auf den Oberschenkeln spüren',
          somaticZone: 'thighs_inner',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 270,
          type: 'scale',
          title: 'Kontrollierter Wangenklaps (Face Slap)',
          desc: 'Was es ist: Ein sehr dosierter, flacher Schlag mit den Fingern auf die Wange als Signal von Dominanz.\nWas daran anmacht: Symbolische Zurechtweisung; bricht den Alltagsstolz und holt den Blick sofort zum Top.',
          r1Label: 'Den kontrollierten Wangenstreich setzen',
          r2Label: 'Den leichten Schlag annehmen & Haltung wahren',
          somaticZone: 'head_face',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 271,
          type: 'scale',
          title: 'Tränen zulassen beim Schmerz (Katharsis)',
          desc: 'Was es ist: Wenn durch den Schmerz Tränen fließen, weinen dürfen, während der Top liebevoll weitermacht.\nWas daran anmacht: Tiefe seelische Entlastung; Schmerz wirkt als Ventil für aufgestauten Alltagsstress.',
          r1Label: 'Die Tränen sehen & liebevoll weiterleiten',
          r2Label: 'Die Tränen laufen lassen & Ballast abwerfen',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 272,
          type: 'scale',
          title: 'Schwere Hiebe mit festem Lederriemen (Gürtel)',
          desc: 'Was es ist: Ein gefalteter Ledergürtel, der mit sattem Klatschen auf die Gesäßmuskeln trifft.\nWas daran anmacht: Urtypische Zuchtmaßnahme; das Schnalzen des Leders erzeugt ehrfürchtigen Respekt.',
          r1Label: 'Den Gürtel mit ruhiger Kraft schwingen',
          r2Label: 'Die Wucht des Lederriemens aushalten',
          somaticZone: 'gluteal_pelvis',
          equipmentTags: ['leather_belt'],
          restraintLayer: 0
        },
        {
          id: 273,
          type: 'scale',
          title: 'Holz-Paddle mit Lochung (Knackiger Reiz)',
          desc: 'Was es ist: Ein poliertes Hartholzbrettchen, das durch Luftlöcher schneller und knackiger trifft.\nWas daran anmacht: Hellerer, stechenderer Klang und fokussierter Hitzekick auf der Haut.',
          r1Label: 'Das Holzpaddle präzise anwenden',
          r2Label: 'Den knackigen Holztreffer aushalten',
          somaticZone: 'gluteal_pelvis',
          equipmentTags: ['paddle'],
          restraintLayer: 0
        },
        {
          id: 274,
          type: 'scale',
          title: 'Pferdehaar-Peitsche (Sanft-brennender Reiz)',
          desc: 'Was es ist: Feine Rosshaare, die wie ein stechender Windhauch über die Haut streifen.\nWas daran anmacht: Oberflächliches Brennen ohne Muskelquetschung; hinterlässt feines Glühen.',
          r1Label: 'Das Rosshaar über den Rücken ziehen',
          r2Label: 'Das feine Brennen auf der Haut spüren',
          somaticZone: 'torso_skin',
          equipmentTags: ['flogger'],
          restraintLayer: 0
        },
        {
          id: 275,
          type: 'scale',
          title: 'Schlanke Reitgerte (Crop / Scharfer Schmerz)',
          desc: 'Was es ist: Präzise gesetzte Hiebe mit der Klatsche einer Reitgerte auf Gesäß oder Oberschenkel.\nWas daran anmacht: Scharfer, eng begrenzter Schmerzpunkt; verlangt höchste Treffsicherheit und Disziplin.',
          r1Label: 'Die Gerte punktgenau führen',
          r2Label: 'Den scharfen Schmerzpunkt diszipliniert ertragen',
          somaticZone: 'thighs_inner',
          equipmentTags: ['crop'],
          restraintLayer: 0
        },
        {
          id: 276,
          type: 'scale',
          title: 'Schläge auf die Fußsohlen (Bastinado)',
          desc: 'Was es ist: Dosierte Hiebe mit einem flachen Lederband auf die nackten Fußsohlen.\nWas daran anmacht: Fußsohlen haben viele Nervenbahnen; der Reiz strahlt tief in die Beine aus.',
          r1Label: 'Die Fußsohlen behutsam versohlen',
          r2Label: 'Das Brennen auf den Sohlen aushalten',
          somaticZone: 'limbs_ankles_feet',
          equipmentTags: ['paddle'],
          restraintLayer: 0
        },
        {
          id: 277,
          type: 'scale',
          title: 'Eiswürfel auf geschlagene Haut legen (Fire & Ice)',
          desc: 'Was es ist: Nach dem Spanking schmelzendes Eis über die glühende Haut streichen.\nWas daran anmacht: Kälteschock auf erhitzter Haut; betäubt den Schmerz und hinterlässt tiefes Kribbeln.',
          r1Label: 'Das Eis über den heißen Po gleiten lassen',
          r2Label: 'Die erlösende Kälte auf dem Feuer spüren',
          somaticZone: 'gluteal_pelvis',
          equipmentTags: ['ice'],
          restraintLayer: 0
        },
        {
          id: 278,
          type: 'scale',
          title: 'Pflege mit Arnika-Balsam nach dem Spanking',
          desc: 'Was es ist: Die gerötete Haut nach der Session andächtig mit kühlendem Arnika-Balsam einreiben.\nWas daran anmacht: Physische Heilung als Abschluss; beugt blauen Flecken vor und schenkt Trost.',
          r1Label: 'Den Po sanft einbalsamieren & pflegen',
          r2Label: 'Die sanfte Pflege nach dem Schmerz genießen',
          somaticZone: 'gluteal_pelvis',
          equipmentTags: ['oil'],
          restraintLayer: 0
        },
        {
          id: 279,
          type: 'scale',
          title: 'Strikte Tabu-Zonen beim Schlagen',
          desc: 'Was es ist: Eiserne Regel: Niemals auf Nieren, Wirbelsäule, Gelenke oder Hals schlagen – nur Fleischpartien.\nWas daran anmacht: RACK-Sicherheitsfundament; schützt lebenswichtige Organe vor Verletzung.',
          r1Label: 'Ausschließlich auf Gesäßmuskeln zielen',
          r2Label: 'Sicher sein, dass Knochen & Nieren geschont werden',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 280,
          type: 'scale',
          title: 'Küsse auf jede gerötete Stelle danach',
          desc: 'Was es ist: Jede getroffene Stelle nach der Zucht mit einem andächtigen Kuss versöhnen.\nWas daran anmacht: Hebt die Härte sofort auf und transformiert den Schmerz in reine Verbundenheit.',
          r1Label: 'Den Po mit liebevollen Küssen bedecken',
          r2Label: 'Jeden Kuss auf der warmen Haut spüren',
          somaticZone: 'gluteal_pelvis',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 281,
          type: 'scale',
          title: 'Schlagpause bei Erschöpfung einlegen',
          desc: 'Was es ist: Beim kleinsten Zögern oder bei Gelb sofort 2 Minuten Pause machen und tief durchatmen.\nWas daran anmacht: Verhindert Panik; beweist die ständige Achtsamkeit des Tops.',
          r1Label: 'Aufmerksam den Atem prüfen & pausieren',
          r2Label: 'Die Pause ohne Rechtfertigung annehmen',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 282,
          type: 'scale',
          title: 'Schläge zur sexuellen Erregung nutzen',
          desc: 'Was es ist: Die starke Durchblutung am Po nutzen, um direkt danach von hinten fordernd einzudringen.\nWas daran anmacht: Verbindet die Hitze des Gesäßes unmittelbar mit tiefster sexueller Vereinigung.',
          r1Label: 'Vom Spanking direkt zum Lieben übergehen',
          r2Label: 'Mit heißem Po empfangen & lieben',
          somaticZone: 'pelvis_core',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 283,
          type: 'scale',
          title: 'Schlagen nur aus ruhiger Autorität (Keine Wut)',
          desc: 'Was es ist: Strikte Regel: Niemals aus echtem Zorn schlagen; der Top bleibt vollkommen gelassen.\nWas daran anmacht: Reine disziplinarische Führung ohne emotionale Willkür oder Aggression.',
          r1Label: 'Die absolute innere Ruhe beim Schlag wahren',
          r2Label: 'Wissen, dass keine böse Wut im Raum ist',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 284,
          type: 'scale',
          title: 'Rötungs-Grenze vorab absprechen',
          desc: 'Was es ist: Vorher vereinbaren, wie rot die Haut werden darf: Nur Rosé, warmes Rot oder tiefe Striemen.\nWas daran anmacht: Klare visuelle Grenzziehung; schützt vor unbedachten Übertreibungen.',
          r1Label: 'Die vereinbarte Farb-Grenze strikt einhalten',
          r2Label: 'Die Härtegrenze vorher klar abstecken',
          somaticZone: 'gluteal_pelvis',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 285,
          type: 'scale',
          title: 'Befreiende Umarmung direkt nach dem Spanking',
          desc: 'Was es ist: Sobald der letzte Schlag verklungen ist, fest in den Arm nehmen und festhalten.\nWas daran anmacht: Fängt das Nervensystem auf; lässt beide Partner eng umschlungen zur Ruhe kommen.',
          r1Label: 'Den Partner an die Brust ziehen & halten',
          r2Label: 'Erschöpft im Arm versinken & ankommen',
          somaticZone: 'full_body',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 286,
          type: 'choice',
          title: 'Bevorzugtes Schlagwerkzeug',
          desc: 'Welche Art von Impact Play spricht deinen Körper am stärksten an?',
          question: 'Welches Schlagwerkzeug findest du am anziehendsten?',
          somaticZone: 'gluteal_pelvis',
          options: [
            { val: 'hand', label: 'Nur die warme, flache Hand (Spanking Over-the-Knee)' },
            { val: 'leather', label: 'Breite Leder-Paddles & schwerer Lederriemen' },
            { val: 'flogger', label: 'Weicher Wildleder-Flogger (Prasseln vieler Riemen)' },
            { val: 'none', label: 'Schläge und Spanking mag ich überhaupt nicht' }
          ]
        }
      ]
    },

    {
      id: 17,
      slug: 'chapter_17_cbt_genital_discipline',
      title: 'Kapitel 17: CBT, Hoden- & Genitalreize',
      desc: 'Gezielte Reizung von Penis und Hoden: Hodenringe, Gewichte, Klammern und achtsames Dehnen.',
      items: [
        {
          id: 287,
          type: 'scale',
          title: 'Hoden sanft in der warmen Hand wiegen',
          desc: 'Was es ist: Die Hoden des Mannes mit warmen Händen umfassen, leicht kneten und das Gewicht spüren.\nWas daran anmacht: Vermittelt Schutz und Geborgenheit an der empfindlichsten Zone des Mannes.',
          r1Label: 'Die Hoden in der Hand wiegen & liebkosen',
          r2Label: 'Die warme Hand an den Hoden genießen',
          somaticZone: 'genital_testicles',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 288,
          type: 'scale',
          title: 'Edelstahl-Hodenring (Schwere & Dehnung)',
          desc: 'Was es ist: Ein polierter Metallring, der über die Hoden gestreift wird und sie kühl nach unten zieht.\nWas daran anmacht: Kontinuierliches Ziehen bei jeder Bewegung; hält das Gemächt prall nach unten.',
          r1Label: 'Den Hodenring anlegen & das Gewicht prüfen',
          r2Label: 'Den schweren Ring tragen & Dehnung spüren',
          somaticZone: 'genital_testicles',
          equipmentTags: ['ball_stretcher'],
          restraintLayer: 1
        },
        {
          id: 289,
          type: 'scale',
          title: 'Lederband zum Abbinden der Hoden',
          desc: 'Was es ist: Ein weicher Lederriemen mit Schnalle, der die Hoden straff von der Peniswurzel trennt.\nWas daran anmacht: Optische Hervorhebung; staut die Durchblutung leicht und erhöht die Berührungsempfindlichkeit.',
          r1Label: 'Den Riemen um die Hoden festziehen',
          r2Label: 'Die pralle Trennung der Hoden spüren',
          somaticZone: 'genital_testicles',
          equipmentTags: ['ball_stretcher'],
          restraintLayer: 1
        },
        {
          id: 290,
          type: 'scale',
          title: 'Sanfte Klatscher auf die Hoden mit Fingern',
          desc: 'Was es ist: Sehr behutsame, dosierte Klapser mit den Fingerkuppen auf den Hodensack.\nWas daran anmacht: Zieht dumpf in den Bauchraum; testet die Demut des Mannes an seiner verwundbarsten Stelle.',
          r1Label: 'Mit den Fingern dosiert an die Hoden tippen',
          r2Label: 'Das Ziehen im Bauchraum spüren & aushalten',
          somaticZone: 'genital_testicles',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 291,
          type: 'scale',
          title: 'Wäscheklammern an den Brustwarzen des Mannes',
          desc: 'Was es ist: Gepolsterte Klammern an die Nippel setzen und nach einigen Minuten mit Schwung abziehen.\nWas daran anmacht: Kontinuierlicher Beißschmerz gefolgt von einer intensiven Durchblutungswelle beim Abnehmen.',
          r1Label: 'Die Klammern setzen & später abziehen',
          r2Label: 'Den Klammerdruck & den Abreiß-Kick ertragen',
          somaticZone: 'chest_nipples',
          equipmentTags: ['clamps'],
          restraintLayer: 1
        },
        {
          id: 292,
          type: 'scale',
          title: 'Kleeblattklemmen mit kleinen Gewichten',
          desc: 'Was es ist: Verstellbare Klemmen mit Gummipuffern, an die kleine Metallgewichte gehängt werden.\nWas daran anmacht: Gleichmäßiger Zug nach unten; zwingt zu ruhiger Haltung, da jede Erschütterung zieht.',
          r1Label: 'Die Gewichte anbringen & Zug kontrollieren',
          r2Label: 'Den kontinuierlichen Zug an den Nippeln spüren',
          somaticZone: 'chest_nipples',
          equipmentTags: ['clamps'],
          restraintLayer: 1
        },
        {
          id: 293,
          type: 'scale',
          title: 'Eiswürfel auf Hoden & Eichel gleiten lassen',
          desc: 'Was es ist: Schmelzendes Eis langsam über den Hodensack ziehen; die Haut zieht sich sofort zusammen.\nWas daran anmacht: Starker Kältereiz lässt den Hodensack straff werden und dämpft vorschnellen Samenerguss.',
          r1Label: 'Das Eis über Hoden & Glied führen',
          r2Label: 'Das intensive Zusammenziehen bei Kälte spüren',
          somaticZone: 'genital_testicles',
          equipmentTags: ['ice'],
          restraintLayer: 0
        },
        {
          id: 294,
          type: 'scale',
          title: 'Tragegeschirr für die Hoden (Ball Harness)',
          desc: 'Was es ist: Ein feines Leder- oder Riemengeschirr, das die Hoden einzeln einrahmt und fixiert.\nWas daran anmacht: Betont das maskuline Gemächt skulptural; bietet feste Haltegriffe für die Partnerin.',
          r1Label: 'Das Hoden-Harness anlegen & mustern',
          r2Label: 'Das Tragegeschirr am Gemächt tragen',
          somaticZone: 'genital_testicles',
          equipmentTags: ['ball_stretcher'],
          restraintLayer: 1
        },
        {
          id: 295,
          type: 'scale',
          title: 'Vibrations-Ei am Damm (Perineum)',
          desc: 'Was es ist: Ein kleines Vibro-Toy fest gegen die Brücke zwischen Hoden und After pressen.\nWas daran anmacht: Reizt die tiefen Nervenstränge der Beckenbodenmuskulatur und stimuliert die Prostata von außen.',
          r1Label: 'Das Toy am Damm anlegen & steuern',
          r2Label: 'Die tiefe innere Vibration empfangen',
          somaticZone: 'perineum_pelvic_floor',
          equipmentTags: ['vibrator'],
          restraintLayer: 0
        },
        {
          id: 296,
          type: 'scale',
          title: 'Forderndes Ziehen an den Hoden nach unten',
          desc: 'Was es ist: Mit den Fingern beide Hoden greifen und mit mäßiger Kraft langsam nach unten dehnen.\nWas daran anmacht: Erzeugt ein tiefes, erregendes Schweregefühl im gesamten Unterleib.',
          r1Label: 'Die Hoden greifen & sanft nach unten dehnen',
          r2Label: 'Das Dehnungsgefühl im Becken aushalten',
          somaticZone: 'genital_testicles',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 297,
          type: 'scale',
          title: 'Penisfesselung am Oberschenkel',
          desc: 'Was es ist: Den Penis mit einem weichen Lederband eng am Oberschenkel festbinden, sodass er flach anliegt.\nWas daran anmacht: Verhindert jede Aufrichtung; das Glied bleibt unbeweglich an das Bein gebunden.',
          r1Label: 'Den Penis am Schenkel festbinden',
          r2Label: 'Fixiert am Oberschenkel daliegen',
          somaticZone: 'genital_penile',
          equipmentTags: ['cuffs'],
          restraintLayer: 1
        },
        {
          id: 298,
          type: 'scale',
          title: 'Kitzeln der Hoden mit Borstenpinsel',
          desc: 'Was es ist: Nach dem Druck die feine Haut der Hoden mit einem Rasierpinsel sanft kitzeln.\nWas daran anmacht: Sensorischer Kontrast: Nach Schwere und Dehnung folgt federleichtes, kitzelndes Kribbeln.',
          r1Label: 'Mit dem Pinsel über die Hoden streichen',
          r2Label: 'Das feine Kitzeln nach dem Druck genießen',
          somaticZone: 'genital_testicles',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 299,
          type: 'scale',
          title: 'Strikte Schutzgrenze: Keine harten Schläge auf Hoden',
          desc: 'Was es ist: Eiserne RACK-Regel: Hoden sind empfindlich – Schläge mit Holz oder Absätzen sind verboten.\nWas daran anmacht: Schützt die Zeugungsfähigkeit und verhindert gefährliche Gewebsverletzungen.',
          r1Label: 'Die absolute Schutzgrenze für Hoden achten',
          r2Label: 'Sicher sein, dass keine Verletzungen drohen',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 300,
          type: 'scale',
          title: 'Handmassage der Hoden nach der Reizung',
          desc: 'Was es ist: Die strapazierten Hoden nach der Session andächtig mit warmem Öl wärmen und lockern.\nWas daran anmacht: Beruhigt den Muskeltonus und holt das Gemächt in wohlige Geborgenheit zurück.',
          r1Label: 'Die Hoden wärmen & sanft massieren',
          r2Label: 'Die wohlige Entlastung nach der Reizung spüren',
          somaticZone: 'genital_testicles',
          equipmentTags: ['oil'],
          restraintLayer: 0
        },
        {
          id: 301,
          type: 'scale',
          title: 'Abbinden der Peniswurzel (Cockring)',
          desc: 'Was es ist: Ein elastisches Silikon- oder Lederband eng um den Penisschaft legen.\nWas daran anmacht: Staut das Blut im Schwellkörper; macht die Erektion härter, praller und ausdauernder.',
          r1Label: 'Den Cockring anlegen & die Härte prüfen',
          r2Label: 'Die stramme Härte im Glied spüren',
          somaticZone: 'genital_penile',
          equipmentTags: ['cock_ring'],
          restraintLayer: 1
        },
        {
          id: 302,
          type: 'choice',
          title: 'Persönliche Hoden-Reizgrenze',
          desc: 'Deine individuelle Wohlfühl- und Schmerzgrenze bei CBT.',
          question: 'Wie weit darf die Reizung der Hoden gehen?',
          somaticZone: 'genital_testicles',
          options: [
            { val: 'gentle', label: 'Nur zärtliches Wiegen, Kneten & schwere Edelstahlringe' },
            { val: 'clamps', label: 'Auch Klammern, Gewichte & leichtes Ziehen erwünscht' },
            { val: 'none', label: 'An die Hoden lasse ich nur sanfte Hände und den Mund' }
          ]
        }
      ]
    },

    {
      id: 18,
      slug: 'chapter_18_primal_play_wrestling_bratting',
      title: 'Kapitel 18: Primal Play, Ringen & Bratting',
      desc: 'Instinkt und Jagdtrieb: Balgen auf der Matte, Kräftemessen, freche Blicke und liebevolles Bändigen.',
      items: [
        {
          id: 303,
          type: 'scale',
          title: 'Primal Wrestling (Matten-Ringen)',
          desc: 'Was es ist: Leidenschaftliches Ringen auf dem Boden; Kräftemessen ohne Schläge bis zur Kapitulation.\nWas daran anmacht: Reine Körperkraft und Schweiß; aktiviert archaische Rangordnungs-Instinkte.',
          r1Label: 'Den Partner niederringen & bändigen',
          r2Label: 'Kämpfen, zappeln & kapitulieren',
          somaticZone: 'full_body',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 304,
          type: 'scale',
          title: 'Die Jagd (Chase Play in der Wohnung)',
          desc: 'Was es ist: Flucht durch die Zimmer; der dominante Part verfolgt die Beute, stellt sie und packt sie.\nWas daran anmacht: Treibt den Puls hoch; verwandelt die Wohnung in ein erotisches Jagdrevier.',
          r1Label: 'Die Beute erjagen & packen',
          r2Label: 'Fliehen & erbeutet werden wollen',
          somaticZone: 'full_body',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 305,
          type: 'scale',
          title: 'Hände auf die Matte pinnen',
          desc: 'Was es ist: Beide Handgelenke des Partners mit Körpergewicht auf den Boden drücken und sich voll auflegen.\nWas daran anmacht: Unmittelbare Überlegenheit; der Liegende spürt das schwere Gewicht des Partners auf sich.',
          r1Label: 'Die Handgelenke am Boden fixieren',
          r2Label: 'Am Boden festgehalten daliegen & zappeln',
          somaticZone: 'limbs_hands_wrists',
          equipmentTags: [],
          restraintLayer: 1
        },
        {
          id: 306,
          type: 'scale',
          title: 'Nackenbisse beim Raufen (Love Bites)',
          desc: 'Was es ist: Mitten im Kampf beherzt, aber ohne Verletzung in Nacken, Schulter oder Trapezmuskel beißen.\nWas daran anmacht: Raubtierhaftes Markieren des Partners; hinterlässt prickelnde Zahnabdrücke.',
          r1Label: 'In Nacken & Schulter zubeißen',
          r2Label: 'Den festen Biss spüren & knurren',
          somaticZone: 'head_neck',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 307,
          type: 'scale',
          title: 'Fester Nackengriff (Scruffing)',
          desc: 'Was es ist: Den Partner fest im Nacken greifen wie eine Raubkatze ihr Junges, um ihn ruhigzustellen.\nWas daran anmacht: Löst einen biologischen Ruhigstell-Reflex aus; schenkt sofortiges Innehalten.',
          r1Label: 'Im Nacken packen & beruhigen',
          r2Label: 'Den Nackengriff spüren & stillhalten',
          somaticZone: 'head_neck',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 308,
          type: 'scale',
          title: 'Kitzeln als Waffe beim Niederringen',
          desc: 'Was es ist: Wenn der Partner sich wehrt, ihn mit gezieltem Kitzeln an den Rippen zum Aufgeben bringen.\nWas daran anmacht: Durchbricht verbissenen Ernst; bringt befreiendes Lachen und Atemnot ins Spiel.',
          r1Label: 'Unerbittlich kitzeln bis zum Abklopfen',
          r2Label: 'Wehrlos lachen & um Gnade bitten',
          somaticZone: 'torso_flanks',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 309,
          type: 'scale',
          title: 'Abklopfen als Kapitulation (Tap Out)',
          desc: 'Was es ist: Zweimaliges Klopfen auf Matte oder Körper beendet den Kampf sofort; der Sieger lässt locker.\nWas daran anmacht: Reviersicherheit: Der Kampf kann mit maximalem Einsatz geführt werden, weil die Notbremse sitzt.',
          r1Label: 'Sofort loslassen beim Abklopfen',
          r2Label: 'Abklopfen & die erlösende Niederlage spüren',
          somaticZone: 'full_body',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 310,
          type: 'scale',
          title: 'Kräftemessen Hände-in-Hände',
          desc: 'Was es ist: Finger ineinander verschränken und die Arme des Partners mit reiner Kraft niederdrücken.\nWas daran anmacht: Direkte Kraftübertragung von Muskel zu Muskel; der Stärkere triumphiert ohne Schmerz.',
          r1Label: 'Die Hände mit Kraft zu Boden drücken',
          r2Label: 'Dagegenhalten bis die Kraft nachlässt',
          somaticZone: 'limbs_hands_wrists',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 311,
          type: 'scale',
          title: 'Bratting (Absichtliches Frechsein & Testen)',
          desc: 'Was es ist: Schelmisches Provozieren oder Augenrollen, um eine liebevolle Zurechtweisung herauszufordern.\nWas daran anmacht: Testen der Führungskraft; der Bottom will spüren, dass der Top die Zügel in der Hand behält.',
          r1Label: 'Provokationen bändigen & maßregeln',
          r2Label: 'Frech provozieren & Grenzen testen',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 312,
          type: 'scale',
          title: 'Zunge herausstrecken & wegflitzen',
          desc: 'Was es ist: Den Partner schelmisch necken, die Zunge zeigen und schnell ins Schlafzimmer rennen.\nWas daran anmacht: Kindliche Leichtigkeit; lädt den Partner zur sofortigen Verfolgung ein.',
          r1Label: 'Den Frechdachs jagen & schnappen',
          r2Label: 'Wegflitzen & gefangen werden wollen',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 313,
          type: 'scale',
          title: 'Brat Taming (Körperliches Bändigen auf Knien)',
          desc: 'Was es ist: Den frechen Partner packen, auf den Schoß ziehen und so lange bändigen, bis er kichert und nachgibt.\nWas daran anmacht: Die Verwandlung von spielerischem Trotz in wohlige, schnurrende Ergebenheit.',
          r1Label: 'Den Partner fest in den Arm schließen & zähmen',
          r2Label: 'Zappeln bis man liebevoll gebändigt ist',
          somaticZone: 'full_body',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 314,
          type: 'scale',
          title: 'Huckepack-Angriff von hinten (Piggyback)',
          desc: 'Was es ist: Den Partner überraschend von hinten anspringen, am Rücken festklammern und umwerfen.\nWas daran anmacht: Spontanes Überraschungsmoment; nutzt das gesamte Körpergewicht für den Wurf.',
          r1Label: 'Den Partner abschütteln oder tragen',
          r2Label: 'Auf den Rücken springen & festhalten',
          somaticZone: 'full_body',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 315,
          type: 'scale',
          title: 'Knurren & Schnauben beim Kampf',
          desc: 'Was es ist: Instinktive Tierlaute beim Balgen austauschen; ganz ohne gesellschaftliche Zensur.\nWas daran anmacht: Schaltet den Verstand aus und holt die Kommunikation auf die Instinktebene.',
          r1Label: 'Den Partner fordernd anknurren',
          r2Label: 'Knurren, fauchen & sich spielerisch wehren',
          somaticZone: 'head_mouth',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 316,
          type: 'scale',
          title: 'Auspowern bis zum tiefen Keuchen',
          desc: 'Was es ist: Sich 10 Minuten vollkommen verausgaben, bis beide verschwitzt auf der Matte liegen.\nWas daran anmacht: Reiner Endorphin-Ausschuss durch körperliche Verausgabung vor der Intimität.',
          r1Label: 'Den Kampf bis zur Erschöpfung führen',
          r2Label: 'Vollkommen ausgepowert auf der Matte daliegen',
          somaticZone: 'full_body',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 317,
          type: 'scale',
          title: 'Kuschel-Überfall direkt nach dem Ringen',
          desc: 'Was es ist: Sobald der Kampf vorbei ist, mit vollem Gewicht auflegen und mit Küssen eindecken.\nWas daran anmacht: Plötzlicher Übergang von roher Kampfkraft zu schmelzender Zärtlichkeit.',
          r1Label: 'Den Bezwungenen mit Küssen eindecken',
          r2Label: 'Unter dem Partner liegen & geküsst werden',
          somaticZone: 'full_body',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 318,
          type: 'choice',
          title: 'Präferenz für körperliches Kräftemessen',
          desc: 'Deine persönliche Haltung zu Ringen, Jagen und neckendem Trotz.',
          question: 'Wie spielerisch darf es zwischen euch zugehen?',
          somaticZone: 'full_body',
          options: [
            { val: 'primal', label: 'Echtes Ringen, Beißen & Balgen auf der Matte' },
            { val: 'brat', label: 'Freches Necken (Bratting) & liebevolles Bändigen' },
            { val: 'calm', label: 'Lieber ruhige, andächtige Erotik ohne Kämpfen' },
            { val: 'none', label: 'Ringen oder Raufen empfinde ich eher als Stress' }
          ]
        }
      ]
    },

    {
      id: 19,
      slug: 'chapter_19_caregiver_ddlg_nurturing',
      title: 'Kapitel 19: Caregiver, DDLG & Geborgenheit',
      desc: 'Mentale Regression, Fürsorge und Caregiver-Hierarchie: Zwischen vollkommener Verantwortung und kindlicher Hingabe.',
      items: [
        {
          id: 319,
          type: 'scale',
          title: 'Mentale Regression in den Little Space',
          desc: 'Was es ist: Alle Erwachsenen-Verantwortung abgeben; sich wie ein schutzbedürftiges Wesen leiten lassen.\nWas daran anmacht: Für den Caregiver reine beschützende Führsorge. Für das Little absolute Erlösung vom Leistungsdruck.',
          r1Label: 'Als Caregiver den Partner mental führen & beschützen',
          r2Label: 'In den Little Space gleiten & mich leiten lassen',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 320,
          type: 'scale',
          title: 'Erwachsenen-Schnuller & Nuckelflaschen',
          desc: 'Was es ist: Nuckel oder Saugerflaschen im Bett nutzen zur Beruhigung und Reizdämpfung.\nWas daran anmacht: Löst einen archaischen Saugbefriedigungs-Reflex aus; dämpft Sprache und Redebedarf.',
          r1Label: 'Den Schnuller reichen & Schweigen schenken',
          r2Label: 'Den Schnuller tragen & nicht sprechen müssen',
          somaticZone: 'head_mouth',
          equipmentTags: ['pacifier'],
          restraintLayer: 0
        },
        {
          id: 321,
          type: 'scale',
          title: 'Feste Bettgehzeiten & Alltags-Regeln',
          desc: 'Was es ist: Vorgaben durch den Caregiver: Feste Schlafenszeiten, Medienpausen oder Pflicht-Ruhe.\nWas daran anmacht: Strukturierte Führung entlastet den Partner von der eigenen Tagesplanung.',
          r1Label: 'Schlafenszeiten vorgeben & Einhaltung prüfen',
          r2Label: 'Mich den Regeln fügen & Geborgenheit spüren',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 322,
          type: 'scale',
          title: 'Zurechtweisung bei Trotzanfällen (OTK-Spanking)',
          desc: 'Was es ist: Wenn das Little quengelt oder trotzt: Disziplinierung über den Oberschenkeln des Caregivers.\nWas daran anmacht: Setzt klare Leitplanken; bricht die kindliche Frechheit und führt zu erlösenden Tränen.',
          r1Label: 'Das quengelnde Little über die Knie legen & züchtigen',
          r2Label: 'Wegen Trotzes über die Knie gelegt & gebändigt werden',
          somaticZone: 'gluteal_pelvis',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 323,
          type: 'scale',
          title: 'Gefüttert werden Bissen für Bissen',
          desc: 'Was es ist: Der Partner nutzt kein Besteck, sondern wird vom Caregiver Bissen für Bissen gefüttert.\nWas daran anmacht: Vollkommene Entmündigung bei Tisch; das Essen wird zu einem reinen Empfangsakt.',
          r1Label: 'Den Partner Bissen für Bissen andächtig füttern',
          r2Label: 'Den Mund öffnen & gefüttert werden',
          somaticZone: 'head_mouth',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 324,
          type: 'scale',
          title: 'Strampler, Onesies & Rüschenwäsche tragen',
          desc: 'Was es ist: Bequeme Erwachsenen-Strampler mit Schrittknöpfen oder weiche Onesies zu Hause tragen.\nWas daran anmacht: Weiche Textilien ohne Bunddruck; visuelles Bekenntnis zur kindlichen Geborgenheit.',
          r1Label: 'Den Partner feierlich einkleiden & knöpfen',
          r2Label: 'Vom Caregiver angezogen werden & den Strampler tragen',
          somaticZone: 'torso_skin',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 325,
          type: 'scale',
          title: 'Windeln & Padded Play (ABDL / Windel-Fetisch)',
          desc: 'Was es ist: Das Tragen von dicken Erwachsenenwindeln; Wickeln und Pudern durch den Caregiver.\nWas daran anmacht: Das dicke Polster zwischen den Beinen erzwingt eine breitere Gangart und maximale Hilflosigkeit.',
          r1Label: 'Den Partner wickeln, pudern & die Windel verschließen',
          r2Label: 'Gewickelt werden & das dicke Polster tragen',
          somaticZone: 'gluteal_pelvis',
          equipmentTags: ['diaper'],
          restraintLayer: 1
        }
      ]
    }
  ];

  window.surveyChaptersPart2 = surveyChaptersPart2;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = surveyChaptersPart2;
  }

})(typeof window !== 'undefined' ? window : this);
