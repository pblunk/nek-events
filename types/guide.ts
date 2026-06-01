export type GuideItemKind = 'event' | 'restaurant' | 'attraction' | 'outdoor';

export type GuideCategory =
  | 'Things To Do'
  | 'Outdoor Adventures'
  | 'Food & Drink'
  | 'Farm Stands'
  | 'Covered Bridges'
  | 'Family Friendly'
  | 'Outdoors'
  | 'Arts & Culture'
  | 'Attractions'
  | 'Places to Stay'
  | 'Shopping'
  | 'Music'
  | 'Arts'
  | 'Community'
  | 'Farmers Market'
  | 'Food'
  | 'Outdoor'
  | 'Family';

export type GuideTown =
  | 'St. Johnsbury'
  | 'Lyndonville'
  | 'Lyndon'
  | 'Newport'
  | 'Derby'
  | 'Coventry'
  | 'Burke'
  | 'East Burke'
  | 'Hardwick'
  | 'Greensboro'
  | 'Danville'
  | 'Craftsbury'
  | 'Westmore'
  | 'Barton'
  | 'Orleans'
  | 'Glover'
  | 'Peacham'
  | 'Barnet'
  | 'Walden'
  | 'Wheelock'
  | 'Island Pond'
  | 'Brighton'
  | 'Newark'
  | 'Irasburg';

export type GuideLocation = {
  name: string;
  address: string;
  town: GuideTown;
  latitude: number;
  longitude: number;
};

export type GuideItem = {
  id: string;
  kind: GuideItemKind;
  title: string;
  description: string;
  category: GuideCategory;
  location: GuideLocation;
  imageUrl?: string;
  imageCredit?: string;
  imageSource?: 'Mock' | 'Unsplash' | 'Google Places Photos' | 'Wikimedia Commons';
  sourceUrl?: string;
  cost?: string;
  isFamilyFriendly?: boolean;
  rating?: number | null;
  userRatingsTotal?: number | null;
  websiteUri?: string | null;
  googleMapsUri?: string | null;
  primaryType?: string | null;
  sourceTown?: string | null;
  detectedTown?: string | null;
};

export type EventItem = GuideItem & {
  kind: 'event';
  startDate: string;
  endDate: string;
};

export type RestaurantItem = GuideItem & {
  kind: 'restaurant';
  cuisine: string;
};

export type AttractionItem = GuideItem & {
  kind: 'attraction';
};

export type OutdoorDestinationItem = GuideItem & {
  kind: 'outdoor';
  difficulty?: 'Easy' | 'Moderate' | 'Challenging';
};

export type AnyGuideItem = EventItem | RestaurantItem | AttractionItem | OutdoorDestinationItem;

export type DiscoverSection = {
  title: GuideCategory;
  items: AnyGuideItem[];
};
