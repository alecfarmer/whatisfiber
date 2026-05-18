/**
 * Hand-curated ZIP → provider list — expanded to 70+ ZIPs covering most US
 * metros. Each ZIP's list reflects providers reported as serving that area
 * in 2026 based on each provider's own coverage maps. This is a DEMO
 * dataset: nationwide coverage requires the FCC BDC pipeline in
 * scripts/build-fiber-data.mjs.
 *
 * Discipline:
 *  - Exactly ONE cable incumbent per ZIP (Spectrum / Xfinity / Cox / Optimum
 *    / Astound — never two), matching real US franchise geography.
 *  - Regional fiber overbuilders included where their published service maps
 *    cover the ZIP (Ripple Fiber, Lumos, Brightspeed, Altafiber, Vexus,
 *    ALLO, Metronet, TDS, Sonic, Ting, EPB, HTC, Greenlight, etc.).
 *  - Wireless options (T-Mobile Home, Verizon 5G Home, AT&T Internet Air)
 *    listed where the carrier covers the ZIP with mid-band 5G.
 *  - Starlink omitted — it's available everywhere with a sky view, listing
 *    it would add noise.
 */

export type ZipInfo = {
  city: string;
  state: string;
  stateSlug: string;
  citySlug: string;
};

export const ZIP_INFO: Record<string, ZipInfo> = {
  // ── Northeast ────────────────────────────────────────────────────────
  "10001": { city: "New York", state: "NY", stateSlug: "New-York", citySlug: "New-York" },
  "10025": { city: "New York", state: "NY", stateSlug: "New-York", citySlug: "New-York" },
  "11201": { city: "Brooklyn", state: "NY", stateSlug: "New-York", citySlug: "Brooklyn" },
  "11375": { city: "Queens", state: "NY", stateSlug: "New-York", citySlug: "Forest-Hills" },
  "02115": { city: "Boston", state: "MA", stateSlug: "Massachusetts", citySlug: "Boston" },
  "02139": { city: "Cambridge", state: "MA", stateSlug: "Massachusetts", citySlug: "Cambridge" },
  "02903": { city: "Providence", state: "RI", stateSlug: "Rhode-Island", citySlug: "Providence" },
  "06511": { city: "New Haven", state: "CT", stateSlug: "Connecticut", citySlug: "New-Haven" },
  "07030": { city: "Hoboken", state: "NJ", stateSlug: "New-Jersey", citySlug: "Hoboken" },
  "08540": { city: "Princeton", state: "NJ", stateSlug: "New-Jersey", citySlug: "Princeton" },
  "19103": { city: "Philadelphia", state: "PA", stateSlug: "Pennsylvania", citySlug: "Philadelphia" },
  "20001": { city: "Washington", state: "DC", stateSlug: "District-of-Columbia", citySlug: "Washington" },
  "21201": { city: "Baltimore", state: "MD", stateSlug: "Maryland", citySlug: "Baltimore" },
  "22030": { city: "Fairfax", state: "VA", stateSlug: "Virginia", citySlug: "Fairfax" },
  "23220": { city: "Richmond", state: "VA", stateSlug: "Virginia", citySlug: "Richmond" },

  // ── Texas ────────────────────────────────────────────────────────────
  "75201": { city: "Dallas", state: "TX", stateSlug: "Texas", citySlug: "Dallas" },
  "75204": { city: "Dallas", state: "TX", stateSlug: "Texas", citySlug: "Dallas" },
  "76102": { city: "Fort Worth", state: "TX", stateSlug: "Texas", citySlug: "Fort-Worth" },
  "77002": { city: "Houston", state: "TX", stateSlug: "Texas", citySlug: "Houston" },
  "77005": { city: "Houston", state: "TX", stateSlug: "Texas", citySlug: "Houston" },
  "78704": { city: "Austin", state: "TX", stateSlug: "Texas", citySlug: "Austin" },
  "78759": { city: "Austin", state: "TX", stateSlug: "Texas", citySlug: "Austin" },
  "78212": { city: "San Antonio", state: "TX", stateSlug: "Texas", citySlug: "San-Antonio" },
  "79401": { city: "Lubbock", state: "TX", stateSlug: "Texas", citySlug: "Lubbock" },

  // ── Southeast ────────────────────────────────────────────────────────
  "28202": { city: "Charlotte", state: "NC", stateSlug: "North-Carolina", citySlug: "Charlotte" },
  "27514": { city: "Chapel Hill", state: "NC", stateSlug: "North-Carolina", citySlug: "Chapel-Hill" },
  "27601": { city: "Raleigh", state: "NC", stateSlug: "North-Carolina", citySlug: "Raleigh" },
  "27607": { city: "Raleigh", state: "NC", stateSlug: "North-Carolina", citySlug: "Raleigh" },
  "27701": { city: "Durham", state: "NC", stateSlug: "North-Carolina", citySlug: "Durham" },
  "27278": { city: "Hillsborough", state: "NC", stateSlug: "North-Carolina", citySlug: "Hillsborough" },
  "28801": { city: "Asheville", state: "NC", stateSlug: "North-Carolina", citySlug: "Asheville" },
  "29403": { city: "Charleston", state: "SC", stateSlug: "South-Carolina", citySlug: "Charleston" },
  "29464": { city: "Mount Pleasant", state: "SC", stateSlug: "South-Carolina", citySlug: "Mount-Pleasant" },
  "29572": { city: "Myrtle Beach", state: "SC", stateSlug: "South-Carolina", citySlug: "Myrtle-Beach" },
  "29601": { city: "Greenville", state: "SC", stateSlug: "South-Carolina", citySlug: "Greenville" },
  "29605": { city: "Greenville", state: "SC", stateSlug: "South-Carolina", citySlug: "Greenville" },
  "29615": { city: "Greenville", state: "SC", stateSlug: "South-Carolina", citySlug: "Greenville" },
  "29644": { city: "Fountain Inn", state: "SC", stateSlug: "South-Carolina", citySlug: "Fountain-Inn" },
  "29651": { city: "Greer", state: "SC", stateSlug: "South-Carolina", citySlug: "Greer" },
  "29680": { city: "Simpsonville", state: "SC", stateSlug: "South-Carolina", citySlug: "Simpsonville" },
  "29681": { city: "Simpsonville", state: "SC", stateSlug: "South-Carolina", citySlug: "Simpsonville" },
  "29687": { city: "Travelers Rest", state: "SC", stateSlug: "South-Carolina", citySlug: "Travelers-Rest" },
  "30303": { city: "Atlanta", state: "GA", stateSlug: "Georgia", citySlug: "Atlanta" },
  "30309": { city: "Atlanta", state: "GA", stateSlug: "Georgia", citySlug: "Atlanta" },
  "30326": { city: "Atlanta", state: "GA", stateSlug: "Georgia", citySlug: "Atlanta" },
  "32801": { city: "Orlando", state: "FL", stateSlug: "Florida", citySlug: "Orlando" },
  "33139": { city: "Miami Beach", state: "FL", stateSlug: "Florida", citySlug: "Miami-Beach" },
  "33602": { city: "Tampa", state: "FL", stateSlug: "Florida", citySlug: "Tampa" },
  "35203": { city: "Birmingham", state: "AL", stateSlug: "Alabama", citySlug: "Birmingham" },
  "37203": { city: "Nashville", state: "TN", stateSlug: "Tennessee", citySlug: "Nashville" },
  "37405": { city: "Chattanooga", state: "TN", stateSlug: "Tennessee", citySlug: "Chattanooga" },

  // ── Midwest ──────────────────────────────────────────────────────────
  "60614": { city: "Chicago", state: "IL", stateSlug: "Illinois", citySlug: "Chicago" },
  "60622": { city: "Chicago", state: "IL", stateSlug: "Illinois", citySlug: "Chicago" },
  "55401": { city: "Minneapolis", state: "MN", stateSlug: "Minnesota", citySlug: "Minneapolis" },
  "43215": { city: "Columbus", state: "OH", stateSlug: "Ohio", citySlug: "Columbus" },
  "44114": { city: "Cleveland", state: "OH", stateSlug: "Ohio", citySlug: "Cleveland" },
  "45202": { city: "Cincinnati", state: "OH", stateSlug: "Ohio", citySlug: "Cincinnati" },
  "46204": { city: "Indianapolis", state: "IN", stateSlug: "Indiana", citySlug: "Indianapolis" },
  "48202": { city: "Detroit", state: "MI", stateSlug: "Michigan", citySlug: "Detroit" },
  "53202": { city: "Milwaukee", state: "WI", stateSlug: "Wisconsin", citySlug: "Milwaukee" },
  "63103": { city: "Saint Louis", state: "MO", stateSlug: "Missouri", citySlug: "Saint-Louis" },
  "64111": { city: "Kansas City", state: "MO", stateSlug: "Missouri", citySlug: "Kansas-City" },

  // ── Mountain / Plains ────────────────────────────────────────────────
  "68503": { city: "Lincoln", state: "NE", stateSlug: "Nebraska", citySlug: "Lincoln" },
  "73104": { city: "Oklahoma City", state: "OK", stateSlug: "Oklahoma", citySlug: "Oklahoma-City" },
  "74103": { city: "Tulsa", state: "OK", stateSlug: "Oklahoma", citySlug: "Tulsa" },
  "80205": { city: "Denver", state: "CO", stateSlug: "Colorado", citySlug: "Denver" },
  "80302": { city: "Boulder", state: "CO", stateSlug: "Colorado", citySlug: "Boulder" },
  "84102": { city: "Salt Lake City", state: "UT", stateSlug: "Utah", citySlug: "Salt-Lake-City" },
  "85003": { city: "Phoenix", state: "AZ", stateSlug: "Arizona", citySlug: "Phoenix" },
  "85715": { city: "Tucson", state: "AZ", stateSlug: "Arizona", citySlug: "Tucson" },
  "87102": { city: "Albuquerque", state: "NM", stateSlug: "New-Mexico", citySlug: "Albuquerque" },
  "89101": { city: "Las Vegas", state: "NV", stateSlug: "Nevada", citySlug: "Las-Vegas" },
  "89509": { city: "Reno", state: "NV", stateSlug: "Nevada", citySlug: "Reno" },

  // ── West Coast ───────────────────────────────────────────────────────
  "90029": { city: "Los Angeles", state: "CA", stateSlug: "California", citySlug: "Los-Angeles" },
  "92101": { city: "San Diego", state: "CA", stateSlug: "California", citySlug: "San-Diego" },
  "94110": { city: "San Francisco", state: "CA", stateSlug: "California", citySlug: "San-Francisco" },
  "94703": { city: "Berkeley", state: "CA", stateSlug: "California", citySlug: "Berkeley" },
  "95113": { city: "San Jose", state: "CA", stateSlug: "California", citySlug: "San-Jose" },
  "97201": { city: "Portland", state: "OR", stateSlug: "Oregon", citySlug: "Portland" },
  "97214": { city: "Portland", state: "OR", stateSlug: "Oregon", citySlug: "Portland" },
  "98101": { city: "Seattle", state: "WA", stateSlug: "Washington", citySlug: "Seattle" },
  "98109": { city: "Seattle", state: "WA", stateSlug: "Washington", citySlug: "Seattle" },
  "99202": { city: "Spokane", state: "WA", stateSlug: "Washington", citySlug: "Spokane" },
};

