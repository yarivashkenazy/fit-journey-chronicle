import { MongoClient, Collection, Db, WithId, Document } from 'mongodb';
import { ObjectId } from 'mongodb';

// Type definitions
export interface Exercise {
  id: string;
  name: string;
  type: 'compound' | 'accessory';
  targetMuscleGroup: string;
  defaultSets: number;
  defaultReps: string;
  defaultRestPeriod: number;
  formCues: string[];
}

export interface Workout {
  _id?: ObjectId;
  id: string;
  name: string;
  description: string;
  category: string;
  exercises: Exercise[];
}

export interface WorkoutLog {
  _id?: ObjectId;
  date: string;
  workoutId: string;
  workoutName: string;
  exercises: {
    name: string;
    sets: {
      reps: number;
      weight: number;
      completed: boolean;
    }[];
  }[];
  duration: number;
  caloriesBurned: number;
  notes?: string;
  weight: number;
  createdAt: string;
}

let client: MongoClient | null = null;
let db: Db | null = null;

const getClient = async (): Promise<MongoClient> => {
  if (!client) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to MongoDB');
  }
  return client;
};

const getDatabase = async (): Promise<Db> => {
  if (!db) {
    const client = await getClient();
    db = client.db('fit-journey-chronicle');
    console.log('Using database: fit-journey-chronicle');
  }
  return db;
};

const getCollection = async <T extends Document>(collectionName: string): Promise<Collection<T>> => {
  const db = await getDatabase();
  console.log(`Getting collection: ${collectionName}`);
  return db.collection<T>(collectionName);
};

// Get a specific workout (checks both default and custom)
export const getWorkout = async (id: string): Promise<Workout | null> => {
  console.log('Searching for workout with ID:', id);
  const db = await getDatabase();
  
  // First check in default-workouts
  console.log('Checking default-workouts collection');
  const defaultWorkout = await db.collection<Workout>('default-workouts').findOne({ id });
  if (defaultWorkout) {
    console.log('Found workout in default-workouts');
    return defaultWorkout;
  }
  
  // Then check in custom-workouts
  console.log('Checking custom-workouts collection');
  const customWorkout = await db.collection<Workout>('custom-workouts').findOne({ id });
  if (customWorkout) {
    console.log('Found workout in custom-workouts');
    return customWorkout;
  }
  
  console.log('Workout not found in any collection');
  return null;
};

// Default Workouts
export const getDefaultWorkouts = async (): Promise<Workout[]> => {
  try {
    const collection = await getCollection<Workout>('default-workouts');
    return collection.find({}).toArray();
  } catch (error) {
    console.error('Error getting default workouts:', error);
    throw error;
  }
};

export const saveDefaultWorkout = async (workout: Workout): Promise<void> => {
  try {
    const collection = await getCollection<Workout>('default-workouts');
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
    const collection = await getCollection<Workout>('custom-workouts');
    return collection.find({}).toArray();
  } catch (error) {
    console.error('Error getting custom workouts:', error);
    throw error;
  }
};

export const saveCustomWorkout = async (workout: Workout): Promise<void> => {
  try {
    const collection = await getCollection<Workout>('custom-workouts');
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
    const collection = await getCollection<WorkoutLog>('workout-logs');
    return collection.find({}).toArray();
  } catch (error) {
    console.error('Error getting workout logs:', error);
    throw error;
  }
};

export const saveWorkoutLog = async (workoutLog: WorkoutLog): Promise<WorkoutLog> => {
  try {
    console.log('Saving workout log to MongoDB:', workoutLog);
    const collection = await getCollection<WorkoutLog>('workout-logs');
    
    // Remove _id if present to let MongoDB generate a new one
    const { _id, ...logWithoutId } = workoutLog;
    
    // Insert the document and get the result
    const result = await collection.insertOne(logWithoutId);
    console.log('Insert result:', result);
    
    // Fetch the complete document with the generated _id
    const savedLog = await collection.findOne({ _id: result.insertedId });
    console.log('Saved workout log:', savedLog);
    
    if (!savedLog) {
      throw new Error('Failed to retrieve saved workout log');
    }
    
    return savedLog;
  } catch (error) {
    console.error('Error saving workout log:', error);
    throw error;
  }
}; 