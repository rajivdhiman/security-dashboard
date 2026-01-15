import type {VulnerabilityRow} from "../types/vuln";
import type {FiltersState} from "../store/slices/filtersSlice";

function contains(hay: string, needle: string) {
    return hay.toLowerCase().includes(needle.toLowerCase());
}

export function matchesFilters(row: VulnerabilityRow, f: FiltersState) {
    // kaiStatus handled separately (analysisSlice), so only “normal” filters here.

    // severity
    const sev = String(row.severity ?? "unknown").toLowerCase();
    if (!f.severities[sev]) return false;

    // exposed
    if (f.exposedOnly && !row.exposed) return false;

    // published date range (input is YYYY-MM-DD, row is "YYYY-MM-DD HH:mm:ss")
    const pub = row.published?.slice(0, 10) ?? "";
    if (f.publishedFrom && pub && pub < f.publishedFrom) return false;
    if (f.publishedTo && pub && pub > f.publishedTo) return false;

    // risk factors: require all selected to exist
    if (f.riskFactors.length > 0) {
        const set = new Set(row.riskFactorKeys ?? []);
        for (const rf of f.riskFactors) {
            if (!set.has(rf)) return false;
        }
    }

    // search: match CVE, package, image
    const q = f.search.trim();
    if (q) {
        const blob = [
            row.cve,
            row.packageName,
            row.packageVersion,
            row.imageName,
            row.group,
            row.repo,
        ]
            .filter(Boolean)
            .join(" ");

        if (!contains(blob, q)) return false;
    }

    return true;
}

const severityRank: Record<string, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
    unknown: 0,
};

export function compareRows(a: VulnerabilityRow, b: VulnerabilityRow, sortKey: string, sortDir: "asc" | "desc") {
    let av = 0;
    let bv = 0;

    if (sortKey === "severity") {
        av = severityRank[String(a.severity ?? "unknown").toLowerCase()] ?? 0;
        bv = severityRank[String(b.severity ?? "unknown").toLowerCase()] ?? 0;
    } else if (sortKey === "cvss") {
        av = a.cvss ?? -1;
        bv = b.cvss ?? -1;
    } else if (sortKey === "published") {
        const ap = a.published?.slice(0, 10) ?? "";
        const bp = b.published?.slice(0, 10) ?? "";
        av = ap ? Number(ap.replaceAll("-", "")) : 0;
        bv = bp ? Number(bp.replaceAll("-", "")) : 0;
    }

    const diff = av - bv;
    return sortDir === "asc" ? diff : -diff;
}