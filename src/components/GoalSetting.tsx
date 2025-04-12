
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
  const activeGoal = getActiveWorkoutGoal();
  const [targetFrequency, setTargetFrequency] = useState<number>(activeGoal?.frequency || 3);
  const [targetStreak, setTargetStreak] = useState<number>(7);
  const [showStreak, setShowStreak] = useState<boolean>(false);

  useEffect(() => {
    // Reset targetFrequency if activeGoal changes
    if (activeGoal) {
      setTargetFrequency(activeGoal.frequency);
    }
  }, [activeGoal]);

  const handleSaveGoal = () => {
    const newGoal: WorkoutGoal = {
      id: activeGoal?.id || uuidv4(),
      frequency: targetFrequency,
      startDate: new Date().toISOString().split('T')[0],
      isActive: true,
      targetStreak: showStreak ? targetStreak : undefined
    };
    
    saveWorkoutGoal(newGoal);
    toast.success(`Weekly goal set to ${targetFrequency} workouts`);
    
    if (onGoalUpdate) {
      onGoalUpdate();
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Set Goals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between mb-1">
            <span className="text-sm">Weekly target workouts</span>
            <Badge variant="outline">{targetFrequency}</Badge>
          </div>
          <Input
            type="number"
            min={1}
            max={7}
            value={targetFrequency}
            onChange={(e) => setTargetFrequency(Math.max(1, Math.min(7, parseInt(e.target.value) || 1)))}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Min: 1</span>
            <span>Max: 7</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="enable-streak"
              checked={showStreak}
              onChange={() => setShowStreak(!showStreak)}
              className="rounded border-gray-300"
            />
            <label htmlFor="enable-streak" className="text-sm">Set streak goal</label>
          </div>
          
          {showStreak && (
            <>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Target streak (days)</span>
                <Badge variant="outline">{targetStreak}</Badge>
              </div>
              <Input
                type="number"
                min={1}
                max={30}
                value={targetStreak}
                onChange={(e) => setTargetStreak(Math.max(1, Math.min(30, parseInt(e.target.value) || 1)))}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Min: 1</span>
                <span>Max: 30</span>
              </div>
            </>
          )}
        </div>
        
        <Button className="w-full" onClick={handleSaveGoal}>
          Save Goals
        </Button>
      </CardContent>
    </Card>
  );
};

export default GoalSetting;
