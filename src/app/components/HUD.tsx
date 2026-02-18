type Props = {
  score: number;
  best: number;
  bump: boolean;
  alive: boolean;
  paused?: boolean;
  onPause?: () => void;
  onRestart: () => void;
};

export default function HUD({
  score,
  best,
  bump,
  alive,
  paused,
  onPause,
  onRestart,
}: Props) {
  return (
    <div className="mt-3 text-center font-mono text-lg text-gray-100">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <span className={bump ? "score-bump" : ""}>Score: {score}</span>
        <span className="opacity-80">Best: {best}</span>
        {alive && onPause && (
          <button
            type="button"
            onClick={onPause}
            className="rounded border border-zinc-500 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-200 touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 md:min-w-[5rem]"
            aria-label={paused ? "Resume game" : "Pause game"}
          >
            {paused ? "Resume" : "Pause (P)"}
          </button>
        )}
      </div>

      {!alive && (
        <div className="mt-2">
          <button
            onClick={onRestart}
            className="rounded border px-3 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          >
            Restart (Space)
          </button>
        </div>
      )}
    </div>
  );
}
