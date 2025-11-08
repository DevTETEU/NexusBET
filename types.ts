
export interface Odd {
  outcome: string;
  value: number;
}

export interface Game {
  id: string;
  sport: string;
  league: string;
  teamA: string;
  teamB: string;
  odds: Odd[];
}

export interface BetSelection extends Game {
  selectedOdd: Odd;
}

export type BetStatus = 'Pending' | 'Won' | 'Lost';

export interface BetRecord {
  id: string;
  selections: BetSelection[];
  stake: number;
  totalOdds: number;
  potentialWinnings: number;
  placedAt: number; // timestamp
  status: BetStatus;
}

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}
