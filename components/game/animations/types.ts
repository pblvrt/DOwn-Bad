export interface RewardAnimationProps {
  value: number;
  isTriggered: boolean;
  onAnimationComplete: () => void;
  position: { x: number; y: number };
  targetPosition: { x: number; y: number };
  isEffect?: boolean;
  effectDescription?: string;
  soundUrl?: string;
  isDestroy?: boolean;
  id?: string;
}

// Track active animations globally
export const activeAnimations = new Set<string>();

// Global flag for sound management
