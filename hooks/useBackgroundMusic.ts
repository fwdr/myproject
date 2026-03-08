import { useEffect, useRef } from 'react';
import { Audio } from 'expo-av';

export function useBackgroundMusic(soundEnabled: boolean) {
  const soundRef = useRef<{ unloadAsync: () => Promise<void>; playAsync: () => Promise<void>; pauseAsync: () => Promise<void> } | null>(null);
  const soundEnabledRef = useRef(soundEnabled);
  soundEnabledRef.current = soundEnabled;

  useEffect(() => {
    let mounted = true;

    const setup = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: false,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/PixelDogfight.mp3'),
          { isLooping: true }
        );
        if (!mounted) {
          await sound.unloadAsync();
          return;
        }
        soundRef.current = sound;
        if (soundEnabledRef.current) {
          await sound.playAsync();
        }
      } catch (e) {
        console.warn('Background music failed to load:', e);
      }
    };

    setup();
    return () => {
      mounted = false;
      soundRef.current?.unloadAsync().catch(() => {});
      soundRef.current = null;
    };
  }, []);

  useEffect(() => {
    const s = soundRef.current;
    if (!s) return;
    if (soundEnabled) {
      s.playAsync().catch(() => {});
    } else {
      s.pauseAsync().catch(() => {});
    }
  }, [soundEnabled]);
}
