/**
 * Server-side proxy to the US Census Geocoder.
 *
 * The Census API doesn't send CORS headers, so the browser blocks direct
 * fetches. This route runs on Vercel as a serverless function, calls the
 * Census API server-to-server, and returns the JSON to the client.
 *
 * Cached at the edge for an hour — Census data updates ~yearly.
 */

import { NextRequest, NextResponse } from "next/server";

const CENSUS_ENDPOINT =
  "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address")?.trim();
  if (!address || address.length < 5) {
    return NextResponse.json({ error: "address required" }, { status: 400 });
  }
  const params = new URLSearchParams({
    address,
    benchmark: "Public_AR_Current",
    vintage: "Census2020_Current",
    format: "json",
    layers: "10",
  });
  try {
    const upstream = await fetch(`${CENSUS_ENDPOINT}?${params.toString()}`, {
      headers: {
        "User-Agent": "whatisfiber.com (geocode proxy)",
        Accept: "application/json",
      },
      // Census occasionally takes 3–5 s for cold matches
      signal: AbortSignal.timeout(8000),
    });
    if (!upstream.ok) {
      return NextResponse.json(
        { error: "census upstream error", status: upstream.status },
        { status: 502 },
      );
    }
    const data = await upstream.json();
    return NextResponse.json(data, {
      headers: {
        // Edge cache for 1 hour, allow stale-while-revalidate for 1 day
        "Cache-Control":
          "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    return NextResponse.json(
      { error: "fetch failed", detail: msg },
      { status: 502 },
    );
  }
}
