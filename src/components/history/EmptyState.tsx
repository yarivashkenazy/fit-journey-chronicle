
import { Dumbbell } from "lucide-react";

export function EmptyState() {
  return (
    <div className="text-center py-12">
      <Dumbbell className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
      <h3 className="mt-4 text-lg font-medium">No workout history yet</h3>
      <p className="text-muted-foreground">Start tracking your workouts to see your history here.</p>
    </div>
  );
}
