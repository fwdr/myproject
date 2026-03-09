import { useCallback, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';

export function useMissileSound(enabled: boolean) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
          interruptionModeAndroid: 2, // DUCK_OTHERS
          interruptionModeIOS: 2,
        });
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/missile.wav'),
          { shouldPlay: false }
        );
        if (!mounted) {
          await sound.unloadAsync();
          return;
        }
        soundRef.current = sound;
      } catch (e) {
        console.warn('Missile sound failed to load:', e);
      }
    };
    load();
    return () => {
      mounted = false;
      soundRef.current?.unloadAsync().catch(() => {});
      soundRef.current = null;
    };
  }, []);

  const play = useCallback(() => {
    if (!enabledRef.current) return;
    const s = soundRef.current;
    if (!s) return;
    s.setPositionAsync(0).then(() => s.playAsync()).catch(() => {});
  }, []);

  return play;
}
