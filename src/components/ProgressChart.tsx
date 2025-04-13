import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkoutStats } from "@/types/workout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProgressChartProps {
  stats: WorkoutStats;
  exerciseId?: string;
}

const ProgressChart = ({ stats }: ProgressChartProps) => {
  const isMobile = useIsMobile();
  
  if (!stats.exerciseProgress || stats.exerciseProgress.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Weight Progress (28-day window)</CardTitle>
        </CardHeader>
        <CardContent className="h-[calc(100%-60px)] flex items-center justify-center">
          <p className="text-muted-foreground">No exercise data available</p>
        </CardContent>
      </Card>
    );
  }
  
  const benchPressIndex = stats.exerciseProgress.findIndex(ex => ex.exerciseName === "Bench Press");
  
  const defaultExerciseId = benchPressIndex !== -1 
    ? stats.exerciseProgress[benchPressIndex].exerciseId 
    : stats.exerciseProgress[0]?.exerciseId;
  
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | undefined>(defaultExerciseId);
  
  useEffect(() => {
    const benchPressIndex = stats.exerciseProgress.findIndex(ex => ex.exerciseName === "Bench Press");
    const defaultExerciseId = benchPressIndex !== -1 
      ? stats.exerciseProgress[benchPressIndex].exerciseId 
      : stats.exerciseProgress[0]?.exerciseId;
    
    setSelectedExerciseId(defaultExerciseId);
  }, [stats]);

  const exerciseData = selectedExerciseId
    ? stats.exerciseProgress.find(ex => ex.exerciseId === selectedExerciseId)
    : stats.exerciseProgress[0];

  if (!exerciseData || exerciseData.data.length < 2) {
    return (
      <Card className="h-full">
        <CardHeader className={`flex ${isMobile ? 'flex-col gap-2' : 'flex-row'} items-center justify-between pb-2`}>
          <CardTitle className="text-lg">Weight Progress (28-day window)</CardTitle>
          <ExerciseSelector 
            exercises={stats.exerciseProgress} 
            selectedExerciseId={selectedExerciseId}
            onSelectExercise={setSelectedExerciseId} 
          />
        </CardHeader>
        <CardContent className="h-[calc(100%-60px)] flex items-center justify-center">
          <p className="text-muted-foreground">Not enough data to display progress</p>
        </CardContent>
      </Card>
    );
  }

  const sortedData = [...exerciseData.data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const last28Days = sortedData.slice(-28);

  const chartData = last28Days.map((point, index, array) => {
    const startIndex = Math.max(0, index - 6);
    const windowPoints = array.slice(startIndex, index + 1);
    
    const sum = windowPoints.reduce((acc, p) => acc + p.maxWeight, 0);
    const average = windowPoints.length > 0 ? sum / windowPoints.length : 0;
    
    return {
      date: new Date(point.date).toLocaleDateString(undefined, { 
        month: isMobile ? 'numeric' : 'short', 
        day: 'numeric' 
      }),
      weight: point.maxWeight,
      average: Number(average.toFixed(1))
    };
  });

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className={`flex ${isMobile ? 'flex-col gap-2' : 'flex-row'} items-center justify-between pb-2`}>
        <CardTitle className="text-lg">Weight Progress (28-day window)</CardTitle>
        <ExerciseSelector 
          exercises={stats.exerciseProgress} 
          selectedExerciseId={selectedExerciseId}
          onSelectExercise={setSelectedExerciseId} 
        />
      </CardHeader>
      <CardContent className="h-[calc(100%-60px)] overflow-hidden">
        <div className="h-[calc(100%-40px)] overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ 
                top: 10, 
                right: isMobile ? 5 : 10, 
                left: isMobile ? -15 : 0, 
                bottom: 10 
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: isMobile ? 8 : 10 }} 
                interval={isMobile ? 1 : 0}
                angle={isMobile ? -45 : 0}
                textAnchor={isMobile ? "end" : "middle"}
                height={isMobile ? 50 : 30}
              />
              <YAxis 
                tick={{ fontSize: isMobile ? 8 : 10 }} 
                domain={['auto', 'auto']} 
                width={isMobile ? 25 : 35}
              />
              <Tooltip 
                labelFormatter={(label) => `Date: ${label}`}
                formatter={(value, name) => {
                  return [value, name === 'average' ? '7-day Average' : 'Weight'];
                }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ r: isMobile ? 2 : 3 }}
                activeDot={{ r: isMobile ? 4 : 5 }}
                name="Weight"
              />
              <Line
                type="monotone"
                dataKey="average"
                stroke="#10B981"
                strokeWidth={2}
                dot={false}
                strokeDasharray="3 3"
                name="7-day Average"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex items-center justify-center mt-3 gap-4 flex-wrap">
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-fitness-primary mr-2 rounded-sm"></span>
            <span className="text-xs">Weight (lbs)</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-fitness-secondary mr-2 rounded-sm"></span>
            <span className="text-xs">7-day Average</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface ExerciseSelectorProps {
  exercises: {
    exerciseId: string;
    exerciseName: string;
    data: any[];
  }[];
  selectedExerciseId?: string;
  onSelectExercise: (exerciseId: string) => void;
}

const ExerciseSelector = ({ exercises, selectedExerciseId, onSelectExercise }: ExerciseSelectorProps) => {
  const isMobile = useIsMobile();
  
  if (!exercises || exercises.length === 0) {
    return null;
  }

  return (
    <Select
      value={selectedExerciseId}
      onValueChange={onSelectExercise}
    >
      <SelectTrigger className={`${isMobile ? 'w-full' : 'w-[180px]'}`}>
        <SelectValue placeholder="Select Exercise" />
      </SelectTrigger>
      <SelectContent>
        {exercises.map((exercise) => (
          <SelectItem key={exercise.exerciseId} value={exercise.exerciseId}>
            {exercise.exerciseName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ProgressChart;
