export type Symbol = {
  tempId?: string;
  id: string;
  name: string;
  value: number;
  rarity: "common" | "uncommon" | "rare";
  emoji: string;
  effectDescription?: string;
  bonusValue?: number;
  counter?: number;
  effect?: (grid: (Symbol | null)[], index: number) => effectResult;
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
  shopOpen: boolean;
  lost: boolean;
};

export type effectResult = {
  isDestroyed: boolean;
  bonusValue: number;
  symbol?: Symbol;
};
