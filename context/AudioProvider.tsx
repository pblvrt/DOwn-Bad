"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useGameState } from "./GameStateProvider";

type AudioContextType = {
  playSound: (soundId: string, volume?: number) => void;
  playBackgroundMusic: () => void;
  stopBackgroundMusic: () => void;
  preloadAudio: () => void;
  isMusicPlaying: boolean;
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

// Sound definitions
const SOUNDS = {
  spin: "/spin.wav",
  coin: "/coin.wav",
  purchase: "/purchase.mp3",
  rent: "/rent.mp3",
  gameover: "/sounds/gameover.mp3",
  success: "/sounds/success.mp3",
  specialEffect: "/specialEffect.wav",
  destroy: "/sounds/destroy.mp3",
  background: "/background.wav",
};

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const { state } = useGameState();
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // Audio context and buffers
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBuffersRef = useRef<Record<string, AudioBuffer>>({});
  const gainNodesRef = useRef<Record<string, GainNode>>({});
  const backgroundSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioContextRef.current = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();

      // Create main gain nodes
      const musicGain = audioContextRef.current.createGain();
      musicGain.gain.value = 0.5; // 50% volume for music
      musicGain.connect(audioContextRef.current.destination);
      gainNodesRef.current.music = musicGain;

      const sfxGain = audioContextRef.current.createGain();
      sfxGain.gain.value = 0.7; // 70% volume for sound effects
      sfxGain.connect(audioContextRef.current.destination);
      gainNodesRef.current.sfx = sfxGain;

      return () => {
        if (backgroundSourceRef.current) {
          backgroundSourceRef.current.stop();
        }
        if (
          audioContextRef.current &&
          audioContextRef.current.state !== "closed"
        ) {
          audioContextRef.current.close();
        }
      };
    }
  }, []);

  // Update audio state when sound preference changes
  useEffect(() => {
    if (!state.soundEnabled && isMusicPlaying) {
      stopBackgroundMusic();
    } else if (state.soundEnabled && !isMusicPlaying && state.tutorialSeen) {
      // Auto-resume music if sound is enabled and tutorial is seen
      playBackgroundMusic();
    }
  }, [state.soundEnabled]);

  // Preload all audio files
  const preloadAudio = async () => {
    if (!audioContextRef.current) return;

    const context = audioContextRef.current;

    // Helper function to load a single audio file
    const loadAudio = async (id: string, url: string) => {
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await context.decodeAudioData(arrayBuffer);
        audioBuffersRef.current[id] = audioBuffer;
        console.log(`Loaded audio: ${id}`);
      } catch (error) {
        console.error(`Error loading audio ${id}:`, error);
      }
    };

    // Load all sounds in parallel
    const loadPromises = Object.entries(SOUNDS).map(([id, url]) =>
      loadAudio(id, url)
    );

    await Promise.all(loadPromises);
    console.log("All audio preloaded");
  };

  // Play a sound effect
  const playSound = (soundId: string, volume = 0.7) => {
    if (!audioContextRef.current || !state.soundEnabled) return;

    const context = audioContextRef.current;
    const buffer = audioBuffersRef.current[soundId];

    if (!buffer) {
      console.warn(`Sound ${soundId} not loaded`);
      return;
    }

    // Resume context if suspended
    if (context.state === "suspended") {
      context.resume();
    }

    // Create and configure source
    const source = context.createBufferSource();
    source.buffer = buffer;

    // Create individual gain node for this sound
    const gainNode = context.createGain();
    gainNode.gain.value = volume;

    // Connect to the main SFX gain node
    source.connect(gainNode);
    gainNode.connect(gainNodesRef.current.sfx);

    // Play the sound
    source.start(0);
  };

  // Play background music
  const playBackgroundMusic = () => {
    if (!audioContextRef.current || !state.soundEnabled) return;

    const context = audioContextRef.current;
    const buffer = audioBuffersRef.current.background;

    if (!buffer) {
      console.warn("Background music not loaded");
      return;
    }

    // Resume context if suspended
    if (context.state === "suspended") {
      context.resume();
    }

    // Stop any existing playback
    if (backgroundSourceRef.current) {
      backgroundSourceRef.current.stop();
    }

    // Create and configure source
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    // Connect to the music gain node
    source.connect(gainNodesRef.current.music);

    // Start playback
    source.start(0);
    backgroundSourceRef.current = source;
    setIsMusicPlaying(true);

    console.log("Background music started");
  };

  // Stop background music
  const stopBackgroundMusic = () => {
    if (backgroundSourceRef.current) {
      backgroundSourceRef.current.stop();
      backgroundSourceRef.current = null;
      setIsMusicPlaying(false);
      console.log("Background music stopped");
    }
  };

  return (
    <AudioContext.Provider
      value={{
        playSound,
        playBackgroundMusic,
        stopBackgroundMusic,
        preloadAudio,
        isMusicPlaying,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

// Custom hook to use the audio context
export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
