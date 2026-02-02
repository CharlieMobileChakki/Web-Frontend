
import React from "react";
import api from "./AuthAxios"
import { Endpoints } from "./Endpoints";




//////////// ................ADMIN Api's.............................///////// 
//////////// ................ADMIN Api's.............................///////// 


// LOGIN
export const AdminLogin = async (data) => {
  return await api.post(Endpoints.Admin.ADMINLOGIN, data)
}


// GET ALL CATEGORY
export const GetAllCategory = async () => {
  return await api.get(Endpoints.Admin.ADMINGETCATEGORY);
};

// CREATE CATEGORY
export const CreateCategory = async (data) => {
  return await api.post(Endpoints.Admin.ADMINCREATECATEGORY, data);
};

// UPDATE CATEGORY
export const UpdateCategory = async (id, data) => {
  return await api.put(Endpoints.Admin.ADMINUPDATECATEGORY(id), data);
};

// DELETE CATEGORY
export const DeleteCategory = async (id) => {
  return await api.delete(Endpoints.Admin.ADMINDELETECATEGORY(id));
};



// ================= ADMIN PRODUCTS CRUD =================

// GET ALL PRODUCTS
export const AdminGetProducts = async () => {
  return await api.get(Endpoints.Admin.ADMINGETPRODUCTS);
};

// CREATE PRODUCT
export const AdminCreateProduct = async (data) => {
  return await api.post(Endpoints.Admin.ADMINCREATEPRODUCT, data);
};

// UPDATE PRODUCT
export const AdminUpdateProduct = async (id, data) => {
  return await api.put(Endpoints.Admin.ADMINUPDATEPRODUCT(id), data);
};

// DELETE PRODUCT
export const AdminDeleteProduct = async (id) => {
  return await api.delete(Endpoints.Admin.ADMINDELETEPRODUCT(id));
};


// ================= ADMIN USERS =================

// GET ALL USERS
export const AdminGetAllUsers = async () => {
  return await api.get(Endpoints.Admin.ADMIN_GET_ALL_USERS);
};

// ================= ADMIN CONTACT MANAGEMENT =================

// GET ALL CONTACTS (with pagination and filters)
export const AdminGetAllContacts = async (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const url = queryParams
    ? `${Endpoints.Admin.ADMIN_GET_ALL_CONTACTS}?${queryParams}`
    : Endpoints.Admin.ADMIN_GET_ALL_CONTACTS;
  return await api.get(url);
};

// GET CONTACT STATS
export const AdminGetContactStats = async () => {
  return await api.get(Endpoints.Admin.ADMIN_GET_CONTACT_STATS);
};

// GET SINGLE CONTACT
export const AdminGetSingleContact = async (id) => {
  return await api.get(Endpoints.Admin.ADMIN_GET_SINGLE_CONTACT(id));
};

// UPDATE CONTACT STATUS
export const AdminUpdateContactStatus = async (id, data) => {
  return await api.patch(Endpoints.Admin.ADMIN_UPDATE_CONTACT_STATUS(id), data);
};

// DELETE CONTACT
export const AdminDeleteContact = async (id) => {
  return await api.delete(Endpoints.Admin.ADMIN_DELETE_CONTACT(id));
};

// ================= ADMIN ORDERS =================

// GET ALL ORDERS
export const AdminGetAllOrders = async () => {
  return await api.get(Endpoints.Admin.ADMIN_GET_ALL_ORDERS);
};

// UPDATE ORDER STATUS
export const AdminUpdateOrderStatus = async (id, statusData) => {
  return await api.put(Endpoints.Admin.ADMIN_UPDATE_ORDER_STATUS(id), statusData);
};

// GET ORDER LABEL
export const AdminGetOrderLabel = async (orderId) => {
  return await api.get(Endpoints.Admin.ADMIN_GET_ORDER_LABEL(orderId));
};

// ================= ADMIN MANAGEMENT =================

// GET ALL ADMINS
export const AdminGetAllAdmins = async () => {
  return await api.get(Endpoints.Admin.ADMIN_GET_ALL_ADMINS);
};

