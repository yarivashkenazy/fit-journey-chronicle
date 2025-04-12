
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { getActiveWorkoutGoal, saveWorkoutGoal } from "@/utils/storageService";
import { WorkoutGoal } from "@/types/workout";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

const GoalSetting = () => {
  const activeGoal = getActiveWorkoutGoal();
  const [targetFrequency, setTargetFrequency] = useState<number>(activeGoal?.frequency || 3);

  const handleSaveGoal = () => {
    const newGoal: WorkoutGoal = {
      id: activeGoal?.id || uuidv4(),
      frequency: targetFrequency,
      startDate: new Date().toISOString().split('T')[0],
      isActive: true
    };
    
    saveWorkoutGoal(newGoal);
    toast.success(`Weekly goal set to ${targetFrequency} workouts`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Set Weekly Goal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between mb-1">
            <span className="text-sm">Target workouts per week</span>
            <span className="font-medium">{targetFrequency}</span>
          </div>
          <Slider
            value={[targetFrequency]}
            min={1}
            max={7}
            step={1}
            onValueChange={(value) => setTargetFrequency(value[0])}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1</span>
            <span>4</span>
            <span>7</span>
          </div>
        </div>
        <Button className="w-full" onClick={handleSaveGoal}>
          Save Goal
        </Button>
      </CardContent>
    </Card>
  );
};

export default GoalSetting;
