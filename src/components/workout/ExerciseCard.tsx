
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Plus, Check, Info, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import RestTimer from "@/components/RestTimer";
import { Exercise, ExerciseLog, Set } from "@/types/workout";

interface ExerciseCardProps {
  exerciseLog: ExerciseLog;
  exercise?: Exercise;
  exerciseIndex: number;
  onSetChange: (exerciseIndex: number, setIndex: number, field: keyof Set, value: any) => void;
  onAddSet: (exerciseIndex: number) => void;
  onRemoveExercise: (exerciseIndex: number) => void;
  activeRestTimers: Record<string, boolean>;
  onRestTimerComplete: (timerId: string) => void;
}

const ExerciseCard = ({
  exerciseLog,
  exercise,
  exerciseIndex,
  onSetChange,
  onAddSet,
  onRemoveExercise,
  activeRestTimers,
  onRestTimerComplete
}: ExerciseCardProps) => {
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
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">
              Rest: {exercise?.defaultRestPeriod || 60}s
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-destructive"
              onClick={() => onRemoveExercise(exerciseIndex)}
            >
              <Trash className="h-4 w-4" />
            </Button>
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
          
          {exerciseLog.sets.map((set, setIndex) => {
            const timerId = `${exerciseIndex}-${setIndex}`;
            const showRestTimer = activeRestTimers[timerId];
            
            return (
              <div key={set.id} className="space-y-2">
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-1 text-sm font-medium">{setIndex + 1}</div>
                  <div className="col-span-4">
                    <div className="relative">
                      <Input
                        type="number"
                        value={set.weight || ""}
                        onChange={(e) => onSetChange(exerciseIndex, setIndex, 'weight', e.target.value)}
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
                      onChange={(e) => onSetChange(exerciseIndex, setIndex, 'reps', e.target.value)}
                      className={set.completed ? 'border-fitness-secondary/50 bg-fitness-secondary/10' : ''}
                    />
                  </div>
                  <div className="col-span-3 flex items-center space-x-1">
                    <Button
                      size="icon"
                      variant={set.completed ? "default" : "outline"}
                      className={`h-8 w-8 ${set.completed ? 'bg-fitness-secondary hover:bg-fitness-secondary/90' : ''}`}
                      onClick={() => onSetChange(exerciseIndex, setIndex, 'completed', !set.completed)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {showRestTimer && exercise && (
                  <RestTimer 
                    defaultRestTime={exercise.defaultRestPeriod} 
                    onComplete={() => onRestTimerComplete(timerId)} 
                  />
                )}
              </div>
            );
          })}
          
          <Button 
            variant="ghost" 
            className="w-full border border-dashed border-muted-foreground/30 text-muted-foreground"
            onClick={() => onAddSet(exerciseIndex)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Set
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExerciseCard;
