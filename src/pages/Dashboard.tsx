import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Activity, Award, CalendarIcon, RefreshCw } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import ProgressChart from "@/components/ProgressChart";
import WeeklyProgress from "@/components/WeeklyProgress";
import ActivityCalendar from "@/components/ActivityCalendar";
import GoalSetting from "@/components/GoalSetting";
import { getActiveWorkoutGoal, getWorkoutLogs, getWorkouts, initializeStorage } from "@/utils/storageService";
import { calculateCurrentStreak, calculateWeeklyGoalProgress, calculateWorkoutStats } from "@/utils/statsUtils";
import { WorkoutStats } from "@/types/workout";
import WorkoutButton from "@/components/WorkoutButton";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<WorkoutStats | null>(null);
  const [weeklyGoal, setWeeklyGoal] = useState({ current: 0, target: 3, percentage: 0 });
  const [currentStreak, setCurrentStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const loadData = () => {
    setIsLoading(true);
    
    // Initialize local storage with sample data if empty
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
    }
    
    // Calculate current streak
    const streak = calculateCurrentStreak(logs);
    setCurrentStreak(streak);
    
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
  
  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Fitness Tracker</h1>
        <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatsCard 
          title="Total Workouts"
          value={stats.totalWorkouts}
          icon={<Activity className="h-4 w-4" />}
        />
        <StatsCard 
          title="This Week"
          value={`${weeklyGoal.current}/${weeklyGoal.target}`}
          icon={<CalendarIcon className="h-4 w-4" />}
          description={`${weeklyGoal.percentage}% of goal`}
        />
        <StatsCard 
          title="Current Streak"
          value={`${currentStreak} day${currentStreak !== 1 ? 's' : ''}`}
          icon={<Award className="h-4 w-4" />}
          description={currentStreak > 0 ? "Keep it up!" : "Start a streak today"}
        />
      </div>
      
      {/* Start Workout Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Start Workout</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {getWorkouts().map((workout) => (
            <WorkoutButton
              key={workout.id}
              workout={workout}
              onClick={() => handleStartWorkout(workout.id)}
            />
          ))}
        </div>
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
