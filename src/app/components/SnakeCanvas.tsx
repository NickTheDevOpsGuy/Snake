import { useState, useRef, useEffect, useCallback } from "react";

const CELL = 24;
const COLS = 20;
const ROWS = 20;
const TICK_MS = 160;

type XY = { x: number; y: number };
type Dir = "up" | "down" | "left" | "right";
const eq = (a: XY, b: XY) => a.x === b.x && a.y === b.y;

const keyToDir: Record<string, Dir> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
};

function isOpposite(a: Dir, b: Dir) {
  return (
    (a === "up" && b === "down") ||
    (a === "down" && b === "up") ||
    (a === "left" && b === "right") ||
    (a === "right" && b === "left")
  );
}

function nextHead(head: XY, dir: Dir): XY {
  switch (dir) {
    case "up":
      return { x: head.x, y: head.y - 1 };
    case "down":
      return { x: head.x, y: head.y + 1 };
    case "left":
      return { x: head.x - 1, y: head.y };
    case "right":
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

export default function SnakeCanvas() {
  const aliveRef = useRef(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const loopRef = useRef<number | null>(null);
  const foodRef = useRef<XY | null>(null);

  const [_alive, setAlive] = useState(true);
  const [score, setScore] = useState(0);
  const [bump, setBump] = useState(false);

  const dirRef = useRef<Dir>("right");
  const snakeRef = useRef<XY[]>([]);

  // bump animation trigger
  useEffect(() => {
    setBump(true);
    const id = setTimeout(() => setBump(false), 200);
    return () => clearTimeout(id);
  }, [score]);

  const drawSnake = useCallback((ctx: CanvasRenderingContext2D, snake: XY[]) => {
    ctx.fillStyle = "#22c55e";
    for (const { x, y } of snake) {
      ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
    }
  }, []);

  const randomFreeCell = useCallback((snake: XY[]) => {
    while (true) {
      const x = Math.floor(Math.random() * COLS);
      const y = Math.floor(Math.random() * ROWS);
      if (!snake.some((cell) => cell.x === x && cell.y === y)) {
        return { x, y };
      }
    }
  }, []);

  const draw = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    const W = COLS * CELL;
    const H = ROWS * CELL;

    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "#666";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(0, 0, W, H);

    ctx.save();
    ctx.globalAlpha = 0.8;
    ctx.strokeStyle = "#000";
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

    const food = foodRef.current;
    if (food) {
      const { x, y } = food;
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
    }

    drawSnake(ctx, snakeRef.current);
  }, [drawSnake]);

  const drawGameOver = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#fff";
    ctx.font = "16px monospace";
    ctx.fillText("Game Over — press Space", 12, 28);
    ctx.restore();
  }, []);

  const stopLoop = useCallback(() => {
    if (loopRef.current) {
      clearInterval(loopRef.current);
      loopRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    const snake = snakeRef.current;
    const head = snake[0];
    if (!head) return;

    const nh = nextHead(head, dirRef.current);
    const food = foodRef.current;
    const willEat = food !== null && eq(nh, food);
    const willPop = !willEat;
    const bodyToCheck = willPop ? snake.slice(0, -1) : snake;

    if (outOfBounds(nh) || bodyToCheck.some((s) => eq(s, nh))) {
      aliveRef.current = false;
      setAlive(false);
      stopLoop();
      drawGameOver();
      return;
    }

    if (food && eq(nh, food)) {
      snake.unshift(nh);
      setScore((s) => s + 1);
      foodRef.current = randomFreeCell(snake);
    } else {
      snake.unshift(nh);
      snake.pop();
    }

    draw();
  }, [draw, drawGameOver, randomFreeCell, stopLoop]);

  const startLoop = useCallback(() => {
    if (loopRef.current) clearInterval(loopRef.current);
    loopRef.current = window.setInterval(tick, TICK_MS);
  }, [tick]);

  const initGame = useCallback(() => {
    snakeRef.current = initSnake();
    foodRef.current = randomFreeCell(snakeRef.current);
    dirRef.current = "right";
    aliveRef.current = true;
    setAlive(true);
    setScore(0);
    draw();
  }, [draw, randomFreeCell]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "Space" && !aliveRef.current) {
        initGame();
        startLoop();
        return;
      }

      const next = keyToDir[e.key];
      if (next) {
        e.preventDefault();
        const cur = dirRef.current;
        if (!isOpposite(cur, next)) dirRef.current = next;
      }
    },
    [initGame, startLoop]
  );

  useEffect(() => {
    const c = canvasRef.current;
    const ctx = c?.getContext("2d") ?? null;
    ctxRef.current = ctx;

    initGame();
    startLoop();

    window.addEventListener("keydown", onKeyDown);
    return () => {
      stopLoop();
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [initGame, startLoop, stopLoop, onKeyDown]);

  return (
    <>
      <canvas ref={canvasRef} width={COLS * CELL} height={ROWS * CELL} />
      <div className="mt-3 text-center font-mono text-lg text-gray-100">
        <span className={bump ? "score-bump" : ""}>Score: {score}</span>
      </div>
    </>
  );
}