"use client";

import { Symbol } from "@/types/game";
import styles from "@/styles/ShopItem.module.css";

type ShopItemProps = {
  symbol: Symbol;
  onPurchase: () => void;
};

export default function ShopItem({ symbol, onPurchase }: ShopItemProps) {
  const rarityClasses = {
    common: styles.itemCommon,
    uncommon: styles.itemUncommon,
    rare: styles.itemRare,
  };

  return (
    <div
      className={`${styles.itemContainer} ${rarityClasses[symbol.rarity]}`}
      onClick={onPurchase}
    >
      <div className={styles.itemEmoji}>{symbol.emoji}</div>
      <div className={styles.itemName}>{symbol.name}</div>
      <div className={styles.itemValue}>Value: {symbol.value}</div>
      {symbol.effectDescription && (
        <div className={styles.itemEffect}>{symbol.effectDescription}</div>
      )}
    </div>
  );
}
