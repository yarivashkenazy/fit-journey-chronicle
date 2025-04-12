
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkoutStats } from "@/types/workout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProgressChartProps {
  stats: WorkoutStats;
  exerciseId?: string;
}

const ProgressChart = ({ stats }: ProgressChartProps) => {
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | undefined>(
    stats.exerciseProgress[0]?.exerciseId
  );

  // Find the exercise data based on selection
  const exerciseData = selectedExerciseId
    ? stats.exerciseProgress.find(ex => ex.exerciseId === selectedExerciseId)
    : stats.exerciseProgress[0];

  if (!exerciseData || exerciseData.data.length < 2) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Weight Progress (28-day window)</CardTitle>
          <ExerciseSelector 
            exercises={stats.exerciseProgress} 
            selectedExerciseId={selectedExerciseId}
            onSelectExercise={setSelectedExerciseId} 
          />
        </CardHeader>
        <CardContent className="h-60 flex items-center justify-center">
          <p className="text-muted-foreground">Not enough data to display progress</p>
        </CardContent>
      </Card>
    );
  }

  // Get the last 28 days of data (or all if less than 28 days)
  const sortedData = [...exerciseData.data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const last28Days = sortedData.slice(-28);

  // Calculate 7-day moving average
  const chartData = last28Days.map((point, index, array) => {
    // Get previous 7 days (or less if at the beginning)
    const startIndex = Math.max(0, index - 6);
    const windowPoints = array.slice(startIndex, index + 1);
    
    // Calculate average
    const sum = windowPoints.reduce((acc, p) => acc + p.maxWeight, 0);
    const average = windowPoints.length > 0 ? sum / windowPoints.length : 0;
    
    return {
      date: new Date(point.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      weight: point.maxWeight,
      average: Number(average.toFixed(1)) // Round to 1 decimal place
    };
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Weight Progress (28-day window)</CardTitle>
        <ExerciseSelector 
          exercises={stats.exerciseProgress} 
          selectedExerciseId={selectedExerciseId}
          onSelectExercise={setSelectedExerciseId} 
        />
      </CardHeader>
      <CardContent>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
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
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
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
  if (!exercises || exercises.length === 0) {
    return null;
  }

  return (
    <Select
      value={selectedExerciseId}
      onValueChange={onSelectExercise}
    >
      <SelectTrigger className="w-[180px]">
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
