
import { Workout, WorkoutLog, WorkoutGoal } from "@/types/workout";
import { v4 as uuidv4 } from "uuid";

// Storage keys
const WORKOUTS_KEY = 'fitness-tracker-workouts';
const WORKOUT_LOGS_KEY = 'fitness-tracker-logs';
const WORKOUT_GOALS_KEY = 'fitness-tracker-goals';

// Default workout templates with fixed IDs
const DEFAULT_WORKOUTS: Workout[] = [
  {
    id: "default-push-workout",
    name: "Push Workout",
    description: "Chest, shoulders and triceps focused workout",
    category: "push",
    exercises: [
      {
        id: uuidv4(),
        name: "Bench Press",
        type: "compound",
        targetMuscleGroup: "chest",
        defaultSets: 4,
        defaultReps: "8-10",
        defaultRestPeriod: 120,
        formCues: ["Retract shoulder blades", "Keep feet flat on floor"]
      },
      {
        id: uuidv4(),
        name: "Overhead Press",
        type: "compound",
        targetMuscleGroup: "shoulders",
        defaultSets: 4,
        defaultReps: "8-10",
        defaultRestPeriod: 120,
        formCues: ["Brace core", "Full range of motion"]
      },
      {
        id: uuidv4(),
        name: "Incline Dumbbell Press",
        type: "compound",
        targetMuscleGroup: "chest",
        defaultSets: 3,
        defaultReps: "10-12",
        defaultRestPeriod: 90,
        formCues: ["Control the weight", "Don't bounce at bottom"]
      },
      {
        id: uuidv4(),
        name: "Tricep Pushdowns",
        type: "accessory",
        targetMuscleGroup: "triceps",
        defaultSets: 3,
        defaultReps: "12-15",
        defaultRestPeriod: 60,
        formCues: ["Keep elbows tucked", "Squeeze at bottom"]
      },
      {
        id: uuidv4(),
        name: "Lateral Raises",
        type: "accessory",
        targetMuscleGroup: "shoulders",
        defaultSets: 3,
        defaultReps: "12-15",
        defaultRestPeriod: 60,
        formCues: ["Slight bend in elbows", "Controlled movement"]
      }
    ]
  },
  {
    id: "default-pull-workout",
    name: "Pull Workout",
    description: "Back and biceps focused workout",
    category: "pull",
    exercises: [
      {
        id: uuidv4(),
        name: "Deadlift",
        type: "compound",
        targetMuscleGroup: "back",
        defaultSets: 4,
        defaultReps: "6-8",
        defaultRestPeriod: 180,
        formCues: ["Keep back straight", "Push through heels"]
      },
      {
        id: uuidv4(),
        name: "Pull-ups",
        type: "compound",
        targetMuscleGroup: "back",
        defaultSets: 4,
        defaultReps: "6-10",
        defaultRestPeriod: 120,
        formCues: ["Full range of motion", "Controlled descent"]
      },
      {
        id: uuidv4(),
        name: "Barbell Rows",
        type: "compound",
        targetMuscleGroup: "back",
        defaultSets: 3,
        defaultReps: "8-10",
        defaultRestPeriod: 90,
        formCues: ["Keep back parallel to floor", "Pull to lower chest"]
      },
      {
        id: uuidv4(),
        name: "Bicep Curls",
        type: "accessory",
        targetMuscleGroup: "biceps",
        defaultSets: 3,
        defaultReps: "10-12",
        defaultRestPeriod: 60,
        formCues: ["Keep elbows fixed", "Full range of motion"]
      },
      {
        id: uuidv4(),
        name: "Face Pulls",
        type: "accessory",
        targetMuscleGroup: "rear delts",
        defaultSets: 3,
        defaultReps: "12-15",
        defaultRestPeriod: 60,
        formCues: ["Pull to ears", "External rotation at end"]
      }
    ]
  },
  {
    id: "default-legs-workout",
    name: "Legs Workout",
    description: "Lower body focused workout",
    category: "legs",
    exercises: [
      {
        id: uuidv4(),
        name: "Squats",
        type: "compound",
        targetMuscleGroup: "quads",
        defaultSets: 4,
        defaultReps: "8-10",
        defaultRestPeriod: 180,
        formCues: ["Keep chest up", "Knees in line with toes"]
      },
      {
        id: uuidv4(),
        name: "Romanian Deadlifts",
        type: "compound",
        targetMuscleGroup: "hamstrings",
        defaultSets: 3,
        defaultReps: "10-12",
        defaultRestPeriod: 120,
        formCues: ["Hinge at hips", "Slight bend in knees"]
      },
      {
        id: uuidv4(),
        name: "Leg Press",
        type: "compound",
        targetMuscleGroup: "quads",
        defaultSets: 3,
        defaultReps: "10-12",
        defaultRestPeriod: 120,
        formCues: ["Don't lock knees at top", "Full range of motion"]
      },
      {
        id: uuidv4(),
        name: "Calf Raises",
        type: "accessory",
        targetMuscleGroup: "calves",
        defaultSets: 4,
        defaultReps: "15-20",
        defaultRestPeriod: 60,
        formCues: ["Full stretch at bottom", "Squeeze at top"]
      },
      {
        id: uuidv4(),
        name: "Lunges",
        type: "compound",
        targetMuscleGroup: "quads",
        defaultSets: 3,
        defaultReps: "10-12 each leg",
        defaultRestPeriod: 90,
        formCues: ["Keep torso upright", "Step far enough forward"]
      }
    ]
  }
];

