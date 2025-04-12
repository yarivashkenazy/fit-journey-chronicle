
import { WorkoutLog } from "@/types/workout";
import { v4 as uuidv4 } from "uuid";

// Generate a random date within the last 30 days
const getRandomRecentDate = (): string => {
  const today = new Date();
  const daysAgo = Math.floor(Math.random() * 30);
  const randomDate = new Date(today);
  randomDate.setDate(today.getDate() - daysAgo);
  return randomDate.toISOString().split('T')[0];
};

// Generate mock workout logs
export const generateMockWorkoutLogs = (): WorkoutLog[] => {
  const workoutTypes = [
    { id: "default-push-workout", name: "Push Workout" },
    { id: "default-pull-workout", name: "Pull Workout" },
    { id: "default-legs-workout", name: "Legs Workout" }
  ];
  
  const mockLogs: WorkoutLog[] = [];
  
  // Generate 15 random workout logs
  for (let i = 0; i < 15; i++) {
    const randomWorkout = workoutTypes[Math.floor(Math.random() * workoutTypes.length)];
    const exerciseCount = Math.floor(Math.random() * 3) + 3; // 3-5 exercises
    
    const mockLog: WorkoutLog = {
      id: uuidv4(),
      workoutId: randomWorkout.id,
      workoutName: randomWorkout.name,
      date: getRandomRecentDate(),
      duration: Math.floor(Math.random() * 30) + 30, // 30-60 minutes
      notes: "",
      exerciseLogs: []
    };
    
    // Generate exercise logs
    for (let j = 0; j < exerciseCount; j++) {
      const setCount = Math.floor(Math.random() * 2) + 3; // 3-4 sets
      const exerciseNames = [
        "Bench Press", "Deadlift", "Squats", "Pull-ups", 
        "Overhead Press", "Barbell Rows", "Lunges", 
        "Bicep Curls", "Tricep Pushdowns"
      ];
      
      mockLog.exerciseLogs.push({
        id: uuidv4(),
        exerciseId: uuidv4(),
        exerciseName: exerciseNames[Math.floor(Math.random() * exerciseNames.length)],
        date: mockLog.date,
        sets: Array(setCount).fill(0).map(() => ({
          id: uuidv4(),
          weight: Math.floor(Math.random() * 40) + 20, // 20-60 kg
          reps: Math.floor(Math.random() * 5) + 8, // 8-12 reps
          completed: true
        }))
      });
    }
    
    mockLogs.push(mockLog);
  }
  
  return mockLogs;
};

// Store the original logs
let originalLogs: WorkoutLog[] | null = null;

// Local storage key for mock data state
const MOCK_DATA_ENABLED_KEY = 'fitness-tracker-mock-data-enabled';

// Check if mock data is enabled
export const isMockDataEnabled = (): boolean => {
  return localStorage.getItem(MOCK_DATA_ENABLED_KEY) === 'true';
};

// Toggle mock data state and return new state
export const toggleMockData = (currentLogs: WorkoutLog[]): boolean => {
  const mockEnabled = isMockDataEnabled();
  
  if (!mockEnabled) {
    // Enable mock data
    originalLogs = [...currentLogs];
    localStorage.setItem(MOCK_DATA_ENABLED_KEY, 'true');
    return true;
  } else {
    // Disable mock data
    localStorage.setItem(MOCK_DATA_ENABLED_KEY, 'false');
    return false;
  }
};

// Get workout logs (either mock or original)
export const getMockOrOriginalLogs = (originalLogsFn: () => WorkoutLog[]): WorkoutLog[] => {
  if (isMockDataEnabled()) {
    return generateMockWorkoutLogs();
  }
  
  return originalLogsFn();
};
