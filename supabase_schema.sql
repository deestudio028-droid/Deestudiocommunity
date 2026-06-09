-- ==============================================================================
-- 1. EXTENSIONS
-- ==============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. FUNCTIONS
-- ==============================================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-generate DS ID when a member is approved
CREATE OR REPLACE FUNCTION assign_ds_id()
RETURNS TRIGGER AS $$
DECLARE
  next_id_number INTEGER;
BEGIN
  -- Only assign if approved is true and ds_id is not already set
  IF NEW.approved = TRUE AND (OLD.approved IS NULL OR OLD.approved = FALSE) AND NEW.ds_id IS NULL THEN
    -- Find the highest existing DS ID number
    SELECT COALESCE(MAX(CAST(SUBSTRING(ds_id FROM 4) AS INTEGER)), 0) + 1
    INTO next_id_number
    FROM community_members
    WHERE ds_id LIKE 'DS-%' AND ds_id ~ '^DS-[0-9]+$';
    
    NEW.ds_id := 'DS-' || LPAD(next_id_number::TEXT, 3, '0');
    
    -- Set joined_at to now if it's not set
    IF NEW.joined_at IS NULL THEN
      NEW.joined_at := NOW();
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to handle pending application approval
CREATE OR REPLACE FUNCTION handle_pending_application_approval()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    -- Insert into community_members
    INSERT INTO community_members (
      id, full_name, youtube_username, email, country, approved
    ) VALUES (
      NEW.id, NEW.full_name, NEW.youtube_username, NEW.email, NEW.country, TRUE
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 3. TABLES
-- ==============================================================================

-- Table: community_members
CREATE TABLE community_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ds_id TEXT UNIQUE,
  full_name TEXT,
  youtube_username TEXT,
  email TEXT UNIQUE,
  country TEXT,
  profile_image_url TEXT,
  bio TEXT,
  joined_at TIMESTAMPTZ,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: community_stats
CREATE TABLE community_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: community_ideas
CREATE TABLE community_ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID REFERENCES community_members(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'accepted', 'rejected', 'implemented')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: community_challenges
CREATE TABLE community_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  points INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: challenge_submissions
CREATE TABLE challenge_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID REFERENCES community_challenges(id) ON DELETE CASCADE,
  member_id UUID REFERENCES community_members(id) ON DELETE CASCADE,
  submission_text TEXT,
  submission_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: admin_settings
CREATE TABLE admin_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT
);

-- Table: pending_applications
CREATE TABLE pending_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  youtube_username TEXT,
  email TEXT NOT NULL,
  country TEXT,
  subscription_screenshot_url TEXT,
  why_join TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. INDEXES
-- ==============================================================================

CREATE INDEX idx_community_members_ds_id ON community_members(ds_id);
CREATE INDEX idx_community_members_email ON community_members(email);
CREATE INDEX idx_community_members_approved ON community_members(approved);
CREATE INDEX idx_community_members_joined_at ON community_members(joined_at);

CREATE INDEX idx_community_ideas_member_id ON community_ideas(member_id);
CREATE INDEX idx_community_ideas_status ON community_ideas(status);

CREATE INDEX idx_challenge_submissions_challenge_id ON challenge_submissions(challenge_id);
CREATE INDEX idx_challenge_submissions_member_id ON challenge_submissions(member_id);

CREATE INDEX idx_pending_applications_status ON pending_applications(status);
CREATE INDEX idx_pending_applications_created_at ON pending_applications(created_at);

-- ==============================================================================
-- 5. TRIGGERS
-- ==============================================================================

-- updated_at triggers
CREATE TRIGGER set_updated_at_community_members
BEFORE UPDATE ON community_members
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_community_stats
BEFORE UPDATE ON community_stats
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_community_ideas
BEFORE UPDATE ON community_ideas
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_community_challenges
BEFORE UPDATE ON community_challenges
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_challenge_submissions
BEFORE UPDATE ON challenge_submissions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_pending_applications
BEFORE UPDATE ON pending_applications
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- DS ID trigger
CREATE TRIGGER generate_ds_id_on_approval
BEFORE INSERT OR UPDATE ON community_members
FOR EACH ROW EXECUTE FUNCTION assign_ds_id();

-- Pending Application to Member trigger
CREATE TRIGGER move_approved_application
AFTER UPDATE ON pending_applications
FOR EACH ROW EXECUTE FUNCTION handle_pending_application_approval();

-- ==============================================================================
-- 6. BUCKETS
-- ==============================================================================

