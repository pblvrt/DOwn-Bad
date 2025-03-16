"use client";

import { Symbol } from "@/types/game";
import styles from "@/styles/ShopItem.module.css";

type ShopItemProps = {
  symbol: Symbol;
  onPurchase: () => void;
};

export default function ShopItem({ symbol, onPurchase }: ShopItemProps) {
  // Get rarity label based on symbol value
  const getRarityLabel = (value: number) => {
    if (value >= 100) return "Legendary";
    if (value >= 50) return "Epic";
    if (value >= 25) return "Rare";
    if (value >= 10) return "Uncommon";
    return "Common";
  };

  // Get rarity color class based on symbol value
  const getRarityColorClass = (value: number) => {
    if (value >= 100) return styles.legendaryRarity;
    if (value >= 50) return styles.epicRarity;
    if (value >= 25) return styles.rareRarity;
    if (value >= 10) return styles.uncommonRarity;
    return styles.commonRarity;
  };

  const rarityLabel = getRarityLabel(symbol.value);
  const rarityColorClass = getRarityColorClass(symbol.value);

  return (
    <div className={`${styles.itemContainer} `} onClick={onPurchase}>
      <div className={styles.itemTitle}>{symbol.name}</div>

      <div className={styles.itemEmoji}>{symbol.emoji}</div>
      <div className={styles.valueContainer}>
        <div className={styles.valueLabel}>Value:</div>
        <div className={styles.coinIcon}>{symbol.value}</div>
      </div>
      <div className={`${styles.rarityLabel} ${rarityColorClass}`}>
        {rarityLabel}
      </div>
      {symbol.effectDescription && (
        <div className={styles.effectDescription}>{symbol.effectDescription}</div>
      )}
      {/* <div className={styles.addButtonContainer}>
        <button className={styles.addButton}>+</button>
      </div> */}
    </div>
  );
}
