'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getPersonalRecords, getWeeklyStats, getMonthlyStats } from '@/lib/activity-storage';
import { ArrowLeft, Trophy, TrendingUp, Flame, Timer, Coins, Target } from 'lucide-react';
import Link from 'next/link';

export default function EvolutionPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

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

  const records = getPersonalRecords(user.id);
  const weeklyStats = getWeeklyStats(user.id);
  const monthlyStats = getMonthlyStats(user.id);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hrs > 0 ? `${hrs}h ${mins}min` : `${mins}min`;
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
            <h1 className="text-xl font-bold text-white">Minha Evolução</h1>
            <p className="text-xs text-emerald-400">Compete com você mesmo</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Recordes Pessoais */}
        <Card className="bg-gradient-to-r from-yellow-600 to-orange-600 border-none">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Trophy className="w-6 h-6" />
              Recordes Pessoais
            </CardTitle>
            <CardDescription className="text-white/80">
              Suas melhores marcas de todos os tempos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-white" />
                  <p className="text-white/80 text-sm">Maior Distância</p>
                </div>
                <p className="text-3xl font-bold text-white">
                  {records.longestDistance > 0 ? `${records.longestDistance.toFixed(2)} km` : '-'}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Timer className="w-5 h-5 text-white" />
                  <p className="text-white/80 text-sm">Maior Tempo</p>
                </div>
                <p className="text-3xl font-bold text-white">
                  {records.longestDuration > 0 ? formatTime(records.longestDuration) : '-'}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="w-5 h-5 text-white" />
                  <p className="text-white/80 text-sm">Mais Calorias</p>
                </div>
                <p className="text-3xl font-bold text-white">
                  {records.highestCalories > 0 ? records.highestCalories : '-'}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Coins className="w-5 h-5 text-yellow-300" />
                  <p className="text-white/80 text-sm">Mais Capicoins</p>
                </div>
                <p className="text-3xl font-bold text-white">
                  {records.mostCoins > 0 ? records.mostCoins : '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comparação Semanal vs Mensal */}
        <Card className="bg-black/50 border-emerald-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-6 h-6 text-emerald-400" />
              Comparação de Desempenho
            </CardTitle>
            <CardDescription className="text-emerald-300">
              Semana atual vs Mês completo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Distância */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    <span className="text-white font-semibold">Distância Total</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-950/50 p-4 rounded-lg">
                    <p className="text-emerald-400 text-sm mb-1">Esta Semana</p>
                    <p className="text-2xl font-bold text-white">{weeklyStats.totalDistance.toFixed(1)} km</p>
                  </div>
                  <div className="bg-emerald-950/50 p-4 rounded-lg">
                    <p className="text-emerald-400 text-sm mb-1">Este Mês</p>
                    <p className="text-2xl font-bold text-white">{monthlyStats.totalDistance.toFixed(1)} km</p>
                  </div>
                </div>
              </div>

              {/* Calorias */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-400" />
                    <span className="text-white font-semibold">Calorias Queimadas</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-950/50 p-4 rounded-lg">
                    <p className="text-emerald-400 text-sm mb-1">Esta Semana</p>
                    <p className="text-2xl font-bold text-white">{weeklyStats.totalCalories}</p>
                  </div>
                  <div className="bg-emerald-950/50 p-4 rounded-lg">
                    <p className="text-emerald-400 text-sm mb-1">Este Mês</p>
                    <p className="text-2xl font-bold text-white">{monthlyStats.totalCalories}</p>
                  </div>
                </div>
              </div>

              {/* Capicoins */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-yellow-400" />
                    <span className="text-white font-semibold">Capicoins Ganhas</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-950/50 p-4 rounded-lg">
                    <p className="text-emerald-400 text-sm mb-1">Esta Semana</p>
                    <p className="text-2xl font-bold text-white">{weeklyStats.totalCoins}</p>
                  </div>
                  <div className="bg-emerald-950/50 p-4 rounded-lg">
                    <p className="text-emerald-400 text-sm mb-1">Este Mês</p>
                    <p className="text-2xl font-bold text-white">{monthlyStats.totalCoins}</p>
                  </div>
                </div>
              </div>

              {/* Atividades */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-400" />
                    <span className="text-white font-semibold">Número de Atividades</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-950/50 p-4 rounded-lg">
                    <p className="text-emerald-400 text-sm mb-1">Esta Semana</p>
                    <p className="text-2xl font-bold text-white">{weeklyStats.activitiesCount}</p>
                  </div>
                  <div className="bg-emerald-950/50 p-4 rounded-lg">
                    <p className="text-emerald-400 text-sm mb-1">Este Mês</p>
                    <p className="text-2xl font-bold text-white">{monthlyStats.activitiesCount}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Motivação */}
        <Card className="bg-black/50 border-emerald-800">
          <CardContent className="p-6 text-center">
            <p className="text-emerald-300 text-lg mb-2">
              🦫 Continue evoluindo!
            </p>
            <p className="text-emerald-400 text-sm">
              Cada atividade te deixa mais forte. Você está competindo com a melhor versão de si mesmo!
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
