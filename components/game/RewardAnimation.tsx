"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "@/styles/RewardAnimation.module.css";

interface RewardAnimationProps {
  value: number;
  isTriggered: boolean;
  onAnimationComplete: () => void;
  position: { x: number; y: number };
  targetPosition: { x: number; y: number };
  isEffect?: boolean;
  effectDescription?: string;
  soundUrl?: string;
}

// Add this at the top level of the file, outside the component
let isPlayingRewardSound = false;

export default function RewardAnimation({
  value,
  isTriggered,
  onAnimationComplete,
  position,
  targetPosition,
  isEffect = false,
  effectDescription = "",
  soundUrl,
}: RewardAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0); // 0: not started, 1: appear, 2: move
  const [style, setStyle] = useState({});
  const [isMounted, setIsMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Handle client-side rendering for createPortal
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Initialize audio element
  useEffect(() => {
    if (isMounted && soundUrl) {
      audioRef.current = new Audio(soundUrl);
    }
  }, [isMounted, soundUrl]);

  // Play sound function
  const playSound = () => {
    if (audioRef.current && !isPlayingRewardSound) {
      isPlayingRewardSound = true;
      audioRef.current.currentTime = 0; // Reset to start
      audioRef.current
        .play()
        .catch((err) => console.error("Error playing sound:", err))
        .finally(() => {
          // Set a timeout to reset the flag after the sound duration
          // Using 1 second as an example duration - adjust as needed
          setTimeout(() => {
            isPlayingRewardSound = false;
          }, 500);
        });
    }
  };

  useEffect(() => {
    if (isTriggered && !isAnimating) {
      setIsAnimating(true);
      setAnimationPhase(1);

      // Play sound when animation starts
      playSound();

      // Initial position (where the symbol is) with a pop-up effect
      setStyle({
        left: `${position.x}px`,
        top: `${position.y}px`,
        opacity: 0,
        transform: "scale(0.5) translateY(10px)",
      });

      // First phase: Pop up and become visible
      setTimeout(() => {
        setStyle({
          left: `${position.x}px`,
          top: `${position.y}px`,
          opacity: 1,
          transform: "scale(1.2) translateY(-10px)",
          transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        });

        // Settle back to normal size
        setTimeout(() => {
          setStyle({
            left: `${position.x}px`,
            top: `${position.y}px`,
            opacity: 1,
            transform: "scale(1) translateY(0)",
            transition: "all 0.2s ease-out",
          });

          // Wait period before moving to target
          setTimeout(() => {
            setAnimationPhase(2);
            // Second phase: Move to target
            setStyle({
              left: `${targetPosition.x}px`,
              top: `${targetPosition.y}px`,
              opacity: 0,
              transform: "scale(0.5) translateY(-20px)",
              transition: "all 1.2s cubic-bezier(0.25, 0.1, 0.25, 1)",
            });

            // When animation is complete
            setTimeout(() => {
              setIsAnimating(false);
              setAnimationPhase(0);
              onAnimationComplete();
            }, 1200); // Match the transition duration
          }, 800); // Wait time before moving to target
        }, 200); // Time to settle back to normal size
      }, 50); // Very short delay before starting the pop-up
    }
  }, [isTriggered, isAnimating, position, targetPosition, onAnimationComplete]);

  if (!isAnimating || !isMounted) return null;

  const animationElement = (
    <div className={styles.rewardAnimationContainer} style={style}>
      {isEffect && effectDescription && (
        <div className={styles.effectDescription}>{effectDescription}</div>
      )}
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
      <div
        className={`${styles.rewardCoin} ${
          animationPhase === 2 ? styles.movePhase : ""
        } ${isEffect ? styles.effectCoin : ""}`}
      >
        {isEffect ? "✨" : "🪙"}
      </div>
    </div>
  );

  // Use createPortal to render at document body level
  return createPortal(animationElement, document.body);
}
