import { NextRequest, NextResponse } from 'next/server';

// Rota de teste para simular uma compra via webhook
export async function POST(request: NextRequest) {
  try {
    console.log('🧪 ========================================');
    console.log('🧪 TESTE: Simulando compra via webhook');
    console.log('🧪 ========================================');

    const body = await request.json();
    const { email, name, plan } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    // Mapear plano para offer_name
    const planMapping: { [key: string]: string } = {
      '30': 'App CapiCare 30 Dias',
      '60': 'App CapiCare 60 Dias',
      '90': 'App CapiCare 90 Dias',
      '30 dias': 'App CapiCare 30 Dias',
      '60 dias': 'App CapiCare 60 Dias',
      '90 dias': 'App CapiCare 90 Dias'
    };

    const offerName = planMapping[plan?.toLowerCase()] || 'App CapiCare 30 Dias';

    // Criar payload do webhook
    const webhookPayload = {
      email: email,
      name: name || 'Usuário Teste',
      status: 'APPROVED',
      event_description: 'Compra aprovada',
      offer_name: offerName,
      sale_id: `TEST-${Date.now()}`,
      transaction_id: `TXN-${Date.now()}`,
      amount: 97.00,
      purchase_date: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    console.log('🧪 Payload do webhook:');
    console.log(JSON.stringify(webhookPayload, null, 2));

    // Chamar o webhook interno
    const webhookUrl = `${request.nextUrl.origin}/api/webhook`;
    console.log('🧪 Chamando webhook:', webhookUrl);

    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload)
    });

    const webhookResult = await webhookResponse.json();

    console.log('🧪 Resposta do webhook:');
    console.log(JSON.stringify(webhookResult, null, 2));
    console.log('🧪 ========================================');

    if (webhookResult.success) {
      return NextResponse.json(
        {
          success: true,
          message: '✅ Compra de teste criada com sucesso!',
          data: {
            email: email,
            name: name || 'Usuário Teste',
            plan: offerName,
            webhookResponse: webhookResult
          },
          nextSteps: [
            'Agora você pode fazer login no app',
            'Use o email: ' + email,
            'Clique em "Já tenho conta, acessar" na página inicial'
          ]
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Erro ao processar compra de teste',
          details: webhookResult
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Erro ao criar compra de teste:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao criar compra de teste',
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
      endpoint: '/api/test-purchase',
      method: 'POST',
      description: 'Cria uma compra de teste simulando o webhook da Kirvano',
      requiredFields: {
        email: 'Email do usuário (obrigatório)',
        name: 'Nome do usuário (opcional)',
        plan: '30 dias | 60 dias | 90 dias (opcional, padrão: 30 dias)'
      },
      example: {
        email: 'teste@exemplo.com',
        name: 'João Silva',
        plan: '30 dias'
      },
      usage: 'Use esta rota para testar o fluxo completo de compra sem precisar fazer uma compra real'
    },
    { status: 200 }
  );
}
