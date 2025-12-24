import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  GetAllCategory,
  CreateCategory,
  UpdateCategory,
  DeleteCategory
} from "../../../services/NetworkServices";

/* ======================= THUNKS ======================= */

// Get all categories
export const adminGetCategories = createAsyncThunk(
  "adminCategory/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await GetAllCategory();
      console.log(res, 'ksgdfjllllllllllllllllllllll')
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  }
);

// Create
export const adminCreateCategory = createAsyncThunk(
  "adminCategory/create",
  async (body, { rejectWithValue }) => {
    try {
      const res = await CreateCategory(body);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Create Failed");
    }
  }
);

// Update
export const adminUpdateCategory = createAsyncThunk(
  "adminCategory/update",
  async ({ id, body }, { rejectWithValue }) => {
    try {
      const res = await UpdateCategory(id, body);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Update Failed");
    }
  }
);

// Delete
export const adminDeleteCategory = createAsyncThunk(
  "adminCategory/delete",
  async (id, { rejectWithValue }) => {
    try {
      const res = await DeleteCategory(id);
      // return res.data;
      return id;  // return only id
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Delete Failed");
    }
  }
);


/* ======================= SLICE ======================= */

const adminCategorySlice = createSlice({
  name: "adminCategory",
  initialState: {
    categories: [],
    loading: false,
    error: null
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      // GET
      .addCase(adminGetCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminGetCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.data;
      })
      .addCase(adminGetCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(adminCreateCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload.data);
      })

      // UPDATE
      .addCase(adminUpdateCategory.fulfilled, (state, action) => {
        const updated = action.payload.data;
        state.categories = state.categories.map((cat) =>
          cat._id === updated._id ? updated : cat
        );
      })

      .addCase(adminDeleteCategory.fulfilled, (state, action) => {
        const id = action.payload;
        state.categories = state.categories.filter(cat => cat._id !== id);
      });

  },
});

export default adminCategorySlice.reducer;
