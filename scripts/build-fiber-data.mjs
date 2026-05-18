#!/usr/bin/env node
/**
 * Preprocesses FCC BDC fixed-availability CSVs into static JSON shards.
 * See scripts/README.md for the full workflow.
 *
 * Usage:
 *   pnpm build:data            # standard run
 *   pnpm build:data --dry-run  # parse and count, don't write
 *
 * Inputs:  scripts/raw/bdc_*_Fixed_Broadband_*.csv
 * Outputs: public/data/fiber/{block,zip}/*.json + public/data/fiber/index.json
 */

import { createReadStream, promises as fs } from "node:fs";
import { createInterface } from "node:readline";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const RAW_DIR = join(ROOT, "scripts/raw");
const OUT_DIR = join(ROOT, "public/data/fiber");
const ZCTA_XWALK = join(RAW_DIR, "zcta_zip_xwalk.csv");

const FIBER_TECH_CODE = 50;
const MIN_DOWN = 100;
const MIN_UP = 20;
const RESIDENTIAL_CODES = new Set(["R", "X"]);

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has("--dry-run");
const INCLUDE_ALL_TECH = args.has("--include-all");

// ── Helpers ──────────────────────────────────────────────────────────────

/** Tracks which CSV column index maps to which logical field. */
function buildHeaderMap(headerLine) {
  const cols = parseCsvLine(headerLine);
  const idx = (name) => cols.indexOf(name);
  return {
    frn: idx("frn"),
    providerId: idx("provider_id"),
    brandName: idx("brand_name"),
    locationId: idx("location_id"),
    technology: idx("technology"),
    maxDown: idx("max_advertised_download_speed"),
    maxUp: idx("max_advertised_upload_speed"),
    lowLatency: idx("low_latency"),
    bizRes: idx("business_residential_code"),
    state: idx("state_usps"),
    blockGeoid: idx("block_geoid"),
  };
}

/** Simple CSV line parser. FCC BDC files don't use quoted commas. */
function parseCsvLine(line) {
  return line.split(",").map((s) => s.trim());
}

async function* readCsvLines(path) {
  const stream = createReadStream(path, { encoding: "utf-8" });
  const rl = createInterface({ input: stream, crlfDelay: Infinity });
  for await (const line of rl) yield line;
}

async function processStateCsv(path, onRow) {
  let headers = null;
  let count = 0;
  for await (const line of readCsvLines(path)) {
    if (!line) continue;
    if (!headers) {
      headers = buildHeaderMap(line);
      continue;
    }
    const cols = parseCsvLine(line);
    const tech = Number(cols[headers.technology]);
    if (!INCLUDE_ALL_TECH && tech !== FIBER_TECH_CODE) continue;
    const bizRes = cols[headers.bizRes];
    if (!RESIDENTIAL_CODES.has(bizRes)) continue;
    const maxDown = Number(cols[headers.maxDown]);
    const maxUp = Number(cols[headers.maxUp]);
    if (maxDown < MIN_DOWN || maxUp < MIN_UP) continue;
    const blockGeoid = cols[headers.blockGeoid];
    if (!blockGeoid) continue;
    onRow({
      providerId: cols[headers.providerId],
      brandName: cols[headers.brandName],
      blockGeoid,
      tech,
      maxDown,
      maxUp,
      lowLatency: cols[headers.lowLatency] === "1",
      state: cols[headers.state],
    });
    count++;
  }
  return count;
}

async function loadZctaXwalk() {
  /** Map of BLOCK_GEOID first-11-chars (= census tract) → ZIP. Best-effort. */
  const map = new Map();
  try {
    let headers = null;
    for await (const line of readCsvLines(ZCTA_XWALK)) {
      if (!line) continue;
      if (!headers) {
        headers = parseCsvLine(line);
        continue;
      }
      const cols = parseCsvLine(line);
      const tract = cols[headers.indexOf("TRACT_GEOID")] ?? cols[0];
      const zip = cols[headers.indexOf("ZCTA5")] ?? cols[1];
      if (tract && zip) map.set(tract, zip);
    }
  } catch (err) {
    console.warn(
      `[warn] no ZCTA crosswalk at ${ZCTA_XWALK} — ZIP shards will be skipped`,
    );
  }
  return map;
}

// ── Main ─────────────────────────────────────────────────────────────────

