import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const HeaderAdmin = ({ user, isOpen, isMobile, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications] = useState([
    { id: 1, message: "New order received", time: "5 min ago", unread: true },
    { id: 2, message: "Product stock low", time: "1 hour ago", unread: true },
    { id: 3, message: "New user registered", time: "2 hours ago", unread: false },
  ]);

  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);

  // Generate breadcrumbs from current path
  const generateBreadcrumbs = () => {
    const paths = location.pathname.split("/").filter(Boolean);
    const breadcrumbs = [{ name: "Dashboard", path: "/admin" }];

    let currentPath = "";
    paths.forEach((path, index) => {
      if (path !== "admin") {
        currentPath += `/${path}`;
        const name = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");
        breadcrumbs.push({ name, path: currentPath });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();
  const unreadCount = notifications.filter(n => n.unread).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Add your logout logic here
    navigate("/admin/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      // Implement search functionality
    }
  };

  return (
    <header
      className={`
        fixed top-0 right-0 bg-gradient-to-r from-white via-gray-50 to-white shadow-lg border-b border-gray-200 flex flex-col z-50
        transition-all duration-300
        ${!isMobile && isOpen ? "left-64" : "left-16"}
      `}
    >
      {/* Main Header Row */}
      <div className="h-16 flex items-center px-4 lg:px-6">
        {/* Mobile Menu Toggle */}
        {isMobile && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="mr-3 p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        {/* Page Title - Desktop */}
        <h1 className="hidden lg:block font-bold text-xl text-gray-800 flex-1">
          {breadcrumbs[breadcrumbs.length - 1]?.name || "Admin Panel"}
        </h1>

        {/* Page Title - Mobile */}
        <h1 className="lg:hidden font-semibold text-lg flex-1 text-gray-800">
          {breadcrumbs[breadcrumbs.length - 1]?.name || "Admin Panel"}
        </h1>

        {/* Right Section */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Search Bar - Desktop */}


          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-red-50 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold shadow-lg">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gradient-to-r from-[#DA352D] to-[#C6363E] text-white font-semibold">
                  Notifications
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-4 py-3 border-b hover:bg-gray-50 transition-colors ${notif.unread ? "bg-red-50" : ""
                        }`}
                    >
                      <p className="text-sm font-medium text-gray-800">{notif.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 bg-gray-50 text-center border-t">
                  <button className="text-sm text-[#DA352D] hover:text-[#C6363E] font-medium">
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Back to Website Link */}
          <Link
            to="/"
            className="hidden sm:flex items-center gap-2 px-3 lg:px-4 py-2 bg-gradient-to-r from-[#DA352D] to-[#C6363E] text-white rounded-lg hover:from-[#C6363E] hover:to-[#B42D25] transition-all duration-300 shadow-md hover:shadow-lg text-sm font-medium"
            title="Back to Website"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="hidden lg:inline">Website</span>
          </Link>

          {/* User Profile Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 lg:gap-3 hover:bg-red-50 rounded-lg p-1 lg:p-2 transition-colors"
            >
              <img
                src={user.image}
                alt="user"
                className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-[#C6A55C] shadow-md"
              />
              <div className="hidden md:block text-left">
                <p className="font-semibold text-sm text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <svg
                className={`hidden md:block w-4 h-4 text-gray-600 transition-transform ${showUserMenu ? "rotate-180" : ""
                  }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b bg-gradient-to-r from-red-50 to-orange-50">
                  <p className="font-semibold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-600">{user.email}</p>
                </div>
                <div className="py-2">
                  <Link
                    to="/admin/profile"
                    className="flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-sm text-gray-700">My Profile</span>
                  </Link>
                  <Link
                    to="/admin/settings"
                    className="flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm text-gray-700">Settings</span>
                  </Link>
                </div>
                <div className="border-t">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2 w-full hover:bg-red-50 transition-colors text-left"
                  >
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="text-sm text-red-600 font-medium">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};


export default HeaderAdmin;
