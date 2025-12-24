import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UserAddToCart, UserDeleteCart, UserGetCart, UserRemoveItems, UserUpdateItems } from "../../services/NetworkServices";

// 🛒 GET CART ITEMS
// GET /api/cart
export const usergetcart = createAsyncThunk(
    "cart/getcart",
    async (_, { rejectWithValue }) => {
        try {
            const response = await UserGetCart();
            return response.data.data; // Returns full cart object with items, subtotal, totalItems
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Something went wrong while fetching cart"
            );
        }
    }
);

// ➕ ADD TO CART
// POST /api/cart/items
// Requires: productId, variantId, quantity
export const useraddtocart = createAsyncThunk(
    "cart/addtocart",
    async ({ productId, variantId, quantity = 1 }, { rejectWithValue }) => {
        try {
            const response = await UserAddToCart({ productId, variantId, quantity });
            return response.data.data; // Returns updated cart object
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Something went wrong while adding to cart"
            );
        }
    }
);

// 🔁 UPDATE CART ITEM QUANTITY
// PUT /api/cart/items/:itemId
// Updates quantity of a specific cart item
export const userupdateitems = createAsyncThunk(
    "cart/updateitems",
    async ({ itemId, quantity }, { rejectWithValue }) => {
        try {
            const response = await UserUpdateItems(itemId, { quantity });
            return response.data.data; // Returns updated cart object
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Something went wrong while updating item"
            );
        }
    }
);

// 🗑️ REMOVE ITEM FROM CART
// DELETE /api/cart/items/:itemId
export const userremoveitems = createAsyncThunk(
    "cart/removecart",
    async ({ itemId }, { rejectWithValue }) => {
        try {
            const response = await UserRemoveItems(itemId);
            return response.data.data; // Returns updated cart object
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Something went wrong while removing item"
            );
        }
    }
);

// 🗑️ CLEAR CART (DELETE ALL ITEMS)
// DELETE /api/cart
export const userdeletecart = createAsyncThunk(
    "cart/deletecart",
    async (_, { rejectWithValue }) => {
        try {
            const response = await UserDeleteCart();
            return response.data; // Returns success message
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || "Something went wrong while clearing cart"
            );
        }
    }
);

// 🧩 SLICE
const CartSlice = createSlice({
    name: "cart",
    initialState: {
        cart: null, // Full cart object: { _id, user, items[], subtotal, totalItems, createdAt, updatedAt }
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // 🛒 GET CART
            .addCase(usergetcart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(usergetcart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload; // Set full cart object
                state.error = null;
            })
            .addCase(usergetcart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ➕ ADD TO CART
            .addCase(useraddtocart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(useraddtocart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload; // Update with full cart object from API
                state.error = null;
            })
            .addCase(useraddtocart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // 🔁 UPDATE CART ITEM
            .addCase(userupdateitems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userupdateitems.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload; // Update with full cart object from API
                state.error = null;
            })
            .addCase(userupdateitems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // 🗑️ REMOVE ITEM
            .addCase(userremoveitems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userremoveitems.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload; // Update with full cart object from API
                state.error = null;
            })
            .addCase(userremoveitems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // 🗑️ CLEAR CART
            .addCase(userdeletecart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userdeletecart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = null; // Clear cart completely
                state.error = null;
            })
            .addCase(userdeletecart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default CartSlice.reducer;
