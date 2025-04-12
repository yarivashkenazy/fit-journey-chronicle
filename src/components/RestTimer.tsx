
import { useState, useEffect, useRef } from "react";

interface RestTimerProps {
  defaultRestTime: number; // in seconds
  onComplete: () => void;
}

const RestTimer = ({ defaultRestTime, onComplete }: RestTimerProps) => {
  const [secondsLeft, setSecondsLeft] = useState(defaultRestTime);
  const [isActive, setIsActive] = useState(true); // Start active by default
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // Reset timer when the default time changes
  useEffect(() => {
    setSecondsLeft(defaultRestTime);
    setIsActive(true); // Always start active when timer is reset
  }, [defaultRestTime]);
  
  // Timer countdown effect
  useEffect(() => {
    // Clean up existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Only start a new interval if the timer is active and there's time left
    if (isActive && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            // Clear interval when reaching zero
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            
            // Call onComplete callback
            onComplete();
            return 0;
          }
          return prev - 1;
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
  }, [isActive, onComplete, secondsLeft]);
  
  const formatTime = () => {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-orange-500 font-medium animate-pulse">
        {formatTime()}
      </span>
    </div>
  );
};

export default RestTimer;
