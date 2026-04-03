"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, ArrowRight, Shield, Award, Clock, ChevronLeft } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Link from "next/link";

const accessPlans = [
  {
    id: 1,
    name: "Plano 60 Dias",
    duration: "60 dias de acesso",
    price: 14.90,
    originalPrice: 19.80,
    highlighted: false,
    checkoutLink: "https://pay.kirvano.com/b3e7434d-307c-4b9d-ba12-106b444830b1",
    features: [
      "60 dias de acesso completo ao app",
      "Plano alimentar personalizado",
      "Acompanhamento visual da área implantada",
      "Nutrientes focados no pós-transplante",
      "Suporte via chat da comunidade",
      "Orientações de manutenção contínua"
    ]
  },
  {
    id: 2,
    name: "Plano 90 Dias",
    duration: "90 dias de acesso",
    price: 24.90,
    originalPrice: 29.70,
    highlighted: true,
    checkoutLink: "https://pay.kirvano.com/b3e7434d-307c-4b9d-ba12-106b444830b1",
    features: [
      "90 dias de acesso completo ao app",
      "Plano alimentar personalizado",
      "Acompanhamento visual da área implantada",
      "Nutrientes focados no pós-transplante",
      "Suporte via chat da comunidade",
      "Orientações de manutenção contínua",
      "Garantia de satisfação de 7 dias"
    ]
  }
];

export default function AcessoPlanosPage() {
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<typeof accessPlans[0] | null>(null);

  const handlePlanClick = (plan: typeof accessPlans[0]) => {
    setSelectedPlan(plan);
    setShowCheckoutDialog(true);
  };

  const handleCheckoutConfirm = () => {
    if (!selectedPlan) return;
    window.open(selectedPlan.checkoutLink, "_blank");
    setShowCheckoutDialog(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Voltar */}
        <div className="mb-8">
          <Link href="/plano">
            <Button variant="ghost" className="text-blue-200 hover:text-white hover:bg-white/10 gap-2">
              <ChevronLeft className="h-5 w-5" />
              Voltar ao App
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Clock className="h-10 w-10 text-cyan-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Libere Mais Tempo de Acesso
          </h1>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto">
            Escolha o plano ideal e continue aproveitando todos os recursos do CapiCare por mais tempo.
          </p>
        </div>

        {/* Cards dos Planos */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {accessPlans.map((plan) => (
            <Card
              key={plan.id}
              className={`p-8 backdrop-blur-xl ${
                plan.highlighted
                  ? "border-4 border-cyan-400 shadow-2xl shadow-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 relative"
                  : "border border-white/20 shadow-xl bg-white/5"
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
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/50"
                    : "bg-white/10 hover:bg-white/20 text-white border border-white/30"
                }`}
              >
                Escolher Plano
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Card>
          ))}
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
              No checkout, preencha com o{" "}
              <span className="font-bold text-cyan-600">mesmo nome e e-mail</span>{" "}
              que você usou para acessar o aplicativo.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 space-y-4">
            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
              <p className="text-sm text-cyan-900">
                <strong>Importante:</strong> Seus dados de acesso serão os mesmos do checkout para garantir que você tenha acesso imediato ao conteúdo após a compra.
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
