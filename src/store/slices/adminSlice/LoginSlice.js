// src/redux/slices/adminSlice/LoginSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AdminLogin } from "../../../services/NetworkServices";
import { clearLocalData } from "../../../services/LocalStorageHelper";

// Admin Login API
export const adminLogin = createAsyncThunk(
  "login/adminlogin",
  async (data, { rejectWithValue }) => {
    try {
      const response = await AdminLogin(data);
      //  if (!response.data || !response.data.token) {
      //       return rejectWithValue("Invalid API response");
      //     }
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Something went wrong"
      );
    }
  }
);

const LoginSlice = createSlice({
  name: "adminAuth",
  initialState: {
    loading: false,
    error: null,
    token: null,
  },

  reducers: {
    logout: (state) => {
      state.token = null;
      clearLocalData();
    },

    // ✅ Manual update (used when profile updates)
    updateUser: (state, action) => {
      const { token } = action.payload;
      state.token = token;



      localStorage.setItem("AdminToken", token); // token string 
      // 🔥 Sync immediately
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.token = action.payload.token;

        localStorage.setItem("AdminToken", action.payload.token); // token string 

      })



      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Show API error
      });
  },
});

export const { logout, updateUser } = LoginSlice.actions;
export default LoginSlice.reducer;
