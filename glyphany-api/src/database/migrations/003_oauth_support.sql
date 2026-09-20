-- password_hash alanını opsiyonel yap
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;

-- Hangi sağlayıcıdan (credentials, google) geldiğini tutmak için auth_provider kolonu ekle
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_provider TEXT DEFAULT 'credentials';
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id TEXT UNIQUE;
