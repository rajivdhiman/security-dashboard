import {useMemo} from "react";
import {useQueries} from "@tanstack/react-query";
import type {VulnerabilityRow} from "../types/vuln";
import {useByIdIndex} from "./useByIdIndex";
import {getChunk} from "./api";

type Loc = { id: string; chunkNo: number; rowIndex: number };

export function useRowsByIds(ids: string[]) {
    const { data: byId, isLoading: indexLoading, isError: indexError } = useByIdIndex();

    const locations: Loc[] = useMemo(() => {
        if (!byId) return [];
        const locs: Loc[] = [];

        for (const rawId of ids) {
            const id = decodeURIComponent(rawId);
            const loc = byId[id];
            if (!loc) continue;
            locs.push({ id, chunkNo: loc[0], rowIndex: loc[1] });
        }
        return locs;
    }, [byId, ids]);

    // Deduplicate chunk numbers
    const chunkNos = useMemo(() => {
        const set = new Set<number>();
        for (const l of locations) set.add(l.chunkNo);
        return Array.from(set).sort((a, b) => a - b);
    }, [locations]);

    // Fetch only needed chunks
    const chunkQueries = useQueries({
        queries: chunkNos.map((chunkNo) => ({
            queryKey: ["chunk", chunkNo],
            queryFn: () => getChunk(chunkNo),
            staleTime: Infinity,
            enabled: !indexLoading && !indexError,
        })),
    });

    const chunkMap = useMemo(() => {
        const m = new Map<number, VulnerabilityRow[]>();
        for (let i = 0; i < chunkNos.length; i++) {
            const data = chunkQueries[i]?.data;
            if (data) m.set(chunkNos[i], data);
        }
        return m;
    }, [chunkNos, chunkQueries]);

    const rows: VulnerabilityRow[] = useMemo(() => {
        const out: VulnerabilityRow[] = [];
        for (const l of locations) {
            const chunk = chunkMap.get(l.chunkNo);
            const row = chunk?.[l.rowIndex];
            if (row) out.push(row);
        }
        return out;
    }, [locations, chunkMap]);

    const isLoading = indexLoading || chunkQueries.some((q) => q.isLoading);
    const isError = indexError || chunkQueries.some((q) => q.isError);

    return { rows, isLoading, isError };
}