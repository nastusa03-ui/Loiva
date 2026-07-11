CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  country_code TEXT NOT NULL DEFAULT 'US',
  language TEXT NOT NULL DEFAULT 'en',
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  theme TEXT NOT NULL DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  memory_enabled BOOLEAN NOT NULL DEFAULT false,
  communication_prefs JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- user_api_keys
CREATE TABLE user_api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('openai', 'anthropic', 'google', 'mistral', 'deepseek', 'custom')),
  model TEXT NOT NULL,
  key_encrypted TEXT NOT NULL,
  key_hint TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, provider)
);

ALTER TABLE user_api_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own API keys" ON user_api_keys FOR ALL USING (auth.uid() = user_id);

-- conversations
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  mode TEXT NOT NULL CHECK (mode IN ('listen', 'calm', 'sort', 'next_step')),
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  safety_tier TEXT NOT NULL DEFAULT 'normal',
  is_archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own conversations" ON conversations FOR ALL USING (auth.uid() = user_id);
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_updated_at ON conversations(updated_at DESC);

-- messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  safety_tier TEXT,
  tokens_used INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own messages" ON messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM conversations WHERE conversations.id = messages.conversation_id AND conversations.user_id = auth.uid())
);
CREATE POLICY "Users can insert own messages" ON messages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM conversations WHERE conversations.id = messages.conversation_id AND conversations.user_id = auth.uid())
);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);

-- check_ins
CREATE TABLE check_ins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mood INTEGER NOT NULL CHECK (mood BETWEEN 1 AND 5),
  tension INTEGER NOT NULL CHECK (tension BETWEEN 1 AND 5),
  energy INTEGER NOT NULL CHECK (energy BETWEEN 1 AND 5),
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own check-ins" ON check_ins FOR ALL USING (auth.uid() = user_id);
CREATE INDEX idx_check_ins_user_date ON check_ins(user_id, created_at DESC);

-- techniques (public read-only)
CREATE TABLE techniques (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('breathing', 'grounding', 'cognitive', 'behavioral', 'mindfulness', 'compassion')),
  title_en TEXT NOT NULL,
  title_ru TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_ru TEXT NOT NULL,
  steps_en JSONB NOT NULL,
  steps_ru JSONB NOT NULL,
  duration_seconds INTEGER,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium')),
  safety_notes_en TEXT,
  safety_notes_ru TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- favorites
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('technique', 'message')),
  item_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, item_type, item_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own favorites" ON favorites FOR ALL USING (auth.uid() = user_id);

-- habits
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'custom')),
  custom_days INTEGER[],
  completed_dates DATE[] DEFAULT '{}',
  is_paused BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own habits" ON habits FOR ALL USING (auth.uid() = user_id);

-- memory_entries
CREATE TABLE memory_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('preference', 'pattern', 'goal', 'context')),
  content TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('user_explicit', 'inferred', 'chat_derived')),
  confidence NUMERIC(3,2) CHECK (confidence BETWEEN 0 AND 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE memory_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own memory" ON memory_entries FOR ALL USING (auth.uid() = user_id);
CREATE INDEX idx_memory_user_type ON memory_entries(user_id, category);

-- crisis_resources (public)
CREATE TABLE crisis_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country_code TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  text_number TEXT,
  website TEXT,
  available_hours TEXT NOT NULL DEFAULT '24/7',
  languages TEXT[] NOT NULL DEFAULT ARRAY['en'],
  is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX idx_crisis_country ON crisis_resources(country_code);

-- updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_api_keys_updated_at BEFORE UPDATE ON user_api_keys FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_habits_updated_at BEFORE UPDATE ON habits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_memory_entries_updated_at BEFORE UPDATE ON memory_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
