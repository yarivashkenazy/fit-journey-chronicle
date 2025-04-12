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
          // Setup base weight with more variation for main lifts
          let baseWeight = 0;
          let weeklyVariation = 0;
          
          if (exercise.name === "Bench Press") {
            baseWeight = 135;
            // Add some ups and downs to make the graph more interesting
            if (week < 4) {
              // First month: slight increase
              weeklyVariation = week * 2.5;
            } else if (week < 8) {
              // Second month: plateau with small variations
              weeklyVariation = 10 + (Math.sin(week) * 5);
            } else {
              // Third month: breakthrough and progress
              weeklyVariation = 12.5 + ((week - 8) * 5);
            }
          } 
          else if (exercise.name === "Deadlift") {
            baseWeight = 185;
            // Create a different pattern for deadlift
            if (week < 3) {
              // First weeks: consistency
              weeklyVariation = 0;
            } else if (week < 6) {
              // Next weeks: rapid progress
              weeklyVariation = (week - 2) * 10;
            } else if (week < 9) {
              // Next weeks: slight decrease (fatigue/deload)
              weeklyVariation = 40 - ((week - 6) * 5);
            } else {
              // Final weeks: back to progress
              weeklyVariation = 25 + ((week - 9) * 7.5);
            }
          }
          else if (exercise.name === "Barbell Back Squats") {
            baseWeight = 155;
            // Create a different pattern for squats
            // Wave loading pattern
            weeklyVariation = (Math.sin(week * 0.8) * 20) + (week * 2);
          }
          else if (exercise.name === "Overhead Press") {
            baseWeight = 95;
            // Slower linear progression with small variations
            weeklyVariation = (week * 1.25) + (Math.random() * 5 - 2.5);
          }
          else if (exercise.name.includes("Dumbbell")) {
            baseWeight = 30;
            weeklyVariation = week * 0.5;
          } 
          else {
            baseWeight = 50;
            weeklyVariation = week * 1;
          }
          
          // Add small random variations to weights
          const randomVariation = Math.floor(Math.random() * 5) - 2;
          const weight = Math.max(5, Math.round((baseWeight + weeklyVariation + randomVariation) / 5) * 5);
          
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
  
  // Add some extra workouts outside the regular pattern
  // This creates more data points for compound exercises to make the chart more interesting
  const addExtraWorkoutsForExercise = (exerciseName: string, workoutName: string, baseWeight: number, count: number) => {
    const exercise = [
      ...pushExercises,
      ...pullExercises, 
      ...legExercises
    ].find(ex => ex.name === exerciseName);
    
    if (!exercise) return;
    
    // Add random workouts over the past 3 months focusing just on this exercise
    for (let i = 0; i < count; i++) {
      const daysAgo = Math.floor(Math.random() * 80) + 10; // Between 10 and 90 days ago
      const logDate = new Date();
      logDate.setDate(logDate.getDate() - daysAgo);
      
      // Determine weight based on how long ago (more recent = higher weight generally)
      // But add variations to make it realistic
      const progressFactor = (90 - daysAgo) / 90; // 0 to 1 based on how recent
      const randomVariation = (Math.random() * 20) - 10; // -10 to +10 lbs random variation
      const weight = Math.max(baseWeight, Math.round((baseWeight + (progressFactor * 30) + randomVariation) / 5) * 5);
      
      const exerciseLog = {
        id: uuidv4(),
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        sets: Array(exercise.defaultSets).fill(0).map(() => ({
          id: uuidv4(),
          weight,
          reps: Math.floor(Math.random() * 5) + 6, // 6-10 reps
          completed: true
        })),
        date: logDate.toISOString().split('T')[0]
      };
      
      logs.push({
        id: uuidv4(),
        workoutId: `extra-${i}`,
        workoutName: workoutName,
        date: logDate.toISOString().split('T')[0],
        duration: Math.floor(Math.random() * 15) + 30, // 30-45 min
        exerciseLogs: [exerciseLog]
      });
    }
  };
  
  // Add extra workouts for the main compound exercises
  addExtraWorkoutsForExercise("Bench Press", "Push Day", 135, 8);
  addExtraWorkoutsForExercise("Deadlift", "Pull Day", 185, 5);
  addExtraWorkoutsForExercise("Barbell Back Squats", "Leg Day", 155, 6);
  addExtraWorkoutsForExercise("Overhead Press", "Push Day", 95, 7);
  
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
