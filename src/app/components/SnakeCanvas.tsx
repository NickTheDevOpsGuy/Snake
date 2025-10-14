// src/app/components/SnakeCanvas.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CELL,
  COLS,
  ROWS,
  TICK_START_MS,
  TICK_MIN_MS,
  TICK_STEP_MS,
} from "@/constants/game";
import type { XY, Dir } from "@/types";
import { randomFreeCell, inferDirFromSnake } from "@/utils/logic";
import { drawFrame } from "@/utils/canvas";
import { useTicker } from "@/hooks/useTicker";
import { useSnakeGame } from "@/hooks/useSnakeGame";
import { useInput } from "@/hooks/useInput";
import { useCanvas2D } from "@/hooks/useCanvas2D";
import { useBestScore } from "@/hooks/useBestScore";
import { usePauseHotkey } from "@/hooks/usePauseHotkey";
import HUD from "@/components/HUD";

export default function SnakeCanvas() {
  const { canvasRef, ctxRef } = useCanvas2D();

  const [bump, setBump] = useState(false);
  const [paused, setPaused] = useState(false);

  // 🔊 preload sounds
  const eatSnd = useMemo(() => new Audio("/sounds/food.mp3"), []);
  const dieSnd = useMemo(() => new Audio("/sounds/gameover.mp3"), []);
  const keySnd = useMemo(() => new Audio("/sounds/move.mp3"), []);

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

  // choose random food cell
  const pickCell = useCallback(
    (snake: XY[]) => randomFreeCell(snake, COLS, ROWS),
    []
  );

  const { alive, score, snakeRef, foodRef, reset, turn, tick } = useSnakeGame(
    pickCell,
    {
      onEat: () => play(eatSnd),
      onDie: () => play(dieSnd),
    }
  );

  const getCurrentDir = useCallback<() => Dir>(
    () => inferDirFromSnake(snakeRef.current),
    [snakeRef]
  );

  const draw = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    drawFrame(ctx, alive, foodRef.current, snakeRef.current);
  }, [alive, ctxRef, foodRef, snakeRef]);

  // bump animation
  useEffect(() => {
    setBump(true);
    const id = setTimeout(() => setBump(false), 200);
    return () => clearTimeout(id);
  }, [score]);

  const best = useBestScore(score);

  useEffect(() => {
    reset();
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ⚡ dynamic speed: faster as you eat
  const delayMs = Math.max(TICK_MIN_MS, TICK_START_MS - score * TICK_STEP_MS);

  useTicker(
    delayMs,
    () => {
      if (alive && !paused) {
        tick();
        draw();
      }
    },
    true
  );

  const restartAndDraw = useCallback(() => {
    reset();
    draw();
  }, [reset, draw]);

  useInput({
    alive,
    getCurrentDir,
    onTurn: turn,
    onRestart: restartAndDraw,
    onMoveKey: () => play(keySnd),
  });

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
      {/* Optional debug display for speed */}
      <div className="mt-1 text-center text-xs opacity-60 font-mono">
        {(1000 / delayMs).toFixed(1)} moves/s
      </div>
    </>
  );
}