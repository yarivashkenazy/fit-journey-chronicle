import { Achievement } from "@/types/achievements";
import { HapticPattern, SoundEffect } from "@/utils/feedbackUtils";
import { motion } from "framer-motion";

interface AchievementCardProps {
  achievement: Achievement;
  onClick?: () => void;
}

export const AchievementCard = ({ achievement, onClick }: AchievementCardProps) => {
  const handleClick = () => {
    HapticPattern.light();
    SoundEffect.click();
    onClick?.();
  };

  return (
    <motion.div
      className="achievement-card"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
    >
      <div className="achievement-badge">
        <span className="text-2xl">{achievement.icon}</span>
      </div>
      
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-white">{achievement.name}</h3>
        <p className="text-sm text-gray-400">{achievement.description}</p>
        
        <div className="mt-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Progress</span>
            <span className="text-white">
              {achievement.progress}/{achievement.target}
            </span>
          </div>
          
          <div className="mt-1 h-2 w-full rounded-full bg-gray-700">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
      
      {achievement.unlocked && (
        <div className="ml-4">
          <span className="text-sm font-medium text-green-400">Unlocked!</span>
        </div>
      )}
    </motion.div>
  );
}; 