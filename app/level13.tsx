import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { GameScreen } from '../components/GameScreen';
import { LEVEL_13 } from '../config/levels/level13';
import { PALETTE } from '../lib/gameConstants';

export default function Level13Screen() {
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
      config={LEVEL_13}
      initialScore={initialScore}
      levelLabel="L-13"
      levelNumber={13}
      backgroundColor={PALETTE.navy}
      borderColor={PALETTE.cyan}
      onExit={onExit}
      nextPath="/level14"
    />
  );
}
