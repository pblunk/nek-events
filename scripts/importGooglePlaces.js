require('dotenv').config();

const fs = require('fs/promises');
const path = require('path');

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const OUTPUT_PATH = path.resolve(__dirname, '../data/places.json');
const LOCAL_BUSINESS_RADIUS_METERS = 8000;
const DESTINATION_RADIUS_METERS = 12000;
const PLACES_SEARCH_NEARBY_URL = 'https://places.googleapis.com/v1/places:searchNearby';
const PHOTO_MEDIA_DELAY_MS = 200;
const FIELD_MASK =
  'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.websiteUri,places.googleMapsUri,places.photos,places.primaryType,places.types';
const NEK_BOUNDS = {
  minLat: 44.25,
  maxLat: 45.05,
  minLng: -72.65,
  maxLng: -71.45,
};

const towns = [
  { name: 'St. Johnsbury', lat: 44.4192, lng: -72.0151 },
  { name: 'Lyndonville', lat: 44.5337, lng: -72.0037 },
  { name: 'Lyndon', lat: 44.5142, lng: -72.0109 },
  { name: 'Burke', lat: 44.5878, lng: -71.9406 },
  { name: 'East Burke', lat: 44.5892, lng: -71.9409 },
  { name: 'Newport', lat: 44.9364, lng: -72.2051 },
  { name: 'Derby', lat: 44.9517, lng: -72.1348 },
  { name: 'Coventry', lat: 44.8656, lng: -72.2648 },
  { name: 'Barton', lat: 44.7481, lng: -72.1762 },
  { name: 'Orleans', lat: 44.8106, lng: -72.2012 },
  { name: 'Glover', lat: 44.7084, lng: -72.2095 },
  { name: 'Hardwick', lat: 44.5048, lng: -72.3682 },
  { name: 'Greensboro', lat: 44.5762, lng: -72.2965 },
  { name: 'Craftsbury', lat: 44.6520, lng: -72.3826 },
  { name: 'Danville', lat: 44.4117, lng: -72.1395 },
  { name: 'Peacham', lat: 44.3284, lng: -72.1698 },
  { name: 'Barnet', lat: 44.2967, lng: -72.0493 },
  { name: 'Walden', lat: 44.4517, lng: -72.2204 },
  { name: 'Wheelock', lat: 44.5867, lng: -72.0887 },
  { name: 'Westmore', lat: 44.7717, lng: -72.0470 },
  { name: 'Island Pond', lat: 44.8145, lng: -71.8801 },
  { name: 'Brighton', lat: 44.8217, lng: -71.8806 },
  { name: 'Newark', lat: 44.7014, lng: -71.9454 },
];

const categories = [
  { googleType: 'book_store', importCategory: 'bookstore' },
  { googleType: 'art_gallery', importCategory: 'art_gallery' },
  { googleType: 'museum', importCategory: 'museum' },
  { googleType: 'tourist_attraction', importCategory: 'tourist_attraction' },
  { googleType: 'bakery', importCategory: 'bakery' },
  { googleType: 'cafe', importCategory: 'cafe' },
  { googleType: 'restaurant', importCategory: 'restaurant' },
  { googleType: 'park', importCategory: 'park' },
  { googleType: 'campground', importCategory: 'campground' },
  { googleType: 'lodging', importCategory: 'lodging' },
];

const localBusinessCategories = new Set(['restaurant', 'cafe', 'bakery', 'bookstore']);
const excludedOutOfRegionTowns = new Set(['Morrisville', 'Morristown', 'Stowe', 'Waterbury', 'Montpelier', 'Barre']);
const targetTowns = new Set(towns.map((town) => town.name));
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

function assertApiKey() {
  if (!GOOGLE_PLACES_API_KEY) {
    throw new Error('Missing GOOGLE_PLACES_API_KEY. Add it to .env before running this script.');
  }
}

function getSearchRadius(importCategory) {
  return localBusinessCategories.has(importCategory) ? LOCAL_BUSINESS_RADIUS_METERS : DESTINATION_RADIUS_METERS;
}

