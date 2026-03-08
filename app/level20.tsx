import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { GameScreen } from '../components/GameScreen';
import { LEVEL_20 } from '../config/levels/level20';
import { PALETTE } from '../lib/gameConstants';

export default function Level20Screen() {
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
      config={LEVEL_20}
      initialScore={initialScore}
      levelLabel="L-20"
      levelNumber={20}
      backgroundColor="#0a0520"
      brickStyle={{ backgroundColor: PALETTE.magenta, borderColor: PALETTE.yellow }}
      borderColor={PALETTE.yellow}
      onExit={onExit}
    />
  );
}
