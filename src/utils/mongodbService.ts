import { MongoClient, Db, Collection } from 'mongodb';
import { Workout, WorkoutLog } from '@/types/workout';

// Get MongoDB URI from environment variables
const uri = process.env.MONGODB_URI || process.env.VITE_MONGODB_URI;

if (!uri) {
  throw new Error('MongoDB URI is not defined. Please add it to your environment variables.');
}

const options = {
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};

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
  try {
    const client = await clientPromise;
    return client.db();
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
}

export async function getCollection<T>(collectionName: string): Promise<Collection<T>> {
  try {
    const db = await getDatabase();
    return db.collection<T>(collectionName);
  } catch (error) {
    console.error(`Error getting collection ${collectionName}:`, error);
    throw error;
  }
}

// Default Workouts
export const getDefaultWorkouts = async (): Promise<Workout[]> => {
  try {
    const collection = await getCollection<Workout>('defaultWorkouts');
    return collection.find({}).toArray();
  } catch (error) {
    console.error('Error getting default workouts:', error);
    throw error;
  }
};

export const saveDefaultWorkout = async (workout: Workout): Promise<void> => {
  try {
    const collection = await getCollection<Workout>('defaultWorkouts');
    await collection.updateOne(
      { id: workout.id },
      { $set: workout },
      { upsert: true }
    );
  } catch (error) {
    console.error('Error saving default workout:', error);
    throw error;
  }
};

// Custom Workouts
export const getCustomWorkouts = async (): Promise<Workout[]> => {
  try {
    const collection = await getCollection<Workout>('customWorkouts');
    return collection.find({}).toArray();
  } catch (error) {
    console.error('Error getting custom workouts:', error);
    throw error;
  }
};

export const saveCustomWorkout = async (workout: Workout): Promise<void> => {
  try {
    const collection = await getCollection<Workout>('customWorkouts');
    await collection.updateOne(
      { id: workout.id },
      { $set: workout },
      { upsert: true }
    );
  } catch (error) {
    console.error('Error saving custom workout:', error);
    throw error;
  }
};

// Workout Logs
export const getWorkoutLogs = async (): Promise<WorkoutLog[]> => {
  try {
    const collection = await getCollection<WorkoutLog>('workoutLogs');
    return collection.find({}).toArray();
  } catch (error) {
    console.error('Error getting workout logs:', error);
    throw error;
  }
};

export const saveWorkoutLog = async (workoutLog: WorkoutLog): Promise<void> => {
  try {
    const collection = await getCollection<WorkoutLog>('workoutLogs');
    await collection.insertOne(workoutLog);
  } catch (error) {
    console.error('Error saving workout log:', error);
    throw error;
  }
};

// Get a specific workout (checks both default and custom)
export const getWorkout = async (id: string): Promise<Workout | null> => {
  console.log('Searching for workout with ID:', id);
  const db = await getDatabase();
  
  // First check custom workouts
  console.log('Checking custom workouts collection');
  const customWorkout = await db.collection<Workout>('customWorkouts').findOne({ id });
  console.log('Custom workout result:', customWorkout);
  
  if (customWorkout) {
    console.log('Found workout in custom workouts');
    return customWorkout;
  }
  
  // Then check default workouts
  console.log('Checking default workouts collection');
  const defaultWorkout = await db.collection<Workout>('defaultWorkouts').findOne({ id });
  console.log('Default workout result:', defaultWorkout);
  
  if (defaultWorkout) {
    console.log('Found workout in default workouts');
    return defaultWorkout;
  }
  
  console.log('Workout not found in either collection');
  return null;
}; 