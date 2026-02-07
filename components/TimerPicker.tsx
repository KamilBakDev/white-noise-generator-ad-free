import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../utils/theme';
import { TIMER_OPTIONS } from '../constants';

interface TimerPickerProps {
  selectedMs: number;
  onSelect: (ms: number) => void;
  timerRemaining: number | null;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export default function TimerPicker({
  selectedMs,
  onSelect,
  timerRemaining,
}: TimerPickerProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="timer-outline"
          size={18}
          color={colors.textSecondary}
        />
        <Text style={[styles.title, { color: colors.textSecondary }]}>
          Sleep Timer
        </Text>
        {timerRemaining !== null && timerRemaining > 0 && (
          <Text style={[styles.remaining, { color: colors.accent }]}>
            {formatTime(timerRemaining)}
          </Text>
        )}
      </View>
      <View style={styles.optionsRow}>
        {TIMER_OPTIONS.map((option) => (
          <Pressable
            key={option.label}
            onPress={() => onSelect(option.value)}
            style={[
              styles.optionButton,
              {
                backgroundColor:
                  selectedMs === option.value
                    ? colors.primary
                    : colors.surfaceLight,
                borderColor: colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.optionText,
                {
                  color:
                    selectedMs === option.value
                      ? '#FFFFFF'
                      : colors.textSecondary,
                },
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  remaining: {
    fontSize: 14,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
