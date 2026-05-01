import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const CREATE_TABLES_SQL = `
-- Garantir que app_users existe
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

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'app_users' AND policyname = 'Service role full access'
  ) THEN
    CREATE POLICY "Service role full access" ON app_users FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Tabela de imagens de evolução
CREATE TABLE IF NOT EXISTS evolution_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL CHECK (week_number BETWEEN 1 AND 13),
  image_base64 TEXT,
  observation TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, week_number)
);

CREATE INDEX IF NOT EXISTS evolution_images_user_idx ON evolution_images(user_id);
ALTER TABLE evolution_images ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'evolution_images' AND policyname = 'Service role full access on evolution_images'
  ) THEN
    CREATE POLICY "Service role full access on evolution_images" ON evolution_images FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Tabela de dias de tratamento
CREATE TABLE IF NOT EXISTS treatment_days (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL CHECK (week_number BETWEEN 1 AND 13),
  day_number INTEGER,
  observation TEXT DEFAULT '',
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, week_number)
);

CREATE INDEX IF NOT EXISTS treatment_days_user_idx ON treatment_days(user_id);
ALTER TABLE treatment_days ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'treatment_days' AND policyname = 'Service role full access on treatment_days'
  ) THEN
    CREATE POLICY "Service role full access on treatment_days" ON treatment_days FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;
`;

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

    // Executar SQL de criação das tabelas via rpc
    const { error: sqlError } = await supabase.rpc('exec_sql', { sql: CREATE_TABLES_SQL });

    if (sqlError) {
      // Tentar verificar as tabelas individualmente
      const results: Record<string, string> = {};
      const { error: appErr } = await supabase.from('app_users').select('id').limit(1);
      results.app_users = appErr ? 'MISSING' : 'OK';
      const { error: eiErr } = await supabase.from('evolution_images').select('id').limit(1);
      results.evolution_images = eiErr ? 'MISSING - precisa criar manualmente' : 'OK';
      const { error: tdErr } = await supabase.from('treatment_days').select('id').limit(1);
      results.treatment_days = tdErr ? 'MISSING - precisa criar manualmente' : 'OK';

      return NextResponse.json({
        success: false,
        message: 'RPC não disponível. Status das tabelas:',
        tables: results,
        sql: CREATE_TABLES_SQL,
        sqlError: sqlError.message
      }, { headers: corsHeaders });
    }

    return NextResponse.json({
      success: true,
      message: 'Tabelas criadas/verificadas com sucesso',
      timestamp: new Date().toISOString()
    }, { headers: corsHeaders });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500, headers: corsHeaders }
    );
  }
}
