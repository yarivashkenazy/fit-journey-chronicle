
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
          <CardTitle className="text-lg">Weight Progress</CardTitle>
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

  // Format the data for the chart
  const chartData = exerciseData.data.map(point => ({
    date: new Date(point.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    weight: point.maxWeight
  }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Weight Progress</CardTitle>
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
              <Tooltip />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
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
