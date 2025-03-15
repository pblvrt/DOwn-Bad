'use client';

import { Symbol } from '@/types/game';

type GameCellProps = {
  index: number;
  symbol: Symbol | null;
};

export default function GameCell({  symbol }: GameCellProps) {
  if (!symbol) {
    return <div className="w-16 h-16 bg-slate-700 rounded-md m-1"></div>;
  }
  
  const rarityClasses = {
    common: 'bg-slate-600',
    uncommon: 'bg-blue-600',
    rare: 'bg-purple-600'
  };
  
  return (
    <div className={`w-16 h-16 ${rarityClasses[symbol.rarity]} rounded-md m-1 relative flex items-center justify-center group`}>
      <div className="text-3xl">{symbol.emoji}</div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black/80 p-2 rounded w-40 
                     invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity z-10 text-xs">
        <div className="font-bold">{symbol.name}</div>
        <div>Value: {symbol.value} coins</div>
        {symbol.effectDescription && (
          <div className="text-yellow-300 italic">Effect: {symbol.effectDescription}</div>
        )}
        {symbol.bonusValue && symbol.bonusValue > 0 && (
          <div className="text-green-300">Bonus: +{symbol.bonusValue}</div>
        )}
      </div>
    </div>
  );
}