
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Timer, RotateCcw, Dumbbell, Activity, Footprints, Weight, ActivitySquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkoutForm } from "@/hooks/useWorkoutForm";
import ExerciseCard from "./workout/ExerciseCard";
import AddExerciseDialog from "./workout/AddExerciseDialog";
import WorkoutNotes from "./workout/WorkoutNotes";
import { toast } from "sonner";

const WorkoutForm = () => {
  const navigate = useNavigate();
  const { workoutId } = useParams();
  const {
    workout,
    exerciseLogs,
    notes,
    elapsedTime,
    activeRestTimers,
    handleSetChange,
    handleRestTimerComplete,
    addSet,
    completeWorkout,
    removeExercise,
    addNewExercise,
    getExerciseById,
    setNotes,
    restoreDefaultExercises,
    reorderExercises
  } = useWorkoutForm(workoutId);
  
  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);
  const [draggedExerciseIndex, setDraggedExerciseIndex] = useState<number | null>(null);
  
  // Get the appropriate icon based on the workout category
  const getWorkoutIcon = (category?: string) => {
    switch (category) {
      case 'push':
        return <Dumbbell className="h-6 w-6 text-fitness-primary mr-2" />;
      case 'pull':
        return <Weight className="h-6 w-6 text-fitness-primary mr-2" />;
      case 'legs':
        return <Footprints className="h-6 w-6 text-fitness-primary mr-2" />;
      case 'full':
        return <ActivitySquare className="h-6 w-6 text-fitness-primary mr-2" />;
      case 'cardio':
        return <Activity className="h-6 w-6 text-fitness-primary mr-2" />;
      default:
        return <Dumbbell className="h-6 w-6 text-fitness-primary mr-2" />;
    }
  };
  
  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setIsDragging(true);
    setDraggedExerciseIndex(index);
    // Required for Firefox
    e.dataTransfer.setData('text/plain', index.toString());
    // Make the drag image more transparent
    if (e.dataTransfer.setDragImage && e.currentTarget) {
      const crt = e.currentTarget.cloneNode(true) as HTMLElement;
      crt.style.opacity = '0.5';
      crt.style.position = 'absolute';
      crt.style.top = '-1000px';
      document.body.appendChild(crt);
      e.dataTransfer.setDragImage(crt, 0, 0);
      setTimeout(() => document.body.removeChild(crt), 0);
    }
  };
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (draggedExerciseIndex !== null && draggedExerciseIndex !== index) {
      // Reorder exercises
      const reorderedExercises = [...exerciseLogs];
      const draggedExercise = reorderedExercises[draggedExerciseIndex];
      reorderedExercises.splice(draggedExerciseIndex, 1);
      reorderedExercises.splice(index, 0, draggedExercise);
      
      // Update workout exercises order
      if (workout) {
        const reorderedWorkoutExercises = [...workout.exercises];
        const draggedWorkoutExercise = reorderedWorkoutExercises[draggedExerciseIndex];
        reorderedWorkoutExercises.splice(draggedExerciseIndex, 1);
        reorderedWorkoutExercises.splice(index, 0, draggedWorkoutExercise);
        
        const updatedWorkout = {
          ...workout,
          exercises: reorderedWorkoutExercises
        };
        
        // Update the workout and logs using the hook function
        reorderExercises(updatedWorkout, reorderedExercises);
        
        // Update dragged index to new position
        setDraggedExerciseIndex(index);
      }
    }
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedExerciseIndex(null);
  };
  
  if (!workout) {
    return <div>Loading workout...</div>;
  }
  
  return (
    <div className="container py-6 space-y-6 overflow-x-hidden max-w-full">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/")} className="px-0 hover:bg-transparent">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex items-center space-x-2">
          <Timer className="h-5 w-5 text-fitness-primary" />
          <span className="text-lg font-semibold">{elapsedTime}</span>
        </div>
      </div>
      
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold flex items-center justify-center">
          {getWorkoutIcon(workout.category)}
          {workout.name}
        </h1>
        <p className="text-muted-foreground">{workout.description}</p>
      </div>
      
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={restoreDefaultExercises}
          className="flex items-center gap-1"
        >
          <RotateCcw className="h-4 w-4" />
          Restore Default Exercises
        </Button>
      </div>
      
      {exerciseLogs.map((exerciseLog, exerciseIndex) => {
        const exercise = getExerciseById(exerciseLog.exerciseId);
        
        return (
          <ExerciseCard
            key={exerciseLog.id}
            exerciseLog={exerciseLog}
            exercise={exercise}
            exerciseIndex={exerciseIndex}
            onSetChange={handleSetChange}
            onAddSet={addSet}
            onRemoveExercise={removeExercise}
            activeRestTimers={activeRestTimers}
            onRestTimerComplete={handleRestTimerComplete}
            onDragStart={handleDragStart}
            onDragEnter={handleDragEnter}
            onDragEnd={handleDragEnd}
            isDragging={isDragging}
            draggedIndex={draggedExerciseIndex}
          />
        );
      })}
      
      <AddExerciseDialog onAddExercise={addNewExercise} />
      
      <WorkoutNotes 
        notes={notes}
        onChange={setNotes}
      />
      
      <Button 
        className="w-full bg-fitness-primary hover:bg-fitness-primary/90 text-white" 
        size="lg"
        onClick={() => completeWorkout(() => navigate("/history"))}
      >
        Complete Workout
      </Button>
    </div>
  );
};

export default WorkoutForm;
