"use client";

import { useState } from "react";
import { useGameState } from "@/context/GameStateProvider";
import { useAudio } from "@/context/AudioProvider";
import Modal from "@/components/ui/Modal";
import Symbol from "@/components/game/Symbol";
import styles from "@/styles/RemoveTokenModal.module.css";

type RemoveTokenModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function RemoveTokenModal({
  isOpen,
  onClose,
}: RemoveTokenModalProps) {
  const { state, dispatch } = useGameState();
  const { playSound } = useAudio();
  const [selectedSymbolId, setSelectedSymbolId] = useState<string | null>(null);

  const handleSelectSymbol = (tempId: string) => {
    setSelectedSymbolId(tempId === selectedSymbolId ? null : tempId);
  };

  const handleRemoveSymbol = () => {
    if (selectedSymbolId && state.removeTokens > 0) {
      dispatch({
        type: "REMOVE_SYMBOL",
        payload: { symbolId: selectedSymbolId },
      });
      dispatch({ type: "USE_REMOVE_TOKEN" });
      playSound("remove");
      setSelectedSymbolId(null);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className={styles.removeTokenModal}
    >
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Remove Symbol</h2>
        <p className={styles.modalDescription}>
          Select a symbol to permanently remove from your inventory.
          <br />
          You have {state.removeTokens} remove{" "}
          {state.removeTokens === 1 ? "token" : "tokens"}.
        </p>

        <div className={styles.symbolsGrid}>
          {state.symbols.map((symbol) => (
            <div
              key={symbol.tempId}
              className={`${styles.symbolItem} ${
                selectedSymbolId === symbol.tempId ? styles.selected : ""
              }`}
              onClick={() => handleSelectSymbol(symbol.tempId || "")}
            >
              <Symbol symbol={symbol} />
              <div className={styles.symbolName}>{symbol.name}</div>
            </div>
          ))}
        </div>

        <div className={styles.buttonContainer}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button
            className={styles.removeButton}
            onClick={handleRemoveSymbol}
            disabled={!selectedSymbolId || state.removeTokens <= 0}
          >
            Remove Symbol
          </button>
        </div>
      </div>
    </Modal>
  );
}
