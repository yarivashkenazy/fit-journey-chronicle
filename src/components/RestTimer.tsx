import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { HapticPattern, SoundEffect } from "@/utils/feedbackUtils";

interface RestTimerProps {
  defaultRestTime: number;
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
          HapticPattern.success();
          SoundEffect.complete();
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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progress = (timeRemaining / defaultRestTime) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative flex items-center justify-center"
    >
      <div className="relative w-12 h-12">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <motion.circle
            className="text-muted-foreground/20"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="40"
            cx="50"
            cy="50"
          />
          <motion.circle
            className="text-orange-500"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="40"
            cx="50"
            cy="50"
            strokeDasharray={251.2}
            strokeDashoffset={251.2 - (progress * 251.2) / 100}
            initial={{ strokeDashoffset: 251.2 }}
            animate={{ strokeDashoffset: 251.2 - (progress * 251.2) / 100 }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </svg>
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-sm font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {formatTime(timeRemaining)}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RestTimer;
