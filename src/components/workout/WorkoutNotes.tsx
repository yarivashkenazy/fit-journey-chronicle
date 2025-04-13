
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface WorkoutNotesProps {
  notes: string;
  onChange: (notes: string) => void;
}

const WorkoutNotes = ({ notes, onChange }: WorkoutNotesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Add notes about your workout here..."
          value={notes}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
        />
      </CardContent>
    </Card>
  );
};

export default WorkoutNotes;
