import React, { useEffect, useState, useRef } from "react";
import styles from "@/styles/Home.module.css";
import { useGameState } from "@/context/GameStateProvider";

const ProgressBar: React.FC = () => {
  const { state } = useGameState();
  const { isSpinning, floor, rentSchedule, effectGrid, grid } = state;
  const [displayedCoins, setDisplayedCoins] = useState(0);
  const [actualCoins, setActualCoins] = useState(0);
  const animationQueue = useRef<Array<{ value: number; delay: number }>>([]);
  const isAnimating = useRef(false);
  const prevFloorRef = useRef(floor);

  // Handle floor changes - carry over excess coins or reset if back to floor 0
  useEffect(() => {
    if (floor !== prevFloorRef.current) {
      if (floor === 0) {
        // Reset progress when back to floor 0 (game reset)
        setDisplayedCoins(0);
        setActualCoins(0);
        animationQueue.current = [];
        isAnimating.current = false;
      } else {
        // Calculate excess coins from previous floor
        const previousRent = rentSchedule[prevFloorRef.current].rent;
        const excessCoins = Math.max(0, actualCoins - previousRent);

        // Set the carried over coins for the new floor
        setDisplayedCoins(excessCoins);
        setActualCoins(excessCoins);
      }

      prevFloorRef.current = floor;
    }
  }, [floor, rentSchedule, actualCoins]);

  // Calculate the percentage for the progress bar width
  const percentage = Math.min(
    (state.coins / rentSchedule[floor].rent) * 100,
    100
  );

  // Function to process the animation queue
  const processQueue = () => {
    if (animationQueue.current.length === 0) {
      isAnimating.current = false;
      return;
    }

    isAnimating.current = true;
    const nextAnimation = animationQueue.current.shift();

    if (nextAnimation) {
      setTimeout(() => {
        setDisplayedCoins(nextAnimation.value);
        processQueue();
      }, nextAnimation.delay);
    }
  };

  // Handle spin results and queue animations
  useEffect(() => {
    if (isSpinning) {
      // Calculate total coins from this spin
      let newCoins = 0;

      // Add coins from effect grid
      const effectCoins = effectGrid
        .filter((effect) => effect !== null)
        .reduce((sum, effect) => sum + (effect?.bonusValue || 0), 0);

      // Add coins from regular grid
      const gridCoins = grid
        .filter((item) => item !== null)
        .reduce((sum, item) => sum + (item?.value || 0), 0);

      // Total new coins from this spin
      newCoins = effectCoins + gridCoins;

      // Update actual coins (internal tracking)
      const updatedTotalCoins = actualCoins + newCoins;
      setActualCoins(updatedTotalCoins);

      // Clear previous animation queue
      animationQueue.current = [];

      // Queue effect animations if there are any
      let runningTotal = displayedCoins;
      const effectsWithBonus = effectGrid.filter(
        (effect) => effect !== null && effect.bonusValue > 0
      );

      // Add effect animations
      if (effectsWithBonus.length > 0) {
        effectsWithBonus.forEach((effect) => {
          if (effect !== null) {
            runningTotal += effect.bonusValue;
            animationQueue.current.push({
              value: runningTotal,
              delay: 800,
            });
          }
        });
      }

      // Add grid coins animation at the end
      if (gridCoins > 0) {
        runningTotal += gridCoins;
        animationQueue.current.push({
          value: runningTotal,
          delay: 1000,
        });
      }

      // Start processing the queue if not already animating
      if (!isAnimating.current && animationQueue.current.length > 0) {
        processQueue();
      }
    }
  }, [isSpinning, effectGrid, grid]);

  return (
    <div className={styles.progressBar} id="reward-bar">
      <div className={styles.stageInfo}>
        <span className={styles.stageLabel}>Stage {floor + 1}</span>
        <span className={styles.coinTarget}>
          {state.coins} of {rentSchedule[floor].rent}
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
