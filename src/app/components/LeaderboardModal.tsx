import { useMemo, useState } from "react";
import type { GameDifficulty } from "@/constants/game";
import { DIFFICULTY_PRESETS } from "@/constants/game";
import type { LocalLeaderboardEntry } from "@/hooks/useLeaderboard";
import { X } from "lucide-react";

const DIFFICULTIES: GameDifficulty[] = [
  "relaxed",
  "classic",
  "expert",
  "blitz",
  "endless",
];

type Props = {
  isOpen: boolean;
  onClose: () => void;
  localEntries: LocalLeaderboardEntry[];
};

function formatDate(ts: number) {
  try {
    return new Date(ts).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export default function LeaderboardModal({
  isOpen,
  onClose,
  localEntries,
}: Props) {
  const [difficulty, setDifficulty] = useState<GameDifficulty>("classic");

  const entriesForDifficulty = useMemo(
    () =>
      localEntries
        .filter((e) => e.difficulty === difficulty)
        .sort((a, b) => b.score - a.score)
        .map((e, i) => ({ ...e, rank: i + 1 })),
    [localEntries, difficulty],
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-md overflow-hidden rounded-xl bg-zinc-900 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-zinc-700 px-4 py-3">
          <h2 className="font-mono text-lg font-semibold text-white">
            Leaderboard
          </h2>
          <button
            type="button"
            className="rounded p-1 text-zinc-400 hover:bg-zinc-700 hover:text-white"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex gap-1 border-b border-zinc-700 p-2">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              type="button"
              className={`rounded-lg px-2 py-1 text-xs font-medium transition ${
                difficulty === d
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
              onClick={() => setDifficulty(d)}
            >
              {DIFFICULTY_PRESETS[d].label}
            </button>
          ))}
        </div>

        <div className="max-h-[50vh] overflow-y-auto p-4">
          {entriesForDifficulty.length === 0 ? (
            <p className="py-8 text-center text-zinc-500">
              No scores yet. Be the first!
            </p>
          ) : (
            <ul className="space-y-2">
              {entriesForDifficulty.map((e) => (
                <li
                  key={`${e.rank}-${e.score}-${e.date}`}
                  className="flex items-center justify-between rounded-lg bg-zinc-800/50 px-3 py-2"
                >
                  <span className="font-mono text-zinc-500">#{e.rank}</span>
                  <span className="font-mono font-semibold text-emerald-400">
                    {e.score}
                  </span>
                  <span className="max-w-[120px] truncate text-sm text-zinc-400">
                    {e.playerName || "Anonymous"}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {formatDate(e.date)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
