export const pricingPlans = [
  {
    id: 1,
    name: "Plano 30 Dias",
    duration: "30 dias",
    price: 9.90,
    originalPrice: null,
    highlighted: false,
    features: [
      "30 dias de receitas para fortalecimento",
      "Acompanhamento visual da área implantada",
      "Nutrientes focados no pós-transplante",
      "Suporte via chat da comunidade",
      "Orientações de manutenção contínua"
    ]
  },
  {
    id: 2,
    name: "Plano 60 Dias",
    duration: "60 dias",
    price: 14.90,
    originalPrice: 19.80,
    highlighted: true,
    features: [
      "Tudo do plano mensal +",
      "60 dias de acompanhamento completo",
      "Análises de crescimento mensais",
      "Relatórios de fortalecimento",
      "Webinars sobre cuidados pós-transplante"
    ]
  },
  {
    id: 3,
    name: "Plano 90 Dias",
    duration: "90 dias",
    price: 24.90,
    originalPrice: 29.70,
    highlighted: false,
    features: [
      "Tudo do plano trimestral +",
      "90 dias completos de fortalecimento",
      "Consultoria para máximos resultados",
      "Acompanhamento completo pós-transplante",
      "Garantia de satisfação de 30 dias"
    ]
  }
];

export const freePlan = {
  name: "Plano Gratuito",
  duration: "1 dia",
  features: [
    "Receitas básicas para 1 dia",
    "4 refeições completas",
    "Acesso ao aplicativo",
    "Dicas de fortalecimento dos enxertos"
  ]
};

export const weeklyMealPlan = [
  {
    day: 1,
    dayName: "Dia 1",
    meals: {
      breakfast: {
        name: "Café da Manhã Simples",
        items: [
          "2 ovos cozidos",
          "2 fatias de pão integral",
          "1 banana",
          "1 copo de leite"
        ],
        benefits: "Proteínas e vitaminas essenciais para fortalecer os enxertos"
      },
      lunch: {
        name: "Almoço Completo",
        items: [
          "Peito de frango grelhado (150g)",
          "Arroz branco (4 colheres)",
          "Feijão (2 colheres)",
          "Salada de alface e tomate"
        ],
        benefits: "Proteínas e ferro para fortalecimento capilar"
      },
      snack: {
        name: "Lanche da Tarde",
        items: [
          "1 iogurte natural",
          "1 maçã",
          "1 punhado de amendoim"
        ],
        benefits: "Nutrientes para manutenção dos fios implantados"
      },
      dinner: {
        name: "Jantar Leve",
        items: [
          "Omelete simples (2 ovos)",
          "Batata cozida",
          "Salada de tomate"
        ],
        benefits: "Proteínas para regeneração dos enxertos"
      }
    }
  }
];

export default { pricingPlans, freePlan, weeklyMealPlan };
