import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../utils/theme';
import VolumeSlider from './VolumeSlider';
import TimerPicker from './TimerPicker';

interface GlobalControlsProps {
  masterPlaying: boolean;
  masterVolume: number;
  timerMs: number;
  timerRemaining: number | null;
  onMasterToggle: () => void;
  onMasterVolumeChange: (volume: number) => void;
  onTimerSelect: (ms: number) => void;
  onStopAll: () => void;
}

export default function GlobalControls({
  masterPlaying,
  masterVolume,
  timerMs,
  timerRemaining,
  onMasterToggle,
  onMasterVolumeChange,
  onTimerSelect,
  onStopAll,
}: GlobalControlsProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      ]}
    >
      <TimerPicker
        selectedMs={timerMs}
        onSelect={onTimerSelect}
        timerRemaining={timerRemaining}
      />

      <View style={styles.controlsRow}>
        <Pressable
          onPress={onStopAll}
          style={[styles.stopButton, { backgroundColor: colors.surfaceLight, borderColor: colors.border }]}
        >
          <MaterialCommunityIcons
            name="stop"
            size={22}
            color={colors.error}
          />
        </Pressable>

        <View style={styles.volumeArea}>
          <VolumeSlider
            value={masterVolume}
            onValueChange={onMasterVolumeChange}
            showPresets={false}
            label="Master Volume"
            compact
          />
        </View>

        <Pressable
          onPress={onMasterToggle}
          style={[
            styles.masterPlayButton,
            {
              backgroundColor: masterPlaying
                ? colors.primary
                : colors.surfaceLight,
              borderColor: colors.primary + '60',
            },
          ]}
        >
          <MaterialCommunityIcons
            name={masterPlaying ? 'pause' : 'play'}
            size={28}
            color={masterPlaying ? '#FFFFFF' : colors.primary}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderTopWidth: 1,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  stopButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  volumeArea: {
    flex: 1,
  },
  masterPlayButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
});
