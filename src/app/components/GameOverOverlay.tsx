import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { Share2 } from "lucide-react";
import { shareScore } from "@/utils/share";
import { DIFFICULTY_PRESETS } from "@/constants/game";
import type { GameDifficulty } from "@/constants/game";
import { ACHIEVEMENTS, type AchievementId } from "@/data/achievements";

type Props = {
  score: number;
  best: number;
  difficulty: GameDifficulty;
  isNewBest: boolean;
  newAchievements: AchievementId[];
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
  difficulty,
  isNewBest,
  newAchievements,
  playTimeMs,
  snakeLength,
  onRestart,
}: Props) {
  const firedRef = useRef(false);
  const [shareDone, setShareDone] = useState(false);
  const difficultyLabel = DIFFICULTY_PRESETS[difficulty].label;

  useEffect(() => {
    if (isNewBest && !firedRef.current) {
      firedRef.current = true;
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  }, [isNewBest]);

  const handleShare = async () => {
    const ok = await shareScore(score, difficultyLabel, best);
    if (ok) setShareDone(true);
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/70 p-4 overflow-y-auto">
      <h2 className="font-mono text-2xl font-bold text-white">Game Over</h2>
      {isNewBest && (
        <p className="animate-pulse font-mono text-lg font-semibold text-amber-400">
          New high score!
        </p>
      )}
      {newAchievements.length > 0 && (
        <div className="flex flex-col gap-1 rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-2">
          <p className="text-xs font-medium text-amber-400">Achievement unlocked!</p>
          {newAchievements.map((id) => {
            const a = ACHIEVEMENTS[id];
            return (
              <p key={id} className="flex items-center gap-2 text-sm text-zinc-200">
                <span>{a.icon}</span>
                <span>{a.name}</span>
              </p>
            );
          })}
        </div>
      )}
      <div className="flex flex-col items-center gap-1 text-center font-mono text-sm text-zinc-300">
        <p>
          Score: <span className="text-emerald-400">{score}</span>
        </p>
        <p>Best: {best}</p>
        <p>Length: {snakeLength}</p>
        <p>Time: {formatTime(playTimeMs)}</p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          className="rounded-lg bg-emerald-600 px-6 py-2 font-medium text-white transition hover:bg-emerald-500"
          onClick={onRestart}
        >
          Play Again (Space)
        </button>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-zinc-500 bg-zinc-800 px-4 py-2 text-sm text-zinc-200 transition hover:bg-zinc-700"
          onClick={handleShare}
        >
          <Share2 size={18} />
          {shareDone ? "Copied!" : "Share score"}
        </button>
      </div>
    </div>
  );
}
