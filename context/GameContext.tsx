import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  SOUND_ENABLED: '@game/soundEnabled',
  HIGH_SCORE: '@game/highScore',
  UNLOCKED_LEVEL: '@game/unlockedLevel',
  START_LEVEL: '@game/startLevel',
} as const;

const MAX_LEVEL = 5;

type GameContextValue = {
  soundEnabled: boolean;
  setSoundEnabled: (value: boolean) => void;
  highScore: number;
  setHighScore: (value: number | ((prev: number) => number)) => void;
  resetHighScore: () => void;
  unlockedLevel: number;
  recordLevelComplete: (levelNumber: number) => void;
  startLevel: number;
  setStartLevel: (value: number) => void;
  isLoading: boolean;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [soundEnabled, setSoundEnabledState] = useState(true);
  const [highScore, setHighScoreState] = useState(0);
  const [unlockedLevel, setUnlockedLevelState] = useState(1);
  const [startLevel, setStartLevelState] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [sound, score, unlocked, start] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.SOUND_ENABLED),
          AsyncStorage.getItem(STORAGE_KEYS.HIGH_SCORE),
          AsyncStorage.getItem(STORAGE_KEYS.UNLOCKED_LEVEL),
          AsyncStorage.getItem(STORAGE_KEYS.START_LEVEL),
        ]);
        if (sound !== null) setSoundEnabledState(sound === 'true');
        if (score !== null) setHighScoreState(parseInt(score, 10) || 0);
        const u = unlocked !== null ? Math.min(MAX_LEVEL, Math.max(1, parseInt(unlocked, 10) || 1)) : 1;
        const st = start !== null ? Math.min(MAX_LEVEL, Math.max(1, parseInt(start, 10) || 1)) : 1;
        setUnlockedLevelState(u);
        setStartLevelState(Math.min(st, u));
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const setSoundEnabled = useCallback(async (value: boolean) => {
    setSoundEnabledState(value);
    await AsyncStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, String(value));
  }, []);

  const setHighScore = useCallback(
    async (value: number | ((prev: number) => number)) => {
      setHighScoreState((prev) => {
        const next = typeof value === 'function' ? value(prev) : value;
        const toStore = Math.max(0, next);
        AsyncStorage.setItem(STORAGE_KEYS.HIGH_SCORE, String(toStore));
        return toStore;
      });
    },
    []
  );

  const resetHighScore = useCallback(async () => {
    setHighScoreState(0);
    await AsyncStorage.setItem(STORAGE_KEYS.HIGH_SCORE, '0');
  }, []);

  const recordLevelComplete = useCallback(async (levelNumber: number) => {
    const nextUnlocked = Math.min(MAX_LEVEL, levelNumber + 1);
    setUnlockedLevelState((prev) => {
      const next = Math.max(prev, nextUnlocked);
      AsyncStorage.setItem(STORAGE_KEYS.UNLOCKED_LEVEL, String(next));
      return next;
    });
  }, []);

  const setStartLevel = useCallback(async (value: number) => {
    const clamped = Math.min(MAX_LEVEL, Math.max(1, value));
    setStartLevelState(clamped);
    await AsyncStorage.setItem(STORAGE_KEYS.START_LEVEL, String(clamped));
  }, []);

  return (
    <GameContext.Provider
      value={{
        soundEnabled,
        setSoundEnabled,
        highScore,
        setHighScore,
        resetHighScore,
        unlockedLevel,
        recordLevelComplete,
        startLevel,
        setStartLevel,
        isLoading,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
