# Security Vulnerability Dashboard

This project is a comprehensive React (TypeScript) dashboard for exploring and analysing software package vulnerabilities at scale.  It consumes a large JSON data set (300 MB+) containing vulnerability metadata (CVE IDs, severity scores, risk factors, timestamps, package details, etc.) and provides a rich, interactive UI for analysing that data.  The goal is to visualise risk, filter and sort vulnerabilities easily, and perform ad‑hoc analyses such as comparing two CVEs or exporting filtered results.

## Features

### Data handling

* **Efficient preprocessing:** A Node script processes the raw `ui_demo.json` dataset into normalized JSONL chunks, aggregate summary files (severity counts, risk‑factor frequencies, time trends), and indexes.  Each vulnerability is flattened into a row with fields such as `id`, `cve`, `severity`, `cvss`, `status`, `description`, `link`, `packageName`, `imageName`, timestamps, risk factors and `kaiStatus`.  An index (`byKaiStatus.json`) stores positions of “invalid – norisk” and “ai‑invalid‑norisk” rows for efficient exclusion, and a second index (`byId.json`) maps each row’s `id` to its `[chunkNo,rowIndex]` for detail lookups.
* **Chunked loading:** The front end never loads the entire dataset; instead it downloads small JSONL chunks (default 10k rows each) on demand.  A virtualization library (`react-window`) renders only visible rows, and a “Load more” button fetches additional chunks.
* **React Query caching:** Data fetching hooks (`useChunk`, `useAggSeverity`, etc.) cache chunks and aggregates, support prefetching and deduplicate network requests.
* **Type safety:** Typescript interfaces (`VulnerabilityRow`, `Severity`, `KaiStatus`) define the data model across the app and in the preprocess script.

### UI and components

* **Routing and code splitting:** Pages are defined using `react-router-dom` and loaded lazily via `React.lazy` and `Suspense` for better performance.  Main routes include `/dashboard`, `/vulnerabilities`, `/vulnerabilities/:id` and `/compare`.
* **Dashboard:** Displays key metrics (total CVEs, critical/high counts) and interactive charts: severity distribution, top risk factors, time trend of CVEs, an **AI vs Manual Impact** card showing the effect of “Analysis” and “AI Analysis” filters, and a **Critical Spotlight** card listing the top critical vulnerabilities from the loaded sample with risk scores.
* **Vulnerability list:** A virtualized table of CVEs with columns for severity, package, image, etc.  Users can search, sort (severity/CVSS/published date), and filter by severity, risk factors, date range, and whether the image is exposed.  Two action toggles—**Analysis** and **AI Analysis**—exclude rows with `kaiStatus` values “invalid – norisk” and “ai‑invalid‑norisk” respectively.  A chip bar displays the effect of filters and the number of items removed.
* **Detail page:** Clicking a row opens a detailed view with severity badge, CVSS score, fix status, description and advisory link, risk factor chips, timeline (published & fix dates), and actions to add the CVE to the compare list or export the row (JSON/CSV).
* **Compare page:** Users can select multiple CVEs to compare.  The page displays summary cards for each selected vulnerability and a comparison section that highlights differences (severity, CVSS, published/fix dates, package/image details, risk factors) as well as overlaps.  A dropdown lets the user choose which pair of CVEs to compare.

### Exporting & preferences

* **Export:** Users can export currently visible rows as CSV or JSON.  On the detail page, a dropdown lets you export a single vulnerability as JSON or CSV.
* **User preferences:** A persistent preferences panel allows users to toggle visibility of the Critical Spotlight and AI vs Manual Impact cards and choose how many chunks of data the spotlight uses (e.g., 2–4).  Preferences are stored in `localStorage` and loaded on startup.

### Performance optimizations

