import type { GameTuning } from "@/constants/game";
import type { XY, Food } from "@/types";

export function drawGrid(ctx: CanvasRenderingContext2D, T: GameTuning) {
  const W = T.COLS * T.CELL,
    H = T.ROWS * T.CELL;

  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = "#666";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(0, 0, W, H);

  ctx.save();
  ctx.globalAlpha = 0.8;
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1;

  for (let i = 1; i < T.COLS; i++) {
    const x = i * T.CELL;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let j = 1; j < T.ROWS; j++) {
    const y = j * T.CELL;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  ctx.restore();
}

export function drawFood(
  ctx: CanvasRenderingContext2D,
  f: Food | null,
  T: GameTuning,
) {
  if (!f) return;

  if (f.emoji) {
    ctx.save();
    ctx.font = `${Math.floor(T.CELL * 0.8)}px system-ui, -apple-system, Segoe UI, Roboto, Emoji, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(f.emoji, f.x * T.CELL + T.CELL / 2, f.y * T.CELL + T.CELL / 2);
    ctx.restore();
    return;
  }

  // fallback: red square
  ctx.fillStyle = "#ef4444";
  ctx.fillRect(f.x * T.CELL, f.y * T.CELL, T.CELL, T.CELL);
}

export function drawSnake(
  ctx: CanvasRenderingContext2D,
  snake: XY[],
  T: GameTuning,
) {
  ctx.fillStyle = "#22c55e";
  for (const { x, y } of snake) {
    ctx.fillRect(x * T.CELL, y * T.CELL, T.CELL, T.CELL);
  }
}

export function drawGameOver(ctx: CanvasRenderingContext2D, T: GameTuning) {
  ctx.save();
  ctx.globalAlpha = 0.3;
  ctx.fillRect(0, 0, T.COLS * T.CELL, T.ROWS * T.CELL);
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#fff";
  ctx.font = "16px monospace";
  ctx.fillText("Game Over — press Space", 12, 28);
  ctx.restore();
}

export function drawFrame(
  ctx: CanvasRenderingContext2D,
  alive: boolean,
  food: Food | null,
  snake: XY[],
  T: GameTuning,
) {
  drawGrid(ctx, T);
  drawFood(ctx, food, T);
  drawSnake(ctx, snake, T);
  if (!alive) drawGameOver(ctx, T);
}
