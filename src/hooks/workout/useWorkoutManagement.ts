import { Workout, WorkoutLog, ExerciseLog } from "@/types/workout";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { saveWorkoutLog, saveCustomWorkout, saveDefaultWorkout } from "@/utils/mongodbService";

export const useWorkoutManagement = (
  workout: Workout | null,
  setWorkout: (workout: Workout | null) => void,
  originalWorkout: Workout | null,
  exerciseLogs: ExerciseLog[],
  setExerciseLogs: (logs: ExerciseLog[]) => void,
  notes: string,
  startTime: Date
) => {
  const completeWorkout = async (navigateCallback: () => void) => {
    if (!workout) return;
    
    const now = new Date();
    const duration = Math.floor((now.getTime() - startTime.getTime()) / 60000);
    
    const filteredLogs = exerciseLogs.map(log => ({
      ...log,
      sets: log.sets.filter(set => set.weight > 0 && set.reps > 0)
    }));
    
    const workoutLog: WorkoutLog = {
      id: uuidv4(),
      workoutId: workout.id,
      workoutName: workout.name,
      date: new Date().toISOString().split('T')[0],
      duration,
      exerciseLogs: filteredLogs,
      notes
    };
    
    await saveWorkoutLog(workoutLog);
    toast.success("Workout completed and saved!");
    navigateCallback();
  };
  
  const addNewExercise = async (newExercise: {
    name: string;
    sets: number;
    reps: string;
    rest: number;
    notes: string;
  }) => {
    if (!workout) return;
    
    const newExerciseObj = {
      id: uuidv4(),
      name: newExercise.name,
      type: 'accessory' as const,
      targetMuscleGroup: '',
      defaultSets: newExercise.sets,
      defaultReps: newExercise.reps,
      defaultRestPeriod: newExercise.rest,
      notes: newExercise.notes,
      formCues: []
    };
    
    const updatedWorkout = { ...workout };
    updatedWorkout.exercises = [...workout.exercises, newExerciseObj];
    setWorkout(updatedWorkout);
    
    const newLog: ExerciseLog = {
      id: uuidv4(),
      exerciseId: newExerciseObj.id,
      exerciseName: newExerciseObj.name,
      sets: Array(newExerciseObj.defaultSets).fill(0).map(() => ({
        id: uuidv4(),
        weight: 0,
        reps: 0,
        completed: false
      })),
      date: new Date().toISOString().split('T')[0]
    };
    
    setExerciseLogs([...exerciseLogs, newLog]);
    
    // Save to custom workouts since it's a modification
    await saveCustomWorkout(updatedWorkout);
    
    toast.success("New exercise added to workout");
  };
  
  const restoreDefaultExercises = async () => {
    if (!originalWorkout || !workout) return;
    
    setWorkout(JSON.parse(JSON.stringify(originalWorkout)));
    
    // If this was a custom workout, delete it from custom workouts
    if (!originalWorkout.id.startsWith('default-')) {
      await saveDefaultWorkout(originalWorkout);
    }
    
    const initialLogs = originalWorkout.exercises.map(exercise => {
      const sets = Array(exercise.defaultSets).fill(0).map(() => ({
        id: uuidv4(),
        weight: 0,
        reps: 0,
        completed: false
      }));
      
      return {
        id: uuidv4(),
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        sets,
        date: new Date().toISOString().split('T')[0]
      };
    });
    
    setExerciseLogs(initialLogs);
    toast.success("Workout restored to default exercises");
  };
  
  const reorderExercises = async (newOrder: string[]) => {
    if (!workout) return;
    
    const updatedWorkout = { ...workout };
    updatedWorkout.exercises = newOrder.map(id => 
      workout.exercises.find(ex => ex.id === id)!
    );
    
    setWorkout(updatedWorkout);
    
    // Save to custom workouts since it's a modification
    await saveCustomWorkout(updatedWorkout);
  };
  
  return {
    completeWorkout,
    addNewExercise,
    restoreDefaultExercises,
    reorderExercises
  };
};
