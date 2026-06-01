import { Link } from 'expo-router';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GuideCard } from '@/components/GuideCard';
import { theme } from '@/constants/Colors';
import { importedDiscoverSections } from '@/data/places';
import { AnyGuideItem, DiscoverSection } from '@/types/guide';

export default function DiscoverScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}
      showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Vermont's Northeast Kingdom</Text>
        <Text style={styles.title}>NEK Explorer</Text>
        <Text style={styles.subtitle}>Discover places to eat, wander, visit, and save for your trip.</Text>
      </View>

      {importedDiscoverSections.map((section) => (
        <DiscoverSectionList key={section.title} section={section} />
      ))}
    </ScrollView>
  );
}

function DiscoverSectionList({ section }: { section: DiscoverSection }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <FlatList
        horizontal
        data={section.items}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.sectionList}
        renderItem={({ item }) => <GuideItemLink item={item} />}
      />
    </View>
  );
}

function GuideItemLink({ item }: { item: AnyGuideItem }) {
  return (
    <Link href={{ pathname: '/details/[id]', params: { id: item.id } }} asChild>
      <Pressable style={({ pressed }) => [styles.cardPressable, pressed && styles.cardPressed]}>
        <GuideCard item={item} />
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.cream,
  },
  content: {
    paddingBottom: theme.spacing.xl,
  },
  header: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
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
  subtitle: {
    color: theme.colors.muted,
    fontSize: 16,
    lineHeight: 22,
    marginTop: theme.spacing.sm,
  },
  section: {
    marginTop: theme.spacing.lg,
  },
  sectionTitle: {
    color: theme.colors.slate,
    fontSize: 22,
    fontWeight: '800',
    paddingHorizontal: theme.spacing.md,
  },
  sectionList: {
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
  cardPressable: {
    borderRadius: theme.radius.sm,
  },
  cardPressed: {
    opacity: 0.85,
  },
});
