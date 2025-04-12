
import { Exercise, Workout, WorkoutGoal, WorkoutLog } from "@/types/workout";
import { v4 as uuidv4 } from 'uuid';

// Push Day Exercises
export const pushExercises: Exercise[] = [
  {
    id: "ex-1",
    name: "Bench Press",
    type: "compound",
    targetMuscleGroup: "chest",
    defaultSets: 4,
    defaultReps: "8-10",
    defaultRestPeriod: 120,
    formCues: [
      "Drive feet into floor",
      "Retract shoulder blades",
      "Maintain neutral wrist position"
    ],
    notes: "Increase weight by 2.5-5% when you can complete all sets with proper form"
  },
  {
    id: "ex-2",
    name: "Overhead Press",
    type: "compound",
    targetMuscleGroup: "shoulders",
    defaultSets: 3,
    defaultReps: "8-10",
    defaultRestPeriod: 90,
    formCues: [
      "Brace core",
      "Maintain neutral spine",
      "Press directly overhead"
    ]
  },
  {
    id: "ex-3",
    name: "Dumbbell Incline Press",
    type: "accessory",
    targetMuscleGroup: "upper chest",
    defaultSets: 3,
    defaultReps: "10-12",
    defaultRestPeriod: 75,
    notes: "Targets the upper chest fibers"
  },
  {
    id: "ex-4",
    name: "Cable Tricep Pushdowns",
    type: "accessory",
    targetMuscleGroup: "triceps",
    defaultSets: 3,
    defaultReps: "12-15",
    defaultRestPeriod: 60,
    notes: "Focus on complete extension and controlled eccentric phase"
  },
  {
    id: "ex-5",
    name: "Push-ups",
    type: "finishing",
    targetMuscleGroup: "chest, shoulders, triceps",
    defaultSets: 2,
    defaultReps: "15-20",
    defaultRestPeriod: 60,
    notes: "Perform to near failure"
  }
];

// Pull Day Exercises
export const pullExercises: Exercise[] = [
  {
    id: "ex-6",
    name: "Deadlift",
    type: "compound",
    targetMuscleGroup: "posterior chain",
    defaultSets: 4,
    defaultReps: "6-8",
    defaultRestPeriod: 150,
    formCues: [
      "Maintain neutral spine",
      "Drive through heels",
      "Keep bar close to body"
    ]
  },
  {
    id: "ex-7",
    name: "Pull-Ups",
    type: "compound",
    targetMuscleGroup: "back",
    defaultSets: 3,
    defaultReps: "8-10",
    defaultRestPeriod: 90,
    notes: "If unable to complete recommended reps, use assisted pull-up machine or bands"
  },
  {
    id: "ex-8",
    name: "Lat Pull-Downs",
    type: "compound",
    targetMuscleGroup: "back",
    defaultSets: 3,
    defaultReps: "8-10",
    defaultRestPeriod: 90,
    formCues: [
      "Focus on pulling with elbows rather than hands for better lat engagement"
    ]
  },
  {
    id: "ex-9",
    name: "Single-Arm Dumbbell Row",
    type: "unilateral",
    targetMuscleGroup: "mid back",
    defaultSets: 3,
    defaultReps: "10-12",
    defaultRestPeriod: 60,
    notes: "Addresses potential muscle imbalances"
  },
  {
    id: "ex-10",
    name: "Cable Face Pulls",
    type: "accessory",
    targetMuscleGroup: "rear deltoids, upper back",
    defaultSets: 3,
    defaultReps: "12-15",
    defaultRestPeriod: 60,
    notes: "Promotes better posture and shoulder health"
  },
  {
    id: "ex-11",
    name: "Bicep Curls",
    type: "finishing",
    targetMuscleGroup: "biceps",
    defaultSets: 3,
    defaultReps: "12-15",
    defaultRestPeriod: 60
  }
];

