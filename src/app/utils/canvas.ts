import type { GameTuning } from '@/constants/game';
import type { XY, Food } from '@/types';

export function drawGrid(ctx: CanvasRenderingContext2D, T: GameTuning) {
  const W = T.COLS * T.CELL;
  const H = T.ROWS * T.CELL;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, W, H);

  ctx.save();
  ctx.globalAlpha = 0.4;
  ctx.strokeStyle = '#1e293b';
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

export function drawObstacles(
  ctx: CanvasRenderingContext2D,
  obstacles: XY[],
  T: GameTuning
) {
  ctx.fillStyle = '#374151';
  ctx.strokeStyle = '#4b5563';
  ctx.lineWidth = 1;
  for (const { x, y } of obstacles) {
    const px = x * T.CELL;
    const py = y * T.CELL;
    ctx.fillRect(px + 1, py + 1, T.CELL - 2, T.CELL - 2);
    ctx.strokeRect(px + 1, py + 1, T.CELL - 2, T.CELL - 2);
  }
}

export function drawFood(
  ctx: CanvasRenderingContext2D,
  f: Food | null,
  T: GameTuning
) {
  if (!f) return;

  const cx = f.x * T.CELL + T.CELL / 2;
  const cy = f.y * T.CELL + T.CELL / 2;
  const isPowerUp = f.kind && f.kind !== 'normal';

  if (isPowerUp) {
    ctx.save();
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(cx, cy, T.CELL * 0.35, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(251, 191, 36, 0.3)';
    ctx.fill();
    ctx.restore();
  }

  if (f.emoji) {
    ctx.save();
    ctx.font = `${Math.floor(T.CELL * 0.85)}px system-ui, -apple-system, Segoe UI, Roboto, Emoji, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(f.emoji, cx, cy);
    ctx.restore();
    return;
  }

  ctx.fillStyle = '#ef4444';
  ctx.fillRect(f.x * T.CELL, f.y * T.CELL, T.CELL, T.CELL);
}

export function drawSnake(
  ctx: CanvasRenderingContext2D,
  snake: XY[],
  T: GameTuning
) {
  const pad = 1;
  snake.forEach(({ x, y }, i) => {
    const px = x * T.CELL + pad;
    const py = y * T.CELL + pad;
    const size = T.CELL - pad * 2;
    const isHead = i === 0;
    ctx.fillStyle = isHead ? '#10b981' : '#22c55e';
    ctx.fillRect(px, py, size, size);
    if (isHead) {
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 1;
      ctx.strokeRect(px, py, size, size);
    }
  });
}

export function drawGameOver(ctx: CanvasRenderingContext2D, T: GameTuning) {
  const W = T.COLS * T.CELL;
  const H = T.ROWS * T.CELL;
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(0, 0, W, H);
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 20px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Game Over', W / 2, H / 2 - 12);
  ctx.font = '14px monospace';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('Press Space to restart', W / 2, H / 2 + 12);
  ctx.restore();
}

export function drawFrame(
  ctx: CanvasRenderingContext2D,
  alive: boolean,
  food: Food | null,
  snake: XY[],
  obstacles: XY[],
  T: GameTuning
) {
  drawGrid(ctx, T);
  drawObstacles(ctx, obstacles, T);
  drawFood(ctx, food, T);
  drawSnake(ctx, snake, T);
  if (!alive) drawGameOver(ctx, T);
}
