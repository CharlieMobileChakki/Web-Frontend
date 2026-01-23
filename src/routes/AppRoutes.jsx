


import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "../pages/user/Home/Home";
import Dashboard from "../pages/admin/Dashboard";


import PrivateRoute from "./PrivateRoute";
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";
import SignInUser from "../components/user/SignInUser";
import SignUpUser from "../components/user/SignUpUser";
import AboutUs from "../pages/user/about/AboutUs";
import ContactUs from "../pages/user/ContactUs";
import Blog from "../pages/user/Blog";
import FAQ from "../pages/user/FAQ";
import PrivacyPolicy from "../pages/user/PrivacyPolicy";
import TermsAndConditions from "../pages/user/TermsAndConditions";
import { Services } from "../pages/user/services/Services";
import ReturnsPolicy from "../pages/user/ReturnsPolicy";
import ShippingPolicy from "../pages/user/ShippingPolicy";
import AllProducts from "../pages/user/products/AllProducts";
import ProductDetails from "../pages/user/products/ProductDetails";
import ViewCart from "../pages/user/products/ViewCart";
import Checkout from "../pages/user/orders/Checkout";
import PaymentPage from "../pages/user/orders/PaymentPage";
import OrderSuccess from "../pages/user/orders/OrderSuccess";
import MyOrders from "../pages/user/orders/MyOrders";
import OrderDetails from "../pages/user/orders/OrderDetails";
import MyWishlist from "../pages/user/products/MyWishlist";
import { ProductsByCategory } from "../pages/user/products/ProductsByCategory";
import CreateBooking from "../pages/user/booking/CreateBooking";
import { MyBooking } from "../pages/user/booking/MyBooking";
import MyProfile from "../pages/user/profile/MyProfile";
import AdminLogin from "../pages/admin/AdminLogin";
import CategoryAdmin from "../pages/admin/adminCategory/CategoryAdmin";
import ProductManagement from "../pages/admin/adminProducts/ProductManagement";
import UsersManagement from "../pages/admin/adminUsers/UsersManagement";
import BlogManagement from "../pages/admin/adminBlog/BlogManagement";
import BannerManagment from "../pages/admin/adminBanner/BannerMangement";
import StockManagement from "../pages/admin/adminStock/StockManagement";
import BookingManagement from "../pages/admin/adminBooking/BookingManagement";
import DriverManagement from "../pages/admin/adminDriver/DriverManagement";
import CreateDriver from "../pages/admin/adminDriver/CreateDriver";
import EditDriver from "../pages/admin/adminDriver/EditDriver";
import DriverDetails from "../pages/admin/adminDriver/DriverDetails";
import AdminCreation from "../pages/admin/adminCreation/AdminCreation";
import OrdersManagement from "../pages/admin/adminOrders/OrdersManagement";
import ContactManagement from "../pages/admin/adminContact/ContactManagement";
import ReviewsManagement from "../pages/admin/adminReviews/ReviewsManagement";



const AppRoutes = () => {
  return (
    <Routes>

      {/* 🟢 User Routes */}
      <Route path="/" element={<UserLayout> <Home /> </UserLayout>} />
      <Route path="/blog" element={<UserLayout>   <Blog /> </UserLayout>} />
      <Route path="/aboutus" element={<UserLayout>  <AboutUs /> </UserLayout>} />
      <Route path="/services" element={<UserLayout> <Services /></UserLayout>} />
      <Route path="/contact" element={<UserLayout>  <ContactUs /> </UserLayout>} />
      <Route path="/faq" element={<UserLayout>  <FAQ /> </UserLayout>} />
      <Route path="/privacy" element={<UserLayout>  <PrivacyPolicy /> </UserLayout>} />
      <Route path="/terms" element={<UserLayout>   <TermsAndConditions /> </UserLayout>} />
      <Route path="/returns-policy" element={<UserLayout>   <ReturnsPolicy /> </UserLayout>} />
      <Route path="/shipping-policy" element={<UserLayout>   <ShippingPolicy /> </UserLayout>} />
      <Route path="/allproducts" element={<UserLayout> <AllProducts /> </UserLayout>} />
      <Route path="/products/:id" element={<UserLayout> <ProductDetails /> </UserLayout>} />
      <Route path="/viewcart" element={<UserLayout>  <ViewCart /></UserLayout>} />
      <Route path="/checkout" element={<UserLayout> <Checkout /> </UserLayout>} />
      <Route path="/order-success" element={<UserLayout>  <OrderSuccess /> </UserLayout>} />
      <Route path="/payment-status/:orderId" element={<UserLayout>  <PaymentPage /> </UserLayout>} />
      {/* 🔹 Cashfree Return Route */}
      {/* <Route path="/payment-status" element={<UserLayout>  <OrderSuccess /> </UserLayout>} /> */}
      {/* <Route path="/interface/payment-status" element={<UserLayout>  <OrderSuccess /> </UserLayout>} /> */}
      <Route path="/my-orders" element={<UserLayout>  <MyOrders /> </UserLayout>} />
      <Route path="/orders/:id" element={<UserLayout>  <OrderDetails />  </UserLayout>} />
      <Route path="/mywishlist" element={<UserLayout> <MyWishlist />  </UserLayout>} />
      <Route path="/category/:id" element={<UserLayout> <ProductsByCategory />  </UserLayout>} />
      <Route path="/createbooking" element={<UserLayout> <CreateBooking />   </UserLayout>} />
      <Route path="/my-bookings/:userId" element={<UserLayout> <MyBooking />    </UserLayout>} />
      <Route path="/myprofile" element={<UserLayout> <MyProfile />    </UserLayout>} />





      <Route path="/signin" element={<UserLayout> <SignInUser /> </UserLayout>} />
      <Route path="/signup" element={<UserLayout>  <SignUpUser /> </UserLayout>} />



      {/*  Admin Routes */}
      <Route path="/admin" element={<AdminLogin />} />

      <Route element={<PrivateRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/categorymanagement" element={<CategoryAdmin />} />
          <Route path="/productmanagement" element={<ProductManagement />} />
          <Route path="/ordersmanagement" element={<OrdersManagement />} />
          <Route path="/usersmanagement" element={<UsersManagement />} />
          <Route path="/blogmanagement" element={<BlogManagement />} />
          <Route path="/Bannermanagement" element={<BannerManagment />} />
          <Route path="/stockmanagement" element={<StockManagement />} />
          <Route path="/bookingmanagement" element={<BookingManagement />} />
          <Route path="/drivermanagement" element={<DriverManagement />} />
          <Route path="/drivermanagement/create" element={<CreateDriver />} />
          <Route path="/drivermanagement/edit/:id" element={<EditDriver />} />
          <Route path="/drivermanagement/view/:id" element={<DriverDetails />} />
          <Route path="/admincreation" element={<AdminCreation />} />
          <Route path="/contactmanagement" element={<ContactManagement />} />
          <Route path="/reviewsmanagement" element={<ReviewsManagement />} />

        </Route>
      </Route>


    </Routes>
  );
};

export default AppRoutes;




