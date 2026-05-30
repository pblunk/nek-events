import { Link } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { EventCard } from '@/components/EventCard';
import { sampleEvents } from '@/data/events';
import { theme } from '@/constants/Colors';

export default function EventsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>Northeast Kingdom</Text>
      <Text style={styles.title}>Local Events</Text>
      <Text style={styles.subtitle}>A simple starting point for browsing community events across the NEK.</Text>

      <FlatList
        data={sampleEvents}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Link href={`/events/${item.id}`} asChild>
            <Pressable>
              <EventCard event={item} />
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
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
  },
  eyebrow: {
    color: theme.colors.forestGreen,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    color: theme.colors.slate,
    fontSize: 32,
    fontWeight: '800',
    marginTop: theme.spacing.xs,
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: 16,
    lineHeight: 22,
    marginTop: theme.spacing.sm,
  },
  listContent: {
    gap: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
});
