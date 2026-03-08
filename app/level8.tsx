import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { GameScreen } from '../components/GameScreen';
import { LEVEL_8 } from '../config/levels/level8';
import { PALETTE } from '../lib/gameConstants';

export default function Level8Screen() {
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
      config={LEVEL_8}
      initialScore={initialScore}
      levelLabel="L-08"
      levelNumber={8}
      backgroundColor={PALETTE.navy}
      brickStyle={{ backgroundColor: PALETTE.green, borderColor: PALETTE.lime }}
      borderColor={PALETTE.lime}
      onExit={onExit}
      nextPath="/level9"
    />
  );
}
