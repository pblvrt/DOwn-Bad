import { Symbol } from "@/types/game";
import { symbolTypes } from "./symbols";
import { shuffleArray } from "./utils";
import { CELL_NUMBER } from "./constants";
export function updateGridWithSymbols(symbols: Symbol[]): (Symbol | null)[] {
  // Create a new grid
  const grid: (Symbol | null)[] = Array(CELL_NUMBER).fill(null);

  // Create a copy of the symbols array
  let symbolsToPlace = [...symbols];

  // If we have more than 20 symbols, randomly select 20
  if (symbolsToPlace.length > 20) {
    symbolsToPlace = shuffleArray(symbolsToPlace).slice(0, 20);
  }

  // Create an array of available positions (0-24)
  let availablePositions = Array.from({ length: CELL_NUMBER }, (_, i) => i);

  // Shuffle the positions
  availablePositions = shuffleArray(availablePositions);

  // Place symbols in random positions
  for (let i = 0; i < symbolsToPlace.length; i++) {
    const position = availablePositions[i];
    // Create a deep copy of the symbol to avoid reference issues
    grid[position] = JSON.parse(JSON.stringify(symbolsToPlace[i]));

    // Re-attach the effect function if it exists in the original symbol type
    if (symbolsToPlace[i].id) {
      const originalSymbol = symbolTypes.find(
        (s) => s.id === symbolsToPlace[i].id
      );
      if (originalSymbol && originalSymbol.effect) {
        grid[position]!.effect = originalSymbol.effect;
      }
    }
  }

  return grid;
}

export function spinGrid(grid: (Symbol | null)[], symbols: Symbol[]) {
  // Create a new grid with updated symbols
  const newGrid = updateGridWithSymbols(symbols);

  // Create a map to track original symbols by tempId
  const originalSymbolsByTempId = new Map<string, Symbol>();
  symbols.forEach((symbol) => {
    if (symbol.tempId) {
      originalSymbolsByTempId.set(symbol.tempId, symbol);
    }
  });

  // Update counters in the grid based on original symbols
  newGrid.forEach((symbol) => {
    if (symbol && symbol.tempId && originalSymbolsByTempId.has(symbol.tempId)) {
      const originalSymbol = originalSymbolsByTempId.get(symbol.tempId)!;
      if (originalSymbol.counter !== undefined) {
        symbol.counter = originalSymbol.counter + 1;
      }
    }
  });

  // Calculate base coins
  let baseCoins = 0;
  newGrid.forEach((symbol) => {
    if (symbol) {
      baseCoins += symbol.value;
    }
  });

  // Apply effects cell by cell
  let bonusCoins = 0;
  const effectGrid = Array(newGrid.length).fill(null);
  const symbolsToAdd: Symbol[] = [];
  const symbolsToDestroy = new Set<string>();

  // Process each cell in the grid
  for (let index = 0; index < newGrid.length; index++) {
    const symbol = newGrid[index];
    if (symbol && symbol.effect) {
      // Apply the effect
      const effectResult = symbol.effect(newGrid, index);
      effectGrid[index] = effectResult;

      // Calculate bonus value from multiplier if present
      const multiplierBonus = effectResult.multiplier
        ? effectResult.multiplier * (bonusCoins + symbol.value)
        : 0;

      // Update bonus values
      symbol.bonusValue = (effectResult.bonusValue || 0) + multiplierBonus;
      effectResult.bonusValue = symbol.bonusValue;

      // Add to total bonus coins
      bonusCoins += symbol.bonusValue;

      // Track symbols to add
      if (effectResult.add && effectResult.add.length > 0) {
        effectResult.add.forEach((addId) => {
          const addSymbol = symbolTypes.find((s) => s.id === addId);
          if (addSymbol) {
            symbolsToAdd.push({ ...addSymbol, tempId: crypto.randomUUID() });
          }
        });
      }

      // Track symbols to destroy
      if (effectResult.isDestroyed && symbol.tempId) {
        symbolsToDestroy.add(symbol.tempId);
      }
    }
  }

  // Update the original symbols array based on grid state
  const symbolsToKeep: Symbol[] = [];

  symbols.forEach((symbol) => {
    if (symbol.tempId) {
      // Check if this symbol should be destroyed
      if (symbolsToDestroy.has(symbol.tempId)) {
        return; // Skip this symbol
      }

      // Find this symbol in the grid to get updated values
      for (const gridSymbol of newGrid) {
        if (gridSymbol && gridSymbol.tempId === symbol.tempId) {
          // Copy updated values from grid symbol
          symbol.bonusValue = gridSymbol.bonusValue || 0;
          if (gridSymbol.counter !== undefined) {
            symbol.counter = gridSymbol.counter;
          }
          break;
        }
      }

      // If symbol wasn't in the grid this round, keep it as is
      symbolsToKeep.push(symbol);
    } else {
      // Symbol has no tempId, keep it
      symbolsToKeep.push(symbol);
    }
  });

  // Add new symbols
  symbolsToKeep.push(...symbolsToAdd);

  return {
    grid: newGrid,
    effectGrid,
    baseCoins,
    bonusCoins,
    symbols: symbolsToKeep,
  };
}

