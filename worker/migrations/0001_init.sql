-- TACTUS Lizenzen & KI-Kontingent
CREATE TABLE IF NOT EXISTS licenses (
  key_hash   TEXT PRIMARY KEY,      -- SHA-256 des Lizenzschlüssels (Klartext wird nie gespeichert)
  key_hint   TEXT NOT NULL,         -- letzte 4 Zeichen zur Wiedererkennung
  plan       TEXT NOT NULL,         -- monthly | yearly | lifetime
  status     TEXT NOT NULL,         -- active | revoked | cancelled
  expires_at INTEGER,               -- ms seit Epoch, NULL = unbegrenzt
  created_at INTEGER NOT NULL,
  note       TEXT,
  customer_ref TEXT                 -- Referenz beim Zahlungsanbieter
);

CREATE TABLE IF NOT EXISTS ai_usage (
  license_hash TEXT NOT NULL,
  day          TEXT NOT NULL,       -- YYYY-MM-DD (UTC)
  kind         TEXT NOT NULL,       -- text | tts
  count        INTEGER NOT NULL,
  PRIMARY KEY (license_hash, day, kind)
);
