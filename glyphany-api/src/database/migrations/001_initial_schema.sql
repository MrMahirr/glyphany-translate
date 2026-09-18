CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    status TEXT DEFAULT 'queued',   -- queued | processing | done | failed
    source_pdf_path TEXT,
    target_lang TEXT,
    detected_source_lang TEXT,
    output_pdf_path TEXT,
    output_json_path TEXT,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE page_paragraph_map (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES jobs(id),
    page_number INT,
    paragraph_order INT,
    original_text TEXT,
    translated_text TEXT
);
