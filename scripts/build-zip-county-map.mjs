#!/usr/bin/env node
/**
 * Builds the ZIP/ZCTA → county FIPS map used by /api/providers.
 *
 * Source: Census 2020 ZCTA-to-county relationship file (anonymous, public
 * domain, ~6.5 MB).
 *
 *   https://www2.census.gov/geo/docs/maps-data/data/rel2020/zcta520/tab20_zcta520_county20_natl.txt
 *
 * Output: public/data/zip-to-county.json — sorted, deduplicated, with an
 * "area share" per (ZCTA, county) pair so the runtime can rank multi-county
 * ZIPs by primary overlap.
 *
 * Run via: pnpm build:zip-county
 */

import { createWriteStream, createReadStream, promises as fs } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { pipeline } from "node:stream/promises";
import { createInterface } from "node:readline";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const RAW_DIR = join(ROOT, "scripts/raw");
const OUT_PATH = join(ROOT, "public/data/zip-to-county.json");
const SRC_URL =
  "https://www2.census.gov/geo/docs/maps-data/data/rel2020/zcta520/tab20_zcta520_county20_natl.txt";
const RAW_FILE = join(RAW_DIR, "tab20_zcta520_county20_natl.txt");

async function download() {
  await fs.mkdir(RAW_DIR, { recursive: true });
  try {
    const stat = await fs.stat(RAW_FILE);
    if (stat.size > 5_000_000) {
      console.log(
        `[zip-county] using cached ${RAW_FILE} (${(stat.size / 1024 / 1024).toFixed(1)} MB)`,
      );
      return;
    }
  } catch {
    /* not cached */
  }
  console.log(`[zip-county] downloading ${SRC_URL}`);
  const res = await fetch(SRC_URL, {
    headers: { "User-Agent": "whatisfiber.com data pipeline" },
  });
  if (!res.ok || !res.body) {
    throw new Error(`Census file fetch failed: ${res.status}`);
  }
  await pipeline(res.body, createWriteStream(RAW_FILE));
  const stat = await fs.stat(RAW_FILE);
  console.log(
    `[zip-county] downloaded (${(stat.size / 1024 / 1024).toFixed(1)} MB)`,
  );
}

async function build() {
  // Output map: zcta → array of { fips, share } sorted by share desc.
  const map = new Map();

  const stream = createReadStream(RAW_FILE, { encoding: "utf-8" });
  const rl = createInterface({ input: stream, crlfDelay: Infinity });
  let headers = null;
  let count = 0;

  for await (const raw of rl) {
    const line = raw.trim();
    if (!line) continue;
    // File is pipe-delimited per Census convention.
    const cols = line.split("|");
    if (!headers) {
      headers = cols;
      continue;
    }
    const get = (name) => cols[headers.indexOf(name)];
    const zcta = get("GEOID_ZCTA5_20");
    const fips = get("GEOID_COUNTY_20");
    const areaPart = Number(get("AREALAND_PART") ?? 0);
    const areaZcta = Number(get("AREALAND_ZCTA5_20") ?? 0);
    if (!zcta || !fips) continue;
    const share = areaZcta > 0 ? areaPart / areaZcta : 0;
    const arr = map.get(zcta) ?? [];
    arr.push({ fips, share });
    map.set(zcta, arr);
    count++;
  }

  // Sort each ZCTA's counties by share descending, keep top 3.
  const out = {};
  for (const [zcta, arr] of map) {
    arr.sort((a, b) => b.share - a.share);
    out[zcta] = arr
      .slice(0, 3)
      .map((r) => ({ fips: r.fips, share: Number(r.share.toFixed(3)) }));
  }

  await fs.mkdir(dirname(OUT_PATH), { recursive: true });
  await fs.writeFile(OUT_PATH, JSON.stringify(out));
  const stat = await fs.stat(OUT_PATH);
  console.log(
    `[zip-county] wrote ${OUT_PATH} (${(stat.size / 1024 / 1024).toFixed(2)} MB, ${Object.keys(out).length} ZCTAs from ${count} rows)`,
  );
}

await download();
await build();
