import { useEffect, useRef } from 'react';
import { Audio } from 'expo-av';

export function useGameOverMusic(soundEnabled: boolean, gameActive: boolean) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const wasActiveRef = useRef(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/GameOverInsertCoin.mp3'),
          { shouldPlay: false }
        );
        if (!mounted) {
          await sound.unloadAsync();
          return;
        }
        soundRef.current = sound;
      } catch (e) {
        console.warn('Game over music failed to load:', e);
      }
    };
    load();
    return () => {
      mounted = false;
      soundRef.current?.unloadAsync().catch(() => {});
      soundRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (wasActiveRef.current && !gameActive && soundEnabled) {
      wasActiveRef.current = false;
      soundRef.current?.setPositionAsync(0).then(() => soundRef.current?.playAsync()).catch(() => {});
    }
    if (gameActive) wasActiveRef.current = true;
  }, [gameActive, soundEnabled]);
}