function detectTownFromAddress(address) {
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

function normalizeTownName(town) {
  const cleanedTown = town.replace(/\s+USA$/i, '').trim();

  if (cleanedTown === 'St Johnsbury') {
    return 'St. Johnsbury';
  }

  return cleanedTown;
}

function isVermontAddress(address) {
  if (!address) {
    return false;
  }

  return /\bVT\b/i.test(address) || /\bVermont\b/i.test(address);
}

function isOutOfStateOrCanadaAddress(address) {
  if (!address) {
    return true;
  }

  return /\bNH\b/i.test(address) || /New Hampshire/i.test(address) || /Québec|Quebec|Canada|\bQC\b/i.test(address);
}

function isInsideNekBounds(latitude, longitude) {
  return (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    latitude >= NEK_BOUNDS.minLat &&
    latitude <= NEK_BOUNDS.maxLat &&
    longitude >= NEK_BOUNDS.minLng &&
    longitude <= NEK_BOUNDS.maxLng
  );
}

function isInNortheastKingdom(place) {
  return (
    isVermontAddress(place.address) &&
    !isOutOfStateOrCanadaAddress(place.address) &&
    isInsideNekBounds(place.latitude, place.longitude) &&
    Boolean(!place.detectedTown || targetTowns.has(place.detectedTown))
  );
}

function shouldExcludePlace(place) {
  const name = place.name?.toLowerCase() ?? '';
  const types = place.categories ?? [];

  return (
    !isInNortheastKingdom(place) ||
    Boolean(place.detectedTown && excludedOutOfRegionTowns.has(place.detectedTown) && place.detectedTown !== place.sourceTown) ||
    blockedPlaceTypes.has(place.primaryType) ||
    types.some((type) => blockedPlaceTypes.has(type)) ||
    blockedNameWords.some((word) => name.includes(word))
  );
}

async function searchNearbyPlaces({ town, category }) {
  const radius = getSearchRadius(category.importCategory);
  const response = await fetch(PLACES_SEARCH_NEARBY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
      'X-Goog-FieldMask': FIELD_MASK,
    },
    body: JSON.stringify({
      includedTypes: [category.googleType],
      maxResultCount: 20,
      locationRestriction: {
        circle: {
          center: {
            latitude: town.lat,
            longitude: town.lng,
          },
          radius,
        },
      },
    }),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(
      `Places API New request failed for ${town.name}/${category.importCategory}: ${response.status} ${
        response.statusText
      } ${payload.error?.message ?? ''}`,
    );
  }

  return payload.places ?? [];
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function getPhotoAttributionText(photoAttributions) {
  if (!photoAttributions?.length) {
    return 'Google Places photo';
  }

  const attributionText = photoAttributions
    .map((attribution) => attribution.displayName)
    .filter(Boolean)
    .join(', ');

  return attributionText || 'Google Places photo';
}

async function fetchPhotoUri(photoReference) {
  if (!photoReference) {
    return null;
  }

  const url = new URL(`https://places.googleapis.com/v1/${photoReference}/media`);
  url.searchParams.set('maxWidthPx', '800');
  url.searchParams.set('key', GOOGLE_PLACES_API_KEY);
  url.searchParams.set('skipHttpRedirect', 'true');

  const response = await fetch(url);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.warn(
      `Photo Media request failed for ${photoReference}: ${response.status} ${
        response.statusText
      } ${payload.error?.message ?? ''}`,
    );
    return null;
  }

  return payload.photoUri ?? null;
}

function normalizePlace(place, town, category) {
  const photo = place.photos?.[0] ?? null;
  const photoReference = photo?.name ?? null;
  const photoAttributions = photo?.authorAttributions ?? [];
  const imageCredit = getPhotoAttributionText(photoAttributions);
  const address = place.formattedAddress ?? null;
  const detectedTown = detectTownFromAddress(address);

  return {
    googlePlaceId: place.id,
    name: place.displayName?.text ?? null,
    categories: place.types ?? [],
    primaryType: place.primaryType ?? null,
    importCategory: category.importCategory,
    googleType: category.googleType,
    importedNearTown: town.name,
    sourceTown: town.name,
    detectedTown,
    address,
    latitude: place.location?.latitude ?? null,
    longitude: place.location?.longitude ?? null,
    rating: place.rating ?? null,
    userRatingsTotal: place.userRatingCount ?? null,
    websiteUri: place.websiteUri ?? null,
    googleMapsUri: place.googleMapsUri ?? null,
    photoReference,
    photoAttributions,
    imageUrl: null,
    image: photoReference
      ? {
          photoName: photoReference,
          photoReference,
          photoAttributions,
          imageUrl: null,
          imageCredit,
          imageSource: 'Google Places Photos',
        }
      : {
          photoName: null,
          photoReference: null,
          photoAttributions: [],
          imageUrl: null,
          imageCredit: null,
          imageSource: null,
        },
    source: {
      provider: 'Places API New',
      searchCategory: category.importCategory,
      googleType: category.googleType,
      searchTown: town.name,
      sourceTown: town.name,
      radiusMeters: getSearchRadius(category.importCategory),
    },
  };
}

