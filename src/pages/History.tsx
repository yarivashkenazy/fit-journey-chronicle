
import { useEffect, useState } from "react";
import { WorkoutLog } from "@/types/workout";
import { getWorkoutLogs, deleteWorkoutLog } from "@/utils/storageService";
import { useToast } from "@/hooks/use-toast";
import { HistoryHeader } from "@/components/history/HistoryHeader";
import { EmptyState } from "@/components/history/EmptyState";
import { DeleteConfirmDialog } from "@/components/history/DeleteConfirmDialog";
import { MonthlyWorkoutGroup } from "@/components/history/MonthlyWorkoutGroup";

const History = () => {
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [groupedLogs, setGroupedLogs] = useState<Record<string, WorkoutLog[]>>({});
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState<string | null>(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedLogs, setSelectedLogs] = useState<string[]>([]);
  const [multiDeleteConfirmOpen, setMultiDeleteConfirmOpen] = useState(false);
  const { toast } = useToast();
  
  const loadWorkoutLogs = () => {
    const logs = getWorkoutLogs();
    setWorkoutLogs(logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    
    const grouped = logs.reduce((acc, log) => {
      const date = new Date(log.date);
      const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
      
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      
      acc[monthYear].push(log);
      return acc;
    }, {} as Record<string, WorkoutLog[]>);
    
    Object.keys(grouped).forEach(month => {
      grouped[month].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
    
    setGroupedLogs(grouped);
  };

  useEffect(() => {
    loadWorkoutLogs();
  }, []);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric'
    });
  };

  const handleDeleteClick = (logId: string) => {
    setLogToDelete(logId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (logToDelete) {
      deleteWorkoutLog(logToDelete);
      loadWorkoutLogs();
      setDeleteConfirmOpen(false);
      setLogToDelete(null);
      toast({
        title: "Workout deleted",
        description: "Your workout has been removed from history",
      });
    }
  };

  const toggleSelectMode = () => {
    setSelectMode(!selectMode);
    setSelectedLogs([]);
  };

  const toggleSelectLog = (logId: string) => {
    setSelectedLogs(prev => 
      prev.includes(logId) 
        ? prev.filter(id => id !== logId) 
        : [...prev, logId]
    );
  };

  const selectAll = () => {
    const allLogIds = Object.values(groupedLogs)
      .flat()
      .map(log => log.id);
    setSelectedLogs(allLogIds);
  };

  const deselectAll = () => {
    setSelectedLogs([]);
  };

  const confirmMultiDelete = () => {
    if (selectedLogs.length > 0) {
      selectedLogs.forEach(logId => {
        deleteWorkoutLog(logId);
      });
      loadWorkoutLogs();
      setSelectedLogs([]);
      setSelectMode(false);
      setMultiDeleteConfirmOpen(false);
      toast({
        title: `${selectedLogs.length} workouts deleted`,
        description: "The selected workouts have been removed from history",
      });
    }
  };
  
  return (
    <div className="container py-6 space-y-6">
      <HistoryHeader 
        workoutLogsExist={workoutLogs.length > 0}
        selectMode={selectMode}
        selectedLogs={selectedLogs}
        toggleSelectMode={toggleSelectMode}
        selectAll={selectAll}
        setMultiDeleteConfirmOpen={setMultiDeleteConfirmOpen}
      />
      
      {Object.keys(groupedLogs).length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedLogs).map(([month, logs]) => (
            <MonthlyWorkoutGroup
              key={month}
              month={month}
              logs={logs}
              selectMode={selectMode}
              selectedLogs={selectedLogs}
              toggleSelectLog={toggleSelectLog}
              handleDeleteClick={handleDeleteClick}
              formatDate={formatDate}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialogs */}
      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        setOpen={setDeleteConfirmOpen}
        onConfirm={confirmDelete}
        title="Are you sure?"
        description="This action cannot be undone. This will permanently delete this workout from your history."
      />

      <DeleteConfirmDialog
        open={multiDeleteConfirmOpen}
        setOpen={setMultiDeleteConfirmOpen}
        onConfirm={confirmMultiDelete}
        title={`Delete ${selectedLogs.length} workouts?`}
        description="This action cannot be undone. This will permanently delete all selected workouts from your history."
      />
    </div>
  );
};

export default History;
