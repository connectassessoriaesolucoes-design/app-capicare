import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Interface para os dados recebidos do webhook Kirvano
interface KirvanoWebhookData {
  email?: string;
  status?: string;
  event_description?: string;
  offer_name?: string;
  sale_id?: string;
  amount?: number;
  purchase_date?: string;
  created_at?: string;
  transaction_id?: string;
  name?: string;
  full_name?: string;
  customer_name?: string;
  phone?: string;
  telephone?: string;
  customer_phone?: string;
  [key: string]: any;
}

// Mapear nome do plano para duração em dias
function getPlanDuration(offerName: string): number {
  const planName = offerName.toLowerCase();
  
  if (planName.includes('30 dias') || planName.includes('30dias') || planName.includes('30')) {
    return 30;
  } else if (planName.includes('60 dias') || planName.includes('60dias') || planName.includes('60')) {
    return 60;
  } else if (planName.includes('90 dias') || planName.includes('90dias') || planName.includes('90')) {
    return 90;
  }
  
  // Padrão: 30 dias se não identificar
  console.log('⚠️ Não foi possível identificar duração do plano, usando 30 dias como padrão');
  return 30;
}

// POST - Receber dados do webhook
export async function POST(request: NextRequest) {
  try {
    console.log('📥 ========================================');
    console.log('📥 WEBHOOK KIRVANO RECEBIDO');
    console.log('📥 ========================================');
    console.log('📥 Timestamp:', new Date().toISOString());

    // Validar credenciais do Supabase PRIMEIRO
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    console.log('🔑 Verificando credenciais do Supabase:');
    console.log('🔑 - NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Configurada' : '❌ FALTANDO');
    console.log('🔑 - SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Configurada (RECOMENDADO)' : '⚠️ Faltando');
    console.log('🔑 - NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Configurada' : '❌ FALTANDO');

    if (!supabaseUrl) {
      console.error('❌ ERRO CRÍTICO: NEXT_PUBLIC_SUPABASE_URL não configurada!');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Configuração do Supabase incompleta',
          message: 'NEXT_PUBLIC_SUPABASE_URL não está configurada.',
          action: 'Configure as variáveis de ambiente do Supabase',
          missingVars: ['NEXT_PUBLIC_SUPABASE_URL']
        },
        { status: 500 }
      );
    }

    if (!supabaseServiceKey && !supabaseAnonKey) {
      console.error('❌ ERRO CRÍTICO: Nenhuma chave do Supabase configurada!');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Configuração do Supabase incompleta',
          message: 'Nenhuma chave do Supabase está configurada.',
          action: 'Configure SUPABASE_SERVICE_ROLE_KEY (recomendado) ou NEXT_PUBLIC_SUPABASE_ANON_KEY',
          missingVars: ['SUPABASE_SERVICE_ROLE_KEY', 'NEXT_PUBLIC_SUPABASE_ANON_KEY']
        },
        { status: 500 }
      );
    }

    // Criar cliente Supabase (preferir SERVICE_ROLE_KEY para permissões completas)
    const supabaseKey = supabaseServiceKey || supabaseAnonKey!;
    const keyType = supabaseServiceKey ? 'SERVICE_ROLE_KEY ✅' : 'ANON_KEY ⚠️';
    console.log('🔑 Usando:', keyType);

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Pegar o corpo da requisição
    const body: KirvanoWebhookData = await request.json();

    console.log('📥 Dados completos recebidos:');
    console.log(JSON.stringify(body, null, 2));
    console.log('📥 ========================================');

    // Extrair campos com múltiplas variações de nome
    const email = body.email || body.Email || body.EMAIL;
    const status = body.status || body.Status || body.STATUS;
    const eventDescription = body.event_description || body.eventDescription || body.Event_Description;
    const offerName = body.offer_name || body.offerName || body.Offer_Name || body.product_name || body.productName;
    
    console.log('🔍 Campos extraídos:');
    console.log('🔍 - email:', email || '❌ NÃO ENCONTRADO');
    console.log('🔍 - status:', status || '❌ NÃO ENCONTRADO');
    console.log('🔍 - event_description:', eventDescription || 'N/A');
    console.log('🔍 - offer_name:', offerName || 'N/A');
    
    // Validar campo obrigatório: email
    if (!email) {
      console.error('❌ Email não encontrado no webhook');
      console.error('❌ Campos recebidos:', Object.keys(body));
      return NextResponse.json(
        { 
          success: false, 
          error: 'Campo "email" é obrigatório',
          receivedFields: Object.keys(body),
          hint: 'Verifique se o webhook da Kirvano está enviando o campo "email"',
          action: 'Configure o webhook para enviar o campo "email"'
        },
        { status: 400 }
      );
    }

    // Normalizar email
    const normalizedEmail = email.toLowerCase().trim();
    console.log('📧 Email normalizado:', normalizedEmail);

    // Determinar duração baseado no offer_name
    const planName = offerName || 'App CapiCare 30 Dias';
    const duration = getPlanDuration(planName);
    console.log('📊 Plano identificado:', planName);
    console.log('📊 Duração:', duration, 'dias');

    // Verificar se é uma compra aprovada
    const statusLower = (status || '').toLowerCase();
    const isApproved = statusLower === 'approved' || 
                       statusLower === 'aprovado' || 
                       statusLower === 'paid' || 
                       statusLower === 'pago' ||
                       statusLower === 'complete' ||
                       statusLower === 'completed';

    const eventLower = (eventDescription || '').toLowerCase();
    const isCompraAprovada = eventLower.includes('compra') && eventLower.includes('aprovada') ||
                             eventLower.includes('purchase') && eventLower.includes('approved') ||
                             eventLower === 'approved' ||
                             eventLower === 'paid';

    console.log('🔍 Status normalizado:', statusLower);
    console.log('🔍 É status aprovado?', isApproved ? '✅ SIM' : '❌ NÃO');
    console.log('🔍 Evento normalizado:', eventLower);
    console.log('🔍 É evento de compra aprovada?', isCompraAprovada ? '✅ SIM' : '❌ NÃO');

    // ETAPA 1: SALVAR EVENTO NA TABELA purchase_events (SEMPRE - para auditoria)
    console.log('💾 ========================================');
    console.log('💾 ETAPA 1: Salvando evento na tabela purchase_events');
    console.log('💾 ========================================');
    
    const eventData = {
      email: normalizedEmail,
      plan_days: duration,
      event_type: isApproved || isCompraAprovada ? 'purchase_approved' : 'purchase_pending',
      event_data: body,
      processed: false,
      created_at: new Date().toISOString()
    };

    console.log('💾 Dados do evento a serem salvos:');
    console.log(JSON.stringify(eventData, null, 2));

    const eventResult = await supabase
      .from('purchase_events')
      .insert([eventData])
      .select();

    if (eventResult.error) {
      console.error('❌ ========================================');
      console.error('❌ ERRO ao salvar evento na tabela purchase_events');
      console.error('❌ ========================================');
      console.error('❌ Código:', eventResult.error.code);
      console.error('❌ Mensagem:', eventResult.error.message);
      console.error('❌ Detalhes:', eventResult.error.details);
      console.error('❌ Hint:', eventResult.error.hint);
      console.error('❌ ========================================');
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Erro ao salvar evento no banco de dados',
          supabaseError: {
            code: eventResult.error.code,
            message: eventResult.error.message,
            details: eventResult.error.details,
            hint: eventResult.error.hint
          },
          possibleCauses: [
            'Tabela purchase_events não existe no Supabase',
            'Credenciais do Supabase sem permissão de escrita',
            'Estrutura da tabela incompatível com os dados',
            'RLS (Row Level Security) bloqueando a inserção'
          ],
          action: 'Verifique o arquivo SUPABASE_SETUP.md para instruções completas'
        },
        { status: 500 }
      );
    }

    console.log('✅ Evento salvo com sucesso na tabela purchase_events!');
    console.log('✅ ID do evento:', eventResult.data[0].id);

    // Se não for aprovado, apenas salvar evento e retornar
    if (!isApproved && !isCompraAprovada) {
      console.log('⚠️ ========================================');
      console.log('⚠️ Webhook recebido mas NÃO é uma compra aprovada');
      console.log('⚠️ ========================================');
      console.log('⚠️ Status recebido:', status);
      console.log('⚠️ Evento recebido:', eventDescription);
      console.log('⚠️ Ação: Evento salvo para auditoria, mas compra NÃO será processada');
      console.log('⚠️ Nota: Compra será processada quando o status for APPROVED');
      console.log('⚠️ ========================================');

      return NextResponse.json(
        { 
          success: true, 
          message: 'Evento registrado mas não é uma compra aprovada',
          status: status,
          event: eventDescription,
          eventSaved: true,
          eventId: eventResult.data[0].id,
          note: 'Compra será processada quando o status for APPROVED, PAID ou PAGO'
        },
        { status: 200 }
      );
    }

    console.log('✅ ========================================');
    console.log('✅ COMPRA APROVADA DETECTADA!');
    console.log('✅ Iniciando processamento completo...');
    console.log('✅ ========================================');

    // Data de compra
    const purchaseDate = body.purchase_date || body.created_at || body.date || body.Date
      ? new Date(body.purchase_date || body.created_at || body.date || body.Date) 
      : new Date();

    // Calcular data de expiração
    const expirationDate = new Date(purchaseDate);
    expirationDate.setDate(expirationDate.getDate() + duration);

    console.log('📅 Data de compra:', purchaseDate.toISOString());
    console.log('📅 Data de expiração:', expirationDate.toISOString());
    console.log('📅 Dias de acesso:', duration);

    // ETAPA 2: CRIAR USUÁRIO NO SUPABASE AUTH (CRÍTICO!)
    console.log('👤 ========================================');
    console.log('👤 ETAPA 2: Criando usuário no Supabase Auth');
    console.log('👤 ========================================');
    
    // Extrair nome do cliente
    const fullName = body.name || body.full_name || body.customer_name || 'Usuário';
    console.log('👤 Nome do cliente:', fullName);
    
    // Gerar senha temporária (usuário pode redefinir depois)
    const tempPassword = `CapiCare${Math.random().toString(36).substring(2, 10)}!`;
    
    console.log('🔐 Tentando criar usuário no Supabase Auth...');
    console.log('🔐 Email:', normalizedEmail);
    
    // Verificar se usuário já existe
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
    
    let authUserId = null;
    let userAlreadyExists = false;
    
    if (!listError && existingUsers) {
      const existingUser = existingUsers.users.find(u => u.email === normalizedEmail);
      if (existingUser) {
        console.log('🔄 Usuário já existe no Auth (ID:', existingUser.id, ')');
        authUserId = existingUser.id;
        userAlreadyExists = true;
      }
    }
    
    if (!userAlreadyExists) {
      // Criar novo usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: normalizedEmail,
        password: tempPassword,
        email_confirm: true, // Confirmar email automaticamente
        user_metadata: {
          full_name: fullName,
          plan: planName,
          duration: duration,
          purchase_date: purchaseDate.toISOString(),
          expiration_date: expirationDate.toISOString()
        }
      });

      if (authError) {
        console.error('❌ ========================================');
        console.error('❌ ERRO ao criar usuário no Supabase Auth');
        console.error('❌ ========================================');
        console.error('❌ Código:', authError.message);
        console.error('❌ ========================================');
        console.error('⚠️ IMPORTANTE: Sem usuário no Auth, o LOGIN NÃO FUNCIONARÁ!');
        console.error('⚠️ Continuando processamento das tabelas...');
        console.error('❌ ========================================');
      } else {
        console.log('✅ ========================================');
        console.log('✅ USUÁRIO CRIADO NO SUPABASE AUTH!');
        console.log('✅ ========================================');
        console.log('✅ User ID:', authData.user.id);
        console.log('✅ Email:', authData.user.email);
        console.log('✅ Email confirmado:', authData.user.email_confirmed_at ? 'SIM' : 'NÃO');
        console.log('✅ Senha temporária gerada');
        console.log('✅ ========================================');
        authUserId = authData.user.id;
      }
    }

    // ETAPA 3: CRIAR/ATUALIZAR PERFIL NA TABELA PROFILES
    console.log('👤 ========================================');
    console.log('👤 ETAPA 3: Processando perfil do usuário');
    console.log('👤 ========================================');
    
    // Verificar se perfil já existe
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (profileCheckError) {
      console.error('⚠️ Erro ao verificar perfil existente:', profileCheckError.message);
    }

    let profileResult;
    const profileData: any = {
      email: normalizedEmail,
      updated_at: new Date().toISOString()
    };

    // Adicionar nome se disponível
    if (fullName) {
      profileData.full_name = fullName;
    }

    // Adicionar telefone se disponível
    const phone = body.phone || body.telephone || body.customer_phone;
    if (phone) {
      profileData.phone = phone;
      console.log('👤 Telefone do cliente:', phone);
    }

    // Adicionar auth_user_id se disponível
    if (authUserId) {
      profileData.id = authUserId;
    }

    if (existingProfile) {
      console.log('🔄 Perfil existente encontrado (ID:', existingProfile.id, ')');
      console.log('🔄 Atualizando perfil...');
      profileResult = await supabase
        .from('profiles')
        .update(profileData)
        .eq('email', normalizedEmail)
        .select();
    } else {
      console.log('➕ Perfil não existe, criando novo...');
      profileData.created_at = new Date().toISOString();
      
      profileResult = await supabase
        .from('profiles')
        .insert([profileData])
        .select();
    }

    if (profileResult.error) {
      console.error('❌ ERRO ao processar perfil:', profileResult.error.message);
      console.error('❌ Código:', profileResult.error.code);
      console.error('⚠️ Continuando processamento mesmo com erro no perfil...');
    } else {
      console.log('✅ Perfil processado com sucesso!');
      console.log('✅ ID do perfil:', profileResult.data[0].id);
    }

    // ETAPA 4: CRIAR ASSINATURA NA TABELA SUBSCRIPTIONS
    console.log('📋 ========================================');
    console.log('📋 ETAPA 4: Criando assinatura');
    console.log('📋 ========================================');
    
    const subscriptionData = {
      email: normalizedEmail,
      plan_days: duration,
      purchase_date: purchaseDate.toISOString(),
      expiry_date: expirationDate.toISOString(),
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('📋 Dados da assinatura:');
    console.log(JSON.stringify(subscriptionData, null, 2));

    const subscriptionResult = await supabase
      .from('subscriptions')
      .insert([subscriptionData])
      .select();

    if (subscriptionResult.error) {
      console.error('❌ ERRO ao criar assinatura:', subscriptionResult.error.message);
      console.error('❌ Código:', subscriptionResult.error.code);
      console.error('⚠️ Continuando processamento mesmo com erro na assinatura...');
    } else {
      console.log('✅ Assinatura criada com sucesso!');
      console.log('✅ ID da assinatura:', subscriptionResult.data[0].id);
    }

    // ETAPA 5: SALVAR NA TABELA PURCHASES (controle de acesso - USADO PELO LOGIN)
    console.log('💰 ========================================');
    console.log('💰 ETAPA 5: Salvando compra na tabela purchases');
    console.log('💰 (ESTA TABELA É USADA PELO LOGIN)');
    console.log('💰 ========================================');
    
    const purchaseData = {
      email: normalizedEmail,
      plan: planName,
      duration: duration,
      purchase_date: purchaseDate.toISOString(),
      expiration_date: expirationDate.toISOString(),
      transaction_id: body.transaction_id || body.id || body.transactionId || null,
      sale_id: body.sale_id || body.saleId || body.order_id || null,
      amount: body.amount || body.value || body.price || null,
      status: status || 'APPROVED',
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('💰 Dados da compra:');
    console.log(JSON.stringify(purchaseData, null, 2));

    const purchaseResult = await supabase
      .from('purchases')
      .insert([purchaseData])
      .select();

    if (purchaseResult.error) {
      console.error('❌ ========================================');
      console.error('❌ ERRO CRÍTICO ao salvar compra na tabela purchases');
      console.error('❌ ========================================');
      console.error('❌ Código:', purchaseResult.error.code);
      console.error('❌ Mensagem:', purchaseResult.error.message);
      console.error('❌ Detalhes:', purchaseResult.error.details);
      console.error('❌ Hint:', purchaseResult.error.hint);
      console.error('❌ ========================================');
      console.error('❌ IMPORTANTE: Sem esta tabela, o LOGIN NÃO FUNCIONARÁ!');
      console.error('❌ ========================================');
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Erro ao salvar compra no banco de dados',
          supabaseError: {
            code: purchaseResult.error.code,
            message: purchaseResult.error.message,
            details: purchaseResult.error.details,
            hint: purchaseResult.error.hint
          },
          eventSaved: true,
          eventId: eventResult.data[0].id,
          userCreated: authUserId ? true : false,
          authUserId: authUserId,
          possibleCauses: [
            'Tabela purchases não existe no Supabase',
            'Credenciais do Supabase sem permissão de escrita',
            'Estrutura da tabela incompatível com os dados',
            'RLS (Row Level Security) bloqueando a inserção'
          ],
          action: 'Verifique o arquivo SUPABASE_SETUP.md para instruções completas'
        },
        { status: 500 }
      );
    }

    console.log('✅ Compra salva com sucesso na tabela purchases!');
    console.log('✅ ID da compra:', purchaseResult.data[0].id);

    // ETAPA 6: Marcar evento como processado
    console.log('✅ ========================================');
    console.log('✅ ETAPA 6: Marcando evento como processado');
    console.log('✅ ========================================');
    
    const updateEventResult = await supabase
      .from('purchase_events')
      .update({ processed: true })
      .eq('id', eventResult.data[0].id);

    if (updateEventResult.error) {
      console.error('⚠️ Erro ao marcar evento como processado:', updateEventResult.error.message);
    } else {
      console.log('✅ Evento marcado como processado!');
    }

    console.log('🎉 ========================================');
    console.log('🎉 COMPRA PROCESSADA COM SUCESSO!');
    console.log('🎉 ========================================');
    console.log('🎉 Email:', normalizedEmail);
    console.log('🎉 Plano:', planName);
    console.log('🎉 Duração:', duration, 'dias');
    console.log('🎉 Data de compra:', purchaseData.purchase_date);
    console.log('🎉 Data de expiração:', purchaseData.expiration_date);
    console.log('🎉 Sale ID:', purchaseData.sale_id || 'N/A');
    console.log('🎉 Transaction ID:', purchaseData.transaction_id || 'N/A');
    console.log('🎉 Valor:', purchaseData.amount || 'N/A');
    console.log('🎉 ========================================');
    console.log('🎉 TABELAS ATUALIZADAS:');
    console.log('🎉 ✅ purchase_events: ID', eventResult.data[0].id, '(processado)');
    console.log('🎉', authUserId ? `✅ auth.users: ID ${authUserId} (USUÁRIO CRIADO NO AUTH!)` : '⚠️ auth.users: ERRO');
    console.log('🎉', profileResult?.data ? `✅ profiles: ID ${profileResult.data[0].id}` : '⚠️ profiles: ERRO');
    console.log('🎉', subscriptionResult?.data ? `✅ subscriptions: ID ${subscriptionResult.data[0].id}` : '⚠️ subscriptions: ERRO');
    console.log('🎉 ✅ purchases: ID', purchaseResult.data[0].id, '(USADO PELO LOGIN)');
    console.log('🎉 ========================================');
    console.log('🎉 ACESSO LIBERADO!');
    console.log('🎉 Usuário pode fazer login com:', normalizedEmail);
    console.log('🎉 Senha temporária foi gerada automaticamente');
    console.log('🎉 ========================================');

    return NextResponse.json(
      {
        success: true,
        message: '🎉 Compra aprovada, usuário criado e acesso liberado com sucesso!',
        data: {
          email: normalizedEmail,
          plan: planName,
          duration: duration,
          purchaseDate: purchaseData.purchase_date,
          expirationDate: purchaseData.expiration_date,
          active: true,
          saleId: purchaseData.sale_id,
          transactionId: purchaseData.transaction_id,
          amount: purchaseData.amount,
          authUserId: authUserId,
          userCreated: authUserId ? true : false,
          tables: {
            auth_users: authUserId || null,
            purchase_events: eventResult.data[0].id,
            profiles: profileResult?.data ? profileResult.data[0].id : null,
            subscriptions: subscriptionResult?.data ? subscriptionResult.data[0].id : null,
            purchases: purchaseResult.data[0].id
          }
        },
        nextSteps: [
          'Usuário foi criado no Supabase Authentication',
          'Usuário pode fazer login na página inicial do app',
          'Use o email: ' + normalizedEmail,
          'Senha temporária foi gerada (usuário pode redefinir depois)',
          'Acesso válido até: ' + purchaseData.expiration_date
        ]
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ ========================================');
    console.error('❌ ERRO CRÍTICO AO PROCESSAR WEBHOOK');
    console.error('❌ ========================================');
    console.error('❌ Erro:', error);
    console.error('❌ Stack:', error instanceof Error ? error.stack : 'N/A');
    console.error('❌ ========================================');
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno ao processar webhook',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
        stack: error instanceof Error ? error.stack : undefined,
        action: 'Verifique os logs do servidor para mais detalhes'
      },
      { status: 500 }
    );
  }
}

