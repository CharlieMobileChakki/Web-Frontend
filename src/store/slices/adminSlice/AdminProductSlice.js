// src/redux/slices/adminSlice/AdminProductSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  AdminGetProducts,
  AdminCreateProduct,
  AdminUpdateProduct,
  AdminDeleteProduct
} from "../../../services/NetworkServices";


// ================== ASYNC THUNKS ==================

// GET PRODUCTS
export const adminGetProducts = createAsyncThunk(
  "adminProducts/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await AdminGetProducts();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// CREATE PRODUCT
export const adminCreateProduct = createAsyncThunk(
  "adminProducts/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await AdminCreateProduct(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// UPDATE PRODUCT
export const adminUpdateProduct = createAsyncThunk(
  "adminProducts/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await AdminUpdateProduct(id, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// DELETE PRODUCT
export const adminDeleteProduct = createAsyncThunk(
  "adminProducts/delete",
  async (id, { rejectWithValue }) => {
    try {
      const res = await AdminDeleteProduct(id);
      return { id, data: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


// ================== SLICE ==================
const AdminProductSlice = createSlice({
  name: "adminProducts",
  initialState: {
    products: [],
    totalPages: 1,
    currentPage: 1,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // GET PRODUCTS
      .addCase(adminGetProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminGetProducts.fulfilled, (state, action) => {
        state.loading = false;
        // Extract products from nested data structure
        state.products = action.payload?.data?.products || [];
        state.totalPages = action.payload?.data?.totalPages || 1;
        state.currentPage = action.payload?.data?.currentPage || 1;
      })
      .addCase(adminGetProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE PRODUCT
      .addCase(adminCreateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminCreateProduct.fulfilled, (state, action) => {
        state.loading = false;
        // Extract product from nested response
        const newProduct = action.payload?.data?.product || action.payload?.data;
        if (newProduct) {
          state.products.push(newProduct);
        }
      })
      .addCase(adminCreateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE PRODUCT
      .addCase(adminUpdateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminUpdateProduct.fulfilled, (state, action) => {
        state.loading = false;
        // Extract updated product from nested response
        const updatedProduct = action.payload?.data?.product || action.payload?.data;
        if (updatedProduct) {
          state.products = state.products.map((p) =>
            p._id === updatedProduct._id ? updatedProduct : p
          );
        }
      })
      .addCase(adminUpdateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE PRODUCT
      .addCase(adminDeleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminDeleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (p) => p._id !== action.payload.id
        );
      })
      .addCase(adminDeleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export default AdminProductSlice.reducer;
