"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/IntroModal.module.css";
import Modal from "@/components/ui/Modal";
import { useGameState } from "@/context/GameStateProvider";

export default function IntroModal() {
  const { state, dispatch } = useGameState();
  const [isOpen, setIsOpen] = useState(true);

  // Close the modal and mark tutorial as seen
  const handleClose = () => {
    setIsOpen(false);
    dispatch({ type: "SET_TUTORIAL_SEEN" });

    // Start the game
    dispatch({ type: "START_GAME" });
  };

  // Check if tutorial has been seen before
  useEffect(() => {
    if (state.tutorialSeen) {
      setIsOpen(false);
    }
  }, [state.tutorialSeen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Welcome to Symbol Slots!"
      className={styles.introModal}
    >
      <div className={styles.modalContent}>
        <div className={styles.introSection}>
          <h3>🎮 How to Play</h3>
          <p>Welcome anon - its a bear market out here and you are in the brink of getting liquidated.</p>
          <p>Earn enough coins before you run out of turns to increase you liquidation threshold before its too late.</p>
        </div>

        {/* <div className={styles.introSection}>
          <h3>💰 Special Symbols</h3>
          <p>Look out for special symbols with unique effects:</p>
          <div className={styles.symbolGrid}>
            <div className={styles.symbolItem}>
              <span className={styles.symbolEmoji}>🍀</span>
              <span>Luck</span>
            </div>
            <div className={styles.symbolItem}>
              <span className={styles.symbolEmoji}>💎</span>
              <span>Bonus</span>
            </div>
            <div className={styles.symbolItem}>
              <span className={styles.symbolEmoji}>🔄</span>
              <span>Respin</span>
            </div>
            <div className={styles.symbolItem}>
              <span className={styles.symbolEmoji}>⭐</span>
              <span>Wild</span>
            </div>
          </div>
        </div> */}

        <div className={styles.introSection}>
          <h3>🏆 Goal</h3>
          <p>See how many floors you can climb before you run out of coins!</p>
        </div>

        <button onClick={handleClose} className={styles.startButton}>
          Start Playing!
        </button>
      </div>
    </Modal>
  );
}
