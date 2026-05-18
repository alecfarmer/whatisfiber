/**
 * Provider lookup — queries the FCC Broadband Data Collection live via
 * the ArcGIS Living Atlas mirror (public, anonymous, refreshed each BDC
 * release). Esri's ToU permits runtime queries with attribution but
 * prohibits bulk redistribution, so we never cache to disk — only edge.
 *
 * Source attribution required on every result page:
 *   "Source: FCC Broadband Data Collection via ArcGIS Living Atlas"
 *
 * Input: ?zip=29680  (resolves to county FIPS via static map)
 *        OR ?county=45045  (direct county FIPS)
 *
 * Output: { providers: ResolvedProvider[], attribution, county, source }
 */

import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import { join } from "node:path";
import { PROVIDERS } from "@/lib/providers";
import {
  rankResolved,
  resolveFccRow,
  type ResolvedProvider,
} from "@/lib/provider-matching";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ESRI_BASE =
  "https://services8.arcgis.com/peDZJliSvYims39Q/arcgis/rest/services/FCC_Broadband_Data_Collection_December_2024_View/FeatureServer";
/** Layer 10 = county-level provider records (65k rows). */
const ESRI_COUNTY_ENDPOINT = `${ESRI_BASE}/10/query`;
/** Layer 8 = block-group-level provider records (2.7M rows). */
const ESRI_BLOCK_GROUP_ENDPOINT = `${ESRI_BASE}/8/query`;

type CountyEntry = { fips: string; share: number };
type ZipMap = Record<string, CountyEntry[]>;

// In-memory cache of the ZIP→county map. Loaded once per cold start.
let zipMapPromise: Promise<ZipMap> | null = null;
async function loadZipMap(): Promise<ZipMap> {
  if (!zipMapPromise) {
    zipMapPromise = (async () => {
      const path = join(process.cwd(), "public/data/zip-to-county.json");
      const text = await fs.readFile(path, "utf-8");
      return JSON.parse(text) as ZipMap;
    })();
  }
  return zipMapPromise;
}

type FccRow = {
  ProviderName: string;
  FRN: string;
  ServedBSLs: number;
  Technology: number;
};

async function queryFcc(
  endpoint: string,
  geoid: string,
  cacheTag: string,
): Promise<FccRow[]> {
  const params = new URLSearchParams({
    where: `GEOID='${geoid}' AND Technology IN (40, 50, 70, 71)`,
    outFields: "GEOID,ProviderName,FRN,ServedBSLs,Technology",
    f: "json",
    resultRecordCount: "200",
  });
  const url = `${endpoint}?${params.toString()}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "whatisfiber.com (FCC BDC proxy)",
      Accept: "application/json",
    },
    next: { revalidate: 86400, tags: [cacheTag] },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) {
    throw new Error(`Esri upstream ${res.status}`);
  }
  const data = (await res.json()) as { features?: Array<{ attributes: FccRow }> };
  return (data.features ?? []).map((f) => f.attributes);
}

async function queryFccCounty(countyFips: string): Promise<FccRow[]> {
  return queryFcc(
    ESRI_COUNTY_ENDPOINT,
    countyFips,
    `fcc-county-${countyFips}`,
  );
}

async function queryFccBlockGroup(blockGroup: string): Promise<FccRow[]> {
  return queryFcc(
    ESRI_BLOCK_GROUP_ENDPOINT,
    blockGroup,
    `fcc-bg-${blockGroup}`,
  );
}

function dedupe(rows: ResolvedProvider[]): ResolvedProvider[] {
  // Merge entries with the same catalog slug (or same raw name for unknowns);
  // keep the row with the highest ServedBSLs.
  const seen = new Map<string, ResolvedProvider>();
  for (const r of rows) {
    const key =
      r.kind === "known" ? `k:${r.provider.slug}` : `u:${r.name.toLowerCase()}`;
    const existing = seen.get(key);
    if (!existing || existing.servedBSLs < r.servedBSLs) {
      seen.set(key, r);
    }
  }
  return [...seen.values()];
}

export async function GET(req: NextRequest) {
  const zip = req.nextUrl.searchParams.get("zip")?.trim();
  const explicitCounty = req.nextUrl.searchParams.get("county")?.trim();
  const blockGroup = req.nextUrl.searchParams.get("blockGroup")?.trim();
  const minBsls = Number(req.nextUrl.searchParams.get("minBsls") ?? "5");

  // Address-level precision: query block-group provider table directly.
  if (blockGroup && /^\d{12}$/.test(blockGroup)) {
    try {
      const rows = await queryFccBlockGroup(blockGroup);
      const resolved = rows
        .map((row) => resolveFccRow(row, PROVIDERS))
        .filter((r): r is ResolvedProvider => r !== null)
        .filter((r) => r.servedBSLs >= minBsls);
      const deduped = dedupe(resolved);
      const ranked = rankResolved(deduped);
      return NextResponse.json(
        {
          providers: ranked,
          precision: "block-group",
          blockGroup,
          source: "fcc-bdc-via-arcgis",
          attribution:
            "Source: FCC Broadband Data Collection via ArcGIS Living Atlas",
          sourceUrl:
            "https://www.arcgis.com/home/item.html?id=e1343efcefc344709057260ee57290a0",
          bdcAsOf: "December 2024 (released June 2025)",
        },
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
        { error: "fcc upstream failed", detail: msg },
        { status: 502 },
      );
    }
  }

  let counties: CountyEntry[];
  if (explicitCounty && /^\d{5}$/.test(explicitCounty)) {
    counties = [{ fips: explicitCounty, share: 1 }];
  } else if (zip && /^\d{5}$/.test(zip)) {
    try {
      const map = await loadZipMap();
      counties = map[zip] ?? [];
    } catch {
      return NextResponse.json({ error: "zip map unavailable" }, { status: 500 });
    }
    if (counties.length === 0) {
      return NextResponse.json(
        {
          providers: [],
          county: null,
          precision: "county",
          source: "fcc-bdc-via-arcgis",
          attribution:
            "Source: FCC Broadband Data Collection via ArcGIS Living Atlas",
          message: "ZIP not found in Census 2020 ZCTA file.",
        },
        { status: 200 },
      );
    }
  } else {
    return NextResponse.json(
      { error: "zip, county, or blockGroup param required" },
      { status: 400 },
    );
  }

  try {
    const allRows: FccRow[] = [];
    for (const c of counties.slice(0, 2)) {
      const rows = await queryFccCounty(c.fips);
      allRows.push(...rows);
    }
    const resolved = allRows
      .map((row) => resolveFccRow(row, PROVIDERS))
      .filter((r): r is ResolvedProvider => r !== null)
      .filter((r) => r.servedBSLs >= minBsls);
    const deduped = dedupe(resolved);
    const ranked = rankResolved(deduped);

    return NextResponse.json(
      {
        providers: ranked,
        county: counties[0].fips,
        countyOverlapShare: counties[0].share,
        precision: "county",
        source: "fcc-bdc-via-arcgis",
        attribution:
          "Source: FCC Broadband Data Collection via ArcGIS Living Atlas",
        sourceUrl:
          "https://www.arcgis.com/home/item.html?id=e1343efcefc344709057260ee57290a0",
        bdcAsOf: "December 2024 (released June 2025)",
      },
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
      { error: "fcc upstream failed", detail: msg },
      { status: 502 },
    );
  }
}
