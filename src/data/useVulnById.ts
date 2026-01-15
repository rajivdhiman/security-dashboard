import {useMemo} from "react";
import {useQuery} from "@tanstack/react-query";
import type {VulnerabilityRow} from "../types/vuln";
import {useByIdIndex} from "./useByIdIndex";
import {getChunk} from "./api";

export function useVulnById(id?: string) {
    const safeId = useMemo(() => (id ? decodeURIComponent(id) : ""), [id]);

    const {
        data: byId,
        isLoading: indexLoading,
        isError: indexError,
    } = useByIdIndex();

    const loc = safeId && byId ? byId[safeId] : undefined;
    const chunkNo = loc?.[0];
    const rowIndex = loc?.[1];

    const chunkQuery = useQuery({
        queryKey: ["chunk", chunkNo],
        queryFn: () => getChunk(chunkNo!),
        enabled: typeof chunkNo === "number",
        staleTime: Infinity,
    });

    const row: VulnerabilityRow | null = useMemo(() => {
        if (!chunkQuery.data || typeof rowIndex !== "number") return null;
        return chunkQuery.data[rowIndex] ?? null;
    }, [chunkQuery.data, rowIndex]);

    return {
        row,
        isLoading: indexLoading || chunkQuery.isLoading,
        isError: indexError || chunkQuery.isError,
    };
}