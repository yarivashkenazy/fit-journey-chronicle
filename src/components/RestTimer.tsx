
import { useState, useEffect, useRef } from "react";

interface RestTimerProps {
  defaultRestTime: number; // in seconds
  onComplete: () => void;
}

const RestTimer = ({ defaultRestTime, onComplete }: RestTimerProps) => {
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const intervalRef = useRef<number | null>(null);
  
  // Initialize and clean up the timer
  useEffect(() => {
    console.log("Setting up timer with default time:", defaultRestTime);
    
    // Clear any existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Reset state
    setSecondsElapsed(0);
    
    // Start the timer
    intervalRef.current = window.setInterval(() => {
      setSecondsElapsed((prev) => {
        const nextValue = prev + 1;
        console.log("Timer ticking:", nextValue);
        
        // Check if timer is complete
        if (nextValue >= defaultRestTime) {
          console.log("Timer complete, calling onComplete callback");
          // Clean up the interval
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          
          // Call completion callback
          onComplete();
          return defaultRestTime;
        }
        
        return nextValue;
      });
    }, 1000);
    
    // Clean up on unmount
    return () => {
      console.log("Cleaning up timer");
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [defaultRestTime, onComplete]);
  
  // Display the timer
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-orange-500 font-medium animate-pulse">
        {secondsElapsed}s / {defaultRestTime}s
      </span>
    </div>
  );
};

export default RestTimer;
