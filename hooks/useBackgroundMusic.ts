import { useEffect, useRef } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';

const REGION_DURATION_MS = 45_000; // 45 seconds per loop region (works for ~1min+ tracks)
const REGION_STEP_MS = 8_000; // 8 seconds between level start offsets
const FADE_UP_MS = 1500;
const FADE_STEP_MS = 50;

function getPlaybackRate(levelNumber: number): number {
  if (levelNumber <= 5) return 0.9;
  if (levelNumber <= 10) return 1.0;
  if (levelNumber <= 15) return 1.08;
  return 1.15;
}

export function useBackgroundMusic(soundEnabled: boolean, levelNumber: number, gameActive = true) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const soundEnabledRef = useRef(soundEnabled);
  soundEnabledRef.current = soundEnabled;

  useEffect(() => {
    let mounted = true;
    let fadeInterval: ReturnType<typeof setInterval> | null = null;

    let pollInterval: ReturnType<typeof setInterval> | null = null;

    const setup = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true, // Allow music when iPhone is in silent mode
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/PixelDogfight.mp3'),
          { isLooping: false }
        );
        if (!mounted) {
          await sound.unloadAsync();
          return;
        }

        soundRef.current = sound;

        // Start playback first (seek/rate before play can fail on some platforms)
        if (soundEnabledRef.current) {
          await sound.setVolumeAsync(0);
          await sound.playAsync();
        }

        // Apply rate and position after play has started
        const status = (await sound.getStatusAsync()) as AVPlaybackStatus;
        if (!status.isLoaded) return;

        const durationMs = status.durationMillis ?? 120_000;
        const maxStart = Math.max(REGION_STEP_MS, durationMs - REGION_DURATION_MS);
        const regionStartMs = ((levelNumber - 1) * REGION_STEP_MS) % maxStart;
        const regionEndMs = Math.min(
          regionStartMs + REGION_DURATION_MS,
          durationMs
        );

        try {
          await sound.setRateAsync(getPlaybackRate(levelNumber), false);
        } catch (_) {}
        try {
          await sound.setPositionAsync(regionStartMs);
        } catch (_) {}

        if (soundEnabledRef.current) {
          await sound.setVolumeAsync(0);
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

        // Poll for loop region (setOnPlaybackStatusUpdate often doesn't fire during playback)
        pollInterval = setInterval(async () => {
          if (!mounted) return;
          try {
            const s = (await sound.getStatusAsync()) as AVPlaybackStatus;
            if (s.isLoaded && s.isPlaying && s.positionMillis >= regionEndMs - 500) {
              await sound.setPositionAsync(regionStartMs);
            }
          } catch (_) {}
        }, 500);
      } catch (e) {
        console.warn('Background music failed to load:', e);
      }
    };

    setup();
    return () => {
      mounted = false;
      if (fadeInterval) clearInterval(fadeInterval);
      if (pollInterval) clearInterval(pollInterval);
      soundRef.current?.unloadAsync().catch(() => {});
      soundRef.current = null;
    };
  }, [levelNumber]);

  useEffect(() => {
    const s = soundRef.current;
    if (!s) return;
    if (soundEnabled && gameActive) {
      s.playAsync().catch(() => {});
    } else {
      s.pauseAsync().catch(() => {});
    }
  }, [soundEnabled, gameActive]);
}
