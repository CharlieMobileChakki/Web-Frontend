import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaBars, FaUserShield, FaChartLine,
  FaTags, FaShoppingBag, FaBoxOpen, FaUsers, FaFileAlt,
  FaImage, FaWarehouse, FaCalendarAlt, FaTruck, FaSignOutAlt, FaEnvelope
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
  { name: "Banner Management", icon: <FaImage />, href: "/bannermanagement" },
  { name: "Stock Management", icon: <FaWarehouse />, href: "/stockmanagement" },
  { name: "Booking Management", icon: <FaCalendarAlt />, href: "/bookingmanagement" },
  { name: "Driver Management", icon: <FaTruck />, href: "/drivermanagement" },
  { name: "Contact Management", icon: <FaEnvelope />, href: "/contactmanagement" },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const location = useLocation();

  return (
    <div
      className={`
        fixed top-0 left-0 h-screen bg-white shadow-lg transition-all duration-300 z-51
        ${isOpen ? "w-64" : "w-16"} 
      `}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b">
        {isOpen && <h3 className="text-lg w-[130px] font-semibold text-blue-500">
          <img src={Logo} alt="logo" className="w-full" />
        </h3>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-700 hover:text-blue-500 cursor-pointer"
        >
          <FaBars size={20} />
        </button>
      </div>

      {/* Sidebar Links */}
      <nav className="mt-4 flex flex-col">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.href}
            className={`flex items-center px-4 py-3 transition 
              ${location.pathname === item.href
                ? "bg-blue-50 text-blue-600"
                : "hover:bg-blue-50 hover:text-blue-600"
              }
            `}
          >
            <span className="text-lg w-6 flex justify-center">{item.icon}</span>
            {isOpen && <span className="ml-3">{item.name}</span>}
          </Link>
        ))}

        {/* Logout Button */}
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="flex items-center px-4 py-3 w-full text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600"
        >
          <span className="text-lg w-6 flex justify-center"><FaSignOutAlt /></span>
          {isOpen && <span className="ml-3">Logout</span>}
        </button>
      </nav>


      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-[#00000070] bg-opacity-40 flex items-center justify-center z-52">
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
                  navigate("/admin");
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
    </div>
  );
};


export default Sidebar;
