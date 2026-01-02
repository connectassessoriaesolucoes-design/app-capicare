import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Configurações de runtime do Next.js
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// Configuração de CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
};

// OPTIONS - Preflight CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// GET - Health check
export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/verify-access',
    method: 'POST',
    timestamp: new Date().toISOString(),
    supabaseConfigured: !!(supabaseUrl && supabaseServiceKey),
    env: {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseServiceKey
    }
  }, { headers: corsHeaders });
}

// POST - Verificar se usuário tem acesso válido
export async function POST(request: NextRequest) {
  try {
    // Criar cliente Supabase com SERVICE ROLE KEY (bypass RLS)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ [VERIFY-ACCESS] Variáveis de ambiente não configuradas');
      return NextResponse.json(
        { success: false, error: 'Configuração do servidor incompleta' },
        { status: 500, headers: corsHeaders }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const body = await request.json();
    const { email } = body;

    console.log('🔍 [VERIFY-ACCESS] ========================================');
    console.log('🔍 [VERIFY-ACCESS] Email recebido:', email);

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email é obrigatório' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Normalizar email
    const normalizedEmail = email.toLowerCase().trim();
    console.log('🔍 [VERIFY-ACCESS] Email normalizado:', normalizedEmail);

    // Buscar compra no Supabase
    console.log('🔍 [VERIFY-ACCESS] Buscando no Supabase...');
    const { data: purchases, error } = await supabase
      .from('purchases')
      .select('*')
      .ilike('email', normalizedEmail)
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ [VERIFY-ACCESS] Erro ao buscar:', error);
      return NextResponse.json(
        { success: false, error: 'Erro ao verificar acesso no banco de dados' },
        { status: 500, headers: corsHeaders }
      );
    }

    console.log('🔍 [VERIFY-ACCESS] Resultado da busca:', purchases);
    console.log('🔍 [VERIFY-ACCESS] Total de compras encontradas:', purchases?.length || 0);

    if (!purchases || purchases.length === 0) {
      console.log('❌ [VERIFY-ACCESS] Nenhuma compra encontrada para:', normalizedEmail);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Acesso não encontrado. Verifique se você usou o mesmo email da compra ou se o pagamento foi aprovado.' 
        },
        { status: 404, headers: corsHeaders }
      );
    }

    // Pegar compra mais recente
    const user = purchases[0];
    console.log('✅ [VERIFY-ACCESS] Compra encontrada:', {
      id: user.id,
      email: user.email,
      plan: user.plan,
      duration: user.duration,
      expirationDate: user.expiration_date,
      active: user.active
    });

    // Verificar expiração
    const now = new Date();
    const expirationDate = new Date(user.expiration_date);
    const daysRemaining = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    console.log('⏰ [VERIFY-ACCESS] Data atual:', now.toISOString());
    console.log('⏰ [VERIFY-ACCESS] Data de expiração:', expirationDate.toISOString());
    console.log('⏰ [VERIFY-ACCESS] Dias restantes:', daysRemaining);

    if (now > expirationDate) {
      console.log('❌ [VERIFY-ACCESS] Acesso expirado');
      return NextResponse.json(
        { success: false, error: 'Seu acesso expirou. Entre em contato para renovar.' },
        { status: 403, headers: corsHeaders }
      );
    }

    console.log('✅ [VERIFY-ACCESS] Acesso válido confirmado!');
    console.log('✅ [VERIFY-ACCESS] ========================================');

    return NextResponse.json({
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
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('❌ [VERIFY-ACCESS] Erro crítico:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao verificar acesso' },
      { status: 500, headers: corsHeaders }
    );
  }
}