// Helper to check if a workout is a default one
const isDefaultWorkout = (id: string): boolean => {
  return id.startsWith('default-');
};

// Initialize local storage with empty data if empty
export const initializeStorage = () => {
  // Check if storage has been initialized
  const initialized = localStorage.getItem('fitness-tracker-initialized');
  
  if (!initialized) {
    // Set default workouts
    localStorage.setItem(WORKOUTS_KEY, JSON.stringify(DEFAULT_WORKOUTS));
    
    // Set empty workout logs
    localStorage.setItem(WORKOUT_LOGS_KEY, JSON.stringify([]));
    
    // Set empty workout goal
    localStorage.setItem(WORKOUT_GOALS_KEY, JSON.stringify([]));
    
    // Mark as initialized
    localStorage.setItem('fitness-tracker-initialized', 'true');
  }
};

// Reset storage and reinitialize with empty data
export const resetAndReinitializeStorage = () => {
  localStorage.removeItem(WORKOUTS_KEY);
  localStorage.removeItem(WORKOUT_LOGS_KEY);
  localStorage.removeItem(WORKOUT_GOALS_KEY);
  localStorage.removeItem('fitness-tracker-initialized');
  
  // Re-initialize with empty data
  initializeStorage();
};

// Workout Templates CRUD
export const getWorkouts = (): Workout[] => {
  const workouts = localStorage.getItem(WORKOUTS_KEY);
  return workouts ? JSON.parse(workouts) : [];
};

export const getWorkout = (id: string): Workout | undefined => {
  const workouts = getWorkouts();
  return workouts.find(workout => workout.id === id);
};

export const saveWorkout = (workout: Workout): void => {
  const workouts = getWorkouts();
  const index = workouts.findIndex(w => w.id === workout.id);
  
  if (index >= 0) {
    // Update existing
    workouts[index] = workout;
  } else {
    // Add new
    workouts.push(workout);
  }
  
  localStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
};

export const deleteWorkout = (id: string): void => {
  // Don't delete default workouts
  if (isDefaultWorkout(id)) {
    console.warn("Cannot delete default workout templates");
    return;
  }
  
  const workouts = getWorkouts();
  const filtered = workouts.filter(workout => workout.id !== id);
  localStorage.setItem(WORKOUTS_KEY, JSON.stringify(filtered));
};

// Workout Logs CRUD
export const getWorkoutLogs = (): WorkoutLog[] => {
  const logs = localStorage.getItem(WORKOUT_LOGS_KEY);
  return logs ? JSON.parse(logs) : [];
};

export const getWorkoutLog = (id: string): WorkoutLog | undefined => {
  const logs = getWorkoutLogs();
  return logs.find(log => log.id === id);
};

export const saveWorkoutLog = (log: WorkoutLog): void => {
  const logs = getWorkoutLogs();
  const index = logs.findIndex(l => l.id === log.id);
  
  if (index >= 0) {
    // Update existing
    logs[index] = log;
  } else {
    // Add new
    logs.push(log);
  }
  
  localStorage.setItem(WORKOUT_LOGS_KEY, JSON.stringify(logs));
};

export const deleteWorkoutLog = (id: string): void => {
  const logs = getWorkoutLogs();
  const filtered = logs.filter(log => log.id !== id);
  localStorage.setItem(WORKOUT_LOGS_KEY, JSON.stringify(filtered));
};

// Workout Goals CRUD
export const getWorkoutGoals = (): WorkoutGoal[] => {
  const goals = localStorage.getItem(WORKOUT_GOALS_KEY);
  return goals ? JSON.parse(goals) : [];
};

export const getActiveWorkoutGoal = (): WorkoutGoal | undefined => {
  const goals = getWorkoutGoals();
  return goals.find(goal => goal.isActive);
};

export const saveWorkoutGoal = (goal: WorkoutGoal): void => {
  const goals = getWorkoutGoals();
  
  // If this goal is active, deactivate all others
  if (goal.isActive) {
    goals.forEach(g => {
      if (g.id !== goal.id) {
        g.isActive = false;
      }
    });
  }
  
  const index = goals.findIndex(g => g.id === goal.id);
  
  if (index >= 0) {
    // Update existing
    goals[index] = goal;
  } else {
    // Add new
    goals.push(goal);
  }
  
  localStorage.setItem(WORKOUT_GOALS_KEY, JSON.stringify(goals));
};

export const deleteWorkoutGoal = (id: string): void => {
  const goals = getWorkoutGoals();
  const filtered = goals.filter(goal => goal.id !== id);
  localStorage.setItem(WORKOUT_GOALS_KEY, JSON.stringify(filtered));
};
