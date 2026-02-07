import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../utils/theme';
import VolumeSlider from './VolumeSlider';
import type { NoiseInfo } from '../utils/noises';

interface NoiseCardProps {
  noise: NoiseInfo;
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  onToggle: () => void;
  onVolumeChange: (volume: number) => void;
}

export default function NoiseCard({
  noise,
  isPlaying,
  isLoading,
  volume,
  onToggle,
  onVolumeChange,
}: NoiseCardProps) {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.cardBg,
          borderColor: isPlaying ? noise.color + '80' : colors.border,
          borderWidth: isPlaying ? 1.5 : 1,
        },
      ]}
    >
      <Pressable
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
      >
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: noise.color + '20' },
          ]}
        >
          <MaterialCommunityIcons
            name={noise.icon as any}
            size={28}
            color={noise.color}
          />
        </View>

        <View style={styles.titleArea}>
          <Text style={[styles.name, { color: colors.text }]}>
            {noise.name}
          </Text>
          <Text style={[styles.shortDesc, { color: colors.textMuted }]}>
            {noise.shortDescription}
          </Text>
        </View>

        <Pressable
          onPress={onToggle}
          disabled={isLoading}
          style={[
            styles.playButton,
            {
              backgroundColor: isPlaying ? noise.color : colors.surfaceLight,
              borderColor: noise.color + '60',
            },
          ]}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={isPlaying ? '#FFF' : noise.color} />
          ) : (
            <MaterialCommunityIcons
              name={isPlaying ? 'pause' : 'play'}
              size={24}
              color={isPlaying ? '#FFFFFF' : noise.color}
            />
          )}
        </Pressable>
      </Pressable>

      {(expanded || isPlaying) && (
        <View style={styles.expandedContent}>
          <VolumeSlider
            value={volume}
            onValueChange={onVolumeChange}
            showPresets={expanded}
            compact={!expanded}
          />
          {expanded && (
            <Text
              style={[styles.scientificDesc, { color: colors.textSecondary }]}
            >
              {noise.scientificDescription}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleArea: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  shortDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  expandedContent: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  scientificDesc: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
    fontStyle: 'italic',
  },
});
