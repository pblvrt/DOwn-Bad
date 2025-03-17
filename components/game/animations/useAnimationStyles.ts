import { useState } from "react";
import styles from "@/styles/RewardAnimation.module.css";

export function useAnimationStyles() {
  const [style, setStyle] = useState({});

  const setInitialStyle = (position: { x: number; y: number }) => {
    setStyle({
      left: `${position.x}px`,
      top: `${position.y}px`,
      opacity: 0,
      transform: "scale(0.5) translateY(10px)",
    });
  };

  const setPopupStyle = (position: { x: number; y: number }) => {
    setStyle({
      left: `${position.x}px`,
      top: `${position.y}px`,
      opacity: 1,
      transform: "scale(1.2) translateY(-10px)",
      transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    });
  };

  const setNormalStyle = (position: { x: number; y: number }) => {
    setStyle({
      left: `${position.x}px`,
      top: `${position.y}px`,
      opacity: 1,
      transform: "scale(1) translateY(0)",
      transition: "all 0.2s ease-out",
    });
  };

  const setMoveToTargetStyle = (targetPosition: { x: number; y: number }) => {
    setStyle({
      left: `${targetPosition.x}px`,
      top: `${targetPosition.y}px`,
      opacity: 0,
      transform: "scale(0.5) translateY(-20px)",
      transition: "all 1.2s cubic-bezier(0.25, 0.1, 0.25, 1)",
    });
  };

  const setBuzzingStyle = (position: { x: number; y: number }) => {
    setStyle({
      left: `${position.x}px`,
      top: `${position.y}px`,
      opacity: 1,
      transform: "scale(1)",
      animation: `${styles.buzz} 0.5s ease-in-out`,
      transition: "all 0.2s ease-out",
    });
  };

  const setFadeOutStyle = (position: { x: number; y: number }) => {
    setStyle({
      left: `${position.x}px`,
      top: `${position.y}px`,
      opacity: 0,
      transform: "scale(0.5)",
      transition: "all 0.3s ease-out",
    });
  };

  return {
    style,
    setInitialStyle,
    setPopupStyle,
    setNormalStyle,
    setMoveToTargetStyle,
    setBuzzingStyle,
    setFadeOutStyle,
  };
}
