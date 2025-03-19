"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/StageCompleteModal.module.css";
import Modal from "@/components/ui/Modal";
import { useGameState } from "@/context/GameStateProvider";
import { useAudio } from "@/context/AudioProvider";

export default function StageCompleteModal() {
  const { state, dispatch } = useGameState();
  const { playSound } = useAudio();
  const [isOpen, setIsOpen] = useState(false);
  const [stageData, setStageData] = useState({
    floor: 0,
    rentPaid: 0,
    nextRent: 0,
  });

  // Show modal when stage is completed
  useEffect(() => {
    if (state.stageComplete) {
      setStageData({
        floor: state.floor,
        rentPaid: state.rentSchedule[state.floor - 1]?.rent || 0,
        nextRent: state.rentSchedule[state.floor]?.rent || 0,
      });
      setIsOpen(true);

      // Play success sound
      playSound("success");
    } else {
      setIsOpen(false);
    }
  }, [state.stageComplete, state.floor, state.rentSchedule]);

  const handleContinue = () => {
    dispatch({ type: "CLOSE_COMPLETED_STAGE" });
    setIsOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleContinue}
      className={styles.stageModal}
    >
      <div className={styles.modalContent}>
        <div className={styles.stageInfo}>
          <h3>Floor {stageData.floor} Completed!</h3>
          <p className={styles.rentInfo}>
            Rent paid:{" "}
            <span className={styles.rentAmount}>{stageData.rentPaid} 🪙</span>
          </p>
        </div>

        <div className={styles.rewardsSection}>
          <h4>Rewards</h4>
          <div className={styles.rewardsList}>
            <div className={styles.rewardItem}>
              <span className={styles.rewardIcon}>⭐</span>
              <span className={styles.rewardText}>Luck Increased: +0.05</span>
            </div>
          </div>
        </div>

        <div className={styles.nextStageInfo}>
          <h4>Next Floor</h4>
          <p>
            Rent will be{" "}
            <span className={styles.nextRent}>{stageData.nextRent} 🪙</span>
          </p>
          <p className={styles.tipText}>
            Tip: Visit the shop to get better symbols!
          </p>
        </div>

        <div className={styles.buttonGroup}>
          <button onClick={handleContinue} className={styles.continueButton}>
            Continue
          </button>
        </div>
      </div>
    </Modal>
  );
}
