import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { GameScreen } from '../components/GameScreen';
import { LEVEL_15 } from '../config/levels/level15';
import { PALETTE } from '../lib/gameConstants';

export default function Level15Screen() {
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
      config={LEVEL_15}
      initialScore={initialScore}
      levelLabel="L-15"
      levelNumber={15}
      backgroundColor={PALETTE.purple}
      borderColor={PALETTE.cyan}
      onExit={onExit}
      nextPath="/level16"
    />
  );
}
