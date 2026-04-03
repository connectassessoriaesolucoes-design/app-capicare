import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CREATE_TABLE_SQL = `
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
`;

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ success: false, error: 'Variáveis de ambiente não configuradas' }, { status: 503 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Testa se a tabela existe
    const { error: testError } = await supabase.from('app_users').select('id').limit(1);

    if (!testError) {
      return NextResponse.json({ success: true, message: 'Tabela app_users já existe' });
    }

    if (testError.code === '42P01') {
      // Tabela não existe, tenta criar via SQL direto na API do Supabase
      const projectRef = supabaseUrl.replace('https://', '').split('.')[0];
      const managementApiUrl = `https://api.supabase.com/v1/projects/${projectRef}/database/query`;

      const res = await fetch(managementApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`
        },
        body: JSON.stringify({ query: CREATE_TABLE_SQL })
      });

      if (res.ok) {
        return NextResponse.json({ success: true, message: 'Tabela app_users criada com sucesso' });
      }

      return NextResponse.json({
        success: false,
        message: 'Tabela precisa ser criada manualmente',
        sql: CREATE_TABLE_SQL
      }, { status: 202 });
    }

    return NextResponse.json({ success: false, error: testError.message }, { status: 500 });

  } catch (err) {
    return NextResponse.json({
      success: false,
      error: err instanceof Error ? err.message : String(err)
    }, { status: 500 });
  }
}
