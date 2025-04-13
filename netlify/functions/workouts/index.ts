import { Handler } from '@netlify/functions';
import { getDefaultWorkouts, saveDefaultWorkout, getCustomWorkouts, saveCustomWorkout, getWorkoutLogs, saveWorkoutLog, getWorkout } from '../../../src/utils/mongodbService';

const handler: Handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    const path = event.path.replace('/.netlify/functions/workouts/', '');
    const segments = path.split('/');

    // Handle different endpoints
    switch (segments[0]) {
      case 'default':
        if (event.httpMethod === 'GET') {
          const workouts = await getDefaultWorkouts();
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(workouts),
          };
        } else if (event.httpMethod === 'PUT' && segments[1]) {
          const workout = JSON.parse(event.body || '{}');
          await saveDefaultWorkout(workout);
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true }),
          };
        }
        break;

      case 'custom':
        if (event.httpMethod === 'GET') {
          const workouts = await getCustomWorkouts();
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(workouts),
          };
        } else if (event.httpMethod === 'PUT' && segments[1]) {
          const workout = JSON.parse(event.body || '{}');
          await saveCustomWorkout(workout);
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true }),
          };
        }
        break;

      case 'logs':
        if (event.httpMethod === 'GET') {
          const logs = await getWorkoutLogs();
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(logs),
          };
        } else if (event.httpMethod === 'POST') {
          const log = JSON.parse(event.body || '{}');
          await saveWorkoutLog(log);
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true }),
          };
        }
        break;

      default:
        if (event.httpMethod === 'GET' && segments[0]) {
          const workout = await getWorkout(segments[0]);
          if (!workout) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ error: 'Workout not found' }),
            };
          }
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(workout),
          };
        }
        break;
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not found' }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

export { handler }; 