* **Virtualization:** `react-window` renders only the rows visible in the viewport, making lists of tens of thousands of items responsive.
* **Memoization:** Derived data such as exclusion sets (kaiStatus positions), visible row indices and sorted/filtered lists are memoized with `useMemo` to avoid costly recomputation.
* **Lazy loading:** Route‑level code splitting ensures that charts, detail/compare components, and heavy libraries are loaded only when needed.
* **Aggressive caching:** Aggregates and chunk files are cached by the browser/CDN.  Each chunk is small (typically a few megabytes), and the `meta.json` file records dataset version and chunk size for cache invalidation.

## Setup

### Prerequisites

* **Node >= 18** and **npm** (or yarn).
* A copy of the raw JSON dataset (`ui_demo.json`) in the project root.

### Install dependencies

```sh
npm install
```

### Preprocess the dataset

Run the preprocessing script to generate chunked data and aggregates under `public/data`:

```sh
# optional: adjust chunk size via CHUNK_SIZE env var
CHUNK_SIZE=8000 npx tsx scripts/preprocess.ts ui_demo.json
```

This script produces the following structure:

```
public/data/
  meta.json                 # dataset metadata: total rows, chunk size, etc.
  chunks/vulns_000.jsonl    # JSONL chunks of flattened rows
  chunks/vulns_001.jsonl
  ...
  agg/severityCounts.json   # counts of each severity
  agg/riskFactorCounts.json # counts of each risk factor
  agg/trendByMonth.json     # monthly CVE counts
  agg/kaiStatusCounts.json  # counts of kaiStatus values
  index/byKaiStatus.json    # kaiStatus -> [chunk,row] positions
  index/byId.json           # row id -> [chunk,row]
```

### Start the development server

```sh
npm run dev
```

Navigate to `http://localhost:3000` in your browser.  The dashboard will load with the processed data.

## Architecture overview

The application is organised into feature directories:

* **`scripts/`** – preprocessing script (`preprocess.ts`) that streams the large JSON, flattens it, computes aggregates and indexes, and writes JSONL chunks.
* **`src/app`** – routing configuration.  Routes are lazily loaded using `React.lazy` inside a top‑level `Suspense` wrapper.
* **`src/data`** – data access layer.  Provides React Query hooks to fetch aggregates (`useAggSeverity`, `useAggRiskFactors`, etc.), chunks (`useChunk`, `useChunkRange`, `useChunkSample`), and indexes (`useByKaiStatusIndex`, `useByIdIndex`).
* **`src/store`** – Redux Toolkit slices for analysis toggles (`analysisSlice`), filters (`filtersSlice`), comparison selection (`compareSlice`) and user preferences (`prefsSlice`).  Custom hooks (`useAppDispatch`, `useAppSelector`) simplify usage.
* **`src/components`** – reusable UI components including tables, charts, filter panels, action bars, spotlight cards and comparison views.  Chart components use Recharts and Material UI for consistent styling.
* **`src/pages`** – page components for Dashboard, Vulnerabilities, Detail and Compare.  Each page composes feature components and hooks to display data.

## Development notes

* **Extensibility:** The data model and hooks are designed to support additional fields (e.g., scanning vendor, affected versions, exploitability).  To add a new field, modify the `FlatVuln` interface in both the script and TypeScript types, regenerate the data, and update relevant components.
* **Server‑side option:** Although this assignment uses static files, the same architecture can be backed by a server API.  Indexes (e.g., `byId.json`) can be stored in a database, and queries can be served via endpoints.  The client code uses hooks that would work with an API by simply changing the fetch functions.
* **Testing:** Unit tests for the preprocessing logic and React components are recommended but out of scope for this assignment.  Cypress or Playwright can be used for end‑to‑end testing of filters, charts and navigation.

## Conclusion

This dashboard demonstrates how to handle large vulnerability datasets efficiently in the browser while providing rich analytics and intuitive user experience.  By preprocessing data into chunked files and aggregates, using virtualization, caching and code splitting, it achieves good performance even with hundreds of thousands of records.  The modular architecture and TypeScript typings make the project maintainable and extensible for future features.