// Leg Day Exercises
export const legExercises: Exercise[] = [
  {
    id: "ex-12",
    name: "Barbell Back Squats",
    type: "compound",
    targetMuscleGroup: "quadriceps, glutes",
    defaultSets: 4,
    defaultReps: "8-10",
    defaultRestPeriod: 150,
    formCues: [
      "Keep chest up",
      "Knees tracking over toes",
      "Hips below parallel at bottom position"
    ]
  },
  {
    id: "ex-13",
    name: "Romanian Deadlifts",
    type: "compound",
    targetMuscleGroup: "hamstrings, glutes",
    defaultSets: 3,
    defaultReps: "10-12",
    defaultRestPeriod: 90,
    formCues: [
      "Hinge at hips",
      "Maintain slight knee bend",
      "Feel stretch in hamstrings"
    ]
  },
  {
    id: "ex-14",
    name: "Bulgarian Split Squats",
    type: "unilateral",
    targetMuscleGroup: "quadriceps, glutes",
    defaultSets: 3,
    defaultReps: "10-12",
    defaultRestPeriod: 60,
    notes: "Improves balance, addresses asymmetries"
  },
  {
    id: "ex-15",
    name: "Hip Thrusts",
    type: "accessory",
    targetMuscleGroup: "glutes",
    defaultSets: 3,
    defaultReps: "12-15",
    defaultRestPeriod: 75,
    notes: "Emphasize full glute contraction at the top"
  },
  {
    id: "ex-16",
    name: "Standing Calf Raises",
    type: "superset",
    targetMuscleGroup: "calves",
    defaultSets: 3,
    defaultReps: "15-20",
    defaultRestPeriod: 0,
    notes: "Perform as superset with Glute Bridges"
  },
  {
    id: "ex-17",
    name: "Bodyweight Glute Bridges",
    type: "superset",
    targetMuscleGroup: "glutes",
    defaultSets: 3,
    defaultReps: "15-20",
    defaultRestPeriod: 60,
    notes: "Perform as superset with Calf Raises"
  }
];

// Workout Templates
export const workoutTemplates: Workout[] = [
  {
    id: "workout-1",
    name: "Push Day",
    description: "Chest, Shoulders, Triceps",
    exercises: pushExercises,
    category: "push"
  },
  {
    id: "workout-2",
    name: "Pull Day",
    description: "Back, Biceps",
    exercises: pullExercises,
    category: "pull"
  },
  {
    id: "workout-3",
    name: "Leg Day",
    description: "Quadriceps, Hamstrings, Glutes",
    exercises: legExercises,
    category: "legs"
  }
];

// Generate sample workout logs (3 months of data)
export const generateSampleWorkoutLogs = (): WorkoutLog[] => {
  const logs: WorkoutLog[] = [];
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 3);
  
  // For each week in the past 3 months
  for (let week = 0; week < 12; week++) {
    // Random number of workouts this week (1-3)
    const workoutsThisWeek = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < workoutsThisWeek; i++) {
      const workoutIndex = i % 3; // Cycle through push, pull, legs
      const workout = workoutTemplates[workoutIndex];
      
      const logDate = new Date(startDate);
      logDate.setDate(logDate.getDate() + (week * 7) + i + 1);
      
      const exerciseLogs = workout.exercises.map(exercise => {
        // Generate random sets for this exercise
        const sets = Array(exercise.defaultSets).fill(0).map((_, index) => {
          // Random weight that increases slightly over time (based on week)
          let baseWeight = 0;
          if (exercise.name === "Bench Press") baseWeight = 135;
          else if (exercise.name === "Deadlift") baseWeight = 185;
          else if (exercise.name === "Barbell Back Squats") baseWeight = 155;
          else if (exercise.name.includes("Dumbbell")) baseWeight = 30;
          else baseWeight = 50;
          
          // Add progressive overload: weight increases by 2.5-5% every 3-4 weeks
          const weightProgression = Math.floor(week / 4) * (baseWeight * 0.025);
          const weight = baseWeight + weightProgression;
          
          // Random reps within the default range
          const repRange = exercise.defaultReps.split('-');
          const minReps = parseInt(repRange[0]);
          const maxReps = parseInt(repRange[1] || repRange[0]);
          const reps = Math.floor(Math.random() * (maxReps - minReps + 1)) + minReps;
          
          return {
            id: uuidv4(),
            weight,
            reps,
            completed: true
          };
        });
        
        return {
          id: uuidv4(),
          exerciseId: exercise.id,
          exerciseName: exercise.name,
          sets,
          date: logDate.toISOString().split('T')[0]
        };
      });
      
      logs.push({
        id: uuidv4(),
        workoutId: workout.id,
        workoutName: workout.name,
        date: logDate.toISOString().split('T')[0],
        duration: Math.floor(Math.random() * 20) + 40, // 40-60 min
        exerciseLogs
      });
    }
  }
  
  return logs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

// Current active workout goal
export const activeWorkoutGoal: WorkoutGoal = {
  id: "goal-1",
  frequency: 3, // 3 times per week
  startDate: new Date().toISOString().split('T')[0],
  isActive: true
};

// Sample workout logs
export const sampleWorkoutLogs = generateSampleWorkoutLogs();
