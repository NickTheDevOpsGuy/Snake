// src/app/components/SnakeCanvas.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { CELL, COLS, ROWS, TICK_MS } from "@/constants/game";
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

  // 🔊 preload audio once
  const eatSnd = useMemo(() => new Audio("/sounds/food.mp3"), []);
  const dieSnd = useMemo(() => new Audio("/sounds/gameover.mp3"), []);
  const keySnd = useMemo(() => new Audio("/sounds/move.mp3"), []);

  // optional volumes
  useEffect(() => {
    eatSnd.volume = 0.7;
    dieSnd.volume = 0.9;
    keySnd.volume = 0.4; // subtle tap
  }, [eatSnd, dieSnd, keySnd]);

  // helper: replay quickly without getting stuck
  const play = useCallback((a: HTMLAudioElement) => {
    try {
      a.currentTime = 0;
      void a.play();
    } catch {}
  }, []);

  // adapt util (needs cols/rows) to hook signature (snake) => XY
  const pickCell = useCallback((snake: XY[]) => randomFreeCell(snake, COLS, ROWS), []);

  const { alive, score, snakeRef, foodRef, reset, turn, tick } = useSnakeGame(pickCell, {
    onEat: () => play(eatSnd),
    onDie: () => play(dieSnd),
  });

  // current direction (for opposite-turn guard)
  const getCurrentDir = useCallback<() => Dir>(() => inferDirFromSnake(snakeRef.current), [snakeRef]);

  // draw one frame
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

  // mount-only: reset once and draw
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

  // restart helper
  const restartAndDraw = useCallback(() => {
    reset();
    draw();
  }, [reset, draw]);

  // keyboard input (arrows + Space) + keypress sound
  useInput({
    alive,
    getCurrentDir,
    onTurn: turn,
    onRestart: restartAndDraw,
    onMoveKey: () => play(keySnd), // 🔊 plays once per valid arrow press
  });

  // "P" to pause/resume when alive
  usePauseHotkey(alive, () => setPaused((p) => !p));

  return (
    <>
      <canvas ref={canvasRef} width={COLS * CELL} height={ROWS * CELL} />
      <HUD score={score} best={best} bump={bump} alive={alive} onRestart={restartAndDraw} />
    </>
  );
}