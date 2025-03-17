import { useState, useEffect } from "react";

export function useAnimationPositions(
  ref: React.RefObject<HTMLDivElement | null>,
  showReward: boolean,
  isSpinning: boolean,
  tutorialSeen: boolean
) {
  const [symbolPosition, setSymbolPosition] = useState({ x: 0, y: 0 });
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Skip if no reward to show, still spinning, or tutorial not seen
    if (!showReward || isSpinning || !tutorialSeen) {
      return;
    }

    // Calculate positions for animations
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setSymbolPosition({
        x: rect.left + rect.width / 2 - 30, // Center the animation
        y: rect.top + rect.height / 2 - 30,
      });
    }

    const rewardBar = document.getElementById("reward-bar");
    if (rewardBar) {
      const rewardRect = rewardBar.getBoundingClientRect();
      setTargetPosition({
        x: rewardRect.left + rewardRect.width / 2 - 30,
        y: rewardRect.top + rewardRect.height / 2 - 30,
      });
    }
  }, [showReward, isSpinning, tutorialSeen, ref]);

  return { symbolPosition, targetPosition };
}
