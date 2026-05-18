"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  PROVIDERS,
  techLabel,
  techTone,
  providersBySlugs,
  rankProviders,
  type Provider,
  type ProviderTech,
} from "@/lib/providers";
import {
  COVERED_ZIPS,
  ZIP_INFO,
  ZIP_PROVIDERS,
  type ZipInfo,
} from "@/lib/zip-providers";
import { geocodeAddress, type GeocodeResult } from "@/lib/fiber-lookup";
import { cn } from "@/lib/utils";
import { ArrowIcon } from "@/components/ui/cta";

type LookupMode = "zip" | "address";

/** Item used to render a provider card. Either a fully-cataloged provider
 *  or an FCC-reported one we don't have brand data for yet. */
type ProviderItem =
  | { kind: "known"; provider: Provider; servedBSLs?: number }
  | {
      kind: "unknown";
      name: string;
      frn: string;
      tech: ProviderTech;
      servedBSLs: number;
    };

type FoundData = {
  zip: string;
  info?: ZipInfo;
  providers: ProviderItem[];
  geocode?: GeocodeResult;
  /** "fcc-bdc-via-arcgis" when from the API; "hand-curated" when fallback. */
  source: "fcc-bdc-via-arcgis" | "hand-curated";
  /** "block-group" = ~600 households precision; "county" = whole county. */
  precision: "block-group" | "county" | "zip";
  bdcAsOf?: string;
};

type AddressSuggestion = {
  /** Canonical Census-formatted address — what we paste back into the input. */
  clean?: string;
  /** Same string the user sees; kept for parity with the older OSM shape. */
  display: string;
  /** 15-digit Census block GEOID — lets us skip the second geocode call. */
  blockGeoid?: string;
  lat?: number;
  lon?: number;
  zip?: string;
  city?: string;
  state?: string;
};

type LookupResult =
  | { kind: "idle" }
  | { kind: "invalid"; reason: "format" | "empty" | "address-too-short" }
  | { kind: "loading" }
  | { kind: "no-match"; query: string }
  | { kind: "unknown"; zip: string; geocode?: GeocodeResult }
  | { kind: "found"; data: FoundData };

type ApiResponse = {
  providers?: Array<
    | { kind: "known"; provider: Provider; servedBSLs: number; rawName: string }
    | {
        kind: "unknown";
        name: string;
        frn: string;
        tech: ProviderTech;
        servedBSLs: number;
      }
  >;
  county?: string | null;
  blockGroup?: string | null;
  precision?: "block-group" | "county";
  source?: string;
  bdcAsOf?: string;
};

const EASE = [0.16, 1, 0.3, 1] as const;
const MIN_BSLS_TO_SHOW = 25; // hide tiny FCC entries from rural niche carriers

