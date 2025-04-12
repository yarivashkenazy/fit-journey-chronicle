
import { useState, useEffect, useRef } from "react";
import { Pause, Play, SkipForward } from "lucide-react";
import { Progress } from "@/components/ui/progress";

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
          const newValue = prevSeconds - 1;
          console.log(`Timer countdown: ${newValue} seconds left`);
          
          if (newValue <= 0) {
            // Clear the interval and call onComplete when we reach 0
            window.clearInterval(intervalId);
            // Call onComplete in the next tick to ensure state updates first
            setTimeout(() => onComplete(), 0);
            return 0;
          }
          return newValue;
        });
      }, 1000); // Update every 1000ms (1 second) exactly
      
      console.log(`Timer started with interval ID: ${intervalId}`);
    }
    
    // Clean up interval on component unmount or when timer becomes inactive
    return () => {
      if (intervalId !== undefined) {
        console.log(`Clearing interval: ${intervalId}`);
        window.clearInterval(intervalId);
      }
    };
  }, [isActive, onComplete, secondsLeft]);
  
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
  
  // Calculate progress percentage for visual indicator
  const progressPercentage = (secondsLeft / defaultRestTime) * 100;
  
  return (
    <div className="flex flex-col gap-1 text-xs">
      <div className="flex items-center gap-2">
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
      
      {/* Visual countdown indicator using Progress component with no transition */}
      <Progress 
        value={progressPercentage} 
        className="h-1.5 w-full bg-gray-200" 
        indicatorClassName="bg-orange-500 !transition-none" 
      />
    </div>
  );
};

export default RestTimer;
