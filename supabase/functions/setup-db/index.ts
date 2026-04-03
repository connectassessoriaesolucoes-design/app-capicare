import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (_req) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  // Verificar se tabela existe
  const { error: checkErr } = await supabase.from('app_users').select('id').limit(1);

  if (checkErr && checkErr.code === 'PGRST205') {
    // Tabela não existe - criar via pg direto usando service_role
    const pgUrl = Deno.env.get('SUPABASE_DB_URL');
    if (!pgUrl) {
      return new Response(JSON.stringify({ error: 'SUPABASE_DB_URL not available' }), {
        headers: { 'Content-Type': 'application/json' }, status: 500
      });
    }

    // @ts-ignore
    const { Client } = await import('https://deno.land/x/postgres@v0.17.0/mod.ts');
    const client = new Client(pgUrl);
    await client.connect();

    await client.queryObject(`
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
    `);

    await client.end();

    return new Response(JSON.stringify({ success: true, message: 'Table created!' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (checkErr) {
    return new Response(JSON.stringify({ error: checkErr.message, code: checkErr.code }), {
      headers: { 'Content-Type': 'application/json' }, status: 500
    });
  }

  return new Response(JSON.stringify({ success: true, message: 'Table already exists' }), {
    headers: { 'Content-Type': 'application/json' }
  });
});
