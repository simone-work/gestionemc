import { createTheme, type IPalette } from '@fluentui/react';

const dashboardThemePalette: Partial<IPalette> = {
  // --- Colori del Testo ---
  neutralPrimary: '#ffffff',
  neutralSecondary: '#ffffff',
  neutralTertiary: '#ffffff',
};

export const dashboardTheme = createTheme({
  palette: dashboardThemePalette,
});
