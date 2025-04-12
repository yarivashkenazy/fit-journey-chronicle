
import { ExerciseLog } from "@/types/workout";
import { WorkoutSetDetails } from "./WorkoutSetDetails";

interface ExerciseDetailsProps {
  exerciseLogs: ExerciseLog[];
  notes?: string;
}

export function ExerciseDetails({ exerciseLogs, notes }: ExerciseDetailsProps) {
  return (
    <div className="space-y-4 pt-2">
      {exerciseLogs.map((exerciseLog) => (
        <div key={exerciseLog.id} className="space-y-2">
          <h4 className="font-medium text-sm">{exerciseLog.exerciseName}</h4>
          <WorkoutSetDetails sets={exerciseLog.sets} />
        </div>
      ))}
      
      {notes && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="font-medium text-sm mb-2">Notes</h4>
          <p className="text-sm">{notes}</p>
        </div>
      )}
    </div>
  );
}
