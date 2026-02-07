import React, { createContext, useContext } from 'react';
import { Colors, type ThemeMode, type ColorScheme } from '../constants';

export interface ThemeContextType {
  mode: ThemeMode;
  colors: ColorScheme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  mode: 'dark',
  colors: Colors.dark,
  toggleTheme: () => {},
});

export function useTheme(): ThemeContextType {
  return useContext(ThemeContext);
}
