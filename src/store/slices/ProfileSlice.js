import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UserGetMyProfile, UserUpdateProfile } from "../../services/NetworkServices";
import { updateUser } from "./AuthSlice";
import { setGetLocalData } from "../../services/LocalStorageHelper";

// ==========================
// ✅ 1. Get user profile
// ==========================
export const userGetProfile = createAsyncThunk(
  "profile/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await UserGetMyProfile();
      return res?.data?.data || res?.data?.user;
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
      const updatedProfile = res?.data?.data || res?.data?.user;

      if (updatedProfile) {
        // 🔥 Sync Auth + LocalStorage
        dispatch(updateUser(updatedProfile));
        setGetLocalData("user", updatedProfile);
      }

      return updatedProfile;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to update profile"
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
  reducers: {
    clearProfile: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },
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
          state.data = {
            ...state.data,
            ...action.payload,
          };
        }
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
