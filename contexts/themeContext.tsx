import { AppTheme, THEMES } from '@/constants/theme.constants';
import { useSettingsStore } from '@/stores/settingsStore';
import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext<AppTheme>(THEMES.light);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useColorScheme();
  const { automaticTheme, colorTheme } = useSettingsStore();

  const resolvedTheme = automaticTheme ? (systemScheme === 'dark' ? 'dark' : 'light') : colorTheme;
  // systemScheme can be null on first render, falls back 2 light

  console.log(
    'sys theme',
    systemScheme,
    ' auto :',
    automaticTheme,
    ' color: ',
    colorTheme,
    ' resolved:',
    resolvedTheme
  );

  return <ThemeContext.Provider value={THEMES[resolvedTheme]}>{children}</ThemeContext.Provider>;
};

export const useAppTheme = () => useContext(ThemeContext);
