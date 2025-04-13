const { MongoClient } = require('mongodb');
require('dotenv').config();

async function checkDocument() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    
    const database = client.db("fit-journey-chronicle");
    const collection = database.collection("default-workouts");
    
    // Check for document with ID field
    const workout = await collection.findOne({ id: "default-push-workout" });
    console.log("Workout with id 'default-push-workout':", workout ? "Found" : "Not found");
    
    if (!workout) {
      // If not found, list all documents in collection
      const docs = await collection.find({}).toArray();
      console.log("All documents in collection:", docs);
      
      // If documents exist but with wrong ID, fix them
      if (docs.length > 0) {
        console.log("Fixing document ID...");
        await collection.updateOne(
          { _id: docs[0]._id },
          { $set: { id: "default-push-workout" } }
        );
        console.log("Document updated with correct ID");
      } else {
        // Insert the workout if collection is empty
        const defaultWorkout = {
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
        };
        
        await collection.insertOne(defaultWorkout);
        console.log("Default workout inserted");
      }
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

checkDocument(); 