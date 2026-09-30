TACTUS · Somatic Topology & Intimacy Operating System„Touch has a rhythm. Intimacy has an operating system.“Offizielle Web-Präsenz: tactus.digital1. Vision & LeitbildTACTUS (lat. die Berührung, der Tastsinn, der Takt, der Kontakt) ist das weltweit erste somatische Beziehungs-Betriebssystem für anspruchsvolle Paare. Es schlägt die Brücke von psychometrischer Konsens-Erkundung (36 Kapitel, Rasch-IRT) über dynamische Alltags-Führung (Orgasmus-Ratio, Pflichten & Alltagsservice) bis unmittelbar in das Halbdunkel des Schlafzimmers (Live-Regie, Reiz-Vektoren, Edging-Cockpit, Vagus-Atmung & Soundscapes).Im Gegensatz zu statischen Formularen oder infantilen Spielhallen-Apps denkt TACTUS Intimität als dynamisches topologisches Gewebe:Ausrüstung wird nicht über starre Namen definiert, sondern über physikalische Reiz-Vektoren ($\mathcal{V}_{\text{Reiz}}$), Zonen-Affordanzen und Freiheitsgrade (Degrees of Freedom / DoF).Das Beziehungsbündnis und der Vertrag sind vollständig optionale Module – der Fokus liegt auf körperlicher Resonanz, Entlastung der Spielleitung und somatischer Präzision.Kompromisslose Privatsphäre: Zero-Knowledge-Architektur mit clientseitiger AES-GCM-256 Verschlüsselung. Eure Intimdaten verlassen eure Geräte niemals im Klartext.2. Die 6 Systemischen Säulen von TACTUS┌────────────────────────────────────────────────────────────────────────┐
│                   DIE 6 ARCHITEKTONISCHEN SÄULEN                       │
├────────────────────────────────────────────────────────────────────────┤
│ I.   SOMATISCHE TOPOLOGIE & REIZ-VEKTOREN                              │
│      Körperzonen, Toys und Haltungen bilden ein dynamisches Netzwerk.  │
│      Restraint-Stacking und DoF-Berechnung schließen Widersprüche aus. │
├────────────────────────────────────────────────────────────────────────┤
│ II.  FÜHRUNG, DIE DIENT (Top-First Doktrin & Anti-TftB)                │
│      Schutz vor Top Fatigue: Dienen bedeutet Alltagsentlastung         │
│      (Mental Load). Verdeckte Regie von unten ist ausgeschlossen.      │
├────────────────────────────────────────────────────────────────────────┤
│ III. SCHLAFZIMMER-LIVE-REGIE IM HALBDUNKEL                             │
│      Deterministische State-Machine, Edging-Cockpit mit Haptik-Puls,   │
│      autarke WebAudio-Synthese und beruhigende 4-7-8 Vagus-Atmung.     │
├────────────────────────────────────────────────────────────────────────┤
│ IV.  UNIVERSELLE MULTI-KI-SCHNITTSTELLE (BYOK)                         │
│      Provider-Agnostisch: Wähle zwischen Google Gemini, Anthropic      │
│      Claude 3.5 Sonnet, OpenAI GPT-4o oder 100 % lokaler WebGPU-KI.   │
├────────────────────────────────────────────────────────────────────────┤
│ V.   REVERSE AFTERCARE & HYGIENE-PROTOKOLL                             │
│      Gezielte Decken-Erdung gegen Kältezittern, 24h/48h Drop-Wächter   │
│      sowie diskrete Toy-Desinfektion für sofortige Einsatzbereitschaft.│
├────────────────────────────────────────────────────────────────────────┤
│ VI.  ABSOLUTE PRIVATSPHÄRE & NOIR-LUXURY DESIGN                        │
│      OLED-Tiefschwarz (#000000), Champagner-Gold, monochrome 1.5px-   │
│      Vektorlinien (100 % frei von infantilen System-Emojis).           │
└────────────────────────────────────────────────────────────────────────┘
3. Repository- & Projekt-StrukturTACTUS ist als moderne, performante Web-Applikation (PWA) mit serverloser Thin-Edge-Schnittstelle konzipiert:tactus/
│
├── README.md                      # Dieses Manifest & Architekturdokument
├── index.html                     # Start-Hub, Onboarding & 36 Kapitel psychometrischer Radar
├── session.html                   # Schlafzimmer-Regie: Live-Cockpit, Edging & Vagus-Atmung
├── protocol.html                  # Das Protokoll: Status, Orgasmus-Ratio, Pflichten & Kodex
├── analyse.html                   # Paar-Analyse: Doppel-5er Synergien, Brücken & Scham-Zonen
├── chat.html                      # E2EE Paar-Stream mit verschlüsseltem Foto-Tresor
├── guide.html                     # Wissenschaftlicher BDSM- & Vertrauens-Guide (PubMed-DOIs)
│
├── js/                            # Kern-Logik (Strict Budget: <= 800 Zeilen pro Modul)
│   ├── hub_photos.js              # IndexedDB-Tresor (tactus_vault_db), 1:1 Canvas-Crop & Vision
│   ├── hub_toys.js                # Somatische Zonen-Zuordnung, Schrank & Fetisch-Garderobe
│   ├── hub_context.js             # 7-Vektoren Kontext-Synthese & Episodengedächtnis
│   ├── ai_adapter.js              # Universeller Multi-KI Gateway (Gemini, Claude, GPT, WebGPU)
│   ├── protocol_core.js           # Protokoll-Engine: Saldo, Zero-State & Break-Glass RACK
│   ├── protocol_ratio.js          # Orgasmus-Ökonomie (N_Top : N_Sub) mit 4 Climax-Typen
│   ├── protocol_tasks.js          # Kontextuelle Pflichten-Engine & Anti-TftB Freigabe
│   ├── protocol_contract.js       # Optionales Bündnis- & Vertrags-Studio (Stufe 0–5)
│   ├── protocol_coach.js          # Top-Führungsassistent: Mental Load & Teasing-Rhythmus
│   ├── session_staging.js         # Staging-Cockpit: 4 Top-Dimensionen & DoF-Validierung
│   ├── session_live.js            # Deterministische State-Machine, WakeLock & Toy-Desinfektion
│   ├── session_edging.js          # Edging-Cockpit, Schwellen-Zähler & JOI-Countdown
│   ├── session_audio.js           # Autarke WebAudio-Synthese (Drohnen, Klangschalen, Ducking)
│   ├── session_voice.js           # Expressive Sprachausgabe mit 0-ms Audio-Caching
│   ├── cloud_sync.js              # Zero-Knowledge E2EE Peer-Sync via ntfy (AES-GCM-256)
│   ├── survey.js                  # 36 Kapitel Fragebogen-Engine mit Scham-Anker (🙈)
│   └── pair_analysis.js          # Rasch-IRT Synergie- und Brückenbau-Algorithmus
│
├── data/                          # Somatische Topologie & auditierte Wissenskataloge
│   ├── questions_part1.js         # Kapitel 0 bis 17 (Chronologisch geordnet, feste IDs)
│   ├── questions_part2.js         # Kapitel 18 bis 35 (Chronologisch geordnet, feste IDs)
│   ├── equipment_catalog.js       # Somatisches Affordanz-Inventar mit Zonen-Profilen
│   ├── chastity_database.js       # 4 Spannungsphasen, 5 Berufsprofile & Teasing-Katalog
│   ├── toy_combinatorics.js       # Topologische Schnittmengen, Restraint-Stacking & DoF-Engine
│   └── scientific_studies.js      # Studien-Metadaten (Wismeijer, Ambler, Sagarin, Brody)
│
└── docs/                          # Strategie-, Philosophie- und Audit-Dossiers
4. Die 7 Vektoren des Dynamischen Kontext-BriefingsVor jeder Entscheidung verdichtet TACTUS sieben dimensionale Live-Vektoren:$$\vec{\Psi}_{\text{TACTUS}} = \langle \vec{P}_{\text{Psychometrie}}, \vec{S}_{\text{Somatik}}, \vec{H}_{\text{Historie}}, \vec{E}_{\text{Energie}}, \vec{B}_{\text{Biologie}}, \vec{T}_{\text{TopLust}}, \vec{C}_{\text{Hardware}} \rangle$$$\vec{P}$ Psychometrie: 36 Kapitel, Rasch-Archetypen, Doppel-5er Synergien und rollenabhängige No-Go-Schranken.$\vec{S}$ Somatischer Zustand: Keuschheitsphase (Tag $N$), Gewebestatus, Tragedauer von Layer-0-Manschetten.$\vec{H}$ Episodische Historie: Letzte 3 Sessions (Kältezittern, Überreizung, Subspace), Freitext-Reflexionen und Alltags-Verstöße.$\vec{E}$ Tagesenergie & Temperament: Mental Load des Tops (Erschöpft, Ausgeglichen, Streng), Arbeitskontext des Bottoms (Büro, Bau, Schicht).$\vec{B}$ Biologie & RACK-Gesundheitspass: Chronische Faktoren (Diabetes-Hypoglykämie-Guard, Asthma, Neuropathie-Warnungen, Zyklustag).$\vec{T}$ Top-Agenda: Heutiger Fokus des Tops (Eigene Entladung Pflicht, Kalte Distanz, Zucht, Multi-Climax).$\vec{C}$ Hardware & DoF: Verfügbare Affordanzen, aktive Restraint-Stacks und physikalische Schnittmengen.5. Das Reverse-Aftercare- & Rüst-ProtokollNach jeder Session schützt TACTUS beide Partner durch ein klares, dreistufiges Aftercare-Reglement:Nervensystem-Stabilisierung: Vagus-Atemführung (4-7-8), Gewichtsdecken gegen Kältezittern, Glukose-/Tee-Gabe.Reverse Aftercare (Dienst am Top): Der Bottom massiert ermüdete Muskeln des Tops und sorgt für absolute Entspannung der Spielleitung.Diskrete Toy-Desinfektion & Rüst-Pflege:Die verwendete Ausrüstung wird sofort materialspezifisch gereinigt (Isopropanol für medizinisches Metall, pH-neutrale Seife für Silikon, Lederbalsam/Lüften für Rindleder) und geordnet verstaut. Die Desinfektion wird im Protokoll dezent quittiert, damit jede Hardware für die nächste Session hygienisch einsatzbereit ist.24h/48h Drop-Wächter: Automatischer Timer für den post-ekstatischen Hormonabfall (Subdrop/Topdrop).6. Hosting, Cloudflare & Domain-SetupDie Bereitstellung erfolgt über Cloudflare Pages mit direkter Anbindung an das private GitHub-Repository:Produktions-Domain: https://tactus.digitalEdge-Sicherheit: Full (Strict) SSL/TLS, DNSSEC, Bot Fight Mode & DDoS-Schutz.DNS-Konfiguration:CNAME @ tactus.pages.dev (Proxied 🟠 mit automatischem CNAME-Flattening)CNAME www tactus.pages.dev (Proxied 🟠)7. Kryptografie & DatenschutzZero-Knowledge-Prinzip: Weder Betreiber noch Hosting-Provider können Verträge, Fotos oder Fragebogen-Noten im Klartext einsehen.Kryptografie: Clientseitige symmetrische Authenticated Encryption via AES-GCM-256. Der Schlüssel wird aus dem gemeinsamen Paar-Geheimnis abgeleitet und verlässt den Browser niemals im Klartext.Persistenter Speicher: Automatischer Aufruf von navigator.storage.persist(), um die clientseitige Datenbank vor automatischen Löschroutinen mobiler Browser (wie Apples 7-Tage-ITP-Regel in Safari) zu schützen.
