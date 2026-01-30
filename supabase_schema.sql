CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  avatar TEXT,
  currency TEXT DEFAULT 'MXN',
  net_worth NUMERIC DEFAULT 0,
  monthly_income NUMERIC DEFAULT 0,
  first_million_goal NUMERIC DEFAULT 0,
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE envelopes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  icon TEXT,
  color TEXT,
  title TEXT NOT NULL,
  type TEXT,
  val NUMERIC DEFAULT 0,
  tot NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'MXN',
  msg TEXT,
  warn BOOLEAN DEFAULT FALSE,
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  balance NUMERIC DEFAULT 0,
  asset_type TEXT NOT NULL,
  type TEXT NOT NULL,
  apy NUMERIC,
  color TEXT,
  label TEXT,
  subtitle TEXT,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  icon TEXT,
  color TEXT,
  title TEXT NOT NULL,
  target_year TEXT,
  status TEXT,
  saved NUMERIC DEFAULT 0,
  target_amount NUMERIC DEFAULT 0,
  is_focused BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE envelopes ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- Envelopes policies
CREATE POLICY "Users can view own envelopes." ON envelopes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own envelopes." ON envelopes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own envelopes." ON envelopes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own envelopes." ON envelopes FOR DELETE USING (auth.uid() = user_id);

-- Accounts policies
CREATE POLICY "Users can view own accounts." ON accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own accounts." ON accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own accounts." ON accounts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own accounts." ON accounts FOR DELETE USING (auth.uid() = user_id);

-- Goals policies
CREATE POLICY "Users can view own goals." ON goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goals." ON goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals." ON goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goals." ON goals FOR DELETE USING (auth.uid() = user_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar)
  VALUES (new.id, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
