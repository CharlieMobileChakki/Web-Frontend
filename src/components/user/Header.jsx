import React, { useState, useEffect, useRef } from "react";
import { IoMenu, IoClose } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";
import { NavLink, useNavigate, Link } from "react-router-dom";
import LogoImg from "../../assets/logo.jpeg";
import { useDispatch, useSelector } from "react-redux";
import { logout, updateUser } from "../../store/slices/AuthSlice";
import CartSidebar from "../../components/user/CartSidebar"; // 👈 import new component
import { UserGetMyProfile } from "../../services/NetworkServices";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false); // 👈 cart sidebar toggle
  const [isScrolled, setIsScrolled] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const authRef = useRef(null);
  const { user } = useSelector((state) => state.auth);
  // const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartState = useSelector((state) => state.cart);
  const cartItems = cartState?.cart?.items || [];


  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🏥 Self-healing: Fetch profile if user is logged in but name is missing
  useEffect(() => {
    if (user && !user.name) {
      // console.log("User name missing, fetching profile...");
      UserGetMyProfile()
        .then((res) => {
          if (res?.data?.data) { // Assuming response structure { data: { ...user } } or similar. NetworkServices says `return await api.get`
            // Check structure of UserGetMyProfile response. 
            // Usually it returns { success: true, data: { ...user } }
            // Let's assume res.data.data based on typical pattern.
            console.log("Fetched Profile:", res.data);
            dispatch(updateUser(res.data.data));
          }
        })
        .catch(err => {
          console.error("Failed to fetch profile", err);
        });
    }
  }, [user, dispatch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (authRef.current && !authRef.current.contains(e.target)) {
        setAuthOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "About Us", path: "/aboutus" },
    { name: "Services", path: "/services" },
    { name: "Contact Us", path: "/contact" },
  ];

  // Helper to get initial safely
  const getUserInitial = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.userName) return user.userName.charAt(0).toUpperCase(); // Fallback to userName
    return "?";
  };

  return (
    <>
      <header
        className={`w-full z-50 transition-all duration-300 ${isScrolled
          ? "sticky top-0 left-0 bg-white shadow-md"
          : "relative bg-white"
          }`}
      >
        <div className="container m-auto px-2 sm:px-4">
          <nav className="flex justify-between items-center py-2">
            {/* Logo */}
            <div className="w-[80px] sm:w-[100px] md:w-[130px] flex items-center flex-shrink-0">
              <Link to="/">
                <img src={LogoImg} alt="LOGO" className="w-full h-auto cursor-pointer" />
              </Link>
              {/* <img src={LogoImg} alt="LOGO" className="w-full h-auto" /> */}
            </div>

            {/* Navigation Links + Buttons */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
              {/* NavLinks */}
              <div
                className={`navLinks duration-500 absolute lg:static lg:w-auto w-full lg:h-auto    bg-white flex md:items-center gap-[1.5vw]
                  ${open ? "left-0" : "left-[-100%]"}
                 top-[100%] px-10 lg:py-0 py-5`}
              >

                <ul className="flex lg:flex-row flex-col lg:items-center lg:gap-[2vw] gap-8">
                  {menuItems.map((item) => (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          `relative  after:bg-gradient-to-r from-[#2b68e0] to-[#e710ea]
                                       after:absolute   ${isActive
                            ? "font-bold text-[#DA352D]   px-5 py-2 rounded-lg shadow-md  "
                            : "text-gray-800"
                          }`
                        }
                        onClick={() => setOpen(false)} // mobile menu close on click
                      >
                        {item.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>

              </div>

              {/* 🛒 Cart Icon */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative text-xl sm:text-2xl cursor-pointer text-gray-700 hover:text-[#DA352D] transition p-1 sm:p-2"
              >
                <FaShoppingCart />
                <span className="absolute -top-1 -right-1 bg-[#DA352D] text-white text-xs w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full font-bold">
                  {cartItems?.length || 0}
                </span>
              </button>

              <button
                onClick={() => navigate("/createbooking")}
                className="hidden sm:block bg-[#DA352D] cursor-pointer text-white px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-semibold hover:bg-[#b42d25] transition whitespace-nowrap"
              >
                Book Now
              </button>







              {/* Auth Dropdown / Profile */}
              <div className="relative" ref={authRef}>
                {user ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setAuthOpen(!authOpen)}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#DA352D] text-white font-bold flex items-center justify-center cursor-pointer text-sm sm:text-base"
                    >
                      {getUserInitial()}
                    </button>


                    {authOpen && (
                      <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg w-44 z-10">
                        <div className="border-b p-3 flex justify-between">
                          <p className="   py-2 text-sm text-gray-600 ">
                            👤 My Profile
                          </p>
                          <p className="  py-2 text-sm text-gray-600">
                            {user.name || "User"}
                          </p>

                        </div>

                        <button
                          onClick={() => {
                            navigate("/myprofile"); // ✅ Go to My Profile page
                            setAuthOpen(false);
                          }}
                          className="block w-full cursor-pointer text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                        >
                          View Profile
                        </button>

                        <button
                          onClick={() => {
                            navigate("/my-orders"); // ✅ Go to My Orders page
                            setAuthOpen(false);
                          }}
                          className="block w-full cursor-pointer text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                        >
                          My Orders
                        </button>

                        <button
                          onClick={() => {
                            navigate("/mywishlist"); // ✅ Go to My Profile page
                            setAuthOpen(false);
                          }}
                          className="block w-full cursor-pointer text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                        >
                          My Wishlist
                        </button>

                        <button
                          onClick={() => setShowLogoutConfirm(true)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                        >
                          Logout
                        </button>
                      </div>
                    )}

                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setAuthOpen(!authOpen)}
                      className="cursor-pointer bg-[#DA352D] border-2 border-[#DA352D] font-bold text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm transition-all duration-200 hover:bg-white hover:text-[#DA352D] whitespace-nowrap"
                    >
                      Sign In/Up
                    </button>

                    {authOpen && (
                      <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg w-40 z-10">
                        <button
                          onClick={() => {
                            navigate("/signin");
                            setAuthOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                        >
                          Sign In
                        </button>
                        <button
                          onClick={() => {
                            navigate("/signup");
                            setAuthOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                        >
                          Sign Up
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>


              {/* Mobile Menu Icon */}
              <div
                className="text-2xl sm:text-3xl cursor-pointer lg:hidden p-1"
                onClick={() => setOpen(!open)}
              >
                {open ? <IoClose /> : <IoMenu />}
              </div>
            </div>
          </nav>
        </div>
      </header>
      {/* 🧾 Cart Sidebar */}
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />


      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-[#00000070] bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[300px] text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Logout
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  dispatch(logout());
                  setShowLogoutConfirm(false);
                  navigate("/");
                }}
                className="bg-[#DA352D] text-white px-4 py-2 rounded-md hover:bg-[#b42d25] transition cursor-pointer"
              >
                Yes
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="border border-gray-400 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default Header;

