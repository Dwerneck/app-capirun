'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Coins, ShoppingBag, Calendar, MapPin, AlertCircle, History } from 'lucide-react';
import Link from 'next/link';
import { saveRedemption } from '@/lib/redemption-storage';
import { Redemption } from '@/lib/types';

export default function StorePage() {
  const router = useRouter();
  const { user, isLoading, updateUser } = useAuth();
  const [redeeming, setRedeeming] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-950 via-black to-emerald-900">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  // Produtos mockados (em produção, vir de API/DB)
  const products = [
    {
      id: '1',
      name: 'Squeeze Capirun 750ml',
      description: 'Garrafa térmica oficial Capirun',
      coinPrice: 150,
      category: 'accessory',
      stock: 10,
      imageUrl: '🧴',
    },
    {
      id: '2',
      name: 'Pré-Treino Energia',
      description: 'Suplemento pré-treino 300g',
      coinPrice: 200,
      category: 'supplement',
      stock: 5,
      imageUrl: '💊',
    },
    {
      id: '3',
      name: 'Gel de Carboidrato',
      description: 'Pack com 10 unidades',
      coinPrice: 100,
      category: 'supplement',
      stock: 15,
      imageUrl: '🍯',
    },
    {
      id: '4',
      name: 'Camiseta Capirun',
      description: 'Camiseta dry-fit oficial',
      coinPrice: 250,
      category: 'gear',
      stock: 8,
      imageUrl: '👕',
    },
    {
      id: '5',
      name: 'Boné Capirun',
      description: 'Boné com proteção UV',
      coinPrice: 120,
      category: 'accessory',
      stock: 12,
      imageUrl: '🧢',
    },
    {
      id: '6',
      name: 'Whey Protein 1kg',
      description: 'Proteína isolada sabor chocolate',
      coinPrice: 300,
      category: 'supplement',
      stock: 6,
      imageUrl: '🥤',
    },
  ];

  const handleRedeem = (product: typeof products[0]) => {
    if (user.coins < product.coinPrice) {
      alert('Capicoins insuficientes! Continue treinando para ganhar mais capicoins.');
      return;
    }

    if (redeeming) return; // Prevenir múltiplos cliques

    setRedeeming(product.id);

    // Criar resgate
    const redemption: Redemption = {
      id: `redemption_${Date.now()}`,
      userId: user.id,
      productId: product.id,
      productName: product.name,
      coinPrice: product.coinPrice,
      date: new Date(),
      location: 'Curitiba - PR',
      status: 'pending',
    };

    // Salvar resgate
    saveRedemption(redemption);

    // Atualizar saldo de capicoins do usuário
    const updatedUser = {
      ...user,
      coins: user.coins - product.coinPrice,
    };
    updateUser(updatedUser);

    // Feedback visual
    setTimeout(() => {
      setRedeeming(null);
      alert(`✅ Produto "${product.name}" resgatado com sucesso!\n\nVocê poderá retirá-lo no próximo evento de retirada em Curitiba.\n\nConsulte seus resgates na aba "Meus Resgates".`);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-black to-emerald-900">
      {/* Header */}
      <header className="bg-black/50 border-b border-emerald-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="text-emerald-400 hover:text-emerald-300">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">Capirun Store</h1>
              <p className="text-xs text-emerald-400">Troque suas capicoins por produtos</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Link href="/redemptions">
              <Button 
                variant="ghost" 
                size="icon"
                className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/50"
                title="Meus Resgates"
              >
                <History className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 bg-emerald-950/50 px-4 py-2 rounded-full">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-bold">{user.coins}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Informações de Retirada */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-none">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Calendar className="w-8 h-8 text-white flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg mb-2">Próxima Retirada</h3>
                <div className="space-y-1 text-white/90 text-sm">
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <strong>Data:</strong> 15 de Maio de 2024
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <strong>Local:</strong> Curitiba - PR (endereço será divulgado)
                  </p>
                  <p className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <strong>Horário:</strong> 10h às 18h
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grade de Produtos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => {
            const canAfford = user.coins >= product.coinPrice;
            const isRedeeming = redeeming === product.id;
            
            return (
              <Card key={product.id} className="bg-black/50 border-emerald-800 hover:border-emerald-600 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="text-6xl mb-2">{product.imageUrl}</div>
                    <Badge variant={canAfford ? "default" : "secondary"} className={canAfford ? "bg-emerald-600" : ""}>
                      {product.stock} em estoque
                    </Badge>
                  </div>
                  <CardTitle className="text-white">{product.name}</CardTitle>
                  <CardDescription className="text-emerald-300">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Coins className="w-6 h-6 text-yellow-400" />
                      <span className="text-2xl font-bold text-white">{product.coinPrice}</span>
                    </div>
                    {!canAfford && (
                      <span className="text-red-400 text-sm">
                        Faltam {product.coinPrice - user.coins}
                      </span>
                    )}
                  </div>
                  
                  <Button
                    onClick={() => handleRedeem(product)}
                    disabled={!canAfford || product.stock === 0 || isRedeeming}
                    className={`w-full font-semibold ${
                      canAfford && product.stock > 0
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : 'bg-gray-600 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    {isRedeeming 
                      ? 'Resgatando...' 
                      : product.stock === 0 
                        ? 'Esgotado' 
                        : canAfford 
                          ? 'Resgatar' 
                          : 'Capicoins Insuficientes'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Informações Importantes */}
        <Card className="bg-black/50 border-emerald-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-emerald-400" />
              Como Funciona
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-emerald-200">
            <p className="text-sm">
              🏃 <strong>Ganhe capicoins:</strong> Complete atividades físicas para acumular capicoins
            </p>
            <p className="text-sm">
              🛍️ <strong>Escolha produtos:</strong> Navegue pela loja e resgate produtos com suas capicoins
            </p>
            <p className="text-sm">
              📅 <strong>Retirada mensal:</strong> Produtos são retirados uma vez por mês em evento presencial
            </p>
            <p className="text-sm">
              📍 <strong>Local fixo:</strong> Sempre em Curitiba - PR (endereço divulgado com antecedência)
            </p>
            <p className="text-sm">
              🔔 <strong>Notificações:</strong> Você receberá avisos sobre datas de retirada
            </p>
            <p className="text-sm">
              📦 <strong>Histórico:</strong> Acompanhe todos os seus resgates na aba "Meus Resgates"
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
