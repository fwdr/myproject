import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { GameScreen } from '../components/GameScreen';
import { LEVEL_5 } from '../config/levels/level5';
import { PALETTE } from '../lib/gameConstants';

export default function Level5Screen() {
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
      config={LEVEL_5}
      initialScore={initialScore}
      levelLabel="L-05"
      levelNumber={5}
      backgroundColor={PALETTE.navy}
      brickStyle={{ backgroundColor: PALETTE.red, borderColor: PALETTE.maroon }}
      onExit={onExit}
      nextPath="/level6"
    />
  );
}
