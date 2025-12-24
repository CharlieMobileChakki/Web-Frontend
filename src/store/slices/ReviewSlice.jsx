import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    UserCreateReviews,
    UserReviewsAccess,
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
            });
    },
});

export default ReviewSlice.reducer;
