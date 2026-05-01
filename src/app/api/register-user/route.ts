import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Nome e email são obrigatórios' },
        { status: 400, headers: corsHeaders }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedName = name.trim();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('[REGISTER-USER] Variáveis de ambiente ausentes');
      return NextResponse.json(
        { success: false, error: 'Configuração do banco de dados não encontrada' },
        { status: 503, headers: corsHeaders }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const now = new Date();
    const expirationDate = new Date(now);
    expirationDate.setDate(expirationDate.getDate() + 30);

    // 1. Verificar se já existe na tabela app_users
    const { data: existingUser } = await supabase
      .from('app_users')
      .select('*')
      .ilike('email', normalizedEmail)
      .single();

    if (existingUser) {
      const expDate = existingUser.expiration_date ? new Date(existingUser.expiration_date) : expirationDate;
      const daysRemaining = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      return NextResponse.json({
        success: true,
        message: 'Usuário já cadastrado',
        alreadyExists: true,
        data: {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          plan: existingUser.plan || 'trial',
          duration: existingUser.duration || 30,
          expirationDate: existingUser.expiration_date,
          active: existingUser.active,
          quizCompleted: existingUser.quiz_completed || false,
          daysRemaining: Math.max(0, daysRemaining)
        }
      }, { headers: corsHeaders });
    }

    // 2. Verificar se já existe no Auth
    const { data: listData } = await supabase.auth.admin.listUsers();
    const existingAuthUser = listData?.users?.find(
      u => u.email?.toLowerCase() === normalizedEmail
    );

    let authUserId: string;

    if (existingAuthUser) {
      authUserId = existingAuthUser.id;
    } else {
      // 3. Criar no Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: normalizedEmail,
        email_confirm: true,
        user_metadata: {
          name: normalizedName,
          plan: 'trial',
          duration: 30,
          purchase_date: now.toISOString(),
          expiration_date: expirationDate.toISOString(),
          active: true,
          status: 'trial',
          quiz_completed: false,
        }
      });

      if (authError || !authData?.user) {
        console.error('[REGISTER-USER] Erro ao criar no Auth:', authError);
        return NextResponse.json(
          { success: false, error: 'Erro ao criar conta. Tente novamente.' },
          { status: 500, headers: corsHeaders }
        );
      }

      authUserId = authData.user.id;
    }

    // 4. Salvar na tabela app_users
    const { data: newUser, error: insertError } = await supabase
      .from('app_users')
      .insert({
        id: authUserId,
        name: normalizedName,
        email: normalizedEmail,
        plan: 'trial',
        duration: 30,
        purchase_date: now.toISOString(),
        expiration_date: expirationDate.toISOString(),
        active: true,
        status: 'trial',
        quiz_completed: false
      })
      .select()
      .single();

    if (insertError) {
      console.error('[REGISTER-USER] Erro ao inserir em app_users:', insertError);
      // Mesmo se falhar o insert na tabela, o usuário já existe no Auth — retorna sucesso
      return NextResponse.json({
        success: true,
        message: 'Conta criada com sucesso! Você tem 30 dias grátis.',
        data: {
          id: authUserId,
          name: normalizedName,
          email: normalizedEmail,
          plan: 'trial',
          duration: 30,
          expirationDate: expirationDate.toISOString(),
          active: true,
          quizCompleted: false,
          daysRemaining: 30
        }
      }, { headers: corsHeaders });
    }

    return NextResponse.json({
      success: true,
      message: 'Conta criada com sucesso! Você tem 30 dias grátis.',
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        plan: newUser.plan,
        duration: newUser.duration,
        expirationDate: newUser.expiration_date,
        active: newUser.active,
        quizCompleted: newUser.quiz_completed,
        daysRemaining: 30
      }
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('[REGISTER-USER] Erro crítico:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor. Tente novamente.' },
      { status: 500, headers: corsHeaders }
    );
  }
}
