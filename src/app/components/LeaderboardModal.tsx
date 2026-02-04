import { useState, useEffect } from 'react';
import type { GameDifficulty } from '@/constants/game';
import { DIFFICULTY_PRESETS } from '@/constants/game';
import {
  fetchLeaderboard,
  type LeaderboardScore,
} from '@/services/leaderboardService';
import { X } from 'lucide-react';

const DIFFICULTIES: GameDifficulty[] = [
  'relaxed',
  'classic',
  'expert',
  'blitz',
  'endless',
];

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

export default function LeaderboardModal({ isOpen, onClose }: Props) {
  const [difficulty, setDifficulty] = useState<GameDifficulty>('classic');
  const [scores, setScores] = useState<LeaderboardScore[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setError(null);
    fetchLeaderboard(difficulty)
      .then(setScores)
      .catch(() => setError('Failed to load leaderboard'))
      .finally(() => setLoading(false));
  }, [isOpen, difficulty]);

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4'
      onClick={onClose}
    >
      <div
        className='max-h-[85vh] w-full max-w-md overflow-hidden rounded-xl bg-zinc-900 shadow-xl'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-center justify-between border-b border-zinc-700 px-4 py-3'>
          <h2 className='font-mono text-lg font-semibold text-white'>
            Leaderboard
          </h2>
          <button
            type='button'
            className='rounded p-1 text-zinc-400 hover:bg-zinc-700 hover:text-white'
            onClick={onClose}
            aria-label='Close'
          >
            <X size={24} />
          </button>
        </div>

        <div className='flex gap-1 border-b border-zinc-700 p-2'>
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              type='button'
              className={`rounded-lg px-2 py-1 text-xs font-medium transition ${
                difficulty === d
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
              onClick={() => setDifficulty(d)}
            >
              {DIFFICULTY_PRESETS[d].label}
            </button>
          ))}
        </div>

        <div className='max-h-[50vh] overflow-y-auto p-4'>
          {loading && (
            <p className='py-8 text-center text-zinc-500'>Loading...</p>
          )}
          {error && <p className='py-8 text-center text-amber-500'>{error}</p>}
          {!loading && !error && scores.length === 0 && (
            <p className='py-8 text-center text-zinc-500'>
              No scores yet. Be the first!
            </p>
          )}
          {!loading && !error && scores.length > 0 && (
            <ul className='space-y-2'>
              {scores.map((s) => (
                <li
                  key={`${s.rank}-${s.score}-${s.createdAt}`}
                  className='flex items-center justify-between rounded-lg bg-zinc-800/50 px-3 py-2'
                >
                  <span className='font-mono text-zinc-500'>#{s.rank}</span>
                  <span className='font-mono font-semibold text-emerald-400'>
                    {s.score}
                  </span>
                  <span className='truncate text-sm text-zinc-400 max-w-[120px]'>
                    {s.playerName}
                  </span>
                  <span className='text-xs text-zinc-500'>
                    {formatDate(s.createdAt)}
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
