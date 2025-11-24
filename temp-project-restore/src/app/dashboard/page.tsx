'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getWeeklyStats, getMonthlyStats } from '@/lib/activity-storage';
import { Activity, Flame, TrendingUp, Coins, User, LogOut, Target, Scale, Trophy, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();

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

  const weeklyStats = getWeeklyStats(user.id);
  const monthlyStats = getMonthlyStats(user.id);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-black to-emerald-900">
      {/* Header */}
      <header className="bg-black/50 border-b border-emerald-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-2xl">🦫</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Capirun</h1>
              <p className="text-xs text-emerald-400">Olá, {user.name}!</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="text-emerald-400 hover:text-emerald-300">
                <User className="w-5 h-5" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-emerald-400 hover:text-emerald-300"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-8">
        {/* Botão Principal - Iniciar Atividade */}
        <Link href="/start-activity">
          <Card className="bg-emerald-600 hover:bg-emerald-700 transition-colors cursor-pointer border-none mb-8">
            <CardContent className="p-4">
              <div className="text-center">
                <Activity className="w-10 h-10 text-white mx-auto mb-2" />
                <h2 className="text-lg font-bold text-white mb-1">Iniciar Atividade</h2>
                <p className="text-emerald-100 text-sm">Comece a correr e ganhe capicoins!</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Saldo de Capicoins */}
        <Card className="bg-gradient-to-r from-emerald-600 to-emerald-800 border-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm mb-1">Suas Capicoins</p>
                <div className="flex items-center gap-2">
                  <Coins className="w-8 h-8 text-yellow-400" />
                  <span className="text-4xl font-bold text-white">{user.coins}</span>
                </div>
              </div>
              <Link href="/store">
                <Button className="bg-white text-emerald-700 hover:bg-emerald-50 font-semibold">
                  Ir para Loja
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas da Semana */}
        <Card className="bg-black/50 border-emerald-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Esta Semana
            </CardTitle>
            <CardDescription className="text-emerald-300">
              Seus números dos últimos 7 dias
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-950/50 p-4 rounded-lg">
                <p className="text-emerald-400 text-sm mb-1">Distância</p>
                <p className="text-2xl font-bold text-white">{weeklyStats.totalDistance.toFixed(1)} km</p>
              </div>
              <div className="bg-emerald-950/50 p-4 rounded-lg">
                <p className="text-emerald-400 text-sm mb-1">Calorias</p>
                <p className="text-2xl font-bold text-white">{weeklyStats.totalCalories}</p>
              </div>
              <div className="bg-emerald-950/50 p-4 rounded-lg">
                <p className="text-emerald-400 text-sm mb-1">Atividades</p>
                <p className="text-2xl font-bold text-white">{weeklyStats.activitiesCount}</p>
              </div>
              <div className="bg-emerald-950/50 p-4 rounded-lg">
                <p className="text-emerald-400 text-sm mb-1">Capicoins</p>
                <p className="text-2xl font-bold text-white flex items-center gap-1">
                  <Coins className="w-5 h-5 text-yellow-400" />
                  {weeklyStats.totalCoins}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas do Mês */}
        <Card className="bg-black/50 border-emerald-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400" />
              Este Mês
            </CardTitle>
            <CardDescription className="text-emerald-300">
              Seu progresso mensal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-emerald-400">Distância Total</span>
                  <span className="text-white font-semibold">{monthlyStats.totalDistance.toFixed(1)} km</span>
                </div>
                <Progress value={Math.min((monthlyStats.totalDistance / 50) * 100, 100)} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-emerald-400">Calorias Queimadas</span>
                  <span className="text-white font-semibold">{monthlyStats.totalCalories}</span>
                </div>
                <Progress value={Math.min((monthlyStats.totalCalories / 2000) * 100, 100)} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-emerald-400">Capicoins Ganhas</span>
                  <span className="text-white font-semibold flex items-center gap-1">
                    <Coins className="w-4 h-4 text-yellow-400" />
                    {monthlyStats.totalCoins}
                  </span>
                </div>
                <Progress value={Math.min((monthlyStats.totalCoins / 200) * 100, 100)} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Links Rápidos */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Link href="/history">
            <Card className="bg-black/50 border-emerald-800 hover:border-emerald-600 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <Activity className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-white font-semibold">Histórico</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/evolution">
            <Card className="bg-black/50 border-emerald-800 hover:border-emerald-600 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-white font-semibold">Evolução</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/performance">
            <Card className="bg-black/50 border-emerald-800 hover:border-emerald-600 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <Calendar className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-white font-semibold">Performance</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/goals">
            <Card className="bg-black/50 border-emerald-800 hover:border-emerald-600 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <Target className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-white font-semibold">Metas</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/weight">
            <Card className="bg-black/50 border-emerald-800 hover:border-emerald-600 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <Scale className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-white font-semibold">Peso</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/challenges">
            <Card className="bg-black/50 border-emerald-800 hover:border-emerald-600 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-white font-semibold">Desafios</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
}
