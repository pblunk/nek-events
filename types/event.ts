export type EventCategory =
  | 'Music'
  | 'Food'
  | 'Farmers Market'
  | 'Outdoor'
  | 'Family'
  | 'Arts'
  | 'Community';

export type Town =
  | 'St. Johnsbury'
  | 'Lyndonville'
  | 'Newport'
  | 'Burke'
  | 'Hardwick'
  | 'Danville'
  | 'Craftsbury';

export type Venue = {
  id: string;
  name: string;
  address?: string;
  town: Town;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  town: Town;
  venue: Venue;
  category: EventCategory;
  imageUrl: string;
  sourceUrl: string;
  cost: string;
  isFamilyFriendly: boolean;
};
