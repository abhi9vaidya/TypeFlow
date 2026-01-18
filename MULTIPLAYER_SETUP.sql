-- 1. Create Tables
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nickname TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  wpm_best NUMERIC DEFAULT 0,
  tests_completed INTEGER DEFAULT 0,
  last_active TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.follows (
  follower_id UUID NOT NULL,
  following_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT follows_follower_id_fkey FOREIGN KEY (follower_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT follows_following_id_fkey FOREIGN KEY (following_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (follower_id, following_id)
);

CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  host_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'lobby',
  mode TEXT DEFAULT 'words',
  config JSONB DEFAULT '{}',
  target_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  starts_at TIMESTAMPTZ,
  is_private BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS public.room_participants (
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  progress NUMERIC DEFAULT 0,
  wpm NUMERIC DEFAULT 0,
  is_ready BOOLEAN DEFAULT FALSE,
  finished_at TIMESTAMPTZ,
  PRIMARY KEY (room_id, user_id)
);

-- 2. Enable Row Level Security
-- Note: All RLS policies should be configured via Supabase dashboard
-- This avoids SQL parser compatibility issues

-- 3. Functions & Triggers
-- Note: Create this trigger function via Supabase dashboard SQL editor
/*
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nickname, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'nickname', split_part(new.email, '@', 1) || floor(random()*1000)::text),
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
*/

-- 4. Realtime Setup
-- Note: Configure via Supabase dashboard under Database > Replication
-- Enable realtime for: profiles, rooms, room_participants tables
