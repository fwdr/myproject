import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { GameScreen } from '../components/GameScreen';
import { LEVEL_17 } from '../config/levels/level17';
import { PALETTE } from '../lib/gameConstants';

export default function Level17Screen() {
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
      config={LEVEL_17}
      initialScore={initialScore}
      levelLabel="L-17"
      levelNumber={17}
      backgroundColor={PALETTE.navy}
      brickStyle={{ backgroundColor: PALETTE.maroon, borderColor: PALETTE.magenta }}
      borderColor={PALETTE.magenta}
      onExit={onExit}
      nextPath="/level18"
    />
  );
}
