import { Link } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { EventCard } from '@/components/EventCard';
import { sampleEvents } from '@/data/events';
import { theme } from '@/constants/Colors';

export default function EventsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Northeast Kingdom</Text>
        <Text style={styles.title}>NEK Events</Text>
      </View>

      <FlatList
        data={sampleEvents}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Link href={`/events/${item.id}`} asChild>
            <Pressable style={({ pressed }) => [styles.cardPressable, pressed && styles.cardPressed]}>
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
  header: {
    paddingBottom: theme.spacing.md,
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
  listContent: {
    gap: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xl,
  },
  cardPressable: {
    borderRadius: theme.radius.sm,
  },
  cardPressed: {
    opacity: 0.85,
  },
});
