import {useQuery} from "@tanstack/react-query";

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