import { Workout, WorkoutLog } from '@/types/workout';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const handleResponse = async (response: Response) => {
  console.log('=== API Response Start ===');
  console.log('Response Status:', response.status);
  console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
  
  const contentType = response.headers.get('content-type');
  console.log('Content-Type:', contentType);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('API Error Response:', errorText);
    throw new Error(errorText || 'An error occurred');
  }
  
  if (!contentType?.includes('application/json')) {
    const text = await response.text();
    console.error('Invalid Content-Type:', contentType);
    console.error('Response Text:', text);
    throw new Error(`Invalid content type: ${contentType}`);
  }
  
  try {
    const data = await response.json();
    console.log('Response Data:', data);
    console.log('=== API Response End ===');
    return data;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    throw new Error('Invalid JSON response');
  }
};

// Default Workouts
export const getDefaultWorkouts = async (): Promise<Workout[]> => {
  console.log('Fetching default workouts from:', `${API_URL}/workouts/default`);
  const response = await fetch(`${API_URL}/workouts/default`);
  return handleResponse(response);
};

export const saveDefaultWorkout = async (workout: Workout): Promise<void> => {
  console.log('Saving default workout:', workout);
  const response = await fetch(`${API_URL}/workouts/default/${workout.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(workout),
  });
  await handleResponse(response);
};

// Custom Workouts
export const getCustomWorkouts = async (): Promise<Workout[]> => {
  console.log('Fetching custom workouts from:', `${API_URL}/workouts/custom`);
  const response = await fetch(`${API_URL}/workouts/custom`);
  return handleResponse(response);
};

export const saveCustomWorkout = async (workout: Workout): Promise<void> => {
  console.log('Saving custom workout:', workout);
  const response = await fetch(`${API_URL}/workouts/custom/${workout.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(workout),
  });
  await handleResponse(response);
};

// Workout Logs
export const getWorkoutLogs = async (): Promise<WorkoutLog[]> => {
  console.log('Fetching workout logs from:', `${API_URL}/workouts/logs`);
  const response = await fetch(`${API_URL}/workouts/logs`);
  return handleResponse(response);
};

export const saveWorkoutLog = async (workoutLog: WorkoutLog): Promise<WorkoutLog> => {
  console.log('Saving workout log:', workoutLog);
  const response = await fetch(`${API_URL}/workouts/logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(workoutLog),
  });
  return handleResponse(response);
};

// Get a specific workout (checks both default and custom)
export const getWorkout = async (workoutId: string): Promise<Workout | null> => {
  console.log('Fetching workout:', `${API_URL}/workouts/${workoutId}`);
  try {
    const response = await fetch(`${API_URL}/workouts/${workoutId}`);
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