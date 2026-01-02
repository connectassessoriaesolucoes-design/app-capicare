-- =========================================
-- VERIFICAR SISTEMA DE COMPRAS
-- =========================================
-- Execute este script para verificar se tudo está funcionando
-- =========================================

-- 1. Verificar se a tabela purchases existe e está acessível
SELECT 'Tabela purchases existe!' as status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'purchases';

-- 2. Contar total de compras
SELECT
  COUNT(*) as total_compras,
  COUNT(CASE WHEN active = true THEN 1 END) as compras_ativas,
  COUNT(CASE WHEN active = false THEN 1 END) as compras_inativas
FROM public.purchases;

-- 3. Listar todas as compras (máximo 10 mais recentes)
SELECT
  id,
  email,
  plan,
  duration,
  TO_CHAR(purchase_date, 'DD/MM/YYYY HH24:MI') as data_compra,
  TO_CHAR(expiration_date, 'DD/MM/YYYY HH24:MI') as data_expiracao,
  CASE
    WHEN expiration_date > NOW() THEN '✅ Ativo'
    ELSE '❌ Expirado'
  END as validade,
  active,
  status,
  TO_CHAR(created_at, 'DD/MM/YYYY HH24:MI') as criado_em
FROM public.purchases
ORDER BY created_at DESC
LIMIT 10;

-- 4. Verificar a compra específica de teste
SELECT
  '🎯 COMPRA DE TESTE ENCONTRADA!' as resultado,
  email,
  plan,
  duration,
  expiration_date,
  CASE
    WHEN expiration_date > NOW() THEN '✅ VÁLIDO'
    ELSE '❌ EXPIRADO'
  END as status_acesso,
  EXTRACT(DAY FROM (expiration_date - NOW())) as dias_restantes
FROM public.purchases
WHERE LOWER(email) = LOWER('dudasouzamarquesbd@gmail.com')
LIMIT 1;

-- 5. Verificar índices criados
SELECT
  indexname as nome_indice,
  indexdef as definicao
FROM pg_indexes
WHERE tablename = 'purchases'
  AND schemaname = 'public'
ORDER BY indexname;

-- 6. Verificar políticas RLS
SELECT
  policyname as politica,
  cmd as comando,
  qual as condicao
FROM pg_policies
WHERE tablename = 'purchases'
  AND schemaname = 'public';

-- ✅ Se todos os SELECTs retornarem dados, o sistema está 100% funcional!
