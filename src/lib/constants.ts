// Constantes do Capirun

import { ActivityType } from './types';

// NOVAS REGRAS DE DISTRIBUIÇÃO DE CAPICOINS
export const ACTIVITY_RULES = {
  walking: {
    coinsPerKm: 12,
    maxDistance: 165, // km por mês
    maxCoins: 2000, // moedas por mês
    maxSpeed: 7, // km/h
    label: 'Caminhada',
  },
  running: {
    coinsPerKm: 6,
    maxDistance: 330, // km por mês
    maxCoins: 2000, // moedas por mês
    maxSpeed: 18, // km/h
    label: 'Corrida',
  },
  cycling: {
    coinsPerKm: 2,
    maxDistance: 1000, // km por mês
    maxCoins: 2000, // moedas por mês
    maxSpeed: 40, // km/h
    label: 'Ciclismo',
  },
} as const;

export const ACTIVITY_WEIGHTS = {
  walking: 2.0,
  running: 1.0,
  cycling: 0.5,
} as const;

export const ACTIVITY_LABELS = {
  walking: 'Caminhada',
  running: 'Corrida',
  cycling: 'Ciclismo',
} as const;

export const SUBSCRIPTION_PRICES = {
  monthly: 16.99,
  annual: 159.0,
} as const;

export const FREE_TRIAL_DAYS = 30;

export const PICKUP_LOCATION = 'Curitiba - PR';

// NOVA FUNÇÃO: Calcular moedas com as novas regras e limites mensais
export function calculateCoinsWithLimits(
  distance: number,
  activityType: ActivityType,
  monthlyStats: { 
    totalDistance: number; 
    totalCoins: number; 
    distanceByType: Record<string, number>; 
    coinsByType: Record<string, number> 
  }
): { coins: number; reachedLimit: boolean; limitType: 'distance' | 'coins' | 'none' } {
  const rules = ACTIVITY_RULES[activityType];
  
  // Verificar se já atingiu o limite mensal TOTAL de moedas (2000)
  if (monthlyStats.totalCoins >= 2000) {
    return { coins: 0, reachedLimit: true, limitType: 'coins' };
  }
  
  // Verificar distância percorrida nesta modalidade no mês
  const currentDistanceInType = monthlyStats.distanceByType[activityType] || 0;
  const currentCoinsInType = monthlyStats.coinsByType[activityType] || 0;
  
  // Verificar limite de distância da modalidade
  if (currentDistanceInType >= rules.maxDistance) {
    return { coins: 0, reachedLimit: true, limitType: 'distance' };
  }
  
  // Calcular moedas baseado na distância
  let distanceToCount = distance;
  
  // Se ultrapassar o limite de distância da modalidade, contar apenas até o limite
  if (currentDistanceInType + distance > rules.maxDistance) {
    distanceToCount = rules.maxDistance - currentDistanceInType;
  }
  
  let coinsEarned = Math.floor(distanceToCount * rules.coinsPerKm);
  
  // Verificar se ultrapassaria o limite de moedas da modalidade
  if (currentCoinsInType + coinsEarned > rules.maxCoins) {
    coinsEarned = rules.maxCoins - currentCoinsInType;
  }
  
  // Verificar se ultrapassaria o limite TOTAL de moedas (2000)
  if (monthlyStats.totalCoins + coinsEarned > 2000) {
    coinsEarned = 2000 - monthlyStats.totalCoins;
  }
  
  return { 
    coins: Math.max(0, coinsEarned), 
    reachedLimit: coinsEarned === 0,
    limitType: coinsEarned === 0 ? 'coins' : 'none'
  };
}

// NOVA FUNÇÃO: Proteção anti-fraude - Verificar velocidade e retornar modalidade correta
export function checkSpeedAndGetActivityType(
  speed: number,
  selectedType: ActivityType
): { 
  actualType: ActivityType; 
  warning: string | null;
  shouldBlock: boolean;
} {
  // Caminhada: até 7 km/h
  if (selectedType === 'walking') {
    if (speed > 7 && speed <= 18) {
      return {
        actualType: 'running',
        warning: '⚠️ Você está em uma velocidade considerada como corrida. Diminua a velocidade ou sua emissão de capicoins será atualizada para modalidade de corrida.',
        shouldBlock: false,
      };
    } else if (speed > 18 && speed <= 40) {
      return {
        actualType: 'cycling',
        warning: '⚠️ Velocidade muito alta! Você está em velocidade de ciclismo. Sua emissão será calculada como ciclismo.',
        shouldBlock: false,
      };
    } else if (speed > 40) {
      return {
        actualType: 'walking',
        warning: '🚫 Velocidade acima de 40 km/h! Reduza a velocidade para continuar ganhando capicoins.',
        shouldBlock: true,
      };
    }
  }
  
  // Corrida: até 18 km/h
  if (selectedType === 'running') {
    if (speed > 18 && speed <= 40) {
      return {
        actualType: 'cycling',
        warning: '⚠️ Velocidade de ciclismo detectada! Sua emissão de capicoins será atualizada para modalidade de ciclismo.',
        shouldBlock: false,
      };
    } else if (speed > 40) {
      return {
        actualType: 'running',
        warning: '🚫 Velocidade acima de 40 km/h! Reduza a velocidade para continuar ganhando capicoins.',
        shouldBlock: true,
      };
    }
  }
  
  // Ciclismo: até 40 km/h
  if (selectedType === 'cycling') {
    if (speed > 40) {
      return {
        actualType: 'cycling',
        warning: '🚫 Velocidade acima de 40 km/h! Reduza a velocidade para continuar ganhando capicoins.',
        shouldBlock: true,
      };
    }
  }
  
  return {
    actualType: selectedType,
    warning: null,
    shouldBlock: false,
  };
}

// Fórmula antiga mantida para compatibilidade
export function calculateCoins(
  calories: number,
  distance: number,
  activityType: keyof typeof ACTIVITY_WEIGHTS
): number {
  const weight = ACTIVITY_WEIGHTS[activityType];
  return Math.floor((calories * 0.1 + distance * 1) * weight);
}

// Cálculo aproximado de calorias (fórmula simplificada)
export function calculateCalories(
  distance: number, // km
  duration: number, // segundos
  weight: number, // kg
  activityType: keyof typeof ACTIVITY_WEIGHTS
): number {
  const hours = duration / 3600;
  const speed = distance / hours;
  
  // MET (Metabolic Equivalent of Task) aproximado
  let met = 3.5; // caminhada padrão
  
  if (activityType === 'running') {
    met = speed < 8 ? 8.0 : 11.0;
  } else if (activityType === 'cycling') {
    met = speed < 16 ? 6.0 : 10.0;
  } else {
    met = speed < 5 ? 3.5 : 5.0;
  }
  
  // Calorias = MET * peso(kg) * tempo(horas)
  return Math.floor(met * weight * hours);
}
