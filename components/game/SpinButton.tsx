"use client";

import { useGameState } from "@/context/GameStateProvider";
import { spinGrid } from "@/lib/gameLogic";

type SpinButtonProps = {
  onSpin: () => void;
};

export default function SpinButton({ onSpin }: SpinButtonProps) {
  const { state, dispatch } = useGameState();

  const handleSpin = () => {
    // Play spin sound
    const audio = document.getElementById("spin-sound") as HTMLAudioElement;
    if (state.soundEnabled && audio) {
      audio.currentTime = 0;
      audio.play().catch((e) => console.log("Error playing sound:", e));
    }

    const {
      grid: newGrid,
      baseCoins,
      bonusCoins,
    } = spinGrid(state.grid, state.symbols);

    dispatch({ type: "UPDATE_GRID", payload: newGrid });

    // After spinning animation completes
    setTimeout(() => {

      // Show base coins animation with direct DOM manipulation
      setTimeout(() => {
        // Create and show floating coin text for base coins
        showFloatingCoins(baseCoins);

        // Play coin sound
        playCoinSound(state.soundEnabled);

        // Update coins in state
        dispatch({ type: "ADD_COINS", payload: baseCoins });

        // Handle bonus coins if any
        if (bonusCoins > 0) {
          setTimeout(() => {
            // Create and show floating coin text for bonus coins
            showFloatingCoins(bonusCoins, true);

            // Play coin sound again
            playCoinSound(state.soundEnabled);

            // Update coins with bonus
            dispatch({ type: "ADD_COINS", payload: bonusCoins });

            // Finally decrease turns and show shop
            setTimeout(() => {
              dispatch({ type: "DECREASE_TURNS" });
              onSpin();
            }, 600);
          }, 800);
        } else {
          // No bonus coins, just decrease turns and show shop
          setTimeout(() => {
            dispatch({ type: "DECREASE_TURNS" });
            onSpin();
          }, 600);
        }
      }, 400);
    }, 1000); // Total spin animation time
  };

  // Helper function to show floating coins animation
  const showFloatingCoins = (amount: number, isBonus = false) => {
    // Get the coin display element
    const coinDisplay = document.getElementById("coin-count");
    if (!coinDisplay) return;

    // Add the coin-pop animation class
    coinDisplay.classList.add("animate-coin-pop");

    // Create a floating text element
    const floatingText = document.createElement("div");
    floatingText.textContent = `+${amount}`;
    floatingText.className = "absolute text-xl font-bold animate-float-up";
    floatingText.style.color = isBonus ? "#facc15" : "#ffffff"; // Yellow for bonus
    floatingText.style.left = `${
      coinDisplay.offsetLeft + coinDisplay.offsetWidth / 2
    }px`;
    floatingText.style.top = `${coinDisplay.offsetTop}px`;
    floatingText.style.zIndex = "50";

    // Add to document
    document.body.appendChild(floatingText);

    // Remove animation class after animation completes
    setTimeout(() => {
      coinDisplay.classList.remove("animate-coin-pop");
    }, 500);

    // Remove floating text after animation
    setTimeout(() => {
      document.body.removeChild(floatingText);
    }, 1000);
  };

  // Helper function to play coin sound
  const playCoinSound = (soundEnabled: boolean) => {
    const coinAudio = document.getElementById("coin-sound") as HTMLAudioElement;
    if (soundEnabled && coinAudio) {
      coinAudio.currentTime = 0;
      coinAudio.play().catch((e) => console.log("Error playing sound:", e));
    }
  };

  return (
    <button
      onClick={handleSpin}
      className="bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-3 rounded-full 
                text-xl font-bold shadow-lg hover:from-amber-600 hover:to-amber-700 
                transition-colors transform hover:scale-105 active:scale-95"
    >
      SPIN
    </button>
  );
}
