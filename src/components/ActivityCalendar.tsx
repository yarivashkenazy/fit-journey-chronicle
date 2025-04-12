
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkoutLog } from "@/types/workout";
import { getWorkoutLogs } from "@/utils/storageService";
import { Calendar } from "@/components/ui/calendar";

const ActivityCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [workoutDays, setWorkoutDays] = useState<Date[]>([]);
  const [selectedDateWorkouts, setSelectedDateWorkouts] = useState<WorkoutLog[]>([]);

  useEffect(() => {
    const logs = getWorkoutLogs();
    
    // Get all days with workouts
    const days = logs.map(log => new Date(log.date));
    setWorkoutDays(days);
    
    // Get workouts for selected date if any
    if (selectedDate) {
      const selectedDateStr = selectedDate.toISOString().split('T')[0];
      const matchingLogs = logs.filter(log => log.date === selectedDateStr);
      setSelectedDateWorkouts(matchingLogs);
    }
  }, [selectedDate]);

  // Create a function that adds a dot under workout days
  const DayWithDot = ({ date, ...props }: { date: Date; [key: string]: any }) => {
    const isWorkoutDay = workoutDays.some(d => 
      d.getDate() === date.getDate() && 
      d.getMonth() === date.getMonth() && 
      d.getFullYear() === date.getFullYear()
    );
    
    return (
      <div className="relative flex flex-col items-center">
        {props.children}
        {isWorkoutDay && (
          <div className="absolute -bottom-1 h-1 w-1 rounded-full bg-fitness-primary" />
        )}
      </div>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Activity Calendar</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
          components={{
            DayContent: (props) => (
              <DayWithDot date={props.date}>
                {props.date.getDate()}
              </DayWithDot>
            ),
          }}
        />
        
        {selectedDateWorkouts.length > 0 && (
          <div className="mt-2 space-y-1">
            <h3 className="text-sm font-medium">Workouts on {selectedDate?.toLocaleDateString()}</h3>
            {selectedDateWorkouts.map((log) => (
              <div key={log.id} className="p-2 bg-muted/30 rounded-md">
                <div className="text-sm font-medium">{log.workoutName}</div>
                <div className="text-xs text-muted-foreground">
                  {log.exerciseLogs.length} exercises, {log.duration} min
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityCalendar;
