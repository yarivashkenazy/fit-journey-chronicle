const mongoose = require('mongoose');

const SetSchema = new mongoose.Schema({
  weight: { type: Number, default: null },
  reps: { type: Number, default: null },
  completed: { type: Boolean, default: false },
  timerActive: { type: Boolean, default: false }
});

const ExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: [SetSchema]
});

const WorkoutSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  exercises: [ExerciseSchema]
});

module.exports = mongoose.model('Workout', WorkoutSchema); 