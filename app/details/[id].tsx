import { Stack, useLocalSearchParams } from 'expo-router';
import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/Colors';
import { getGuideItemById } from '@/data/events';
import { getImportedPlaceById } from '@/data/places';
import { useSavedItems } from '@/hooks/useSavedItems';
import { AnyGuideItem, EventItem } from '@/types/guide';
import { formatEventFullDate, formatEventTimeRange } from '@/utils/formatEvent';
import { getGuideItemImage } from '@/utils/images';

export default function SharedDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = getImportedPlaceById(id) ?? getGuideItemById(id);
  const { isSaved, toggleSaved } = useSavedItems();

  if (!item) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.title}>Place not found</Text>
        <Text style={styles.body}>This NEK Explorer item could not be loaded.</Text>
      </View>
    );
  }

  const saved = isSaved(item.id);
  const image = getGuideItemImage(item);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: item.title }} />

      <Image source={{ uri: image.imageUrl }} style={styles.heroImage} />
      <Text style={styles.imageCredit}>
        {image.isFallback ? 'Fallback image' : 'Image'}: {image.imageCredit} · {image.imageSource}
      </Text>

      <View style={styles.header}>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.town}>{item.location.town}</Text>
      </View>

      <Pressable
        style={[styles.saveButton, saved && styles.saveButtonActive]}
        onPress={() => toggleSaved(item.id)}>
        <Text style={[styles.saveButtonText, saved && styles.saveButtonTextActive]}>
          {saved ? 'Saved' : 'Save'}
        </Text>
      </Pressable>

      <View style={styles.sectionGrid}>
        {isEventItem(item) ? (
          <InfoSection title="Date and time" value={formatEventFullDate(item)} detail={formatEventTimeRange(item)} />
        ) : null}
        <InfoSection title="Address" value={item.location.name} detail={item.location.address} />
        {item.detectedTown || item.sourceTown ? (
          <InfoSection
            title="Town"
            value={item.detectedTown ?? item.sourceTown ?? item.location.town}
            detail={`Source town: ${item.sourceTown ?? item.location.town}`}
          />
        ) : null}
        {item.rating ? (
          <InfoSection title="Rating" value={`${item.rating.toFixed(1)} stars`} detail={`${item.userRatingsTotal ?? 0} reviews`} />
        ) : null}
        {item.cost ? <InfoSection title="Cost" value={item.cost} /> : null}
        {item.isFamilyFriendly !== undefined ? (
          <InfoSection title="Family friendly" value={item.isFamilyFriendly ? 'Yes' : 'No'} />
        ) : null}
      </View>

      <View style={styles.descriptionCard}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.body}>{item.description}</Text>
      </View>

      <MapPreviewCard item={item} />

      {item.sourceUrl ? (
        <Pressable style={styles.sourceButton} onPress={() => Linking.openURL(item.sourceUrl!)}>
          <Text style={styles.sourceButtonText}>View Source</Text>
        </Pressable>
      ) : null}
    </ScrollView>
  );
}

function isEventItem(item: AnyGuideItem): item is EventItem {
  return item.kind === 'event';
}

type InfoSectionProps = {
  title: string;
  value: string;
  detail?: string;
};

function InfoSection({ title, value, detail }: InfoSectionProps) {
  return (
    <View style={styles.infoCard}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.infoValue}>{value}</Text>
      {detail ? <Text style={styles.infoDetail}>{detail}</Text> : null}
    </View>
  );
}

function MapPreviewCard({ item }: { item: AnyGuideItem }) {
  const query = `${item.location.latitude},${item.location.longitude} ${item.location.address}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  return (
    <View style={styles.mapCard}>
      <Text style={styles.sectionTitle}>Map</Text>
      <Text style={styles.infoValue}>{item.location.name}</Text>
      <Text style={styles.infoDetail}>{item.location.address}</Text>
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapPlaceholderText}>Map preview coming soon</Text>
      </View>
      <Pressable style={styles.directionsButton} onPress={() => Linking.openURL(mapsUrl)}>
        <Text style={styles.directionsButtonText}>Directions</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.cream,
  },
  content: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  notFound: {
    flex: 1,
    backgroundColor: theme.colors.cream,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  heroImage: {
    aspectRatio: 16 / 10,
    backgroundColor: theme.colors.border,
    borderRadius: theme.radius.md,
    width: '100%',
  },
  imageCredit: {
    color: theme.colors.muted,
    fontSize: 12,
    marginTop: theme.spacing.sm,
  },
  header: {
    paddingVertical: theme.spacing.lg,
  },
  category: {
    color: theme.colors.forestGreen,
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  title: {
    color: theme.colors.slate,
    fontSize: 32,
    fontWeight: '800',
    marginTop: theme.spacing.sm,
  },
  town: {
    color: theme.colors.muted,
    fontSize: 17,
    marginTop: theme.spacing.sm,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.forestGreen,
    borderColor: theme.colors.forestGreen,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  saveButtonActive: {
    backgroundColor: theme.colors.deepForest,
    borderColor: theme.colors.deepForest,
  },
  saveButtonText: {
    color: theme.colors.buttonCream,
    fontSize: 16,
    fontWeight: '800',
  },
  saveButtonTextActive: {
    color: theme.colors.buttonCream,
  },
  sectionGrid: {
    gap: theme.spacing.md,
  },
  infoCard: {
    ...theme.shadows.card,
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    padding: theme.spacing.md,
  },
  sectionTitle: {
    color: theme.colors.forestGreen,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  infoValue: {
    color: theme.colors.slate,
    fontSize: 17,
    fontWeight: '700',
    marginTop: theme.spacing.sm,
  },
  infoDetail: {
    color: theme.colors.muted,
    fontSize: 16,
    lineHeight: 22,
    marginTop: theme.spacing.xs,
  },
  descriptionCard: {
    ...theme.shadows.card,
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
  },
  body: {
    color: theme.colors.slate,
    fontSize: 16,
    lineHeight: 23,
    marginTop: theme.spacing.sm,
  },
  mapCard: {
    ...theme.shadows.card,
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
  },
  mapPlaceholder: {
    alignItems: 'center',
    backgroundColor: theme.colors.cream,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    height: 160,
    justifyContent: 'center',
    marginTop: theme.spacing.md,
  },
  mapPlaceholderText: {
    color: theme.colors.muted,
    fontSize: 15,
    fontWeight: '700',
  },
  directionsButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.forestGreen,
    borderRadius: theme.radius.sm,
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
  },
  directionsButtonText: {
    color: theme.colors.buttonCream,
    fontSize: 16,
    fontWeight: '800',
  },
  sourceButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.forestGreen,
    borderColor: theme.colors.forestGreen,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
  },
  sourceButtonText: {
    color: theme.colors.buttonCream,
    fontSize: 16,
    fontWeight: '800',
  },
});
