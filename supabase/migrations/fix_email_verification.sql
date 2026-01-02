-- ATENÇÃO: Este script usa auth.users que é protegido.
-- Você deve executar isso diretamente no Supabase Dashboard > SQL Editor
-- com permissões de administrador.

-- Atualizar todos os usuários para marcar email como confirmado
-- REMOVIDO: confirmed_at (coluna gerada automaticamente)
UPDATE auth.users
SET
  email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
  updated_at = NOW(),
  raw_app_meta_data = raw_app_meta_data || '{"email_verified": true}'::jsonb
WHERE email_confirmed_at IS NULL;

-- Verificar quantos emails foram atualizados
SELECT
  COUNT(*) as total_usuarios,
  COUNT(email_confirmed_at) as emails_verificados,
  COUNT(*) - COUNT(email_confirmed_at) as emails_nao_verificados
FROM auth.users;

-- Listar todos os usuários com status de verificação
SELECT
  id,
  email,
  email_confirmed_at,
  confirmed_at,
  created_at,
  CASE
    WHEN email_confirmed_at IS NOT NULL THEN 'Verificado ✅'
    ELSE 'Não verificado ❌'
  END as status_email
FROM auth.users
ORDER BY created_at DESC;