// GET - Verificar se o endpoint está funcionando
export async function GET(request: NextRequest) {
  // Verificar credenciais
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  const hasUrl = !!supabaseUrl;
  const hasServiceKey = !!supabaseServiceKey;
  const hasAnonKey = !!supabaseAnonKey;
  const isConfigured = hasUrl && (hasServiceKey || hasAnonKey);

  return NextResponse.json(
    {
      status: 'online',
      message: '✅ Webhook Kirvano endpoint está funcionando!',
      timestamp: new Date().toISOString(),
      webhookUrl: `${request.nextUrl.origin}/api/webhook`,
      supabaseConfigured: isConfigured,
      credentials: {
        NEXT_PUBLIC_SUPABASE_URL: hasUrl ? '✅ Configurado' : '❌ Faltando',
        SUPABASE_SERVICE_ROLE_KEY: hasServiceKey ? '✅ Configurado (RECOMENDADO)' : '⚠️ Faltando',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: hasAnonKey ? '✅ Configurado' : '❌ Faltando'
      },
      recommendation: hasServiceKey 
        ? '✅ Usando SERVICE_ROLE_KEY - Configuração ideal!' 
        : '⚠️ Recomendamos usar SUPABASE_SERVICE_ROLE_KEY para permissões completas',
      tables: {
        auth_users: '⭐ NOVO! Cria usuário no Supabase Authentication (permite login)',
        purchase_events: 'Registra TODOS os eventos recebidos do webhook (para auditoria)',
        profiles: 'Cria/atualiza perfil do usuário com email, full_name e phone',
        subscriptions: 'Registra assinatura ativa com plan_days, purchase_date, expiry_date e status',
        purchases: '⭐ USADO PELO LOGIN - Registra apenas compras APROVADAS para controle de acesso'
      },
      expectedFormat: {
        email: 'usuario@exemplo.com (OBRIGATÓRIO)',
        status: 'APPROVED | approved | paid | pago (OBRIGATÓRIO para processar)',
        event_description: 'Compra aprovada | Purchase approved (opcional)',
        offer_name: 'App CapiCare 30 Dias | App CapiCare 60 Dias | App CapiCare 90 Dias',
        name: 'Nome do Cliente (opcional)',
        phone: 'Telefone do Cliente (opcional)',
        sale_id: 'XJNWEDLY (opcional)',
        transaction_id: 'TXN123456 (opcional)',
        amount: '99.90 (opcional)',
        purchase_date: '2024-01-01T00:00:00.000Z (opcional)',
        created_at: '2024-01-01T00:00:00.000Z (opcional)'
      },
      planMapping: {
        'App CapiCare 30 Dias': '30 dias de acesso',
        'App CapiCare 60 Dias': '60 dias de acesso',
        'App CapiCare 90 Dias': '90 dias de acesso',
        'default': '30 dias (se não identificar o plano)'
      },
      workflow: {
        step1: '📥 Webhook recebe dados da Kirvano',
        step2: '🔑 Valida credenciais do Supabase',
        step3: '💾 Salva evento na tabela purchase_events (SEMPRE - para auditoria)',
        step4: '🔍 Verifica se é compra aprovada (status = APPROVED)',
        step5: '👤 CRIA USUÁRIO NO SUPABASE AUTH (permite login!)',
        step6: '👤 Cria/atualiza perfil na tabela profiles',
        step7: '📋 Cria assinatura na tabela subscriptions (plan_days, expiry_date)',
        step8: '💰 Salva na tabela purchases para controle de acesso (USADO PELO LOGIN)',
        step9: '✅ Marca evento como processado',
        step10: '🎉 Usuário pode fazer login com email e senha temporária!'
      },
      instructions: {
        step1: 'Configure este webhook na Kirvano',
        step2: 'URL do webhook: ' + `${request.nextUrl.origin}/api/webhook`,
        step3: 'Método: POST',
        step4: 'Configure as variáveis de ambiente do Supabase',
        step5: 'Execute o script SQL do arquivo SUPABASE_SETUP.md',
        step6: 'Após compra aprovada, usuário é criado automaticamente no Supabase Auth',
        step7: 'Usuário pode fazer login com o email da compra',
        step8: 'Senha temporária é gerada automaticamente',
        step9: 'Verifique os logs do servidor para debug detalhado (todos os passos são logados)'
      },
      troubleshooting: {
        'Evento não salva': 'Verifique se a tabela purchase_events existe e se as credenciais têm permissão de escrita',
        'Compra não processa': 'Verifique se o status está como APPROVED e se o event_description contém "aprovada"',
        'Usuário não criado no Auth': 'Verifique se está usando SUPABASE_SERVICE_ROLE_KEY (obrigatório para criar usuários)',
        'Erro 401 Unauthorized': 'Credenciais do Supabase incorretas ou sem permissão',
        'Erro 404 Not Found': 'Tabela não existe no Supabase',
        'RLS bloqueando': 'Desabilite RLS nas tabelas ou configure políticas adequadas (ver SUPABASE_SETUP.md)',
        'Login não funciona': 'Verifique se o usuário foi criado no Supabase Authentication (aba Authentication no dashboard)'
      },
      documentation: 'Veja o arquivo SUPABASE_SETUP.md para instruções completas de configuração'
    },
    { status: 200 }
  );
}
