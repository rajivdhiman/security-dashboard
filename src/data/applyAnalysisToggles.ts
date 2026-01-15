import type {VulnerabilityRow} from "../types/vuln";

export function applyAnalysisToggles(
    rows: VulnerabilityRow[],
    excludeManualNoRisk: boolean,
    excludeAiNoRisk: boolean
) {
    const manual = "invalid - norisk";
    const ai = "ai-invalid-norisk";

    return rows.filter((r) => {
        const ks = (r.kaiStatus ?? "").toLowerCase();
        if (excludeManualNoRisk && ks === manual) return false;
        return !(excludeAiNoRisk && ks === ai);

    });
}