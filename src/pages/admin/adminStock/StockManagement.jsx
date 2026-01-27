import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminGetStockStats, adminGetLowStock } from "../../../store/slices/adminSlice/AdminStockSlice";
import KpiCard from "../../../components/admin/KpiCard";
import { FaBox, FaLayerGroup, FaRupeeSign, FaExclamationTriangle } from "react-icons/fa";

const StockManagement = () => {
  const dispatch = useDispatch();
  const { stockStats, lowStockProducts, lowStockCount, loading } = useSelector((state) => state.adminStock);

  useEffect(() => {
    dispatch(adminGetStockStats());
    dispatch(adminGetLowStock());
  }, [dispatch]);

  const statsData = [
    {
      title: "Total Items",
      value: stockStats?.totalItems || 0,
      icon: <FaBox size={24} />,
      color: "bg-blue-500",
    },
    {
      title: "Total Variants",
      value: stockStats?.totalVariants || 0,
      icon: <FaLayerGroup size={24} />,
      color: "bg-purple-500",
    },
    {
      title: "Purchase Value",
      value: `₹${stockStats?.totalPurchaseValue?.toLocaleString() || 0}`,
      icon: <FaRupeeSign size={24} />,
      color: "bg-green-500",
    },
    {
      title: "Sales Value",
      value: `₹${stockStats?.totalSalesValue?.toLocaleString() || 0}`,
      icon: <FaRupeeSign size={24} />,
      color: "bg-indigo-500",
    },
  ];

  return (
    <div className="p-6">
      {/* <h2 className="mb-6 text-gray-800">Stock Management Analytics</h2> */}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((item, index) => (
          <KpiCard
            key={index}
            title={item.title}
            value={item.value}
            icon={item.icon}
            color={item.color}
          />
        ))}
      </div>

      {/* Low Stock Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-red-100 rounded-full text-red-600">
            <FaExclamationTriangle size={20} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Low Stock Alerts</h3>
            <p className="text-sm text-gray-500">Products currently below the stock threshold</p>
          </div>
          {lowStockCount > 0 && (
            <span className="ml-auto bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold">
              {lowStockCount} Items
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Threshold</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">Loading data...</td>
                </tr>
              ) : lowStockProducts.length > 0 ? (
                lowStockProducts.map((item, index) => (
                  <tr key={item.variant._id || index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 block">
                      {item.variant.nameSuffix || "Default"}
                      <span className="text-xs text-gray-400 block">{item.variant._id?.substring(0, 8)}...</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${item.variant.stock === 0 ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                        }`}>
                        {item.variant.stock} Units
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.variant.lowStockThreshold}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{item.variant.price}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <FaBox className="text-gray-300 mb-2" size={40} />
                      <p>No low stock products found. Great job!</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockManagement;