// CREATE ADMIN
export const AdminCreateAdmin = async (data) => {
  return await api.post(Endpoints.Admin.ADMIN_CREATE_ADMIN, data);
};

// UPDATE ADMIN
export const AdminUpdateAdmin = async (id, data) => {
  return await api.put(Endpoints.Admin.ADMIN_UPDATE_ADMIN(id), data);
};

// DELETE ADMIN
export const AdminDeleteAdmin = async (id) => {
  return await api.delete(Endpoints.Admin.ADMIN_DELETE_ADMIN(id));
};

// ================= BLOG MANAGEMENT =================

// GET ALL BLOGS
export const AdminGetAllBlogs = async () => {
  return await api.get(Endpoints.Admin.ADMIN_GET_ALL_BLOGS);
};

// CREATE BLOG
export const AdminCreateBlog = async (data) => {
  return await api.post(Endpoints.Admin.ADMIN_CREATE_BLOG, data);
};

// UPDATE BLOG
export const AdminUpdateBlog = async (id, data) => {
  return await api.put(Endpoints.Admin.ADMIN_UPDATE_BLOG(id), data);
};

// DELETE BLOG
export const AdminDeleteBlog = async (id) => {
  return await api.delete(Endpoints.Admin.ADMIN_DELETE_BLOG(id));
};

// ================= Banner MANAGEMENT =================

// GET ALL BannerS
export const AdminGetAllBanners = async () => {
  return await api.get(Endpoints.Admin.ADMIN_GET_ALL_BannerS);
};

// CREATE Banner
export const AdminCreateBanner = async (data) => {
  return await api.post(Endpoints.Admin.ADMIN_CREATE_Banner, data);
};

// UPDATE Banner
export const AdminUpdateBanner = async (id, data) => {
  return await api.put(Endpoints.Admin.ADMIN_UPDATE_Banner(id), data);
};

// DELETE Banner
export const AdminDeleteBanner = async (id) => {
  return await api.delete(Endpoints.Admin.ADMIN_DELETE_Banner(id));
};

// ================= DRIVER MANAGEMENT =================

// CREATE DRIVER
export const AdminCreateDriver = async (data) => {
  return await api.post(Endpoints.Admin.ADMIN_CREATE_DRIVER, data);
};

// GET ALL DRIVERS
export const AdminGetAllDrivers = async () => {
  return await api.get(Endpoints.Admin.ADMIN_GET_ALL_DRIVERS);
};

// GET DRIVER BY ID
export const AdminGetDriverById = async (id) => {
  return await api.get(Endpoints.Admin.ADMIN_GET_DRIVER_BY_ID(id));
};

// UPDATE DRIVER
export const AdminUpdateDriver = async (id, data) => {
  return await api.put(Endpoints.Admin.ADMIN_UPDATE_DRIVER(id), data);
};

// DELETE DRIVER
export const AdminDeleteDriver = async (id) => {
  return await api.delete(Endpoints.Admin.ADMIN_DELETE_DRIVER(id));
};


// ================= ADMIN BOOKING MANAGEMENT =================

// GET ALL BOOKINGS
export const AdminGetAllBookings = async () => {
  return await api.get(Endpoints.Admin.ADMIN_GET_ALL_BOOKINGS);
};

// GET BOOKING DETAILS BY ID
export const AdminGetBookingById = async (id) => {
  return await api.get(Endpoints.Admin.ADMIN_GET_BOOKING_BY_ID(id));
};

// UPDATE BOOKING STATUS
export const AdminUpdateBookingStatus = async (id, status) => {
  return await api.put(Endpoints.Admin.ADMIN_UPDATE_BOOKING_STATUS(id), { status });
};

// ================= BOOKING CATEGORY MANAGEMENT =================

// CREATE BOOKING CATEGORY
export const AdminCreateBookingCategory = async (data) => {
  return await api.post(Endpoints.Admin.ADMIN_CREATE_BOOKING_CATEGORY, data);
};

// GET ALL BOOKING CATEGORIES
export const AdminGetBookingCategories = async () => {
  return await api.get(Endpoints.Admin.ADMIN_GET_BOOKING_CATEGORIES);
};

