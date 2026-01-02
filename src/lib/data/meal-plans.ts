export const pricingPlans = [
  {
    id: 1,
    name: "Plano 30 Dias",
    duration: "30 dias",
    price: 19.90,
    originalPrice: null,
    highlighted: false,
    features: [
      "Receitas avançadas para crescimento capilar",
      "Chat ao vivo com outros membros",
      "Calendário de acompanhamento",
      "Envio de selfies semanais para progresso",
      "Suporte via e-mail"
    ]
  },
  {
    id: 2,
    name: "Plano 60 Dias",
    duration: "60 dias",
    price: 29.90,
    originalPrice: 39.80,
    highlighted: true,
    features: [
      "Tudo do plano de 30 dias",
      "Receitas premium exclusivas",
      "Acompanhamento detalhado de progresso",
      "Comunidade exclusiva de membros",
      "Suporte prioritário",
      "Economia de R$ 9,90"
    ]
  },
  {
    id: 3,
    name: "Plano 90 Dias",
    duration: "90 dias",
    price: 49.90,
    originalPrice: 59.70,
    highlighted: false,
    features: [
      "Tudo do plano de 60 dias",
      "Plano alimentar completo de 3 meses",
      "Consultoria nutricional personalizada",
      "Acesso vitalício à comunidade",
      "Certificado de conclusão",
      "Economia de R$ 9,80"
    ]
  }
];

export const freePlan = {
  name: "Plano Gratuito",
  duration: "7 dias",
  features: [
    "Receitas básicas para 7 dias",
    "Checklist de refeições",
    "Acesso ao aplicativo",
    "Dicas de crescimento capilar"
  ]
};

