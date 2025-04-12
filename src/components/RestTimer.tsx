
import { useState, useEffect } from "react";
import { Timer as TimerIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface RestTimerProps {
  defaultRestTime: number; // in seconds
  onComplete: () => void;
}

const RestTimer = ({ defaultRestTime, onComplete }: RestTimerProps) => {
  const [secondsLeft, setSecondsLeft] = useState(defaultRestTime);
  const [isActive, setIsActive] = useState(true);
  
  // Calculate progress percentage
  const progress = ((defaultRestTime - secondsLeft) / defaultRestTime) * 100;
  
  useEffect(() => {
    let interval: number | undefined;
    
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000) as unknown as number;
    } else if (secondsLeft === 0) {
      setIsActive(false);
      onComplete();
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft, onComplete]);
  
  const formatTime = () => {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const handleSkip = () => {
    setSecondsLeft(0);
    setIsActive(false);
    onComplete();
  };
  
  return (
    <div className="flex flex-col gap-2 p-2 border border-fitness-secondary/30 rounded-md bg-fitness-secondary/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <TimerIcon className="h-4 w-4 text-fitness-secondary" />
          <span className="font-medium">{formatTime()}</span>
        </div>
        <button 
          onClick={handleSkip}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Skip
        </button>
      </div>
      <Progress value={progress} className="h-1.5" />
    </div>
  );
};

export default RestTimer;
