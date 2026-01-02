import { NextRequest, NextResponse } from 'next/server';
import { saveUserAccess, UserAccess } from '@/lib/user-storage';

// POST - Forçar registro de usuário (emergência)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, plan, duration } = body;
    
    console.log('🚨 ========================================');
    console.log('🚨 REGISTRO FORÇADO DE USUÁRIO (EMERGÊNCIA)');
    console.log('🚨 ========================================');
    console.log('🚨 Email:', email);
    console.log('🚨 Nome:', name);
    console.log('🚨 Plano:', plan);
    console.log('🚨 Duração:', duration);
    
    if (!email) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Email é obrigatório' 
        },
        { status: 400 }
      );
    }
    
    // Valores padrão
    const planName = plan || 'App CapiCare 30 Dias';
    const planDuration = duration || 30;
    
    const purchaseDate = new Date();
    const expirationDate = new Date(purchaseDate);
    expirationDate.setDate(expirationDate.getDate() + planDuration);
    
    const userData: UserAccess = {
      email: email.toLowerCase().trim(),
      plan: planName,
      duration: planDuration,
      purchaseDate: purchaseDate.toISOString(),
      expirationDate: expirationDate.toISOString(),
      transactionId: `FORCE-${Date.now()}`,
      saleId: `FORCE-SALE-${Date.now()}`,
      amount: 99.90,
      status: 'APPROVED',
      active: true
    };
    
    console.log('🚨 Dados do usuário:', JSON.stringify(userData, null, 2));
    
    // Salvar usuário
    saveUserAccess(userData);
    
    console.log('✅ ========================================');
    console.log('✅ USUÁRIO REGISTRADO COM SUCESSO (FORÇA)');
    console.log('✅ ========================================');
    console.log('✅ Email:', userData.email);
    console.log('✅ Plano:', userData.plan);
    console.log('✅ Duração:', userData.duration, 'dias');
    console.log('✅ Expira em:', userData.expirationDate);
    console.log('✅ ========================================');
    
    return NextResponse.json(
      {
        success: true,
        message: 'Usuário registrado com sucesso (registro forçado)',
        data: {
          email: userData.email,
          plan: userData.plan,
          duration: userData.duration,
          expirationDate: userData.expirationDate,
          active: userData.active
        },
        instructions: {
          step1: 'Usuário cadastrado com sucesso',
          step2: 'Agora você pode fazer login',
          step3: 'Use o email cadastrado para acessar'
        }
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('❌ Erro ao forçar registro:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao forçar registro de usuário',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

// GET - Informações sobre o endpoint
export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      endpoint: '/api/force-register',
      method: 'POST',
      description: 'Força o registro de um usuário (usar apenas em emergências)',
      warning: 'Este endpoint deve ser usado apenas quando o webhook falhar',
      usage: {
        example: {
          email: 'usuario@exemplo.com',
          name: 'Nome do Usuário',
          plan: 'App CapiCare 30 Dias',
          duration: 30
        }
      },
      instructions: {
        step1: 'Use este endpoint apenas se o webhook não funcionar',
        step2: 'Envie POST com email, name, plan e duration',
        step3: 'Usuário será cadastrado imediatamente',
        step4: 'Faça login com o email cadastrado'
      }
    },
    { status: 200 }
  );
}
