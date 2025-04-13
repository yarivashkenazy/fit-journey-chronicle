import { Workout, WorkoutLog, ExerciseLog, ExerciseType } from "@/types/workout";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { saveWorkoutLog, saveCustomWorkout, saveDefaultWorkout } from "@/utils/apiService";

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
    
    try {
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
    } catch (error) {
      console.error("Error completing workout:", error);
      toast.error("Failed to save workout. Please try again.");
    }
  };
  
  const addNewExercise = async (exercise: ExerciseLog) => {
    if (!workout) return;
    
    try {
      const updatedWorkout = { ...workout };
      updatedWorkout.exercises.push({
        id: exercise.exerciseId,
        name: exercise.exerciseName,
        type: "accessory" as ExerciseType,
        targetMuscleGroup: "custom",
        defaultSets: 3,
        defaultReps: "8-12",
        defaultRestPeriod: 60,
        formCues: []
      });
      
      setWorkout(updatedWorkout);
      await saveCustomWorkout(updatedWorkout);
      toast.success("Exercise added successfully");
    } catch (error) {
      console.error("Error adding exercise:", error);
      toast.error("Failed to add exercise. Please try again.");
    }
  };
  
  const restoreDefaultExercises = async () => {
    if (!originalWorkout || !workout) return;
    
    try {
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
    } catch (error) {
      console.error("Error restoring default exercises:", error);
      toast.error("Failed to restore default exercises. Please try again.");
    }
  };
  
  const reorderExercises = async (newOrder: string[]) => {
    if (!workout) return;
    
    try {
      const updatedWorkout = { ...workout };
      updatedWorkout.exercises = newOrder.map(id => 
        workout.exercises.find(ex => ex.id === id)!
      );
      
      setWorkout(updatedWorkout);
      
      // Save to custom workouts since it's a modification
      await saveCustomWorkout(updatedWorkout);
      toast.success("Exercise order updated");
    } catch (error) {
      console.error("Error reordering exercises:", error);
      toast.error("Failed to update exercise order. Please try again.");
    }
  };
  
  return {
    completeWorkout,
    addNewExercise,
    restoreDefaultExercises,
    reorderExercises
  };
};