export const weeklyMealPlan = [
  {
    day: 1,
    dayName: "Segunda-feira",
    meals: {
      breakfast: {
        name: "Café da Manhã Energético",
        items: [
          "2 ovos mexidos com espinafre",
          "1 fatia de pão integral",
          "1 copo de suco de laranja natural",
          "1 punhado de castanhas"
        ],
        benefits: "Rico em proteínas e vitaminas A, C e E para fortalecer os folículos capilares"
      },
      lunch: {
        name: "Almoço Nutritivo",
        items: [
          "Filé de salmão grelhado (150g)",
          "Arroz integral (3 colheres)",
          "Brócolis no vapor",
          "Salada verde com cenoura"
        ],
        benefits: "Ômega-3 do salmão promove crescimento capilar saudável"
      },
      snack: {
        name: "Lanche da Tarde",
        items: [
          "1 iogurte natural",
          "1 banana",
          "1 colher de sopa de chia"
        ],
        benefits: "Probióticos e fibras para melhor absorção de nutrientes"
      },
      dinner: {
        name: "Jantar Leve",
        items: [
          "Peito de frango grelhado (120g)",
          "Batata doce assada",
          "Legumes refogados (abobrinha, cenoura)"
        ],
        benefits: "Proteínas magras essenciais para regeneração capilar"
      }
    }
  },
  {
    day: 2,
    dayName: "Terça-feira",
    meals: {
      breakfast: {
        name: "Café Proteico",
        items: [
          "Omelete com tomate e queijo branco",
          "1 fatia de pão de centeio",
          "Chá verde",
          "Morangos frescos"
        ],
        benefits: "Antioxidantes do chá verde combatem radicais livres"
      },
      lunch: {
        name: "Almoço Completo",
        items: [
          "Carne magra grelhada (150g)",
          "Quinoa cozida (4 colheres)",
          "Couve refogada",
          "Tomate cereja"
        ],
        benefits: "Ferro e zinco essenciais para prevenir queda capilar"
      },
      snack: {
        name: "Lanche Energético",
        items: [
          "Mix de frutas secas",
          "10 amêndoas",
          "1 maçã"
        ],
        benefits: "Vitaminas do complexo B para saúde do couro cabeludo"
      },
      dinner: {
        name: "Jantar Balanceado",
        items: [
          "Peixe branco ao forno (120g)",
          "Purê de abóbora",
          "Salada de rúcula com nozes"
        ],
        benefits: "Proteínas leves e ácidos graxos para nutrição noturna"
      }
    }
  },
  {
    day: 3,
    dayName: "Quarta-feira",
    meals: {
      breakfast: {
        name: "Café Vitaminado",
        items: [
          "Vitamina de abacate com aveia",
          "2 fatias de queijo branco",
          "Granola caseira",
          "Suco de acerola"
        ],
        benefits: "Gorduras boas do abacate nutrem profundamente os fios"
      },
      lunch: {
        name: "Almoço Mediterrâneo",
        items: [
          "Frango ao curry (150g)",
          "Arroz integral com lentilha",
          "Berinjela grelhada",
          "Salada de folhas verdes"
        ],
        benefits: "Especiarias melhoram circulação no couro cabeludo"
      },
      snack: {
        name: "Lanche Tropical",
        items: [
          "Smoothie de manga com linhaça",
          "Biscoitos integrais (3 unidades)"
        ],
        benefits: "Vitamina A da manga fortalece os fios"
      },
      dinner: {
        name: "Jantar Vegetariano",
        items: [
          "Tofu grelhado com gergelim",
          "Macarrão integral",
          "Legumes salteados"
        ],
        benefits: "Proteínas vegetais e cálcio para estrutura capilar"
      }
    }
  },
  {
    day: 4,
    dayName: "Quinta-feira",
    meals: {
      breakfast: {
        name: "Café Completo",
        items: [
          "Panqueca de aveia com banana",
          "Mel orgânico",
          "Café com leite",
          "Mamão papaia"
        ],
        benefits: "Carboidratos complexos fornecem energia sustentada"
      },
      lunch: {
        name: "Almoço Brasileiro",
        items: [
          "Bife de patinho (150g)",
          "Feijão preto",
          "Arroz integral",
          "Couve-flor gratinada"
        ],
        benefits: "Ferro do feijão previne anemia e queda capilar"
      },
      snack: {
        name: "Lanche Cremoso",
        items: [
          "Iogurte grego com mel",
          "Granola",
          "Kiwi picado"
        ],
        benefits: "Vitamina C do kiwi aumenta absorção de ferro"
      },
      dinner: {
        name: "Jantar Asiático",
        items: [
          "Salmão teriyaki (120g)",
          "Arroz integral",
          "Edamame",
          "Pepino japonês"
        ],
        benefits: "Ômega-3 e proteínas de alta qualidade"
      }
    }
  },
  {
    day: 5,
    dayName: "Sexta-feira",
    meals: {
      breakfast: {
        name: "Café Energizante",
        items: [
          "Tapioca com ovo e queijo",
          "Suco verde (couve, limão, gengibre)",
          "Abacaxi em cubos"
        ],
        benefits: "Enzimas do abacaxi auxiliam digestão de proteínas"
      },
      lunch: {
        name: "Almoço Colorido",
        items: [
          "Frango grelhado com ervas (150g)",
          "Batata baroa cozida",
          "Mix de legumes (cenoura, vagem, beterraba)",
          "Salada de agrião"
        ],
        benefits: "Variedade de nutrientes para saúde capilar completa"
      },
      snack: {
        name: "Lanche Prático",
        items: [
          "Pasta de amendoim integral",
          "Torradas integrais (2 unidades)",
          "Uvas vermelhas"
        ],
        benefits: "Proteínas vegetais e resveratrol das uvas"
      },
      dinner: {
        name: "Jantar Leve",
        items: [
          "Omelete de claras com cogumelos",
          "Salada caprese",
          "Sopa de legumes"
        ],
        benefits: "Refeição leve para melhor qualidade do sono"
      }
    }
  },
  {
    day: 6,
    dayName: "Sábado",
    meals: {
      breakfast: {
        name: "Café Especial",
        items: [
          "Pão integral com abacate amassado",
          "Ovos pochê (2 unidades)",
          "Tomate cereja",
          "Café coado"
        ],
        benefits: "Gorduras saudáveis e proteínas para o fim de semana"
      },
      lunch: {
        name: "Almoço Festivo",
        items: [
          "Picanha magra (150g)",
          "Farofa de quinoa",
          "Vinagrete",
          "Mandioca cozida"
        ],
        benefits: "Proteínas e carboidratos para energia extra"
      },
      snack: {
        name: "Lanche Gourmet",
        items: [
          "Queijo cottage",
          "Frutas vermelhas",
          "Nozes e castanhas"
        ],
        benefits: "Antioxidantes das frutas vermelhas protegem os fios"
      },
      dinner: {
        name: "Jantar Italiano",
        items: [
          "Peixe ao molho de tomate (120g)",
          "Espaguete integral",
          "Salada verde com azeite"
        ],
        benefits: "Licopeno do tomate protege contra danos celulares"
      }
    }
  },
  {
    day: 7,
    dayName: "Domingo",
    meals: {
      breakfast: {
        name: "Café Relaxante",
        items: [
          "Crepioca com queijo e tomate",
          "Suco de melancia",
          "Castanha do Pará (3 unidades)"
        ],
        benefits: "Selênio da castanha fortalece o sistema imunológico"
      },
      lunch: {
        name: "Almoço Familiar",
        items: [
          "Frango assado com batatas (150g)",
          "Arroz integral",
          "Feijão",
          "Salada de alface e tomate"
        ],
        benefits: "Refeição completa e balanceada para encerrar a semana"
      },
      snack: {
        name: "Lanche Doce",
        items: [
          "Vitamina de frutas com aveia",
          "Biscoito de polvilho (5 unidades)"
        ],
        benefits: "Carboidratos e vitaminas para energia"
      },
      dinner: {
        name: "Jantar Reconfortante",
        items: [
          "Sopa de legumes com frango desfiado",
          "Torradas integrais",
          "Salada de folhas"
        ],
        benefits: "Refeição leve e nutritiva para preparar para nova semana"
      }
    }
  }
];
