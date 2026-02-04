import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DIFFICULTY_PRESETS, type GameDifficulty } from '@/constants/game';
import type { XY, Dir } from '@/types';
import { inferDirFromSnake } from '@/utils/logic';
import { drawFrame } from '@/utils/canvas';
import { useTicker } from '@/hooks/useTicker';
import { useSnakeGame } from '@/hooks/useSnakeGame';
import { useInput } from '@/hooks/useInput';
import { useCanvas2D } from '@/hooks/useCanvas2D';
import { useBestScore } from '@/hooks/useBestScore';
import { usePauseHotkey } from '@/hooks/usePauseHotkey';
import { useSwipe } from '@/hooks/useSwipe';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import HUD from '@/components/HUD';
import Leaderboard from '@/components/Leaderboard';
import { isOpposite } from '@/utils/logic';

type Phase = 'menu' | 'playing' | 'gameover';

const DIFFICULTIES: GameDifficulty[] = [
  'relaxed',
  'classic',
  'expert',
  'blitz',
  'endless',
];

function computeDelayMs(
  T: (typeof DIFFICULTY_PRESETS)[GameDifficulty],
  score: number
): number {
  const linear = T.TICK_START_MS - score * T.TICK_STEP_MS;
  const curve = T.speedCurve;
  let delay = linear;
  if (curve === 'ease-in') {
    delay = T.TICK_START_MS - score * score * 0.08;
  } else if (curve === 'ease-out') {
    delay = T.TICK_START_MS - score * T.TICK_STEP_MS * 0.85;
  }
  return Math.max(T.TICK_MIN_MS, delay);
}

export default function SnakeCanvas() {
  const { canvasRef, ctxRef } = useCanvas2D();

  const [bump, setBump] = useState(false);
  const [paused, setPaused] = useState(false);
  const [phase, setPhase] = useState<Phase>('menu');
  const [difficulty, setDifficulty] = useState<GameDifficulty>('classic');

  const T = DIFFICULTY_PRESETS[difficulty];
  const gameConfig = useMemo(
    () => ({
      cols: T.COLS,
      rows: T.ROWS,
      wrap: T.wrap,
      obstacleCount: T.obstacleCount,
      powerChance: T.powerChance,
    }),
    [T]
  );

  const eatSnd = useMemo(() => new Audio('/sounds/food.mp3'), []);
  const dieSnd = useMemo(() => new Audio('/sounds/gameover.mp3'), []);
  const keySnd = useMemo(() => new Audio('/sounds/move.mp3'), []);

  useEffect(() => {
    eatSnd.volume = 0.7;
    dieSnd.volume = 0.9;
    keySnd.volume = 0.4;
  }, [eatSnd, dieSnd, keySnd]);

  const play = useCallback((a: HTMLAudioElement) => {
    try {
      a.currentTime = 0;
      void a.play();
    } catch (err) {
      console.error('Audio play exception:', err);
    }
  }, []);

  const {
    alive,
    score,
    snakeRef,
    foodRef,
    obstaclesRef,
    reset,
    turn,
    tick,
  } = useSnakeGame(gameConfig, {
    onEat: () => play(eatSnd),
    onDie: () => play(dieSnd),
  });

  useEffect(() => {
    if (!alive && phase === 'playing') setPhase('gameover');
  }, [alive, phase]);

  const getCurrentDir = useCallback<() => Dir>(
    () => inferDirFromSnake(snakeRef.current),
    [snakeRef]
  );

  const draw = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    drawFrame(
      ctx,
      alive,
      foodRef.current,
      snakeRef.current,
      obstaclesRef.current,
      T
    );
  }, [alive, ctxRef, foodRef, snakeRef, obstaclesRef, T]);

  useEffect(() => {
    setBump(true);
    const id = setTimeout(() => setBump(false), 200);
    return () => clearTimeout(id);
  }, [score]);

  const best = useBestScore(score);
  const { entries, submitScore } = useLeaderboard();
  const submittedRef = useRef(false);

  useEffect(() => {
    if (!alive && phase === 'gameover' && score > 0 && !submittedRef.current) {
      submittedRef.current = true;
      submitScore(score, difficulty);
    }
  }, [alive, phase, score, difficulty, submitScore]);

  useEffect(() => {
    if (phase === 'playing') submittedRef.current = false;
  }, [phase]);

  useEffect(() => {
    if (phase === 'menu') {
      reset();
      draw();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  useEffect(() => {
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const delayMs = computeDelayMs(T, score);

  useTicker(
    delayMs,
    () => {
      if (alive && !paused) {
        tick();
        draw();
      }
    },
    phase === 'playing'
  );

  const startGame = useCallback(() => {
    setPaused(false);
    reset();
    draw();
    setPhase('playing');
  }, [reset, draw]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phase !== 'playing' && e.code === 'Space') {
        e.preventDefault();
        startGame();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, startGame]);

  useInput({
    alive,
    getCurrentDir,
    onTurn: turn,
    onRestart: startGame,
    onMoveKey: () => play(keySnd),
  });

  const handleSwipe = useCallback(
    (d: Dir) => {
      const cur = getCurrentDir();
      if (!isOpposite(cur, d)) {
        turn(d);
        play(keySnd);
      }
    },
    [getCurrentDir, turn, keySnd, play]
  );

  useSwipe({
    enabled: phase === 'playing' && alive && !paused,
    onSwipe: handleSwipe,
  });

  usePauseHotkey(alive && phase === 'playing', () => setPaused((p) => !p));

  return (
    <div className='flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-zinc-950 p-4'>
      {phase !== 'playing' && (
        <div className='flex flex-col items-center gap-4'>
          <h1 className='font-mono text-2xl font-bold text-emerald-400'>
            Snake
          </h1>
          <div className='flex flex-wrap items-center justify-center gap-3'>
            <select
              className='rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-white'
              value={difficulty}
              onChange={(e) =>
                setDifficulty(e.target.value as GameDifficulty)
              }
            >
              {DIFFICULTIES.map((k) => (
                <option key={k} value={k}>
                  {DIFFICULTY_PRESETS[k].label} — {DIFFICULTY_PRESETS[k].COLS}×
                  {DIFFICULTY_PRESETS[k].ROWS}
                </option>
              ))}
            </select>
            <button
              className='rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500'
              onClick={startGame}
            >
              {phase === 'menu' ? 'Start' : 'Restart'}
            </button>
          </div>
          <p className='max-w-sm text-center text-xs text-zinc-500'>
            {T.description}
          </p>
          <Leaderboard entries={entries} />
        </div>
      )}

      <div
        className='relative inline-block overflow-hidden rounded-xl shadow-2xl ring-2 ring-zinc-700'
        style={{
          width: T.COLS * T.CELL,
          height: T.ROWS * T.CELL,
          minHeight: T.ROWS * T.CELL,
        }}
      >
        <canvas
          ref={canvasRef}
          width={T.COLS * T.CELL}
          height={T.ROWS * T.CELL}
          className='block'
        />
        {paused && phase === 'playing' && (
          <div className='absolute inset-0 flex items-center justify-center bg-black/60'>
            <span className='font-mono text-xl text-white'>Paused (P)</span>
          </div>
        )}
      </div>

      <HUD
        score={score}
        best={best}
        bump={bump}
        alive={alive}
        onRestart={startGame}
      />

      <div className='text-center font-mono text-xs text-zinc-500'>
        {(1000 / delayMs).toFixed(1)} moves/s · Arrows / WASD / Swipe · P pause
      </div>
    </div>
  );
}
