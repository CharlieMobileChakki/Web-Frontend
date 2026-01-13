
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  UserGetMyProfile,
  UserUpdateProfile,
  UserAddNewAddress,
  UserUpdateAddress,
  UserDeleteAddress,
  UserGetAllAddresses,
} from "../../services/NetworkServices";
import { updateUser } from "../slices/AuthSlice";
import { setGetLocalData } from "../../services/LocalStorageHelper";

// Helper to fetch full profile with addresses from separate API
const fetchFullProfile = async () => {
  try {
    const [profileRes, addressesRes] = await Promise.all([
      UserGetMyProfile(),
      UserGetAllAddresses()
    ]);

    // console.log("👤 Profile API Data:", profileRes?.data);
    // console.log("🏠 Addresses API Data:", addressesRes?.data);

    // API Doc: Get All Addresses -> { success: true, data: [...] }
    const addresses = addressesRes?.data?.data || [];

    // API Doc: Get Profile -> { success: true, data: { ... } } (assuming standard)
    // The user didn't provide Profile doc, but usually it's similar.
    const profile = profileRes?.data?.data || profileRes?.data?.user;

    if (profile) {
      profile.addresses = Array.isArray(addresses) ? addresses : [];
      // console.log("✅ Merged Profile with Addresses:", profile);
    }
    return profile;
  } catch (error) {
    // console.error("Error fetching full profile:", error);
    return null;
  }
};

// ==========================
// ✅ 1. Get user profile
// ==========================
export const userGetProfile = createAsyncThunk(
  "profile/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const fullProfile = await fetchFullProfile();
      return fullProfile;
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
      // The update profile API might not return addresses, so we re-fetch essential info or just update fields
      // But safer to just refetch everything to be in sync or merge existing addresses? 
      // Let's assume UpdateProfile returns user object. 
      // To be safe, let's fetch full profile again to sync AuthSlice perfectly.
      const fullProfile = await fetchFullProfile();

      if (fullProfile) {
        // 🔥 Update both Auth & localStorage
        dispatch(updateUser(fullProfile));
        setGetLocalData("user", fullProfile);
      }

      return fullProfile;
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

      // Robust extraction
      const newAddress = res?.data?.data || res?.data?.address || res?.data?.newAddress || res?.data;


      // console.log(newAddress, "addd addresssssssss")
      // Re-fetch complete profile to sync everything
      const fullProfile = await fetchFullProfile();

      if (fullProfile) {
        setGetLocalData("user", fullProfile);
        dispatch(updateUser(fullProfile));
      }

      return fullProfile;
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
      // Separate address API returns { success, message, data: {...updatedAddress} }
      const updatedAddress = res?.data?.data;

      // Re-fetch profile to sync everything
      const fullProfile = await fetchFullProfile();

      if (fullProfile) {
        setGetLocalData("user", fullProfile);
        dispatch(updateUser(fullProfile));
      }

      return fullProfile;
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
      // API returns { message, success, error }

      // Re-fetch profile to get updated user data
      const fullProfile = await fetchFullProfile();

      if (fullProfile) {
        setGetLocalData("user", fullProfile);
        dispatch(updateUser(fullProfile));
      }

      return fullProfile;
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
        if (action.payload) {
          state.data = action.payload;
        }
      })

      // ✅ Update Address
      .addCase(userUpdateAddress.fulfilled, (state, action) => {
        if (action.payload) {
          state.data = action.payload;
        }
      })

      // ✅ Delete Address
      .addCase(userDeleteAddress.fulfilled, (state, action) => {
        if (action.payload) {
          state.data = action.payload;
        }
      });
  },
});

export default profileSlice.reducer;
