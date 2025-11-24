// Constantes do Capirun

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

// Fórmula: moedas = (calorias * 0.1 + km * 1) * peso_da_modalidade
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
