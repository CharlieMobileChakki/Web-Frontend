import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    AdminGetStockStats,
    AdminGetLowStock
} from "../../../services/NetworkServices";

// ================== ASYNC THUNKS ==================

// GET STOCK STATS
export const adminGetStockStats = createAsyncThunk(
    "adminStock/getStats",
    async (_, { rejectWithValue }) => {
        try {
            const res = await AdminGetStockStats();
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// GET LOW STOCK PRODUCTS
export const adminGetLowStock = createAsyncThunk(
    "adminStock/getLowStock",
    async (_, { rejectWithValue }) => {
        try {
            const res = await AdminGetLowStock();
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

// ================== SLICE ==================
const AdminStockSlice = createSlice({
    name: "adminStock",
    initialState: {
        stockStats: null,
        lowStockProducts: [],
        lowStockCount: 0,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // GET STOCK STATS
            .addCase(adminGetStockStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminGetStockStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stockStats = action.payload?.overview || null;
                // The API response structure for stats includes lowStockCount
                if (action.payload?.lowStockCount !== undefined) {
                    state.lowStockCount = action.payload.lowStockCount;
                }
            })
            .addCase(adminGetStockStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // GET LOW STOCK PRODUCTS
            .addCase(adminGetLowStock.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminGetLowStock.fulfilled, (state, action) => {
                state.loading = false;
                state.lowStockProducts = action.payload?.products || [];
                // Update count if provided here as well
                if (action.payload?.count !== undefined) {
                    state.lowStockCount = action.payload.count;
                }
            })
            .addCase(adminGetLowStock.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default AdminStockSlice.reducer;
