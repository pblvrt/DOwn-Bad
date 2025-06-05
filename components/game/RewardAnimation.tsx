"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "@/styles/RewardAnimation.module.css";
import { RewardAnimationProps, activeAnimations } from "./animations/types";
import { useAnimationSequences } from "./animations/useAnimationSequences";

export default function RewardAnimation({
  value,
  isTriggered,
  onAnimationComplete,
  position,
  targetPosition,
  isEffect = false,
  effectDescription = "",
  soundUrl,
  isDestroy = false,
  id = "default",
}: RewardAnimationProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null
  );

  const { isAnimating, animationPhase, style, animationIdRef, startAnimation } =
    useAnimationSequences(
      position,
      targetPosition,
      onAnimationComplete,
      isEffect,
      isDestroy,
      soundUrl,
      id,
      value
    );

  // Handle client-side rendering for createPortal
  useEffect(() => {
    setIsMounted(true);
    setPortalContainer(document.body);
    return () => {
      setIsMounted(false);
      setPortalContainer(null);
    };
  }, []);

  // Main animation trigger
  useEffect(() => {
    if (isTriggered && isMounted) {
      startAnimation();
    }
  }, [isTriggered, isMounted]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      activeAnimations.delete(animationIdRef.current);
    };
  }, []);

  if (!isAnimating || !isMounted || !portalContainer) return null;

  const animationElement = (
    <div
      className={styles.rewardAnimationContainer}
      style={style}
      data-animation-id={animationIdRef.current}
    >
      {isEffect && effectDescription && animationPhase !== 3 && (
        <div className={styles.effectDescription}>{effectDescription}</div>
      )}
      {animationPhase !== 3 && (
        <div
          className={`${styles.rewardValue} ${
            isEffect ? styles.effectValue : ""
          }`}
        >
          {isEffect
            ? value > 0
              ? `+${value}`
              : effectDescription
              ? ""
              : "Effect!"
            : `+${value}`}
        </div>
      )}
      <div
        className={`${styles.rewardCoin} ${
          animationPhase === 2 ? styles.movePhase : ""
        } ${animationPhase === 3 ? styles.destroyPhase : ""} ${
          isEffect ? styles.effectCoin : ""
        }`}
      >
        {isEffect && animationPhase !== 3
          ? "✨"
          : isDestroy && animationPhase === 3
          ? "💥"
          : "🪙"}
      </div>
    </div>
  );

  // Only use createPortal when we have a valid container
  return createPortal(animationElement, portalContainer);
}
