import { NextRequest, NextResponse } from 'next/server';
import { getAllUsers, saveUserAccess, UserAccess } from '@/lib/user-storage';

// GET - Listar todos os usuários cadastrados
export async function GET(request: NextRequest) {
  try {
    const users = await getAllUsers();
    
    console.log('📋 ========================================');
    console.log('📋 LISTANDO TODOS OS USUÁRIOS');
    console.log('📋 ========================================');
    console.log('📋 Total de usuários:', users.length);
    
    if (users.length === 0) {
      console.log('⚠️ Nenhum usuário cadastrado ainda');
      return NextResponse.json(
        {
          success: true,
          message: 'Nenhum usuário cadastrado ainda',
          totalUsers: 0,
          users: [],
          instructions: {
            step1: 'Para testar o sistema, faça uma compra real na Kirvano',
            step2: 'Ou use o endpoint POST /api/debug-users para registrar um usuário de teste',
            step3: 'Ou use o endpoint POST /api/simulate-kirvano para simular uma compra'
          }
        },
        { status: 200 }
      );
    }
    
    users.forEach((user, index) => {
      console.log(`📋 Usuário ${index + 1}:`, {
        email: user.email,
        plan: user.plan,
        duration: user.duration,
        active: user.active,
        expirationDate: user.expirationDate
      });
    });
    
    console.log('📋 ========================================');
    
    return NextResponse.json(
      {
        success: true,
        totalUsers: users.length,
        users: users.map(user => ({
          email: user.email,
          plan: user.plan,
          duration: user.duration,
          purchaseDate: user.purchaseDate,
          expirationDate: user.expirationDate,
          active: user.active,
          saleId: user.saleId,
          status: user.status
        }))
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('❌ Erro ao listar usuários:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao listar usuários',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

// POST - Registrar usuário de teste manualmente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, plan, duration } = body;
    
    console.log('🧪 ========================================');
    console.log('🧪 REGISTRANDO USUÁRIO DE TESTE');
    console.log('🧪 ========================================');
    console.log('🧪 Email:', email);
    console.log('🧪 Plano:', plan);
    console.log('🧪 Duração:', duration);
    
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
      transactionId: `TEST-${Date.now()}`,
      saleId: `TEST-SALE-${Date.now()}`,
      amount: 99.90,
      status: 'APPROVED',
      active: true
    };
    
    console.log('🧪 Dados do usuário:', JSON.stringify(userData, null, 2));
    
    // Salvar usuário
    await saveUserAccess(userData);
    
    console.log('✅ ========================================');
    console.log('✅ USUÁRIO DE TESTE REGISTRADO COM SUCESSO');
    console.log('✅ ========================================');
    console.log('✅ Email:', userData.email);
    console.log('✅ Plano:', userData.plan);
    console.log('✅ Duração:', userData.duration, 'dias');
    console.log('✅ Expira em:', userData.expirationDate);
    console.log('✅ ========================================');
    
    return NextResponse.json(
      {
        success: true,
        message: 'Usuário de teste registrado com sucesso',
        data: {
          email: userData.email,
          plan: userData.plan,
          duration: userData.duration,
          expirationDate: userData.expirationDate,
          active: userData.active
        },
        instructions: {
          step1: 'Agora você pode fazer login com este email',
          step2: 'Acesse a página inicial e clique em "Já tenho conta, acessar"',
          step3: 'Use o email cadastrado para fazer login'
        }
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('❌ Erro ao registrar usuário de teste:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao registrar usuário de teste',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
