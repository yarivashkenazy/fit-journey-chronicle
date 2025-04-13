import { useCallback } from 'react';

const sounds = {
  start: new Audio('/sounds/start.mp3'),
  complete: new Audio('/sounds/complete.mp3'),
  reset: new Audio('/sounds/reset.mp3'),
};

export const useSound = () => {
  const playSound = useCallback((type: keyof typeof sounds) => {
    const sound = sounds[type];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(console.error);
    }
  }, []);

  return { playSound };
}; 