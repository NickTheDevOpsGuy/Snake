// hooks/useBestScore.ts
import { useEffect, useState } from "react";
export function useBestScore(score: number) {
  const [best, setBest] = useState(() => Number(localStorage.getItem("best")||0));
  useEffect(() => {
    if (score > best) { localStorage.setItem("best", String(score)); setBest(score); }
  }, [score, best]);
  return best;
}