async function lookupViaApi(
  query: { zip: string } | { blockGroup: string },
): Promise<{ providers: ProviderItem[]; precision: "block-group" | "county" } | null> {
  try {
    const url =
      "zip" in query
        ? `/api/providers?zip=${encodeURIComponent(query.zip)}`
        : `/api/providers?blockGroup=${encodeURIComponent(query.blockGroup)}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = (await res.json()) as ApiResponse;
    if (!data.providers || data.providers.length === 0) return null;
    const threshold =
      "blockGroup" in query
        ? 1 // at block-group precision, even 1 BSL is meaningful
        : MIN_BSLS_TO_SHOW;
    const knowns = data.providers
      .filter((p) => p.kind === "known")
      .filter((p) => p.servedBSLs >= threshold);
    const unknowns = data.providers
      .filter((p) => p.kind === "unknown")
      .filter((p) => p.servedBSLs >= threshold)
      .slice(0, 4);
    const providers = [...knowns, ...unknowns] as ProviderItem[];
    if (providers.length === 0) return null;
    return { providers, precision: data.precision ?? "county" };
  } catch {
    return null;
  }
}

function fallbackFromHandCurated(zip: string): ProviderItem[] | null {
  const slugs = ZIP_PROVIDERS[zip];
  if (!slugs) return null;
  const providers = rankProviders(providersBySlugs(slugs));
  return providers.map((p) => ({ kind: "known", provider: p }));
}

export function FiberLookup({
  title = "Find fiber at your address",
  subtitle = "Type your ZIP for an instant area check — or your full address for census-block precision.",
}: {
  title?: string;
  subtitle?: string;
}) {
  const [mode, setMode] = useState<LookupMode>("zip");
  const [zip, setZip] = useState("");
  const [address, setAddress] = useState("");
  const [result, setResult] = useState<LookupResult>({ kind: "idle" });
  const zipId = useId();
  const addrId = useId();
  const reduce = useReducedMotion();

  function resetResultOnEdit() {
    if (result.kind !== "idle" && result.kind !== "loading") {
      setResult({ kind: "idle" });
    }
  }

  async function doLookup(rawZip: string, geocode?: GeocodeResult) {
    const info = ZIP_INFO[rawZip];
    setResult({ kind: "loading" });

    // When we have a geocoded census block, derive block-group GEOID (first
    // 12 digits of the 15-digit block GEOID) and use the block-group API.
    if (geocode?.blockGeoid && /^\d{15}$/.test(geocode.blockGeoid)) {
      const bg = geocode.blockGeoid.slice(0, 12);
      const apiRes = await lookupViaApi({ blockGroup: bg });
      if (apiRes && apiRes.providers.length > 0) {
        setResult({
          kind: "found",
          data: {
            zip: rawZip,
            info,
            providers: apiRes.providers,
            geocode,
            source: "fcc-bdc-via-arcgis",
            precision: apiRes.precision,
            bdcAsOf: "December 2024 (released June 2025)",
          },
        });
        return;
      }
      // Block-group empty — fall through to county-level
    }

    const apiRes = await lookupViaApi({ zip: rawZip });
    if (apiRes && apiRes.providers.length > 0) {
      setResult({
        kind: "found",
        data: {
          zip: rawZip,
          info,
          providers: apiRes.providers,
          geocode,
          source: "fcc-bdc-via-arcgis",
          precision: apiRes.precision,
          bdcAsOf: "December 2024 (released June 2025)",
        },
      });
      return;
    }

    const fallback = fallbackFromHandCurated(rawZip);
    if (fallback && info) {
      setResult({
        kind: "found",
        data: {
          zip: rawZip,
          info,
          providers: fallback,
          geocode,
          source: "hand-curated",
          precision: "zip",
        },
      });
      return;
    }
    setResult({ kind: "unknown", zip: rawZip, geocode });
  }

  function lookupZipFromForm() {
    const trimmed = zip.trim();
    if (!trimmed) return setResult({ kind: "invalid", reason: "empty" });
    if (!/^\d{5}$/.test(trimmed))
      return setResult({ kind: "invalid", reason: "format" });
    void doLookup(trimmed);
  }

  async function lookupAddress(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed || trimmed.length < 8) {
      setResult({
        kind: "invalid",
        reason: trimmed ? "address-too-short" : "empty",
      });
      return;
    }
    setResult({ kind: "loading" });
    const geocode = await geocodeAddress(trimmed);
    if (!geocode || !geocode.zip) {
      setResult({ kind: "no-match", query: trimmed });
      return;
    }
    void doLookup(geocode.zip, geocode);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === "zip") lookupZipFromForm();
    else lookupAddress(address);
  }

  return (
    <div>
      <header className="mb-6">
        <div className="display text-[clamp(20px,2.4vw,26px)] font-medium leading-tight text-[var(--fg)]">
          {title}
        </div>
        <p className="mt-2 max-w-[55ch] text-[14px] leading-relaxed text-[var(--fg-muted)]">
          {subtitle}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-[var(--status-live)]/30 bg-[var(--status-live)]/5 px-3 py-2 text-[12px] text-[var(--fg-muted)]">
          <span
            aria-hidden="true"
            className="mono text-[var(--status-live)] font-bold"
          >
            ●
          </span>
          <span>
            <strong className="font-medium text-[var(--fg)]">
              Now powered by live FCC data.
            </strong>{" "}
            Provider list comes from the FCC Broadband Data Collection (Dec 2024,
            via ArcGIS Living Atlas), filtered to fiber + cable + 5G. Coverage
            is reported at the county level — block-by-block availability
            varies, so always click through to confirm with the provider.{" "}
            <a
              href="mailto:hi@whatisfiber.com?subject=Wrong+providers+at+my+address"
              className="text-[var(--accent-text)] underline decoration-[var(--accent-text)]/40 underline-offset-2 hover:decoration-[var(--accent-text)]"
            >
              Notice an error? Tell us.
            </a>
          </span>
        </div>
      </header>

      <ModeToggle
        mode={mode}
        onChange={(m) => {
          setMode(m);
          resetResultOnEdit();
        }}
      />

      <form onSubmit={onSubmit} className="mt-4 flex flex-wrap items-center gap-3">
        {mode === "zip" ? (
          <>
            <label htmlFor={zipId} className="sr-only">
              ZIP code
            </label>
            <input
              id={zipId}
              inputMode="numeric"
              pattern="\d{5}"
              maxLength={5}
              autoComplete="postal-code"
              placeholder="ZIP code"
              value={zip}
              onChange={(e) => {
                const v = e.target.value.replace(/[^\d]/g, "").slice(0, 5);
                setZip(v);
                resetResultOnEdit();
              }}
              className="mono h-12 w-[160px] rounded-full border border-[var(--border-warm)] bg-[var(--ink-deep)] px-5 text-[16px] tracking-[0.2em] text-[var(--fg)] placeholder:text-[var(--fg-faint)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
            />
          </>
        ) : (
          <AddressAutocomplete
            id={addrId}
            value={address}
            onChange={(v) => {
              setAddress(v);
              resetResultOnEdit();
            }}
            onPick={(suggestion) => {
              const picked = suggestion.clean ?? suggestion.display;
              setAddress(picked);
              // Census autocomplete returns the block GEOID inline, so we can
              // fire the FCC lookup immediately — no separate geocode round
              // trip, no "click Check" step. If the suggestion lacks the
              // geoid (e.g. a legacy OSM cache), we fall back to the manual
              // submit path which re-geocodes via the Census proxy.
              if (suggestion.blockGeoid && suggestion.zip) {
                void doLookup(suggestion.zip, {
                  matchedAddress: picked,
                  coordinates: {
                    lat: suggestion.lat ?? 0,
                    lon: suggestion.lon ?? 0,
                  },
                  zip: suggestion.zip,
                  state: suggestion.state ?? null,
                  blockGeoid: suggestion.blockGeoid,
                  countyName: null,
                  countyFips: null,
                });
              } else {
                resetResultOnEdit();
              }
            }}
          />
        )}
        <button
          type="submit"
          disabled={result.kind === "loading"}
          className={cn(
            "inline-flex h-12 items-center gap-2 rounded-full px-6 text-[14px] font-medium transition-all",
            result.kind === "loading"
              ? "cursor-wait bg-[var(--ink-elev)] text-[var(--fg-muted)]"
              : "bg-[var(--accent)] text-[var(--ink-deepest)] shadow-[0_8px_24px_-12px_var(--accent-shadow)] hover:bg-[var(--accent-bright)]",
          )}
        >
          {result.kind === "loading" ? "Looking up…" : "Check my address"}
          {result.kind === "loading" ? null : <ArrowIcon />}
        </button>
      </form>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={resultKey(result)}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="mt-8"
        >
          {result.kind === "idle" && <IdleHint mode={mode} />}
          {result.kind === "invalid" && (
            <InvalidMessage reason={result.reason} mode={mode} />
          )}
          {result.kind === "no-match" && <NoMatch query={result.query} />}
          {result.kind === "loading" && (
            <p className="text-[13px] text-[var(--fg-dim)]">
              Querying FCC Broadband Data Collection…
            </p>
          )}
          {result.kind === "unknown" && (
            <UnknownZip zip={result.zip} geocode={result.geocode} />
          )}
          {result.kind === "found" && <FoundResult data={result.data} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function resultKey(r: LookupResult): string {
  if (r.kind === "found")
    return `found:${r.data.zip}:${r.data.geocode ? "addr" : "zip"}`;
  if (r.kind === "unknown") return `unknown:${r.zip}`;
  if (r.kind === "no-match") return `nomatch:${r.query.slice(0, 30)}`;
  if (r.kind === "invalid") return `invalid:${r.reason}`;
  return r.kind;
}

/**
 * Pull a short disambiguation hint out of Nominatim's `display_name`:
 * the locality crumbs (neighborhood / subdivision / county) that we
 * stripped out when building the clean form. Helps a user pick between
 * two "905 Plantation Dr" matches in different parts of town.
 */
function contextSnippet(display: string, clean: string | undefined): string {
  // Pull the locality crumbs out of `display` (neighborhood, subdivision,
  // county) that we stripped when building `clean`. Helps a user pick
  // between two same-clean matches in different parts of town. We do this
  // by word-set overlap: any Nominatim part whose words are mostly already
  // in `clean` gets dropped, plus we drop postcodes, state names, and the
  // country tail. Defensive on `clean` because a stale browser cache may
  // hold suggestions from before we added that field.
  const safeClean = clean ?? "";
  const cleanWords = new Set(
    safeClean.toLowerCase().split(/[\s,]+/).filter((w) => w.length > 0),
  );
  const isMostlyInClean = (p: string) => {
    const words = p.toLowerCase().split(/\s+/).filter(Boolean);
    if (words.length === 0) return true;
    const matched = words.filter((w) => cleanWords.has(w)).length;
    return matched / words.length >= 0.6;
  };
  const displayParts = display
    .replace(/, United States$/i, "")
    .split(/,\s*/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
    .filter((p) => !/^\d{5}(-\d{4})?$/.test(p))
    .filter((p) => !STATE_NAME_RE.test(p))
    .filter((p) => !isMostlyInClean(p));
  if (displayParts.length === 0) return "";
  return displayParts.join(" · ");
}

const STATE_NAME_RE =
  /^(alabama|alaska|arizona|arkansas|california|colorado|connecticut|delaware|district of columbia|florida|georgia|hawaii|idaho|illinois|indiana|iowa|kansas|kentucky|louisiana|maine|maryland|massachusetts|michigan|minnesota|mississippi|missouri|montana|nebraska|nevada|new hampshire|new jersey|new mexico|new york|north carolina|north dakota|ohio|oklahoma|oregon|pennsylvania|rhode island|south carolina|south dakota|tennessee|texas|utah|vermont|virginia|washington|west virginia|wisconsin|wyoming|puerto rico)$/i;

function AddressAutocomplete({
  id,
  value,
  onChange,
  onPick,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  onPick: (s: AddressSuggestion) => void;
}) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length < 5) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/address-suggest?q=${encodeURIComponent(value.trim())}`,
        );
        if (res.ok) {
          const data = (await res.json()) as {
            suggestions?: AddressSuggestion[];
          };
          setSuggestions(data.suggestions ?? []);
          setOpen((data.suggestions ?? []).length > 0);
          setActiveIdx(-1);
        }
      } catch {
        /* swallow */
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      onPick(suggestions[activeIdx]);
      setOpen(false);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative min-w-[280px] flex-1">
      <label htmlFor={id} className="sr-only">
        Full street address
      </label>
      <input
        id={id}
        type="text"
        autoComplete="off"
        spellCheck={false}
        placeholder="123 Main St, Simpsonville, SC 29680"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        onKeyDown={onKey}
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        className="h-12 w-full rounded-full border border-[var(--border-warm)] bg-[var(--ink-deep)] px-5 text-[15px] text-[var(--fg)] placeholder:text-[var(--fg-faint)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
      />
      {loading ? (
        <span
          aria-hidden="true"
          className="mono pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-[0.18em] text-[var(--fg-faint)]"
        >
          searching…
        </span>
      ) : null}
      {open && suggestions.length > 0 ? (
        <ul
          id={`${id}-list`}
          role="listbox"
          className="absolute left-0 right-0 top-full z-30 mt-2 max-h-[280px] overflow-y-auto rounded-2xl border border-[var(--border-soft)] bg-[var(--ink-card)] py-2 shadow-2xl"
        >
          {suggestions.map((s, i) => {
            const isActive = i === activeIdx;
            return (
              <li
                key={`${s.lat}-${s.lon}-${i}`}
                role="option"
                aria-selected={isActive}
              >
                <button
                  type="button"
                  onMouseDown={(e) => {
                    // mousedown so it fires before input's blur
                    e.preventDefault();
                    onPick(s);
                    setOpen(false);
                  }}
                  onMouseEnter={() => setActiveIdx(i)}
                  className={cn(
                    "block w-full px-5 py-2.5 text-left text-[13px] transition-colors",
                    isActive
                      ? "bg-[var(--ink-elev)] text-[var(--fg)]"
                      : "text-[var(--fg-muted)] hover:bg-[var(--ink-raised)]",
                  )}
                >
                  <div className="truncate font-medium text-[var(--fg)]">
                    {s.clean ?? s.display}
                  </div>
                  <div className="mono mt-0.5 truncate text-[10px] uppercase tracking-[0.18em] text-[var(--fg-faint)]">
                    {contextSnippet(s.display, s.clean)}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

function ModeToggle({
  mode,
  onChange,
}: {
  mode: LookupMode;
  onChange: (m: LookupMode) => void;
}) {
  const options: { value: LookupMode; label: string; sub: string }[] = [
    { value: "zip", label: "ZIP code", sub: "Quick area check" },
    { value: "address", label: "Full address", sub: "Census-block precision" },
  ];
  return (
    <div
      role="radiogroup"
      aria-label="Lookup mode"
      className="inline-flex items-stretch rounded-full border border-[var(--border-soft)] bg-[var(--ink-raised)]/80 p-1"
    >
      {options.map((opt) => {
        const active = opt.value === mode;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-full px-4 py-1.5 text-[12px] font-medium transition-colors",
              active
                ? "bg-[var(--accent)]/12 text-[var(--accent-text)] ring-1 ring-[var(--accent)]/40"
                : "text-[var(--fg-muted)] hover:text-[var(--fg)]",
            )}
          >
            {opt.label}
            <span
              className={cn(
                "ml-1.5 text-[10px] tracking-[0.1em]",
                active ? "text-[var(--accent-text)]/70" : "text-[var(--fg-faint)]",
              )}
            >
              · {opt.sub}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function IdleHint({ mode }: { mode: LookupMode }) {
  if (mode === "zip") {
    return (
      <p className="text-[13px] text-[var(--fg-dim)]">
        Try any US ZIP — we query the live FCC dataset. Example:{" "}
        <code className="mono">29680</code>, <code className="mono">78704</code>,
        or <code className="mono">94110</code>.
      </p>
    );
  }
  return (
    <p className="text-[13px] text-[var(--fg-dim)]">
      We&apos;ll geocode your address via the free US Census Geocoder, then
      pull the providers reported in your county from the FCC&apos;s Broadband
      Data Collection.
    </p>
  );
}

function InvalidMessage({
  reason,
  mode,
}: {
  reason: "format" | "empty" | "address-too-short";
  mode: LookupMode;
}) {
  const text = (() => {
    if (reason === "empty")
      return mode === "zip"
        ? "Enter a 5-digit ZIP code to check."
        : "Enter a full street address to check.";
    if (reason === "format") return "That doesn't look like a 5-digit US ZIP code.";
    return "Add a bit more — street, city, and state work best.";
  })();
  return <p className="text-[14px] text-[var(--status-warn)]">{text}</p>;
}

function NoMatch({ query }: { query: string }) {
  return (
    <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--ink-raised)] p-5">
      <div className="display text-[16px] font-medium text-[var(--fg)]">
        Couldn&apos;t match that address.
      </div>
      <p className="mt-1 text-[13px] text-[var(--fg-muted)]">
        Try a more complete form like{" "}
        <code className="mono text-[12px]">123 Main St, City, ST 29680</code>,
        or switch to ZIP mode for a quick check.
      </p>
      <p className="mono mt-3 text-[11px] uppercase tracking-[0.18em] text-[var(--fg-faint)]">
        Queried: {query.slice(0, 60)}
      </p>
    </div>
  );
}

function FoundResult({ data }: { data: FoundData }) {
  const { info, providers, zip, geocode, source, bdcAsOf, precision } = data;
  const fiberCount = providers.filter((p) =>
    p.kind === "known" ? p.provider.tech === "fiber" : p.tech === "fiber",
  ).length;
  const cityLine =
    info && (info.city || info.state) ? `${info.city}, ${info.state}` : zip;
  const precisionLabel =
    precision === "block-group"
      ? "Address-level · ~600 homes"
      : precision === "county"
      ? "County-level"
      : "ZIP-level";
  const precisionColor =
    precision === "block-group"
      ? "var(--status-live)"
      : "var(--accent-text)";
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3 border-b border-[var(--border-hairline)] pb-4">
        <div>
          <div className="mono text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--fg-faint)]">
            {geocode ? "Address matched" : `ZIP ${zip}`}
          </div>
          <div className="display mt-1 text-[20px] font-medium text-[var(--fg)]">
            {geocode ? humanizeMatched(geocode.matchedAddress) : cityLine}
          </div>
          {geocode ? (
            <div className="mono mt-1 text-[11px] uppercase tracking-[0.16em] text-[var(--fg-dim)]">
              {cityLine} · ZIP {zip}
              {geocode.blockGeoid ? ` · Block ${geocode.blockGeoid}` : ""}
            </div>
          ) : null}
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span
            className="mono inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ borderColor: precisionColor, color: precisionColor }}
          >
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full"
              style={{ background: precisionColor }}
            />
            {precisionLabel}
          </span>
          <span className="mono text-[12px] uppercase tracking-[0.18em] text-[var(--fg-muted)]">
            {providers.length} provider{providers.length === 1 ? "" : "s"} ·{" "}
            {fiberCount > 0 ? `${fiberCount} fiber` : "no fiber"}
          </span>
        </div>
      </div>

      <ul className="space-y-3">
        {providers.map((p, i) => (
          <li key={p.kind === "known" ? p.provider.slug : `unknown:${p.frn}-${i}`}>
            {p.kind === "known" ? (
              <ProviderCard
                provider={p.provider}
                zip={zip}
                servedBSLs={p.servedBSLs}
              />
            ) : (
              <UnknownProviderCard
                name={p.name}
                tech={p.tech}
                servedBSLs={p.servedBSLs}
                zip={zip}
              />
            )}
          </li>
        ))}
      </ul>

      <div className="mt-6 space-y-3">
        <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--ink-raised)]/50 p-4 text-[12px] leading-relaxed text-[var(--fg-dim)]">
          <p>
            <strong className="text-[var(--fg-muted)]">
              Verify with the provider for your exact address.
            </strong>{" "}
            {geocode
              ? "FCC data is reported at the county level — within a county, coverage varies block-by-block. Each provider link goes directly to their own availability checker."
              : "Coverage varies within a ZIP — every link above goes to the ISP's own availability tool. For a tighter answer, switch to 'Full address' mode."}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--ink-raised)]/50 p-4 text-[11px] leading-relaxed text-[var(--fg-faint)]">
          {source === "fcc-bdc-via-arcgis" ? (
            <p>
              <strong className="text-[var(--fg-dim)]">Source:</strong> FCC
              Broadband Data Collection
              {bdcAsOf ? `, ${bdcAsOf}` : ""}, served via{" "}
              <a
                href="https://www.arcgis.com/home/item.html?id=e1343efcefc344709057260ee57290a0"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-[var(--fg-faint)]/40 underline-offset-2 hover:text-[var(--accent-text)]"
              >
                ArcGIS Living Atlas
              </a>
              . Public-domain federal data. Refreshes every six months when the
              FCC publishes a new BDC release.
            </p>
          ) : (
            <p>
              <strong className="text-[var(--fg-dim)]">Source:</strong>{" "}
              Hand-curated demo data (FCC live data unavailable for this ZIP).{" "}
              <a
                href={`mailto:hi@whatisfiber.com?subject=Fiber+lookup+correction+for+ZIP+${zip}`}
                className="text-[var(--accent-text)] underline decoration-[var(--accent-text)]/40 underline-offset-2 hover:decoration-[var(--accent-text)]"
              >
                Report a correction
              </a>
              .
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function humanizeMatched(addr: string): string {
  return addr
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/,\s*([A-Z]{2}),\s*(\d{5})/i, ", $1 $2")
    .replace(/\b(Sc|Nc|Tx|Ca|Fl|Il|Ga|Ma|Mn|Wa|Or|Co|Ut|Ny|Pa|Dc|Az|Nv|Oh|Tn|Va|Md|Ri|Ct|Nj|In|Mi|Wi|Mo|Ne|Ok|Nm|Al|Hi|Ak|Sd|Nd|Mt|Wy|Id|Ks|Ar|La|Ms|Ky|Wv|De|Vt|Nh|Me)\b/g, (m) => m.toUpperCase());
}

function ProviderCard({
  provider,
  zip,
  servedBSLs,
}: {
  provider: Provider;
  zip: string;
  servedBSLs?: number;
}) {
  const tone = techTone[provider.tech];
  return (
    <a
      href={provider.checkUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      data-zip={zip}
      data-provider={provider.slug}
      className="group flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--border-soft)] bg-[var(--ink-raised)] p-5 transition-all hover:-translate-y-0.5 hover:border-[var(--border-warm)] hover:bg-[var(--ink-card)]"
    >
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span
            className="mono inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{ borderColor: tone, color: tone }}
          >
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full"
              style={{ background: tone }}
            />
            {techLabel[provider.tech]}
          </span>
          {provider.symmetric ? (
            <span className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--status-live)]">
              ✓ symmetric
            </span>
          ) : null}
          {servedBSLs ? (
            <span className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--fg-faint)]">
              {servedBSLs.toLocaleString()} homes in county
            </span>
          ) : null}
        </div>
        <div className="display text-[18px] font-medium text-[var(--fg)] transition-colors group-hover:text-[var(--accent-text)]">
          {provider.name}
        </div>
        <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-0">
          <span className="mono text-[13px] text-[var(--fg-muted)]">
            {formatSpeed(provider.maxDown)}{" "}
            <span className="text-[var(--fg-faint)]">↓</span>{" "}
            <span className="text-[var(--fg-faint)]">·</span>{" "}
            {formatSpeed(provider.maxUp)}{" "}
            <span className="text-[var(--fg-faint)]">↑</span>
          </span>
          <span className="text-[12px] text-[var(--fg-dim)]">
            {provider.blurb}
          </span>
        </div>
      </div>
      <span className="mono inline-flex shrink-0 items-center gap-2 rounded-full border border-[var(--border-warm)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--fg-muted)] transition-colors group-hover:border-[var(--accent)] group-hover:text-[var(--accent-text)]">
        Check address
        <ArrowIcon />
      </span>
    </a>
  );
}

function UnknownProviderCard({
  name,
  tech,
  servedBSLs,
  zip,
}: {
  name: string;
  tech: ProviderTech;
  servedBSLs: number;
  zip: string;
}) {
  const tone = techTone[tech];
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(`${name} internet availability ${zip}`)}`;
  return (
    <a
      href={searchUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-dashed border-[var(--border-soft)] bg-[var(--ink-raised)]/50 p-5 transition-all hover:-translate-y-0.5 hover:border-[var(--border-warm)] hover:bg-[var(--ink-card)]"
    >
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span
            className="mono inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{ borderColor: tone, color: tone }}
          >
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full"
              style={{ background: tone }}
            />
            {techLabel[tech]}
          </span>
          <span className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--fg-faint)]">
            {servedBSLs.toLocaleString()} homes in county
          </span>
        </div>
        <div className="display text-[18px] font-medium text-[var(--fg)] transition-colors group-hover:text-[var(--accent-text)]">
          {name}
        </div>
        <div className="mt-1 text-[12px] text-[var(--fg-dim)]">
          Regional / local provider — we don&apos;t have brand info yet. Click
          to search.
        </div>
      </div>
      <span className="mono inline-flex shrink-0 items-center gap-2 rounded-full border border-[var(--border-warm)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--fg-muted)] transition-colors group-hover:border-[var(--accent)] group-hover:text-[var(--accent-text)]">
        Search
        <ArrowIcon />
      </span>
    </a>
  );
}

function formatSpeed(mbps: number): string {
  if (mbps >= 1000)
    return `${(mbps / 1000).toFixed(mbps % 1000 === 0 ? 0 : 1)} Gbps`;
  return `${mbps} Mbps`;
}

function UnknownZip({
  zip,
  geocode,
}: {
  zip: string;
  geocode?: GeocodeResult;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--ink-raised)] p-6">
      <div className="mono mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--fg-faint)]">
        {geocode ? "Address matched" : `ZIP ${zip}`}
      </div>
      <div className="display text-[18px] font-medium text-[var(--fg)]">
        {geocode
          ? humanizeMatched(geocode.matchedAddress)
          : "We don't have provider data for this ZIP yet."}
      </div>
      <p className="mt-2 max-w-[58ch] text-[14px] text-[var(--fg-muted)]">
        {geocode
          ? `The Census 2020 ZCTA file doesn't include ZIP ${zip}. These free national tools cover every US address.`
          : "These two free national tools cover every US address. The FCC map is the official source."}
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <a
          href={`https://broadbandmap.fcc.gov/location-summary/fixed?location=&type=address&addr=${encodeURIComponent(zip)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mono inline-flex items-center gap-2 rounded-full border border-[var(--border-warm)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--fg-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent-text)]"
        >
          FCC National Broadband Map
          <ArrowIcon />
        </a>
        <a
          href={`https://broadbandnow.com/zip/${zip}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mono inline-flex items-center gap-2 rounded-full border border-[var(--border-warm)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--fg-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent-text)]"
        >
          BroadbandNow
          <ArrowIcon />
        </a>
      </div>
    </div>
  );
}
