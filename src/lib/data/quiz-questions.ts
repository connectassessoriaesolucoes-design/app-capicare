export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  type: 'direct' | 'info';
  educationalContent?: {
    title: string;
    description: string;
  };
  image?: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Você já realizou transplante capilar?",
    options: [
      "Sim, há menos de 3 meses",
      "Sim, entre 3-6 meses",
      "Sim, há mais de 6 meses",
      "Não, ainda vou fazer"
    ],
    type: 'direct',
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=400&fit=crop" // Cabelo masculino
  },
  {
    id: 2,
    question: "Você sabia que nutrientes específicos fortalecem os enxertos do transplante?",
    options: ["Sim", "Não"],
    type: 'info',
    educationalContent: {
      title: "Nutrição Para Fortalecer Enxertos",
      description: "Biotina, ferro, zinco e proteínas são essenciais para o fortalecimento dos fios implantados no transplante capilar. Esses nutrientes aceleram o crescimento, reduzem a queda pós-choque e maximizam os resultados do seu procedimento. Seu plano será baseado em alimentos que potencializam o sucesso do transplante."
    },
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=400&fit=crop" // Alimentos saudáveis
  },
  {
    id: 3,
    question: "Com que frequência você consome proteínas (carnes, ovos, leguminosas)?",
    options: [
      "Diariamente",
      "3-4 vezes por semana",
      "1-2 vezes por semana",
      "Raramente"
    ],
    type: 'direct',
    image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&h=400&fit=crop" // Proteínas/ovos
  },
  {
    id: 4,
    question: "Quantas horas você dorme por noite em média?",
    options: [
      "Mais de 8 horas",
      "6-8 horas",
      "4-6 horas",
      "Menos de 4 horas"
    ],
    type: 'direct',
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&h=400&fit=crop" // Cama/sono
  },
  {
    id: 5,
    question: "Você sabia que o sono inadequado pode afetar a fixação dos enxertos?",
    options: ["Sim", "Não"],
    type: 'info',
    educationalContent: {
      title: "Sono e Fortalecimento dos Enxertos",
      description: "Durante o sono profundo, o corpo libera hormônios essenciais para a regeneração celular e fixação dos enxertos. A privação de sono aumenta o cortisol (hormônio do estresse), que pode enfraquecer os fios implantados e comprometer os resultados do transplante. Dormir bem é crucial no pós-operatório."
    },
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=400&fit=crop" // Pessoa dormindo
  },
  {
    id: 6,
    question: "Você pratica atividade física regularmente?",
    options: [
      "Sim, 4+ vezes por semana",
      "Sim, 2-3 vezes por semana",
      "Raramente",
      "Não pratico"
    ],
    type: 'direct',
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop" // Fitness/exercício
  },
  {
    id: 7,
    question: "Com que frequência você consome frutas e vegetais?",
    options: [
      "Diariamente",
      "3-4 vezes por semana",
      "1-2 vezes por semana",
      "Raramente"
    ],
    type: 'direct',
    image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&h=400&fit=crop" // Frutas e vegetais
  },
  {
    id: 8,
    question: "Você toma algum suplemento vitamínico atualmente?",
    options: [
      "Sim, regularmente",
      "Sim, ocasionalmente",
      "Não, mas já tomei",
      "Nunca tomei"
    ],
    type: 'direct',
    image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&h=400&fit=crop" // Vitaminas/suplementos
  },
  {
    id: 9,
    question: "Você sabia que a hidratação é crucial para os enxertos pegarem bem?",
    options: ["Sim", "Não"],
    type: 'info',
    educationalContent: {
      title: "Hidratação e Fixação dos Enxertos",
      description: "A água é essencial para transportar nutrientes até os folículos implantados no transplante. A desidratação compromete a circulação sanguínea na área transplantada, dificultando a fixação dos enxertos. Beber pelo menos 2 litros de água por dia é fundamental no pós-operatório."
    },
    image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&h=400&fit=crop" // Água/hidratação
  },
  {
    id: 10,
    question: "Quantos copos de água você bebe por dia?",
    options: [
      "Mais de 8 copos (2L+)",
      "5-8 copos (1-2L)",
      "2-4 copos (500ml-1L)",
      "Menos de 2 copos"
    ],
    type: 'direct',
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=400&fit=crop" // Copo de água
  },
  {
    id: 11,
    question: "Qual é o seu nível de estresse no dia a dia?",
    options: [
      "Baixo - me sinto tranquilo",
      "Moderado - alguns momentos estressantes",
      "Alto - frequentemente estressado",
      "Muito alto - constantemente sob pressão"
    ],
    type: 'direct',
    image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&h=400&fit=crop" // Estresse/trabalho
  },
  {
    id: 12,
    question: "Você consome alimentos ricos em ômega-3 (peixes, castanhas)?",
    options: [
      "Sim, regularmente",
      "Ocasionalmente",
      "Raramente",
      "Nunca"
    ],
    type: 'direct',
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&h=400&fit=crop" // Peixes/ômega-3
  },
  {
    id: 13,
    question: "Você sabia que o zinco é crucial para o fortalecimento dos enxertos?",
    options: ["Sim", "Não"],
    type: 'info',
    educationalContent: {
      title: "Zinco: Mineral Essencial Pós-Transplante",
      description: "O zinco desempenha papel fundamental na síntese de proteínas e na divisão celular dos folículos implantados. A deficiência de zinco pode comprometer a fixação dos enxertos e reduzir os resultados do transplante. Alimentos como carne vermelha, frango, castanhas e feijão são excelentes fontes."
    },
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&h=400&fit=crop" // Castanhas/zinco
  },
  {
    id: 14,
    question: "Quanto tempo faz que realizou o transplante capilar?",
    options: [
      "Menos de 1 mês",
      "1-3 meses",
      "3-6 meses",
      "Mais de 6 meses"
    ],
    type: 'direct',
    image: "https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?w=800&h=400&fit=crop" // Espelho/reflexão
  },
  {
    id: 15,
    question: "Qual é o seu principal objetivo com o CapiCare?",
    options: [
      "Fortalecer os enxertos implantados",
      "Acelerar o crescimento dos fios",
      "Reduzir a queda pós-choque",
      "Maximizar os resultados do transplante"
    ],
    type: 'direct',
    image: "https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&h=400&fit=crop" // Objetivo/meta
  },
  {
    id: 16,
    question: "Como você avalia a fixação dos enxertos até agora?",
    options: [
      "Excelente - tudo pegou bem",
      "Boa - maioria pegou",
      "Regular - alguns caíram",
      "Ainda é cedo para avaliar"
    ],
    type: 'direct',
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=400&fit=crop" // Família
  },
  {
    id: 17,
    question: "Você sabia que a biotina fortalece os enxertos implantados?",
    options: ["Sim", "Não"],
    type: 'info',
    educationalContent: {
      title: "Biotina: Essencial Pós-Transplante",
      description: "A biotina (vitamina B7) é essencial para a produção de queratina, a proteína que forma os fios implantados. Ela fortalece a estrutura dos enxertos e estimula o crescimento saudável após o transplante. Ovos, nozes, abacate e batata-doce são fontes naturais ricas em biotina."
    },
    image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&h=400&fit=crop" // Ovos/biotina
  },
  {
    id: 18,
    question: "Está disposto a seguir um plano de manutenção pós-transplante por 90 dias?",
    options: [
      "Sim, totalmente comprometido",
      "Sim, vou me dedicar",
      "Talvez, depende da dificuldade",
      "Não tenho certeza"
    ],
    type: 'direct',
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=400&fit=crop" // Planejamento/calendário
  }
];
