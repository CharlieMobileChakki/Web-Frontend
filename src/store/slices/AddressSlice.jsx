import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    UserGetAllAddresses,
    UserAddNewAddress,
    UserUpdateAddress,
    UserDeleteAddress,
} from "../../services/NetworkServices";

// ==========================
// ✅ Get All Addresses
// ==========================
export const getAllAddresses = createAsyncThunk(
    "address/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await UserGetAllAddresses();
            return res?.data?.data || [];
        } catch (error) {
            return rejectWithValue("Failed to fetch addresses");
        }
    }
);

// ==========================
// ✅ Add Address
// ==========================
export const addAddress = createAsyncThunk(
    "address/add",
    async (payload, { dispatch, rejectWithValue }) => {
        try {
            const res = await UserAddNewAddress(payload);
            const newAddress = res?.data?.data;
            dispatch(getAllAddresses());
            return newAddress;
        } catch (error) {
            return rejectWithValue("Failed to add address");
        }
    }
);

// ==========================
// ✅ Update Address
// ==========================
export const updateAddress = createAsyncThunk(
    "address/update",
    async ({ addressId, payload }, { dispatch, rejectWithValue }) => {
        try {
            const res = await UserUpdateAddress(addressId, payload);
            const updatedAddress = res?.data?.data;
            dispatch(getAllAddresses());
            return updatedAddress;
        } catch (error) {
            return rejectWithValue("Failed to update address");
        }
    }
);

// ==========================
// ✅ Delete Address
// ==========================
export const deleteAddress = createAsyncThunk(
    "address/delete",
    async (addressId, { dispatch, rejectWithValue }) => {
        try {
            await UserDeleteAddress(addressId);
            dispatch(getAllAddresses());
        } catch (error) {
            return rejectWithValue("Failed to delete address");
        }
    }
);

// ==========================
// ✅ Slice
// ==========================
const addressSlice = createSlice({
    name: "address",
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearAddresses: (state) => {
            state.list = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllAddresses.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllAddresses.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(getAllAddresses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearAddresses } = addressSlice.actions;
export default addressSlice.reducer;
