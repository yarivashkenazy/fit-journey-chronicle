import { Exercise, ExerciseLog, Set, Workout } from "@/types/workout";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { saveWorkout } from "@/utils/storageService";

export const useExerciseActions = (
  workout: Workout | null,
  setWorkout: (workout: Workout | null) => void,
  exerciseLogs: ExerciseLog[],
  setExerciseLogs: (logs: ExerciseLog[]) => void,
  activeRestTimers: Record<string, boolean>,
  setActiveRestTimers: (timers: Record<string, boolean>) => void
) => {
  const handleSetChange = (exerciseIndex: number, setIndex: number, field: keyof Set, value: any) => {
    const updatedLogs = [...exerciseLogs];
    const updatedSets = [...updatedLogs[exerciseIndex].sets];
    
    // Create a new set object with all current properties
    const currentSet = updatedSets[setIndex];
    let updatedSet = {
      ...currentSet,
      [field]: value
    };
    
    // Handle state transitions
    if (field === 'completed' && value === true) {
      // When completing a set, ensure timer is stopped
      updatedSet.timerActive = false;
    } else if (field === 'completed' && value === false) {
      // When uncompleting a set, reset to default state
      updatedSet = {
        id: currentSet.id,
        weight: 0,
        reps: 0,
        completed: false,
        timerActive: false
      };
    } else if (field === 'timerActive' && value === true) {
      // When starting timer, ensure set is not completed
      updatedSet.completed = false;
    } else if (field === 'timerActive' && value === false) {
      // When stopping timer, ensure set is completed
      updatedSet.completed = true;
    }
    
    updatedSets[setIndex] = updatedSet;
    updatedLogs[exerciseIndex] = {
      ...updatedLogs[exerciseIndex],
      sets: updatedSets
    };
    
    setExerciseLogs(updatedLogs);
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
    const updatedLogs = [...exerciseLogs];
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
    
    setExerciseLogs(updatedLogs);
  };
  
  const removeExercise = (exerciseIndex: number) => {
    if (!workout) return;
    
    const updatedLogs = [...exerciseLogs];
    updatedLogs.splice(exerciseIndex, 1);
    setExerciseLogs(updatedLogs);
    
    const updatedWorkout = { ...workout };
    updatedWorkout.exercises = [...workout.exercises];
    updatedWorkout.exercises.splice(exerciseIndex, 1);
    setWorkout(updatedWorkout);
    
    saveWorkout(updatedWorkout);
    toast.success("Exercise removed from workout");
  };
  
  const getExerciseById = (id: string): Exercise | undefined => {
    return workout?.exercises.find(e => e.id === id);
  };

  return {
    handleSetChange,
    handleRestTimerComplete,
    addSet,
    removeExercise,
    getExerciseById
  };
};
