import { useState } from 'react';
import type { GameDifficulty } from '@/constants/game';
import { DIFFICULTY_PRESETS } from '@/constants/game';
import type { LocalLeaderboardEntry } from '@/hooks/useLeaderboard';
import { loadUnlockedAchievements } from '@/services/statsService';
import { ACHIEVEMENTS } from '@/data/achievements';
import { Play, Trophy, Settings, HelpCircle } from 'lucide-react';
import LeaderboardModal from './LeaderboardModal';
import SettingsModal from './SettingsModal';
import HowToPlayModal from './HowToPlayModal';

const DIFFICULTIES: GameDifficulty[] = [
  'relaxed',
  'classic',
  'expert',
  'blitz',
  'endless',
];
const ACHIEVEMENT_COUNT = Object.keys(ACHIEVEMENTS).length;

type Props = {
  difficulty: GameDifficulty;
  onDifficultyChange: (d: GameDifficulty) => void;
  onStart: () => void;
  muted: boolean;
  onMutedChange: (v: boolean) => void;
  playerName: string;
  onPlayerNameChange: (v: string) => void;
  localLeaderboardEntries: LocalLeaderboardEntry[];
  bestScore: number;
};

export default function MenuScreen({
  difficulty,
  onDifficultyChange,
  onStart,
  muted,
  onMutedChange,
  playerName,
  onPlayerNameChange,
  localLeaderboardEntries,
  bestScore,
}: Props) {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const unlockedCount = loadUnlockedAchievements().size;

  const T = DIFFICULTY_PRESETS[difficulty];

  const btnBase =
    'flex flex-col items-center justify-center gap-2 rounded-xl border border-zinc-600 bg-zinc-800/80 px-4 py-5 text-white transition hover:bg-zinc-700 active:bg-zinc-600 min-h-[100px]';

  return (
    <div className='flex w-full max-w-md flex-col items-center gap-6'>
      <h1 className='font-mono text-3xl font-bold text-emerald-400'>Snake</h1>
      <p className='text-center text-sm text-zinc-500'>
        Best: <span className='font-mono text-emerald-400/90'>{bestScore}</span>
        {' · '}
        <span className='font-mono text-amber-400/90'>
          {unlockedCount}/{ACHIEVEMENT_COUNT}
        </span>{' '}
        achievements
      </p>

      <div className='w-full'>
        <label className='mb-2 block text-xs font-medium text-zinc-500'>
          Difficulty
        </label>
        <select
          className='w-full rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-white'
          value={difficulty}
          onChange={(e) => onDifficultyChange(e.target.value as GameDifficulty)}
        >
          {DIFFICULTIES.map((k) => (
            <option key={k} value={k}>
              {DIFFICULTY_PRESETS[k].label} — {DIFFICULTY_PRESETS[k].COLS}×
              {DIFFICULTY_PRESETS[k].ROWS}
            </option>
          ))}
        </select>
        <p className='mt-1 text-xs text-zinc-500'>{T.description}</p>
      </div>

      <div className='grid w-full grid-cols-2 gap-3'>
        <button
          className={`${btnBase} border-emerald-600 bg-emerald-600/20 hover:bg-emerald-600/40`}
          onClick={onStart}
        >
          <Play size={28} className='text-emerald-400' />
          <span className='font-semibold'>Play</span>
        </button>

        <button className={btnBase} onClick={() => setShowLeaderboard(true)}>
          <Trophy size={28} className='text-amber-400' />
          <span className='font-semibold'>Leaderboard</span>
        </button>

        <button className={btnBase} onClick={() => setShowSettings(true)}>
          <Settings size={28} className='text-zinc-400' />
          <span className='font-semibold'>Settings</span>
        </button>

        <button className={btnBase} onClick={() => setShowHowToPlay(true)}>
          <HelpCircle size={28} className='text-zinc-400' />
          <span className='font-semibold'>How to Play</span>
        </button>
      </div>

      <LeaderboardModal
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
        localEntries={localLeaderboardEntries}
      />
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        muted={muted}
        onMutedChange={onMutedChange}
        playerName={playerName}
        onPlayerNameChange={onPlayerNameChange}
      />
      <HowToPlayModal
        isOpen={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
      />
    </div>
  );
}
