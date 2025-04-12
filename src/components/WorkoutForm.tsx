
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Timer, ArrowLeft, Plus, ChevronDown, ChevronUp, Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { Exercise, ExerciseLog, Set, Workout, WorkoutLog } from "@/types/workout";
import { getWorkout, saveWorkoutLog } from "@/utils/storageService";
import { toast } from "sonner";

const WorkoutForm = () => {
  const navigate = useNavigate();
  const { workoutId } = useParams();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>([]);
  const [notes, setNotes] = useState<string>("");
  const [elapsedTime, setElapsedTime] = useState<string>("00:00");
  
  // Load the workout template
  useEffect(() => {
    if (workoutId) {
      const workoutTemplate = getWorkout(workoutId);
      if (workoutTemplate) {
        setWorkout(workoutTemplate);
        
        // Initialize exercise logs
        const initialLogs = workoutTemplate.exercises.map(exercise => {
          // Create sets based on default count
          const sets: Set[] = Array(exercise.defaultSets).fill(0).map(() => ({
            id: uuidv4(),
            weight: 0,
            reps: 0,
            completed: false
          }));
          
          return {
            id: uuidv4(),
            exerciseId: exercise.id,
            exerciseName: exercise.name,
            sets,
            date: new Date().toISOString().split('T')[0]
          };
        });
        
        setExerciseLogs(initialLogs);
      }
    }
  }, [workoutId]);
  
  // Update the timer every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - startTime.getTime();
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setElapsedTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [startTime]);
  
  const handleSetChange = (exerciseIndex: number, setIndex: number, field: keyof Set, value: any) => {
    const updatedLogs = [...exerciseLogs];
    const updatedSets = [...updatedLogs[exerciseIndex].sets];
    
    updatedSets[setIndex] = {
      ...updatedSets[setIndex],
      [field]: field === 'completed' ? value : Number(value)
    };
    
    updatedLogs[exerciseIndex] = {
      ...updatedLogs[exerciseIndex],
      sets: updatedSets
    };
    
    setExerciseLogs(updatedLogs);
  };
  
  const addSet = (exerciseIndex: number) => {
    const updatedLogs = [...exerciseLogs];
    const updatedSets = [...updatedLogs[exerciseIndex].sets];
    
    // Copy values from the last set for convenience
    const lastSet = updatedSets[updatedSets.length - 1];
    
    updatedSets.push({
      id: uuidv4(),
      weight: lastSet?.weight || 0,
      reps: lastSet?.reps || 0,
      completed: false
    });
    
    updatedLogs[exerciseIndex] = {
      ...updatedLogs[exerciseIndex],
      sets: updatedSets
    };
    
    setExerciseLogs(updatedLogs);
  };
  
  const completeWorkout = () => {
    if (!workout) return;
    
    const now = new Date();
    const duration = Math.floor((now.getTime() - startTime.getTime()) / 60000);
    
    // Filter out empty sets
    const filteredLogs = exerciseLogs.map(log => ({
      ...log,
      sets: log.sets.filter(set => set.weight > 0 && set.reps > 0)
    }));
    
    const workoutLog: WorkoutLog = {
      id: uuidv4(),
      workoutId: workout.id,
      workoutName: workout.name,
      date: new Date().toISOString().split('T')[0],
      duration,
      exerciseLogs: filteredLogs,
      notes
    };
    
    saveWorkoutLog(workoutLog);
    toast.success("Workout completed and saved!");
    navigate("/history");
  };
  
  if (!workout) {
    return <div>Loading workout...</div>;
  }
  
  const getExerciseByid = (id: string): Exercise | undefined => {
    return workout.exercises.find(e => e.id === id);
  };
  
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
        const exercise = getExerciseByid(exerciseLog.exerciseId);
        
        return (
          <Card key={exerciseLog.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  {exerciseLog.exerciseName}
                  {exercise?.formCues && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="ml-2 h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-md">
                          <div className="space-y-2">
                            <p className="font-semibold">Form Cues:</p>
                            <ul className="list-disc pl-4 space-y-1">
                              {exercise.formCues.map((cue, i) => (
                                <li key={i} className="text-sm">{cue}</li>
                              ))}
                            </ul>
                            {exercise.notes && (
                              <p className="text-sm mt-2">{exercise.notes}</p>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  Rest: {exercise?.defaultRestPeriod || 60}s
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground">
                  <div className="col-span-1">#</div>
                  <div className="col-span-4">Weight</div>
                  <div className="col-span-4">Reps</div>
                  <div className="col-span-3"></div>
                </div>
                
                {exerciseLog.sets.map((set, setIndex) => (
                  <div key={set.id} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-1 text-sm font-medium">{setIndex + 1}</div>
                    <div className="col-span-4">
                      <div className="relative">
                        <Input
                          type="number"
                          value={set.weight || ""}
                          onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'weight', e.target.value)}
                          className={`pl-2 pr-8 ${set.completed ? 'border-fitness-secondary/50 bg-fitness-secondary/10' : ''}`}
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          lb
                        </span>
                      </div>
                    </div>
                    <div className="col-span-4">
                      <Input
                        type="number"
                        value={set.reps || ""}
                        onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'reps', e.target.value)}
                        className={set.completed ? 'border-fitness-secondary/50 bg-fitness-secondary/10' : ''}
                      />
                    </div>
                    <div className="col-span-3 flex items-center space-x-1">
                      <Button
                        size="icon"
                        variant={set.completed ? "default" : "outline"}
                        className={`h-8 w-8 ${set.completed ? 'bg-fitness-secondary hover:bg-fitness-secondary/90' : ''}`}
                        onClick={() => handleSetChange(exerciseIndex, setIndex, 'completed', !set.completed)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button 
                  variant="ghost" 
                  className="w-full border border-dashed border-muted-foreground/30 text-muted-foreground"
                  onClick={() => addSet(exerciseIndex)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Set
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Add notes about your workout here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </CardContent>
      </Card>
      
      <Button 
        className="w-full bg-fitness-primary hover:bg-fitness-primary/90 text-white" 
        size="lg"
        onClick={completeWorkout}
      >
        Complete Workout
      </Button>
    </div>
  );
};

export default WorkoutForm;
