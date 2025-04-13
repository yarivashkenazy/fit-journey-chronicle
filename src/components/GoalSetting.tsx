
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getActiveWorkoutGoal, saveWorkoutGoal } from "@/utils/storageService";
import { WorkoutGoal } from "@/types/workout";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface GoalSettingProps {
  onGoalUpdate?: () => void;
}

const GoalSetting = ({ onGoalUpdate }: GoalSettingProps) => {
  // Set a default value of 3 if no active goal exists
  const [targetFrequency, setTargetFrequency] = useState<number>(3);
  
  useEffect(() => {
    // Get active goal on component mount
    const activeGoal = getActiveWorkoutGoal();
    if (activeGoal) {
      setTargetFrequency(activeGoal.frequency);
    }
  }, []);

  const handleSaveGoal = () => {
    const activeGoal = getActiveWorkoutGoal();
    const newGoal: WorkoutGoal = {
      id: activeGoal?.id || uuidv4(),
      frequency: targetFrequency,
      startDate: new Date().toISOString().split('T')[0],
      isActive: true
    };
    
    saveWorkoutGoal(newGoal);
    toast.success(`Weekly goal set to ${targetFrequency} workouts`);
    
    if (onGoalUpdate) {
      onGoalUpdate();
    }
  };

  const handleFrequencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Parse the input value to a number and ensure it's within the valid range (1-7)
    const value = parseInt(e.target.value) || 1;
    const validValue = Math.max(1, Math.min(7, value));
    setTargetFrequency(validValue);
  };

  return (
    <Card className="h-auto">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Set Goals</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Weekly workouts</span>
              <Badge variant="outline">{targetFrequency}</Badge>
            </div>
            <Input
              type="number"
              min={1}
              max={7}
              value={targetFrequency}
              onChange={handleFrequencyChange}
              className="h-8"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Min: 1</span>
              <span>Max: 7</span>
            </div>
          </div>
          
          <div>
            <Button className="w-full" size="sm" onClick={handleSaveGoal}>
              Save Goals
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalSetting;
