import { useRef, useEffect } from "react";

export function useSoundEffects(soundUrl?: string, isDestroy = false) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const destroyAudioRef = useRef<HTMLAudioElement | null>(null);
  let isPlayingRewardSound = false;

  // Initialize audio elements
  useEffect(() => {
    if (soundUrl) {
      audioRef.current = new Audio(soundUrl);
    }
    if (isDestroy) {
      destroyAudioRef.current = new Audio("/sounds/destroy.mp3");
    }

    return () => {
      // Clean up audio resources
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (destroyAudioRef.current) {
        destroyAudioRef.current.pause();
        destroyAudioRef.current = null;
      }
    };
  }, [soundUrl, isDestroy]);

  // Play sound function
  const playSound = () => {
    if (audioRef.current && !isPlayingRewardSound) {
      isPlayingRewardSound = true;
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .catch((err) => console.error("Error playing sound:", err))
        .finally(() => {
          setTimeout(() => {
            isPlayingRewardSound = false;
          }, 500);
        });
    }
  };

  // Play destroy sound function
  const playDestroySound = () => {
    if (destroyAudioRef.current) {
      destroyAudioRef.current.currentTime = 0;
      destroyAudioRef.current
        .play()
        .catch((err) => console.error("Error playing destroy sound:", err));
    }
  };

  return { playSound, playDestroySound };
}
