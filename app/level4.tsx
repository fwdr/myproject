import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { GameScreen } from '../components/GameScreen';
import { LEVEL_4 } from '../config/levels/level4';
import { PALETTE } from '../lib/gameConstants';

export default function Level4Screen() {
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
      config={LEVEL_4}
      initialScore={initialScore}
      levelLabel="L-04"
      levelNumber={4}
      backgroundColor={PALETTE.purple}
      brickStyle={{ backgroundColor: PALETTE.magenta, borderColor: PALETTE.cyan }}
      borderColor={PALETTE.magenta}
      onExit={onExit}
      nextPath="/level5"
    />
  );
}
