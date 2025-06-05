"use client";

import { useGameState } from "@/context/GameStateProvider";
import styles from "@/styles/Navigation.module.css";

export default function Navigation() {
  const { state, dispatch } = useGameState();

  const handleOpenSettings = () => {
    dispatch({ type: "TOGGLE_SETTINGS" });
  };

  return (
    <div className={styles.bottomNav}>
      <div className={styles.navItem} onClick={handleOpenSettings}>
        ⚙️
      </div>
    </div>
  );
}
