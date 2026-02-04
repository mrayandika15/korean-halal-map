/**
 * KMZ Parser Script
 *
 * Parses docs/geo.kmz into:
 * - src/data/restaurants.ts (TypeScript array export)
 * - public/data/restaurants.geojson (GeoJSON for map rendering)
 *
 * Run with: bun run scripts/parse-kmz.ts
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { unzipSync } from 'fflate';
import { XMLParser } from 'fast-xml-parser';
import type { Restaurant, PlaceCategory, HalalStatus } from '../src/types/restaurant';

// Constants
const KMZ_PATH = join(process.cwd(), 'docs/geo.kmz');
const OUTPUT_TS_PATH = join(process.cwd(), 'src/data/restaurants.ts');
const OUTPUT_GEOJSON_PATH = join(process.cwd(), 'public/data/restaurants.geojson');

// Folder name to category mapping
const FOLDER_TO_CATEGORY: Record<string, PlaceCategory> = {
  'Halal restaurant': 'restaurant',
  'Partially Halal': 'restaurant',
  'Seafood restaurant': 'restaurant',
  'Muslim Friendly Restaurant': 'restaurant',
  'Vegetarian Restaurant': 'restaurant',
  'Masjid & Musalla': 'mosque',
  'Muslim Friendly Accommodation': 'accommodation',
  'Halal Mart': 'grocery',
  'ICU Company': 'other',
};

// Folder name to halal status mapping
const FOLDER_TO_HALAL_STATUS: Record<string, HalalStatus> = {
  'Halal restaurant': 'halal_certified',
  'Partially Halal': 'partially_halal',
  'Seafood restaurant': 'seafood_only',
  'Muslim Friendly Restaurant': 'muslim_friendly',
  'Vegetarian Restaurant': 'vegetarian',
  'Masjid & Musalla': 'unknown',
  'Muslim Friendly Accommodation': 'muslim_friendly',
  'Halal Mart': 'halal_certified',
  'ICU Company': 'unknown',
};

// Generate a unique ID from name and coordinates
function generateId(name: string, lat: number, lng: number): string {
  const input = `${name}:${lat.toFixed(6)}:${lng.toFixed(6)}`;
  // Simple hash to base64-like string
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // Convert to base36 and pad to ensure uniqueness
  const hashStr = Math.abs(hash).toString(36);
  const coordPart = `${Math.abs(Math.round(lat * 1000000)).toString(36)}${Math.abs(Math.round(lng * 1000000)).toString(36)}`;
  return `${hashStr}_${coordPart}`.slice(0, 20);
}

// Parse description HTML to extract structured data
function parseDescription(description: string): {
  openingHours: string | null;
  phone: string | null;
  cleanDescription: string;
} {
  if (!description) {
    return { openingHours: null, phone: null, cleanDescription: '' };
  }

  // Remove HTML tags for clean description
  let cleanDescription = description
    .replace(/<img[^>]*>/gi, '') // Remove images
    .replace(/<br\s*\/?>/gi, '\n') // Convert br to newlines
    .replace(/<[^>]+>/g, '') // Remove remaining HTML tags
    .replace(/\s*\n\s*/g, '\n') // Clean up whitespace around newlines
    .replace(/^\s+|\s+$/g, ''); // Trim

  // Remove the app download section
  const appDownloadPattern = /◼\s*Korehalal Trip App Download[\s\S]*?(?=\n\n|\n[^A-Za-z]|$)/gi;
  cleanDescription = cleanDescription.replace(appDownloadPattern, '').trim();

  // Extract opening hours (various formats)
  const hoursPatterns = [
    /⏰\s*([^\n]+)/i,
    /(?:Open|Hours?):\s*([^\n]+)/i,
    /(\d{1,2}:\d{2}\s*(?:am|pm)?\s*-\s*\d{1,2}:\d{2}\s*(?:am|pm)?)/i,
  ];

  let openingHours: string | null = null;
  for (const pattern of hoursPatterns) {
    const match = cleanDescription.match(pattern);
    if (match) {
      openingHours = match[1].trim();
      break;
    }
  }

  // Extract phone number
  const phonePatterns = [
    /(?:Tel|Phone|📞|☎️?):\s*([+\d\s-()]+)/i,
    /(\+82[\d\s-]+)/,
    /(0\d{1,2}[-\s]?\d{3,4}[-\s]?\d{4})/,
  ];

  let phone: string | null = null;
  for (const pattern of phonePatterns) {
    const match = cleanDescription.match(pattern);
    if (match) {
      phone = match[1].trim().replace(/\s+/g, '');
      break;
    }
  }

  // Remove URLs from clean description
  cleanDescription = cleanDescription
    .replace(/https?:\/\/[^\s]+/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return { openingHours, phone, cleanDescription };
}

