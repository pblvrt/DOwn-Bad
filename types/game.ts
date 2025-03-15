export type Symbol = {
  id: string;
  name: string;
  value: number;
  rarity: 'common' | 'uncommon' | 'rare';
  emoji: string;
  effectDescription?: string;
  bonusValue?: number;
  effect?: (grid: (Symbol | null)[], index: number) => number;
};

export type RentSchedule = {
  rent: number;
  turns: number;
};

export type GameState = {
  coins: number;
  rent: number;
  turnsUntilRent: number;
  grid: (Symbol | null)[];
  symbols: Symbol[];
  soundEnabled: boolean;
  floor: number;
  rentSchedule: RentSchedule[];
};