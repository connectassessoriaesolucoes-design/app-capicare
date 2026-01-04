// Script de teste para o endpoint /api/verify-access
const fs = require('fs');
const path = require('path');

// Carregar variáveis de ambiente manualmente
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=').replace(/^["']|["']$/g, '');
      process.env[key] = value;
    }
  });
}

const { createClient } = require('@supabase/supabase-js');

async function testVerifyAccessAPI() {
  console.log('🧪 ========================================');
  console.log('🧪 TESTE DO ENDPOINT /api/verify-access');
  console.log('🧪 ========================================\n');

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Variáveis de ambiente não configuradas');
    process.exit(1);
  }

  console.log('🔧 Criando cliente Supabase...');
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  // Email de teste (usar o primeiro registro do banco)
  const testEmail = 'dudasouzamarquesbd@gmail.com';

  console.log('📧 Email de teste:', testEmail);
  console.log('');

  try {
    // SIMULAR O QUE A API /api/verify-access FAZ

    console.log('🔍 ETAPA 1: Normalizar email');
    const normalizedEmail = testEmail.toLowerCase().trim();
    console.log('   Email normalizado:', normalizedEmail);
    console.log('');

    console.log('🔍 ETAPA 2: Buscar no Supabase');
    console.log('   Query: SELECT * FROM purchases WHERE email ILIKE', normalizedEmail, 'AND active = true');

    const { data: purchases, error } = await supabase
      .from('purchases')
      .select('*')
      .ilike('email', normalizedEmail)
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('   ❌ Erro na query:', error);
      console.error('   ❌ Código:', error.code);
      console.error('   ❌ Mensagem:', error.message);
      console.error('   ❌ Detalhes:', error.details);
      console.error('   ❌ Hint:', error.hint);
      console.log('');
      console.log('⚠️  PROBLEMA ENCONTRADO: Erro ao executar query no Supabase');
      console.log('⚠️  O endpoint /api/verify-access retornará erro 500');
      process.exit(1);
    }

    console.log('   ✅ Query executada com sucesso');
    console.log('   📊 Registros encontrados:', purchases?.length || 0);
    console.log('');

    if (!purchases || purchases.length === 0) {
      console.log('❌ PROBLEMA ENCONTRADO: Nenhuma compra ativa encontrada');
      console.log('❌ O endpoint /api/verify-access retornará erro 404');
      console.log('');
      console.log('📝 Dados encontrados na query:');
      console.log(purchases);
      process.exit(1);
    }

    const user = purchases[0];
    console.log('📦 ETAPA 3: Compra encontrada');
    console.log('   ID:', user.id);
    console.log('   Email:', user.email);
    console.log('   Plano:', user.plan);
    console.log('   Duração:', user.duration, 'dias');
    console.log('   Status:', user.status);
    console.log('   Ativo:', user.active ? '✅' : '❌');
    console.log('   Data de compra:', user.purchase_date);
    console.log('   Data de expiração:', user.expiration_date);
    console.log('');

    console.log('⏰ ETAPA 4: Verificar expiração');
    const now = new Date();
    const expirationDate = new Date(user.expiration_date);
    const daysRemaining = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    console.log('   Data atual:', now.toISOString());
    console.log('   Data de expiração:', expirationDate.toISOString());
    console.log('   Dias restantes:', daysRemaining);
    console.log('');

    if (now > expirationDate) {
      console.log('❌ PROBLEMA ENCONTRADO: Acesso expirado');
      console.log('❌ O endpoint /api/verify-access retornará erro 403');
      process.exit(1);
    }

    console.log('✅ ========================================');
    console.log('✅ TESTE PASSOU! ACESSO VÁLIDO');
    console.log('✅ ========================================');
    console.log('');
    console.log('📋 Resposta esperada da API:');
    console.log(JSON.stringify({
      success: true,
      message: 'Acesso válido',
      data: {
        email: user.email,
        plan: user.plan,
        duration: user.duration,
        purchaseDate: user.purchase_date,
        expirationDate: user.expiration_date,
        active: user.active,
        status: user.status,
        daysRemaining
      }
    }, null, 2));
    console.log('');

    console.log('🎯 CONCLUSÃO:');
    console.log('   ✅ O endpoint /api/verify-access DEVE funcionar corretamente');
    console.log('   ✅ O Supabase está respondendo corretamente');
    console.log('   ✅ O email tem acesso válido no banco de dados');
    console.log('');
    console.log('⚠️  Se o sistema NÃO está liberando acesso, o problema pode ser:');
    console.log('   1. O servidor Next.js não está rodando (execute: npm run dev)');
    console.log('   2. Problema no frontend ao chamar a API');
    console.log('   3. CORS ou outro erro de rede');
    console.log('   4. As variáveis de ambiente não estão disponíveis no ambiente de produção');

  } catch (error) {
    console.error('');
    console.error('❌ ========================================');
    console.error('❌ ERRO CRÍTICO NO TESTE');
    console.error('❌ ========================================');
    console.error('❌ Erro:', error.message);
    console.error('❌ Stack:', error.stack);
    process.exit(1);
  }
}

testVerifyAccessAPI();
