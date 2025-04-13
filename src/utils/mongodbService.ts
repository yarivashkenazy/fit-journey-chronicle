import { MongoClient, Db, Collection } from 'mongodb';
import { Workout, WorkoutLog } from '@/types/workout';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db();
}

export async function getCollection<T>(collectionName: string): Promise<Collection<T>> {
  const db = await getDatabase();
  return db.collection<T>(collectionName);
}

// Default Workouts
export const getDefaultWorkouts = async (): Promise<Workout[]> => {
  const collection = await getCollection<Workout>('defaultWorkouts');
  return collection.find({}).toArray();
};

export const saveDefaultWorkout = async (workout: Workout): Promise<void> => {
  const collection = await getCollection<Workout>('defaultWorkouts');
  await collection.updateOne(
    { id: workout.id },
    { $set: workout },
    { upsert: true }
  );
};

// Custom Workouts
export const getCustomWorkouts = async (): Promise<Workout[]> => {
  const collection = await getCollection<Workout>('customWorkouts');
  return collection.find({}).toArray();
};

export const saveCustomWorkout = async (workout: Workout): Promise<void> => {
  const collection = await getCollection<Workout>('customWorkouts');
  await collection.updateOne(
    { id: workout.id },
    { $set: workout },
    { upsert: true }
  );
};

// Workout Logs
export const getWorkoutLogs = async (): Promise<WorkoutLog[]> => {
  const collection = await getCollection<WorkoutLog>('workoutLogs');
  return collection.find({}).toArray();
};

export const saveWorkoutLog = async (workoutLog: WorkoutLog): Promise<void> => {
  const collection = await getCollection<WorkoutLog>('workoutLogs');
  await collection.insertOne(workoutLog);
};

// Get a specific workout (checks both default and custom)
export const getWorkout = async (workoutId: string): Promise<Workout | null> => {
  // First check custom workouts
  const customCollection = await getCollection<Workout>('customWorkouts');
  const customWorkout = await customCollection.findOne({ id: workoutId });
  if (customWorkout) return customWorkout;

  // Then check default workouts
  const defaultCollection = await getCollection<Workout>('defaultWorkouts');
  return defaultCollection.findOne({ id: workoutId });
}; 