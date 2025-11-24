'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getActivities } from '@/lib/activity-storage';
import { Activity } from '@/lib/types';
import { ArrowLeft, Calendar, TrendingUp, Flame, Timer, Coins, Activity as ActivityIcon } from 'lucide-react';
import Link from 'next/link';

type FilterPeriod = 'day' | 'week' | 'month' | 'custom';

export default function PerformancePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('week');
  const [customDate, setCustomDate] = useState('');
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      const userActivities = getActivities(user.id);
      setActivities(userActivities);
    }
  }, [user]);

  useEffect(() => {
    filterActivities();
  }, [activities, filterPeriod, customDate]);

  const filterActivities = () => {
    const now = new Date();
    let filtered: Activity[] = [];

    switch (filterPeriod) {
      case 'day':
        // Hoje
        filtered = activities.filter(a => {
          const activityDate = new Date(a.date);
          return (
            activityDate.getDate() === now.getDate() &&
            activityDate.getMonth() === now.getMonth() &&
            activityDate.getFullYear() === now.getFullYear()
          );
        });
        break;

      case 'week':
        // Últimos 7 dias
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = activities.filter(a => new Date(a.date) >= weekAgo);
        break;

      case 'month':
        // Este mês
        filtered = activities.filter(a => {
          const activityDate = new Date(a.date);
          return (
            activityDate.getMonth() === now.getMonth() &&
            activityDate.getFullYear() === now.getFullYear()
          );
        });
        break;

      case 'custom':
        // Data específica
        if (customDate) {
          const selectedDate = new Date(customDate);
          filtered = activities.filter(a => {
            const activityDate = new Date(a.date);
            return (
              activityDate.getDate() === selectedDate.getDate() &&
              activityDate.getMonth() === selectedDate.getMonth() &&
              activityDate.getFullYear() === selectedDate.getFullYear()
            );
          });
        }
        break;
    }

    setFilteredActivities(filtered);
  };

  const calculateStats = () => {
    const totalDistance = filteredActivities.reduce((sum, a) => sum + a.distance, 0);
    const totalDuration = filteredActivities.reduce((sum, a) => sum + a.duration, 0);
    const totalCalories = filteredActivities.reduce((sum, a) => sum + a.calories, 0);
    const totalCoins = filteredActivities.reduce((sum, a) => sum + a.coinsEarned, 0);
    const avgSpeed = filteredActivities.length > 0
      ? filteredActivities.reduce((sum, a) => sum + a.avgSpeed, 0) / filteredActivities.length
      : 0;

    return {
      totalDistance,
      totalDuration,
      totalCalories,
      totalCoins,
      avgSpeed,
      count: filteredActivities.length
    };
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hrs > 0 ? `${hrs}h ${mins}min` : `${mins}min`;
  };

  const getActivityTypeLabel = (type: Activity['type']) => {
    switch (type) {
      case 'walking': return 'Caminhada';
      case 'running': return 'Corrida';
      case 'cycling': return 'Ciclismo';
    }
  };

  const getActivityTypeIcon = (type: Activity['type']) => {
    switch (type) {
      case 'walking': return '🚶';
      case 'running': return '🏃';
      case 'cycling': return '🚴';
    }
  };

  const getPeriodLabel = () => {
    switch (filterPeriod) {
      case 'day': return 'Hoje';
      case 'week': return 'Últimos 7 dias';
      case 'month': return 'Este mês';
      case 'custom': return customDate ? new Date(customDate).toLocaleDateString('pt-BR') : 'Data específica';
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-950 via-black to-emerald-900">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  const stats = calculateStats();

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
            <h1 className="text-xl font-bold text-white">Performance</h1>
            <p className="text-xs text-emerald-400">Analise seu desempenho</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Filtros de Período */}
        <Card className="bg-black/50 border-emerald-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              Filtrar por Período
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-emerald-400">Período</Label>
              <Select value={filterPeriod} onValueChange={(value) => setFilterPeriod(value as FilterPeriod)}>
                <SelectTrigger className="bg-emerald-950/50 border-emerald-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Hoje</SelectItem>
                  <SelectItem value="week">Últimos 7 dias</SelectItem>
                  <SelectItem value="month">Este mês</SelectItem>
                  <SelectItem value="custom">Data específica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filterPeriod === 'custom' && (
              <div>
                <Label className="text-emerald-400">Data</Label>
                <Input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="bg-emerald-950/50 border-emerald-700 text-white"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resumo de Estatísticas */}
        <Card className="bg-gradient-to-r from-emerald-600 to-blue-600 border-none">
          <CardHeader>
            <CardTitle className="text-white">Resumo - {getPeriodLabel()}</CardTitle>
            <CardDescription className="text-white/80">
              {stats.count} {stats.count === 1 ? 'atividade registrada' : 'atividades registradas'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-white" />
                  <p className="text-white/80 text-sm">Distância</p>
                </div>
                <p className="text-2xl font-bold text-white">{stats.totalDistance.toFixed(1)} km</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Timer className="w-5 h-5 text-white" />
                  <p className="text-white/80 text-sm">Tempo</p>
                </div>
                <p className="text-2xl font-bold text-white">{formatTime(stats.totalDuration)}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="w-5 h-5 text-white" />
                  <p className="text-white/80 text-sm">Calorias</p>
                </div>
                <p className="text-2xl font-bold text-white">{stats.totalCalories}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Coins className="w-5 h-5 text-yellow-300" />
                  <p className="text-white/80 text-sm">Capicoins</p>
                </div>
                <p className="text-2xl font-bold text-white">{stats.totalCoins}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <ActivityIcon className="w-5 h-5 text-white" />
                  <p className="text-white/80 text-sm">Vel. Média</p>
                </div>
                <p className="text-2xl font-bold text-white">{stats.avgSpeed.toFixed(1)} km/h</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <ActivityIcon className="w-5 h-5 text-white" />
                  <p className="text-white/80 text-sm">Atividades</p>
                </div>
                <p className="text-2xl font-bold text-white">{stats.count}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Atividades */}
        {filteredActivities.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Atividades do Período</h2>
            {filteredActivities.map(activity => (
              <Card key={activity.id} className="bg-black/50 border-emerald-800">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <span className="text-4xl">{getActivityTypeIcon(activity.type)}</span>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg mb-1">
                          {getActivityTypeLabel(activity.type)}
                        </h3>
                        <p className="text-emerald-400 text-sm mb-3">
                          {new Date(activity.date).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div>
                            <p className="text-emerald-400 text-xs">Distância</p>
                            <p className="text-white font-semibold">{activity.distance.toFixed(2)} km</p>
                          </div>
                          <div>
                            <p className="text-emerald-400 text-xs">Tempo</p>
                            <p className="text-white font-semibold">{formatTime(activity.duration)}</p>
                          </div>
                          <div>
                            <p className="text-emerald-400 text-xs">Calorias</p>
                            <p className="text-white font-semibold">{activity.calories}</p>
                          </div>
                          <div>
                            <p className="text-emerald-400 text-xs">Capicoins</p>
                            <p className="text-yellow-400 font-semibold flex items-center gap-1">
                              <Coins className="w-3 h-3" />
                              {activity.coinsEarned}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-black/50 border-emerald-800">
            <CardContent className="p-12 text-center">
              <Calendar className="w-16 h-16 text-emerald-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-white text-xl font-semibold mb-2">Nenhuma atividade encontrada</h3>
              <p className="text-emerald-300">
                Não há atividades registradas para o período selecionado.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
