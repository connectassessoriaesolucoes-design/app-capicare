import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Configurações de runtime do Next.js
export const runtime = 'nodejs';
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
    console.log('🚀 [VERIFY-ACCESS] Iniciando verificação...');

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

    // Verificar se Supabase está configurado
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    console.log('🔧 [VERIFY-ACCESS] Configurações:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseServiceKey,
      urlPrefix: supabaseUrl?.substring(0, 20) + '...'
    });

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ [VERIFY-ACCESS] Variáveis de ambiente não configuradas');
      console.error('❌ [VERIFY-ACCESS] SUPABASE_URL:', !!supabaseUrl);
      console.error('❌ [VERIFY-ACCESS] SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);

      return NextResponse.json(
        {
          success: false,
          error: 'Sistema temporariamente indisponível. Entre em contato com o suporte.',
          details: 'Configuração do banco de dados não encontrada'
        },
        { status: 503, headers: corsHeaders }
      );
    }

    // Criar cliente Supabase com SERVICE ROLE KEY (bypass RLS)
    let supabase;
    try {
      supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      });
      console.log('✅ [VERIFY-ACCESS] Cliente Supabase criado com sucesso');
    } catch (clientError) {
      console.error('❌ [VERIFY-ACCESS] Erro ao criar cliente Supabase:', clientError);
      return NextResponse.json(
        {
          success: false,
          error: 'Erro ao conectar com o banco de dados',
          details: clientError instanceof Error ? clientError.message : String(clientError)
        },
        { status: 500, headers: corsHeaders }
      );
    }

    let userData: Record<string, unknown> | null = null;

    // 1. Buscar na tabela app_users (principal)
    console.log('🔍 [VERIFY-ACCESS] Buscando em app_users...');
    try {
      const { data: appUser } = await supabase
        .from('app_users')
        .select('*')
        .ilike('email', normalizedEmail)
        .single();

      if (appUser) {
        userData = appUser;
        console.log('✅ [VERIFY-ACCESS] Encontrado em app_users');
      }
    } catch {
      // tabela pode não existir, ignora
    }

    // 2. Fallback: buscar no Auth Admin (usuários registrados via register-user)
    if (!userData) {
      console.log('🔍 [VERIFY-ACCESS] Buscando no Auth...');
      try {
        const { data: listData } = await supabase.auth.admin.listUsers();
        const authUser = listData?.users?.find(
          u => u.email?.toLowerCase() === normalizedEmail
        );

        if (authUser) {
          const meta = authUser.user_metadata || {};
          userData = {
            id: authUser.id,
            email: normalizedEmail,
            name: meta.name || '',
            plan: meta.plan || 'trial',
            duration: meta.duration || 30,
            purchase_date: meta.purchase_date || authUser.created_at,
            expiration_date: meta.expiration_date,
            active: meta.active !== false,
            status: meta.status || 'trial',
            quiz_completed: meta.quiz_completed || false,
          };
          console.log('✅ [VERIFY-ACCESS] Encontrado no Auth');
        }
      } catch (authErr) {
        console.error('❌ [VERIFY-ACCESS] Erro no Auth:', authErr);
      }
    }

    // 3. Fallback legado: tabela purchases
    if (!userData) {
      console.log('🔍 [VERIFY-ACCESS] Buscando em purchases (legado)...');
      try {
        const { data: purchases } = await supabase
          .from('purchases')
          .select('*')
          .ilike('email', normalizedEmail)
          .eq('active', true)
          .order('created_at', { ascending: false });

        if (purchases && purchases.length > 0) {
          userData = purchases[0];
          console.log('✅ [VERIFY-ACCESS] Encontrado em purchases');
        }
      } catch {
        // tabela não existe, ignora
      }
    }

    if (!userData) {
      console.log('❌ [VERIFY-ACCESS] Usuário não encontrado:', normalizedEmail);
      return NextResponse.json(
        { success: false, error: 'Acesso não encontrado. Verifique se você usou o mesmo email do cadastro.' },
        { status: 404, headers: corsHeaders }
      );
    }

    const userEmail = userData.email as string;
    const userPlan = userData.plan as string;
    const userDuration = userData.duration as number;
    const userActive = userData.active as boolean;
    const userStatus = userData.status as string;
    const userPurchaseDate = userData.purchase_date as string;
    const userExpirationDate = userData.expiration_date as string;
    const userQuizCompleted = userData.quiz_completed as boolean | undefined;

    // Verificar expiração
    const now = new Date();

    if (!userExpirationDate) {
      // Sem data de expiração: acesso válido (compra vitalícia ou trial sem expiração)
      return NextResponse.json({
        success: true,
        message: 'Acesso válido',
        data: {
          email: userEmail, plan: userPlan, duration: userDuration,
          purchaseDate: userPurchaseDate, expirationDate: null,
          active: true, status: userStatus, quizCompleted: userQuizCompleted ?? false,
          daysRemaining: 999
        }
      }, { headers: corsHeaders });
    }

    const expirationDate = new Date(userExpirationDate);
    const daysRemaining = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (now > expirationDate || !userActive) {
      console.log('❌ [VERIFY-ACCESS] Acesso expirado ou inativo');
      return NextResponse.json(
        { success: false, error: 'Seu acesso expirou. Entre em contato para renovar.' },
        { status: 403, headers: corsHeaders }
      );
    }

    console.log('✅ [VERIFY-ACCESS] Acesso válido!');
    return NextResponse.json({
      success: true,
      message: 'Acesso válido',
      data: {
        email: userEmail, plan: userPlan, duration: userDuration,
        purchaseDate: userPurchaseDate, expirationDate: userExpirationDate,
        active: userActive, status: userStatus,
        quizCompleted: userQuizCompleted ?? false, daysRemaining
      }
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('❌ [VERIFY-ACCESS] Erro crítico:', error);
    console.error('❌ [VERIFY-ACCESS] Stack:', error instanceof Error ? error.stack : 'N/A');
    console.error('❌ [VERIFY-ACCESS] Message:', error instanceof Error ? error.message : String(error));
    console.error('❌ [VERIFY-ACCESS] Type:', typeof error);
    console.error('❌ [VERIFY-ACCESS] Error object:', JSON.stringify(error, null, 2));

    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor ao verificar acesso',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
