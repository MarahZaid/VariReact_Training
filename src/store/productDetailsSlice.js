import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ref, get } from "firebase/database";
import { db } from "../firebase/firebaseConfig";


export const fetchProductDetails = createAsyncThunk(
  "productDetails/fetch",
  async (productId) => {

    const [productSnapshot, reviewsSnapshot] = await Promise.all([
      get(ref(db, `products/${productId}`)),
      get(ref(db, `reviews/${productId}`)),
    ]);

    if (!productSnapshot.exists()) {
      throw new Error(`Product "${productId}" was not found in the database.`);
    }

    const product = { id: productId, ...productSnapshot.val() };

    const reviews = reviewsSnapshot.exists()
      ? Object.entries(reviewsSnapshot.val())
          .map(([id, review]) => ({ id, ...review }))
          .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
      : [];

    let category = null;
    if (product.categoryId) {
      const categorySnapshot = await get(ref(db, `categories/${product.categoryId}`));
      category = categorySnapshot.exists()
        ? { id: product.categoryId, ...categorySnapshot.val() }
        : null;
    }

    return { product, reviews, category };
  }
);

const initialState = {
  product: null,
  category: null,
  reviews: [],
  selectedColorIndex: 0,
  loading: false,
  error: null,
};

const productDetailsSlice = createSlice({
  name: "productDetails",
  initialState,
  reducers: {
    setSelectedColorIndex(state, action) {
      state.selectedColorIndex = action.payload;
    },
    resetProductDetails() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.product;
        state.reviews = action.payload.reviews;
        state.category = action.payload.category;
        state.selectedColorIndex = 0;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSelectedColorIndex, resetProductDetails } =
  productDetailsSlice.actions;

export default productDetailsSlice.reducer;