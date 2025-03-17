import { Symbol } from "@/types/game";
import { symbolTypes } from "./symbols";
import { shuffleArray } from "./utils";

export function updateGridWithSymbols(symbols: Symbol[]): (Symbol | null)[] {
  // Create a new grid
  const grid: (Symbol | null)[] = Array(25).fill(null);

  // Create a copy of the symbols array
  let symbolsToPlace = [...symbols];

  // If we have more than 20 symbols, randomly select 20
  if (symbolsToPlace.length > 20) {
    symbolsToPlace = shuffleArray(symbolsToPlace).slice(0, 20);
  }

  // Create an array of available positions (0-24)
  let availablePositions = Array.from({ length: 25 }, (_, i) => i);

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
  console.log("spinGrid", symbols);
  // Create a new grid with updated symbols
  const newGrid = updateGridWithSymbols(symbols);


  // Calculate base coins from symbols
  let baseCoins = 0;
  newGrid.forEach((symbol) => {
    if (symbol) {
      baseCoins += symbol.value;
    }
  });

  // Apply special effects
  let bonusCoins = 0;
  const newEffectGrid = newGrid.map((symbol, index) => {
    if (symbol && symbol.effect) {
      const effectResult = symbol.effect(newGrid, index);
      bonusCoins += effectResult.bonusValue;

      // Update the symbol in the newGrid directly
      if (symbol) {
        symbol.bonusValue = effectResult.bonusValue;
      }

      return effectResult;
    }
    return null;
  });

  // Update the original symbols array with values from newGrid
  // Create a map for faster lookup
  const gridSymbolsMap = new Map();
  newGrid.forEach((symbol) => {
    if (symbol && symbol.tempId) {
      gridSymbolsMap.set(symbol.tempId, symbol);
    }
  });

  // Update original symbols with data from the grid and track symbols to remove
  const symbolsToKeep: Symbol[] = [];
  symbols.forEach((symbol) => {
    const gridSymbol = gridSymbolsMap.get(symbol.tempId);
    if (gridSymbol) {
      symbol.bonusValue = gridSymbol.bonusValue || 0;

      // Increment counter if it exists
      if (symbol.counter !== undefined) {
        symbol.counter += 1;
      }

      // Instead of looking for effect.symbol, find the index of this symbol in the grid
      // and check if there's a destruction effect at that index
      let shouldDestroy = false;
      newGrid.forEach((gridItem, gridIndex) => {
        if (gridItem && gridItem.tempId === symbol.tempId) {
          const effect = newEffectGrid[gridIndex];
          if (effect && effect.isDestroyed) {
            shouldDestroy = true;
          }
        }
      });

      if (!shouldDestroy) {
        symbolsToKeep.push(symbol);
      }
    } else {
      // If not found in grid, keep it (it wasn't placed this round)
      symbolsToKeep.push(symbol);
    }
  });

  return {
    grid: newGrid,
    effectGrid: newEffectGrid,
    baseCoins,
    bonusCoins,
    symbols: symbolsToKeep, // Return filtered symbols array
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
