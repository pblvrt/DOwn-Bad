import React, { useMemo } from "react";
import { useGameState } from "@/context/GameStateProvider";
import styles from "@/styles/Inventory.module.css";
import Symbol from "./Symbol";

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

  // Calculate total number of symbols
  const totalSymbolCount = useMemo(() => {
    return state.grid.filter((symbol) => symbol !== null).length;
  }, [state.grid]);

  return (
    <div className={styles.inventoryContainer}>
      <div className={styles.totalCount}>Total: {totalSymbolCount}</div>
      <div className={styles.inventoryGrid}>
        {uniqueSymbols.map((symbol) => (
          <div key={symbol.id} className={styles.symbolStack}>
            <Symbol symbol={symbol} />
            <div className={styles.symbolCount}>
              {symbolCounts.get(symbol.id)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;
