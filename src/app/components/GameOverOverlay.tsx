import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

type Props = {
  score: number;
  best: number;
  isNewBest: boolean;
  playTimeMs: number;
  snakeLength: number;
  onRestart: () => void;
};

function formatTime(ms: number) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m > 0 ? `${m}:${sec.toString().padStart(2, "0")}` : `${s}s`;
}

export default function GameOverOverlay({
  score,
  best,
  isNewBest,
  playTimeMs,
  snakeLength,
  onRestart,
}: Props) {
  const firedRef = useRef(false);
  useEffect(() => {
    if (isNewBest && !firedRef.current) {
      firedRef.current = true;
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  }, [isNewBest]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/70 p-4">
      <h2 className="font-mono text-2xl font-bold text-white">Game Over</h2>
      {isNewBest && (
        <p className="animate-pulse font-mono text-lg font-semibold text-amber-400">
          New high score!
        </p>
      )}
      <div className="flex flex-col items-center gap-1 text-center font-mono text-sm text-zinc-300">
        <p>Score: <span className="text-emerald-400">{score}</span></p>
        <p>Best: {best}</p>
        <p>Length: {snakeLength}</p>
        <p>Time: {formatTime(playTimeMs)}</p>
      </div>
      <button
        className="rounded-lg bg-emerald-600 px-6 py-2 font-medium text-white transition hover:bg-emerald-500"
        onClick={onRestart}
      >
        Play Again (Space)
      </button>
    </div>
  );
}
