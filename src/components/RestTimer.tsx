import { useState, useEffect, useRef } from "react";
import { Pause, Play, SkipForward } from "lucide-react";

interface RestTimerProps {
  defaultRestTime: number; // in seconds
  onComplete: () => void;
}

const RestTimer = ({ defaultRestTime, onComplete }: RestTimerProps) => {
  const [secondsLeft, setSecondsLeft] = useState(defaultRestTime);
  const [isActive, setIsActive] = useState(true); // Start active by default
  
  // Reset timer when the default time changes
  useEffect(() => {
    setSecondsLeft(defaultRestTime);
    setIsActive(true); // Always start active when timer is reset
  }, [defaultRestTime]);
  
  // Timer countdown effect - this is the core of the timer functionality
  useEffect(() => {
    let intervalId: number | undefined;
    
    if (isActive && secondsLeft > 0) {
      // Using window.setInterval to ensure it works correctly in the browser
      intervalId = window.setInterval(() => {
        setSecondsLeft((prevSeconds) => {
          const newValue = prevSeconds - 1;
          console.log(`Timer countdown: ${newValue} seconds left`);
          
          if (newValue <= 0) {
            // Clear the interval and call onComplete when we reach 0
            window.clearInterval(intervalId);
            // Call onComplete in the next tick to ensure state updates first
            setTimeout(() => onComplete(), 0);
            return 0;
          }
          return newValue;
        });
      }, 1000); // Update every 1000ms (1 second) exactly
      
      console.log(`Timer started with interval ID: ${intervalId}`);
    }
    
    // Clean up interval on component unmount or when timer becomes inactive
    return () => {
      if (intervalId !== undefined) {
        console.log(`Clearing interval: ${intervalId}`);
        window.clearInterval(intervalId);
      }
    };
  }, [isActive, onComplete, secondsLeft]);
  
  const formatTime = () => {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const handleSkip = () => {
    setSecondsLeft(0);
    setIsActive(false);
    onComplete();
  };
  
  const handlePauseResume = () => {
    setIsActive(!isActive);
  };
  
  // Calculate progress percentage for visual indicator
  const progressPercentage = (secondsLeft / defaultRestTime) * 100;
  
  // Return null - completely removing the visual component while keeping timer functionality
  return null;
};

export default RestTimer;
