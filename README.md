# TACTUS

Verschlüsseltes Paar-Cockpit für einvernehmliches BDSM (18+), als Web-App unter tactus.digital.

- **Live schalten:** siehe [DEPLOY.md](DEPLOY.md)
- **Prüfen vor jedem Push:** `npm run check`

## Aufbau

| Pfad | Inhalt |
|---|---|
| `index.html`, `analyse.html`, `chat.html`, `protocol.html`, `guide.html`, `session.html` | Die 6 Cockpits |
| `js/` | Module, z. B. `cloud_sync.js` (Delta-Sync), `ai_adapter.js` (KI-Zugang), `tactus_access.js` (18+, Abo, Kopplung, Einwilligung) |
| `data/` | Fragenkatalog (505 Items), Ausrüstung, Studien |
| `impressum.html`, `datenschutz.html`, `agb.html`, `jugendschutz.html` | Rechtstexte (frei erreichbar, ohne Zugangssperre) |
| `admin.html` | Lizenzverwaltung für den Betreiber |
| `worker/` | Cloudflare Worker: Sync-Briefkasten, KI-Fallback, Lizenzen |
| `scripts/build.mjs` | Baut `dist/`: lokales Tailwind, eigene Schriften, Service Worker, Sicherheits-Header |

## Grundsätze

1. **Daten bleiben auf den Geräten.** Der Server sieht nur verschlüsselte Pakete und löscht sie nach Abholung.
2. **Keine Verbindungen zu Dritten ohne Einwilligung.** Keine CDNs, keine Google Fonts, kein Tracking. Die KI läuft nur nach ausdrücklicher Einwilligung.
3. **Jede App-Seite lädt `js/tactus_access.js`.** `npm run check` stellt das sicher.

## Regeln für Änderungen (auch mit KI-Assistenten)

- **Kleine, gezielte Änderungen statt ganze Dateien neu generieren.** Vollständiges Neuschreiben ist die Hauptursache für verlorene Funktionen.
- Nach jeder Änderung `npm run check` ausführen. GitHub prüft das zusätzlich bei jedem Push.
- Funktionen erst als „erledigt“ markieren, wenn sie auf dem iPhone getestet sind.
- Niemals API-Schlüssel in den Code schreiben. Sie gehören in die App-Einstellungen oder in Worker-Secrets.
