import placesJson from './places.json';

import { AnyGuideItem, DiscoverSection, GuideCategory, GuideTown } from '@/types/guide';

type ImportedPlace = {
  googlePlaceId: string;
  name: string | null;
  categories: string[];
  primaryType: string | null;
  importCategory: string;
  importedNearTown: string;
  sourceTown?: string;
  sourceTowns?: string[];
  detectedTown?: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  rating: number | null;
  userRatingsTotal: number | null;
  websiteUri: string | null;
  googleMapsUri: string | null;
  image: {
    imageUrl: string | null;
    imageCredit: string | null;
    imageSource: 'Google Places Photos' | null;
  };
};

type PlacesJson = {
  places: ImportedPlace[];
};

const placesData = placesJson as PlacesJson;

const townNames: GuideTown[] = [
  'St. Johnsbury',
  'Lyndonville',
  'Lyndon',
  'Burke',
  'East Burke',
  'Newport',
  'Derby',
  'Coventry',
  'Barton',
  'Orleans',
  'Glover',
  'Hardwick',
  'Greensboro',
  'Craftsbury',
  'Danville',
  'Peacham',
  'Barnet',
  'Walden',
  'Wheelock',
  'Westmore',
  'Island Pond',
  'Brighton',
  'Newark',
];
const targetTowns = new Set<string>(townNames);
const NEK_BOUNDS = {
  minLat: 44.25,
  maxLat: 45.05,
  minLng: -72.65,
  maxLng: -71.45,
};

const categoryLabels: Record<string, GuideCategory> = {
  restaurant: 'Food & Drink',
  cafe: 'Food & Drink',
  bakery: 'Food & Drink',
  park: 'Outdoors',
  campground: 'Outdoors',
  museum: 'Arts & Culture',
  art_gallery: 'Arts & Culture',
  tourist_attraction: 'Attractions',
  lodging: 'Places to Stay',
  bookstore: 'Shopping',
};

const blockedPlaceTypes = new Set([
  'hardware_store',
  'car_dealer',
  'car_repair',
  'gas_station',
  'convenience_store',
  'supermarket',
  'furniture_store',
  'home_goods_store',
  'electronics_store',
  'clothing_store',
  'department_store',
  'pharmacy',
  'bank',
  'atm',
  'real_estate_agency',
  'insurance_agency',
  'lawyer',
  'accounting',
  'dentist',
  'doctor',
  'veterinary_care',
  'storage',
  'moving_company',
]);
const blockedNameWords = [
  'hardware',
  'auto',
  'motors',
  'dealership',
  'tire',
  'repair',
  'dental',
  'insurance',
  'bank',
  'pharmacy',
  'storage',
];

const excludedOutOfRegionTowns = new Set(['Morrisville', 'Morristown', 'Stowe', 'Waterbury', 'Montpelier', 'Barre']);

function normalizeTown(town: string): GuideTown {
  return townNames.includes(town as GuideTown) ? (town as GuideTown) : 'St. Johnsbury';
}

function normalizeTownName(town: string) {
  const cleanedTown = town.replace(/\s+USA$/i, '').trim();

  if (cleanedTown === 'St Johnsbury') {
    return 'St. Johnsbury';
  }

  return cleanedTown;
}

function detectTownFromAddress(address: string | null) {
  if (!address) {
    return null;
  }

  const vermontMatch = address.match(/,\s*([^,]+),\s*VT(?:\s+\d{5})?/i);
  if (vermontMatch?.[1]) {
    return normalizeTownName(vermontMatch[1]);
  }

  const parts = address.split(',').map((part) => part.trim()).filter(Boolean);
  return parts.length >= 2 ? normalizeTownName(parts[parts.length - 2]) : null;
}

function isVermontAddress(address: string | null) {
  return Boolean(address && (/\bVT\b/i.test(address) || /\bVermont\b/i.test(address)));
}

function isOutOfStateOrCanadaAddress(address: string | null) {
  return Boolean(
    !address || /\bNH\b/i.test(address) || /New Hampshire/i.test(address) || /Québec|Quebec|Canada|\bQC\b/i.test(address),
  );
}

function isInsideNekBounds(latitude: number | null, longitude: number | null) {
  return (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    latitude >= NEK_BOUNDS.minLat &&
    latitude <= NEK_BOUNDS.maxLat &&
    longitude >= NEK_BOUNDS.minLng &&
    longitude <= NEK_BOUNDS.maxLng
  );
}

