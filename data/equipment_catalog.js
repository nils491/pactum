/**
 * data/equipment_catalog.js
 * TACTUS Hardware-Stammdatenkatalog, Kinetische DoF-Profile & RACK-Desinfektion (V3.0 Haute-Horlogerie)
 * Offizielle Web-Präsenz: tactus.digital
 * 
 * Standards & Garantien nach Master-Roadbook:
 * - 100 % UTF-8 Integrität: Echte deutsche Umlaute (ä, ö, ü, ß) im gesamten Modul
 * - Umfassende Stammdatenbank für alle in den 505 Fragen referenzierten Ausrüstungsgegenstände
 * - Kinetische DoF-Profile (dofImpact) auf 10 somatischen Achsen ([0.0, 1.0])
 * - Restraint-Layering (0: Reiz/Schlag, 1: Begrenzung/Lagefesselung, 2: Vollständige Starre/Arretierung)
 * - RACK-Allergie-Radar: Verlässliche Kennzeichnung von Naturkautschuk (isLatex: true)
 * - Materialscharfe Desinfektions- und Pflegeprotokolle für Phase 4 (Reverse Aftercare)
 * - Bereitstellung an window.EquipmentCatalog sowie CommonJS-Export
 */

(function(window) {
  'use strict';

  const EQUIPMENT_DATABASE = [
    // =========================================================================
    // 1. KATEGORIE: FESSELUNG & ARRETIERUNG (BONDAGE)
    // =========================================================================
    {
      id: 'rope_jute_6mm',
      name: 'Shibari-Juteseil (6mm geölt)',
      category: 'bondage',
      tags: ['rope', 'shibari'],
      somaticZone: 'full_body',
      restraintLayer: 1,
      materials: ['jute', 'mineral_oil', 'beeswax'],
      isLatex: false,
      somaticEffect: 'Griffiges Naturfaserseil mit Bienenwachsduft zur Erzeugung von Druckpunkten, Torsomustern und Trance.',
      dofImpact: {
        manual_manipulation: 0.2,
        locomotion_standing: 0.5
      },
      safetyProtocol: {
        inspectionCheck: 'Vor jeder Session auf Faserabrieb prüfen. Sicherheits-Cutter am Nachttisch bereitlegen.',
        disinfectionMethod: 'paraffin_oil_airing',
        aftercareInstruction: 'Naturseile trocken ausschlagen, gründlich lüften und bei Bedarf mit reinem Jojoba- oder Paraffinöl nachölen. Niemals nass waschen.'
      },
      preseededWisdom: {
        top: 'Ruhige, meditative Konzentration beim Binden; jeder Knoten zentriert die Gedanken und festigt die Führung.',
        sub: 'Das feste, warme Gewebe auf der Haut schaltet das Denkhirn ab. Das Gehaltensein schenkt erlösende Passivität.'
      }
    },
    {
      id: 'leather_cuffs_classic',
      name: 'Gepolsterte Lederfesseln (Hand & Fuß)',
      category: 'bondage',
      tags: ['cuffs'],
      somaticZone: 'limbs_hands_wrists',
      restraintLayer: 1,
      materials: ['leather', 'lambswool', 'steel'],
      isLatex: false,
      somaticEffect: 'Breite Rindsledermanschetten mit Lammfellpolsterung zur sicheren Arretierung der Hand- oder Fußgelenke.',
      dofImpact: {
        manual_manipulation: 0.05,
        locomotion_standing: 0.3
      },
      safetyProtocol: {
        inspectionCheck: 'Alle 10 Minuten Kapillar-Refill-Test an den Finger- oder Zehenkuppen (Farbe muss in 2s zurückkehren).',
        disinfectionMethod: 'antiseptic_leather_spray',
        aftercareInstruction: 'Mit einem nebelfeuchten Tuch Schweiß abnehmen, danach mit antiseptischem Lederpflegespray und Bienenwachs einreiben. Keinen Alkohol verwenden.'
      },
      preseededWisdom: {
        top: 'Das metallische Einrasten der Schnallen setzt eine klare Grenze im Raum. Zuverlässige Kontrolle ohne Verletzungsgefahr.',
        sub: 'Sobald das Leder festsitzt, gibt es kein Wegziehen der Hände mehr. Man darf sich ganz dem Reiz überlassen.'
      }
    },
    {
      id: 'leather_monoglove',
      name: 'Leder-Monohandschuh (Rückenschnürung)',
      category: 'bondage',
      tags: ['cuffs', 'monoglove'],
      somaticZone: 'limbs_hands_wrists',
      restraintLayer: 2,
      materials: ['leather', 'steel'],
      isLatex: false,
      somaticEffect: 'Feste Schnürhülle aus Rindsleder, die beide Arme unbeweglich eng am Rücken arretiert.',
      dofImpact: {
        manual_manipulation: 0.0,
        pelvic_thrust_active: 0.4
      },
      safetyProtocol: {
        inspectionCheck: 'Auf Schulterüberdehnung achten. Ein weiches Kissen unter die Brust legen zur Entlastung der Schultergelenke.',
        disinfectionMethod: 'antiseptic_leather_spray',
        aftercareInstruction: 'Schnürung öffnen, Arme behutsam lockern und Schultern kreisend ausmassieren. Lederhülle trocken auswischen und auslüften.'
      },
      preseededWisdom: {
        top: 'Vollkommene Macht über die Handlungsfähigkeit des Partners. Exponiert Brustkorb und Schultern zur andächtigen Führung.',
        sub: 'Beide Arme eng am Rücken fixiert – keine Abstützung, keine Gegenwehr. Der Kopf schaltet ab, weil der Körper ohnehin nichts tun kann.'
      }
    },
    {
      id: 'leather_collar_padded',
      name: 'Rindsleder-Halsband mit D-Ring',
      category: 'bondage',
      tags: ['collar'],
      somaticZone: 'head_neck',
      restraintLayer: 1,
      materials: ['leather', 'lambswool', 'brass'],
      isLatex: false,
      somaticEffect: 'Gepolstertes Halsband als sichtbares Symbol der Zugehörigkeit und Ankerpunkt für die Führungsleine.',
      dofImpact: {
        speech_articulation: 1.0
      },
      safetyProtocol: {
        inspectionCheck: 'Zwei-Finger-Regel: Zwischen Hals und Leder müssen bequem zwei Fingerbreiten Spielraum verbleiben.',
        disinfectionMethod: 'antiseptic_leather_spray',
        aftercareInstruction: 'Innenseite von Hautfett reinigen, mit Pflegebalsam versiegeln. Den Nacken des Partners sanft streicheln.'
      },
      preseededWisdom: {
        top: 'Das stumme Bekenntnis am Hals des Partners. Symbolisiert Schutzbereitschaft und unverrückbare Verantwortung.',
        sub: 'Das feste, kühle Leder an der Kehle erdet bei jedem Atemzug. Eine ständige Erinnerung daran, wem man gehört.'
      }
    },
    {
      id: 'leather_leash_braided',
      name: 'Geflochtene Lederleine (120cm)',
      category: 'bondage',
      tags: ['leash'],
      somaticZone: 'head_neck',
      restraintLayer: 0,
      materials: ['leather', 'steel'],
      isLatex: false,
      somaticEffect: 'Schwere Lederleine mit Bolzenkarabiner zur physischen und rituellen Führung im Raum.',
      dofImpact: {
        locomotion_standing: 0.6
      },
      safetyProtocol: {
        inspectionCheck: 'Niemals ruckartig reißen. Die Leine dient der Richtungsweisung, nicht dem Würgen.',
        disinfectionMethod: 'antiseptic_leather_spray',
        aftercareInstruction: 'Karabiner auf Leichtgängigkeit prüfen, Leder trocken abwischen und geordnet aufhängen.'
      },
      preseededWisdom: {
        top: 'Feinstoffliche Verbindung: Kleinste Fingerbewegungen am Lederriemen übertragen sich unmittelbar auf die Körperhaltung des Partners.',
        sub: 'An der Leine geführt werden nimmt das Nachdenken über Wege und Richtungen ab. Man folgt vertrauensvoll.'
      }
    },
    {
      id: 'spreader_bar_steel',
      name: 'Edelstahl-Spreizstange (60cm verstellbar)',
      category: 'bondage',
      tags: ['spreader_bar'],
      somaticZone: 'limbs_legs',
      restraintLayer: 2,
      materials: ['steel', 'leather'],
      isLatex: false,
      somaticEffect: 'Starre Metallstange mit Lederfesseln an den Enden; verhindert das Schließen der Beine und erzwingt Offenheit.',
      dofImpact: {
        locomotion_standing: 0.05,
        pelvic_thrust_active: 0.2
      },
      safetyProtocol: {
        inspectionCheck: 'Knie- und Hüftgelenke vorab auf Dehnfähigkeit prüfen. Kissen unter die Kniekehlen legen.',
        disinfectionMethod: 'isopropanol_wipe',
        aftercareInstruction: 'Metallstange mit 70% Isopropanol desinfizieren. Beine des Partners nach dem Lösen behutsam zusammenführen und massieren.'
      },
      preseededWisdom: {
        top: 'Das Becken des Partners liegt dauerhaft geöffnet und ungeschützt dar. Uneingeschränkter Zugang für Zucht und Liebkosung.',
        sub: 'Keine Fluchtmöglichkeit für die Schenkel. Das erzwungene Geöffnetbleiben bricht die letzte innere Anspannung.'
      }
    },
    {
      id: 'steel_chains_padlocks',
      name: 'Massive Stahlketten mit Vorhängeschlössern',
      category: 'bondage',
      tags: ['chain'],
      somaticZone: 'full_body',
      restraintLayer: 2,
      materials: ['steel', 'brass'],
      isLatex: false,
      somaticEffect: 'Schwere Kettenglieder mit messingfarbenen Schlössern; metallisches Rasseln und spürbares Kältegewicht.',
      dofImpact: {
        manual_manipulation: 0.1,
        locomotion_standing: 0.2
      },
      safetyProtocol: {
        inspectionCheck: 'Schlüssel vor dem Verriegeln stets griffbereit bereitlegen. Niemals ohne Unterlegpolster auf nackter Haut belasten.',
        disinfectionMethod: 'isopropanol_wipe',
        aftercareInstruction: 'Kettenglieder trocken abwischen, Schlösser gelegentlich mit Feinmechaniköl schmieren.'
      },
      preseededWisdom: {
        top: 'Archaisches, unnachgiebiges Material. Das Klirren der Glieder im Raum verleiht der Führung monumentale Schwere.',
        sub: 'Das kalte, schwere Eisen zieht an den Gliedmaßen. Man spürt physisch, wie unentrinnbar die Gefangenschaft ist.'
      }
    },
    {
      id: 'bed_straps_under_mattress',
      name: 'Untermatratzen-Gurtungssystem (4 Punkte)',
      category: 'bondage',
      tags: ['bed_straps'],
      somaticZone: 'full_body',
      restraintLayer: 2,
      materials: ['nylon', 'steel'],
      isLatex: false,
      somaticEffect: 'Kreuzförmige Nylongurte unter der Matratze mit Schnellverschluss-Ösen an allen vier Bettecken.',
      dofImpact: {
        manual_manipulation: 0.05,
        locomotion_standing: 0.0
      },
      safetyProtocol: {
        inspectionCheck: 'Gurtspannung so einstellen, dass die Matratzenkante nicht in Hand- oder Fußgelenke schneidet.',
        disinfectionMethod: 'soap_and_water',
        aftercareInstruction: 'Gurtbänder mit milder Seifenlauge abwischen und vollständig an der Luft trocknen lassen.'
      },
      preseededWisdom: {
        top: 'Verwandelt das normale Bett im Handumdrehen in eine vollwertige, sichere Arretierungsbühne ohne Wandbohrungen.',
        sub: 'Weit ausgebreitet auf dem Rücken oder Bauch liegen. Jeder Zug an den Gurten erinnert an das eigene Stillhalte-Gebot.'
      }
    },

    // =========================================================================
    // 2. KATEGORIE: ZUCHT & SCHLAGWERKZEUGE (IMPACT)
    // =========================================================================
    {
      id: 'paddle_saddle_leather',
      name: 'Breites Sattelleder-Paddle',
      category: 'impact',
      tags: ['paddle'],
      somaticZone: 'gluteal_pelvis',
      restraintLayer: 0,
      materials: ['leather', 'steel'],
      isLatex: false,
      somaticEffect: 'Schweres, mehrlagiges Glattleder-Paddle für dumpfe, großflächige Schläge ohne spitze Schmerzspitzen.',
      dofImpact: {},
      safetyProtocol: {
        inspectionCheck: 'Ausschließlich auf die fleischigen Gesäßmuskeln zielen. Wirbelsäule, Steißbein und Nieren strikt aussparen.',
        disinfectionMethod: 'antiseptic_leather_spray',
        aftercareInstruction: 'Leder mit Pflegespray desinfizieren. Den geröteten Po des Partners kühlen und mit Arnika-Balsam einreiben.'
      },
      preseededWisdom: {
        top: 'Satter, tiefer Klang und unaufgeregte Wucht. Erzeugt verlässliche Rötung und Demut ohne unkontrollierte Schnitte.',
        sub: 'Flächige Hitzewellen rollen durch das Becken. Nach den ersten Treffern schüttet der Körper Endorphine aus und entspannt tief.'
      }
    },
    {
      id: 'flogger_suede_heavy',
      name: 'Wildleder-Flogger (45 Fransen)',
      category: 'impact',
      tags: ['flogger'],
      somaticZone: 'gluteal_pelvis',
      restraintLayer: 0,
      materials: ['suede', 'leather'],
      isLatex: false,
      somaticEffect: 'Gewichtiger Flogger aus weichem Spaltleder; prasselt wie ein warmer, dichter Schauer auf Gesäß und Oberschenkel.',
      dofImpact: {},
      safetyProtocol: {
        inspectionCheck: 'Vor Gebrauch ausschlagen, damit sich keine Fransen verknoten. Rhythmische Atempausen einlegen.',
        disinfectionMethod: 'dry_brushing',
        aftercareInstruction: 'Fransen mit einer weichen Naturbürste ausbürsten, lüften lassen. Nicht feucht reinigen.'
      },
      preseededWisdom: {
        top: 'Gleichmäßiges, rhythmisches Schwingen aus dem Handgelenk. Baut die Temperatur des Partners kontinuierlich auf.',
        sub: 'Das schwere Rauschen und Auftreffen vieler weicher Lederstreifen verteilt den Reiz gleichmäßig über die gesamte Haut.'
      }
    },
    {
      id: 'leather_belt_heavy',
      name: 'Schwerer Rindledergürtel (doppelt gelegt)',
      category: 'impact',
      tags: ['leather_belt'],
      somaticZone: 'gluteal_pelvis',
      restraintLayer: 0,
      materials: ['leather', 'brass'],
      isLatex: false,
      somaticEffect: 'Klassischer Hosenriemen aus 4mm Sattelleder; schnalzt mit autoritärer Schärfe auf das Gesäß.',
      dofImpact: {},
      safetyProtocol: {
        inspectionCheck: 'Gürtelschnalle fest in der Hand halten – niemals mit der Schnalle treffen! Nur den weichen Lederriemen aufsetzen.',
        disinfectionMethod: 'antiseptic_leather_spray',
        aftercareInstruction: 'Leder trocken abwischen. Den Partner nach der Zucht fest in den Arm nehmen (Versöhnungssiegel).'
      },
      preseededWisdom: {
        top: 'Das urtypische Instrument häuslicher Zucht. Das trockene Knallen im Raum verschafft augenblicklich Gehör und Respekt.',
        sub: 'Der Riemen verzeiht keine Frechheiten. Die Schläge brennen spürbar nach und reinigen das Gewissen von Schuld.'
      }
    },
    {
      id: 'crop_leather_slapper',
      name: 'Leder-Reitgerte mit breiter Klatsche (65cm)',
      category: 'impact',
      tags: ['crop'],
      somaticZone: 'thighs_inner',
      restraintLayer: 0,
      materials: ['fiberglass', 'leather'],
      isLatex: false,
      somaticEffect: 'Schlanke Gerte mit geflochtenem Schaft und Lederklatsche für punktgenaue, scharfe Hautreize.',
      dofImpact: {},
      safetyProtocol: {
        inspectionCheck: 'Punktgenau zielen. Gelenke, Knie und Knöchelknochen unbedingt meiden.',
        disinfectionMethod: 'antiseptic_leather_spray',
        aftercareInstruction: 'Klatsche desinfizieren. Feine Rötungen an den Schenkeln mit beruhigender Lotion versorgen.'
      },
      preseededWisdom: {
        top: 'Präzisionswerkzeug: Erlaubt feine Haltungskorrekturen an Waden oder Schenkeln ohne Kraftaufwand.',
        sub: 'Ein spitzer, brennender Reiz, der die Aufmerksamkeit blitzscharf bündelt. Jeder Treffer verlangt Stillhalten.'
      }
    },
    {
      id: 'cane_rattan_polished',
      name: 'Rattan-Rohrstock (80cm poliert)',
      category: 'impact',
      tags: ['cane'],
      somaticZone: 'gluteal_pelvis',
      restraintLayer: 0,
      materials: ['rattan'],
      isLatex: false,
      somaticEffect: 'Klassischer elastischer Rattanstock für scharfe, tiefe Zuchtreize im formalen Disziplinarrahmen.',
      dofImpact: {},
      safetyProtocol: {
        inspectionCheck: 'Ausschließlich im Fortgeschrittenen-Rahmen. Rötungs- und Striemen-Grenzen vorab strikt absprechen.',
        disinfectionMethod: 'isopropanol_wipe',
        aftercareInstruction: 'Rohrstange trocken abwischen. Den Gesäßbereich nach der Session intensiv kühlen und ruhen lassen.'
      },
      preseededWisdom: {
        top: 'Höchste Disziplinierungskraft. Verlangt vollkommene innere Ruhe des Tops – niemals aus Zorn anwenden!',
        sub: 'Ein schneidender Schmerz, der die Luft anhält. Verlangt äußerste Standhaftigkeit und Hingabe an die Zucht.'
      }
    },

    // =========================================================================
    // 3. KATEGORIE: KEUSCHHEIT & GENITALDISZIPLIN (CHASTITY)
    // =========================================================================
    {
      id: 'chastity_cage_cobra',
      name: 'Kink3D Cobra (SLS-Nylon Peniskäfig)',
      category: 'chastity',
      tags: ['chastity_cage'],
      somaticZone: 'genital_penile',
      restraintLayer: 1,
      materials: ['nylon_sls', 'brass'],
      isLatex: false,
      somaticEffect: 'Ergonomischer, atmungsaktiver 3D-Druck-Käfig; sperrt Schwellkörperkontakt und Erektion vollkommen ab.',
      dofImpact: {
        penile_shaft_access: 0.0
      },
      safetyProtocol: {
        inspectionCheck: 'Tägliche urologische 50ml-Kochsalzspülung durch die Öffnungen zur Balanitis-Prävention einhalten.',
        disinfectionMethod: 'isopropanol_wipe',
        aftercareInstruction: 'Mit warmem Wasser und antibakterieller Seife reinigen, mit 70% Isopropanol desinfizieren und trocknen.'
      },
      preseededWisdom: {
        top: 'Die absolute Schlüsselgewalt über seine Lust. Seine Gedanken und sein Gehorsam richten sich ununterbrochen auf dich.',
        sub: 'Befreiung von der ständigen Jagd nach dem Orgasmus. Die sexuelle Energie kanalisiert sich in andächtigen Dienst.'
      }
    },
    {
      id: 'ball_stretcher_steel',
      name: 'Schwerer Edelstahl-Hodenring (35mm / 300g)',
      category: 'chastity',
      tags: ['ball_stretcher'],
      somaticZone: 'genital_testicles',
      restraintLayer: 1,
      materials: ['steel'],
      isLatex: false,
      somaticEffect: 'Kühler, massiver Edelstahlring; zieht die Hoden kontinuierlich nach unten und betont das Gemächt.',
      dofImpact: {},
      safetyProtocol: {
        inspectionCheck: 'Haut regelmäßig auf Klemmstellen kontrollieren. Nicht länger als 3–4 Stunden am Stück tragen.',
        disinfectionMethod: 'isopropanol_wipe',
        aftercareInstruction: 'Metallring mit Isopropanol abwischen. Den Hodensack nach dem Abnehmen mit warmem Öl wärmen und lockern.'
      },
      preseededWisdom: {
        top: 'Das schwere Gewicht zieht seine Männlichkeit prall nach unten. Ein sichtbares Zeichen seiner Unterwerfung.',
        sub: 'Jeder Schritt erinnert durch das kühle Ziehen im Unterleib an den Halt. Ein erregendes Schweregefühl.'
      }
    },
    {
      id: 'nipple_clamps_clover',
      name: 'Kleeblattklemmen mit Verbindungskette',
      category: 'chastity',
      tags: ['clamps'],
      somaticZone: 'chest_nipples',
      restraintLayer: 1,
      materials: ['steel', 'silicone'],
      isLatex: false,
      somaticEffect: 'Verstellbare Druckklemmen mit Gummipuffern; die Kette spannt sich bei jeder kleinsten Bewegung.',
      dofImpact: {},
      safetyProtocol: {
        inspectionCheck: 'Maximale Tragedauer 20 Minuten zur Vermeidung von Gewebeunterkühlung oder Ischämie.',
        disinfectionMethod: 'isopropanol_wipe',
        aftercareInstruction: 'Klemmen abnehmen, Brustwarzen sofort kräftig zwischen den Fingern ausmassieren, um Durchblutung wiederherzustellen.'
      },
      preseededWisdom: {
        top: 'Erzwingt vollkommene Reglosigkeit: Wenn er zuckt, zieht die Kette sofort an beiden empfindlichen Punkten.',
        sub: 'Ein beißender Dauerdruck, der in wohlige Hitze umschlägt. Beim Abnehmen durchströmt das Blut die Nervenenden.'
      }
    },
    {
      id: 'cock_ring_leather',
      name: 'Leder-Cockring mit Druckknöpfen',
      category: 'chastity',
      tags: ['cock_ring'],
      somaticZone: 'genital_penile',
      restraintLayer: 1,
      materials: ['leather', 'steel'],
      isLatex: false,
      somaticEffect: 'Elastischer Lederbund an der Peniswurzel; staut den Rückfluss für maximale Härte und Ausdauer.',
      dofImpact: {},
      safetyProtocol: {
        inspectionCheck: 'Nicht länger als 30 Minuten tragen. Bei Blaufärbung oder Taubheit sofort lösen.',
        disinfectionMethod: 'antiseptic_leather_spray',
        aftercareInstruction: 'Leder trocken abtupfen und mit Pflegespray behandeln.'
      },
      preseededWisdom: {
        top: 'Macht sein Glied prall und unnachgiebig hart für den langen, ausdauernden Dienst.',
        sub: 'Ein strammes Engegefühl an der Wurzel, das jede Berührung doppelt so intensiv spüren lässt.'
      }
    },

    // =========================================================================
    // 4. KATEGORIE: MASKEN & SINNESENTZUG (SENSORY)
    // =========================================================================
    {
      id: 'blindfold_leather_molded',
      name: 'Konturierte Leder-Augenbinde',
      category: 'sensory',
      tags: ['blindfold'],
      somaticZone: 'head_eyes',
      restraintLayer: 1,
      materials: ['leather', 'velvet'],
      isLatex: false,
      somaticEffect: 'Lichtdichte Schlafmaske aus weichem Leder mit Samtfütterung; schaltet den Sehsinn vollständig aus.',
      dofImpact: {
        visual_perception: 0.0
      },
      safetyProtocol: {
        inspectionCheck: 'Keinen Druck auf die Augäpfel ausüben. Die Wimpern müssen sich im Inneren frei bewegen können.',
        disinfectionMethod: 'antiseptic_leather_spray',
        aftercareInstruction: 'Innenseite vorsichtig auswischen, lüften lassen. Augen des Partners langsam an Licht gewöhnen.'
      },
      preseededWisdom: {
        top: 'Der Partner sieht keinen deiner Schritte kommen. Jede Berührung und jedes Flüstern trifft ihn unvorbereitet.',
        sub: 'Vollkommene Dunkelheit. Die Haut wird zum einzigen Sinnesorgan; Gehör und Tastsinn explodieren vor Schärfe.'
      }
    },
    {
      id: 'gag_silicone_ball_45mm',
      name: 'Silikon-Ballknebel (45mm mit Atemlöchern)',
      category: 'sensory',
      tags: ['gag'],
      somaticZone: 'head_mouth',
      restraintLayer: 1,
      materials: ['silicone', 'leather', 'steel'],
      isLatex: false,
      somaticEffect: 'Weicher Silikonball zwischen den Zähnen; dämpft Sprache und verhindert verbale Gegenwehr.',
      dofImpact: {
        speech_articulation: 0.0,
        tongue_mobility_external: 0.0
      },
      safetyProtocol: {
        inspectionCheck: 'Nasenatmung muss zu 100% frei sein! Bei Schnupfen oder Asthma strikt verboten. Handdrück-Code vereinbaren.',
        disinfectionMethod: 'isopropanol_wipe',
        aftercareInstruction: 'Silikonball mit heißem Wasser und Seife waschen, mit Isopropanol desinfizieren. Mund des Partners mit Wasser spülen.'
      },
      preseededWisdom: {
        top: 'Nimmt dem Partner die Worte. Stöhnen und Flehen verwandeln sich in dumpfe, hilflose Laute.',
        sub: 'Verstummen müssen. Kein Protestieren, kein Rechtfertigen mehr möglich – reines körperliches Dasein.'
      }
    },
    {
      id: 'headphones_noise_cancelling',
      name: 'Over-Ear Noise-Cancelling Kopfhörer',
      category: 'sensory',
      tags: ['headphones'],
      somaticZone: 'head_ears',
      restraintLayer: 1,
      materials: ['plastic', 'leatherette'],
      isLatex: false,
      somaticEffect: 'Aktive Schallisolierung; blendet Raumgeräusche aus für Tranceklänge, binaurale Beats oder totale Stille.',
      dofImpact: {},
      safetyProtocol: {
        inspectionCheck: 'Lautstärke auf gehörschonendem Niveau arretieren. Handdrück-Signal für Notfälle nutzen.',
        disinfectionMethod: 'isopropanol_wipe',
        aftercareInstruction: 'Ohrpolster mit Desinfektionstuch abwischen.'
      },
      preseededWisdom: {
        top: 'Kapselt den Partner hermetisch von der Umgebung ab. Du kontrollierst exakt, welche Frequenzen seinen Geist erreichen.',
        sub: 'Absolute innere Einkehr. Das eigene Herzklopfen wird laut, während die Welt draußen vollkommen verstummt.'
      }
    },
    {
      id: 'wax_candle_low_temp',
      name: 'Niedrigtemperatur-Sojawachskerze (~48°C)',
      category: 'sensory',
      tags: ['wax_candle'],
      somaticZone: 'torso_skin',
      restraintLayer: 0,
      materials: ['soy_wax'],
      isLatex: false,
      somaticEffect: 'Spezialwachs mit niedrigem Schmelzpunkt; heißer Hitzeschock beim Auftreffen, der rasch in wohlige Wärme erstarrt.',
      dofImpact: {},
      safetyProtocol: {
        inspectionCheck: 'Vorab Tropf-Test am eigenen Handgelenk durchführen. Niemals gewöhnliche Haushaltskerzen (Stearin/Paraffin) verwenden!',
        disinfectionMethod: 'soap_and_water',
        aftercareInstruction: 'Erkaltetes Wachs sanft mit einer abgerundeten Plastikkarte von der Haut schaben. Haut mit Feuchtigkeitslotion pflegen.'
      },
      preseededWisdom: {
        top: 'Gezielte Feuer-Tropfen aus der Höhe fallen lassen. Das Zucken des Partners bei jedem Tropfen sehen.',
        sub: 'Ein kurzer, brennender Hitzestich, der sofort in eine schützende, feste Schale erstarrt. Prickelnde Wärme.'
      }
    },
    {
      id: 'ice_cubes_thermal',
      name: 'Eiswürfel & Kältebalsam (Fire & Ice)',
      category: 'sensory',
      tags: ['ice'],
      somaticZone: 'torso_skin',
      restraintLayer: 0,
      materials: ['water', 'menthol'],
      isLatex: false,
      somaticEffect: 'Schmelzendes Eis über durchbluteter oder geschlagener Haut; elektrisierender Kälteschock zur Sinnesschärfung.',
      dofImpact: {},
      safetyProtocol: {
        inspectionCheck: 'Eis nicht starr auf einer Stelle festfrieren lassen (Gefahr lokaler Erfrierungen). Stets in Bewegung halten.',
        disinfectionMethod: 'soap_and_water',
        aftercareInstruction: 'Schmelzwasser mit weichem Frotteetuch abtupfen, den Partner in die warme Gewichtsdecke hüllen.'
      },
      preseededWisdom: {
        top: 'Verwirrt die Thermorezeptoren des Partners vollkommen. Schafft maximale Kontraste zu warmen Lippen und Schlägen.',
        sub: 'Eisige Kälte auf glühender Haut jagt Schauder über den gesamten Rücken. Das Nervensystem wird hellwach.'
      }
    },
    {
      id: 'silk_scarf_black',
      name: 'Feines Seidentuch (Maulbeerseide)',
      category: 'sensory',
      tags: ['silk'],
      somaticZone: 'torso_skin',
      restraintLayer: 0,
      materials: ['silk'],
      isLatex: false,
      somaticEffect: 'Schwereloser Naturseidenstoff zum federleichten Streichen über empfindliche Hautzonen und Schwellkörper.',
      dofImpact: {},
      safetyProtocol: {
        inspectionCheck: 'Achten auf sauberen, weichen Stoff ohne harte Nähte.',
        disinfectionMethod: 'hand_wash_silk',
        aftercareInstruction: 'Schonende Handwäsche mit Seidenwaschmittel.'
      },
      preseededWisdom: {
        top: 'Zarte Berührungskunst: Die Seide schwebt wie ein Hauch über den Körper und weckt gierige Sehnsucht nach festem Griff.',
        sub: 'Kaum spürbar und doch elektrisierend. Ein Kitzeln, das jede Pore aufstellen lässt.'
      }
    },

    // =========================================================================
    // 5. KATEGORIE: BDSM-MÖBEL & SPEZIALVORRICHTUNGEN (FURNITURE)
    // =========================================================================
    {
      id: 'pillory_hardwood_classic',
      name: 'Hartholz-Hand-Hals-Pranger (Pillory)',
      category: 'furniture',
      tags: ['pillory'],
      somaticZone: 'head_neck',
      restraintLayer: 2,
      materials: ['hardwood', 'brass'],
      isLatex: false,
      somaticEffect: 'Massive Holzklappe mit Scharnier für Hals und Handgelenke; erzwingt aufrechte, gebeugte Präsentationshaltung.',
      dofImpact: {
        manual_manipulation: 0.0,
        locomotion_standing: 0.1
      },
      safetyProtocol: {
        inspectionCheck: 'Holzkanten mit Moosgummi oder Leder polstern, um Druckstellen an Schlüsselbeinen auszuschließen.',
        disinfectionMethod: 'soap_and_water',
        aftercareInstruction: 'Holz trocken abwischen, Beschläge prüfen. Nacken des Partners nach dem Entlassen wärmen.'
      },
      preseededWisdom: {
        top: 'Kopf und Hände in deiner Hand. Der Körper steht wehrlos und exponiert im Raum, bereit für deine Anweisungen.',
        sub: 'Im Holz gefangen stehen. Man kann den Blick nicht abwenden und muss die eigene Unterordnung körperlich tragen.'
      }
    },
    {
      id: 'kneeling_bench_padded',
      name: 'Ergonomische Kniebank (Nadu-Haltung)',
      category: 'furniture',
      tags: ['kneeling_bench'],
      somaticZone: 'limbs_knees',
      restraintLayer: 0,
      materials: ['wood', 'foam', 'leather'],
      isLatex: false,
      somaticEffect: 'Gepolsterte Bank mit 15°-Neigung; entlastet die Kniescheiben und ermöglicht schmerzfreies, langes Knien vor dem Top.',
      dofImpact: {
        locomotion_standing: 0.2
      },
      safetyProtocol: {
        inspectionCheck: 'Polsterung prüfen. Füße gelegentlich lockern lassen zur Vorbeugung von Taubheitsgefühlen in den Zehen.',
        disinfectionMethod: 'antiseptic_leather_spray',
        aftercareInstruction: 'Lederpolster abwischen. Beine des Partners vor dem Aufstehen sanft ausschütteln.'
      },
      preseededWisdom: {
        top: 'Der Partner kniet andächtig zu deinen Füßen – nicht aus Schmerz, sondern aus aufrichtiger, würdevoller Hingabe.',
        sub: 'Stundenlanges Dienen auf den Knien ohne Gelenkschmerz. Die Haltung zentriert den Geist in vollkommener Ruhe.'
      }
    },
    {
      id: 'spanking_bench_wedge',
      name: 'Spanking-Bank mit Beckenkeil',
      category: 'furniture',
      tags: ['spanking_bench'],
      somaticZone: 'gluteal_pelvis',
      restraintLayer: 0,
      materials: ['steel', 'foam', 'leather'],
      isLatex: false,
      somaticEffect: 'Ergonomisch geneigte Liegebank; hebt das Becken um 30 Grad an und fixiert die Beine in idealer Schlaghöhe.',
      dofImpact: {
        locomotion_standing: 0.1,
        pelvic_thrust_active: 0.3
      },
      safetyProtocol: {
        inspectionCheck: 'Geprüfte Standfestigkeit. Riemen an den Oberschenkeln so schließen, dass die Blutzirkulation frei bleibt.',
        disinfectionMethod: 'antiseptic_leather_spray',
        aftercareInstruction: 'Liegefläche mit Desinfektionsbalsam abwischen.'
      },
      preseededWisdom: {
        top: 'Bequeme Arbeitshöhe für den Top: Schont deinen Rücken und erlaubt absolut präzise, saubere Trefferwinkel.',
        sub: 'Das Gesäß liegt erhöht und unbeweglich da. Das Becken kann den Schlägen nicht ausweichen.'
      }
    },
    {
      id: 'st_andrews_cross_wall',
      name: 'Massives Wand-Andreaskreuz (X-Arretierung)',
      category: 'furniture',
      tags: ['st_andrews_cross'],
      somaticZone: 'full_body',
      restraintLayer: 2,
      materials: ['hardwood', 'steel', 'leather'],
      isLatex: false,
      somaticEffect: 'Wandmontiertes Kreuz aus Eichenbalken; fixiert Arme und Beine weit gespreizt für monumentale Auslieferung.',
      dofImpact: {
        manual_manipulation: 0.0,
        locomotion_standing: 0.05,
        pelvic_thrust_active: 0.1
      },
      safetyProtocol: {
        inspectionCheck: 'Wandanker vor jeder Session auf festen Sitz prüfen. Fesseln mit Schnellabwurf-Karabinern sichern.',
        disinfectionMethod: 'isopropanol_wipe',
        aftercareInstruction: 'Manschetten desinfizieren, Holzbalken trocken pflegen. Gelenke nach dem Lösen behutsam lockern.'
      },
      preseededWisdom: {
        top: 'Der Partner steht wie eine lebendige Skulptur vor dir. Jeder Zentimeter seines Körpers liegt in deinem Blickfeld.',
        sub: 'Weit aufgespannt am Kreuz. Kein Verstecken, kein Wegdrehen – man ist der Führung des Tops rückhaltlos ausgeliefert.'
      }
    },
    {
      id: 'sling_leather_heavy',
      name: 'Deckenmontierte Leder-Liebesschaukel (Sling)',
      category: 'furniture',
      tags: ['sling'],
      somaticZone: 'pelvis_core',
      restraintLayer: 1,
      materials: ['leather', 'steel', 'chains'],
      isLatex: false,
      somaticEffect: 'Breite Sattellederschaukel mit Beinschlaufen; trägt das gesamte Körpergewicht schwerelos im Raum.',
      dofImpact: {
        locomotion_standing: 0.0,
        pelvic_thrust_active: 0.5
      },
      safetyProtocol: {
        inspectionCheck: 'Deckenhaken und Ketten regelmäßig auf Traglast (min. 250 kg) prüfen. Drehgelenk fetten.',
        disinfectionMethod: 'antiseptic_leather_spray',
        aftercareInstruction: 'Lederinnenflächen nach Gebrauch gründlich mit Desinfektionsspray reinigen und trocknen lassen.'
      },
      preseededWisdom: {
        top: 'Schwerelose Leichtigkeit beim Lieben: Du kannst das Becken des Partners ohne Kraftaufwand in jeden Winkel führen.',
        sub: 'Schwebend im Raum liegen. Alle Gelenke sind entlastet, der Körper öffnet sich mühelos für tiefste Berührung.'
      }
    },

    // =========================================================================
    // 6. KATEGORIE: NACHSORGE, VAGUS & INTIMHYGIENE (CARE)
    // =========================================================================
    {
      id: 'gravity_blanket_7kg',
      name: 'Schwere Therapie-Gewichtsdecke (7kg)',
      category: 'care',
      tags: ['blanket'],
      somaticZone: 'full_body',
      restraintLayer: 0,
      materials: ['cotton', 'glass_beads'],
      isLatex: false,
      somaticEffect: 'Tiefendruck-Therapiedecke; aktiviert den Parasympathikus, stoppt Kältezittern und beugt dem Subdrop vor.',
      dofImpact: {
        locomotion_standing: 0.4
      },
      safetyProtocol: {
        inspectionCheck: 'Bei Atemnot Decke auf halbe Körperhöhe zurückschlagen.',
        disinfectionMethod: 'machine_wash_cover',
        aftercareInstruction: 'Bezug regelmäßig bei 40°C waschen. Decke nach der Session lüften.'
      },
      preseededWisdom: {
        top: 'Die liebevolle Umarmung nach der Härte. Du packst den Partner fest ein und schenkst ihm sichere Landung.',
        sub: 'Das schwere, wohlige Gewicht auf der Brust stoppt jedes Zittern. Der Körper sinkt in tiefen, traumlosen Schlaf.'
      }
    },
    {
      id: 'massage_oil_lavender',
      name: 'Kaltgepresstes Mandelöl mit Lavendel & Zeder',
      category: 'care',
      tags: ['oil'],
      somaticZone: 'full_body',
      restraintLayer: 0,
      materials: ['almond_oil', 'jojoba_oil', 'essential_oils'],
      isLatex: false,
      somaticEffect: 'Reines pflanzliches Körperöl zur Entspannung von Muskeltonus und Beruhigung gereizter Hautstellen.',
      dofImpact: {},
      safetyProtocol: {
        inspectionCheck: 'Nuss-Allergien des Partners vorab ausschließen.',
        disinfectionMethod: 'wipe_bottle',
        aftercareInstruction: 'Flasche nach Entnahme sauber wischen und lichtgeschützt lagern.'
      },
      preseededWisdom: {
        top: 'Das absichtslose Pflegen und Salben des Partners nach der Session. Ein reiner Dienst der Verbundenheit.',
        sub: 'Seidige Wärme auf der beanspruchten Haut. Der Duft von Lavendel signalisiert dem Nervensystem: Du bist sicher.'
      }
    },
    {
      id: 'urological_syringe_50ml',
      name: 'Urologische 50ml-Blasenspritze (Katheterspitze)',
      category: 'care',
      tags: ['syringe'],
      somaticZone: 'genital_penile',
      restraintLayer: 0,
      materials: ['polypropylene'],
      isLatex: false,
      somaticEffect: 'Graduierte Kunststoffspritze ohne Nadel zur täglichen Kochsalz-Spülung des Keuschheitskäfigs.',
      dofImpact: {},
      safetyProtocol: {
        inspectionCheck: 'Ausschließlich sterile 0,9% Kochsalzlösung oder lauwarmes Wasser verwenden. Keine alkoholischen Zusätze!',
        disinfectionMethod: 'boiling_water_or_isopropanol',
        aftercareInstruction: 'Kolben herausziehen, mit heißem Wasser durchspülen und an der Luft trocknen lassen.'
      },
      preseededWisdom: {
        top: 'Verantwortungsvolle Hygiene-Regie: Du sorgst dafür, dass der verriegelte Körper gesund und reizfrei bleibt.',
        sub: 'Der warme Spülstrahl reinigt die Eichelkammer im Käfig. Ein beruhigendes Gefühl von Frische und Sauberkeit.'
      }
    },
    {
      id: 'butt_plug_silicone_flared',
      name: 'Ergonomischer Silikon-Butt-Plug mit Sicherheitsfuß',
      category: 'care',
      tags: ['butt_plug'],
      somaticZone: 'anal_perineum',
      restraintLayer: 1,
      materials: ['medical_silicone'],
      isLatex: false,
      somaticEffect: 'Glatter Analplug mit schmalem Hals und breitem Standfuß zur sicheren inneren Ausfüllung.',
      dofImpact: {
        anal_access: 0.0
      },
      safetyProtocol: {
        inspectionCheck: 'Ausschließlich Plugs mit festem, breitem Sicherheitsfuß (Flared Base) verwenden! Reichlich wasserbasiertes Gleitgel nutzen.',
        disinfectionMethod: 'boiling_water_or_toy_cleaner',
        aftercareInstruction: 'Mit warmem Wasser und antibakterieller Seife reinigen oder für 3 Minuten auskochen.'
      },
      preseededWisdom: {
        top: 'Erfüllendes Geheimnis: Du weißt genau, dass der Partner innerlich ausgefüllt vor dir steht oder geht.',
        sub: 'Kontinuierlicher, wohliger Druck im Becken. Zwingt zu aufrechter Haltung und ruhigen, disziplinierten Schritten.'
      }
    },
    {
      id: 'strap_on_harness_leather',
      name: 'Verstellbares Leder-Harness mit Dildo-Halterung',
      category: 'care',
      tags: ['strap_on', 'harness'],
      somaticZone: 'pelvis_core',
      restraintLayer: 1,
      materials: ['leather', 'steel'],
      isLatex: false,
      somaticEffect: 'Stabiles Beckengeschirr für die Partnerin zur Aufnahme von Toys bei Pegging- und Führungsspielen.',
      dofImpact: {
        clitoral_access: 0.3
      },
      safetyProtocol: {
        inspectionCheck: 'Gurte fest am Becken anpassen, damit das Toy stabil geführt werden kann. Viel Gleitmittel beim Partner nutzen.',
        disinfectionMethod: 'antiseptic_leather_spray',
        aftercareInstruction: 'Dildo abnehmen und separat auskochen/desinfizieren. Ledergeschirr mit Pflegespray reinigen.'
      },
      preseededWisdom: {
        top: 'Vollkommene Rollenumkehr: Die Frau übernimmt die aktive Penetration und führt das Becken des Mannes souverän an.',
        sub: 'Sich als Mann der Partnerin ganz öffnen. Die Hingabe bricht alle patriarchalen Rollenmuster auf heilsame Weise auf.'
      }
    },
    {
      id: 'prostate_massager_vibrating',
      name: 'Ergonomisches Prostata-Toy mit Tiefenvibration',
      category: 'care',
      tags: ['prostate_massager'],
      somaticZone: 'anal_perineum',
      restraintLayer: 1,
      materials: ['medical_silicone', 'lithium_battery'],
      isLatex: false,
      somaticEffect: 'Gezielt gekrümmtes Toy zur inneren Stimulation des männlichen Lustpunkts und Beckenbodens.',
      dofImpact: {
        anal_access: 0.0
      },
      safetyProtocol: {
        inspectionCheck: 'Vorsichtiges Einführen in Ausatmung. Niemals mit Gewalt gegen Muskelwiderstand drücken.',
        disinfectionMethod: 'toy_cleaner_and_water',
        aftercareInstruction: 'Mit Wasser und Toy-Cleaner reinigen. Nicht vollständig untertauchen (Ladekontakte trocken halten).'
      },
      preseededWisdom: {
        top: 'Den Mann auf eine tiefe, wellenartige Lustebene führen, die seinen Verstand vollkommen entwaffnet.',
        sub: 'Ein tiefer innerer Orgasmus ohne Schaftberührung. Löst Tränen und vollkommene Entspannung im gesamten Körper aus.'
      }
    },
    {
      id: 'latex_catsuit_black',
      name: 'Schwarzer Latex-Catsuit (0.4mm Naturkautschuk)',
      category: 'bondage',
      tags: ['latex_catsuit', 'latex_gear'],
      somaticZone: 'full_body',
      restraintLayer: 1,
      materials: ['latex'],
      isLatex: true,
      somaticEffect: 'Ganzkörper-Latexanzug als zweite Haut; feste Kompression auf die gesamte Körperoberfläche.',
      dofImpact: {},
      safetyProtocol: {
        inspectionCheck: 'ACHTUNG RACK-ALLERGIE-RADAR: Vorab auf Latex-Allergie prüfen! Bei Allergie strikt verboten.',
        disinfectionMethod: 'silicone_oil_wash',
        aftercareInstruction: 'Im lauwarmen Wasser mit speziellem Latexwaschmittel spülen, mit Silikonöl polieren und dunkel aufhängen. Niemals in die Sonne hängen.'
      },
      preseededWisdom: {
        top: 'Der Partner glänzt spiegelglatt vor dir. Seine Körperformen treten gestochen scharf hervor; Gummi quietscht bei jeder Berührung.',
        sub: 'Vollkommene Hauthülle. Das kühle Material wärmt sich am Körper auf und schirmt die Außenwelt wohltuend ab.'
      }
    },
    {
      id: 'tens_unit_estim',
      name: 'TENS-Reizstromgerät mit Klebepads (E-Stim)',
      category: 'sensory',
      tags: ['tens_unit'],
      somaticZone: 'gluteal_pelvis',
      restraintLayer: 0,
      materials: ['plastic', 'gel_pads'],
      isLatex: false,
      somaticEffect: 'Medizinisches Reizstromgerät; rhythmische elektrische Impulse lösen unwillkürliche Muskelkontraktionen aus.',
      dofImpact: {},
      safetyProtocol: {
        inspectionCheck: 'STRIKTE SCHUTZREGEL: Strom niemals über das Herz oder den Hals leiten! Verboten bei Herzschrittmachern.',
        disinfectionMethod: 'wipe_housing',
        aftercareInstruction: 'Pads nach Gebrauch mit Folie versiegeln. Gehäuse trocken abwischen.'
      },
      preseededWisdom: {
        top: 'Elektrische Fernsteuerung: Du drehst am Regler und bestimmst die Kontraktionen seiner Muskeln auf Knopfdruck.',
        sub: 'Elektrisierendes Kribbeln und Zucken, das sich dem eigenen Willen vollkommen entzieht. Reine Faszination.'
      }
    }
  ];

  function getAllEquipment() {
    return EQUIPMENT_DATABASE.slice();
  }

  function getEquipmentById(toyId) {
    if (!toyId) return null;
    return EQUIPMENT_DATABASE.find(item => item.id === toyId) || null;
  }

  function getEquipmentByCategory(category) {
    if (!category || category === 'all') return getAllEquipment();
    return EQUIPMENT_DATABASE.filter(item => item.category === category);
  }

  function getEquipmentByTag(tag) {
    if (!tag) return [];
    return EQUIPMENT_DATABASE.filter(item => (item.tags || []).includes(tag));
  }

  function getDisinfectionProtocols(toyIds) {
    if (!Array.isArray(toyIds) || toyIds.length === 0) return [];
    const protocols = [];
    const seen = new Set();

    toyIds.forEach(id => {
      const toy = getEquipmentById(id);
      if (toy && toy.safetyProtocol && !seen.has(toy.safetyProtocol.disinfectionMethod)) {
        seen.add(toy.safetyProtocol.disinfectionMethod);
        protocols.push({
          toyId: toy.id,
          name: toy.name,
          materials: (toy.materials || []).join(', '),
          method: toy.safetyProtocol.disinfectionMethod,
          instructions: toy.safetyProtocol.aftercareInstruction
        });
      }
    });

    return protocols;
  }

  function validateLatexConflict(toyIds, hasLatexAllergy) {
    if (!hasLatexAllergy || !Array.isArray(toyIds) || toyIds.length === 0) {
      return { hasConflict: false, conflictingToys: [] };
    }

    const conflicting = [];
    toyIds.forEach(id => {
      const toy = getEquipmentById(id);
      if (toy && (toy.isLatex || (toy.materials || []).includes('latex'))) {
        conflicting.push(toy);
      }
    });

    return {
      hasConflict: conflicting.length > 0,
      conflictingToys: conflicting
    };
  }

  function getPreseededWisdom(toyId) {
    const toy = getEquipmentById(toyId);
    if (toy && toy.preseededWisdom) {
      return toy.preseededWisdom;
    }
    return {
      top: 'Souveräne, ruhige Führung und klare Rahmensetzung im Vertrauensraum.',
      sub: 'Körperliches Loslassen, Entlastung des Nervensystems und tiefe Geborgenheit.'
    };
  }

  const api = {
    getAll: getAllEquipment,
    getById: getEquipmentById,
    getByCategory: getEquipmentByCategory,
    getByTag: getEquipmentByTag,
    getDisinfectionProtocols: getDisinfectionProtocols,
    validateLatexConflict: validateLatexConflict,
    getPreseededWisdom: getPreseededWisdom,
    catalog: EQUIPMENT_DATABASE
  };

  window.EquipmentCatalog = api;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

})(typeof window !== 'undefined' ? window : this);
