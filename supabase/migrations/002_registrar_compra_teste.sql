-- =========================================
-- REGISTRAR COMPRA DE TESTE
-- =========================================
-- Execute este script para registrar a compra real feita
-- Email: dudasouzamarquesbd@gmail.com
-- =========================================

-- Deletar compras antigas deste email (se existirem)
DELETE FROM public.purchases
WHERE LOWER(email) = LOWER('dudasouzamarquesbd@gmail.com');

-- Inserir nova compra para o email de teste
INSERT INTO public.purchases (
  email,
  plan,
  duration,
  purchase_date,
  expiration_date,
  active,
  status,
  payment_id
)
VALUES (
  'dudasouzamarquesbd@gmail.com',
  'App CapiCare Premium 90 Dias',
  90,
  NOW(),
  NOW() + INTERVAL '90 days',
  true,
  'approved',
  'test-purchase-' || EXTRACT(EPOCH FROM NOW())::TEXT
);

-- Verificar se a compra foi registrada
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
WHERE email = 'dudasouzamarquesbd@gmail.com';
