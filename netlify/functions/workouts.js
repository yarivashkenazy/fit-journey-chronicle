const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;

exports.handler = async function(event, context) {
  // Log full request for debugging
  console.log("Function invoked with path:", event.path);
  
  // Extract the endpoint (last part of path)
  const pathSegments = event.path.split('/');
  const endpoint = pathSegments[pathSegments.length - 1];
  
  console.log("Handling endpoint:", endpoint);
  
  // Connect to MongoDB
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log("MongoDB connected successfully");
    
    const database = client.db("fit-journey-chronicle");
    const collection = database.collection("default-workouts");
    
    // Handle workout data request
    if (endpoint === 'default-push-workout') {
      console.log("Looking for push workout");
      
      // First try finding by ID field
      const workout = await collection.findOne({ id: endpoint });
      console.log("Query result:", workout ? "Found" : "Not found");
      
      if (workout) {
        return {
          statusCode: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          },
          body: JSON.stringify(workout)
        };
      }
      
      // If not found by id, check if it's stored under a different field
      const workoutAlt = await collection.findOne({ id: "default-push-workout" });
      if (workoutAlt) {
        console.log("Found workout with exact id match");
        return {
          statusCode: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          },
          body: JSON.stringify(workoutAlt)
        };
      }
      
      // Last resort - try finding any workout
      console.log("Checking for any workout in collection");
      const anyWorkout = await collection.findOne({});
      console.log("Any workout found:", anyWorkout ? "Yes" : "No");
      
      // Not found response
      return {
        statusCode: 404,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ error: "Workout not found" })
      };
    }
    
    // Handle logs request
    else if (endpoint === 'logs') {
      const logsCollection = database.collection("workout-logs");
      const logs = await logsCollection.find({}).toArray();
      
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ logs })
      };
    }
    
    // Handle unknown endpoint
    else {
      console.log("Unknown endpoint requested:", endpoint);
      return {
        statusCode: 404,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ error: "Unknown endpoint" })
      };
    }
  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ 
        error: "Server error", 
        message: error.message,
        stack: error.stack
      })
    };
  } finally {
    await client.close();
  }
}; 