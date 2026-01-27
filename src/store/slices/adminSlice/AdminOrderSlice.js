import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AdminGetAllOrders, AdminUpdateOrderStatus, AdminGetOrderLabel } from "../../../services/NetworkServices";

// Async thunk to fetch all orders
export const adminGetAllOrders = createAsyncThunk(
    "adminOrder/getAllOrders",
    async (_, { rejectWithValue }) => {
        try {
            const response = await AdminGetAllOrders();
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch orders"
            );
        }
    }
);

// Async thunk to update order status
export const adminUpdateOrderStatus = createAsyncThunk(
    "adminOrder/updateOrderStatus",
    async ({ orderId, status }, { rejectWithValue }) => {
        try {
            const response = await AdminUpdateOrderStatus(orderId, { status });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update order status"
            );
        }
    }
);



// Get order label by orderId
export const adminGetOrderLabel = createAsyncThunk(
    "admin/getOrderLabel",
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await AdminGetOrderLabel(orderId);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch order label"
            );
        }
    }
)
const adminOrderSlice = createSlice({
    name: "adminOrder",
    initialState: {
        orders: [],
        loading: false,
        error: null,
        updateLoading: false,
        updateError: null,
        label: null,
        labelLoading: false,
        labelError: null,
    },
    reducers: {
        clearUpdateError: (state) => {
            state.updateError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get all orders
            .addCase(adminGetAllOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminGetAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                // API returns { success: true, data: [...orders] }
                state.orders = action.payload.data || [];
            })
            .addCase(adminGetAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update order status
            .addCase(adminUpdateOrderStatus.pending, (state) => {
                state.updateLoading = true;
                state.updateError = null;
            })
            .addCase(adminUpdateOrderStatus.fulfilled, (state, action) => {
                state.updateLoading = false;
                // Update the order in the orders array if it exists
                const index = state.orders.findIndex(
                    (order) => order._id === action.payload.data._id
                );
                if (index !== -1) {
                    state.orders[index] = action.payload.data;
                }
            })
            .addCase(adminUpdateOrderStatus.rejected, (state, action) => {
                state.updateLoading = false;
                state.updateError = action.payload;
            })
            // Get order label
            .addCase(adminGetOrderLabel.pending, (state) => {
                state.labelLoading = true;
                state.labelError = null;
            })
            .addCase(adminGetOrderLabel.fulfilled, (state, action) => {
                state.labelLoading = false;
                state.label = action.payload.label || action.payload;
            })
            .addCase(adminGetOrderLabel.rejected, (state, action) => {
                state.labelLoading = false;
                state.labelError = action.payload;
            });
    },
});

export const { clearUpdateError } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;
