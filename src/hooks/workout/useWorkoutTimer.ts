
import { useState, useEffect } from "react";

export const useWorkoutTimer = () => {
  const [startTime] = useState<Date>(new Date());
  const [elapsedTime, setElapsedTime] = useState<string>("00:00");
  
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - startTime.getTime();
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setElapsedTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [startTime]);

  return {
    startTime,
    elapsedTime
  };
};
