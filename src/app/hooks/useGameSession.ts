import { useCallback, useEffect, useRef } from 'react';
import type { GameDifficulty } from '@/constants/game';

type Phase = 'menu' | 'countdown' | 'playing' | 'gameover';

type Options = {
  phase: Phase;
  alive: boolean;
  score: number;
  difficulty: GameDifficulty;
  playerName: string;
  submitScore: (
    score: number,
    difficulty: GameDifficulty,
    name?: string
  ) => void;
  setPhase: (p: Phase) => void;
  setPaused: (fn: (prev: boolean) => boolean) => void;
  reset: () => void;
  draw: () => void;
  startPhase: 'countdown';
};

/** Encapsulates game start, score submission, and space-to-start. */
export function useGameSession(opts: Options) {
  const {
    phase,
    alive,
    score,
    difficulty,
    playerName,
    submitScore,
    setPhase,
    setPaused,
    reset,
    draw,
    startPhase,
  } = opts;

  const submittedRef = useRef(false);
  const gameStartTimeRef = useRef<number>(0);

  const startGame = useCallback(() => {
    setPaused(() => false);
    reset();
    draw();
    gameStartTimeRef.current = Date.now();
    setPhase(startPhase);
  }, [setPaused, reset, draw, setPhase, startPhase]);

  const startPlaying = useCallback(() => {
    setPhase('playing');
  }, [setPhase]);

  useEffect(() => {
    if (!alive && phase === 'gameover' && score > 0 && !submittedRef.current) {
      submittedRef.current = true;
      submitScore(score, difficulty, playerName || undefined);
    }
  }, [alive, phase, score, difficulty, playerName, submitScore]);

  useEffect(() => {
    if (phase === 'playing') submittedRef.current = false;
  }, [phase]);

  useEffect(() => {
    if (phase === 'menu') {
      reset();
      draw();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((phase === 'menu' || phase === 'gameover') && e.code === 'Space') {
        e.preventDefault();
        startGame();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, startGame]);

  return { startGame, startPlaying, gameStartTimeRef };
}
