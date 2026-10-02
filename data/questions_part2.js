/**
 * data/questions_part2.js
 * TACTUS Psychometrischer Konsens-Katalog · Teil 2 (Kapitel 18 bis 35)
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien nach Master-Roadbook:
 * - 100 % UTF-8 Integrität: Echte deutsche Umlaute (ä, ö, ü, ß) im gesamten Modul
 * - Exakte Primärschlüssel-Invarianz: Items 91 bis 180 linear und unantastbar
 * - Typisierung: 'scale' (Likert 0–5) für alle Items zur Doppelbewertung (Top r1 & Bottom r2)
 * - Kinetische & somatische Metadaten (somaticZone, equipmentTags, restraintLayer) für DoF & Staging
 * - Globale Bereitstellung an window.surveyChaptersPart2 sowie CommonJS-Export
 */

(function(window) {
  'use strict';

  const surveyChaptersPart2 = [
    {
      id: 19,
      slug: 'chapter_18_caregiver',
      title: 'Kapitel 18: Caregiver, Aftercare & Emotionale Fürsorge',
      desc: 'Behutsames Auffangen, Vagus-Erdung, sensorischer Tiefendruck und die biochemische Nachsorge.',
      items: [
        { id: 91, type: 'scale', title: 'Festes Einwickeln in eine schwere Decke', desc: 'Nach der Session fest in eine weiche Decke wickeln (Burrito-Style) für tiefen sensorischen Druck.', somaticZone: 'full_body', equipmentTags: ['blanket'], restraintLayer: 0 },
        { id: 92, type: 'scale', title: 'Haare sanft kämmen & Kopf streicheln', desc: 'Mit ruhigen Strichen die Haare entwirren, den Scheitel küssen und leise Sicherheit zusprechen.', somaticZone: 'head_neck', equipmentTags: [], restraintLayer: 0 },
        { id: 93, type: 'scale', title: 'Warmes Getränk & Traubenzucker reichen', desc: 'Tee oder Wasser mit Traubenzucker oder Schokolade reichen, um den Blutzuckerspiegel zu heben.', somaticZone: 'head_mouth', equipmentTags: [], restraintLayer: 0 },
        { id: 94, type: 'scale', title: 'Langes Halten in Stille (Holding)', desc: 'Mindestens 20 Minuten eng umschlungen daliegen, ohne Worte, und dem Herzschlag lauschen.', somaticZone: 'full_body', equipmentTags: ['blanket'], restraintLayer: 0 },
        { id: 95, type: 'scale', title: 'Sanftes Abwaschen mit warmem Waschlappen', desc: 'Schweiß, Tränen oder Gleitgel behutsam mit einem feuchten Tuch von Gesicht und Körper waschen.', somaticZone: 'torso_skin', equipmentTags: [], restraintLayer: 0 }
      ]
    },

    {
      id: 20,
      slug: 'chapter_19_spanking_drama',
      title: 'Kapitel 19: Spanking-Dramaturgie & Vorbeuge-Positionen',
      desc: 'Bettkanten-Haltung, Kniestand-Appell, Warmklopfen, Mitzähl-Disziplin und Reizwechsel.',
      items: [
        { id: 96, type: 'scale', title: 'Vorbeuge über die Bettkante', desc: 'Das Becken an der Matratzenkante, die Füße fest am Boden; das Gesäß exponiert.', somaticZone: 'gluteal_pelvis', equipmentTags: [], restraintLayer: 0 },
        { id: 97, type: 'scale', title: 'Aufrechte Kniestand-Haltung (Nadu)', desc: 'Aufrecht kniend, Hände im Nacken oder am Rücken verschränkt; vollkommene Auslieferung.', somaticZone: 'gluteal_pelvis', equipmentTags: [], restraintLayer: 0 },
        { id: 98, type: 'scale', title: 'Warmklopfen mit flacher Handfläche', desc: 'Zu Beginn mit sanften Klapsen die Durchblutung anregen, bis ein wohliger Hitzeschleier entsteht.', somaticZone: 'gluteal_pelvis', equipmentTags: [], restraintLayer: 0 },
        { id: 99, type: 'scale', title: 'Mitzählen mit verbalem Danke', desc: 'Nach jedem Treffer laut vernehmbar: „Eins, danke Herrin/Sir“, „Zwei, danke...“.', somaticZone: 'head_mouth', equipmentTags: [], restraintLayer: 0 },
        { id: 100, type: 'scale', title: 'Streicheln & Kühlen zwischen den Hieben', desc: 'Nach harten Treffern die kühle Hand tröstend auf die brennende Haut legen zur Beruhigung.', somaticZone: 'gluteal_pelvis', equipmentTags: [], restraintLayer: 0 }
      ]
    },

    {
      id: 21,
      slug: 'chapter_20_ds_basics',
      title: 'Kapitel 20: Dominanz & Unterwerfung (D/s Grundlagen)',
      desc: 'Demutsblick, Begrüßungs-Kniestand, Anrede mit Titeln, Erlaubnis-Bitten und Schlafzimmer-Kodex.',
      items: [
        { id: 101, type: 'scale', title: 'Blickführung & Augensenken', desc: 'Den Blick nur heben dürfen, wenn der Top es befiehlt; ansonsten Demutsblick nach unten.', somaticZone: 'head_eyes', equipmentTags: [], restraintLayer: 0 },
        { id: 102, type: 'scale', title: 'Auf die Knie sinken zur Begrüßung', desc: 'Sobald der Partner nach Hause kommt oder das Schlafzimmer betritt, vor ihm niederknien.', somaticZone: 'limbs_knees', equipmentTags: [], restraintLayer: 0 },
        { id: 103, type: 'scale', title: 'Anrede mit Titeln (Herrin / Sir / Meister)', desc: 'Verbindliche Ansprache mit respektvollen Titeln während des Spiels und im Schutzraum.', somaticZone: 'head_mouth', equipmentTags: [], restraintLayer: 0 },
        { id: 104, type: 'scale', title: 'Erlaubnis für Grundbedürfnisse erbitten', desc: 'Fragen müssen: „Darf ich trinken?“, „Darf ich aufstehen?“ oder „Darf ich mich setzen?“.', somaticZone: 'psyche_mind', equipmentTags: [], restraintLayer: 0 },
        { id: 105, type: 'scale', title: 'Feste Regeln & Kodex im Schlafzimmer', desc: 'Ein verbindlicher Katalog von festen Verhaltensregeln zur emotionalen Entlastung des Bottoms.', somaticZone: 'psyche_mind', equipmentTags: [], restraintLayer: 0 }
      ]
    },

    {
      id: 22,
      slug: 'chapter_21_daily_ds',
      title: 'Kapitel 21: D/s im Alltag, Protokolle & Bescheidenheit',
      desc: 'Diskrete Berührungsanker, Tragen von Zeichen, Unterwäsche-Wahl und feste Sitzordnungen.',
      items: [
        { id: 106, type: 'scale', title: 'Hand auf dem Oberschenkel als Ruhe-Signal', desc: 'In Gesellschaft legt der Top die Hand auf den Schenkel des Bottoms als stumme Erinnerung.', somaticZone: 'thighs_inner', equipmentTags: [], restraintLayer: 0 },
        { id: 107, type: 'scale', title: 'Diskretes Tragen eines Symbols im Alltag', desc: 'Ein unauffälliger Ring, Armband oder Kette als geheimes Zeichen der Verbundenheit.', somaticZone: 'torso_skin', equipmentTags: [], restraintLayer: 0 },
        { id: 108, type: 'scale', title: 'Unterwäsche-Auswahl durch den Top', desc: 'Morgens legt der Top fest, welche Dessous oder welcher Slip den Tag über getragen wird.', somaticZone: 'genital_pelvis', equipmentTags: [], restraintLayer: 0 },
        { id: 109, type: 'scale', title: 'Stummer Gehorsam bei bestimmten Blicken', desc: 'Ein bestimmter Blick des Tops im Raum genügt, damit der Bottom verstummt oder Haltung annimmt.', somaticZone: 'head_eyes', equipmentTags: [], restraintLayer: 0 },
        { id: 110, type: 'scale', title: 'Feste Sitzordnung zu Hause (zu Füßen des Tops)', desc: 'Der Bottom sitzt auf einem Hocker oder Kissen zu Füßen des Tops vor dem Sofa.', somaticZone: 'limbs_knees', equipmentTags: [], restraintLayer: 0 }
      ]
    },

    {
      id: 23,
      slug: 'chapter_22_domestic_discipline',
      title: 'Kapitel 22: Häusliche Zucht & Formelle Strafen (Domestic Discipline)',
      desc: 'Strafgespräche, Line Writing, Besinnungsecken, angekündigte Zucht und Versöhnung.',
      items: [
        { id: 111, type: 'scale', title: 'Formelles Straf-Gespräch vor der Zucht', desc: 'Ruhiges, sachliches Benennen des Regelverstoßes; kein Schreien, reine unaufgeregte Autorität.', somaticZone: 'psyche_mind', equipmentTags: [], restraintLayer: 0 },
        { id: 112, type: 'scale', title: 'Strafzeilen schreiben (Line Writing)', desc: '100-mal mit Füller schreiben: „Ich werde pünktlich sein“ oder „Ich folge der Führung“.', somaticZone: 'limbs_hands_wrists', equipmentTags: [], restraintLayer: 0 },
        { id: 113, type: 'scale', title: 'Besinnungs-Ecke (Corner Time)', desc: '15 Minuten mit der Nase zur Wand in der Ecke stehen und still über das Verhalten nachdenken.', somaticZone: 'limbs_knees', equipmentTags: [], restraintLayer: 0 },
        { id: 114, type: 'scale', title: 'Geplante Zucht mit Vorlaufzeit', desc: 'Morgens ankündigen: „Heute Abend nach dem Essen klären wir dein Versäumnis über den Knien“.', somaticZone: 'gluteal_pelvis', equipmentTags: ['leather_belt'], restraintLayer: 0 },
        { id: 115, type: 'scale', title: 'Versöhnung & vollständiger Erlass nach Zucht', desc: 'Direkt nach der Strafe: Feste Umarmung, Kuss – das Thema ist damit ein für alle Mal bereinigt.', somaticZone: 'full_body', equipmentTags: [], restraintLayer: 0 }
      ]
    },

    {
      id: 24,
      slug: 'chapter_23_struggle',
      title: 'Kapitel 23: Erotischer Kampf, Niederringen & Fluchtspiele (Struggle)',
      desc: 'Armdrücken mit sexueller Wette, Ausbruchstests, Kitzeln und Handgelenks-Arretierung.',
      items: [
        { id: 116, type: 'scale', title: 'Armdrücken mit sexueller Wette', desc: 'Kräftemessen am Tisch; der Verlierer muss sich nackt ausziehen oder dem Sieger dienen.', somaticZone: 'limbs_hands_wrists', equipmentTags: [], restraintLayer: 0 },
        { id: 117, type: 'scale', title: 'Ausbruchs-Test aus festem Griff (60 Sekunden)', desc: 'Der Bottom hat 60 Sekunden Zeit, sich aus einer Umklammerung am Boden zu befreien.', somaticZone: 'full_body', equipmentTags: [], restraintLayer: 1 },
        { id: 118, type: 'scale', title: 'Kitzeln bis zum Hecheln', desc: 'Gezieltes Kitzeln an empfindlichen Flanken, während die Gliedmaßen am Boden gehalten werden.', somaticZone: 'torso_flanks', equipmentTags: [], restraintLayer: 0 },
        { id: 119, type: 'scale', title: 'Fluchtversuch durch die Wohnung', desc: 'Weglaufen und versuchen, die Zimmertür zu erreichen, bevor man von hinten gepackt wird.', somaticZone: 'full_body', equipmentTags: [], restraintLayer: 0 },
        { id: 120, type: 'scale', title: 'Fixieren beider Handgelenke über dem Kopf', desc: 'Mit einer Hand beide Arme am Kopfteil festhalten; die andere Hand erkundet den Körper.', somaticZone: 'limbs_hands_wrists', equipmentTags: ['cuffs'], restraintLayer: 1 }
      ]
    },

    {
      id: 25,
      slug: 'chapter_24_mind_games',
      title: 'Kapitel 24: Psychologische Dominanz, Mind Games & Suggestion',
      desc: 'Gedankenleere, widersprüchliche Befehle, Lobentzug, Einflüstern und Körpersprache lesen.',
      items: [
        { id: 121, type: 'scale', title: 'Befehl zur totalen Gedankenleere', desc: 'Mit ruhiger Stimme befehlen: „Kein eigener Gedanke mehr – du hörst nur noch meine Atmung“.', somaticZone: 'psyche_mind', equipmentTags: [], restraintLayer: 0 },
        { id: 122, type: 'scale', title: 'Widersprüchliche Befehle (Mind Games)', desc: '„Komm her – bleib stehen. Fass mich an – nimm die Hände weg.“ Lustvolle Reiz-Verwirrung.', somaticZone: 'psyche_mind', equipmentTags: [], restraintLayer: 0 },
        { id: 123, type: 'scale', title: 'Lobentzug & plötzliche Bestätigung', desc: 'Erst kühl und fordernd bleiben, dann überraschend zärtlich über die Wange streichen.', somaticZone: 'psyche_mind', equipmentTags: [], restraintLayer: 0 },
        { id: 124, type: 'scale', title: 'Suggestives Flüstern bei Erschöpfung', desc: 'Wenn der Partner müde ist, ihm leise ins Ohr flüstern, welchen Dienst er morgen leisten wird.', somaticZone: 'head_ears', equipmentTags: [], restraintLayer: 0 },
        { id: 125, type: 'scale', title: 'Körpersprache laut lesen & spiegeln', desc: 'Laut aussprechen, was man an der Atmung, den Brustwarzen oder dem Puls des Partners sieht.', somaticZone: 'psyche_mind', equipmentTags: [], restraintLayer: 0 }
      ]
    },

    {
      id: 26,
      slug: 'chapter_25_roleplay_fictional',
      title: 'Kapitel 25: Rollenspiele, Fiktion & Fremdheits-Reize',
      desc: 'Fremde in Hotelbar, Chef und Angestellter, Nachsitzen, Masken und Einbrecher-Fiktion (CNC).',
      items: [
        { id: 126, type: 'scale', title: 'Als Fremde in einer Hotelbar verabreden', desc: 'Getrennt eintreffen, sich an die Bar setzen und so tun, als kenne man sich noch gar nicht.', somaticZone: 'psyche_mind', equipmentTags: [], restraintLayer: 0 },
        { id: 127, type: 'scale', title: 'Strenger Vorgesetzter & Angestellter (Rapport)', desc: 'Im Arbeitszimmer zum Rapport bitten; Überstunden-Gehorsam und Verhandlung von Pflichten.', somaticZone: 'psyche_mind', equipmentTags: [], restraintLayer: 0 },
        { id: 128, type: 'scale', title: 'Lehrer & ungezogener Schüler (Nachsitzen)', desc: 'Nachsitzen nach dem Unterricht; Vokabeln abfragen mit Hieben bei Fehlern.', somaticZone: 'psyche_mind', equipmentTags: ['crop', 'paddle'], restraintLayer: 0 },
        { id: 129, type: 'scale', title: 'Erotisches Maskenspiel (Venetian Mask)', desc: 'Edle Masken tragen, die die Mimik verändern und distanzierte Erotik schaffen.', somaticZone: 'head_face', equipmentTags: ['mask'], restraintLayer: 1 },
        { id: 130, type: 'scale', title: 'Fiktiver Einbrecher im Haus (Konsensuales CNC)', desc: 'Vorab vereinbartes Szenario: Überraschung beim Nachhausekommen im Halbdunkel.', somaticZone: 'full_body', equipmentTags: ['blindfold', 'rope'], restraintLayer: 1 }
      ]
    },

    {
      id: 27,
      slug: 'chapter_26_anal_pegging',
      title: 'Kapitel 26: Analerotik, Butt-Plugs & Pegging',
      desc: 'Umkreisen des Afters, Edelstahl-Plugs, diskretes Tragen unterwegs, Pegging und Prostata.',
      items: [
        { id: 131, type: 'scale', title: 'Sanftes Umkreisen & Massieren des Afters', desc: 'Mit reichlich warmem Öl den Schließmuskel entspannen, ohne direkt einzudringen.', somaticZone: 'anal_perineum', equipmentTags: ['oil'], restraintLayer: 0 },
        { id: 132, type: 'scale', title: 'Kühler Edelstahl-Butt-Plug', desc: 'Ein glatter Metallplug, der kühl eingesetzt wird und mit seinem Gewicht spürbar ausfüllt.', somaticZone: 'anal_perineum', equipmentTags: ['butt_plug'], restraintLayer: 1 },
        { id: 133, type: 'scale', title: 'Plug tragen beim Spaziergang oder Einkaufen', desc: 'Den Plug diskret unter normaler Kleidung tragen, während man draußen unterwegs ist.', somaticZone: 'anal_perineum', equipmentTags: ['butt_plug'], restraintLayer: 1 },
        { id: 134, type: 'scale', title: 'Pegging (Sie penetriert ihn mit Strap-on)', desc: 'Die Partnerin trägt ein Gurt-Geschirr mit Dildo und nimmt den Partner von hinten.', somaticZone: 'anal_perineum', equipmentTags: ['strap_on'], restraintLayer: 1 },
        { id: 135, type: 'scale', title: 'Prostata-Massage mit gekrümmtem Toy', desc: 'Gezielter Druck von innen auf die Prostata des Mannes zur somatischen Luststeigerung.', somaticZone: 'anal_perineum', equipmentTags: ['prostate_massager'], restraintLayer: 1 }
      ]
    },

    {
      id: 28,
      slug: 'chapter_27_public_exhibitionism',
      title: 'Kapitel 27: Öffentliche Erotik, Voyeurismus & Exhibitionismus',
      desc: 'Ohne Slip ins Restaurant, Fenster-Intimität bei Nacht, Waldspaziergang und privates Shooting.',
      items: [
        { id: 136, type: 'scale', title: 'Ohne Unterwäsche ins Restaurant gehen', desc: 'Kleid oder Hose ohne Slip tragen; der Partner weiß Bescheid und greift unter den Tisch.', somaticZone: 'genital_pelvis', equipmentTags: [], restraintLayer: 0 },
        { id: 137, type: 'scale', title: 'Intimität am offenen Fenster bei Nacht', desc: 'Im dunklen Zimmer direkt an der Fensterscheibe stehen und sich vereinen.', somaticZone: 'torso_skin', equipmentTags: [], restraintLayer: 0 },
        { id: 138, type: 'scale', title: 'Spaziergang auf einsamem Waldweg unbedeckt', desc: 'Im Wald kurz alle Kleider ablegen und unbedeckt an den Händen geführt werden.', somaticZone: 'full_body', equipmentTags: [], restraintLayer: 0 },
        { id: 139, type: 'scale', title: 'Heimliches Küssen & Fummeln im Kino', desc: 'In der letzten Reihe im Dunkeln fordernd die Hand in die Hose des Partners schieben.', somaticZone: 'genital_pelvis', equipmentTags: [], restraintLayer: 0 },
        { id: 140, type: 'scale', title: 'Privates Fotoshooting im geschützten Raum', desc: 'Ästhetische, intime Bilder voneinander machen für den verschlüsselten 1:1 Foto-Tresor.', somaticZone: 'full_body', equipmentTags: [], restraintLayer: 0 }
      ]
    },

    {
      id: 29,
      slug: 'chapter_28_humiliation',
      title: 'Kapitel 28: Erotische Demütigung & Scham-Entlastung (Humiliation)',
      desc: 'Dienst am Boden, Fußbank, verbale Degradation, CFNM-Nacktheit und Facesitting.',
      items: [
        { id: 141, type: 'scale', title: 'Auf allen Vieren eine Geste am Boden leisten', desc: 'Symbolische Geste der Unterordnung: Einen Wassertropfen vom Boden lecken.', somaticZone: 'head_face', equipmentTags: [], restraintLayer: 0 },
        { id: 142, type: 'scale', title: 'Als Fußbank oder Kissen dienen', desc: 'Flach auf den Bauch legen; der Top legt seine nackten Füße auf den Rücken des Partners.', somaticZone: 'full_body', equipmentTags: [], restraintLayer: 0 },
        { id: 143, type: 'scale', title: 'Verbale Herabsetzung im Rausch (Degradation)', desc: 'Worte wie „Luder“, „Knecht“ oder „Stück Fleisch“ fordernd und erregend aussprechen.', somaticZone: 'psyche_mind', equipmentTags: [], restraintLayer: 0 },
        { id: 144, type: 'scale', title: 'Nackt vor bekleidetem Partner knien (CFNM)', desc: 'Der Bottom vollkommen nackt, der Top im eleganten Ausgeh-Outfit daneben.', somaticZone: 'full_body', equipmentTags: [], restraintLayer: 0 },
        { id: 145, type: 'scale', title: 'Körperlich als Sitzgelegenheit dienen (Facesitting)', desc: 'Die Partnerin setzt sich mit ihrem Becken direkt auf das Gesicht des liegenden Partners.', somaticZone: 'head_face', equipmentTags: [], restraintLayer: 0 }
      ]
    },

    {
      id: 30,
      slug: 'chapter_29_trance_subspace',
      title: 'Kapitel 29: Trance, Hypnose & Subspace-Induktion',
      desc: 'Sprachgeführte Trance, Trigger-Wörter, Pendel-Fixierung, Endorphin-Fokus und Suggestion.',
      items: [
        { id: 146, type: 'scale', title: 'Geführte Trance-Induktion mit Sprache', desc: 'Mit langsamer, tiefer Stimme von 10 bis 1 zählen und schwere Entspannung herbeiführen.', somaticZone: 'psyche_mind', equipmentTags: [], restraintLayer: 0 },
        { id: 147, type: 'scale', title: 'Trigger-Wort für sofortige Entspannung', desc: 'Ein vereinbartes Codewort (z. B. „Fall“ oder „Schlaf“), bei dem alle Muskeln erschlaffen.', somaticZone: 'psyche_mind', equipmentTags: [], restraintLayer: 0 },
        { id: 148, type: 'scale', title: 'Pendel oder Lichtpunkt mit Augen fixieren', desc: 'Einem schwingenden Kristall mit den Augen folgen, bis die Lider schwer werden.', somaticZone: 'head_eyes', equipmentTags: [], restraintLayer: 0 },
        { id: 149, type: 'scale', title: 'Endorphin-Rausch im Subspace halten', desc: 'Den schwebenden Zustand nach Reizen behutsam und wortlos im Arm des Tops bewachen.', somaticZone: 'psyche_mind', equipmentTags: [], restraintLayer: 0 },
        { id: 150, type: 'scale', title: 'Posthypnotische Suggestion für den Tag', desc: 'Einen Gedanken verankern: „Immer wenn du heute den Schlüssel berührst, lächelst du“.', somaticZone: 'psyche_mind', equipmentTags: [], restraintLayer: 0 }
      ]
    },

    {
      id: 31,
      slug: 'chapter_30_temperature_nuru',
      title: 'Kapitel 30: Temperaturspiele, Wachs & Nuru-Massagen',
      desc: 'Niedrigtemperatur-Tropfkerzen, Wachs-Abkratzen, Eis-Wachs-Kontrast und Nuru-Gelee.',
      items: [
        { id: 151, type: 'scale', title: 'Niedrigtemperatur-Tropfkerzen (Sojawachs ~48°C)', desc: 'Spezielles BDSM-Wachs auf Schultern, Rücken oder Gesäß tropfen lassen.', somaticZone: 'torso_skin', equipmentTags: ['wax_candle'], restraintLayer: 0 },
        { id: 152, type: 'scale', title: 'Wachs mit einer Kante abkratzen', desc: 'Das erstarrte Wachs mit einer Plastikkarte mit spürbarem Reiz von der Haut schaben.', somaticZone: 'torso_skin', equipmentTags: [], restraintLayer: 0 },
        { id: 153, type: 'scale', title: 'Wechselbad aus Eis und heißem Wachs', desc: 'Erst ein Eiswürfel, dann direkt ein Tropfen warmes Wachs auf dieselbe Hautstelle.', somaticZone: 'torso_skin', equipmentTags: ['wax_candle', 'ice'], restraintLayer: 0 },
        { id: 154, type: 'scale', title: 'Echte Nuru-Massage auf Plastikplane', desc: 'Plane ausbreiten, warmes Algen-Gel verteilen und nackt Körper an Körper gleiten.', somaticZone: 'full_body', equipmentTags: ['oil'], restraintLayer: 0 },
        { id: 155, type: 'scale', title: 'Wärmender Minz-Balsam auf Intimzonen', desc: 'Spezielle Lotionen, die ein kribbelndes Hitzegefühl auf Schwellkörpern erzeugen.', somaticZone: 'genital_core', equipmentTags: ['oil'], restraintLayer: 0 }
      ]
    },

    {
      id: 32,
      slug: 'chapter_31_heavy_restraints',
      title: 'Kapitel 31: Schwere Fesseln, Vakuumbett & Totalfixierung',
      desc: 'Starrer Haltungskragen, Monohandschuh, Vakuumbett, Mummification und Nachtfesselung.',
      items: [
        { id: 156, type: 'scale', title: 'Starrer Haltungskragen (Posture Collar)', desc: 'Ein hoher Kragen, der das Beugen des Halses verhindert und stolze Haltung erzwingt.', somaticZone: 'head_neck', equipmentTags: ['posture_collar'], restraintLayer: 2 },
        { id: 157, type: 'scale', title: 'Leder-Monohandschuh (Arme am Rücken geschnürt)', desc: 'Beide Arme in eine feste Schnürhülle hinter den Rücken sperren; vollkommen armlos sein.', somaticZone: 'limbs_hands_wrists', equipmentTags: ['cuffs'], restraintLayer: 2 },
        { id: 158, type: 'scale', title: 'Latex-Vakuumbett mit Atemschlauch', desc: 'In einen Gummisack steigen, die Luft absaugen; totale unbewegliche Kompression.', somaticZone: 'full_body', equipmentTags: [], restraintLayer: 2 },
        { id: 159, type: 'scale', title: 'Eingewickelt in Folie (Mummification)', desc: 'Den gesamten Körper von Kopf bis Fuß in transparente Folie wickeln; feste Enge.', somaticZone: 'full_body', equipmentTags: [], restraintLayer: 2 },
        { id: 160, type: 'scale', title: 'Gefesselt im Bett schlafen (Nachtfesselung)', desc: 'Beide Hände mit gepolsterten Fesseln am Bettrahmen gesichert über Nacht schlafen.', somaticZone: 'limbs_hands_wrists', equipmentTags: ['cuffs', 'bed_straps'], restraintLayer: 2 }
      ]
    },

    {
      id: 33,
      slug: 'chapter_32_pet_play',
      title: 'Kapitel 32: Pet Play (Puppy Play, Pony Play & Bändigung)',
      desc: 'Puppymaske, Apportieren, Pony-Zaumzeug mit Gebissknebel, Hundekörbchen und Kraulen.',
      items: [
        { id: 161, type: 'scale', title: 'Leder-Puppymaske mit Ohren tragen', desc: 'Eine weiche Maske mit Hundeohren aufsetzen; Mimik erlischt, nur noch Hecheln und Bellen.', somaticZone: 'head_face', equipmentTags: ['mask'], restraintLayer: 1 },
        { id: 162, type: 'scale', title: 'Bällchen apportieren mit dem Mund', desc: 'Einen weichen Ball werfen; der Partner holt ihn auf allen Vieren mit den Zähnen zurück.', somaticZone: 'head_mouth', equipmentTags: [], restraintLayer: 0 },
        { id: 163, type: 'scale', title: 'Pony-Zaumzeug mit Gebissknebel', desc: 'Eine Trense um den Kopf schnallen; Führung an Zügeln im Trab durch den Raum.', somaticZone: 'head_face', equipmentTags: ['gag'], restraintLayer: 1 },
        { id: 164, type: 'scale', title: 'Hunde-Körbchen als Schlafplatz', desc: 'Eine weiche Matte mit Decken auf dem Boden, auf der der Partner schlafen darf.', somaticZone: 'full_body', equipmentTags: ['blanket'], restraintLayer: 0 },
        { id: 165, type: 'scale', title: 'Fellkraulen & Streicheln hinter den Ohren', desc: 'Den Kopf des Partners lange liebkosen als Belohnung für gezeigten Gehorsam.', somaticZone: 'head_neck', equipmentTags: [], restraintLayer: 0 }
      ]
    },

    {
      id: 34,
      slug: 'chapter_33_medical_play',
      title: 'Kapitel 33: Medical Play, Klinische Zucht & E-Stim',
      desc: 'Stethoskop, Blutdruckmanschette, TENS-Reizstrom, Violet Wand und Plastik-Spülspritzen.',
      items: [
        { id: 166, type: 'scale', title: 'Kühles Stethoskop auf nackter Haut', desc: 'Herzschlag, Lunge und Bauch mit einem Stethoskop abhören; klinische Distanz spüren.', somaticZone: 'torso_skin', equipmentTags: [], restraintLayer: 0 },
        { id: 167, type: 'scale', title: 'Blutdruckmanschette stramm aufpumpen', desc: 'Die Manschette am Oberarm aufpumpen, um ein intensives Stauungsgefühl zu erzeugen.', somaticZone: 'limbs_hands_wrists', equipmentTags: [], restraintLayer: 0 },
        { id: 168, type: 'scale', title: 'E-Stim (TENS-Reizstromgerät mit Pads)', desc: 'Elektroden auf Gesäß oder Schenkel kleben; pulsierende Ströme spannen Muskeln an.', somaticZone: 'gluteal_pelvis', equipmentTags: ['tens_unit'], restraintLayer: 0 },
        { id: 169, type: 'scale', title: 'Violet Wand (Hochfrequenz-Funken)', desc: 'Ein Glaskolben sprüht winzige violette Funken auf die Haut; nadelspitzes Prickeln.', somaticZone: 'torso_skin', equipmentTags: ['violet_wand'], restraintLayer: 0 },
        { id: 170, type: 'scale', title: 'Formschöne Einweg-Spritzen ohne Nadel zur Spülung', desc: 'Warmes Wasser oder Gleitgel mit einer Plastikspritze rektal oder urologisch instillieren.', somaticZone: 'perineum_pelvic_floor', equipmentTags: ['syringe'], restraintLayer: 0 }
      ]
    },

    {
      id: 35,
      slug: 'chapter_34_femdom_worship',
      title: 'Kapitel 34: Femdom, Mistress-Kult & Foot Worship',
      desc: 'Stiefel-Worship auf Knien, Stiletto-Absatz, Handkuss-Protokoll, Findom und Trampling.',
      items: [
        { id: 171, type: 'scale', title: 'Stiefel-Worship auf Knien (Boot Polish)', desc: 'Ihre hohen Lederstiefel andächtig mit Lippen, Zunge und Tuch auf Hochglanz bringen.', somaticZone: 'limbs_ankles_feet', equipmentTags: ['boots'], restraintLayer: 0 },
        { id: 172, type: 'scale', title: 'Stiletto-Absatz auf Brust oder Gesäß spüren', desc: 'Den spitzen Absatz eines High Heels dosiert in die Muskulatur drücken.', somaticZone: 'gluteal_pelvis', equipmentTags: ['boots'], restraintLayer: 0 },
        { id: 173, type: 'scale', title: 'Handkuss-Protokoll bei jeder Begegnung', desc: 'Vor jedem Gespräch ihre Hand ergreifen, den Kopf senken und den Handrücken küssen.', somaticZone: 'limbs_hands_wrists', equipmentTags: [], restraintLayer: 0 },
        { id: 174, type: 'scale', title: 'Vollkommene materielle Verwöhnung (Findom-Geste)', desc: 'Ihr spontan ein wertvolles Geschenk oder eine Überweisung darbringen als Tribut.', somaticZone: 'psyche_mind', equipmentTags: [], restraintLayer: 0 },
        { id: 175, type: 'scale', title: 'Trampling (Barfuß über den Rücken laufen)', desc: 'Mit nackten Füßen über den Rücken des liegenden Partners gehen; Druck und Macht.', somaticZone: 'torso_skin', equipmentTags: [], restraintLayer: 0 }
      ]
    },

    {
      id: 36,
      slug: 'chapter_35_female_sovereignty',
      title: 'Kapitel 35: Weibliche Allmacht, Cuckolding & Vollendung',
      desc: 'Dauerhafte Keuschheit, Fußsohlen-Massage, Begierden-Überwachung, Straf-Tribut und Verschmelzung.',
      items: [
        { id: 176, type: 'scale', title: 'Strikte Keuschheit unter weiblicher Schlüsselgewalt', desc: 'Dauerhafter Verschluss im Käfig; Schlüsselgewalt liegt ausschließlich in ihrer Hand.', somaticZone: 'genital_penile', equipmentTags: ['chastity_cage', 'safe'], restraintLayer: 1 },
        { id: 177, type: 'scale', title: 'Demütige Zehen- und Fußsohlenmassage', desc: 'Ausdauernde, andächtige Pflege ihrer Füße nach einem langen Tag auf den Knien.', somaticZone: 'limbs_ankles_feet', equipmentTags: ['oil'], restraintLayer: 0 },
        { id: 178, type: 'scale', title: 'Totale Alltagsüberwachung des Verlangens', desc: 'Vollkommene Transparenz: Keine Ejakulation, keine Masturbation ohne ausdrückliche Erlaubnis.', somaticZone: 'psyche_mind', equipmentTags: [], restraintLayer: 0 },
        { id: 179, type: 'scale', title: 'Keuschheits-Tribut bei Ungehorsam', desc: 'Jedes Versäumnis verlängert die Tragezeit automatisch um 24 Stunden oder kostet Punkte.', somaticZone: 'psyche_mind', equipmentTags: ['timer'], restraintLayer: 0 },
        { id: 180, type: 'scale', title: 'Vollkommene seelische Verschmelzung im D/s-Bündnis', desc: 'Das Loslassen aller Ego-Grenzen und das bedingungslose Aufgehen in der weiblichen Führung.', somaticZone: 'psyche_mind', equipmentTags: [], restraintLayer: 0 }
      ]
    }
  ];

  window.surveyChaptersPart2 = surveyChaptersPart2;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = surveyChaptersPart2;
  }

})(typeof window !== 'undefined' ? window : this);
