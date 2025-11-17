'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ActivityType, Activity } from '@/lib/types';
import { ACTIVITY_LABELS, calculateCalories, calculateCoins } from '@/lib/constants';
import { saveActivity } from '@/lib/activity-storage';
import { Pause, Play, Square, Timer, Gauge, Flame, TrendingUp, Clock } from 'lucide-react';

function ActivityContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, updateUser, isLoading } = useAuth();
  
  const activityType = searchParams.get('type') as ActivityType;
  
  const [isRunning, setIsRunning] = useState(true);
  const [duration, setDuration] = useState(0); // segundos
  const [distance, setDistance] = useState(0); // km
  const [speed, setSpeed] = useState(0); // km/h
  const [pace, setPace] = useState(0); // min/km
  const [mounted, setMounted] = useState(false);

  // Garantir que o componente está montado no cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Verificar autenticação APENAS após carregamento
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!mounted || !user || !activityType) return;

    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
        
        // Simulação de movimento (em produção, usar GPS real)
        const randomIncrement = Math.random() * 0.01; // 0-10 metros
        setDistance(prev => {
          const newDistance = prev + randomIncrement;
          
          // Calcular velocidade média em tempo real
          const currentDuration = duration + 1;
          if (currentDuration > 0) {
            const currentSpeed = (newDistance / (currentDuration / 3600));
            setSpeed(currentSpeed);
            
            // Calcular pace (min/km)
            if (newDistance > 0) {
              const paceValue = (currentDuration / 60) / newDistance;
              setPace(paceValue);
            }
          }
          
          return newDistance;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, duration, mounted, user, activityType]);

  // Mostrar loading enquanto carrega
  if (isLoading || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-950 via-black to-emerald-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-400 text-lg">Carregando atividade...</p>
        </div>
      </div>
    );
  }

  if (!user || !activityType) {
    return null;
  }

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPace = (paceMinPerKm: number) => {
    if (!isFinite(paceMinPerKm) || paceMinPerKm === 0) return '--:--';
    const mins = Math.floor(paceMinPerKm);
    const secs = Math.floor((paceMinPerKm - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFinish = () => {
    if (duration < 10) {
      alert('Atividade muito curta! Continue por pelo menos 10 segundos.');
      return;
    }

    try {
      const userWeight = user.weight || 70; // peso padrão se não configurado
      const calories = calculateCalories(distance, duration, userWeight, activityType);
      const coinsEarned = calculateCoins(calories, distance, activityType);

      const newActivity: Activity = {
        id: Date.now().toString(),
        userId: user.id,
        type: activityType,
        distance,
        duration,
        calories,
        coinsEarned,
        avgSpeed: speed,
        pace: pace,
        date: new Date(),
      };

      saveActivity(newActivity);
      updateUser({ coins: user.coins + coinsEarned });

      router.push(`/activity-summary?id=${newActivity.id}`);
    } catch (error) {
      console.error('Erro ao finalizar atividade:', error);
      alert('Erro ao salvar atividade. Tente novamente.');
    }
  };

  const currentCalories = calculateCalories(distance, duration, user.weight || 70, activityType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-black to-emerald-900">
      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Tipo de Atividade */}
        <div className="text-center pt-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-600 rounded-full mb-4">
            <span className="text-5xl">
              {activityType === 'walking' && '🚶'}
              {activityType === 'running' && '🏃'}
              {activityType === 'cycling' && '🚴'}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {ACTIVITY_LABELS[activityType]}
          </h1>
          <p className="text-emerald-400">Em andamento...</p>
        </div>

        {/* Tempo Principal */}
        <Card className="bg-black/50 border-emerald-800">
          <CardContent className="p-8">
            <div className="text-center">
              <Timer className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <div className="text-6xl font-bold text-white font-mono mb-2">
                {formatTime(duration)}
              </div>
              <p className="text-emerald-400">Tempo decorrido</p>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas em Tempo Real */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-black/50 border-emerald-800">
            <CardContent className="p-6">
              <TrendingUp className="w-8 h-8 text-blue-400 mb-3" />
              <p className="text-emerald-400 text-sm mb-1">Distância</p>
              <p className="text-3xl font-bold text-white">{distance.toFixed(2)}</p>
              <p className="text-emerald-400 text-xs">km</p>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-emerald-800">
            <CardContent className="p-6">
              <Gauge className="w-8 h-8 text-purple-400 mb-3" />
              <p className="text-emerald-400 text-sm mb-1">Velocidade</p>
              <p className="text-3xl font-bold text-white">{speed.toFixed(1)}</p>
              <p className="text-emerald-400 text-xs">km/h</p>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-emerald-800">
            <CardContent className="p-6">
              <Clock className="w-8 h-8 text-cyan-400 mb-3" />
              <p className="text-emerald-400 text-sm mb-1">Pace</p>
              <p className="text-3xl font-bold text-white">{formatPace(pace)}</p>
              <p className="text-emerald-400 text-xs">min/km</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-600 to-red-600 border-none">
            <CardContent className="p-6">
              <Flame className="w-8 h-8 text-white mb-3" />
              <p className="text-white/80 text-sm mb-1">Calorias</p>
              <p className="text-3xl font-bold text-white">{currentCalories}</p>
              <p className="text-white/80 text-xs">kcal</p>
            </CardContent>
          </Card>
        </div>

        {/* Controles */}
        <div className="flex gap-4">
          <Button
            onClick={() => setIsRunning(!isRunning)}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-6 text-lg"
          >
            {isRunning ? (
              <>
                <Pause className="w-6 h-6 mr-2" />
                Pausar
              </>
            ) : (
              <>
                <Play className="w-6 h-6 mr-2" />
                Continuar
              </>
            )}
          </Button>

          <Button
            onClick={handleFinish}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-6 text-lg"
          >
            <Square className="w-6 h-6 mr-2" />
            Finalizar
          </Button>
        </div>

        {/* Nota */}
        <p className="text-center text-emerald-400 text-sm">
          💡 Em produção, usaremos GPS real para rastreamento preciso
        </p>
      </main>
    </div>
  );
}

export default function ActivityPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-950 via-black to-emerald-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-400 text-lg">Carregando...</p>
        </div>
      </div>
    }>
      <ActivityContent />
    </Suspense>
  );
}
