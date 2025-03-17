import { useEffect } from "react";
import { effectResult, Symbol } from "@/types/game";
import { totalDelayUntilPos, calculateAnimationDelay } from "@/lib/utils";
export const ANIMATION_DELAYS = {
  BASE_DELAY: 0,
  EFFECT_MULTIPLIER: 1.5,
  DESTROY_MULTIPLIER: 1.2,
  STANDARD_REWARD_DELAY: 1000,
  EFFECT_DURATION: 1000, // 1.5 * 1.2 * 1000
  DESTROY_DURATION: 1200,
  STANDARD_DURATION: 1000,
};

type AnimationTimersProps = {
  showReward: boolean;
  isSpinning: boolean;
  tutorialSeen: boolean;
  position: number;
  effectGrid: (effectResult | null)[];
  setTriggerEffectReward: (value: boolean) => void;
  setTriggerReward: (value: boolean) => void;
  symbol: Symbol | null;
};

export function useAnimationTimers({
  showReward,
  isSpinning,
  tutorialSeen,
  position,
  effectGrid,
  setTriggerEffectReward,
  setTriggerReward,
  symbol,
}: AnimationTimersProps) {

  useEffect(() => {
    // Skip if no reward to show, still spinning, or tutorial not seen
    if (!showReward || isSpinning || !tutorialSeen || !symbol || effectGrid.length === 0) {
      return;
    }

    // Setup timers for animations
    const timers: NodeJS.Timeout[] = [];

    const currentEffect = effectGrid[position];
    const hasEffectBonus =
      currentEffect?.bonusValue !== undefined && currentEffect.bonusValue > 0;
    const isDestroy = currentEffect?.isDestroyed ?? false;

    // Calculate base effect delay from previous cells
    const baseEffectDelay =
      totalDelayUntilPos(effectGrid, position) 

    if (hasEffectBonus || isDestroy) {
      const effectTimer = setTimeout(() => {
        setTriggerEffectReward(true);
      }, baseEffectDelay);
      timers.push(effectTimer);
    }

    // Then show reward animations after all effects
    // Calculate total effect delay including current cell if it has an effect
    const totalEffectDelay = totalDelayUntilPos(effectGrid, 20);
    console.log(totalEffectDelay, symbol.id);
    if (symbol.value !== 0) {
      const rewardTimer = setTimeout(() => {
        setTriggerReward(true);
      }, totalEffectDelay);
      timers.push(rewardTimer);
    }

    // Cleanup function
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [
    showReward,
    isSpinning,
    tutorialSeen,
    position,
    effectGrid,
    calculateAnimationDelay,
    setTriggerEffectReward,
    setTriggerReward,
  ]);
}
