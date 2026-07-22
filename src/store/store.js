import { configureStore } from "@reduxjs/toolkit";
import categoryProductsReducer from "./categoryProductsSlice";
import productDetailsReducer from "./productDetailsSlice";
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";
import searchReducer from "./searchSlice";
import seoReducer from "./seoSlice";


export const store = configureStore({
  reducer: {
    categoryProducts: categoryProductsReducer,
    productDetails: productDetailsReducer,
    auth: authReducer,
    cart: cartReducer,
    search: searchReducer,
    seo: seoReducer,
  },
});