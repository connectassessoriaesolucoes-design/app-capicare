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
    image: "https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?w=800&h=400&fit=crop"
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
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=400&fit=crop"
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
    image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&h=400&fit=crop"
  },
  {
    id: 4,
    question: "Você sabia que o sono inadequado pode afetar a fixação dos enxertos?",
    options: ["Sim", "Não"],
    type: 'info',
    educationalContent: {
      title: "Sono e Fortalecimento dos Enxertos",
      description: "Durante o sono profundo, o corpo libera hormônios essenciais para a regeneração celular e fixação dos enxertos. A privação de sono aumenta o cortisol (hormônio do estresse), que pode enfraquecer os fios implantados e comprometer os resultados do transplante. Dormir bem é crucial no pós-operatório."
    },
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=400&fit=crop"
  },
  {
    id: 5,
    question: "Quantas horas você dorme por noite em média?",
    options: [
      "Mais de 8 horas",
      "6-8 horas",
      "4-6 horas",
      "Menos de 4 horas"
    ],
    type: 'direct',
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&h=400&fit=crop"
  },
  {
    id: 6,
    question: "Você sabia que a hidratação é crucial para os enxertos pegarem bem?",
    options: ["Sim", "Não"],
    type: 'info',
    educationalContent: {
      title: "Hidratação e Fixação dos Enxertos",
      description: "A água é essencial para transportar nutrientes até os folículos implantados no transplante. A desidratação compromete a circulação sanguínea na área transplantada, dificultando a fixação dos enxertos. Beber pelo menos 2 litros de água por dia é fundamental no pós-operatório."
    },
    image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&h=400&fit=crop"
  },
  {
    id: 7,
    question: "Quantos copos de água você bebe por dia?",
    options: [
      "Mais de 8 copos (2L+)",
      "5-8 copos (1-2L)",
      "2-4 copos (500ml-1L)",
      "Menos de 2 copos"
    ],
    type: 'direct',
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=400&fit=crop"
  },
  {
    id: 8,
    question: "Qual é o seu principal objetivo com o CapiCare?",
    options: [
      "Fortalecer os enxertos implantados",
      "Acelerar o crescimento dos fios",
      "Reduzir a queda pós-choque",
      "Maximizar os resultados do transplante"
    ],
    type: 'direct',
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=400&fit=crop"
  },
  {
    id: 9,
    question: "Como você avalia a fixação dos enxertos até agora?",
    options: [
      "Excelente - tudo pegou bem",
      "Boa - maioria pegou",
      "Regular - alguns caíram",
      "Ainda é cedo para avaliar"
    ],
    type: 'direct',
    image: "https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?w=800&h=400&fit=crop"
  },
  {
    id: 10,
    question: "Está disposto a seguir um plano de manutenção pós-transplante por 90 dias?",
    options: [
      "Sim, totalmente comprometido",
      "Sim, vou me dedicar",
      "Talvez, depende da dificuldade",
      "Não tenho certeza"
    ],
    type: 'direct',
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=400&fit=crop"
  }
];
