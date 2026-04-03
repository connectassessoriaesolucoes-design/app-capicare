"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function Home() {
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [loginData, setLoginData] = useState({ name: "", email: "" });
  const [registerData, setRegisterData] = useState({ name: "", email: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [registerError, setRegisterError] = useState("");
  const router = useRouter();

  // Auto-detectar compra concluída (parâmetros Kirvano na URL)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const kirvanoData = urlParams.get('kirvano_upsell');

    if (kirvanoData) {
      console.log('🎯 Detecção de compra Kirvano ativada!');
      console.log('🎯 Parâmetro kirvano_upsell:', kirvanoData);

      // Extrair email se disponível nos parâmetros
      const email = urlParams.get('email') || urlParams.get('user_email');

      if (email) {
        console.log('📧 Email detectado na URL:', email);
        // Auto-preencher formulário de login
        setLoginData({ name: '', email: email });
        setShowLoginDialog(true);
      } else {
        // Mostrar dialog de login para usuário inserir email
        console.log('⚠️ Email não detectado, solicitando ao usuário...');
        setShowLoginDialog(true);
      }
    }
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegisterLoading(true);
    setRegisterError("");

    const name = registerData.name.trim();
    const email = registerData.email.toLowerCase().trim();

    if (!name || !email) {
      setRegisterError("Preencha todos os campos.");
      setIsRegisterLoading(false);
      return;
    }

    try {
      const response = await fetch(`${window.location.origin}/api/register-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      });

      const result = await response.json();

      if (result.success) {
        const userData = {
          name: result.data.name || name,
          email: result.data.email || email,
          plan: result.data.plan,
          duration: result.data.duration,
          expirationDate: result.data.expirationDate,
          active: result.data.active,
          quizCompleted: result.data.quizCompleted,
          daysRemaining: result.data.daysRemaining
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        setShowRegisterDialog(false);
        router.push('/quiz');
      } else {
        setRegisterError(result.error || 'Erro ao criar conta. Tente novamente.');
      }
    } catch {
      setRegisterError('Erro ao conectar com o servidor. Tente novamente.');
    } finally {
      setIsRegisterLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    // IMPORTANTE: Login valida apenas EMAIL (não o nome)
    const email = loginData.email.toLowerCase().trim();
    const name = loginData.name.trim();

    try {
      console.log('🔐 ========================================');
      console.log('🔐 INICIANDO LOGIN (VALIDAÇÃO POR EMAIL)');
      console.log('🔐 ========================================');
      console.log('🔐 Nome informado:', name, '(apenas para exibição)');
      console.log('🔐 Email (CHAVE DE ACESSO):', email);
      console.log('🔐 URL atual:', window.location.origin);

      // Construir URL completa da API
      const apiUrl = `${window.location.origin}/api/verify-access`;
      console.log('🔐 URL da API:', apiUrl);

      // Verificar acesso via API - VALIDA APENAS O EMAIL
      console.log('🔐 Enviando requisição para API (validando apenas email)...');
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }), // Apenas email é enviado para validação
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
          active: result.data.active,
          quizCompleted: result.data.quizCompleted ?? false
        };

        localStorage.setItem('userData', JSON.stringify(userData));

        // Se quiz não foi feito ainda, vai para o quiz
        if (!result.data.quizCompleted) {
          router.push('/quiz');
        } else {
          router.push('/plano');
        }
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
            Você Pagou Caro no Transplante... Agora Não Deixe Seu <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-black">Resultado Falhar</span> nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 font-black">Primeiros Meses!</span>
          </h1>

          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Manutenção pós-transplante baseada em nutrição científica + acompanhamento visual + receitas práticas para preservar seu investimento
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
            <Button
              onClick={() => { setShowRegisterDialog(true); setRegisterError(""); setRegisterData({ name: "", email: "" }); }}
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-6 text-base font-bold rounded-full shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 border-2 border-cyan-400/50"
            >
              Criar Conta
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

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
              <span className="font-medium">Fortalecimento dos Enxertos</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-cyan-400" />
              <span className="font-medium">Reduz Queda Pós-Choque</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-cyan-400" />
              <span className="font-medium">Crescimento Saudável</span>
            </div>
          </div>
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

      {/* Register Dialog */}
      <Dialog open={showRegisterDialog} onOpenChange={setShowRegisterDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Criar Conta Grátis</DialogTitle>
            <p className="text-sm text-center text-gray-500 mt-1">30 dias gratuitos — sem cartão de crédito</p>
          </DialogHeader>
          <form onSubmit={handleRegister} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="register-name">Nome Completo</Label>
              <Input
                id="register-name"
                type="text"
                placeholder="Digite seu nome"
                value={registerData.name}
                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="register-email">E-mail</Label>
              <Input
                id="register-email"
                type="email"
                placeholder="seu@email.com"
                value={registerData.email}
                onChange={(e) => {
                  setRegisterData({ ...registerData, email: e.target.value });
                  setRegisterError("");
                }}
                required
                className="mt-1"
              />
            </div>

            {registerError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                <p className="font-semibold">❌ {registerError}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isRegisterLoading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-6 text-lg rounded-full mt-6 disabled:opacity-50"
            >
              {isRegisterLoading ? 'Criando conta...' : 'Criar Conta e Fazer Quiz'}
            </Button>

            <p className="text-xs text-center text-gray-500 mt-4">
              Já tem conta?{' '}
              <button
                type="button"
                onClick={() => { setShowRegisterDialog(false); setShowLoginDialog(true); }}
                className="text-blue-600 underline hover:text-blue-800"
              >
                Acessar aqui
              </button>
            </p>
          </form>
        </DialogContent>
      </Dialog>

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
              Não tem conta?{' '}
              <button
                type="button"
                onClick={() => { setShowLoginDialog(false); setShowRegisterDialog(true); }}
                className="text-blue-600 underline hover:text-blue-800"
              >
                Criar conta grátis
              </button>
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
