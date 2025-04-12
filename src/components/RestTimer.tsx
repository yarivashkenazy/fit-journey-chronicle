
import { useState, useEffect, useRef } from "react";

interface RestTimerProps {
  defaultRestTime: number; // in seconds
  onComplete: () => void;
}

const RestTimer = ({ defaultRestTime, onComplete }: RestTimerProps) => {
  const [secondsLeft, setSecondsLeft] = useState(defaultRestTime);
  const [isActive, setIsActive] = useState(true); // Start active by default
  const intervalRef = useRef<number | null>(null);
  
  // Reset timer when the default time changes
  useEffect(() => {
    setSecondsLeft(defaultRestTime);
    setIsActive(true); // Always start active when timer is reset
  }, [defaultRestTime]);
  
  // Timer countdown effect
  useEffect(() => {
    if (!isActive || secondsLeft <= 0) return;
    
    // Clear any existing timer
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }
    
    const startTime = Date.now();
    const initialSeconds = secondsLeft;
    
    // Create a new timer that updates every second
    intervalRef.current = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const newValue = initialSeconds - elapsed;
      
      if (newValue <= 0) {
        // Clear the interval when we reach 0
        if (intervalRef.current) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        
        setSecondsLeft(0);
        // Call onComplete in the next tick
        setTimeout(() => onComplete(), 0);
      } else {
        setSecondsLeft(newValue);
      }
    }, 1000); // Update every second
    
    // Clean up interval on component unmount or when timer becomes inactive
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, onComplete, defaultRestTime]);
  
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
