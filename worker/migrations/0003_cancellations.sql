-- Kündigungen nach § 312k BGB (Nachweis des Eingangs) und Bremse gegen Missbrauch
CREATE TABLE IF NOT EXISTS cancellations (
  id           TEXT PRIMARY KEY,
  received_at  INTEGER NOT NULL,      -- Eingang (ms seit Epoch)
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  contract_ref TEXT NOT NULL,         -- Lizenzschlüssel, Bestell- oder Abo-Nummer
  kind         TEXT NOT NULL,         -- ordentlich | ausserordentlich
  reason       TEXT,
  effective    TEXT NOT NULL,         -- naechstmoeglich | YYYY-MM-DD
  ends_at      INTEGER,               -- bekanntes Vertragsende (falls Lizenz zugeordnet)
  license_hash TEXT,
  mail_status  TEXT,                  -- sent | failed | not_configured
  processed    INTEGER NOT NULL DEFAULT 0  -- Abo beim Zahlungsanbieter beendet
);

CREATE TABLE IF NOT EXISTS cancel_attempts (
  key   TEXT NOT NULL,                -- gehashte IP oder E-Mail
  day   TEXT NOT NULL,
  count INTEGER NOT NULL,
  PRIMARY KEY (key, day)
);
