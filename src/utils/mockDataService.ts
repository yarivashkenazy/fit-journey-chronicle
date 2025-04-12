
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

// Generate random notes for workouts
const getRandomNotes = (): string => {
  const notes = [
    "Felt strong today!",
    "Increased weight on all exercises",
    "Struggled with energy levels",
    "Great pump, focused on form",
    "Quick workout but effective",
    "Added an extra set on main lifts",
    "Focused on time under tension",
    "Recovery day, kept it light",
    "Personal best on main lift!",
    ""
  ];
  
  return notes[Math.floor(Math.random() * notes.length)];
};

// Generate mock workout logs
export const generateMockWorkoutLogs = (): WorkoutLog[] => {
  const workoutTypes = [
    { id: "default-push-workout", name: "Push Workout" },
    { id: "default-pull-workout", name: "Pull Workout" },
    { id: "default-legs-workout", name: "Legs Workout" }
  ];
  
  const mockLogs: WorkoutLog[] = [];
  
  // Generate 15-25 random workout logs
  const logsCount = Math.floor(Math.random() * 11) + 15; // 15-25 logs
  
  for (let i = 0; i < logsCount; i++) {
    const randomWorkout = workoutTypes[Math.floor(Math.random() * workoutTypes.length)];
    const exerciseCount = Math.floor(Math.random() * 3) + 3; // 3-5 exercises
    
    const mockLog: WorkoutLog = {
      id: uuidv4(),
      workoutId: randomWorkout.id,
      workoutName: randomWorkout.name,
      date: getRandomRecentDate(),
      duration: Math.floor(Math.random() * 30) + 30, // 30-60 minutes
      notes: getRandomNotes(),
      exerciseLogs: []
    };
    
    // Generate exercise logs
    for (let j = 0; j < exerciseCount; j++) {
      const setCount = Math.floor(Math.random() * 2) + 3; // 3-4 sets
      const exerciseNames = [
        "Bench Press", "Deadlift", "Squats", "Pull-ups", 
        "Overhead Press", "Barbell Rows", "Lunges", 
        "Bicep Curls", "Tricep Pushdowns", "Leg Press",
        "Lateral Raises", "Face Pulls", "Romanian Deadlifts",
        "Dips", "Incline Bench Press", "Calf Raises",
        "Hammer Curls", "Skull Crushers", "Leg Extensions"
      ];
      
      const exerciseName = exerciseNames[Math.floor(Math.random() * exerciseNames.length)];
      
      // Generate progressive overload pattern for the sets
      const baseWeight = Math.floor(Math.random() * 40) + 20; // 20-60 kg
      
      mockLog.exerciseLogs.push({
        id: uuidv4(),
        exerciseId: uuidv4(),
        exerciseName: exerciseName,
        date: mockLog.date,
        sets: Array(setCount).fill(0).map((_, index) => {
          // Progressive overload pattern - either ascending, descending, or flat
          const pattern = Math.floor(Math.random() * 3); // 0: flat, 1: ascending, 2: descending
          let weight = baseWeight;
          
          if (pattern === 1) { // ascending
            weight = baseWeight - (setCount - index - 1) * 2.5;
          } else if (pattern === 2) { // descending
            weight = baseWeight - index * 2.5;
          }
          
          return {
            id: uuidv4(),
            weight: Math.round(weight * 2) / 2, // round to nearest 0.5
            reps: Math.floor(Math.random() * 5) + 8, // 8-12 reps
            completed: Math.random() > 0.1 // 90% chance of completion
          };
        })
      });
    }
    
    mockLogs.push(mockLog);
  }
  
  // Sort by date (newest first)
  return mockLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
