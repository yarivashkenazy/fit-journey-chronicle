import { Workout, WorkoutLog } from '@/types/workout';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Default Workouts
export const getDefaultWorkouts = async (): Promise<Workout[]> => {
  const response = await fetch(`${API_URL}/workouts/default`);
  return response.json();
};

export const saveDefaultWorkout = async (workout: Workout): Promise<void> => {
  await fetch(`${API_URL}/workouts/default/${workout.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(workout),
  });
};

// Custom Workouts
export const getCustomWorkouts = async (): Promise<Workout[]> => {
  const response = await fetch(`${API_URL}/workouts/custom`);
  return response.json();
};

export const saveCustomWorkout = async (workout: Workout): Promise<void> => {
  await fetch(`${API_URL}/workouts/custom/${workout.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(workout),
  });
};

// Workout Logs
export const getWorkoutLogs = async (): Promise<WorkoutLog[]> => {
  const response = await fetch(`${API_URL}/workouts/logs`);
  return response.json();
};

export const saveWorkoutLog = async (workoutLog: WorkoutLog): Promise<void> => {
  await fetch(`${API_URL}/workouts/logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(workoutLog),
  });
};

// Get a specific workout (checks both default and custom)
export const getWorkout = async (workoutId: string): Promise<Workout | null> => {
  const response = await fetch(`${API_URL}/workouts/${workoutId}`);
  if (!response.ok) return null;
  return response.json();
}; 