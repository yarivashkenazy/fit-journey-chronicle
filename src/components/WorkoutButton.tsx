import React from 'react';
import { Button } from "@/components/ui/button";
import { Workout } from "@/types/workout";

interface WorkoutButtonProps {
  workout: Workout;
  onClick: () => void;
}

const WorkoutButton: React.FC<WorkoutButtonProps> = ({ workout, onClick }) => {
  // Get the appropriate icon based on the workout category
  const getWorkoutIcon = (category: string) => {
    switch (category) {
      case 'push':
        return <span className="text-2xl mb-2">🏋️</span>;
      case 'pull':
        return <span className="text-2xl mb-2">🪢</span>;
      case 'legs':
        return <span className="text-2xl mb-2">🦵</span>;
      case 'full':
        return <span className="text-2xl mb-2">🏃</span>;
      case 'cardio':
        return <span className="text-2xl mb-2">🚴</span>;
      default:
        return <span className="text-2xl mb-2">🏋️</span>;
    }
  };

  return (
    <Button
      className="h-auto py-6 border border-input bg-background hover:bg-accent flex flex-col items-center justify-center gap-2"
      variant="outline"
      onClick={onClick}
    >
      {getWorkoutIcon(workout.category)}
      <span className="font-semibold">{workout.name}</span>
      <span className="text-xs text-muted-foreground">{workout.description}</span>
    </Button>
  );
};

export default WorkoutButton;
