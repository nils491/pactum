# TACTUS live schalten – Schritt für Schritt

Diese Anleitung bringt TACTUS auf **tactus.digital**, im **kostenlosen Cloudflare-Plan**.
Du brauchst keine Kommandozeile, alles läuft über das Cloudflare-Dashboard.

## So ist TACTUS aufgebaut

| Teil | Wo | Was es tut |
|---|---|---|
| App (HTML/JS) | Cloudflare Worker, statische Dateien aus `dist/` | Läuft komplett im Browser, Daten bleiben auf dem Gerät |
| Sync-Briefkasten | Durable Object (`/api/relay`) | Hält verschlüsselte Pakete, bis das Partnergerät sie abholt, und löscht sie dann |
| KI-Fallback | Worker (`/api/ai`) | Leitet KI-Anfragen mit **deinem** Gemini-Key weiter, nur für Abo-Kunden, mit Tageslimit |
| Lizenzen | D1-Datenbank | Speichert nur Fingerabdrücke der Lizenzschlüssel, Tarif und Ablaufdatum |

---

## Schritt 1 – Neuen Gemini-Schlüssel erstellen

Der bisherige Schlüssel stand im Chat und gilt deshalb als verbraucht.

1. https://aistudio.google.com/apikey öffnen.
2. Den alten Schlüssel **löschen** und einen neuen erstellen.
3. Den neuen Schlüssel sicher notieren, zum Beispiel im Passwort-Manager.

## Schritt 2 – Datenbank anlegen

1. Cloudflare-Dashboard → **Storage & Databases → D1 SQL Database → Create**.
2. Name: `tactus` → **Create**.
3. Die angezeigte **Database ID** kopieren und in `wrangler.jsonc` bei `database_id` eintragen. Du kannst sie auch mir geben, dann trage ich sie ein.
4. Mehr ist nicht nötig. Die Tabellen legt der Worker beim ersten Aufruf selbst an (Lizenzen, KI-Kontingent, Testercodes).

## Schritt 3 – Cloudflare-Zugang für GitHub (veröffentlicht automatisch)

Veröffentlicht wird über **GitHub Actions** (`.github/workflows/deploy.yml`). Bei jedem Push auf `main` wird geprüft, gebaut und der Worker samt App, Datenbank-Bindung und Domain veröffentlicht. Die Logs stehen auf GitHub unter **Actions**.

1. Cloudflare → oben rechts **Profil → API Tokens → Create Token → Vorlage „Edit Cloudflare Workers“**.
2. Unter **Permissions** zusätzlich hinzufügen:
   - Account → **D1** → Edit
   - Zone → **DNS** → Edit
3. Bei **Zone Resources** die Zone `tactus.digital` auswählen → **Continue → Create Token** und den Token kopieren.
4. GitHub → Repository `tactus` → **Settings → Secrets and variables → Actions → New repository secret**:
   - Name `CLOUDFLARE_API_TOKEN`, Wert: der Token

> **Wichtig:** Die bisherige Cloudflare-Verbindung („Workers Builds“), die bei jedem Versuch sofort scheitert, bitte trennen: Cloudflare → Workers & Pages → `tactus` → **Settings → Build → Disconnect**. Gibt es unter Workers & Pages noch ein weiteres Projekt, das `tactus.digital` als Domain nutzt (z. B. ein Pages-Projekt), dort die Domain unter **Custom domains** entfernen. Sonst kann der Worker die Domain nicht übernehmen.

## Schritt 4 – Geheimnisse hinterlegen (in GitHub)

Ebenfalls unter **GitHub → Settings → Secrets and variables → Actions** als Repository-Secrets anlegen. Der Veröffentlichungs-Workflow überträgt sie automatisch an den Worker:

| Name | Wert |
|---|---|
| `GEMINI_API_KEY` | dein Gemini-Schlüssel (Google-Projekt mit aktivierter Abrechnung) |
| `ADMIN_TOKEN` | langes Zufallspasswort (mindestens 32 Zeichen, aus dem Passwort-Manager) – damit meldest du dich unter `/admin` an |
| `BREVO_API_KEY` | API-Schlüssel von Brevo (siehe Schritt 5b), für Kündigungsbestätigungen |

Danach unter **Actions → Veröffentlichen → Run workflow** einmal starten.

## Schritt 5 – Domain

Die Domain ist in `wrangler.jsonc` per **Route** an den Worker gebunden (`tactus.digital/*` und `www.tactus.digital/*`). Alle Anfragen an die Domain laufen damit über den Worker. Die vorhandenen DNS-Einträge bleiben unverändert; sie müssen nur über Cloudflare laufen (orangene Wolke „Proxied“). Die MX- und TXT-Einträge für die IONOS-Mails sind davon nicht betroffen.

## Schritt 5b – E-Mails für Kündigungsbestätigungen (Brevo)

