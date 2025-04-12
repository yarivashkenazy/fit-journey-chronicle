
import { useState, useEffect } from "react";
import { Timer as TimerIcon } from "lucide-react";

interface RestTimerProps {
  defaultRestTime: number; // in seconds
  onComplete: () => void;
}

const RestTimer = ({ defaultRestTime, onComplete }: RestTimerProps) => {
  const [secondsLeft, setSecondsLeft] = useState(defaultRestTime);
  const [isActive, setIsActive] = useState(true);
  
  // Reset seconds when default time changes
  useEffect(() => {
    setSecondsLeft(defaultRestTime);
    setIsActive(true);
  }, [defaultRestTime]);
  
  // Timer effect
  useEffect(() => {
    let interval: number | undefined;
    
    if (isActive && secondsLeft > 0) {
      interval = window.setInterval(() => {
        setSecondsLeft((prev) => {
          const newValue = prev - 1;
          if (newValue <= 0) {
            if (interval) clearInterval(interval);
            setIsActive(false);
            onComplete();
            return 0;
          }
          return newValue;
        });
      }, 1000) as unknown as number;
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, onComplete]);
  
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
  
  const handlePauseResume = () => {
    setIsActive(!isActive);
  };
  
  return (
    <div className="flex items-center gap-1 text-xs">
      <div className="flex items-center">
        <TimerIcon className="h-3 w-3 text-fitness-secondary mr-1" />
        <span className="font-medium">{formatTime()}</span>
      </div>
      <button 
        onClick={handlePauseResume}
        className="text-xs text-muted-foreground hover:text-foreground"
      >
        {isActive ? "•" : "▶"}
      </button>
      <button 
        onClick={handleSkip}
        className="text-xs text-muted-foreground hover:text-foreground"
      >
        ⏭
      </button>
    </div>
  );
};

export default RestTimer;
