-- ══════════════════════════════════════════════════════════════════
-- Khushi Shah Portfolio — Complete Database Setup
-- ══════════════════════════════════════════════════════════════════

-- 1. Table Creations
-- ══════════════════════════════════════════════════════════════════

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(120)     NOT NULL,
  description TEXT             NOT NULL,
  category    VARCHAR(60)      DEFAULT 'Full Stack',
  stack       TEXT[]           DEFAULT '{}',
  live_url    TEXT,
  repo_url    TEXT,
  emoji       VARCHAR(10)      DEFAULT '💻',
  photo_src   TEXT,
  featured    BOOLEAN          DEFAULT false,
  created_at  TIMESTAMPTZ      DEFAULT NOW()
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(80)  NOT NULL,
  role        VARCHAR(120) NOT NULL,
  initials    VARCHAR(4)   NOT NULL,
  rating      SMALLINT     DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  body        TEXT         NOT NULL,
  created_at  TIMESTAMPTZ  DEFAULT NOW()
);

-- Blog Posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id          SERIAL PRIMARY KEY,
  emoji       VARCHAR(10)  DEFAULT '📝',
  phase       VARCHAR(40)  DEFAULT '// phase_01',
  title       VARCHAR(120) NOT NULL,
  body        TEXT         NOT NULL,
  code        TEXT,
  stack       TEXT[]       DEFAULT '{}',
  published   BOOLEAN      DEFAULT true,
  created_at  TIMESTAMPTZ  DEFAULT NOW()
);

-- Contact Messages table
CREATE TABLE IF NOT EXISTS messages (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(80)  NOT NULL,
  email       VARCHAR(200) NOT NULL,
  subject     VARCHAR(120),
  message     TEXT         NOT NULL,
  read        BOOLEAN      DEFAULT false,
  created_at  TIMESTAMPTZ  DEFAULT NOW()
);

-- ══════════════════════════════════════════════════════════════════
-- 2. Security (Row Level Security - RLS) — Essential for Supabase Frontend Access
-- ══════════════════════════════════════════════════════════════════

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to avoid errors on re-run
DROP POLICY IF EXISTS "Allow public read access for projects" ON projects;
DROP POLICY IF EXISTS "Allow public read access for testimonials" ON testimonials;
DROP POLICY IF EXISTS "Allow public read access for blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Allow public insert for messages" ON messages;

-- 1. Projects: Allow everyone to read
CREATE POLICY "Allow public read access for projects"
ON projects FOR SELECT USING (true);

-- 2. Testimonials: Allow everyone to read
CREATE POLICY "Allow public read access for testimonials"
ON testimonials FOR SELECT USING (true);

-- 3. Blog Posts: Allow everyone to read 
CREATE POLICY "Allow public read access for blog posts"
ON blog_posts FOR SELECT USING (true);

-- 4. Messages: Allow everyone to SEND messages (Insert), but NO public read access
CREATE POLICY "Allow public insert for messages"
ON messages FOR INSERT WITH CHECK (true);
