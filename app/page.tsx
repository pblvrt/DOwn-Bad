'use client';

import { useState } from 'react';
import { GameStateProvider } from '@/context/GameStateProvider';
import GameBoard from '@/components/game/GameBoard';
import Header from '@/components/ui/Header';
import SpinButton from '@/components/game/SpinButton';
import Shop from '@/components/shop/Shop';

export default function Home() {
  const [showShop, setShowShop] = useState(false);
  
  return (
    <GameStateProvider>
      <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-slate-800 to-slate-900 text-white p-4">
        <div className="w-full max-w-md">
          <Header />
          <GameBoard />
          
          <div className="mt-4 flex justify-center">
            {!showShop && <SpinButton onSpin={() => setShowShop(true)} />}
          </div>
          
          {showShop && (
            <Shop onClose={() => setShowShop(false)} />
          )}
          
          {/* Audio elements */}
          <audio id="spin-sound" src="/sounds/spin.mp3" preload="auto"></audio>
          <audio id="coin-sound" src="/sounds/coin.mp3" preload="auto"></audio>
          <audio id="purchase-sound" src="/sounds/purchase.mp3" preload="auto"></audio>
          <audio id="rent-sound" src="/sounds/rent.mp3" preload="auto"></audio>
          <audio id="gameover-sound" src="/sounds/gameover.mp3" preload="auto"></audio>
        </div>
      </div>
    </GameStateProvider>
  );
}