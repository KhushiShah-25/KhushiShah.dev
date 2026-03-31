-- ═══════════════════════════════════════════
--  Khushi Shah Portfolio — Database Schema
-- ═══════════════════════════════════════════

-- Run with: psql -U postgres -d khushi_portfolio -f schema.sql

CREATE TABLE IF NOT EXISTS projects (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(120)     NOT NULL,
  description TEXT             NOT NULL,
  category    VARCHAR(60)      DEFAULT 'Full Stack',
  stack       TEXT[]           DEFAULT '{}',
  live_url    TEXT,
  repo_url    TEXT,
  emoji       VARCHAR(10)      DEFAULT '💻',
  featured    BOOLEAN          DEFAULT false,
  created_at  TIMESTAMPTZ      DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS testimonials (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(80)  NOT NULL,
  role        VARCHAR(120) NOT NULL,
  initials    VARCHAR(4)   NOT NULL,
  rating      SMALLINT     DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  body        TEXT         NOT NULL,
  created_at  TIMESTAMPTZ  DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(80)  NOT NULL,
  email       VARCHAR(200) NOT NULL,
  subject     VARCHAR(120),
  message     TEXT         NOT NULL,
  read        BOOLEAN      DEFAULT false,
  created_at  TIMESTAMPTZ  DEFAULT NOW()
);

-- ─── Seed data ───────────────────────────────

INSERT INTO projects (title, description, category, stack, emoji, featured) VALUES
  ('E-Commerce Platform',
   'Full-stack e-commerce app with product listings, cart, authentication, and PostgreSQL backend.',
   'Full Stack',
   ARRAY['React', 'Node.js', 'Express', 'PostgreSQL'],
   '🛒', true),

  ('Task Management App',
   'Kanban-style productivity app with drag-and-drop, built in React with local storage persistence.',
   'Frontend',
   ARRAY['React.js', 'CSS', 'JavaScript'],
   '📋', true),

  ('Auth REST API',
   'Secure authentication system using Node.js + Express with JWT tokens and PostgreSQL user management.',
   'Backend',
   ARRAY['Node.js', 'Express.js', 'JWT', 'PostgreSQL'],
   '🔐', true),

  ('DSA Visualizer',
   'Interactive visualizer for data structures and sorting algorithms built while learning C++ DSA.',
   'Algorithm',
   ARRAY['JavaScript', 'HTML', 'CSS', 'C++'],
   '📊', true)
ON CONFLICT DO NOTHING;

INSERT INTO testimonials (name, role, initials, body) VALUES
  ('Rahul Sharma',
   '// Project Mentor, Bennett University',
   'RS',
   'Khushi has an incredible eye for detail and a strong grasp of both frontend and backend technologies. She delivered clean, well-structured code every time.'),

  ('Arjun Patel',
   '// Classmate & Co-developer',
   'AP',
   'Great collaborator — quick to pick up new concepts and always brings energy to the team. Her React skills really elevated our project.')
ON CONFLICT DO NOTHING;
