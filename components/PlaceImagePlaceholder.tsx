import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { theme } from '@/constants/Colors';
import { GuideCategory } from '@/types/guide';

type PlaceImagePlaceholderProps = {
  category: GuideCategory;
  style?: StyleProp<ViewStyle>;
};

type PlaceholderKind = 'food' | 'outdoors' | 'arts' | 'attractions' | 'shopping' | 'stay';

const categoryKinds: Partial<Record<GuideCategory, PlaceholderKind>> = {
  'Food & Drink': 'food',
  Food: 'food',
  Outdoors: 'outdoors',
  Outdoor: 'outdoors',
  'Outdoor Adventures': 'outdoors',
  'Arts & Culture': 'arts',
  Arts: 'arts',
  Attractions: 'attractions',
  'Things To Do': 'attractions',
  Shopping: 'shopping',
  'Places to Stay': 'stay',
};

export function PlaceImagePlaceholder({ category, style }: PlaceImagePlaceholderProps) {
  const kind = categoryKinds[category] ?? 'attractions';

  return (
    <View style={[styles.placeholder, style]}>
      <View style={styles.mark}>
        <Text style={styles.markText}>NEK</Text>
      </View>
      <View style={styles.iconWrap}>{renderIcon(kind)}</View>
      <Text style={styles.category} numberOfLines={1}>
        {category}
      </Text>
    </View>
  );
}

function renderIcon(kind: PlaceholderKind) {
  switch (kind) {
    case 'food':
      return <FoodIcon />;
    case 'outdoors':
      return <OutdoorIcon />;
    case 'arts':
      return <ArtsIcon />;
    case 'shopping':
      return <ShoppingIcon />;
    case 'stay':
      return <StayIcon />;
    case 'attractions':
    default:
      return <AttractionIcon />;
  }
}

function FoodIcon() {
  return (
    <View style={styles.iconBox}>
      <View style={styles.cup} />
      <View style={styles.cupHandle} />
      <View style={styles.saucer} />
      <View style={styles.utensilLine} />
      <View style={[styles.utensilLine, styles.utensilLineShort]} />
    </View>
  );
}

function OutdoorIcon() {
  return (
    <View style={styles.iconBox}>
      <View style={styles.mountainLarge} />
      <View style={styles.mountainSmall} />
      <View style={styles.treeTop} />
      <View style={styles.treeTrunk} />
      <View style={styles.groundLine} />
    </View>
  );
}

function ArtsIcon() {
  return (
    <View style={styles.iconBox}>
      <View style={styles.palette}>
        <View style={styles.paletteThumb} />
        <View style={[styles.paintDot, styles.paintDotOne]} />
        <View style={[styles.paintDot, styles.paintDotTwo]} />
        <View style={[styles.paintDot, styles.paintDotThree]} />
      </View>
      <View style={styles.brush} />
    </View>
  );
}

function AttractionIcon() {
  return (
    <View style={styles.iconBox}>
      <View style={styles.pinHead}>
        <View style={styles.pinDot} />
      </View>
      <View style={styles.pinPoint} />
      <View style={styles.mapLineOne} />
      <View style={styles.mapLineTwo} />
    </View>
  );
}

function ShoppingIcon() {
  return (
    <View style={styles.iconBox}>
      <View style={styles.bagHandle} />
      <View style={styles.bagBody} />
      <View style={styles.bagLine} />
    </View>
  );
}

function StayIcon() {
  return (
    <View style={styles.iconBox}>
      <View style={styles.cabinRoof} />
      <View style={styles.cabinBody}>
        <View style={styles.cabinDoor} />
      </View>
      <View style={styles.bedBase} />
      <View style={styles.bedPillow} />
    </View>
  );
}

const creamLine = theme.colors.buttonCream;

