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

    // Garantir que a tabela existe — tenta criar se não existir
    const { error: tableCheckError } = await supabase.from('app_users').select('id').limit(1);
    if (tableCheckError && tableCheckError.code === '42P01') {
      // Tabela não existe, cria via Management API
      const projectRef = supabaseUrl.replace('https://', '').split('.')[0];
      await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`
        },
        body: JSON.stringify({
          query: `
            CREATE TABLE IF NOT EXISTS app_users (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              name TEXT NOT NULL,
              email TEXT NOT NULL UNIQUE,
              plan TEXT NOT NULL DEFAULT 'trial',
              duration INTEGER NOT NULL DEFAULT 30,
              purchase_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
              expiration_date TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
              active BOOLEAN NOT NULL DEFAULT true,
              status TEXT NOT NULL DEFAULT 'trial',
              quiz_answers JSONB,
              quiz_completed BOOLEAN NOT NULL DEFAULT false,
              created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
              updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
            CREATE INDEX IF NOT EXISTS app_users_email_idx ON app_users(email);
            ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;
          `
        })
      }).catch(() => null);
      // Pequena pausa para a tabela ser criada
      await new Promise(r => setTimeout(r, 500));
    }

    // Verificar se email já existe
    const { data: existing } = await supabase
      .from('app_users')
      .select('id, email, name, plan, duration, expiration_date, active, quiz_completed')
      .ilike('email', normalizedEmail)
      .single();

    if (existing) {
      // Usuário já existe - retorna dados existentes
      const now = new Date();
      const expirationDate = new Date(existing.expiration_date);
      const daysRemaining = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      if (now > expirationDate || !existing.active) {
        return NextResponse.json(
          { success: false, error: 'Este email já está cadastrado mas o acesso expirou. Entre em contato com o suporte.' },
          { status: 409, headers: corsHeaders }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Usuário já cadastrado',
        alreadyExists: true,
        data: {
          id: existing.id,
          name: existing.name,
          email: existing.email,
          plan: existing.plan,
          duration: existing.duration,
          expirationDate: existing.expiration_date,
          active: existing.active,
          quizCompleted: existing.quiz_completed,
          daysRemaining
        }
      }, { headers: corsHeaders });
    }

    // Calcular datas do trial de 30 dias
    const now = new Date();
    const expirationDate = new Date(now);
    expirationDate.setDate(expirationDate.getDate() + 30);

    // Inserir novo usuário
    const { data: newUser, error: insertError } = await supabase
      .from('app_users')
      .insert({
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
      console.error('[REGISTER-USER] Erro ao inserir:', insertError);
      // Tenta tratar conflito de email
      if (insertError.code === '23505') {
        return NextResponse.json(
          { success: false, error: 'Este email já está cadastrado. Use o botão "Já tenho conta" para acessar.' },
          { status: 409, headers: corsHeaders }
        );
      }
      return NextResponse.json(
        { success: false, error: 'Erro ao criar conta. Tente novamente.' },
        { status: 500, headers: corsHeaders }
      );
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
