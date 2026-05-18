# `scripts/` — data pipelines

## `build-fiber-data.mjs`

Preprocesses the FCC Broadband Data Collection (BDC) into static JSON shards
that ship in `public/data/fiber/`. After this runs, every US ZIP and every
US census block returns real provider data — replacing the 20-metro demo
dataset in `lib/zip-providers.ts`.

Run once per BDC release (twice a year — June and December as-of dates).

### One-time setup

1. Create an FCC user account at https://broadbandmap.fcc.gov/ and verify
   it can download bulk data (the "Data Download" page should be available).
2. Create `scripts/raw/` in this project.
3. From the FCC Data Download page, download **Nationwide Data → Fixed
   Broadband → Provider Coverage** (most recent BDC release). You'll get
   per-state ZIP files. Extract them into `scripts/raw/` so the CSVs end up
   like `scripts/raw/bdc_AL_Fixed_Broadband_*.csv`.
4. Total raw size is ~10–20 GB uncompressed across all states and
   territories. Make sure you have disk.

### Run

```bash
pnpm build:data
```

The script streams each CSV (no full file load), filters to fiber-only
records meeting broadband minimums, and emits:

- `public/data/fiber/block/{state-county-prefix}.json` — keyed by
  `block_geoid`. Used by the address-mode lookup once Census Geocoder
  returns a block FIPS.
- `public/data/fiber/zip/{zip-prefix-3}.json` — keyed by ZIP. Used by ZIP
  mode. Built by joining block records to ZCTA→ZIP via the Census
  relationship files (see `scripts/raw/zcta_zip_xwalk.csv` — download from
  https://www.census.gov/geographies/reference-files/2020/geo/relationship-files.html).
- `public/data/fiber/index.json` — `{ updatedAt, source, recordCount, ... }`
  for display in the lookup UI.

The provider list in `lib/providers.ts` is the canonical source of brand
names + display info. The script maps each FCC `provider_id` to a slug in
that file. New provider_ids encountered will be logged with a TODO so they
can be added to the catalog.

### What the script filters out

- Non-fiber technologies (`technology` ≠ `50`). DSL, cable, fixed wireless,
  satellite, etc., are dropped. (To include them too, set `--include-all`.)
- Business-only records (`business_residential_code = 'B'`).
- Plans below 100/20 Mbps (the FCC's current "broadband" floor).
- Low-latency flag = false (mostly satellite GEO, which is excluded
  separately by tech code anyway).

### Honest caveats

The FCC dataset is updated twice a year and ISPs over-report availability —
the FCC's challenge process is the official correction mechanism. The
script's output should be treated as "probably available" not "guaranteed."
Per-provider "Check address" CTAs in the UI route users to the ISP's own
checker, which is the authoritative source.

The Broadband Serviceable Location Fabric (the address-level master
location dataset from CostQuest) is **NOT** in this pipeline — its license
is non-commercial only. The script intentionally operates at census-block
resolution, which is fine for affiliate-routing purposes.
