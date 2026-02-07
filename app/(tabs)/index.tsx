import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../utils/theme';
import { NOISES } from '../../utils/noises';
import { useNoiseGenerator } from '../../hooks/useNoiseGenerator';
import NoiseCard from '../../components/NoiseCard';
import GlobalControls from '../../components/GlobalControls';

export default function HomeScreen() {
  const { colors } = useTheme();
  const {
    players,
    masterVolume,
    masterPlaying,
    timerMs,
    timerRemaining,
    toggle,
    setVolume,
    setMasterVolume,
    masterToggle,
    stopAll,
    setTimer,
  } = useNoiseGenerator();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {NOISES.map((noise) => (
          <NoiseCard
            key={noise.id}
            noise={noise}
            isPlaying={players[noise.id].isPlaying}
            isLoading={players[noise.id].isLoading}
            volume={players[noise.id].volume}
            onToggle={() => toggle(noise.id)}
            onVolumeChange={(vol) => setVolume(noise.id, vol)}
          />
        ))}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      <SafeAreaView edges={['bottom']}>
        <GlobalControls
          masterPlaying={masterPlaying}
          masterVolume={masterVolume}
          timerMs={timerMs}
          timerRemaining={timerRemaining}
          onMasterToggle={masterToggle}
          onMasterVolumeChange={setMasterVolume}
          onTimerSelect={setTimer}
          onStopAll={stopAll}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  bottomSpacer: {
    height: 8,
  },
});
