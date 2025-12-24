import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UserGetOrder, UserOrder, UserOrderById } from "../../services/NetworkServices";



// post order
export const userorder = createAsyncThunk(
    "order/userorder",
    async (data, { rejectWithValue }) => {
        try {
            const response = await UserOrder(data);
            // console.log(response, "user order postsssssssss")
            return response?.data?.data;

        } catch (error) {
            return rejectWithValue(
                error?.response?.data || "something went wrong"
            )

        }
    }

)



// get order
export const usergetorder = createAsyncThunk(
    "order/usergetorder",
    async (_, { rejectWithValue }) => {
        try {
            const response = await UserGetOrder(); // ✅ use your custom service
            // console.log(response?.data.data, "✅ get order response");
            return response?.data?.data; // assuming backend returns { success, data: [...] }

        } catch (error) {
            return rejectWithValue(
                error?.response?.data || "something went wrong"
            )

        }
    }
)


// get order by id 
export const userorderbyid = createAsyncThunk(
    "order/userorderbyid",
    async (id, { rejectWithValue }) => {
        try {
            const response = await UserOrderById(id);
            // console.log(response,"hgfdfjghdgkjdjhgdkghdkghdgjkgdhgkdfj")
            return response?.data?.data
        } catch (error) {
            return rejectWithValue(
                error?.response?.data || " something went wrong"
            )

        }
    }
)

const OrderSlice = createSlice({
    name: 'order',
    initialState: {
        orderDetails: null, // single order
        orders: [], // all orders list
        loading: false,
        error: null,
    },
    reducers: {},

    extraReducers: (builder) => {
        builder

            // POST: create order
            .addCase(userorder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(userorder.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
                state.error = null;

            })

            .addCase(userorder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Order failed";
            })



            // ✅ GET: all orders
            .addCase(usergetorder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(usergetorder.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(usergetorder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch orders";
            })

            // ✅ GET: order by ID
            .addCase(userorderbyid.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userorderbyid.fulfilled, (state, action) => {
                state.loading = false;
                state.orderDetails = action.payload;
            })
            .addCase(userorderbyid.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch order details";
            });
    }

})


export default OrderSlice.reducer;
