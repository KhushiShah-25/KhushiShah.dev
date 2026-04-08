-- Enable Row Level Security (RLS) for all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

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
