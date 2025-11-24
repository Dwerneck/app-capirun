// Gerenciamento de atividades no localStorage (substituir por API/DB real)

import { Activity, PersonalRecord, WeeklyStats } from './types';

const ACTIVITIES_KEY = 'capirun_activities';

// Verificar se está no cliente (navegador)
function isClient(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

export function saveActivity(activity: Activity): void {
  if (!isClient()) return;
  
  try {
    const activities = getActivities();
    activities.push(activity);
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
  } catch (error) {
    console.error('Erro ao salvar atividade:', error);
  }
}

export function getActivities(userId?: string): Activity[] {
  if (!isClient()) return [];
  
  try {
    const stored = localStorage.getItem(ACTIVITIES_KEY);
    if (!stored) return [];
    
    const activities: Activity[] = JSON.parse(stored);
    
    if (userId) {
      return activities.filter(a => a.userId === userId);
    }
    
    return activities;
  } catch (error) {
    console.error('Erro ao buscar atividades:', error);
    return [];
  }
}

export function getPersonalRecords(userId: string): PersonalRecord {
  if (!isClient()) {
    return {
      longestDistance: 0,
      longestDuration: 0,
      highestCalories: 0,
      mostCoins: 0,
    };
  }
  
  try {
    const activities = getActivities(userId);
    
    return {
      longestDistance: Math.max(...activities.map(a => a.distance), 0),
      longestDuration: Math.max(...activities.map(a => a.duration), 0),
      highestCalories: Math.max(...activities.map(a => a.calories), 0),
      mostCoins: Math.max(...activities.map(a => a.coinsEarned), 0),
    };
  } catch (error) {
    console.error('Erro ao buscar recordes:', error);
    return {
      longestDistance: 0,
      longestDuration: 0,
      highestCalories: 0,
      mostCoins: 0,
    };
  }
}

export function getWeeklyStats(userId: string): WeeklyStats {
  if (!isClient()) {
    return {
      totalDistance: 0,
      totalDuration: 0,
      totalCalories: 0,
      totalCoins: 0,
      activitiesCount: 0,
    };
  }
  
  try {
    const activities = getActivities(userId);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weekActivities = activities.filter(a => new Date(a.date) >= oneWeekAgo);
    
    return {
      totalDistance: weekActivities.reduce((sum, a) => sum + a.distance, 0),
      totalDuration: weekActivities.reduce((sum, a) => sum + a.duration, 0),
      totalCalories: weekActivities.reduce((sum, a) => sum + a.calories, 0),
      totalCoins: weekActivities.reduce((sum, a) => sum + a.coinsEarned, 0),
      activitiesCount: weekActivities.length,
    };
  } catch (error) {
    console.error('Erro ao buscar estatísticas semanais:', error);
    return {
      totalDistance: 0,
      totalDuration: 0,
      totalCalories: 0,
      totalCoins: 0,
      activitiesCount: 0,
    };
  }
}

export function getMonthlyStats(userId: string): WeeklyStats {
  if (!isClient()) {
    return {
      totalDistance: 0,
      totalDuration: 0,
      totalCalories: 0,
      totalCoins: 0,
      activitiesCount: 0,
    };
  }
  
  try {
    const activities = getActivities(userId);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const monthActivities = activities.filter(a => new Date(a.date) >= oneMonthAgo);
    
    return {
      totalDistance: monthActivities.reduce((sum, a) => sum + a.distance, 0),
      totalDuration: monthActivities.reduce((sum, a) => sum + a.duration, 0),
      totalCalories: monthActivities.reduce((sum, a) => sum + a.calories, 0),
      totalCoins: monthActivities.reduce((sum, a) => sum + a.coinsEarned, 0),
      activitiesCount: monthActivities.length,
    };
  } catch (error) {
    console.error('Erro ao buscar estatísticas mensais:', error);
    return {
      totalDistance: 0,
      totalDuration: 0,
      totalCalories: 0,
      totalCoins: 0,
      activitiesCount: 0,
    };
  }
}
