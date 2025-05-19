import { ANIMATION_DELAYS } from "@/hooks/useAnimationTimers";
import { effectResult, Symbol, Group } from "@/types/game";

// Get adjacent indices for a given index in a 4x4 grid (including diagonals)
export function getAdjacentIndices(index: number): number[] {
  const row = Math.floor(index / 4);
  const col = index % 4;
  const adjacentIndices: number[] = [];

  // Check top
  if (row > 0) adjacentIndices.push(index - 4);

  // Check top-right
  if (row > 0 && col < 3) adjacentIndices.push(index - 4 + 1);

  // Check right
  if (col < 3) adjacentIndices.push(index + 1);

  // Check bottom-right
  if (row < 3 && col < 3) adjacentIndices.push(index + 4 + 1);

  // Check bottom
  if (row < 3) adjacentIndices.push(index + 4);

  // Check bottom-left
  if (row < 3 && col > 0) adjacentIndices.push(index + 4 - 1);

  // Check left
  if (col > 0) adjacentIndices.push(index - 1);

  // Check top-left
  if (row > 0 && col > 0) adjacentIndices.push(index - 4 - 1);

  return adjacentIndices;
}

export function getAdjacentSymbols(
  grid: (Symbol | null)[],
  index: number
): Symbol[] {
  const adjacentIndices = getAdjacentIndices(index);
  return adjacentIndices.map((i) => grid[i]).filter((s) => s !== null);
}

export function isAdjacentToSymbols(
  grid: (Symbol | null)[],
  index: number,
  symbols: string[]
): boolean {
  const adjacentIndices = getAdjacentIndices(index);
  return adjacentIndices.some((i) => symbols.includes(grid[i]?.id || ""));
}

const checkIfModifierIsActive = (
  adjacentSymbols: Symbol[],
  symbolGroups: Group[],
  id: string,
  group: Group,
  moneyModifier: number
) => {
  if (
    adjacentSymbols.some((s) => s?.id === id) &&
    symbolGroups.includes(group)
  ) {
    return moneyModifier;
  }
  return 0;
};

export function getModifier(grid: (Symbol | null)[], index: number): number {
  if (!grid) {
    console.log("grid is null", grid, index);
    return 1;
  }
  const adjacentSymbols = getAdjacentSymbols(grid, index);
  const currentSymbol = grid[index];
  const symbolGroups = currentSymbol?.type;
  if (!symbolGroups) return 1;
  let moneyModifier = 0;

  // Character modifiers for specific groups
  moneyModifier += checkIfModifierIsActive(
    adjacentSymbols,
    symbolGroups,
    "beastmaster",
    "animal",
    2
  );
  moneyModifier += checkIfModifierIsActive(
    adjacentSymbols,
    symbolGroups,
    "chef",
    "food",
    2
  );
  moneyModifier += checkIfModifierIsActive(
    adjacentSymbols,
    symbolGroups,
    "farmer",
    "food",
    2
  );
  moneyModifier += checkIfModifierIsActive(
    adjacentSymbols,
    symbolGroups,
    "miner",
    "archlikes",
    2
  );
  moneyModifier += checkIfModifierIsActive(
    adjacentSymbols,
    symbolGroups,
    "geologist",
    "archlikes",
    2
  );
  moneyModifier += checkIfModifierIsActive(
    adjacentSymbols,
    symbolGroups,
    "monkey",
    "monkeylikes",
    2
  );
  moneyModifier += checkIfModifierIsActive(
    adjacentSymbols,
    symbolGroups,
    "bee",
    "beelikes",
    2
  );
  moneyModifier += checkIfModifierIsActive(
    adjacentSymbols,
    symbolGroups,
    "mrs. fruit",
    "fruitlikes",
    2
  );
  moneyModifier += checkIfModifierIsActive(
    adjacentSymbols,
    symbolGroups,
    "comedian",
    "funny",
    3
  );
  moneyModifier += checkIfModifierIsActive(
    adjacentSymbols,
    symbolGroups,
    "bartender",
    "booze",
    2
  );
  moneyModifier += checkIfModifierIsActive(
    adjacentSymbols,
    symbolGroups,
    "pirate",
    "piratelikes",
    2
  );
  moneyModifier += checkIfModifierIsActive(
    adjacentSymbols,
    symbolGroups,
    "diver",
    "poslikes",
    2
  );
  moneyModifier += checkIfModifierIsActive(
    adjacentSymbols,
    symbolGroups,
    "witch",
    "witchlikes",
    2
  );
  moneyModifier += checkIfModifierIsActive(
    adjacentSymbols,
    symbolGroups,
    "billionaire",
    "richlikes",
    3
  );
  moneyModifier += checkIfModifierIsActive(
    adjacentSymbols,
    symbolGroups,
    "dwarf",
    "dwarflikes",
    2
  );
  moneyModifier += checkIfModifierIsActive(
    adjacentSymbols,
    symbolGroups,
    "dog",
    "doglikes",
    1
  );
  
  // moneyModifier += checkIfModifierIsActive(
  //   adjacentSymbols,
  //   symbolGroups,
  //   "toddler",
  //   "toddlerlikes",
  //   2
  // );

  moneyModifier += checkIfModifierIsActive(
    adjacentSymbols,
    symbolGroups,
    "dame",
    "gem",
    2
  );

  // Special case for buffing capsule
  if (adjacentSymbols.some((s) => s?.id === "buffing_capsule")) {
    moneyModifier += 2;
  }

  if (moneyModifier === 0 ){
    return 1;
  }
  return moneyModifier;
}

