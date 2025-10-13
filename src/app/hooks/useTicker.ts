import { useEffect, useRef } from "react";

export function useTicker(ms: number, tick: () => void, running: boolean) {
  const saved = useRef(tick);
  useEffect(() => { saved.current = tick; }, [tick]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => saved.current(), ms);
    return () => clearInterval(id);
  }, [ms, running]);
}