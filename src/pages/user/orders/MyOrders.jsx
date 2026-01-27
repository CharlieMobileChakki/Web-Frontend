import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usergetorder, usercancelorder } from "../../../store/slices/OrderSlice";
import { useNavigate } from "react-router-dom";
import { Package, Clock, CheckCircle, XCircle, Truck, AlertTriangle, ChevronRight, Filter } from "lucide-react";
import { toast } from "react-toastify";
import BackButton from "../../../components/common/BackButton"; // Import BackButton

const MyOrders = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { orders, loading, error } = useSelector((state) => state.order);
    const [filterStatus, setFilterStatus] = useState("All");

    useEffect(() => {
        dispatch(usergetorder());
    }, [dispatch]);

    // const handleCancelOrder = async (orderId) => {
    //     if (window.confirm("Are you sure you want to cancel this order?")) {
    //         try {
    //             await dispatch(usercancelorder(orderId)).unwrap();
    //             toast.success("Order cancelled successfully");
    //             // Refresh orders
    //             dispatch(usergetorder());
    //         } catch (err) {
    //             toast.error(typeof err === 'string' ? err : "Failed to cancel order");
    //         }
    //     }
    // };


    // Filter Logic
    const filteredOrders = Array.isArray(orders) ? orders.filter(order => {
        if (filterStatus === "All") return true;
        // API has 'Processing' for verified orders, but user wants 'Pending' tab to verify functionality.
        // If orderStatus is 'Processing' and filter is 'Pending', should we show it?
        // User asked: "show in all orders pending". We will map active statuses to appropriate tabs or just use API statuses.
        // Let's stick to API statuses but ensure 'Pending' is checking against both if needed, OR just rely on text match.
        // Given 'Pending' is in paymentInfo but 'Processing' is in orderStatus, we'll follow orderStatus.
        return order.orderStatus === filterStatus;
    }) : [];

    const getStatusColor = (status) => {
        switch (status) {
            case "Delivered": return "bg-green-100 text-green-700 border-green-200";
            case "Cancelled": return "bg-red-100 text-red-700 border-red-200";
            case "Shipped": return "bg-purple-100 text-purple-700 border-purple-200";
            case "Out for Delivery": return "bg-indigo-100 text-indigo-700 border-indigo-200";
            case "Processing": return "bg-blue-100 text-blue-700 border-blue-200";
            default: return "bg-yellow-100 text-yellow-800 border-yellow-200";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Delivered": return <CheckCircle size={16} />;
            case "Cancelled": return <XCircle size={16} />;
            case "Shipped": return <Truck size={16} />;
            case "Out for Delivery": return <Truck size={16} />;
            default: return <Clock size={16} />;
        }
    };

    // Tabs for filtering
    const tabs = ["All", "Pending", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];

    if (loading)
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium">Loading your orders...</p>
            </div>
        );

    if (error)
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
                <div className="bg-red-50 p-4 rounded-full mb-4">
                    <AlertTriangle size={32} className="text-red-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h3>
                <p className="text-gray-500 mb-6">{error}</p>
                <button
                    onClick={() => dispatch(usergetorder())}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );

    return (
        <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
                <BackButton />
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                        <p className="text-gray-500 mt-1">Track and manage your recent purchases</p>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="bg-white p-2 rounded-xl shadow-sm mb-6 overflow-x-auto">
                    <div className="flex space-x-2 min-w-max">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilterStatus(tab)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${filterStatus === tab
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orders List */}
                <div className="space-y-6">
                    {filteredOrders?.length > 0 ? (
                        filteredOrders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
                            >
                                {/* Order Header */}
                                <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex flex-wrap gap-4 justify-between items-center">
                                    <div className="flex gap-4 items-center">
                                        <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                                            <Package className="text-blue-600" size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Order ID</p>
                                            <p className="text-gray-900 font-bold font-mono">#{order._id.slice(-8).toUpperCase()}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wide ${getStatusColor(order.orderStatus || 'Pending')}`}>
                                            {getStatusIcon(order.orderStatus || 'Pending')}
                                            <span>{order.orderStatus || "Pending"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Content */}
                                <div className="p-5 md:p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                                        {/* Items Section */}
                                        <div className="md:col-span-2 space-y-4">
                                            {order.orderItems.map((item, idx) => (
                                                <div key={idx} className="flex gap-4 items-start group">
                                                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-gray-900 line-clamp-2 md:text-lg">
                                                            {item.name}
                                                        </h4>
                                                        <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500">
                                                            <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium text-gray-600">Qty: {item.quantity}</span>
                                                            <span>•</span>
                                                            <span className="font-medium text-gray-900">₹{item.price}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Details Sidebar */}
                                        <div className="flex flex-col gap-4 border-t md:border-t-0 md:border-l border-gray-100 md:pl-8 pt-4 md:pt-0">
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Date Placed</p>
                                                <p className="text-sm font-medium text-gray-700">
                                                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Payment</p>
                                                <p className="text-sm font-medium text-gray-700">
                                                    <span
                                                        className={`ml-2 text-xs px-2 py-0.5 rounded-full font-medium
                                                         ${order.paymentStatus === "SUCCESS"
                                                                ? "bg-green-100 text-green-700"
                                                                : order.paymentStatus === "FAILED"
                                                                    ? "bg-red-100 text-red-700"
                                                                    : "bg-yellow-100 text-yellow-700" // Pending or others
                                                            }`}
                                                    >
                                                        {order.paymentStatus || "PENDING"}
                                                    </span>

                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Total Amount</p>
                                                <p className="text-2xl font-bold text-gray-900">₹{order.totalPrice}</p>
                                            </div>

                                            <div className="mt-auto space-y-3 pt-4">
                                                <button
                                                    onClick={() => navigate(`/orders/${order._id}`)}
                                                    className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-gray-800 transition-all active:scale-95"
                                                >
                                                    View Details <ChevronRight size={16} />
                                                </button>

                                                {/* {(order.orderStatus === "Pending" || order.orderStatus === "Processing") && (
                                                    <button
                                                        onClick={() => handleCancelOrder(order._id)}
                                                        className="w-full bg-white border border-red-200 text-red-600 px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-red-50 hover:border-red-300 transition-all active:scale-95"
                                                    >
                                                        Cancel Order
                                                    </button>
                                                )} */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Package className="text-blue-500 opacity-50" size={48} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No orders found</h3>
                            <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                {filterStatus === "All"
                                    ? "Looks like you haven't placed any orders yet."
                                    : `You don't have any ${filterStatus.toLowerCase()} orders.`}
                            </p>
                            <button
                                onClick={() => navigate("/products")}
                                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all hover:-translate-y-1"
                            >
                                Start Shopping
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyOrders;
