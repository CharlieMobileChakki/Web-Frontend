
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

// ================= ADMIN CONTACT =================

// GET ALL CONTACTS
export const AdminGetAllContacts = async () => {
  return await api.get(Endpoints.Admin.ADMIN_GET_ALL_CONTACTS);
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

// ================= BANNER MANAGEMENT =================

// GET ALL BANNERS
export const AdminGetAllBanners = async () => {
  return await api.get(Endpoints.Admin.ADMIN_GET_ALL_BANNERS);
};

// CREATE BANNER
export const AdminCreateBanner = async (data) => {
  return await api.post(Endpoints.Admin.ADMIN_CREATE_BANNER, data);
};

// UPDATE BANNER
export const AdminUpdateBanner = async (id, data) => {
  return await api.put(Endpoints.Admin.ADMIN_UPDATE_BANNER(id), data);
};

// DELETE BANNER
export const AdminDeleteBanner = async (id) => {
  return await api.delete(Endpoints.Admin.ADMIN_DELETE_BANNER(id));
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


// get order
export const UserGetOrder = async () => {
  return await api.get(Endpoints.User.USERGETORDER)
}


// get order by id 
export const UserOrderById = async (id) => {
  return await api.get(Endpoints.User.USERORDERBYID(id))
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
  return await api.put(Endpoints.User.USERCANCELBOOKING(id))
}


export const UserGetBooking = async (userId) => {
  return await api.get(Endpoints.User.USERGETBOOKING(userId))
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
  return await api.post(Endpoints.User.USERADDNEWADDRESS, payload)
}

// update address
export const UserUpdateAddress = async (addressId, payload) => {
  return await api.put(Endpoints.User.USERUPDATEADDRESS(addressId), payload)
}


// delete address 
export const UserDeleteAddress = async (addressId) => {
  return await api.delete(Endpoints.User.USERDELETEADDRESS(addressId))
}

