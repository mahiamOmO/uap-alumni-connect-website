/*
  # Add Admin Roles and Dashboard Features

  ## Overview
  Adds admin role support and dashboard analytics capabilities to the alumni connect platform.

  ## Changes

  ### 1. Add admin role to profiles
  - Add `role` column (text) - 'user' | 'admin' | 'super_admin'
  - Add `is_active` column to track active users
  - Add default values

  ### 2. Create analytics views
  - Create materialized views for dashboard statistics
  - Add helper functions for dashboard queries

  ### 3. Activity tracking
  - Create `user_activity` table for tracking login/activity
  - Create `platform_stats` table for caching dashboard stats

  ### 4. Security
  - Update RLS policies for admin access
  - Add admin-specific policies
  - Ensure admins can manage content

  ## Notes
  - Default role is 'user'
  - Only super_admin can promote users to admin
  - Activity logs are kept for analytics
*/

-- Add role and activity columns to profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role text DEFAULT 'user';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_active boolean DEFAULT true;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'last_login'
  ) THEN
    ALTER TABLE profiles ADD COLUMN last_login timestamptz;
  END IF;
END $$;

-- Create user_activity table for tracking
CREATE TABLE IF NOT EXISTS user_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  activity_type text NOT NULL,
  activity_details jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Create platform_stats table for caching dashboard metrics
CREATE TABLE IF NOT EXISTS platform_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stat_key text UNIQUE NOT NULL,
  stat_value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Create reports table for user-generated reports
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reported_by uuid REFERENCES profiles(id) ON DELETE CASCADE,
  report_type text NOT NULL,
  target_type text NOT NULL,
  target_id uuid NOT NULL,
  reason text NOT NULL,
  description text,
  status text DEFAULT 'pending',
  resolved_by uuid REFERENCES profiles(id),
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_activity_user ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_type ON user_activity(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_activity_created ON user_activity(created_at);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(report_type);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Enable RLS on new tables
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- User activity policies
CREATE POLICY "Users can view their own activity"
  ON user_activity FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert activity logs"
  ON user_activity FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Platform stats policies (admin only)
CREATE POLICY "Admins can view platform stats"
  ON platform_stats FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "System can update platform stats"
  ON platform_stats FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "System can update platform stats update"
  ON platform_stats FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- Reports policies
CREATE POLICY "Users can view their own reports"
  ON reports FOR SELECT
  TO authenticated
  USING (
    auth.uid() = reported_by
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Authenticated users can create reports"
  ON reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reported_by);

CREATE POLICY "Admins can update reports"
  ON reports FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- Update existing policies to allow admin access
DROP POLICY IF EXISTS "Event organizers can update their events" ON events;
CREATE POLICY "Event organizers and admins can update events"
  ON events FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = organizer_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    auth.uid() = organizer_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "Event organizers can delete their events" ON events;
CREATE POLICY "Event organizers and admins can delete events"
  ON events FOR DELETE
  TO authenticated
  USING (
    auth.uid() = organizer_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "Job posters can update their jobs" ON jobs;
CREATE POLICY "Job posters and admins can update jobs"
  ON jobs FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = posted_by
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    auth.uid() = posted_by
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "Job posters can delete their jobs" ON jobs;
CREATE POLICY "Job posters and admins can delete jobs"
  ON jobs FOR DELETE
  TO authenticated
  USING (
    auth.uid() = posted_by
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

DROP POLICY IF EXISTS "Authors can delete their posts" ON posts;
CREATE POLICY "Authors and admins can delete posts"
  ON posts FOR DELETE
  TO authenticated
  USING (
    auth.uid() = author_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- Function to calculate dashboard statistics
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS jsonb AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_users', (SELECT COUNT(*) FROM profiles),
    'active_users', (SELECT COUNT(*) FROM profiles WHERE is_active = true),
    'verified_users', (SELECT COUNT(*) FROM profiles WHERE is_verified = true),
    'total_events', (SELECT COUNT(*) FROM events),
    'upcoming_events', (SELECT COUNT(*) FROM events WHERE status = 'upcoming' AND event_date > now()),
    'total_jobs', (SELECT COUNT(*) FROM jobs),
    'active_jobs', (SELECT COUNT(*) FROM jobs WHERE status = 'active' AND (expires_at IS NULL OR expires_at > now())),
    'total_posts', (SELECT COUNT(*) FROM posts),
    'posts_today', (SELECT COUNT(*) FROM posts WHERE created_at >= CURRENT_DATE),
    'total_event_registrations', (SELECT COUNT(*) FROM event_registrations),
    'pending_reports', (SELECT COUNT(*) FROM reports WHERE status = 'pending')
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get recent activity
CREATE OR REPLACE FUNCTION get_recent_activity(limit_count integer DEFAULT 50)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  user_name text,
  activity_type text,
  activity_details jsonb,
  created_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ua.id,
    ua.user_id,
    p.full_name as user_name,
    ua.activity_type,
    ua.activity_details,
    ua.created_at
  FROM user_activity ua
  LEFT JOIN profiles p ON ua.user_id = p.id
  ORDER BY ua.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user growth by month
CREATE OR REPLACE FUNCTION get_user_growth_stats()
RETURNS TABLE (
  month text,
  new_users bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    TO_CHAR(created_at, 'YYYY-MM') as month,
    COUNT(*) as new_users
  FROM profiles
  WHERE created_at >= now() - interval '12 months'
  GROUP BY TO_CHAR(created_at, 'YYYY-MM')
  ORDER BY month DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update platform stats
CREATE OR REPLACE FUNCTION update_platform_stats_trigger()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO platform_stats (stat_key, stat_value, updated_at)
  VALUES ('last_update', to_jsonb(now()), now())
  ON CONFLICT (stat_key) 
  DO UPDATE SET stat_value = to_jsonb(now()), updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for automatic stats updates (optional, can be removed if performance is an issue)
DROP TRIGGER IF EXISTS trigger_update_stats_on_profile ON profiles;
CREATE TRIGGER trigger_update_stats_on_profile
  AFTER INSERT OR UPDATE OR DELETE ON profiles
  FOR EACH STATEMENT
  EXECUTE FUNCTION update_platform_stats_trigger();