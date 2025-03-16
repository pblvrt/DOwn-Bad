"use client";

import { useGameState } from "@/context/GameStateProvider";
import { spinGrid } from "@/lib/gameLogic";
import styles from "@/styles/Home.module.css";

export default function SpinButton() {
  const { state, dispatch } = useGameState();

  const handleSpin = () => {
    dispatch({ type: "START_SPIN_GRID" });
    // Play spin sound
    const audio = document.getElementById("spin-sound") as HTMLAudioElement;
    if (state.soundEnabled && audio) {
      audio.currentTime = 0;
      audio.play().catch((e) => console.log("Error playing sound:", e));
    }

    const {
      grid: newGrid,
      baseCoins,
      bonusCoins,
      effectGrid,
    } = spinGrid(state.grid, state.symbols);
    dispatch({ type: "UPDATE_GRID", payload: newGrid });
    dispatch({ type: "UPDATE_EFFECT_GRID", payload: effectGrid });
    dispatch({
      type: "ADD_COINS",
      payload: {
        baseCoins: baseCoins,
        bonusCoins: bonusCoins,
      },
    });
    const notNullEffectGrid = effectGrid.filter((effect) => effect !== null);
    setTimeout(() => {
      dispatch({ type: "DECREASE_TURNS" });
    }, notNullEffectGrid.length * 1000 + 1400 + 2000);
  };

  return (
    <button onClick={handleSpin} className={styles.spinButton}>
      SPIN
      <span className={styles.spinButtonText}>
        Turn: {state.turn + 1} / {state.rentSchedule[state.floor].turns + 1}
      </span>
    </button>
  );
}
