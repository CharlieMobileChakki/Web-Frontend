import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    AdminGetAllBanners,
    AdminCreateBanner,
    AdminUpdateBanner,
    AdminDeleteBanner,
} from "../../../services/NetworkServices";

// ================= GET ALL BannerS =================
export const adminGetAllBanners = createAsyncThunk(
    "adminBanner/getAllBanners",
    async (_, { rejectWithValue }) => {
        try {
            const response = await AdminGetAllBanners();
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Failed to fetch Banners"
            );
        }
    }
);

// ================= CREATE Banner =================
export const adminCreateBanner = createAsyncThunk(
    "adminBanner/createBanner",
    async (data, { rejectWithValue, dispatch }) => {
        try {
            const response = await AdminCreateBanner(data);
            dispatch(adminGetAllBanners()); // Refresh list
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Failed to create Banner"
            );
        }
    }
);

// ================= UPDATE Banner =================
export const adminUpdateBanner = createAsyncThunk(
    "adminBanner/updateBanner",
    async ({ id, body }, { rejectWithValue, dispatch }) => {
        try {
            const response = await AdminUpdateBanner(id, body);
            dispatch(adminGetAllBanners()); // Refresh list
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Failed to update Banner"
            );
        }
    }
);

// ================= DELETE Banner =================
export const adminDeleteBanner = createAsyncThunk(
    "adminBanner/deleteBanner",
    async (id, { rejectWithValue, dispatch }) => {
        try {
            const response = await AdminDeleteBanner(id);
            dispatch(adminGetAllBanners()); // Refresh list
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Failed to delete Banner"
            );
        }
    }
);

// ================= SLICE =================
const AdminBannerSlice = createSlice({
    name: "adminBanner",
    initialState: {
        Banners: [],
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
            // GET ALL BannerS
            .addCase(adminGetAllBanners.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminGetAllBanners.fulfilled, (state, action) => {
                state.loading = false;
                state.Banners = action.payload;
            })
            .addCase(adminGetAllBanners.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // CREATE Banner
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

            // UPDATE Banner
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

            // DELETE Banner
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
