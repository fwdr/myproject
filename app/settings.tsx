import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';

let appVersion = '1.0.0';
try {
  const v = require('../version.json');
  appVersion = v.display || `${v.version} (${v.build})`;
} catch (_) {}
import { useGame } from '../context/GameContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { soundEnabled, setSoundEnabled, resetHighScore } = useGame();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => router.back()}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Text style={styles.closeIcon}>✕</Text>
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

      <TouchableOpacity style={styles.resetButton} onPress={resetHighScore}>
        <Text style={styles.resetButtonText}>Reset High Score</Text>
      </TouchableOpacity>

      <Text style={styles.hint}>
        Settings are saved automatically and persist between sessions.
      </Text>

      <Text style={styles.version}>Version {appVersion}</Text>
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
  closeButton: {
    position: 'absolute',
    top: 50,
    left: 24,
    zIndex: 10,
    padding: 4,
  },
  closeIcon: {
    fontSize: 24,
    color: '#888',
    fontWeight: '300',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#eee',
    marginTop: 48,
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
  resetButton: {
    marginTop: 24,
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  resetButtonText: {
    fontSize: 16,
    color: '#ef4444',
    fontWeight: '600',
  },
  hint: {
    marginTop: 24,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  version: {
    marginTop: 32,
    fontSize: 14,
    color: '#555',
  },
});