INSERT INTO storage.buckets (id, name, public) VALUES ('community-uploads', 'community-uploads', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('subscription-screenshots', 'subscription-screenshots', false) ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 7. RLS POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_applications ENABLE ROW LEVEL SECURITY;

-- Helper function to check admin status (Assuming admins have a specific role or are defined in auth.users metadata, using a simple auth.uid() check pattern here, you may need to adjust based on your exact admin auth setup)
-- For this setup, we'll use a placeholder logic for admin: auth.jwt() -> 'role' = 'service_role' or a custom claim

-- community_members
CREATE POLICY "Public can select approved members" ON community_members
FOR SELECT USING (approved = TRUE);

CREATE POLICY "Admins have full access to community_members" ON community_members
FOR ALL USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'is_admin' = 'true');

-- community_ideas
CREATE POLICY "Public can read ideas" ON community_ideas
FOR SELECT USING (TRUE);

CREATE POLICY "Authenticated members can create ideas" ON community_ideas
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Owners can update own ideas" ON community_ideas
FOR UPDATE USING (auth.uid() = member_id);

CREATE POLICY "Admins have full access to community_ideas" ON community_ideas
FOR ALL USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'is_admin' = 'true');

-- pending_applications
CREATE POLICY "Public can insert pending applications" ON pending_applications
FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Admins can read update delete pending applications" ON pending_applications
FOR SELECT USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'is_admin' = 'true');

CREATE POLICY "Admins can update pending applications" ON pending_applications
FOR UPDATE USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'is_admin' = 'true');

CREATE POLICY "Admins can delete pending applications" ON pending_applications
FOR DELETE USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'is_admin' = 'true');

-- community_stats
CREATE POLICY "Public can read community_stats" ON community_stats
FOR SELECT USING (TRUE);

CREATE POLICY "Admins can write community_stats" ON community_stats
FOR ALL USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'is_admin' = 'true');

-- community_challenges
CREATE POLICY "Public can read community_challenges" ON community_challenges
FOR SELECT USING (TRUE);

CREATE POLICY "Admins have full access to community_challenges" ON community_challenges
FOR ALL USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'is_admin' = 'true');

-- challenge_submissions
CREATE POLICY "Public can read approved challenge_submissions" ON challenge_submissions
FOR SELECT USING (status = 'approved');

CREATE POLICY "Authenticated members can create submissions" ON challenge_submissions
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Owners can update own submissions" ON challenge_submissions
FOR UPDATE USING (auth.uid() = member_id);

CREATE POLICY "Admins have full access to challenge_submissions" ON challenge_submissions
FOR ALL USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'is_admin' = 'true');

-- admin_settings
CREATE POLICY "Admins have full access to admin_settings" ON admin_settings
FOR ALL USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'is_admin' = 'true');

-- Storage Policies: community-uploads
CREATE POLICY "Public read community-uploads" ON storage.objects
FOR SELECT USING (bucket_id = 'community-uploads');

CREATE POLICY "Authenticated upload community-uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'community-uploads' AND auth.uid() IS NOT NULL);

CREATE POLICY "Owner update community-uploads" ON storage.objects
FOR UPDATE USING (bucket_id = 'community-uploads' AND auth.uid() = owner);

CREATE POLICY "Owner delete community-uploads" ON storage.objects
FOR DELETE USING (bucket_id = 'community-uploads' AND auth.uid() = owner);

-- Storage Policies: subscription-screenshots
CREATE POLICY "Users can upload subscription-screenshots" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'subscription-screenshots');

CREATE POLICY "Admin can view subscription-screenshots" ON storage.objects
FOR SELECT USING (bucket_id = 'subscription-screenshots' AND (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'is_admin' = 'true'));

CREATE POLICY "Admin can delete subscription-screenshots" ON storage.objects
FOR DELETE USING (bucket_id = 'subscription-screenshots' AND (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'is_admin' = 'true'));

-- ==============================================================================
-- 8. SEED DATA & REALTIME
-- ==============================================================================

-- Seed Stats
INSERT INTO community_stats (key, value) VALUES ('projects_built', 0) ON CONFLICT (key) DO NOTHING;
INSERT INTO community_stats (key, value) VALUES ('community_challenges', 0) ON CONFLICT (key) DO NOTHING;
INSERT INTO community_stats (key, value) VALUES ('ideas_submitted', 0) ON CONFLICT (key) DO NOTHING;

-- Enable Realtime
-- Realtime publications configuration in Supabase is managed at the database level
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;
ALTER PUBLICATION supabase_realtime ADD TABLE community_members;
ALTER PUBLICATION supabase_realtime ADD TABLE community_ideas;
ALTER PUBLICATION supabase_realtime ADD TABLE community_challenges;
ALTER PUBLICATION supabase_realtime ADD TABLE community_stats;
