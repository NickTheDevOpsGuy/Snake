import type { GameDifficulty } from '@/constants/game';
import { DIFFICULTY_PRESETS } from '@/constants/game';

export function computeDelayMs(
  difficulty: GameDifficulty,
  score: number
): number {
  const T = DIFFICULTY_PRESETS[difficulty];
  const linear = T.TICK_START_MS - score * T.TICK_STEP_MS;
  const curve = T.speedCurve;
  let delay = linear;
  if (curve === 'ease-in') {
    delay = T.TICK_START_MS - score * score * 0.08;
  } else if (curve === 'ease-out') {
    delay = T.TICK_START_MS - score * T.TICK_STEP_MS * 0.85;
  }
  return Math.max(T.TICK_MIN_MS, delay);
}
