import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./slices/CategorySlice";
import authReducer from "./slices/AuthSlice";
import productReducer from "./slices/ProductSlice"; // ✅ add product slice
import reviewReducer from "./slices/ReviewSlice"; // ✅ reviews slice
import cartReducer from "./slices/CartSlice"; // ✅ cartReducer slice
import orderReducer from './slices/OrderSlice'; //order reducer slice
import wishlistReducer from './slices/WishlistSlice'; //wishlist reducer slice
import bookingReducer from './slices/BookingSlice'; //booking reducer slice
import profileReducer from './slices/ProfileSlice';


// admin reducer
import adminAuthReducer from './slices/adminSlice/LoginSlice';
import adminCategoryReducer from './slices/adminSlice/AdminCategorySlice';
import adminProductReducer from './slices/adminSlice/AdminProductSlice';
import adminUserReducer from './slices/adminSlice/AdminUserSlice';
import adminContactReducer from './slices/adminSlice/AdminContactSlice';
import adminOrderReducer from './slices/adminSlice/AdminOrderSlice';
import adminCreationReducer from './slices/adminSlice/AdminCreationSlice';
import adminBlogReducer from './slices/adminSlice/AdminBlogSlice';
import adminBannerReducer from './slices/adminSlice/AdminBannerSlice';
import adminBookingReducer from './slices/adminSlice/AdminBookingSlice';
import adminStockReducer from './slices/adminSlice/AdminStockSlice';
import adminReviewReducer from './slices/adminSlice/AdminReviewSlice';


export const Store = configureStore({
  reducer: {

    // user reducers
    categories: categoryReducer,
    auth: authReducer,
    products: productReducer, // ✅ register slice here
    reviews: reviewReducer,
    cart: cartReducer,
    order: orderReducer,
    wishlist: wishlistReducer,
    booking: bookingReducer,
    profile: profileReducer,



    // admin reducer
    adminAuth: adminAuthReducer,
    adminCategory: adminCategoryReducer,
    adminProducts: adminProductReducer,
    adminUser: adminUserReducer,
    adminContact: adminContactReducer,
    adminOrder: adminOrderReducer,
    adminCreation: adminCreationReducer,
    adminBlog: adminBlogReducer,
    adminBanner: adminBannerReducer,
    adminBooking: adminBookingReducer,
    adminStock: adminStockReducer,
    adminReview: adminReviewReducer,

  },
});
