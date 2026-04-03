import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, answers, treatmentLevel } = body;

    if (!email || !answers) {
      return NextResponse.json(
        { success: false, error: 'Email e respostas são obrigatórios' },
        { status: 400, headers: corsHeaders }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { success: false, error: 'Configuração não encontrada' },
        { status: 503, headers: corsHeaders }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const { error } = await supabase
      .from('app_users')
      .update({
        quiz_answers: answers,
        quiz_completed: true,
        updated_at: new Date().toISOString()
      })
      .ilike('email', email.toLowerCase().trim());

    if (error) {
      console.error('[SAVE-QUIZ] Erro:', error);
      return NextResponse.json(
        { success: false, error: 'Erro ao salvar respostas' },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Respostas salvas com sucesso',
      treatmentLevel: treatmentLevel || 'intermediário'
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('[SAVE-QUIZ] Erro crítico:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500, headers: corsHeaders }
    );
  }
}
