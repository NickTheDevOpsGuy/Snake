// src/app/components/SnakeCanvas.tsx
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DIFFICULTY_PRESETS, type GameDifficulty } from '@/constants/game';
import type { XY, Dir } from '@/types';
import { randomFreeCell, inferDirFromSnake } from '@/utils/logic';
import { drawFrame } from '@/utils/canvas';
import { useTicker } from '@/hooks/useTicker';
import { useSnakeGame } from '@/hooks/useSnakeGame';
import { useInput } from '@/hooks/useInput';
import { useCanvas2D } from '@/hooks/useCanvas2D';
import { useBestScore } from '@/hooks/useBestScore';
import { usePauseHotkey } from '@/hooks/usePauseHotkey';
import HUD from '@/components/HUD';

type Phase = 'menu' | 'playing' | 'gameover';

export default function SnakeCanvas() {
  const { canvasRef, ctxRef } = useCanvas2D();

  const [bump, setBump] = useState(false);
  const [paused, setPaused] = useState(false);
  const [phase, setPhase] = useState<Phase>('menu');
  const [difficulty, setDifficulty] = useState<GameDifficulty>('medium');

  const T = DIFFICULTY_PRESETS[difficulty];

  // 🔊 preload sounds
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
    } catch {}
  }, []);

  // random free cell based on current tuning
  const pickCell = useCallback(
    (snake: XY[]) => randomFreeCell(snake, T.COLS, T.ROWS),
    [T]
  );

  const { alive, score, snakeRef, foodRef, reset, turn, tick } = useSnakeGame(
    pickCell,
    {
      onEat: () => play(eatSnd),
      onDie: () => play(dieSnd),
      isOutOfBounds: (p) =>
        p.x < 0 || p.x >= T.COLS || p.y < 0 || p.y >= T.ROWS,
    }
  );

  // phase: playing → gameover when you die
  useEffect(() => {
    if (!alive && phase === 'playing') setPhase('gameover');
  }, [alive, phase]);

  // derive current dir for opposite-turn guard
  const getCurrentDir = useCallback<() => Dir>(
    () => inferDirFromSnake(snakeRef.current),
    [snakeRef]
  );

  // drawing (thread tuning into canvas utils)
  const draw = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    drawFrame(ctx, alive, foodRef.current, snakeRef.current, T);
  }, [alive, ctxRef, foodRef, snakeRef, T]);

  // score bump anim
  useEffect(() => {
    setBump(true);
    const id = setTimeout(() => setBump(false), 200);
    return () => clearTimeout(id);
  }, [score]);

  // best score persistence
  const best = useBestScore(score);

  // first paint (menu): draw an empty frame for current tuning
  useEffect(() => {
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // dynamic speed: faster as you eat
  const delayMs = Math.max(
    T.TICK_MIN_MS,
    T.TICK_START_MS - score * T.TICK_STEP_MS
  );

  useTicker(
    delayMs,
    () => {
      if (phase === 'playing' && alive && !paused) {
        tick();
        draw();
      }
    },
    true
  );

  // start/restart helper
  const startGame = useCallback(() => {
    setPaused(false);
    reset();
    draw();
    setPhase('playing');
  }, [reset, draw]);

  // Space to start when not playing
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

  // keyboard for turns + HUD restart
  useInput({
    alive,
    getCurrentDir,
    onTurn: turn,
    onRestart: startGame,
    onMoveKey: () => play(keySnd),
  });

  usePauseHotkey(alive && phase === 'playing', () => setPaused((p) => !p));

  return (
    <div className='flex min-h-screen w-full flex-col items-center justify-center gap-3 bg-black'>
      {/* Toolbar - only visible in menu or game over */}
      {phase !== 'playing' && (
        <div className='flex items-center gap-3'>
          <select
            className='rounded bg-zinc-800 px-2 py-1 text-sm'
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as GameDifficulty)}
          >
            {(['easy', 'medium', 'hard'] as const).map((k) => (
              <option key={k} value={k}>
                {k} — {DIFFICULTY_PRESETS[k].COLS}×{DIFFICULTY_PRESETS[k].ROWS}
              </option>
            ))}
          </select>

          <button
            className='rounded bg-emerald-600 px-3 py-1 text-sm'
            onClick={startGame}
          >
            {phase === 'menu' ? 'Start' : 'Restart'}
          </button>
        </div>
      )}

      {/* Game canvas */}
      <div
        className='relative inline-block align-top'
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
      </div>

      {/* HUD + stats */}
      <HUD
        score={score}
        best={best}
        bump={bump}
        alive={alive}
        onRestart={startGame}
      />

      <div className='text-center font-mono text-xs opacity-60'>
        {(1000 / delayMs).toFixed(1)} moves/s
      </div>
    </div>
  );
}
