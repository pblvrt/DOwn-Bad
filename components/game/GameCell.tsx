"use client";

import { Symbol } from "@/types/game";
import styles from "./GameCell.module.css";

type GameCellProps = {
  index: number;
  symbol: Symbol | null;
};

export default function GameCell({ symbol }: GameCellProps) {
  if (!symbol) {
    return (
      <div className={`${styles.cellContainer} ${styles.cellEmpty}`}></div>
    );
  }

  const rarityStyles = {
    common: styles.cellCommon,
    uncommon: styles.cellUncommon,
    rare: styles.cellRare,
  };

  return (
    <div className={`${styles.cellContainer} ${rarityStyles[symbol.rarity]}`}>
      <div className={styles.symbolEmoji}>{symbol.emoji}</div>

      {/* Tooltip */}
      <div className={styles.tooltip}>
        <div className={styles.tooltipTitle}>{symbol.name}</div>
        <div className={styles.tooltipValue}>Value: {symbol.value} coins</div>
        {symbol.effectDescription && (
          <div className={styles.tooltipEffect}>
            Effect: {symbol.effectDescription}
          </div>
        )}
        {symbol.bonusValue && symbol.bonusValue > 0 && (
          <div className={styles.tooltipBonus}>Bonus: +{symbol.bonusValue}</div>
        )}
      </div>
    </div>
  );
}
