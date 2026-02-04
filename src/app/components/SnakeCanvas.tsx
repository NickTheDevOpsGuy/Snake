import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { type GameDifficulty } from '@/constants/game';
import type { Dir } from '@/types';
import { inferDirFromSnake, isOpposite } from '@/utils/logic';
import { drawFrame } from '@/utils/canvas';
import { computeDelayMs } from '@/utils/speed';
import { useTicker } from '@/hooks/useTicker';
import { useSnakeGame } from '@/hooks/useSnakeGame';
import { useInput } from '@/hooks/useInput';
import { useCanvas2D } from '@/hooks/useCanvas2D';
import { useBestScore } from '@/hooks/useBestScore';
import { usePauseHotkey } from '@/hooks/usePauseHotkey';
import { useSwipe } from '@/hooks/useSwipe';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useGameSetup } from '@/hooks/useGameSetup';
import { useGameScale } from '@/hooks/useGameScale';
import { useSettings } from '@/hooks/useSettings';
import MenuScreen from '@/components/MenuScreen';
import HUD from '@/components/HUD';
import MobileControls from '@/components/MobileControls';
import CountdownOverlay from '@/components/CountdownOverlay';
import GameOverOverlay from '@/components/GameOverOverlay';

export default function SnakeCanvas() {
  const { canvasRef, ctxRef } = useCanvas2D();
  const {
    muted,
    setMuted,
    playerName,
    setPlayerName,
    persistDifficulty,
    initialDifficulty,
  } = useSettings();

  const {
    phase,
    setPhase,
    difficulty,
    setDifficulty,
    paused,
    setPaused,
    bump,
    triggerBump,
    tuning: T,
    sounds: { playEat, playDie, playMove },
  } = useGameSetup({ muted, initialDifficulty });

  useEffect(() => {
    persistDifficulty(difficulty);
  }, [difficulty, persistDifficulty]);

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

  const { alive, score, snakeRef, foodRef, obstaclesRef, reset, turn, tick } =
    useSnakeGame(gameConfig, {
      onEat: (value, kind) => {
        playEat();
        confetti({ particleCount: 12, spread: 60, origin: { y: 0.5 } });
      },
      onDie: playDie,
    });

  useEffect(() => {
    if (!alive && phase === 'playing') setPhase('gameover');
  }, [alive, phase, setPhase]);

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

  useEffect(triggerBump, [score, triggerBump]);

  const best = useBestScore(score);
  const { submitScore } = useLeaderboard();
  const submittedRef = useRef(false);
  const gameStartTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!alive && phase === 'gameover' && score > 0 && !submittedRef.current) {
      submittedRef.current = true;
      submitScore(score, difficulty, playerName || undefined);
    }
  }, [alive, phase, score, difficulty, playerName, submitScore]);

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

  const delayMs = computeDelayMs(difficulty, score);

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
    gameStartTimeRef.current = Date.now();
    setPhase('countdown');
  }, [reset, draw, setPaused, setPhase]);

  const startPlaying = useCallback(() => {
    setPhase('playing');
  }, [setPhase]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((phase === 'menu' || phase === 'gameover') && e.code === 'Space') {
        e.preventDefault();
        startGame();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, startGame]);

  const handleTurn = useCallback(
    (d: Dir) => {
      const cur = getCurrentDir();
      if (!isOpposite(cur, d)) {
        turn(d);
        playMove();
      }
    },
    [getCurrentDir, turn, playMove]
  );

  useInput({
    alive,
    getCurrentDir,
    onTurn: turn,
    onRestart: startGame,
    onMoveKey: playMove,
  });

  useSwipe({
    enabled: phase === 'playing' && alive && !paused,
    onSwipe: handleTurn,
  });

  usePauseHotkey(alive && phase === 'playing', () => setPaused((p) => !p));

  const gameWidth = T.COLS * T.CELL;
  const gameHeight = T.ROWS * T.CELL;
  const scale = useGameScale(gameWidth, gameHeight);

  const isNewBest = !alive && score > 0 && score >= best;

  return (
    <div className='flex min-h-screen min-h-dvh w-full flex-col items-center justify-center gap-4 bg-zinc-950 p-4 pb-32 md:pb-4'>
      {(phase === 'menu' || phase === 'gameover') && (
        <MenuScreen
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          onStart={startGame}
          muted={muted}
          onMutedChange={setMuted}
          playerName={playerName}
          onPlayerNameChange={setPlayerName}
        />
      )}

      <div
        className='flex shrink-0 items-center justify-center'
        style={{
          maxWidth: '100%',
          maxHeight: 'min(70dvh, 600px)',
        }}
      >
        <div
          className='relative origin-center overflow-hidden rounded-xl shadow-2xl ring-2 ring-zinc-700'
          style={{
            width: gameWidth,
            height: gameHeight,
            transform: `scale(${scale})`,
          }}
        >
          <canvas
            ref={canvasRef}
            width={gameWidth}
            height={gameHeight}
            className='block'
          />
          {phase === 'countdown' && (
            <CountdownOverlay visible onComplete={startPlaying} />
          )}
          {paused && phase === 'playing' && (
            <div className='absolute inset-0 flex items-center justify-center bg-black/60'>
              <span className='font-mono text-xl text-white'>Paused (P)</span>
            </div>
          )}
          {!alive && phase === 'gameover' && (
            <GameOverOverlay
              score={score}
              best={best}
              isNewBest={isNewBest}
              playTimeMs={
                gameStartTimeRef.current
                  ? Date.now() - gameStartTimeRef.current
                  : 0
              }
              snakeLength={snakeRef.current?.length ?? 0}
              onRestart={startGame}
            />
          )}
        </div>
      </div>

      {(phase === 'playing' || phase === 'countdown') && (
        <HUD
          score={score}
          best={best}
          bump={bump}
          alive={alive}
          onRestart={startGame}
        />
      )}

      {(phase === 'playing' || phase === 'countdown') && (
        <div className='text-center font-mono text-xs text-zinc-500'>
          {(1000 / delayMs).toFixed(1)} moves/s · Arrows / WASD / Swipe / Tap ·
          P pause
        </div>
      )}

      <MobileControls
        visible={phase === 'playing' && alive && !paused}
        onDirection={handleTurn}
      />
    </div>
  );
}
