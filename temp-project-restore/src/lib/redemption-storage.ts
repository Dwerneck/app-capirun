// Gerenciamento de resgates no localStorage

import { Redemption } from './types';

const REDEMPTIONS_KEY = 'capirun_redemptions';

// Verificar se está no cliente (navegador)
function isClient(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

export function saveRedemption(redemption: Redemption): void {
  if (!isClient()) return;
  
  try {
    const redemptions = getRedemptions();
    redemptions.push(redemption);
    localStorage.setItem(REDEMPTIONS_KEY, JSON.stringify(redemptions));
  } catch (error) {
    console.error('Erro ao salvar resgate:', error);
  }
}

export function getRedemptions(userId?: string): Redemption[] {
  if (!isClient()) return [];
  
  try {
    const stored = localStorage.getItem(REDEMPTIONS_KEY);
    if (!stored) return [];
    
    const redemptions: Redemption[] = JSON.parse(stored);
    
    if (userId) {
      return redemptions.filter(r => r.userId === userId);
    }
    
    return redemptions;
  } catch (error) {
    console.error('Erro ao buscar resgates:', error);
    return [];
  }
}

export function updateRedemptionStatus(redemptionId: string, status: 'pending' | 'completed' | 'cancelled'): void {
  if (!isClient()) return;
  
  try {
    const redemptions = getRedemptions();
    const index = redemptions.findIndex(r => r.id === redemptionId);
    
    if (index !== -1) {
      redemptions[index].status = status;
      localStorage.setItem(REDEMPTIONS_KEY, JSON.stringify(redemptions));
    }
  } catch (error) {
    console.error('Erro ao atualizar status do resgate:', error);
  }
}

export function getTotalCoinsSpent(userId: string): number {
  if (!isClient()) return 0;
  
  try {
    const redemptions = getRedemptions(userId);
    return redemptions
      .filter(r => r.status !== 'cancelled')
      .reduce((sum, r) => sum + r.coinPrice, 0);
  } catch (error) {
    console.error('Erro ao calcular capicoins gastos:', error);
    return 0;
  }
}

export function getPendingRedemptions(userId: string): Redemption[] {
  if (!isClient()) return [];
  
  try {
    const redemptions = getRedemptions(userId);
    return redemptions.filter(r => r.status === 'pending');
  } catch (error) {
    console.error('Erro ao buscar resgates pendentes:', error);
    return [];
  }
}

export function getCompletedRedemptions(userId: string): Redemption[] {
  if (!isClient()) return [];
  
  try {
    const redemptions = getRedemptions(userId);
    return redemptions.filter(r => r.status === 'completed');
  } catch (error) {
    console.error('Erro ao buscar resgates completados:', error);
    return [];
  }
}
