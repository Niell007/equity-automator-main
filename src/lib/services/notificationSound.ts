export class NotificationSoundService {
  private static audioContext: AudioContext | null = null;
  private static soundEnabled: boolean = true;
  private static volume: number = 0.5;

  private static sounds = {
    default: '/sounds/notification.mp3',
    success: '/sounds/success.mp3',
    warning: '/sounds/warning.mp3',
    error: '/sounds/error.mp3',
  };

  private static audioCache = new Map<string, AudioBuffer>();

  static initialize(): void {
    if (typeof window !== 'undefined' && !this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.preloadSounds();
    }
  }

  static async preloadSounds(): Promise<void> {
    if (!this.audioContext) return;

    try {
      const loadSound = async (url: string) => {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer);
        this.audioCache.set(url, audioBuffer);
      };

      await Promise.all(Object.values(this.sounds).map(loadSound));
    } catch (error) {
      console.error('Error preloading sounds:', error);
    }
  }

  static setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  static toggleSound(enabled: boolean): void {
    this.soundEnabled = enabled;
  }

  static async playSound(type: keyof typeof NotificationSoundService.sounds = 'default'): Promise<void> {
    if (!this.soundEnabled || !this.audioContext) return;

    const soundUrl = this.sounds[type];
    
    try {
      let buffer = this.audioCache.get(soundUrl);
      
      if (!buffer) {
        const response = await fetch(soundUrl);
        const arrayBuffer = await response.arrayBuffer();
        buffer = await this.audioContext.decodeAudioData(arrayBuffer);
        this.audioCache.set(soundUrl, buffer);
      }

      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();
      
      source.buffer = buffer;
      gainNode.gain.value = this.volume;
      
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      source.start(0);
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  }

  static cleanup(): void {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.audioCache.clear();
  }
} 