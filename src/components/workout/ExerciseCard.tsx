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
import { motion, AnimatePresence } from "framer-motion";
import { HapticPattern, SoundEffect } from "@/utils/feedbackUtils";

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

// State management for a single set
const useSetState = (
  exerciseIndex: number,
  setIndex: number,
  onSetChange: (exerciseIndex: number, setIndex: number, field: keyof Set, value: any) => void
) => {
  const handleStateTransition = (newState: Partial<Set>) => {
    console.log(`[useSetState ${exerciseIndex}-${setIndex}] Starting state transition:`, newState);
    
    Object.entries(newState).forEach(([field, value]) => {
      console.log(`[useSetState ${exerciseIndex}-${setIndex}] Updating field ${field} to:`, value);
      onSetChange(exerciseIndex, setIndex, field as keyof Set, value);
    });
    
    console.log(`[useSetState ${exerciseIndex}-${setIndex}] State transition complete`);
  };

  return {
    handleStateTransition
  };
};

// Component for the set action button
const SetActionButton = ({ 
  set, 
  isTimerActive, 
  onClick 
}: { 
  set: Set; 
  isTimerActive: boolean; 
  onClick: () => void;
}) => {
  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.05, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        size="icon"
        variant="outline"
        className={`h-8 w-8 relative overflow-hidden glass-card ${
          set.completed 
            ? 'bg-green-500/20 hover:bg-green-500/30 border-green-500' 
            : ''
        }`}
        onClick={onClick}
      >
        <AnimatePresence mode="wait">
          {set.completed ? (
            <motion.div
              key="check"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.2 }}
            >
              <Check className="h-4 w-4 text-green-500" />
            </motion.div>
          ) : isTimerActive ? (
            <motion.div
              key="fast-forward"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.2 }}
            >
              <FastForward className="h-4 w-4 text-orange-500" />
            </motion.div>
          ) : (
            <motion.div
              key="clock"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.2 }}
            >
              <Clock className="h-4 w-4 text-muted-foreground" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    </motion.div>
  );
};

// Component for a single set row
const SetRow = ({ 
  set, 
  setIndex, 
  exerciseIndex, 
  exercise, 
  onSetChange, 
  onRestTimerComplete 
}: { 
  set: Set; 
  setIndex: number; 
  exerciseIndex: number; 
  exercise?: Exercise; 
  onSetChange: (exerciseIndex: number, setIndex: number, field: keyof Set, value: any) => void;
  onRestTimerComplete: (timerId: string) => void;
}) => {
  const timerId = `${exerciseIndex}-${setIndex}`;
  const isTimerActive = set.timerActive || false;

  const handleSetClick = () => {
    HapticPattern.light();
    SoundEffect.click();
    
    if (!set.completed && !set.timerActive) {
      // Start timer
      onSetChange(exerciseIndex, setIndex, 'timerActive', true);
    } else if (set.timerActive) {
      // Complete set
      onSetChange(exerciseIndex, setIndex, 'completed', true);
      onSetChange(exerciseIndex, setIndex, 'timerActive', false);
      onRestTimerComplete(timerId);
      SoundEffect.complete();
    } else if (set.completed) {
      // Reset set
      onSetChange(exerciseIndex, setIndex, 'completed', false);
      SoundEffect.reset();
    }
  };

  return (
    <motion.div
      key={set.id}
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="space-y-2"
    >
      <div className={`grid grid-cols-12 gap-2 items-center rounded-md p-1 ${
        set.completed ? 'bg-green-50/10' : ''
      }`}>
        <div className="col-span-1 text-sm font-medium">{setIndex + 1}</div>
        <div className="col-span-4">
          <div className="relative">
            <Input
              type="number"
              value={set.weight || ''}
              onChange={(e) => onSetChange(exerciseIndex, setIndex, 'weight', e.target.value)}
              className={`modern-input pl-2 pr-8 ${
                set.completed 
                  ? 'border-green-500 bg-green-50/10' 
                  : isTimerActive 
                    ? 'border-orange-500 bg-orange-50/10' 
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
            value={set.reps || ''}
            onChange={(e) => onSetChange(exerciseIndex, setIndex, 'reps', e.target.value)}
            className={`modern-input ${
              set.completed 
                ? 'border-green-500 bg-green-50/10' 
                : isTimerActive 
                  ? 'border-orange-500 bg-orange-50/10' 
                  : ''
            }`}
          />
        </div>
        <div className="col-span-3 flex items-center gap-2">
          <SetActionButton 
            set={set} 
            isTimerActive={isTimerActive} 
            onClick={handleSetClick} 
          />
          
          {isTimerActive && (
            <RestTimer 
              key={timerId}
              defaultRestTime={exercise?.defaultRestPeriod || 60} 
              onComplete={() => {
                onSetChange(exerciseIndex, setIndex, 'completed', true);
                onSetChange(exerciseIndex, setIndex, 'timerActive', false);
                onRestTimerComplete(timerId);
                SoundEffect.complete();
              }} 
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

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
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="floating-widget"
    >
      <Card 
        className={`glass-card ${dragClass} ${dropTargetClass} transition-all`}
        draggable
        onDragStart={(e) => onDragStart(e, exerciseIndex)}
        onDragEnter={(e) => onDragEnter(e, exerciseIndex)}
        onDragEnd={onDragEnd}
        onDragOver={(e) => e.preventDefault()}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="mr-2"
              >
                <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
              </motion.div>
              {exerciseLog.exerciseName}
              {exercise?.formCues && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        className="ml-2"
                      >
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="glass-card">
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
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-destructive"
                  onClick={() => {
                    HapticPattern.medium();
                    onRemoveExercise(exerciseIndex);
                  }}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </motion.div>
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
              <SetRow
                key={set.id}
                set={set}
                setIndex={setIndex}
                exerciseIndex={exerciseIndex}
                exercise={exercise}
                onSetChange={onSetChange}
                onRestTimerComplete={onRestTimerComplete}
              />
            ))}
            
            <motion.div
              whileHover={{ scale: 1.02, rotate: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                variant="ghost" 
                className="w-full border border-dashed border-muted-foreground/30 text-muted-foreground glass-card"
                onClick={() => {
                  HapticPattern.light();
                  onAddSet(exerciseIndex);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Set
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ExerciseCard;
