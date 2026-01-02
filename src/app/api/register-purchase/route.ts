import { NextRequest, NextResponse } from 'next/server';
import { saveUserAccess } from '@/lib/user-storage';

// Endpoint para registrar manualmente a compra específica mencionada
export async function POST(request: NextRequest) {
  try {
    console.log('🔧 ========================================');
    console.log('🔧 REGISTRANDO COMPRA MANUAL');
    console.log('🔧 ========================================');

    // Dados da compra mencionada pelo usuário
    const purchaseDate = new Date();
    const expirationDate = new Date(purchaseDate);
    expirationDate.setDate(expirationDate.getDate() + 60); // 60 dias

    const userData = {
      email: 'mariaeduarda10connect@gmail.com',
      plan: 'app capicare 60 dias',
      duration: 60,
      purchaseDate: purchaseDate.toISOString(),
      expirationDate: expirationDate.toISOString(),
      transactionId: null,
      saleId: 'XJNWEDLY',
      amount: 97.00,
      status: 'approved',
      active: true
    };

    saveUserAccess(userData);

    console.log('✅ Compra registrada manualmente:', userData);
    console.log('🔧 ========================================');

    return NextResponse.json({
      success: true,
      message: 'Compra registrada com sucesso! Agora você pode fazer login.',
      data: userData,
      instructions: {
        step1: 'Acesse a página inicial do app',
        step2: 'Clique em "Já tenho conta, acessar"',
        step3: 'Use o email: mariaeduarda10connect@gmail.com',
        step4: 'Digite qualquer nome',
        step5: 'Você terá acesso ao plano de 60 dias'
      }
    });

  } catch (error) {
    console.error('❌ Erro ao registrar compra manual:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao registrar compra' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST para registrar a compra manualmente',
    instructions: 'Faça um POST para /api/register-purchase para registrar a compra do email mariaeduarda10connect@gmail.com'
  });
}
