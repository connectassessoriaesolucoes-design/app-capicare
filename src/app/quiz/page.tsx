"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Upload, Camera } from "lucide-react";
import { quizQuestions } from "@/lib/data/quiz-questions";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function QuizPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showEducational, setShowEducational] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const progress = ((currentQuestion + 1) / (quizQuestions.length + 1)) * 100;
  const isLastQuestion = currentQuestion === quizQuestions.length - 1;

  const handleAnswer = (answer: string) => {
    const question = quizQuestions[currentQuestion];
    setAnswers({ ...answers, [question.id]: answer });

    if (question.type === 'info' && question.educationalContent) {
      setShowEducational(true);
    } else {
      handleNext();
    }
  };

  const handleNext = () => {
    setShowEducational(false);
    
    if (isLastQuestion) {
      setShowPhotoUpload(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamanho do arquivo (máx 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("A foto deve ter no máximo 10MB");
        return;
      }

      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        alert("Por favor, envie apenas imagens");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedPhoto(reader.result as string);
      };
      reader.onerror = () => {
        alert("Erro ao carregar a imagem. Tente novamente.");
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' },
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setShowCamera(true);
      }
    } catch (error) {
      console.error("Erro ao acessar câmera:", error);
      alert("Não foi possível acessar a câmera. Verifique as permissões do navegador.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const photoData = canvas.toDataURL('image/jpeg');
        setUploadedPhoto(photoData);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const handleFinishWithPhoto = () => {
    if (!uploadedPhoto) {
      alert("Por favor, envie uma selfie para continuar");
      return;
    }

    setIsProcessing(true);

    try {
      // Salvar respostas no localStorage de forma segura
      if (typeof window !== 'undefined') {
        localStorage.setItem('quizAnswers', JSON.stringify(answers));
        localStorage.setItem('userPhoto', uploadedPhoto);
        localStorage.setItem('quizCompleted', 'true');
        localStorage.setItem('photoSubmitted', 'true');
      }

      // Pequeno delay para garantir que o localStorage foi salvo
      setTimeout(() => {
        router.push('/resultado');
      }, 500);
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
      alert("Erro ao processar seus dados. Tente novamente.");
      setIsProcessing(false);
    }
  };

  const handleFinishWithoutPhoto = () => {
    setIsProcessing(true);

    try {
      // Salvar respostas no localStorage sem foto
      if (typeof window !== 'undefined') {
        localStorage.setItem('quizAnswers', JSON.stringify(answers));
        localStorage.setItem('quizCompleted', 'true');
        localStorage.setItem('photoSubmitted', 'false');
        localStorage.removeItem('userPhoto');
      }

      // Pequeno delay para garantir que o localStorage foi salvo
      setTimeout(() => {
        router.push('/resultado');
      }, 500);
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
      alert("Erro ao processar seus dados. Tente novamente.");
      setIsProcessing(false);
    }
  };

  const currentQuestionData = quizQuestions[currentQuestion];

  if (showPhotoUpload) {
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

          <Card className="p-8 shadow-2xl bg-white/5 backdrop-blur-xl border border-white/10">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/50">
                <Camera className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Última Etapa: Envie uma Selfie
              </h2>
              <p className="text-blue-100">
                Para analisarmos seu grau de calvície e personalizar ainda mais seu plano
              </p>
            </div>

            <div className="space-y-6">
              {showCamera ? (
                <div className="relative">
                  <video 
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-64 object-cover rounded-lg border-2 border-cyan-400/30"
                  />
                  <div className="flex gap-3 mt-4">
                    <Button
                      onClick={capturePhoto}
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-6 rounded-full shadow-lg"
                    >
                      <Camera className="mr-2 h-5 w-5" />
                      Capturar Foto
                    </Button>
                    <Button
                      onClick={stopCamera}
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-6"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : uploadedPhoto ? (
                <div className="relative">
                  <img 
                    src={uploadedPhoto} 
                    alt="Sua foto" 
                    className="w-full h-64 object-cover rounded-lg border-2 border-cyan-400/30"
                  />
                  <Button
                    variant="outline"
                    className="mt-4 w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                    onClick={() => setUploadedPhoto(null)}
                    disabled={isProcessing}
                  >
                    Trocar Foto
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Botão Tirar Selfie */}
                  <Button
                    onClick={startCamera}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-6 rounded-full shadow-lg shadow-purple-500/50"
                  >
                    <Camera className="mr-2 h-5 w-5" />
                    Tirar Selfie Agora
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/20"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-slate-900 text-blue-200">ou</span>
                    </div>
                  </div>

                  {/* Botão Selecionar Imagem */}
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-6 rounded-full shadow-lg shadow-cyan-500/50"
                  >
                    <Upload className="mr-2 h-5 w-5" />
                    Selecionar Imagem da Galeria
                  </Button>
                  
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handlePhotoUpload}
                  />

                  <p className="text-center text-sm text-blue-200">
                    PNG, JPG (MAX. 10MB)
                  </p>
                </div>
              )}

              {uploadedPhoto && !showCamera && (
                <div className="space-y-4 mt-6">
                  {/* Botão Enviar Foto e Receber Plano */}
                  <Button
                    onClick={handleFinishWithPhoto}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-6 text-lg rounded-full shadow-lg shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <span className="animate-pulse">Processando...</span>
                      </>
                    ) : (
                      <>
                        Enviar Foto e Receber Plano Gratuito
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>

                  {/* Botão Seguir Sem Enviar */}
                  <Button
                    onClick={handleFinishWithoutPhoto}
                    disabled={isProcessing}
                    variant="outline"
                    className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 py-6 text-lg rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Seguir Sem Enviar Foto
                  </Button>

                  <p className="text-center text-sm text-yellow-300 mt-2">
                    ⚠️ Não enviar a foto pode influenciar na precisão do seu plano personalizado
                  </p>
                </div>
              )}

              {!uploadedPhoto && (
                <div className="mt-6">
                  {/* Botão Seguir Sem Enviar (quando não tem foto) */}
                  <Button
                    onClick={handleFinishWithoutPhoto}
                    disabled={isProcessing}
                    variant="outline"
                    className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 py-4 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Pular Esta Etapa
                  </Button>

                  <p className="text-center text-sm text-yellow-300 mt-3">
                    ⚠️ Não enviar a foto pode influenciar na precisão do seu plano personalizado
                  </p>
                </div>
              )}

              <p className="text-xs text-center text-blue-200 mt-4">
                Sua foto será usada apenas para análise e acompanhamento do seu progresso
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (showEducational && currentQuestionData.educationalContent) {
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

          <Card className="p-8 shadow-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white border-2 border-cyan-400/50">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <span className="text-3xl">💡</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">
                {currentQuestionData.educationalContent.title}
              </h3>
              <p className="text-lg leading-relaxed text-blue-50">
                {currentQuestionData.educationalContent.description}
              </p>
            </div>

            <Button
              onClick={handleNext}
              className="w-full bg-white text-blue-600 hover:bg-gray-100 py-6 text-lg rounded-full mt-6 shadow-lg"
            >
              Continuar
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Card>
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

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-blue-200">
              Pergunta {currentQuestion + 1} de {quizQuestions.length}
            </span>
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