function mergePlace(existingPlace, nextPlace) {
  const photoReference = existingPlace.photoReference ?? nextPlace.photoReference ?? null;
  const photoAttributions = existingPlace.photoAttributions?.length
    ? existingPlace.photoAttributions
    : nextPlace.photoAttributions ?? [];
  const imageCredit = getPhotoAttributionText(photoAttributions);

  return {
    ...existingPlace,
    photoReference,
    photoAttributions,
    imageUrl: existingPlace.imageUrl ?? nextPlace.imageUrl ?? null,
    image: {
      ...(existingPlace.image ?? {}),
      ...(photoReference
        ? {
            photoName: photoReference,
            photoReference,
            photoAttributions,
            imageUrl: existingPlace.image?.imageUrl ?? nextPlace.image?.imageUrl ?? null,
            imageCredit,
            imageSource: 'Google Places Photos',
          }
        : {
            photoName: null,
            photoReference: null,
            photoAttributions: [],
            imageUrl: null,
            imageCredit: null,
            imageSource: null,
          }),
    },
    categories: Array.from(new Set([...existingPlace.categories, ...nextPlace.categories])),
    importCategories: Array.from(
      new Set([...(existingPlace.importCategories ?? [existingPlace.importCategory]), nextPlace.importCategory]),
    ),
    importedNearTowns: Array.from(
      new Set([...(existingPlace.importedNearTowns ?? [existingPlace.importedNearTown]), nextPlace.importedNearTown]),
    ),
    sourceTowns: Array.from(new Set([...(existingPlace.sourceTowns ?? [existingPlace.sourceTown]), nextPlace.sourceTown])),
    detectedTown: existingPlace.detectedTown ?? nextPlace.detectedTown,
  };
}

async function importGooglePlaces() {
  assertApiKey();

  const placesById = new Map();

  for (const town of towns) {
    for (const category of categories) {
      console.log(`Searching ${category.importCategory} near ${town.name}...`);
      const places = await searchNearbyPlaces({ town, category });

      for (const place of places.map((result) => normalizePlace(result, town, category))) {
        if (!place.googlePlaceId) {
          continue;
        }

        if (shouldExcludePlace(place)) {
          continue;
        }

        const existingPlace = placesById.get(place.googlePlaceId);
        placesById.set(place.googlePlaceId, existingPlace ? mergePlace(existingPlace, place) : place);
      }
    }
  }

  const sortedPlaces = Array.from(placesById.values()).sort((a, b) => a.name.localeCompare(b.name));
  const placesWithPhotos = sortedPlaces.filter((place) => place.photoReference);

  console.log(`Fetching photo URLs for ${placesWithPhotos.length} places...`);

  for (const [index, place] of placesWithPhotos.entries()) {
    console.log(`Fetching photo ${index + 1}/${placesWithPhotos.length}: ${place.name}`);

    const imageUrl = await fetchPhotoUri(place.photoReference);
    place.imageUrl = imageUrl;
    place.image = {
      ...place.image,
      imageUrl,
    };

    if (index < placesWithPhotos.length - 1) {
      await delay(PHOTO_MEDIA_DELAY_MS);
    }
  }

  const output = {
    importedAt: new Date().toISOString(),
    provider: 'Places API New Nearby Search',
    searchRadiiMeters: {
      localBusiness: LOCAL_BUSINESS_RADIUS_METERS,
      destination: DESTINATION_RADIUS_METERS,
    },
    bounds: NEK_BOUNDS,
    fieldMask: FIELD_MASK,
    towns,
    categories,
    count: placesById.size,
    places: sortedPlaces,
  };

  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`);
  console.log(`Saved ${output.count} unique places to ${path.relative(process.cwd(), OUTPUT_PATH)}`);
}

importGooglePlaces().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
