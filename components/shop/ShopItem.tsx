'use client';

import { Symbol } from '@/types/game';

type ShopItemProps = {
  symbol: Symbol;
  onPurchase: () => void;
};

export default function ShopItem({ symbol, onPurchase }: ShopItemProps) {
  const rarityClasses = {
    common: 'bg-slate-600 border-slate-500',
    uncommon: 'bg-blue-600 border-blue-500',
    rare: 'bg-purple-600 border-purple-500'
  };
  
  return (
    <div 
      className={`${rarityClasses[symbol.rarity]} border-2 rounded-md p-3 flex flex-col items-center cursor-pointer hover:scale-105 transition-transform`}
      onClick={onPurchase}
    >
      <div className="text-3xl mb-2">{symbol.emoji}</div>
      <div className="font-bold text-sm">{symbol.name}</div>
      <div className="text-xs">Value: {symbol.value}</div>
      {symbol.effectDescription && (
        <div className="text-yellow-300 text-xs mt-1 italic text-center">
          {symbol.effectDescription}
        </div>
      )}
    </div>
  );
}