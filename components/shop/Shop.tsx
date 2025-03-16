"use client";

import { useGameState } from "@/context/GameStateProvider";
import { getRandomSymbol } from "@/lib/symbols";
import ShopItem from "./ShopItem";
import { useEffect, useState } from "react";
import { Symbol } from "@/types/game";
import styles from "@/styles/Shop.module.css";

export default function Shop() {
  const { state, dispatch } = useGameState();
  const [shopItems, setShopItems] = useState<Symbol[]>([]);

  // Add debugging
  console.log("Shop component rendered, shopOpen:", state.shopOpen);

  useEffect(() => {
    // Generate 3 random symbols for the shop
    setShopItems([getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]);
  }, []);

  const handlePurchase = (symbol: Symbol) => {
    // Add the symbol to the player's collection
    dispatch({ type: "ADD_SYMBOL", payload: symbol });

    // Play purchase sound
    const audio = document.getElementById("purchase-sound") as HTMLAudioElement;
    if (state.soundEnabled && audio) {
      audio.currentTime = 0;
      audio.play().catch((e) => console.log("Error playing sound:", e));
    }
    dispatch({ type: "CLOSE_SHOP" });
  };

  if (!state.shopOpen) {
    return null;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Symbol Shop</h2>

        <div className={styles.shopItems}>
          {shopItems.map((item, index) => (
            <ShopItem
              key={index}
              symbol={item}
              onPurchase={() => handlePurchase(item)}
            />
          ))}
        </div>

        <button
          onClick={() => dispatch({ type: "CLOSE_SHOP" })}
          className={styles.skipButton}
        >
          Skip
        </button>
      </div>
    </div>
  );
}
