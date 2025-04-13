export type ExerciseType = 'strength' | 'cardio' | 'flexibility' | 'balance';

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
  sets: Set[];
}

export interface Set {
  id: string;
  weight: number | null;
  reps: number | null;
  completed: boolean;
  timerActive: boolean;
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
  category: string;
  date: string;
  exercises: Exercise[];
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

// API-specific types
export interface ApiSet {
  weight: number | null;
  reps: number | null;
  completed: boolean;
  timerActive: boolean;
}

export interface ApiExercise {
  name: string;
  sets: ApiSet[];
}

export interface ApiWorkout {
  _id: string;
  date: string;
  exercises: ApiExercise[];
}
