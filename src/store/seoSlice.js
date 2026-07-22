import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  title: "",
  description:
    "Vari Site is an online store offering a wide range of quality products at great prices, with a fast and secure shopping experience.",
  url: "https://varireact-training.onrender.com/",
  type: "website",
};

const seoSlice = createSlice({
  name: "seo",
  initialState,
  reducers: {
    setSEO: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetSEO: () => initialState,
  },
});

export const { setSEO, resetSEO } = seoSlice.actions;
export default seoSlice.reducer;