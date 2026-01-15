import type {VulnerabilityRow} from "../types/vuln";
import Papa from "papaparse";
import {saveAs} from "file-saver";

export function exportRowJson(row: VulnerabilityRow) {
    const blob = new Blob([JSON.stringify(row, null, 2)], { type: "application/json" });
    saveAs(blob, `${row.cve || "vuln"}_${Date.now()}.json`);
}

export function exportRowCsv(row: VulnerabilityRow) {
    const csv = Papa.unparse([
        {
            id: row.id,
            cve: row.cve,
            severity: row.severity,
            cvss: row.cvss ?? "",
            published: row.published ?? "",
            fixDate: row.fixDate ?? "",
            status: row.status ?? "",
            link: row.link ?? "",
            packageName: row.packageName ?? "",
            packageVersion: row.packageVersion ?? "",
            packageType: row.packageType ?? "",
            imageName: row.imageName ?? "",
            imageVersion: row.imageVersion ?? "",
            group: row.group ?? "",
            repo: row.repo ?? "",
            exposed: row.exposed ? "true" : "false",
            kaiStatus: row.kaiStatus ?? "",
            riskFactors: (row.riskFactorKeys ?? []).join("|"),
            description: row.description ?? "",
        },
    ]);

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, `${row.cve || "vuln"}_${Date.now()}.csv`);
}