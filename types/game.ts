export type Symbol = {
  tempId?: string;
  id: string;
  name: string;
  value: number;
  rarity: "common" | "uncommon" | "rare" | "very_rare" | "special";
  emoji: string;
  effectDescription?: string;
  counter?: number;
  type: Group[];
  effect?: (grid: (Symbol | null)[], index: number) => effectResult;
};

export type Group =
  | "animal"
  | "anvillikes"
  | "archlikes"
  | "arrow"
  | "beelikes"
  | "bird"
  | "booze"
  | "box"
  | "capsule"
  | "chest"
  | "chickenstuff"
  | "counted"
  | "darkhumor"
  | "destroyable_matryoshka"
  | "doglikes"
  | "dwarflikes"
  | "eachother"
  | "essence"
  | "farmerlikes"
  | "food"
  | "fossillikes"
  | "fruit"
  | "fruitlikes"
  | "funny"
  | "gem"
  | "halloween"
  | "hex"
  | "human"
  | "kyle"
  | "minerlikes"
  | "monkeylikes"
  | "night"
  | "omelettestuff"
  | "ore"
  | "organism"
  | "pepper"
  | "piratelikes"
  | "plant"
  | "poslikes"
  | "raritymod"
  | "richlikes"
  | "robinhates"
  | "robinlikes"
  | "scaler"
  | "slow"
  | "spawner0"
  | "spawner1"
  | "spiritbox"
  | "suit"
  | "time_capsule_effects"
  | "time_machine"
  | "time_machine3"
  | "toddlerlikes"
  | "triggerchance"
  | "triggerhex"
  | "void"
  | "witchlikes";

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
  multiplier: number;
  bonusValue: number;
  add?: string[];
};
