import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../utils/theme';

export default function SettingsScreen() {
  const { colors, mode, toggleTheme } = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={[styles.section, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          Appearance
        </Text>

        <Pressable
          style={[styles.row, { borderBottomColor: colors.border }]}
          onPress={toggleTheme}
        >
          <MaterialCommunityIcons
            name={mode === 'dark' ? 'weather-night' : 'weather-sunny'}
            size={22}
            color={colors.primary}
          />
          <Text style={[styles.rowText, { color: colors.text }]}>
            {mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </Text>
          <View
            style={[
              styles.toggle,
              {
                backgroundColor:
                  mode === 'dark' ? colors.primary : colors.surfaceLight,
              },
            ]}
          >
            <View
              style={[
                styles.toggleKnob,
                {
                  backgroundColor: '#FFFFFF',
                  transform: [
                    { translateX: mode === 'dark' ? 18 : 0 },
                  ],
                },
              ]}
            />
          </View>
        </Pressable>
      </View>

      <View style={[styles.section, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          About
        </Text>

        <View style={[styles.row, { borderBottomColor: colors.border }]}>
          <MaterialCommunityIcons
            name="information-outline"
            size={22}
            color={colors.primary}
          />
          <Text style={[styles.rowText, { color: colors.text }]}>
            Version
          </Text>
          <Text style={[styles.rowValue, { color: colors.textMuted }]}>
            1.0.0
          </Text>
        </View>

        <View style={[styles.row, { borderBottomColor: colors.border }]}>
          <MaterialCommunityIcons
            name="shield-check-outline"
            size={22}
            color={colors.primary}
          />
          <View style={styles.rowTextArea}>
            <Text style={[styles.rowText, { color: colors.text }]}>
              Privacy
            </Text>
            <Text style={[styles.rowSubtext, { color: colors.textMuted }]}>
              This app does not collect any data
            </Text>
          </View>
        </View>

        <View style={[styles.row, { borderBottomColor: colors.border }]}>
          <MaterialCommunityIcons
            name="advertisements-off"
            size={22}
            color={colors.primary}
          />
          <View style={styles.rowTextArea}>
            <Text style={[styles.rowText, { color: colors.text }]}>
              Ad-Free
            </Text>
            <Text style={[styles.rowSubtext, { color: colors.textMuted }]}>
              No ads, no trackers, no analytics — ever
            </Text>
          </View>
        </View>

        <View style={[styles.row, { borderBottomColor: 'transparent' }]}>
          <MaterialCommunityIcons
            name="wifi-off"
            size={22}
            color={colors.primary}
          />
          <View style={styles.rowTextArea}>
            <Text style={[styles.rowText, { color: colors.text }]}>
              Fully Offline
            </Text>
            <Text style={[styles.rowSubtext, { color: colors.textMuted }]}>
              Works without internet connection
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          How It Works
        </Text>
        <View style={styles.infoContent}>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            All noise is generated programmatically using mathematical algorithms
            directly on your device. No audio files are downloaded or stored.
          </Text>
          <Text style={[styles.infoText, { color: colors.textSecondary, marginTop: 8 }]}>
            Each noise type has a unique frequency spectrum that produces different
            therapeutic effects, backed by scientific research.
          </Text>
        </View>
      </View>

      <Text style={[styles.footer, { color: colors.textMuted }]}>
        White Noise Generator Ad-Free{'\n'}
        Made with ♥ for better sleep
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  rowText: {
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
  rowValue: {
    fontSize: 14,
  },
  rowTextArea: {
    flex: 1,
  },
  rowSubtext: {
    fontSize: 12,
    marginTop: 2,
  },
  toggle: {
    width: 42,
    height: 24,
    borderRadius: 12,
    padding: 3,
  },
  toggleKnob: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  infoContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 20,
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
  },
});
