import { Symbol } from '@/types/game';
import { getAdjacentIndices } from './utils';

// Symbol definitions
export const symbolTypes: Symbol[] = [
  { 
    id: 'cherry', 
    name: 'Cherry', 
    value: 1, 
    rarity: 'common', 
    emoji: '🍒' 
  },
  { 
    id: 'banana', 
    name: 'Banana', 
    value: 2, 
    rarity: 'common', 
    emoji: '🍌' 
  },
  { 
    id: 'apple', 
    name: 'Apple', 
    value: 2, 
    rarity: 'common', 
    emoji: '🍎' 
  },
  { 
    id: 'orange', 
    name: 'Orange', 
    value: 2, 
    rarity: 'common', 
    emoji: '🍊' 
  },
  { 
    id: 'grapes', 
    name: 'Grapes', 
    value: 3, 
    rarity: 'uncommon', 
    emoji: '🍇' 
  },
  { 
    id: 'watermelon', 
    name: 'Watermelon', 
    value: 4, 
    rarity: 'uncommon', 
    emoji: '🍉' 
  },
  { 
    id: 'diamond', 
    name: 'Diamond', 
    value: 10, 
    rarity: 'rare', 
    emoji: '💎' 
  },
  { 
    id: 'cat', 
    name: 'Cat', 
    value: 5, 
    rarity: 'uncommon', 
    emoji: '🐱' 
  },
  { 
    id: 'dog', 
    name: 'Dog', 
    value: 5, 
    rarity: 'uncommon', 
    emoji: '🐶' 
  },
  { 
    id: 'farmer', 
    name: 'Farmer', 
    value: 3, 
    rarity: 'uncommon', 
    emoji: '👨‍🌾', 
    effectDescription: 'Gives +1 to adjacent fruits',
    effect: function(grid: (Symbol | null)[], index: number): number {
      // Farmer gives +1 to adjacent fruits
      const adjacentIndices = getAdjacentIndices(index);
      let bonusValue = 0;
      
      adjacentIndices.forEach(adjIndex => {
        const adjSymbol = grid[adjIndex];
        if (adjSymbol && ['cherry', 'banana', 'apple', 'orange', 'grapes', 'watermelon'].includes(adjSymbol.id)) {
          adjSymbol.bonusValue = (adjSymbol.bonusValue || 0) + 1;
          bonusValue += 1;
        }
      });
      
      return bonusValue;
    }
  },
  { 
    id: 'mine', 
    name: 'Mine', 
    value: 2, 
    rarity: 'uncommon', 
    emoji: '⛏️',
    effectDescription: 'Gives +5 to adjacent diamonds',
    effect: function(grid: (Symbol | null)[], index: number): number {
      // Mine gives +5 to adjacent diamonds
      const adjacentIndices = getAdjacentIndices(index);
      let bonusValue = 0;
      
      adjacentIndices.forEach(adjIndex => {
        const adjSymbol = grid[adjIndex];
        if (adjSymbol && adjSymbol.id === 'diamond') {
          adjSymbol.bonusValue = (adjSymbol.bonusValue || 0) + 5;
          bonusValue += 5;
        }
      });
      
      return bonusValue;
    }
  },
  { 
    id: 'sun', 
    name: 'Sun', 
    value: 3, 
    rarity: 'rare', 
    emoji: '☀️',
    effectDescription: 'Gives +2 to all fruits',
    effect: function(grid: (Symbol | null)[]): number {
      // Sun gives +2 to all fruits
      let bonusValue = 0;
      
      grid.forEach((symbol) => {
        if (symbol && ['cherry', 'banana', 'apple', 'orange', 'grapes', 'watermelon'].includes(symbol.id)) {
          symbol.bonusValue = (symbol.bonusValue || 0) + 2;
          bonusValue += 2;
        }
      });
      
      return bonusValue;
    }
  }
];

// Get a random symbol based on rarity
export function getRandomSymbol(): Symbol {
  // Simple rarity system
  const rarityRoll = Math.random();
  let pool: Symbol[];
  
  if (rarityRoll < 0.1) {
    pool = symbolTypes.filter(s => s.rarity === 'rare');
  } else if (rarityRoll < 0.4) {
    pool = symbolTypes.filter(s => s.rarity === 'uncommon');
  } else {
    pool = symbolTypes.filter(s => s.rarity === 'common');
  }
  
  // Deep clone the symbol to avoid reference issues
  const randomSymbol = pool[Math.floor(Math.random() * pool.length)];
  return JSON.parse(JSON.stringify(randomSymbol));
}

// Get starting symbols for a new game
export function getStartingSymbols(): Symbol[] {
  return [
    JSON.parse(JSON.stringify(symbolTypes.find(s => s.id === 'cherry'))),
    JSON.parse(JSON.stringify(symbolTypes.find(s => s.id === 'cherry'))),
    JSON.parse(JSON.stringify(symbolTypes.find(s => s.id === 'banana'))),
    JSON.parse(JSON.stringify(symbolTypes.find(s => s.id === 'apple'))),
    JSON.parse(JSON.stringify(symbolTypes.find(s => s.id === 'orange')))
  ].filter(Boolean) as Symbol[];
}

// Add a new symbol to the game
export function addSymbolToCollection(symbols: Symbol[], newSymbol: Symbol): Symbol[] {
  return [...symbols, JSON.parse(JSON.stringify(newSymbol))];
}

// Get all symbols of a specific rarity
export function getSymbolsByRarity(rarity: 'common' | 'uncommon' | 'rare'): Symbol[] {
  return symbolTypes.filter(s => s.rarity === rarity).map(s => JSON.parse(JSON.stringify(s)));
}

// Get a symbol by ID
export function getSymbolById(id: string): Symbol | undefined {
  const symbol = symbolTypes.find(s => s.id === id);
  return symbol ? JSON.parse(JSON.stringify(symbol)) : undefined;
}

// Check if a symbol is a fruit
export function isFruit(symbolId: string): boolean {
  return ['cherry', 'banana', 'apple', 'orange', 'grapes', 'watermelon'].includes(symbolId);
}