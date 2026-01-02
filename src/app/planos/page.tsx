"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, ArrowLeft, Crown, Zap, Star } from "lucide-react";
import Link from "next/link";

export default function PlanosPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSubscribe = (plan: string) => {
    setSelectedPlan(plan);
    // Aqui você integraria com sistema de pagamento
    alert(`Você selecionou o plano ${plan}. Em breve você será redirecionado para o pagamento.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/plano">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Voltar
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-white">Planos e Assinaturas</h1>
            <div className="w-24" /> {/* Spacer */}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-6">
            Escolha o Plano Ideal Para Você
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Desbloqueie todo o potencial do CapiCare e acelere seus resultados com acompanhamento profissional
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Plano Mensal */}
          <Card className="p-8 bg-gradient-to-br from-blue-500/10 to-cyan-600/10 backdrop-blur-xl border border-blue-400/30 hover:border-blue-400/60 transition-all hover:scale-105">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                <Zap className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Mensal</h3>
              <div className="text-5xl font-bold text-white mb-2">R$ 49</div>
              <p className="text-blue-200">por mês</p>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-blue-100">
                <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>Plano alimentar completo de 7 dias</span>
              </li>
              <li className="flex items-start gap-3 text-blue-100">
                <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>Acompanhamento de evolução com fotos</span>
              </li>
              <li className="flex items-start gap-3 text-blue-100">
                <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>Acesso ao chat da comunidade</span>
              </li>
              <li className="flex items-start gap-3 text-blue-100">
                <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>Suporte prioritário via chat</span>
              </li>
              <li className="flex items-start gap-3 text-blue-100">
                <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>Atualizações semanais do plano</span>
              </li>
            </ul>
            <Button 
              onClick={() => handleSubscribe('Mensal')}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white py-6 text-lg font-bold rounded-full"
            >
              Assinar Agora
            </Button>
          </Card>

          {/* Plano Trimestral - DESTAQUE */}
          <Card className="p-8 bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-xl border-2 border-purple-400/50 hover:border-purple-400/80 transition-all hover:scale-105 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2">
              <Crown className="h-4 w-4" />
              MAIS POPULAR
            </div>
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <Star className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Trimestral</h3>
              <div className="text-5xl font-bold text-white mb-2">R$ 117</div>
              <p className="text-purple-200">R$ 39/mês</p>
              <p className="text-sm text-green-400 font-semibold mt-2">Economize 20%</p>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-purple-100">
                <CheckCircle className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <span className="font-semibold">Tudo do plano mensal +</span>
              </li>
              <li className="flex items-start gap-3 text-purple-100">
                <CheckCircle className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <span>Análises detalhadas mensais</span>
              </li>
              <li className="flex items-start gap-3 text-purple-100">
                <CheckCircle className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <span>Relatórios de progresso personalizados</span>
              </li>
              <li className="flex items-start gap-3 text-purple-100">
                <CheckCircle className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <span>10% de desconto em produtos parceiros</span>
              </li>
              <li className="flex items-start gap-3 text-purple-100">
                <CheckCircle className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <span>Acesso a webinars exclusivos</span>
              </li>
            </ul>
            <Button 
              onClick={() => handleSubscribe('Trimestral')}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-6 text-lg font-bold rounded-full shadow-lg shadow-purple-500/50"
            >
              Assinar Agora
            </Button>
          </Card>

          {/* Plano Anual */}
          <Card className="p-8 bg-gradient-to-br from-emerald-500/10 to-teal-600/10 backdrop-blur-xl border border-emerald-400/30 hover:border-emerald-400/60 transition-all hover:scale-105">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                <Crown className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Anual</h3>
              <div className="text-5xl font-bold text-white mb-2">R$ 349</div>
              <p className="text-emerald-200">R$ 29/mês</p>
              <p className="text-sm text-green-400 font-semibold mt-2">Economize 40%</p>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 text-emerald-100">
                <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="font-semibold">Tudo do plano trimestral +</span>
              </li>
              <li className="flex items-start gap-3 text-emerald-100">
                <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Consultoria personalizada mensal</span>
              </li>
              <li className="flex items-start gap-3 text-emerald-100">
                <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Acesso vitalício ao conteúdo</span>
              </li>
              <li className="flex items-start gap-3 text-emerald-100">
                <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>20% de desconto em produtos parceiros</span>
              </li>
              <li className="flex items-start gap-3 text-emerald-100">
                <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Garantia de satisfação de 30 dias</span>
              </li>
            </ul>
            <Button 
              onClick={() => handleSubscribe('Anual')}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-6 text-lg font-bold rounded-full"
            >
              Assinar Agora
            </Button>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card className="p-8 bg-white/5 backdrop-blur-xl border border-white/10">
          <h3 className="text-3xl font-bold text-white mb-8 text-center">
            Perguntas Frequentes
          </h3>
          <div className="space-y-6 max-w-3xl mx-auto">
            <div>
              <h4 className="text-xl font-bold text-white mb-2">Posso cancelar a qualquer momento?</h4>
              <p className="text-blue-100">Sim! Você pode cancelar sua assinatura a qualquer momento sem taxas adicionais.</p>
            </div>
            <div>
              <h4 className="text-xl font-bold text-white mb-2">Como funciona a garantia de 30 dias?</h4>
              <p className="text-blue-100">Se você não estiver satisfeito com o plano anual, devolvemos 100% do seu dinheiro nos primeiros 30 dias.</p>
            </div>
            <div>
              <h4 className="text-xl font-bold text-white mb-2">Posso mudar de plano depois?</h4>
              <p className="text-blue-100">Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento.</p>
            </div>
            <div>
              <h4 className="text-xl font-bold text-white mb-2">Quais formas de pagamento são aceitas?</h4>
              <p className="text-blue-100">Aceitamos cartão de crédito, débito e PIX para sua comodidade.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
