import { Link, Stack, useLocalSearchParams } from 'expo-router';
import type { ReactNode } from 'react';
import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PlaceImagePlaceholder } from '@/components/PlaceImagePlaceholder';
import { VermontRating } from '@/components/VermontRating';
import { theme } from '@/constants/Colors';
import { getGuideItemById } from '@/data/events';
import { getImportedPlaceById, importedPlaces } from '@/data/places';
import { useSavedItems } from '@/hooks/useSavedItems';
import { AnyGuideItem, EventItem, GuideCategory } from '@/types/guide';
import { formatEventFullDate, formatEventTimeRange } from '@/utils/formatEvent';
import { getGuideItemImage } from '@/utils/images';

type NearbyGroups = {
  attractions: AnyGuideItem[];
  restaurants: AnyGuideItem[];
  sameTown: AnyGuideItem[];
};

const rainyDayCategories = new Set<GuideCategory>([
  'Arts & Culture',
  'Attractions',
  'Food & Drink',
  'Places to Stay',
  'Shopping',
]);

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
  const nearby = getNearbyGroups(item);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: item.title }} />

      {image.imageUrl ? (
        <>
          <Image source={{ uri: image.imageUrl }} style={styles.heroImage} />
          <Text style={styles.imageCredit}>
            Image: {image.imageCredit} · {image.imageSource}
          </Text>
        </>
      ) : (
        <PlaceImagePlaceholder category={item.category} style={styles.heroImage} />
      )}

      <View style={styles.header}>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.town}>{getDisplayTown(item)}</Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={[styles.primaryButton, saved && styles.primaryButtonActive]}
          onPress={() => toggleSaved(item.id)}>
          <Text style={styles.primaryButtonText}>{saved ? 'Saved' : 'Save'}</Text>
        </Pressable>
        {item.sourceUrl ? (
          <Pressable style={styles.secondaryButton} onPress={() => Linking.openURL(item.sourceUrl!)}>
            <Text style={styles.secondaryButtonText}>View Source</Text>
          </Pressable>
        ) : null}
      </View>

      <Section title="About" priority>
        <Text style={styles.body}>{item.description}</Text>
        <VermontRating rating={item.rating} reviewCount={item.userRatingsTotal} />
      </Section>

      <DetailsChips item={item} />

      <LocationSection item={item} />

      <NearbySection groups={nearby} />
    </ScrollView>
  );
}