// UPDATE BOOKING CATEGORY
export const AdminUpdateBookingCategory = async (id, data) => {
  return await api.patch(Endpoints.Admin.ADMIN_UPDATE_BOOKING_CATEGORY(id), data);
};

// DELETE BOOKING CATEGORY
export const AdminDeleteBookingCategory = async (id) => {
  return await api.delete(Endpoints.Admin.ADMIN_DELETE_BOOKING_CATEGORY(id));
};

// GET ALL BOOKING PRODUCTS
export const AdminGetBookingProducts = async () => {
  return await api.get(Endpoints.Admin.ADMIN_GET_BOOKING_PRODUCTS);
};

// ================= BOOKING PRODUCT MANAGEMENT =================

// CREATE BOOKING PRODUCT
export const AdminCreateBookingProduct = async (data) => {
  return await api.post(Endpoints.Admin.ADMIN_CREATE_BOOKING_PRODUCT, data);
};

// UPDATE BOOKING PRODUCT
export const AdminUpdateBookingProduct = async (id, data) => {
  return await api.patch(Endpoints.Admin.ADMIN_UPDATE_BOOKING_PRODUCT(id), data);
};

// DELETE BOOKING PRODUCT
export const AdminDeleteBookingProduct = async (id) => {
  return await api.delete(Endpoints.Admin.ADMIN_DELETE_BOOKING_PRODUCT(id));
};

// ================= ADMIN ADDRESS MANAGEMENT =================

// GET ALL ADDRESSES
export const AdminGetAllAddresses = async () => {
  return await api.get(Endpoints.Admin.ADMIN_GET_ALL_ADDRESSES);
};

// ================= STOCK MANAGEMENT =================

// GET STOCK STATS
export const AdminGetStockStats = async () => {
  return await api.get(Endpoints.Admin.ADMIN_GET_STOCK_STATS);
};

// GET LOW STOCK PRODUCTS
export const AdminGetLowStock = async () => {
  return await api.get(Endpoints.Admin.ADMIN_GET_LOW_STOCK);
};


// .....................USER API'S.......................///////
// .....................USER API'S.......................///////

// ✅ Signup User send otp
export const SignUpUser = async (data) => {
  return await api.post(Endpoints.User.SIGNUPVERIFYOTP, data);
};

// send otp signup
export const sendOtpSignUp = async (data) => {
  return await api.post(Endpoints.User.SENDOTPSIGNUP, data);
}

// ✅ Signin User send otp
export const sendOtpSignIn = async (data) => {
  return await api.post(Endpoints.User.SENDOTPSIGNIN, data);
};

// otp verify signin
export const SignInUser = async (data) => {
  return await api.post(Endpoints.User.SIGNINVERIFYOTP, data);
};


// get all category
export const UserCategory = async (data) => {
  return await api.get(Endpoints.User.USERGETALLCATEGORY);
};

// get all product
export const UserProduct = async () => {
  return await api.get(Endpoints.User.USERGETPRODUCT);
};


// get all products by id
export const UserProductDetails = async (id) => {
  return await api.get(Endpoints.User.USERGETPRODUCTDETAILS(id));
}

// contact us
export const ContactUs = async (data) => {
  return await api.post(Endpoints.User.CONTACTUS, data);
};


// reviews access 
export const UserReviewsAccess = async (id) => {
  return await api.get(Endpoints.User.USERREVIEWSACCESS(id))
}



// create reviews
export const UserCreateReviews = async (id, reviewData) => {
  return await api.post(Endpoints.User.USERCREATEREVIEWS(id), reviewData)
}

// update reviews
export const UserUpdateReviews = async (id, reviewData) => {
  return await api.put(Endpoints.User.USERUPDATEREVIEWS(id), reviewData)
}

// delete reviews
export const UserDeleteReviews = async (id) => {
  return await api.delete(Endpoints.User.USERDELETEREVIEWS(id))
}



// GET CART
export const UserGetCart = async () => {
  return await api.get(Endpoints.User.USERGETCART)
}

