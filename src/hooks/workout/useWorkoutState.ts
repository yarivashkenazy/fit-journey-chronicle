import { useState, useEffect } from "react";
import { Workout, ExerciseLog, Set } from "@/types/workout";
import { getWorkout } from "@/utils/apiService";
import { v4 as uuidv4 } from "uuid";

export const useWorkoutState = (workoutId: string | undefined) => {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [originalWorkout, setOriginalWorkout] = useState<Workout | null>(null);
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>([]);
  const [notes, setNotes] = useState<string>("");
  const [activeRestTimers, setActiveRestTimers] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchWorkout = async () => {
      if (workoutId) {
        const workoutTemplate = await getWorkout(workoutId);
        if (workoutTemplate) {
          setWorkout(workoutTemplate);
          setOriginalWorkout(JSON.parse(JSON.stringify(workoutTemplate)));
          
          const initialLogs = workoutTemplate.exercises.map(exercise => {
            const sets: Set[] = Array(exercise.defaultSets).fill(0).map(() => ({
              id: uuidv4(),
              weight: 0,
              reps: 0,
              completed: false,
              timerActive: false
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
    };

    fetchWorkout();
  }, [workoutId]);

  return {
    workout,
    setWorkout,
    originalWorkout,
    exerciseLogs,
    setExerciseLogs,
    notes,
    setNotes,
    activeRestTimers,
    setActiveRestTimers
  };
};
