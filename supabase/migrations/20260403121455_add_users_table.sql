-- Tabela de usuários cadastrados no app
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

-- Index para busca por email
CREATE INDEX IF NOT EXISTS app_users_email_idx ON app_users(email);

-- RLS
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;

-- Política: service role pode tudo
CREATE POLICY "service_role_all" ON app_users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_app_users_updated_at
  BEFORE UPDATE ON app_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
