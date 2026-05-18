/**
 * Address autocomplete via the US Census Geocoder.
 *
 * Why Census over OpenStreetMap Nominatim:
 *   - Authoritative US address data — every house number the Census knows.
 *   - Returns the 15-digit block GEOID in the same call, so the picker
 *     hands FiberLookup an immediate block-group precision lookup with
 *     no second geocode round trip.
 *   - Free, no API key, no signup, no per-IP rate-limit policy.
 *   - Empirically: returned exact matches for queries where Nominatim
 *     returned 0 or wrong results (Photon/OSM equivalents were no better).
 *
 * Tradeoff: Census doesn't do "as you type" street-name expansion the
 * way Google Places does. It expects a mostly-complete address — same UX
 * as every ISP availability checker. We compensate by waiting until the
 * input has a house number + street + (city or ZIP) before firing.
 *
 * https://geocoding.geo.census.gov/geocoder/
 */

import { NextRequest, NextResponse } from "next/server";

const CENSUS_ENDPOINT =
  "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Suggestion = {
  /** Canonical Census-formatted address — what we paste back into the input. */
  clean: string;
  /** Same string the user sees; kept for parity with the older OSM shape. */
  display: string;
  /** 15-digit Census block GEOID. First 12 = block group, first 11 = tract. */
  blockGeoid?: string;
  /** Lat/lon from Census Tiger lines (slightly offset from the parcel center). */
  lat?: number;
  lon?: number;
  zip?: string;
  state?: string;
  city?: string;
};

type CensusAddressMatch = {
  matchedAddress: string;
  coordinates?: { x: number; y: number };
  addressComponents?: {
    zip?: string;
    state?: string;
    city?: string;
    streetName?: string;
    suffixType?: string;
  };
  geographies?: {
    "Census Blocks"?: Array<{ GEOID?: string }>;
  };
};

type CensusResponse = {
  result?: { addressMatches?: CensusAddressMatch[] };
};

/**
 * Heuristic: should we even bother firing Census? Census needs at least
 * a house number, a street, and either a city or a ZIP. Anything less
 * returns 0 matches and burns a round trip.
 */
function isWorthQuerying(q: string): boolean {
  if (q.length < 10) return false;
  // Has at least one numeric token (likely house number)
  if (!/\d/.test(q)) return false;
  // Has at least two alphabetic tokens (street name + city/state)
  const alphaTokens = q.match(/[A-Za-z]{2,}/g) ?? [];
  if (alphaTokens.length < 2) return false;
  return true;
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || !isWorthQuerying(q)) {
    return NextResponse.json({ suggestions: [] });
  }
  const params = new URLSearchParams({
    address: q,
    benchmark: "Public_AR_Current",
    vintage: "Census2020_Current",
    format: "json",
    layers: "10",
  });
  try {
    const upstream = await fetch(`${CENSUS_ENDPOINT}?${params.toString()}`, {
      headers: {
        "User-Agent": "whatisfiber.com (address autocomplete)",
        Accept: "application/json",
      },
      // Census occasionally takes 3–5 s for cold matches.
      signal: AbortSignal.timeout(8000),
      next: {
        revalidate: 86400,
        tags: [`census-${q.toLowerCase().replace(/\s+/g, "-").slice(0, 80)}`],
      },
    });
    if (!upstream.ok) {
      return NextResponse.json(
        { suggestions: [], error: `census upstream ${upstream.status}` },
        { status: 502 },
      );
    }
    const data = (await upstream.json()) as CensusResponse;
    const matches = data.result?.addressMatches ?? [];
    const suggestions: Suggestion[] = matches.map((m) => {
      const a = m.addressComponents ?? {};
      const blockGeoid = m.geographies?.["Census Blocks"]?.[0]?.GEOID;
      return {
        clean: m.matchedAddress,
        display: m.matchedAddress,
        blockGeoid,
        lat: m.coordinates?.y,
        lon: m.coordinates?.x,
        zip: a.zip,
        state: a.state,
        city: a.city,
      };
    });
    return NextResponse.json(
      { suggestions },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=86400, stale-while-revalidate=604800",
        },
      },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    return NextResponse.json(
      { suggestions: [], error: msg },
      { status: 502 },
    );
  }
}
