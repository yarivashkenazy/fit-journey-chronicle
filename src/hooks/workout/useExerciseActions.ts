import { useState, useEffect } from 'react';
import { Exercise, Workout, ApiWorkout, ApiExercise } from '@/types/workout';
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { saveWorkout } from "@/utils/storageService";
import { useSound } from '@/hooks/useSound';
import { useHaptic } from '@/hooks/useHaptic';
import { workoutApi } from '@/services/api';

const convertToApiExercise = (exercise: Exercise): ApiExercise => {
  return {
    name: exercise.name,
    sets: exercise.sets.map(set => ({
      weight: set.weight,
      reps: set.reps,
      completed: set.completed,
      timerActive: set.timerActive
    }))
  };
};

const convertToFrontendExercise = (apiExercise: ApiExercise, index: number): Exercise => {
  return {
    id: `exercise-${index}`,
    name: apiExercise.name,
    type: 'strength',
    targetMuscleGroup: 'general',
    defaultSets: apiExercise.sets.length,
    sets: apiExercise.sets.map((set, setIndex) => ({
      id: `set-${index}-${setIndex}`,
      weight: set.weight,
      reps: set.reps,
      completed: set.completed,
      timerActive: set.timerActive
    }))
  };
};

export const useExerciseActions = (initialExercises: Exercise[]) => {
  const [exercises, setExercises] = useState<Exercise[]>(initialExercises);
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { playSound } = useSound();
  const { triggerHaptic } = useHaptic();

  useEffect(() => {
    const loadWorkout = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const workouts = await workoutApi.getAll();
        if (workouts.length > 0) {
          const workout = workouts[0];
          const frontendExercises = workout.exercises.map((ex, index) => 
            convertToFrontendExercise(ex, index)
          );
          setExercises(frontendExercises);
          setCurrentWorkout({
            id: workout._id,
            name: 'Current Workout',
            category: 'strength',
            date: workout.date,
            exercises: frontendExercises
          });
        } else {
          const apiExercises = initialExercises.map(convertToApiExercise);
          const newWorkout = await workoutApi.create(apiExercises);
          setCurrentWorkout({
            id: newWorkout._id,
            name: 'Current Workout',
            category: 'strength',
            date: newWorkout.date,
            exercises: initialExercises
          });
        }
      } catch (error) {
        console.error('Error loading workout:', error);
        setError('Failed to load workout. Using local storage instead.');
        setExercises(initialExercises);
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkout();
  }, []);

  const handleSetChange = async (
    exerciseIndex: number,
    setIndex: number,
    field: 'weight' | 'reps',
    value: string
  ) => {
    const newExercises = [...exercises];
    const set = newExercises[exerciseIndex].sets[setIndex];
    
    const numericValue = value === '' ? null : Number(value);
    set[field] = numericValue;
    setExercises(newExercises);

    if (currentWorkout) {
      try {
        const apiExercises = newExercises.map(convertToApiExercise);
        await workoutApi.update(currentWorkout.id, apiExercises);
      } catch (error) {
        console.error('Error updating workout:', error);
      }
    }
  };

  const handleSetClick = async (
    exerciseIndex: number,
    setIndex: number,
    action: 'start' | 'complete' | 'reset'
  ) => {
    const newExercises = [...exercises];
    const set = newExercises[exerciseIndex].sets[setIndex];

    switch (action) {
      case 'start':
        set.timerActive = true;
        set.completed = false;
        triggerHaptic('light');
        playSound('start');
        break;

      case 'complete':
        set.timerActive = false;
        set.completed = true;
        triggerHaptic('success');
        playSound('complete');
        break;

      case 'reset':
        set.timerActive = false;
        set.completed = false;
        set.weight = null;
        set.reps = null;
        triggerHaptic('light');
        playSound('reset');
        break;
    }

    setExercises(newExercises);

    if (currentWorkout) {
      try {
        const apiExercises = newExercises.map(convertToApiExercise);
        await workoutApi.update(currentWorkout.id, apiExercises);
      } catch (error) {
        console.error('Error updating workout:', error);
      }
    }
  };

  const handleRestTimerComplete = (timerId: string) => {
    // Create a new object instead of using a callback function
    const updatedTimers = { ...activeRestTimers };
    delete updatedTimers[timerId];
    setActiveRestTimers(updatedTimers);
    console.log(`Rest timer complete for ${timerId}`);
    toast.info("Rest period complete! Start your next set.");
  };
  
  const addSet = (exerciseIndex: number) => {
    const updatedLogs = [...exercises];
    const updatedSets = [...updatedLogs[exerciseIndex].sets];
    
    const lastSet = updatedSets[updatedSets.length - 1];
    
    updatedSets.push({
      id: uuidv4(),
      weight: lastSet?.weight || 0,
      reps: lastSet?.reps || 0, 
      completed: false
    });
    
    updatedLogs[exerciseIndex] = {
      ...updatedLogs[exerciseIndex],
      sets: updatedSets
    };
    
    const lastSetIndex = updatedSets.length - 2;
    if (lastSetIndex >= 0) {
      const timerId = `${exerciseIndex}-${lastSetIndex}`;
      // Create a new object instead of using a callback function
      const updatedTimers = { ...activeRestTimers };
      delete updatedTimers[timerId];
      setActiveRestTimers(updatedTimers);
      console.log(`Removing rest timer when adding new set: ${timerId}`);
    }
    
    setExercises(updatedLogs);
  };
  
  const removeExercise = (exerciseIndex: number) => {
    if (!currentWorkout) return;
    
    const updatedLogs = [...exercises];
    updatedLogs.splice(exerciseIndex, 1);
    setExercises(updatedLogs);
    
    const updatedWorkout = { ...currentWorkout };
    updatedWorkout.exercises = [...currentWorkout.exercises];
    updatedWorkout.exercises.splice(exerciseIndex, 1);
    setCurrentWorkout(updatedWorkout);
    
    saveWorkout(updatedWorkout);
    toast.success("Exercise removed from workout");
  };
  
  const getExerciseById = (id: string): Exercise | undefined => {
    return currentWorkout?.exercises.find(e => e.id === id);
  };

  return {
    exercises,
    isLoading,
    error,
    handleSetChange,
    handleSetClick,
    handleRestTimerComplete,
    addSet,
    removeExercise,
    getExerciseById
  };
};
