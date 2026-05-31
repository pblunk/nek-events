require('dotenv').config();

const fs = require('fs/promises');
const path = require('path');

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const OUTPUT_PATH = path.resolve(__dirname, '../data/places.json');
const SEARCH_RADIUS_METERS = 20000;
const PLACES_SEARCH_NEARBY_URL = 'https://places.googleapis.com/v1/places:searchNearby';
const FIELD_MASK =
  'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.websiteUri,places.googleMapsUri,places.photos,places.primaryType,places.types';

const towns = [
  { name: 'St. Johnsbury', lat: 44.4192, lng: -72.0151 },
  { name: 'Newport', lat: 44.9364, lng: -72.2051 },
  { name: 'Burke', lat: 44.5878, lng: -71.9406 },
  { name: 'Lyndonville', lat: 44.5337, lng: -72.0037 },
  { name: 'Hardwick', lat: 44.5048, lng: -72.3682 },
  { name: 'Greensboro', lat: 44.5762, lng: -72.2965 },
  { name: 'Danville', lat: 44.4117, lng: -72.1395 },
];

const categories = [
  'restaurant',
  'cafe',
  'bakery',
  'park',
  'tourist_attraction',
  'museum',
  'art_gallery',
  'store',
];

function assertApiKey() {
  if (!GOOGLE_PLACES_API_KEY) {
    throw new Error('Missing GOOGLE_PLACES_API_KEY. Add it to .env before running this script.');
  }
}

async function searchNearbyPlaces({ town, category }) {
  const response = await fetch(PLACES_SEARCH_NEARBY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
      'X-Goog-FieldMask': FIELD_MASK,
    },
    body: JSON.stringify({
      includedTypes: [category],
      maxResultCount: 20,
      locationRestriction: {
        circle: {
          center: {
            latitude: town.lat,
            longitude: town.lng,
          },
          radius: SEARCH_RADIUS_METERS,
        },
      },
    }),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(
      `Places API New request failed for ${town.name}/${category}: ${response.status} ${response.statusText} ${
        payload.error?.message ?? ''
      }`,
    );
  }

  return payload.places ?? [];
}

function normalizePlace(place, town, category) {
  const photoName = place.photos?.[0]?.name ?? null;

  return {
    googlePlaceId: place.id,
    name: place.displayName?.text ?? null,
    categories: place.types ?? [],
    primaryType: place.primaryType ?? null,
    importCategory: category,
    importedNearTown: town.name,
    address: place.formattedAddress ?? null,
    latitude: place.location?.latitude ?? null,
    longitude: place.location?.longitude ?? null,
    rating: place.rating ?? null,
    userRatingsTotal: place.userRatingCount ?? null,
    websiteUri: place.websiteUri ?? null,
    googleMapsUri: place.googleMapsUri ?? null,
    image: photoName
      ? {
          photoName,
          imageUrl: null,
          imageCredit: 'Google Places photo',
          imageSource: 'Google Places Photos',
        }
      : {
          photoName: null,
          imageUrl: null,
          imageCredit: null,
          imageSource: null,
        },
    source: {
      provider: 'Places API New',
      searchCategory: category,
      searchTown: town.name,
    },
  };
}

function mergePlace(existingPlace, nextPlace) {
  return {
    ...existingPlace,
    categories: Array.from(new Set([...existingPlace.categories, ...nextPlace.categories])),
    importCategories: Array.from(
      new Set([...(existingPlace.importCategories ?? [existingPlace.importCategory]), nextPlace.importCategory]),
    ),
    importedNearTowns: Array.from(
      new Set([...(existingPlace.importedNearTowns ?? [existingPlace.importedNearTown]), nextPlace.importedNearTown]),
    ),
  };
}

async function importGooglePlaces() {
  assertApiKey();

  const placesById = new Map();

  for (const town of towns) {
    for (const category of categories) {
      console.log(`Searching ${category} near ${town.name}...`);
      const places = await searchNearbyPlaces({ town, category });

      for (const place of places.map((result) => normalizePlace(result, town, category))) {
        if (!place.googlePlaceId) {
          continue;
        }

        const existingPlace = placesById.get(place.googlePlaceId);
        placesById.set(place.googlePlaceId, existingPlace ? mergePlace(existingPlace, place) : place);
      }
    }
  }

  const output = {
    importedAt: new Date().toISOString(),
    provider: 'Places API New Nearby Search',
    searchRadiusMeters: SEARCH_RADIUS_METERS,
    fieldMask: FIELD_MASK,
    towns,
    categories,
    count: placesById.size,
    places: Array.from(placesById.values()).sort((a, b) => a.name.localeCompare(b.name)),
  };

  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`);
  console.log(`Saved ${output.count} unique places to ${path.relative(process.cwd(), OUTPUT_PATH)}`);
}

importGooglePlaces().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
