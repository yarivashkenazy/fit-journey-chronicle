
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import ProgressChart from "@/components/ProgressChart";
import WeeklyProgress from "@/components/WeeklyProgress";
import ActivityCalendar from "@/components/ActivityCalendar";
import GoalSetting from "@/components/GoalSetting";
import { getActiveWorkoutGoal, getWorkoutLogs, getWorkouts, initializeStorage } from "@/utils/storageService";
import { calculateWorkoutStats, calculateWeeklyGoalProgress } from "@/utils/statsUtils";
import { WorkoutStats } from "@/types/workout";
import WorkoutButton from "@/components/WorkoutButton";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<WorkoutStats | null>(null);
  const [weeklyGoal, setWeeklyGoal] = useState({ current: 0, target: 0, percentage: 0 });
  const [isLoading, setIsLoading] = useState(false);
  
  const loadData = () => {
    setIsLoading(true);
    
    // Initialize local storage if empty
    initializeStorage();
    
    // Load statistics
    const workoutStats = calculateWorkoutStats();
    setStats(workoutStats);
    
    // Calculate weekly goal progress
    const logs = getWorkoutLogs();
    const activeGoal = getActiveWorkoutGoal();
    
    if (activeGoal) {
      const progress = calculateWeeklyGoalProgress(logs, activeGoal.frequency);
      setWeeklyGoal(progress);
    } else {
      setWeeklyGoal({ current: 0, target: 0, percentage: 0 });
    }
    
    setIsLoading(false);
  };
  
  useEffect(() => {
    loadData();
  }, []);
  
  const handleStartWorkout = (workoutId: string) => {
    navigate(`/workout/${workoutId}`);
  };
  
  const handleRefresh = () => {
    loadData();
  };
  
  if (!stats) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  const workouts = getWorkouts();
  
  return (
    <div className="container py-6 space-y-6 overflow-x-hidden max-w-full">
      {/* Weekly Goal Top Widget */}
      <div className="w-full">
        <WeeklyProgress 
          current={weeklyGoal.current} 
          target={weeklyGoal.target} 
          percentage={weeklyGoal.percentage}
        />
      </div>
      
      <div className="flex items-center justify-between dashboard-header">
        <h1 className="text-2xl font-bold">Fitness Tracker</h1>
        <div className="flex flex-wrap gap-2 items-center">
          <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Start Workout Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Start Workout</h2>
        {workouts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {workouts.map((workout) => (
              <WorkoutButton
                key={workout.id}
                workout={workout}
                onClick={() => handleStartWorkout(workout.id)}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-muted-foreground mb-4">No workouts available. Create a workout to get started.</p>
            <Button onClick={() => navigate('/create-workout')}>Create Workout</Button>
          </div>
        )}
      </div>
      
      {/* Progress Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full overflow-x-hidden dashboard-grid">
        <div className="col-span-1 h-[420px]">
          <ProgressChart stats={stats} />
        </div>
        <div className="col-span-1 h-[420px]">
          <ActivityCalendar />
        </div>
        <div className="col-span-1 h-[420px]">
          <GoalSetting onGoalUpdate={handleRefresh} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
