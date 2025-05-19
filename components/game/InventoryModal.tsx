"use client";

import { useState } from "react";
import { useGameState } from "@/context/GameStateProvider";
import { useAudio } from "@/context/AudioProvider";
import Modal from "@/components/ui/Modal";
import Symbol from "@/components/game/Symbol";
import styles from "@/styles/InventoryModal.module.css";

type InventoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function InventoryModal({
  isOpen,
  onClose,
}: InventoryModalProps) {
  const { state, dispatch } = useGameState();
  const { playSound } = useAudio();
  const [isRemoveMode, setIsRemoveMode] = useState(false);
  const [selectedSymbolId, setSelectedSymbolId] = useState<string | null>(null);

  // Group symbols by ID to count duplicates
  const symbolCounts = state.symbols.reduce((acc, symbol) => {
    if (!symbol.id) return acc;

    if (!acc[symbol.id]) {
      acc[symbol.id] = {
        symbol,
        count: 1,
      };
    } else {
      acc[symbol.id].count++;
    }
    return acc;
  }, {} as Record<string, { symbol: (typeof state.symbols)[0]; count: number }>);

  const handleToggleRemoveMode = () => {
    setIsRemoveMode(!isRemoveMode);
    setSelectedSymbolId(null);
    playSound("click");
  };

  const handleSelectSymbol = (tempId: string) => {
    if (!isRemoveMode) return;
    setSelectedSymbolId(tempId === selectedSymbolId ? null : tempId);
  };

  const handleRemoveSymbol = () => {
    if (selectedSymbolId && state.removeTokens > 0) {
      dispatch({
        type: "REMOVE_SYMBOL",
        payload: { symbolId: selectedSymbolId },
      });
      dispatch({ type: "USE_REMOVE_TOKEN" });
      playSound("remove");
      setSelectedSymbolId(null);
    }
  };

  const symbolCount = state.symbols.length;
  const maxSymbols = 208; // You can adjust this based on your game rules

  return (
    <Modal title="inventory" isOpen={isOpen} onClose={onClose} className={styles.inventoryModal}>
      <div className={styles.modalContent}>


        {!isRemoveMode && (
          <div className={styles.statsBar}>
            <div className={styles.symbolCountContainer}>
              <span className={styles.infoIcon}>ℹ️</span>
              <span className={styles.statsLabel}>Symbol count:</span>
              <span className={styles.statsValue}>{symbolCount}</span>
            </div>

            <div className={styles.deckSizeContainer}>
              <span className={styles.deckIcon}>🃏</span>
              <span className={styles.statsValue}>
                {symbolCount}/{maxSymbols}
              </span>
            </div>
          </div>
        )}

        {isRemoveMode ? (
          <div className={styles.symbolsGrid}>
            {state.symbols.map((symbol) => (
              <div
                key={symbol.tempId}
                className={`${styles.symbolItem} ${
                  selectedSymbolId === symbol.tempId ? styles.selected : ""
                }`}
                onClick={() => handleSelectSymbol(symbol.tempId || "")}
              >
                <Symbol symbol={symbol} />
                <div className={styles.symbolName}>{symbol.name}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.symbolsGrid}>
            {Object.values(symbolCounts).map(({ symbol, count }) => (
              <div key={symbol.id} className={styles.symbolItem}>
                <Symbol symbol={symbol} />
                <div className={styles.symbolCount}>×{count}</div>
              </div>
            ))}
          </div>
        )}

        <div className={styles.itemsSection}>
          {isRemoveMode ? (
            <div className={styles.buttonContainer}>
              <button
                className={styles.cancelButton}
                onClick={handleToggleRemoveMode}
              >
                Back to Inventory
              </button>
              <button
                className={styles.removeButton}
                onClick={handleRemoveSymbol}
                disabled={!selectedSymbolId || state.removeTokens <= 0}
              >
                Remove Symbol
              </button>
            </div>
          ) : (
            <>
              <h3 className={styles.sectionTitle}>Items</h3>
              <div className={styles.itemsInfo}>
                <span>You have: {state.removeTokens}</span>
                <span className={styles.removeTokenIcon}>🗑️</span>
              </div>

              <button
                className={styles.removeButton}
                onClick={handleToggleRemoveMode}
                disabled={state.removeTokens <= 0}
              >
                <span className={styles.trashIcon}>🗑️</span>
                Remove Symbol
              </button>
            </>
          )}
        </div>

      </div>
    </Modal>
  );
}
