import {configureStore} from "@reduxjs/toolkit";
import analysisReducer from "./slices/analysisSlice";
import filtersReducer from "./slices/filtersSlice";
import compareReducer from "./slices/compareSlice";
import prefsReducer from "./slices/prefsSlice";

export const store = configureStore({
    reducer: {
        analysis: analysisReducer,
        filters: filtersReducer,
        compare: compareReducer,
        prefs: prefsReducer,
    },
    middleware: (getDefault) => getDefault(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;