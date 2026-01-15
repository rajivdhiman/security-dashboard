import type {QueryClient} from "@tanstack/react-query";
import type {VulnerabilityRow} from "../types/vuln";

export function findRowInQueryCache(queryClient: QueryClient, id: string): VulnerabilityRow | null {
    // Find all queries with keys like ["chunk", n]
    const matches = queryClient
        .getQueryCache()
        .findAll({ predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === "chunk" });

    for (const q of matches) {
        const data = q.state.data as VulnerabilityRow[] | undefined;
        if (!data) continue;
        const hit = data.find((r) => r.id === id);
        if (hit) return hit;
    }
    return null;
}