
import { useState, useEffect, useRef } from "react";

interface RestTimerProps {
  defaultRestTime: number; // in seconds
  onComplete: () => void;
}

const RestTimer = ({ defaultRestTime, onComplete }: RestTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState(defaultRestTime);
  const intervalRef = useRef<number | null>(null);
  
  useEffect(() => {
    console.log("Setting up timer with default time:", defaultRestTime);
    
    // Reset timeRemaining when defaultRestTime changes
    setTimeRemaining(defaultRestTime);
    
    // Clear any existing interval first
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Start the countdown timer
    intervalRef.current = window.setInterval(() => {
      setTimeRemaining((prevTime) => {
        const newTime = prevTime - 1;
        console.log("Timer ticking, time remaining:", newTime);
        
        if (newTime <= 0) {
          console.log("Timer complete, calling onComplete callback");
          // Clean up interval when done
          if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          
          // Call completion callback
          onComplete();
          return 0;
        }
        
        return newTime;
      });
    }, 1000);
    
    // Clean up on unmount
    return () => {
      console.log("Cleaning up timer");
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [defaultRestTime, onComplete]);
  
  // Calculate progress for display
  const secondsElapsed = defaultRestTime - timeRemaining;
  
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-orange-500 font-medium animate-pulse">
        {secondsElapsed}s / {defaultRestTime}s
      </span>
    </div>
  );
};

export default RestTimer;
