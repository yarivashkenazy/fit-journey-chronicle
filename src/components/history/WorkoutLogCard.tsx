
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CalendarDays, Dumbbell, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { WorkoutLog } from "@/types/workout";
import { ExerciseDetails } from "./ExerciseDetails";

interface WorkoutLogCardProps {
  log: WorkoutLog;
  selectMode: boolean;
  selectedLogs: string[];
  toggleSelectLog: (logId: string) => void;
  handleDeleteClick: (logId: string) => void;
  formatDate: (dateString: string) => string;
}

export function WorkoutLogCard({
  log,
  selectMode,
  selectedLogs,
  toggleSelectLog,
  handleDeleteClick,
  formatDate
}: WorkoutLogCardProps) {
  return (
    <Card key={log.id} className={selectMode && selectedLogs.includes(log.id) 
      ? "border-primary border-2" 
      : ""
    }>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {selectMode && (
              <Checkbox 
                checked={selectedLogs.includes(log.id)}
                onCheckedChange={() => toggleSelectLog(log.id)}
                className="h-5 w-5"
              />
            )}
            <CardTitle className="text-lg">{log.workoutName}</CardTitle>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarDays className="mr-1 h-4 w-4" />
              {formatDate(log.date)}
            </div>
            {!selectMode && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => handleDeleteClick(log.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
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
              <ExerciseDetails 
                exerciseLogs={log.exerciseLogs} 
                notes={log.notes} 
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
