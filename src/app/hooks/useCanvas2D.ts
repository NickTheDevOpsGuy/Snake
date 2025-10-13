// hooks/useCanvas2D.ts
import { useEffect, useRef } from 'react';
export function useCanvas2D() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  useEffect(() => {
    ctxRef.current = canvasRef.current?.getContext('2d') ?? null;
  }, []);
  return { canvasRef, ctxRef };
}
