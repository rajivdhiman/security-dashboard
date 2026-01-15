import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

export type PrefsState = {
    showSpotlight: boolean;
    showAiVsManual: boolean;
    spotlightChunkCount: number;
};

const STORAGE_KEY = "secDashboard.prefs.v1";

function loadPrefs(): PrefsState {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { showSpotlight: true, showAiVsManual: true, spotlightChunkCount: 2 };
        return { showSpotlight: true, showAiVsManual: true, spotlightChunkCount: 2, ...JSON.parse(raw) };
    } catch {
        return { showSpotlight: true, showAiVsManual: true, spotlightChunkCount: 2 };
    }
}

function savePrefs(prefs: PrefsState) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch { /* empty */ }
}

const slice = createSlice({
    name: "prefs",
    initialState: loadPrefs(),
    reducers: {
        setShowSpotlight(state, action: PayloadAction<boolean>) {
            state.showSpotlight = action.payload;
            savePrefs(state);
        },
        setShowAiVsManual(state, action: PayloadAction<boolean>) {
            state.showAiVsManual = action.payload;
            savePrefs(state);
        },
        setSpotlightChunkCount(state, action: PayloadAction<number>) {
            state.spotlightChunkCount = action.payload;
            savePrefs(state);
        },
    },
});

export const { setShowSpotlight, setShowAiVsManual, setSpotlightChunkCount } = slice.actions;
export default slice.reducer;