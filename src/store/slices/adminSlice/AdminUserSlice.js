import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AdminGetAllUsers, AdminGetAllAddresses } from "../../../services/NetworkServices";

// Async thunk to fetch all users
export const adminGetAllUsers = createAsyncThunk(
    "adminUser/getAllUsers",
    async (_, { rejectWithValue }) => {
        try {
            const response = await AdminGetAllUsers();
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch users"
            );
        }
    }
);

// Async thunk to fetch all addresses
export const adminGetAllAddresses = createAsyncThunk(
    "adminUser/getAllAddresses",
    async (_, { rejectWithValue }) => {
        try {
            const response = await AdminGetAllAddresses();
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch addresses"
            );
        }
    }
);

const adminUserSlice = createSlice({
    name: "adminUser",
    initialState: {
        users: [],
        addresses: [], // Store all addresses
        loading: false,
        error: null,
        count: 0,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Get all users
            .addCase(adminGetAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminGetAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.data || [];
                state.count = action.payload.count || 0;
            })
            .addCase(adminGetAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get all addresses
            .addCase(adminGetAllAddresses.fulfilled, (state, action) => {
                state.addresses = action.payload.data || [];
            });
    },
});

export default adminUserSlice.reducer;
