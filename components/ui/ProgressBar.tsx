import React, { useEffect, useState, useRef } from "react";
import styles from "@/styles/Home.module.css";
import { useGameState } from "@/context/GameStateProvider";

const ProgressBar: React.FC = () => {
  const { state } = useGameState();
  const { isSpinning, floor, rentSchedule } = state;
  const [displayedCoins, setDisplayedCoins] = useState(state.coins);
  const prevFloorRef = useRef(floor);
  const prevCoinsRef = useRef(state.coins);

  // Handle floor changes - carry over excess coins or reset if back to floor 0
  useEffect(() => {
    if (floor !== prevFloorRef.current) {
      if (floor === 0) {
        // Reset progress when back to floor 0 (game reset)
        setDisplayedCoins(0);
      } else {
        // Calculate excess coins from previous floor
        const previousRent = rentSchedule[prevFloorRef.current].rent;
        const excessCoins = Math.max(0, state.coins - previousRent);

        // Set the carried over coins for the new floor
        setDisplayedCoins(excessCoins);
      }

      prevFloorRef.current = floor;
      prevCoinsRef.current = state.coins;
    }
  }, [floor, rentSchedule, state.coins]);

  // Sync displayed coins with actual coins when not spinning
  useEffect(() => {
    if (!isSpinning) {
      setDisplayedCoins(state.coins);
      prevCoinsRef.current = state.coins;
    }
  }, [state.coins, isSpinning]);

  // Listen for coin animation completions via custom events
  useEffect(() => {
    const handleCoinAnimation = (event: CustomEvent) => {
      const { coinValue } = event.detail;
      console.log("🪙 Progress Bar: Received coin animation event", {
        coinValue,
        currentDisplayed: displayedCoins,
      });
      setDisplayedCoins((prev) => {
        const newValue = prev + coinValue;
        console.log("🪙 Progress Bar: Updating coins", {
          from: prev,
          to: newValue,
          added: coinValue,
        });
        return newValue;
      });
    };

    // Add event listener for coin animations
    window.addEventListener(
      "coinAnimationComplete",
      handleCoinAnimation as EventListener
    );

    return () => {
      window.removeEventListener(
        "coinAnimationComplete",
        handleCoinAnimation as EventListener
      );
    };
  }, []);

  // Reset displayedCoins to match the starting value when spinning begins
  useEffect(() => {
    if (isSpinning) {
      // Set displayed coins to the value before the spin started
      setDisplayedCoins(prevCoinsRef.current);
    }
  }, [isSpinning]);

  // Calculate the percentage for the progress bar width using displayed coins
  const percentage = Math.min(
    (displayedCoins / rentSchedule[floor].rent) * 100,
    100
  );

  return (
    <div className={styles.progressBar} id="reward-bar">
      <div className={styles.stageInfo}>
        <span className={styles.stageLabel}>Stage {floor + 1}</span>
        <span className={styles.coinTarget}>
          {Math.floor(displayedCoins)} of {rentSchedule[floor].rent}
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