function Section({
  title,
  children,
  priority = false,
}: {
  title: string;
  children: ReactNode;
  priority?: boolean;
}) {
  return (
    <View style={[styles.section, priority && styles.prioritySection]}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function DetailsChips({ item }: { item: AnyGuideItem }) {
  const chips = getDetailChips(item);

  return (
    <Section title="Details">
      <View style={styles.chipWrap}>
        {chips.map((chip) => (
          <View key={chip} style={styles.chip}>
            <Text style={styles.chipText}>{chip}</Text>
          </View>
        ))}
      </View>
    </Section>
  );
}

function LocationSection({ item }: { item: AnyGuideItem }) {
  const displayTown = getDisplayTown(item);
  const mapsUrl = getDirectionsUrl(item);

  return (
    <Section title="Location">
      <View style={styles.locationPanel}>
        <View style={styles.locationCopy}>
          <Text style={styles.locationName}>{item.location.name}</Text>
          <Text style={styles.locationAddress}>{item.location.address}</Text>
          <Text style={styles.locationTown}>{displayTown}</Text>
        </View>
        <MapEmbed item={item} />
        <Pressable style={styles.directionsButton} onPress={() => Linking.openURL(mapsUrl)}>
          <Text style={styles.directionsButtonText}>Directions</Text>
        </Pressable>
      </View>
    </Section>
  );
}

function MapEmbed({ item }: { item: AnyGuideItem }) {
  return (
    <View style={styles.mapEmbed}>
      <View style={[styles.mapRoad, styles.mapRoadOne]} />
      <View style={[styles.mapRoad, styles.mapRoadTwo]} />
      <View style={[styles.mapRoad, styles.mapRoadThree]} />
      <View style={styles.mapPin}>
        <View style={styles.mapPinDot} />
      </View>
      <Text style={styles.mapTown} numberOfLines={1}>
        {getDisplayTown(item)}
      </Text>
    </View>
  );
}

function NearbySection({ groups }: { groups: NearbyGroups }) {
  if (!groups.attractions.length && !groups.restaurants.length && !groups.sameTown.length) {
    return null;
  }

  return (
    <Section title="Nearby">
      <NearbyGroup title="Attractions" items={groups.attractions} />
      <NearbyGroup title="Restaurants" items={groups.restaurants} />
      <NearbyGroup title="Same Town" items={groups.sameTown} />
    </Section>
  );
}

function NearbyGroup({ title, items }: { title: string; items: AnyGuideItem[] }) {
  if (!items.length) {
    return null;
  }

  return (
    <View style={styles.nearbyGroup}>
      <Text style={styles.nearbyGroupTitle}>{title}</Text>
      <View style={styles.nearbyList}>
        {items.map((nearbyItem) => (
          <Link key={nearbyItem.id} href={{ pathname: '/details/[id]', params: { id: nearbyItem.id } }} asChild>
            <Pressable style={styles.nearbyRow}>
              <View style={styles.nearbyText}>
                <Text style={styles.nearbyTitle} numberOfLines={1}>
                  {nearbyItem.title}
                </Text>
                <Text style={styles.nearbyMeta} numberOfLines={1}>
                  {nearbyItem.category} · {getDisplayTown(nearbyItem)}
                </Text>
                <VermontRating rating={nearbyItem.rating} reviewCount={nearbyItem.userRatingsTotal} compact />
              </View>
              <Text style={styles.nearbyArrow}>View</Text>
            </Pressable>
          </Link>
        ))}
      </View>
    </View>
  );
}

function getDetailChips(item: AnyGuideItem) {
  const chips: string[] = [item.category];

  if (item.isFamilyFriendly) {
    chips.push('Family Friendly');
  }

  if (item.primaryType === 'dog_park') {
    chips.push('Dog Friendly');
  }

  if (rainyDayCategories.has(item.category)) {
    chips.push('Rainy Day Friendly');
  }

  if (isEventItem(item)) {
    chips.push(formatEventFullDate(item));
    chips.push(formatEventTimeRange(item));
  }

  if (item.cost) {
    chips.push(item.cost);
  }

  return Array.from(new Set(chips.filter(Boolean)));
}

function getNearbyGroups(item: AnyGuideItem): NearbyGroups {
  const town = getDisplayTown(item);
  const nearbyItems = importedPlaces
    .filter((place) => place.id !== item.id)
    .map((place) => ({
      place,
      distance: getDistanceMiles(
        item.location.latitude,
        item.location.longitude,
        place.location.latitude,
        place.location.longitude,
      ),
      isSameTown: getDisplayTown(place) === town,
    }))
    .filter(({ distance, isSameTown }) => distance <= 12 || isSameTown)
    .sort((a, b) => a.distance - b.distance);

  const attractions = nearbyItems
    .filter(({ place }) => place.kind === 'attraction' || place.kind === 'outdoor')
    .slice(0, 3)
    .map(({ place }) => place);
  const restaurants = nearbyItems
    .filter(({ place }) => place.kind === 'restaurant')
    .slice(0, 3)
    .map(({ place }) => place);
  const featuredIds = new Set([...attractions, ...restaurants].map((place) => place.id));
  const sameTown = nearbyItems
    .filter(({ isSameTown, place }) => isSameTown && !featuredIds.has(place.id))
    .slice(0, 3)
    .map(({ place }) => place);

  return {
    attractions,
    restaurants,
    sameTown,
  };
}

function getDistanceMiles(lat1: number, lng1: number, lat2: number, lng2: number) {
  const earthRadiusMiles = 3958.8;
  const latDelta = toRadians(lat2 - lat1);
  const lngDelta = toRadians(lng2 - lng1);
  const a =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(lngDelta / 2) ** 2;

  return 2 * earthRadiusMiles * Math.asin(Math.sqrt(a));
}

function toRadians(degrees: number) {
  return degrees * (Math.PI / 180);
}

function getDirectionsUrl(item: AnyGuideItem) {
  const query = `${item.location.latitude},${item.location.longitude} ${item.location.address}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function getDisplayTown(item: AnyGuideItem) {
  return item.detectedTown ?? item.location.town;
}

function isEventItem(item: AnyGuideItem): item is EventItem {
  return item.kind === 'event';
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
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.forestGreen,
    borderColor: theme.colors.forestGreen,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flex: 1,
    padding: theme.spacing.md,
  },
  primaryButtonActive: {
    backgroundColor: theme.colors.deepForest,
    borderColor: theme.colors.deepForest,
  },
  primaryButtonText: {
    color: theme.colors.buttonCream,
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.forestGreen,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flex: 1,
    padding: theme.spacing.md,
  },
  secondaryButtonText: {
    color: theme.colors.forestGreen,
    fontSize: 16,
    fontWeight: '800',
  },
  section: {
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },
  prioritySection: {
    borderTopWidth: 0,
    marginTop: 0,
    paddingTop: 0,
  },
  sectionTitle: {
    color: theme.colors.forestGreen,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
  },
  body: {
    color: theme.colors.slate,
    fontSize: 16,
    lineHeight: 23,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  chip: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  chipText: {
    color: theme.colors.slate,
    fontSize: 14,
    fontWeight: '700',
  },
  locationPanel: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    overflow: 'hidden',
  },
  locationCopy: {
    padding: theme.spacing.md,
  },
  locationName: {
    color: theme.colors.slate,
    fontSize: 18,
    fontWeight: '800',
  },
  locationAddress: {
    color: theme.colors.slate,
    fontSize: 15,
    lineHeight: 21,
    marginTop: theme.spacing.sm,
  },
  locationTown: {
    color: theme.colors.muted,
    fontSize: 14,
    fontWeight: '700',
    marginTop: theme.spacing.xs,
  },
  mapEmbed: {
    backgroundColor: theme.colors.cream,
    borderColor: theme.colors.border,
    borderTopWidth: 1,
    height: 170,
    overflow: 'hidden',
    position: 'relative',
  },
  mapRoad: {
    backgroundColor: theme.colors.border,
    borderRadius: 999,
    height: 10,
    position: 'absolute',
  },
  mapRoadOne: {
    left: -24,
    top: 62,
    transform: [{ rotate: '-16deg' }],
    width: 260,
  },
  mapRoadTwo: {
    right: -24,
    top: 100,
    transform: [{ rotate: '22deg' }],
    width: 240,
  },
  mapRoadThree: {
    left: 36,
    top: 28,
    transform: [{ rotate: '78deg' }],
    width: 180,
  },
  mapPin: {
    alignItems: 'center',
    backgroundColor: theme.colors.forestGreen,
    borderColor: theme.colors.buttonCream,
    borderRadius: 999,
    borderWidth: 3,
    height: 42,
    justifyContent: 'center',
    left: '50%',
    marginLeft: -21,
    marginTop: -21,
    position: 'absolute',
    top: '50%',
    width: 42,
  },
  mapPinDot: {
    backgroundColor: theme.colors.buttonCream,
    borderRadius: 999,
    height: 10,
    width: 10,
  },
  mapTown: {
    bottom: theme.spacing.md,
    color: theme.colors.muted,
    fontSize: 14,
    fontWeight: '800',
    left: theme.spacing.md,
    position: 'absolute',
    right: theme.spacing.md,
    textTransform: 'uppercase',
  },
  directionsButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.forestGreen,
    margin: theme.spacing.md,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.md,
  },
  directionsButtonText: {
    color: theme.colors.buttonCream,
    fontSize: 16,
    fontWeight: '800',
  },
  nearbyGroup: {
    marginTop: theme.spacing.md,
  },
  nearbyGroupTitle: {
    color: theme.colors.slate,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: theme.spacing.sm,
  },
  nearbyList: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    overflow: 'hidden',
  },
  nearbyRow: {
    alignItems: 'center',
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: theme.spacing.md,
    padding: theme.spacing.md,
  },
  nearbyText: {
    flex: 1,
    minWidth: 0,
  },
  nearbyTitle: {
    color: theme.colors.slate,
    fontSize: 15,
    fontWeight: '800',
  },
  nearbyMeta: {
    color: theme.colors.muted,
    fontSize: 13,
    marginTop: theme.spacing.xs,
  },
  nearbyArrow: {
    color: theme.colors.forestGreen,
    fontSize: 13,
    fontWeight: '800',
  },
});
