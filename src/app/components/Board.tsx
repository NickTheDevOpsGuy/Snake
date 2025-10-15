// src/app/components/Board.tsx
import type { XY, Food } from "@/types";
import type { GameTuning } from "@/constants/game";

type Props = {
  snake: XY[];
  food: Food | null; // supports emoji if present
  T: GameTuning; // pass DIFFICULTY_PRESETS[difficulty]
  onCellClick?: (p: XY) => void;
};

export default function Board({ snake, food, T, onCellClick }: Props) {
  const isSnake = (x: number, y: number) =>
    snake.some((p) => p.x === x && p.y === y);
  const isFood = (x: number, y: number) =>
    !!food && food.x === x && food.y === y;

  return (
    <div
      style={{
        position: "relative",
        width: T.COLS * T.CELL,
        height: T.ROWS * T.CELL,
      }}
    >
      {Array.from({ length: T.ROWS * T.COLS }, (_, i) => {
        const x = i % T.COLS;
        const y = Math.floor(i / T.COLS);
        const s = isSnake(x, y);
        const f = isFood(x, y);

        return (
          <div
            key={i}
            onClick={() => onCellClick?.({ x, y })}
            style={{
              position: "absolute",
              left: x * T.CELL,
              top: y * T.CELL,
              width: T.CELL,
              height: T.CELL,
              boxSizing: "border-box",
              border: "1px solid #222",
              background: s ? "#4caf50" : f ? "#111" : "#111",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: Math.floor(T.CELL * 0.75),
              lineHeight: 1,
              userSelect: "none",
            }}
          >
            {f ? (
              food?.emoji ? (
                food.emoji
              ) : (
                // fallback red square if no emoji
                <div
                  style={{
                    width: T.CELL,
                    height: T.CELL,
                    background: "#e53935",
                  }}
                />
              )
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
