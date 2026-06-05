import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { theme } from '@/constants/Colors';

type VermontRatingProps = {
  rating?: number | null;
  reviewCount?: number | null;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
};

type LeafState = 'full' | 'half' | 'empty';

export function VermontRating({ rating, reviewCount, compact = false, style }: VermontRatingProps) {
  if (!rating) {
    return null;
  }

  return (
    <View style={[styles.container, compact && styles.compactContainer, style]}>
      <View style={styles.leafRow}>
        {getLeafStates(rating).map((state, index) => (
          <MapleLeaf key={`${state}-${index}`} state={state} />
        ))}
      </View>
      <Text style={[styles.ratingText, compact && styles.compactRatingText]}>
        {rating.toFixed(1)} from {reviewCount ?? 0} reviews
      </Text>
    </View>
  );
}

function getLeafStates(rating: number): LeafState[] {
  const roundedRating = Math.round(rating * 2) / 2;

  return Array.from({ length: 5 }, (_, index) => {
    const leafValue = index + 1;

    if (roundedRating >= leafValue) {
      return 'full';
    }

    if (roundedRating >= leafValue - 0.5) {
      return 'half';
    }

    return 'empty';
  });
}

function MapleLeaf({ state }: { state: LeafState }) {
  const fillWidth = state === 'full' ? '100%' : state === 'half' ? '50%' : '0%';

  return (
    <View style={styles.leafFrame}>
      <LeafShape color={theme.colors.sage} muted />
      <View style={[styles.fillClip, { width: fillWidth }]}>
        <LeafShape color={theme.colors.forestGreen} />
      </View>
    </View>
  );
}

function LeafShape({ color, muted = false }: { color: string; muted?: boolean }) {
  return (
    <View style={[styles.leafShape, muted && styles.mutedLeaf]}>
      <View style={[styles.leafBlade, styles.topBlade, { backgroundColor: color }]} />
      <View style={[styles.leafBlade, styles.leftBlade, { backgroundColor: color }]} />
      <View style={[styles.leafBlade, styles.rightBlade, { backgroundColor: color }]} />
      <View style={[styles.leafBlade, styles.lowLeftBlade, { backgroundColor: color }]} />
      <View style={[styles.leafBlade, styles.lowRightBlade, { backgroundColor: color }]} />
      <View style={[styles.leafCenter, { backgroundColor: color }]} />
      <View style={[styles.leafStem, { backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: theme.spacing.md,
  },
  compactContainer: {
    marginTop: theme.spacing.sm,
  },
  leafRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 3,
  },
  leafFrame: {
    height: 22,
    position: 'relative',
    width: 22,
  },
  fillClip: {
    bottom: 0,
    left: 0,
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
  },
  leafShape: {
    height: 22,
    position: 'absolute',
    width: 22,
  },
  mutedLeaf: {
    opacity: 0.72,
  },
  leafBlade: {
    borderRadius: 3,
    height: 8,
    position: 'absolute',
    width: 8,
  },
  topBlade: {
    left: 7,
    top: 1,
    transform: [{ rotate: '45deg' }],
  },
  leftBlade: {
    left: 2,
    top: 7,
    transform: [{ rotate: '45deg' }],
  },
  rightBlade: {
    right: 2,
    top: 7,
    transform: [{ rotate: '45deg' }],
  },
  lowLeftBlade: {
    left: 5,
    top: 12,
    transform: [{ rotate: '45deg' }],
  },
  lowRightBlade: {
    right: 5,
    top: 12,
    transform: [{ rotate: '45deg' }],
  },
  leafCenter: {
    borderRadius: 5,
    height: 10,
    left: 6,
    position: 'absolute',
    top: 8,
    transform: [{ rotate: '45deg' }],
    width: 10,
  },
  leafStem: {
    borderRadius: 999,
    height: 9,
    left: 10,
    position: 'absolute',
    top: 15,
    transform: [{ rotate: '-18deg' }],
    width: 3,
  },
  ratingText: {
    color: theme.colors.slate,
    fontSize: 14,
    fontWeight: '700',
    marginTop: theme.spacing.xs,
  },
  compactRatingText: {
    color: theme.colors.muted,
    fontSize: 12,
  },
});
