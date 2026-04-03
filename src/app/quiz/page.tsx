"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { quizQuestions } from "@/lib/data/quiz-questions";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Calcula o nível de tratamento com base nas respostas
function calcTreatmentLevel(answers: Record<number, string>): string {
  const q1 = answers[1] || "";
  const q2 = answers[2] || "";
  const q3 = answers[3] || "";
  const q4 = answers[4] || "";

  let score = 0;

  // Q1 - tempo do transplante (quanto mais recente, mais cuidado precisa)
  if (q1.includes("Menos de 1 mês")) score += 4;
  else if (q1.includes("1 e 3")) score += 3;
  else if (q1.includes("3 e 6")) score += 2;
  else score += 1;

  // Q2 - fixação dos enxertos
  if (q2.includes("Muito boa")) score += 1;
  else if (q2.includes("Boa")) score += 2;
  else if (q2.includes("Regular")) score += 3;
  else score += 2;

  // Q3 - alimentação
  if (q3.includes("Ótima")) score += 1;
  else if (q3.includes("Boa")) score += 2;
  else if (q3.includes("Regular")) score += 3;
  else score += 4;

  // Q4 - protocolo
  if (q4.includes("Sim, sigo totalmente")) score += 1;
  else if (q4.includes("Parcialmente")) score += 2;
  else if (q4.includes("tentando")) score += 3;
  else score += 4;

  if (score <= 6) return "avançado";
  if (score <= 10) return "intermediário";
  return "iniciante";
}

export default function QuizPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const isLastQuestion = currentQuestion === quizQuestions.length - 1;
  const currentQuestionData = quizQuestions[currentQuestion];

  const handleAnswer = (answer: string) => {
    const newAnswers = { ...answers, [currentQuestionData.id]: answer };
    setAnswers(newAnswers);

    if (isLastQuestion) {
      handleFinish(newAnswers);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleFinish = async (finalAnswers: Record<number, string>) => {
    setIsProcessing(true);

    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('quizAnswers', JSON.stringify(finalAnswers));
        localStorage.setItem('quizCompleted', 'true');
      }

      const treatmentLevel = calcTreatmentLevel(finalAnswers);
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');

      if (userData?.email) {
        await fetch('/api/save-quiz-answers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: userData.email,
            answers: finalAnswers,
            treatmentLevel
          })
        }).catch(() => null);

        // Atualiza userData com nível
        localStorage.setItem('userData', JSON.stringify({
          ...userData,
          treatmentLevel,
          quizCompleted: true
        }));
      }

      setTimeout(() => {
        router.push('/plano');
      }, 300);
    } catch (error) {
      console.error("Erro ao finalizar quiz:", error);
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/50">
            <CheckCircle className="h-10 w-10 text-white animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Analisando suas respostas...</h2>
          <p className="text-blue-100">Preparando seu plano personalizado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Link href="/">
          <img
            src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/29fa0a57-c30e-4ec6-a969-ae518331ec99.png"
            alt="CapiCare Logo"
            className="h-12 w-auto mx-auto mb-8"
          />
        </Link>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-blue-300">Pergunta {currentQuestion + 1} de {quizQuestions.length}</span>
            <span className="text-sm font-medium text-cyan-400">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2 bg-white/10" />
        </div>

        <Card className="p-8 shadow-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden">
          {currentQuestionData.image && (
            <div className="mb-6 -mx-8 -mt-8">
              <img
                src={currentQuestionData.image}
                alt="Ilustração da pergunta"
                className="w-full h-48 md:h-56 object-cover"
              />
            </div>
          )}

          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
            {currentQuestionData.question}
          </h2>

          <div className="space-y-3">
            {currentQuestionData.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="w-full p-4 text-left border-2 border-white/10 rounded-xl hover:border-cyan-400 hover:bg-cyan-500/10 transition-all duration-200 group backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full border-2 border-white/30 group-hover:border-cyan-400 flex items-center justify-center flex-shrink-0">
                    <div className="w-3 h-3 rounded-full bg-transparent group-hover:bg-cyan-400" />
                  </div>
                  <span className="text-blue-100 group-hover:text-white font-medium">
                    {option}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {currentQuestion > 0 && (
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
              className="mt-6 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          )}
        </Card>

        <p className="text-center text-sm text-blue-200 mt-6">
          Suas respostas nos ajudam a criar o plano perfeito para você
        </p>
      </div>
    </div>
  );
}
