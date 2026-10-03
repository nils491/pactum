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

## Schritt 3 – Worker mit GitHub verbinden

1. Dashboard → **Workers & Pages → Create → Import a repository**.
2. GitHub verbinden und `nils491/tactus` auswählen, Branch `main`.
3. Einstellungen:
   - **Project name:** `tactus` (muss zum Namen in `wrangler.jsonc` passen)
   - **Build command:** `npm run build`
   - **Deploy command:** `npx wrangler deploy`
4. **Deploy** drücken.

Ab jetzt wird bei jedem Push auf `main` automatisch neu veröffentlicht.

> Der erste Build **bricht absichtlich ab**, solange in den Rechtstexten noch `[BITTE …]` steht (siehe Schritt 6). Das ist ein Schutz, damit nie ein unvollständiges Impressum online geht.

## Schritt 4 – Geheimnisse hinterlegen

Worker `tactus` → **Settings → Variables and Secrets → Add**, beide jeweils als Typ **Secret**:

| Name | Wert |
|---|---|
| `GEMINI_API_KEY` | der neue Schlüssel aus Schritt 1 |
| `ADMIN_TOKEN` | ein langes Zufallspasswort (mindestens 32 Zeichen, aus dem Passwort-Manager) |

Ohne `GEMINI_API_KEY` funktioniert alles außer dem KI-Fallback. Kunden mit eigenem Key können die KI trotzdem nutzen.

**Falls das Speichern nicht klappt:** Häufigste Ursache ist, dass der Worker noch nie erfolgreich veröffentlicht wurde. Secrets lassen sich zuverlässig erst eintragen, wenn der Worker mindestens einmal erfolgreich veröffentlicht wurde. Also zuerst dafür sorgen, dass der Build grün ist (Schritt 3, keine `[BITTE …]`-Platzhalter mehr), dann die Secrets eintragen und einmal **Deployments → Retry/Redeploy** auslösen, damit der Worker sie übernimmt.

## Schritt 5 – Domain verbinden

1. Die Domain `tactus.digital` muss ihr DNS über Cloudflare laufen lassen: **Add a domain**, danach beim Registrar die Nameserver auf die von Cloudflare angezeigten umstellen.
2. Worker `tactus` → **Settings → Domains & Routes → Add → Custom domain** → `tactus.digital`.

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
