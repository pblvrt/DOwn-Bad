'use client';

import { useGameState } from '@/context/GameStateProvider';
import GameCell from './GameCell';
import { useEffect } from 'react';
import { updateGridWithSymbols } from '@/lib/gameLogic';

export default function GameBoard() {
  const { state, dispatch } = useGameState();
  
  useEffect(() => {
    // Initialize grid with symbols on first load
    if (state.symbols.length > 0 && state.grid.every(cell => cell === null)) {
      const newGrid = updateGridWithSymbols(state.symbols);
      dispatch({ type: 'UPDATE_GRID', payload: newGrid });
    }
  }, [state.symbols, state.grid, dispatch]);
  
  return (
    <div className="game-grid grid grid-cols-5 gap-1 bg-slate-800 p-2 rounded-lg">
      {state.grid.map((cell, index) => (
        <GameCell 
          key={index} 
          index={index} 
          symbol={cell} 
        />
      ))}
    </div>
  );
}