function isInNortheastKingdom(place: ImportedPlace, detectedTown: string | null) {
  return (
    isVermontAddress(place.address) &&
    !isOutOfStateOrCanadaAddress(place.address) &&
    isInsideNekBounds(place.latitude, place.longitude) &&
    Boolean(!detectedTown || targetTowns.has(detectedTown))
  );
}

function getItemKind(importCategory: string): 'restaurant' | 'outdoor' | 'attraction' {
  if (importCategory === 'restaurant' || importCategory === 'cafe' || importCategory === 'bakery') {
    return 'restaurant';
  }

  if (importCategory === 'park' || importCategory === 'campground') {
    return 'outdoor';
  }

  return 'attraction';
}

function getCategory(importCategory: string): GuideCategory {
  return categoryLabels[importCategory] ?? 'Things To Do';
}

export const importedPlaces = placesData.places
  .filter((place) => {
    const sourceTown = place.sourceTown ?? place.importedNearTown;
    const detectedTown = place.detectedTown ?? detectTownFromAddress(place.address);
    const name = place.name?.toLowerCase() ?? '';

    return (
      place.googlePlaceId &&
      place.name &&
      place.address &&
      place.latitude &&
      place.longitude &&
      isInNortheastKingdom(place, detectedTown) &&
      !(detectedTown && excludedOutOfRegionTowns.has(detectedTown) && detectedTown !== sourceTown) &&
      !blockedPlaceTypes.has(place.primaryType ?? '') &&
      !place.categories.some((category) => blockedPlaceTypes.has(category)) &&
      !blockedNameWords.some((word) => name.includes(word))
    );
  })
  .map((place): AnyGuideItem => {
    const category = getCategory(place.importCategory);
    const kind = getItemKind(place.importCategory);
    const sourceTown = place.sourceTown ?? place.importedNearTown;
    const detectedTown = place.detectedTown ?? detectTownFromAddress(place.address);
    const displayTown = detectedTown ?? sourceTown;
    const base = {
      id: `place-${place.googlePlaceId}`,
      kind,
      title: place.name ?? 'Unnamed place',
      description: `${place.name ?? 'Imported place'} is a ${category.toLowerCase()} stop in ${displayTown}.${
        place.rating ? ` Rated ${place.rating.toFixed(1)} by visitors.` : ''
      }`,
      category,
      location: {
        name: place.name ?? 'Unnamed place',
        address: place.address ?? 'Address unavailable',
        town: normalizeTown(sourceTown),
        latitude: place.latitude ?? 0,
        longitude: place.longitude ?? 0,
      },
      imageUrl: place.image?.imageUrl ?? undefined,
      imageCredit: place.image?.imageCredit ?? undefined,
      imageSource: place.image?.imageSource ?? undefined,
      sourceUrl: place.googleMapsUri ?? place.websiteUri ?? undefined,
      rating: place.rating,
      userRatingsTotal: place.userRatingsTotal,
      websiteUri: place.websiteUri,
      googleMapsUri: place.googleMapsUri,
      primaryType: place.primaryType,
      sourceTown,
      detectedTown,
      isFamilyFriendly: place.importCategory !== 'bar',
    };

    if (kind === 'restaurant') {
      return {
        ...base,
        kind,
        cuisine: place.primaryType?.replaceAll('_', ' ') ?? 'Food and drink',
      };
    }

    if (kind === 'outdoor') {
      return {
        ...base,
        kind,
        difficulty: 'Easy',
      };
    }

    return {
      ...base,
      kind,
    };
  });

export const placeCategories = Array.from(new Set(importedPlaces.map((place) => place.category))).sort();
export const placeTowns = Array.from(
  new Set(importedPlaces.map((place) => place.detectedTown ?? place.sourceTown ?? place.location.town)),
).sort();

export const importedDiscoverSections: DiscoverSection[] = [
  {
    title: 'Food & Drink',
    items: importedPlaces.filter((place) => place.category === 'Food & Drink').slice(0, 10),
  },
  {
    title: 'Outdoors',
    items: importedPlaces.filter((place) => place.category === 'Outdoors').slice(0, 10),
  },
  {
    title: 'Attractions',
    items: importedPlaces.filter((place) => place.category === 'Attractions').slice(0, 10),
  },
  {
    title: 'Arts & Culture',
    items: importedPlaces.filter((place) => place.category === 'Arts & Culture').slice(0, 10),
  },
];

export function getImportedPlaceById(id: string) {
  return importedPlaces.find((place) => place.id === id);
}