// Extract city from coordinates (rough mapping based on Korean geography)
function extractCity(lat: number, lng: number): string | null {
  // Seoul area
  if (lat >= 37.4 && lat <= 37.7 && lng >= 126.8 && lng <= 127.2) {
    return 'Seoul';
  }
  // Busan area
  if (lat >= 35.0 && lat <= 35.3 && lng >= 128.9 && lng <= 129.3) {
    return 'Busan';
  }
  // Incheon area
  if (lat >= 37.3 && lat <= 37.6 && lng >= 126.4 && lng <= 126.8) {
    return 'Incheon';
  }
  // Daegu area
  if (lat >= 35.7 && lat <= 36.0 && lng >= 128.4 && lng <= 128.8) {
    return 'Daegu';
  }
  // Daejeon area
  if (lat >= 36.2 && lat <= 36.5 && lng >= 127.2 && lng <= 127.6) {
    return 'Daejeon';
  }
  // Gwangju area
  if (lat >= 35.0 && lat <= 35.3 && lng >= 126.7 && lng <= 127.1) {
    return 'Gwangju';
  }
  // Jeju area
  if (lat >= 33.2 && lat <= 33.6 && lng >= 126.1 && lng <= 126.9) {
    return 'Jeju';
  }
  // Ulsan area
  if (lat >= 35.4 && lat <= 35.7 && lng >= 129.1 && lng <= 129.5) {
    return 'Ulsan';
  }
  // Gyeonggi area (surrounding Seoul)
  if (lat >= 36.9 && lat <= 38.0 && lng >= 126.3 && lng <= 127.8) {
    return 'Gyeonggi';
  }
  // Gangwon area
  if (lat >= 37.0 && lat <= 38.5 && lng >= 127.5 && lng <= 129.5) {
    return 'Gangwon';
  }

  return null;
}

// Parse a single placemark
function parsePlacemark(
  placemark: Record<string, unknown>,
  folderName: string
): Restaurant | null {
  try {
    const name = placemark.name as string;
    if (!name) return null;

    // Parse coordinates
    const point = placemark.Point as Record<string, unknown> | undefined;
    if (!point) return null;

    const coordsStr = point.coordinates as string;
    if (!coordsStr) return null;

    const [lng, lat] = coordsStr.trim().split(',').map(Number);
    if (isNaN(lat) || isNaN(lng)) return null;

    // Get description
    const description = (placemark.description as string) || '';
    const { openingHours, phone, cleanDescription } = parseDescription(description);

    // Determine category and halal status from folder
    const category = FOLDER_TO_CATEGORY[folderName] || 'other';
    const halalStatus = FOLDER_TO_HALAL_STATUS[folderName] || 'unknown';

    // Generate unique ID
    const id = generateId(name, lat, lng);

    // Extract city from coordinates
    const city = extractCity(lat, lng);

    const restaurant: Restaurant = {
      id,
      name: name.trim(),
      city,
      address: null, // KMZ doesn't have structured address data
      latitude: lat,
      longitude: lng,
      halalStatus,
      category,
      openingHours,
      phone,
      description: cleanDescription || null,
      source: 'local_kmz',
    };

    return restaurant;
  } catch (error) {
    console.error('Error parsing placemark:', error);
    return null;
  }
}

// Parse folders recursively
function parseFolders(
  folders: Record<string, unknown>[] | Record<string, unknown>,
  restaurants: Restaurant[]
): void {
  const folderArray = Array.isArray(folders) ? folders : [folders];

  for (const folder of folderArray) {
    const folderName = (folder.name as string) || '';

    // Parse placemarks in this folder
    if (folder.Placemark) {
      const placemarks = Array.isArray(folder.Placemark)
        ? folder.Placemark
        : [folder.Placemark];

      for (const placemark of placemarks) {
        const restaurant = parsePlacemark(placemark as Record<string, unknown>, folderName);
        if (restaurant) {
          restaurants.push(restaurant);
        }
      }
    }

    // Recursively parse nested folders
    if (folder.Folder) {
      parseFolders(folder.Folder as Record<string, unknown>[], restaurants);
    }
  }
}

// Convert restaurants to GeoJSON
function toGeoJSON(restaurants: Restaurant[]): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: restaurants.map((r) => ({
      type: 'Feature' as const,
      id: r.id,
      geometry: {
        type: 'Point' as const,
        coordinates: [r.longitude, r.latitude],
      },
      properties: {
        id: r.id,
        name: r.name,
        city: r.city,
        halalStatus: r.halalStatus,
        category: r.category,
        openingHours: r.openingHours,
        phone: r.phone,
      },
    })),
  };
}

