"use client";
import { GameStateProvider } from "@/context/GameStateProvider";
import GameBoard from "@/components/game/GameBoard";
import Header from "@/components/ui/Header";
import SpinButton from "@/components/game/SpinButton";
import Shop from "@/components/shop/Shop";
import styles from "@/styles/Home.module.css";
import ProgressBar from "@/components/ui/ProgressBar";
import LostModal from "@/components/ui/LostModal";
import Inventory from "@/components/game/Inventory";
import IntroModal from "@/components/ui/IntroModal";
import StageCompleteModal from "@/components/ui/StageCompleteModal";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

export default function Home() {
  return (
    <GameStateProvider>
      <ServiceWorkerRegistration />
      <div className={styles.gameContainer}>
        <LostModal />
        <IntroModal />
        <StageCompleteModal />
        <Shop />
        <Header />
        <GameBoard />
        <Inventory />
        <ProgressBar />
        <div className={styles.spinButtonContainer}>
          <SpinButton />
        </div>
        <div className={styles.actionButtons}>
          <button className={styles.actionButton}>
            <span className={styles.notificationBadge}>7</span>
            📋
          </button>
          <button className={styles.actionButton}>
            <span className={styles.notificationBadge}>7</span>
            🔔
          </button>
        </div>
        <div className={styles.bottomNav}>
          <div className={styles.navItem}>
            <span className={styles.navBadge}>3</span>
            🍊
          </div>
          <div className={styles.navItem}>📱</div>
          <div className={styles.navItem}>🔄</div>
          <div className={styles.navItem}>⭐</div>
          <div className={styles.navItem}>
            <span className={styles.navBadge}>2</span>
            🏪
          </div>
        </div>

        {/* Audio elements */}
        <audio id="spin-sound" src="/sounds/spin.mp3" preload="auto"></audio>
        <audio id="coin-sound" src="/sounds/coin.mp3" preload="auto"></audio>
        <audio
          id="purchase-sound"
          src="/sounds/purchase.mp3"
          preload="auto"
        ></audio>
        <audio id="rent-sound" src="/sounds/rent.mp3" preload="auto"></audio>
        <audio
          id="gameover-sound"
          src="/sounds/gameover.mp3"
          preload="auto"
        ></audio>
      </div>
    </GameStateProvider>
  );
}
