"use client";

import { useState } from "react";
import { Symbol } from "@/types/game";
import styles from "@/styles/GameCell.module.css";
import SymbolModal from "./SymbolModal";

type GameCellProps = {
  index: number;
  symbol: Symbol | null;
};

export default function GameCell({ symbol }: GameCellProps) {
  const [showModal, setShowModal] = useState(false);

  if (!symbol) {
    return (
      <div className={`${styles.cellContainer} ${styles.cellEmpty}`}></div>
    );
  }

  const rarityStyles = {
    common: styles.cellCommon,
    uncommon: styles.cellUncommon,
    rare: styles.cellRare,
  };

  const handleClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div
        className={`${styles.cellContainer}`}
        onClick={handleClick}
      >
        <div className={styles.symbolEmoji}>{symbol.emoji}</div>
      </div>

      {showModal && <SymbolModal symbol={symbol} onClose={closeModal} />}
    </>
  );
}
