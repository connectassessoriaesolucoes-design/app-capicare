"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, Calendar, ArrowLeft, Save, Camera, Zap } from "lucide-react";
import Link from "next/link";

export default function PerfilPage() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    birthDate: "",
    profileImage: "",
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('userData');
    if (saved) {
      setUserData(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('userData', JSON.stringify(userData));
    alert('Dados salvos com sucesso!');
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Redimensionar para foto de perfil (400x400)
          const size = 400;
          
          // Calcular crop centralizado
          const minDimension = Math.min(width, height);
          const cropX = (width - minDimension) / 2;
          const cropY = (height - minDimension) / 2;
          
          canvas.width = size;
          canvas.height = size;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Não foi possível processar a imagem'));
            return;
          }
          
          // Desenhar imagem quadrada centralizada
          ctx.drawImage(
            img,
            cropX, cropY, minDimension, minDimension,
            0, 0, size, size
          );
          
          // Converter para base64 com compressão (qualidade 0.85)
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          resolve(compressedDataUrl);
        };
        img.onerror = () => reject(new Error('Erro ao carregar imagem'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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

    setIsUploading(true);

    try {
      const compressedImage = await compressImage(file);
      const newUserData = { ...userData, profileImage: compressedImage };
      setUserData(newUserData);
      localStorage.setItem('userData', JSON.stringify(newUserData));
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      alert('Erro ao processar a imagem. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
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
            <h1 className="text-2xl font-bold text-white">Meu Perfil</h1>
            <div className="w-24" /> {/* Spacer para centralizar */}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Card className="p-8 bg-white/5 backdrop-blur-xl border border-white/10">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              {isUploading ? (
                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                </div>
              ) : userData.profileImage ? (
                <img 
                  src={userData.profileImage} 
                  alt="Foto de perfil" 
                  className="w-20 h-20 rounded-full object-cover border-2 border-cyan-500"
                  loading="lazy"
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-white" />
                </div>
              )}
              <label 
                htmlFor="profile-image" 
                className="absolute bottom-0 right-0 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-cyan-600 transition-colors shadow-lg"
              >
                <Camera className="h-4 w-4 text-white" />
              </label>
              <input
                id="profile-image"
                type="file"
                accept="image/*,image/heic,image/heif"
                capture="user"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">{userData.name || 'Usuário'}</h2>
              <p className="text-blue-200">Plano Gratuito</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-white mb-2 flex items-center gap-2">
                <User className="h-4 w-4" />
                Nome Completo
              </Label>
              <Input
                id="name"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                placeholder="Seu nome completo"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-white mb-2 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-white mb-2 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Telefone
              </Label>
              <Input
                id="phone"
                type="tel"
                value={userData.phone}
                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                placeholder="(00) 00000-0000"
              />
            </div>

            <div>
              <Label htmlFor="birthDate" className="text-white mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Data de Nascimento
              </Label>
              <Input
                id="birthDate"
                type="date"
                value={userData.birthDate}
                onChange={(e) => setUserData({ ...userData, birthDate: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>

            <Button 
              onClick={handleSave}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-6 text-lg font-bold rounded-full shadow-lg shadow-cyan-500/50"
            >
              <Save className="mr-2 h-5 w-5" />
              Salvar Alterações
            </Button>
          </div>
        </Card>

        {/* Card de Upgrade - Direcionando para Landing Page do Boné */}
        <Card className="p-8 bg-gradient-to-br from-blue-500/20 to-cyan-600/20 backdrop-blur-xl border border-blue-400/30 text-center mt-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/50">
              <Zap className="h-8 w-8 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">
            Turbine Seus Resultados
          </h3>
          <p className="text-blue-100 mb-6">
            Acelere o crescimento capilar com o Boné CapiCare de ledterapia profissional
          </p>
          <Link href="/bone-ledterapia">
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-8 py-6 text-lg font-bold rounded-full shadow-lg shadow-blue-500/50">
              Conhecer o Boné CapiCare
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
