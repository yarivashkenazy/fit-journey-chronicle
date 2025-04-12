
import { useState, useEffect } from "react";
import { Timer as TimerIcon, Pause, Play, SkipForward } from "lucide-react";

interface RestTimerProps {
  defaultRestTime: number; // in seconds
  onComplete: () => void;
}

const RestTimer = ({ defaultRestTime, onComplete }: RestTimerProps) => {
  const [secondsLeft, setSecondsLeft] = useState(defaultRestTime);
  const [isActive, setIsActive] = useState(true); // Start active by default
  
  // Reset timer when the default time changes
  useEffect(() => {
    setSecondsLeft(defaultRestTime);
    setIsActive(true); // Always start active when timer is reset
  }, [defaultRestTime]);
  
  // Timer countdown effect - this is the core of the timer functionality
  useEffect(() => {
    let intervalId: number | undefined;
    
    if (isActive && secondsLeft > 0) {
      // Using window.setInterval to ensure it works correctly in the browser
      intervalId = window.setInterval(() => {
        setSecondsLeft((prevSeconds) => {
          if (prevSeconds <= 1) {
            // Clear the interval and call onComplete when we reach 0
            window.clearInterval(intervalId);
            // Call onComplete in the next tick to ensure state updates first
            setTimeout(() => onComplete(), 0);
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    }
    
    // Clean up interval on component unmount or when timer becomes inactive
    return () => {
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
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
        {isActive ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
      </button>
      <button 
        onClick={handleSkip}
        className="text-xs text-muted-foreground hover:text-foreground"
      >
        <SkipForward className="h-3 w-3" />
      </button>
    </div>
  );
};

export default RestTimer;
