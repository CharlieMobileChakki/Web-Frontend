import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  UserAddWishlist,
  UserRemoveWishlist,
  UserGetWishlist,
} from "../../services/NetworkServices";

// ✅ Add to wishlist
export const useraddwishlist = createAsyncThunk(
  "wishlist/addwishlist",
  async (data, { rejectWithValue }) => {
    try {
      const response = await UserAddWishlist(data);
      console.log("✅ Added to wishlist:", response?.data);
      return response?.data?.wishlistItem || response?.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// ❌ Remove from wishlist
export const userremovewishlist = createAsyncThunk(
  "wishlist/removewishlist",
  async ({productId }, { rejectWithValue }) => {
    try {
      const response = await UserRemoveWishlist(productId ); 
       return productId; // return to filter in reducer
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// 📋 Get all wishlist items
export const usergetwishlist = createAsyncThunk(
  "wishlist/getwishlist",
  async (_, { rejectWithValue }) => {
    try {
      const response = await UserGetWishlist();
      console.log("📦 All wishlist items:", response?.data);
      return response?.data?.wishlist || [];
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Something went wrong"
      );
    }
  }
);

// ✅ Slice
const WishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 📥 Add Wishlist
      .addCase(useraddwishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(useraddwishlist.fulfilled, (state, action) => {
        state.loading = false;
        // avoid duplicates
        const exists = state.items.some(
          (item) => item?.productId?._id === action.payload?.productId
        );
        if (!exists) {
          state.items.push(action.payload);
        }
      })
      .addCase(useraddwishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Remove
      .addCase(userremovewishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(userremovewishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(
          (item) => item?.productId?._id !== action.payload
        );
      })
      .addCase(userremovewishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
        
        
      // 📋 Get All Wishlist
      .addCase(usergetwishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(usergetwishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(usergetwishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default WishlistSlice.reducer;
