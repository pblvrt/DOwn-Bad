"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/IntroModal.module.css";
import Modal from "@/components/ui/Modal";
import { useGameState } from "@/context/GameStateProvider";
import { useAudio } from "@/context/AudioProvider";

export default function IntroModal() {
  const { state, dispatch } = useGameState();
  const { playBackgroundMusic } = useAudio();
  const [isOpen, setIsOpen] = useState(true);

  // Close the modal and mark tutorial as seen
  const handleClose = () => {
    setIsOpen(false);
    dispatch({ type: "SET_TUTORIAL_SEEN" });

    // Start the game
    dispatch({ type: "START_GAME" });

    // Start background music when game starts
    playBackgroundMusic();
  };

  // Check if tutorial has been seen before
  useEffect(() => {
    if (state.tutorialSeen) {
      setIsOpen(false);
    }
  }, [state.tutorialSeen]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className={styles.introModal}>
      <div className={styles.modalContent}>
        <div className={styles.introSection}>
          <h3>🎮 How to Play</h3>
          <p>
            Welcome anon - its a bear market out here and you are in the brink
            of getting liquidated.
          </p>
          <p>
            Earn enough coins before you run out of turns to increase you
            liquidation threshold before its too late.
          </p>
        </div>

        <div className={styles.introSection}>
          <h3> PWA support </h3>
          <p>
            For the best experience, install this app on your phone by adding it
            to your home screen from the share menu.
          </p>
        </div>

        <button onClick={handleClose} className={styles.startButton}>
          Start Playing!
        </button>
      </div>
    </Modal>
  );
}
