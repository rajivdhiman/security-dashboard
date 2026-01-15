import {createSlice} from "@reduxjs/toolkit";

type AnalysisState = {
    excludeManualNoRisk: boolean; // "invalid - norisk"
    excludeAiNoRisk: boolean;     // "ai-invalid-norisk"
};

const initialState: AnalysisState = {
    excludeManualNoRisk: false,
    excludeAiNoRisk: false,
};

const analysisSlice = createSlice({
    name: "analysis",
    initialState,
    reducers: {
        toggleExcludeManualNoRisk(state) {
            state.excludeManualNoRisk = !state.excludeManualNoRisk;
        },
        toggleExcludeAiNoRisk(state) {
            state.excludeAiNoRisk = !state.excludeAiNoRisk;
        },
    },
});

export const {
    toggleExcludeManualNoRisk,
    toggleExcludeAiNoRisk,
} = analysisSlice.actions;

export default analysisSlice.reducer;