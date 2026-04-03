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

    // Verificar se usuário já existe no Auth
    const { data: listData } = await supabase.auth.admin.listUsers();
    const existingAuthUser = listData?.users?.find(
      u => u.email?.toLowerCase() === normalizedEmail
    );

    if (existingAuthUser) {
      const meta = existingAuthUser.user_metadata || {};
      const expDate = meta.expiration_date ? new Date(meta.expiration_date) : expirationDate;
      const daysRemaining = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      if (now > expDate) {
        return NextResponse.json(
          { success: false, error: 'Este email já está cadastrado mas o acesso expirou. Use o botão "Já tenho conta" para acessar.' },
          { status: 409, headers: corsHeaders }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Usuário já cadastrado',
        alreadyExists: true,
        data: {
          id: existingAuthUser.id,
          name: meta.name || normalizedName,
          email: normalizedEmail,
          plan: meta.plan || 'trial',
          duration: meta.duration || 30,
          expirationDate: expDate.toISOString(),
          active: true,
          quizCompleted: meta.quiz_completed || false,
          daysRemaining
        }
      }, { headers: corsHeaders });
    }

    // Criar novo usuário via Auth Admin API
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
      console.error('[REGISTER-USER] Auth error:', authError);
      return NextResponse.json(
        { success: false, error: 'Erro ao criar conta. Tente novamente.' },
        { status: 500, headers: corsHeaders }
      );
    }

    // Tentar salvar também na tabela app_users (se existir)
    try {
      await supabase.from('app_users').insert({
        id: authData.user.id,
        name: normalizedName,
        email: normalizedEmail,
        plan: 'trial',
        duration: 30,
        purchase_date: now.toISOString(),
        expiration_date: expirationDate.toISOString(),
        active: true,
        status: 'trial',
        quiz_completed: false
      });
    } catch {
      // Tabela pode não existir ainda — ok, usamos user_metadata como fallback
    }

    return NextResponse.json({
      success: true,
      message: 'Conta criada com sucesso! Você tem 30 dias grátis.',
      data: {
        id: authData.user.id,
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

  } catch (error) {
    console.error('[REGISTER-USER] Erro crítico:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500, headers: corsHeaders }
    );
  }
}
