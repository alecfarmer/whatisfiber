/**
 * Geocoder + lookup helpers for FiberLookup.
 *
 * US Census Geocoder is free, CORS-enabled, no API key, no rate limit for
 * reasonable use. Returns matched address + lat/lon + the census-block FIPS
 * that contains the address. Census blocks are tiny (one side of one street)
 * and are the right resolution for "providers at this address" claims.
 *
 * https://geocoding.geo.census.gov/geocoder/Geocoding_Services_API.html
 */

export type GeocodeResult = {
  matchedAddress: string;
  coordinates: { lat: number; lon: number };
  zip: string | null;
  state: string | null;
  /** 15-digit census block FIPS (2010/2020). The right resolution for FCC BDC block lookups. */
  blockGeoid: string | null;
  countyName: string | null;
  countyFips: string | null;
};

/**
 * Calls our own /api/geocode proxy route, which in turn calls the Census
 * Geocoder server-side. Direct browser calls to the Census API are blocked
 * by CORS (the Census endpoint doesn't send Access-Control-Allow-Origin),
 * so we proxy through Vercel's serverless function for the lookup.
 */
export async function geocodeAddress(
  address: string,
): Promise<GeocodeResult | null> {
  try {
    const res = await fetch(
      `/api/geocode?address=${encodeURIComponent(address)}`,
    );
    if (!res.ok) return null;
    const data = (await res.json()) as CensusGeocoderResponse;
    const match = data?.result?.addressMatches?.[0];
    if (!match) return null;
    const matchedAddress = match.matchedAddress ?? "";
    const lat = Number(match.coordinates?.y);
    const lon = Number(match.coordinates?.x);
    if (Number.isNaN(lat) || Number.isNaN(lon)) return null;
    return {
      matchedAddress,
      coordinates: { lat, lon },
      zip: extractZip(matchedAddress),
      state: extractState(matchedAddress),
      blockGeoid:
        match.geographies?.["Census Blocks"]?.[0]?.GEOID?.toString() ?? null,
      countyName: match.geographies?.["Counties"]?.[0]?.NAME ?? null,
      countyFips: match.geographies?.["Counties"]?.[0]?.GEOID ?? null,
    };
  } catch {
    return null;
  }
}

function extractZip(addr: string): string | null {
  const match = addr.match(/(\d{5})(?:-\d{4})?(?:,?\s*)?$/);
  return match ? match[1] : null;
}

function extractState(addr: string): string | null {
  const match = addr.match(/,\s*([A-Z]{2}),\s*\d{5}/);
  return match ? match[1] : null;
}

// ── Minimal response typing — just what we read ──────────────────────────

type CensusGeocoderResponse = {
  result?: {
    addressMatches?: Array<{
      matchedAddress?: string;
      coordinates?: { x?: number | string; y?: number | string };
      geographies?: {
        "Census Blocks"?: Array<{ GEOID?: string | number }>;
        Counties?: Array<{ GEOID?: string; NAME?: string }>;
      };
    }>;
  };
};
