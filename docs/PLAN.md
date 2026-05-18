# whatisfiber.com — Next-Up Plan

What's done, what's queued, what each piece depends on. Updated 2026-05-17.

## Shipped
- 11-page Next.js 16 site with reader/engineer mode toggle, SEO foundations (robots.ts, sitemap.ts, llms.txt, JSON-LD per page), all comparison + explainer pages, glossary (62 terms), FAQ (35+ items).
- 5-question decision wizard on `/is-fiber-worth-it` with verdict (Yes / Maybe / Overkill) + recommended speed tier (300 Mbps → 2 Gbps+) + personalized reasons drawn from answer signals.
- Footer disambiguation linking dietary-fiber searchers to Cleveland Clinic / NHS / Mayo.

## Affiliate stack (from research) — gated on James applying

The 2026 affiliate landscape is consolidated (AT&T bought Lumen consumer fiber Feb 2026; Verizon bought Frontier Jan 2026). Direct affiliates only — aggregators (BroadbandNow, Allconnect) are competitors, not networks.

### Apply, in order:
1. **FlexOffers** — lowest barrier, gets AT&T Fiber ($40), Verizon Fios ($36), Verizon 5G ($60), T-Mobile Home ($20–40), Frontier ($100) in a single account. Apply at https://www.flexoffers.com/affiliates/. Needs 8–10 live pages + a `/disclosure` page first.
2. **CJ Affiliate** — apply once organic traffic shows up (~weeks 4–8). Higher payouts on same brands. Auto-deactivates inactive accounts after 6 months, so don't apply early.
3. **Skimlinks** — stopgap; auto-monetizes outbound links to ~48K merchants without per-program approval. Takes ~25%.

### Build (after FlexOffers approval):
- `/disclosure` page — FTC-compliant. Link from site footer.
- `/app/go/[provider]/route.ts` — 302 redirector. Pattern: `/go/att-fiber?sid=is-fiber-worth-it` → real affiliate URL with sub-ID for per-page attribution. Returns clean outbound URLs in markup; survives ad blockers.
- `/providers/[slug]` pages for at-least AT&T Fiber, Verizon Fios, T-Mobile Home — these rank for `[isp] review` queries and become canonical destinations.
- Inline disclosure copy before first affiliate link on every page that has one.

Realistic earnings: $5–$25 RPM on commercial-intent pages, sub-$1 on top-of-funnel. First 6 months sub-$100/mo is normal; $1k+/mo needs 2K–5K commercial visits/month.

## ZIP → provider lookup (from research)

FCC BDC dataset, preprocessed quarterly to ZIP-keyed JSON shards. No backend needed.

### Build:
- `scripts/build-fiber-data.ts` — downloads per-state BDC fixed-availability CSVs (auth required), filters to fiber (`technology=50`, `≥100/20 Mbps`), joins census blocks → ZIPs via HUD-USPS crosswalk, emits sharded JSON.
- `public/data/fiber/{prefix}.json` — sharded by first 3 ZIP digits (~1000 shards, 30–50 KB gzipped each). Total ~5–15 MB compressed.
- `public/data/zips.json` — SimpleMaps free ZIP database (needs footer backlink) or GeoNames (no attribution).
- `<FiberLookup />` client component on wizard result step + `/is-fiber-worth-it` — input ZIP → fetch matching shard → render providers + affiliate CTAs.
- Fallback: deep-link to BroadbandNow city page (`broadbandnow.com/{state-slug}/{city-slug}`) + FCC map for unrecognized ZIPs.
- Optional prefill via `ipinfo.io/lite/me` (CORS-enabled, no key) → "Looks like you're on [ISP] — see all available."
- **Don't:** ship CostQuest Fabric location_ids (non-commercial license); scrape AT&T/Google/Verizon endpoints (CORS-blocked + ToS).

Maintenance: ~30 min/quarter after each BDC release (June + Dec data, lands 3–5 months later).

## Reader-mode interactives (from research) — prioritized

Quick wins (each < 1 day):
1. **Speed-to-Time Converter** on `/is-fiber-worth-it` — input speed → time to download 4K movie, album, Wikipedia. Honest: "Netflix caps at 25 Mbps anyway."
2. **Splitter Ratio Dial** on `/how-fiber-works` — 1:8 / 1:32 / 1:64 chips, recomputes loss budget + per-home bandwidth in place.
3. **Symmetric vs Asymmetric Bandwidth Slider** on `/fiber-vs-cable` — toggle Fiber/Cable/DSL, watch upload half collapse.

Week-scale:
4. **Total Internal Reflection Sandbox** on `/how-fiber-works` — draggable light-ray angle; ray escapes vs bounces forever.
5. **Orbital Latency Horse Race** on `/fiber-vs-satellite` — button → cyan dot races up to LEO vs GEO; millisecond counters tick.
6. **Toy Packet Tracer** on `/the-internet-backbone` — pick origin/dest, watch packet hop AS by AS with timing labels.
7. **"Why did your video call freeze?" Diagnostic** on `/inside-your-home` — four-button decision tree → single-sentence answer per path.

Trophy (multi-week):
8. **Submarine Cable Atlas** on `/the-internet-backbone` — restrained SVG world map; ~10 cables, hover/click reveals owner + capacity.

### Voice rules for reader mode (apply to all existing copy):
- Lead with the metaphor / consequence; engineer mode leads with the spec.
- Every number gets an immediate physical anchor ("9 µm = 1/10 a human hair").
- One metaphor per concept; don't keep restating it.
- Verbs do the work ("bounces," "snakes," "flashes"), nouns are for engineer mode.
- Never apologize for the topic. "Don't worry, this gets complicated" → cut.

### Micro-interactions worth adding:
- Definitional underline on first use of glossary terms (dotted underline + hover tooltip).
- Click any number → reveals one-line source citation.
- Cyan reading-progress bar at viewport top.
- Animated underline on body-text links.
- Counters animate on intersect (already in `Counter` component — verify reduced-motion).

## Hard nos
- Confetti, sparkles, particle bursts.
- Mascots / Lottie cartoons.
- Auto-playing animations or audio.
- Multiple accent colors beyond status indicators.
- Full-screen modals.
- Carousels.
- "Try it!" announcement buttons on interactives.
