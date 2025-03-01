// NOTE: dummyJson API doesn't have the feature of filter by specific field so I will use just search

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import { Product } from "../types/APIsResponseTypes";
import { ProductsState } from "../types/GlobalStateTypes";
import { API_BASE_URL } from "../util/constant";
import searchInObject from "../util/searchInObject";

type responseType = {
  products: Product[];
  total: number;
};

const initialState: ProductsState = {
  currentPage: 1,
  totalProducts: 0,
  products: null,
  isLoading: true,
  recordsPerPage: 5,
  error: null,
  searchValue: "", // To client side
  category: "",
};

export const setProducts = createAsyncThunk<
  Product[],
  void,
  { state: RootState }
>("products/setProdutcs", async function (_, thunkAPI) {
  try {
    const limit = thunkAPI.getState().products.recordsPerPage;
    const skip = (thunkAPI.getState().products.currentPage - 1) * limit;

    const res = await axios.get<responseType>(
      `${API_BASE_URL}/products?limit=${limit}&skip=${skip}&select=id,title,brand,category`
    );

    thunkAPI.dispatch(setProductsCount(res.data.total));

    return res.data.products;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    }
    throw err;
  }
});

export const setProductsCategory = createAsyncThunk<
  Product[],
  void,
  { state: RootState }
>("products/setProductsCategory", async function (_, thunkAPI) {
  // https://dummyjson.com/
  try {
    const { recordsPerPage: limit, category } = thunkAPI.getState().products;
    const skip = (thunkAPI.getState().products.currentPage - 1) * limit;

    const res = await axios.get<responseType>(
      `${API_BASE_URL}/products/category/${category}?limit=${limit}&skip=${skip}&select=id,title,brand,category`
    );

    thunkAPI.dispatch(setProductsCount(res.data.total));

    return res.data.products;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    }
    throw err;
  }
});

const slice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilteredDataFor(state, action) {
      state.products = state.products?.filter((val) =>
        searchInObject(action.payload, val)
      ) as Product[];
    },

    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },

    setRecordsPerPage(state, action) {
      state.recordsPerPage = action.payload;
    },

    setProductsCount(state, action) {
      state.totalProducts = action.payload;
    },

    setSearchValue(state, action) {
      state.searchValue = action.payload;
    },

    setCategory(state, action) {
      state.category = action.payload
    },

    clearError(state) {
      state.error = null;
    }

  },
  extraReducers(builder) {
    // In case of getting products either with or without search query
    builder.addCase(setProducts.pending, function (state) {
      state.error = null;
      state.isLoading = true;
    });
    builder.addCase(setProducts.fulfilled, function (state, action) {
      state.products = action.payload;
      state.isLoading = false;
    });
    builder.addCase(setProducts.rejected, function (state, action) {
      state.error = action.error as Error;
      state.isLoading = false;
    });

    // In case of filter categories
    builder.addCase(setProductsCategory.pending, function (state) {
      state.error = null;
      state.isLoading = true;
    });
    builder.addCase(setProductsCategory.fulfilled, function (state, action) {
      state.products = action.payload;
      state.isLoading = false;
    });

    builder.addCase(setProductsCategory.rejected, function (state, action) {
      state.error = action.error as Error;
      state.isLoading = false;
    });
  },
});

export const {
  setCurrentPage,
  setFilteredDataFor,
  setProductsCount,
  setRecordsPerPage,
  setSearchValue,
  setCategory,
  clearError
} = slice.actions;

export default slice.reducer;
