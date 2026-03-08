import { useEffect, useRef } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';

const REGION_DURATION_MS = 90_000; // 90 seconds per loop region
const FADE_UP_MS = 1500;
const FADE_STEP_MS = 50;

function getPlaybackRate(levelNumber: number): number {
  if (levelNumber <= 5) return 0.9;
  if (levelNumber <= 10) return 1.0;
  if (levelNumber <= 15) return 1.08;
  return 1.15;
}

export function useBackgroundMusic(soundEnabled: boolean, levelNumber: number) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const soundEnabledRef = useRef(soundEnabled);
  soundEnabledRef.current = soundEnabled;

  useEffect(() => {
    let mounted = true;
    let fadeInterval: ReturnType<typeof setInterval> | null = null;

    const setup = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: false,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/PixelDogfight.mp3'),
          { isLooping: false, progressUpdateIntervalMillis: 500 }
        );
        if (!mounted) {
          await sound.unloadAsync();
          return;
        }

        const status = (await sound.getStatusAsync()) as AVPlaybackStatus;
        if (!status.isLoaded) return;

        const durationMs = status.durationMillis ?? 180_000;
        const maxStart = Math.max(0, durationMs - REGION_DURATION_MS);
        const regionStartMs =
          maxStart > 0
            ? (((levelNumber - 1) * 35_000) % maxStart)
            : 0;
        const regionEndMs = Math.min(
          regionStartMs + REGION_DURATION_MS,
          durationMs
        );

        const rate = getPlaybackRate(levelNumber);
        await sound.setRateAsync(rate, false);
        await sound.setPositionAsync(regionStartMs);
        await sound.setVolumeAsync(0);

        sound.setOnPlaybackStatusUpdate((s: AVPlaybackStatus) => {
          if (!s.isLoaded || !mounted) return;
          const pos = s.positionMillis;
          if (pos >= regionEndMs - 500) {
            sound.setPositionAsync(regionStartMs).catch(() => {});
          }
        });

        soundRef.current = sound;

        if (soundEnabledRef.current) {
          await sound.playAsync();
          let elapsed = 0;
          fadeInterval = setInterval(async () => {
            elapsed += FADE_STEP_MS;
            const vol = Math.min(1, elapsed / FADE_UP_MS);
            try {
              await sound.setVolumeAsync(vol);
            } catch (_) {}
            if (vol >= 1 && fadeInterval) {
              clearInterval(fadeInterval);
              fadeInterval = null;
            }
          }, FADE_STEP_MS);
        }
      } catch (e) {
        console.warn('Background music failed to load:', e);
      }
    };

    setup();
    return () => {
      mounted = false;
      if (fadeInterval) clearInterval(fadeInterval);
      soundRef.current?.unloadAsync().catch(() => {});
      soundRef.current = null;
    };
  }, [levelNumber]);

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
