import { useCallback } from 'react';

const hapticPatterns = {
  light: 50,
  medium: 100,
  heavy: 200,
  success: [50, 50, 50],
  error: [100, 50, 100],
};

export const useHaptic = () => {
  const triggerHaptic = useCallback((type: keyof typeof hapticPatterns) => {
    if ('vibrate' in navigator) {
      const pattern = hapticPatterns[type];
      navigator.vibrate(pattern);
    }
  }, []);

  return { triggerHaptic };
}; 