"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, User, Menu, Calendar, TrendingUp } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Message {
  id: string;
  user: string;
  text: string;
  timestamp: Date;
  profileImage?: string;
}

const simulatedUsers = [
  "Ana Silva", "Carlos Mendes", "Beatriz Costa", "Diego Santos", 
  "Fernanda Lima", "Gabriel Rocha", "Helena Martins", "Igor Alves",
  "Juliana Souza", "Lucas Ferreira", "Marina Oliveira", "Nicolas Pereira"
];

const simulatedMessages = [
  "Pessoal, estou na segunda semana e já notei diferença! 🎉",
  "Alguém mais sentiu o cabelo mais forte?",
  "Comecei hoje, animado com os resultados!",
  "Dica: não esqueçam de beber bastante água! 💧",
  "Meu cabelo está crescendo mais rápido, incrível!",
  "Quem mais está seguindo o plano à risca?",
  "Acabei de registrar minha foto semanal 📸",
  "Os alimentos realmente fazem diferença!",
  "Estou amando essa comunidade! ❤️",
  "Alguém tem dicas para não esquecer as refeições?",
  "Minha família já notou a diferença!",
  "Semana 4 e os resultados são visíveis! 🚀",
  "Não desistam, vale muito a pena!",
  "Quem está no plano de 90 dias também?",
  "Melhor investimento que fiz! 💪"
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [userProfileImage, setUserProfileImage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    setUserName(userData.name || 'Usuário');
    setUserProfileImage(userData.profileImage || '');

    // Carregar mensagens salvas
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages);
      setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Simular mensagens a cada 20 segundos se não houver mensagens
    if (messages.length === 0) {
      const interval = setInterval(() => {
        const randomUser = simulatedUsers[Math.floor(Math.random() * simulatedUsers.length)];
        const randomMessage = simulatedMessages[Math.floor(Math.random() * simulatedMessages.length)];
        
        const newMsg: Message = {
          id: Date.now().toString(),
          user: randomUser,
          text: randomMessage,
          timestamp: new Date()
        };

        setMessages(prev => {
          const updated = [...prev, newMsg];
          localStorage.setItem('chatMessages', JSON.stringify(updated));
          return updated;
        });
      }, 20000); // 20 segundos

      // Adicionar primeira mensagem imediatamente
      setTimeout(() => {
        const firstMsg: Message = {
          id: Date.now().toString(),
          user: simulatedUsers[0],
          text: simulatedMessages[0],
          timestamp: new Date()
        };
        setMessages([firstMsg]);
        localStorage.setItem('chatMessages', JSON.stringify([firstMsg]));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [messages.length]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const msg: Message = {
        id: Date.now().toString(),
        user: userName,
        text: newMessage,
        timestamp: new Date(),
        profileImage: userProfileImage
      };

      const updated = [...messages, msg];
      setMessages(updated);
      localStorage.setItem('chatMessages', JSON.stringify(updated));
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col">
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
              <Link href="/evolucao" className="text-white/80 hover:text-white transition-colors">Evolução</Link>
              <Link href="/chat" className="text-cyan-400 font-semibold">Chat</Link>
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
                  <Link href="/evolucao" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Evolução
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/chat" className="flex items-center gap-2 text-cyan-400">
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

      <div className="container mx-auto px-4 py-8 max-w-5xl flex-1 flex flex-col">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Chat da Comunidade 💬
          </h1>
          <p className="text-xl text-blue-100">
            Compartilhe suas experiências e conecte-se com outros membros
          </p>
        </div>

        {/* Chat Container */}
        <Card className="flex-1 flex flex-col bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MessageCircle className="h-16 w-16 text-white/30 mb-4" />
                <p className="text-white/50 text-lg">
                  Seja o primeiro a enviar uma mensagem!
                </p>
                <p className="text-white/30 text-sm mt-2">
                  Aguarde, mensagens simuladas aparecerão em breve...
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div 
                  key={message.id}
                  className={`flex gap-3 ${message.user === userName ? 'flex-row-reverse' : ''}`}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {message.profileImage ? (
                      <img 
                        src={message.profileImage} 
                        alt={message.user} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-xl">👤</span>
                    )}
                  </div>
                  <div className={`flex flex-col ${message.user === userName ? 'items-end' : 'items-start'} max-w-[70%]`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-cyan-400">
                        {message.user}
                      </span>
                      <span className="text-xs text-white/40">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <div 
                      className={`px-4 py-3 rounded-2xl ${
                        message.user === userName 
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' 
                          : 'bg-white/10 text-white'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-white/10 p-4 bg-black/20">
            <div className="flex gap-3">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-xs text-white/40 mt-2">
              Pressione Enter para enviar • Shift + Enter para nova linha
            </p>
          </div>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 p-4 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-xl border border-cyan-400/30">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-6 w-6 text-cyan-400 flex-shrink-0" />
            <p className="text-sm text-blue-100">
              <strong className="text-white">Dica:</strong> Seja respeitoso e compartilhe suas experiências positivas. 
              Esta é uma comunidade de apoio mútuo!
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
