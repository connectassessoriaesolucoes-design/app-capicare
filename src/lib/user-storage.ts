// Sistema de armazenamento de usuários com PERSISTÊNCIA
// Dados salvos em arquivo JSON para não perder entre reinicializações
// Suporta migração para Supabase quando disponível

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export interface UserAccess {
  email: string;
  plan: string;
  duration: number;
  purchaseDate: string;
  expirationDate: string;
  transactionId: string | null;
  amount: number | null;
  status: string;
  active: boolean;
  saleId?: string | null;
}

// Caminho do arquivo de persistência
const STORAGE_FILE = join(process.cwd(), 'data', 'users.json');

// Garantir que a pasta data existe
function ensureDataFolder() {
  const dataFolder = join(process.cwd(), 'data');
  if (!existsSync(dataFolder)) {
    try {
      mkdirSync(dataFolder, { recursive: true });
      console.log('📁 Pasta data criada com sucesso');
    } catch (error) {
      console.error('❌ Erro ao criar pasta data:', error);
    }
  }
}

// Carregar dados do arquivo
function loadUsersFromFile(): Map<string, UserAccess> {
  try {
    ensureDataFolder();
    
    if (existsSync(STORAGE_FILE)) {
      const data = readFileSync(STORAGE_FILE, 'utf-8');
      const usersArray = JSON.parse(data);
      const usersMap = new Map<string, UserAccess>();
      
      usersArray.forEach((user: UserAccess) => {
        usersMap.set(user.email.toLowerCase().trim(), user);
      });
      
      console.log(`📂 ${usersMap.size} usuários carregados do arquivo`);
      return usersMap;
    } else {
      console.log('📂 Arquivo users.json não existe ainda, será criado no primeiro salvamento');
    }
  } catch (error) {
    console.error('⚠️ Erro ao carregar usuários do arquivo:', error);
  }
  
  return new Map<string, UserAccess>();
}

// Salvar dados no arquivo
function saveUsersToFile(usersMap: Map<string, UserAccess>) {
  try {
    ensureDataFolder();
    
    const usersArray = Array.from(usersMap.values());
    writeFileSync(STORAGE_FILE, JSON.stringify(usersArray, null, 2), 'utf-8');
    
    console.log(`💾 ${usersArray.length} usuários salvos no arquivo: ${STORAGE_FILE}`);
    console.log(`💾 Usuários salvos:`, usersArray.map(u => u.email));
  } catch (error) {
    console.error('❌ Erro ao salvar usuários no arquivo:', error);
    console.error('❌ Caminho do arquivo:', STORAGE_FILE);
  }
}

// Armazenamento em memória + persistência em arquivo
let usersStorage = loadUsersFromFile();

// Salvar no Supabase (quando disponível)
async function saveToSupabase(userData: UserAccess): Promise<boolean> {
  try {
    // Verificar se Supabase está configurado
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('⚠️ Supabase não configurado, usando apenas armazenamento em arquivo');
      return false;
    }

    const { supabase } = await import('./supabase');
    
    // Verificar se já existe uma compra para este email
    const { data: existing, error: selectError } = await supabase
      .from('purchases')
      .select('*')
      .eq('email', userData.email.toLowerCase().trim())
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      console.error('❌ Erro ao verificar compra existente:', selectError);
      return false;
    }

    const purchaseData = {
      email: userData.email.toLowerCase().trim(),
      plan: userData.plan,
      duration: userData.duration,
      purchase_date: userData.purchaseDate,
      expiration_date: userData.expirationDate,
      transaction_id: userData.transactionId,
      sale_id: userData.saleId,
      amount: userData.amount,
      status: userData.status,
      active: userData.active,
      updated_at: new Date().toISOString()
    };

    if (existing) {
      // Atualizar compra existente
      const { error: updateError } = await supabase
        .from('purchases')
        .update(purchaseData)
        .eq('email', userData.email.toLowerCase().trim());

      if (updateError) {
        console.error('❌ Erro ao atualizar no Supabase:', updateError);
        return false;
      }

      console.log('✅ Compra atualizada no Supabase:', userData.email);
    } else {
      // Inserir nova compra
      const { error: insertError } = await supabase
        .from('purchases')
        .insert([purchaseData]);

      if (insertError) {
        console.error('❌ Erro ao inserir no Supabase:', insertError);
        return false;
      }

      console.log('✅ Compra inserida no Supabase:', userData.email);
    }

    return true;
  } catch (error) {
    console.error('❌ Erro ao salvar no Supabase:', error);
    return false;
  }
}

