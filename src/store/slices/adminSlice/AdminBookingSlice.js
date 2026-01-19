import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AdminGetAllBookings, AdminGetBookingById, AdminUpdateBookingStatus } from "../../../services/NetworkServices";

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

const adminBookingSlice = createSlice({
    name: "adminBooking",
    initialState: {
        bookings: [],
        selectedBooking: null,
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
            });
    },
});

export const { clearUpdateError, clearSelectedBooking } = adminBookingSlice.actions;
export default adminBookingSlice.reducer;
