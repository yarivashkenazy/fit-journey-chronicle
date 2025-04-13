
import { useWorkoutState } from "./workout/useWorkoutState";
import { useWorkoutTimer } from "./workout/useWorkoutTimer";
import { useExerciseActions } from "./workout/useExerciseActions";
import { useWorkoutManagement } from "./workout/useWorkoutManagement";

export const useWorkoutForm = (workoutId: string | undefined) => {
  const {
    workout,
    setWorkout,
    originalWorkout,
    exerciseLogs,
    setExerciseLogs,
    notes,
    setNotes,
    activeRestTimers,
    setActiveRestTimers
  } = useWorkoutState(workoutId);
  
  const { startTime, elapsedTime } = useWorkoutTimer();
  
  const {
    handleSetChange,
    handleRestTimerComplete,
    addSet,
    removeExercise,
    getExerciseById
  } = useExerciseActions(
    workout,
    setWorkout,
    exerciseLogs,
    setExerciseLogs,
    activeRestTimers,
    setActiveRestTimers
  );
  
  const {
    completeWorkout,
    addNewExercise,
    restoreDefaultExercises,
    reorderExercises
  } = useWorkoutManagement(
    workout,
    setWorkout,
    originalWorkout,
    exerciseLogs,
    setExerciseLogs,
    notes,
    startTime
  );
  
  return {
    workout,
    exerciseLogs,
    notes,
    elapsedTime,
    activeRestTimers,
    handleSetChange,
    handleRestTimerComplete,
    addSet,
    completeWorkout,
    removeExercise,
    addNewExercise,
    getExerciseById,
    setNotes,
    restoreDefaultExercises,
    reorderExercises
  };
};
