-- Garantir que a tabela app_users existe com todos os campos
CREATE TABLE IF NOT EXISTS app_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  plan TEXT NOT NULL DEFAULT 'trial',
  duration INTEGER NOT NULL DEFAULT 30,
  purchase_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expiration_date TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
  active BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'trial',
  quiz_answers JSONB,
  quiz_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS app_users_email_idx ON app_users(email);

ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'app_users' AND policyname = 'Service role full access'
  ) THEN
    CREATE POLICY "Service role full access" ON app_users
      FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Tabela de dias de tratamento por usuário
CREATE TABLE IF NOT EXISTS treatment_days (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL CHECK (week_number BETWEEN 1 AND 13),
  day_number INTEGER,
  observation TEXT DEFAULT '',
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, week_number)
);

CREATE INDEX IF NOT EXISTS treatment_days_user_idx ON treatment_days(user_id);

ALTER TABLE treatment_days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on treatment_days" ON treatment_days
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Tabela de imagens de evolução por semana
CREATE TABLE IF NOT EXISTS evolution_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL CHECK (week_number BETWEEN 1 AND 13),
  image_url TEXT,
  image_base64 TEXT,
  observation TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, week_number)
);

CREATE INDEX IF NOT EXISTS evolution_images_user_idx ON evolution_images(user_id);

ALTER TABLE evolution_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on evolution_images" ON evolution_images
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_app_users_updated_at
  BEFORE UPDATE ON app_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_treatment_days_updated_at
  BEFORE UPDATE ON treatment_days
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_evolution_images_updated_at
  BEFORE UPDATE ON evolution_images
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
