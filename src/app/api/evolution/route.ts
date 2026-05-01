import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabaseClient = SupabaseClient<any, any, any>;

function getSupabase(): AnySupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Configuração do banco de dados não encontrada');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}

async function getUserByEmail(supabase: AnySupabaseClient, email: string) {
  const { data: user } = await supabase
    .from('app_users')
    .select('id')
    .ilike('email', email)
    .single();
  return user as { id: string } | null;
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// GET - Buscar todas as semanas de evolução do usuário
export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email é obrigatório' },
        { status: 400, headers: corsHeaders }
      );
    }

    const supabase = getSupabase();
    const user = await getUserByEmail(supabase, email.toLowerCase().trim());

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuário não encontrado' },
        { status: 404, headers: corsHeaders }
      );
    }

    const { data: images } = await supabase
      .from('evolution_images')
      .select('week_number, image_base64, observation, updated_at')
      .eq('user_id', user.id)
      .order('week_number');

    // Montar array de 13 semanas
    const records = Array.from({ length: 13 }, (_, i) => {
      const week = i + 1;
      const found = images?.find(img => img.week_number === week);
      return {
        week,
        photo: found?.image_base64 || null,
        observation: found?.observation || '',
        updatedAt: found?.updated_at || null
      };
    });

    return NextResponse.json({ success: true, records }, { headers: corsHeaders });

  } catch (error) {
    console.error('[EVOLUTION GET] Erro:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar dados de evolução' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST - Salvar/atualizar semana de evolução
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, weekNumber, photo, observation } = body;

    if (!email || !weekNumber) {
      return NextResponse.json(
        { success: false, error: 'Email e número da semana são obrigatórios' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (weekNumber < 1 || weekNumber > 13) {
      return NextResponse.json(
        { success: false, error: 'Semana inválida (1-13)' },
        { status: 400, headers: corsHeaders }
      );
    }

    const supabase = getSupabase();
    const user = await getUserByEmail(supabase, email.toLowerCase().trim());

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuário não encontrado' },
        { status: 404, headers: corsHeaders }
      );
    }

    const upsertData: Record<string, unknown> = {
      user_id: user.id,
      week_number: weekNumber,
      observation: observation || '',
      updated_at: new Date().toISOString()
    };

    if (photo !== undefined) {
      upsertData.image_base64 = photo;
    }

    const { error } = await supabase
      .from('evolution_images')
      .upsert(upsertData, { onConflict: 'user_id,week_number' });

    if (error) {
      console.error('[EVOLUTION POST] Erro ao salvar:', error);
      return NextResponse.json(
        { success: false, error: 'Erro ao salvar dados' },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json({ success: true, message: 'Dados salvos com sucesso' }, { headers: corsHeaders });

  } catch (error) {
    console.error('[EVOLUTION POST] Erro crítico:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500, headers: corsHeaders }
    );
  }
}
