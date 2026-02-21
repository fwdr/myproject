import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { useGame } from '@/context/GameContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { soundEnabled, setSoundEnabled } = useGame();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Text style={styles.backLabel}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Settings</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Sound</Text>
        <Switch
          value={soundEnabled}
          onValueChange={setSoundEnabled}
          trackColor={{ false: '#444', true: '#4ade80' }}
          thumbColor="#fff"
        />
      </View>

      <Text style={styles.hint}>
        Settings are saved automatically and persist between sessions.
      </Text>
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
    marginBottom: 32,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  label: {
    fontSize: 18,
    color: '#eee',
  },
  hint: {
    marginTop: 24,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
