import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UserProduct, UserProductDetails } from "../../services/NetworkServices";

// ✅ Fetch all products
export const userproduct = createAsyncThunk(
  "products/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await UserProduct();
      return response.data.data.products;
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
      // console.log(response, "Fetched product by ID");
      return response.data.data; // check your backend response key — it's usually 'product'
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
    totalPages: 1, // pagination metadata
    currentPage: 1, // pagination metadata
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
        state.data = action.payload || [];
        // Note: pagination metadata is handled in the thunk
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
