import { useState, useRef } from "react";
import { activeAnimations } from "./types";
import { useAnimationStyles } from "./useAnimationStyles";
import { useAudio } from "@/context/AudioProvider";

export function useAnimationSequences(
  position: { x: number; y: number },
  targetPosition: { x: number; y: number },
  onAnimationComplete: () => void,
  isEffect = false,
  isDestroy = false,
  soundId?: string,
  id = "default",
  value = 0
) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0); // 0: not started, 1: appear, 2: move, 3: destroy
  const animationIdRef = useRef<string>(`${id}-${Date.now()}`);
  const { playSound } = useAudio();

  const {
    style,
    setInitialStyle,
    setPopupStyle,
    setNormalStyle,
    setMoveToTargetStyle,
    setBuzzingStyle,
    setFadeOutStyle,
  } = useAnimationStyles();

  const completeAnimation = () => {
    setIsAnimating(false);
    setAnimationPhase(0);
    // Remove this animation from active animations
    activeAnimations.delete(animationIdRef.current);

    // Dispatch custom event for progress bar to listen to
    // Dispatch for both effect animations and regular coin animations
    // Only skip for destroy-only animations (that don't give coins)
    if (animationPhase === 2 && value > 0) {
      console.log("🚀 Animation: Dispatching coin event", {
        value,
        isEffect,
        isDestroy,
        animationPhase,
        id,
      });
      window.dispatchEvent(
        new CustomEvent("coinAnimationComplete", {
          detail: { coinValue: value },
        })
      );
    } else {
      console.log("🚫 Animation: NOT dispatching coin event", {
        value,
        isEffect,
        isDestroy,
        animationPhase,
        id,
      });
    }

    onAnimationComplete();
  };

  // Animation sequences
  const runDestroyAnimation = () => {
    setAnimationPhase(3);
    playSound("destroy");
    setInitialStyle(position);

    setTimeout(() => {
      setPopupStyle(position);

      setTimeout(() => {
        setBuzzingStyle(position);

        setTimeout(() => {
          setFadeOutStyle(position);

          setTimeout(() => {
            if (isEffect) {
              runEffectAnimation();
            } else {
              completeAnimation();
            }
          }, 300);
        }, 500); // Duration of the buzz effect
      }, 200); // Time to settle before buzzing
    }, 50); // Very short delay before starting the pop-up
  };

  const runEffectAnimation = () => {
    setAnimationPhase(1);
    playSound("specialEffect");
    setInitialStyle(position);

    setTimeout(() => {
      setPopupStyle(position);

      setTimeout(() => {
        setNormalStyle(position);

        setTimeout(() => {
          setAnimationPhase(2);
          setMoveToTargetStyle(targetPosition);

          setTimeout(() => {
            completeAnimation();
          }, 600); // Match the transition duration
        }, 400); // Wait time before moving to target
      }, 200); // Time to settle back to normal size
    }, 50);
  };

  const runRewardAnimation = () => {
    setAnimationPhase(1);
    playSound("coin");
    setInitialStyle(position);

    setTimeout(() => {
      setPopupStyle(position);

      setTimeout(() => {
        setNormalStyle(position);

        setTimeout(() => {
          setAnimationPhase(2);
          setMoveToTargetStyle(targetPosition);

          setTimeout(() => {
            completeAnimation();
          }, 600); // Match the transition duration
        }, 400); // Wait time before moving to target
      }, 200); // Time to settle back to normal size
    }, 50);
  };

  const startAnimation = () => {
    if (!isAnimating) {
      // Generate a unique ID for this animation instance
      const animationId = `${id}-${Date.now()}`;
      animationIdRef.current = animationId;

      // Add this animation to active animations
      activeAnimations.add(animationId);

      setIsAnimating(true);

      if (isDestroy) {
        runDestroyAnimation();
      } else if (isEffect) {
        runEffectAnimation();
      } else {
        runRewardAnimation();
      }
    }
  };

  return {
    isAnimating,
    animationPhase,
    style,
    animationIdRef,
    startAnimation,
    completeAnimation,
  };
}
