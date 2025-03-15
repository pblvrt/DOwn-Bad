'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// Define types
type Symbol = {
  id: string;
  name: string;
  value: number;
  rarity: 'common' | 'uncommon' | 'rare';
  emoji: string;
  effectDescription?: string;
  bonusValue?: number;
  effect?: (grid: (Symbol | null)[], index: number) => number;
};

type RentSchedule = {
  rent: number;
  turns: number;
};

type GameState = {
  coins: number;
  rent: number;
  turnsUntilRent: number;
  grid: (Symbol | null)[];
  symbols: Symbol[];
  soundEnabled: boolean;
  floor: number;
  rentSchedule: RentSchedule[];
};

type GameAction = 
  | { type: 'ADD_COINS'; payload: number }
  | { type: 'PAY_RENT' }
  | { type: 'UPDATE_GRID'; payload: (Symbol | null)[] }
  | { type: 'ADD_SYMBOL'; payload: Symbol }
  | { type: 'DECREASE_TURNS' }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'RESET_GAME' }
  | { type: 'LOAD_GAME'; payload: GameState };

const GameStateContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | undefined>(undefined);

const initialState: GameState = {
  coins: 0,
  rent: 25,
  turnsUntilRent: 5,
  grid: Array(25).fill(null),
  symbols: [],
  soundEnabled: true,
  floor: 1,
  rentSchedule: [
    { rent: 25, turns: 5 },
    { rent: 50, turns: 5 },
    // ...rest of schedule
  ]
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ADD_COINS':
      return { ...state, coins: state.coins + action.payload };
    case 'PAY_RENT':
      return { 
        ...state, 
        coins: state.coins - state.rent,
        floor: state.floor + 1,
        rent: state.rentSchedule[state.floor].rent,
        turnsUntilRent: state.rentSchedule[state.floor].turns
      };
    case 'UPDATE_GRID':
      return { ...state, grid: action.payload };
    case 'ADD_SYMBOL':
      return { ...state, symbols: [...state.symbols, action.payload] };
    case 'DECREASE_TURNS':
      return { ...state, turnsUntilRent: state.turnsUntilRent - 1 };
    case 'TOGGLE_SOUND':
      return { ...state, soundEnabled: !state.soundEnabled };
    case 'RESET_GAME':
      return initialState;
    case 'LOAD_GAME':
      return { ...action.payload };
    default:
      return state;
  }
}

export function GameStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Load saved game on mount
  useEffect(() => {
    const savedGame = localStorage.getItem('landlordLuckSave');
    if (savedGame) {
      dispatch({ type: 'LOAD_GAME', payload: JSON.parse(savedGame) });
    }
  }, []);

  // Save game when state changes
  useEffect(() => {
    localStorage.setItem('landlordLuckSave', JSON.stringify(state));
  }, [state]);

  return (
    <GameStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
}