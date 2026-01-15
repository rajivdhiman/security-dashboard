import fs from "node:fs";
import path from "node:path";
import chain from "stream-chain";
import parser from "stream-json";
import pick from "stream-json/filters/Pick";
import streamObject from "stream-json/streamers/StreamObject";

type Severity = "critical" | "high" | "medium" | "low" | "unknown" | string;

type FlatVuln = {
    id: string;
    cve: string;
    severity: Severity;
    cvss?: number;
    status?: string;
    description?: string;
    link?: string;

    published?: string;
    fixDate?: string;

    packageName?: string;
    packageVersion?: string;
    packageType?: string;

    group: string;
    repo: string;

    imageName: string;
    imageVersion: string;
    baseImage?: string;
    buildType?: string;
    createTime?: string;

    exposed?: boolean;
    riskFactorKeys: string[];

    // assignment-specific (may exist in your real dataset)
    kaiStatus?: string | null;
};

type Counts = Record<string, number>;

function ensureDir(p: string) {
    fs.mkdirSync(p, { recursive: true });
}

function inc(map: Counts, key: string) {
    map[key] = (map[key] ?? 0) + 1;
}

function monthKey(dateStr?: string) {
    // expects "YYYY-MM-DD HH:mm:ss"
    if (!dateStr || dateStr.length < 7) return "unknown";
    return dateStr.slice(0, 7); // "YYYY-MM"
}

function safeRiskFactorKeys(riskFactors: any): string[] {
    if (!riskFactors || typeof riskFactors !== "object") return [];
    return Object.keys(riskFactors);
}

/**
 * You may need to adjust where kaiStatus lives in your real JSON.
 * Here are some fallback candidates:
 *  - vuln.kaiStatus
 *  - vuln.kai_status
 *  - image.metadata.kaiStatus (if exists)
 */
function extractKaiStatus(vuln: any, image: any): string | null {
    return (
        vuln?.kaiStatus ??
        vuln?.kai_status ??
        image?.metadata?.kaiStatus ??
        image?.metadata?.kai_status ??
        null
    );
}

/**
 * Compose a stable ID.
 * Use something deterministic so detail routing works reliably.
 */
function makeId(v: {
    cve?: string;
    imageName?: string;
    packageName?: string;
    packageVersion?: string;
}) {
    const cve = v.cve ?? "NO_CVE";
    const img = v.imageName ?? "NO_IMAGE";
    const pkg = v.packageName ? `${v.packageName}@${v.packageVersion ?? ""}` : "NO_PKG";
    return `${cve}|${img}|${pkg}`;
}

