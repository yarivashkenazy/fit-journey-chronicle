import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { Exercise, ExerciseLog, Set, Workout, WorkoutLog } from "@/types/workout";
import { getWorkout, saveWorkoutLog, saveWorkout } from "@/utils/storageService";

export const useWorkoutForm = (workoutId: string | undefined) => {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [originalWorkout, setOriginalWorkout] = useState<Workout | null>(null);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>([]);
  const [notes, setNotes] = useState<string>("");
  const [elapsedTime, setElapsedTime] = useState<string>("00:00");
  const [activeRestTimers, setActiveRestTimers] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (workoutId) {
      const workoutTemplate = getWorkout(workoutId);
      if (workoutTemplate) {
        setWorkout(workoutTemplate);
        setOriginalWorkout(JSON.parse(JSON.stringify(workoutTemplate)));
        
        const initialLogs = workoutTemplate.exercises.map(exercise => {
          const sets: Set[] = Array(exercise.defaultSets).fill(0).map(() => ({
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
      }
    }
  }, [workoutId]);
  
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - startTime.getTime();
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setElapsedTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [startTime]);
  
  const handleSetChange = (exerciseIndex: number, setIndex: number, field: keyof Set, value: any) => {
    const updatedLogs = [...exerciseLogs];
    const updatedSets = [...updatedLogs[exerciseIndex].sets];
    
    updatedSets[setIndex] = {
      ...updatedSets[setIndex],
      [field]: field === 'completed' ? value : Number(value)
    };
    
    updatedLogs[exerciseIndex] = {
      ...updatedLogs[exerciseIndex],
      sets: updatedSets
    };
    
    setExerciseLogs(updatedLogs);
    
    if (field === 'completed' && value === true && workout) {
      const timerId = `${exerciseIndex}-${setIndex}`;
      
      if (setIndex < updatedLogs[exerciseIndex].sets.length - 1 || updatedSets.length === 1) {
        setActiveRestTimers(prev => ({ ...prev, [timerId]: true }));
        console.log(`Starting rest timer for ${timerId}`);
      }
    }
    
    if (field === 'completed' && value === false) {
      const timerId = `${exerciseIndex}-${setIndex}`;
      setActiveRestTimers(prev => {
        const updated = { ...prev };
        delete updated[timerId];
        return updated;
      });
      console.log(`Removing rest timer for ${timerId}`);
    }
  };
  
  const handleRestTimerComplete = (timerId: string) => {
    setActiveRestTimers(prev => {
      const updated = { ...prev };
      delete updated[timerId];
      return updated;
    });
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
    
    setExerciseLogs(updatedLogs);
  };
  
  const completeWorkout = (navigateCallback: () => void) => {
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
    
    saveWorkoutLog(workoutLog);
    toast.success("Workout completed and saved!");
    navigateCallback();
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
  
  const addNewExercise = (newExercise: {
    name: string;
    sets: number;
    reps: string;
    rest: number;
    notes: string;
  }) => {
    if (!workout) return;
    
    const newExerciseObj: Exercise = {
      id: uuidv4(),
      name: newExercise.name,
      type: 'accessory',
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
    
    saveWorkout(updatedWorkout);
    
    toast.success("New exercise added to workout");
  };
  
  const getExerciseById = (id: string): Exercise | undefined => {
    return workout?.exercises.find(e => e.id === id);
  };
  
  const restoreDefaultExercises = () => {
    if (!originalWorkout || !workout) return;
    
    setWorkout(JSON.parse(JSON.stringify(originalWorkout)));
    saveWorkout(originalWorkout);
    
    const initialLogs = originalWorkout.exercises.map(exercise => {
      const sets: Set[] = Array(exercise.defaultSets).fill(0).map(() => ({
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
  
  const reorderExercises = (updatedWorkout: Workout, reorderedExercises: ExerciseLog[]) => {
    setWorkout(updatedWorkout);
    setExerciseLogs(reorderedExercises);
    
    saveWorkout(updatedWorkout);
    toast.success("Exercise order updated");
  };
  
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
