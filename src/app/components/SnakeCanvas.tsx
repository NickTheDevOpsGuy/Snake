import { useCallback, useEffect, useRef, useState } from "react";
import { CELL, COLS, ROWS, TICK_MS } from "@/constants/game";
import { keyToDir } from "@/types";
import { isOpposite } from "@/utils/logic";
import { drawFood, drawGrid, drawSnake, drawGameOver } from "@/utils/canvas";
import { useTicker } from "@/hooks/useTicker";
import { useSnakeGame } from "@/hooks/useSnakeGame";

export default function SnakeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [bump, setBump] = useState(false);

  const randomFreeCell = useCallback((snake) => {
    while (true) {
      const x = Math.floor(Math.random() * COLS);
      const y = Math.floor(Math.random() * ROWS);
      if (!snake.some((c: any) => c.x === x && c.y === y)) return { x, y };
    }
  }, []);

  const { alive, score, snakeRef, foodRef, reset, turn, tick } =
    useSnakeGame(randomFreeCell);

  // draw frame
  const draw = useCallback(() => {
    const ctx = ctxRef.current; if (!ctx) return;
    drawGrid(ctx); drawFood(ctx, foodRef.current); drawSnake(ctx, snakeRef.current);
    if (!alive) drawGameOver(ctx);
  }, [alive]);

  // bump anim on score
  useEffect(() => {
    setBump(true); const id = setTimeout(() => setBump(false), 200);
    return () => clearTimeout(id);
  }, [score]);

  // ticker
  useTicker(TICK_MS, () => { if (alive) { tick(); draw(); } }, alive);

  // init + key handling
  useEffect(() => {
    const c = canvasRef.current; ctxRef.current = c?.getContext("2d") ?? null;
    reset(); draw();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !alive) { reset(); return; }
      const next = keyToDir[e.key]; if (!next) return;
      e.preventDefault();
      // guard opposites (needs current dir; we infer from head vs second cell)
      const [h, s] = snakeRef.current;
      const cur = s ? (h.x === s.x ? (h.y < s.y ? "up" : "down") : (h.x < s.x ? "left" : "right")) : "right";
      if (!isOpposite(cur as any, next)) turn(next);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [alive, draw, reset, turn]);

  return (
    <>
      <canvas ref={canvasRef} width={COLS * CELL} height={ROWS * CELL} />
      <div className="mt-3 text-center font-mono text-lg text-gray-100">
        <span className={bump ? "score-bump" : ""}>Score: {score}</span>
      </div>
    </>
  );
}