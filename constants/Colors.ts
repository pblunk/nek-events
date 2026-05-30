export const theme = {
  colors: {
    forestGreen: '#2F5D50',
    cream: '#F7F4EA',
    slate: '#374151',
    white: '#FFFFFF',
    muted: '#6B7280',
    border: '#D8D2C2',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    sm: 8,
    md: 12,
  },
};

const tintColorLight = theme.colors.forestGreen;
const tintColorDark = theme.colors.cream;

export default {
  light: {
    text: theme.colors.slate,
    background: theme.colors.cream,
    tint: tintColorLight,
    tabIconDefault: theme.colors.muted,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: theme.colors.cream,
    background: theme.colors.slate,
    tint: tintColorDark,
    tabIconDefault: '#9CA3AF',
    tabIconSelected: tintColorDark,
  },
};
