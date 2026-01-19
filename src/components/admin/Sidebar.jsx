import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaBars, FaUserShield, FaChartLine,
  FaTags, FaShoppingBag, FaBoxOpen, FaUsers, FaFileAlt,
  FaImage, FaWarehouse, FaCalendarAlt, FaTruck, FaSignOutAlt, FaEnvelope, FaStar
} from "react-icons/fa";

import Logo from "../../assets/adminImg/logo.jpeg";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/adminSlice/LoginSlice";

const menuItems = [
  { name: "Dashboard", icon: <FaChartLine />, href: "/dashboard" },
  { name: "Admin Creation", icon: <FaUserShield />, href: "/admincreation" },
  { name: "Category Management", icon: <FaTags />, href: "/categorymanagement" },
  { name: "Orders Management", icon: <FaShoppingBag />, href: "/ordersmanagement" },
  { name: "Products Management", icon: <FaBoxOpen />, href: "/productmanagement" },
  { name: "Users Management", icon: <FaUsers />, href: "/usersmanagement" },
  { name: "Blog Management", icon: <FaFileAlt />, href: "/blogmanagement" },
  { name: "Banner Management", icon: <FaImage />, href: "/Bannermanagement" },
  { name: "Stock Management", icon: <FaWarehouse />, href: "/stockmanagement" },
  { name: "Booking Management", icon: <FaCalendarAlt />, href: "/bookingmanagement" },
  { name: "Driver Management", icon: <FaTruck />, href: "/drivermanagement" },
  { name: "Contact Management", icon: <FaEnvelope />, href: "/contactmanagement" },
  { name: "Reviews Management", icon: <FaStar />, href: "/reviewsmanagement" },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const location = useLocation();

  return (
    <div
      className={`
        fixed top-0 left-0 h-screen bg-gradient-to-b from-[#1e293b] via-[#334155] to-[#1e293b] shadow-2xl transition-all duration-300 z-51 flex flex-col
        ${isOpen ? "w-64" : "w-16"} 
      `}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700/50 bg-[#0f172a]/50 backdrop-blur-sm">
        {isOpen && (
          <div className="w-[130px] bg-white rounded-lg p-2 shadow-lg">
            <img src={Logo} alt="logo" className="w-full" />
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-300 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-200"
        >
          <FaBars size={20} />
        </button>
      </div>

      {/* Sidebar Links - Scrollable */}
      <nav className="mt-2 flex flex-col flex-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.href}
            className={`flex items-center px-4 py-3 mx-2 my-0.5 rounded-lg transition-all duration-200 group relative
              ${location.pathname === item.href
                ? "bg-gradient-to-r from-[#DA352D] to-[#C6363E] text-white shadow-lg shadow-red-500/50"
                : "text-gray-300 hover:bg-white/10 hover:text-white"
              }
            `}
          >
            {/* Active Indicator */}
            {location.pathname === item.href && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#C6A55C] to-[#B8964F] rounded-r-full"></div>
            )}

            <span className={`text-lg w-6 flex justify-center transition-transform duration-200 ${location.pathname === item.href ? "" : "group-hover:scale-110"}`}>
              {item.icon}
            </span>
            {isOpen && (
              <span className="ml-3 font-medium text-sm whitespace-nowrap">{item.name}</span>
            )}
          </Link>
        ))}
      </nav>

      {/* Logout Button - Fixed at Bottom */}
      <div className="border-t border-gray-700/50 bg-[#0f172a]/50 backdrop-blur-sm">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="flex items-center px-4 py-3 mx-2 my-2 w-[calc(100%-1rem)] text-left text-gray-300 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-all duration-200 group"
        >
          <span className="text-lg w-6 flex justify-center group-hover:scale-110 transition-transform duration-200">
            <FaSignOutAlt />
          </span>
          {isOpen && <span className="ml-3 font-medium text-sm">Logout</span>}
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-[90%] max-w-[350px] transform transition-all">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
              <FaSignOutAlt className="text-red-600 text-xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
              Confirm Logout
            </h3>
            <p className="text-sm text-gray-600 mb-6 text-center">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  dispatch(logout());
                  setShowLogoutConfirm(false);
                  navigate("/admin");
                }}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:from-red-700 hover:to-red-600 transition font-medium shadow-lg shadow-red-500/30"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default Sidebar;
