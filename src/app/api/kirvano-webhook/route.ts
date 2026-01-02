import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
    const dateValue = body.purchase_date || body.created_at;
    const purchaseDate = dateValue ? new Date(dateValue) : new Date();

    const expirationDate = new Date(purchaseDate);
    expirationDate.setDate(expirationDate.getDate() + duration);

    console.log('📅 Data de compra:', purchaseDate.toISOString());
    console.log('📅 Data de expiração:', expirationDate.toISOString());

    // Preparar dados para Supabase
    const email = body.email.toLowerCase().trim();
    const purchaseData = {
      email: email,
      plan: body.offer_name,
      duration: duration,
      purchase_date: purchaseDate.toISOString(),
      expiration_date: expirationDate.toISOString(),
      payment_id: body.transaction_id || body.id || null,
      active: true,
      status: 'approved',
    };

    console.log('💾 Dados preparados para Supabase:', JSON.stringify(purchaseData, null, 2));

    // Salvar no Supabase
    console.log('💾 Iniciando salvamento no Supabase...');
    try {
      const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Variáveis Supabase não configuradas');
        throw new Error('Configuração do Supabase incompleta');
      }

      const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { autoRefreshToken: false, persistSession: false }
      });

      // Verificar se já existe uma compra para este email
      const { data: existing } = await supabase
        .from('purchases')
        .select('id')
        .ilike('email', email)
        .single();

      if (existing) {
        // Atualizar compra existente
        const { error: updateError } = await supabase
          .from('purchases')
          .update(purchaseData)
          .ilike('email', email);

        if (updateError) throw updateError;
        console.log('✅ Compra atualizada no Supabase:', email);
      } else {
        // Inserir nova compra
        const { error: insertError } = await supabase
          .from('purchases')
          .insert([purchaseData]);

        if (insertError) throw insertError;
        console.log('✅ Compra inserida no Supabase:', email);
      }
    } catch (saveError) {
      console.error('❌ Erro ao salvar no Supabase:', saveError);
      return NextResponse.json(
        {
          success: false,
          error: 'Erro ao salvar compra no banco de dados',
          details: saveError instanceof Error ? saveError.message : 'Erro desconhecido'
        },
        { status: 500 }
      );
    }
    
    const processingTime = Date.now() - startTime;
    
    console.log('✅ ========================================');
    console.log('✅ PROCESSAMENTO CONCLUÍDO COM SUCESSO');
    console.log('✅ ========================================');
    console.log('✅ Email:', email);
    console.log('✅ Plano:', purchaseData.plan);
    console.log('✅ Duração:', purchaseData.duration, 'dias');
    console.log('✅ Expira em:', purchaseData.expiration_date);
    console.log('✅ Tempo de processamento:', processingTime, 'ms');
    console.log('✅ ========================================');

    return NextResponse.json(
      {
        success: true,
        message: 'Compra processada e acesso liberado com sucesso',
        data: {
          email: email,
          plan: purchaseData.plan,
          duration: purchaseData.duration,
          purchaseDate: purchaseData.purchase_date,
          expirationDate: purchaseData.expiration_date,
          active: purchaseData.active
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
