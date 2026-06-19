-- ══════════════════════════════════════════════
-- Radio Nigeria Ibadan — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ══════════════════════════════════════════════

-- FM Stations
CREATE TABLE IF NOT EXISTS stations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  frequency   TEXT,
  tagline     TEXT,
  description TEXT,
  location    TEXT,
  stream_url  TEXT,
  cover_image TEXT,
  color_hex   TEXT DEFAULT '#005C2E',
  social_facebook  TEXT,
  social_twitter   TEXT,
  social_instagram TEXT,
  social_youtube   TEXT,
  active      BOOLEAN DEFAULT true,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- News Articles
CREATE TABLE IF NOT EXISTS articles (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  slug         TEXT UNIQUE NOT NULL,
  excerpt      TEXT,
  content      TEXT,
  cover_image  TEXT,
  category     TEXT DEFAULT 'general',
  station_id   UUID REFERENCES stations(id) ON DELETE SET NULL,
  published    BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  author_id    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

-- Programme Schedule
CREATE TABLE IF NOT EXISTS programmes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id   UUID NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  description  TEXT,
  host         TEXT,
  language     TEXT DEFAULT 'English',
  days         TEXT[] NOT NULL DEFAULT '{}',
  start_time   TIME NOT NULL,
  end_time     TIME NOT NULL,
  active       BOOLEAN DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- Audio / Podcast Content
CREATE TABLE IF NOT EXISTS audio_content (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  description  TEXT,
  audio_url    TEXT NOT NULL,
  cover_image  TEXT,
  station_id   UUID REFERENCES stations(id) ON DELETE SET NULL,
  programme_id UUID REFERENCES programmes(id) ON DELETE SET NULL,
  duration_sec INTEGER,
  published    BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- Contact Messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT NOT NULL,
  message    TEXT NOT NULL,
  read       BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Staff (linked to auth.users)
CREATE TABLE IF NOT EXISTS staff (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  role       TEXT NOT NULL DEFAULT 'editor',
  station_id UUID REFERENCES stations(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ══════════════════════════════════════════════
-- Row Level Security
-- ══════════════════════════════════════════════

ALTER TABLE stations         ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE programmes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_content    ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff            ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies before recreating (safe to re-run)
DROP POLICY IF EXISTS "Public insert contact"         ON contact_messages;
DROP POLICY IF EXISTS "Staff read contact"            ON contact_messages;
DROP POLICY IF EXISTS "Staff manage contact"          ON contact_messages;
DROP POLICY IF EXISTS "Public read stations"          ON stations;
DROP POLICY IF EXISTS "Public read articles"          ON articles;
DROP POLICY IF EXISTS "Public read programmes"        ON programmes;
DROP POLICY IF EXISTS "Public read audio"             ON audio_content;
DROP POLICY IF EXISTS "Staff full access articles"    ON articles;
DROP POLICY IF EXISTS "Staff full access programmes"  ON programmes;
DROP POLICY IF EXISTS "Staff full access audio"       ON audio_content;
DROP POLICY IF EXISTS "Staff full access stations"    ON stations;
DROP POLICY IF EXISTS "Staff read staff"              ON staff;
DROP POLICY IF EXISTS "Staff manage staff"            ON staff;

-- Anyone can submit a contact message
CREATE POLICY "Public insert contact" ON contact_messages FOR INSERT WITH CHECK (true);
-- Only authenticated staff can read messages
CREATE POLICY "Staff read contact"    ON contact_messages FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Staff manage contact"  ON contact_messages FOR UPDATE USING (auth.role() = 'authenticated');

-- Public can read active stations
CREATE POLICY "Public read stations" ON stations
  FOR SELECT USING (active = true);

-- Public can read published articles
CREATE POLICY "Public read articles" ON articles
  FOR SELECT USING (published = true);

-- Public can read active programmes
CREATE POLICY "Public read programmes" ON programmes
  FOR SELECT USING (active = true);

-- Public can read published audio
CREATE POLICY "Public read audio" ON audio_content
  FOR SELECT USING (published = true);

-- Authenticated staff can do everything
CREATE POLICY "Staff full access articles"      ON articles      FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Staff full access programmes"    ON programmes    FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Staff full access audio"         ON audio_content FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Staff full access stations"      ON stations      FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Staff read staff"                ON staff         FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Staff manage staff"              ON staff         FOR ALL USING (auth.role() = 'authenticated');

-- ══════════════════════════════════════════════
-- Supabase Storage Buckets
-- Run AFTER enabling Storage in your Supabase project
-- ══════════════════════════════════════════════

-- Create these buckets in Supabase Dashboard > Storage:
-- 1. "images"  — public, for article covers and audio covers
-- 2. "audio"   — public, for audio/podcast files

-- Then add these policies to each bucket (in Dashboard > Storage > Policies):
-- Allow public SELECT (read) on both buckets
-- Allow authenticated INSERT/UPDATE/DELETE on both buckets

-- ══════════════════════════════════════════════
-- Seed: FM Stations
-- ══════════════════════════════════════════════

-- Update existing stations (already inserted previously)
INSERT INTO stations (name, slug, frequency, tagline, location, color_hex, stream_url, cover_image, sort_order) VALUES
  ('Premier FM',         'premier-93-5',   '93.5',  'Your Dependable Companion', 'Ibadan, Oyo State',      '#1A6B9A', 'https://centova57.instainternet.com/proxy/premier?mp=/stream',   'https://tfxpqxxzopsycpnmdyke.supabase.co/storage/v1/object/public/images/Premier%20FM.png',   1),
  ('Amuludun 99.1 FM',  'amuludun-99-1',  '99.1',  'O ta won yo',               'Moniya, Ibadan',         '#8B5E3C', 'https://centova57.instainternet.com/proxy/amuludun?mp=/stream',  'https://tfxpqxxzopsycpnmdyke.supabase.co/storage/v1/object/public/images/Amuludun%20FM.png',  2),
  ('Paramount 94.5 FM', 'paramount-94-5', '94.5',  'Our integrity is paramount','Abeokuta, Ogun State',   '#5A3B9A', 'https://centova57.instainternet.com/proxy/paramount?mp=/stream', 'https://tfxpqxxzopsycpnmdyke.supabase.co/storage/v1/object/public/images/Paramount%20FM.png', 3),
  ('Positive 102.5 FM', 'positive-102-5', '102.5', 'The Positive Station',      'Akure, Ondo State',      '#C0392B', 'https://centova57.instainternet.com/proxy/positive?mp=/stream',  'https://tfxpqxxzopsycpnmdyke.supabase.co/storage/v1/object/public/images/Positive%20FM.png',  4),
  ('Progress 100.5 FM', 'progress-100-5', '100.5', 'Your Partner In Progress',  'Ado Ekiti, Ekiti State', '#8B2020', 'https://centova57.instainternet.com/proxy/progress?mp=/stream',  'https://tfxpqxxzopsycpnmdyke.supabase.co/storage/v1/object/public/images/Progress%20FM.png',  5),
  ('Gold 95.5 FM',      'gold-95-5',      '95.5',  'The Jewel of Osun State',   'Ilesha, Osun State',     '#B8860B', 'https://centova57.instainternet.com/proxy/gold?mp=/stream',      'https://tfxpqxxzopsycpnmdyke.supabase.co/storage/v1/object/public/images/Gold_FM.jpg-removebg-preview.png', 6),
  ('Ogo-Ilu 89.3 FM',   'ogo-ilu-89-3',   '89.3',  'The society''s pride',      'Oko, Anambra State',     '#2D7A3A', 'https://centova57.instainternet.com/proxy/ogoilu?mp=/stream',    'https://tfxpqxxzopsycpnmdyke.supabase.co/storage/v1/object/public/images/Ogo-Ilu%20FM.png',   7),
  ('Asabari 88.3 FM',   'asabari-88-3',   '88.3',  'Ti wan tiwa',               'Southwest Zone',         '#6B4A9A', 'https://centova57.instainternet.com/proxy/asabari?mp=/stream',   'https://tfxpqxxzopsycpnmdyke.supabase.co/storage/v1/object/public/images/Asabari%20FM.jpeg',  8)
ON CONFLICT (slug) DO UPDATE SET
  name         = EXCLUDED.name,
  frequency    = EXCLUDED.frequency,
  tagline      = EXCLUDED.tagline,
  location     = EXCLUDED.location,
  color_hex    = EXCLUDED.color_hex,
  stream_url   = EXCLUDED.stream_url,
  cover_image  = EXCLUDED.cover_image,
  sort_order   = EXCLUDED.sort_order;

-- Remove old stations that no longer exist
DELETE FROM stations WHERE slug IN ('progress-105-5', 'choice-95-9');

-- ══════════════════════════════════════════════
-- ══════════════════════════════════════════════
-- Adverts
-- ══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS adverts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  image_url   TEXT,
  link_url    TEXT,
  station_id  UUID REFERENCES stations(id) ON DELETE SET NULL,
  active      BOOLEAN DEFAULT true,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE adverts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read adverts"   ON adverts;
DROP POLICY IF EXISTS "Staff manage adverts"  ON adverts;

CREATE POLICY "Public read adverts"  ON adverts FOR SELECT USING (active = true);
CREATE POLICY "Staff manage adverts" ON adverts FOR ALL   USING (auth.role() = 'authenticated');

-- Migration: Add social media columns to stations
-- Run this in Supabase SQL Editor if upgrading an existing database
-- ══════════════════════════════════════════════
ALTER TABLE stations
  ADD COLUMN IF NOT EXISTS social_facebook  TEXT,
  ADD COLUMN IF NOT EXISTS social_twitter   TEXT,
  ADD COLUMN IF NOT EXISTS social_instagram TEXT,
  ADD COLUMN IF NOT EXISTS social_youtube   TEXT;
