export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  type: 'direct';
  image?: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Há quanto tempo você realizou o transplante capilar?",
    options: [
      "Menos de 1 mês",
      "Entre 1 e 3 meses",
      "Entre 3 e 6 meses",
      "Mais de 6 meses"
    ],
    type: 'direct',
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80"
  },
  {
    id: 2,
    question: "Como você avalia a fixação dos enxertos até o momento?",
    options: [
      "Muito boa — área densa e uniforme",
      "Boa — mas com algumas falhas",
      "Regular — queda pós-choque ainda presente",
      "Ainda não consigo avaliar"
    ],
    type: 'direct',
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80"
  },
  {
    id: 3,
    question: "Como está sua alimentação no pós-operatório?",
    options: [
      "Ótima — rica em proteínas, biotina e zinco",
      "Boa — procuro me alimentar bem",
      "Regular — ainda não ajustei a dieta",
      "Ruim — não tive orientação sobre alimentação"
    ],
    type: 'direct',
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80"
  },
  {
    id: 4,
    question: "Você está seguindo algum protocolo de cuidados pós-transplante?",
    options: [
      "Sim, sigo totalmente as recomendações do médico",
      "Parcialmente — faço o básico",
      "Estou tentando, mas tenho dificuldades",
      "Não tenho protocolo definido"
    ],
    type: 'direct',
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80"
  },
  {
    id: 5,
    question: "Qual é o seu principal objetivo agora com o CapiCare?",
    options: [
      "Fortalecer os enxertos e garantir que peguem bem",
      "Acelerar o crescimento dos fios implantados",
      "Reduzir a queda pós-choque",
      "Ter um plano completo de manutenção pós-transplante"
    ],
    type: 'direct',
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&q=80"
  }
];
