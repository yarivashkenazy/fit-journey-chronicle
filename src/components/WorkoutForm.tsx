
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useWorkoutForm } from "@/hooks/useWorkoutForm";
import ExerciseCard from "./workout/ExerciseCard";
import AddExerciseDialog from "./workout/AddExerciseDialog";
import WorkoutNotes from "./workout/WorkoutNotes";

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
    setNotes
  } = useWorkoutForm(workoutId);
  
  if (!workout) {
    return <div>Loading workout...</div>;
  }
  
  return (
    <div className="container py-6 space-y-6">
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
        <h1 className="text-2xl font-bold">{workout.name}</h1>
        <p className="text-muted-foreground">{workout.description}</p>
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
