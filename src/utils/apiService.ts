import { Workout, WorkoutLog } from '@/types/workout';

const API_URL = import.meta.env.VITE_API_URL || '/.netlify/functions/workouts';

const handleResponse = async (response: Response) => {
  console.log('API Response Status:', response.status);
  console.log('API Response Headers:', Object.fromEntries(response.headers.entries()));
  
  const contentType = response.headers.get('content-type');
  console.log('Content-Type:', contentType);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('API Error Response:', errorText);
    throw new Error(errorText || 'An error occurred');
  }
  
  try {
    const data = await response.json();
    console.log('API Response Data:', data);
    return data;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    const text = await response.text();
    console.error('Raw Response:', text);
    throw new Error('Invalid JSON response');
  }
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

export const saveWorkoutLog = async (workoutLog: WorkoutLog): Promise<WorkoutLog> => {
  console.log('Saving workout log:', workoutLog);
  console.log('API URL:', `${API_URL}/logs`);
  
  try {
    const response = await fetch(`${API_URL}/logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workoutLog),
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error in saveWorkoutLog:', error);
    throw error;
  }
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

export const fetchWorkout = async (workoutId: string): Promise<Workout> => {
  console.log('Fetching workout with ID:', workoutId);
  console.log('API URL:', `${API_URL}/${workoutId}`);
  
  try {
    const response = await fetch(`${API_URL}/${workoutId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error in fetchWorkout:', error);
    throw error;
  }
};

export const fetchWorkouts = async (): Promise<Workout[]> => {
  console.log('Fetching all workouts');
  console.log('API URL:', API_URL);
  
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error in fetchWorkouts:', error);
    throw error;
  }
};

export const saveWorkout = async (workout: Workout): Promise<Workout> => {
  console.log('Saving workout:', workout);
  console.log('API URL:', API_URL);
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workout),
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error in saveWorkout:', error);
    throw error;
  }
};

export const fetchWorkoutLogs = async (): Promise<WorkoutLog[]> => {
  console.log('Fetching workout logs');
  console.log('API URL:', `${API_URL}/logs`);
  
  try {
    const response = await fetch(`${API_URL}/logs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error in fetchWorkoutLogs:', error);
    throw error;
  }
}; 