import React from "react";
import Modal from "@/components/ui/Modal";
import styles from "@/styles/InfoModal.module.css";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  effectType: string;
}

const effectDescriptions: Record<
  string,
  {
    title: string;
    description: string;
    example?: string;
    animation?: React.ReactNode;
  }
> = {
  destroys: {
    title: "Destroy Effect",
    description: "Permanently destroys an adjacent symbol. ",
    example:
      "For example, Milk is destroyed by the Cat, which gives 9 coins for each Milk destroyed.",
    animation: (
      <div className={styles.animationContainer}>
        <div className={styles.gridExample}>
          <div className={styles.gridCell}></div>
          <div className={styles.gridCell}>🥛</div>
          <div className={styles.gridCell}></div>
          <div className={styles.gridCell}>🥛</div>
          <div className={styles.gridCell}>🐱</div>
          <div className={styles.gridCell}></div>
          <div className={styles.gridCell}></div>
          <div className={styles.gridCell}></div>
          <div className={styles.gridCell}></div>
        </div>
        <div className={styles.addsArrow}>→</div>
        <div className={styles.gridExample}>
          <div className={styles.gridCell}></div>
          <div className={styles.gridCell}>💥</div>
          <div className={styles.gridCell}></div>
          <div className={styles.gridCell}>💥</div>
          <div className={styles.gridCell}>🐱</div>
          <div className={styles.gridCell}></div>
          <div className={styles.gridCell}></div>
          <div className={styles.gridCell}></div>
          <div className={styles.gridCell}></div>
        </div>
        <div className={styles.destroyEffect}>
          <div className={styles.coinReward}>+18 🪙</div>
        </div>
      </div>
    ),
  },
  grow: {
    title: "Growth Effect",
    description:
      "Some symbols can grow into other symbols over time. This usually happens with a certain probability each spin.",
    example:
      "Seeds have a 25% chance to grow into a fruit or flower each spin.",
    animation: (
      <div className={styles.animationContainer}>
        <div className={styles.growSequence}>
          <div className={styles.growSymbol}>🌱</div>
          <div className={styles.growArrow}>→</div>
          <div className={styles.growSymbol}>🌿</div>
          <div className={styles.growArrow}>→</div>
          <div className={styles.growSymbol}>🌷</div>
        </div>
      </div>
    ),
  },
  adjacent: {
    title: "Adjacent Effect",
    description:
      "Many symbols interact with adjacent symbols. Adjacent means any symbol directly touching another (horizontally, vertically, or diagonally).",
    example:
      "The Bear destroys adjacent Honey and gives 40 coins for each Honey destroyed.",
    animation: (
      <div className={styles.animationContainer}>
        <div className={styles.gridExample}>
          <div className={styles.gridCell}></div>
          <div className={styles.gridCell}>🍯</div>
          <div className={styles.gridCell}></div>
          <div className={styles.gridCell}>🍯</div>
          <div className={styles.gridCell}>🐻</div>
          <div className={styles.gridCell}>🍯</div>
          <div className={styles.gridCell}></div>
          <div className={styles.gridCell}>🍯</div>
          <div className={styles.gridCell}></div>
        </div>
        <div className={styles.adjacentEffect}>
          <div className={styles.explosion}>💥</div>
          <div className={styles.coinReward}>+160 🪙</div>
        </div>
      </div>
    ),
  },
  multiplier: {
    title: "Multiplier Effect",
    description:
      "Some symbols make other symbols give more coins than their base value.",
    example: "The Sun makes adjacent Flowers give 5x more coins.",
    animation: (
      <div className={styles.animationContainer}>
        <div className={styles.multiplierExample}>
          <div className={styles.baseSymbol}>
            🌷 <span className={styles.baseValue}>2 🪙</span>
          </div>
          <div className={styles.multiplierSymbol}>☀️</div>
          <div className={styles.multiplierArrow}>→</div>
          <div className={styles.multipliedSymbol}>
            🌷 <span className={styles.multipliedValue}>10 🪙</span>
          </div>
        </div>
      </div>
    ),
  },
  counter: {
    title: "Counter Effect",
    description:
      "Some symbols have internal counters that trigger effects after a certain number of spins or actions.",
    example: "The Snail gives 5 coins every 4 spins.",
    animation: (
      <div className={styles.animationContainer}>
        <div className={styles.counterExample}>
          <div className={styles.counterSequence}>
            <div className={styles.counterSymbol}>
              🐌<span className={styles.counterValue}>1</span>
            </div>
            <div className={styles.counterSymbol}>
              🐌<span className={styles.counterValue}>2</span>
            </div>
            <div className={styles.counterSymbol}>
              🐌<span className={styles.counterValue}>3</span>
            </div>
            <div className={styles.counterSymbol}>
              🐌<span className={styles.counterValue}>4</span>
            </div>
          </div>
          <div className={styles.counterEffect}>
            <div className={styles.coinReward}>+5 🪙</div>
          </div>
        </div>
      </div>
    ),
  },
  adds: {
    title: "Adds Effect",
    description:
      "Some symbols can add new symbols to empty adjacent spaces on the grid.",
    example:
      "The Rabbit adds a Carrot to an empty adjacent space every 3 spins.",
    animation: (
      <div className={styles.animationContainer}>
        <div className={styles.addsExample}>
          <div className={styles.gridExample}>
            <div className={styles.gridCell}></div>
            <div className={styles.gridCell}></div>
            <div className={styles.gridCell}></div>
            <div className={styles.gridCell}></div>
            <div className={styles.gridCell}>🐰</div>
            <div className={styles.gridCell}></div>
            <div className={styles.gridCell}></div>
            <div className={styles.gridCell}></div>
            <div className={styles.gridCell}></div>
          </div>
          <div className={styles.addsArrow}>→</div>
          <div className={styles.gridExample}>
            <div className={styles.gridCell}></div>
            <div className={styles.gridCell}></div>
            <div className={styles.gridCell}></div>
            <div className={styles.gridCell}></div>
            <div className={styles.gridCell}>🐰</div>
            <div className={styles.gridCell}>🥕</div>
            <div className={styles.gridCell}></div>
            <div className={styles.gridCell}></div>
            <div className={styles.gridCell}></div>
          </div>
        </div>
      </div>
    ),
  },
  // Add more effect types as needed
};

const InfoModal: React.FC<InfoModalProps> = ({
  isOpen,
  onClose,
  effectType,
}) => {
  const effectInfo = effectDescriptions[effectType.toLowerCase()] || {
    title: "Unknown Effect",
    description: "No information available for this effect.",
  };

  return (
    <Modal
      key={effectType}
      title={effectInfo.title}
      isOpen={isOpen}
      onClose={onClose}
      className={styles.infoModal}
    >
      <div className={styles.infoContent}>
        <p className={styles.infoDescription}>{effectInfo.description}</p>

        {effectInfo.animation && (
          <div className={styles.animationBox}>{effectInfo.animation}</div>
        )}

        {effectInfo.example && (
          <div className={styles.exampleBox}>
            <h3 className={styles.exampleTitle}>Example</h3>
            <p className={styles.exampleText}>{effectInfo.example}</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default InfoModal;
