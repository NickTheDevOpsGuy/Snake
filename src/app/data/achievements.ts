export type AchievementId =
  | 'first_score'
  | 'score_25'
  | 'score_50'
  | 'score_100'
  | 'ghost_3'
  | 'freeze_3'
  | 'expert_win'
  | 'blitz_win'
  | 'combo_5'
  | 'games_10'
  | 'games_50';

export type Achievement = {
  id: AchievementId;
  name: string;
  description: string;
  icon: string;
};

export const ACHIEVEMENTS: Record<AchievementId, Achievement> = {
  first_score: {
    id: 'first_score',
    name: 'First Bite',
    description: 'Score your first point',
    icon: '🍎',
  },
  score_25: {
    id: 'score_25',
    name: 'Getting Long',
    description: 'Reach 25 points',
    icon: '📏',
  },
  score_50: {
    id: 'score_50',
    name: 'Half Century',
    description: 'Reach 50 points',
    icon: '🌟',
  },
  score_100: {
    id: 'score_100',
    name: 'Century',
    description: 'Reach 100 points',
    icon: '💯',
  },
  ghost_3: {
    id: 'ghost_3',
    name: 'Ghost Rider',
    description: 'Use Ghost power-up 3 times',
    icon: '👻',
  },
  freeze_3: {
    id: 'freeze_3',
    name: 'Ice Cold',
    description: 'Use Freeze power-up 3 times',
    icon: '❄️',
  },
  expert_win: {
    id: 'expert_win',
    name: 'Expert',
    description: 'Score 20+ on Expert difficulty',
    icon: '🎯',
  },
  blitz_win: {
    id: 'blitz_win',
    name: 'Blitz Master',
    description: 'Score 15+ on Blitz difficulty',
    icon: '⚡',
  },
  combo_5: {
    id: 'combo_5',
    name: 'Combo King',
    description: 'Get a 5x combo',
    icon: '🔥',
  },
  games_10: {
    id: 'games_10',
    name: 'Dedicated',
    description: 'Play 10 games',
    icon: '🎮',
  },
  games_50: {
    id: 'games_50',
    name: 'Addicted',
    description: 'Play 50 games',
    icon: '🏆',
  },
};
