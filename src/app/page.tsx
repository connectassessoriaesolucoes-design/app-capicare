"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Star } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function Home() {
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [loginData, setLoginData] = useState({ name: "", email: "" });
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const testimonials = [
    {
      image: "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/1afaf0b6-ae85-4141-8f65-bbf2cd8cd45b.png",
      text: "Em 2 semanas já senti os fios mais fortes. Nunca imaginei que a alimentação faria tanta diferença!",
      author: "Carlos M."
    },
    {
      image: "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/5e0d391e-5539-48a8-87dc-df6448744012.png",
      text: "Meu cabelo começou a encher nas laterais. O app é muito fácil de seguir!",
      author: "Rodrigo S."
    },
    {
      image: "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/70f529a5-1fcb-4634-b720-ac5097356e78.png",
      text: "Com 30 dias já vi preenchimento no topo. Recomendo demais!",
      author: "Felipe A."
    },
    {
      image: "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/85a37cbb-43e5-4a72-abe7-a5f928ca00f8.png",
      text: "Resultados incríveis! Minha autoestima voltou depois de anos.",
      author: "André L."
    },
    {
      image: "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/9ac1a48a-93c8-4d98-81e5-1f99eefa8e14.png",
      text: "Método simples e eficaz. Já indiquei para vários amigos!",
      author: "Marcelo P."
    },
    {
      image: "https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/9995ed98-81d1-465e-b9fa-06482a15d73c.png",
      text: "4 meses depois e o resultado é visível. Vale cada dia!",
      author: "Paulo R."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    
    const email = loginData.email.toLowerCase().trim();
    const name = loginData.name.trim();
    
    try {
      console.log('🔐 ========================================');
      console.log('🔐 INICIANDO LOGIN');
      console.log('🔐 ========================================');
      console.log('🔐 Nome:', name);
      console.log('🔐 Email:', email);
      console.log('🔐 URL atual:', window.location.origin);
      
      // Construir URL completa da API
      const apiUrl = `${window.location.origin}/api/verify-access`;
      console.log('🔐 URL da API:', apiUrl);
      
      // Verificar acesso via API
      console.log('🔐 Enviando requisição para API...');
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      console.log('🔐 Status da resposta:', response.status);
      console.log('🔐 Status OK?', response.ok);
      
      const result = await response.json();
      
      console.log('🔐 Resposta completa da API:', JSON.stringify(result, null, 2));
      console.log('🔐 result.success:', result.success);
      console.log('🔐 result.data:', result.data);

      // Se a API retornou sucesso (status 200 e success: true)
      if (response.ok && result.success) {
        console.log('✅ ========================================');
        console.log('✅ ACESSO APROVADO!');
        console.log('✅ ========================================');
        console.log('✅ Email:', email);
        console.log('✅ Plano:', result.data.plan);
        console.log('✅ Duração:', result.data.duration, 'dias');
        console.log('✅ Expira em:', result.data.expirationDate);
        console.log('✅ ========================================');
        
        // Salvar dados no localStorage para manter sessão
        const userData = {
          name: name || "Usuário",
          email: email,
          plan: result.data.plan,
          duration: result.data.duration,
          expirationDate: result.data.expirationDate,
          purchaseDate: result.data.purchaseDate,
          active: result.data.active
        };
        
        console.log('💾 Salvando dados no localStorage:', userData);
        localStorage.setItem('userData', JSON.stringify(userData));
        
        console.log('🚀 Redirecionando para /plano...');
        router.push('/plano');
        return;
      }

      // Se chegou aqui, o acesso não foi encontrado ou está inválido
      console.error('❌ ========================================');
      console.error('❌ ACESSO NEGADO');
      console.error('❌ ========================================');
      console.error('❌ Status:', response.status);
      console.error('❌ Mensagem:', result.error || result.message);
      console.error('❌ ========================================');
      
      // Mostrar mensagem de erro específica
      setErrorMessage(result.error || 'Acesso não encontrado. Verifique se você usou o mesmo email da compra ou se a compra foi aprovada.');
      
    } catch (error) {
      console.error('❌ ========================================');
      console.error('❌ ERRO DE CONEXÃO');
      console.error('❌ ========================================');
      console.error('❌ Erro:', error);
      console.error('❌ ========================================');
      setErrorMessage('Erro ao conectar com o servidor. Verifique sua conexão e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <img 
            src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/adb1a9e4-43e9-4fee-bd67-1562ccd0d2e4.png" 
            alt="CapiCare Logo" 
            className="h-14 w-auto drop-shadow-2xl"
          />
          <nav className="hidden md:flex gap-6">
            <a href="#beneficios" className="text-white/80 hover:text-white transition-colors font-medium text-sm">Benefícios</a>
            <a href="#depoimentos" className="text-white/80 hover:text-white transition-colors font-medium text-sm">Depoimentos</a>
            <a href="#planos" className="text-white/80 hover:text-white transition-colors font-medium text-sm">Planos</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-5xl mx-auto text-center">
          
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-4 leading-tight">
            Ative o Crescimento Capilar em <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-black">90 Dias</span> com o <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 font-black">Método GrowthHair</span> da <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 font-black">CapiCare</span>.
          </h1>
          
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            O primeiro sistema que combina nutrição científica + acompanhamento visual + receitas práticas para recuperar seu cabelo naturalmente
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
            <Link href="/quiz" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-6 text-base font-bold rounded-full shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 border-2 border-cyan-400/50"
              >
                Começar Grátis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Button
              onClick={() => setShowLoginDialog(true)}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 px-6 py-6 text-sm font-semibold rounded-full backdrop-blur-sm transition-all duration-300"
            >
              Já tenho conta, acessar
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-blue-100">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-cyan-400" />
              <span className="font-medium">100% Natural</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-cyan-400" />
              <span className="font-medium">Sem Efeitos Colaterais</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-cyan-400" />
              <span className="font-medium">Resultados Comprovados</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section id="beneficios" className="py-12 md:py-16 bg-gradient-to-b from-transparent to-black/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-white">
            Por que o Método GrowthHair™ Funciona?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 backdrop-blur-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/50">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Nutrição Científica</h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                Receitas baseadas em estudos que comprovam o poder de biotina, ferro, zinco e proteínas no crescimento capilar acelerado.
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-600/10 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 backdrop-blur-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/50">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Acompanhamento Visual</h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                Tire selfies semanais e veja sua evolução em gráficos comparativos. Motivação garantida a cada semana.
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-500/20 hover:border-green-400/40 transition-all duration-300 backdrop-blur-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/50">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Alimentos Acessíveis</h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                Nada de ingredientes caros ou difíceis de encontrar. Tudo disponível no seu mercado local.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Carrossel de Depoimentos */}
      <section id="depoimentos" className="py-12 md:py-16 bg-black/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white">
            Transformações Reais
          </h2>
          <p className="text-center text-blue-100 mb-10 max-w-2xl mx-auto">
            Veja os resultados de homens que seguiram o método GrowthHair™
          </p>

          {/* Carrossel */}
          <div className="max-w-4xl mx-auto relative">
            <div className="overflow-hidden rounded-3xl">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="min-w-full px-4">
                    <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/10">
                      <img 
                        src={testimonial.image}
                        alt={`Depoimento ${index + 1}`}
                        className="w-full h-80 md:h-96 object-contain bg-gradient-to-br from-slate-800 to-slate-900"
                      />
                      <div className="p-6 md:p-8">
                        <div className="flex items-center gap-2 mb-4 justify-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-blue-100 italic mb-4 leading-relaxed text-center text-base md:text-lg">
                          "{testimonial.text}"
                        </p>
                        <p className="font-bold text-white text-center">– {testimonial.author}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Indicadores */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'bg-cyan-400 w-8' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Ver depoimento ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Comece Sua Transformação Hoje
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Faça o quiz gratuito e receba seu plano personalizado em minutos
          </p>
          <Link href="/quiz">
            <Button 
              size="lg" 
              className="bg-white text-teal-700 hover:bg-gray-100 px-10 py-6 text-lg font-bold rounded-full shadow-2xl hover:shadow-white/50 transition-all duration-300 hover:scale-105"
            >
              Iniciar Quiz Gratuito Agora
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-md text-white py-8 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <img 
            src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/adb1a9e4-43e9-4fee-bd67-1562ccd0d2e4.png" 
            alt="CapiCare Logo" 
            className="h-10 w-auto mx-auto mb-3"
          />
          <p className="text-blue-200 text-xs">
            © 2024 CapiCare. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Acessar Minha Conta</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="login-name">Nome Completo</Label>
              <Input
                id="login-name"
                type="text"
                placeholder="Digite seu nome"
                value={loginData.name}
                onChange={(e) => setLoginData({ ...loginData, name: e.target.value })}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="login-email">E-mail</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="seu@email.com"
                value={loginData.email}
                onChange={(e) => {
                  setLoginData({ ...loginData, email: e.target.value });
                  setErrorMessage("");
                }}
                required
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use o mesmo e-mail da sua compra
              </p>
            </div>

            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                <p className="font-semibold">❌ {errorMessage}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0072C6] hover:bg-[#005a9e] text-white py-6 text-lg rounded-full mt-6 disabled:opacity-50"
            >
              {isLoading ? 'Verificando...' : 'Acessar'}
            </Button>

            <p className="text-xs text-center text-gray-500 mt-4">
              Não tem conta? Complete o quiz para criar uma.
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
