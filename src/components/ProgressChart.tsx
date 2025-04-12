
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkoutStats } from "@/types/workout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ProgressChartProps {
  stats: WorkoutStats;
  exerciseId?: string;
}

const ProgressChart = ({ stats, exerciseId }: ProgressChartProps) => {
  // Find the exercise data or use the first one if not specified
  const exerciseData = exerciseId
    ? stats.exerciseProgress.find(ex => ex.exerciseId === exerciseId)
    : stats.exerciseProgress[0];

  if (!exerciseData || exerciseData.data.length < 2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Weight Progress</CardTitle>
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
      <CardHeader>
        <CardTitle className="text-lg">{exerciseData.exerciseName} Progress</CardTitle>
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

export default ProgressChart;
