import {useMemo} from "react";
import {useQueries} from "@tanstack/react-query";
import {getChunk} from "./api";
import type {VulnerabilityRow} from "../types/vuln";

export function useChunkRange(chunkNos: number[]) {
    const queries = useQueries({
        queries: chunkNos.map((chunkNo) => ({
            queryKey: ["chunk", chunkNo],
            queryFn: () => getChunk(chunkNo),
            staleTime: Infinity,
        })),
    });

    const isLoading = queries.some((q) => q.isLoading);
    const isError = queries.some((q) => q.isError);
    const error = queries.find((q) => q.isError)?.error as Error | undefined;

    const rows: Array<{ chunkNo: number; rows: VulnerabilityRow[] }> = useMemo(() => {
        const out: Array<{ chunkNo: number; rows: VulnerabilityRow[] }> = [];
        for (let i = 0; i < chunkNos.length; i++) {
            const data = queries[i]?.data;
            if (data) out.push({ chunkNo: chunkNos[i], rows: data });
        }
        return out;
    }, [chunkNos, queries]);

    return { rowsByChunk: rows, isLoading, isError, error };
}