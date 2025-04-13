import { MongoClient } from 'mongodb';
import { Workout, WorkoutLog } from '@/types/workout';

const MONGODB_URI = 'mongodb+srv://fit-journey-chronicle-app:Bje2ZuPYo4NCLW1S@fit-journey-chronicle-c.8yttpxn.mongodb.net/?retryWrites=true&w=majority&appName=fit-journey-chronicle-cluster';
const DB_NAME = 'fit-journey-chronicle';

let client: MongoClient;
let db: any;

export const connectToDatabase = async () => {
  if (!client) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
  }
  return db;
};

// Default Workouts Collection
export const getDefaultWorkouts = async () => {
  const db = await connectToDatabase();
  return await db.collection('default-workouts').find({}).toArray();
};

export const saveDefaultWorkout = async (workout: Workout) => {
  const db = await connectToDatabase();
  await db.collection('default-workouts').updateOne(
    { id: workout.id },
    { $set: workout },
    { upsert: true }
  );
};

// Custom Workouts Collection
export const getCustomWorkouts = async () => {
  const db = await connectToDatabase();
  return await db.collection('custom-workouts').find({}).toArray();
};

export const saveCustomWorkout = async (workout: Workout) => {
  const db = await connectToDatabase();
  await db.collection('custom-workouts').updateOne(
    { id: workout.id },
    { $set: workout },
    { upsert: true }
  );
};

// Workout Logs Collection
export const getWorkoutLogs = async () => {
  const db = await connectToDatabase();
  return await db.collection('workout-logs').find({}).toArray();
};

export const saveWorkoutLog = async (workoutLog: WorkoutLog) => {
  const db = await connectToDatabase();
  await db.collection('workout-logs').insertOne(workoutLog);
};

// Helper function to get a workout (checks both default and custom collections)
export const getWorkout = async (workoutId: string) => {
  const db = await connectToDatabase();
  
  // First check custom workouts
  const customWorkout = await db.collection('custom-workouts').findOne({ id: workoutId });
  if (customWorkout) return customWorkout;
  
  // Then check default workouts
  return await db.collection('default-workouts').findOne({ id: workoutId });
};

// Initialize default workouts if they don't exist
export const initializeDefaultWorkouts = async () => {
  const db = await connectToDatabase();
  const defaultWorkouts = await getDefaultWorkouts();
  
  if (defaultWorkouts.length === 0) {
    // Import default workouts from the existing storageService
    const { DEFAULT_WORKOUTS } = await import('./storageService');
    await db.collection('default-workouts').insertMany(DEFAULT_WORKOUTS);
  }
}; 