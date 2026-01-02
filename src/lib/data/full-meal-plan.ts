// 90 dias de receitas personalizadas com alimentos de fácil acesso
export const fullMealPlan = [
  // Semana 1 (Dias 1-7) - já existente no weeklyMealPlan
  // Semana 2 (Dias 8-14)
  {
    day: 8,
    dayName: "Segunda-feira",
    meals: {
      breakfast: {
        name: "Café Nutritivo",
        items: [
          "Mingau de aveia com banana",
          "1 colher de mel",
          "Café com leite desnatado",
          "5 amêndoas"
        ],
        benefits: "Aveia rica em biotina fortalece os fios"
      },
      lunch: {
        name: "Almoço Proteico",
        items: [
          "Frango desfiado (150g)",
          "Arroz integral",
          "Feijão carioca",
          "Salada de tomate e pepino"
        ],
        benefits: "Proteínas essenciais para crescimento capilar"
      },
      snack: {
        name: "Lanche Rápido",
        items: [
          "Iogurte natural",
          "1 maçã",
          "Granola (2 colheres)"
        ],
        benefits: "Probióticos melhoram absorção de nutrientes"
      },
      dinner: {
        name: "Jantar Leve",
        items: [
          "Omelete de 2 ovos com queijo",
          "Salada verde",
          "Pão integral (1 fatia)"
        ],
        benefits: "Proteínas leves para regeneração noturna"
      }
    }
  },
  {
    day: 9,
    dayName: "Terça-feira",
    meals: {
      breakfast: {
        name: "Café Energético",
        items: [
          "Tapioca com queijo branco",
          "Suco de laranja natural",
          "Mamão papaia"
        ],
        benefits: "Vitamina C aumenta absorção de ferro"
      },
      lunch: {
        name: "Almoço Completo",
        items: [
          "Carne moída refogada (150g)",
          "Macarrão integral",
          "Cenoura ralada",
          "Beterraba cozida"
        ],
        benefits: "Ferro previne queda capilar"
      },
      snack: {
        name: "Lanche da Tarde",
        items: [
          "Pão integral com pasta de amendoim",
          "Banana"
        ],
        benefits: "Gorduras boas nutrem o couro cabeludo"
      },
      dinner: {
        name: "Jantar Saudável",
        items: [
          "Peixe grelhado (120g)",
          "Purê de batata",
          "Brócolis no vapor"
        ],
        benefits: "Ômega-3 promove crescimento saudável"
      }
    }
  },
  {
    day: 10,
    dayName: "Quarta-feira",
    meals: {
      breakfast: {
        name: "Café Vitaminado",
        items: [
          "Vitamina de morango com aveia",
          "Pão francês integral",
          "Queijo minas"
        ],
        benefits: "Antioxidantes protegem os folículos"
      },
      lunch: {
        name: "Almoço Brasileiro",
        items: [
          "Frango assado (150g)",
          "Arroz branco",
          "Feijão preto",
          "Couve refogada"
        ],
        benefits: "Refeição completa e balanceada"
      },
      snack: {
        name: "Lanche Prático",
        items: [
          "Biscoito integral (5 unidades)",
          "Suco de uva integral"
        ],
        benefits: "Energia rápida e saudável"
      },
      dinner: {
        name: "Jantar Reconfortante",
        items: [
          "Sopa de legumes com carne",
          "Torradas integrais"
        ],
        benefits: "Nutrientes variados em refeição leve"
      }
    }
  }
];

// Função para gerar os 90 dias completos
export function generateFullMealPlan() {
  const baseRecipes = [
    {
      breakfast: {
        name: "Café da Manhã Energético",
        items: ["2 ovos mexidos", "Pão integral", "Suco natural", "Frutas"],
        benefits: "Rico em proteínas"
      },
      lunch: {
        name: "Almoço Nutritivo",
        items: ["Carne magra 150g", "Arroz integral", "Feijão", "Salada verde"],
        benefits: "Proteínas e ferro"
      },
      snack: {
        name: "Lanche Saudável",
        items: ["Iogurte natural", "Frutas", "Castanhas"],
        benefits: "Probióticos e vitaminas"
      },
      dinner: {
        name: "Jantar Leve",
        items: ["Frango grelhado 120g", "Legumes", "Salada"],
        benefits: "Proteínas leves"
      }
    },
    {
      breakfast: {
        name: "Café Proteico",
        items: ["Omelete", "Pão de centeio", "Chá verde", "Morangos"],
        benefits: "Antioxidantes"
      },
      lunch: {
        name: "Almoço Completo",
        items: ["Peixe grelhado 150g", "Quinoa", "Brócolis", "Cenoura"],
        benefits: "Ômega-3"
      },
      snack: {
        name: "Lanche Energético",
        items: ["Mix de frutas secas", "Amêndoas", "Maçã"],
        benefits: "Vitaminas do complexo B"
      },
      dinner: {
        name: "Jantar Balanceado",
        items: ["Frango desfiado 120g", "Batata doce", "Salada"],
        benefits: "Carboidratos complexos"
      }
    }
  ];

  const dayNames = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"];
  
  const fullPlan = [];
  
  for (let day = 1; day <= 90; day++) {
    const recipeIndex = day % baseRecipes.length;
    const dayNameIndex = (day - 1) % 7;
    
    fullPlan.push({
      day,
      dayName: dayNames[dayNameIndex],
      meals: baseRecipes[recipeIndex]
    });
  }
  
  return fullPlan;
}
