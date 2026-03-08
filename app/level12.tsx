import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { GameScreen } from '../components/GameScreen';
import { LEVEL_12 } from '../config/levels/level12';
import { PALETTE } from '../lib/gameConstants';

const L12_BG = '#0a0a1a';

export default function Level12Screen() {
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
      config={LEVEL_12}
      initialScore={initialScore}
      levelLabel="L-12"
      levelNumber={12}
      backgroundColor={L12_BG}
      brickStyle={{ backgroundColor: PALETTE.red, borderColor: PALETTE.magenta }}
      borderColor={PALETTE.magenta}
      onExit={onExit}
      nextPath="/level13"
    />
  );
}
