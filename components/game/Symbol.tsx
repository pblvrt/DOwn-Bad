"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Symbol, effectResult } from "@/types/game";
import styles from "@/styles/GameCell.module.css";
import { useGameState } from "@/context/GameStateProvider";
import SymbolModal from "./SymbolModal";
import { totalDelayUntilPos, calculateAnimationDelay } from "@/lib/utils";
import DynamicRewardAnimation from "./DynamicRewardAnimation";

// Inlined from hooks/useAnimationPositions.ts
function useAnimationPositions(
  ref: React.RefObject<HTMLDivElement | null>,
  showReward: boolean,
  isSpinning: boolean,
  tutorialSeen: boolean
) {
  const [symbolPosition, setSymbolPosition] = useState({ x: 0, y: 0 });
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!showReward || isSpinning || !tutorialSeen) return;
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setSymbolPosition({ x: rect.left + rect.width / 2 - 30, y: rect.top + rect.height / 2 - 30 });
    }
    const rewardBar = document.getElementById("reward-bar");
    if (rewardBar) {
      const rewardRect = rewardBar.getBoundingClientRect();
      setTargetPosition({ x: rewardRect.left + rewardRect.width / 2 - 30, y: rewardRect.top + rewardRect.height / 2 - 30 });
    }
  }, [showReward, isSpinning, tutorialSeen, ref]);

  return { symbolPosition, targetPosition };
}

// Inlined from hooks/useAnimationTimers.ts
function useAnimationTimers({
  showReward,
  isSpinning,
  tutorialSeen,
  position,
  effectGrid,
  setTriggerEffectReward,
  setTriggerReward,
  symbol,
}: {
  showReward: boolean;
  isSpinning: boolean;
  tutorialSeen: boolean;
  position: number;
  effectGrid: (effectResult | null)[];
  setTriggerEffectReward: (value: boolean) => void;
  setTriggerReward: (value: boolean) => void;
  symbol: Symbol | null;
}) {
  useEffect(() => {
    if (!showReward || isSpinning || !tutorialSeen || !symbol || effectGrid.length === 0) return;
    const timers: NodeJS.Timeout[] = [];
    const currentEffect = effectGrid[position];
    const hasEffectBonus = currentEffect?.bonusValue !== undefined && currentEffect.bonusValue > 0;
    const isDestroy = currentEffect?.isDestroyed ?? false;
    const baseEffectDelay = totalDelayUntilPos(effectGrid, position);

    if (hasEffectBonus || isDestroy) {
      const effectTimer = setTimeout(() => setTriggerEffectReward(true), baseEffectDelay);
      timers.push(effectTimer);
    }

    const totalEffectDelay = totalDelayUntilPos(effectGrid, 20);
    if (symbol.value !== 0) {
      const rewardTimer = setTimeout(() => setTriggerReward(true), totalEffectDelay);
      timers.push(rewardTimer);
    }

    return () => { timers.forEach((timer) => clearTimeout(timer)); };
  }, [showReward, isSpinning, tutorialSeen, position, effectGrid, calculateAnimationDelay, setTriggerEffectReward, setTriggerReward]);
}

type SymbolProps = {
  symbol: Symbol | null;
  showReward?: boolean;
  rewardValue?: number;
  position?: number;
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

  const currentEffect = state.effectGrid[position];
  const multiplier = currentEffect?.multiplier ?? 1;
  const hasEffectBonus = currentEffect?.bonusValue !== undefined && currentEffect.bonusValue > 0;
  const isDestroy = currentEffect?.isDestroyed ?? false;

  const { symbolPosition, targetPosition } = useAnimationPositions(
    symbolRef as React.RefObject<HTMLDivElement>,
    showReward,
    state.isSpinning,
    state.tutorialSeen
  );

  useAnimationTimers({
    showReward,
    isSpinning: state.isSpinning,
    tutorialSeen: state.tutorialSeen,
    position,
    effectGrid: state.effectGrid,
    setTriggerEffectReward,
    setTriggerReward,
    symbol,
  });

  const handleAnimationComplete = useCallback(() => setTriggerReward(false), []);
  const handleEffectAnimationComplete = useCallback(() => setTriggerEffectReward(false), []);
  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setShowModal(true);
  }, []);
  const closeModal = useCallback(() => setShowModal(false), []);

  if (!symbol) {
    return <div className={`${styles.cellContainer} ${styles.cellEmpty}`}></div>;
  }

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
              value={(currentEffect?.bonusValue ?? 0) * multiplier}
              isTriggered={triggerEffectReward}
              isEffect={hasEffectBonus}
              isDestroy={isDestroy}
              onAnimationComplete={handleEffectAnimationComplete}
              position={symbolPosition}
              targetPosition={targetPosition}
              soundId="specialEffect"
            />
          )}
          {!isDestroy && (
            <DynamicRewardAnimation
              key={`reward-${position}`}
              value={rewardValue * multiplier}
              isTriggered={triggerReward}
              onAnimationComplete={handleAnimationComplete}
              position={symbolPosition}
              targetPosition={targetPosition}
              soundId="coin"
            />
          )}
        </>
      )}
      {showModal && (
        <SymbolModal symbol={symbol} onClose={closeModal} isOpen={showModal} />
      )}
    </div>
  );
}
