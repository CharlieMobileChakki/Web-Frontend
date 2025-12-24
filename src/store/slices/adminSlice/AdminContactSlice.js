import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AdminGetAllContacts } from "../../../services/NetworkServices";

// Async thunk to fetch all contact submissions
export const adminGetAllContacts = createAsyncThunk(
    "adminContact/getAllContacts",
    async (_, { rejectWithValue }) => {
        try {
            const response = await AdminGetAllContacts();
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch contacts"
            );
        }
    }
);

const adminContactSlice = createSlice({
    name: "adminContact",
    initialState: {
        contacts: [],
        loading: false,
        error: null,
        count: 0,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Get all contacts
            .addCase(adminGetAllContacts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminGetAllContacts.fulfilled, (state, action) => {
                state.loading = false;
                state.contacts = action.payload.data || [];
                state.count = action.payload.count || 0;
            })
            .addCase(adminGetAllContacts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default adminContactSlice.reducer;
