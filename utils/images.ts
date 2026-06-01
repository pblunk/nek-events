import { AnyGuideItem, GuideCategory } from '@/types/guide';

type FallbackImage = {
  imageUrl: string;
  imageCredit: string;
  imageSource: 'Unsplash';
};

const categoryFallbackImages: Record<GuideCategory, FallbackImage> = {
  'Things To Do': {
    imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'Unsplash community photo',
    imageSource: 'Unsplash',
  },
  'Outdoor Adventures': {
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'Unsplash outdoor photo',
    imageSource: 'Unsplash',
  },
  'Food & Drink': {
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'Unsplash food photo',
    imageSource: 'Unsplash',
  },
  'Farm Stands': {
    imageUrl: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'Unsplash farm stand photo',
    imageSource: 'Unsplash',
  },
  'Covered Bridges': {
    imageUrl: 'https://images.unsplash.com/photo-1507041957456-9c397ce39c97?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'Unsplash covered bridge photo',
    imageSource: 'Unsplash',
  },
  'Family Friendly': {
    imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'Unsplash family travel photo',
    imageSource: 'Unsplash',
  },
  Outdoors: {
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'Unsplash outdoor photo',
    imageSource: 'Unsplash',
  },
  'Arts & Culture': {
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'Unsplash arts and culture photo',
    imageSource: 'Unsplash',
  },
  Attractions: {
    imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'Unsplash visitor attraction photo',
    imageSource: 'Unsplash',
  },
  'Places to Stay': {
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'Unsplash lodging photo',
    imageSource: 'Unsplash',
  },
  Shopping: {
    imageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'Unsplash bookstore photo',
    imageSource: 'Unsplash',
  },
  Music: {
    imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'Unsplash live music photo',
    imageSource: 'Unsplash',
  },
  Arts: {
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'Unsplash arts photo',
    imageSource: 'Unsplash',
  },
  Community: {
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'Unsplash community event photo',
    imageSource: 'Unsplash',
  },
  'Farmers Market': {
    imageUrl: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'Unsplash farmers market photo',
    imageSource: 'Unsplash',
  },
  Food: {
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'Unsplash food photo',
    imageSource: 'Unsplash',
  },
  Outdoor: {
    imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'Unsplash landscape photo',
    imageSource: 'Unsplash',
  },
  Family: {
    imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80',
    imageCredit: 'Unsplash family photo',
    imageSource: 'Unsplash',
  },
};

export function getGuideItemImage(item: AnyGuideItem) {
  const fallback = categoryFallbackImages[item.category];

  return {
    imageUrl: item.imageUrl ?? fallback.imageUrl,
    imageCredit: item.imageCredit ?? fallback.imageCredit,
    imageSource: item.imageSource ?? fallback.imageSource,
    isFallback: !item.imageUrl,
  };
}
