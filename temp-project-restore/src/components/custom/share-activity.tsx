'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Share2, Facebook, Twitter, Instagram, MessageCircle, Download } from 'lucide-react';

interface ShareActivityProps {
  distance: number;
  duration: number;
  calories: number;
  pace: string;
  mapImageUrl?: string;
}

export function ShareActivity({ distance, duration, calories, pace, mapImageUrl }: ShareActivityProps) {
  const [isOpen, setIsOpen] = useState(false);

  const generateShareText = () => {
    return `🦫 Acabei de correr ${distance.toFixed(2)}km com o Capirun!\n⏱️ Tempo: ${Math.floor(duration / 60)}min\n🔥 ${calories} calorias queimadas\n⚡ Pace: ${pace}/km`;
  };

  const generateShareImage = async () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Configurar tamanho do canvas (formato Instagram Stories)
    canvas.width = 1080;
    canvas.height = 1920;

    // Fundo gradiente
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#064e3b');
    gradient.addColorStop(0.5, '#000000');
    gradient.addColorStop(1, '#064e3b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Logo Capirun (emoji de capivara)
    ctx.font = 'bold 120px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🦫', canvas.width / 2, 200);

    // Título
    ctx.font = 'bold 80px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('CAPIRUN', canvas.width / 2, 320);

    // Linha decorativa
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(340, 360);
    ctx.lineTo(740, 360);
    ctx.stroke();

    // Estatísticas principais
    ctx.font = 'bold 140px Arial';
    ctx.fillStyle = '#10b981';
    ctx.fillText(`${distance.toFixed(2)}`, canvas.width / 2, 560);
    
    ctx.font = '60px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('QUILÔMETROS', canvas.width / 2, 640);

    // Cards de estatísticas
    const statsY = 800;
    const cardWidth = 300;
    const cardHeight = 200;
    const gap = 40;
    const startX = (canvas.width - (cardWidth * 2 + gap)) / 2;

    // Card Tempo
    ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
    ctx.fillRect(startX, statsY, cardWidth, cardHeight);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.strokeRect(startX, statsY, cardWidth, cardHeight);
    
    ctx.font = 'bold 70px Arial';
    ctx.fillStyle = '#10b981';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.floor(duration / 60)}`, startX + cardWidth / 2, statsY + 90);
    
    ctx.font = '40px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('MINUTOS', startX + cardWidth / 2, statsY + 150);

    // Card Calorias
    ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
    ctx.fillRect(startX + cardWidth + gap, statsY, cardWidth, cardHeight);
    ctx.strokeStyle = '#10b981';
    ctx.strokeRect(startX + cardWidth + gap, statsY, cardWidth, cardHeight);
    
    ctx.font = 'bold 70px Arial';
    ctx.fillStyle = '#10b981';
    ctx.fillText(`${calories}`, startX + cardWidth + gap + cardWidth / 2, statsY + 90);
    
    ctx.font = '40px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('CALORIAS', startX + cardWidth + gap + cardWidth / 2, statsY + 150);

    // Pace
    ctx.font = 'bold 60px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('PACE MÉDIO', canvas.width / 2, 1150);
    
    ctx.font = 'bold 100px Arial';
    ctx.fillStyle = '#10b981';
    ctx.fillText(`${pace}`, canvas.width / 2, 1280);
    
    ctx.font = '50px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('MIN/KM', canvas.width / 2, 1350);

    // Mapa (se disponível)
    if (mapImageUrl) {
      try {
        const mapImg = new Image();
        mapImg.crossOrigin = 'anonymous';
        await new Promise((resolve, reject) => {
          mapImg.onload = resolve;
          mapImg.onerror = reject;
          mapImg.src = mapImageUrl;
        });
        
        const mapSize = 600;
        const mapX = (canvas.width - mapSize) / 2;
        const mapY = 1450;
        
        // Borda do mapa
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 6;
        ctx.strokeRect(mapX - 10, mapY - 10, mapSize + 20, mapSize + 20);
        
        ctx.drawImage(mapImg, mapX, mapY, mapSize, mapSize);
      } catch (error) {
        console.error('Erro ao carregar mapa:', error);
      }
    }

    // Rodapé
    ctx.font = '45px Arial';
    ctx.fillStyle = '#10b981';
    ctx.textAlign = 'center';
    ctx.fillText('Baixe o app Capirun', canvas.width / 2, canvas.height - 100);

    return canvas.toDataURL('image/png');
  };

  const handleShare = async (platform: string) => {
    const text = generateShareText();
    const url = window.location.href;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`, '_blank');
        break;
      case 'download':
        const imageData = await generateShareImage();
        if (imageData) {
          const link = document.createElement('a');
          link.download = `capirun-${Date.now()}.png`;
          link.href = imageData;
          link.click();
        }
        break;
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
      >
        <Share2 className="w-4 h-4 mr-2" />
        Compartilhar Atividade
      </Button>

      {isOpen && (
        <Card className="bg-black/50 border-emerald-800 mt-4">
          <CardHeader>
            <CardTitle className="text-white">Compartilhar nas Redes Sociais</CardTitle>
            <CardDescription className="text-emerald-300">
              Mostre seu progresso para seus amigos!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={() => handleShare('facebook')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Facebook className="w-4 h-4 mr-2" />
              Compartilhar no Facebook
            </Button>

            <Button
              onClick={() => handleShare('twitter')}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white"
            >
              <Twitter className="w-4 h-4 mr-2" />
              Compartilhar no Twitter
            </Button>

            <Button
              onClick={() => handleShare('whatsapp')}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Compartilhar no WhatsApp
            </Button>

            <Button
              onClick={() => handleShare('download')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar Imagem para Instagram Stories
            </Button>

            <div className="pt-2 border-t border-emerald-800">
              <p className="text-emerald-300 text-xs text-center">
                💡 A imagem inclui o mapa do seu percurso e a logo do Capirun
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
