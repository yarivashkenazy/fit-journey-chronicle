
import { ArrowLeft, Square, CheckSquare, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface HistoryHeaderProps {
  workoutLogsExist: boolean;
  selectMode: boolean;
  selectedLogs: string[];
  toggleSelectMode: () => void;
  selectAll: () => void;
  setMultiDeleteConfirmOpen: (open: boolean) => void;
}

export function HistoryHeader({
  workoutLogsExist,
  selectMode,
  selectedLogs,
  toggleSelectMode,
  selectAll,
  setMultiDeleteConfirmOpen
}: HistoryHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <Button variant="ghost" onClick={() => navigate("/")} className="px-0 hover:bg-transparent">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <h1 className="text-2xl font-bold">Workout History</h1>
      
      {workoutLogsExist && (
        <div className="flex items-center space-x-2">
          {selectMode ? (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={selectAll}
                className="flex items-center"
              >
                <CheckSquare className="h-4 w-4 mr-1" />
                Select All
              </Button>
              {selectedLogs.length > 0 && (
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => setMultiDeleteConfirmOpen(true)}
                  className="flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete ({selectedLogs.length})
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleSelectMode}
                className="flex items-center"
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleSelectMode}
              className="flex items-center"
            >
              <Square className="h-4 w-4 mr-1" />
              Select
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
