"use client";

import { useGameState } from "@/context/GameStateProvider";
import { useAudio } from "@/context/AudioProvider";
import { getRandomSymbol } from "@/lib/gameLogic";
import ShopItem from "./ShopItem";
import { useEffect, useState } from "react";
import { Symbol } from "@/types/game";
import styles from "@/styles/Shop.module.css";
import Modal from "@/components/ui/Modal";
import Inventory from "../game/Inventory";

export default function Shop() {
  const { state, dispatch } = useGameState();
  const { playSound } = useAudio();
  const [shopItems, setShopItems] = useState<Symbol[]>([]);

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

    // Play purchase sound
    playSound("purchase");

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
