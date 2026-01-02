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
    question: "Como você classificaria a saúde atual do seu cabelo?",
    options: [
      "Excelente - cabelo forte e saudável",
      "Bom - alguns fios fracos",
      "Regular - queda moderada",
      "Ruim - queda intensa"
    ],
    type: 'direct',
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=400&fit=crop" // Cabelo masculino
  },
  {
    id: 2,
    question: "Você sabia que alguns alimentos podem aumentar o crescimento do cabelo?",
    options: ["Sim", "Não"],
    type: 'info',
    educationalContent: {
      title: "O Poder da Alimentação no Crescimento Capilar",
      description: "Alguns alimentos são ricos em vitaminas essenciais como biotina, ferro, zinco e proteínas, capazes de estimular a fase anágena do fio, acelerando o crescimento capilar. Por isso, seu plano será baseado em alimentos simples e acessíveis que realmente favorecem o fortalecimento dos fios."
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
    question: "Você sabia que o sono inadequado pode acelerar a queda capilar?",
    options: ["Sim", "Não"],
    type: 'info',
    educationalContent: {
      title: "Sono e Crescimento Capilar",
      description: "Durante o sono profundo, o corpo libera hormônios essenciais para a regeneração celular, incluindo os folículos capilares. A privação de sono aumenta o cortisol (hormônio do estresse), que pode enfraquecer os fios e acelerar a queda. Dormir bem é fundamental para resultados visíveis."
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
    question: "Você sabia que a hidratação afeta diretamente a saúde dos fios?",
    options: ["Sim", "Não"],
    type: 'info',
    educationalContent: {
      title: "Hidratação e Saúde Capilar",
      description: "A água é essencial para transportar nutrientes até os folículos capilares. A desidratação torna os fios quebradiços e fracos. Beber pelo menos 2 litros de água por dia melhora significativamente a textura e o crescimento do cabelo."
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
    question: "Você sabia que o zinco é crucial para prevenir a queda capilar?",
    options: ["Sim", "Não"],
    type: 'info',
    educationalContent: {
      title: "Zinco: O Mineral Essencial",
      description: "O zinco desempenha papel fundamental na síntese de proteínas e na divisão celular dos folículos capilares. A deficiência de zinco está diretamente ligada à queda de cabelo. Alimentos como carne vermelha, frango, castanhas e feijão são excelentes fontes."
    },
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&h=400&fit=crop" // Castanhas/zinco
  },
  {
    id: 14,
    question: "Há quanto tempo você notou mudanças no seu cabelo?",
    options: [
      "Menos de 3 meses",
      "3-6 meses",
      "6-12 meses",
      "Mais de 1 ano"
    ],
    type: 'direct',
    image: "https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?w=800&h=400&fit=crop" // Espelho/reflexão
  },
  {
    id: 15,
    question: "Qual é o seu principal objetivo com o CapiCare?",
    options: [
      "Reduzir a queda capilar",
      "Acelerar o crescimento",
      "Fortalecer os fios",
      "Todos os acima"
    ],
    type: 'direct',
    image: "https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&h=400&fit=crop" // Objetivo/meta
  },
  {
    id: 16,
    question: "Você tem histórico familiar de calvície?",
    options: [
      "Sim, pai e/ou avô",
      "Sim, outros familiares",
      "Não tenho certeza",
      "Não"
    ],
    type: 'direct',
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=400&fit=crop" // Família
  },
  {
    id: 17,
    question: "Você sabia que a biotina é conhecida como 'vitamina do cabelo'?",
    options: ["Sim", "Não"],
    type: 'info',
    educationalContent: {
      title: "Biotina: A Vitamina do Crescimento",
      description: "A biotina (vitamina B7) é essencial para a produção de queratina, a proteína que forma os fios de cabelo. Ela fortalece a estrutura capilar e estimula o crescimento. Ovos, nozes, abacate e batata-doce são fontes naturais ricas em biotina."
    },
    image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&h=400&fit=crop" // Ovos/biotina
  },
  {
    id: 18,
    question: "Você está disposto a seguir um plano alimentar por 60 dias?",
    options: [
      "Sim, totalmente comprometido",
      "Sim, vou me esforçar",
      "Talvez, depende da dificuldade",
      "Não tenho certeza"
    ],
    type: 'direct',
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=400&fit=crop" // Planejamento/calendário
  }
];
