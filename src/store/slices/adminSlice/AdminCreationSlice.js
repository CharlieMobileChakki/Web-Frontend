import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    AdminGetAllAdmins,
    AdminCreateAdmin,
    AdminUpdateAdmin,
    AdminDeleteAdmin,
} from "../../../services/NetworkServices";

// ================= GET ALL ADMINS =================
export const adminGetAllAdmins = createAsyncThunk(
    "adminCreation/getAllAdmins",
    async (_, { rejectWithValue }) => {
        try {
            const response = await AdminGetAllAdmins();
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Failed to fetch admins"
            );
        }
    }
);

// ================= CREATE ADMIN =================
export const adminCreateAdmin = createAsyncThunk(
    "adminCreation/createAdmin",
    async (data, { rejectWithValue, dispatch }) => {
        try {
            const response = await AdminCreateAdmin(data);
            dispatch(adminGetAllAdmins()); // Refresh list
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Failed to create admin"
            );
        }
    }
);

// ================= UPDATE ADMIN =================
export const adminUpdateAdmin = createAsyncThunk(
    "adminCreation/updateAdmin",
    async ({ id, body }, { rejectWithValue, dispatch }) => {
        try {
            const response = await AdminUpdateAdmin(id, body);
            dispatch(adminGetAllAdmins()); // Refresh list
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Failed to update admin"
            );
        }
    }
);

// ================= DELETE ADMIN =================
export const adminDeleteAdmin = createAsyncThunk(
    "adminCreation/deleteAdmin",
    async (id, { rejectWithValue, dispatch }) => {
        try {
            const response = await AdminDeleteAdmin(id);
            dispatch(adminGetAllAdmins()); // Refresh list
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Failed to delete admin"
            );
        }
    }
);

// ================= SLICE =================
const AdminCreationSlice = createSlice({
    name: "adminCreation",
    initialState: {
        admins: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // GET ALL ADMINS
            .addCase(adminGetAllAdmins.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminGetAllAdmins.fulfilled, (state, action) => {
                state.loading = false;
                state.admins = action.payload;
            })
            .addCase(adminGetAllAdmins.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // CREATE ADMIN
            .addCase(adminCreateAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminCreateAdmin.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(adminCreateAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // UPDATE ADMIN
            .addCase(adminUpdateAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminUpdateAdmin.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(adminUpdateAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // DELETE ADMIN
            .addCase(adminDeleteAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminDeleteAdmin.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(adminDeleteAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError } = AdminCreationSlice.actions;
export default AdminCreationSlice.reducer;
