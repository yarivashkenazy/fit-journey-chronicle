import { MongoClient, Collection, Db, WithId, Document } from 'mongodb';
import { ObjectId } from 'mongodb';
import { Workout, WorkoutLog } from '@/types/workout';

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
    db = client.db('default-workouts');
    console.log('Using database: default-workouts');
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
  
  // Use the correct collection name
  console.log('Checking collection: fit-journey-chronicle');
  const workout = await db.collection<Workout>('fit-journey-chronicle').findOne({ id });
  console.log('Query result:', workout);
  
  if (!workout) {
    console.log('Workout not found');
    return null;
  }
  
  console.log('Found workout:', workout);
  return workout;
};

// Default Workouts
export const getDefaultWorkouts = async (): Promise<Workout[]> => {
  try {
    const collection = await getCollection<Workout>('fit-journey-chronicle');
    return collection.find({ id: { $regex: '^default-' } }).toArray();
  } catch (error) {
    console.error('Error getting default workouts:', error);
    throw error;
  }
};

export const saveDefaultWorkout = async (workout: Workout): Promise<void> => {
  try {
    const collection = await getCollection<Workout>('fit-journey-chronicle');
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
    const collection = await getCollection<Workout>('fit-journey-chronicle');
    return collection.find({ id: { $not: { $regex: '^default-' } } }).toArray();
  } catch (error) {
    console.error('Error getting custom workouts:', error);
    throw error;
  }
};

export const saveCustomWorkout = async (workout: Workout): Promise<void> => {
  try {
    const collection = await getCollection<Workout>('fit-journey-chronicle');
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
    await collection.updateOne(
      { id: workoutLog.id },
      { $set: workoutLog },
      { upsert: true }
    );
  } catch (error) {
    console.error('Error saving workout log:', error);
    throw error;
  }
}; 