
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

  // Create a function to modify the day styles
  const modifyDay = (date: Date) => {
    const isWorkoutDay = workoutDays.some(d => 
      d.getDate() === date.getDate() && 
      d.getMonth() === date.getMonth() && 
      d.getFullYear() === date.getFullYear()
    );
    
    return isWorkoutDay ? 
      "bg-fitness-primary/20 text-fitness-primary font-medium rounded-full" : 
      undefined;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Activity Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
          modifiers={{ workout: workoutDays }}
          modifiersClassNames={{
            workout: "bg-fitness-primary/20"
          }}
          components={{
            DayContent: (props) => (
              <div className={modifyDay(props.date)}>
                {props.date.getDate()}
              </div>
            ),
          }}
        />
        
        {selectedDateWorkouts.length > 0 && (
          <div className="mt-4 space-y-2">
            <h3 className="font-medium">Workouts on {selectedDate?.toLocaleDateString()}</h3>
            {selectedDateWorkouts.map((log) => (
              <div key={log.id} className="p-3 bg-muted/30 rounded-md">
                <div className="font-medium">{log.workoutName}</div>
                <div className="text-sm text-muted-foreground">
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
