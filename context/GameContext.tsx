import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  SOUND_ENABLED: '@game/soundEnabled',
  HIGH_SCORE: '@game/highScore',
} as const;

type GameContextValue = {
  soundEnabled: boolean;
  setSoundEnabled: (value: boolean) => void;
  highScore: number;
  setHighScore: (value: number | ((prev: number) => number)) => void;
  resetHighScore: () => void;
  isLoading: boolean;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [soundEnabled, setSoundEnabledState] = useState(true);
  const [highScore, setHighScoreState] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [sound, score] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.SOUND_ENABLED),
          AsyncStorage.getItem(STORAGE_KEYS.HIGH_SCORE),
        ]);
        if (sound !== null) setSoundEnabledState(sound === 'true');
        if (score !== null) setHighScoreState(parseInt(score, 10) || 0);
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

  return (
    <GameContext.Provider
      value={{
        soundEnabled,
        setSoundEnabled,
        highScore,
        setHighScore,
        resetHighScore,
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
