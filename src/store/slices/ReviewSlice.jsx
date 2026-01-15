import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    UserCreateReviews,
    UserReviewsAccess,
    UserUpdateReviews,
    UserDeleteReviews,
} from "../../services/NetworkServices";

// ✅ Fetch reviews for a product
export const userreviewsaccess = createAsyncThunk(
    "reviews/userreviewsaccess",
    async (id, { rejectWithValue }) => {
        try {
            const response = await UserReviewsAccess(id);
            // console.log(response, "response review access");
            return response.data.data; // assuming it's an array of reviews
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Something went wrong"
            );
        }
    }
);

// ✅ Create review for a product
export const usercreatereviews = createAsyncThunk(
    "reviews/usercreatereviews",
    async ({ id, reviewData }, { rejectWithValue }) => {
        console.log("response create review")
        try {
            const response = await UserCreateReviews(id, reviewData);
            return { productId: id, review: response.data.data };
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Something went wrong"
            );
        }
    }
);

// ✅ Update review
export const userupdatereviews = createAsyncThunk(
    "reviews/userupdatereviews",
    async ({ id, reviewData }, { rejectWithValue }) => {
        try {
            const response = await UserUpdateReviews(id, reviewData);
            return response.data.data; // updated review object
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Something went wrong"
            );
        }
    }
);

// ✅ Delete review
export const userdeletereviews = createAsyncThunk(
    "reviews/userdeletereviews",
    async (id, { rejectWithValue }) => {
        try {
            await UserDeleteReviews(id);
            return id; // return deleted review ID
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Something went wrong"
            );
        }
    }
);

const ReviewSlice = createSlice({
    name: "reviews",
    initialState: {
        reviewsByProduct: {}, // { [productId]: [reviews] }
        loading: false,
        error: null,
    },
    reducers: {},

    extraReducers: (builder) => {
        builder

            // ✅ Fetch reviews
            .addCase(userreviewsaccess.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userreviewsaccess.fulfilled, (state, action) => {
                state.loading = false;
                const productId = action.meta.arg;
                state.reviewsByProduct[productId] = action.payload || [];
            })
            .addCase(userreviewsaccess.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ✅ Create new review
            .addCase(usercreatereviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(usercreatereviews.fulfilled, (state, action) => {
                state.loading = false;
                const { productId, review } = action.payload;
                if (!state.reviewsByProduct[productId]) {
                    state.reviewsByProduct[productId] = [];
                }
                state.reviewsByProduct[productId].push(review);

            })
            .addCase(usercreatereviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ✅ Update review
            .addCase(userupdatereviews.fulfilled, (state, action) => {
                state.loading = false;
                const updatedReview = action.payload;
                const productId = updatedReview.product; // Assuming backend returns populated product ID or string
                // Cleanest way is to find in all lists, but usually we know the product context
                // For now, iterate over all products
                Object.keys(state.reviewsByProduct).forEach((pId) => {
                    const index = state.reviewsByProduct[pId].findIndex(r => r._id === updatedReview._id);
                    if (index !== -1) {
                        state.reviewsByProduct[pId][index] = updatedReview;
                    }
                });
            })

            // ✅ Delete review
            .addCase(userdeletereviews.fulfilled, (state, action) => {
                state.loading = false;
                const deletedReviewId = action.payload;
                Object.keys(state.reviewsByProduct).forEach((pId) => {
                    state.reviewsByProduct[pId] = state.reviewsByProduct[pId].filter(
                        (r) => r._id !== deletedReviewId
                    );
                });
            });
    },
});

export default ReviewSlice.reducer;
