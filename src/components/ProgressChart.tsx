
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkoutStats } from "@/types/workout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react";

interface ProgressChartProps {
  stats: WorkoutStats;
  exerciseId?: string;
}

const ProgressChart = ({ stats }: ProgressChartProps) => {
  // Find Bench Press exercise index if it exists
  const benchPressIndex = stats.exerciseProgress.findIndex(ex => ex.exerciseName === "Bench Press");
  
  // Set default selected exercise to Bench Press if available, otherwise use first exercise
  const defaultExerciseId = benchPressIndex !== -1 
    ? stats.exerciseProgress[benchPressIndex].exerciseId 
    : stats.exerciseProgress[0]?.exerciseId;
  
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | undefined>(defaultExerciseId);
  
  // Update selected exercise when stats change
  useEffect(() => {
    const benchPressIndex = stats.exerciseProgress.findIndex(ex => ex.exerciseName === "Bench Press");
    const defaultExerciseId = benchPressIndex !== -1 
      ? stats.exerciseProgress[benchPressIndex].exerciseId 
      : stats.exerciseProgress[0]?.exerciseId;
    
    setSelectedExerciseId(defaultExerciseId);
  }, [stats]);

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

  // Calculate insights (4 key data points)
  const calculateInsights = () => {
    if (last28Days.length < 2) return null;
    
    const startWeight = last28Days[0].maxWeight;
    const currentWeight = last28Days[last28Days.length - 1].maxWeight;
    const weightChange = currentWeight - startWeight;
    const percentChange = ((weightChange / startWeight) * 100).toFixed(1);
    
    // Calculate peak weight
    const peakWeight = Math.max(...last28Days.map(d => d.maxWeight));
    const peakDate = last28Days.find(d => d.maxWeight === peakWeight)?.date;
    const formattedPeakDate = peakDate ? new Date(peakDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '';
    
    // Calculate weekly rate of change
    const weightsByWeek: number[] = [];
    const weeksCount = Math.min(4, Math.floor(last28Days.length / 7));
    
    for (let i = 0; i < weeksCount; i++) {
      const weekData = last28Days.slice(i * 7, (i + 1) * 7);
      if (weekData.length > 0) {
        const weekAvg = weekData.reduce((sum, d) => sum + d.maxWeight, 0) / weekData.length;
        weightsByWeek.push(Number(weekAvg.toFixed(1)));
      }
    }
    
    // Calculate weekly change rate (if we have at least 2 weeks of data)
    const weeklyChangeRate = weightsByWeek.length >= 2 
      ? ((weightsByWeek[0] - weightsByWeek[weightsByWeek.length - 1]) / (weightsByWeek.length - 1)).toFixed(1)
      : "N/A";
    
    return {
      startWeight,
      currentWeight,
      weightChange,
      percentChange,
      peakWeight,
      formattedPeakDate,
      weeklyChangeRate: weeklyChangeRate === "N/A" ? weeklyChangeRate : `${weeklyChangeRate} lbs/week`
    };
  };
  
  const insights = calculateInsights();

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
        <div className="h-60 mb-4">
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
        
        {insights && (
          <div className="mt-4 pt-2 border-t border-border">
            <h4 className="text-sm font-medium mb-2">Key Insights</h4>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="py-1 font-medium text-xs">Overall Change</TableCell>
                  <TableCell className="py-1 text-xs flex items-center justify-end">
                    <span className="mr-1">{insights.weightChange > 0 ? '+' : ''}{insights.weightChange} lbs ({insights.percentChange}%)</span>
                    {insights.weightChange > 0 ? (
                      <ArrowUpIcon className="h-3 w-3 text-green-500" />
                    ) : insights.weightChange < 0 ? (
                      <ArrowDownIcon className="h-3 w-3 text-red-500" />
                    ) : (
                      <MinusIcon className="h-3 w-3 text-yellow-500" />
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="py-1 font-medium text-xs">Weekly Rate</TableCell>
                  <TableCell className="py-1 text-xs text-right">{insights.weeklyChangeRate}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="py-1 font-medium text-xs">Peak Weight</TableCell>
                  <TableCell className="py-1 text-xs text-right">{insights.peakWeight} lbs on {insights.formattedPeakDate}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="py-1 font-medium text-xs">Current / Start</TableCell>
                  <TableCell className="py-1 text-xs text-right">{insights.currentWeight} lbs / {insights.startWeight} lbs</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
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
