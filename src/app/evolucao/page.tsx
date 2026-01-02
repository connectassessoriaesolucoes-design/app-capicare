"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Camera, TrendingUp, User, Menu, Calendar, Upload } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WeekRecord {
  week: number;
  photo: string | null;
  observation: string;
}

export default function EvolucaoPage() {
  const [records, setRecords] = useState<WeekRecord[]>([]);
  const [userName, setUserName] = useState("");
  const [uploadingWeek, setUploadingWeek] = useState<number | null>(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    setUserName(userData.name || 'Usuário');

    // Inicializar 13 semanas (90 dias)
    const savedRecords = localStorage.getItem('evolutionRecords');
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    } else {
      const initialRecords: WeekRecord[] = Array.from({ length: 13 }, (_, i) => ({
        week: i + 1,
        photo: null,
        observation: ""
      }));
      setRecords(initialRecords);
    }
  }, []);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Redimensionar mantendo proporção (máx 1200px)
          const maxSize = 1200;
          if (width > height && width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          } else if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Não foi possível processar a imagem'));
            return;
          }
          
          // Desenhar imagem com qualidade otimizada
          ctx.drawImage(img, 0, 0, width, height);
          
          // Converter para base64 com compressão (qualidade 0.8)
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          resolve(compressedDataUrl);
        };
        img.onerror = () => reject(new Error('Erro ao carregar imagem'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsDataURL(file);
    });
  };

  const handlePhotoUpload = async (week: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem');
      return;
    }

    // Validar tamanho (máx 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('A imagem é muito grande. Por favor, selecione uma imagem menor que 10MB');
      return;
    }

    setUploadingWeek(week);

    try {
      const compressedImage = await compressImage(file);
      
      const updatedRecords = records.map(record =>
        record.week === week ? { ...record, photo: compressedImage } : record
      );
      
      setRecords(updatedRecords);
      localStorage.setItem('evolutionRecords', JSON.stringify(updatedRecords));
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      alert('Erro ao processar a imagem. Tente novamente.');
    } finally {
      setUploadingWeek(null);
    }
  };

  const handleObservationChange = (week: number, observation: string) => {
    const updatedRecords = records.map(record =>
      record.week === week ? { ...record, observation } : record
    );
    setRecords(updatedRecords);
    localStorage.setItem('evolutionRecords', JSON.stringify(updatedRecords));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
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
              <Link href="/plano" className="text-white/80 hover:text-white transition-colors">Meu Plano</Link>
              <Link href="/evolucao" className="text-cyan-400 font-semibold">Evolução</Link>
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
                  <Link href="/plano" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Meu Plano
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/evolucao" className="flex items-center gap-2 text-cyan-400">
                    <TrendingUp className="h-4 w-4" />
                    Evolução
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/chat" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
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
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Acompanhe Sua Evolução 📸
          </h1>
          <p className="text-xl text-blue-100">
            Registre seu progresso semanal e veja sua transformação ao longo de 90 dias
          </p>
        </div>

        {/* Info Card */}
        <Card className="p-6 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-xl border border-cyan-400/30 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Como funciona?</h3>
              <p className="text-blue-100">
                Tire uma selfie toda semana no mesmo ângulo e iluminação. Adicione observações sobre como está se sentindo, 
                mudanças que notou e qualquer detalhe importante. Ao final de 90 dias, você terá um registro completo da sua jornada!
              </p>
            </div>
          </div>
        </Card>

        {/* Weekly Records Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {records.map((record) => (
            <Card 
              key={record.week} 
              className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 hover:border-cyan-400/50 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">{record.week}</span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  Semana {record.week}
                </h3>
                <span className="text-sm text-blue-300 ml-auto">
                  Dia {(record.week - 1) * 7 + 1}-{record.week * 7}
                </span>
              </div>

              {/* Photo Upload Area */}
              <div className="mb-4">
                <label 
                  htmlFor={`photo-${record.week}`}
                  className="block cursor-pointer"
                >
                  {uploadingWeek === record.week ? (
                    <div className="w-full h-64 bg-white/5 border-2 border-dashed border-cyan-400 rounded-lg flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mb-2"></div>
                      <span className="text-white/70 text-sm">Processando imagem...</span>
                    </div>
                  ) : record.photo ? (
                    <div className="relative group">
                      <img 
                        src={record.photo} 
                        alt={`Semana ${record.week}`}
                        className="w-full h-64 object-cover rounded-lg"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Upload className="h-8 w-8 text-white" />
                        <span className="text-white ml-2">Alterar foto</span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-64 bg-white/5 border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center hover:border-cyan-400/50 hover:bg-white/10 transition-all">
                      <Camera className="h-12 w-12 text-white/50 mb-2" />
                      <span className="text-white/70 text-sm">Clique para adicionar foto</span>
                    </div>
                  )}
                </label>
                <input
                  id={`photo-${record.week}`}
                  type="file"
                  accept="image/*,image/heic,image/heif"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => handlePhotoUpload(record.week, e)}
                />
              </div>

              {/* Observation Textarea */}
              <div>
                <label className="text-sm text-blue-200 mb-2 block">
                  Observações da semana:
                </label>
                <Textarea
                  value={record.observation}
                  onChange={(e) => handleObservationChange(record.week, e.target.value)}
                  placeholder="Como você está se sentindo? Notou alguma mudança? Adicione suas observações aqui..."
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[100px] resize-none"
                />
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <Card className="p-8 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-xl border border-cyan-400/30 mt-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">
            Continue Firme na Sua Jornada! 💪
          </h3>
          <p className="text-blue-100 mb-6">
            A consistência é a chave para resultados incríveis. Continue seguindo seu plano alimentar e registrando seu progresso.
          </p>
          <Link href="/plano">
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-6 text-lg font-bold rounded-full">
              Voltar ao Meu Plano
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
