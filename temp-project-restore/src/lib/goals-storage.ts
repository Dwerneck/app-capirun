import { Goal } from './types';

const GOALS_KEY = 'capirun_goals';

export function getGoals(userId: string): Goal[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(GOALS_KEY);
  if (!stored) return [];
  
  const allGoals: Goal[] = JSON.parse(stored);
  return allGoals
    .filter(goal => goal.userId === userId)
    .map(goal => ({
      ...goal,
      startDate: new Date(goal.startDate),
      endDate: new Date(goal.endDate)
    }));
}

export function saveGoal(goal: Goal): void {
  if (typeof window === 'undefined') return;
  
  const stored = localStorage.getItem(GOALS_KEY);
  const allGoals: Goal[] = stored ? JSON.parse(stored) : [];
  
  allGoals.push(goal);
  localStorage.setItem(GOALS_KEY, JSON.stringify(allGoals));
}

export function updateGoal(goalId: string, updates: Partial<Goal>): void {
  if (typeof window === 'undefined') return;
  
  const stored = localStorage.getItem(GOALS_KEY);
  if (!stored) return;
  
  const allGoals: Goal[] = JSON.parse(stored);
  const index = allGoals.findIndex(g => g.id === goalId);
  
  if (index !== -1) {
    allGoals[index] = { ...allGoals[index], ...updates };
    localStorage.setItem(GOALS_KEY, JSON.stringify(allGoals));
  }
}

export function deleteGoal(goalId: string): void {
  if (typeof window === 'undefined') return;
  
  const stored = localStorage.getItem(GOALS_KEY);
  if (!stored) return;
  
  const allGoals: Goal[] = JSON.parse(stored);
  const filtered = allGoals.filter(g => g.id !== goalId);
  localStorage.setItem(GOALS_KEY, JSON.stringify(filtered));
}

export function updateGoalProgress(userId: string): void {
  if (typeof window === 'undefined') return;
  
  const goals = getGoals(userId);
  const activities = JSON.parse(localStorage.getItem('capirun_activities') || '[]')
    .filter((a: any) => a.userId === userId)
    .map((a: any) => ({ ...a, date: new Date(a.date) }));
  
  goals.forEach(goal => {
    const now = new Date();
    if (now > goal.endDate) return;
    
    let current = 0;
    const relevantActivities = activities.filter((a: any) => {
      const activityDate = new Date(a.date);
      return activityDate >= goal.startDate && activityDate <= goal.endDate;
    });
    
    switch (goal.type) {
      case 'distance':
        current = relevantActivities.reduce((sum: number, a: any) => sum + a.distance, 0);
        break;
      case 'calories':
        current = relevantActivities.reduce((sum: number, a: any) => sum + a.calories, 0);
        break;
      case 'activities':
        current = relevantActivities.length;
        break;
      case 'coins':
        current = relevantActivities.reduce((sum: number, a: any) => sum + a.coinsEarned, 0);
        break;
    }
    
    const completed = current >= goal.target;
    updateGoal(goal.id, { current, completed });
  });
}
