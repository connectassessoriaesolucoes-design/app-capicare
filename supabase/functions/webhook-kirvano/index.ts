// Edge Function para processar webhook da Kirvano
// Deploy: supabase functions deploy webhook-kirvano

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

// Interface para os dados recebidos do webhook Kirvano
interface KirvanoWebhookData {
  email?: string;
  contactEmail?: string;
  customer?: {
    email?: string;
    name?: string;
    phone_number?: string;
    document?: string;
  };
  status?: string;
  event?: string;
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
  products?: Array<{
    name?: string;
    offer_name?: string;
    price?: string;
  }>;
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
  
  console.log('⚠️ Não foi possível identificar duração do plano, usando 30 dias como padrão');
  return 30;
}

serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('📥 ========================================');
    console.log('📥 WEBHOOK KIRVANO RECEBIDO (Edge Function)');
    console.log('📥 ========================================');
    console.log('📥 Timestamp:', new Date().toISOString());

    // Criar cliente Supabase com SERVICE_ROLE_KEY
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    console.log('🔑 Verificando credenciais:');
    console.log('🔑 - SUPABASE_URL:', supabaseUrl ? '✅ Configurada' : '❌ FALTANDO');
    console.log('🔑 - SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Configurada' : '❌ FALTANDO');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Credenciais do Supabase não configuradas no Edge Function');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Pegar o corpo da requisição
    const body: KirvanoWebhookData = await req.json();

    console.log('📥 Dados completos recebidos:');
    console.log(JSON.stringify(body, null, 2));

    // Extrair email (CORRIGIDO: buscar em customer.email, contactEmail e email)
    const email = body.customer?.email || body.contactEmail || body.email || body.Email || body.EMAIL;
    
    // Extrair status
    const status = body.status || body.Status || body.STATUS;
    
    // Extrair descrição do evento
    const eventDescription = body.event_description || body.eventDescription || body.Event_Description;
    
    // Extrair nome da oferta (buscar em products[0].offer_name também)
    const offerName = body.offer_name || 
                      body.offerName || 
                      body.Offer_Name || 
                      body.product_name || 
                      body.productName ||
                      (body.products && body.products[0]?.offer_name);
    
    console.log('🔍 Campos extraídos:');
    console.log('🔍 - email:', email || '❌ NÃO ENCONTRADO');
    console.log('🔍 - status:', status || '❌ NÃO ENCONTRADO');
    console.log('🔍 - event_description:', eventDescription || 'N/A');
    console.log('🔍 - offer_name:', offerName || 'N/A');
    
    // Validar email
    if (!email) {
      console.error('❌ Email não encontrado no webhook');
      console.error('📋 Estrutura recebida:', JSON.stringify({
        hasCustomer: !!body.customer,
        hasContactEmail: !!body.contactEmail,
        hasEmail: !!body.email,
        customerKeys: body.customer ? Object.keys(body.customer) : [],
        topLevelKeys: Object.keys(body)
      }, null, 2));
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Campo "email" é obrigatório. Verifique se está em customer.email, contactEmail ou email',
          receivedFields: Object.keys(body),
          customerFields: body.customer ? Object.keys(body.customer) : []
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Normalizar email
    const normalizedEmail = email.toLowerCase().trim();
    console.log('📧 Email normalizado:', normalizedEmail);

    // Determinar duração
    const planName = offerName || 'App CapiCare 30 Dias';
    const duration = getPlanDuration(planName);
    console.log('📊 Plano identificado:', planName);
    console.log('📊 Duração:', duration, 'dias');

    // Verificar se é compra aprovada
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

    // ETAPA 1: SALVAR EVENTO (SEMPRE)
    console.log('💾 ========================================');
    console.log('💾 ETAPA 1: Salvando evento na tabela purchase_events');
    
    const eventData = {
      email: normalizedEmail,
      plan_days: duration,
      event_type: isApproved || isCompraAprovada ? 'purchase_approved' : 'purchase_pending',
      event_data: body,
      processed: false,
      created_at: new Date().toISOString()
    };

    const { data: eventResult, error: eventError } = await supabase
      .from('purchase_events')
      .insert([eventData])
      .select();

    if (eventError) {
      console.error('❌ ERRO ao salvar evento:', eventError.message);
      throw eventError;
    }

    console.log('✅ Evento salvo com sucesso! ID:', eventResult[0].id);

    // Se não for aprovado, apenas salvar evento
    if (!isApproved && !isCompraAprovada) {
      console.log('⚠️ Webhook recebido mas NÃO é uma compra aprovada');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Evento registrado mas não é uma compra aprovada',
          eventSaved: true,
          eventId: eventResult[0].id
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('✅ COMPRA APROVADA DETECTADA! Iniciando processamento...');

    // Data de compra e expiração
    const purchaseDate = body.purchase_date || body.created_at || body.date || body.Date
      ? new Date(body.purchase_date || body.created_at || body.date || body.Date) 
      : new Date();

    const expirationDate = new Date(purchaseDate);
    expirationDate.setDate(expirationDate.getDate() + duration);

    console.log('📅 Data de compra:', purchaseDate.toISOString());
    console.log('📅 Data de expiração:', expirationDate.toISOString());

    // ETAPA 2: CRIAR USUÁRIO NO SUPABASE AUTH
    console.log('👤 ========================================');
    console.log('👤 ETAPA 2: Criando usuário no Supabase Auth');
    
    // Extrair nome do cliente (buscar em customer.name também)
    const fullName = body.customer?.name || body.name || body.full_name || body.customer_name || 'Usuário';
    console.log('👤 Nome do cliente:', fullName);
    
    const tempPassword = `CapiCare${Math.random().toString(36).substring(2, 10)}!`;
    
    let authUserId = null;
    let userAlreadyExists = false;
    
    // Verificar se usuário já existe
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
    
    if (!listError && existingUsers) {
      const existingUser = existingUsers.users.find(u => u.email === normalizedEmail);
      if (existingUser) {
        console.log('🔄 Usuário já existe no Auth (ID:', existingUser.id, ')');
        authUserId = existingUser.id;
        userAlreadyExists = true;
      }
    }
    
    if (!userAlreadyExists) {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: normalizedEmail,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
          plan: planName,
          duration: duration,
          purchase_date: purchaseDate.toISOString(),
          expiration_date: expirationDate.toISOString()
        }
      });

      if (authError) {
        console.error('❌ ERRO ao criar usuário no Auth:', authError.message);
        console.error('⚠️ Continuando processamento...');
      } else {
        console.log('✅ USUÁRIO CRIADO NO SUPABASE AUTH!');
        console.log('✅ User ID:', authData.user.id);
        authUserId = authData.user.id;
      }
    }

    // ETAPA 3: CRIAR/ATUALIZAR PERFIL
    console.log('👤 ========================================');
    console.log('👤 ETAPA 3: Processando perfil');
    
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', normalizedEmail)
      .maybeSingle();

    const profileData: any = {
      email: normalizedEmail,
      updated_at: new Date().toISOString()
    };

    if (fullName) profileData.full_name = fullName;
    
    // Extrair telefone (buscar em customer.phone_number também)
    const phone = body.customer?.phone_number || body.phone || body.telephone || body.customer_phone;
    if (phone) profileData.phone = phone;
    
    if (authUserId) profileData.id = authUserId;

    if (existingProfile) {
      await supabase
        .from('profiles')
        .update(profileData)
        .eq('email', normalizedEmail);
      console.log('✅ Perfil atualizado!');
    } else {
      profileData.created_at = new Date().toISOString();
      await supabase
        .from('profiles')
        .insert([profileData]);
      console.log('✅ Perfil criado!');
    }

    // ETAPA 4: CRIAR ASSINATURA
    console.log('📋 ========================================');
    console.log('📋 ETAPA 4: Criando assinatura');
    
    const subscriptionData = {
      email: normalizedEmail,
      plan_days: duration,
      purchase_date: purchaseDate.toISOString(),
      expiry_date: expirationDate.toISOString(),
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await supabase
      .from('subscriptions')
      .insert([subscriptionData]);
    
    console.log('✅ Assinatura criada!');

    // ETAPA 5: SALVAR COMPRA
    console.log('💰 ========================================');
    console.log('💰 ETAPA 5: Salvando compra (USADO PELO LOGIN)');
    
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

    const { data: purchaseResult, error: purchaseError } = await supabase
      .from('purchases')
      .insert([purchaseData])
      .select();

    if (purchaseError) {
      console.error('❌ ERRO CRÍTICO ao salvar compra:', purchaseError.message);
      throw purchaseError;
    }

    console.log('✅ Compra salva! ID:', purchaseResult[0].id);

    // ETAPA 6: Marcar evento como processado
    await supabase
      .from('purchase_events')
      .update({ processed: true })
      .eq('id', eventResult[0].id);

    console.log('🎉 ========================================');
    console.log('🎉 COMPRA PROCESSADA COM SUCESSO!');
    console.log('🎉 Email:', normalizedEmail);
    console.log('🎉 Plano:', planName);
    console.log('🎉 Duração:', duration, 'dias');
    console.log('🎉 ACESSO LIBERADO!');
    console.log('🎉 ========================================');

    return new Response(
      JSON.stringify({
        success: true,
        message: '🎉 Compra aprovada, usuário criado e acesso liberado!',
        data: {
          email: normalizedEmail,
          plan: planName,
          duration: duration,
          purchaseDate: purchaseData.purchase_date,
          expirationDate: purchaseData.expiration_date,
          authUserId: authUserId,
          userCreated: authUserId ? true : false
        }
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('❌ ERRO CRÍTICO:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Erro ao processar webhook',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
})
