import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { GameScreen } from '../components/GameScreen';
import { LEVEL_6 } from '../config/levels/level6';
import { PALETTE } from '../lib/gameConstants';

export default function Level6Screen() {
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
      config={LEVEL_6}
      initialScore={initialScore}
      levelLabel="L-06"
      levelNumber={6}
      backgroundColor={PALETTE.navy}
      borderColor={PALETTE.cyan}
      onExit={onExit}
      nextPath="/level7"
    />
  );
}
