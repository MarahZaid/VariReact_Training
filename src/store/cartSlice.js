import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: {},        // { productId: quantity }
    status: "idle",    // "idle" | "loading" | "loaded"
  },
  reducers: {
    setCart(state, action) {
      state.items = action.payload || {};
      state.status = "loaded";
    },
    resetCart(state) {
      state.items = {};
      state.status = "idle";
    },
  },
});

export const { setCart, resetCart } = cartSlice.actions;
export default cartSlice.reducer;