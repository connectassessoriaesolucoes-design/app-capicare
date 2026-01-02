-- =========================================
-- CRIAR TABELA DE COMPRAS (PURCHASES)
-- =========================================
-- Esta tabela armazena todas as compras/acessos dos usuários
-- =========================================

-- Criar a tabela purchases se não existir
CREATE TABLE IF NOT EXISTS public.purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'basic',
  duration INTEGER NOT NULL DEFAULT 30,
  purchase_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expiration_date TIMESTAMPTZ NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'approved',
  payment_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Criar índice para busca rápida por email (case-insensitive)
CREATE INDEX IF NOT EXISTS idx_purchases_email ON public.purchases (LOWER(email));

-- Criar índice para busca por status ativo
CREATE INDEX IF NOT EXISTS idx_purchases_active ON public.purchases (active);

-- Criar índice composto para busca por email + active
CREATE INDEX IF NOT EXISTS idx_purchases_email_active ON public.purchases (LOWER(email), active);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Política: Permitir leitura apenas do próprio email
CREATE POLICY "Usuários podem ver apenas suas próprias compras"
ON public.purchases
FOR SELECT
USING (LOWER(auth.jwt()->>'email') = LOWER(email));

-- Política: Service role pode fazer tudo (usado pela API)
CREATE POLICY "Service role tem acesso total"
ON public.purchases
FOR ALL
USING (auth.role() = 'service_role');

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_purchases_updated_at
BEFORE UPDATE ON public.purchases
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir dados de exemplo para teste
INSERT INTO public.purchases (email, plan, duration, purchase_date, expiration_date, active, status)
VALUES
  ('teste@example.com', 'premium', 90, NOW(), NOW() + INTERVAL '90 days', true, 'approved'),
  ('demo@example.com', 'basic', 30, NOW(), NOW() + INTERVAL '30 days', true, 'approved')
ON CONFLICT DO NOTHING;

-- Visualizar as compras criadas
SELECT
  id,
  email,
  plan,
  duration,
  purchase_date,
  expiration_date,
  active,
  status,
  created_at
FROM public.purchases
ORDER BY created_at DESC;
