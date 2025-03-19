"use client";

import { useState, useEffect } from "react";
import styles from "@/styles/SettingsModal.module.css";
import Modal from "@/components/ui/Modal";
import { useGameState } from "@/context/GameStateProvider";
import { useAudio } from "@/context/AudioProvider";

export default function SettingsModal() {
  const { state, dispatch } = useGameState();
  const { isMuted, toggleMute } = useAudio();

  const handleClose = () => {
    dispatch({ type: "CLOSE_SETTINGS" });
  };

  const handleRestart = () => {
    if (
      window.confirm(
        "Are you sure you want to restart the game? All progress will be lost."
      )
    ) {
      dispatch({ type: "RESET_GAME" });
    }
  };

  const handleToggleMute = () => {
    toggleMute();
  };

  return (
    <Modal
      isOpen={state.settingsOpen}
      onClose={handleClose}
      className={styles.settingsModal}
    >
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Settings</h2>

        <div className={styles.settingItem}>
          <span>Sound</span>
          <button onClick={handleToggleMute} className={styles.toggleButton}>
            {isMuted ? "🔇 Unmute" : "🔊 Mute"}
          </button>
        </div>

        <div className={styles.settingItem}>
          <span>Game Progress</span>
          <button onClick={handleRestart} className={styles.dangerButton}>
            🔄 Restart Game
          </button>
        </div>

        <div className={styles.settingItem}>
          <span>Install App</span>
          <p className={styles.installText}>
            For the best experience, add this app to your home screen.
          </p>
        </div>

        <button onClick={handleClose} className={styles.closeButton}>
          Close
        </button>
      </div>
    </Modal>
  );
}
