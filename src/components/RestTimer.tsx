
import { useState, useEffect, useRef } from "react";

interface RestTimerProps {
  defaultRestTime: number; // in seconds
  onComplete: () => void;
}

const RestTimer = ({ defaultRestTime, onComplete }: RestTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState(defaultRestTime);
  const intervalRef = useRef<number | null>(null);
  
  useEffect(() => {
    // Clear any existing interval first to prevent multiple timers
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Reset the timer when defaultRestTime changes
    setTimeRemaining(defaultRestTime);
    
    // Start the countdown timer
    intervalRef.current = window.setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          // Clean up interval when done
          if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          
          // Call completion callback
          onComplete();
          return 0;
        }
        
        return prevTime - 1;
      });
    }, 1000);
    
    // Clean up on unmount
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [defaultRestTime, onComplete]);
  
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-orange-500 font-medium animate-pulse">
        {timeRemaining}s remaining
      </span>
    </div>
  );
};

export default RestTimer;
