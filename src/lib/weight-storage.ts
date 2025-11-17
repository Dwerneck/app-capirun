import { WeightEntry } from './types';

const WEIGHT_KEY = 'capirun_weight_entries';

export function getWeightEntries(userId: string): WeightEntry[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(WEIGHT_KEY);
  if (!stored) return [];
  
  const allEntries: WeightEntry[] = JSON.parse(stored);
  return allEntries
    .filter(entry => entry.userId === userId)
    .map(entry => ({
      ...entry,
      date: new Date(entry.date)
    }))
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function saveWeightEntry(entry: WeightEntry): void {
  if (typeof window === 'undefined') return;
  
  const stored = localStorage.getItem(WEIGHT_KEY);
  const allEntries: WeightEntry[] = stored ? JSON.parse(stored) : [];
  
  allEntries.push(entry);
  localStorage.setItem(WEIGHT_KEY, JSON.stringify(allEntries));
}

export function deleteWeightEntry(entryId: string): void {
  if (typeof window === 'undefined') return;
  
  const stored = localStorage.getItem(WEIGHT_KEY);
  if (!stored) return;
  
  const allEntries: WeightEntry[] = JSON.parse(stored);
  const filtered = allEntries.filter(e => e.id !== entryId);
  localStorage.setItem(WEIGHT_KEY, JSON.stringify(filtered));
}

export function getWeightStats(userId: string) {
  const entries = getWeightEntries(userId);
  
  if (entries.length === 0) {
    return {
      currentWeight: 0,
      startWeight: 0,
      totalChange: 0,
      trend: 'stable' as 'up' | 'down' | 'stable'
    };
  }
  
  const currentWeight = entries[0].weight;
  const startWeight = entries[entries.length - 1].weight;
  const totalChange = currentWeight - startWeight;
  
  let trend: 'up' | 'down' | 'stable' = 'stable';
  if (totalChange > 0.5) trend = 'up';
  else if (totalChange < -0.5) trend = 'down';
  
  return {
    currentWeight,
    startWeight,
    totalChange,
    trend
  };
}
