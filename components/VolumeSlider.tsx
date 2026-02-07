import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Slider from '@react-native-community/slider';
import { useTheme } from '../utils/theme';
import { VOLUME_PRESETS } from '../constants';

interface VolumeSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  showPresets?: boolean;
  label?: string;
  compact?: boolean;
}

export default function VolumeSlider({
  value,
  onValueChange,
  showPresets = true,
  label,
  compact = false,
}: VolumeSliderProps) {
  const { colors } = useTheme();

  const handlePreset = useCallback(
    (presetValue: number) => {
      onValueChange(presetValue);
    },
    [onValueChange]
  );

  return (
    <View style={compact ? styles.containerCompact : styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {label}
        </Text>
      )}
      <View style={styles.sliderRow}>
        <Text style={[styles.volumeText, { color: colors.textMuted }]}>
          {Math.round(value * 100)}%
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          value={value}
          onValueChange={onValueChange}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.border}
          thumbTintColor={colors.primaryLight}
        />
      </View>
      {showPresets && (
        <View style={styles.presetsRow}>
          {VOLUME_PRESETS.map((preset) => (
            <Pressable
              key={preset.label}
              onPress={() => handlePreset(preset.value)}
              style={[
                styles.presetButton,
                {
                  backgroundColor:
                    Math.abs(value - preset.value) < 0.05
                      ? colors.primary
                      : colors.surfaceLight,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.presetText,
                  {
                    color:
                      Math.abs(value - preset.value) < 0.05
                        ? '#FFFFFF'
                        : colors.textSecondary,
                  },
                ]}
              >
                {preset.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
  },
  containerCompact: {
    paddingVertical: 2,
  },
  label: {
    fontSize: 12,
    marginBottom: 2,
    fontWeight: '500',
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  volumeText: {
    fontSize: 12,
    width: 36,
    textAlign: 'right',
    marginRight: 8,
    fontVariant: ['tabular-nums'],
  },
  slider: {
    flex: 1,
    height: 32,
  },
  presetsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 6,
    marginTop: 4,
  },
  presetButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  presetText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
