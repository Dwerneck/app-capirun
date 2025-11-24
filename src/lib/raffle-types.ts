// Tipos para sistema de sorteios

export interface RaffleProduct {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  ticketPrice: number; // preço em capicoins
  drawDate: Date;
  totalTickets: number;
  soldTickets: number;
  status: 'active' | 'closed' | 'drawn';
  winnerId?: string;
  category: 'eyewear' | 'shoes' | 'watch' | 'accessory' | 'other';
}

export interface RaffleTicket {
  id: string;
  userId: string;
  raffleId: string;
  purchaseDate: Date;
  ticketNumber: number;
}

export interface RaffleParticipation {
  raffleId: string;
  raffleName: string;
  ticketCount: number;
  totalSpent: number;
  purchaseDate: Date;
}
