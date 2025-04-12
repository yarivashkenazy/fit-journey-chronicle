
import { Set } from "@/types/workout";

interface WorkoutSetDetailsProps {
  sets: Set[];
}

export function WorkoutSetDetails({ sets }: WorkoutSetDetailsProps) {
  return (
    <div>
      <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
        <div>Set</div>
        <div>Weight</div>
        <div>Reps</div>
      </div>
      {sets.map((set, index) => (
        <div key={set.id} className="grid grid-cols-3 gap-2 text-sm">
          <div>{index + 1}</div>
          <div>{set.weight} kg</div>
          <div>{set.reps}</div>
        </div>
      ))}
    </div>
  );
}
