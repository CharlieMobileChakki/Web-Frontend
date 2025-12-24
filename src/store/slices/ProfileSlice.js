
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  UserGetMyProfile,
  UserUpdateProfile,
  UserAddNewAddress,
  UserUpdateAddress,
  UserDeleteAddress,
} from "../../services/NetworkServices";
import { updateUser } from "../slices/AuthSlice";
import { setGetLocalData } from "../../services/LocalStorageHelper";

// ==========================
// ✅ 1. Get user profile
// ==========================
export const userGetProfile = createAsyncThunk(
  "profile/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await UserGetMyProfile();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

// ==========================
// ✅ 2. Update profile
// ==========================
export const userUpdateProfile = createAsyncThunk(
  "profile/update",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const res = await UserUpdateProfile(formData);
      const updatedUser = res?.data?.data;

      if (updatedUser) {
        // 🔥 Update both Auth & localStorage
        dispatch(updateUser(updatedUser));
        setGetLocalData("user", updatedUser);
      }

      return updatedUser;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

// ==========================
// ✅ 3. Add new address
// ==========================
export const userAddAddress = createAsyncThunk(
  "profile/addAddress",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const res = await UserAddNewAddress(payload);
      const newAddress = res?.data?.data;

      // 🧠 After adding, re-fetch updated profile to keep synced
      const updatedProfile = await UserGetMyProfile();
      const updatedUser = updatedProfile?.data?.data;

      if (updatedUser) {
        setGetLocalData("user", updatedUser);
        dispatch(updateUser(updatedUser));
      }

      return newAddress;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to add address"
      );
    }
  }
);

// ==========================
// ✅ 4. Update address
// ==========================
export const userUpdateAddress = createAsyncThunk(
  "profile/updateAddress",
  async ({ addressId, payload }, { dispatch, rejectWithValue }) => {
    try {
      const res = await UserUpdateAddress(addressId, payload);
      const updatedAddress = res?.data?.data;

      // 🧠 Refresh profile to sync everything
      const updatedProfile = await UserGetMyProfile();
      const updatedUser = updatedProfile?.data?.data;

      if (updatedUser) {
        setGetLocalData("user", updatedUser);
        dispatch(updateUser(updatedUser));
      }

      return updatedAddress;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to update address"
      );
    }
  }
);

// ==========================
// ✅ 5. Delete address
// ==========================
export const userDeleteAddress = createAsyncThunk(
  "profile/deleteAddress",
  async (addressId, { dispatch, rejectWithValue }) => {
    try {
      await UserDeleteAddress(addressId);

      // 🧠 Refresh profile again after deletion
      const updatedProfile = await UserGetMyProfile();
      const updatedUser = updatedProfile?.data?.data;

      if (updatedUser) {
        setGetLocalData("user", updatedUser);
        dispatch(updateUser(updatedUser));
      }

      return addressId;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to delete address"
      );
    }
  }
);

// ==========================
// ✅ Slice
// ==========================
const profileSlice = createSlice({
  name: "profile",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ Get Profile
      .addCase(userGetProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userGetProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(userGetProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Update Profile
      .addCase(userUpdateProfile.fulfilled, (state, action) => {
        if (action.payload) {
          state.data = { ...state.data, ...action.payload };
        }
      })

      // ✅ Add Address
      .addCase(userAddAddress.fulfilled, (state, action) => {
        if (state.data?.addresses) {
          state.data.addresses.push(action.payload);
        } else {
          state.data.addresses = [action.payload];
        }
      })

      // ✅ Update Address
      .addCase(userUpdateAddress.fulfilled, (state, action) => {
        if (state.data?.addresses) {
          state.data.addresses = state.data.addresses.map((addr) =>
            addr._id === action.payload._id ? action.payload : addr
          );
        }
      })

      // ✅ Delete Address
      .addCase(userDeleteAddress.fulfilled, (state, action) => {
        if (state.data?.addresses) {
          state.data.addresses = state.data.addresses.filter(
            (addr) => addr._id !== action.payload
          );
        }
      });
  },
});

export default profileSlice.reducer;