export function payRent(
  coins: number,
  rent: number,
  floor: number,
  rentSchedule: { rent: number; turns: number }[]
) {
  if (coins >= rent) {
    // Successful rent payment
    const newFloor = floor + 1;

    // Check if we've completed all floors
    if (newFloor > rentSchedule.length) {
      // Player has won the game!
      return {
        success: true,
        gameOver: true,
        victory: true,
        message: `Congratulations! You've completed all ${rentSchedule.length} floors and won the game!`,
        newFloor,
        newRent: 0,
        newTurns: 0,
        remainingCoins: coins - rent,
      };
    }

    // Set next rent and turns based on the schedule
    const nextRentInfo = rentSchedule[newFloor - 1];

    return {
      success: true,
      gameOver: false,
      victory: false,
      message: `You've advanced to floor ${newFloor}! Next rent: ${nextRentInfo.rent} coins in ${nextRentInfo.turns} spins.`,
      newFloor,
      newRent: nextRentInfo.rent,
      newTurns: nextRentInfo.turns,
      remainingCoins: coins - rent,
    };
  } else {
    // Game over - couldn't pay rent
    return {
      success: false,
      gameOver: true,
      victory: false,
      message: `Game Over! You couldn't pay the rent of ${rent} coins.`,
      newFloor: floor,
      newRent: rent,
      newTurns: 0,
      remainingCoins: coins,
    };
  }
}

// Get a random symbol based on rarity and game progression
export function getRandomSymbol(
  timeRentPaid: number = 0,
  forceRarity: string | null = null
): Symbol {
  // If forceRarity is provided, use that rarity
  if (forceRarity) {
    const pool = symbolTypes.filter((s) => s.rarity === forceRarity);

    // If pool is empty, fallback to common
    if (pool.length === 0) {
      const commonPool = symbolTypes.filter((s) => s.rarity === "common");
      const randomSymbol =
        commonPool[Math.floor(Math.random() * commonPool.length)];
      return JSON.parse(JSON.stringify(randomSymbol));
    }

    const randomSymbol = pool[Math.floor(Math.random() * pool.length)];
    return JSON.parse(JSON.stringify(randomSymbol));
  }

  // Roll for rarity
  const rarityRoll = Math.random();
  let veryRareChance, rareChance, uncommonChance;

  // Set probability thresholds based on times rent paid
  switch (true) {
    case timeRentPaid === 0:
      veryRareChance = 0.0;
      rareChance = 0.0;
      uncommonChance = 0.0;
      break;
    case timeRentPaid === 1:
      veryRareChance = 0.0;
      rareChance = 0.0;
      uncommonChance = 0.1;
      break;
    case timeRentPaid === 2:
      veryRareChance = 0.0;
      rareChance = 0.01;
      uncommonChance = 0.21; // 0.01 + 0.2
      break;
    case timeRentPaid === 3:
      veryRareChance = 0.0;
      rareChance = 0.01;
      uncommonChance = 0.26; // 0.01 + 0.25
      break;
    case timeRentPaid === 4:
      veryRareChance = 0.005;
      rareChance = 0.02; // 0.005 + 0.015
      uncommonChance = 0.31; // 0.005 + 0.015 + 0.29
      break;
    default: // 5+
      veryRareChance = 0.005;
      rareChance = 0.02; // 0.005 + 0.015
      uncommonChance = 0.32; // 0.005 + 0.015 + 0.3
      break;
  }

  let pool: Symbol[];

  if (rarityRoll < veryRareChance) {
    pool = symbolTypes.filter((s) => s.rarity === "very_rare");
  } else if (rarityRoll < rareChance) {
    pool = symbolTypes.filter((s) => s.rarity === "rare");
  } else if (rarityRoll < uncommonChance) {
    pool = symbolTypes.filter((s) => s.rarity === "uncommon");
  } else {
    pool = symbolTypes.filter((s) => s.rarity === "common");
  }

  // If pool is empty (shouldn't happen with proper setup), fallback to common
  if (pool.length === 0) {
    pool = symbolTypes.filter((s) => s.rarity === "common");
  }

  // Select a random symbol from the pool
  const randomSymbol = pool[Math.floor(Math.random() * pool.length)];
  return JSON.parse(JSON.stringify(randomSymbol));
}

