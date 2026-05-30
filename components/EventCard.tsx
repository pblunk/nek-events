import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/Colors';
import { Event } from '@/types/event';

type EventCardProps = {
  event: Event;
};

export function EventCard({ event }: EventCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.date}>{event.date}</Text>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.meta}>
        {event.time} · {event.town}
      </Text>
      <Text style={styles.venue}>{event.venue}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    padding: theme.spacing.md,
  },
  date: {
    color: theme.colors.forestGreen,
    fontSize: 14,
    fontWeight: '700',
  },
  title: {
    color: theme.colors.slate,
    fontSize: 20,
    fontWeight: '800',
    marginTop: theme.spacing.sm,
  },
  meta: {
    color: theme.colors.slate,
    fontSize: 15,
    marginTop: theme.spacing.sm,
  },
  venue: {
    color: theme.colors.muted,
    fontSize: 14,
    marginTop: theme.spacing.xs,
  },
});
