-- ==============================================================================
-- ADDON: Admin Activity Logs Table
-- Run this in your Supabase SQL Editor to add the required table for the Dashboard
-- ==============================================================================

CREATE TABLE admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL,
  target_id TEXT,
  target_name TEXT,
  performed_by TEXT DEFAULT 'Admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for querying recent activity efficiently
CREATE INDEX idx_admin_activity_logs_created_at ON admin_activity_logs(created_at DESC);

-- Enable RLS
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- Admins have full access
CREATE POLICY "Admins have full access to admin_activity_logs" ON admin_activity_logs
FOR ALL USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'is_admin' = 'true');

-- We also want to enable Realtime for activity logs so the dashboard updates live
BEGIN;
  ALTER PUBLICATION supabase_realtime ADD TABLE admin_activity_logs;
COMMIT;