// add to cart
export const UserAddToCart = async (data) => {
  return await api.post(Endpoints.User.USERADDTOCART, data)
}


// update items in cart
export const UserUpdateItems = async (itemId, body) => {
  return await api.put(Endpoints.User.USERUPDATEITEMS(itemId), body)
}



// remove items in cart
export const UserRemoveItems = async (itemId) => {
  return await api.delete(Endpoints.User.USERREMOVEITEMS(itemId))
}


// delete cart
export const UserDeleteCart = async (data) => {
  return await api.delete(Endpoints.User.USERDELETECART, data)
}


// POST :  ORDER PRODUCT
export const UserOrder = async (data) => {
  return await api.post(Endpoints.User.USERORDER, data)
}

export const UserPaymentVerify = async (orderId) => {
  return await api.get(Endpoints.User.USERPAYMENTVERIFY(orderId))
}


// get order
export const UserGetOrder = async () => {
  return await api.get(Endpoints.User.USERGETORDER)
}


// get order by id 
export const UserOrderById = async (id) => {
  return await api.get(Endpoints.User.USERORDERBYID(id))
}

// cancel order
export const UserCancelOrder = async (id) => {
  return await api.put(Endpoints.User.USERCANCELORDER(id))
}



// Add Item to Wishlist 
export const UserAddWishlist = async (data) => {
  return await api.post(Endpoints.User.USERADDWISHLIST, data)
}


//Remove Item from Wishlist 
// export const UserRemoveWishlist = async (productId ) => {
//   return await api.delete(Endpoints.User.USERREMOVEWISHLIST,productId)
// }
export const UserRemoveWishlist = async (productId) => {
  return await api.delete(Endpoints.User.USERREMOVEWISHLIST, {
    data: { productId },
  });
};


// Get All Wishlist Items 
export const UserGetWishlist = async () => {
  return await api.get(Endpoints.User.USERGETWISHLIST)
}


// create booking => post
export const UserCreateBooking = async (data) => {
  return await api.post(Endpoints.User.USERCREATEBOOKING, data)
}

// cancel booking
export const UserCancelBooking = async (id) => {
  return await api.patch(Endpoints.User.USERCANCELBOOKING(id))
}


export const UserGetBooking = async () => {
  return await api.get(Endpoints.User.USERGETBOOKING)
}



// GET MY PROFILE
export const UserGetMyProfile = async () => {
  return await api.get(Endpoints.User.USERGETMYPROFILE)
}


// update profile
export const UserUpdateProfile = async (payload) => {
  return await api.put(Endpoints.User.USERUPDATEMYPROFILE, payload)
}

// add new address
export const UserAddNewAddress = async (payload) => {
  console.log("🚀 Payload sending to /api/address/addresses:", payload);
  try {
    const response = await api.post(Endpoints.User.USERADDNEWADDRESS, payload);
    console.log("✅ Response from /api/address/addresses:", response.data);
    return response;
  } catch (error) {
    console.error("❌ Error adding address:", error.response?.data || error.message);
    throw error;
  }
}

// get all addresses
export const UserGetAllAddresses = async () => {
  return await api.get(Endpoints.User.USERGETALLADDRESSES);
};

// update address
export const UserUpdateAddress = async (addressId, payload) => {
  return await api.put(Endpoints.User.USERUPDATEADDRESS(addressId), payload)
}

// delete address 
export const UserDeleteAddress = async (addressId) => {
  return await api.delete(Endpoints.User.USERDELETEADDRESS(addressId))
}





// ================= ADMIN REVIEWS API =================

// Get all reviews
export const adminGetAllReviews = async () => {
  return await api.get(Endpoints.Admin.ADMIN_GET_REVIEWS);
};

// Update review by ID
export const adminUpdateReview = async (reviewId, data) => {
  return await api.put(
    Endpoints.Admin.ADMIN_UPDATE_REVIEW(reviewId),
    data
  );
};

// Delete review by ID
export const adminDeleteReview = async (reviewId) => {
  return await api.delete(
    Endpoints.Admin.ADMIN_DELETE_REVIEW(reviewId)
  );
};



