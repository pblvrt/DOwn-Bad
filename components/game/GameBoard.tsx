"use client";

import { useGameState } from "@/context/GameStateProvider";
import { useEffect, useRef, useMemo, useCallback } from "react";
import styles from "@/styles/GameBoard.module.css";
import { symbolTypes } from "@/lib/symbols";
import SymbolComponent from "./Symbol";
import { CELL_NUMBER, GRID_SIZE } from "@/lib/constants";
export default function GameBoard() {
  const { state, dispatch } = useGameState();
  const { grid, isSpinning } = state;
  const slotRefs = useRef<(HTMLDivElement | null)[]>(Array(CELL_NUMBER).fill(null));

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
          // We want to end with the final symbol (which is the last in our array) visible
          const finalPosition = -(options.length - 1) * 5; // 4rem is the height of each cell
          ref.style.transition = "top 0.7s ease-out";
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
      }, 1000);

      return () => clearTimeout(timer); // Clean up timeout
    }
  }, [isSpinning, dispatch, spinSlots]);

  // Memoize the column rendering functions to prevent unnecessary recalculations
  const renderSpinningColumns = useMemo(() => {
    const columns = [];

    for (let i = 0; i < CELL_NUMBER; i++) {
      const row = Math.floor(i / GRID_SIZE);
      const col = i % GRID_SIZE;
      const columnSymbols = [];

      // Determine if this is a corner cell
      const isTopLeft = i === 0;
      const isTopRight = i === GRID_SIZE - 1;
      const isBottomLeft = i === GRID_SIZE * (GRID_SIZE - 1);
      const isBottomRight = i === GRID_SIZE * GRID_SIZE - 1;
      const isCorner = isTopLeft || isTopRight || isBottomLeft || isBottomRight;

      // Determine if cell is on an edge
      const isLeftEdge = col === 0;
      const isRightEdge = col === GRID_SIZE - 1;

      // Add corner class based on position
      let cornerClass = "";
      if (isTopLeft) cornerClass = styles.topLeft;
      if (isTopRight) cornerClass = styles.topRight;
      if (isBottomLeft) cornerClass = styles.bottomLeft;
      if (isBottomRight) cornerClass = styles.bottomRight;

      // Add symbols in reverse order (top to bottom in the slot)
      for (let offset = 20; offset >= 0; offset--) {
        // Calculate which row's symbol to show
        // We're showing symbols that will end up offset rows above current position
        const sourceRow = (row - offset + GRID_SIZE) % GRID_SIZE;
        const sourceIndex = sourceRow * GRID_SIZE + col;
        columnSymbols.push(grid[sourceIndex] || symbolTypes[0]);
      }

      columns.push(
        <div
          key={i + "spin"}
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
    }

    return columns;
  }, [grid, isSpinning]);

  const renderColumns = useMemo(() => {
    return grid.map((symbol, i) => {
      const col = i % GRID_SIZE;

      // Determine if this is a corner cell
      const isTopLeft = i === 0;
      const isTopRight = i === GRID_SIZE - 1;
      const isBottomLeft = i === GRID_SIZE * (GRID_SIZE - 1);
      const isBottomRight = i === GRID_SIZE * GRID_SIZE - 1;
      const isCorner = isTopLeft || isTopRight || isBottomLeft || isBottomRight;

      // Determine if cell is on an edge
      const isLeftEdge = col === 0;
      const isRightEdge = col === GRID_SIZE - 1;

      // Add corner class based on position
      let cornerClass = "";
      if (isTopLeft) cornerClass = styles.topLeft;
      if (isTopRight) cornerClass = styles.topRight;
      if (isBottomLeft) cornerClass = styles.bottomLeft;
      if (isBottomRight) cornerClass = styles.bottomRight;

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
