'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getActivities } from '@/lib/activity-storage';
import { ACTIVITY_LABELS } from '@/lib/constants';
import { Trophy, Coins, TrendingUp, Flame, Timer, Share2, Home, Clock } from 'lucide-react';
import Link from 'next/link';

function SummaryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  const activityId = searchParams.get('id');

  if (!user || !activityId) {
    router.push('/dashboard');
    return null;
  }

  const activities = getActivities(user.id);
  const activity = activities.find(a => a.id === activityId);

  if (!activity) {
    router.push('/dashboard');
    return null;
  }

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPace = (paceMinPerKm: number) => {
    if (!paceMinPerKm || !isFinite(paceMinPerKm) || paceMinPerKm === 0) return '--:--';
    const mins = Math.floor(paceMinPerKm);
    const secs = Math.floor((paceMinPerKm - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleShare = () => {
    // Em produção, gerar imagem e compartilhar
    alert('Funcionalidade de compartilhamento será implementada no Módulo 5!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-black to-emerald-900">
      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Celebração */}
        <div className="text-center pt-8">
          <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4 animate-bounce" />
          <h1 className="text-3xl font-bold text-white mb-2">
            Parabéns! 🎉
          </h1>
          <p className="text-emerald-400">Atividade concluída com sucesso</p>
        </div>

        {/* Capicoins Ganhas */}
        <Card className="bg-gradient-to-r from-yellow-600 to-orange-600 border-none">
          <CardContent className="p-8">
            <div className="text-center">
              <Coins className="w-16 h-16 text-white mx-auto mb-4" />
              <p className="text-white/80 text-sm mb-2">Você ganhou</p>
              <div className="text-6xl font-bold text-white mb-2">
                +{activity.coinsEarned}
              </div>
              <p className="text-white/80">capicoins</p>
            </div>
          </CardContent>
        </Card>

        {/* Resumo da Atividade */}
        <Card className="bg-black/50 border-emerald-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-2xl">
                  {activity.type === 'walking' && '🚶'}
                  {activity.type === 'running' && '🏃'}
                  {activity.type === 'cycling' && '🚴'}
                </span>
              </div>
              {ACTIVITY_LABELS[activity.type]}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-950/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  <p className="text-emerald-400 text-sm">Distância</p>
                </div>
                <p className="text-3xl font-bold text-white">{activity.distance.toFixed(2)}</p>
                <p className="text-emerald-400 text-xs">km</p>
              </div>

              <div className="bg-emerald-950/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Timer className="w-5 h-5 text-purple-400" />
                  <p className="text-emerald-400 text-sm">Tempo</p>
                </div>
                <p className="text-3xl font-bold text-white">{formatTime(activity.duration)}</p>
              </div>

              <div className="bg-emerald-950/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  <p className="text-emerald-400 text-sm">Pace Médio</p>
                </div>
                <p className="text-3xl font-bold text-white">{formatPace(activity.pace)}</p>
                <p className="text-emerald-400 text-xs">min/km</p>
              </div>

              <div className="bg-emerald-950/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <p className="text-emerald-400 text-sm">Velocidade</p>
                </div>
                <p className="text-3xl font-bold text-white">{activity.avgSpeed.toFixed(1)}</p>
                <p className="text-emerald-400 text-xs">km/h</p>
              </div>

              <div className="bg-emerald-950/50 p-4 rounded-lg col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <p className="text-emerald-400 text-sm">Calorias Queimadas</p>
                </div>
                <p className="text-3xl font-bold text-white">{activity.calories}</p>
                <p className="text-emerald-400 text-xs">kcal</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="space-y-3">
          <Button
            onClick={handleShare}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold py-6 text-lg"
          >
            <Share2 className="w-6 h-6 mr-2" />
            Compartilhar nas Redes Sociais
          </Button>

          <Link href="/dashboard">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-6 text-lg">
              <Home className="w-6 h-6 mr-2" />
              Voltar ao Dashboard
            </Button>
          </Link>
        </div>

        {/* Motivação */}
        <Card className="bg-black/50 border-emerald-800">
          <CardContent className="p-6 text-center">
            <p className="text-emerald-300 text-lg">
              🦫 Continue assim! Cada passo te aproxima das suas recompensas!
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default function ActivitySummaryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-950 via-black to-emerald-900">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    }>
      <SummaryContent />
    </Suspense>
  );
}
