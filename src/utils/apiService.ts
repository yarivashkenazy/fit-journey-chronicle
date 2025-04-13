import { Workout, WorkoutLog } from '@/types/workout';

const API_URL = import.meta.env.VITE_API_URL || '/.netlify/functions/workouts';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'An error occurred');
  }
  return response.json();
};

// Default Workouts
export const getDefaultWorkouts = async (): Promise<Workout[]> => {
  const response = await fetch(`${API_URL}/default`);
  return handleResponse(response);
};

export const saveDefaultWorkout = async (workout: Workout): Promise<void> => {
  const response = await fetch(`${API_URL}/default/${workout.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(workout),
  });
  await handleResponse(response);
};

// Custom Workouts
export const getCustomWorkouts = async (): Promise<Workout[]> => {
  const response = await fetch(`${API_URL}/custom`);
  return handleResponse(response);
};

export const saveCustomWorkout = async (workout: Workout): Promise<void> => {
  const response = await fetch(`${API_URL}/custom/${workout.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(workout),
  });
  await handleResponse(response);
};

// Workout Logs
export const getWorkoutLogs = async (): Promise<WorkoutLog[]> => {
  const response = await fetch(`${API_URL}/logs`);
  return handleResponse(response);
};

export const saveWorkoutLog = async (workoutLog: WorkoutLog): Promise<void> => {
  const response = await fetch(`${API_URL}/logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(workoutLog),
  });
  await handleResponse(response);
};

// Get a specific workout (checks both default and custom)
export const getWorkout = async (workoutId: string): Promise<Workout | null> => {
  try {
    console.log('Fetching workout:', `${API_URL}/${workoutId}`);
    const response = await fetch(`${API_URL}/${workoutId}`);
    if (!response.ok) {
      console.error('Workout fetch failed:', response.status, response.statusText);
      return null;
    }
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching workout:', error);
    return null;
  }
}; 