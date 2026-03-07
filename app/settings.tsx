import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';
import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { ScreenLayout } from '../components/ScreenLayout';
import { useGame } from '../context/GameContext';

let appVersion = '1.0.0';
try {
  const v = require('../version.json');
  appVersion = v.display || `${v.version} (${v.build})`;
} catch (_) {}

export default function SettingsScreen() {
  const router = useRouter();
  const { soundEnabled, setSoundEnabled, resetHighScore } = useGame();
  const [fontsLoaded] = useFonts({ PressStart2P_400Regular });

  if (!fontsLoaded) return null;

  return (
    <ScreenLayout
      menuLeft={
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={[styles.closeIcon, { fontFamily: 'PressStart2P_400Regular' }]}>✕</Text>
        </TouchableOpacity>
      }
      menuCenter={
        <Text style={[styles.menuTitle, { fontFamily: 'PressStart2P_400Regular' }]}>
          SETTINGS
        </Text>
      }
      contentStyle={styles.content}
    >
      <View style={styles.row}>
        <Text style={[styles.label, { fontFamily: 'PressStart2P_400Regular' }]}>Sound</Text>
        <Switch
          value={soundEnabled}
          onValueChange={setSoundEnabled}
          trackColor={{ false: '#444', true: '#4ade80' }}
          thumbColor="#fff"
        />
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={resetHighScore}>
        <Text style={[styles.resetButtonText, { fontFamily: 'PressStart2P_400Regular' }]}>
          Reset High Score
        </Text>
      </TouchableOpacity>

      <Text style={[styles.hint, { fontFamily: 'PressStart2P_400Regular' }]}>
        Settings are saved automatically and persist between sessions.
      </Text>

      <Text style={[styles.version, { fontFamily: 'PressStart2P_400Regular' }]}>
        Version {appVersion}
      </Text>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 32,
  },
  menuTitle: {
    fontSize: 12,
    color: '#00FFFF',
    letterSpacing: 1,
  },
  closeIcon: {
    fontSize: 16,
    color: '#FFFF00',
    letterSpacing: 1,
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
    fontSize: 12,
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
    fontSize: 12,
    color: '#ef4444',
  },
  hint: {
    marginTop: 24,
    fontSize: 10,
    color: '#666',
    lineHeight: 18,
  },
  version: {
    marginTop: 32,
    fontSize: 10,
    color: '#555',
  },
});
