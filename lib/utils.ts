import { ANIMATION_DELAYS } from "@/hooks/useAnimationTimers";
import { effectResult, Symbol } from "@/types/game";

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

export function adjacentSymbolMoneyModifier(
  grid: (Symbol | null)[],
  index: number,
  type: Symbol["type"]
): number {
  const adjacentSymbols = getAdjacentSymbols(grid, index);
  const currentSymbol = grid[index];
  let moneyModifier = 0;
  if (adjacentSymbols.some((s) => s?.id === "buffing_capsule")) {
    moneyModifier += 2;
  }

  if (type === "food" && adjacentSymbols.some((s) => s?.id === "chef")) {
    moneyModifier += 2;
  }

  if (type === "food" && adjacentSymbols.some((s) => s?.id === "farmer")) {
    moneyModifier += 2;
  }

  if (
    ["banana", "banana_peel", "dog", "monkey", "toddler", "joker"].includes(
      currentSymbol?.id || ""
    ) &&
    adjacentSymbols.some((s) => s?.id === "comedian")
  ) {
    moneyModifier += 3;
  }

  return moneyModifier;
}

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
