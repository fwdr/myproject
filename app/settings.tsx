import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Modal,
  ScrollView,
  Pressable,
} from 'react-native';
import { ScreenLayout } from '../components/ScreenLayout';
import { useGame } from '../context/GameContext';
import { ENEMY_TYPES } from '../config/enemyTypes';

let appVersion = '1.0.0';
try {
  const v = require('../version.json');
  appVersion = v.display || `${v.version} (${v.build})`;
} catch (_) {}

const CELL_SIZE = 96;

function SpriteGallery({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <Pressable style={galleryStyles.backdrop} onPress={onClose}>
        <Pressable style={galleryStyles.panel} onPress={(e) => e.stopPropagation()}>
          <View style={galleryStyles.header}>
            <Text style={[galleryStyles.title, { fontFamily: 'PressStart2P_400Regular' }]}>
              SPRITES
            </Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={galleryStyles.closeBtn}
            >
              <Text style={[galleryStyles.closeIcon, { fontFamily: 'PressStart2P_400Regular' }]}>
                ✕
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            style={galleryStyles.scroll}
            contentContainerStyle={galleryStyles.grid}
            showsVerticalScrollIndicator={false}
          >
            {Object.entries(ENEMY_TYPES).map(([id, def]) => {
              const Sprite = def.Sprite;
              return (
                <View key={id} style={galleryStyles.cell}>
                  <View style={galleryStyles.spriteFrame}>
                    <Sprite x={CELL_SIZE / 2} y={CELL_SIZE / 2} />
                  </View>
                  <Text style={[galleryStyles.label, { fontFamily: 'PressStart2P_400Regular' }]}>
                    {id} ({def.health} HP)
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const galleryStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  panel: {
    width: '100%',
    maxWidth: 360,
    maxHeight: '80%',
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#00FFFF',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#00FFFF',
  },
  title: {
    fontSize: 14,
    color: '#00FFFF',
    letterSpacing: 1,
  },
  closeBtn: {
    padding: 4,
  },
  closeIcon: {
    fontSize: 18,
    color: '#FFFF00',
  },
  scroll: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 20,
    gap: 16,
  },
  cell: {
    width: CELL_SIZE + 24,
    alignItems: 'center',
  },
  spriteFrame: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  label: {
    marginTop: 8,
    fontSize: 10,
    color: '#aaa',
    letterSpacing: 1,
  },
});

export default function SettingsScreen() {
  const router = useRouter();
  const { soundEnabled, setSoundEnabled, resetHighScore } = useGame();
  const [fontsLoaded] = useFonts({ PressStart2P_400Regular });
  const [spriteGalleryVisible, setSpriteGalleryVisible] = useState(false);

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

      <TouchableOpacity
        style={styles.spriteButton}
        onPress={() => setSpriteGalleryVisible(true)}
      >
        <Text style={[styles.spriteButtonText, { fontFamily: 'PressStart2P_400Regular' }]}>
          Sprite Gallery
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resetButton} onPress={resetHighScore}>
        <Text style={[styles.resetButtonText, { fontFamily: 'PressStart2P_400Regular' }]}>
          Reset High Score
        </Text>
      </TouchableOpacity>

      <SpriteGallery
        visible={spriteGalleryVisible}
        onClose={() => setSpriteGalleryVisible(false)}
      />

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
  spriteButton: {
    marginTop: 24,
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00FFFF',
  },
  spriteButtonText: {
    fontSize: 12,
    color: '#00FFFF',
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
