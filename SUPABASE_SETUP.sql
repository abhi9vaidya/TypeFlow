-- Create a table for test results
CREATE TABLE test_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_email TEXT,
  wpm NUMERIC NOT NULL,
  raw_wpm NUMERIC NOT NULL,
  accuracy NUMERIC NOT NULL,
  consistency NUMERIC NOT NULL,
  mode TEXT NOT NULL,
  duration NUMERIC NOT NULL,
  word_count INTEGER,
  chars JSONB NOT NULL,
  samples JSONB NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert their own results" 
ON test_results FOR INSERT  
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own results" 
ON test_results FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own results" 
ON test_results FOR DELETE 
USING (auth.uid() = user_id);

-- Create an index for faster queries
CREATE INDEX idx_test_results_user_id ON test_results(user_id);
CREATE INDEX idx_test_results_timestamp ON test_results(timestamp DESC);

-- Create a table for user profiles if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nickname TEXT UNIQUE NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  wpm_best NUMERIC DEFAULT 0,
  tests_completed INTEGER DEFAULT 0,
  last_active TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- Storage bucket for avatars (run this in Supabase SQL editor)
-- insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);

-- Storage policies for avatars
-- DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
-- CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
-- DROP POLICY IF EXISTS "Anyone can upload an avatar" ON storage.objects;
-- CREATE POLICY "Anyone can upload an avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars');
-- DROP POLICY IF EXISTS "Anyone can update their own avatar" ON storage.objects;
-- CREATE POLICY "Anyone can update their own avatar" ON storage.objects FOR UPDATE WITH CHECK (bucket_id = 'avatars');
