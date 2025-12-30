import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    AdminGetAllContacts,
    AdminGetContactStats,
    AdminGetSingleContact,
    AdminUpdateContactStatus,
    AdminDeleteContact,
} from "../../../services/NetworkServices";

// Async thunk to fetch all contact submissions with pagination
export const adminGetAllContacts = createAsyncThunk(
    "adminContact/getAllContacts",
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await AdminGetAllContacts(params);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch contacts"
            );
        }
    }
);

// Async thunk to fetch contact stats
export const adminGetContactStats = createAsyncThunk(
    "adminContact/getStats",
    async (_, { rejectWithValue }) => {
        try {
            const response = await AdminGetContactStats();
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch stats"
            );
        }
    }
);

// Async thunk to fetch single contact
export const adminGetSingleContact = createAsyncThunk(
    "adminContact/getSingle",
    async (id, { rejectWithValue }) => {
        try {
            const response = await AdminGetSingleContact(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch contact"
            );
        }
    }
);

// Async thunk to update contact status
export const adminUpdateContactStatus = createAsyncThunk(
    "adminContact/updateStatus",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await AdminUpdateContactStatus(id, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update contact"
            );
        }
    }
);

// Async thunk to delete contact
export const adminDeleteContact = createAsyncThunk(
    "adminContact/delete",
    async (id, { rejectWithValue }) => {
        try {
            const response = await AdminDeleteContact(id);
            return { id, ...response.data };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to delete contact"
            );
        }
    }
);

const adminContactSlice = createSlice({
    name: "adminContact",
    initialState: {
        contacts: [],
        selectedContact: null,
        stats: null,
        meta: {
            total: 0,
            page: 1,
            limit: 20,
            totalPages: 1,
        },
        loading: false,
        error: null,
    },
    reducers: {
        clearSelectedContact: (state) => {
            state.selectedContact = null;
        },
    },
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
                state.meta = action.payload.meta || state.meta;
            })
            .addCase(adminGetAllContacts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get contact stats
            .addCase(adminGetContactStats.fulfilled, (state, action) => {
                state.stats = action.payload.data;
            })

            // Get single contact
            .addCase(adminGetSingleContact.pending, (state) => {
                state.loading = true;
            })
            .addCase(adminGetSingleContact.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedContact = action.payload.data;
            })
            .addCase(adminGetSingleContact.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update contact status
            .addCase(adminUpdateContactStatus.fulfilled, (state, action) => {
                const updatedContact = action.payload.data;
                const index = state.contacts.findIndex(c => c._id === updatedContact._id);
                if (index !== -1) {
                    state.contacts[index] = updatedContact;
                }
                if (state.selectedContact?._id === updatedContact._id) {
                    state.selectedContact = updatedContact;
                }
            })

            // Delete contact
            .addCase(adminDeleteContact.fulfilled, (state, action) => {
                state.contacts = state.contacts.filter(c => c._id !== action.payload.id);
                if (state.meta.total > 0) {
                    state.meta.total -= 1;
                }
            });
    },
});

export const { clearSelectedContact } = adminContactSlice.actions;
export default adminContactSlice.reducer;
