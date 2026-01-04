// Script de teste para verificar conexão com Supabase e registros na tabela purchases
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

async function testSupabaseConnection() {
  console.log('🔍 ========================================');
  console.log('🔍 TESTE DE CONEXÃO SUPABASE');
  console.log('🔍 ========================================\n');

  // Verificar variáveis de ambiente
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  console.log('📋 Variáveis de Ambiente:');
  console.log('  SUPABASE_URL:', supabaseUrl ? '✅ Configurada' : '❌ Não configurada');
  console.log('  SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Configurada' : '❌ Não configurada');
  console.log('  SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Configurada' : '❌ Não configurada');
  console.log('');

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Variáveis de ambiente não configuradas corretamente');
    console.error('❌ Certifique-se de que o arquivo .env.local existe e está configurado');
    process.exit(1);
  }

  console.log('🔌 URL do Supabase:', supabaseUrl);
  console.log('');

  try {
    // Criar cliente Supabase
    console.log('🔧 Criando cliente Supabase...');
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    console.log('✅ Cliente Supabase criado com sucesso\n');

    // Testar conexão listando tabelas
    console.log('📊 Testando conexão com banco de dados...');
    const { data: tables, error: tablesError } = await supabase
      .from('purchases')
      .select('*', { count: 'exact', head: true });

    if (tablesError) {
      console.error('❌ Erro ao conectar com tabela purchases:', tablesError);
      console.error('❌ Código:', tablesError.code);
      console.error('❌ Mensagem:', tablesError.message);
      console.error('❌ Detalhes:', tablesError.details);
      console.error('❌ Hint:', tablesError.hint);
      console.log('');
      console.log('⚠️  A tabela "purchases" pode não existir ou você não tem permissão para acessá-la');
      process.exit(1);
    }

    console.log('✅ Conexão com banco de dados bem-sucedida\n');

    // Buscar todos os registros da tabela purchases
    console.log('📋 Buscando registros na tabela purchases...');
    const { data: purchases, error: selectError, count } = await supabase
      .from('purchases')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (selectError) {
      console.error('❌ Erro ao buscar registros:', selectError);
      process.exit(1);
    }

    console.log('✅ Total de registros encontrados:', count || 0);
    console.log('');

    if (!purchases || purchases.length === 0) {
      console.log('⚠️  Nenhuma compra registrada no banco de dados');
      console.log('⚠️  Isso significa que o webhook da Kirvano ainda não registrou nenhuma compra');
      console.log('');
      console.log('📝 Para resolver:');
      console.log('   1. Verifique se o webhook está configurado corretamente na Kirvano');
      console.log('   2. Faça uma compra de teste');
      console.log('   3. Verifique os logs do webhook em /api/kirvano-webhook');
    } else {
      console.log('📦 Compras registradas:');
      console.log('');
      purchases.forEach((purchase, index) => {
        console.log(`   ${index + 1}. Email: ${purchase.email}`);
        console.log(`      Plano: ${purchase.plan}`);
        console.log(`      Duração: ${purchase.duration} dias`);
        console.log(`      Status: ${purchase.status}`);
        console.log(`      Ativo: ${purchase.active ? '✅ Sim' : '❌ Não'}`);
        console.log(`      Data de compra: ${purchase.purchase_date}`);
        console.log(`      Data de expiração: ${purchase.expiration_date}`);
        console.log(`      Criado em: ${purchase.created_at}`);
        console.log('');
      });

      // Testar validação de acesso para o primeiro email
      if (purchases.length > 0) {
        const testEmail = purchases[0].email;
        console.log('🧪 Testando validação de acesso para:', testEmail);

        const { data: testResult, error: testError } = await supabase
          .from('purchases')
          .select('*')
          .ilike('email', testEmail)
          .eq('active', true)
          .order('created_at', { ascending: false });

        if (testError) {
          console.error('❌ Erro ao validar acesso:', testError);
        } else if (!testResult || testResult.length === 0) {
          console.log('❌ Nenhum acesso ativo encontrado para este email');
        } else {
          console.log('✅ Acesso validado com sucesso!');
          console.log('✅ O endpoint /api/verify-access deve funcionar para este email');
        }
      }
    }

    console.log('');
    console.log('🎉 ========================================');
    console.log('🎉 TESTE CONCLUÍDO');
    console.log('🎉 ========================================');

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

testSupabaseConnection();
