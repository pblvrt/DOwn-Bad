import React, { useMemo } from "react";
import { useGameState } from "@/context/GameStateProvider";
import styles from "@/styles/Inventory.module.css";

const Inventory: React.FC = () => {
  const { state } = useGameState();

  // Count occurrences of each symbol in the grid
  const symbolCounts = useMemo(() => {
    const counts = new Map();

    state.grid.forEach((symbol) => {
      if (symbol) {
        const id = symbol.id;
        counts.set(id, (counts.get(id) || 0) + 1);
      }
    });

    return counts;
  }, [state.grid]);

  // Get unique symbols from the grid
  const uniqueSymbols = useMemo(() => {
    const symbols = new Map();

    state.grid.forEach((symbol) => {
      if (symbol && !symbols.has(symbol.id)) {
        symbols.set(symbol.id, symbol);
      }
    });

    return Array.from(symbols.values());
  }, [state.grid]);

  return (
    <div className={styles.inventoryContainer}>
      <div className={styles.inventoryGrid}>
        {uniqueSymbols.map((symbol) => (
          <div key={symbol.id} className={styles.inventoryItem}>
            <div className={styles.symbolEmoji}>{symbol.emoji}</div>
            {symbolCounts.get(symbol.id) > 1 && (
              <div className={styles.symbolCount}>
                {symbolCounts.get(symbol.id)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;
