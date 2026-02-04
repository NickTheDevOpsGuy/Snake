import { X } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  muted: boolean;
  onMutedChange: (v: boolean) => void;
  playerName: string;
  onPlayerNameChange: (v: string) => void;
};

export default function SettingsModal({
  isOpen,
  onClose,
  muted,
  onMutedChange,
  playerName,
  onPlayerNameChange,
}: Props) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-zinc-900 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-zinc-700 px-4 py-3">
          <h2 className="font-mono text-lg font-semibold text-white">
            Settings
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

        <div className="space-y-4 p-4">
          <label className="flex items-center justify-between gap-4">
            <span className="text-sm text-zinc-300">Sound</span>
            <button
              type="button"
              role="switch"
              aria-checked={!muted}
              className={`relative h-8 w-14 rounded-full transition ${
                muted ? "bg-zinc-600" : "bg-emerald-600"
              }`}
              onClick={() => onMutedChange(!muted)}
            >
              <span
                className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${
                  muted ? "left-1" : "left-7"
                }`}
              />
            </button>
          </label>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Player name (for leaderboard)
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => onPlayerNameChange(e.target.value)}
              placeholder="Anonymous"
              className="w-full rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500"
              maxLength={20}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
