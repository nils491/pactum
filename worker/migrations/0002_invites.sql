-- Testercodes: umgehen die Bezahlung und erzeugen beim Einlösen eine eigene Testlizenz
CREATE TABLE IF NOT EXISTS invites (
  code_hash   TEXT PRIMARY KEY,     -- SHA-256 des normalisierten Codes
  code_display TEXT NOT NULL,       -- Klartext-Code für die Verwaltung (nur über /api/admin sichtbar)
  months      INTEGER,              -- Dauer der erzeugten Testlizenz, NULL = unbegrenzt
  max_uses    INTEGER NOT NULL,     -- wie viele Paare den Code einlösen dürfen
  uses        INTEGER NOT NULL DEFAULT 0,
  expires_at  INTEGER,              -- bis wann der Code einlösbar ist, NULL = unbegrenzt
  active      INTEGER NOT NULL DEFAULT 1,
  created_at  INTEGER NOT NULL,
  note        TEXT
);

-- Bremse gegen Durchprobieren von Codes (gehashte IP, nur Tageszähler)
CREATE TABLE IF NOT EXISTS redeem_attempts (
  ip_hash TEXT NOT NULL,
  day     TEXT NOT NULL,
  count   INTEGER NOT NULL,
  PRIMARY KEY (ip_hash, day)
);
