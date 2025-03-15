'use client';

import { useGameState } from '@/context/GameStateProvider';
import { getRandomSymbol } from '@/lib/symbols';
import ShopItem from './ShopItem';
import { useEffect, useState } from 'react';
import { Symbol } from '@/types/game';

type ShopProps = {
  onClose: () => void;
};

export default function Shop({ onClose }: ShopProps) {
  const { state, dispatch } = useGameState();
  const [shopItems, setShopItems] = useState<Symbol[]>([]);
  
  useEffect(() => {
    // Generate 3 random symbols for the shop
    setShopItems([
      getRandomSymbol(),
      getRandomSymbol(),
      getRandomSymbol()
    ]);
  }, []);
  
  const handlePurchase = (symbol: Symbol) => {
    // Add the symbol to the player's collection
    dispatch({ type: 'ADD_SYMBOL', payload: symbol });
    
    // Play purchase sound
    const audio = document.getElementById('purchase-sound') as HTMLAudioElement;
    if (state.soundEnabled && audio) {
      audio.currentTime = 0;
      audio.play().catch(e => console.log("Error playing sound:", e));
    }
    
    // Close the shop
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-slate-800 p-6 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Symbol Shop</h2>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          {shopItems.map((item, index) => (
            <ShopItem 
              key={index} 
              symbol={item} 
              onPurchase={() => handlePurchase(item)} 
            />
          ))}
        </div>
        
        <div className="flex justify-center">
          <button 
            onClick={onClose}
            className="bg-slate-600 hover:bg-slate-700 px-6 py-2 rounded-md transition-colors"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}