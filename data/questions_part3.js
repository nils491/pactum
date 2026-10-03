/**
 * data/questions_part3.js
 * TACTUS Psychometrischer Konsens-Katalog · Teil 3 (Kapitel 20 bis 36 & Schutzkapitel 00 · Items 326 bis 500 & 901 bis 905)
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien nach Master-Roadbook & Governance-Verfassung:
 * - 100 % UTF-8 Integrität: Echte deutsche Umlaute (ä, ö, ü, ß) im gesamten Modul
 * - Gesunder Menschenverstand & Reiz-Klarheit: Beseitigung absurder Metaphern
 * - Dreiklang pro Item: Was es ist, Was daran anmacht (Top/Bottom Psychologie) & griffige Labels
 * - Kinetische & somatische Metadaten (somaticZone, equipmentTags, restraintLayer) für DoF & Staging
 * - Trennung von Inhalten: Keine Vermischung mit dem Fachlexikon (gehört in guide.html)
 * - Globale Bereitstellung an window.surveyChaptersPart3 sowie CommonJS-Export
 */

(function(window) {
  'use strict';

  const surveyChaptersPart3 = [
    {
      id: 20,
      slug: 'chapter_20_free_use_somnophilia',
      title: 'Kapitel 20: Free-Use, Schlaferotik & Sexuelle Verfügbarkeit',
      desc: 'Das Privileg körperlicher Zugänglichkeit: Ohne Nachfrage, beim Dösen, Arbeiten oder Fernsehen.',
      items: [
        {
          id: 326,
          type: 'scale',
          title: 'Free-Use im Schlafzimmer (Jederzeit zugänglich)',
          desc: 'Was es ist: Wer im Bett liegt, darf jederzeit ohne vorheriges Bitten intim berührt, entkleidet oder penetriert werden.\nWas daran anmacht: Für den Top das Gefühl unbeschränkter Berechtigung. Für den Bottom die erlösende Passivität: Man muss nichts initiieren und darf einfach genießen.',
          r1Label: 'Sich den Partner ohne Vorwarnung nehmen dürfen',
          r2Label: 'Verfügbar daliegen & Berührungen geschehen lassen',
          somaticZone: 'full_body',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 327,
          type: 'scale',
          title: 'Schlaf-Sex (Im Dösen verführt werden)',
          desc: 'Was es ist: Am frühen Morgen durch gezieltes Streicheln oder behutsames Eindringen geweckt werden.\nWas daran anmacht: Die schlaftrunkene Enthemmung; das vegetative Nervensystem erwacht direkt in der Erregung.',
          r1Label: 'Den schlafenden Partner behutsam wecken & nehmen',
          r2Label: 'Im Halbschlaf berührt & langsam wachgenommen werden',
          somaticZone: 'pelvis_core',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 328,
          type: 'scale',
          title: 'Kissen unters Becken beim Dösen',
          desc: 'Was es ist: Der ruhende Partner wird sanft gedreht und das Becken mit Kissen erhöht für mühelosen Zugang.\nWas daran anmacht: Anatomische Vorbereitung ohne Gegenwehr; das Becken liegt dem Partner darbietend offen.',
          r1Label: 'Das Kissen unterlegen & von hinten ran',
          r2Label: 'Erhöht liegenbleiben & geduldig empfangen',
          somaticZone: 'pelvis_core',
          equipmentTags: ['wedge_pillow'],
          restraintLayer: 0
        },
        {
          id: 329,
          type: 'scale',
          title: 'Kleidung beiseiteschieben im Schlaf',
          desc: 'Was es ist: Leise den Schlafanzug oder Slip beiseiteschieben, ohne den dösenden Partner aufzuregen.\nWas daran anmacht: Der Kitzel des heimlichen, lautlosen Zugriffs auf die warme nackte Haut.',
          r1Label: 'Ganz vorsichtig die Kleidung zur Seite schieben',
          r2Label: 'Liegenbleiben & spüren, wie die Haut frei wird',
          somaticZone: 'genital_core',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 330,
          type: 'scale',
          title: 'Halbwaches Weiterschlafen während des Sex',
          desc: 'Was es ist: Sich nicht aktiv bewegen müssen, sondern vollkommen entspannt daliegen, während der Partner genießt.\nWas daran anmacht: Absoluter Leistungsdruck-Abfall; der Körper fungiert als reine Quelle der Erfüllung für den anderen.',
          r1Label: 'Den entspannten Körper des Partners genießen',
          r2Label: 'Passiv daliegen, weiterdösen & geschehen lassen',
          somaticZone: 'full_body',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 331,
          type: 'scale',
          title: 'Morgenlatte im Halbschlaf nutzen',
          desc: 'Was es ist: Die morgendliche Erektion direkt im Halbschlaf für spontanen Sex ausnutzen.\nWas daran anmacht: Das Ausnutzen biologischer Reflexe; reine Triebbefriedigung vor dem ersten Wachgedanken.',
          r1Label: 'Den Partner morgens direkt im Bett besteigen',
          r2Label: 'Aufwachen & spüren, dass man bereits benutzt wird',
          somaticZone: 'genital_penile',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 332,
          type: 'scale',
          title: 'Spontaner Zugriff am Schreibtisch',
          desc: 'Was es ist: Während der Partner am PC arbeitet, von hinten herantreten und Hände fordernd wandern lassen.\nWas daran anmacht: Durchbricht die konzentrierte Arbeitsroutine mit unentrinnbarer sexueller Spannung.',
          r1Label: 'Am Schreibtisch von hinten überraschen & zugreifen',
          r2Label: 'Am Schreibtisch sitzen & sich anfassen lassen',
          somaticZone: 'torso_flanks',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 333,
          type: 'scale',
          title: 'Auf dem Sofa beiläufig bedienen',
          desc: 'Was es ist: Beim Fernsehen die Hand in die Hose schieben, ohne den Blick vom Film zu nehmen.\nWas daran anmacht: Die beiläufige Selbstverständlichkeit des Zugriffs; Demut durch stummes Gewährenlassen.',
          r1Label: 'Ganz beiläufig auf dem Sofa berühren & bedienen',
          r2Label: 'Auf der Couch liegen & die Hände empfangen',
          somaticZone: 'genital_core',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 334,
          type: 'scale',
          title: 'Nackt zum Lesen oder Fernsehen bereitliegen',
          desc: 'Was es ist: Nackt auf dem Bett liegen und für jede Berührung zur Verfügung stehen.\nWas daran anmacht: Sichtbare Bereitschaft ohne Aufforderung; stummes Zeichen absoluter Unterordnung.',
          r1Label: 'Den Partner bereitliegen lassen & spontan zugreifen',
          r2Label: 'Nackt daliegen & abwarten, wann die Hand kommt',
          somaticZone: 'full_body',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 335,
          type: 'choice',
          title: 'Deine Haltung zu Free-Use',
          desc: 'Wie frei soll körperliche Zugänglichkeit im Alltag geregelt sein?',
          question: 'Welche Form von Free-Use reizt dich am meisten?',
          somaticZone: 'psyche_mind',
          options: [
            { val: 'bedroom', label: 'Reiner Schlafzimmer-Free-Use im Bett' },
            { val: 'alltag', label: 'Auch spontan am Schreibtisch, Sofa oder beim Kochen' },
            { val: 'morning', label: 'Nur morgens als sanfter Weck-Sex' },
            { val: 'none', label: 'Berührungen ohne vorherige Absprache lehne ich ab' }
          ]
        }
      ]
    },

    {
      id: 21,
      slug: 'chapter_21_dominance_leadership_praise',
      title: 'Kapitel 21: Dominanz, Führung & Praise Play',
      desc: 'Führung durch Autorität, Verantwortung und Bestätigung: Sich in feste Hände fallen lassen und stolzes Lob empfangen.',
      items: [
        {
          id: 336,
          type: 'scale',
          title: 'Ruhige, feste Anweisungsstimme',
          desc: 'Was es ist: Mit gelassener, unverrückbarer Stimme sagen, was getan werden soll – verbindlich und klar.\nWas daran anmacht: Autorität ohne Zorn; schenkt dem Bottom sofortige Orientierung und baut Zweifel ab.',
          r1Label: 'Mit fester, ruhiger Stimme klare Ansagen machen',
          r2Label: 'Der festen Stimme lauschen & ihr bereitwillig folgen',
          somaticZone: 'head_ears',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 337,
          type: 'scale',
          title: 'Kinn anheben (Augenkontakt fordern)',
          desc: 'Was es ist: Zwei Finger unter das Kinn legen, Kopf heben und Blickkontakt verlangen.\nWas daran anmacht: Zwingt zur vollen emotionalen Entblößung; kein Verstecken hinter gesenktem Blick möglich.',
          r1Label: 'Das Kinn anheben & tief in die Augen schauen',
          r2Label: 'Das Kinn anheben lassen & dem Blick standhalten',
          somaticZone: 'head_face',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 338,
          type: 'scale',
          title: 'Hand auf den Kopf legen (Bestätigung & Halt)',
          desc: 'Was es ist: Die Handfläche auf den Scheitel des Partners legen als Geste von Führung und Schutz.\nWas daran anmacht: Uralte Geste des Segnens und Besitzens; vermittelt tiefe seelische Erdung.',
          r1Label: 'Die Hand ruhig auf den Kopf des Partners legen',
          r2Label: 'Die Hand auf dem Kopf spüren & entspannen',
          somaticZone: 'head_neck',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 339,
          type: 'scale',
          title: 'Praise Play & Verbale Bestätigung',
          desc: 'Was es ist: Den Partner mit warmen Worten loben („Braves Mädchen“, „Guter Junge“, „Genau so machst du das“).\nWas daran anmacht: Löst eine massive Dopamin- und Oxytocin-Welle aus; Stolz auf das eigene Gelingen.',
          r1Label: 'Mit stolzen Worten ehrlich loben',
          r2Label: 'Das warme Lob hören & tief aufblühen',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 340,
          type: 'scale',
          title: 'Streicheln über die Wange nach Gehorsam',
          desc: 'Was es ist: Mit dem Handrücken sanft über die Wange streichen als Belohnung für Stillhalten.\nWas daran anmacht: Der Kontrast zwischen vorheriger Strenge und plötzlicher, zärtlicher Anerkennung.',
          r1Label: 'Über die Wange streichen & Anerkennung zeigen',
          r2Label: 'Die Belohnung an der Wange genießen',
          somaticZone: 'head_face',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 341,
          type: 'scale',
          title: 'Kleine Ermahnung mit dem Finger',
          desc: 'Was es ist: Mit dem Zeigefinger leicht gegen die Nasenspitze tippen, wenn der Partner vorlaut war.\nWas daran anmacht: Liebevolle Grenzziehung im Alltag; nimmt dem Trotz sofort die Schärfe.',
          r1Label: 'Den Partner mit dem Finger kurz ermahnen',
          r2Label: 'Die kleine Ermahnung mit einem Schmunzeln annehmen',
          somaticZone: 'head_face',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 342,
          type: 'scale',
          title: 'Befehl zum Ausatmen & Entspannen',
          desc: 'Was es ist: Mit der Hand auf der Brust befehlen, tief auszuatmen und alle Muskeln fallen zu lassen.\nWas daran anmacht: Fremdgesteuerte Vagus-Aktivierung; der Bottom darf die eigene Körperspannung abgeben.',
          r1Label: 'Das Ausatmen und Loslassen bestimmt vorgeben',
          r2Label: 'Auf das Kommando hin tief ausatmen & entspannen',
          somaticZone: 'chest_nipples',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 343,
          type: 'scale',
          title: 'Hand flach am Hals als Führung (Grounding)',
          desc: 'Was es ist: Die Handfläche ganz ruhig flach an den Hals legen – ohne Zudrücken, nur für Halt.\nWas daran anmacht: Physische Präsenz an der verwundbarsten Stelle des Körpers; signalisiert absolute Führung.',
          r1Label: 'Die Hand ruhig an den Hals legen & führen',
          r2Label: 'Die Hand am Hals spüren & ergeben sein',
          somaticZone: 'head_neck',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 344,
          type: 'scale',
          title: 'Kuss auf die Stirn nach intensiver Zeit',
          desc: 'Was es ist: Ein andächtiger Kuss auf die Stirn nach intensiver Session als Siegel der Verbundenheit.\nWas daran anmacht: Schließt die Szene ab und holt beide Partner in vollkommene partnerschaftliche Geborgenheit zurück.',
          r1Label: 'Den Stirnkuss voller Zuneigung schenken',
          r2Label: 'Den Kuss auf der Stirn empfangen & durchatmen',
          somaticZone: 'head_face',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 345,
          type: 'scale',
          title: 'Entscheidungen im Alltag abgeben',
          desc: 'Was es ist: Der führende Part entscheidet über Essen, Restaurant oder Kleidung, damit der Kopf frei wird.\nWas daran anmacht: Befreit den Bottom vom Alltags-Entscheidungsdruck (Ego-Entlastung nach Baumeister).',
          r1Label: 'Souverän die Entscheidungen für den Abend treffen',
          r2Label: 'Die Verantwortung abgeben & sich führen lassen',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 346,
          type: 'scale',
          title: 'Demütiges Danke für Berührung',
          desc: 'Was es ist: Ein leises, ehrliches „Danke“ flüstern, wenn man berührt, verwöhnt oder erlöst wurde.\nWas daran anmacht: Verankert die Dankbarkeit für die Führung im Raum; schärft das Bewusstsein für die Gunst.',
          r1Label: 'Das leise Danke entgegennehmen & nicken',
          r2Label: 'Sich von Herzen für die Berührung bedanken',
          somaticZone: 'head_mouth',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 347,
          type: 'choice',
          title: 'Führung im Alltag',
          desc: 'Wie viel dominante Führung wünschst du dir abseits des Betts?',
          question: 'In welchem Rahmen wünschst du dir Führung im Alltag?',
          somaticZone: 'psyche_mind',
          options: [
            { val: 'bedroom_only', label: 'Reine Schlafzimmer-Sache – im Alltag sind wir 100 % gleichberechtigt' },
            { val: 'subtle', label: 'Kleine geheime Rituale und Blicke im Alltag erwünscht' },
            { val: 'protocol', label: 'Feste Rollenverteilung auch bei Entscheidungen und Restaurant' }
          ]
        }
      ]
    },

    {
      id: 22,
      slug: 'chapter_22_service_kneeling_protocol',
      title: 'Kapitel 22: Sklavenpositionen, Dienen & Formale Haltung',
      desc: 'Körperliche Demut und Dienerschaft: Auf Knien verharren, Schuhe ausziehen und stumme Dienstbereitschaft.',
      items: [
        {
          id: 348,
          type: 'scale',
          title: 'Aufrechtes Knien neben dem Sessel (Nadu)',
          desc: 'Was es ist: Auf einer Decke mit geradem Rücken und Händen auf den Oberschenkeln neben dem Partner knien.\nWas daran anmacht: Sichtbare Asymmetrie im Raum; der Bottom findet in der starren Haltung innere Stille.',
          r1Label: 'Den Partner neben dem Sessel knien lassen',
          r2Label: 'Aufrecht knien, zur Ruhe kommen & warten',
          somaticZone: 'limbs_knees',
          equipmentTags: ['kneeling_bench'],
          restraintLayer: 0
        },
        {
          id: 349,
          type: 'scale',
          title: 'Servieren auf Knien (Getränke & Snacks)',
          desc: 'Was es ist: Wasser, Wein oder Snacks auf einem kleinen Tablett auf Knien herantragen.\nWas daran anmacht: Verwandelt alltägliche Versorgung in einen ritualisierten Akt der Ehrerbietung.',
          r1Label: 'Sich auf Knien bedienen lassen & annehmen',
          r2Label: 'Auf Knien herantreten & servieren',
          somaticZone: 'limbs_knees',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 350,
          type: 'scale',
          title: 'Schuhe & Socken ausziehen als Ritual',
          desc: 'Was es ist: Nach der Arbeit dem Partner die Schuhe abstreifen und die Füße wärmen.\nWas daran anmacht: Praktische Fürsorge von unten; nimmt dem Top die Last des Arbeitstags sofort an der Tür ab.',
          r1Label: 'Die Füße hinhalten & sich die Schuhe ausziehen lassen',
          r2Label: 'Dem Partner auf Knien die Schuhe ausziehen',
          somaticZone: 'limbs_ankles_feet',
          equipmentTags: ['boots'],
          restraintLayer: 0
        },
        {
          id: 351,
          type: 'scale',
          title: 'Blick zu Boden senken beim Vorbeigehen',
          desc: 'Was es ist: Wenn der führende Partner vorbeigeht, den Kopf neigen und erst auf Ansprache hochsehen.\nWas daran anmacht: Stumme Unterwerfung der Körpersprache; signalisiert ständige Wachsamkeit für den Top.',
          r1Label: 'Den geneigten Kopf wahrnehmen & ansprechen',
          r2Label: 'Den Blick senken, wenn er/sie vorbeigeht',
          somaticZone: 'head_neck',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 352,
          type: 'scale',
          title: 'Dienen als Fußbank (Human Furniture)',
          desc: 'Was es ist: Auf allen Vieren liegen, während der Partner die Füße auf dem Po oder Rücken ablegt.\nWas daran anmacht: Totale Reduktion auf ein nützliches Möbelstück; das Spüren des physischen Gewichts.',
          r1Label: 'Die Füße auf dem Partner ablegen & ausruhen',
          r2Label: 'Als bequeme Fußbank reglos am Boden verharren',
          somaticZone: 'back_flanks',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 353,
          type: 'scale',
          title: 'Kopf auf den Schoß des Partners betten',
          desc: 'Was es ist: Auf den Boden setzen und den Kopf auf die Oberschenkel des sitzenden Partners legen.\nWas daran anmacht: Reine somatische Ergebung; der Kopf des Bottoms liegt ungeschützt in den Händen des Tops.',
          r1Label: 'Die Hand im Haar des Partners ruhen lassen',
          r2Label: 'Den Kopf auf seinem/ihrem Schoß ablegen & genießen',
          somaticZone: 'head_neck',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 354,
          type: 'scale',
          title: 'Kleidung für den Tag herauslegen',
          desc: 'Was es ist: Der dienende Part bügelt und richtet die Kleidung des Partners für den nächsten Tag her.\nWas daran anmacht: Geräuschlose Entlastung; Vorfreude darauf, den Partner perfekt gekleidet zu sehen.',
          r1Label: 'Die zurechtgelegte Kleidung anziehen & nicken',
          r2Label: 'Die Kleidung mit Sorgfalt auswählen & bügeln',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 355,
          type: 'scale',
          title: 'Förmliche Begrüßung an der Tür',
          desc: 'Was es ist: An der Wohnungstür auf Knien warten und dem Partner die Tasche abnehmen.\nWas daran anmacht: Schafft eine scharfe Schwelle zwischen anstrengender Außenwelt und privatem Bündnis-Reich.',
          r1Label: 'An der Tür empfangen werden & Tasche übergeben',
          r2Label: 'An der Tür warten & den Partner willkommen heißen',
          somaticZone: 'limbs_knees',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 356,
          type: 'scale',
          title: 'Geduldiges Warten im Nebenzimmer',
          desc: 'Was es ist: Ruhig und ohne Smartphone im Zimmer warten, bis man gerufen wird.\nWas daran anmacht: Dehnt die Vorfreude ins Unermessliche; der Bottom existiert ganz in der Erwartung des Rufs.',
          r1Label: 'Den Partner warten lassen & dann rufen',
          r2Label: 'Geduldig verharren & die Vorfreude spüren',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 357,
          type: 'scale',
          title: 'Rücken eincremen nach dem Duschen',
          desc: 'Was es ist: Den Partner nach dem Bad mit Lotion langsam von Kopf bis Fuß einreiben.\nWas daran anmacht: Absichtslose Fürsorge; die Hände des Bottoms dienen rein dem Wohlbefinden des Tops.',
          r1Label: 'Sich den Rücken langsam eincremen lassen',
          r2Label: 'Den Partner mit warmen Händen eincremen',
          somaticZone: 'back_flanks',
          equipmentTags: ['oil'],
          restraintLayer: 0
        },
        {
          id: 358,
          type: 'scale',
          title: 'Stumme Dienstbereitschaft im Raum',
          desc: 'Was es ist: Leise im Zimmer ein Buch lesen und aufspringen, wenn der Partner etwas braucht.\nWas daran anmacht: Gibt dem Top das Gefühl ständiger, unaufdringlicher Präsenz und Unterstützung.',
          r1Label: 'Die stille Anwesenheit genießen & Wünsche äußern',
          r2Label: 'Aufmerksam im Hintergrund bereitstehen',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 359,
          type: 'choice',
          title: 'Art der Dienerschaft',
          desc: 'Welche Form von Dienerschaft bereitet dir Freude?',
          question: 'Wie weit darf Dienerschaft für dich gehen?',
          somaticZone: 'full_body',
          options: [
            { val: 'practical', label: 'Praktische Verwöhn-Dienste (Getränke bringen, Schuhe ausziehen, Kochen)' },
            { val: 'formal', label: 'Formale Haltungen (Knien am Sessel, Warten auf Kommando)' },
            { val: 'playful', label: 'Nur ab und zu als kleines Rollenspiel im Schlafzimmer' },
            { val: 'none', label: 'Ich möchte weder dienen noch bedient werden' }
          ]
        }
      ]
    },

    {
      id: 23,
      slug: 'chapter_23_domestic_discipline',
      title: 'Kapitel 23: Zucht, Disziplin & Straf-Rituale (Domestic Discipline)',
      desc: 'Ordnung und Konsequenz: Feste Regeln, Zurechtweisung bei Frechheiten und erlösende Versöhnung.',
      items: [
        {
          id: 360,
          type: 'scale',
          title: 'Gemeinsam vereinbarte Hausregeln',
          desc: 'Was es ist: Eine Liste von 3 bis 5 festen Regeln, die beide Partner gemeinsam unterschrieben haben.\nWas daran anmacht: Schafft verlässliche Leitplanken; schützt vor Willkür durch vorherige Klarheit.',
          r1Label: 'Die Regeln festlegen & auf Einhaltung achten',
          r2Label: 'Die Regeln kennen & sich gern daran halten',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 361,
          type: 'scale',
          title: 'Regelverstöße ehrlich selbst beichten',
          desc: 'Was es ist: Einen Fehler unaufgefordert eingestehen und zum Partner gehen, um ihn zu berichten.\nWas daran anmacht: Überwindung von Scham; reinigt das Gewissen und beweist rückhaltloses Vertrauen.',
          r1Label: 'Die Beichte ruhig anhören & Konsequenz bestimmen',
          r2Label: 'Den Fehler ehrlich eingestehen & auf Strafe warten',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 362,
          type: 'scale',
          title: 'Strafzeilen schreiben mit Füller & Papier',
          desc: 'Was es ist: Einen vorgegebenen Satz 20- oder 50-mal sauber in ein Notizheft schreiben.\nWas daran anmacht: Meditative Monotonie; verankert den Gehorsamsgedanken durch körperliche Wiederholung.',
          r1Label: 'Den Strafsatz vorgeben & die Handschrift prüfen',
          r2Label: 'Die Zeilen konzentriert zu Papier bringen',
          somaticZone: 'limbs_hands_wrists',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 363,
          type: 'scale',
          title: 'In der Ecke stehen zur Besinnung (Corner Time)',
          desc: 'Was es ist: Für 10 Minuten mit dem Gesicht zur Wand still in der Zimmerecke nachdenken.\nWas daran anmacht: Sensorische Reduktion; bricht kindlichen Trotz und führt zur inneren Einkehr.',
          r1Label: 'Den Partner zur Besinnung in die Ecke schicken',
          r2Label: 'In der Ecke stehen, ruhig werden & nachdenken',
          somaticZone: 'full_body',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 364,
          type: 'scale',
          title: 'Smartphone-Verbot für den Abend',
          desc: 'Was es ist: Nach einer Frechheit das Handy abgeben; der Abend gehört Buch, Haushalt und Partner.\nWas daran anmacht: Entzieht digitale Ablenkung; fokussiert die gesamte Aufmerksamkeit auf das gemeinsame Heim.',
          r1Label: 'Das Smartphone einkassieren & verwahren',
          r2Label: 'Das Handy abgeben & die digitale Ruhe spüren',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 365,
          type: 'scale',
          title: 'Knien vor dem Partner zur Abbitte',
          desc: 'Was es ist: Sich vor den Partner knien, Hände auf seine Knie legen und um Verzeihung bitten.\nWas daran anmacht: Physische Unterordnung vor der Autorität des geliebten Menschen; schenkt echte Demut.',
          r1Label: 'Die Bitte anhören & Verzeihung gewähren',
          r2Label: 'Demütig um Entschuldigung bitten',
          somaticZone: 'limbs_knees',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 366,
          type: 'scale',
          title: 'Formelles Versohlen als Strafe',
          desc: 'Was es ist: Das Gesäß als Wiedergutmachung über den Knien mit Händen oder Paddle versohlt bekommen.\nWas daran anmacht: Wandelt seelische Schuld in spürbaren körperlichen Schmerz um, der mit dem letzten Schlag verraucht.',
          r1Label: 'Die Strafe mit ruhiger Konsequenz vollziehen',
          r2Label: 'Die Schläge annehmen & die Schuld abbüßen',
          somaticZone: 'gluteal_pelvis',
          equipmentTags: ['paddle', 'leather_belt'],
          restraintLayer: 0
        },
        {
          id: 367,
          type: 'scale',
          title: 'Die befreiende Umarmung nach der Strafe',
          desc: 'Was es ist: Sobald die Strafe vorüber ist, fest in den Arm nehmen: Alles ist vergeben und vergessen.\nWas daran anmacht: Die erlösende Katharsis; das Gefühl, vollständig gereinigt und wieder vollkommen geliebt zu sein.',
          r1Label: 'Den Partner sofort liebevoll an die Brust ziehen',
          r2Label: 'Erleichtert im Arm versinken: Es ist wieder gut',
          somaticZone: 'full_body',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 368,
          type: 'scale',
          title: 'Verbot von Kosenamen nach Fehlverhalten',
          desc: 'Was es ist: Für einen Tag darf der Partner nur mit förmlichem Vornamen angesprochen werden.\nWas daran anmacht: Spürbare emotionale Distanz; lässt den Wert zärtlicher Nähe umso schmerzhafter vermissen.',
          r1Label: 'Auf die Einhaltung der Anrede achten',
          r2Label: 'Die Kosenamen vermissen & sich bemühen',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 369,
          type: 'scale',
          title: 'Zusätzliche Hausarbeit als Wiedergutmachung',
          desc: 'Was es ist: Als Strafe das Bad putzen oder die Fenster gründlich wischen.\nWas daran anmacht: Produktive Buße; der Bottom leistet echten praktischen Mehrwert für das gemeinsame Leben.',
          r1Label: 'Die Strafaufgabe zuteilen & abnehmen',
          r2Label: 'Die Aufgabe fleißig erledigen & Buße tun',
          somaticZone: 'full_body',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 370,
          type: 'scale',
          title: 'Das Straf-Protokollbuch',
          desc: 'Was es ist: Ein Notizbuch, in dem Regelverstöße und erfolgte Disziplinierungen festgehalten werden.\nWas daran anmacht: Verbindliche Dokumentation; schützt vor Vergessen und verleiht den Regeln echtes Gewicht.',
          r1Label: 'Das Buch führen & Unterschrift verlangen',
          r2Label: 'Den Eintrag lesen & die Verantwortung annehmen',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 371,
          type: 'scale',
          title: 'Belohnungssystem mit Sternchen oder Punkten',
          desc: 'Was es ist: Für gute Taten Punkte sammeln und gegen Wünsche im Bett einlösen.\nWas daran anmacht: Gamification der Partnerschaft; macht Gehorsam und Fleiß spielerisch lohnend.',
          r1Label: 'Die Punkte gerecht vergeben & Belohnung schenken',
          r2Label: 'Fleißig Punkte sammeln & sich auf Belohnung freuen',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 372,
          type: 'scale',
          title: 'Schulterkuss als Friedenszeichen',
          desc: 'Was es ist: Nach verbüßter Strafe küsst der Partner sanft die Schulter als Versöhnungssiegel.\nWas daran anmacht: Ein feines, intimes Ritual, das endgültig besiegelt, dass keine Altlasten im Raum stehen.',
          r1Label: 'Den Friedenskuss auf die Schulter setzen',
          r2Label: 'Den Kuss empfangen & wissen: Alles ist gut',
          somaticZone: 'head_neck',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 373,
          type: 'choice',
          title: 'Bevorzugte Art von Disziplin',
          desc: 'Welche Form der Zurechtweisung passt zu euch?',
          question: 'Welche Art von Strafen findest du erotisch?',
          somaticZone: 'gluteal_pelvis',
          options: [
            { val: 'spanking', label: 'Klassisches Handspanking über den Knien' },
            { val: 'chores', label: 'Praktische Strafen (Strafzeilen, Handyverbot, Putzen)' },
            { val: 'nadu', label: 'Formale Besinnung (In der Ecke stehen, Abbitte auf Knien)' },
            { val: 'none', label: 'Ich mag Strafen und Zucht in der Beziehung überhaupt nicht' }
          ]
        }
      ]
    },

    {
      id: 24,
      slug: 'chapter_24_cnc_struggle_play',
      title: 'Kapitel 24: CNC (Consensual Non-Consent) & Überwältigungsspiele',
      desc: 'Das Spiel mit der scheinbaren Hilflosigkeit: Gespielter Widerstand, Überraschungsangriffe und feste Safewords.',
      items: [
        {
          id: 374,
          type: 'scale',
          title: 'Gespielter Widerstand (Play Struggle)',
          desc: 'Was es ist: Sich wehren und strampeln, wohlwissend, dass man gleich überwältigt wird.\nWas daran anmacht: Lässt den Bottom die eigene Kraft erproben, bevor die erlösende Kapitulation vor der Übermacht des Tops eintritt.',
          r1Label: 'Den zappelnden Partner packen & festnageln',
          r2Label: 'Kämpfen, strampeln & sich bezwingen lassen',
          somaticZone: 'full_body',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 375,
          type: 'scale',
          title: 'Überraschungs-Angriff beim Nachhausekommen',
          desc: 'Was es ist: Hinter der Tür auflauern, den Partner beim Eintreten packen und fordernd küssen.\nWas daran anmacht: Schreck-Adrenalin, das sofort in erregte Erleichterung umschlägt.',
          r1Label: 'Hinter der Tür auflauern & überraschend zupacken',
          r2Label: 'Erschrecken, gepackt werden & das Herzrasen spüren',
          somaticZone: 'full_body',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 376,
          type: 'scale',
          title: 'Inszenierter Einbruch im Schlafzimmer',
          desc: 'Was es ist: Der Partner schleicht sich maskiert ins Schlafzimmer und fesselt überraschend.\nWas daran anmacht: Realitätsnahe Auslieferung an ein verbotenes Kopfkino im sicheren Schutzraum.',
          r1Label: 'Die nächtliche Überwältigung inszenieren & packen',
          r2Label: 'Im Bett überrascht & wehrlos gemacht werden',
          somaticZone: 'full_body',
          equipmentTags: ['mask', 'cuffs'],
          restraintLayer: 2
        },
        {
          id: 377,
          type: 'scale',
          title: 'Hände hinter den Kopf drücken beim Kuss',
          desc: 'Was es ist: Beide Handgelenke mit einer Hand über dem Kopf fixieren, während die andere erkundet.\nWas daran anmacht: Spürbares Kraftübergewicht; der Liegende kann die Berührung nicht abwehren.',
          r1Label: 'Die Hände mit einer Hand oben festhalten',
          r2Label: 'Festgehalten daliegen & ausgeliefert küssen',
          somaticZone: 'limbs_hands_wrists',
          equipmentTags: [],
          restraintLayer: 1
        },
        {
          id: 378,
          type: 'scale',
          title: 'Den Rock fordernd hochreißen',
          desc: 'Was es ist: Den Stoff mit einem Ruck nach oben raffen und direkt zupacken.\nWas daran anmacht: Der ungestüme Bruch gesellschaftlicher Geduld; pure Dringlichkeit.',
          r1Label: 'Den Rock nach oben raffen & direkt zupacken',
          r2Label: 'Das Raffen des Stoffs spüren & Haltung verlieren',
          somaticZone: 'gluteal_pelvis',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 379,
          type: 'scale',
          title: 'Fordernder Griff in den Nacken an der Wand',
          desc: 'Was es ist: Den Partner an die Wand drücken; eine Hand fest im Nacken zur Fixierung.\nWas daran anmacht: Physische Arretierung des Kopfes; erzwingt stillen Augenkontakt.',
          r1Label: 'An die Wand drücken & fest im Nacken halten',
          r2Label: 'An die Wand gedrückt werden & den Herzschlag spüren',
          somaticZone: 'head_neck',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 380,
          type: 'scale',
          title: 'Überfall im Auto auf einsamem Parkplatz',
          desc: 'Was es ist: Anhalten, den Sitz nach hinten kurbeln und fordernd zupacken.\nWas daran anmacht: Enge des Fahrzeugs kombiniert mit dem Kitzel des abgelegenen Orts.',
          r1Label: 'Die Fahrt stoppen & auf den Sitz werfen',
          r2Label: 'Auf dem Autositz überwältigt werden',
          somaticZone: 'pelvis_core',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 381,
          type: 'scale',
          title: 'Beine mit den Knien auseinanderdrücken',
          desc: 'Was es ist: Geschlossene Schenkel mit den Knien fordernd auseinanderschieben.\nWas daran anmacht: Überwindung des körperlichen Schutzes; öffnet den Intimbereich mit Nachdruck.',
          r1Label: 'Mit den Knien die Beine des Partners öffnen',
          r2Label: 'Den Widerstand der Beine brechen lassen',
          somaticZone: 'limbs_legs',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 382,
          type: 'scale',
          title: 'Knebeln mitten im Streit-Rollenspiel',
          desc: 'Was es ist: Mitten im gespielten Wortgefecht dem Partner ein Tuch zwischen die Zähne schieben.\nWas daran anmacht: Abrupter Sprachverlust; beendet verbale Gegenwehr augenblicklich.',
          r1Label: 'Das Wortgefecht mit dem Knebel abrupt beenden',
          r2Label: 'Verstummen müssen & die Augen aufreißen',
          somaticZone: 'head_mouth',
          equipmentTags: ['gag', 'silk'],
          restraintLayer: 1
        },
        {
          id: 383,
          type: 'scale',
          title: 'Chef- & Angestellten-Machtspiel',
          desc: 'Was es ist: Späte Überstunden im Büro, bei denen der Chef seine Macht ausspielt.\nWas daran anmacht: Das reale gesellschaftliche Machtgefälle wird zum Schauplatz erotischer Zucht.',
          r1Label: 'Die Chef-Rolle fordernd und streng spielen',
          r2Label: 'In der Angestellten-Rolle nachgeben müssen',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 384,
          type: 'scale',
          title: 'Polizei-Verhör mit Handschellen',
          desc: 'Was es ist: Wegen einer Verfehlung verhört und an den Stuhl geklickt werden.\nWas daran anmacht: Formale Strenge und unnachgiebiges Befragen bei gefesselten Händen.',
          r1Label: 'Das strenge Verhör führen & Handschellen anlegen',
          r2Label: 'Auf dem Stuhl gefesselt sitzen & gestehen',
          somaticZone: 'limbs_hands_wrists',
          equipmentTags: ['cuffs'],
          restraintLayer: 2
        },
        {
          id: 385,
          type: 'scale',
          title: 'Fremden-Rollenspiel in einer Bar',
          desc: 'Was es ist: In der Bar treffen, als kenne man sich nicht, und fordernd abschleppen lassen.\nWas daran anmacht: Das Abstreifen aller gemeinsamen Vorgeschichte; Reiz des Unbekannten.',
          r1Label: 'Den Unbekannten spielen & fordernd ansprechen',
          r2Label: 'Sich als Fremde abschleppen & packen lassen',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 386,
          type: 'scale',
          title: 'Kleidung fordernd aufknöpfen',
          desc: 'Was es ist: Hemd oder Bluse mit schnellen, fordernden Griffen öffnen.\nWas daran anmacht: Das akustische Knacken und Spannen von Knöpfen unter ungeduldigen Fingern.',
          r1Label: 'Die Knöpfe fordernd aufreißen',
          r2Label: 'Spüren, wie die Kleidung fordernd geöffnet wird',
          somaticZone: 'torso_skin',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 387,
          type: 'scale',
          title: 'Festhalten am Handgelenk beim Gehen',
          desc: 'Was es ist: Am Handgelenk packen und ohne Worte ins Schlafzimmer ziehen.\nWas daran anmacht: Stumme Bestimmtheit; der Bottom wird ohne Diskussion in die Intimität geführt.',
          r1Label: 'Am Handgelenk packen & ins Zimmer ziehen',
          r2Label: 'Gezogen werden & hinterherstolpern',
          somaticZone: 'limbs_hands_wrists',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 388,
          type: 'choice',
          title: 'Grenzen bei CNC',
          desc: 'Welche Art von Überwältigungsspiel reizt dich?',
          question: 'Wie weit darf gespielte Überwältigung gehen?',
          somaticZone: 'full_body',
          options: [
            { val: 'struggle', label: 'Spielerisches Strampeln & Festhalten der Hände im Bett' },
            { val: 'roleplay', label: 'Echte Rollenspiele (Einbrecher, Chef, Polizist oder Fremder)' },
            { val: 'mild', label: 'Nur sanftes Dominieren ohne großes Kampfspiel' },
            { val: 'none', label: 'Gespielte Überwältigung (CNC) ist für mich ein absolutes Tabu' }
          ]
        }
      ]
    },

    {
      id: 25,
      slug: 'chapter_25_bodily_fluids_taboos',
      title: 'Kapitel 25: Körperflüssigkeiten, Ekel- & Grenztests',
      desc: 'Intime Berührung mit Flüssigkeiten: Speichel, Schweiß, Urin und der Schutz vor echten No-Gos.',
      items: [
        {
          id: 389,
          type: 'scale',
          title: 'Nasses Küssen mit reichlich Speichel',
          desc: 'Was es ist: Beim Küssen Speichel von Mund zu Mund fließen lassen.\nWas daran anmacht: Archaische, feucht-schmatzende Verschmelzung ohne gesellschaftliche Barrieren.',
          r1Label: 'Speichel fließen lassen & Mund benetzen',
          r2Label: 'Den nassen Speichel empfangen & schlucken',
          somaticZone: 'head_mouth',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 390,
          type: 'scale',
          title: 'Spucken ins Gesicht als dominante Geste',
          desc: 'Was es ist: Dem Partner als Zeichen von Härte ins Gesicht spucken.\nWas daran anmacht: Symbolischer Tabubruch; bricht den Alltagsstolz und testet die Demut des Partners.',
          r1Label: 'Den Partner gezielt anspucken',
          r2Label: 'Angespuckt werden & Haltung wahren',
          somaticZone: 'head_face',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 391,
          type: 'scale',
          title: 'Sauberküssen des Körpers nach dem Sex',
          desc: 'Was es ist: Säfte mit Lippen und Zunge von Bauch oder Schenkeln lecken.\nWas daran anmacht: Zärtlicher Dienst der Rückaufnahme; schließt den Akt mit andächtiger Reinheit ab.',
          r1Label: 'Den Körper des Partners sauberküssen',
          r2Label: 'Sich nach dem Sex zärtlich sauberlecken lassen',
          somaticZone: 'torso_skin',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 392,
          type: 'scale',
          title: 'Schweiß vom Körper ablecken',
          desc: 'Was es ist: Den salzigen Schweiß an Hals oder Bauch nach Aktivität ablecken.\nWas daran anmacht: Pheromon-Rausch; unmittelbare Aufnahme der authentischen Körperessenz.',
          r1Label: 'Den Schweiß vom Partner lecken',
          r2Label: 'Den eigenen Schweiß ablecken lassen',
          somaticZone: 'torso_skin',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 393,
          type: 'scale',
          title: 'Sperma auf der Haut verreiben',
          desc: 'Was es ist: Das Ejakulat nach dem Orgasmus auf Bauch oder Brust verreiben.\nWas daran anmacht: Sichtbare und warme Markierung des Partners; feucht-gleitende Textur.',
          r1Label: 'Das Sperma auf der Haut verreiben',
          r2Label: 'Das warme Ejakulat auf der Haut spüren',
          somaticZone: 'torso_skin',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 394,
          type: 'scale',
          title: 'Natursekt unter der warmen Dusche',
          desc: 'Was es ist: Sich gemeinsam unter dem fließenden Wasser der Dusche sanft anpinkeln.\nWas daran anmacht: Körperwärme und Verruchtheit im sicheren, sofort abwaschbaren Dusch-Umfeld.',
          r1Label: 'Den Partner unter der Dusche anpinkeln',
          r2Label: 'Den warmen Urinstrahl auf der Haut empfangen',
          somaticZone: 'full_body',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 395,
          type: 'scale',
          title: 'Cutting & Skalpellspiele (Blood Play - Tabutest)',
          desc: 'Was es ist: Mit Klingen die Haut anritzen, um echtes Blut fließen zu sehen.\nWas daran anmacht: Extremes Schmerz- und Schockpotenzial (Häufig striktes No-Go für die meisten Paare).',
          r1Label: 'Die Haut anritzen & Blut sehen wollen',
          r2Label: 'Sich ritzen lassen & das Bluten spüren',
          somaticZone: 'torso_skin',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 396,
          type: 'scale',
          title: 'Kaviar & Scat (Fäkalien - Tabutest)',
          desc: 'Was es ist: Einbeziehen von Kot oder Darmflüssigkeiten in sexuelle Handlungen.\nWas daran anmacht: Extremste Form der Schamüberwindung (Für 99 % ein striktes Tabu).',
          r1Label: 'Fäkalien im Spiel verwenden',
          r2Label: 'Mit Fäkalien beschmiert werden',
          somaticZone: 'gluteal_pelvis',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 397,
          type: 'choice',
          title: 'Deine Grenze bei Körperflüssigkeiten',
          desc: 'Wie stehst du zu intimen Körperflüssigkeiten im Bett?',
          question: 'Welche Körperflüssigkeiten reizen dich?',
          somaticZone: 'head_mouth',
          options: [
            { val: 'tender', label: 'Zärtlicher Speichelfluss & Sauberküssen nach dem Sex' },
            { val: 'shower', label: 'Natursekt nur zusammen unter der laufenden Dusche' },
            { val: 'spit', label: 'Herbes Anspucken als dominante Machtgeste' },
            { val: 'none', label: 'Ich mag außer normalem Küssen keinerlei Flüssigkeiten' }
          ]
        }
      ]
    },

    {
      id: 26,
      slug: 'chapter_26_monogamy_voyeurism_triads',
      title: 'Kapitel 26: Voyeurismus, Exhibitionismus & Erotische Dreiecke',
      desc: 'Grenzen des Paarraums: Schutz der Exklusivität, Kopfkinos und der Kitzel des Beobachtens.',
      items: [
        {
          id: 398,
          type: 'scale',
          title: 'Exklusive Zweisamkeit & Schutz der Monogamie',
          desc: 'Was es ist: Unsere Sexualität gehört zu 100 % nur uns beiden – niemand Drittes kommt hinein.\nWas daran anmacht: Unerschütterliche Sicherheit und emotionale Unantastbarkeit des Bündnisses.',
          r1Label: 'Die Monogamie zu 100 % schützen & wahren',
          r2Label: 'Wissen, dass unsere Intimität unantastbar privat bleibt',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 399,
          type: 'scale',
          title: 'Cuckolding als reine Kopf-Fantasie',
          desc: 'Was es ist: Im Bett darüber reden, wie es wäre – ohne es jemals real zu tun.\nWas daran anmacht: Sicherer Kitzel der Eifersucht rein im Kopf, ohne reale Beziehungsrisiken einzugehen.',
          r1Label: 'Die Fantasie im Bett erregend ausschmücken',
          r2Label: 'Der Fantasie lauschen & Lust daraus schöpfen',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 400,
          type: 'scale',
          title: 'Anderen Paaren heimlich zusehen (Voyeurismus)',
          desc: 'Was es ist: Anderen Paaren beim Sex zuschauen oder sich selbst beobachten lassen.\nWas daran anmacht: Das Brechen der Intimsphäre fremder Menschen; erregendes Verbotenes.',
          r1Label: 'Andere beobachten oder sich präsentieren',
          r2Label: 'Beobachtet werden & das Kribbeln spüren',
          somaticZone: 'head_eyes',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 401,
          type: 'scale',
          title: 'Flirten vor den Augen des Partners',
          desc: 'Was es ist: Auf Feiern offen flirten, während der Partner zuschaut, aber zusammen nach Hause gehen.\nWas daran anmacht: Das Spiel mit der Eifersucht bei garantierter gemeinsamer Heimkehr.',
          r1Label: 'Vor den Augen des Partners flirten',
          r2Label: 'Zusehen, wie der Partner begehrt wird',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 402,
          type: 'scale',
          title: 'Dreier (Zwei Frauen, ein Mann)',
          desc: 'Was es ist: Gemeinsames Liebesspiel mit einer zweiten Frau im Schlafzimmer.\nWas daran anmacht: Weibliche Fülle und geteilte Zuwendung im intimen Dreieck.',
          r1Label: 'Eine zweite Frau dazuholen & führen',
          r2Label: 'Zu dritt im Bett lieben & teilen',
          somaticZone: 'full_body',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 403,
          type: 'scale',
          title: 'Dreier (Zwei Männer, eine Frau)',
          desc: 'Was es ist: Gemeinsames Liebesspiel mit einem zweiten Mann im Schlafzimmer.\nWas daran anmacht: Die Frau steht im Mittelpunkt zweier fordernder Männer; doppelte Fülle.',
          r1Label: 'Einen zweiten Mann ins Zimmer bitten',
          r2Label: 'Von zwei Männern gleichzeitig begehrt werden',
          somaticZone: 'full_body',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 404,
          type: 'scale',
          title: 'Partnertausch im Swingerclub',
          desc: 'Was es ist: Partnertausch oder Sex vor den Augen anderer Gäste im Club.\nWas daran anmacht: Enthemmung in erotischer Gruppen-Atmosphäre ohne Alltagsgrenzen.',
          r1Label: 'Mit anderen Partnern schlafen im Club',
          r2Label: 'Zusehen & sich mit anderen vergnügen',
          somaticZone: 'full_body',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 405,
          type: 'choice',
          title: 'Dritte Personen in der Sexualität',
          desc: 'Welchen Platz dürfen Fantasien oder Kontakte mit anderen haben?',
          question: 'Wie steht ihr zu anderen Personen in eurem Liebesleben?',
          somaticZone: 'psyche_mind',
          options: [
            { val: 'pure_mono', label: '100 % Monogamie – weder in echt noch als Kopfkino erwünscht' },
            { val: 'fantasy_only', label: 'Reine Kopf-Fantasien im Bett sind heiß, aber niemals in echt' },
            { val: 'voyeur', label: 'Zusehen oder Zeigen ja, aber kein Anfassen fremder Personen' },
            { val: 'open', label: 'Prinzipielle Offenheit für Dreier oder Swingen vorhanden' }
          ]
        }
      ]
    },

    {
      id: 27,
      slug: 'chapter_27_real_hotwifing_cuckold',
      title: 'Kapitel 27: Reales Hotwifing & Cuckold-Lifestyle',
      desc: 'Reale Ausflüge der Partnerin: Vorbereitung, Chauffeuren, Zusehen und seelische Compersion.',
      items: [
        {
          id: 406,
          type: 'scale',
          title: 'Reales Hotwife-Date vor seinen Augen',
          desc: 'Was es ist: Sie flirtet in einer Bar oder trifft sich real mit anderen Männern; ihr Partner weiß Bescheid und stimmt zu.\nWas daran anmacht: Der Stich der Eifersucht, der direkt in sexuelle Erregung umschlägt; ihr Stolz auf die eigene Begährtheit.',
          r1Label: 'Vor seinen Augen mit anderen Männern flirten & ihn zusehen lassen',
          r2Label: 'Zuschauen müssen, wie sie von anderen Männern begehrt wird',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 407,
          type: 'scale',
          title: 'Chauffeur- & Vorbereitungsdienst für ihr Date',
          desc: 'Was es ist: Er hilft ihr ins aufreizende Kleid, schließt ihr den Schmuck, sprüht Parfüm auf und fährt sie zum Liebhaber.\nWas daran anmacht: Die bewusste Dienstbarkeit für ihr sexuelles Vergnügen außerhalb der Beziehung.',
          r1Label: 'Mich von ihm für mein Date herrichten & fahren lassen',
          r2Label: 'Sie für einen anderen Mann schön machen & zum Date bringen',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 408,
          type: 'scale',
          title: 'Voyeur-Kniestand während ihres Liebesspiels',
          desc: 'Was es ist: Er kniet in der Zimmerecke oder sitzt auf einem Hocker und beobachtet andächtig, wie seine Frau von einem Bull genommen wird.\nWas daran anmacht: Reale Konfrontation mit der Männlichkeit eines anderen; pure Lust am Zuschauen und der eigenen Entbehrung.',
          r1Label: 'Mich vor seinen Augen von einem Liebhaber nehmen lassen',
          r2Label: 'In der Ecke knien & zusehen, wie ein anderer sie befriedigt',
          somaticZone: 'head_eyes',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 409,
          type: 'scale',
          title: 'Clean-up & Ejakulat-Aufnahme (Snowballing)',
          desc: 'Was es ist: Nach dem Sex mit dem Liebhaber leckt der feste Partner ihre Vulva andächtig sauber und nimmt das Sperma des anderen in den Mund.\nWas daran anmacht: Die ultimative Geste der Unterordnung und das buchstäbliche Aufnehmen der Spuren des anderen Mannes.',
          r1Label: 'Mich nach dem Liebhaber von ihm mit der Zunge reinigen lassen',
          r2Label: 'Sie nach dem anderen Mann sauber lecken & das Sperma schlucken',
          somaticZone: 'head_mouth',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 410,
          type: 'scale',
          title: 'Keuschheit während ihrer Verabredungen',
          desc: 'Was es ist: Der Mann bleibt während ihrer Abwesenheit im Keuschheitskäfig verschlossen; sie behält den Schlüssel bei sich.\nWas daran anmacht: Vollkommene sexuelle Ohnmacht, während sie frei ihre Lust auslebt.',
          r1Label: 'Ihn vor meinem Ausgehen fest verschließen & den Schlüssel mitnehmen',
          r2Label: 'Im Käfig zu Hause warten, während sie unterwegs ist',
          somaticZone: 'genital_penile',
          equipmentTags: ['chastity_cage'],
          restraintLayer: 1
        },
        {
          id: 411,
          type: 'scale',
          title: 'Verbale Schilderung ihres Treffens im Bett (Hotwife-Report)',
          desc: 'Was es ist: Nach der Rückkehr liegt sie im Bett und erzählt ihm detailreich, wie der andere Mann gerochen, geküsst und sie genommen hat.\nWas daran anmacht: Kopfkino in Reinkultur; Nacherleben durch Worte.',
          r1Label: 'Ihm haarklein erzählen, wie gut der andere Mann war',
          r2Label: 'Ihren Worten lauschen & mich an ihren Erlebnissen erregen',
          somaticZone: 'head_ears',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 412,
          type: 'scale',
          title: 'Bedingungslose Freude an ihrem Begehrtwerden (Compersion)',
          desc: 'Was es ist: Reine seelische und partnerschaftliche Erfüllung darüber, dass die Frau sexuell von anderen Männern vollkommen ausgefüllt wird.\nWas daran anmacht: Befreiung vom eigenen Leistungsdruck; tiefe Liebe durch radikales Gönnenkönnen.',
          r1Label: 'Seine echte Freude an meiner weiblichen Freiheit spüren',
          r2Label: 'Reine Freude daran empfinden, dass sie glücklich & erfüllt ist',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 413,
          type: 'scale',
          title: 'Kondomlose Penetration durch den Liebhaber (Breeding-Fantasie)',
          desc: 'Was es ist: Das Wissen oder Zusehen, dass der andere Mann ungeschützt in sie kommt (im sicheren RACK-Gesundheitsrahmen).\nWas daran anmacht: Der Ur-Instinkt des biologischen Übertrumpfens und der vollkommenen Hingabe der Frau an einen Dritten.',
          r1Label: 'Mich vom Liebhaber ungeschützt ausfüllen lassen',
          r2Label: 'Wissen oder sehen, dass der andere Mann in sie kommt',
          somaticZone: 'genital_vulva_clitoris',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 414,
          type: 'scale',
          title: 'Schmuck oder Trophäen des Liebhabers tragen',
          desc: 'Was es ist: Ein Armband, T-Shirt oder Geschenk des Liebhabers im gemeinsamen Haus tragen.\nWas daran anmacht: Ständige sichtbare Präsenz des anderen Mannes im gemeinsamen Revier.',
          r1Label: 'Die Geschenke des Liebhabers stolz zu Hause tragen',
          r2Label: 'Ihren neuen Schmuck sehen & an den anderen Mann denken',
          somaticZone: 'torso_skin',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 415,
          type: 'choice',
          title: 'Deine Haltung zu realem Hotwifing',
          desc: 'Wie weit darf die reale Öffnung für andere Männer gehen?',
          question: 'Welches Szenario reizt dich am meisten?',
          somaticZone: 'psyche_mind',
          options: [
            { val: 'flirt_only', label: 'Nur offenes Flirten und Tanzen vor meinen Augen' },
            { val: 'dating', label: 'Echte Verabredungen & Sex der Frau mit Dritten' },
            { val: 'voyeur_clean', label: 'Zuschauen beim Sex & andächtiger Clean-up danach' },
            { val: 'none', label: 'Reales Hotwifing lehne ich strikt ab' }
          ]
        }
      ]
    },

    {
      id: 28,
      slug: 'chapter_28_erotic_feminization_sissy',
      title: 'Kapitel 28: Erotische Feminisierung & Sissy-Play',
      desc: 'Rollenumkehr und Entmännlichung im geschützten Raum: Damenwäsche, Make-up und zarte Unterordnung.',
      items: [
        {
          id: 416,
          type: 'scale',
          title: 'Tragen von Spitzenunterwäsche unter Alltagskleidung',
          desc: 'Was es ist: Der Mann trägt auf Anweisung der Partnerin zarte Spitzenhöschen oder Strings im Beruf und Alltag.\nWas daran anmacht: Das ständige geheime Spüren des zarten Stoffs unter der Männerhose als stumme Erinnerung an ihre Führung.',
          r1Label: 'Ihm morgens die Damenwäsche für den Tag vorschreiben',
          r2Label: 'Den Spitzenslip den Tag über heimlich spüren',
          somaticZone: 'genital_pelvis',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 417,
          type: 'scale',
          title: 'Zeremonielles Schminken & Lippenstift durch die Herrin',
          desc: 'Was es ist: Die Partnerin setzt ihn vor den Spiegel, trägt Lippenstift, Mascara oder Rouge auf und verwandelt sein Gesicht.\nWas daran anmacht: Das Abstreifen männlicher Härte; die visuelle Transformation in ihr feminines Eigentum.',
          r1Label: 'Ihn sorgfältig schminken & sein Gesicht verwandeln',
          r2Label: 'Vor ihr sitzen, geschminkt werden & das Spiegelbild ansehen',
          somaticZone: 'head_face',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 418,
          type: 'scale',
          title: 'Tragen von Seidennachthemden & zarten Negligés im Bett',
          desc: 'Was es ist: Feine Damen-Nachtwäsche tragen statt Boxershorts oder Schlafanzug.\nWas daran anmacht: Fließende Stoffe auf der Haut, Verlust des maskulinen Selbstbilds, pure sinnliche Weichheit.',
          r1Label: 'Ihn im zarten Seidenkleid vor mir sehen & liebkosen',
          r2Label: 'Im Negligé vor ihr stehen & mich zart fühlen',
          somaticZone: 'torso_skin',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 419,
          type: 'scale',
          title: 'Anrede mit femininen Kosenamen & Zofen-Titeln',
          desc: 'Was es ist: Ihn beim Liebesspiel oder im Haushalt mit Namen wie „meine süße Zofe“, „mein Mädchen“ oder einem weiblichen Vornamen ansprechen.\nWas daran anmacht: Sprachliche Entmachtung des männlichen Egos; seelische Entlastung von Leistungsansprüchen.',
          r1Label: 'Ihn mit femininen Kosenamen anreden & leiten',
          r2Label: 'Als ihr Mädchen angesprochen werden & aufblühen',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 420,
          type: 'scale',
          title: 'Femininer Verhaltenskodex zu Hause',
          desc: 'Was es ist: Verbot breitbeinigen Sitzens; Pflicht, die Beine eng zu kreuzen, die Hände auf die Oberschenkel zu legen und mit leiser Stimme zu antworten.\nWas daran anmacht: Disziplinierung der Körpersprache bis in die kleinsten Alltagsgesten.',
          r1Label: 'Auf seine zierliche Haltung & Manieren achten',
          r2Label: 'Die Beine artig kreuzen & mich feminin bewegen',
          somaticZone: 'limbs_legs',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 421,
          type: 'scale',
          title: 'Keuschheit im zierlichen Sissy-Käfig',
          desc: 'Was es ist: Verschluss des Penis in einem bunten oder besonders zierlichen Käfig unter einem Spitzenhöschen.\nWas daran anmacht: Der Kontrast zwischen verriegelter Männlichkeit und äußerer zarter Weiblichkeit.',
          r1Label: 'Sein Glied klein verschließen & unter Spitze verbergen',
          r2Label: 'Eingesperrt unter zarter Damenwäsche dienen',
          somaticZone: 'genital_penile',
          equipmentTags: ['chastity_cage'],
          restraintLayer: 1
        },
        {
          id: 422,
          type: 'scale',
          title: 'Zofendienst im Hauskleid auf Knien',
          desc: 'Was es ist: Hausarbeit, Staubwischen oder Servieren von Getränken im kurzen Kleidchen auf Knien vor der sitzenden Herrin.\nWas daran anmacht: Die Verschmelzung von häuslicher Dienstbarkeit und femininer Unterordnung.',
          r1Label: 'Mich von ihm im Kleidchen auf Knien bedienen lassen',
          r2Label: 'Im Kleidchen auf Knien servieren & meine Pflicht tun',
          somaticZone: 'limbs_knees',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 423,
          type: 'scale',
          title: 'Komplette Körperenthaarung für babyglatte Haut',
          desc: 'Was es ist: Vollständige Entfernung aller Körperhaare (Beine, Brust, Achseln, Intimbereich) für glattes Hautgefühl.\nWas daran anmacht: Taktile Weichheit; optische Annäherung an feminine Glätte.',
          r1Label: 'Über seine vollkommen glatte, haarlose Haut streichen',
          r2Label: 'Mich für sie komplett enthaaren & weich anfühlen',
          somaticZone: 'torso_skin',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 424,
          type: 'scale',
          title: 'Perücke & Korsage zur Verwandlung tragen',
          desc: 'Was es ist: Eine Perücke aufsetzen und eine enge Schnürkorsage anlegen für eine weibliche Silhouette.\nWas daran anmacht: Perfekte optische Maskerade; man erkennt sich im Spiegel kaum wieder.',
          r1Label: 'Ihn mit Perücke & Korsage einkleiden',
          r2Label: 'In Perücke & Korsage vor ihr posieren',
          somaticZone: 'head_face',
          equipmentTags: ['corset'],
          restraintLayer: 1
        },
        {
          id: 425,
          type: 'choice',
          title: 'Deine Haltung zu Sissy-Play & Feminisierung',
          desc: 'Welche Form der Rollenumkehr spricht dich an?',
          question: 'Wie weit darf die Feminisierung des Mannes gehen?',
          somaticZone: 'psyche_mind',
          options: [
            { val: 'lingerie_only', label: 'Nur heimliche Damenwäsche unter der Männerkleidung' },
            { val: 'full_sissy', label: 'Komplette Verwandlung (Schminke, Kleidchen, Zofendienst & Keuschheit)' },
            { val: 'playful', label: 'Nur ab und zu als humorvolles Rollenspiel im Bett' },
            { val: 'none', label: 'Feminisierung oder Sissy-Play lehne ich strikt ab' }
          ]
        }
      ]
    },

    {
      id: 29,
      slug: 'chapter_29_findom_financial_control',
      title: 'Kapitel 29: Findom & Finanzielle Herrschaft',
      desc: 'Finanzielle Unterordnung und Alltags-Totalregie: Budget-Hoheit, Taschengeld, Tribute und Kauf-Erlaubnisse.',
      items: [
        {
          id: 426,
          type: 'scale',
          title: 'Vollständige Gehaltsüberweisung auf das Konto der Herrin',
          desc: 'Was es ist: Sein monatliches Einkommen geht direkt auf ihr Konto; sie verwaltet das gesamte Geld der Beziehung.\nWas daran anmacht: Für den Mann die vollkommene Abgabe wirtschaftlicher Macht; für die Frau unumschränkte materielle Hoheit.',
          r1Label: 'Sein Gehalt auf meinem Konto verwalten & die Finanzen lenken',
          r2Label: 'Mein Gehalt komplett an sie abgeben & mich unterstellen',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 427,
          type: 'scale',
          title: 'Wöchentliche Taschengeld-Zuteilung',
          desc: 'Was es ist: Sie teilt ihm einen festen, bescheidenen Betrag für die Woche zu; zusätzliches Geld gibt es nur auf Antrag.\nWas daran anmacht: Das ständige Bewusstsein der Abhängigkeit bei alltäglichen Einkäufen.',
          r1Label: 'Ihm wöchentlich Taschengeld nach Wohlverhalten zuteilen',
          r2Label: 'Mit dem von ihr zugewiesenen Taschengeld haushalten',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 428,
          type: 'scale',
          title: 'Kauf-Erlaubnis für jeden Cent einholen',
          desc: 'Was es ist: Vor jedem Einkauf (Kaffee unterwegs, Tanken, Kleidung) muss per Chat um Erlaubnis und Budgetfreigabe gebeten werden.\nWas daran anmacht: Das Durchdringen der D/s-Dynamik in die banalsten Alltagshandlungen.',
          r1Label: 'Seine Kaufanfragen prüfen & nach Gutdünken freigeben',
          r2Label: 'Für jede Ausgabe artig um Erlaubnis bitten müssen',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 429,
          type: 'scale',
          title: 'Straf-Tribute für Unachtsamkeit oder Zuspätkommen',
          desc: 'Was es ist: Jedes Versäumnis (z. B. 10 Minuten zu spät, unordentliche Küche) kostet automatisch 20 €, 50 € oder 100 € auf ihr separates Shopping-Konto.\nWas daran anmacht: Ein Fehler schmerzt spürbar im Portemonnaie; Disziplin wird real messbar.',
          r1Label: 'Geldstrafen für seine Fehler auf mein Shopping-Konto einfordern',
          r2Label: 'Meine Unachtsamkeiten mit echtem Geld wiedergutmachen',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 430,
          type: 'scale',
          title: 'Spontane Tribute als Zeichen der Ehrerbietung (Gifting)',
          desc: 'Was es ist: Er überweist ihr unaufgefordert Geld oder schenkt ihr Luxusgüter, einfach nur um ihrer Macht zu huldigen.\nWas daran anmacht: Finanzielle Unterwerfung als pure Liebeserklärung ohne Erwartung einer Gegenleistung.',
          r1Label: 'Seine spontanen Geld-Tribute huldvoll entgegennehmen',
          r2Label: 'Ihr Geld darbringen, um ihre Souveränität zu ehren',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 431,
          type: 'scale',
          title: 'Vorschriften für Haarschnitt, Bart & Sportprogramm',
          desc: 'Was es ist: Sie bestimmt Friseurtermine, Bartlänge, Parfüm und wöchentliche Trainingszeiten des Mannes.\nWas daran anmacht: Formung des Körpers nach ihrem ästhetischen Willen; er muss sich um sein Aussehen keine Gedanken mehr machen.',
          r1Label: 'Sein Aussehen, Frisur & Sportprogramm bestimmen',
          r2Label: 'Mein Äußeres ganz nach ihren Wünschen formen lassen',
          somaticZone: 'head_face',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 432,
          type: 'scale',
          title: 'Alltags-Inspektion der Ausgaben (Kassensturz)',
          desc: 'Was es ist: Wöchentliches Vorlegen aller Quittungen und Kontoauszüge im Kniestand zur Überprüfung.\nWas daran anmacht: Absolute Transparenz; keine finanziellen Geheimnisse vor der Herrin.',
          r1Label: 'Seine Quittungen auf den Knien entgegennehmen & prüfen',
          r2Label: 'Auf Knien Rechenschaft über jeden Cent ablegen',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 433,
          type: 'scale',
          title: 'Bedingungsloses Schenken der Schlüsselgewalt über Wertgegenstände',
          desc: 'Was es ist: Übergabe von Kreditkarten, Uhren oder Fahrzeugschlüsseln in ihren Safe; Nutzung nur nach Bitte.\nWas daran anmacht: Das materielle Äquivalent peniler Keuschheit: Nichts gehört ihm allein.',
          r1Label: 'Seine Wertsachen in meinem Safe unter Verschluss halten',
          r2Label: 'Meine Wertsachen in ihre Hände legen & um Nutzung bitten',
          somaticZone: 'psyche_mind',
          equipmentTags: ['safe'],
          restraintLayer: 0
        },
        {
          id: 434,
          type: 'scale',
          title: 'Nächtlicher Weck-Appell für kleine Dienste',
          desc: 'Was es ist: Um 03:00 Uhr durch einen Gong geweckt werden, um auf Knien ein Glas Wasser ans Bett zu bringen.\nWas daran anmacht: Unterbrechung des Schlafs als ultimativer Test bedingungsloser Dienstbereitschaft.',
          r1Label: 'Den nächtlichen Weck-Appell anordnen & Wasser empfangen',
          r2Label: 'Nachts aufstehen & andächtig ans Bett dienen',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 435,
          type: 'choice',
          title: 'Deine Haltung zu finanzieller Herrschaft',
          desc: 'Wie weit darf materielle Kontrolle in der Beziehung gehen?',
          question: 'Welches Ausmaß an Findom reizt dich?',
          somaticZone: 'psyche_mind',
          options: [
            { val: 'tribute_gifts', label: 'Nur spontane Geschenke & Shopping-Tribute zur Ehrerbietung' },
            { val: 'total_budget', label: 'Vollständige Budgetkontrolle & wöchentliches Taschengeld' },
            { val: 'penalties', label: 'Echte Geldstrafen für Unachtsamkeiten & Fehler' },
            { val: 'none', label: 'Finanzielle Kontrolle lehne ich strikt ab' }
          ]
        }
      ]
    },

    {
      id: 30,
      slug: 'chapter_30_anal_prostata_pegging',
      title: 'Kapitel 30: Analerotik, Prostata-Ekstase & Pegging',
      desc: 'Hingabe am Po: Behutsames Herantasten, Plugs, Prostata-Stimulation und Pegging mit dem Strap-on.',
      items: [
        {
          id: 436,
          type: 'scale',
          title: 'Sanftes Umkreisen des Afters mit Gleitmittel',
          desc: 'Was es ist: Behutsames Berühren des Analbereichs mit warmem Öl oder Gel ohne Eindringen.\nWas daran anmacht: Löst Schwellenängste ab; bereitet die Muskulatur durch wohlige Entspannung vor.',
          r1Label: 'Den After sanft mit Gleitmittel umkreisen',
          r2Label: 'Die Berührung am Po entspannt annehmen',
          somaticZone: 'anal_perineum',
          equipmentTags: ['oil'],
          restraintLayer: 0
        },
        {
          id: 437,
          type: 'scale',
          title: 'Anallecken (Rimming / Anilingus)',
          desc: 'Was es ist: Zärtliches Verwöhnen des Afters mit Zungenspitze und Lippen nach der Dusche.\nWas daran anmacht: Höchste Intimität; bricht Schamgrenzen durch rückhaltlose Annahme des gesamten Körpers.',
          r1Label: 'Den Partner am Po lecken',
          r2Label: 'Rimming genießen & loslassen',
          somaticZone: 'anal_perineum',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 438,
          type: 'scale',
          title: 'Kleiner Silikon-Butt-Plug zum Aufwärmen',
          desc: 'Was es ist: Einen schmalen Plug mit reichlich Gleitmittel während des Vorspiels tragen.\nWas daran anmacht: Kontinuierliches Ausfüllungsgefühl; bereitet die Schwellkörper auf mehr Tiefe vor.',
          r1Label: 'Den kleinen Plug behutsam einführen',
          r2Label: 'Den Plug tragen & das Ausfüllen spüren',
          somaticZone: 'anal_perineum',
          equipmentTags: ['butt_plug'],
          restraintLayer: 1
        },
        {
          id: 439,
          type: 'scale',
          title: 'Butt-Plug beim normalen Sex tragen',
          desc: 'Was es ist: Den Plug drin behalten, während von vorne vaginal oder oral geliebt wird.\nWas daran anmacht: Verengt die vaginale Öffnung und erzeugt einen intensiven doppelten Druck.',
          r1Label: 'Den Partner mit Plug im Po lieben',
          r2Label: 'Mit dem Plug im Po empfangen',
          somaticZone: 'anal_perineum',
          equipmentTags: ['butt_plug'],
          restraintLayer: 1
        },
        {
          id: 440,
          type: 'scale',
          title: 'Sanfte Prostata-Massage von innen',
          desc: 'Was es ist: Mit gekrümmtem Finger den Lustpunkt des Mannes von innen ertasten.\nWas daran anmacht: Löst einen tiefen, wellenartigen Orgasmus aus, der den Mann in vollkommene Demut versetzt.',
          r1Label: 'Die Prostata vorsichtig massieren',
          r2Label: 'Die tiefe innere Lust am Damm spüren',
          somaticZone: 'anal_perineum',
          equipmentTags: ['prostate_massager'],
          restraintLayer: 1
        },
        {
          id: 441,
          type: 'scale',
          title: 'Klassischer Analverkehr (Ganz langsam)',
          desc: 'Was es ist: Behutsames Eindringen des Penis mit viel Zeit, Atem und Gleitgel ohne Hektik.\nWas daran anmacht: Warme, unnachgiebige Enge; verlangt tiefstes gegenseitiges Vertrauen.',
          r1Label: 'Ganz langsam & feinfühlig eindringen',
          r2Label: 'Den Partner im Po empfangen & entspannen',
          somaticZone: 'anal_perineum',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 442,
          type: 'scale',
          title: 'Fordernder Analverkehr von hinten',
          desc: 'Was es ist: Tiefere Stöße in Knie- oder Bauchlage, wenn der Körper vollkommen entspannt ist.\nWas daran anmacht: Animalische Wucht und tiefe Inbesitznahme ohne Blickkontakt-Barriere.',
          r1Label: 'Von hinten fordernd zustoßen & halten',
          r2Label: 'Die Intensität von hinten genießen',
          somaticZone: 'anal_perineum',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 443,
          type: 'scale',
          title: 'Pegging (Sie nimmt ihn mit dem Strap-on)',
          desc: 'Was es ist: Die Frau schnallt sich einen Dildo um und dringt aktiv in den Mann ein.\nWas daran anmacht: Vollkommene Rollenumkehr; die Frau penetriert und führt, der Mann empfängt wehrlos.',
          r1Label: 'Den Mann mit dem Strap-on lieben & führen',
          r2Label: 'Als Mann von der Partnerin genommen werden',
          somaticZone: 'anal_perineum',
          equipmentTags: ['strap_on'],
          restraintLayer: 1
        },
        {
          id: 444,
          type: 'scale',
          title: 'Dildo-Training zur schmerzfreien Entspannung',
          desc: 'Was es ist: Mit verschieden großen Plugs üben, damit Muskeln weich werden und nichts schmerzt.\nWas daran anmacht: Geduldiger Prozess der Körperöffnung; schult die willentliche Entspannung des Schließmuskels.',
          r1Label: 'Das Entspannen geduldig anleiten',
          r2Label: 'Mit Zeit & Geduld das Loslassen üben',
          somaticZone: 'anal_perineum',
          equipmentTags: ['dildo'],
          restraintLayer: 0
        },
        {
          id: 445,
          type: 'scale',
          title: 'Sanfter Druck auf den Damm (Perineum)',
          desc: 'Was es ist: Die empfindliche Brücke zwischen Genital und After kreisend massieren.\nWas daran anmacht: Stimuliert die Nervenbahnen des Beckenbodens von außen; steigert die Erektion oder Empfindsamkeit.',
          r1Label: 'Den Damm kreisend massieren',
          r2Label: 'Den Druck auf den Damm genießen',
          somaticZone: 'perineum_pelvic_floor',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 446,
          type: 'scale',
          title: 'Anal-Vibrator mit kabelloser Fernbedienung',
          desc: 'Was es ist: Ein vibrierender Plug, den der Partner per Handsender steuert.\nWas daran anmacht: Der Top steuert die inneren Reize unvorhersehbar aus der Distanz.',
          r1Label: 'Die Vibrationen nach Lust und Laune steuern',
          r2Label: 'Die Vibrationen im Po empfangen & genießen',
          somaticZone: 'anal_perineum',
          equipmentTags: ['butt_plug', 'vibrator'],
          restraintLayer: 1
        },
        {
          id: 447,
          type: 'scale',
          title: 'Doppelte Penetration (Vaginal & Anal gleichzeitig)',
          desc: 'Was es ist: Gleichzeitiges Ausfüllen beider Bereiche mit Fingern, Toys oder Penis.\nWas daran anmacht: Maximale sensorische Fülle im Becken; überrollt alle Kontrollmechanismen der Frau.',
          r1Label: 'Beide Zonen gleichzeitig achtsam verwöhnen',
          r2Label: 'Die intensive doppelte Fülle spüren & loslassen',
          somaticZone: 'pelvis_core',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 448,
          type: 'scale',
          title: 'Klistier-Spülung vorab (Sauberkeit & Kopfruhe)',
          desc: 'Was es ist: Eine kleine Wasserspülung vorab für absolute Sauberkeit und Entspannung im Kopf.\nWas daran anmacht: Schaltet jede Scham über Hygiene aus; schenkt vollkommene seelische Freiheit beim Sex.',
          r1Label: 'Die Vorbereitung geduldig unterstützen',
          r2Label: 'Sich mit der kleinen Spülung 100 % sicher & entspannt fühlen',
          somaticZone: 'anal_perineum',
          equipmentTags: ['syringe'],
          restraintLayer: 0
        },
        {
          id: 449,
          type: 'scale',
          title: 'Gemeinsames Atmen beim ersten Eindringen',
          desc: 'Was es ist: Tief zusammen ein- und ausatmen, damit der Schließmuskel vollkommen weich wird.\nWas daran anmacht: Synchronisation des Nervensystems; schließt Schmerzen von Beginn an aus.',
          r1Label: 'Den gemeinsamen Atemrhythmus behutsam vorgeben',
          r2Label: 'Beim Ausatmen alle Spannung fallen lassen',
          somaticZone: 'pelvis_core',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 450,
          type: 'choice',
          title: 'Rolle des Pos im Liebesleben',
          desc: 'Welche Rolle spielt der Po in eurem Liebesleben?',
          question: 'Wie steht ihr zu Analerotik & Pegging?',
          somaticZone: 'anal_perineum',
          options: [
            { val: 'tender', label: 'Nur zärtliches Streicheln, Rimming & kleine Plugs' },
            { val: 'classic', label: 'Klassischer Analverkehr ganz ohne Hektik & mit viel Gel' },
            { val: 'pegging', label: 'Pegging (Sie nimmt ihn mit dem Strap-on)' },
            { val: 'none', label: 'Analberührungen sind für mich ein Tabu' }
          ]
        }
      ]
    },

    {
      id: 31,
      slug: 'chapter_31_public_kinks_codes',
      title: 'Kapitel 31: Öffentliche Kinks, Spielhotels & geheime Codes',
      desc: 'Der Kitzel des Verborgenen: BDSM-Suiten, Restaurant-Geheimnisse und diskrete Codes.',
      items: [
        {
          id: 451,
          type: 'scale',
          title: 'BDSM-Theme-Suite oder Spielhotel buchen',
          desc: 'Was es ist: Ein Wochenende in einer stilvollen Suite mit Pranger und Andreaskreuz verbringen.\nWas daran anmacht: Das Entfliehen aus den gewohnten vier Wänden; der Raum wird zur professionellen Spielwiese.',
          r1Label: 'Die Suite buchen & die Reise leiten',
          r2Label: 'Die fremde Spielwiese genießen',
          somaticZone: 'full_body',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 452,
          type: 'scale',
          title: 'Geheime Handzeichen unter dem Restauranttisch',
          desc: 'Was es ist: Dreimaliges Antippen am Oberschenkel im Restaurant signalisiert Zugehörigkeit.\nWas daran anmacht: Geteilte Komplizenschaft unter ahnungslosen Gästen; unsichtbare Machtausübung.',
          r1Label: 'Die geheimen Zeichen im Alltag setzen',
          r2Label: 'Das Zeichen spüren & innerlich erröten',
          somaticZone: 'thighs_inner',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 453,
          type: 'scale',
          title: 'Ohne Unterwäsche ins Restaurant gehen',
          desc: 'Was es ist: Unter dem Kleid oder der Hose keinen Slip tragen, und nur der Partner weiß es.\nWas daran anmacht: Das permanente, prickelnde Entdeckungsrisiko; kühler Luftzug unter dem Stoff.',
          r1Label: 'Wissen, dass der Partner nackt darunter ist',
          r2Label: 'Am Tisch sitzen & das Kribbeln ertragen',
          somaticZone: 'genital_core',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 454,
          type: 'scale',
          title: 'Schnelles Küssen & Fummeln im Aufzug',
          desc: 'Was es ist: Die 30 Sekunden zwischen zwei Stockwerken für einen fordernden Griff nutzen.\nWas daran anmacht: Zeitdruck und die Dringlichkeit, bevor die Türen wieder aufgleiten.',
          r1Label: 'Im Aufzug packen & küssen',
          r2Label: 'An die Wand gedrückt werden & mitmachen',
          somaticZone: 'full_body',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 455,
          type: 'scale',
          title: 'Sex im Wald an einem Baum',
          desc: 'Was es ist: Beim Spaziergang kurz vom Weg abbiegen, an einen Stamm lehnen und lieben.\nWas daran anmacht: Rauer Rindenkontakt und das Rauschen der Blätter; animalische Naturerotik.',
          r1Label: 'In die Bäume ziehen & zugreifen',
          r2Label: 'An den Baum gelehnt empfangen',
          somaticZone: 'full_body',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 456,
          type: 'scale',
          title: 'Nachtsex auf dem geschützten Balkon',
          desc: 'Was es ist: Spät draußen auf dem Balkon stehen und leise sein müssen im Nachtwind.\nWas daran anmacht: Kühle Nachtluft auf nackter Haut kombiniert mit der Pflicht zur Lautlosigkeit.',
          r1Label: 'Auf den Balkon bitten & von hinten ran',
          r2Label: 'Das Stöhnen unterdrücken im Nachtwind',
          somaticZone: 'full_body',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 457,
          type: 'scale',
          title: 'Diskreter Höschen-Plug beim Spaziergang',
          desc: 'Was es ist: Einen kleinen Plug unter Alltagskleidung bei einem Ausflug tragen.\nWas daran anmacht: Jeder Schritt drückt den Plug sanft gegen das Gewebe; erfordert diszipliniertes Gehen.',
          r1Label: 'Wissen, dass der Partner den Plug trägt',
          r2Label: 'Mit dem Plug unterwegs Haltung bewahren',
          somaticZone: 'anal_perineum',
          equipmentTags: ['butt_plug'],
          restraintLayer: 1
        },
        {
          id: 458,
          type: 'scale',
          title: 'Heimliche Berührungen im Kino',
          desc: 'Was es ist: Im dunklen Kinosaal die Hand auf den Innenschenkel des Partners legen.\nWas daran anmacht: Das permanente Risiko des Ertapptwerdens; das Stöhnen muss erstickt werden.',
          r1Label: 'Im Dunkeln langsam die Hand wandern lassen',
          r2Label: 'Im Kinosessel die Berührung reglos genießen',
          somaticZone: 'thighs_inner',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 459,
          type: 'scale',
          title: 'Zu zweit in der Umkleidekabine',
          desc: 'Was es ist: Beim Shoppen zu zweit in eine große Kabine schlüpfen und kurz intim werden.\nWas daran anmacht: Gedämpftes Gemurmel davor; die Dringlichkeit auf kleinstem Raum.',
          r1Label: 'Mit in die Kabine treten & zupacken',
          r2Label: 'In der Kabine leise sein & mitmachen',
          somaticZone: 'full_body',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 460,
          type: 'scale',
          title: 'Fordernder Blickkontakt quer durch den Raum',
          desc: 'Was es ist: Auf einer vollen Feier quer über alle Köpfe hinweg einen intensiven Blick austauschen.\nWas daran anmacht: Telepathische Verbindung; beide wissen genau, was später im Schlafzimmer folgt.',
          r1Label: 'Den fordernden Blick durch den Raum werfen',
          r2Label: 'Dem Blick standhalten & das Herzrasen spüren',
          somaticZone: 'head_eyes',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 461,
          type: 'scale',
          title: 'Gewagte Wäsche unter festlicher Kleidung',
          desc: 'Was es ist: Unter festlicher Kleidung gewagte Lingerie tragen; nur ihr zwei wisst es.\nWas daran anmacht: Das Bewusstsein des Verruchten inmitten steifer gesellschaftlicher Etikette.',
          r1Label: 'Wissen, was der Partner darunter trägt',
          r2Label: 'Mit der Reizwäsche am Kaffeetisch sitzen',
          somaticZone: 'torso_skin',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 462,
          type: 'choice',
          title: 'Öffentlicher Nervenkitzel',
          desc: 'Welche Art von öffentlichem Kitzel passt zu euch?',
          question: 'Welcher Nervenkitzel unterwegs reizt dich am meisten?',
          somaticZone: 'psyche_mind',
          options: [
            { val: 'hotel', label: 'Stilvolle Theme-Suiten & Spielhotels' },
            { val: 'secret', label: 'Unsichtbare Rituale (Ohne Slip, Kniezeichen unterm Tisch, Plug)' },
            { val: 'nature', label: 'Einsame Orte in der Natur (Wald, See, Balkon bei Nacht)' },
            { val: 'none', label: 'Nur die eigenen vier Wände – unterwegs mag ich reine Ruhe' }
          ]
        }
      ]
    },

    {
      id: 32,
      slug: 'chapter_32_hypno_kink_trance',
      title: 'Kapitel 32: Erotische Trance, Hypno-Kink & Mentale Konditionierung',
      desc: 'Das Spiel mit dem Unterbewusstsein: Geführte Entspannung, Triggerwörter, Gehorsams-Impulse und erotische Amnesie.',
      items: [
        {
          id: 463,
          type: 'scale',
          title: 'Geführte Trance-Induktion mit ruhiger Stimme',
          desc: 'Was es ist: Den Partner durch monotone, tiefe Sprachführung in völlige körperliche Entspannung versetzen.\nWas daran anmacht: Das allmähliche Ausschalten der exekutiven Denkschleifen; Übergabe der Gedanken an den Top.',
          r1Label: 'Die Trance-Induktion ruhig und bestimmt leiten',
          r2Label: 'Der Stimme lauschen & tiefer in Trance sinken',
          somaticZone: 'head_ears',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 464,
          type: 'scale',
          title: 'Verankerung von Triggerwörtern (Konditionierung)',
          desc: 'Was es ist: Ein bestimmtes Wort (z. B. „Schlaf“ oder „Erschlaffen“) verknüpfen mit sofortigem Muskel-Loslassen.\nWas daran anmacht: Mechanischer Abruf von Ergebung; der Körper reagiert unwillkürlich vor dem Verstand.',
          r1Label: 'Das Triggerwort setzen und die Wirkung abrufen',
          r2Label: 'Auf das Triggerwort hin sofort willenlos entspannen',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 465,
          type: 'scale',
          title: 'Berührungs-Trigger an Schlüsselbein oder Nacken',
          desc: 'Was es ist: Ein bestimmter Fingerdruck an der Schulter löst sofortiges Verstummen und Gehorsam aus.\nWas daran anmacht: Somatische Fernsteuerung; Berührung ersetzt langwierige verbale Erklärungen.',
          r1Label: 'Den Berührungsanker setzen und nutzen',
          r2Label: 'Den Fingerdruck spüren & sofort folgen',
          somaticZone: 'head_neck',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 466,
          type: 'scale',
          title: 'Erotische Amnesie (Vergessen auf Befehl)',
          desc: 'Was es ist: Suggerieren, dass man bestimmte Momente der Session bis zur Erlaubnis nicht erinnern kann.\nWas daran anmacht: Absolute Hingabe der eigenen Erinnerung; das Geheimnis liegt allein beim Top.',
          r1Label: 'Die Amnesie anleiten und auflösen',
          r2Label: 'Den Geist leeren lassen & Vergessen erleben',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 467,
          type: 'scale',
          title: 'Augenfixierung auf Pendel, Licht oder Finger',
          desc: 'Was es ist: Einen Gegenstand mit den Augen fixieren, bis die Lider schwer werden und zufallen.\nWas daran anmacht: Fokussierte Ermüdung des Sehsinns leitet zuverlässig in tiefe Trancezustände.',
          r1Label: 'Den Fokus-Gegenstand ruhig führen',
          r2Label: 'Den Blick fesseln lassen & müde werden',
          somaticZone: 'head_eyes',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 468,
          type: 'scale',
          title: 'Posthypnotische Befehle für den Folgetag',
          desc: 'Was es ist: Einen Befehl für den nächsten Tag pflanzen (z. B. jedes Mal an die Partnerin denken, wenn das Telefon klingelt).\nWas daran anmacht: Die D/s-Dynamik wirkt im Alltag unbewusst und automatisch weiter.',
          r1Label: 'Den posthypnotischen Impuls einpflanzen',
          r2Label: 'Den Impuls am nächsten Tag spüren & lächeln',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 469,
          type: 'scale',
          title: 'Endorphin-Rausch im Subspace halten',
          desc: 'Was es ist: Den schwebenden Zustand nach langem Binden oder Spanking achtsam begleiten.\nWas daran anmacht: Verantwortungsbewusste Pflege des veränderten Bewusstseinszustands.',
          r1Label: 'Den Subspace ruhig bewachen',
          r2Label: 'Im Subspace schweben & selig sein',
          somaticZone: 'psyche_mind',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 470,
          type: 'scale',
          title: 'Hypnotische Zählung von 10 bis 1',
          desc: 'Was es ist: Langsames, rhythmisches Herunterzählen, bei dem jede Zahl doppelt so schwer entspannt.\nWas daran anmacht: Verlässliche, vorhersagbare Treppe in die vollkommene Entspannung.',
          r1Label: 'Die Zahlen ruhig und tief sprechen',
          r2Label: 'Mit jeder Zahl tiefer sinken',
          somaticZone: 'head_ears',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 471,
          type: 'scale',
          title: 'Geführte Traumreise vor dem Schlafengehen',
          desc: 'Was es ist: Dem liegenden Partner mit sanfter Stimme eine erotische oder geborgene Szene ins Ohr erzählen.\nWas daran anmacht: Pflanzt beruhigende, verbindende Bilder direkt in das Einschlaf-Bewusstsein.',
          r1Label: 'Die Traumreise leise erzählen',
          r2Label: 'Der Fantasie lauschen & friedlich einschlafen',
          somaticZone: 'head_ears',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 472,
          type: 'choice',
          title: 'Bereitschaft für Trance- und Hypnospiele',
          desc: 'Wie stehst du zu mentaler Beeinflussung?',
          question: 'Wie weit darf mentale Trance bei euch gehen?',
          somaticZone: 'psyche_mind',
          options: [
            { val: 'relax', label: 'Nur sanfte Tiefenentspannung & Vagusnerv-Beruhigung' },
            { val: 'triggers', label: 'Echtes Hypno-Play mit Triggerwörtern & Gehorsams-Ankern' },
            { val: 'none', label: 'Mentale Beeinflussung ist für mich ein Tabu' }
          ]
        }
      ]
    },

    {
      id: 33,
      slug: 'chapter_33_wax_nuru_temperature',
      title: 'Kapitel 33: Spezial-Kinks: Wachsspiel, Nuru & Temperatur-Ekstase',
      desc: 'Ausgefallene sensorische Reize: Heißes Niedrigtemperatur-Wachs, japanische Algenmassage und Fire & Ice.',
      items: [
        {
          id: 473,
          type: 'scale',
          title: 'Niedrigtemperatur-Wachsspiel (Wax Play)',
          desc: 'Was es ist: Spezielles Soja- oder BDSM-Kerzenwachs aus der Höhe auf Bauch, Po oder Schenkel tropfen lassen.\nWas daran anmacht: Der plötzliche, punktuelle Hitzeschock, der nach zwei Sekunden in wohlige Wärme erstarrt.',
          r1Label: 'Die Kerze ruhig halten & gezielt Wachstropfen setzen',
          r2Label: 'Die heißen Wachstropfen auf der Haut empfangen',
          somaticZone: 'torso_skin',
          equipmentTags: ['wax_candle'],
          restraintLayer: 0
        },
        {
          id: 474,
          type: 'scale',
          title: 'Wachsschichten mit Kreditkarte abschaben',
          desc: 'Was es ist: Das erkaltete Wachs langsam mit einer Plastikkarte von der geröteten Haut abkratzen.\nWas daran anmacht: Prickelnder Schabereiz; befreit die Haut und hinterlässt tiefes Kribbeln.',
          r1Label: 'Das Wachs sorgsam und spürbar abschaben',
          r2Label: 'Das Schaben der Kante auf der Haut spüren',
          somaticZone: 'torso_skin',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 475,
          type: 'scale',
          title: 'Nuru-Massage (Japanische Algen-Gleitmassage)',
          desc: 'Was es ist: Body-to-Body Gleitmassage mit extrem glitschigem Nuru-Gel aus echten Braunalgen.\nWas daran anmacht: Reibungsloses Gleiten; Körpergrenzen verschwimmen im warmen Algenfilm vollkommen.',
          r1Label: 'Den Partner mit vollem Körpereinsatz gleitend massieren',
          r2Label: 'Den glitschigen Body-to-Body Gleitreiz empfangen',
          somaticZone: 'full_body',
          equipmentTags: ['oil'],
          restraintLayer: 0
        },
        {
          id: 476,
          type: 'scale',
          title: 'Fire & Ice Kontrast (Hitze & Eiseskälte vereint)',
          desc: 'Was es ist: Wärmender Minz- oder Capsaicin-Balsam kombiniert mit direkt darüber streichenden Eiswürfeln.\nWas daran anmacht: Verwirrt die Thermorezeptoren der Haut; erzeugt einen elektrisierenden Taubheits-Schauer.',
          r1Label: 'Hitze und Kälte im schnellen Wechsel anwenden',
          r2Label: 'Den brennenden Eisschock auf der Haut aushalten',
          somaticZone: 'torso_skin',
          equipmentTags: ['ice'],
          restraintLayer: 0
        },
        {
          id: 477,
          type: 'scale',
          title: 'Kühles Glas-Toy auf glühender Haut',
          desc: 'Was es ist: Ein glattes, gekühltes Glas-Toy über durchblutete oder geschlagene Körperstellen führen.\nWas daran anmacht: Kühles Borosilikatglas nimmt die Hautwärme blitzschnell auf; pure Linderung und Kontrast.',
          r1Label: 'Das Glas-Toy führen & Reizlinien ziehen',
          r2Label: 'Die kühlende Glätte des Glases empfangen',
          somaticZone: 'gluteal_pelvis',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 478,
          type: 'scale',
          title: 'Queening & Facesitting (Dienen mit der Zunge)',
          desc: 'Was es ist: Die Partnerin setzt sich auf das Gesicht des Partners und steuert Atmung und Lecken.\nWas daran anmacht: Reine Dominanz des Beckens; der Mund des Partners wird zur ausschließlichen Lustquelle.',
          r1Label: 'Auf das Gesicht setzen & den Takt bestimmen',
          r2Label: 'Unter dem Becken liegen & mit Hingabe lecken',
          somaticZone: 'head_face',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 479,
          type: 'scale',
          title: 'Schmelzendes Eis im Bauchnabel & Trinken',
          desc: 'Was es ist: Einen Eiswürfel in der Nabelmulde schmelzen lassen und das Schmelzwasser aufsaugen.\nWas daran anmacht: Kleiner, lokalisierter Kältereiz im Bauchzentrum gefolgt von heißem Mundkontakt.',
          r1Label: 'Das Eis im Nabel platzieren & Wasser trinken',
          r2Label: 'Die Kälte in der Nabelmulde aushalten',
          somaticZone: 'torso_skin',
          equipmentTags: ['ice'],
          restraintLayer: 0
        },
        {
          id: 480,
          type: 'choice',
          title: 'Bevorzugte sensorische Spezialität',
          desc: 'Welche Spezialität reizt deine Haut am meisten?',
          question: 'Welcher dieser besonderen Kinks spricht dich an?',
          somaticZone: 'torso_skin',
          options: [
            { val: 'wax', label: 'Niedrigtemperatur-Wachsspiel auf der Haut' },
            { val: 'nuru', label: 'Schwereloses Nuru-Algen-Gleiten Body-to-Body' },
            { val: 'fire_ice', label: 'Fire & Ice (Temperatur-Schocks)' },
            { val: 'none', label: 'Reine normale Berührungen ohne Temperatur/Gel' }
          ]
        }
      ]
    },

    {
      id: 34,
      slug: 'chapter_34_heavy_restraints_vacuum',
      title: 'Kapitel 34: Extreme Restriktion, Latex-Vakuumbett & Heavy Bondage',
      desc: 'Vollkommene Bewegungslosigkeit: Vakuumbetten, Predicament Bondage und unbewegliche Haltungskragen.',
      items: [
        {
          id: 481,
          type: 'scale',
          title: 'Latex-Vakuumbett mit Atemschlauch',
          desc: 'Was es ist: Luftdicht zwischen zwei Latexschichten eingeschlossen liegen, während eine Pumpe die Luft absaugt.\nWas daran anmacht: Vollkommene Ganzkörperkompression; das Gewicht der Atmosphäre drückt den Körper unbeweglich fest.',
          r1Label: 'Die Vakuumpumpe bedienen & den Partner versiegeln',
          r2Label: 'Unter der Latexkompression bewegungslos atmen',
          somaticZone: 'full_body',
          equipmentTags: ['latex_catsuit'],
          restraintLayer: 2
        },
        {
          id: 482,
          type: 'scale',
          title: 'Zwickmühlen-Fesselung (Predicament Bondage)',
          desc: 'Was es ist: Eine Bindung, bei der das Entlasten eines Muskels automatisch eine andere Seilspannung verstärkt.\nWas daran anmacht: Psychologisches Dilemma; der Bottom muss aktiv die Balance zwischen zwei Reizen halten.',
          r1Label: 'Das Fessel-Dilemma knüpfen & beobachten',
          r2Label: 'Das Kräfte-Gleichgewicht im Seil halten müssen',
          somaticZone: 'full_body',
          equipmentTags: ['rope'],
          restraintLayer: 2
        },
        {
          id: 483,
          type: 'scale',
          title: 'Starrer Haltungskragen (Posture Collar)',
          desc: 'Was es ist: Ein breiter, steifer Leder- oder Metallkragen, der das Kinn oben hält und aufrechte Haltung erzwingt.\nWas daran anmacht: Verhindert das Senken des Kopfes; erzwingt stolze, unnahbare Aufrichtung der Halswirbelsäule.',
          r1Label: 'Den Haltungskragen anlegen & Haltung prüfen',
          r2Label: 'Mit kerzengeradem Hals den Kragen tragen',
          somaticZone: 'head_neck',
          equipmentTags: ['posture_collar'],
          restraintLayer: 1
        },
        {
          id: 484,
          type: 'scale',
          title: 'Mumifizierung (Kokon aus elastischen Binden)',
          desc: 'Was es ist: Den gesamten Körper eng in elastische Binden wickeln wie in einen unbeweglichen Kokon.\nWas daran anmacht: Fester Tiefendruck auf jeden Zentimeter Haut; schaltet die Außenwelt sensorisch ab.',
          r1Label: 'Den Partner behutsam einwickeln & versiegeln',
          r2Label: 'Im warmen, unbeweglichen Kokon tief abtauchen',
          somaticZone: 'full_body',
          equipmentTags: ['cuffs'],
          restraintLayer: 2
        },
        {
          id: 485,
          type: 'scale',
          title: 'Tape Bondage (Fixierung mit Klebeband)',
          desc: 'Was es ist: Arme oder Beine eng mit reißfestem Klebeband zusammenwickeln für totale Arretierung.\nWas daran anmacht: Knisterndes, unnachgiebiges Material; schließt jede kleinste Fingerbewegung aus.',
          r1Label: 'Mit dem Tape präzise wickeln & fixieren',
          r2Label: 'Vollkommen unbeweglich im Klebeband liegen',
          somaticZone: 'limbs_hands_wrists',
          equipmentTags: ['cuffs'],
          restraintLayer: 2
        },
        {
          id: 486,
          type: 'scale',
          title: 'Ausstellen & Posieren als lebendes Kunstwerk (Display)',
          desc: 'Was es ist: In schönen Fesseln oder Lackkleidung reglos im Raum posieren wie eine lebendige Statue.\nWas daran anmacht: Ästhetische Objektwerdung; der Körper wird zum reinen Schauobjekt des Tops.',
          r1Label: 'Den Partner arrangieren & den Anblick genießen',
          r2Label: 'Als lebendiges Kunstwerk still verharren',
          somaticZone: 'full_body',
          equipmentTags: [],
          restraintLayer: 1
        },
        {
          id: 487,
          type: 'scale',
          title: 'Schwere Stahlketten mit Vorhängeschlössern',
          desc: 'Was es ist: Echte massive Eisenketten tragen; das kalte Gewicht sorgt für tiefes Ausgeliefertsein.\nWas daran anmacht: Das metallische Rasseln und die Schwere des Eisens signalisieren unentrinnbare Gefangenschaft.',
          r1Label: 'Die Ketten verschließen & das Schloss sichern',
          r2Label: 'Die schweren Ketten tragen & gefangen sein',
          somaticZone: 'full_body',
          equipmentTags: ['chain'],
          restraintLayer: 2
        },
        {
          id: 488,
          type: 'choice',
          title: 'Bereitschaft für extreme Restriktion',
          desc: 'Wie eng darf die Bewegungseinschränkung sein?',
          question: 'Welchen Grad von Restriktion kannst du dir vorstellen?',
          somaticZone: 'full_body',
          options: [
            { val: 'mild', label: 'Normale Seilfesseln und Klettfesseln' },
            { val: 'heavy', label: 'Starre Kragen, Monohandschuhe und Predicament-Dilemmas' },
            { val: 'vacuum', label: 'Latex-Vakuumbett und Ganzkörper-Kokon' },
            { val: 'none', label: 'Bewegungslosigkeit löst bei mir Panik aus' }
          ]
        }
      ]
    },

    {
      id: 35,
      slug: 'chapter_35_pet_play',
      title: 'Kapitel 35: Pet Play (Puppy Play, Pony Play & Dressur)',
      desc: 'Tierische Unbeschwertheit: Masken, Ohren, Zügel, Bälle apportieren und Dressur im Raum.',
      items: [
        {
          id: 489,
          type: 'scale',
          title: 'Puppy Play: Unbeschwertes Welpen-Rollenspiel',
          desc: 'Was es ist: Mit Lederhaube, Ohren und Leine verspielt auf allen Vieren toben, bellen und kuscheln.\nWas daran anmacht: Befreit von menschlicher Sprache und Verstand; reines tierisches Freuen und Gehorchen.',
          r1Label: 'Den Welpen trainieren, kraulen, füttern & führen',
          r2Label: 'Als braver Hund gehorchen, bellen & spielen',
          somaticZone: 'head_face',
          equipmentTags: ['mask', 'collar', 'leash'],
          restraintLayer: 1
        },
        {
          id: 490,
          type: 'scale',
          title: 'Bälle apportieren & auf Befehl Pfote geben',
          desc: 'Was es ist: Mit dem Mund Gegenstände bringen und für Streicheleinheiten Männchen machen.\nWas daran anmacht: Spielerische Demut; der Mund wird zum Werkzeug des Hundes.',
          r1Label: 'Gegenstände werfen & Gehorsam belohnen',
          r2Label: 'Gegenstände apportieren & Pfote geben',
          somaticZone: 'head_mouth',
          equipmentTags: ['mask'],
          restraintLayer: 0
        },
        {
          id: 491,
          type: 'scale',
          title: 'Kraulen hinter den Ohren als Belohnung',
          desc: 'Was es ist: Sanftes Kraulen an den Schläfen und Haaren als höchste Belohnung für den Welpen.\nWas daran anmacht: Löst tiefe Beruhigung aus; belohnt Unterordnung mit purer Zärtlichkeit.',
          r1Label: 'Den Welpen liebevoll hinter den Ohren kraulen',
          r2Label: 'Das Kraulen an den Ohren mit Schnurren genießen',
          somaticZone: 'head_neck',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 492,
          type: 'scale',
          title: 'Pony Play: Zaumzeug, Zügel & Schritt-Trab',
          desc: 'Was es ist: Mit Trense, Gebissknebel und Zügeln im Takt geführt werden und parieren.\nWas daran anmacht: Stolze, disziplinierte Haltung; der Top bestimmt Gangart, Tempo und Richtung.',
          r1Label: 'Die Zügel führen & den Schritt-Takt vorgeben',
          r2Label: 'Am Zügel laufen, traben & auf Kommandos parieren',
          somaticZone: 'head_mouth',
          equipmentTags: ['gag', 'leash'],
          restraintLayer: 1
        },
        {
          id: 493,
          type: 'scale',
          title: 'Pferdeschweif (Butt-Plug mit Schweifhaaren)',
          desc: 'Was es ist: Einen Analplug mit echtem Rosshaarschweif tragen, der beim Gehen mitschwingt.\nWas daran anmacht: Visuelle Verwandlung; verbindet anale Ausfüllung mit animalischer Ästhetik.',
          r1Label: 'Den Schweif-Plug anlegen & das Mitschwingen mustern',
          r2Label: 'Den Schweif tragen & auf allen Vieren traben',
          somaticZone: 'anal_perineum',
          equipmentTags: ['butt_plug'],
          restraintLayer: 1
        },
        {
          id: 494,
          type: 'scale',
          title: 'Dressur mit Gerte an den Fesseln',
          desc: 'Was es ist: Leichte Berührungen mit der Reitgerte an den Waden zur Takt- und Haltungskorrektur.\nWas daran anmacht: Präzise nonverbale Führung; trainiert die Aufmerksamkeit auf jede kleinste Geste.',
          r1Label: 'Mit der Gerte die Haltung dosiert korrigieren',
          r2Label: 'Die Gertenkorrektur spüren & Haltung wahren',
          somaticZone: 'limbs_legs',
          equipmentTags: ['crop'],
          restraintLayer: 0
        },
        {
          id: 495,
          type: 'choice',
          title: 'Deine Haltung zu Pet Play',
          desc: 'Spricht dich tierisches Rollenspiel an?',
          question: 'Wie stehst du zu Puppy- oder Pony-Play?',
          somaticZone: 'psyche_mind',
          options: [
            { val: 'puppy', label: 'Puppy Play (Verspielt, kuschelig, Welpen-Charakter)' },
            { val: 'pony', label: 'Pony Play (Disziplin, Zaumzeug, Zügel & Dressur)' },
            { val: 'both', label: 'Beides auf seine Weise reizvoll' },
            { val: 'none', label: 'Pet Play spricht mich überhaupt nicht an' }
          ]
        }
      ]
    },

    {
      id: 36,
      slug: 'chapter_36_degradation_vs_worship',
      title: 'Kapitel 36: Demütigung (Degradation) vs. Hohe Verehrung (Worship)',
      desc: 'Das psychologische Gefälle: Schimpfwörter, Spott und Spucken vs. andächtige Vergötterung des Körpers.',
      items: [
        {
          id: 496,
          type: 'scale',
          title: 'Vulgäre verbale Demütigung (Name Calling)',
          desc: 'Was es ist: Nutzung derber Schimpfwörter („Schlampe“, „Hure“, „Luder“ bzw. „Versager“, „Knecht“) im Rausch.\nWas daran anmacht: Bricht den Alltagsstolz und entlässt den Partner in schamloses Verlangen.',
          r1Label: 'Harte Schimpfwörter im Bett benutzen',
          r2Label: 'Mit harten Schimpfwörtern belegt werden & erregt sein',
          somaticZone: 'head_ears',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 497,
          type: 'scale',
          title: 'Spott über Geilheit & Wimmern (Humiliation)',
          desc: 'Was es ist: Sich über das Zittern, Betteln oder Tropfen des Partners lustig machen.\nWas daran anmacht: Entblößt die unkontrollierte Lust des Bottoms; verstärkt die Machtasymmetrie.',
          r1Label: 'Den Partner spöttisch mustern & verspotten',
          r2Label: 'Verspottet werden, während man wimmert',
          somaticZone: 'head_face',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 498,
          type: 'scale',
          title: 'Spucken auf den Körper als Dominanzgeste',
          desc: 'Was es ist: Dem Partner als Zeichen herber Überlegenheit auf die Brust oder Schenkel spucken.\nWas daran anmacht: Archaische Geste absoluter Besitzergreifung und Überlegenheit.',
          r1Label: 'Gezielt auf den Körper spucken',
          r2Label: 'Die Spucke empfangen & Haltung wahren',
          somaticZone: 'torso_skin',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 499,
          type: 'scale',
          title: 'Vollkommene Vergötterung (Body Worship)',
          desc: 'Was es ist: Das Gegenstück: Den Körper des Partners andächtig auf Knien küssen und preisen wie eine Gottheit.\nWas daran anmacht: Reine somatische Andacht; schenkt dem Partner das Gefühl unantastbarer Erhabenheit.',
          r1Label: 'Den Partner wie eine Gottheit andächtig verehren',
          r2Label: 'Auf Knien verehrt & vergöttert werden',
          somaticZone: 'full_body',
          equipmentTags: [],
          restraintLayer: 0
        },
        {
          id: 500,
          type: 'choice',
          title: 'Deine Balance zwischen Demütigung & Worship',
          desc: 'Welches psychologische Machtgefühl zieht dich an?',
          question: 'Welche Richtung spricht deine Seele mehr an?',
          somaticZone: 'psyche_mind',
          options: [
            { val: 'worship', label: 'Reines Body Worship (Andächtige Vergötterung & Liebesdienst)' },
            { val: 'degradation', label: 'Erotische Demütigung (Schimpfwörter, Spott & Spucken)' },
            { val: 'both', label: 'Ein Wechselspiel aus beidem je nach Session' },
            { val: 'none', label: 'Weder Erniedrigung noch Vergötterung – reine partnerschaftliche Nähe' }
          ]
        }
      ]
    },

    {
      id: 0,
      slug: 'chapter_00_psychosomatic_safety',
      title: 'Schutzkapitel 00: Psychosomatische Sicherheit, Trauma & Trigger',
      desc: 'Das unantastbare Sicherheitsfundament: Frühere Belastungen, Flashback-Trigger, Überforderungs-Reaktionen und vertraglich bindende Soforthilfe (§ 8 Beziehungsvertrag).',
      items: [
        {
          id: 901,
          type: 'choice',
          title: 'Sexuelle & emotionale Vorerfahrungen',
          desc: 'Ehrliche Selbsteinschätzung früherer Belastungen, Grenzüberschreitungen oder Übergriffe zum Schutz des Paarraums.',
          question: 'Gibt es frühere belastende Erfahrungen, die dich heute noch berühren können?',
          somaticZone: 'psyche_mind',
          options: [
            { val: 'none', label: 'Keine nennenswerten Belastungen – ich fühle mich vollkommen stabil' },
            { val: 'mild', label: 'Leichte Vorerfahrungen – achtsames Herantasten im Vertrauen reicht aus' },
            { val: 'severe', label: 'Relevante Grenzverletzungen – bestimmte Zonen/Worte erfordern höchste Wachsamkeit' }
          ]
        },
        {
          id: 902,
          type: 'choice',
          title: 'Körperliche & seelische Flashback-Trigger',
          desc: 'Spezifische Sinnesreize, die Panik, Erstarrung oder Abwehr auslösen können und strikt tabu sind.',
          question: 'Welche Reize erfordern absolute Vorsicht oder sind strikt zu vermeiden?',
          somaticZone: 'psyche_mind',
          options: [
            { val: 'words', label: 'Bestimmte Schimpfwörter oder abwertender Tonfall' },
            { val: 'airway', label: 'Atembegrenzung, Enge am Hals oder Bedeckung von Mund/Nase' },
            { val: 'restraint', label: 'Vollständige Fixierung ohne eigene Restbeweglichkeit' },
            { val: 'darkness', label: 'Plötzliche, unangekündigte Dunkelheit' },
            { val: 'none', label: 'Keine spezifischen Flashback-Trigger bekannt' }
          ]
        },
        {
          id: 903,
          type: 'choice',
          title: 'Reaktion bei Überforderung / Dissoziation',
          desc: 'Wie dein vegetatives Nervensystem reagiert, wenn eine Situation kippt oder zu nah geht.',
          question: 'Wie äußert sich bei dir ein Zustand akuter emotionaler Überforderung?',
          somaticZone: 'psyche_mind',
          options: [
            { val: 'freeze', label: 'Freeze (Erstarren, Verstummen, Wegdriften in den Kopf)' },
            { val: 'tears', label: 'Weinen & emotionaler Tränenausbruch' },
            { val: 'flight', label: 'Fluchtreflex (Wegzucken, sofortiges Aufstehen wollen)' },
            { val: 'panic', label: 'Herzrasen & flache, hektische Atmung' }
          ]
        },
        {
          id: 904,
          type: 'choice',
          title: 'Gewünschte Intervention des Partners bei Trigger',
          desc: 'Welche konkrete Soforthandlung des Partners dir verlässlich hilft wieder zu landen (§ 8 Abs. 2 Beziehungsvertrag).',
          question: 'Was soll dein Partner unverzüglich tun, wenn du getriggert wirst?',
          somaticZone: 'psyche_mind',
          options: [
            { val: 'hug', label: 'Feste, stumme Umarmung & Halten (Gewichtsdecken-Effekt)' },
            { val: 'distance', label: 'Körperliche Berührung sofort einstellen & Raum gewähren' },
            { val: 'grounding', label: 'Licht anmachen, zudecken & synchrone 4-7-8 Vagus-Atmung' },
            { val: 'water_tea', label: 'Schluck warmen Tee oder Wasser reichen, ohne zu fragen' },
            { val: 'voice', label: 'Mit leiser, ruhiger Stimme reden und Sicherheit zusprechen' }
          ]
        },
        {
          id: 905,
          type: 'choice',
          title: 'Umgang mit Scham & Schutzraum (Spottverbot)',
          desc: 'Vereinbarter Verhaltenskodex bei verletzlichen, schambesetzten Wünschen (§ 1 Abs. 2 Beziehungsvertrag).',
          question: 'Welchen Rahmen benötigst du bei verletzlichen Fantasien (🙈)?',
          somaticZone: 'psyche_mind',
          options: [
            { val: 'ban_mockery', label: 'Absolutes Spottverbot im Alltag – niemals als Witz erwähnen' },
            { val: 'darkness_only', label: 'Nur im geschützten Halbdunkel mit ausdrücklicher Bestätigung erkunden' },
            { val: 'praise', label: 'Aktives Lob & Bestärkung nötig, um die Scham abzulegen' }
          ]
        }
      ]
    }
  ];

  window.surveyChaptersPart3 = surveyChaptersPart3;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = surveyChaptersPart3;
  }

})(typeof window !== 'undefined' ? window : this);
