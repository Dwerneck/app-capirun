'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getActivities } from '@/lib/activity-storage';
import { ACTIVITY_LABELS } from '@/lib/constants';
import { ShareActivity } from '@/components/custom/share-activity';
import { ArrowLeft, Calendar, TrendingUp, Flame, Timer, Coins, Clock } from 'lucide-react';
import Link from 'next/link';

export default function HistoryPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);

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

  const activities = getActivities(user.id).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hrs > 0 ? `${hrs}h ${mins}min` : `${mins}min`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatHour = (date: Date) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculatePace = (distance: number, duration: number) => {
    if (distance === 0) return '0:00';
    const paceMinutes = duration / 60 / distance;
    const mins = Math.floor(paceMinutes);
    const secs = Math.floor((paceMinutes - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
            <h1 className="text-xl font-bold text-white">Histórico</h1>
            <p className="text-xs text-emerald-400">Todas as suas atividades</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-4">
        {activities.length === 0 ? (
          <Card className="bg-black/50 border-emerald-800">
            <CardContent className="p-12 text-center">
              <Calendar className="w-16 h-16 text-emerald-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Nenhuma atividade ainda
              </h3>
              <p className="text-emerald-400 mb-6">
                Comece sua primeira atividade para ver seu histórico aqui!
              </p>
              <Link href="/start-activity">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                  Iniciar Atividade
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          activities.map((activity) => (
            <Card key={activity.id} className="bg-black/50 border-emerald-800 hover:border-emerald-600 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Ícone da Atividade */}
                  <div className="w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-3xl">
                      {activity.type === 'walking' && '🚶'}
                      {activity.type === 'running' && '🏃'}
                      {activity.type === 'cycling' && '🚴'}
                    </span>
                  </div>

                  {/* Informações */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-white">
                        {ACTIVITY_LABELS[activity.type]}
                      </h3>
                      <div className="flex items-center gap-1 bg-emerald-950/50 px-3 py-1 rounded-full">
                        <Coins className="w-4 h-4 text-yellow-400" />
                        <span className="text-white font-semibold">+{activity.coinsEarned}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-emerald-400 text-sm mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(activity.date)}</span>
                    </div>

                    {/* Horários de Início e Fim */}
                    {activity.startTime && activity.endTime && (
                      <div className="flex items-center gap-4 text-emerald-300 text-sm mb-3 bg-emerald-950/30 p-2 rounded">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>Início: {formatHour(activity.startTime)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>Fim: {formatHour(activity.endTime)}</span>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-4 gap-2 mb-3">
                      <div className="bg-emerald-950/50 p-2 rounded">
                        <div className="flex items-center gap-1 mb-1">
                          <TrendingUp className="w-3 h-3 text-blue-400" />
                          <p className="text-emerald-400 text-xs">Distância</p>
                        </div>
                        <p className="text-white font-semibold text-sm">{activity.distance.toFixed(2)} km</p>
                      </div>

                      <div className="bg-emerald-950/50 p-2 rounded">
                        <div className="flex items-center gap-1 mb-1">
                          <Timer className="w-3 h-3 text-purple-400" />
                          <p className="text-emerald-400 text-xs">Tempo</p>
                        </div>
                        <p className="text-white font-semibold text-sm">{formatTime(activity.duration)}</p>
                      </div>

                      <div className="bg-emerald-950/50 p-2 rounded">
                        <div className="flex items-center gap-1 mb-1">
                          <Flame className="w-3 h-3 text-orange-400" />
                          <p className="text-emerald-400 text-xs">Calorias</p>
                        </div>
                        <p className="text-white font-semibold text-sm">{activity.calories}</p>
                      </div>

                      <div className="bg-emerald-950/50 p-2 rounded">
                        <div className="flex items-center gap-1 mb-1">
                          <TrendingUp className="w-3 h-3 text-green-400" />
                          <p className="text-emerald-400 text-xs">Vel. Média</p>
                        </div>
                        <p className="text-white font-semibold text-sm">{activity.avgSpeed.toFixed(1)} km/h</p>
                      </div>
                    </div>

                    {/* Botão de Compartilhar */}
                    <div className="mt-3">
                      <ShareActivity
                        distance={activity.distance}
                        duration={activity.duration}
                        calories={activity.calories}
                        pace={calculatePace(activity.distance, activity.duration)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </main>
    </div>
  );
}
