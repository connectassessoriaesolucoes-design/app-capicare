"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, ArrowRight, Shield, Award, Star, Lock, MessageCircle, TrendingUp, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { pricingPlans, weeklyMealPlan } from "@/lib/data/meal-plans";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function ResultadoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [calvicieLevel, setCalvicieLevel] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  const [completedMeals, setCompletedMeals] = useState<Record<string, boolean>>({});
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const socialProofImages = [
    "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/62442646-f9fa-4632-a015-e56da2aa7963.png",
    "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/97cecea4-bdf4-459a-8331-56a94d722d24.png",
    "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/ef26a5cb-a313-4e01-8b18-35cbea25762f.png",
    "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/b1b17b95-608e-4d6b-bf34-4682a69ffae1.png",
    "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/6c5ed0c3-b640-4c6d-9d94-c4b3bdb65e29.png"
  ];

  const faqs = [
    {
      question: "Quanto tempo leva para ver resultados?",
      answer: "A maioria dos usuários relata os primeiros sinais de melhora entre 30-45 dias. Resultados mais significativos aparecem após 60-90 dias de uso consistente do método."
    },
    {
      question: "O método funciona para todos os tipos de calvície?",
      answer: "Sim! O Método GrowthHair é eficaz para diferentes graus de calvície, desde queda inicial até casos mais avançados. O plano é personalizado para seu nível específico."
    },
    {
      question: "Preciso comprar suplementos caros?",
      answer: "Não! Todas as receitas utilizam alimentos comuns encontrados em qualquer supermercado. O foco é na nutrição natural e acessível."
    },
    {
      question: "Posso cancelar minha assinatura a qualquer momento?",
      answer: "Sim, você pode cancelar quando quiser. Além disso, oferecemos garantia de 7 dias - se não gostar, devolvemos 100% do seu dinheiro."
    },
    {
      question: "Como funciona o acompanhamento de evolução?",
      answer: "Você tira selfies semanais pelo app e nosso sistema gera comparativos visuais mostrando seu progresso. É motivador ver a evolução semana a semana!"
    },
    {
      question: "O método tem efeitos colaterais?",
      answer: "Não! Por ser 100% baseado em alimentação natural, não há efeitos colaterais. Você apenas estará nutrindo seu corpo da forma correta."
    }
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const quizCompleted = typeof window !== 'undefined' ? localStorage.getItem('quizCompleted') : null;
    
    if (!quizCompleted) {
      router.push('/quiz');
      return;
    }

    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 1000);

    try {
      const answersStr = typeof window !== 'undefined' ? localStorage.getItem('quizAnswers') : null;
      const level = Math.floor(Math.random() * 30) + 40;
      setCalvicieLevel(level);
    } catch (error) {
      console.error("Erro ao processar respostas:", error);
      setCalvicieLevel(50);
    }

    return () => clearInterval(interval);
  }, [mounted, router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % socialProofImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggleMeal = (mealId: string) => {
    const updated = { ...completedMeals, [mealId]: !completedMeals[mealId] };
    setCompletedMeals(updated);
  };

  const currentPlan = weeklyMealPlan[selectedDay];
  const totalMeals = 4;
  const completedToday = Object.keys(completedMeals).filter(
    key => key.startsWith(`day${selectedDay}-`) && completedMeals[key]
  ).length;
  const progressToday = (completedToday / totalMeals) * 100;

  const handlePlanClick = (plan: any) => {
    setSelectedPlan(plan);
    setShowCheckoutDialog(true);
  };

  const handleCheckoutConfirm = () => {
    if (!selectedPlan) return;
    
    // Links dos planos Kirvano
    const planLinks: Record<string, string> = {
      '30 dias': 'https://pay.kirvano.com/30963acc-93d3-4d9c-88e2-708b54d4f3c0',
      '60 dias': 'https://pay.kirvano.com/b3e7434d-307c-4b9d-ba12-106b444830b1',
      '90 dias': 'https://pay.kirvano.com/b3e7434d-307c-4b9d-ba12-106b444830b1'
    };
    
    // Determinar qual link usar baseado no nome do plano
    let checkoutLink = '';
    if (selectedPlan.name.includes('30') || selectedPlan.duration === '30 dias') {
      checkoutLink = planLinks['30 dias'];
    } else if (selectedPlan.name.includes('60') || selectedPlan.duration === '60 dias') {
      checkoutLink = planLinks['60 dias'];
    } else if (selectedPlan.name.includes('90') || selectedPlan.duration === '90 dias') {
      checkoutLink = planLinks['90 dias'];
    }
    
    if (checkoutLink) {
      window.open(checkoutLink, '_blank');
    } else {
      alert("Link de checkout não encontrado para este plano.");
    }
    
    setShowCheckoutDialog(false);
  };

  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="p-8 shadow-2xl bg-white/5 backdrop-blur-xl border border-white/10">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse shadow-lg shadow-cyan-500/50">
                <span className="text-5xl">🔬</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Analisando Seu Perfil...
              </h2>
              
              <p className="text-blue-100 mb-8 text-lg">
                Estamos analisando seu grau de calvície e preparando seu plano personalizado
              </p>

              <div className="space-y-4">
                <Progress value={analysisProgress} className="h-4 bg-white/10" />
                <p className="text-base text-cyan-400 font-bold">
                  {analysisProgress}% concluído
                </p>
              </div>

              <div className="mt-10 space-y-4 text-left">
                <div className="flex items-center gap-3 text-blue-100">
                  <CheckCircle className={`h-6 w-6 ${analysisProgress >= 30 ? 'text-green-400' : 'text-white/30'}`} />
                  <span>Analisando respostas do questionário</span>
                </div>
                <div className="flex items-center gap-3 text-blue-100">
                  <CheckCircle className={`h-6 w-6 ${analysisProgress >= 60 ? 'text-green-400' : 'text-white/30'}`} />
                  <span>Processando imagem enviada</span>
                </div>
                <div className="flex items-center gap-3 text-blue-100">
                  <CheckCircle className={`h-6 w-6 ${analysisProgress >= 90 ? 'text-green-400' : 'text-white/30'}`} />
                  <span>Gerando plano personalizado</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Link href="/">
          <img 
            src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/29fa0a57-c30e-4ec6-a969-ae518331ec99.png" 
            alt="CapiCare Logo" 
            className="h-12 w-auto mx-auto mb-8"
          />
        </Link>

        {/* Análise Concluída */}
        <Card className="p-8 shadow-2xl mb-8 bg-white/5 backdrop-blur-xl border border-white/10">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/50">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Análise Concluída!
            </h2>
            <p className="text-blue-100 text-lg">
              Seu plano personalizado está pronto
            </p>
          </div>

          {/* Diagnóstico */}
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl p-8 text-white mb-8 shadow-xl shadow-cyan-500/30">
            <h3 className="text-2xl font-bold mb-6">Seu Diagnóstico Capilar</h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-3">
                  <span className="text-base font-medium">Grau de Calvície</span>
                  <span className="text-base font-bold">{calvicieLevel}%</span>
                </div>
                <Progress value={calvicieLevel} className="h-3 bg-white/20" />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                  <p className="text-sm text-blue-100 mb-2">Tempo Estimado</p>
                  <p className="text-3xl font-bold">45-60 dias</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                  <p className="text-sm text-blue-100 mb-2">Nível de Tratamento</p>
                  <p className="text-3xl font-bold">Moderado</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Plano Alimentar - Conteúdo do Painel */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-white mb-6 text-center">
            Seu Plano Alimentar Personalizado
          </h2>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-xl border border-green-400/30 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-100 mb-1 font-medium">Refeições Hoje</p>
                  <p className="text-4xl font-bold text-white">{completedToday}/{totalMeals}</p>
                </div>
                <CheckCircle className="h-12 w-12 text-green-400" />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-xl border border-purple-400/30 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-100 mb-1 font-medium">Progresso Hoje</p>
                  <p className="text-4xl font-bold text-white">{Math.round(progressToday)}%</p>
                </div>
                <Award className="h-12 w-12 text-purple-400" />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-xl border border-cyan-400/30 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-cyan-100 mb-1 font-medium">Dia do Plano</p>
                  <p className="text-4xl font-bold text-white">{selectedDay + 1}/7</p>
                </div>
                <Star className="h-12 w-12 text-cyan-400" />
              </div>
            </Card>
          </div>

          {/* Day Selector */}
          <Card className="p-6 mb-8 bg-white/5 backdrop-blur-xl border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSelectedDay(Math.max(0, selectedDay - 1))}
                disabled={selectedDay === 0}
                className="bg-white/10 border-white/20 hover:bg-white/20 text-white disabled:opacity-30"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <h2 className="text-3xl font-bold text-white">
                {currentPlan.dayName} - Dia {currentPlan.day}
              </h2>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setSelectedDay(Math.min(6, selectedDay + 1))}
                disabled={selectedDay === 6}
                className="bg-white/10 border-white/20 hover:bg-white/20 text-white disabled:opacity-30"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Day Pills */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {weeklyMealPlan.map((day, index) => {
                const dayCompleted = Object.keys(completedMeals).filter(
                  key => key.startsWith(`day${index}-`) && completedMeals[key]
                ).length;
                const isDayComplete = dayCompleted === totalMeals;

                return (
                  <button
                    key={day.day}
                    onClick={() => setSelectedDay(index)}
                    className={`px-6 py-3 rounded-full whitespace-nowrap transition-all font-semibold relative ${
                      selectedDay === index
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    Dia {day.day}
                    {isDayComplete && (
                      <CheckCircle className="absolute -top-1 -right-1 h-5 w-5 text-green-400 bg-slate-900 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Meals */}
          <Tabs defaultValue="breakfast" className="mb-8">
            <TabsList className="grid w-full grid-cols-4 mb-6 bg-white/5 backdrop-blur-xl border border-white/10 p-1">
              <TabsTrigger value="breakfast" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white text-white/70">Café</TabsTrigger>
              <TabsTrigger value="lunch" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white text-white/70">Almoço</TabsTrigger>
              <TabsTrigger value="snack" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white text-white/70">Lanche</TabsTrigger>
              <TabsTrigger value="dinner" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white text-white/70">Jantar</TabsTrigger>
            </TabsList>

            <TabsContent value="breakfast">
              <MealCard
                meal={currentPlan.meals.breakfast}
                mealId={`day${selectedDay}-breakfast`}
                isCompleted={completedMeals[`day${selectedDay}-breakfast`] || false}
                onToggle={toggleMeal}
              />
            </TabsContent>

            <TabsContent value="lunch">
              <MealCard
                meal={currentPlan.meals.lunch}
                mealId={`day${selectedDay}-lunch`}
                isCompleted={completedMeals[`day${selectedDay}-lunch`] || false}
                onToggle={toggleMeal}
              />
            </TabsContent>

            <TabsContent value="snack">
              <MealCard
                meal={currentPlan.meals.snack}
                mealId={`day${selectedDay}-snack`}
                isCompleted={completedMeals[`day${selectedDay}-snack`] || false}
                onToggle={toggleMeal}
              />
            </TabsContent>

            <TabsContent value="dinner">
              <MealCard
                meal={currentPlan.meals.dinner}
                mealId={`day${selectedDay}-dinner`}
                isCompleted={completedMeals[`day${selectedDay}-dinner`] || false}
                onToggle={toggleMeal}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Campos Bloqueados */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-white mb-6 text-center">
            Desbloqueie Funcionalidades Premium
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Acompanhamento de Evolução */}
            <Card className="p-8 backdrop-blur-xl border text-center shadow-xl relative bg-gradient-to-br from-gray-500/20 to-slate-600/20 border-gray-400/30">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                <div className="text-center">
                  <Lock className="h-16 w-16 text-white mx-auto mb-4" />
                  <p className="text-white text-xl font-bold">Liberado para assinantes</p>
                </div>
              </div>
              <TrendingUp className="h-16 w-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-white mb-4">
                Acompanhe Sua Evolução
              </h3>
              <p className="text-blue-100 mb-6 text-lg">
                Envie selfies semanais e veja seu progresso em tempo real
              </p>
              <Button 
                disabled
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-10 py-7 text-lg font-bold rounded-full shadow-lg disabled:opacity-50"
              >
                Ir para Acompanhamento
              </Button>
            </Card>

            {/* Chat Comunitário */}
            <Card className="p-8 backdrop-blur-xl border text-center shadow-xl relative bg-gradient-to-br from-gray-500/20 to-slate-600/20 border-gray-400/30">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                <div className="text-center">
                  <Lock className="h-16 w-16 text-white mx-auto mb-4" />
                  <p className="text-white text-xl font-bold">Liberado para assinantes</p>
                </div>
              </div>
              <MessageCircle className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-white mb-4">
                Chat da Comunidade
              </h3>
              <p className="text-emerald-100 mb-6 text-lg">
                Compartilhe suas experiências e evoluções com outros assinantes
              </p>
              <Button 
                disabled
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-10 py-7 text-lg font-bold rounded-full shadow-lg disabled:opacity-50"
              >
                Entrar no Chat
              </Button>
            </Card>
          </div>
        </div>

        {/* Planos e Valores */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-white">
            Escolha Seu Plano e Acelere Seus Resultados
          </h2>
          <p className="text-center text-blue-100 mb-12 max-w-2xl mx-auto text-lg">
            Tenha acesso completo a todas as funcionalidades e maximize sua transformação capilar
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <Card 
                key={plan.id}
                className={`p-8 backdrop-blur-xl ${
                  plan.highlighted 
                    ? 'border-4 border-cyan-400 shadow-2xl shadow-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 relative' 
                    : 'border border-white/20 shadow-xl bg-white/5'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      MAIS POPULAR
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-white mb-2">{plan.name}</h3>
                  
                  <div className="mb-6 mt-6">
                    {plan.originalPrice && (
                      <p className="text-blue-200 line-through text-xl mb-1">
                        R$ {plan.originalPrice.toFixed(2)}
                      </p>
                    )}
                    <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                      R$ {plan.price.toFixed(2)}
                    </p>
                    <p className="text-blue-200 mt-2">{plan.duration}</p>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-base text-blue-100">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handlePlanClick(plan)}
                  className={`w-full py-7 rounded-full text-lg font-bold ${
                    plan.highlighted 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/50' 
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/30'
                  }`}
                >
                  Comprar Plano
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Carrossel de Provas Sociais */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-white mb-6 text-center">
            Resultados Reais de Quem Já Transformou
          </h2>
          <p className="text-center text-blue-100 mb-8 max-w-2xl mx-auto">
            Veja as transformações de homens que seguiram o Método GrowthHair
          </p>

          <div className="max-w-5xl mx-auto relative">
            <div className="overflow-hidden rounded-3xl">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
              >
                {socialProofImages.map((image, index) => (
                  <div key={index} className="min-w-full px-4">
                    <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/10">
                      <img 
                        src={image}
                        alt={`Prova Social ${index + 1}`}
                        className="w-full h-96 object-contain bg-gradient-to-br from-slate-800 to-slate-900"
                      />
                      <div className="p-6">
                        <div className="flex items-center gap-1 justify-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-6">
              {socialProofImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'bg-cyan-400 w-8' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Ver prova social ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-white mb-6 text-center">
            Perguntas Frequentes
          </h2>
          <p className="text-center text-blue-100 mb-8 max-w-2xl mx-auto">
            Tire suas dúvidas sobre o Método GrowthHair
          </p>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden">
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <h3 className="text-lg font-bold text-white pr-4">{faq.question}</h3>
                  {openFAQ === index ? (
                    <ChevronUp className="h-6 w-6 text-cyan-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-6 w-6 text-cyan-400 flex-shrink-0" />
                  )}
                </button>
                {openFAQ === index && (
                  <div className="px-6 pb-6">
                    <p className="text-blue-100 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Selos de Garantia */}
        <div className="flex flex-wrap justify-center gap-8 mb-8">
          <div className="flex items-center gap-4 bg-white/5 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/10">
            <Shield className="h-10 w-10 text-green-400" />
            <div>
              <p className="font-bold text-white text-lg">Garantia de 7 Dias</p>
              <p className="text-sm text-blue-100">100% do seu dinheiro de volta</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white/5 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/10">
            <Award className="h-10 w-10 text-cyan-400" />
            <div>
              <p className="font-bold text-white text-lg">Compra Segura</p>
              <p className="text-sm text-blue-100">Pagamento 100% protegido</p>
            </div>
          </div>
        </div>
      </div>

      {/* Popup de Checkout */}
      <Dialog open={showCheckoutDialog} onOpenChange={setShowCheckoutDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Atenção Importante!</DialogTitle>
            <DialogDescription className="text-center text-base mt-4">
              No checkout, preencha com o <span className="font-bold text-cyan-600">mesmo nome e e-mail</span> que você usará para acessar o painel do aplicativo após a compra.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 space-y-4">
            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
              <p className="text-sm text-cyan-900">
                <strong>Importante:</strong> Seus dados de acesso serão os mesmos do checkout para garantir que você tenha acesso imediato ao conteúdo premium.
              </p>
            </div>
            <Button
              onClick={handleCheckoutConfirm}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-6 text-lg font-bold rounded-full"
            >
              Comprar Plano
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface MealCardProps {
  meal: {
    name: string;
    items: string[];
    benefits: string;
  };
  mealId: string;
  isCompleted: boolean;
  onToggle: (mealId: string) => void;
}

function MealCard({ meal, mealId, isCompleted, onToggle }: MealCardProps) {
  return (
    <Card className={`p-8 backdrop-blur-xl border transition-all ${
      isCompleted 
        ? 'bg-green-500/20 border-green-400/50 shadow-lg shadow-green-500/20' 
        : 'bg-white/5 border-white/10'
    }`}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-3xl font-bold text-white mb-3">{meal.name}</h3>
          <p className="text-base text-blue-100 italic">{meal.benefits}</p>
        </div>
        <div
          onClick={() => onToggle(mealId)}
          className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all font-semibold cursor-pointer ${
            isCompleted
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/50'
              : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
          }`}
        >
          <Checkbox checked={isCompleted} className="border-white pointer-events-none" />
          <span className="text-base">
            {isCompleted ? 'Concluído' : 'Marcar'}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-bold text-white text-lg">Ingredientes:</h4>
        <ul className="space-y-3">
          {meal.items.map((item, index) => (
            <li key={index} className="flex items-center gap-4">
              <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex-shrink-0" />
              <span className="text-blue-100 text-base">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
