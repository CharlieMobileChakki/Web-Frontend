
const Endpoints = {

     // ================= ADMIN CATEGORY =================
     Admin: {



          // login
          ADMINLOGIN: '/api/admin/login',


          // Category CRUD
          ADMINGETCATEGORY: '/api/admin/categories',                 // GET all categories
          ADMINCREATECATEGORY: '/api/admin/categories',              // POST create category
          ADMINUPDATECATEGORY: (id) => `/api/admin/categories/${id}`,// PUT update category
          ADMINDELETECATEGORY: (id) => `/api/admin/categories/${id}`,// DELETE category

          // ================= ADMIN PRODUCTS CRUD =================
          ADMINGETPRODUCTS: '/api/products',                       // GET all products
          ADMINCREATEPRODUCT: '/api/admin/products',                     // POST create product
          ADMINUPDATEPRODUCT: (id) => `/api/admin/products/${id}`,       // PUT update product
          ADMINDELETEPRODUCT: (id) => `/api/admin/products/${id}`,       // DELETE product

          // ================= ADMIN USERS =================
          ADMIN_GET_ALL_USERS: '/api/admin/users/all-users',            // GET all users

          // ================= ADMIN CONTACT =================
          ADMIN_GET_ALL_CONTACTS: '/api/admin/contact',                 // GET all contact submissions

          // ================= ADMIN ORDERS =================
          ADMIN_GET_ALL_ORDERS: '/api/admin/orders/getAllOrders',          // GET all orders
          ADMIN_UPDATE_ORDER_STATUS: (id) => `/api/admin/orders/${id}/status`, // PUT update order status

          // ================= ADMIN MANAGEMENT =================
          ADMIN_GET_ALL_ADMINS: '/api/admin/admins',                    // GET all admins
          ADMIN_CREATE_ADMIN: '/api/admin/admins',                      // POST create admin
          ADMIN_UPDATE_ADMIN: (id) => `/api/admin/admins/${id}`,        // PUT update admin
          ADMIN_DELETE_ADMIN: (id) => `/api/admin/admins/${id}`,        // DELETE admin

          // ================= BLOG MANAGEMENT =================
          ADMIN_GET_ALL_BLOGS: '/api/admin/blogs',                      // GET all blogs
          ADMIN_CREATE_BLOG: '/api/admin/blogs',                        // POST create blog
          ADMIN_UPDATE_BLOG: (id) => `/api/admin/blogs/${id}`,          // PUT update blog
          ADMIN_DELETE_BLOG: (id) => `/api/admin/blogs/${id}`,          // DELETE blog

          // ================= BANNER MANAGEMENT =================
          ADMIN_GET_ALL_BANNERS: '/api/admin/banners',                  // GET all banners
          ADMIN_CREATE_BANNER: '/api/admin/banners',                    // POST create banner
          ADMIN_UPDATE_BANNER: (id) => `/api/admin/banners/${id}`,      // PUT update banner
          ADMIN_DELETE_BANNER: (id) => `/api/admin/banners/${id}`,      // DELETE banner
     },





     // ================= USER CATEGORY =================

     User: {

          // sign up
          SENDOTPSIGNUP: '/api/signup',
          SIGNUPVERIFYOTP: '/api/VerifyOTP',

          // login 
          SENDOTPSIGNIN: '/api/login',
          SIGNINVERIFYOTP: '/api/VerifyOTP',

          //category
          USERGETALLCATEGORY: '/api/categories',

          // products
          USERGETPRODUCT: '/api/products',
          USERGETPRODUCTDETAILS: (id) => `/api/products/${id}`,

          // contact us
          CONTACTUS: '/api/contact',


          // reviews
          USERREVIEWSACCESS: (id) => `/api/reviews/${id}`,
          USERCREATEREVIEWS: (id) => `/api/reviews/${id}`,

          // cart
          USERADDTOCART: '/api/cart/items',
          USERGETCART: '/api/cart',
          USERUPDATEITEMS: (itemId) => `/api/cart/items/${itemId}`,
          USERREMOVEITEMS: (itemId) => `/api/cart/items/${itemId}`,
          USERDELETECART: 'api/cart',


          // order product
          USERORDER: '/api/orders', // post
          USERGETORDER: '/api/orders', // get
          USERORDERBYID: (id) => `/api/orders/${id}`, //GET


          // wishlist apis
          USERADDWISHLIST: '/api/wishlist/add', // Add Item to Wishlist 
          USERREMOVEWISHLIST: '/api/wishlist/remove', // Remove Item from Wishlist 
          USERGETWISHLIST: '/api/wishlist ', //Get All Wishlist Items 


          // booking
          USERCREATEBOOKING: '/api/user/bookings/create', // POST : CREATE BOOKING
          USERCANCELBOOKING: (id) => `/api/user/bookings/cancel/${id}`, // cancel booking
          USERGETBOOKING: (userId) => `/api/user/bookings/my-bookings/${userId} `, // get booking 


          // profile 
          USERGETMYPROFILE: '/api/user/profile', // get my profile
          USERUPDATEMYPROFILE: '/api/user/profile', // update profile
          USERADDNEWADDRESS: '/api/user/profile/address', // add new address
          USERUPDATEADDRESS: (addressId) => `/api/user/profile/address/${addressId}`, // update address
          USERDELETEADDRESS: (addressId) => `/api/user/profile/address/${addressId}`, // delete address
     }

}



export { Endpoints };