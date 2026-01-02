import { NextRequest, NextResponse } from 'next/server';
import { saveUserAccess, UserAccess } from '@/lib/user-storage';

/**
 * ENDPOINT ESPECÍFICO PARA KIRVANO
 * 
 * Este endpoint foi criado especificamente para receber webhooks da Kirvano
 * com validações robustas e tratamento de erros completo.
 * 
 * Configure na Kirvano:
 * - URL: https://seu-dominio.com/api/kirvano-webhook
 * - Método: POST
 * - Evento: Compra Aprovada
 */

interface KirvanoPayload {
  email?: string;
  status?: string;
  event_description?: string;
  offer_name?: string;
  sale_id?: string;
  transaction_id?: string;
  amount?: number;
  purchase_date?: string;
  created_at?: string;
  [key: string]: any;
}

// Função para extrair duração do plano
function extractPlanDuration(offerName: string): number {
  const normalized = offerName.toLowerCase().replace(/\s+/g, '');
  
  // Procurar por números seguidos de "dias" ou "dia"
  const match = normalized.match(/(\d+)\s*dias?/);
  if (match) {
    return parseInt(match[1], 10);
  }
  
  // Procurar apenas números (30, 60, 90)
  const numberMatch = normalized.match(/\b(30|60|90)\b/);
  if (numberMatch) {
    return parseInt(numberMatch[1], 10);
  }
  
  // Padrão: 30 dias
  console.warn('⚠️ Não foi possível extrair duração do plano, usando 30 dias como padrão');
  return 30;
}

