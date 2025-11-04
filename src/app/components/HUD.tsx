type Props = {
  score: number;
  best: number;
  bump: boolean;
  alive: boolean;
  onRestart: () => void;
};

export default function HUD({ score, best, bump, alive, onRestart }: Props) {
  return (
    <div className="mt-3 text-center font-mono text-lg text-gray-100">
      <div className="flex items-center justify-center gap-4">
        <span className={bump ? "score-bump" : ""}>Score: {score}</span>
        <span className="opacity-80">Best: {best}</span>
      </div>

      {!alive && (
        <div className="mt-2">
          <button onClick={onRestart} className="rounded border px-3 py-1">
            Restart (Space)
          </button>
        </div>
      )}
    </div>
  );
}