async function main() {
  console.log(`[build-fiber-data] starting${DRY_RUN ? " (DRY RUN)" : ""}`);
  const stateFiles = (await fs.readdir(RAW_DIR).catch(() => [])).filter(
    (f) =>
      /bdc_[A-Z]{2}.*Fixed_Broadband.*\.csv$/i.test(f) ||
      /bdc_[A-Z]{2}.*\.csv$/i.test(f),
  );
  if (stateFiles.length === 0) {
    console.error(
      `[build-fiber-data] no FCC BDC CSVs found in ${RAW_DIR}\n` +
        `download per-state files from https://broadbandmap.fcc.gov/data-download/nationwide-data\n` +
        `and unzip them into scripts/raw/`,
    );
    process.exit(1);
  }
  console.log(`[build-fiber-data] found ${stateFiles.length} state CSVs`);

  const zctaMap = await loadZctaXwalk();
  console.log(`[build-fiber-data] zcta xwalk entries: ${zctaMap.size}`);

  /** block_geoid → Set of provider slugs/ids */
  const blockProviders = new Map();
  /** zip → Set of provider slugs/ids */
  const zipProviders = new Map();
  /** provider_id → brand_name (for the missing-providers report) */
  const providers = new Map();

  let totalRecords = 0;
  for (const file of stateFiles) {
    const path = join(RAW_DIR, file);
    process.stdout.write(`  reading ${file}… `);
    const count = await processStateCsv(path, (row) => {
      providers.set(row.providerId, row.brandName);
      if (!blockProviders.has(row.blockGeoid)) {
        blockProviders.set(row.blockGeoid, new Set());
      }
      blockProviders.get(row.blockGeoid).add(row.providerId);

      const tract = row.blockGeoid.slice(0, 11);
      const zip = zctaMap.get(tract);
      if (zip) {
        if (!zipProviders.has(zip)) zipProviders.set(zip, new Set());
        zipProviders.get(zip).add(row.providerId);
      }
    });
    totalRecords += count;
    process.stdout.write(`${count.toLocaleString()} rows\n`);
  }

  console.log(
    `[build-fiber-data] processed ${totalRecords.toLocaleString()} rows, ${blockProviders.size.toLocaleString()} blocks, ${zipProviders.size.toLocaleString()} ZIPs, ${providers.size} providers`,
  );

  if (DRY_RUN) {
    console.log("[build-fiber-data] dry-run, no files written");
    return;
  }

  // Wipe + recreate the output dir
  await fs.rm(OUT_DIR, { recursive: true, force: true });
  await fs.mkdir(join(OUT_DIR, "block"), { recursive: true });
  await fs.mkdir(join(OUT_DIR, "zip"), { recursive: true });

  // Shard blocks by first 4 chars of GEOID (state + partial county)
  const blockShards = new Map();
  for (const [geoid, set] of blockProviders) {
    const shard = geoid.slice(0, 4);
    if (!blockShards.has(shard)) blockShards.set(shard, {});
    blockShards.get(shard)[geoid] = [...set];
  }
  for (const [shard, data] of blockShards) {
    await fs.writeFile(
      join(OUT_DIR, "block", `${shard}.json`),
      JSON.stringify(data),
    );
  }
  console.log(`[build-fiber-data] wrote ${blockShards.size} block shards`);

  // Shard ZIPs by first 3 digits
  const zipShards = new Map();
  for (const [zip, set] of zipProviders) {
    const shard = zip.slice(0, 3);
    if (!zipShards.has(shard)) zipShards.set(shard, {});
    zipShards.get(shard)[zip] = [...set];
  }
  for (const [shard, data] of zipShards) {
    await fs.writeFile(
      join(OUT_DIR, "zip", `${shard}.json`),
      JSON.stringify(data),
    );
  }
  console.log(`[build-fiber-data] wrote ${zipShards.size} ZIP shards`);

  // Index
  await fs.writeFile(
    join(OUT_DIR, "index.json"),
    JSON.stringify(
      {
        updatedAt: new Date().toISOString(),
        source: "FCC Broadband Data Collection (fixed availability)",
        filter: `fiber (tech=${FIBER_TECH_CODE}), ≥${MIN_DOWN}/${MIN_UP} Mbps, residential`,
        recordCount: totalRecords,
        blockCount: blockProviders.size,
        zipCount: zipProviders.size,
        providerCount: providers.size,
      },
      null,
      2,
    ),
  );

  // Providers missing from the catalog
  const catalog = await loadProviderCatalogIds();
  const missing = [...providers.entries()].filter(
    ([id]) => !catalog.has(id),
  );
  if (missing.length > 0) {
    console.log(
      `[build-fiber-data] ${missing.length} provider IDs not in lib/providers.ts:`,
    );
    for (const [id, name] of missing.slice(0, 30)) {
      console.log(`  ${id}\t${name}`);
    }
    if (missing.length > 30) console.log(`  …and ${missing.length - 30} more`);
    console.log(`  add these to lib/providers.ts and re-run.`);
  }

  console.log("[build-fiber-data] done.");
}

async function loadProviderCatalogIds() {
  // We don't import the TS file from a .mjs script — instead, read the file
  // text and grep for slugs. Catalog is small (~20 providers); this works
  // fine and avoids a TypeScript runtime.
  try {
    const txt = await fs.readFile(join(ROOT, "lib/providers.ts"), "utf-8");
    const matches = txt.matchAll(/slug:\s*"([^"]+)"/g);
    return new Set([...matches].map((m) => m[1]));
  } catch {
    return new Set();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
