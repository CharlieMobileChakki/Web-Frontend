import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    AdminGetAllBanners,
    AdminCreateBanner,
    AdminUpdateBanner,
    AdminDeleteBanner,
} from "../../../services/NetworkServices";

// ================= GET ALL BANNERS =================
export const adminGetAllBanners = createAsyncThunk(
    "adminBanner/getAllBanners",
    async (_, { rejectWithValue }) => {
        try {
            const response = await AdminGetAllBanners();
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Failed to fetch banners"
            );
        }
    }
);

// ================= CREATE BANNER =================
export const adminCreateBanner = createAsyncThunk(
    "adminBanner/createBanner",
    async (data, { rejectWithValue, dispatch }) => {
        try {
            const response = await AdminCreateBanner(data);
            dispatch(adminGetAllBanners()); // Refresh list
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Failed to create banner"
            );
        }
    }
);

// ================= UPDATE BANNER =================
export const adminUpdateBanner = createAsyncThunk(
    "adminBanner/updateBanner",
    async ({ id, body }, { rejectWithValue, dispatch }) => {
        try {
            const response = await AdminUpdateBanner(id, body);
            dispatch(adminGetAllBanners()); // Refresh list
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Failed to update banner"
            );
        }
    }
);

// ================= DELETE BANNER =================
export const adminDeleteBanner = createAsyncThunk(
    "adminBanner/deleteBanner",
    async (id, { rejectWithValue, dispatch }) => {
        try {
            const response = await AdminDeleteBanner(id);
            dispatch(adminGetAllBanners()); // Refresh list
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Failed to delete banner"
            );
        }
    }
);

// ================= SLICE =================
const AdminBannerSlice = createSlice({
    name: "adminBanner",
    initialState: {
        banners: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // GET ALL BANNERS
            .addCase(adminGetAllBanners.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminGetAllBanners.fulfilled, (state, action) => {
                state.loading = false;
                state.banners = action.payload;
            })
            .addCase(adminGetAllBanners.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // CREATE BANNER
            .addCase(adminCreateBanner.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminCreateBanner.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(adminCreateBanner.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // UPDATE BANNER
            .addCase(adminUpdateBanner.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminUpdateBanner.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(adminUpdateBanner.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // DELETE BANNER
            .addCase(adminDeleteBanner.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminDeleteBanner.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(adminDeleteBanner.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError } = AdminBannerSlice.actions;
export default AdminBannerSlice.reducer;
