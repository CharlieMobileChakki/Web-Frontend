import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  adminGetAllBookings,
  adminGetBookingCategories,
  adminGetBookingProducts,
} from "../../../store/slices/adminSlice/AdminBookingSlice";
import BookingOrdersTab from "./BookingOrdersTab";
import BookingCategoriesTab from "./BookingCategoriesTab";
import BookingProductsTab from "./BookingProductsTab";
import BookingZonesTab from "./BookingZonesTab";
import { FaSync, FaCalendarCheck, FaLayerGroup, FaBoxOpen, FaMapMarkedAlt } from "react-icons/fa";

const BookingManagement = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("orders");

  const tabs = [
    { id: "orders", label: "Booking Orders", icon: <FaCalendarCheck /> },
    { id: "categories", label: "Categories", icon: <FaLayerGroup /> },
    { id: "products", label: "Products", icon: <FaBoxOpen /> },
    { id: "zones", label: "Zones", icon: <FaMapMarkedAlt /> },
  ];

  const handleRefresh = () => {
    if (activeTab === "orders") dispatch(adminGetAllBookings());
    if (activeTab === "categories") dispatch(adminGetBookingCategories());
    if (activeTab === "products") dispatch(adminGetBookingProducts());
    // zones refresh if implemented
  };

  return (
    <div className="p-4 sm:p-8 bg-[#f8fafc] min-h-screen">
      {/* Header Section */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>

          <p className="text-slate-500 font-medium">
            Manage your service orders, categories, and products from one place.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95 group"
        >
          <FaSync className="group-hover:rotate-180 transition-transform duration-500 text-blue-500" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-white p-1.5 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 mb-8 sticky top-4 z-40 backdrop-blur-md bg-white/90">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2.5 py-4 rounded-[1.75rem] text-sm font-black transition-all duration-300 ${activeTab === tab.id
              ? "bg-[#d13636] text-white shadow-xl shadow-slate-900/20 scale-[1.02]"
              : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              }`}
          >
            <span className={`text-lg ${activeTab === tab.id ? "text-white" : "text-slate-300"}`}>
              {tab.icon}
            </span>
            <span className="hidden sm:inline tracking-wide">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
        {activeTab === "orders" && <BookingOrdersTab />}
        {activeTab === "categories" && <BookingCategoriesTab />}
        {activeTab === "products" && <BookingProductsTab />}
        {activeTab === "zones" && <BookingZonesTab />}
      </div>
    </div>
  );
};

export default BookingManagement;
