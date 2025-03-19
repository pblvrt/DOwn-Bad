"use client";

import { useState, useRef, useCallback } from "react";
import { Symbol } from "@/types/game";
import styles from "@/styles/GameCell.module.css";
import { useGameState } from "@/context/GameStateProvider";
import SymbolModal from "./SymbolModal";
import { useAnimationPositions } from "@/hooks/useAnimationPositions";
import { useAnimationTimers } from "@/hooks/useAnimationTimers";
import DynamicRewardAnimation from "./DynamicRewardAnimation";

type SymbolProps = {
  symbol: Symbol | null;
  showReward?: boolean;
  rewardValue?: number;
  position?: number; // Grid position
  size?: number;
};

export default function SymbolComponent({
  symbol,
  showReward = false,
  rewardValue = 0,
  position = 0,
  size = 34,
}: SymbolProps) {
  const { state } = useGameState();
  const [showModal, setShowModal] = useState(false);
  const [triggerReward, setTriggerReward] = useState(false);
  const [triggerEffectReward, setTriggerEffectReward] = useState(false);
  const symbolRef = useRef<HTMLDivElement>(null);

  // Custom hooks for animation logic
  const { symbolPosition, targetPosition } = useAnimationPositions(
    symbolRef as React.RefObject<HTMLDivElement>,
    showReward,
    state.isSpinning,
    state.tutorialSeen
  );

  // Animation timer management
  useAnimationTimers({
    showReward,
    isSpinning: state.isSpinning,
    tutorialSeen: state.tutorialSeen,
    position,
    effectGrid: state.effectGrid,
    setTriggerEffectReward,
    setTriggerReward,
    symbol: symbol,
  });

  // Event handlers
  const handleAnimationComplete = useCallback(
    () => setTriggerReward(false),
    []
  );
  const handleEffectAnimationComplete = useCallback(
    () => setTriggerEffectReward(false),
    []
  );
  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setShowModal(true);
  }, []);
  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  if (!symbol) {
    return (
      <div className={`${styles.cellContainer} ${styles.cellEmpty}`}></div>
    );
  }

  const currentEffect = state.effectGrid[position];
  const hasEffectBonus =
    currentEffect?.bonusValue !== undefined && currentEffect.bonusValue > 0;
  const isDestroy = currentEffect?.isDestroyed ?? false;

  return (
    <div onClick={handleClick} ref={symbolRef}>
      <div className={styles.symbolEmoji} style={{ fontSize: `${size}px` }}>
        {symbol.emoji}
      </div>
      {showReward && (
        <>
          {(hasEffectBonus || isDestroy) && (
            <DynamicRewardAnimation
              key={`effect-${position}`}
              value={currentEffect?.bonusValue ?? 0}
              isTriggered={triggerEffectReward}
              isEffect={hasEffectBonus}
              isDestroy={isDestroy}
              onAnimationComplete={handleEffectAnimationComplete}
              position={symbolPosition}
              targetPosition={targetPosition}
              soundId="specialEffect"
            />
          )}
          <DynamicRewardAnimation
            key={`reward-${position}`}
            value={rewardValue}
            isTriggered={triggerReward}
            onAnimationComplete={handleAnimationComplete}
            position={symbolPosition}
            targetPosition={targetPosition}
            soundId="coin"
          />
        </>
      )}
      {showModal && (
        <SymbolModal symbol={symbol} onClose={closeModal} isOpen={showModal} />
      )}
    </div>
  );
}
