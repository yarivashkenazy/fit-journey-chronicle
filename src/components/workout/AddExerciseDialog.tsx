
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AddExerciseDialogProps {
  onAddExercise: (exercise: {
    name: string;
    sets: number;
    reps: string;
    rest: number;
    notes: string;
  }) => void;
}

const AddExerciseDialog = ({ onAddExercise }: AddExerciseDialogProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newExercise, setNewExercise] = useState<{
    name: string;
    sets: number;
    reps: string;
    rest: number;
    notes: string;
  }>({
    name: "",
    sets: 3,
    reps: "8-12",
    rest: 60,
    notes: ""
  });

  const handleAddExercise = () => {
    onAddExercise(newExercise);
    
    // Reset form and close dialog
    setNewExercise({
      name: "",
      sets: 3,
      reps: "8-12",
      rest: 60,
      notes: ""
    });
    setDialogOpen(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add New Exercise
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Exercise</DialogTitle>
          <DialogDescription>
            Add a custom exercise to your workout routine.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="exercise-name">Exercise Name</Label>
            <Input 
              id="exercise-name" 
              value={newExercise.name}
              onChange={(e) => setNewExercise({...newExercise, name: e.target.value})}
              placeholder="e.g. Dumbbell Curls"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="default-sets">Default Sets</Label>
              <Input 
                id="default-sets"
                type="number" 
                value={newExercise.sets}
                onChange={(e) => setNewExercise({...newExercise, sets: Number(e.target.value)})}
                min={1}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="default-reps">Target Reps</Label>
              <Input 
                id="default-reps" 
                value={newExercise.reps}
                onChange={(e) => setNewExercise({...newExercise, reps: e.target.value})}
                placeholder="e.g. 8-12"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="rest-period">Rest Period (seconds)</Label>
            <Input 
              id="rest-period"
              type="number" 
              value={newExercise.rest}
              onChange={(e) => setNewExercise({...newExercise, rest: Number(e.target.value)})}
              min={15}
              step={15}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="exercise-notes">Notes</Label>
            <Textarea 
              id="exercise-notes" 
              value={newExercise.notes}
              onChange={(e) => setNewExercise({...newExercise, notes: e.target.value})}
              placeholder="Add any notes or form cues here"
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddExercise} disabled={!newExercise.name}>
            Add Exercise
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddExerciseDialog;
