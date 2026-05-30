import { Stack, useLocalSearchParams } from 'expo-router';
import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { sampleEvents } from '@/data/events';
import { theme } from '@/constants/Colors';
import { formatEventFullDate, formatEventTimeRange } from '@/utils/formatEvent';

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
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: event.title }} />

      {event.imageUrl ? (
        <Image source={{ uri: event.imageUrl }} style={styles.heroImage} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderText}>{event.category}</Text>
        </View>
      )}

      <View style={styles.header}>
        <Text style={styles.category}>{event.category}</Text>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.town}>{event.town}</Text>
      </View>

      <View style={styles.sectionGrid}>
        <InfoSection title="Date and time" value={formatEventFullDate(event)} detail={formatEventTimeRange(event)} />
        <InfoSection
          title="Location"
          value={event.venue.name}
          detail={event.venue.address ? `${event.venue.address}, ${event.town}` : event.town}
        />
        <InfoSection title="Cost" value={event.cost} />
        <InfoSection
          title="Family friendly"
          value={event.isFamilyFriendly ? 'Yes' : 'No'}
          detail={event.isFamilyFriendly ? 'Good fit for all ages' : 'Best for adults or experienced participants'}
        />
      </View>

      <View style={styles.descriptionCard}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.body}>{event.description}</Text>
      </View>

      {event.sourceUrl ? (
        <Pressable style={styles.sourceButton} onPress={() => Linking.openURL(event.sourceUrl!)}>
          <Text style={styles.sourceButtonText}>View Source</Text>
        </Pressable>
      ) : null}
    </ScrollView>
  );
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.cream,
  },
  content: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  heroImage: {
    aspectRatio: 16 / 10,
    backgroundColor: theme.colors.border,
    borderRadius: theme.radius.md,
    width: '100%',
  },
  imagePlaceholder: {
    alignItems: 'center',
    aspectRatio: 16 / 10,
    backgroundColor: theme.colors.forestGreen,
    borderRadius: theme.radius.md,
    justifyContent: 'center',
    width: '100%',
  },
  placeholderText: {
    color: theme.colors.cream,
    fontSize: 22,
    fontWeight: '800',
  },
  header: {
    paddingVertical: theme.spacing.lg,
  },
  category: {
    color: theme.colors.forestGreen,
    fontSize: 14,
    fontWeight: '700',
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
  sectionGrid: {
    gap: theme.spacing.md,
  },
  infoCard: {
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
    marginTop: theme.spacing.xs,
  },
  descriptionCard: {
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
  sourceButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.forestGreen,
    borderRadius: theme.radius.sm,
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
  },
  sourceButtonText: {
    color: theme.colors.cream,
    fontSize: 16,
    fontWeight: '800',
  },
});
