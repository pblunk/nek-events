import { Link } from 'expo-router';
import { type ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GuideCard } from '@/components/GuideCard';
import { theme } from '@/constants/Colors';
import {
  activityLevelOptions,
  generateItinerary,
  interestOptions,
  plannerTowns,
  tripLengthOptions,
} from '@/utils/dayPlanner';
import { ActivityLevel, ItineraryRecommendation, PlannerInterest, TripLength } from '@/types/planner';
import { GuideTown } from '@/types/guide';

export function PlannerContent() {
  const insets = useSafeAreaInsets();
  const [startingTown, setStartingTown] = useState<GuideTown>('St. Johnsbury');
  const [tripLength, setTripLength] = useState<TripLength>('full-day');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
  const [interests, setInterests] = useState<PlannerInterest[]>(['outdoors', 'food']);

  const itinerary = useMemo(
    () =>
      generateItinerary({
        startingTown,
        tripLength,
        interests,
        activityLevel,
      }),
    [activityLevel, interests, startingTown, tripLength],
  );

  const toggleInterest = (interest: PlannerInterest) => {
    setInterests((currentInterests) =>
      currentInterests.includes(interest)
        ? currentInterests.filter((currentInterest) => currentInterest !== interest)
        : [...currentInterests, interest],
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}
      showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Build a route</Text>
        <Text style={styles.title}>Day Planner</Text>
        <Text style={styles.subtitle}>Choose your pace and interests to create a simple NEK itinerary.</Text>
      </View>

      <PlannerSection title="Starting town">
        <View style={styles.chipWrap}>
          {plannerTowns.map((town) => (
            <ChoiceChip key={town} label={town} selected={startingTown === town} onPress={() => setStartingTown(town)} />
          ))}
        </View>
      </PlannerSection>

      <PlannerSection title="Trip length">
        <View style={styles.chipWrap}>
          {tripLengthOptions.map((option) => (
            <ChoiceChip
              key={option.value}
              label={option.label}
              selected={tripLength === option.value}
              onPress={() => setTripLength(option.value)}
            />
          ))}
        </View>
      </PlannerSection>

      <PlannerSection title="Interests">
        <View style={styles.chipWrap}>
          {interestOptions.map((option) => (
            <ChoiceChip
              key={option.value}
              label={option.label}
              selected={interests.includes(option.value)}
              onPress={() => toggleInterest(option.value)}
            />
          ))}
        </View>
      </PlannerSection>

      <PlannerSection title="Activity level">
        <View style={styles.chipWrap}>
          {activityLevelOptions.map((option) => (
            <ChoiceChip
              key={option.value}
              label={option.label}
              selected={activityLevel === option.value}
              onPress={() => setActivityLevel(option.value)}
            />
          ))}
        </View>
      </PlannerSection>

      <View style={styles.itineraryHeader}>
        <Text style={styles.sectionTitle}>Suggested itinerary</Text>
        <Text style={styles.helperText}>Built from local mock data. You can refine this later with live sources.</Text>
      </View>

      {Object.entries(itinerary).map(([period, recommendations]) => (
        <View key={period} style={styles.period}>
          <Text style={styles.periodTitle}>{period}</Text>
          {recommendations.length === 0 ? (
            <Text style={styles.emptyText}>No recommendation for this time block yet.</Text>
          ) : (
            recommendations.map((recommendation) => (
              <RecommendationCard key={recommendation.item.id} recommendation={recommendation} />
            ))
          )}
        </View>
      ))}
    </ScrollView>
  );
}

function PlannerSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.controlCard}>
      <Text style={styles.controlTitle}>{title}</Text>
      {children}
    </View>
  );
}

function ChoiceChip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable style={[styles.chip, selected && styles.chipSelected]} onPress={onPress}>
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

function RecommendationCard({ recommendation }: { recommendation: ItineraryRecommendation }) {
  return (
    <View style={styles.recommendation}>
      <Link href={{ pathname: '/details/[id]', params: { id: recommendation.item.id } }} asChild>
        <Pressable style={({ pressed }) => [styles.cardPressable, pressed && styles.cardPressed]}>
          <GuideCard item={recommendation.item} compact />
        </Pressable>
      </Link>
      <Text style={styles.note}>{recommendation.note}</Text>
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
  header: {
    marginBottom: theme.spacing.lg,
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
  controlCard: {
    ...theme.shadows.card,
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  controlTitle: {
    color: theme.colors.slate,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: theme.spacing.sm,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  chip: {
    borderColor: theme.colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  chipSelected: {
    backgroundColor: theme.colors.deepForest,
    borderColor: theme.colors.deepForest,
  },
  chipText: {
    color: theme.colors.muted,
    fontSize: 14,
    fontWeight: '700',
  },
  chipTextSelected: {
    color: theme.colors.buttonCream,
  },
  itineraryHeader: {
    marginTop: theme.spacing.md,
  },
  sectionTitle: {
    color: theme.colors.slate,
    fontSize: 24,
    fontWeight: '800',
  },
  helperText: {
    color: theme.colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: theme.spacing.xs,
  },
  period: {
    marginTop: theme.spacing.lg,
  },
  periodTitle: {
    color: theme.colors.forestGreen,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: theme.spacing.md,
  },
  recommendation: {
    marginBottom: theme.spacing.md,
  },
  note: {
    color: theme.colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
  },
  emptyText: {
    color: theme.colors.muted,
    fontSize: 15,
  },
  cardPressable: {
    borderRadius: theme.radius.sm,
  },
  cardPressed: {
    opacity: 0.85,
  },
});
