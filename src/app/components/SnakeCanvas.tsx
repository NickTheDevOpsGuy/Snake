import { useCallback, useEffect, useState } from 'react';
import { CELL, COLS, ROWS, TICK_MS } from '@/constants/game';
import { type XY, type Dir } from '@/types';
import { randomFreeCell, inferDirFromSnake } from '@/utils/logic';
import { drawFrame } from '@/utils/canvas';
import { useTicker } from '@/hooks/useTicker';
import { useSnakeGame } from '@/hooks/useSnakeGame';
import { useInput } from '@/hooks/useInput';
import { useCanvas2D } from '@/hooks/useCanvas2D';
import { useBestScore } from '@/hooks/useBestScore';
import { usePauseHotkey } from '@/hooks/usePauseHotkey';
import HUD from '@/components/HUD';

export default function SnakeCanvas() {
  const { canvasRef, ctxRef } = useCanvas2D();

  const [bump, setBump] = useState(false);
  const [paused, setPaused] = useState(false);

  // hook expects (snake) => XY; adapt our util (needs cols/rows)
  const pickCell = useCallback(
    (snake: XY[]) => randomFreeCell(snake, COLS, ROWS),
    []
  );

  const { alive, score, snakeRef, foodRef, reset, turn, tick } =
    useSnakeGame(pickCell);

  // derive current dir from snake (for opposite-turn guard)
  const getCurrentDir = useCallback(
    (): Dir => inferDirFromSnake(snakeRef.current),
    [snakeRef]
  );

  // drawing (refs don't change, so only depend on 'alive')
  const draw = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    drawFrame(ctx, alive, foodRef.current, snakeRef.current);
  }, [alive, ctxRef, foodRef, snakeRef]);

  // score bump animation
  useEffect(() => {
    setBump(true);
    const id = setTimeout(() => setBump(false), 200);
    return () => clearTimeout(id);
  }, [score]);

  // best score persistence
  const best = useBestScore(score);

  // mount-only: first reset + first draw
  useEffect(() => {
    reset();
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ticker drives the game when alive and not paused
  useTicker(
    TICK_MS,
    () => {
      if (alive && !paused) {
        tick();
        draw();
      }
    },
    true
  );

  // keyboard input (arrows + Space restart)
  const restartAndDraw = useCallback(() => {
    reset();
    draw();
  }, [reset, draw]);

  useInput({
    alive,
    getCurrentDir,
    onTurn: turn,
    onRestart: restartAndDraw,
  });

  // "P" to pause/resume when alive
  usePauseHotkey(alive, () => setPaused((p) => !p));

  return (
    <>
      <canvas ref={canvasRef} width={COLS * CELL} height={ROWS * CELL} />
      <HUD
        score={score}
        best={best}
        bump={bump}
        alive={alive}
        onRestart={restartAndDraw}
      />
    </>
  );
}
