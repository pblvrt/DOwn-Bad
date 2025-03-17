import React, { useEffect, useState, useRef } from "react";
import styles from "@/styles/Home.module.css";
import { useGameState } from "@/context/GameStateProvider";

const ProgressBar: React.FC = () => {
  const { state } = useGameState();
  const { isSpinning } = state;
  const [coins, setCoins] = useState(state.coins);
  const [floor, setFloor] = useState(0);
  const animationQueue = useRef<Array<{ value: number; delay: number }>>([]);
  const isAnimating = useRef(false);

  useEffect(() => {
    if (state.floor !== floor) {
      setFloor(state.floor);
      setCoins(coins );
    }
  }, [state.floor]);

  // Calculate the percentage for the progress bar width
  const percentage = Math.min(
    (coins / state.rentSchedule[state.floor].rent) * 100,
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
        setCoins(nextAnimation.value);
        processQueue();
      }, nextAnimation.delay);
    }
  };

  useEffect(() => {
    if (isSpinning) {
      // Keep the current coins value and build on top of it
      let currentCoins = coins;
      animationQueue.current = [];
      const notNullEffects = state.effectGrid.filter(
        (effect) => effect !== null
      );

      notNullEffects.forEach((effect) => {
        if (effect !== null && effect.bonusValue > 0) {
          currentCoins += effect.bonusValue;
          animationQueue.current.push({
            value: currentCoins,
            delay: 1000, // 1 second delay between animations
          });
        }
      });

      const totalCoinsNoEffect = state.grid.reduce((acc, curr) => {
        if (curr !== null) {
          return acc + curr.value;
        }
        return acc;
      }, 0);
      // Add base coins at the end if there are any
      if (totalCoinsNoEffect > 0) {
        currentCoins += totalCoinsNoEffect;
        animationQueue.current.push({
          value: currentCoins,
          delay: 1200,
        });
      }

      // Start processing the queue if not already animating
      if (!isAnimating.current) {
        processQueue();
      }
    }
  }, [isSpinning, state.effectGrid, state.baseCoins]);

  return (
    <div className={styles.progressBar} id="reward-bar">
      <div className={styles.stageInfo}>
        <span className={styles.stageLabel}>Stage {state.floor + 1}</span>
        <span className={styles.coinTarget}>
          {coins} of {state.rentSchedule[state.floor].rent}
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
