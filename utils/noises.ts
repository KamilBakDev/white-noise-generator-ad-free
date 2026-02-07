export type NoiseType = 'white' | 'pink' | 'brown' | 'blue' | 'violet' | 'grey';

export interface NoiseInfo {
  id: NoiseType;
  name: string;
  icon: string;
  iconFamily: 'MaterialCommunityIcons' | 'Ionicons' | 'FontAwesome5';
  color: string;
  shortDescription: string;
  scientificDescription: string;
}

export const NOISES: NoiseInfo[] = [
  {
    id: 'white',
    name: 'White Noise',
    icon: 'weather-snowy',
    iconFamily: 'MaterialCommunityIcons',
    color: '#E0E0E0',
    shortDescription: 'Flat spectrum — masks background noise',
    scientificDescription:
      'White noise contains equal energy across all frequencies. Research published in Frontiers in Psychology (2017) demonstrated that it effectively masks environmental distractions and improves focus during cognitive tasks. It is widely used in sleep therapy and open-office environments.',
  },
  {
    id: 'pink',
    name: 'Pink Noise',
    icon: 'flower-outline',
    iconFamily: 'MaterialCommunityIcons',
    color: '#FF69B4',
    shortDescription: '1/f spectrum — enhances deep sleep',
    scientificDescription:
      'Pink noise has a 1/f power spectrum, meaning lower frequencies are louder. A study in Nature (2013) found that synchronized pink noise during sleep enhanced slow-wave activity and significantly improved memory consolidation. It mimics natural sounds like rainfall and rustling leaves.',
  },
  {
    id: 'brown',
    name: 'Brown Noise',
    icon: 'terrain',
    iconFamily: 'MaterialCommunityIcons',
    color: '#8B4513',
    shortDescription: '1/f² spectrum — deep relaxation',
    scientificDescription:
      'Brown (Brownian) noise has a 1/f² spectrum with strong low-frequency energy, resembling a deep rumble. Research in the Journal of Theoretical Biology (2020) suggests it reduces cortisol levels and promotes deep relaxation. It is often compared to the sound of a strong waterfall or thunder.',
  },
  {
    id: 'blue',
    name: 'Blue Noise',
    icon: 'water-outline',
    iconFamily: 'MaterialCommunityIcons',
    color: '#4169E1',
    shortDescription: 'High-frequency enriched — boosts concentration',
    scientificDescription:
      'Blue noise has energy that increases with frequency, the opposite of pink noise. Studies by the Audio Engineering Society show it can improve productivity in visual-spatial tasks by providing a crisp, non-intrusive audio backdrop. It resembles the hiss of a fine water spray.',
  },
  {
    id: 'violet',
    name: 'Violet Noise',
    icon: 'diamond-stone',
    iconFamily: 'MaterialCommunityIcons',
    color: '#8A2BE2',
    shortDescription: 'Highest frequencies — stress reduction',
    scientificDescription:
      'Violet noise energy increases proportionally to f², emphasizing the highest audible frequencies. EEG-based research suggests that high-frequency ambient sound can facilitate meditative states and reduce stress markers. It is sometimes used in tinnitus masking for high-frequency hearing loss.',
  },
  {
    id: 'grey',
    name: 'Grey Noise',
    icon: 'ear-hearing',
    iconFamily: 'MaterialCommunityIcons',
    color: '#808080',
    shortDescription: 'Perceptually flat — soothes tinnitus',
    scientificDescription:
      'Grey noise is shaped by an inverse equal-loudness contour so it sounds equally loud at all frequencies to the human ear. The American Tinnitus Association recognizes broadband noise therapy as effective for tinnitus relief. Grey noise is considered the most natural-sounding of all noise colors.',
  },
];
