"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Camera, TrendingUp, User, Menu, Calendar, Upload, CheckCircle, Loader2 } from "lucide-react";
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
  updatedAt?: string | null;
}

export default function EvolucaoPage() {
  const [records, setRecords] = useState<WeekRecord[]>([]);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [uploadingWeek, setUploadingWeek] = useState<number | null>(null);
  const [savingWeek, setSavingWeek] = useState<number | null>(null);
  const [savedWeek, setSavedWeek] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadEvolution = useCallback(async (email: string) => {
    try {
      const response = await fetch(`/api/evolution?email=${encodeURIComponent(email)}`);
      const result = await response.json();

      if (result.success && result.records) {
        setRecords(result.records);
        // Salvar cache local
        localStorage.setItem('evolutionRecords', JSON.stringify(result.records));
      } else {
        initEmptyRecords();
      }
    } catch {
      // Fallback para localStorage se API falhar
      const saved = localStorage.getItem('evolutionRecords');
      if (saved) {
        try { setRecords(JSON.parse(saved)); } catch { initEmptyRecords(); }
      } else {
        initEmptyRecords();
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const initEmptyRecords = () => {
    const initial: WeekRecord[] = Array.from({ length: 13 }, (_, i) => ({
      week: i + 1,
      photo: null,
      observation: "",
      updatedAt: null
    }));
    setRecords(initial);
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const name = userData.name || 'Usuário';
    const email = userData.email || '';
    setUserName(name);
    setUserEmail(email);

    if (email) {
      loadEvolution(email);
    } else {
      // Sem email no localStorage — carregar do cache local
      const saved = localStorage.getItem('evolutionRecords');
      if (saved) {
        try { setRecords(JSON.parse(saved)); } catch { initEmptyRecords(); }
      } else {
        initEmptyRecords();
      }
      setIsLoading(false);
    }
  }, [loadEvolution]);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;

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
          if (!ctx) { reject(new Error('Erro no canvas')); return; }

          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.onerror = () => reject(new Error('Erro ao carregar imagem'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsDataURL(file);
    });
  };

  const saveWeekToServer = async (weekNumber: number, photo: string | null, observation: string) => {
    if (!userEmail) return;
    setSavingWeek(weekNumber);
    try {
      await fetch('/api/evolution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, weekNumber, photo, observation })
      });
      setSavedWeek(weekNumber);
      setTimeout(() => setSavedWeek(null), 2000);
    } catch {
      // Silencioso — os dados já ficam no estado local
    } finally {
      setSavingWeek(null);
    }
  };

  const handlePhotoUpload = async (week: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('A imagem é muito grande. Selecione uma imagem menor que 10MB');
      return;
    }

    setUploadingWeek(week);

    try {
      const compressedImage = await compressImage(file);

      const updatedRecords = records.map(r =>
        r.week === week ? { ...r, photo: compressedImage } : r
      );
      setRecords(updatedRecords);
      localStorage.setItem('evolutionRecords', JSON.stringify(updatedRecords));

      const currentRecord = updatedRecords.find(r => r.week === week);
      await saveWeekToServer(week, compressedImage, currentRecord?.observation || '');
    } catch {
      alert('Erro ao processar a imagem. Tente novamente.');
    } finally {
      setUploadingWeek(null);
    }
  };

  const handleObservationChange = (week: number, observation: string) => {
    const updatedRecords = records.map(r =>
      r.week === week ? { ...r, observation } : r
    );
    setRecords(updatedRecords);
    localStorage.setItem('evolutionRecords', JSON.stringify(updatedRecords));
  };

  const handleObservationBlur = async (week: number, observation: string) => {
    const currentRecord = records.find(r => r.week === week);
    await saveWeekToServer(week, currentRecord?.photo || null, observation);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Carregando sua evolução...</p>
        </div>
      </div>
    );
  }

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

            <nav className="hidden md:flex gap-6 items-center">
              <Link href="/plano" className="text-white/80 hover:text-white transition-colors">Meu Plano</Link>
              <Link href="/evolucao" className="text-cyan-400 font-semibold">Evolução</Link>
              <Link href="/chat" className="text-white/80 hover:text-white transition-colors">Chat</Link>
              <Link href="/perfil" className="text-white/80 hover:text-white transition-colors flex items-center gap-2">
                <User className="h-4 w-4" />
                {userName}
              </Link>
            </nav>

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
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Acompanhe Sua Evolução
          </h1>
          <p className="text-xl text-blue-100">
            Registre seu progresso semanal — as fotos e anotações ficam salvas na nuvem, disponíveis em qualquer dispositivo.
          </p>
        </div>

        <Card className="p-6 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-xl border border-cyan-400/30 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Como funciona?</h3>
              <p className="text-blue-100">
                Tire uma selfie toda semana no mesmo ângulo e iluminação. Adicione observações sobre como está se sentindo e as mudanças que notou. Tudo fica salvo automaticamente na nuvem!
              </p>
            </div>
          </div>
        </Card>

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
                  Dia {(record.week - 1) * 7 + 1}–{record.week * 7}
                </span>
                {savingWeek === record.week && (
                  <Loader2 className="h-4 w-4 text-cyan-400 animate-spin" />
                )}
                {savedWeek === record.week && (
                  <CheckCircle className="h-4 w-4 text-green-400" />
                )}
              </div>

              {/* Foto */}
              <div className="mb-4">
                <label htmlFor={`photo-${record.week}`} className="block cursor-pointer">
                  {uploadingWeek === record.week ? (
                    <div className="w-full h-64 bg-white/5 border-2 border-dashed border-cyan-400 rounded-lg flex flex-col items-center justify-center">
                      <Loader2 className="h-12 w-12 text-cyan-400 animate-spin mb-2" />
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

              {/* Observação */}
              <div>
                <label className="text-sm text-blue-200 mb-2 block">
                  Observações da semana:
                </label>
                <Textarea
                  value={record.observation}
                  onChange={(e) => handleObservationChange(record.week, e.target.value)}
                  onBlur={(e) => handleObservationBlur(record.week, e.target.value)}
                  placeholder="Como está se sentindo? Notou alguma mudança? Adicione suas observações aqui..."
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[100px] resize-none"
                />
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-8 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-xl border border-cyan-400/30 mt-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">
            Continue Firme na Sua Jornada!
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
