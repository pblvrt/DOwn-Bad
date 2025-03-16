import React from "react";
import styles from "@/styles/Home.module.css";
import { useGameState } from "@/context/GameStateProvider";

const ProgressBar: React.FC = () => {
  const { state } = useGameState();

  // Calculate the percentage for the progress bar width
  const percentage = Math.min((state.coins / state.rentSchedule[state.floor].rent) * 100, 100);

  return (
    <div className={styles.progressBar}>
      <div className={styles.stageInfo}>
        <span className={styles.stageLabel}>Stage {state.floor + 1}</span>
        <span className={styles.coinTarget}>
          {state.coins} <span>🪙</span>
        </span>
      </div>
      <div
        className={styles.progressBarInner}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
