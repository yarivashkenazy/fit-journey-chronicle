
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
    <Card className="h-full w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Activity Calendar</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 h-[calc(100%-60px)] flex flex-col">
        <div className="w-full max-w-[260px] mx-auto">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="mx-auto"
            components={{
              DayContent: (props) => (
                <DayWithDot date={props.date}>
                  {props.date.getDate()}
                </DayWithDot>
              ),
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityCalendar;
