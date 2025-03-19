"use client";

import { useGameState } from "@/context/GameStateProvider";
import styles from "@/styles/Navigation.module.css";

export default function Navigation() {
  const { state, dispatch } = useGameState();

  const handleOpenSettings = () => {
    dispatch({ type: "TOGGLE_SETTINGS" });
  };

  const handleOpenShop = () => {
    dispatch({ type: "TOGGLE_SHOP" });
  };

  const handleRestart = () => {
    if (window.confirm("Are you sure you want to restart the game?")) {
      dispatch({ type: "RESET_GAME" });
    }
  };

  return (
    <div className={styles.bottomNav}>

      <div className={styles.navItem} onClick={handleOpenSettings}>
        ⚙️
      </div>

    </div>
  );
}
