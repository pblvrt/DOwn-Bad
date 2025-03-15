'use client';

import { useGameState } from '@/context/GameStateProvider';

export default function Header() {
  const { state, dispatch } = useGameState();
  
  const toggleSound = () => {
    dispatch({ type: 'TOGGLE_SOUND' });
  };
  
  return (
    <div className="bg-slate-700 p-4 rounded-lg mb-4 shadow-md">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold">Landlord Luck</h1>
        <button 
          onClick={toggleSound}
          className="p-2 rounded-full hover:bg-slate-600 transition-colors"
        >
          {state.soundEnabled ? '🔊' : '🔇'}
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-amber-600 p-2 rounded">
          <div className="text-xs uppercase font-bold opacity-80">Coins</div>
          <div className="text-xl font-bold" id="coin-count">{state.coins}</div>
        </div>
        
        <div className="bg-red-600 p-2 rounded">
          <div className="text-xs uppercase font-bold opacity-80">Rent</div>
          <div className="text-xl font-bold">{state.rent}</div>
        </div>
        
        <div className="bg-blue-600 p-2 rounded">
          <div className="text-xs uppercase font-bold opacity-80">Turns</div>
          <div className="text-xl font-bold">{state.turnsUntilRent}</div>
        </div>
      </div>
      
      <div className="flex justify-between mt-2 text-sm">
        <div>Floor: {state.floor}</div>
        <div>Symbols: {state.symbols.length}</div>
      </div>
    </div>
  );
}