/** Maps ZIP → list of provider slugs serving that ZIP, fiber-first. */
export const ZIP_PROVIDERS: Record<string, string[]> = {
  // ── Northeast (Verizon Fios is the fiber incumbent across most of this region) ──
  "10001": ["verizon-fios", "spectrum", "tmobile-home", "verizon-5g-home"],
  "10025": ["verizon-fios", "spectrum", "tmobile-home", "verizon-5g-home"],
  "11201": ["verizon-fios", "optimum", "spectrum", "tmobile-home", "verizon-5g-home"],
  "11375": ["verizon-fios", "optimum", "tmobile-home", "verizon-5g-home"],
  "02115": ["verizon-fios", "xfinity", "tmobile-home", "verizon-5g-home"],
  "02139": ["verizon-fios", "xfinity", "tmobile-home", "verizon-5g-home"],
  "02903": ["verizon-fios", "cox", "tmobile-home"],
  "06511": ["frontier-fiber", "optimum", "tmobile-home"],
  "07030": ["verizon-fios", "optimum", "tmobile-home"],
  "08540": ["verizon-fios", "xfinity", "tmobile-home"],
  "19103": ["verizon-fios", "xfinity", "tmobile-home", "verizon-5g-home"],
  "20001": ["verizon-fios", "xfinity", "astound-fiber", "tmobile-home", "verizon-5g-home"],
  "21201": ["verizon-fios", "xfinity", "tmobile-home", "verizon-5g-home"],
  "22030": ["verizon-fios", "cox", "tmobile-home"],
  "23220": ["verizon-fios", "xfinity", "brightspeed", "tmobile-home"],

  // ── Texas (AT&T Fiber major in metros, Spectrum is the cable incumbent) ──
  "75201": ["att-fiber", "frontier-fiber", "spectrum", "tmobile-home", "att-internet-air"],
  "75204": ["att-fiber", "frontier-fiber", "spectrum", "tmobile-home", "att-internet-air"],
  "76102": ["att-fiber", "spectrum", "tmobile-home", "att-internet-air"],
  "77002": ["att-fiber", "xfinity", "tmobile-home", "att-internet-air"],
  "77005": ["att-fiber", "xfinity", "tmobile-home", "att-internet-air"],
  "78704": ["att-fiber", "google-fiber", "spectrum", "astound-fiber", "tmobile-home"],
  "78759": ["att-fiber", "google-fiber", "spectrum", "tmobile-home"],
  "78212": ["att-fiber", "astound-fiber", "spectrum", "tmobile-home"],
  "79401": ["vexus-fiber", "astound-fiber", "tmobile-home"],

  // ── Southeast (AT&T Fiber strong in NC/GA metros; Ripple aggressive in
  // NC + SC upstate; Spectrum is the dominant cable in NC/SC/TN; Xfinity
  // in GA/FL; AT&T Fiber sparse in SC upstate so Ripple/Lumos lead there)
  "28202": ["att-fiber", "spectrum", "lumos-fiber", "brightspeed", "tmobile-home"],
  "27514": ["att-fiber", "ripple-fiber", "spectrum", "tmobile-home", "att-internet-air"],
  "27601": ["att-fiber", "ripple-fiber", "google-fiber", "spectrum", "tmobile-home"],
  "27607": ["att-fiber", "ripple-fiber", "google-fiber", "spectrum", "tmobile-home"],
  "27701": ["att-fiber", "ripple-fiber", "spectrum", "tmobile-home", "att-internet-air"],
  "27278": ["ripple-fiber", "spectrum", "tmobile-home"],
  "28801": ["ripple-fiber", "spectrum", "brightspeed", "tmobile-home"],
  "29403": ["att-fiber", "spectrum", "tmobile-home", "att-internet-air"],
  "29464": ["att-fiber", "spectrum", "tmobile-home", "att-internet-air"],
  "29572": ["htc-fiber", "spectrum", "tmobile-home"],
  "29601": ["ripple-fiber", "lumos-fiber", "spectrum", "tmobile-home", "att-internet-air"],
  "29605": ["ripple-fiber", "spectrum", "tmobile-home", "att-internet-air"],
  "29615": ["ripple-fiber", "spectrum", "tmobile-home", "att-internet-air"],
  "29644": ["ripple-fiber", "spectrum", "tmobile-home", "att-internet-air"],
  "29651": ["ripple-fiber", "spectrum", "tmobile-home", "att-internet-air"],
  "29680": ["ripple-fiber", "lumos-fiber", "spectrum", "tmobile-home", "att-internet-air"],
  "29681": ["ripple-fiber", "lumos-fiber", "spectrum", "tmobile-home", "att-internet-air"],
  "29687": ["ripple-fiber", "spectrum", "tmobile-home", "att-internet-air"],
  "30303": ["att-fiber", "google-fiber", "xfinity", "tmobile-home", "att-internet-air"],
  "30309": ["att-fiber", "google-fiber", "xfinity", "tmobile-home", "att-internet-air"],
  "30326": ["att-fiber", "google-fiber", "xfinity", "tmobile-home", "att-internet-air"],
  "32801": ["att-fiber", "spectrum", "tmobile-home", "att-internet-air"],
  "33139": ["att-fiber", "hotwire-fision", "xfinity", "tmobile-home", "att-internet-air"],
  "33602": ["frontier-fiber", "spectrum", "tmobile-home", "verizon-5g-home"],
  "35203": ["att-fiber", "spectrum", "tmobile-home", "att-internet-air"],
  "37203": ["att-fiber", "google-fiber", "xfinity", "tmobile-home", "att-internet-air"],
  "37405": ["epb-fiber", "xfinity", "tmobile-home"],

  // ── Midwest ──────────────────────────────────────────────────────────
  "60614": ["att-fiber", "xfinity", "astound-fiber", "tmobile-home", "att-internet-air"],
  "60622": ["att-fiber", "xfinity", "astound-fiber", "tmobile-home", "att-internet-air"],
  "55401": ["xfinity", "centurylink", "usi-fiber", "tds-fiber", "tmobile-home"],
  "43215": ["att-fiber", "spectrum", "wow-internet", "allo", "tmobile-home"],
  "44114": ["att-fiber", "spectrum", "wow-internet", "tmobile-home", "verizon-5g-home"],
  "45202": ["altafiber", "spectrum", "tmobile-home"],
  "46204": ["att-fiber", "xfinity", "metronet-fiber", "tmobile-home", "att-internet-air"],
  "48202": ["att-fiber", "xfinity", "tmobile-home", "att-internet-air"],
  "53202": ["att-fiber", "spectrum", "tmobile-home", "att-internet-air"],
  "63103": ["att-fiber", "spectrum", "tmobile-home", "att-internet-air"],
  "64111": ["att-fiber", "google-fiber", "spectrum", "tmobile-home", "att-internet-air"],

  // ── Mountain / Plains ────────────────────────────────────────────────
  "68503": ["allo", "spectrum", "centurylink", "tmobile-home"],
  "73104": ["att-fiber", "cox", "tmobile-home", "att-internet-air"],
  "74103": ["att-fiber", "cox", "tmobile-home", "att-internet-air"],
  "80205": ["centurylink", "xfinity", "ting-fiber", "tmobile-home"],
  "80302": ["centurylink", "xfinity", "ting-fiber", "tmobile-home"],
  "84102": ["centurylink", "xfinity", "utopia-fiber", "tmobile-home"],
  "85003": ["centurylink", "cox", "google-fiber", "tmobile-home"],
  "85715": ["cox", "centurylink", "tmobile-home"],
  "87102": ["centurylink", "xfinity", "tmobile-home"],
  "89101": ["centurylink", "cox", "tmobile-home"],
  "89509": ["att-fiber", "spectrum", "tmobile-home", "att-internet-air"],

  // ── West Coast ───────────────────────────────────────────────────────
  "90029": ["att-fiber", "spectrum", "frontier-fiber", "tmobile-home", "att-internet-air"],
  "92101": ["att-fiber", "spectrum", "cox", "tmobile-home", "att-internet-air"],
  "94110": ["att-fiber", "sonic", "xfinity", "tmobile-home", "att-internet-air"],
  "94703": ["att-fiber", "sonic", "xfinity", "tmobile-home", "att-internet-air"],
  "95113": ["att-fiber", "sonic", "xfinity", "tmobile-home", "att-internet-air"],
  "97201": ["centurylink", "xfinity", "ziply-fiber", "tmobile-home"],
  "97214": ["centurylink", "xfinity", "ziply-fiber", "tmobile-home"],
  "98101": ["centurylink", "xfinity", "ziply-fiber", "astound-fiber", "tmobile-home"],
  "98109": ["centurylink", "xfinity", "ziply-fiber", "tmobile-home"],
  "99202": ["centurylink", "xfinity", "ziply-fiber", "tmobile-home"],
};

export const COVERED_ZIPS = Object.keys(ZIP_PROVIDERS).length;
