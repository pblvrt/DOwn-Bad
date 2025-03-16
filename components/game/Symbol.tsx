"use client";

import { useState, useRef, useEffect } from "react";
import { Symbol } from "@/types/game";
import styles from "@/styles/GameCell.module.css";
import RewardAnimation from "./RewardAnimation";
import { useGameState } from "@/context/GameStateProvider";
import SymbolModal from "./SymbolModal";

type SymbolProps = {
  symbol: Symbol | null;
  showReward?: boolean;
  rewardValue?: number;
  position?: number; // Grid position
};

export default function SymbolComponent({
  symbol,
  showReward = false,
  rewardValue = 0,
  position = 0,
}: SymbolProps) {
  const { state } = useGameState();
  const cellsNotNullBeforePosition = state.effectGrid
    .slice(0, position)
    .filter((cell) => cell !== null);
  const cellsWithEffect = state.effectGrid.filter((cell) => cell !== null);

  const [showModal, setShowModal] = useState(false);
  const [triggerReward, setTriggerReward] = useState(false);
  const [triggerEffectReward, setTriggerEffectReward] = useState(false);
  const symbolRef = useRef<HTMLDivElement>(null);
  const [symbolPosition, setSymbolPosition] = useState({ x: 0, y: 0 });
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });


  // Get positions for animation
  useEffect(() => {
    // Skip animation on first render
    if (!state.tutorialSeen) {
      return;
    }


    if (showReward && !state.isSpinning) {
      // Get symbol position
      if (symbolRef.current) {
        const rect = symbolRef.current.getBoundingClientRect();
        setSymbolPosition({
          x: rect.left + rect.width / 2 - 30, // Center the animation
          y: rect.top + rect.height / 2 - 30,
        });
      }

      // Get reward bar position (you'll need to add an ID to your reward bar element)
      const rewardBar = document.getElementById("reward-bar");
      if (rewardBar) {
        const rewardRect = rewardBar.getBoundingClientRect();
        setTargetPosition({
          x: rewardRect.left + rewardRect.width / 2 - 30,
          y: rewardRect.top + rewardRect.height / 2 - 30,
        });
      }

      // First show effect animations in sequence
      const effectDelay = 1000 * cellsNotNullBeforePosition.length;
      let timerEffect: NodeJS.Timeout | undefined;

      if (state.effectGrid[position] !== null) {
        timerEffect = setTimeout(() => {
          setTriggerEffectReward(true);
        }, effectDelay);
      }

      // Then show reward animations after all effects
      const totalEffectDelay = 1000 * cellsWithEffect.length;
      const rewardDelay = totalEffectDelay ; // Add a small buffer after effects

      const timer = setTimeout(() => {
        setTriggerReward(true);
      }, rewardDelay);

      return () => {
        if (timer) clearTimeout(timer);
        if (timerEffect) clearTimeout(timerEffect);
      };
    }
  }, [
    showReward,
    state.isSpinning,
    position,
    cellsNotNullBeforePosition.length,
    cellsWithEffect.length,
  ]);

  const handleAnimationComplete = () => {
    setTriggerReward(false);
  };

  const handleEffectAnimationComplete = () => {
    setTriggerEffectReward(false);
  };

  if (!symbol) {
    return (
      <div className={`${styles.cellContainer} ${styles.cellEmpty}`}></div>
    );
  }

  const handleClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div onClick={handleClick} ref={symbolRef}>
      <div className={styles.symbolEmoji}>{symbol.emoji}</div>
      {showReward && (
        <RewardAnimation
          key={position + "effect"}
          value={state.effectGrid[position] || 0}
          isTriggered={triggerEffectReward}
          isEffect={true}
          onAnimationComplete={handleEffectAnimationComplete}
          position={symbolPosition}
          targetPosition={targetPosition}
        />
      )}
      {showReward && (
        <RewardAnimation
          key={position + "reward"}
          value={rewardValue}
          isTriggered={triggerReward}
          onAnimationComplete={handleAnimationComplete}
          position={symbolPosition}
          targetPosition={targetPosition}
        />
      )}
      {showModal && (
        <SymbolModal symbol={symbol} onClose={closeModal} isOpen={showModal} />
      )}
    </div>
  );
}
