"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/IntroModal.module.css";
import Modal from "@/components/ui/Modal";
import { useGameState } from "@/context/GameStateProvider";

// Audio context and related refs at module level
let audioContext: AudioContext | null = null;
let audioBuffer: AudioBuffer | null = null;
let audioSource: AudioBufferSourceNode | null = null;

export default function IntroModal() {
  const { state, dispatch } = useGameState();
  const [isOpen, setIsOpen] = useState(true);

  // Preload audio when component mounts
  useEffect(() => {
    // Create audio context
    audioContext = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();

    // Load audio file
    fetch("/background.wav")
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => audioContext!.decodeAudioData(arrayBuffer))
      .then((buffer) => {
        audioBuffer = buffer;
        console.log("Background music loaded successfully");
      })
      .catch((error) => {
        console.error("Error loading background music:", error);
      });

    return () => {
      if (audioSource) {
        audioSource.stop();
      }
      if (audioContext && audioContext.state !== "closed") {
        audioContext.close();
      }
    };
  }, []);

  // Function to play background music
  const playBackgroundMusic = () => {
    if (!audioContext || !audioBuffer) {
      console.log("Audio not ready yet");
      return;
    }

    // Resume audio context if suspended
    if (audioContext.state === "suspended") {
      audioContext.resume().then(() => {
        console.log("AudioContext resumed successfully");
      });
    }

    // Stop any existing playback
    if (audioSource) {
      audioSource.stop();
    }

    // Create new source
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.loop = true;

    // Create gain node for volume control
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.5; // 50% volume

    // Connect nodes
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Start playback
    source.start(0);
    audioSource = source;
    console.log("Background music started playing");
  };

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
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Welcome to Symbol Slots!"
      className={styles.introModal}
    >
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
