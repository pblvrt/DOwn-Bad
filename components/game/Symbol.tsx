"use client";

import { useState } from "react";
import { Symbol } from "@/types/game";
import styles from "@/styles/GameCell.module.css";
import SymbolModal from "./SymbolModal";

type SymbolProps = {
  symbol: Symbol | null;
};

export default function SymbolComponent({ symbol }: SymbolProps) {
  const [showModal, setShowModal] = useState(false);

  if (!symbol) {
    return (
      <div className={`${styles.cellContainer} ${styles.cellEmpty}`}></div>
    );
  }

  const handleClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div onClick={handleClick}>
      <div className={styles.symbolEmoji}>{symbol.emoji}</div>
      {showModal && (
        <SymbolModal
          symbol={symbol}
          onClose={closeModal}
          isOpen={showModal}
        />
      )}
    </div>
  );
}