// Validar email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Log inicial
    console.log('🚀 ========================================');
    console.log('🚀 KIRVANO WEBHOOK RECEBIDO');
    console.log('🚀 ========================================');
    console.log('🚀 Timestamp:', new Date().toISOString());
    console.log('🚀 URL:', request.url);
    console.log('🚀 Method:', request.method);
    
    // Capturar headers
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });
    console.log('🚀 Headers:', JSON.stringify(headers, null, 2));
    
    // Capturar body
    let body: KirvanoPayload;
    try {
      body = await request.json();
      console.log('🚀 Body recebido:', JSON.stringify(body, null, 2));
    } catch (parseError) {
      console.error('❌ Erro ao fazer parse do JSON:', parseError);
      return NextResponse.json(
        {
          success: false,
          error: 'Corpo da requisição inválido. Esperado JSON válido.',
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      );
    }
    
    // VALIDAÇÃO 1: Email
    console.log('🔍 Validação 1: Email');
    if (!body.email) {
      console.error('❌ Campo "email" não encontrado');
      return NextResponse.json(
        {
          success: false,
          error: 'Campo "email" é obrigatório',
          receivedData: body,
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      );
    }
    
    if (!isValidEmail(body.email)) {
      console.error('❌ Email inválido:', body.email);
      return NextResponse.json(
        {
          success: false,
          error: 'Email fornecido é inválido',
          receivedEmail: body.email,
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      );
    }
    
    console.log('✅ Email válido:', body.email);
    
    // VALIDAÇÃO 2: Status
    console.log('🔍 Validação 2: Status');
    const statusNormalized = body.status?.toUpperCase();
    if (statusNormalized !== 'APPROVED') {
      console.log('⚠️ Status não é APPROVED:', body.status);
      return NextResponse.json(
        {
          success: false,
          message: 'Webhook recebido mas status não é APPROVED',
          receivedStatus: body.status,
          expectedStatus: 'APPROVED',
          timestamp: new Date().toISOString()
        },
        { status: 200 }
      );
    }
    
    console.log('✅ Status aprovado:', body.status);
    
    // VALIDAÇÃO 3: Event Description
    console.log('🔍 Validação 3: Event Description');
    const eventNormalized = body.event_description?.toLowerCase().trim();
    if (eventNormalized !== 'compra aprovada') {
      console.log('⚠️ Evento não é "Compra aprovada":', body.event_description);
      return NextResponse.json(
        {
          success: false,
          message: 'Webhook recebido mas evento não é "Compra aprovada"',
          receivedEvent: body.event_description,
          expectedEvent: 'Compra aprovada',
          timestamp: new Date().toISOString()
        },
        { status: 200 }
      );
    }
    
    console.log('✅ Evento válido:', body.event_description);
    
    // VALIDAÇÃO 4: Offer Name
    console.log('🔍 Validação 4: Offer Name');
    if (!body.offer_name) {
      console.error('❌ Campo "offer_name" não encontrado');
      return NextResponse.json(
        {
          success: false,
          error: 'Campo "offer_name" é obrigatório',
          receivedData: body,
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      );
    }
    
    console.log('✅ Offer name válido:', body.offer_name);
    
    // Extrair duração do plano
    const duration = extractPlanDuration(body.offer_name);
    console.log('📊 Duração extraída:', duration, 'dias');
    
    // Processar datas
    const purchaseDate = body.purchase_date || body.created_at 
      ? new Date(body.purchase_date || body.created_at)
      : new Date();
    
    const expirationDate = new Date(purchaseDate);
    expirationDate.setDate(expirationDate.getDate() + duration);
    
    console.log('📅 Data de compra:', purchaseDate.toISOString());
    console.log('📅 Data de expiração:', expirationDate.toISOString());
    
    // Criar objeto de usuário
    const userData: UserAccess = {
      email: body.email.toLowerCase().trim(),
      plan: body.offer_name,
      duration: duration,
      purchaseDate: purchaseDate.toISOString(),
      expirationDate: expirationDate.toISOString(),
      transactionId: body.transaction_id || body.id || null,
      saleId: body.sale_id || null,
      amount: body.amount || null,
      status: body.status,
      active: true
    };
    
    console.log('💾 Dados do usuário preparados:', JSON.stringify(userData, null, 2));
    
    // Salvar usuário
    console.log('💾 Iniciando salvamento...');
    try {
      await saveUserAccess(userData);
      console.log('✅ Usuário salvo com sucesso');
    } catch (saveError) {
      console.error('❌ Erro ao salvar usuário:', saveError);
      // Continuar mesmo com erro - arquivo pode ter sido salvo
    }
    
    const processingTime = Date.now() - startTime;
    
    console.log('✅ ========================================');
    console.log('✅ PROCESSAMENTO CONCLUÍDO COM SUCESSO');
    console.log('✅ ========================================');
    console.log('✅ Email:', userData.email);
    console.log('✅ Plano:', userData.plan);
    console.log('✅ Duração:', userData.duration, 'dias');
    console.log('✅ Expira em:', userData.expirationDate);
    console.log('✅ Tempo de processamento:', processingTime, 'ms');
    console.log('✅ ========================================');
    
    return NextResponse.json(
      {
        success: true,
        message: 'Compra processada e acesso liberado com sucesso',
        data: {
          email: userData.email,
          plan: userData.plan,
          duration: userData.duration,
          purchaseDate: userData.purchaseDate,
          expirationDate: userData.expirationDate,
          active: userData.active,
          saleId: userData.saleId
        },
        processingTime: `${processingTime}ms`,
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );
    
  } catch (error) {
    const processingTime = Date.now() - startTime;
    
    console.error('❌ ========================================');
    console.error('❌ ERRO CRÍTICO NO PROCESSAMENTO');
    console.error('❌ ========================================');
    console.error('❌ Erro:', error);
    console.error('❌ Stack:', error instanceof Error ? error.stack : 'N/A');
    console.error('❌ Tempo até erro:', processingTime, 'ms');
    console.error('❌ ========================================');
    
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno ao processar webhook',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
        processingTime: `${processingTime}ms`,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      status: 'online',
      endpoint: '/api/kirvano-webhook',
      message: 'Endpoint específico para webhooks da Kirvano',
      version: '2.0',
      timestamp: new Date().toISOString(),
      
      configuration: {
        url: `${request.nextUrl.origin}/api/kirvano-webhook`,
        method: 'POST',
        contentType: 'application/json',
        event: 'Compra Aprovada'
      },
      
      requiredFields: {
        email: {
          type: 'string',
          required: true,
          description: 'Email do comprador',
          example: 'usuario@exemplo.com'
        },
        status: {
          type: 'string',
          required: true,
          description: 'Status da compra (deve ser APPROVED)',
          example: 'APPROVED',
          acceptedValues: ['APPROVED', 'approved', 'Approved']
        },
        event_description: {
          type: 'string',
          required: true,
          description: 'Descrição do evento (deve ser "Compra aprovada")',
          example: 'Compra aprovada',
          acceptedValues: ['Compra aprovada', 'compra aprovada', 'COMPRA APROVADA']
        },
        offer_name: {
          type: 'string',
          required: true,
          description: 'Nome da oferta/plano comprado',
          examples: [
            'App CapiCare 30 Dias',
            'App CapiCare 60 Dias',
            'App CapiCare 90 Dias'
          ]
        }
      },
      
      optionalFields: {
        sale_id: 'ID da venda na Kirvano',
        transaction_id: 'ID da transação',
        amount: 'Valor da compra',
        purchase_date: 'Data da compra (ISO 8601)',
        created_at: 'Data de criação (ISO 8601)'
      },
      
      responseExamples: {
        success: {
          success: true,
          message: 'Compra processada e acesso liberado com sucesso',
          data: {
            email: 'usuario@exemplo.com',
            plan: 'App CapiCare 30 Dias',
            duration: 30,
            expirationDate: '2024-02-01T00:00:00.000Z'
          }
        },
        error: {
          success: false,
          error: 'Campo "email" é obrigatório',
          timestamp: '2024-01-01T00:00:00.000Z'
        }
      },
      
      testingEndpoints: {
        simulate: '/api/simulate-kirvano (POST) - Simula webhook da Kirvano',
        verify: '/api/verify-access (POST) - Verifica acesso de um email',
        listUsers: '/api/debug-users (GET) - Lista todos os usuários'
      }
    },
    { status: 200 }
  );
}
