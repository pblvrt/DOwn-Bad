"use client";

import { useGameState } from "@/context/GameStateProvider";
import { useEffect, useRef, useMemo, useCallback } from "react";
import styles from "@/styles/GameBoard.module.css";
import { symbolTypes } from "@/lib/symbols";
import SymbolComponent from "./Symbol";
import { CELL_NUMBER, GRID_SIZE } from "@/lib/constants";
import { getColumnSymbols, getPositionClasses } from "@/lib/utils";

export default function GameBoard() {
  const { state, dispatch } = useGameState();
  const { grid, isSpinning } = state;
  const slotRefs = useRef<(HTMLDivElement | null)[]>(
    Array(CELL_NUMBER).fill(null)
  );

  // Memoize the spin slots function to prevent unnecessary recreations
  const spinSlots = useCallback(() => {
    // For each cell in the grid
    for (let i = 0; i < CELL_NUMBER; i++) {
      const ref = slotRefs.current[i];
      if (ref) {
        // Reset position first
        ref.style.transition = "none";
        ref.style.top = "0";

        // Force reflow to make sure the reset takes effect
        void ref.offsetHeight;

        // Add a delay based on the row index for a cascading effect
        setTimeout(() => {
          if (!ref) return;

          const options = ref.children;
          // Since getColumnSymbols puts the correct final symbol FIRST in the array,
          // we want to end at position 0 (showing the first symbol)
          const finalPosition = -options.length * 4; // Show the first symbol which is the correct result
          ref.style.transition = "top 1.5s ease-out";
          ref.style.top = `${finalPosition}rem`;
        }, Math.floor(i / GRID_SIZE)); // Stagger by row
      }
    }
  }, []);

  // Handle spinning effect
  useEffect(() => {
    if (isSpinning) {
      spinSlots();
      const timer = setTimeout(() => {
        dispatch({ type: "STOP_SPIN_GRID" });
      }, 2000);

      return () => clearTimeout(timer); // Clean up timeout
    }
  }, [isSpinning, dispatch, spinSlots]);

  // Optimized spinning columns with extracted utilities
  const renderSpinningColumns = useMemo(() => {
    return Array.from({ length: CELL_NUMBER }, (_, i) => {
      const { cornerClass, isCorner, isLeftEdge, isRightEdge } =
        getPositionClasses(i);
      const columnSymbols = getColumnSymbols(grid, i);

      return (
        <div
          key={`${i}-spin`}
          className={`${styles.slotColumn} ${isCorner ? cornerClass : ""}`}
        >
          <div
            className={`${styles.slotContainer} ${
              isSpinning ? styles.spinning : ""
            }`}
            ref={(el) => {
              slotRefs.current[i] = el;
            }}
          >
            {columnSymbols.map((symbol, symbolIndex) => (
              <div
                className={`${styles.cellContainer} ${
                  isLeftEdge ? styles.leftEdge : ""
                } ${isRightEdge ? styles.rightEdge : ""}`}
                key={symbolIndex}
              >
                <SymbolComponent symbol={symbol} />
              </div>
            ))}
          </div>
        </div>
      );
    });
  }, [grid, isSpinning]);

  const renderColumns = useMemo(() => {
    return grid.map((symbol, i) => {
      const { cornerClass, isCorner, isLeftEdge, isRightEdge } =
        getPositionClasses(i);

      return (
        <div
          key={i}
          className={`${styles.slotColumn} ${isCorner ? cornerClass : ""}`}
        >
          <div className={styles.slotContainer}>
            <div
              className={`${styles.cellContainer} ${
                isLeftEdge ? styles.leftEdge : ""
              } ${isRightEdge ? styles.rightEdge : ""}`}
            >
              <SymbolComponent
                symbol={symbol || symbolTypes[0]}
                showReward={symbol !== null}
                rewardValue={symbol?.value || 0}
                position={i}
              />
            </div>
          </div>
        </div>
      );
    });
  }, [grid]);

  return (
    <div className={styles.gameGrid}>
      <div className={styles.shade}></div>
      {isSpinning ? renderSpinningColumns : renderColumns}
    </div>
  );
}
