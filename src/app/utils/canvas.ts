import { CELL, COLS, ROWS } from '@/constants/game';
import type { XY } from '@/types';

export function drawGrid(ctx: CanvasRenderingContext2D) {
  const W = COLS * CELL,
    H = ROWS * CELL;
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = '#666';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(0, 0, W, H);

  ctx.save();
  ctx.globalAlpha = 0.8;
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;
  for (let i = 1; i < COLS; i++) {
    const x = i * CELL;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let j = 1; j < ROWS; j++) {
    const y = j * CELL;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  ctx.restore();
}

export function drawFood(ctx: CanvasRenderingContext2D, f: XY | null) {
  if (!f) return;
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(f.x * CELL, f.y * CELL, CELL, CELL);
}

export function drawSnake(ctx: CanvasRenderingContext2D, snake: XY[]) {
  ctx.fillStyle = '#22c55e';
  for (const { x, y } of snake) {
    ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
  }
}

export function drawGameOver(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.globalAlpha = 0.3;
  ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#fff';
  ctx.font = '16px monospace';
  ctx.fillText('Game Over — press Space', 12, 28);
  ctx.restore();
}

export function drawFrame(
  ctx: CanvasRenderingContext2D,
  alive: boolean,
  food: XY | null,
  snake: XY[]
) {
  drawGrid(ctx);
  drawFood(ctx, food);
  drawSnake(ctx, snake);
  if (!alive) drawGameOver(ctx);
}
