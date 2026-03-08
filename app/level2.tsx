import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { GameScreen } from '../components/GameScreen';
import { LEVEL_2 } from '../config/levels/level2';
import { PALETTE } from '../lib/gameConstants';

const L2_BG = '#1a0a2e';

export default function Level2Screen() {
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
      config={LEVEL_2}
      initialScore={initialScore}
      levelLabel="L-02"
      levelNumber={2}
      backgroundColor={L2_BG}
      borderColor={PALETTE.magenta}
      onExit={onExit}
      nextPath="/level3"
    />
  );
}
