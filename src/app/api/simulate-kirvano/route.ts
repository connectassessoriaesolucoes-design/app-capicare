import { NextRequest, NextResponse } from 'next/server';

// POST - Simular webhook da Kirvano para testes
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, plan } = body;
    
    console.log('🧪 ========================================');
    console.log('🧪 SIMULANDO WEBHOOK DA KIRVANO');
    console.log('🧪 ========================================');
    console.log('🧪 Email:', email);
    console.log('🧪 Plano:', plan);
    
    if (!email) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Email é obrigatório para simulação' 
        },
        { status: 400 }
      );
    }
    
    // Mapear plano para offer_name correto
    let offerName = 'App CapiCare 30 Dias';
    
    if (plan === '30dias' || plan === '30') {
      offerName = 'App CapiCare 30 Dias';
    } else if (plan === '60dias' || plan === '60') {
      offerName = 'App CapiCare 60 Dias';
    } else if (plan === '90dias' || plan === '90') {
      offerName = 'App CapiCare 90 Dias';
    }
    
    // Criar payload simulado da Kirvano
    const kirvanoPayload = {
      email: email,
      status: 'APPROVED',
      event_description: 'Compra aprovada',
      offer_name: offerName,
      sale_id: `SIM-${Date.now()}`,
      amount: 99.90,
      purchase_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      transaction_id: `TXN-SIM-${Date.now()}`
    };
    
    console.log('🧪 Payload simulado:', JSON.stringify(kirvanoPayload, null, 2));
    
    // Enviar para o webhook real
    const webhookUrl = `${request.nextUrl.origin}/api/webhook`;
    console.log('🧪 Enviando para webhook:', webhookUrl);
    
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(kirvanoPayload)
    });
    
    const webhookResult = await webhookResponse.json();
    
    console.log('🧪 Resposta do webhook:', JSON.stringify(webhookResult, null, 2));
    console.log('✅ ========================================');
    console.log('✅ SIMULAÇÃO CONCLUÍDA');
    console.log('✅ ========================================');
    
    return NextResponse.json(
      {
        success: true,
        message: 'Compra simulada e processada com sucesso',
        simulatedData: kirvanoPayload,
        webhookResponse: webhookResult,
        instructions: {
          step1: 'Usuário foi cadastrado com sucesso',
          step2: 'Agora você pode fazer login com este email',
          step3: 'Acesse a página inicial e clique em "Já tenho conta, acessar"',
          step4: `Use o email: ${email}`
        }
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('❌ Erro ao simular webhook:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao simular webhook da Kirvano',
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
      endpoint: '/api/simulate-kirvano',
      method: 'POST',
      description: 'Simula uma notificação de compra da Kirvano para testes',
      usage: {
        example: {
          email: 'teste@exemplo.com',
          plan: '30dias'
        },
        plans: {
          '30dias': 'App CapiCare 30 Dias',
          '60dias': 'App CapiCare 60 Dias',
          '90dias': 'App CapiCare 90 Dias'
        }
      },
      instructions: {
        step1: 'Envie POST com email e plan',
        step2: 'Sistema simula webhook da Kirvano',
        step3: 'Usuário é cadastrado automaticamente',
        step4: 'Faça login com o email usado'
      }
    },
    { status: 200 }
  );
}
