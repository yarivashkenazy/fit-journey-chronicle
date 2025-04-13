export type AchievementCategory = 'workout' | 'streak' | 'progress' | 'social';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  icon: string;
  progress: number;
  target: number;
  unlocked: boolean;
  dateUnlocked?: string;
  xp: number;
}

export interface AchievementProgress {
  totalXP: number;
  level: number;
  nextLevelXP: number;
  currentLevelXP: number;
  achievements: Achievement[];
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-workout',
    name: 'First Steps',
    description: 'Complete your first workout',
    category: 'workout',
    icon: '🏃',
    progress: 0,
    target: 1,
    unlocked: false,
    xp: 100
  },
  {
    id: 'streak-3',
    name: 'Consistency is Key',
    description: 'Maintain a 3-day workout streak',
    category: 'streak',
    icon: '🔥',
    progress: 0,
    target: 3,
    unlocked: false,
    xp: 200
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day workout streak',
    category: 'streak',
    icon: '💪',
    progress: 0,
    target: 7,
    unlocked: false,
    xp: 500
  },
  {
    id: 'pr-break',
    name: 'Personal Best',
    description: 'Set a new personal record',
    category: 'progress',
    icon: '🎯',
    progress: 0,
    target: 1,
    unlocked: false,
    xp: 300
  },
  {
    id: 'workout-10',
    name: 'Decade of Workouts',
    description: 'Complete 10 workouts',
    category: 'workout',
    icon: '🏆',
    progress: 0,
    target: 10,
    unlocked: false,
    xp: 400
  }
]; 