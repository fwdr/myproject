import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useGame } from '@/context/GameContext';

export default function Level1Screen() {
  const router = useRouter();
  const { setHighScore } = useGame();

  const handleEndGame = (score: number) => {
    setHighScore((prev) => Math.max(prev, score));
    router.back();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Text style={styles.backLabel}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Level 1</Text>
      <Text style={styles.placeholder}>
        Add your game logic here. This is a placeholder.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleEndGame(100)}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>End game (score: 100)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  backButton: {
    marginBottom: 24,
  },
  backLabel: {
    fontSize: 17,
    color: '#4ade80',
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#eee',
    marginBottom: 16,
  },
  placeholder: {
    fontSize: 16,
    color: '#888',
    marginBottom: 32,
  },
  button: {
    backgroundColor: 'rgba(74, 222, 128, 0.2)',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  buttonText: {
    fontSize: 16,
    color: '#4ade80',
    fontWeight: '600',
  },
});
