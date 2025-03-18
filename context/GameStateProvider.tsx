"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
  useState,
} from "react";
import { getStartingSymbols } from "@/lib/gameLogic";
import { updateGridWithSymbols } from "@/lib/gameLogic";
import { effectResult, Symbol } from "@/types/game";

type RentSchedule = {
  rent: number;
  turns: number;
};

type GameState = {
  coins: number;
  baseCoins: number;
  bonusCoins: number;
  turn: number;
  isSpinning: boolean;
  grid: (Symbol | null)[];
  effectGrid: (effectResult | null)[];
  symbols: Symbol[];
  soundEnabled: boolean;
  floor: number;
  lost: boolean;
  rentSchedule: RentSchedule[];
  shopOpen: boolean;
  stageComplete: boolean;
  tutorialSeen: boolean;
};

type GameAction =
  | { type: "PAY_RENT" }
  | { type: "UPDATE_GRID"; payload: { grid: (Symbol | null)[]; symbols: Symbol[] } }
  | { type: "ADD_SYMBOL"; payload: Symbol }
  | { type: "STOP_SPIN_GRID" }
  | { type: "DECREASE_TURNS" }
  | { type: "TOGGLE_SOUND" }
  | { type: "RESET_GAME" }
  | { type: "LOAD_GAME"; payload: GameState }
  | { type: "START_SPIN_GRID" }
  | { type: "TOGGLE_SHOP" }
  | { type: "CLOSE_SHOP" }
  | { type: "SET_TUTORIAL_SEEN" }
  | { type: "START_GAME" }
  | { type: "UPDATE_EFFECT_GRID"; payload: (effectResult | null)[] }
  | { type: "ADD_COINS"; payload: { baseCoins: number; bonusCoins: number } }
  | { type: "CLOSE_COMPLETED_STAGE" }

const GameStateContext = createContext<
  | {
      state: GameState;
      dispatch: React.Dispatch<GameAction>;
    }
  | undefined
>(undefined);

// Get starting symbols
const startingSymbols = getStartingSymbols();

const initialState: GameState = {
  coins: 0,
  baseCoins: 0,
  bonusCoins: 0,
  turn: 0,
  isSpinning: false,
  grid: updateGridWithSymbols(startingSymbols),
  effectGrid: [],
  symbols: startingSymbols,
  soundEnabled: true,
  floor: 0,
  lost: false,
  shopOpen: false,
  stageComplete: false,
  tutorialSeen: false,
  rentSchedule: [
    { rent: 25, turns: 4 },
    { rent: 50, turns: 4 },
    { rent: 100, turns: 5 },
    { rent: 150, turns: 5 },
    { rent: 225, turns: 6 },
    { rent: 300, turns: 6 },
    { rent: 350, turns: 7 },
    { rent: 425, turns: 7 },
    { rent: 575, turns: 8 },
    { rent: 625, turns: 8 },
    { rent: 675, turns: 9 },
    { rent: 777, turns: 9 },
    { rent: 1000, turns: 9 },
    { rent: 1000, turns: 9 },
  ],
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "ADD_COINS":
      return {
        ...state,
        baseCoins: state.baseCoins + action.payload.baseCoins,
        bonusCoins: state.bonusCoins + action.payload.bonusCoins,
        coins:
          state.coins + action.payload.baseCoins + action.payload.bonusCoins,
      };
    case "SET_TUTORIAL_SEEN":
      return { ...state, tutorialSeen: true };

    case "PAY_RENT":
      return {
        ...state,
        coins: state.coins - state.rentSchedule[state.floor].rent,
        floor: state.floor + 1,
      };
    case "UPDATE_GRID":
      return { ...state, grid: action.payload.grid, symbols: action.payload.symbols };
    case "UPDATE_EFFECT_GRID":
      return { ...state, effectGrid: action.payload };
    case "START_SPIN_GRID":
      return {
        ...state,
        coins: state.coins > 0 ? state.coins - 1 : 0,
        isSpinning: true,
      };
    case "STOP_SPIN_GRID":
      return { ...state, isSpinning: false };
    case "ADD_SYMBOL":
      return { ...state, symbols: [...state.symbols, action.payload] };
    case "DECREASE_TURNS":
      if (state.turn === state.rentSchedule[state.floor].turns) {
        if (state.coins < state.rentSchedule[state.floor].rent) {
          return { ...state, lost: true };
        } else {
          return {
            ...state,
            coins: state.coins - state.rentSchedule[state.floor].rent,
            floor: state.floor + 1,
            turn: 0,
            shopOpen: true,
            stageComplete: true,
          };
        }
      }
      return { ...state, turn: state.turn + 1, shopOpen: true };
    case "TOGGLE_SOUND":
      return { ...state, soundEnabled: !state.soundEnabled };
    case "RESET_GAME":
      return { ...initialState, tutorialSeen: true };
    case "LOAD_GAME":
      return { ...action.payload };
    case "TOGGLE_SHOP":
      return { ...state, shopOpen: !state.shopOpen };
    case "CLOSE_SHOP":
      return { ...state, shopOpen: false };
    case "CLOSE_COMPLETED_STAGE":
      return { ...state, stageComplete: false, shopOpen: true };
    default:
      return state;
  }
}

export function GameStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [isLoading, setIsLoading] = useState(true);
  // Load saved game on mount
  useEffect(() => {
    // const savedGame = localStorage.getItem("landlordLuckSave");
    // if (savedGame) {
    //   dispatch({ type: "LOAD_GAME", payload: JSON.parse(savedGame) });
    // }
    setIsLoading(false);
  }, []);

  // Save game when state changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("landlordLuckSave", JSON.stringify(state));
    }
  }, [state, isLoading]);

  return (
    <GameStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error("useGameState must be used within a GameStateProvider");
  }
  return context;
}
