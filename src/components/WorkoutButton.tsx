
import React from 'react';
import { Button } from "@/components/ui/button";
import { Workout } from "@/types/workout";

interface WorkoutButtonProps {
  workout: Workout;
  onClick: () => void;
}

const WorkoutButton: React.FC<WorkoutButtonProps> = ({ workout, onClick }) => {
  // Get the appropriate emoji based on the workout category
  const getWorkoutEmoji = (category: string) => {
    switch (category) {
      case 'push':
        return '💪'; // Flexed biceps for push workouts
      case 'pull':
        return '🏋️'; // Person lifting weights for pull workouts
      case 'legs':
        return '🦵'; // Leg emoji for leg workouts
      case 'full':
        return '👤'; // Person bust for full body workouts
      case 'cardio':
        return '🏃'; // Running person for cardio
      default:
        return '⚡'; // Default lightning bolt
    }
  };

  return (
    <Button
      className="h-auto py-6 border border-input bg-background hover:bg-accent flex flex-col items-center justify-center gap-2"
      variant="outline"
      onClick={onClick}
    >
      <span className="text-2xl mb-1">{getWorkoutEmoji(workout.category)}</span>
      <span className="font-semibold">{workout.name}</span>
      <span className="text-xs text-muted-foreground">{workout.description}</span>
    </Button>
  );
};

export default WorkoutButton;
