'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Coins, Gift, Users, Calendar, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Raffle {
  id: string;
  title: string;
  description: string;
  image: string;
  ticketPrice: number;
  totalTickets: number;
  soldTickets: number;
  drawDate: Date;
  prize: string;
  category: 'premium' | 'sport' | 'tech';
}

// Sorteios disponíveis (em produção, virá do backend)
const RAFFLES: Raffle[] = [
  {
    id: '1',
    title: 'Tênis Nike Air Zoom Pegasus',
    description: 'Tênis de corrida profissional com tecnologia Air Zoom',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    ticketPrice: 200,
    totalTickets: 100,
    soldTickets: 67,
    drawDate: new Date('2024-12-31'),
    prize: 'Tênis Nike Air Zoom Pegasus 40',
    category: 'sport',
  },
  {
    id: '2',
    title: 'Apple Watch Series 9',
    description: 'Smartwatch com GPS e monitor cardíaco avançado',
    image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=400&fit=crop',
    ticketPrice: 300,
    totalTickets: 80,
    soldTickets: 45,
    drawDate: new Date('2024-12-25'),
    prize: 'Apple Watch Series 9 GPS 45mm',
    category: 'tech',
  },
  {
    id: '3',
    title: 'Óculos Oakley Radar EV',
    description: 'Óculos esportivos com lentes Prizm para corrida',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop',
    ticketPrice: 150,
    totalTickets: 120,
    soldTickets: 89,
    drawDate: new Date('2024-12-20'),
    prize: 'Óculos Oakley Radar EV Path',
    category: 'sport',
  },
  {
    id: '4',
    title: 'Relógio Garmin Forerunner 965',
    description: 'Relógio GPS premium para corrida e triathlon',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    ticketPrice: 400,
    totalTickets: 60,
    soldTickets: 23,
    drawDate: new Date('2025-01-15'),
    prize: 'Garmin Forerunner 965',
    category: 'premium',
  },
  {
    id: '5',
    title: 'Fone JBL Endurance Peak 3',
    description: 'Fone de ouvido esportivo à prova d\'água',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop',
    ticketPrice: 100,
    totalTickets: 150,
    soldTickets: 112,
    drawDate: new Date('2024-12-18'),
    prize: 'JBL Endurance Peak 3',
    category: 'tech',
  },
  {
    id: '6',
    title: 'Kit Completo de Corrida',
    description: 'Tênis, camiseta, shorts e garrafa térmica',
    image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=400&fit=crop',
    ticketPrice: 250,
    totalTickets: 100,
    soldTickets: 54,
    drawDate: new Date('2025-01-05'),
    prize: 'Kit Completo Nike Running',
    category: 'premium',
  },
];

