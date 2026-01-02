"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, ChevronLeft, ChevronRight, Calendar, TrendingUp, Award, MessageCircle, User, Menu, Zap, ArrowRight } from "lucide-react";
import { weeklyMealPlan } from "@/lib/data/meal-plans";
import { generateFullMealPlan } from "@/lib/data/full-meal-plan";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function PlanoPage() {
  const [selectedDay, setSelectedDay] = useState(0);
  const [completedMeals, setCompletedMeals] = useState<Record<string, boolean>>({});
  const [userName, setUserName] = useState("");
  const [calvicieLevel, setCalvicieLevel] = useState(0);
  const [fullPlan, setFullPlan] = useState<any[]>([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    setUserName(userData.name || 'Usuário');

    const level = Math.floor(Math.random() * 30) + 40;
    setCalvicieLevel(level);

    const saved = localStorage.getItem('completedMeals');
    if (saved) {
      setCompletedMeals(JSON.parse(saved));
    }

    // Gerar plano completo de 90 dias
    const generated = generateFullMealPlan();
    setFullPlan(generated);
  }, []);

  const toggleMeal = (mealId: string) => {
    const updated = { ...completedMeals, [mealId]: !completedMeals[mealId] };
    setCompletedMeals(updated);
    localStorage.setItem('completedMeals', JSON.stringify(updated));
  };

  const currentPlan = fullPlan[selectedDay] || weeklyMealPlan[0];
  const totalMeals = 4;
  const completedToday = Object.keys(completedMeals).filter(
    key => key.startsWith(`day${selectedDay}-`) && completedMeals[key]
  ).length;
  const progressToday = (completedToday / totalMeals) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header com Menu */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <img 
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/adb1a9e4-43e9-4fee-bd67-1562ccd0d2e4.png" 
                alt="CapiCare Logo" 
                className="h-14 w-auto drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]"
              />
            </Link>
            
            {/* Menu Desktop */}
            <nav className="hidden md:flex gap-6 items-center">
              <Link href="/plano" className="text-cyan-400 font-semibold">Meu Plano</Link>
              <Link href="/evolucao" className="text-white/80 hover:text-white transition-colors">Evolução</Link>
              <Link href="/chat" className="text-white/80 hover:text-white transition-colors">Chat</Link>
              <Link href="/perfil" className="text-white/80 hover:text-white transition-colors flex items-center gap-2">
                <User className="h-4 w-4" />
                Perfil
              </Link>
            </nav>

            {/* Menu Mobile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-slate-900 border-white/10">
                <DropdownMenuItem asChild>
                  <Link href="/plano" className="flex items-center gap-2 text-cyan-400">
                    <Calendar className="h-4 w-4" />
                    Meu Plano
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/evolucao" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Evolução
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/chat" className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Chat
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/perfil" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Perfil
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Welcome Section com Análise */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Olá, {userName}! 👋
          </h1>
          <p className="text-xl text-blue-100 mb-6">
            Sua jornada de transformação começa agora! Siga seu plano e conquiste resultados incríveis! 🚀
          </p>

          {/* Análise Capilar no Topo */}
          <Card className="p-8 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-xl border border-cyan-400/30 shadow-xl shadow-cyan-500/20 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/50">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Sua Análise Capilar</h3>
                <p className="text-blue-100">Diagnóstico personalizado</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-white font-medium">Grau de Calvície</span>
                  <span className="text-cyan-400 font-bold">{calvicieLevel}%</span>
                </div>
                <Progress value={calvicieLevel} className="h-3 bg-white/10" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <p className="text-sm text-blue-200 mb-1">Tempo Estimado</p>
                  <p className="text-xl md:text-2xl font-bold text-white">45-60 dias</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <p className="text-sm text-blue-200 mb-1">Nível</p>
                  <p className="text-xl md:text-2xl font-bold text-white">Moderado</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <p className="text-sm text-blue-200 mb-1">Progresso Hoje</p>
                  <p className="text-xl md:text-2xl font-bold text-white">{Math.round(progressToday)}%</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

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
                <p className="text-sm text-purple-100 mb-1 font-medium">Dia do Plano</p>
                <p className="text-4xl font-bold text-white">{selectedDay + 1}/90</p>
              </div>
              <Calendar className="h-12 w-12 text-purple-400" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-xl border border-cyan-400/30 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cyan-100 mb-1 font-medium">Progresso Total</p>
                <p className="text-4xl font-bold text-white">{Math.round((selectedDay + 1) / 90 * 100)}%</p>
              </div>
              <Award className="h-12 w-12 text-cyan-400" />
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
              onClick={() => setSelectedDay(Math.min(89, selectedDay + 1))}
              disabled={selectedDay === 89}
              className="bg-white/10 border-white/20 hover:bg-white/20 text-white disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Day Pills - Scroll horizontal para 90 dias */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {fullPlan.map((day, index) => {
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

        {/* Acompanhe sua evolução - DESBLOQUEADO */}
        <Link href="/evolucao">
          <Card className="p-8 backdrop-blur-xl border text-center shadow-xl mb-8 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border-blue-400/30 hover:border-blue-400/50 transition-all cursor-pointer">
            <h3 className="text-3xl font-bold text-white mb-4">
              Acompanhe Sua Evolução
            </h3>
            <p className="text-blue-100 mb-6 text-lg">
              Envie selfies semanais e veja seu progresso em tempo real
            </p>
            <Button 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-10 py-7 text-lg font-bold rounded-full shadow-lg shadow-blue-500/50"
            >
              Ir para Acompanhamento
              <TrendingUp className="ml-2 h-6 w-6" />
            </Button>
          </Card>
        </Link>

        {/* Chat Comunitário - DESBLOQUEADO */}
        <Link href="/chat">
          <Card className="p-8 backdrop-blur-xl border text-center shadow-xl mb-8 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border-emerald-400/30 hover:border-emerald-400/50 transition-all cursor-pointer">
            <MessageCircle className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-white mb-4">
              Chat da Comunidade
            </h3>
            <p className="text-emerald-100 mb-6 text-lg">
              Compartilhe suas experiências e evoluções com outros assinantes
            </p>
            <Button 
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-10 py-7 text-lg font-bold rounded-full shadow-lg shadow-emerald-500/50"
            >
              Entrar no Chat
              <MessageCircle className="ml-2 h-6 w-6" />
            </Button>
          </Card>
        </Link>

        {/* CTA Boné de Ledterapia - FRASE REMOVIDA */}
        <Card className="p-8 md:p-12 backdrop-blur-xl border text-center shadow-2xl bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-red-500/20 border-amber-400/40 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-red-500/10 animate-pulse" />
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Zap className="h-12 w-12 text-amber-400 animate-bounce" />
              <h3 className="text-3xl md:text-4xl font-bold text-white">
                Turbine Seus Resultados!
              </h3>
              <Zap className="h-12 w-12 text-amber-400 animate-bounce" />
            </div>
            <p className="text-amber-100 mb-6 text-lg md:text-xl max-w-2xl mx-auto">
              Acelere o crescimento capilar com nosso <span className="font-bold text-amber-300">Boné de Ledterapia</span> profissional.
            </p>
            <Link href="/bone-ledterapia">
              <Button 
                className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white px-12 py-8 text-xl font-bold rounded-full shadow-2xl shadow-amber-500/50 transform hover:scale-105 transition-all"
              >
                Conhecer o Boné de Ledterapia
                <ArrowRight className="ml-3 h-7 w-7" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>
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
