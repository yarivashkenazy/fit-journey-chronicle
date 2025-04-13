const { MongoClient, ObjectId } = require('mongodb');
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
    
    // Handle workout data request
    if (endpoint === 'default-push-workout') {
      const collection = database.collection("default-workouts");
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
          body: JSON.stringify({ 
            success: true,
            data: workout
          })
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
          body: JSON.stringify({ 
            success: true,
            data: workoutAlt
          })
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
        body: JSON.stringify({ 
          success: false,
          error: "Workout not found",
          message: "The requested workout could not be found in the database"
        })
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
        body: JSON.stringify({ 
          success: true,
          data: { logs }
        })
      };
    }
    
    // Handle save workout log
    else if (event.httpMethod === 'POST' && endpoint === 'save') {
      const logsCollection = database.collection("workout-logs");
      
      // Parse the request body with error handling
      let workoutLog;
      try {
        workoutLog = JSON.parse(event.body);
      } catch (error) {
        console.error("Error parsing request body:", error);
        return {
          statusCode: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          },
          body: JSON.stringify({ 
            success: false,
            error: "Invalid request body",
            message: "The request body could not be parsed as JSON"
          })
        };
      }
      
      // Remove _id if present (MongoDB will generate a new one)
      delete workoutLog._id;
      
      // Ensure we have a valid date
      if (!workoutLog.date) {
        workoutLog.date = new Date().toISOString();
      }
      
      // Add createdAt timestamp if not present
      if (!workoutLog.createdAt) {
        workoutLog.createdAt = new Date().toISOString();
      }
      
      console.log("Saving workout log:", workoutLog);
      
      try {
        const result = await logsCollection.insertOne(workoutLog);
        console.log("Save result:", result);
        
        // Get the saved document with the generated _id
        const savedLog = await logsCollection.findOne({ _id: result.insertedId });
        
        return {
          statusCode: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          },
          body: JSON.stringify({ 
            success: true,
            data: savedLog
          })
        };
      } catch (error) {
        console.error("Error saving workout log:", error);
        return {
          statusCode: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          },
          body: JSON.stringify({ 
            success: false,
            error: "Database error",
            message: "Failed to save workout log to the database"
          })
        };
      }
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
        body: JSON.stringify({ 
          success: false,
          error: "Not found",
          message: "The requested endpoint does not exist"
        })
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
        success: false,
        error: "Server error",
        message: "An unexpected error occurred on the server"
      })
    };
  } finally {
    await client.close();
  }
}; 