import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://fit-journey-chronicle-app:Bje2ZuPYo4NCLW1S@fit-journey-chronicle-c.8yttpxn.mongodb.net/fit-journey-chronicle?retryWrites=true&w=majority';
const client = new MongoClient(uri);

const defaultWorkouts = [
  {
    id: "default-push-workout",
    name: "Push Workout",
    description: "Chest, shoulders and triceps focused workout",
    category: "push",
    exercises: [
      {
        id: "push-1",
        name: "Bench Press",
        type: "compound",
        targetMuscleGroup: "chest",
        defaultSets: 4,
        defaultReps: "8-10",
        defaultRestPeriod: 120,
        formCues: ["Retract shoulder blades", "Keep feet flat on floor"]
      },
      {
        id: "push-2",
        name: "Overhead Press",
        type: "compound",
        targetMuscleGroup: "shoulders",
        defaultSets: 4,
        defaultReps: "8-10",
        defaultRestPeriod: 120,
        formCues: ["Brace core", "Full range of motion"]
      },
      {
        id: "push-3",
        name: "Incline Dumbbell Press",
        type: "compound",
        targetMuscleGroup: "chest",
        defaultSets: 3,
        defaultReps: "10-12",
        defaultRestPeriod: 90,
        formCues: ["Control the weight", "Don't bounce at bottom"]
      },
      {
        id: "push-4",
        name: "Tricep Pushdowns",
        type: "accessory",
        targetMuscleGroup: "triceps",
        defaultSets: 3,
        defaultReps: "12-15",
        defaultRestPeriod: 60,
        formCues: ["Keep elbows tucked", "Squeeze at bottom"]
      },
      {
        id: "push-5",
        name: "Lateral Raises",
        type: "accessory",
        targetMuscleGroup: "shoulders",
        defaultSets: 3,
        defaultReps: "12-15",
        defaultRestPeriod: 60,
        formCues: ["Slight bend in elbows", "Controlled movement"]
      }
    ]
  },
  {
    id: "default-pull-workout",
    name: "Pull Workout",
    description: "Back and biceps focused workout",
    category: "pull",
    exercises: [
      {
        id: "pull-1",
        name: "Deadlift",
        type: "compound",
        targetMuscleGroup: "back",
        defaultSets: 4,
        defaultReps: "6-8",
        defaultRestPeriod: 180,
        formCues: ["Keep back straight", "Push through heels"]
      },
      {
        id: "pull-2",
        name: "Pull-ups",
        type: "compound",
        targetMuscleGroup: "back",
        defaultSets: 4,
        defaultReps: "6-10",
        defaultRestPeriod: 120,
        formCues: ["Full range of motion", "Controlled descent"]
      },
      {
        id: "pull-3",
        name: "Barbell Rows",
        type: "compound",
        targetMuscleGroup: "back",
        defaultSets: 3,
        defaultReps: "8-10",
        defaultRestPeriod: 90,
        formCues: ["Keep back parallel to floor", "Pull to lower chest"]
      },
      {
        id: "pull-4",
        name: "Bicep Curls",
        type: "accessory",
        targetMuscleGroup: "biceps",
        defaultSets: 3,
        defaultReps: "10-12",
        defaultRestPeriod: 60,
        formCues: ["Keep elbows fixed", "Full range of motion"]
      },
      {
        id: "pull-5",
        name: "Face Pulls",
        type: "accessory",
        targetMuscleGroup: "rear delts",
        defaultSets: 3,
        defaultReps: "12-15",
        defaultRestPeriod: 60,
        formCues: ["Pull to ears", "External rotation at end"]
      }
    ]
  },
  {
    id: "default-legs-workout",
    name: "Legs Workout",
    description: "Lower body focused workout",
    category: "legs",
    exercises: [
      {
        id: "legs-1",
        name: "Squats",
        type: "compound",
        targetMuscleGroup: "quads",
        defaultSets: 4,
        defaultReps: "8-10",
        defaultRestPeriod: 180,
        formCues: ["Keep chest up", "Knees in line with toes"]
      },
      {
        id: "legs-2",
        name: "Romanian Deadlifts",
        type: "compound",
        targetMuscleGroup: "hamstrings",
        defaultSets: 3,
        defaultReps: "10-12",
        defaultRestPeriod: 120,
        formCues: ["Hinge at hips", "Slight bend in knees"]
      },
      {
        id: "legs-3",
        name: "Leg Press",
        type: "compound",
        targetMuscleGroup: "quads",
        defaultSets: 3,
        defaultReps: "10-12",
        defaultRestPeriod: 120,
        formCues: ["Don't lock knees at top", "Full range of motion"]
      },
      {
        id: "legs-4",
        name: "Calf Raises",
        type: "accessory",
        targetMuscleGroup: "calves",
        defaultSets: 4,
        defaultReps: "15-20",
        defaultRestPeriod: 60,
        formCues: ["Full stretch at bottom", "Squeeze at top"]
      },
      {
        id: "legs-5",
        name: "Lunges",
        type: "compound",
        targetMuscleGroup: "quads",
        defaultSets: 3,
        defaultReps: "10-12 each leg",
        defaultRestPeriod: 90,
        formCues: ["Keep torso upright", "Step far enough forward"]
      }
    ]
  }
];

async function setupDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('fit-journey-chronicle');
    
    // Create collections
    await db.createCollection('default-workouts');
    await db.createCollection('custom-workouts');
    await db.createCollection('workout-logs');
    
    console.log('Created collections');
    
    // Insert default workouts
    const defaultWorkoutsCollection = db.collection('default-workouts');
    await defaultWorkoutsCollection.deleteMany({}); // Clear existing data
    await defaultWorkoutsCollection.insertMany(defaultWorkouts);
    
    console.log('Inserted default workouts');
    
    // Create indexes
    await defaultWorkoutsCollection.createIndex({ id: 1 }, { unique: true });
    await db.collection('custom-workouts').createIndex({ id: 1 }, { unique: true });
    await db.collection('workout-logs').createIndex({ date: 1 });
    
    console.log('Created indexes');
    
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

setupDatabase(); 