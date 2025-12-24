import React, { useState } from "react";
import KpiCard from "../../components/admin/KpiCard";
 import { FaShoppingCart, FaUsers, FaBox, FaRupeeSign } from "react-icons/fa";

import SalesOverviewChart from "../../components/admin/SalesOverviewChart";
import CategorySalesPieChart from "../../components/admin/CategorySalesPieChart";
import CustomerGrowthChart from "../../components/admin/CustomerGrowthChart";

import RecentOrdersTable from "../../components/admin/RecentOrdersTable";

const Dashboard = () => { 


  // top card
  const KpiData = [
    {
      title : "Total Orders",
      value: "1254",
       icon: <FaShoppingCart size={24} />,
      color: "bg-blue-500",
    },
     {
      title: "Revenue",
      value: "₹4,56,890",
      icon: <FaRupeeSign size={24} />,
      color: "bg-green-500",
    },
    {
      title: "Customers",
      value: "3,210",
      icon: <FaUsers size={24} />,
      color: "bg-purple-500",
    },
    {
      title: "Pending Orders",
      value: "520",
      icon: <FaBox size={24} />,
      color: "bg-orange-500",
    },

     {
      title: "Products",
      value: "520",
      icon: <FaBox size={24} />,
      color: "bg-orange-500",
    },



  ]



  // graph content
   const salesData = [
    { month: "Jan", sales: 4000 },
    { month: "Feb", sales: 3000 },
    { month: "Mar", sales: 5000 },
    { month: "Apr", sales: 7000 },
  ];

  const categoryData = [
    { name: "Atta", value: 400 },
    { name: "Masale", value: 300 },
    { name: "Dals", value: 300 },
    { name: "Oils", value: 200 },
  ];

  const customerData = [
    { month: "Jan", customers: 100 },
    { month: "Feb", customers: 200 },
    { month: "Mar", customers: 400 },
    { month: "Apr", customers: 600 },
  ];




// Orders 
 const orders = [
    { id: "1001", customer: "Amit Sharma", status: "Pending", amount: 1200, date: "2025-09-01" },
    { id: "1002", customer: "Priya Verma", status: "Shipped", amount: 850, date: "2025-09-02" },
    { id: "1003", customer: "Rahul Kumar", status: "Delivered", amount: 2450, date: "2025-09-03" },
    { id: "1004", customer: "Sneha Patel", status: "Cancelled", amount: 500, date: "2025-09-04" },
  ];




  return (
    
<>
        {/* Dashboard Content */}

        {/* top card */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
      {KpiData.map((item,index) =>(
        <KpiCard 
        key={index}
        title={item.title}
        value={item.value}
        icon={item.icon}
        color={item.color}
        />
      ))}
    </div>





{/* Graph Content */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <SalesOverviewChart data={salesData} type="line" />
      <CategorySalesPieChart data={categoryData} />
      <CustomerGrowthChart data={customerData} /> 
    </div>




{/* Recent Orders Table   */}

<div className="pt-6 pb-6">
      <RecentOrdersTable orders={orders} />
    </div>

</>
 
  );
};

export default Dashboard;
