import type { XY } from "@/types";
import { CELL, COLS, ROWS } from "@/constants/game";

type Props = { snake: XY[]; food: XY; onCellClick?: (p: XY) => void; };
export default function Board({ snake, food, onCellClick }: Props) {
  const isSnake = (x: number, y: number) => snake.some(p => p.x === x && p.y === y);
  const isFood =  (x: number, y: number) => food.x === x && food.y === y;

  return (
    <div style={{ width: COLS*CELL, height: ROWS*CELL, position: "relative" }}>
      {Array.from({ length: ROWS * COLS }, (_, i) => {
        const x = i % COLS, y = Math.floor(i / COLS);
        const s = isSnake(x, y), f = isFood(x, y);
        return (
          <div key={i}
            onClick={() => onCellClick?.({ x, y })}
            style={{
              position: "absolute", left: x*CELL, top: y*CELL,
              width: CELL, height: CELL, boxSizing: "border-box",
              border: "1px solid #222", background: s ? "#4caf50" : f ? "#e53935" : "#111",
            }}
          />
        );
      })}
    </div>
  );
}