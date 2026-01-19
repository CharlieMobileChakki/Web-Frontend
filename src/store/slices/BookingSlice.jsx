import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UserCreateBooking, UserCancelBooking, UserGetBooking } from "../../services/NetworkServices";

// ============================
// 1️⃣ Create Booking
// ============================
export const usercreatebooking = createAsyncThunk(
    "booking/createbooking",
    async (data, { rejectWithValue }) => {
        try {
            const response = await UserCreateBooking(data);
            console.log(response, "create booking");
            return response?.data?.data;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data || "Something went wrong while creating booking"
            );
        }
    }
);

// ============================
// 2️⃣ Cancel Booking
// ============================
export const usercancelbooking = createAsyncThunk(
    "booking/cancelbooking",
    async (id, { rejectWithValue }) => {
        try {
            const response = await UserCancelBooking(id);
            console.log(response, "cancel booking");
            return response?.data?.data;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data || "Something went wrong while cancelling booking"
            );
        }
    }
);

// ============================
// 3️⃣ Get All My Bookings
// ============================
export const usergetbookings = createAsyncThunk(
    "booking/getbookings",
    async (_, { rejectWithValue }) => {
        try {
            const response = await UserGetBooking();
            console.log(response, "get my bookings");
            return response?.data?.data;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data || "Something went wrong while fetching bookings"
            );
        }
    }
);

// ============================
// Slice
// ============================
const BookingSlice = createSlice({
    name: "booking",
    initialState: {
        booking: null,        // for single created or cancelled booking
        bookings: [],         // for user’s all bookings
        loading: false,
        error: null,
        success: false,
    },

    reducers: {
        resetBookingState: (state) => {
            state.booking = null;
            state.error = null;
            state.loading = false;
            state.success = false;
        },
    },

    extraReducers: (builder) => {
        builder
            // ✅ Create Booking
            .addCase(usercreatebooking.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(usercreatebooking.fulfilled, (state, action) => {
                state.loading = false;
                state.booking = action.payload;
                state.success = true;
            })
            .addCase(usercreatebooking.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ✅ Cancel Booking
            .addCase(usercancelbooking.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(usercancelbooking.fulfilled, (state, action) => {
                state.loading = false;
                state.booking = action.payload; // Holds the cancelled booking details
                state.success = true;

                // Update the status in the bookings list immediately
                if (state.bookings && state.bookings.length > 0) {
                    const index = state.bookings.findIndex(b => b._id === action.payload._id);
                    if (index !== -1) {
                        state.bookings[index] = action.payload;
                    }
                }
            })
            .addCase(usercancelbooking.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ✅ Get All Bookings
            .addCase(usergetbookings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(usergetbookings.fulfilled, (state, action) => {
                state.loading = false;
                state.bookings = action.payload;
            })
            .addCase(usergetbookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetBookingState } = BookingSlice.actions;
export default BookingSlice.reducer;
