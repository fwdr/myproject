import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { GameScreen } from '../components/GameScreen';
import { LEVEL_18 } from '../config/levels/level18';
import { PALETTE } from '../lib/gameConstants';

const L18_BG = '#1a0a2e';

export default function Level18Screen() {
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
      config={LEVEL_18}
      initialScore={initialScore}
      levelLabel="L-18"
      levelNumber={18}
      backgroundColor={L18_BG}
      brickStyle={{ backgroundColor: PALETTE.purple, borderColor: PALETTE.cyan }}
      borderColor={PALETTE.cyan}
      onExit={onExit}
      nextPath="/level19"
    />
  );
}
