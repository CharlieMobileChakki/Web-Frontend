import React from "react";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  Shipped: "bg-blue-100 text-blue-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

const RecentOrdersTable = ({ orders }) => {
  return (
    <div className="bg-white shadow rounded-lg p-5 overflow-x-auto">
      <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="px-4 py-2">Order ID</th>
            <th className="px-4 py-2">Customer</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr
              key={index}
              className="border-b hover:bg-gray-50 transition duration-150"
            >
              <td className="px-4 py-2 font-medium text-gray-800">
                #{order.id}
              </td>
              <td className="px-4 py-2">{order.customer}</td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    statusColors[order.status] || "bg-gray-100 text-gray-800"
                  }`}
                >
                  {order.status}
                </span>
              </td>
              <td className="px-4 py-2">₹{order.amount}</td>
              <td className="px-4 py-2">{order.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentOrdersTable;
