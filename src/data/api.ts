import type {
    KaiStatusCounts,
    KaiStatusIndex,
    Meta,
    RiskFactorCounts,
    SeverityCounts,
    TrendByMonthCounts,
    VulnerabilityRow,
} from "../types/vuln";

// Base path where preprocess outputs live
const DATA_BASE = "/data";

async function fetchJson<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
    return (await res.json()) as T;
}

export function getMeta() {
    return fetchJson<Meta>(`${DATA_BASE}/meta.json`);
}

export function getSeverityCounts() {
    return fetchJson<SeverityCounts>(`${DATA_BASE}/agg/severityCounts.json`);
}

export function getRiskFactorCounts() {
    return fetchJson<RiskFactorCounts>(`${DATA_BASE}/agg/riskFactorCounts.json`);
}

export function getTrendByMonth() {
    return fetchJson<TrendByMonthCounts>(`${DATA_BASE}/agg/trendByMonth.json`);
}

export function getKaiStatusCounts() {
    return fetchJson<KaiStatusCounts>(`${DATA_BASE}/agg/kaiStatusCounts.json`);
}

export function getByKaiStatusIndex() {
    return fetchJson<KaiStatusIndex>(`${DATA_BASE}/index/byKaiStatus.json`);
}

/**
 * Fetch a JSONL chunk and parse line-by-line.
 * Each line is a JSON object (VulnerabilityRow).
 */
export async function getChunk(chunkNo: number): Promise<VulnerabilityRow[]> {
    const file = `${DATA_BASE}/chunks/vulns_${String(chunkNo).padStart(3, "0")}.jsonl`;
    const res = await fetch(file);
    if (!res.ok) throw new Error(`Failed to fetch ${file}: ${res.status}`);

    const text = await res.text();
    const lines = text.split("\n").filter(Boolean);

    // Parse JSONL lines (simple & effective for 5k-10k records)
    return lines.map((line) => JSON.parse(line) as VulnerabilityRow);
}