export function calculateBonusValue(value: number, multiplier: number): number {
  if (multiplier > 0) {
    return value * multiplier;
  }
  return value;
}

export const getIsDestroyed = (
  grid: (Symbol | null)[],
  index: number
): boolean => {
  const adjacentSymbols = getAdjacentSymbols(grid, index);
  const currentSymbol = grid[index];

  if (!currentSymbol) return false;

  // Check specific destruction patterns
  if (currentSymbol.id === "bubble") {
    return adjacentSymbols.some((s) => s?.id === "goldfish");
  }

  if (currentSymbol.id === "banana_peel") {
    return adjacentSymbols.some((s) => s?.id === "thief");
  }

  if (currentSymbol.id === "key" || currentSymbol.id === "magic_key") {
    return adjacentSymbols.some((s) =>
      ["lockbox", "safe", "treasure_chest", "mega_chest"].includes(s?.id || "")
    );
  }

  if (
    ["lockbox", "safe", "treasure_chest", "mega_chest"].includes(
      currentSymbol.id
    )
  ) {
    return adjacentSymbols.some((s) =>
      ["key", "magic_key", "pirate"].includes(s?.id || "")
    );
  }

  if (currentSymbol.id === "target") {
    return adjacentSymbols.some((s) =>
      ["bronze_arrow", "silver_arrow", "golden_arrow", "robin_hood"].includes(
        s?.id || ""
      )
    );
  }

  if (currentSymbol.id === "honey") {
    return adjacentSymbols.some((s) => s?.id === "bear");
  }

  if (currentSymbol.id === "milk") {
    return adjacentSymbols.some((s) => s?.id === "cat");
  }

  if (currentSymbol.id === "cheese") {
    return adjacentSymbols.some((s) => s?.id === "mouse");
  }

  if (["banana", "coconut", "coconut_half"].includes(currentSymbol.id)) {
    return adjacentSymbols.some((s) => s?.id === "monkey");
  }

  if (["present", "candy", "pinata", "bubble"].includes(currentSymbol.id)) {
    return adjacentSymbols.some((s) => s?.id === "toddler");
  }

  if (["ore", "big_ore"].includes(currentSymbol.id)) {
    return adjacentSymbols.some((s) => s?.id === "miner");
  }

  if (["urn", "big_urn", "tomb"].includes(currentSymbol.id)) {
    return adjacentSymbols.some((s) => s?.id === "hooligan");
  }

  if (["beer", "wine"].includes(currentSymbol.id)) {
    return adjacentSymbols.some((s) => s?.id === "dwarf");
  }

  if (["martini"].includes(currentSymbol.id)) {
    return adjacentSymbols.some((s) => s?.id === "dame");
  }

  if (["thief"].includes(currentSymbol.id)) {
    return adjacentSymbols.some((s) =>
      ["bounty_hunter", "banana_peel"].includes(s?.id || "")
    );
  }

  if (
    ["banana", "cherry", "coconut", "coconut_half", "orange", "peach"].includes(
      currentSymbol.id
    )
  ) {
    return adjacentSymbols.some(
      (s) => s?.id === "mrs._fruit" || s?.id === "mrs_fruit"
    );
  }

  if (
    ["ore", "pearl", "shiny_pebble", "big_ore", "sapphire"].includes(
      currentSymbol.id
    )
  ) {
    return adjacentSymbols.some((s) => s?.id === "geologist");
  }

  if (["billionaire", "target", "apple"].includes(currentSymbol.id)) {
    return adjacentSymbols.some((s) => s?.id === "robin_hood");
  }

  if (
    [
      "anchor",
      "beer",
      "coin",
      "lockbox",
      "safe",
      "orange",
      "treasure_chest",
      "mega_chest",
    ].includes(currentSymbol.id)
  ) {
    return adjacentSymbols.some((s) => s?.id === "pirate");
  }

  if (
    [
      "robin_hood",
      "thief",
      "billionaire",
      "cultist",
      "toddler",
      "bounty_hunter",
      "miner",
      "dwarf",
      "king_midas",
      "gambler",
      "general_zaroff",
      "witch",
      "pirate",
      "ninja",
      "mrs._fruit",
      "mrs_fruit",
      "hooligan",
      "farmer",
      "diver",
      "dame",
      "chef",
      "card_shark",
      "beastmaster",
      "geologist",
      "joker",
      "comedian",
      "bartender",
    ].includes(currentSymbol.id)
  ) {
    return adjacentSymbols.some((s) => s?.id === "general_zaroff");
  }

  // Check for self-destroying items
  if (
    [
      "buffing_capsule",
      "chemical_seven",
      "essence_capsule",
      "hustling_capsule",
      "item_capsule",
      "lucky_capsule",
      "removal_capsule",
      "reroll_capsule",
      "tedium_capsule",
      "time_capsule",
      "wealthy_capsule",
    ].includes(currentSymbol.id)
  ) {
    return true;
  }

  // Check for void items that destroy themselves when not adjacent to Empty
  if (
    ["void_creature", "void_fruit", "void_stone"].includes(currentSymbol.id)
  ) {
    return !adjacentSymbols.some((s) => s?.id === "empty");
  }

  return false;
};

// Calculate dynamic delay based on animation type
export function calculateAnimationDelay(
  isEffect: boolean,
  isDestroy: boolean
): number {
  let delay = ANIMATION_DELAYS.BASE_DELAY;

  if (isEffect) {
    delay += ANIMATION_DELAYS.EFFECT_DURATION;
  }

  if (isDestroy) {
    delay += ANIMATION_DELAYS.DESTROY_DURATION;
  }

  return delay;
}

export function totalDelayUntilPos(
  effectResult: (effectResult | null)[],
  position: number
): number {
  return effectResult.slice(0, position).reduce((acc, effect) => {
    const hasEffectBonus =
      effect?.bonusValue !== undefined && effect.bonusValue > 0;
    const isDestroy = effect?.isDestroyed ?? false;

    if (hasEffectBonus || isDestroy) {
      return acc + calculateAnimationDelay(hasEffectBonus, isDestroy);
    }
    return acc;
  }, 0);
}

// Fisher-Yates shuffle algorithm
export function shuffleArray<T>(array: T[]): T[] {
  // Create a copy of the array to avoid modifying the original
  const shuffled = [...array];

  // Fisher-Yates shuffle algorithm
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

// Format number with commas
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Generate a random ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Delay function for animations
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
