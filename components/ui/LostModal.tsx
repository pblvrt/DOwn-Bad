"use client";

import { useGameState } from "@/context/GameStateProvider";
import { useEffect } from "react";
import styles from "@/styles/LostModal.module.css";

export default function LostModal() {
  const { state, dispatch } = useGameState();

  // Play game over sound when lost state becomes true
  useEffect(() => {
    if (state.lost) {
      const audio = document.getElementById(
        "gameover-sound"
      ) as HTMLAudioElement;
      if (state.soundEnabled && audio) {
        audio.currentTime = 0;
        audio.play().catch((e) => console.log("Error playing sound:", e));
      }
    }
  }, [state.lost, state.soundEnabled]);

  // If not lost, don't render anything
  if (!state.lost) {
    return null;
  }

  const handleResetGame = () => {
    dispatch({ type: "RESET_GAME" });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Game Over!</h2>
        <p className={styles.modalText}>
          You couldn&apos;t pay the rent of{" "}
          {state.rentSchedule[state.floor].rent} coins.
        </p>
        <p className={styles.modalStats}>
          You reached floor {state.floor + 1} and collected a total of{" "}
          {state.coins} coins.
        </p>
        <button onClick={handleResetGame} className={styles.resetButton}>
          Try Again
        </button>
      </div>
    </div>
  );
}
