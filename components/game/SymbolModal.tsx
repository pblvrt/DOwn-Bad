import React from "react";
import { Symbol } from "@/types/game";
import styles from "@/styles/SymbolModal.module.css";

interface SymbolModalProps {
  symbol: Symbol | null;
  onClose: () => void;
}

const SymbolModal: React.FC<SymbolModalProps> = ({ symbol, onClose }) => {
  if (!symbol) return null;

  const getRarityClass = () => {
    switch (symbol.rarity) {
      case "common":
        return styles.common;
      case "uncommon":
        return styles.uncommon;
      case "rare":
        return styles.rare;
      default:
        return "";
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={`${styles.modalContent} ${getRarityClass()}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        <div className={styles.symbolHeader}>
          <div className={styles.symbolEmoji}>{symbol.emoji}</div>
          <h2 className={styles.symbolName}>{symbol.name}</h2>
          <div className={styles.rarityBadge}>{symbol.rarity}</div>
        </div>

        <div className={styles.symbolDetails}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Base Value:</span>
            <span className={styles.detailValue}>{symbol.value} 🪙</span>
          </div>

          {symbol.bonusValue !== undefined && (
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Bonus Value:</span>
              <span className={styles.bonusValue}>+{symbol.bonusValue} 🪙</span>
            </div>
          )}

          {symbol.effectDescription && (
            <div className={styles.effectBox}>
              <h3 className={styles.effectTitle}>Special Effect</h3>
              <p className={styles.effectDescription}>
                {symbol.effectDescription}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SymbolModal;
