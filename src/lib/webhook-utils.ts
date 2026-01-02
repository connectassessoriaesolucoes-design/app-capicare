// Utilitários para gerenciar planos de usuários

export interface UserPlan {
  email: string;
  plan: string;
  duration: number;
  purchaseDate: string;
  expirationDate: string;
  transactionId?: string;
  amount?: number;
  active: boolean;
}

// Salvar plano do usuário no localStorage
export function saveUserPlan(userData: UserPlan): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(`user_plan_${userData.email}`, JSON.stringify(userData));
    console.log('✅ Plano do usuário salvo:', userData.email);
  } catch (error) {
    console.error('❌ Erro ao salvar plano:', error);
  }
}

// Buscar plano do usuário
export function getUserPlan(email: string): UserPlan | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const data = localStorage.getItem(`user_plan_${email}`);
    if (!data) return null;
    
    const plan: UserPlan = JSON.parse(data);
    
    // Verificar se o plano ainda está ativo
    const now = new Date();
    const expiration = new Date(plan.expirationDate);
    
    if (now > expiration) {
      plan.active = false;
      saveUserPlan(plan); // Atualizar status
    }
    
    return plan;
  } catch (error) {
    console.error('❌ Erro ao buscar plano:', error);
    return null;
  }
}

// Verificar se usuário tem plano ativo
export function hasActivePlan(email: string): boolean {
  const plan = getUserPlan(email);
  return plan !== null && plan.active;
}

// Verificar se usuário tem um plano específico
export function hasPlan(email: string, planName: string): boolean {
  const plan = getUserPlan(email);
  return plan !== null && plan.active && plan.plan === planName;
}

// Obter dias restantes do plano
export function getDaysRemaining(email: string): number {
  const plan = getUserPlan(email);
  if (!plan || !plan.active) return 0;
  
  const now = new Date();
  const expiration = new Date(plan.expirationDate);
  const diff = expiration.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  
  return days > 0 ? days : 0;
}

// Obter duração total do plano (30, 60 ou 90 dias)
export function getPlanDuration(email: string): number {
  const plan = getUserPlan(email);
  if (!plan) return 0;
  
  return plan.duration;
}

// Verificar se email tem acesso (baseado no plano ativo)
export function checkEmailAccess(email: string): {
  hasAccess: boolean;
  daysRemaining: number;
  planDuration: number;
  expirationDate: string | null;
} {
  const plan = getUserPlan(email);
  
  if (!plan || !plan.active) {
    return {
      hasAccess: false,
      daysRemaining: 0,
      planDuration: 0,
      expirationDate: null
    };
  }
  
  return {
    hasAccess: true,
    daysRemaining: getDaysRemaining(email),
    planDuration: plan.duration,
    expirationDate: plan.expirationDate
  };
}

// Remover plano do usuário
export function removeUserPlan(email: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(`user_plan_${email}`);
    console.log('✅ Plano removido:', email);
  } catch (error) {
    console.error('❌ Erro ao remover plano:', error);
  }
}

// Listar todos os planos salvos (admin)
export function getAllUserPlans(): UserPlan[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const plans: UserPlan[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('user_plan_')) {
        const data = localStorage.getItem(key);
        if (data) {
          plans.push(JSON.parse(data));
        }
      }
    }
    
    return plans;
  } catch (error) {
    console.error('❌ Erro ao listar planos:', error);
    return [];
  }
}

// Simular recebimento de webhook (para testes)
export function simulateWebhookPurchase(email: string, planName: string): void {
  if (typeof window === 'undefined') return;
  
  // Determinar duração baseado no nome do plano
  let duration = 30;
  if (planName.includes('60 dias')) {
    duration = 60;
  } else if (planName.includes('90 dias')) {
    duration = 90;
  }
  
  const purchaseDate = new Date();
  const expirationDate = new Date(purchaseDate);
  expirationDate.setDate(expirationDate.getDate() + duration);
  
  const userData: UserPlan = {
    email: email.toLowerCase().trim(),
    plan: planName,
    duration: duration,
    purchaseDate: purchaseDate.toISOString(),
    expirationDate: expirationDate.toISOString(),
    transactionId: `TEST_${Date.now()}`,
    amount: duration === 30 ? 49 : duration === 60 ? 97 : 147,
    active: true
  };
  
  saveUserPlan(userData);
  console.log('✅ Compra simulada:', userData);
}
