export type ExerciseType = 'compound' | 'accessory' | 'finishing' | 'unilateral' | 'superset';

export interface Exercise {
  id: string;
  name: string;
  type: ExerciseType;
  targetMuscleGroup: string;
  defaultSets: number;
  defaultReps: string;
  defaultRestPeriod: number;
  notes?: string;
  formCues?: string[];
}

export interface Set {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
  timerActive?: boolean;
  notes?: string;
}

export interface ExerciseLog {
  id: string;
  exerciseId: string;
  exerciseName: string;
  sets: Set[];
  date: string;
}

export interface Workout {
  id: string;
  name: string;
  description?: string;
  exercises: Exercise[];
  category: WorkoutCategory;
}

export type WorkoutCategory = 'push' | 'pull' | 'legs' | 'full' | 'cardio' | 'custom';

export interface WorkoutLog {
  id: string;
  workoutId: string;
  workoutName: string;
  date: string;
  duration: number; // in minutes
  exerciseLogs: ExerciseLog[];
  notes?: string;
}

export interface WorkoutGoal {
  id: string;
  frequency: number; // workouts per week
  startDate: string;
  endDate?: string;
  isActive: boolean;
  targetStreak?: number; // New field for streak goal
}

export interface WorkoutStats {
  totalWorkouts: number;
  totalSets: number;
  totalWeight: number; // in kg/lbs
  weeklyWorkouts: number[];
  exerciseProgress: {
    exerciseId: string;
    exerciseName: string;
    data: {
      date: string;
      maxWeight: number;
    }[];
  }[];
}
