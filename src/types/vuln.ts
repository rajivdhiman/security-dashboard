export type Severity = "critical" | "high" | "medium" | "low" | "unknown" | string;

export type KaiStatus =
    | "invalid - norisk"
    | "ai-invalid-norisk"
    | string;

export type VulnerabilityRow = {
    id: string;
    cve: string;
    severity: Severity;
    cvss?: number;

    published?: string;
    fixDate?: string;

    packageName?: string;
    packageVersion?: string;
    packageType?: string;

    group: string;
    repo: string;

    imageName: string;
    imageVersion: string;

    exposed?: boolean;

    riskFactorKeys: string[];
    kaiStatus?: KaiStatus | null;

    status?: string;
    description?: string;
    link?: string;
};

export type Meta = {
    datasetName: string;
    generatedAt: string;
    chunkSize: number;
    totalRows: number;
    totalChunks: number;
    chunkFormat: "jsonl" | "json";
};

export type SeverityCounts = Record<string, number>;
export type RiskFactorCounts = Record<string, number>;
export type TrendByMonthCounts = Record<string, number>;
export type KaiStatusCounts = Record<string, number>;

export type KaiStatusIndex = Record<string, Array<[number, number]>>; // [chunk,row]