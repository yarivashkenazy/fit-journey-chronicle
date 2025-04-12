
import { useState, useEffect, useRef } from "react";

interface RestTimerProps {
  defaultRestTime: number; // in seconds
  onComplete: () => void;
}

const RestTimer = ({ defaultRestTime, onComplete }: RestTimerProps) => {
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isActive, setIsActive] = useState(true); // Start active by default
  const intervalRef = useRef<number | null>(null);
  
  // Reset timer when the default time changes
  useEffect(() => {
    // Clear any existing interval when defaultRestTime changes
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setSecondsElapsed(0);
    setIsActive(true); // Always start active when timer is reset
    
    console.log("RestTimer reset with default time:", defaultRestTime);
  }, [defaultRestTime]);
  
  // Timer count up effect
  useEffect(() => {
    console.log("Timer effect running, isActive:", isActive, "secondsElapsed:", secondsElapsed);
    
    // Clean up existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Only start a new interval if the timer is active and we haven't reached the end
    if (isActive && secondsElapsed < defaultRestTime) {
      console.log("Starting interval");
      
      // Using window.setInterval to make sure we get back a number
      intervalRef.current = window.setInterval(() => {
        console.log("Interval tick");
        setSecondsElapsed(prev => {
          const nextValue = prev + 1;
          console.log("Updating seconds elapsed from", prev, "to", nextValue);
          
          if (nextValue >= defaultRestTime) {
            console.log("Timer completed");
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
      console.log("Cleaning up interval");
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, onComplete, defaultRestTime]);
  
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-orange-500 font-medium animate-pulse">
        {secondsElapsed}s / {defaultRestTime}s
      </span>
    </div>
  );
};

export default RestTimer;
