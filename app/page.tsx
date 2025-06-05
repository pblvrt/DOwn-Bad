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
import AudioInitializer from "@/components/AudioInitializer";
import { AudioProvider } from "@/context/AudioProvider";
import SettingsModal from "@/components/ui/SettingsModal";
import Navigation from "@/components/ui/Navigation";

export default function Home() {
  return (
    <GameStateProvider>
      <AudioProvider>
        <ServiceWorkerRegistration />
        <AudioInitializer />
        <div className={styles.gameContainer}>
          <LostModal />
          <IntroModal />
          <StageCompleteModal />
          <SettingsModal />
          <Shop />
          <Header />
          <GameBoard />
          <Inventory />
          <ProgressBar />
          <div className={styles.spinButtonContainer}>
            <SpinButton />
          </div>
          <Navigation />
        </div>
      </AudioProvider>
    </GameStateProvider>
  );
}
