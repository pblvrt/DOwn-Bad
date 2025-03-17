"use client";
import styles from "@/styles/Header.module.css";

export default function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.logoContainer}>
        <h1 className={styles.title}>DOwn Bad</h1>
        <p className={styles.version}>v0.0.1</p>
      </div>
      <div className={styles.links}>
        <p className={styles.link}> <a href="https://x.com/pblvrt" target="_blank" rel="noopener noreferrer">X</a></p>
        <p className={styles.link}> <a href="https://github.com/pblvrt/DOwn-Bad" target="_blank" rel="noopener noreferrer">Github</a></p>
      </div>
    </div>
  );
}
