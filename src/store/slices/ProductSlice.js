import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UserProduct, UserProductDetails } from "../../services/NetworkServices";

// ✅ Fetch all products with filters and pagination
export const userproduct = createAsyncThunk(
  "products/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await UserProduct(params);
      // Return both products and pagination data
      return {
        products: response.data.data.products,
        pagination: response.data.data.pagination
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// ✅ Fetch product by ID
export const userproductbyid = createAsyncThunk(
  "products/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await UserProductDetails(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Something went wrong"
      );
    }
  }
);

const ProductSlice = createSlice({
  name: "products",
  initialState: {
    data: [], // all products
    selectedProduct: null, // single product details
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalProducts: 0,
      limit: 10,
      hasMore: false,
    },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ All products
      .addCase(userproduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userproduct.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.products || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(userproduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Product by ID
      .addCase(userproductbyid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userproductbyid.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload || null;
      })
      .addCase(userproductbyid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default ProductSlice.reducer;
