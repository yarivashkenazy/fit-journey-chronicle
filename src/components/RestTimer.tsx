
import { useState, useEffect, useRef } from "react";

interface RestTimerProps {
  defaultRestTime: number; // in seconds
  onComplete: () => void;
}

const RestTimer = ({ defaultRestTime, onComplete }: RestTimerProps) => {
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isActive, setIsActive] = useState(true); // Start active by default
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // Reset timer when the default time changes
  useEffect(() => {
    setSecondsElapsed(0);
    setIsActive(true); // Always start active when timer is reset
  }, [defaultRestTime]);
  
  // Timer count up effect
  useEffect(() => {
    // Clean up existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Only start a new interval if the timer is active and we haven't reached the end
    if (isActive && secondsElapsed < defaultRestTime) {
      intervalRef.current = setInterval(() => {
        setSecondsElapsed((prev) => {
          const nextValue = prev + 1;
          if (nextValue >= defaultRestTime) {
            // Clear interval when reaching the end
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            
            // Call onComplete callback
            onComplete();
            return defaultRestTime;
          }
          return nextValue;
        });
      }, 1000);
    }
    
    // Clean up on unmount or when dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, onComplete, secondsElapsed, defaultRestTime]);
  
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-orange-500 font-medium animate-pulse">
        {secondsElapsed}s / {defaultRestTime}s
      </span>
    </div>
  );
};

export default RestTimer;
