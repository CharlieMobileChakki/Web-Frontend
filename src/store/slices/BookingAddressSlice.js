import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    CreateBookingAddress,
    GetAllBookingAddresses,
    UpdateBookingAddress,
    DeleteBookingAddress
} from "../../services/NetworkServices";

// ============================
// 1️⃣ Create Booking Address
// ============================
export const createBookingAddress = createAsyncThunk(
    "bookingAddress/create",
    async (data, { rejectWithValue }) => {
        try {
            const response = await CreateBookingAddress(data);
            return response?.data?.data;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data || "Something went wrong while creating booking address"
            );
        }
    }
);

// ============================
// 2️⃣ Get All Booking Addresses
// ============================
export const getAllBookingAddresses = createAsyncThunk(
    "bookingAddress/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await GetAllBookingAddresses();
            return response?.data?.data;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data || "Something went wrong while fetching booking addresses"
            );
        }
    }
);

// ============================
// 3️⃣ Update Booking Address
// ============================
export const updateBookingAddress = createAsyncThunk(
    "bookingAddress/update",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await UpdateBookingAddress(id, data);
            return response?.data?.data;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data || "Something went wrong while updating booking address"
            );
        }
    }
);

// ============================
// 4️⃣ Delete Booking Address
// ============================
export const deleteBookingAddress = createAsyncThunk(
    "bookingAddress/delete",
    async (id, { rejectWithValue }) => {
        try {
            await DeleteBookingAddress(id);
            return id;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data || "Something went wrong while deleting booking address"
            );
        }
    }
);

// Slice
const BookingAddressSlice = createSlice({
    name: "bookingAddress",
    initialState: {
        addresses: [],
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        resetBookingAddressState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // ✅ GetAll
            .addCase(getAllBookingAddresses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllBookingAddresses.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses = action.payload;
            })
            .addCase(getAllBookingAddresses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ✅ Create
            .addCase(createBookingAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createBookingAddress.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses.push(action.payload);
                state.success = true;
            })
            .addCase(createBookingAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            })

            // ✅ Update
            .addCase(updateBookingAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBookingAddress.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.addresses.findIndex((addr) => addr._id === action.payload._id);
                if (index !== -1) {
                    state.addresses[index] = action.payload;
                }
                state.success = true;
            })
            .addCase(updateBookingAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ✅ Delete
            .addCase(deleteBookingAddress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteBookingAddress.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses = state.addresses.filter((addr) => addr._id !== action.payload);
            })
            .addCase(deleteBookingAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetBookingAddressState } = BookingAddressSlice.actions;
export default BookingAddressSlice.reducer;