// Get starting symbols for a new game
export function getStartingSymbols(): Symbol[] {
  return [
    {
      ...JSON.parse(JSON.stringify(symbolTypes.find((s) => s.id === "flower"))),
      tempId: crypto.randomUUID(),
    },
    {
      ...JSON.parse(JSON.stringify(symbolTypes.find((s) => s.id === "cat"))),
      tempId: crypto.randomUUID(),
    },
    {
      ...JSON.parse(
        JSON.stringify(symbolTypes.find((s) => s.id === "buffing_capsule"))
      ),
      tempId: crypto.randomUUID(),
    },
    {
      ...JSON.parse(
        JSON.stringify(symbolTypes.find((s) => s.id === "buffing_capsule"))
      ),
      tempId: crypto.randomUUID(),
    },
    {
      ...JSON.parse(
        JSON.stringify(symbolTypes.find((s) => s.id === "buffing_capsule"))
      ),
      tempId: crypto.randomUUID(),
    },
    {
      ...JSON.parse(
        JSON.stringify(symbolTypes.find((s) => s.id === "buffing_capsule"))
      ),
      tempId: crypto.randomUUID(),
    },
    {
      ...JSON.parse(
        JSON.stringify(symbolTypes.find((s) => s.id === "buffing_capsule"))
      ),
      tempId: crypto.randomUUID(),
    },
    {
      ...JSON.parse(
        JSON.stringify(symbolTypes.find((s) => s.id === "buffing_capsule"))
      ),
      tempId: crypto.randomUUID(),
    },
    {
      ...JSON.parse(
        JSON.stringify(symbolTypes.find((s) => s.id === "buffing_capsule"))
      ),
      tempId: crypto.randomUUID(),
    },
    {
      ...JSON.parse(
        JSON.stringify(symbolTypes.find((s) => s.id === "buffing_capsule"))
      ),
      tempId: crypto.randomUUID(),
    },
    {
      ...JSON.parse(
        JSON.stringify(symbolTypes.find((s) => s.id === "buffing_capsule"))
      ),
      tempId: crypto.randomUUID(),
    },
    {
      ...JSON.parse(
        JSON.stringify(symbolTypes.find((s) => s.id === "buffing_capsule"))
      ),
      tempId: crypto.randomUUID(),
    },
  ].filter(Boolean) as Symbol[];
}

// Add a new symbol to the game
export function addSymbolToCollection(
  symbols: Symbol[],
  newSymbol: Symbol
): Symbol[] {
  return [...symbols, JSON.parse(JSON.stringify(newSymbol))];
}

// Get all symbols of a specific rarity
export function getSymbolsByRarity(
  rarity: "common" | "uncommon" | "rare" | "very_rare" | "special"
): Symbol[] {
  return symbolTypes
    .filter((s) => s.rarity === rarity)
    .map((s) => JSON.parse(JSON.stringify(s)));
}

// Get a symbol by ID
export function getSymbolById(id: string): Symbol | undefined {
  const symbol = symbolTypes.find((s) => s.id === id);
  return symbol ? JSON.parse(JSON.stringify(symbol)) : undefined;
}
