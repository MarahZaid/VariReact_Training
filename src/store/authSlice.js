import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAdmin: null,       // null | true | false
    status: "loading",   // "loading" | "authenticated" | "unauthenticated"
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setIsAdmin(state, action) {
      state.isAdmin = action.payload;
      state.status = "authenticated"; 
    },
    setUnauthenticated(state) {
      state.user = null;
      state.isAdmin = false;
      state.status = "unauthenticated";
    },
  },
});

export const { setUser, setIsAdmin, setUnauthenticated } = authSlice.actions;
export default authSlice.reducer;