import {useQuery} from "@tanstack/react-query";
import {getByKaiStatusIndex, getChunk, getMeta, getRiskFactorCounts, getSeverityCounts, getTrendByMonth,} from "./api";

export function useMeta() {
    return useQuery({ queryKey: ["meta"], queryFn: getMeta });
}

export function useAggSeverity() {
    return useQuery({ queryKey: ["agg", "severity"], queryFn: getSeverityCounts });
}

export function useAggRiskFactors() {
    return useQuery({ queryKey: ["agg", "riskFactors"], queryFn: getRiskFactorCounts });
}

export function useAggTrendByMonth() {
    return useQuery({ queryKey: ["agg", "trendByMonth"], queryFn: getTrendByMonth });
}

export function useByKaiStatusIndex() {
    return useQuery({ queryKey: ["index", "byKaiStatus"], queryFn: getByKaiStatusIndex });
}

export function useChunk(chunkNo: number) {
    return useQuery({
        queryKey: ["chunk", chunkNo],
        queryFn: () => getChunk(chunkNo),
        staleTime: Infinity,
    });
}

export type ByIdIndex = Record<string, [number, number]>;

export function useByIdIndex() {
    return useQuery({
        queryKey: ["index", "byId"],
        queryFn: async () => {
            const res = await fetch("/data/index/byId.json");
            if (!res.ok) throw new Error("Failed to load byId index");
            return (await res.json()) as ByIdIndex;
        },
        staleTime: Infinity,
    });
}

export function useAggKaiStatusCounts() {
    return useQuery({
        queryKey: ["agg", "kaiStatusCounts"],
        queryFn: async () => {
            const res = await fetch("/data/agg/kaiStatusCounts.json");
            if (!res.ok) throw new Error("Failed to load kaiStatusCounts");
            return (await res.json()) as Record<string, number>;
        },
        staleTime: Infinity,
    });
}