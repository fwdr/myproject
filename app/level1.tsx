import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { GameScreen } from '../components/GameScreen';
import { LEVEL_1 } from '../config/levels/level1';
import { PALETTE } from '../lib/gameConstants';

export default function Level1Screen() {
  const router = useRouter();
  const { score: scoreParam } = useLocalSearchParams<{ score?: string }>();
  const initialScore = parseInt(scoreParam ?? '0', 10) || 0;

  const onExit = useCallback(
    (_score: number) => {
      router.replace('/home');
    },
    [router]
  );

  return (
    <GameScreen
      config={LEVEL_1}
      initialScore={initialScore}
      levelLabel="L-01"
      levelNumber={1}
      backgroundColor={PALETTE.navy}
      onExit={onExit}
      nextPath="/level2"
    />
  );
}