// Buscar no Supabase (quando disponível)
async function getUserFromSupabase(email: string): Promise<UserAccess | null> {
  try {
    // Verificar se Supabase está configurado
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return null;
    }

    const { supabase } = await import('./supabase');
    
    const { data, error } = await supabase
      .from('purchases')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('ℹ️ Nenhuma compra encontrada no Supabase para:', email);
      } else {
        console.error('❌ Erro ao buscar no Supabase:', error);
      }
      return null;
    }

    if (!data) {
      return null;
    }

    // Converter formato do Supabase para UserAccess
    const user: UserAccess = {
      email: data.email,
      plan: data.plan,
      duration: data.duration,
      purchaseDate: data.purchase_date,
      expirationDate: data.expiration_date,
      transactionId: data.transaction_id,
      saleId: data.sale_id,
      amount: data.amount,
      status: data.status,
      active: data.active
    };

    console.log('✅ Usuário encontrado no Supabase:', email);
    return user;
  } catch (error) {
    console.error('❌ Erro ao buscar no Supabase:', error);
    return null;
  }
}

export async function saveUserAccess(userData: UserAccess): Promise<void> {
  const email = userData.email.toLowerCase().trim();
  
  // Salvar em memória
  usersStorage.set(email, userData);
  
  console.log('💾 Salvando usuário:', email);
  console.log('💾 Dados do usuário:', JSON.stringify(userData, null, 2));
  
  // Salvar no arquivo para persistência (fallback)
  saveUsersToFile(usersStorage);
  
  // Tentar salvar no Supabase (se disponível)
  const savedToSupabase = await saveToSupabase(userData);
  
  if (savedToSupabase) {
    console.log('✅ Usuário salvo no Supabase e arquivo:', email);
  } else {
    console.log('✅ Usuário salvo apenas no arquivo:', email);
  }
}

export async function getUserAccess(email: string): Promise<UserAccess | null> {
  const normalizedEmail = email.toLowerCase().trim();
  
  console.log('🔍 Buscando usuário:', normalizedEmail);
  
  // Tentar buscar no Supabase primeiro
  const userFromSupabase = await getUserFromSupabase(normalizedEmail);
  
  if (userFromSupabase) {
    console.log('✅ Usuário encontrado no Supabase:', normalizedEmail);
    console.log('🔍 Data de expiração (Supabase):', userFromSupabase.expirationDate);
    console.log('🔍 Data atual:', new Date().toISOString());
    
    // Verificar se o acesso ainda está válido
    const now = new Date();
    const expiration = new Date(userFromSupabase.expirationDate);
    
    if (now > expiration) {
      console.log('⏰ Acesso expirado para:', normalizedEmail);
      return { ...userFromSupabase, active: false };
    }
    
    console.log('✅ Acesso válido (Supabase):', normalizedEmail);
    return { ...userFromSupabase, active: true };
  }
  
  // Fallback: buscar no arquivo
  usersStorage = loadUsersFromFile();
  const user = usersStorage.get(normalizedEmail);
  
  console.log('🔍 Total de usuários no arquivo:', usersStorage.size);
  console.log('🔍 Usuários cadastrados:', Array.from(usersStorage.keys()));
  
  if (!user) {
    console.log('❌ Usuário não encontrado:', normalizedEmail);
    return null;
  }
  
  console.log('🔍 Usuário encontrado no arquivo:', normalizedEmail);
  console.log('🔍 Data de expiração (arquivo):', user.expirationDate);
  console.log('🔍 Data atual:', new Date().toISOString());
  
  // Verificar se o acesso ainda está válido
  const now = new Date();
  const expiration = new Date(user.expirationDate);
  
  if (now > expiration) {
    console.log('⏰ Acesso expirado para:', normalizedEmail);
    return { ...user, active: false };
  }
  
  console.log('✅ Acesso válido (arquivo):', normalizedEmail);
  return { ...user, active: true };
}

export async function getAllUsers(): Promise<UserAccess[]> {
  // Tentar buscar do Supabase primeiro
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const { supabase } = await import('./supabase');
      
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        console.log(`✅ ${data.length} usuários carregados do Supabase`);
        return data.map(d => ({
          email: d.email,
          plan: d.plan,
          duration: d.duration,
          purchaseDate: d.purchase_date,
          expirationDate: d.expiration_date,
          transactionId: d.transaction_id,
          saleId: d.sale_id,
          amount: d.amount,
          status: d.status,
          active: d.active
        }));
      }
    }
  } catch (error) {
    console.log('⚠️ Erro ao buscar do Supabase, usando arquivo:', error);
  }
  
  // Fallback: buscar do arquivo
  usersStorage = loadUsersFromFile();
  return Array.from(usersStorage.values());
}

export async function deleteUserAccess(email: string): Promise<boolean> {
  const normalizedEmail = email.toLowerCase().trim();
  
  // Deletar do arquivo
  const deleted = usersStorage.delete(normalizedEmail);
  
  if (deleted) {
    saveUsersToFile(usersStorage);
  }
  
  // Tentar deletar do Supabase
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const { supabase } = await import('./supabase');
      
      await supabase
        .from('purchases')
        .delete()
        .eq('email', normalizedEmail);
      
      console.log('✅ Usuário deletado do Supabase:', normalizedEmail);
    }
  } catch (error) {
    console.error('⚠️ Erro ao deletar do Supabase:', error);
  }
  
  return deleted;
}

// Função para verificar se email tem acesso válido
export async function hasValidAccess(email: string): Promise<boolean> {
  const user = await getUserAccess(email);
  return user !== null && user.active;
}