// Main function
async function main() {
  console.log('Starting KMZ parsing...');
  console.log(`Reading KMZ from: ${KMZ_PATH}`);

  // Read KMZ file
  const kmzBuffer = readFileSync(KMZ_PATH);

  // Unzip KMZ (it's a ZIP file containing doc.kml)
  const unzipped = unzipSync(new Uint8Array(kmzBuffer));

  // Find doc.kml
  const kmlFile = unzipped['doc.kml'];
  if (!kmlFile) {
    throw new Error('doc.kml not found in KMZ file');
  }

  const kmlContent = new TextDecoder().decode(kmlFile);
  console.log(`KML content length: ${kmlContent.length} characters`);

  // Parse XML
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    textNodeName: '#text',
  });

  const kml = parser.parse(kmlContent);
  const document = kml.kml.Document;

  if (!document) {
    throw new Error('Invalid KML structure: Document not found');
  }

  // Parse all folders and placemarks
  const restaurants: Restaurant[] = [];

  if (document.Folder) {
    parseFolders(document.Folder, restaurants);
  }

  // Also check for placemarks directly under Document
  if (document.Placemark) {
    const placemarks = Array.isArray(document.Placemark)
      ? document.Placemark
      : [document.Placemark];

    for (const placemark of placemarks) {
      const restaurant = parsePlacemark(placemark as Record<string, unknown>, 'Unknown');
      if (restaurant) {
        restaurants.push(restaurant);
      }
    }
  }

  console.log(`Parsed ${restaurants.length} restaurants`);

  // Log category breakdown
  const categoryCount = restaurants.reduce(
    (acc, r) => {
      acc[r.category] = (acc[r.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  console.log('Category breakdown:', categoryCount);

  // Log halal status breakdown
  const statusCount = restaurants.reduce(
    (acc, r) => {
      acc[r.halalStatus] = (acc[r.halalStatus] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  console.log('Halal status breakdown:', statusCount);

  // Log city breakdown
  const cityCount = restaurants.reduce(
    (acc, r) => {
      const city = r.city || 'Unknown';
      acc[city] = (acc[city] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  console.log('City breakdown:', cityCount);

  // Ensure output directories exist
  const tsDir = dirname(OUTPUT_TS_PATH);
  const geojsonDir = dirname(OUTPUT_GEOJSON_PATH);

  if (!existsSync(tsDir)) {
    mkdirSync(tsDir, { recursive: true });
  }
  if (!existsSync(geojsonDir)) {
    mkdirSync(geojsonDir, { recursive: true });
  }

  // Write TypeScript file
  // Note: Using JSON import pattern to avoid TypeScript complexity issues with large literal arrays
  const tsContent = `// Auto-generated by scripts/parse-kmz.ts
// Do not edit manually

import type { Restaurant } from '../types/restaurant';

// Restaurant data is loaded from JSON to avoid TypeScript complexity with large literal arrays
import restaurantsData from '../../public/data/restaurants.json';

export const restaurants = restaurantsData as Restaurant[];

export const restaurantCount = ${restaurants.length};

// Pre-computed unique cities for filter dropdowns
export const cities: string[] = ${JSON.stringify([...new Set(restaurants.map((r) => r.city).filter(Boolean))].sort())};

// Pre-computed categories
export const categories: string[] = ${JSON.stringify([...new Set(restaurants.map((r) => r.category))].sort())};
`;

  writeFileSync(OUTPUT_TS_PATH, tsContent, 'utf-8');
  console.log(`Written TypeScript to: ${OUTPUT_TS_PATH}`);

  // Write JSON file for TypeScript import
  const outputJsonPath = join(process.cwd(), 'public/data/restaurants.json');
  writeFileSync(outputJsonPath, JSON.stringify(restaurants, null, 2), 'utf-8');
  console.log(`Written JSON to: ${outputJsonPath}`);

  // Write GeoJSON file
  const geojson = toGeoJSON(restaurants);
  writeFileSync(OUTPUT_GEOJSON_PATH, JSON.stringify(geojson, null, 2), 'utf-8');
  console.log(`Written GeoJSON to: ${OUTPUT_GEOJSON_PATH}`);

  // Summary
  console.log('\n=== Summary ===');
  console.log(`Total restaurants: ${restaurants.length}`);
  console.log(`TypeScript output: ${OUTPUT_TS_PATH}`);
  console.log(`GeoJSON output: ${OUTPUT_GEOJSON_PATH}`);
}

// Run the script
main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
