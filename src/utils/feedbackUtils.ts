// Haptic feedback patterns
export const HapticPattern = {
  light: () => {
    if (window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
  },
  medium: () => {
    if (window.navigator.vibrate) {
      window.navigator.vibrate(100);
    }
  },
  heavy: () => {
    if (window.navigator.vibrate) {
      window.navigator.vibrate(200);
    }
  },
  success: () => {
    if (window.navigator.vibrate) {
      window.navigator.vibrate([50, 50, 50]);
    }
  },
  error: () => {
    if (window.navigator.vibrate) {
      window.navigator.vibrate([100, 50, 100]);
    }
  }
};

// Sound effects
export class SoundEffects {
  private static audioContext: AudioContext | null = null;
  private static sounds: Map<string, AudioBuffer> = new Map();

  static async init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  static async loadSound(name: string, url: string) {
    await this.init();
    if (!this.audioContext) return;

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.sounds.set(name, audioBuffer);
    } catch (error) {
      console.error('Error loading sound:', error);
    }
  }

  static play(name: string) {
    if (!this.audioContext || !this.sounds.has(name)) return;

    const source = this.audioContext.createBufferSource();
    source.buffer = this.sounds.get(name)!;
    source.connect(this.audioContext.destination);
    source.start(0);
  }
}

// Predefined sound effects
export const SoundEffect = {
  complete: () => SoundEffects.play('complete'),
  unlock: () => SoundEffects.play('unlock'),
  error: () => SoundEffects.play('error'),
  click: () => SoundEffects.play('click')
};

// Initialize sound effects
export const initSoundEffects = async () => {
  await SoundEffects.init();
  await SoundEffects.loadSound('complete', '/sounds/complete.mp3');
  await SoundEffects.loadSound('unlock', '/sounds/unlock.mp3');
  await SoundEffects.loadSound('error', '/sounds/error.mp3');
  await SoundEffects.loadSound('click', '/sounds/click.mp3');
}; 