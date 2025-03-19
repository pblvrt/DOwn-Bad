"use client";

import { useEffect } from "react";
import { useAudio } from "@/context/AudioProvider";

export default function AudioInitializer() {
  const { preloadAudio } = useAudio();

  // Preload all audio when the component mounts
  useEffect(() => {
    preloadAudio();
  }, []);

  return null; // This component doesn't render anything
}
