import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UserCategory, GetAllCategory } from "../../services/NetworkServices";

// ✅ Async thunk to fetch categories
export const usercategory = createAsyncThunk(
  "categories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await UserCategory();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "something went wrong"
      );
    }
  }
);

// ✅ Async thunk to fetch all categories for admin
export const fetchAdminCategories = createAsyncThunk(
  "categories/fetchAllAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await GetAllCategory();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "something went wrong"
      );
    }
  }
);

const CategorySlice = createSlice({
  name: "categories",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(usercategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(usercategory.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload || [];
      })
      .addCase(usercategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAdminCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload || [];
      })
      .addCase(fetchAdminCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default CategorySlice.reducer;