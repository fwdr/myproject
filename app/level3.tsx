import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { GameScreen } from '../components/GameScreen';
import { LEVEL_3 } from '../config/levels/level3';
import { PALETTE } from '../lib/gameConstants';

export default function Level3Screen() {
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
      config={LEVEL_3}
      initialScore={initialScore}
      levelLabel="L-03"
      backgroundColor={PALETTE.navy}
      brickStyle={{ backgroundColor: PALETTE.teal, borderColor: PALETTE.cyan }}
      borderColor={PALETTE.magenta}
      onExit={onExit}
      nextPath="/level4"
    />
  );
}