export default function RafflesPage() {
  const router = useRouter();
  const { user, updateUser, isLoading } = useAuth();
  const [selectedRaffle, setSelectedRaffle] = useState<Raffle | null>(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [myTickets, setMyTickets] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    // Carregar tickets do usuário do localStorage
    if (user) {
      const stored = localStorage.getItem(`raffle_tickets_${user.id}`);
      if (stored) {
        setMyTickets(JSON.parse(stored));
      }
    }
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-950 via-black to-emerald-900">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  const handleBuyTickets = (raffle: Raffle) => {
    const totalCost = raffle.ticketPrice * ticketQuantity;
    
    if (user.coins < totalCost) {
      alert('Você não tem capicoins suficientes!');
      return;
    }

    // Atualizar saldo do usuário
    updateUser({ coins: user.coins - totalCost });

    // Salvar tickets comprados
    const newTickets = { ...myTickets };
    newTickets[raffle.id] = (newTickets[raffle.id] || 0) + ticketQuantity;
    setMyTickets(newTickets);
    localStorage.setItem(`raffle_tickets_${user.id}`, JSON.stringify(newTickets));

    // Mostrar mensagem de sucesso
    setShowSuccess(true);
    setSelectedRaffle(null);
    setTicketQuantity(1);

    setTimeout(() => setShowSuccess(false), 3000);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'premium':
        return 'bg-purple-600';
      case 'sport':
        return 'bg-blue-600';
      case 'tech':
        return 'bg-cyan-600';
      default:
        return 'bg-emerald-600';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'premium':
        return 'Premium';
      case 'sport':
        return 'Esporte';
      case 'tech':
        return 'Tecnologia';
      default:
        return 'Geral';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-black to-emerald-900">
      {/* Header */}
      <header className="bg-black/50 border-b border-emerald-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="text-emerald-400">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Gift className="w-6 h-6 text-yellow-400" />
                Sorteios
              </h1>
              <p className="text-xs text-emerald-400">Concorra a prêmios incríveis!</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-emerald-900/50 px-4 py-2 rounded-full">
            <Coins className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-bold">{user.coins}</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Mensagem de Sucesso */}
        {showSuccess && (
          <Alert className="bg-green-900/50 border-green-600">
            <Sparkles className="h-5 w-5 text-green-400" />
            <AlertDescription className="text-green-200 font-semibold">
              🎉 Tickets comprados com sucesso! Boa sorte no sorteio!
            </AlertDescription>
          </Alert>
        )}

        {/* Informações */}
        <Card className="bg-gradient-to-r from-yellow-600 to-amber-600 border-none">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Gift className="w-12 h-12 text-white flex-shrink-0" />
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Como Funciona?</h2>
                <p className="text-white/90 text-sm">
                  Compre tickets com suas capicoins e concorra a produtos premium! 
                  Quanto mais tickets você tiver, maiores suas chances de ganhar. 
                  Os sorteios acontecem nas datas indicadas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Meus Tickets */}
        {Object.keys(myTickets).length > 0 && (
          <Card className="bg-black/50 border-emerald-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                Meus Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(myTickets).map(([raffleId, quantity]) => {
                  const raffle = RAFFLES.find(r => r.id === raffleId);
                  if (!raffle || quantity === 0) return null;
                  return (
                    <div key={raffleId} className="flex items-center justify-between bg-emerald-950/50 p-3 rounded-lg">
                      <span className="text-white text-sm">{raffle.title}</span>
                      <Badge className="bg-yellow-600">{quantity} ticket{quantity > 1 ? 's' : ''}</Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de Sorteios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RAFFLES.map((raffle) => {
            const progress = (raffle.soldTickets / raffle.totalTickets) * 100;
            const myTicketCount = myTickets[raffle.id] || 0;
            
            return (
              <Card key={raffle.id} className="bg-black/50 border-emerald-800 overflow-hidden hover:border-emerald-600 transition-colors">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={raffle.image} 
                    alt={raffle.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className={`absolute top-3 right-3 ${getCategoryColor(raffle.category)}`}>
                    {getCategoryLabel(raffle.category)}
                  </Badge>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-white text-lg">{raffle.title}</CardTitle>
                  <CardDescription className="text-emerald-300 text-sm">
                    {raffle.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Progresso */}
                  <div>
                    <div className="flex justify-between text-xs text-emerald-400 mb-2">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {raffle.soldTickets}/{raffle.totalTickets} tickets
                      </span>
                      <span>{progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-emerald-950 rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Data do Sorteio */}
                  <div className="flex items-center gap-2 text-emerald-400 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>Sorteio: {raffle.drawDate.toLocaleDateString('pt-BR')}</span>
                  </div>

                  {/* Meus Tickets */}
                  {myTicketCount > 0 && (
                    <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-2 text-center">
                      <p className="text-yellow-200 text-sm font-semibold">
                        Você tem {myTicketCount} ticket{myTicketCount > 1 ? 's' : ''}
                      </p>
                    </div>
                  )}

                  {/* Preço e Botão */}
                  <div className="pt-2 border-t border-emerald-800">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-emerald-400 text-sm">Preço do ticket:</span>
                      <div className="flex items-center gap-1">
                        <Coins className="w-5 h-5 text-yellow-400" />
                        <span className="text-white font-bold text-lg">{raffle.ticketPrice}</span>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => setSelectedRaffle(raffle)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                      disabled={raffle.soldTickets >= raffle.totalTickets}
                    >
                      {raffle.soldTickets >= raffle.totalTickets ? 'Esgotado' : 'Comprar Tickets'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>

      {/* Modal de Compra */}
      {selectedRaffle && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <Card className="bg-emerald-950 border-emerald-800 max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-white">{selectedRaffle.title}</CardTitle>
              <CardDescription className="text-emerald-300">
                Quantos tickets você deseja comprar?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center gap-4">
                <Button
                  onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                  variant="outline"
                  className="w-12 h-12 text-xl"
                >
                  -
                </Button>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white">{ticketQuantity}</div>
                  <div className="text-emerald-400 text-sm">ticket{ticketQuantity > 1 ? 's' : ''}</div>
                </div>
                <Button
                  onClick={() => setTicketQuantity(ticketQuantity + 1)}
                  variant="outline"
                  className="w-12 h-12 text-xl"
                >
                  +
                </Button>
              </div>

              <div className="bg-black/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-emerald-400">
                  <span>Preço unitário:</span>
                  <span className="flex items-center gap-1">
                    <Coins className="w-4 h-4 text-yellow-400" />
                    {selectedRaffle.ticketPrice}
                  </span>
                </div>
                <div className="flex justify-between text-white font-bold text-lg">
                  <span>Total:</span>
                  <span className="flex items-center gap-1">
                    <Coins className="w-5 h-5 text-yellow-400" />
                    {selectedRaffle.ticketPrice * ticketQuantity}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-400 text-sm">
                  <span>Seu saldo:</span>
                  <span className="flex items-center gap-1">
                    <Coins className="w-4 h-4 text-yellow-400" />
                    {user.coins}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setSelectedRaffle(null);
                    setTicketQuantity(1);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => handleBuyTickets(selectedRaffle)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  disabled={user.coins < selectedRaffle.ticketPrice * ticketQuantity}
                >
                  Confirmar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
