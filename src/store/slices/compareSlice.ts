import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

type CompareState = {
    ids: string[]; // selected vulnerability row ids
    max: number;
};

const initialState: CompareState = {
    ids: [],
    max: 3,
};

const slice = createSlice({
    name: "compare",
    initialState,
    reducers: {
        addToCompare(state, action: PayloadAction<string>) {
            const id = action.payload;
            if (state.ids.includes(id)) return;
            if (state.ids.length >= state.max) state.ids.shift(); // drop oldest
            state.ids.push(id);
        },
        removeFromCompare(state, action: PayloadAction<string>) {
            state.ids = state.ids.filter((x) => x !== action.payload);
        },
        clearCompare(state) {
            state.ids = [];
        },
        setMax(state, action: PayloadAction<number>) {
            state.max = action.payload;
            if (state.ids.length > state.max) state.ids = state.ids.slice(-state.max);
        },
    },
});

export const { addToCompare, removeFromCompare, clearCompare, setMax } = slice.actions;
export default slice.reducer;