const styles = StyleSheet.create({
  placeholder: {
    alignItems: 'center',
    aspectRatio: 16 / 10,
    backgroundColor: theme.colors.deepForest,
    justifyContent: 'center',
    overflow: 'hidden',
    width: '100%',
  },
  mark: {
    borderColor: creamLine,
    borderRadius: 999,
    borderWidth: 1,
    opacity: 0.86,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 3,
    position: 'absolute',
    right: theme.spacing.sm,
    top: theme.spacing.sm,
  },
  markText: {
    color: creamLine,
    fontSize: 10,
    fontWeight: '800',
  },
  iconWrap: {
    alignItems: 'center',
    height: 76,
    justifyContent: 'center',
    width: 112,
  },
  iconBox: {
    height: 72,
    position: 'relative',
    width: 104,
  },
  category: {
    color: creamLine,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
    marginTop: theme.spacing.xs,
    maxWidth: '72%',
    textTransform: 'uppercase',
  },
  cup: {
    borderColor: creamLine,
    borderRadius: 7,
    borderWidth: 3,
    height: 34,
    left: 28,
    position: 'absolute',
    top: 18,
    width: 42,
  },
  cupHandle: {
    borderColor: creamLine,
    borderLeftWidth: 0,
    borderRadius: 9,
    borderWidth: 3,
    height: 18,
    left: 66,
    position: 'absolute',
    top: 25,
    width: 14,
  },
  saucer: {
    backgroundColor: creamLine,
    borderRadius: 999,
    height: 3,
    left: 22,
    position: 'absolute',
    top: 56,
    width: 58,
  },
  utensilLine: {
    backgroundColor: creamLine,
    borderRadius: 999,
    height: 24,
    left: 15,
    position: 'absolute',
    top: 22,
    width: 3,
  },
  utensilLineShort: {
    height: 15,
    left: 20,
  },
  mountainLarge: {
    borderBottomColor: creamLine,
    borderBottomWidth: 48,
    borderLeftColor: 'transparent',
    borderLeftWidth: 38,
    borderRightColor: 'transparent',
    borderRightWidth: 38,
    bottom: 13,
    height: 0,
    left: 3,
    opacity: 0.94,
    position: 'absolute',
    width: 0,
  },
  mountainSmall: {
    borderBottomColor: creamLine,
    borderBottomWidth: 34,
    borderLeftColor: 'transparent',
    borderLeftWidth: 27,
    borderRightColor: 'transparent',
    borderRightWidth: 27,
    bottom: 13,
    height: 0,
    left: 47,
    opacity: 0.72,
    position: 'absolute',
    width: 0,
  },
  treeTop: {
    borderBottomColor: creamLine,
    borderBottomWidth: 24,
    borderLeftColor: 'transparent',
    borderLeftWidth: 15,
    borderRightColor: 'transparent',
    borderRightWidth: 15,
    bottom: 21,
    height: 0,
    position: 'absolute',
    right: 10,
    width: 0,
  },
  treeTrunk: {
    backgroundColor: creamLine,
    bottom: 13,
    height: 12,
    position: 'absolute',
    right: 23,
    width: 4,
  },
  groundLine: {
    backgroundColor: creamLine,
    borderRadius: 999,
    bottom: 10,
    height: 3,
    left: 8,
    opacity: 0.88,
    position: 'absolute',
    width: 88,
  },
  palette: {
    borderColor: creamLine,
    borderRadius: 28,
    borderWidth: 3,
    height: 50,
    left: 18,
    position: 'absolute',
    top: 12,
    transform: [{ rotate: '-12deg' }],
    width: 66,
  },
  paletteThumb: {
    borderColor: creamLine,
    borderRadius: 999,
    borderWidth: 3,
    height: 15,
    position: 'absolute',
    right: 12,
    top: 23,
    width: 15,
  },
  paintDot: {
    backgroundColor: creamLine,
    borderRadius: 999,
    height: 6,
    position: 'absolute',
    width: 6,
  },
  paintDotOne: {
    left: 16,
    top: 13,
  },
  paintDotTwo: {
    left: 31,
    top: 9,
  },
  paintDotThree: {
    left: 24,
    top: 27,
  },
  brush: {
    backgroundColor: creamLine,
    borderRadius: 999,
    height: 44,
    position: 'absolute',
    right: 18,
    top: 18,
    transform: [{ rotate: '42deg' }],
    width: 4,
  },
  pinHead: {
    alignItems: 'center',
    borderColor: creamLine,
    borderRadius: 999,
    borderWidth: 3,
    height: 43,
    justifyContent: 'center',
    left: 31,
    position: 'absolute',
    top: 8,
    width: 43,
  },
  pinDot: {
    backgroundColor: creamLine,
    borderRadius: 999,
    height: 10,
    width: 10,
  },
  pinPoint: {
    borderLeftColor: 'transparent',
    borderLeftWidth: 9,
    borderRightColor: 'transparent',
    borderRightWidth: 9,
    borderTopColor: creamLine,
    borderTopWidth: 18,
    height: 0,
    left: 43,
    position: 'absolute',
    top: 45,
    width: 0,
  },
  mapLineOne: {
    backgroundColor: creamLine,
    borderRadius: 999,
    bottom: 8,
    height: 3,
    left: 18,
    opacity: 0.72,
    position: 'absolute',
    width: 70,
  },
  mapLineTwo: {
    backgroundColor: creamLine,
    borderRadius: 999,
    bottom: 16,
    height: 3,
    left: 9,
    opacity: 0.48,
    position: 'absolute',
    width: 86,
  },
  bagHandle: {
    borderColor: creamLine,
    borderBottomWidth: 0,
    borderRadius: 16,
    borderWidth: 3,
    height: 23,
    left: 36,
    position: 'absolute',
    top: 10,
    width: 32,
  },
  bagBody: {
    borderColor: creamLine,
    borderRadius: 8,
    borderWidth: 3,
    height: 42,
    left: 24,
    position: 'absolute',
    top: 26,
    width: 56,
  },
  bagLine: {
    backgroundColor: creamLine,
    borderRadius: 999,
    height: 3,
    left: 35,
    opacity: 0.72,
    position: 'absolute',
    top: 47,
    width: 34,
  },
  cabinRoof: {
    borderBottomColor: creamLine,
    borderBottomWidth: 26,
    borderLeftColor: 'transparent',
    borderLeftWidth: 37,
    borderRightColor: 'transparent',
    borderRightWidth: 37,
    height: 0,
    left: 15,
    position: 'absolute',
    top: 7,
    width: 0,
  },
  cabinBody: {
    borderColor: creamLine,
    borderRadius: 4,
    borderWidth: 3,
    height: 32,
    left: 25,
    position: 'absolute',
    top: 33,
    width: 54,
  },
  cabinDoor: {
    backgroundColor: creamLine,
    bottom: 0,
    height: 17,
    left: 20,
    position: 'absolute',
    width: 10,
  },
  bedBase: {
    backgroundColor: creamLine,
    borderRadius: 999,
    bottom: 5,
    height: 3,
    left: 18,
    opacity: 0.72,
    position: 'absolute',
    width: 70,
  },
  bedPillow: {
    borderColor: creamLine,
    borderRadius: 3,
    borderWidth: 2,
    bottom: 9,
    height: 9,
    left: 23,
    opacity: 0.72,
    position: 'absolute',
    width: 17,
  },
});
