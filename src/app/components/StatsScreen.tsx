import { X } from "lucide-react";
import type { GameDifficulty } from "@/constants/game";
import { DIFFICULTY_PRESETS } from "@/constants/game";
import { getStats } from "@/services/statsService";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function StatsScreen({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  const stats = getStats();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-xl bg-zinc-900 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-zinc-700 px-4 py-3">
          <h2 className="font-mono text-lg font-semibold text-white">Stats</h2>
          <button
            type="button"
            className="rounded p-1 text-zinc-400 hover:bg-zinc-700 hover:text-white"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4 p-4">
          <div className="rounded-lg bg-zinc-800/50 p-4">
            <h3 className="mb-2 text-sm font-medium text-zinc-400">Overview</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-zinc-500">Games played</span>
              <span className="font-mono text-white">{stats.totalGames}</span>
              <span className="text-zinc-500">Food eaten</span>
              <span className="font-mono text-white">
                {stats.totalFoodEaten}
              </span>
            </div>
          </div>
          <div className="rounded-lg bg-zinc-800/50 p-4">
            <h3 className="mb-2 text-sm font-medium text-zinc-400">
              Best per difficulty
            </h3>
            <div className="space-y-1 text-sm">
              {(
                [
                  "relaxed",
                  "classic",
                  "expert",
                  "blitz",
                  "endless",
                ] as GameDifficulty[]
              ).map((d) => (
                <div key={d} className="flex justify-between">
                  <span className="text-zinc-400">
                    {DIFFICULTY_PRESETS[d].label}
                  </span>
                  <span className="font-mono text-emerald-400">
                    {stats.bestPerDifficulty[d]}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg bg-zinc-800/50 p-4">
            <h3 className="mb-2 text-sm font-medium text-zinc-400">
              Power-ups used
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-zinc-500">Ghost</span>
              <span className="font-mono text-white">{stats.ghostUsed}</span>
              <span className="text-zinc-500">Freeze</span>
              <span className="font-mono text-white">{stats.freezeUsed}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
