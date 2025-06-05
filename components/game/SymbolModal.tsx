import React from "react";
import { Symbol } from "@/types/game";
import styles from "@/styles/SymbolModal.module.css";
import Modal from "@/components/ui/Modal";
import ParseDescription from "@/components/game/ParseDescription";
interface SymbolModalProps {
  symbol: Symbol | null;
  onClose: () => void;
  isOpen: boolean;
}


const SymbolModal: React.FC<SymbolModalProps> = ({
  symbol,
  onClose,
  isOpen,
}) => {
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
    <Modal
      title={symbol.name}
      isOpen={isOpen}
      onClose={onClose}
      className={getRarityClass()}
    >
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
        {symbol.counter !== undefined && (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Counter:</span>
            <span className={styles.detailValue}>{symbol.counter}</span>
          </div>
        )}

        {symbol.effectDescription && (
          <div className={styles.effectBox}>
            <h3 className={styles.effectTitle}>Special Effect</h3>
            <div className={styles.effectDescription}>
              <ParseDescription description={symbol.effectDescription} />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SymbolModal;
