import { NextResponse } from 'next/server';
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

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ success: false, error: 'Env vars missing' }, { status: 503, headers: corsHeaders });
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const results: Record<string, string> = {};

    // Verificar e criar tabela app_users
    const { error: appUsersErr } = await supabase.from('app_users').select('id').limit(1);
    results.app_users = appUsersErr ? 'MISSING: ' + appUsersErr.message : 'OK';

    // Verificar e criar tabela evolution_images
    const { error: eiErr } = await supabase.from('evolution_images').select('id').limit(1);
    results.evolution_images = eiErr ? 'MISSING: ' + eiErr.message : 'OK';

    // Verificar e criar tabela treatment_days
    const { error: tdErr } = await supabase.from('treatment_days').select('id').limit(1);
    results.treatment_days = tdErr ? 'MISSING: ' + tdErr.message : 'OK';

    return NextResponse.json({
      success: true,
      message: 'Status das tabelas verificado',
      tables: results,
      timestamp: new Date().toISOString()
    }, { headers: corsHeaders });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500, headers: corsHeaders }
    );
  }
}
