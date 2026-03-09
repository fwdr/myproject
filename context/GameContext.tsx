import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  SOUND_ENABLED: '@game/soundEnabled',
  SOUND_EFFECTS_ENABLED: '@game/soundEffectsEnabled',
  HIGH_SCORE: '@game/highScore',
  UNLOCKED_LEVEL: '@game/unlockedLevel',
  START_LEVEL: '@game/startLevel',
  TEST_MODE: '@game/testMode',
} as const;

const MAX_LEVEL = 20;

type GameContextValue = {
  soundEnabled: boolean;
  setSoundEnabled: (value: boolean) => void;
  soundEffectsEnabled: boolean;
  setSoundEffectsEnabled: (value: boolean) => void;
  highScore: number;
  setHighScore: (value: number | ((prev: number) => number)) => void;
  resetHighScore: () => void;
  unlockedLevel: number;
  recordLevelComplete: (levelNumber: number) => void;
  startLevel: number;
  setStartLevel: (value: number) => void;
  testMode: boolean;
  setTestMode: (value: boolean) => void;
  isLoading: boolean;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [soundEnabled, setSoundEnabledState] = useState(true);
  const [soundEffectsEnabled, setSoundEffectsEnabledState] = useState(true);
  const [highScore, setHighScoreState] = useState(0);
  const [unlockedLevel, setUnlockedLevelState] = useState(1);
  const [startLevel, setStartLevelState] = useState(1);
  const [testMode, setTestModeState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [sound, soundFx, score, unlocked, start, testModeStored] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.SOUND_ENABLED),
          AsyncStorage.getItem(STORAGE_KEYS.SOUND_EFFECTS_ENABLED),
          AsyncStorage.getItem(STORAGE_KEYS.HIGH_SCORE),
          AsyncStorage.getItem(STORAGE_KEYS.UNLOCKED_LEVEL),
          AsyncStorage.getItem(STORAGE_KEYS.START_LEVEL),
          AsyncStorage.getItem(STORAGE_KEYS.TEST_MODE),
        ]);
        if (sound !== null) setSoundEnabledState(sound === 'true');
        if (soundFx !== null) setSoundEffectsEnabledState(soundFx === 'true');
        if (score !== null) setHighScoreState(parseInt(score, 10) || 0);
        const u = unlocked !== null ? Math.min(MAX_LEVEL, Math.max(1, parseInt(unlocked, 10) || 1)) : 1;
        const st = start !== null ? Math.min(MAX_LEVEL, Math.max(1, parseInt(start, 10) || 1)) : 1;
        setUnlockedLevelState(u);
        setStartLevelState(Math.min(st, u));
        if (testModeStored !== null) setTestModeState(testModeStored === 'true');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const setSoundEnabled = useCallback(async (value: boolean) => {
    setSoundEnabledState(value);
    await AsyncStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, String(value));
  }, []);

  const setSoundEffectsEnabled = useCallback(async (value: boolean) => {
    setSoundEffectsEnabledState(value);
    await AsyncStorage.setItem(STORAGE_KEYS.SOUND_EFFECTS_ENABLED, String(value));
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

  const setTestMode = useCallback(async (value: boolean) => {
    setTestModeState(value);
    await AsyncStorage.setItem(STORAGE_KEYS.TEST_MODE, String(value));
  }, []);

  return (
    <GameContext.Provider
      value={{
        soundEnabled,
        setSoundEnabled,
        soundEffectsEnabled,
        setSoundEffectsEnabled,
        highScore,
        setHighScore,
        resetHighScore,
        unlockedLevel,
        recordLevelComplete,
        startLevel,
        setStartLevel,
        testMode,
        setTestMode,
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
