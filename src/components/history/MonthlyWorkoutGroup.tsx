
import { WorkoutLog } from "@/types/workout";
import { WorkoutLogCard } from "./WorkoutLogCard";

interface MonthlyWorkoutGroupProps {
  month: string;
  logs: WorkoutLog[];
  selectMode: boolean;
  selectedLogs: string[];
  toggleSelectLog: (logId: string) => void;
  handleDeleteClick: (logId: string) => void;
  formatDate: (dateString: string) => string;
}

export function MonthlyWorkoutGroup({
  month,
  logs,
  selectMode,
  selectedLogs,
  toggleSelectLog,
  handleDeleteClick,
  formatDate
}: MonthlyWorkoutGroupProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{month}</h2>
      
      <div className="space-y-4">
        {logs.map(log => (
          <WorkoutLogCard
            key={log.id}
            log={log}
            selectMode={selectMode}
            selectedLogs={selectedLogs}
            toggleSelectLog={toggleSelectLog}
            handleDeleteClick={handleDeleteClick}
            formatDate={formatDate}
          />
        ))}
      </div>
    </div>
  );
}
