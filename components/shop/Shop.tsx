"use client";

import { useGameState } from "@/context/GameStateProvider";
import { getRandomSymbol } from "@/lib/gameLogic";
import ShopItem from "./ShopItem";
import { useEffect, useState } from "react";
import { Symbol } from "@/types/game";
import styles from "@/styles/Shop.module.css";
import Modal from "@/components/ui/Modal";
import Inventory from "../game/Inventory";

// Audio context and buffer at module level
let audioContext: AudioContext | null = null;
let coinBuffer: AudioBuffer | null = null;

export default function Shop() {
  const { state, dispatch } = useGameState();
  const [shopItems, setShopItems] = useState<Symbol[]>([]);

  // Initialize audio context and load coin sound
  useEffect(() => {
    if (!audioContext) {
      audioContext = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();

      // Load coin sound
      fetch("/coins.wav")
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => audioContext!.decodeAudioData(arrayBuffer))
        .then((buffer) => {
          coinBuffer = buffer;
          console.log("Coin sound loaded in Shop");
        })
        .catch((error) => {
          console.error("Error loading coin sound in Shop:", error);
        });
    }

    return () => {
      // No need to close audioContext here as it's shared
    };
  }, []);

  // Function to play coin sound
  const playCoinSound = () => {
    if (!audioContext || !coinBuffer || !state.soundEnabled) {
      return;
    }

    // Resume audio context if suspended
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    // Create new source for coin sound
    const coinSource = audioContext.createBufferSource();
    coinSource.buffer = coinBuffer;

    // Create gain node for volume control
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.7; // 70% volume

    // Connect nodes
    coinSource.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Play the coin sound once
    coinSource.start(0);
  };

  // Regenerate shop items when shop is opened
  useEffect(() => {
    if (state.shopOpen) {
      // Generate new shop items based on floor/rent paid
      const newShopItems = Array(3)
        .fill(null)
        .map(
          () => getRandomSymbol(state.floor) // Pass floor as timeRentPaid
        );
      setShopItems(newShopItems);
    }
  }, [state.shopOpen, state.floor]);

  const handlePurchase = (symbol: Symbol) => {
    // Add the symbol to the player's collection
    dispatch({
      type: "ADD_SYMBOL",
      payload: {
        ...symbol,
        tempId: crypto.randomUUID(),
      },
    });

    // Play coin sound
    playCoinSound();

    dispatch({ type: "CLOSE_SHOP" });
  };

  const handleClose = () => {
    dispatch({ type: "CLOSE_SHOP" });
  };

  return (
    <>

      <Modal
        key="shop"
        isOpen={state.shopOpen}
        onClose={handleClose}
        className={styles.shopModal}
      >
        <div className={styles.modalHeader}>
          <div className={styles.infoItem}>
            <span>
              Symbol Count:{" "}
              <span className={styles.redText}>{state.symbols.length}</span>
            </span>
          </div>
          <div className={styles.infoItem}>
            <span>
              Luck Modifier: <span className={styles.luckText}>x1.32 🍀</span>
            </span>
          </div>
        </div>

        <div className={styles.shopItems}>
          {shopItems.map((item, index) => (
            <ShopItem
              key={index}
              symbol={item}
              onPurchase={() => handlePurchase(item)}
            />
          ))}
        </div>
        <Inventory />

        <div className={styles.shopFooter}>
          <div className={styles.buttonGroup}>
            <button onClick={handleClose} className={styles.skipButton}>
              Skip
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
