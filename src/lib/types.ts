// Tipos principais do Capirun

export type ActivityType = 'walking' | 'running' | 'cycling';

export interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  weight?: number; // kg
  height?: number; // cm
  coins: number;
  createdAt: Date;
  subscriptionStatus: 'free' | 'monthly' | 'annual';
  subscriptionExpiresAt?: Date;
}

export interface Activity {
  id: string;
  userId: string;
  type: ActivityType;
  distance: number; // km
  duration: number; // segundos
  calories: number;
  coinsEarned: number;
  avgSpeed: number; // km/h
  pace?: number; // min/km - tempo médio por quilômetro
  date: Date;
  route?: RoutePoint[];
}

export interface RoutePoint {
  lat: number;
  lng: number;
  timestamp: number;
}

export interface PersonalRecord {
  longestDistance: number;
  longestDuration: number;
  highestCalories: number;
  mostCoins: number;
}

export interface WeeklyStats {
  totalDistance: number;
  totalDuration: number;
  totalCalories: number;
  totalCoins: number;
  activitiesCount: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  coinPrice: number;
  imageUrl: string;
  category: 'supplement' | 'accessory' | 'gear';
  stock: number;
}

export interface PickupSchedule {
  date: Date;
  location: string;
  startTime: string;
  endTime: string;
}

export interface Redemption {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  coinPrice: number;
  date: Date;
  location: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface Goal {
  id: string;
  userId: string;
  type: 'distance' | 'calories' | 'activities' | 'coins';
  target: number;
  current: number;
  period: 'daily' | 'weekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  completed: boolean;
}

export interface WeightEntry {
  id: string;
  userId: string;
  weight: number; // kg
  date: Date;
  notes?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  activityType: ActivityType;
  target: number; // distância em km
  reward: number; // capicoins em dobro
  period: 'daily' | 'weekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  icon: string;
}

export interface UserChallenge {
  id: string;
  userId: string;
  challengeId: string;
  progress: number;
  completed: boolean;
  completedAt?: Date;
  rewardClaimed: boolean;
}
