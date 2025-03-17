"use client";

import { useGameState } from "@/context/GameStateProvider";
import { spinGrid } from "@/lib/gameLogic";
import { totalDelayUntilPos } from "@/lib/utils";
import styles from "@/styles/Home.module.css";
import { effectResult, Symbol } from "@/types/game";
import { CELL_NUMBER } from "@/lib/constants";
export default function SpinButton() {
  const { state, dispatch } = useGameState();

  const playSpinSound = () => {
    if (!state.soundEnabled) return;

    const audio = new Audio("/spin.wav");
    audio.play().catch((e) => console.log("Error playing sound:", e));

    // Stop the sound after 3 seconds
    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, 1000);
  };

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
    const totalDelay = totalDelayUntilPos(effectGrid, CELL_NUMBER) + 3000;

    setTimeout(() => {
      dispatch({ type: "DECREASE_TURNS" });
    }, totalDelay);
  };

  const handleSpin = () => {
    dispatch({ type: "START_SPIN_GRID" });
    playSpinSound();

    const spinResults = spinGrid(state.grid, state.symbols);
    processSpinResults(spinResults);
    scheduleEndOfTurn(spinResults.effectGrid);
  };

  const currentTurn = state.turn + 1;
  const totalTurns = state.rentSchedule[state.floor].turns + 1;

  return (
    <button onClick={handleSpin} className={styles.spinButton}>
      SPIN
      <span className={styles.spinButtonText}>
        Turn: {currentTurn} / {totalTurns}
      </span>
    </button>
  );
}
