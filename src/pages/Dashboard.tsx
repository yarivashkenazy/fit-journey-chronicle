
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Activity, CalendarIcon, RefreshCw } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import ProgressChart from "@/components/ProgressChart";
import WeeklyProgress from "@/components/WeeklyProgress";
import ActivityCalendar from "@/components/ActivityCalendar";
import GoalSetting from "@/components/GoalSetting";
import { getActiveWorkoutGoal, getWorkoutLogs, getWorkouts, initializeStorage, resetAndReinitializeStorage } from "@/utils/storageService";
import { calculateWorkoutStats, calculateWeeklyGoalProgress } from "@/utils/statsUtils";
import { WorkoutStats } from "@/types/workout";
import WorkoutButton from "@/components/WorkoutButton";
import { toast } from "sonner";

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
  
  const handleResetData = () => {
    setIsLoading(true);
    resetAndReinitializeStorage();
    toast.success("Data has been reset");
    loadData();
  };
  
  if (!stats) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  const workouts = getWorkouts();
  
  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Fitness Tracker</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleResetData} disabled={isLoading}>
            Reset Data
          </Button>
          <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatsCard 
          title="Total Workouts"
          value={stats.totalWorkouts}
          icon={<Activity className="h-4 w-4" />}
        />
        <StatsCard 
          title="This Week"
          value={`${weeklyGoal.current}/${weeklyGoal.target || 'N/A'}`}
          icon={<CalendarIcon className="h-4 w-4" />}
          description={weeklyGoal.target ? `${weeklyGoal.percentage}% of goal` : 'No goal set'}
        />
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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <ProgressChart stats={stats} />
          <WeeklyProgress 
            current={weeklyGoal.current} 
            target={weeklyGoal.target} 
            percentage={weeklyGoal.percentage} 
          />
        </div>
        <div className="space-y-6">
          <ActivityCalendar />
          <GoalSetting onGoalUpdate={handleRefresh} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
