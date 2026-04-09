"use client";
import dynamic from "next/dynamic";

const Game = dynamic(() => import("@/components/Game"), {
  ssr: false,
  loading: () => null,
});

export default function GameLoader() {
  return <Game />;
}
