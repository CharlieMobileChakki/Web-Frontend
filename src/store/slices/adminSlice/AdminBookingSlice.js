import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    AdminGetAllBookings,
    AdminGetBookingById,
    AdminUpdateBookingStatus,
    AdminCreateBookingCategory,
    AdminGetBookingCategories,
    AdminUpdateBookingCategory,
    AdminDeleteBookingCategory,
    AdminCreateBookingProduct,
    AdminGetBookingProducts,
    AdminUpdateBookingProduct,
    AdminDeleteBookingProduct
} from "../../../services/NetworkServices";


// Async thunk to fetch all bookings
export const adminGetAllBookings = createAsyncThunk(
    "adminBooking/getAllBookings",
    async (_, { rejectWithValue }) => {
        try {
            const response = await AdminGetAllBookings();
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch bookings"
            );
        }
    }
);

// Async thunk to fetch booking details by ID
export const adminGetBookingById = createAsyncThunk(
    "adminBooking/getBookingById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await AdminGetBookingById(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch booking details"
            );
        }
    }
);

// Async thunk to update booking status
export const adminUpdateBookingStatus = createAsyncThunk(
    "adminBooking/updateBookingStatus",
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await AdminUpdateBookingStatus(id, status);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update booking status"
            );
        }
    }
);

// ================== BOOKING CATEGORY ASYNC THUNKS ==================

// GET BOOKING CATEGORIES
export const adminGetBookingCategories = createAsyncThunk(
    "adminBooking/getCategories",
    async (_, { rejectWithValue }) => {
        try {
            const response = await AdminGetBookingCategories();
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch booking categories"
            );
        }
    }
);

// CREATE BOOKING CATEGORY
export const adminCreateBookingCategory = createAsyncThunk(
    "adminBooking/createCategory",
    async (data, { rejectWithValue }) => {
        try {
            const response = await AdminCreateBookingCategory(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to create booking category"
            );
        }
    }
);

// UPDATE BOOKING CATEGORY
export const adminUpdateBookingCategory = createAsyncThunk(
    "adminBooking/updateCategory",
    async (payload, { rejectWithValue }) => {
        try {
            // Handle various payload structures: {id, data} or { _id, ...fields }
            const id = payload.id || payload._id || (payload.data && (payload.data.id || payload.data._id));
            const data = payload.data || payload;

            if (!id || id === "undefined" || id === undefined) {
                return rejectWithValue("Failed to update: Category ID is missing or invalid");
            }

            const response = await AdminUpdateBookingCategory(id, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update booking category"
            );
        }
    }
);

// DELETE BOOKING CATEGORY
export const adminDeleteBookingCategory = createAsyncThunk(
    "adminBooking/deleteCategory",
    async (id, { rejectWithValue }) => {
        try {
            const response = await AdminDeleteBookingCategory(id);
            return { id, data: response.data };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to delete booking category"
            );
        }
    }
);

// GET ALL BOOKING PRODUCTS
export const adminGetBookingProducts = createAsyncThunk(
    "adminBooking/getProducts",
    async (_, { rejectWithValue }) => {
        try {
            const response = await AdminGetBookingProducts();
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch booking products"
            );
        }
    }
);

// ================== BOOKING PRODUCT ASYNC THUNKS ==================

// CREATE BOOKING PRODUCT
export const adminCreateBookingProduct = createAsyncThunk(
    "adminBooking/createProduct",
    async (data, { rejectWithValue }) => {
        try {
            const response = await AdminCreateBookingProduct(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to create booking product"
            );
        }
    }
);


// UPDATE BOOKING PRODUCT
export const adminUpdateBookingProduct = createAsyncThunk(
    "adminBooking/updateProduct",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await AdminUpdateBookingProduct(id, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update booking product"
            );
        }
    }
);


// DELETE BOOKING PRODUCT
export const adminDeleteBookingProduct = createAsyncThunk(
    "adminBooking/deleteProduct",
    async (id, { rejectWithValue }) => {
        try {
            const response = await AdminDeleteBookingProduct(id);
            return { id, data: response.data };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to delete booking product"
            );
        }
    }
);

