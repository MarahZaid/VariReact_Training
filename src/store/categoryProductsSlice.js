import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import { ref, get } from "firebase/database";
import { db } from "../firebase/firebaseConfig";


export const fetchCategoryProducts = createAsyncThunk(
  "categoryProducts/fetch",
  async (categoryId) => {
    const categorySnapshot = await get(ref(db, `categories/${categoryId}`));
    const category = categorySnapshot.exists() ? categorySnapshot.val() : null;

    const productsSnapshot = await get(ref(db, "products"));
    const allProducts = productsSnapshot.exists() ? productsSnapshot.val() : {};

    const products = Object.entries(allProducts)
      .filter(([, product]) => product.categoryId === categoryId)
      .map(([id, product]) => ({ id, ...product }));

    return { category, products };
  }
);

const initialState = {
  category: null,
  products: [],
  sortValue: "default",
  filters: {
    finish: [],
    warranty: [],
    certifications: [],
    price: [],
    depth: [],
  },
  loading: false,
  error: null,
};

const categoryProductsSlice = createSlice({
  name: "categoryProducts",
  initialState,
  reducers: {
    setSortValue(state, action) {
      state.sortValue = action.payload;
    },
    
    toggleFilter(state, action) {
      const { type, value } = action.payload;
      const current = state.filters[type];

      if (current.includes(value)) {
        state.filters[type] = current.filter((v) => v !== value);
      } else {
        state.filters[type] = [...current, value];
      }
    },
    clearFilters(state) {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoryProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.category = action.payload.category;
        state.products = action.payload.products;
      })
      .addCase(fetchCategoryProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSortValue, toggleFilter, clearFilters } =
  categoryProductsSlice.actions;

// ---------------- Selectors ----------------

const selectProducts = (state) => state.categoryProducts.products;
const selectFilters = (state) => state.categoryProducts.filters;
const selectSortValue = (state) => state.categoryProducts.sortValue;


function applyFilters(products, filters) {
  const hasAnyFilter = Object.values(filters).some((arr) => arr.length > 0);
  if (!hasAnyFilter) return products;

  return products.filter((product) => {
    if (filters.finish.length) {
      const hasFinish = filters.finish.some((f) =>
        product.specs.finish.includes(f)
      );
      if (!hasFinish) return false;
    }

    if (filters.warranty.length) {
      if (!filters.warranty.includes(product.specs.warranty)) return false;
    }

    if (filters.certifications.length) {
      const hasCert = filters.certifications.some((c) =>
        product.specs.certifications.includes(c)
      );
      if (!hasCert) return false;
    }

    if (filters.depth.length) {
      const depth = parseFloat(product.specs.desktopDepth);
      const selectedDepths = filters.depth.map(Number);
      if (!selectedDepths.includes(depth)) return false;
    }

    if (filters.price.length) {
      const price = product.price;
      const inRange = filters.price.some((range) => {
        const [min, max] = range.split("-").map(Number);
        return price >= min && price <= max;
      });
      if (!inRange) return false;
    }

    return true;
  });
}


function sortProductsList(products, sortValue) {
  const sorted = [...products];

  switch (sortValue) {
    case "lowToHigh":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "highToLow":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "aToz":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "zToa":
      sorted.sort((a, b) => b.name.localeCompare(a.name));
      break;
    default:
      break;
  }

  return sorted;
}

export const selectFilteredSortedProducts = createSelector(
  [selectProducts, selectFilters, selectSortValue],
  (products, filters, sortValue) => {
    const filtered = applyFilters(products, filters);
    return sortProductsList(filtered, sortValue);
  }
);

export default categoryProductsSlice.reducer;