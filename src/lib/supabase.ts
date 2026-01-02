import { createClient } from '@supabase/supabase-js';

// Variáveis de ambiente do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Validar variáveis de ambiente
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Variáveis de ambiente do Supabase não configuradas. Configure nas integrações do projeto.');
}

// Cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos do banco de dados
export interface Purchase {
  id?: string;
  email: string;
  plan: string;
  duration: number;
  purchase_date: string;
  expiration_date: string;
  transaction_id: string | null;
  sale_id: string | null;
  amount: number | null;
  status: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}