async function main() {
    const inputFile = process.argv[2] || "ui_demo.json";

    const outRoot = process.argv[3] || path.join(process.cwd(), "public", "data");
    const chunksDir = path.join(outRoot, "chunks");
    const aggDir = path.join(outRoot, "agg");
    const indexDir = path.join(outRoot, "index");

    ensureDir(outRoot);
    ensureDir(chunksDir);
    ensureDir(aggDir);
    ensureDir(indexDir);

    // ---- Aggregates ----
    const severityCounts: Counts = {};
    const riskFactorCounts: Counts = {};
    const trendByMonthCounts: Counts = {};
    const kaiStatusCounts: Counts = {};

    // ---- Indexes (optional) ----
    // store positions: kaiStatus -> list of [chunk, row]
    const byKaiStatus: Record<string, Array<[number, number]>> = {};
    const byId: Record<string, [number, number]> = {};

    // ---- Chunk writer ----
    const CHUNK_SIZE = Number(process.env.CHUNK_SIZE ?? 10000);
    let chunkNo = 0;
    let rowInChunk = 0;
    let totalRows = 0;

    let chunkStream = fs.createWriteStream(path.join(chunksDir, `vulns_${String(chunkNo).padStart(3, "0")}.jsonl`), {
        encoding: "utf-8",
    });

    function rotateChunk() {
        chunkStream.end();
        chunkNo++;
        rowInChunk = 0;
        chunkStream = fs.createWriteStream(
            path.join(chunksDir, `vulns_${String(chunkNo).padStart(3, "0")}.jsonl`),
            { encoding: "utf-8" }
        );
    }

    /**
     * We stream only groups.* (each group object).
     * Pipeline:
     *   parser -> Pick(groups) -> streamObject (gives each groupName + groupObj)
     */
    const pipeline = chain([
        fs.createReadStream(inputFile),
        parser(),
        new pick({ filter: "groups" }),
        new streamObject(),
    ]);

    for await (const { key: groupKey, value: groupVal } of pipeline as any) {
        const groupName = groupVal?.name ?? groupKey;
        const repos = groupVal?.repos ?? {};

        for (const [repoKey, repoVal] of Object.entries<any>(repos)) {
            const repoName = repoVal?.name ?? repoKey;
            const images = repoVal?.images ?? {};

            for (const [imageVersionKey, imageVal] of Object.entries<any>(images)) {
                const imageName = imageVal?.name ?? `${repoName}:${imageVersionKey}`;
                const imageVersion = imageVal?.version ?? imageVersionKey;

                const vulns: any[] = Array.isArray(imageVal?.vulnerabilities) ? imageVal.vulnerabilities : [];
                for (const vuln of vulns) {
                    const rfKeys = safeRiskFactorKeys(vuln?.riskFactors);
                    const kaiStatus = extractKaiStatus(vuln, imageVal);

                    const flat: FlatVuln = {
                        id: makeId({
                            cve: vuln?.cve,
                            imageName,
                            packageName: vuln?.packageName,
                            packageVersion: vuln?.packageVersion,
                        }),
                        cve: vuln?.cve ?? "UNKNOWN",
                        severity: (vuln?.severity ?? "unknown").toLowerCase(),
                        cvss: typeof vuln?.cvss === "number" ? vuln.cvss : undefined,
                        status: vuln?.status,
                        description: vuln?.description,
                        link: vuln?.link,

                        published: vuln?.published,
                        fixDate: vuln?.fixDate,

                        packageName: vuln?.packageName,
                        packageVersion: vuln?.packageVersion,
                        packageType: vuln?.packageType,

                        group: groupName,
                        repo: repoName,

                        imageName,
                        imageVersion,
                        baseImage: imageVal?.baseImage,
                        buildType: imageVal?.buildType,
                        createTime: imageVal?.createTime,
                        exposed: imageVal?.exposed,

                        riskFactorKeys: rfKeys,
                        kaiStatus,
                    };

                    // write row
                    chunkStream.write(JSON.stringify(flat) + "\n");
                    // byId index (for detail/compare direct fetch)
                    byId[flat.id] = [chunkNo, rowInChunk];

                    // aggregates
                    inc(severityCounts, flat.severity || "unknown");
                    inc(trendByMonthCounts, monthKey(flat.published));
                    for (const rf of rfKeys) inc(riskFactorCounts, rf);
                    if (flat.kaiStatus) inc(kaiStatusCounts, flat.kaiStatus);

                    // indexes
                    if (flat.kaiStatus) {
                        byKaiStatus[flat.kaiStatus] ||= [];
                        byKaiStatus[flat.kaiStatus].push([chunkNo, rowInChunk]);
                    }

                    rowInChunk++;
                    totalRows++;

                    if (rowInChunk >= CHUNK_SIZE) rotateChunk();
                }
            }
        }
    }

    // close last chunk
    chunkStream.end();

    // write aggregates
    fs.writeFileSync(path.join(aggDir, "severityCounts.json"), JSON.stringify(severityCounts, null, 2));
    fs.writeFileSync(path.join(aggDir, "riskFactorCounts.json"), JSON.stringify(riskFactorCounts, null, 2));
    fs.writeFileSync(path.join(aggDir, "trendByMonth.json"), JSON.stringify(trendByMonthCounts, null, 2));
    fs.writeFileSync(path.join(aggDir, "kaiStatusCounts.json"), JSON.stringify(kaiStatusCounts, null, 2));

    // write indexes
    fs.writeFileSync(path.join(indexDir, "byKaiStatus.json"), JSON.stringify(byKaiStatus, null, 2));
    fs.writeFileSync(path.join(indexDir, "byId.json"), JSON.stringify(byId, null, 2));

    // meta
    const meta = {
        datasetName: "ui_demo",
        generatedAt: new Date().toISOString(),
        chunkSize: CHUNK_SIZE,
        totalRows,
        totalChunks: chunkNo + 1,
        chunkFormat: "jsonl",
    };
    fs.writeFileSync(path.join(outRoot, "meta.json"), JSON.stringify(meta, null, 2));

    console.log("✅ Preprocess complete");
    console.log(meta);
}

main().catch((e) => {
    console.error("❌ Preprocess failed:", e);
    process.exit(1);
});