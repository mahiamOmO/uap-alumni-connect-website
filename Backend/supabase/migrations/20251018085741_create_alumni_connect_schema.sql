/*
  # Alumni Connect Database Schema

  ## Overview
  Complete database schema for UAP Alumni Connect platform with user profiles, events, jobs, and social features.

  ## Tables Created

  ### 1. profiles
  Extended user profile information linked to auth.users
  - `id` (uuid, primary key, references auth.users)
  - `full_name` (text)
  - `email` (text, unique)
  - `graduation_year` (integer)
  - `department` (text)
  - `degree` (text) - Bachelor's, Master's, PhD
  - `current_company` (text)
  - `current_position` (text)
  - `bio` (text)
  - `profile_picture_url` (text)
  - `linkedin_url` (text)
  - `github_url` (text)
  - `location` (text)
  - `phone` (text)
  - `is_verified` (boolean)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. events
  Alumni events, reunions, and meetups
  - `id` (uuid, primary key)
  - `title` (text)
  - `description` (text)
  - `event_date` (timestamptz)
  - `location` (text)
  - `event_type` (text) - reunion, workshop, seminar, meetup
  - `organizer_id` (uuid, references profiles)
  - `max_attendees` (integer)
  - `image_url` (text)
  - `is_online` (boolean)
  - `meeting_link` (text)
  - `status` (text) - upcoming, ongoing, completed, cancelled
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. event_registrations
  Track who registered for events
  - `id` (uuid, primary key)
  - `event_id` (uuid, references events)
  - `user_id` (uuid, references profiles)
  - `registration_date` (timestamptz)
  - `status` (text) - registered, attended, cancelled

  ### 4. jobs
  Job postings and opportunities
  - `id` (uuid, primary key)
  - `title` (text)
  - `company` (text)
  - `description` (text)
  - `job_type` (text) - full-time, part-time, contract, internship
  - `location` (text)
  - `is_remote` (boolean)
  - `salary_range` (text)
  - `requirements` (text)
  - `posted_by` (uuid, references profiles)
  - `application_url` (text)
  - `application_email` (text)
  - `expires_at` (timestamptz)
  - `status` (text) - active, closed, filled
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 5. posts
  Social feed posts from alumni
  - `id` (uuid, primary key)
  - `author_id` (uuid, references profiles)
  - `content` (text)
  - `image_url` (text)
  - `post_type` (text) - update, achievement, question, announcement
  - `likes_count` (integer)
  - `comments_count` (integer)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 6. post_likes
  Track post likes
  - `id` (uuid, primary key)
  - `post_id` (uuid, references posts)
  - `user_id` (uuid, references profiles)
  - `created_at` (timestamptz)

  ### 7. post_comments
  Comments on posts
  - `id` (uuid, primary key)
  - `post_id` (uuid, references posts)
  - `author_id` (uuid, references profiles)
  - `content` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Authenticated users can read most public data
  - Users can only modify their own data
  - Event organizers can manage their events
  - Job posters can manage their job listings

  ## Indexes
  - Created indexes on foreign keys for performance
  - Created indexes on commonly queried fields (graduation_year, event_date, job status)
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  graduation_year integer,
  department text DEFAULT 'CSE',
  degree text,
  current_company text,
  current_position text,
  bio text,
  profile_picture_url text,
  linkedin_url text,
  github_url text,
  location text,
  phone text,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_date timestamptz NOT NULL,
  location text,
  event_type text DEFAULT 'meetup',
  organizer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  max_attendees integer,
  image_url text,
  is_online boolean DEFAULT false,
  meeting_link text,
  status text DEFAULT 'upcoming',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create event_registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  registration_date timestamptz DEFAULT now(),
  status text DEFAULT 'registered',
  UNIQUE(event_id, user_id)
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company text NOT NULL,
  description text,
  job_type text DEFAULT 'full-time',
  location text,
  is_remote boolean DEFAULT false,
  salary_range text,
  requirements text,
  posted_by uuid REFERENCES profiles(id) ON DELETE CASCADE,
  application_url text,
  application_email text,
  expires_at timestamptz,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  image_url text,
  post_type text DEFAULT 'update',
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create post_likes table
CREATE TABLE IF NOT EXISTS post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Create post_comments table
CREATE TABLE IF NOT EXISTS post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_graduation_year ON profiles(graduation_year);
CREATE INDEX IF NOT EXISTS idx_profiles_department ON profiles(department);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user ON event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_posted_by ON jobs(posted_by);
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_post ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_post ON post_comments(post_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Events policies
CREATE POLICY "Events are viewable by everyone"
  ON events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Event organizers can update their events"
  ON events FOR UPDATE
  TO authenticated
  USING (auth.uid() = organizer_id)
  WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Event organizers can delete their events"
  ON events FOR DELETE
  TO authenticated
  USING (auth.uid() = organizer_id);

-- Event registrations policies
CREATE POLICY "Users can view event registrations"
  ON event_registrations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can register for events"
  ON event_registrations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can cancel their registrations"
  ON event_registrations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Jobs policies
CREATE POLICY "Jobs are viewable by everyone"
  ON jobs FOR SELECT
  TO authenticated
  USING (status = 'active');

CREATE POLICY "Authenticated users can post jobs"
  ON jobs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = posted_by);

CREATE POLICY "Job posters can update their jobs"
  ON jobs FOR UPDATE
  TO authenticated
  USING (auth.uid() = posted_by)
  WITH CHECK (auth.uid() = posted_by);

CREATE POLICY "Job posters can delete their jobs"
  ON jobs FOR DELETE
  TO authenticated
  USING (auth.uid() = posted_by);

-- Posts policies
CREATE POLICY "Posts are viewable by everyone"
  ON posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can delete their posts"
  ON posts FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Post likes policies
CREATE POLICY "Post likes are viewable by everyone"
  ON post_likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can like posts"
  ON post_likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike posts"
  ON post_likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Post comments policies
CREATE POLICY "Comments are viewable by everyone"
  ON post_comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can comment"
  ON post_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their comments"
  ON post_comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can delete their comments"
  ON post_comments FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_post_comments_updated_at BEFORE UPDATE ON post_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();