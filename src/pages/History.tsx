
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clock, CalendarDays, BarChart3, Dumbbell } from "lucide-react";
import { WorkoutLog } from "@/types/workout";
import { getWorkoutLogs } from "@/utils/storageService";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const History = () => {
  const navigate = useNavigate();
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [groupedLogs, setGroupedLogs] = useState<Record<string, WorkoutLog[]>>({});
  
  useEffect(() => {
    const logs = getWorkoutLogs();
    setWorkoutLogs(logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    
    // Group logs by month
    const grouped = logs.reduce((acc, log) => {
      const date = new Date(log.date);
      const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
      
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      
      acc[monthYear].push(log);
      return acc;
    }, {} as Record<string, WorkoutLog[]>);
    
    // Sort each month's logs by date (newest first)
    Object.keys(grouped).forEach(month => {
      grouped[month].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
    
    setGroupedLogs(grouped);
  }, []);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric'
    });
  };
  
  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/")} className="px-0 hover:bg-transparent">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Workout History</h1>
      </div>
      
      {Object.keys(groupedLogs).length === 0 ? (
        <div className="text-center py-12">
          <Dumbbell className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
          <h3 className="mt-4 text-lg font-medium">No workout history yet</h3>
          <p className="text-muted-foreground">Start tracking your workouts to see your history here.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedLogs).map(([month, logs]) => (
            <div key={month} className="space-y-4">
              <h2 className="text-xl font-semibold">{month}</h2>
              
              <div className="space-y-4">
                {logs.map(log => (
                  <Card key={log.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{log.workoutName}</CardTitle>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <CalendarDays className="mr-1 h-4 w-4" />
                          {formatDate(log.date)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{log.duration} min</span>
                          </div>
                          <div className="flex items-center">
                            <Dumbbell className="mr-1 h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{log.exerciseLogs.length} exercises</span>
                          </div>
                        </div>
                      </div>
                      
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="exercises">
                          <AccordionTrigger className="text-sm py-2">
                            View Details
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4 pt-2">
                              {log.exerciseLogs.map((exerciseLog) => (
                                <div key={exerciseLog.id} className="space-y-2">
                                  <h4 className="font-medium text-sm">{exerciseLog.exerciseName}</h4>
                                  <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                                    <div>Set</div>
                                    <div>Weight</div>
                                    <div>Reps</div>
                                  </div>
                                  {exerciseLog.sets.map((set, index) => (
                                    <div key={set.id} className="grid grid-cols-3 gap-2 text-sm">
                                      <div>{index + 1}</div>
                                      <div>{set.weight} lb</div>
                                      <div>{set.reps}</div>
                                    </div>
                                  ))}
                                </div>
                              ))}
                              
                              {log.notes && (
                                <div className="mt-4 pt-4 border-t">
                                  <h4 className="font-medium text-sm mb-2">Notes</h4>
                                  <p className="text-sm">{log.notes}</p>
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
