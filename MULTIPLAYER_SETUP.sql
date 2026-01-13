-- 1. Create Tables
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nickname TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  wpm_best INTEGER DEFAULT 0,
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
  config JSONB DEFAULT '{}'::jsonb,
  target_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  starts_at TIMESTAMPTZ,
  is_private BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS public.room_participants (
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  wpm INTEGER DEFAULT 0,
  is_ready BOOLEAN DEFAULT FALSE,
  finished_at TIMESTAMPTZ,
  PRIMARY KEY (room_id, user_id)
);

-- 2. Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_participants ENABLE ROW LEVEL SECURITY;

-- 3. Profiles Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 4. Follows Policies
DROP POLICY IF EXISTS "Everyone can see follows" ON public.follows;
CREATE POLICY "Everyone can see follows" ON public.follows FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can follow others" ON public.follows;
CREATE POLICY "Users can follow others" ON public.follows FOR INSERT WITH CHECK (auth.uid() = follower_id);

DROP POLICY IF EXISTS "Users can unfollow others" ON public.follows;
CREATE POLICY "Users can unfollow others" ON public.follows FOR DELETE USING (auth.uid() = follower_id);

-- 5. Rooms Policies
DROP POLICY IF EXISTS "Anyone can see public rooms" ON public.rooms;
CREATE POLICY "Anyone can see public rooms" ON public.rooms FOR SELECT USING (NOT is_private OR status = 'lobby');

DROP POLICY IF EXISTS "Hosts can manage their rooms" ON public.rooms;
CREATE POLICY "Hosts can manage their rooms" ON public.rooms FOR ALL USING (auth.uid() = host_id);

DROP POLICY IF EXISTS "Participants can view their room" ON public.rooms;
CREATE POLICY "Participants can view their room" ON public.rooms FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.room_participants 
    WHERE room_id = public.rooms.id AND user_id = auth.uid()
  )
);

-- 6. Room Participants Policies
DROP POLICY IF EXISTS "Participants can see each other in rooms" ON public.room_participants;
CREATE POLICY "Participants can see each other in rooms" ON public.room_participants FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can join rooms" ON public.room_participants;
CREATE POLICY "Users can join rooms" ON public.room_participants FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own room progress" ON public.room_participants;
CREATE POLICY "Users can update their own room progress" ON public.room_participants FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can leave rooms" ON public.room_participants;
CREATE POLICY "Users can leave rooms" ON public.room_participants FOR DELETE USING (auth.uid() = user_id);

-- 7. Functions & Triggers
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

-- 8. Realtime Setup
DO $$
BEGIN
  -- Create publication if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;

  -- Safely add tables to publication
  -- profiles
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'profiles'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
  END IF;

  -- rooms
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'rooms'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE rooms;
  END IF;

  -- room_participants
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'room_participants'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE room_participants;
  END IF;
END $$;
