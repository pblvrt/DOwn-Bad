import React from "react";
import { Symbol } from "@/types/game";
import SymbolComponent from "@/components/game/Symbol";
import styles from "@/styles/SymbolModal.module.css";
import Modal from "@/components/ui/Modal";
import { symbolTypes } from "@/lib/symbols";

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

  const modifyDescription = (description: string) => {
    if (!description) return null;

    const result = [];
    let currentIndex = 0;
    let lastIndex = 0;

    const regex = /<([^>]*)>/g;
    let match;

    while ((match = regex.exec(description)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        result.push(description.substring(lastIndex, match.index));
      }

      // Add the symbol component
      const symbolId = match[1];
      const symbolType = symbolTypes.find((s) => s.id === symbolId);

      if (symbolType) {
        result.push(
          <SymbolComponent key={currentIndex++} symbol={symbolType} />
        );
      } else {
        result.push(match[0]);
      }

      lastIndex = regex.lastIndex;
    }

    // Add any remaining text
    if (lastIndex < description.length) {
      result.push(description.substring(lastIndex));
    }

    return result;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className={getRarityClass()}>
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
              {modifyDescription(symbol.effectDescription)}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SymbolModal;
