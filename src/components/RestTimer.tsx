
import { useState, useEffect, useRef } from "react";

interface RestTimerProps {
  defaultRestTime: number; // in seconds
  onComplete: () => void;
}

const RestTimer = ({ defaultRestTime, onComplete }: RestTimerProps) => {
  const [secondsLeft, setSecondsLeft] = useState(defaultRestTime);
  const [isActive, setIsActive] = useState(true); // Start active by default
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  
  // Reset timer when the default time changes
  useEffect(() => {
    setSecondsLeft(defaultRestTime);
    setIsActive(true); // Always start active when timer is reset
    startTimeRef.current = Date.now();
  }, [defaultRestTime]);
  
  // Timer countdown effect with accurate timing
  useEffect(() => {
    if (!isActive || secondsLeft <= 0) return;
    
    // Clear any existing timer
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }
    
    startTimeRef.current = Date.now();
    
    // Create a new timer that updates every 100ms for smoother countdown
    timerRef.current = window.setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
      
      if (elapsedSeconds > 0) {
        setSecondsLeft(prevSeconds => {
          const newValue = defaultRestTime - elapsedSeconds;
          
          if (newValue <= 0) {
            // Clear the interval when we reach 0
            if (timerRef.current) {
              window.clearInterval(timerRef.current);
              timerRef.current = null;
            }
            
            // Call onComplete in the next tick
            setTimeout(() => onComplete(), 0);
            return 0;
          }
          
          return newValue;
        });
        
        // Update the start time to prevent drift
        startTimeRef.current = Date.now() - (elapsedSeconds % 1) * 1000;
      }
    }, 100); // Update every 100ms for smoother countdown
    
    // Clean up interval on component unmount or when timer becomes inactive
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isActive, onComplete, secondsLeft, defaultRestTime]);
  
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
