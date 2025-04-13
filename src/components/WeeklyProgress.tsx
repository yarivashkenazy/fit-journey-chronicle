
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useIsMobile } from "@/hooks/use-mobile";

interface WeeklyProgressProps {
  current: number;
  target: number;
  percentage: number;
  compact?: boolean;
}

const WeeklyProgress = ({ current, target, percentage, compact = false }: WeeklyProgressProps) => {
  const isMobile = useIsMobile();
  
  if (compact) {
    return (
      <div className="bg-card rounded-lg border shadow-sm px-3 py-2 w-[120px] xs:w-[140px] sm:min-w-40">
        <div className="flex justify-between items-center mb-1">
          <p className="text-sm font-medium">Weekly Goal</p>
          <p className="text-sm font-medium">{current}/{target}</p>
        </div>
        <Progress value={percentage} className="h-2" />
      </div>
    );
  }
  
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
