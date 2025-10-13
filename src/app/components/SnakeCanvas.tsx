import { useState, useRef, useEffect, useCallback } from 'react';

const CELL = 24;
const COLS = 20;
const ROWS = 20;
const TICK_MS = 160;

// ——— types ———
type XY = { x: number; y: number };
type Dir = 'up' | 'down' | 'left' | 'right';
const eq = (a: XY, b: XY) => a.x === b.x && a.y === b.y;

const keyToDir: Record<string, Dir> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
};

function isOpposite(a: Dir, b: Dir) {
  return (
    (a === 'up' && b === 'down') ||
    (a === 'down' && b === 'up') ||
    (a === 'left' && b === 'right') ||
    (a === 'right' && b === 'left')
  );
}

function nextHead(head: XY, dir: Dir): XY {
  switch (dir) {
    case 'up':
      return { x: head.x, y: head.y - 1 };
    case 'down':
      return { x: head.x, y: head.y + 1 };
    case 'left':
      return { x: head.x - 1, y: head.y };
    case 'right':
      return { x: head.x + 1, y: head.y };
  }
}

function outOfBounds(p: XY): boolean {
  return p.x < 0 || p.x >= COLS || p.y < 0 || p.y >= ROWS;
}

function initSnake(): XY[] {
  const row = Math.floor(ROWS / 2);
  return [
    { x: 2, y: row },
    { x: 1, y: row },
    { x: 0, y: row },
  ];
}

// ——— component ———
export default function SnakeCanvas() {
  // refs (no re-renders)
  const aliveRef = useRef(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const loopRef = useRef<number | null>(null);
  const foodRef = useRef<XY | null>(null);

  // minimal reactive state (UI-ish stuff only)
  const [alive, setAlive] = useState(true);
  const [score, setScore] = useState(0); // not used yet, but we’ll need it soon

  // mutable game state (don’t cause re-renders each tick)
  const dirRef = useRef<Dir>('right');
  const snakeRef = useRef<XY[]>([]);

  // bump animation trigger
  const [bump, setBump] = useState(false);
  useEffect(() => {
    setBump(true);
    const id = setTimeout(() => setBump(false), 200);
    return () => clearTimeout(id);
  }, [score]);

  // ——— init ———
  function initGame() {
    foodRef.current = randomFreeCell(snakeRef.current);
    snakeRef.current = initSnake();
    dirRef.current = 'right';
    aliveRef.current = true; // keep ref in sync
    setAlive(true);
    setScore(0);
    draw();
  }

  // ——— loop control ———
  function startLoop() {
    if (loopRef.current) clearInterval(loopRef.current);
    loopRef.current = window.setInterval(tick, TICK_MS);
  }
  function stopLoop() {
    if (loopRef.current) {
      clearInterval(loopRef.current);
      loopRef.current = null;
    }
  }

  // ——— core tick ———
  function tick() {
    const snake = snakeRef.current;
    const head = snake[0];
    const nh = nextHead(head, dirRef.current);
    const food = foodRef.current;
    const willEat = food !== null && eq(nh, food);
    const willPop = !willEat;
    const bodyToCheck = willPop ? snake.slice(0, -1) : snake;

    if (!head) return;

    if (outOfBounds(nh)) {
      aliveRef.current = false;
      setAlive(false);
      stopLoop();
      drawGameOver();
      return;
    }

    if (bodyToCheck.some((segment) => eq(segment, nh))) {
      aliveRef.current = false;
      setAlive(false);
      stopLoop();
      drawGameOver();
      return;
    }

    if (food && eq(nh, food)) {
      // eat → grow: add head, don't drop tail
      snake.unshift(nh);
      setScore((s) => s + 1);
      foodRef.current = randomFreeCell(snake); // pass updated body
    } else {
      // normal move: add head, drop tail
      snake.unshift(nh);
      snake.pop();
    }

    draw();
  }

  function randomFreeCell(snake: XY[]) {
    while (true) {
      const x = Math.floor(Math.random() * COLS);
      const y = Math.floor(Math.random() * ROWS);
      if (!snake.some((cell) => cell.x === x && cell.y === y)) {
        return { x, y };
      }
    }
  }

  // ——— drawing ———
  function draw() {
    const ctx = ctxRef.current;
    if (!ctx) return;

    const W = COLS * CELL;
    const H = ROWS * CELL;

    // background fill (keeps grid contrast consistent)
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, W, H);

    // outer border
    ctx.strokeStyle = '#666'; // a bit lighter so you can still see it
    ctx.lineWidth = 1.5;
    ctx.strokeRect(0, 0, W, H);

    // grid lines — make darker & higher opacity
    ctx.save();
    ctx.globalAlpha = 0.8; // higher alpha = more visible
    ctx.strokeStyle = '#000'; // pure black grid
    ctx.lineWidth = 1; // slightly thicker
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

    // food
    const food = foodRef.current;
    if (food) {
      const { x, y } = food;
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
    }

    // snake
    drawSnake(ctx, snakeRef.current);
  }

  function drawSnake(ctx: CanvasRenderingContext2D, snake: XY[]) {
    ctx.fillStyle = '#22c55e'; // temp
    for (const { x, y } of snake) {
      ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
    }
  }

  function drawGameOver() {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#fff';
    ctx.font = '16px monospace';
    ctx.fillText('Game Over — press Space', 12, 28);
    ctx.restore();
  }

  // ——— input ———
  function onKeyDown(e: KeyboardEvent) {
    // restart on Space when dead
    if (e.code === 'Space' && !aliveRef.current) {
      initGame();
      startLoop();
      return;
    }

    // steering: use e.key ('ArrowUp', etc.)
    const next = keyToDir[e.key];
    if (next) {
      e.preventDefault(); // stop page from scrolling
      const cur = dirRef.current;
      if (!isOpposite(cur, next)) {
        dirRef.current = next;
      }
    }
  }

  // ——— lifecycle ———
  useEffect(() => {
    const c = canvasRef.current;
    const ctx = c?.getContext('2d') ?? null;
    ctxRef.current = ctx;

    initGame();
    startLoop();

    window.addEventListener('keydown', onKeyDown);
    return () => {
      stopLoop();
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} width={COLS * CELL} height={ROWS * CELL} />
      <div className='mt-3 text-center font-mono text-lg text-gray-100'>
        <span className={bump ? 'score-bump' : ''}>Score: {score}</span>
      </div>
    </>
  );
}
