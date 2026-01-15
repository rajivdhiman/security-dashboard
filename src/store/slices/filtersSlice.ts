import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {Severity} from "../../types/vuln";

export type SortKey = "severity" | "cvss" | "published";
export type SortDir = "asc" | "desc";

export type FiltersState = {
    search: string;

    severities: Record<string, boolean>; // critical/high/medium/low/unknown
    exposedOnly: boolean;

    publishedFrom?: string; // YYYY-MM-DD
    publishedTo?: string;   // YYYY-MM-DD

    riskFactors: string[];  // selected risk factor keys

    sortKey: SortKey;
    sortDir: SortDir;
};

const initialState: FiltersState = {
    search: "",
    severities: {
        critical: true,
        high: true,
        medium: true,
        low: true,
        unknown: true,
    },
    exposedOnly: false,
    publishedFrom: "",
    publishedTo: "",
    riskFactors: [],
    sortKey: "severity",
    sortDir: "desc",
};

const slice = createSlice({
    name: "filters",
    initialState,
    reducers: {
        setSearch(state, action: PayloadAction<string>) {
            state.search = action.payload;
        },
        setSeverity(state, action: PayloadAction<{ severity: Severity; checked: boolean }>) {
            state.severities[String(action.payload.severity).toLowerCase()] = action.payload.checked;
        },
        setExposedOnly(state, action: PayloadAction<boolean>) {
            state.exposedOnly = action.payload;
        },
        setPublishedFrom(state, action: PayloadAction<string>) {
            state.publishedFrom = action.payload;
        },
        setPublishedTo(state, action: PayloadAction<string>) {
            state.publishedTo = action.payload;
        },
        setRiskFactors(state, action: PayloadAction<string[]>) {
            state.riskFactors = action.payload;
        },
        setSort(state, action: PayloadAction<{ key: SortKey; dir: SortDir }>) {
            state.sortKey = action.payload.key;
            state.sortDir = action.payload.dir;
        },
        resetFilters(state) {
            Object.assign(state, initialState);
        },
    },
});

export const {
    setSearch,
    setSeverity,
    setExposedOnly,
    setPublishedFrom,
    setPublishedTo,
    setRiskFactors,
    setSort,
    resetFilters,
} = slice.actions;

export default slice.reducer;