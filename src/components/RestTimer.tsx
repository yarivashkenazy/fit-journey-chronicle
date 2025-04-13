import { useState, useEffect, useRef } from "react";

interface RestTimerProps {
  defaultRestTime: number; // in seconds
  onComplete: () => void;
}

const RestTimer = ({ defaultRestTime, onComplete }: RestTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState(defaultRestTime);
  const intervalRef = useRef<number | null>(null);
  
  useEffect(() => {
    // Reset the timer
    setTimeRemaining(defaultRestTime);
    
    // Clear any existing interval
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }
    
    // Start the countdown timer
    intervalRef.current = window.setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          // Clean up interval when done
          if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
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
  }, [defaultRestTime]); // Only depend on defaultRestTime

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-orange-500 animate-pulse">
      {formatTime(timeRemaining)}
    </div>
  );
};

export default RestTimer;
