import { createSlice } from "@reduxjs/toolkit";

const loyaltySlice = createSlice({
    name: "loyalty",
    initialState: { toastAmount: null, points: 0 },  
    reducers: {
        showPointsToast(state, action) {
            state.toastAmount = action.payload;
        },
        clearPointsToast(state) {
            state.toastAmount = null;
        },
        setPointsBalance(state, action) {            
            state.points = action.payload;
        },
    },
});

export const { showPointsToast, clearPointsToast, setPointsBalance } = loyaltySlice.actions;
export default loyaltySlice.reducer;