import { ApiSet, ApiExercise, ApiWorkout } from '@/types/workout';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Fallback to local storage if API is unavailable
const getLocalWorkouts = (): ApiWorkout[] => {
  const stored = localStorage.getItem('workouts');
  return stored ? JSON.parse(stored) : [];
};

const saveLocalWorkouts = (workouts: ApiWorkout[]) => {
  localStorage.setItem('workouts', JSON.stringify(workouts));
};

export interface Set {
  weight: number | null;
  reps: number | null;
  completed: boolean;
  timerActive: boolean;
}

export interface Exercise {
  name: string;
  sets: Set[];
}

export interface Workout {
  _id: string;
  date: string;
  exercises: Exercise[];
}

export const workoutApi = {
  getAll: async (): Promise<ApiWorkout[]> => {
    try {
      const response = await fetch(`${API_URL}/workouts`);
      if (!response.ok) throw new Error('API unavailable');
      return response.json();
    } catch (error) {
      console.warn('Using local storage fallback:', error);
      return getLocalWorkouts();
    }
  },

  create: async (exercises: ApiExercise[]): Promise<ApiWorkout> => {
    try {
      const response = await fetch(`${API_URL}/workouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ exercises }),
      });
      if (!response.ok) throw new Error('API unavailable');
      return response.json();
    } catch (error) {
      console.warn('Using local storage fallback:', error);
      const newWorkout: ApiWorkout = {
        _id: Date.now().toString(),
        date: new Date().toISOString(),
        exercises,
      };
      const workouts = [...getLocalWorkouts(), newWorkout];
      saveLocalWorkouts(workouts);
      return newWorkout;
    }
  },

  update: async (id: string, exercises: ApiExercise[]): Promise<ApiWorkout> => {
    try {
      const response = await fetch(`${API_URL}/workouts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ exercises }),
      });
      if (!response.ok) throw new Error('API unavailable');
      return response.json();
    } catch (error) {
      console.warn('Using local storage fallback:', error);
      const workouts = getLocalWorkouts();
      const index = workouts.findIndex(w => w._id === id);
      if (index === -1) throw new Error('Workout not found');
      
      const updatedWorkout = {
        ...workouts[index],
        exercises,
      };
      workouts[index] = updatedWorkout;
      saveLocalWorkouts(workouts);
      return updatedWorkout;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/workouts/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('API unavailable');
    } catch (error) {
      console.warn('Using local storage fallback:', error);
      const workouts = getLocalWorkouts().filter(w => w._id !== id);
      saveLocalWorkouts(workouts);
    }
  },
}; 