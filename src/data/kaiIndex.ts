export type ChunkRowSet = Map<number, Set<number>>;

export function buildChunkRowSet(pairs: Array<[number, number]> | undefined): ChunkRowSet {
    const map: ChunkRowSet = new Map();
    if (!pairs) return map;

    for (const [chunk, row] of pairs) {
        let set = map.get(chunk);
        if (!set) {
            set = new Set<number>();
            map.set(chunk, set);
        }
        set.add(row);
    }
    return map;
}

export function isExcludedRow(
    chunkNo: number,
    rowIndex: number,
    manualSet: ChunkRowSet | null,
    aiSet: ChunkRowSet | null,
    excludeManual: boolean,
    excludeAi: boolean
) {
    if (excludeManual && manualSet?.get(chunkNo)?.has(rowIndex)) return true;
    if (excludeAi && aiSet?.get(chunkNo)?.has(rowIndex)) return true;
    return false;
}