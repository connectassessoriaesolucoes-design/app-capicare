-- =========================================
-- CORRIGIR CONSTRAINT UNIQUE PARA EMAIL
-- =========================================
-- Garante que não haverá duplicatas de email
-- =========================================

-- Primeiro, remover duplicatas se existirem (mantém apenas a mais recente)
DELETE FROM public.purchases a
USING public.purchases b
WHERE a.id < b.id
  AND LOWER(a.email) = LOWER(b.email);

-- Adicionar constraint UNIQUE no email (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS idx_purchases_email_unique
ON public.purchases (LOWER(email));

-- Verificar quantas compras existem por email
SELECT
  LOWER(email) as email_normalizado,
  COUNT(*) as total_compras,
  MAX(created_at) as ultima_compra
FROM public.purchases
GROUP BY LOWER(email)
ORDER BY ultima_compra DESC;
