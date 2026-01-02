"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Zap, TrendingUp, Clock, Shield, Star, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function BoneLedterapiaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/plano">
              <img 
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/adb1a9e4-43e9-4fee-bd67-1562ccd0d2e4.png" 
                alt="CapiCare Logo" 
                className="h-14 w-auto drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]"
              />
            </Link>
            <Link href="/plano">
              <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20 text-white">
                Voltar ao Painel
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Hero Section com Background dos Bonés */}
        <div className="text-center mb-16 relative">
          {/* Background Images - Bonés com maior nitidez - DESKTOP */}
          <div className="hidden md:block absolute inset-0 overflow-hidden pointer-events-none">
            <img 
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/eb5e9c0a-21b8-44cb-908f-43bb8f903f5a.png"
              alt=""
              className="absolute left-0 top-1/2 -translate-y-1/2 w-64 md:w-96 lg:w-[500px] opacity-15"
              style={{ filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))' }}
            />
            <img 
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/ff2da2cf-7efd-4c7c-a875-17892ca35371.png"
              alt=""
              className="absolute right-0 top-1/2 -translate-y-1/2 w-64 md:w-96 lg:w-[500px] opacity-15"
              style={{ filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))' }}
            />
          </div>

          {/* Background Image - Boné desfocado e apagado - MOBILE */}
          <div className="md:hidden absolute inset-0 overflow-hidden pointer-events-none">
            <img 
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/0ba9a25e-e790-4f03-82b3-95b8c32ed1eb.png"
              alt=""
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover opacity-10"
              style={{ filter: 'blur(8px)' }}
            />
          </div>

          {/* Conteúdo da Headline */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/40 rounded-full px-6 py-2 mb-6">
              <Sparkles className="h-5 w-5 text-blue-400" />
              <span className="text-blue-300 font-semibold">Tecnologia Profissional de Ledterapia</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Acelere o Crescimento Capilar com o{" "}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Boné CapiCare
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Combine seu plano alimentar com a tecnologia de ledterapia profissional e veja resultados surpreendentes
            </p>

            <Button 
              className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 hover:from-blue-600 hover:via-cyan-600 hover:to-blue-700 text-white px-12 py-8 text-xl font-bold rounded-full shadow-2xl shadow-blue-500/50 transform hover:scale-105 transition-all mb-4"
              onClick={() => window.open('https://capicare.com.br/', '_blank')}
            >
              Turbinar Meus Resultados
              <ArrowRight className="ml-3 h-7 w-7" />
            </Button>
            
            <p className="text-blue-200/80 text-sm">✨ Oferta especial para assinantes CapiCare</p>
          </div>
        </div>

        {/* Benefícios */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-12">
            Por Que Combinar com Seu Plano Alimentar?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-8 bg-gradient-to-br from-blue-500/20 to-cyan-600/20 backdrop-blur-xl border border-blue-400/30">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/50">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Resultados Acelerados</h3>
              <p className="text-blue-100">
                A ledterapia estimula a circulação sanguínea no couro cabeludo, potencializando a absorção dos nutrientes do seu plano alimentar
              </p>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-xl border border-cyan-400/30">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/50">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Crescimento Potencializado</h3>
              <p className="text-cyan-100">
                Estimula os folículos capilares em fase de repouso, aumentando a densidade e o volume dos fios
              </p>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-blue-500/20 to-cyan-600/20 backdrop-blur-xl border border-blue-400/30">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/50">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Apenas 15 Min/Dia</h3>
              <p className="text-blue-100">
                Use enquanto trabalha, assiste TV ou relaxa. Tecnologia sem fio e confortável
              </p>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-xl border border-cyan-400/30">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/50">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">100% Seguro</h3>
              <p className="text-cyan-100">
                Tecnologia aprovada e testada clinicamente. Sem efeitos colaterais ou contraindicações
              </p>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-blue-500/20 to-cyan-600/20 backdrop-blur-xl border border-blue-400/30">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/50">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Qualidade Premium</h3>
              <p className="text-blue-100">
                272 LEDs de alta potência com comprimento de onda otimizado para crescimento capilar
              </p>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-xl border border-cyan-400/30">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/50">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Garantia de 120 Dias</h3>
              <p className="text-cyan-100">
                Satisfação garantida ou seu dinheiro de volta. Garantia total de 120 dias
              </p>
            </Card>
          </div>
        </div>

        {/* CTA Final */}
        <Card className="p-12 md:p-16 backdrop-blur-xl border text-center shadow-2xl bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-blue-600/20 border-blue-400/40 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 animate-pulse" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Pronto Para Transformar Seus Resultados?
            </h2>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Junte-se a milhares de pessoas que já estão acelerando o crescimento capilar com a tecnologia de ledterapia
            </p>
            
            <div className="flex flex-col items-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <Star className="h-6 w-6 text-blue-400 fill-blue-400" />
                <Star className="h-6 w-6 text-blue-400 fill-blue-400" />
                <Star className="h-6 w-6 text-blue-400 fill-blue-400" />
                <Star className="h-6 w-6 text-blue-400 fill-blue-400" />
                <Star className="h-6 w-6 text-blue-400 fill-blue-400" />
              </div>
              <p className="text-blue-200 text-lg">Avaliação 5.0 de mais de 2.500 clientes</p>
            </div>

            <Button 
              className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 hover:from-blue-600 hover:via-cyan-600 hover:to-blue-700 text-white px-16 py-10 text-2xl font-bold rounded-full shadow-2xl shadow-blue-500/50 transform hover:scale-105 transition-all"
              onClick={() => window.open('https://capicare.com.br/', '_blank')}
            >
              Garantir Meu Boné
              <ArrowRight className="ml-3 h-8 w-8" />
            </Button>
            
            <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-6 text-blue-100">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-cyan-400" />
                <span>Entrega Rápida</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-cyan-400" />
                <span>Garantia de 120 Dias</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-cyan-400" />
                <span>Suporte Especializado</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-md mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-white/60">
            © 2024 CapiCare. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
