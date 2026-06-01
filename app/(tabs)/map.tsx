import { Link } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GuideCard } from '@/components/GuideCard';
import { theme } from '@/constants/Colors';
import { importedPlaces } from '@/data/places';

const nearbyItems = importedPlaces.slice(0, 20);

export default function MapScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
      <Text style={styles.eyebrow}>Explore nearby</Text>
      <Text style={styles.title}>Map</Text>

      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapTitle}>Map view coming soon</Text>
        <Text style={styles.mapText}>Imported restaurants, parks, stores, museums, and attractions will appear here.</Text>
      </View>

      <Text style={styles.sectionTitle}>Nearby</Text>
      <FlatList
        data={nearbyItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Link href={{ pathname: '/details/[id]', params: { id: item.id } }} asChild>
            <Pressable style={({ pressed }) => [styles.cardPressable, pressed && styles.cardPressed]}>
              <GuideCard item={item} compact />
            </Pressable>
          </Link>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.cream,
    paddingBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  eyebrow: {
    color: theme.colors.forestGreen,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  title: {
    color: theme.colors.slate,
    fontSize: 34,
    fontWeight: '800',
    marginTop: theme.spacing.xs,
  },
  mapPlaceholder: {
    ...theme.shadows.card,
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    height: 220,
    justifyContent: 'center',
    marginTop: theme.spacing.lg,
    padding: theme.spacing.lg,
  },
  mapTitle: {
    color: theme.colors.forestGreen,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  mapText: {
    color: theme.colors.muted,
    fontSize: 15,
    lineHeight: 21,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  sectionTitle: {
    color: theme.colors.slate,
    fontSize: 22,
    fontWeight: '800',
    marginTop: theme.spacing.lg,
  },
  listContent: {
    gap: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  cardPressable: {
    borderRadius: theme.radius.sm,
  },
  cardPressed: {
    opacity: 0.85,
  },
});
