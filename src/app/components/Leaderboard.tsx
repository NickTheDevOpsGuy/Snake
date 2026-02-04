import type { LeaderboardEntry } from '@/hooks/useLeaderboard';
import { DIFFICULTY_PRESETS } from '@/constants/game';
import type { GameDifficulty } from '@/constants/game';

type Props = {
  entries: LeaderboardEntry[];
};

function formatDate(ts: number) {
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

export default function Leaderboard({ entries }: Props) {
  if (entries.length === 0) return null;

  return (
    <div className='w-full max-w-xs'>
      <h3 className='mb-2 text-center font-mono text-xs font-medium uppercase tracking-wider text-zinc-500'>
        Top scores
      </h3>
      <ul className='space-y-1 rounded-lg border border-zinc-700 bg-zinc-900/50 px-3 py-2'>
        {entries.slice(0, 5).map((e, i) => (
          <li
            key={`${e.date}-${e.score}-${i}`}
            className='flex items-center justify-between font-mono text-sm text-zinc-300'
          >
            <span className='text-zinc-500'>#{i + 1}</span>
            <span className='text-emerald-400'>{e.score}</span>
            <span className='text-xs text-zinc-500'>
              {DIFFICULTY_PRESETS[e.difficulty as GameDifficulty]?.label ??
                e.difficulty}
            </span>
            <span className='text-xs text-zinc-600'>
              {formatDate(e.date)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
