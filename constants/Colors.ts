export const theme = {
  colors: {
    forestGreen: '#2E6B50',
    deepForest: '#1F4D3A',
    cream: '#FAF7F2',
    buttonCream: '#F7F3E9',
    sage: '#A8B5A2',
    slate: '#2B2B2B',
    white: '#FFFFFF',
    muted: '#5E665E',
    border: '#E2DDD2',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    sm: 12,
    md: 12,
  },
  shadows: {
    card: {
      shadowColor: '#1F4D3A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 3,
    },
  },
};

const tintColorLight = theme.colors.forestGreen;
const tintColorDark = theme.colors.cream;

export default {
  light: {
    text: theme.colors.slate,
    background: theme.colors.cream,
    tint: tintColorLight,
    tabIconDefault: theme.colors.sage,
    tabIconSelected: theme.colors.buttonCream,
  },
  dark: {
    text: theme.colors.buttonCream,
    background: theme.colors.slate,
    tint: tintColorDark,
    tabIconDefault: theme.colors.sage,
    tabIconSelected: theme.colors.buttonCream,
  },
};
