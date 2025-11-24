'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ActivityType, Activity } from '@/lib/types';
import { ACTIVITY_LABELS, calculateCalories, calculateCoinsWithLimits, checkSpeedAndGetActivityType, ACTIVITY_RULES } from '@/lib/constants';
import { saveActivity, getMonthlyStats } from '@/lib/activity-storage';
import { Pause, Play, Square, Timer, Gauge, Flame, TrendingUp, Clock, AlertTriangle, Coins } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [speedWarning, setSpeedWarning] = useState<string | null>(null);
  const [actualActivityType, setActualActivityType] = useState<ActivityType>(activityType);
  const [isBlocked, setIsBlocked] = useState(false);

  // Garantir que o componente está montado no cliente
  useEffect(() => {
    setMounted(true);
    // Registrar horário de início quando a atividade começa
    setStartTime(new Date());
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
            
            // PROTEÇÃO ANTI-FRAUDE: Verificar velocidade
            const speedCheck = checkSpeedAndGetActivityType(currentSpeed, activityType);
            
            if (speedCheck.warning) {
              setSpeedWarning(speedCheck.warning);
              setActualActivityType(speedCheck.actualType);
              setIsBlocked(speedCheck.shouldBlock);
            } else {
              setSpeedWarning(null);
              setActualActivityType(activityType);
              setIsBlocked(false);
            }
            
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

    if (!startTime) {
      alert('Erro ao registrar horário de início. Tente novamente.');
      return;
    }

    try {
      const endTime = new Date();
      const userWeight = user.weight || 70; // peso padrão se não configurado
      
      // Calorias são calculadas apenas para informação (NÃO geram moedas)
      const calories = calculateCalories(distance, duration, userWeight, actualActivityType);
      
      // NOVA LÓGICA: Calcular moedas APENAS por distância com multiplicador
      const monthlyStats = getMonthlyStats(user.id);
      const coinsResult = calculateCoinsWithLimits(distance, actualActivityType, monthlyStats);
      
      // Se bloqueado por velocidade, não ganha moedas
      const coinsEarned = isBlocked ? 0 : coinsResult.coins;

      const newActivity: Activity = {
        id: Date.now().toString(),
        userId: user.id,
        type: actualActivityType,
        distance,
        duration,
        calories,
        coinsEarned,
        avgSpeed: speed,
        pace: pace,
        date: new Date(),
        startTime: startTime,
        endTime: endTime,
      };

      saveActivity(newActivity);
      updateUser({ coins: user.coins + coinsEarned });

      router.push(`/activity-summary?id=${newActivity.id}`);
    } catch (error) {
      console.error('Erro ao finalizar atividade:', error);
      alert('Erro ao salvar atividade. Tente novamente.');
    }
  };

  // Calorias apenas informativas (NÃO geram moedas)
  const currentCalories = calculateCalories(distance, duration, user.weight || 70, actualActivityType);
  
  // Calcular moedas estimadas em tempo real (APENAS por distância)
  const monthlyStats = getMonthlyStats(user.id);
  const estimatedCoinsResult = calculateCoinsWithLimits(distance, actualActivityType, monthlyStats);
  const estimatedCoins = isBlocked ? 0 : estimatedCoinsResult.coins;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-black to-emerald-900">
      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Tipo de Atividade */}
        <div className="text-center pt-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-600 rounded-full mb-4">
            <span className="text-5xl">
              {actualActivityType === 'walking' && '🚶'}
              {actualActivityType === 'running' && '🏃'}
              {actualActivityType === 'cycling' && '🚴'}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {ACTIVITY_LABELS[actualActivityType]}
          </h1>
          <p className="text-emerald-400">Em andamento...</p>
          {startTime && (
            <p className="text-emerald-300 text-sm mt-2">
              Início: {startTime.toLocaleTimeString('pt-BR')}
            </p>
          )}
        </div>

        {/* Alerta de Velocidade */}
        {speedWarning && (
          <Alert className={`${isBlocked ? 'bg-red-900/50 border-red-600' : 'bg-yellow-900/50 border-yellow-600'}`}>
            <AlertTriangle className={`h-5 w-5 ${isBlocked ? 'text-red-400' : 'text-yellow-400'}`} />
            <AlertDescription className={`${isBlocked ? 'text-red-200' : 'text-yellow-200'} font-semibold`}>
              {speedWarning}
            </AlertDescription>
          </Alert>
        )}

        {/* Alerta de Limite Mensal */}
        {estimatedCoinsResult.reachedLimit && (
          <Alert className="bg-orange-900/50 border-orange-600">
            <AlertTriangle className="h-5 w-5 text-orange-400" />
            <AlertDescription className="text-orange-200 font-semibold">
              {estimatedCoinsResult.limitType === 'coins' 
                ? '🎯 Você atingiu o limite mensal de 2000 capicoins!' 
                : `🎯 Você atingiu o limite de ${ACTIVITY_RULES[actualActivityType].maxDistance}km para ${ACTIVITY_LABELS[actualActivityType]} este mês!`}
            </AlertDescription>
          </Alert>
        )}

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
              <p className="text-white/80 text-xs">kcal (informativo)</p>
            </CardContent>
          </Card>
        </div>

        {/* Moedas Estimadas - Destaque que é APENAS por KM */}
        <Card className="bg-gradient-to-r from-yellow-600 to-amber-600 border-none">
          <CardContent className="p-6">
            <div className="text-center">
              <Coins className="w-12 h-12 text-white mx-auto mb-3" />
              <p className="text-white/80 text-sm mb-2">Capicoins Estimadas</p>
              <p className="text-5xl font-bold text-white mb-2">{estimatedCoins}</p>
              <div className="bg-white/20 rounded-lg p-3 mt-3">
                <p className="text-white text-sm font-semibold">
                  Multiplicador: {ACTIVITY_RULES[actualActivityType].multiplier} moedas/km
                </p>
                <p className="text-white/80 text-xs mt-1">
                  Máx: {ACTIVITY_RULES[actualActivityType].maxCoins} moedas/mês • {ACTIVITY_RULES[actualActivityType].maxDistance}km/mês
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

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
        <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-4">
          <p className="text-blue-200 text-sm text-center">
            💡 <strong>Importante:</strong> Capicoins são geradas APENAS por distância percorrida (km). 
            Calorias são exibidas apenas para informação.
          </p>
        </div>
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
