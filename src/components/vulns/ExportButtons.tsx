import {Button, Stack} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import type {VulnerabilityRow} from "../../types/vuln";
import Papa from "papaparse";
import {saveAs} from 'file-saver';

function downloadJson(rows: VulnerabilityRow[]) {
    const blob = new Blob([JSON.stringify(rows, null, 2)], { type: "application/json" });
    saveAs(blob, `vulns_export_${Date.now()}.json`);
}

function downloadCsv(rows: VulnerabilityRow[]) {
    const csv = Papa.unparse(
        rows.map((r) => ({
            cve: r.cve,
            severity: r.severity,
            cvss: r.cvss ?? "",
            published: r.published ?? "",
            fixDate: r.fixDate ?? "",
            packageName: r.packageName ?? "",
            packageVersion: r.packageVersion ?? "",
            imageName: r.imageName ?? "",
            group: r.group,
            repo: r.repo,
            exposed: r.exposed ? "true" : "false",
            kaiStatus: r.kaiStatus ?? "",
            riskFactors: (r.riskFactorKeys ?? []).join("|"),
        }))
    );

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, `vulns_export_${Date.now()}.csv`);
}

export default function ExportButtons({ rows }: { rows: VulnerabilityRow[] }) {
    return (
        <Stack direction="row" spacing={1}>
            <Button
                size="small"
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => downloadJson(rows)}
            >
                Export JSON
            </Button>

            <Button
                size="small"
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={() => downloadCsv(rows)}
            >
                Export CSV
            </Button>
        </Stack>
    );
}