1. Kostenloses Konto bei [brevo.com](https://www.brevo.com) anlegen.
2. **Senders, Domains & Dedicated IPs → Domains → Add a domain** → `tactus.digital`. Brevo zeigt dann einige DNS-Einträge (z. B. `brevo-code`, DKIM). Diese in Cloudflare unter **DNS → Records** genau so anlegen und in Brevo auf **Verify** klicken.
3. **Senders → Add sender**: `noreply@tactus.digital`, Name „TACTUS“.
4. **SMTP & API → API Keys → Generate** → als GitHub-Secret `BREVO_API_KEY` speichern.
5. Empfohlen für bessere Zustellbarkeit: in Cloudflare-DNS einen TXT-Eintrag `_dmarc` mit dem Wert `v=DMARC1; p=none; rua=mailto:kontakt@tactus.digital` anlegen.

Ohne Brevo funktioniert die Kündigung trotzdem: Sie wird gespeichert und auf der Seite bestätigt; nur die E-Mails entfallen. Kündigungen siehst du in `/admin` unter **Kündigungen**.

## Schritt 6 – Rechtstexte ausfüllen

In `impressum.html`, `datenschutz.html`, `agb.html` und `jugendschutz.html` alle Stellen mit `[BITTE …]` ausfüllen: Name, Anschrift, Telefon, USt-IdNr., Zahlungsanbieter, Jugendschutzbeauftragte(r).
Danach lass die Texte **einmal von einem Anwalt** (IT-/Medienrecht) prüfen, bevor du an Fremde verkaufst.

## Schritt 7 – Lizenzen für euch zwei

1. `https://tactus.digital/admin` öffnen und das `ADMIN_TOKEN` eingeben.
2. Tarif **Unbegrenzt** wählen → **Lizenz erstellen** und den Schlüssel notieren.

## Testercodes (kostenloser Zugang für Tester)

Unter `https://tactus.digital/admin` im Bereich **Testercodes**:

- **Wunschcode** (z. B. `BETA-HERBST`) oder leer lassen für einen Zufallscode
- **Testzugang gilt:** wie lange die Tester kostenlos nutzen dürfen
- **Einlösbar von:** wie viele **Paare** den Code nutzen dürfen. Ein Paar löst nur einmal ein, das zweite Gerät bekommt den Zugang über die Partner-Kopplung.
- **Code gültig für:** bis wann der Code eingelöst werden kann

Tester geben den Code im Abo-Fenster ins Feld **„Lizenzschlüssel oder Testercode“** ein. Codes kannst du jederzeit deaktivieren. Bereits eingelöste Testzugänge laufen bis zu ihrem Ablaufdatum weiter, sperren kannst du sie über „Lizenz ändern“. Nach 20 falschen Versuchen pro Tag und Anschluss wird das Einlösen gesperrt.

> Tipp für Beta-Gruppen: lieber einen gut lesbaren Wunschcode mit begrenzter Einlöse-Zahl als einen Code, der unbegrenzt oft funktioniert. Codes werden weitergegeben.

## Schritt 8 – Auf dem iPhone einrichten

1. Safari → `tactus.digital` → **Teilen → Zum Home-Bildschirm**.
2. Altersbestätigung → Lizenzschlüssel eingeben.
3. **Einstellungen (⚙) → Abo, Partner-Kopplung & KI → Kopplungscode erzeugen** → den Code sicher an dein Gegenüber schicken (persönlich oder per Signal).
4. Auf dem zweiten iPhone: Altersbestätigung → im Abo-Fenster **„Dein Partner nutzt TACTUS schon?“** → Code einfügen. Das Abo wird dabei übernommen.

---

## Was der kostenlose Plan schafft

Grob gerechnet reicht der Gratis-Plan für **einige hundert aktive Paare**. Die Grenzen sind:

- 100.000 Worker-Anfragen pro Tag
- 100.000 Durable-Object-Anfragen pro Tag
- 5 Mio. Datenbank-Lesezugriffe und 100.000 Schreibzugriffe pro Tag

Nur Änderungen werden übertragen, typisch wenige hundert Bytes. Wird es mehr, kostet der Workers-Paid-Plan 5 $ pro Monat.

## Was vor dem Verkauf an Fremde noch offen ist

1. **Zahlungsanbieter wählen.** Stripe, Paddle, Lemon Squeezy und PayPal schränken Angebote mit sexuellen Inhalten ein; es droht die Kontosperrung. Frag bei 2–3 Anbietern mit Erfahrung im Erotikbereich an (z. B. Verotel, CCBill, Segpay) und beschreibe das Produkt ehrlich. Sobald der Anbieter feststeht, baue ich die automatische Freischaltung per Webhook ein. Bis dahin vergibst du Lizenzen über `/admin`.
2. **Kündigungsbutton (§ 312k BGB).** Bei Abos im Netz Pflicht. Viele Zahlungsanbieter liefern ihn mit, das klären wir mit der Anbieterwahl.
3. **Jugendschutzbeauftragte(r)** (§ 7 JMStV) bestellen oder einer Selbstkontrolle wie der FSM beitreten. Es gibt externe Dienstleister dafür.
4. **age-de.xml-Kennzeichnung „ab 18“** für Jugendschutzprogramme erstellen (Label-Generator der FSM/JusProg) und als `age-de.xml` ins Projekt legen.
5. **Google-Nutzungsbedingungen prüfen.** Die Gemini-Richtlinien verbieten sexuell explizite Inhalte zur sexuellen Erregung. Für den Fallback-Key über dein Konto ist das ein Sperrrisiko. Alternativen prüfen wir, bevor viele Kunden darauf angewiesen sind.

## Lokal entwickeln (optional)

```bash
npm install
npm run check          # Syntax, 505 Items, Jugendschutz, keine Schlüssel im Code
ALLOW_PLACEHOLDERS=1 npm run build
npx wrangler d1 migrations apply tactus --local
npx wrangler dev       # http://localhost:8787
```

Für den lokalen KI-Test eine Datei `.dev.vars` anlegen. Sie wird nicht eingecheckt.

```
ADMIN_TOKEN=lokales-test-passwort
GEMINI_API_KEY=dein-key
```
