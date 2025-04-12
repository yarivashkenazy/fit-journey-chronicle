
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface WeeklyProgressProps {
  current: number;
  target: number;
  percentage: number;
}

const WeeklyProgress = ({ current, target, percentage }: WeeklyProgressProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Weekly Goal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between">
            <p className="text-sm text-muted-foreground">Progress</p>
            <p className="text-sm font-medium">{current} of {target} workouts</p>
          </div>
          <Progress value={percentage} className="h-2" />
          <p className="text-sm text-muted-foreground text-center">
            {percentage === 100 ? "Goal completed! 🎉" : `${percentage}% complete`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyProgress;
