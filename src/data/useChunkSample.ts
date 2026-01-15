import {useMemo} from "react";
import {useQueries} from "@tanstack/react-query";
import type {VulnerabilityRow} from "../types/vuln";
import {getChunk} from "./api";

export function useChunkSample(chunkCount: number) {
    const chunkNos = useMemo(() => Array.from({ length: chunkCount }, (_, i) => i), [chunkCount]);

    const queries = useQueries({
        queries: chunkNos.map((chunkNo) => ({
            queryKey: ["chunk", chunkNo],
            queryFn: () => getChunk(chunkNo),
            staleTime: Infinity,
        })),
    });

    const isLoading = queries.some((q) => q.isLoading);
    const isError = queries.some((q) => q.isError);

    const rows: VulnerabilityRow[] = useMemo(() => {
        const out: VulnerabilityRow[] = [];
        for (const q of queries) {
            if (q.data) out.push(...q.data);
        }
        return out;
    }, [queries]);

    return { rows, isLoading, isError };
}