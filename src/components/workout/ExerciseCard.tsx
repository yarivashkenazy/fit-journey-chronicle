import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Plus, Check, Info, Trash, Clock, GripVertical, FastForward } from "lucide-react";
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
  onDragStart: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragEnter: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  draggedIndex: number | null;
}

const ExerciseCard = ({
  exerciseLog,
  exercise,
  exerciseIndex,
  onSetChange,
  onAddSet,
  onRemoveExercise,
  activeRestTimers,
  onRestTimerComplete,
  onDragStart,
  onDragEnter,
  onDragEnd,
  isDragging,
  draggedIndex
}: ExerciseCardProps) => {
  const isBeingDragged = draggedIndex === exerciseIndex;
  const dragClass = isBeingDragged ? "opacity-50" : "";
  const dropTargetClass = isDragging && !isBeingDragged ? "border-dashed border-2 border-fitness-primary/50" : "";

  return (
    <Card 
      key={exerciseLog.id} 
      className={`${dragClass} ${dropTargetClass} transition-all`}
      draggable
      onDragStart={(e) => onDragStart(e, exerciseIndex)}
      onDragEnter={(e) => onDragEnter(e, exerciseIndex)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <GripVertical className="h-5 w-5 mr-2 text-muted-foreground cursor-grab" />
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
            const isTimerActive = set.timerActive || false;
            
            return (
              <div key={set.id} className="space-y-2">
                <div className="grid grid-cols-12 gap-2 items-center rounded-md p-1">
                  <div className="col-span-1 text-sm font-medium">{setIndex + 1}</div>
                  <div className="col-span-4">
                    <div className="relative">
                      <Input
                        type="number"
                        value={set.weight || ""}
                        onChange={(e) => onSetChange(exerciseIndex, setIndex, 'weight', e.target.value)}
                        className={`pl-2 pr-8 ${
                          set.completed 
                            ? 'border-green-500 bg-green-50' 
                            : isTimerActive 
                              ? 'border-orange-500 bg-orange-50' 
                              : ''
                        }`}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        kg
                      </span>
                    </div>
                  </div>
                  <div className="col-span-4">
                    <Input
                      type="number"
                      value={set.reps || ""}
                      onChange={(e) => onSetChange(exerciseIndex, setIndex, 'reps', e.target.value)}
                      className={`${
                        set.completed 
                          ? 'border-green-500 bg-green-50' 
                          : isTimerActive 
                            ? 'border-orange-500 bg-orange-50' 
                            : ''
                      }`}
                    />
                  </div>
                  <div className="col-span-3 flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className={`h-8 w-8 ${
                        set.completed 
                          ? 'bg-green-500 hover:bg-green-600 border-green-500' 
                          : ''
                      }`}
                      onClick={() => {
                        if (!set.completed && !isTimerActive) {
                          // Start the timer
                          onSetChange(exerciseIndex, setIndex, 'timerActive', true);
                        } else if (isTimerActive) {
                          // Fast-forward: complete the set and stop the timer
                          onSetChange(exerciseIndex, setIndex, 'completed', true);
                          onSetChange(exerciseIndex, setIndex, 'timerActive', false);
                          onRestTimerComplete(timerId);
                        } else if (set.completed) {
                          // Toggle completion off
                          onSetChange(exerciseIndex, setIndex, 'completed', false);
                        }
                      }}
                    >
                      {set.completed ? (
                        <Check className="h-4 w-4 text-white" />
                      ) : isTimerActive ? (
                        <FastForward className="h-4 w-4 text-orange-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                    
                    {isTimerActive && (
                      <RestTimer 
                        defaultRestTime={exercise?.defaultRestPeriod || 60} 
                        onComplete={() => {
                          // When timer completes naturally
                          onSetChange(exerciseIndex, setIndex, 'completed', true);
                          onSetChange(exerciseIndex, setIndex, 'timerActive', false);
                          onRestTimerComplete(timerId);
                        }} 
                      />
                    )}
                  </div>
                </div>
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
