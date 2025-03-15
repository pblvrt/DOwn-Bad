'use client';

import { useGameState } from '@/context/GameStateProvider';
import { spinGrid } from '@/lib/gameLogic';

type SpinButtonProps = {
  onSpin: () => void;
};

export default function SpinButton({ onSpin }: SpinButtonProps) {
  const { state, dispatch } = useGameState();
  
  const handleSpin = () => {
    // Play spin sound
    const audio = document.getElementById('spin-sound') as HTMLAudioElement;
    if (state.soundEnabled && audio) {
      audio.currentTime = 0;
      audio.play().catch(e => console.log("Error playing sound:", e));
    }
    
    // Add spinning animation class to grid
    const gridElement = document.querySelector('.game-grid');
    if (gridElement) {
      gridElement.classList.add('animate-spin-grid');
      setTimeout(() => {
        gridElement.classList.remove('animate-spin-grid');
      }, 500);
    }
    
    // Calculate rewards and update state
    const { baseCoins, bonusCoins } = spinGrid(state.grid, state.symbols);
    
    // Update coins
    dispatch({ type: 'ADD_COINS', payload: baseCoins + bonusCoins });
    
    // Decrease turns until rent
    dispatch({ type: 'DECREASE_TURNS' });
    
    // Show shop after spin
    onSpin();
  };
  
  return (
    <button 
      onClick={handleSpin}
      className="bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-3 rounded-full 
                text-xl font-bold shadow-lg hover:from-amber-600 hover:to-amber-700 
                transition-colors transform hover:scale-105 active:scale-95"
    >
      SPIN
    </button>
  );
}