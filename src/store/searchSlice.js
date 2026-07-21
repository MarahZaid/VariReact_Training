import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ref, get } from "firebase/database";
import { db } from "../firebase/firebaseConfig";

// Update this list to match your site's actual pages (same paths as in router.jsx)
const staticPages = [
  { title: "Home", path: "/", keywords: ["home", "homepage"] },
  { title: "All Products", path: "/products", keywords: ["products", "shop", "catalog"] },
  { title: "My Account", path: "/account", keywords: ["account", "profile"] },
  { title: "Shopping Cart", path: "/cart", keywords: ["cart", "bag"] },
  { title: "Checkout", path: "/checkout", keywords: ["checkout", "payment"] },
  { title: "Login", path: "/login", keywords: ["login", "sign in"] },
];

// Shared matching logic — used by both the live dropdown and the full
// /search results page, so results are always consistent between the two.
export function filterProducts(products, term) {
  if (!term) return [];
  return products.filter((product) => {
    const name = (product.name || "").toLowerCase();
    const shortDescription = (product.shortDescription || "").toLowerCase();
    return name.includes(term) || shortDescription.includes(term);
  });
}

export function filterCategories(categories, term) {
  if (!term) return [];
  return categories.filter((category) =>
    (category.name || "").toLowerCase().includes(term)
  );
}

export function filterPages(term) {
  if (!term) return [];
  return staticPages.filter((page) =>
    page.keywords.some(
      (keyword) =>
        keyword.toLowerCase().includes(term) || term.includes(keyword.toLowerCase())
    )
  );
}

// Fetches the full products/categories set ONE time and caches it in the
// store. After this resolves, every keystroke in the live search dropdown
// filters this cached array locally — no extra Firebase reads per letter.
export const fetchSearchIndex = createAsyncThunk(
  "search/fetchIndex",
  async (_, { getState }) => {
    const { status } = getState().search.index;
    // Avoid re-fetching if already loaded/loading (e.g. dropdown focus
    // firing while the full-page search already triggered a fetch).
    if (status === "loaded") {
      const { products, categories } = getState().search.index;
      return { products, categories };
    }

    const [productsSnapshot, categoriesSnapshot] = await Promise.all([
      get(ref(db, "products")),
      get(ref(db, "categories")),
    ]);

    const allProducts = productsSnapshot.exists() ? productsSnapshot.val() : {};
    const allCategories = categoriesSnapshot.exists() ? categoriesSnapshot.val() : {};

    return {
      products: Object.entries(allProducts).map(([id, product]) => ({ id, ...product })),
      categories: Object.entries(allCategories).map(([id, category]) => ({ id, ...category })),
    };
  }
);

export const fetchSearchResults = createAsyncThunk(
  "search/fetch",
  async (query, { getState, dispatch }) => {
    const term = query.trim().toLowerCase();
    if (!term) return { products: [], categories: [], pages: [] };

    let { products: allProducts, categories: allCategories, status } = getState().search.index;

    if (status !== "loaded") {
      const result = await dispatch(fetchSearchIndex());
      if (fetchSearchIndex.fulfilled.match(result)) {
        allProducts = result.payload.products;
        allCategories = result.payload.categories;
      }
    }

    return {
      products: filterProducts(allProducts, term),
      categories: filterCategories(allCategories, term),
      pages: filterPages(term),
    };
  }
);

const initialState = {
  query: "",
  products: [],
  categories: [],
  pages: [],
  loading: false,
  error: null,
  // Cached copy of everything, used for instant client-side filtering
  // in the live search dropdown.
  index: {
    products: [],
    categories: [],
    status: "idle", // idle | loading | loaded | failed
  },
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchQuery(state, action) {
      state.query = action.payload;
    },
    clearSearchResults(state) {
      return { ...initialState, index: state.index };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.categories = action.payload.categories;
        state.pages = action.payload.pages;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchSearchIndex.pending, (state) => {
        if (state.index.status === "idle") state.index.status = "loading";
      })
      .addCase(fetchSearchIndex.fulfilled, (state, action) => {
        state.index.status = "loaded";
        state.index.products = action.payload.products;
        state.index.categories = action.payload.categories;
      })
      .addCase(fetchSearchIndex.rejected, (state) => {
        state.index.status = "failed";
      });
  },
});

export const { setSearchQuery, clearSearchResults } = searchSlice.actions;
export default searchSlice.reducer;