// Lat/lng for the cities most commonly entered as origin/destination.
// Used by the track-map component on /track/[id] to plot pins.
//
// If a tracking event references a city not in this list, the map falls
// back to country-level or just hides the "current location" pin.

type Coords = [number, number]; // [lng, lat]

const CITIES: Record<string, Coords> = {
  // Africa
  lagos: [3.4, 6.5],
  abuja: [7.49, 9.08],
  accra: [-0.19, 5.6],
  cairo: [31.24, 30.04],
  johannesburg: [28.04, -26.2],
  nairobi: [36.82, -1.29],
  casablanca: [-7.59, 33.57],

  // Europe
  amsterdam: [4.9, 52.37],
  rotterdam: [4.48, 51.92],
  berlin: [13.4, 52.52],
  munich: [11.58, 48.14],
  hamburg: [9.99, 53.55],
  london: [-0.13, 51.51],
  manchester: [-2.24, 53.48],
  paris: [2.35, 48.86],
  madrid: [-3.7, 40.42],
  barcelona: [2.17, 41.39],
  rome: [12.5, 41.9],
  milan: [9.19, 45.46],
  zurich: [8.55, 47.38],
  vienna: [16.37, 48.21],
  copenhagen: [12.57, 55.68],
  stockholm: [18.07, 59.33],
  dublin: [-6.27, 53.35],
  warsaw: [21.01, 52.23],
  istanbul: [28.98, 41.01],

  // Middle East
  dubai: [55.27, 25.2],
  "abu dhabi": [54.37, 24.45],
  doha: [51.53, 25.29],
  riyadh: [46.67, 24.71],
  tel: [34.78, 32.08], // tel aviv (matches first word)

  // Asia
  singapore: [103.82, 1.35],
  "hong kong": [114.17, 22.32],
  hongkong: [114.17, 22.32],
  tokyo: [139.76, 35.68],
  osaka: [135.5, 34.69],
  seoul: [126.98, 37.57],
  beijing: [116.41, 39.9],
  shanghai: [121.47, 31.23],
  shenzhen: [114.05, 22.55],
  bangkok: [100.5, 13.76],
  jakarta: [106.85, -6.21],
  manila: [120.98, 14.6],
  mumbai: [72.87, 19.07],
  delhi: [77.21, 28.64],
  bangalore: [77.59, 12.97],
  karachi: [67.0, 24.86],
  taipei: [121.56, 25.03],
  "kuala lumpur": [101.69, 3.14],

  // Americas
  "new york": [-74.0, 40.71],
  newyork: [-74.0, 40.71],
  "los angeles": [-118.41, 33.94],
  losangeles: [-118.41, 33.94],
  chicago: [-87.65, 41.85],
  miami: [-80.19, 25.76],
  dallas: [-96.8, 32.78],
  houston: [-95.37, 29.76],
  "san francisco": [-122.42, 37.77],
  sanfrancisco: [-122.42, 37.77],
  seattle: [-122.33, 47.6],
  toronto: [-79.38, 43.65],
  vancouver: [-123.12, 49.28],
  "mexico city": [-99.13, 19.43],
  mexicocity: [-99.13, 19.43],
  "sao paulo": [-46.63, -23.55],
  saopaulo: [-46.63, -23.55],
  "são paulo": [-46.63, -23.55],
  "buenos aires": [-58.38, -34.6],
  buenosaires: [-58.38, -34.6],
  santiago: [-70.65, -33.45],
  bogota: [-74.07, 4.71],
  lima: [-77.04, -12.05],

  // Oceania
  sydney: [151.21, -33.87],
  melbourne: [144.96, -37.81],
  auckland: [174.76, -36.85],
};

/**
 * Look up coords by city name. Tolerates "Lagos, NG", "Lagos NG", or "lagos".
 */
export function lookupCityCoords(input: string | null | undefined): Coords | null {
  if (!input) return null;
  // Try the full string normalised first
  const norm = input.trim().toLowerCase();
  if (CITIES[norm]) return CITIES[norm];

  // Strip country code suffix like ", NG" or " NG"
  const beforeComma = norm.split(",")[0]?.trim() ?? norm;
  if (CITIES[beforeComma]) return CITIES[beforeComma];

  // Strip trailing 2-3 char codes
  const stripped = beforeComma.replace(/\s+[a-z]{2,3}$/i, "").trim();
  if (CITIES[stripped]) return CITIES[stripped];

  // Try first word only
  const firstWord = beforeComma.split(/\s+/)[0];
  if (firstWord && CITIES[firstWord]) return CITIES[firstWord];

  return null;
}
