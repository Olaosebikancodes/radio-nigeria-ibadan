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

ALTER TABLE stations      ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE programmes    ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff         ENABLE ROW LEVEL SECURITY;

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

INSERT INTO stations (name, slug, frequency, tagline, location, color_hex, sort_order) VALUES
  ('Premier 93.5 FM',   'premier-93-5',   '93.5',  'Your Dependable Companion', 'Ibadan, Oyo State',    '#1A6B9A', 1),
  ('Amuludun 99.1 FM',  'amuludun-99-1',  '99.1',  'O Tawonyo — Stand Out',     'Ibadan, Oyo State',    '#8B5E3C', 2),
  ('Paramount 94.5 FM', 'paramount-94-5', '94.5',  'The Voice of Ogun State',   'Abeokuta, Ogun State', '#5A3B9A', 3),
  ('Positive 102.5 FM', 'positive-102-5', '102.5', 'Stay Positive',              'Ondo State',           '#1B7A4A', 4),
  ('Gold 95.5 FM',      'gold-95-5',      '95.5',  'Pure Gold',                  'Ilesa, Osun State',    '#B8860B', 5),
  ('Progress 105.5 FM', 'progress-105-5', '105.5', 'Moving Forward',             'Southwest Zone',       '#8B2020', 6),
  ('Choice 95.9 FM',    'choice-95-9',    '95.9',  'Your First Choice',          'Southwest Zone',       '#2D6A4F', 7)
ON CONFLICT (slug) DO NOTHING;
