import { Challenge, UserChallenge } from './types';

const CHALLENGES_KEY = 'capirun_challenges';
const USER_CHALLENGES_KEY = 'capirun_user_challenges';

// Desafios padrões do sistema
export const DEFAULT_CHALLENGES: Challenge[] = [
  // Desafios de Caminhada
  {
    id: 'walk-daily-5km',
    title: 'Caminhada Diária',
    description: 'Caminhe 5km hoje e ganhe capicoins em dobro!',
    activityType: 'walking',
    target: 5,
    reward: 2,
    period: 'daily',
    startDate: new Date(),
    endDate: new Date(new Date().setHours(23, 59, 59, 999)),
    icon: '🚶'
  },
  {
    id: 'walk-weekly-30km',
    title: 'Maratona de Caminhada',
    description: 'Caminhe 30km essa semana e ganhe capicoins em dobro!',
    activityType: 'walking',
    target: 30,
    reward: 2,
    period: 'weekly',
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    icon: '🚶‍♂️'
  },
  {
    id: 'walk-monthly-100km',
    title: 'Caminhante do Mês',
    description: 'Caminhe 100km esse mês e ganhe capicoins em dobro!',
    activityType: 'walking',
    target: 100,
    reward: 2,
    period: 'monthly',
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    icon: '🏃'
  },
  
  // Desafios de Corrida
  {
    id: 'run-daily-3km',
    title: 'Corrida Rápida',
    description: 'Corra 3km hoje e ganhe capicoins em dobro!',
    activityType: 'running',
    target: 3,
    reward: 2,
    period: 'daily',
    startDate: new Date(),
    endDate: new Date(new Date().setHours(23, 59, 59, 999)),
    icon: '🏃'
  },
  {
    id: 'run-weekly-50km',
    title: 'Corredor da Semana',
    description: 'Corra 50km essa semana e ganhe capicoins em dobro!',
    activityType: 'running',
    target: 50,
    reward: 2,
    period: 'weekly',
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    icon: '🏃‍♀️'
  },
  {
    id: 'run-monthly-200km',
    title: 'Maratonista do Mês',
    description: 'Corra 200km esse mês e ganhe capicoins em dobro!',
    activityType: 'running',
    target: 200,
    reward: 2,
    period: 'monthly',
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    icon: '🏆'
  },
  
  // Desafios de Ciclismo
  {
    id: 'cycle-daily-10km',
    title: 'Pedalada Diária',
    description: 'Pedale 10km hoje e ganhe capicoins em dobro!',
    activityType: 'cycling',
    target: 10,
    reward: 2,
    period: 'daily',
    startDate: new Date(),
    endDate: new Date(new Date().setHours(23, 59, 59, 999)),
    icon: '🚴'
  },
  {
    id: 'cycle-weekly-100km',
    title: 'Ciclista da Semana',
    description: 'Pedale 100km essa semana e ganhe capicoins em dobro!',
    activityType: 'cycling',
    target: 100,
    reward: 2,
    period: 'weekly',
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    icon: '🚴‍♂️'
  },
  {
    id: 'cycle-monthly-400km',
    title: 'Ciclista do Mês',
    description: 'Pedale 400km esse mês e ganhe capicoins em dobro!',
    activityType: 'cycling',
    target: 400,
    reward: 2,
    period: 'monthly',
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    icon: '🚵'
  }
];

export function getChallenges(): Challenge[] {
  return DEFAULT_CHALLENGES;
}

export function getUserChallenges(userId: string): UserChallenge[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(USER_CHALLENGES_KEY);
  if (!stored) return [];
  
  const allUserChallenges: UserChallenge[] = JSON.parse(stored);
  return allUserChallenges
    .filter(uc => uc.userId === userId)
    .map(uc => ({
      ...uc,
      completedAt: uc.completedAt ? new Date(uc.completedAt) : undefined
    }));
}

export function enrollInChallenge(userId: string, challengeId: string): void {
  if (typeof window === 'undefined') return;
  
  const stored = localStorage.getItem(USER_CHALLENGES_KEY);
  const allUserChallenges: UserChallenge[] = stored ? JSON.parse(stored) : [];
  
  // Verifica se já está inscrito
  const exists = allUserChallenges.find(
    uc => uc.userId === userId && uc.challengeId === challengeId
  );
  
  if (!exists) {
    const newUserChallenge: UserChallenge = {
      id: `uc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      challengeId,
      progress: 0,
      completed: false,
      rewardClaimed: false
    };
    
    allUserChallenges.push(newUserChallenge);
    localStorage.setItem(USER_CHALLENGES_KEY, JSON.stringify(allUserChallenges));
  }
}

export function updateChallengeProgress(userId: string): void {
  if (typeof window === 'undefined') return;
  
  const userChallenges = getUserChallenges(userId);
  const challenges = getChallenges();
  const activities = JSON.parse(localStorage.getItem('capirun_activities') || '[]')
    .filter((a: any) => a.userId === userId)
    .map((a: any) => ({ ...a, date: new Date(a.date) }));
  
  userChallenges.forEach(uc => {
    if (uc.completed) return;
    
    const challenge = challenges.find(c => c.id === uc.challengeId);
    if (!challenge) return;
    
    const now = new Date();
    if (now > challenge.endDate) return;
    
    // Filtra atividades do tipo correto e dentro do período
    const relevantActivities = activities.filter((a: any) => {
      const activityDate = new Date(a.date);
      return (
        a.type === challenge.activityType &&
        activityDate >= challenge.startDate &&
        activityDate <= challenge.endDate
      );
    });
    
    const progress = relevantActivities.reduce((sum: number, a: any) => sum + a.distance, 0);
    const completed = progress >= challenge.target;
    
    updateUserChallenge(uc.id, { 
      progress, 
      completed,
      completedAt: completed ? new Date() : undefined
    });
  });
}

export function updateUserChallenge(userChallengeId: string, updates: Partial<UserChallenge>): void {
  if (typeof window === 'undefined') return;
  
  const stored = localStorage.getItem(USER_CHALLENGES_KEY);
  if (!stored) return;
  
  const allUserChallenges: UserChallenge[] = JSON.parse(stored);
  const index = allUserChallenges.findIndex(uc => uc.id === userChallengeId);
  
  if (index !== -1) {
    allUserChallenges[index] = { ...allUserChallenges[index], ...updates };
    localStorage.setItem(USER_CHALLENGES_KEY, JSON.stringify(allUserChallenges));
  }
}

export function claimChallengeReward(userChallengeId: string): void {
  updateUserChallenge(userChallengeId, { rewardClaimed: true });
}
