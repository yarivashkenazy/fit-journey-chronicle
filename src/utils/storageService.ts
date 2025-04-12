
import { Workout, WorkoutLog, WorkoutGoal } from "@/types/workout";
import { activeWorkoutGoal, sampleWorkoutLogs, workoutTemplates } from "@/data/mockData";

// Storage keys
const WORKOUTS_KEY = 'fitness-tracker-workouts';
const WORKOUT_LOGS_KEY = 'fitness-tracker-logs';
const WORKOUT_GOALS_KEY = 'fitness-tracker-goals';

// Initialize local storage with default data if empty
export const initializeStorage = () => {
  // Check if storage has been initialized
  const initialized = localStorage.getItem('fitness-tracker-initialized');
  
  if (!initialized) {
    // Set workouts
    localStorage.setItem(WORKOUTS_KEY, JSON.stringify(workoutTemplates));
    
    // Set sample workout logs
    localStorage.setItem(WORKOUT_LOGS_KEY, JSON.stringify(sampleWorkoutLogs));
    
    // Set workout goal
    localStorage.setItem(WORKOUT_GOALS_KEY, JSON.stringify([activeWorkoutGoal]));
    
    // Mark as initialized
    localStorage.setItem('fitness-tracker-initialized', 'true');
  }
};

// Workout Templates CRUD
export const getWorkouts = (): Workout[] => {
  const workouts = localStorage.getItem(WORKOUTS_KEY);
  return workouts ? JSON.parse(workouts) : workoutTemplates;
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
  return goals ? JSON.parse(goals) : [activeWorkoutGoal];
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
