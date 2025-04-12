
import React from 'react';
import { Button } from "@/components/ui/button";
import { Workout } from "@/types/workout";
import { Dumbbell, Weight, ActivitySquare, Footprints, Activity } from "lucide-react";

interface WorkoutButtonProps {
  workout: Workout;
  onClick: () => void;
}

const WorkoutButton: React.FC<WorkoutButtonProps> = ({ workout, onClick }) => {
  // Get the appropriate icon based on the workout category
  const getWorkoutIcon = (category: string) => {
    switch (category) {
      case 'push':
        return <Dumbbell className="h-6 w-6 mb-2" />;
      case 'pull':
        return <Weight className="h-6 w-6 mb-2" />;
      case 'legs':
        return <Footprints className="h-6 w-6 mb-2" />;
      case 'full':
        return <ActivitySquare className="h-6 w-6 mb-2" />;
      case 'cardio':
        return <Activity className="h-6 w-6 mb-2" />;
      default:
        return <Dumbbell className="h-6 w-6 mb-2" />;
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
