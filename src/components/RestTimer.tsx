
import { useState, useEffect } from "react";
import { Timer as TimerIcon } from "lucide-react";

interface RestTimerProps {
  defaultRestTime: number; // in seconds
  onComplete: () => void;
}

const RestTimer = ({ defaultRestTime, onComplete }: RestTimerProps) => {
  const [secondsLeft, setSecondsLeft] = useState(defaultRestTime);
  const [isActive, setIsActive] = useState(true);
  
  // Reset timer when the default time changes
  useEffect(() => {
    setSecondsLeft(defaultRestTime);
    setIsActive(true);
  }, [defaultRestTime]);
  
  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prevSeconds => {
          if (prevSeconds <= 1) {
            if (interval) clearInterval(interval);
            setIsActive(false);
            onComplete();
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      // Ensure we call onComplete if seconds reach 0
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
  
  const handlePauseResume = () => {
    setIsActive(!isActive);
  };
  
  return (
    <div className="flex items-center gap-1 text-xs">
      <div className="flex items-center">
        <TimerIcon className="h-3 w-3 text-orange-500 mr-1" />
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
