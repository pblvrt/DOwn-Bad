"use client";

import { useState } from "react";
import { useGameState } from "@/context/GameStateProvider";
import { useAudio } from "@/context/AudioProvider";
import { spinGrid } from "@/lib/gameLogic";
import { totalDelayUntilPos } from "@/lib/utils";
import styles from "@/styles/Home.module.css";
import { effectResult, Symbol } from "@/types/game";
import { CELL_NUMBER } from "@/lib/constants";
import InventoryModal from "./InventoryModal";

export default function SpinButton() {
  const { state, dispatch } = useGameState();
  const { playSound } = useAudio();
  const [showInventory, setShowInventory] = useState(false);

  const processSpinResults = (spinResults: {
    grid: (Symbol | null)[];
    baseCoins: number;
    bonusCoins: number;
    effectGrid: (effectResult | null)[];
    symbols: Symbol[];
  }) => {
    const {
      grid: newGrid,
      baseCoins,
      bonusCoins,
      effectGrid,
      symbols,
    } = spinResults;

    dispatch({ type: "UPDATE_GRID", payload: { grid: newGrid, symbols } });
    dispatch({ type: "UPDATE_EFFECT_GRID", payload: effectGrid });
    dispatch({
      type: "ADD_COINS",
      payload: { baseCoins, bonusCoins },
    });
  };

  const scheduleEndOfTurn = (effectGrid: (effectResult | null)[]) => {
    const totalDelay = totalDelayUntilPos(effectGrid, CELL_NUMBER) + 4300;

    setTimeout(() => {
      dispatch({ type: "DECREASE_TURNS" });
    }, totalDelay);
  };

  const handleSpin = () => {
    if (state.isSpinning) return;
    dispatch({ type: "START_SPIN_GRID" });
    playSound("spin");

    const spinResults = spinGrid(state.grid, state.symbols);
    processSpinResults(spinResults);
    scheduleEndOfTurn(spinResults.effectGrid);
  };

  const handleOpenInventory = () => {
    setShowInventory(true);
    playSound("click");
  };

  const handleCloseInventory = () => {
    setShowInventory(false);
  };

  const currentTurn = state.turn + 1;
  const totalTurns = state.rentSchedule[state.floor].turns + 1;

  return (
    <div className={styles.spinButtonContainer}>
      <button
        className={styles.inventoryButton}
        onClick={handleOpenInventory}
        aria-label="Open Inventory"
      >
        <span className={styles.inventoryIcon}>🎒</span>
        <span className={styles.inventoryCount}>{state.symbols.length}</span>
      </button>
      <button onClickCapture={handleSpin} className={styles.spinButton}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 240 120"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main button body */}
          <path
            d="M30,10 L210,10 Q240,10 240,40 L240,80 Q240,110 210,110 L30,110 Q0,110 0,80 L0,40 Q0,10 30,10 Z"
            fill="#00C853"
          />

          {/* Simple flashing border */}
          <path
            d="M30,10 L210,10 Q240,10 240,40 L240,80 Q240,110 210,110 L30,110 Q0,110 0,80 L0,40 Q0,10 30,10 Z"
            fill="none"
            stroke="#00FF9B"
            strokeWidth="2"
          >
            <animate
              attributeName="stroke-opacity"
              values="0.3;0.8;0.3"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </path>

          {/* SPIN text */}
          <text
            x="120"
            y="55"
            fontFamily="Arial, sans-serif"
            fontSize="32"
            fontWeight="bold"
            fill="white"
            textAnchor="middle"
          >
            SPIN
          </text>

          {/* Turn counter */}
          <text
            x="120"
            y="85"
            fontFamily="Arial, sans-serif"
            fontSize="16"
            fill="white"
            textAnchor="middle"
          >
            Turn: {currentTurn}/{totalTurns}
          </text>
        </svg>
      </button>

      <InventoryModal isOpen={showInventory} onClose={handleCloseInventory} />
    </div>
  );
}
