import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { sampleEvents } from '@/data/events';
import { theme } from '@/constants/Colors';
import { formatEventDateRange } from '@/utils/formatEvent';

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const event = sampleEvents.find((item) => item.id === id);

  if (!event) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Event not found</Text>
        <Text style={styles.body}>This placeholder event could not be loaded.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: event.title }} />
      <Text style={styles.date}>{formatEventDateRange(event)}</Text>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.meta}>
        {event.category} · {event.town}
      </Text>
      <Text style={styles.venue}>{event.venue.name}</Text>
      <Text style={styles.venue}>{event.cost}</Text>
      <Text style={styles.body}>{event.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.cream,
    padding: theme.spacing.md,
    paddingTop: theme.spacing.lg,
  },
  date: {
    color: theme.colors.forestGreen,
    fontSize: 15,
    fontWeight: '700',
  },
  title: {
    color: theme.colors.slate,
    fontSize: 30,
    fontWeight: '800',
    marginTop: theme.spacing.sm,
  },
  meta: {
    color: theme.colors.slate,
    fontSize: 17,
    marginTop: theme.spacing.md,
  },
  venue: {
    color: theme.colors.muted,
    fontSize: 16,
    marginTop: theme.spacing.xs,
  },
  body: {
    color: theme.colors.slate,
    fontSize: 16,
    lineHeight: 23,
    marginTop: theme.spacing.lg,
  },
});
