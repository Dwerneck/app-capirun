'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ActivityType } from '@/lib/types';
import { ACTIVITY_LABELS, ACTIVITY_RULES } from '@/lib/constants';
import { ArrowLeft, Play, Coins } from 'lucide-react';
import Link from 'next/link';

export default function StartActivityPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [selectedActivity, setSelectedActivity] = useState<ActivityType | null>(null);

  // Aguardar carregamento antes de redirecionar
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-black to-emerald-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-400 text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const activities: { type: ActivityType; icon: string; color: string }[] = [
    { type: 'walking', icon: '🚶', color: 'from-blue-600 to-blue-800' },
    { type: 'running', icon: '🏃', color: 'from-emerald-600 to-emerald-800' },
    { type: 'cycling', icon: '🚴', color: 'from-purple-600 to-purple-800' },
  ];

  const handleStart = () => {
    if (selectedActivity) {
      router.push(`/activity?type=${selectedActivity}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-black to-emerald-900">
      {/* Header */}
      <header className="bg-black/50 border-b border-emerald-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="text-emerald-400 hover:text-emerald-300">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">Iniciar Atividade</h1>
            <p className="text-xs text-emerald-400">Escolha sua modalidade</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Seleção de Atividade */}
        <div className="space-y-4">
          {activities.map((activity) => {
            const rules = ACTIVITY_RULES[activity.type];
            return (
              <Card
                key={activity.type}
                className={`cursor-pointer transition-all border-2 ${
                  selectedActivity === activity.type
                    ? 'border-emerald-400 bg-emerald-950/50'
                    : 'border-emerald-800 bg-black/50 hover:border-emerald-600'
                }`}
                onClick={() => setSelectedActivity(activity.type)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${activity.color} rounded-full flex items-center justify-center text-4xl flex-shrink-0`}>
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {ACTIVITY_LABELS[activity.type]}
                      </h3>
                      <div className="space-y-1">
                        <p className="text-emerald-400 text-sm flex items-center gap-1">
                          <Coins className="w-4 h-4 text-yellow-400" />
                          <strong>Multiplicador:</strong> {rules.multiplier} moedas/km
                        </p>
                        <p className="text-emerald-300 text-xs">
                          Máx: {rules.maxDistance}km/mês • {rules.maxCoins} moedas/mês
                        </p>
                      </div>
                    </div>
                    {selectedActivity === activity.type && (
                      <div className="w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-3 h-3 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Informações */}
        <Card className="bg-black/50 border-emerald-800">
          <CardHeader>
            <CardTitle className="text-white">Como funciona?</CardTitle>
            <CardDescription className="text-emerald-300">
              Sistema de recompensas Capirun
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-emerald-200">
            <p className="text-sm">
              🏃 <strong>Cada atividade gera moedas</strong> baseadas APENAS na distância percorrida (km)
            </p>
            <p className="text-sm">
              🎯 <strong>Fórmula:</strong> distância (km) × multiplicador da modalidade
            </p>
            <p className="text-sm">
              📊 <strong>Calorias:</strong> são exibidas apenas para informação (não geram moedas)
            </p>
            <p className="text-sm">
              🏆 <strong>Troque suas moedas</strong> por produtos reais na Capirun Store
            </p>
            <p className="text-sm">
              📍 <strong>Retirada mensal</strong> em Curitiba - PR
            </p>
            <p className="text-sm">
              ⚠️ <strong>Limite mensal:</strong> máximo de 2000 capicoins por mês (todas modalidades)
            </p>
          </CardContent>
        </Card>

        {/* Botão Iniciar */}
        <Button
          onClick={handleStart}
          disabled={!selectedActivity}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="w-6 h-6 mr-2" />
          {selectedActivity ? `Iniciar ${ACTIVITY_LABELS[selectedActivity]}` : 'Selecione uma atividade'}
        </Button>
      </main>
    </div>
  );
}
