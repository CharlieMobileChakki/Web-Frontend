import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminUpdateOrderStatus } from "../../../store/slices/adminSlice/AdminOrderSlice";
import { toast } from "react-toastify";

const OrderTable = ({ orders }) => {
    const dispatch = useDispatch();
    const { updateLoading } = useSelector((state) => state.adminOrder);
    const [updatingOrderId, setUpdatingOrderId] = useState(null);

    // Order status options (matching complete API specification)
    const statusOptions = [
        "Processing",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
        "Payment Failed"
    ];

    // Format date helper
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Handle status change
    const handleStatusChange = async (orderId, newStatus) => {
        // Confirm cancellation
        if (newStatus === 'Cancelled') {
            const confirmed = window.confirm(
                'Are you sure you want to cancel this order? This action may not be reversible.'
            );
            if (!confirmed) return;
        }

        setUpdatingOrderId(orderId);
        try {
            const result = await dispatch(adminUpdateOrderStatus({ orderId, status: newStatus })).unwrap();
            toast.success(result.message || "Order status updated successfully!");
        } catch (error) {
            toast.error(error || "Failed to update order status");
        } finally {
            setUpdatingOrderId(null);
        }
    };

    // Get status badge color
    const getStatusColor = (status) => {
        switch (status) {
            case "Processing":
                return "bg-blue-100 text-blue-700";
            case "Shipped":
                return "bg-purple-100 text-purple-700";
            case "Out for Delivery":
                return "bg-yellow-100 text-yellow-700";
            case "Delivered":
                return "bg-green-100 text-green-700";
            case "Cancelled":
                return "bg-red-100 text-red-700";
            case "Payment Failed":
                return "bg-gray-100 text-gray-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="w-full overflow-x-auto border border-gray-300 rounded-lg">
            <table className="min-w-full sm:min-w-[900px] lg:min-w-[1200px] border-collapse">
                <thead>
                    <tr className="bg-gray-100 text-left text-xs sm:text-sm">
                        <th className="p-1 sm:p-2 border">Order ID</th>
                        <th className="p-1 sm:p-2 border hidden md:table-cell">Customer</th>
                        <th className="p-1 sm:p-2 border">Items</th>
                        <th className="p-1 sm:p-2 border hidden lg:table-cell">Payment</th>
                        <th className="p-1 sm:p-2 border">Total</th>
                        <th className="p-1 sm:p-2 border">Status</th>
                        <th className="p-1 sm:p-2 border hidden sm:table-cell">Date</th>
                    </tr>
                </thead>

                <tbody>
                    {orders?.map((order) => (
                        <tr key={order._id} className="text-xs sm:text-sm hover:bg-gray-50">
                            <td className="p-1 sm:p-2 border">
                                <div className="font-mono text-xs">
                                    {order._id.slice(-8)}
                                </div>
                            </td>

                            <td className="p-1 sm:p-2 border hidden md:table-cell">
                                <div className="text-gray-700">
                                    {order.user?.name || order.user || 'N/A'}
                                </div>
                            </td>

                            <td className="p-1 sm:p-2 border">
                                <div className="text-gray-700">
                                    {order.orderItems?.length || 0} item(s)
                                </div>
                            </td>

                            <td className="p-1 sm:p-2 border hidden lg:table-cell">
                                <span className={`px-2 py-1 rounded text-xs ${order.paymentMethod === 'COD'
                                    ? 'bg-orange-100 text-orange-700'
                                    : 'bg-green-100 text-green-700'
                                    }`}>
                                    {order.paymentMethod}
                                </span>
                            </td>

                            <td className="p-1 sm:p-2 border font-semibold">
                                ₹{order.totalPrice}
                            </td>

                            <td className="p-1 sm:p-2 border">
                                <select
                                    value={order.orderStatus}
                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                    disabled={updateLoading && updatingOrderId === order._id}
                                    className={`w-full px-2 py-1 rounded text-xs border cursor-pointer ${getStatusColor(order.orderStatus)} ${updateLoading && updatingOrderId === order._id ? 'opacity-50' : ''
                                        }`}
                                >
                                    {statusOptions.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </td>

                            <td className="p-1 sm:p-2 border text-gray-600 hidden sm:table-cell">
                                {formatDate(order.createdAt)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {orders?.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No orders found
                </div>
            )}
        </div>
    );
};

export default OrderTable;
