import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { GameScreen } from '../components/GameScreen';
import { LEVEL_19 } from '../config/levels/level19';
import { PALETTE } from '../lib/gameConstants';

export default function Level19Screen() {
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
      config={LEVEL_19}
      initialScore={initialScore}
      levelLabel="L-19"
      levelNumber={19}
      backgroundColor={PALETTE.navy}
      brickStyle={{ backgroundColor: PALETTE.red, borderColor: PALETTE.yellow }}
      borderColor={PALETTE.yellow}
      onExit={onExit}
      nextPath="/level20"
    />
  );
}
