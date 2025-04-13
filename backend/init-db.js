const mongoose = require('mongoose');
const Workout = require('./models/Workout');

// Sample workout data
const sampleWorkouts = [
  {
    date: new Date('2024-04-10'),
    exercises: [
      {
        name: 'Bench Press',
        sets: [
          { weight: 135, reps: 10, completed: true },
          { weight: 155, reps: 8, completed: true },
          { weight: 175, reps: 6, completed: true }
        ]
      },
      {
        name: 'Squats',
        sets: [
          { weight: 185, reps: 10, completed: true },
          { weight: 205, reps: 8, completed: true },
          { weight: 225, reps: 6, completed: true }
        ]
      }
    ]
  },
  {
    date: new Date('2024-04-12'),
    exercises: [
      {
        name: 'Deadlift',
        sets: [
          { weight: 225, reps: 8, completed: true },
          { weight: 245, reps: 6, completed: true },
          { weight: 265, reps: 4, completed: true }
        ]
      },
      {
        name: 'Overhead Press',
        sets: [
          { weight: 95, reps: 8, completed: true },
          { weight: 105, reps: 6, completed: true },
          { weight: 115, reps: 4, completed: true }
        ]
      }
    ]
  }
];

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fit-journey')
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Clear existing data
    return Workout.deleteMany({});
  })
  .then(() => {
    console.log('Cleared existing workouts');
    
    // Insert sample workouts
    return Workout.insertMany(sampleWorkouts);
  })
  .then(() => {
    console.log('Sample workouts inserted successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  }); 