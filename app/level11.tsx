import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { GameScreen } from '../components/GameScreen';
import { LEVEL_11 } from '../config/levels/level11';
import { PALETTE } from '../lib/gameConstants';

export default function Level11Screen() {
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
      config={LEVEL_11}
      initialScore={initialScore}
      levelLabel="L-11"
      levelNumber={11}
      backgroundColor={PALETTE.navy}
      brickStyle={{ backgroundColor: PALETTE.olive, borderColor: PALETTE.yellow }}
      borderColor={PALETTE.yellow}
      onExit={onExit}
      nextPath="/level12"
    />
  );
}
