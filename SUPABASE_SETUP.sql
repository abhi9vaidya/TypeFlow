-- Create a table for test results
CREATE TABLE test_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  wpm INTEGER NOT NULL,
  raw_wpm INTEGER NOT NULL,
  accuracy INTEGER NOT NULL,
  consistency INTEGER NOT NULL,
  mode TEXT NOT NULL,
  duration INTEGER NOT NULL,
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