const adminBookingSlice = createSlice({
    name: "adminBooking",
    initialState: {
        bookings: [],
        selectedBooking: null,
        categories: [],
        products: [],
        zones: [],
        loading: false,
        error: null,
        updateLoading: false,
        updateError: null,
    },
    reducers: {
        clearUpdateError: (state) => {
            state.updateError = null;
        },
        clearSelectedBooking: (state) => {
            state.selectedBooking = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get all bookings
            .addCase(adminGetAllBookings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminGetAllBookings.fulfilled, (state, action) => {
                state.loading = false;
                state.bookings = action.payload.data || [];
            })
            .addCase(adminGetAllBookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get booking details
            .addCase(adminGetBookingById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminGetBookingById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedBooking = action.payload.data;
            })
            .addCase(adminGetBookingById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update booking status
            .addCase(adminUpdateBookingStatus.pending, (state) => {
                state.updateLoading = true;
                state.updateError = null;
            })
            .addCase(adminUpdateBookingStatus.fulfilled, (state, action) => {
                state.updateLoading = false;
                const updatedBooking = action.payload.data;
                // Update the booking in the list
                const index = state.bookings.findIndex(
                    (b) => b._id === updatedBooking._id
                );
                if (index !== -1) {
                    // Preserve populated fields if the response has IDs
                    state.bookings[index] = {
                        ...updatedBooking,
                        user: typeof updatedBooking.user === 'string' ? state.bookings[index].user : updatedBooking.user,
                        address: typeof updatedBooking.address === 'string' ? state.bookings[index].address : updatedBooking.address,
                    };
                }
                // Update selected booking if matches
                if (state.selectedBooking && state.selectedBooking._id === updatedBooking._id) {
                    state.selectedBooking = {
                        ...updatedBooking,
                        user: typeof updatedBooking.user === 'string' ? state.selectedBooking.user : updatedBooking.user,
                        address: typeof updatedBooking.address === 'string' ? state.selectedBooking.address : updatedBooking.address,
                    };
                }
            })
            .addCase(adminUpdateBookingStatus.rejected, (state, action) => {
                state.updateLoading = false;
                state.updateError = action.payload;
            })

            // ================== BOOKING CATEGORIES ==================
            // Get booking categories
            .addCase(adminGetBookingCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminGetBookingCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload?.data || [];
            })
            .addCase(adminGetBookingCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create booking category
            .addCase(adminCreateBookingCategory.pending, (state) => {
                state.loading = true;
            })
            .addCase(adminCreateBookingCategory.fulfilled, (state, action) => {
                state.loading = false;
                const newCategory = action.payload?.data;
                if (newCategory) {
                    state.categories.push(newCategory);
                }
            })
            .addCase(adminCreateBookingCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update booking category
            .addCase(adminUpdateBookingCategory.pending, (state) => {
                state.loading = true;
            })
            .addCase(adminUpdateBookingCategory.fulfilled, (state, action) => {
                state.loading = false;
                const updatedCategory = action.payload?.data;
                if (updatedCategory) {
                    state.categories = state.categories.map((c) =>
                        c._id === updatedCategory._id ? updatedCategory : c
                    );
                }
            })
            .addCase(adminUpdateBookingCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete booking category
            .addCase(adminDeleteBookingCategory.pending, (state) => {
                state.loading = true;
            })
            .addCase(adminDeleteBookingCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = state.categories.filter(
                    (c) => c._id !== action.payload.id
                );
            })
            .addCase(adminDeleteBookingCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ================== BOOKING PRODUCTS ==================
            // Get booking products
            .addCase(adminGetBookingProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminGetBookingProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload?.data || [];
            })
            .addCase(adminGetBookingProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create booking product
            .addCase(adminCreateBookingProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(adminCreateBookingProduct.fulfilled, (state, action) => {
                state.loading = false;
                const newProduct = action.payload?.data;
                if (newProduct) {
                    state.products.push(newProduct);
                }
            })
            .addCase(adminCreateBookingProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update booking product
            .addCase(adminUpdateBookingProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(adminUpdateBookingProduct.fulfilled, (state, action) => {
                state.loading = false;
                const updatedProduct = action.payload?.data;
                if (updatedProduct) {
                    state.products = state.products.map((p) =>
                        p._id === updatedProduct._id ? updatedProduct : p
                    );
                }
            })
            .addCase(adminUpdateBookingProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete booking product
            .addCase(adminDeleteBookingProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(adminDeleteBookingProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products = state.products.filter(
                    (p) => p._id !== action.payload.id
                );
            })
            .addCase(adminDeleteBookingProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearUpdateError, clearSelectedBooking } = adminBookingSlice.actions;
export default adminBookingSlice.reducer;
