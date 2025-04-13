import { ExerciseLog, WorkoutLog, WorkoutStats } from "@/types/workout";
import { getWorkoutLogs } from "./mongodbService";

// Calculate the stats for all time
export const calculateWorkoutStats = async (): Promise<WorkoutStats> => {
  const logs = await getWorkoutLogs();
  
  // Total workouts
  const totalWorkouts = logs.length;
  
  // Total sets
  const totalSets = logs.reduce((sum, log) => {
    return sum + log.exerciseLogs.reduce((setSum, exercise) => {
      return setSum + exercise.sets.length;
    }, 0);
  }, 0);
  
  // Total weight lifted
  const totalWeight = logs.reduce((sum, log) => {
    return sum + log.exerciseLogs.reduce((exerciseSum, exercise) => {
      return exerciseSum + exercise.sets.reduce((setSum, set) => {
        return setSum + (set.weight * set.reps);
      }, 0);
    }, 0);
  }, 0);
  
  // Weekly workouts (last 10 weeks)
  const weeklyWorkouts = getWeeklyWorkoutCounts(logs, 10);
  
  // Exercise progress for common exercises
  const exerciseProgress = getExerciseProgress(logs);
  
  return {
    totalWorkouts,
    totalSets,
    totalWeight,
    weeklyWorkouts,
    exerciseProgress
  };
};

// Helper function to get weekly workout counts
const getWeeklyWorkoutCounts = (logs: WorkoutLog[], weeks: number): number[] => {
  const now = new Date();
  const weeklyCounts: number[] = Array(weeks).fill(0);
  
  logs.forEach(log => {
    const logDate = new Date(log.date);
    const weeksAgo = Math.floor((now.getTime() - logDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
    
    if (weeksAgo >= 0 && weeksAgo < weeks) {
      weeklyCounts[weeksAgo]++;
    }
  });
  
  return weeklyCounts.reverse();
};

// Helper function to get exercise progress
const getExerciseProgress = (logs: WorkoutLog[]) => {
  const exerciseMap = new Map<string, { exerciseId: string; exerciseName: string; data: { date: string; maxWeight: number }[] }>();
  
  logs.forEach(log => {
    log.exerciseLogs.forEach(exercise => {
      if (!exerciseMap.has(exercise.exerciseId)) {
        exerciseMap.set(exercise.exerciseId, {
          exerciseId: exercise.exerciseId,
          exerciseName: exercise.exerciseName,
          data: []
        });
      }
      
      const maxWeight = Math.max(...exercise.sets.map(set => set.weight));
      if (maxWeight > 0) {
        exerciseMap.get(exercise.exerciseId)!.data.push({
          date: log.date,
          maxWeight
        });
      }
    });
  });
  
  return Array.from(exerciseMap.values());
};

// Calculate if the weekly workout goal is met
export const calculateWeeklyGoalProgress = (
  logs: WorkoutLog[],
  targetFrequency: number
): { current: number; target: number; percentage: number } => {
  // Get workouts from the current week
  const today = new Date();
  const firstDayOfWeek = new Date(today);
  firstDayOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
  firstDayOfWeek.setHours(0, 0, 0, 0);
  
  const workoutsThisWeek = logs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= firstDayOfWeek;
  }).length;
  
  const percentage = Math.min(100, Math.round((workoutsThisWeek / targetFrequency) * 100));
  
  return {
    current: workoutsThisWeek,
    target: targetFrequency,
    percentage
  };
};

// Get current streak (consecutive days with workouts)
export const calculateCurrentStreak = (logs: WorkoutLog[]): number => {
  if (logs.length === 0) return 0;
  
  // Sort logs by date descending
  const sortedLogs = [...logs].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Check if most recent workout was today
  const latestWorkout = new Date(sortedLogs[0].date);
  latestWorkout.setHours(0, 0, 0, 0);
  
  // If most recent workout wasn't today or yesterday, streak is 0
  if ((today.getTime() - latestWorkout.getTime()) > (24 * 60 * 60 * 1000)) {
    return 0;
  }
  
  // Count consecutive days
  let streak = 1;
  let currentDate = latestWorkout;
  
  for (let i = 1; i < sortedLogs.length; i++) {
    const prevDate = new Date(sortedLogs[i].date);
    prevDate.setHours(0, 0, 0, 0);
    
    const dayDiff = Math.round((currentDate.getTime() - prevDate.getTime()) / (24 * 60 * 60 * 1000));
    
    if (dayDiff === 1) {
      // Consecutive day
      streak++;
      currentDate = prevDate;
    } else if (dayDiff === 0) {
      // Same day, continue
      currentDate = prevDate;
    } else {
      // Break in streak
      break;
    }
  }
  
  return streak;
};
