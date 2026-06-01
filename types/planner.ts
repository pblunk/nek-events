import { AnyGuideItem, GuideTown } from '@/types/guide';

export type TripLength = 'half-day' | 'full-day' | 'weekend';

export type PlannerInterest = 'food' | 'outdoors' | 'family' | 'scenic' | 'shopping' | 'events';

export type ActivityLevel = 'relaxed' | 'moderate' | 'active';

export type ItineraryPeriod = 'Morning' | 'Lunch' | 'Afternoon' | 'Evening';

export type PlannerPreferences = {
  startingTown: GuideTown;
  tripLength: TripLength;
  interests: PlannerInterest[];
  activityLevel: ActivityLevel;
};

export type ItineraryRecommendation = {
  item: AnyGuideItem;
  note: string;
};

export type Itinerary = Record<ItineraryPeriod, ItineraryRecommendation[]>;
