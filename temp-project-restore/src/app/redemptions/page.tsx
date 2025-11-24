'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, Calendar, MapPin, CheckCircle, XCircle, Clock, Coins } from 'lucide-react';
import Link from 'next/link';
import { getRedemptions, updateRedemptionStatus } from '@/lib/redemption-storage';
import { Redemption } from '@/lib/types';

export default function RedemptionsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      loadRedemptions();
    }
  }, [user]);

  const loadRedemptions = () => {
    if (!user) return;
    const userRedemptions = getRedemptions(user.id);
    // Ordenar por data mais recente
    userRedemptions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setRedemptions(userRedemptions);
  };

  const handleStatusChange = (redemptionId: string, newStatus: 'pending' | 'completed' | 'cancelled') => {
    updateRedemptionStatus(redemptionId, newStatus);
    loadRedemptions();
  };

  const filteredRedemptions = redemptions.filter(r => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  const totalSpent = redemptions
    .filter(r => r.status !== 'cancelled')
    .reduce((sum, r) => sum + r.coinPrice, 0);

  const pendingCount = redemptions.filter(r => r.status === 'pending').length;
  const completedCount = redemptions.filter(r => r.status === 'completed').length;

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-950 via-black to-emerald-900">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-600">Pendente</Badge>;
      case 'completed':
        return <Badge className="bg-green-600">Retirado</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-600">Cancelado</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-black to-emerald-900">
      {/* Header */}
      <header className="bg-black/50 border-b border-emerald-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/store">
              <Button variant="ghost" size="icon" className="text-emerald-400 hover:text-emerald-300">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">Meus Resgates</h1>
              <p className="text-xs text-emerald-400">Histórico de produtos resgatados</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-emerald-950/50 px-4 py-2 rounded-full">
            <Coins className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-bold">{user.coins}</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-black/50 border-emerald-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-400 text-sm">Total Gasto</p>
                  <p className="text-3xl font-bold text-white">{totalSpent}</p>
                  <p className="text-xs text-emerald-300">capicoins</p>
                </div>
                <Coins className="w-12 h-12 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-emerald-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-400 text-sm">Pendentes</p>
                  <p className="text-3xl font-bold text-white">{pendingCount}</p>
                  <p className="text-xs text-emerald-300">produtos</p>
                </div>
                <Clock className="w-12 h-12 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-emerald-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-400 text-sm">Retirados</p>
                  <p className="text-3xl font-bold text-white">{completedCount}</p>
                  <p className="text-xs text-emerald-300">produtos</p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="bg-black/50 border-emerald-800">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                className={filter === 'all' ? 'bg-emerald-600' : 'border-emerald-600 text-emerald-400'}
              >
                Todos ({redemptions.length})
              </Button>
              <Button
                variant={filter === 'pending' ? 'default' : 'outline'}
                onClick={() => setFilter('pending')}
                className={filter === 'pending' ? 'bg-yellow-600' : 'border-yellow-600 text-yellow-400'}
              >
                Pendentes ({pendingCount})
              </Button>
              <Button
                variant={filter === 'completed' ? 'default' : 'outline'}
                onClick={() => setFilter('completed')}
                className={filter === 'completed' ? 'bg-green-600' : 'border-green-600 text-green-400'}
              >
                Retirados ({completedCount})
              </Button>
              <Button
                variant={filter === 'cancelled' ? 'default' : 'outline'}
                onClick={() => setFilter('cancelled')}
                className={filter === 'cancelled' ? 'bg-red-600' : 'border-red-600 text-red-400'}
              >
                Cancelados ({redemptions.filter(r => r.status === 'cancelled').length})
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Resgates */}
        {filteredRedemptions.length === 0 ? (
          <Card className="bg-black/50 border-emerald-800">
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-white text-xl font-bold mb-2">Nenhum resgate encontrado</h3>
              <p className="text-emerald-300 mb-4">
                {filter === 'all' 
                  ? 'Você ainda não resgatou nenhum produto.'
                  : `Você não tem resgates com status "${filter}".`}
              </p>
              <Link href="/store">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Ir para a Loja
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredRedemptions.map((redemption) => (
              <Card key={redemption.id} className="bg-black/50 border-emerald-800 hover:border-emerald-600 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      {getStatusIcon(redemption.status)}
                      <div>
                        <CardTitle className="text-white">{redemption.productName}</CardTitle>
                        <CardDescription className="text-emerald-300">
                          Resgatado em {new Date(redemption.date).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(redemption.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-emerald-200">
                      <Coins className="w-5 h-5 text-yellow-400" />
                      <span className="font-bold text-white">{redemption.coinPrice}</span>
                      <span className="text-sm">capicoins</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-200">
                      <MapPin className="w-5 h-5 text-emerald-400" />
                      <span className="text-sm">{redemption.location}</span>
                    </div>
                  </div>

                  {redemption.status === 'pending' && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => handleStatusChange(redemption.id, 'completed')}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Marcar como Retirado
                      </Button>
                      <Button
                        onClick={() => handleStatusChange(redemption.id, 'cancelled')}
                        variant="outline"
                        className="flex-1 border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
