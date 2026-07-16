import { configureStore } from "@reduxjs/toolkit";
import categoryProductsReducer from "./categoryProductsSlice";
import productDetailsReducer from "./productDetailsSlice";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    categoryProducts: categoryProductsReducer,
    productDetails: productDetailsReducer,
    auth: authReducer,
  },
});