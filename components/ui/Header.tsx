"use client";
import Image from "next/image";
import styles from "@/styles/Header.module.css";
import { useGameState } from "@/context/GameStateProvider";

export default function Header() {
  const { state } = useGameState();
  const { coins } = state;

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <Image
          src="/logo.svg"
          alt="Spinmoji Logo"
          width={150}
          height={50}
          priority
        />
      </div>
      <div className={styles.coinContainer}>
        <span className={styles.coinIcon}>🪙</span>
        <span className={styles.coinCount}>{coins}</span>
      </div>
    </header>
  );
}
