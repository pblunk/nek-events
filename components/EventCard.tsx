import { Image, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/Colors';
import { EventItem } from '@/types/guide';
import { formatEventDateRange } from '@/utils/formatEvent';
import { getGuideItemImage } from '@/utils/images';

type EventCardProps = {
  event: EventItem;
};

export function EventCard({ event }: EventCardProps) {
  const image = getGuideItemImage(event);

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Image source={{ uri: image.imageUrl }} style={styles.thumbnail} />
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.date}>{formatEventDateRange(event)}</Text>
            <Text style={styles.category}>{event.category}</Text>
          </View>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {event.description}
          </Text>
          <Text style={styles.meta}>
            {event.location.town} · {event.location.name}
          </Text>
          <Text style={styles.venue}>{event.cost}</Text>
          {event.isFamilyFriendly ? <Text style={styles.family}>Family friendly</Text> : null}
        </View>
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
    padding: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  thumbnail: {
    backgroundColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    height: 96,
    width: 96,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: theme.spacing.sm,
    justifyContent: 'space-between',
  },
  date: {
    color: theme.colors.forestGreen,
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
  },
  category: {
    backgroundColor: theme.colors.cream,
    borderRadius: theme.radius.sm,
    color: theme.colors.forestGreen,
    fontSize: 12,
    fontWeight: '700',
    overflow: 'hidden',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
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
  description: {
    color: theme.colors.muted,
    fontSize: 15,
    lineHeight: 21,
    marginTop: theme.spacing.sm,
  },
  venue: {
    color: theme.colors.muted,
    fontSize: 14,
    marginTop: theme.spacing.xs,
  },
  family: {
    color: theme.colors.forestGreen,
    fontSize: 13,
    fontWeight: '700',
    marginTop: theme.spacing.sm,
  },
});
