/**
 * data/questions_part2.js
 * PACTUM Erotik- & Kink-Fragebogen (Teil 2: Kapitel 18 bis 35)
 * 
 * Standards & Garantien:
 * - Chronologisch geordnet von Kapitel 18 bis Kapitel 35
 * - 100 % abwärtskompatible, feste Item-IDs für Rasch-IRT und bestehende Antworten
 * - Rollen-Differenzierung: r1 = Ausführen / Führen, r2 = Empfangen / Hingeben
 * - Psychometrische Skala: 0 (Entfällt), 1 (Tabu/Nein), 2 (Eher nicht), 3 (Neutral/Vielleicht), 4 (Gern), 5 (Sehr gern / Must-Have)
 * - Scham-Marker (🙈) für verletzliche Fantasien
 */

(function(window) {
  'use strict';

  const chaptersPart2 = [
    {
      id: 18,
      title: "Kapitel 18: Primal Play, Raufen & Instinkte",
      desc: "Körperliches Ringen, Zubeißen, Dominanz über Kraft und ungefilterte Triebe.",
      items: [
        { id: 91, title: "Spielerisches Ringen um die Oberhand", desc: "Körperlicher Kraftvergleich auf dem Teppich oder der Matratze.", type: "scale" },
        { id: 92, title: "Festes Zupacken & Niederdrücken", desc: "Den Partner mit Körpergewicht und festem Griff bewegungsunfähig machen.", type: "scale" },
        { id: 93, title: "Instinktives Knurren, Fauchen & Beißen", desc: "Spürbare Zahnabdrücke und archaische Laute während des Akts.", type: "scale" },
        { id: 94, title: "Jagd & Beute (Prey / Predator Dynamik)", desc: "Fluchtversuche im Raum mit anschließendem Fangen und Überwältigen.", type: "scale" },
        { id: 95, title: "Zerkratzen des Rückens im Rausch", desc: "Sichtbare Kratzspuren mit den Fingernägeln bei intensiver Erregung.", type: "scale" }
      ]
    },
    {
      id: 19,
      title: "Kapitel 19: Caregiver, Little Space & Beschützer-Instinkte",
      desc: "Geborgenheit, Fürsorge, kindliche Unbeschwertheit und bedingungslose Annahme.",
      items: [
        { id: 96, title: "Feste, wiegende Umarmung nach Erschöpfung", desc: "Den Partner wie ein Schutzbedürftiger im Arm halten und beruhigen.", type: "scale" },
        { id: 97, title: "Füttern und Trinkenreichen aus der Hand", desc: "Verköstigung des Partners ohne dass dieser selbst zugreift.", type: "scale" },
        { id: 98, title: "Kuscheltiere & kindliche Schlafrituale", desc: "Niedliche Requisiten, Schnuller oder Bettdeckenburgen zur Entspannung.", type: "scale" },
        { id: 99, title: "Sanfte Zurechtweisung mit tröstendem Abschluss", desc: "Erzieherische Grenze mit sofortiger liebevoller Bestätigung.", type: "scale" },
        { id: 100, title: "Vorlesen von Geschichten zum Einschlafen", desc: "Die beruhigende Stimme des Partners als Anker zum Loslassen.", type: "scale" }
      ]
    },
    {
      id: 20,
      title: "Kapitel 20: Analerotik & Rektale Erkundungen",
      desc: "Behutsame Dehnung, Entspannung, Toys und anale Höhepunkte.",
      items: [
        { id: 101, title: "Sanfte anale Massage & Rimming (Anilingus)", desc: "Erkundung der Schließmuskelzone mit warmen Fingern oder Zunge.", type: "scale" },
        { id: 102, title: "Tragen von Analplugs im Schlafzimmer", desc: "Schmuckplugs oder Silikonformen zur Dehnung und Fülle.", type: "scale" },
        { id: 103, title: "Analverkehr mit Penis oder Strap-On", desc: "Vollständige anale Penetration mit viel Gleitmittel und Geduld.", type: "scale" },
        { id: 104, title: "Prostata-Stimulation (P-Spot Massage)", desc: "Gezielte Reizung der männlichen Prostata für tiefe Ganzkörperorgasmen.", type: "scale" },
        { id: 105, title: "Stufenweises Weiten (Butt Plug Training Sets)", desc: "Systematischer Aufbau von kleinen zu größeren Durchmessern.", type: "scale" }
      ]
    },
    {
      id: 21,
      title: "Kapitel 21: Pegging & Weibliche Penetration",
      desc: "Die Partnerin dringt mit Strap-On oder Dildo in den Partner ein.",
      items: [
        { id: 106, title: "Tragen eines Strap-On Harness durch die Partnerin", desc: "Die visuelle und physische Macht der Schnall-Vorrichtung an ihr.", type: "scale" },
        { id: 107, title: "Rezeptive Hingabe des Mannes auf allen Vieren", desc: "Der Mann empfängt die Partnerin in klassischer Doggy-Haltung.", type: "scale" },
        { id: 108, title: "Führung und Rhythmus komplett in ihrer Hand", desc: "Sie bestimmt Tiefe, Stoßfrequenz und Härte der Vereinigung.", type: "scale" },
        { id: 109, title: "Reiten des liegenden Mannes mit Strap-On", desc: "Sie sitzt oben und dringt von vorne oder umgedreht in ihn ein.", type: "scale" },
        { id: 110, title: "Demut & Danken nach der Penetration", desc: "Der Mann bedankt sich nach dem Vollzug für ihre Führung.", type: "scale" }
      ]
    },
    {
      id: 22,
      title: "Kapitel 22: Facesitting & Queening / Thronsitz",
      desc: "Das Platzieren des Beckens auf dem Gesicht des Partners.",
      items: [
        { id: 111, title: "Sitzen der Partnerin auf dem Mund des Mannes", desc: "Reine orale Bedienung bei vollständiger Gesichtsbedeckung.", type: "scale" },
        { id: 112, title: "Gewichtsverlagerung & Sauerstoff-Kontrolle", desc: "Leichtes bis festes Aufsitzen mit kontrollierten Atempausen.", type: "scale" },
        { id: 113, title: "Queening als Thronsitz beim Fernsehen / Entspannen", desc: "Sie nutzt sein Gesicht als Sitzgelegenheit im Alltag.", type: "scale" },
        { id: 114, title: "Gegenseitiges 69 mit Gesäß auf Gesicht", desc: "Gleichzeitiges Verwöhnen im engen, beidseitigen Mundkontakt.", type: "scale" },
        { id: 115, title: "Wortloses Verharren unter dem Gesäß", desc: "Der Liegende darf sich nicht bewegen und dient als Kissen.", type: "scale" }
      ]
    },
    {
      id: 23,
      title: "Kapitel 23: Fuß-Erotik, Küsse & Podophilie",
      desc: "Die Hingabe an die Füße, Fußsohlen und Zehen des Partners.",
      items: [
        { id: 116, title: "Ausgiebige Fußmassage mit warmem Balsam", desc: "Verwöhnen der müden Füße nach einem langen Arbeitstag.", type: "scale" },
        { id: 117, title: "Küssen der Zehen und Fußsohlen auf Knien", desc: "Ehrerbietige Geste der Zuneigung und Unterordnung.", type: "scale" },
        { id: 118, title: "Lecken und Saugen an den Zehen", desc: "Sinnliche Stimulation der Zehenzwischenräume mit der Zunge.", type: "scale" },
        { id: 119, title: "Trampling / Gehen über den liegenden Körper", desc: "Sanfter Druck der nackten Fußsohlen auf Brust, Bauch oder Rücken.", type: "scale" },
        { id: 120, title: "Footjob (Stimulation mit den Fußsohlen)", desc: "Erregung des Penis oder der Klitoris rein durch die Füße.", type: "scale" }
      ]
    },

    {
      id: 24,
      title: "Kapitel 24: Knebel, Atemkontrolle & Begrenzung der Sinne",
      desc: "Stumme Hingabe, Atemeinschränkung und sensorische Isolation.",
      items: [
        { id: 121, title: "Ballknebel oder Stoffknebel im Mund", desc: "Verhindert Sprechen; erzeugt wehrloses Sabbern und Murmeln.", type: "scale" },
        { id: 122, title: "Klebeband über den Lippen (Tape Gag)", desc: "Festes Verschließen des Mundes ohne Fremdkörper zwischen Zähnen.", type: "scale" },
        { id: 123, title: "Sanfte Hand auf Mund und Nase (Air Control)", desc: "Kurzzeitiges Nehmen des Atems unter wachsamer Kontrolle.", type: "scale" },
        { id: 124, title: "Schwerer Halsgriff / Choking (nur mit Safeword!)", desc: "Druck auf seitliche Halspartien zur Sauerstoffreduktion.", type: "scale" },
        { id: 125, title: "Nonverbale Klopfsignale als Not-Aus", desc: "Verlässliche Gesten mit den Fingern bei blockierter Sprache.", type: "scale" }
      ]
    },
    {
      id: 25,
      title: "Kapitel 25: CBT, Hoden- & Schamlippen-Reize",
      desc: "Gezielte, sensible Schmerz- und Zugreize an den Geschlechtsteilen.",
      items: [
        { id: 126, title: "Leichte Hodenbänder (Ball Stretcher)", desc: "Leder- oder Silikonringe, die die Hoden sanft nach unten dehnen.", type: "scale" },
        { id: 127, title: "Sanftes Klatschen / Spanking auf Hoden oder Vulva", desc: "Klopfende Schläge mit Handfläche oder kleinem Lederpatscher.", type: "scale" },
        { id: 128, title: "Klammern an Brustwarzen oder Schamlippen", desc: "Verstellbare Krokodil- oder Wäscheklammern mit Kettchen.", type: "scale" },
        { id: 129, title: "Gewichte an Hoden oder Nippeln", desc: "Konstanter, tiefer Zugreiz durch Hängegewichte.", type: "scale" },
        { id: 130, title: "Eiswürfel auf dem Hodensack / Klitoris", desc: "Extremer Kälteschock an den empfindlichsten Nervenenden.", type: "scale" }
      ]
    },
    {
      id: 26,
      title: "Kapitel 26: Latex, Leder, Gummi & Material-Fetisch",
      desc: "Glanz, Duft, Enge und die Haptik synthetischer und natürlicher Häute.",
      items: [
        { id: 131, title: "Tragen von Latexkleidung (Catsuit / Handschuhe)", desc: "Das Gefühl einer zweiten, glänzenden und luftdichten Haut.", type: "scale" },
        { id: 132, title: "Schweres Naturleder (Geruch, Härte, Knarzen)", desc: "Lederjacken, Korsetts, Gurte oder Stiefel als Erregungsquelle.", type: "scale" },
        { id: 133, title: "Eincremen mit Silikon-Shiner / Glanzpolitur", desc: "Sinnliches Einbalsamieren des Gummis am Körper des Partners.", type: "scale" },
        { id: 134, title: "Vakuum-Bett / Luftentzug um den Körper", desc: "Einschluss in Latex-Hülle mit vollständiger Druckanpassung.", type: "scale" },
        { id: 135, title: "Glänzende Seide und Satin-Laken", desc: "Kühle, rutschige Stoffe auf nackter, erhitzter Haut.", type: "scale" }
      ]
    },
    {
      id: 27,
      title: "Kapitel 27: Schmutz, Speichel & Erotische Erniedrigung",
      desc: "Das Brechen von Ekelgrenzen und das Schenken des eigenen Körpers.",
      items: [
        { id: 136, title: "Spucken in den Mund des Partners (Spit Play)", desc: "Direkter Austausch von Speichel als Geste des Besitzes.", type: "scale" },
        { id: 137, title: "Mund als Aschenbecher / Mülleimer (Trash Play)", desc: "Symbolische Degradierung des Körpers zum Nutzgegenstand.", type: "scale" },
        { id: 138, title: "Körperflüssigkeiten ablecken (Schweiß, Tränen)", desc: "Intimes Reinigen der Haut des Partners mit der Zunge.", type: "scale" },
        { id: 139, title: "Verbale Demütigung / Schimpfwörter auf Wunsch", desc: "Verwendung abwertender Kosenamen zur Befreiung vom Ego.", type: "scale" },
        { id: 140, title: "Boden ablecken / Schuhsohlen säubern", desc: "Körperlicher Dienst auf allen Vieren ohne Wiederrede.", type: "scale" }
      ]
    },
    {
      id: 28,
      title: "Kapitel 28: Urolagnie, Wasserspiele & Natursekt",
      desc: "Die warme Intimität des Urins und das Loslassen aller Tabus.",
      items: [
        { id: 141, title: "Zusehen beim Urinieren im Badezimmer", desc: "Das Aufheben der Schamschwelle bei alltäglicher Erleichterung.", type: "scale" },
        { id: 142, title: "Urinieren über den Körper des Partners in der Dusche", desc: "Warmer Strahl auf Brust, Rücken oder Schenkel unter fließendem Wasser.", type: "scale" },
        { id: 143, title: "Urinieren in den Mund des Partners", desc: "Orale Aufnahme des frischen Urins als ultimative Hingabe.", type: "scale" },
        { id: 144, title: "Einnässen im Bett auf wasserdichter Unterlage", desc: "Hemmungsloses Loslassen der Blase in liegender Umarmung.", type: "scale" },
        { id: 145, title: "Tragen nasser Kleidung nach dem Einnässen", desc: "Verweilen in der warmen, abkühlenden Nässe als Disziplin.", type: "scale" }
      ]
    },
    {
      id: 29,
      title: "Kapitel 29: Feminisierung, Sissy & Gender-Bending",
      desc: "Das spielerische Auflösen klassischer Geschlechterrollen.",
      items: [
        { id: 146, title: "Tragen von Damenunterwäsche durch den Mann", desc: "Spitzenhöschen, Strapsgürtel oder Seidenstrümpfe unter Kleidung.", type: "scale" },
        { id: 147, title: "Schminken und Frisieren durch die Partnerin", desc: "Lippenstift, Mascara und Perücke als optische Verwandlung.", type: "scale" },
        { id: 148, title: "Verwendung weiblicher Kosenamen (Sissy / Zofe)", desc: "Anrede in der weiblichen Form während privater Momente.", type: "scale" },
        { id: 149, title: "High Heels tragen und Gehen üben", desc: "Erlernen des aufrechten Ganges auf Absätzen unter Aufsicht.", type: "scale" },
        { id: 150, title: "Bedienen der Partnerin im Dienstmädchen-Kleid", desc: "Häusliche Dienste verrichtet in eleganter Schürze.", type: "scale" }
      ]
    },

    {
      id: 30,
      title: "Kapitel 30: Voyeurismus, Cuckoldry & Dritte im Raum",
      desc: "Das Teilen der Lust, Zuschauen und der Nervenkitzel des Fremden.",
      items: [
        { id: 151, title: "Dem Partner beim Masturbieren zusehen", desc: "Ruhiges Beobachten der Selbstbefriedigung ohne Berührung.", type: "scale" },
        { id: 152, title: "Erotische Fotos / Videos für den Partner aufnehmen", desc: "Private Medien nur für die Augen des Gegenübers erstellen.", type: "scale" },
        { id: 153, title: "Sex vor geöffnetem Fenster / Halbdunkel", desc: "Die Möglichkeit, von Unbekannten erblickt zu werden.", type: "scale" },
        { id: 154, title: "Cuckoldry: Partner schläft mit Drittem während man zusieht", desc: "Zuschauen bei der Vereinigung des Partners mit einem Gast.", type: "scale" },
        { id: 155, title: "Hotwife / Freier Flirt der Partnerin vor den Augen des Mannes", desc: "Stolz und Erregung über das Begehrtwerden der Partnerin.", type: "scale" }
      ]
    },
    {
      id: 31,
      title: "Kapitel 31: Finanzieller Tribut & Findom",
      desc: "Materielle Hingabe, Taschengeld-Entzug und Schenken als Ergebenheit.",
      items: [
        { id: 156, title: "Überraschende Geschenke ohne jeden Anlass", desc: "Aufmerksamkeit bewiesen durch teure Aufmerksamkeiten.", type: "scale" },
        { id: 157, title: "Feste Tribut-Zahlungen auf ihr Konto", desc: "Regelmäßige Überweisungen als Zeichen privater Unterordnung.", type: "scale" },
        { id: 158, title: "Einkaufstour finanzieren, bei der sie bestimmt", desc: "Begleitung beim Shopping ohne Widerspruch beim Bezahlen.", type: "scale" },
        { id: 159, title: "Budget-Kontrolle durch den führenden Partner", desc: "Rechenschaft ablegen über Ausgaben und Alltagsbelege.", type: "scale" },
        { id: 160, title: "Geldstrafen für Regelverstöße im Alltag", desc: "Abzug von echtem Geld in eine gemeinsame Luxus-Urlaubskasse.", type: "scale" }
      ]
    },
    {
      id: 32,
      title: "Kapitel 32: Nadeln, Wachs & Somatische Grenzreize",
      desc: "Präzise Schmerzreize, Endorphinausschüttung und Gewebereizung.",
      items: [
        { id: 161, title: "Große Mengen heißes Wachs über den Körper", desc: "Wachsschichten auf empfindlichen Zonen erstarren lassen.", type: "scale" },
        { id: 162, title: "Medizinische Akupunktur-Nadeln in die Haut", desc: "Sterile Nadeln in Gesäß, Brustwarzen oder Schenkel.", type: "scale" },
        { id: 163, title: "Blutspiel / Sanfte Skalpell-Striche (Blood Play)", desc: "Sehr feine oberflächliche Ritzungen unter steriler Wundpflege.", type: "scale" },
        { id: 164, title: "Klammern-Ketten abreißen mit Ruck", desc: "Plötzlicher, scharfer Schmerzimpuls durch Entspannen der Klammern.", type: "scale" },
        { id: 165, title: "Brennende Reizöle / Tigerbalsam auf Schwellkörper", desc: "Intensives Hitze-Brennen auf Klitoris oder Penisschaft.", type: "scale" }
      ]
    },
    {
      id: 33,
      title: "Kapitel 33: Hypnose, Trance & Erotische Konditionierung",
      desc: "Das Fallenlassen des Geistes, Triggersignale und Gedankenkontrolle.",
      items: [
        { id: 166, title: "Geführte Entspannungstrance mit leiser Stimme", desc: "Schrittweises Herabzählen in tiefe Muskelentspannung.", type: "scale" },
        { id: 167, title: "Konditionierte Triggersignale (Fingerschnippen)", desc: "Automatische körperliche Reaktion auf vereinbarte Signale.", type: "scale" },
        { id: 168, title: "Orgasmus auf Befehl durch Codewort", desc: "Auslösen des Höhepunkts allein durch mentale Vorbereitung.", type: "scale" },
        { id: 169, title: "Gedankliche Amnesie / Abschalten aller Alltagssorgen", desc: "Vollständiges Ausblenden von Beruf und Pflichten im Spiel.", type: "scale" },
        { id: 170, title: "Wiederholtes Hören intimer Hypnose-Audios", desc: "Konditionierung durch maßgeschneiderte Sprachaufnahmen.", type: "scale" }
      ]
    },
    {
      id: 34,
      title: "Kapitel 34: Vagus-Atmung, Beruhigung & Somatische Erdung",
      desc: "Das regulierte Nervensystem, Atemführung und Auffangen nach Sessions.",
      items: [
        { id: 171, title: "Synchrone 4-7-8 Atemführung im Arm", desc: "Gemeinsames Atmen zur Aktivierung des Parasympathikus.", type: "scale" },
        { id: 172, title: "Feste Gewichtsdecke über dem erschöpften Körper", desc: "Tiefendruck-Stimulation zur Beruhigung von Kältezittern.", type: "scale" },
        { id: 173, title: "Warmes Fußbad nach Schlägen oder Fesselung", desc: "Ableitung der Restspannung über die warmen Fußreflexzonen.", type: "scale" },
        { id: 174, title: "Leises Singen oder Summen der führenden Person", desc: "Akustische Schwingung am Ohr des Partners zur Erdung.", type: "scale" },
        { id: 175, title: "Traubenzucker & warmer Tee direkt nach der Session", desc: "Schnelle Glukose-Versorgung gegen den Endorphin-Absturz.", type: "scale" }
      ]
    },
    {
      id: 35,
      title: "Kapitel 35: Nachsorge, Drop-Prävention & Tiefe Bindung",
      desc: "Der Schutz vor dem Subdrop / Topdrop in den ersten 48 Stunden.",
      items: [
        { id: 176, title: "24-Stunden Check-in nach intensiven Sessions", desc: "Nachfragen nach Befinden und Muskelkater am nächsten Tag.", type: "scale" },
        { id: 177, title: "Körperliche Inspektion verbliebener Hämatome", desc: "Liebevolles Eincremen von Rötungen mit Arnika oder Panthenol.", type: "scale" },
        { id: 178, title: "Reflexionsgespräch auf Augenhöhe ohne Hierarchie", desc: "Was war schön, was war zu viel, was lernen wir fürs nächste Mal?", type: "scale" },
        { id: 179, title: "Trösten bei weinenden Endorphin-Abstürzen", desc: "Bedingungsloses Halten ohne Vorwürfe oder Ratschläge.", type: "scale" },
        { id: 180, title: "Dankbarkeits-Bekenntnis für das geschenkte Vertrauen", desc: "Dem Partner danken, dass er seinen Körper anvertraut hat.", type: "scale" }
      ]
    }
  ];

  window.surveyChaptersPart2 = chaptersPart2;
  window.surveyChapters = (window.surveyChapters || []).concat(chaptersPart2);

})(window);
