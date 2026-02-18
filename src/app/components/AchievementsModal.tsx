import { X } from "lucide-react";
import { ACHIEVEMENTS, type AchievementId } from "@/data/achievements";
import { loadUnlockedAchievements } from "@/services/statsService";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AchievementsModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  const unlocked = loadUnlockedAchievements();
  const ids = Object.keys(ACHIEVEMENTS) as AchievementId[];

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
          <h2 className="font-mono text-lg font-semibold text-white">
            Achievements
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
        <div className="space-y-2 p-4">
          {ids.map((id) => {
            const a = ACHIEVEMENTS[id];
            const isUnlocked = unlocked.has(id);
            return (
              <div
                key={id}
                className={`flex items-center gap-3 rounded-lg p-3 ${
                  isUnlocked ? "bg-zinc-800/80" : "bg-zinc-800/30 opacity-60"
                }`}
              >
                <span className="text-2xl">{a.icon}</span>
                <div className="flex-1">
                  <p className="font-medium text-white">{a.name}</p>
                  <p className="text-xs text-zinc-500">{a.description}</p>
                </div>
                {isUnlocked && (
                  <span className="text-xs text-emerald-400">✓</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
