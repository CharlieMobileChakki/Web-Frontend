import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    adminGetAllReviews,
    adminDeleteReview as deleteReviewAPI,
    adminUpdateReview as updateReviewAPI
} from "../../../services/NetworkServices";

const initialState = {
    reviews: [],
    loading: false,
    updateLoading: false,
    error: null,
};

// ================= THUNKS =================

// Get All Reviews
export const adminGetReviews = createAsyncThunk(
    "adminReview/getReviews",
    async (_, { rejectWithValue }) => {
        try {
            const response = await adminGetAllReviews();
            return response.data; // { success, data: [...] }
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch reviews"
            );
        }
    }
);

// Delete Review
export const adminDeleteReview = createAsyncThunk(
    "adminReview/deleteReview",
    async (reviewId, { rejectWithValue }) => {
        try {
            const response = await deleteReviewAPI(reviewId);
            return { reviewId, message: response.data?.message };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to delete review"
            );
        }
    }
);

// Update Review
export const adminUpdateReview = createAsyncThunk(
    "adminReview/updateReview",
    async ({ reviewId, data }, { rejectWithValue }) => {
        try {
            const response = await updateReviewAPI(reviewId, data);
            return response.data; // { success, data: updatedReview }
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update review"
            );
        }
    }
);

// ================= SLICE =================

const AdminReviewSlice = createSlice({
    name: "adminReview",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Get Reviews
        builder
            .addCase(adminGetReviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminGetReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload.data || [];
            })
            .addCase(adminGetReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Delete Review
        builder
            .addCase(adminDeleteReview.pending, (state) => {
                state.updateLoading = true;
            })
            .addCase(adminDeleteReview.fulfilled, (state, action) => {
                state.updateLoading = false;
                state.reviews = state.reviews.filter(
                    (review) => review._id !== action.payload.reviewId
                );
            })
            .addCase(adminDeleteReview.rejected, (state, action) => {
                state.updateLoading = false;
                state.error = action.payload;
            });

        // Update Review
        builder
            .addCase(adminUpdateReview.pending, (state) => {
                state.updateLoading = true;
            })
            .addCase(adminUpdateReview.fulfilled, (state, action) => {
                state.updateLoading = false;
                const updatedReview = action.payload.data;
                state.reviews = state.reviews.map((review) =>
                    review._id === updatedReview._id ? updatedReview : review
                );
            })
            .addCase(adminUpdateReview.rejected, (state, action) => {
                state.updateLoading = false;
                state.error = action.payload;
            });
    },
});

export default AdminReviewSlice.reducer;
