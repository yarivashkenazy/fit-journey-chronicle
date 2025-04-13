import { Handler } from '@netlify/functions';
import { getDefaultWorkouts, saveDefaultWorkout, getCustomWorkouts, saveCustomWorkout, getWorkoutLogs, saveWorkoutLog, getWorkout } from '../../../src/utils/mongodbService';

const handler: Handler = async (event, context) => {
  console.log('=== Function Invocation Start ===');
  console.log('Event:', {
    path: event.path,
    httpMethod: event.httpMethod,
    queryStringParameters: event.queryStringParameters,
    body: event.body,
    headers: event.headers,
  });

  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    // Get the path after the function name or API prefix
    const path = event.path.replace(/^(\/\.netlify\/functions\/workouts|\/api\/workouts)/, '');
    const segments = path.split('/').filter(Boolean); // Remove empty segments

    console.log('Processing request:', {
      originalPath: event.path,
      processedPath: path,
      segments,
      method: event.httpMethod,
    });

    // Handle different endpoints
    if (segments[0] === 'logs') {
      console.log('Processing workout logs endpoint');
      if (event.httpMethod === 'GET') {
        console.log('Fetching workout logs');
        const logs = await getWorkoutLogs();
        console.log('Retrieved workout logs:', logs);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: true,
            data: logs
          }),
        };
      } else if (event.httpMethod === 'POST') {
        console.log('Saving workout log');
        const workoutLog = JSON.parse(event.body || '{}');
        console.log('Workout log data:', workoutLog);
        const savedLog = await saveWorkoutLog(workoutLog);
        console.log('Saved workout log:', savedLog);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: true,
            data: savedLog
          }),
        };
      }
    } else if (segments[0] === 'save') {
      // Handle save workout log endpoint
      console.log('Processing save workout log endpoint');
      if (event.httpMethod === 'POST') {
        console.log('Saving workout log');
        const workoutLog = JSON.parse(event.body || '{}');
        console.log('Workout log data:', workoutLog);
        const savedLog = await saveWorkoutLog(workoutLog);
        console.log('Saved workout log:', savedLog);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: true,
            data: savedLog
          }),
        };
      }
    } else if (segments[0] === 'default') {
      console.log('Processing default workouts endpoint');
      if (event.httpMethod === 'GET') {
        if (segments[1]) {
          // Handle specific default workout
          console.log('Fetching specific default workout:', segments[1]);
          const workout = await getWorkout(segments[1]);
          console.log('Retrieved workout:', workout);
          
          if (!workout) {
            console.log('Workout not found');
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ 
                success: false,
                error: 'Workout not found',
                message: 'The requested workout could not be found'
              }),
            };
          }
          
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
              success: true,
              data: workout
            }),
          };
        } else {
          // Handle all default workouts
          console.log('Fetching all default workouts');
          const workouts = await getDefaultWorkouts();
          console.log('Retrieved default workouts:', workouts);
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(workouts),
          };
        }
      } else if (event.httpMethod === 'PUT') {
        console.log('Saving default workout');
        const workout = JSON.parse(event.body || '{}');
        console.log('Workout data:', workout);
        await saveDefaultWorkout(workout);
        console.log('Saved default workout');
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true }),
        };
      }
    } else if (segments[0] === 'custom') {
      console.log('Processing custom workouts endpoint');
      if (event.httpMethod === 'GET') {
        console.log('Fetching custom workouts');
        const workouts = await getCustomWorkouts();
        console.log('Retrieved custom workouts:', workouts);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(workouts),
        };
      } else if (event.httpMethod === 'PUT') {
        console.log('Saving custom workout');
        const workout = JSON.parse(event.body || '{}');
        console.log('Workout data:', workout);
        await saveCustomWorkout(workout);
        console.log('Saved custom workout');
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true }),
        };
      }
    } else if (segments.length === 1) {
      // Handle single workout by ID
      const workoutId = segments[0];
      console.log('Processing single workout request for ID:', workoutId);
      
      if (event.httpMethod === 'GET') {
        console.log('Fetching workout by ID');
        const workout = await getWorkout(workoutId);
        console.log('Retrieved workout:', workout);
        
        if (!workout) {
          console.log('Workout not found');
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ 
              success: false,
              error: 'Workout not found',
              message: 'The requested workout could not be found'
            }),
          };
        }
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: true,
            data: workout
          }),
        };
      }
    }

    console.log('No matching endpoint found');
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not found' }),
    };
  } catch (error) {
    console.error('Error processing request:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.stack : undefined : undefined
      }),
    };
  } finally {
    console.log('=== Function Invocation End ===');
  }
};

export { handler }; 