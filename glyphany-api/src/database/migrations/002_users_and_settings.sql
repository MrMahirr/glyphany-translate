-- Users tablosu
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    organization TEXT,
    role TEXT DEFAULT 'user',  -- 'user' | 'admin' | 'enterprise'
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Jobs tablosuna user_id ve ek alanlar ekleme
ALTER TABLE jobs 
    ADD COLUMN user_id UUID REFERENCES users(id),
    ADD COLUMN original_file_name TEXT,
    ADD COLUMN file_size_bytes BIGINT,
    ADD COLUMN page_count INT,
    ADD COLUMN percentage INT DEFAULT 0,
    ADD COLUMN current_page INT,
    ADD COLUMN current_step TEXT,  -- 'detecting_language' | 'analyzing_layout' | 'translating' | 'finalizing'
    ADD COLUMN estimated_time_remaining_sec INT,
    ADD COLUMN engine_version TEXT DEFAULT 'v1.0',
    ADD COLUMN completed_at TIMESTAMPTZ;

-- Çeviri cache tablosu
CREATE TABLE translation_cache (
    source_hash TEXT PRIMARY KEY,
    source_lang TEXT,
    target_lang TEXT,
    source_text TEXT,
    translated_text TEXT,
    engine TEXT,           -- 'deepl' | 'claude'
    created_at TIMESTAMPTZ DEFAULT now()
);

-- User settings tablosu
CREATE TABLE user_settings (
    user_id UUID PRIMARY KEY REFERENCES users(id),
    default_target_lang TEXT DEFAULT 'TR',
    default_engine TEXT DEFAULT 'auto',    -- 'auto' | 'deepl' | 'claude'
    formality TEXT DEFAULT 'default',      -- 'default' | 'formal' | 'informal'
    auto_detect_lang BOOLEAN DEFAULT true,
    bilingual_diagrams BOOLEAN DEFAULT true,
    latex_rendering BOOLEAN DEFAULT true,
    glossary_extraction BOOLEAN DEFAULT true,
    email_notifications BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexler
CREATE INDEX idx_jobs_user_id ON jobs(user_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX idx_translation_cache_langs ON translation_cache(source_lang, target_lang);
