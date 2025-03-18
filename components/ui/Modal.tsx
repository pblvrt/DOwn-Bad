"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "@/styles/Modal.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = "",
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Set mounted state to true after component mounts
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Handle modal overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    // Prevent the click from propagating to parent elements
    e.stopPropagation();
  };

  if (!isOpen) return null;

  // Only render with createPortal on the client side
  if (!mounted) return null;

  // Use createPortal to render the modal at the document body level
  return createPortal(
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div
        ref={modalRef}
        className={`${styles.modalContent} ${className}`}
        role="dialog"
        aria-modal="true"
      >
        {title && (
          <div className={styles.modalHeader}>
            <h2>{title}</h2>
            <button className={styles.closeButton} onClick={onClose}>
              ×
            </button>
          </div>
        )}

        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
