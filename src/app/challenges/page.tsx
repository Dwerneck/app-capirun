'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { getChallenges, getUserChallenges, enrollInChallenge, updateChallengeProgress, claimChallengeReward } from '@/lib/challenges-storage';
import { Challenge, UserChallenge } from '@/lib/types';
import { ArrowLeft, Trophy, Target, Coins, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';

export default function ChallengesPage() {
  const router = useRouter();
  const { user, isLoading, updateUser } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userChallenges, setUserChallenges] = useState<UserChallenge[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      updateChallengeProgress(user.id);
      loadChallenges();
    }
  }, [user]);

  const loadChallenges = () => {
    if (user) {
      const allChallenges = getChallenges();
      const userChallengesData = getUserChallenges(user.id);
      setChallenges(allChallenges);
      setUserChallenges(userChallengesData);
    }
  };

  const handleEnroll = (challengeId: string) => {
    if (!user) return;
    enrollInChallenge(user.id, challengeId);
    loadChallenges();
  };

  const handleClaimReward = (userChallenge: UserChallenge, challenge: Challenge) => {
    if (!user || userChallenge.rewardClaimed) return;

    // Calcula recompensa em dobro
    const baseReward = Math.floor(challenge.target * 2); // 2 capicoins por km
    const doubleReward = baseReward * challenge.reward;

    // Atualiza capicoins do usuário
    updateUser({ coins: user.coins + doubleReward });

    // Marca recompensa como resgatada
    claimChallengeReward(userChallenge.id);
    loadChallenges();
  };

  const isEnrolled = (challengeId: string) => {
    return userChallenges.some(uc => uc.challengeId === challengeId);
  };

  const getUserChallengeData = (challengeId: string) => {
    return userChallenges.find(uc => uc.challengeId === challengeId);
  };

  const getPeriodLabel = (period: Challenge['period']) => {
    switch (period) {
      case 'daily': return 'Diário';
      case 'weekly': return 'Semanal';
      case 'monthly': return 'Mensal';
    }
  };

  const getActivityLabel = (type: Challenge['activityType']) => {
    switch (type) {
      case 'walking': return 'Caminhada';
      case 'running': return 'Corrida';
      case 'cycling': return 'Ciclismo';
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-950 via-black to-emerald-900">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  const walkingChallenges = challenges.filter(c => c.activityType === 'walking');
  const runningChallenges = challenges.filter(c => c.activityType === 'running');
  const cyclingChallenges = challenges.filter(c => c.activityType === 'cycling');

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
            <h1 className="text-xl font-bold text-white">Desafios</h1>
            <p className="text-xs text-emerald-400">Complete e ganhe capicoins em dobro!</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-8">
        {/* Desafios de Caminhada */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            🚶 Desafios de Caminhada
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {walkingChallenges.map(challenge => {
              const enrolled = isEnrolled(challenge.id);
              const userChallenge = getUserChallengeData(challenge.id);
              const progress = userChallenge ? (userChallenge.progress / challenge.target) * 100 : 0;

              return (
                <Card key={challenge.id} className="bg-black/50 border-emerald-800">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl">{challenge.icon}</span>
                        <div>
                          <CardTitle className="text-white text-lg">{challenge.title}</CardTitle>
                          <Badge variant="outline" className="mt-1 text-xs border-emerald-600 text-emerald-400">
                            {getPeriodLabel(challenge.period)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-emerald-300 mt-2">
                      {challenge.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-emerald-400">Meta:</span>
                      <span className="text-white font-semibold">{challenge.target} km</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-emerald-400">Recompensa:</span>
                      <span className="text-yellow-400 font-semibold flex items-center gap-1">
                        <Coins className="w-4 h-4" />
                        Capicoins em dobro!
                      </span>
                    </div>

                    {enrolled && userChallenge && (
                      <>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-emerald-300">Progresso</span>
                            <span className="text-white font-semibold">
                              {userChallenge.progress.toFixed(1)} / {challenge.target} km
                            </span>
                          </div>
                          <Progress value={Math.min(progress, 100)} className="h-2" />
                        </div>

                        {userChallenge.completed && !userChallenge.rewardClaimed && (
                          <Button
                            onClick={() => handleClaimReward(userChallenge, challenge)}
                            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                          >
                            <Trophy className="w-4 h-4 mr-2" />
                            Resgatar Recompensa
                          </Button>
                        )}

                        {userChallenge.completed && userChallenge.rewardClaimed && (
                          <div className="flex items-center justify-center gap-2 text-green-400 py-2">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="font-semibold">Desafio Concluído!</span>
                          </div>
                        )}

                        {!userChallenge.completed && (
                          <div className="flex items-center justify-center gap-2 text-emerald-400 py-2">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">Em andamento...</span>
                          </div>
                        )}
                      </>
                    )}

                    {!enrolled && (
                      <Button
                        onClick={() => handleEnroll(challenge.id)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <Target className="w-4 h-4 mr-2" />
                        Participar
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Desafios de Corrida */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            🏃 Desafios de Corrida
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {runningChallenges.map(challenge => {
              const enrolled = isEnrolled(challenge.id);
              const userChallenge = getUserChallengeData(challenge.id);
              const progress = userChallenge ? (userChallenge.progress / challenge.target) * 100 : 0;

              return (
                <Card key={challenge.id} className="bg-black/50 border-emerald-800">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl">{challenge.icon}</span>
                        <div>
                          <CardTitle className="text-white text-lg">{challenge.title}</CardTitle>
                          <Badge variant="outline" className="mt-1 text-xs border-emerald-600 text-emerald-400">
                            {getPeriodLabel(challenge.period)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-emerald-300 mt-2">
                      {challenge.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-emerald-400">Meta:</span>
                      <span className="text-white font-semibold">{challenge.target} km</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-emerald-400">Recompensa:</span>
                      <span className="text-yellow-400 font-semibold flex items-center gap-1">
                        <Coins className="w-4 h-4" />
                        Capicoins em dobro!
                      </span>
                    </div>

                    {enrolled && userChallenge && (
                      <>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-emerald-300">Progresso</span>
                            <span className="text-white font-semibold">
                              {userChallenge.progress.toFixed(1)} / {challenge.target} km
                            </span>
                          </div>
                          <Progress value={Math.min(progress, 100)} className="h-2" />
                        </div>

                        {userChallenge.completed && !userChallenge.rewardClaimed && (
                          <Button
                            onClick={() => handleClaimReward(userChallenge, challenge)}
                            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                          >
                            <Trophy className="w-4 h-4 mr-2" />
                            Resgatar Recompensa
                          </Button>
                        )}

                        {userChallenge.completed && userChallenge.rewardClaimed && (
                          <div className="flex items-center justify-center gap-2 text-green-400 py-2">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="font-semibold">Desafio Concluído!</span>
                          </div>
                        )}

                        {!userChallenge.completed && (
                          <div className="flex items-center justify-center gap-2 text-emerald-400 py-2">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">Em andamento...</span>
                          </div>
                        )}
                      </>
                    )}

                    {!enrolled && (
                      <Button
                        onClick={() => handleEnroll(challenge.id)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <Target className="w-4 h-4 mr-2" />
                        Participar
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Desafios de Ciclismo */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            🚴 Desafios de Ciclismo
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cyclingChallenges.map(challenge => {
              const enrolled = isEnrolled(challenge.id);
              const userChallenge = getUserChallengeData(challenge.id);
              const progress = userChallenge ? (userChallenge.progress / challenge.target) * 100 : 0;

              return (
                <Card key={challenge.id} className="bg-black/50 border-emerald-800">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl">{challenge.icon}</span>
                        <div>
                          <CardTitle className="text-white text-lg">{challenge.title}</CardTitle>
                          <Badge variant="outline" className="mt-1 text-xs border-emerald-600 text-emerald-400">
                            {getPeriodLabel(challenge.period)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-emerald-300 mt-2">
                      {challenge.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-emerald-400">Meta:</span>
                      <span className="text-white font-semibold">{challenge.target} km</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-emerald-400">Recompensa:</span>
                      <span className="text-yellow-400 font-semibold flex items-center gap-1">
                        <Coins className="w-4 h-4" />
                        Capicoins em dobro!
                      </span>
                    </div>

                    {enrolled && userChallenge && (
                      <>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-emerald-300">Progresso</span>
                            <span className="text-white font-semibold">
                              {userChallenge.progress.toFixed(1)} / {challenge.target} km
                            </span>
                          </div>
                          <Progress value={Math.min(progress, 100)} className="h-2" />
                        </div>

                        {userChallenge.completed && !userChallenge.rewardClaimed && (
                          <Button
                            onClick={() => handleClaimReward(userChallenge, challenge)}
                            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                          >
                            <Trophy className="w-4 h-4 mr-2" />
                            Resgatar Recompensa
                          </Button>
                        )}

                        {userChallenge.completed && userChallenge.rewardClaimed && (
                          <div className="flex items-center justify-center gap-2 text-green-400 py-2">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="font-semibold">Desafio Concluído!</span>
                          </div>
                        )}

                        {!userChallenge.completed && (
                          <div className="flex items-center justify-center gap-2 text-emerald-400 py-2">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">Em andamento...</span>
                          </div>
                        )}
                      </>
                    )}

                    {!enrolled && (
                      <Button
                        onClick={() => handleEnroll(challenge.id)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <Target className="w-4 h-4 mr-2" />
                        Participar
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
