
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

          // ================= ADMIN CONTACT MANAGEMENT =================
          ADMIN_GET_ALL_CONTACTS: '/api/admin/contact',                 // GET all contact submissions (with pagination)
          ADMIN_GET_CONTACT_STATS: '/api/admin/contact/stats',          // GET contact dashboard stats
          ADMIN_GET_SINGLE_CONTACT: (id) => `/api/admin/contact/${id}`, // GET single contact query
          ADMIN_UPDATE_CONTACT_STATUS: (id) => `/api/admin/contact/${id}`, // PATCH update contact status
          ADMIN_DELETE_CONTACT: (id) => `/api/admin/contact/${id}`,     // DELETE contact query

          // ================= ADMIN ORDERS =================
          ADMIN_GET_ALL_ORDERS: '/api/admin/orders/getAllOrders',          // GET all orders
          ADMIN_UPDATE_ORDER_STATUS: (id) => `/api/admin/orders/${id}/status`, // PUT update order status

          // ================= ADMIN MANAGEMENT =================
          ADMIN_GET_ALL_ADMINS: '/api/admin/get-all-admins',                    // GET all admins
          ADMIN_CREATE_ADMIN: '/api/admin/signup',                      // POST create admin
          ADMIN_UPDATE_ADMIN: (id) => `/api/admin/admins/${id}`,        // PUT update admin
          ADMIN_DELETE_ADMIN: (id) => `/api/admin/admins/${id}`,        // DELETE admin

          // ================= BLOG MANAGEMENT =================
          ADMIN_GET_ALL_BLOGS: '/api/admin/blogs',                      // GET all blogs
          ADMIN_CREATE_BLOG: '/api/admin/blogs',                        // POST create blog
          ADMIN_UPDATE_BLOG: (id) => `/api/admin/blogs/${id}`,          // PUT update blog
          ADMIN_DELETE_BLOG: (id) => `/api/admin/blogs/${id}`,          // DELETE blog

          // ================= Banner MANAGEMENT =================
          ADMIN_GET_ALL_BannerS: '/api/admin/Banners',                  // GET all Banners
          ADMIN_CREATE_Banner: '/api/admin/Banners',                    // POST create Banner
          ADMIN_UPDATE_Banner: (id) => `/api/admin/Banners/${id}`,      // PUT update Banner
          ADMIN_DELETE_Banner: (id) => `/api/admin/Banners/${id}`,      // DELETE Banner

          // ================= DRIVER MANAGEMENT =================
          ADMIN_CREATE_DRIVER: '/api/admin/drivers/create-driver',        // POST create driver
          ADMIN_GET_ALL_DRIVERS: '/api/admin/drivers/get-drivers',        // GET all drivers
          ADMIN_GET_DRIVER_BY_ID: (id) => `/api/admin/drivers/${id}`,     // GET driver by id
          ADMIN_UPDATE_DRIVER: (id) => `/api/admin/drivers/${id}`,        // PUT update driver
          ADMIN_DELETE_DRIVER: (id) => `/api/admin/drivers/${id}`,        // DELETE driver

          // ================= BOOKING MANAGEMENT =================
          ADMIN_GET_ALL_BOOKINGS: '/api/admin/booking/all',          // GET all bookings
          ADMIN_GET_BOOKING_BY_ID: (id) => `/api/admin/booking/${id}`, // GET booking details
          ADMIN_UPDATE_BOOKING_STATUS: (id) => `/api/admin/booking/${id}/status`, // PUT update status

          // ================= STOCK MANAGEMENT =================
          ADMIN_GET_STOCK_STATS: '/api/admin/stock/analytics/stats',    // GET stock stats
          ADMIN_GET_LOW_STOCK: '/api/admin/stock/analytics/low-stock',  // GET low stock products

          // ================= ADDRESS MANAGEMENT =================
          ADMIN_GET_ALL_ADDRESSES: '/api/address/addresses', // GET all addresses


          // ================= ADMIN REVIEWS MANAGEMENT =================
          ADMIN_GET_REVIEWS: '/api/admin/reviews',                  // GET all reviews
          ADMIN_UPDATE_REVIEW: (id) => `/api/admin/reviews/${id}`,  // PUT update review
          ADMIN_DELETE_REVIEW: (id) => `/api/admin/reviews/${id}`,  // DELETE review
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
          USERUPDATEREVIEWS: (id) => `/api/reviews/${id}`,
          // reviews
          USERREVIEWSACCESS: (id) => `/api/reviews/${id}`,
          USERCREATEREVIEWS: (id) => `/api/reviews/${id}`,
          USERUPDATEREVIEWS: (id) => `/api/reviews/${id}`,
          USERDELETEREVIEWS: (id) => `/api/reviews/${id}`,



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
          USERCANCELORDER: (id) => `/api/orders/${id}/cancel`, // PUT cancel order


          // wishlist apis
          USERADDWISHLIST: '/api/wishlist/add', // Add Item to Wishlist 
          USERREMOVEWISHLIST: '/api/wishlist/remove', // Remove Item from Wishlist 
          USERGETWISHLIST: '/api/wishlist', //Get All Wishlist Items 


          // booking
          USERCREATEBOOKING: '/api/booking/create', // POST : CREATE BOOKING
          USERCANCELBOOKING: (id) => `/api/booking/cancel/${id}`, // cancel booking
          USERGETBOOKING: '/api/booking/get-bookings', // get booking 


          // profile 
          USERGETMYPROFILE: '/api/user/profile', // get my profile
          USERUPDATEMYPROFILE: '/api/user/profile', // update profile (supports name only)

          // ================= ADDRESS MANAGEMENT (SEPARATE API) =================
          USERADDNEWADDRESS: '/api/address/addresses', // POST - add new address
          USERGETALLADDRESSES: '/api/address/addresses', // GET - get all addresses
          USERUPDATEADDRESS: (addressId) => `/api/address/addresses/${addressId}`, // PUT - update address
          USERDELETEADDRESS: (addressId) => `/api/address/addresses/${addressId}`, // DELETE - delete address
     }

}



export { Endpoints };