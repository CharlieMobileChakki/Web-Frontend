import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  kpis: [
    { title: "Total Orders", value: "1254", icon: "FaShoppingCart", color: "bg-blue-500" },
    { title: "Revenue", value: "₹4,56,890", icon: "FaRupeeSign", color: "bg-green-500" },
    { title: "Customers", value: "3,210", icon: "FaUsers", color: "bg-purple-500" },
    { title: "Pending Orders", value: "520", icon: "FaBox", color: "bg-orange-500" },
    { title: "Products", value: "520", icon: "FaBox", color: "bg-orange-500" },
  ],
  salesData: [
    { month: "Jan", sales: 4000 },
    { month: "Feb", sales: 3000 },
    { month: "Mar", sales: 5000 },
    { month: "Apr", sales: 7000 },
  ],
  categoryData: [
    { name: "Atta", value: 400 },
    { name: "Masale", value: 300 },
    { name: "Dals", value: 300 },
    { name: "Oils", value: 200 },
  ],
  customerData: [
    { month: "Jan", customers: 100 },
    { month: "Feb", customers: 200 },
    { month: "Mar", customers: 400 },
    { month: "Apr", customers: 600 },
  ],
  recentOrders: [
    { id: "1001", customer: "Amit Sharma", status: "Pending", amount: 1200, date: "2025-09-01" },
    { id: "1002", customer: "Priya Verma", status: "Shipped", amount: 850, date: "2025-09-02" },
    { id: "1003", customer: "Rahul Kumar", status: "Delivered", amount: 2450, date: "2025-09-03" },
    { id: "1004", customer: "Sneha Patel", status: "Cancelled", amount: 500, date: "2025-09-04" },
  ],
  loading: false,
  error: null,
};

const DashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
});

export default DashboardSlice.reducer;
  