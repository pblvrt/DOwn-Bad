"use client";

import { Symbol } from "@/types/game";
import styles from "@/styles/ShopItem.module.css";
import ParseDescription from "../game/ParseDescription";

type ShopItemProps = {
  symbol: Symbol;
  onPurchase: () => void;
};

export default function ShopItem({ symbol, onPurchase }: ShopItemProps) {
  // Get rarity label based on symbol rarity
  const getRarityLabel = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case "legendary":
        return "Legendary";
      case "epic":
        return "Epic";
      case "rare":
        return "Rare";
      case "uncommon":
        return "Uncommon";
      default:
        return "Common";
    }
  };

  // Get rarity color class based on symbol rarity
  const getRarityColorClass = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case "legendary":
        return styles.legendaryRarity;
      case "epic":
        return styles.epicRarity;
      case "rare":
        return styles.rareRarity;
      case "uncommon":
        return styles.uncommonRarity;
      default:
        return styles.commonRarity;
    }
  };

  const rarityLabel = getRarityLabel(symbol.rarity);
  const rarityColorClass = getRarityColorClass(symbol.rarity);

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
        <div className={styles.effectDescription}>
          <ParseDescription description={symbol.effectDescription} />
        </div>
      )}
      {/* <div className={styles.addButtonContainer}>
        <button className={styles.addButton}>+</button>
      </div> */}
    </div>
  );
}
