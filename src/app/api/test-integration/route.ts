import { NextRequest, NextResponse } from 'next/server';
import { saveUserAccess, getUserAccess, getAllUsers, UserAccess } from '@/lib/user-storage';

// POST - Teste completo de integração
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, action } = body;

    console.log('🧪 ========================================');
    console.log('🧪 TESTE DE INTEGRAÇÃO COMPLETO');
    console.log('🧪 ========================================');
    console.log('🧪 Email recebido:', email);
    console.log('🧪 Ação:', action);

    if (!email) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Email é obrigatório para o teste' 
        },
        { status: 400 }
      );
    }

    // Normalizar email (mesma lógica usada no sistema)
    const normalizedEmail = email.toLowerCase().trim();
    console.log('🧪 Email normalizado:', normalizedEmail);

    if (action === 'register') {
      // TESTE 1: Registrar usuário
      console.log('🧪 TESTE 1: Registrando usuário...');
      
      const purchaseDate = new Date();
      const expirationDate = new Date(purchaseDate);
      expirationDate.setDate(expirationDate.getDate() + 30);

      const userData: UserAccess = {
        email: normalizedEmail,
        plan: 'App CapiCare 30 Dias',
        duration: 30,
        purchaseDate: purchaseDate.toISOString(),
        expirationDate: expirationDate.toISOString(),
        transactionId: `TEST-${Date.now()}`,
        saleId: `TEST-SALE-${Date.now()}`,
        amount: 99.90,
        status: 'APPROVED',
        active: true
      };

      console.log('🧪 Dados a serem salvos:', JSON.stringify(userData, null, 2));
      
      saveUserAccess(userData);
      
      console.log('✅ Usuário registrado com sucesso');

      // TESTE 2: Buscar usuário imediatamente após registro
      console.log('🧪 TESTE 2: Buscando usuário recém-registrado...');
      
      const foundUser = getUserAccess(normalizedEmail);
      
      if (!foundUser) {
        console.error('❌ ERRO CRÍTICO: Usuário não encontrado após registro!');
        return NextResponse.json({
          success: false,
          error: 'Usuário não encontrado após registro',
          details: {
            emailRegistered: normalizedEmail,
            emailSearched: normalizedEmail,
            allUsers: getAllUsers().map(u => u.email)
          }
        }, { status: 500 });
      }

      console.log('✅ Usuário encontrado:', JSON.stringify(foundUser, null, 2));

      // TESTE 3: Listar todos os usuários
      console.log('🧪 TESTE 3: Listando todos os usuários...');
      const allUsers = getAllUsers();
      console.log('🧪 Total de usuários:', allUsers.length);
      console.log('🧪 Emails cadastrados:', allUsers.map(u => u.email));

      return NextResponse.json({
        success: true,
        message: 'Teste de integração completo executado com sucesso',
        tests: {
          test1_register: {
            status: 'PASSED',
            email: normalizedEmail,
            userData: userData
          },
          test2_retrieve: {
            status: 'PASSED',
            foundUser: foundUser
          },
          test3_list: {
            status: 'PASSED',
            totalUsers: allUsers.length,
            emails: allUsers.map(u => u.email)
          }
        },
        instructions: {
          step1: 'Usuário registrado com sucesso',
          step2: 'Agora tente fazer login na página inicial',
          step3: `Use o email: ${normalizedEmail}`,
          step4: 'Nome: qualquer nome'
        }
      }, { status: 200 });

    } else if (action === 'verify') {
      // TESTE: Verificar acesso
      console.log('🧪 TESTE: Verificando acesso...');
      
      const user = getUserAccess(normalizedEmail);
      
      if (!user) {
        console.log('❌ Usuário não encontrado');
        
        // Listar todos os usuários para debug
        const allUsers = getAllUsers();
        console.log('🧪 Usuários cadastrados:', allUsers.map(u => u.email));
        
        return NextResponse.json({
          success: false,
          error: 'Usuário não encontrado',
          debug: {
            emailSearched: normalizedEmail,
            totalUsers: allUsers.length,
            registeredEmails: allUsers.map(u => u.email),
            suggestion: 'Registre o usuário primeiro usando action=register'
          }
        }, { status: 404 });
      }

      console.log('✅ Usuário encontrado e ativo');

      return NextResponse.json({
        success: true,
        message: 'Acesso válido',
        user: {
          email: user.email,
          plan: user.plan,
          duration: user.duration,
          expirationDate: user.expirationDate,
          active: user.active
        }
      }, { status: 200 });

    } else {
      return NextResponse.json({
        success: false,
        error: 'Ação inválida. Use "register" ou "verify"'
      }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Erro no teste de integração:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro no teste de integração',
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
      endpoint: '/api/test-integration',
      method: 'POST',
      description: 'Teste completo de integração do sistema de compras',
      usage: {
        register: {
          email: 'teste@exemplo.com',
          action: 'register'
        },
        verify: {
          email: 'teste@exemplo.com',
          action: 'verify'
        }
      },
      instructions: {
        step1: 'Primeiro registre um usuário com action=register',
        step2: 'Depois verifique o acesso com action=verify',
        step3: 'Tente fazer login na página inicial com o email registrado'
      }
    },
    { status: 200 }
  );
}
