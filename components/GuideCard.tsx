import { Image, StyleSheet, Text, View } from 'react-native';

import { PlaceImagePlaceholder } from '@/components/PlaceImagePlaceholder';
import { VermontRating } from '@/components/VermontRating';
import { theme } from '@/constants/Colors';
import { AnyGuideItem } from '@/types/guide';
import { getGuideItemImage } from '@/utils/images';

type GuideCardProps = {
  item: AnyGuideItem;
  compact?: boolean;
};

export function GuideCard({ item, compact = false }: GuideCardProps) {
  const image = getGuideItemImage(item);

  return (
    <View style={[styles.card, compact && styles.compactCard]}>
      {image.imageUrl ? (
        <Image source={{ uri: image.imageUrl }} style={compact ? styles.compactImage : styles.image} />
      ) : (
        <PlaceImagePlaceholder category={item.category} style={compact ? styles.compactImage : styles.image} />
      )}
      <View style={styles.content}>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.title} numberOfLines={compact ? 2 : 3}>
          {item.title}
        </Text>
        <Text style={styles.description} numberOfLines={compact ? 2 : 3}>
          {item.description}
        </Text>
        <VermontRating rating={item.rating} reviewCount={item.userRatingsTotal} compact={compact} />
        <Text style={styles.meta}>
          {item.detectedTown ?? item.sourceTown ?? item.location.town} · {item.location.name}
        </Text>
        <Text style={styles.address} numberOfLines={1}>
          {item.location.address}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...theme.shadows.card,
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    overflow: 'hidden',
    width: 250,
  },
  compactCard: {
    width: '100%',
  },
  image: {
    aspectRatio: 16 / 10,
    backgroundColor: theme.colors.border,
    width: '100%',
  },
  compactImage: {
    aspectRatio: 16 / 8,
    backgroundColor: theme.colors.border,
    width: '100%',
  },
  content: {
    padding: theme.spacing.md,
  },
  category: {
    color: theme.colors.forestGreen,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  title: {
    color: theme.colors.slate,
    fontSize: 18,
    fontWeight: '800',
    marginTop: theme.spacing.xs,
  },
  description: {
    color: theme.colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: theme.spacing.sm,
  },
  meta: {
    color: theme.colors.slate,
    fontSize: 14,
    fontWeight: '700',
    marginTop: theme.spacing.sm,
  },
  address: {
    color: theme.colors.muted,
    fontSize: 13,
    marginTop: theme.spacing.xs,
  },
});
