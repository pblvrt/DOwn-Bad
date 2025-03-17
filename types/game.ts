export type Symbol = {
  tempId?: string;
  id: string;
  name: string;
  value: number;
  rarity: "common" | "uncommon" | "rare" | "very_rare" | "special";
  emoji: string;
  effectDescription?: string;
  bonusValue?: number;
  counter?: number;
  type:
    | "card"
    | "void"
    | "food"
    | "drink"
    | "drug"
    | "other"
    | "character"
    | "animal"
    | "animal_character"
    | "object"
    | "human_character"
    | "plant"
    | "dice"
    | "ore"
    | "fruit";
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
  add?: string[];
};
