"use client";

import { useGameState } from "@/context/GameStateProvider";
import { spinGrid } from "@/lib/gameLogic";
import { cellTriggeringEffects } from "@/lib/utils";
import styles from "@/styles/Home.module.css";

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

  const processSpinResults = (spinResults) => {
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

  const scheduleEndOfTurn = (effectGrid) => {
    const effectsDuration = 1000 * cellTriggeringEffects(effectGrid);
    const totalDelay = effectsDuration + 1400 + 2000;

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
