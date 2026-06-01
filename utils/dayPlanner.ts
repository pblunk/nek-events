import { allGuideItems, attractions, events, outdoorDestinations, restaurants } from '@/data/events';
import { AnyGuideItem, GuideTown, OutdoorDestinationItem } from '@/types/guide';
import {
  ActivityLevel,
  Itinerary,
  ItineraryPeriod,
  PlannerInterest,
  PlannerPreferences,
  TripLength,
} from '@/types/planner';

export const plannerTowns: GuideTown[] = [
  'St. Johnsbury',
  'Lyndonville',
  'Newport',
  'Burke',
  'Hardwick',
  'Greensboro',
  'Danville',
  'Craftsbury',
  'Westmore',
];

export const tripLengthOptions: { label: string; value: TripLength }[] = [
  { label: 'Half day', value: 'half-day' },
  { label: 'Full day', value: 'full-day' },
  { label: 'Weekend', value: 'weekend' },
];

export const interestOptions: { label: string; value: PlannerInterest }[] = [
  { label: 'Food', value: 'food' },
  { label: 'Outdoors', value: 'outdoors' },
  { label: 'Family', value: 'family' },
  { label: 'Scenic', value: 'scenic' },
  { label: 'Shopping', value: 'shopping' },
  { label: 'Events', value: 'events' },
];

export const activityLevelOptions: { label: string; value: ActivityLevel }[] = [
  { label: 'Relaxed', value: 'relaxed' },
  { label: 'Moderate', value: 'moderate' },
  { label: 'Active', value: 'active' },
];

const periodOrder: ItineraryPeriod[] = ['Morning', 'Lunch', 'Afternoon', 'Evening'];

export function generateItinerary(preferences: PlannerPreferences): Itinerary {
  const usedIds = new Set<string>();
  const slotsPerPeriod = preferences.tripLength === 'weekend' ? 2 : 1;

  return periodOrder.reduce<Itinerary>((itinerary, period) => {
    itinerary[period] = getCandidatesForPeriod(period, preferences)
      .filter((item) => !usedIds.has(item.id))
      .sort((a, b) => scoreItem(b, preferences, period) - scoreItem(a, preferences, period))
      .slice(0, slotsPerPeriod)
      .map((item) => {
        usedIds.add(item.id);
        return {
          item,
          note: getPlannerNote(item, preferences, period),
        };
      });

    return itinerary;
  }, createEmptyItinerary());
}

function createEmptyItinerary(): Itinerary {
  return {
    Morning: [],
    Lunch: [],
    Afternoon: [],
    Evening: [],
  };
}

function getCandidatesForPeriod(period: ItineraryPeriod, preferences: PlannerPreferences) {
  if (period === 'Lunch') {
    return [...restaurants, ...events.filter((item) => item.category === 'Food' || item.category === 'Farmers Market')];
  }

  if (period === 'Morning') {
    return [...outdoorDestinations, ...attractions, ...events.filter((item) => item.category === 'Farmers Market')];
  }

  if (period === 'Afternoon') {
    return [...attractions, ...outdoorDestinations, ...events];
  }

  return [...events, ...restaurants, ...attractions.filter((item) => item.category === 'Community')];
}

function scoreItem(item: AnyGuideItem, preferences: PlannerPreferences, period: ItineraryPeriod) {
  let score = allGuideItems.length - allGuideItems.findIndex((guideItem) => guideItem.id === item.id);

  if (item.location.town === preferences.startingTown) {
    score += 20;
  }

  for (const interest of preferences.interests) {
    if (matchesInterest(item, interest)) {
      score += 12;
    }
  }

  if (preferences.activityLevel === 'relaxed' && item.kind !== 'outdoor') {
    score += 6;
  }

  if (preferences.activityLevel === 'moderate' && (item.kind === 'attraction' || item.kind === 'event')) {
    score += 5;
  }

  if (preferences.activityLevel === 'active' && item.kind === 'outdoor') {
    score += 10;
  }

  if (item.kind === 'outdoor' && !matchesActivityLevel(item, preferences.activityLevel)) {
    score -= 8;
  }

  if (period === 'Evening' && (item.category === 'Music' || item.category === 'Food & Drink')) {
    score += 7;
  }

  return score;
}

function matchesInterest(item: AnyGuideItem, interest: PlannerInterest) {
  if (interest === 'food') {
    return item.kind === 'restaurant' || item.category === 'Food' || item.category === 'Food & Drink';
  }

  if (interest === 'outdoors') {
    return item.kind === 'outdoor' || item.category === 'Outdoor Adventures' || item.category === 'Outdoors' || item.category === 'Outdoor';
  }

  if (interest === 'family') {
    return item.isFamilyFriendly === true || item.category === 'Family Friendly' || item.category === 'Family';
  }

  if (interest === 'scenic') {
    return item.category === 'Covered Bridges' || item.title.includes('Lake') || item.kind === 'outdoor';
  }

  if (interest === 'shopping') {
    return item.category === 'Farm Stands' || item.category === 'Farmers Market' || item.category === 'Shopping';
  }

  return item.kind === 'event';
}

function matchesActivityLevel(item: OutdoorDestinationItem, activityLevel: ActivityLevel) {
  if (activityLevel === 'relaxed') {
    return item.difficulty === 'Easy';
  }

  if (activityLevel === 'moderate') {
    return item.difficulty !== 'Challenging';
  }

  return true;
}

function getPlannerNote(item: AnyGuideItem, preferences: PlannerPreferences, period: ItineraryPeriod) {
  if (item.location.town === preferences.startingTown) {
    return `${period} pick near your starting point in ${preferences.startingTown}.`;
  }

  if (item.kind === 'restaurant') {
    return `A good ${period.toLowerCase()} stop for food and a slower travel rhythm.`;
  }

  if (item.kind === 'outdoor') {
    return `A ${item.difficulty?.toLowerCase() ?? 'flexible'} outdoor stop that fits a ${preferences.activityLevel} pace.`;
  }

  if (item.kind === 'event') {
    return `Timed around local happenings, with a visitor-friendly stop nearby.`;
  }

  return `A worthwhile NEK stop for this part of the day.`;
}
