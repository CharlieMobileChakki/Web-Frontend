import React, { useEffect } from "react";
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
import { useSearchParams } from "react-router-dom";

const BookingManagement = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  // ✅ URL se activeTab read
  const activeTab = searchParams.get("tab") || "orders";

  // ✅ first time load pe default tab set (optional but recommended)
  useEffect(() => {
    if (!searchParams.get("tab")) {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        params.set("tab", "orders");
        if (!params.get("ordersPage")) params.set("ordersPage", "1");
        return params;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ tab change handler (URL update)
  const handleTabChange = (tabId) => {
    setSearchParams(() => {
      const params = new URLSearchParams();

      // ✅ only keep active tab
      params.set("tab", tabId);

      // ✅ only active tab page param
      if (tabId === "orders") params.set("ordersPage", "1");
      if (tabId === "products") params.set("productsPage", "1");
      if (tabId === "categories") params.set("categoriesPage", "1");
      if (tabId === "zones") params.set("zonesPage", "1");

      return params;
    });
  };

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
            onClick={() => handleTabChange(tab.id)}
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
        {activeTab === "orders" && (
          <BookingOrdersTab
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
        )}
        {activeTab === "categories" && (
          <BookingCategoriesTab
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
        )}
        {activeTab === "products" && (
          <BookingProductsTab
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
        )}
        {activeTab === "zones" && (
          <BookingZonesTab
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
        )}

      </div>
    </div>
  );
};

export default BookingManagement;
